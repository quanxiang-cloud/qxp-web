package handlers

import "net/http"

// PortalHandler ...
func PortalHandler(w http.ResponseWriter, r *http.Request) {
	if !IsUserLogin(r) {
		http.Redirect(w, r, "/login/password", http.StatusFound)
		return
	}

	renderTemplate(w, "portal.html", nil)
}
