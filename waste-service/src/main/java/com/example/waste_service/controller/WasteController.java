package com.example.waste_service.controller;

import com.example.waste_service.model.Waste;
import com.example.waste_service.service.WasteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/wastes")
public class WasteController {

    private final WasteService service;

    public WasteController(WasteService service) {
        this.service = service;
    }

    // Robot envoie un déchet détecté
    @PostMapping("/detect")
    public Waste createDetectedWaste(@RequestBody Waste waste) {
        waste.setStatus("detected"); // statut par défaut
        return service.save(waste);
    }

    // Mise à jour du statut après collecte
    @PostMapping("/{id}/collect")
    public void markCollected(@PathVariable String id) {
        service.updateStatus(id, "collected");
    }

    // Récupérer tous les déchets
    @GetMapping
    public List<Waste> getAll() {
        return service.findAll();
    }

    // Récupérer un waste par id
    @GetMapping("/{id}")
    public Optional<Waste> getById(@PathVariable String id) {
        return service.findById(id);
    }

    // Statistiques pour le front-end / dashboard
    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        long total = service.countAll();
        long detected = service.countByStatus("detected");
        long collected = service.countByStatus("collected");
        return Map.of(
                "total", total,
                "detected", detected,
                "collected", collected
        );
    }
}
