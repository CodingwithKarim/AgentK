package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

var database *sql.DB

func Initialize(filepath string) error {
	var err error
	database, err = sql.Open("sqlite", filepath)

	if err != nil {
		log.Println("❌ Failed to open SQLite DB:", err)
		return err
	}

	if err := database.Ping(); err != nil {
		log.Println("❌ Failed to ping SQLite DB:", err)
		return err
	}

	// Enable foreign key constraints
	// This needs to be done since we are using "modernc.org/sqlite" driver instead of github.com/mattn/go-sqlite3
	// Standard driver requires a gcc compiler installed
	if _, err := database.Exec("PRAGMA foreign_keys = ON;"); err != nil {
		log.Println("❌ Failed to enable foreign keys:", err)
		return err
	}

	if err := createTables(database); err != nil {
		log.Println("❌ Failed to create tables:", err)
		return err
	}

	return nil
}

func createTables(database *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS sessions (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS messages (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		sessionID TEXT NOT NULL,
		model TEXT NOT NULL,
		model_name TEXT NOT NULL,
		role TEXT NOT NULL, -- "user" or "assistant"
		content TEXT NOT NULL,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (sessionID) REFERENCES sessions(id) ON DELETE CASCADE
	);`

	if _, err := database.Exec(schema); err != nil {
		log.Println("❌ Failed to create schema:", err)
		return err
	}

	return nil
}

func Close() {
	if database != nil {
		database.Close()
	}
}
