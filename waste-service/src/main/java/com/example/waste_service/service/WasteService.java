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

    // Ajouter ou mettre à jour un waste
    public Waste save(Waste waste) {
        return repository.save(waste);
    }

    public List<Waste> findAll() {
        return repository.findAll();
    }

    public Optional<Waste> findById(String id) {
        return repository.findById(id);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    // Mettre à jour le statut (ex: collected)
    public void updateStatus(String wasteId, String status) {
        repository.findById(wasteId).ifPresent(waste -> {
            waste.setStatus(status);
            repository.save(waste);
        });
    }

    // Statistiques pour le front-end
    public long countAll() {
        return repository.count();
    }

    public long countByStatus(String status) {
        return repository.findByStatus(status).size();
    }
}
