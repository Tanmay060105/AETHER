# AETHER Python SDK

The official Python SDK for the AETHER AI Engineering Intelligence Platform.

## Quickstart

```python
import aether

# Initialize once
aether.initialize(api_key="your_api_key", project_id="your_project")

# Create a trace context
with aether.create_trace("chat_interaction"):
    
    # Nested spans
    with aether.create_span("context_retrieval"):
        # do something
        pass
        
    # Track LLM Calls
    aether.track_llm_call(
        model="gpt-4",
        input_data=[{"role": "user", "content": "hi"}],
        output_data=[{"role": "assistant", "content": "hello"}],
        input_tokens=10,
        output_tokens=10
    )
    
    # Automatic error tracking
    try:
        1 / 0
    except Exception as e:
        aether.record_error(e)
```
