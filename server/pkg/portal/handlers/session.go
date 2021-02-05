package handlers

import (
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"time"
)

// LoginResponseData login response data struct
type LoginResponseData struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	Expire       string `json:"expiry"`
}

// RefreshTokenResponse refresh token response struct
type RefreshTokenResponse struct {
	Code    int              `json:"code"`
	Message string           `json:"msg"`
	Data    RefreshTokenData `json:"data"`
}

// LoginResponse login response struct
type LoginResponse struct {
	Code    int               `json:"code"`
	Message string            `json:"msg"`
	Data    LoginResponseData `json:"data"`
}

// ResetPasswordResponse reset password response struct
type ResetPasswordResponse struct {
	Code    int    `json:"code"`
	Message string `json:"msg"`
	Data    string `json:"data"`
}

// RefreshTokenData refresh token response data struct
type RefreshTokenData struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	Expire       string `json:"expiry"`
}

// RefreshToken refresh token
func RefreshToken(w http.ResponseWriter, r *http.Request) bool {
	refreshToken := contexts.GetRefreshToken(r)
	if refreshToken == "" {
		return false
	}
	requestID := contexts.GetRequestID(r)
	resp, respBuffer, errMsg := contexts.SendRequest(r, "POST", "/api/oauth2c/v1/in/refresh", nil, map[string]interface{}{
		"Content-Type":  "application/x-www-form-urlencoded",
		"Refresh-Token": refreshToken,
	})
	if errMsg != "" || ShouldLogin(w, r, resp) {
		contexts.Logger.Errorf("refresh token failed: %s, request_id: %s", errMsg, requestID)
		return false
	}
	var refreshTokenResponse RefreshTokenResponse
	if err := json.Unmarshal(respBuffer.Bytes(), &refreshTokenResponse); err != nil {
		contexts.Logger.Errorf("failed to unmarshal refresh token body, err: %s, request_id: %s", err.Error(), requestID)
		return false
	}
	session, err := contexts.GetCurrentRequestSession(r)
	if err != nil {
		contexts.Logger.Errorf("failed to read session err: %s, request_id: %s", err.Error(), requestID)
	}
	if refreshTokenResponse.Data.AccessToken == "" {
		return false
	}
	expireTime, err := time.Parse(time.RFC3339, refreshTokenResponse.Data.Expire)
	if err == nil {
		contexts.Cache.Set("token", refreshTokenResponse.Data.AccessToken, time.Duration(expireTime.UnixNano()))
	}
	session.Values["refresh_token"] = refreshTokenResponse.Data.RefreshToken
	if err := session.Save(r, w); err != nil {
		contexts.Logger.Errorf("failed to save session: %s, request_id: %s", err.Error(), requestID)
		return false
	}
	return true
}

// IsUserLogin judge wheather user is login
func IsUserLogin(w http.ResponseWriter, r *http.Request) bool {
	token, ok := contexts.GetSessionToken(r)
	if !ok {
		return RefreshToken(w, r)
	}
	if token == "" {
		return false
	}
	return true
}

// RedirectToLoginPage redirect to login page
func RedirectToLoginPage(w http.ResponseWriter, r *http.Request, path string) {
	session, err := contexts.GetCurrentRequestSession(r)
	if err != nil {
		renderErrorPage(w, r, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
		return
	}
	session.Values["redirect_url"] = r.URL.Path
	contexts.Cache.Del("token")
	if err = session.Save(r, w); err != nil {
		renderErrorPage(w, r, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
		return
	}
	// path: /login/password /login/captcha
	http.Redirect(w, r, path, http.StatusFound)
}

// ShouldLogin redirect to login if 401
func ShouldLogin(w http.ResponseWriter, r *http.Request, resp *http.Response) bool {
	if resp.StatusCode == 401 {
		http.Redirect(w, r, "/login/password", http.StatusFound)
		return true
	}
	return false
}
