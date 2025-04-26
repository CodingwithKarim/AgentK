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

	// Convert to API format
	apiMessages := toAPI(chatMessages, request.Message)

	// Call the LLM provider
	reply, err := callModelProvider(request.ModelID, modelConfig, apiMessages)
	if err != nil {
		log.Printf("❌ Error calling model %q for session %q: %v",
			request.ModelID, request.SessionID, err)
		return "", err
	}

	// Save messages to database
	saveMessagePair(request.SessionID, request.ModelID, request.Message, reply)

	return reply, nil
}
