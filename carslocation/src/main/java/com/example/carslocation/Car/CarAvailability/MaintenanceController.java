package com.example.carslocation.Car.CarAvailability;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/maintenances")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    // Créer une maintenance pour une voiture spécifique
    @PostMapping("/car/{carId}")
    public ResponseEntity<Maintenance> createMaintenance(@PathVariable UUID carId,
                                                         @RequestBody Maintenance maintenance) {
        Maintenance newMaintenance = maintenanceService.createMaintenance(carId, maintenance);
        return new ResponseEntity<>(newMaintenance, HttpStatus.CREATED);
    }

    // Obtenir toutes les maintenances
    @GetMapping
    public ResponseEntity<List<Maintenance>> getAllMaintenances() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenances());
    }

    // Obtenir une maintenance par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> getMaintenanceById(@PathVariable UUID id) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceById(id));
    }

    // Obtenir toutes les maintenances d'une voiture
    @GetMapping("/car/{carId}")
    public ResponseEntity<List<Maintenance>> getMaintenancesByCarId(@PathVariable UUID carId) {
        return ResponseEntity.ok(maintenanceService.getMaintenancesByCarId(carId));
    }

    // Obtenir les maintenances filtrées par statut (ex: /api/maintenances/status?status=SCHEDULED)
    @GetMapping("/status")
    public ResponseEntity<List<Maintenance>> getMaintenancesByStatus(@RequestParam MaintenanceStatus status) {
        return ResponseEntity.ok(maintenanceService.getMaintenancesByStatus(status));
    }

    // Mettre à jour les détails d'une maintenance
    @PutMapping("/{id}")
    public ResponseEntity<Maintenance> updateMaintenance(@PathVariable UUID id,
                                                         @RequestBody Maintenance maintenanceDetails) {
        return ResponseEntity.ok(maintenanceService.updateMaintenance(id, maintenanceDetails));
    }

    // Marquer une maintenance comme terminée en spécifiant le coût final
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Maintenance> completeMaintenance(@PathVariable UUID id,
                                                           @RequestParam Double cost) {
        return ResponseEntity.ok(maintenanceService.completeMaintenance(id, cost));
    }

    // Supprimer une maintenance
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable UUID id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }
}
