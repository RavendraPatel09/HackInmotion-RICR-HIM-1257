# NagarSathi Backend API

Python FastAPI + PostgreSQL backend for NagarSathi Civic Platform.

## Setup & Run

1. Create Virtualenv:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize schema:
   ```bash
   alembic upgrade head
   ```

4. Seed default data:
   ```bash
   python app/seed.py
   ```

5. Launch server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## Test Suite
Run automated tests with:
```bash
pytest
```
