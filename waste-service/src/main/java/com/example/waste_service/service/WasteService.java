package com.example.waste_service.service;

import com.example.waste_service.model.Waste;
import com.example.waste_service.repository.WasteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WasteService {

    private final WasteRepository repository;

    public WasteService(WasteRepository repository) {
        this.repository = repository;
    }

    public Waste save(Waste waste) {
        return repository.save(waste);
    }

    public List<Waste> findAll() {
        return repository.findAll();
    }
}