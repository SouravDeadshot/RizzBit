package com.rizzbit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NearbyUserResponse {

    private String userId;
    private String displayName;
    private Integer age;
    private String avatarUrl;
    private String bio;

    // Distance in meters from the querying user
    private Double distanceMeters;

    // Human-friendly privacy band (e.g., "Very Close (< 100m)", "Within 500m")
    private String distanceBand;

    // Geofence / Hotspot name if both users are inside a common venue
    private String activeVenueName;

    private Long lastSeenTimestamp;
}
