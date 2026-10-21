package com.example.carslocation.Booking;

public enum BookingStatus {
    PENDING,             // Demande créée par le client
    WAITING_FOR_PAYMENT, // Validé par l'admin, en attente de paiement du client
    CONFIRMED,           // Payé et confirmé (Voiture bloquée)
    CANCELLED,           // Annulé par le client ou l'admin
    REJECTED             // Refusé par l'admin
}