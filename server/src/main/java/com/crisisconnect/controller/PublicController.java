package com.crisisconnect.controller;

import com.crisisconnect.dto.CrisisDto;
import com.crisisconnect.service.CrisisService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final CrisisService crisisService;

    public PublicController(CrisisService crisisService) {
        this.crisisService = crisisService;
    }

    @PostMapping("/crises")
    public ResponseEntity<CrisisDto.CrisisSubmitResponse> submitCrisis(@Valid @RequestBody CrisisDto.CreateCrisisRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(crisisService.submitCrisis(request));
    }

    @PostMapping("/crises/track")
    public ResponseEntity<CrisisDto.TrackingResponse> trackCrisis(@Valid @RequestBody CrisisDto.TrackingRequest request) {
        return ResponseEntity.ok(crisisService.trackCrisis(request.getPublicId(), request.getTrackingToken()));
    }

    @GetMapping("/crises/track/{publicId}")
    public ResponseEntity<CrisisDto.TrackingResponse> trackCrisisByCode(@PathVariable String publicId) {
        return ResponseEntity.ok(crisisService.trackCrisisPublic(publicId));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSystemStatus() {
        return ResponseEntity.ok(crisisService.getPublicTelemetry());
    }

    @GetMapping("/emergency-contacts")
    public ResponseEntity<Map<String, Object>> getEmergencyContacts() {
        return ResponseEntity.ok(Map.of(
            "campusEmergency", "1800-XXX-XXXX",
            "campusSecurity", "Extension 100",
            "medicalCenter", "Extension 200",
            "fireStation", "101",
            "ambulance", "108",
            "police", "100",
            "note", "CrisisConnect does not replace emergency services. In immediate danger, contact campus security or dial 112."
        ));
    }
}
