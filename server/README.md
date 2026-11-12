# CrisisConnect — Backend Server

The **CrisisConnect** backend is an enterprise-grade RESTful API server built with **Java 17+** and **Spring Boot 3**. It provides incident intake, administrative dispatch triage, real-time lifecycle tracking, role-based JWT security, and immutable audit logging.

---

## 1. Directory Structure

```text
server/
├── src/
│   ├── main/
│   │   ├── java/com/crisisconnect/
│   │   │   ├── config/              # Application bootstrapping & sample data initializers
│   │   │   │   └── DataInitializer.java # Auto-seeds SRM KTR categories & accounts in dev mode
│   │   │   ├── controller/          # REST API Controllers
│   │   │   │   ├── AdminController.java     # EOC management, queue, triage, dispatch assignments
│   │   │   │   ├── AuthController.java      # Login authentication & token issuance
│   │   │   │   ├── CategoryController.java  # Emergency response classifications
│   │   │   │   ├── PublicController.java    # Anonymous reporting, status tracking, public telemetry
│   │   │   │   └── ResponderController.java # Field unit mission acknowledgments & resolution reports
│   │   │   ├── dto/                 # Request & Response Data Transfer Objects
│   │   │   │   ├── AuthDto.java             # Login request and JWT response models
│   │   │   │   ├── CrisisDto.java           # Crisis submission, status update, resolution models
│   │   │   │   └── DashboardDto.java        # Operational KPIs and Recharts telemetry aggregates
│   │   │   ├── entity/              # JPA Data Entities (Database Table Mappings)
│   │   │   │   ├── Assignment.java          # Incident assignment to responder
│   │   │   │   ├── AuditLog.java            # Immutable compliance audit log
│   │   │   │   ├── Crisis.java              # Central incident docket
│   │   │   │   ├── CrisisCategory.java      # Emergency classification category
│   │   │   │   ├── CrisisStatusHistory.java # Status change timeline
│   │   │   │   ├── Notification.java        # System alert notifications
│   │   │   │   ├── ProgressNote.java        # On-scene responder log note
│   │   │   │   ├── ResolutionReport.java    # Formal post-incident resolution dossier
│   │   │   │   └── User.java                # Staff user with role and duty availability
│   │   │   ├── exception/           # Centralized exception handling
│   │   │   │   └── GlobalExceptionHandler.java # Consistent JSON error envelopes
│   │   │   ├── repository/          # Spring Data JPA Repositories
│   │   │   ├── security/            # Spring Security 6 & JWT Infrastructure
│   │   │   │   ├── JwtAuthenticationFilter.java # Bearer token extraction & validation
│   │   │   │   ├── JwtTokenProvider.java        # Token generation & claim signing
│   │   │   │   └── SecurityConfig.java          # Endpoint authorization rules & CORS
│   │   │   ├── service/             # Core Business Logic Layer
│   │   │   │   ├── AuditService.java        # Audit logging service
│   │   │   │   ├── AuthService.java         # Authentication & password validation
│   │   │   │   └── CrisisService.java       # Incident processing, dispatch routing & resolution
│   │   │   └── CrisisConnectApplication.java # Spring Boot main entrypoint
│   │   └── resources/
│   │       ├── db/migration/
│   │       │   └── V1__initial_schema.sql # Flyway migration script
│   │       ├── application.yml          # Production & base configuration
│   │       └── application-dev.yml      # Zero-config H2 in-memory dev profile
│   └── test/                        # Unit and integration tests
├── pom.xml                          # Maven build definition & dependencies
└── README.md                        # This guide
```

---

## 2. Technology Stack

- **Runtime:** Java 17+ (compatible with Java 21)
- **Framework:** Spring Boot 3.2.5+
- **Security:** Spring Security 6 + JJWT (`io.jsonwebtoken:jjwt-api:0.11.5`)
- **Data Persistence:** Spring Data JPA + Hibernate 6
- **Database Support:** H2 (In-memory development) and MySQL 8+ (Production)
- **Database Migrations:** Flyway 9+
- **Build Tool:** Apache Maven

---

## 3. Running the Server

### Development Profile (H2 In-Memory, Pre-Seeded):
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
The server will start at: `http://localhost:8080`.

### Production Profile (MySQL):
Ensure MySQL is running and set the following environment variables:
```bash
export SPRING_PROFILES_ACTIVE=prod
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/crisisconnect?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export SPRING_DATASOURCE_USERNAME=crisis_user
export SPRING_DATASOURCE_PASSWORD=your_password
mvn spring-boot:run
```

---

## 4. API Endpoints Overview

| Method | Endpoint | Access | Purpose |
|:---|:---|:---|:---|
| `GET` | `/api/public/status` | Public | Live telemetry metrics (active, resolved, total, readiness) |
| `GET` | `/api/public/crises/track/{publicId}` | Public | Public incident progress timeline |
| `POST` | `/api/public/crises` | Public | Submit new emergency report (anonymous or identified) |
| `GET` | `/api/categories` | Public | List emergency response classifications |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT Bearer token |
| `GET` | `/api/admin/dashboard` | `ADMIN` | Command center telemetry and KPI summary |
| `GET` | `/api/admin/crises` | `ADMIN` | Filterable incident queue (status, severity, search) |
| `PATCH` | `/api/admin/crises/{id}` | `ADMIN` | Fast triage / status update |
| `POST` | `/api/admin/assignments` | `ADMIN` | Dispatch assigned responder to incident |
| `GET` | `/api/admin/responders` | `ADMIN` | Responder roster with duty status and assigned cases |
| `GET` | `/api/responder/dashboard` | `RESPONDER` | Personal mission statistics |
| `GET` | `/api/responder/assignments` | `RESPONDER` | Tactical mission queue |
| `POST` | `/api/responder/assignments/{id}/accept` | `RESPONDER` | Acknowledge mission & set En Route |
| `POST` | `/api/responder/assignments/{id}/resolve` | `RESPONDER` | File formal resolution report |
| `PUT` | `/api/responder/availability` | `RESPONDER` | Toggle duty status (`AVAILABLE`, `ON_SCENE`, `OFF_DUTY`) |
