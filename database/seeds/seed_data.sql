-- ==============================================================================
-- CrisisConnect Initial Seed Data
-- Seed accounts and categories for SRM KTR Campus Emergency Operations
-- ==============================================================================

USE crisisconnect;

-- 1. Default SRM Crisis Categories
INSERT INTO crisis_categories (id, name, description, icon, is_active) VALUES
(1, 'Medical Emergency', 'Severe illness, sudden injury, heart attack, or loss of consciousness', 'stethoscope', TRUE),
(2, 'Fire / Hazardous Material', 'Active smoke, fire outbreak, chemical spill, or gas leak', 'flame', TRUE),
(3, 'Physical Threat & Violence', 'Active intruder, assault, robbery, or armed threat on campus', 'shield-alert', TRUE),
(4, 'Mental Health Crisis', 'Severe emotional distress, psychological crisis, or suicidal ideation', 'heart-handshake', TRUE),
(5, 'Facility / Infrastructure', 'Elevator entrapment, power outage, water main leak, structural failure', 'building', TRUE),
(6, 'General Campus Safety', 'Weather emergency, suspicious activity, disturbance, or other safety concern', 'alert-triangle', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Default Seed Accounts
-- Passwords below are BCrypt encoded for development convenience:
-- admin / admin123
-- medic / medic123
-- police / police123
-- counselor / counselor123

INSERT INTO users (id, username, email, password_hash, full_name, phone, role, department, specialization, is_active, availability) VALUES
(1, 'admin', 'cso.security@srmist.edu.in', '$2a$10$w85oZ5e917d5t0pDqH6PGe8M2.f66t0C1vL8aB9X1eZ410h41c6G.', 'Col. R. Sundararajan (Chief Security Officer)', '044-2745 2270', 'ADMIN', 'SRM KTR Security Control', 'Command Coordination', TRUE, 'AVAILABLE'),
(2, 'medic', 'casualty.hospital@srmist.edu.in', '$2a$10$w85oZ5e917d5t0pDqH6PGe8M2.f66t0C1vL8aB9X1eZ410h41c6G.', '[SRM Hospital EMT] Dr. S. Karthik', '044-4743 2345', 'RESPONDER', 'SRM Hospital Emergency', 'Trauma Care & Critical Resuscitation', TRUE, 'AVAILABLE'),
(3, 'police', 'security.patrol@srmist.edu.in', '$2a$10$w85oZ5e917d5t0pDqH6PGe8M2.f66t0C1vL8aB9X1eZ410h41c6G.', '[Campus Patrol] Kiran Das', '+91 94440 22701', 'RESPONDER', 'SRM Campus Vigilance', 'Motorized Perimeter Patrol & Anti-Ragging', TRUE, 'AVAILABLE'),
(4, 'counselor', 'counselor.wellness@srmist.edu.in', '$2a$10$w85oZ5e917d5t0pDqH6PGe8M2.f66t0C1vL8aB9X1eZ410h41c6G.', '[SRM Counselor] Dr. Ananya Iyer', '044-2741 7800', 'RESPONDER', 'SRM Student Counseling (Tele-MANAS)', 'Psychological Crisis & Stress De-escalation', TRUE, 'AVAILABLE')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);
