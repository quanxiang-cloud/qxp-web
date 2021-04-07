package handlers

import (
	"net/http"
	"qxp-web/server/pkg/contexts"
)

// PortalHandler render portal page
func PortalHandler(w http.ResponseWriter, r *http.Request) {
	userInfo, err := GetUserInfo(w, r, GetToken(r))
	if err != nil {
		tokenKey := getTokenKey(r)
		refreshTokenKey := getRefreshTokenKey(r)
		contexts.Cache.Del(tokenKey)
		contexts.Cache.Del(refreshTokenKey)
		RedirectToLoginPage(w, r)
		return
	}
	renderTemplate(w, "portal.html", userInfo)
}
