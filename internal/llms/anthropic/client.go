package anthropic

import (
	"context"
	"fmt"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	sdk "github.com/anthropics/anthropic-sdk-go"
)

type AnthropicClient struct {
	Client *sdk.Client
}

func (c *AnthropicClient) Chat(chatRequest *types.ChatRequest, contextMessages any) (string, error) {
	// Generate a chat completion
	llmResponse, err := c.Client.Messages.New(context.Background(), buildMessageParams(chatRequest.ModelID, chatRequest.Tokens, contextMessages))

	if err != nil {
		return "", fmt.Errorf("anthropic API error: %w", err)
	}

	if len(llmResponse.Content) == 0 {
		return "", fmt.Errorf("no content in anthropic response")
	}

	// Return the first content text
	return llmResponse.Content[0].Text, nil
}

func (c *AnthropicClient) Models() ([]*types.Model, error) {
	llmResponse, err := c.Client.Models.List(context.Background(), sdk.ModelListParams{
		Limit: sdk.Int(1000),
	})

	if err != nil {
		return nil, fmt.Errorf("anthropic model list failed: %w", err)
	}

	models := make([]*types.Model, 0, len(llmResponse.Data))

	for _, model := range llmResponse.Data {
		id := model.ID

		models = append(models, &types.Model{
			ID:       id,
			Name:     id,
			Provider: utils.ANTHROPIC,
			Enabled:  true,
		})
	}

	return models, nil
}
