package chatservice

import (
	"fmt"
	"log"

	"github.com/CodingWithKarim/AgentK/internal/database"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func ClearChatContext(request *types.ClearContextRequest) error {
	if request.SessionID == "" || request.ModelID == "" {
		log.Println("❌ Missing request fields")
		return fmt.Errorf("missing request fields")
	}

	if request.SharedContext {
		return database.ClearSessionContext(request.SessionID)
	}

	return database.ClearModelContext(request.SessionID, request.ModelID)
}

func FetchChatHistory(request *types.ChatHistoryRequest) ([]types.Message, error) {
	if request.SessionID == "" || request.ModelID == "" {
		log.Println("❌ Missing request fields")
		return nil, fmt.Errorf("missing request fields")
	}

	if request.SharedContext {
		return database.GetSessionMessages(request.SessionID)
	}

	return database.GetModelMessages(request.SessionID, request.ModelID)
}

func PostChatMessage(request *types.ChatRequest) (string, error) {
	// Validate the request
	if err := validateChatRequest(request); err != nil {
		return "", err
	}

	// Get the model configuration
	modelConfig, err := fetchModelConfig(request.ModelID)
	if err != nil {
		return "", err
	}

	// Get chat history
	chatMessages, err := getMessageHistory(request)

	if err != nil {
		return "", err
	}

	// Build & trim history + prompt, count tokens used
	apiMessages, totalTokensUsed := toAPI(chatMessages, request.Message, modelConfig.ContextSize)

	// Reserve a small safety buffer off the context window
	tokenBuffer := 300

	// Compute how many tokens remain in the context window
	remaining := modelConfig.ContextSize - totalTokensUsed

	// Don’t use more than (contextSize - buffer)
	allowed := min(remaining, modelConfig.ContextSize-tokenBuffer)

	// Also cap at the model’s own generation limit, if set
	if modelConfig.MaxCompletionTokens > 0 {
		allowed = min(allowed, modelConfig.MaxCompletionTokens)
	}

	// Never go negative
	if allowed < 0 {
		allowed = 0
	}

	// Call the LLM
	reply, err := callModelProvider(request.ModelID, modelConfig, apiMessages, allowed)

	if err != nil {
		log.Printf("❌ Error calling model %q for session %q: %v",
			request.ModelID, request.SessionID, err)
		return "", err
	}

	// Save messages to database
	saveMessagePair(request.SessionID, request.ModelID, request.Message, reply)

	return reply, nil
}
