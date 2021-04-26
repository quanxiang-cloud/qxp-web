package contexts

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"time"
)

// A backoff schedule for when and how often to retry failed HTTP
// requests. The first element is the time to wait after the
// first failure, the second the time to wait after the second
// failure, etc. After reaching the last element, retries stop
// and the request is considered failed.
var backoffSchedule = []time.Duration{
	1 * time.Second,
	3 * time.Second,
	10 * time.Second,
}

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

// DoRequest send req with retry
func DoRequest(req *http.Request) (*http.Response, error) {
	var resp *http.Response
	var err error

	for _, backoff := range backoffSchedule {
		resp, err = HTTPClient.Do(req)

		if err == nil {
			break
		}

		Logger.Infof("request error: %s", err.Error())
		Logger.Infof("retrying in %v", backoff)
		time.Sleep(backoff)
	}

	if err != nil {
		Logger.Errorf("failed to send request to API server: %s", err.Error())
		return nil, err
	}

	return resp, nil
}

// RetrieveResponse will send req and return response & response body
func RetrieveResponse(req *http.Request) (*http.Response, []byte, string) {
	resp, err := DoRequest(req)
	if err != nil {
		return nil, nil, err.Error()
	}

	defer resp.Body.Close() // Force closing the response body

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		Logger.Errorf("failed to read response body: %s", err.Error())
		return nil, nil, err.Error()
	}

	return resp, body, ""
}

// SendRequest is an util method for request API Server
func SendRequest(ctx context.Context, method string, fullPath string, body []byte, headers map[string]string) ([]byte, string) {
	requestID := GetContextValue(ctx, CtxRequestID)

	// todo refactor APIEndpoint+fullPath
	req, err := http.NewRequest(method, APIEndpoint+fullPath, bytes.NewBuffer(body))
	if err != nil {
		Logger.Errorf("[request_id=%s] failed to build request: %s", requestID, err.Error())
		return nil, "failed to build request"
	}

	for key, value := range headers {
		req.Header.Add(key, value)
	}

	req.Header.Add("User-Agent", GetContextValue(ctx, CtxUA))

	Logger.Debugf("sending request, method: %s, url: %s, headers: %s", req.Method, req.URL, req.Header)

	resp, respBody, errMsg := RetrieveResponse(req)
	if errMsg != "" {
		return nil, errMsg
	}

	if resp.StatusCode >= http.StatusInternalServerError {
		Logger.Errorf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, fullPath, string(respBody),
		)
		return respBody, fmt.Sprintf("API server response status code >= %d, is %d", http.StatusInternalServerError, resp.StatusCode)
	}

	if resp.StatusCode >= http.StatusBadRequest && resp.StatusCode < http.StatusInternalServerError {
		Logger.Warnf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, fullPath, string(respBody),
		)
		return respBody, fmt.Sprintf("API server response status code >= %d, is %d", http.StatusBadRequest, resp.StatusCode)
	}

	return respBody, ""
}
