package handlers

import (
	"bytes"
	"context"
	"io"
	"qxp-web/server/pkg/contexts"
)

func sendRequest(ctx context.Context, method string, fullPath string, body io.Reader) (*bytes.Buffer, string) {
	// requestID := ctx.Value(contexts.RequestID).(string)
	token := ctx.Value(ctxToken).(string)
	ua := ctx.Value(ctxUA).(string)
	headers := map[string]string{
		"Access-Token": token,
		"User-Agent":   ua,
	}

	return contexts.SendRequest(ctx, method, fullPath, body, headers)
}
