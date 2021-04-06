package portal

import (
	"net/http"
	"qxp-web/server/pkg/contexts"
	"qxp-web/server/pkg/portal/handlers"

	"github.com/gorilla/mux"
)

func loginRequired(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !handlers.IsUserLogin(r) {
			handlers.RedirectToLoginPage(w, r)
			return
		}

		h(w, r)
	}
}

func tokenRequired(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !handlers.IsUserLogin(r) && r.URL.Path != "/api/v1/org/login/code" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		h(w, r)
	}
}

// GetRouter return mux router
func GetRouter() http.Handler {
	r := mux.NewRouter()

	r.Headers("X-Proxy", "API").HandlerFunc(tokenRequired(handlers.ProxyAPIHandler))
	// r.Path("/register").Methods("GET").HandlerFunc(handlers.RegisterHandler)
	r.Path("/login/{type}").Methods("GET").HandlerFunc(handlers.HandleLogin)
	r.Path("/login/{type}").Methods("POST").HandlerFunc(handlers.HandleLoginSubmit)
	r.Path("/logout").Methods("POST").HandlerFunc(handlers.LogoutHandler)
	r.Path("/resetPassword").Methods("GET").HandlerFunc(handlers.ResetPasswordHandler)
	r.Path("/resetPassword").Methods("POST").HandlerFunc(handlers.ResetPasswordActionHandler)
	r.PathPrefix("/appManager/").Methods("GET").HandlerFunc(handlers.AppManagerHandler)

	r.PathPrefix("/").Methods("GET").HandlerFunc(loginRequired(handlers.PortalHandler))

	return contexts.RequestIDMiddleware(r)
}
