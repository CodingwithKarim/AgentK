package types

import "encoding/json"

type Model struct {
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Provider Provider `json:"provider,omitempty"`
	Enabled  bool     `json:"enabled"`
}

type Session struct {
	SessionID string `json:"id"`
	Name      string `json:"name"`
}

type ChatRequest struct {
	ModelID  string          `json:"modelID"`
	Message  string          `json:"message"`
	Provider Provider        `json:"provider"`
	Context  json.RawMessage `json:"context"`
	Tokens   int64           `json:"tokens"`
}

type APIMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
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

type GetModelsResponse struct {
	Models []*Model `json:"models"`
}

type JsonLayout struct {
	Providers map[Provider]*ProviderConfig `json:"Providers"`
}
