package com.example.waste_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "wastes")
public class Waste {

    @Id
    private String id;

    @Indexed
    private Instant timestamp;

    @Indexed
    private WasteCategory category;

    @Indexed
    private String region;

    @Indexed
    private String robotId;
}
