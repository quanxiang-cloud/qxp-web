package contexts

import (
	"net"
	"net/http"
	"time"
)

// NewHTTPClient for connection re-use
func NewHTTPClient(c *HTTPClientConfig) *http.Client {
	client := &http.Client{
		Transport: &http.Transport{
			DialContext: (&net.Dialer{
				Timeout:   time.Duration(c.DialTimeout) * time.Second,
				KeepAlive: time.Duration(c.DialTimeout) * time.Second,
			}).DialContext,
			MaxIdleConns:    c.MaxConn,
			IdleConnTimeout: time.Duration(c.IdleConnTimeout) * time.Second,
		},
		Timeout: time.Duration(c.Timeout) * time.Second,
	}
	return client
}
