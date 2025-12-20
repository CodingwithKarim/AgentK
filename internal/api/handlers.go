package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	chatservice "github.com/CodingWithKarim/AgentK/internal/chat"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func ChatHandler(response http.ResponseWriter, request *http.Request) {
	// Ensure the request method is POST
	if request.Method != http.MethodPost {
		writeError(response, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	chatRequest := &types.ChatRequest{}

	// Limit the size of the request body to prevent abuse
	decoder := json.NewDecoder(http.MaxBytesReader(response, request.Body, 1<<20))
	decoder.DisallowUnknownFields()

	// Decode the JSON request body into the ChatRequest struct
	if err := decoder.Decode(chatRequest); err != nil {
		writeError(response, http.StatusBadRequest, fmt.Sprintf("Invalid JSON: %v", err))
		return
	}

	// Generate the chat response using the chat service
	llmReply, err := chatservice.GenerateChatResponse(chatRequest)

	if err != nil {
		fmt.Printf(
			"[ERROR] provider=%s model=%s err=%v",
			chatRequest.Provider,
			chatRequest.ModelID,
			err,
		)

		msg := normalizeProviderError(string(chatRequest.Provider), err)

		writeJSON(response, http.StatusBadGateway, map[string]string{
			"error": msg,
		})

		return
	}

	writeJSON(response, http.StatusOK, map[string]any{"response": llmReply})
}

func GetModelsHandler(response http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodGet {
		http.Error(response, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	providerParam := request.URL.Query().Get("provider")

	var models []*types.Model
	var err error

	// If a provider is specified, reload models for that provider only
	if providerParam != "" {
		models, err = chatservice.ReloadProviderModels(types.Provider(providerParam))
	} else {
		models = chatservice.GetAllModels()
	}

	if err != nil {
		writeError(response, http.StatusInternalServerError, fmt.Sprintf("Unable to fetch models: %v", err))
		return
	}

	writeJSON(response, http.StatusOK, map[string]any{"models": models})
}

func GetHealthStatus(response http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodGet {
		writeError(response, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	response.WriteHeader(http.StatusOK)

	_, _ = response.Write([]byte("ok"))
}
