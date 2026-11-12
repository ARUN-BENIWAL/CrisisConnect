package com.crisisconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resolution_reports")
public class ResolutionReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crisis_id", nullable = false)
    private Crisis crisis;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responder_id", nullable = false)
    private User responder;

    @Column(name = "actions_taken", nullable = false, columnDefinition = "TEXT")
    private String actionsTaken;

    @Column(name = "resolution_summary", nullable = false, columnDefinition = "TEXT")
    private String resolutionSummary;

    @Column(name = "could_resolve")
    private Boolean couldResolve = true;

    @Column(name = "unable_reason", columnDefinition = "TEXT")
    private String unableReason;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() { resolvedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Crisis getCrisis() { return crisis; }
    public void setCrisis(Crisis crisis) { this.crisis = crisis; }
    public Assignment getAssignment() { return assignment; }
    public void setAssignment(Assignment assignment) { this.assignment = assignment; }
    public User getResponder() { return responder; }
    public void setResponder(User responder) { this.responder = responder; }
    public String getActionsTaken() { return actionsTaken; }
    public void setActionsTaken(String actionsTaken) { this.actionsTaken = actionsTaken; }
    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String summary) { this.resolutionSummary = summary; }
    public Boolean getCouldResolve() { return couldResolve; }
    public void setCouldResolve(Boolean couldResolve) { this.couldResolve = couldResolve; }
    public String getUnableReason() { return unableReason; }
    public void setUnableReason(String unableReason) { this.unableReason = unableReason; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
}
