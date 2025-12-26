package com.example.robot_service.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.validator.constraints.UniqueElements;


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
    private String description;
    private String model;


    // Relation avec l'admin qui gère ce robot
    private String adminId;

}









