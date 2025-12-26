package com.example.waste_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Document(collection = "wastes")
public class Waste {

    @Id
    private String id;


    private LocalDate timestamp;
    private WasteCategory category;
    private String region;


    // Robot assigné pour la collecte
    private String robotId;

}
