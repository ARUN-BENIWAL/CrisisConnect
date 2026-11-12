# CrisisConnect Database Architecture & Management Guide

This directory contains the database schema definitions, Flyway migrations, and seed scripts for the **CrisisConnect** campus emergency management platform.

---

## 1. Supported Database Engines

| Environment | Engine | Configuration | Notes |
|:---|:---|:---|:---|
| **Development (Default)** | **H2 Database** | In-Memory (`mem:crisisconnect`) | Zero installation required. Auto-initializes on backend startup with full seed data via Spring Boot `dev` profile. |
| **Production / Staging** | **MySQL 8.0+ / MariaDB 10.5+** | Persistent InnoDB (`utf8mb4`) | Managed via Flyway migrations and standard connection pooling (HikariCP). |

---

## 2. Directory Structure

```text
database/
├── migrations/
│   └── V1__initial_schema.sql     # Flyway versioned migration script
├── schema/
│   └── schema.sql                 # Complete DDL production schema
├── seeds/
│   └── seed_data.sql              # Initial categories & seed accounts
├── schema.sql                     # Top-level standalone schema script
└── README.md                      # This guide
```

---

## 3. Schema Architecture (Tables & Entity Mapping)

The database schema supports operational dispatch, audit compliance (e.g. Clery Act safety documentation), and real-time tracking:

1. **`users`**: Administrative commanders, first responders, and system operators. Supports role-based access control (`ADMIN`, `RESPONDER`) and real-time duty availability (`AVAILABLE`, `BUSY`, `OFFLINE`).
2. **`crisis_categories`**: Standardized emergency classifications (Medical Emergency, Fire / Hazard, Threat & Security, Mental Health, Facility / Infrastructure, General Campus Safety).
3. **`crises`**: Central incident record with public tracking ID (e.g. `CRISIS-100001`), severity level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), multi-step operational lifecycle status, and geographic campus coordinates.
4. **`assignments`**: Dispatch allocation linking an incident to a designated responding unit with priority and special instructions.
5. **`crisis_status_history`**: Immutable audit timeline recording all status transitions, timestamps, and commanding officer notes.
6. **`resolution_reports`**: Formal post-incident resolution dossier filed upon scene clearance.
7. **`progress_notes`**: Real-time tactical logs recorded by responders on scene.
8. **`audit_logs`**: System-wide security audit trails capturing user actions, IP addresses, and timestamps.
9. **`attachments`**: Evidence photos and documentation linked to reports or resolutions.
10. **`notifications`**: Real-time dispatch alerts and task updates for field units.

---

## 4. Connecting and Running with MySQL

### Step 1: Create Database and User
```sql
CREATE DATABASE crisisconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crisis_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON crisisconnect.* TO 'crisis_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Configure Environment Variables
Set the following variables in `.env` or system environment:
```bash
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/crisisconnect?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=crisis_user
SPRING_DATASOURCE_PASSWORD=your_secure_password
```

### Step 3: Automated Migration (Flyway)
When running with MySQL, Spring Boot automatically executes all Flyway migrations in `server/src/main/resources/db/migration/` upon application startup.

To run migrations manually:
```bash
mysql -u crisis_user -p crisisconnect < database/schema/schema.sql
mysql -u crisis_user -p crisisconnect < database/seeds/seed_data.sql
```

---

## 5. Development In-Memory Database (H2)

When running the backend with:
```bash
cd server
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
Spring Boot creates an in-memory database and seeds the 6 emergency categories and default SRM KTR accounts via `DataInitializer.java`. H2 console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:crisisconnect`, username: `sa`, password: empty).
