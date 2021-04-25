package handlers

import (
	"net/http"
	"qxp-web/server/pkg/contexts"
)

// PortalHandler render portal page
func PortalHandler(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(ctxUser).(*User)
	if user.Statue == 1 {
		http.Redirect(w, r, "/resetPassword", http.StatusFound)
		return
	}

	renderTemplate(w, "portal.html", map[string]interface{}{
		"user":      user,
		"debugMode": contexts.Config.DevMode,
		"CONFIG":    contexts.Config.ClientConfig,
	})
}
