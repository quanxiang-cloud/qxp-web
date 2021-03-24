package handlers

import (
	"encoding/json"
	"fmt"
	"log"
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

func getTokenKey(r *http.Request) string {
	session := contexts.GetCurrentRequestSession(r)

	return fmt.Sprintf("portal:session:%s:token", session.ID)
}

func getRefreshTokenKey(r *http.Request) string {
	session := contexts.GetCurrentRequestSession(r)

	return fmt.Sprintf("portal:session:%s:refresh_token", session.ID)
}

// IsUserLogin judge wheather user is login
func IsUserLogin(r *http.Request) bool {
	token := contexts.Cache.Get(getTokenKey(r)).Val()
	if token != "" {
		return true
	}

	refreshToken := contexts.Cache.Get(getRefreshTokenKey(r)).Val()
	if refreshToken == "" {
		return false
	}

	return renewToken(r, refreshToken)
}

func GetToken(r *http.Request) string {
	tokenKey := getTokenKey(r)
	token := contexts.Cache.Get(tokenKey).Val()
	if token != "" {
		return token
	}

	refreshToken := GetRefreshToken(r)
	if refreshToken == "" {
		return ""
	}

	if !renewToken(r, refreshToken) {
		return ""
	}

	return contexts.Cache.Get(tokenKey).Val()
}

func GetRefreshToken(r *http.Request) string {
	return contexts.Cache.Get(getRefreshTokenKey(r)).Val()
}

// renewToken refresh token
func renewToken(r *http.Request, refreshToken string) bool {
	requestID := contexts.GetRequestID(r)
	respBuffer, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/oauth2c/v1/in/refresh", nil, map[string]string{
		"Content-Type":  "application/x-www-form-urlencoded",
		"Refresh-Token": refreshToken,
		"User-Agent":    r.Header.Get("User-Agent"),
	})

	if errMsg != "" {
		contexts.Logger.Errorf("refresh token failed: %s, request_id: %s", errMsg, requestID)
		return false
	}

	var refreshTokenResponse RefreshTokenResponse
	if err := json.Unmarshal(respBuffer.Bytes(), &refreshTokenResponse); err != nil {
		contexts.Logger.Errorf("failed to unmarshal refresh token body, err: %s, request_id: %s", err.Error(), requestID)
		return false
	}

	if refreshTokenResponse.Data.AccessToken == "" {
		return false
	}

	expireTime, err := time.Parse(time.RFC3339, refreshTokenResponse.Data.Expire)
	if err != nil {
		// todo log error message
		return false
	}

	SaveToken(r, refreshTokenResponse.Data.AccessToken, refreshTokenResponse.Data.RefreshToken, expireTime)

	return true
}

func SaveToken(r *http.Request, token string, refreshToken string, expireTime time.Time) {
	tokenKey := getTokenKey(r)
	refreshTokenKey := getRefreshTokenKey(r)
	duration := time.Until(expireTime) - time.Hour

	err := contexts.Cache.Set(tokenKey, token, duration).Err()
	if err != nil {
		log.Fatalf("failed to save user token to cache: %s", err.Error())
	}

	err = contexts.Cache.Set(refreshTokenKey, refreshToken, time.Hour*72).Err()
	if err != nil {
		log.Fatalf("failed to save user refresh_token to cache: %s", err.Error())
	}
}

// RedirectToLoginPage redirect to login page
func RedirectToLoginPage(w http.ResponseWriter, r *http.Request) {
	session := contexts.GetCurrentRequestSession(r)
	session.Values["redirect_url"] = r.URL.Path
	if err := session.Save(r, w); err != nil {
		renderErrorPage(w, r, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
		return
	}

	// path: /login/password /login/captcha
	http.Redirect(w, r, "/login/password", http.StatusFound)
}

// ShouldLogin redirect to login if 401
// todo delete this
func ShouldLogin(w http.ResponseWriter, r *http.Request, resp *http.Response) bool {
	if resp.StatusCode == 401 {
		http.Redirect(w, r, "/login/password", http.StatusFound)
		return true
	}
	return false
}
