package com.example.admin_service.controller;
import com.example.admin_service.jwt.*;
import com.example.admin_service.model.Admin;
import com.example.admin_service.service.AdminService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    // Créer un admin (registration) with hashed password
    @PostMapping
    public Admin create(@RequestBody Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return service.save(admin);
    }

    // Liste tous les admins
    @GetMapping
    public List<Admin> getAll() {
        return service.findAll();
    }

    // Login endpoint returns JWT
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // Authenticate credentials
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Generate JWT
        String token = jwtUtil.generateToken(request.getEmail());
        return new LoginResponse(token);
    }

    @PutMapping("/{id}")
public Admin updateAdmin(@PathVariable String id, @RequestBody UpdateAdminRequest request) {
    // Fetch the existing admin
    Admin existingAdmin = service.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));

    // Update fields if provided
    if (request.getName() != null && !request.getName().isEmpty()) {
        existingAdmin.setName(request.getName());
    }

    if (request.getPassword() != null && !request.getPassword().isEmpty()) {
        existingAdmin.setPassword(passwordEncoder.encode(request.getPassword()));
    }

    return service.save(existingAdmin);
}

@Data
static class UpdateAdminRequest {
    private String name;
    private String password;
}

    @Data
    static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    static class LoginResponse {
        private final String token;
    }
}
