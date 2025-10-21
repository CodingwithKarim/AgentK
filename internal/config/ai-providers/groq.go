package providers

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"golang.org/x/net/context"
)

type groqModelResponse struct {
	Data []struct {
		ID     string `json:"id"`
		Active bool   `json:"active"`
	} `json:"data"`
}

func groqRequest(ctx context.Context, apiKey string) (*http.Request, error) {
	request, _ := http.NewRequestWithContext(ctx, http.MethodGet, "https://api.groq.com/openai/v1/models", nil)

	request.Header.Set("Authorization", "Bearer "+apiKey)
	return request, nil
}

func groqParse(body []byte) ([]RawModel, error) {
	var parsed groqModelResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}
	out := make([]RawModel, 0, len(parsed.Data))
	for _, d := range parsed.Data {
		if !d.Active {
			continue
		}
		out = append(out, RawModel{ID: d.ID})
	}
	return out, nil
}

var groqIgnore = regexp.MustCompile(`(whisper|tts|audio|embed|vision|image|guard|prompt)`)

func groqFilter(m RawModel) bool {
	return !groqIgnore.MatchString(strings.ToLower(m.ID))
}

var GroqAdapter = ProviderAdapter{
	Provider:    utils.GROQ,
	MakeRequest: groqRequest,
	Parse:       groqParse,
	Filter:      groqFilter,
}
