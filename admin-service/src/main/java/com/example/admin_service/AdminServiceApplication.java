package com.example.admin_service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.admin_service.model.Admin;
import com.example.admin_service.repository.AdminRepository;

@SpringBootApplication
public class AdminServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AdminServiceApplication.class, args);
	}
	 /*@Bean
    CommandLineRunner init(AdminRepository repository) {
        return args -> {
            if (repository.findByEmail("admin@test.com").isEmpty()) {
                Admin admin = new Admin();
                admin.setName("Test Admin");
                admin.setEmail("admin@test.com");
                admin.setPassword(new BCryptPasswordEncoder().encode("password123"));
                repository.save(admin);
                System.out.println("Test admin created!");
            }
        };
    }*/

}
