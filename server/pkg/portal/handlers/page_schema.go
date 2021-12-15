package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"qxp-web/server/pkg/contexts"

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

func getAPISpec(ctx context.Context, schemaStr string) string {
	apiStatesSpec := map[string]map[string]interface{}{}
	apiSpecStr := gjson.Get(schemaStr, "apiStateSpec").Raw
	if apiSpecStr == "" {
		return `{}`
	}

	err := json.Unmarshal([]byte(apiSpecStr), &apiStatesSpec)
	if err != nil {
		contexts.Logger.Errorln("failed to Unmarshal apiStatesSpec, error:", err.Error())
		return `{}`
	}

	var apiIDs []string
	for _, config := range apiStatesSpec {
		apiID, ok := config["apiID"].(string)
		if !ok {
			continue
		}

		apiIDs = append(apiIDs, apiID)
	}

	if len(apiIDs) == 0 {
		return `{}`
	}

	body := map[string]interface{}{"apiPath": apiIDs}
	respBody, errMsg := sendRequest(ctx, "POST", "/api/v1/polyapi/swagger", body)
	if errMsg != "" {
		contexts.Logger.Error("failed to get swagger by api paths, eror: %s", errMsg)
		return `{}`
	}

	return gjson.Get(string(respBody), "data.swag").Raw
}

// HandleGetSchema return page schema and api swagger
func HandleGetSchema(w http.ResponseWriter, r *http.Request) {
	schemaKey := r.URL.Query().Get("schema_key")
	version := r.URL.Query().Get("version")

	w.Header().Add("Content-Type", "application/json")

	if schemaKey == "" || version == "" {
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": "schema_key and version required"})
		w.Write(res)
		return
	}

	schemaStr, errMsg := getConfig(r.Context(), schemaKey, version)
	if errMsg != "" {
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": errMsg})
		w.Write(res)
		return
	}

	if schemaStr == "" {
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": "no schema found"})
		w.Write(res)
		return
	}

	swaggerStr := getAPISpec(r.Context(), schemaStr)
	if swaggerStr == "" {
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": "fail to get swagger"})
		w.Write(res)
		return
	}

	schema := map[string]interface{}{}
	err := json.Unmarshal([]byte(schemaStr), &schema)
	if err != nil {
		contexts.Logger.Errorln("failed to unmarshal schema, error:", err.Error())
		res, _ := json.Marshal(map[string]interface{}{"code": 1, "msg": "fail to unmarshal schema"})
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
	result["schema"] = schema

	res, _ := json.Marshal(map[string]interface{}{"code": 0, "data": result})
	w.Write(res)
}
