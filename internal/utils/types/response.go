package types

type ModelsResponse struct {
	Models []*Model `json:"models"`
}

type SessionsResponse struct {
	Sessions []*Session `json:"sessions"`
}

type ClaudeResponse struct {
	Content []struct {
		Text string `json:"text"`
	} `json:"content"`
}

type OpenAIResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}
