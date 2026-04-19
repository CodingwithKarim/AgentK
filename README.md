<h1 align="center">AgentK</h1>
<p align="center"><i>Your fully customizable multi-model AI control center</i></p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/eb50ddde-bb35-4e0e-8759-a5e78dc2cedc" alt="AgentK UI"/>
</p>

---

AgentK is a lightweight AI control center that lets you interact with a multitude of AI providers and all of their available models inside a clean and minimalistic interface.

You can swap between models in real time, compare responses, delete or resubmit messages to refine context, customize token usage, and shape conversations exactly how you want, all without leaving the app.

AgentK communicates directly with AI provider APIs and instantly loads every available model. This gives you unified access to models from OpenAI, Anthropic, xAi, Groq, Gemini, Perplexity, Cohere, and cloud-based providers such as DeepInfra, OpenRouter, and HuggingFace, all in one place.

All you need is an API key for the providers you want to use and you're ready to rumble.

---

## Quick Start

```bash
git clone https://github.com/CodingwithKarim/AgentK.git
cd AgentK

# Generate your .env file and add API keys
cp .env.example .env            # macOS & Linux
Copy-Item .env.example .env     # Windows PowerShell

# Launch AgentK
docker compose up
```

Then open in your browser:

```
http://localhost:8080
```

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running with HTTPS](#running-with-https)
- [API Keys](#api-keys)
- [Technical Overview](#technical-overview)
- [Philosophy](#philosophy)
- [Limitations](#limitations)
- [Find Model IDs](#find-model-ids)
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
- Fetch models directly from provider APIs & reload model lists from UI 
- Search and filter models instantly  
- Enable or disable models for visibility control  
- Assign custom aliases to any model  
- Manually add missing or custom models   
- Bulk enable/disable models (e.g., "Enable All" & "Disable All")
- Models are dynamically sorted with enabled models shown first

---

#### Real-Time Model Switching
- Seamlessly switch between providers and models in a single interface  
- Swap models instantly without interrupting your conversation  
- Test and compare prompts across multiple models in one workflow  

---

#### Conversation Tools
- Create, switch, rename, and delete chat sessions  
- Compare responses across models by resubmitting with a different model  
- Edit conversation context by deleting or resubmitting messages  
- Control maximum completion tokens per request

---

#### Multimodal Image Inputs
- Combine text and image inputs in a single prompt
- Attach images from local file storage
- Reference images via absolute URLs hosted on web
- Paste images directly from the clipboard (screenshot support)
- Automatic provider-specific image handling

---

#### Smart Context Control
- Toggle between shared and isolated conversation modes  
- Shared mode allows models to reference previous messages and compare responses  
- Isolated mode keeps each model in an independent conversation  
- Clear context per model or per session as needed

#### System Prompt Customization
- Define a global system prompt to control model behavior, tone, and response style  
- Apply consistent instructions across all conversations and models  
- Easily update the system prompt to experiment with different behaviors  

---

## Prerequisites

You can run AgentK using Docker (recommended) or manually.

#### Option A — Docker (Preferred)
Make sure you have:
- Docker installed

#### Option B / C - Manual Setup (Single Server / Development Mode)
If not using Docker, you'll need:
- [Go](https://go.dev/)
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (for frontend build and development)
- [Caddy](https://caddyserver.com/) (optional, for HTTPS support)


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
AgentK can be launched in three ways:

| Setup Method  | Best For | Difficulty |
|----------------|----------------------------|-------------|
| **Docker (Recommended)** | Fast setup & production use | ⭐ Easy |
| **Manual (Single Server)** | Minimal setup with one server running frontend + backend | ⚙️ Easy |
| **Manual (Development Mode)** | Active frontend/backend development mode with two servers for frontend + backend | 🛠️ Medium |

---

### Option A — Run with Docker (Fastest Setup)

Make sure **the Docker service is running** before executing the commands below.

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/CodingwithKarim/AgentK.git
cd AgentK
```

#### 2️⃣ Start the container

```bash
docker compose up
```

#### 3️⃣ Open AgentK in your browser and enjoy

[http://localhost:8080](http://localhost:8080)

#### 🔄 (Optional) Rebuild & reset cache

Use this if dependencies change or you update the codebase:

```bash
docker compose up --build
```

---

### Option B — Manual Setup (Single Server Mode)

Use this if you want a simple local setup without Docker, while still running a single server.

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/CodingwithKarim/AgentK.git
cd AgentK
```

#### 2️⃣ Download frontend dependencies and build frontend

```bash
# Navigate back to frontend directory from root AgentK directory
cd .. frontend

# Install dependencies
npm install

# Generate a frontend build for backend to serve at root /
npm run build
```

#### 3️⃣ Run the backend server

```bash
# Navigate to root AgentK directory
cd AgentK

# Run server (will serve frontend at /)
go run main.go
```

Then open your browser and enjoy:

[http://localhost:8080](http://localhost:8080)

---

### Option C — Manual Setup (Dual Server Mode for Active Development)

Use this for live frontend development with hot reload (Vite) while the Go API runs separately.

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/CodingwithKarim/AgentK.git
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

[http://localhost:5173](http://localhost:5173)

---

##### API Keys Reminder

Before running AgentK, make sure your `.env` file is set up correctly.  
Check the **Environment Variables** section above for details.

> 💡 You only need keys for the providers you actually plan to use.

---

## Running with HTTPS
AgentK can be served over HTTPS using [Caddy](https://caddyserver.com/), a modern web server that automatically manages & generates TLS certificates. If you plan to use AgentK outside of a home or private network, you must use [Caddy](https://caddyserver.com/) (or another reverse proxy with TLS) to encrypt your data. Otherwise, someone on the same network (e.g., a public café Wi-Fi) could intercept your traffic and view sensitive data such as your API keys.

### Option A - HTTPS with Docker

#### 1️⃣ Start the Docker containers
```bash
# Run base app container along with caddy container
docker compose -f docker-compose.yml -f docker-compose-caddy.yml up

# Copy TLS certificate from Docker container to local computer
docker cp agentk-caddy:/data/caddy/pki/authorities/local/root.crt .
```

#### 2️⃣ Install the TLS certificate
Open and install the `root.crt` certificate to trust it on your system.

Follow common instructions for installing TLS certificate depending on your OS:

- Windows: Run `.\root.crt` or Double-click → Install Certificate → Local Machine → Place all certificates in the following store → Trusted Root Certification Authorities
- macOS: Open Keychain Access → import → set to “Always Trust”
- Linux: Move the certificate and update trust store:
```bash
sudo cp root.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

> If you struggle with this section, you can easily Google or use AI to complete this step (just send this entire section to AI and it will guide you)

Then open your browser and enjoy:

[https://localhost](https://localhost)

### Option B - HTTPS with Manual Setup

#### 1️⃣ Install [Caddy](https://caddyserver.com/)
Download and install [Caddy](https://caddyserver.com/download) for your system. You can also use a package manager if available to you.

```bash
# macOS (Homebrew)
brew install caddy

# Linux (Debian/Ubuntu)
sudo apt install caddy
``` 

#### 2️⃣ Run Caddy Server
Navigate to where Caddy Server file is located and run the server (assuming you are in AgentK directory).

```bash
# Windows
caddy run or .\caddy run

# macOS or Linux
./caddy run
```

If Caddy is run from the same directory as the `Caddyfile`, it will be detected automatically. If running from a different directory, specify the config file:
```bash
# e.g:
caddy run --config C:\code\AgentK\Caddyfile
```

> It is recommended to add Caddy to your system PATH so you can run it from any directory including the AgentK root directory.

#### 3️⃣ Continue with Manual Setup like normal (see above for full instructions)

Single Server Mode
```bash
npm install
npm run build

go run main.go
```

Development Mode
```bash
npm install
npm run dev

go run main.go
```

Then open your browser and enjoy:

[https://localhost](https://localhost)

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

| Component   | Technology                          | Purpose                                             |
|-------------|-------------------------------------|-----------------------------------------------------|
| Frontend    | React + Tailwind + Vite             | Renders the UI and handles user input               |
| Backend     | Go                                  | Processes requests and interacts with provider APIs |
| Storage     | IndexedDB (browser/local only)      | Saves message, session, and model data locally      |
| Deployment  | Docker / Manual Go + Vite setup     | Runs the full stack on the user's machine           |


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

#### Context Handling
- There is no backend system to detect token limits or manage context size.
- Users must manually manage context by deleting or resubmitting messages (preferred method).

---

### Summary
⚠ There is no automatic context management. Users must manually trim messages  
⚠ Model filtering is best effort only and some models may not work as expected if they aren't chat based models

---

## Find Model IDs
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
- 🔹 [Hugging Face Cloud Inference Providers](https://huggingface.co/docs/inference-providers/index)  

---

## License
This project is licensed under the **MIT License**. See [here](https://mit-license.org/) for details.
