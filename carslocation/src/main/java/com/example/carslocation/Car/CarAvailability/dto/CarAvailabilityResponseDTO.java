package com.example.carslocation.Car.CarAvailability.dto;

import com.example.carslocation.Car.CarStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record CarAvailabilityResponseDTO(
        UUID id,
        UUID carId,
        LocalDateTime startDate,
        LocalDateTime endDate,
        CarStatus status,
        String reason
) {}