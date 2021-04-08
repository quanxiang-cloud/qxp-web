package handlers

import (
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"

	"github.com/tidwall/gjson"
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
	userInfoBytes, _ := json.Marshal(userInfo)
	userStatus := gjson.Get(string(userInfoBytes[:]), "data.status").Num
	if userStatus == 1 {
		http.Redirect(w, r, "/resetPassword", http.StatusFound)	
		return
	}
	renderTemplate(w, "portal.html", map[string]interface{}{
		"user":      userInfo["data"],
		"debugMode": contexts.Config.DevMode,
	})
}
