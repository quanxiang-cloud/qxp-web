package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"time"
)

// HandleSSOLogin ...
func HandleSSOLogin(w http.ResponseWriter, r *http.Request) {
	requestID := contexts.GetRequestID(r)
	code := r.URL.Query().Get("code")
	redirectURL := r.URL.Query().Get("redirect_url")
	if redirectURL == "" {
		redirectURL = "/"
	}

	if code == "" {
		contexts.Logger.Errorf("sso login failed, err: code is empty, request_id: %s", requestID)
		w.Write([]byte("code is required"))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resBody, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/v1/warden/auth", []byte(""), map[string]string{
		"Content-Type": "application/x-www-form-urlencoded",
		"Access-Token": code,
	})

	if errMsg != "" {
		message := fmt.Sprintf("sso login failed, err: %s, request_id: %s", errMsg, requestID)
		contexts.Logger.Error(message)

		w.Write([]byte(message))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var loginResponse LoginResponse
	if err := json.Unmarshal(resBody, &loginResponse); err != nil {
		contexts.Logger.Errorf("failed to unmarshal login response: %s, request_id: %s", err.Error(), requestID)
		w.Write([]byte("sso login failed due to internal error occurred, please contact administrator."))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if loginResponse.Code != 0 {
		message := fmt.Sprintf("sso login failed, err: %s, request_id: %s", loginResponse.Message, requestID)
		contexts.Logger.Error(message)

		w.Write([]byte(message))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	expireTime, err := time.Parse(time.RFC3339, loginResponse.Data.Expire)
	if err != nil {
		message := fmt.Sprintf("failed to parse login response: %s, request_id: %s", err.Error(), requestID)
		contexts.Logger.Errorf(message)

		w.Write([]byte(message))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	session := contexts.GetCurrentRequestSession(r)
	if err := session.Save(r, w); err != nil {
		renderErrorPage(w, r, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "sk",
		Value: session.ID,
		// 29 days
		MaxAge:   86400 * 29,
		Path:     "/",
		SameSite: http.SameSiteNoneMode,
		Secure:   true,
	})

	saveToken(r, loginResponse.Data.AccessToken, loginResponse.Data.RefreshToken, expireTime)
	contexts.Logger.Infof("sso login success, redirect user to %s, request_id: %s", redirectURL, requestID)
	http.Redirect(w, r, redirectURL, http.StatusFound)
}
