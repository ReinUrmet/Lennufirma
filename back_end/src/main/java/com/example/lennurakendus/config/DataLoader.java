package com.example.lennurakendus.config;

import com.example.lennurakendus.model.Flight;
import com.example.lennurakendus.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private FlightRepository flightRepository;

    @Override
    public void run(String... args) throws Exception {
        // Flight 1
        Flight flight1 = new Flight();
        flight1.setLennuNumber("AB123");
        flight1.setLahkumiskoht("Tallinn");
        flight1.setSihtkoht("London");
        flight1.setLahkumisaeg(LocalDateTime.now().plusDays(1));
        flight1.setSaabumisaeg(LocalDateTime.now().plusDays(1).plusHours(2));
        flight1.setHind(new BigDecimal("120.00"));
        flight1.setLennukompanii("Lufthansa");
        flightRepository.save(flight1);

        // Flight 2
        Flight flight2 = new Flight();
        flight2.setLennuNumber("CD456");
        flight2.setLahkumiskoht("Helsinki");
        flight2.setSihtkoht("New York");
        flight2.setLahkumisaeg(LocalDateTime.now().plusDays(2));
        flight2.setSaabumisaeg(LocalDateTime.now().plusDays(2).plusHours(10));
        flight2.setHind(new BigDecimal("450.00"));
        flight2.setLennukompanii("Finnair");
        flightRepository.save(flight2);

        // Flight 3
        Flight flight3 = new Flight();
        flight3.setLennuNumber("EF789");
        flight3.setLahkumiskoht("Stockholm");
        flight3.setSihtkoht("Paris");
        flight3.setLahkumisaeg(LocalDateTime.now().plusDays(3));
        flight3.setSaabumisaeg(LocalDateTime.now().plusDays(3).plusHours(3));
        flight3.setHind(new BigDecimal("200.00"));
        flight3.setLennukompanii("SAS");
        flightRepository.save(flight3);

        // Flight 4
        Flight flight4 = new Flight();
        flight4.setLennuNumber("GH012");
        flight4.setLahkumiskoht("Berlin");
        flight4.setSihtkoht("Rome");
        flight4.setLahkumisaeg(LocalDateTime.now().plusDays(1).plusHours(5));
        flight4.setSaabumisaeg(LocalDateTime.now().plusDays(1).plusHours(8));
        flight4.setHind(new BigDecimal("150.00"));
        flight4.setLennukompanii("Air Berlin");
        flightRepository.save(flight4);
    }
}
