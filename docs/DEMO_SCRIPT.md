# SRM KTR CrisisConnect — Hackathon Demonstration Script

This step-by-step walkthrough presents the complete full-stack crisis response workflow during a live evaluator demo.

---

### Phase 1: Institutional Landing & Real-Time Telemetry
1. Open the landing page (`http://localhost:5173`).
2. Point out the institutional design: SRM KTR Campus Emergency Operations Center branding, live operational telemetry metrics loaded from the Spring Boot database (Active Incidents, Resolved Incidents, Total Recorded, 24x7 Dispatch Readiness).
3. Review the Incident Response Protocols & Channels table.
4. Highlight the urgent red emergency callout bar displaying direct SRM hospital (`044-4743 2345`) and security control room (`044-2745 2270`) contact numbers.

---

### Phase 2: Public Incident Reporting & Tracking ID Generation
1. Click **Submit an Incident Report** (`/report`).
2. Select **Medical Emergency** classification and set urgency to **Critical**.
3. Fill out the narrative:
   - **Headline:** `Student collapsed with acute respiratory distress at Java Green`
   - **Description:** `Student in University Building Java Green food court experiencing severe allergic reaction and difficulty breathing; urgent medical response requested.`
   - **Campus Zone:** `University Building (UB)`
   - **Building:** `Main University Building`
   - **Floor:** `Ground Floor`
   - **Room / Area:** `Java Green Cafe Lobby`
4. Submit the report.
5. Demonstrate the immediate generation of the unique tracking code (e.g., `CRISIS-100001` or `CC-XXXXX`) with one-click copy and live tracking link.

---

### Phase 3: Public Lifecycle Verification (No Login Required)
1. Open **Track Incident** (`/track`) using the generated code.
2. Show how ordinary students or staff can verify that their report is in the queue, inspect the incident description, and follow the 5-step lifecycle timeline (`Submitted` → `Triage` → `Dispatched` → `On Scene` → `Resolved`).

---

### Phase 4: Incident Command Center & Dispatch Allocation (Admin)
1. Navigate to `/login` and click the **SRM Security Control (Admin)** quick-fill button (`admin` / `admin123`).
2. Click **Sign in to Dispatch Terminal**.
3. Explain the command console:
   - Live KPI overview (Critical priority, unassigned queue, active on scene, avg response time).
   - Recharts telemetry graphs showing incident distribution by category and severity.
4. Locate the newly submitted incident in the Incident Queue.
5. Click **View Dossier** to open the operational management modal:
   - Click **Triage & Review** to acknowledge command review.
   - Assign the incident to an available specialized responder (e.g. `[SRM Hospital EMT] Dr. S. Karthik`) with dispatch notes: `Deploy oxygen cylinder and anaphylaxis emergency kit immediately`.
   - Confirm assignment. The incident status escalates to `ASSIGNED`.
6. Switch to the **Responder Roster** tab to show that the assigned unit immediately reflects their active assigned mission and case ID.

---

### Phase 5: Field Tactical Execution & Scene Resolution (Responder)
1. Sign out of the admin console.
2. At `/login`, click the **SRM Hospital EMT** quick-fill button (`medic` / `medic123`) and log in.
3. Show the responder tactical console (`/responder`):
   - Notice the newly assigned incident appears with full location coordinates, building landmarks, and dispatch instructions.
   - Click **Acknowledge & En Route** to signal movement.
   - Click **Mark On Scene** upon arrival.
4. Open the Incident Dossier:
   - Log a progress note: `Patient stabilized with epinephrine injection; vitals normalized`.
   - Submit the formal resolution dossier: `Patient fully conscious and transported to SRM Hospital Casualty for 2-hour observation`.
   - The mission is marked `RESOLVED`.

---

### Phase 6: Full-Circle Verification
1. Sign out and return to the public **Track Incident** page (`/track`).
2. Re-enter the reference code.
3. Show that the lifecycle timeline now reflects `Resolved` status with the complete audit timestamps.
