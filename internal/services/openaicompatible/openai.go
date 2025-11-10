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

	resp, err := client.Chat.Completions.New(context.Background(), buildChatCompletionParams(modelID, tokens, messages))

	if err != nil {
		return "", err
	}

	if len(resp.Choices) == 0 {
		return "", nil
	}

	return resp.Choices[0].Message.Content, nil
}

func LoadModels(key, baseURL string, providerName types.Provider) ([]*types.Model, error) {
	if key == "" {
		return nil, nil
	}

	client := openai.NewClient(
		option.WithAPIKey(key),
		option.WithBaseURL(baseURL),
	)

	resp, err := client.Models.List(context.TODO())
	if err != nil {
		return nil, fmt.Errorf("%s model list failed: %w", providerName, err)
	}

	if providerName == utils.COHERE {
		return parseCohereModels([]byte(resp.RawJSON()), providerName)
	}

	out := make([]*types.Model, 0, len(resp.Data))

	for _, model := range resp.Data {
		id := model.ID

		out = append(out, &types.Model{
			ID:      id,
			Name:    id,
			Enabled: allowOpenAIModel(id),
		})
	}

	return out, nil
}
