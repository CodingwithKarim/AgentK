package providers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
)

type geminiAIModelsResponse struct {
	Models []struct {
		Name        string   `json:"name"`
		DisplayName string   `json:"displayName"`
		Methods     []string `json:"supportedGenerationMethods"`
	} `json:"models"`
}

func googleRequest(ctx context.Context, apiKey string) (*http.Request, error) {
	endpoint := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models?key=%s", apiKey)

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)

	if err != nil {
		log.Fatalf("Request failed for endpoint %v", endpoint)
	}

	return request, nil
}

func parseGoogleResponse(body []byte) ([]RawModel, error) {
	var parsed geminiAIModelsResponse

	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}

	out := make([]RawModel, 0, len(parsed.Models))

	for _, m := range parsed.Models {
		hasGen := false
		for _, method := range m.Methods {
			if method == "generateContent" || method == "bidiGenerateContent" {
				hasGen = true
				break
			}
		}
		if !hasGen {
			continue
		}
		out = append(out, RawModel{ID: m.Name, DisplayName: m.DisplayName})
	}

	return out, nil
}

func googleFilter(m RawModel) bool {
	id := strings.ToLower(m.ID)
	return !strings.Contains(id, "embed") && !strings.Contains(id, "image")
}

var GoogleAdapter = ProviderAdapter{
	Provider:    utils.GOOGLE,
	MakeRequest: googleRequest,
	Parse:       parseGoogleResponse,
	Filter:      googleFilter,
}
