# CityFix - Smart City Issue Resolution Platform

A comprehensive platform for citizens to report civic issues and administrators to resolve them efficiently, powered by AI-assisted analysis and verification.

**Project Type:** Hackathon Project (HackInmotion RICR HIM-1257)  
**Status:** Active Development

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [System Components](#system-components)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development Guide](#development-guide)

---

## 🎯 Project Overview

**CityFix** is a three-tier civic issue management platform designed to bridge the gap between citizens and city administrators. It enables:

- **Citizens:** Report urban issues (potholes, broken lights, water leaks) with photos and descriptions
- **Administrators:** Prioritize and track resolutions with AI-assisted insights
- **AI System:** Classify issues, detect duplicates, verify resolutions with computer vision

The platform follows an **"AI-assisted, human-decided"** principle where AI provides recommendations but humans make final decisions.

---

## 🏗️ Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  React 19 + TypeScript Frontend (Vite)                       │  │
│  │  • Citizen Portal: Report issues with photos & descriptions  │  │
│  │  • Admin Dashboard: Monitor, prioritize & resolve issues     │  │
│  │  • Interactive Map: Leaflet-based issue visualization        │  │
│  │  • Real-time Updates: Charts & analytics (Recharts)          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼────────────────────────────────────────────┐
│                       API GATEWAY LAYER                              │
│                     (NestJS Backend)                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  NestJS 10+ with Modular Architecture                        │  │
│  │  • Health Check Module                                       │  │
│  │  • Issue Management Module (Create, Read, Update)            │  │
│  │  • Resolution Module                                         │  │
│  │  • User/Auth Module                                          │  │
│  │  • AI Verification Module (→ calls AI Service)               │  │
│  │  • Priority Engine Module                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  Common:                                                             │
│  • Exception Filters (HTTP error handling)                          │
│  • Logging Interceptors                                             │
│  • Response Interceptors (unified response envelope)                │
└────────────────────────┬────────────────────────────────────────────┘
         ┌───────────────┼───────────────┐
         │ HTTP/REST    │ HTTP/REST     │
         ▼               ▼               ▼
    ┌────────────┐  ┌─────────────┐  ┌──────────────┐
    │ PostgreSQL │  │ Prisma ORM  │  │ Python FastAPI│
    │ Database   │  │ (Migration) │  │ AI Service    │
    │            │  │             │  │               │
    │ • Users    │  │• Schemas    │  │ • Classify    │
    │ • Issues   │  │• Migrations │  │ • Similarity  │
    │ • Comments │  │• Models     │  │ • Duplicate   │
    │ • Verif.   │  │             │  │ • Verify      │
    │            │  │             │  │ • Priority    │
    └────────────┘  └─────────────┘  └──────────────┘
                                      │
                                      ▼
                                  ┌──────────────┐
                                  │ ML Services  │
                                  │              │
                                  │ • TF-IDF     │
                                  │ • Perceptual │
                                  │   Hashing    │
                                  │ • Keyword    │
                                  │   Rules      │
                                  └──────────────┘
```

### Layered Architecture

```
┌─────────────────────────────────────────────┐
│      PRESENTATION LAYER (Frontend)          │
│  React Components | Pages | Context API     │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│      API LAYER (NestJS Modules)             │
│  Controllers | Services | DTOs              │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│    BUSINESS LOGIC LAYER (Services)          │
│  Business Rules | Algorithms | Validation   │
└────────────┬────────────────────────────────┘
             │
┌────────────▼────────────────────────────────┐
│    DATA ACCESS LAYER (Prisma + Database)    │
│  ORM Models | Migrations | Queries          │
└─────────────────────────────────────────────┘
```

### AI Service Integration Pattern

```
Frontend Request
       │
       ▼
NestJS Backend
       │
       ├─► Validate Input
       │
       ├─► Call AI Service ◄──────────┐
       │                               │
       │                     ┌─────────┘
       │                     │
       │              FastAPI AI Service
       │              • Classification
       │              • Similarity Analysis
       │              • Duplicate Detection
       │              • Resolution Verification
       │              • Priority Signals
       │                     │
       ▼                     │
Store Recommendation         │
in DB                 ◄──────┘
       │
       ▼
Human Review & Override
       │
       ▼
Final Decision
```

---

## 🔧 System Components

### 1. Frontend Application (React + TypeScript)

**Technology Stack:**
- Framework: React 19.2.8
- Build Tool: Vite 8.2.0
- Language: TypeScript 6.0.2
- Styling: Tailwind CSS 4.3.3
- Routing: React Router DOM 7.18.2
- UI Components: Lucide React Icons
- Visualization: Recharts 3.10.1
- Mapping: React Leaflet 5.0.0
- Animation: Framer Motion 13.1.0, GSAP 3.15.0

**Key Folders:**

```
src/
├── pages/              # Page components (Dashboard, IssueDetail, etc.)
├── components/         # Reusable UI components
├── context/           # React Context (state management)
├── services/          # API client services
├── hooks/             # Custom React hooks
├── utils/             # Helper functions
├── types/             # TypeScript type definitions
├── data/              # Static data & constants
└── assets/            # Images, icons, fonts
```

**Key Features:**
- Issue creation form with geolocation
- Interactive map for issue visualization
- Admin dashboard with analytics
- Real-time status updates
- Photo uploads and gallery views
- Priority-based issue sorting

---

### 2. Backend API (NestJS)

**Technology Stack:**
- Framework: NestJS 10+
- Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT-based (configured)
- Validation: Class-validator

**Module Structure:**

```
Backend/src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
│
├── modules/
│   └── health/               # Health check endpoints
│       ├── health.module.ts
│       ├── health.controller.ts
│       └── health.service.ts
│
├── database/
│   ├── prisma.module.ts       # Prisma initialization
│   ├── prisma.service.ts      # Database service
│   └── migrations/            # DB migrations
│
├── config/
│   ├── configuration.ts       # Environment config
│   └── env.validation.ts      # Config validation
│
└── common/
    ├── interceptors/
    │   ├── logging.interceptor.ts
    │   ├── response.interceptor.ts
    │   └── error.interceptor.ts
    │
    └── filters/
        └── http-exception.filter.ts
```

**Core Responsibilities:**
- REST API endpoints for issue management
- User authentication & authorization
- Data validation & sanitization
- Database operations via Prisma ORM
- Orchestration of AI Service calls
- Response formatting & error handling

**Expected Modules (based on structure):**
- Health Module: System health checks
- Issue Module: CRUD operations for issues
- Resolution Module: Track issue resolutions
- User Module: User profiles & authentication
- AI Integration Module: AI Service orchestration
- Priority Engine: Compute issue priorities

---

### 3. AI Service (Python FastAPI)

**Technology Stack:**
- Framework: FastAPI
- Language: Python 3.9+
- Server: Uvicorn
- Containerization: Docker
- ML Libraries: scikit-learn (TF-IDF), imagehash (perceptual hashing)

**Endpoints:**

```
POST /api/v1/classify
├─ Input: issue description, optional photo
└─ Output: category, severity, safety risk score

POST /api/v1/similarity/text
├─ Input: two text descriptions
└─ Output: cosine similarity score (0-1)

POST /api/v1/similarity/image
├─ Input: two image paths/data
└─ Output: perceptual hash similarity score

POST /api/v1/duplicate-check
├─ Input: issue + candidate issues
└─ Output: composite duplicate scores for each candidate

POST /api/v1/verify-resolution
├─ Input: before & after resolution photos
└─ Output: recommendation (APPROVE | MANUAL_REVIEW | REJECT)

POST /api/v1/priority-signals
├─ Input: issue metadata (category, severity, upvotes, etc.)
└─ Output: priority score & signals

GET /api/v1/health
└─ Output: service health status (no auth required)
```

**Architecture:**

```
ai-service/
├── app/
│   ├── main.py               # FastAPI app + CORS + exception handlers
│   │
│   ├── core/
│   │   ├── config.py         # Environment settings (Pydantic)
│   │   └── security.py       # X-API-Key authentication
│   │
│   ├── api/v1/
│   │   ├── router.py         # Aggregates all routes
│   │   └── endpoints/
│   │       ├── health.py
│   │       ├── classification.py
│   │       ├── similarity.py
│   │       ├── duplicate.py
│   │       ├── verification.py
│   │       └── priority.py
│   │
│   ├── schemas/              # Pydantic request/response models
│   │
│   ├── services/             # Business logic layer
│   │   ├── classification_service.py
│   │   ├── similarity_service.py
│   │   ├── duplicate_service.py
│   │   ├── verification_service.py
│   │   └── priority_service.py
│   │
│   ├── utils/                # Helper functions
│   │   ├── text_similarity.py     # TF-IDF utilities
│   │   ├── image_similarity.py    # Perceptual hashing
│   │   ├── geo_utils.py           # Geospatial calculations
│   │   └── validators.py
│   │
│   └── models/
│       └── category_keywords.py   # Classification rules (swappable)
│
├── Dockerfile                # Container image
├── docker-compose.yml        # Local development setup
└── requirements.txt          # Python dependencies
```

**Key Design Principles:**
- No pre-trained ML models (keyword rules + classical algorithms)
- Isolated service for easy model swaps
- Unified response envelope matching backend
- Service-to-service authentication (X-API-Key header)
- Graceful degradation (if AI Service down, platform still works)

---

## 🛠️ Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript | UI/UX, routing, state management |
| | Vite | Fast build & dev server |
| | Tailwind CSS | Responsive styling |
| | Leaflet | Interactive mapping |
| | Recharts | Data visualization |
| **Backend** | NestJS | REST API, modularity, DI |
| | TypeScript | Type safety |
| | Prisma | Type-safe ORM & migrations |
| | PostgreSQL | Primary data store |
| **AI Service** | FastAPI | Lightweight, async API |
| | Python 3.9+ | ML & data processing |
| | scikit-learn | TF-IDF similarity |
| | imagehash | Perceptual hashing |
| **DevOps** | Docker | Containerization |
| | Docker Compose | Local orchestration |

---

## 📁 Project Structure

### Root Directory Layout

```
HackInmotion-RICR-HIM-1257/
│
├── Frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context providers
│   │   ├── services/        # API client
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Helper utilities
│   │   ├── types/           # TypeScript types
│   │   ├── data/            # Static data
│   │   ├── assets/          # Images & icons
│   │   ├── App.tsx          # Root component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   │
│   ├── public/              # Static assets
│   ├── package.json         # Dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.js   # Tailwind config
│   ├── tsconfig.json        # TypeScript config
│   └── index.html           # HTML template
│
├── Backend/
│   ├── src/
│   │   ├── main.ts          # Entry point
│   │   ├── app.module.ts    # Root module
│   │   ├── modules/         # Feature modules
│   │   ├── database/        # Prisma setup
│   │   ├── config/          # Configuration
│   │   └── common/          # Shared utilities
│   │
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   │
│   ├── package.json         # Dependencies
│   ├── tsconfig.json        # TypeScript config
│   └── .env.example         # Environment template
│
├── ai-service/
│   ├── app/
│   │   ├── main.py          # FastAPI app
│   │   ├── core/            # Config & security
│   │   ├── api/             # API routes
│   │   ├── schemas/         # Request/response models
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper utilities
│   │   └── models/          # ML models & rules
│   │
│   ├── Dockerfile           # Container image
│   ├── docker-compose.yml   # Development setup
│   ├── requirements.txt     # Python dependencies
│   └── README.md            # AI Service docs
│
├── README.md                # Main project README
└── README_ARCH.md           # This architecture document
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ (for frontend & backend)
- Python 3.9+ (for AI service)
- PostgreSQL 14+ (for database)
- Docker & Docker Compose (optional, for containerized setup)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/RavendraPatel09/HackInmotion-RICR-HIM-1257.git
cd HackInmotion-RICR-HIM-1257
```

### 2. Frontend Setup

```bash
cd src  # or navigate to frontend folder
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# VITE_API_URL=http://localhost:3000/api
```

### 3. Backend Setup

```bash
cd Backend
npm install

# Setup Prisma
npx prisma migrate dev

# Create environment file
cp .env.example .env

# Configure:
# DATABASE_URL=postgresql://user:password@localhost:5432/cityfix
# JWT_SECRET=your-secret-key
# AI_SERVICE_URL=http://localhost:8000
# AI_SERVICE_API_KEY=your-internal-api-key
```

### 4. AI Service Setup

```bash
cd ai-service

# Create Python virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Configure:
# AI_SERVICE_API_KEY=your-internal-api-key
# PORT=8000
```

---

## ▶️ Running the Application

### Development Mode

#### Option 1: Individual Services (Recommended for Development)

**Terminal 1 - Database:**
```bash
# Start PostgreSQL (if using local install)
# or start Docker container:
docker run -d \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=cityfix \
  -p 5432:5432 \
  postgres:14
```

**Terminal 2 - Backend:**
```bash
cd Backend
npm install
npm run start:dev
# Backend running on http://localhost:3000
```

**Terminal 3 - AI Service:**
```bash
cd ai-service
source .venv/bin/activate
python -m uvicorn app.main:app --reload --port 8000
# AI Service running on http://localhost:8000
```

**Terminal 4 - Frontend:**
```bash
npm install
npm run dev
# Frontend running on http://localhost:5173
```

#### Option 2: Docker Compose (Full Stack)

```bash
# From root directory
docker-compose up --build

# Access:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# AI Service: http://localhost:8000
```

---

## 📚 API Documentation

### Backend API

**Base URL:** `http://localhost:3000/api`

**Response Envelope:**

```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2024-08-14T10:30:00Z",
    "version": "1.0"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {}
  }
}
```

### AI Service API

**Base URL:** `http://localhost:8000/api/v1`

**Authentication:** All endpoints (except `/health`) require:
```
X-API-Key: your-internal-service-key
Content-Type: application/json
```

**Example: Classify Issue**

```bash
curl -X POST http://localhost:8000/api/v1/classify \
  -H "Content-Type: application/json" \
  -H "X-API-Key: replace-with-internal-service-key" \
  -d '{
    "issue_id": "issue_123",
    "description": "Large pothole on main road causing accidents",
    "latitude": 23.1815,
    "longitude": 79.9864
  }'
```

**Swagger UI:** http://localhost:8000/docs

---

## 🗄️ Database Schema

### Key Prisma Models

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  role        Role     @default(CITIZEN)  // CITIZEN | ADMIN
  issues      Issue[]
  comments    Comment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Issue {
  id            String    @id @default(cuid())
  title         String
  description   String
  category      String    // POTHOLE, LIGHTING, WATER, etc.
  severity      Severity  // LOW | MEDIUM | HIGH | CRITICAL
  latitude      Float
  longitude     Float
  photos        String[]  // Photo URLs
  
  status        IssueStatus  // OPEN | IN_PROGRESS | RESOLVED | REJECTED
  creator       User     @relation(fields: [creatorId], references: [id])
  creatorId     String
  
  upvotes       Int      @default(0)
  duplicateOf   String?  // Issue ID if duplicate
  duplicates    String[] // Issue IDs that are duplicates of this
  
  aiVerification AiVerification?
  comments      Comment[]
  resolution    Resolution?
  
  priority      Int      @default(0)  // Computed by priority engine
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model AiVerification {
  id              String   @id @default(cuid())
  issue           Issue    @relation(fields: [issueId], references: [id])
  issueId         String   @unique
  
  category        String?
  severity        String?
  safetyRiskScore Float?
  
  duplicateCandidates DuplicateCandidate[]
  
  reviewedBy      User?    @relation(fields: [reviewedById], references: [id])
  reviewedById    String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Resolution {
  id                String   @id @default(cuid())
  issue             Issue    @relation(fields: [issueId], references: [id])
  issueId           String   @unique
  
  resolverName      String
  resolutionPhotos  String[]
  notes             String?
  
  verificationStatus VerificationStatus  // PENDING | APPROVED | REJECTED | MANUAL_REVIEW
  aiVerificationScore Float?
  
  approvedBy        User?    @relation(fields: [approvedById], references: [id])
  approvedById      String?
  
  completedAt       DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  issue     Issue    @relation(fields: [issueId], references: [id])
  issueId   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  CITIZEN
  ADMIN
}

enum IssueStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  REJECTED
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
  MANUAL_REVIEW
}
```

---

## 👨‍💻 Development Guide

### Adding a New Feature

#### 1. Add Backend Endpoint

```bash
# In Backend/src/modules
mkdir my-feature
touch my-feature/my-feature.module.ts
touch my-feature/my-feature.controller.ts
touch my-feature/my-feature.service.ts
```

**my-feature.module.ts:**
```typescript
import { Module } from '@nestjs/common';
import { MyFeatureController } from './my-feature.controller';
import { MyFeatureService } from './my-feature.service';

@Module({
  controllers: [MyFeatureController],
  providers: [MyFeatureService],
})
export class MyFeatureModule {}
```

**my-feature.controller.ts:**
```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { MyFeatureService } from './my-feature.service';

@Controller('my-feature')
export class MyFeatureController {
  constructor(private service: MyFeatureService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() data: CreateMyFeatureDto) {
    return this.service.create(data);
  }
}
```

#### 2. Update Database Schema

```prisma
// Backend/prisma/schema.prisma
model MyFeature {
  id    String @id @default(cuid())
  name  String
  // ... fields
}
```

```bash
npx prisma migrate dev --name add_my_feature
```

#### 3. Add Frontend Components

```bash
mkdir src/components/MyFeature
touch src/components/MyFeature/MyFeature.tsx
touch src/components/MyFeature/MyFeature.module.css
```

#### 4. Create API Service

```typescript
// src/services/myFeatureService.ts
import api from './apiClient';

export const myFeatureService = {
  async getAll() {
    const response = await api.get('/my-feature');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/my-feature', data);
    return response.data;
  },
};
```

### Code Style Guidelines

- **Frontend:** Use functional components with hooks
- **Backend:** Follow NestJS conventions (modules, services, controllers)
- **Python:** Follow PEP 8 style guide
- **Type Safety:** Leverage TypeScript strictly
- **Testing:** Write unit tests for services

### Git Workflow

```bash
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
# Create Pull Request
```

---

## 🔐 Security Considerations

### Authentication & Authorization
- JWT tokens for user authentication
- Role-based access control (CITIZEN vs ADMIN)
- API key authentication for AI Service

### Data Protection
- Input validation on all endpoints
- SQL injection prevention (Prisma ORM)
- CORS configuration
- Rate limiting (recommended)

### Service Security
- Internal API key for AI Service calls
- Service-to-service TLS (recommended for production)
- Environment variables for secrets

---

## 📊 Monitoring & Logging

### Available Endpoints

- **Health Check:** `GET http://localhost:3000/api/health`
- **AI Service Health:** `GET http://localhost:8000/api/v1/health`

### Logging Strategy

**Backend:**
- Request/response logging via `LoggingInterceptor`
- Error logging via `HttpExceptionFilter`
- Structured logging recommended

**AI Service:**
- FastAPI request logging
- Service metrics via Prometheus (optional)

---

## 🚢 Deployment

### Docker Build

```bash
# Frontend
docker build -f Frontend/Dockerfile -t cityfix-frontend:latest .

# Backend
docker build -f Backend/Dockerfile -t cityfix-backend:latest .

# AI Service
docker build -f ai-service/Dockerfile -t cityfix-ai:latest .
```

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@db:5432/cityfix
JWT_SECRET=strong-secret-key
AI_SERVICE_URL=http://ai-service:8000
AI_SERVICE_API_KEY=internal-api-key
NODE_ENV=production
```

**AI Service (.env):**
```
AI_SERVICE_API_KEY=internal-api-key
CORS_ORIGINS=http://backend:3000
PORT=8000
```

---

## 📝 License

[Add your license information here]

---

## 👥 Contributors

- Ravendra Patel (Lead Developer)
- Team Members: [Add here]

---

## 📞 Support & Issues

For issues, feature requests, or contributions:
1. Check existing GitHub issues
2. Create detailed bug reports
3. Follow the development guide
4. Submit pull requests with tests

---

## 🔗 Resources

- **NestJS Documentation:** https://docs.nestjs.com
- **React Documentation:** https://react.dev
- **FastAPI Documentation:** https://fastapi.tiangolo.com
- **Prisma Documentation:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Last Updated:** August 14, 2024  
**Project Status:** Active Development (Hackathon)
