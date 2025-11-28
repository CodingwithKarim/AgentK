package anthropic

import sdk "github.com/anthropics/anthropic-sdk-go"

func buildMessageParams(modelID string, tokens int64, messages any) sdk.MessageNewParams {
	if tokens == 0 {
		tokens = 4096
	}

	return sdk.MessageNewParams{
		Model:     sdk.Model(modelID),
		MaxTokens: tokens,
		Messages:  messages.([]sdk.MessageParam),
	}
}
