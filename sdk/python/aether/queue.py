import queue
import threading
import time
from typing import Optional

from aether.config import SDKConfig
from aether.exporter import Exporter
from aether.logger import logger
from aether.models import TraceData

class BackgroundQueue:
    def __init__(self, config: SDKConfig):
        self.config = config
        self.q = queue.Queue(maxsize=config.max_queue_size)
        self.exporter = Exporter(config)
        self.dropped_events = 0
        
        self._stop_event = threading.Event()
        self._thread: Optional[threading.Thread] = None
        
        if not self.config.disabled:
            self._thread = threading.Thread(target=self._worker, daemon=True, name="AetherSDKWorker")
            self._thread.start()

    def enqueue(self, trace: TraceData):
        if self.config.disabled or self._stop_event.is_set():
            return
        
        try:
            # Serialize early so we only queue dicts
            data = trace.serialize()
            
            # Individual event size limit
            import json
            if len(json.dumps(data)) > self.config.max_event_bytes:
                logger.warning("Trace exceeds max event size limit. Dropping.")
                self.dropped_events += 1
                return
                
            self.q.put_nowait(data)
        except queue.Full:
            self.dropped_events += 1
            logger.warning(f"AETHER SDK queue full. Dropped trace {trace.id}. Total dropped: {self.dropped_events}")
        except Exception as e:
            logger.error(f"Failed to enqueue trace: {e}")

    def _worker(self):
        batch = []
        last_flush = time.time()
        
        while not self._stop_event.is_set() or not self.q.empty():
            try:
                # Wait for up to 1 second for an event
                item = self.q.get(timeout=1.0)
                batch.append(item)
                self.q.task_done()
            except queue.Empty:
                pass

            now = time.time()
            if len(batch) >= self.config.max_batch_size or (batch and now - last_flush >= 1.0) or self._stop_event.is_set():
                if batch:
                    success = self.exporter.export_batch(batch)
                    if success:
                        batch = [] # Clear batch whether succeeded or explicitly dropped
                    last_flush = time.time()

    def flush(self):
        """Called during atexit."""
        if not self._thread or not self._thread.is_alive():
            return
        
        logger.info("AETHER SDK flushing pending traces...")
        self._stop_event.set()
        
        # Hard deadline on joining the thread
        self._thread.join(timeout=self.config.flush_timeout_sec)
        
        if self._thread.is_alive():
            logger.error(f"SDK flush timed out after {self.config.flush_timeout_sec} seconds. Dropping remaining events.")
        
        self.exporter.close()
