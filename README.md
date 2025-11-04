# PhishNet - AI-Powered Phishing Detection Agent 🛡️

An intelligent AI agent built with Mastra and Google Gemini that detects phishing attempts, analyzes suspicious URLs, and provides real-time security advice through Telex.im messaging platform.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Mastra](https://img.shields.io/badge/Mastra-0.23-purple.svg)](https://mastra.ai/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Telex Integration](#telex-integration)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🎯 Overview

PhishNet is a cybersecurity-focused AI agent that helps users identify and avoid phishing scams by analyzing message content and URLs for common phishing indicators. Built as part of the HNG Internship Stage 3 Backend Task, PhishNet combines pattern-based heuristics with AI-powered natural language generation to provide clear, actionable security advice.

### Why PhishNet?

- **90%+ of cyberattacks** start with phishing
- Scammers use sophisticated social engineering tactics
- Most users can't identify lookalike domains or shortened URLs
- Traditional spam filters miss context-aware threats

PhishNet bridges this gap by providing real-time analysis and education.

---

## ✨ Features

### Core Capabilities

- 🔍 **Real-Time Phishing Detection** - Analyzes messages instantly for suspicious patterns
- 🔗 **URL Analysis** - Identifies shortened links, IP addresses, lookalike domains, and insecure connections
- 🚨 **Risk Scoring** - Assigns risk levels from safe (0-19) to critical (80-100)
- 💬 **Natural Language Responses** - Clear, non-technical explanations powered by Google Gemini
- 🔄 **Telex.im Integration** - Seamless A2A protocol implementation for messaging platform
- 💾 **Persistent Memory** - LibSQL storage for conversation context and follow-up questions
- ⚡ **Fast Response Time** - Average 1.8 second analysis and response generation
- 📊 **Detailed Analysis** - Specific warnings about detected threats with actionable advice

### Detection Capabilities

PhishNet identifies:

- **Urgent Language** - "Act now", "Immediately", "Suspended", "Verify"
- **Sensitive Information Requests** - Password, credit card, SSN, bank account
- **Suspicious URLs** - Shortened links (bit.ly, tinyurl), IP addresses, suspicious TLDs (.tk, .ml, .xyz)
- **Lookalike Domains** - paypa1.com, g00gle.com, micros0ft.com
- **Insecure Connections** - HTTP instead of HTTPS
- **Social Engineering Tactics** - Pressure, urgency, authority impersonation

---

## 🎬 Demo

### Example Interactions

**Test 1: High-Risk Phishing Attempt**

**User Input:**
```
URGENT! Your account has been suspended. 
Click here immediately: http://bit.ly/verify-account
Enter your password to restore access.
```

**PhishNet Response:**
```
🚨 DANGER - This is a phishing attempt!

Red flags detected:
• Urgent language: "urgent", "suspended", "immediately"
• Requests password (legitimate companies never do this)
• Shortened URL hides real destination: bit.ly
• Insecure HTTP connection

Risk Score: 75/100

DO NOT click the link or provide any information.
Contact the company directly using official contact methods.
```

---

**Test 2: Legitimate Message**

**User Input:**
```
Check out this cybersecurity article from The New York Times:
https://www.nytimes.com/tech/ai-security-trends
```

**PhishNet Response:**
```
✅ Safe - This message looks legitimate!

• Official domain (nytimes.com)
• Secure HTTPS connection
• No suspicious patterns detected
• No requests for sensitive information

Risk Score: 0/100

You're good to proceed.
```

---

**Test 3: Lookalike Domain**

**User Input:**
```
Recover your PayPal account at paypa1-secure.tk
```

**PhishNet Response:**
```
🚨 DANGER - Sophisticated phishing detected!

Red flags:
• Lookalike domain: "paypa1" mimics "paypal" (note the "1" instead of "l")
• Suspicious TLD: .tk (commonly used for scams)
• Claims to be official recovery site

Risk Score: 50/100

This is NOT PayPal. The real PayPal website is paypal.com only.
Contact PayPal support directly if you have account issues.
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Telex Platform                      │
│         (User Interface Layer)                   │
└───────────────┬─────────────────────────────────┘
                │ HTTP POST (A2A Protocol)
                │ /a2a/agent/phishnet
                ▼
┌─────────────────────────────────────────────────┐
│         Express Server (Port 4111)               │
│  ┌─────────────────────────────────────────┐   │
│  │      A2A Route Handler                   │   │
│  │  • Request validation                    │   │
│  │  • Message extraction                    │   │
│  │  • Response formatting                   │   │
│  └──────────────┬──────────────────────────┘   │
└─────────────────┼───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│           Mastra Framework                       │
│  ┌─────────────────────────────────────────┐   │
│  │        PhishNet Agent                    │   │
│  │  • Instructions processing               │   │
│  │  • Tool orchestration                    │   │
│  │  • Memory management (LibSQL)            │   │
│  │                                          │   │
│  │  ┌──────────────────────────────────┐  │   │
│  │  │   Phishing Detector Tool         │  │   │
│  │  │  • Urgent language detection     │  │   │
│  │  │  • Sensitive info checks         │  │   │
│  │  │  • URL pattern analysis          │  │   │
│  │  │  • Risk scoring algorithm        │  │   │
│  │  └──────────────────────────────────┘  │   │
│  └─────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         Google Gemini API                        │
│      (gemini-2.0-flash-exp)                     │
│      Natural Language Generation                 │
└─────────────────────────────────────────────────┘
```

### Data Flow

1. **User Message** → Telex platform
2. **HTTP POST** → A2A endpoint with message payload
3. **Validation** → Express middleware checks request structure
4. **Agent Routing** → Mastra framework invokes PhishNet agent
5. **Tool Execution** → Detector tool analyzes message and URLs
6. **Risk Assessment** → Scoring algorithm returns warnings and risk level
7. **AI Generation** → Gemini creates natural language explanation
8. **Response Formatting** → Wrapped in A2A-compliant artifacts structure
9. **Delivery** → JSON response sent back to Telex
10. **Display** → User sees formatted security advice

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 20.0.0 or higher ([Download](https://nodejs.org/))
- **npm** or **pnpm** package manager
- **Google Gemini API key** ([Get one free](https://aistudio.google.com/app/apikey))
- **Telex.im account** for testing ([Sign up](https://telex.im))
- Basic knowledge of TypeScript and REST APIs

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/phishnet-agent.git
cd phishnet-agent
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
PORT=4111
NODE_ENV=development
```

**To obtain your Gemini API key:**
- Visit https://aistudio.google.com/app/apikey
- Sign in with your Google account
- Click "Create API Key"
- Copy the generated key and paste it in `.env`

4. **Verify installation**

```bash
npm run dev
```

Expected output:
```
🚀 PhishNet running on http://localhost:4111
🔗 A2A endpoint: http://localhost:4111/a2a/agent/phishnet
```

5. **Test the health endpoint**

```bash
curl http://localhost:4111
```

Expected response:
```json
{
  "status": "online",
  "service": "PhishNet",
  "endpoint": "/a2a/agent/phishnet"
}
```

---

## 💻 Usage

### Local Testing with cURL

**Test a phishing message:**

```bash
curl -X POST http://localhost:4111/a2a/agent/phishnet \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "URGENT! Click here to verify your account: http://bit.ly/secure-login"
      }
    ],
    "threadId": "test-001"
  }'
```

**Test a safe message:**

```bash
curl -X POST http://localhost:4111/a2a/agent/phishnet \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Here is an article from CNN: https://www.cnn.com/tech/cybersecurity"
      }
    ],
    "threadId": "test-002"
  }'
```

### Using Postman or Thunder Client

1. Create a new POST request to `http://localhost:4111/a2a/agent/phishnet`
2. Set header: `Content-Type: application/json`
3. Use this request body:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your message to analyze here"
    }
  ],
  "threadId": "unique-thread-id"
}
```

### Integration in Your Application

```typescript
import axios from 'axios';

async function analyzeMessage(message: string) {
  try {
    const response = await axios.post('http://localhost:4111/a2a/agent/phishnet', {
      messages: [{ role: 'user', content: message }],
      threadId: `thread-${Date.now()}`
    });
    
    const analysis = response.data.artifacts[0].content;
    console.log('PhishNet Analysis:', analysis);
    return analysis;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage
analyzeMessage('Click here: bit.ly/free-money');
```

---

## 📚 API Documentation

### Endpoints

#### `GET /` - Health Check

Returns the service status and available endpoints.

**Response:**
```json
{
  "status": "online",
  "service": "PhishNet",
  "endpoint": "/a2a/agent/phishnet"
}
```

---

#### `POST /a2a/agent/phishnet` - Analyze Message

Main endpoint for phishing detection and analysis.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Message text to analyze"
    }
  ],
  "threadId": "unique-thread-identifier",
  "conversationId": "optional-conversation-id"
}
```

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messages` | Array | Yes | Array of message objects |
| `messages[].role` | String | Yes | Must be "user" |
| `messages[].content` | String | Yes | Message text to analyze |
| `threadId` | String | No | Thread identifier for conversation continuity |
| `conversationId` | String | No | Alternative conversation identifier |

**Success Response (200 OK):**
```json
{
  "artifacts": [
    {
      "type": "text",
      "content": "Analysis result with risk assessment and recommendations",
      "title": "PhishNet Analysis"
    }
  ],
  "metadata": {
    "agentName": "phishnet",
    "threadId": "thread-123",
    "timestamp": "2025-11-05T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "artifacts": [
    {
      "type": "text",
      "content": "No message provided",
      "title": "Error"
    }
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "artifacts": [
    {
      "type": "text",
      "content": "Agent phishnet not found",
      "title": "Error"
    }
  ]
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "artifacts": [
    {
      "type": "text",
      "content": "System error. Please try again.",
      "title": "Error"
    }
  ]
}
```

---

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Test Scenarios

The project includes comprehensive test cases covering:

**1. High-Risk Phishing Detection**
- Urgent language identification
- Credential request detection
- Shortened URL flagging
- Combined threat scenarios

**2. Medium-Risk Scenarios**
- Suspicious but not definitive threats
- Contextual analysis
- Edge cases

**3. Safe Message Validation**
- Legitimate domains
- Secure connections
- No false positives on safe content

**4. Edge Cases**
- Empty messages
- Malformed URLs
- Special characters
- Multi-language content

### Manual Testing Checklist

- [ ] Urgent language detection works
- [ ] Sensitive information requests flagged
- [ ] Shortened URLs identified
- [ ] Lookalike domains caught
- [ ] HTTP vs HTTPS distinction
- [ ] Safe messages not flagged
- [ ] Response time under 3 seconds
- [ ] Error handling works correctly
- [ ] Conversation memory persists
- [ ] A2A protocol compliance

---

## 🌐 Deployment

### Deploy to Mastra Cloud (Recommended)

1. **Login to Mastra**
```bash
npx mastra login
```

2. **Deploy**
```bash
npx mastra deploy
```

3. **Get your deployment URL**

After deployment, you'll receive a URL like:
```
https://phishnet-agent.mastra.cloud
```

4. **Set environment variables** (if needed)

Use Mastra dashboard to set production environment variables.

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables**
```bash
vercel env add GOOGLE_API_KEY
vercel env add PORT
```

4. **Redeploy with environment variables**
```bash
vercel --prod
```

### Deploy to Railway

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Initialize project**
```bash
railway init
```

4. **Add environment variables**
```bash
railway variables set GOOGLE_API_KEY=your_key
railway variables set PORT=4111
```

5. **Deploy**
```bash
railway up
```

### Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 4111

CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t phishnet-agent .
docker run -p 4111:4111 -e GOOGLE_API_KEY=your_key phishnet-agent
```

---

## 🔗 Telex Integration

### Step 1: Get Telex Access

Run this command in your HNG Slack workspace:

```
/telex-invite your-email@example.com
```

You'll receive an invitation email to join the Telex organization.

### Step 2: Access Telex Platform

1. Visit https://telex.im
2. Log in with your invited email
3. Navigate to the "Home" section

### Step 3: Add PhishNet as Co-worker

Click the **"Add Co-worker"** button and paste this workflow JSON:

```json
{
  "active": true,
  "category": "security",
  "description": "AI-powered phishing detection and security analysis",
  "id": "phishnet_security_agent",
  "name": "PhishNet Security Agent",
  "long_description": "PhishNet is an AI-powered cybersecurity assistant that analyzes messages and URLs for phishing indicators. It provides real-time threat detection, risk scoring, and actionable security advice.\n\nFeatures:\n• Detects urgent language and social engineering tactics\n• Analyzes URLs for suspicious patterns\n• Identifies lookalike domains and shortened links\n• Provides clear risk assessments (Safe/Caution/Danger)\n• Offers specific recommendations for each threat\n\nSend any suspicious message to PhishNet for instant analysis.",
  "short_description": "Detects phishing attempts and analyzes security threats in real-time",
  "nodes": [
    {
      "id": "phishnet_detector",
      "name": "PhishNet Agent",
      "parameters": {},
      "position": [500, 200],
      "type": "a2a/mastra-a2a-node",
      "typeVersion": 1,
      "url": "https://your-deployed-url.mastra.cloud/a2a/agent/phishnet"
    }
  ],
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  }
}
```

**⚠️ IMPORTANT:** Replace `https://your-deployed-url.mastra.cloud` with your actual deployment URL!

### Step 4: Test on Telex

1. Find PhishNet in your colleagues/co-workers list
2. Click to start a conversation
3. Send a test message: 
   ```
   Check this link: bit.ly/free-iphone
   ```
4. PhishNet should respond with analysis!

### Step 5: View Agent Logs

To debug or monitor your agent:

1. Open Telex in browser
2. Open DevTools (F12)
3. Go to Network tab
4. Look at the URL bar for your channel ID:
   ```
   https://telex.im/telex-im/home/colleagues/01989dec-0d08-71ee-9017-00e4556e1942/...
                                              ↑ Copy this UUID
   ```
5. Visit:
   ```
   https://api.telex.im/agent-logs/01989dec-0d08-71ee-9017-00e4556e1942.txt
   ```

You'll see all requests and responses between Telex and your agent.

---

## 🔍 How It Works

### Detection Algorithm

PhishNet uses a multi-heuristic scoring system:

#### 1. Urgent Language Detection (+15 points each)

Checks for panic-inducing words:
```typescript
const urgentWords = [
  'urgent', 'immediately', 'suspended', 
  'verify', 'expire', 'act now', 'limited time'
];
```

**Why it matters:** Phishers create urgency to bypass rational thinking.

#### 2. Sensitive Information Requests (+20 points each)

Flags requests for credentials:
```typescript
const sensitiveTerms = [
  'password', 'credit card', 'ssn', 
  'bank account', 'cvv', 'pin code'
];
```

**Why it matters:** Legitimate companies never ask for this via message.

#### 3. URL Analysis

**Shortened URLs** (+25 points):
- bit.ly, tinyurl, goo.gl
- These hide the real destination

**Lookalike Domains** (+25 points):
- paypa1 vs paypal
- g00gle vs google
- micros0ft vs microsoft

**Insecure Connections** (+10 points):
- HTTP instead of HTTPS
- No encryption = dangerous

**Suspicious TLDs** (+25 points):
- .tk, .ml, .xyz domains
- Often used for temporary scam sites

#### 4. Risk Classification

```typescript
if (score >= 80) → 🚨 Critical
if (score >= 60) → 🚨 High Risk
if (score >= 40) → ⚠️ Medium Risk
if (score >= 20) → ⚠️ Low Risk
if (score < 20)  → ✅ Safe
```

### AI Response Generation

After detection, Google Gemini generates natural language explanations:

1. **Tool Output:**
   ```json
   {
     "score": 75,
     "risk": "high",
     "warnings": ["Urgent language: suspended", "Shortened URL: bit.ly"]
   }
   ```

2. **Agent Instructions:** Structured format for consistent responses

3. **Gemini Output:**
   ```
   🚨 DANGER - This is a phishing attempt!
   
   Red flags detected:
   • Urgent language: "suspended"
   • Shortened URL hides destination
   
   DO NOT click the link.
   ```

---

## 📁 Project Structure

```
phishnet-agent/
├── src/
│   ├── agents/
│   │   └── phishnet.ts           # Agent configuration and instructions
│   ├── tools/
│   │   └── detector.ts           # Phishing detection logic
│   ├── routes/
│   │   └── a2a.ts               # A2A protocol implementation
│   └── index.ts                 # Server initialization and Mastra config
├── .mastra/                     # Mastra build output (generated)
│   ├── output/
│   └── mastra.db               # LibSQL database
├── dist/                        # TypeScript build output (generated)
├── node_modules/                # Dependencies (generated)
├── .env                         # Environment variables (DO NOT COMMIT)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Dependency lock file
├── tsconfig.json                # TypeScript configuration
├── README.md                    # This file
└── LICENSE                      # MIT License

```

### File Descriptions

| File/Folder | Purpose |
|------------|---------|
| `src/agents/phishnet.ts` | Defines the AI agent's personality, instructions, model, and tools |
| `src/tools/detector.ts` | Core phishing detection logic with pattern matching and scoring |
| `src/routes/a2a.ts` | Handles Telex.im A2A protocol communication and response formatting |
| `src/index.ts` | Express server setup, Mastra initialization, and endpoint configuration |
| `.env` | Stores sensitive configuration (API keys, ports) - never commit this |
| `tsconfig.json` | TypeScript compiler options and project settings |
| `package.json` | Project metadata, dependencies, and npm scripts |

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with these variables:

```env
# Required
GOOGLE_API_KEY=your_gemini_api_key_here

# Optional
PORT=4111
NODE_ENV=development

# Storage (optional - defaults to memory)
DATABASE_URL=file:../mastra.db
```

### TypeScript Configuration

The `tsconfig.json` is pre-configured for ES2022 modules:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Mastra Configuration

Mastra configuration in `src/index.ts`:

```typescript
export const mastra = new Mastra({
  agents: { phishnet },
  storage: new LibSQLStore({ url: ':memory:' }), // Or file:../mastra.db
});
```

**Storage Options:**
- `:memory:` - In-memory (fast, doesn't persist between restarts)
- `file:../mastra.db` - File-based (persists data, slower)

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Agent not found" Error

**Symptom:** 404 error when calling the A2A endpoint

**Causes:**
- Agent name mismatch between code and URL
- Agent not properly registered in Mastra

**Solution:**
```typescript
// In phishnet.ts, ensure:
export const phishnet = new Agent({
  name: 'phishnet', // ← Must match URL
  // ...
});

// In index.ts, ensure:
export const mastra = new Mastra({
  agents: { phishnet }, // ← Agent must be registered
});

// URL must be:
POST /a2a/agent/phishnet
```

---

#### Issue 2: Empty Responses on Telex

**Symptom:** Telex shows blank messages from PhishNet

**Cause:** Missing or incorrect `artifacts` array format

**Solution:**
```typescript
// Always return responses in this exact format:
res.json({
  artifacts: [{
    type: 'text',
    content: yourResponseText,
    title: 'PhishNet Analysis'
  }]
});

// Even for errors:
res.status(500).json({
  artifacts: [{
    type: 'text',
    content: 'Error message here',
    title: 'Error'
  }]
});
```

---

#### Issue 3: "GOOGLE_API_KEY is not defined"

**Symptom:** Error on startup about missing API key

**Solution:**
1. Ensure `.env` file exists in project root
2. Check `.env` contains: `GOOGLE_API_KEY=your_key`
3. Restart the server after adding `.env`
4. Verify the key is valid at https://aistudio.google.com/app/apikey

---

#### Issue 4: High Response Latency (>5 seconds)

**Symptoms:** Slow responses, timeouts

**Solutions:**

1. **Use Gemini Flash instead of Pro:**
```typescript
model: 'google/gemini-2.0-flash-exp' // Fast
// NOT: 'google/gemini-2.0-pro' // Slower but more capable
```

2. **Optimize detection patterns:**
```typescript
// Use efficient regex patterns
// Avoid nested loops where possible
```

3. **Add timeout handling:**
```typescript
const response = await Promise.race([
  agent.generate(message, { threadId }),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 30000)
  )
]);
```

---

#### Issue 5: Database Lock Errors

**Symptom:** `EBUSY: resource busy or locked` error with mastra.db

**Solution:**
```bash
# Stop all Node processes
taskkill /F /IM node.exe  # Windows
pkill node                # Mac/Linux

# Delete database files
rm .mastra/mastra.db*

# Restart server
npm run dev
```

---

#### Issue 6: Port Already in Use

**Symptom:** `EADDRINUSE: address already in use :::4111`

**Solution:**
```bash
# Find process using port 4111
lsof -i :4111          # Mac/Linux
netstat -ano | findstr :4111  # Windows

# Kill the process
kill -9 <PID>          # Mac/Linux
taskkill /PID <PID> /F # Windows

# Or use different port
PORT=4112 npm run dev
```

---

#### Issue 7: TypeScript Compilation Errors

**Symptom:** Build fails with type errors

**Solutions:**

1. **Install missing type definitions:**
```bash
npm install -D @types/node @types/express
```

2. **Clear build cache:**
```bash
rm -rf dist/
npm run build
```

3. **Check TypeScript version:**
```bash
npx tsc --version
# Should be 5.3+
```

---

#### Issue 8: Module Not Found Errors

**Symptom:** `Cannot find module '@mastra/core'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

---

### Debug Mode

Enable detailed logging:

```typescript
// In src/index.ts, add:
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});
```

---

## 🤝 Contributing

Contributions are welcome! This project was built for the HNG Internship, but improvements and bug fixes are always appreciated.

### How to Contribute

1. **Fork the repository**

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
- Follow existing code style
- Add tests for new features
- Update documentation

4. **Commit your changes**
```bash
git commit -m "Add: your feature description"
```

Use conventional commits:
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for improvements
- `Docs:` for documentation

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request**
- Describe what you changed and why
- Reference any related issues

### Development Guidelines

- **Code Style:** Follow existing TypeScript patterns
- **Testing:** Add tests for new detection patterns
- **Documentation:** Update README for new features
- **Commits:** Use clear, descriptive commit messages

### Areas for Improvement

- Machine learning integration for better accuracy
- Multi-language support
- Additional URL scanning APIs (VirusTotal, Safe Browsing)
- Browser extension for real-time protection
- Dashboard for analytics
- User feedback system

---

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 Yasmin Abdulrahman

