import aether
from aether import client

def test_benchmark_create_trace(benchmark):
    aether.initialize(api_key="benchmark", project_id="benchmark")
    client._config.disabled = False
    
    def run_trace():
        with aether.create_trace("bench") as trace:
            with aether.create_span("span"):
                aether.track_llm_call("gpt-4", "hello", "world")
                
    # Run the benchmark
    benchmark(run_trace)
    
    # Cleanup
    aether.shutdown()

