package llms

import (
	"github.com/CodingWithKarim/AgentK/internal/llms/anthropic"
	"github.com/CodingWithKarim/AgentK/internal/llms/openaicompatible"
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	anthropicSDK "github.com/anthropics/anthropic-sdk-go"
	openaiSDK "github.com/openai/openai-go"
)

type LLMClient interface {
	Chat(request *types.ChatRequest, context any) (string, error)
	Models() ([]*types.Model, error)
}

var Clients map[types.Provider]LLMClient

func InitializeClients(openAIClient *openaiSDK.Client, anthropicClient *anthropicSDK.Client) {
	Clients = make(map[types.Provider]LLMClient, len(utils.OpenAICompatibleProviders)+1) // +1 for Anthropic

	if key := utils.GetKey(utils.ANTHROPIC); key != "" {
		Clients[utils.ANTHROPIC] = &anthropic.AnthropicClient{
			Client: anthropicClient,
		}
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
