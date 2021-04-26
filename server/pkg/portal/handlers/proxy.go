package handlers

import (
	"bytes"
	"io"
	"net/http"
	"net/url"
	"qxp-web/server/pkg/contexts"
)

func getTargetURL(r *http.Request) string {
	targetURL := url.URL{
		Scheme:   contexts.Config.APIEndpoint.Protocol,
		Host:     contexts.Config.APIEndpoint.Hostname,
		Path:     r.URL.Path,
		RawQuery: r.URL.RawQuery,
	}

	return targetURL.String()
}

// ProxyAPIHandler proxy helper for endpoint api
func ProxyAPIHandler(w http.ResponseWriter, r *http.Request) {
	method := r.Method
	targetURL := getTargetURL(r)

	req, err := http.NewRequest(method, targetURL, r.Body)
	if err != nil {
		contexts.Logger.Error("failed to build request: %s", err.Error())
		renderErrorPage(w, r, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
		return
	}

	req.Header.Set("Access-Token", getToken(r))
	req.Header.Set("Content-Type", r.Header.Get("Content-Type"))
	req.Header.Set("User-Agent", r.Header.Get("User-Agent"))

	contexts.Logger.Debugf(
		"proxy api request, method: %s, url: %s, header: %s request_id: %s", method, targetURL, req.Header, contexts.GetRequestID(r))

	resp, err := contexts.DoRequest(req)
	if err != nil {
		contexts.Logger.Errorf("do request proxy error: %s, request_id: %s", err.Error(), contexts.GetRequestID(r))
		w.WriteHeader(500)
		w.Write([]byte("internal error"))
		return
	}
	defer resp.Body.Close()

	buffer := &bytes.Buffer{}
	_, err = io.Copy(buffer, resp.Body)
	if err != nil {
		contexts.Logger.Errorf("copy response body error: %s", err.Error())
		w.WriteHeader(400)
		w.Write([]byte("Bad Request"))
		return
	}

	w.Header().Add("Content-Type", resp.Header.Get("Content-Type"))
	w.WriteHeader(resp.StatusCode)
	w.Write(buffer.Bytes())
}
