package openaicompatible

import (
	"context"
	"fmt"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	sdk "github.com/openai/openai-go"
)

type OpenAIClient struct {
	Client   *sdk.Client
	Provider types.Provider
	Key      string
}

func (c *OpenAIClient) Chat(chatRequest *types.ChatRequest, contextMessages any) (string, error) {
	llmResponse, err := c.Client.Chat.Completions.New(
		context.Background(),
		buildChatCompletionParams(chatRequest.ModelID, chatRequest.Tokens, contextMessages),
		buildRequestOptions(chatRequest.Provider, c.Key)...)

	if err != nil {
		return "", err
	}

	if len(llmResponse.Choices) == 0 {
		return "", nil
	}

	return llmResponse.Choices[0].Message.Content, nil
}

func (c *OpenAIClient) Models() ([]*types.Model, error) {
	if c.Provider == utils.PERPLEXITY {
		return loadStaticModels(), nil
	}

	llmResponse, err := c.Client.Models.List(context.Background(), buildRequestOptions(c.Provider, c.Key)...)

	if err != nil {
		return nil, fmt.Errorf("%s model list failed: %w", c.Provider, err)
	}

	if c.Provider == utils.COHERE {
		return parseCohereModels([]byte(llmResponse.RawJSON()), c.Provider)
	}

	models := make([]*types.Model, 0, len(llmResponse.Data))

	for _, model := range llmResponse.Data {
		models = append(models, &types.Model{
			ID:       model.ID,
			Name:     model.ID,
			Provider: c.Provider,
			Enabled:  allowOpenAIModel(model.ID),
		})
	}

	return models, nil
}
