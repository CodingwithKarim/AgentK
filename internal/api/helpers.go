package api

import (
	"encoding/json"
	"net/http"
)

func writeJSON(response http.ResponseWriter, status int, data any) {
	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(status)
	_ = json.NewEncoder(response).Encode(data)
}

func writeError(response http.ResponseWriter, status int, msg string) {
	writeJSON(response, status, map[string]string{"error": msg})
}
