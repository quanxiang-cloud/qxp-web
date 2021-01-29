package contexts

import (
	"context"
	"net/http"
	"strconv"
	"strings"
)

// RequestIDMiddleware will generate a request id and return it with response
func RequestIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// ignore the last "/" in path
		if r.URL.Path != "/" {
			r.URL.Path = strings.TrimSuffix(r.URL.Path, "/")
		}

		// generate requestID for debugging purpose
		ctx := r.Context()
		nextID, _ := IDWorker.NextID()
		reqID := strconv.FormatInt(nextID, 36)

		ctx = context.WithValue(ctx, RequestID, reqID)
		r = r.WithContext(ctx)

		w.Header().Set("X-Request-ID", reqID)

		next.ServeHTTP(w, r)
	})
}
