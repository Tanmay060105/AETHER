# AETHER — Complete UI/UX Document

**Product:** AETHER
**Type:** AI Engineering Intelligence Platform
**Design Reference:** The uploaded AETHER reference video is the single visual source of truth for this document. 
**Design Goal:** Preserve the original visual language while translating it into a functional AI engineering product.

---

# 1. Design Direction

AETHER should **not become a conventional SaaS dashboard**.

The uploaded reference establishes the core visual language:

* deep black / near-black canvas
* extremely clean composition
* small, restrained navigation
* oversized editorial typography
* large areas of negative space
* floating visual objects
* layered depth
* photography/content presented almost like physical objects
* subtle 3D movement
* horizontal/vertical spatial transitions
* tiny metadata labels
* minimal controls
* cinematic loading
* strong contrast between typography and imagery
* content entering and leaving the viewport rather than everything being visible at once

The AETHER application should translate this language into an **AI engineering workspace**, rather than replacing it with cards, dashboards, sidebars, and colorful SaaS components.

---

# 2. Core Design Concept

The entire product should feel like entering an intelligent system.

```text
                AETHER

             OBSERVE
                ↓
              TRACE
                ↓
             EVALUATE
                ↓
             DIAGNOSE
                ↓
             OPTIMIZE
                ↓
              IMPROVE
```

The reference design's spatial/immersive presentation becomes AETHER's way of navigating the complexity of AI systems.

---

# 3. Design Principles

## 3.1 Minimal Surface

Every visible element must have a purpose.

Avoid:

* unnecessary cards
* excessive borders
* excessive buttons
* decorative gradients
* dashboard clutter
* unnecessary badges

---

## 3.2 Content Is the Interface

The reference design gives visual content significant space.

AETHER should do the same with:

* system health
* traces
* evaluation results
* incidents
* performance signals

The data itself becomes the visual experience.

---

## 3.3 Spatial Navigation

Instead of thinking:

```text
Dashboard → page → page → page
```

AETHER should feel like:

```text
SYSTEM
   ↓
SIGNAL
   ↓
TRACE
   ↓
SPAN
   ↓
EVENT
```

The deeper the user goes, the more detailed the interface becomes.

---

## 3.4 Typography Creates Hierarchy

Do not rely heavily on cards to establish hierarchy.

Use:

* size
* position
* spacing
* weight
* opacity
* alignment

---

## 3.5 Motion Is Structural

Animation should communicate navigation.

For example:

```text
Overview
   ↓
Zoom into trace
   ↓
Zoom into span
   ↓
Inspect event
```

The user should feel that they are moving deeper into the system.

---

# 4. Visual System

## 4.1 Primary Background

AETHER uses an almost-black canvas.

```text
Primary Background
#080808
```

Secondary surfaces should be barely distinguishable:

```text
Surface
#101010

Surface 2
#151515
```

Do not use obvious gray dashboard panels.

---

# 4.2 Text

```text
Primary
#F5F5F5

Secondary
#A0A0A0

Tertiary
#686868
```

---

# 4.3 System Colors

Color should be used sparingly.

```text
Success
#8FE3A2

Warning
#E6C76A

Error
#E97979

Information
#91A8D8
```

The default AETHER interface remains monochrome.

---

# 5. Typography

The reference relies heavily on typography.

Recommended:

### Primary

**Inter / Geist**

### Technical

**Geist Mono / IBM Plex Mono**

---

## Typography hierarchy

### Hero

```text
clamp(64px, 10vw, 160px)
```

### Section title

```text
48–80px
```

### Page title

```text
40–64px
```

### Metric

```text
64–120px
```

### Body

```text
14–18px
```

### Metadata

```text
10–12px
```

Metadata should feel deliberately small.

---

# 6. Layout Grid

Desktop:

```text
12-column grid
```

Outer margin:

```text
32–64px
```

Maximum content width:

```text
1600–1800px
```

But important screens should not always use the entire grid.

Large empty areas are intentional.

---

# 7. Navigation

The reference uses extremely restrained navigation.

AETHER should follow this.

## Global Header

```text
AETHER                                    Index
```

On the left:

```text
AETHER
```

On the right:

```text
Index
```

No giant permanent sidebar.

---

# 8. Index Navigation

Clicking **Index** opens the navigation layer.

```text
AETHER

01  OBSERVE
02  TRACE
03  EVALUATE
04  EXPERIMENT
05  OPTIMIZE
06  INCIDENTS
07  ANALYTICS

────────────────

PROJECT
Customer Support AI

ENVIRONMENT
Production

────────────────

SETTINGS
```

The index should appear as an overlay rather than permanently consuming screen space.

---

# 9. Project Context

The current project should remain visible in small metadata.

Example:

```text
CUSTOMER SUPPORT AI
PRODUCTION
```

This prevents users from losing context while navigating.

---

# 10. Landing Page

The landing page should follow the reference's cinematic character.

## Screen 01 — Opening

Black screen.

Small centered text:

```text
AETHER
```

Then:

```text
AI ENGINEERING
INTELLIGENCE
```

The typography should appear gradually.

---

# 11. Hero

Large editorial composition:

```text
AETHER

UNDERSTAND
YOUR AI
SYSTEM.
```

Small supporting text:

```text
Observe. Evaluate. Diagnose.
Optimize production AI systems.
```

Minimal CTA:

```text
ENTER AETHER →
```

No conventional hero card.

---

# 12. Loading Experience

The reference's loading behavior is important.

AETHER can use:

```text
0%
```

followed by:

```text
Loading
```

and gradually transition to:

```text
AETHER
```

This becomes part of the product identity.

---

# 13. Product Introduction

Instead of a conventional feature grid:

```text
OBSERVE
TRACE
EVALUATE
OPTIMIZE
```

appear sequentially.

Each occupies a significant portion of the viewport.

---

# 14. Product Loop

The central interaction:

```text
OBSERVE
```

then:

```text
TRACE
```

then:

```text
EVALUATE
```

then:

```text
DIAGNOSE
```

then:

```text
OPTIMIZE
```

then:

```text
IMPROVE
```

Scrolling causes the current concept to transition into the next.

---

# 15. Application Entry

After authentication, AETHER should not immediately display a traditional dashboard.

Instead:

```text
AETHER

CUSTOMER SUPPORT AI

SYSTEM STATUS

94
```

Then the workspace gradually reveals itself.

---

# 16. Observe

## Purpose

The Observe screen answers:

> "What is happening inside my AI system?"

---

## Visual composition

Large number:

```text
94
```

Small label:

```text
SYSTEM HEALTH
```

Then smaller information around it:

```text
REQUESTS
128,492

LATENCY
428ms

ERROR RATE
1.2%

COST
$184.20
```

These should not necessarily be four cards.

They can occupy independent positions within the composition.

---

# 17. Observe Layout

Conceptually:

```text
┌───────────────────────────────────────────────┐

 AETHER                                      INDEX


                SYSTEM HEALTH

                     94

                 PRODUCTION


 REQUESTS                 LATENCY
 128,492                  428ms


       ERROR RATE              COST
       1.2%                   $184


───────────────────────────────────────────────

             ACTIVITY / SIGNAL

└───────────────────────────────────────────────┘
```

Large whitespace is intentional.

---

# 18. Observe Interactions

### Hover

Hovering a metric subtly increases its visual prominence.

### Click

Clicking a metric transitions into detailed analytics.

### Scroll

Scrolling moves deeper into the system.

---

# 19. Activity Visualization

Instead of a conventional chart card, use a large floating visualization.

Example:

```text
REQUEST ACTIVITY

       ╱╲
   ╱╲ ╱  ╲
──╱──╯    ╰────
```

The graph should occupy the composition rather than sit inside a small card.

---

# 20. Trace

Trace is the most important functional screen.

The user selects:

```text
TRACE
```

and enters a spatial trace environment.

---

# 21. Trace Overview

```text
TRACE

12:42:31
CUSTOMER REQUEST

842ms
SUCCESS

────────────────────────────────
```

Other traces appear vertically or spatially.

```text
12:42:31  Customer request
12:41:58  Refund request
12:41:22  Order status
12:40:51  Product search
```

---

# 22. Trace Visualization

When a trace opens, transition into a large timeline.

```text
REQUEST

    │
    │
    ├──────── RETRIEVAL
    │
    ├──────────────── LLM
    │
    ├──────────────────── TOOL
    │
    └──────────────────────── RESPONSE
```

Each node can appear as a floating point/object.

This keeps the spatial language of the reference design.

---

# 23. Trace Details

Selecting the LLM span expands it.

```text
LLM CALL

MODEL
GPT-4.1

DURATION
623ms

TOKENS
1,766

COST
$0.0214
```

Then:

```text
INPUT

...

OUTPUT

...
```

The details should slide/fade into place rather than appear as a generic modal.

---

# 24. Trace Depth

AETHER should have a clear information-depth model.

```text
LEVEL 01
SYSTEM

      ↓

LEVEL 02
TRACE

      ↓

LEVEL 03
SPAN

      ↓

LEVEL 04
EVENT

      ↓

LEVEL 05
RAW DATA
```

Every transition should preserve the user's location.

---

# 25. Evaluate

Evaluation should retain the same editorial approach.

Large title:

```text
EVALUATE
```

Then:

```text
QUALITY

91.4
```

Secondary information:

```text
CORRECTNESS
92.1

RELEVANCE
89.4

PASS RATE
94.2
```

---

# 26. Dataset Interface

The dataset should be presented as a clean index.

```text
CUSTOMER SUPPORT

1,240 CASES

001
Refund request

002
Order cancellation

003
Shipping question

004
Product information
```

Avoid a giant conventional spreadsheet unless the user explicitly enters data-management mode.

---

# 27. Evaluation Run

When the user starts an evaluation:

```text
RUNNING EVALUATION

██████████████────

842 / 1240
```

Minimal interface.

No unnecessary modal.

---

# 28. Evaluation Result

After completion:

```text
EVALUATION COMPLETE

91.4

QUALITY SCORE
```

Then the result composition appears.

```text
CORRECTNESS       92.1
RELEVANCE         89.4
CONSISTENCY       91.7
SAFETY            96.2
```

---

# 29. Failure Clusters

Instead of cards:

```text
FAILURE CLUSTERS

01
Incorrect refund policy
14 cases

02
Missing context
8 cases

03
Hallucinated information
6 cases
```

Clicking one takes the user into the affected traces/cases.

---

# 30. Experiments

Experiments use a visual comparison.

```text
EXPERIMENT

VERSION A                         VERSION B

GPT-4.1                           GPT-4.1
Prompt 12                         Prompt 13

87.4                              91.2
QUALITY                           QUALITY
```

Then:

```text
LATENCY
621ms                             588ms

COST
$0.021                            $0.019
```

---

# 31. Optimize

The Optimize screen should feel like an editorial list of opportunities.

```text
OPTIMIZE

01
TOKEN USAGE

Potential reduction
18%

────────────────────

02
RETRIEVAL LATENCY

Potential improvement
24%

────────────────────

03
PROMPT QUALITY

Potential improvement
7.4%
```

Each recommendation contains evidence when opened.

---

# 32. Incidents

Incidents use strong typography rather than warning-card overload.

```text
INCIDENT

LATENCY SPIKE

CRITICAL

+287%

FROM BASELINE
```

Then:

```text
STARTED
14:32

AFFECTED TRACES
284

LIKELY SOURCE
Retrieval
```

---

# 33. Incident Investigation

The user can follow:

```text
Incident
   ↓
Affected traces
   ↓
Common span
   ↓
Latency source
   ↓
Possible cause
```

This is one of AETHER's most important UX flows.

---

# 34. Analytics

Analytics should retain the editorial aesthetic.

Large statement:

```text
THE SYSTEM
THIS WEEK
```

Then:

```text
REQUESTS
+18.4%

LATENCY
+7.1%

COST
−4.2%

QUALITY
+3.8%
```

Detailed visualizations appear below.

---

# 35. AI Health

This should be a signature AETHER screen.

```text
AI HEALTH

94

EXCELLENT
```

Then the system explains:

```text
RELIABILITY       97
QUALITY           94
COST              91
LATENCY           88
```

The score must be explainable.

Example:

```text
WHY 94?

Quality improved 4.2%
Latency increased 2.1%
Cost decreased 6.4%
```

---

# 36. Projects

Projects should use an index rather than card grids.

```text
PROJECTS

01  CUSTOMER SUPPORT AI
    PRODUCTION
    HEALTH 94

02  DOCUMENT ANALYZER
    PRODUCTION
    HEALTH 88

03  INTERNAL COPILOT
    DEVELOPMENT
    HEALTH 97
```

---

# 37. Settings

Settings remain functional and visually quiet.

```text
SETTINGS

ACCOUNT
ORGANIZATION
PROJECT
API KEYS
SECURITY
INTEGRATIONS
```

Selecting one reveals its configuration without leaving the overall spatial system.

---

# 38. Forms

Forms should be extremely minimal.

Example:

```text
CREATE PROJECT

PROJECT NAME

Customer Support AI

ENVIRONMENT

Production


                CREATE →
```

Labels are small.

Inputs are understated.

Avoid large rounded form containers.

---

# 39. API Key Creation

```text
GENERATE API KEY

NAME

Production SDK

PROJECT

Customer Support AI


GENERATE →
```

After creation:

```text
API KEY CREATED

aeth_prod_••••••••••••••

This key will only be shown once.

COPY →
```

---

# 40. Search

The search interaction should resemble the reference's index philosophy.

Shortcut:

```text
/
```

or:

```text
⌘K / Ctrl+K
```

Search layer:

```text
SEARCH AETHER

traces

────────────────

TRACE
refund-request

TRACE
refund-request

PROJECT
Refund Assistant
```

---

# 41. Empty States

Empty states should maintain the cinematic minimalism.

### New project

```text
WAITING FOR SIGNAL

No telemetry has reached
this project yet.

CONNECT YOUR SYSTEM →
```

### No incidents

```text
SYSTEM CLEAR

No active incidents.
```

### No evaluations

```text
NO EVALUATIONS

Create your first dataset.
```

---

# 42. Loading States

Loading should be part of the brand.

Instead of generic skeletons:

```text
LOADING
```

or:

```text
0%
```

then:

```text
34%
```

then:

```text
78%
```

then:

```text
AETHER
```

For data-heavy areas, content can progressively reveal itself.

---

# 43. Error States

Errors should remain visually restrained.

```text
UNABLE TO LOAD TRACE

The trace could not be retrieved.

REQUEST
8f4c2a91

RETRY →
```

Do not cover the entire screen with red.

---

# 44. Success States

Use typography and subtle motion.

```text
EVALUATION COMPLETE

91.4

VIEW RESULTS →
```

---

# 45. Interaction Language

AETHER should prefer:

```text
VIEW →
OPEN →
ENTER →
EXPLORE →
INSPECT →
COMPARE →
RUN →
```

rather than generic:

```text
Submit
Cancel
OK
Click here
```

This keeps the product's editorial identity.

---

# 46. Motion Design

The reference's biggest influence should be its spatial motion.

### Page transition

```text
Current content
     ↓
moves/fades
     ↓
new content enters
```

### Detail transition

```text
Trace
 ↓
selected span expands
 ↓
span details become primary
```

### Navigation

```text
Index
 ↓
items reveal sequentially
```

---

# 47. 3D / Depth

The reference contains strong dimensional compositions.

AETHER can use restrained depth for:

* trace nodes
* system architecture
* evaluation visualizations
* model relationships
* incident relationships

But:

**Do not turn AETHER into a 3D game.**

Depth should communicate hierarchy.

---

# 48. Responsive Design

## Desktop

Primary experience.

```text
≥ 1280px
```

Use:

* large typography
* spatial layouts
* multiple information layers
* floating visualizations
* large whitespace

---

## Tablet

```text
768–1279px
```

Reduce spatial complexity.

Maintain:

* typography
* hierarchy
* navigation
* trace functionality

---

## Mobile

```text
<768px
```

The visual identity remains, but compositions become vertical.

Example:

```text
AETHER

SYSTEM HEALTH

94

REQUESTS
128,492

LATENCY
428ms

ERROR RATE
1.2%
```

---

# 49. Mobile Navigation

Header:

```text
AETHER                         MENU
```

Menu opens the index:

```text
01 OBSERVE
02 TRACE
03 EVALUATE
04 EXPERIMENTS
05 OPTIMIZE
06 INCIDENTS
07 ANALYTICS
```

---

# 50. Accessibility

The visual minimalism must not compromise accessibility.

Requirements:

* semantic HTML
* keyboard navigation
* visible focus states
* sufficient contrast
* accessible labels
* screen-reader descriptions
* keyboard-accessible trace navigation
* reduced-motion mode
* no information communicated only through color

---

# 51. Reduced Motion

If reduced motion is enabled:

```text
Cinematic transitions
       ↓
short fades
```

rather than removing content.

All functionality remains identical.

---

# 52. Keyboard System

```text
⌘K / Ctrl+K
Command/Search

/
Search

G O
Observe

G T
Trace

G E
Evaluate

G X
Experiments

G I
Incidents

G A
Analytics
```

Keyboard navigation is especially appropriate for an engineering-focused product.

---

# 53. Component System

AETHER components should be intentionally small.

```text
AetherHeader
IndexMenu
ProjectContext
PageTitle
SectionLabel
Metric
MetricGroup
Signal
Timeline
TraceNode
SpanNode
TraceDetail
EvaluationScore
ExperimentComparison
Incident
HealthScore
CommandPalette
ProgressIndicator
```

---

# 54. Component Styling Rule

Components should not automatically become cards.

For example:

### Bad

```text
┌─────────────────────┐
│ SYSTEM HEALTH       │
│                     │
│ 94                  │
└─────────────────────┘
```

### AETHER

```text
SYSTEM HEALTH

94

EXCELLENT
```

The second approach preserves the original design language.

---

# 55. Screen Transition Model

The entire product should feel like one continuous environment.

```text
OBSERVE
   │
   │ select signal
   ↓
INCIDENT
   │
   │ inspect
   ↓
TRACE
   │
   │ select span
   ↓
SPAN
   │
   │ inspect
   ↓
ROOT CAUSE
   │
   ↓
OPTIMIZE
```

The user should not feel like they are jumping between unrelated web pages.

---

# 56. Core User Journey

```text
LANDING
   ↓
ENTER AETHER
   ↓
CREATE ACCOUNT
   ↓
CREATE PROJECT
   ↓
CONNECT AI SYSTEM
   ↓
RECEIVE FIRST SIGNAL
   ↓
OBSERVE
   ↓
TRACE
   ↓
EVALUATE
   ↓
DIAGNOSE
   ↓
OPTIMIZE
   ↓
MONITOR
```

---

# 57. Debugging Journey

```text
OBSERVE
     ↓
Health decreases
     ↓
Signal appears
     ↓
Open incident
     ↓
Affected traces
     ↓
Trace timeline
     ↓
Problem span
     ↓
Raw event
     ↓
Root cause
     ↓
Optimization
```

This is the most important practical workflow.

---

# 58. Evaluation Journey

```text
EVALUATE
     ↓
Create dataset
     ↓
Add test cases
     ↓
Run evaluation
     ↓
Results
     ↓
Failure clusters
     ↓
Inspect failed traces
     ↓
Create experiment
     ↓
Compare
     ↓
Improve
```

---

# 59. Experiment Journey

```text
EXPERIMENT
     ↓
Select configuration A
     ↓
Select configuration B
     ↓
Run
     ↓
Evaluate
     ↓
Compare quality
     ↓
Compare latency
     ↓
Compare cost
     ↓
Select winner
```

---

# 60. UI State Architecture

Every major screen should support:

```text
INITIAL
LOADING
SUCCESS
EMPTY
ERROR
PARTIAL
UPDATING
```

Example:

```text
Trace
 ├── Loading
 ├── Loaded
 ├── Empty
 ├── Error
 └── Updating
```

---

# 61. Performance UX

AETHER should feel extremely fast.

### Important rules

* Load the shell immediately.
* Load data progressively.
* Avoid blocking the entire screen.
* Use optimistic UI where safe.
* Cache frequently viewed data.
* Virtualize large trace lists.
* Lazy-load heavy visualizations.
* Do not render thousands of spans simultaneously.

---

# 62. Data Density

AETHER is an engineering tool.

Therefore:

### Landing

Low density.

```text
        AETHER

   huge whitespace
```

### Workspace

Medium/high density.

```text
TRACE
MODEL
TOKENS
LATENCY
COST
EVENTS
```

This distinction is intentional.

---

# 63. Design Tokens

Core implementation tokens:

```text
Background
#080808

Surface
#101010

Primary Text
#F5F5F5

Secondary Text
#A0A0A0

Muted Text
#686868

Border
#242424

Success
#8FE3A2

Warning
#E6C76A

Error
#E97979
```

Spacing:

```text
4
8
12
16
24
32
48
64
96
128
160
```

---

# 64. Border and Surface Rules

Borders should be extremely subtle.

```text
1px solid rgba(255,255,255,0.08)
```

Avoid:

```text
1px bright gray borders everywhere
```

The interface should derive structure from spacing and typography first.

---

# 65. Shadows

Use very little shadow.

Depth should primarily come from:

* position
* opacity
* scale
* motion
* overlapping layers

rather than conventional SaaS shadows.

---

# 66. Implementation Architecture for UI

Recommended structure:

```text
app/
├── landing/
├── auth/
├── onboarding/
└── workspace/
    ├── observe/
    ├── trace/
    ├── evaluate/
    ├── experiments/
    ├── optimize/
    ├── incidents/
    ├── analytics/
    ├── health/
    └── settings/

components/
├── aether/
│   ├── header/
│   ├── navigation/
│   ├── typography/
│   ├── motion/
│   ├── metrics/
│   ├── traces/
│   ├── evaluation/
│   └── visualization/
```

---

# 67. Animation Architecture

Use a consistent motion system rather than independent animations.

Recommended:

* CSS transitions for simple states
* Framer Motion for UI transitions
* GSAP only if the reference's more complex spatial animation requires it

Do not introduce a large animation library unnecessarily.

---

# 68. Final Screen Map

```text
AETHER
│
├── LANDING
│
├── AUTH
│   ├── Sign In
│   └── Sign Up
│
├── ONBOARDING
│   ├── Organization
│   ├── Project
│   ├── API Key
│   └── First Signal
│
└── WORKSPACE
    │
    ├── OBSERVE
    │
    ├── TRACE
    │   ├── Trace List
    │   └── Trace Detail
    │
    ├── EVALUATE
    │   ├── Datasets
    │   ├── Dataset Detail
    │   ├── Evaluation Run
    │   └── Results
    │
    ├── EXPERIMENTS
    │   ├── Experiments
    │   └── Comparison
    │
    ├── OPTIMIZE
    │
    ├── INCIDENTS
    │   ├── Incident List
    │   └── Incident Detail
    │
    ├── ANALYTICS
    │
    ├── AI HEALTH
    │
    └── SETTINGS
```

---

# 69. MVP UI Scope

To keep the project buildable, the first version should prioritize:

### Tier 1 — Essential

1. Landing
2. Authentication
3. Onboarding
4. Project setup
5. Observe
6. Trace list
7. Trace detail
8. Evaluation
9. Evaluation results
10. Incidents
11. AI Health

### Tier 2 — Strong differentiators

12. Experiments
13. Optimize
14. Analytics
15. Command palette
16. Advanced trace exploration

### Tier 3 — Later

17. Integrations
18. Advanced team management
19. Advanced AI root-cause analysis
20. Advanced enterprise controls

---

# 70. The Most Important Design Rule

The uploaded reference should determine **how AETHER feels**, while the AETHER product requirements determine **what AETHER does**.

So the relationship is:

```text
YOUR DESIGN REFERENCE
          ↓
Visual language
Motion
Composition
Typography
Navigation style
Spatial behavior
          ↓
       AETHER
          ↓
AI Engineering functionality
Telemetry
Traces
Evaluations
Incidents
Optimization
Analytics
```

We should **not** take AETHER's functionality and force it into a standard SaaS dashboard.

Instead, we take the **visual grammar of your reference** and build the AETHER engineering experience inside that grammar.

That means the final AETHER should feel like **the same design system as your reference, but transformed into an AI engineering product**.
