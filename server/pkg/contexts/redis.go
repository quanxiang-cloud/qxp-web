package contexts

import (
	"fmt"
	"time"

	"github.com/go-redis/redis"
)

// RedisConfig stores a configuration of Redis.
type RedisConfig struct {
	Host    string `yaml:"host" validate:"required"`
	Port    int    `yaml:"port" validate:"required"`
	DB      int    `yaml:"db" default:"1"`
	Timeout int    `yaml:"timeout" default:"15"`
}

// NewRedisClient creates new Redis connection.
func NewRedisClient(c *RedisConfig) (*redis.Client, error) {
	if c.Timeout == 0 {
		c.Timeout = 5
	}

	cache := redis.NewClient(&redis.Options{
		Addr:         fmt.Sprintf("%s:%d", c.Host, c.Port),
		DB:           c.DB,
		DialTimeout:  time.Duration(c.Timeout) * time.Second,
		ReadTimeout:  time.Duration(c.Timeout) * time.Second,
		WriteTimeout: time.Duration(c.Timeout) * time.Second,
		MaxRetries:   10,
	})

	_, err := cache.Ping().Result()
	if err != nil {
		return nil, err
	}

	return cache, nil
}
