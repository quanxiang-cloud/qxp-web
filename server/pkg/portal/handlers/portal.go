package handlers

import "net/http"

func PortalHandler(w http.ResponseWriter, r *http.Request) {

	renderTemplate(w, "portal.html", nil)
}
