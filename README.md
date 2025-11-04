# PhishNet-Agent

A2A (Agent-to-Agent) JSON-RPC integration for automated phishing detection and cyber-safety tips

Node.js · TypeScript · ISC

## Overview

PhishNet-Agent is a focused Mastra-based agent that inspects URLs and short message text for phishing indicators, returns a concise verdict, and (optionally) posts periodic cyber-safety tips. It exposes a JSON-RPC 2.0 A2A endpoint so other systems (or other Mastra agents) can call it programmatically.

This README has been trimmed to focus solely on the phishing functionality. Weather/scorer examples previously present in the repository are not relevant to running the PhishNet agent and have been removed from the documentation.

## What this project contains (phishing-focused)

- Agent: `src/mastra/agents/phishnet-agent.ts` — the PhishNet conversational agent (registered as `phishnet`).
- Tool: `src/mastra/tools/phishcheck-tool.ts` — URL inspection + PhishTank lookup fallback (tool id: `check-phishing`).
- Route: `src/mastra/routes/a2a-agent-route.ts` — JSON-RPC 2.0 A2A endpoint wiring (POST /a2a/agent/:agentId).
- Cron: `src/mastra/cron/daily-tips.ts` — optional daily tip scheduler (disabled/send commented by default).
- Storage/types: `src/mastra/utils/definitions.ts` — shared types (e.g., `PhishResult`).

## Key features

- Heuristic and optional PhishTank lookup for URL analysis
- Short, actionable verdicts (safe / suspicious / unknown) with reasons
- JSON-RPC 2.0 A2A endpoint for programmatic calls
- Optional daily tips scheduler that can post to a webhook
- Memory store (LibSQL) available if enabled in `src/mastra/index.ts`

## Quick facts (accurate references)

- Registered agentId (URL segment): `phishnet` — see `src/mastra/index.ts` (agents: { phishnet: phishNetAgent }).
- Agent variable name: `phishNetAgent` exported from `src/mastra/agents/phishnet-agent.ts`.
- Tool id: `check-phishing` (declared in `src/mastra/tools/phishcheck-tool.ts`).
- A2A route: `POST /a2a/agent/:agentId` implemented in `src/mastra/routes/a2a-agent-route.ts`.

## Prerequisites

- Node.js >= 20.9.0
- pnpm (recommended) or npm

## Installation

Clone and install dependencies:

```powershell
git clone https://github.com/yasmincreates/phishnet-agent.git
cd phishnet-agent
pnpm install
# or
npm install
```

## Configuration

Copy `.env.example` to `.env` and set the variables you need. Useful variables:

- `PHISHCHECK_API_KEY` — optional external lookup key (if you switch to a paid lookup service)
- `TELEX_WEBHOOK` — optional webhook URL for daily tips
- `PORT` — server port (default 4111)
- `DATABASE_URL` — LibSQL connection string (default `:memory:`)
- `GOOGLE_GENERATIVE_AI_API_KEY` — optional LLM key

Note: `startDailyTips()` is invoked in `src/mastra/index.ts`, but the send call in `daily-tips.ts` is not active by default; enable it if you want automatic posting.

## Usage

Start the development server:

```powershell
pnpm run dev
# or
npm run dev
```

Production build and start:

```powershell
pnpm run build
pnpm run start
```

The Mastra server listens on the `PORT` configured in `.env` (default 4111).

## Calling the agent (A2A examples)

Endpoint: `POST /a2a/agent/:agentId`

Replace `:agentId` with the registered agent id `phishnet`.

Message/send (full A2A style):

```bash
curl -X POST http://localhost:4111/a2a/agent/phishnet \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "req-001",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "role": "user",
        "parts": [ { "kind": "text", "text": "Check this link: http://example.com/login" } ],
        "messageId": "m-001",
        "taskId": "t-001"
      },
      "configuration": { "blocking": true }
    }
  }'
```

Simplified execute style (quick):

```bash
curl -X POST http://localhost:4111/a2a/agent/phishnet \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "req-002",
    "method": "execute",
    "params": {
      "messages": [ { "role": "user", "parts": [ { "kind": "text", "text": "Is http://example.com/login a phishing link?" } ] } ]
    }
  }'
```

Example result (abbreviated):

```json
{
  "jsonrpc": "2.0",
  "id": "req-002",
  "result": {
    "id": "t-001",
    "contextId": "ctx-uuid",
    "status": { "state": "completed", "timestamp": "..." },
    "artifacts": [
      {
        "artifactId": "a-1",
        "name": "phishAnalysis",
        "parts": [
          {
            "kind": "text",
            "text": "⚠️ Suspicious — domain mismatch and login form detected. Recommended: block and report."
          }
        ]
      }
    ],
    "history": [],
    "kind": "task"
  }
}
```

## Testing helpers

- `test-a2a-request.json` — example execute payload at repo root.
- `scripts/test-a2a.ps1` — PowerShell helper that posts the example payload to `http://localhost:4111/a2a/agent/phishnet` and prints the response.

Run the PowerShell helper from repo root:

```powershell
.\scripts\test-a2a.ps1
```

Or use curl with the example file:

```powershell
curl -X POST http://localhost:4111/a2a/agent/phishnet -H "Content-Type: application/json" -d @test-a2a-request.json
```

## Troubleshooting (accurate tips)

- Agent not found: ensure `phishnet` is registered in `src/mastra/index.ts` (it is in this repo).
- No external lookup: check network and `PHISHCHECK_API_KEY` if using a paid service.
- Daily tips not posting: enable `TELEX_WEBHOOK` and remove/comment toggle in `daily-tips.ts` where the actual send is currently disabled.
- Port in use: change `PORT` in `.env` or stop the process using the port.

## Notes & next steps you might want

- If you want to remove non-phishing example files (weather/scorer), I can prepare a safe patch to delete them — they are present but not required.
- I can also add a concise `test/` unit test scaffold for `phishcheck-tool.ts` (Jest/Vitest) if you'd like test coverage.

## License

ISC — see `package.json` for details.

## Author

PhishNet — AI agent for phishing detection and cyber-safety tips

# PhishNet-Agent

A2A (Agent-to-Agent) JSON-RPC integration for automated phishing detection and cyber-safety tips

Node.js · TypeScript · ISC

## Overview

PhishNet-Agent is a focused Mastra-based agent that inspects URLs and short message text for phishing indicators, returns a concise verdict, and (optionally) posts periodic cyber-safety tips. It exposes a JSON-RPC 2.0 A2A endpoint so other systems (or other Mastra agents) can call it programmatically.

This repository contains the PhishNet agent, the phish-checking tool, a daily tips cron, and the A2A route wiring. No weather or scorer components are required for basic operation — the README and examples below focus only on phishing-related features.

## Key features

- Phishing link detection (heuristics + optional external lookup)
- Short, actionable verdicts (block / suspicious / safe) and suggested actions
- Optional integration with PhishTank or other lookup APIs
- Daily cyber-tip scheduler (cron) — optional webhook delivery
- JSON-RPC 2.0 A2A API (message/send and execute styles)
- Conversation memory via LibSQL (if enabled)

## Architecture (high level)

Mastra (Agents & Workflows) ── Tools (phishcheck-tool) ── External lookups (PhishTank/API)

## Prerequisites

- Node.js >= 20.9.0
- pnpm (recommended) or npm
- Optional: API keys for external services (PhishTank, LLMs)

## Installation

Clone and install:

```powershell
git clone https://github.com/yasmincreates/phishnet-agent.git
cd phishnet-agent
pnpm install
# or
npm install
```

## Configuration

Copy `.env.example` to `.env` and set values you need. Typical variables:

# PhishNet-Agent

A2A (Agent-to-Agent) JSON-RPC integration for automated phishing detection and cyber-safety tips

Node.js · TypeScript · ISC

## Overview

PhishNet-Agent is a focused Mastra-based agent that inspects URLs and short message text for phishing indicators, returns a concise verdict, and (optionally) posts periodic cyber-safety tips. It exposes a JSON-RPC 2.0 A2A endpoint so other systems (or other Mastra agents) can call it programmatically.

This repository contains the PhishNet agent, the phish-checking tool, a daily tips cron, and the A2A route wiring. The documentation is focused on phishing functionality.

## What this project contains (phishing-focused)

- Agent: `src/mastra/agents/phishnet-agent.ts` — the PhishNet conversational agent (registered as `phishnet`).
- Tool: `src/mastra/tools/phishcheck-tool.ts` — URL inspection + PhishTank lookup fallback (tool id: `check-phishing`).
- Route: `src/mastra/routes/a2a-agent-route.ts` — JSON-RPC 2.0 A2A endpoint wiring (POST /a2a/agent/:agentId).
- Cron: `src/mastra/cron/daily-tips.ts` — optional daily tip scheduler (send is disabled by default).
- Storage/types: `src/mastra/utils/definitions.ts` — shared types (e.g., `PhishResult`).

## Key features

- Heuristic and optional PhishTank lookup for URL analysis
- Short, actionable verdicts (safe / suspicious / unknown) with reasons
- JSON-RPC 2.0 A2A endpoint for programmatic calls
- Optional daily tips scheduler that can post to a webhook
- Memory store (LibSQL) available if enabled in `src/mastra/index.ts`

## Quick facts (accurate references)

- Registered agentId (URL segment): `phishnet` — see `src/mastra/index.ts` (agents: { phishnet: phishNetAgent }).
- Agent variable name: `phishNetAgent` exported from `src/mastra/agents/phishnet-agent.ts`.
- Tool id: `check-phishing` (declared in `src/mastra/tools/phishcheck-tool.ts`).
- A2A route: `POST /a2a/agent/:agentId` implemented in `src/mastra/routes/a2a-agent-route.ts`.

## Prerequisites

- Node.js >= 20.9.0
- pnpm (recommended) or npm

## Installation

Clone and install dependencies:

```powershell
git clone https://github.com/yasmincreates/phishnet-agent.git
cd phishnet-agent
pnpm install
# or
npm install
```

## Configuration

Copy `.env.example` to `.env` and set the variables you need. Useful variables:

- `PHISHCHECK_API_KEY` — optional external lookup key (if you switch to a paid lookup service)
- `TELEX_WEBHOOK` — optional webhook URL for daily tips
- `PORT` — server port (default 4111)
- `DATABASE_URL` — LibSQL connection string (default `:memory:`)
- `GOOGLE_GENERATIVE_AI_API_KEY` — optional LLM key

Note: `startDailyTips()` is invoked in `src/mastra/index.ts`, but the send call in `daily-tips.ts` is not active by default; enable it if you want automatic posting.

## Usage

Start the development server:

```powershell
pnpm run dev
# or
npm run dev
```

Production build and start:

```powershell
pnpm run build
pnpm run start
```

The Mastra server listens on the `PORT` configured in `.env` (default 4111).

## Calling the agent (A2A examples)

Endpoint: `POST /a2a/agent/:agentId`

Replace `:agentId` with the registered agent id `phishnet`.

Message/send (full A2A style):

```bash
curl -X POST http://localhost:4111/a2a/agent/phishnet \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "req-001",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "role": "user",
        "parts": [ { "kind": "text", "text": "Check this link: http://example.com/login" } ],
        "messageId": "m-001",
        "taskId": "t-001"
      },
      "configuration": { "blocking": true }
    }
  }'
```

Simplified execute style (quick):

```bash
curl -X POST http://localhost:4111/a2a/agent/phishnet \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "req-002",
    "method": "execute",
    "params": {
      "messages": [ { "role": "user", "parts": [ { "kind": "text", "text": "Is http://example.com/login a phishing link?" } ] } ]
    }
  }'
```

Example result (abbreviated):

```json
{
  "jsonrpc": "2.0",
  "id": "req-002",
  "result": {
    "id": "t-001",
    "contextId": "ctx-uuid",
    "status": { "state": "completed", "timestamp": "..." },
    "artifacts": [
      {
        "artifactId": "a-1",
        "name": "phishAnalysis",
        "parts": [
          {
            "kind": "text",
            "text": "⚠️ Suspicious — domain mismatch and login form detected. Recommended: block and report."
          }
        ]
      }
    ],
    "history": [],
    "kind": "task"
  }
}
```

## Testing helpers

- `test-a2a-request.json` — example execute payload at repo root.
- `scripts/test-a2a.ps1` — PowerShell helper that posts the example payload to `http://localhost:4111/a2a/agent/phishnet` and prints the response.

Run the PowerShell helper from repo root:

```powershell
.\scripts\test-a2a.ps1
```

Or use curl with the example file:

```powershell
curl -X POST http://localhost:4111/a2a/agent/phishnet -H "Content-Type: application/json" -d @test-a2a-request.json
```

## Troubleshooting (accurate tips)

- Agent not found: ensure `phishnet` is registered in `src/mastra/index.ts` (it is in this repo).
- No external lookup: check network and `PHISHCHECK_API_KEY` if using a paid service.
- Daily tips not posting: enable `TELEX_WEBHOOK` and remove/comment toggle in `daily-tips.ts` where the actual send is currently disabled.
- Port in use: change `PORT` in `.env` or stop the process using the port.

## Notes & next steps you might want

- If you want to remove non-phishing example files (weather/scorer), I can prepare a safe patch to delete them — they are present but not required.
- I can also add a concise `test/` unit test scaffold for `phishcheck-tool.ts` (Jest/Vitest) if you'd like test coverage.

## License

ISC — see `package.json` for details.

## Author

PhishNet — AI agent for phishing detection and cyber-safety tips

Key capabilities

- AI-Powered Phishing Detection — Conversational agent that analyzes URLs and email content for phishing indicators
- Real-time Link Checking — Integrates external checking logic via a pluggable tool (`phishcheck-tool.ts`)
- Multi-Agent Workflows — Example weather planning workflow demonstrates orchestration between agents
- A2A Protocol Compliance — JSON-RPC 2.0 API for agent-to-agent messages and task execution
- Conversation Memory — Persistent context using LibSQL for conversation history
- Evaluators / Scorers — Built-in scorers to validate tool use and response completeness
- REST API & Swagger UI — Exposes an A2A endpoint with OpenAPI docs when the server is running

## Architecture

An ASCII overview of the main components and how they interact.

┌─────────────────────────────────────────────────────────────┐
│ A2A Protocol Layer │
│ (JSON-RPC 2.0 API) │
└───────────────────────────┬─────────────────────────────────┘
│
┌───────────────────────────▼─────────────────────────────────┐
│ Mastra Core Engine │
│ ┌────────────┐ ┌──────────┐ ┌──────────────────────┐ │
│ │ Agents │ │ Workflows│ │ Evaluators │ │
│ │(phishnet, │ │(weather) │ │ (scorers) │ │
│ │ weather) │ │ │ │ │ │
│ └─────┬──────┘ └────┬─────┘ └──────────────────────┘ │
│ │ │ │
│ ┌─────▼──────────────▼─────┐ ┌──────────────────────┐ │
│ │ Tools │ │ Memory Store │ │
│ │ (phishcheck, weather) │ │ (LibSQL) │ │
│ └───────────────────────────┘ └──────────────────────┘ │
└───────────────────────────┬─────────────────────────────────┘
│
┌───────────────────────────▼─────────────────────────────────┐
│ External Services │
│ ┌──────────────────┐ ┌────────────────────────────┐ │
│ │ Phish-check API │ │ Google Generative AI │ │
│ │ (optional) │ │ (Gemini, optional) │ │
│ └──────────────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

## Prerequisites

- Node.js >= 20.9.0
- pnpm or npm (pnpm recommended for the repo)
- Optional: API keys for external services (see Configuration)

## Installation

Clone the repository:

```powershell
git clone https://github.com/yasmincreates/phishnet-agent.git
cd phishnet-agent
```

Install dependencies:

```powershell
pnpm install
# or
npm install
```

## Configuration

Copy the example environment file and edit it with any keys you need:

```powershell
cp .env.example .env
```

Common environment variables (example):

- GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here # optional, for LLMs
- PHISHCHECK_API_KEY=your_phishcheck_api_key_here # optional, for external link-checking services
- PORT=4111 # server port (Mastra default)
- DATABASE_URL=:memory: # LibSQL connection string

If you don't use an external phish-check API, the `phishcheck-tool` can still run heuristic checks locally.

## Project structure

````
src/
  mastra/
    index.ts                 # Mastra configuration (agents, workflows, scorers)
    # PhishNet-Agent

    A2A (Agent-to-Agent) JSON-RPC integration for automated phishing detection and cyber-safety tips

    Node.js · TypeScript · ISC

    ## Overview
    PhishNet-Agent is a focused Mastra-based agent that inspects URLs and short message text for phishing indicators, returns a concise verdict, and (optionally) posts periodic cyber-safety tips. It exposes a JSON-RPC 2.0 A2A endpoint so other systems (or other Mastra agents) can call it programmatically.

    This repository contains the PhishNet agent, the phish-checking tool, a daily tips cron, and the A2A route wiring. The documentation is focused on phishing functionality.

    ## What this project contains (phishing-focused)

    - Agent: `src/mastra/agents/phishnet-agent.ts` — the PhishNet conversational agent (registered as `phishnet`).
    - Tool: `src/mastra/tools/phishcheck-tool.ts` — URL inspection + PhishTank lookup fallback (tool id: `check-phishing`).
    - Route: `src/mastra/routes/a2a-agent-route.ts` — JSON-RPC 2.0 A2A endpoint wiring (POST /a2a/agent/:agentId).
    - Cron: `src/mastra/cron/daily-tips.ts` — optional daily tip scheduler (send is disabled by default).
    - Storage/types: `src/mastra/utils/definitions.ts` — shared types (e.g., `PhishResult`).

    ## Key features

    - Heuristic and optional PhishTank lookup for URL analysis
    - Short, actionable verdicts (safe / suspicious / unknown) with reasons
    - JSON-RPC 2.0 A2A endpoint for programmatic calls
    - Optional daily tips scheduler that can post to a webhook
    - Memory store (LibSQL) available if enabled in `src/mastra/index.ts`

    ## Quick facts (accurate references)

    - Registered agentId (URL segment): `phishnet` — see `src/mastra/index.ts` (agents: { phishnet: phishNetAgent }).
    - Agent variable name: `phishNetAgent` exported from `src/mastra/agents/phishnet-agent.ts`.
    - Tool id: `check-phishing` (declared in `src/mastra/tools/phishcheck-tool.ts`).
    - A2A route: `POST /a2a/agent/:agentId` implemented in `src/mastra/routes/a2a-agent-route.ts`.

    ## Prerequisites

    - Node.js >= 20.9.0
    - pnpm (recommended) or npm

    ## Installation

    Clone and install dependencies:

    ```powershell
    git clone https://github.com/yasmincreates/phishnet-agent.git
    cd phishnet-agent
    pnpm install
    # or
    npm install
    ```

    ## Configuration

    Copy `.env.example` to `.env` and set the variables you need. Useful variables:

    - `PHISHCHECK_API_KEY` — optional external lookup key (if you switch to a paid lookup service)
    - `TELEX_WEBHOOK` — optional webhook URL for daily tips
    - `PORT` — server port (default 4111)
    - `DATABASE_URL` — LibSQL connection string (default `:memory:`)
    - `GOOGLE_GENERATIVE_AI_API_KEY` — optional LLM key

    Note: `startDailyTips()` is invoked in `src/mastra/index.ts`, but the send call in `daily-tips.ts` is not active by default; enable it if you want automatic posting.

    ## Usage

    Start the development server:

    ```powershell
    pnpm run dev
    # or
    npm run dev
    ```

    Production build and start:

    ```powershell
    pnpm run build
    pnpm run start
    ```

    The Mastra server listens on the `PORT` configured in `.env` (default 4111).

    ## Calling the agent (A2A examples)

    Endpoint: `POST /a2a/agent/:agentId`

    Replace `:agentId` with the registered agent id `phishnet`.

    Message/send (full A2A style):

    ```bash
    curl -X POST http://localhost:4111/a2a/agent/phishnet \
      -H "Content-Type: application/json" \
      -d '{
        "jsonrpc": "2.0",
        "id": "req-001",
        "method": "message/send",
        "params": {
          "message": {
            "kind": "message",
            "role": "user",
            "parts": [ { "kind": "text", "text": "Check this link: http://example.com/login" } ],
            "messageId": "m-001",
            "taskId": "t-001"
          },
          "configuration": { "blocking": true }
        }
      }'
    ```

    Simplified execute style (quick):

    ```bash
    curl -X POST http://localhost:4111/a2a/agent/phishnet \
      -H "Content-Type: application/json" \
      -d '{
        "jsonrpc": "2.0",
        "id": "req-002",
        "method": "execute",
        "params": {
          "messages": [ { "role": "user", "parts": [ { "kind": "text", "text": "Is http://example.com/login a phishing link?" } ] } ]
        }
      }'
    ```

    Example result (abbreviated):

    ```json
    {
      "jsonrpc": "2.0",
      "id": "req-002",
      "result": {
        "id": "t-001",
        "contextId": "ctx-uuid",
        "status": { "state": "completed", "timestamp": "..." },
        "artifacts": [ { "artifactId": "a-1", "name": "phishAnalysis", "parts": [ { "kind": "text", "text": "⚠️ Suspicious — domain mismatch and login form detected. Recommended: block and report." } ] } ],
        "history": [],
        "kind": "task"
      }
    }
    ```

    ## Testing helpers

    - `test-a2a-request.json` — example execute payload at repo root.
    - `scripts/test-a2a.ps1` — PowerShell helper that posts the example payload to `http://localhost:4111/a2a/agent/phishnet` and prints the response.

    Run the PowerShell helper from repo root:

    ```powershell
    .\scripts\test-a2a.ps1
    ```

    Or use curl with the example file:

    ```powershell
    curl -X POST http://localhost:4111/a2a/agent/phishnet -H "Content-Type: application/json" -d @test-a2a-request.json
    ```

    ## Troubleshooting (accurate tips)

    - Agent not found: ensure `phishnet` is registered in `src/mastra/index.ts` (it is in this repo).
    - No external lookup: check network and `PHISHCHECK_API_KEY` if using a paid service.
    - Daily tips not posting: enable `TELEX_WEBHOOK` and remove/comment toggle in `daily-tips.ts` where the actual send is currently disabled.
    - Port in use: change `PORT` in `.env` or stop the process using the port.

    ## Notes & next steps you might want

    - If you want to remove non-phishing example files (weather/scorer), I can prepare a safe patch to delete them — they are present but not required.
    - I can also add a concise `test/` unit test scaffold for `phishcheck-tool.ts` (Jest/Vitest) if you'd like test coverage.

    ## License

    ISC — see `package.json` for details.

    ## Author

    PhishNet — AI agent for phishing detection and cyber-safety tips


## Author

PhishNet — AI agent that detects phishing links and sends daily cyber tips

## Acknowledgments

- Mastra Framework — AI agent framework
- Built with Mastra and optionally powered by Google Generative AI for LLM reasoning

---

If you'd like, I can also:

- add a `test-a2a-request.json` example file for quick testing,
- add a minimal `curl`-based health-check test script,
- or wire a basic README badge section (build/tests) — tell me which you'd prefer next.

# PhishNet — AI-Powered Phishing Detection & Awareness Agent

PhishNet is a simple AI-powered cybersecurity assistant built with the [Mastra framework](https://mastra.ai) and integrated with [Telex.im](https://telex.im) via the A2A (Agent-to-Agent) protocol.
It inspects links shared in chat, flags suspicious URLs, and sends a daily cybersecurity tip to keep teams safer.

🔗 **Live Demo on Telex.im**: [Add your Telex channel link here]

---

## 🎯 What PhishNet does

- 🕵️‍♂️ Detects suspicious or malicious links in chat messages.
- 🔎 Uses the free PhishTank lookup for known phishing domains.
- 🧠 Uses a conservative heuristic when a lookup is inconclusive.
- 💬 Replies with a short human-friendly verdict per URL.
- 📬 Optionally posts a daily cybersecurity tip to a configured webhook.

### Example

**User**: `Check this link: https://secure-login-update.example`
**PhishNet**:

> ⚠️ Suspicious — domain contains login/update tokens and is likely a credential phishing attempt. Avoid entering credentials.
> 💡 Tip: Use a password manager to avoid reused passwords.

---

## 🚀 Features

- Free phishing lookup via **PhishTank** (`https://checkurl.phishtank.com/checkurl/`)
- Simple heuristic fallback for suspicious patterns
- Daily tips scheduler (cron) — optional automatic posting to a webhook
- A2A JSON-RPC interface compatible with Telex.im
- Minimal, Mastra-native codebase — easy to review and deploy

---

## 🧠 Tech Stack

- **Language:** TypeScript
- **AI Model:** Google Gemini 2.5 Flash
- **Framework:** Mastra Core

---

## 🏗️ Project structure

phishnet-agent/
├── src/
│ ├── agents/
│ │ └── phishnet-agent.ts
│ ├── tools/
│ │ └── phishcheck-tool.ts
│ ├── routes/
│ │ └── a2a-route.ts
│ ├── cron/
│ │ └── daily-tips.ts
│ ├── utils/
│ │ └── definitions.ts
│ ├── workflows/
│ │ └── phishnet-workflow.json
│ └── index.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md

---

## 🔧 Setup & run (quick)

### Prerequisites

- Node.js >= 20.9.0
- Mastra CLI (`npm i -g @mastra/cli`)
- Telex.im account

### Install & run

```bash
git clone <repo-url>
cd phishnet-agent
pnpm install    # or npm install
mastra dev      # run locally with Mastra
# or
mastra build
mastra start


Environment

Copy .env.example -> .env and set values as needed:

GEMINI_API_KEY=            # optional
DAILY_CRON=0 9 * * *
TELEX_WEBHOOK=             # optional webhook to POST daily tips

🔗 Telex workflow JSON

Import src/workflows/phishnet-workflow.json (or workflow/phishnet-workflow.json) into Telex.im. Replace https://YOUR_DEPLOYMENT_URL with your deployment URL:

{
  "active": true,
  "category": "security",
  "description": "PhishNet: detects suspicious links and sends daily cybersecurity tips",
  "id": "phishnet_workflow_001",
  "name": "phishnet_agent",
  "nodes": [
    {
      "id": "phishnet_agent_node",
      "name": "PhishNet Security Agent",
      "position": [500, 150],
      "type": "a2a/mastra-a2a-node",
      "typeVersion": 1,
      "url": "https://YOUR_DEPLOYMENT_URL/a2a/agent/phishnet"
    }
  ],
  "settings": { "executionOrder": "v1" }
}

🧪 Testing the A2A endpoint

Example CURL to test the endpoint (replace URL with your deployment):

curl -X POST https://YOUR_DEPLOYMENT_URL/a2a/agent/phishnet \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-001",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "role": "user",
        "parts": [{ "kind": "text", "text": "Check https://login-update.example" }]
      }
    }
  }'

🐞 Troubleshooting

Agent not found: confirm agentId in the workflow matches "phishnet".

No daily tip posted: set TELEX_WEBHOOK and ensure the webhook accepts JSON { text: "..." }.

PhishTank lookup unreliable: the code falls back to heuristics; adjust heuristic tokens in phishcheck-tool.ts.

💬 Notes & improvements

For higher accuracy, replace heuristics with a paid phishing API or integrate multiple sources.

Add persistent storage for flagged links and a UI for reviewers.

Use the GEMINI_API_KEY to generate clearer tip phrasing and richer summaries.

👩‍💻 Author

Yasmin Abdulrahman — built for the HNG Internship Stage 3 Backend Stage.

License

MIT
````
