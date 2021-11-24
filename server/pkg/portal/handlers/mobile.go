package handlers

import (
	"net/http"
	"path"
	"path/filepath"
	"qxp-web/server/pkg/contexts"
	"regexp"
	"strings"
)

func isMobile(r *http.Request) bool {
	ua := strings.Join(r.Header["User-Agent"], "")
	mobileRegex, _ := regexp.Compile("(?i:Mobile|iPod|iPhone|Android|Opera Mini|BlackBerry|webOS|UCWEB|Blazer|PSP)")
	return mobileRegex.MatchString(ua)
}

func MobileHandler(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(ctxUser).(*User)
	if user.Status == 0 {
		http.Redirect(w, r, "/resetPassword", http.StatusFound)
		return
	}

	if !isMobile(r) {
		relPath, _ := filepath.Rel("/mobile", r.URL.Path)
		http.Redirect(w, r, path.Join("/", relPath), http.StatusFound)
		return
	}

	adminUserFuncTags := getAdminUserFuncTags(r)
	userAdminRoles := getUserAdminRoles(r)

	renderWebAppPage(w, "mobile.html", map[string]interface{}{
		"user":              user,
		"adminUserFuncTags": adminUserFuncTags,
		"userAdminRoles":    userAdminRoles,
		"debugMode":         contexts.Config.DevMode,
		"CONFIG":            contexts.Config.ClientConfig,
	})
}
