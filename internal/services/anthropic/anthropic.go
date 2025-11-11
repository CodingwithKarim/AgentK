package anthropic

import (
	"context"
	"fmt"
	"log"

	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
)

func GenerateChatCompletion(model, key string, messages []anthropic.MessageParam, tokens int64) (string, error) {
	client := anthropic.NewClient(
		option.WithAPIKey(key),
	)

	response, err := client.Messages.New(context.Background(), buildMessageParams(model, tokens, messages))

	if err != nil {
		return "", fmt.Errorf("anthropic API error: %w", err)
	}

	if len(response.Content) == 0 {
		log.Printf("Anthropic response content is empty: %+v", response)

		return "", fmt.Errorf("no content in response")
	}

	return response.Content[0].Text, nil
}

func LoadModels(apiKey string, providerName types.Provider) ([]*types.Model, error) {
	if apiKey == "" {
		return nil, nil
	}

	client := anthropic.NewClient(
		option.WithAPIKey(apiKey),
	)

	resp, err := client.Models.List(context.Background(), anthropic.ModelListParams{
		Limit: anthropic.Int(1000),
	})

	if err != nil {
		return nil, fmt.Errorf("%s model list failed: %w", providerName, err)
	}

	models := make([]*types.Model, 0, len(resp.Data))

	for _, m := range resp.Data {
		id := m.ID

		models = append(models, &types.Model{
			ID:      id,
			Name:    id,
			Enabled: true,
		})
	}

	return models, nil
}
