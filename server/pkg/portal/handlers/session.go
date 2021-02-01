package handlers

import (
	"net/http"
	"qxp-web/server/pkg/contexts"
)

// LoginResponse ... 登录成功之后的响应结构
type LoginResponse struct {
	Token    string `json:"token"`
	UserID   string `json:"user_id"`
	AccessID string `json:"access_id"`
}

// IsUserLogin ... 判断用户是否已经登录
func IsUserLogin(r *http.Request) bool {
	token := contexts.GetSessionToken(r)
	if token == "" {
		return false
	}
	if token == "token" {
		return true
	}
	_, errMsg := contexts.SendRequest(r, "GET", "/v1/users/token", nil)
	if errMsg != "" {
		return false
	}
	return true
}
