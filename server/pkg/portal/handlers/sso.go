package handlers

import (
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"time"
)

// HandleSSOLogin ...
func HandleSSOLogin(w http.ResponseWriter, r *http.Request) {
	requestID := contexts.GetRequestID(r)
	code := r.URL.Query().Get("code")
	url := r.URL.Query().Get("redirect_url")

	if code == "" {
		contexts.Logger.Errorf("sso login failed, err: code is empty, request_id: %s", requestID)
		w.Write([]byte("code is required"))
		return
	}

	resBody, err := contexts.SendRequest(r.Context(), "POST", "/api/v1/jwt/auth", []byte(""), map[string]string{
		"Content-Type": "application/json",
		"Access-Token": code,
	})
	if err != "" {
		contexts.Logger.Errorf("sso login failed, err: %s, request_id: %s", err, requestID)
		w.Write([]byte("login failed"))
		return
	}

	var loginResponse LoginResponse
	if err := json.Unmarshal(resBody, &loginResponse); err != nil {
		contexts.Logger.Errorf("sso login failed, err: %s, request_id: %s", err.Error(), requestID)
		w.Write([]byte("login failed"))
		return
	}

	if loginResponse.Code != 0 {
		contexts.Logger.Errorf("sso login failed, err: %s, request_id: %s", loginResponse.Message, requestID)
		w.Write([]byte("login failed"))
		return
	}

	if expireTime, err := time.Parse(time.RFC3339, loginResponse.Data.Expire); err == nil {
		saveToken(r, loginResponse.Data.AccessToken, loginResponse.Data.RefreshToken, expireTime)
		contexts.Logger.Infof("sso login success, redirect to %s, request_id: %s", url, requestID)
		http.Redirect(w, r, url, http.StatusFound)
	} else {
		contexts.Logger.Errorf("sso login failed, err: %s, request_id: %s", err.Error(), requestID)
		w.Write([]byte("login failed"))
		return
	}
}
