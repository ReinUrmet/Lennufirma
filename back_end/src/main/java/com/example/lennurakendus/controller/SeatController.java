package com.example.lennurakendus.controller;

import com.example.lennurakendus.model.Seat;
import com.example.lennurakendus.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights/{flightId}/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    // Kõik istekohad konkreetsele lennule
    @GetMapping
    public List<Seat> getSeatsForFlight(@PathVariable Long flightId) {
        return seatService.getSeatsForFlight(flightId);
    }

    // Soovitussüsteem: otsi sobivaid kohti
    @PostMapping("/recommend")
    public List<Seat> recommendSeats(
            @PathVariable Long flightId,
            @RequestParam(defaultValue = "false") boolean window,
            @RequestParam(defaultValue = "false") boolean extraLegroom,
            @RequestParam(defaultValue = "false") boolean nearExit
    ) {
        return seatService.recommendSeats(flightId, window, extraLegroom, nearExit);
    }

    // Broneeri konkreetne istekoht
    @PostMapping("/{seatId}/reserve")
    public Seat reserveSeat(@PathVariable Long seatId) {
        return seatService.reserveSeat(seatId);
    }
}
