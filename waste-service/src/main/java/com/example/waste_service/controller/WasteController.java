package com.example.waste_service.controller;

import com.example.waste_service.model.Waste;
import com.example.waste_service.service.WasteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wastes")
public class WasteController {

    private final WasteService service;

    public WasteController(WasteService service) {
        this.service = service;
    }

    @PostMapping
    public Waste create(@RequestBody Waste waste) {
        return service.save(waste);
    }

    @GetMapping
    public List<Waste> getAll() {
        return service.findAll();
    }
}

