package handlers

import (
	"fmt"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"strings"
	"time"
)

// LoginHandler ... 登录句柄
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if IsUserLogin(r) {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	loginType := getPathParam(r, "type")
	fileName := ""
	switch loginType {
	case "captcha":
		fileName = "login-captcha.html"
	case "password":
		fileName = "login-password.html"
	}

	if fileName == "" {
		renderTemplate(w, "404.html", nil)
	} else {
		renderTemplate(w, fileName, nil)
	}
}

// LoginActionHandler ... 登录处理
func LoginActionHandler(w http.ResponseWriter, r *http.Request) {
	loginType := getPathParam(r, "type")
	fileName := ""
	switch loginType {
	case "captcha":
		fileName = "login-captcha.html"
	case "password":
		fileName = "login-password.html"
	}

	username := r.FormValue("username")
	password := r.FormValue("password")
	remember := r.FormValue("remember")
	captcha := r.FormValue("captcha")
	errorMessage := ""

	contexts.Logger.Debug("remember me:", remember)

	now := time.Now()
	captchaDefault := fmt.Sprintf("%02d%02d%02d", now.Month(), now.Day(), now.Hour())
	if username != "admin@yunify.com" || (password != "123456" && captcha != captchaDefault) {
		errorMessage = "用户名或密码错误"
	} else {
		session, err := contexts.GetCurrentRequestSession(r)
		if err != nil {
			http.Error(w, http.StatusText((http.StatusInternalServerError)), http.StatusInternalServerError)
			return
		}
		session.Values["token"] = "token"
		session.Values["access_id"] = "access_id"
		session.Values["user_id"] = 1
		redirectURL, ok := session.Values["redirect_url"].(string)
		if redirectURL == "/favicon.ico" || !ok || strings.HasPrefix(redirectURL, "/_") {
			redirectURL = "/"
		}
		contexts.Logger.Infof("user login success, redirect to %s", redirectURL)
		if err = session.Save(r, w); err != nil {
			http.Error(w, http.StatusText((http.StatusInternalServerError)), http.StatusInternalServerError)
			return
		}
		http.Redirect(w, r, redirectURL, http.StatusFound)
		return
	}

	if fileName == "" {
		renderTemplate(w, "404.html", nil)
	} else {
		contexts.Logger.Debug("login error message", errorMessage)
		renderTemplate(w, fileName, map[string]interface{}{
			"errorMessage": errorMessage,
		})
	}
}
