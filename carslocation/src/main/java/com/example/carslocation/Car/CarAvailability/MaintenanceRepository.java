package com.example.carslocation.Car.CarAvailability;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, UUID> {

    // Récupérer l'historique des maintenances d'une voiture spécifique
    List<Maintenance> findByCarId(UUID carId);
    List<Maintenance> findByStatus(MaintenanceStatus status);
}