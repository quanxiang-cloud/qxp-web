package handlers

import (
	"encoding/json"
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
	PrimaryColor string `json:"primaryColor"`
	TitleIcon    string `json:"titleIcon"`
	Favicons     string `json:"favicons"`
}

func getUserConfig(r *http.Request) UserConfig {
	params := []UserConfigParams{{Key: "user_style_config", Version: "0.1.0"}}
	respBody, errMsg := sendRequest(r.Context(), "POST", "/api/v1/persona/userBatchGetValue", BatchGetValueReq{Keys: params})
	if errMsg != "" {
		contexts.Logger.Errorf("failed to get user config: %s", errMsg)
		return UserConfig{}
	}

	result := gjson.Get(string(respBody), "data.result.user_style_config").Str
	config := UserConfig{
		PrimaryColor: "blue",
		TitleIcon:    "/dist/images/quanxiangyun.svg",
		Favicons:     "/dist/images/favicons/favicon-32x32.png",
	}

	if err := json.Unmarshal([]byte(result), &config); err != nil {
		contexts.Logger.Errorf("failed to unmarshal userConfig: %s", err.Error())

		return UserConfig{}
	}

	return config
}
