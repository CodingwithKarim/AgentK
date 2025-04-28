# AgentK
> Your multi-model AI control center

![image](https://github.com/user-attachments/assets/838f189d-09c1-4ba0-a972-e2c4c37730b7)

AgentK is an AI control center that unifies access to 7 major AI providers under one sleek, minimalistic interface. With AgentK, you can swap between models during chat sessions, manage multiple conversations at the same time, and interact with different AI providers individually or simultaneously — all without ever leaving the app.

Thanks to direct integration with provider APIs, you have the flexibility to use **hundreds of available models** across OpenAI, Anthropic, Groq, Gemini, Perplexity, Cohere, and Hugging Face. Whether you're prototyping ideas, performing research, or just exploring the capabilities of modern AI, AgentK makes it simple to experiment with the latest cutting edge AI models without spending money every month on expensive AI subscriptions. 


---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Keys](#api-keys)
- [Usage](#usage)
- [Advanced Features](#advanced-features)
- [Provider Documentation](#provider-documentation)
- [License](#license)

---

## Features
 🔹 **Multi-AI-Provider Support**  
  - OpenAI  
  - Anthropic (Claude)  
  - Groq  
  - Perplexity  
  - Cohere  
  - Google Gemini  
  - Hugging Face
  - Any OpenAI-compatible API endpoint (just specify the endpoint URL and use OpenAI as provider value in agentk_config.json)

 🔹 **Multi-Model Conversations**  
  Talk to multiple models simultaneously or one at a time. Compare responses across different models for the same prompt.

 🔹 **Dynamic Context Sharing**  
  Toggle shared context on/off between models. Let models see each other's responses or keep conversations isolated.

 🔹 **Dynamic Model Pulling**  
  Edit the `agentk_config.json` file to pull any model offered by your providers & enter API keys.

 🔹 **Secure API Key Management**  
  Store your keys locally; AgentK never commits secrets as it runs locally.

 🔹 **Session Control**  
  Create, switch, and delete named chat sessions.

 🔹 **Resource Optimization**  
  Control token usage and response length through model configurations.

---

## Prerequisites
- [Go 1.20+](https://golang.org/doc/install) (for the backend)  
- [Node.js 16+](https://nodejs.org/) & [npm](https://www.npmjs.com/) (for the frontend)

---

## Installation
1. **Clone this repo**  
   ```bash
   git clone https://github.com/your-username/AgentK.git
   cd AgentK
   ```
2. **Backend**  
   ```bash
   cd backend
   go mod tidy (optional)
   go run main.go
   ```
3. **Frontend**  
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` and enjoy.
   
---

## API Keys
**IMPORTANT**: You must sign up for API keys from each provider you wish to use: You won't be able to run inference otherwise since the request payload for all provider endpoints require it. Once you've grabbed your API keys, make sure to drop them into the AgentK_config.json file. You can skip this step for any providers you dont intend to use.

- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Anthropic API Keys](https://console.anthropic.com/settings/keys)
- [Groq API Keys](https://console.groq.com/keys)
- [Perplexity API Keys](https://www.perplexity.ai/settings/api)
- [Cohere API Keys](https://dashboard.cohere.com/api-keys)
- [Google AI API Keys](https://aistudio.google.com/app/apikey)
- [Hugging Face API Keys](https://huggingface.co/settings/tokens)

OpenAI and Claude allow you to create an API key for free; however, you cannot run inference on their models without purchasing API credits. Both platforms require a minimum payment of $5 to enable access. Perplexity also requires an upfront payment of at least $3 for API usage (in my opinion their Sonar models are underwhelming). 

The rest of the providers offer both free and paid tiers, allowing you to start interacting with models for free. Groq and Hugging Face stand out for their generous free-tier access and offer some of the most cost-effective API credits from what I've seen. Google Gemini also provides a great free tier with access to their powerful Gemini models which I've noticed has incredible response times & very large context size capabilities. 

---

## Configuration
1. Open `agentk_config.json` located at the project root folder.
2. Under the `"Providers"` section, enter your API keys for providers you would like access to:
   ```jsonc
   {
     "Providers": {
       "OpenAI":    { "apiKey": "YOUR_API_KEY" },
       "Anthropic": { "apiKey": "YOUR_API_KEY" },
       "Groq":      { "apiKey": "YOUR_API_KEY" },
       "Perplexity":{ "apiKey": "YOUR_API_KEY" },
       "Cohere":    { "apiKey": "YOUR_API_KEY" },
       "Google":    { "apiKey": "YOUR_API_KEY" },
       "HuggingFace": {"apiKey": "YOUR_API_KEY" }
     },
     "Models": {
       // Add model info here after consulting provider docs for proper configuration
       // Default models will be provided for you to use and follow as an example but you are expected to config your own models using the agentk_config.json file + appropriate API keys for access
       // If you don't have API keys set up for certain providers, do not include their modles in the config file as they will be unaccessible. 
       // Model info can be found under provider docs  (see below)
     }
   }
   ```
3. Under `"Models"`, list any model IDs you wish to use. Example:
   ```jsonc
   "Models": {
     "gpt-4o-2024-08-06": {
       "id": "gpt-4o-2024-08-06", // the ID property needs to match the key, see default models for example
       "name": "GPT-4o", // model name you would like to use, can be custom
       "provider": "OpenAI", // AI provider, see options above
       "endpoint": "https://api.openai.com/v1/chat/completions", // API endpoint, see provider docs for URL endpoints (see curl example)
       "contextSize": 128000, // Total available context (prompt + history) for the model per request. Affects API costs. Adjustable. See provider documentation.
       "maxCompletionTokens": 16384 // Maximum size of the model's response. Also impacts API costs. Adjustable. See provider documentation.
     },
     // ...more models
   }
   ```

---

## Usage
1. **Start the backend**  
   ```bash
   cd backend
   go mod tidy (optional)
   go run main.go
   ```
2. **Start the frontend**  
   ```bash
   cd ../frontend
   npm run dev
   ```
3. Open your browser to `http://localhost:5173` and enjoy.

### Using Multi-Model Chat
1. Create a new session by clicking the "+" button
2. Toggle "Shared Context" on to allow models to see each other's responses
3. Select multiple models from the dropdown menu
4. Type your prompt and see how different models respond
5. Toggle models on/off during the conversation to control which ones respond

---

## Advanced Features

### Multi-Model Conversations

AgentK allows you to:

1. **Compare Responses**: Ask the same question to multiple models simultaneously
2. **Chain Conversations**: Let one model build on another's response
3. **Isolate Conversations**: Toggle shared context off to keep model conversations separate

### Context Size Management

AgentK allows you to control how much of the conversation history is sent to the model. By default Context Size and Max Completion Tokens are set to highest value possible according to provider docs. Feel free to play around with these values but make sure to monitor.

1. **Context Size**: The `contextSize` parameter in your model configuration controls the maximum number of tokens used for the conversation history. This helps manage resource usage and API costs.

2. **Max Completion Tokens**: The `maxCompletionTokens` parameter limits how many tokens the model can generate in response. If not specified, AgentK uses a reasonable default based on the model's capabilities.

### Resource Optimization

Create different variants of models with adjusted context sizes and response limits:

```jsonc
"llama-3.3-70b-economy": {
  "id": "llama-3.3-70b-economy",
  "name": "LLaMA 3.3 (Economy)",
  "provider": "Groq",
  "endpoint": "https://api.groq.com/openai/v1/chat/completions",
  "contextSize": 32000,        // Reduced from 128000
  "maxCompletionTokens": 8192  // Reduced from 32768
}
```

This allows users to choose the resource profile that best fits their needs, balancing performance with efficiency.

---

## Provider Documentation
Pull model IDs from any of these sources:
- 🔹 [OpenAI Models](https://platform.openai.com/docs/models)  
- 🔹 [Anthropic Claude Models](https://docs.anthropic.com/en/docs/about-claude/models/all-models)  
- 🔹 [Groq Models](https://console.groq.com/docs/models)  
- 🔹 [Perplexity Models](https://docs.perplexity.ai/models/model-cards)  
- 🔹 [Cohere Models](https://docs.cohere.com/v1/docs/models)  
- 🔹 [Google Gemini API Models](https://ai.google.dev/gemini-api/docs/models)  
- 🔹 [Hugging Face Chat-Completion](https://huggingface.co/docs/inference-providers/tasks/chat-completion)  

---

## License
This project is licensed under the **MIT License**. See [here](https://mit-license.org/) for details.
