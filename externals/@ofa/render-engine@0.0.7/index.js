System.register(['react', 'react-dom', '@ofa/utils', 'rxjs', 'rxjs/operators', 'rxjs/ajax'], (function (exports) {
  'use strict';
  var useState, useEffect, useMemo, React, ReactDOM, logger, combineLatest, skip, map, BehaviorSubject, of, Subject, map$1, filter, switchMap, share, catchError, withLatestFrom, concatWith, skip$1, ajax;
  return {
    setters: [function (module) {
      useState = module.useState;
      useEffect = module.useEffect;
      useMemo = module.useMemo;
      React = module["default"];
    }, function (module) {
      ReactDOM = module["default"];
    }, function (module) {
      logger = module.logger;
    }, function (module) {
      combineLatest = module.combineLatest;
      skip = module.skip;
      map = module.map;
      BehaviorSubject = module.BehaviorSubject;
      of = module.of;
      Subject = module.Subject;
    }, function (module) {
      map$1 = module.map;
      filter = module.filter;
      switchMap = module.switchMap;
      share = module.share;
      catchError = module.catchError;
      withLatestFrom = module.withLatestFrom;
      concatWith = module.concatWith;
      skip$1 = module.skip;
    }, function (module) {
      ajax = module.ajax;
    }],
    execute: (function () {

      exports('default', Render);

      function importComponent(packageName, exportName, version) {
        return System.import(packageName).then((systemModule) => {
          return systemModule[exportName || "default"];
        });
      }

      function convertResult(result, convertors) {
        return Object.entries(result).map(([propName, propValue]) => {
          var _a;
          return [
            propName,
            convertors[propName] ? (_a = convertors[propName]) == null ? void 0 : _a.call(convertors, propValue) : propValue
          ];
        }).reduce((res, [propName, value]) => {
          res[propName] = value;
          return res;
        }, {});
      }
      function useAPIStateDerivedProps({ props, stateHub }) {
        const initialState = {};
        const mappers = {};
        const resList$ = {};
        Object.entries(props).forEach(([propName, { initialValue, template: mapper, stateID }]) => {
          initialState[propName] = initialValue;
          mappers[propName] = mapper;
          resList$[propName] = stateHub.getState(stateID);
        });
        const [state, setState] = useState(initialState);
        useEffect(() => {
          const subscription = combineLatest(resList$).pipe(skip(1), map((result) => convertResult(result, mappers))).subscribe(setState);
          return () => subscription.unsubscribe();
        }, []);
        return state;
      }

      function getAPIInvokeProps(props, stateHub) {
        return Object.entries(props).reduce((acc, [propName, apiCalls]) => {
          function handleAction(...args) {
            apiCalls.forEach(({ stateID, paramsBuilder, onError, onSuccess }) => {
              const run = stateHub.getAction(stateID);
              try {
                const requestParams = paramsBuilder == null ? void 0 : paramsBuilder(...args);
                run({ params: requestParams, onError, onSuccess });
              } catch (error) {
                logger.log("failed to run convertor or run action:", error);
              }
            });
          }
          acc[propName] = handleAction;
          return acc;
        }, {});
      }

      function groupProps(props) {
        const apiDerivedProps = {};
        const apiInvokeProps = {};
        const constantProps = {};
        Object.entries(props).forEach(([propName, propDesc]) => {
          if (Array.isArray(propDesc)) {
            apiInvokeProps[propName] = propDesc;
            return;
          }
          if (propDesc.type === "constant_property") {
            constantProps[propName] = propDesc.value;
            return;
          }
          if (propDesc.type === "api_invoke_property") {
            if (!apiInvokeProps[propName]) {
              apiInvokeProps[propName] = [];
            }
            apiInvokeProps[propName].push(propDesc);
            return;
          }
          if (propDesc.type === "api_derived_property") {
            apiDerivedProps[propName] = propDesc;
            return;
          }
        });
        return { apiDerivedProps, apiInvokeProps, constantProps };
      }
      function useConnection({ nodeProps, stateHub }) {
        const { apiDerivedProps, apiInvokeProps, constantProps } = groupProps(nodeProps);
        const [apiStateProps] = useState(() => getAPIInvokeProps(apiInvokeProps, stateHub));
        const derivedProps = useAPIStateDerivedProps({ props: apiDerivedProps, stateHub });
        return useMemo(() => Object.assign(constantProps, apiStateProps, derivedProps), [derivedProps]);
      }

      function renderChildren({ nodes, stateHub }) {
        if (!nodes.length) {
          return null;
        }
        return React.createElement(React.Fragment, null, nodes.map((node) => React.createElement(renderNode, { key: node.key, node, stateHub })));
      }
      function renderNode({ node, stateHub }) {
        const [loaded, setLoaded] = React.useState(false);
        const asyncModule = React.useRef();
        const props = useConnection({ nodeProps: node.props || {}, stateHub });
        React.useEffect(() => {
          if (node.type === "html-element") {
            asyncModule.current = node.name;
            setLoaded(true);
            return;
          }
          importComponent(node.packageName, node.exportName, node.packageVersion).then((comp) => {
            if (!comp) {
              logger.error(`got empty component for package: ${node.packageName},`, `exportName: ${node.exportName}, version: ${node.packageVersion}`);
            }
            asyncModule.current = comp;
            setLoaded(true);
          });
        }, []);
        if (!loaded || !asyncModule.current) {
          return null;
        }
        if (!node.children || !node.children.length) {
          return React.createElement(asyncModule.current, props);
        }
        return React.createElement(asyncModule.current, props, React.createElement(renderChildren, { nodes: node.children || [], stateHub }));
      }
      function renderSchema({ schema, rootEle, stateHub }) {
        ReactDOM.render(React.createElement(renderNode, { node: schema.node, stateHub }), rootEle);
      }

      var __defProp$2 = Object.defineProperty;
      var __defProps$2 = Object.defineProperties;
      var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
      var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
      var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$2 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$2.call(b, prop))
            __defNormalProp$2(a, prop, b[prop]);
        if (__getOwnPropSymbols$2)
          for (var prop of __getOwnPropSymbols$2(b)) {
            if (__propIsEnum$2.call(b, prop))
              __defNormalProp$2(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
      function instantiateFuncSpec({ type, args, body }) {
        if (type === "api_state_mapper_func_spec") {
          return new Function("apiState", body);
        }
        if (type === "param_builder_func_spec") {
          return new Function(args, body);
        }
        if (type === "api_invoke_call_func_spec") {
          return new Function("apiState", body);
        }
        return;
      }
      function transformProps(props) {
        return Object.entries(props).map(([propName, propDesc]) => {
          if (Array.isArray(propDesc)) {
            return [
              propName,
              propDesc.map(({ type, stateID, paramsBuilder, onSuccess, onError }) => {
                return {
                  type,
                  stateID,
                  paramsBuilder: paramsBuilder ? instantiateFuncSpec(paramsBuilder) : void 0,
                  onSuccess: onSuccess ? instantiateFuncSpec(onSuccess) : void 0,
                  onError: onError ? instantiateFuncSpec(onError) : void 0
                };
              })
            ];
          }
          if (propDesc.type === "constant_property") {
            return [propName, propDesc];
          }
          if (propDesc.type === "api_derived_property") {
            return [propName, __spreadProps$2(__spreadValues$2({}, propDesc), {
              template: propDesc.template ? instantiateFuncSpec(propDesc.template) : void 0
            })];
          }
          if (propDesc.type === "api_invoke_property") {
            return [propName, __spreadProps$2(__spreadValues$2({}, propDesc), {
              paramsBuilder: propDesc.paramsBuilder ? instantiateFuncSpec(propDesc.paramsBuilder) : void 0,
              onSuccess: propDesc.onSuccess ? instantiateFuncSpec(propDesc.onSuccess) : void 0,
              onError: propDesc.onError ? instantiateFuncSpec(propDesc.onError) : void 0
            })];
          }
          return null;
        }).filter((pair) => {
          return !!pair;
        }).reduce((acc, [propName, propDesc]) => {
          acc[propName] = propDesc;
          return acc;
        }, {});
      }
      function transformNode(node) {
        const children = (node.children || []).map((n) => transformNode(n));
        return __spreadProps$2(__spreadValues$2({}, node), {
          children,
          props: transformProps(node.props || {})
        });
      }
      function deserializeSchema({ node, statesMap }) {
        try {
          return { statesMap, node: transformNode(node) };
        } catch (error) {
          console.error(error);
          return null;
        }
      }

      var HttpMethods;
      (function(HttpMethods2) {
        HttpMethods2["GET"] = "get";
        HttpMethods2["PUT"] = "put";
        HttpMethods2["POST"] = "post";
        HttpMethods2["DELETE"] = "delete";
        HttpMethods2["OPTIONS"] = "options";
        HttpMethods2["HEAD"] = "head";
        HttpMethods2["PATCH"] = "patch";
        HttpMethods2["TRACE"] = "trace";
      })(HttpMethods || (HttpMethods = {}));
      const METHODS = Object.values(HttpMethods);
      function indexOperation(apiDoc) {
        const operationIDMap = {};
        for (const [path, pathItemObject] of Object.entries(apiDoc.paths)) {
          if (!pathItemObject) {
            continue;
          }
          for (const method of METHODS) {
            const operationObject = pathItemObject[method];
            if (!operationObject) {
              continue;
            }
            operationIDMap[`${operationObject.operationId}`] = {
              path,
              method,
              parameters: operationObject.parameters,
              requestBody: operationObject.requestBody
            };
          }
        }
        return operationIDMap;
      }
      class SpecInterpreter {
        constructor(apiDoc) {
          this.operationMap = indexOperation(apiDoc);
          this.docComponents = apiDoc.components;
        }
        buildRequest(operationID, requestParam) {
          const operationSpec = this.operationMap[operationID];
          if (!operationSpec) {
            throw new Error(`can not find spec for operation: ${operationID}`);
          }
          const { path, method, parameters } = operationSpec;
          const requestConfig = { method, path };
          parameters == null ? void 0 : parameters.forEach((p) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if ("$ref" in p) {
              return;
            }
            if (p.in === "path") {
              if (p.required && ((_a = requestParam == null ? void 0 : requestParam.params) == null ? void 0 : _a[p.name]) === void 0) {
                throw new Error(`parameter '${p.name}' required in path for ${operationID}`);
              }
              requestConfig.path = requestConfig.path.replace(`{${p.name}}`, (_b = requestParam == null ? void 0 : requestParam.params) == null ? void 0 : _b[p.name]);
            }
            if (p.in === "query") {
              if (p.required && ((_c = requestParam == null ? void 0 : requestParam.params) == null ? void 0 : _c[p.name]) === void 0) {
                throw new Error(`parameter '${p.name}' required in query for ${operationID}`);
              }
              if (((_d = requestParam == null ? void 0 : requestParam.params) == null ? void 0 : _d[p.name]) !== void 0) {
                requestConfig.query = requestConfig.query || {};
                requestConfig.query[p.name] = (_e = requestParam == null ? void 0 : requestParam.params) == null ? void 0 : _e[p.name];
              }
            }
            if (p.in === "header") {
              if (p.required && ((_f = requestParam == null ? void 0 : requestParam.params) == null ? void 0 : _f[p.name]) === void 0) {
                throw new Error(`parameter '${p.name}' required in header for ${operationID}`);
              }
              if (((_g = requestParam == null ? void 0 : requestParam.params) == null ? void 0 : _g[p.name]) !== void 0) {
                requestConfig.header = requestConfig.header || {};
                requestConfig.header[p.name] = (_h = requestParam == null ? void 0 : requestParam.params) == null ? void 0 : _h[p.name];
              }
            }
          });
          requestConfig.body = requestParam == null ? void 0 : requestParam.body;
          return requestConfig;
        }
      }

      var __defProp$1 = Object.defineProperty;
      var __defProps$1 = Object.defineProperties;
      var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
      var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
      var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$1 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$1.call(b, prop))
            __defNormalProp$1(a, prop, b[prop]);
        if (__getOwnPropSymbols$1)
          for (var prop of __getOwnPropSymbols$1(b)) {
            if (__propIsEnum$1.call(b, prop))
              __defNormalProp$1(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
      const noop = () => {
      };
      function requestConfigToAjaxRequest(config) {
        let url = `http://localhost:8080${config.path}`;
        const query = Object.entries(config.query || {}).map(([key, value]) => `${key}=${value}`).join("&");
        if (query) {
          url = `${url}?${query}`;
        }
        return {
          method: config.method,
          url,
          headers: {
            "Content-Type": "application/json"
          },
          async: true,
          timeout: 1e3,
          crossDomain: false,
          withCredentials: false,
          responseType: "json",
          body: config.body
        };
      }
      function sendRequest(ajaxRequest) {
        return ajax(ajaxRequest).pipe(map$1(({ response }) => ({ data: response, error: void 0 })), catchError((error) => {
          return of({ error, data: void 0 });
        }));
      }
      function http(request$) {
        const response$ = request$.pipe(map$1(requestConfigToAjaxRequest), switchMap(sendRequest), share());
        response$.subscribe(noop);
        return response$;
      }
      const initialState = { data: void 0, error: void 0, loading: false };
      function getResponseState$(request$) {
        const state$ = new BehaviorSubject(initialState);
        const response$ = http(request$);
        response$.pipe(map$1((resp) => __spreadProps$1(__spreadValues$1({}, resp), { loading: false }))).subscribe(state$);
        request$.pipe(filter(() => state$.getValue().loading === false), map$1(() => __spreadProps$1(__spreadValues$1({}, state$.getValue()), { loading: true }))).subscribe(state$);
        return state$;
      }

      var __defProp = Object.defineProperty;
      var __defProps = Object.defineProperties;
      var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols = Object.getOwnPropertySymbols;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __propIsEnum = Object.prototype.propertyIsEnumerable;
      var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        if (__getOwnPropSymbols)
          for (var prop of __getOwnPropSymbols(b)) {
            if (__propIsEnum.call(b, prop))
              __defNormalProp(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
      function executeCallback(state, runParams) {
        var _a, _b;
        if (state.loading) {
          return;
        }
        if (state.error) {
          (_a = runParams == null ? void 0 : runParams.onError) == null ? void 0 : _a.call(runParams, state);
          return;
        }
        (_b = runParams == null ? void 0 : runParams.onSuccess) == null ? void 0 : _b.call(runParams, state);
      }
      class StateHub {
        constructor(apiDoc, stateIDMap) {
          this.statesCache = {};
          this.specInterpreter = new SpecInterpreter(apiDoc);
          this.stateIDMap = stateIDMap;
        }
        getState(stateID) {
          const [state$] = this.getStream(stateID);
          return state$;
        }
        getAction(stateID) {
          const [, { run }] = this.getStream(stateID);
          return run;
        }
        getStream(stateID) {
          if (!this.stateIDMap[stateID]) ;
          const key = `${stateID}:${this.stateIDMap[stateID]}`;
          if (!this.statesCache[key]) {
            this.statesCache[key] = this.initState(stateID);
          }
          return this.statesCache[key];
        }
        refresh(stateID) {
          const [, { refresh }] = this.getStream(stateID);
          refresh();
        }
        initState(stateID) {
          const params$ = new Subject();
          const request$ = params$.pipe(map$1((params) => {
            var _a;
            return this.specInterpreter.buildRequest((_a = this.stateIDMap[stateID]) == null ? void 0 : _a.operationID, params);
          }));
          const fullState$ = getResponseState$(request$).pipe(withLatestFrom(of(void 0).pipe(concatWith(params$))), map$1(([state, params]) => __spreadProps(__spreadValues({}, state), { params })));
          fullState$.pipe(skip$1(1)).subscribe((state) => {
            setTimeout(() => {
              executeCallback(state, _latestRunParams);
            }, 10);
          });
          let _latestRunParams = void 0;
          const streamActions = {
            run: (runParam) => {
              _latestRunParams = runParam;
              params$.next(runParam == null ? void 0 : runParam.params);
            },
            refresh: () => {
              _latestRunParams = { params: _latestRunParams == null ? void 0 : _latestRunParams.params };
              params$.next(_latestRunParams == null ? void 0 : _latestRunParams.params);
            }
          };
          return [fullState$, streamActions];
        }
      }

      function Render({ schema, rootEle, apiDoc }) {
        const instantiatedSchema = deserializeSchema(schema);
        if (!instantiatedSchema) {
          return;
        }
        const stateHub = new StateHub(apiDoc, instantiatedSchema.statesMap);
        window.stateHub = stateHub;
        renderSchema({ schema: instantiatedSchema, stateHub, rootEle });
      }

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZXBvc2l0b3J5LnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1hcGktc3RhdGUtZGVyaXZlZC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy9nZXQtYXBpLWludm9rZS1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtY29ubmVjdGlvbi50cyIsIi4uLy4uLy4uL3NyYy9yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvZGVzZXJpYWxpemUtc2NoZW1hLnRzIiwiLi4vLi4vLi4vc3JjL3NwZWMtaW50ZXJwcmV0ZXIvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvcmVzcG9uc2UudHMiLCIuLi8uLi8uLi9zcmMvc3RhdGUtaHViLnRzIiwiLi4vLi4vLi4vaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHluYW1pY0NvbXBvbmVudCB9IGZyb20gJy4vdHlwZXMnO1xuXG50eXBlIENvbXBvbmVudFVSTFJlc29sdmVyID0gKGNvbXBvbmVudE5hbWU6IHN0cmluZywgdmVyc2lvbj86IHN0cmluZykgPT4gc3RyaW5nO1xuLy8gVE9ETzogc3VwcG9ydCBpbXBvcnQgY29uc3QgdmFsdWUgYW5kIHBydW5lIGZ1bmN0aW9uc1xudHlwZSBJbXBvcnRlciA9IChzeXN0ZW1Nb2R1bGU6IFN5c3RlbS5Nb2R1bGUsIGNvbXBvbmVudE5hbWU6IHN0cmluZywgdmVyc2lvbj86IHN0cmluZykgPT4gRHluYW1pY0NvbXBvbmVudDtcblxuZXhwb3J0IHR5cGUgUmVnaXN0cnlPcHRpb25zID0ge1xuICBjb21wb25lbnRVUkxSZXNvbHZlcjogQ29tcG9uZW50VVJMUmVzb2x2ZXI7XG4gIGltcG9ydGVyPzogSW1wb3J0ZXI7XG4gIGluamVjdERlcGVuZGVuY2llcz86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRJbXBvcnRlcihzeXN0ZW1Nb2R1bGU6IFN5c3RlbS5Nb2R1bGUpIHtcbiAgcmV0dXJuIHN5c3RlbU1vZHVsZS5kZWZhdWx0O1xufVxuXG5jb25zdCByZXBvc2l0b3J5OiBSZWNvcmQ8c3RyaW5nLCBSZWdpc3RyeU9wdGlvbnM+ID0ge307XG5cbi8vIHJlZ2lzdGVyIGEgY29tcG9uZW50cyBuYW1lc3BhY2VcbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlcihuYW1lU3BhY2U6IHN0cmluZywgb3B0aW9uczogUmVnaXN0cnlPcHRpb25zKTogdm9pZCB7XG4gIHJlcG9zaXRvcnlbbmFtZVNwYWNlXSA9IG9wdGlvbnM7XG59XG5cbi8vIGZ1bmN0aW9uIHJlc29sdmVDb21wb25lbnRQYXRoKGNvbXBvbmVudE5hbWU6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nKSB7XG4vLyAgIC8vIHJlbmRlciBpbXBvcnQtbWFwLmpzb25cbi8vICAgcmV0dXJuIGAvcGFja2FnZXMvJHtjb21wb25lbnROYW1lfS9kaXN0L2luZGV4LmpzYDtcbi8vIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGltcG9ydENvbXBvbmVudChwYWNrYWdlTmFtZTogc3RyaW5nLCBleHBvcnROYW1lOiBzdHJpbmcsIHZlcnNpb24/OiBzdHJpbmcpOiBQcm9taXNlPER5bmFtaWNDb21wb25lbnQ+IHtcbiAgcmV0dXJuIFN5c3RlbS5pbXBvcnQocGFja2FnZU5hbWUpLnRoZW4oKHN5c3RlbU1vZHVsZSkgPT4ge1xuICAgIHJldHVybiBzeXN0ZW1Nb2R1bGVbZXhwb3J0TmFtZSB8fCAnZGVmYXVsdCddO1xuICB9KTtcbn1cblxuLy8gVE9ETzogY29tcG9uZW50IG5hbWUgc2hvdWxkIGJlIGxvd2VyIGNhc2VcbmV4cG9ydCBmdW5jdGlvbiBnZXRCYXNpY0NvbXBvbmVudHNPcHRpb25zKCk6IFJlZ2lzdHJ5T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgY29tcG9uZW50VVJMUmVzb2x2ZXI6IChfLCB2ZXJzaW9uKTogc3RyaW5nID0+IHtcbiAgICAgIHJldHVybiBgL2Rpc3QvYnVuZGxlQCR7dmVyc2lvbn0uanNgO1xuICAgIH0sXG4gICAgaW1wb3J0ZXI6IChzeXN0ZW1Nb2R1bGUsIGNvbXBvbmVudE5hbWUpOiBEeW5hbWljQ29tcG9uZW50ID0+IHtcbiAgICAgIC8vIFRPRE86IGNoZWNrIG1vZHVsZSBpcyB1bmRlZmluZWRcbiAgICAgIHJldHVybiBzeXN0ZW1Nb2R1bGVbY29tcG9uZW50TmFtZV07XG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkdmFuY2VkQ29tcG9uZW50c09wdGlvbnMoKTogUmVnaXN0cnlPcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBjb21wb25lbnRVUkxSZXNvbHZlcjogKGNvbXBvbmVudE5hbWUsIHZlcnNpb24pOiBzdHJpbmcgPT4ge1xuICAgICAgY29uc3QgZnJhZ21lbnRzID0gY29tcG9uZW50TmFtZS5zcGxpdCgnLycpO1xuXG4gICAgICBpZiAoZnJhZ21lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gYC9kaXN0L2FkdmFuY2VkLWNvbXBvbmVudHMvJHtmcmFnbWVudHNbMF19QCR7dmVyc2lvbn0vaW5kZXguanNgO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYWluQ29tcG9uZW50TmFtZSA9IGZyYWdtZW50cy5zaGlmdCgpO1xuICAgICAgZnJhZ21lbnRzLnVuc2hpZnQoYCR7bWFpbkNvbXBvbmVudE5hbWV9QCR7dmVyc2lvbn1gKTtcblxuICAgICAgcmV0dXJuIGAvZGlzdC9hZHZhbmNlZC1jb21wb25lbnRzLyR7ZnJhZ21lbnRzLmpvaW4oJy8nKX0uanNgO1xuICAgIH0sXG4gIH07XG59XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgbWFwLCBPYnNlcnZhYmxlLCBza2lwIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCBTdGF0ZUh1YiBmcm9tICcuL3N0YXRlLWh1Yic7XG5pbXBvcnQgeyBBUElEZXJpdmVkUHJvcGVydHksIEluc3RhbnRpYXRlZCwgQVBJU3RhdGVDb252ZXJ0RnVuYyB9IGZyb20gJy4vdHlwZXMnO1xuXG50eXBlIFVzZUFQSVByb3BzID0ge1xuICBwcm9wczogUmVjb3JkPHN0cmluZywgQVBJRGVyaXZlZFByb3BlcnR5PEluc3RhbnRpYXRlZD4+O1xuICBzdGF0ZUh1YjogU3RhdGVIdWI7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRSZXN1bHQoXG4gIHJlc3VsdDogUmVjb3JkPHN0cmluZywgYW55PixcbiAgY29udmVydG9yczogUmVjb3JkPHN0cmluZywgQVBJU3RhdGVDb252ZXJ0RnVuYyB8IHVuZGVmaW5lZD4sXG4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHJlc3VsdCkubWFwKChbcHJvcE5hbWUsIHByb3BWYWx1ZV0pID0+IHtcbiAgICByZXR1cm4gW1xuICAgICAgcHJvcE5hbWUsXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgY29udmVydCBlcnJvciBjYXNlXG4gICAgICBjb252ZXJ0b3JzW3Byb3BOYW1lXSA/IGNvbnZlcnRvcnNbcHJvcE5hbWVdPy4ocHJvcFZhbHVlKSA6IHByb3BWYWx1ZSxcbiAgICBdO1xuICB9KS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgYW55Pj4oKHJlcywgW3Byb3BOYW1lLCB2YWx1ZV0pID0+IHtcbiAgICByZXNbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgcmV0dXJuIHJlcztcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VBUElTdGF0ZURlcml2ZWRQcm9wcyh7IHByb3BzLCBzdGF0ZUh1YiB9OiBVc2VBUElQcm9wcyk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCBpbml0aWFsU3RhdGU6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgY29uc3QgbWFwcGVyczogUmVjb3JkPHN0cmluZywgQVBJU3RhdGVDb252ZXJ0RnVuYyB8IHVuZGVmaW5lZD4gPSB7fTtcbiAgY29uc3QgcmVzTGlzdCQ6IFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8YW55Pj4gPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhwcm9wcykuZm9yRWFjaCgoW3Byb3BOYW1lLCB7IGluaXRpYWxWYWx1ZSwgdGVtcGxhdGU6IG1hcHBlciwgc3RhdGVJRCB9XSkgPT4ge1xuICAgIGluaXRpYWxTdGF0ZVtwcm9wTmFtZV0gPSBpbml0aWFsVmFsdWU7XG4gICAgbWFwcGVyc1twcm9wTmFtZV0gPSBtYXBwZXI7XG4gICAgcmVzTGlzdCRbcHJvcE5hbWVdID0gc3RhdGVIdWIuZ2V0U3RhdGUoc3RhdGVJRCk7XG4gIH0pO1xuXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYW55Pj4oaW5pdGlhbFN0YXRlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGNvbWJpbmVMYXRlc3QocmVzTGlzdCQpLnBpcGUoXG4gICAgICBza2lwKDEpLFxuICAgICAgbWFwKChyZXN1bHQpID0+IGNvbnZlcnRSZXN1bHQocmVzdWx0LCBtYXBwZXJzKSksXG4gICAgKS5zdWJzY3JpYmUoc2V0U3RhdGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9mYS91dGlscyc7XG5cbmltcG9ydCBTdGF0ZUh1YiBmcm9tICcuL3N0YXRlLWh1Yic7XG5pbXBvcnQgeyBBUElJbnZva2VQcm9wZXJ0eSwgSW5zdGFudGlhdGVkIH0gZnJvbSAnLi90eXBlcyc7XG5cbnR5cGUgQVBJQ2FsbFByb3BzID0gUmVjb3JkPHN0cmluZywgKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkPjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0QVBJSW52b2tlUHJvcHMoXG4gIHByb3BzOiBSZWNvcmQ8c3RyaW5nLCBBUElJbnZva2VQcm9wZXJ0eTxJbnN0YW50aWF0ZWQ+W10+LFxuICBzdGF0ZUh1YjogU3RhdGVIdWIsXG4pOiBBUElDYWxsUHJvcHMge1xuICByZXR1cm4gT2JqZWN0LmVudHJpZXMocHJvcHMpXG4gICAgLnJlZHVjZTxBUElDYWxsUHJvcHM+KChhY2MsIFtwcm9wTmFtZSwgYXBpQ2FsbHNdKSA9PiB7XG4gICAgICBmdW5jdGlvbiBoYW5kbGVBY3Rpb24oLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgYXBpQ2FsbHMuZm9yRWFjaCgoeyBzdGF0ZUlELCBwYXJhbXNCdWlsZGVyLCBvbkVycm9yLCBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJ1biA9IHN0YXRlSHViLmdldEFjdGlvbihzdGF0ZUlEKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdFBhcmFtcyA9IHBhcmFtc0J1aWxkZXI/LiguLi5hcmdzKTtcbiAgICAgICAgICAgIHJ1bih7IHBhcmFtczogcmVxdWVzdFBhcmFtcywgb25FcnJvciwgb25TdWNjZXNzIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsb2dnZXIubG9nKCdmYWlsZWQgdG8gcnVuIGNvbnZlcnRvciBvciBydW4gYWN0aW9uOicsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBhY2NbcHJvcE5hbWVdID0gaGFuZGxlQWN0aW9uO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG59XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB1c2VBUElTdGF0ZURlcml2ZWRQcm9wcyBmcm9tICcuL3VzZS1hcGktc3RhdGUtZGVyaXZlZC1wcm9wcyc7XG5pbXBvcnQgeyBBUElJbnZva2VQcm9wZXJ0eSwgQVBJRGVyaXZlZFByb3BlcnR5LCBDb25zdGFudFByb3BlcnR5LCBOb2RlUHJvcHMsIEluc3RhbnRpYXRlZCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IFN0YXRlSHViIGZyb20gJy4vc3RhdGUtaHViJztcbmltcG9ydCBnZXRBUElJbnZva2VQcm9wcyBmcm9tICcuL2dldC1hcGktaW52b2tlLXByb3BzJztcblxudHlwZSBHcm91cGVkUHJvcHMgPSB7XG4gIGFwaURlcml2ZWRQcm9wczogUmVjb3JkPHN0cmluZywgQVBJRGVyaXZlZFByb3BlcnR5PEluc3RhbnRpYXRlZD4+O1xuICBhcGlJbnZva2VQcm9wczogUmVjb3JkPHN0cmluZywgQVBJSW52b2tlUHJvcGVydHk8SW5zdGFudGlhdGVkPltdPjtcbiAgY29uc3RhbnRQcm9wczogUmVjb3JkPHN0cmluZywgYW55Pjtcbn1cblxuZnVuY3Rpb24gZ3JvdXBQcm9wcyhwcm9wczogTm9kZVByb3BzPEluc3RhbnRpYXRlZD4pOiBHcm91cGVkUHJvcHMge1xuICBjb25zdCBhcGlEZXJpdmVkUHJvcHM6IFJlY29yZDxzdHJpbmcsIEFQSURlcml2ZWRQcm9wZXJ0eTxJbnN0YW50aWF0ZWQ+PiA9IHt9O1xuICBjb25zdCBhcGlJbnZva2VQcm9wczogUmVjb3JkPHN0cmluZywgQVBJSW52b2tlUHJvcGVydHk8SW5zdGFudGlhdGVkPltdPiA9IHt9O1xuICBjb25zdCBjb25zdGFudFByb3BzOiBSZWNvcmQ8c3RyaW5nLCBDb25zdGFudFByb3BlcnR5PiA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKHByb3BzKS5mb3JFYWNoKChbcHJvcE5hbWUsIHByb3BEZXNjXSkgPT4ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BEZXNjKSkge1xuICAgICAgYXBpSW52b2tlUHJvcHNbcHJvcE5hbWVdID0gcHJvcERlc2M7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByb3BEZXNjLnR5cGUgPT09ICdjb25zdGFudF9wcm9wZXJ0eScpIHtcbiAgICAgIGNvbnN0YW50UHJvcHNbcHJvcE5hbWVdID0gcHJvcERlc2MudmFsdWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByb3BEZXNjLnR5cGUgPT09ICdhcGlfaW52b2tlX3Byb3BlcnR5Jykge1xuICAgICAgaWYgKCFhcGlJbnZva2VQcm9wc1twcm9wTmFtZV0pIHtcbiAgICAgICAgYXBpSW52b2tlUHJvcHNbcHJvcE5hbWVdID0gW107XG4gICAgICB9XG4gICAgICBhcGlJbnZva2VQcm9wc1twcm9wTmFtZV0ucHVzaChwcm9wRGVzYyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByb3BEZXNjLnR5cGUgPT09ICdhcGlfZGVyaXZlZF9wcm9wZXJ0eScpIHtcbiAgICAgIGFwaURlcml2ZWRQcm9wc1twcm9wTmFtZV0gPSBwcm9wRGVzYztcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7IGFwaURlcml2ZWRQcm9wcywgYXBpSW52b2tlUHJvcHMsIGNvbnN0YW50UHJvcHMgfTtcbn1cblxudHlwZSBQcm9wcyA9IHtcbiAgbm9kZVByb3BzOiBOb2RlUHJvcHM8SW5zdGFudGlhdGVkPjtcbiAgc3RhdGVIdWI6IFN0YXRlSHViO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VDb25uZWN0aW9uKHsgbm9kZVByb3BzLCBzdGF0ZUh1YiB9OiBQcm9wcyk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICBjb25zdCB7IGFwaURlcml2ZWRQcm9wcywgYXBpSW52b2tlUHJvcHMsIGNvbnN0YW50UHJvcHMgfSA9IGdyb3VwUHJvcHMobm9kZVByb3BzKTtcbiAgY29uc3QgW2FwaVN0YXRlUHJvcHNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgYW55Pj4oKCkgPT4gZ2V0QVBJSW52b2tlUHJvcHMoYXBpSW52b2tlUHJvcHMsIHN0YXRlSHViKSk7XG4gIGNvbnN0IGRlcml2ZWRQcm9wcyA9IHVzZUFQSVN0YXRlRGVyaXZlZFByb3BzKHsgcHJvcHM6IGFwaURlcml2ZWRQcm9wcywgc3RhdGVIdWIgfSk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4gT2JqZWN0LmFzc2lnbihjb25zdGFudFByb3BzLCBhcGlTdGF0ZVByb3BzLCBkZXJpdmVkUHJvcHMpLCBbZGVyaXZlZFByb3BzXSk7XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvZmEvdXRpbHMnO1xuXG5pbXBvcnQge1xuICBpbXBvcnRDb21wb25lbnQsXG4gIC8vIHJlZ2lzdGVyLFxuICAvLyBnZXRCYXNpY0NvbXBvbmVudHNPcHRpb25zLFxuICAvLyBnZXRBZHZhbmNlZENvbXBvbmVudHNPcHRpb25zLFxufSBmcm9tICcuL3JlcG9zaXRvcnknO1xuaW1wb3J0IHtcbiAgRHluYW1pY0NvbXBvbmVudCxcbiAgSW5zdGFudGlhdGVkLFxuICBJbnN0YW50aWF0ZWRTY2hlbWEsXG4gIFNjaGVtYU5vZGUsXG59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IFN0YXRlSHViIGZyb20gJy4vc3RhdGUtaHViJztcbmltcG9ydCB1c2VDb25uZWN0aW9uIGZyb20gJy4vdXNlLWNvbm5lY3Rpb24nO1xuXG50eXBlIFJlbmRlck5vZGVzUHJvcHMgPSB7XG4gIG5vZGVzOiBTY2hlbWFOb2RlPEluc3RhbnRpYXRlZD5bXTtcbiAgc3RhdGVIdWI6IFN0YXRlSHViO1xufVxuXG5mdW5jdGlvbiByZW5kZXJDaGlsZHJlbih7IG5vZGVzLCBzdGF0ZUh1YiB9OiBSZW5kZXJOb2Rlc1Byb3BzKTogUmVhY3QuRnVuY3Rpb25Db21wb25lbnRFbGVtZW50PGFueT4gfCBudWxsIHtcbiAgaWYgKCFub2Rlcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIFJlYWN0LkZyYWdtZW50LFxuICAgIG51bGwsXG4gICAgbm9kZXMubWFwKChub2RlKSA9PiBSZWFjdC5jcmVhdGVFbGVtZW50KHJlbmRlck5vZGUsIHsga2V5OiBub2RlLmtleSwgbm9kZTogbm9kZSwgc3RhdGVIdWI6IHN0YXRlSHViIH0pKSxcbiAgKTtcbn1cblxudHlwZSBSZW5kZXJOb2RlUHJvcHMgPSB7XG4gIG5vZGU6IFNjaGVtYU5vZGU8SW5zdGFudGlhdGVkPlxuICBzdGF0ZUh1YjogU3RhdGVIdWI7XG59XG5cbmZ1bmN0aW9uIHJlbmRlck5vZGUoeyBub2RlLCBzdGF0ZUh1YiB9OiBSZW5kZXJOb2RlUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgW2xvYWRlZCwgc2V0TG9hZGVkXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgYXN5bmNNb2R1bGUgPSBSZWFjdC51c2VSZWY8RHluYW1pY0NvbXBvbmVudCB8IHN0cmluZz4oKTtcblxuICBjb25zdCBwcm9wcyA9IHVzZUNvbm5lY3Rpb24oeyBub2RlUHJvcHM6IG5vZGUucHJvcHMgfHwge30sIHN0YXRlSHViIH0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcpIHtcbiAgICAgIGFzeW5jTW9kdWxlLmN1cnJlbnQgPSBub2RlLm5hbWU7XG4gICAgICBzZXRMb2FkZWQodHJ1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaW1wb3J0Q29tcG9uZW50KG5vZGUucGFja2FnZU5hbWUsIG5vZGUuZXhwb3J0TmFtZSwgbm9kZS5wYWNrYWdlVmVyc2lvbikudGhlbigoY29tcCkgPT4ge1xuICAgICAgaWYgKCFjb21wKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICBgZ290IGVtcHR5IGNvbXBvbmVudCBmb3IgcGFja2FnZTogJHtub2RlLnBhY2thZ2VOYW1lfSxgLFxuICAgICAgICAgIGBleHBvcnROYW1lOiAke25vZGUuZXhwb3J0TmFtZX0sIHZlcnNpb246ICR7bm9kZS5wYWNrYWdlVmVyc2lvbn1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgYXN5bmNNb2R1bGUuY3VycmVudCA9IGNvbXA7XG4gICAgICBzZXRMb2FkZWQodHJ1ZSk7XG4gICAgfSk7XG4gIH0sIFtdKTtcblxuICBpZiAoIWxvYWRlZCB8fCAhYXN5bmNNb2R1bGUuY3VycmVudCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFub2RlLmNoaWxkcmVuIHx8ICFub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChhc3luY01vZHVsZS5jdXJyZW50LCBwcm9wcykpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgYXN5bmNNb2R1bGUuY3VycmVudCxcbiAgICAgIHByb3BzLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChyZW5kZXJDaGlsZHJlbiwgeyBub2Rlczogbm9kZS5jaGlsZHJlbiB8fCBbXSwgc3RhdGVIdWI6IHN0YXRlSHViIH0pLFxuICAgIClcbiAgKTtcbn1cblxudHlwZSBSZW5kZXJTY2hlbWFQYXJhbXMgPSB7XG4gIHNjaGVtYTogSW5zdGFudGlhdGVkU2NoZW1hO1xuICByb290RWxlOiBFbGVtZW50O1xuICBzdGF0ZUh1YjogU3RhdGVIdWI7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclNjaGVtYSh7IHNjaGVtYSwgcm9vdEVsZSwgc3RhdGVIdWIgfTogUmVuZGVyU2NoZW1hUGFyYW1zKTogdm9pZCB7XG4gIC8vIHJlZ2lzdGVyKCdAYmFzaWNDb21wb25lbnRzJywgZ2V0QmFzaWNDb21wb25lbnRzT3B0aW9ucygpKTtcbiAgLy8gcmVnaXN0ZXIoJ0BhZHZhbmNlc0NvbXBvbmVudHMnLCBnZXRBZHZhbmNlZENvbXBvbmVudHNPcHRpb25zKCkpO1xuXG4gIFJlYWN0RE9NLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KHJlbmRlck5vZGUsIHsgbm9kZTogc2NoZW1hLm5vZGUsIHN0YXRlSHViIH0pLCByb290RWxlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcmVuZGVyU2NoZW1hO1xuIiwiaW1wb3J0IHtcbiAgTm9kZVByb3AsXG4gIEluc3RhbnRpYXRlZFNjaGVtYSxcbiAgU2NoZW1hLFxuICBBUElTdGF0ZSxcbiAgU2NoZW1hTm9kZSxcbiAgTm9kZVByb3BzLFxuICBTZXJpYWxpemVkLFxuICBJbnN0YW50aWF0ZWQsXG4gIEFQSVN0YXRlQ29udmVydEZ1bmNTcGVjLFxuICBQYXJhbXNCdWlsZGVyRnVuY1NwZWMsXG4gIEFQSUludm9rZUNhbGxiYWNrRnVuY1NwZWMsXG59IGZyb20gJy4vdHlwZXMnO1xuXG50eXBlIEZ1bmN0aW9uU3BlY3MgPSBBUElTdGF0ZUNvbnZlcnRGdW5jU3BlYyB8IFBhcmFtc0J1aWxkZXJGdW5jU3BlYyB8IEFQSUludm9rZUNhbGxiYWNrRnVuY1NwZWM7XG5cbmZ1bmN0aW9uIGluc3RhbnRpYXRlRnVuY1NwZWMoeyB0eXBlLCBhcmdzLCBib2R5IH06IEZ1bmN0aW9uU3BlY3MpOiAoKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHR5cGUgPT09ICdhcGlfc3RhdGVfbWFwcGVyX2Z1bmNfc3BlYycpIHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdhcGlTdGF0ZScsIGJvZHkpIGFzIChhcGlTdGF0ZTogQVBJU3RhdGUpID0+IGFueTtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAncGFyYW1fYnVpbGRlcl9mdW5jX3NwZWMnKSB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihhcmdzLCBib2R5KSBhcyAoLi4uYXJnczogYW55W10pID0+IGFueTtcbiAgfVxuXG4gIGlmICh0eXBlID09PSAnYXBpX2ludm9rZV9jYWxsX2Z1bmNfc3BlYycpIHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdhcGlTdGF0ZScsIGJvZHkpIGFzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55O1xuICB9XG5cbiAgcmV0dXJuO1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Qcm9wcyhwcm9wczogTm9kZVByb3BzPFNlcmlhbGl6ZWQ+KTogTm9kZVByb3BzPEluc3RhbnRpYXRlZD4ge1xuICByZXR1cm4gT2JqZWN0LmVudHJpZXMocHJvcHMpLm1hcDxbc3RyaW5nLCBOb2RlUHJvcDxJbnN0YW50aWF0ZWQ+XSB8IG51bGw+KChbcHJvcE5hbWUsIHByb3BEZXNjXSkgPT4ge1xuICAgIC8vIGluc3RhbnRpYXRlIEFycmF5PEFQSUludm9rZVByb3BlcnR5PFQ+PlxuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BEZXNjKSkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgcHJvcE5hbWUsXG4gICAgICAgIHByb3BEZXNjLm1hcCgoeyB0eXBlLCBzdGF0ZUlELCBwYXJhbXNCdWlsZGVyLCBvblN1Y2Nlc3MsIG9uRXJyb3IgfSkgPT4ge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgc3RhdGVJRCxcbiAgICAgICAgICAgIHBhcmFtc0J1aWxkZXI6IHBhcmFtc0J1aWxkZXIgPyBpbnN0YW50aWF0ZUZ1bmNTcGVjKHBhcmFtc0J1aWxkZXIpIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb25TdWNjZXNzOiBvblN1Y2Nlc3MgPyBpbnN0YW50aWF0ZUZ1bmNTcGVjKG9uU3VjY2VzcykgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBvbkVycm9yOiBvbkVycm9yID8gaW5zdGFudGlhdGVGdW5jU3BlYyhvbkVycm9yKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9O1xuICAgICAgICB9KSxcbiAgICAgIF07XG4gICAgfVxuXG4gICAgaWYgKHByb3BEZXNjLnR5cGUgPT09ICdjb25zdGFudF9wcm9wZXJ0eScpIHtcbiAgICAgIHJldHVybiBbcHJvcE5hbWUsIHByb3BEZXNjXTtcbiAgICB9XG5cbiAgICBpZiAocHJvcERlc2MudHlwZSA9PT0gJ2FwaV9kZXJpdmVkX3Byb3BlcnR5Jykge1xuICAgICAgcmV0dXJuIFtwcm9wTmFtZSwge1xuICAgICAgICAuLi5wcm9wRGVzYyxcbiAgICAgICAgdGVtcGxhdGU6IHByb3BEZXNjLnRlbXBsYXRlID8gaW5zdGFudGlhdGVGdW5jU3BlYyhwcm9wRGVzYy50ZW1wbGF0ZSkgOiB1bmRlZmluZWQsXG4gICAgICB9XTtcbiAgICB9XG5cbiAgICBpZiAocHJvcERlc2MudHlwZSA9PT0gJ2FwaV9pbnZva2VfcHJvcGVydHknKSB7XG4gICAgICByZXR1cm4gW3Byb3BOYW1lLCB7XG4gICAgICAgIC4uLnByb3BEZXNjLFxuICAgICAgICBwYXJhbXNCdWlsZGVyOiBwcm9wRGVzYy5wYXJhbXNCdWlsZGVyID8gaW5zdGFudGlhdGVGdW5jU3BlYyhwcm9wRGVzYy5wYXJhbXNCdWlsZGVyKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgb25TdWNjZXNzOiBwcm9wRGVzYy5vblN1Y2Nlc3MgPyBpbnN0YW50aWF0ZUZ1bmNTcGVjKHByb3BEZXNjLm9uU3VjY2VzcykgOiB1bmRlZmluZWQsXG4gICAgICAgIG9uRXJyb3I6IHByb3BEZXNjLm9uRXJyb3IgPyBpbnN0YW50aWF0ZUZ1bmNTcGVjKHByb3BEZXNjLm9uRXJyb3IpIDogdW5kZWZpbmVkLFxuICAgICAgfV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0pLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgTm9kZVByb3A8SW5zdGFudGlhdGVkPl0gPT4ge1xuICAgIHJldHVybiAhIXBhaXI7XG4gIH0pLnJlZHVjZTxOb2RlUHJvcHM8SW5zdGFudGlhdGVkPj4oKGFjYywgW3Byb3BOYW1lLCBwcm9wRGVzY10pID0+IHtcbiAgICBhY2NbcHJvcE5hbWVdID0gcHJvcERlc2M7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1Ob2RlKG5vZGU6IFNjaGVtYU5vZGU8U2VyaWFsaXplZD4pOiBTY2hlbWFOb2RlPEluc3RhbnRpYXRlZD4ge1xuICBjb25zdCBjaGlsZHJlbiA9IChub2RlLmNoaWxkcmVuIHx8IFtdKS5tYXAoKG4pID0+IHRyYW5zZm9ybU5vZGUobikpO1xuXG4gIHJldHVybiB7XG4gICAgLi4ubm9kZSxcbiAgICBjaGlsZHJlbixcbiAgICBwcm9wczogdHJhbnNmb3JtUHJvcHMobm9kZS5wcm9wcyB8fCB7fSksXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlc2VyaWFsaXplU2NoZW1hKHsgbm9kZSwgc3RhdGVzTWFwIH06IFNjaGVtYSk6IEluc3RhbnRpYXRlZFNjaGVtYSB8IG51bGwge1xuICB0cnkge1xuICAgIHJldHVybiB7IHN0YXRlc01hcCwgbm9kZTogdHJhbnNmb3JtTm9kZShub2RlKSB9O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IE9wZW5BUElWMyB9IGZyb20gJ29wZW5hcGktdHlwZXMnO1xuXG5pbXBvcnQgdHlwZSB7IFJlcXVlc3RDb25maWcsIFJlcXVlc3RQYXJhbXMgfSBmcm9tICcuLi90eXBlcyc7XG5cbnR5cGUgT3BlcmF0aW9uU3BlYyA9IHtcbiAgcGF0aDogc3RyaW5nO1xuICBtZXRob2Q6IE9wZW5BUElWMy5IdHRwTWV0aG9kcztcbiAgcGFyYW1ldGVycz86IChPcGVuQVBJVjMuUmVmZXJlbmNlT2JqZWN0IHwgT3BlbkFQSVYzLlBhcmFtZXRlck9iamVjdClbXTtcbiAgcmVxdWVzdEJvZHk/OiBPcGVuQVBJVjMuUmVmZXJlbmNlT2JqZWN0IHwgT3BlbkFQSVYzLlJlcXVlc3RCb2R5T2JqZWN0O1xufVxuXG5lbnVtIEh0dHBNZXRob2RzIHtcbiAgR0VUID0gJ2dldCcsXG4gIFBVVCA9ICdwdXQnLFxuICBQT1NUID0gJ3Bvc3QnLFxuICBERUxFVEUgPSAnZGVsZXRlJyxcbiAgT1BUSU9OUyA9ICdvcHRpb25zJyxcbiAgSEVBRCA9ICdoZWFkJyxcbiAgUEFUQ0ggPSAncGF0Y2gnLFxuICBUUkFDRSA9ICd0cmFjZSdcbn1cblxuY29uc3QgTUVUSE9EUyA9IE9iamVjdC52YWx1ZXMoSHR0cE1ldGhvZHMpO1xuXG5mdW5jdGlvbiBpbmRleE9wZXJhdGlvbihhcGlEb2M6IE9wZW5BUElWMy5Eb2N1bWVudCk6IFJlY29yZDxzdHJpbmcsIE9wZXJhdGlvblNwZWMgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3Qgb3BlcmF0aW9uSURNYXA6IFJlY29yZDxzdHJpbmcsIE9wZXJhdGlvblNwZWMgfCB1bmRlZmluZWQ+ID0ge307XG4gIGZvciAoY29uc3QgW3BhdGgsIHBhdGhJdGVtT2JqZWN0XSBvZiBPYmplY3QuZW50cmllcyhhcGlEb2MucGF0aHMpKSB7XG4gICAgaWYgKCFwYXRoSXRlbU9iamVjdCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBtZXRob2Qgb2YgTUVUSE9EUykge1xuICAgICAgY29uc3Qgb3BlcmF0aW9uT2JqZWN0ID0gcGF0aEl0ZW1PYmplY3RbbWV0aG9kXTtcbiAgICAgIGlmICghb3BlcmF0aW9uT2JqZWN0KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBvcGVyYXRpb25JRE1hcFtgJHtvcGVyYXRpb25PYmplY3Qub3BlcmF0aW9uSWR9YF0gPSB7XG4gICAgICAgIHBhdGgsXG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgcGFyYW1ldGVyczogb3BlcmF0aW9uT2JqZWN0LnBhcmFtZXRlcnMsXG4gICAgICAgIHJlcXVlc3RCb2R5OiBvcGVyYXRpb25PYmplY3QucmVxdWVzdEJvZHksXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcGVyYXRpb25JRE1hcDtcbn1cblxuY2xhc3MgU3BlY0ludGVycHJldGVyIHtcbiAgZG9jQ29tcG9uZW50czogT3BlbkFQSVYzLkNvbXBvbmVudHNPYmplY3QgfCB1bmRlZmluZWQ7XG4gIG9wZXJhdGlvbk1hcDogUmVjb3JkPHN0cmluZywgT3BlcmF0aW9uU3BlYyB8IHVuZGVmaW5lZD47XG5cbiAgY29uc3RydWN0b3IoYXBpRG9jOiBPcGVuQVBJVjMuRG9jdW1lbnQpIHtcbiAgICB0aGlzLm9wZXJhdGlvbk1hcCA9IGluZGV4T3BlcmF0aW9uKGFwaURvYyk7XG4gICAgdGhpcy5kb2NDb21wb25lbnRzID0gYXBpRG9jLmNvbXBvbmVudHM7XG4gIH1cblxuICBidWlsZFJlcXVlc3Qob3BlcmF0aW9uSUQ6IHN0cmluZywgcmVxdWVzdFBhcmFtPzogUmVxdWVzdFBhcmFtcyk6IFJlcXVlc3RDb25maWcge1xuICAgIGNvbnN0IG9wZXJhdGlvblNwZWMgPSB0aGlzLm9wZXJhdGlvbk1hcFtvcGVyYXRpb25JRF07XG4gICAgaWYgKCFvcGVyYXRpb25TcGVjKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGNhbiBub3QgZmluZCBzcGVjIGZvciBvcGVyYXRpb246ICR7b3BlcmF0aW9uSUR9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBwYXRoLCBtZXRob2QsIHBhcmFtZXRlcnMgfSA9IG9wZXJhdGlvblNwZWM7XG4gICAgY29uc3QgcmVxdWVzdENvbmZpZzogUmVxdWVzdENvbmZpZyA9IHsgbWV0aG9kLCBwYXRoIH07XG5cbiAgICBwYXJhbWV0ZXJzPy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICBpZiAoJyRyZWYnIGluIHApIHtcbiAgICAgICAgLy8gVE9ETzogc3VwcG9ydCByZWZlcmVuY2Ugb2JqZWN0XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHAuaW4gPT09ICdwYXRoJykge1xuICAgICAgICBpZiAocC5yZXF1aXJlZCAmJiByZXF1ZXN0UGFyYW0/LnBhcmFtcz8uW3AubmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgcGFyYW1ldGVyICcke3AubmFtZX0nIHJlcXVpcmVkIGluIHBhdGggZm9yICR7b3BlcmF0aW9uSUR9YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0Q29uZmlnLnBhdGggPSByZXF1ZXN0Q29uZmlnLnBhdGgucmVwbGFjZShgeyR7cC5uYW1lfX1gLCByZXF1ZXN0UGFyYW0/LnBhcmFtcz8uW3AubmFtZV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAocC5pbiA9PT0gJ3F1ZXJ5Jykge1xuICAgICAgICBpZiAocC5yZXF1aXJlZCAmJiByZXF1ZXN0UGFyYW0/LnBhcmFtcz8uW3AubmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgcGFyYW1ldGVyICcke3AubmFtZX0nIHJlcXVpcmVkIGluIHF1ZXJ5IGZvciAke29wZXJhdGlvbklEfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlcXVlc3RQYXJhbT8ucGFyYW1zPy5bcC5uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVxdWVzdENvbmZpZy5xdWVyeSA9IHJlcXVlc3RDb25maWcucXVlcnkgfHwge307XG4gICAgICAgICAgcmVxdWVzdENvbmZpZy5xdWVyeVtwLm5hbWVdID0gcmVxdWVzdFBhcmFtPy5wYXJhbXM/LltwLm5hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwLmluID09PSAnaGVhZGVyJykge1xuICAgICAgICBpZiAocC5yZXF1aXJlZCAmJiByZXF1ZXN0UGFyYW0/LnBhcmFtcz8uW3AubmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgcGFyYW1ldGVyICcke3AubmFtZX0nIHJlcXVpcmVkIGluIGhlYWRlciBmb3IgJHtvcGVyYXRpb25JRH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXF1ZXN0UGFyYW0/LnBhcmFtcz8uW3AubmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlcXVlc3RDb25maWcuaGVhZGVyID0gcmVxdWVzdENvbmZpZy5oZWFkZXIgfHwge307XG4gICAgICAgICAgcmVxdWVzdENvbmZpZy5oZWFkZXJbcC5uYW1lXSA9IHJlcXVlc3RQYXJhbT8ucGFyYW1zPy5bcC5uYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVxdWVzdENvbmZpZy5ib2R5ID0gcmVxdWVzdFBhcmFtPy5ib2R5O1xuXG4gICAgcmV0dXJuIHJlcXVlc3RDb25maWc7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3BlY0ludGVycHJldGVyO1xuIiwiaW1wb3J0IHsgYWpheCwgQWpheFJlcXVlc3QgfSBmcm9tICdyeGpzL2FqYXgnO1xuaW1wb3J0IHsgb2YsIE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBzd2l0Y2hNYXAsIGNhdGNoRXJyb3IsIHNoYXJlLCBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB0eXBlIHsgUmVxdWVzdENvbmZpZyB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQgeyBBUElTdGF0ZSB9IGZyb20gJy4vdHlwZXMnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWVtcHR5LWZ1bmN0aW9uXG5jb25zdCBub29wID0gKCk6IHZvaWQgPT4ge307XG5cbmZ1bmN0aW9uIHJlcXVlc3RDb25maWdUb0FqYXhSZXF1ZXN0KGNvbmZpZzogUmVxdWVzdENvbmZpZyk6IEFqYXhSZXF1ZXN0IHtcbiAgLy8gVE9ETzogZml4IG1lXG4gIGxldCB1cmwgPSBgaHR0cDovL2xvY2FsaG9zdDo4MDgwJHtjb25maWcucGF0aH1gO1xuICBjb25zdCBxdWVyeSA9IE9iamVjdC5lbnRyaWVzKGNvbmZpZy5xdWVyeSB8fCB7fSkubWFwKChba2V5LCB2YWx1ZV0pID0+IGAke2tleX09JHt2YWx1ZX1gKS5qb2luKCcmJyk7XG4gIGlmIChxdWVyeSkge1xuICAgIHVybCA9IGAke3VybH0/JHtxdWVyeX1gO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtZXRob2Q6IGNvbmZpZy5tZXRob2QsXG4gICAgLy8gdXJsOiBjb25maWcucGF0aCxcbiAgICB1cmwsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9LFxuICAgIGFzeW5jOiB0cnVlLFxuICAgIHRpbWVvdXQ6IDEwMDAsXG4gICAgY3Jvc3NEb21haW46IGZhbHNlLFxuICAgIHdpdGhDcmVkZW50aWFsczogZmFsc2UsXG4gICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gICAgYm9keTogY29uZmlnLmJvZHksXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbmRSZXF1ZXN0KGFqYXhSZXF1ZXN0OiBBamF4UmVxdWVzdCk6IE9ic2VydmFibGU8eyBkYXRhOiB1bmtub3duOyBlcnJvcjogYW55OyB9PiB7XG4gIHJldHVybiBhamF4KGFqYXhSZXF1ZXN0KS5waXBlKFxuICAgIG1hcCgoeyByZXNwb25zZSB9KSA9PiAoeyBkYXRhOiByZXNwb25zZSwgZXJyb3I6IHVuZGVmaW5lZCB9KSksXG4gICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgIC8vIFRPRE86XG4gICAgICAvLyAtIG5lZWQgYmV0dGVyIGxvZyBtZXNzYWdlXG4gICAgICAvLyAtIHJldHVybiBhbiByZWFkYWJsZSBlcnJvciBvYmplY3RcbiAgICAgIHJldHVybiBvZih7IGVycm9yOiBlcnJvciwgZGF0YTogdW5kZWZpbmVkIH0pO1xuICAgIH0pLFxuICApO1xufVxuXG50eXBlIFJlc3BvbnNlJCA9IE9ic2VydmFibGU8eyBkYXRhPzogYW55OyBlcnJvcj86IGFueTsgfT5cblxuZXhwb3J0IGZ1bmN0aW9uIGh0dHAocmVxdWVzdCQ6IE9ic2VydmFibGU8UmVxdWVzdENvbmZpZz4pOiBSZXNwb25zZSQge1xuICBjb25zdCByZXNwb25zZSQ6IFJlc3BvbnNlJCA9IHJlcXVlc3QkLnBpcGUoXG4gICAgbWFwKHJlcXVlc3RDb25maWdUb0FqYXhSZXF1ZXN0KSxcbiAgICBzd2l0Y2hNYXAoc2VuZFJlcXVlc3QpLFxuICAgIHNoYXJlKCksXG4gICk7XG5cbiAgLy8ga2VlcCBhdCBsZWFzdCBvbmUgc3Vic2NyaWJlciB0byBlbnN1cmUgcmVzcG9uc2UkIGhvdFxuICAvLyBUT0RPOiBnaXZlIG1vcmUgZXhwbGFuYXRpb25cbiAgcmVzcG9uc2UkLnN1YnNjcmliZShub29wKTtcblxuICByZXR1cm4gcmVzcG9uc2UkO1xufVxuXG4vLyBBUEkgU3RhdGUgVGFibGVcbi8qXG4gICAgfCAgICAgfCBsb2FkaW5nIHwgICBkYXRhICAgIHwgICBlcnJvciAgIHxcbiAgICB8IC0tLSB8IDotLS0tLTogfCA6LS0tLS0tLTogfCA6LS0tLS0tLTogfFxuICAgIHwgMSAgIHwgIGZhbHNlICB8IHVuZGVmaW5lZCB8IHVuZGVmaW5lZCB8XG4gICAgfCAyICAgfCAgdHJ1ZSAgIHwgdW5kZWZpbmVkIHwgdW5kZWZpbmVkIHxcbuKUjOKUgOKUgOKWunwgMyAgIHwgIGZhbHNlICB8ICAgIHt9ICAgICB8IHVuZGVmaW5lZCB84peE4pSA4pSA4pSA4pSA4pSQXG7ilJTilIDilIDilIB8IDQgICB8ICB0cnVlICAgfCAgICB7fSAgICAgfCB1bmRlZmluZWQgfCAgICAg4pSCXG4gICAgfCA1ICAgfCAgZmFsc2UgIHwgdW5kZWZpbmVkIHwgICAgeHh4ICAgIHwgICAgIOKUglxuICAgIHwgNiAgIHwgIHRydWUgICB8IHVuZGVmaW5lZCB8ICAgIHh4eCAgICB84pSA4pSA4pSA4pSA4pSA4pSYXG4qL1xudHlwZSBTdGF0ZSA9IE9taXQ8QVBJU3RhdGUsICdwYXJhbXMnPjtcblxuZXhwb3J0IGNvbnN0IGluaXRpYWxTdGF0ZTogT21pdDxBUElTdGF0ZSwgJ3BhcmFtcyc+ID0geyBkYXRhOiB1bmRlZmluZWQsIGVycm9yOiB1bmRlZmluZWQsIGxvYWRpbmc6IGZhbHNlIH07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFJlc3BvbnNlU3RhdGUkKHJlcXVlc3QkOiBPYnNlcnZhYmxlPFJlcXVlc3RDb25maWc+KTogT2JzZXJ2YWJsZTxTdGF0ZT4ge1xuICBjb25zdCBzdGF0ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFN0YXRlPihpbml0aWFsU3RhdGUpO1xuICBjb25zdCByZXNwb25zZSQgPSBodHRwKHJlcXVlc3QkKTtcblxuICByZXNwb25zZSQucGlwZShcbiAgICBtYXAoKHJlc3ApID0+ICh7IC4uLnJlc3AsIGxvYWRpbmc6IGZhbHNlIH0pKSxcbiAgKS5zdWJzY3JpYmUoc3RhdGUkKTtcblxuICByZXF1ZXN0JC5waXBlKFxuICAgIGZpbHRlcigoKSA9PiBzdGF0ZSQuZ2V0VmFsdWUoKS5sb2FkaW5nID09PSBmYWxzZSksXG4gICAgbWFwKCgpID0+ICh7IC4uLnN0YXRlJC5nZXRWYWx1ZSgpLCBsb2FkaW5nOiB0cnVlIH0pKSxcbiAgKS5zdWJzY3JpYmUoc3RhdGUkKTtcblxuICByZXR1cm4gc3RhdGUkO1xufVxuIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNvbmNhdFdpdGgsIG1hcCwgc2tpcCwgd2l0aExhdGVzdEZyb20gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBPcGVuQVBJVjMgfSBmcm9tICdvcGVuYXBpLXR5cGVzJztcblxuaW1wb3J0IFNwZWNJbnRlcnByZXRlciBmcm9tICcuL3NwZWMtaW50ZXJwcmV0ZXInO1xuXG5pbXBvcnQgdHlwZSB7IEFQSVN0YXRlLCBTdGF0ZXNNYXAsIFJlcXVlc3RQYXJhbXMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBnZXRSZXNwb25zZVN0YXRlJCBmcm9tICcuL3Jlc3BvbnNlJztcblxudHlwZSBSdW5QYXJhbSA9IHtcbiAgcGFyYW1zPzogUmVxdWVzdFBhcmFtcztcbiAgb25TdWNjZXNzPzogKHN0YXRlOiBBUElTdGF0ZSkgPT4gdm9pZDtcbiAgb25FcnJvcj86IChzdGF0ZTogQVBJU3RhdGUpID0+IHZvaWQ7XG59XG5cbnR5cGUgU3RyZWFtQWN0aW9ucyA9IHtcbiAgcnVuOiAocnVuUGFyYW0/OiBSdW5QYXJhbSkgPT4gdm9pZDtcbiAgcmVmcmVzaDogKCkgPT4gdm9pZDtcbiAgLy8gX19jb21wbGV0ZTogKCkgPT4gdm9pZDtcbn07XG5cbmZ1bmN0aW9uIGV4ZWN1dGVDYWxsYmFjayhzdGF0ZTogQVBJU3RhdGUsIHJ1blBhcmFtcz86IFJ1blBhcmFtKTogdm9pZCB7XG4gIGlmIChzdGF0ZS5sb2FkaW5nKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHN0YXRlLmVycm9yKSB7XG4gICAgcnVuUGFyYW1zPy5vbkVycm9yPy4oc3RhdGUpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJ1blBhcmFtcz8ub25TdWNjZXNzPy4oc3RhdGUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZUh1YiB7XG4gIHNwZWNJbnRlcnByZXRlcjogU3BlY0ludGVycHJldGVyO1xuICAvLyBtYXAgb2Ygc3RhdGVJRCBhbmQgb3BlcmF0aW9uSURcbiAgc3RhdGVJRE1hcDogU3RhdGVzTWFwO1xuICBzdGF0ZXNDYWNoZTogUmVjb3JkPHN0cmluZywgW09ic2VydmFibGU8QVBJU3RhdGU+LCBTdHJlYW1BY3Rpb25zXT4gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihhcGlEb2M6IE9wZW5BUElWMy5Eb2N1bWVudCwgc3RhdGVJRE1hcDogU3RhdGVzTWFwKSB7XG4gICAgdGhpcy5zcGVjSW50ZXJwcmV0ZXIgPSBuZXcgU3BlY0ludGVycHJldGVyKGFwaURvYyk7XG4gICAgdGhpcy5zdGF0ZUlETWFwID0gc3RhdGVJRE1hcDtcbiAgfVxuXG4gIGdldFN0YXRlKHN0YXRlSUQ6IHN0cmluZyk6IE9ic2VydmFibGU8QVBJU3RhdGU+IHtcbiAgICBjb25zdCBbc3RhdGUkXSA9IHRoaXMuZ2V0U3RyZWFtKHN0YXRlSUQpO1xuXG4gICAgLy8gVE9ETzogdGVzdCBlcnJvciB3aGVuIHJ1biBjb252ZXJ0b3JcbiAgICByZXR1cm4gc3RhdGUkO1xuICB9XG5cbiAgZ2V0QWN0aW9uKHN0YXRlSUQ6IHN0cmluZyk6IChydW5QYXJhbT86IFJ1blBhcmFtKSA9PiB2b2lkIHtcbiAgICBjb25zdCBbLCB7IHJ1biB9XSA9IHRoaXMuZ2V0U3RyZWFtKHN0YXRlSUQpO1xuICAgIHJldHVybiBydW47XG4gIH1cblxuICBnZXRTdHJlYW0oc3RhdGVJRDogc3RyaW5nKTogW09ic2VydmFibGU8QVBJU3RhdGU+LCBTdHJlYW1BY3Rpb25zXSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlSURNYXBbc3RhdGVJRF0pIHtcbiAgICAgIC8vIFRPRE86IGxvZyBlcnJvciBtZXNzYWdlXG4gICAgfVxuXG4gICAgY29uc3Qga2V5ID0gYCR7c3RhdGVJRH06JHt0aGlzLnN0YXRlSURNYXBbc3RhdGVJRF19YDtcbiAgICBpZiAoIXRoaXMuc3RhdGVzQ2FjaGVba2V5XSkge1xuICAgICAgdGhpcy5zdGF0ZXNDYWNoZVtrZXldID0gdGhpcy5pbml0U3RhdGUoc3RhdGVJRCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzQ2FjaGVba2V5XTtcbiAgfVxuXG4gIHJlZnJlc2goc3RhdGVJRDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgWywgeyByZWZyZXNoIH1dID0gdGhpcy5nZXRTdHJlYW0oc3RhdGVJRCk7XG4gICAgcmVmcmVzaCgpO1xuICB9XG5cbiAgaW5pdFN0YXRlKHN0YXRlSUQ6IHN0cmluZyk6IFtPYnNlcnZhYmxlPEFQSVN0YXRlPiwgU3RyZWFtQWN0aW9uc10ge1xuICAgIGNvbnN0IHBhcmFtcyQgPSBuZXcgU3ViamVjdDxSZXF1ZXN0UGFyYW1zPigpO1xuICAgIGNvbnN0IHJlcXVlc3QkID0gcGFyYW1zJC5waXBlKFxuICAgICAgLy8gVE9ETzogY2F0Y2ggYnVpbGRlciBlcnJvclxuICAgICAgbWFwKChwYXJhbXMpID0+IHRoaXMuc3BlY0ludGVycHJldGVyLmJ1aWxkUmVxdWVzdCh0aGlzLnN0YXRlSURNYXBbc3RhdGVJRF0/Lm9wZXJhdGlvbklELCBwYXJhbXMpKSxcbiAgICApO1xuXG4gICAgY29uc3QgZnVsbFN0YXRlJCA9IGdldFJlc3BvbnNlU3RhdGUkKHJlcXVlc3QkKS5waXBlKFxuICAgICAgLy8gVE9ETzogcmVmaW5lIHRoaXNcbiAgICAgIHdpdGhMYXRlc3RGcm9tKG9mKHVuZGVmaW5lZCkucGlwZShjb25jYXRXaXRoKHBhcmFtcyQpKSksXG4gICAgICBtYXAoKFtzdGF0ZSwgcGFyYW1zXSkgPT4gKHsgLi4uc3RhdGUsIHBhcmFtcyB9KSksXG4gICAgKTtcblxuICAgIC8vIHJ1biBjYWxsYmFja3MgYWZ0ZXIgdmFsdWUgcmVzb2x2ZWRcbiAgICBmdWxsU3RhdGUkLnBpcGUoc2tpcCgxKSkuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGV4ZWN1dGVDYWxsYmFjayhzdGF0ZSwgX2xhdGVzdFJ1blBhcmFtcyk7XG4gICAgICB9LCAxMCk7XG4gICAgfSk7XG5cbiAgICBsZXQgX2xhdGVzdFJ1blBhcmFtczogUnVuUGFyYW0gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBzdHJlYW1BY3Rpb25zOiBTdHJlYW1BY3Rpb25zID0ge1xuICAgICAgcnVuOiAocnVuUGFyYW0/OiBSdW5QYXJhbSkgPT4ge1xuICAgICAgICBfbGF0ZXN0UnVuUGFyYW1zID0gcnVuUGFyYW07XG4gICAgICAgIHBhcmFtcyQubmV4dChydW5QYXJhbT8ucGFyYW1zKTtcbiAgICAgIH0sXG4gICAgICByZWZyZXNoOiAoKSA9PiB7XG4gICAgICAgIC8vIG92ZXJyaWRlIG9uU3VjY2VzcyBhbmQgb25FcnJvciB0byB1bmRlZmluZWRcbiAgICAgICAgX2xhdGVzdFJ1blBhcmFtcyA9IHsgcGFyYW1zOiBfbGF0ZXN0UnVuUGFyYW1zPy5wYXJhbXMgfTtcbiAgICAgICAgcGFyYW1zJC5uZXh0KF9sYXRlc3RSdW5QYXJhbXM/LnBhcmFtcyk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gW2Z1bGxTdGF0ZSQsIHN0cmVhbUFjdGlvbnNdO1xuICB9XG59XG4iLCJpbXBvcnQgeyBPcGVuQVBJVjMgfSBmcm9tICdvcGVuYXBpLXR5cGVzJztcbmltcG9ydCByZW5kZXJTY2hlbWEgZnJvbSAnLi9zcmMvcmVuZGVyJztcbmltcG9ydCBkZXNlcmlhbGl6ZVNjaGVtYSBmcm9tICcuL3NyYy9kZXNlcmlhbGl6ZS1zY2hlbWEnO1xuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi9zcmMvdHlwZXMnO1xuaW1wb3J0IFN0YXRlSHViIGZyb20gJy4vc3JjL3N0YXRlLWh1Yic7XG5cbnR5cGUgUmVuZGVyU2NoZW1hUGFyYW1zID0ge1xuICBzY2hlbWE6IFNjaGVtYTtcbiAgcm9vdEVsZTogRWxlbWVudDtcbiAgYXBpRG9jOiBPcGVuQVBJVjMuRG9jdW1lbnQ7XG59XG5cbmZ1bmN0aW9uIFJlbmRlcih7IHNjaGVtYSwgcm9vdEVsZSwgYXBpRG9jIH06IFJlbmRlclNjaGVtYVBhcmFtcyk6IHZvaWQge1xuICBjb25zdCBpbnN0YW50aWF0ZWRTY2hlbWEgPSBkZXNlcmlhbGl6ZVNjaGVtYShzY2hlbWEpO1xuICBpZiAoIWluc3RhbnRpYXRlZFNjaGVtYSkge1xuICAgIC8vIFRPRE86IHBhaW50IGVycm9yXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3RhdGVIdWIgPSBuZXcgU3RhdGVIdWIoYXBpRG9jLCBpbnN0YW50aWF0ZWRTY2hlbWEuc3RhdGVzTWFwKTtcbiAgLy8gVE9ETzogZ2l2ZSB0aGlzIGEgYmV0dGVyIGRlc2lnblxuICAvLyBlYWNoIHJlbmRlci1lbmdpbmUgaW5zdGFuY2Ugc2hvdWxkIGhhdmUgYSB1bmlxIGtleSxcbiAgLy8gdGhpcyBrZXkgY291bGQgYmUgdXNlZCBieSBzdGF0ZUh1YixcbiAgLy8gb3IgY3JlYXRlIGEgc3ltYm9sIGZvciBlYWNoIHN0YXRlSHViP1xuICB3aW5kb3cuc3RhdGVIdWIgPSBzdGF0ZUh1YjtcblxuICByZW5kZXJTY2hlbWEoeyBzY2hlbWE6IGluc3RhbnRpYXRlZFNjaGVtYSwgc3RhdGVIdWIsIHJvb3RFbGUgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlbmRlcjtcbiJdLCJuYW1lcyI6WyJfX2RlZlByb3AiLCJfX2RlZlByb3BzIiwiX19nZXRPd25Qcm9wRGVzY3MiLCJfX2dldE93blByb3BTeW1ib2xzIiwiX19oYXNPd25Qcm9wIiwiX19wcm9wSXNFbnVtIiwiX19kZWZOb3JtYWxQcm9wIiwiX19zcHJlYWRWYWx1ZXMiLCJfX3NwcmVhZFByb3BzIiwibWFwIiwic2tpcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BT08sU0FBUyxlQUFlLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUU7TUFDbEUsRUFBRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxLQUFLO01BQzNELElBQUksT0FBTyxZQUFZLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxDQUFDO01BQ2pELEdBQUcsQ0FBQyxDQUFDO01BQ0w7O01DVEEsU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtNQUMzQyxFQUFFLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsS0FBSztNQUMvRCxJQUFJLElBQUksRUFBRSxDQUFDO01BQ1gsSUFBSSxPQUFPO01BQ1gsTUFBTSxRQUFRO01BQ2QsTUFBTSxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsR0FBRyxTQUFTO01BQ3RILEtBQUssQ0FBQztNQUNOLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsS0FBSztNQUN4QyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDMUIsSUFBSSxPQUFPLEdBQUcsQ0FBQztNQUNmLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztNQUNULENBQUM7TUFDYyxTQUFTLHVCQUF1QixDQUFD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
