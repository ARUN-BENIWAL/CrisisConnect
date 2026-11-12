-- ==============================================================================
-- CrisisConnect Database Schema
-- SRM KTR Incident Management & Emergency Operations Platform
-- Target DBMS: MySQL 8.0+ / MariaDB 10.5+ / H2 (Compatibility Mode)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS crisisconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE crisisconnect;

-- 1. Users table (Admins, Coordinators, and Specialized First Responders)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('ADMIN', 'RESPONDER') NOT NULL,
    department VARCHAR(100),
    specialization VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    availability ENUM('AVAILABLE', 'BUSY', 'OFFLINE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role (role),
    INDEX idx_users_email (email),
    INDEX idx_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Crisis Categories
CREATE TABLE IF NOT EXISTS crisis_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Crises (Campus Incident Reports)
CREATE TABLE IF NOT EXISTS crises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    public_id VARCHAR(20) NOT NULL UNIQUE,
    tracking_token_hash VARCHAR(255) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id BIGINT NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    status ENUM('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'INVALID', 'DUPLICATE') NOT NULL DEFAULT 'SUBMITTED',
    priority INT DEFAULT 0,
    location VARCHAR(255) NOT NULL,
    building VARCHAR(100),
    floor VARCHAR(20),
    room VARCHAR(50),
    location_details TEXT,
    reporter_name VARCHAR(100),
    reporter_email VARCHAR(100),
    reporter_phone VARCHAR(20),
    admin_notes TEXT,
    invalid_reason TEXT,
    duplicate_of_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES crisis_categories(id),
    FOREIGN KEY (duplicate_of_id) REFERENCES crises(id),
    INDEX idx_crises_public_id (public_id),
    INDEX idx_crises_status (status),
    INDEX idx_crises_severity (severity),
    INDEX idx_crises_created (created_at),
    INDEX idx_crises_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Responder Assignments
CREATE TABLE IF NOT EXISTS assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crisis_id BIGINT NOT NULL,
    responder_id BIGINT NOT NULL,
    status ENUM('ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED') NOT NULL DEFAULT 'ASSIGNED',
    instructions TEXT,
    priority INT DEFAULT 0,
    assigned_by BIGINT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (crisis_id) REFERENCES crises(id),
    FOREIGN KEY (responder_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    INDEX idx_assignments_crisis (crisis_id),
    INDEX idx_assignments_responder (responder_id),
    INDEX idx_assignments_status (status),
    INDEX idx_assignments_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Crisis Status Audit History
CREATE TABLE IF NOT EXISTS crisis_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crisis_id BIGINT NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by BIGINT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crisis_id) REFERENCES crises(id),
    FOREIGN KEY (changed_by) REFERENCES users(id),
    INDEX idx_status_history_crisis (crisis_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Resolution Reports (Post-Incident Formal Dossier)
CREATE TABLE IF NOT EXISTS resolution_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crisis_id BIGINT NOT NULL,
    assignment_id BIGINT NOT NULL,
    responder_id BIGINT NOT NULL,
    actions_taken TEXT NOT NULL,
    resolution_summary TEXT NOT NULL,
    could_resolve BOOLEAN DEFAULT TRUE,
    unable_reason TEXT,
    resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crisis_id) REFERENCES crises(id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (responder_id) REFERENCES users(id),
    INDEX idx_resolution_crisis (crisis_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Internal System & Alert Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('ASSIGNMENT', 'STATUS_UPDATE', 'ESCALATION', 'HELP_REQUEST', 'RESOLUTION', 'CLOSURE', 'SYSTEM') NOT NULL,
    reference_type VARCHAR(50),
    reference_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (is_read),
    INDEX idx_notifications_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Regulatory & Security Audit Logs (Clery Act Compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_id BIGINT,
    actor_name VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_actor (actor_id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Evidence & Attachments
CREATE TABLE IF NOT EXISTS attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crisis_id BIGINT,
    assignment_id BIGINT,
    resolution_id BIGINT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by VARCHAR(100),
    upload_type ENUM('CRISIS_EVIDENCE', 'PROGRESS_UPDATE', 'RESOLUTION_EVIDENCE') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crisis_id) REFERENCES crises(id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (resolution_id) REFERENCES resolution_reports(id),
    INDEX idx_attachments_crisis (crisis_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Responder Field Progress Notes
CREATE TABLE IF NOT EXISTS progress_notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    crisis_id BIGINT NOT NULL,
    responder_id BIGINT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (crisis_id) REFERENCES crises(id),
    FOREIGN KEY (responder_id) REFERENCES users(id),
    INDEX idx_progress_assignment (assignment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
