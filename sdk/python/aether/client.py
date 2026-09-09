import atexit
import traceback
from typing import Any, Optional

from aether.config import SDKConfig
from aether.queue import BackgroundQueue
from aether.logger import logger
from aether import trace
from aether.exceptions import InitializationError
from aether.models import SpanData

# Global SDK State
_config: Optional[SDKConfig] = None
_queue: Optional[BackgroundQueue] = None
_initialized = False

def initialize(api_key: str = None, project_id: str = None):
    """Initializes the AETHER SDK globally."""
    global _config, _queue, _initialized
    
    try:
        _config = SDKConfig(api_key=api_key, project_id=project_id)
        
        if _config.disabled:
            logger.info("AETHER SDK is explicitly disabled.")
            _initialized = True
            return

        if not _config.api_key or not _config.project_id:
            raise InitializationError("api_key and project_id are required unless AETHER_SDK_DISABLED=1")

        _queue = BackgroundQueue(_config)
        
        # Inject the enqueue function into the trace module to avoid circular imports
        trace._enqueue_func = _queue.enqueue
        
        # Register atexit handler
        atexit.register(shutdown)
        _initialized = True
        logger.info("AETHER SDK Initialized.")
        
    except InitializationError as e:
        # Re-raise initialization errors so the app knows it's misconfigured
        raise e
    except Exception as e:
        # Catch unexpected errors to prevent breaking the app
        logger.error(f"Failed to initialize AETHER SDK: {e}")

def shutdown():
    """Gracefully flushes the queue."""
    global _queue, _initialized
    if _queue:
        _queue.flush()
    _queue = None
    _initialized = False

def create_trace(name: str):
    """Context manager for a new trace."""
    if not _initialized or not _config or _config.disabled:
        from contextlib import nullcontext
        return nullcontext()
        
    try:
        return trace.create_trace(name=name, config=_config, project_id=_config.project_id)
    except Exception as e:
        logger.error(f"Error creating trace: {e}")
        from contextlib import nullcontext
        return nullcontext()

def create_span(name: str, span_type: str = "custom"):
    """Context manager for a new span."""
    if not _initialized or not _config or _config.disabled:
        from contextlib import nullcontext
        return nullcontext()

    try:
        return trace.create_span(name=name, span_type=span_type, config=_config)
    except Exception as e:
        logger.error(f"Error creating span: {e}")
        from contextlib import nullcontext
        return nullcontext()

def track_llm_call(model: str, input_data: Any, output_data: Any, input_tokens: int = 0, output_tokens: int = 0):
    """Records a synchronous LLM call as a span."""
    if not _initialized or not _config or _config.disabled:
        return
        
    try:
        with create_span(name=model, span_type="LLM") as span:
            if span:
                span.input_data = input_data
                span.output_data = output_data
                span.tokens = input_tokens + output_tokens
                span.model = model
    except Exception as e:
        logger.error(f"Error tracking LLM call: {e}")

def track_tool_call(name: str, input_data: Any, output_data: Any = None):
    """Records a tool invocation as a span."""
    if not _initialized or not _config or _config.disabled:
        return
        
    try:
        with create_span(name=name, span_type="Tool") as span:
            if span:
                span.input_data = input_data
                if output_data:
                    span.output_data = output_data
    except Exception as e:
        logger.error(f"Error tracking tool call: {e}")

def record_error(exception: Exception):
    """Records an explicit exception to the current active span and trace."""
    if not _initialized or not _config or _config.disabled:
        return
        
    try:
        current_trace = trace._current_trace.get()
        current_span = trace._current_span.get()
        
        tb = "".join(traceback.format_exception(type(exception), exception, exception.__traceback__))
        tb = tb[:_config.max_traceback_len]
        
        if current_span:
            current_span.status = "failed"
            current_span.error_message = tb
        if current_trace:
            current_trace.status = "failed"
            current_trace.error_message = tb
    except Exception as e:
        logger.error(f"Error recording error: {e}")

def send_telemetry(trace_obj):
    """Manually enqueues a completed trace object (if not using context managers)."""
    if not _initialized or not _config or _config.disabled or not _queue:
        return
        
    try:
        _queue.enqueue(trace_obj)
    except Exception as e:
        logger.error(f"Error sending telemetry manually: {e}")
