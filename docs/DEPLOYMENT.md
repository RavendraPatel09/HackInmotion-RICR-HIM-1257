# NagarSathi Deployment Guide

## Architecture

```
┌─────────────────────────┐       ┌──────────────────────────┐
│     VERCEL (Frontend)   │       │    RENDER (Backend)      │
│                         │       │                          │
│  React + Vite SPA       │──────▶│  FastAPI (Python 3.12)   │
│  Static hosting         │ HTTPS │  uvicorn                 │
│                         │       │                          │
│  VITE_API_URL env var   │       │  ┌──────────────────┐    │
│  points to Render URL   │       │  │ PostgreSQL (Free)│    │
│                         │       │  └──────────────────┘    │
└─────────────────────────┘       └──────────────────────────┘
```

---

## Step 1: Deploy Backend on Render

### Option A: Blueprint (Recommended)

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repo: `RavendraPatel09/HackInmotion-RICR-HIM-1257`
4. Render auto-detects `render.yaml` and creates:
   - A **Web Service** (`nagarsathi-backend`)
   - A **PostgreSQL Database** (`nagarsathi-db`)
5. Click **"Apply"** — Render will build and deploy automatically

### Option B: Manual Setup

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. **Create PostgreSQL Database:**
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `nagarsathi-db`
   - Plan: Free
   - Copy the **Internal Database URL**

3. **Create Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Connect repo: `RavendraPatel09/HackInmotion-RICR-HIM-1257`
   - **Root Directory**: `Backend`
   - **Runtime**: Python
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt && python -m alembic upgrade head`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables** on the Web Service:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | *(paste Internal Database URL from step 2)* |
   | `JWT_SECRET_KEY` | *(generate a random 64-char hex string)* |
   | `JWT_ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
   | `REFRESH_TOKEN_EXPIRE_DAYS` | `7` |
   | `CORS_ORIGINS` | `["https://YOUR-VERCEL-URL.vercel.app","http://localhost:5173"]` |
   | `PYTHON_VERSION` | `3.12.0` |

5. Click **"Create Web Service"** — wait for build to complete
6. Note your Render URL (e.g., `https://nagarsathi-backend.onrender.com`)

### Seed the Database

After the first successful deploy, open the Render **Shell** tab and run:
```bash
cd Backend && python -c "from app.seed import seed_database; seed_database()"
```

---

## Step 2: Deploy Frontend on Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select: `RavendraPatel09/HackInmotion-RICR-HIM-1257`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (root — the `package.json` is at the root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Set Environment Variable:**

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://nagarsathi-backend.onrender.com/api` |

   *(Replace with your actual Render backend URL from Step 1)*

6. Click **"Deploy"**

---

## Step 3: Update CORS on Render

After Vercel deploys, copy your Vercel URL and update the `CORS_ORIGINS` env var on Render:

```
["https://hackinmotion-ricr-him-1257.vercel.app","http://localhost:5173"]
```

Then click **"Manual Deploy"** → **"Clear build cache & deploy"** on Render.

---

## Verification Checklist

After both services are live:

- [ ] Visit Vercel URL — homepage loads
- [ ] Login with `citizen@nagarsathi.demo` / `password123`
- [ ] Create a report — appears in the list
- [ ] Visit `https://YOUR-RENDER-URL/docs` — Swagger docs load
- [ ] Check `https://YOUR-RENDER-URL/api/health` — returns healthy

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Citizen | `citizen@nagarsathi.demo` | `password123` |
| Admin | `admin@nagarsathi.demo` | `password123` |
