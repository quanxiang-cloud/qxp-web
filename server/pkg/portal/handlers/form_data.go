package handlers

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"qxp-web/server/pkg/contexts"
	"reflect"
	"sort"
	"strings"
)

const (
	base = "/api/v1/structor/"
	form = "/home/form/"
	userSchema = "/home/schema/"
	subForm = "/home/subForm/"
	formSchema = "/m/table/getByID"
	querySubTable = "/m/subTable/getByCondition"
	createSubTable = "/m/subTable/create"
	foreignTable = "foreign_table"
	blankTable = "sub_table"
	associatedRecords = "AssociatedRecords"
)

type input struct {
	Method    string
	Condition []Condition
	Entity    Entity
	Ref      []map[string]interface{}
}

// Condition Condition
type Condition struct {
	// Key column key
	Key string
	// Op in/like/eq/range
	Op string
	// Value condition value
	Value []interface{}
}

// Entity entity
type Entity interface{}

// FormDataHandler FormDataHandler
func FormDataHandler(w http.ResponseWriter, r *http.Request) {
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
	paths := strings.Split(path,"/")
	qp := map[string]string{"appID":paths[4],"tableID":paths[len(paths)-1]}

	form := new(input)
	if err = json.Unmarshal(body, form); err != nil {
		contexts.Logger.Error("Unmarshal err, %v\n", err)
		return
	}
	fmt.Printf("proxy api request, method: %s, url: %s,request_id: %s ", method, url, requestID)
	fr := &response{
		Code: 0,
	}

	c,rest,err := handler(r,form,qp)
	if c == 0{
		return
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

func handler(r *http.Request,in *input,p map[string]string) (int,interface{},error) {
	switch in.Method {
		case "findOne":
			return doFindOne(r,in,p)
		case "create":
			c,err := doCreate(r,in.Entity,p)
			return c,nil,err
		case "update":
			// update update#set
			if in.Ref != nil && len(in.Ref) > 0 {
				// diff 这里无法保证所有的请求都会成功，可能存在状态不一致的情况
				return doUpdate(r,in,p)
			}else {
				return directRequest(r,in)
			}
	case "delete":
		return directRequest(r,in)
	}
	return http.StatusOK,nil,nil
}

func doUpdate(r *http.Request,in *input,p map[string]string)(int,interface{},error)  {
	c,b,err := directRequest(r,in)
	if b == nil {
		return c,nil,err
	}
	if b.Code != 0 {
		return c,b,err
	}
	// 主数据成功了 更新子表单
	ref := in.Ref
	for i := 0;i< len(ref);i++{
		for key,value := range ref[i]{
			st, err := json.Marshal(value)
			if err != nil {
				continue
			}
			var df diff
			if err := json.Unmarshal(st,&df);err != nil{
				continue
			}
			subTable,err := getSubTable(r,p["appID"],p["tableID"],key)
			if err != nil{
				continue
			}
			var path = ""
			if subTable.SubTableType == blankTable{
				// 不校验权限
				path = fmt.Sprintf("%s%s%s%s",base,subTable.AppID,subForm,subTable.SubTableID)
			}else {
				path = fmt.Sprintf("%s%s%s%s",base,subTable.AppID,form,subTable.SubTableID)
			}
			if df.New != nil{
				for i:=0;i< len(df.New); i++{
					sn, err := json.Marshal(df.New[i])
					if err != nil {
						continue
					}
					_, _, err = sendRequest2Struct(r, "POST", path, sn)
					if err != nil {
						contexts.Logger.Errorf("failed to create table: %s subTable data response body, err: %s, request_id: %s",subTable.TableID, err.Error(), contexts.GetRequestID(r))
					}
				}
			}
			if df.Updated != nil{
				for i:=0;i< len(df.Updated); i++{
					su, err := json.Marshal(df.Updated[i])
					if err != nil {
						continue
					}
					_, _, err = sendRequest2Struct(r, "POST", path, su)
					if err != nil {
						contexts.Logger.Errorf("failed to update table: %s subTable data response body, err: %s, request_id: %s",subTable.TableID, err.Error(), contexts.GetRequestID(r))
					}
				}
			}
			if df.Deleted != nil{
				v := make([]interface{},0,len(df.Deleted))
				for i:=0;i< len(df.Deleted); i++{
					v = append(v,df.Deleted[i])
				}
				con := Condition{
					Key: "_id",
					Op: "in",
					Value: v,
				}
				in = &input{
					Method: "delete",
					Condition: []Condition{
						con,
					},
				}
				sd, err := json.Marshal(df.Deleted[i])
				if err != nil {
					continue
				}
				_, _, err = sendRequest2Struct(r, "POST", path, sd)
				if err != nil {
					contexts.Logger.Errorf("failed to delete table: %s subTable data response body, err: %s, request_id: %s",subTable.TableID, err.Error(), contexts.GetRequestID(r))
				}
			}
		}
	}
	return  http.StatusOK,nil,nil
}

func directRequest(r *http.Request,in *input)(int,*response,error)  {
	// 直接透传
	path := r.URL.Path
	jsonStr, err := json.Marshal(in)
	if err != nil {
		return http.StatusInternalServerError,nil,err
	}
	c,b,err := sendRequest2Struct(r,"POST",path,jsonStr)
	if b != nil{
		br,err := parseResp(b)
		return c,br,err
	}
	return c,nil,err
}

func doFindOne(r *http.Request,i *input,p map[string]string) (int,interface{},error) {
	findPath := fmt.Sprintf("%s%s%s%s",base, p["appID"],form,p["tableID"])
	jsonStr, err := json.Marshal(i)
	if err != nil {
		return http.StatusInternalServerError,nil,err
	}
	c, b, err := sendRequest2Struct(r, "POST", findPath, jsonStr)
	if c != http.StatusOK || err != nil {
		return c,nil,err
	}
	resp,err := parseResp(b)
	if err != nil{
		return c,nil,err
	}
	if resp.Data != nil{
		value := reflect.ValueOf(resp.Data)
		switch _t := reflect.TypeOf(resp.Data); _t.Kind() {
		case reflect.Map:
			iter := value.MapRange()
			for iter.Next() {
				val := iter.Value().Elem()
				switch val.Kind() {
				case reflect.Array,reflect.Slice:
					subTable,err := getSubTable(r,p["appID"],p["tableID"],iter.Key().String())
					if err != nil{
						return c,nil,err
					}
					if subTable == nil{
						break
					}
					subFindPath := fmt.Sprintf("%s%s%s%s",base, subTable.AppID,form,subTable.SubTableID)
					subInput := new(input)
					subInput.Method = "find"
					subInput.Condition = []Condition{{Key: "_id",Op: "in",Value: val.Interface().([]interface{})}}

					str, err := json.Marshal(subInput)
					if err != nil {
						return http.StatusInternalServerError,nil,err
					}
					co, bf, err := sendRequest2Struct(r, "POST", subFindPath, str)
					if co != http.StatusOK || err != nil {
						return co,nil,err
					}
					subResp,err := parseResp(bf)
					if err != nil {
						return co,nil,err
					}
					if subResp.Data != nil {
						d := subResp.Data.(map[string]interface{})
						if sd,ok := d["entities"];ok{
							value.SetMapIndex(reflect.ValueOf(iter.Key().String()), reflect.ValueOf(sd))
						}
					}
				}
			}
			return http.StatusOK,resp.Data,nil
		}
	}
	return http.StatusOK,nil,nil
}

func doCreate(r *http.Request,e Entity,p map[string]string)(int,error) {
	if e == nil {
		return http.StatusBadRequest,errors.New("bad parameter")
	}
	requestID := contexts.GetRequestID(r)
	value := reflect.ValueOf(e)
	switch _t := reflect.TypeOf(e); _t.Kind() {
	case reflect.Ptr:
		return doCreate(r,value.Elem(),p)
	case reflect.Array, reflect.Slice:
		for i := 0; i < value.Len(); i++ {
			if !value.Index(i).CanInterface() {
				continue
			}
			c,err := doCreate(r,value.Index(i),p)
			if err != nil{
				return c,err
			}
		}
	case reflect.Map:
		// 如果key的值类型是[]，确认是否是子表
		iter := value.MapRange()
		for iter.Next() {
			val := iter.Value().Elem()
			switch val.Kind() {
			case reflect.Array,reflect.Slice:
				subTable,err := getSubTable(r,p["appID"],p["tableID"],iter.Key().String())
				if err != nil{
					return http.StatusInternalServerError,err
				}
				if subTable == nil{
					break
				}
				rp := make([]string,0,val.Len())
				// 先插入子表单数据
				var subCreatePath string
				// 已存在子表单
				if subTable.SubTableType == foreignTable{
					subCreatePath = fmt.Sprintf("%s%s%s%s",base, subTable.AppID,form,subTable.SubTableID)
				}
				// 新建子表单
				if subTable.SubTableType == blankTable{
					subCreatePath = fmt.Sprintf("%s%s%s%s",base, subTable.AppID,subForm,subTable.SubTableID)
				}
				// 关联记录
				if subTable.SubTableType == associatedRecords{
					break
				}
				for i := 0;i<val.Len();i++{
					subInput := new(input)
					subInput.Method = "create"
					subInput.Entity = val.Index(i).Interface()
					sj,err := json.Marshal(subInput)
					if err != nil {
						return http.StatusInternalServerError,err
					}
					co, bf, err := sendRequest2Struct(r, "POST", subCreatePath, sj)
					if co != http.StatusOK || err != nil {
						contexts.Logger.Errorf("failed to create subTable response body, err: %s, request_id: %s", err.Error(), requestID)
						return co,err
					}
					subResp,err := parseResp(bf)
					if err != nil {
						return co,err
					}

					if subResp.Data != nil {
						d := subResp.Data.(map[string]interface{})
						if id,ok := d["_id"];ok{
							rp = append(rp,id.(string))
						}
					}
				}
				value.SetMapIndex(reflect.ValueOf(iter.Key().String()), reflect.ValueOf(rp))
			}
		}
		createPath := fmt.Sprintf("%s%s%s%s",base, p["appID"],form,p["tableID"])
		mInput := new(input)
		mInput.Method = "create"
		mInput.Entity = value.Interface()
		sj,err := json.Marshal(mInput)
		if err != nil {
			return http.StatusInternalServerError,err
		}
		cd, buf, err := sendRequest2Struct(r, "POST", createPath, sj)
		if cd != http.StatusOK || err != nil {
			contexts.Logger.Errorf("failed to create associatedRecords Table %s response body, err: %s, request_id: %s",p["tableID"], err.Error(), requestID)
			return cd,err
		}
		_,err = parseResp(buf)
		if err != nil {
			return cd,err
		}
	default:
		return http.StatusOK,nil
	}
	return http.StatusOK,nil
}

func parseResp(b []byte) (*response,error) {
	var resp response
	if err := json.Unmarshal(b, &resp); err != nil {
		return nil,err
	}
	if resp.Code != 0{
		return nil,errors.New(resp.Msg)
	}
	return &resp,nil
}

// GetSubTableReq GetSubTableReq
type GetSubTableReq struct {
	AppID   string `json:"appID"`
	TableID string `json:"tableID"`
	// table key name
	FieldName string `json:"fieldName"`
	// sub table id
	SubTableID string `json:"subTableID"`
	// table type
	SubTableType string `json:"subTableType"`
	// filter
	Filter  []string `json:"filter"`
}

type response struct {
	Code int `json:"code"`
	Data interface{} `json:"data"`
	Msg string  `json:"msg,omitempty"`
}

func in(target string, filter *[]string) bool {
	index := sort.SearchStrings(*filter, target)
	if index < len(*filter) && (*filter)[index] == target {
		return true
	}
	return false
}

type diff struct {
	AppID string `json:"appID"`
	TableID string `json:"tableID"`
	Updated []interface{} `json:"updated"`
	New []interface{} `json:"new"`
	Deleted []string  `json:"deleted"`
}

func getSubTable(r *http.Request,appID,tableID,fieldName string) (*GetSubTableReq,error) {
	req := map[string]string{
		"tableID" : tableID,
		"fieldName" : fieldName,
	}
	jsonStr, err := json.Marshal(req)
	if err != nil {
		return nil,err
	}
	path := fmt.Sprintf("%s%s%s",base, appID,querySubTable)
	c, body, err := sendRequest2Struct(r, "POST", path, jsonStr)
	if c != http.StatusOK || err != nil {
		return nil,err
	}
	resp,err := parseResp(body)
	if err != nil{
		return nil,err
	}
	// 并非子表单或关联表
	if resp.Data == nil{
		return nil,nil
	}
	st, err := json.Marshal(resp.Data)
	if err != nil {
		return nil,err
	}
	var subTable GetSubTableReq
	err = json.Unmarshal(st, &subTable)
	if err != nil {
		return nil,err
	}
	return  &subTable,nil
}

func sendRequest2Struct(r *http.Request, method string, fullPath string, body []byte)(int,[]byte,error){
	req, err := http.NewRequest(method, contexts.APIEndpoint+fullPath, bytes.NewBuffer(body))
	if err != nil {
		contexts.Logger.Error("failed to build request: %s", err.Error())
		// renderErrorPage(w, r, http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError))
		return http.StatusInternalServerError,nil,err
	}

	req.Header.Set("Access-Token", getToken(r))
	req.Header.Set("Content-Type", r.Header.Get("Content-Type"))
	req.Header.Set("User-Agent", r.Header.Get("User-Agent"))
	req.Header.Set("User-Id", r.Header.Get("User-Id"))

	contexts.Logger.Debugf(
		"proxy api request, method: %s, url: %s, header: %s request_id: %s", method, fullPath, req.Header, contexts.GetRequestID(r))

	resp, body, errMsg := contexts.RetrieveResponse(req)
	if errMsg != "" {
		contexts.Logger.Errorf("do request proxy error: %s, request_id: %s", err.Error(), contexts.GetRequestID(r))
		return http.StatusInternalServerError,nil,errors.New(errMsg)
	}
	if resp.StatusCode != http.StatusOK{
		return resp.StatusCode,nil,errors.New("error")
	}
	return resp.StatusCode,body,nil
}