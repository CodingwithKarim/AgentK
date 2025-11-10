package openaicompatible

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/packages/param"
)

func allowOpenAIModel(id string) bool {
	l := strings.ToLower(id)

	for _, bad := range utils.DisallowedModels {
		if strings.Contains(l, bad) {
			return false
		}
	}

	return true
}

func buildChatCompletionParams(modelID string, tokens int64, messages []openai.ChatCompletionMessageParamUnion) openai.ChatCompletionNewParams {
	params := openai.ChatCompletionNewParams{
		Model:    modelID,
		Messages: messages,
	}
	if tokens > 0 {
		params.MaxCompletionTokens = param.Opt[int64]{Value: tokens}
	}
	return params
}

func parseCohereModels(raw []byte, providerName types.Provider) ([]*types.Model, error) {
	var decoded struct {
		Models []struct {
			Name          string   `json:"name"`
			Endpoints     []string `json:"endpoints"`
			Finetuned     bool     `json:"finetuned"`
			ContextLength int      `json:"context_length"`
			TokenizerURL  string   `json:"tokenizer_url"`
			Features      any      `json:"features"`
		} `json:"models"`

		NextPageToken string `json:"next_page_token"`
	}

	if err := json.Unmarshal(raw, &decoded); err != nil {
		return nil, fmt.Errorf("%s parse failed: %w", providerName, err)
	}

	out := make([]*types.Model, 0, len(decoded.Models))

	for _, m := range decoded.Models {
		if m.Name == "" {
			continue
		}

		modelID := m.Name

		out = append(out, &types.Model{
			ID:      modelID,
			Name:    modelID,
			Enabled: allowOpenAIModel(modelID),
		})
	}

	return out, nil
}
