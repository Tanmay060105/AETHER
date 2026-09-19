import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def main():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5432/aether')
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        print('Tables:', [row[0] for row in res])
        
        # also check alembic_version if it exists
        res = await conn.execute(text("SELECT * FROM alembic_version"))
        print('alembic_version:', [row[0] for row in res])

try:
    asyncio.run(main())
except Exception as e:
    print('Error:', e)
