package com.example.carslocation.Booking.dto;

import com.example.carslocation.Booking.BookingStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record BookingResponseDTO(
        UUID id,
        String bookingNumber,
        UUID carId,
        String carBrandModel,
        String clientEmail,
        String clientNumber,
        LocalDateTime pickupDate,
        LocalDateTime returnDate,
        BookingStatus status,
        Double totalAmount,
        LocalDateTime createdAt
) {}
