# CrisisConnect — College Crisis & Incident Management System

A full-stack, enterprise-grade college emergency response and crisis coordination web platform. Tailored for SRM Institute of Science and Technology (Kattankulathur Campus) to report emergencies, triage and dispatch responders, track real-time incident progress, and log audit-compliant resolution dossiers.

---

## 1. High-Level Architecture & Directory Structure

```text
CrisisConnect_AI_Hackathon/
├── client/                  # Frontend Web Application (React 18 + JSX + Vite)
│   ├── src/                 # Components, pages, contexts, services, and styles
│   ├── index.html           # Single-page application HTML entrypoint
│   ├── package.json         # Node package manifest & dependencies
│   ├── vite.config.js       # Vite build & backend reverse-proxy configuration
│   └── README.md            # Dedicated frontend documentation
│
├── server/                  # Backend Application Server (Spring Boot 3 + Java 17+)
│   ├── src/main/java/       # Controllers, services, JPA entities, repositories, security
│   ├── src/main/resources/  # Application configuration & Flyway migrations
│   ├── pom.xml              # Maven project object model & dependencies
│   └── README.md            # Dedicated backend documentation
│
├── database/                # Database Architecture, Schemas, & Migrations
│   ├── migrations/          # Flyway versioned migration scripts
│   ├── schema/              # Complete DDL production schema
│   ├── seeds/               # Initial seed data for SRM KTR categories & accounts
│   ├── schema.sql           # Standalone top-level SQL schema
│   └── README.md            # Dedicated database architecture documentation
│
├── docs/                    # Architecture, Setup, and Evaluator Documentation
│   ├── architecture.md      # Detailed system design, security model, and data flow
│   ├── setup.md             # Developer setup, prerequisites, and onboarding
│   ├── database.md          # Database architecture summary & mapping
│   ├── DEMO_SCRIPT.md       # Live hackathon demonstration walkthrough
│   ├── HACKATHON_PITCH.md   # 90-second executive summary pitch
│   └── JUDGES_FEATURE_MAP.md# Problem-to-feature evaluator rubric
│
├── .env.example             # Root environment variables configuration template
├── .gitignore               # Root gitignore for Maven, Node, Vite, and OS artifacts
└── README.md                # This comprehensive project overview
```

---

## 2. Technology Stack

- **Backend:** Java 17+, Spring Boot 3.2.5+, Spring Security 6 with stateless JWT authentication, Spring Data JPA / Hibernate, Flyway migrations, H2 in-memory DB (instant standalone dev profile) and MySQL 8+ support.
- **Frontend:** React 18 (pure JavaScript / JSX), Vite 5, Tailwind CSS 4, Recharts for real-time telemetry, Lucide React icons, Axios with automated JWT Bearer interceptors.
- **Security:** Stateless JWT authentication, BCrypt password hashing, role-based authorization (`ADMIN`, `RESPONDER`, and public endpoints), CORS control, and automated audit logging.

---

## 3. Key Features

1. **Public Emergency Dispatch Reporting (`/report`):**
   - Categorized reporting (Medical, Fire/Hazard, Threat & Security, Mental Health, Facility, General Safety).
   - Dynamic severity selectors (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL` with pulse indicators).
   - Campus location coordinates (Building, floor, room, landmark).
   - Anonymous reporting toggle with privacy safeguards.
   - Generates unique public tracking codes (e.g., `CRISIS-100001` or `CC-XXXXX`).

2. **Real-time Incident Tracking (`/track`):**
   - Lookup by public tracking code (no authentication required).
   - Live 5-stage status timeline: `Submitted` → `Triage` → `Dispatched` → `On Scene` → `Resolved`.
   - Emergency contact links and escalation guidance.

3. **Admin Command Center (`/admin`):**
   - Real-time KPI summary (Total Incidents, Active, Unassigned, Critical, Resolved, Avg Response Time).
   - Interactive Recharts telemetry (Crises by Category, Severity Breakdown).
   - Searchable, filterable incident table (filter by status, severity, category).
   - Fast triage actions and responder assignment modal with custom dispatch instructions.
   - Responder fleet overview with real-time duty status and active case assignments.

4. **Field Responder Tactical Console (`/responder`):**
   - Personalized incident mission queue.
   - Duty status switcher (`AVAILABLE`, `ON_SCENE`, `OFF_DUTY`).
   - One-click workflow: Accept Mission → Mark On-Scene → Log Progress Notes → Submit Formal Resolution Dossier.

5. **SRM KTR Campus Emergency Directory (`/contacts`):**
   - Filterable directory for SRM Campus Security (`044-2745 2270`), SRM Hospital Emergency Casualty (`044-4743 2345`), Anti-Ragging Cell, and Facilities.
   - Direct-call links and Indian national emergency lifelines (`112`, `108`, `100`, `101`, `1091`, `1800-180-5522`).

---

## 4. SRM KTR Demo Accounts (Pre-Seeded)

| Role | Username | Password | Full Name / Description | Contact |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Command** | `admin` | `admin123` | Col. R. Sundararajan (Chief Security Officer) | `044-2745 2270` |
| **EMT / Medical** | `medic` | `medic123` | Dr. S. Karthik (SRM Hospital Casualty MO) | `044-4743 2345` |
| **Campus Patrol** | `police` | `police123` | Kiran Das (SRM Campus Vigilance) | `+91 94440 22701` |
| **Counselor** | `counselor` | `counselor123` | Dr. Ananya Iyer (SRM Student Counseling / Tele-MANAS) | `044-2741 7800` |

*(Note: The login screen includes quick autofill buttons for each account).*

---

## 5. Running the Application Locally

### 1. Start the Backend Server (Spring Boot)

Run with the zero-configuration `dev` profile (uses pre-seeded in-memory H2 database):

```bash
cd server
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The backend starts at: **`http://localhost:8080`**

*(To run with MySQL in production, set variables in `.env` and run `mvn spring-boot:run -Dspring-boot.run.profiles=prod`).*

### 2. Start the Frontend Client (React + Vite)

In a new terminal window:

```bash
cd client
npm install
npm run dev
```

The frontend will be live at: **`http://localhost:5173`**

---

## 6. Build and Verification Commands

```bash
# Frontend production build
cd client
npm run build

# Frontend preview
cd client
npm run preview

# Backend package build
cd server
mvn clean package -DskipTests
```

---

## 7. Key REST API Endpoints

- **Public Status Telemetry:** `GET /api/public/status`
- **Public Categories:** `GET /api/categories`
- **Report Incident:** `POST /api/public/crises`
- **Track Incident:** `GET /api/public/crises/track/{publicId}`
- **Auth Login:** `POST /api/auth/login`
- **Admin Dashboard KPIs:** `GET /api/admin/dashboard`
- **Admin Incident Queue:** `GET /api/admin/crises`
- **Admin Triage Update:** `PATCH /api/admin/crises/{id}`
- **Admin Dispatch Unit:** `POST /api/admin/assignments`
- **Admin Responder Fleet:** `GET /api/admin/responders`
- **Responder Queue:** `GET /api/responder/assignments`
- **Acknowledge Mission:** `POST /api/responder/assignments/{id}/accept`
- **Update On-Scene Status:** `PATCH /api/responder/assignments/{id}/status`
- **Submit Resolution Dossier:** `POST /api/responder/assignments/{id}/resolve`
- **Toggle Duty Availability:** `PUT /api/responder/availability`
