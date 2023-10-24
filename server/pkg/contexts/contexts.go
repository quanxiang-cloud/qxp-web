package contexts

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	_log "qxp-web/server/pkg/contexts/log"

	"github.com/go-redis/redis/v8"
	"github.com/rbcervilla/redisstore/v8"
	"github.com/sirupsen/logrus"
)

// Ctx as context of context
var Ctx = context.Background()

// Global shared variables, mostly connections and configs
var (
	Config       Configuration
	Logger       _log.Logger
	LogLvl       logrus.Level
	Cache        redis.UniversalClient
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
			Addrs:   []string{"redis"},
			DB:      1,
			Timeout: 15,
		}
		fmt.Printf("No redis config specified, use default config: %+v.\n", defaultRedisConfig)

		Config.Redis = defaultRedisConfig
	}

	Cache = NewRedisClient(Config.Redis)

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

	SessionStore, err = initSession(Cache)
	IDWorker, err = NewSnowFlake(getInstanceID())
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

	// init OSSConfig
	for {
		ossConf := getOSSConfig()
		if ossConf.Domain == "" {
			time.Sleep(time.Second * 1)
			continue
		}
		Config.ClientConfig.OSSConfig = ossConf
		break
	}

	return nil
}
