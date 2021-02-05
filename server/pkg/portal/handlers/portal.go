package handlers

import (
	"net/http"
)

// PortalHandler render portal page
func PortalHandler(w http.ResponseWriter, r *http.Request) {
	if !IsUserLogin(w, r) {
		http.Redirect(w, r, "/login/password", http.StatusFound)
		return
	}

	renderTemplate(w, "portal.html", nil)
}
