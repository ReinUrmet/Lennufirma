package com.example.lennurakendus.controller;

import com.example.lennurakendus.model.Flight;
import com.example.lennurakendus.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    private FlightService flightService;

    // Kõik lennud või filtriga
    @GetMapping
public List<Flight> getAllFlights(
        @RequestParam(required = false) String origin,
        @RequestParam(required = false) String destination,
        @RequestParam(required = false) LocalDate date,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice
) {
    if (origin == null && destination == null && date == null && minPrice == null && maxPrice == null) {
        return flightService.getAllFlights();
    }
    return flightService.searchFlights(origin, destination, date, minPrice, maxPrice);
}

    // Üks lend ID järgi
    @GetMapping("/{id}")
    public Flight getFlight(@PathVariable Long id) {
        return flightService.getFlightById(id);
    }

    // Näidis: loo lend (POST)
    @PostMapping
    public Flight createFlight(@RequestBody Flight flight) {
        return flightService.saveFlight(flight);
    }
}
