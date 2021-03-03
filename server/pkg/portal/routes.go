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

	r.Headers("X-Proxy", "API").HandlerFunc(handlers.ProxyAPIHandler)
	// r.Path("/register").Methods("GET").HandlerFunc(handlers.RegisterHandler)
	r.Path("/login/{type}").Methods("GET").HandlerFunc(handlers.LoginHandler)
	r.Path("/login/{type}").Methods("POST").HandlerFunc(handlers.LoginSubmitHandler)
	r.Path("/logout").Methods("POST").HandlerFunc(handlers.LogoutHandler)
	r.Path("/resetPassword").Methods("GET").HandlerFunc(handlers.ResetPasswordHandler)
	r.Path("/resetPassword").Methods("POST").HandlerFunc(handlers.ResetPasswordActionHandler)

	r.PathPrefix("/").Methods("GET").HandlerFunc(handlers.PortalHandler)

	return contexts.RequestIDMiddleware(r)
}
