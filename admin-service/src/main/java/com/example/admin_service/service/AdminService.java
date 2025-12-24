package com.example.admin_service.service;

import com.example.admin_service.model.Admin;
import com.example.admin_service.repository.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository repository;

    public AdminService(AdminRepository repository) {
        this.repository = repository;
    }

    // Création ou mise à jour
    public Admin save(Admin admin) {
        return repository.save(admin);
    }

    // Liste tous les admins
    public List<Admin> findAll() {
        return repository.findAll();
    }

    // Rechercher par ID
    public Optional<Admin> findById(String id) {
        return repository.findById(id);
    }

    // Rechercher par email (pour login)
    public Optional<Admin> findByEmail(String email) {
        return repository.findByEmail(email);
    }




}
