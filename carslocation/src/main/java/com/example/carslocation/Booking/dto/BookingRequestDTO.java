package com.example.carslocation.Booking.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public record BookingRequestDTO(
        @NotNull UUID carId,
        @NotNull @Future LocalDateTime pickupDate,
        @NotNull @Future LocalDateTime returnDate
) {}