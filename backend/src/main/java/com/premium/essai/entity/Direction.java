package com.premium.essai.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "directions")
public class Direction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto increment
    private Long id;

    @Column(nullable = false, unique = true) // Required and unique
    private String name;

    private String description;

    // One direction has many responsables - inverse side, mapped by direction field
    @OneToMany(mappedBy = "direction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Responsable> responsables = new ArrayList<>();

    // One direction has many salaries - inverse side
    @OneToMany(mappedBy = "direction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Salarie> salaries = new ArrayList<>();

    public Direction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<Responsable> getResponsables() { return responsables; }
    public void setResponsables(List<Responsable> responsables) { this.responsables = responsables; }
    public List<Salarie> getSalaries() { return salaries; }
    public void setSalaries(List<Salarie> salaries) { this.salaries = salaries; }
}