package handlers

import (
	"net/http"
	"qxp-web/server/pkg/contexts"
)

// LogoutHandler ... 退出登录
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	session, err := contexts.GetCurrentRequestSession(r)
	token := contexts.GetSessionToken(r)
	if err != nil || token == "" {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}
	contexts.Logger.Debug("user session has been revoked")
	session.Values["token"] = nil
	if err = session.Save(r, w); err != nil {
		http.Error(w, http.StatusText((http.StatusInternalServerError)), http.StatusInternalServerError)
		return
	}
	contexts.Logger.Debug("user logout, redirect to /")
	delCookie := http.Cookie{
		Name:   contexts.Config.SessionCookieName,
		MaxAge: -1,
	}
	http.SetCookie(w, &delCookie)
	http.Redirect(w, r, "/", http.StatusFound)
}
