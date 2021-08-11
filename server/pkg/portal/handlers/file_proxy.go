package handlers

import (
	"net/http"
	"net/url"
	"qxp-web/server/pkg/contexts"
	"strings"
)

func getFileTarget(r *http.Request) string {
	targetURL := url.URL{
		Scheme: contexts.Config.MinIOHttpConfig.Protocol,
		Host:   contexts.Config.MinIOHttpConfig.HostName,
		Path:   strings.TrimPrefix(r.URL.Path, contexts.Config.MinIOHttpConfig.UrlPrefix),
	}
	return targetURL.String()
}

// FileProxyHandler Handler used to broker file requests
func FileProxyHandler(w http.ResponseWriter, r *http.Request) {
	target := getFileTarget(r)
	method := r.Method
	req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, target, nil)
	if err != nil {
		contexts.Logger.Error("failed to build request: %s", err.Error())
		renderErrorPage(w, r, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
		return
	}
	contexts.Logger.Debugf(
		"proxy api request, method: %s, url: %s, header: %s request_id: %s", method, target, req.Header, contexts.GetRequestID(r))

	resp, body, errMsg := contexts.RetrieveResponse(req)
	if errMsg != "" {
		contexts.Logger.Errorf("do request proxy error: %s, request_id: %s", err.Error(), contexts.GetRequestID(r))
		w.WriteHeader(500)
		w.Write([]byte("internal error"))
		return
	}
	w.Header().Add("Content-Type", resp.Header.Get("Content-Type"))
	w.WriteHeader(resp.StatusCode)
	w.Write(body)
}
