package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"strings"

	"github.com/tidwall/gjson"
)

func getConfig(ctx context.Context, key string, version string) (string, string) {

	body := map[string]interface{}{
		"keys": []map[string]string{{"key": key, "version": version}},
	}

	respBody, errMsg := sendRequest(ctx, "POST", "/api/v1/persona/batchGetValue", body)
	if errMsg != "" {
		contexts.Logger.Errorln(fmt.Sprintf("failed to get page schema of key: %s version: %s, error: %s", key, version, errMsg))
		return "", errMsg
	}

	schemaStr := gjson.Get(string(respBody), fmt.Sprintf("data.result.%s", key)).Str

	return schemaStr, ""
}

func getAPISpec(ctx context.Context, arteryStr string) string {
	apiStatesSpec := map[string]map[string]interface{}{}
	apiSpecStr := gjson.Get(arteryStr, "apiStateSpec").Raw
	if apiSpecStr == "" {
		return `{}`
	}

	err := json.Unmarshal([]byte(apiSpecStr), &apiStatesSpec)
	if err != nil {
		contexts.Logger.Errorln("failed to Unmarshal apiStatesSpec, error:", err.Error())
		return `{}`
	}

	var apiPaths []string
	for _, config := range apiStatesSpec {
		apiID, ok := config["apiID"].(string)
		if !ok {
			continue
		}

		parts := strings.Split(apiID, ":")
		apiPath := parts[len(parts)-1]

		apiPaths = append(apiPaths, apiPath)
	}

	if len(apiPaths) == 0 {
		return `{}`
	}

	body := map[string]interface{}{"apiPath": apiPaths}
	respBody, errMsg := sendRequest(ctx, "POST", "/api/v1/polyapi/swagger", body)
	if errMsg != "" {
		contexts.Logger.Error("failed to get swagger by api paths, eror: %s", errMsg)
		return `{}`
	}

	return gjson.Get(string(respBody), "data.swag").Raw
}

// HandleGetSchema return page schema and api swagger
func HandleGetSchema(w http.ResponseWriter, r *http.Request) {
	arteryID := r.URL.Query().Get("artery_id")
	version := r.URL.Query().Get("version")

	w.Header().Add("Content-Type", "application/json")

	if arteryID == "" || version == "" {
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": "artery_id and version required"})
		w.Write(res)
		return
	}

	arteryStr, errMsg := getConfig(r.Context(), arteryID, version)
	if errMsg != "" {
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": errMsg})
		w.Write(res)
		return
	}

	if arteryStr == "" {
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": "no artery found"})
		w.Write(res)
		return
	}

	swaggerStr := getAPISpec(r.Context(), arteryStr)
	if swaggerStr == "" {
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": "fail to get swagger"})
		w.Write(res)
		return
	}

	artery := map[string]interface{}{}
	err := json.Unmarshal([]byte(arteryStr), &artery)
	if err != nil {
		contexts.Logger.Errorln("failed to unmarshal schema, error:", err.Error())
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": "fail to unmarshal artery"})
		w.Write(res)
		return
	}

	swagger := map[string]interface{}{}
	err = json.Unmarshal([]byte(swaggerStr), &swagger)
	if err != nil {
		contexts.Logger.Errorln("failed to unmarshal swagger, error:", err.Error())
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": "fail to unmarshal swagger"})
		w.Write(res)
		return
	}

	result := map[string]interface{}{}

	result["swagger"] = swagger
	result["artery"] = artery

	res, _ := json.Marshal(map[string]interface{}{"code": 0, "data": result})
	w.Write(res)
}
