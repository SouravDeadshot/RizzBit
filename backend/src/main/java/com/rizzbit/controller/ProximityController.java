package com.rizzbit.controller;

import com.rizzbit.dto.LocationPingRequest;
import com.rizzbit.dto.NearbyUserResponse;
import com.rizzbit.service.ProximityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/proximity")
@RequiredArgsConstructor
public class ProximityController {

    private final ProximityService proximityService;

    /**
     * Heartbeat endpoint: Client sends current location ping periodically.
     */
    @PostMapping("/ping")
    public ResponseEntity<Map<String, Object>> pingLocation(@Valid @RequestBody LocationPingRequest request) {
        proximityService.processLocationPing(request);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", request.isGhostMode() ? "Ghost mode enabled" : "Location updated",
                "timestamp", System.currentTimeMillis()
        ));
    }

    /**
     * Proximity Radar: Discover users near the requesting user.
     */
    @GetMapping("/radar")
    public ResponseEntity<List<NearbyUserResponse>> getNearbyUsers(
            @RequestParam("userId") String userId,
            @RequestParam(value = "radiusMeters", required = false) Double radiusMeters) {
        
        List<NearbyUserResponse> nearbyUsers = proximityService.findNearbyUsers(userId, radiusMeters);
        return ResponseEntity.ok(nearbyUsers);
    }
}
