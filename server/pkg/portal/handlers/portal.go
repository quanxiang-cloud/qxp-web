package handlers

import (
	"net/http"
)

// PortalHandler render portal page
func PortalHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "portal.html", nil)
}
