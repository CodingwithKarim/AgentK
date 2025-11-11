package chatservice

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/openai/openai-go"
)

func parseContext(provider types.Provider, raw json.RawMessage) (any, error) {
	switch provider {
	case utils.ANTHROPIC:
		var messages []anthropic.MessageParam

		if err := json.Unmarshal(raw, &messages); err != nil {
			return nil, fmt.Errorf("invalid Anthropic context: %w", err)
		}

		return messages, nil

	default:
		var messages []openai.ChatCompletionMessageParamUnion

		if err := json.Unmarshal(raw, &messages); err != nil {
			return nil, fmt.Errorf("invalid OpenAI-compatible context: %w", err)
		}

		return messages, nil
	}
}

func validateChatRequest(request *types.ChatRequest) error {
	if request.ModelID == "" || request.Message == "" {
		log.Println("❌ Missing request fields")
		return errors.New("sessionID, modelID, and message are required")
	}
	return nil
}
