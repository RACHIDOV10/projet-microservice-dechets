package com.example.robot_service.repository;

import com.example.robot_service.model.Robot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RobotRepository extends JpaRepository<Robot, Long> {

    List<Robot> findByAdminId(String adminId);
}
