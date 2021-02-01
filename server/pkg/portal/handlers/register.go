package handlers

import (
	"net/http"
)

// RegisterHandler ...
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "register.html", nil)
}
