package main

import (
	"log"

	"github.com/CodingWithKarim/AgentK/internal/api"
	"github.com/CodingWithKarim/AgentK/internal/config"
	"github.com/CodingWithKarim/AgentK/internal/database"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration for models + APIKeys
	if err := config.LoadConfig(); err != nil {
		log.Fatal("❌ Failed to load config:", err)
	}

	// Initialize database
	if err := database.Initialize("app.db"); err != nil {
		log.Fatal("❌ Failed to initialize database:", err)
	}

	defer database.Close()

	// Create a gin router to handle requests
	router := gin.Default()

	// Set up routes
	router.GET("/api/sessions", api.GetSessionsHandler)
	router.GET("/api/models", api.GetModelsHandler)
	router.POST("/api/chat", api.PostChatHandler)
	router.POST("/api/clear", api.ClearContextHandler)
	router.POST("/api/sessions", api.CreateSessionHandler)
	router.POST("/api/history", api.GetChatHistoryHandler)
	router.POST("/api/rename", api.RenameSessionHandler)
	router.DELETE("/api/sessions/:id", api.DeleteSessionHandler)

	// Start server
	router.Run(":3000")
}
