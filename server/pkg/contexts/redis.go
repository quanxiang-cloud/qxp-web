package contexts

import (
	"time"

	"github.com/go-redis/redis/v8"
)

// RedisConfig stores a configuration of Redis.
type RedisConfig struct {
	Hosts    []string `yaml:"hosts" validate:"required"`
	Timeout  int      `yaml:"timeout" default:"15"`
	DB       int      `yaml:"db"  default:"1"`
	Password string   `yaml:"password" default:""`
	Username string   `yaml:"username" default:""`
}

// NewRedisClient creates new Redis connection.
func NewRedisClient(c *RedisConfig) redis.UniversalClient {
	if c.Timeout == 0 {
		c.Timeout = 5
	}

	return redis.NewUniversalClient(&redis.UniversalOptions{
		Addrs:        c.Hosts,
		DB:           c.DB,
		DialTimeout:  time.Duration(c.Timeout) * time.Second,
		ReadTimeout:  time.Duration(c.Timeout) * time.Second,
		WriteTimeout: time.Duration(c.Timeout) * time.Second,
		MaxRetries:   10,
		Password:     c.Password,
		Username:     c.Username,
	})
}
