package api

import (
	"encoding/json"
	"net/http"

	chatservice "github.com/CodingWithKarim/AgentK/internal/services/chat"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func ChatHandler(response http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodPost {
		http.Error(response, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	chatRequest := &types.ChatRequest{}

	decoder := json.NewDecoder(http.MaxBytesReader(response, request.Body, 1<<20))
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(chatRequest); err != nil {
		writeError(response, http.StatusBadRequest, "Invalid JSON")
		return
	}

	responseMessage, err := chatservice.PostChatMessage(chatRequest)

	if err != nil {
		writeError(response, http.StatusInternalServerError, "Unable to process chat message")
		return
	}

	writeJSON(response, http.StatusOK, map[string]any{"response": responseMessage})
}

func ModelsHandler(response http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodGet {
		http.Error(response, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	writeJSON(response, http.StatusOK, types.GetModelsResponse{
		Models: chatservice.GetUIModels(),
	})
}
