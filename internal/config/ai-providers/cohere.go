package providers

import (
	"encoding/json"
	"net/http"
	"slices"
	"strings"

	"golang.org/x/net/context"
)

type cohereModelResponse struct {
	Models []struct {
		Name      string   `json:"name"`
		Endpoints []string `json:"endpoints"`
	} `json:"models"`
}

func cohereRequest(ctx context.Context, apiKey string) (*http.Request, error) {
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, "https://api.cohere.com/v1/models", nil)
	req.Header.Set("Authorization", "Bearer "+apiKey)
	return req, nil
}

func cohereParse(body []byte) ([]RawModel, error) {
	var parsed cohereModelResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}
	var out []RawModel
	for _, m := range parsed.Models {
		// Only include chat-capable models
		hasChat := slices.Contains(m.Endpoints, "chat")
		if hasChat {
			out = append(out, RawModel{ID: m.Name})
		}
	}
	return out, nil
}

func cohereFilter(m RawModel) bool {
	id := strings.ToLower(m.ID)
	if strings.Contains(id, "embed") || strings.Contains(id, "rerank") ||
		strings.Contains(id, "image") || strings.Contains(id, "vision") {
		return false
	}
	return true
}

var CohereAdapter = ProviderAdapter{
	Provider:    "Cohere",
	MakeRequest: cohereRequest,
	Parse:       cohereParse,
	Filter:      cohereFilter,
}
