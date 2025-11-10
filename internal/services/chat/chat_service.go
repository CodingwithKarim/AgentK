package chatservice

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/config"
	"github.com/CodingWithKarim/AgentK/internal/services/anthropic"
	"github.com/CodingWithKarim/AgentK/internal/services/openaicompatible"
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	claude "github.com/anthropics/anthropic-sdk-go"
	"github.com/openai/openai-go"
)

func PostChatMessage(req *types.ChatRequest) (string, error) {
	if err := validateChatRequest(req); err != nil {
		return "", err
	}

	pconf, err := getProviderConfig(req.Provider)

	if err != nil {
		return "", err
	}

	ctxMsgs, err := parseContext(req.Provider, req.Context)

	if err != nil {
		return "", err
	}

	key := os.Getenv(fmt.Sprintf("%s_API_KEY", strings.ToUpper(string(req.Provider))))

	var reply string
	switch req.Provider {
	case utils.ANTHROPIC:
		reply, err = anthropic.GenerateChatCompletion(
			req.ModelID,
			key,
			ctxMsgs.([]claude.MessageParam),
			req.Tokens,
		)
	default:
		reply, err = openaicompatible.GenerateChatCompletion(
			req.ModelID,
			ctxMsgs.([]openai.ChatCompletionMessageParamUnion),
			req.Tokens,
			pconf.Endpoints.BaseURL,
			key,
		)
	}

	if err != nil {
		log.Printf("❌ provider call failed model=%q err=%v", req.ModelID, err)
		return "", err
	}

	return reply, nil
}

func GetUIModels() []*types.Model {
	out := make([]*types.Model, 0)

	for provName, provConf := range config.ProviderConfigs {
		for _, m := range provConf.Models {
			out = append(out, &types.Model{
				ID:       m.ID,
				Name:     m.Name,
				Provider: provName,
				Enabled:  m.Enabled,
			})
		}
	}

	return out
}
