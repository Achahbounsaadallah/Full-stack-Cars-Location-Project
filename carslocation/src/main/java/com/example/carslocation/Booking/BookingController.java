package com.example.carslocation.Booking;

import com.example.carslocation.Booking.dto.BookingRequestDTO;
import com.example.carslocation.Booking.dto.BookingResponseDTO;
import com.example.carslocation.User.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Client : Réserver une voiture disponible (Crée en PENDING)
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO dto,
            Authentication authentication
    ) {
        // authentication.getName() contient l'email extrait du Token JWT
        String userEmail = authentication.getName();
        return new ResponseEntity<>(bookingService.createBooking(dto, userEmail), HttpStatus.CREATED);
    }

    // Client : Consulter ses réservations
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.getMyBookings(userEmail));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<BookingResponseDTO>> getPendingBookings() {
        return ResponseEntity.ok(bookingService.getPendingBookings());
    }

    // Admin / Employé : Valider la réservation et demander le paiement (PENDING -> WAITING_FOR_PAYMENT)
    @PatchMapping("/{id}/approve")
    public ResponseEntity<BookingResponseDTO> approveBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.approveBookingByAdmin(id));
    }

    // Admin / Employé : Rejeter la réservation (PENDING -> REJECTED)
    @PatchMapping("/{id}/reject")
    public ResponseEntity<BookingResponseDTO> rejectBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id));
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<BookingResponseDTO> confirmBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.confirmAndBlockCarAfterPayment(id));
    }

    // Client : Annuler sa demande
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(@PathVariable UUID id, Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.cancelBooking(id, userEmail));
    }
}
