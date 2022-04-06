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
	TitleIcon    string       `json:"titleIcon"`
	Favicons     string       `json:"favicons"`
	CommonCssUrl template.URL `json:"styleCssUrl"`
}

func getPersonalizedConfig(r *http.Request, appID string) PersonalizedConfig {
	params := []ConfigCenterParams{{Key: "PERSONALIZED_CONFIG", Version: "0.1.0"}}
	if appID != "" {
		params = []ConfigCenterParams{{Key: "PERSONALIZED_CONFIG", Version: "0.1.0"}, {Key: fmt.Sprintf("PERSONALIZED_CONFIG_FOR_APP_%s", appID), Version: "0.1.0"}}
	}

	respBody, errMsg := sendRequest(r.Context(), "POST", "/api/v1/persona/batchGetValue", BatchGetValueReq{Keys: params})
	if errMsg != "" {
		contexts.Logger.Errorf("failed to get user config: %s", errMsg)
		return PersonalizedConfig{}
	}

	tenantConfig := gjson.Get(string(respBody), "data.result.PERSONALIZED_CONFIG").Str
	applicationConfig := gjson.Get(string(respBody), fmt.Sprintf("PERSONALIZED_CONFIG_FOR_APP_%s", appID)).Str
	config := PersonalizedConfig{
		TitleIcon:    "/dist/images/quanxiangyun.svg",
		Favicons:     "/dist/images/favicons/favicon-32x32.png",
		CommonCssUrl: "",
	}

	var result string
	if applicationConfig != "" {
		result = applicationConfig
	} else {
		result = tenantConfig
	}

	if err := json.Unmarshal([]byte(result), &config); err != nil {
		contexts.Logger.Errorf("failed to unmarshal userConfig: %s", err.Error())

		return PersonalizedConfig{}
	}

	return config
}
