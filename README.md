<div align="center">
  
# AgentK  
> Your multi-model AI control center  

</div>

<img width=100% height=50% alt="image" src="https://github.com/user-attachments/assets/eb50ddde-bb35-4e0e-8759-a5e78dc2cedc" />




AgentK is a lightweight AI control center that lets you interact with multiple AI providers and all of their available models inside a clean and minimalistic interface.

You can swap between models in real time, compare responses, delete or resubmit messages to refine context, customize token usage, and shape conversations exactly how you want, all without leaving the app.

AgentK communicates directly with AI provider APIs and instantly loads every available model. This gives you unified access to models from OpenAI, Anthropic, Groq, Gemini, Perplexity, Cohere, Hugging Face and cloud-based providers such as DeepInfra, xAI and OpenRouter, all in one place.

AgentK runs entirely on your device using local storage, giving you full control over your data. All you need is an API key from the provider you choose. Once the key is added, AgentK automatically retrieves all available models and is ready to use. It offers simultaneous access to multiple providers while helping you avoid costly and separate AI subscriptions.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Keys](#api-keys)
- [Usage](#usage)
- [Provider Documentation](#provider-documentation)
- [License](#license)

---

## Features

### Supported providers
- OpenAI  
- Anthropic
- Google Gemini
- xAI (Grok)
- Groq  
- Perplexity  
- Cohere  
- DeepInfra (cloud provider)  
- OpenRouter (cloud provider)  
- Hugging Face (cloud + custom inference providers)  

---

### Model Management
- Fetch models directly through provider APIs  
- Reload provider model lists at any time  
- Enable or disable models for visibility control 
- Assign custom aliases to any model
- Manually add missing or custom models
- Adjust token limits and generation settings per model

---

### Real Time Model Switching
- Use different providers and models inside the same interface
- Swap models instantly without leaving the conversation
- Test prompts across multiple models in a single workflow

---

### Conversation Tools
- Start, switch, rename and delete chat sessions  
- Compare responses from different models  
- Delete or resubmit messages to edit conversation context  
- Customize max completion tokens per request

---

### Smart Context Control
- Choose whether models share the same conversation or stay fully separate
- Shared mode lets models reference earlier messages and compare responses
- Isolated mode keeps each model in its own independent conversation

---

## Prerequisites

You can run AgentK using Docker (recommended) or manually.

#### Option A — Docker (Preferred)
Make sure you have:
- Docker installed

#### Option B — Manual Setup
If not using Docker, you'll need:
- Go
- Node.js and npm

### Environment Variables

AgentK requires a `.env` file in the root directory.

A `.env.example` file is already included in the repository.  

You can either:

1. **Create your own `.env` file** and use `.env.example` as a reference  
2. **Or rename `.env.example` to `.env`** and fill in your API keys directly

Add API keys for providers you plan to use:

```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
XAI_API_KEY=
PERPLEXITY_API_KEY=
COHERE_API_KEY=
DEEPINFRA_API_KEY=
OPENROUTER_API_KEY=
```
---

## Installation

### Option A — Run with Docker (Recommended)

```bash
git clone https://github.com/your-username/AgentK.git
cd AgentK

docker compose up
```

Then open your browser at:

```
http://localhost:8080
```

---

### Option B — Manual Setup (Development Mode)

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/AgentK.git
cd AgentK
```

#### 2. Start the backend

```bash
go mod tidy
go run main.go
```

#### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Then open your browser at:

```
http://localhost:5173
```

---

### 🔑 API Keys Reminder

Make sure your `.env` file is set up before running the app (see **Environment Variables** section above).

---

## API Keys

AgentK requires API keys to communicate with AI providers.  

Once you have your keys, place them in your `.env` file  
(see the **Environment Variables** section).

You only need keys for providers you actually plan to use.

---

### 🔑 Where to Get API Keys

| Provider        | Get API Key |
|-----------------|-------------|
| OpenAI          | https://platform.openai.com/api-keys        |
| Anthropic       | https://console.anthropic.com/settings/keys |
| xAI             | https://console.x.ai/                       |
| Groq            | https://console.groq.com/keys               |
| Perplexity      | https://www.perplexity.ai/settings/api      |
| Cohere          | https://dashboard.cohere.com/api-keys       |
| Google Gemini   | https://aistudio.google.com/app/apikey      |
| OpenRouter      | https://openrouter.ai/settings/keys         |
| DeepInfra       | https://deepinfra.com/dash/api_keys         |
| Hugging Face    | https://huggingface.co/settings/tokens      |

---

### ⭐ Recommended Providers to Start With
- **Groq** → generous free tier and fast inference
- **Hugging Face** → one API key unlocks hundreds of models and access to multiple hosted providers
- **OpenRouter / DeepInfra** → cloud providers with unified access to many hosted models across providers
- **OpenAI / Anthropic / Gemini** → mainstream premium providers

---

## Usage

### Start a Chat
1. Click **+ New Session**
2. Select a provider and model
3. Type a prompt and start chatting

---

### Share or Isolate Context
You can choose how models interact with the conversation:
- **Shared Context** → models can reference all previous messages in the session  
- **Isolated Context** → each model responds independently with its own context

---

### Click a Message To:
- Delete it from context  
- Resubmit it using a different model  
- Compare responses across multiple models  

---

### Settings
- Refresh provider models to pull the latest available list  
- Enable or disable models to control which ones appear in the UI  
- Manually add models that were not returned by the API  
- Assign custom aliases to both new and existing models for easier readability 
- Customize max completion tokens to control response length and cost

---

## Provider Documentation
Pull model IDs from any of these sources:
- 🔹 [OpenAI Models](https://platform.openai.com/docs/models)  
- 🔹 [Anthropic Models](https://docs.anthropic.com/en/docs/about-claude/models/all-models)
- 🔹 [Google Gemini Models](https://ai.google.dev/gemini-api/docs/models)    
- 🔹 [xAI Models](https://docs.x.ai/docs/models)
- 🔹 [Groq Models](https://console.groq.com/docs/models)  
- 🔹 [Perplexity Models](https://docs.perplexity.ai/models/model-cards)  
- 🔹 [Cohere Models](https://docs.cohere.com/v1/docs/models)  
- 🔹 [OpenRouter Models](https://openrouter.ai/models)  
- 🔹 [DeepInfra Models](https://deepinfra.com/models)  
- 🔹 [Hugging Face Models](https://huggingface.co/models?inference_provider=all)
- 🔹 [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/index)  

---

## License
This project is licensed under the **MIT License**. See [here](https://mit-license.org/) for details.
