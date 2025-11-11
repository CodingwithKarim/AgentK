package config

import (
	"fmt"
	"log"
	"os"
	"strings"
	"sync"

	"github.com/CodingWithKarim/AgentK/internal/services/anthropic"
	"github.com/CodingWithKarim/AgentK/internal/services/openaicompatible"
	"github.com/CodingWithKarim/AgentK/internal/utils"
	"github.com/CodingWithKarim/AgentK/internal/utils/types"
)

type channelResult struct {
	provider types.Provider
	config   *types.ProviderConfig
}

var (
	ProviderConfigsMu sync.RWMutex
	ProviderConfigs   map[types.Provider]*types.ProviderConfig
)

func LoadConfig() error {
	ProviderConfigsMu.Lock()
	ProviderConfigs = make(map[types.Provider]*types.ProviderConfig)
	ProviderConfigsMu.Unlock()

	waitGroup := &sync.WaitGroup{}
	channel := make(chan *channelResult)

	for _, providerName := range utils.Providers {
		waitGroup.Add(1)

		go func(providerName types.Provider) {
			defer waitGroup.Done()
			endpoints := utils.ProviderEndpointsMap[providerName]

			providerConfig := &types.ProviderConfig{
				Endpoints: endpoints,
				Models:    make(map[string]*types.Model),
			}

			key := os.Getenv(fmt.Sprintf("%s_API_KEY", strings.ToUpper(string(providerName))))

			if key == "" {
				return
			}

			if err := loadProvider(providerName, providerConfig, key); err != nil {
				log.Printf("Failed to load provider: %s", providerName)
			}

			log.Printf(`[LoadModels] provider=%s`, providerName)

			channel <- &channelResult{
				provider: providerName,
				config:   providerConfig,
			}

		}(providerName)
	}

	go func() {
		waitGroup.Wait()
		close(channel)
	}()

	for result := range channel {
		ProviderConfigs[result.provider] = result.config
	}

	debugCount()

	return nil
}

func loadProvider(providerName types.Provider, providerConfig *types.ProviderConfig, key string) error {
	if providerConfig.Models == nil {
		providerConfig.Models = make(map[string]*types.Model)
	}

	endpoint := providerConfig.Endpoints.BaseURL

	if providerConfig.Endpoints.ModelEndpoint != "" {
		endpoint = providerConfig.Endpoints.ModelEndpoint
	}

	var (
		models []*types.Model
		err    error
	)

	switch providerName {
	case utils.ANTHROPIC:
		models, err = anthropic.LoadModels(key, providerName)
	case utils.PERPLEXITY:
		models = loadStaticModels()
	default:
		models, err = openaicompatible.LoadModels(key, endpoint, providerName)
	}
	if err != nil {
		log.Println("[LoadModels] provider=", providerName, "error:", err)
		return err
	}

	for _, m := range models {
		providerConfig.Models[m.ID] = m
	}

	return nil
}
