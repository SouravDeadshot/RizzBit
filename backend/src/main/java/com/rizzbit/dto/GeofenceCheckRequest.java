package com.rizzbit.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeofenceCheckRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Latitude is required")
    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    private Double longitude;
}
