package contexts

import (
	"log"
	"net/http"

	"github.com/go-redis/redis"
	"github.com/gorilla/sessions"
	"github.com/rbcervilla/redisstore"
)

// ContextKey is used for context.Context value. The value requires a key that is not primitive type.
type ContextKey string

// RequestID requestID type
const RequestID ContextKey = "requestID"

// GetQueryToken get token from query
func GetQueryToken(r *http.Request) string {
	return r.URL.Query().Get("token")
}

// GetSessionToken get token from session
func GetSessionToken(r *http.Request) (string, bool) {
	session, err := GetCurrentRequestSession(r)
	if err != nil {
		return "", true
	}

	if session.IsNew {
		Logger.Debug("this request session is New, so user has not login")
		return "", true
	}

	token, err := Cache.Get("token").Result()

	if token == "" || err != nil {
		return token, false
	}

	return token, true
}

// GetRefreshToken get refreshToken
func GetRefreshToken(r *http.Request) string {
	session, err := GetCurrentRequestSession(r)
	if err != nil {
		return ""
	}
	if session.IsNew {
		Logger.Debug("this request session is New, so user has not login")
		return ""
	}
	freshToken := ""
	defer func() {
		err := recover()
		if err != nil {
			freshToken = ""
		}
	}()
	freshToken = session.Values["refresh_token"].(string)
	return freshToken
}

// GetSessionValue get value from session
func GetSessionValue(r *http.Request, valueKey string) string {
	session, err := GetCurrentRequestSession(r)
	if err != nil {
		return ""
	}

	value, ok := session.Values[valueKey].(string)
	if !ok {
		return ""
	}

	return value
}

// GetRequestID return requestID in of current request
func GetRequestID(r *http.Request) string {
	return r.Context().Value(RequestID).(string)
}

// GetCurrentRequestSession get session of current request
func GetCurrentRequestSession(r *http.Request) (*sessions.Session, error) {
	session, err := SessionStore.Get(r, Config.SessionCookieName)
	if err != nil {
		Logger.Errorf("failed to get session from SessionStore, request_id: %s, %s", GetRequestID(r), err.Error())
		return nil, err
	}

	return session, nil
}

func initSession(redisClient *redis.Client) (*redisstore.RedisStore, error) {
	sessionStore, err := redisstore.NewRedisStore(redisClient)
	if err != nil {
		log.Fatal("failed to create redis store: ", err)
	}
	sessionStore.Options(sessions.Options{
		// 29 days
		MaxAge: 86400 * 29,
		Path:   "/",
	})

	log.Println("sessionStore initialized")

	return sessionStore, err
}

func initClusterSession(redisClient *redis.ClusterClient) (*redisstore.RedisStore, error) {
	sessionStore, err := redisstore.NewRedisStore(redisClient)
	if err != nil {
		log.Fatal("failed to create redis store: ", err)
	}
	sessionStore.Options(sessions.Options{
		// 29 days
		MaxAge: 86400 * 29,
		Path:   "/",
	})

	log.Println("sessionStore initialized")

	return sessionStore, err
}
