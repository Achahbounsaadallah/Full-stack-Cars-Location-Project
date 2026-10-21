package com.example.carslocation.Car;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface CarRepository extends JpaRepository<Car, UUID> {
    boolean existsByRegistrationNumber(String registrationNumber);
    @Query("""
        SELECT c FROM Car c 
        WHERE c.status = 'AVAILABLE' 
        AND c.id NOT IN (
            SELECT a.car.id FROM CarAvailability a 
            WHERE (:startDate < a.endDate AND :endDate > a.startDate)
        )
    """)
    List<Car> findAvailableCars(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}