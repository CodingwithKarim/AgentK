package main

import (
	"context"
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/CodingWithKarim/AgentK/internal/api"
	"github.com/CodingWithKarim/AgentK/internal/llms"
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/joho/godotenv"
	"github.com/openai/openai-go"
)

//go:embed frontend/dist/*
var embeddedFiles embed.FS

func main() {
	_ = godotenv.Load()

	openAIClient := openai.NewClient()
	anthropicClient := anthropic.NewClient(anthropic.DefaultClientOptions()...)

	llms.InitializeClients(
		&openAIClient, // OpenAI client supports all providers except Anthropic
		&anthropicClient,
	)

	router := http.NewServeMux()

	router.HandleFunc("/api/chat", api.ChatHandler)
	router.HandleFunc("/api/models", api.GetModelsHandler)
	router.HandleFunc("/api/health", api.GetHealthStatus)

	fileSystem, err := fs.Sub(embeddedFiles, "frontend/dist")

	if err != nil {
		log.Fatal(err)
	}

	router.Handle("/", http.FileServer(http.FS(fileSystem))) // Serve frontend at root

	server := &http.Server{
		Addr:    "0.0.0.0:8080",
		Handler: router,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen error: %v", err)
		}
	}()

	log.Println("AgentK Server started on port 8080")

	shutdownChannel := make(chan os.Signal, 1)
	signal.Notify(shutdownChannel, syscall.SIGINT, syscall.SIGTERM)

	<-shutdownChannel

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed: %v", err)
	}

	log.Println("Server shutdown complete.")
}
