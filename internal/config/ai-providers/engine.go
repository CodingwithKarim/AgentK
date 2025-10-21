package providers

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

type RawModel struct {
	ID, DisplayName string
	Meta            map[string]any
}

type RequestBuilder func(ctx context.Context, apiKey string) (*http.Request, error)

type Parser func(body []byte) ([]RawModel, error)

type ModelFilter func(RawModel) bool

type DisplayNameFn func(RawModel) string

type ProviderAdapter struct {
	Provider    types.Provider
	MakeRequest RequestBuilder
	Parse       Parser
	Filter      ModelFilter
	DisplayName DisplayNameFn
}

func FetchModelsFromProvider(adapter ProviderAdapter, ctx context.Context, apiKey, endpoint string) ([]*types.ModelConfig, error) {
	// Validation of the adapter
	if adapter.MakeRequest == nil || adapter.Parse == nil || adapter.Provider == "" {
		return nil, errors.New("invalid ProviderSpec (missing MakeRequest/Parse/Provider)")
	}

	// Build http request obj
	request, err := adapter.MakeRequest(ctx, apiKey)

	if err != nil {
		return nil, fmt.Errorf("build request: %w", err)
	}

	// Execute the request and get the response body
	responseBody, err := doRequest(request)

	if err != nil {
		return nil, fmt.Errorf("%s request failed (status %d): %w", adapter.Provider, err, err)
	}

	// Parse the response body to extract models
	rawModels, err := adapter.Parse(responseBody)

	if err != nil {
		return nil, fmt.Errorf("parse %s response: %w", adapter.Provider, err)
	}

	filter := adapter.Filter

	out := make([]*types.ModelConfig, 0, len(rawModels))

	for _, r := range rawModels {
		// Attempt to run filter method from adapter to skip unwanted models
		if filter != nil && !filter(r) {
			continue
		}

		// Add validated model to the output list
		out = append(out, &types.ModelConfig{
			ID:       r.ID,
			Name:     strings.ReplaceAll(r.ID, "-", " "),
			Provider: adapter.Provider,
			APIKey:   apiKey,
			Endpoint: endpoint,
		})
	}

	return out, nil
}

func doRequest(request *http.Request) ([]byte, error) {
	// Build http client
	client := &http.Client{}

	// Execute the request and get response
	response, err := client.Do(request)

	if err != nil {
		return nil, fmt.Errorf("request failed")
	}

	defer response.Body.Close()

	// Read the response body
	body, _ := io.ReadAll(response.Body)

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API error %d: %s", response.StatusCode, string(body))
	}

	return body, nil
}

// Registry of supported providers and their adapters
var Registry = map[types.Provider]ProviderAdapter{
	utils.OPENAI:    OpenAIAdapter,
	utils.ANTHROPIC: AnthropicAdapter,
	utils.GROQ:      GroqAdapter,
	utils.COHERE:    CohereAdapter,
	utils.GOOGLE:    GoogleAdapter,
}
