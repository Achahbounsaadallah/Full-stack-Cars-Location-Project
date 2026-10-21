package com.example.carslocation.Car.CarCategory;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CarCategoryRepository extends JpaRepository<CarCategory, UUID> {
    boolean existsByName(String name);
}