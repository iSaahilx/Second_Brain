## SecondBrain v0.1 – MVP Prototype

SecondBrain is a small web app designed for **internal medicine residents** to keep track of inpatients and tasks during busy shifts. It implements the v0.1 MVP spec described in `SecondBrain v0.1.pdf`.

The core question it answers is: **“Given my patients and tasks, what should I work on now?”**

---

## Project Structure

- `backend/` – FastAPI + SQLModel API
  - `main.py` – FastAPI app, routes, CORS, startup hooks
  - `database.py` – SQLite engine and session helpers
  - `models.py` – `User`, `Patient`, and `Task` models + enums and read DTOs
  - `seed.py` – seeds 1 user, 2–3 patients, and 5–10 tasks on first run
- `frontend/` – React + TypeScript + Vite SPA
  - `src/App.tsx` – mobile-first UI with the 3 main screens
  - `src/App.css` / `src/index.css` – basic styling and layout

---

## Backend

### Tech

- **FastAPI**
- **SQLModel** (SQLAlchemy 2.x + Pydantic-style models)
- **SQLite** (file `secondbrain.db` in the `backend` directory)

### Data Model

Implemented in `backend/models.py`:

- **User**
  - `id`, `name`, `email?`, `last_login_at?`
  - relationship: `patients: list[Patient]`
- **Patient**
  - `id`, `user_id`
  - `name`, `bed?`, `main_problem?`
  - `priority`: `normal | important | critical`
  - `status`: `active | discharged`
  - relationship: `tasks: list[Task]`
- **Task**
  - `id`, `patient_id`
  - `title`, `notes?`
  - `due_time?` (`datetime`)
  - `priority`: `low | medium | high`
  - `status`: `open | done`
  - `created_at`, `completed_at?`

### Seed Data

On first startup, `seed_example_data()` in `backend/seed.py` creates:

- 1 user: `Dr. Test Resident`
- 3 patients (mixture of `normal / important / critical`)
- 6 tasks with various priorities and due times

### Running the API

From the project root:

```bash
cd backend
pip install -r requirements.txt

cd ..
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Key endpoints:

- `GET /users` – list users
- `GET /patients` – list patients
- `GET /patients/{patient_id}/tasks` – list tasks for a patient

---

## Frontend

### Tech

- **React** + **TypeScript**
- **Vite**

### Screens (all in `src/App.tsx`)

- **Today Queue (Home)**
  - Shows open tasks across patients (fake in-memory data)
  - Each row: patient name (+ critical badge), task title, due info, priority
  - Tap row → opens **Patient Detail**
- **Patients List**
  - Lists all patients with: name, bed/room, main problem, priority badge
  - Shows count of open tasks for each patient
  - Tap row → opens **Patient Detail**
- **Patient Detail**
  - Header: `name · bed · main problem · priority`
  - Shows open tasks for that patient (from local state)
  - Simple **“Add task (local only)”** input + button which appends a new open task with default `Today` / `medium` priority

Navigation is handled by a small bottom tab bar (`Today` / `Patients`) plus row clicks.

### Running the frontend

From `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

Vite will print a local dev URL (usually `http://localhost:5173`).

---

## Next Steps / Ideas

- Replace fake frontend data with real API calls to the FastAPI backend.
- Add basic CRUD for patients and tasks (create/edit/complete).
- Implement the Today Queue sorting rules from the spec:
  - Overdue first, then by due time, then by priority.
- Add simple filters (by patient, by priority, “only critical patients”).


