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
