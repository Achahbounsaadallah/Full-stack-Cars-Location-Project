package com.example.carslocation.Car.CarAvailability.dto;

import com.example.carslocation.Car.CarStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public record BlockCarRequestDTO(
        @NotNull UUID carId,
        @NotNull LocalDateTime startDate,
        @NotNull LocalDateTime endDate,
        @NotNull CarStatus status,
        String reason
) {}
