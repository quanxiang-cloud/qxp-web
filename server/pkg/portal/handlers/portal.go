package handlers

import (
	"net/http"
	"qxp-web/server/pkg/net"
)

// PortalHandler render portal page
func PortalHandler(w http.ResponseWriter, r *http.Request) {
	userInfo, err := net.GetUserInfo(w, r, GetToken(r))
	if err != nil {
		RedirectToLoginPage(w, r)
		return	
	}
	renderTemplate(w, "portal.html", userInfo)
}
