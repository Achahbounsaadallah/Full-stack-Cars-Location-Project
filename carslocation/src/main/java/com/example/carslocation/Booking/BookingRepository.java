package com.example.carslocation.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByClientId(UUID clientId);
    List<Booking> findByStatus(BookingStatus status);
}
