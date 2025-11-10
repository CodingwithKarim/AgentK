package utils

import "github.com/CodingWithKarim/AgentK/internal/utils/types"

const (
	OPENAI      types.Provider = "OpenAI"
	ANTHROPIC   types.Provider = "Anthropic"
	GOOGLE      types.Provider = "Google"
	xAI         types.Provider = "xAI"
	GROQ        types.Provider = "Groq"
	PERPLEXITY  types.Provider = "Perplexity"
	COHERE      types.Provider = "Cohere"
	HUGGINGFACE types.Provider = "HuggingFace"
	OPENROUTER  types.Provider = "OpenRouter"
	DEEPINFRA   types.Provider = "DeepInfra"
)

var Providers = []types.Provider{
	OPENAI, ANTHROPIC, GOOGLE, xAI, GROQ,
	PERPLEXITY, COHERE, HUGGINGFACE, OPENROUTER, DEEPINFRA,
}

var ProviderEndpointsMap = map[types.Provider]types.ProviderEndpoints{
	OPENAI: {
		BaseURL: "https://api.openai.com/v1",
	},
	ANTHROPIC: {
		BaseURL:       "https://api.anthropic.com/v1/messages",
		ModelEndpoint: "https://api.anthropic.com/v1/models",
	},
	GOOGLE: {
		BaseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
	},
	xAI: {
		BaseURL: "https://api.x.ai/v1",
	},
	GROQ: {
		BaseURL: "https://api.groq.com/openai/v1",
	},
	COHERE: {
		BaseURL:       "https://api.cohere.ai/compatibility/v1",
		ModelEndpoint: "https://api.cohere.ai/v1",
	},
	PERPLEXITY: {
		BaseURL: "https://api.perplexity.ai",
	},
	OPENROUTER: {
		BaseURL: "https://openrouter.ai/api/v1",
	},
	DEEPINFRA: {
		BaseURL: "https://api.deepinfra.com/v1/",
	},
	HUGGINGFACE: {
		BaseURL: "https://router.huggingface.co/v1",
	},
}

var PerplexityModels = []string{"sonar", "sonar-pro", "sonar-reasoning", "sonar-reasoning-pro", "sonar-deep-research"}

var DisallowedModels = []string{
	"embed",
	"embedding",
	"davinci",
	"babbage",
	"sora-",
	"rerank",
	"search",
	"vector",
	"image",
	"vision",
	"dall",
	"diffuse",
	"stable",
	"audio",
	"voice",
	"speech",
	"tts",
	"asr",
	"transcribe",
	"whisper",
	"moderation",
	"safety",
	"guard",
	"shield",
	"filter",
	"realtime",
	"rt",
	"live",
	"batch",
	"distill",
	"codex",
	"codegen",
	"code-llama",
	"veo-",
}
