package handlers

import (
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
	token := getToken(r)
	refreshToken := getRefreshToken(r)

	tokenKey := getTokenKey(r)
	refreshTokenKey := getRefreshTokenKey(r)
	contexts.Cache.Del(tokenKey)
	contexts.Cache.Del(refreshTokenKey)

	requestID := contexts.GetRequestID(r)
	_, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/v1/oauth2s/jwt/loginout", nil, map[string]string{
		"Content-Type":  "application/x-www-form-urlencoded",
		"Refresh-Token": refreshToken,
		"Access-Token":  token,
	})

	http.Redirect(w, r, "/", http.StatusFound)

	if errMsg != "" {
		contexts.Logger.Errorf("send logout request failed: %s, request_id: %s", errMsg, requestID)
	}
}
