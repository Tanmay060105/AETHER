import time

from aether import (
    initialize,
    create_trace,
    track_llm_call,
    track_tool_call,
    record_error,
    shutdown,
)

initialize()


def successful_request():
    with create_trace("successful-ai-request"):
        time.sleep(0.2)

        track_tool_call(
            name="web_search",
            input_data={"query": "AETHER telemetry test"},
            output_data={"results": 3},
        )

        track_llm_call(
            model="test-model",
            input_data={"prompt": "Explain AETHER"},
            output_data={"answer": "Telemetry test successful"},
            input_tokens=40,
            output_tokens=60,
        )


def failed_request():
    try:
        with create_trace("failed-ai-request"):
            time.sleep(0.1)

            track_llm_call(
                model="test-model",
                input_data={"prompt": "Trigger test failure"},
                output_data={"answer": "Failure test"},
                input_tokens=20,
                output_tokens=30,
            )

            raise RuntimeError("Intentional AETHER telemetry test error")

    except RuntimeError as exc:
        # The SDK records the failure on the active trace
        # before the context manager exits.
        record_error(exc)


def another_request():
    with create_trace("another-ai-request"):
        time.sleep(0.3)

        track_tool_call(
            name="database_lookup",
            input_data={"id": "test-123"},
            output_data={"found": True},
        )


print("Sending telemetry...")

successful_request()
failed_request()
another_request()

# Give the background exporter time to send the batch.
time.sleep(5)

shutdown()

print("Telemetry test completed.")