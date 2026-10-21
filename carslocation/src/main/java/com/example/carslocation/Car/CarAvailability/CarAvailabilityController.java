package com.example.carslocation.Car.CarAvailability;

import com.example.carslocation.Car.CarAvailability.dto.BlockCarRequestDTO;
import com.example.carslocation.Car.CarAvailability.dto.CarAvailabilityResponseDTO;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/availabilities")
public class CarAvailabilityController {

    private final CarAvailabilityService availabilityService;

    public CarAvailabilityController(CarAvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    // 1. Vérifier si une voiture est disponible entre 2 dates
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAvailability(
            @RequestParam UUID carId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        boolean available = availabilityService.isCarAvailable(carId, startDate, endDate);
        return ResponseEntity.ok(Map.of(
                "carId", carId,
                "available", available,
                "startDate", startDate,
                "endDate", endDate
        ));
    }

    // 2. Bloquer manuellement une voiture (Maintenance, indisponibilité...)
    @PostMapping("/block")
    public ResponseEntity<CarAvailabilityResponseDTO> blockCar(@Valid @RequestBody BlockCarRequestDTO dto) {
        CarAvailabilityResponseDTO response = availabilityService.blockCar(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 3. Obtenir toutes les indisponibilités d'une voiture
    @GetMapping("/car/{carId}")
    public ResponseEntity<List<CarAvailabilityResponseDTO>> getCarAvailabilities(@PathVariable UUID carId) {
        return ResponseEntity.ok(availabilityService.getCarAvailabilities(carId));
    }

    @GetMapping("/maintenance")
    public ResponseEntity<List<CarAvailabilityResponseDTO>> getMaintenanceAvailabilities() {
        return ResponseEntity.ok(availabilityService.getMaintenanceAvailabilities());
    }
}
