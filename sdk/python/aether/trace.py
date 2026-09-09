import contextvars
import datetime
import traceback
from typing import Optional, Any
from contextlib import contextmanager

from aether.models import TraceData, SpanData
from aether.config import SDKConfig
from aether.logger import logger

# Global context variables for asyncio/thread-safe propagation
_current_trace: contextvars.ContextVar[Optional[TraceData]] = contextvars.ContextVar("aether_trace", default=None)
_current_span: contextvars.ContextVar[Optional[SpanData]] = contextvars.ContextVar("aether_span", default=None)

# We need a reference to the global queue, which will be injected from client.py
# to avoid circular dependencies.
_enqueue_func = None

def _get_utc_now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

@contextmanager
def create_trace(name: str, config: SDKConfig, project_id: str):
    """Context manager for an entire Trace."""
    if config.disabled:
        yield None
        return

    trace = TraceData(
        project_id=project_id,
        start_time=_get_utc_now()
    )
    
    token = _current_trace.set(trace)
    try:
        yield trace
    except Exception as e:
        trace.status = "failed"
        trace.error_message = traceback.format_exc()[:config.max_traceback_len]
        raise e
    finally:
        trace.end_time = _get_utc_now()
        _current_trace.reset(token)
        if _enqueue_func:
            _enqueue_func(trace)

@contextmanager
def create_span(name: str, span_type: str = "custom", config: SDKConfig = None):
    """Context manager for a nested Span."""
    trace = _current_trace.get()
    
    if not trace or (config and config.disabled):
        yield None
        return

    # Enforce span limit
    if config and len(trace.spans) >= config.max_spans_per_trace:
        logger.warning(f"Max spans ({config.max_spans_per_trace}) reached for trace {trace.id}. Dropping new span.")
        yield None
        return

    parent_span = _current_span.get()
    
    span = SpanData(
        trace_id=trace.id,
        parent_span_id=parent_span.id if parent_span else None,
        name=name,
        span_type=span_type,
        start_time=_get_utc_now()
    )
    
    trace.spans.append(span)
    token = _current_span.set(span)
    
    try:
        yield span
    except Exception as e:
        span.status = "failed"
        span.error_message = traceback.format_exc()[:config.max_traceback_len]
        trace.status = "failed" # Mark trace failed too
        raise e
    finally:
        span.end_time = _get_utc_now()
        _current_span.reset(token)
