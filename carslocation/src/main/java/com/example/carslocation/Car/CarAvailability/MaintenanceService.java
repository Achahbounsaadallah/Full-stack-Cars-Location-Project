package com.example.carslocation.Car.CarAvailability;

import java.util.List;
import java.util.UUID;

import com.example.carslocation.Car.Car;
import com.example.carslocation.Car.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final CarRepository carRepository;

    // Planifier une nouvelle maintenance
    @Transactional
    public Maintenance createMaintenance(UUID carId, Maintenance maintenance) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Voiture non trouvée avec l'ID : " + carId));

        if (maintenance.getStartDate() != null && maintenance.getStartDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La date de début ne peut pas être dans le passé");
        }

        maintenance.setCar(car);
        maintenance.setStatus(MaintenanceStatus.SCHEDULED);

        return maintenanceRepository.save(maintenance);
    }

    // Récupérer toutes les maintenances
    @Transactional(readOnly = true)
    public List<Maintenance> getAllMaintenances() {
        List<Maintenance> result = maintenanceRepository.findAll();
        // Initialise les relations lazy avant que Jackson ne transforme les entités en JSON.
        result.forEach(item -> {
            if (item.getCar() != null && item.getCar().getCategory() != null) {
                item.getCar().getCategory().getName();
            }
        });
        return result;
    }

    // Récupérer une maintenance par son ID
    public Maintenance getMaintenanceById(UUID id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance non trouvée avec l'ID : " + id));
    }

    // Récupérer les maintenances d'une voiture spécifique
    public List<Maintenance> getMaintenancesByCarId(UUID carId) {
        return maintenanceRepository.findByCarId(carId);
    }

    // Récupérer les maintenances par statut
    public List<Maintenance> getMaintenancesByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status);
    }

    // Mettre à jour une maintenance
    @Transactional
    public Maintenance updateMaintenance(UUID id, Maintenance maintenanceDetails) {
        Maintenance maintenance = getMaintenanceById(id);

        maintenance.setDescription(maintenanceDetails.getDescription());
        maintenance.setStartDate(maintenanceDetails.getStartDate());
        maintenance.setEndDate(maintenanceDetails.getEndDate());
        maintenance.setCost(maintenanceDetails.getCost());
        maintenance.setStatus(maintenanceDetails.getStatus());

        return maintenanceRepository.save(maintenance);
    }

    // Clôturer une maintenance en renseignant le coût final
    @Transactional
    public Maintenance completeMaintenance(UUID maintenanceId, Double finalCost) {
        Maintenance maintenance = getMaintenanceById(maintenanceId);

        maintenance.setStatus(MaintenanceStatus.COMPLETED);
        maintenance.setEndDate(LocalDateTime.now());
        maintenance.setCost(finalCost);

        return maintenanceRepository.save(maintenance);
    }

    // Supprimer une maintenance
    @Transactional
    public void deleteMaintenance(UUID id) {
        Maintenance maintenance = getMaintenanceById(id);
        maintenanceRepository.delete(maintenance);
    }
}
