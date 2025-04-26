package chatservice

import (
	"errors"
	"fmt"
	"log"

	"github.com/CodingWithKarim/AgentK/config"
	"github.com/CodingWithKarim/AgentK/internal/database"
	"github.com/CodingWithKarim/AgentK/internal/services/ai"
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func validateChatRequest(request *types.ChatRequest) error {
	if request.SessionID == "" || request.ModelID == "" || request.Message == "" {
		log.Println("❌ Missing request fields")
		return errors.New("sessionID, modelID, and message are required")
	}
	return nil
}

func fetchModelConfig(modelID string) (*types.ModelConfig, error) {
	modelConfig, err := GetModelConfigByID(modelID)
	if err != nil {
		return nil, errors.New("invalid model ID")
	}
	return modelConfig, nil
}

func getMessageHistory(request *types.ChatRequest) ([]types.Message, error) {
	historyRequest := &types.ChatHistoryRequest{
		BaseRequest: types.BaseRequest{
			SessionID:     request.SessionID,
			ModelID:       request.ModelID,
			SharedContext: request.SharedContext,
		},
	}

	chatMessages, err := FetchChatHistory(historyRequest)
	if err != nil {
		log.Printf("❌ Error fetching chat history for session %q and model %q: %v",
			request.SessionID, request.ModelID, err)
		return nil, errors.New("unable to fetch previous messages")
	}

	return chatMessages, nil
}

func callModelProvider(modelID string, modelConfig *types.ModelConfig, messages []types.APIMessage) (string, error) {
	var reply string
	var err error

	switch modelConfig.Provider {
	case utils.OPENAI, utils.GROQ, utils.PERPLEXITY, utils.GOOGLE, utils.HUGGINGFACE:
		reply, err = ai.CallOpenAI(modelID, modelConfig, messages)
	case utils.ANTHROPIC:
		reply, err = ai.CallClaude(modelID, modelConfig, messages)
	case utils.COHERE:
		reply, err = ai.CallCohereV2(modelID, modelConfig, messages)
	default:
		log.Printf("No matching provider")
		return "", fmt.Errorf("unsupported provider %q", modelConfig.Provider)
	}

	if err != nil {
		return "", fmt.Errorf("model call: %w", err)
	}

	return reply, nil
}

func saveMessagePair(sessionID, modelID, userMessage, assistantReply string) {
	// Save both messages - continue even if errors occur
	if err := database.SaveMessage(sessionID, modelID, "user", userMessage); err != nil {
		log.Printf("⚠️ Failed to save user message: %v", err)
	}

	if err := database.SaveMessage(sessionID, modelID, "assistant", assistantReply); err != nil {
		log.Printf("⚠️ Failed to save assistant message: %v", err)
	}
}

func toAPI(history []types.Message, userPrompt string) []types.APIMessage {
	out := make([]types.APIMessage, 0, len(history)+1)
	for _, m := range history {
		out = append(out, types.APIMessage{
			Role:    m.Role,
			Content: m.Content,
		})
	}
	out = append(out, types.APIMessage{
		Role:    "user",
		Content: userPrompt,
	})
	return out
}

func GetModelConfigByID(modelID string) (*types.ModelConfig, error) {
	// Retrieve model from map using the modelID key
	if modelConfig, exists := config.ModelConfigRegistry[modelID]; exists {
		return modelConfig, nil
	}

	return nil, errors.New("model not found")
}

func GetUIModels() []*types.Model {
	// Init models array
	models := []*types.Model{}

	// Loop through map and append only id & name field
	for _, model := range config.ModelConfigRegistry {
		models = append(models, &types.Model{
			BaseResource: types.BaseResource{
				ID:   model.ID,
				Name: model.Name,
			},
			Provider: model.Provider,
		})
	}

	// Return list of models
	return models
}
