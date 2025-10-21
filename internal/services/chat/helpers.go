package chatservice

import (
	"errors"
	"fmt"
	"log"

	"github.com/CodingWithKarim/AgentK/internal/config"
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

func saveMessagePair(sessionID, modelID, model_name, userMessage, assistantReply string) {
	// Save both messages - continue even if errors occur
	if err := database.SaveMessage(sessionID, modelID, model_name, "user", userMessage); err != nil {
		log.Printf("⚠️ Failed to save user message: %v", err)
	}

	if err := database.SaveMessage(sessionID, modelID, model_name, "assistant", assistantReply); err != nil {
		log.Printf("⚠️ Failed to save assistant message: %v", err)
	}
}

func toAPI(chatHistory []types.Message, userPrompt string) []types.APIMessage {
	collectedMessages := make([]types.APIMessage, 0, len(chatHistory)+1)

	// Append existing chat history in order
	for _, chatMessage := range chatHistory {
		collectedMessages = append(collectedMessages, types.APIMessage{
			Role:    chatMessage.Role,
			Content: chatMessage.Content,
		})
	}

	// Append latest user message
	collectedMessages = append(collectedMessages, types.APIMessage{
		Role:    "user",
		Content: userPrompt,
	})

	return collectedMessages
}

func GetModelConfigByID(modelID string) (*types.ModelConfig, error) {
	// Retrieve model from map using the modelID key
	if modelConfig, exists := config.ModelRegistry[modelID]; exists {
		return modelConfig, nil
	}

	return nil, errors.New("model not found")
}

func GetUIModels() []*types.Model {
	// Init models array
	models := []*types.Model{}

	// Loop through map and append only id & name field
	for _, model := range config.ModelRegistry {
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
