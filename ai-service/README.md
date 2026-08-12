# SmartCity Resolve — AI Verification Service

Standalone **Python FastAPI** microservice, called only by the trusted
NestJS Admin API backend (never exposed to citizens or admins directly).

Matches the tech stack spec:
> AI: Separate Python FastAPI service

## What it does

| Endpoint | Purpose |
|---|---|
| `POST /api/v1/classify` | Category, severity, safety-risk from description (+ optional photo) |
| `POST /api/v1/similarity/text` | TF-IDF cosine similarity between two descriptions |
| `POST /api/v1/similarity/image` | Perceptual-hash similarity between two evidence photos |
| `POST /api/v1/duplicate-check` | Composite duplicate score (distance + category + text + image) against candidate issues |
| `POST /api/v1/verify-resolution` | Compares before/after resolution photos, recommends APPROVE / MANUAL_REVIEW / REJECT |
| `POST /api/v1/priority-signals` | Severity + safety-risk signals feeding the Admin API's PriorityEngine |
| `GET  /api/v1/health` | Liveness (no auth) |

All AI endpoints **recommend** — they never make an issue's final status
decision. The Admin API's human reviewers always have override authority,
per the platform's "AI-assisted, human-decided" principle.

## Design notes

- **No downloaded ML models** — classification uses a transparent, auditable
  keyword-rule engine (`app/models/category_keywords.py`); similarity uses
  classical TF-IDF (text) and perceptual hashing (images). This keeps the
  service fully offline-runnable for a hackathon demo, while every function
  is isolated so a real trained model can be swapped in later without
  touching routers, schemas, or callers.
- **Same response envelope as the Admin API** — `{success, data, meta?}` /
  `{success: false, error: {code, message, details?}}` — so the Nest
  `AiModule` (Phase 16) can parse both services identically.
- **Service-to-service auth** — every route except `/health` requires an
  `X-API-Key` header matching `AI_SERVICE_API_KEY`.

## Project structure

```
app/
├── main.py                     # FastAPI app, CORS, global exception handlers
├── core/
│   ├── config.py                # typed settings from env
│   └── security.py              # X-API-Key auth dependency
├── api/v1/
│   ├── router.py                 # aggregates all endpoint routers
│   └── endpoints/
│       ├── health.py
│       ├── classification.py
│       ├── similarity.py
│       ├── duplicate.py
│       ├── verification.py
│       └── priority.py
├── schemas/                     # Pydantic request/response models
├── services/                    # business logic (thin routers call these)
├── utils/                       # geo, text (TF-IDF), image (phash) helpers
└── models/
    └── category_keywords.py     # configurable, swappable classification rules
```

## Setup

```bash
cd smartcity-resolve-ai-service

python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Make sure AI_SERVICE_API_KEY here matches AI_SERVICE_API_KEY
# in the Admin API's .env — they must be identical.
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

Or with Docker:

```bash
docker compose up --build
```

## Test it

```bash
# Health (no auth)
curl http://localhost:8000/api/v1/health

# Classify an issue
curl -X POST http://localhost:8000/api/v1/classify \
  -H "Content-Type: application/json" \
  -H "X-API-Key: replace-with-internal-service-key" \
  -d '{
    "issue_id": "issue_123",
    "description": "Large pothole on main road causing accidents near school zone"
  }'

# Text similarity
curl -X POST http://localhost:8000/api/v1/similarity/text \
  -H "Content-Type: application/json" \
  -H "X-API-Key: replace-with-internal-service-key" \
  -d '{
    "text_a": "Pothole on MG Road near the signal",
    "text_b": "Big pothole near MG Road traffic signal"
  }'

# Priority signals
curl -X POST http://localhost:8000/api/v1/priority-signals \
  -H "Content-Type: application/json" \
  -H "X-API-Key: replace-with-internal-service-key" \
  -d '{
    "issue_id": "issue_123",
    "category": "ELECTRICITY",
    "description": "Exposed live wire hanging near a school zone",
    "upvotes": 12,
    "duplicate_count": 3,
    "age_hours": 20,
    "location_importance": 0.9
  }'
```

Interactive Swagger docs: **http://localhost:8000/api/docs**

## Integration with the Admin API

In the NestJS Admin API's `AiModule` (Phase 16), calls to this service
should:

1. Read `AI_SERVICE_URL` and an internal API key from config
2. Send `X-API-Key: <key>` on every request
3. Treat every response as a **recommendation** — persist it via the
   `AiVerification` Prisma model with `reviewedBy: null` until an admin
   confirms or overrides it
4. Set a reasonable timeout (2-5s) and fail gracefully — if this service
   is down, issue creation/resolution flows must still work; AI fields
   are enrichment, not a hard dependency
