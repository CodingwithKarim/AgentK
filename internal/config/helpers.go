package config

import (
	"log"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func loadStaticModels() []*types.Model {
	models := []*types.Model{}

	for _, modelID := range utils.PerplexityModels {
		model := &types.Model{
			ID:      modelID,
			Name:    strings.ReplaceAll(modelID, "-", " "),
			Enabled: true,
		}
		models = append(models, model)
	}

	return models
}

func debugCount() {
	count := 0

	ProviderConfigsMu.RLock()

	for _, providerConfig := range ProviderConfigs {
		count += len(providerConfig.Models)
	}

	ProviderConfigsMu.RUnlock()

	log.Printf("Total model count is %d models", count)
}
