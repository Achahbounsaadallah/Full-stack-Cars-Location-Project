package com.example.carslocation.Car.CarAvailability;

import com.example.carslocation.Car.Car;
import com.example.carslocation.Car.CarStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "car_availabilities")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CarAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CarStatus status; // RENTED, MAINTENANCE, OUT_OF_SERVICE...

    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;
}
