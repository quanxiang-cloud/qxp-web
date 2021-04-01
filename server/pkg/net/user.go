package net

import (
	"encoding/json"
	"errors"
	"net/http"
	"qxp-web/server/pkg/contexts"
)

func GetUserInfo(w http.ResponseWriter, r *http.Request, token string) (
	map[string]interface{}, error) {

	requestID := contexts.GetRequestID(r)
	var userInfoResponse map[string]interface{} 
	respBuffer, errMsg := contexts.SendRequest(r.Context(), "POST", "/api/v1/org/userUserInfo", r.Body, map[string]string{
		"Access-Token":  token,
	})

	if errMsg != "" {
		contexts.Logger.Errorf("Get user info error: %s, request_id: %s", errMsg, requestID)
		if len(errMsg) >= len("401") && errMsg[len(errMsg)-len("401"):] == "401" {
			return userInfoResponse, errors.New(errMsg)
		}
		return userInfoResponse, nil
	}

	err := json.Unmarshal(respBuffer.Bytes(), &userInfoResponse)
	if err != nil {
		contexts.Logger.Errorf(
			"failed to unmarshal user info body, err: %s, request_id: %s", 
			err.Error(), 
			requestID,
		)
	}

	return userInfoResponse, nil 
}
