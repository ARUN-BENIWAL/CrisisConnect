package com.crisisconnect.service;

import com.crisisconnect.dto.CrisisDto;
import com.crisisconnect.dto.DashboardDto;
import com.crisisconnect.entity.*;
import com.crisisconnect.exception.GlobalExceptionHandler.*;
import com.crisisconnect.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CrisisService {

    private final CrisisRepository crisisRepository;
    private final CrisisCategoryRepository categoryRepository;
    private final AssignmentRepository assignmentRepository;
    private final CrisisStatusHistoryRepository statusHistoryRepository;
    private final ResolutionReportRepository resolutionReportRepository;
    private final ProgressNoteRepository progressNoteRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    public CrisisService(CrisisRepository crisisRepository, CrisisCategoryRepository categoryRepository,
                          AssignmentRepository assignmentRepository, CrisisStatusHistoryRepository statusHistoryRepository,
                          ResolutionReportRepository resolutionReportRepository, ProgressNoteRepository progressNoteRepository,
                          UserRepository userRepository, AuditService auditService, PasswordEncoder passwordEncoder) {
        this.crisisRepository = crisisRepository;
        this.categoryRepository = categoryRepository;
        this.assignmentRepository = assignmentRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.resolutionReportRepository = resolutionReportRepository;
        this.progressNoteRepository = progressNoteRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.passwordEncoder = passwordEncoder;
    }

    // === PUBLIC: Submit crisis ===
    @Transactional
    public CrisisDto.CrisisSubmitResponse submitCrisis(CrisisDto.CreateCrisisRequest request) {
        CrisisCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new BadRequestException("Invalid category"));

        Crisis.Severity severity;
        try {
            severity = Crisis.Severity.valueOf(request.getSeverity().toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid severity: " + request.getSeverity());
        }

        String publicId = generatePublicId();
        String trackingToken = generateTrackingToken();
        String tokenHash = passwordEncoder.encode(trackingToken);

        Crisis crisis = new Crisis();
        crisis.setPublicId(publicId);
        crisis.setTrackingTokenHash(tokenHash);
        crisis.setTitle(request.getTitle());
        crisis.setDescription(request.getDescription());
        crisis.setCategory(category);
        crisis.setSeverity(severity);
        crisis.setLocation(request.getLocation());
        crisis.setBuilding(request.getBuilding());
        crisis.setFloor(request.getFloor());
        crisis.setRoom(request.getRoom());
        crisis.setLocationDetails(request.getLocationDetails());
        crisis.setReporterName(request.getReporterName());
        crisis.setReporterEmail(request.getReporterEmail());
        crisis.setReporterPhone(request.getReporterPhone());

        crisis = crisisRepository.save(crisis);
        addStatusHistory(crisis, null, "SUBMITTED", null, "Crisis submitted by reporter");

        auditService.logPublic("CRISIS_SUBMITTED", "CRISIS", crisis.getId(), "Crisis '" + crisis.getTitle() + "' submitted");

        // Notify all admins
        List<User> admins = userRepository.findByRoleAndIsActive(User.Role.ADMIN, true);
        for (User admin : admins) {
            auditService.notify(admin, "New Crisis Report", "New " + severity + " crisis: " + crisis.getTitle(),
                    Notification.Type.SYSTEM, "CRISIS", crisis.getId());
        }

        return new CrisisDto.CrisisSubmitResponse(publicId, trackingToken);
    }

    // === PUBLIC: Track crisis with token ===
    public CrisisDto.TrackingResponse trackCrisis(String publicId, String trackingToken) {
        Crisis crisis = crisisRepository.findByPublicId(publicId)
                .orElseThrow(() -> new NotFoundException("Crisis not found"));

        if (!passwordEncoder.matches(trackingToken, crisis.getTrackingTokenHash())) {
            throw new UnauthorizedException("Invalid tracking token");
        }

        return toTrackingResponse(crisis);
    }

    // === PUBLIC: Track crisis by public code ===
    public CrisisDto.TrackingResponse trackCrisisPublic(String publicId) {
        Crisis crisis = crisisRepository.findByPublicId(publicId)
                .orElseThrow(() -> new NotFoundException("Crisis not found with code: " + publicId));

        return toTrackingResponse(crisis);
    }

    // === PUBLIC: Telemetry & System Status ===
    public Map<String, Object> getPublicTelemetry() {
        long active = crisisRepository.countActive();
        long resolved = crisisRepository.countByStatus(Crisis.Status.RESOLVED) + crisisRepository.countByStatus(Crisis.Status.CLOSED);
        long total = crisisRepository.count();
        return Map.of(
            "systemStatus", "OPERATIONAL",
            "activeIncidents", active,
            "resolvedIncidents", resolved,
            "totalRecorded", total,
            "dispatchReadiness", "24/7 ACTIVE",
            "lastTelemetrySync", LocalDateTime.now().toString()
        );
    }

    private CrisisDto.TrackingResponse toTrackingResponse(Crisis crisis) {
        CrisisDto.TrackingResponse response = new CrisisDto.TrackingResponse();
        response.setPublicId(crisis.getPublicId());
        response.setTitle(crisis.getTitle());
        response.setDescription(crisis.getDescription());
        response.setSeverity(crisis.getSeverity().name());
        response.setStatus(crisis.getStatus().name());
        response.setSubmittedAt(crisis.getCreatedAt() != null ? crisis.getCreatedAt().toString() : "");
        response.setLastUpdate(crisis.getUpdatedAt() != null ? crisis.getUpdatedAt().toString() : "");
        response.setCategoryName(crisis.getCategory() != null ? crisis.getCategory().getName() : "");
        return response;
    }

    // === ADMIN: Get all crises ===
    public Page<CrisisDto.CrisisResponse> getAllCrises(String search, String status, String severity,
                                                       Long categoryId, Pageable pageable) {
        Crisis.Status statusEnum = null;
        Crisis.Severity severityEnum = null;
        try { if (status != null) statusEnum = Crisis.Status.valueOf(status); } catch (Exception ignored) {}
        try { if (severity != null) severityEnum = Crisis.Severity.valueOf(severity); } catch (Exception ignored) {}

        return crisisRepository.searchCrises(search, statusEnum, severityEnum, categoryId, pageable)
                .map(this::toCrisisResponse);
    }

    // === ADMIN: Get crisis details ===
    public CrisisDto.CrisisResponse getCrisisById(Long id) {
        Crisis crisis = crisisRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Crisis not found"));
        return toCrisisResponse(crisis);
    }

    // === ADMIN: Update crisis ===
    @Transactional
    public CrisisDto.CrisisResponse adminUpdateCrisis(Long id, CrisisDto.AdminUpdateRequest request, User admin) {
        Crisis crisis = crisisRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Crisis not found"));

        String oldStatus = crisis.getStatus().name();
        boolean statusChanged = false;

        if (request.getSeverity() != null) {
            crisis.setSeverity(Crisis.Severity.valueOf(request.getSeverity()));
        }
        if (request.getPriority() != null) {
            crisis.setPriority(request.getPriority());
        }
        if (request.getAdminNotes() != null) {
            crisis.setAdminNotes(request.getAdminNotes());
        }
        if (request.getStatus() != null) {
            Crisis.Status newStatus = Crisis.Status.valueOf(request.getStatus());

            // Validate specific transitions
            if (newStatus == Crisis.Status.INVALID) {
                String reason = (request.getInvalidReason() != null && !request.getInvalidReason().isBlank())
                        ? request.getInvalidReason()
                        : request.getAdminNotes();
                if (reason == null || reason.isBlank()) {
                    reason = "Dismissed by admin dispatcher";
                }
                crisis.setInvalidReason(reason);
            }
            if (newStatus == Crisis.Status.DUPLICATE) {
                if (request.getDuplicateOfId() == null) {
                    throw new BadRequestException("Duplicate reference is required");
                }
                crisis.setDuplicateOfId(request.getDuplicateOfId());
            }

            crisis.setStatus(newStatus);
            statusChanged = true;

            // Free all active responders when admin terminates the case
            if (newStatus == Crisis.Status.RESOLVED ||
                newStatus == Crisis.Status.CLOSED ||
                newStatus == Crisis.Status.INVALID) {
                freeRespondersForCrisis(crisis.getId());
            }
        }

        crisis = crisisRepository.save(crisis);

        if (statusChanged) {
            addStatusHistory(crisis, oldStatus, crisis.getStatus().name(), admin, request.getAdminNotes());
        }

        auditService.log(admin.getId(), admin.getFullName(), "CRISIS_UPDATED", "CRISIS", crisis.getId(),
                "Crisis updated by admin" + (statusChanged ? " — status: " + crisis.getStatus() : ""));

        return toCrisisResponse(crisis);
    }

    // === ADMIN: Assign responder ===
    @Transactional
    public void assignResponder(CrisisDto.AssignRequest request, User admin) {
        Crisis crisis = crisisRepository.findById(request.getCrisisId())
                .orElseThrow(() -> new NotFoundException("Crisis not found"));

        User responder = userRepository.findById(request.getResponderId())
                .orElseThrow(() -> new NotFoundException("Responder not found"));

        if (!responder.getIsActive()) {
            throw new BadRequestException("Responder is deactivated");
        }

        // Prevent duplicate active assignment
        if (assignmentRepository.existsByCrisisIdAndResponderIdAndIsActive(
                crisis.getId(), responder.getId(), true)) {
            throw new BadRequestException("Responder is already actively assigned to this crisis");
        }

        Assignment assignment = new Assignment();
        assignment.setCrisis(crisis);
        assignment.setResponder(responder);
        assignment.setInstructions(request.getInstructions());
        assignment.setPriority(request.getPriority() != null ? request.getPriority() : 0);
        assignment.setAssignedBy(admin);
        assignmentRepository.save(assignment);

        // Update crisis status
        if (crisis.getStatus() == Crisis.Status.SUBMITTED || crisis.getStatus() == Crisis.Status.UNDER_REVIEW) {
            String oldStatus = crisis.getStatus().name();
            crisis.setStatus(Crisis.Status.ASSIGNED);
            crisisRepository.save(crisis);
            addStatusHistory(crisis, oldStatus, "ASSIGNED", admin, "Responder assigned: " + responder.getFullName());
        }

        // Update responder availability
        responder.setAvailability(User.Availability.BUSY);
        userRepository.save(responder);

        // Notify responder
        auditService.notify(responder, "New Assignment",
                "You have been assigned to crisis: " + crisis.getTitle(),
                Notification.Type.ASSIGNMENT, "CRISIS", crisis.getId());

        auditService.log(admin.getId(), admin.getFullName(), "RESPONDER_ASSIGNED", "ASSIGNMENT",
                assignment.getId(), "Responder " + responder.getFullName() + " assigned to " + crisis.getPublicId());
    }

    // === RESPONDER: Get my assignments ===
    public List<Map<String, Object>> getResponderAssignments(Long responderId) {
        List<Assignment> assignments = assignmentRepository.findActiveByResponder(responderId);
        return assignments.stream().map(a -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("assignmentId", a.getId());
            map.put("crisisId", a.getCrisis().getId());
            map.put("publicId", a.getCrisis().getPublicId());
            map.put("title", a.getCrisis().getTitle());
            map.put("categoryName", a.getCrisis().getCategory().getName());
            map.put("severity", a.getCrisis().getSeverity().name());
            map.put("crisisStatus", a.getCrisis().getStatus().name());
            map.put("assignmentStatus", a.getStatus().name());
            map.put("location", a.getCrisis().getLocation());
            map.put("building", a.getCrisis().getBuilding());
            map.put("floor", a.getCrisis().getFloor());
            map.put("room", a.getCrisis().getRoom());
            map.put("locationDetails", a.getCrisis().getLocationDetails());
            map.put("description", a.getCrisis().getDescription());
            map.put("instructions", a.getInstructions());
            map.put("priority", a.getPriority());
            map.put("assignedAt", a.getAssignedAt() != null ? a.getAssignedAt().toString() : null);
            map.put("acceptedAt", a.getAcceptedAt() != null ? a.getAcceptedAt().toString() : null);
            return map;
        }).collect(Collectors.toList());
    }

    // === RESPONDER: Get assignment details, notes, and timeline ===
    public CrisisDto.CrisisResponse getResponderAssignmentDetails(Long assignmentId, User responder) {
        Assignment a = getAssignmentForResponder(assignmentId, responder);
        return toCrisisResponse(a.getCrisis());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getResponderAssignmentNotes(Long assignmentId, User responder) {
        Assignment a = getAssignmentForResponder(assignmentId, responder);
        return getProgressNotes(a.getCrisis().getId());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getResponderAssignmentTimeline(Long assignmentId, User responder) {
        Assignment a = getAssignmentForResponder(assignmentId, responder);
        return getStatusHistory(a.getCrisis().getId());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getResponderAssignmentResolutions(Long assignmentId, User responder) {
        Assignment a = getAssignmentForResponder(assignmentId, responder);
        return getResolutionReports(a.getCrisis().getId());
    }

    // === RESPONDER: Accept assignment ===
    @Transactional
    public void acceptAssignment(Long assignmentId, User responder) {
        Assignment a = getAssignmentForResponder(assignmentId, responder);
        if (a.getStatus() != Assignment.Status.ASSIGNED) {
            throw new BadRequestException("Assignment is not in ASSIGNED status");
        }
        a.setStatus(Assignment.Status.ACCEPTED);
        a.setAcceptedAt(LocalDateTime.now());
        assignmentRepository.save(a);

        Crisis crisis = a.getCrisis();
        String oldStatus = crisis.getStatus().name();
        crisis.setStatus(Crisis.Status.ACCEPTED);
        crisisRepository.save(crisis);
        addStatusHistory(crisis, oldStatus, "ACCEPTED", responder, "Assignment accepted by " + responder.getFullName());

        auditService.log(responder.getId(), responder.getFullName(), "ASSIGNMENT_ACCEPTED", "ASSIGNMENT", a.getId(), null);

        // Notify admins
        notifyAdmins("Assignment Accepted", responder.getFullName() + " accepted assignment for " + crisis.getTitle(),
                Notification.Type.STATUS_UPDATE, crisis.getId());
    }

    // === RESPONDER: Update assignment status ===
    @Transactional
    public void updateAssignmentStatus(Long assignmentId, CrisisDto.StatusUpdateRequest request, User responder) {
        Assignment a = getAssignmentForResponder(assignmentId, responder);
        Assignment.Status newStatus;
        try {
            newStatus = Assignment.Status.valueOf(request.getStatus());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status: " + request.getStatus());
        }

        a.setStatus(newStatus);
        if (newStatus == Assignment.Status.RESOLVED) {
            a.setCompletedAt(LocalDateTime.now());
        }
        assignmentRepository.save(a);

        // Update crisis status accordingly
        Crisis crisis = a.getCrisis();
        String oldCrisisStatus = crisis.getStatus().name();
        Crisis.Status newCrisisStatus = mapAssignmentToCrisisStatus(newStatus);
        if (newCrisisStatus != null) {
            crisis.setStatus(newCrisisStatus);
            crisisRepository.save(crisis);
            addStatusHistory(crisis, oldCrisisStatus, newCrisisStatus.name(), responder, request.getNotes());
        }

        if (newStatus == Assignment.Status.RESOLVED) {
            responder.setAvailability(User.Availability.AVAILABLE);
            userRepository.save(responder);
        }

        auditService.log(responder.getId(), responder.getFullName(), "STATUS_CHANGED", "ASSIGNMENT", a.getId(),
                "Status changed to " + newStatus);

        notifyAdmins("Status Update", responder.getFullName() + ": " + crisis.getTitle() + " → " + newStatus,
                Notification.Type.STATUS_UPDATE, crisis.getId());
    }

    // === RESPONDER: Add progress note ===
    @Transactional
    public void addProgressNote(Long assignmentId, CrisisDto.ProgressNoteRequest request, User responder) {
        Assignment a = getAssignmentForResponder(assignmentId, responder);

        ProgressNote note = new ProgressNote();
        note.setAssignment(a);
        note.setCrisis(a.getCrisis());
        note.setResponder(responder);
        note.setNote(request.getNote());
        progressNoteRepository.save(note);

        auditService.log(responder.getId(), responder.getFullName(), "PROGRESS_NOTE_ADDED", "ASSIGNMENT", a.getId(), null);
    }

    // === RESPONDER: Submit resolution ===
    @Transactional
    public void submitResolution(Long assignmentId, CrisisDto.ResolutionRequest request, User responder) {
        Assignment a = getAssignmentForResponder(assignmentId, responder);

        if (!request.getCouldResolve() && (request.getUnableReason() == null || request.getUnableReason().isBlank())) {
            throw new BadRequestException("Reason is required when unable to resolve");
        }

        ResolutionReport report = new ResolutionReport();
        report.setCrisis(a.getCrisis());
        report.setAssignment(a);
        report.setResponder(responder);
        report.setActionsTaken(request.getActionsTaken());
        report.setResolutionSummary(request.getResolutionSummary());
        report.setCouldResolve(request.getCouldResolve());
        report.setUnableReason(request.getUnableReason());
        resolutionReportRepository.save(report);

        // Update assignment and crisis
        a.setStatus(Assignment.Status.RESOLVED);
        a.setCompletedAt(LocalDateTime.now());
        assignmentRepository.save(a);

        Crisis crisis = a.getCrisis();
        String oldStatus = crisis.getStatus().name();
        crisis.setStatus(Crisis.Status.RESOLVED);
        crisisRepository.save(crisis);
        addStatusHistory(crisis, oldStatus, "RESOLVED", responder, request.getResolutionSummary());

        responder.setAvailability(User.Availability.AVAILABLE);
        userRepository.save(responder);

        auditService.log(responder.getId(), responder.getFullName(), "RESOLUTION_SUBMITTED", "CRISIS", crisis.getId(),
                request.getCouldResolve() ? "Resolved" : "Unable to resolve: " + request.getUnableReason());

        notifyAdmins("Resolution Submitted", responder.getFullName() + " submitted resolution for " + crisis.getTitle(),
                Notification.Type.RESOLUTION, crisis.getId());
    }

    // === RESPONDER: Request help ===
    @Transactional
    public void requestHelp(Long assignmentId, String message, User responder) {
        Assignment a = getAssignmentForResponder(assignmentId, responder);

        notifyAdmins("Help Requested", responder.getFullName() + " requests additional help for " + a.getCrisis().getTitle()
                        + (message != null ? ": " + message : ""),
                Notification.Type.HELP_REQUEST, a.getCrisis().getId());

        auditService.log(responder.getId(), responder.getFullName(), "HELP_REQUESTED", "ASSIGNMENT", a.getId(), message);
    }

    // === ADMIN: Close crisis ===
    @Transactional
    public void closeCrisis(Long crisisId, User admin) {
        Crisis crisis = crisisRepository.findById(crisisId)
                .orElseThrow(() -> new NotFoundException("Crisis not found"));

        if (crisis.getStatus() != Crisis.Status.RESOLVED) {
            throw new BadRequestException("Only resolved crises can be closed");
        }

        String oldStatus = crisis.getStatus().name();
        crisis.setStatus(Crisis.Status.CLOSED);
        crisisRepository.save(crisis);
        addStatusHistory(crisis, oldStatus, "CLOSED", admin, "Closed by admin");

        // Ensure all responders are freed when admin closes a case
        freeRespondersForCrisis(crisisId);

        auditService.log(admin.getId(), admin.getFullName(), "CRISIS_CLOSED", "CRISIS", crisis.getId(), null);
    }

    // === ADMIN: Reopen crisis ===
    @Transactional
    public void reopenCrisis(Long crisisId, String reason, User admin) {
        Crisis crisis = crisisRepository.findById(crisisId)
                .orElseThrow(() -> new NotFoundException("Crisis not found"));

        String oldStatus = crisis.getStatus().name();
        crisis.setStatus(Crisis.Status.UNDER_REVIEW);
        crisisRepository.save(crisis);
        addStatusHistory(crisis, oldStatus, "UNDER_REVIEW", admin, "Reopened: " + reason);

        auditService.log(admin.getId(), admin.getFullName(), "CRISIS_REOPENED", "CRISIS", crisis.getId(), reason);
    }

    // === ADMIN Dashboard ===
    public DashboardDto.AdminDashboard getAdminDashboard() {
        DashboardDto.AdminDashboard d = new DashboardDto.AdminDashboard();
        d.setTotalCrises(crisisRepository.count());
        d.setUnreviewedReports(crisisRepository.countByStatus(Crisis.Status.SUBMITTED));
        d.setUnassignedCrises(crisisRepository.countByStatus(Crisis.Status.SUBMITTED) + crisisRepository.countByStatus(Crisis.Status.UNDER_REVIEW));
        d.setAssignedCrises(crisisRepository.countByStatus(Crisis.Status.ASSIGNED));
        d.setActiveCrises(crisisRepository.countActive());
        d.setCriticalCrises(crisisRepository.countActiveCritical());
        d.setResolvedCrises(crisisRepository.countByStatus(Crisis.Status.RESOLVED));
        d.setClosedCrises(crisisRepository.countByStatus(Crisis.Status.CLOSED));

        // Category breakdown
        d.setByCategory(crisisRepository.countByCategory().stream()
                .map(r -> Map.of("name", (Object) r[0], "count", (Object) r[1]))
                .collect(Collectors.toList()));

        // Severity breakdown
        d.setBySeverity(crisisRepository.countGroupedBySeverity().stream()
                .map(r -> Map.of("name", (Object) r[0].toString(), "count", (Object) r[1]))
                .collect(Collectors.toList()));

        // Status breakdown
        d.setByStatus(crisisRepository.countGroupedByStatus().stream()
                .map(r -> Map.of("name", (Object) r[0].toString(), "count", (Object) r[1]))
                .collect(Collectors.toList()));

        // Daily trend (last 30 days)
        d.setDailyTrend(crisisRepository.countByDay(LocalDateTime.now().minusDays(30)).stream()
                .map(r -> Map.of("date", (Object) r[0].toString(), "count", (Object) r[1]))
                .collect(Collectors.toList()));

        return d;
    }

    // === RESPONDER Dashboard ===
    public DashboardDto.ResponderDashboard getResponderDashboard(Long responderId) {
        DashboardDto.ResponderDashboard d = new DashboardDto.ResponderDashboard();
        d.setTotalAssigned(assignmentRepository.countActiveByResponder(responderId) +
                assignmentRepository.countByResponderAndStatus(responderId, Assignment.Status.RESOLVED));
        d.setNewlyAssigned(assignmentRepository.countByResponderAndStatus(responderId, Assignment.Status.ASSIGNED));
        d.setAccepted(assignmentRepository.countByResponderAndStatus(responderId, Assignment.Status.ACCEPTED));
        d.setInProgress(assignmentRepository.countByResponderAndStatus(responderId, Assignment.Status.IN_PROGRESS));
        d.setResolved(assignmentRepository.countByResponderAndStatus(responderId, Assignment.Status.RESOLVED));

        // Count critical
        List<Assignment> active = assignmentRepository.findActiveByResponder(responderId);
        d.setCritical(active.stream().filter(a -> a.getCrisis().getSeverity() == Crisis.Severity.CRITICAL).count());

        return d;
    }

    // === Get status history ===
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getStatusHistory(Long crisisId) {
        return statusHistoryRepository.findByCrisisIdOrderByCreatedAtDesc(crisisId).stream()
                .map(h -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", h.getId());
                    m.put("oldStatus", h.getOldStatus());
                    m.put("newStatus", h.getNewStatus());
                    m.put("changedBy", h.getChangedBy() != null ? h.getChangedBy().getFullName() : "System");
                    m.put("notes", h.getNotes());
                    m.put("createdAt", h.getCreatedAt().toString());
                    return m;
                }).collect(Collectors.toList());
    }

    // === Get resolution reports ===
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getResolutionReports(Long crisisId) {
        return resolutionReportRepository.findByCrisisId(crisisId).stream()
                .map(r -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", r.getId());
                    m.put("responderName", r.getResponder().getFullName());
                    m.put("actionsTaken", r.getActionsTaken());
                    m.put("resolutionSummary", r.getResolutionSummary());
                    m.put("couldResolve", r.getCouldResolve());
                    m.put("unableReason", r.getUnableReason());
                    m.put("resolvedAt", r.getResolvedAt().toString());
                    return m;
                }).collect(Collectors.toList());
    }

    // === Get progress notes ===
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getProgressNotes(Long crisisId) {
        return progressNoteRepository.findByCrisisIdOrderByCreatedAtDesc(crisisId).stream()
                .map(n -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", n.getId());
                    m.put("responderName", n.getResponder().getFullName());
                    m.put("note", n.getNote());
                    m.put("createdAt", n.getCreatedAt().toString());
                    return m;
                }).collect(Collectors.toList());
    }

    // === Get assignment history for a crisis ===
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAssignmentHistory(Long crisisId) {
        return assignmentRepository.findByCrisisId(crisisId).stream()
                .map(a -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", a.getId());
                    m.put("responderId", a.getResponder().getId());
                    m.put("responderName", a.getResponder().getFullName());
                    m.put("status", a.getStatus().name());
                    m.put("instructions", a.getInstructions());
                    m.put("assignedAt", a.getAssignedAt() != null ? a.getAssignedAt().toString() : null);
                    m.put("acceptedAt", a.getAcceptedAt() != null ? a.getAcceptedAt().toString() : null);
                    m.put("completedAt", a.getCompletedAt() != null ? a.getCompletedAt().toString() : null);
                    m.put("isActive", a.getIsActive());
                    return m;
                }).collect(Collectors.toList());
    }

    // === Categories ===
    public List<Map<String, Object>> getCategories() {
        return categoryRepository.findByIsActive(true).stream()
                .map(c -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", c.getId());
                    m.put("name", c.getName());
                    m.put("description", c.getDescription());
                    m.put("icon", c.getIcon());
                    return m;
                }).collect(Collectors.toList());
    }

    // === Helpers ===
    private Assignment getAssignmentForResponder(Long assignmentId, User responder) {
        Assignment a = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new NotFoundException("Assignment not found"));
        if (!a.getResponder().getId().equals(responder.getId())) {
            throw new BadRequestException("This assignment does not belong to you");
        }
        return a;
    }

    private void addStatusHistory(Crisis crisis, String oldStatus, String newStatus, User changedBy, String notes) {
        CrisisStatusHistory history = new CrisisStatusHistory();
        history.setCrisis(crisis);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setNotes(notes);
        statusHistoryRepository.save(history);
    }

    /**
     * Finds all active assignments for a crisis and sets those responders to AVAILABLE.
     * Called when admin terminates a case (RESOLVED, CLOSED, DISMISSED/INVALID).
     */
    private void freeRespondersForCrisis(Long crisisId) {
        List<Assignment> activeAssignments = assignmentRepository.findActiveByCrisisId(crisisId);
        for (Assignment a : activeAssignments) {
            User responder = a.getResponder();
            responder.setAvailability(User.Availability.AVAILABLE);
            userRepository.save(responder);
            a.setIsActive(false);
            if (a.getCompletedAt() == null) {
                a.setCompletedAt(LocalDateTime.now());
            }
            assignmentRepository.save(a);
        }
    }

    private void notifyAdmins(String title, String message, Notification.Type type, Long crisisId) {
        List<User> admins = userRepository.findByRoleAndIsActive(User.Role.ADMIN, true);
        for (User admin : admins) {
            auditService.notify(admin, title, message, type, "CRISIS", crisisId);
        }
    }

    private Crisis.Status mapAssignmentToCrisisStatus(Assignment.Status assignmentStatus) {
        return switch (assignmentStatus) {
            case ACCEPTED -> Crisis.Status.ACCEPTED;
            case ON_THE_WAY -> Crisis.Status.ON_THE_WAY;
            case ARRIVED -> Crisis.Status.ARRIVED;
            case IN_PROGRESS -> Crisis.Status.IN_PROGRESS;
            case RESOLVED -> Crisis.Status.RESOLVED;
            default -> null;
        };
    }

    private CrisisDto.CrisisResponse toCrisisResponse(Crisis c) {
        CrisisDto.CrisisResponse r = new CrisisDto.CrisisResponse();
        r.setId(c.getId());
        r.setPublicId(c.getPublicId());
        r.setTitle(c.getTitle());
        r.setDescription(c.getDescription());
        r.setCategoryName(c.getCategory().getName());
        r.setCategoryId(c.getCategory().getId());
        r.setSeverity(c.getSeverity().name());
        r.setStatus(c.getStatus().name());
        r.setPriority(c.getPriority());
        r.setLocation(c.getLocation());
        r.setBuilding(c.getBuilding());
        r.setFloor(c.getFloor());
        r.setRoom(c.getRoom());
        r.setLocationDetails(c.getLocationDetails());
        r.setReporterName(c.getReporterName());
        r.setReporterEmail(c.getReporterEmail());
        r.setReporterPhone(c.getReporterPhone());
        r.setAdminNotes(c.getAdminNotes());
        r.setInvalidReason(c.getInvalidReason());
        r.setCreatedAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
        r.setUpdatedAt(c.getUpdatedAt() != null ? c.getUpdatedAt().toString() : null);
        return r;
    }

    private String generatePublicId() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder("CC-");
        for (int i = 0; i < 8; i++) sb.append(chars.charAt(secureRandom.nextInt(chars.length())));
        return sb.toString();
    }

    private String generateTrackingToken() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 32; i++) sb.append(chars.charAt(secureRandom.nextInt(chars.length())));
        return sb.toString();
    }
}
