package com.example.carslocation.Booking;

import com.example.carslocation.Booking.dto.BookingRequestDTO;
import com.example.carslocation.Booking.dto.BookingResponseDTO;
import com.example.carslocation.Car.Car;
import com.example.carslocation.Car.CarAvailability.CarAvailability;
import com.example.carslocation.Car.CarAvailability.CarAvailabilityRepository;
import com.example.carslocation.Car.CarAvailability.CarAvailabilityService;
import com.example.carslocation.Car.CarAvailability.dto.BlockCarRequestDTO;
import com.example.carslocation.Car.CarRepository;
import com.example.carslocation.Car.CarStatus;
import com.example.carslocation.User.User;
import com.example.carslocation.User.UserRepository;
import com.example.carslocation.common.error.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final CarAvailabilityService availabilityService;
    private final CarAvailabilityRepository availabilityRepository;

    public BookingService(BookingRepository bookingRepository,
                          CarRepository carRepository,
                          UserRepository userRepository,
                          CarAvailabilityService availabilityService,
                          CarAvailabilityRepository availabilityRepository) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.availabilityService = availabilityService;
        this.availabilityRepository = availabilityRepository;
    }

    // 1. ÉTAPE CLIENT : Créer une demande de réservation (Statut: PENDING)
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO dto, String userEmail) {
        // Chargement sécurisé de l'utilisateur à partir de l'email
        User client = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'email: " + userEmail));

        Car car = carRepository.findById(dto.carId())
                .orElseThrow(() -> new ResourceNotFoundException("Voiture non trouvée"));

        // Validation de la cohérence des dates
        if (dto.returnDate().isBefore(dto.pickupDate()) || dto.returnDate().isEqual(dto.pickupDate())) {
            throw new IllegalArgumentException("La date de retour doit être supérieure à la date de départ.");
        }

        // Vérification directe de la disponibilité via repository
        List<CarAvailability> overlaps = availabilityRepository.findOverlappingAvailabilities(
                dto.carId(), dto.pickupDate(), dto.returnDate()
        );

        if (!overlaps.isEmpty()) {
            throw new IllegalArgumentException("La voiture n'est pas disponible pour ces dates.");
        }

        // Calcul exact du prix journalier (arrondi au jour supérieur)
        long hours = Duration.between(dto.pickupDate(), dto.returnDate()).toHours();
        long days = (long) Math.ceil(hours / 24.0);
        if (days <= 0) days = 1;

        Double totalAmount = days * car.getDailyBasePrice();

        // Instanciation de la réservation
        Booking booking = Booking.builder()
                .bookingNumber("BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .client(client)
                .car(car)
                .pickupDate(dto.pickupDate())
                .returnDate(dto.returnDate())
                .status(BookingStatus.PENDING)
                .totalAmount(totalAmount)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Assurance que la relation client reste attachée lors du mapping
        if (savedBooking.getClient() == null) {
            savedBooking.setClient(client);
        }

        return mapToDTO(savedBooking);
    }

    // 2. ÉTAPE ADMIN/EMPLOYÉ : Valider le dossier et demander le paiement
    @Transactional
    public BookingResponseDTO approveBookingByAdmin(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Seules les réservations en statut PENDING peuvent être validées.");
        }

        booking.setStatus(BookingStatus.WAITING_FOR_PAYMENT);
        return mapToDTO(bookingRepository.save(booking));
    }

    // 3. ÉTAPE PAIEMENT RÉUSSI : Confirmer définitivement et bloquer la voiture
    @Transactional
    public BookingResponseDTO confirmAndBlockCarAfterPayment(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée"));

        if (booking.getStatus() != BookingStatus.WAITING_FOR_PAYMENT) {
            throw new IllegalStateException("La réservation doit être en attente de paiement pour être confirmée.");
        }

        // Bloquer officiellement la voiture dans la table des disponibilités
        availabilityService.blockCar(new BlockCarRequestDTO(
                booking.getCar().getId(),
                booking.getPickupDate(),
                booking.getReturnDate(),
                CarStatus.RENTED,
                "Réservation payée #" + booking.getBookingNumber()
        ));

        booking.setStatus(BookingStatus.CONFIRMED);
        return mapToDTO(bookingRepository.save(booking));
    }

    // 4. ÉTAPE ADMIN : Rejeter la réservation
    @Transactional
    public BookingResponseDTO rejectBooking(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée"));

        booking.setStatus(BookingStatus.REJECTED);
        return mapToDTO(bookingRepository.save(booking));
    }

    // 5. ÉTAPE CLIENT/ADMIN : Annuler la réservation
    @Transactional
    public BookingResponseDTO cancelBooking(UUID bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée"));

        if (!booking.getClient().getEmail().equals(userEmail)) {
            throw new SecurityException("Cette réservation n'appartient pas à l'utilisateur connecté.");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Pour annuler une réservation déjà payée/confirmée, passez par le service de remboursement.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return mapToDTO(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getMyBookings(String userEmail) {
        User client = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        return bookingRepository.findByClientId(client.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING).stream().map(this::mapToDTO).toList();
    }

    // Mapping sécurisé avec vérification de nullité
    private BookingResponseDTO mapToDTO(Booking booking) {
        User client = booking.getClient();
        Car car = booking.getCar();

        return new BookingResponseDTO(
                booking.getId(),
                booking.getBookingNumber(),
                car != null ? car.getId() : null,
                car != null ? (car.getBrand() + " " + car.getModel()) : "Véhicule inconnu",
                client != null ? client.getEmail() : null,
                client != null ? client.getPhone() : null,
                booking.getPickupDate(),
                booking.getReturnDate(),
                booking.getStatus(),
                booking.getTotalAmount(),
                booking.getCreatedAt()
        );
    }
}
