package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"
)

// HandleRetrievePassword get back password
func HandleRetrievePassword(w http.ResponseWriter, r *http.Request) {
	redirectURL := r.URL.Query().Get("redirectUrl")
	renderTemplate(w, "retrieve-password.html", map[string]interface{}{
		"redirectUrl": redirectURL,
	})
}

// HandleRetrievePasswordSubmit handle reset password post request
func HandleRetrievePasswordSubmit(w http.ResponseWriter, r *http.Request) {
	requestID := contexts.GetRequestID(r)
	templateName := "retrieve-password.html"

	username := r.FormValue("username")
	captcha := r.FormValue("captcha")
	newPassword := r.FormValue("newPassword")

	resetPasswordParams, err := json.Marshal(map[string]string{
		"newPassword": newPassword,
		"userName":    username,
		"code":        captcha,
	})
	if err != nil {
		contexts.Logger.Errorf("failed to marshal request body: %s, request_id: %s", err.Error(), requestID)
		renderTemplate(w, templateName, map[string]interface{}{
			"errorMessage": "重置密码失败",
		})
		return
	}
	respBuffer, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/v1/nurturing/userForgetResetPWD", bytes.NewBuffer(resetPasswordParams), map[string]string{
		"Content-Type": "application/json",
		"User-Agent":   r.Header.Get("User-Agent"),
	})
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
	http.Redirect(w, r, "/login/password", http.StatusFound)
}
