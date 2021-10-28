package handlers

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"path"
	"qxp-web/server/pkg/contexts"
	"strings"
)

var webEntryManifest map[string]string
var parsedTempates *template.Template
var funcMap = template.FuncMap{
	"rawCSS": func(s string) template.CSS {
		return template.CSS(s)
	},
}

func getWebEntryManifest() map[string]string {
	if webEntryManifest != nil && !contexts.Config.DevMode {
		return webEntryManifest
	}

	// parse mainfest every time in dev mode
	manifest, err := ioutil.ReadFile(path.Join(contexts.Config.PortalServer.TemplatesDir, "../manifest.json"))

	if err != nil {
		return make(map[string]string)
	}

	err = json.Unmarshal(manifest, &webEntryManifest)
	if err != nil {
		log.Fatalf("error: %v", err)
	}

	return webEntryManifest
}

func getJsFileSrc(templateName string) string {
	manifest := getWebEntryManifest()
	jsEntryName := strings.TrimSuffix(templateName, ".html") + ".js"
	src, ok := manifest[jsEntryName]
	if !ok {
		log.Fatalln("failed to find js entry for template: ", templateName, jsEntryName)
	}

	return src
}

// todo give this func a better name
func renderWebAppPage(w http.ResponseWriter, templateName string, data map[string]interface{}) {
	jsEntrySrc := getJsFileSrc(templateName)
	data["jsEntrySrc"] = jsEntrySrc
	render(w, templateName, data)
}

func render(w http.ResponseWriter, templateName string, data map[string]interface{}) {
	var err error
	// parse template every time in dev mode
	if parsedTempates == nil || contexts.Config.DevMode {
		parsedTempates, err = template.ParseGlob(path.Join(contexts.Config.PortalServer.TemplatesDir, "*"))
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = parsedTempates.ExecuteTemplate(w, templateName, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func renderErrorPage(w http.ResponseWriter, r *http.Request, code int, message string) {
	errMsg := fmt.Sprintf("[request_id=%s] %s: %s", contexts.GetRequestID(r), http.StatusText(code), message)
	contexts.Logger.Error(errMsg)
	http.Error(w, errMsg, code)
}

// BadRequesthandler render 404 page
func BadRequesthandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(400)
	render(w, "404.html", nil)
}
