package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"qxp-web/server/pkg/contexts"
	"qxp-web/server/pkg/portal"
)

func main() {
	configFile := flag.String("c", "", "config file path")
	flag.Parse()

	if *configFile == "" {
		*configFile = "/qxp-web/etc/config.yaml"
	}

	err := contexts.SetupContext(*configFile, "sk", "portal")
	if err != nil {
		panic(err)
	}

	r := portal.GetRouter()

	addr := fmt.Sprintf("0.0.0.0:%d", contexts.Config.PortalServer.ServerPort)

	log.Printf("Listen and serve on: %s\n", addr)

	srv := &http.Server{
		Handler: r,
		Addr:    addr,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: time.Duration(contexts.Config.Client.Timeout+5) * time.Second,
		ReadTimeout:  time.Duration(contexts.Config.Client.Timeout+5) * time.Second,
		// WriteTimeout: 15 * time.Second,
		// ReadTimeout: 15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
