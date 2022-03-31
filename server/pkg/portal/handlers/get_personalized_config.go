package handlers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"qxp-web/server/pkg/contexts"

	"github.com/tidwall/gjson"
)

type ConfigCenterParams struct {
	Version string `json:"version" binding:"required"`
	Key     string `json:"key" binding:"required"`
}

type BatchGetValueReq struct {
	Keys []ConfigCenterParams `json:"keys" binding:"required"`
}

type PersonalizedConfig struct {
	PrimaryColor string       `json:"primaryColor"`
	TitleIcon    string       `json:"titleIcon"`
	Favicons     string       `json:"favicons"`
	CommonCssUrl template.URL `json:"styleCssUrl"`
}

func getPersonalizedConfig(r *http.Request, appID string) PersonalizedConfig {
	params := []ConfigCenterParams{{Key: "COMMON_STYLE_CONFIG", Version: "0.1.0"}}
	if appID != "" {
		params = []ConfigCenterParams{{Key: "COMMON_STYLE_CONFIG", Version: "0.1.0"}, {Key: fmt.Sprintf("APP_COMMON_STYLE_CONFIG_%s", appID), Version: "0.1.0"}}
	}

	respBody, errMsg := sendRequest(r.Context(), "POST", "/api/v1/persona/batchGetValue", BatchGetValueReq{Keys: params})
	if errMsg != "" {
		contexts.Logger.Errorf("failed to get user config: %s", errMsg)
		return PersonalizedConfig{}
	}

	result1 := gjson.Get(string(respBody), "data.result.COMMON_STYLE_CONFIG").Str
	result2 := gjson.Get(string(respBody), fmt.Sprintf("APP_COMMON_STYLE_CONFIG_%s", appID)).Str
	config := PersonalizedConfig{
		PrimaryColor: "blue",
		TitleIcon:    "/dist/images/quanxiangyun.svg",
		Favicons:     "/dist/images/favicons/favicon-32x32.png",
		CommonCssUrl: "",
	}

	var result string
	if result2 != "" {
		result = result2
	} else {
		result = result1
	}

	if err := json.Unmarshal([]byte(result), &config); err != nil {
		contexts.Logger.Errorf("failed to unmarshal userConfig: %s", err.Error())

		return PersonalizedConfig{}
	}

	return config
}
