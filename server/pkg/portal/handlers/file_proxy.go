package handlers

import (
	"bytes"
	"encoding/json"
	"html/template"
	"io"
	"mime/multipart"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"strings"
)

func getFileTarget(r *http.Request) string {
	targetUrl := contexts.APIEndpoint + "/api/v1/fileserver"

	return targetUrl + r.URL.Path
}

func jsonResponse(w http.ResponseWriter, payload interface{}) {
	jsonStr, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonStr)
}

// FileProxyHandler Handler used to broker file requests
func FileProxyHandler(w http.ResponseWriter, r *http.Request) {
	requestID := contexts.GetRequestID(r)
	target := getFileTarget(r)

	method := r.Method
	req, err := http.NewRequestWithContext(r.Context(), http.MethodPost, target, nil)
	if err != nil {
		contexts.Logger.Error("failed to build request: %s", err.Error())
		renderErrorPage(w, r, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
		return
	}
	contexts.Logger.Debugf(
		"proxy api request, method: %s, url: %s, header: %s request_id: %s", method, target, req.Header, contexts.GetRequestID(r))

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Access-Token", getToken(r))
	req.Header.Set("User-Agent", r.Header.Get("User-Agent"))
	req.Header.Set("X-Request-ID", requestID)

	resp, body, errMsg := contexts.RetrieveResponse(req)
	if errMsg != "" {
		contexts.Logger.Errorf("do request proxy error: %s, request_id: %s", err.Error(), contexts.GetRequestID(r))
		w.WriteHeader(500)
		w.Write([]byte("internal error"))
		return
	}
	w.Header().Add("Content-Type", resp.Header.Get("Content-Type"))
	cacheControl := resp.Header.Get("Cache-Control")
	if len(cacheControl) == 0 {
		cacheControl = "public, max-age=31536000"
	}
	w.Header().Add("Cache-Control", cacheControl)
	w.WriteHeader(resp.StatusCode)
	if strings.HasSuffix(r.URL.Path, "index.html") {
		body = renderTokenInHTML(r, body)
	}
	w.Write(body)
}

func FileUploadHandler(w http.ResponseWriter, r *http.Request) {
	requestID := contexts.GetRequestID(r)

	appID := r.FormValue("appID")
	_, fh, _ := r.FormFile("file")

	bodyBuf := &bytes.Buffer{}
	bodyWriter := multipart.NewWriter(bodyBuf)
	writer, err := bodyWriter.CreatePart(fh.Header)
	if err != nil {
		contexts.Logger.Errorf("failed to create file writer: %s, request_id: %s", err.Error(), requestID)
		jsonResponse(w, map[string]interface{}{
			"code": -1,
			"msg":  err.Error(),
		})
		return
	}

	f, err := fh.Open()
	if err != nil {
		contexts.Logger.Errorf("failed to open uploaded file: %s, request_id: %s", err.Error(), requestID)
		jsonResponse(w, map[string]interface{}{
			"code": -1,
			"msg":  err.Error(),
		})
		return
	}

	defer f.Close()

	// copy file stream
	io.Copy(writer, f)

	// append extra field
	bodyWriter.WriteField("appID", appID)
	bodyWriter.Close()

	// build request
	req, err := http.NewRequest(http.MethodPost, contexts.APIEndpoint+"/api/v1/fileserver/compress", bodyBuf)

	if err != nil {
		contexts.Logger.Errorf("proxy upload req error: %s, request_id: %s", err.Error(), requestID)
		jsonResponse(w, map[string]interface{}{
			"code": -1,
			"msg":  err.Error(),
		})
		return
	}

	req.Header.Set("Access-Token", getToken(r))
	req.Header.Set("Content-Type", bodyWriter.FormDataContentType())
	req.Header.Set("User-Agent", r.Header.Get("User-Agent"))
	req.Header.Set("X-Request-ID", requestID)

	req.ContentLength = int64(bodyBuf.Len())

	_, respBody, errMsg := contexts.RetrieveResponse(req)

	if errMsg != "" {
		contexts.Logger.Errorf("failed to upload file, err: %s, request_id: %s", errMsg, requestID)
		jsonResponse(w, map[string]interface{}{
			"code": -1,
			"msg":  errMsg,
		})
		return
	}

	var result map[string]interface{}
	json.Unmarshal(respBody, &result)

	jsonResponse(w, result)
}

func renderTokenInHTML(r *http.Request, rawHTML []byte) []byte {
	token := getToken(r)
	if token == "" {
		return rawHTML
	}

	tmpl, err := template.New("").Parse(string(rawHTML))
	if err != nil {
		contexts.Logger.Warningln("failed to parse raw html error: ", err.Error())
		return rawHTML
	}

	htmlBuffer := &bytes.Buffer{}
	err = tmpl.Execute(htmlBuffer, map[string]string{"token": token})
	if err != nil {
		contexts.Logger.Warningln("failed to render to token into html: ", err.Error())
		return rawHTML
	}

	return htmlBuffer.Bytes()
}
