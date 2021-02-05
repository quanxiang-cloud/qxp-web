package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"strings"
	"time"
)

// LoginHandler render login page
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if IsUserLogin(w, r) {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	loginType := getPathParam(r, "type")
	templateName := ""
	switch loginType {
	case "captcha":
		templateName = "login-by-captcha.html"
	case "password":
		templateName = "login-by-password.html"
	}

	if templateName == "" {
		renderTemplate(w, "404.html", nil)
	} else {
		renderTemplate(w, templateName, map[string]interface{}{
			"redirectUrl": r.URL.Query().Get("redirectUrl"),
		})
	}
}

func renderPage(w http.ResponseWriter, templateName string, errorMessage string) {
	if templateName == "" {
		renderTemplate(w, "404.html", nil)
	} else {
		contexts.Logger.Debug("login error message", errorMessage)
		renderTemplate(w, templateName, map[string]interface{}{
			"errorMessage": errorMessage,
		})
	}
}

// LoginSubmitHandler resolve login request
func LoginSubmitHandler(w http.ResponseWriter, r *http.Request) {
	requestID := contexts.GetRequestID(r)
	loginType := getPathParam(r, "type")
	templateName := ""
	loginType4API := ""
	password := ""
	switch loginType {
	case "captcha":
		templateName = "login-by-captcha.html"
		loginType4API = "code"
		password = r.FormValue("captcha")
	case "password":
		templateName = "login-by-password.html"
		loginType4API = "pwd"
		password = r.FormValue("password")
	}

	loginParams := map[string]string{
		"username":   r.FormValue("username"),
		"password":   password,
		"login_type": loginType4API,
	}
	jsonStr, err := json.Marshal(loginParams)
	if err != nil {
		contexts.Logger.Errorf("failed to marshal login request body: %s, request_id: %s", err.Error(), requestID)
		renderPage(w, templateName, http.StatusText(http.StatusInternalServerError))
		return
	}
	_, respBuffer, errMsg := contexts.SendRequestWitoutAuth(r, "POST", "/api/oauth2c/v1/login", bytes.NewBuffer(jsonStr), map[string]interface{}{
		"Content-Type": "application/json",
	})
	if errMsg != "" {
		contexts.Logger.Errorf("failed to login, err: %s, request_id: %s", errMsg, requestID)
		renderPage(w, templateName, errMsg)
		return
	}
	var loginResponse LoginResponse
	if err := json.Unmarshal(respBuffer.Bytes(), &loginResponse); err != nil {
		contexts.Logger.Errorf("failed to unmarshal login response body, err: %s, request_id: %s", err.Error(), requestID)
		renderPage(w, templateName, http.StatusText(http.StatusInternalServerError))
		return
	}
	if loginResponse.Code != 0 {
		renderPage(w, templateName, loginResponse.Message)
		return
	}
	session, err := contexts.GetCurrentRequestSession(r)
	if err != nil {
		contexts.Logger.Errorf("failed to get current request session: %s, request_id: %s", err.Error(), requestID)
		renderPage(w, templateName, http.StatusText(http.StatusInternalServerError))
		return
	}
	expireTime, err := time.Parse(time.RFC3339, loginResponse.Data.Expire)
	if err == nil {
		contexts.Cache.Set("token", loginResponse.Data.AccessToken, time.Duration(expireTime.UnixNano()))
	}
	session.Values["refresh_token"] = loginResponse.Data.RefreshToken
	redirectURL, ok := session.Values["redirect_url"].(string)
	if redirectURL == "/favicon.ico" || !ok || strings.HasPrefix(redirectURL, "/_") {
		redirectURL = "/"
	}
	redirectURLSpec := r.URL.Query().Get("redirectUrl")
	if redirectURLSpec != "" {
		redirectURL = redirectURLSpec
	}
	contexts.Logger.Infof("user login success, redirect to %s, request_id: %s", redirectURL, requestID)
	if err := session.Save(r, w); err != nil {
		contexts.Logger.Errorf("failed to save session: %s, request_id: %s", err.Error(), requestID)
		renderPage(w, templateName, http.StatusText(http.StatusInternalServerError))
		return
	}
	http.Redirect(w, r, redirectURL, http.StatusFound)
	return
}
