package contexts

import (
	"fmt"
	"time"

	"github.com/go-redis/redis"
)

// RedisConfig stores a configuration of Redis.
type RedisConfig struct {
	Host    []string `yaml:"host" validate:"required"`
	Timeout int      `yaml:"timeout" default:"15"`
	Port    int      `yaml:"port"`
	DB      int      `yaml:"db" default:"1"`
}

// NewRedisClusterClient creates new Redis cluster connections
func NewRedisClusterClient(c *RedisConfig) (*redis.ClusterClient, error) {
	if c.Timeout == 0 {
		c.Timeout = 5
	}

	cache := redis.NewClusterClient(&redis.ClusterOptions{
		Addrs:        c.Host,
		DialTimeout:  time.Duration(c.Timeout) * time.Second,
		ReadTimeout:  time.Duration(c.Timeout) * time.Second,
		WriteTimeout: time.Duration(c.Timeout) * time.Second,
		MaxRetries:   10,
	})

	return cache, nil
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

	return cache, nil
}
