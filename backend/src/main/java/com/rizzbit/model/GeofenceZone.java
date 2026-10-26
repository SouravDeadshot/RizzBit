package com.rizzbit.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "geofence_zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeofenceZone {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    private String description;

    // Type of zone: CAMPUS, FESTIVAL, CAFE, CLUB, EVENT, CUSTOM
    @Column(nullable = false)
    private String zoneType;

    // Center point coordinates
    @Column(nullable = false)
    private Double centerLatitude;

    @Column(nullable = false)
    private Double centerLongitude;

    // Radius in meters if circular zone
    @Column(nullable = false)
    private Double radiusMeters;

    @Builder.Default
    private boolean active = true;

    // Ephemeral expiration (e.g. for weekend festivals or single-evening events)
    private LocalDateTime expiresAt;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
