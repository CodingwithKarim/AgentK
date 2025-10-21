package providers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
)

type openAIModelsResponse struct {
	Data []struct {
		ID      string `json:"id"`
		OwnedBy string `json:"owned_by"`
	} `json:"data"`
}

func openAIRequest(ctx context.Context, apiKey string) (*http.Request, error) {
	endpoint := "https://api.openai.com/v1/models"

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)

	if err != nil {
		log.Fatalf("Request failed for endpoint %v", endpoint)
	}

	request.Header.Set("Authorization", "Bearer "+apiKey)

	return request, nil
}

func parseOpenAIResponse(body []byte) ([]RawModel, error) {
	var parsed openAIModelsResponse

	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}

	out := make([]RawModel, 0, len(parsed.Data))

	for _, d := range parsed.Data {
		out = append(out, RawModel{ID: d.ID})
	}
	return out, nil
}

var openAIKeep = regexp.MustCompile(`^(gpt-|chatgpt-|o\d|o\d-|o\dmini|o\d-pro)`)
var openAIIgnore = regexp.MustCompile(`(embedding|tts|audio|image|whisper|dall|moderation|realtime|codex|completion|transcribe)`)

func openAIFilter(m RawModel) bool {
	id := strings.ToLower(m.ID)
	return openAIKeep.MatchString(id) && !openAIIgnore.MatchString(id)
}

var OpenAIAdapter = ProviderAdapter{
	Provider:    utils.OPENAI,
	MakeRequest: openAIRequest,
	Parse:       parseOpenAIResponse,
	Filter:      openAIFilter,
}
