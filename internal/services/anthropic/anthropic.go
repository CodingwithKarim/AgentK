package anthropic

import (
	"context"
	"fmt"

	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
)

func GenerateChatCompletion(model, key string, messages []anthropic.MessageParam, tokens int64) (string, error) {
	client := anthropic.NewClient(
		option.WithAPIKey(key),
	)

	ctx := context.Background()

	resp, err := client.Messages.New(ctx, buildMessageParams(model, tokens, messages))

	if err != nil {
		return "", fmt.Errorf("anthropic API error: %w", err)
	}

	if len(resp.Content) == 0 {
		return "", fmt.Errorf("no content in response")
	}

	return resp.Content[0].Text, nil
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

	out := make([]*types.Model, 0, len(resp.Data))

	for _, m := range resp.Data {
		id := m.ID

		out = append(out, &types.Model{
			ID:      id,
			Name:    id,
			Enabled: true,
		})
	}

	return out, nil
}
