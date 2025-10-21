package sessionservice

import (
	"fmt"
	"log"

	"github.com/CodingWithKarim/AgentK/internal/database"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
	"github.com/google/uuid"
)

func GetAllSessions() (*types.SessionsResponse, error) {
	// Retrieve sessions from database
	sessions, err := database.GetSessions()

	if err != nil {
		return nil, err
	}

	// Return sessions-response
	return &types.SessionsResponse{Sessions: sessions}, nil
}

func CreateSession(name string) (*types.Session, error) {
	// Create session from name passed in from UI and a random UUID
	session := &types.Session{
		BaseResource: types.BaseResource{
			ID:   uuid.NewString(),
			Name: name,
		},
	}

	// Insert session into database
	if err := database.InsertSession(session); err != nil {
		return nil, err
	}

	// Return created session
	return session, nil
}

func DeleteSession(id string) error {
	if id == "" {
		log.Println("❌ Missing session ID")
		return fmt.Errorf("missing session ID")
	}

	return database.DeleteSession(id)
}

func RenameSession(request *types.RenameSessionRequest) error {
	if request.ID == "" || request.Name == "" {
		log.Println("❌ Missing request fields")

		return fmt.Errorf("missing request fields")
	}

	return database.RenameSession(request.ID, request.Name)
}
