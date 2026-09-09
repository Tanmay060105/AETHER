import os
from typing import Optional

class SDKConfig:
    def __init__(self, api_key: Optional[str] = None, project_id: Optional[str] = None):
        self.api_key = api_key or os.getenv("AETHER_API_KEY")
        self.project_id = project_id or os.getenv("AETHER_PROJECT_ID")
        self.ingest_url = os.getenv("AETHER_INGEST_URL", "https://api.aether.ai/api/v1/ingest")
        
        # Disabled mode flag
        self.disabled = os.getenv("AETHER_SDK_DISABLED", "0").lower() in ("1", "true", "yes")

        # Limits
        self.max_queue_size = 5000
        self.max_batch_size = 100
        self.max_event_bytes = 1_000_000      # 1 MB
        self.max_payload_bytes = 5_000_000    # 5 MB
        self.max_spans_per_trace = 50
        self.max_string_len = 512_000         # 512 KB for I/O
        self.max_meta_keys = 20
        self.max_meta_string_len = 1000
        self.max_traceback_len = 10_000       # 10 KB
        
        self.flush_timeout_sec = 3.0
