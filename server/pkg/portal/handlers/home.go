package handlers

import (
	"net/http"
	"path"
	"qxp-web/server/pkg/contexts"
)

// HomeHandler handle normal user side request
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(ctxUser).(*User)
	if user.Status == 0 {
		http.Redirect(w, r, "/resetPassword", http.StatusFound)
		return
	}

	if isMobile(r) {
		http.Redirect(w, r, path.Join("/mobile", r.URL.Path), http.StatusFound)
		return
	}

	adminUserFuncTags := getAdminUserFuncTags(r)
	userAdminRoles := getUserAdminRoles(r)
	personalizedConfig := getPersonalizedConfig(r, "")

	renderWebAppPage(w, "home.html", map[string]interface{}{
		"user":              user,
		"adminUserFuncTags": adminUserFuncTags,
		"userAdminRoles":    userAdminRoles,
		"personalizedConfig": personalizedConfig,
		"debugMode":         contexts.Config.DevMode,
		"CONFIG":            contexts.Config.ClientConfig,
	})
}
