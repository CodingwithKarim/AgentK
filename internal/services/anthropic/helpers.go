package anthropic

import "github.com/anthropics/anthropic-sdk-go"

func buildMessageParams(modelID string, tokens int64, messages []anthropic.MessageParam) anthropic.MessageNewParams {
	if tokens == 0 {
		tokens = 4096
	}

	return anthropic.MessageNewParams{
		Model:     anthropic.Model(modelID),
		MaxTokens: tokens,
		Messages:  messages,
	}
}
