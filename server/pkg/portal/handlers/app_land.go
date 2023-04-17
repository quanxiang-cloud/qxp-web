package handlers

import (
	"net/http"
	"qxp-web/server/pkg/contexts"

	"github.com/gorilla/mux"
)

// AppLandHandler handle normal user side request
func AppLandHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	appID := vars["appID"]
	user := r.Context().Value(ctxUser).(*User)
	if user.Status == 0 {
		http.Redirect(w, r, "/resetPassword", http.StatusFound)
		return
	}

	// if isMobile(r) {
	// 	http.Redirect(w, r, path.Join("/mobile", r.URL.Path), http.StatusFound)
	// 	return
	// }

	adminUserFuncTags := getAdminUserFuncTags(r)
	userAdminRoles := getUserAdminRoles(r)
	personalizedConfig := getPersonalizedConfig(r, "")

	renderWebAppPage(w, "appLand.html", map[string]interface{}{
		"user":               user,
		"adminUserFuncTags":  adminUserFuncTags,
		"userAdminRoles":     userAdminRoles,
		"personalizedConfig": personalizedConfig,
		"debugMode":          contexts.Config.DevMode,
		"CONFIG":             contexts.Config.ClientConfig,
		"appID":              appID,
		"vendorPrefix":       contexts.Config.ClientConfig.VendorPrefix,
	})
}
