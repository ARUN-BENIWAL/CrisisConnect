# CrisisConnect — Frontend Client

A responsive, institutional emergency coordination frontend built with **React (JavaScript / JSX)**, **Vite**, and **Tailwind CSS**.

---

## 1. Directory Structure

```text
client/
├── public/                 # Static assets (if any)
├── src/
│   ├── components/         # Reusable institutional UI components
│   │   ├── Badges.jsx          # Severity & status badges with distinct visual styling
│   │   ├── CrisisDetailModal.jsx # Incident dossier, triage, and resolution report modal
│   │   ├── Footer.jsx          # Institutional footer with SRM emergency helpline contacts
│   │   ├── Navbar.jsx          # Main navigation bar with role-based routing controls
│   │   └── ProtectedRoute.jsx  # Role-based route guard component
│   ├── contexts/           # Global application contexts
│   │   └── AuthContext.jsx     # JWT session management, role state, and login/logout handlers
│   ├── pages/              # Primary route views
│   │   ├── AdminDashboard.jsx  # EOC command center (queue, telemetry, responder roster)
│   │   ├── EmergencyContacts.jsx # SRM KTR campus directory & national helplines
│   │   ├── Home.jsx            # Institutional landing page with live database telemetry
│   │   ├── Login.jsx           # Staff authentication with pre-configured duty profiles
│   │   ├── ReportCrisis.jsx    # Public incident reporting intake form & tracking receipt
│   │   ├── ResponderDashboard.jsx # Tactical field operations docket
│   │   └── TrackCrisis.jsx     # Real-time incident lookup & 5-stage progress timeline
│   ├── services/           # Network & HTTP clients
│   │   └── api.js              # Axios instance with JWT interceptors & 401 handling
│   ├── App.jsx             # Top-level routing and view composition
│   ├── index.css           # Institutional design system tokens and Tailwind CSS imports
│   └── main.jsx            # Application entrypoint & DOM renderer
├── index.html              # HTML shell & web font imports
├── package.json            # Node package manifest & scripts
├── vite.config.js          # Vite build & reverse-proxy configuration
└── README.md               # This guide
```

---

## 2. Key Technology Stack

- **Framework:** React 18 (using standard `.jsx` / `.js`)
- **Build Tool:** Vite 5 + `@vitejs/plugin-react`
- **Styling:** Tailwind CSS 4 + custom institutional design system (`inst-card`, `btn-forest`, `btn-emergency`)
- **Icons:** Lucide React
- **Telemetry Charts:** Recharts (responsive bar and pie charts in Admin Dashboard)
- **HTTP Client:** Axios with automated JWT Bearer token injection and response interceptors

---

## 3. Environment Configuration

Copy `.env.example` to `.env` if custom configuration is required:

```bash
# In local development, leaving VITE_API_URL empty or '/api' routes requests through the Vite dev proxy to the backend on port 8080.
VITE_API_URL=/api
```

---

## 4. Development & Build Commands

```bash
# Install dependencies
npm install

# Start development server with Hot Module Replacement (HMR)
npm run dev

# Run production build (compiles to client/dist/)
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Development Proxy

In `vite.config.js`, requests matching `/api` and `/uploads` are automatically proxied to the Spring Boot backend at `http://localhost:8080`.
