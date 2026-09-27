package chatservice

import (
	"fmt"
	"log"
	"sync"

	"github.com/CodingWithKarim/AgentK/internal/llms"
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func GenerateChatResponse(request *types.ChatRequest) (string, error) {
	if err := validateChatRequest(request); err != nil {
		return "", err
	}

	contextMessages, err := getFormattedContext(request.Provider, request.Context)

	if err != nil {
		return "", err
	}

	LLMClient, ok := llms.Clients[request.Provider]

	if !ok {
		return "", utils.ErrProviderNotSupported
	}

	llmResponse, err := LLMClient.Chat(
		request,
		contextMessages,
	)

	if err != nil {
		log.Printf("provider call failed model=%q err=%v", request.ModelID, err)
		return "", err
	}

	return llmResponse, nil
}

func GetAllModels() []*types.Model {
	results := make([]*types.Model, 0)
	channel := make(chan []*types.Model)
	syncGroup := sync.WaitGroup{}

	for provider, LLMClient := range llms.Clients {
		syncGroup.Go(func() {
			models, err := getProviderModels(provider, LLMClient)

			if err != nil {
				log.Printf("failed to get models for provider=%q err=%v", provider, err)
				return
			}

			if len(models) > 0 {
				channel <- models
			}
		})
	}

	go func() {
		syncGroup.Wait()
		close(channel)
	}()

	for models := range channel {
		results = append(results, models...)
	}

	log.Printf("Fetched total models=%d", len(results))

	return results
}

func ReloadProviderModels(provider types.Provider) ([]*types.Model, error) {
	LLMClient, ok := llms.Clients[provider]

	if !ok {
		return nil, utils.ErrProviderNotSupported
	}

	models, err := LLMClient.Models()

	if err != nil {
		log.Printf("failed to get models for provider=%q err=%v", provider, err)
		return nil, err
	}

	return models, nil
}

func getProviderModels(provider types.Provider, client llms.LLMClient) ([]*types.Model, error) {
	models, err := client.Models()

	if err != nil {
		return nil, fmt.Errorf("failed to get models for provider=%q: %v", provider, err)
	}
	return models, nil
}
