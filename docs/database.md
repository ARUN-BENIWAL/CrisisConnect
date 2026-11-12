# CrisisConnect — Database Documentation Reference

This document provides a concise architectural summary of the database systems used by **CrisisConnect**. For full DDL scripts, migrations, and seed files, refer directly to the [`database/`](file:///Users/arunbeniwal/Desktop/CrisisConnect_AI_Hackathon/database/README.md) directory.

---

## 1. Engine Specifications

1. **Development Engine (H2 Database):**
   - Mode: In-Memory (`jdbc:h2:mem:crisisconnect`)
   - Schema Generation: Hibernate DDL Auto (`update`) + programmatic seeding via `DataInitializer.java`.
   - Access: H2 Web Console at `http://localhost:8080/h2-console`.

2. **Production Engine (MySQL 8.0+):**
   - Dialect: `org.hibernate.dialect.MySQLDialect`
   - Schema Management: Flyway version-controlled migrations (`db/migration/V1__initial_schema.sql`).
   - Character Set: `utf8mb4` with `utf8mb4_unicode_ci` collation.

---

## 2. Table Catalog

| Table | Primary Key | Description |
|:---|:---|:---|
| **`users`** | `id` (BIGINT) | Staff credentials (BCrypt), roles (`ADMIN`, `RESPONDER`), departments, and duty availability. |
| **`crisis_categories`** | `id` (BIGINT) | Standard incident classifications with visual icons. |
| **`crises`** | `id` (BIGINT) | Central incident docket with unique public tracking ID (e.g., `CRISIS-100001`). |
| **`assignments`** | `id` (BIGINT) | Dispatch allocations linking incidents to designated responding units. |
| **`crisis_status_history`** | `id` (BIGINT) | Immutable audit log of every operational lifecycle status transition. |
| **`resolution_reports`** | `id` (BIGINT) | Formal post-incident clearance report filed upon scene resolution. |
| **`progress_notes`** | `id` (BIGINT) | On-scene tactical log entries recorded by responders. |
| **`audit_logs`** | `id` (BIGINT) | Regulatory compliance logs capturing actor, action, IP, and timestamp. |
| **`notifications`** | `id` (BIGINT) | Dispatch alerts and updates delivered to staff users. |
| **`attachments`** | `id` (BIGINT) | Evidence images and files linked to incidents. |

---

## 3. Related Files

- DDL Schema: [`database/schema/schema.sql`](file:///Users/arunbeniwal/Desktop/CrisisConnect_AI_Hackathon/database/schema/schema.sql)
- Flyway Migration: [`database/migrations/V1__initial_schema.sql`](file:///Users/arunbeniwal/Desktop/CrisisConnect_AI_Hackathon/database/migrations/V1__initial_schema.sql)
- Seed Data: [`database/seeds/seed_data.sql`](file:///Users/arunbeniwal/Desktop/CrisisConnect_AI_Hackathon/database/seeds/seed_data.sql)
- Comprehensive Guide: [`database/README.md`](file:///Users/arunbeniwal/Desktop/CrisisConnect_AI_Hackathon/database/README.md)
