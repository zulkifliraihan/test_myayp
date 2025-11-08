# My AYP — Employees App

This repository contains a Laravel (API) backend and a Next.js (App Router) frontend to manage employees with an update workflow, responsive UI, and pagination.

## 1) Extra Work And Why It Matters

- Backend — Laravel 12 with Repository + Service + Resource pattern
  - Separation of concerns: Controller stays thin, business rules live in `Service`, persistence in `Repository`, and API shape in `Resource`. This improves testability, maintainability, and clarity as features grow.
  - Flow overview:
    - Request → `Controller` → `EmployeeService` → `EmployeeRepository` → `Model/DB`
    - Response payload shaped by `EmployeeResource` → `Controller` returns a consistent JSON format via `ReturnResponser`.
  - Performance optimizations with Redis caching:
    - Paginated and non‑paginated lists are cached via Redis with cache tags: `employees`, `employees:list`.
    - Keyed by page and per_page for fast list responses under load.
    - After any update, list caches are invalidated so subsequent reads are always fresh.

- Frontend — Next.js App Router + Tailwind CSS
  - Clean, responsive table UI: single table component that stays readable on mobile via horizontal scroll, sensible column widths, and touch‑friendly controls.
  - UX details for scale: client pagination from API `meta.links`, bottom‑only “per page” selector (10/20/50/100), and an “Update” action always available.
  - API proxy routes in the App Router isolate the frontend from CORS and centralize request/response handling for readability and reuse.

## 2) Setup Instructions

### System Requirements
- Backend
  - PHP 8.4+
  - Composer v2+
  - Redis Server (recommended for caching)
  - SQLite/MySQL (SQLite is preconfigured in example env)
- Frontend
  - Node.js 20+ (tested with v24)
  - pnpm 8+

### Backend Installation (Laravel API)
1. From `backend/` directory:
   - `composer install`
2. Copy env and generate key:
   - `cp .env.example .env`
   - `php artisan key:generate`
3. Migrate and seed employees (1000 records):
   - `php artisan migrate --seed`
4. (Optional) Enable Redis cache in `.env`:
   - `CACHE_STORE=redis`
   - `REDIS_CLIENT=phpredis` (or `predis` if using Predis)
   - `REDIS_HOST=127.0.0.1`
   - `REDIS_PORT=6379`
5. Run the API:
   - `php artisan serve` (defaults to `http://127.0.0.1:8000`)
6. Run feature tests (optional):
   - `php artisan test --filter=EmployeeControllerTest`

### Frontend Installation (Next.js)
1. From `frontend/` directory:
   - `cp .env.example .env.local` (or `.env` if you prefer)
   - Set `BACKEND_API_URL=http://127.0.0.1:8000`
2. Install dependencies:
   - `pnpm install`
3. Run dev server:
   - `pnpm dev` (defaults to `http://localhost:3000`)

## 3) Code Structure And Design Rationale

### Backend (Laravel 12)
- Routing: `routes/api.php`
  - REST resource limited to `index` and `update` for `employees`.
- Controller: `app/Http/Controllers/EmployeeController.php`
  - Thin controller: delegates work to `EmployeeService`; wraps responses via `ReturnResponser` and centralized try/catch.
- Service: `app/Http/Services/EmployeeService.php`
  - Business logic for listing (with pagination + Redis cache) and updating.
  - Cache keys per page/per_page; cache tags allow invalidation on update so lists stay fresh.
- Repository: `app/Http/Repositories/EmployeeRepository/*`
  - `EmployeeInterface` + `EmployeeRepository` abstract data access and keep Eloquent concerns out of the service.
- Resource: `app/Http/Resources/EmployeeResource.php`
  - Transforms model → API fields: `{ id, name, email, isActive }` (mapping `is_active`).
- Request Validation: `app/Http/Requests/UpdateEmployeeRequest.php`
  - Validates `name`, `email`, `is_active` for update payloads.
- Traits/Response: `app/Traits/ReturnResponser.php`
  - Uniform JSON format: `response_code`, `response_status`, `message`, `data`.
- Data/Seeds: `database/seeders/EmployeeSeeder.php`
  - Generates 1,000 employees for testing and pagination.
- Tests: `tests/Feature/EmployeeControllerTest.php`
  - Verifies pagination format and update behavior.

Why this design?
- Clear separation of concerns, easier testing, and predictable response shapes.
- Caching at the service level boosts read performance without leaking infra details to controllers.
- Repository keeps Eloquent specifics isolated for future DB or query changes.

### Frontend (Next.js App Router)
- Pages/Layout: `frontend/app/page.tsx`, `frontend/app/layout.tsx`
  - Server component renders shell and mounts the client view.
- Client View: `frontend/components/employees-view.tsx`
  - Manages pagination state (`page`, `perPage`), fetches data, renders controls (numbered pages from `meta.links`) and bottom‑only per‑page selector.
- Table: `frontend/components/employee-table.tsx`
  - Responsive table with horizontal scroll on small screens; reasonable column min‑widths; Update button always available.
- Modal: `frontend/components/update-employee-modal.tsx`
  - Name, Email, Status switch, Save/Cancel; sends PUT with `{ name, email, is_active }`.
- API Proxy: `frontend/app/api/employees/route.ts`, `frontend/app/api/employees/[id]/route.ts`
  - Proxies to Laravel to avoid CORS; parses/validates id robustly and returns `NextResponse.json(...)` for consistent JSON handling.
- Styling: Tailwind CSS (via `app/globals.css`)
  - Lightweight, consistent styling with responsive utilities.

Why this design?
- App Router collocates UI and API glue, reducing CORS/CSRF complexity and keeping the data boundary clear.
- Dedicated components keep responsibilities focused: view (state+fetch), table (render), modal (edit), API routes (transport).

## 4) AI Tool Disclosure

- Backend
  - Used AI to write PHPDoc for functions to improve readability and onboarding.
  - Consulted AI for Redis caching design (keys, tags, invalidation) to accelerate backend tasks while focusing on frontend.
  - Asked AI to scaffold unit tests, complementing the manual Postman verification (see `backend/postman/Test - My AYP.postman_collection.json`).

- Frontend
  - Initial UI was simple; AI was used to refine the table to look fresh/modern and be mobile‑friendly (responsive table with horizontal scroll, better spacing/typography).
  - For `frontend/app/api/employees/route.ts` and `[id]/route.ts`, AI helped optimize and clarify the proxy implementation for maintainability and correct JSON handling.
  
- Commit messages
  - I used AI assistance on each commit to craft clearer, more structured commit messages for better project history and easier code review.
