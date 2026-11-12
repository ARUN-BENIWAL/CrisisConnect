package com.crisisconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class AuthDto {

    public static class LoginRequest {
        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String role;

        public LoginResponse(String token, Long id, String username, String email, String fullName, String role) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
        }

        public String getToken() { return token; }
        public String getType() { return type; }
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public String getRole() { return role; }
    }

    public static class CreateUserRequest {
        @NotBlank @Size(min = 3, max = 50)
        private String username;

        @NotBlank @Email
        private String email;

        @NotBlank @Size(min = 6, max = 100)
        private String password;

        @NotBlank @Size(max = 100)
        private String fullName;

        private String phone;
        private String department;
        private String specialization;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public String getSpecialization() { return specialization; }
        public void setSpecialization(String specialization) { this.specialization = specialization; }
    }

    public static class UserResponse {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String phone;
        private String role;
        private String department;
        private String specialization;
        private Boolean isActive;
        private String availability;
        private long activeAssignments;
        private List<AssignedCaseSummary> assignedCases;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public String getSpecialization() { return specialization; }
        public void setSpecialization(String specialization) { this.specialization = specialization; }
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
        public String getAvailability() { return availability; }
        public void setAvailability(String availability) { this.availability = availability; }
        public long getActiveAssignments() { return activeAssignments; }
        public void setActiveAssignments(long activeAssignments) { this.activeAssignments = activeAssignments; }
        public List<AssignedCaseSummary> getAssignedCases() { return assignedCases; }
        public void setAssignedCases(List<AssignedCaseSummary> assignedCases) { this.assignedCases = assignedCases; }
    }

    public static class AssignedCaseSummary {
        private Long crisisId;
        private String publicId;
        private String title;
        private String severity;
        private String status;
        private String location;
        private String building;
        private String assignmentStatus;
        private String instructions;
        private java.time.LocalDateTime assignedAt;

        public Long getCrisisId() { return crisisId; }
        public void setCrisisId(Long crisisId) { this.crisisId = crisisId; }
        public String getPublicId() { return publicId; }
        public void setPublicId(String publicId) { this.publicId = publicId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getBuilding() { return building; }
        public void setBuilding(String building) { this.building = building; }
        public String getAssignmentStatus() { return assignmentStatus; }
        public void setAssignmentStatus(String assignmentStatus) { this.assignmentStatus = assignmentStatus; }
        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
        public java.time.LocalDateTime getAssignedAt() { return assignedAt; }
        public void setAssignedAt(java.time.LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    }
}
