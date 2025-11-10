package config

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func loadStaticModels() []*types.Model {
	var loaded []*types.Model

	for _, id := range utils.PerplexityModels {
		m := &types.Model{
			ID:      id,
			Name:    strings.ReplaceAll(id, "-", " "),
			Enabled: true,
		}
		loaded = append(loaded, m)
	}

	return loaded
}

func parseConfig(data []byte) (*types.JsonLayout, error) {
	var config types.JsonLayout

	if err := json.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config JSON: %w", err)
	}
	return &config, nil
}
