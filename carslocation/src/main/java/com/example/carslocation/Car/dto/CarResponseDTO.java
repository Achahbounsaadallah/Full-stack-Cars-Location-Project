package com.example.carslocation.Car.dto;
import com.example.carslocation.Car.CarCategory.dto.CarCategoryResponseDTO;
import com.example.carslocation.Car.CarStatus;

import java.util.UUID;

public record CarResponseDTO(
        UUID id,
        String registrationNumber,
        String brand,
        String model,
        Integer productionYear,
        Integer seats,
        String transmission,
        String fuelType,
        Double dailyBasePrice,
        CarStatus status,
        Integer mileage,
        String description,
        CarCategoryResponseDTO category
) {}
