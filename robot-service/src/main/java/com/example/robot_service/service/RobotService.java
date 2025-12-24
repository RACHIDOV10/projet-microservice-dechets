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

    public Robot save(Robot robot) {
        return repository.save(robot);
    }

    public List<Robot> findAll() {
        return repository.findAll();
    }

    public Optional<Robot> findById(Long id) {
        return repository.findById(id);
    }

    public List<Robot> findByAdminId(Long adminId) {
        return repository.findByAdminId(adminId);
    }

    public void activateRobot(Long id) {
        repository.findById(id).ifPresent(robot -> {
            robot.setStatus(true);
            repository.save(robot);
        });
    }

    public void deactivateRobot(Long id) {
        repository.findById(id).ifPresent(robot -> {
            robot.setStatus(false);
            repository.save(robot);
        });
    }

    // Ajouter un waste collecté par le robot
    public void addWaste(Long robotId, Long wasteId) {
        repository.findById(robotId).ifPresent(robot -> {
            List<String> wastes = robot.getWasteIds();
            wastes.add(String.valueOf(wasteId));
            robot.setWasteIds(wastes);
            repository.save(robot);
        });
    }
}
