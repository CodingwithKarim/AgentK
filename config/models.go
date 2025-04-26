package config

import (
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

// Object key must be quivalent to object ID property for proper sync
// Add any GPT / Claude models you would like, just ensure info like context size and ID are retrieved from official websites.
// Name can be custom
var ModelConfigRegistry = map[string]*types.ModelConfig{
	"gpt-4o-mini-2024-07-18": {
		ID:          "gpt-4o-mini-2024-07-18",
		Name:        "GPT-4o Mini",
		Provider:    utils.OPENAI,
		Endpoint:    "https://api.openai.com/v1/chat/completions",
		APIKeyEnv:   "OPENAI",
		ContextSize: 128000,
	},
	"gpt-4.1-nano-2025-04-14": {
		ID:          "gpt-4.1-nano-2025-04-14",
		Name:        "GPT-4.1 Nano",
		Provider:    utils.OPENAI,
		Endpoint:    "https://api.openai.com/v1/chat/completions",
		APIKeyEnv:   "OPENAI",
		ContextSize: 1000000,
	},
	"claude-3-5-haiku-20241022": {
		ID:          "claude-3-5-haiku-20241022",
		Name:        "Claude 3.5 Haiku",
		Provider:    utils.ANTHROPIC,
		Endpoint:    "https://api.anthropic.com/v1/messages",
		APIKeyEnv:   "CLAUDE",
		ContextSize: 200000,
	},
	"claude-3-7-sonnet-20250219": {
		ID:          "claude-3-7-sonnet-20250219",
		Name:        "Claude 3.7 Sonnet",
		Provider:    utils.ANTHROPIC,
		Endpoint:    "https://api.anthropic.com/v1/messages",
		APIKeyEnv:   "CLAUDE",
		ContextSize: 200000,
	},
	"llama3-8b-8192": {
		ID:          "llama3-8b-8192",
		Name:        "LLaMA 3",
		Provider:    utils.GROQ,
		ContextSize: 8192,
		Endpoint:    "https://api.groq.com/openai/v1/chat/completions",
		APIKeyEnv:   "GROQ",
	},
	"gemma2-9b-it": {
		ID:          "gemma2-9b-it",
		Name:        "Gemma2",
		Provider:    utils.GROQ,
		ContextSize: 8192,
		Endpoint:    "https://api.groq.com/openai/v1/chat/completions",
		APIKeyEnv:   "GROQ",
	},
	"mistral-saba-24b": {
		ID:          "mistral-saba-24b",
		Name:        "Mistral-Saba",
		Provider:    utils.GROQ,
		ContextSize: 128000,
		Endpoint:    "https://api.groq.com/openai/v1/chat/completions",
		APIKeyEnv:   "GROQ",
	},
	"sonar-pro": {
		ID:          "sonar-pro",
		Name:        "Sonar-Pro",
		Provider:    utils.PERPLEXITY,
		Endpoint:    "https://api.perplexity.ai/chat/completions",
		APIKeyEnv:   "PERPLEXITY",
		ContextSize: 200000,
	},
	"r1-1776": {
		ID:          "r1-1776",
		Name:        "Deepseek-r1-unbiased",
		Provider:    utils.PERPLEXITY,
		Endpoint:    "https://api.perplexity.ai/chat/completions",
		APIKeyEnv:   "PERPLEXITY",
		ContextSize: 128000,
	},
	"command-r": {
		ID:          "command-r",
		Name:        "Command-R",
		Provider:    utils.COHERE,
		Endpoint:    "https://api.cohere.com/v2/chat",
		APIKeyEnv:   "COHERE",
		ContextSize: 128000,
	},
	"gemini-2.0-flash-lite": {
		ID:          "gemini-2.0-flash-lite",
		Name:        "Gemini 2.0 Flash",
		Provider:    utils.GOOGLE,
		Endpoint:    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
		APIKeyEnv:   "GEMINI",
		ContextSize: 1000000,
	},
	"microsoft/phi-4": {
		ID:          "microsoft/phi-4",
		Name:        "Microsoft Phi-4",
		Provider:    utils.HUGGINGFACE,
		Endpoint:    "https://router.huggingface.co/nebius/v1/chat/completions",
		APIKeyEnv:   "HUGGINGFACE",
		ContextSize: 128000,
	},
	"accounts/fireworks/models/deepseek-v3-0324": {
		ID:          "accounts/fireworks/models/deepseek-v3-0324",
		Name:        "Deepseek-V3",
		Provider:    utils.HUGGINGFACE,
		Endpoint:    "https://router.huggingface.co/fireworks-ai/inference/v1/chat/completions",
		APIKeyEnv:   "HUGGINGFACE",
		ContextSize: 128000,
	},
}
