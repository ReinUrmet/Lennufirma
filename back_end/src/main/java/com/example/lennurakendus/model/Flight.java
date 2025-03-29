package com.example.lennurakendus.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lennuNumber;
    private String lahkumiskoht;
    private String sihtkoht;
    private LocalDateTime lahkumisaeg;
    private LocalDateTime saabumisaeg;
    private BigDecimal hind;
    private String lennukompanii;

    // Constructors
    public Flight() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLennuNumber() {
        return lennuNumber;
    }

    public void setLennuNumber(String lennuNumber) {
        this.lennuNumber = lennuNumber;
    }

    public String getLahkumiskoht() {
        return lahkumiskoht;
    }

    public void setLahkumiskoht(String lahkumiskoht) {
        this.lahkumiskoht = lahkumiskoht;
    }

    public String getSihtkoht() {
        return sihtkoht;
    }

    public void setSihtkoht(String sihtkoht) {
        this.sihtkoht = sihtkoht;
    }

    public LocalDateTime getLahkumisaeg() {
        return lahkumisaeg;
    }

    public void setLahkumisaeg(LocalDateTime lahkumisaeg) {
        this.lahkumisaeg = lahkumisaeg;
    }

    public LocalDateTime getSaabumisaeg() {
        return saabumisaeg;
    }

    public void setSaabumisaeg(LocalDateTime saabumisaeg) {
        this.saabumisaeg = saabumisaeg;
    }

    public BigDecimal getHind() {
        return hind;
    }

    public void setHind(BigDecimal hind) {
        this.hind = hind;
    }

    public String getLennukompanii() {
        return lennukompanii;
    }

    public void setLennukompanii(String lennukompanii) {
        this.lennukompanii = lennukompanii;
    }
}
