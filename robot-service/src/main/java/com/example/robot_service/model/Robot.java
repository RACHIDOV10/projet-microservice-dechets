package com.example.robot_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "robots")
public class Robot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String macAddress;
    private boolean status;
    private String region;
    private String address;

    // Relation avec l'admin qui gère ce robot
    private Long adminId;

    // Liste des déchets collectés par le robot
    @ElementCollection
    private List<String> wasteIds;
}









