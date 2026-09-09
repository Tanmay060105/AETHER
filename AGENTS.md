# AETHER — Master Development Phases

## Phase 0 — Project Foundation ✅

**Status: Completed**

* Repository structure
* Six core documents
* `AGENTS.md`
* `PROJECT_STATE.md`
* `.gitignore`
* `.env.example`
* `docker-compose.yml`
* `LICENSE`
* Design reference
* Development rules

---

## Phase 1 — Database & Data Model

Build only the database foundation.

* Python backend initialization with `uv`
* SQLAlchemy
* PostgreSQL
* Alembic
* Database configuration
* Core models
* Relationships
* Indexes
* UUID/ID strategy
* Timestamps
* Tenant isolation at data-model level
* Initial migration
* Migration verification
* Database tests

Core entities:

```text
User
Organization
Membership
Project
APIKey
Trace
Span
UsageRecord
Dataset
EvaluationCase
EvaluationRun
EvaluationResult
Experiment
ExperimentResult
Incident
HealthSnapshot
```

**Do NOT build telemetry, SDK, frontend, evaluation engine, etc. yet.**

---

# Phase 2 — Backend Core

Build the FastAPI application foundation.

* FastAPI setup
* Application configuration
* Environment handling
* Database connection
* API structure
* Authentication
* Authorization
* User management
* Organizations
* Memberships
* Projects
* API key management
* Role enforcement
* Error handling
* API versioning
* Health endpoint

Roles:

```text
Owner
Engineer
Viewer
```

---

# Phase 3 — AETHER Python SDK

Create the customer-facing Python SDK.

SDK capabilities:

```text
initialize()
create_trace()
create_span()
track_llm_call()
track_tool_call()
record_error()
send_telemetry()
```

Important rule:

> **SDK failure must never break the customer's AI application.**

Add:

* authentication
* batching
* retries
* timeout handling
* event IDs
* graceful failure
* basic documentation
* SDK tests

---

# Phase 4 — Telemetry Ingestion

Build the real telemetry pipeline.

```text
Customer AI Application
        ↓
AETHER SDK
        ↓
FastAPI /ingest
        ↓
Validation
        ↓
Authentication
        ↓
Project identification
        ↓
Redis
```

Implement:

* telemetry endpoint
* request validation
* API-key authentication
* event IDs
* idempotency
* normalization
* rate limiting
* ingestion errors
* ingestion tests

---

# Phase 5 — Background Processing

Build asynchronous processing.

```text
Redis
   ↓
Worker
   ↓
Normalize
   ↓
Process
   ↓
PostgreSQL
```

Workers for:

* telemetry processing
* cost calculation
* metric aggregation
* evaluation execution
* incident detection
* health calculation

---

# Phase 6 — Frontend Foundation

**This is where the original design becomes extremely important.**

Use:

* Next.js
* TypeScript
* Tailwind CSS

Before implementing UI:

1. Read `AGENTS.md`
2. Read `PROJECT_STATE.md`
3. Read `docs/05-ui-ux.md`
4. Read the original design video:
   `docs/design-reference/AETHER-design-reference.mp4`

The design hierarchy is:

```text
ORIGINAL DESIGN VIDEO
        ↓
UI/UX DOCUMENT
        ↓
FRONTEND IMPLEMENTATION
```

Do **NOT** replace the design with a generic SaaS dashboard.

Build:

* typography system
* spacing system
* layout system
* navigation
* responsive foundation
* animation system
* loading states
* error states
* empty states
* accessibility foundation

---

# Phase 7 — Observe

Build the main AI observability experience.

* Project overview
* Request volume
* Error rate
* Latency
* Token usage
* Cost
* Model usage
* Time-based filtering
* Real telemetry
* Metrics API
* Observe UI

---

# Phase 8 — Trace Explorer

Build:

```text
Trace List
     ↓
Trace Explorer
     ↓
Span Details
```

Features:

* trace search
* filtering
* sorting
* trace timeline
* nested spans
* LLM calls
* tool calls
* errors
* tokens
* latency
* cost
* metadata

This is one of AETHER's most important technical features.

---

# Phase 9 — Evaluation Engine

Build AI quality evaluation.

* Evaluation datasets
* Evaluation cases
* Evaluation runs
* Evaluation results
* Evaluation metrics
* Pass rate
* Correctness
* Relevance
* Consistency
* Evaluation history

---

# Phase 10 — Incidents + AI Health

Build reliability intelligence.

### Incident detection

Initial deterministic rules:

* error-rate threshold
* latency threshold
* traffic anomaly
* repeated model failures

### AI Health

Create an explainable health score based on measurable signals.

Show:

```text
Health Score
     ↓
Why the score changed
     ↓
Affected metrics
     ↓
Related incidents
     ↓
Relevant traces
```

Avoid black-box health scoring in the MVP.

---

# Phase 11 — Experiments

Build controlled AI experiments.

* Experiment creation
* Configuration
* Variants
* Evaluation
* Experiment results
* Comparison
* Historical results

Example:

```text
GPT Model A
     VS
GPT Model B

Quality
Latency
Cost
Error Rate
```

---

# Phase 12 — Optimize + Analytics

Build the optimization layer.

### Analytics

* usage trends
* cost trends
* model performance
* quality trends
* latency trends
* error trends

### Optimize

Identify opportunities such as:

```text
High Cost
High Latency
Low Quality
Repeated Failures
Model Inefficiency
```

---

# Phase 13 — Integrations

Add external integrations **only after the core platform works**.

Potential integrations:

* AI providers
* notification systems
* collaboration tools
* monitoring systems
* webhooks

Do not add integrations just for the sake of increasing the feature count.

---

# Phase 14 — Testing

Full testing pass.

### Backend

* unit tests
* integration tests
* API tests
* database tests

### SDK

* SDK unit tests
* ingestion tests
* retry tests
* failure tests

### Frontend

* component tests
* workflow tests
* browser tests

### End-to-end

Test:

```text
Create Account
      ↓
Create Organization
      ↓
Create Project
      ↓
Generate API Key
      ↓
Connect SDK
      ↓
Send AI Request
      ↓
Telemetry Ingestion
      ↓
Redis
      ↓
Worker
      ↓
PostgreSQL
      ↓
Observe
      ↓
Trace
      ↓
Evaluate
      ↓
Incident
      ↓
Health
```

---

# Phase 15 — Security Hardening

Review:

* authentication
* authorization
* tenant isolation
* API keys
* secrets
* CORS
* CSRF where applicable
* rate limiting
* input validation
* SQL injection protection
* secure headers
* cookies/tokens
* database permissions
* audit logging
* sensitive-data handling

Never expose:

```text
passwords
API keys
JWT secrets
database passwords
provider secrets
```

---

# Phase 16 — Observability

Monitor AETHER itself.

Track:

```text
API requests
API latency
5xx errors
Authentication failures
Telemetry volume
Queue depth
Worker failures
Database latency
Redis health
```

Use structured logs containing relevant IDs such as:

```text
request_id
organization_id
project_id
trace_id
```

Never log secrets.

---

# Phase 17 — Production Deployment

Prepare:

```text
Development
     ↓
Staging
     ↓
Production
```

Infrastructure:

* Docker
* GitHub Actions
* AWS
* PostgreSQL
* Redis
* S3-compatible storage
* application deployment
* HTTPS
* environment configuration
* backups
* monitoring

---

# Phase 18 — Final Production QA

Final verification of:

* functionality
* security
* performance
* UI/UX
* responsiveness
* accessibility
* error handling
* tenant isolation
* data integrity
* deployment
* documentation

Then prepare:

* README
* architecture documentation
* API documentation
* SDK documentation
* setup instructions
* deployment instructions
* demo flow

---

# 🔴 PERMANENT ANTIGRAVITY RULES

Give Antigravity these rules and keep them in `AGENTS.md`.

### Rule 1 — Source of Truth

```text
PRD → Product requirements
SRS → Functional/system requirements
System Architecture → Technical architecture
UI/UX → UI behavior and interaction
Development Plan → Development sequence
Design Video → Visual design
AGENTS.md → Permanent engineering rules
PROJECT_STATE.md → Current project state
```

If documents conflict:

> **STOP and report the conflict. Do not guess.**

---

### Rule 2 — Never Skip Phases

Antigravity must follow:

```text
Phase 0
 ↓
Phase 1
 ↓
Phase 2
 ↓
Phase 3
...
 ↓
Phase 18
```

Never jump from Phase 1 directly to frontend or AI features.

---

### Rule 3 — One Phase at a Time

Before every phase:

1. Read `AGENTS.md`
2. Read `PROJECT_STATE.md`
3. Read relevant documentation
4. Inspect existing implementation
5. Create implementation plan
6. Implement the phase
7. Test it
8. Update `PROJECT_STATE.md`
9. Stop

---

### Rule 4 — Never Build the Whole Application at Once

**Do not say:**

> "Build the complete AETHER application."

Instead:

> "Implement Phase X only."

---

### Rule 5 — Preserve Existing Work

Never unnecessarily rewrite working code.

Before modifying something:

```text
Inspect
→ Understand
→ Modify
→ Test
```

---

### Rule 6 — Real Functionality

Production features must use real:

```text
Database
APIs
Telemetry
Workers
Authentication
Evaluation
Metrics
```

Do not use fake/mock data to make unfinished production features appear complete.

Mocks are acceptable **only for explicitly defined tests/development fixtures**.

---

### Rule 7 — Multi-Tenant Security

Every organization must only access its own:

```text
Projects
Traces
Spans
Datasets
Evaluations
Experiments
Incidents
Analytics
```

Tenant isolation is non-negotiable.

---

### Rule 8 — Don't Over-Engineer

For MVP:

```text
Modular Monolith
```

Do **not** introduce:

```text
Microservices
Kubernetes
Vector database
Complex event architecture
Unnecessary infrastructure
```

unless a documented requirement requires it.

---

### Rule 9 — Design Is Not Optional

The original design video:

```text
docs/design-reference/AETHER-design-reference.mp4
```

is the **visual source of truth**.

The frontend must preserve its:

* visual language
* typography
* spacing
* composition
* hierarchy
* motion
* transitions
* editorial aesthetic

**Do not turn AETHER into a generic dashboard.**

The intended design philosophy is:

> **Editorial outside. Sophisticated engineering workspace inside.**

---

### Rule 10 — Test Every Feature

No feature is considered complete until:

```text
Implementation
     ↓
Test
     ↓
Fix
     ↓
Verify
     ↓
Mark complete
```

---

### Rule 11 — Update Project Memory

After every major phase update:

```text
PROJECT_STATE.md
```

Include:

```text
Current Phase
Completed Work
Current Task
Next Task
Known Issues
Important Decisions
Tests Completed
Do-Not-Change Rules
```

---

### Rule 12 — Never Pretend Something Is Complete

If something is:

* partially implemented
* untested
* broken
* mocked
* blocked

say so explicitly.

---

### Rule 13 — Security First

Never commit:

```text
.env
API keys
passwords
tokens
AWS credentials
database credentials
private keys
```

Only commit:

```text
.env.example
```

with safe placeholder values.

---

### Rule 14 — Don't Change the Stack Without Reason

Approved stack:

```text
Frontend
Next.js + TypeScript + Tailwind

Backend
Python + FastAPI

Database
PostgreSQL + SQLAlchemy + Alembic

Async
Redis + Celery

Storage
S3-compatible storage

Infrastructure
Docker + GitHub Actions + AWS
```

If Antigravity believes another technology is necessary:

> **Stop and ask for approval before introducing it.**

---

# ⭐ The Most Important Rule

Tell Antigravity this:

> **AETHER is not a collection of UI screens. It is a real AI engineering platform. The critical path is SDK → Telemetry API → Redis → Worker → PostgreSQL → Trace API → Frontend. Every major implementation decision should prioritize making this path real, reliable, secure, and testable.**