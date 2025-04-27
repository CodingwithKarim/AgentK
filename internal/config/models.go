package config

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

var (
	ProviderCreds       map[string]providerConfig
	ModelConfigRegistry map[string]*types.ModelConfig
)

type providerConfig struct {
	APIKey string `json:"apiKey"`
}

type JsonLayout struct {
	Providers map[string]providerConfig     `json:"Providers"`
	Models    map[string]*types.ModelConfig `json:"Models"`
}

func LoadConfig() error {
	// Check if user has AGENTK_JSON env variable set to locate agentk.json config file
	path := os.Getenv("AGENTK_JSON")

	if path == "" {
		path = "agentk_config.json" // Default to root project directory
	}

	// Read json config file
	data, err := os.ReadFile(path)

	if err != nil {
		return fmt.Errorf("could not read config: %w", err)
	}

	var configJson JsonLayout

	// Parse JSON into proper Go structure
	if err := json.Unmarshal(data, &configJson); err != nil {
		return fmt.Errorf("invalid config JSON: %w", err)
	}

	// Normalize provider names to lowercase to handle casing variations
	ProviderCreds = make(map[string]providerConfig)

	for k, v := range configJson.Providers {
		ProviderCreds[strings.ToLower(k)] = v
	}

	// Set the ModelConfigRegistry from parsed models
	ModelConfigRegistry = configJson.Models

	// Inject API keys into each model based on the provider mapping
	for id, mc := range ModelConfigRegistry {
		if mc.MaxCompletionTokens == 0 {
			mc.MaxCompletionTokens = 4096
		}

		providerKey := strings.ToLower(string(mc.Provider))

		pc, ok := ProviderCreds[providerKey]

		if !ok {
			return fmt.Errorf("missing provider %q for model %q. Please check Providers in agentk.json", mc.Provider, id)
		}
		if pc.APIKey == "" {
			return fmt.Errorf("API key missing for provider %q. Please fill it in agentk.json", mc.Provider)
		}

		// Assign the API key to the model config
		mc.APIKey = pc.APIKey
	}

	return nil
}
