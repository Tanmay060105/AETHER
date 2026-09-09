from aether.client import (
    initialize,
    shutdown,
    create_trace,
    create_span,
    track_llm_call,
    track_tool_call,
    record_error,
    send_telemetry
)

__all__ = [
    "initialize",
    "shutdown",
    "create_trace",
    "create_span",
    "track_llm_call",
    "track_tool_call",
    "record_error",
    "send_telemetry"
]
