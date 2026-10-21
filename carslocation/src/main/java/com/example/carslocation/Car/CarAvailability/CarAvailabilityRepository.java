package com.example.carslocation.Car.CarAvailability;

import com.example.carslocation.Car.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface CarAvailabilityRepository extends JpaRepository<CarAvailability, UUID> {

    List<CarAvailability> findByCarId(UUID carId);
    List<CarAvailability> findByStatus(CarStatus status);
    @Query("""
        SELECT a FROM CarAvailability a 
        WHERE a.car.id = :carId 
        AND (:startDate < a.endDate AND :endDate > a.startDate)
    """)
    List<CarAvailability> findOverlappingAvailabilities(
            @Param("carId") UUID carId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}
