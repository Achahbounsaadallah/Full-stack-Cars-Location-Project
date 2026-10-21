package com.example.carslocation.Car;

import com.example.carslocation.Car.CarCategory.CarCategory;
import com.example.carslocation.Car.CarCategory.CarCategoryRepository;
import com.example.carslocation.Car.CarCategory.dto.CarCategoryResponseDTO;
import com.example.carslocation.Car.dto.CarRequestDTO;
import com.example.carslocation.Car.dto.CarResponseDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final CarCategoryRepository categoryRepository;

    public CarService(CarRepository carRepository, CarCategoryRepository categoryRepository) {
        this.carRepository = carRepository;
        this.categoryRepository = categoryRepository;
    }

    public CarResponseDTO createCar(CarRequestDTO dto) {
        if (carRepository.existsByRegistrationNumber(dto.registrationNumber())) {
            throw new IllegalArgumentException("Immatriculation déjà existante.");
        }

        CarCategory category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));

        Car car = Car.builder()
                .registrationNumber(dto.registrationNumber())
                .brand(dto.brand())
                .model(dto.model())
                .productionYear(dto.productionYear())
                .seats(dto.seats())
                .transmission(dto.transmission())
                .fuelType(dto.fuelType())
                .dailyBasePrice(dto.dailyBasePrice())
                .status(dto.status())
                .mileage(dto.mileage())
                .description(dto.description())
                .category(category)
                .build();

        return mapToDTO(carRepository.save(car));
    }

    public List<CarResponseDTO> getAllCars() {
        return carRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    public CarResponseDTO getCarById(UUID id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));
        return mapToDTO(car);
    }

    public CarResponseDTO updateCar(UUID id, CarRequestDTO dto) {
        Car car = carRepository.findById(id).orElseThrow(() -> new RuntimeException("Véhicule introuvable"));
        if (!car.getRegistrationNumber().equals(dto.registrationNumber()) && carRepository.existsByRegistrationNumber(dto.registrationNumber())) {
            throw new IllegalArgumentException("Immatriculation déjà existante.");
        }
        CarCategory category = categoryRepository.findById(dto.categoryId()).orElseThrow(() -> new RuntimeException("Catégorie introuvable"));
        car.setRegistrationNumber(dto.registrationNumber()); car.setBrand(dto.brand()); car.setModel(dto.model());
        car.setProductionYear(dto.productionYear()); car.setSeats(dto.seats()); car.setTransmission(dto.transmission());
        car.setFuelType(dto.fuelType()); car.setDailyBasePrice(dto.dailyBasePrice()); car.setStatus(dto.status());
        car.setMileage(dto.mileage()); car.setDescription(dto.description()); car.setCategory(category);
        return mapToDTO(carRepository.save(car));
    }

    public void deleteCar(UUID id) {
        if (!carRepository.existsById(id)) throw new RuntimeException("Véhicule introuvable");
        carRepository.deleteById(id);
    }
    public List<CarResponseDTO> getAvailableCars(LocalDateTime startDate, LocalDateTime endDate) {
        return carRepository.findAvailableCars(startDate, endDate)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private CarResponseDTO mapToDTO(Car car) {
        CarCategoryResponseDTO categoryDTO = new CarCategoryResponseDTO(
                car.getCategory().getId(),
                car.getCategory().getName(),
                car.getCategory().getDescription(),
                car.getCategory().getMinimumSeats(),
                car.getCategory().getBaseDailyPrice()
        );

        return new CarResponseDTO(
                car.getId(),
                car.getRegistrationNumber(),
                car.getBrand(),
                car.getModel(),
                car.getProductionYear(),
                car.getSeats(),
                car.getTransmission(),
                car.getFuelType(),
                car.getDailyBasePrice(),
                car.getStatus(),
                car.getMileage(),
                car.getDescription(),
                categoryDTO
        );
    }
}
