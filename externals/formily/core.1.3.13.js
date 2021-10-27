System.register(['@formily/validator', '@formily/shared'], (function (exports) {
  'use strict';
  var _starExcludes = {
    FormGraph: 1,
    FormHeart: 1,
    FormLifeCycle: 1,
    LifeCycleTypes: 1,
    createForm: 1,
    createModel: 1,
    'default': 1,
    isField: 1,
    isFieldState: 1,
    isFormState: 1,
    isStateModel: 1,
    isVirtualField: 1,
    isVirtualFieldState: 1,
    registerValidationFormats: 1,
    registerValidationMTEngine: 1,
    registerValidationRules: 1,
    setValidationLanguage: 1,
    setValidationLocale: 1,
    BigData: 1,
    FormPath: 1,
    FormPathPattern: 1
  };
  var FormValidator, Subscribable, FormPath, isFn, reduce, each, map, isStr, isObj, isArr, isEqual, defaults, shallowClone, isValid, toArr, clone, isPlainObj, isEmpty, log, isNum;
  return {
    setters: [function (module) {
      FormValidator = module.FormValidator;
      var setter = { setValidationLanguage: module.setValidationLanguage, setValidationLocale: module.setValidationLocale };
      for (var name in module) {
        if (!_starExcludes[name]) setter[name] = module[name];
      }
      exports(setter);
    }, function (module) {
      Subscribable = module.Subscribable;
      FormPath = module.FormPath;
      isFn = module.isFn;
      reduce = module.reduce;
      each = module.each;
      map = module.map;
      isStr = module.isStr;
      isObj = module.isObj;
      isArr = module.isArr;
      isEqual = module.isEqual;
      defaults = module.defaults;
      shallowClone = module.shallowClone;
      isValid = module.isValid;
      toArr = module.toArr;
      clone = module.clone;
      isPlainObj = module.isPlainObj;
      isEmpty = module.isEmpty;
      log = module.log;
      isNum = module.isNum;
      exports({ BigData: module.BigData, FormPath: module.FormPath, FormPathPattern: module.FormPathPattern });
    }],
    execute: (function () {

      class FormGraph extends Subscribable {
        constructor(props = {}) {
          super();
          this.refrences = {};
          this.nodes = {};
          this.size = 0;
          this.buffer = [];
          this.matchStrategy = props.matchStrategy;
        }
        select(path, eacher) {
          const pattern = FormPath.parse(path);
          if (!eacher) {
            const node = this.get(pattern);
            if (node) {
              return node;
            }
          }
          for (let nodePath in this.nodes) {
            const node = this.nodes[nodePath];
            if (isFn(this.matchStrategy) ? this.matchStrategy(pattern, nodePath) : pattern.match(nodePath)) {
              if (isFn(eacher)) {
                const result = eacher(node, FormPath.parse(nodePath));
                if (result === false) {
                  return node;
                }
              } else {
                return node;
              }
            }
          }
        }
        get(path) {
          return this.nodes[FormPath.parse(path).toString()];
        }
        selectParent(path) {
          const selfPath = FormPath.parse(path);
          const parentPath = FormPath.parse(path).parent();
          if (selfPath.toString() === parentPath.toString())
            return void 0;
          return this.get(parentPath);
        }
        selectChildren(path) {
          const ref = this.refrences[FormPath.parse(path).toString()];
          if (ref && ref.children) {
            return reduce(ref.children, (buf, path2) => {
              return buf.concat(this.get(path2)).concat(this.selectChildren(path2));
            }, []);
          }
          return [];
        }
        exist(path) {
          return !!this.get(FormPath.parse(path));
        }
        eachChildren(path, selector = true, eacher = true, recursion = true) {
          if (isFn(path)) {
            recursion = selector;
            eacher = path;
            path = "";
            selector = "*";
          }
          if (isFn(selector)) {
            recursion = eacher;
            eacher = selector;
            selector = "*";
          }
          const ref = this.refrences[FormPath.parse(path).toString()];
          if (ref && ref.children) {
            return each(ref.children, (path2) => {
              if (isFn(eacher)) {
                const node = this.get(path2);
                if (node && (isFn(this.matchStrategy) ? this.matchStrategy(selector, path2) : FormPath.parse(selector).match(path2))) {
                  eacher(node, path2);
                }
                if (recursion) {
                  this.eachChildren(path2, selector, eacher, recursion);
                }
              }
            });
          }
        }
        eachParent(path, eacher) {
          const selfPath = FormPath.parse(path);
          const ref = this.refrences[selfPath.toString()];
          if (isFn(eacher)) {
            if (ref && ref.parent) {
              const node = this.get(ref.parent.path);
              this.eachParent(ref.parent.path, eacher);
              eacher(node, ref.parent.path);
            }
          }
        }
        eachParentAndChildren(path, eacher) {
          const selfPath = FormPath.parse(path);
          const node = this.get(selfPath);
          if (!node)
            return;
          this.eachParent(selfPath, eacher);
          if (isFn(eacher)) {
            eacher(node, selfPath);
            this.eachChildren(selfPath, eacher);
          }
        }
        getLatestParent(path) {
          const selfPath = FormPath.parse(path);
          const parentPath = FormPath.parse(path).parent();
          if (selfPath.toString() === parentPath.toString())
            return void 0;
          if (this.refrences[parentPath.toString()])
            return {
              ref: this.refrences[parentPath.toString()],
              path: FormPath.parse(parentPath.toString())
            };
          return this.getLatestParent(parentPath);
        }
        map(mapper) {
          return map(this.nodes, mapper);
        }
        reduce(reducer, initial) {
          return reduce(this.nodes, reducer, initial);
        }
        appendNode(node, path = "", dataPath = "") {
          const selfPath = FormPath.parse(path);
          const selfDataPath = FormPath.parse(dataPath || path);
          const parentPath = selfPath.parent();
          const dataParentPath = selfDataPath.parent();
          const parentRef = this.refrences[parentPath.toString()];
          const dataParentRef = this.refrences[dataParentPath.toString()];
          const selfRef = {
            path: selfPath,
            dataPath: selfDataPath,
            children: []
          };
          if (this.get(selfPath))
            return;
          this.nodes[selfPath.toString()] = node;
          this.refrences[selfPath.toString()] = selfRef;
          this.refrences[selfDataPath.toString()] = selfRef;
          this.size++;
          if (parentRef) {
            parentRef.children.push(selfPath);
            selfRef.parent = parentRef;
          } else if (dataParentRef) {
            dataParentRef.children.push(selfDataPath);
            selfRef.parent = dataParentRef;
          } else {
            const latestParent = this.getLatestParent(selfPath);
            const latestDataParent = this.getLatestParent(selfDataPath);
            if (latestParent) {
              latestParent.ref.children.push(selfPath);
              selfRef.parent = latestParent.ref;
              this.buffer.push({
                path: selfPath,
                ref: selfRef,
                latestParent
              });
            } else if (latestDataParent) {
              latestDataParent.ref.children.push(selfPath);
              selfRef.parent = latestDataParent.ref;
              this.buffer.push({
                path: selfPath,
                ref: selfRef,
                latestParent: latestDataParent
              });
            }
          }
          this.buffer.forEach(({ path: path2, ref, latestParent }, index) => {
            if (path2.parent().match(selfPath) || selfPath.includes(latestParent.path) && path2.includes(selfPath) && selfPath.toString() !== path2.toString()) {
              selfRef.children.push(path2);
              ref.parent = selfRef;
              latestParent.ref.children.splice(latestParent.ref.children.indexOf(path2), 1);
              this.buffer.splice(index, 1);
            }
          });
          this.notify({
            type: "GRAPH_NODE_DID_MOUNT",
            payload: selfRef
          });
        }
        remove(path) {
          const selfPath = FormPath.parse(path);
          const selfRef = this.refrences[selfPath.toString()];
          if (!selfRef)
            return;
          this.notify({
            type: "GRAPH_NODE_WILL_UNMOUNT",
            payload: selfRef
          });
          if (selfRef.children) {
            selfRef.children.forEach((path2) => {
              this.remove(path2);
            });
          }
          this.buffer = this.buffer.filter(({ ref }) => {
            return selfRef !== ref;
          });
          delete this.nodes[selfPath.toString()];
          delete this.refrences[selfPath.toString()];
          delete this.refrences[selfRef.dataPath.toString()];
          this.size--;
          if (selfRef.parent) {
            selfRef.parent.children.forEach((path2, index) => {
              if (path2.match(selfPath)) {
                selfRef.parent.children.splice(index, 0);
              }
            });
          }
        }
        replace(path, node) {
          const selfPath = FormPath.parse(path);
          const selfRef = this.refrences[selfPath.toString()];
          if (!selfRef)
            return;
          this.notify({
            type: "GRAPH_NODE_WILL_UNMOUNT",
            payload: selfRef
          });
          this.nodes[selfPath.toString()] = node;
          this.notify({
            type: "GRAPH_NODE_DID_MOUNT",
            payload: selfRef
          });
        }
      } exports('FormGraph', FormGraph);

      class FormLifeCycle {
        constructor(...params) {
          this.notify = (type, payload, ctx) => {
            if (isStr(type)) {
              this.listener.call(ctx, { type, payload }, ctx);
            }
          };
          this.listener = this.buildListener(params);
        }
        buildListener(params) {
          return function(payload, ctx) {
            for (let index = 0; index < params.length; index++) {
              let item = params[index];
              if (isFn(item)) {
                item.call(this, payload, ctx);
              } else if (isStr(item) && isFn(params[index + 1])) {
                if (item === payload.type) {
                  params[index + 1].call(this, payload.payload, ctx);
                }
                index++;
              } else if (isObj(item)) {
                each(item, (handler, type) => {
                  if (isFn(handler) && isStr(type)) {
                    if (type === payload.type) {
                      handler.call(this, payload.payload, ctx);
                      return false;
                    }
                  }
                });
              }
            }
          };
        }
      } exports('FormLifeCycle', FormLifeCycle);
      class FormHeart extends Subscribable {
        constructor({
          lifecycles,
          context,
          beforeNotify,
          afterNotify
        } = {}) {
          super();
          this.batch = (callback) => {
            if (isFn(callback)) {
              this.batching = true;
              this.buffer = [];
              callback();
              this.batching = false;
              this.buffer.forEach(({ type, payload, context }) => {
                this.publish(type, payload, context);
              });
              this.buffer = [];
            }
          };
          this.publish = (type, payload, context) => {
            if (this.batching) {
              this.buffer.push({
                type,
                payload,
                context
              });
              return;
            }
            if (isStr(type)) {
              if (isFn(this.beforeNotify)) {
                this.beforeNotify(type, payload, context);
              }
              this.lifecycles.forEach((lifecycle) => {
                lifecycle.notify(type, payload, context || this.context);
              });
              this.notify({
                type,
                payload
              });
              if (isFn(this.afterNotify)) {
                this.afterNotify(type, payload, context);
              }
            }
          };
          this.lifecycles = this.buildLifeCycles(lifecycles || []);
          this.context = context;
          this.buffer = [];
          this.beforeNotify = beforeNotify;
          this.afterNotify = afterNotify;
        }
        buildLifeCycles(lifecycles) {
          return lifecycles.reduce((buf, item) => {
            if (item instanceof FormLifeCycle) {
              return buf.concat(item);
            } else {
              if (typeof item === "object") {
                this.context = item;
                return buf;
              } else if (isArr(item)) {
                return this.buildLifeCycles(item);
              }
              return buf;
            }
          }, []);
        }
      } exports('FormHeart', FormHeart);

      var dist = {exports: {}};

      var immer_cjs_production_min = {};

      function t(t){for(var n=arguments.length,r=Array(n>1?n-1:0),e=1;e<n;e++)r[e-1]=arguments[e];throw Error("[Immer] minified error nr: "+t+(r.length?" "+r.join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function n(t){return !!t&&!!t[q]}function r(t){return !!t&&(function(t){if(!t||"object"!=typeof t)return !1;var n=Object.getPrototypeOf(t);return !n||n===Object.prototype}(t)||Array.isArray(t)||!!t[X]||!!t.constructor[X]||a(t)||c(t))}function e(t,n,r){void 0===r&&(r=!1),0===i(t)?(r?Object.keys:G)(t).forEach((function(r){return n(r,t[r],t)})):t.forEach((function(r,e){return n(e,r,t)}));}function i(t){var n=t[q];return n?n.t>3?n.t-4:n.t:Array.isArray(t)?1:a(t)?2:c(t)?3:0}function u(t,n){return 2===i(t)?t.has(n):Object.prototype.hasOwnProperty.call(t,n)}function o(t,n){return 2===i(t)?t.get(n):t[n]}function f(t,n){return t===n?0!==t||1/t==1/n:t!=t&&n!=n}function a(t){return $&&t instanceof Map}function c(t){return C&&t instanceof Set}function s(t){return t.i||t.u}function v(n,r){if(void 0===r&&(r=!1),Array.isArray(n))return n.slice();var i=Object.create(Object.getPrototypeOf(n));return e(n,(function(e){if(e!==q){var u=Object.getOwnPropertyDescriptor(n,e),o=u.value;u.get&&(r||t(1),o=u.get.call(n)),u.enumerable?i[e]=o:Object.defineProperty(i,e,{value:o,writable:!0,configurable:!0});}})),i}function p(t,u){n(t)||l(t)||!r(t)||(i(t)>1&&(t.set=t.add=t.clear=t.delete=h),Object.freeze(t),u&&e(t,(function(t,n){return p(n,!0)}),!0));}function h(){t(2);}function l(t){return null==t||"object"!=typeof t||Object.isFrozen(t)}function d(n){var r=H[n];return r||t(19,n),r}function _(t,n){H[t]=n;}function y(){return K}function b(t,n){n&&(d("Patches"),t.o=[],t.s=[],t.v=n);}function m(t){j(t),t.p.forEach(x),t.p=null;}function j(t){t===K&&(K=t.h);}function O(t){return K={p:[],h:K,l:t,_:!0,m:0}}function x(t){var n=t[q];0===n.t||1===n.t?n.j():n.O=!0;}function S(n,e){e.m=e.p.length;var i=e.p[0],u=void 0!==n&&n!==i;return e.l.S||d("ES5").P(e,n,u),u?(i[q].M&&(m(e),t(4)),r(n)&&(n=w(e,n),e.h||M(e,n)),e.o&&d("Patches").g(i[q],n,e.o,e.s)):n=w(e,i,[]),m(e),e.o&&e.v(e.o,e.s),n!==W?n:void 0}function w(t,n,r){if(l(n))return n;var i=n[q];if(!i)return e(n,(function(e,u){return P(t,i,n,e,u,r)}),!0),n;if(i.A!==t)return n;if(!i.M)return M(t,i.u,!0),i.u;if(!i.R){i.R=!0,i.A.m--;var u=4===i.t||5===i.t?i.i=v(i.k,!0):i.i;e(u,(function(n,e){return P(t,i,u,n,e,r)})),M(t,u,!1),r&&t.o&&d("Patches").F(i,r,t.o,t.s);}return i.i}function P(t,e,a,c,s,v){if(n(s)){var p=w(t,s,v&&e&&3!==e.t&&!u(e.D,c)?v.concat(c):void 0);if(l=c,d=p,2===(_=i(h=a))?h.set(l,d):3===_?(h.delete(l),h.add(d)):h[l]=d,!n(p))return;t._=!1;}var h,l,d,_;if((!e||!f(s,o(e.u,c)))&&r(s)){if(!t.l.J&&t.m<1)return;w(t,s),e&&e.A.h||M(t,s);}}function M(t,n,r){void 0===r&&(r=!1),t.l.J&&t._&&p(n,r);}function g(t,n){var r=t[q],e=Reflect.getOwnPropertyDescriptor(r?s(r):t,n);return e&&e.value}function A(t){if(!t.M){if(t.M=!0,0===t.t||1===t.t){var n=t.i=v(t.u);e(t.p,(function(t,r){n[t]=r;})),t.p=void 0;}t.h&&A(t.h);}}function z(t){t.i||(t.i=v(t.u));}function E(t,n,r){var e=a(n)?d("MapSet").K(n,r):c(n)?d("MapSet").N(n,r):t.S?function(t,n){var r=Array.isArray(t),e={t:r?1:0,A:n?n.A:y(),M:!1,R:!1,D:{},h:n,u:t,k:null,p:{},i:null,j:null,$:!1},i=e,u=L;r&&(i=[e],u=Q);var o=Proxy.revocable(i,u),f=o.revoke,a=o.proxy;return e.k=a,e.j=f,a}(n,r):d("ES5").C(n,r);return (r?r.A:y()).p.push(e),e}function R(t,n){t.S?A(n):d("ES5").I(n);}function k(){function i(t,n){var r=t[q];if(r&&!r.W){r.W=!0;var e=t[n];return r.W=!1,e}return t[n]}function o(t){t.M||(t.M=!0,t.h&&o(t.h));}function a(t){t.i||(t.i=c(t.u));}function c(t){var n=t&&t[q];if(n){n.W=!0;var r=v(n.k,!0);return n.W=!1,r}return v(t)}function p(t){for(var n=t.length-1;n>=0;n--){var r=t[n][q];if(!r.M)switch(r.t){case 5:l(r)&&o(r);break;case 4:h(r)&&o(r);}}}function h(t){for(var n=t.u,r=t.k,e=Object.keys(r),i=e.length-1;i>=0;i--){var o=e[i],a=n[o];if(void 0===a&&!u(n,o))return !0;var c=r[o],s=c&&c[q];if(s?s.u!==a:!f(c,a))return !0}return e.length!==Object.keys(n).length}function l(t){var n=t.k;if(n.length!==t.u.length)return !0;var r=Object.getOwnPropertyDescriptor(n,n.length-1);return !(!r||r.get)}function d(n){n.O&&t(3,JSON.stringify(s(n)));}var b={};_("ES5",{C:function(t,n){var u=Array.isArray(t),v=c(t);e(v,(function(n){!function(t,n,e){var u=b[n];u?u.enumerable=e:b[n]=u={enumerable:e,get:function(){return function(t,n){d(t);var e=i(s(t),n);return t.W?e:e===i(t.u,n)&&r(e)?(a(t),t.i[n]=E(t.A.l,e,t)):e}(this[q],n)},set:function(t){!function(t,n,r){if(d(t),t.D[n]=!0,!t.M){if(f(r,i(s(t),n)))return;o(t),a(t);}t.i[n]=r;}(this[q],n,t);}},Object.defineProperty(t,n,u);}(v,n,u||function(t,n){var r=Object.getOwnPropertyDescriptor(t,n);return !(!r||!r.enumerable)}(t,n));}));var p={t:u?5:4,A:n?n.A:y(),M:!1,W:!1,R:!1,D:{},h:n,u:t,k:v,i:null,O:!1,$:!1};return Object.defineProperty(v,q,{value:p,writable:!0}),v},I:o,P:function(t,r,i){t.p.forEach((function(t){t[q].W=!0;})),i?n(r)&&r[q].A===t&&p(t.p):(t.o&&function t(n){if(n&&"object"==typeof n){var r=n[q];if(r){var i=r.u,f=r.k,a=r.D,c=r.t;if(4===c)e(f,(function(n){n!==q&&(void 0!==i[n]||u(i,n)?a[n]||t(f[n]):(a[n]=!0,o(r)));})),e(i,(function(t){void 0!==f[t]||u(f,t)||(a[t]=!1,o(r));}));else if(5===c){if(l(r)&&(o(r),a.length=!0),f.length<i.length)for(var s=f.length;s<i.length;s++)a[s]=!1;else for(var v=i.length;v<f.length;v++)a[v]=!0;for(var p=Math.min(f.length,i.length),h=0;h<p;h++)void 0===a[h]&&t(f[h]);}}}}(t.p[0]),p(t.p));}});}function F(){function r(t){if(!t||"object"!=typeof t)return t;if(Array.isArray(t))return t.map(r);if(a(t))return new Map(Array.from(t.entries()).map((function(t){return [t[0],r(t[1])]})));if(c(t))return new Set(Array.from(t).map(r));var n=Object.create(Object.getPrototypeOf(t));for(var e in t)n[e]=r(t[e]);return n}function f(t){return n(t)?r(t):t}var s="add";_("Patches",{X:function(n,e){return e.forEach((function(e){for(var u=e.path,f=e.op,a=n,c=0;c<u.length-1;c++)"object"!=typeof(a=o(a,u[c]))&&t(15,u.join("/"));var v=i(a),p=r(e.value),h=u[u.length-1];switch(f){case"replace":switch(v){case 2:return a.set(h,p);case 3:t(16);default:return a[h]=p}case s:switch(v){case 1:return a.splice(h,0,p);case 2:return a.set(h,p);case 3:return a.add(p);default:return a[h]=p}case"remove":switch(v){case 1:return a.splice(h,1);case 2:return a.delete(h);case 3:return a.delete(e.value);default:return delete a[h]}default:t(17,f);}})),n},F:function(t,n,r,i){switch(t.t){case 0:case 4:case 2:return function(t,n,r,i){var a=t.u,c=t.i;e(t.D,(function(t,e){var v=o(a,t),p=o(c,t),h=e?u(a,t)?"replace":s:"remove";if(v!==p||"replace"!==h){var l=n.concat(t);r.push("remove"===h?{op:h,path:l}:{op:h,path:l,value:p}),i.push(h===s?{op:"remove",path:l}:"remove"===h?{op:s,path:l,value:f(v)}:{op:"replace",path:l,value:f(v)});}}));}(t,n,r,i);case 5:case 1:return function(t,n,r,e){var i=t.u,u=t.D,o=t.i;if(o.length<i.length){var a=[o,i];i=a[0],o=a[1];var c=[e,r];r=c[0],e=c[1];}for(var v=o.length-i.length,p=0;i[p]===o[p]&&p<i.length;)++p;for(var h=i.length;h>p&&i[h-1]===o[h+v-1];)--h;for(var l=p;l<h;++l)if(u[l]&&o[l]!==i[l]){var d=n.concat([l]);r.push({op:"replace",path:d,value:f(o[l])}),e.push({op:"replace",path:d,value:f(i[l])});}for(var _=r.length,y=h+v-1;y>=h;--y){var b=n.concat([y]);r[_+y-h]={op:s,path:b,value:f(o[y])},e.push({op:"remove",path:b});}}(t,n,r,i);case 3:return function(t,n,r,e){var i=t.u,u=t.i,o=0;i.forEach((function(t){if(!u.has(t)){var i=n.concat([o]);r.push({op:"remove",path:i,value:t}),e.unshift({op:s,path:i,value:t});}o++;})),o=0,u.forEach((function(t){if(!i.has(t)){var u=n.concat([o]);r.push({op:s,path:u,value:t}),e.unshift({op:"remove",path:u,value:t});}o++;}));}(t,n,r,i)}},g:function(t,n,r,e){r.push({op:"replace",path:[],value:n}),e.push({op:"replace",path:[],value:t.u});}});}function D(){function n(t,n){function r(){this.constructor=t;}o(t,n),t.prototype=(r.prototype=n.prototype,new r);}function e(t){t.i||(t.D=new Map,t.i=new Map(t.u));}function i(t){t.i||(t.i=new Set,t.u.forEach((function(n){if(r(n)){var e=E(t.A.l,n,t);t.p.set(n,e),t.i.add(e);}else t.i.add(n);})));}function u(n){n.O&&t(3,JSON.stringify(s(n)));}var o=function(t,n){return (o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var r in n)n.hasOwnProperty(r)&&(t[r]=n[r]);})(t,n)},f=function(){function t(t,n){return this[q]={t:2,h:n,A:n?n.A:y(),M:!1,R:!1,i:void 0,D:void 0,u:t,k:this,$:!1,O:!1},this}n(t,Map);var i=t.prototype;return Object.defineProperty(i,"size",{get:function(){return s(this[q]).size}}),i.has=function(t){return s(this[q]).has(t)},i.set=function(t,n){var r=this[q];return u(r),s(r).get(t)!==n&&(e(r),R(r.A.l,r),r.D.set(t,!0),r.i.set(t,n),r.D.set(t,!0)),this},i.delete=function(t){if(!this.has(t))return !1;var n=this[q];return u(n),e(n),R(n.A.l,n),n.D.set(t,!1),n.i.delete(t),!0},i.clear=function(){var t=this[q];return u(t),e(t),R(t.A.l,t),t.D=new Map,t.i.clear()},i.forEach=function(t,n){var r=this;s(this[q]).forEach((function(e,i){t.call(n,r.get(i),i,r);}));},i.get=function(t){var n=this[q];u(n);var i=s(n).get(t);if(n.R||!r(i))return i;if(i!==n.u.get(t))return i;var o=E(n.A.l,i,n);return e(n),n.i.set(t,o),o},i.keys=function(){return s(this[q]).keys()},i.values=function(){var t,n=this,r=this.keys();return (t={})[B]=function(){return n.values()},t.next=function(){var t=r.next();return t.done?t:{done:!1,value:n.get(t.value)}},t},i.entries=function(){var t,n=this,r=this.keys();return (t={})[B]=function(){return n.entries()},t.next=function(){var t=r.next();if(t.done)return t;var e=n.get(t.value);return {done:!1,value:[t.value,e]}},t},i[B]=function(){return this.entries()},t}(),a=function(){function t(t,n){return this[q]={t:3,h:n,A:n?n.A:y(),M:!1,R:!1,i:void 0,u:t,k:this,p:new Map,O:!1,$:!1},this}n(t,Set);var r=t.prototype;return Object.defineProperty(r,"size",{get:function(){return s(this[q]).size}}),r.has=function(t){var n=this[q];return u(n),n.i?!!n.i.has(t)||!(!n.p.has(t)||!n.i.has(n.p.get(t))):n.u.has(t)},r.add=function(t){var n=this[q];return u(n),this.has(t)||(i(n),R(n.A.l,n),n.i.add(t)),this},r.delete=function(t){if(!this.has(t))return !1;var n=this[q];return u(n),i(n),R(n.A.l,n),n.i.delete(t)||!!n.p.has(t)&&n.i.delete(n.p.get(t))},r.clear=function(){var t=this[q];return u(t),i(t),R(t.A.l,t),t.i.clear()},r.values=function(){var t=this[q];return u(t),i(t),t.i.values()},r.entries=function(){var t=this[q];return u(t),i(t),t.i.entries()},r.keys=function(){return this.values()},r[B]=function(){return this.values()},r.forEach=function(t,n){for(var r=this.values(),e=r.next();!e.done;)t.call(n,e.value,e.value,this),e=r.next();},t}();_("MapSet",{K:function(t,n){return new f(t,n)},N:function(t,n){return new a(t,n)}});}var J;Object.defineProperty(immer_cjs_production_min,"__esModule",{value:!0});var K,N="undefined"!=typeof Symbol&&"symbol"==typeof Symbol("x"),$="undefined"!=typeof Map,C="undefined"!=typeof Set,I="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,W=N?Symbol("immer-nothing"):((J={})["immer-nothing"]=!0,J),X=N?Symbol("immer-draftable"):"__$immer_draftable",q=N?Symbol("immer-state"):"__$immer_state",B="undefined"!=typeof Symbol&&Symbol.iterator||"@@iterator",G="undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:Object.getOwnPropertyNames,H={},L={get:function(t,n){if(n===q)return t;var e=t.p;if(!t.M&&u(e,n))return e[n];var i=s(t)[n];if(t.R||!r(i))return i;if(t.M){if(i!==g(t.u,n))return i;e=t.i;}return e[n]=E(t.A.l,i,t)},has:function(t,n){return n in s(t)},ownKeys:function(t){return Reflect.ownKeys(s(t))},set:function(t,n,r){if(!t.M){var e=g(t.u,n);if(r?f(e,r)||r===t.p[n]:f(e,r)&&n in t.u)return !0;z(t),A(t);}return t.D[n]=!0,t.i[n]=r,!0},deleteProperty:function(t,n){return void 0!==g(t.u,n)||n in t.u?(t.D[n]=!1,z(t),A(t)):t.D[n]&&delete t.D[n],t.i&&delete t.i[n],!0},getOwnPropertyDescriptor:function(t,n){var r=s(t),e=Reflect.getOwnPropertyDescriptor(r,n);return e&&(e.writable=!0,e.configurable=1!==t.t||"length"!==n),e},defineProperty:function(){t(11);},getPrototypeOf:function(t){return Object.getPrototypeOf(t.u)},setPrototypeOf:function(){t(12);}},Q={};e(L,(function(t,n){Q[t]=function(){return arguments[0]=arguments[0][0],n.apply(this,arguments)};})),Q.deleteProperty=function(t,n){return L.deleteProperty.call(this,t[0],n)},Q.set=function(t,n,r){return L.set.call(this,t[0],n,r,t[0])};var T=function(){function e(t){this.S=I,this.J=!1,"boolean"==typeof(null==t?void 0:t.useProxies)&&this.setUseProxies(t.useProxies),"boolean"==typeof(null==t?void 0:t.autoFreeze)&&this.setAutoFreeze(t.autoFreeze),this.produce=this.produce.bind(this),this.produceWithPatches=this.produceWithPatches.bind(this);}var i=e.prototype;return i.produce=function(n,e,i){if("function"==typeof n&&"function"!=typeof e){var u=e;e=n;var o=this;return function(t){var n=this;void 0===t&&(t=u);for(var r=arguments.length,i=Array(r>1?r-1:0),f=1;f<r;f++)i[f-1]=arguments[f];return o.produce(t,(function(t){var r;return (r=e).call.apply(r,[n,t].concat(i))}))}}var f;if("function"!=typeof e&&t(6),void 0!==i&&"function"!=typeof i&&t(7),r(n)){var a=O(this),c=E(this,n,void 0),s=!0;try{f=e(c),s=!1;}finally{s?m(a):j(a);}return "undefined"!=typeof Promise&&f instanceof Promise?f.then((function(t){return b(a,i),S(t,a)}),(function(t){throw m(a),t})):(b(a,i),S(f,a))}if((f=e(n))!==W)return void 0===f&&(f=n),this.J&&p(f,!0),f},i.produceWithPatches=function(t,n){var r,e,i=this;return "function"==typeof t?function(n){for(var r=arguments.length,e=Array(r>1?r-1:0),u=1;u<r;u++)e[u-1]=arguments[u];return i.produceWithPatches(n,(function(n){return t.apply(void 0,[n].concat(e))}))}:[this.produce(t,n,(function(t,n){r=t,e=n;})),r,e]},i.createDraft=function(n){r(n)||t(8);var e=O(this),i=E(this,n,void 0);return i[q].$=!0,j(e),i},i.finishDraft=function(t,n){var r=(t&&t[q]).A;return b(r,n),S(void 0,r)},i.setAutoFreeze=function(t){this.J=t;},i.setUseProxies=function(n){I||t(20),this.S=n;},i.applyPatches=function(t,r){var e;for(e=r.length-1;e>=0;e--){var i=r[e];if(0===i.path.length&&"replace"===i.op){t=i.value;break}}var u=d("Patches").X;return n(t)?u(t,r):this.produce(t,(function(t){return u(t,r.slice(e+1))}))},e}(),U=new T,V=U.produce,Y=U.produceWithPatches.bind(U),Z=U.setAutoFreeze.bind(U),tt=U.setUseProxies.bind(U),nt=U.applyPatches.bind(U),rt=U.createDraft.bind(U),et=U.finishDraft.bind(U);immer_cjs_production_min.Immer=T,immer_cjs_production_min.applyPatches=nt,immer_cjs_production_min.castDraft=function(t){return t},immer_cjs_production_min.castImmutable=function(t){return t},immer_cjs_production_min.createDraft=rt,immer_cjs_production_min.default=V,immer_cjs_production_min.enableAllPlugins=function(){k(),D(),F();},immer_cjs_production_min.enableES5=k,immer_cjs_production_min.enableMapSet=D,immer_cjs_production_min.enablePatches=F,immer_cjs_production_min.finishDraft=et,immer_cjs_production_min.immerable=X,immer_cjs_production_min.isDraft=n,immer_cjs_production_min.isDraftable=r,immer_cjs_production_min.nothing=W,immer_cjs_production_min.original=function(t){if(t&&t[q])return t[q].u},immer_cjs_production_min.produce=V,immer_cjs_production_min.produceWithPatches=Y,immer_cjs_production_min.setAutoFreeze=Z,immer_cjs_production_min.setUseProxies=tt;

      {
        dist.exports = immer_cjs_production_min;
      }

      dist.exports.enableAllPlugins();
      dist.exports.setAutoFreeze(false);
      const { produce } = new dist.exports.Immer({
        autoFreeze: false
      });
      const applyPatches = (target, patches) => {
        patches.forEach(({ op, path, value }) => {
          if (op === "replace" || op === "add") {
            FormPath.setIn(target, path, value);
          } else if (op === "remove") {
            FormPath.deleteIn(target, path);
          }
        });
      };
      const createModel = exports('createModel', (Factory) => {
        return class Model extends Subscribable {
          constructor(props = {}) {
            super();
            this.hasChanged = (pattern) => {
              if (!pattern) {
                return this.dirtyCount > 0;
              } else {
                const path = FormPath.parse(pattern);
                if (path.length > 1 || !isStr(pattern)) {
                  return !isEqual(FormPath.getIn(this.prevState, path), FormPath.getIn(this.state, path));
                } else {
                  return !!this.dirtys[pattern];
                }
              }
            };
            this.props = defaults(Factory.defaultProps, props);
            this.displayName = Factory.displayName;
            this.factory = new Factory(this.props);
            this.cache = new Map();
            this.state = this.factory.state;
            this.state.displayName = this.displayName;
            this.prevState = this.state;
            this.batching = false;
            this.dirtyStack = [];
            this.dirtyCountStack = [];
          }
          enterCalculateDirtys() {
            this.dirtyStack.push({});
            this.dirtyCountStack.push(0);
          }
          existCalculateDirtys() {
            this.dirtyStack.pop();
            this.dirtyCountStack.pop();
          }
          get dirtys() {
            return this.dirtyStack[this.dirtyStack.length - 1] || {};
          }
          set dirtys(dirtys) {
            if (this.dirtyStack.length === 0) {
              this.dirtyStack.push({});
            }
            this.dirtyStack[this.dirtyStack.length - 1] = dirtys;
          }
          get dirtyCount() {
            return this.dirtyCountStack[this.dirtyCountStack.length - 1] || 0;
          }
          set dirtyCount(value) {
            if (this.dirtyCountStack.length === 0) {
              this.dirtyCountStack.push(0);
            }
            this.dirtyCountStack[this.dirtyCountStack.length - 1] = value;
          }
          getBaseState() {
            if (isFn(this.factory.getState)) {
              return this.factory.getState.call(this.factory, this.state);
            } else {
              return this.state;
            }
          }
          getDirtysFromPatches(patches, refresh) {
            return patches.reduce((buf, { path }) => {
              buf[path[0]] = true;
              return buf;
            }, refresh ? {} : this.batching ? this.dirtys : {});
          }
          dirtyCheck(path, nextValue) {
            const currentValue = FormPath.getIn(this.state, path);
            if (isFn(this.factory.dirtyCheck)) {
              if (isFn(this.props.dirtyCheck)) {
                return this.factory.dirtyCheck(path, currentValue, nextValue) && this.props.dirtyCheck(path, currentValue, nextValue);
              } else {
                return this.factory.dirtyCheck(path, currentValue, nextValue);
              }
            } else {
              if (isFn(this.props.dirtyCheck)) {
                return this.props.dirtyCheck(path, currentValue, nextValue);
              } else {
                return !isEqual(currentValue, nextValue);
              }
            }
          }
          setState(recipe, silent = false) {
            var _a, _b, _c, _d;
            if (!isFn(recipe))
              return;
            const base = this.getBaseState();
            this.patches = [];
            this.prevState = base;
            this.factory.prevState = base;
            this.factory.state = base;
            (_b = (_a = this.factory) == null ? void 0 : _a.beforeProduce) == null ? void 0 : _b.call(_a);
            if (!this.batching) {
              this.enterCalculateDirtys();
            }
            produce(base, (draft) => {
              recipe(draft);
              if (isFn(this.props.computeState)) {
                this.props.computeState(draft, this.prevState);
              }
            }, (patches) => {
              this.patches = this.patches.concat(patches);
            });
            const produced = produce(base, (draft) => {
              applyPatches(draft, this.patches);
              const dirtys = this.getDirtysFromPatches(this.patches, true);
              if (isFn(this.factory.produce)) {
                this.factory.produce(draft, dirtys);
              }
            }, (patches) => {
              patches.forEach((patch) => {
                const { path, value } = patch;
                if (this.dirtyCheck(path, value)) {
                  this.patches.push(patch);
                  this.dirtyCount++;
                }
              });
            });
            this.factory.state = produced;
            this.state = produced;
            this.dirtys = this.getDirtysFromPatches(this.patches);
            this.patches = [];
            (_d = (_c = this.factory) == null ? void 0 : _c.afterProduce) == null ? void 0 : _d.call(_c);
            if (this.dirtyCount > 0 && !silent) {
              if (this.batching) {
                return;
              }
              this.notify(this.getState(), silent);
            }
            this.existCalculateDirtys();
          }
          setSourceState(recipe) {
            if (!isFn(recipe))
              return this.state;
            recipe(this.state);
          }
          getState(recipe) {
            if (!isFn(recipe))
              return this.getBaseState();
            return recipe(this.getBaseState());
          }
          getSourceState(recipe) {
            if (!isFn(recipe))
              return this.state;
            return recipe(this.state);
          }
          batch(callback) {
            this.batching = true;
            this.enterCalculateDirtys();
            const prevState = this.state;
            if (isFn(callback)) {
              callback();
            }
            this.prevState = prevState;
            if (this.dirtyCount > 0) {
              this.notify(this.getState());
            }
            this.batching = false;
            this.existCalculateDirtys();
          }
          setCache(key, value) {
            this.cache.set(key, typeof value === "object" ? shallowClone(value) : value);
          }
          getCache(key) {
            const value = this.cache.get(key);
            if (isValid(value))
              return value;
            if (this.cache.size === 1) {
              let findKey = null;
              this.cache.forEach((value2, key2) => {
                findKey = key2;
              });
              return this.cache.get(findKey);
            }
            return value;
          }
          removeCache(key) {
            this.cache.delete(key);
          }
          isDirty(key) {
            if (key) {
              return this.dirtys[key];
            } else {
              return this.dirtyCount > 0;
            }
          }
        };
      });

      var _a$2;
      const normalizeMessages$1 = (messages) => toArr(messages).filter((v) => !!v);
      const Form = createModel((_a$2 = class {
        constructor(props) {
          this.state = {
            valid: true,
            invalid: false,
            loading: false,
            validating: false,
            initialized: false,
            submitting: false,
            editable: true,
            modified: false,
            errors: [],
            warnings: [],
            values: {},
            initialValues: {},
            mounted: false,
            unmounted: false
          };
          this.props = props;
        }
        produce(draft, dirtys) {
          if (dirtys.errors) {
            draft.errors = normalizeMessages$1(draft.errors);
          }
          if (dirtys.warnings) {
            draft.warnings = normalizeMessages$1(draft.warnings);
          }
          if (draft.errors.length) {
            draft.invalid = true;
            draft.valid = false;
          } else {
            draft.invalid = false;
            draft.valid = true;
          }
          if (dirtys.initialized && !draft.modified) {
            if (dirtys.values) {
              draft.modified = true;
            }
          }
          if (dirtys.validating) {
            if (draft.validating === true) {
              draft.loading = true;
            } else if (draft.validating === false) {
              draft.loading = false;
            }
          }
          if (draft.mounted === true && dirtys.mounted) {
            draft.unmounted = false;
          }
          if (draft.unmounted === true && dirtys.unmounted) {
            draft.mounted = false;
          }
        }
      }, _a$2.displayName = "FormState", _a$2));

      var LifeCycleTypes; exports('LifeCycleTypes', LifeCycleTypes);
      (function(LifeCycleTypes2) {
        LifeCycleTypes2["ON_FORM_WILL_INIT"] = "onFormWillInit";
        LifeCycleTypes2["ON_FORM_INIT"] = "onFormInit";
        LifeCycleTypes2["ON_FORM_CHANGE"] = "onFormChange";
        LifeCycleTypes2["ON_FORM_MOUNT"] = "onFormMount";
        LifeCycleTypes2["ON_FORM_UNMOUNT"] = "onFormUnmount";
        LifeCycleTypes2["ON_FORM_SUBMIT"] = "onFormSubmit";
        LifeCycleTypes2["ON_FORM_RESET"] = "onFormReset";
        LifeCycleTypes2["ON_FORM_SUBMIT_START"] = "onFormSubmitStart";
        LifeCycleTypes2["ON_FORM_SUBMIT_END"] = "onFormSubmitEnd";
        LifeCycleTypes2["ON_FORM_SUBMIT_VALIDATE_START"] = "onFormSubmitValidateStart";
        LifeCycleTypes2["ON_FORM_SUBMIT_VALIDATE_SUCCESS"] = "onFormSubmitValidateSuccess";
        LifeCycleTypes2["ON_FORM_SUBMIT_VALIDATE_FAILED"] = "onFormSubmitValidateFailed";
        LifeCycleTypes2["ON_FORM_ON_SUBMIT_SUCCESS"] = "onFormOnSubmitSuccess";
        LifeCycleTypes2["ON_FORM_ON_SUBMIT_FAILED"] = "onFormOnSubmitFailed";
        LifeCycleTypes2["ON_FORM_VALUES_CHANGE"] = "onFormValuesChange";
        LifeCycleTypes2["ON_FORM_INITIAL_VALUES_CHANGE"] = "onFormInitialValuesChange";
        LifeCycleTypes2["ON_FORM_VALIDATE_START"] = "onFormValidateStart";
        LifeCycleTypes2["ON_FORM_VALIDATE_END"] = "onFormValidateEnd";
        LifeCycleTypes2["ON_FORM_INPUT_CHANGE"] = "onFormInputChange";
        LifeCycleTypes2["ON_FORM_HOST_RENDER"] = "onFormHostRender";
        LifeCycleTypes2["ON_FORM_GRAPH_CHANGE"] = "onFormGraphChange";
        LifeCycleTypes2["ON_FIELD_WILL_INIT"] = "onFieldWillInit";
        LifeCycleTypes2["ON_FIELD_INIT"] = "onFieldInit";
        LifeCycleTypes2["ON_FIELD_CHANGE"] = "onFieldChange";
        LifeCycleTypes2["ON_FIELD_INPUT_CHANGE"] = "onFieldInputChange";
        LifeCycleTypes2["ON_FIELD_VALUE_CHANGE"] = "onFieldValueChange";
        LifeCycleTypes2["ON_FIELD_INITIAL_VALUE_CHANGE"] = "onFieldInitialValueChange";
        LifeCycleTypes2["ON_FIELD_VALIDATE_START"] = "onFieldValidateStart";
        LifeCycleTypes2["ON_FIELD_VALIDATE_END"] = "onFieldValidateEnd";
        LifeCycleTypes2["ON_FIELD_MOUNT"] = "onFieldMount";
        LifeCycleTypes2["ON_FIELD_UNMOUNT"] = "onFieldUnmount";
      })(LifeCycleTypes || (exports('LifeCycleTypes', LifeCycleTypes = {})));
      const isField = exports('isField', (target) => target && target.displayName === "FieldState" && isFn(target.getState) && isFn(target.setState));
      const isFieldState = exports('isFieldState', (target) => target && target.displayName === "FieldState" && target.name && target.path);
      const isFormState = exports('isFormState', (target) => target && target.displayName === "FormState");
      const isVirtualField = exports('isVirtualField', (target) => target && target.displayName === "VirtualFieldState" && isFn(target.getState) && isFn(target.setState));
      const isVirtualFieldState = exports('isVirtualFieldState', (target) => target && target.displayName === "VirtualFieldState");
      const isStateModel = exports('isStateModel', (payload) => {
        return isFn(payload == null ? void 0 : payload.getState);
      });

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
      const createFormInternals = (options = {}) => {
        function onFormChange(published) {
          const { dirtys } = form;
          if (dirtys.values) {
            notifyFormValuesChange();
          }
          if (dirtys.initialValues) {
            if (!env.uploading) {
              form.setState((state) => {
                state.values = defaults(published.initialValues, published.values);
              });
            }
            notifyFormInitialValuesChange();
          }
          if (dirtys.unmounted && published.unmounted) {
            heart.publish(LifeCycleTypes.ON_FORM_UNMOUNT, form);
          }
          if (dirtys.mounted && published.mounted) {
            heart.publish(LifeCycleTypes.ON_FORM_MOUNT, form);
          }
          if (dirtys.initialized) {
            heart.publish(LifeCycleTypes.ON_FORM_INIT, form);
          }
          heart.publish(LifeCycleTypes.ON_FORM_CHANGE, form);
          if (env.hostRendering) {
            env.hostRendering = dirtys.values || dirtys.initialValues || dirtys.editable;
          }
          return env.hostRendering;
        }
        function notifyFormValuesChange() {
          if (isFn(options.onChange) && form.state.mounted && !form.state.unmounted) {
            clearTimeout(env.onChangeTimer);
            env.onChangeTimer = setTimeout(() => {
              if (form.state.unmounted)
                return;
              options.onChange(clone(getFormValuesIn("")));
            });
          }
          heart.publish(LifeCycleTypes.ON_FORM_VALUES_CHANGE, form);
        }
        function notifyFormInitialValuesChange() {
          heart.publish(LifeCycleTypes.ON_FORM_INITIAL_VALUES_CHANGE, form);
        }
        function onGraphChange({ type, payload }) {
          heart.publish(LifeCycleTypes.ON_FORM_GRAPH_CHANGE, graph);
          if (type === "GRAPH_NODE_WILL_UNMOUNT") {
            validator.unregister(payload.path.toString());
          }
        }
        function setFormIn(path, key, value, silent) {
          const method = silent ? "setSourceState" : "setState";
          form[method]((state) => {
            FormPath.setIn(state[key], getDataPath(path), value);
            if (key === "values") {
              state.modified = true;
            }
          }, silent);
        }
        function deleteFormIn(path, key, silent) {
          const method = silent ? "setSourceState" : "setState";
          form[method]((state) => {
            FormPath.deleteIn(state[key], getDataPath(path));
            if (key === "values") {
              state.modified = true;
            }
          }, silent);
        }
        function deleteFormValuesIn(path, silent) {
          deleteFormIn(path, "values", silent);
        }
        function setFormValuesIn(path, value, silent) {
          return setFormIn(path, "values", value, silent);
        }
        function setFormInitialValuesIn(path, value, silent) {
          return setFormIn(path, "initialValues", value, silent);
        }
        function getFormIn(path, key) {
          return form.getState((state) => FormPath.getIn(state[key], getDataPath(path)));
        }
        function getFormValuesIn(path) {
          return getFormIn(path, "values");
        }
        function existFormValuesIn(path) {
          return form.getState((state) => FormPath.existIn(state.values, getDataPath(path)));
        }
        function getFormInitialValuesIn(path) {
          return getFormIn(path, "initialValues");
        }
        function getDataPath(path) {
          const newPath = FormPath.getPath(path);
          return newPath.reduce((path2, key, index) => {
            if (index >= newPath.length - 1)
              return path2.concat([key]);
            const realPath = newPath.slice(0, index + 1);
            const dataPath = path2.concat([key]);
            const selected = graph.get(realPath);
            if (isVirtualField(selected)) {
              return path2;
            }
            return dataPath;
          }, FormPath.getPath(""));
        }
        function matchStrategy(pattern, nodePath) {
          const matchPattern = FormPath.parse(pattern);
          const node = graph.get(nodePath);
          if (!node)
            return false;
          return node.getSourceState((state) => matchPattern.matchAliasGroup(state.name, state.path));
        }
        function updateRecoverableShownState(parentState, childState, name) {
          const lastShownState = env.lastShownStates[childState.path];
          const lastStateValue = childState[name];
          if (parentState[name] && lastShownState && lastShownState[name] === false) {
            childState[name] = false;
            delete lastShownState[name];
            if (!lastShownState.hasOwnProperty("visible") && !lastShownState.hasOwnProperty("display")) {
              delete env.lastShownStates[childState.path];
            }
          } else {
            childState[name] = parentState[name];
          }
          if (!parentState[name] && !lastStateValue) {
            if (!lastShownState) {
              env.lastShownStates[childState.path] = {};
            }
            env.lastShownStates[childState.path][name] = false;
          }
        }
        function resetFormMessages(fieldState) {
          const { path, visible, display, unmounted, editable } = fieldState;
          if (editable === false || visible === false || unmounted === true || display === false) {
            form.setState((state) => {
              var _a, _b, _c, _d;
              const newErrors = (_b = (_a = state.errors) == null ? void 0 : _a.reduce) == null ? void 0 : _b.call(_a, (buf, item) => {
                if (item.path === path) {
                  return buf;
                } else {
                  return buf.concat(item);
                }
              }, []);
              const newWarnings = (_d = (_c = state.warnings) == null ? void 0 : _c.reduce) == null ? void 0 : _d.call(_c, (buf, item) => {
                if (item.path === path) {
                  return buf;
                } else {
                  return buf.concat(item);
                }
              }, []);
              const errorsChanged = !isEqual(state.errors, newErrors);
              const warningsChanged = !isEqual(state.warnings, newWarnings);
              if (warningsChanged) {
                state.warnings = newWarnings;
              }
              if (errorsChanged) {
                state.errors = newErrors;
              }
            });
          }
        }
        function syncFormMessages(type, fieldState, silent) {
          const { name, path } = fieldState;
          const messages = fieldState[type];
          form.setState((state) => {
            var _a, _b;
            let foundField = false;
            const newMessages = (_b = (_a = state[type]) == null ? void 0 : _a.reduce) == null ? void 0 : _b.call(_a, (buf, item) => {
              if (item.path === path) {
                foundField = true;
                return messages.length ? buf.concat({ name, path, messages }) : buf;
              } else {
                return buf.concat(item);
              }
            }, []);
            const messageChanged = !isEqual(state[type], newMessages);
            if (messageChanged) {
              state[type] = newMessages;
            }
            if (!foundField && messages.length) {
              state[type].push({
                name,
                path,
                messages
              });
            }
          }, silent);
        }
        function batchRunTaskQueue(field, nodePath) {
          for (let index = 0; index < env.taskQueue.length; index++) {
            const { pattern, callbacks } = env.taskQueue[index];
            let removed = false;
            if (matchStrategy(pattern, nodePath)) {
              callbacks.forEach((callback) => {
                field.setState(callback);
              });
              if (!pattern.isWildMatchPattern && !pattern.isMatchPattern) {
                env.taskQueue.splice(index--, 1);
                removed = true;
              }
            }
            if (!removed) {
              env.taskIndexes[pattern.toString()] = index;
            } else {
              delete env.taskIndexes[pattern.toString()];
            }
          }
        }
        function pushTaskQueue(pattern, callback) {
          const id = pattern.toString();
          const taskIndex = env.taskIndexes[id];
          if (isValid(taskIndex)) {
            if (env.taskQueue[taskIndex] && !env.taskQueue[taskIndex].callbacks.some((fn) => fn.toString() === callback.toString() ? fn === callback : false)) {
              env.taskQueue[taskIndex].callbacks.push(callback);
            }
          } else {
            env.taskIndexes[id] = env.taskQueue.length;
            env.taskQueue.push({
              pattern,
              callbacks: [callback]
            });
          }
        }
        function init(actions) {
          heart.publish(LifeCycleTypes.ON_FORM_WILL_INIT, form, actions);
          graph.appendNode(form);
          form.setState((state) => {
            state.initialized = true;
            if (isValid(options.initialValues)) {
              state.initialValues = clone(options.initialValues);
            }
            if (isValid(options.values)) {
              state.values = clone(options.values);
            }
            if (!isValid(state.values)) {
              state.values = state.initialValues;
            }
            if (isValid(options.editable)) {
              state.editable = options.editable;
            }
          });
        }
        function hostUpdate(callback, forceUpdate) {
          if (isFn(callback)) {
            env.hostRendering = true;
            const result = callback();
            if (env.hostRendering || forceUpdate) {
              heart.publish(LifeCycleTypes.ON_FORM_HOST_RENDER, form);
            }
            env.hostRendering = false;
            return result;
          }
        }
        function nextTick(callback) {
          setTimeout(callback);
        }
        function afterUnmount(callback) {
          clearTimeout(env.unmountTimer);
          env.unmountTimer = setTimeout(callback, 1e3);
        }
        function isHostRendering() {
          return env.hostRendering;
        }
        function disableUnmountClearStates(pattern = "*") {
          const path = FormPath.parse(pattern);
          env.clearStatesPatterns[path.toString()] = false;
        }
        function enableUnmountClearStates(pattern = "*") {
          const path = FormPath.parse(pattern);
          env.clearStatesPatterns[path.toString()] = true;
        }
        function disableUnmountRemoveNode() {
          env.unmountRemoveNode = false;
        }
        function enableUnmountRemoveNode() {
          env.unmountRemoveNode = true;
        }
        function supportUnmountClearStates(path) {
          for (const pattern in env.clearStatesPatterns) {
            const enable = env.clearStatesPatterns[pattern];
            if (matchStrategy(pattern, path)) {
              return enable;
            }
          }
          return true;
        }
        function upload(callback) {
          env.uploading = true;
          callback();
          env.uploading = false;
        }
        const graph = new FormGraph({
          matchStrategy
        });
        const form = new Form();
        const validator = new FormValidator(__spreadProps$2(__spreadValues$2({}, options), {
          matchStrategy
        }));
        const heart = new FormHeart(__spreadProps$2(__spreadValues$2({}, options), {
          beforeNotify: (payload) => {
            env.publishing[payload.path || ""] = true;
          },
          afterNotify: (payload) => {
            env.publishing[payload.path || ""] = false;
          }
        }));
        const env = {
          validateTimer: null,
          unmountTimer: null,
          syncFormStateTimer: null,
          onChangeTimer: null,
          graphChangeTimer: null,
          hostRendering: false,
          publishing: {},
          taskQueue: [],
          uploading: false,
          taskIndexes: {},
          realRemoveTags: [],
          lastShownStates: {},
          clearStatesPatterns: {},
          unmountRemoveNode: false,
          submittingTask: void 0
        };
        form.subscription = {
          notify: onFormChange
        };
        graph.subscribe(onGraphChange);
        return {
          options,
          init,
          form,
          graph,
          validator,
          heart,
          env,
          upload,
          nextTick,
          afterUnmount,
          getDataPath,
          getFormValuesIn,
          getFormInitialValuesIn,
          setFormValuesIn,
          setFormInitialValuesIn,
          existFormValuesIn,
          deleteFormValuesIn,
          updateRecoverableShownState,
          disableUnmountClearStates,
          enableUnmountClearStates,
          supportUnmountClearStates,
          enableUnmountRemoveNode,
          disableUnmountRemoveNode,
          resetFormMessages,
          syncFormMessages,
          batchRunTaskQueue,
          pushTaskQueue,
          hostUpdate,
          isHostRendering
        };
      };

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
      var _a$1;
      const normalizeMessages = (messages) => toArr(messages).filter((v) => !!v);
      const calculateEditable = (selfEditable, formEditable, name) => {
        return isValid(selfEditable) ? selfEditable : isValid(formEditable) ? isFn(formEditable) ? formEditable(name) : formEditable : true;
      };
      const ARRAY_UNIQUE_TAG = Symbol.for("@@__YOU_CAN_NEVER_REMOVE_ARRAY_UNIQUE_TAG__@@");
      const parseArrayTags = (value) => {
        var _a2;
        if (!isArr(value))
          return [];
        return (_a2 = value == null ? void 0 : value.reduce) == null ? void 0 : _a2.call(value, (buf, item) => {
          return (item == null ? void 0 : item[ARRAY_UNIQUE_TAG]) ? buf.concat(item[ARRAY_UNIQUE_TAG]) : buf;
        }, []);
      };
      const tagArrayList = (current, name, force) => {
        var _a2;
        return (_a2 = current == null ? void 0 : current.map) == null ? void 0 : _a2.call(current, (item, index) => {
          if (isPlainObj(item)) {
            item[ARRAY_UNIQUE_TAG] = force ? `${name}.${index}` : item[ARRAY_UNIQUE_TAG] || `${name}.${index}`;
          }
          return item;
        });
      };
      const Field = createModel((_a$1 = class {
        constructor(props = {}) {
          this.state = {
            name: "",
            path: "",
            dataType: "any",
            initialized: false,
            pristine: true,
            valid: true,
            modified: false,
            inputed: false,
            touched: false,
            active: false,
            visited: false,
            invalid: false,
            visible: true,
            display: true,
            loading: false,
            validating: false,
            errors: [],
            values: [],
            ruleErrors: [],
            ruleWarnings: [],
            effectErrors: [],
            warnings: [],
            effectWarnings: [],
            editable: true,
            selfEditable: void 0,
            formEditable: void 0,
            value: void 0,
            visibleCacheValue: void 0,
            initialValue: void 0,
            rules: [],
            required: false,
            mounted: false,
            unmounted: false,
            props: {}
          };
          this.getState = () => {
            var _a2, _b;
            if (!this.state.initialized)
              return this.state;
            let value = this.getValueFromProps();
            let initialValue = this.getInitialValueFromProps();
            let formEditable = this.getEditableFromProps();
            if (this.isArrayList()) {
              value = this.fixArrayListTags(toArr(value));
              initialValue = this.fixArrayListTags(toArr(initialValue));
            }
            const valueChanged = !isEqual(this.state.value, value);
            const state = __spreadProps$1(__spreadValues$1({}, this.state), {
              initialValue,
              formEditable,
              editable: calculateEditable(this.state.selfEditable, formEditable, this.state.name),
              modified: this.state.modified || valueChanged,
              value,
              values: [value].concat(this.state.values.slice(1))
            });
            if (valueChanged && valueChanged !== this.lastCompareResults) {
              this.state.value = value;
              (_b = (_a2 = this.props) == null ? void 0 : _a2.unControlledValueChanged) == null ? void 0 : _b.call(_a2);
            }
            this.lastCompareResults = valueChanged;
            return state;
          };
          this.nodePath = FormPath.getPath(props.nodePath);
          this.dataPath = FormPath.getPath(props.dataPath);
          this.state.name = this.dataPath.entire;
          this.state.path = this.nodePath.entire;
          this.state.dataType = props.dataType;
          this.props = props;
          this.updates = [];
        }
        dirtyCheck(path, currentValue, nextValue) {
          if (path[0] === "value") {
            if (this.isArrayList()) {
              return true;
            }
          }
          return !isEqual(currentValue, nextValue);
        }
        getValueFromProps() {
          var _a2;
          if (isFn((_a2 = this.props) == null ? void 0 : _a2.getValue)) {
            return this.props.getValue(this.state.name);
          }
          return this.state.value;
        }
        getEditableFromProps() {
          var _a2, _b;
          return (_b = (_a2 = this.props) == null ? void 0 : _a2.getEditable) == null ? void 0 : _b.call(_a2);
        }
        getInitialValueFromProps() {
          var _a2;
          if (isFn((_a2 = this.props) == null ? void 0 : _a2.getInitialValue)) {
            const initialValue = this.props.getInitialValue(this.state.name);
            return isValid(this.state.initialValue) ? this.state.initialValue : initialValue;
          }
          return this.state.initialValue;
        }
        produceErrorsAndWarnings(draft, dirtys) {
          if (dirtys.errors) {
            draft.effectErrors = normalizeMessages(draft.errors);
          }
          if (dirtys.warnings) {
            draft.effectWarnings = normalizeMessages(draft.warnings);
          }
          if (dirtys.effectErrors) {
            draft.effectErrors = normalizeMessages(draft.effectErrors);
          }
          if (dirtys.effectWarnings) {
            draft.effectWarnings = normalizeMessages(draft.effectWarnings);
          }
          if (dirtys.ruleErrors) {
            draft.ruleErrors = normalizeMessages(draft.ruleErrors);
          }
          if (dirtys.ruleWarnings) {
            draft.ruleWarnings = normalizeMessages(draft.ruleWarnings);
          }
          draft.errors = draft.ruleErrors.concat(draft.effectErrors);
          draft.warnings = draft.ruleWarnings.concat(draft.effectWarnings);
        }
        produceEditable(draft, dirtys) {
          if (dirtys.editable) {
            draft.selfEditable = draft.editable;
          }
          draft.editable = calculateEditable(draft.selfEditable, draft.formEditable, draft.name);
        }
        supportUnmountClearStates() {
          var _a2, _b;
          if (isFn((_a2 = this.props) == null ? void 0 : _a2.supportUnmountClearStates)) {
            return (_b = this.props) == null ? void 0 : _b.supportUnmountClearStates(this.state.path);
          }
          return true;
        }
        produceSideEffects(draft, dirtys) {
          const supportClearStates = this.supportUnmountClearStates();
          if (dirtys.validating) {
            if (draft.validating === true) {
              draft.loading = true;
            } else if (draft.validating === false) {
              draft.loading = false;
            }
          }
          if (draft.editable === false || draft.selfEditable === false || draft.visible === false || draft.display === false || draft.unmounted === true && supportClearStates) {
            draft.errors = [];
            draft.effectErrors = [];
            draft.warnings = [];
            draft.effectWarnings = [];
          }
          if (!isValid(draft.props)) {
            draft.props = {};
          }
          if (draft.mounted === true && dirtys.mounted) {
            draft.unmounted = false;
          }
          if (draft.mounted === false && dirtys.mounted) {
            draft.unmounted = true;
          }
          if (draft.unmounted === true && dirtys.unmounted) {
            draft.mounted = false;
          }
          if (draft.unmounted === false && dirtys.unmounted) {
            draft.mounted = true;
          }
          if (dirtys.visible || dirtys.mounted || dirtys.unmounted) {
            if (supportClearStates) {
              if (draft.display) {
                if (draft.visible === false || draft.unmounted === true) {
                  if (!dirtys.visibleCacheValue) {
                    draft.visibleCacheValue = isValid(draft.value) ? draft.value : isValid(draft.visibleCacheValue) ? draft.visibleCacheValue : draft.initialValue;
                  }
                  draft.value = void 0;
                  draft.values = toArr(draft.values);
                  draft.values[0] = void 0;
                  this.updates.push("value");
                } else if (draft.visible === true || draft.mounted === true || draft.unmounted === false) {
                  if (!isValid(draft.value)) {
                    draft.value = draft.visibleCacheValue;
                    this.updates.push("value");
                  }
                }
              }
            } else {
              if (draft.display) {
                if (draft.visible === false) {
                  if (!dirtys.visibleCacheValue) {
                    draft.visibleCacheValue = isValid(draft.value) ? draft.value : isValid(draft.visibleCacheValue) ? draft.visibleCacheValue : draft.initialValue;
                  }
                  draft.value = void 0;
                  draft.values = toArr(draft.values);
                  draft.values[0] = void 0;
                } else if (draft.visible === true) {
                  if (!isValid(draft.value)) {
                    draft.value = draft.visibleCacheValue;
                  }
                }
              }
            }
          }
          if (draft.errors.length) {
            draft.invalid = true;
            draft.valid = false;
          } else {
            draft.invalid = false;
            draft.valid = true;
          }
        }
        fixArrayListTags(value) {
          var _a2;
          if ((_a2 = value == null ? void 0 : value[0]) == null ? void 0 : _a2[ARRAY_UNIQUE_TAG]) {
            return value;
          } else {
            return this.tagArrayList(value);
          }
        }
        tagArrayList(value) {
          return tagArrayList(value, this.state.name);
        }
        isArrayList() {
          return /array/gi.test(this.state.dataType);
        }
        produceValue(draft, dirtys) {
          let valueOrInitialValueChanged = dirtys.values || dirtys.value || dirtys.initialValue;
          let valueChanged = dirtys.values || dirtys.value;
          if (dirtys.values) {
            draft.values = toArr(draft.values);
            if (this.isArrayList()) {
              draft.values[0] = this.tagArrayList(toArr(draft.values[0]));
            }
            draft.value = draft.values[0];
            draft.modified = true;
          }
          if (dirtys.value) {
            if (this.isArrayList()) {
              draft.value = this.tagArrayList(toArr(draft.value));
            }
            draft.values[0] = draft.value;
            draft.modified = true;
          }
          if (dirtys.initialized) {
            const isEmptyValue = !isValid(draft.value) || isEmpty(draft.value);
            if (isEmptyValue && isValid(draft.initialValue)) {
              draft.value = draft.initialValue;
              draft.values = toArr(draft.values);
              draft.values[0] = draft.value;
              valueChanged = true;
              valueOrInitialValueChanged = true;
            }
          }
          if (valueChanged) {
            this.updates.push("value");
          }
          if (dirtys.initialValue) {
            this.updates.push("initialValue");
          }
          if (valueOrInitialValueChanged) {
            if (isEqual(draft.initialValue, draft.value)) {
              draft.pristine = true;
            } else {
              draft.pristine = false;
            }
          }
        }
        getRulesFromRulesAndRequired(rules, required) {
          if (isValid(required)) {
            if (rules.length) {
              if (!rules.some((rule) => rule && isValid(rule["required"]))) {
                return rules.concat([{ required }]);
              } else {
                return rules.reduce((buf, item) => {
                  const keys = Object.keys(item || {});
                  if (isValid(item.required)) {
                    if (isValid(item.message)) {
                      if (keys.length > 2) {
                        return buf.concat(__spreadProps$1(__spreadValues$1({}, item), {
                          required
                        }));
                      }
                    } else {
                      if (keys.length > 1) {
                        return buf.concat(__spreadProps$1(__spreadValues$1({}, item), {
                          required
                        }));
                      }
                    }
                  }
                  if (isValid(item.required)) {
                    return buf.concat(__spreadProps$1(__spreadValues$1({}, item), {
                      required
                    }));
                  }
                  return buf.concat(item);
                }, []);
              }
            } else {
              if (required === true) {
                return rules.concat([
                  {
                    required
                  }
                ]);
              }
            }
          }
          return rules;
        }
        getRequiredFromRulesAndRequired(rules, required) {
          for (let i = 0; i < rules.length; i++) {
            if (isValid(rules[i].required)) {
              return rules[i].required;
            }
          }
          return required;
        }
        produceRules(draft, dirtys) {
          if (isValid(draft.rules)) {
            draft.rules = toArr(draft.rules);
          }
          if (dirtys.required && dirtys.rules || dirtys.required) {
            const rules = this.getRulesFromRulesAndRequired(draft.rules, draft.required);
            draft.required = draft.required;
            draft.rules = rules;
          } else if (dirtys.rules) {
            draft.required = this.getRequiredFromRulesAndRequired(draft.rules, draft.required);
          }
        }
        beforeProduce() {
          this.updates = [];
        }
        produce(draft, dirtys) {
          this.produceErrorsAndWarnings(draft, dirtys);
          this.produceEditable(draft, dirtys);
          this.produceValue(draft, dirtys);
          this.produceSideEffects(draft, dirtys);
          this.produceRules(draft, dirtys);
        }
        afterProduce() {
          this.updates.forEach((type) => {
            var _a2, _b, _c, _d;
            if (type === "value") {
              (_b = (_a2 = this.props) == null ? void 0 : _a2.setValue) == null ? void 0 : _b.call(_a2, this.state.name, this.state.value);
            } else {
              (_d = (_c = this.props) == null ? void 0 : _c.setInitialValue) == null ? void 0 : _d.call(_c, this.state.name, this.state.initialValue);
            }
          });
        }
      }, _a$1.defaultProps = {
        path: "",
        dataType: "any"
      }, _a$1.displayName = "FieldState", _a$1));

      var _a;
      const VirtualField = createModel((_a = class {
        constructor(props) {
          this.state = {
            name: "",
            path: "",
            initialized: false,
            visible: true,
            display: true,
            mounted: false,
            unmounted: false,
            props: {}
          };
          this.nodePath = FormPath.getPath(props.nodePath);
          this.dataPath = FormPath.getPath(props.dataPath);
          this.state.path = this.nodePath.entire;
          this.state.name = this.dataPath.entire;
        }
        produce(draft, dirtys) {
          if (draft.mounted === true && dirtys.mounted) {
            draft.unmounted = false;
          }
          if (!isValid(draft.props)) {
            draft.props = {};
          }
          if (draft.unmounted === true && dirtys.unmounted) {
            draft.mounted = false;
          }
        }
      }, _a.displayName = "VirtualFieldState", _a));

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
      const createFormExternals = (internals) => {
        const {
          options,
          init,
          env,
          form,
          heart,
          graph,
          validator,
          upload,
          hostUpdate,
          afterUnmount,
          nextTick,
          isHostRendering,
          getDataPath,
          getFormValuesIn,
          getFormInitialValuesIn,
          deleteFormValuesIn,
          setFormValuesIn,
          setFormInitialValuesIn,
          updateRecoverableShownState,
          supportUnmountClearStates,
          disableUnmountClearStates,
          enableUnmountClearStates,
          enableUnmountRemoveNode,
          disableUnmountRemoveNode,
          resetFormMessages,
          syncFormMessages,
          batchRunTaskQueue,
          pushTaskQueue
        } = internals;
        function eachArrayExchanges(prevState, currentState, eacher) {
          var _a, _b;
          const exchanged = {};
          const prevValue = prevState.value;
          const currentValue = currentState.value;
          const maxLengthValue = (prevValue == null ? void 0 : prevValue.length) > (currentValue == null ? void 0 : currentValue.length) ? prevValue : currentValue;
          let lastResults;
          each(maxLengthValue, (item, index) => {
            var _a2, _b2;
            const prev = (_a2 = prevValue == null ? void 0 : prevValue[index]) == null ? void 0 : _a2[ARRAY_UNIQUE_TAG];
            const current = (_b2 = currentValue == null ? void 0 : currentValue[index]) == null ? void 0 : _b2[ARRAY_UNIQUE_TAG];
            if (prev === current)
              return;
            if (prev === void 0) {
              return;
            }
            if ((currentValue == null ? void 0 : currentValue.length) === (prevValue == null ? void 0 : prevValue.length)) {
              if (exchanged[prev] || exchanged[current])
                return;
              exchanged[prev] = true;
              exchanged[current] = true;
            }
            lastResults = eacher(prev, current, lastResults);
          }, ((_a = currentState == null ? void 0 : currentState.value) == null ? void 0 : _a.length) >= ((_b = prevState == null ? void 0 : prevState.value) == null ? void 0 : _b.length));
        }
        function calculateMovePath(name, replace) {
          const segments = [];
          const indexes = [];
          FormPath.parse(name).forEach((key) => {
            if (/^\d+$/.test(key)) {
              indexes.push(segments.length);
            }
            segments.push(key);
          });
          if (indexes.length) {
            segments[indexes[indexes.length - 1]] = replace;
          }
          return segments.join(".");
        }
        function getExchangeState(state) {
          const results = __spreadValues({}, state);
          delete results.name;
          delete results.path;
          if (results.visible === false || results.unmounted === true || results.mounted === false) {
            delete results.value;
            delete results.values;
          }
          delete results.mounted;
          delete results.unmounted;
          return results;
        }
        function calculateRemovedTags(prevTags, currentTags) {
          if (prevTags.length <= currentTags.length)
            return [];
          env.realRemoveTags = prevTags.reduce((buf, tag) => {
            return currentTags.includes(tag) ? buf : buf.concat(tag);
          }, []);
          return prevTags.slice(currentTags.length - prevTags.length);
        }
        function removeArrayNodes(field, tags) {
          if (tags.length <= 0)
            return;
          const matchTag = (node) => (tag) => FormPath.parse(calculateMathTag(tag)).matchAliasGroup(node.state.name, node.state.path);
          graph.eachChildren(field.state.path, (node) => {
            if (tags.some(matchTag(node))) {
              graph.remove(node.state.path);
            }
          });
          tags.forEach((tag) => {
            graph.select(calculateMathTag(tag), (node) => {
              graph.remove(node.state.path);
            });
          });
        }
        function calculateMathTag(tag) {
          return `*(${tag},${tag}.*)`;
        }
        function exchangeState(parentPath, prevPattern, currentPattern, lastCurrentStates) {
          const currentIndex = FormPath.transform(currentPattern, /\d+/, (...args) => {
            return Number(args[args.length - 1]);
          });
          const exchanged = {};
          const currentStates = {};
          graph.eachChildren(parentPath, calculateMathTag(prevPattern), (prevField) => {
            const prevPath = prevField.state.path;
            const prevState = prevField.getState(getExchangeState);
            const currentPath = calculateMovePath(prevPath, currentIndex);
            const currentState = getFieldState(currentPath, getExchangeState);
            const currentField = graph.get(currentPath);
            if (prevField) {
              prevField.setSourceState((state) => {
                if (currentState) {
                  Object.assign(state, currentState);
                } else {
                  Object.assign(state, getExchangeState(lastCurrentStates[prevPath]));
                }
                if (isField(prevField)) {
                  syncFormMessages("errors", state);
                  syncFormMessages("warnings", state);
                }
              });
            }
            if (currentField) {
              currentStates[currentPath] = currentField.getState();
              currentField.setSourceState((state) => {
                Object.assign(state, prevState);
              });
            }
            exchanged[prevPath + currentPath] = true;
          });
          return currentStates;
        }
        function eachParentFields(field, callback) {
          graph.eachParent(field.state.path, (node) => {
            if (isField(node)) {
              callback(node);
            }
          });
        }
        function onFieldChange({ field, path }) {
          return (published) => {
            const { dirtys } = field;
            if (dirtys.initialized) {
              heart.publish(LifeCycleTypes.ON_FIELD_INIT, field);
            }
            if (dirtys.value || dirtys.values) {
              const isArrayList = /array/gi.test(published.dataType);
              if (isArrayList) {
                const prevTags = parseArrayTags(field.prevState.value);
                const currentTags = parseArrayTags(published.value);
                if (!isEqual(prevTags, currentTags)) {
                  const removedTags = calculateRemovedTags(prevTags, currentTags);
                  if (prevTags.length && currentTags.length) {
                    form.batch(() => {
                      eachArrayExchanges(field.prevState, published, (prev, current, lastResults = {}) => exchangeState(path, prev, current, lastResults));
                    });
                  }
                  removeArrayNodes(field, removedTags);
                  setFormValuesIn(field.state.name, tagArrayList(field.state.value, field.state.name, true), true);
                }
              }
              heart.publish(LifeCycleTypes.ON_FIELD_VALUE_CHANGE, field);
              eachParentFields(field, (node) => {
                heart.publish(LifeCycleTypes.ON_FIELD_VALUE_CHANGE, node);
              });
            }
            if (dirtys.initialValue) {
              heart.publish(LifeCycleTypes.ON_FIELD_INITIAL_VALUE_CHANGE, field);
              eachParentFields(field, (node) => {
                heart.publish(LifeCycleTypes.ON_FIELD_INITIAL_VALUE_CHANGE, node);
              });
            }
            if (dirtys.visible || dirtys.display) {
              graph.eachChildren(path, (childState) => {
                childState.setState((state) => {
                  if (dirtys.visible) {
                    updateRecoverableShownState(published, state, "visible");
                  }
                  if (dirtys.display) {
                    updateRecoverableShownState(published, state, "display");
                  }
                }, true);
              });
            }
            if (dirtys.unmounted && published.unmounted) {
              afterUnmount(() => {
                env.realRemoveTags = [];
              });
              heart.publish(LifeCycleTypes.ON_FIELD_UNMOUNT, field);
              if (env.unmountRemoveNode) {
                graph.remove(field.state.path);
              }
            }
            if (dirtys.mounted && published.mounted) {
              heart.publish(LifeCycleTypes.ON_FIELD_MOUNT, field);
            }
            if (dirtys.errors) {
              syncFormMessages("errors", published);
            }
            if (dirtys.warnings) {
              syncFormMessages("warnings", published);
            }
            if (dirtys.visible || dirtys.display || dirtys.editable || dirtys.unmounted) {
              if (dirtys.unmounted) {
                if (supportUnmountClearStates(published.path)) {
                  resetFormMessages(published);
                }
              } else {
                resetFormMessages(published);
              }
            }
            heart.publish(LifeCycleTypes.ON_FIELD_CHANGE, field);
            return !env.hostRendering;
          };
        }
        function onVirtualFieldChange({
          field,
          path
        }) {
          return (published) => {
            const { dirtys } = field;
            if (dirtys.initialized) {
              heart.publish(LifeCycleTypes.ON_FIELD_INIT, field);
            }
            if (dirtys.visible || dirtys.display) {
              graph.eachChildren(path, (childState) => {
                childState.setState((state) => {
                  if (dirtys.visible) {
                    updateRecoverableShownState(published, state, "visible");
                  }
                  if (dirtys.display) {
                    updateRecoverableShownState(published, state, "display");
                  }
                }, true);
              });
            }
            if (dirtys.unmounted && published.unmounted) {
              afterUnmount(() => {
                env.realRemoveTags = [];
              });
              heart.publish(LifeCycleTypes.ON_FIELD_UNMOUNT, field);
              if (env.unmountRemoveNode) {
                graph.remove(field.state.path);
              }
            }
            if (dirtys.mounted && published.mounted) {
              heart.publish(LifeCycleTypes.ON_FIELD_MOUNT, field);
            }
            heart.publish(LifeCycleTypes.ON_FIELD_CHANGE, field);
            return !env.hostRendering;
          };
        }
        function pickNotEmpty(v1, v2) {
          if (!isEmpty(v1))
            return v1;
          if (!isEmpty(v2))
            return v2;
          if (isValid(v1))
            return v1;
          if (isValid(v2))
            return v2;
        }
        function registerField({
          path,
          name,
          value,
          initialValue,
          required,
          rules,
          editable,
          visible,
          display,
          computeState,
          dataType,
          props
        }) {
          let field;
          const nodePath = FormPath.parse(path || name);
          const dataPath = getDataPath(nodePath);
          const createField = () => {
            const field2 = new Field({
              nodePath,
              dataPath,
              computeState,
              dataType,
              getValue(name2) {
                return getFormValuesIn(name2);
              },
              supportUnmountClearStates(path2) {
                var _a;
                if (!supportUnmountClearStates(path2))
                  return false;
                if (!((_a = env.realRemoveTags) == null ? void 0 : _a.length))
                  return true;
                return env.realRemoveTags.every((tag) => {
                  return !FormPath.parse(calculateMathTag(tag)).match(path2);
                });
              },
              getEditable() {
                return form.getState((state) => state.editable);
              },
              setValue(name2, value2) {
                upload(() => {
                  setFormValuesIn(name2, value2);
                });
              },
              setInitialValue(name2, value2) {
                upload(() => {
                  setFormInitialValuesIn(name2, value2);
                });
              },
              removeValue(name2) {
                if (!graph.get(nodePath))
                  return;
                upload(() => {
                  deleteFormValuesIn(name2);
                });
              },
              getInitialValue(name2) {
                return getFormInitialValuesIn(name2);
              },
              unControlledValueChanged() {
                nextTick(() => {
                  field2.dirtys = {
                    value: true,
                    values: true,
                    modified: true
                  };
                  field2.dirtyCount = 3;
                  heart.publish(LifeCycleTypes.ON_FIELD_VALUE_CHANGE, field2);
                  heart.publish(LifeCycleTypes.ON_FIELD_CHANGE, field2);
                });
              }
            });
            field2.subscription = {
              notify: onFieldChange({ field: field2, path: nodePath })
            };
            heart.publish(LifeCycleTypes.ON_FIELD_WILL_INIT, field2);
            graph.appendNode(field2, nodePath, dataPath);
            field2.batch(() => {
              field2.setState((state) => {
                const formValue = getFormValuesIn(state.name);
                const formInitialValue = getFormInitialValuesIn(state.name);
                const syncValue = pickNotEmpty(value, formValue);
                const syncInitialValue = pickNotEmpty(initialValue, formInitialValue);
                if (isValid(syncInitialValue)) {
                  state.initialValue = syncInitialValue;
                }
                if (isValid(syncValue)) {
                  state.value = syncValue;
                } else {
                  if (isValid(state.initialValue)) {
                    state.value = state.initialValue;
                  }
                }
                if (isValid(visible)) {
                  state.visible = visible;
                }
                if (isValid(display)) {
                  state.display = display;
                }
                if (isValid(props)) {
                  state.props = props;
                }
                if (isValid(required)) {
                  state.required = required;
                }
                if (isValid(rules)) {
                  state.rules = rules;
                }
                if (isValid(editable)) {
                  state.selfEditable = editable;
                }
                if (isValid(options.editable)) {
                  state.formEditable = options.editable;
                }
                state.initialized = true;
              });
              batchRunTaskQueue(field2, nodePath);
            });
            validator.register(nodePath, (validate2) => {
              const {
                value: value2,
                rules: rules2,
                errors,
                warnings,
                editable: editable2,
                visible: visible2,
                unmounted,
                display: display2
              } = field2.getState();
              if (editable2 === false || visible2 === false || unmounted === true || display2 === false || field2.disabledValidate || rules2.length === 0 && errors.length === 0 && warnings.length === 0)
                return validate2(value2, []);
              clearTimeout(field2.validateTimer);
              field2.validateTimer = setTimeout(() => {
                field2.setState((state) => {
                  state.validating = true;
                });
              }, 60);
              heart.publish(LifeCycleTypes.ON_FIELD_VALIDATE_START, field2);
              return validate2(value2, rules2).then(({ errors: errors2, warnings: warnings2 }) => {
                clearTimeout(field2.validateTimer);
                return new Promise((resolve) => {
                  field2.setState((state) => {
                    state.validating = false;
                    state.ruleErrors = errors2;
                    state.ruleWarnings = warnings2;
                  });
                  heart.publish(LifeCycleTypes.ON_FIELD_VALIDATE_END, field2);
                  resolve({
                    errors: errors2,
                    warnings: warnings2
                  });
                });
              });
            });
            return field2;
          };
          if (graph.exist(nodePath)) {
            field = graph.get(nodePath);
          } else {
            field = createField();
          }
          return field;
        }
        function registerVirtualField({
          name,
          path,
          display,
          visible,
          computeState,
          props
        }) {
          const nodePath = FormPath.parse(path || name);
          const dataPath = getDataPath(nodePath);
          let field;
          const createField = () => {
            const field2 = new VirtualField({
              nodePath,
              dataPath,
              computeState
            });
            field2.subscription = {
              notify: onVirtualFieldChange({ field: field2, path: nodePath })
            };
            heart.publish(LifeCycleTypes.ON_FIELD_WILL_INIT, field2);
            graph.appendNode(field2, nodePath, dataPath);
            field2.batch(() => {
              field2.setState((state) => {
                state.initialized = true;
                state.props = props;
                if (isValid(visible)) {
                  state.visible = visible;
                }
                if (isValid(display)) {
                  state.display = display;
                }
              });
              batchRunTaskQueue(field2, nodePath);
            });
            return field2;
          };
          if (graph.exist(nodePath)) {
            field = graph.get(nodePath);
          } else {
            field = createField();
          }
          return field;
        }
        function getFieldState(path, callback) {
          const field = graph.select(path);
          return field && field.getState(callback);
        }
        function setFieldState(path, callback, silent) {
          if (!isFn(callback))
            return;
          let matchCount = 0;
          const pattern = FormPath.getPath(path);
          graph.select(pattern, (field) => {
            if (!isFormState(field)) {
              field.setState(callback, silent);
            }
            matchCount++;
          });
          if (matchCount === 0 || pattern.isWildMatchPattern) {
            pushTaskQueue(pattern, callback);
          }
        }
        function getFieldValue(path) {
          return getFieldState(path, (state) => {
            return state.value;
          });
        }
        function setFieldValue(path, value, silent) {
          setFieldState(path, (state) => {
            state.value = value;
          }, silent);
        }
        function getFieldInitialValue(path) {
          return getFieldState(path, (state) => {
            return state.initialValue;
          });
        }
        function setFieldInitialValue(path, value, silent) {
          setFieldState(path, (state) => {
            state.initialValue = value;
          }, silent);
        }
        function getFormState(callback) {
          return form.getState(callback);
        }
        function setFormState(callback, silent) {
          hostUpdate(() => {
            form.setState(callback, silent);
          });
        }
        function getFormGraph() {
          return graph.map((node) => {
            return node.getState();
          });
        }
        function setFormGraph(nodes) {
          each(nodes, (node, key) => {
            let nodeState;
            if (graph.exist(key)) {
              nodeState = graph.get(key);
              nodeState.setSourceState((state) => {
                Object.assign(state, node);
              });
            } else {
              if (node.displayName === "VirtualFieldState") {
                nodeState = registerVirtualField({
                  path: key
                });
                nodeState.setSourceState((state) => {
                  Object.assign(state, node);
                });
              } else if (node.displayName === "FieldState") {
                nodeState = registerField({
                  path: key
                });
                nodeState.setSourceState((state) => {
                  Object.assign(state, node);
                });
              }
            }
            if (nodeState) {
              nodeState.notify(form.getState());
            }
          });
        }
        function subscribe(callback) {
          return heart.subscribe(callback);
        }
        function unsubscribe(id) {
          heart.unsubscribe(id);
        }
        function notify(type, payload) {
          heart.publish(type, payload);
        }
        async function submit(onSubmit) {
          if (form.getState((state) => state.submitting))
            return env.submittingTask;
          heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_START, form);
          onSubmit = onSubmit || options.onSubmit;
          form.setState((state) => {
            state.submitting = true;
          });
          env.submittingTask = async () => {
            heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_VALIDATE_START, form);
            await validate("", { throwErrors: false, hostRendering: true });
            const validated = form.getState((state) => ({
              errors: state.errors,
              warnings: state.warnings
            }));
            const { errors } = validated;
            if (errors.length) {
              form.setState((state) => {
                state.submitting = false;
              });
              heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_VALIDATE_FAILED, form);
              heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_END, form);
              if (isFn(options.onValidateFailed) && !form.state.unmounted) {
                options.onValidateFailed(validated);
              }
              throw errors;
            }
            heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_VALIDATE_SUCCESS, form);
            heart.publish(LifeCycleTypes.ON_FORM_SUBMIT, form);
            let payload;
            const values = form.getState((state) => clone(state.values));
            if (isFn(onSubmit) && !form.state.unmounted) {
              try {
                payload = await Promise.resolve(onSubmit(values));
                heart.publish(LifeCycleTypes.ON_FORM_ON_SUBMIT_SUCCESS, payload);
              } catch (e) {
                heart.publish(LifeCycleTypes.ON_FORM_ON_SUBMIT_FAILED, e);
                new Promise(() => {
                  throw e;
                });
              }
            }
            form.setState((state) => {
              state.submitting = false;
            });
            heart.publish(LifeCycleTypes.ON_FORM_SUBMIT_END, form);
            return {
              values,
              validated,
              payload
            };
          };
          return env.submittingTask();
        }
        async function reset(props = {}) {
          props = defaults({
            selector: "*",
            forceClear: false,
            validate: true,
            clearInitialValue: false
          }, props);
          hostUpdate(() => {
            graph.eachChildren("", props.selector, (field) => {
              field.disabledValidate = true;
              field.setState((state) => {
                state.modified = false;
                state.ruleErrors = [];
                state.ruleWarnings = [];
                state.effectErrors = [];
                state.effectWarnings = [];
                if (props.clearInitialValue) {
                  state.initialValue = void 0;
                }
                if (props.forceClear || !isValid(state.initialValue)) {
                  if (isArr(state.value)) {
                    state.value = [];
                  } else if (isPlainObj(state.value)) {
                    state.value = {};
                  } else {
                    state.value = void 0;
                  }
                } else {
                  const value = clone(state.initialValue);
                  if (isArr(state.value)) {
                    if (isArr(value)) {
                      state.value = value;
                    } else {
                      state.value = [];
                    }
                  } else if (isPlainObj(state.value)) {
                    if (isPlainObj(value)) {
                      state.value = value;
                    } else {
                      state.value = {};
                    }
                  } else {
                    state.value = value;
                  }
                }
              });
              field.disabledValidate = false;
            });
          });
          if (isFn(options.onReset) && !form.state.unmounted) {
            options.onReset();
          }
          heart.publish(LifeCycleTypes.ON_FORM_RESET, form);
          let validateResult;
          if (props.validate) {
            validateResult = await validate(props.selector, { throwErrors: false });
          }
          return validateResult;
        }
        async function validate(path, opts) {
          const { throwErrors = true, hostRendering } = opts || {};
          if (!form.getState((state) => state.validating)) {
            form.setSourceState((state) => {
              state.validating = true;
            });
            clearTimeout(env.validateTimer);
            env.validateTimer = setTimeout(() => {
              form.notify();
            }, 60);
          }
          heart.publish(LifeCycleTypes.ON_FORM_VALIDATE_START, form);
          if (graph.size > 100 && hostRendering)
            env.hostRendering = true;
          const payload = await validator.validate(path, opts);
          clearTimeout(env.validateTimer);
          form.setState((state) => {
            state.validating = false;
          });
          heart.publish(LifeCycleTypes.ON_FORM_VALIDATE_END, form);
          if (graph.size > 100 && hostRendering) {
            heart.publish(LifeCycleTypes.ON_FORM_HOST_RENDER, form);
            env.hostRendering = false;
          }
          const result = {
            errors: payload.errors.map((item) => __spreadProps(__spreadValues({}, item), {
              name: getFieldState(item.path).name
            })),
            warnings: payload.warnings.map((item) => __spreadProps(__spreadValues({}, item), {
              name: getFieldState(item.path).name
            }))
          };
          const { errors, warnings } = result;
          if (warnings.length) {
            log.warn(warnings);
          }
          if (errors.length > 0) {
            if (throwErrors) {
              throw result;
            } else {
              return result;
            }
          } else {
            return result;
          }
        }
        function clearErrors(pattern = "*") {
          hostUpdate(() => {
            graph.eachChildren("", pattern, (field) => {
              if (isField(field)) {
                field.setState((state) => {
                  state.ruleErrors = [];
                  state.ruleWarnings = [];
                  state.effectErrors = [];
                  state.effectWarnings = [];
                });
              }
            });
          });
        }
        function createMutators(input) {
          let field;
          if (!isField(input)) {
            const selected = graph.select(input);
            if (selected) {
              field = selected;
            } else {
              throw new Error("The `createMutators` can only accept FieldState instance or FormPathPattern.");
            }
          } else {
            field = input;
          }
          function setValue(...values) {
            field.setState((state) => {
              state.value = values[0];
              state.values = values;
              state.inputed = true;
            });
            heart.publish(LifeCycleTypes.ON_FIELD_INPUT_CHANGE, field);
            heart.publish(LifeCycleTypes.ON_FORM_INPUT_CHANGE, form);
          }
          function removeValue(key) {
            const nodePath = field.getSourceState((state) => state.path);
            if (isValid(key)) {
              const childNodePath = FormPath.parse(nodePath).concat(key);
              setFieldState(childNodePath, (state) => {
                state.value = void 0;
                state.values = [];
                state.inputed = true;
              });
              deleteFormValuesIn(childNodePath);
            } else {
              field.setState((state) => {
                state.value = void 0;
                state.values = [];
                state.inputed = true;
              });
              deleteFormValuesIn(nodePath);
            }
            heart.publish(LifeCycleTypes.ON_FIELD_VALUE_CHANGE, field);
            heart.publish(LifeCycleTypes.ON_FIELD_INPUT_CHANGE, field);
            heart.publish(LifeCycleTypes.ON_FORM_INPUT_CHANGE, form);
          }
          function getValue() {
            return field.getState((state) => state.value);
          }
          const mutators = {
            change(...values) {
              setValue(...values);
              return values[0];
            },
            focus() {
              field.setState((state) => {
                state.active = true;
              });
            },
            blur() {
              field.setState((state) => {
                state.active = false;
                state.visited = true;
              });
            },
            push(value) {
              const arr = toArr(getValue()).concat(value);
              setValue(arr);
              return arr;
            },
            pop() {
              const origin = toArr(getValue());
              const arr = origin.slice(0, origin.length - 1);
              setValue(arr);
              return arr;
            },
            insert(index, value) {
              const origin = toArr(getValue());
              if (origin.length === 0) {
                const arr2 = [value];
                setValue(arr2);
                return arr2;
              }
              if (origin.length === index) {
                const arr2 = origin.concat([value]);
                setValue(arr2);
                return arr2;
              }
              const arr = origin.reduce((buf, item, idx) => {
                return idx === index ? buf.concat([value, item]) : buf.concat(item);
              }, []);
              setValue(arr);
              return arr;
            },
            remove(index) {
              const val = getValue();
              if (isNum(index) && isArr(val)) {
                setValue(val.filter((item, idx) => idx !== index));
              } else {
                removeValue(index);
              }
            },
            exist(index) {
              const newPath = field.getSourceState((state) => FormPath.parse(state.path));
              const val = getValue();
              return (isValid(index) ? newPath.concat(index) : newPath).existIn(val, newPath);
            },
            unshift(value) {
              return mutators.insert(0, value);
            },
            shift() {
              return mutators.remove(0);
            },
            swap($from, $to) {
              const arr = toArr(getValue()).slice();
              const fromItem = arr[$from];
              const toItem = arr[$to];
              arr[$from] = toItem;
              arr[$to] = fromItem;
              setValue(arr);
              return arr;
            },
            move($from, $to) {
              const arr = toArr(getValue()).slice();
              const item = arr[$from];
              arr.splice($from, 1);
              arr.splice($to, 0, item);
              setValue(arr);
              return arr;
            },
            moveUp(index) {
              const len = toArr(getValue()).length;
              return mutators.move(index, index - 1 < 0 ? len - 1 : index - 1);
            },
            moveDown(index) {
              const len = toArr(getValue()).length;
              return mutators.move(index, index + 1 >= len ? 0 : index + 1);
            },
            validate(opts) {
              return validate(field.getSourceState((state) => state.path), __spreadProps(__spreadValues({}, opts), {
                hostRendering: false
              }));
            }
          };
          return mutators;
        }
        function hasChanged(target, path) {
          if (env.publishing[target ? target.path : ""] === false) {
            throw new Error("The watch function must be used synchronously in the subscribe callback.");
          }
          if (isFormState(target)) {
            return form.hasChanged(path);
          } else if (isFieldState(target) || isVirtualFieldState(target)) {
            const node = graph.get(target.path);
            return node && node.hasChanged(path);
          } else {
            throw new Error("Illegal parameter,You must pass the correct state object(FormState/FieldState/VirtualFieldState).");
          }
        }
        const formApi = {
          submit,
          reset,
          hasChanged,
          clearErrors,
          validate,
          setFormState,
          getFormState,
          setFieldState,
          getFieldState,
          registerField,
          registerVirtualField,
          createMutators,
          getFormGraph,
          setFormGraph,
          setFieldValue,
          getFieldValue,
          setFieldInitialValue,
          getFieldInitialValue,
          disableUnmountClearStates,
          enableUnmountClearStates,
          enableUnmountRemoveNode,
          disableUnmountRemoveNode,
          isHostRendering,
          hostUpdate,
          subscribe,
          unsubscribe,
          notify
        };
        init(formApi);
        return formApi;
      };

      const createForm = (options = {}) => {
        return createFormExternals(createFormInternals(options));
      }; exports({ createForm: createForm, 'default': createForm });
      const registerValidationFormats = exports('registerValidationFormats', FormValidator.registerFormats);
      const registerValidationRules = exports('registerValidationRules', FormValidator.registerRules);
      const registerValidationMTEngine = exports('registerValidationMTEngine', FormValidator.registerMTEngine);

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS4xLjMuMTMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGFyZWQvZ3JhcGgudHMiLCIuLi9zcmMvc2hhcmVkL2xpZmVjeWNsZS50cyIsIi4uL25vZGVfbW9kdWxlcy9pbW1lci9kaXN0L2ltbWVyLmNqcy5wcm9kdWN0aW9uLm1pbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9pbW1lci9kaXN0L2luZGV4LmpzIiwiLi4vc3JjL3NoYXJlZC9tb2RlbC50cyIsIi4uL3NyYy9tb2RlbHMvZm9ybS50cyIsIi4uL3NyYy90eXBlcy50cyIsIi4uL3NyYy9pbnRlcm5hbHMudHMiLCIuLi9zcmMvbW9kZWxzL2ZpZWxkLnRzIiwiLi4vc3JjL21vZGVscy92aXJ0dWFsLWZpZWxkLnRzIiwiLi4vc3JjL2V4dGVybmFscy50cyIsIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBlYWNoLFxuICByZWR1Y2UsXG4gIG1hcCxcbiAgaXNGbixcbiAgRm9ybVBhdGgsXG4gIEZvcm1QYXRoUGF0dGVybixcbiAgU3Vic2NyaWJhYmxlXG59IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCB7XG4gIEZvcm1HcmFwaE5vZGVSZWYsXG4gIEZvcm1HcmFwaE1hdGNoZXIsXG4gIEZvcm1HcmFwaEVhY2hlcixcbiAgRm9ybUdyYXBoUHJvcHNcbn0gZnJvbSAnLi4vdHlwZXMnXG5cbmV4cG9ydCBjbGFzcyBGb3JtR3JhcGg8Tm9kZVR5cGUgPSBhbnk+IGV4dGVuZHMgU3Vic2NyaWJhYmxlPHtcbiAgdHlwZTogc3RyaW5nXG4gIHBheWxvYWQ6IEZvcm1HcmFwaE5vZGVSZWZcbn0+IHtcbiAgcmVmcmVuY2VzOiB7XG4gICAgW2tleTogc3RyaW5nXTogRm9ybUdyYXBoTm9kZVJlZlxuICB9XG5cbiAgbm9kZXM6IHtcbiAgICBba2V5OiBzdHJpbmddOiBOb2RlVHlwZVxuICB9XG5cbiAgYnVmZmVyOiB7XG4gICAgcGF0aDogRm9ybVBhdGhcbiAgICByZWY6IEZvcm1HcmFwaE5vZGVSZWZcbiAgICBsYXRlc3RQYXJlbnQ/OiB7XG4gICAgICByZWY6IEZvcm1HcmFwaE5vZGVSZWZcbiAgICAgIHBhdGg6IEZvcm1QYXRoXG4gICAgfVxuICB9W11cblxuICBtYXRjaFN0cmF0ZWd5OiBGb3JtR3JhcGhQcm9wc1snbWF0Y2hTdHJhdGVneSddXG5cbiAgc2l6ZTogbnVtYmVyXG5cbiAgY29uc3RydWN0b3IocHJvcHM6IEZvcm1HcmFwaFByb3BzID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5yZWZyZW5jZXMgPSB7fVxuICAgIHRoaXMubm9kZXMgPSB7fVxuICAgIHRoaXMuc2l6ZSA9IDBcbiAgICB0aGlzLmJ1ZmZlciA9IFtdXG4gICAgdGhpcy5tYXRjaFN0cmF0ZWd5ID0gcHJvcHMubWF0Y2hTdHJhdGVneVxuICB9XG5cbiAgLyoqXG4gICAqIOaooeeziuWMuemFjUFQSVxuICAgKiBAcGFyYW0gcGF0aFxuICAgKiBAcGFyYW0gbWF0Y2hlclxuICAgKi9cbiAgc2VsZWN0KHBhdGg6IEZvcm1QYXRoUGF0dGVybiwgZWFjaGVyPzogRm9ybUdyYXBoTWF0Y2hlcjxOb2RlVHlwZT4pIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gRm9ybVBhdGgucGFyc2UocGF0aClcbiAgICBpZiAoIWVhY2hlcikge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0KHBhdHRlcm4pXG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBub2RlUGF0aCBpbiB0aGlzLm5vZGVzKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5ub2Rlc1tub2RlUGF0aF1cbiAgICAgIGlmIChcbiAgICAgICAgaXNGbih0aGlzLm1hdGNoU3RyYXRlZ3kpXG4gICAgICAgICAgPyB0aGlzLm1hdGNoU3RyYXRlZ3kocGF0dGVybiwgbm9kZVBhdGgpXG4gICAgICAgICAgOiBwYXR0ZXJuLm1hdGNoKG5vZGVQYXRoKVxuICAgICAgKSB7XG4gICAgICAgIGlmIChpc0ZuKGVhY2hlcikpIHtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBlYWNoZXIobm9kZSwgRm9ybVBhdGgucGFyc2Uobm9kZVBhdGgpKVxuICAgICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbm9kZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0KHBhdGg6IEZvcm1QYXRoUGF0dGVybikge1xuICAgIHJldHVybiB0aGlzLm5vZGVzW0Zvcm1QYXRoLnBhcnNlKHBhdGgpLnRvU3RyaW5nKCldXG4gIH1cblxuICBzZWxlY3RQYXJlbnQocGF0aDogRm9ybVBhdGhQYXR0ZXJuKSB7XG4gICAgY29uc3Qgc2VsZlBhdGggPSBGb3JtUGF0aC5wYXJzZShwYXRoKVxuICAgIGNvbnN0IHBhcmVudFBhdGggPSBGb3JtUGF0aC5wYXJzZShwYXRoKS5wYXJlbnQoKVxuICAgIGlmIChzZWxmUGF0aC50b1N0cmluZygpID09PSBwYXJlbnRQYXRoLnRvU3RyaW5nKCkpIHJldHVybiB1bmRlZmluZWRcblxuICAgIHJldHVybiB0aGlzLmdldChwYXJlbnRQYXRoKVxuICB9XG5cbiAgc2VsZWN0Q2hpbGRyZW4ocGF0aDogRm9ybVBhdGhQYXR0ZXJuKSB7XG4gICAgY29uc3QgcmVmID0gdGhpcy5yZWZyZW5jZXNbRm9ybVBhdGgucGFyc2UocGF0aCkudG9TdHJpbmcoKV1cbiAgICBpZiAocmVmICYmIHJlZi5jaGlsZHJlbikge1xuICAgICAgcmV0dXJuIHJlZHVjZShcbiAgICAgICAgcmVmLmNoaWxkcmVuLFxuICAgICAgICAoYnVmLCBwYXRoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGJ1Zi5jb25jYXQodGhpcy5nZXQocGF0aCkpLmNvbmNhdCh0aGlzLnNlbGVjdENoaWxkcmVuKHBhdGgpKVxuICAgICAgICB9LFxuICAgICAgICBbXVxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIGV4aXN0KHBhdGg6IEZvcm1QYXRoUGF0dGVybikge1xuICAgIHJldHVybiAhIXRoaXMuZ2V0KEZvcm1QYXRoLnBhcnNlKHBhdGgpKVxuICB9XG5cbiAgLyoqXG4gICAqIOmAkuW9kumBjeWOhuaJgOaciWNoaWxkcmVuXG4gICAqIOaUr+aMgeaooeeziuWMuemFjVxuICAgKi9cbiAgZWFjaENoaWxkcmVuKGVhY2hlcjogRm9ybUdyYXBoRWFjaGVyPE5vZGVUeXBlPiwgcmVjdXJzaW9uPzogYm9vbGVhbik6IHZvaWRcbiAgZWFjaENoaWxkcmVuKFxuICAgIHBhdGg6IEZvcm1QYXRoUGF0dGVybixcbiAgICBlYWNoZXI6IEZvcm1HcmFwaEVhY2hlcjxOb2RlVHlwZT4sXG4gICAgcmVjdXJzaW9uPzogYm9vbGVhblxuICApOiB2b2lkXG4gIGVhY2hDaGlsZHJlbihcbiAgICBwYXRoOiBGb3JtUGF0aFBhdHRlcm4sXG4gICAgc2VsZWN0b3I6IEZvcm1QYXRoUGF0dGVybixcbiAgICBlYWNoZXI6IEZvcm1HcmFwaEVhY2hlcjxOb2RlVHlwZT4sXG4gICAgcmVjdXJzaW9uPzogYm9vbGVhblxuICApOiB2b2lkXG4gIGVhY2hDaGlsZHJlbihcbiAgICBwYXRoOiBhbnksXG4gICAgc2VsZWN0b3I6IGFueSA9IHRydWUsXG4gICAgZWFjaGVyOiBhbnkgPSB0cnVlLFxuICAgIHJlY3Vyc2lvbjogYW55ID0gdHJ1ZVxuICApIHtcbiAgICBpZiAoaXNGbihwYXRoKSkge1xuICAgICAgcmVjdXJzaW9uID0gc2VsZWN0b3JcbiAgICAgIGVhY2hlciA9IHBhdGhcbiAgICAgIHBhdGggPSAnJ1xuICAgICAgc2VsZWN0b3IgPSAnKidcbiAgICB9XG4gICAgaWYgKGlzRm4oc2VsZWN0b3IpKSB7XG4gICAgICByZWN1cnNpb24gPSBlYWNoZXJcbiAgICAgIGVhY2hlciA9IHNlbGVjdG9yXG4gICAgICBzZWxlY3RvciA9ICcqJ1xuICAgIH1cblxuICAgIGNvbnN0IHJlZiA9IHRoaXMucmVmcmVuY2VzW0Zvcm1QYXRoLnBhcnNlKHBhdGgpLnRvU3RyaW5nKCldXG4gICAgaWYgKHJlZiAmJiByZWYuY2hpbGRyZW4pIHtcbiAgICAgIHJldHVybiBlYWNoKHJlZi5jaGlsZHJlbiwgcGF0aCA9PiB7XG4gICAgICAgIGlmIChpc0ZuKGVhY2hlcikpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5nZXQocGF0aClcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBub2RlICYmXG4gICAgICAgICAgICAoaXNGbih0aGlzLm1hdGNoU3RyYXRlZ3kpXG4gICAgICAgICAgICAgID8gdGhpcy5tYXRjaFN0cmF0ZWd5KHNlbGVjdG9yLCBwYXRoKVxuICAgICAgICAgICAgICA6IEZvcm1QYXRoLnBhcnNlKHNlbGVjdG9yKS5tYXRjaChwYXRoKSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGVhY2hlcihub2RlLCBwYXRoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVjdXJzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLmVhY2hDaGlsZHJlbihwYXRoLCBzZWxlY3RvciwgZWFjaGVyLCByZWN1cnNpb24pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDpgJLlvZLpgY3ljobmiYDmnIlwYXJlbnRcbiAgICovXG4gIGVhY2hQYXJlbnQocGF0aDogRm9ybVBhdGhQYXR0ZXJuLCBlYWNoZXI6IEZvcm1HcmFwaEVhY2hlcjxOb2RlVHlwZT4pIHtcbiAgICBjb25zdCBzZWxmUGF0aCA9IEZvcm1QYXRoLnBhcnNlKHBhdGgpXG4gICAgY29uc3QgcmVmID0gdGhpcy5yZWZyZW5jZXNbc2VsZlBhdGgudG9TdHJpbmcoKV1cbiAgICBpZiAoaXNGbihlYWNoZXIpKSB7XG4gICAgICBpZiAocmVmICYmIHJlZi5wYXJlbnQpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0KHJlZi5wYXJlbnQucGF0aClcbiAgICAgICAgdGhpcy5lYWNoUGFyZW50KHJlZi5wYXJlbnQucGF0aCwgZWFjaGVyKVxuICAgICAgICBlYWNoZXIobm9kZSwgcmVmLnBhcmVudC5wYXRoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDpgY3ljobmiYDmnInniLboioLngrnkuI7miYDmnInlrZDoioLngrlcbiAgICovXG4gIGVhY2hQYXJlbnRBbmRDaGlsZHJlbihcbiAgICBwYXRoOiBGb3JtUGF0aFBhdHRlcm4sXG4gICAgZWFjaGVyOiBGb3JtR3JhcGhFYWNoZXI8Tm9kZVR5cGU+XG4gICkge1xuICAgIGNvbnN0IHNlbGZQYXRoID0gRm9ybVBhdGgucGFyc2UocGF0aClcbiAgICBjb25zdCBub2RlID0gdGhpcy5nZXQoc2VsZlBhdGgpXG4gICAgaWYgKCFub2RlKSByZXR1cm5cbiAgICB0aGlzLmVhY2hQYXJlbnQoc2VsZlBhdGgsIGVhY2hlcilcbiAgICBpZiAoaXNGbihlYWNoZXIpKSB7XG4gICAgICBlYWNoZXIobm9kZSwgc2VsZlBhdGgpXG4gICAgICB0aGlzLmVhY2hDaGlsZHJlbihzZWxmUGF0aCwgZWFjaGVyKVxuICAgIH1cbiAgfVxuXG4gIGdldExhdGVzdFBhcmVudChwYXRoOiBGb3JtUGF0aFBhdHRlcm4pIHtcbiAgICBjb25zdCBzZWxmUGF0aCA9IEZvcm1QYXRoLnBhcnNlKHBhdGgpXG4gICAgY29uc3QgcGFyZW50UGF0aCA9IEZvcm1QYXRoLnBhcnNlKHBhdGgpLnBhcmVudCgpXG4gICAgaWYgKHNlbGZQYXRoLnRvU3RyaW5nKCkgPT09IHBhcmVudFBhdGgudG9TdHJpbmcoKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIGlmICh0aGlzLnJlZnJlbmNlc1twYXJlbnRQYXRoLnRvU3RyaW5nKCldKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVmOiB0aGlzLnJlZnJlbmNlc1twYXJlbnRQYXRoLnRvU3RyaW5nKCldLFxuICAgICAgICBwYXRoOiBGb3JtUGF0aC5wYXJzZShwYXJlbnRQYXRoLnRvU3RyaW5nKCkpXG4gICAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGF0ZXN0UGFyZW50KHBhcmVudFBhdGgpXG4gIH1cblxuICBtYXAobWFwcGVyOiAobm9kZTogTm9kZVR5cGUpID0+IGFueSkge1xuICAgIHJldHVybiBtYXAodGhpcy5ub2RlcywgbWFwcGVyKVxuICB9XG5cbiAgcmVkdWNlPFQ+KFxuICAgIHJlZHVjZXI6IChidWZmZXI6IFQsIG5vZGU6IE5vZGVUeXBlLCBrZXk6IHN0cmluZykgPT4gVCxcbiAgICBpbml0aWFsOiBUXG4gICkge1xuICAgIHJldHVybiByZWR1Y2UodGhpcy5ub2RlcywgcmVkdWNlciwgaW5pdGlhbClcbiAgfVxuXG4gIGFwcGVuZE5vZGUoXG4gICAgbm9kZTogTm9kZVR5cGUsXG4gICAgcGF0aDogRm9ybVBhdGhQYXR0ZXJuID0gJycsXG4gICAgZGF0YVBhdGg6IEZvcm1QYXRoUGF0dGVybiA9ICcnXG4gICkge1xuICAgIGNvbnN0IHNlbGZQYXRoID0gRm9ybVBhdGgucGFyc2UocGF0aClcbiAgICBjb25zdCBzZWxmRGF0YVBhdGggPSBGb3JtUGF0aC5wYXJzZShkYXRhUGF0aCB8fCBwYXRoKVxuICAgIGNvbnN0IHBhcmVudFBhdGggPSBzZWxmUGF0aC5wYXJlbnQoKVxuICAgIGNvbnN0IGRhdGFQYXJlbnRQYXRoID0gc2VsZkRhdGFQYXRoLnBhcmVudCgpXG4gICAgY29uc3QgcGFyZW50UmVmID0gdGhpcy5yZWZyZW5jZXNbcGFyZW50UGF0aC50b1N0cmluZygpXVxuICAgIGNvbnN0IGRhdGFQYXJlbnRSZWYgPSB0aGlzLnJlZnJlbmNlc1tkYXRhUGFyZW50UGF0aC50b1N0cmluZygpXVxuICAgIGNvbnN0IHNlbGZSZWY6IEZvcm1HcmFwaE5vZGVSZWYgPSB7XG4gICAgICBwYXRoOiBzZWxmUGF0aCxcbiAgICAgIGRhdGFQYXRoOiBzZWxmRGF0YVBhdGgsXG4gICAgICBjaGlsZHJlbjogW11cbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0KHNlbGZQYXRoKSkgcmV0dXJuXG4gICAgdGhpcy5ub2Rlc1tzZWxmUGF0aC50b1N0cmluZygpXSA9IG5vZGVcbiAgICB0aGlzLnJlZnJlbmNlc1tzZWxmUGF0aC50b1N0cmluZygpXSA9IHNlbGZSZWZcbiAgICB0aGlzLnJlZnJlbmNlc1tzZWxmRGF0YVBhdGgudG9TdHJpbmcoKV0gPSBzZWxmUmVmXG4gICAgdGhpcy5zaXplKytcbiAgICBpZiAocGFyZW50UmVmKSB7XG4gICAgICBwYXJlbnRSZWYuY2hpbGRyZW4ucHVzaChzZWxmUGF0aClcbiAgICAgIHNlbGZSZWYucGFyZW50ID0gcGFyZW50UmVmXG4gICAgfSBlbHNlIGlmIChkYXRhUGFyZW50UmVmKSB7XG4gICAgICBkYXRhUGFyZW50UmVmLmNoaWxkcmVuLnB1c2goc2VsZkRhdGFQYXRoKVxuICAgICAgc2VsZlJlZi5wYXJlbnQgPSBkYXRhUGFyZW50UmVmXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGxhdGVzdFBhcmVudCA9IHRoaXMuZ2V0TGF0ZXN0UGFyZW50KHNlbGZQYXRoKVxuICAgICAgY29uc3QgbGF0ZXN0RGF0YVBhcmVudCA9IHRoaXMuZ2V0TGF0ZXN0UGFyZW50KHNlbGZEYXRhUGF0aClcbiAgICAgIGlmIChsYXRlc3RQYXJlbnQpIHtcbiAgICAgICAgbGF0ZXN0UGFyZW50LnJlZi5jaGlsZHJlbi5wdXNoKHNlbGZQYXRoKVxuICAgICAgICBzZWxmUmVmLnBhcmVudCA9IGxhdGVzdFBhcmVudC5yZWZcbiAgICAgICAgdGhpcy5idWZmZXIucHVzaCh7XG4gICAgICAgICAgcGF0aDogc2VsZlBhdGgsXG4gICAgICAgICAgcmVmOiBzZWxmUmVmLFxuICAgICAgICAgIGxhdGVzdFBhcmVudDogbGF0ZXN0UGFyZW50XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGxhdGVzdERhdGFQYXJlbnQpIHtcbiAgICAgICAgbGF0ZXN0RGF0YVBhcmVudC5yZWYuY2hpbGRyZW4ucHVzaChzZWxmUGF0aClcbiAgICAgICAgc2VsZlJlZi5wYXJlbnQgPSBsYXRlc3REYXRhUGFyZW50LnJlZlxuICAgICAgICB0aGlzLmJ1ZmZlci5wdXNoKHtcbiAgICAgICAgICBwYXRoOiBzZWxmUGF0aCxcbiAgICAgICAgICByZWY6IHNlbGZSZWYsXG4gICAgICAgICAgbGF0ZXN0UGFyZW50OiBsYXRlc3REYXRhUGFyZW50XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYnVmZmVyLmZvckVhY2goKHsgcGF0aCwgcmVmLCBsYXRlc3RQYXJlbnQgfSwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgcGF0aC5wYXJlbnQoKS5tYXRjaChzZWxmUGF0aCkgfHxcbiAgICAgICAgKHNlbGZQYXRoLmluY2x1ZGVzKGxhdGVzdFBhcmVudC5wYXRoKSAmJlxuICAgICAgICAgIHBhdGguaW5jbHVkZXMoc2VsZlBhdGgpICYmXG4gICAgICAgICAgc2VsZlBhdGgudG9TdHJpbmcoKSAhPT0gcGF0aC50b1N0cmluZygpKVxuICAgICAgKSB7XG4gICAgICAgIHNlbGZSZWYuY2hpbGRyZW4ucHVzaChwYXRoKVxuICAgICAgICByZWYucGFyZW50ID0gc2VsZlJlZlxuICAgICAgICBsYXRlc3RQYXJlbnQucmVmLmNoaWxkcmVuLnNwbGljZShcbiAgICAgICAgICBsYXRlc3RQYXJlbnQucmVmLmNoaWxkcmVuLmluZGV4T2YocGF0aCksXG4gICAgICAgICAgMVxuICAgICAgICApXG4gICAgICAgIHRoaXMuYnVmZmVyLnNwbGljZShpbmRleCwgMSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMubm90aWZ5KHtcbiAgICAgIHR5cGU6ICdHUkFQSF9OT0RFX0RJRF9NT1VOVCcsXG4gICAgICBwYXlsb2FkOiBzZWxmUmVmXG4gICAgfSlcbiAgfVxuXG4gIHJlbW92ZShwYXRoOiBGb3JtUGF0aFBhdHRlcm4pIHtcbiAgICBjb25zdCBzZWxmUGF0aCA9IEZvcm1QYXRoLnBhcnNlKHBhdGgpXG4gICAgY29uc3Qgc2VsZlJlZiA9IHRoaXMucmVmcmVuY2VzW3NlbGZQYXRoLnRvU3RyaW5nKCldXG4gICAgaWYgKCFzZWxmUmVmKSByZXR1cm5cbiAgICB0aGlzLm5vdGlmeSh7XG4gICAgICB0eXBlOiAnR1JBUEhfTk9ERV9XSUxMX1VOTU9VTlQnLFxuICAgICAgcGF5bG9hZDogc2VsZlJlZlxuICAgIH0pXG4gICAgaWYgKHNlbGZSZWYuY2hpbGRyZW4pIHtcbiAgICAgIHNlbGZSZWYuY2hpbGRyZW4uZm9yRWFjaChwYXRoID0+IHtcbiAgICAgICAgdGhpcy5yZW1vdmUocGF0aClcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuYnVmZmVyID0gdGhpcy5idWZmZXIuZmlsdGVyKCh7IHJlZiB9KSA9PiB7XG4gICAgICByZXR1cm4gc2VsZlJlZiAhPT0gcmVmXG4gICAgfSlcbiAgICBkZWxldGUgdGhpcy5ub2Rlc1tzZWxmUGF0aC50b1N0cmluZygpXVxuICAgIGRlbGV0ZSB0aGlzLnJlZnJlbmNlc1tzZWxmUGF0aC50b1N0cmluZygpXVxuICAgIGRlbGV0ZSB0aGlzLnJlZnJlbmNlc1tzZWxmUmVmLmRhdGFQYXRoLnRvU3RyaW5nKCldXG4gICAgdGhpcy5zaXplLS1cbiAgICBpZiAoc2VsZlJlZi5wYXJlbnQpIHtcbiAgICAgIHNlbGZSZWYucGFyZW50LmNoaWxkcmVuLmZvckVhY2goKHBhdGgsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChwYXRoLm1hdGNoKHNlbGZQYXRoKSkge1xuICAgICAgICAgIHNlbGZSZWYucGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZXBsYWNlKHBhdGg6IEZvcm1QYXRoUGF0dGVybiwgbm9kZTogTm9kZVR5cGUpIHtcbiAgICBjb25zdCBzZWxmUGF0aCA9IEZvcm1QYXRoLnBhcnNlKHBhdGgpXG4gICAgY29uc3Qgc2VsZlJlZiA9IHRoaXMucmVmcmVuY2VzW3NlbGZQYXRoLnRvU3RyaW5nKCldXG4gICAgaWYgKCFzZWxmUmVmKSByZXR1cm5cbiAgICB0aGlzLm5vdGlmeSh7XG4gICAgICB0eXBlOiAnR1JBUEhfTk9ERV9XSUxMX1VOTU9VTlQnLFxuICAgICAgcGF5bG9hZDogc2VsZlJlZlxuICAgIH0pXG4gICAgdGhpcy5ub2Rlc1tzZWxmUGF0aC50b1N0cmluZygpXSA9IG5vZGVcbiAgICB0aGlzLm5vdGlmeSh7XG4gICAgICB0eXBlOiAnR1JBUEhfTk9ERV9ESURfTU9VTlQnLFxuICAgICAgcGF5bG9hZDogc2VsZlJlZlxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCB7IGlzRm4sIGlzU3RyLCBpc0FyciwgaXNPYmosIGVhY2gsIFN1YnNjcmliYWJsZSB9IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCB7IEZvcm1MaWZlQ3ljbGVQYXlsb2FkLCBGb3JtTGlmZUN5Y2xlSGFuZGxlciB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgY2xhc3MgRm9ybUxpZmVDeWNsZTxQYXlsb2FkID0gYW55PiB7XG4gIHByaXZhdGUgbGlzdGVuZXI6IEZvcm1MaWZlQ3ljbGVQYXlsb2FkPFBheWxvYWQ+XG5cbiAgY29uc3RydWN0b3IoaGFuZGxlcjogRm9ybUxpZmVDeWNsZUhhbmRsZXI8UGF5bG9hZD4pXG4gIGNvbnN0cnVjdG9yKHR5cGU6IHN0cmluZywgaGFuZGxlcjogRm9ybUxpZmVDeWNsZUhhbmRsZXI8UGF5bG9hZD4pXG4gIGNvbnN0cnVjdG9yKGhhbmRsZXJNYXA6IHsgW2tleTogc3RyaW5nXTogRm9ybUxpZmVDeWNsZUhhbmRsZXI8UGF5bG9hZD4gfSlcbiAgY29uc3RydWN0b3IoLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgIHRoaXMubGlzdGVuZXIgPSB0aGlzLmJ1aWxkTGlzdGVuZXIocGFyYW1zKVxuICB9XG4gIGJ1aWxkTGlzdGVuZXIocGFyYW1zOiBhbnlbXSkge1xuICAgIHJldHVybiBmdW5jdGlvbihwYXlsb2FkOiB7IHR5cGU6IHN0cmluZzsgcGF5bG9hZDogUGF5bG9hZCB9LCBjdHg6IGFueSkge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHBhcmFtcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgbGV0IGl0ZW0gPSBwYXJhbXNbaW5kZXhdXG4gICAgICAgIGlmIChpc0ZuKGl0ZW0pKSB7XG4gICAgICAgICAgaXRlbS5jYWxsKHRoaXMsIHBheWxvYWQsIGN0eClcbiAgICAgICAgfSBlbHNlIGlmIChpc1N0cihpdGVtKSAmJiBpc0ZuKHBhcmFtc1tpbmRleCArIDFdKSkge1xuICAgICAgICAgIGlmIChpdGVtID09PSBwYXlsb2FkLnR5cGUpIHtcbiAgICAgICAgICAgIHBhcmFtc1tpbmRleCArIDFdLmNhbGwodGhpcywgcGF5bG9hZC5wYXlsb2FkLCBjdHgpXG4gICAgICAgICAgfVxuICAgICAgICAgIGluZGV4KytcbiAgICAgICAgfSBlbHNlIGlmIChpc09iaihpdGVtKSkge1xuICAgICAgICAgIGVhY2goaXRlbSwgKGhhbmRsZXIsIHR5cGUpID0+IHtcbiAgICAgICAgICAgIGlmIChpc0ZuKGhhbmRsZXIpICYmIGlzU3RyKHR5cGUpKSB7XG4gICAgICAgICAgICAgIGlmICh0eXBlID09PSBwYXlsb2FkLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgcGF5bG9hZC5wYXlsb2FkLCBjdHgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5ID0gPFBheWxvYWQ+KHR5cGU6IGFueSwgcGF5bG9hZDogUGF5bG9hZCwgY3R4PzogYW55KSA9PiB7XG4gICAgaWYgKGlzU3RyKHR5cGUpKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyLmNhbGwoY3R4LCB7IHR5cGUsIHBheWxvYWQgfSwgY3R4KVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRm9ybUhlYXJ0PFBheWxvYWQgPSBhbnksIENvbnRleHQgPSBhbnk+IGV4dGVuZHMgU3Vic2NyaWJhYmxlIHtcbiAgcHJpdmF0ZSBsaWZlY3ljbGVzOiBGb3JtTGlmZUN5Y2xlPFBheWxvYWQ+W11cblxuICBwcml2YXRlIGNvbnRleHQ6IENvbnRleHRcblxuICBwcml2YXRlIGJlZm9yZU5vdGlmeT86ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZFxuXG4gIHByaXZhdGUgYWZ0ZXJOb3RpZnk/OiAoLi4uYXJnczogYW55W10pID0+IHZvaWRcblxuICBwcml2YXRlIGJhdGNoaW5nPzogYm9vbGVhblxuXG4gIHByaXZhdGUgYnVmZmVyPzogYW55W11cblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgbGlmZWN5Y2xlcyxcbiAgICBjb250ZXh0LFxuICAgIGJlZm9yZU5vdGlmeSxcbiAgICBhZnRlck5vdGlmeVxuICB9OiB7XG4gICAgbGlmZWN5Y2xlcz86IEZvcm1MaWZlQ3ljbGVbXVxuICAgIGNvbnRleHQ/OiBDb250ZXh0XG4gICAgYmVmb3JlTm90aWZ5PzogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkXG4gICAgYWZ0ZXJOb3RpZnk/OiAoLi4uYXJnczogYW55W10pID0+IHZvaWRcbiAgfSA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMubGlmZWN5Y2xlcyA9IHRoaXMuYnVpbGRMaWZlQ3ljbGVzKGxpZmVjeWNsZXMgfHwgW10pXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dFxuICAgIHRoaXMuYnVmZmVyID0gW11cbiAgICB0aGlzLmJlZm9yZU5vdGlmeSA9IGJlZm9yZU5vdGlmeVxuICAgIHRoaXMuYWZ0ZXJOb3RpZnkgPSBhZnRlck5vdGlmeVxuICB9XG5cbiAgYnVpbGRMaWZlQ3ljbGVzKGxpZmVjeWNsZXM6IEZvcm1MaWZlQ3ljbGVbXSkge1xuICAgIHJldHVybiBsaWZlY3ljbGVzLnJlZHVjZSgoYnVmLCBpdGVtKSA9PiB7XG4gICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIEZvcm1MaWZlQ3ljbGUpIHtcbiAgICAgICAgcmV0dXJuIGJ1Zi5jb25jYXQoaXRlbSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQgPSBpdGVtXG4gICAgICAgICAgcmV0dXJuIGJ1ZlxuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyKGl0ZW0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRMaWZlQ3ljbGVzKGl0ZW0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJ1ZlxuICAgICAgfVxuICAgIH0sIFtdKVxuICB9XG5cbiAgYmF0Y2ggPSAoY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgaWYgKGlzRm4oY2FsbGJhY2spKSB7XG4gICAgICB0aGlzLmJhdGNoaW5nID0gdHJ1ZVxuICAgICAgdGhpcy5idWZmZXIgPSBbXVxuICAgICAgY2FsbGJhY2soKVxuICAgICAgdGhpcy5iYXRjaGluZyA9IGZhbHNlXG4gICAgICB0aGlzLmJ1ZmZlci5mb3JFYWNoKCh7IHR5cGUsIHBheWxvYWQsIGNvbnRleHQgfSkgPT4ge1xuICAgICAgICB0aGlzLnB1Ymxpc2godHlwZSwgcGF5bG9hZCwgY29udGV4dClcbiAgICAgIH0pXG4gICAgICB0aGlzLmJ1ZmZlciA9IFtdXG4gICAgfVxuICB9XG5cbiAgcHVibGlzaCA9IDxQLCBDPih0eXBlOiBhbnksIHBheWxvYWQ6IFAsIGNvbnRleHQ/OiBDKSA9PiB7XG4gICAgaWYgKHRoaXMuYmF0Y2hpbmcpIHtcbiAgICAgIHRoaXMuYnVmZmVyLnB1c2goe1xuICAgICAgICB0eXBlLFxuICAgICAgICBwYXlsb2FkLFxuICAgICAgICBjb250ZXh0XG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChpc1N0cih0eXBlKSkge1xuICAgICAgaWYgKGlzRm4odGhpcy5iZWZvcmVOb3RpZnkpKSB7XG4gICAgICAgIHRoaXMuYmVmb3JlTm90aWZ5KHR5cGUsIHBheWxvYWQsIGNvbnRleHQpXG4gICAgICB9XG4gICAgICB0aGlzLmxpZmVjeWNsZXMuZm9yRWFjaChsaWZlY3ljbGUgPT4ge1xuICAgICAgICBsaWZlY3ljbGUubm90aWZ5KHR5cGUsIHBheWxvYWQsIGNvbnRleHQgfHwgdGhpcy5jb250ZXh0KVxuICAgICAgfSlcbiAgICAgIHRoaXMubm90aWZ5KHtcbiAgICAgICAgdHlwZSxcbiAgICAgICAgcGF5bG9hZFxuICAgICAgfSlcbiAgICAgIGlmIChpc0ZuKHRoaXMuYWZ0ZXJOb3RpZnkpKSB7XG4gICAgICAgIHRoaXMuYWZ0ZXJOb3RpZnkodHlwZSwgcGF5bG9hZCwgY29udGV4dClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImZ1bmN0aW9uIHQodCl7Zm9yKHZhciBuPWFyZ3VtZW50cy5sZW5ndGgscj1BcnJheShuPjE/bi0xOjApLGU9MTtlPG47ZSsrKXJbZS0xXT1hcmd1bWVudHNbZV07dGhyb3cgRXJyb3IoXCJbSW1tZXJdIG1pbmlmaWVkIGVycm9yIG5yOiBcIit0KyhyLmxlbmd0aD9cIiBcIityLmpvaW4oXCIsXCIpOlwiXCIpK1wiLiBGaW5kIHRoZSBmdWxsIGVycm9yIGF0OiBodHRwczovL2JpdC5seS8zY1hFS1dmXCIpfWZ1bmN0aW9uIG4odCl7cmV0dXJuISF0JiYhIXRbcV19ZnVuY3Rpb24gcih0KXtyZXR1cm4hIXQmJihmdW5jdGlvbih0KXtpZighdHx8XCJvYmplY3RcIiE9dHlwZW9mIHQpcmV0dXJuITE7dmFyIG49T2JqZWN0LmdldFByb3RvdHlwZU9mKHQpO3JldHVybiFufHxuPT09T2JqZWN0LnByb3RvdHlwZX0odCl8fEFycmF5LmlzQXJyYXkodCl8fCEhdFtYXXx8ISF0LmNvbnN0cnVjdG9yW1hdfHxhKHQpfHxjKHQpKX1mdW5jdGlvbiBlKHQsbixyKXt2b2lkIDA9PT1yJiYocj0hMSksMD09PWkodCk/KHI/T2JqZWN0LmtleXM6RykodCkuZm9yRWFjaCgoZnVuY3Rpb24ocil7cmV0dXJuIG4ocix0W3JdLHQpfSkpOnQuZm9yRWFjaCgoZnVuY3Rpb24ocixlKXtyZXR1cm4gbihlLHIsdCl9KSl9ZnVuY3Rpb24gaSh0KXt2YXIgbj10W3FdO3JldHVybiBuP24udD4zP24udC00Om4udDpBcnJheS5pc0FycmF5KHQpPzE6YSh0KT8yOmModCk/MzowfWZ1bmN0aW9uIHUodCxuKXtyZXR1cm4gMj09PWkodCk/dC5oYXMobik6T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbil9ZnVuY3Rpb24gbyh0LG4pe3JldHVybiAyPT09aSh0KT90LmdldChuKTp0W25dfWZ1bmN0aW9uIGYodCxuKXtyZXR1cm4gdD09PW4/MCE9PXR8fDEvdD09MS9uOnQhPXQmJm4hPW59ZnVuY3Rpb24gYSh0KXtyZXR1cm4gJCYmdCBpbnN0YW5jZW9mIE1hcH1mdW5jdGlvbiBjKHQpe3JldHVybiBDJiZ0IGluc3RhbmNlb2YgU2V0fWZ1bmN0aW9uIHModCl7cmV0dXJuIHQuaXx8dC51fWZ1bmN0aW9uIHYobixyKXtpZih2b2lkIDA9PT1yJiYocj0hMSksQXJyYXkuaXNBcnJheShuKSlyZXR1cm4gbi5zbGljZSgpO3ZhciBpPU9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKG4pKTtyZXR1cm4gZShuLChmdW5jdGlvbihlKXtpZihlIT09cSl7dmFyIHU9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuLGUpLG89dS52YWx1ZTt1LmdldCYmKHJ8fHQoMSksbz11LmdldC5jYWxsKG4pKSx1LmVudW1lcmFibGU/aVtlXT1vOk9iamVjdC5kZWZpbmVQcm9wZXJ0eShpLGUse3ZhbHVlOm8sd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9fSkpLGl9ZnVuY3Rpb24gcCh0LHUpe24odCl8fGwodCl8fCFyKHQpfHwoaSh0KT4xJiYodC5zZXQ9dC5hZGQ9dC5jbGVhcj10LmRlbGV0ZT1oKSxPYmplY3QuZnJlZXplKHQpLHUmJmUodCwoZnVuY3Rpb24odCxuKXtyZXR1cm4gcChuLCEwKX0pLCEwKSl9ZnVuY3Rpb24gaCgpe3QoMil9ZnVuY3Rpb24gbCh0KXtyZXR1cm4gbnVsbD09dHx8XCJvYmplY3RcIiE9dHlwZW9mIHR8fE9iamVjdC5pc0Zyb3plbih0KX1mdW5jdGlvbiBkKG4pe3ZhciByPUhbbl07cmV0dXJuIHJ8fHQoMTksbikscn1mdW5jdGlvbiBfKHQsbil7SFt0XT1ufWZ1bmN0aW9uIHkoKXtyZXR1cm4gS31mdW5jdGlvbiBiKHQsbil7biYmKGQoXCJQYXRjaGVzXCIpLHQubz1bXSx0LnM9W10sdC52PW4pfWZ1bmN0aW9uIG0odCl7aih0KSx0LnAuZm9yRWFjaCh4KSx0LnA9bnVsbH1mdW5jdGlvbiBqKHQpe3Q9PT1LJiYoSz10LmgpfWZ1bmN0aW9uIE8odCl7cmV0dXJuIEs9e3A6W10saDpLLGw6dCxfOiEwLG06MH19ZnVuY3Rpb24geCh0KXt2YXIgbj10W3FdOzA9PT1uLnR8fDE9PT1uLnQ/bi5qKCk6bi5PPSEwfWZ1bmN0aW9uIFMobixlKXtlLm09ZS5wLmxlbmd0aDt2YXIgaT1lLnBbMF0sdT12b2lkIDAhPT1uJiZuIT09aTtyZXR1cm4gZS5sLlN8fGQoXCJFUzVcIikuUChlLG4sdSksdT8oaVtxXS5NJiYobShlKSx0KDQpKSxyKG4pJiYobj13KGUsbiksZS5ofHxNKGUsbikpLGUubyYmZChcIlBhdGNoZXNcIikuZyhpW3FdLG4sZS5vLGUucykpOm49dyhlLGksW10pLG0oZSksZS5vJiZlLnYoZS5vLGUucyksbiE9PVc/bjp2b2lkIDB9ZnVuY3Rpb24gdyh0LG4scil7aWYobChuKSlyZXR1cm4gbjt2YXIgaT1uW3FdO2lmKCFpKXJldHVybiBlKG4sKGZ1bmN0aW9uKGUsdSl7cmV0dXJuIFAodCxpLG4sZSx1LHIpfSksITApLG47aWYoaS5BIT09dClyZXR1cm4gbjtpZighaS5NKXJldHVybiBNKHQsaS51LCEwKSxpLnU7aWYoIWkuUil7aS5SPSEwLGkuQS5tLS07dmFyIHU9ND09PWkudHx8NT09PWkudD9pLmk9dihpLmssITApOmkuaTtlKHUsKGZ1bmN0aW9uKG4sZSl7cmV0dXJuIFAodCxpLHUsbixlLHIpfSkpLE0odCx1LCExKSxyJiZ0Lm8mJmQoXCJQYXRjaGVzXCIpLkYoaSxyLHQubyx0LnMpfXJldHVybiBpLml9ZnVuY3Rpb24gUCh0LGUsYSxjLHMsdil7aWYobihzKSl7dmFyIHA9dyh0LHMsdiYmZSYmMyE9PWUudCYmIXUoZS5ELGMpP3YuY29uY2F0KGMpOnZvaWQgMCk7aWYobD1jLGQ9cCwyPT09KF89aShoPWEpKT9oLnNldChsLGQpOjM9PT1fPyhoLmRlbGV0ZShsKSxoLmFkZChkKSk6aFtsXT1kLCFuKHApKXJldHVybjt0Ll89ITF9dmFyIGgsbCxkLF87aWYoKCFlfHwhZihzLG8oZS51LGMpKSkmJnIocykpe2lmKCF0LmwuSiYmdC5tPDEpcmV0dXJuO3codCxzKSxlJiZlLkEuaHx8TSh0LHMpfX1mdW5jdGlvbiBNKHQsbixyKXt2b2lkIDA9PT1yJiYocj0hMSksdC5sLkomJnQuXyYmcChuLHIpfWZ1bmN0aW9uIGcodCxuKXt2YXIgcj10W3FdLGU9UmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iocj9zKHIpOnQsbik7cmV0dXJuIGUmJmUudmFsdWV9ZnVuY3Rpb24gQSh0KXtpZighdC5NKXtpZih0Lk09ITAsMD09PXQudHx8MT09PXQudCl7dmFyIG49dC5pPXYodC51KTtlKHQucCwoZnVuY3Rpb24odCxyKXtuW3RdPXJ9KSksdC5wPXZvaWQgMH10LmgmJkEodC5oKX19ZnVuY3Rpb24geih0KXt0Lml8fCh0Lmk9dih0LnUpKX1mdW5jdGlvbiBFKHQsbixyKXt2YXIgZT1hKG4pP2QoXCJNYXBTZXRcIikuSyhuLHIpOmMobik/ZChcIk1hcFNldFwiKS5OKG4scik6dC5TP2Z1bmN0aW9uKHQsbil7dmFyIHI9QXJyYXkuaXNBcnJheSh0KSxlPXt0OnI/MTowLEE6bj9uLkE6eSgpLE06ITEsUjohMSxEOnt9LGg6bix1OnQsazpudWxsLHA6e30saTpudWxsLGo6bnVsbCwkOiExfSxpPWUsdT1MO3ImJihpPVtlXSx1PVEpO3ZhciBvPVByb3h5LnJldm9jYWJsZShpLHUpLGY9by5yZXZva2UsYT1vLnByb3h5O3JldHVybiBlLms9YSxlLmo9ZixhfShuLHIpOmQoXCJFUzVcIikuQyhuLHIpO3JldHVybihyP3IuQTp5KCkpLnAucHVzaChlKSxlfWZ1bmN0aW9uIFIodCxuKXt0LlM/QShuKTpkKFwiRVM1XCIpLkkobil9ZnVuY3Rpb24gaygpe2Z1bmN0aW9uIGkodCxuKXt2YXIgcj10W3FdO2lmKHImJiFyLlcpe3IuVz0hMDt2YXIgZT10W25dO3JldHVybiByLlc9ITEsZX1yZXR1cm4gdFtuXX1mdW5jdGlvbiBvKHQpe3QuTXx8KHQuTT0hMCx0LmgmJm8odC5oKSl9ZnVuY3Rpb24gYSh0KXt0Lml8fCh0Lmk9Yyh0LnUpKX1mdW5jdGlvbiBjKHQpe3ZhciBuPXQmJnRbcV07aWYobil7bi5XPSEwO3ZhciByPXYobi5rLCEwKTtyZXR1cm4gbi5XPSExLHJ9cmV0dXJuIHYodCl9ZnVuY3Rpb24gcCh0KXtmb3IodmFyIG49dC5sZW5ndGgtMTtuPj0wO24tLSl7dmFyIHI9dFtuXVtxXTtpZighci5NKXN3aXRjaChyLnQpe2Nhc2UgNTpsKHIpJiZvKHIpO2JyZWFrO2Nhc2UgNDpoKHIpJiZvKHIpfX19ZnVuY3Rpb24gaCh0KXtmb3IodmFyIG49dC51LHI9dC5rLGU9T2JqZWN0LmtleXMociksaT1lLmxlbmd0aC0xO2k+PTA7aS0tKXt2YXIgbz1lW2ldLGE9bltvXTtpZih2b2lkIDA9PT1hJiYhdShuLG8pKXJldHVybiEwO3ZhciBjPXJbb10scz1jJiZjW3FdO2lmKHM/cy51IT09YTohZihjLGEpKXJldHVybiEwfXJldHVybiBlLmxlbmd0aCE9PU9iamVjdC5rZXlzKG4pLmxlbmd0aH1mdW5jdGlvbiBsKHQpe3ZhciBuPXQuaztpZihuLmxlbmd0aCE9PXQudS5sZW5ndGgpcmV0dXJuITA7dmFyIHI9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuLG4ubGVuZ3RoLTEpO3JldHVybiEoIXJ8fHIuZ2V0KX1mdW5jdGlvbiBkKG4pe24uTyYmdCgzLEpTT04uc3RyaW5naWZ5KHMobikpKX12YXIgYj17fTtfKFwiRVM1XCIse0M6ZnVuY3Rpb24odCxuKXt2YXIgdT1BcnJheS5pc0FycmF5KHQpLHY9Yyh0KTtlKHYsKGZ1bmN0aW9uKG4peyFmdW5jdGlvbih0LG4sZSl7dmFyIHU9YltuXTt1P3UuZW51bWVyYWJsZT1lOmJbbl09dT17ZW51bWVyYWJsZTplLGdldDpmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0LG4pe2QodCk7dmFyIGU9aShzKHQpLG4pO3JldHVybiB0Llc/ZTplPT09aSh0LnUsbikmJnIoZSk/KGEodCksdC5pW25dPUUodC5BLmwsZSx0KSk6ZX0odGhpc1txXSxuKX0sc2V0OmZ1bmN0aW9uKHQpeyFmdW5jdGlvbih0LG4scil7aWYoZCh0KSx0LkRbbl09ITAsIXQuTSl7aWYoZihyLGkocyh0KSxuKSkpcmV0dXJuO28odCksYSh0KX10Lmlbbl09cn0odGhpc1txXSxuLHQpfX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsbix1KX0odixuLHV8fGZ1bmN0aW9uKHQsbil7dmFyIHI9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG4pO3JldHVybiEoIXJ8fCFyLmVudW1lcmFibGUpfSh0LG4pKX0pKTt2YXIgcD17dDp1PzU6NCxBOm4/bi5BOnkoKSxNOiExLFc6ITEsUjohMSxEOnt9LGg6bix1OnQsazp2LGk6bnVsbCxPOiExLCQ6ITF9O3JldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkodixxLHt2YWx1ZTpwLHdyaXRhYmxlOiEwfSksdn0sSTpvLFA6ZnVuY3Rpb24odCxyLGkpe3QucC5mb3JFYWNoKChmdW5jdGlvbih0KXt0W3FdLlc9ITB9KSksaT9uKHIpJiZyW3FdLkE9PT10JiZwKHQucCk6KHQubyYmZnVuY3Rpb24gdChuKXtpZihuJiZcIm9iamVjdFwiPT10eXBlb2Ygbil7dmFyIHI9bltxXTtpZihyKXt2YXIgaT1yLnUsZj1yLmssYT1yLkQsYz1yLnQ7aWYoND09PWMpZShmLChmdW5jdGlvbihuKXtuIT09cSYmKHZvaWQgMCE9PWlbbl18fHUoaSxuKT9hW25dfHx0KGZbbl0pOihhW25dPSEwLG8ocikpKX0pKSxlKGksKGZ1bmN0aW9uKHQpe3ZvaWQgMCE9PWZbdF18fHUoZix0KXx8KGFbdF09ITEsbyhyKSl9KSk7ZWxzZSBpZig1PT09Yyl7aWYobChyKSYmKG8ociksYS5sZW5ndGg9ITApLGYubGVuZ3RoPGkubGVuZ3RoKWZvcih2YXIgcz1mLmxlbmd0aDtzPGkubGVuZ3RoO3MrKylhW3NdPSExO2Vsc2UgZm9yKHZhciB2PWkubGVuZ3RoO3Y8Zi5sZW5ndGg7disrKWFbdl09ITA7Zm9yKHZhciBwPU1hdGgubWluKGYubGVuZ3RoLGkubGVuZ3RoKSxoPTA7aDxwO2grKyl2b2lkIDA9PT1hW2hdJiZ0KGZbaF0pfX19fSh0LnBbMF0pLHAodC5wKSl9fSl9ZnVuY3Rpb24gRigpe2Z1bmN0aW9uIHIodCl7aWYoIXR8fFwib2JqZWN0XCIhPXR5cGVvZiB0KXJldHVybiB0O2lmKEFycmF5LmlzQXJyYXkodCkpcmV0dXJuIHQubWFwKHIpO2lmKGEodCkpcmV0dXJuIG5ldyBNYXAoQXJyYXkuZnJvbSh0LmVudHJpZXMoKSkubWFwKChmdW5jdGlvbih0KXtyZXR1cm5bdFswXSxyKHRbMV0pXX0pKSk7aWYoYyh0KSlyZXR1cm4gbmV3IFNldChBcnJheS5mcm9tKHQpLm1hcChyKSk7dmFyIG49T2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YodCkpO2Zvcih2YXIgZSBpbiB0KW5bZV09cih0W2VdKTtyZXR1cm4gbn1mdW5jdGlvbiBmKHQpe3JldHVybiBuKHQpP3IodCk6dH12YXIgcz1cImFkZFwiO18oXCJQYXRjaGVzXCIse1g6ZnVuY3Rpb24obixlKXtyZXR1cm4gZS5mb3JFYWNoKChmdW5jdGlvbihlKXtmb3IodmFyIHU9ZS5wYXRoLGY9ZS5vcCxhPW4sYz0wO2M8dS5sZW5ndGgtMTtjKyspXCJvYmplY3RcIiE9dHlwZW9mKGE9byhhLHVbY10pKSYmdCgxNSx1LmpvaW4oXCIvXCIpKTt2YXIgdj1pKGEpLHA9cihlLnZhbHVlKSxoPXVbdS5sZW5ndGgtMV07c3dpdGNoKGYpe2Nhc2VcInJlcGxhY2VcIjpzd2l0Y2godil7Y2FzZSAyOnJldHVybiBhLnNldChoLHApO2Nhc2UgMzp0KDE2KTtkZWZhdWx0OnJldHVybiBhW2hdPXB9Y2FzZSBzOnN3aXRjaCh2KXtjYXNlIDE6cmV0dXJuIGEuc3BsaWNlKGgsMCxwKTtjYXNlIDI6cmV0dXJuIGEuc2V0KGgscCk7Y2FzZSAzOnJldHVybiBhLmFkZChwKTtkZWZhdWx0OnJldHVybiBhW2hdPXB9Y2FzZVwicmVtb3ZlXCI6c3dpdGNoKHYpe2Nhc2UgMTpyZXR1cm4gYS5zcGxpY2UoaCwxKTtjYXNlIDI6cmV0dXJuIGEuZGVsZXRlKGgpO2Nhc2UgMzpyZXR1cm4gYS5kZWxldGUoZS52YWx1ZSk7ZGVmYXVsdDpyZXR1cm4gZGVsZXRlIGFbaF19ZGVmYXVsdDp0KDE3LGYpfX0pKSxufSxGOmZ1bmN0aW9uKHQsbixyLGkpe3N3aXRjaCh0LnQpe2Nhc2UgMDpjYXNlIDQ6Y2FzZSAyOnJldHVybiBmdW5jdGlvbih0LG4scixpKXt2YXIgYT10LnUsYz10Lmk7ZSh0LkQsKGZ1bmN0aW9uKHQsZSl7dmFyIHY9byhhLHQpLHA9byhjLHQpLGg9ZT91KGEsdCk/XCJyZXBsYWNlXCI6czpcInJlbW92ZVwiO2lmKHYhPT1wfHxcInJlcGxhY2VcIiE9PWgpe3ZhciBsPW4uY29uY2F0KHQpO3IucHVzaChcInJlbW92ZVwiPT09aD97b3A6aCxwYXRoOmx9OntvcDpoLHBhdGg6bCx2YWx1ZTpwfSksaS5wdXNoKGg9PT1zP3tvcDpcInJlbW92ZVwiLHBhdGg6bH06XCJyZW1vdmVcIj09PWg/e29wOnMscGF0aDpsLHZhbHVlOmYodil9OntvcDpcInJlcGxhY2VcIixwYXRoOmwsdmFsdWU6Zih2KX0pfX0pKX0odCxuLHIsaSk7Y2FzZSA1OmNhc2UgMTpyZXR1cm4gZnVuY3Rpb24odCxuLHIsZSl7dmFyIGk9dC51LHU9dC5ELG89dC5pO2lmKG8ubGVuZ3RoPGkubGVuZ3RoKXt2YXIgYT1bbyxpXTtpPWFbMF0sbz1hWzFdO3ZhciBjPVtlLHJdO3I9Y1swXSxlPWNbMV19Zm9yKHZhciB2PW8ubGVuZ3RoLWkubGVuZ3RoLHA9MDtpW3BdPT09b1twXSYmcDxpLmxlbmd0aDspKytwO2Zvcih2YXIgaD1pLmxlbmd0aDtoPnAmJmlbaC0xXT09PW9baCt2LTFdOyktLWg7Zm9yKHZhciBsPXA7bDxoOysrbClpZih1W2xdJiZvW2xdIT09aVtsXSl7dmFyIGQ9bi5jb25jYXQoW2xdKTtyLnB1c2goe29wOlwicmVwbGFjZVwiLHBhdGg6ZCx2YWx1ZTpmKG9bbF0pfSksZS5wdXNoKHtvcDpcInJlcGxhY2VcIixwYXRoOmQsdmFsdWU6ZihpW2xdKX0pfWZvcih2YXIgXz1yLmxlbmd0aCx5PWgrdi0xO3k+PWg7LS15KXt2YXIgYj1uLmNvbmNhdChbeV0pO3JbXyt5LWhdPXtvcDpzLHBhdGg6Yix2YWx1ZTpmKG9beV0pfSxlLnB1c2goe29wOlwicmVtb3ZlXCIscGF0aDpifSl9fSh0LG4scixpKTtjYXNlIDM6cmV0dXJuIGZ1bmN0aW9uKHQsbixyLGUpe3ZhciBpPXQudSx1PXQuaSxvPTA7aS5mb3JFYWNoKChmdW5jdGlvbih0KXtpZighdS5oYXModCkpe3ZhciBpPW4uY29uY2F0KFtvXSk7ci5wdXNoKHtvcDpcInJlbW92ZVwiLHBhdGg6aSx2YWx1ZTp0fSksZS51bnNoaWZ0KHtvcDpzLHBhdGg6aSx2YWx1ZTp0fSl9bysrfSkpLG89MCx1LmZvckVhY2goKGZ1bmN0aW9uKHQpe2lmKCFpLmhhcyh0KSl7dmFyIHU9bi5jb25jYXQoW29dKTtyLnB1c2goe29wOnMscGF0aDp1LHZhbHVlOnR9KSxlLnVuc2hpZnQoe29wOlwicmVtb3ZlXCIscGF0aDp1LHZhbHVlOnR9KX1vKyt9KSl9KHQsbixyLGkpfX0sZzpmdW5jdGlvbih0LG4scixlKXtyLnB1c2goe29wOlwicmVwbGFjZVwiLHBhdGg6W10sdmFsdWU6bn0pLGUucHVzaCh7b3A6XCJyZXBsYWNlXCIscGF0aDpbXSx2YWx1ZTp0LnV9KX19KX1mdW5jdGlvbiBEKCl7ZnVuY3Rpb24gbih0LG4pe2Z1bmN0aW9uIHIoKXt0aGlzLmNvbnN0cnVjdG9yPXR9byh0LG4pLHQucHJvdG90eXBlPShyLnByb3RvdHlwZT1uLnByb3RvdHlwZSxuZXcgcil9ZnVuY3Rpb24gZSh0KXt0Lml8fCh0LkQ9bmV3IE1hcCx0Lmk9bmV3IE1hcCh0LnUpKX1mdW5jdGlvbiBpKHQpe3QuaXx8KHQuaT1uZXcgU2V0LHQudS5mb3JFYWNoKChmdW5jdGlvbihuKXtpZihyKG4pKXt2YXIgZT1FKHQuQS5sLG4sdCk7dC5wLnNldChuLGUpLHQuaS5hZGQoZSl9ZWxzZSB0LmkuYWRkKG4pfSkpKX1mdW5jdGlvbiB1KG4pe24uTyYmdCgzLEpTT04uc3RyaW5naWZ5KHMobikpKX12YXIgbz1mdW5jdGlvbih0LG4pe3JldHVybihvPU9iamVjdC5zZXRQcm90b3R5cGVPZnx8e19fcHJvdG9fXzpbXX1pbnN0YW5jZW9mIEFycmF5JiZmdW5jdGlvbih0LG4pe3QuX19wcm90b19fPW59fHxmdW5jdGlvbih0LG4pe2Zvcih2YXIgciBpbiBuKW4uaGFzT3duUHJvcGVydHkocikmJih0W3JdPW5bcl0pfSkodCxuKX0sZj1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxuKXtyZXR1cm4gdGhpc1txXT17dDoyLGg6bixBOm4/bi5BOnkoKSxNOiExLFI6ITEsaTp2b2lkIDAsRDp2b2lkIDAsdTp0LGs6dGhpcywkOiExLE86ITF9LHRoaXN9bih0LE1hcCk7dmFyIGk9dC5wcm90b3R5cGU7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpLFwic2l6ZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcyh0aGlzW3FdKS5zaXplfX0pLGkuaGFzPWZ1bmN0aW9uKHQpe3JldHVybiBzKHRoaXNbcV0pLmhhcyh0KX0saS5zZXQ9ZnVuY3Rpb24odCxuKXt2YXIgcj10aGlzW3FdO3JldHVybiB1KHIpLHMocikuZ2V0KHQpIT09biYmKGUociksUihyLkEubCxyKSxyLkQuc2V0KHQsITApLHIuaS5zZXQodCxuKSxyLkQuc2V0KHQsITApKSx0aGlzfSxpLmRlbGV0ZT1mdW5jdGlvbih0KXtpZighdGhpcy5oYXModCkpcmV0dXJuITE7dmFyIG49dGhpc1txXTtyZXR1cm4gdShuKSxlKG4pLFIobi5BLmwsbiksbi5ELnNldCh0LCExKSxuLmkuZGVsZXRlKHQpLCEwfSxpLmNsZWFyPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpc1txXTtyZXR1cm4gdSh0KSxlKHQpLFIodC5BLmwsdCksdC5EPW5ldyBNYXAsdC5pLmNsZWFyKCl9LGkuZm9yRWFjaD1mdW5jdGlvbih0LG4pe3ZhciByPXRoaXM7cyh0aGlzW3FdKS5mb3JFYWNoKChmdW5jdGlvbihlLGkpe3QuY2FsbChuLHIuZ2V0KGkpLGkscil9KSl9LGkuZ2V0PWZ1bmN0aW9uKHQpe3ZhciBuPXRoaXNbcV07dShuKTt2YXIgaT1zKG4pLmdldCh0KTtpZihuLlJ8fCFyKGkpKXJldHVybiBpO2lmKGkhPT1uLnUuZ2V0KHQpKXJldHVybiBpO3ZhciBvPUUobi5BLmwsaSxuKTtyZXR1cm4gZShuKSxuLmkuc2V0KHQsbyksb30saS5rZXlzPWZ1bmN0aW9uKCl7cmV0dXJuIHModGhpc1txXSkua2V5cygpfSxpLnZhbHVlcz1mdW5jdGlvbigpe3ZhciB0LG49dGhpcyxyPXRoaXMua2V5cygpO3JldHVybih0PXt9KVtCXT1mdW5jdGlvbigpe3JldHVybiBuLnZhbHVlcygpfSx0Lm5leHQ9ZnVuY3Rpb24oKXt2YXIgdD1yLm5leHQoKTtyZXR1cm4gdC5kb25lP3Q6e2RvbmU6ITEsdmFsdWU6bi5nZXQodC52YWx1ZSl9fSx0fSxpLmVudHJpZXM9ZnVuY3Rpb24oKXt2YXIgdCxuPXRoaXMscj10aGlzLmtleXMoKTtyZXR1cm4odD17fSlbQl09ZnVuY3Rpb24oKXtyZXR1cm4gbi5lbnRyaWVzKCl9LHQubmV4dD1mdW5jdGlvbigpe3ZhciB0PXIubmV4dCgpO2lmKHQuZG9uZSlyZXR1cm4gdDt2YXIgZT1uLmdldCh0LnZhbHVlKTtyZXR1cm57ZG9uZTohMSx2YWx1ZTpbdC52YWx1ZSxlXX19LHR9LGlbQl09ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbnRyaWVzKCl9LHR9KCksYT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxuKXtyZXR1cm4gdGhpc1txXT17dDozLGg6bixBOm4/bi5BOnkoKSxNOiExLFI6ITEsaTp2b2lkIDAsdTp0LGs6dGhpcyxwOm5ldyBNYXAsTzohMSwkOiExfSx0aGlzfW4odCxTZXQpO3ZhciByPXQucHJvdG90eXBlO3JldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocixcInNpemVcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHModGhpc1txXSkuc2l6ZX19KSxyLmhhcz1mdW5jdGlvbih0KXt2YXIgbj10aGlzW3FdO3JldHVybiB1KG4pLG4uaT8hIW4uaS5oYXModCl8fCEoIW4ucC5oYXModCl8fCFuLmkuaGFzKG4ucC5nZXQodCkpKTpuLnUuaGFzKHQpfSxyLmFkZD1mdW5jdGlvbih0KXt2YXIgbj10aGlzW3FdO3JldHVybiB1KG4pLHRoaXMuaGFzKHQpfHwoaShuKSxSKG4uQS5sLG4pLG4uaS5hZGQodCkpLHRoaXN9LHIuZGVsZXRlPWZ1bmN0aW9uKHQpe2lmKCF0aGlzLmhhcyh0KSlyZXR1cm4hMTt2YXIgbj10aGlzW3FdO3JldHVybiB1KG4pLGkobiksUihuLkEubCxuKSxuLmkuZGVsZXRlKHQpfHwhIW4ucC5oYXModCkmJm4uaS5kZWxldGUobi5wLmdldCh0KSl9LHIuY2xlYXI9ZnVuY3Rpb24oKXt2YXIgdD10aGlzW3FdO3JldHVybiB1KHQpLGkodCksUih0LkEubCx0KSx0LmkuY2xlYXIoKX0sci52YWx1ZXM9ZnVuY3Rpb24oKXt2YXIgdD10aGlzW3FdO3JldHVybiB1KHQpLGkodCksdC5pLnZhbHVlcygpfSxyLmVudHJpZXM9ZnVuY3Rpb24oKXt2YXIgdD10aGlzW3FdO3JldHVybiB1KHQpLGkodCksdC5pLmVudHJpZXMoKX0sci5rZXlzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmFsdWVzKCl9LHJbQl09ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZXMoKX0sci5mb3JFYWNoPWZ1bmN0aW9uKHQsbil7Zm9yKHZhciByPXRoaXMudmFsdWVzKCksZT1yLm5leHQoKTshZS5kb25lOyl0LmNhbGwobixlLnZhbHVlLGUudmFsdWUsdGhpcyksZT1yLm5leHQoKX0sdH0oKTtfKFwiTWFwU2V0XCIse0s6ZnVuY3Rpb24odCxuKXtyZXR1cm4gbmV3IGYodCxuKX0sTjpmdW5jdGlvbih0LG4pe3JldHVybiBuZXcgYSh0LG4pfX0pfXZhciBKO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBLLE49XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbChcInhcIiksJD1cInVuZGVmaW5lZFwiIT10eXBlb2YgTWFwLEM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFNldCxJPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBQcm94eSYmdm9pZCAwIT09UHJveHkucmV2b2NhYmxlJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgUmVmbGVjdCxXPU4/U3ltYm9sKFwiaW1tZXItbm90aGluZ1wiKTooKEo9e30pW1wiaW1tZXItbm90aGluZ1wiXT0hMCxKKSxYPU4/U3ltYm9sKFwiaW1tZXItZHJhZnRhYmxlXCIpOlwiX18kaW1tZXJfZHJhZnRhYmxlXCIscT1OP1N5bWJvbChcImltbWVyLXN0YXRlXCIpOlwiX18kaW1tZXJfc3RhdGVcIixCPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5pdGVyYXRvcnx8XCJAQGl0ZXJhdG9yXCIsRz1cInVuZGVmaW5lZFwiIT10eXBlb2YgUmVmbGVjdCYmUmVmbGVjdC5vd25LZXlzP1JlZmxlY3Qub3duS2V5czp2b2lkIDAhPT1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzP2Z1bmN0aW9uKHQpe3JldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0KS5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh0KSl9Ok9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLEg9e30sTD17Z2V0OmZ1bmN0aW9uKHQsbil7aWYobj09PXEpcmV0dXJuIHQ7dmFyIGU9dC5wO2lmKCF0Lk0mJnUoZSxuKSlyZXR1cm4gZVtuXTt2YXIgaT1zKHQpW25dO2lmKHQuUnx8IXIoaSkpcmV0dXJuIGk7aWYodC5NKXtpZihpIT09Zyh0LnUsbikpcmV0dXJuIGk7ZT10Lml9cmV0dXJuIGVbbl09RSh0LkEubCxpLHQpfSxoYXM6ZnVuY3Rpb24odCxuKXtyZXR1cm4gbiBpbiBzKHQpfSxvd25LZXlzOmZ1bmN0aW9uKHQpe3JldHVybiBSZWZsZWN0Lm93bktleXMocyh0KSl9LHNldDpmdW5jdGlvbih0LG4scil7aWYoIXQuTSl7dmFyIGU9Zyh0LnUsbik7aWYocj9mKGUscil8fHI9PT10LnBbbl06ZihlLHIpJiZuIGluIHQudSlyZXR1cm4hMDt6KHQpLEEodCl9cmV0dXJuIHQuRFtuXT0hMCx0Lmlbbl09ciwhMH0sZGVsZXRlUHJvcGVydHk6ZnVuY3Rpb24odCxuKXtyZXR1cm4gdm9pZCAwIT09Zyh0LnUsbil8fG4gaW4gdC51Pyh0LkRbbl09ITEseih0KSxBKHQpKTp0LkRbbl0mJmRlbGV0ZSB0LkRbbl0sdC5pJiZkZWxldGUgdC5pW25dLCEwfSxnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ZnVuY3Rpb24odCxuKXt2YXIgcj1zKHQpLGU9UmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocixuKTtyZXR1cm4gZSYmKGUud3JpdGFibGU9ITAsZS5jb25maWd1cmFibGU9MSE9PXQudHx8XCJsZW5ndGhcIiE9PW4pLGV9LGRlZmluZVByb3BlcnR5OmZ1bmN0aW9uKCl7dCgxMSl9LGdldFByb3RvdHlwZU9mOmZ1bmN0aW9uKHQpe3JldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YodC51KX0sc2V0UHJvdG90eXBlT2Y6ZnVuY3Rpb24oKXt0KDEyKX19LFE9e307ZShMLChmdW5jdGlvbih0LG4pe1FbdF09ZnVuY3Rpb24oKXtyZXR1cm4gYXJndW1lbnRzWzBdPWFyZ3VtZW50c1swXVswXSxuLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19KSksUS5kZWxldGVQcm9wZXJ0eT1mdW5jdGlvbih0LG4pe3JldHVybiBMLmRlbGV0ZVByb3BlcnR5LmNhbGwodGhpcyx0WzBdLG4pfSxRLnNldD1mdW5jdGlvbih0LG4scil7cmV0dXJuIEwuc2V0LmNhbGwodGhpcyx0WzBdLG4scix0WzBdKX07dmFyIFQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpe3RoaXMuUz1JLHRoaXMuSj0hMSxcImJvb2xlYW5cIj09dHlwZW9mKG51bGw9PXQ/dm9pZCAwOnQudXNlUHJveGllcykmJnRoaXMuc2V0VXNlUHJveGllcyh0LnVzZVByb3hpZXMpLFwiYm9vbGVhblwiPT10eXBlb2YobnVsbD09dD92b2lkIDA6dC5hdXRvRnJlZXplKSYmdGhpcy5zZXRBdXRvRnJlZXplKHQuYXV0b0ZyZWV6ZSksdGhpcy5wcm9kdWNlPXRoaXMucHJvZHVjZS5iaW5kKHRoaXMpLHRoaXMucHJvZHVjZVdpdGhQYXRjaGVzPXRoaXMucHJvZHVjZVdpdGhQYXRjaGVzLmJpbmQodGhpcyl9dmFyIGk9ZS5wcm90b3R5cGU7cmV0dXJuIGkucHJvZHVjZT1mdW5jdGlvbihuLGUsaSl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmXCJmdW5jdGlvblwiIT10eXBlb2YgZSl7dmFyIHU9ZTtlPW47dmFyIG89dGhpcztyZXR1cm4gZnVuY3Rpb24odCl7dmFyIG49dGhpczt2b2lkIDA9PT10JiYodD11KTtmb3IodmFyIHI9YXJndW1lbnRzLmxlbmd0aCxpPUFycmF5KHI+MT9yLTE6MCksZj0xO2Y8cjtmKyspaVtmLTFdPWFyZ3VtZW50c1tmXTtyZXR1cm4gby5wcm9kdWNlKHQsKGZ1bmN0aW9uKHQpe3ZhciByO3JldHVybihyPWUpLmNhbGwuYXBwbHkocixbbix0XS5jb25jYXQoaSkpfSkpfX12YXIgZjtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiZ0KDYpLHZvaWQgMCE9PWkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGkmJnQoNykscihuKSl7dmFyIGE9Tyh0aGlzKSxjPUUodGhpcyxuLHZvaWQgMCkscz0hMDt0cnl7Zj1lKGMpLHM9ITF9ZmluYWxseXtzP20oYSk6aihhKX1yZXR1cm5cInVuZGVmaW5lZFwiIT10eXBlb2YgUHJvbWlzZSYmZiBpbnN0YW5jZW9mIFByb21pc2U/Zi50aGVuKChmdW5jdGlvbih0KXtyZXR1cm4gYihhLGkpLFModCxhKX0pLChmdW5jdGlvbih0KXt0aHJvdyBtKGEpLHR9KSk6KGIoYSxpKSxTKGYsYSkpfWlmKChmPWUobikpIT09VylyZXR1cm4gdm9pZCAwPT09ZiYmKGY9biksdGhpcy5KJiZwKGYsITApLGZ9LGkucHJvZHVjZVdpdGhQYXRjaGVzPWZ1bmN0aW9uKHQsbil7dmFyIHIsZSxpPXRoaXM7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgdD9mdW5jdGlvbihuKXtmb3IodmFyIHI9YXJndW1lbnRzLmxlbmd0aCxlPUFycmF5KHI+MT9yLTE6MCksdT0xO3U8cjt1KyspZVt1LTFdPWFyZ3VtZW50c1t1XTtyZXR1cm4gaS5wcm9kdWNlV2l0aFBhdGNoZXMobiwoZnVuY3Rpb24obil7cmV0dXJuIHQuYXBwbHkodm9pZCAwLFtuXS5jb25jYXQoZSkpfSkpfTpbdGhpcy5wcm9kdWNlKHQsbiwoZnVuY3Rpb24odCxuKXtyPXQsZT1ufSkpLHIsZV19LGkuY3JlYXRlRHJhZnQ9ZnVuY3Rpb24obil7cihuKXx8dCg4KTt2YXIgZT1PKHRoaXMpLGk9RSh0aGlzLG4sdm9pZCAwKTtyZXR1cm4gaVtxXS4kPSEwLGooZSksaX0saS5maW5pc2hEcmFmdD1mdW5jdGlvbih0LG4pe3ZhciByPSh0JiZ0W3FdKS5BO3JldHVybiBiKHIsbiksUyh2b2lkIDAscil9LGkuc2V0QXV0b0ZyZWV6ZT1mdW5jdGlvbih0KXt0aGlzLko9dH0saS5zZXRVc2VQcm94aWVzPWZ1bmN0aW9uKG4pe0l8fHQoMjApLHRoaXMuUz1ufSxpLmFwcGx5UGF0Y2hlcz1mdW5jdGlvbih0LHIpe3ZhciBlO2ZvcihlPXIubGVuZ3RoLTE7ZT49MDtlLS0pe3ZhciBpPXJbZV07aWYoMD09PWkucGF0aC5sZW5ndGgmJlwicmVwbGFjZVwiPT09aS5vcCl7dD1pLnZhbHVlO2JyZWFrfX12YXIgdT1kKFwiUGF0Y2hlc1wiKS5YO3JldHVybiBuKHQpP3UodCxyKTp0aGlzLnByb2R1Y2UodCwoZnVuY3Rpb24odCl7cmV0dXJuIHUodCxyLnNsaWNlKGUrMSkpfSkpfSxlfSgpLFU9bmV3IFQsVj1VLnByb2R1Y2UsWT1VLnByb2R1Y2VXaXRoUGF0Y2hlcy5iaW5kKFUpLFo9VS5zZXRBdXRvRnJlZXplLmJpbmQoVSksdHQ9VS5zZXRVc2VQcm94aWVzLmJpbmQoVSksbnQ9VS5hcHBseVBhdGNoZXMuYmluZChVKSxydD1VLmNyZWF0ZURyYWZ0LmJpbmQoVSksZXQ9VS5maW5pc2hEcmFmdC5iaW5kKFUpO2V4cG9ydHMuSW1tZXI9VCxleHBvcnRzLmFwcGx5UGF0Y2hlcz1udCxleHBvcnRzLmNhc3REcmFmdD1mdW5jdGlvbih0KXtyZXR1cm4gdH0sZXhwb3J0cy5jYXN0SW1tdXRhYmxlPWZ1bmN0aW9uKHQpe3JldHVybiB0fSxleHBvcnRzLmNyZWF0ZURyYWZ0PXJ0LGV4cG9ydHMuZGVmYXVsdD1WLGV4cG9ydHMuZW5hYmxlQWxsUGx1Z2lucz1mdW5jdGlvbigpe2soKSxEKCksRigpfSxleHBvcnRzLmVuYWJsZUVTNT1rLGV4cG9ydHMuZW5hYmxlTWFwU2V0PUQsZXhwb3J0cy5lbmFibGVQYXRjaGVzPUYsZXhwb3J0cy5maW5pc2hEcmFmdD1ldCxleHBvcnRzLmltbWVyYWJsZT1YLGV4cG9ydHMuaXNEcmFmdD1uLGV4cG9ydHMuaXNEcmFmdGFibGU9cixleHBvcnRzLm5vdGhpbmc9VyxleHBvcnRzLm9yaWdpbmFsPWZ1bmN0aW9uKHQpe2lmKHQmJnRbcV0pcmV0dXJuIHRbcV0udX0sZXhwb3J0cy5wcm9kdWNlPVYsZXhwb3J0cy5wcm9kdWNlV2l0aFBhdGNoZXM9WSxleHBvcnRzLnNldEF1dG9GcmVlemU9WixleHBvcnRzLnNldFVzZVByb3hpZXM9dHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbW1lci5janMucHJvZHVjdGlvbi5taW4uanMubWFwXG4iLCJcbid1c2Ugc3RyaWN0J1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vaW1tZXIuY2pzLnByb2R1Y3Rpb24ubWluLmpzJylcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9pbW1lci5janMuZGV2ZWxvcG1lbnQuanMnKVxufVxuIiwiaW1wb3J0IHtcbiAgaXNFcXVhbCxcbiAgaXNGbixcbiAgU3Vic2NyaWJhYmxlLFxuICBGb3JtUGF0aCxcbiAgRm9ybVBhdGhQYXR0ZXJuLFxuICBkZWZhdWx0cyxcbiAgc2hhbGxvd0Nsb25lLFxuICBpc1N0cixcbiAgaXNWYWxpZFxufSBmcm9tICdAZm9ybWlseS9zaGFyZWQnXG5pbXBvcnQgeyBJbW1lciwgZW5hYmxlQWxsUGx1Z2lucywgRHJhZnQsIHNldEF1dG9GcmVlemUgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IFN0YXRlRGlydHlNYXAsIElEaXJ0eU1vZGVsRmFjdG9yeSwgTm9ybWFsUmVjb3JkIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmVuYWJsZUFsbFBsdWdpbnMoKVxuXG5zZXRBdXRvRnJlZXplKGZhbHNlKVxuXG5jb25zdCB7IHByb2R1Y2UgfSA9IG5ldyBJbW1lcih7XG4gIGF1dG9GcmVlemU6IGZhbHNlXG59KVxuXG50eXBlIFJlY2lwZTxTdGF0ZT4gPSAoc3RhdGU/OiBTdGF0ZSkgPT4gYW55XG5cbnR5cGUgRXh0ZW5kc1N0YXRlID0gTm9ybWFsUmVjb3JkICYgeyBkaXNwbGF5TmFtZT86IHN0cmluZyB9XG5cbnR5cGUgRXh0ZW5kc1Byb3BzPFN0YXRlPiA9IE5vcm1hbFJlY29yZCAmIHtcbiAgY29tcHV0ZVN0YXRlPzogKHN0YXRlOiBEcmFmdDxTdGF0ZT4sIHByZXZTdGF0ZTogU3RhdGUpID0+IGFueVxuICBkaXJ0eUNoZWNrPzogKHBhdGg6IEZvcm1QYXRoUGF0dGVybiwgdmFsdWU6IGFueSwgbmV4dFZhbHVlOiBhbnkpID0+IGJvb2xlYW5cbn1cblxudHlwZSBQYXRjaCA9IHtcbiAgb3A6ICdyZXBsYWNlJyB8ICdyZW1vdmUnIHwgJ2FkZCdcbiAgcGF0aDogKHN0cmluZyB8IG51bWJlcilbXVxuICB2YWx1ZT86IGFueVxufVxuXG5jb25zdCBhcHBseVBhdGNoZXMgPSAodGFyZ2V0OiBhbnksIHBhdGNoZXM6IFBhdGNoW10pID0+IHtcbiAgcGF0Y2hlcy5mb3JFYWNoKCh7IG9wLCBwYXRoLCB2YWx1ZSB9KSA9PiB7XG4gICAgaWYgKG9wID09PSAncmVwbGFjZScgfHwgb3AgPT09ICdhZGQnKSB7XG4gICAgICBGb3JtUGF0aC5zZXRJbih0YXJnZXQsIHBhdGgsIHZhbHVlKVxuICAgIH0gZWxzZSBpZiAob3AgPT09ICdyZW1vdmUnKSB7XG4gICAgICBGb3JtUGF0aC5kZWxldGVJbih0YXJnZXQsIHBhdGgpXG4gICAgfVxuICB9KVxufVxuXG50eXBlIENhY2hlS2V5ID0gc3RyaW5nIHwgU3ltYm9sIHwgbnVtYmVyXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVNb2RlbCA9IDxcbiAgU3RhdGUgZXh0ZW5kcyBFeHRlbmRzU3RhdGUsXG4gIFByb3BzIGV4dGVuZHMgRXh0ZW5kc1Byb3BzPFN0YXRlPlxuPihcbiAgRmFjdG9yeTogSURpcnR5TW9kZWxGYWN0b3J5PFN0YXRlLCBQcm9wcz5cbikgPT4ge1xuICByZXR1cm4gY2xhc3MgTW9kZWwgZXh0ZW5kcyBTdWJzY3JpYmFibGUge1xuICAgIGZhY3Rvcnk6IEluc3RhbmNlVHlwZTxJRGlydHlNb2RlbEZhY3Rvcnk8U3RhdGUsIFByb3BzPj5cbiAgICBzdGF0ZTogU3RhdGVcbiAgICBwcmV2U3RhdGU6IFN0YXRlXG4gICAgcHJvcHM6IFByb3BzXG4gICAgcGF0Y2hlczogUGF0Y2hbXVxuICAgIGRpcnR5U3RhY2s6IFN0YXRlRGlydHlNYXA8U3RhdGU+W11cbiAgICBkaXJ0eUNvdW50U3RhY2s6IG51bWJlcltdXG4gICAgYmF0Y2hpbmc6IGJvb2xlYW5cbiAgICBjYWNoZTogTWFwPGFueSwgYW55PlxuICAgIGRpc3BsYXlOYW1lOiBzdHJpbmdcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHMgPSB7fSBhcyBhbnkpIHtcbiAgICAgIHN1cGVyKClcbiAgICAgIHRoaXMucHJvcHMgPSBkZWZhdWx0cyhGYWN0b3J5LmRlZmF1bHRQcm9wcywgcHJvcHMpXG4gICAgICB0aGlzLmRpc3BsYXlOYW1lID0gRmFjdG9yeS5kaXNwbGF5TmFtZVxuICAgICAgdGhpcy5mYWN0b3J5ID0gbmV3IEZhY3RvcnkodGhpcy5wcm9wcylcbiAgICAgIHRoaXMuY2FjaGUgPSBuZXcgTWFwKClcbiAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLmZhY3Rvcnkuc3RhdGUgYXMgYW55XG4gICAgICB0aGlzLnN0YXRlLmRpc3BsYXlOYW1lID0gdGhpcy5kaXNwbGF5TmFtZVxuICAgICAgdGhpcy5wcmV2U3RhdGUgPSB0aGlzLnN0YXRlXG4gICAgICB0aGlzLmJhdGNoaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuZGlydHlTdGFjayA9IFtdXG4gICAgICB0aGlzLmRpcnR5Q291bnRTdGFjayA9IFtdXG4gICAgfVxuXG4gICAgZW50ZXJDYWxjdWxhdGVEaXJ0eXMoKSB7XG4gICAgICB0aGlzLmRpcnR5U3RhY2sucHVzaCh7fSlcbiAgICAgIHRoaXMuZGlydHlDb3VudFN0YWNrLnB1c2goMClcbiAgICB9XG5cbiAgICBleGlzdENhbGN1bGF0ZURpcnR5cygpIHtcbiAgICAgIHRoaXMuZGlydHlTdGFjay5wb3AoKVxuICAgICAgdGhpcy5kaXJ0eUNvdW50U3RhY2sucG9wKClcbiAgICB9XG5cbiAgICBnZXQgZGlydHlzKCk6IFN0YXRlRGlydHlNYXA8U3RhdGU+IHtcbiAgICAgIHJldHVybiB0aGlzLmRpcnR5U3RhY2tbdGhpcy5kaXJ0eVN0YWNrLmxlbmd0aCAtIDFdIHx8IHt9XG4gICAgfVxuXG4gICAgc2V0IGRpcnR5cyhkaXJ0eXM6IFN0YXRlRGlydHlNYXA8U3RhdGU+KSB7XG4gICAgICBpZiAodGhpcy5kaXJ0eVN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLmRpcnR5U3RhY2sucHVzaCh7fSlcbiAgICAgIH1cbiAgICAgIHRoaXMuZGlydHlTdGFja1t0aGlzLmRpcnR5U3RhY2subGVuZ3RoIC0gMV0gPSBkaXJ0eXNcbiAgICB9XG5cbiAgICBnZXQgZGlydHlDb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpcnR5Q291bnRTdGFja1t0aGlzLmRpcnR5Q291bnRTdGFjay5sZW5ndGggLSAxXSB8fCAwXG4gICAgfVxuXG4gICAgc2V0IGRpcnR5Q291bnQodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLmRpcnR5Q291bnRTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5kaXJ0eUNvdW50U3RhY2sucHVzaCgwKVxuICAgICAgfVxuICAgICAgdGhpcy5kaXJ0eUNvdW50U3RhY2tbdGhpcy5kaXJ0eUNvdW50U3RhY2subGVuZ3RoIC0gMV0gPSB2YWx1ZVxuICAgIH1cblxuICAgIGdldEJhc2VTdGF0ZSgpIHtcbiAgICAgIGlmIChpc0ZuKHRoaXMuZmFjdG9yeS5nZXRTdGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmFjdG9yeS5nZXRTdGF0ZS5jYWxsKHRoaXMuZmFjdG9yeSwgdGhpcy5zdGF0ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RGlydHlzRnJvbVBhdGNoZXMoXG4gICAgICBwYXRjaGVzOiBQYXRjaFtdLFxuICAgICAgcmVmcmVzaD86IGJvb2xlYW5cbiAgICApOiBTdGF0ZURpcnR5TWFwPFN0YXRlPiB7XG4gICAgICByZXR1cm4gcGF0Y2hlcy5yZWR1Y2UoXG4gICAgICAgIChidWYsIHsgcGF0aCB9KSA9PiB7XG4gICAgICAgICAgYnVmW3BhdGhbMF1dID0gdHJ1ZVxuICAgICAgICAgIHJldHVybiBidWZcbiAgICAgICAgfSxcbiAgICAgICAgcmVmcmVzaCA/IHt9IDogdGhpcy5iYXRjaGluZyA/IHRoaXMuZGlydHlzIDoge31cbiAgICAgIClcbiAgICB9XG5cbiAgICBkaXJ0eUNoZWNrKHBhdGg6IEZvcm1QYXRoUGF0dGVybiwgbmV4dFZhbHVlOiBhbnkpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IEZvcm1QYXRoLmdldEluKHRoaXMuc3RhdGUsIHBhdGgpXG4gICAgICBpZiAoaXNGbih0aGlzLmZhY3RvcnkuZGlydHlDaGVjaykpIHtcbiAgICAgICAgaWYgKGlzRm4odGhpcy5wcm9wcy5kaXJ0eUNoZWNrKSkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmZhY3RvcnkuZGlydHlDaGVjayhwYXRoLCBjdXJyZW50VmFsdWUsIG5leHRWYWx1ZSkgJiZcbiAgICAgICAgICAgIHRoaXMucHJvcHMuZGlydHlDaGVjayhwYXRoLCBjdXJyZW50VmFsdWUsIG5leHRWYWx1ZSlcbiAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmFjdG9yeS5kaXJ0eUNoZWNrKHBhdGgsIGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNGbih0aGlzLnByb3BzLmRpcnR5Q2hlY2spKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZGlydHlDaGVjayhwYXRoLCBjdXJyZW50VmFsdWUsIG5leHRWYWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gIWlzRXF1YWwoY3VycmVudFZhbHVlLCBuZXh0VmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTdGF0ZShyZWNpcGU/OiBSZWNpcGU8U3RhdGU+LCBzaWxlbnQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgaWYgKCFpc0ZuKHJlY2lwZSkpIHJldHVyblxuICAgICAgY29uc3QgYmFzZSA9IHRoaXMuZ2V0QmFzZVN0YXRlKClcbiAgICAgIHRoaXMucGF0Y2hlcyA9IFtdXG4gICAgICB0aGlzLnByZXZTdGF0ZSA9IGJhc2VcbiAgICAgIHRoaXMuZmFjdG9yeS5wcmV2U3RhdGUgPSBiYXNlXG4gICAgICB0aGlzLmZhY3Rvcnkuc3RhdGUgPSBiYXNlXG4gICAgICB0aGlzLmZhY3Rvcnk/LmJlZm9yZVByb2R1Y2U/LigpXG4gICAgICBpZiAoIXRoaXMuYmF0Y2hpbmcpIHtcbiAgICAgICAgdGhpcy5lbnRlckNhbGN1bGF0ZURpcnR5cygpXG4gICAgICB9XG4gICAgICBwcm9kdWNlKFxuICAgICAgICBiYXNlLFxuICAgICAgICBkcmFmdCA9PiB7XG4gICAgICAgICAgcmVjaXBlKGRyYWZ0KVxuICAgICAgICAgIGlmIChpc0ZuKHRoaXMucHJvcHMuY29tcHV0ZVN0YXRlKSkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5jb21wdXRlU3RhdGUoZHJhZnQsIHRoaXMucHJldlN0YXRlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcGF0Y2hlcyA9PiB7XG4gICAgICAgICAgdGhpcy5wYXRjaGVzID0gdGhpcy5wYXRjaGVzLmNvbmNhdChwYXRjaGVzKVxuICAgICAgICB9XG4gICAgICApXG4gICAgICBjb25zdCBwcm9kdWNlZCA9IHByb2R1Y2UoXG4gICAgICAgIGJhc2UsXG4gICAgICAgIGRyYWZ0ID0+IHtcbiAgICAgICAgICBhcHBseVBhdGNoZXMoZHJhZnQsIHRoaXMucGF0Y2hlcylcbiAgICAgICAgICBjb25zdCBkaXJ0eXMgPSB0aGlzLmdldERpcnR5c0Zyb21QYXRjaGVzKHRoaXMucGF0Y2hlcywgdHJ1ZSlcbiAgICAgICAgICBpZiAoaXNGbih0aGlzLmZhY3RvcnkucHJvZHVjZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZmFjdG9yeS5wcm9kdWNlKGRyYWZ0LCBkaXJ0eXMpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwYXRjaGVzID0+IHtcbiAgICAgICAgICBwYXRjaGVzLmZvckVhY2gocGF0Y2ggPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBwYXRoLCB2YWx1ZSB9ID0gcGF0Y2hcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcnR5Q2hlY2socGF0aCwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgIHRoaXMucGF0Y2hlcy5wdXNoKHBhdGNoKVxuICAgICAgICAgICAgICB0aGlzLmRpcnR5Q291bnQrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIHRoaXMuZmFjdG9yeS5zdGF0ZSA9IHByb2R1Y2VkXG4gICAgICB0aGlzLnN0YXRlID0gcHJvZHVjZWRcbiAgICAgIHRoaXMuZGlydHlzID0gdGhpcy5nZXREaXJ0eXNGcm9tUGF0Y2hlcyh0aGlzLnBhdGNoZXMpXG4gICAgICB0aGlzLnBhdGNoZXMgPSBbXVxuICAgICAgdGhpcy5mYWN0b3J5Py5hZnRlclByb2R1Y2U/LigpXG4gICAgICBpZiAodGhpcy5kaXJ0eUNvdW50ID4gMCAmJiAhc2lsZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmJhdGNoaW5nKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ub3RpZnkodGhpcy5nZXRTdGF0ZSgpLCBzaWxlbnQpXG4gICAgICB9XG4gICAgICB0aGlzLmV4aXN0Q2FsY3VsYXRlRGlydHlzKClcbiAgICB9XG5cbiAgICBzZXRTb3VyY2VTdGF0ZShyZWNpcGU/OiBSZWNpcGU8U3RhdGU+KSB7XG4gICAgICBpZiAoIWlzRm4ocmVjaXBlKSkgcmV0dXJuIHRoaXMuc3RhdGVcbiAgICAgIHJlY2lwZSh0aGlzLnN0YXRlKVxuICAgIH1cblxuICAgIGdldFN0YXRlPFQgZXh0ZW5kcyBSZWNpcGU8U3RhdGU+PihcbiAgICAgIHJlY2lwZT86IFRcbiAgICApOiBUIGV4dGVuZHMgUmVjaXBlPFN0YXRlPiA/IFJldHVyblR5cGU8VD4gOiBTdGF0ZSB7XG4gICAgICBpZiAoIWlzRm4ocmVjaXBlKSkgcmV0dXJuIHRoaXMuZ2V0QmFzZVN0YXRlKClcbiAgICAgIHJldHVybiByZWNpcGUodGhpcy5nZXRCYXNlU3RhdGUoKSlcbiAgICB9XG5cbiAgICBnZXRTb3VyY2VTdGF0ZTxUIGV4dGVuZHMgUmVjaXBlPFN0YXRlPj4oXG4gICAgICByZWNpcGU/OiBUXG4gICAgKTogVCBleHRlbmRzIFJlY2lwZTxTdGF0ZT4gPyBSZXR1cm5UeXBlPFQ+IDogU3RhdGUge1xuICAgICAgaWYgKCFpc0ZuKHJlY2lwZSkpIHJldHVybiB0aGlzLnN0YXRlIGFzIGFueVxuICAgICAgcmV0dXJuIHJlY2lwZSh0aGlzLnN0YXRlKVxuICAgIH1cblxuICAgIGJhdGNoKGNhbGxiYWNrPzogKCkgPT4gdm9pZCkge1xuICAgICAgdGhpcy5iYXRjaGluZyA9IHRydWVcbiAgICAgIHRoaXMuZW50ZXJDYWxjdWxhdGVEaXJ0eXMoKVxuICAgICAgY29uc3QgcHJldlN0YXRlID0gdGhpcy5zdGF0ZVxuICAgICAgaWYgKGlzRm4oY2FsbGJhY2spKSB7XG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH1cbiAgICAgIHRoaXMucHJldlN0YXRlID0gcHJldlN0YXRlXG4gICAgICBpZiAodGhpcy5kaXJ0eUNvdW50ID4gMCkge1xuICAgICAgICB0aGlzLm5vdGlmeSh0aGlzLmdldFN0YXRlKCkpXG4gICAgICB9XG4gICAgICB0aGlzLmJhdGNoaW5nID0gZmFsc2VcbiAgICAgIHRoaXMuZXhpc3RDYWxjdWxhdGVEaXJ0eXMoKVxuICAgIH1cblxuICAgIHNldENhY2hlKGtleTogQ2FjaGVLZXksIHZhbHVlOiBhbnkpIHtcbiAgICAgIHRoaXMuY2FjaGUuc2V0KFxuICAgICAgICBrZXksXG4gICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyBzaGFsbG93Q2xvbmUodmFsdWUpIDogdmFsdWVcbiAgICAgIClcbiAgICB9XG5cbiAgICBnZXRDYWNoZShrZXk6IENhY2hlS2V5KSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2FjaGUuZ2V0KGtleSlcbiAgICAgIGlmIChpc1ZhbGlkKHZhbHVlKSkgcmV0dXJuIHZhbHVlXG4gICAgICBpZiAodGhpcy5jYWNoZS5zaXplID09PSAxKSB7XG4gICAgICAgIGxldCBmaW5kS2V5ID0gbnVsbFxuICAgICAgICB0aGlzLmNhY2hlLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICBmaW5kS2V5ID0ga2V5XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLmdldChmaW5kS2V5KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuXG4gICAgcmVtb3ZlQ2FjaGUoa2V5OiBDYWNoZUtleSkge1xuICAgICAgdGhpcy5jYWNoZS5kZWxldGUoa2V5KVxuICAgIH1cblxuICAgIGlzRGlydHkoa2V5Pzogc3RyaW5nKSB7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpcnR5c1trZXldXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5kaXJ0eUNvdW50ID4gMFxuICAgICAgfVxuICAgIH1cblxuICAgIGhhc0NoYW5nZWQgPSAocGF0dGVybj86IEZvcm1QYXRoUGF0dGVybikgPT4ge1xuICAgICAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpcnR5Q291bnQgPiAwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwYXRoID0gRm9ybVBhdGgucGFyc2UocGF0dGVybilcbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoID4gMSB8fCAhaXNTdHIocGF0dGVybikpIHtcbiAgICAgICAgICByZXR1cm4gIWlzRXF1YWwoXG4gICAgICAgICAgICBGb3JtUGF0aC5nZXRJbih0aGlzLnByZXZTdGF0ZSwgcGF0aCksXG4gICAgICAgICAgICBGb3JtUGF0aC5nZXRJbih0aGlzLnN0YXRlLCBwYXRoKVxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gISF0aGlzLmRpcnR5c1twYXR0ZXJuXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVNb2RlbCB9IGZyb20gJy4uL3NoYXJlZC9tb2RlbCdcbmltcG9ydCB7XG4gIElNb2RlbFNwZWMsXG4gIElGb3JtU3RhdGUsXG4gIElGb3JtU3RhdGVQcm9wcyxcbiAgRm9ybVN0YXRlRGlydHlNYXBcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyB0b0FyciB9IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCB7IERyYWZ0IH0gZnJvbSAnaW1tZXInXG5cbmNvbnN0IG5vcm1hbGl6ZU1lc3NhZ2VzID0gKG1lc3NhZ2VzOiBhbnkpID0+IHRvQXJyKG1lc3NhZ2VzKS5maWx0ZXIodiA9PiAhIXYpXG5cbmV4cG9ydCBjb25zdCBGb3JtID0gY3JlYXRlTW9kZWw8SUZvcm1TdGF0ZSwgSUZvcm1TdGF0ZVByb3BzPihcbiAgY2xhc3MgRm9ybVN0YXRlRmFjdG9yeSBpbXBsZW1lbnRzIElNb2RlbFNwZWM8SUZvcm1TdGF0ZSwgSUZvcm1TdGF0ZVByb3BzPiB7XG4gICAgc3RhdGUgPSB7XG4gICAgICB2YWxpZDogdHJ1ZSxcbiAgICAgIGludmFsaWQ6IGZhbHNlLFxuICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICB2YWxpZGF0aW5nOiBmYWxzZSxcbiAgICAgIGluaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxuICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICBtb2RpZmllZDogZmFsc2UsXG4gICAgICBlcnJvcnM6IFtdLFxuICAgICAgd2FybmluZ3M6IFtdLFxuICAgICAgdmFsdWVzOiB7fSxcbiAgICAgIGluaXRpYWxWYWx1ZXM6IHt9LFxuICAgICAgbW91bnRlZDogZmFsc2UsXG4gICAgICB1bm1vdW50ZWQ6IGZhbHNlXG4gICAgfVxuXG4gICAgcHJvcHM6IElGb3JtU3RhdGVQcm9wc1xuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IElGb3JtU3RhdGVQcm9wcykge1xuICAgICAgdGhpcy5wcm9wcyA9IHByb3BzXG4gICAgfVxuXG4gICAgcHJvZHVjZShkcmFmdDogRHJhZnQ8SUZvcm1TdGF0ZT4sIGRpcnR5czogRm9ybVN0YXRlRGlydHlNYXApIHtcbiAgICAgIGlmIChkaXJ0eXMuZXJyb3JzKSB7XG4gICAgICAgIGRyYWZ0LmVycm9ycyA9IG5vcm1hbGl6ZU1lc3NhZ2VzKGRyYWZ0LmVycm9ycylcbiAgICAgIH1cbiAgICAgIGlmIChkaXJ0eXMud2FybmluZ3MpIHtcbiAgICAgICAgZHJhZnQud2FybmluZ3MgPSBub3JtYWxpemVNZXNzYWdlcyhkcmFmdC53YXJuaW5ncylcbiAgICAgIH1cbiAgICAgIGlmIChkcmFmdC5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGRyYWZ0LmludmFsaWQgPSB0cnVlXG4gICAgICAgIGRyYWZ0LnZhbGlkID0gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRyYWZ0LmludmFsaWQgPSBmYWxzZVxuICAgICAgICBkcmFmdC52YWxpZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGlmIChkaXJ0eXMuaW5pdGlhbGl6ZWQgJiYgIWRyYWZ0Lm1vZGlmaWVkKSB7XG4gICAgICAgIGlmIChkaXJ0eXMudmFsdWVzKSB7XG4gICAgICAgICAgZHJhZnQubW9kaWZpZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkaXJ0eXMudmFsaWRhdGluZykge1xuICAgICAgICBpZiAoZHJhZnQudmFsaWRhdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGRyYWZ0LmxvYWRpbmcgPSB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAoZHJhZnQudmFsaWRhdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBkcmFmdC5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRyYWZ0Lm1vdW50ZWQgPT09IHRydWUgJiYgZGlydHlzLm1vdW50ZWQpIHtcbiAgICAgICAgZHJhZnQudW5tb3VudGVkID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmIChkcmFmdC51bm1vdW50ZWQgPT09IHRydWUgJiYgZGlydHlzLnVubW91bnRlZCkge1xuICAgICAgICBkcmFmdC5tb3VudGVkID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnRm9ybVN0YXRlJ1xuICB9XG4pXG4iLCJpbXBvcnQgeyBGb3JtUGF0aCwgRm9ybVBhdGhQYXR0ZXJuLCBpc0ZuIH0gZnJvbSAnQGZvcm1pbHkvc2hhcmVkJ1xuaW1wb3J0IHtcbiAgVmFsaWRhdGVQYXR0ZXJuUnVsZXMsXG4gIFZhbGlkYXRlTm9kZVJlc3VsdCxcbiAgVmFsaWRhdGVGaWVsZE9wdGlvbnNcbn0gZnJvbSAnQGZvcm1pbHkvdmFsaWRhdG9yJ1xuaW1wb3J0IHsgY3JlYXRlRm9ybSB9IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgeyBGb3JtTGlmZUN5Y2xlIH0gZnJvbSAnLi9zaGFyZWQvbGlmZWN5Y2xlJ1xuaW1wb3J0IHsgRHJhZnQgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IEZpZWxkIH0gZnJvbSAnLi9tb2RlbHMvZmllbGQnXG5pbXBvcnQgeyBWaXJ0dWFsRmllbGQgfSBmcm9tICcuL21vZGVscy92aXJ0dWFsLWZpZWxkJ1xuZXhwb3J0ICogZnJvbSAnQGZvcm1pbHkvdmFsaWRhdG9yJ1xuXG5leHBvcnQgdHlwZSBGb3JtTGlmZUN5Y2xlSGFuZGxlcjxUPiA9IChwYXlsb2FkOiBULCBjb250ZXh0OiBhbnkpID0+IHZvaWRcblxuZXhwb3J0IHR5cGUgRm9ybUhlYXJ0U3Vic2NyaWJlciA9ICh7XG4gIHR5cGUsXG4gIHBheWxvYWRcbn06IHtcbiAgdHlwZTogc3RyaW5nXG4gIHBheWxvYWQ6IGFueVxufSkgPT4gdm9pZFxuXG5leHBvcnQgZW51bSBMaWZlQ3ljbGVUeXBlcyB7XG4gIC8qKlxuICAgKiBGb3JtIExpZmVDeWNsZVxuICAgKiovXG5cbiAgT05fRk9STV9XSUxMX0lOSVQgPSAnb25Gb3JtV2lsbEluaXQnLFxuICBPTl9GT1JNX0lOSVQgPSAnb25Gb3JtSW5pdCcsXG4gIE9OX0ZPUk1fQ0hBTkdFID0gJ29uRm9ybUNoYW5nZScsIC8vQ2hhbmdlVHlwZeeyvuWHhuaOp+WItuWTjeW6lFxuICBPTl9GT1JNX01PVU5UID0gJ29uRm9ybU1vdW50JyxcbiAgT05fRk9STV9VTk1PVU5UID0gJ29uRm9ybVVubW91bnQnLFxuICBPTl9GT1JNX1NVQk1JVCA9ICdvbkZvcm1TdWJtaXQnLFxuICBPTl9GT1JNX1JFU0VUID0gJ29uRm9ybVJlc2V0JyxcbiAgT05fRk9STV9TVUJNSVRfU1RBUlQgPSAnb25Gb3JtU3VibWl0U3RhcnQnLFxuICBPTl9GT1JNX1NVQk1JVF9FTkQgPSAnb25Gb3JtU3VibWl0RW5kJyxcbiAgT05fRk9STV9TVUJNSVRfVkFMSURBVEVfU1RBUlQgPSAnb25Gb3JtU3VibWl0VmFsaWRhdGVTdGFydCcsXG4gIE9OX0ZPUk1fU1VCTUlUX1ZBTElEQVRFX1NVQ0NFU1MgPSAnb25Gb3JtU3VibWl0VmFsaWRhdGVTdWNjZXNzJyxcbiAgT05fRk9STV9TVUJNSVRfVkFMSURBVEVfRkFJTEVEID0gJ29uRm9ybVN1Ym1pdFZhbGlkYXRlRmFpbGVkJyxcbiAgT05fRk9STV9PTl9TVUJNSVRfU1VDQ0VTUyA9ICdvbkZvcm1PblN1Ym1pdFN1Y2Nlc3MnLFxuICBPTl9GT1JNX09OX1NVQk1JVF9GQUlMRUQgPSAnb25Gb3JtT25TdWJtaXRGYWlsZWQnLFxuICBPTl9GT1JNX1ZBTFVFU19DSEFOR0UgPSAnb25Gb3JtVmFsdWVzQ2hhbmdlJyxcbiAgT05fRk9STV9JTklUSUFMX1ZBTFVFU19DSEFOR0UgPSAnb25Gb3JtSW5pdGlhbFZhbHVlc0NoYW5nZScsXG4gIE9OX0ZPUk1fVkFMSURBVEVfU1RBUlQgPSAnb25Gb3JtVmFsaWRhdGVTdGFydCcsXG4gIE9OX0ZPUk1fVkFMSURBVEVfRU5EID0gJ29uRm9ybVZhbGlkYXRlRW5kJyxcbiAgT05fRk9STV9JTlBVVF9DSEFOR0UgPSAnb25Gb3JtSW5wdXRDaGFuZ2UnLFxuICBPTl9GT1JNX0hPU1RfUkVOREVSID0gJ29uRm9ybUhvc3RSZW5kZXInLFxuICAvKipcbiAgICogRm9ybUdyYXBoIExpZmVDeWNsZVxuICAgKiovXG4gIE9OX0ZPUk1fR1JBUEhfQ0hBTkdFID0gJ29uRm9ybUdyYXBoQ2hhbmdlJyxcblxuICAvKipcbiAgICogRmllbGQgTGlmZUN5Y2xlXG4gICAqKi9cblxuICBPTl9GSUVMRF9XSUxMX0lOSVQgPSAnb25GaWVsZFdpbGxJbml0JyxcbiAgT05fRklFTERfSU5JVCA9ICdvbkZpZWxkSW5pdCcsXG4gIE9OX0ZJRUxEX0NIQU5HRSA9ICdvbkZpZWxkQ2hhbmdlJyxcbiAgT05fRklFTERfSU5QVVRfQ0hBTkdFID0gJ29uRmllbGRJbnB1dENoYW5nZScsXG4gIE9OX0ZJRUxEX1ZBTFVFX0NIQU5HRSA9ICdvbkZpZWxkVmFsdWVDaGFuZ2UnLFxuICBPTl9GSUVMRF9JTklUSUFMX1ZBTFVFX0NIQU5HRSA9ICdvbkZpZWxkSW5pdGlhbFZhbHVlQ2hhbmdlJyxcbiAgT05fRklFTERfVkFMSURBVEVfU1RBUlQgPSAnb25GaWVsZFZhbGlkYXRlU3RhcnQnLFxuICBPTl9GSUVMRF9WQUxJREFURV9FTkQgPSAnb25GaWVsZFZhbGlkYXRlRW5kJyxcbiAgT05fRklFTERfTU9VTlQgPSAnb25GaWVsZE1vdW50JyxcbiAgT05fRklFTERfVU5NT1VOVCA9ICdvbkZpZWxkVW5tb3VudCdcbn1cblxuZXhwb3J0IHR5cGUgRm9ybUdyYXBoUHJvcHMgPSB7XG4gIG1hdGNoU3RyYXRlZ3k/OiAoXG4gICAgcGF0dGVybjogRm9ybVBhdGhQYXR0ZXJuLFxuICAgIG5vZGVQYXRoOiBGb3JtUGF0aFBhdHRlcm5cbiAgKSA9PiBib29sZWFuXG59XG5cbmV4cG9ydCB0eXBlIEZvcm1HcmFwaE5vZGVNYXA8VD4gPSB7XG4gIFtrZXkgaW4gc3RyaW5nXTogVFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZvcm1HcmFwaFZpc2l0b3JPcHRpb25zPFQ+IHtcbiAgcGF0aDogRm9ybVBhdGhcbiAgZXhzaXN0OiBib29sZWFuXG4gIGFwcGVuZDogKG5vZGU6IFQpID0+IHZvaWRcbn1cblxuZXhwb3J0IHR5cGUgRm9ybUdyYXBoPFQ+ID0gKFxuICBub2RlOiBULFxuICBvcHRpb25zOiBGb3JtR3JhcGhWaXNpdG9yT3B0aW9uczxUPlxuKSA9PiB2b2lkXG5cbmV4cG9ydCBpbnRlcmZhY2UgRm9ybUdyYXBoTm9kZVJlZiB7XG4gIHBhcmVudD86IEZvcm1HcmFwaE5vZGVSZWZcbiAgcGF0aDogRm9ybVBhdGhcbiAgZGF0YVBhdGg/OiBGb3JtUGF0aFxuICBjaGlsZHJlbjogRm9ybVBhdGhbXVxufVxuXG5leHBvcnQgdHlwZSBGb3JtR3JhcGhNYXRjaGVyPFQ+ID0gKG5vZGU6IFQsIHBhdGg6IEZvcm1QYXRoKSA9PiB2b2lkIHwgYm9vbGVhblxuXG5leHBvcnQgdHlwZSBGb3JtR3JhcGhFYWNoZXI8VD4gPSAobm9kZTogVCwgcGF0aDogRm9ybVBhdGgpID0+IHZvaWRcblxuZXhwb3J0IHR5cGUgRm9ybUxpZmVDeWNsZVBheWxvYWQ8VD4gPSAoXG4gIHBhcmFtczoge1xuICAgIHR5cGU6IHN0cmluZ1xuICAgIHBheWxvYWQ6IFRcbiAgfSxcbiAgY29udGV4dDogYW55XG4pID0+IHZvaWRcblxuZXhwb3J0IHR5cGUgU3RhdGVEaXJ0eU1hcDxQPiA9IHtcbiAgW2tleSBpbiBrZXlvZiBQXT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IHR5cGUgTm9ybWFsUmVjb3JkID0geyBba2V5OiBzdHJpbmddOiBhbnkgfVxuXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbFNwZWM8XG4gIFN0YXRlIGV4dGVuZHMgTm9ybWFsUmVjb3JkLFxuICBQcm9wcyBleHRlbmRzIE5vcm1hbFJlY29yZFxuPiB7XG4gIHN0YXRlPzogUGFydGlhbDxTdGF0ZT5cbiAgcHJvcHM/OiBQcm9wc1xuICBwcmV2U3RhdGU/OiBQYXJ0aWFsPFN0YXRlPlxuICBnZXRTdGF0ZT86IChzdGF0ZT86IFN0YXRlKSA9PiBhbnlcbiAgYmVmb3JlUHJvZHVjZT86ICgpID0+IHZvaWRcbiAgYWZ0ZXJQcm9kdWNlPzogKCkgPT4gdm9pZFxuICBkaXJ0eUNoZWNrPzogKHBhdGg6IEZvcm1QYXRoUGF0dGVybiwgdmFsdWU6IGFueSwgbmV4dFZhbHVlOiBhbnkpID0+IGJvb2xlYW5cbiAgcHJvZHVjZT86IChkcmFmdDogRHJhZnQ8U3RhdGU+LCBkaXJ0eXM6IFN0YXRlRGlydHlNYXA8U3RhdGU+KSA9PiB2b2lkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSURpcnR5TW9kZWxGYWN0b3J5PFxuICBTdGF0ZSBleHRlbmRzIE5vcm1hbFJlY29yZCxcbiAgUHJvcHMgZXh0ZW5kcyBOb3JtYWxSZWNvcmRcbj4ge1xuICBuZXcgKHByb3BzPzogUHJvcHMpOiBJTW9kZWxTcGVjPFBhcnRpYWw8U3RhdGU+LCBQcm9wcz5cbiAgZGVmYXVsdFByb3BzPzogUHJvcHNcbiAgZGlzcGxheU5hbWU/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJRmllbGRTdGF0ZTxGaWVsZFByb3BzID0gYW55PiB7XG4gIGRpc3BsYXlOYW1lOiBzdHJpbmdcbiAgZGF0YVR5cGU6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbiAgcGF0aDogc3RyaW5nXG4gIGluaXRpYWxpemVkOiBib29sZWFuXG4gIHByaXN0aW5lOiBib29sZWFuXG4gIHZhbGlkOiBib29sZWFuXG4gIHRvdWNoZWQ6IGJvb2xlYW5cbiAgaW52YWxpZDogYm9vbGVhblxuICB2aXNpYmxlOiBib29sZWFuXG4gIGRpc3BsYXk6IGJvb2xlYW5cbiAgZWRpdGFibGU6IGJvb2xlYW5cbiAgc2VsZkVkaXRhYmxlOiBib29sZWFuXG4gIGZvcm1FZGl0YWJsZTogYm9vbGVhbiB8ICgobmFtZTogc3RyaW5nKSA9PiBib29sZWFuKVxuICBsb2FkaW5nOiBib29sZWFuXG4gIG1vZGlmaWVkOiBib29sZWFuXG4gIGlucHV0ZWQ6IGJvb2xlYW5cbiAgYWN0aXZlOiBib29sZWFuXG4gIHZpc2l0ZWQ6IGJvb2xlYW5cbiAgdmFsaWRhdGluZzogYm9vbGVhblxuICB2YWx1ZXM6IGFueVtdXG4gIGVycm9yczogc3RyaW5nW11cbiAgZWZmZWN0RXJyb3JzOiBzdHJpbmdbXVxuICBydWxlRXJyb3JzOiBzdHJpbmdbXVxuICB3YXJuaW5nczogc3RyaW5nW11cbiAgZWZmZWN0V2FybmluZ3M6IHN0cmluZ1tdXG4gIHJ1bGVXYXJuaW5nczogc3RyaW5nW11cbiAgdmFsdWU6IGFueVxuICB2aXNpYmxlQ2FjaGVWYWx1ZTogYW55XG4gIGluaXRpYWxWYWx1ZTogYW55XG4gIHJ1bGVzOiBWYWxpZGF0ZVBhdHRlcm5SdWxlc1tdXG4gIHJlcXVpcmVkOiBib29sZWFuXG4gIG1vdW50ZWQ6IGJvb2xlYW5cbiAgdW5tb3VudGVkOiBib29sZWFuXG4gIHVubW91bnRSZW1vdmVWYWx1ZTogYm9vbGVhblxuICBwcm9wczogRmllbGRQcm9wc1xuICBba2V5OiBzdHJpbmddOiBhbnlcbn1cblxuZXhwb3J0IHR5cGUgRmllbGRTdGF0ZURpcnR5TWFwID0gU3RhdGVEaXJ0eU1hcDxJRmllbGRTdGF0ZT5cblxuZXhwb3J0IGludGVyZmFjZSBJRmllbGRTdGF0ZVByb3BzIHtcbiAgbm9kZVBhdGg/OiBGb3JtUGF0aFBhdHRlcm5cbiAgZGF0YVBhdGg/OiBGb3JtUGF0aFBhdHRlcm5cbiAgZGF0YVR5cGU/OiBzdHJpbmdcbiAgZ2V0RWRpdGFibGU/OiAoKSA9PiBib29sZWFuIHwgKChuYW1lOiBzdHJpbmcpID0+IGJvb2xlYW4pXG4gIGdldFZhbHVlPzogKG5hbWU6IEZvcm1QYXRoUGF0dGVybikgPT4gYW55XG4gIGdldEluaXRpYWxWYWx1ZT86IChuYW1lOiBGb3JtUGF0aFBhdHRlcm4pID0+IGFueVxuICBzZXRWYWx1ZT86IChuYW1lOiBGb3JtUGF0aFBhdHRlcm4sIHZhbHVlOiBhbnkpID0+IHZvaWRcbiAgcmVtb3ZlVmFsdWU/OiAobmFtZTogRm9ybVBhdGhQYXR0ZXJuKSA9PiB2b2lkXG4gIHNldEluaXRpYWxWYWx1ZT86IChuYW1lOiBGb3JtUGF0aFBhdHRlcm4sIGluaXRpYWxWYWx1ZTogYW55KSA9PiB2b2lkXG4gIHN1cHBvcnRVbm1vdW50Q2xlYXJTdGF0ZXM/OiAocGF0aDogRm9ybVBhdGhQYXR0ZXJuKSA9PiBib29sZWFuXG4gIGNvbXB1dGVTdGF0ZT86IChkcmFmdDogSUZpZWxkU3RhdGUsIHByZXZTdGF0ZTogSUZpZWxkU3RhdGUpID0+IHZvaWRcbiAgdW5Db250cm9sbGVkVmFsdWVDaGFuZ2VkPzogKCkgPT4gdm9pZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElGaWVsZFJlZ2lzdHJ5UHJvcHM8RmllbGRQcm9wcyA9IEZvcm1pbHlDb3JlLkZpZWxkUHJvcHM+IHtcbiAgcGF0aD86IEZvcm1QYXRoUGF0dGVyblxuICBuYW1lPzogRm9ybVBhdGhQYXR0ZXJuXG4gIHZhbHVlPzogYW55XG4gIHZhbHVlcz86IGFueVtdXG4gIGluaXRpYWxWYWx1ZT86IGFueVxuICBwcm9wcz86IEZpZWxkUHJvcHNcbiAgcnVsZXM/OiBWYWxpZGF0ZVBhdHRlcm5SdWxlc1tdIHwgVmFsaWRhdGVQYXR0ZXJuUnVsZXNcbiAgcmVxdWlyZWQ/OiBib29sZWFuXG4gIGVkaXRhYmxlPzogYm9vbGVhblxuICB1bm1vdW50UmVtb3ZlVmFsdWU/OiBib29sZWFuXG4gIHZpc2libGU/OiBib29sZWFuXG4gIGRpc3BsYXk/OiBib29sZWFuXG4gIGRhdGFUeXBlPzogc3RyaW5nXG4gIGNvbXB1dGVTdGF0ZT86IChkcmFmdDogSUZpZWxkU3RhdGUsIHByZXZTdGF0ZTogSUZpZWxkU3RhdGUpID0+IHZvaWRcbn1cblxuZXhwb3J0IGNvbnN0IGlzRmllbGQgPSAodGFyZ2V0OiBhbnkpOiB0YXJnZXQgaXMgSUZpZWxkID0+XG4gIHRhcmdldCAmJlxuICB0YXJnZXQuZGlzcGxheU5hbWUgPT09ICdGaWVsZFN0YXRlJyAmJlxuICBpc0ZuKHRhcmdldC5nZXRTdGF0ZSkgJiZcbiAgaXNGbih0YXJnZXQuc2V0U3RhdGUpXG5cbmV4cG9ydCBjb25zdCBpc0ZpZWxkU3RhdGUgPSAodGFyZ2V0OiBhbnkpOiB0YXJnZXQgaXMgSUZpZWxkU3RhdGUgPT5cbiAgdGFyZ2V0ICYmIHRhcmdldC5kaXNwbGF5TmFtZSA9PT0gJ0ZpZWxkU3RhdGUnICYmIHRhcmdldC5uYW1lICYmIHRhcmdldC5wYXRoXG5cbmV4cG9ydCBjb25zdCBpc0Zvcm1TdGF0ZSA9ICh0YXJnZXQ6IGFueSk6IHRhcmdldCBpcyBJRm9ybVN0YXRlID0+XG4gIHRhcmdldCAmJiB0YXJnZXQuZGlzcGxheU5hbWUgPT09ICdGb3JtU3RhdGUnXG5cbmV4cG9ydCBjb25zdCBpc1ZpcnR1YWxGaWVsZCA9ICh0YXJnZXQ6IGFueSk6IHRhcmdldCBpcyBJVmlydHVhbEZpZWxkID0+XG4gIHRhcmdldCAmJlxuICB0YXJnZXQuZGlzcGxheU5hbWUgPT09ICdWaXJ0dWFsRmllbGRTdGF0ZScgJiZcbiAgaXNGbih0YXJnZXQuZ2V0U3RhdGUpICYmXG4gIGlzRm4odGFyZ2V0LnNldFN0YXRlKVxuXG5leHBvcnQgY29uc3QgaXNWaXJ0dWFsRmllbGRTdGF0ZSA9IChcbiAgdGFyZ2V0OiBhbnlcbik6IHRhcmdldCBpcyBJVmlydHVhbEZpZWxkU3RhdGUgPT5cbiAgdGFyZ2V0ICYmIHRhcmdldC5kaXNwbGF5TmFtZSA9PT0gJ1ZpcnR1YWxGaWVsZFN0YXRlJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElGb3JtU3RhdGU8Rm9ybVByb3BzID0gYW55PiB7XG4gIHZhbGlkOiBib29sZWFuXG4gIGludmFsaWQ6IGJvb2xlYW5cbiAgbG9hZGluZzogYm9vbGVhblxuICB2YWxpZGF0aW5nOiBib29sZWFuXG4gIG1vZGlmaWVkOiBib29sZWFuXG4gIHN1Ym1pdHRpbmc6IGJvb2xlYW5cbiAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW5cbiAgZWRpdGFibGU6IGJvb2xlYW4gfCAoKG5hbWU6IHN0cmluZykgPT4gYm9vbGVhbilcbiAgZXJyb3JzOiBBcnJheTx7XG4gICAgcGF0aDogc3RyaW5nXG4gICAgbWVzc2FnZXM6IHN0cmluZ1tdXG4gIH0+XG4gIHdhcm5pbmdzOiBBcnJheTx7XG4gICAgcGF0aDogc3RyaW5nXG4gICAgbWVzc2FnZXM6IHN0cmluZ1tdXG4gIH0+XG4gIHZhbHVlczogYW55XG4gIGluaXRpYWxWYWx1ZXM6IGFueVxuICBtb3VudGVkOiBib29sZWFuXG4gIHVubW91bnRlZDogYm9vbGVhblxuICBwcm9wczogRm9ybVByb3BzXG4gIFtrZXk6IHN0cmluZ106IGFueVxufVxuXG5leHBvcnQgdHlwZSBGb3JtU3RhdGVEaXJ0eU1hcCA9IFN0YXRlRGlydHlNYXA8SUZvcm1TdGF0ZT5cblxuZXhwb3J0IHR5cGUgSUZvcm1TdGF0ZVByb3BzID0ge31cblxuZXhwb3J0IGludGVyZmFjZSBJRm9ybUNyZWF0b3JPcHRpb25zIHtcbiAgaW5pdGlhbFZhbHVlcz86IHt9XG4gIHZhbHVlcz86IHt9XG4gIGxpZmVjeWNsZXM/OiBGb3JtTGlmZUN5Y2xlW11cbiAgZWRpdGFibGU/OiBib29sZWFuIHwgKChuYW1lOiBzdHJpbmcpID0+IGJvb2xlYW4pXG4gIHZhbGlkYXRlRmlyc3Q/OiBib29sZWFuXG4gIG9uQ2hhbmdlPzogKHZhbHVlczogSUZvcm1TdGF0ZVsndmFsdWVzJ10pID0+IHZvaWRcbiAgb25TdWJtaXQ/OiAodmFsdWVzOiBJRm9ybVN0YXRlWyd2YWx1ZXMnXSkgPT4gYW55IHwgUHJvbWlzZTxhbnk+XG4gIG9uUmVzZXQ/OiAoKSA9PiB2b2lkXG4gIG9uVmFsaWRhdGVGYWlsZWQ/OiAodmFsaWRhdGVkOiBJRm9ybVZhbGlkYXRlUmVzdWx0KSA9PiB2b2lkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVZpcnR1YWxGaWVsZFN0YXRlPFxuICBGaWVsZFByb3BzID0gRm9ybWlseUNvcmUuVmlydHVhbEZpZWxkUHJvcHNcbj4ge1xuICBuYW1lOiBzdHJpbmdcbiAgcGF0aDogc3RyaW5nXG4gIGRpc3BsYXlOYW1lPzogc3RyaW5nXG4gIGluaXRpYWxpemVkOiBib29sZWFuXG4gIHZpc2libGU6IGJvb2xlYW5cbiAgZGlzcGxheTogYm9vbGVhblxuICBtb3VudGVkOiBib29sZWFuXG4gIHVubW91bnRlZDogYm9vbGVhblxuICBwcm9wczogRmllbGRQcm9wc1xuICBba2V5OiBzdHJpbmddOiBhbnlcbn1cbmV4cG9ydCB0eXBlIFZpcnR1YWxGaWVsZFN0YXRlRGlydHlNYXAgPSBTdGF0ZURpcnR5TWFwPElGaWVsZFN0YXRlPlxuXG5leHBvcnQgaW50ZXJmYWNlIElWaXJ0dWFsRmllbGRTdGF0ZVByb3BzIHtcbiAgZGF0YVBhdGg/OiBGb3JtUGF0aFBhdHRlcm5cbiAgbm9kZVBhdGg/OiBGb3JtUGF0aFBhdHRlcm5cbiAgY29tcHV0ZVN0YXRlPzogKFxuICAgIGRyYWZ0OiBJVmlydHVhbEZpZWxkU3RhdGUsXG4gICAgcHJldlN0YXRlOiBJVmlydHVhbEZpZWxkU3RhdGVcbiAgKSA9PiB2b2lkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVZpcnR1YWxGaWVsZFJlZ2lzdHJ5UHJvcHM8RmllbGRQcm9wcyA9IGFueT4ge1xuICBuYW1lPzogRm9ybVBhdGhQYXR0ZXJuXG4gIHBhdGg/OiBGb3JtUGF0aFBhdHRlcm5cbiAgZGlzcGxheT86IGJvb2xlYW5cbiAgdmlzaWJsZT86IGJvb2xlYW5cbiAgY29tcHV0ZVN0YXRlPzogKFxuICAgIGRyYWZ0OiBJVmlydHVhbEZpZWxkU3RhdGUsXG4gICAgcHJldlN0YXRlOiBJVmlydHVhbEZpZWxkU3RhdGVcbiAgKSA9PiB2b2lkXG4gIHByb3BzPzogRmllbGRQcm9wc1xufVxuXG5leHBvcnQgdHlwZSBJRm9ybVZhbGlkYXRlUmVzdWx0ID0gVmFsaWRhdGVOb2RlUmVzdWx0XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUZvcm1TdWJtaXRSZXN1bHQge1xuICB2YWx1ZXM6IGFueVxuICB2YWxpZGF0ZWQ6IElGb3JtVmFsaWRhdGVSZXN1bHRcbiAgcGF5bG9hZDogYW55XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUZvcm1SZXNldE9wdGlvbnMge1xuICBmb3JjZUNsZWFyPzogYm9vbGVhblxuICB2YWxpZGF0ZT86IGJvb2xlYW5cbiAgY2xlYXJJbml0aWFsVmFsdWU/OiBib29sZWFuXG4gIHNlbGVjdG9yPzogRm9ybVBhdGhQYXR0ZXJuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUZvcm1HcmFwaCB7XG4gIFtwYXRoOiBzdHJpbmddOiBJRm9ybVN0YXRlIHwgSUZpZWxkU3RhdGUgfCBJVmlydHVhbEZpZWxkU3RhdGVcbn1cblxuZXhwb3J0IHR5cGUgSUZvcm1FeHRlbmRlZFZhbGlkYXRlRmllbGRPcHRpb25zID0gVmFsaWRhdGVGaWVsZE9wdGlvbnMgJiB7XG4gIHRocm93RXJyb3JzPzogYm9vbGVhblxuICBob3N0UmVuZGVyaW5nPzogYm9vbGVhblxufVxuXG5leHBvcnQgdHlwZSBJTXV0YXRvcnMgPSBSZXR1cm5UeXBlPElGb3JtWydjcmVhdGVNdXRhdG9ycyddPlxuXG5leHBvcnQgdHlwZSBJRmllbGQgPSBJbnN0YW5jZVR5cGU8dHlwZW9mIEZpZWxkPlxuXG5leHBvcnQgdHlwZSBJVmlydHVhbEZpZWxkID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWaXJ0dWFsRmllbGQ+XG5cbmV4cG9ydCB0eXBlIElGb3JtID0gUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlRm9ybT5cblxuZXhwb3J0IHR5cGUgSUZvcm1QbHVnaW48XG4gIENvbnRleHQgZXh0ZW5kcyB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0gYW55LFxuICBFeHBvcnRzIGV4dGVuZHMge1xuICAgIFtrZXk6IHN0cmluZ106ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55XG4gIH0gPSBhbnlcbj4gPSAoXG4gIGNvbnRleHQ6IENvbnRleHRcbikgPT4ge1xuICBjb250ZXh0Pzoge1xuICAgIFtrZXk6IHN0cmluZ106IGFueVxuICB9XG4gIGV4cG9ydHM/OiBFeHBvcnRzXG59IHwgdm9pZFxuXG5leHBvcnQgdHlwZSBJRm9ybVBsdWdpbkV4cG9ydHM8UD4gPSBQIGV4dGVuZHMgKFxuICBjb250ZXh0OiBhbnlcbikgPT4ge1xuICBjb250ZXh0Pzoge1xuICAgIFtrZXk6IHN0cmluZ106IGFueVxuICB9XG4gIGV4cG9ydHM/OiBpbmZlciBQXG59IHwgdm9pZFxuICA/IFBcbiAgOiB7fVxuXG5leHBvcnQgY29uc3QgaXNTdGF0ZU1vZGVsID0gKHBheWxvYWQ6IGFueSkgPT4ge1xuICByZXR1cm4gaXNGbihwYXlsb2FkPy5nZXRTdGF0ZSlcbn1cbiIsImltcG9ydCB7IElGb3JtQ3JlYXRvck9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgRm9ybUdyYXBoIH0gZnJvbSAnLi9zaGFyZWQvZ3JhcGgnXG5pbXBvcnQgeyBGb3JtSGVhcnQgfSBmcm9tICcuL3NoYXJlZC9saWZlY3ljbGUnXG5pbXBvcnQgeyBGb3JtIH0gZnJvbSAnLi9tb2RlbHMvZm9ybSdcbmltcG9ydCB7IEZvcm1WYWxpZGF0b3IgfSBmcm9tICdAZm9ybWlseS92YWxpZGF0b3InXG5pbXBvcnQge1xuICBGb3JtUGF0aCxcbiAgRm9ybVBhdGhQYXR0ZXJuLFxuICBpc1ZhbGlkLFxuICBpc0VxdWFsLFxuICBjbG9uZSxcbiAgaXNGbixcbiAgZGVmYXVsdHNcbn0gZnJvbSAnQGZvcm1pbHkvc2hhcmVkJ1xuaW1wb3J0IHtcbiAgTGlmZUN5Y2xlVHlwZXMsXG4gIElGb3JtU3RhdGUsXG4gIGlzVmlydHVhbEZpZWxkLFxuICBJVmlydHVhbEZpZWxkU3RhdGUsXG4gIElGaWVsZFN0YXRlLFxuICBJRmllbGQsXG4gIElWaXJ0dWFsRmllbGRcbn0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUZvcm1JbnRlcm5hbHMgPSAob3B0aW9uczogSUZvcm1DcmVhdG9yT3B0aW9ucyA9IHt9KSA9PiB7XG4gIGZ1bmN0aW9uIG9uRm9ybUNoYW5nZShwdWJsaXNoZWQ6IElGb3JtU3RhdGUpIHtcbiAgICBjb25zdCB7IGRpcnR5cyB9ID0gZm9ybVxuXG4gICAgaWYgKGRpcnR5cy52YWx1ZXMpIHtcbiAgICAgIG5vdGlmeUZvcm1WYWx1ZXNDaGFuZ2UoKVxuICAgIH1cbiAgICBpZiAoZGlydHlzLmluaXRpYWxWYWx1ZXMpIHtcbiAgICAgIGlmICghZW52LnVwbG9hZGluZykge1xuICAgICAgICBmb3JtLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICAgICAgICBzdGF0ZS52YWx1ZXMgPSBkZWZhdWx0cyhwdWJsaXNoZWQuaW5pdGlhbFZhbHVlcywgcHVibGlzaGVkLnZhbHVlcylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIG5vdGlmeUZvcm1Jbml0aWFsVmFsdWVzQ2hhbmdlKClcbiAgICB9XG4gICAgaWYgKGRpcnR5cy51bm1vdW50ZWQgJiYgcHVibGlzaGVkLnVubW91bnRlZCkge1xuICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX1VOTU9VTlQsIGZvcm0pXG4gICAgfVxuICAgIGlmIChkaXJ0eXMubW91bnRlZCAmJiBwdWJsaXNoZWQubW91bnRlZCkge1xuICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX01PVU5ULCBmb3JtKVxuICAgIH1cbiAgICBpZiAoZGlydHlzLmluaXRpYWxpemVkKSB7XG4gICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZPUk1fSU5JVCwgZm9ybSlcbiAgICB9XG4gICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX0NIQU5HRSwgZm9ybSlcbiAgICBpZiAoZW52Lmhvc3RSZW5kZXJpbmcpIHtcbiAgICAgIGVudi5ob3N0UmVuZGVyaW5nID1cbiAgICAgICAgZGlydHlzLnZhbHVlcyB8fCBkaXJ0eXMuaW5pdGlhbFZhbHVlcyB8fCBkaXJ0eXMuZWRpdGFibGVcbiAgICB9XG4gICAgcmV0dXJuIGVudi5ob3N0UmVuZGVyaW5nXG4gIH1cblxuICBmdW5jdGlvbiBub3RpZnlGb3JtVmFsdWVzQ2hhbmdlKCkge1xuICAgIGlmIChpc0ZuKG9wdGlvbnMub25DaGFuZ2UpICYmIGZvcm0uc3RhdGUubW91bnRlZCAmJiAhZm9ybS5zdGF0ZS51bm1vdW50ZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dChlbnYub25DaGFuZ2VUaW1lcilcbiAgICAgIGVudi5vbkNoYW5nZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmIChmb3JtLnN0YXRlLnVubW91bnRlZCkgcmV0dXJuXG4gICAgICAgIG9wdGlvbnMub25DaGFuZ2UoY2xvbmUoZ2V0Rm9ybVZhbHVlc0luKCcnKSkpXG4gICAgICB9KVxuICAgIH1cbiAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZPUk1fVkFMVUVTX0NIQU5HRSwgZm9ybSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdGlmeUZvcm1Jbml0aWFsVmFsdWVzQ2hhbmdlKCkge1xuICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRk9STV9JTklUSUFMX1ZBTFVFU19DSEFOR0UsIGZvcm0pXG4gIH1cblxuICBmdW5jdGlvbiBvbkdyYXBoQ2hhbmdlKHsgdHlwZSwgcGF5bG9hZCB9KSB7XG4gICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX0dSQVBIX0NIQU5HRSwgZ3JhcGgpXG4gICAgaWYgKHR5cGUgPT09ICdHUkFQSF9OT0RFX1dJTExfVU5NT1VOVCcpIHtcbiAgICAgIHZhbGlkYXRvci51bnJlZ2lzdGVyKHBheWxvYWQucGF0aC50b1N0cmluZygpKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEZvcm1JbihcbiAgICBwYXRoOiBGb3JtUGF0aFBhdHRlcm4sXG4gICAga2V5OiBzdHJpbmcsXG4gICAgdmFsdWU6IGFueSxcbiAgICBzaWxlbnQ/OiBib29sZWFuXG4gICkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHNpbGVudCA/ICdzZXRTb3VyY2VTdGF0ZScgOiAnc2V0U3RhdGUnXG4gICAgZm9ybVttZXRob2RdKHN0YXRlID0+IHtcbiAgICAgIEZvcm1QYXRoLnNldEluKHN0YXRlW2tleV0sIGdldERhdGFQYXRoKHBhdGgpLCB2YWx1ZSlcbiAgICAgIGlmIChrZXkgPT09ICd2YWx1ZXMnKSB7XG4gICAgICAgIHN0YXRlLm1vZGlmaWVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0sIHNpbGVudClcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlbGV0ZUZvcm1JbihwYXRoOiBGb3JtUGF0aFBhdHRlcm4sIGtleTogc3RyaW5nLCBzaWxlbnQ/OiBib29sZWFuKSB7XG4gICAgY29uc3QgbWV0aG9kID0gc2lsZW50ID8gJ3NldFNvdXJjZVN0YXRlJyA6ICdzZXRTdGF0ZSdcbiAgICBmb3JtW21ldGhvZF0oc3RhdGUgPT4ge1xuICAgICAgRm9ybVBhdGguZGVsZXRlSW4oc3RhdGVba2V5XSwgZ2V0RGF0YVBhdGgocGF0aCkpXG4gICAgICBpZiAoa2V5ID09PSAndmFsdWVzJykge1xuICAgICAgICBzdGF0ZS5tb2RpZmllZCA9IHRydWVcbiAgICAgIH1cbiAgICB9LCBzaWxlbnQpXG4gIH1cblxuICBmdW5jdGlvbiBkZWxldGVGb3JtVmFsdWVzSW4ocGF0aDogRm9ybVBhdGhQYXR0ZXJuLCBzaWxlbnQ/OiBib29sZWFuKSB7XG4gICAgZGVsZXRlRm9ybUluKHBhdGgsICd2YWx1ZXMnLCBzaWxlbnQpXG4gIH1cblxuICBmdW5jdGlvbiBzZXRGb3JtVmFsdWVzSW4oXG4gICAgcGF0aDogRm9ybVBhdGhQYXR0ZXJuLFxuICAgIHZhbHVlPzogYW55LFxuICAgIHNpbGVudD86IGJvb2xlYW5cbiAgKSB7XG4gICAgcmV0dXJuIHNldEZvcm1JbihwYXRoLCAndmFsdWVzJywgdmFsdWUsIHNpbGVudClcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEZvcm1Jbml0aWFsVmFsdWVzSW4oXG4gICAgcGF0aDogRm9ybVBhdGhQYXR0ZXJuLFxuICAgIHZhbHVlPzogYW55LFxuICAgIHNpbGVudD86IGJvb2xlYW5cbiAgKSB7XG4gICAgcmV0dXJuIHNldEZvcm1JbihwYXRoLCAnaW5pdGlhbFZhbHVlcycsIHZhbHVlLCBzaWxlbnQpXG4gIH1cblxuICBmdW5jdGlvbiBnZXRGb3JtSW4ocGF0aDogRm9ybVBhdGhQYXR0ZXJuLCBrZXk/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gZm9ybS5nZXRTdGF0ZShzdGF0ZSA9PiBGb3JtUGF0aC5nZXRJbihzdGF0ZVtrZXldLCBnZXREYXRhUGF0aChwYXRoKSkpXG4gIH1cblxuICBmdW5jdGlvbiBnZXRGb3JtVmFsdWVzSW4ocGF0aDogRm9ybVBhdGhQYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGdldEZvcm1JbihwYXRoLCAndmFsdWVzJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4aXN0Rm9ybVZhbHVlc0luKHBhdGg6IEZvcm1QYXRoUGF0dGVybikge1xuICAgIHJldHVybiBmb3JtLmdldFN0YXRlKHN0YXRlID0+XG4gICAgICBGb3JtUGF0aC5leGlzdEluKHN0YXRlLnZhbHVlcywgZ2V0RGF0YVBhdGgocGF0aCkpXG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Rm9ybUluaXRpYWxWYWx1ZXNJbihwYXRoOiBGb3JtUGF0aFBhdHRlcm4pIHtcbiAgICByZXR1cm4gZ2V0Rm9ybUluKHBhdGgsICdpbml0aWFsVmFsdWVzJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldERhdGFQYXRoKHBhdGg6IEZvcm1QYXRoUGF0dGVybikge1xuICAgIGNvbnN0IG5ld1BhdGggPSBGb3JtUGF0aC5nZXRQYXRoKHBhdGgpXG4gICAgcmV0dXJuIG5ld1BhdGgucmVkdWNlKChwYXRoOiBGb3JtUGF0aCwga2V5OiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChpbmRleCA+PSBuZXdQYXRoLmxlbmd0aCAtIDEpIHJldHVybiBwYXRoLmNvbmNhdChba2V5XSlcbiAgICAgIGNvbnN0IHJlYWxQYXRoID0gbmV3UGF0aC5zbGljZSgwLCBpbmRleCArIDEpXG4gICAgICBjb25zdCBkYXRhUGF0aCA9IHBhdGguY29uY2F0KFtrZXldKVxuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBncmFwaC5nZXQocmVhbFBhdGgpXG4gICAgICBpZiAoaXNWaXJ0dWFsRmllbGQoc2VsZWN0ZWQpKSB7XG4gICAgICAgIHJldHVybiBwYXRoXG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YVBhdGhcbiAgICB9LCBGb3JtUGF0aC5nZXRQYXRoKCcnKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hdGNoU3RyYXRlZ3koXG4gICAgcGF0dGVybjogRm9ybVBhdGhQYXR0ZXJuLFxuICAgIG5vZGVQYXRoOiBGb3JtUGF0aFBhdHRlcm5cbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbWF0Y2hQYXR0ZXJuID0gRm9ybVBhdGgucGFyc2UocGF0dGVybilcbiAgICBjb25zdCBub2RlID0gZ3JhcGguZ2V0KG5vZGVQYXRoKVxuICAgIGlmICghbm9kZSkgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIG5vZGUuZ2V0U291cmNlU3RhdGUoc3RhdGUgPT5cbiAgICAgIG1hdGNoUGF0dGVybi5tYXRjaEFsaWFzR3JvdXAoc3RhdGUubmFtZSwgc3RhdGUucGF0aClcbiAgICApXG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVSZWNvdmVyYWJsZVNob3duU3RhdGUoXG4gICAgcGFyZW50U3RhdGU6XG4gICAgICB8IElWaXJ0dWFsRmllbGRTdGF0ZTxGb3JtaWx5Q29yZS5WaXJ0dWFsRmllbGRQcm9wcz5cbiAgICAgIHwgSUZpZWxkU3RhdGU8Rm9ybWlseUNvcmUuRmllbGRQcm9wcz4sXG4gICAgY2hpbGRTdGF0ZTpcbiAgICAgIHwgSVZpcnR1YWxGaWVsZFN0YXRlPEZvcm1pbHlDb3JlLlZpcnR1YWxGaWVsZFByb3BzPlxuICAgICAgfCBJRmllbGRTdGF0ZTxGb3JtaWx5Q29yZS5GaWVsZFByb3BzPixcbiAgICBuYW1lOiAndmlzaWJsZScgfCAnZGlzcGxheSdcbiAgKSB7XG4gICAgY29uc3QgbGFzdFNob3duU3RhdGUgPSBlbnYubGFzdFNob3duU3RhdGVzW2NoaWxkU3RhdGUucGF0aF1cbiAgICBjb25zdCBsYXN0U3RhdGVWYWx1ZSA9IGNoaWxkU3RhdGVbbmFtZV1cbiAgICBpZiAocGFyZW50U3RhdGVbbmFtZV0gJiYgbGFzdFNob3duU3RhdGUgJiYgbGFzdFNob3duU3RhdGVbbmFtZV0gPT09IGZhbHNlKSB7XG4gICAgICBjaGlsZFN0YXRlW25hbWVdID0gZmFsc2VcbiAgICAgIGRlbGV0ZSBsYXN0U2hvd25TdGF0ZVtuYW1lXVxuICAgICAgaWYgKFxuICAgICAgICAhbGFzdFNob3duU3RhdGUuaGFzT3duUHJvcGVydHkoJ3Zpc2libGUnKSAmJlxuICAgICAgICAhbGFzdFNob3duU3RhdGUuaGFzT3duUHJvcGVydHkoJ2Rpc3BsYXknKVxuICAgICAgKSB7XG4gICAgICAgIGRlbGV0ZSBlbnYubGFzdFNob3duU3RhdGVzW2NoaWxkU3RhdGUucGF0aF1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGRTdGF0ZVtuYW1lXSA9IHBhcmVudFN0YXRlW25hbWVdXG4gICAgfVxuICAgIGlmICghcGFyZW50U3RhdGVbbmFtZV0gJiYgIWxhc3RTdGF0ZVZhbHVlKSB7XG4gICAgICBpZiAoIWxhc3RTaG93blN0YXRlKSB7XG4gICAgICAgIGVudi5sYXN0U2hvd25TdGF0ZXNbY2hpbGRTdGF0ZS5wYXRoXSA9IHt9XG4gICAgICB9XG4gICAgICBlbnYubGFzdFNob3duU3RhdGVzW2NoaWxkU3RhdGUucGF0aF1bbmFtZV0gPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0Rm9ybU1lc3NhZ2VzKGZpZWxkU3RhdGU6IElGaWVsZFN0YXRlKSB7XG4gICAgY29uc3QgeyBwYXRoLCB2aXNpYmxlLCBkaXNwbGF5LCB1bm1vdW50ZWQsIGVkaXRhYmxlIH0gPSBmaWVsZFN0YXRlXG4gICAgaWYgKFxuICAgICAgZWRpdGFibGUgPT09IGZhbHNlIHx8XG4gICAgICB2aXNpYmxlID09PSBmYWxzZSB8fFxuICAgICAgdW5tb3VudGVkID09PSB0cnVlIHx8XG4gICAgICBkaXNwbGF5ID09PSBmYWxzZVxuICAgICkge1xuICAgICAgZm9ybS5zZXRTdGF0ZShzdGF0ZSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0Vycm9ycyA9IHN0YXRlLmVycm9ycz8ucmVkdWNlPy4oKGJ1ZjogYW55LCBpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5wYXRoID09PSBwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVmXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBidWYuY29uY2F0KGl0ZW0pXG4gICAgICAgICAgfVxuICAgICAgICB9LCBbXSlcbiAgICAgICAgY29uc3QgbmV3V2FybmluZ3MgPSBzdGF0ZS53YXJuaW5ncz8ucmVkdWNlPy4oKGJ1ZjogYW55LCBpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5wYXRoID09PSBwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVmXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBidWYuY29uY2F0KGl0ZW0pXG4gICAgICAgICAgfVxuICAgICAgICB9LCBbXSlcbiAgICAgICAgY29uc3QgZXJyb3JzQ2hhbmdlZCA9ICFpc0VxdWFsKHN0YXRlLmVycm9ycywgbmV3RXJyb3JzKVxuICAgICAgICBjb25zdCB3YXJuaW5nc0NoYW5nZWQgPSAhaXNFcXVhbChzdGF0ZS53YXJuaW5ncywgbmV3V2FybmluZ3MpXG4gICAgICAgIGlmICh3YXJuaW5nc0NoYW5nZWQpIHtcbiAgICAgICAgICBzdGF0ZS53YXJuaW5ncyA9IG5ld1dhcm5pbmdzXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yc0NoYW5nZWQpIHtcbiAgICAgICAgICBzdGF0ZS5lcnJvcnMgPSBuZXdFcnJvcnNcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzeW5jRm9ybU1lc3NhZ2VzKFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICBmaWVsZFN0YXRlOiBQYXJ0aWFsPElGaWVsZFN0YXRlPixcbiAgICBzaWxlbnQ/OiBib29sZWFuXG4gICkge1xuICAgIGNvbnN0IHsgbmFtZSwgcGF0aCB9ID0gZmllbGRTdGF0ZVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gZmllbGRTdGF0ZVt0eXBlXVxuICAgIGZvcm0uc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgICAgbGV0IGZvdW5kRmllbGQgPSBmYWxzZVxuICAgICAgY29uc3QgbmV3TWVzc2FnZXMgPSBzdGF0ZVt0eXBlXT8ucmVkdWNlPy4oKGJ1ZjogYW55LCBpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGl0ZW0ucGF0aCA9PT0gcGF0aCkge1xuICAgICAgICAgIGZvdW5kRmllbGQgPSB0cnVlXG4gICAgICAgICAgcmV0dXJuIG1lc3NhZ2VzLmxlbmd0aCA/IGJ1Zi5jb25jYXQoeyBuYW1lLCBwYXRoLCBtZXNzYWdlcyB9KSA6IGJ1ZlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBidWYuY29uY2F0KGl0ZW0pXG4gICAgICAgIH1cbiAgICAgIH0sIFtdKVxuICAgICAgY29uc3QgbWVzc2FnZUNoYW5nZWQgPSAhaXNFcXVhbChzdGF0ZVt0eXBlXSwgbmV3TWVzc2FnZXMpXG4gICAgICBpZiAobWVzc2FnZUNoYW5nZWQpIHtcbiAgICAgICAgc3RhdGVbdHlwZV0gPSBuZXdNZXNzYWdlc1xuICAgICAgfVxuICAgICAgaWYgKCFmb3VuZEZpZWxkICYmIG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgICBzdGF0ZVt0eXBlXS5wdXNoKHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgbWVzc2FnZXNcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LCBzaWxlbnQpXG4gIH1cblxuICBmdW5jdGlvbiBiYXRjaFJ1blRhc2tRdWV1ZShcbiAgICBmaWVsZDogSUZpZWxkIHwgSVZpcnR1YWxGaWVsZCxcbiAgICBub2RlUGF0aDogRm9ybVBhdGhcbiAgKSB7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGVudi50YXNrUXVldWUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCB7IHBhdHRlcm4sIGNhbGxiYWNrcyB9ID0gZW52LnRhc2tRdWV1ZVtpbmRleF1cbiAgICAgIGxldCByZW1vdmVkID0gZmFsc2VcbiAgICAgIGlmIChtYXRjaFN0cmF0ZWd5KHBhdHRlcm4sIG5vZGVQYXRoKSkge1xuICAgICAgICBjYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiB7XG4gICAgICAgICAgZmllbGQuc2V0U3RhdGUoY2FsbGJhY2spXG4gICAgICAgIH0pXG4gICAgICAgIGlmICghcGF0dGVybi5pc1dpbGRNYXRjaFBhdHRlcm4gJiYgIXBhdHRlcm4uaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICBlbnYudGFza1F1ZXVlLnNwbGljZShpbmRleC0tLCAxKVxuICAgICAgICAgIHJlbW92ZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghcmVtb3ZlZCkge1xuICAgICAgICBlbnYudGFza0luZGV4ZXNbcGF0dGVybi50b1N0cmluZygpXSA9IGluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgZW52LnRhc2tJbmRleGVzW3BhdHRlcm4udG9TdHJpbmcoKV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwdXNoVGFza1F1ZXVlKHBhdHRlcm46IEZvcm1QYXRoLCBjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgIGNvbnN0IGlkID0gcGF0dGVybi50b1N0cmluZygpXG4gICAgY29uc3QgdGFza0luZGV4ID0gZW52LnRhc2tJbmRleGVzW2lkXVxuICAgIGlmIChpc1ZhbGlkKHRhc2tJbmRleCkpIHtcbiAgICAgIGlmIChcbiAgICAgICAgZW52LnRhc2tRdWV1ZVt0YXNrSW5kZXhdICYmXG4gICAgICAgICFlbnYudGFza1F1ZXVlW3Rhc2tJbmRleF0uY2FsbGJhY2tzLnNvbWUoKGZuOiBhbnkpID0+XG4gICAgICAgICAgZm4udG9TdHJpbmcoKSA9PT0gY2FsbGJhY2sudG9TdHJpbmcoKSA/IGZuID09PSBjYWxsYmFjayA6IGZhbHNlXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICBlbnYudGFza1F1ZXVlW3Rhc2tJbmRleF0uY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVudi50YXNrSW5kZXhlc1tpZF0gPSBlbnYudGFza1F1ZXVlLmxlbmd0aFxuICAgICAgZW52LnRhc2tRdWV1ZS5wdXNoKHtcbiAgICAgICAgcGF0dGVybixcbiAgICAgICAgY2FsbGJhY2tzOiBbY2FsbGJhY2tdXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQ8VD4oYWN0aW9uczogVCkge1xuICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRk9STV9XSUxMX0lOSVQsIGZvcm0sIGFjdGlvbnMpXG4gICAgZ3JhcGguYXBwZW5kTm9kZShmb3JtKVxuICAgIGZvcm0uc2V0U3RhdGUoKHN0YXRlOiBJRm9ybVN0YXRlKSA9PiB7XG4gICAgICBzdGF0ZS5pbml0aWFsaXplZCA9IHRydWVcbiAgICAgIGlmIChpc1ZhbGlkKG9wdGlvbnMuaW5pdGlhbFZhbHVlcykpIHtcbiAgICAgICAgc3RhdGUuaW5pdGlhbFZhbHVlcyA9IGNsb25lKG9wdGlvbnMuaW5pdGlhbFZhbHVlcylcbiAgICAgIH1cbiAgICAgIGlmIChpc1ZhbGlkKG9wdGlvbnMudmFsdWVzKSkge1xuICAgICAgICBzdGF0ZS52YWx1ZXMgPSBjbG9uZShvcHRpb25zLnZhbHVlcylcbiAgICAgIH1cbiAgICAgIGlmICghaXNWYWxpZChzdGF0ZS52YWx1ZXMpKSB7XG4gICAgICAgIHN0YXRlLnZhbHVlcyA9IHN0YXRlLmluaXRpYWxWYWx1ZXNcbiAgICAgIH1cbiAgICAgIGlmIChpc1ZhbGlkKG9wdGlvbnMuZWRpdGFibGUpKSB7XG4gICAgICAgIHN0YXRlLmVkaXRhYmxlID0gb3B0aW9ucy5lZGl0YWJsZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBob3N0VXBkYXRlKGNhbGxiYWNrPzogKCkgPT4gYW55LCBmb3JjZVVwZGF0ZT86IGJvb2xlYW4pOiBhbnkge1xuICAgIGlmIChpc0ZuKGNhbGxiYWNrKSkge1xuICAgICAgZW52Lmhvc3RSZW5kZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCByZXN1bHQgPSBjYWxsYmFjaygpXG4gICAgICBpZiAoZW52Lmhvc3RSZW5kZXJpbmcgfHwgZm9yY2VVcGRhdGUpIHtcbiAgICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX0hPU1RfUkVOREVSLCBmb3JtKVxuICAgICAgfVxuICAgICAgZW52Lmhvc3RSZW5kZXJpbmcgPSBmYWxzZVxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrPzogKCkgPT4gdm9pZCkge1xuICAgIHNldFRpbWVvdXQoY2FsbGJhY2spXG4gIH1cblxuICBmdW5jdGlvbiBhZnRlclVubW91bnQoY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XG4gICAgY2xlYXJUaW1lb3V0KGVudi51bm1vdW50VGltZXIpXG4gICAgZW52LnVubW91bnRUaW1lciA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDApXG4gIH1cblxuICBmdW5jdGlvbiBpc0hvc3RSZW5kZXJpbmcoKSB7XG4gICAgcmV0dXJuIGVudi5ob3N0UmVuZGVyaW5nXG4gIH1cblxuICBmdW5jdGlvbiBkaXNhYmxlVW5tb3VudENsZWFyU3RhdGVzKHBhdHRlcm46IEZvcm1QYXRoUGF0dGVybiA9ICcqJykge1xuICAgIGNvbnN0IHBhdGggPSBGb3JtUGF0aC5wYXJzZShwYXR0ZXJuKVxuICAgIGVudi5jbGVhclN0YXRlc1BhdHRlcm5zW3BhdGgudG9TdHJpbmcoKV0gPSBmYWxzZVxuICB9XG5cbiAgZnVuY3Rpb24gZW5hYmxlVW5tb3VudENsZWFyU3RhdGVzKHBhdHRlcm46IEZvcm1QYXRoUGF0dGVybiA9ICcqJykge1xuICAgIGNvbnN0IHBhdGggPSBGb3JtUGF0aC5wYXJzZShwYXR0ZXJuKVxuICAgIGVudi5jbGVhclN0YXRlc1BhdHRlcm5zW3BhdGgudG9TdHJpbmcoKV0gPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBkaXNhYmxlVW5tb3VudFJlbW92ZU5vZGUoKSB7XG4gICAgZW52LnVubW91bnRSZW1vdmVOb2RlID0gZmFsc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuYWJsZVVubW91bnRSZW1vdmVOb2RlKCkge1xuICAgIGVudi51bm1vdW50UmVtb3ZlTm9kZSA9IHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIHN1cHBvcnRVbm1vdW50Q2xlYXJTdGF0ZXMocGF0aDogRm9ybVBhdGhQYXR0ZXJuKSB7XG4gICAgZm9yIChjb25zdCBwYXR0ZXJuIGluIGVudi5jbGVhclN0YXRlc1BhdHRlcm5zKSB7XG4gICAgICBjb25zdCBlbmFibGUgPSBlbnYuY2xlYXJTdGF0ZXNQYXR0ZXJuc1twYXR0ZXJuXVxuICAgICAgaWYgKG1hdGNoU3RyYXRlZ3kocGF0dGVybiwgcGF0aCkpIHtcbiAgICAgICAgcmV0dXJuIGVuYWJsZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZnVuY3Rpb24gdXBsb2FkKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgZW52LnVwbG9hZGluZyA9IHRydWVcbiAgICBjYWxsYmFjaygpXG4gICAgZW52LnVwbG9hZGluZyA9IGZhbHNlXG4gIH1cblxuICBjb25zdCBncmFwaCA9IG5ldyBGb3JtR3JhcGgoe1xuICAgIG1hdGNoU3RyYXRlZ3lcbiAgfSlcbiAgY29uc3QgZm9ybSA9IG5ldyBGb3JtKClcbiAgY29uc3QgdmFsaWRhdG9yID0gbmV3IEZvcm1WYWxpZGF0b3Ioe1xuICAgIC4uLm9wdGlvbnMsXG4gICAgbWF0Y2hTdHJhdGVneVxuICB9KVxuICBjb25zdCBoZWFydCA9IG5ldyBGb3JtSGVhcnQoe1xuICAgIC4uLm9wdGlvbnMsXG4gICAgYmVmb3JlTm90aWZ5OiBwYXlsb2FkID0+IHtcbiAgICAgIGVudi5wdWJsaXNoaW5nW3BheWxvYWQucGF0aCB8fCAnJ10gPSB0cnVlXG4gICAgfSxcbiAgICBhZnRlck5vdGlmeTogcGF5bG9hZCA9PiB7XG4gICAgICBlbnYucHVibGlzaGluZ1twYXlsb2FkLnBhdGggfHwgJyddID0gZmFsc2VcbiAgICB9XG4gIH0pXG4gIGNvbnN0IGVudiA9IHtcbiAgICB2YWxpZGF0ZVRpbWVyOiBudWxsLFxuICAgIHVubW91bnRUaW1lcjogbnVsbCxcbiAgICBzeW5jRm9ybVN0YXRlVGltZXI6IG51bGwsXG4gICAgb25DaGFuZ2VUaW1lcjogbnVsbCxcbiAgICBncmFwaENoYW5nZVRpbWVyOiBudWxsLFxuICAgIGhvc3RSZW5kZXJpbmc6IGZhbHNlLFxuICAgIHB1Ymxpc2hpbmc6IHt9LFxuICAgIHRhc2tRdWV1ZTogW10sXG4gICAgdXBsb2FkaW5nOiBmYWxzZSxcbiAgICB0YXNrSW5kZXhlczoge30sXG4gICAgcmVhbFJlbW92ZVRhZ3M6IFtdLFxuICAgIGxhc3RTaG93blN0YXRlczoge30sXG4gICAgY2xlYXJTdGF0ZXNQYXR0ZXJuczoge30sXG4gICAgdW5tb3VudFJlbW92ZU5vZGU6IGZhbHNlLFxuICAgIHN1Ym1pdHRpbmdUYXNrOiB1bmRlZmluZWRcbiAgfVxuICBmb3JtLnN1YnNjcmlwdGlvbiA9IHtcbiAgICBub3RpZnk6IG9uRm9ybUNoYW5nZVxuICB9XG4gIGdyYXBoLnN1YnNjcmliZShvbkdyYXBoQ2hhbmdlKVxuICByZXR1cm4ge1xuICAgIG9wdGlvbnMsXG4gICAgaW5pdCxcbiAgICBmb3JtLFxuICAgIGdyYXBoLFxuICAgIHZhbGlkYXRvcixcbiAgICBoZWFydCxcbiAgICBlbnYsXG4gICAgdXBsb2FkLFxuICAgIG5leHRUaWNrLFxuICAgIGFmdGVyVW5tb3VudCxcbiAgICBnZXREYXRhUGF0aCxcbiAgICBnZXRGb3JtVmFsdWVzSW4sXG4gICAgZ2V0Rm9ybUluaXRpYWxWYWx1ZXNJbixcbiAgICBzZXRGb3JtVmFsdWVzSW4sXG4gICAgc2V0Rm9ybUluaXRpYWxWYWx1ZXNJbixcbiAgICBleGlzdEZvcm1WYWx1ZXNJbixcbiAgICBkZWxldGVGb3JtVmFsdWVzSW4sXG4gICAgdXBkYXRlUmVjb3ZlcmFibGVTaG93blN0YXRlLFxuICAgIGRpc2FibGVVbm1vdW50Q2xlYXJTdGF0ZXMsXG4gICAgZW5hYmxlVW5tb3VudENsZWFyU3RhdGVzLFxuICAgIHN1cHBvcnRVbm1vdW50Q2xlYXJTdGF0ZXMsXG4gICAgZW5hYmxlVW5tb3VudFJlbW92ZU5vZGUsXG4gICAgZGlzYWJsZVVubW91bnRSZW1vdmVOb2RlLFxuICAgIHJlc2V0Rm9ybU1lc3NhZ2VzLFxuICAgIHN5bmNGb3JtTWVzc2FnZXMsXG4gICAgYmF0Y2hSdW5UYXNrUXVldWUsXG4gICAgcHVzaFRhc2tRdWV1ZSxcbiAgICBob3N0VXBkYXRlLFxuICAgIGlzSG9zdFJlbmRlcmluZ1xuICB9XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVNb2RlbCB9IGZyb20gJy4uL3NoYXJlZC9tb2RlbCdcbmltcG9ydCB7XG4gIElNb2RlbFNwZWMsXG4gIElGaWVsZFN0YXRlLFxuICBJRmllbGRTdGF0ZVByb3BzLFxuICBGaWVsZFN0YXRlRGlydHlNYXBcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQge1xuICBGb3JtUGF0aCxcbiAgaXNGbixcbiAgdG9BcnIsXG4gIGlzVmFsaWQsXG4gIGlzRXF1YWwsXG4gIGlzRW1wdHksXG4gIGlzQXJyLFxuICBpc1BsYWluT2JqXG59IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCB7IERyYWZ0IH0gZnJvbSAnaW1tZXInXG5cbmNvbnN0IG5vcm1hbGl6ZU1lc3NhZ2VzID0gKG1lc3NhZ2VzOiBhbnkpID0+IHRvQXJyKG1lc3NhZ2VzKS5maWx0ZXIodiA9PiAhIXYpXG5cbmNvbnN0IGNhbGN1bGF0ZUVkaXRhYmxlID0gKFxuICBzZWxmRWRpdGFibGU6IGJvb2xlYW4sXG4gIGZvcm1FZGl0YWJsZTogYm9vbGVhbiB8ICgobmFtZTogc3RyaW5nKSA9PiBib29sZWFuKSxcbiAgbmFtZTogc3RyaW5nXG4pID0+IHtcbiAgcmV0dXJuIGlzVmFsaWQoc2VsZkVkaXRhYmxlKVxuICAgID8gc2VsZkVkaXRhYmxlXG4gICAgOiBpc1ZhbGlkKGZvcm1FZGl0YWJsZSlcbiAgICA/IGlzRm4oZm9ybUVkaXRhYmxlKVxuICAgICAgPyBmb3JtRWRpdGFibGUobmFtZSlcbiAgICAgIDogZm9ybUVkaXRhYmxlXG4gICAgOiB0cnVlXG59XG5cbmV4cG9ydCBjb25zdCBBUlJBWV9VTklRVUVfVEFHID0gU3ltYm9sLmZvcihcbiAgJ0BAX19ZT1VfQ0FOX05FVkVSX1JFTU9WRV9BUlJBWV9VTklRVUVfVEFHX19AQCdcbilcblxuZXhwb3J0IGNvbnN0IHBhcnNlQXJyYXlUYWdzID0gKHZhbHVlOiBhbnlbXSkgPT4ge1xuICBpZiAoIWlzQXJyKHZhbHVlKSkgcmV0dXJuIFtdXG4gIHJldHVybiB2YWx1ZT8ucmVkdWNlPy4oKGJ1ZiwgaXRlbTogYW55KSA9PiB7XG4gICAgcmV0dXJuIGl0ZW0/LltBUlJBWV9VTklRVUVfVEFHXSA/IGJ1Zi5jb25jYXQoaXRlbVtBUlJBWV9VTklRVUVfVEFHXSkgOiBidWZcbiAgfSwgW10pXG59XG5cbmV4cG9ydCBjb25zdCB0YWdBcnJheUxpc3QgPSAoY3VycmVudDogYW55W10sIG5hbWU6IHN0cmluZywgZm9yY2U/OiBib29sZWFuKSA9PiB7XG4gIHJldHVybiBjdXJyZW50Py5tYXA/LigoaXRlbSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXNQbGFpbk9iaihpdGVtKSkge1xuICAgICAgaXRlbVtBUlJBWV9VTklRVUVfVEFHXSA9IGZvcmNlXG4gICAgICAgID8gYCR7bmFtZX0uJHtpbmRleH1gXG4gICAgICAgIDogaXRlbVtBUlJBWV9VTklRVUVfVEFHXSB8fCBgJHtuYW1lfS4ke2luZGV4fWBcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1cbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IEZpZWxkID0gY3JlYXRlTW9kZWw8SUZpZWxkU3RhdGUsIElGaWVsZFN0YXRlUHJvcHM+KFxuICBjbGFzcyBGaWVsZFN0YXRlRmFjdG9yeSBpbXBsZW1lbnRzIElNb2RlbFNwZWM8SUZpZWxkU3RhdGUsIElGaWVsZFN0YXRlUHJvcHM+IHtcbiAgICBub2RlUGF0aDogRm9ybVBhdGhcblxuICAgIGRhdGFQYXRoOiBGb3JtUGF0aFxuXG4gICAgcHJvcHM6IElGaWVsZFN0YXRlUHJvcHNcblxuICAgIHByZXZTdGF0ZTogSUZpZWxkU3RhdGVcblxuICAgIHVwZGF0ZXM6IEFycmF5PCd2YWx1ZScgfCAnaW5pdGlhbFZhbHVlJz5cblxuICAgIGxhc3RDb21wYXJlUmVzdWx0cz86IGJvb2xlYW5cblxuICAgIHN0YXRlID0ge1xuICAgICAgbmFtZTogJycsXG4gICAgICBwYXRoOiAnJyxcbiAgICAgIGRhdGFUeXBlOiAnYW55JyxcbiAgICAgIGluaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgIHByaXN0aW5lOiB0cnVlLFxuICAgICAgdmFsaWQ6IHRydWUsXG4gICAgICBtb2RpZmllZDogZmFsc2UsXG4gICAgICBpbnB1dGVkOiBmYWxzZSxcbiAgICAgIHRvdWNoZWQ6IGZhbHNlLFxuICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgIHZpc2l0ZWQ6IGZhbHNlLFxuICAgICAgaW52YWxpZDogZmFsc2UsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgdmFsaWRhdGluZzogZmFsc2UsXG4gICAgICBlcnJvcnM6IFtdLFxuICAgICAgdmFsdWVzOiBbXSxcbiAgICAgIHJ1bGVFcnJvcnM6IFtdLFxuICAgICAgcnVsZVdhcm5pbmdzOiBbXSxcbiAgICAgIGVmZmVjdEVycm9yczogW10sXG4gICAgICB3YXJuaW5nczogW10sXG4gICAgICBlZmZlY3RXYXJuaW5nczogW10sXG4gICAgICBlZGl0YWJsZTogdHJ1ZSxcbiAgICAgIHNlbGZFZGl0YWJsZTogdW5kZWZpbmVkLFxuICAgICAgZm9ybUVkaXRhYmxlOiB1bmRlZmluZWQsXG4gICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgdmlzaWJsZUNhY2hlVmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIGluaXRpYWxWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgcnVsZXM6IFtdLFxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgbW91bnRlZDogZmFsc2UsXG4gICAgICB1bm1vdW50ZWQ6IGZhbHNlLFxuICAgICAgcHJvcHM6IHt9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IElGaWVsZFN0YXRlUHJvcHMgPSB7fSkge1xuICAgICAgdGhpcy5ub2RlUGF0aCA9IEZvcm1QYXRoLmdldFBhdGgocHJvcHMubm9kZVBhdGgpXG4gICAgICB0aGlzLmRhdGFQYXRoID0gRm9ybVBhdGguZ2V0UGF0aChwcm9wcy5kYXRhUGF0aClcbiAgICAgIHRoaXMuc3RhdGUubmFtZSA9IHRoaXMuZGF0YVBhdGguZW50aXJlXG4gICAgICB0aGlzLnN0YXRlLnBhdGggPSB0aGlzLm5vZGVQYXRoLmVudGlyZVxuICAgICAgdGhpcy5zdGF0ZS5kYXRhVHlwZSA9IHByb3BzLmRhdGFUeXBlXG4gICAgICB0aGlzLnByb3BzID0gcHJvcHNcbiAgICAgIHRoaXMudXBkYXRlcyA9IFtdXG4gICAgfVxuXG4gICAgZGlydHlDaGVjayhwYXRoOiBzdHJpbmdbXSwgY3VycmVudFZhbHVlOiBhbnksIG5leHRWYWx1ZTogYW55KSB7XG4gICAgICBpZiAocGF0aFswXSA9PT0gJ3ZhbHVlJykge1xuICAgICAgICBpZiAodGhpcy5pc0FycmF5TGlzdCgpKSB7XG4gICAgICAgICAgLy/lpoLmnpzmmK9BcnJheUxpc3TvvIzkuI3lho3lgZrnsr7lh4bliKTmlq3vvIzlm6DkuLrmlbDnu4TlhoXpg6jkvrXlhaXkuoZTeW1ib2zvvIzkvb/nlKhpc0VxdWFs5Yik5pat5Lya5pyJ6Zeu6aKYXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICFpc0VxdWFsKGN1cnJlbnRWYWx1ZSwgbmV4dFZhbHVlKVxuICAgIH1cblxuICAgIGdldFZhbHVlRnJvbVByb3BzKCkge1xuICAgICAgaWYgKGlzRm4odGhpcy5wcm9wcz8uZ2V0VmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmdldFZhbHVlKHRoaXMuc3RhdGUubmFtZSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLnZhbHVlXG4gICAgfVxuXG4gICAgZ2V0RWRpdGFibGVGcm9tUHJvcHMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcz8uZ2V0RWRpdGFibGU/LigpXG4gICAgfVxuXG4gICAgZ2V0SW5pdGlhbFZhbHVlRnJvbVByb3BzKCkge1xuICAgICAgaWYgKGlzRm4odGhpcy5wcm9wcz8uZ2V0SW5pdGlhbFZhbHVlKSkge1xuICAgICAgICBjb25zdCBpbml0aWFsVmFsdWUgPSB0aGlzLnByb3BzLmdldEluaXRpYWxWYWx1ZSh0aGlzLnN0YXRlLm5hbWUpXG4gICAgICAgIHJldHVybiBpc1ZhbGlkKHRoaXMuc3RhdGUuaW5pdGlhbFZhbHVlKVxuICAgICAgICAgID8gdGhpcy5zdGF0ZS5pbml0aWFsVmFsdWVcbiAgICAgICAgICA6IGluaXRpYWxWYWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuaW5pdGlhbFZhbHVlXG4gICAgfVxuXG4gICAgZ2V0U3RhdGUgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuaW5pdGlhbGl6ZWQpIHJldHVybiB0aGlzLnN0YXRlXG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlRnJvbVByb3BzKClcbiAgICAgIGxldCBpbml0aWFsVmFsdWUgPSB0aGlzLmdldEluaXRpYWxWYWx1ZUZyb21Qcm9wcygpXG4gICAgICBsZXQgZm9ybUVkaXRhYmxlID0gdGhpcy5nZXRFZGl0YWJsZUZyb21Qcm9wcygpXG4gICAgICBpZiAodGhpcy5pc0FycmF5TGlzdCgpKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5maXhBcnJheUxpc3RUYWdzKHRvQXJyKHZhbHVlKSlcbiAgICAgICAgaW5pdGlhbFZhbHVlID0gdGhpcy5maXhBcnJheUxpc3RUYWdzKHRvQXJyKGluaXRpYWxWYWx1ZSkpXG4gICAgICB9XG4gICAgICBjb25zdCB2YWx1ZUNoYW5nZWQgPSAhaXNFcXVhbCh0aGlzLnN0YXRlLnZhbHVlLCB2YWx1ZSlcblxuICAgICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgIC4uLnRoaXMuc3RhdGUsXG4gICAgICAgIGluaXRpYWxWYWx1ZSxcbiAgICAgICAgZm9ybUVkaXRhYmxlLFxuICAgICAgICBlZGl0YWJsZTogY2FsY3VsYXRlRWRpdGFibGUoXG4gICAgICAgICAgdGhpcy5zdGF0ZS5zZWxmRWRpdGFibGUsXG4gICAgICAgICAgZm9ybUVkaXRhYmxlLFxuICAgICAgICAgIHRoaXMuc3RhdGUubmFtZVxuICAgICAgICApLFxuICAgICAgICBtb2RpZmllZDogdGhpcy5zdGF0ZS5tb2RpZmllZCB8fCB2YWx1ZUNoYW5nZWQsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICB2YWx1ZXM6IFt2YWx1ZV0uY29uY2F0KHRoaXMuc3RhdGUudmFsdWVzLnNsaWNlKDEpKVxuICAgICAgfVxuICAgICAgaWYgKHZhbHVlQ2hhbmdlZCAmJiB2YWx1ZUNoYW5nZWQgIT09IHRoaXMubGFzdENvbXBhcmVSZXN1bHRzKSB7XG4gICAgICAgIHRoaXMuc3RhdGUudmFsdWUgPSB2YWx1ZVxuICAgICAgICB0aGlzLnByb3BzPy51bkNvbnRyb2xsZWRWYWx1ZUNoYW5nZWQ/LigpXG4gICAgICB9XG4gICAgICB0aGlzLmxhc3RDb21wYXJlUmVzdWx0cyA9IHZhbHVlQ2hhbmdlZFxuICAgICAgcmV0dXJuIHN0YXRlXG4gICAgfVxuXG4gICAgcHJvZHVjZUVycm9yc0FuZFdhcm5pbmdzKFxuICAgICAgZHJhZnQ6IERyYWZ0PElGaWVsZFN0YXRlPixcbiAgICAgIGRpcnR5czogRmllbGRTdGF0ZURpcnR5TWFwXG4gICAgKSB7XG4gICAgICBpZiAoZGlydHlzLmVycm9ycykge1xuICAgICAgICBkcmFmdC5lZmZlY3RFcnJvcnMgPSBub3JtYWxpemVNZXNzYWdlcyhkcmFmdC5lcnJvcnMpXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLndhcm5pbmdzKSB7XG4gICAgICAgIGRyYWZ0LmVmZmVjdFdhcm5pbmdzID0gbm9ybWFsaXplTWVzc2FnZXMoZHJhZnQud2FybmluZ3MpXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLmVmZmVjdEVycm9ycykge1xuICAgICAgICBkcmFmdC5lZmZlY3RFcnJvcnMgPSBub3JtYWxpemVNZXNzYWdlcyhkcmFmdC5lZmZlY3RFcnJvcnMpXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLmVmZmVjdFdhcm5pbmdzKSB7XG4gICAgICAgIGRyYWZ0LmVmZmVjdFdhcm5pbmdzID0gbm9ybWFsaXplTWVzc2FnZXMoZHJhZnQuZWZmZWN0V2FybmluZ3MpXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLnJ1bGVFcnJvcnMpIHtcbiAgICAgICAgZHJhZnQucnVsZUVycm9ycyA9IG5vcm1hbGl6ZU1lc3NhZ2VzKGRyYWZ0LnJ1bGVFcnJvcnMpXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLnJ1bGVXYXJuaW5ncykge1xuICAgICAgICBkcmFmdC5ydWxlV2FybmluZ3MgPSBub3JtYWxpemVNZXNzYWdlcyhkcmFmdC5ydWxlV2FybmluZ3MpXG4gICAgICB9XG4gICAgICBkcmFmdC5lcnJvcnMgPSBkcmFmdC5ydWxlRXJyb3JzLmNvbmNhdChkcmFmdC5lZmZlY3RFcnJvcnMpXG4gICAgICBkcmFmdC53YXJuaW5ncyA9IGRyYWZ0LnJ1bGVXYXJuaW5ncy5jb25jYXQoZHJhZnQuZWZmZWN0V2FybmluZ3MpXG4gICAgfVxuXG4gICAgcHJvZHVjZUVkaXRhYmxlKGRyYWZ0OiBEcmFmdDxJRmllbGRTdGF0ZT4sIGRpcnR5czogRmllbGRTdGF0ZURpcnR5TWFwKSB7XG4gICAgICBpZiAoZGlydHlzLmVkaXRhYmxlKSB7XG4gICAgICAgIGRyYWZ0LnNlbGZFZGl0YWJsZSA9IGRyYWZ0LmVkaXRhYmxlXG4gICAgICB9XG4gICAgICBkcmFmdC5lZGl0YWJsZSA9IGNhbGN1bGF0ZUVkaXRhYmxlKFxuICAgICAgICBkcmFmdC5zZWxmRWRpdGFibGUsXG4gICAgICAgIGRyYWZ0LmZvcm1FZGl0YWJsZSxcbiAgICAgICAgZHJhZnQubmFtZVxuICAgICAgKVxuICAgIH1cblxuICAgIHN1cHBvcnRVbm1vdW50Q2xlYXJTdGF0ZXMoKSB7XG4gICAgICBpZiAoaXNGbih0aGlzLnByb3BzPy5zdXBwb3J0VW5tb3VudENsZWFyU3RhdGVzKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcz8uc3VwcG9ydFVubW91bnRDbGVhclN0YXRlcyh0aGlzLnN0YXRlLnBhdGgpXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHByb2R1Y2VTaWRlRWZmZWN0cyhkcmFmdDogRHJhZnQ8SUZpZWxkU3RhdGU+LCBkaXJ0eXM6IEZpZWxkU3RhdGVEaXJ0eU1hcCkge1xuICAgICAgY29uc3Qgc3VwcG9ydENsZWFyU3RhdGVzID0gdGhpcy5zdXBwb3J0VW5tb3VudENsZWFyU3RhdGVzKClcbiAgICAgIGlmIChkaXJ0eXMudmFsaWRhdGluZykge1xuICAgICAgICBpZiAoZHJhZnQudmFsaWRhdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGRyYWZ0LmxvYWRpbmcgPSB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAoZHJhZnQudmFsaWRhdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBkcmFmdC5sb2FkaW5nID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICBkcmFmdC5lZGl0YWJsZSA9PT0gZmFsc2UgfHxcbiAgICAgICAgZHJhZnQuc2VsZkVkaXRhYmxlID09PSBmYWxzZSB8fFxuICAgICAgICBkcmFmdC52aXNpYmxlID09PSBmYWxzZSB8fFxuICAgICAgICBkcmFmdC5kaXNwbGF5ID09PSBmYWxzZSB8fFxuICAgICAgICAoZHJhZnQudW5tb3VudGVkID09PSB0cnVlICYmIHN1cHBvcnRDbGVhclN0YXRlcylcbiAgICAgICkge1xuICAgICAgICBkcmFmdC5lcnJvcnMgPSBbXVxuICAgICAgICBkcmFmdC5lZmZlY3RFcnJvcnMgPSBbXVxuICAgICAgICBkcmFmdC53YXJuaW5ncyA9IFtdXG4gICAgICAgIGRyYWZ0LmVmZmVjdFdhcm5pbmdzID0gW11cbiAgICAgIH1cbiAgICAgIGlmICghaXNWYWxpZChkcmFmdC5wcm9wcykpIHtcbiAgICAgICAgZHJhZnQucHJvcHMgPSB7fVxuICAgICAgfVxuICAgICAgaWYgKGRyYWZ0Lm1vdW50ZWQgPT09IHRydWUgJiYgZGlydHlzLm1vdW50ZWQpIHtcbiAgICAgICAgZHJhZnQudW5tb3VudGVkID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmIChkcmFmdC5tb3VudGVkID09PSBmYWxzZSAmJiBkaXJ0eXMubW91bnRlZCkge1xuICAgICAgICBkcmFmdC51bm1vdW50ZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBpZiAoZHJhZnQudW5tb3VudGVkID09PSB0cnVlICYmIGRpcnR5cy51bm1vdW50ZWQpIHtcbiAgICAgICAgZHJhZnQubW91bnRlZCA9IGZhbHNlXG4gICAgICB9XG4gICAgICBpZiAoZHJhZnQudW5tb3VudGVkID09PSBmYWxzZSAmJiBkaXJ0eXMudW5tb3VudGVkKSB7XG4gICAgICAgIGRyYWZ0Lm1vdW50ZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLnZpc2libGUgfHwgZGlydHlzLm1vdW50ZWQgfHwgZGlydHlzLnVubW91bnRlZCkge1xuICAgICAgICBpZiAoc3VwcG9ydENsZWFyU3RhdGVzKSB7XG4gICAgICAgICAgaWYgKGRyYWZ0LmRpc3BsYXkpIHtcbiAgICAgICAgICAgIGlmIChkcmFmdC52aXNpYmxlID09PSBmYWxzZSB8fCBkcmFmdC51bm1vdW50ZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgaWYgKCFkaXJ0eXMudmlzaWJsZUNhY2hlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBkcmFmdC52aXNpYmxlQ2FjaGVWYWx1ZSA9IGlzVmFsaWQoZHJhZnQudmFsdWUpXG4gICAgICAgICAgICAgICAgICA/IGRyYWZ0LnZhbHVlXG4gICAgICAgICAgICAgICAgICA6IGlzVmFsaWQoZHJhZnQudmlzaWJsZUNhY2hlVmFsdWUpXG4gICAgICAgICAgICAgICAgICA/IGRyYWZ0LnZpc2libGVDYWNoZVZhbHVlXG4gICAgICAgICAgICAgICAgICA6IGRyYWZ0LmluaXRpYWxWYWx1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGRyYWZ0LnZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgIGRyYWZ0LnZhbHVlcyA9IHRvQXJyKGRyYWZ0LnZhbHVlcylcbiAgICAgICAgICAgICAgZHJhZnQudmFsdWVzWzBdID0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlcy5wdXNoKCd2YWx1ZScpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICBkcmFmdC52aXNpYmxlID09PSB0cnVlIHx8XG4gICAgICAgICAgICAgIGRyYWZ0Lm1vdW50ZWQgPT09IHRydWUgfHxcbiAgICAgICAgICAgICAgZHJhZnQudW5tb3VudGVkID09PSBmYWxzZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmICghaXNWYWxpZChkcmFmdC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBkcmFmdC52YWx1ZSA9IGRyYWZ0LnZpc2libGVDYWNoZVZhbHVlXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVzLnB1c2goJ3ZhbHVlJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZHJhZnQuZGlzcGxheSkge1xuICAgICAgICAgICAgaWYgKGRyYWZ0LnZpc2libGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIGlmICghZGlydHlzLnZpc2libGVDYWNoZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZHJhZnQudmlzaWJsZUNhY2hlVmFsdWUgPSBpc1ZhbGlkKGRyYWZ0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgPyBkcmFmdC52YWx1ZVxuICAgICAgICAgICAgICAgICAgOiBpc1ZhbGlkKGRyYWZ0LnZpc2libGVDYWNoZVZhbHVlKVxuICAgICAgICAgICAgICAgICAgPyBkcmFmdC52aXNpYmxlQ2FjaGVWYWx1ZVxuICAgICAgICAgICAgICAgICAgOiBkcmFmdC5pbml0aWFsVmFsdWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBkcmFmdC52YWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgICBkcmFmdC52YWx1ZXMgPSB0b0FycihkcmFmdC52YWx1ZXMpXG4gICAgICAgICAgICAgIGRyYWZ0LnZhbHVlc1swXSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSBlbHNlIGlmIChkcmFmdC52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIGlmICghaXNWYWxpZChkcmFmdC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBkcmFmdC52YWx1ZSA9IGRyYWZ0LnZpc2libGVDYWNoZVZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGRyYWZ0LmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgZHJhZnQuaW52YWxpZCA9IHRydWVcbiAgICAgICAgZHJhZnQudmFsaWQgPSBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJhZnQuaW52YWxpZCA9IGZhbHNlXG4gICAgICAgIGRyYWZ0LnZhbGlkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGZpeEFycmF5TGlzdFRhZ3ModmFsdWU6IGFueVtdKSB7XG4gICAgICBpZiAodmFsdWU/LlswXT8uW0FSUkFZX1VOSVFVRV9UQUddKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFnQXJyYXlMaXN0KHZhbHVlKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRhZ0FycmF5TGlzdCh2YWx1ZTogYW55W10pIHtcbiAgICAgIHJldHVybiB0YWdBcnJheUxpc3QodmFsdWUsIHRoaXMuc3RhdGUubmFtZSlcbiAgICB9XG5cbiAgICBpc0FycmF5TGlzdCgpIHtcbiAgICAgIHJldHVybiAvYXJyYXkvZ2kudGVzdCh0aGlzLnN0YXRlLmRhdGFUeXBlKVxuICAgIH1cblxuICAgIHByb2R1Y2VWYWx1ZShkcmFmdDogRHJhZnQ8SUZpZWxkU3RhdGU+LCBkaXJ0eXM6IEZpZWxkU3RhdGVEaXJ0eU1hcCkge1xuICAgICAgbGV0IHZhbHVlT3JJbml0aWFsVmFsdWVDaGFuZ2VkID1cbiAgICAgICAgZGlydHlzLnZhbHVlcyB8fCBkaXJ0eXMudmFsdWUgfHwgZGlydHlzLmluaXRpYWxWYWx1ZVxuICAgICAgbGV0IHZhbHVlQ2hhbmdlZCA9IGRpcnR5cy52YWx1ZXMgfHwgZGlydHlzLnZhbHVlXG4gICAgICBpZiAoZGlydHlzLnZhbHVlcykge1xuICAgICAgICBkcmFmdC52YWx1ZXMgPSB0b0FycihkcmFmdC52YWx1ZXMpXG4gICAgICAgIGlmICh0aGlzLmlzQXJyYXlMaXN0KCkpIHtcbiAgICAgICAgICBkcmFmdC52YWx1ZXNbMF0gPSB0aGlzLnRhZ0FycmF5TGlzdCh0b0FycihkcmFmdC52YWx1ZXNbMF0pKVxuICAgICAgICB9XG4gICAgICAgIGRyYWZ0LnZhbHVlID0gZHJhZnQudmFsdWVzWzBdXG4gICAgICAgIGRyYWZ0Lm1vZGlmaWVkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgaWYgKGRpcnR5cy52YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5pc0FycmF5TGlzdCgpKSB7XG4gICAgICAgICAgZHJhZnQudmFsdWUgPSB0aGlzLnRhZ0FycmF5TGlzdCh0b0FycihkcmFmdC52YWx1ZSkpXG4gICAgICAgIH1cbiAgICAgICAgZHJhZnQudmFsdWVzWzBdID0gZHJhZnQudmFsdWVcbiAgICAgICAgZHJhZnQubW9kaWZpZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgIGNvbnN0IGlzRW1wdHlWYWx1ZSA9ICFpc1ZhbGlkKGRyYWZ0LnZhbHVlKSB8fCBpc0VtcHR5KGRyYWZ0LnZhbHVlKVxuICAgICAgICBpZiAoaXNFbXB0eVZhbHVlICYmIGlzVmFsaWQoZHJhZnQuaW5pdGlhbFZhbHVlKSkge1xuICAgICAgICAgIGRyYWZ0LnZhbHVlID0gZHJhZnQuaW5pdGlhbFZhbHVlXG4gICAgICAgICAgZHJhZnQudmFsdWVzID0gdG9BcnIoZHJhZnQudmFsdWVzKVxuICAgICAgICAgIGRyYWZ0LnZhbHVlc1swXSA9IGRyYWZ0LnZhbHVlXG4gICAgICAgICAgdmFsdWVDaGFuZ2VkID0gdHJ1ZVxuICAgICAgICAgIHZhbHVlT3JJbml0aWFsVmFsdWVDaGFuZ2VkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFsdWVDaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMudXBkYXRlcy5wdXNoKCd2YWx1ZScpXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLmluaXRpYWxWYWx1ZSkge1xuICAgICAgICB0aGlzLnVwZGF0ZXMucHVzaCgnaW5pdGlhbFZhbHVlJylcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZU9ySW5pdGlhbFZhbHVlQ2hhbmdlZCkge1xuICAgICAgICBpZiAoaXNFcXVhbChkcmFmdC5pbml0aWFsVmFsdWUsIGRyYWZ0LnZhbHVlKSkge1xuICAgICAgICAgIGRyYWZ0LnByaXN0aW5lID0gdHJ1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRyYWZ0LnByaXN0aW5lID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGdldFJ1bGVzRnJvbVJ1bGVzQW5kUmVxdWlyZWQoXG4gICAgICBydWxlczogSUZpZWxkU3RhdGVbJ3J1bGVzJ10sXG4gICAgICByZXF1aXJlZDogYm9vbGVhblxuICAgICkge1xuICAgICAgaWYgKGlzVmFsaWQocmVxdWlyZWQpKSB7XG4gICAgICAgIGlmIChydWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIXJ1bGVzLnNvbWUocnVsZSA9PiBydWxlICYmIGlzVmFsaWQocnVsZSFbJ3JlcXVpcmVkJ10pKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJ1bGVzLmNvbmNhdChbeyByZXF1aXJlZCB9XSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJ1bGVzLnJlZHVjZSgoYnVmOiBhbnlbXSwgaXRlbTogYW55KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhpdGVtIHx8IHt9KVxuICAgICAgICAgICAgICBpZiAoaXNWYWxpZChpdGVtLnJlcXVpcmVkKSkge1xuICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkKGl0ZW0ubWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChrZXlzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1Zi5jb25jYXQoe1xuICAgICAgICAgICAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKGtleXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmLmNvbmNhdCh7XG4gICAgICAgICAgICAgICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaXNWYWxpZChpdGVtLnJlcXVpcmVkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBidWYuY29uY2F0KHtcbiAgICAgICAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGJ1Zi5jb25jYXQoaXRlbSlcbiAgICAgICAgICAgIH0sIFtdKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAocmVxdWlyZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBydWxlcy5jb25jYXQoW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBydWxlc1xuICAgIH1cblxuICAgIGdldFJlcXVpcmVkRnJvbVJ1bGVzQW5kUmVxdWlyZWQocnVsZXM6IGFueVtdLCByZXF1aXJlZDogYm9vbGVhbikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXNWYWxpZChydWxlc1tpXS5yZXF1aXJlZCkpIHtcbiAgICAgICAgICByZXR1cm4gcnVsZXNbaV0ucmVxdWlyZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcXVpcmVkXG4gICAgfVxuXG4gICAgcHJvZHVjZVJ1bGVzKGRyYWZ0OiBEcmFmdDxJRmllbGRTdGF0ZT4sIGRpcnR5czogRmllbGRTdGF0ZURpcnR5TWFwKSB7XG4gICAgICBpZiAoaXNWYWxpZChkcmFmdC5ydWxlcykpIHtcbiAgICAgICAgZHJhZnQucnVsZXMgPSB0b0FycihkcmFmdC5ydWxlcylcbiAgICAgIH1cbiAgICAgIGlmICgoZGlydHlzLnJlcXVpcmVkICYmIGRpcnR5cy5ydWxlcykgfHwgZGlydHlzLnJlcXVpcmVkKSB7XG4gICAgICAgIGNvbnN0IHJ1bGVzID0gdGhpcy5nZXRSdWxlc0Zyb21SdWxlc0FuZFJlcXVpcmVkKFxuICAgICAgICAgIGRyYWZ0LnJ1bGVzLFxuICAgICAgICAgIGRyYWZ0LnJlcXVpcmVkXG4gICAgICAgIClcbiAgICAgICAgZHJhZnQucmVxdWlyZWQgPSBkcmFmdC5yZXF1aXJlZFxuICAgICAgICBkcmFmdC5ydWxlcyA9IHJ1bGVzXG4gICAgICB9IGVsc2UgaWYgKGRpcnR5cy5ydWxlcykge1xuICAgICAgICBkcmFmdC5yZXF1aXJlZCA9IHRoaXMuZ2V0UmVxdWlyZWRGcm9tUnVsZXNBbmRSZXF1aXJlZChcbiAgICAgICAgICBkcmFmdC5ydWxlcyxcbiAgICAgICAgICBkcmFmdC5yZXF1aXJlZFxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuXG4gICAgYmVmb3JlUHJvZHVjZSgpIHtcbiAgICAgIHRoaXMudXBkYXRlcyA9IFtdXG4gICAgfVxuXG4gICAgcHJvZHVjZShkcmFmdDogRHJhZnQ8SUZpZWxkU3RhdGU+LCBkaXJ0eXM6IEZpZWxkU3RhdGVEaXJ0eU1hcCkge1xuICAgICAgdGhpcy5wcm9kdWNlRXJyb3JzQW5kV2FybmluZ3MoZHJhZnQsIGRpcnR5cylcbiAgICAgIHRoaXMucHJvZHVjZUVkaXRhYmxlKGRyYWZ0LCBkaXJ0eXMpXG4gICAgICB0aGlzLnByb2R1Y2VWYWx1ZShkcmFmdCwgZGlydHlzKVxuICAgICAgdGhpcy5wcm9kdWNlU2lkZUVmZmVjdHMoZHJhZnQsIGRpcnR5cylcbiAgICAgIHRoaXMucHJvZHVjZVJ1bGVzKGRyYWZ0LCBkaXJ0eXMpXG4gICAgfVxuXG4gICAgYWZ0ZXJQcm9kdWNlKCkge1xuICAgICAgLy9CZWNhdXNlIHRoZSBkcmFmdCBkYXRhIGNhbm5vdCBiZSBjb25zdW1lZCBleHRlcm5hbGx5LCBJIGNhbiBvbmx5IGNhY2hlIHRoZSBjaGFuZ2VzIGFuZCBoYW5kbGUgaXQgdW5pZm9ybWx5XG4gICAgICB0aGlzLnVwZGF0ZXMuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgaWYgKHR5cGUgPT09ICd2YWx1ZScpIHtcbiAgICAgICAgICB0aGlzLnByb3BzPy5zZXRWYWx1ZT8uKHRoaXMuc3RhdGUubmFtZSwgdGhpcy5zdGF0ZS52YWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb3BzPy5zZXRJbml0aWFsVmFsdWU/LihcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubmFtZSxcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5pdGlhbFZhbHVlXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBwYXRoOiAnJyxcbiAgICAgIGRhdGFUeXBlOiAnYW55J1xuICAgIH1cblxuICAgIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdGaWVsZFN0YXRlJ1xuICB9XG4pXG4iLCJpbXBvcnQgeyBjcmVhdGVNb2RlbCB9IGZyb20gJy4uL3NoYXJlZC9tb2RlbCdcbmltcG9ydCB7XG4gIElNb2RlbFNwZWMsXG4gIElWaXJ0dWFsRmllbGRTdGF0ZSxcbiAgSVZpcnR1YWxGaWVsZFN0YXRlUHJvcHMsXG4gIFZpcnR1YWxGaWVsZFN0YXRlRGlydHlNYXBcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBGb3JtUGF0aCwgaXNWYWxpZCB9IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCB7IERyYWZ0IH0gZnJvbSAnaW1tZXInXG5cbmV4cG9ydCBjb25zdCBWaXJ0dWFsRmllbGQgPSBjcmVhdGVNb2RlbDxcbiAgSVZpcnR1YWxGaWVsZFN0YXRlLFxuICBJVmlydHVhbEZpZWxkU3RhdGVQcm9wc1xuPihcbiAgY2xhc3MgRm9ybVN0YXRlRmFjdG9yeVxuICAgIGltcGxlbWVudHMgSU1vZGVsU3BlYzxJVmlydHVhbEZpZWxkU3RhdGUsIElWaXJ0dWFsRmllbGRTdGF0ZVByb3BzPiB7XG4gICAgbm9kZVBhdGg6IEZvcm1QYXRoXG5cbiAgICBkYXRhUGF0aDogRm9ybVBhdGhcblxuICAgIHN0YXRlID0ge1xuICAgICAgbmFtZTogJycsXG4gICAgICBwYXRoOiAnJyxcbiAgICAgIGluaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICBkaXNwbGF5OiB0cnVlLFxuICAgICAgbW91bnRlZDogZmFsc2UsXG4gICAgICB1bm1vdW50ZWQ6IGZhbHNlLFxuICAgICAgcHJvcHM6IHt9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJvcHM6IElWaXJ0dWFsRmllbGRTdGF0ZVByb3BzKSB7XG4gICAgICB0aGlzLm5vZGVQYXRoID0gRm9ybVBhdGguZ2V0UGF0aChwcm9wcy5ub2RlUGF0aClcbiAgICAgIHRoaXMuZGF0YVBhdGggPSBGb3JtUGF0aC5nZXRQYXRoKHByb3BzLmRhdGFQYXRoKVxuICAgICAgdGhpcy5zdGF0ZS5wYXRoID0gdGhpcy5ub2RlUGF0aC5lbnRpcmVcbiAgICAgIHRoaXMuc3RhdGUubmFtZSA9IHRoaXMuZGF0YVBhdGguZW50aXJlXG4gICAgfVxuXG4gICAgcHJvZHVjZShcbiAgICAgIGRyYWZ0OiBEcmFmdDxJVmlydHVhbEZpZWxkU3RhdGU+LFxuICAgICAgZGlydHlzOiBWaXJ0dWFsRmllbGRTdGF0ZURpcnR5TWFwXG4gICAgKSB7XG4gICAgICBpZiAoZHJhZnQubW91bnRlZCA9PT0gdHJ1ZSAmJiBkaXJ0eXMubW91bnRlZCkge1xuICAgICAgICBkcmFmdC51bm1vdW50ZWQgPSBmYWxzZVxuICAgICAgfVxuICAgICAgaWYgKCFpc1ZhbGlkKGRyYWZ0LnByb3BzKSkge1xuICAgICAgICBkcmFmdC5wcm9wcyA9IHt9XG4gICAgICB9XG4gICAgICBpZiAoZHJhZnQudW5tb3VudGVkID09PSB0cnVlICYmIGRpcnR5cy51bm1vdW50ZWQpIHtcbiAgICAgICAgZHJhZnQubW91bnRlZCA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ1ZpcnR1YWxGaWVsZFN0YXRlJ1xuICB9XG4pXG4iLCJpbXBvcnQge1xuICBJRmllbGRSZWdpc3RyeVByb3BzLFxuICBJRmllbGQsXG4gIElGaWVsZFN0YXRlLFxuICBJVmlydHVhbEZpZWxkLFxuICBMaWZlQ3ljbGVUeXBlcyxcbiAgSVZpcnR1YWxGaWVsZFJlZ2lzdHJ5UHJvcHMsXG4gIGlzRmllbGQsXG4gIElGb3JtU3RhdGUsXG4gIElWaXJ0dWFsRmllbGRTdGF0ZSxcbiAgRm9ybUhlYXJ0U3Vic2NyaWJlcixcbiAgSUZvcm1TdWJtaXRSZXN1bHQsXG4gIElGb3JtVmFsaWRhdGVSZXN1bHQsXG4gIElGb3JtUmVzZXRPcHRpb25zLFxuICBpc0Zvcm1TdGF0ZSxcbiAgaXNGaWVsZFN0YXRlLFxuICBpc1ZpcnR1YWxGaWVsZFN0YXRlLFxuICBJRm9ybUV4dGVuZGVkVmFsaWRhdGVGaWVsZE9wdGlvbnNcbn0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7XG4gIEZvcm1QYXRoLFxuICBGb3JtUGF0aFBhdHRlcm4sXG4gIGlzVmFsaWQsXG4gIGlzRm4sXG4gIGlzQXJyLFxuICBpc1BsYWluT2JqLFxuICBlYWNoLFxuICBjbG9uZSxcbiAgbG9nLFxuICBkZWZhdWx0cyxcbiAgdG9BcnIsXG4gIGlzTnVtLFxuICBpc0VxdWFsLFxuICBpc0VtcHR5XG59IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCB7IGNyZWF0ZUZvcm1JbnRlcm5hbHMgfSBmcm9tICcuL2ludGVybmFscydcbmltcG9ydCB7XG4gIEZpZWxkLFxuICBBUlJBWV9VTklRVUVfVEFHLFxuICB0YWdBcnJheUxpc3QsXG4gIHBhcnNlQXJyYXlUYWdzXG59IGZyb20gJy4vbW9kZWxzL2ZpZWxkJ1xuaW1wb3J0IHsgVmlydHVhbEZpZWxkIH0gZnJvbSAnLi9tb2RlbHMvdmlydHVhbC1maWVsZCdcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUZvcm1FeHRlcm5hbHMgPSAoXG4gIGludGVybmFsczogUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlRm9ybUludGVybmFscz5cbikgPT4ge1xuICBjb25zdCB7XG4gICAgb3B0aW9ucyxcbiAgICBpbml0LFxuICAgIGVudixcbiAgICBmb3JtLFxuICAgIGhlYXJ0LFxuICAgIGdyYXBoLFxuICAgIHZhbGlkYXRvcixcbiAgICB1cGxvYWQsXG4gICAgaG9zdFVwZGF0ZSxcbiAgICBhZnRlclVubW91bnQsXG4gICAgbmV4dFRpY2ssXG4gICAgaXNIb3N0UmVuZGVyaW5nLFxuICAgIGdldERhdGFQYXRoLFxuICAgIGdldEZvcm1WYWx1ZXNJbixcbiAgICBnZXRGb3JtSW5pdGlhbFZhbHVlc0luLFxuICAgIGRlbGV0ZUZvcm1WYWx1ZXNJbixcbiAgICBzZXRGb3JtVmFsdWVzSW4sXG4gICAgc2V0Rm9ybUluaXRpYWxWYWx1ZXNJbixcbiAgICB1cGRhdGVSZWNvdmVyYWJsZVNob3duU3RhdGUsXG4gICAgc3VwcG9ydFVubW91bnRDbGVhclN0YXRlcyxcbiAgICBkaXNhYmxlVW5tb3VudENsZWFyU3RhdGVzLFxuICAgIGVuYWJsZVVubW91bnRDbGVhclN0YXRlcyxcbiAgICBlbmFibGVVbm1vdW50UmVtb3ZlTm9kZSxcbiAgICBkaXNhYmxlVW5tb3VudFJlbW92ZU5vZGUsXG4gICAgcmVzZXRGb3JtTWVzc2FnZXMsXG4gICAgc3luY0Zvcm1NZXNzYWdlcyxcbiAgICBiYXRjaFJ1blRhc2tRdWV1ZSxcbiAgICBwdXNoVGFza1F1ZXVlXG4gIH0gPSBpbnRlcm5hbHNcblxuICBmdW5jdGlvbiBlYWNoQXJyYXlFeGNoYW5nZXMoXG4gICAgcHJldlN0YXRlOiBJRmllbGRTdGF0ZSxcbiAgICBjdXJyZW50U3RhdGU6IElGaWVsZFN0YXRlLFxuICAgIGVhY2hlcjogKHByZXZQYXRoOiBzdHJpbmcsIGN1cnJlbnRQYXRoOiBzdHJpbmcsIGxhc3RSZXN1bHRzOiBhbnkpID0+IHZvaWRcbiAgKSB7XG4gICAgY29uc3QgZXhjaGFuZ2VkID0ge31cbiAgICBjb25zdCBwcmV2VmFsdWUgPSBwcmV2U3RhdGUudmFsdWVcbiAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBjdXJyZW50U3RhdGUudmFsdWVcbiAgICBjb25zdCBtYXhMZW5ndGhWYWx1ZSA9XG4gICAgICBwcmV2VmFsdWU/Lmxlbmd0aCA+IGN1cnJlbnRWYWx1ZT8ubGVuZ3RoID8gcHJldlZhbHVlIDogY3VycmVudFZhbHVlXG4gICAgLy/liKDpmaTlhYPntKDmraPlkJHlvqrnjq/vvIzmt7vliqDmiJbnp7vliqjkvb/nlKjpgIblkJHlvqrnjq9cbiAgICBsZXQgbGFzdFJlc3VsdHM6IGFueVxuICAgIGVhY2goXG4gICAgICBtYXhMZW5ndGhWYWx1ZSxcbiAgICAgIChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBwcmV2ID0gcHJldlZhbHVlPy5baW5kZXhdPy5bQVJSQVlfVU5JUVVFX1RBR11cbiAgICAgICAgY29uc3QgY3VycmVudCA9IGN1cnJlbnRWYWx1ZT8uW2luZGV4XT8uW0FSUkFZX1VOSVFVRV9UQUddXG4gICAgICAgIGlmIChwcmV2ID09PSBjdXJyZW50KSByZXR1cm5cbiAgICAgICAgaWYgKHByZXYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50VmFsdWU/Lmxlbmd0aCA9PT0gcHJldlZhbHVlPy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoZXhjaGFuZ2VkW3ByZXZdIHx8IGV4Y2hhbmdlZFtjdXJyZW50XSkgcmV0dXJuXG4gICAgICAgICAgZXhjaGFuZ2VkW3ByZXZdID0gdHJ1ZVxuICAgICAgICAgIGV4Y2hhbmdlZFtjdXJyZW50XSA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBsYXN0UmVzdWx0cyA9IGVhY2hlcihwcmV2LCBjdXJyZW50LCBsYXN0UmVzdWx0cylcbiAgICAgIH0sXG4gICAgICBjdXJyZW50U3RhdGU/LnZhbHVlPy5sZW5ndGggPj0gcHJldlN0YXRlPy52YWx1ZT8ubGVuZ3RoXG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gY2FsY3VsYXRlTW92ZVBhdGgobmFtZTogc3RyaW5nLCByZXBsYWNlOiBudW1iZXIpIHtcbiAgICBjb25zdCBzZWdtZW50cyA9IFtdXG4gICAgY29uc3QgaW5kZXhlcyA9IFtdXG4gICAgRm9ybVBhdGgucGFyc2UobmFtZSkuZm9yRWFjaCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICgvXlxcZCskLy50ZXN0KGtleSkpIHtcbiAgICAgICAgaW5kZXhlcy5wdXNoKHNlZ21lbnRzLmxlbmd0aClcbiAgICAgIH1cbiAgICAgIHNlZ21lbnRzLnB1c2goa2V5KVxuICAgIH0pXG4gICAgaWYgKGluZGV4ZXMubGVuZ3RoKSB7XG4gICAgICBzZWdtZW50c1tpbmRleGVzW2luZGV4ZXMubGVuZ3RoIC0gMV1dID0gcmVwbGFjZVxuICAgIH1cbiAgICByZXR1cm4gc2VnbWVudHMuam9pbignLicpXG4gIH1cblxuICBmdW5jdGlvbiBnZXRFeGNoYW5nZVN0YXRlKHN0YXRlOiBJRmllbGRTdGF0ZSkge1xuICAgIGNvbnN0IHJlc3VsdHMgPSB7XG4gICAgICAuLi5zdGF0ZVxuICAgIH1cbiAgICBkZWxldGUgcmVzdWx0cy5uYW1lXG4gICAgZGVsZXRlIHJlc3VsdHMucGF0aFxuICAgIGlmIChcbiAgICAgIHJlc3VsdHMudmlzaWJsZSA9PT0gZmFsc2UgfHxcbiAgICAgIHJlc3VsdHMudW5tb3VudGVkID09PSB0cnVlIHx8XG4gICAgICByZXN1bHRzLm1vdW50ZWQgPT09IGZhbHNlXG4gICAgKSB7XG4gICAgICBkZWxldGUgcmVzdWx0cy52YWx1ZVxuICAgICAgZGVsZXRlIHJlc3VsdHMudmFsdWVzXG4gICAgfVxuICAgIGRlbGV0ZSByZXN1bHRzLm1vdW50ZWRcbiAgICBkZWxldGUgcmVzdWx0cy51bm1vdW50ZWRcbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbiAgZnVuY3Rpb24gY2FsY3VsYXRlUmVtb3ZlZFRhZ3MocHJldlRhZ3M6IHN0cmluZ1tdLCBjdXJyZW50VGFnczogc3RyaW5nW10pIHtcbiAgICBpZiAocHJldlRhZ3MubGVuZ3RoIDw9IGN1cnJlbnRUYWdzLmxlbmd0aCkgcmV0dXJuIFtdXG4gICAgZW52LnJlYWxSZW1vdmVUYWdzID0gcHJldlRhZ3MucmVkdWNlKChidWYsIHRhZykgPT4ge1xuICAgICAgcmV0dXJuIGN1cnJlbnRUYWdzLmluY2x1ZGVzKHRhZykgPyBidWYgOiBidWYuY29uY2F0KHRhZylcbiAgICB9LCBbXSlcbiAgICByZXR1cm4gcHJldlRhZ3Muc2xpY2UoY3VycmVudFRhZ3MubGVuZ3RoIC0gcHJldlRhZ3MubGVuZ3RoKVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQXJyYXlOb2RlcyhmaWVsZDogSUZpZWxkLCB0YWdzOiBzdHJpbmdbXSkge1xuICAgIGlmICh0YWdzLmxlbmd0aCA8PSAwKSByZXR1cm5cbiAgICBjb25zdCBtYXRjaFRhZyA9IChub2RlOiBJRmllbGQpID0+ICh0YWc6IHN0cmluZykgPT5cbiAgICAgIEZvcm1QYXRoLnBhcnNlKGNhbGN1bGF0ZU1hdGhUYWcodGFnKSkubWF0Y2hBbGlhc0dyb3VwKFxuICAgICAgICBub2RlLnN0YXRlLm5hbWUsXG4gICAgICAgIG5vZGUuc3RhdGUucGF0aFxuICAgICAgKVxuXG4gICAgZ3JhcGguZWFjaENoaWxkcmVuKGZpZWxkLnN0YXRlLnBhdGgsIG5vZGUgPT4ge1xuICAgICAgaWYgKHRhZ3Muc29tZShtYXRjaFRhZyhub2RlKSkpIHtcbiAgICAgICAgZ3JhcGgucmVtb3ZlKG5vZGUuc3RhdGUucGF0aClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGFncy5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICBncmFwaC5zZWxlY3QoY2FsY3VsYXRlTWF0aFRhZyh0YWcpLCAobm9kZTogSUZpZWxkKSA9PiB7XG4gICAgICAgIGdyYXBoLnJlbW92ZShub2RlLnN0YXRlLnBhdGgpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBjYWxjdWxhdGVNYXRoVGFnKHRhZzogRm9ybVBhdGhQYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGAqKCR7dGFnfSwke3RhZ30uKilgXG4gIH1cblxuICBmdW5jdGlvbiBleGNoYW5nZVN0YXRlKFxuICAgIHBhcmVudFBhdGg6IEZvcm1QYXRoUGF0dGVybixcbiAgICBwcmV2UGF0dGVybjogRm9ybVBhdGhQYXR0ZXJuLFxuICAgIGN1cnJlbnRQYXR0ZXJuOiBGb3JtUGF0aFBhdHRlcm4sXG4gICAgbGFzdEN1cnJlbnRTdGF0ZXM6IGFueVxuICApIHtcbiAgICBjb25zdCBjdXJyZW50SW5kZXggPSBGb3JtUGF0aC50cmFuc2Zvcm0oXG4gICAgICBjdXJyZW50UGF0dGVybixcbiAgICAgIC9cXGQrLyxcbiAgICAgICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHJldHVybiBOdW1iZXIoYXJnc1thcmdzLmxlbmd0aCAtIDFdKVxuICAgICAgfVxuICAgIClcbiAgICBjb25zdCBleGNoYW5nZWQgPSB7fVxuICAgIGNvbnN0IGN1cnJlbnRTdGF0ZXMgPSB7fVxuICAgIGdyYXBoLmVhY2hDaGlsZHJlbihcbiAgICAgIHBhcmVudFBhdGgsXG4gICAgICBjYWxjdWxhdGVNYXRoVGFnKHByZXZQYXR0ZXJuKSxcbiAgICAgIChwcmV2RmllbGQ6IElGaWVsZCkgPT4ge1xuICAgICAgICBjb25zdCBwcmV2UGF0aCA9IHByZXZGaWVsZC5zdGF0ZS5wYXRoXG4gICAgICAgIGNvbnN0IHByZXZTdGF0ZSA9IHByZXZGaWVsZC5nZXRTdGF0ZShnZXRFeGNoYW5nZVN0YXRlKVxuICAgICAgICBjb25zdCBjdXJyZW50UGF0aCA9IGNhbGN1bGF0ZU1vdmVQYXRoKHByZXZQYXRoLCBjdXJyZW50SW5kZXgpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTdGF0ZSA9IGdldEZpZWxkU3RhdGUoY3VycmVudFBhdGgsIGdldEV4Y2hhbmdlU3RhdGUpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRGaWVsZCA9IGdyYXBoLmdldChjdXJyZW50UGF0aCkgYXMgSUZpZWxkXG4gICAgICAgIGlmIChwcmV2RmllbGQpIHtcbiAgICAgICAgICBwcmV2RmllbGQuc2V0U291cmNlU3RhdGUoc3RhdGUgPT4ge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGF0ZSkge1xuICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHN0YXRlLCBjdXJyZW50U3RhdGUpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvL+ihpeS9jeS6pOaNolxuICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgIGdldEV4Y2hhbmdlU3RhdGUobGFzdEN1cnJlbnRTdGF0ZXNbcHJldlBhdGhdKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc0ZpZWxkKHByZXZGaWVsZCkpIHtcbiAgICAgICAgICAgICAgc3luY0Zvcm1NZXNzYWdlcygnZXJyb3JzJywgc3RhdGUpXG4gICAgICAgICAgICAgIHN5bmNGb3JtTWVzc2FnZXMoJ3dhcm5pbmdzJywgc3RhdGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudEZpZWxkKSB7XG4gICAgICAgICAgY3VycmVudFN0YXRlc1tjdXJyZW50UGF0aF0gPSBjdXJyZW50RmllbGQuZ2V0U3RhdGUoKVxuICAgICAgICAgIGN1cnJlbnRGaWVsZC5zZXRTb3VyY2VTdGF0ZShzdGF0ZSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHN0YXRlLCBwcmV2U3RhdGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBleGNoYW5nZWRbcHJldlBhdGggKyBjdXJyZW50UGF0aF0gPSB0cnVlXG4gICAgICB9XG4gICAgKVxuICAgIHJldHVybiBjdXJyZW50U3RhdGVzXG4gIH1cblxuICBmdW5jdGlvbiBlYWNoUGFyZW50RmllbGRzKGZpZWxkOiBJRmllbGQsIGNhbGxiYWNrOiAoZmllbGQ6IElGaWVsZCkgPT4gdm9pZCkge1xuICAgIGdyYXBoLmVhY2hQYXJlbnQoZmllbGQuc3RhdGUucGF0aCwgKG5vZGU6IGFueSkgPT4ge1xuICAgICAgaWYgKGlzRmllbGQobm9kZSkpIHtcbiAgICAgICAgY2FsbGJhY2sobm9kZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gb25GaWVsZENoYW5nZSh7IGZpZWxkLCBwYXRoIH06IHsgZmllbGQ6IElGaWVsZDsgcGF0aDogRm9ybVBhdGggfSkge1xuICAgIHJldHVybiAocHVibGlzaGVkOiBJRmllbGRTdGF0ZSkgPT4ge1xuICAgICAgY29uc3QgeyBkaXJ0eXMgfSA9IGZpZWxkXG4gICAgICBpZiAoZGlydHlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfSU5JVCwgZmllbGQpXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLnZhbHVlIHx8IGRpcnR5cy52YWx1ZXMpIHtcbiAgICAgICAgY29uc3QgaXNBcnJheUxpc3QgPSAvYXJyYXkvZ2kudGVzdChwdWJsaXNoZWQuZGF0YVR5cGUpXG4gICAgICAgIGlmIChpc0FycmF5TGlzdCkge1xuICAgICAgICAgIGNvbnN0IHByZXZUYWdzID0gcGFyc2VBcnJheVRhZ3MoZmllbGQucHJldlN0YXRlLnZhbHVlKVxuICAgICAgICAgIGNvbnN0IGN1cnJlbnRUYWdzID0gcGFyc2VBcnJheVRhZ3MocHVibGlzaGVkLnZhbHVlKVxuICAgICAgICAgIGlmICghaXNFcXVhbChwcmV2VGFncywgY3VycmVudFRhZ3MpKSB7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVkVGFncyA9IGNhbGN1bGF0ZVJlbW92ZWRUYWdzKHByZXZUYWdzLCBjdXJyZW50VGFncylcbiAgICAgICAgICAgIGlmIChwcmV2VGFncy5sZW5ndGggJiYgY3VycmVudFRhZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGZvcm0uYmF0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIGVhY2hBcnJheUV4Y2hhbmdlcyhcbiAgICAgICAgICAgICAgICAgIGZpZWxkLnByZXZTdGF0ZSxcbiAgICAgICAgICAgICAgICAgIHB1Ymxpc2hlZCxcbiAgICAgICAgICAgICAgICAgIChwcmV2LCBjdXJyZW50LCBsYXN0UmVzdWx0cyA9IHt9KSA9PlxuICAgICAgICAgICAgICAgICAgICBleGNoYW5nZVN0YXRlKHBhdGgsIHByZXYsIGN1cnJlbnQsIGxhc3RSZXN1bHRzKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW92ZUFycmF5Tm9kZXMoZmllbGQsIHJlbW92ZWRUYWdzKVxuICAgICAgICAgICAgLy/ph43nva5UQUfvvIzkv53or4HkuIvmrKHnirbmgIHkuqTmjaLmmK/msqHpl67popjnmoRcbiAgICAgICAgICAgIHNldEZvcm1WYWx1ZXNJbihcbiAgICAgICAgICAgICAgZmllbGQuc3RhdGUubmFtZSxcbiAgICAgICAgICAgICAgdGFnQXJyYXlMaXN0KGZpZWxkLnN0YXRlLnZhbHVlLCBmaWVsZC5zdGF0ZS5uYW1lLCB0cnVlKSxcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZJRUxEX1ZBTFVFX0NIQU5HRSwgZmllbGQpXG4gICAgICAgIGVhY2hQYXJlbnRGaWVsZHMoZmllbGQsIG5vZGUgPT4ge1xuICAgICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfVkFMVUVfQ0hBTkdFLCBub2RlKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKGRpcnR5cy5pbml0aWFsVmFsdWUpIHtcbiAgICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GSUVMRF9JTklUSUFMX1ZBTFVFX0NIQU5HRSwgZmllbGQpXG4gICAgICAgIGVhY2hQYXJlbnRGaWVsZHMoZmllbGQsIG5vZGUgPT4ge1xuICAgICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfSU5JVElBTF9WQUxVRV9DSEFOR0UsIG5vZGUpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBpZiAoZGlydHlzLnZpc2libGUgfHwgZGlydHlzLmRpc3BsYXkpIHtcbiAgICAgICAgZ3JhcGguZWFjaENoaWxkcmVuKHBhdGgsIGNoaWxkU3RhdGUgPT4ge1xuICAgICAgICAgIGNoaWxkU3RhdGUuc2V0U3RhdGUoKHN0YXRlOiBJRmllbGRTdGF0ZTxGb3JtaWx5Q29yZS5GaWVsZFByb3BzPikgPT4ge1xuICAgICAgICAgICAgaWYgKGRpcnR5cy52aXNpYmxlKSB7XG4gICAgICAgICAgICAgIHVwZGF0ZVJlY292ZXJhYmxlU2hvd25TdGF0ZShwdWJsaXNoZWQsIHN0YXRlLCAndmlzaWJsZScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGlydHlzLmRpc3BsYXkpIHtcbiAgICAgICAgICAgICAgdXBkYXRlUmVjb3ZlcmFibGVTaG93blN0YXRlKHB1Ymxpc2hlZCwgc3RhdGUsICdkaXNwbGF5JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB0cnVlKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKGRpcnR5cy51bm1vdW50ZWQgJiYgcHVibGlzaGVkLnVubW91bnRlZCkge1xuICAgICAgICBhZnRlclVubW91bnQoKCkgPT4ge1xuICAgICAgICAgIGVudi5yZWFsUmVtb3ZlVGFncyA9IFtdXG4gICAgICAgIH0pXG4gICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfVU5NT1VOVCwgZmllbGQpXG4gICAgICAgIGlmIChlbnYudW5tb3VudFJlbW92ZU5vZGUpIHtcbiAgICAgICAgICBncmFwaC5yZW1vdmUoZmllbGQuc3RhdGUucGF0aClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZGlydHlzLm1vdW50ZWQgJiYgcHVibGlzaGVkLm1vdW50ZWQpIHtcbiAgICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GSUVMRF9NT1VOVCwgZmllbGQpXG4gICAgICB9XG5cbiAgICAgIGlmIChkaXJ0eXMuZXJyb3JzKSB7XG4gICAgICAgIHN5bmNGb3JtTWVzc2FnZXMoJ2Vycm9ycycsIHB1Ymxpc2hlZClcbiAgICAgIH1cblxuICAgICAgaWYgKGRpcnR5cy53YXJuaW5ncykge1xuICAgICAgICBzeW5jRm9ybU1lc3NhZ2VzKCd3YXJuaW5ncycsIHB1Ymxpc2hlZClcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBkaXJ0eXMudmlzaWJsZSB8fFxuICAgICAgICBkaXJ0eXMuZGlzcGxheSB8fFxuICAgICAgICBkaXJ0eXMuZWRpdGFibGUgfHxcbiAgICAgICAgZGlydHlzLnVubW91bnRlZFxuICAgICAgKSB7XG4gICAgICAgIC8vZml4ICM2ODJcbiAgICAgICAgaWYgKGRpcnR5cy51bm1vdW50ZWQpIHtcbiAgICAgICAgICBpZiAoc3VwcG9ydFVubW91bnRDbGVhclN0YXRlcyhwdWJsaXNoZWQucGF0aCkpIHtcbiAgICAgICAgICAgIHJlc2V0Rm9ybU1lc3NhZ2VzKHB1Ymxpc2hlZClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzZXRGb3JtTWVzc2FnZXMocHVibGlzaGVkKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfQ0hBTkdFLCBmaWVsZClcbiAgICAgIHJldHVybiAhZW52Lmhvc3RSZW5kZXJpbmdcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvblZpcnR1YWxGaWVsZENoYW5nZSh7XG4gICAgZmllbGQsXG4gICAgcGF0aFxuICB9OiB7XG4gICAgZmllbGQ6IElWaXJ0dWFsRmllbGRcbiAgICBwYXRoOiBGb3JtUGF0aFxuICB9KSB7XG4gICAgcmV0dXJuIChwdWJsaXNoZWQ6IElWaXJ0dWFsRmllbGRTdGF0ZSkgPT4ge1xuICAgICAgY29uc3QgeyBkaXJ0eXMgfSA9IGZpZWxkXG4gICAgICBpZiAoZGlydHlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfSU5JVCwgZmllbGQpXG4gICAgICB9XG5cbiAgICAgIGlmIChkaXJ0eXMudmlzaWJsZSB8fCBkaXJ0eXMuZGlzcGxheSkge1xuICAgICAgICBncmFwaC5lYWNoQ2hpbGRyZW4ocGF0aCwgY2hpbGRTdGF0ZSA9PiB7XG4gICAgICAgICAgY2hpbGRTdGF0ZS5zZXRTdGF0ZShcbiAgICAgICAgICAgIChzdGF0ZTogSVZpcnR1YWxGaWVsZFN0YXRlPEZvcm1pbHlDb3JlLlZpcnR1YWxGaWVsZFByb3BzPikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZGlydHlzLnZpc2libGUpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVSZWNvdmVyYWJsZVNob3duU3RhdGUocHVibGlzaGVkLCBzdGF0ZSwgJ3Zpc2libGUnKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChkaXJ0eXMuZGlzcGxheSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVJlY292ZXJhYmxlU2hvd25TdGF0ZShwdWJsaXNoZWQsIHN0YXRlLCAnZGlzcGxheScpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKGRpcnR5cy51bm1vdW50ZWQgJiYgcHVibGlzaGVkLnVubW91bnRlZCkge1xuICAgICAgICBhZnRlclVubW91bnQoKCkgPT4ge1xuICAgICAgICAgIGVudi5yZWFsUmVtb3ZlVGFncyA9IFtdXG4gICAgICAgIH0pXG4gICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfVU5NT1VOVCwgZmllbGQpXG4gICAgICAgIGlmIChlbnYudW5tb3VudFJlbW92ZU5vZGUpIHtcbiAgICAgICAgICBncmFwaC5yZW1vdmUoZmllbGQuc3RhdGUucGF0aClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRpcnR5cy5tb3VudGVkICYmIHB1Ymxpc2hlZC5tb3VudGVkKSB7XG4gICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfTU9VTlQsIGZpZWxkKVxuICAgICAgfVxuICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GSUVMRF9DSEFOR0UsIGZpZWxkKVxuICAgICAgcmV0dXJuICFlbnYuaG9zdFJlbmRlcmluZ1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBpY2tOb3RFbXB0eSh2MTogYW55LCB2MjogYW55KSB7XG4gICAgaWYgKCFpc0VtcHR5KHYxKSkgcmV0dXJuIHYxXG4gICAgaWYgKCFpc0VtcHR5KHYyKSkgcmV0dXJuIHYyXG4gICAgaWYgKGlzVmFsaWQodjEpKSByZXR1cm4gdjFcbiAgICBpZiAoaXNWYWxpZCh2MikpIHJldHVybiB2MlxuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJGaWVsZCh7XG4gICAgcGF0aCxcbiAgICBuYW1lLFxuICAgIHZhbHVlLFxuICAgIGluaXRpYWxWYWx1ZSxcbiAgICByZXF1aXJlZCxcbiAgICBydWxlcyxcbiAgICBlZGl0YWJsZSxcbiAgICB2aXNpYmxlLFxuICAgIGRpc3BsYXksXG4gICAgY29tcHV0ZVN0YXRlLFxuICAgIGRhdGFUeXBlLFxuICAgIHByb3BzXG4gIH06IElGaWVsZFJlZ2lzdHJ5UHJvcHM8Rm9ybWlseUNvcmUuRmllbGRQcm9wcz4pIHtcbiAgICBsZXQgZmllbGQ6IElGaWVsZFxuICAgIGNvbnN0IG5vZGVQYXRoID0gRm9ybVBhdGgucGFyc2UocGF0aCB8fCBuYW1lKVxuICAgIGNvbnN0IGRhdGFQYXRoID0gZ2V0RGF0YVBhdGgobm9kZVBhdGgpXG4gICAgY29uc3QgY3JlYXRlRmllbGQgPSAoKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZCA9IG5ldyBGaWVsZCh7XG4gICAgICAgIG5vZGVQYXRoLFxuICAgICAgICBkYXRhUGF0aCxcbiAgICAgICAgY29tcHV0ZVN0YXRlLFxuICAgICAgICBkYXRhVHlwZSxcbiAgICAgICAgZ2V0VmFsdWUobmFtZSkge1xuICAgICAgICAgIHJldHVybiBnZXRGb3JtVmFsdWVzSW4obmFtZSlcbiAgICAgICAgfSxcbiAgICAgICAgc3VwcG9ydFVubW91bnRDbGVhclN0YXRlcyhwYXRoKSB7XG4gICAgICAgICAgaWYgKCFzdXBwb3J0VW5tb3VudENsZWFyU3RhdGVzKHBhdGgpKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICBpZiAoIWVudi5yZWFsUmVtb3ZlVGFncz8ubGVuZ3RoKSByZXR1cm4gdHJ1ZVxuICAgICAgICAgIHJldHVybiBlbnYucmVhbFJlbW92ZVRhZ3MuZXZlcnkodGFnID0+IHtcbiAgICAgICAgICAgIHJldHVybiAhRm9ybVBhdGgucGFyc2UoY2FsY3VsYXRlTWF0aFRhZyh0YWcpKS5tYXRjaChwYXRoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldEVkaXRhYmxlKCkge1xuICAgICAgICAgIHJldHVybiBmb3JtLmdldFN0YXRlKHN0YXRlID0+IHN0YXRlLmVkaXRhYmxlKVxuICAgICAgICB9LFxuICAgICAgICBzZXRWYWx1ZShuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgIHVwbG9hZCgoKSA9PiB7XG4gICAgICAgICAgICBzZXRGb3JtVmFsdWVzSW4obmFtZSwgdmFsdWUpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW5pdGlhbFZhbHVlKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgdXBsb2FkKCgpID0+IHtcbiAgICAgICAgICAgIHNldEZvcm1Jbml0aWFsVmFsdWVzSW4obmFtZSwgdmFsdWUpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlVmFsdWUobmFtZSkge1xuICAgICAgICAgIGlmICghZ3JhcGguZ2V0KG5vZGVQYXRoKSkgcmV0dXJuXG4gICAgICAgICAgdXBsb2FkKCgpID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZUZvcm1WYWx1ZXNJbihuYW1lKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldEluaXRpYWxWYWx1ZShuYW1lKSB7XG4gICAgICAgICAgcmV0dXJuIGdldEZvcm1Jbml0aWFsVmFsdWVzSW4obmFtZSlcbiAgICAgICAgfSxcbiAgICAgICAgdW5Db250cm9sbGVkVmFsdWVDaGFuZ2VkKCkge1xuICAgICAgICAgIG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgIC8v6Z2e5Y+X5o6n5YC85Y+Y5YyW77yM6ZyA6KaBbW9ja+S4gOS4qmRpcnR55L+h5oGv77yM5ZCm5YiZaGFzQ2hhbmdlZOWIpOaWreS8muWkseaViFxuICAgICAgICAgICAgZmllbGQuZGlydHlzID0ge1xuICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgdmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgICBtb2RpZmllZDogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmllbGQuZGlydHlDb3VudCA9IDNcbiAgICAgICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfVkFMVUVfQ0hBTkdFLCBmaWVsZClcbiAgICAgICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfQ0hBTkdFLCBmaWVsZClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgZmllbGQuc3Vic2NyaXB0aW9uID0ge1xuICAgICAgICBub3RpZnk6IG9uRmllbGRDaGFuZ2UoeyBmaWVsZCwgcGF0aDogbm9kZVBhdGggfSlcbiAgICAgIH1cbiAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfV0lMTF9JTklULCBmaWVsZClcblxuICAgICAgZ3JhcGguYXBwZW5kTm9kZShmaWVsZCwgbm9kZVBhdGgsIGRhdGFQYXRoKVxuXG4gICAgICBmaWVsZC5iYXRjaCgoKSA9PiB7XG4gICAgICAgIGZpZWxkLnNldFN0YXRlKChzdGF0ZTogSUZpZWxkU3RhdGU8Rm9ybWlseUNvcmUuRmllbGRQcm9wcz4pID0+IHtcbiAgICAgICAgICBjb25zdCBmb3JtVmFsdWUgPSBnZXRGb3JtVmFsdWVzSW4oc3RhdGUubmFtZSlcbiAgICAgICAgICBjb25zdCBmb3JtSW5pdGlhbFZhbHVlID0gZ2V0Rm9ybUluaXRpYWxWYWx1ZXNJbihzdGF0ZS5uYW1lKVxuICAgICAgICAgIGNvbnN0IHN5bmNWYWx1ZSA9IHBpY2tOb3RFbXB0eSh2YWx1ZSwgZm9ybVZhbHVlKVxuICAgICAgICAgIGNvbnN0IHN5bmNJbml0aWFsVmFsdWUgPSBwaWNrTm90RW1wdHkoaW5pdGlhbFZhbHVlLCBmb3JtSW5pdGlhbFZhbHVlKVxuXG4gICAgICAgICAgaWYgKGlzVmFsaWQoc3luY0luaXRpYWxWYWx1ZSkpIHtcbiAgICAgICAgICAgIHN0YXRlLmluaXRpYWxWYWx1ZSA9IHN5bmNJbml0aWFsVmFsdWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNWYWxpZChzeW5jVmFsdWUpKSB7XG4gICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IHN5bmNWYWx1ZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNWYWxpZChzdGF0ZS5pbml0aWFsVmFsdWUpKSB7XG4gICAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gc3RhdGUuaW5pdGlhbFZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzVmFsaWQodmlzaWJsZSkpIHtcbiAgICAgICAgICAgIHN0YXRlLnZpc2libGUgPSB2aXNpYmxlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc1ZhbGlkKGRpc3BsYXkpKSB7XG4gICAgICAgICAgICBzdGF0ZS5kaXNwbGF5ID0gZGlzcGxheVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNWYWxpZChwcm9wcykpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb3BzID0gcHJvcHNcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzVmFsaWQocmVxdWlyZWQpKSB7XG4gICAgICAgICAgICBzdGF0ZS5yZXF1aXJlZCA9IHJlcXVpcmVkXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc1ZhbGlkKHJ1bGVzKSkge1xuICAgICAgICAgICAgc3RhdGUucnVsZXMgPSBydWxlcyBhcyBhbnlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzVmFsaWQoZWRpdGFibGUpKSB7XG4gICAgICAgICAgICBzdGF0ZS5zZWxmRWRpdGFibGUgPSBlZGl0YWJsZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNWYWxpZChvcHRpb25zLmVkaXRhYmxlKSkge1xuICAgICAgICAgICAgc3RhdGUuZm9ybUVkaXRhYmxlID0gb3B0aW9ucy5lZGl0YWJsZVxuICAgICAgICAgIH1cbiAgICAgICAgICBzdGF0ZS5pbml0aWFsaXplZCA9IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgYmF0Y2hSdW5UYXNrUXVldWUoZmllbGQsIG5vZGVQYXRoKVxuICAgICAgfSlcblxuICAgICAgdmFsaWRhdG9yLnJlZ2lzdGVyKG5vZGVQYXRoLCB2YWxpZGF0ZSA9PiB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICBydWxlcyxcbiAgICAgICAgICBlcnJvcnMsXG4gICAgICAgICAgd2FybmluZ3MsXG4gICAgICAgICAgZWRpdGFibGUsXG4gICAgICAgICAgdmlzaWJsZSxcbiAgICAgICAgICB1bm1vdW50ZWQsXG4gICAgICAgICAgZGlzcGxheVxuICAgICAgICB9ID0gZmllbGQuZ2V0U3RhdGUoKVxuICAgICAgICAvLyDkuI3pnIDopoHmoKHpqoznmoTmg4XlhrXmnIk6IOmdnue8lui+keaAgShlZGl0YWJsZSnvvIzlt7LplIDmr4EodW5tb3VudGVkKSwg6YC76L6R5LiK5LiN5Y+v6KeBKHZpc2libGUpXG4gICAgICAgIGlmIChcbiAgICAgICAgICBlZGl0YWJsZSA9PT0gZmFsc2UgfHxcbiAgICAgICAgICB2aXNpYmxlID09PSBmYWxzZSB8fFxuICAgICAgICAgIHVubW91bnRlZCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgIGRpc3BsYXkgPT09IGZhbHNlIHx8XG4gICAgICAgICAgKGZpZWxkIGFzIGFueSkuZGlzYWJsZWRWYWxpZGF0ZSB8fFxuICAgICAgICAgIChydWxlcy5sZW5ndGggPT09IDAgJiYgZXJyb3JzLmxlbmd0aCA9PT0gMCAmJiB3YXJuaW5ncy5sZW5ndGggPT09IDApXG4gICAgICAgIClcbiAgICAgICAgICByZXR1cm4gdmFsaWRhdGUodmFsdWUsIFtdKVxuICAgICAgICBjbGVhclRpbWVvdXQoKGZpZWxkIGFzIGFueSkudmFsaWRhdGVUaW1lcilcbiAgICAgICAgOyhmaWVsZCBhcyBhbnkpLnZhbGlkYXRlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBmaWVsZC5zZXRTdGF0ZShzdGF0ZSA9PiB7XG4gICAgICAgICAgICBzdGF0ZS52YWxpZGF0aW5nID0gdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH0sIDYwKVxuICAgICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZJRUxEX1ZBTElEQVRFX1NUQVJULCBmaWVsZClcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHZhbHVlLCBydWxlcykudGhlbigoeyBlcnJvcnMsIHdhcm5pbmdzIH0pID0+IHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQoKGZpZWxkIGFzIGFueSkudmFsaWRhdGVUaW1lcilcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICBmaWVsZC5zZXRTdGF0ZSgoc3RhdGU6IElGaWVsZFN0YXRlPEZvcm1pbHlDb3JlLkZpZWxkUHJvcHM+KSA9PiB7XG4gICAgICAgICAgICAgIHN0YXRlLnZhbGlkYXRpbmcgPSBmYWxzZVxuICAgICAgICAgICAgICBzdGF0ZS5ydWxlRXJyb3JzID0gZXJyb3JzXG4gICAgICAgICAgICAgIHN0YXRlLnJ1bGVXYXJuaW5ncyA9IHdhcm5pbmdzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GSUVMRF9WQUxJREFURV9FTkQsIGZpZWxkKVxuICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgIGVycm9ycyxcbiAgICAgICAgICAgICAgd2FybmluZ3NcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICByZXR1cm4gZmllbGRcbiAgICB9XG4gICAgaWYgKGdyYXBoLmV4aXN0KG5vZGVQYXRoKSkge1xuICAgICAgZmllbGQgPSBncmFwaC5nZXQobm9kZVBhdGgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkID0gY3JlYXRlRmllbGQoKVxuICAgIH1cbiAgICByZXR1cm4gZmllbGRcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyVmlydHVhbEZpZWxkKHtcbiAgICBuYW1lLFxuICAgIHBhdGgsXG4gICAgZGlzcGxheSxcbiAgICB2aXNpYmxlLFxuICAgIGNvbXB1dGVTdGF0ZSxcbiAgICBwcm9wc1xuICB9OiBJVmlydHVhbEZpZWxkUmVnaXN0cnlQcm9wczxGb3JtaWx5Q29yZS5WaXJ0dWFsRmllbGRQcm9wcz4pIHtcbiAgICBjb25zdCBub2RlUGF0aCA9IEZvcm1QYXRoLnBhcnNlKHBhdGggfHwgbmFtZSlcbiAgICBjb25zdCBkYXRhUGF0aCA9IGdldERhdGFQYXRoKG5vZGVQYXRoKVxuICAgIGxldCBmaWVsZDogSVZpcnR1YWxGaWVsZFxuICAgIGNvbnN0IGNyZWF0ZUZpZWxkID0gKCkgPT4ge1xuICAgICAgY29uc3QgZmllbGQgPSBuZXcgVmlydHVhbEZpZWxkKHtcbiAgICAgICAgbm9kZVBhdGgsXG4gICAgICAgIGRhdGFQYXRoLFxuICAgICAgICBjb21wdXRlU3RhdGVcbiAgICAgIH0pXG4gICAgICBmaWVsZC5zdWJzY3JpcHRpb24gPSB7XG4gICAgICAgIG5vdGlmeTogb25WaXJ0dWFsRmllbGRDaGFuZ2UoeyBmaWVsZCwgcGF0aDogbm9kZVBhdGggfSlcbiAgICAgIH1cbiAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRklFTERfV0lMTF9JTklULCBmaWVsZClcblxuICAgICAgZ3JhcGguYXBwZW5kTm9kZShmaWVsZCwgbm9kZVBhdGgsIGRhdGFQYXRoKVxuXG4gICAgICBmaWVsZC5iYXRjaCgoKSA9PiB7XG4gICAgICAgIGZpZWxkLnNldFN0YXRlKFxuICAgICAgICAgIChzdGF0ZTogSVZpcnR1YWxGaWVsZFN0YXRlPEZvcm1pbHlDb3JlLlZpcnR1YWxGaWVsZFByb3BzPikgPT4ge1xuICAgICAgICAgICAgc3RhdGUuaW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICAgICAgICBzdGF0ZS5wcm9wcyA9IHByb3BzXG4gICAgICAgICAgICBpZiAoaXNWYWxpZCh2aXNpYmxlKSkge1xuICAgICAgICAgICAgICBzdGF0ZS52aXNpYmxlID0gdmlzaWJsZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzVmFsaWQoZGlzcGxheSkpIHtcbiAgICAgICAgICAgICAgc3RhdGUuZGlzcGxheSA9IGRpc3BsYXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgYmF0Y2hSdW5UYXNrUXVldWUoZmllbGQsIG5vZGVQYXRoKVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIGZpZWxkXG4gICAgfVxuICAgIGlmIChncmFwaC5leGlzdChub2RlUGF0aCkpIHtcbiAgICAgIGZpZWxkID0gZ3JhcGguZ2V0KG5vZGVQYXRoKVxuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZCA9IGNyZWF0ZUZpZWxkKClcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkXG4gIH1cblxuICBmdW5jdGlvbiBnZXRGaWVsZFN0YXRlKFxuICAgIHBhdGg6IEZvcm1QYXRoUGF0dGVybixcbiAgICBjYWxsYmFjaz86IChzdGF0ZTogSUZpZWxkU3RhdGU8Rm9ybWlseUNvcmUuRmllbGRQcm9wcz4pID0+IGFueVxuICApIHtcbiAgICBjb25zdCBmaWVsZCA9IGdyYXBoLnNlbGVjdChwYXRoKVxuICAgIHJldHVybiBmaWVsZCAmJiBmaWVsZC5nZXRTdGF0ZShjYWxsYmFjaylcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEZpZWxkU3RhdGUoXG4gICAgcGF0aDogRm9ybVBhdGhQYXR0ZXJuLFxuICAgIGNhbGxiYWNrPzogKHN0YXRlOiBJRmllbGRTdGF0ZTxGb3JtaWx5Q29yZS5GaWVsZFByb3BzPikgPT4gdm9pZCxcbiAgICBzaWxlbnQ/OiBib29sZWFuXG4gICkge1xuICAgIGlmICghaXNGbihjYWxsYmFjaykpIHJldHVyblxuICAgIGxldCBtYXRjaENvdW50ID0gMFxuICAgIGNvbnN0IHBhdHRlcm4gPSBGb3JtUGF0aC5nZXRQYXRoKHBhdGgpXG4gICAgZ3JhcGguc2VsZWN0KHBhdHRlcm4sIGZpZWxkID0+IHtcbiAgICAgIGlmICghaXNGb3JtU3RhdGUoZmllbGQpKSB7XG4gICAgICAgIGZpZWxkLnNldFN0YXRlKGNhbGxiYWNrLCBzaWxlbnQpXG4gICAgICB9XG4gICAgICBtYXRjaENvdW50KytcbiAgICB9KVxuICAgIGlmIChtYXRjaENvdW50ID09PSAwIHx8IHBhdHRlcm4uaXNXaWxkTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICBwdXNoVGFza1F1ZXVlKHBhdHRlcm4sIGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZpZWxkVmFsdWUocGF0aD86IEZvcm1QYXRoUGF0dGVybikge1xuICAgIHJldHVybiBnZXRGaWVsZFN0YXRlKHBhdGgsIHN0YXRlID0+IHtcbiAgICAgIHJldHVybiBzdGF0ZS52YWx1ZVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBzZXRGaWVsZFZhbHVlKHBhdGg6IEZvcm1QYXRoUGF0dGVybiwgdmFsdWU/OiBhbnksIHNpbGVudD86IGJvb2xlYW4pIHtcbiAgICBzZXRGaWVsZFN0YXRlKFxuICAgICAgcGF0aCxcbiAgICAgIHN0YXRlID0+IHtcbiAgICAgICAgc3RhdGUudmFsdWUgPSB2YWx1ZVxuICAgICAgfSxcbiAgICAgIHNpbGVudFxuICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZpZWxkSW5pdGlhbFZhbHVlKHBhdGg/OiBGb3JtUGF0aFBhdHRlcm4pIHtcbiAgICByZXR1cm4gZ2V0RmllbGRTdGF0ZShwYXRoLCBzdGF0ZSA9PiB7XG4gICAgICByZXR1cm4gc3RhdGUuaW5pdGlhbFZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEZpZWxkSW5pdGlhbFZhbHVlKFxuICAgIHBhdGg/OiBGb3JtUGF0aFBhdHRlcm4sXG4gICAgdmFsdWU/OiBhbnksXG4gICAgc2lsZW50PzogYm9vbGVhblxuICApIHtcbiAgICBzZXRGaWVsZFN0YXRlKFxuICAgICAgcGF0aCxcbiAgICAgIHN0YXRlID0+IHtcbiAgICAgICAgc3RhdGUuaW5pdGlhbFZhbHVlID0gdmFsdWVcbiAgICAgIH0sXG4gICAgICBzaWxlbnRcbiAgICApXG4gIH1cblxuICBmdW5jdGlvbiBnZXRGb3JtU3RhdGUoY2FsbGJhY2s/OiAoc3RhdGU6IElGb3JtU3RhdGUpID0+IGFueSkge1xuICAgIHJldHVybiBmb3JtLmdldFN0YXRlKGNhbGxiYWNrKVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0Rm9ybVN0YXRlKFxuICAgIGNhbGxiYWNrPzogKHN0YXRlOiBJRm9ybVN0YXRlKSA9PiBhbnksXG4gICAgc2lsZW50PzogYm9vbGVhblxuICApIHtcbiAgICBob3N0VXBkYXRlKCgpID0+IHtcbiAgICAgIGZvcm0uc2V0U3RhdGUoY2FsbGJhY2ssIHNpbGVudClcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Rm9ybUdyYXBoKCkge1xuICAgIHJldHVybiBncmFwaC5tYXAobm9kZSA9PiB7XG4gICAgICByZXR1cm4gbm9kZS5nZXRTdGF0ZSgpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEZvcm1HcmFwaChub2RlczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xuICAgIGVhY2goXG4gICAgICBub2RlcyxcbiAgICAgIChcbiAgICAgICAgbm9kZTpcbiAgICAgICAgICB8IElGaWVsZFN0YXRlPEZvcm1pbHlDb3JlLkZpZWxkUHJvcHM+XG4gICAgICAgICAgfCBJVmlydHVhbEZpZWxkU3RhdGU8Rm9ybWlseUNvcmUuVmlydHVhbEZpZWxkUHJvcHM+LFxuICAgICAgICBrZXlcbiAgICAgICkgPT4ge1xuICAgICAgICBsZXQgbm9kZVN0YXRlOiBhbnlcbiAgICAgICAgaWYgKGdyYXBoLmV4aXN0KGtleSkpIHtcbiAgICAgICAgICBub2RlU3RhdGUgPSBncmFwaC5nZXQoa2V5KVxuICAgICAgICAgIG5vZGVTdGF0ZS5zZXRTb3VyY2VTdGF0ZShzdGF0ZSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHN0YXRlLCBub2RlKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG5vZGUuZGlzcGxheU5hbWUgPT09ICdWaXJ0dWFsRmllbGRTdGF0ZScpIHtcbiAgICAgICAgICAgIG5vZGVTdGF0ZSA9IHJlZ2lzdGVyVmlydHVhbEZpZWxkKHtcbiAgICAgICAgICAgICAgcGF0aDoga2V5XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgbm9kZVN0YXRlLnNldFNvdXJjZVN0YXRlKHN0YXRlID0+IHtcbiAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihzdGF0ZSwgbm9kZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIGlmIChub2RlLmRpc3BsYXlOYW1lID09PSAnRmllbGRTdGF0ZScpIHtcbiAgICAgICAgICAgIG5vZGVTdGF0ZSA9IHJlZ2lzdGVyRmllbGQoe1xuICAgICAgICAgICAgICBwYXRoOiBrZXlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBub2RlU3RhdGUuc2V0U291cmNlU3RhdGUoc3RhdGUgPT4ge1xuICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHN0YXRlLCBub2RlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVTdGF0ZSkge1xuICAgICAgICAgIG5vZGVTdGF0ZS5ub3RpZnkoZm9ybS5nZXRTdGF0ZSgpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gc3Vic2NyaWJlKGNhbGxiYWNrPzogRm9ybUhlYXJ0U3Vic2NyaWJlcikge1xuICAgIHJldHVybiBoZWFydC5zdWJzY3JpYmUoY2FsbGJhY2spXG4gIH1cblxuICBmdW5jdGlvbiB1bnN1YnNjcmliZShpZDogbnVtYmVyKSB7XG4gICAgaGVhcnQudW5zdWJzY3JpYmUoaWQpXG4gIH1cblxuICBmdW5jdGlvbiBub3RpZnkodHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpIHtcbiAgICBoZWFydC5wdWJsaXNoKHR5cGUsIHBheWxvYWQpXG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBzdWJtaXQoXG4gICAgb25TdWJtaXQ/OiAodmFsdWVzOiBJRm9ybVN0YXRlWyd2YWx1ZXMnXSkgPT4gYW55IHwgUHJvbWlzZTxhbnk+XG4gICk6IFByb21pc2U8SUZvcm1TdWJtaXRSZXN1bHQ+IHtcbiAgICAvLyDph43lpI3mj5DkuqTvvIzov5Tlm57liY3kuIDmrKHnmoRwcm9taXNlXG4gICAgaWYgKGZvcm0uZ2V0U3RhdGUoc3RhdGUgPT4gc3RhdGUuc3VibWl0dGluZykpIHJldHVybiBlbnYuc3VibWl0dGluZ1Rhc2tcbiAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZPUk1fU1VCTUlUX1NUQVJULCBmb3JtKVxuICAgIG9uU3VibWl0ID0gb25TdWJtaXQgfHwgb3B0aW9ucy5vblN1Ym1pdFxuICAgIGZvcm0uc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgICAgc3RhdGUuc3VibWl0dGluZyA9IHRydWVcbiAgICB9KVxuXG4gICAgZW52LnN1Ym1pdHRpbmdUYXNrID0gYXN5bmMgKCkgPT4ge1xuICAgICAgLy8g5aKe5Yqgb25Gb3JtU3VibWl0VmFsaWRhdGVTdGFydOadpeaYjuehrnN1Ym1pdOW8lei1t+eahOagoemqjOW8gOWni+S6hlxuICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX1NVQk1JVF9WQUxJREFURV9TVEFSVCwgZm9ybSlcbiAgICAgIGF3YWl0IHZhbGlkYXRlKCcnLCB7IHRocm93RXJyb3JzOiBmYWxzZSwgaG9zdFJlbmRlcmluZzogdHJ1ZSB9KVxuICAgICAgY29uc3QgdmFsaWRhdGVkID0gZm9ybS5nZXRTdGF0ZShzdGF0ZSA9PiAoe1xuICAgICAgICBlcnJvcnM6IHN0YXRlLmVycm9ycyxcbiAgICAgICAgd2FybmluZ3M6IHN0YXRlLndhcm5pbmdzXG4gICAgICB9KSlcbiAgICAgIGNvbnN0IHsgZXJyb3JzIH0gPSB2YWxpZGF0ZWRcbiAgICAgIC8vIOagoemqjOWksei0pVxuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgLy8g55Sx5LqO5qCh6aqM5aSx6LSl5a+86Ie0c3VibWl06YCA5Ye6XG4gICAgICAgIGZvcm0uc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgICAgICAgIHN0YXRlLnN1Ym1pdHRpbmcgPSBmYWxzZVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIOWinuWKoG9uRm9ybVN1Ym1pdFZhbGlkYXRlRmFpbGVk5p2l5piO56Gu57uT5p2fc3VibWl055qE57G75Z6LXG4gICAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRk9STV9TVUJNSVRfVkFMSURBVEVfRkFJTEVELCBmb3JtKVxuICAgICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZPUk1fU1VCTUlUX0VORCwgZm9ybSlcbiAgICAgICAgaWYgKGlzRm4ob3B0aW9ucy5vblZhbGlkYXRlRmFpbGVkKSAmJiAhZm9ybS5zdGF0ZS51bm1vdW50ZWQpIHtcbiAgICAgICAgICBvcHRpb25zLm9uVmFsaWRhdGVGYWlsZWQodmFsaWRhdGVkKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgZXJyb3JzXG4gICAgICB9XG5cbiAgICAgIC8vIOWinuWKoG9uRm9ybVN1Ym1pdFZhbGlkYXRlU3VjY2Vz5p2l5piO56Guc3VibWl05byV6LW355qE5qCh6aqM5pyA57uI55qE57uT5p6cXG4gICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZPUk1fU1VCTUlUX1ZBTElEQVRFX1NVQ0NFU1MsIGZvcm0pXG5cbiAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRk9STV9TVUJNSVQsIGZvcm0pXG5cbiAgICAgIGxldCBwYXlsb2FkOiBhbnlcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGZvcm0uZ2V0U3RhdGUoc3RhdGUgPT4gY2xvbmUoc3RhdGUudmFsdWVzKSlcbiAgICAgIGlmIChpc0ZuKG9uU3VibWl0KSAmJiAhZm9ybS5zdGF0ZS51bm1vdW50ZWQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBwYXlsb2FkID0gYXdhaXQgUHJvbWlzZS5yZXNvbHZlKG9uU3VibWl0KHZhbHVlcykpXG4gICAgICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX09OX1NVQk1JVF9TVUNDRVNTLCBwYXlsb2FkKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX09OX1NVQk1JVF9GQUlMRUQsIGUpXG4gICAgICAgICAgbmV3IFByb21pc2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9ybS5zZXRTdGF0ZShzdGF0ZSA9PiB7XG4gICAgICAgIHN0YXRlLnN1Ym1pdHRpbmcgPSBmYWxzZVxuICAgICAgfSlcbiAgICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRk9STV9TVUJNSVRfRU5ELCBmb3JtKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWVzLFxuICAgICAgICB2YWxpZGF0ZWQsXG4gICAgICAgIHBheWxvYWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZW52LnN1Ym1pdHRpbmdUYXNrKClcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHJlc2V0KFxuICAgIHByb3BzOiBJRm9ybVJlc2V0T3B0aW9ucyA9IHt9XG4gICk6IFByb21pc2U8dm9pZCB8IElGb3JtVmFsaWRhdGVSZXN1bHQ+IHtcbiAgICBwcm9wcyA9IGRlZmF1bHRzKFxuICAgICAge1xuICAgICAgICBzZWxlY3RvcjogJyonLFxuICAgICAgICBmb3JjZUNsZWFyOiBmYWxzZSxcbiAgICAgICAgdmFsaWRhdGU6IHRydWUsXG4gICAgICAgIGNsZWFySW5pdGlhbFZhbHVlOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHByb3BzXG4gICAgKVxuICAgIGhvc3RVcGRhdGUoKCkgPT4ge1xuICAgICAgZ3JhcGguZWFjaENoaWxkcmVuKCcnLCBwcm9wcy5zZWxlY3RvciwgKGZpZWxkOiBJRmllbGQpID0+IHtcbiAgICAgICAgOyhmaWVsZCBhcyBhbnkpLmRpc2FibGVkVmFsaWRhdGUgPSB0cnVlXG4gICAgICAgIGZpZWxkLnNldFN0YXRlKChzdGF0ZTogSUZpZWxkU3RhdGU8Rm9ybWlseUNvcmUuRmllbGRQcm9wcz4pID0+IHtcbiAgICAgICAgICBzdGF0ZS5tb2RpZmllZCA9IGZhbHNlXG4gICAgICAgICAgc3RhdGUucnVsZUVycm9ycyA9IFtdXG4gICAgICAgICAgc3RhdGUucnVsZVdhcm5pbmdzID0gW11cbiAgICAgICAgICBzdGF0ZS5lZmZlY3RFcnJvcnMgPSBbXVxuICAgICAgICAgIHN0YXRlLmVmZmVjdFdhcm5pbmdzID0gW11cbiAgICAgICAgICBpZiAocHJvcHMuY2xlYXJJbml0aWFsVmFsdWUpIHtcbiAgICAgICAgICAgIHN0YXRlLmluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBmb3JjZUNsZWFy5LuF5a+56K6+572uaW5pdGlhbFZhbHVlc+eahOaDheWGteS4i+acieaEj+S5iVxuICAgICAgICAgIGlmIChwcm9wcy5mb3JjZUNsZWFyIHx8ICFpc1ZhbGlkKHN0YXRlLmluaXRpYWxWYWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChpc0FycihzdGF0ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgc3RhdGUudmFsdWUgPSBbXVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1BsYWluT2JqKHN0YXRlLnZhbHVlKSkge1xuICAgICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IHt9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNsb25lKHN0YXRlLmluaXRpYWxWYWx1ZSlcbiAgICAgICAgICAgIGlmIChpc0FycihzdGF0ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgaWYgKGlzQXJyKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gdmFsdWVcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IFtdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iaihzdGF0ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgaWYgKGlzUGxhaW5PYmoodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUudmFsdWUgPSB2YWx1ZVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLnZhbHVlID0ge31cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RhdGUudmFsdWUgPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgOyhmaWVsZCBhcyBhbnkpLmRpc2FibGVkVmFsaWRhdGUgPSBmYWxzZVxuICAgICAgfSlcbiAgICB9KVxuICAgIGlmIChpc0ZuKG9wdGlvbnMub25SZXNldCkgJiYgIWZvcm0uc3RhdGUudW5tb3VudGVkKSB7XG4gICAgICBvcHRpb25zLm9uUmVzZXQoKVxuICAgIH1cbiAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZPUk1fUkVTRVQsIGZvcm0pXG4gICAgbGV0IHZhbGlkYXRlUmVzdWx0OiB2b2lkIHwgSUZvcm1WYWxpZGF0ZVJlc3VsdFxuICAgIGlmIChwcm9wcy52YWxpZGF0ZSkge1xuICAgICAgdmFsaWRhdGVSZXN1bHQgPSBhd2FpdCB2YWxpZGF0ZShwcm9wcy5zZWxlY3RvciwgeyB0aHJvd0Vycm9yczogZmFsc2UgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdGVSZXN1bHRcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlKFxuICAgIHBhdGg/OiBGb3JtUGF0aFBhdHRlcm4sXG4gICAgb3B0cz86IElGb3JtRXh0ZW5kZWRWYWxpZGF0ZUZpZWxkT3B0aW9uc1xuICApOiBQcm9taXNlPElGb3JtVmFsaWRhdGVSZXN1bHQ+IHtcbiAgICBjb25zdCB7IHRocm93RXJyb3JzID0gdHJ1ZSwgaG9zdFJlbmRlcmluZyB9ID0gb3B0cyB8fCB7fVxuICAgIGlmICghZm9ybS5nZXRTdGF0ZShzdGF0ZSA9PiBzdGF0ZS52YWxpZGF0aW5nKSkge1xuICAgICAgZm9ybS5zZXRTb3VyY2VTdGF0ZShzdGF0ZSA9PiB7XG4gICAgICAgIHN0YXRlLnZhbGlkYXRpbmcgPSB0cnVlXG4gICAgICB9KVxuICAgICAgLy8g5riy5p+T5LyY5YyWXG4gICAgICBjbGVhclRpbWVvdXQoZW52LnZhbGlkYXRlVGltZXIpXG4gICAgICBlbnYudmFsaWRhdGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBmb3JtLm5vdGlmeSgpXG4gICAgICB9LCA2MClcbiAgICB9XG4gICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX1ZBTElEQVRFX1NUQVJULCBmb3JtKVxuICAgIGlmIChncmFwaC5zaXplID4gMTAwICYmIGhvc3RSZW5kZXJpbmcpIGVudi5ob3N0UmVuZGVyaW5nID0gdHJ1ZVxuICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCB2YWxpZGF0b3IudmFsaWRhdGUocGF0aCwgb3B0cylcbiAgICBjbGVhclRpbWVvdXQoZW52LnZhbGlkYXRlVGltZXIpXG4gICAgZm9ybS5zZXRTdGF0ZShzdGF0ZSA9PiB7XG4gICAgICBzdGF0ZS52YWxpZGF0aW5nID0gZmFsc2VcbiAgICB9KVxuICAgIGhlYXJ0LnB1Ymxpc2goTGlmZUN5Y2xlVHlwZXMuT05fRk9STV9WQUxJREFURV9FTkQsIGZvcm0pXG4gICAgaWYgKGdyYXBoLnNpemUgPiAxMDAgJiYgaG9zdFJlbmRlcmluZykge1xuICAgICAgaGVhcnQucHVibGlzaChMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX0hPU1RfUkVOREVSLCBmb3JtKVxuICAgICAgZW52Lmhvc3RSZW5kZXJpbmcgPSBmYWxzZVxuICAgIH1cbiAgICAvLyDlop7liqBuYW1l6YCP5Ye655yf5a6e6Lev5b6E77yM5ZKMMC545L+d5oyB5LiA6Ie0XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgZXJyb3JzOiBwYXlsb2FkLmVycm9ycy5tYXAoaXRlbSA9PiAoe1xuICAgICAgICAuLi5pdGVtLFxuICAgICAgICBuYW1lOiBnZXRGaWVsZFN0YXRlKGl0ZW0ucGF0aCkubmFtZVxuICAgICAgfSkpLFxuICAgICAgd2FybmluZ3M6IHBheWxvYWQud2FybmluZ3MubWFwKGl0ZW0gPT4gKHtcbiAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgbmFtZTogZ2V0RmllbGRTdGF0ZShpdGVtLnBhdGgpLm5hbWVcbiAgICAgIH0pKVxuICAgIH1cblxuICAgIGNvbnN0IHsgZXJyb3JzLCB3YXJuaW5ncyB9ID0gcmVzdWx0XG5cbiAgICAvLyDmiZPljbB3YXJuaW5nc+aXpeW/l+S7jnN1Ym1pdOaMquWIsOi/memHjFxuICAgIGlmICh3YXJuaW5ncy5sZW5ndGgpIHtcbiAgICAgIGxvZy53YXJuKHdhcm5pbmdzKVxuICAgIH1cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0aHJvd0Vycm9ycykge1xuICAgICAgICB0aHJvdyByZXN1bHRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyRXJyb3JzKHBhdHRlcm46IEZvcm1QYXRoUGF0dGVybiA9ICcqJykge1xuICAgIC8vIDEuIOaMh+Wumui3r+W+hOaIluWFqOmDqOWtkOi3r+W+hOa4heeQhlxuICAgIGhvc3RVcGRhdGUoKCkgPT4ge1xuICAgICAgZ3JhcGguZWFjaENoaWxkcmVuKCcnLCBwYXR0ZXJuLCBmaWVsZCA9PiB7XG4gICAgICAgIGlmIChpc0ZpZWxkKGZpZWxkKSkge1xuICAgICAgICAgIGZpZWxkLnNldFN0YXRlKHN0YXRlID0+IHtcbiAgICAgICAgICAgIHN0YXRlLnJ1bGVFcnJvcnMgPSBbXVxuICAgICAgICAgICAgc3RhdGUucnVsZVdhcm5pbmdzID0gW11cbiAgICAgICAgICAgIHN0YXRlLmVmZmVjdEVycm9ycyA9IFtdXG4gICAgICAgICAgICBzdGF0ZS5lZmZlY3RXYXJuaW5ncyA9IFtdXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTXV0YXRvcnMoaW5wdXQ6IGFueSkge1xuICAgIGxldCBmaWVsZDogSUZpZWxkXG4gICAgaWYgKCFpc0ZpZWxkKGlucHV0KSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBncmFwaC5zZWxlY3QoaW5wdXQpXG4gICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgZmllbGQgPSBzZWxlY3RlZFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdUaGUgYGNyZWF0ZU11dGF0b3JzYCBjYW4gb25seSBhY2NlcHQgRmllbGRTdGF0ZSBpbnN0YW5jZSBvciBGb3JtUGF0aFBhdHRlcm4uJ1xuICAgICAgICApXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkID0gaW5wdXRcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0VmFsdWUoLi4udmFsdWVzOiBhbnlbXSkge1xuICAgICAgZmllbGQuc2V0U3RhdGUoKHN0YXRlOiBJRmllbGRTdGF0ZTxGb3JtaWx5Q29yZS5GaWVsZFByb3BzPikgPT4ge1xuICAgICAgICBzdGF0ZS52YWx1ZSA9IHZhbHVlc1swXVxuICAgICAgICBzdGF0ZS52YWx1ZXMgPSB2YWx1ZXNcbiAgICAgICAgc3RhdGUuaW5wdXRlZCA9IHRydWVcbiAgICAgIH0pXG4gICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZJRUxEX0lOUFVUX0NIQU5HRSwgZmllbGQpXG4gICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZPUk1fSU5QVVRfQ0hBTkdFLCBmb3JtKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZVZhbHVlKGtleTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgICBjb25zdCBub2RlUGF0aCA9IGZpZWxkLmdldFNvdXJjZVN0YXRlKHN0YXRlID0+IHN0YXRlLnBhdGgpXG4gICAgICBpZiAoaXNWYWxpZChrZXkpKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkTm9kZVBhdGggPSBGb3JtUGF0aC5wYXJzZShub2RlUGF0aCkuY29uY2F0KGtleSlcbiAgICAgICAgc2V0RmllbGRTdGF0ZShjaGlsZE5vZGVQYXRoLCBzdGF0ZSA9PiB7XG4gICAgICAgICAgc3RhdGUudmFsdWUgPSB1bmRlZmluZWRcbiAgICAgICAgICBzdGF0ZS52YWx1ZXMgPSBbXVxuICAgICAgICAgIHN0YXRlLmlucHV0ZWQgPSB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIGRlbGV0ZUZvcm1WYWx1ZXNJbihjaGlsZE5vZGVQYXRoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmllbGQuc2V0U3RhdGUoc3RhdGUgPT4ge1xuICAgICAgICAgIHN0YXRlLnZhbHVlID0gdW5kZWZpbmVkXG4gICAgICAgICAgc3RhdGUudmFsdWVzID0gW11cbiAgICAgICAgICBzdGF0ZS5pbnB1dGVkID0gdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICBkZWxldGVGb3JtVmFsdWVzSW4obm9kZVBhdGgpXG4gICAgICB9XG4gICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZJRUxEX1ZBTFVFX0NIQU5HRSwgZmllbGQpXG4gICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZJRUxEX0lOUFVUX0NIQU5HRSwgZmllbGQpXG4gICAgICBoZWFydC5wdWJsaXNoKExpZmVDeWNsZVR5cGVzLk9OX0ZPUk1fSU5QVVRfQ0hBTkdFLCBmb3JtKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFZhbHVlKCkge1xuICAgICAgcmV0dXJuIGZpZWxkLmdldFN0YXRlKHN0YXRlID0+IHN0YXRlLnZhbHVlKVxuICAgIH1cblxuICAgIGNvbnN0IG11dGF0b3JzID0ge1xuICAgICAgY2hhbmdlKC4uLnZhbHVlczogYW55W10pIHtcbiAgICAgICAgc2V0VmFsdWUoLi4udmFsdWVzKVxuICAgICAgICByZXR1cm4gdmFsdWVzWzBdXG4gICAgICB9LFxuICAgICAgZm9jdXMoKSB7XG4gICAgICAgIGZpZWxkLnNldFN0YXRlKChzdGF0ZTogSUZpZWxkU3RhdGU8Rm9ybWlseUNvcmUuRmllbGRQcm9wcz4pID0+IHtcbiAgICAgICAgICBzdGF0ZS5hY3RpdmUgPSB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgYmx1cigpIHtcbiAgICAgICAgZmllbGQuc2V0U3RhdGUoKHN0YXRlOiBJRmllbGRTdGF0ZTxGb3JtaWx5Q29yZS5GaWVsZFByb3BzPikgPT4ge1xuICAgICAgICAgIHN0YXRlLmFjdGl2ZSA9IGZhbHNlXG4gICAgICAgICAgc3RhdGUudmlzaXRlZCA9IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBwdXNoKHZhbHVlPzogYW55KSB7XG4gICAgICAgIGNvbnN0IGFyciA9IHRvQXJyKGdldFZhbHVlKCkpLmNvbmNhdCh2YWx1ZSlcbiAgICAgICAgc2V0VmFsdWUoYXJyKVxuICAgICAgICByZXR1cm4gYXJyXG4gICAgICB9LFxuICAgICAgcG9wKCkge1xuICAgICAgICBjb25zdCBvcmlnaW4gPSB0b0FycihnZXRWYWx1ZSgpKVxuICAgICAgICBjb25zdCBhcnIgPSBvcmlnaW4uc2xpY2UoMCwgb3JpZ2luLmxlbmd0aCAtIDEpXG4gICAgICAgIHNldFZhbHVlKGFycilcbiAgICAgICAgcmV0dXJuIGFyclxuICAgICAgfSxcbiAgICAgIGluc2VydChpbmRleDogbnVtYmVyLCB2YWx1ZTogYW55KSB7XG4gICAgICAgIGNvbnN0IG9yaWdpbiA9IHRvQXJyKGdldFZhbHVlKCkpXG4gICAgICAgIGlmIChvcmlnaW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgYXJyID0gW3ZhbHVlXVxuICAgICAgICAgIHNldFZhbHVlKGFycilcbiAgICAgICAgICByZXR1cm4gYXJyXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9yaWdpbi5sZW5ndGggPT09IGluZGV4KSB7XG4gICAgICAgICAgY29uc3QgYXJyID0gb3JpZ2luLmNvbmNhdChbdmFsdWVdKVxuICAgICAgICAgIHNldFZhbHVlKGFycilcbiAgICAgICAgICByZXR1cm4gYXJyXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXJyID0gb3JpZ2luLnJlZHVjZSgoYnVmLCBpdGVtLCBpZHgpID0+IHtcbiAgICAgICAgICByZXR1cm4gaWR4ID09PSBpbmRleCA/IGJ1Zi5jb25jYXQoW3ZhbHVlLCBpdGVtXSkgOiBidWYuY29uY2F0KGl0ZW0pXG4gICAgICAgIH0sIFtdKVxuICAgICAgICBzZXRWYWx1ZShhcnIpXG4gICAgICAgIHJldHVybiBhcnJcbiAgICAgIH0sXG4gICAgICByZW1vdmUoaW5kZXg/OiBudW1iZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgdmFsID0gZ2V0VmFsdWUoKVxuICAgICAgICBpZiAoaXNOdW0oaW5kZXgpICYmIGlzQXJyKHZhbCkpIHtcbiAgICAgICAgICBzZXRWYWx1ZSh2YWwuZmlsdGVyKChpdGVtLCBpZHgpID0+IGlkeCAhPT0gaW5kZXgpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlbW92ZVZhbHVlKGluZGV4KVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZXhpc3QoaW5kZXg/OiBudW1iZXIgfCBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbmV3UGF0aCA9IGZpZWxkLmdldFNvdXJjZVN0YXRlKHN0YXRlID0+XG4gICAgICAgICAgRm9ybVBhdGgucGFyc2Uoc3RhdGUucGF0aClcbiAgICAgICAgKVxuICAgICAgICBjb25zdCB2YWwgPSBnZXRWYWx1ZSgpXG4gICAgICAgIHJldHVybiAoaXNWYWxpZChpbmRleCkgPyBuZXdQYXRoLmNvbmNhdChpbmRleCkgOiBuZXdQYXRoKS5leGlzdEluKFxuICAgICAgICAgIHZhbCxcbiAgICAgICAgICBuZXdQYXRoXG4gICAgICAgIClcbiAgICAgIH0sXG4gICAgICB1bnNoaWZ0KHZhbHVlOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIG11dGF0b3JzLmluc2VydCgwLCB2YWx1ZSlcbiAgICAgIH0sXG4gICAgICBzaGlmdCgpIHtcbiAgICAgICAgcmV0dXJuIG11dGF0b3JzLnJlbW92ZSgwKVxuICAgICAgfSxcbiAgICAgIHN3YXAoJGZyb206IG51bWJlciwgJHRvOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgYXJyID0gdG9BcnIoZ2V0VmFsdWUoKSkuc2xpY2UoKVxuICAgICAgICBjb25zdCBmcm9tSXRlbSA9IGFyclskZnJvbV1cbiAgICAgICAgY29uc3QgdG9JdGVtID0gYXJyWyR0b11cbiAgICAgICAgYXJyWyRmcm9tXSA9IHRvSXRlbVxuICAgICAgICBhcnJbJHRvXSA9IGZyb21JdGVtXG4gICAgICAgIHNldFZhbHVlKGFycilcbiAgICAgICAgcmV0dXJuIGFyclxuICAgICAgfSxcbiAgICAgIG1vdmUoJGZyb206IG51bWJlciwgJHRvOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgYXJyID0gdG9BcnIoZ2V0VmFsdWUoKSkuc2xpY2UoKVxuICAgICAgICBjb25zdCBpdGVtID0gYXJyWyRmcm9tXVxuICAgICAgICBhcnIuc3BsaWNlKCRmcm9tLCAxKVxuICAgICAgICBhcnIuc3BsaWNlKCR0bywgMCwgaXRlbSlcbiAgICAgICAgc2V0VmFsdWUoYXJyKVxuICAgICAgICByZXR1cm4gYXJyXG4gICAgICB9LFxuICAgICAgbW92ZVVwKGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGVuID0gdG9BcnIoZ2V0VmFsdWUoKSkubGVuZ3RoXG4gICAgICAgIHJldHVybiBtdXRhdG9ycy5tb3ZlKGluZGV4LCBpbmRleCAtIDEgPCAwID8gbGVuIC0gMSA6IGluZGV4IC0gMSlcbiAgICAgIH0sXG4gICAgICBtb3ZlRG93bihpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxlbiA9IHRvQXJyKGdldFZhbHVlKCkpLmxlbmd0aFxuICAgICAgICByZXR1cm4gbXV0YXRvcnMubW92ZShpbmRleCwgaW5kZXggKyAxID49IGxlbiA/IDAgOiBpbmRleCArIDEpXG4gICAgICB9LFxuICAgICAgdmFsaWRhdGUob3B0cz86IElGb3JtRXh0ZW5kZWRWYWxpZGF0ZUZpZWxkT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUoXG4gICAgICAgICAgZmllbGQuZ2V0U291cmNlU3RhdGUoc3RhdGUgPT4gc3RhdGUucGF0aCksXG4gICAgICAgICAge1xuICAgICAgICAgICAgLi4ub3B0cyxcbiAgICAgICAgICAgIGhvc3RSZW5kZXJpbmc6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtdXRhdG9yc1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzQ2hhbmdlZCh0YXJnZXQ6IGFueSwgcGF0aDogRm9ybVBhdGhQYXR0ZXJuKTogYm9vbGVhbiB7XG4gICAgaWYgKGVudi5wdWJsaXNoaW5nW3RhcmdldCA/IHRhcmdldC5wYXRoIDogJyddID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHdhdGNoIGZ1bmN0aW9uIG11c3QgYmUgdXNlZCBzeW5jaHJvbm91c2x5IGluIHRoZSBzdWJzY3JpYmUgY2FsbGJhY2suJ1xuICAgICAgKVxuICAgIH1cbiAgICBpZiAoaXNGb3JtU3RhdGUodGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGZvcm0uaGFzQ2hhbmdlZChwYXRoKVxuICAgIH0gZWxzZSBpZiAoaXNGaWVsZFN0YXRlKHRhcmdldCkgfHwgaXNWaXJ0dWFsRmllbGRTdGF0ZSh0YXJnZXQpKSB7XG4gICAgICBjb25zdCBub2RlID0gZ3JhcGguZ2V0KHRhcmdldC5wYXRoKVxuICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5oYXNDaGFuZ2VkKHBhdGgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0lsbGVnYWwgcGFyYW1ldGVyLFlvdSBtdXN0IHBhc3MgdGhlIGNvcnJlY3Qgc3RhdGUgb2JqZWN0KEZvcm1TdGF0ZS9GaWVsZFN0YXRlL1ZpcnR1YWxGaWVsZFN0YXRlKS4nXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgY29uc3QgZm9ybUFwaSA9IHtcbiAgICBzdWJtaXQsXG4gICAgcmVzZXQsXG4gICAgaGFzQ2hhbmdlZCxcbiAgICBjbGVhckVycm9ycyxcbiAgICB2YWxpZGF0ZSxcbiAgICBzZXRGb3JtU3RhdGUsXG4gICAgZ2V0Rm9ybVN0YXRlLFxuICAgIHNldEZpZWxkU3RhdGUsXG4gICAgZ2V0RmllbGRTdGF0ZSxcbiAgICByZWdpc3RlckZpZWxkLFxuICAgIHJlZ2lzdGVyVmlydHVhbEZpZWxkLFxuICAgIGNyZWF0ZU11dGF0b3JzLFxuICAgIGdldEZvcm1HcmFwaCxcbiAgICBzZXRGb3JtR3JhcGgsXG4gICAgc2V0RmllbGRWYWx1ZSxcbiAgICBnZXRGaWVsZFZhbHVlLFxuICAgIHNldEZpZWxkSW5pdGlhbFZhbHVlLFxuICAgIGdldEZpZWxkSW5pdGlhbFZhbHVlLFxuICAgIGRpc2FibGVVbm1vdW50Q2xlYXJTdGF0ZXMsXG4gICAgZW5hYmxlVW5tb3VudENsZWFyU3RhdGVzLFxuICAgIGVuYWJsZVVubW91bnRSZW1vdmVOb2RlLFxuICAgIGRpc2FibGVVbm1vdW50UmVtb3ZlTm9kZSxcbiAgICBpc0hvc3RSZW5kZXJpbmcsXG4gICAgaG9zdFVwZGF0ZSxcbiAgICBzdWJzY3JpYmUsXG4gICAgdW5zdWJzY3JpYmUsXG4gICAgbm90aWZ5XG4gIH1cblxuICBpbml0KGZvcm1BcGkpXG5cbiAgcmV0dXJuIGZvcm1BcGlcbn1cbiIsImltcG9ydCB7IElGb3JtQ3JlYXRvck9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHtcbiAgRm9ybVZhbGlkYXRvcixcbiAgc2V0VmFsaWRhdGlvbkxhbmd1YWdlLFxuICBzZXRWYWxpZGF0aW9uTG9jYWxlXG59IGZyb20gJ0Bmb3JtaWx5L3ZhbGlkYXRvcidcbmltcG9ydCB7IEZvcm1QYXRoLCBGb3JtUGF0aFBhdHRlcm4sIEJpZ0RhdGEgfSBmcm9tICdAZm9ybWlseS9zaGFyZWQnXG5pbXBvcnQgeyBjcmVhdGVGb3JtSW50ZXJuYWxzIH0gZnJvbSAnLi9pbnRlcm5hbHMnXG5pbXBvcnQgeyBjcmVhdGVGb3JtRXh0ZXJuYWxzIH0gZnJvbSAnLi9leHRlcm5hbHMnXG5pbXBvcnQgeyBGb3JtR3JhcGggfSBmcm9tICcuL3NoYXJlZC9ncmFwaCdcbmltcG9ydCB7IGNyZWF0ZU1vZGVsIH0gZnJvbSAnLi9zaGFyZWQvbW9kZWwnXG5leHBvcnQgKiBmcm9tICcuL3NoYXJlZC9saWZlY3ljbGUnXG5leHBvcnQgKiBmcm9tICcuL3R5cGVzJ1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIG5hbWVzcGFjZSBGb3JtaWx5Q29yZSB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBGaWVsZFByb3BzIHtcbiAgICAgIFtrZXk6IHN0cmluZ106IGFueVxuICAgIH1cbiAgICBleHBvcnQgaW50ZXJmYWNlIFZpcnR1YWxGaWVsZFByb3BzIHtcbiAgICAgIFtrZXk6IHN0cmluZ106IGFueVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlRm9ybSA9IChvcHRpb25zOiBJRm9ybUNyZWF0b3JPcHRpb25zID0ge30pID0+IHtcbiAgcmV0dXJuIGNyZWF0ZUZvcm1FeHRlcm5hbHMoY3JlYXRlRm9ybUludGVybmFscyhvcHRpb25zKSlcbn1cblxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyVmFsaWRhdGlvbkZvcm1hdHMgPSBGb3JtVmFsaWRhdG9yLnJlZ2lzdGVyRm9ybWF0c1xuXG5leHBvcnQgY29uc3QgcmVnaXN0ZXJWYWxpZGF0aW9uUnVsZXMgPSBGb3JtVmFsaWRhdG9yLnJlZ2lzdGVyUnVsZXNcblxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyVmFsaWRhdGlvbk1URW5naW5lID0gRm9ybVZhbGlkYXRvci5yZWdpc3Rlck1URW5naW5lXG5cbmV4cG9ydCB7XG4gIHNldFZhbGlkYXRpb25MYW5ndWFnZSxcbiAgc2V0VmFsaWRhdGlvbkxvY2FsZSxcbiAgY3JlYXRlTW9kZWwsXG4gIEJpZ0RhdGEsXG4gIEZvcm1HcmFwaCxcbiAgRm9ybVBhdGgsXG4gIEZvcm1QYXRoUGF0dGVyblxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVGb3JtXG4iXSwibmFtZXMiOlsiZGlzdE1vZHVsZSIsInJlcXVpcmUkJDAiLCJlbmFibGVBbGxQbHVnaW5zIiwic2V0QXV0b0ZyZWV6ZSIsIkltbWVyIiwiX2EiLCJub3JtYWxpemVNZXNzYWdlcyIsIl9fZGVmUHJvcCIsIl9fZGVmUHJvcHMiLCJfX2dldE93blByb3BEZXNjcyIsIl9fZ2V0T3duUHJvcFN5bWJvbHMiLCJfX2hhc093blByb3AiLCJfX3Byb3BJc0VudW0iLCJfX2RlZk5vcm1hbFByb3AiLCJfX3NwcmVhZFZhbHVlcyIsIl9fc3ByZWFkUHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFRTyxNQUFNLFNBQVMsU0FBUyxZQUFZLENBQUM7TUFDNUMsRUFBRSxXQUFXLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRTtNQUMxQixJQUFJLEtBQUssRUFBRSxDQUFDO01BQ1osSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztNQUN4QixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO01BQ3BCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7TUFDbEIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztNQUNyQixJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztNQUM3QyxHQUFHO01BQ0gsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtNQUN2QixJQUFJLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDekMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO01BQ2pCLE1BQU0sTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUNyQyxNQUFNLElBQUksSUFBSSxFQUFFO01BQ2hCLFFBQVEsT0FBTyxJQUFJLENBQUM7TUFDcEIsT0FBTztNQUNQLEtBQUs7TUFDTCxJQUFJLEtBQUssSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtNQUNyQyxNQUFNLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDeEMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsYUFB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TUFDckIsS0FBSztNQUNMLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7TUFDaEUsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO01BQzdCLE1BQU0sT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssS0FBSztNQUMzQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQzFCLFVBQVUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN2QyxVQUFVLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtNQUNoSSxZQUFZLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDaEMsV0FBVztNQUNYLFVBQVUsSUFBSSxTQUFTLEVBQUU7TUFDekIsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ2xFLFdBQVc7TUFDWCxTQUFTO01BQ1QsT0FBTyxDQUFDLENBQUM7TUFDVCxLQUFLO01BQ0wsR0FBRztNQUNILEVBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7TUFDM0IsSUFBSSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO01BQzFDLElBQUksTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztNQUNwRCxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQ3RCLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtNQUM3QixRQUFRLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUMvQyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDakQsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdEMsT0FBTztNQUNQLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBRSxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO01BQ3RDLElBQUksTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUMxQyxJQUFJLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDcEMsSUFBSSxJQUFJLENBQUMsSUFBSTtNQUNiLE1BQU0sT0FBTztNQUNiLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDdEMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUN0QixNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDN0IsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUMxQyxLQUFLO01BQ0wsR0FBRztNQUNILEVBQUUsZUFBZSxDQUFDLElBQUksRUFBRTtNQUN4QixJQUFJLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDMUMsSUFBSSxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxD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QUMsR0FBRyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFdBQVcsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLHdCQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxPQUFPLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTSxXQUFXLEVBQUUsT0FBTyxPQUFPLEVBQUUsQ0FBQyxZQUFZLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENB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
