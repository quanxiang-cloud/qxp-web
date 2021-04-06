package contexts

import (
	"bytes"
	"context"
	"fmt"
	"io"
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

// SendRequest is an util method for request API Server
func SendRequest(ctx context.Context, method string, fullPath string, body io.Reader, headers map[string]string) (*bytes.Buffer, string) {
	requestID := ctx.Value(RequestID).(string)

	req, err := http.NewRequest(method, APIEndpoint+fullPath, body)
	if err != nil {
		Logger.Errorf("[request_id=%s] failed to build request: %s", requestID, err.Error())
		return nil, "failed to build request"
	}

	for key, value := range headers {
		req.Header.Add(key, value)
	}

	Logger.Debugf("sending request, method: %s, url: %s, headers: %s", req.Method, req.URL, req.Header)

	resp, err := HTTPClient.Do(req)
	if err != nil {
		Logger.Errorf("failed to send request to API server: %s", err.Error())
		return nil, "failed to send request to API server"
	}
	defer resp.Body.Close() // Force closing the response body

	buffer := &bytes.Buffer{}
	_, err = io.Copy(buffer, resp.Body)
	if err != nil {
		Logger.Errorf("copy response body error: %s", err.Error())
		return nil, http.StatusText(http.StatusInternalServerError)
	}

	if resp.StatusCode >= http.StatusInternalServerError {
		Logger.Errorf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, fullPath, buffer.String(),
		)
		return buffer, fmt.Sprintf("API server response status code >= %d", http.StatusInternalServerError)
	}

	if resp.StatusCode >= http.StatusBadRequest && resp.StatusCode < http.StatusInternalServerError {
		Logger.Warnf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, fullPath, buffer.String(),
		)
		return buffer, fmt.Sprintf("API server response status code >= %d", http.StatusBadRequest)
	}

	return buffer, ""
}

// SendRequestWitoutAuth is an util method for request Billing Server
func SendRequestWitoutAuth(ctx context.Context, method string, fullPath string, body io.Reader, headers map[string]string) (*bytes.Buffer, string) {
	requestID := ctx.Value(RequestID).(string)

	req, err := http.NewRequest(method, APIEndpoint+fullPath, body)
	for key, value := range headers {
		req.Header.Add(key, value)
	}
	if err != nil {
		Logger.Errorf("[request_id=%s] failed to build request: %s", requestID, err.Error())
		return nil, "failed to build request"
	}

	Logger.Debugf(
		"[request_id=%s] sending request, method: %s, url: %s, headers: %s",
		requestID, req.Method, req.URL, req.Header,
	)

	resp, err := HTTPClient.Do(req)
	if err != nil {
		Logger.Errorf("[request_id=%s] failed to send request to API server: %s", requestID, err.Error())
		return nil, "failed to send request to API server"
	}
	defer resp.Body.Close() // Force closing the response body

	buffer := &bytes.Buffer{}
	_, err = io.Copy(buffer, resp.Body)
	if err != nil {
		Logger.Errorf("[request_id=%s] copy response body error: %s", requestID, err.Error())
		return nil, http.StatusText(http.StatusInternalServerError)
	}

	if resp.StatusCode >= http.StatusInternalServerError {
		Logger.Errorf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, fullPath, buffer.String(),
		)
		return buffer, fmt.Sprintf("API server response status code >= %d", http.StatusInternalServerError)
	}

	if resp.StatusCode >= http.StatusBadRequest && resp.StatusCode < http.StatusInternalServerError {
		Logger.Warnf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, fullPath, buffer.String(),
		)
		return buffer, fmt.Sprintf("API server response status code >= %d", http.StatusBadRequest)
	}

	return buffer, ""
}
