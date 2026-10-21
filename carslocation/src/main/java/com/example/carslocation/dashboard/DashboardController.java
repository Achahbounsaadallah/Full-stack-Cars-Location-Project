package com.example.carslocation.dashboard;

import com.example.carslocation.Booking.BookingRepository;
import com.example.carslocation.Booking.BookingStatus;
import com.example.carslocation.Car.CarRepository;
import com.example.carslocation.Car.CarStatus;
import com.example.carslocation.User.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public DashboardController(CarRepository carRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.carRepository = carRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        long cars = carRepository.count();
        long availableCars = carRepository.findAll().stream().filter(car -> car.getStatus() == CarStatus.AVAILABLE).count();
        long bookings = bookingRepository.count();
        long pendingBookings = bookingRepository.findByStatus(BookingStatus.PENDING).size();
        double revenue = bookingRepository.findAll().stream().filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED).mapToDouble(booking -> booking.getTotalAmount()).sum();
        return ResponseEntity.ok(new DashboardStatsDTO(cars, availableCars, bookings, pendingBookings, userRepository.count(), revenue));
    }
}
