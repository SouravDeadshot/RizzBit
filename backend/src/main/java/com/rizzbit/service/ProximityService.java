package com.rizzbit.service;

import com.rizzbit.dto.LocationPingRequest;
import com.rizzbit.dto.NearbyUserResponse;
import com.rizzbit.model.UserProfile;
import com.rizzbit.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.connection.RedisGeoCommands;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.domain.geo.Metrics;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProximityService {

    private static final String GEO_KEY = "rizzbit:active_locations";
    private static final String LAST_SEEN_KEY_PREFIX = "rizzbit:last_seen:";

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserProfileRepository userProfileRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${rizzbit.proximity.default-radius-meters:1000.0}")
    private double defaultRadiusMeters;

    @Value("${rizzbit.proximity.max-radius-meters:10000.0}")
    private double maxRadiusMeters;

    /**
     * Ingest a real-time GPS heartbeat from an active mobile user.
     * Uses Redis GEOADD for sub-millisecond in-memory location updates.
     */
    public void processLocationPing(LocationPingRequest request) {
        String userId = request.getUserId();

        // If user activated Ghost Mode, remove them from the public proximity index immediately
        if (request.isGhostMode()) {
            redisTemplate.opsForGeo().remove(GEO_KEY, userId);
            log.info("User {} activated Ghost Mode. Location removed from radar.", userId);
            return;
        }

        // Store geospatial point in Redis (Longitude first, then Latitude)
        Point locationPoint = new Point(request.getLongitude(), request.getLatitude());
        redisTemplate.opsForGeo().add(GEO_KEY, locationPoint, userId);

        // Record last-seen timestamp
        long now = System.currentTimeMillis();
        redisTemplate.opsForValue().set(LAST_SEEN_KEY_PREFIX + userId, String.valueOf(now));

        log.debug("Updated location for user {} at ({}, {})", userId, request.getLatitude(), request.getLongitude());
    }

    /**
     * Discover nearby users within an adjustable radius using Redis GEOSEARCH.
     */
    public List<NearbyUserResponse> findNearbyUsers(String userId, Double requestedRadiusMeters) {
        double radius = (requestedRadiusMeters != null && requestedRadiusMeters > 0)
                ? Math.min(requestedRadiusMeters, maxRadiusMeters)
                : defaultRadiusMeters;

        // Perform Redis geospatial query centered on the requesting user
        Circle searchArea = new Circle(new Point(0, 0), new Distance(radius, Metrics.METERS));
        
        RedisGeoCommands.GeoRadiusCommandArgs args = RedisGeoCommands.GeoRadiusCommandArgs
                .newGeoRadiusArgs()
                .includeDistance()
                .sortAscending();

        GeoResults<RedisGeoCommands.GeoLocation<Object>> results = redisTemplate.opsForGeo()
                .radius(GEO_KEY, userId, new Distance(radius, Metrics.METERS), args);

        List<NearbyUserResponse> nearbyUsers = new ArrayList<>();

        if (results == null) {
            return nearbyUsers;
        }

        results.forEach(result -> {
            String candidateUserId = (String) result.getContent().getName();
            
            // Exclude self from radar results
            if (candidateUserId.equals(userId)) {
                return;
            }

            double distanceMeters = result.getDistance().getValue();

            // Fetch profile details (in production, cached in Redis)
            Optional<UserProfile> profileOpt = userProfileRepository.findById(candidateUserId);
            
            NearbyUserResponse.NearbyUserResponseBuilder builder = NearbyUserResponse.builder()
                    .userId(candidateUserId)
                    .distanceMeters(Math.round(distanceMeters * 10.0) / 10.0)
                    .distanceBand(calculateDistanceBand(distanceMeters));

            if (profileOpt.isPresent()) {
                UserProfile profile = profileOpt.get();
                if (profile.isGhostMode()) {
                    return; // Skip if user turned on ghost mode
                }
                builder.displayName(profile.getDisplayName())
                       .age(profile.getAge())
                       .bio(profile.getBio())
                       .avatarUrl(profile.getAvatarUrl());
            } else {
                builder.displayName("User " + candidateUserId.substring(0, Math.min(6, candidateUserId.length())));
            }

            nearbyUsers.add(builder.build());
        });

        return nearbyUsers;
    }

    /**
     * Privacy-preserving distance categorizer to prevent exact triangulation.
     */
    private String calculateDistanceBand(double meters) {
        if (meters <= 50) return "Right Here (< 50m)";
        if (meters <= 150) return "In Your Vicinity (< 150m)";
        if (meters <= 500) return "A Short Walk (< 500m)";
        if (meters <= 1000) return "Within 1 km";
        return String.format("%.1f km away", meters / 1000.0);
    }
}
