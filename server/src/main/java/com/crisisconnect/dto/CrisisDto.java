package com.crisisconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CrisisDto {

    public static class CreateCrisisRequest {
        @NotBlank(message = "Title is required")
        @Size(max = 200)
        private String title;

        @NotNull(message = "Category is required")
        private Long categoryId;

        @NotBlank(message = "Description is required")
        private String description;

        @NotBlank(message = "Location is required")
        private String location;

        private String building;
        private String floor;
        private String room;
        private String locationDetails;

        @NotBlank(message = "Severity is required")
        private String severity;

        private String reporterName;
        private String reporterEmail;
        private String reporterPhone;

        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getBuilding() { return building; }
        public void setBuilding(String building) { this.building = building; }
        public String getFloor() { return floor; }
        public void setFloor(String floor) { this.floor = floor; }
        public String getRoom() { return room; }
        public void setRoom(String room) { this.room = room; }
        public String getLocationDetails() { return locationDetails; }
        public void setLocationDetails(String locationDetails) { this.locationDetails = locationDetails; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getReporterName() { return reporterName; }
        public void setReporterName(String reporterName) { this.reporterName = reporterName; }
        public String getReporterEmail() { return reporterEmail; }
        public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
        public String getReporterPhone() { return reporterPhone; }
        public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
    }

    public static class CrisisResponse {
        private Long id;
        private String publicId;
        private String title;
        private String description;
        private String categoryName;
        private Long categoryId;
        private String severity;
        private String status;
        private Integer priority;
        private String location;
        private String building;
        private String floor;
        private String room;
        private String locationDetails;
        private String reporterName;
        private String reporterEmail;
        private String reporterPhone;
        private String adminNotes;
        private String invalidReason;
        private String createdAt;
        private String updatedAt;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getPublicId() { return publicId; }
        public void setPublicId(String publicId) { this.publicId = publicId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Integer getPriority() { return priority; }
        public void setPriority(Integer priority) { this.priority = priority; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getBuilding() { return building; }
        public void setBuilding(String building) { this.building = building; }
        public String getFloor() { return floor; }
        public void setFloor(String floor) { this.floor = floor; }
        public String getRoom() { return room; }
        public void setRoom(String room) { this.room = room; }
        public String getLocationDetails() { return locationDetails; }
        public void setLocationDetails(String locationDetails) { this.locationDetails = locationDetails; }
        public String getReporterName() { return reporterName; }
        public void setReporterName(String reporterName) { this.reporterName = reporterName; }
        public String getReporterEmail() { return reporterEmail; }
        public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
        public String getReporterPhone() { return reporterPhone; }
        public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
        public String getAdminNotes() { return adminNotes; }
        public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
        public String getInvalidReason() { return invalidReason; }
        public void setInvalidReason(String invalidReason) { this.invalidReason = invalidReason; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
        public String getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
    }

    public static class CrisisSubmitResponse {
        private String publicId;
        private String trackingToken;
        private String message;

        public CrisisSubmitResponse(String publicId, String trackingToken) {
            this.publicId = publicId;
            this.trackingToken = trackingToken;
            this.message = "Crisis reported successfully. Save your Crisis ID and tracking token to track your report.";
        }

        public String getPublicId() { return publicId; }
        public String getTrackingToken() { return trackingToken; }
        public String getMessage() { return message; }
    }

    public static class TrackingRequest {
        @NotBlank private String publicId;
        @NotBlank private String trackingToken;
        public String getPublicId() { return publicId; }
        public void setPublicId(String publicId) { this.publicId = publicId; }
        public String getTrackingToken() { return trackingToken; }
        public void setTrackingToken(String trackingToken) { this.trackingToken = trackingToken; }
    }

    public static class TrackingResponse {
        private String publicId;
        private String title;
        private String description;
        private String severity;
        private String status;
        private String submittedAt;
        private String lastUpdate;
        private String categoryName;

        public String getPublicId() { return publicId; }
        public void setPublicId(String publicId) { this.publicId = publicId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }
        public String getLastUpdate() { return lastUpdate; }
        public void setLastUpdate(String lastUpdate) { this.lastUpdate = lastUpdate; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    }

    public static class AssignRequest {
        @NotNull(message = "Crisis ID is required")
        private Long crisisId;

        @NotNull(message = "Responder ID is required")
        private Long responderId;

        private String instructions;
        private Integer priority;

        public Long getCrisisId() { return crisisId; }
        public void setCrisisId(Long crisisId) { this.crisisId = crisisId; }
        public Long getResponderId() { return responderId; }
        public void setResponderId(Long responderId) { this.responderId = responderId; }
        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
        public Integer getPriority() { return priority; }
        public void setPriority(Integer priority) { this.priority = priority; }
    }

    public static class StatusUpdateRequest {
        @NotBlank(message = "Status is required")
        private String status;
        private String notes;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class ResolutionRequest {
        @NotBlank(message = "Actions taken is required")
        private String actionsTaken;

        @NotBlank(message = "Resolution summary is required")
        private String resolutionSummary;

        private Boolean couldResolve = true;
        private String unableReason;

        public String getActionsTaken() { return actionsTaken; }
        public void setActionsTaken(String actionsTaken) { this.actionsTaken = actionsTaken; }
        public String getResolutionSummary() { return resolutionSummary; }
        public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }
        public Boolean getCouldResolve() { return couldResolve; }
        public void setCouldResolve(Boolean couldResolve) { this.couldResolve = couldResolve; }
        public String getUnableReason() { return unableReason; }
        public void setUnableReason(String unableReason) { this.unableReason = unableReason; }
    }

    public static class ProgressNoteRequest {
        @NotBlank(message = "Note is required")
        private String note;
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }

    public static class AdminUpdateRequest {
        private String severity;
        private Integer priority;
        private String adminNotes;
        private String status;
        private String invalidReason;
        private Long duplicateOfId;

        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public Integer getPriority() { return priority; }
        public void setPriority(Integer priority) { this.priority = priority; }
        public String getAdminNotes() { return adminNotes; }
        public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getInvalidReason() { return invalidReason; }
        public void setInvalidReason(String invalidReason) { this.invalidReason = invalidReason; }
        public Long getDuplicateOfId() { return duplicateOfId; }
        public void setDuplicateOfId(Long duplicateOfId) { this.duplicateOfId = duplicateOfId; }
    }
}
