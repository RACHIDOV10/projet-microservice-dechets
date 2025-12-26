package com.example.waste_service.service;

import com.example.waste_service.model.Waste;
import com.example.waste_service.repository.WasteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WasteService {

    private final WasteRepository repository;

    public WasteService(WasteRepository repository) {
        this.repository = repository;
    }

    // CREATE / UPDATE
    public Waste save(Waste waste) {
        return repository.save(waste);
    }

    // READ ALL
    public List<Waste> findAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Optional<Waste> findById(String id) {
        return repository.findById(id);
    }

    // DELETE
    public void delete(String id) {
        repository.deleteById(id);
    }

    // READ BY ROBOT
    public List<Waste> findByRobotId(String robotId) {
        return repository.findByRobotId(robotId);
    }
}
