package chatservice

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	anthropicSvc "github.com/CodingWithKarim/AgentK/internal/llms/anthropic"
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/openai/openai-go"
)

func getFormattedContext(provider types.Provider, rawContext json.RawMessage) (any, error) {
	if provider != utils.ANTHROPIC {
		var messages []openai.ChatCompletionMessageParamUnion
		if err := json.Unmarshal(rawContext, &messages); err != nil {
			return nil, err
		}
		return messages, nil
	}

	var msgs []types.Message

	if err := json.Unmarshal(rawContext, &msgs); err != nil {
		return nil, fmt.Errorf("invalid canonical context: %w", err)
	}

	// Normalize to anthripic format for potential images
	return anthropicSvc.BuildAnthropicMessages(msgs)
}

func validateChatRequest(request *types.ChatRequest) error {
	if request.ModelID == "" || request.Provider == "" || request.Context == nil {
		log.Println("Missing request fields")
		return errors.New("sessionID, modelID, and message are required")
	}
	return nil
}
