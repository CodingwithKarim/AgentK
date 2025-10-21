package providers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"golang.org/x/net/context"
)

type claudeModelsResponse struct {
	Data []struct {
		ID          string `json:"id"`
		DisplayName string `json:"display_name"`
	} `json:"data"`
}

func claudeRequest(ctx context.Context, apiKey string) (*http.Request, error) {
	endpoint := "https://api.anthropic.com/v1/models"

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)

	if err != nil {
		log.Fatalf("Request failed for endpoint %v", endpoint)
	}

	request.Header.Set("x-api-key", apiKey)
	request.Header.Set("anthropic-version", "2023-06-01")

	return request, nil
}

func parseClaudeResponse(body []byte) ([]RawModel, error) {
	var parsedData claudeModelsResponse

	if err := json.Unmarshal(body, &parsedData); err != nil {
		return nil, fmt.Errorf("failed to parse Anthropic response: %v", err)
	}

	out := make([]RawModel, 0, len(parsedData.Data))

	for _, d := range parsedData.Data {
		out = append(out, RawModel{ID: d.ID, DisplayName: d.DisplayName})
	}
	return out, nil
}

var AnthropicAdapter = ProviderAdapter{
	Provider:    utils.ANTHROPIC,
	MakeRequest: claudeRequest,
	Parse:       parseClaudeResponse,
}
