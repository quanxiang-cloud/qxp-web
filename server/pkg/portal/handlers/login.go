package handlers

import (
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

func getLoginType(r *http.Request) string {
	vars := mux.Vars(r)
	return vars["type"]
}

func getLoginTemplate(r *http.Request) string {
	loginType := getLoginType(r)
	templateName := "login-by-password.html"
	if loginType == "captcha" {
		templateName = "login-by-captcha.html"
	}

	return templateName
}

// HandleLogin render login page
func HandleLogin(w http.ResponseWriter, r *http.Request) {
	r, tokenValid := PrepareRequest(r)
	if tokenValid {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	template := getLoginTemplate(r)
	render(w, template, map[string]interface{}{
		// todo delete this
		"redirectUrl": r.URL.Query().Get("redirectUrl"),
	})
}

// HandleLoginSubmit resolve login request
func HandleLoginSubmit(w http.ResponseWriter, r *http.Request) {
	loginType := getLoginType(r)
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
		render(w, templateName, map[string]interface{}{"errorMessage": http.StatusText(http.StatusBadRequest)})
		return
	}

	if password == "" || username == "" {
		render(w, templateName, map[string]interface{}{"errorMessage": "请输入用户名和密码"})
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
		render(w, templateName, map[string]interface{}{"errorMessage": http.StatusText(http.StatusBadRequest)})
		return
	}

	respBody, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/v1/jwt/login", jsonStr, map[string]string{
		"Content-Type": "application/json",
	})

	if errMsg != "" {
		contexts.Logger.Errorf("failed to login, err: %s, request_id: %s", errMsg, requestID)
		render(w, templateName, map[string]interface{}{"errorMessage": errMsg})
		return
	}

	var loginResponse LoginResponse
	if err := json.Unmarshal(respBody, &loginResponse); err != nil {
		contexts.Logger.Errorf("failed to unmarshal login response body, err: %s, request_id: %s", err.Error(), requestID)
		render(w, templateName, map[string]interface{}{"errorMessage": http.StatusText(http.StatusInternalServerError)})
		return
	}

	if loginResponse.Code != 0 {
		render(w, templateName, map[string]interface{}{"errorMessage": loginResponse.Message})
		return
	}

	expireTime, err := time.Parse(time.RFC3339, loginResponse.Data.Expire)
	if err != nil {
		contexts.Logger.Errorf("failed to parse login response: %s", err.Error())
		render(w, templateName, map[string]interface{}{"errorMessage": http.StatusText(http.StatusInternalServerError)})
		return
	}

	saveToken(r, loginResponse.Data.AccessToken, loginResponse.Data.RefreshToken, expireTime)

	redirectURL := contexts.GetSessionValue(r, "redirect_url")
	redirectURL = regularizeLoginRedirectURL(redirectURL)

	contexts.Logger.Infof("user login success, redirect to %s, request_id: %s", redirectURL, requestID)

	http.Redirect(w, r, redirectURL, http.StatusFound)
}

func regularizeLoginRedirectURL(redirectURL string) string {
	if redirectURL == "" ||
		redirectURL == "/favicon.ico" ||
		strings.HasPrefix(redirectURL, "/_") ||
		strings.HasPrefix(redirectURL, "/login") {

		return "/"
	}

	return redirectURL
}
