# AETHER — AI Engineering Intelligence Platform

## System Architecture Document

**Version:** 1.0
**Architecture Stage:** MVP / Production-Ready Foundation
**Architecture Philosophy:** Practical, modular, scalable without premature complexity
**Primary Stack:** Next.js + FastAPI + PostgreSQL + Redis + Python SDK + Docker

---

# 1. Architecture Overview

AETHER is a multi-tenant SaaS platform that sits between AI applications and the engineers responsible for operating them.

Its primary responsibility is to collect AI execution telemetry, process it, store it, and expose it through an engineering interface.

The core architecture is:

```text
                    AETHER PLATFORM

 AI Applications
       |
       | AETHER Python SDK
       ↓
 ┌─────────────────────┐
 │  Telemetry API      │
 │     FastAPI         │
 └──────────┬──────────┘
            |
            ↓
 ┌─────────────────────┐
 │  Redis / Queue       │
 └──────────┬──────────┘
            |
            ↓
 ┌─────────────────────┐
 │ Background Workers   │
 │ Python               │
 └──────────┬──────────┘
            |
      ┌─────┴─────┐
      ↓           ↓
 PostgreSQL    Object Storage
      |
      ↓
 ┌─────────────────────┐
 │ AETHER API          │
 │ FastAPI             │
 └──────────┬──────────┘
            |
            ↓
 ┌─────────────────────┐
 │ Next.js Frontend    │
 └─────────────────────┘
```

The architecture deliberately avoids introducing Kubernetes, Kafka, Elasticsearch, microservices, or multiple databases during the MVP.

---

# 2. Architecture Principles

AETHER should follow these principles:

### 2.1 Modular Monolith First

The backend should begin as a modular FastAPI application rather than a collection of microservices.

Internally separated modules can later be extracted if scale requires it.

### 2.2 Asynchronous Telemetry Processing

Telemetry ingestion should be lightweight.

The API should accept and validate telemetry, place expensive processing onto a queue, and return quickly.

### 2.3 PostgreSQL First

PostgreSQL should be the primary source of truth.

Use PostgreSQL for:

* Users
* Organizations
* Projects
* API keys
* Traces
* Spans
* Evaluations
* Experiments
* Incidents
* Aggregated metrics

### 2.4 Redis for Temporary/High-Speed Data

Redis should initially handle:

* Background job queue
* Rate limiting
* Short-lived caching
* Temporary processing state

Redis should not become the primary database.

### 2.5 Object Storage Only When Necessary

Large payloads should not unnecessarily inflate PostgreSQL.

Object storage can hold:

* Large evaluation datasets
* Large trace payloads
* Export files
* Uploaded artifacts

The database stores metadata and references.

---

# 3. Recommended Technology Stack

## Frontend

| Technology     | Purpose                   |
| -------------- | ------------------------- |
| Next.js        | Web application           |
| TypeScript     | Type safety               |
| Tailwind CSS   | Styling                   |
| Framer Motion  | Motion and transitions    |
| Recharts       | Standard analytics charts |
| React Flow     | Trace/system graphs       |
| Zod            | Frontend validation       |
| TanStack Query | Server-state management   |

### Why Next.js?

It fits your existing experience and provides:

* App Router
* Server-side rendering where useful
* API integration
* TypeScript
* Strong ecosystem
* Excellent deployment options

---

# 4. Backend

## FastAPI

FastAPI should be the primary backend framework.

### Responsibilities

* Authentication
* Authorization
* Organizations
* Projects
* API keys
* Telemetry ingestion
* Trace APIs
* Evaluation APIs
* Experiment APIs
* Incident APIs
* Analytics APIs

### Supporting Python libraries

Recommended:

* SQLAlchemy
* Alembic
* Pydantic
* Pydantic Settings
* Redis client
* Celery
* PyJWT or equivalent secure token library
* Passlib/Argon2-compatible password hashing
* HTTPX

---

# 5. Database

## PostgreSQL

PostgreSQL is the primary database.

Use it for transactional data and telemetry metadata.

### Extensions

Initially:

* `pgvector` — only if semantic search/RAG capabilities require it
* PostgreSQL native JSONB
* PostgreSQL indexes

Do not add pgvector simply because AETHER is an AI product.

---

# 6. Why Not a Vector Database Yet?

AETHER's MVP does not fundamentally require semantic retrieval.

Most core queries are:

```text
Project
Trace
Span
Model
Timestamp
Status
Error
Evaluation
```

PostgreSQL handles these well.

A dedicated vector database can be introduced later if AETHER adds:

* Semantic trace search
* Similar incident detection
* Natural-language trace retrieval
* Knowledge retrieval

This keeps the MVP simpler.

---

# 7. Redis

Redis serves three main purposes.

## 7.1 Background Jobs

Telemetry processing:

```text
FastAPI
   ↓
Redis
   ↓
Worker
```

## 7.2 Caching

Cache frequently requested:

* Dashboard summaries
* Model pricing
* Project metrics

## 7.3 Rate Limiting

Rate-limit:

* Login
* API requests
* Telemetry ingestion
* Evaluation execution

---

# 8. Background Workers

Use Celery with Redis initially.

Workers handle expensive operations such as:

* Telemetry normalization
* Cost calculation
* Aggregation
* Evaluation execution
* Experiment execution
* Incident detection
* Health-score calculation

The API should not perform expensive work synchronously.

---

# 9. AETHER Python SDK

AETHER should provide a lightweight Python SDK.

Example conceptual structure:

```text
AetherClient
     |
     ├── trace()
     |
     ├── span()
     |
     ├── llm_call()
     |
     ├── tool_call()
     |
     └── error()
```

The SDK communicates with:

```text
POST /api/v1/ingest
```

The SDK should be intentionally small.

It should not contain complex analytics or evaluation logic.

---

# 10. High-Level Component Architecture

```text
                         INTERNET
                            |
             ┌──────────────┴──────────────┐
             |                             |
       AI Applications                  Users
             |                             |
       Python SDK                         HTTPS
             |                             |
             ↓                             ↓
      ┌────────────────────────────────────────┐
      │             API Layer                  │
      │              FastAPI                   │
      └───────────────────┬────────────────────┘
                          |
             ┌────────────┼────────────┐
             ↓            ↓            ↓
        Auth Module   Core API    Ingestion API
             |            |            |
             └────────────┼────────────┘
                          ↓
                   Service Layer
                          |
             ┌────────────┼────────────┐
             ↓            ↓            ↓
        Trace Service  Eval Service  Analytics
             |            |            |
             └────────────┼────────────┘
                          ↓
                       Redis
                          |
                       Workers
                          |
                          ↓
                    PostgreSQL
                          |
                          ↓
                   Object Storage
```

---

# 11. Backend Modular Structure

The FastAPI backend should be organized by domain rather than by technical layer alone.

```text
backend/
├── app/
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── database.py
│   │   └── dependencies.py
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── organizations/
│   │   ├── projects/
│   │   ├── api_keys/
│   │   ├── ingestion/
│   │   ├── traces/
│   │   ├── evaluations/
│   │   ├── experiments/
│   │   ├── incidents/
│   │   ├── analytics/
│   │   └── health/
│   │
│   ├── workers/
│   │   ├── telemetry.py
│   │   ├── evaluations.py
│   │   ├── incidents.py
│   │   └── analytics.py
│   │
│   └── shared/
│       ├── models/
│       ├── schemas/
│       ├── exceptions/
│       └── utilities/
│
├── migrations/
├── tests/
└── requirements/
```

This is a **modular monolith**, not a microservice architecture.

---

# 12. Frontend Architecture

The Next.js application should use domain-oriented routes.

```text
frontend/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── observe/
│   │   ├── evaluate/
│   │   └── ...
│   │
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   │
│   └── dashboard/
│       ├── overview/
│       ├── projects/
│       ├── traces/
│       ├── evaluations/
│       ├── experiments/
│       ├── incidents/
│       ├── analytics/
│       └── settings/
│
├── components/
│   ├── ui/
│   ├── charts/
│   ├── traces/
│   ├── evaluations/
│   └── layout/
│
├── lib/
│   ├── api/
│   ├── auth/
│   └── utils/
│
└── types/
```

---

# 13. API Architecture

AETHER should expose REST APIs.

Base path:

```text
/api/v1/
```

---

# 14. Authentication APIs

```text
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
GET    /auth/me
POST   /auth/password-reset
```

---

# 15. Organization APIs

```text
GET    /organizations
POST   /organizations

GET    /organizations/{organization_id}
PATCH  /organizations/{organization_id}
DELETE /organizations/{organization_id}

GET    /organizations/{organization_id}/members
POST   /organizations/{organization_id}/members
PATCH  /organizations/{organization_id}/members/{user_id}
DELETE /organizations/{organization_id}/members/{user_id}
```

---

# 16. Project APIs

```text
GET    /organizations/{organization_id}/projects
POST   /organizations/{organization_id}/projects

GET    /projects/{project_id}
PATCH  /projects/{project_id}
DELETE /projects/{project_id}
```

---

# 17. API Key APIs

```text
POST   /projects/{project_id}/api-keys
GET    /projects/{project_id}/api-keys
DELETE /projects/{project_id}/api-keys/{key_id}
```

The actual secret should only be returned during creation.

---

# 18. Telemetry APIs

The telemetry endpoint is intentionally separate from normal user APIs.

```text
POST /api/v1/ingest
```

Authentication:

```text
Authorization: Bearer <PROJECT_API_KEY>
```

The ingestion API should be optimized for machine-to-machine traffic.

---

# 19. Trace APIs

```text
GET /projects/{project_id}/traces
GET /projects/{project_id}/traces/{trace_id}
GET /projects/{project_id}/traces/{trace_id}/spans
```

Filtering:

```text
status
model
environment
start_time
end_time
min_duration
max_duration
```

---

# 20. Evaluation APIs

```text
GET    /projects/{project_id}/datasets
POST   /projects/{project_id}/datasets

GET    /datasets/{dataset_id}
PATCH  /datasets/{dataset_id}
DELETE /datasets/{dataset_id}

POST   /datasets/{dataset_id}/cases
GET    /datasets/{dataset_id}/cases

POST   /datasets/{dataset_id}/runs
GET    /datasets/{dataset_id}/runs/{run_id}
GET    /datasets/{dataset_id}/runs/{run_id}/results
```

Evaluation execution is asynchronous.

---

# 21. Experiment APIs

```text
GET    /projects/{project_id}/experiments
POST   /projects/{project_id}/experiments

GET    /experiments/{experiment_id}
POST   /experiments/{experiment_id}/run
GET    /experiments/{experiment_id}/results
```

---

# 22. Incident APIs

```text
GET   /projects/{project_id}/incidents
GET   /incidents/{incident_id}
PATCH /incidents/{incident_id}
```

---

# 23. Analytics APIs

```text
GET /projects/{project_id}/analytics/overview
GET /projects/{project_id}/analytics/requests
GET /projects/{project_id}/analytics/latency
GET /projects/{project_id}/analytics/tokens
GET /projects/{project_id}/analytics/cost
GET /projects/{project_id}/analytics/models
```

---

# 24. Authentication Architecture

Recommended flow:

```text
Browser
   |
   ↓
Next.js
   |
   ↓
FastAPI
   |
   ↓
Authentication Service
   |
   ↓
PostgreSQL
```

For a web SaaS, use secure HTTP-only cookies for session/refresh credentials where practical.

Avoid storing long-lived authentication tokens in `localStorage`.

---

# 25. Authorization Architecture

Authorization should be centralized.

Every request should pass through:

```text
Authentication
       ↓
User Identity
       ↓
Organization Membership
       ↓
Role
       ↓
Resource Ownership
       ↓
Permission
```

Example:

```text
User
 ↓
Organization A
 ↓
Project A
 ↓
Trace A
```

The same user must not access:

```text
Organization B
 ↓
Project B
 ↓
Trace B
```

even if they know the project or trace ID.

---

# 26. Multi-Tenant Data Isolation

Every organization-owned table should contain an organization relationship directly or indirectly.

For important high-volume data such as traces, consider storing:

```text
organization_id
project_id
```

directly on the record.

This makes authorization checks simpler and reduces the risk of accidental cross-tenant queries.

---

# 27. Telemetry Data Flow

The primary AETHER flow is:

```text
        AI APPLICATION
              |
              ↓
        AETHER SDK
              |
              ↓
        HTTPS POST
              |
              ↓
      Telemetry API
              |
       Validate Request
              |
              ↓
         Redis Queue
              |
              ↓
       Background Worker
              |
       ┌──────┼───────┐
       ↓      ↓       ↓
    Normalize Usage  Errors
       |      |       |
       └──────┼───────┘
              ↓
         PostgreSQL
              |
              ↓
         Aggregation
              |
              ↓
        AETHER Dashboard
```

---

# 28. Why Asynchronous Ingestion?

The AI application should not wait for AETHER to perform:

* database-heavy processing
* aggregation
* cost calculation
* incident detection

Instead:

```text
AI App
  ↓
AETHER
  ↓
"Received"
  ↓
AI App continues
```

Then AETHER processes the event in the background.

This reduces monitoring overhead on customer applications.

---

# 29. Trace Processing

When a telemetry event arrives:

```text
1. Authenticate API key
2. Validate payload
3. Identify project
4. Assign ingestion ID
5. Queue event
6. Return acknowledgement
7. Worker processes event
8. Normalize telemetry
9. Calculate derived metrics
10. Persist data
11. Update aggregates
```

---

# 30. Storage Architecture

## PostgreSQL

Primary transactional storage.

Stores:

* Users
* Organizations
* Projects
* Memberships
* API key metadata
* Traces
* Spans
* Evaluations
* Experiments
* Incidents
* Aggregates

---

## Redis

Stores:

* Queued jobs
* Temporary state
* Rate-limit counters
* Cache

---

## Object Storage

Recommended provider:

**AWS S3**

Used for large objects such as:

* Evaluation datasets
* Export files
* Large trace payloads
* Generated reports

PostgreSQL stores:

```text
object_key
bucket
size
content_type
created_at
```

rather than the complete binary content.

---

# 31. PostgreSQL Data Strategy

For MVP, keep the schema relational.

High-volume tables:

```text
traces
spans
usage_records
```

should receive appropriate indexes.

Important indexes include:

```text
organization_id
project_id
created_at
status
model
trace_id
```

Composite indexes should be added based on real query patterns rather than prematurely indexing every field.

---

# 32. Telemetry Retention

The system should eventually support retention policies.

Example:

```text
Raw traces
     ↓
30 days

Aggregated metrics
     ↓
Longer retention
```

The exact period should be configurable.

Retention cleanup should run asynchronously.

---

# 33. Caching Strategy

Cache only expensive, frequently requested data.

Good candidates:

* Project overview metrics
* Model pricing
* Health calculations
* Organization/project metadata

Do not cache every API response.

Cache invalidation should be explicit for frequently changing resources.

---

# 34. Security Architecture

Security layers:

```text
HTTPS
  ↓
Authentication
  ↓
Authorization
  ↓
Tenant Isolation
  ↓
Input Validation
  ↓
Rate Limiting
  ↓
Database Constraints
  ↓
Secure Logging
```

---

# 35. API Key Security

Project API keys are sensitive credentials.

Requirements:

* Generate cryptographically secure random keys.
* Store only a secure hash where practical.
* Display the secret only at creation.
* Support revocation.
* Never include full keys in logs.
* Never include full keys in analytics.

---

# 36. Database Security

The application should use:

* Parameterized queries
* ORM/query builder protections
* Least-privilege database credentials
* Encrypted database connections where supported
* Regular backups

Database credentials must never be committed to Git.

---

# 37. Deployment Architecture

For MVP, use a simple containerized deployment.

```text
                    Internet
                       |
                       ↓
                Reverse Proxy
                       |
              ┌────────┴────────┐
              ↓                 ↓
          Next.js            FastAPI
              |                 |
              |            ┌────┴────┐
              |            ↓         ↓
              |          Redis    PostgreSQL
              |            |
              |         Workers
              |            |
              └────────────┘
```

---

# 38. Recommended Cloud Architecture

A practical AWS deployment could be:

```text
AWS
│
├── CloudFront
│
├── Next.js
│
├── Application Load Balancer
│
├── FastAPI
│
├── Celery Workers
│
├── ElastiCache Redis
│
├── RDS PostgreSQL
│
└── S3
```

For an MVP, managed services are preferable to manually maintaining infrastructure.

---

# 39. Docker Architecture

AETHER should use separate containers:

```text
frontend
backend
worker
redis
postgres
```

Local development:

```text
Docker Compose
```

Production:

Managed database/Redis + containerized application services.

This gives a smooth transition from development to deployment.

---

# 40. CI/CD

Use GitHub Actions.

Pipeline:

```text
Git Push
   ↓
Lint
   ↓
Type Check
   ↓
Unit Tests
   ↓
Integration Tests
   ↓
Build
   ↓
Docker Image
   ↓
Deploy
```

Pull requests should run automated tests before merging.

---

# 41. Monitoring

AETHER itself must be monitored.

## Application Metrics

Track:

* Request rate
* Response latency
* HTTP errors
* Authentication failures
* Telemetry ingestion rate
* Queue depth
* Worker failures

## Infrastructure Metrics

Track:

* CPU
* Memory
* Database connections
* Database latency
* Redis memory
* Storage usage

---

# 42. Error Tracking

Use a dedicated error-tracking service such as Sentry.

Track:

* Backend exceptions
* Frontend errors
* Failed background jobs
* Critical API failures

Sensitive telemetry must be filtered before being sent to third-party monitoring systems.

---

# 43. Logging

Use structured JSON logs.

Example conceptual fields:

```text
timestamp
level
service
request_id
organization_id
project_id
trace_id
event
duration
status
```

Do not log:

* passwords
* API keys
* authentication tokens
* database credentials
* unnecessary prompt/response content

---

# 44. Request Correlation

Every API request should have a request ID.

```text
User Request
     ↓
Request ID
     ↓
FastAPI
     ↓
Worker
     ↓
Database
```

For telemetry, maintain:

* request ID
* ingestion ID
* trace ID

This makes debugging AETHER itself much easier.

---

# 45. Scalability Strategy

AETHER should scale vertically first, then horizontally.

## Stage 1 — MVP

```text
1 FastAPI service
1 Worker
1 PostgreSQL
1 Redis
1 Next.js application
```

This is sufficient for development and early users.

---

## Stage 2 — Growing Usage

Scale:

```text
FastAPI
  ↓
Multiple instances

Workers
  ↓
Multiple instances
```

PostgreSQL remains the primary database.

Redis remains the queue.

---

## Stage 3 — High Telemetry Volume

Only when necessary:

```text
Telemetry API
      ↓
Dedicated ingestion service
      ↓
Message broker
      ↓
Processing workers
      ↓
Specialized telemetry storage
```

A dedicated event streaming platform such as Kafka should only be introduced when actual throughput requires it.

---

# 46. Avoided Technologies for MVP

AETHER should intentionally avoid:

* Kubernetes
* Kafka
* Elasticsearch
* ClickHouse
* MongoDB
* Multiple microservices
* Dedicated vector database
* Complex service mesh
* Graph database

These technologies can be useful at larger scale, but introducing them now would increase:

* development time
* operational complexity
* debugging difficulty
* deployment complexity

without providing proportional MVP value.

---

# 47. Future Migration Path

The modular architecture should allow components to be extracted later.

Possible future evolution:

```text
MVP

FastAPI Modular Monolith
        |
        ↓
Growing System

FastAPI
 ├── Auth
 ├── Core
 ├── Ingestion
 ├── Evaluation
 └── Analytics
        |
        ↓
High Scale

API Gateway
   |
   ├── Auth Service
   ├── Ingestion Service
   ├── Trace Service
   ├── Evaluation Service
   └── Analytics Service
```

Extraction should happen only when a specific module has independent scaling or operational requirements.

---

# 48. AI Architecture

AETHER itself uses AI selectively.

AI should not be required for basic telemetry collection.

AI-powered functionality can be added on top of deterministic data.

Example:

```text
Telemetry
    ↓
Metrics
    ↓
Incident
    ↓
AI Analysis
    ↓
Possible Root Cause
    ↓
Recommended Action
```

This is preferable to putting an LLM into every part of the platform.

---

# 49. AI Root-Cause Analysis

A future AETHER AI service can receive:

* Related traces
* Error messages
* Recent deployment metadata
* Prompt versions
* Model information
* Latency changes

and produce:

```text
Possible Cause
Confidence
Evidence
Recommended Investigation
```

The AI output must remain clearly separated from deterministic system metrics.

---

# 50. System Scalability Boundary

The architecture should support the following progression:

```text
                MVP
                 |
                 ↓
        Modular Monolith
                 |
                 ↓
       Horizontal API Scaling
                 |
                 ↓
       Horizontal Worker Scaling
                 |
                 ↓
        Database Optimization
                 |
                 ↓
       Specialized Telemetry
                 |
                 ↓
      Event Streaming if needed
```

The system should never adopt a more complex architecture simply because it is technically fashionable.

---

# 51. Recommended MVP Infrastructure

### Development

```text
Windows / Linux / macOS
Docker Compose
Next.js
FastAPI
PostgreSQL
Redis
Celery
```

### Production

```text
Next.js
FastAPI
Celery Workers
AWS RDS PostgreSQL
AWS ElastiCache Redis
AWS S3
CloudFront
Load Balancer
GitHub Actions
Sentry
```

---

# 52. Environment Separation

Maintain:

```text
development
staging
production
```

Each environment must have separate:

* databases
* credentials
* API keys
* storage buckets
* configuration

Production credentials must never be reused locally.

---

# 53. Configuration Management

Application configuration should come from environment variables or secure configuration systems.

Examples:

```text
DATABASE_URL
REDIS_URL
JWT_SECRET
S3_BUCKET
S3_REGION
SENTRY_DSN
```

Never hardcode credentials.

A committed `.env.example` may document required variable names without containing real secrets.

---

# 54. Disaster Recovery

Minimum production strategy:

```text
PostgreSQL
    ↓
Automated backups

S3
    ↓
Versioning / lifecycle policies

Application
    ↓
Re-deployable Docker images
```

The platform should be reproducible from source code and infrastructure configuration.

---

# 55. Architecture Acceptance Criteria

The architecture is considered successfully implemented when:

* [ ] A user can authenticate securely.
* [ ] Organization-level isolation works.
* [ ] Role-based authorization is enforced server-side.
* [ ] Projects can generate and revoke telemetry API keys.
* [ ] The Python SDK can send telemetry.
* [ ] Telemetry can be accepted asynchronously.
* [ ] Workers can process telemetry.
* [ ] Traces and spans are persisted.
* [ ] Trace details can be retrieved.
* [ ] Token usage is recorded.
* [ ] Cost estimates are generated.
* [ ] Evaluation jobs can execute asynchronously.
* [ ] Experiment jobs can execute asynchronously.
* [ ] Incidents can reference traces.
* [ ] Analytics can be generated from stored data.
* [ ] Redis can handle background jobs and rate limiting.
* [ ] PostgreSQL remains the source of truth.
* [ ] Large payloads can be moved to object storage.
* [ ] Secrets are not committed or exposed.
* [ ] APIs are rate limited.
* [ ] Logs do not expose sensitive credentials.
* [ ] CI/CD automatically tests and builds the application.
* [ ] Application errors are observable.
* [ ] The system can scale API and worker instances independently.

---

# 56. Final Recommended Architecture

The recommended AETHER MVP architecture is:

```text
                         AETHER

                    ┌─────────────┐
                    │   USERS     │
                    └──────┬──────┘
                           │
                           ↓
                  ┌─────────────────┐
                  │ Next.js Frontend│
                  │ TypeScript      │
                  └────────┬────────┘
                           │ HTTPS
                           ↓
                  ┌─────────────────┐
                  │ FastAPI Backend │
                  │ Modular Monolith│
                  └───────┬─┬───────┘
                          │ │
              ┌───────────┘ └────────────┐
              ↓                          ↓
       ┌─────────────┐            ┌─────────────┐
       │ PostgreSQL  │            │    Redis    │
       │ Source Truth│            │ Queue/Cache │
       └─────────────┘            └──────┬──────┘
                                         │
                                         ↓
                                ┌─────────────────┐
                                │ Celery Workers  │
                                └────────┬────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ↓                    ↓                    ↓
              Telemetry              Evaluation          Analytics
              Processing             Processing           Processing
                    │                    │                    │
                    └────────────────────┼────────────────────┘
                                         ↓
                                   PostgreSQL
                                         │
                                         ↓
                                    S3 Storage


AI APPLICATIONS
       │
       ↓
 AETHER PYTHON SDK
       │
       ↓
 POST /api/v1/ingest
       │
       ↓
 FastAPI → Redis → Worker → PostgreSQL
```

## Architecture Decision

**Build AETHER as a modular monolith with asynchronous processing.**

Use:

**Next.js + TypeScript** for the product experience.

**FastAPI + Python** for the API and AI engineering backend.

**PostgreSQL** as the source of truth.

**Redis + Celery** for asynchronous workloads and caching.

**S3** for large objects.

**Docker + GitHub Actions** for deployment and CI/CD.

**AWS managed services** for production infrastructure.

This architecture is sufficiently sophisticated to demonstrate real AI engineering and SaaS system-design skills, while remaining small enough for you to actually build, debug, deploy, and explain in an interview.

The key architectural principle is:

> **Start simple enough to build. Structure it well enough to scale.**
