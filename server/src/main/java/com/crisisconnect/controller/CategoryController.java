package com.crisisconnect.controller;

import com.crisisconnect.service.CrisisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private final CrisisService crisisService;

    public CategoryController(CrisisService crisisService) {
        this.crisisService = crisisService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        return ResponseEntity.ok(crisisService.getCategories());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "OK", "service", "CrisisConnect"));
    }
}
