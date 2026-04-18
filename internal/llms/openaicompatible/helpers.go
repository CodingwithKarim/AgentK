package openaicompatible

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	sdk "github.com/openai/openai-go"
	sdkOption "github.com/openai/openai-go/option"
	"github.com/openai/openai-go/packages/param"
)

type CohereModelResponse struct {
	Models []CohereModel `json:"models"`
}

type CohereModel struct {
	Name          string   `json:"name"`
	Endpoints     []string `json:"endpoints"`
	Finetuned     bool     `json:"finetuned"`
	ContextLength int      `json:"context_length"`
	TokenizerURL  string   `json:"tokenizer_url"`
	Features      any      `json:"features"`
}

func allowOpenAIModel(id string) bool {
	modelID := strings.ToLower(id)

	for _, badWord := range utils.DisallowedModels {
		if strings.Contains(modelID, badWord) {
			return false
		}
	}

	return true
}

func buildChatCompletionParams(
	modelID string,
	tokens int64,
	systemPrompt string,
	messages any,
) sdk.ChatCompletionNewParams {
	msgs := messages.([]sdk.ChatCompletionMessageParamUnion)

	finalMessages := make([]sdk.ChatCompletionMessageParamUnion, 0, len(msgs)+1)

	// Add system prompt if provided
	if systemPrompt != "" {
		finalMessages = append(finalMessages, sdk.ChatCompletionMessageParamUnion{
			OfSystem: &sdk.ChatCompletionSystemMessageParam{
				Content: sdk.ChatCompletionSystemMessageParamContentUnion{
					OfString: sdk.String(systemPrompt),
				},
			},
		})
	}

	// Add the rest of the messages
	finalMessages = append(finalMessages, msgs...)

	params := sdk.ChatCompletionNewParams{
		Model:    modelID,
		Messages: finalMessages,
	}

	if tokens > 0 {
		params.MaxCompletionTokens = param.Opt[int64]{Value: tokens}
	}

	return params
}

func buildRequestOptions(providerName types.Provider, key string) []sdkOption.RequestOption {
	return []sdkOption.RequestOption{
		sdkOption.WithBaseURL(utils.ProviderEndpointsMap[providerName].ModelEndpoint),
		sdkOption.WithAPIKey(key),
	}
}

func parseCohereModels(rawJSON []byte, providerName types.Provider) ([]*types.Model, error) {
	response := &CohereModelResponse{}

	if err := json.Unmarshal(rawJSON, &response); err != nil {
		return nil, fmt.Errorf("%s parse failed: %w", providerName, err)
	}

	models := make([]*types.Model, 0, len(response.Models))

	for _, model := range response.Models {
		if model.Name == "" {
			continue
		}

		models = append(models, &types.Model{
			ID:       model.Name,
			Name:     model.Name,
			Provider: utils.COHERE,
			Enabled:  allowOpenAIModel(model.Name),
		})
	}

	return models, nil
}

func loadStaticModels() []*types.Model {
	models := make([]*types.Model, 0)

	for _, modelID := range utils.PerplexityModels {
		model := &types.Model{
			ID:       modelID,
			Name:     strings.ReplaceAll(modelID, "-", " "),
			Provider: utils.PERPLEXITY,
			Enabled:  true,
		}

		models = append(models, model)
	}

	return models
}
