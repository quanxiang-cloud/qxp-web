package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"strings"
	"time"
)

func getLoginTemplate(r *http.Request) string {
	loginType := getPathParam(r, "type")
	templateName := "login-by-password.html"
	if loginType == "captcha" {
		templateName = "login-by-captcha.html"
	}

	return templateName
}

// HandleLogin render login page
func HandleLogin(w http.ResponseWriter, r *http.Request) {
	if IsUserLogin(r) {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	template := getLoginTemplate(r)
	renderTemplate(w, template, map[string]interface{}{
		// todo delete this
		"redirectUrl": r.URL.Query().Get("redirectUrl"),
	})
}

// HandleLoginSubmit resolve login request
func HandleLoginSubmit(w http.ResponseWriter, r *http.Request) {
	loginType := getPathParam(r, "type")
	templateName := getLoginTemplate(r)
	loginType4API := ""
	username := r.FormValue("username")
	password := ""

	switch loginType {
	case "captcha":
		loginType4API = "code"
		password = r.FormValue("captcha")
	case "password":
		templateName = "login-by-password.html"
		loginType4API = "pwd"
		password = r.FormValue("password")
	}

	if loginType4API == "" {
		renderTemplate(w, templateName, map[string]interface{}{"errorMessage": http.StatusText(http.StatusBadRequest)})
		return
	}

	if password == "" || username == "" {
		// todo give this a better error message
		renderTemplate(w, templateName, map[string]interface{}{"errorMessage": http.StatusText(http.StatusBadRequest)})
		return
	}

	loginParams := map[string]string{
		"username":   username,
		"password":   password,
		"login_type": loginType4API,
	}
	jsonStr, err := json.Marshal(loginParams)

	requestID := contexts.GetRequestID(r)
	if err != nil {
		contexts.Logger.Errorf("failed to marshal login request body: %s, request_id: %s", err.Error(), requestID)
		renderTemplate(w, templateName, map[string]interface{}{"errorMessage": http.StatusText(http.StatusBadRequest)})
		return
	}

	respBuffer, errMsg := contexts.SendRequestWitoutAuth(r.Context(), "POST", "/api/oauth2c/v1/login", bytes.NewBuffer(jsonStr), map[string]string{
		"Content-Type": "application/json",
		"User-Agent":   r.Header.Get("User-Agent"),
	})

	if errMsg != "" {
		contexts.Logger.Errorf("failed to login, err: %s, request_id: %s", errMsg, requestID)
		renderTemplate(w, templateName, map[string]interface{}{"errorMessage": errMsg})
		return
	}

	var loginResponse LoginResponse
	if err := json.Unmarshal(respBuffer.Bytes(), &loginResponse); err != nil {
		contexts.Logger.Errorf("failed to unmarshal login response body, err: %s, request_id: %s", err.Error(), requestID)
		renderTemplate(w, templateName, map[string]interface{}{"errorMessage": http.StatusText(http.StatusInternalServerError)})
		return
	}

	if loginResponse.Code != 0 {
		renderTemplate(w, templateName, map[string]interface{}{"errorMessage": loginResponse.Message})
		return
	}

	expireTime, err := time.Parse(time.RFC3339, loginResponse.Data.Expire)
	if err != nil {
		contexts.Logger.Errorf("failed to parse login response: %s", err.Error())
		renderTemplate(w, templateName, map[string]interface{}{"errorMessage": http.StatusText(http.StatusInternalServerError)})
		return
	}

	SaveToken(r, loginResponse.Data.AccessToken, loginResponse.Data.RefreshToken, expireTime)

	redirectURL := contexts.GetSessionValue(r, "redirect_url")
	if redirectURL == "" || redirectURL == "/favicon.ico" || strings.HasPrefix(redirectURL, "/_") {
		redirectURL = "/"
	}

	// redirectURLSpec := r.URL.Query().Get("redirectUrl")
	// if redirectURLSpec != "" {
	// 	redirectURL = redirectURLSpec
	// }
	contexts.Logger.Infof("user login success, redirect to %s, request_id: %s", redirectURL, requestID)

	http.Redirect(w, r, redirectURL, http.StatusFound)
}
