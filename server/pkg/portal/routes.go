package portal

import (
	"net/http"
	"qxp-web/server/pkg/contexts"
	"qxp-web/server/pkg/portal/handlers"

	"github.com/gorilla/mux"
)

// GetRouter return mux router
func GetRouter() http.Handler {
	r := mux.NewRouter()

	r.PathPrefix("/api").HandlerFunc(handlers.ProxyAPIHandler)

	r.PathPrefix("/").Methods("GET").HandlerFunc(handlers.PortalHandler)
	r.PathPrefix("/").HandlerFunc(handlers.BadRequesthandler)

	return contexts.RequestIDMiddleware(r)
}
