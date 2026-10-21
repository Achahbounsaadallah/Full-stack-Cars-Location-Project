package com.example.carslocation.Car.CarCategory;

import com.example.carslocation.Car.CarCategory.dto.CarCategoryRequestDTO;
import com.example.carslocation.Car.CarCategory.dto.CarCategoryResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CarCategoryService {

    private final CarCategoryRepository categoryRepository;

    public CarCategoryService(CarCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CarCategoryResponseDTO createCategory(CarCategoryRequestDTO dto) {
        if (categoryRepository.existsByName(dto.name())) {
            throw new IllegalArgumentException("Cette catégorie existe déjà.");
        }

        CarCategory category = CarCategory.builder()
                .name(dto.name())
                .description(dto.description())
                .minimumSeats(dto.minimumSeats())
                .baseDailyPrice(dto.baseDailyPrice())
                .build();

        return mapToDTO(categoryRepository.save(category));
    }

    public List<CarCategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    public CarCategoryResponseDTO getCategoryById(UUID id) {
        CarCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie introuvable"));
        return mapToDTO(category);
    }

    private CarCategoryResponseDTO mapToDTO(CarCategory category) {
        return new CarCategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getMinimumSeats(),
                category.getBaseDailyPrice()
        );
    }
}