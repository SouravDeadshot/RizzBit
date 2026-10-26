package com.rizzbit.controller;

import com.rizzbit.dto.GeofenceCheckRequest;
import com.rizzbit.model.GeofenceZone;
import com.rizzbit.service.GeofenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/geofences")
@RequiredArgsConstructor
public class GeofenceController {

    private final GeofenceService geofenceService;

    /**
     * Get all currently active geofenced hotspots / venues.
     */
    @GetMapping("/active")
    public ResponseEntity<List<GeofenceZone>> getActiveGeofences() {
        return ResponseEntity.ok(geofenceService.getActiveZones());
    }

    /**
     * Check which active geofences the user is currently inside.
     */
    @PostMapping("/check-in")
    public ResponseEntity<Map<String, Object>> checkIn(@Valid @RequestBody GeofenceCheckRequest request) {
        List<GeofenceZone> zones = geofenceService.findZonesContainingPoint(
                request.getLatitude(),
                request.getLongitude()
        );

        return ResponseEntity.ok(Map.of(
                "userId", request.getUserId(),
                "insideGeofencesCount", zones.size(),
                "matchedZones", zones
        ));
    }
}
