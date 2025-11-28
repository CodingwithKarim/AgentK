package types

import (
	"encoding/json"
)

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

type Provider string

type ProviderEndpoints struct {
	BaseURL       string
	ModelEndpoint string
}
