package com.example.carslocation.Car.dto;

import com.example.carslocation.Car.CarStatus;
import jakarta.validation.constraints.*;

import java.util.UUID;

public record CarRequestDTO(
        @NotBlank String registrationNumber,
        @NotBlank String brand,
        @NotBlank String model,
        @NotNull @Min(1900) Integer productionYear,
        @NotNull @Min(1) Integer seats,
        @NotBlank String transmission,
        @NotBlank String fuelType,
        @NotNull @Min(0) Double dailyBasePrice,
        @NotNull CarStatus status,
        @Min(0) Integer mileage,
        String description,
        @NotNull UUID categoryId
) {}