package types

type BaseRequest struct {
	SessionID     string `json:"sessionID"`
	ModelID       string `json:"modelID"`
	SharedContext bool   `json:"sharedContext"`
}

type ClearContextRequest struct {
	BaseRequest
}

type ChatHistoryRequest struct {
	BaseRequest
}

type ChatRequest struct {
	BaseRequest
	Message   string       `json:"message"`
	ModelName string       `json:"model_name"`
	Context   []APIMessage `json:"context"`
}

type ChatRequestPayload struct {
	Model     string       `json:"model"`
	Messages  []APIMessage `json:"messages"`
	MaxTokens int          `json:"max_tokens,omitempty"`
}

type RenameSessionRequest struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
