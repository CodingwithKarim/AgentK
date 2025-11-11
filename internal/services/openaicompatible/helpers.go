package openaicompatible

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/packages/param"
)

func allowOpenAIModel(id string) bool {
	modelID := strings.ToLower(id)

	for _, badWord := range utils.DisallowedModels {
		if strings.Contains(modelID, badWord) {
			return false
		}
	}

	return true
}

func buildChatCompletionParams(modelID string, tokens int64, messages []openai.ChatCompletionMessageParamUnion) openai.ChatCompletionNewParams {
	params := openai.ChatCompletionNewParams{
		Model:    modelID,
		Messages: messages,
	}

	if tokens > 0 {
		params.MaxCompletionTokens = param.Opt[int64]{Value: tokens}
	}
	return params
}

func parseCohereModels(rawJSON []byte, providerName types.Provider) ([]*types.Model, error) {
	response := &types.CohereModelResponse{}

	if err := json.Unmarshal(rawJSON, &response); err != nil {
		return nil, fmt.Errorf("%s parse failed: %w", providerName, err)
	}

	models := make([]*types.Model, 0, len(response.Models))

	for _, model := range response.Models {
		if model.Name == "" {
			continue
		}

		models = append(models, &types.Model{
			ID:      model.Name,
			Name:    model.Name,
			Enabled: allowOpenAIModel(model.Name),
		})
	}

	return models, nil
}
