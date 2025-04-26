package ai

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"

	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

type APIClient struct {
	Endpoint     string
	AuthHeader   string
	AuthToken    string
	ExtraHeaders map[string]string
}

func NewOpenAIClient(modelConfig *types.ModelConfig) *APIClient {
	return &APIClient{
		Endpoint:   modelConfig.Endpoint,
		AuthHeader: "Authorization",
		AuthToken:  "Bearer " + modelConfig.APIKey,
		ExtraHeaders: map[string]string{
			"Content-Type": "application/json",
		},
	}
}

func NewClaudeClient(modelConfig *types.ModelConfig) *APIClient {
	return &APIClient{
		Endpoint:   modelConfig.Endpoint,
		AuthHeader: "x-api-key",
		AuthToken:  modelConfig.APIKey,
		ExtraHeaders: map[string]string{
			"Content-Type":      "application/json",
			"anthropic-version": "2023-06-01",
		},
	}
}

func NewCohereClient(modelConfig *types.ModelConfig) *APIClient {
	return &APIClient{
		Endpoint:   modelConfig.Endpoint,
		AuthHeader: "Authorization",
		AuthToken:  "Bearer " + modelConfig.APIKey,
		ExtraHeaders: map[string]string{
			"Content-Type": "application/json",
		},
	}
}

func (apiClient *APIClient) SendRequest(payload interface{}, extractLLMResponseText func([]byte) (string, error)) (string, error) {
	// Serialize to JSON
	requestBody, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", apiClient.Endpoint, bytes.NewBuffer(requestBody))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	// Set auth header
	req.Header.Set(apiClient.AuthHeader, apiClient.AuthToken)

	// Set extra headers
	for key, value := range apiClient.ExtraHeaders {
		req.Header.Set(key, value)
	}

	// Execute request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body: %w", err)
	}

	// Check status code
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API error (status %d): %s", resp.StatusCode, body)
	}

	// Extract text using the provided function
	return extractLLMResponseText(body)
}

func ExtractOpenAIResponseText(body []byte) (string, error) {
	var parsed types.OpenAIResponse
	if err := json.Unmarshal(body, &parsed); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	// Ensure content was received
	if len(parsed.Choices) == 0 {
		return "", fmt.Errorf("no response received")
	}

	// Return first choice text
	return cleanResponseText(parsed.Choices[0].Message.Content), nil
}

// ExtractClaudeText extracts text from a Claude API response
func ExtractClaudeResponseText(body []byte) (string, error) {
	var parsed types.ClaudeResponse

	if err := json.Unmarshal(body, &parsed); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	// Ensure content was received
	if len(parsed.Content) == 0 {
		return "", fmt.Errorf("no response content received")
	}

	// Return first choice text
	return parsed.Content[0].Text, nil
}

// ExtractCohereText extracts text from a Cohere API response
func ExtractCohereResponseText(body []byte) (string, error) {
	var parsed struct {
		Message struct {
			Role    string `json:"role"`
			Content []struct {
				Text string `json:"text"`
			} `json:"content"`
		} `json:"message"`
	}

	if err := json.Unmarshal(body, &parsed); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	// Ensure content was received
	if len(parsed.Message.Content) == 0 {
		return "", fmt.Errorf("no content in response")
	}

	// Return first content text
	return parsed.Message.Content[0].Text, nil
}

func cleanResponseText(s string) string {
	re := regexp.MustCompile(`\[\d+\]`)

	return re.ReplaceAllString(s, "")
}
