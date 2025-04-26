package database

import (
	"log"

	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

func InsertSession(session *types.Session) error {
	if _, err := database.Exec("INSERT INTO sessions (id, name) VALUES (?, ?)", session.ID, session.Name); err != nil {
		log.Printf("❌ Failed to insert session: %v", err)
		return err
	}

	return nil
}

func GetSessions() ([]*types.Session, error) {
	// Execute query to get sessions from database
	rows, err := database.Query("SELECT id, name FROM sessions ORDER BY created_at DESC")

	if err != nil {
		log.Printf("❌ Failed to fetch sessions: %v", err)
		return nil, err
	}

	defer rows.Close()

	// Init sessions array
	var sessions []*types.Session

	// loop through rows from query to construct each session and append to response
	for rows.Next() {
		// Init session pointer
		session := &types.Session{}

		// scan data from query into session fields
		if err := rows.Scan(&session.ID, &session.Name); err != nil {
			log.Printf("⚠️ Failed to scan session: %v", err)
			continue
		}

		// append session to sessions array
		sessions = append(sessions, session)
	}

	if err = rows.Err(); err != nil {
		log.Printf("❌ Row iteration error: %v", err)
		return nil, err
	}

	// Return sessions and nil if successful
	return sessions, nil
}

func DeleteSession(id string) error {
	// Execute query to delete session from database
	_, err := database.Exec(
		"DELETE FROM sessions WHERE id = ?",
		id,
	)

	if err != nil {
		log.Printf("❌ Failed to delete session %s: %v", id, err)
	}

	// Return err if any
	return err
}
