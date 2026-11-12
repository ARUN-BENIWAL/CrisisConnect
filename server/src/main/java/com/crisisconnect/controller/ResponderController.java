package com.crisisconnect.controller;

import com.crisisconnect.dto.CrisisDto;
import com.crisisconnect.dto.DashboardDto;
import com.crisisconnect.entity.User;
import com.crisisconnect.service.AuditService;
import com.crisisconnect.service.CrisisService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/responder")
public class ResponderController {

    private final CrisisService crisisService;
    private final AuditService auditService;

    public ResponderController(CrisisService crisisService, AuditService auditService) {
        this.crisisService = crisisService;
        this.auditService = auditService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto.ResponderDashboard> getDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(crisisService.getResponderDashboard(user.getId()));
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<Map<String, Object>>> getMyAssignments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(crisisService.getResponderAssignments(user.getId()));
    }

    @GetMapping("/assignments/{id}/details")
    public ResponseEntity<CrisisDto.CrisisResponse> getAssignmentDetails(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(crisisService.getResponderAssignmentDetails(id, user));
    }

    @GetMapping("/assignments/{id}/notes")
    public ResponseEntity<List<Map<String, Object>>> getAssignmentNotes(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(crisisService.getResponderAssignmentNotes(id, user));
    }

    @GetMapping("/assignments/{id}/timeline")
    public ResponseEntity<List<Map<String, Object>>> getAssignmentTimeline(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(crisisService.getResponderAssignmentTimeline(id, user));
    }

    @GetMapping("/assignments/{id}/resolutions")
    public ResponseEntity<List<Map<String, Object>>> getAssignmentResolutions(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(crisisService.getResponderAssignmentResolutions(id, user));
    }

    @PostMapping("/assignments/{id}/accept")
    public ResponseEntity<Map<String, String>> acceptAssignment(@PathVariable Long id, @AuthenticationPrincipal User user) {
        crisisService.acceptAssignment(id, user);
        return ResponseEntity.ok(Map.of("message", "Assignment accepted"));
    }

    @PatchMapping("/assignments/{id}/status")
    public ResponseEntity<Map<String, String>> updateStatus(@PathVariable Long id,
            @RequestBody CrisisDto.StatusUpdateRequest request, @AuthenticationPrincipal User user) {
        crisisService.updateAssignmentStatus(id, request, user);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }

    @PostMapping("/assignments/{id}/notes")
    public ResponseEntity<Map<String, String>> addNote(@PathVariable Long id,
            @RequestBody CrisisDto.ProgressNoteRequest request, @AuthenticationPrincipal User user) {
        crisisService.addProgressNote(id, request, user);
        return ResponseEntity.ok(Map.of("message", "Note added"));
    }

    @PostMapping("/assignments/{id}/resolve")
    public ResponseEntity<Map<String, String>> submitResolution(@PathVariable Long id,
            @RequestBody CrisisDto.ResolutionRequest request, @AuthenticationPrincipal User user) {
        crisisService.submitResolution(id, request, user);
        return ResponseEntity.ok(Map.of("message", "Resolution submitted"));
    }

    @PostMapping("/assignments/{id}/help")
    public ResponseEntity<Map<String, String>> requestHelp(@PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body, @AuthenticationPrincipal User user) {
        String message = body != null ? body.get("message") : null;
        crisisService.requestHelp(id, message, user);
        return ResponseEntity.ok(Map.of("message", "Help request sent"));
    }

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
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PatchMapping("/notifications/read-all")
    public ResponseEntity<Map<String, String>> markAllRead(@AuthenticationPrincipal User user) {
        auditService.markAllRead(user.getId());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
