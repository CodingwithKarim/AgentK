package config

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	providers "github.com/CodingWithKarim/AgentK/internal/config/ai-providers"
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func parseConfig(data []byte) (*jsonLayout, error) {
	var config jsonLayout

	if err := json.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config JSON: %w", err)
	}
	return &config, nil
}

func loadProvider(providerName types.Provider, provider *providerConfig) error {
	// Check if the provider supports dynamic model fetching
	if providerAdapter, ok := providers.Registry[providerName]; ok {
		// Fetch models from the provider API passing in adapter
		models, err := providers.FetchModelsFromProvider(
			providerAdapter,
			context.Background(),
			provider.APIKey,
			provider.Endpoint,
		)

		if err != nil {
			return fmt.Errorf("fetching models failed: %w", err)
		}

		// Register the fetched models into global config
		for _, m := range models {
			ModelRegistry[m.ID] = m
			provider.Models[m.ID] = m
		}

		return nil
	}

	// Attempt to load static models defined in config file or internally
	staticModels := loadStaticModels(providerName, provider)

	// Register the static models into global config
	for _, m := range staticModels {
		ModelRegistry[m.ID] = m
		provider.Models[m.ID] = m
	}

	return nil
}

func loadStaticModels(providerName types.Provider, provider *providerConfig) []*types.ModelConfig {
	var loaded []*types.ModelConfig
	titleCaser := cases.Title(language.English)

	// Internal static models defined at runtime (developer choice)
	switch providerName {
	case utils.PERPLEXITY:
		for _, id := range utils.PerplexityModels {
			m := &types.ModelConfig{
				ID:       id,
				Name:     titleCaser.String(strings.ReplaceAll(id, "-", " ")),
				Provider: utils.PERPLEXITY,
				APIKey:   provider.APIKey,
				Endpoint: provider.Endpoint,
			}
			loaded = append(loaded, m)
		}

	// External models defined in config file
	default:
		for id, model := range provider.Models {
			model.ID = id
			model.Provider = providerName
			model.APIKey = provider.APIKey
			if model.Endpoint == "" {
				model.Endpoint = provider.Endpoint
			}
			if strings.TrimSpace(model.Name) == "" {
				model.Name = titleCaser.String(strings.ReplaceAll(id, "-", " "))
			}
			loaded = append(loaded, model)
		}
	}

	return loaded
}
