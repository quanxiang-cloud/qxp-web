package handlers

import (
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"
)

// LogoutResponse logout response struct
type LogoutResponse struct {
	Code    int64  `json:"code"`
	Message string `json:"message"`
	Data    string `json:"data"`
}

// LogoutHandler render logout page
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	session, err := contexts.GetCurrentRequestSession(r)
	token, _ := contexts.GetSessionToken(r)
	if err != nil {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}
	session.Values["refresh_token"] = nil
	contexts.Cache.Del("token")
	session.Save(r, w)
	contexts.Logger.Debug("user logout, redirect to /")
	http.Redirect(w, r, "/", http.StatusFound)
	requestID := contexts.GetRequestID(r)
	resp, respBuffer, errMsg := contexts.SendRequest(r, "POST", "/api/oauth2c/v1/loginout", nil, map[string]interface{}{
		"Content-Type":  "application/x-www-form-urlencoded",
		"Refresh-Token": session.Values["refresh_token"].(string),
		"Access-Token":  token,
	})
	if errMsg != "" {
		contexts.Logger.Errorf("send logout request failed: %s, request_id: %s", errMsg, requestID)
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}
	if ShouldLogin(w, r, resp) {
		return
	}
	var logoutResponse LogoutResponse
	if err := json.Unmarshal(respBuffer.Bytes(), &logoutResponse); err != nil {
		contexts.Logger.Errorf("parse logout request body failed: %s, request_id: %s", err.Error(), requestID)
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}
	if logoutResponse.Code != 0 {
		contexts.Logger.Errorf("logout failed, request_id: %s", requestID)
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}
	contexts.Logger.Debug("user session has been revoked")
}
