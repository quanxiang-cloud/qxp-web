package contexts

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"

	_log "qxp-web/server/pkg/contexts/log"

	"github.com/go-redis/redis"
	"github.com/rbcervilla/redisstore"
	"github.com/sirupsen/logrus"
)

// Global shared variables, mostly connections and configs
var (
	Config       Configuration
	Logger       _log.Logger
	LogLvl       logrus.Level
	ClusterCache *redis.ClusterClient
	Cache        *redis.Client
	SessionStore *redisstore.RedisStore
	IDWorker     *SnowFlake
	HTTPClient   *http.Client
	APIEndpoint  string
	Manifest     map[string]interface{}
)

// SetupContext setups the server context
func SetupContext(configFile string, sessionCookieName string, appName string) (err error) {
	Config = initConfig(configFile)
	Config.SessionCookieName = sessionCookieName

	// todo move this into initConfig
	if Config.PortalServer.ServerPort == 0 {
		fmt.Println("No server port specified, use default 80.")
		Config.PortalServer.ServerPort = 80
	}

	if Config.Redis == nil {
		var defaultRedisConfig = &RedisConfig{
			Host:    []string{"redis"},
			Port:    6379,
			DB:      1,
			Timeout: 15,
		}
		fmt.Printf("No redis config specified, use default config: %+v.\n", defaultRedisConfig)

		Config.Redis = defaultRedisConfig
	}

	if Config.DevMode {
		Cache, err = NewRedisClient(Config.Redis)
		if err != nil {
			log.Fatal(err)
			return
		}
	} else {
		ClusterCache, err = NewRedisClusterClient(Config.Redis)
	}

	if Config.PortalServer.LogLevel == "" {
		fmt.Println("No log level specified, use default warning")
		Config.PortalServer.LogLevel = "warning"
	}

	// Setup basics.
	LogLvl, err = logrus.ParseLevel(Config.PortalServer.LogLevel)
	if err != nil {
		LogLvl = logrus.WarnLevel
	}

	Logger = _log.GetLogger(Config.PortalServer.LogDir, fmt.Sprintf("qxp-web-%s", appName))
	_log.SetLoggerLevel(Logger, Config.PortalServer.LogLevel)

	if Config.PortalServer.EnableStdout {
		_log.EnableStdout(Logger)
	}

	if Config.DevMode {
		SessionStore, err = initSession(Cache)
		if err != nil {
			log.Fatal("failed to init session store", err.Error())
		}
	} else {
		SessionStore, err = initClusterSession(ClusterCache)
		if err != nil {
			log.Fatal("failed to init session store", err.Error())
		}
	}

	IDWorker, err = NewSnowFlake(1)
	if err != nil {
		log.Fatal("failed to init id worker", err.Error())
	}

	if Config.Client == nil {
		var defaultHTTPHTTPClientConfig = HTTPClientConfig{
			Timeout:         60,
			MaxConn:         100,
			DialTimeout:     60,
			IdleConnTimeout: 90,
		}
		fmt.Printf("No http_client config specified, use default %+v\n", defaultHTTPHTTPClientConfig)
		Config.Client = &defaultHTTPHTTPClientConfig
	}

	HTTPClient = NewHTTPClient(Config.Client)

	APIEndpoint = fmt.Sprintf("%s://%s:%d", Config.APIEndpoint.Protocol, Config.APIEndpoint.Hostname, Config.APIEndpoint.Port)

	if Config.PortalServer.TemplatesDir == "" {
		fmt.Println("No dist directory specified, use default: /qxp/lib/qxp-web/dist")
		Config.PortalServer.TemplatesDir = "/qxp/lib/qxp-web/dist"
	}

	// todo support server side translate
	// data, err := ioutil.ReadFile(path.Join(Config.TemplatesDir, "locale/manifest.json"))
	// if err != nil {
	// 	panic(err)
	// }

	// err = json.Unmarshal(data, &Manifest)
	// if err != nil {
	// 	log.Fatalf("error: %v", err)
	// }

	return nil
}

// SendRequest is an util method for request API Server
func SendRequest(r *http.Request, method string, path string, body io.Reader, headers map[string]interface{}) (*http.Response, *bytes.Buffer, string) {
	requestID := GetRequestID(r)

	req, err := http.NewRequest(method, APIEndpoint+path, body)
	for key, value := range headers {
		req.Header.Add(key, value.(string))
	}
	if err != nil {
		Logger.Errorf("[request_id=%s] failed to build request: %s", requestID, err.Error())
		return nil, nil, "failed to build request"
	}

	token, _ := GetSessionToken(r)
	if token == "" {
		token = GetQueryToken(r)
	}

	if token == "" {
		return nil, nil, "no token found in session or request query"
	}

	req.Header.Add("Access-Token", token)

	Logger.Debugf(
		"[request_id=%s] sending request, method: %s, url: %s, headers: %s",
		requestID, req.Method, req.URL, req.Header,
	)

	resp, err := HTTPClient.Do(req)
	if err != nil {
		Logger.Errorf("[request_id=%s] failed to send request to API server: %s", requestID, err.Error())
		return resp, nil, "failed to send request to API server"
	}
	defer resp.Body.Close() // Force closing the response body

	buffer := &bytes.Buffer{}
	_, err = io.Copy(buffer, resp.Body)
	if err != nil {
		Logger.Errorf("[request_id=%s] copy response body error: %s", requestID, err.Error())
		return resp, nil, http.StatusText(http.StatusInternalServerError)
	}

	if resp.StatusCode >= http.StatusInternalServerError {
		Logger.Errorf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, path, buffer.String(),
		)
		return resp, buffer, fmt.Sprintf("API server response status code >= %d", http.StatusInternalServerError)
	}

	if resp.StatusCode >= http.StatusBadRequest && resp.StatusCode < http.StatusInternalServerError {
		Logger.Warnf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, path, buffer.String(),
		)
		return resp, buffer, fmt.Sprintf("API server response status code >= %d", http.StatusBadRequest)
	}

	return resp, buffer, ""
}

// SendRequestWitoutAuth is an util method for request Billing Server
func SendRequestWitoutAuth(r *http.Request, method string, path string, body io.Reader, headers map[string]interface{}) (*http.Response, *bytes.Buffer, string) {
	requestID := GetRequestID(r)

	req, err := http.NewRequest(method, APIEndpoint+path, body)
	for key, value := range headers {
		req.Header.Add(key, value.(string))
	}
	if err != nil {
		Logger.Errorf("[request_id=%s] failed to build request: %s", requestID, err.Error())
		return nil, nil, "failed to build request"
	}

	Logger.Debugf(
		"[request_id=%s] sending request, method: %s, url: %s, headers: %s",
		requestID, req.Method, req.URL, req.Header,
	)

	resp, err := HTTPClient.Do(req)
	if err != nil {
		Logger.Errorf("[request_id=%s] failed to send request to API server: %s", requestID, err.Error())
		return nil, nil, "failed to send request to API server"
	}
	defer resp.Body.Close() // Force closing the response body

	buffer := &bytes.Buffer{}
	_, err = io.Copy(buffer, resp.Body)
	if err != nil {
		Logger.Errorf("[request_id=%s] copy response body error: %s", requestID, err.Error())
		return resp, nil, http.StatusText(http.StatusInternalServerError)
	}

	if resp.StatusCode >= http.StatusInternalServerError {
		Logger.Errorf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, path, buffer.String(),
		)
		return resp, buffer, fmt.Sprintf("API server response status code >= %d", http.StatusInternalServerError)
	}

	if resp.StatusCode >= http.StatusBadRequest && resp.StatusCode < http.StatusInternalServerError {
		Logger.Warnf(
			"[request_id=%s] request API encounter status_code: %d, request method: %s, request path: %s, response body: %s",
			requestID, resp.StatusCode, method, path, buffer.String(),
		)
		return resp, buffer, fmt.Sprintf("API server response status code >= %d", http.StatusBadRequest)
	}

	return resp, buffer, ""
}
