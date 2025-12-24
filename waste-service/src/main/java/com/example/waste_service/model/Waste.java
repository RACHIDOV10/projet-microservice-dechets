package com.example.waste_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "wastes")
public class Waste {

    @Id
    private String id;
    private String type;        // ex: plastique, métal, papier...
    private int quantity;       // quantité estimée

    // Robot assigné pour la collecte
    private String robotId;

    // Statut de collecte: pending, in_progress, collected
    private String status;
}
