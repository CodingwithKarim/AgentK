package chatservice

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	anthropicSdk "github.com/anthropics/anthropic-sdk-go"
	"github.com/openai/openai-go"
)

func getFormattedContext(provider types.Provider, rawContext json.RawMessage) (any, error) {
	switch provider {
	case utils.ANTHROPIC:
		var messages []anthropicSdk.MessageParam

		if err := json.Unmarshal(rawContext, &messages); err != nil {
			return nil, fmt.Errorf("invalid Anthropic context: %w", err)
		}

		return messages, nil

	default:
		var messages []openai.ChatCompletionMessageParamUnion

		if err := json.Unmarshal(rawContext, &messages); err != nil {
			return nil, fmt.Errorf("invalid OpenAI-compatible context: %w", err)
		}

		return messages, nil
	}
}

func validateChatRequest(request *types.ChatRequest) error {
	if request.ModelID == "" || request.Message == "" || request.Provider == "" || request.Context == nil {
		log.Println("Missing request fields")
		return errors.New("sessionID, modelID, and message are required")
	}
	return nil
}
