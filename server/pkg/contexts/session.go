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

// GetSessionValue get value from session
func GetSessionValue(r *http.Request, valueKey string) string {
	session := GetCurrentRequestSession(r)
	value, _ := session.Values[valueKey].(string)

	return value
}

// GetRequestID return requestID in of current request
func GetRequestID(r *http.Request) string {
	return r.Context().Value(RequestID).(string)
}

// GetCurrentRequestSession get session of current request
func GetCurrentRequestSession(r *http.Request) *sessions.Session {
	session, err := SessionStore.Get(r, Config.SessionCookieName)
	if err != nil {
		log.Fatalf("failed to get session from SessionStore, request_id: %s, %s", GetRequestID(r), err.Error())
	}

	return session
}

func initSession(redisClient redis.UniversalClient) (*redisstore.RedisStore, error) {
	sessionStore, err := redisstore.NewRedisStore(redisClient)
	if err != nil {
		log.Fatal("failed to create redis store: ", err)
	}
	sessionStore.Options(sessions.Options{
		// 29 days
		MaxAge: 86400 * 29,
		Path:   "/",
	})

	sessionStore.KeyPrefix("websk:")

	log.Println("sessionStore initialized")

	return sessionStore, err
}
