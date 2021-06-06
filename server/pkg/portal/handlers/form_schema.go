package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"reflect"
	"sort"
	"strings"
)

const (
	// Type Type
	Type = "type"
	// Arr Arr
	Arr = "array"
	// Items items
	Items = "items"
	// SubTableF SubTable
	SubTableF = "SubTable"
	// ForeignTable ForeignTable
	ForeignTable = "foreign_table"
	// Component Component
	Component = "x-component"
	// ComponentProps ComponentProps
	ComponentProps = "x-component-props"
	// AssociatedRecords AssociatedRecords
	AssociatedRecords = "AssociatedRecords"
	// Properties properties
	Properties = "properties"
)

// FormSchemaHandler FormSchemaHandler
func FormSchemaHandler(w http.ResponseWriter, r *http.Request) {
	requestID := contexts.GetRequestID(r)
	method := r.Method
	path := r.URL.Path
	var url = ""
	if r.URL.RawQuery != "" {
		url = fmt.Sprintf("%s%s?%s", contexts.APIEndpoint, path, r.URL.RawQuery)
	} else {
		url = fmt.Sprintf("%s%s", contexts.APIEndpoint, path)
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		contexts.Logger.Error("read body err, %v\n", err)
		return
	}
	contexts.Logger.Debugf("schema proxy api request, method: %s, url: %s,body : %s,request_id: %s ", method, url, string(body), requestID)

	sm := &schema{}
	if strings.HasSuffix(path, "/") {
		path = path[:len(path)-2]
	}
	paths := strings.Split(path, "/")
	if len(paths[len(paths)-1]) >= 32 {
		sm.TableID = paths[len(paths)-1]
	}
	if body != nil && len(body) > 0 {
		if err = json.Unmarshal(body, sm); err != nil {
			contexts.Logger.Error("Unmarshal err, %v\n", err)
			return
		}
	}

	c, rest, err := schemaHandler(r, sm, path)
	fr := &response{
		Code: 0,
	}
	if err != nil {
		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(c)
		fr.Code = -1
		fr.Msg = err.Error()
		frb, _ := json.Marshal(fr)
		_, _ = w.Write(frb)
		return
	}
	fr.Data = rest
	frb, err := json.Marshal(fr)
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(frb)
	return
}

func schemaHandler(r *http.Request, sm *schema, path string) (int, interface{}, error) {
	paths := strings.Split(path, "/")
	switch paths[len(paths)-1] {
	case "create", "update":
		c, err := doCreateOrUpdate(r, sm, path)
		return c, nil, err
	case "getByID":
		return doFind(r, sm, path, "admin")
	}
	// 应用端查询schema
	if len(paths[len(paths)-1]) >= 32 {
		return doFind(r, sm, path, "user")
	}
	return http.StatusOK, nil, nil
}

func doCreateOrUpdate(r *http.Request, sm *schema, path string) (int, error) {
	s := sm.Schema
	if prop, ok := s[Properties]; ok {
		p := prop.(map[string]interface{})
		c, err := subFormHandler(r, p, path, sm.TableID)
		if c == http.StatusOK && err == nil {
			// 主schema创建
			jsonStr, err := json.Marshal(sm)
			if err != nil {
				return http.StatusInternalServerError, err
			}
			co, _, err := sendRequest2Struct(r, "POST", path, jsonStr)
			return co, err
		}
		return c, err
	}
	return http.StatusOK, nil
}

func subFormHandler(r *http.Request, s map[string]interface{}, path, tableID string) (int, error) {
	value := reflect.ValueOf(s)
	switch reflect.TypeOf(s).Kind() {
	case reflect.Map:
		iter := value.MapRange()
		for iter.Next() {
			val := iter.Value().Elem()
			switch val.Kind() {
			case reflect.Map:
				vm := val.Interface().(map[string]interface{})
				c, err := createSub(r, vm, tableID, iter.Key().String())
				if err != nil || c != http.StatusOK {
					return c, err
				}
			}
		}
	}
	return http.StatusOK, nil
}
func createSub(r *http.Request, vm map[string]interface{}, tableID, fieldNme string) (int, error) {
	if tp, ok := vm[Type]; ok && tp == Arr {
		// 存在子表单或关联表单
		if cm, ok := vm[Component]; ok && (cm == SubTableF || cm == associatedRecords) {
			cp := ComponentProp{}
			if c, ok := vm[ComponentProps]; ok {
				err := genComponent(c, &cp)
				if err != nil {
					return http.StatusInternalServerError, err
				}
				st := SubTable{
					AppID:        cp.AppID,
					TableID:      tableID,
					SubTableID:   cp.TableID,
					SubTableType: cm.(string),
					FieldName:    fieldNme,
					Filter:       cp.Columns,
				}
				if cm == SubTableF {
					st.SubTableType = cp.Subordination
				}
				path := fmt.Sprintf("%s%s%s", base, cp.AppID, createSubTable)
				pa, err := json.Marshal(&st)
				if err != nil {
					return http.StatusInternalServerError, err
				}
				c, b, err := sendRequest2Struct(r, "POST", path, pa)
				if c != http.StatusOK || err != nil {
					return c, err
				}
				_, err = parseResp(b)
				if err != nil {
					return c, err
				}
			}
		}
	}
	return http.StatusOK, nil
}

func doFind(r *http.Request, sm *schema, path, cate string) (int, interface{}, error) {
	p := map[string]string{"tableID": sm.TableID}
	str, err := json.Marshal(p)
	if err != nil {
		return http.StatusInternalServerError, nil, err
	}
	c, b, err := sendRequest2Struct(r, "POST", path, str)
	if c != http.StatusOK || err != nil {
		return c, nil, err
	}
	rp, err := parseResp(b)
	if err != nil {
		return c, nil, err
	}
	if rp.Data != nil {
		st, err := json.Marshal(rp.Data)
		if err != nil {
			return c, nil, err
		}
		var table Table
		err = json.Unmarshal(st, &table)
		if err != nil {
			return c, nil, err
		}
		if prop, ok := table.Schema[Properties]; ok {
			p := prop.(map[string]interface{})
			co, err := fillSchema(r, p, table.TableID, cate)
			if err != nil {
				return co, nil, err
			}
		}
		return http.StatusOK, &table, nil
	}
	return http.StatusOK, nil, nil
}

func fillSchema(r *http.Request, schema map[string]interface{}, tableID, cate string) (int, error) {
	value := reflect.ValueOf(schema)
	switch reflect.TypeOf(schema).Kind() {
	case reflect.Map:
		iter := value.MapRange()
		for iter.Next() {
			val := iter.Value().Elem()
			switch val.Kind() {
			case reflect.Map:
				vm := val.Interface().(map[string]interface{})
				c, err := doFill(r, vm, tableID, iter.Key().String(), cate)
				if err != nil {
					return c, err
				}
			}
		}
	}
	return http.StatusOK, nil
}

func doFill(r *http.Request, vm map[string]interface{}, tableID, fieldNme, cate string) (int, error) {
	if tp, ok := vm[Type]; ok && tp == Arr {
		// 存在子表单或关联表单
		if cm, ok := vm[Component]; ok && (cm == SubTableF || cm == associatedRecords) {
			cp := ComponentProp{}
			if c, ok := vm[ComponentProps]; ok {
				err := genComponent(c, &cp)
				if err != nil {
					return http.StatusInternalServerError, err
				}
				tb := Table{
					TableID: cp.TableID,
				}
				if cm == SubTableF && cp.Subordination == blankTable {
					return http.StatusOK, nil
				}
				// 管理端，不用过滤schema
				path := fmt.Sprintf("%s%s%s", base, cp.AppID, formSchema)
				// 用户端，请求权限过滤后的schema
				if cate == "user" {
					path = fmt.Sprintf("%s%s%s%s", base, cp.AppID, userSchema, cp.TableID)
				}
				str, err := json.Marshal(&tb)
				if err != nil {
					return http.StatusInternalServerError, err
				}
				c, b, err := sendRequest2Struct(r, "POST", path, str)
				if c != http.StatusOK || err != nil {
					return c, err
				}
				rp, err := parseResp(b)
				if err != nil {
					return c, err
				}
				var ft map[string]interface{}
				if rp.Data != nil {
					st, err := json.Marshal(rp.Data)
					if err != nil {
						return c, err
					}
					var table Table
					err = json.Unmarshal(st, &table)
					if err != nil {
						return c, err
					}
					ft = table.Schema
				}
				// 判断是否存在 嵌套子表单(暂不考虑这种情况)
				// if po, ok := ft[Properties]; ok {
				// 	p := po.(map[string]interface{})
				// 	cd, err := fillSchema(r, p, cp.TableID, cate)
				// 	if err != nil {
				// 		return cd, err
				// 	}
				// }
				// 过滤子表单
				sub := &SubTable{
					TableID:    tableID,
					SubTableID: cp.TableID,
					FieldName:  fieldNme,
				}
				sr, err := json.Marshal(sub)
				if err != nil {
					return http.StatusInternalServerError, err
				}
				ph := fmt.Sprintf("%s%s%s", base, cp.AppID, querySubTable)
				c1, b1, err := sendRequest2Struct(r, "POST", ph, sr)
				if err != nil || c1 != http.StatusOK {
					return c1, err
				}
				rs, err := parseResp(b1)
				if err != nil {
					return c, err
				}
				if rs.Data != nil {
					st, err := json.Marshal(rs.Data)
					if err != nil {
						return c1, err
					}
					var stb SubTable
					err = json.Unmarshal(st, &stb)
					if err != nil {
						return c1, err
					}
					if fpo, ok := ft[Properties]; ok {
						p := fpo.(map[string]interface{})
						doFilter(p, &stb.Filter)
					}
					if cm == SubTableF && cp.Subordination == ForeignTable {
						vm[Items] = ft
					}
					if cm == AssociatedRecords {
						// doFilter(ft, &stb.Filter)
						cp.AssociatedTable = ft
						vm[ComponentProps] = &cp
					}
				}
			}
		}
	}
	return http.StatusOK, nil
}

func genComponent(c interface{}, cp *ComponentProp) error {
	cb, cbErr := json.Marshal(c)
	if cbErr != nil {
		return cbErr
	}
	err := json.Unmarshal(cb, cp)
	if err != nil {
		return err
	}
	return nil
}

// DoFilter filter map
func doFilter(schema map[string]interface{}, filter *[]string) {
	if len(*filter) == 0 {
		return
	}
	sort.Strings(*filter)
	v := reflect.ValueOf(schema)
	iter := v.MapRange()
	for iter.Next() {
		if !inArray(iter.Key().String(), filter) {
			delete(schema, iter.Key().String())
		}
	}
}

func inArray(target string, filter *[]string) bool {
	index := sort.SearchStrings(*filter, target)
	if index < len(*filter) && (*filter)[index] == target {
		return true
	}
	return false
}

type schema struct {
	TableID string                 `json:"tableID"`
	Schema  map[string]interface{} `json:"schema"`
}

type SubTable struct {
	// id pk
	ID string `json:"id"`
	// app id
	AppID string `json:"appID"`
	// table id
	TableID string `json:"tableID"`
	// table key name
	FieldName string `json:"fieldName"`
	// sub table id
	SubTableID string `json:"subTableID"`
	// table type
	SubTableType string `json:"subTableType"`
	// filter
	Filter []string `json:"filter"`
}

type Table struct {
	ID string `json:"id"`
	// table id
	TableID string `json:"tableID"`
	// table design json schema
	Schema map[string]interface{} `json:"schema"`
	// table page config json schema
	Config map[string]interface{} `json:"config"`
}

// schema中 x-component-props 结构
type ComponentProp struct {
	AppID   string   `json:"appID"`
	TableID string   `json:"tableID"`
	Columns []string `json:"columns"`
	// 'sub_table | foreign_table'
	Subordination string `json:"subordination"`
	// 关联表schema
	AssociatedTable interface{} `json:"associatedTable"`
}
