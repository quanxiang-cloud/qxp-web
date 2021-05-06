package contexts

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

// WithUtilContext will generate a request id and return it with response
func WithUtilContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// ignore the last "/" in path
		if r.URL.Path != "/" {
			r.URL.Path = strings.TrimSuffix(r.URL.Path, "/")
		}

		// generate requestID for debugging purpose
		ctx := r.Context()
		nextID, _ := IDWorker.NextID()
		reqID := strconv.FormatInt(nextID, 36)
		userAgent := r.Header.Get("User-Agent")

		ctx = context.WithValue(ctx, CtxUA, userAgent)
		ctx = context.WithValue(ctx, CtxRequestID, reqID)
		r = r.WithContext(ctx)

		w.Header().Set("X-Request-ID", reqID)

		next.ServeHTTP(w, r)
	})
}

// GetContextValue return the string value of key
func GetContextValue(ctx context.Context, key interface{}) string {
	value := ctx.Value(key)
	if value == nil {
		return ""
	}

	return fmt.Sprintf("%v", value)
}
