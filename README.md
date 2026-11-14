# SkillMorph AI — Autonomous Multi-Agent Career Autopilot & Skill-DAG Engine

🚀 **Live Production Application**: [https://skillmorph-ai.vercel.app](https://skillmorph-ai.vercel.app)

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq LPUs](https://img.shields.io/badge/Groq-gpt--oss--120b-F55036?logo=fastapi&logoColor=white)](https://groq.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Zero--Error-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **SkillMorph AI** is an autonomous multi-agent career copilot and dynamic Skill-DAG engine that eliminates "tutorial hell" for engineering graduates and career switchers through **Polyglot Brain Diffs**, **Waze-style adaptive roadmaps**, and **verifiable proof-of-skill passports**.

---

## 🎯 The Core Problem: Why Conventional EdTech Fails

1. **The Blank-Slate Fallacy ("Tutorial Hell")**: When a Python/SQL developer wants to learn Full Stack development, traditional platforms force them to re-learn loops, variables, and if-statements from zero. SkillMorph AI utilizes **Polyglot Brain Diffs** to transfer their existing mental models (e.g. `asyncio.gather` → `Promise.all()`, Flask decorators → Express middleware), accelerating learning 3x.
2. **Static, Brittle Roadmaps**: Existing roadmaps (like roadmap.sh) are static PDFs or bullet lists. When a student fails a concept, they hit a dead end and drop out. SkillMorph AI acts like **Waze for career trajectories**—rerouting in real time with high-visibility Amber Rescue Nodes.
3. **The University & Recruiter Trust Gap**: Placement officers and engineering managers cannot inspect candidate code veracity. SkillMorph AI provides **Macro Cohort Skill Intelligence** and cryptographically signed **Verified Skill Passports** backed by AST hashes and agent verification stamps.

---

## 🤖 The 4-Agent Autonomous Mesh Architecture

SkillMorph AI is driven by a collaborative 4-agent peer-to-peer mesh with timestamped state streaming:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        4-AGENT AUTONOMOUS MESH                         │
│                                                                        │
│   [Profiler-01]  ───────►  [GapArchitect-02]  ──────► [PolyglotCurator-03]
│  (Skill & GitHub)         (DAG Topology Engine)      (Brain-Diff Synthesizer)
│         ▲                                                    │         │
│         │                                                    ▼         │
│         └──────────────── [AdaptiveMentor-04] ◄──────────────┘         │
│                        (Assessment & Rerouter)                         │
└────────────────────────────────────────────────────────────────────────┘
```

1. **`Profiler-01` (Skill & GitHub Auditor)**:
   - Scans public GitHub repositories via REST API, parses language heuristics, extracts commit AST profiles, and injects verified skills into the candidate's skill vector.
2. **`GapArchitect-02` (Career Delta & Transfer-Learning Mapper)**:
   - Evaluates the vector distance between current verified competencies and target benchmarks across 5 radar dimensions.
   - Powered by **Groq `openai/gpt-oss-120b`** (with `qwen/qwen3.6-27b` fallback) for real-time DAG graph compilation.
3. **`PolyglotCurator-03` (Brain-Diff & Resource Synthesizer)**:
   - Generates side-by-side comparative syntax and mental models between languages (Python/SQL/C++ vs JS/React/Go/Rust).
   - Bundles bite-sized resources and produces concrete 15-minute portfolio artifact micro-specs.
4. **`AdaptiveMentor-04` (Assessment Evaluator & Dynamic Rerouter)**:
   - Evaluates interactive Boss Fight assessments and **1-Line Live Code Patches** with automated unit-test harnesses.
   - Slices dynamic Amber Rescue Nodes (*"🚑 Rescue Sprint"*) directly into the visual roadmap upon failure.

---

## ⚡ 1-Click Judge Chaos Sandbox

The top bar features instant chaos injection controls for live jury evaluations:
- **Sample Scenario**: Instantly restores Aarav Sharma's baseline (*Python + SQL + HTML → Full Stack Developer*).
- **Simulate Failure**: Intentionally fails an async assessment, triggering `AdaptiveMentor-04` to dynamically inject a high-visibility Amber Remedial Bridge Node into the DAG.
- **Pivot Career**: 1-click pivot between:
  - *Full Stack Developer*
  - *AI/ML Systems Engineer*
  - *Cloud Backend Architect*
- **✨ Custom AI Career Synthesis**: Type **any** current skills + **any** target role (e.g. *Quantum Computing Engineer*, *Web3 Smart Contract Auditor*) and watch the 4 agents dynamically generate new DAG nodes, radar metrics, and telemetry logs!
- **Groq LPU Modal**: Pre-loaded with low-latency Groq key supporting `openai/gpt-oss-120b`.

---

## 🛡️ Proof-of-Skill: Verified Skill Passport

Candidates can export a cryptographically-styled **Proof-of-Skill Readiness Dossier**:
- SHA-256 AST Hash of candidate code artifacts
- ECDSA-style agent signature stamps (`Profiler-01`, `AdaptiveMentor-04`)
- W3C Verifiable Credential standard compliance
- 1-Click JSON export ready for recruiter ATS or university placement cells.

---

## 💻 Tech Stack & Zero-Dependency Charting

- **Framework**: React 19 + TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (Silicon Valley dark-mode cockpit aesthetic: slate-950, glassmorphism, neon cyan/emerald/amber accents)
- **Visualizations**: 100% custom, zero-dependency SVG implementations:
  - Custom SVG Interactive Skill DAG Roadmap
  - Custom SVG Polygon Radar Chart (Current Vector vs Target Benchmark)
- **AI Backend**: Groq Cloud API (`openai/gpt-oss-120b` & `qwen/qwen3.6-27b`) + Instant Deterministic Simulation Engine fallback.
- **Micro-Animations & Delights**: Canvas Confetti, CSS glow pulses, and easing readiness meters.

---

## 📦 Local Setup & Production Build

```bash
# Clone the repository
git clone https://github.com/your-username/skillmorph-ai.git
cd skillmorph-ai

# Install dependencies
pnpm install # or npm install

# Run development server
pnpm run dev

# Verify zero-error production build
pnpm run build

# Run linter
pnpm run lint
```

---

## 🚢 Deployment

Configured for **Vercel** with single-page application rewrites via `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
