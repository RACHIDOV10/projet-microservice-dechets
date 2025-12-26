package com.example.robot_service.service;

import com.example.robot_service.model.Robot;
import com.example.robot_service.repository.RobotRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RobotService {

    private final RobotRepository repository;

    public RobotService(RobotRepository repository) {
        this.repository = repository;
    }

    // CREATE / UPDATE
    public Robot save(Robot robot) {
        return repository.save(robot);
    }

    // READ ALL
    public List<Robot> findAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Optional<Robot> findById(Long id) {
        return repository.findById(id);
    }

    // READ BY ADMIN
    public List<Robot> findByAdminId(Long adminId) {
        return repository.findByAdminId(adminId);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // ACTIVATE
    public void activateRobot(Long id) {
        repository.findById(id).ifPresent(robot -> {
            robot.setStatus(true);
            repository.save(robot);
        });
    }

    // DEACTIVATE
    public void deactivateRobot(Long id) {
        repository.findById(id).ifPresent(robot -> {
            robot.setStatus(false);
            repository.save(robot);
        });
    }
}
