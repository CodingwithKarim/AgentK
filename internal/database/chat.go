package database

import (
	"database/sql"
	"log"

	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func ClearSessionContext(sessionID string) error {
	_, err := database.Exec(
		"DELETE FROM messages WHERE sessionID = ?",
		sessionID,
	)

	if err != nil {
		log.Printf("❌ Error clearing session context for session %q: %v", sessionID, err)
		return err
	}

	return nil
}

func ClearModelContext(sessionID, modelID string) error {
	_, err := database.Exec(
		"DELETE FROM messages WHERE sessionID = ? AND model = ?",
		sessionID, modelID,
	)

	if err != nil {
		log.Printf("❌ Error clearing model context for session %q and model %q: %v", sessionID, modelID, err)
		return err
	}

	return nil
}

func GetSessionMessages(sessionID string) ([]types.Message, error) {
	rows, err := database.Query(`
        SELECT role, content, timestamp
        FROM messages
        WHERE sessionID = ?
        ORDER BY timestamp ASC
    `, sessionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanMessages(rows)
}

func GetModelMessages(sessionID, modelID string) ([]types.Message, error) {
	rows, err := database.Query(`
        SELECT role, content, timestamp
        FROM messages
        WHERE sessionID = ? AND model = ?
        ORDER BY timestamp ASC
    `, sessionID, modelID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	return scanMessages(rows)
}

func SaveMessage(sessionID, model, role, content string) error {
	_, err := database.Exec(`
		INSERT INTO messages (sessionID, model, role, content)
		VALUES (?, ?, ?, ?)
	`, sessionID, model, role, content)

	if err != nil {
		log.Printf("❌ Failed to save message: %v", err)
	}

	return err
}

func scanMessages(rows *sql.Rows) ([]types.Message, error) {
	msgs := make([]types.Message, 0)

	for rows.Next() {
		m := types.Message{}

		if err := rows.Scan(&m.Role, &m.Content, &m.Timestamp); err != nil {
			continue
		}

		msgs = append(msgs, m)
	}
	return msgs, rows.Err()
}
