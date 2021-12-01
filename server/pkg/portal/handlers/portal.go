package handlers

import (
	"net/http"
	"qxp-web/server/pkg/contexts"
)

// PortalHandler render portal page
func PortalHandler(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(ctxUser).(*User)
	if user.Status == 0 {
		http.Redirect(w, r, "/resetPassword", http.StatusFound)
		return
	}

	userStyleGuideConfig := getUserConfig(r)
	adminUserFuncTags := getAdminUserFuncTags(r)
	userAdminRoles := getUserAdminRoles(r)

	renderWebAppPage(w, "portal.html", map[string]interface{}{
		"user":                 user,
		"adminUserFuncTags":    adminUserFuncTags,
		"userAdminRoles":       userAdminRoles,
		"userStyleGuideConfig": userStyleGuideConfig,
		"debugMode":            contexts.Config.DevMode,
		"CONFIG":               contexts.Config.ClientConfig,
	})
}
