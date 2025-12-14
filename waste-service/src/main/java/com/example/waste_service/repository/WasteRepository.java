package com.example.waste_service.repository;

import com.example.waste_service.model.Waste;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WasteRepository extends MongoRepository<Waste, String> {
}