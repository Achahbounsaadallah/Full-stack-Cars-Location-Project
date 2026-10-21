package com.example.carslocation.Car.CarAvailability;

import com.example.carslocation.Car.Car;
import com.example.carslocation.Car.CarAvailability.dto.BlockCarRequestDTO;
import com.example.carslocation.Car.CarAvailability.dto.CarAvailabilityResponseDTO;
import com.example.carslocation.Car.CarRepository;
import com.example.carslocation.Car.CarStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CarAvailabilityService {

    private final CarAvailabilityRepository availabilityRepository;
    private final CarRepository carRepository;
    private final MaintenanceRepository maintenanceRepository;

    public CarAvailabilityService(CarAvailabilityRepository availabilityRepository,
                                  CarRepository carRepository,
                                  MaintenanceRepository maintenanceRepository) {
        this.availabilityRepository = availabilityRepository;
        this.carRepository = carRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    // 1. Vérifier si une voiture est disponible entre 2 dates
    public boolean isCarAvailable(UUID carId, LocalDateTime startDate, LocalDateTime endDate) {
        List<CarAvailability> overlaps = availabilityRepository.findOverlappingAvailabilities(carId, startDate, endDate);
        return overlaps.isEmpty();
    }

    // 2. Bloquer une voiture et enregistrer la maintenance si nécessaire
    @Transactional
    public CarAvailabilityResponseDTO blockCar(BlockCarRequestDTO dto) {
        if (!isCarAvailable(dto.carId(), dto.startDate(), dto.endDate())) {
            throw new IllegalArgumentException("La voiture est déjà occupée ou bloquée sur cette période.");
        }

        Car car = carRepository.findById(dto.carId())
                .orElseThrow(() -> new RuntimeException("Voiture non trouvée"));

        // Sauvegarde dans CarAvailability
        CarAvailability availability = CarAvailability.builder()
                .car(car)
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .status(dto.status())
                .reason(dto.reason())
                .build();

        CarAvailability savedAvailability = availabilityRepository.save(availability);

        // Si le statut est MAINTENANCE, création automatique de la fiche de maintenance
        if (dto.status() == CarStatus.MAINTENANCE) {
            Maintenance maintenance = Maintenance.builder()
                    .car(car)
                    .startDate(dto.startDate())
                    .endDate(dto.endDate())
                    .description(dto.reason())
                    .status(MaintenanceStatus.SCHEDULED)
                    .cost(0.0)
                    .build();

            maintenanceRepository.save(maintenance);
        }

        return mapToDTO(savedAvailability);
    }

    // 3. Obtenir toutes les indisponibilités d'une voiture
    public List<CarAvailabilityResponseDTO> getCarAvailabilities(UUID carId) {
        return availabilityRepository.findByCarId(carId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<CarAvailabilityResponseDTO> getMaintenanceAvailabilities() {
        return availabilityRepository.findByStatus(CarStatus.MAINTENANCE).stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Méthode utilitaire de transformation vers le DTO
    private CarAvailabilityResponseDTO mapToDTO(CarAvailability availability) {
        return new CarAvailabilityResponseDTO(
                availability.getId(),
                availability.getCar().getId(),
                availability.getStartDate(),
                availability.getEndDate(),
                availability.getStatus(),
                availability.getReason()
        );
    }
}
