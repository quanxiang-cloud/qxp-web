package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"time"

	"github.com/tidwall/gjson"
)

type contextKey int

const (
	ctxUser contextKey = iota
	ctxToken
	ctxUA
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

// Department represents department fields
type Department struct {
	ID                 string `json:"id"`
	Grade              int    `json:"grade"`
	Pid                string `json:"pid"`
	SuperID            string `json:"superID"`
	DepartmentLeaderID string `json:"departmentLeaderID"`
	DepartmentName     string `json:"departmentName"`
}

// User represents user fields
type User struct {
	ID       string     `json:"id"`
	UserName string     `json:"userName"`
	Email    string     `json:"email"`
	Phone    string     `json:"phone"`
	Avatar   string     `json:"avatar"`
	Status   int        `json:"status"`
	DepIds   []string   `json:"depIds"`
	Dep      Department `json:"dep"`
}

func getTokenKey(r *http.Request) string {
	session := contexts.GetCurrentRequestSession(r)

	return fmt.Sprintf("portal:session:%s:token", session.ID)
}

func getRefreshTokenKey(r *http.Request) string {
	session := contexts.GetCurrentRequestSession(r)

	return fmt.Sprintf("portal:session:%s:refresh_token", session.ID)
}

func getToken(r *http.Request) string {
	tokenKey := getTokenKey(r)
	token := contexts.Cache.Get(tokenKey).Val()
	if token != "" {
		return token
	}

	refreshToken := getRefreshToken(r)
	if refreshToken == "" {
		return ""
	}

	if !renewToken(r, refreshToken) {
		return ""
	}

	return contexts.Cache.Get(tokenKey).Val()
}

func getRefreshToken(r *http.Request) string {
	return contexts.Cache.Get(getRefreshTokenKey(r)).Val()
}

// renewToken refresh token
func renewToken(r *http.Request, refreshToken string) bool {
	requestID := contexts.GetRequestID(r)
	respBody, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/v1/oauth2c/in/refresh", nil, map[string]string{
		"Content-Type":  "application/x-www-form-urlencoded",
		"Refresh-Token": refreshToken,
		"User-Agent":    r.Header.Get("User-Agent"),
	})

	if errMsg != "" {
		contexts.Logger.Errorf("refresh token failed: %s, request_id: %s", errMsg, requestID)
		return false
	}

	var refreshTokenResponse RefreshTokenResponse
	if err := json.Unmarshal(respBody, &refreshTokenResponse); err != nil {
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

	saveToken(r, refreshTokenResponse.Data.AccessToken, refreshTokenResponse.Data.RefreshToken, expireTime)

	return true
}

func saveToken(r *http.Request, token string, refreshToken string, expireTime time.Time) {
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

func getCurrentUser(r *http.Request) *User {
	respBody, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/v1/org/userUserInfo", nil, map[string]string{
		"Access-Token": getToken(r),
	})

	if errMsg != "" {
		contexts.Logger.Errorf("get user info error: %s", errMsg)
		return nil
	}

	var user User
	userRaw := gjson.Get(string(respBody), "data").Raw
	err := json.Unmarshal([]byte(userRaw), &user)
	if err != nil {
		contexts.Logger.Errorf("failed to unmarshal user, err: %s", err.Error())
		return nil
	}

	return &user
}

// IsUserLogin judge wheather user is login
func IsUserLogin(r *http.Request) bool {
	if !HasToken(r) {
		return false
	}

	token := contexts.Cache.Get(getTokenKey(r)).Val()
	_, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/v1/org/userUserInfo", nil, map[string]string{
		"Access-Token": token,
	})

	if errMsg != "" {
		return false
	}

	return true
}

// HasToken return current session has token
func HasToken(r *http.Request) bool {
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

// DecoratRequest will associated request context with current user and it's token
func DecoratRequest(r *http.Request) *http.Request {
	token := getToken(r)
	user := getCurrentUser(r)
	userAgent := r.Header.Get("User-Agent")

	ctx := r.Context()
	ctx = context.WithValue(ctx, ctxToken, token)
	ctx = context.WithValue(ctx, ctxUser, user)
	ctx = context.WithValue(ctx, ctxUA, userAgent)
	r = r.WithContext(ctx)

	return r
}
