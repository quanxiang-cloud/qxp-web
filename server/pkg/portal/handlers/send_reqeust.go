package handlers

import (
	"context"
	"encoding/json"
	"qxp-web/server/pkg/contexts"
)

func sendRequest(ctx context.Context, method string, fullPath string, body interface{}) ([]byte, string) {
	token := ctx.Value(ctxToken).(string)
	ua := ctx.Value(ctxUA).(string)
	headers := map[string]string{
		"Access-Token": token,
		"User-Agent":   ua,
	}

	bodyBytes, err := json.Marshal(body)
	if err != nil {
		contexts.Logger.Errorf("failed to marshal request body to bytes: %s", err.Error())
		return nil, err.Error()
	}

	return contexts.SendRequest(ctx, method, fullPath, bodyBytes, headers)
}
