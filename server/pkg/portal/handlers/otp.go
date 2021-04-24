package handlers

import (
	"encoding/json"
	"net/http"
)

func OTPHandler(w http.ResponseWriter, r *http.Request) {
	token := GetToken(r)
	body, _ := json.Marshal(map[string]string{
		"token": token,
	})

	w.Header().Add("Content-Type", "application/json")
	w.Write(body)
}
