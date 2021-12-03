package handlers

import (
	"fmt"
	"net/http"
	"net/url"
	"qxp-web/server/pkg/contexts"
	"strconv"
	"time"
)

func cacheRedirectState(homePath string, sk string) string {
	nextID, _ := contexts.IDWorker.NextID()
	state := strconv.FormatInt(nextID, 36)
	contexts.Cache.Set(contexts.Ctx, fmt.Sprintf("redirect_path:%s", state), homePath, time.Second*5)
	contexts.Cache.Set(contexts.Ctx, fmt.Sprintf("redirect_sk:%s", state), sk, time.Second*5)

	return state
}

func getRedirectPath(state string) string {
	return contexts.Cache.Get(contexts.Ctx, fmt.Sprintf("redirect_path:%s", state)).Val()
}

func getRedirectSK(state string) string {
	return contexts.Cache.Get(contexts.Ctx, fmt.Sprintf("redirect_sk:%s", state)).Val()
}

// JumpToHome redirect user to home page
func JumpToHome(w http.ResponseWriter, r *http.Request) {
	to := r.URL.Query().Get("to")
	homePath, err := url.QueryUnescape(to)
	if err != nil {
		renderErrorPage(w, r, 400, "invalid 'to' value!")
		return
	}

	session := contexts.GetCurrentRequestSession(r)
	state := cacheRedirectState(homePath, session.ID)

	homeURL := url.URL{
		Scheme:   r.URL.Scheme,
		Path:     "/_land_from_portal",
		Host:     contexts.Config.ClientConfig.HomeHostname,
		RawQuery: fmt.Sprintf("state=%s", state),
	}

	contexts.Logger.Debugln("redirect user to home: ", homeURL.String())

	http.Redirect(w, r, homeURL.String(), http.StatusFound)
}

// LandFromPortal handle redirect from portal
func LandFromPortal(w http.ResponseWriter, r *http.Request) {
	state := r.URL.Query().Get("state")
	if state == "" {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	contexts.Logger.Debugln("landing from portal with state: ", state)

	homePath := getRedirectPath(state)
	if HasToken(r) {
		contexts.Logger.Debugln("user is already logged in, redirect to: ", homePath)
		http.Redirect(w, r, homePath, http.StatusFound)
		return
	}

	sk := getRedirectSK(state)
	if sk == "" {
		contexts.Logger.Debugln("failed to find sk for state: ", state, ", redirect user to root page")
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "sk",
		Value: sk,
		// 29 days
		MaxAge: 86400 * 29,
		Path:   "/",
	})
	http.Redirect(w, r, homePath, http.StatusFound)
}
