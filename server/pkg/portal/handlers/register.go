package handlers

import (
	"net/http"
)

// RegisterHandler render register page
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "register.html", nil)
}
