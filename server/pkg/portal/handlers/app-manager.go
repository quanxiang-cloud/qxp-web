package handlers

import (
	"net/http"
)

func AppManagerHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "app-manager.html", nil)
}
