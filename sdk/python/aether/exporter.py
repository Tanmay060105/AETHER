import json
import time
import httpx
from typing import List, Dict, Any

from aether.config import SDKConfig
from aether.logger import logger

class Exporter:
    def __init__(self, config: SDKConfig):
        self.config = config
        self.client = httpx.Client(
            timeout=httpx.Timeout(connect=3.0, read=10.0, write=10.0, pool=3.0),
            limits=httpx.Limits(max_keepalive_connections=5, max_connections=10)
        )
        self.auth_invalidated = False

    def export_batch(self, batch: List[Dict[str, Any]]) -> bool:
        """
        Exports a batch of serialized traces to the ingestion endpoint.
        Returns True if successful or unrecoverable (dropped), False if should retry.
        """
        if self.auth_invalidated:
            logger.warning("Auth token invalidated. Dropping batch.")
            return True # Pretend success to drop

        payload = {"traces": batch}
        try:
            body = json.dumps(payload).encode("utf-8")
        except TypeError as e:
            logger.error(f"Failed to serialize batch: {e}")
            return True # Unrecoverable, drop batch

        # Size check
        if len(body) > self.config.max_payload_bytes:
            logger.error("Batch exceeds maximum payload size. Dropping.")
            return True

        headers = {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json"
        }

        retries = 0
        max_retries = 3

        while retries <= max_retries:
            try:
                response = self.client.post(self.config.ingest_url, content=body, headers=headers)
                
                status = response.status_code
                if 200 <= status < 300:
                    return True # Success
                elif status in (400, 403, 404, 422):
                    logger.warning(f"Dropping batch due to unrecoverable client error {status}: {response.text}")
                    return True
                elif status == 401:
                    logger.error("Unauthorized: Invalid API key. Disabling future requests.")
                    self.auth_invalidated = True
                    return True
                elif status in (408, 429) or status >= 500:
                    # Retryable
                    logger.info(f"Received retryable status {status}. Retrying...")
                    # Respect retry-after if present
                    if status == 429 and "Retry-After" in response.headers:
                        time.sleep(int(response.headers["Retry-After"]))
                    else:
                        time.sleep(2 ** retries)
                    retries += 1
                    continue
                else:
                    logger.warning(f"Unexpected status code {status}. Dropping batch.")
                    return True

            except httpx.RequestError as e:
                logger.warning(f"Network error during export: {e}. Retrying...")
                time.sleep(2 ** retries)
                retries += 1

        logger.error("Max retries exceeded for batch. Dropping.")
        return True # Drop after max retries

    def close(self):
        self.client.close()
