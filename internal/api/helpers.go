package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/CodingWithKarim/AgentK/internal/utils"
)

func writeJSON(response http.ResponseWriter, status int, data any) {
	response.Header().Set("Content-Type", "application/json")

	response.WriteHeader(status)

	if err := json.NewEncoder(response).Encode(data); err != nil {
		log.Println("JSON encoding error:", err)
	}
}

func writeError(response http.ResponseWriter, status int, msg string) {
	log.Printf("[ERROR %d]: %s", status, msg)

	writeJSON(response, status, map[string]string{
		"error": msg,
	})
}

func normalizeProviderError(provider string, err error) string {
	msg := strings.ToLower(err.Error())

	if strings.Contains(msg, "401") || strings.Contains(msg, "unauthorized") {
		return fmt.Sprintf("Invalid or missing API key for %s", provider)
	}

	for _, s := range utils.AuthSubstrings {
		if strings.Contains(msg, s) {
			return fmt.Sprintf("Invalid or missing API key for %s", provider)
		}
	}

	if strings.Contains(msg, "400") || strings.Contains(msg, "bad request") {
		return fmt.Sprintf(
			"Chat request was rejected by %s. Apparently it's a bad request but %s gave no further details.",
			provider,
			provider,
		)
	}

	return fmt.Sprintf(
		"Chat request denied. Unfortunately %s declined the request without explanation.",
		provider,
	)
}
