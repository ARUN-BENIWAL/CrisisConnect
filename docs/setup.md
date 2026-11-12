# CrisisConnect — Setup & Developer Onboarding Guide

This document provides step-by-step instructions for running the **CrisisConnect** full-stack application locally.

---

## 1. Prerequisites

Ensure the following tools are installed on your machine:
- **Java Development Kit (JDK):** Version 17 or higher (`java -version`)
- **Apache Maven:** Version 3.8 or higher (`mvn -version`)
- **Node.js:** Version 18.x or higher (`node -v`)
- **npm:** Version 9.x or higher (`npm -v`)

---

## 2. Quick Start (Development Mode)

### Step 1: Start the Backend Server
The backend includes a zero-configuration in-memory H2 profile with pre-seeded SRM KTR accounts and categories.

```bash
cd server
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
- Server URL: **`http://localhost:8080`**
- H2 Web Console: **`http://localhost:8080/h2-console`** (JDBC URL: `jdbc:h2:mem:crisisconnect`, username: `sa`, password: empty)

### Step 2: Start the Frontend Client
In a separate terminal window:

```bash
cd client
npm install
npm run dev
```
- Client URL: **`http://localhost:5173`**
- All API calls to `/api` are automatically proxied to `http://localhost:8080`.

---

## 3. Pre-Seeded Test Accounts

The login screen (`/login`) includes one-click quick login buttons to auto-populate credentials for evaluating different role permissions:

| Role | Username | Password | Full Name / Title | Description |
|:---|:---|:---|:---|:---|
| **ADMIN** | `admin` | `admin123` | Col. R. Sundararajan | Chief Security Officer (SRM Security Control) |
| **RESPONDER** | `medic` | `medic123` | Dr. S. Karthik | SRM Hospital Emergency Medical Technician (Casualty) |
| **RESPONDER** | `police` | `police123` | Kiran Das | SRM Campus Vigilance & Motorized Perimeter Patrol |
| **RESPONDER** | `counselor` | `counselor123` | Dr. Ananya Iyer | SRM Student Counseling (Tele-MANAS Support) |

---

## 4. Production Build & Verification

To verify that the frontend compiles cleanly for production:

```bash
cd client
npm run build
```

To preview the production bundle locally:
```bash
npm run preview
```

To package the backend into an executable JAR:
```bash
cd server
mvn clean package -DskipTests
java -jar target/crisisconnect-1.0.0.jar --spring.profiles.active=dev
```

---

## 5. Troubleshooting Common Issues

### Issue: Port 8080 is already in use
Check for any existing running processes on port 8080:
```bash
lsof -i :8080
kill -9 <PID>
```

### Issue: Vite proxy fails with `ECONNREFUSED`
Ensure the backend server is running and responding on `http://localhost:8080` before starting or sending requests from the frontend client. You can verify backend health with:
```bash
curl http://localhost:8080/api/public/status
```
