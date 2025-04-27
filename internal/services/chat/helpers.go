package chatservice

import (
	"errors"
	"fmt"
	"log"
	"strings"

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

func callModelProvider(modelID string, modelConfig *types.ModelConfig, messages []types.APIMessage, maxTokens int) (string, error) {
	var reply string
	var err error

	switch modelConfig.Provider {
	case utils.OPENAI, utils.GROQ, utils.PERPLEXITY, utils.GOOGLE, utils.HUGGINGFACE:
		reply, err = ai.CallOpenAI(modelID, modelConfig, messages, maxTokens)
	case utils.ANTHROPIC:
		reply, err = ai.CallClaude(modelID, modelConfig, messages, maxTokens)
	case utils.COHERE:
		reply, err = ai.CallCohereV2(modelID, modelConfig, messages, maxTokens)
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

func toAPI(chatHistory []types.Message, userPrompt string, maxTokens int) ([]types.APIMessage, int) {
	// Grab messages count
	messagesCount := len(chatHistory)

	// Init array size of
	collectedMessages := make([]types.APIMessage, 0, messagesCount+1)

	// Init token count with latest user message estimate
	usedTokens := estimateTokenCount(userPrompt)

	// Parse history newest => oldest, break at first overflow
	for i := messagesCount - 1; i >= 0; i-- {
		// Retrieve chat message
		chatMessage := chatHistory[i]

		// Estimate token count for chat message
		tokenCnt := estimateTokenCount(chatMessage.Content)

		// If message token count + previous chat tokens > maxTokens, break as we've hit context window size
		if usedTokens+tokenCnt > maxTokens {
			break
		}

		// Append chat message to collectedMessages array
		collectedMessages = append(collectedMessages, types.APIMessage{
			Role:    chatMessage.Role,
			Content: chatMessage.Content,
		})

		// Increment previous tokens total with token count of latest message
		usedTokens += tokenCnt
	}

	// Reverse in-place with two pointer iteration so order is restored
	// Two pointer iteration with swaps on each step
	for i, j := 0, len(collectedMessages)-1; i < j; i, j = i+1, j-1 {
		collectedMessages[i], collectedMessages[j] = collectedMessages[j], collectedMessages[i]
	}

	// Append the latest & new user prompt to collectedMessages
	collectedMessages = append(collectedMessages, types.APIMessage{
		Role:    "user",
		Content: userPrompt,
	})

	return collectedMessages, usedTokens
}

func estimateTokenCount(s string) int {
	words := len(strings.Fields(s))
	return int(float64(words) * 1.3)
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
