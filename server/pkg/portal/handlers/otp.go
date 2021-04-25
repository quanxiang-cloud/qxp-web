package handlers

import (
	"encoding/json"
	"net/http"
)

// OTPHandler return one time password token
func OTPHandler(w http.ResponseWriter, r *http.Request) {
	// todo get real opt token
	token := getToken(r)
	body, _ := json.Marshal(map[string]string{
		"token": token,
	})

	w.Header().Add("Content-Type", "application/json")
	w.Write(body)
}
