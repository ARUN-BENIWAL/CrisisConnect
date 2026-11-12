package com.crisisconnect.controller;

import com.crisisconnect.dto.AuthDto;
import com.crisisconnect.dto.CrisisDto;
import com.crisisconnect.dto.DashboardDto;
import com.crisisconnect.entity.User;
import com.crisisconnect.service.AuditService;
import com.crisisconnect.service.AuthService;
import com.crisisconnect.service.CrisisService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CrisisService crisisService;
    private final AuthService authService;
    private final AuditService auditService;

    public AdminController(CrisisService crisisService, AuthService authService, AuditService auditService) {
        this.crisisService = crisisService;
        this.authService = authService;
        this.auditService = auditService;
    }

    // === Dashboard ===
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto.AdminDashboard> getDashboard() {
        return ResponseEntity.ok(crisisService.getAdminDashboard());
    }

    // === Crises ===
    @GetMapping("/crises")
    public ResponseEntity<Page<CrisisDto.CrisisResponse>> getAllCrises(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(crisisService.getAllCrises(search, status, severity, categoryId, pageable));
    }

    @GetMapping("/crises/{id}")
    public ResponseEntity<CrisisDto.CrisisResponse> getCrisis(@PathVariable Long id) {
        return ResponseEntity.ok(crisisService.getCrisisById(id));
    }

    @PatchMapping("/crises/{id}")
    public ResponseEntity<CrisisDto.CrisisResponse> updateCrisis(@PathVariable Long id,
            @RequestBody CrisisDto.AdminUpdateRequest request, @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(crisisService.adminUpdateCrisis(id, request, admin));
    }

    @GetMapping("/crises/{id}/history")
    public ResponseEntity<List<Map<String, Object>>> getStatusHistory(@PathVariable Long id) {
        return ResponseEntity.ok(crisisService.getStatusHistory(id));
    }

    @GetMapping("/crises/{id}/assignments")
    public ResponseEntity<List<Map<String, Object>>> getAssignmentHistory(@PathVariable Long id) {
        return ResponseEntity.ok(crisisService.getAssignmentHistory(id));
    }

    @GetMapping("/crises/{id}/resolutions")
    public ResponseEntity<List<Map<String, Object>>> getResolutions(@PathVariable Long id) {
        return ResponseEntity.ok(crisisService.getResolutionReports(id));
    }

    @GetMapping("/crises/{id}/notes")
    public ResponseEntity<List<Map<String, Object>>> getProgressNotes(@PathVariable Long id) {
        return ResponseEntity.ok(crisisService.getProgressNotes(id));
    }

    @PostMapping("/crises/{id}/close")
    public ResponseEntity<Map<String, String>> closeCrisis(@PathVariable Long id, @AuthenticationPrincipal User admin) {
        crisisService.closeCrisis(id, admin);
        return ResponseEntity.ok(Map.of("message", "Crisis closed"));
    }

    @PostMapping("/crises/{id}/reopen")
    public ResponseEntity<Map<String, String>> reopenCrisis(@PathVariable Long id,
            @RequestBody Map<String, String> body, @AuthenticationPrincipal User admin) {
        crisisService.reopenCrisis(id, body.get("reason"), admin);
        return ResponseEntity.ok(Map.of("message", "Crisis reopened"));
    }

    // === Assignments ===
    @PostMapping("/assignments")
    public ResponseEntity<Map<String, String>> assignResponder(@Valid @RequestBody CrisisDto.AssignRequest request,
            @AuthenticationPrincipal User admin) {
        crisisService.assignResponder(request, admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Responder assigned"));
    }

    // === Responder Management ===
    @GetMapping("/responders")
    public ResponseEntity<List<AuthDto.UserResponse>> getResponders() {
        return ResponseEntity.ok(authService.getResponders());
    }

    @GetMapping("/responders/{id}")
    public ResponseEntity<AuthDto.UserResponse> getResponder(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getResponder(id));
    }

    @PostMapping("/responders")
    public ResponseEntity<AuthDto.UserResponse> createResponder(@Valid @RequestBody AuthDto.CreateUserRequest request,
            @AuthenticationPrincipal User admin) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.createResponder(request, admin));
    }

    @PutMapping("/responders/{id}")
    public ResponseEntity<AuthDto.UserResponse> updateResponder(@PathVariable Long id,
            @Valid @RequestBody AuthDto.CreateUserRequest request, @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(authService.updateResponder(id, request, admin));
    }

    @PatchMapping("/responders/{id}/activate")
    public ResponseEntity<Map<String, String>> activateResponder(@PathVariable Long id, @AuthenticationPrincipal User admin) {
        authService.toggleResponderActive(id, true, admin);
        return ResponseEntity.ok(Map.of("message", "Responder activated"));
    }

    @PatchMapping("/responders/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivateResponder(@PathVariable Long id, @AuthenticationPrincipal User admin) {
        authService.toggleResponderActive(id, false, admin);
        return ResponseEntity.ok(Map.of("message", "Responder deactivated"));
    }

    // === Audit Logs ===
    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditService.getAuditLogs(pageable));
    }

    // === Notifications ===
    @GetMapping("/notifications")
    public ResponseEntity<Map<String, Object>> getNotifications(@AuthenticationPrincipal User user,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(Map.of(
            "notifications", auditService.getNotifications(user.getId(), pageable).getContent(),
            "unreadCount", auditService.getUnreadCount(user.getId())
        ));
    }

    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<Map<String, String>> markRead(@PathVariable Long id, @AuthenticationPrincipal User user) {
        auditService.markNotificationRead(id, user.getId());
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    @PatchMapping("/notifications/read-all")
    public ResponseEntity<Map<String, String>> markAllRead(@AuthenticationPrincipal User user) {
        auditService.markAllRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "All marked as read"));
    }
}
