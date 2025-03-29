package com.example.lennurakendus.service;

import com.example.lennurakendus.model.Seat;
import com.example.lennurakendus.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    // Leia kõik istekohad konkreetse lennu jaoks
    public List<Seat> getSeatsForFlight(Long flightId) {
        return seatRepository.findByFlightId(flightId);
    }

    // Soovitussüsteemi näide
    public List<Seat> recommendSeats(Long flightId, boolean window, boolean extraLegroom, boolean nearExit) {
        List<Seat> seats = seatRepository.findByFlightId(flightId);

        return seats.stream()
                .filter(s -> !s.isOccupied()) // peab olema vaba
                .filter(s -> !window || s.isWindowSeat()) // kui window=true, peab seat.isWindowSeat() olema true
                .filter(s -> !extraLegroom || s.isExtraLegroom())
                .filter(s -> !nearExit || s.isNearExit())
                .toList();
    }

    // Broneeri üks istekoht
    public Seat reserveSeat(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + seatId));

        if (seat.isOccupied()) {
            throw new RuntimeException("Seat is already occupied!");
        }
        seat.setOccupied(true);
        return seatRepository.save(seat);
    }
}
