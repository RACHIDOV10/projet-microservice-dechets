package com.example.waste_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "wastes")
public class Waste {

    @Id
    private String id;

    private double confidence;
    private Instant timestamp;
    private WasteCategory category;
    private double latitude;
    private double longitude;

    // Robot assigné pour la collecte
    private String robotId;

}
