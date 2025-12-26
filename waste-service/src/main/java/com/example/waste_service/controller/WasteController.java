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

    // ================= CREATE =================
    @PostMapping
    public Waste create(@RequestBody Waste waste) {
        waste.setId(null); // forcer la création
        return service.save(waste);
    }

    // ================= READ ALL =================
    @GetMapping
    public List<Waste> getAll() {
        return service.findAll();
    }

    // ================= READ BY ID =================
    @GetMapping("/{id}")
    public Optional<Waste> getById(@PathVariable String id) {
        return service.findById(id);
    }

    // ================= READ BY ROBOT =================
    @GetMapping("/robot/{robotId}")
    public List<Waste> getByRobotId(@PathVariable String robotId) {
        return service.findByRobotId(robotId);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public Waste update(@PathVariable String id, @RequestBody Waste waste) {
        waste.setId(id); // obligatoire pour update
        return service.save(waste);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
