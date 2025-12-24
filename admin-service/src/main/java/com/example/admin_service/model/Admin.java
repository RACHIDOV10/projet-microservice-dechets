package com.example.admin_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.awt.*;
import java.util.List;

@Data
@Document(collection = "admins")
public class Admin {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;



}
