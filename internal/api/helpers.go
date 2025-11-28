package api

import (
	"encoding/json"
	"log"
	"net/http"
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
