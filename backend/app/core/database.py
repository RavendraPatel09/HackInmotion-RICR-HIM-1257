import os
from sqlalchemy import NullPool
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine
from app.core.config import settings

db_url = settings.DATABASE_URL

if db_url.startswith("postgresql://"):
    async_db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    sync_db_url = db_url
    connect_args = {}
elif db_url.startswith("postgresql+asyncpg://"):
    async_db_url = db_url
    sync_db_url = db_url.replace("postgresql+asyncpg://", "postgresql://", 1)
    connect_args = {}
elif db_url.startswith("sqlite"):
    if db_url.startswith("sqlite+aiosqlite://"):
        async_db_url = db_url
        sync_db_url = db_url.replace("sqlite+aiosqlite://", "sqlite://", 1)
    else:
        async_db_url = db_url.replace("sqlite://", "sqlite+aiosqlite://", 1)
        sync_db_url = db_url
    connect_args = {"check_same_thread": False}
else:
    async_db_url = db_url
    sync_db_url = db_url
    connect_args = {}

# Configure NullPool for tests to prevent event loop closed issues
is_testing = os.getenv("TESTING") == "True"
pool_config = {"poolclass": NullPool} if is_testing else {"pool_pre_ping": True}
if db_url.startswith("sqlite"):
    # NullPool/pre_ping can cause issues in SQLite tests
    pool_config = {}

# Async Engine and SessionMaker (for FastAPI app endpoints)
async_engine = create_async_engine(async_db_url, echo=False, connect_args=connect_args, **pool_config)
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Sync Engine and SessionMaker (for sync tasks, seeds, migrations)
sync_engine = create_engine(sync_db_url, connect_args=connect_args, **pool_config)
SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
