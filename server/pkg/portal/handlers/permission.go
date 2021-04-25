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
