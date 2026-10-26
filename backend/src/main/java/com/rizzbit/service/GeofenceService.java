package com.rizzbit.service;

import com.rizzbit.model.GeofenceZone;
import com.rizzbit.repository.GeofenceZoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeofenceService {

    private final GeofenceZoneRepository geofenceZoneRepository;
    private static final double EARTH_RADIUS_METERS = 6371000.0;

    /**
     * Retrieve all currently active geofence zones.
     */
    public List<GeofenceZone> getActiveZones() {
        LocalDateTime now = LocalDateTime.now();
        return geofenceZoneRepository.findByActiveTrue().stream()
                .filter(zone -> zone.getExpiresAt() == null || zone.getExpiresAt().isAfter(now))
                .collect(Collectors.toList());
    }

    /**
     * Determine which geofenced zones (festivals, campuses, bars) a user is currently inside.
     */
    public List<GeofenceZone> findZonesContainingPoint(double latitude, double longitude) {
        return getActiveZones().stream()
                .filter(zone -> isInsideCircle(latitude, longitude, zone.getCenterLatitude(), zone.getCenterLongitude(), zone.getRadiusMeters()))
                .collect(Collectors.toList());
    }

    /**
     * Haversine formula for fast, accurate spherical distance calculation.
     */
    private boolean isInsideCircle(double userLat, double userLon, double centerLat, double centerLon, double radiusMeters) {
        double dLat = Math.toRadians(centerLat - userLat);
        double dLon = Math.toRadians(centerLon - userLon);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(userLat)) * Math.cos(Math.toRadians(centerLat))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = EARTH_RADIUS_METERS * c;

        return distance <= radiusMeters;
    }
}
