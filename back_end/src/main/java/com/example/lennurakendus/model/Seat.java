package com.example.lennurakendus.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;
    private boolean occupied;
    private boolean windowSeat;
    private boolean extraLegroom;
    private boolean nearExit;

    @Enumerated(EnumType.STRING)
    private SeatClass seatClass; // Optional enum (ECONOMY, BUSINESS, FIRST)

    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;

    public Seat() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public boolean isOccupied() {
        return occupied;
    }

    public void setOccupied(boolean occupied) {
        this.occupied = occupied;
    }

    public boolean isWindowSeat() {
        return windowSeat;
    }

    public void setWindowSeat(boolean windowSeat) {
        this.windowSeat = windowSeat;
    }

    public boolean isExtraLegroom() {
        return extraLegroom;
    }

    public void setExtraLegroom(boolean extraLegroom) {
        this.extraLegroom = extraLegroom;
    }

    public boolean isNearExit() {
        return nearExit;
    }

    public void setNearExit(boolean nearExit) {
        this.nearExit = nearExit;
    }

    public SeatClass getSeatClass() {
        return seatClass;
    }

    public void setSeatClass(SeatClass seatClass) {
        this.seatClass = seatClass;
    }

    public Flight getFlight() {
        return flight;
    }

    public void setFlight(Flight flight) {
        this.flight = flight;
    }
}
