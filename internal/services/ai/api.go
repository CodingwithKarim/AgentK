package ai

import (
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func CallOpenAI(model string, modelConfig *types.ModelConfig, messages []types.APIMessage, maxTokens int) (string, error) {
	// Create API client
	client := NewOpenAIClient(modelConfig)

	// Create request payload
	payload := types.ChatRequestPayload{
		Model:     model,
		Messages:  messages,
		MaxTokens: maxTokens,
	}

	// Send request and return response
	return client.SendRequest(payload, ExtractOpenAIResponseText)
}

func CallClaude(model string, modelConfig *types.ModelConfig, messages []types.APIMessage, maxTokens int) (string, error) {
	// Create API client
	client := NewClaudeClient(modelConfig)

	// Create request payload
	payload := types.ChatRequestPayload{
		Model:     model,
		Messages:  messages,
		MaxTokens: maxTokens,
	}

	// Send request and return response
	return client.SendRequest(payload, ExtractClaudeResponseText)
}

func CallCohereV2(model string, modelConfig *types.ModelConfig, messages []types.APIMessage, maxTokens int) (string, error) {
	// Create API client
	client := NewCohereClient(modelConfig)

	// Create request payload
	payload := types.ChatRequestPayload{
		Model:     model,
		Messages:  messages,
		MaxTokens: maxTokens,
	}

	// Send request and return response
	return client.SendRequest(payload, ExtractCohereResponseText)
}
