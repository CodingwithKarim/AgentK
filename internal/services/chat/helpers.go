package chatservice

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/CodingWithKarim/AgentK/internal/config"
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/openai/openai-go"
)

func parseContext(provider types.Provider, raw json.RawMessage) (any, error) {
	switch provider {
	case utils.ANTHROPIC:
		var msgs []anthropic.MessageParam
		if err := json.Unmarshal(raw, &msgs); err != nil {
			return nil, fmt.Errorf("invalid Anthropic context: %w", err)
		}
		return msgs, nil

	default:
		var msgs []openai.ChatCompletionMessageParamUnion
		if err := json.Unmarshal(raw, &msgs); err != nil {
			return nil, fmt.Errorf("invalid OpenAI-compatible context: %w", err)
		}
		return msgs, nil
	}
}

func getProviderConfig(provider types.Provider) (*types.ProviderConfig, error) {
	config.ProviderConfigsMu.RLock()
	defer config.ProviderConfigsMu.RUnlock()
	pconf, ok := config.ProviderConfigs[provider]
	if !ok {
		return nil, fmt.Errorf("unknown provider %q", provider)
	}
	return pconf, nil
}

func validateChatRequest(request *types.ChatRequest) error {
	if request.ModelID == "" || request.Message == "" {
		log.Println("❌ Missing request fields")
		return errors.New("sessionID, modelID, and message are required")
	}
	return nil
}
