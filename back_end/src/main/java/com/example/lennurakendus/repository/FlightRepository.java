package com.example.lennurakendus.repository;

import com.example.lennurakendus.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    // Vajadusel lisa custom meetodid
}
