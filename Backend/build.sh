#!/usr/bin/env bash
# Render build script for NagarSathi Backend
set -e

echo "=== Installing Python dependencies ==="
cd Backend
pip install --upgrade pip
pip install -r requirements.txt

echo "=== Running database migrations ==="
python -m alembic upgrade head

echo "=== Seeding database ==="
python -c "
from app.seed import seed_database
seed_database()
print('Database seeded successfully.')
" 2>/dev/null || echo "Seed skipped (already populated or no seed function)."

echo "=== Build complete ==="
