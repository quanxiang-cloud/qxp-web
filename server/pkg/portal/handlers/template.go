package handlers

import (
	"fmt"
	"html/template"
	"net/http"
	"path"
	"qxp-web/server/pkg/contexts"
)

var tmpls = make(map[string]*template.Template)
var funcMap = template.FuncMap{
	"rawCSS": func(s string) template.CSS {
		return template.CSS(s)
	},
}

func renderTemplate(w http.ResponseWriter, templateName string, data map[string]interface{}) {
	var err error
	tmpl, ok := tmpls[templateName]

	if !ok {
		tmpl = template.Must(template.New("").Funcs(funcMap).ParseFiles(
			path.Join(contexts.Config.PortalServer.TemplatesDir, "layout.html"),
			path.Join(contexts.Config.PortalServer.TemplatesDir, templateName),
		))

		// disable template cache in dev_mode
		// if !contexts.Config.DevMode {
		// 	tmpls[templateName] = tmpl
		// }
	}

	err = tmpl.ExecuteTemplate(w, templateName, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func renderErrorPage(w http.ResponseWriter, r *http.Request, code int, message string) {
	errMsg := fmt.Sprintf("[request_id=%s] %s: %s", contexts.GetRequestID(r), http.StatusText(code), message)
	// contexts.Logger.Error(errMsg)
	http.Error(w, errMsg, code)
}

func BadRequesthandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(400)
	w.Write([]byte("Bad Request"))
}
