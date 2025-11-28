<h1 align="center">AgentK</h1>
<p align="center"><i>Your multi-model AI control center</i></p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/eb50ddde-bb35-4e0e-8759-a5e78dc2cedc" alt="AgentK UI"/>
</p>

---

AgentK is a lightweight AI control center that lets you interact with a multitude of AI providers and all of their available models inside a clean and minimalistic interface.

You can swap between models in real time, compare responses, delete or resubmit messages to refine context, customize token usage, and shape conversations exactly how you want, all without leaving the app.

AgentK communicates directly with AI provider APIs and instantly loads every available model. This gives you unified access to models from OpenAI, Anthropic, xAi, Groq, Gemini, Perplexity, Cohere, and cloud-based providers such as DeepInfra, OpenRouter, and HuggingFace, all in one place.

All you need is an API key for the providers you want to use and you're ready to rumble.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Keys](#api-keys)
- [Technical Overview](#technical-overview)
- [Philosophy](#philosophy)
- [Limitations](#limitations)
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

#### Model Management
- Fetch models directly through provider APIs  
- Reload provider model lists at any time  
- Enable or disable models for visibility control 
- Assign custom aliases to any model
- Manually add missing or custom models
- Adjust token limits and generation settings per model

---

#### Real Time Model Switching
- Use different providers and models inside the same interface
- Swap models instantly without leaving the conversation
- Test prompts across multiple models in a single workflow

---

#### Conversation Tools
- Start, switch, rename and delete chat sessions  
- Compare responses from different models  
- Delete or resubmit messages to edit conversation context  
- Customize max completion tokens per request

---

#### Smart Context Control
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

AgentK can be launched in two ways:

| Setup Method  | Best For | Difficulty |
|----------------|----------------------------|-------------|
| **Docker (Recommended)** | Fast setup & production use | ⭐ Easy |
| **Manual (Development Mode)** | Local development & debugging | ⚙️ Medium |

---

### Option A — Run with Docker (Fastest Setup)

Make sure **the Docker service is running** before executing the commands below.

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/AgentK.git
cd AgentK
```

#### 2️⃣ Start the container

```bash
docker compose up
```

#### 3️⃣ Open AgentK in your browser and enjoy

```
http://localhost:8080
```


#### 🔄 (Optional) Rebuild & reset cache

Use this if dependencies change or you update the codebase:

```bash
docker compose up --build
```

> Docker automatically runs both the backend and frontend so no manual setup required.

---

### Option B — Manual Setup (For Development Purposes)

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/AgentK.git
cd AgentK
```

#### 2️⃣ Start the backend server (Go API)

```bash
go mod tidy
go run main.go
```

#### 3️⃣ Start the frontend server (React / Vite)

```bash
cd frontend
npm install
npm run dev
```

Then open your browser and enjoy:

```
http://localhost:5173
```

---

##### API Keys Reminder

Before running AgentK, make sure your `.env` file is set up correctly.  
Check the **Environment Variables** section above for details.

> 💡 You only need keys for the providers you actually plan to use.

---

## API Keys

AgentK requires API keys to communicate with AI providers. Once you have your keys, place them in your `.env` file (see the **Environment Variables** section).

You only need keys for providers you actually plan to use.

---

### Where to Get API Keys

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

#### ⭐ Recommended Providers to Start With
- **Groq** → generous free tier and fast inference
- **Hugging Face** → one API key unlocks hundreds of models and access to multiple hosted providers
- **OpenRouter / DeepInfra** → cloud providers with unified access to many hosted models across providers
- **OpenAI / Anthropic / Gemini** → mainstream premium providers

---

## Technical Overview

AgentK is a unified local server that provides both the frontend UI and backend API. It runs entirely on the user’s machine

### Architecture Overview

| Component   | Technology                          | Purpose                                    |
|-------------|-------------------------------------|--------------------------------------------|
| Frontend    | React + Tailwind + Vite             | Renders the UI and handles user input      |
| Backend     | Go (REST API)                       | Processes requests and interacts with APIs |
| Storage     | IndexedDB (browser/local only)      | Saves sessions and model data locally      |
| Deployment  | Docker / Manual Go + Vite setup     | Runs the full stack on the user's machine  |

All data stays on the user’s computer. No third-party servers owned by AgentK receive any data.

---

### The Bus Analogy

Think of AgentK as a school.  
It does not teach its own lessons or host its own models.  
Instead, it has a **bus system**:

- The UI is the **school**.
- The backend server is the **bus**.
- Each provider is **a different school** with its own teachers and subjects (models).
- When a model is requested, AgentK sends its bus to that school, retrieves the lesson, and returns it to the AgentK classroom (the UI).

To avoid losing information, AgentK stores data locally using **IndexedDB**, which acts as its own school library.

Some providers such as **OpenRouter**, **DeepInfra**, and **HuggingFace** operate bus networks rather than traditional schools. They do not provide the lesson directly. Instead, they forward the bus to the real school that hosts the model. AgentK sends its bus to their network, and they continue the trip to the correct destination.

---

### Unified Client System

AgentK communicates with all providers using just **two SDK clients**:

- **Anthropic SDK**
- **OpenAI SDK** — used by all providers that follow the OpenAI-style `/chat/completions` format.  
  In practice, every provider except Anthropic is handled through this client.

AgentK is built with a minimal and focused integration layer. Every provider follows a single interface and is powered by only two SDK clients. 
```go
type LLMClient interface {
    Chat(request *types.ChatRequest, context any) (string, error)
    Models() ([]*types.Model, error)
}


var Clients map[types.Provider]LLMClient

func InitializeClients(openAIClient *openaiSDK.Client, anthropicClient *anthropicSDK.Client) {
    Clients = make(map[types.Provider]LLMClient, len(utils.OpenAICompatibleProviders)+1)

    if key := utils.GetKey(utils.ANTHROPIC); key != "" {
        Clients[utils.ANTHROPIC] = &anthropic.AnthropicClient{ Client: anthropicClient }
    }

    for _, provider := range utils.OpenAICompatibleProviders {
        if key := utils.GetKey(provider); key != "" {
            Clients[provider] = &openaicompatible.OpenAIClient{
                Provider: provider,
                Client:   openAIClient,
                Key:      key,
            }
        }
    }
}
```

This keeps the backend lightweight, avoids provider-specific code, and makes future integrations straightforward.  
In short, AgentK speaks many languages using only two translators.

---

## Philosophy

AgentK was created from a simple frustration: working with multiple AI providers should not require separate subscriptions, different apps, and endless context switching.

At first, using OpenAI and Anthropic meant two separate subscriptions and two separate interfaces. Sharing context between them was impossible. As new models from Google, xAI, DeepSeek, Moonshot and others appeared, it became clear that the AI ecosystem was growing quickly but access to it remained fragmented, expensive, and locked behind individual provider silos. The more AI progressed, the less accessible it became.

As developers, we know that all major providers expose hosted APIs. However, an API alone is not enough. Most people cannot build a custom frontend for every model, and even developers typically use these APIs only to add AI features to other projects rather than use them as a true workspace.

This led to one clear conclusion.

AgentK exists to fix that.

It is built as a local control center that connects to all providers and all models through a single unified interface. It removes the cost and friction of switching between platforms and separates providers from their locked-in environments. With AgentK, conversations can share context across models, be manually edited, or be resubmitted to compare responses directly.

**The idea is simple:**  
> No one should be locked into a single provider.  
> You should be able to access every model in one place, on your own device.

AgentK gives control back to the user. It turns provider APIs into a practical workspace rather than isolated environments. It is built to unify how we interact with AI instead of forcing us to choose sides.

---

## Limitations

#### Model Fetching
- AgentK retrieves all models from provider `/models` endpoints (800+ across 10 providers).
- It attempts to detect chat-compatible models and disables others by default.
- Some valid chat models may still be filtered out or fail to work.
- Provider model metadata is inconsistent, so filtering is best effort only.

#### Context Handling
- Conversation context is not automatically trimmed or summarized.
- There is no backend system to detect token limits or manage context size.
- Users must manually manage context by deleting or resubmitting messages.

#### Conversation Input Support
- Only text-based chat models are supported.
- Image, audio, and file-based inputs are not supported in conversations.
- Attachments are ignored, and all interactions must be text only.

---

### Summary

✔ AgentK supports **text-based chat models only**  
⚠ Image, audio, and file inputs are **not supported**  
⚠ There is no automatic context management. Users must manually trim messages  
⚠ Model filtering is best effort only and some models may not work as expected

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
