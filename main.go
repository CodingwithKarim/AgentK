package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/CodingWithKarim/AgentK/internal/api"
	"github.com/CodingWithKarim/AgentK/internal/config"
	"github.com/joho/godotenv"
)

//go:embed all:frontend/dist
var embeddedFiles embed.FS

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found (using system environment)")
	}

	if err := config.LoadConfig(); err != nil {
		log.Fatal("❌ Failed to load config:", err)
	}

	http.HandleFunc("/api/models", api.ModelsHandler)
	http.HandleFunc("/api/chat", api.ChatHandler)
	http.HandleFunc("/api/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	fileSystem, err := fs.Sub(embeddedFiles, "frontend/dist")

	if err != nil {
		log.Fatal(err)
	}

	http.Handle("/", http.FileServer(http.FS(fileSystem)))

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	if err := http.ListenAndServe("0.0.0.0:"+port, nil); err != nil {
		log.Fatal(err)
	}
}
