package config

import (
	"fmt"
	"os"

	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

var (
	ProviderConfigs map[types.Provider]*providerConfig
	ModelRegistry   map[string]*types.ModelConfig
)

type providerConfig struct {
	APIKey   string                        `json:"apiKey"`
	Endpoint string                        `json:"endpoint"`
	Models   map[string]*types.ModelConfig `json:"models"`
}

type jsonLayout struct {
	Providers map[types.Provider]*providerConfig `json:"Providers"`
}

func LoadConfig() error {
	// Read the config file
	data, err := os.ReadFile("config.json")

	if err != nil {
		return fmt.Errorf("could not read config: %w", err)
	}

	// Parse the config file into go struct
	config, err := parseConfig(data)

	if err != nil {
		return fmt.Errorf("invalid config: %w", err)
	}

	ProviderConfigs = make(map[types.Provider]*providerConfig)
	ModelRegistry = make(map[string]*types.ModelConfig)

	// Iterate over the providers and load their models
	for providerName, provider := range config.Providers {
		if provider.APIKey == "" {
			continue
		}

		// Load the models for the provider
		if err := loadProvider(providerName, provider); err != nil {
			continue
		}

		ProviderConfigs[providerName] = provider
	}

	return nil
}
