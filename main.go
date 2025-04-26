package main

import (
	"log"
	"os"

	"github.com/CodingWithKarim/AgentK/config"
	"github.com/CodingWithKarim/AgentK/internal/api"
	"github.com/CodingWithKarim/AgentK/internal/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	// load .env file
	if err := godotenv.Load("agentk.env"); err != nil {
		log.Println("❌ Failed to load .env file:", err)
	} else {
		log.Println("✅ Loaded .env file")
	}

	for key, mc := range config.ModelConfigRegistry {
		mc.APIKey = os.Getenv(mc.APIKeyEnv)

		if mc.APIKey == "" {
			log.Fatalf("❌ missing %s for model %s", mc.APIKeyEnv, key)
		}
	}
}

func main() {
	// Create a gin router to handle requests
	router := gin.Default()

	// Init database
	if err := database.Initialize("app.db"); err != nil {
		log.Fatal("❌ Failed to initialize database:", err)
		return
	}

	defer database.Close()

	// Set up routes
	router.GET("/api/sessions", api.GetSessionsHandler)
	router.GET("/api/models", api.GetModelsHandler)
	router.POST("/api/chat", api.PostChatHandler)
	router.POST("/api/clear", api.ClearContextHandler)
	router.POST("/api/sessions", api.CreateSessionHandler)
	router.POST("/api/history", api.GetChatHistoryHandler)
	router.DELETE("/api/sessions/:id", api.DeleteSessionHandler)

	// Start server
	router.Run(":3000")
}
