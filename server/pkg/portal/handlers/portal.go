package handlers

import (
	"net/http"
	"qxp-web/server/pkg/contexts"
)

// PortalHandler render portal page
func PortalHandler(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(ctxUser).(*User)
	if user.Status == 1 {
		http.Redirect(w, r, "/resetPassword", http.StatusFound)
		return
	}

	userFuncTags := getUserFuncTags(r)
	userRoles := getUserRoles(r)

	renderTemplate(w, "portal.html", map[string]interface{}{
		"user":         user,
		"userFuncTags": userFuncTags,
		"userRoles":    userRoles,
		"debugMode":    contexts.Config.DevMode,
		"CONFIG":       contexts.Config.ClientConfig,
	})
}
