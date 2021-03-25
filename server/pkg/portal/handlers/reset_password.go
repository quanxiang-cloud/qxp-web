package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"
)

// ResetPasswordHandler render reset password page
func ResetPasswordHandler(w http.ResponseWriter, r *http.Request) {
	if !IsUserLogin(r) {
		http.Redirect(w, r, "/login/password", http.StatusFound)
		return
	}
	redirectURL := r.URL.Query().Get("redirectUrl")
	renderTemplate(w, "reset-password.html", map[string]interface{}{
		"redirectUrl": redirectURL,
	})
}

// ResetPasswordActionHandler resolve reset password request
func ResetPasswordActionHandler(w http.ResponseWriter, r *http.Request) {
	requestID := contexts.GetRequestID(r)
	templateName := "reset-password.html"

	resetPasswordParams, err := json.Marshal(map[string]string{
		"newPassword": r.FormValue("newPassword"),
		"oldPassword": r.FormValue("oldPassword"),
	})
	if err != nil {
		contexts.Logger.Errorf("failed to marshal request body: %s, request_id: %s", err.Error(), requestID)
		renderTemplate(w, templateName, map[string]interface{}{
			"errorMessage": "重置密码失败",
		})
		return
	}
	session := contexts.GetCurrentRequestSession(r)
	if session == nil {
		contexts.Logger.Errorf("failed to get request session for resetPassword: %s, request_id: %s", err.Error(), requestID)
		renderTemplate(w, templateName, map[string]interface{}{
			"errorMessage": "重置密码失败",
		})
		return
	}
	respBuffer, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/v1/nurturing/userResetPWD", bytes.NewBuffer(resetPasswordParams), map[string]string{
		"Content-Type": "application/json",
		"User-Agent":   r.Header.Get("User-Agent"),
		"Access-Token": GetToken(r),
	})
	// if ShouldLogin(w, r, resp) {
	// 	return
	// }
	if errMsg != "" {
		contexts.Logger.Errorf("failed to reset password: %s, response: %s request_id: %s", errMsg, respBuffer.String(), requestID)
		renderTemplate(w, templateName, map[string]interface{}{
			"errorMessage": "重置密码失败",
		})
		return
	}
	var resetPasswordResponse ResetPasswordResponse
	if err := json.Unmarshal(respBuffer.Bytes(), &resetPasswordResponse); err != nil {
		contexts.Logger.Errorf("failed to unmarshal reset password response body, err: %s, request_id: %s", err.Error(), requestID)
		renderTemplate(w, templateName, map[string]interface{}{
			"errorMessage": "重置密码失败",
		})
		return
	}
	if resetPasswordResponse.Code != 0 {
		contexts.Logger.Debugf("failed to reset password, err: %s, request_id: %s", resetPasswordResponse.Message, requestID)
		renderTemplate(w, templateName, map[string]interface{}{
			"errorMessage": resetPasswordResponse.Message,
		})
		return
	}

	contexts.Cache.Del("token")
	session.Values["refresh_token"] = nil
	session.Save(r, w)

	http.Redirect(w, r, "/login/password", http.StatusFound)
}
