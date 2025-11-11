package types

import "encoding/json"

type ChatRequest struct {
	ModelID  string          `json:"modelID"`
	Message  string          `json:"message"`
	Provider Provider        `json:"provider"`
	Context  json.RawMessage `json:"context"`
	Tokens   int64           `json:"tokens"`
}

type Model struct {
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Provider Provider `json:"provider,omitempty"`
	Enabled  bool     `json:"enabled"`
}

type GetModelsResponse struct {
	Models []*Model `json:"models"`
}

type Provider string

type ProviderConfig struct {
	Endpoints ProviderEndpoints
	Models    map[string]*Model `json:"models"`
}

type ProviderEndpoints struct {
	BaseURL       string
	ModelEndpoint string
}

type CohereModelResponse struct {
	Models []CohereModel `json:"models"`
}

type CohereModel struct {
	Name          string   `json:"name"`
	Endpoints     []string `json:"endpoints"`
	Finetuned     bool     `json:"finetuned"`
	ContextLength int      `json:"context_length"`
	TokenizerURL  string   `json:"tokenizer_url"`
	Features      any      `json:"features"`
}
