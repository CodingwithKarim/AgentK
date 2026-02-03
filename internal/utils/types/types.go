package types

import (
	"encoding/json"
)

type ChatRequest struct {
	ModelID  string          `json:"modelID"`
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

type Message struct {
	Role    string          `json:"role"`
	Content json.RawMessage `json:"content"`
}

type MessagePart struct {
	Type     string    `json:"type"`
	Text     string    `json:"text,omitempty"`
	ImageURL *ImageURL `json:"image_url,omitempty"`
}

type ImageURL struct {
	URL string `json:"url"`
}
