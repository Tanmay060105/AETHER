import os
import sys
import asyncio
import time
from uuid import uuid4

# The AETHER python SDK is local/installed in the virtual environment.
import aether

async def main():
    project_id = os.getenv("AETHER_PROJECT_ID")
    api_key = os.getenv("AETHER_API_KEY")
    
    if not project_id or not api_key:
        print("ERROR: AETHER_PROJECT_ID and AETHER_API_KEY must be set in the environment.")
        sys.exit(1)
        
    print(f"Initializing AETHER SDK for project: {project_id}")
    
    # Initialize the SDK
    aether.initialize(
        api_key=api_key,
        project_id=project_id
    )
    
    print("Generating telemetry...")
    
    # 1. Successful trace with LLM call and tool call
    with aether.create_trace(name="customer_support_query") as trace:
        with aether.create_span(name="retrieve_docs") as span:
            time.sleep(0.1) # Simulate work
            aether.track_tool_call(
                name="vector_search",
                input_data={"query": "password reset"},
                output_data={"docs": ["doc_1", "doc_2"]}
            )
            
        with aether.create_span(name="generate_response") as span:
            time.sleep(0.5)
            aether.track_llm_call(
                model="gpt-4",
                input_data="Context: doc_1, doc_2. Query: password reset",
                output_data="To reset your password...",
                input_tokens=45,
                output_tokens=15
            )
            
    print(f"Created successful trace: {trace.id}")
            
    # 2. Failed trace
    try:
        with aether.create_trace(name="failing_transaction") as error_trace:
            with aether.create_span(name="database_lookup") as error_span:
                time.sleep(0.2)
                raise ValueError("Database connection lost")
    except ValueError:
        pass
        
    print(f"Created failed trace: {error_trace.id}")
    
    # Flush the exporter
    print("Flushing telemetry background exporter...")
    # Give the background thread time to flush (aether SDK usually flushes on exit or immediately in dev)
    # The SDK exports to the ingest API.
    # We will wait a moment to ensure it is sent.
    time.sleep(2)
    
    print("Telemetry submitted to ingestion API.")
    print("Please verify the Celery worker and PostgreSQL database.")

if __name__ == "__main__":
    asyncio.run(main())
