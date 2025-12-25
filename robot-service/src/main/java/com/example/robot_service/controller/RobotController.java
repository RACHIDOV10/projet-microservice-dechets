package com.example.robot_service.controller;

import com.example.robot_service.model.Robot;
import com.example.robot_service.service.RobotService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/robots")
public class RobotController {

    private final RobotService service;

    public RobotController(RobotService service) {
        this.service = service;
    }

    // CRUD Robot
    @PostMapping
    public Robot create(@RequestBody Robot robot) {
        return service.save(robot);
    }

    @GetMapping
    public List<Robot> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Robot getById(@PathVariable Long id) {
        return service.findById(id).orElse(null);
    }

    // Activer / Désactiver robot
    @PostMapping("/{id}/activate")
    public void activate(@PathVariable Long id) {
        service.activateRobot(id);
    }

    @PostMapping("/{id}/deactivate")
    public void deactivate(@PathVariable Long id) {
        service.deactivateRobot(id);
    }



    }

