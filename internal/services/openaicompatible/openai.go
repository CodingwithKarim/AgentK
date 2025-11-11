package openaicompatible

import (
	"context"
	"fmt"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

func GenerateChatCompletion(
	modelID string,
	messages []openai.ChatCompletionMessageParamUnion,
	tokens int64,
	endpoint,
	apiKey string,
) (string, error) {
	client := openai.NewClient(
		option.WithAPIKey(apiKey),
		option.WithBaseURL(endpoint),
	)

	response, err := client.Chat.Completions.New(context.Background(), buildChatCompletionParams(modelID, tokens, messages))

	if err != nil {
		return "", err
	}

	if len(response.Choices) == 0 {
		return "", nil
	}

	return response.Choices[0].Message.Content, nil
}

func LoadModels(key, baseURL string, providerName types.Provider) ([]*types.Model, error) {
	if key == "" {
		return nil, nil
	}

	client := openai.NewClient(
		option.WithAPIKey(key),
		option.WithBaseURL(baseURL),
	)

	response, err := client.Models.List(context.Background())

	if err != nil {
		return nil, fmt.Errorf("%s model list failed: %w", providerName, err)
	}

	if providerName == utils.COHERE {
		return parseCohereModels([]byte(response.RawJSON()), providerName)
	}

	models := make([]*types.Model, 0, len(response.Data))

	for _, model := range response.Data {
		models = append(models, &types.Model{
			ID:      model.ID,
			Name:    model.ID,
			Enabled: allowOpenAIModel(model.ID),
		})
	}

	return models, nil
}
