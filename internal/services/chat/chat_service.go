package chatservice

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/config"
	"github.com/CodingWithKarim/AgentK/internal/services/anthropic"
	"github.com/CodingWithKarim/AgentK/internal/services/openaicompatible"
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	claude "github.com/anthropics/anthropic-sdk-go"
	"github.com/openai/openai-go"
)

func PostChatMessage(req *types.ChatRequest) (string, error) {
	if err := validateChatRequest(req); err != nil {
		return "", err
	}

	contextMessages, err := parseContext(req.Provider, req.Context)

	if err != nil {
		return "", err
	}

	key := os.Getenv(fmt.Sprintf("%s_API_KEY", strings.ToUpper(string(req.Provider))))

	var chatResponse string
	switch req.Provider {
	case utils.ANTHROPIC:
		chatResponse, err = anthropic.GenerateChatCompletion(
			req.ModelID,
			key,
			contextMessages.([]claude.MessageParam),
			req.Tokens,
		)
	default:
		chatResponse, err = openaicompatible.GenerateChatCompletion(
			req.ModelID,
			contextMessages.([]openai.ChatCompletionMessageParamUnion),
			req.Tokens,
			utils.ProviderEndpointsMap[req.Provider].BaseURL,
			key,
		)
	}

	if err != nil {
		log.Printf("❌ provider call failed model=%q err=%v", req.ModelID, err)
		return "", err
	}

	return chatResponse, nil
}

func GetUIModels() []*types.Model {
	models := make([]*types.Model, 0)

	for provider, providerConfig := range config.ProviderConfigs {
		for _, model := range providerConfig.Models {
			models = append(models, &types.Model{
				ID:       model.ID,
				Name:     model.Name,
				Provider: provider,
				Enabled:  model.Enabled,
			})
		}
	}

	return models
}
