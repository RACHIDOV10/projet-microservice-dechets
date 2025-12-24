package com.example.admin_service.controller;

import com.example.admin_service.model.Admin;
import com.example.admin_service.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) { this.service = service; }

    // Créer un admin
    @PostMapping
    public Admin create(@RequestBody Admin admin) {
        return service.save(admin);
    }

    // Liste tous les admins
    @GetMapping
    public List<Admin> getAll() {
        return service.findAll();
    }

    // Login
    @PostMapping("/login")
    public Optional<Admin> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Optional<Admin> adminOpt = service.findByEmail(email);
        // Ici, pour simplifier, on compare en clair (à améliorer avec hash)
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            return adminOpt;
        }
        return Optional.empty();
    }


}
