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
	Message string `json:"message"`
}

type ClaudeRequest struct {
	Model     string       `json:"model"`
	Messages  []APIMessage `json:"messages"`
	MaxTokens int          `json:"max_tokens"`
}

type OpenAIRequest struct {
	Model    string       `json:"model"`
	Messages []APIMessage `json:"messages"`
}
