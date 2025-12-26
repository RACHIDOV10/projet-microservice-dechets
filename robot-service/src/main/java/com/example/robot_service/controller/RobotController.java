package com.example.robot_service.controller;

import com.example.robot_service.model.Robot;
import com.example.robot_service.service.RobotService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/robots")
public class RobotController {

    private final RobotService service;

    public RobotController(RobotService service) {
        this.service = service;
    }

    // ================= CREATE =================
    @PostMapping
    public Robot create(@RequestBody Robot robot) {
        robot.setId(null); // forcer la création
        return service.save(robot);
    }

    // ================= READ =================
    @GetMapping
    public List<Robot> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Robot getById(@PathVariable Long id) {
        return service.findById(id).orElse(null);
    }

    @GetMapping("/admin/{adminId}")
    public List<Robot> getByAdmin(@PathVariable Long adminId) {
        return service.findByAdminId(adminId);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public Robot update(@PathVariable Long id, @RequestBody Robot robot) {
        robot.setId(id); // obligatoire pour update
        return service.save(robot);
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // ================= STATUS =================
    @PostMapping("/{id}/activate")
    public void activate(@PathVariable Long id) {
        service.activateRobot(id);
    }

    @PostMapping("/{id}/deactivate")
    public void deactivate(@PathVariable Long id) {
        service.deactivateRobot(id);
    }
}
