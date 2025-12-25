package com.example.waste_service.controller;

import com.example.waste_service.model.Waste;
import com.example.waste_service.service.WasteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wastes")
public class WasteController {

    private final WasteService service;

    public WasteController(WasteService service) {
        this.service = service;
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

}
