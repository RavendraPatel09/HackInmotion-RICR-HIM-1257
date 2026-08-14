# NagarSathi — India-Wide Civic Issue Reporting & Resolution Platform

NagarSathi is a production-ready, full-stack civic-tech platform for citizens to report local civic issues (potholes, garbage, streetlights, etc.) and for municipal administrators/ward officers to track, assign, and verify resolutions.

## Architecture

```
NagarSathi Frontend (React / TypeScript / Vite)
       ↓  (HTTP / JSON REST API)
FastAPI Backend (Python 3.12)
       ↓  (SQLAlchemy 2.0 ORM / asyncpg)
PostgreSQL Database
```

## Core Features

- **JWT Authentication**: Secure role-based login (Citizen, Municipal Admin, Ward Officer).
- **Relational Issue Tracking**: Dynamic status workflow progression from filing, acknowledgment, progress updates, to citizen verification.
- **Auto Department Routing**: Category database-driven auto routing to respective departments.
- **Interactive Leaflet Map**: Geo-anchored coordinate marker tracking.
- **Dynamic Scoreboard**: Accountability ratings dynamically calculated based on SLA adherence and citizen feedback.
- **Notifications System**: Persistent alerts regarding issue status transitions.

---

## Getting Started

### 1. Prerequisites
- **Python 3.12+**
- **Node.js 18+**
- **PostgreSQL** running locally on port `5432`

### 2. Backend Installation & Run

1. Navigate to the backend directory and set up a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   ```

2. Activate the virtual environment:
   - **Windows PowerShell**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

4. Database Setup:
   - Ensure you have a running PostgreSQL instance.
   - Run migrations to initialize the database tables:
     ```bash
     alembic upgrade head
     ```
   - Seed the database with categories, departments, demo accounts, and sample Bhopal issues:
     ```bash
     python app/seed.py
     ```

5. Start the FastAPI backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   API docs will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Installation & Run

1. Navigate to the project root directory and install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will run at: [http://localhost:5173/](http://localhost:5173/)

---

## Development Credentials

Use these seeded credentials to test the different workspace roles:

- **Citizen Demo Workspace**:
  - Email: `citizen@nagarsathi.demo`
  - Password: `password123`
- **Municipal Administrator Workspace**:
  - Email: `admin@nagarsathi.demo`
  - Password: `password123`

---

## HackInMotion 2026 Audit Status

All 14 HackInMotion requirements are verified and **passed**. Detailed verification matrix can be found in [`docs/requirement-verification.md`](docs/requirement-verification.md).
