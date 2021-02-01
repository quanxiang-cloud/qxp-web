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
	r.PathPrefix("/register").Methods("GET").HandlerFunc(handlers.RegisterHandler)
	r.PathPrefix("/login/{type}").Methods("GET").HandlerFunc(handlers.LoginHandler)
	r.PathPrefix("/login/{type}").Methods("POST").HandlerFunc(handlers.LoginActionHandler)
	r.Path("/logout").Methods("POST").HandlerFunc(handlers.LogoutHandler)

	r.Path("/").Methods("GET").HandlerFunc(handlers.PortalHandler)
	r.PathPrefix("/").HandlerFunc(handlers.BadRequesthandler)

	return contexts.RequestIDMiddleware(r)
}
