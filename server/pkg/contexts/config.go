package contexts

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"

	"github.com/kelseyhightower/envconfig"
	"gopkg.in/go-playground/validator.v9"
	"gopkg.in/yaml.v2"
)

// APIEndpointConfig used to specify API address
type APIEndpointConfig struct {
	Protocol string `yaml:"protocol" default:"http"`
	Hostname string `yaml:"hostname"`
	Port     int    `yaml:"port"`
}

// HTTPClientConfig stores a configuration of HTTP client.
type HTTPClientConfig struct {
	Timeout         int `yaml:"timeout" default:"60"`
	MaxConn         int `yaml:"max_conn" default:"100" split_words:"true"`
	DialTimeout     int `yaml:"dial_timeout" default:"60" split_words:"true"`
	IdleConnTimeout int `yaml:"idle_conn_timeout" default:"90" split_words:"true"`
}

// PortalServerConfig server config
type PortalServerConfig struct {
	ServerPort   int    `yaml:"server_port" default:"80" split_words:"true"`
	LogLevel     string `yaml:"log_level" default:"warning" split_words:"true"`
	LogDir       string `yaml:"log_dir" default:"/var/log/qxp" split_words:"true"`
	EnableStdout bool   `yaml:"enable_stdout" split_words:"true"`
	TemplatesDir string `yaml:"templates_dir" default:"/qxp/dist/templates" split_words:"true"`
}

// ClientConfig containe configs for frontend
type ClientConfig struct {
	WebsocketHostname string `yaml:"websocket_hostname" default:"keeper" vaildate:"required" split_words:"true" json:"websocket_hostname"`
	HomeHostname      string `yaml:"home_hostname" default:"home.qxp.com" split_words:"true" json:"home_hostname"`
	PortalHostname    string `yaml:"portal_hostname" default:"portal.qxp.com" split_words:"true" json:"portal_hostname"`
}

// Configuration is the type of project config file
type Configuration struct {
	DevMode           bool `yaml:"dev_mode" split_words:"true"`
	SessionCookieName string

	Client      *HTTPClientConfig  `yaml:"http_client"`
	Redis       *RedisConfig       `yaml:"redis"`
	APIEndpoint *APIEndpointConfig `yaml:"api_endpoint" validate:"required" split_words:"true"`

	PortalServer *PortalServerConfig `yaml:"portal_server" vaildate:"required" split_words:"true"`

	ClientConfig *ClientConfig `yaml:"client_config" vaildate:"required" split_words:"true"`
}

func initConfig(configFile string) Configuration {
	Config = Configuration{}

	if configFile == "" {
		Config = initConfigFromENV()
	} else {
		fmt.Println("read config from file:", configFile)
		data, err := ioutil.ReadFile(configFile)
		if err != nil {
			panic(err)
		}

		err = yaml.Unmarshal(data, &Config)
		if err != nil {
			log.Fatalf("error: %v", err)
		}
	}

	// validate configuration file
	err := validator.New().Struct(Config)
	if err != nil {
		log.Fatal("config is invailed", err.Error())
	}

	return Config
}

func initConfigFromENV() Configuration {
	setDefaultENV()
	Config = Configuration{}
	err := envconfig.Process("qxp_web", &Config)
	if err != nil {
		log.Fatal(err.Error())
	}

	ConfigBytes, _ := json.Marshal(Config)
	fmt.Printf("init config from ENV, got: %v\n", string(ConfigBytes))

	return Config
}

func setDefaultENV() {
	// this maybe used in the future
}
