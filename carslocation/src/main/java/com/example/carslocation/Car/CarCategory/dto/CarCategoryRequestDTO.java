package com.example.carslocation.Car.CarCategory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CarCategoryRequestDTO(
        @NotBlank String name,
        String description,
        @NotNull @Min(1) Integer minimumSeats,
        @NotNull @Min(0) Double baseDailyPrice
) {}