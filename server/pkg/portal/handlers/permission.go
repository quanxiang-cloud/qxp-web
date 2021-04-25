package handlers

import (
	"encoding/json"
	"net/http"
	"qxp-web/server/pkg/contexts"

	"github.com/tidwall/gjson"
)

func getUserFuncTags(r *http.Request) []string {
	respBuffer, errMsg := sendRequest(r.Context(), "POST", "/api/v1/goalie/listUserFuncTag", map[string]string{})
	if errMsg != "" {
		contexts.Logger.Errorf("failed to get user func tags: %s", errMsg)
		return []string{}
	}

	tagRaw := gjson.Get(respBuffer.String(), "data.tag").Raw
	var tags []string
	if err := json.Unmarshal([]byte(tagRaw), &tags); err != nil {
		contexts.Logger.Errorf("failed to unmarshal listUserFuncTag: %s", err.Error())

		return []string{}
	}

	return tags
}

// Role represents user role fields
type Role struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	RoleID string `json:"roleID"`
	Tag    string `json:"tag"`
}

func getUserRoles(r *http.Request) []Role {
	respBuffer, errMsg := sendRequest(r.Context(), "POST", "/api/v1/goalie/listUserRole", map[string]string{})
	if errMsg != "" {
		contexts.Logger.Errorf("failed to get user roles: %s", errMsg)
		return []Role{}
	}

	rolesRaw := gjson.Get(respBuffer.String(), "data.roles").Raw
	var roles []Role
	if err := json.Unmarshal([]byte(rolesRaw), &roles); err != nil {
		contexts.Logger.Errorf("failed to unmarshal user roles: %s", err.Error())

		return []Role{}
	}

	return roles
}
