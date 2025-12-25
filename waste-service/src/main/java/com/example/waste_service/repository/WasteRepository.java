package com.example.waste_service.repository;

import com.example.waste_service.model.Waste;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WasteRepository extends MongoRepository<Waste, String> {

}
