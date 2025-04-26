package types

import "time"

type BaseResource struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Model struct {
	BaseResource
	Provider Provider `json:"provider,omitempty"`
}

type Session struct {
	BaseResource
}

type Message struct {
	Role      string     `json:"role"`
	Content   string     `json:"content"`
	Timestamp *time.Time `json:"timestamp,omitempty"`
}

type APIMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ModelConfig struct {
	ID          string
	Name        string
	Provider    Provider
	Endpoint    string
	APIKeyEnv   string
	APIKey      string
	ContextSize int
}

type Provider string

type ResponseExtractor func([]byte) (string, error)
