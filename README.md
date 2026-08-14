# 🦚 NagarSathi (नगर साथी) — Smart City Civic Grievance & Resolution Platform

> **"Hamara Shehar, Hamari Awaaz"** (हमारा शहर, हमारी आवाज़)  
> *Empowering citizens, streamlining municipal operations, and verifying resolutions across Indian cities.*

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python%203.12-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20SQLAlchemy%202.0-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Leaflet](https://img.shields.io/badge/GIS%20Maps-Leaflet%20Cluster-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![AI Microservice](https://img.shields.io/badge/AI%20Engine-FastAPI%20%2B%20TF--IDF%20%2B%20pHash-FF6F00)](./ai-service)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🏛️ System Architecture

NagarSathi is built with a resilient, decoupled micro-architecture combining a high-performance **React frontend**, an asynchronous **FastAPI Core Backend**, an **AI Verification & Duplicate Detection Service**, and a **PostgreSQL relational database**.

```mermaid
graph TB
    subgraph "Client Tier (Browser / Mobile PWA)"
        UI["🌐 NagarSathi Web App (React 19 + Vite + Tailwind CSS)"]
        GIS["🗺️ Leaflet GIS Engine (Custom Density Clustering)"]
        LANG["🗣️ Multilingual Engine (10 Indian Regional Languages)"]
    end

    subgraph "API Gateway & Security"
        AUTH["🔐 JWT + Async SMTP Email OTP Authentication"]
        CORS["🛡️ CORS & Request Validation"]
    end

    subgraph "Core Backend Services (FastAPI / Python 3.12)"
        ROUTER_ISSUE["📋 Issue Management & Department Auto-Routing"]
        SLA_ENGINE["⏱️ 72-Hour SLA Countdown & Priority Escalation"]
        TRANSPARENCY["📊 Municipal Transparency & Scoreboard Engine"]
        NOTIF_SVC["🔔 Real-Time Notification Center"]
    end

    subgraph "AI Microservice (FastAPI)"
        AI_CLASS["🏷️ Category & Severity Classification"]
        AI_DUP["🔍 Composite Duplicate Detector (Text + Image + Geo)"]
        AI_VERIFY["📸 Before/After Photo Resolution Verification"]
    end

    subgraph "Data Tier"
        PG[("🐘 PostgreSQL Database")]
        ALEMBIC["🔄 Alembic Schema Migrations"]
    end

    UI --> AUTH
    UI --> GIS
    UI --> LANG
    AUTH --> CORS
    CORS --> ROUTER_ISSUE
    CORS --> SLA_ENGINE
    CORS --> TRANSPARENCY
    CORS --> NOTIF_SVC

    ROUTER_ISSUE <--> AI_CLASS
    ROUTER_ISSUE <--> AI_DUP
    ROUTER_ISSUE <--> AI_VERIFY

    ROUTER_ISSUE --> PG
    SLA_ENGINE --> PG
    TRANSPARENCY --> PG
    NOTIF_SVC --> PG
    ALEMBIC -.-> PG
```

### Detailed Component Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           1. Citizen Reports Issue                              │
│  [Photo + Category + Title + GPS Coordinates + Description]                     │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    2. AI Verification & Duplicate Detection                     │
│  - TF-IDF Text Similarity + Perceptual Hash (pHash) on Evidence Photos          │
│  - Checks existing active issues within 100m radius                             │
│  - If duplicate: Offers citizen to upvote existing ticket ("I have this too")   │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ (If Unique)
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  3. Automated Department Routing & SLA Clock                    │
│  - Assigned to Ward Officer / Municipal Department (Roads, Sanitation, Water)   │
│  - Starts 72-hour SLA countdown timer with dynamic severity weights             │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     4. Municipal Action & Field Resolution                      │
│  - Officer updates status: Reported ➔ Acknowledged ➔ In Progress ➔ Resolved     │
│  - Uploads "After" photo evidence of completed civic repair                     │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     5. Citizen Confirmation & Verification                      │
│  - Citizen reporter & community verify fix ➔ Status: Verified ✅                │
│  - Updates Department Performance & Transparency Scoreboard                     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Citizen Experience
- **Interactive Multi-Step Reporting**: Report civic problems with GPS auto-detection, manual locality selection, photo evidence uploads, and department categorization.
- **72-Hour SLA Countdown**: Real-time timer tracking municipal accountability with automatic escalation tags for overdue issues.
- **Dynamic Resolution Stepper**: Step-by-step resolution tracking: `Reported` ➔ `Acknowledged` ➔ `In Progress` ➔ `Resolved` ➔ `Verified`.
- **Citizen Verification Loop**: Issue closure requires citizen confirmation with "Confirm Fixed" or "Reopen Issue" actions.
- **Community Priority Upvoting**: Citizens can upvote nearby issues to escalate emergency priority for the municipal admin queue.
- **10 Indian Languages**: Native script switching across English, Hindi (हिंदी), Marathi (मराठी), Bengali (বাংলা), Gujarati (ગુજરાતી), Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), and Punjabi (ਪੰਜਾਬੀ).
- **Gamified Civic Badges**: Earn contribution points and milestone badges (First Report, Community Helper, Resolution Verifier, Neighborhood Champion).

### 2. Municipal Administrator Dashboard
- **Live GIS Ward Heatmaps**: Interactive map with density clustering across 20+ Indian cities and smart filter layers.
- **SLA Escalation Queue**: Instant visibility into high-priority, critical, and breached-SLA tickets.
- **Department Routing**: Auto-delegation to Public Works, Sanitation, Electricity Board, Water Supply, and Drainage Sewerage.
- **Transparency Scoreboard**: Public audit ratings calculated from resolution speed, citizen satisfaction, and SLA adherence.

### 3. AI Verification Microservice
- **Composite Duplicate Detection**: Calculates weighted duplicate score combining distance, category matching, TF-IDF cosine similarity, and perceptual image hashing.
- **AI Before/After Verification**: Compares repair completion photos against original evidence to assist supervisors with verification recommendations (`APPROVE` / `MANUAL_REVIEW` / `REJECT`).
- **Safety Risk Signals**: Automated priority recommendations based on text sentiment and civic hazard severity.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Lucide Icons |
| **GIS & Mapping** | Leaflet, React-Leaflet, Custom Grid Density Clustering, OpenStreetMap |
| **State & Localization** | React Context API, Custom Translation Engine (10 Languages), LocalStorage Sync |
| **Core Backend** | Python 3.12, FastAPI, SQLAlchemy 2.0 (Async), Pydantic v2, Uvicorn |
| **Database & Migration** | PostgreSQL, asyncpg, Alembic |
| **Security & Auth** | JWT (JSON Web Tokens), Passlib (Bcrypt), Async SMTP Email OTP Verification |
| **AI Microservice** | Python 3.12, FastAPI, scikit-learn (TF-IDF), ImageHash, Pillow, NumPy |
| **Design System** | Peacock Green Palette (`#053229`), High-Contrast Dark Mode & Light Mode Tokens |

---

## 📂 Repository Structure

```
.
├── src/                          # React 19 Frontend Application
│   ├── assets/                   # Logos, brand badges, and SVGs
│   ├── components/               # Reusable UI component library
│   │   ├── issues/               # IssueCard, StatusStepper, DuplicateModal
│   │   ├── layout/               # AppShell, Navbar, Sidebar, Header, Footer
│   │   ├── map/                  # CityMap (Leaflet), MapFilters, MapLegend
│   │   └── ui/                   # Badge, Toast, SearchModal, NotificationCenter
│   ├── context/                  # AuthContext, IssuesContext, LanguageContext, ThemeContext
│   ├── data/                     # Indian locations, categories, departments, translations
│   ├── pages/                    # CitizenHome, ReportIssue, MyIssues, CityMapPage,
│   │                             # Settings, Help, Notifications, Transparency, Login
│   ├── services/                 # API client, SLA calculations, notification service
│   └── types/                    # TypeScript data definitions & models
│
├── backend/                      # FastAPI Asynchronous Core Backend
│   ├── alembic/                  # Database migration scripts
│   ├── app/
│   │   ├── core/                 # Config, Database engine, JWT & Security utils
│   │   ├── models/               # SQLAlchemy ORM Models (User, Report, Department, OTP)
│   │   ├── routers/              # REST Endpoints (auth, reports, map, transparency, notifications)
│   │   ├── schemas/              # Pydantic validation request/response schemas
│   │   └── seed.py               # Database seeder with 20+ cities and demo data
│   ├── tests/                    # Pytest unit and journey integration test suite
│   ├── alembic.ini               # Migration configuration
│   └── requirements.txt          # Python dependencies
│
├── ai-service/                   # Standalone AI Verification & Duplicate Detection Service
│   ├── app/
│   │   ├── api/v1/endpoints/     # Classification, Similarity, Duplicate, Verification APIs
│   │   ├── models/               # Category keyword rules & safety models
│   │   ├── services/             # TF-IDF text & pHash image comparison logic
│   │   └── schemas/              # Pydantic request & response models
│   ├── Dockerfile                # Container definition
│   └── docker-compose.yml        # Multi-container orchestration
│
├── public/                       # Static public assets
├── package.json                  # Frontend dependencies and build scripts
├── vite.config.ts                # Vite build configuration
└── README.md                     # Master project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.11 or v3.12
- **PostgreSQL**: Running on port `5432` (or via Docker)

---

### 2. Backend Setup (FastAPI Core)

1. Open terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate

   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (create `.env`):
   ```ini
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/nagarsathi
   SECRET_KEY=nagarsathi_super_secret_jwt_key_2026
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440

   # SMTP Email Configuration for Live OTPs (Optional for local testing)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   EMAILS_FROM_EMAIL=noreply@nagarsathi.gov.in
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Seed initial categories, wards, and demo grievances:
   ```bash
   python app/seed.py
   ```

7. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Interactive Swagger documentation will be available at: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

### 3. AI Service Setup (Optional / Microservice)

1. Open a new terminal and navigate to `ai-service/`:
   ```bash
   cd ai-service
   python3 -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8001
   ```
   AI service Swagger docs: **[http://localhost:8001/docs](http://localhost:8001/docs)**

---

### 4. Frontend Setup (React 19 + Vite)

1. In the project root directory, install npm packages:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Access the web application at: **[http://localhost:5173/](http://localhost:5173/)**

---

## 🔑 Demo & Evaluation Credentials

For fast judging and evaluator testing, NagarSathi includes pre-configured demo workspaces with quick one-click login buttons on the login screen:

| Role | Email | Password | Access / Capabilities |
|---|---|---|---|
| **Citizen User** | `citizen@nagarsathi.demo` | `password123` | Report issues, upvote community tickets, track SLA, confirm resolution, earn badges |
| **Municipal Admin** | `admin@nagarsathi.demo` | `password123` | Department allocation, ward management, SLA override, analytics, audit log |

*(Note: Evaluators can also click **"🎯 Direct Hackathon Evaluation Access"** on the login page to immediately explore the portal with mock data).*

---

## 📡 Core API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register citizen/admin account with ward assignment |
| `POST` | `/api/v1/auth/login` | Authenticate with credentials and receive JWT bearer token |
| `POST` | `/api/v1/auth/otp/send` | Dispatch 6-digit verification code via SMTP email |
| `POST` | `/api/v1/auth/otp/verify` | Verify OTP code and activate account |
| `GET` | `/api/v1/reports` | Fetch paginated grievances with category, city, and status filters |
| `POST` | `/api/v1/reports` | File new grievance with geo-coordinates and photo attachments |
| `PATCH` | `/api/v1/reports/{id}/status` | Transition issue status (`Reported` ➔ `In Progress` ➔ `Resolved`) |
| `POST` | `/api/v1/reports/{id}/upvote` | Add citizen upvote ("I have this problem too") |
| `POST` | `/api/v1/reports/{id}/verify` | Citizen confirmation to verify or reopen resolved issue |
| `GET` | `/api/v1/transparency/stats` | Real-time municipal metrics, SLA adherence, and department scoreboard |

---

## 🧪 Testing & Validation

```bash
# Run backend test suites
cd backend
pytest tests/ -v

# Run frontend production build validation
npm run build
```

---

## 👥 Hackathon Team & Project Info

- **Repository**: [https://github.com/RavendraPatel09/HackInmotion-RICR-HIM-1257.git](https://github.com/RavendraPatel09/HackInmotion-RICR-HIM-1257.git)
- **Event**: HackInmotion 2026 (RICR-HIM-1257)
- **Brand Slogan**: *"Hamara Shehar, Hamari Awaaz"*
- **License**: MIT
