import time
import redis.asyncio as redis
from fastapi import HTTPException
from app.core.config import settings

# Create a global redis pool
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

async def check_rate_limit(project_id: str, limit: int = 1000, window_seconds: int = 60):
    """
    MVP Rate limiter: Allows `limit` requests per `window_seconds` per project.
    Uses a simple sliding window or fixed window counter in Redis.
    """
    current_time = int(time.time())
    window_key = f"rate_limit:{project_id}:{current_time // window_seconds}"
    
    try:
        # Atomic increment and expire
        async with redis_client.pipeline(transaction=True) as pipe:
            pipe.incr(window_key)
            pipe.expire(window_key, window_seconds * 2)
            results = await pipe.execute()
            
        current_count = results[0]
        if current_count > limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
    except redis.RedisError:
        # If redis fails, fail open to avoid dropping telemetry during infrastructure hiccups
        pass
