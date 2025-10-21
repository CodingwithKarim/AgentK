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
	ID        string     `json:"id"`
	Role      string     `json:"role"`
	Content   string     `json:"content"`
	Model     string     `json:"model"`
	ModelName string     `json:"model_name"`
	Timestamp *time.Time `json:"timestamp,omitempty"`
}

type APIMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ModelConfig struct {
	ID        string
	Name      string
	Provider  Provider
	Endpoint  string
	APIKeyEnv string
	APIKey    string
}

type Provider string

type RawModel struct {
	ID          string
	DisplayName string
	Meta        map[string]any // optional extra fields if you need them
}
