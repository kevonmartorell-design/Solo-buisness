# Database Implementation Plan

This plan outlines the creation of the Supabase database schema for the Workforce SaaS application, adhering to the requirements provided in `Database Building Instructions.md`.

## Goal Description
Build a comprehensive database schema to support a multi-tier workforce management, scheduling, and CRM application. The schema will include core entities like Users, Organizations, Schedules, and Services, along with robust security (RLS) and automation (Triggers).

## Proposed Changes

We will execute SQL migrations to create the following structure in the `workforce` (id: `zieqeknyzporeqdkqhqb`) project.

### Phase 1: Core Tables & Extensions

1.  **Extensions**
    *   `uuid-ossp` (for UUID generation)
    *   `moddatetime` (for updated_at tracking)

2.  **Enums**
    *   `user_role`: 'super_admin', 'district_manager', 'store_manager', 'department_manager', 'associate', 'client'
    *   `tier_level`: 'free', 'solo', 'business'
    *   `shift_status`: 'approved', 'pending', 'denied'
    *   `appointment_status`: 'requested', 'confirmed', 'completed', 'cancelled'
    *   `request_status`: 'pending', 'approved', 'denied'

3.  **Tables**

    *   `organizations` (Businesses)
        *   `id` (UUID, PK)
        *   `business_name`, `tier`, `settings` (JSONB for colors, etc.), `employee_count`, `employee_limit`
        *   Standard timestamp fields

    *   `profiles` (Users/Employees - extends `auth.users`)
        *   `id` (UUID, PK, FK to `auth.users`)
        *   `organization_id` (UUID, FK to `organizations`) - *Nullable for clients?*
        *   `role`, `name`, `email`, `avatar_url`, `bio`
        *   `certifications` (JSONB or separate table? Instructions say separate `Certifications/Vault` table, but `Users` logic mentions "certifications" field. Will use separate table for detailed documents).

    *   `locations` (Stores)
        *   `id` (UUID, PK)
        *   `organization_id` (FK), `name`, `address`, `manager_id` (FK to profiles)

    *   `services`
        *   `id` (UUID, PK)
        *   `organization_id` (FK), `name`, `duration`, `price`

    *   `clients` (CRM Data)
        *   `id` (UUID, PK)
        *   `organization_id` (FK)
        *   `user_id` (FK to `profiles` if they have an account, else nullable)
        *   `name`, `email`, `phone`, `notes`

### Phase 2: Operational Tables

1.  **Scheduling & Time**
    *   `schedules` (Shifts)
    *   `shift_swaps`
    *   `time_off_requests`

2.  **Business Logic**
    *   `appointment_requests`
    *   `bookings`
    *   `analytics_events`
    *   `certifications` (The Vault)
    *   `ratings_reviews`
    *   `notifications`
    *   `product_links`
    *   `ai_analysis_log`
    *   `settings` (May fold into `organizations` or keep separate if complex)

3.  **Junction Tables**
    *   `profile_services` (employee <-> service)
    *   `profile_locations` (employee <-> location)

### Phase 3: Security & Automation

1.  **RLS Policies**
    *   Enable RLS on all tables.
    *   Crucial: `organizations` isolation. Users can only see data for their `organization_id`.
    *   Hierarchy access: Managers see all in store/dept, Associates see own.

2.  **Triggers**
    *   `handle_new_user`: Automatically create `profile` on `auth.users` insert.
    *   `update_timestamps`: Auto-update `updated_at`.

3.  **Indexes**
    *   On `organization_id`, `user_id`, `status` columns for performance.

## Verification Plan

### Automated Tests
*   We will attempt to insert mock data to verify foreign key constraints.
*   We will run queries as different "users" (simulated via strict RLS checks if possible, or manual inspection of policies).

### Manual Verification
*   The user can check the Supabase Dashboard to see the created tables.
