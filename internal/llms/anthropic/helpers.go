package anthropic

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	sdk "github.com/anthropics/anthropic-sdk-go"
)

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

func BuildAnthropicMessages(messages []types.Message) ([]sdk.MessageParam, error) {
	raw := make([]map[string]any, 0, len(messages))

	for _, msg := range messages {
		if isJSONString(msg.Content) {
			var text string
			if err := json.Unmarshal(msg.Content, &text); err != nil {
				return nil, err
			}

			raw = append(raw, map[string]any{
				"role":    msg.Role,
				"content": text,
			})
			continue
		}

		if !isJSONArray(msg.Content) {
			return nil, fmt.Errorf("invalid content type for anthropic")
		}

		var parts []types.MessagePart
		if err := json.Unmarshal(msg.Content, &parts); err != nil {
			return nil, err
		}

		blocks := make([]map[string]any, 0, len(parts))

		for _, part := range parts {
			switch part.Type {

			case "text":
				blocks = append(blocks, map[string]any{
					"type": "text",
					"text": part.Text,
				})

			case "image_url":
				if part.ImageURL == nil {
					return nil, fmt.Errorf("image_url missing image_url field")
				}

				src, err := parseImageURL(part.ImageURL.URL)
				if err != nil {
					return nil, err
				}

				blocks = append(blocks, map[string]any{
					"type":   "image",
					"source": src,
				})
			}
		}

		raw = append(raw, map[string]any{
			"role":    msg.Role,
			"content": blocks,
		})
	}

	bytes, err := json.Marshal(raw)

	if err != nil {
		return nil, err
	}

	var parsed []sdk.MessageParam

	if err := json.Unmarshal(bytes, &parsed); err != nil {
		return nil, err
	}

	return parsed, nil
}

func parseImageURL(url string) (source map[string]any, err error) {
	if strings.HasPrefix(url, "data:") {
		parts := strings.SplitN(url, ",", 2)
		if len(parts) != 2 {
			return nil, fmt.Errorf("invalid data URL")
		}

		meta := parts[0]
		data := parts[1]

		mt := strings.TrimPrefix(meta, "data:")
		mt = strings.TrimSuffix(mt, ";base64")

		return map[string]any{
			"type":       "base64",
			"media_type": mt,
			"data":       data,
		}, nil
	}

	return map[string]any{
		"type": "url",
		"url":  url,
	}, nil
}

func isJSONString(b json.RawMessage) bool {
	return len(b) > 0 && b[0] == '"'
}

func isJSONArray(b json.RawMessage) bool {
	return len(b) > 0 && b[0] == '['
}
