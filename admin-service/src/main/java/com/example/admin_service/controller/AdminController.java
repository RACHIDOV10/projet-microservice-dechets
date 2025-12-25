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
