package api

import (
	"net/http"

	chatservice "github.com/CodingWithKarim/AgentK/internal/services/chat"
	sessionservice "github.com/CodingWithKarim/AgentK/internal/services/session"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/gin-gonic/gin"
)

func GetModelsHandler(context *gin.Context) {
	// Retrieve models from config file and return to client as JSON
	context.JSON(http.StatusOK, types.ModelsResponse{
		Models: chatservice.GetUIModels(),
	})
}

func GetSessionsHandler(context *gin.Context) {
	// Retrieve sessions from session service
	sessions, err := sessionservice.GetAllSessions()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve sessions",
		})
		return
	}

	// Return sessions response as JSON
	context.JSON(http.StatusOK, sessions)
}

func CreateSessionHandler(context *gin.Context) {
	// Init session variable
	var request types.Session

	// Try Bind JSON from request body to session variable
	if err := context.ShouldBindJSON(&request); err != nil || request.Name == "" {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Name is required"})
		return
	}

	// Create new session
	session, err := sessionservice.CreateSession(request.Name)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}

	// Send session back to client as JSON
	context.JSON(http.StatusOK, session)
}

func DeleteSessionHandler(context *gin.Context) {
	// Delete session
	if err := sessionservice.DeleteSession(context.Param("id")); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete session"})
		return
	}

	// Return success message
	context.JSON(http.StatusOK, gin.H{"message": "Session deleted"})

}

func ClearContextHandler(context *gin.Context) {
	var request types.ClearContextRequest

	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := chatservice.ClearChatContext(&request); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear context"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Context cleared"})
}

func GetChatHistoryHandler(context *gin.Context) {
	// Init request variable
	var request types.ChatHistoryRequest

	// Try Bind JSON from request body to request variable
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	chatMessages, err := chatservice.FetchChatHistory(&request)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve messages"})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"messages": chatMessages,
	})
}

func PostChatHandler(c *gin.Context) {
	var request types.ChatRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	responseMessage, err := chatservice.PostChatMessage(&request)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to process chat message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"response": responseMessage})
}
