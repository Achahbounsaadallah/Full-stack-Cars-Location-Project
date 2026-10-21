package com.example.carslocation.Car.CarCategory.dto;

import java.util.UUID;

public record CarCategoryResponseDTO(
        UUID id,
        String name,
        String description,
        Integer minimumSeats,
        Double baseDailyPrice
) {}