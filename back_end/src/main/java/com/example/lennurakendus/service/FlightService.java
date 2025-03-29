package com.example.lennurakendus.service;

import com.example.lennurakendus.model.Flight;
import com.example.lennurakendus.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    // Tagasta kõik lennud
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // Leia lend ID järgi
    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found: " + id));
    }

    // Loo / uuenda lendu
    public Flight saveFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    // Näidislik otsingufunktsioon
    public List<Flight> searchFlights(String origin, String sihtkoht, LocalDate date, BigDecimal minPrice, BigDecimal maxPrice) {
    List<Flight> flights = flightRepository.findAll();

    return flights.stream()
            .filter(flight -> origin == null || flight.getLahkumiskoht().equalsIgnoreCase(origin))
            .filter(flight -> sihtkoht == null || flight.getSihtkoht().equalsIgnoreCase(sihtkoht))
            .filter(flight -> date == null || flight.getLahkumisaeg().toLocalDate().equals(date))
            .filter(flight -> minPrice == null || flight.getHind().compareTo(minPrice) >= 0)
            .filter(flight -> maxPrice == null || flight.getHind().compareTo(maxPrice) <= 0)
            .collect(Collectors.toList());
}
}
