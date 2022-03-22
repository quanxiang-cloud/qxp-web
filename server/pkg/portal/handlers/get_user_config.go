package handlers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"qxp-web/server/pkg/contexts"

	"github.com/tidwall/gjson"
)

type UserConfigParams struct {
	Version string `json:"version" binding:"required"`
	Key     string `json:"key" binding:"required"`
}

type BatchGetValueReq struct {
	Keys []UserConfigParams `json:"keys" binding:"required"`
}

type UserConfig struct {
	PrimaryColor    string       `json:"primaryColor"`
	TitleIcon       string       `json:"titleIcon"`
	Favicons        string       `json:"favicons"`
	ComponentCssUrl template.URL `json:"componentCssUrl"`
}

func getUserConfig(r *http.Request, appID string) UserConfig {
	params := []UserConfigParams{{Key: "user_style_config", Version: "0.1.0"}}
	if appID != "" {
		params = []UserConfigParams{{Key: "user_style_config", Version: "0.1.0"}, {Key: fmt.Sprintf("user_style_config.%s", appID), Version: "0.1.0"}}
	}

	respBody, errMsg := sendRequest(r.Context(), "POST", "/api/v1/persona/batchGetValue", BatchGetValueReq{Keys: params})
	if errMsg != "" {
		contexts.Logger.Errorf("failed to get user config: %s", errMsg)
		return UserConfig{}
	}

	result1 := gjson.Get(string(respBody), "data.result.user_style_config").Str
	result2 := gjson.Get(string(respBody), fmt.Sprintf("user_style_config.%s", appID)).Str
	config := UserConfig{
		PrimaryColor:    "blue",
		TitleIcon:       "/dist/images/quanxiangyun.svg",
		Favicons:        "/dist/images/favicons/favicon-32x32.png",
		ComponentCssUrl: "",
	}

	var result string
	if result2 != "" {
		result = result2
	} else {
		result = result1
	}

	if err := json.Unmarshal([]byte(result), &config); err != nil {
		contexts.Logger.Errorf("failed to unmarshal userConfig: %s", err.Error())

		return UserConfig{}
	}

	return config
}
