System.register(['react', '@formily/shared'], (function (exports) {
  'use strict';
  var createContext, useContext, React, Fragment, useMemo, toArr, isNum$1, isFn, isEqual;
  return {
    setters: [function (module) {
      createContext = module.createContext;
      useContext = module.useContext;
      React = module["default"];
      Fragment = module.Fragment;
      useMemo = module.useMemo;
    }, function (module) {
      toArr = module.toArr;
      isNum$1 = module.isNum;
      isFn = module.isFn;
      isEqual = module.isEqual;
    }],
    execute: (function () {

      const PreviewTextContext = createContext({});
      const ArrayContext = createContext({});

      var __defProp$2 = Object.defineProperty;
      var __defProps = Object.defineProperties;
      var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
      var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
      var __objRest$2 = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$2)
          for (var prop of __getOwnPropSymbols$2(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      const useArrayList = (index = 0) => {
        const _a = useContext(ArrayContext), {
          value,
          disabled,
          editable,
          minItems,
          maxItems,
          renders
        } = _a, props = __objRest$2(_a, [
          "value",
          "disabled",
          "editable",
          "minItems",
          "maxItems",
          "renders"
        ]);
        const renderWith = (name, render, wrapper) => {
          let children;
          if (renders && renders[name]) {
            if (isFn(renders[name]) || renders[name].styledComponentId) {
              children = renders[name](context.currentIndex);
            } else {
              children = render(renders[name]);
            }
          } else {
            children = render(renders[name]);
          }
          if (isFn(wrapper)) {
            return wrapper(__spreadProps(__spreadValues$2({}, context), { children })) || /* @__PURE__ */ React.createElement(Fragment, null);
          }
          return children || /* @__PURE__ */ React.createElement(Fragment, null);
        };
        const newValue = toArr(value);
        const isEmpty = !newValue || newValue && newValue.length <= 0;
        const isDisable = disabled || editable === false;
        const allowMoveUp = newValue && newValue.length > 1 && !isDisable;
        const allowMoveDown = newValue && newValue.length > 1 && !isDisable;
        const allowRemove = isNum$1(minItems) ? newValue.length > minItems && !isDisable : !isDisable;
        const allowAddition = isNum$1(maxItems) ? newValue.length < maxItems && !isDisable : !isDisable;
        const context = __spreadProps(__spreadValues$2({}, props), {
          currentIndex: index,
          isEmpty,
          isDisable,
          allowRemove,
          allowAddition,
          allowMoveDown,
          allowMoveUp,
          renderWith
        });
        return context;
      };

      const useComponent = (name) => {
        const { components } = useContext(ArrayContext);
        return useMemo(() => {
          if (isFn(components[name]) || components[name].styledComponentId)
            return components[name];
          return (props) => {
            return React.isValidElement(components[name]) ? React.cloneElement(components[name], props) : /* @__PURE__ */ React.createElement(Fragment, null);
          };
        }, []);
      };

      var __defProp$1 = Object.defineProperty;
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
      var __objRest$1 = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$1.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$1)
          for (var prop of __getOwnPropSymbols$1(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$1.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      const ArrayList = exports('ArrayList', (props) => {
        return /* @__PURE__ */ React.createElement(ArrayContext.Provider, {
          value: props
        }, props.children);
      });
      const createButtonCls = (props = {}, hasText) => {
        return {
          className: `${hasText ? "has-text" : ""} ${props.className || ""}`
        };
      };
      ArrayList.useArrayList = useArrayList;
      ArrayList.useComponent = useComponent;
      ArrayList.Wrapper = (_a) => {
        var _b = _a, { children } = _b, props = __objRest$1(_b, ["children"]);
        const WrapperComponent = ArrayList.useComponent("Wrapper");
        return /* @__PURE__ */ React.createElement(WrapperComponent, __spreadValues$1({}, props), children);
      };
      ArrayList.Item = (_c) => {
        var _d = _c, { children } = _d, props = __objRest$1(_d, ["children"]);
        const ItemComponent = ArrayList.useComponent("Item");
        return /* @__PURE__ */ React.createElement(ItemComponent, __spreadValues$1({}, props), children);
      };
      ArrayList.Remove = (_e) => {
        var _f = _e, { children, component, index } = _f, props = __objRest$1(_f, ["children", "component", "index"]);
        const { allowRemove, renderWith } = ArrayList.useArrayList(index);
        const Button = ArrayList.useComponent(component);
        const RemoveIcon = ArrayList.useComponent("RemoveIcon");
        if (allowRemove) {
          return renderWith("renderRemove", (text) => /* @__PURE__ */ React.createElement(Button, __spreadValues$1(__spreadValues$1({}, props), createButtonCls(props, text)), /* @__PURE__ */ React.createElement(RemoveIcon, null), text), children);
        }
        return React.createElement(React.Fragment);
      };
      ArrayList.Remove.defaultProps = {
        component: "CircleButton"
      };
      ArrayList.Addition = (_g) => {
        var _h = _g, { children, component } = _h, props = __objRest$1(_h, ["children", "component"]);
        const { allowAddition, renderWith } = ArrayList.useArrayList();
        const Button = ArrayList.useComponent(component);
        const AdditionIcon = ArrayList.useComponent("AdditionIcon");
        if (allowAddition) {
          return renderWith("renderAddition", (text) => /* @__PURE__ */ React.createElement(Button, __spreadValues$1(__spreadValues$1({}, props), createButtonCls(props, text)), /* @__PURE__ */ React.createElement(AdditionIcon, null), text), children);
        }
        return React.createElement(React.Fragment);
      };
      ArrayList.Addition.defaultProps = {
        component: "TextButton"
      };
      ArrayList.MoveUp = (_i) => {
        var _j = _i, { children, component, index } = _j, props = __objRest$1(_j, ["children", "component", "index"]);
        const { allowMoveUp, renderWith } = ArrayList.useArrayList(index);
        const Button = ArrayList.useComponent(component);
        const MoveUpIcon = ArrayList.useComponent("MoveUpIcon");
        if (allowMoveUp) {
          return renderWith("renderMoveUp", (text) => /* @__PURE__ */ React.createElement(Button, __spreadValues$1(__spreadValues$1({}, props), createButtonCls(props, text)), /* @__PURE__ */ React.createElement(MoveUpIcon, null), text), children);
        }
        return React.createElement(React.Fragment);
      };
      ArrayList.MoveUp.defaultProps = {
        component: "CircleButton"
      };
      ArrayList.MoveDown = (_k) => {
        var _l = _k, { children, component, index } = _l, props = __objRest$1(_l, ["children", "component", "index"]);
        const { allowMoveDown, renderWith } = ArrayList.useArrayList(index);
        const Button = ArrayList.useComponent(component);
        const MoveUpIcon = ArrayList.useComponent("MoveDownIcon");
        if (allowMoveDown) {
          return renderWith("renderMoveDown", (text) => /* @__PURE__ */ React.createElement(Button, __spreadValues$1(__spreadValues$1({}, props), createButtonCls(props, text)), /* @__PURE__ */ React.createElement(MoveUpIcon, null), text), children);
        }
        return React.createElement(React.Fragment);
      };
      ArrayList.MoveDown.defaultProps = {
        component: "CircleButton"
      };
      ArrayList.Empty = (_m) => {
        var _n = _m, { children, component } = _n, props = __objRest$1(_n, ["children", "component"]);
        const { allowAddition, isEmpty, renderWith } = ArrayList.useArrayList();
        const Button = ArrayList.useComponent(component);
        const AdditionIcon = ArrayList.useComponent("AdditionIcon");
        let addtion;
        if (allowAddition) {
          addtion = renderWith("renderAddition", (text) => /* @__PURE__ */ React.createElement(Button, __spreadValues$1(__spreadValues$1({}, props), createButtonCls(props, text)), /* @__PURE__ */ React.createElement(AdditionIcon, null), text));
        }
        if (isEmpty) {
          return renderWith("renderEmpty", (text) => {
            return /* @__PURE__ */ React.createElement(Fragment, null, /* @__PURE__ */ React.createElement("img", {
              style: { backgroundColor: "transparent" },
              src: "//img.alicdn.com/tfs/TB1cVncKAzoK1RjSZFlXXai4VXa-184-152.svg"
            }), text, addtion);
          }, children);
        }
        return React.createElement(React.Fragment);
      };
      ArrayList.Empty.defaultProps = {
        component: "TextButton"
      };

      const PreviewText = exports('PreviewText', (props) => {
        const context = useContext(PreviewTextContext) || {};
        let value;
        if (props.dataSource && props.dataSource.length) {
          if (Array.isArray(props.value)) {
            value = props.value.map((val, index) => {
              const finded = props.dataSource.find((item) => item.value == val || isEqual(item.value, val));
              if (finded) {
                return /* @__PURE__ */ React.createElement("span", {
                  key: index
                }, finded.label, index < props.value.length - 1 ? " ," : "");
              }
            });
          } else {
            const fined = props.dataSource.find((item) => isEqual(item.value, props.value));
            if (fined) {
              value = fined.label;
            }
          }
        } else {
          if (Array.isArray(props.value)) {
            value = props.value.map((val, index) => {
              return /* @__PURE__ */ React.createElement("span", {
                key: index
              }, val, index < props.value.length - 1 ? "~" : "");
            });
          } else {
            value = String(props.value === void 0 || props.value === null ? "" : props.value);
            if (value.match("\n")) {
              value = value.split("\n").map((subStr, index) => /* @__PURE__ */ React.createElement("div", {
                key: index
              }, subStr));
            }
          }
        }
        const placeholder = isFn(context.previewPlaceholder) ? context.previewPlaceholder(props) : context.previewPlaceholder;
        return /* @__PURE__ */ React.createElement("p", {
          style: { padding: 0, margin: 0 },
          className: `preview-text ${props.className || ""}`
        }, props.addonBefore ? " " + props.addonBefore : "", props.innerBefore ? " " + props.innerBefore : "", props.addonTextBefore ? " " + props.addonTextBefore : "", value === "" || value === void 0 || Array.isArray(value) && value.length === 0 ? placeholder || "N/A" : value, props.addonTextAfter ? " " + props.addonTextAfter : "", props.innerAfter ? " " + props.innerAfter : "", props.addonAfter ? " " + props.addonAfter : "");
      });
      PreviewText.ConfigProvider = PreviewTextContext.Provider;

      const isNum = function(c) {
        return c >= 48 && c <= 57;
      };
      const isLower = function(c) {
        return c >= 97 && c <= 122;
      };
      const isUpper = function(c) {
        return c >= 65 && c <= 90;
      };
      const isSymbol$1 = function(c) {
        return !(isLower(c) || isUpper(c) || isNum(c));
      };
      const isLetter = function(c) {
        return isLower(c) || isUpper(c);
      };
      const getStrength = (val) => {
        if (!val)
          return 0;
        let num = 0;
        let lower = 0;
        let upper = 0;
        let symbol = 0;
        let MNS = 0;
        let rep = 0;
        let repC = 0;
        let consecutive = 0;
        let sequential = 0;
        const len = () => num + lower + upper + symbol;
        const callme = () => {
          let re = num > 0 ? 1 : 0;
          re += lower > 0 ? 1 : 0;
          re += upper > 0 ? 1 : 0;
          re += symbol > 0 ? 1 : 0;
          if (re > 2 && len() >= 8) {
            return re + 1;
          } else {
            return 0;
          }
        };
        for (let i = 0; i < val.length; i++) {
          const c = val.charCodeAt(i);
          if (isNum(c)) {
            num++;
            if (i !== 0 && i !== val.length - 1) {
              MNS++;
            }
            if (i > 0 && isNum(val.charCodeAt(i - 1))) {
              consecutive++;
            }
          } else if (isLower(c)) {
            lower++;
            if (i > 0 && isLower(val.charCodeAt(i - 1))) {
              consecutive++;
            }
          } else if (isUpper(c)) {
            upper++;
            if (i > 0 && isUpper(val.charCodeAt(i - 1))) {
              consecutive++;
            }
          } else {
            symbol++;
            if (i !== 0 && i !== val.length - 1) {
              MNS++;
            }
          }
          let exists = false;
          for (let j = 0; j < val.length; j++) {
            if (val[i] === val[j] && i !== j) {
              exists = true;
              repC += Math.abs(val.length / (j - i));
            }
          }
          if (exists) {
            rep++;
            const unique = val.length - rep;
            repC = unique ? Math.ceil(repC / unique) : Math.ceil(repC);
          }
          if (i > 1) {
            const last1 = val.charCodeAt(i - 1);
            const last2 = val.charCodeAt(i - 2);
            if (isLetter(c)) {
              if (isLetter(last1) && isLetter(last2)) {
                const v = val.toLowerCase();
                const vi = v.charCodeAt(i);
                const vi1 = v.charCodeAt(i - 1);
                const vi2 = v.charCodeAt(i - 2);
                if (vi - vi1 === vi1 - vi2 && Math.abs(vi - vi1) === 1) {
                  sequential++;
                }
              }
            } else if (isNum(c)) {
              if (isNum(last1) && isNum(last2)) {
                if (c - last1 === last1 - last2 && Math.abs(c - last1) === 1) {
                  sequential++;
                }
              }
            } else {
              if (isSymbol$1(last1) && isSymbol$1(last2)) {
                if (c - last1 === last1 - last2 && Math.abs(c - last1) === 1) {
                  sequential++;
                }
              }
            }
          }
        }
        let sum = 0;
        const length = len();
        sum += 4 * length;
        if (lower > 0) {
          sum += 2 * (length - lower);
        }
        if (upper > 0) {
          sum += 2 * (length - upper);
        }
        if (num !== length) {
          sum += 4 * num;
        }
        sum += 6 * symbol;
        sum += 2 * MNS;
        sum += 2 * callme();
        if (length === lower + upper) {
          sum -= length;
        }
        if (length === num) {
          sum -= num;
        }
        sum -= repC;
        sum -= 2 * consecutive;
        sum -= 3 * sequential;
        sum = sum < 0 ? 0 : sum;
        sum = sum > 100 ? 100 : sum;
        if (sum >= 80) {
          return 100;
        } else if (sum >= 60) {
          return 80;
        } else if (sum >= 40) {
          return 60;
        } else if (sum >= 20) {
          return 40;
        } else {
          return 20;
        }
      };
      const PasswordStrength = exports('PasswordStrength', (props) => {
        if (isFn(props.children)) {
          return props.children(getStrength(String(props.value)));
        } else {
          return /* @__PURE__ */ React.createElement(Fragment, null, props.children);
        }
      });

      function getDefaultExportFromCjs (x) {
      	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
      }

      var lib = {exports: {}};

      var ReactDragListView$1 = {exports: {}};

      var classCallCheck = {};

      classCallCheck.__esModule = true;

      classCallCheck.default = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };

      var createClass = {};

      var defineProperty$2 = {exports: {}};

      var _global = {exports: {}};

      // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
      var global$4 = _global.exports = typeof window != 'undefined' && window.Math == Math
        ? window : typeof self != 'undefined' && self.Math == Math ? self
        // eslint-disable-next-line no-new-func
        : Function('return this')();
      if (typeof __g == 'number') __g = global$4; // eslint-disable-line no-undef

      var _core = {exports: {}};

      var core$4 = _core.exports = { version: '2.6.12' };
      if (typeof __e == 'number') __e = core$4; // eslint-disable-line no-undef

      var _aFunction = function (it) {
        if (typeof it != 'function') throw TypeError(it + ' is not a function!');
        return it;
      };

      // optional / simple context binding
      var aFunction = _aFunction;
      var _ctx = function (fn, that, length) {
        aFunction(fn);
        if (that === undefined) return fn;
        switch (length) {
          case 1: return function (a) {
            return fn.call(that, a);
          };
          case 2: return function (a, b) {
            return fn.call(that, a, b);
          };
          case 3: return function (a, b, c) {
            return fn.call(that, a, b, c);
          };
        }
        return function (/* ...args */) {
          return fn.apply(that, arguments);
        };
      };

      var _objectDp = {};

      var _isObject = function (it) {
        return typeof it === 'object' ? it !== null : typeof it === 'function';
      };

      var isObject$5 = _isObject;
      var _anObject = function (it) {
        if (!isObject$5(it)) throw TypeError(it + ' is not an object!');
        return it;
      };

      var _fails = function (exec) {
        try {
          return !!exec();
        } catch (e) {
          return true;
        }
      };

      // Thank's IE8 for his funny defineProperty
      var _descriptors = !_fails(function () {
        return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
      });

      var isObject$4 = _isObject;
      var document$2 = _global.exports.document;
      // typeof document.createElement is 'object' in old IE
      var is = isObject$4(document$2) && isObject$4(document$2.createElement);
      var _domCreate = function (it) {
        return is ? document$2.createElement(it) : {};
      };

      var _ie8DomDefine = !_descriptors && !_fails(function () {
        return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
      });

      // 7.1.1 ToPrimitive(input [, PreferredType])
      var isObject$3 = _isObject;
      // instead of the ES6 spec version, we didn't implement @@toPrimitive case
      // and the second argument - flag - preferred type is a string
      var _toPrimitive = function (it, S) {
        if (!isObject$3(it)) return it;
        var fn, val;
        if (S && typeof (fn = it.toString) == 'function' && !isObject$3(val = fn.call(it))) return val;
        if (typeof (fn = it.valueOf) == 'function' && !isObject$3(val = fn.call(it))) return val;
        if (!S && typeof (fn = it.toString) == 'function' && !isObject$3(val = fn.call(it))) return val;
        throw TypeError("Can't convert object to primitive value");
      };

      var anObject$4 = _anObject;
      var IE8_DOM_DEFINE$1 = _ie8DomDefine;
      var toPrimitive$2 = _toPrimitive;
      var dP$3 = Object.defineProperty;

      _objectDp.f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
        anObject$4(O);
        P = toPrimitive$2(P, true);
        anObject$4(Attributes);
        if (IE8_DOM_DEFINE$1) try {
          return dP$3(O, P, Attributes);
        } catch (e) { /* empty */ }
        if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
        if ('value' in Attributes) O[P] = Attributes.value;
        return O;
      };

      var _propertyDesc = function (bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value: value
        };
      };

      var dP$2 = _objectDp;
      var createDesc$2 = _propertyDesc;
      var _hide = _descriptors ? function (object, key, value) {
        return dP$2.f(object, key, createDesc$2(1, value));
      } : function (object, key, value) {
        object[key] = value;
        return object;
      };

      var hasOwnProperty$1 = {}.hasOwnProperty;
      var _has = function (it, key) {
        return hasOwnProperty$1.call(it, key);
      };

      var global$3 = _global.exports;
      var core$3 = _core.exports;
      var ctx = _ctx;
      var hide$2 = _hide;
      var has$6 = _has;
      var PROTOTYPE$2 = 'prototype';

      var $export$6 = function (type, name, source) {
        var IS_FORCED = type & $export$6.F;
        var IS_GLOBAL = type & $export$6.G;
        var IS_STATIC = type & $export$6.S;
        var IS_PROTO = type & $export$6.P;
        var IS_BIND = type & $export$6.B;
        var IS_WRAP = type & $export$6.W;
        var exports = IS_GLOBAL ? core$3 : core$3[name] || (core$3[name] = {});
        var expProto = exports[PROTOTYPE$2];
        var target = IS_GLOBAL ? global$3 : IS_STATIC ? global$3[name] : (global$3[name] || {})[PROTOTYPE$2];
        var key, own, out;
        if (IS_GLOBAL) source = name;
        for (key in source) {
          // contains in native
          own = !IS_FORCED && target && target[key] !== undefined;
          if (own && has$6(exports, key)) continue;
          // export native or passed
          out = own ? target[key] : source[key];
          // prevent global pollution for namespaces
          exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
          // bind timers to global for call from export context
          : IS_BIND && own ? ctx(out, global$3)
          // wrap global constructors for prevent change them in library
          : IS_WRAP && target[key] == out ? (function (C) {
            var F = function (a, b, c) {
              if (this instanceof C) {
                switch (arguments.length) {
                  case 0: return new C();
                  case 1: return new C(a);
                  case 2: return new C(a, b);
                } return new C(a, b, c);
              } return C.apply(this, arguments);
            };
            F[PROTOTYPE$2] = C[PROTOTYPE$2];
            return F;
          // make static versions for prototype methods
          })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
          // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
          if (IS_PROTO) {
            (exports.virtual || (exports.virtual = {}))[key] = out;
            // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
            if (type & $export$6.R && expProto && !expProto[key]) hide$2(expProto, key, out);
          }
        }
      };
      // type bitmap
      $export$6.F = 1;   // forced
      $export$6.G = 2;   // global
      $export$6.S = 4;   // static
      $export$6.P = 8;   // proto
      $export$6.B = 16;  // bind
      $export$6.W = 32;  // wrap
      $export$6.U = 64;  // safe
      $export$6.R = 128; // real proto method for `library`
      var _export = $export$6;

      var $export$5 = _export;
      // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
      $export$5($export$5.S + $export$5.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

      var $Object$2 = _core.exports.Object;
      var defineProperty$1 = function defineProperty(it, key, desc) {
        return $Object$2.defineProperty(it, key, desc);
      };

      (function (module) {
      module.exports = { "default": defineProperty$1, __esModule: true };
      }(defineProperty$2));

      createClass.__esModule = true;

      var _defineProperty = defineProperty$2.exports;

      var _defineProperty2 = _interopRequireDefault$4(_defineProperty);

      function _interopRequireDefault$4(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      createClass.default = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            (0, _defineProperty2.default)(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      var possibleConstructorReturn = {};

      var _typeof$1 = {};

      var iterator$1 = {exports: {}};

      // 7.1.4 ToInteger
      var ceil = Math.ceil;
      var floor = Math.floor;
      var _toInteger = function (it) {
        return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
      };

      // 7.2.1 RequireObjectCoercible(argument)
      var _defined = function (it) {
        if (it == undefined) throw TypeError("Can't call method on  " + it);
        return it;
      };

      var toInteger$2 = _toInteger;
      var defined$2 = _defined;
      // true  -> String#at
      // false -> String#codePointAt
      var _stringAt = function (TO_STRING) {
        return function (that, pos) {
          var s = String(defined$2(that));
          var i = toInteger$2(pos);
          var l = s.length;
          var a, b;
          if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
          a = s.charCodeAt(i);
          return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
            ? TO_STRING ? s.charAt(i) : a
            : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
        };
      };

      var _library = true;

      var _redefine = _hide;

      var _iterators = {};

      var toString$1 = {}.toString;

      var _cof = function (it) {
        return toString$1.call(it).slice(8, -1);
      };

      // fallback for non-array-like ES3 and non-enumerable old V8 strings
      var cof$1 = _cof;
      // eslint-disable-next-line no-prototype-builtins
      var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
        return cof$1(it) == 'String' ? it.split('') : Object(it);
      };

      // to indexed object, toObject with fallback for non-array-like ES3 strings
      var IObject = _iobject;
      var defined$1 = _defined;
      var _toIobject = function (it) {
        return IObject(defined$1(it));
      };

      // 7.1.15 ToLength
      var toInteger$1 = _toInteger;
      var min$1 = Math.min;
      var _toLength = function (it) {
        return it > 0 ? min$1(toInteger$1(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
      };

      var toInteger = _toInteger;
      var max = Math.max;
      var min = Math.min;
      var _toAbsoluteIndex = function (index, length) {
        index = toInteger(index);
        return index < 0 ? max(index + length, 0) : min(index, length);
      };

      // false -> Array#indexOf
      // true  -> Array#includes
      var toIObject$6 = _toIobject;
      var toLength = _toLength;
      var toAbsoluteIndex = _toAbsoluteIndex;
      var _arrayIncludes = function (IS_INCLUDES) {
        return function ($this, el, fromIndex) {
          var O = toIObject$6($this);
          var length = toLength(O.length);
          var index = toAbsoluteIndex(fromIndex, length);
          var value;
          // Array#includes uses SameValueZero equality algorithm
          // eslint-disable-next-line no-self-compare
          if (IS_INCLUDES && el != el) while (length > index) {
            value = O[index++];
            // eslint-disable-next-line no-self-compare
            if (value != value) return true;
          // Array#indexOf ignores holes, Array#includes - not
          } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
            if (O[index] === el) return IS_INCLUDES || index || 0;
          } return !IS_INCLUDES && -1;
        };
      };

      var _shared = {exports: {}};

      var core$2 = _core.exports;
      var global$2 = _global.exports;
      var SHARED = '__core-js_shared__';
      var store$1 = global$2[SHARED] || (global$2[SHARED] = {});

      (_shared.exports = function (key, value) {
        return store$1[key] || (store$1[key] = value !== undefined ? value : {});
      })('versions', []).push({
        version: core$2.version,
        mode: 'pure' ,
        copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
      });

      var id$1 = 0;
      var px = Math.random();
      var _uid = function (key) {
        return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id$1 + px).toString(36));
      };

      var shared$1 = _shared.exports('keys');
      var uid$2 = _uid;
      var _sharedKey = function (key) {
        return shared$1[key] || (shared$1[key] = uid$2(key));
      };

      var has$5 = _has;
      var toIObject$5 = _toIobject;
      var arrayIndexOf = _arrayIncludes(false);
      var IE_PROTO$2 = _sharedKey('IE_PROTO');

      var _objectKeysInternal = function (object, names) {
        var O = toIObject$5(object);
        var i = 0;
        var result = [];
        var key;
        for (key in O) if (key != IE_PROTO$2) has$5(O, key) && result.push(key);
        // Don't enum bug & hidden keys
        while (names.length > i) if (has$5(O, key = names[i++])) {
          ~arrayIndexOf(result, key) || result.push(key);
        }
        return result;
      };

      // IE 8- don't enum bug keys
      var _enumBugKeys = (
        'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
      ).split(',');

      // 19.1.2.14 / 15.2.3.14 Object.keys(O)
      var $keys$2 = _objectKeysInternal;
      var enumBugKeys$1 = _enumBugKeys;

      var _objectKeys = Object.keys || function keys(O) {
        return $keys$2(O, enumBugKeys$1);
      };

      var dP$1 = _objectDp;
      var anObject$3 = _anObject;
      var getKeys$1 = _objectKeys;

      var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
        anObject$3(O);
        var keys = getKeys$1(Properties);
        var length = keys.length;
        var i = 0;
        var P;
        while (length > i) dP$1.f(O, P = keys[i++], Properties[P]);
        return O;
      };

      var document$1 = _global.exports.document;
      var _html = document$1 && document$1.documentElement;

      // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
      var anObject$2 = _anObject;
      var dPs = _objectDps;
      var enumBugKeys = _enumBugKeys;
      var IE_PROTO$1 = _sharedKey('IE_PROTO');
      var Empty = function () { /* empty */ };
      var PROTOTYPE$1 = 'prototype';

      // Create object with fake `null` prototype: use iframe Object with cleared prototype
      var createDict = function () {
        // Thrash, waste and sodomy: IE GC bug
        var iframe = _domCreate('iframe');
        var i = enumBugKeys.length;
        var lt = '<';
        var gt = '>';
        var iframeDocument;
        iframe.style.display = 'none';
        _html.appendChild(iframe);
        iframe.src = 'javascript:'; // eslint-disable-line no-script-url
        // createDict = iframe.contentWindow.Object;
        // html.removeChild(iframe);
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
        iframeDocument.close();
        createDict = iframeDocument.F;
        while (i--) delete createDict[PROTOTYPE$1][enumBugKeys[i]];
        return createDict();
      };

      var _objectCreate = Object.create || function create(O, Properties) {
        var result;
        if (O !== null) {
          Empty[PROTOTYPE$1] = anObject$2(O);
          result = new Empty();
          Empty[PROTOTYPE$1] = null;
          // add "__proto__" for Object.getPrototypeOf polyfill
          result[IE_PROTO$1] = O;
        } else result = createDict();
        return Properties === undefined ? result : dPs(result, Properties);
      };

      var _wks = {exports: {}};

      var store = _shared.exports('wks');
      var uid$1 = _uid;
      var Symbol$1 = _global.exports.Symbol;
      var USE_SYMBOL = typeof Symbol$1 == 'function';

      var $exports = _wks.exports = function (name) {
        return store[name] || (store[name] =
          USE_SYMBOL && Symbol$1[name] || (USE_SYMBOL ? Symbol$1 : uid$1)('Symbol.' + name));
      };

      $exports.store = store;

      var def = _objectDp.f;
      var has$4 = _has;
      var TAG = _wks.exports('toStringTag');

      var _setToStringTag = function (it, tag, stat) {
        if (it && !has$4(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
      };

      var create$2 = _objectCreate;
      var descriptor = _propertyDesc;
      var setToStringTag$2 = _setToStringTag;
      var IteratorPrototype = {};

      // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
      _hide(IteratorPrototype, _wks.exports('iterator'), function () { return this; });

      var _iterCreate = function (Constructor, NAME, next) {
        Constructor.prototype = create$2(IteratorPrototype, { next: descriptor(1, next) });
        setToStringTag$2(Constructor, NAME + ' Iterator');
      };

      // 7.1.13 ToObject(argument)
      var defined = _defined;
      var _toObject = function (it) {
        return Object(defined(it));
      };

      // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
      var has$3 = _has;
      var toObject$3 = _toObject;
      var IE_PROTO = _sharedKey('IE_PROTO');
      var ObjectProto$1 = Object.prototype;

      var _objectGpo = Object.getPrototypeOf || function (O) {
        O = toObject$3(O);
        if (has$3(O, IE_PROTO)) return O[IE_PROTO];
        if (typeof O.constructor == 'function' && O instanceof O.constructor) {
          return O.constructor.prototype;
        } return O instanceof Object ? ObjectProto$1 : null;
      };

      var $export$4 = _export;
      var redefine$1 = _redefine;
      var hide$1 = _hide;
      var Iterators$2 = _iterators;
      var $iterCreate = _iterCreate;
      var setToStringTag$1 = _setToStringTag;
      var getPrototypeOf$2 = _objectGpo;
      var ITERATOR = _wks.exports('iterator');
      var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
      var FF_ITERATOR = '@@iterator';
      var KEYS = 'keys';
      var VALUES = 'values';

      var returnThis = function () { return this; };

      var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
        $iterCreate(Constructor, NAME, next);
        var getMethod = function (kind) {
          if (!BUGGY && kind in proto) return proto[kind];
          switch (kind) {
            case KEYS: return function keys() { return new Constructor(this, kind); };
            case VALUES: return function values() { return new Constructor(this, kind); };
          } return function entries() { return new Constructor(this, kind); };
        };
        var TAG = NAME + ' Iterator';
        var DEF_VALUES = DEFAULT == VALUES;
        var VALUES_BUG = false;
        var proto = Base.prototype;
        var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
        var $default = $native || getMethod(DEFAULT);
        var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
        var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
        var methods, key, IteratorPrototype;
        // Fix native
        if ($anyNative) {
          IteratorPrototype = getPrototypeOf$2($anyNative.call(new Base()));
          if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
            // Set @@toStringTag to native iterators
            setToStringTag$1(IteratorPrototype, TAG, true);
          }
        }
        // fix Array#{values, @@iterator}.name in V8 / FF
        if (DEF_VALUES && $native && $native.name !== VALUES) {
          VALUES_BUG = true;
          $default = function values() { return $native.call(this); };
        }
        // Define iterator
        if ((FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
          hide$1(proto, ITERATOR, $default);
        }
        // Plug for library
        Iterators$2[NAME] = $default;
        Iterators$2[TAG] = returnThis;
        if (DEFAULT) {
          methods = {
            values: DEF_VALUES ? $default : getMethod(VALUES),
            keys: IS_SET ? $default : getMethod(KEYS),
            entries: $entries
          };
          if (FORCED) for (key in methods) {
            if (!(key in proto)) redefine$1(proto, key, methods[key]);
          } else $export$4($export$4.P + $export$4.F * (BUGGY || VALUES_BUG), NAME, methods);
        }
        return methods;
      };

      var $at = _stringAt(true);

      // 21.1.3.27 String.prototype[@@iterator]()
      _iterDefine(String, 'String', function (iterated) {
        this._t = String(iterated); // target
        this._i = 0;                // next index
      // 21.1.5.2.1 %StringIteratorPrototype%.next()
      }, function () {
        var O = this._t;
        var index = this._i;
        var point;
        if (index >= O.length) return { value: undefined, done: true };
        point = $at(O, index);
        this._i += point.length;
        return { value: point, done: false };
      });

      var _iterStep = function (done, value) {
        return { value: value, done: !!done };
      };

      var step = _iterStep;
      var Iterators$1 = _iterators;
      var toIObject$4 = _toIobject;

      // 22.1.3.4 Array.prototype.entries()
      // 22.1.3.13 Array.prototype.keys()
      // 22.1.3.29 Array.prototype.values()
      // 22.1.3.30 Array.prototype[@@iterator]()
      _iterDefine(Array, 'Array', function (iterated, kind) {
        this._t = toIObject$4(iterated); // target
        this._i = 0;                   // next index
        this._k = kind;                // kind
      // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
      }, function () {
        var O = this._t;
        var kind = this._k;
        var index = this._i++;
        if (!O || index >= O.length) {
          this._t = undefined;
          return step(1);
        }
        if (kind == 'keys') return step(0, index);
        if (kind == 'values') return step(0, O[index]);
        return step(0, [index, O[index]]);
      }, 'values');

      // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
      Iterators$1.Arguments = Iterators$1.Array;

      var global$1 = _global.exports;
      var hide = _hide;
      var Iterators = _iterators;
      var TO_STRING_TAG = _wks.exports('toStringTag');

      var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
        'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
        'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
        'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
        'TextTrackList,TouchList').split(',');

      for (var i = 0; i < DOMIterables.length; i++) {
        var NAME = DOMIterables[i];
        var Collection = global$1[NAME];
        var proto$1 = Collection && Collection.prototype;
        if (proto$1 && !proto$1[TO_STRING_TAG]) hide(proto$1, TO_STRING_TAG, NAME);
        Iterators[NAME] = Iterators.Array;
      }

      var _wksExt = {};

      _wksExt.f = _wks.exports;

      var iterator = _wksExt.f('iterator');

      (function (module) {
      module.exports = { "default": iterator, __esModule: true };
      }(iterator$1));

      var symbol$1 = {exports: {}};

      var _meta = {exports: {}};

      var META$1 = _uid('meta');
      var isObject$2 = _isObject;
      var has$2 = _has;
      var setDesc = _objectDp.f;
      var id = 0;
      var isExtensible = Object.isExtensible || function () {
        return true;
      };
      var FREEZE = !_fails(function () {
        return isExtensible(Object.preventExtensions({}));
      });
      var setMeta = function (it) {
        setDesc(it, META$1, { value: {
          i: 'O' + ++id, // object ID
          w: {}          // weak collections IDs
        } });
      };
      var fastKey = function (it, create) {
        // return primitive with prefix
        if (!isObject$2(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
        if (!has$2(it, META$1)) {
          // can't set metadata to uncaught frozen object
          if (!isExtensible(it)) return 'F';
          // not necessary to add metadata
          if (!create) return 'E';
          // add missing metadata
          setMeta(it);
        // return object ID
        } return it[META$1].i;
      };
      var getWeak = function (it, create) {
        if (!has$2(it, META$1)) {
          // can't set metadata to uncaught frozen object
          if (!isExtensible(it)) return true;
          // not necessary to add metadata
          if (!create) return false;
          // add missing metadata
          setMeta(it);
        // return hash weak collections IDs
        } return it[META$1].w;
      };
      // add metadata on freeze-family methods calling
      var onFreeze = function (it) {
        if (FREEZE && meta.NEED && isExtensible(it) && !has$2(it, META$1)) setMeta(it);
        return it;
      };
      var meta = _meta.exports = {
        KEY: META$1,
        NEED: false,
        fastKey: fastKey,
        getWeak: getWeak,
        onFreeze: onFreeze
      };

      var core$1 = _core.exports;
      var wksExt$1 = _wksExt;
      var defineProperty = _objectDp.f;
      var _wksDefine = function (name) {
        var $Symbol = core$1.Symbol || (core$1.Symbol = {} );
        if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt$1.f(name) });
      };

      var _objectGops = {};

      _objectGops.f = Object.getOwnPropertySymbols;

      var _objectPie = {};

      _objectPie.f = {}.propertyIsEnumerable;

      // all enumerable object keys, includes symbols
      var getKeys = _objectKeys;
      var gOPS = _objectGops;
      var pIE$1 = _objectPie;
      var _enumKeys = function (it) {
        var result = getKeys(it);
        var getSymbols = gOPS.f;
        if (getSymbols) {
          var symbols = getSymbols(it);
          var isEnum = pIE$1.f;
          var i = 0;
          var key;
          while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
        } return result;
      };

      // 7.2.2 IsArray(argument)
      var cof = _cof;
      var _isArray = Array.isArray || function isArray(arg) {
        return cof(arg) == 'Array';
      };

      var _objectGopnExt = {};

      var _objectGopn = {};

      // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
      var $keys$1 = _objectKeysInternal;
      var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

      _objectGopn.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
        return $keys$1(O, hiddenKeys);
      };

      // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
      var toIObject$3 = _toIobject;
      var gOPN$1 = _objectGopn.f;
      var toString = {}.toString;

      var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
        ? Object.getOwnPropertyNames(window) : [];

      var getWindowNames = function (it) {
        try {
          return gOPN$1(it);
        } catch (e) {
          return windowNames.slice();
        }
      };

      _objectGopnExt.f = function getOwnPropertyNames(it) {
        return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(toIObject$3(it));
      };

      var _objectGopd = {};

      var pIE = _objectPie;
      var createDesc$1 = _propertyDesc;
      var toIObject$2 = _toIobject;
      var toPrimitive$1 = _toPrimitive;
      var has$1 = _has;
      var IE8_DOM_DEFINE = _ie8DomDefine;
      var gOPD$1 = Object.getOwnPropertyDescriptor;

      _objectGopd.f = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {
        O = toIObject$2(O);
        P = toPrimitive$1(P, true);
        if (IE8_DOM_DEFINE) try {
          return gOPD$1(O, P);
        } catch (e) { /* empty */ }
        if (has$1(O, P)) return createDesc$1(!pIE.f.call(O, P), O[P]);
      };

      // ECMAScript 6 symbols shim
      var global = _global.exports;
      var has = _has;
      var DESCRIPTORS = _descriptors;
      var $export$3 = _export;
      var redefine = _redefine;
      var META = _meta.exports.KEY;
      var $fails = _fails;
      var shared = _shared.exports;
      var setToStringTag = _setToStringTag;
      var uid = _uid;
      var wks = _wks.exports;
      var wksExt = _wksExt;
      var wksDefine = _wksDefine;
      var enumKeys = _enumKeys;
      var isArray = _isArray;
      var anObject$1 = _anObject;
      var isObject$1 = _isObject;
      var toObject$2 = _toObject;
      var toIObject$1 = _toIobject;
      var toPrimitive = _toPrimitive;
      var createDesc = _propertyDesc;
      var _create$1 = _objectCreate;
      var gOPNExt = _objectGopnExt;
      var $GOPD = _objectGopd;
      var $GOPS = _objectGops;
      var $DP = _objectDp;
      var $keys = _objectKeys;
      var gOPD = $GOPD.f;
      var dP = $DP.f;
      var gOPN = gOPNExt.f;
      var $Symbol = global.Symbol;
      var $JSON = global.JSON;
      var _stringify = $JSON && $JSON.stringify;
      var PROTOTYPE = 'prototype';
      var HIDDEN = wks('_hidden');
      var TO_PRIMITIVE = wks('toPrimitive');
      var isEnum = {}.propertyIsEnumerable;
      var SymbolRegistry = shared('symbol-registry');
      var AllSymbols = shared('symbols');
      var OPSymbols = shared('op-symbols');
      var ObjectProto = Object[PROTOTYPE];
      var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
      var QObject = global.QObject;
      // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
      var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

      // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
      var setSymbolDesc = DESCRIPTORS && $fails(function () {
        return _create$1(dP({}, 'a', {
          get: function () { return dP(this, 'a', { value: 7 }).a; }
        })).a != 7;
      }) ? function (it, key, D) {
        var protoDesc = gOPD(ObjectProto, key);
        if (protoDesc) delete ObjectProto[key];
        dP(it, key, D);
        if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
      } : dP;

      var wrap = function (tag) {
        var sym = AllSymbols[tag] = _create$1($Symbol[PROTOTYPE]);
        sym._k = tag;
        return sym;
      };

      var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
        return typeof it == 'symbol';
      } : function (it) {
        return it instanceof $Symbol;
      };

      var $defineProperty = function defineProperty(it, key, D) {
        if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
        anObject$1(it);
        key = toPrimitive(key, true);
        anObject$1(D);
        if (has(AllSymbols, key)) {
          if (!D.enumerable) {
            if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
            it[HIDDEN][key] = true;
          } else {
            if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
            D = _create$1(D, { enumerable: createDesc(0, false) });
          } return setSymbolDesc(it, key, D);
        } return dP(it, key, D);
      };
      var $defineProperties = function defineProperties(it, P) {
        anObject$1(it);
        var keys = enumKeys(P = toIObject$1(P));
        var i = 0;
        var l = keys.length;
        var key;
        while (l > i) $defineProperty(it, key = keys[i++], P[key]);
        return it;
      };
      var $create = function create(it, P) {
        return P === undefined ? _create$1(it) : $defineProperties(_create$1(it), P);
      };
      var $propertyIsEnumerable = function propertyIsEnumerable(key) {
        var E = isEnum.call(this, key = toPrimitive(key, true));
        if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
        return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
      };
      var $getOwnPropertyDescriptor$1 = function getOwnPropertyDescriptor(it, key) {
        it = toIObject$1(it);
        key = toPrimitive(key, true);
        if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
        var D = gOPD(it, key);
        if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
        return D;
      };
      var $getOwnPropertyNames = function getOwnPropertyNames(it) {
        var names = gOPN(toIObject$1(it));
        var result = [];
        var i = 0;
        var key;
        while (names.length > i) {
          if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
        } return result;
      };
      var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
        var IS_OP = it === ObjectProto;
        var names = gOPN(IS_OP ? OPSymbols : toIObject$1(it));
        var result = [];
        var i = 0;
        var key;
        while (names.length > i) {
          if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
        } return result;
      };

      // 19.4.1.1 Symbol([description])
      if (!USE_NATIVE) {
        $Symbol = function Symbol() {
          if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
          var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
          var $set = function (value) {
            if (this === ObjectProto) $set.call(OPSymbols, value);
            if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
            setSymbolDesc(this, tag, createDesc(1, value));
          };
          if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
          return wrap(tag);
        };
        redefine($Symbol[PROTOTYPE], 'toString', function toString() {
          return this._k;
        });

        $GOPD.f = $getOwnPropertyDescriptor$1;
        $DP.f = $defineProperty;
        _objectGopn.f = gOPNExt.f = $getOwnPropertyNames;
        _objectPie.f = $propertyIsEnumerable;
        $GOPS.f = $getOwnPropertySymbols;

        if (DESCRIPTORS && !_library) {
          redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable);
        }

        wksExt.f = function (name) {
          return wrap(wks(name));
        };
      }

      $export$3($export$3.G + $export$3.W + $export$3.F * !USE_NATIVE, { Symbol: $Symbol });

      for (var es6Symbols = (
        // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
        'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
      ).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

      for (var wellKnownSymbols = $keys(wks.store), k$1 = 0; wellKnownSymbols.length > k$1;) wksDefine(wellKnownSymbols[k$1++]);

      $export$3($export$3.S + $export$3.F * !USE_NATIVE, 'Symbol', {
        // 19.4.2.1 Symbol.for(key)
        'for': function (key) {
          return has(SymbolRegistry, key += '')
            ? SymbolRegistry[key]
            : SymbolRegistry[key] = $Symbol(key);
        },
        // 19.4.2.5 Symbol.keyFor(sym)
        keyFor: function keyFor(sym) {
          if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
          for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
        },
        useSetter: function () { setter = true; },
        useSimple: function () { setter = false; }
      });

      $export$3($export$3.S + $export$3.F * !USE_NATIVE, 'Object', {
        // 19.1.2.2 Object.create(O [, Properties])
        create: $create,
        // 19.1.2.4 Object.defineProperty(O, P, Attributes)
        defineProperty: $defineProperty,
        // 19.1.2.3 Object.defineProperties(O, Properties)
        defineProperties: $defineProperties,
        // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
        getOwnPropertyDescriptor: $getOwnPropertyDescriptor$1,
        // 19.1.2.7 Object.getOwnPropertyNames(O)
        getOwnPropertyNames: $getOwnPropertyNames,
        // 19.1.2.8 Object.getOwnPropertySymbols(O)
        getOwnPropertySymbols: $getOwnPropertySymbols
      });

      // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
      // https://bugs.chromium.org/p/v8/issues/detail?id=3443
      var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

      $export$3($export$3.S + $export$3.F * FAILS_ON_PRIMITIVES, 'Object', {
        getOwnPropertySymbols: function getOwnPropertySymbols(it) {
          return $GOPS.f(toObject$2(it));
        }
      });

      // 24.3.2 JSON.stringify(value [, replacer [, space]])
      $JSON && $export$3($export$3.S + $export$3.F * (!USE_NATIVE || $fails(function () {
        var S = $Symbol();
        // MS Edge converts symbol values to JSON as {}
        // WebKit converts symbol values to JSON as null
        // V8 throws on boxed symbols
        return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
      })), 'JSON', {
        stringify: function stringify(it) {
          var args = [it];
          var i = 1;
          var replacer, $replacer;
          while (arguments.length > i) args.push(arguments[i++]);
          $replacer = replacer = args[1];
          if (!isObject$1(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
          if (!isArray(replacer)) replacer = function (key, value) {
            if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
            if (!isSymbol(value)) return value;
          };
          args[1] = replacer;
          return _stringify.apply($JSON, args);
        }
      });

      // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
      $Symbol[PROTOTYPE][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
      // 19.4.3.5 Symbol.prototype[@@toStringTag]
      setToStringTag($Symbol, 'Symbol');
      // 20.2.1.9 Math[@@toStringTag]
      setToStringTag(Math, 'Math', true);
      // 24.3.3 JSON[@@toStringTag]
      setToStringTag(global.JSON, 'JSON', true);

      _wksDefine('asyncIterator');

      _wksDefine('observable');

      var symbol = _core.exports.Symbol;

      (function (module) {
      module.exports = { "default": symbol, __esModule: true };
      }(symbol$1));

      _typeof$1.__esModule = true;

      var _iterator = iterator$1.exports;

      var _iterator2 = _interopRequireDefault$3(_iterator);

      var _symbol = symbol$1.exports;

      var _symbol2 = _interopRequireDefault$3(_symbol);

      var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

      function _interopRequireDefault$3(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      _typeof$1.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
        return typeof obj === "undefined" ? "undefined" : _typeof(obj);
      } : function (obj) {
        return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
      };

      possibleConstructorReturn.__esModule = true;

      var _typeof2$1 = _typeof$1;

      var _typeof3$1 = _interopRequireDefault$2(_typeof2$1);

      function _interopRequireDefault$2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      possibleConstructorReturn.default = function (self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3$1.default)(call)) === "object" || typeof call === "function") ? call : self;
      };

      var inherits = {};

      var setPrototypeOf$1 = {exports: {}};

      // Works with __proto__ only. Old v8 can't work with null proto objects.
      /* eslint-disable no-proto */
      var isObject = _isObject;
      var anObject = _anObject;
      var check = function (O, proto) {
        anObject(O);
        if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
      };
      var _setProto = {
        set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
          function (test, buggy, set) {
            try {
              set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
              set(test, []);
              buggy = !(test instanceof Array);
            } catch (e) { buggy = true; }
            return function setPrototypeOf(O, proto) {
              check(O, proto);
              if (buggy) O.__proto__ = proto;
              else set(O, proto);
              return O;
            };
          }({}, false) : undefined),
        check: check
      };

      // 19.1.3.19 Object.setPrototypeOf(O, proto)
      var $export$2 = _export;
      $export$2($export$2.S, 'Object', { setPrototypeOf: _setProto.set });

      var setPrototypeOf = _core.exports.Object.setPrototypeOf;

      (function (module) {
      module.exports = { "default": setPrototypeOf, __esModule: true };
      }(setPrototypeOf$1));

      var create$1 = {exports: {}};

      var $export$1 = _export;
      // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
      $export$1($export$1.S, 'Object', { create: _objectCreate });

      var $Object$1 = _core.exports.Object;
      var create = function create(P, D) {
        return $Object$1.create(P, D);
      };

      (function (module) {
      module.exports = { "default": create, __esModule: true };
      }(create$1));

      inherits.__esModule = true;

      var _setPrototypeOf = setPrototypeOf$1.exports;

      var _setPrototypeOf2 = _interopRequireDefault$1(_setPrototypeOf);

      var _create = create$1.exports;

      var _create2 = _interopRequireDefault$1(_create);

      var _typeof2 = _typeof$1;

      var _typeof3 = _interopRequireDefault$1(_typeof2);

      function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      inherits.default = function (subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
        }

        subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
      };

      var propTypes = {exports: {}};

      var reactIs_production_min = {};

      /** @license React v16.13.1
       * react-is.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */
      var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
      Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
      function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}reactIs_production_min.AsyncMode=l;reactIs_production_min.ConcurrentMode=m;reactIs_production_min.ContextConsumer=k;reactIs_production_min.ContextProvider=h;reactIs_production_min.Element=c;reactIs_production_min.ForwardRef=n;reactIs_production_min.Fragment=e;reactIs_production_min.Lazy=t;reactIs_production_min.Memo=r;reactIs_production_min.Portal=d;
      reactIs_production_min.Profiler=g;reactIs_production_min.StrictMode=f;reactIs_production_min.Suspense=p;reactIs_production_min.isAsyncMode=function(a){return A(a)||z(a)===l};reactIs_production_min.isConcurrentMode=A;reactIs_production_min.isContextConsumer=function(a){return z(a)===k};reactIs_production_min.isContextProvider=function(a){return z(a)===h};reactIs_production_min.isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};reactIs_production_min.isForwardRef=function(a){return z(a)===n};reactIs_production_min.isFragment=function(a){return z(a)===e};reactIs_production_min.isLazy=function(a){return z(a)===t};
      reactIs_production_min.isMemo=function(a){return z(a)===r};reactIs_production_min.isPortal=function(a){return z(a)===d};reactIs_production_min.isProfiler=function(a){return z(a)===g};reactIs_production_min.isStrictMode=function(a){return z(a)===f};reactIs_production_min.isSuspense=function(a){return z(a)===p};
      reactIs_production_min.isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};reactIs_production_min.typeOf=z;

      /*
      object-assign
      (c) Sindre Sorhus
      @license MIT
      */
      /* eslint-disable no-unused-vars */
      var getOwnPropertySymbols = Object.getOwnPropertySymbols;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var propIsEnumerable = Object.prototype.propertyIsEnumerable;

      function toObject$1(val) {
      	if (val === null || val === undefined) {
      		throw new TypeError('Object.assign cannot be called with null or undefined');
      	}

      	return Object(val);
      }

      function shouldUseNative() {
      	try {
      		if (!Object.assign) {
      			return false;
      		}

      		// Detect buggy property enumeration order in older V8 versions.

      		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
      		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
      		test1[5] = 'de';
      		if (Object.getOwnPropertyNames(test1)[0] === '5') {
      			return false;
      		}

      		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
      		var test2 = {};
      		for (var i = 0; i < 10; i++) {
      			test2['_' + String.fromCharCode(i)] = i;
      		}
      		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      			return test2[n];
      		});
      		if (order2.join('') !== '0123456789') {
      			return false;
      		}

      		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
      		var test3 = {};
      		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      			test3[letter] = letter;
      		});
      		if (Object.keys(Object.assign({}, test3)).join('') !==
      				'abcdefghijklmnopqrst') {
      			return false;
      		}

      		return true;
      	} catch (err) {
      		// We don't expect any of the above to throw, but better to be safe.
      		return false;
      	}
      }

      shouldUseNative() ? Object.assign : function (target, source) {
      	var from;
      	var to = toObject$1(target);
      	var symbols;

      	for (var s = 1; s < arguments.length; s++) {
      		from = Object(arguments[s]);

      		for (var key in from) {
      			if (hasOwnProperty.call(from, key)) {
      				to[key] = from[key];
      			}
      		}

      		if (getOwnPropertySymbols) {
      			symbols = getOwnPropertySymbols(from);
      			for (var i = 0; i < symbols.length; i++) {
      				if (propIsEnumerable.call(from, symbols[i])) {
      					to[symbols[i]] = from[symbols[i]];
      				}
      			}
      		}
      	}

      	return to;
      };

      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      var ReactPropTypesSecret$1 = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

      var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;

      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      var ReactPropTypesSecret = ReactPropTypesSecret_1;

      function emptyFunction() {}
      function emptyFunctionWithReset() {}
      emptyFunctionWithReset.resetWarningCache = emptyFunction;

      var factoryWithThrowingShims = function() {
        function shim(props, propName, componentName, location, propFullName, secret) {
          if (secret === ReactPropTypesSecret) {
            // It is still safe when called from React.
            return;
          }
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use PropTypes.checkPropTypes() to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        }  shim.isRequired = shim;
        function getShim() {
          return shim;
        }  // Important!
        // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
        var ReactPropTypes = {
          array: shim,
          bool: shim,
          func: shim,
          number: shim,
          object: shim,
          string: shim,
          symbol: shim,

          any: shim,
          arrayOf: getShim,
          element: shim,
          elementType: shim,
          instanceOf: getShim,
          node: shim,
          objectOf: getShim,
          oneOf: getShim,
          oneOfType: getShim,
          shape: getShim,
          exact: getShim,

          checkPropTypes: emptyFunctionWithReset,
          resetWarningCache: emptyFunction
        };

        ReactPropTypes.PropTypes = ReactPropTypes;

        return ReactPropTypes;
      };

      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      {
        // By explicitly using `prop-types` you are opting into new production behavior.
        // http://fb.me/prop-types-in-prod
        propTypes.exports = factoryWithThrowingShims();
      }

      var util = {};

      Object.defineProperty(util, "__esModule", {
        value: true
      });
      /* global Element */

      if (typeof Element !== 'undefined' && !Element.prototype.matches) {
        var proto = Element.prototype;
        proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
      }

      var closest = function closest(el, selector, rootNode) {
        var element = el;
        while (element) {
          var isRoot = element === rootNode || element === document.body;
          if (isRoot || element.nodeType === 1 && element.matches(selector)) {
            if (isRoot) {
              element = null;
            }
            break;
          }
          element = element.parentNode;
        }
        return element;
      };

      var getScrollElement = function getScrollElement(el) {
        var element = el;
        do {
          var _window$getComputedSt = window.getComputedStyle(element),
              overflow = _window$getComputedSt.overflow;

          if ((overflow === 'auto' || overflow === 'scroll') && element && element.nodeType && (element.offsetWidth < element.scrollWidth || element.offsetHeight < element.scrollHeight)) {
            break;
          }
          if (!element || !element.nodeType || element === document.body) {
            element = null;
            break;
          }
          element = element.parentNode;
        } while (element);
        return element;
      };

      var getDomIndex = function getDomIndex(el, ignoreSelectors) {
        return Array.from(el.parentNode.children).filter(function (e) {
          return ignoreSelectors === '' ? true : !e.matches(ignoreSelectors);
        }).indexOf(el);
      };

      util.getScrollElement = getScrollElement;
      util.closest = closest;
      util.getDomIndex = getDomIndex;

      (function (module, exports) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _classCallCheck2 = classCallCheck;

      var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

      var _createClass2 = createClass;

      var _createClass3 = _interopRequireDefault(_createClass2);

      var _possibleConstructorReturn2 = possibleConstructorReturn;

      var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

      var _inherits2 = inherits;

      var _inherits3 = _interopRequireDefault(_inherits2);

      var _react = React;

      var _react2 = _interopRequireDefault(_react);

      var _propTypes = propTypes.exports;

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _util = util;

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

      var DEFAULT_NODE_SELECTOR = 'tr';
      var DIRECTIONS = {
        TOP: 1,
        BOTTOM: 3
      };
      var UNIT_PX = 'px';
      var DRAG_LIND_STYLE = 'position:fixed;z-index:9999;height:0;' + 'margin-top:-1px;border-bottom:dashed 2px red;display:none;';

      var ReactDragListView = function (_Component) {
        (0, _inherits3['default'])(ReactDragListView, _Component);

        function ReactDragListView(props) {
          (0, _classCallCheck3['default'])(this, ReactDragListView);

          var _this = (0, _possibleConstructorReturn3['default'])(this, (ReactDragListView.__proto__ || Object.getPrototypeOf(ReactDragListView)).call(this, props));

          _this.onMouseDown = _this.onMouseDown.bind(_this);
          _this.onDragStart = _this.onDragStart.bind(_this);
          _this.onDragEnter = _this.onDragEnter.bind(_this);
          _this.onDragEnd = _this.onDragEnd.bind(_this);
          _this.autoScroll = _this.autoScroll.bind(_this);

          _this.state = {
            fromIndex: -1,
            toIndex: -1
          };

          _this.scrollElement = null;
          _this.scrollTimerId = -1;
          _this.direction = DIRECTIONS.BOTTOM;
          return _this;
        }

        (0, _createClass3['default'])(ReactDragListView, [{
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            if (this.dragLine && this.dragLine.parentNode) {
              this.dragLine.parentNode.removeChild(this.dragLine);
              this.dragLine = null;
              this.cacheDragTarget = null;
            }
          }
        }, {
          key: 'onMouseDown',
          value: function onMouseDown(e) {
            var handle = this.getHandleNode(e.target);
            if (handle) {
              var target = !this.props.handleSelector || this.props.handleSelector === this.props.nodeSelector ? handle : this.getDragNode(handle);
              if (target) {
                handle.setAttribute('draggable', false);
                target.setAttribute('draggable', true);
                target.ondragstart = this.onDragStart;
                target.ondragend = this.onDragEnd;
              }
            }
          }
        }, {
          key: 'onDragStart',
          value: function onDragStart(e) {
            var target = this.getDragNode(e.target);
            var eventData = e;
            if (target) {
              var parentNode = target.parentNode;

              eventData.dataTransfer.setData('Text', '');
              eventData.dataTransfer.effectAllowed = 'move';
              parentNode.ondragenter = this.onDragEnter;
              parentNode.ondragover = function (ev) {
                ev.preventDefault();
                return true;
              };
              var fromIndex = (0, _util.getDomIndex)(target, this.props.ignoreSelector);
              this.setState({ fromIndex: fromIndex, toIndex: fromIndex });
              this.scrollElement = (0, _util.getScrollElement)(parentNode);
            }
          }
        }, {
          key: 'onDragEnter',
          value: function onDragEnter(e) {
            var target = this.getDragNode(e.target);
            var eventData = e;
            var toIndex = void 0;
            if (target) {
              toIndex = (0, _util.getDomIndex)(target, this.props.ignoreSelector);
              if (this.props.enableScroll) {
                this.resolveAutoScroll(eventData, target);
              }
            } else {
              toIndex = -1;
              this.stopAutoScroll();
            }
            this.cacheDragTarget = target;
            this.setState({ toIndex: toIndex });
            this.fixDragLine(target);
          }
        }, {
          key: 'onDragEnd',
          value: function onDragEnd(e) {
            var target = this.getDragNode(e.target);
            this.stopAutoScroll();
            if (target) {
              target.removeAttribute('draggable');
              target.ondragstart = null;
              target.ondragend = null;
              target.parentNode.ondragenter = null;
              target.parentNode.ondragover = null;
              if (this.state.fromIndex >= 0 && this.state.fromIndex !== this.state.toIndex) {
                this.props.onDragEnd(this.state.fromIndex, this.state.toIndex);
              }
            }
            this.hideDragLine();
            this.setState({ fromIndex: -1, toIndex: -1 });
          }
        }, {
          key: 'getDragNode',
          value: function getDragNode(target) {
            return (0, _util.closest)(target, this.props.nodeSelector, this.dragList);
          }
        }, {
          key: 'getHandleNode',
          value: function getHandleNode(target) {
            return (0, _util.closest)(target, this.props.handleSelector || this.props.nodeSelector, this.dragList);
          }
        }, {
          key: 'getDragLine',
          value: function getDragLine() {
            if (!this.dragLine) {
              this.dragLine = window.document.createElement('div');
              this.dragLine.setAttribute('style', DRAG_LIND_STYLE);
              window.document.body.appendChild(this.dragLine);
            }
            this.dragLine.className = this.props.lineClassName || '';
            return this.dragLine;
          }
        }, {
          key: 'resolveAutoScroll',
          value: function resolveAutoScroll(e, target) {
            if (!this.scrollElement) {
              return;
            }

            var _scrollElement$getBou = this.scrollElement.getBoundingClientRect(),
                top = _scrollElement$getBou.top,
                height = _scrollElement$getBou.height;

            var targetHeight = target.offsetHeight;
            var pageY = e.pageY;

            var compatibleHeight = targetHeight * (2 / 3);
            this.direction = 0;
            if (pageY > top + height - compatibleHeight) {
              this.direction = DIRECTIONS.BOTTOM;
            } else if (pageY < top + compatibleHeight) {
              this.direction = DIRECTIONS.TOP;
            }
            if (this.direction) {
              if (this.scrollTimerId < 0) {
                this.scrollTimerId = setInterval(this.autoScroll, 20);
              }
            } else {
              this.stopAutoScroll();
            }
          }
        }, {
          key: 'stopAutoScroll',
          value: function stopAutoScroll() {
            clearInterval(this.scrollTimerId);
            this.scrollTimerId = -1;
            this.fixDragLine(this.cacheDragTarget);
          }
        }, {
          key: 'autoScroll',
          value: function autoScroll() {
            var scrollTop = this.scrollElement.scrollTop;

            if (this.direction === DIRECTIONS.BOTTOM) {
              this.scrollElement.scrollTop = scrollTop + this.props.scrollSpeed;
              if (scrollTop === this.scrollElement.scrollTop) {
                this.stopAutoScroll();
              }
            } else if (this.direction === DIRECTIONS.TOP) {
              this.scrollElement.scrollTop = scrollTop - this.props.scrollSpeed;
              if (this.scrollElement.scrollTop <= 0) {
                this.stopAutoScroll();
              }
            } else {
              this.stopAutoScroll();
            }
          }
        }, {
          key: 'hideDragLine',
          value: function hideDragLine() {
            if (this.dragLine) {
              this.dragLine.style.display = 'none';
            }
          }
        }, {
          key: 'fixDragLine',
          value: function fixDragLine(target) {
            var dragLine = this.getDragLine();
            if (!target || this.state.fromIndex < 0 || this.state.fromIndex === this.state.toIndex) {
              this.hideDragLine();
              return;
            }

            var _target$getBoundingCl = target.getBoundingClientRect(),
                left = _target$getBoundingCl.left,
                top = _target$getBoundingCl.top,
                width = _target$getBoundingCl.width,
                height = _target$getBoundingCl.height;

            var lineTop = this.state.toIndex < this.state.fromIndex ? top : top + height;
            if (this.props.enableScroll && this.scrollElement) {
              var _scrollElement$getBou2 = this.scrollElement.getBoundingClientRect(),
                  scrollHeight = _scrollElement$getBou2.height,
                  scrollTop = _scrollElement$getBou2.top;

              if (lineTop < scrollTop - 2 || lineTop > scrollTop + scrollHeight + 2) {
                this.hideDragLine();
                return;
              }
            }
            dragLine.style.left = left + UNIT_PX;
            dragLine.style.width = width + UNIT_PX;
            dragLine.style.top = lineTop + UNIT_PX;
            dragLine.style.display = 'block';
          }
        }, {
          key: 'render',
          value: function render() {
            var _this2 = this;

            return _react2['default'].createElement(
              'div',
              { role: 'presentation', onMouseDown: this.onMouseDown, ref: function ref(c) {
                  _this2.dragList = c;
                } },
              this.props.children
            );
          }
        }]);
        return ReactDragListView;
      }(_react.Component);

      ReactDragListView.propTypes = {
        onDragEnd: _propTypes2['default'].func.isRequired,
        handleSelector: _propTypes2['default'].string,
        nodeSelector: _propTypes2['default'].string,
        ignoreSelector: _propTypes2['default'].string,
        enableScroll: _propTypes2['default'].bool,
        scrollSpeed: _propTypes2['default'].number,
        lineClassName: _propTypes2['default'].string,
        children: _propTypes2['default'].node
      };
      ReactDragListView.defaultProps = {
        nodeSelector: DEFAULT_NODE_SELECTOR,
        ignoreSelector: '',
        enableScroll: true,
        scrollSpeed: 10,
        handleSelector: '',
        lineClassName: '',
        children: null
      };
      exports['default'] = ReactDragListView;
      module.exports = exports['default'];
      }(ReactDragListView$1, ReactDragListView$1.exports));

      var ReactDragColumnView = {exports: {}};

      var get = {};

      var getPrototypeOf$1 = {exports: {}};

      // most Object methods by ES6 should accept primitives
      var $export = _export;
      var core = _core.exports;
      var fails = _fails;
      var _objectSap = function (KEY, exec) {
        var fn = (core.Object || {})[KEY] || Object[KEY];
        var exp = {};
        exp[KEY] = exec(fn);
        $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
      };

      // 19.1.2.9 Object.getPrototypeOf(O)
      var toObject = _toObject;
      var $getPrototypeOf = _objectGpo;

      _objectSap('getPrototypeOf', function () {
        return function getPrototypeOf(it) {
          return $getPrototypeOf(toObject(it));
        };
      });

      var getPrototypeOf = _core.exports.Object.getPrototypeOf;

      (function (module) {
      module.exports = { "default": getPrototypeOf, __esModule: true };
      }(getPrototypeOf$1));

      var getOwnPropertyDescriptor$1 = {exports: {}};

      // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
      var toIObject = _toIobject;
      var $getOwnPropertyDescriptor = _objectGopd.f;

      _objectSap('getOwnPropertyDescriptor', function () {
        return function getOwnPropertyDescriptor(it, key) {
          return $getOwnPropertyDescriptor(toIObject(it), key);
        };
      });

      var $Object = _core.exports.Object;
      var getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
        return $Object.getOwnPropertyDescriptor(it, key);
      };

      (function (module) {
      module.exports = { "default": getOwnPropertyDescriptor, __esModule: true };
      }(getOwnPropertyDescriptor$1));

      get.__esModule = true;

      var _getPrototypeOf = getPrototypeOf$1.exports;

      var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

      var _getOwnPropertyDescriptor = getOwnPropertyDescriptor$1.exports;

      var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      get.default = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

        if (desc === undefined) {
          var parent = (0, _getPrototypeOf2.default)(object);

          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc) {
          return desc.value;
        } else {
          var getter = desc.get;

          if (getter === undefined) {
            return undefined;
          }

          return getter.call(receiver);
        }
      };

      (function (module, exports) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _classCallCheck2 = classCallCheck;

      var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

      var _createClass2 = createClass;

      var _createClass3 = _interopRequireDefault(_createClass2);

      var _possibleConstructorReturn2 = possibleConstructorReturn;

      var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

      var _get2 = get;

      var _get3 = _interopRequireDefault(_get2);

      var _inherits2 = inherits;

      var _inherits3 = _interopRequireDefault(_inherits2);

      var _ReactDragListView2 = ReactDragListView$1.exports;

      var _ReactDragListView3 = _interopRequireDefault(_ReactDragListView2);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

      var UNIT_PX = 'px';
      var DRAG_LIND_STYLE = 'width:0;margin-left:-1px;margin-top:0;' + 'border-bottom:0 none;border-left:dashed 2px red;';
      var DIRECTIONS = {
        RIGHT: 2,
        LEFT: 4
      };

      var ReactDragColumnView = function (_ReactDragListView) {
        (0, _inherits3['default'])(ReactDragColumnView, _ReactDragListView);

        function ReactDragColumnView() {
          (0, _classCallCheck3['default'])(this, ReactDragColumnView);
          return (0, _possibleConstructorReturn3['default'])(this, (ReactDragColumnView.__proto__ || Object.getPrototypeOf(ReactDragColumnView)).apply(this, arguments));
        }

        (0, _createClass3['default'])(ReactDragColumnView, [{
          key: 'getDragLine',
          value: function getDragLine() {
            if (!this.dragLine) {
              (0, _get3['default'])(ReactDragColumnView.prototype.__proto__ || Object.getPrototypeOf(ReactDragColumnView.prototype), 'getDragLine', this).call(this);
              this.dragLine.setAttribute('style', this.dragLine.getAttribute('style') + DRAG_LIND_STYLE);
            }
            return this.dragLine;
          }
        }, {
          key: 'resolveAutoScroll',
          value: function resolveAutoScroll(e, target) {
            if (!this.scrollElement) {
              return;
            }

            var _scrollElement$getBou = this.scrollElement.getBoundingClientRect(),
                left = _scrollElement$getBou.left,
                width = _scrollElement$getBou.width;

            var targetWidth = target.offsetWidth;
            var pageX = e.pageX;

            var compatibleWidth = targetWidth * 2 / 3;
            this.direction = 0;
            if (pageX > left + width - compatibleWidth) {
              this.direction = DIRECTIONS.RIGHT;
            } else if (pageX < left + compatibleWidth) {
              this.direction = DIRECTIONS.LEFT;
            }
            if (this.direction) {
              if (this.scrollTimerId < 0) {
                this.scrollTimerId = setInterval(this.autoScroll, 20);
              }
            } else {
              this.stopAutoScroll();
            }
          }
        }, {
          key: 'autoScroll',
          value: function autoScroll() {
            var scrollLeft = this.scrollElement.scrollLeft;

            if (this.direction === DIRECTIONS.RIGHT) {
              this.scrollElement.scrollLeft = scrollLeft + this.props.scrollSpeed;
              if (scrollLeft === this.scrollElement.scrollLeft) {
                this.stopAutoScroll();
              }
            } else if (this.direction === DIRECTIONS.LEFT) {
              this.scrollElement.scrollLeft = scrollLeft - this.props.scrollSpeed;
              if (this.scrollElement.scrollLeft <= 0) {
                this.stopAutoScroll();
              }
            } else {
              this.stopAutoScroll();
            }
          }
        }, {
          key: 'fixDragLine',
          value: function fixDragLine(target) {
            var dragLine = this.getDragLine();
            if (!target || this.state.fromIndex < 0 || this.state.fromIndex === this.state.toIndex) {
              this.hideDragLine();
              return;
            }

            var _target$getBoundingCl = target.getBoundingClientRect(),
                left = _target$getBoundingCl.left,
                top = _target$getBoundingCl.top,
                width = _target$getBoundingCl.width,
                height = _target$getBoundingCl.height;

            var lineLeft = this.state.toIndex < this.state.fromIndex ? left : left + width;
            if (this.props.enableScroll && this.scrollElement) {
              var _scrollElement$getBou2 = this.scrollElement.getBoundingClientRect(),
                  scrollWidth = _scrollElement$getBou2.width,
                  scrollLeft = _scrollElement$getBou2.left;

              if (lineLeft < scrollLeft - 2 || lineLeft > scrollLeft + scrollWidth + 2) {
                this.hideDragLine();
                return;
              }
            }
            dragLine.style.top = top + UNIT_PX;
            dragLine.style.height = height + UNIT_PX;
            dragLine.style.left = lineLeft + UNIT_PX;
            dragLine.style.display = 'block';
          }
        }]);
        return ReactDragColumnView;
      }(_ReactDragListView3['default']);

      exports['default'] = ReactDragColumnView;
      module.exports = exports['default'];
      }(ReactDragColumnView, ReactDragColumnView.exports));

      (function (module, exports) {

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _ReactDragListView = ReactDragListView$1.exports;

      var _ReactDragListView2 = _interopRequireDefault(_ReactDragListView);

      var _ReactDragColumnView = ReactDragColumnView.exports;

      var _ReactDragColumnView2 = _interopRequireDefault(_ReactDragColumnView);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

      _ReactDragListView2['default'].DragColumn = _ReactDragColumnView2['default'];
      exports['default'] = _ReactDragListView2['default'];
      module.exports = exports['default'];
      }(lib, lib.exports));

      var ReactDragListView = /*@__PURE__*/getDefaultExportFromCjs(lib.exports);

      var __defProp = Object.defineProperty;
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
      var __objRest = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols)
          for (var prop of __getOwnPropSymbols(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      const DragListView = exports('DragListView', (_a) => {
        var _b = _a, {
          children
        } = _b, props = __objRest(_b, [
          "children"
        ]);
        return /* @__PURE__ */ React.createElement(ReactDragListView, __spreadValues({
          handlerSelector: ".drag-handler",
          nodeSelector: ".drag-item"
        }, props), children);
      });

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3Qtc2hhcmVkLWNvbXBvbmVudHMuMS4zLjEzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvY29udGV4dC50cyIsIi4uL3NyYy9ob29rcy91c2VBcnJheUxpc3QudHN4IiwiLi4vc3JjL2hvb2tzL3VzZUNvbXBvbmVudC50c3giLCIuLi9zcmMvQXJyYXlMaXN0LnRzeCIsIi4uL3NyYy9QcmV2aWV3VGV4dC50c3giLCIuLi9zcmMvUGFzc3dvcmRTdHJlbmd0aC50c3giLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2N0eC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1sZW5ndGguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWFic29sdXRlLWluZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faHRtbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZXh0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbWV0YS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1waWUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wbi1leHQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5hc3luYy1pdGVyYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3ltYm9sLm9ic2VydmFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1wcm90by5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2NyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMiLCIuLi9ub2RlX21vZHVsZXMvcmVhY3QtaXMvY2pzL3JlYWN0LWlzLnByb2R1Y3Rpb24ubWluLmpzIiwiLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQuanMiLCIuLi9ub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRyYWctbGlzdHZpZXcvbGliL3V0aWwuanMiLCIuLi9ub2RlX21vZHVsZXMvcmVhY3QtZHJhZy1saXN0dmlldy9saWIvUmVhY3REcmFnTGlzdFZpZXcuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1zYXAuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldC5qcyIsIi4uL25vZGVfbW9kdWxlcy9yZWFjdC1kcmFnLWxpc3R2aWV3L2xpYi9SZWFjdERyYWdDb2x1bW5WaWV3LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRyYWctbGlzdHZpZXcvbGliL2luZGV4LmpzIiwiLi4vc3JjL0RyYWdMaXN0Vmlldy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgSUFycmF5TGlzdFByb3BzLCBQcmV2aWV3VGV4dENvbmZpZ1Byb3BzIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNvbnN0IFByZXZpZXdUZXh0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8UHJldmlld1RleHRDb25maWdQcm9wcz4oe30pXG5leHBvcnQgY29uc3QgQXJyYXlDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxJQXJyYXlMaXN0UHJvcHM+KHt9KVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQsIEZyYWdtZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBpc051bSwgaXNGbiwgdG9BcnIgfSBmcm9tICdAZm9ybWlseS9zaGFyZWQnXG5pbXBvcnQgeyBBcnJheUNvbnRleHQgfSBmcm9tICcuLi9jb250ZXh0J1xuXG5leHBvcnQgY29uc3QgdXNlQXJyYXlMaXN0ID0gKGluZGV4OiBudW1iZXIgPSAwKSA9PiB7XG4gIGNvbnN0IHtcbiAgICB2YWx1ZSxcbiAgICBkaXNhYmxlZCxcbiAgICBlZGl0YWJsZSxcbiAgICBtaW5JdGVtcyxcbiAgICBtYXhJdGVtcyxcbiAgICByZW5kZXJzLFxuICAgIC4uLnByb3BzXG4gIH0gPSB1c2VDb250ZXh0KEFycmF5Q29udGV4dClcblxuICBjb25zdCByZW5kZXJXaXRoID0gKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICByZW5kZXI6IChub2RlOiBhbnkpID0+IFJlYWN0LlJlYWN0RWxlbWVudCxcbiAgICB3cmFwcGVyOiBhbnlcbiAgKSA9PiB7XG4gICAgbGV0IGNoaWxkcmVuOiBhbnlcbiAgICBpZiAocmVuZGVycyAmJiByZW5kZXJzW25hbWVdKSB7XG4gICAgICBpZiAoaXNGbihyZW5kZXJzW25hbWVdKSB8fCByZW5kZXJzW25hbWVdLnN0eWxlZENvbXBvbmVudElkKSB7XG4gICAgICAgIGNoaWxkcmVuID0gcmVuZGVyc1tuYW1lXShjb250ZXh0LmN1cnJlbnRJbmRleClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkcmVuID0gcmVuZGVyKHJlbmRlcnNbbmFtZV0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkcmVuID0gcmVuZGVyKHJlbmRlcnNbbmFtZV0pXG4gICAgfVxuICAgIGlmIChpc0ZuKHdyYXBwZXIpKSB7XG4gICAgICByZXR1cm4gd3JhcHBlcih7IC4uLmNvbnRleHQsIGNoaWxkcmVuIH0pIHx8IDxGcmFnbWVudCAvPlxuICAgIH1cbiAgICByZXR1cm4gY2hpbGRyZW4gfHwgPEZyYWdtZW50IC8+XG4gIH1cblxuICBjb25zdCBuZXdWYWx1ZSA9IHRvQXJyKHZhbHVlKVxuXG4gIGNvbnN0IGlzRW1wdHkgPSAhbmV3VmFsdWUgfHwgKG5ld1ZhbHVlICYmIG5ld1ZhbHVlLmxlbmd0aCA8PSAwKVxuICBjb25zdCBpc0Rpc2FibGUgPSBkaXNhYmxlZCB8fCBlZGl0YWJsZSA9PT0gZmFsc2VcbiAgY29uc3QgYWxsb3dNb3ZlVXAgPSBuZXdWYWx1ZSAmJiBuZXdWYWx1ZS5sZW5ndGggPiAxICYmICFpc0Rpc2FibGVcbiAgY29uc3QgYWxsb3dNb3ZlRG93biA9IG5ld1ZhbHVlICYmIG5ld1ZhbHVlLmxlbmd0aCA+IDEgJiYgIWlzRGlzYWJsZVxuICBjb25zdCBhbGxvd1JlbW92ZSA9IGlzTnVtKG1pbkl0ZW1zKVxuICAgID8gbmV3VmFsdWUubGVuZ3RoID4gbWluSXRlbXMgJiYgIWlzRGlzYWJsZVxuICAgIDogIWlzRGlzYWJsZVxuICBjb25zdCBhbGxvd0FkZGl0aW9uID0gaXNOdW0obWF4SXRlbXMpXG4gICAgPyBuZXdWYWx1ZS5sZW5ndGggPCBtYXhJdGVtcyAmJiAhaXNEaXNhYmxlXG4gICAgOiAhaXNEaXNhYmxlXG5cbiAgY29uc3QgY29udGV4dCA9IHtcbiAgICAuLi5wcm9wcyxcbiAgICBjdXJyZW50SW5kZXg6IGluZGV4LFxuICAgIGlzRW1wdHksXG4gICAgaXNEaXNhYmxlLFxuICAgIGFsbG93UmVtb3ZlLFxuICAgIGFsbG93QWRkaXRpb24sXG4gICAgYWxsb3dNb3ZlRG93bixcbiAgICBhbGxvd01vdmVVcCxcbiAgICByZW5kZXJXaXRoXG4gIH1cblxuICByZXR1cm4gY29udGV4dFxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZUNvbnRleHQsIEZyYWdtZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBpc0ZuIH0gZnJvbSAnQGZvcm1pbHkvc2hhcmVkJ1xuaW1wb3J0IHsgQXJyYXlDb250ZXh0IH0gZnJvbSAnLi4vY29udGV4dCdcblxuZXhwb3J0IGNvbnN0IHVzZUNvbXBvbmVudCA9IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgeyBjb21wb25lbnRzIH0gPSB1c2VDb250ZXh0KEFycmF5Q29udGV4dClcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChpc0ZuKGNvbXBvbmVudHNbbmFtZV0pIHx8IGNvbXBvbmVudHNbbmFtZV0uc3R5bGVkQ29tcG9uZW50SWQpXG4gICAgICByZXR1cm4gY29tcG9uZW50c1tuYW1lXVxuICAgIHJldHVybiAocHJvcHM6IHt9KSA9PiB7XG4gICAgICByZXR1cm4gUmVhY3QuaXNWYWxpZEVsZW1lbnQoY29tcG9uZW50c1tuYW1lXSkgPyAoXG4gICAgICAgIFJlYWN0LmNsb25lRWxlbWVudChjb21wb25lbnRzW25hbWVdLCBwcm9wcylcbiAgICAgICkgOiAoXG4gICAgICAgIDxGcmFnbWVudCAvPlxuICAgICAgKVxuICAgIH1cbiAgfSwgW10pXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgRnJhZ21lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IElBcnJheUxpc3QgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQXJyYXlDb250ZXh0IH0gZnJvbSAnLi9jb250ZXh0J1xuaW1wb3J0IHsgdXNlQXJyYXlMaXN0IH0gZnJvbSAnLi9ob29rcy91c2VBcnJheUxpc3QnXG5pbXBvcnQgeyB1c2VDb21wb25lbnQgfSBmcm9tICcuL2hvb2tzL3VzZUNvbXBvbmVudCdcblxuZXhwb3J0IGNvbnN0IEFycmF5TGlzdDogSUFycmF5TGlzdCA9IHByb3BzID0+IHtcbiAgcmV0dXJuIChcbiAgICA8QXJyYXlDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtwcm9wc30+XG4gICAgICB7cHJvcHMuY2hpbGRyZW59XG4gICAgPC9BcnJheUNvbnRleHQuUHJvdmlkZXI+XG4gIClcbn1cblxuY29uc3QgY3JlYXRlQnV0dG9uQ2xzID0gKHByb3BzOiBhbnkgPSB7fSwgaGFzVGV4dDogYW55KSA9PiB7XG4gIHJldHVybiB7XG4gICAgY2xhc3NOYW1lOiBgJHtoYXNUZXh0ID8gJ2hhcy10ZXh0JyA6ICcnfSAke3Byb3BzLmNsYXNzTmFtZSB8fCAnJ31gXG4gIH1cbn1cblxuQXJyYXlMaXN0LnVzZUFycmF5TGlzdCA9IHVzZUFycmF5TGlzdFxuQXJyYXlMaXN0LnVzZUNvbXBvbmVudCA9IHVzZUNvbXBvbmVudFxuXG5BcnJheUxpc3QuV3JhcHBlciA9ICh7IGNoaWxkcmVuLCAuLi5wcm9wcyB9KSA9PiB7XG4gIGNvbnN0IFdyYXBwZXJDb21wb25lbnQgPSBBcnJheUxpc3QudXNlQ29tcG9uZW50KCdXcmFwcGVyJylcbiAgcmV0dXJuIDxXcmFwcGVyQ29tcG9uZW50IHsuLi5wcm9wc30+e2NoaWxkcmVufTwvV3JhcHBlckNvbXBvbmVudD5cbn1cblxuQXJyYXlMaXN0Lkl0ZW0gPSAoeyBjaGlsZHJlbiwgLi4ucHJvcHMgfSkgPT4ge1xuICBjb25zdCBJdGVtQ29tcG9uZW50ID0gQXJyYXlMaXN0LnVzZUNvbXBvbmVudCgnSXRlbScpXG4gIHJldHVybiA8SXRlbUNvbXBvbmVudCB7Li4ucHJvcHN9PntjaGlsZHJlbn08L0l0ZW1Db21wb25lbnQ+XG59XG5cbkFycmF5TGlzdC5SZW1vdmUgPSAoeyBjaGlsZHJlbiwgY29tcG9uZW50LCBpbmRleCwgLi4ucHJvcHMgfSkgPT4ge1xuICBjb25zdCB7IGFsbG93UmVtb3ZlLCByZW5kZXJXaXRoIH0gPSBBcnJheUxpc3QudXNlQXJyYXlMaXN0KGluZGV4KVxuICBjb25zdCBCdXR0b24gPSBBcnJheUxpc3QudXNlQ29tcG9uZW50KGNvbXBvbmVudClcbiAgY29uc3QgUmVtb3ZlSWNvbiA9IEFycmF5TGlzdC51c2VDb21wb25lbnQoJ1JlbW92ZUljb24nKVxuICBpZiAoYWxsb3dSZW1vdmUpIHtcbiAgICByZXR1cm4gcmVuZGVyV2l0aChcbiAgICAgICdyZW5kZXJSZW1vdmUnLFxuICAgICAgdGV4dCA9PiAoXG4gICAgICAgIDxCdXR0b24gey4uLnByb3BzfSB7Li4uY3JlYXRlQnV0dG9uQ2xzKHByb3BzLCB0ZXh0KX0+XG4gICAgICAgICAgPFJlbW92ZUljb24gLz5cbiAgICAgICAgICB7dGV4dH1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICApLFxuICAgICAgY2hpbGRyZW5cbiAgICApXG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudClcbn1cblxuQXJyYXlMaXN0LlJlbW92ZS5kZWZhdWx0UHJvcHMgPSB7XG4gIGNvbXBvbmVudDogJ0NpcmNsZUJ1dHRvbidcbn1cblxuQXJyYXlMaXN0LkFkZGl0aW9uID0gKHsgY2hpbGRyZW4sIGNvbXBvbmVudCwgLi4ucHJvcHMgfSkgPT4ge1xuICBjb25zdCB7IGFsbG93QWRkaXRpb24sIHJlbmRlcldpdGggfSA9IEFycmF5TGlzdC51c2VBcnJheUxpc3QoKVxuICBjb25zdCBCdXR0b24gPSBBcnJheUxpc3QudXNlQ29tcG9uZW50KGNvbXBvbmVudClcbiAgY29uc3QgQWRkaXRpb25JY29uID0gQXJyYXlMaXN0LnVzZUNvbXBvbmVudCgnQWRkaXRpb25JY29uJylcblxuICBpZiAoYWxsb3dBZGRpdGlvbikge1xuICAgIHJldHVybiByZW5kZXJXaXRoKFxuICAgICAgJ3JlbmRlckFkZGl0aW9uJyxcbiAgICAgIHRleHQgPT4gKFxuICAgICAgICA8QnV0dG9uIHsuLi5wcm9wc30gey4uLmNyZWF0ZUJ1dHRvbkNscyhwcm9wcywgdGV4dCl9PlxuICAgICAgICAgIDxBZGRpdGlvbkljb24gLz5cbiAgICAgICAgICB7dGV4dH1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICApLFxuICAgICAgY2hpbGRyZW5cbiAgICApXG4gIH1cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQpXG59XG5cbkFycmF5TGlzdC5BZGRpdGlvbi5kZWZhdWx0UHJvcHMgPSB7XG4gIGNvbXBvbmVudDogJ1RleHRCdXR0b24nXG59XG5cbkFycmF5TGlzdC5Nb3ZlVXAgPSAoeyBjaGlsZHJlbiwgY29tcG9uZW50LCBpbmRleCwgLi4ucHJvcHMgfSkgPT4ge1xuICBjb25zdCB7IGFsbG93TW92ZVVwLCByZW5kZXJXaXRoIH0gPSBBcnJheUxpc3QudXNlQXJyYXlMaXN0KGluZGV4KVxuICBjb25zdCBCdXR0b24gPSBBcnJheUxpc3QudXNlQ29tcG9uZW50KGNvbXBvbmVudClcbiAgY29uc3QgTW92ZVVwSWNvbiA9IEFycmF5TGlzdC51c2VDb21wb25lbnQoJ01vdmVVcEljb24nKVxuXG4gIGlmIChhbGxvd01vdmVVcCkge1xuICAgIHJldHVybiByZW5kZXJXaXRoKFxuICAgICAgJ3JlbmRlck1vdmVVcCcsXG4gICAgICB0ZXh0ID0+IChcbiAgICAgICAgPEJ1dHRvbiB7Li4ucHJvcHN9IHsuLi5jcmVhdGVCdXR0b25DbHMocHJvcHMsIHRleHQpfT5cbiAgICAgICAgICA8TW92ZVVwSWNvbiAvPlxuICAgICAgICAgIHt0ZXh0fVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICksXG4gICAgICBjaGlsZHJlblxuICAgIClcbiAgfVxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudClcbn1cblxuQXJyYXlMaXN0Lk1vdmVVcC5kZWZhdWx0UHJvcHMgPSB7XG4gIGNvbXBvbmVudDogJ0NpcmNsZUJ1dHRvbidcbn1cblxuQXJyYXlMaXN0Lk1vdmVEb3duID0gKHsgY2hpbGRyZW4sIGNvbXBvbmVudCwgaW5kZXgsIC4uLnByb3BzIH0pID0+IHtcbiAgY29uc3QgeyBhbGxvd01vdmVEb3duLCByZW5kZXJXaXRoIH0gPSBBcnJheUxpc3QudXNlQXJyYXlMaXN0KGluZGV4KVxuICBjb25zdCBCdXR0b24gPSBBcnJheUxpc3QudXNlQ29tcG9uZW50KGNvbXBvbmVudClcbiAgY29uc3QgTW92ZVVwSWNvbiA9IEFycmF5TGlzdC51c2VDb21wb25lbnQoJ01vdmVEb3duSWNvbicpXG5cbiAgaWYgKGFsbG93TW92ZURvd24pIHtcbiAgICByZXR1cm4gcmVuZGVyV2l0aChcbiAgICAgICdyZW5kZXJNb3ZlRG93bicsXG4gICAgICB0ZXh0ID0+IChcbiAgICAgICAgPEJ1dHRvbiB7Li4ucHJvcHN9IHsuLi5jcmVhdGVCdXR0b25DbHMocHJvcHMsIHRleHQpfT5cbiAgICAgICAgICA8TW92ZVVwSWNvbiAvPlxuICAgICAgICAgIHt0ZXh0fVxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICksXG4gICAgICBjaGlsZHJlblxuICAgIClcbiAgfVxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudClcbn1cblxuQXJyYXlMaXN0Lk1vdmVEb3duLmRlZmF1bHRQcm9wcyA9IHtcbiAgY29tcG9uZW50OiAnQ2lyY2xlQnV0dG9uJ1xufVxuXG5BcnJheUxpc3QuRW1wdHkgPSAoeyBjaGlsZHJlbiwgY29tcG9uZW50LCAuLi5wcm9wcyB9KSA9PiB7XG4gIGNvbnN0IHsgYWxsb3dBZGRpdGlvbiwgaXNFbXB0eSwgcmVuZGVyV2l0aCB9ID0gQXJyYXlMaXN0LnVzZUFycmF5TGlzdCgpXG4gIGNvbnN0IEJ1dHRvbiA9IEFycmF5TGlzdC51c2VDb21wb25lbnQoY29tcG9uZW50KVxuICBjb25zdCBBZGRpdGlvbkljb24gPSBBcnJheUxpc3QudXNlQ29tcG9uZW50KCdBZGRpdGlvbkljb24nKVxuICBsZXQgYWRkdGlvbjogYW55XG4gIGlmIChhbGxvd0FkZGl0aW9uKSB7XG4gICAgYWRkdGlvbiA9IHJlbmRlcldpdGgoJ3JlbmRlckFkZGl0aW9uJywgdGV4dCA9PiAoXG4gICAgICA8QnV0dG9uIHsuLi5wcm9wc30gey4uLmNyZWF0ZUJ1dHRvbkNscyhwcm9wcywgdGV4dCl9PlxuICAgICAgICA8QWRkaXRpb25JY29uIC8+XG4gICAgICAgIHt0ZXh0fVxuICAgICAgPC9CdXR0b24+XG4gICAgKSlcbiAgfVxuXG4gIGlmIChpc0VtcHR5KSB7XG4gICAgcmV0dXJuIHJlbmRlcldpdGgoXG4gICAgICAncmVuZGVyRW1wdHknLFxuICAgICAgdGV4dCA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcgfX1cbiAgICAgICAgICAgICAgc3JjPXtcbiAgICAgICAgICAgICAgICAnLy9pbWcuYWxpY2RuLmNvbS90ZnMvVEIxY1ZuY0tBem9LMVJqU1pGbFhYYWk0VlhhLTE4NC0xNTIuc3ZnJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge3RleHR9XG4gICAgICAgICAgICB7YWRkdGlvbn1cbiAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICApXG4gICAgICB9LFxuICAgICAgY2hpbGRyZW5cbiAgICApXG4gIH1cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQpXG59XG5cbkFycmF5TGlzdC5FbXB0eS5kZWZhdWx0UHJvcHMgPSB7XG4gIGNvbXBvbmVudDogJ1RleHRCdXR0b24nXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgaXNGbiwgaXNFcXVhbCB9IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCB7IElQcmV2aWV3VGV4dFByb3BzLCBQcmV2aWV3VGV4dENvbmZpZ1Byb3BzIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IFByZXZpZXdUZXh0Q29udGV4dCB9IGZyb20gJy4vY29udGV4dCdcblxuZXhwb3J0IGNvbnN0IFByZXZpZXdUZXh0OiBSZWFjdC5GQzxJUHJldmlld1RleHRQcm9wcz4gJiB7XG4gIENvbmZpZ1Byb3ZpZGVyOiBSZWFjdC5Db250ZXh0PFByZXZpZXdUZXh0Q29uZmlnUHJvcHM+WydQcm92aWRlciddXG59ID0gcHJvcHMgPT4ge1xuICBjb25zdCBjb250ZXh0ID0gdXNlQ29udGV4dChQcmV2aWV3VGV4dENvbnRleHQpIHx8IHt9XG4gIGxldCB2YWx1ZTogYW55XG4gIGlmIChwcm9wcy5kYXRhU291cmNlICYmIHByb3BzLmRhdGFTb3VyY2UubGVuZ3RoKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMudmFsdWUpKSB7XG4gICAgICB2YWx1ZSA9IHByb3BzLnZhbHVlLm1hcCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBmaW5kZWQgPSBwcm9wcy5kYXRhU291cmNlLmZpbmQoXG4gICAgICAgICAgaXRlbSA9PiBpdGVtLnZhbHVlID09IHZhbCB8fCBpc0VxdWFsKGl0ZW0udmFsdWUsIHZhbClcbiAgICAgICAgKVxuICAgICAgICBpZiAoZmluZGVkKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICB7ZmluZGVkLmxhYmVsfVxuICAgICAgICAgICAgICB7aW5kZXggPCBwcm9wcy52YWx1ZS5sZW5ndGggLSAxID8gJyAsJyA6ICcnfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZmluZWQgPSBwcm9wcy5kYXRhU291cmNlLmZpbmQoaXRlbSA9PlxuICAgICAgICBpc0VxdWFsKGl0ZW0udmFsdWUsIHByb3BzLnZhbHVlKVxuICAgICAgKVxuICAgICAgaWYgKGZpbmVkKSB7XG4gICAgICAgIHZhbHVlID0gZmluZWQubGFiZWxcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMudmFsdWUpKSB7XG4gICAgICB2YWx1ZSA9IHByb3BzLnZhbHVlLm1hcCgodmFsLCBpbmRleCkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxzcGFuIGtleT17aW5kZXh9PlxuICAgICAgICAgICAge3ZhbH1cbiAgICAgICAgICAgIHtpbmRleCA8IHByb3BzLnZhbHVlLmxlbmd0aCAtIDEgPyAnficgOiAnJ31cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKFxuICAgICAgICBwcm9wcy52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHByb3BzLnZhbHVlID09PSBudWxsID8gJycgOiBwcm9wcy52YWx1ZVxuICAgICAgKVxuICAgICAgLy8g5aaC5p6c5pyJ5o2i6KGM56ym77yM5ouG5YiG5oiQ5aSa6KGMXG4gICAgICBpZiAodmFsdWUubWF0Y2goJ1xcbicpKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWVcbiAgICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgLm1hcCgoc3ViU3RyLCBpbmRleCkgPT4gPGRpdiBrZXk9e2luZGV4fT57c3ViU3RyfTwvZGl2PilcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgY29uc3QgcGxhY2Vob2xkZXIgPSBpc0ZuKGNvbnRleHQucHJldmlld1BsYWNlaG9sZGVyKVxuICAgID8gY29udGV4dC5wcmV2aWV3UGxhY2Vob2xkZXIocHJvcHMpXG4gICAgOiBjb250ZXh0LnByZXZpZXdQbGFjZWhvbGRlclxuICByZXR1cm4gKFxuICAgIDxwXG4gICAgICBzdHlsZT17eyBwYWRkaW5nOiAwLCBtYXJnaW46IDAgfX1cbiAgICAgIGNsYXNzTmFtZT17YHByZXZpZXctdGV4dCAke3Byb3BzLmNsYXNzTmFtZSB8fCAnJ31gfVxuICAgID5cbiAgICAgIHtwcm9wcy5hZGRvbkJlZm9yZSA/ICcgJyArIHByb3BzLmFkZG9uQmVmb3JlIDogJyd9XG4gICAgICB7cHJvcHMuaW5uZXJCZWZvcmUgPyAnICcgKyBwcm9wcy5pbm5lckJlZm9yZSA6ICcnfVxuICAgICAge3Byb3BzLmFkZG9uVGV4dEJlZm9yZSA/ICcgJyArIHByb3BzLmFkZG9uVGV4dEJlZm9yZSA6ICcnfVxuICAgICAge3ZhbHVlID09PSAnJyB8fFxuICAgICAgdmFsdWUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgPyBwbGFjZWhvbGRlciB8fCAnTi9BJ1xuICAgICAgICA6IHZhbHVlfVxuICAgICAge3Byb3BzLmFkZG9uVGV4dEFmdGVyID8gJyAnICsgcHJvcHMuYWRkb25UZXh0QWZ0ZXIgOiAnJ31cbiAgICAgIHtwcm9wcy5pbm5lckFmdGVyID8gJyAnICsgcHJvcHMuaW5uZXJBZnRlciA6ICcnfVxuICAgICAge3Byb3BzLmFkZG9uQWZ0ZXIgPyAnICcgKyBwcm9wcy5hZGRvbkFmdGVyIDogJyd9XG4gICAgPC9wPlxuICApXG59XG5cblByZXZpZXdUZXh0LkNvbmZpZ1Byb3ZpZGVyID0gUHJldmlld1RleHRDb250ZXh0LlByb3ZpZGVyXG4iLCJpbXBvcnQgUmVhY3QsIHsgRnJhZ21lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IElQYXNzd29yZFN0cmVuZ3RoUHJvcHMgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgaXNGbiB9IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcblxuY29uc3QgaXNOdW0gPSBmdW5jdGlvbihjKSB7XG4gIHJldHVybiBjID49IDQ4ICYmIGMgPD0gNTdcbn1cbmNvbnN0IGlzTG93ZXIgPSBmdW5jdGlvbihjKSB7XG4gIHJldHVybiBjID49IDk3ICYmIGMgPD0gMTIyXG59XG5jb25zdCBpc1VwcGVyID0gZnVuY3Rpb24oYykge1xuICByZXR1cm4gYyA+PSA2NSAmJiBjIDw9IDkwXG59XG5jb25zdCBpc1N5bWJvbCA9IGZ1bmN0aW9uKGMpIHtcbiAgcmV0dXJuICEoaXNMb3dlcihjKSB8fCBpc1VwcGVyKGMpIHx8IGlzTnVtKGMpKVxufVxuY29uc3QgaXNMZXR0ZXIgPSBmdW5jdGlvbihjKSB7XG4gIHJldHVybiBpc0xvd2VyKGMpIHx8IGlzVXBwZXIoYylcbn1cblxuY29uc3QgZ2V0U3RyZW5ndGggPSB2YWwgPT4ge1xuICBpZiAoIXZhbCkgcmV0dXJuIDBcbiAgbGV0IG51bSA9IDBcbiAgbGV0IGxvd2VyID0gMFxuICBsZXQgdXBwZXIgPSAwXG4gIGxldCBzeW1ib2wgPSAwXG4gIGxldCBNTlMgPSAwXG4gIGxldCByZXAgPSAwXG4gIGxldCByZXBDID0gMFxuICBsZXQgY29uc2VjdXRpdmUgPSAwXG4gIGxldCBzZXF1ZW50aWFsID0gMFxuICBjb25zdCBsZW4gPSAoKSA9PiBudW0gKyBsb3dlciArIHVwcGVyICsgc3ltYm9sXG4gIGNvbnN0IGNhbGxtZSA9ICgpID0+IHtcbiAgICBsZXQgcmUgPSBudW0gPiAwID8gMSA6IDBcbiAgICByZSArPSBsb3dlciA+IDAgPyAxIDogMFxuICAgIHJlICs9IHVwcGVyID4gMCA/IDEgOiAwXG4gICAgcmUgKz0gc3ltYm9sID4gMCA/IDEgOiAwXG4gICAgaWYgKHJlID4gMiAmJiBsZW4oKSA+PSA4KSB7XG4gICAgICByZXR1cm4gcmUgKyAxXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAwXG4gICAgfVxuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYyA9IHZhbC5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGlzTnVtKGMpKSB7XG4gICAgICBudW0rK1xuICAgICAgaWYgKGkgIT09IDAgJiYgaSAhPT0gdmFsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgTU5TKytcbiAgICAgIH1cbiAgICAgIGlmIChpID4gMCAmJiBpc051bSh2YWwuY2hhckNvZGVBdChpIC0gMSkpKSB7XG4gICAgICAgIGNvbnNlY3V0aXZlKytcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzTG93ZXIoYykpIHtcbiAgICAgIGxvd2VyKytcbiAgICAgIGlmIChpID4gMCAmJiBpc0xvd2VyKHZhbC5jaGFyQ29kZUF0KGkgLSAxKSkpIHtcbiAgICAgICAgY29uc2VjdXRpdmUrK1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNVcHBlcihjKSkge1xuICAgICAgdXBwZXIrK1xuICAgICAgaWYgKGkgPiAwICYmIGlzVXBwZXIodmFsLmNoYXJDb2RlQXQoaSAtIDEpKSkge1xuICAgICAgICBjb25zZWN1dGl2ZSsrXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN5bWJvbCsrXG4gICAgICBpZiAoaSAhPT0gMCAmJiBpICE9PSB2YWwubGVuZ3RoIC0gMSkge1xuICAgICAgICBNTlMrK1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgZXhpc3RzID0gZmFsc2VcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHZhbC5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKHZhbFtpXSA9PT0gdmFsW2pdICYmIGkgIT09IGopIHtcbiAgICAgICAgZXhpc3RzID0gdHJ1ZVxuICAgICAgICByZXBDICs9IE1hdGguYWJzKHZhbC5sZW5ndGggLyAoaiAtIGkpKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZXhpc3RzKSB7XG4gICAgICByZXArK1xuICAgICAgY29uc3QgdW5pcXVlID0gdmFsLmxlbmd0aCAtIHJlcFxuICAgICAgcmVwQyA9IHVuaXF1ZSA/IE1hdGguY2VpbChyZXBDIC8gdW5pcXVlKSA6IE1hdGguY2VpbChyZXBDKVxuICAgIH1cbiAgICBpZiAoaSA+IDEpIHtcbiAgICAgIGNvbnN0IGxhc3QxID0gdmFsLmNoYXJDb2RlQXQoaSAtIDEpXG4gICAgICBjb25zdCBsYXN0MiA9IHZhbC5jaGFyQ29kZUF0KGkgLSAyKVxuICAgICAgaWYgKGlzTGV0dGVyKGMpKSB7XG4gICAgICAgIGlmIChpc0xldHRlcihsYXN0MSkgJiYgaXNMZXR0ZXIobGFzdDIpKSB7XG4gICAgICAgICAgY29uc3QgdiA9IHZhbC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgY29uc3QgdmkgPSB2LmNoYXJDb2RlQXQoaSlcbiAgICAgICAgICBjb25zdCB2aTEgPSB2LmNoYXJDb2RlQXQoaSAtIDEpXG4gICAgICAgICAgY29uc3QgdmkyID0gdi5jaGFyQ29kZUF0KGkgLSAyKVxuICAgICAgICAgIGlmICh2aSAtIHZpMSA9PT0gdmkxIC0gdmkyICYmIE1hdGguYWJzKHZpIC0gdmkxKSA9PT0gMSkge1xuICAgICAgICAgICAgc2VxdWVudGlhbCsrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzTnVtKGMpKSB7XG4gICAgICAgIGlmIChpc051bShsYXN0MSkgJiYgaXNOdW0obGFzdDIpKSB7XG4gICAgICAgICAgaWYgKGMgLSBsYXN0MSA9PT0gbGFzdDEgLSBsYXN0MiAmJiBNYXRoLmFicyhjIC0gbGFzdDEpID09PSAxKSB7XG4gICAgICAgICAgICBzZXF1ZW50aWFsKytcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc1N5bWJvbChsYXN0MSkgJiYgaXNTeW1ib2wobGFzdDIpKSB7XG4gICAgICAgICAgaWYgKGMgLSBsYXN0MSA9PT0gbGFzdDEgLSBsYXN0MiAmJiBNYXRoLmFicyhjIC0gbGFzdDEpID09PSAxKSB7XG4gICAgICAgICAgICBzZXF1ZW50aWFsKytcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgbGV0IHN1bSA9IDBcbiAgY29uc3QgbGVuZ3RoID0gbGVuKClcbiAgc3VtICs9IDQgKiBsZW5ndGhcbiAgaWYgKGxvd2VyID4gMCkge1xuICAgIHN1bSArPSAyICogKGxlbmd0aCAtIGxvd2VyKVxuICB9XG4gIGlmICh1cHBlciA+IDApIHtcbiAgICBzdW0gKz0gMiAqIChsZW5ndGggLSB1cHBlcilcbiAgfVxuICBpZiAobnVtICE9PSBsZW5ndGgpIHtcbiAgICBzdW0gKz0gNCAqIG51bVxuICB9XG4gIHN1bSArPSA2ICogc3ltYm9sXG4gIHN1bSArPSAyICogTU5TXG4gIHN1bSArPSAyICogY2FsbG1lKClcbiAgaWYgKGxlbmd0aCA9PT0gbG93ZXIgKyB1cHBlcikge1xuICAgIHN1bSAtPSBsZW5ndGhcbiAgfVxuICBpZiAobGVuZ3RoID09PSBudW0pIHtcbiAgICBzdW0gLT0gbnVtXG4gIH1cbiAgc3VtIC09IHJlcENcbiAgc3VtIC09IDIgKiBjb25zZWN1dGl2ZVxuICBzdW0gLT0gMyAqIHNlcXVlbnRpYWxcbiAgc3VtID0gc3VtIDwgMCA/IDAgOiBzdW1cbiAgc3VtID0gc3VtID4gMTAwID8gMTAwIDogc3VtXG5cbiAgaWYgKHN1bSA+PSA4MCkge1xuICAgIHJldHVybiAxMDBcbiAgfSBlbHNlIGlmIChzdW0gPj0gNjApIHtcbiAgICByZXR1cm4gODBcbiAgfSBlbHNlIGlmIChzdW0gPj0gNDApIHtcbiAgICByZXR1cm4gNjBcbiAgfSBlbHNlIGlmIChzdW0gPj0gMjApIHtcbiAgICByZXR1cm4gNDBcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gMjBcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgUGFzc3dvcmRTdHJlbmd0aDogUmVhY3QuRkM8SVBhc3N3b3JkU3RyZW5ndGhQcm9wcz4gPSBwcm9wcyA9PiB7XG4gIGlmIChpc0ZuKHByb3BzLmNoaWxkcmVuKSkge1xuICAgIHJldHVybiBwcm9wcy5jaGlsZHJlbihnZXRTdHJlbmd0aChTdHJpbmcocHJvcHMudmFsdWUpKSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gPEZyYWdtZW50Pntwcm9wcy5jaGlsZHJlbn08L0ZyYWdtZW50PlxuICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNi4xMicgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIElTX1dSQVAgPSB0eXBlICYgJGV4cG9ydC5XO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV07XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIga2V5LCBvd24sIG91dDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZiAob3duICYmIGhhcyhleHBvcnRzLCBrZXkpKSBjb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uIChDKSB7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgQykge1xuICAgICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEMoKTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYgKElTX1BST1RPKSB7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYgKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0pIGhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7IGRlZmluZVByb3BlcnR5OiByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mIH0pO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eScpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKSB7XG4gIHJldHVybiAkT2JqZWN0LmRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2MpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZVByb3BlcnR5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICgwLCBfZGVmaW5lUHJvcGVydHkyLmRlZmF1bHQpKHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDIwIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkb25lLCB2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZSB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG52YXIgRE9NSXRlcmFibGVzID0gKCdDU1NSdWxlTGlzdCxDU1NTdHlsZURlY2xhcmF0aW9uLENTU1ZhbHVlTGlzdCxDbGllbnRSZWN0TGlzdCxET01SZWN0TGlzdCxET01TdHJpbmdMaXN0LCcgK1xuICAnRE9NVG9rZW5MaXN0LERhdGFUcmFuc2Zlckl0ZW1MaXN0LEZpbGVMaXN0LEhUTUxBbGxDb2xsZWN0aW9uLEhUTUxDb2xsZWN0aW9uLEhUTUxGb3JtRWxlbWVudCxIVE1MU2VsZWN0RWxlbWVudCwnICtcbiAgJ01lZGlhTGlzdCxNaW1lVHlwZUFycmF5LE5hbWVkTm9kZU1hcCxOb2RlTGlzdCxQYWludFJlcXVlc3RMaXN0LFBsdWdpbixQbHVnaW5BcnJheSxTVkdMZW5ndGhMaXN0LFNWR051bWJlckxpc3QsJyArXG4gICdTVkdQYXRoU2VnTGlzdCxTVkdQb2ludExpc3QsU1ZHU3RyaW5nTGlzdCxTVkdUcmFuc2Zvcm1MaXN0LFNvdXJjZUJ1ZmZlckxpc3QsU3R5bGVTaGVldExpc3QsVGV4dFRyYWNrQ3VlTGlzdCwnICtcbiAgJ1RleHRUcmFja0xpc3QsVG91Y2hMaXN0Jykuc3BsaXQoJywnKTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBET01JdGVyYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgdmFyIE5BTUUgPSBET01JdGVyYWJsZXNbaV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZiAocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufVxuIiwiZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fd2tzJyk7XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL193a3MtZXh0JykuZignaXRlcmF0b3InKTtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJ2YXIgTUVUQSA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBzZXREZXNjID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBpZCA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBpc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbnZhciBzZXRNZXRhID0gZnVuY3Rpb24gKGl0KSB7XG4gIHNldERlc2MoaXQsIE1FVEEsIHsgdmFsdWU6IHtcbiAgICBpOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3OiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IH0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSkgc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6IE1FVEEsXG4gIE5FRUQ6IGZhbHNlLFxuICBmYXN0S2V5OiBmYXN0S2V5LFxuICBnZXRXZWFrOiBnZXRXZWFrLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyIHdrc0V4dCA9IHJlcXVpcmUoJy4vX3drcy1leHQnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciAkU3ltYm9sID0gY29yZS5TeW1ib2wgfHwgKGNvcmUuU3ltYm9sID0gTElCUkFSWSA/IHt9IDogZ2xvYmFsLlN5bWJvbCB8fCB7fSk7XG4gIGlmIChuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKSBkZWZpbmVQcm9wZXJ0eSgkU3ltYm9sLCBuYW1lLCB7IHZhbHVlOiB3a3NFeHQuZihuYW1lKSB9KTtcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCIvLyBhbGwgZW51bWVyYWJsZSBvYmplY3Qga2V5cywgaW5jbHVkZXMgc3ltYm9sc1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciByZXN1bHQgPSBnZXRLZXlzKGl0KTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIGlmIChnZXRTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KTtcbiAgICB2YXIgaXNFbnVtID0gcElFLmY7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKHN5bWJvbHMubGVuZ3RoID4gaSkgaWYgKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKSByZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07XG4iLCIvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICByZXR1cm4gJGtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuIiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBnT1BOID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mO1xudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgd2luZG93ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG4iLCJ2YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QRCA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBnT1BEKE8sIFApO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBNRVRBID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWTtcbnZhciAkZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciB3a3NFeHQgPSByZXF1aXJlKCcuL193a3MtZXh0Jyk7XG52YXIgd2tzRGVmaW5lID0gcmVxdWlyZSgnLi9fd2tzLWRlZmluZScpO1xudmFyIGVudW1LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1rZXlzJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzLWFycmF5Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBfY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGdPUE5FeHQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbi1leHQnKTtcbnZhciAkR09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJyk7XG52YXIgJEdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyICREUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BEID0gJEdPUEQuZjtcbnZhciBkUCA9ICREUC5mO1xudmFyIGdPUE4gPSBnT1BORXh0LmY7XG52YXIgJFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgJEpTT04gPSBnbG9iYWwuSlNPTjtcbnZhciBfc3RyaW5naWZ5ID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIEhJRERFTiA9IHdrcygnX2hpZGRlbicpO1xudmFyIFRPX1BSSU1JVElWRSA9IHdrcygndG9QcmltaXRpdmUnKTtcbnZhciBpc0VudW0gPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5Jyk7XG52YXIgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpO1xudmFyIE9QU3ltYm9scyA9IHNoYXJlZCgnb3Atc3ltYm9scycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0W1BST1RPVFlQRV07XG52YXIgVVNFX05BVElWRSA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbicgJiYgISEkR09QUy5mO1xudmFyIFFPYmplY3QgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gX2NyZWF0ZShkUCh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkUCh0aGlzLCAnYScsIHsgdmFsdWU6IDcgfSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbiAoaXQsIGtleSwgRCkge1xuICB2YXIgcHJvdG9EZXNjID0gZ09QRChPYmplY3RQcm90bywga2V5KTtcbiAgaWYgKHByb3RvRGVzYykgZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIGRQKGl0LCBrZXksIEQpO1xuICBpZiAocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bykgZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbiAodGFnKSB7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2xbUFJPVE9UWVBFXSk7XG4gIHN5bS5fayA9IHRhZztcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IFVTRV9OQVRJVkUgJiYgdHlwZW9mICRTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKSB7XG4gIGlmIChpdCA9PT0gT2JqZWN0UHJvdG8pICRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmIChoYXMoQWxsU3ltYm9scywga2V5KSkge1xuICAgIGlmICghRC5lbnVtZXJhYmxlKSB7XG4gICAgICBpZiAoIWhhcyhpdCwgSElEREVOKSkgZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pIGl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwgeyBlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKSB9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBkUChpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKSB7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbCA9IGtleXMubGVuZ3RoO1xuICB2YXIga2V5O1xuICB3aGlsZSAobCA+IGkpICRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApIHtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpIHtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV0gPyBFIDogdHJ1ZTtcbn07XG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gIGl0ID0gdG9JT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSkgcmV0dXJuO1xuICB2YXIgRCA9IGdPUEQoaXQsIGtleSk7XG4gIGlmIChEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpIEQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgdmFyIG5hbWVzID0gZ09QTih0b0lPYmplY3QoaXQpKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaSA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSB7XG4gICAgaWYgKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTiAmJiBrZXkgIT0gTUVUQSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSB7XG4gIHZhciBJU19PUCA9IGl0ID09PSBPYmplY3RQcm90bztcbiAgdmFyIG5hbWVzID0gZ09QTihJU19PUCA/IE9QU3ltYm9scyA6IHRvSU9iamVjdChpdCkpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIHtcbiAgICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKSByZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmICghVVNFX05BVElWRSkge1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCkgdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzID09PSBPYmplY3RQcm90bykgJHNldC5jYWxsKE9QU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYgKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpIHRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYgKERFU0NSSVBUT1JTICYmIHNldHRlcikgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0IH0pO1xuICAgIHJldHVybiB3cmFwKHRhZyk7XG4gIH07XG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFXSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gICRHT1BELmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkRFAuZiA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICAkR09QUy5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZiAoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vX2xpYnJhcnknKSkge1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG5cbiAgd2tzRXh0LmYgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiB3cmFwKHdrcyhuYW1lKSk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgU3ltYm9sOiAkU3ltYm9sIH0pO1xuXG5mb3IgKHZhciBlczZTeW1ib2xzID0gKFxuICAvLyAxOS40LjIuMiwgMTkuNC4yLjMsIDE5LjQuMi40LCAxOS40LjIuNiwgMTkuNC4yLjgsIDE5LjQuMi45LCAxOS40LjIuMTAsIDE5LjQuMi4xMSwgMTkuNC4yLjEyLCAxOS40LjIuMTMsIDE5LjQuMi4xNFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGogPSAwOyBlczZTeW1ib2xzLmxlbmd0aCA+IGo7KXdrcyhlczZTeW1ib2xzW2orK10pO1xuXG5mb3IgKHZhciB3ZWxsS25vd25TeW1ib2xzID0gJGtleXMod2tzLnN0b3JlKSwgayA9IDA7IHdlbGxLbm93blN5bWJvbHMubGVuZ3RoID4gazspIHdrc0RlZmluZSh3ZWxsS25vd25TeW1ib2xzW2srK10pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnU3ltYm9sJywge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKHN5bSkge1xuICAgIGlmICghaXNTeW1ib2woc3ltKSkgdGhyb3cgVHlwZUVycm9yKHN5bSArICcgaXMgbm90IGEgc3ltYm9sIScpO1xuICAgIGZvciAodmFyIGtleSBpbiBTeW1ib2xSZWdpc3RyeSkgaWYgKFN5bWJvbFJlZ2lzdHJ5W2tleV0gPT09IHN5bSkgcmV0dXJuIGtleTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbiAoKSB7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24gKCkgeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyBDaHJvbWUgMzggYW5kIDM5IGBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzYCBmYWlscyBvbiBwcmltaXRpdmVzXG4vLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zNDQzXG52YXIgRkFJTFNfT05fUFJJTUlUSVZFUyA9ICRmYWlscyhmdW5jdGlvbiAoKSB7ICRHT1BTLmYoMSk7IH0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIEZBSUxTX09OX1BSSU1JVElWRVMsICdPYmplY3QnLCB7XG4gIGdldE93blByb3BlcnR5U3ltYm9sczogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSB7XG4gICAgcmV0dXJuICRHT1BTLmYodG9PYmplY3QoaXQpKTtcbiAgfVxufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgJGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoeyBhOiBTIH0pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCkge1xuICAgIHZhciBhcmdzID0gW2l0XTtcbiAgICB2YXIgaSA9IDE7XG4gICAgdmFyIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgICRyZXBsYWNlciA9IHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZiAoIWlzT2JqZWN0KHJlcGxhY2VyKSAmJiBpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSkgcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgaWYgKCFpc0FycmF5KHJlcGxhY2VyKSkgcmVwbGFjZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiAkcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykgdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gICAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xuICB9XG59KTtcblxuLy8gMTkuNC4zLjQgU3ltYm9sLnByb3RvdHlwZVtAQHRvUHJpbWl0aXZlXShoaW50KVxuJFN5bWJvbFtQUk9UT1RZUEVdW1RPX1BSSU1JVElWRV0gfHwgcmVxdWlyZSgnLi9faGlkZScpKCRTeW1ib2xbUFJPVE9UWVBFXSwgVE9fUFJJTUlUSVZFLCAkU3ltYm9sW1BST1RPVFlQRV0udmFsdWVPZik7XG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpO1xuIiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdhc3luY0l0ZXJhdG9yJyk7XG4iLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ29ic2VydmFibGUnKTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wub2JzZXJ2YWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuU3ltYm9sO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2l0ZXJhdG9yID0gcmVxdWlyZShcIi4uL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yXCIpO1xuXG52YXIgX2l0ZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2l0ZXJhdG9yKTtcblxudmFyIF9zeW1ib2wgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9zeW1ib2xcIik7XG5cbnZhciBfc3ltYm9sMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N5bWJvbCk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgX2l0ZXJhdG9yMi5kZWZhdWx0ID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCAmJiBvYmogIT09IF9zeW1ib2wyLmRlZmF1bHQucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgX3R5cGVvZihfaXRlcmF0b3IyLmRlZmF1bHQpID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfc3ltYm9sMi5kZWZhdWx0ICYmIG9iaiAhPT0gX3N5bWJvbDIuZGVmYXVsdC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZjIgPSByZXF1aXJlKFwiLi4vaGVscGVycy90eXBlb2ZcIik7XG5cbnZhciBfdHlwZW9mMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3R5cGVvZjIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoc2VsZiwgY2FsbCkge1xuICBpZiAoIXNlbGYpIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gY2FsbCAmJiAoKHR5cGVvZiBjYWxsID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6ICgwLCBfdHlwZW9mMy5kZWZhdWx0KShjYWxsKSkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjtcbn07IiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uIChPLCBwcm90bykge1xuICBhbk9iamVjdChPKTtcbiAgaWYgKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpIHRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uICh0ZXN0LCBidWdneSwgc2V0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuL19jdHgnKShGdW5jdGlvbi5jYWxsLCByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmYoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaCAoZSkgeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90bykge1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmIChidWdneSkgTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59O1xuIiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHsgc2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldCB9KTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Quc2V0UHJvdG90eXBlT2Y7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHsgY3JlYXRlOiByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJykgfSk7XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlJyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKSB7XG4gIHJldHVybiAkT2JqZWN0LmNyZWF0ZShQLCBEKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3NldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIik7XG5cbnZhciBfc2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NyZWF0ZSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9jcmVhdGVcIik7XG5cbnZhciBfY3JlYXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZSk7XG5cbnZhciBfdHlwZW9mMiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIF90eXBlb2YzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHlwZW9mMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyAodHlwZW9mIHN1cGVyQ2xhc3MgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogKDAsIF90eXBlb2YzLmRlZmF1bHQpKHN1cGVyQ2xhc3MpKSk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSAoMCwgX2NyZWF0ZTIuZGVmYXVsdCkoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZjIuZGVmYXVsdCA/ICgwLCBfc2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59OyIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MTYuMTMuMVxuICogcmVhY3QtaXMucHJvZHVjdGlvbi5taW4uanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7dmFyIGI9XCJmdW5jdGlvblwiPT09dHlwZW9mIFN5bWJvbCYmU3ltYm9sLmZvcixjPWI/U3ltYm9sLmZvcihcInJlYWN0LmVsZW1lbnRcIik6NjAxMDMsZD1iP1N5bWJvbC5mb3IoXCJyZWFjdC5wb3J0YWxcIik6NjAxMDYsZT1iP1N5bWJvbC5mb3IoXCJyZWFjdC5mcmFnbWVudFwiKTo2MDEwNyxmPWI/U3ltYm9sLmZvcihcInJlYWN0LnN0cmljdF9tb2RlXCIpOjYwMTA4LGc9Yj9TeW1ib2wuZm9yKFwicmVhY3QucHJvZmlsZXJcIik6NjAxMTQsaD1iP1N5bWJvbC5mb3IoXCJyZWFjdC5wcm92aWRlclwiKTo2MDEwOSxrPWI/U3ltYm9sLmZvcihcInJlYWN0LmNvbnRleHRcIik6NjAxMTAsbD1iP1N5bWJvbC5mb3IoXCJyZWFjdC5hc3luY19tb2RlXCIpOjYwMTExLG09Yj9TeW1ib2wuZm9yKFwicmVhY3QuY29uY3VycmVudF9tb2RlXCIpOjYwMTExLG49Yj9TeW1ib2wuZm9yKFwicmVhY3QuZm9yd2FyZF9yZWZcIik6NjAxMTIscD1iP1N5bWJvbC5mb3IoXCJyZWFjdC5zdXNwZW5zZVwiKTo2MDExMyxxPWI/XG5TeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VfbGlzdFwiKTo2MDEyMCxyPWI/U3ltYm9sLmZvcihcInJlYWN0Lm1lbW9cIik6NjAxMTUsdD1iP1N5bWJvbC5mb3IoXCJyZWFjdC5sYXp5XCIpOjYwMTE2LHY9Yj9TeW1ib2wuZm9yKFwicmVhY3QuYmxvY2tcIik6NjAxMjEsdz1iP1N5bWJvbC5mb3IoXCJyZWFjdC5mdW5kYW1lbnRhbFwiKTo2MDExNyx4PWI/U3ltYm9sLmZvcihcInJlYWN0LnJlc3BvbmRlclwiKTo2MDExOCx5PWI/U3ltYm9sLmZvcihcInJlYWN0LnNjb3BlXCIpOjYwMTE5O1xuZnVuY3Rpb24geihhKXtpZihcIm9iamVjdFwiPT09dHlwZW9mIGEmJm51bGwhPT1hKXt2YXIgdT1hLiQkdHlwZW9mO3N3aXRjaCh1KXtjYXNlIGM6c3dpdGNoKGE9YS50eXBlLGEpe2Nhc2UgbDpjYXNlIG06Y2FzZSBlOmNhc2UgZzpjYXNlIGY6Y2FzZSBwOnJldHVybiBhO2RlZmF1bHQ6c3dpdGNoKGE9YSYmYS4kJHR5cGVvZixhKXtjYXNlIGs6Y2FzZSBuOmNhc2UgdDpjYXNlIHI6Y2FzZSBoOnJldHVybiBhO2RlZmF1bHQ6cmV0dXJuIHV9fWNhc2UgZDpyZXR1cm4gdX19fWZ1bmN0aW9uIEEoYSl7cmV0dXJuIHooYSk9PT1tfWV4cG9ydHMuQXN5bmNNb2RlPWw7ZXhwb3J0cy5Db25jdXJyZW50TW9kZT1tO2V4cG9ydHMuQ29udGV4dENvbnN1bWVyPWs7ZXhwb3J0cy5Db250ZXh0UHJvdmlkZXI9aDtleHBvcnRzLkVsZW1lbnQ9YztleHBvcnRzLkZvcndhcmRSZWY9bjtleHBvcnRzLkZyYWdtZW50PWU7ZXhwb3J0cy5MYXp5PXQ7ZXhwb3J0cy5NZW1vPXI7ZXhwb3J0cy5Qb3J0YWw9ZDtcbmV4cG9ydHMuUHJvZmlsZXI9ZztleHBvcnRzLlN0cmljdE1vZGU9ZjtleHBvcnRzLlN1c3BlbnNlPXA7ZXhwb3J0cy5pc0FzeW5jTW9kZT1mdW5jdGlvbihhKXtyZXR1cm4gQShhKXx8eihhKT09PWx9O2V4cG9ydHMuaXNDb25jdXJyZW50TW9kZT1BO2V4cG9ydHMuaXNDb250ZXh0Q29uc3VtZXI9ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT1rfTtleHBvcnRzLmlzQ29udGV4dFByb3ZpZGVyPWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09aH07ZXhwb3J0cy5pc0VsZW1lbnQ9ZnVuY3Rpb24oYSl7cmV0dXJuXCJvYmplY3RcIj09PXR5cGVvZiBhJiZudWxsIT09YSYmYS4kJHR5cGVvZj09PWN9O2V4cG9ydHMuaXNGb3J3YXJkUmVmPWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09bn07ZXhwb3J0cy5pc0ZyYWdtZW50PWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09ZX07ZXhwb3J0cy5pc0xhenk9ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT10fTtcbmV4cG9ydHMuaXNNZW1vPWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09cn07ZXhwb3J0cy5pc1BvcnRhbD1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PWR9O2V4cG9ydHMuaXNQcm9maWxlcj1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PWd9O2V4cG9ydHMuaXNTdHJpY3RNb2RlPWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09Zn07ZXhwb3J0cy5pc1N1c3BlbnNlPWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09cH07XG5leHBvcnRzLmlzVmFsaWRFbGVtZW50VHlwZT1mdW5jdGlvbihhKXtyZXR1cm5cInN0cmluZ1wiPT09dHlwZW9mIGF8fFwiZnVuY3Rpb25cIj09PXR5cGVvZiBhfHxhPT09ZXx8YT09PW18fGE9PT1nfHxhPT09Znx8YT09PXB8fGE9PT1xfHxcIm9iamVjdFwiPT09dHlwZW9mIGEmJm51bGwhPT1hJiYoYS4kJHR5cGVvZj09PXR8fGEuJCR0eXBlb2Y9PT1yfHxhLiQkdHlwZW9mPT09aHx8YS4kJHR5cGVvZj09PWt8fGEuJCR0eXBlb2Y9PT1ufHxhLiQkdHlwZW9mPT09d3x8YS4kJHR5cGVvZj09PXh8fGEuJCR0eXBlb2Y9PT15fHxhLiQkdHlwZW9mPT09dil9O2V4cG9ydHMudHlwZU9mPXo7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9ICdTRUNSRVRfRE9fTk9UX1BBU1NfVEhJU19PUl9ZT1VfV0lMTF9CRV9GSVJFRCc7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZXNTZWNyZXQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0SXMgPSByZXF1aXJlKCdyZWFjdC1pcycpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbnZhciBjaGVja1Byb3BUeXBlcyA9IHJlcXVpcmUoJy4vY2hlY2tQcm9wVHlwZXMnKTtcblxudmFyIGhhcyA9IEZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbnZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbigpIHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBwcmludFdhcm5pbmcgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgdmFyIG1lc3NhZ2UgPSAnV2FybmluZzogJyArIHRleHQ7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgIC8vIFRoaXMgZXJyb3Igd2FzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHRoYXQgeW91IGNhbiB1c2UgdGhpcyBzdGFja1xuICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfSBjYXRjaCAoeCkge31cbiAgfTtcbn1cblxuZnVuY3Rpb24gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXNWYWxpZEVsZW1lbnQsIHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuICB2YXIgSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG4gIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJzsgLy8gQmVmb3JlIFN5bWJvbCBzcGVjLlxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpdGVyYXRvciBtZXRob2QgZnVuY3Rpb24gY29udGFpbmVkIG9uIHRoZSBpdGVyYWJsZSBvYmplY3QuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICAgKlxuICAgKiAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG15SXRlcmFibGUpO1xuICAgKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICogICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG15SXRlcmFibGUpO1xuICAgKiAgICAgICAuLi5cbiAgICogICAgIH1cbiAgICpcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBtYXliZUl0ZXJhYmxlXG4gICAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAgICogc3VwcGxpZWQgdG8gUmVhY3QgY29tcG9uZW50cy4gRXhhbXBsZSB1c2FnZTpcbiAgICpcbiAgICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICAgKiAgIHZhciBNeUFydGljbGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAqICAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICAgKiAgICAgICBkZXNjcmlwdGlvbjogUHJvcHMuc3RyaW5nLFxuICAgKlxuICAgKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gICAqICAgICAgIGNhdGVnb3J5OiBQcm9wcy5vbmVPZihbJ05ld3MnLCdQaG90b3MnXSkuaXNSZXF1aXJlZCxcbiAgICpcbiAgICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gICAqICAgICAgIGRpYWxvZzogUHJvcHMuaW5zdGFuY2VPZihEaWFsb2cpLmlzUmVxdWlyZWRcbiAgICogICAgIH0sXG4gICAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICAgKiAgIH0pO1xuICAgKlxuICAgKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gICAqXG4gICAqICAgdHlwZSA6PSBhcnJheXxib29sfGZ1bmN8b2JqZWN0fG51bWJlcnxzdHJpbmd8b25lT2YoWy4uLl0pfGluc3RhbmNlT2YoLi4uKVxuICAgKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAgICpcbiAgICogRWFjaCBhbmQgZXZlcnkgZGVjbGFyYXRpb24gcHJvZHVjZXMgYSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZS4gVGhpc1xuICAgKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqICB2YXIgTXlMaW5rID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICBwcm9wVHlwZXM6IHtcbiAgICogICAgICAvLyBBbiBvcHRpb25hbCBzdHJpbmcgb3IgVVJJIHByb3AgbmFtZWQgXCJocmVmXCIuXG4gICAqICAgICAgaHJlZjogZnVuY3Rpb24ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lKSB7XG4gICAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgKiAgICAgICAgaWYgKHByb3BWYWx1ZSAhPSBudWxsICYmIHR5cGVvZiBwcm9wVmFsdWUgIT09ICdzdHJpbmcnICYmXG4gICAqICAgICAgICAgICAgIShwcm9wVmFsdWUgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gICAqICAgICAgICAgICAgJ0V4cGVjdGVkIGEgc3RyaW5nIG9yIGFuIFVSSSBmb3IgJyArIHByb3BOYW1lICsgJyBpbiAnICtcbiAgICogICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAqICAgICAgICAgICk7XG4gICAqICAgICAgICB9XG4gICAqICAgICAgfVxuICAgKiAgICB9LFxuICAgKiAgICByZW5kZXI6IGZ1bmN0aW9uKCkgey4uLn1cbiAgICogIH0pO1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG5cbiAgdmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxuICAvLyBJbXBvcnRhbnQhXG4gIC8vIEtlZXAgdGhpcyBsaXN0IGluIHN5bmMgd2l0aCBwcm9kdWN0aW9uIHZlcnNpb24gaW4gYC4vZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYXJyYXknKSxcbiAgICBib29sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignYm9vbGVhbicpLFxuICAgIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICAgIG51bWJlcjogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ251bWJlcicpLFxuICAgIG9iamVjdDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ29iamVjdCcpLFxuICAgIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICAgIHN5bWJvbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N5bWJvbCcpLFxuXG4gICAgYW55OiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpLFxuICAgIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgICBlbGVtZW50OiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSxcbiAgICBlbGVtZW50VHlwZTogY3JlYXRlRWxlbWVudFR5cGVUeXBlQ2hlY2tlcigpLFxuICAgIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcixcbiAgICBleGFjdDogY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcixcbiAgfTtcblxuICAvKipcbiAgICogaW5saW5lZCBPYmplY3QuaXMgcG9seWZpbGwgdG8gYXZvaWQgcmVxdWlyaW5nIGNvbnN1bWVycyBzaGlwIHRoZWlyIG93blxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbiAgICovXG4gIC8qZXNsaW50LWRpc2FibGUgbm8tc2VsZi1jb21wYXJlKi9cbiAgZnVuY3Rpb24gaXMoeCwgeSkge1xuICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9XG4gIH1cbiAgLyplc2xpbnQtZW5hYmxlIG5vLXNlbGYtY29tcGFyZSovXG5cbiAgLyoqXG4gICAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAgICogUHJvcFR5cGVzIGRpcmVjdGx5IGFuZCBpbnNwZWN0IHRoZWlyIG91dHB1dC4gSG93ZXZlciwgd2UgZG9uJ3QgdXNlIHJlYWxcbiAgICogRXJyb3JzIGFueW1vcmUuIFdlIGRvbid0IGluc3BlY3QgdGhlaXIgc3RhY2sgYW55d2F5LCBhbmQgY3JlYXRpbmcgdGhlbVxuICAgKiBpcyBwcm9oaWJpdGl2ZWx5IGV4cGVuc2l2ZSBpZiB0aGV5IGFyZSBjcmVhdGVkIHRvbyBvZnRlbiwgc3VjaCBhcyB3aGF0XG4gICAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAgICovXG4gIGZ1bmN0aW9uIFByb3BUeXBlRXJyb3IobWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5zdGFjayA9ICcnO1xuICB9XG4gIC8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cbiAgUHJvcFR5cGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlID0ge307XG4gICAgICB2YXIgbWFudWFsUHJvcFR5cGVXYXJuaW5nQ291bnQgPSAwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGVja1R5cGUoaXNSZXF1aXJlZCwgcHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHByb3BGdWxsTmFtZSA9IHByb3BGdWxsTmFtZSB8fCBwcm9wTmFtZTtcblxuICAgICAgaWYgKHNlY3JldCAhPT0gUmVhY3RQcm9wVHlwZXNTZWNyZXQpIHtcbiAgICAgICAgaWYgKHRocm93T25EaXJlY3RBY2Nlc3MpIHtcbiAgICAgICAgICAvLyBOZXcgYmVoYXZpb3Igb25seSBmb3IgdXNlcnMgb2YgYHByb3AtdHlwZXNgIHBhY2thZ2VcbiAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFxuICAgICAgICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgICAgICAgJ1VzZSBgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKClgIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAgICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICAgICAgICApO1xuICAgICAgICAgIGVyci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIE9sZCBiZWhhdmlvciBmb3IgcGVvcGxlIHVzaW5nIFJlYWN0LlByb3BUeXBlc1xuICAgICAgICAgIHZhciBjYWNoZUtleSA9IGNvbXBvbmVudE5hbWUgKyAnOicgKyBwcm9wTmFtZTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldICYmXG4gICAgICAgICAgICAvLyBBdm9pZCBzcGFtbWluZyB0aGUgY29uc29sZSBiZWNhdXNlIHRoZXkgYXJlIG9mdGVuIG5vdCBhY3Rpb25hYmxlIGV4Y2VwdCBmb3IgbGliIGF1dGhvcnNcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50IDwgM1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgICAnWW91IGFyZSBtYW51YWxseSBjYWxsaW5nIGEgUmVhY3QuUHJvcFR5cGVzIHZhbGlkYXRpb24gJyArXG4gICAgICAgICAgICAgICdmdW5jdGlvbiBmb3IgdGhlIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgcHJvcCBvbiBgJyArIGNvbXBvbmVudE5hbWUgICsgJ2AuIFRoaXMgaXMgZGVwcmVjYXRlZCAnICtcbiAgICAgICAgICAgICAgJ2FuZCB3aWxsIHRocm93IGluIHRoZSBzdGFuZGFsb25lIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICAgJ1lvdSBtYXkgYmUgc2VlaW5nIHRoaXMgd2FybmluZyBkdWUgdG8gYSB0aGlyZC1wYXJ0eSBQcm9wVHlwZXMgJyArXG4gICAgICAgICAgICAgICdsaWJyYXJ5LiBTZWUgaHR0cHM6Ly9mYi5tZS9yZWFjdC13YXJuaW5nLWRvbnQtY2FsbC1wcm9wdHlwZXMgJyArICdmb3IgZGV0YWlscy4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50Kys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkICcgKyAoJ2luIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGBudWxsYC4nKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgaW4gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYHVuZGVmaW5lZGAuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNoYWluZWRDaGVja1R5cGUgPSBjaGVja1R5cGUuYmluZChudWxsLCBmYWxzZSk7XG4gICAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgIC8vIGBwcm9wVmFsdWVgIGJlaW5nIGluc3RhbmNlIG9mLCBzYXksIGRhdGUvcmVnZXhwLCBwYXNzIHRoZSAnb2JqZWN0J1xuICAgICAgICAvLyBjaGVjaywgYnV0IHdlIGNhbiBvZmZlciBhIG1vcmUgcHJlY2lzZSBlcnJvciBtZXNzYWdlIGhlcmUgcmF0aGVyIHRoYW5cbiAgICAgICAgLy8gJ29mIHR5cGUgYG9iamVjdGAnLlxuICAgICAgICB2YXIgcHJlY2lzZVR5cGUgPSBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByZWNpc2VUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdgJyArIGV4cGVjdGVkVHlwZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQW55VHlwZUNoZWNrZXIoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHR5cGVDaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIGFycmF5T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gYXJyYXkuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wVmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBpLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJ1snICsgaSArICddJywgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnRUeXBlVHlwZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFSZWFjdElzLmlzVmFsaWRFbGVtZW50VHlwZShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudCB0eXBlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIShwcm9wc1twcm9wTmFtZV0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRDbGFzc05hbWUgPSBleHBlY3RlZENsYXNzLm5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgICB2YXIgYWN0dWFsQ2xhc3NOYW1lID0gZ2V0Q2xhc3NOYW1lKHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICAgJ0ludmFsaWQgYXJndW1lbnRzIHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBhcnJheSwgZ290ICcgKyBhcmd1bWVudHMubGVuZ3RoICsgJyBhcmd1bWVudHMuICcgK1xuICAgICAgICAgICAgJ0EgY29tbW9uIG1pc3Rha2UgaXMgdG8gd3JpdGUgb25lT2YoeCwgeSwgeikgaW5zdGVhZCBvZiBvbmVPZihbeCwgeSwgel0pLidcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByaW50V2FybmluZygnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gYXJyYXkuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwZWN0ZWRWYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGlzKHByb3BWYWx1ZSwgZXhwZWN0ZWRWYWx1ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlc1N0cmluZyA9IEpTT04uc3RyaW5naWZ5KGV4cGVjdGVkVmFsdWVzLCBmdW5jdGlvbiByZXBsYWNlcihrZXksIHZhbHVlKSB7XG4gICAgICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBTdHJpbmcocHJvcFZhbHVlKSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBvbmUgb2YgJyArIHZhbHVlc1N0cmluZyArICcuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBvYmplY3RPZi4nKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHByb3BWYWx1ZSkge1xuICAgICAgICBpZiAoaGFzKHByb3BWYWx1ZSwga2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5T2ZUeXBlQ2hlY2tlcnMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gcHJpbnRXYXJuaW5nKCdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZSwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJykgOiB2b2lkIDA7XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgIGlmICh0eXBlb2YgY2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcmludFdhcm5pbmcoXG4gICAgICAgICAgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLiBFeHBlY3RlZCBhbiBhcnJheSBvZiBjaGVjayBmdW5jdGlvbnMsIGJ1dCAnICtcbiAgICAgICAgICAncmVjZWl2ZWQgJyArIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyhjaGVja2VyKSArICcgYXQgaW5kZXggJyArIGkgKyAnLidcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5T2ZUeXBlQ2hlY2tlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgICBpZiAoY2hlY2tlcihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBSZWFjdE5vZGUuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyKHNoYXBlVHlwZXMpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gc2hhcGVUeXBlcykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU3RyaWN0U2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgLy8gV2UgbmVlZCB0byBjaGVjayBhbGwga2V5cyBpbiBjYXNlIHNvbWUgYXJlIHJlcXVpcmVkIGJ1dCBtaXNzaW5nIGZyb21cbiAgICAgIC8vIHByb3BzLlxuICAgICAgdmFyIGFsbEtleXMgPSBhc3NpZ24oe30sIHByb3BzW3Byb3BOYW1lXSwgc2hhcGVUeXBlcyk7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYWxsS2V5cykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgICAgaWYgKCFjaGVja2VyKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKFxuICAgICAgICAgICAgJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGtleSBgJyArIGtleSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLicgK1xuICAgICAgICAgICAgJ1xcbkJhZCBvYmplY3Q6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wc1twcm9wTmFtZV0sIG51bGwsICcgICcpICtcbiAgICAgICAgICAgICdcXG5WYWxpZCBrZXlzOiAnICsgIEpTT04uc3RyaW5naWZ5KE9iamVjdC5rZXlzKHNoYXBlVHlwZXMpLCBudWxsLCAnICAnKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVycm9yID0gY2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IGlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICAgIHZhciBzdGVwO1xuICAgICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBwcm9wVmFsdWUuZW50cmllcykge1xuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICAvLyBOYXRpdmUgU3ltYm9sLlxuICAgIGlmIChwcm9wVHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIGZhbHN5IHZhbHVlIGNhbid0IGJlIGEgU3ltYm9sXG4gICAgaWYgKCFwcm9wVmFsdWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICAgIGlmIChwcm9wVmFsdWVbJ0BAdG9TdHJpbmdUYWcnXSA9PT0gJ1N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIGZvciBub24tc3BlYyBjb21wbGlhbnQgU3ltYm9scyB3aGljaCBhcmUgcG9seWZpbGxlZC5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEVxdWl2YWxlbnQgb2YgYHR5cGVvZmAgYnV0IHdpdGggc3BlY2lhbCBoYW5kbGluZyBmb3IgYXJyYXkgYW5kIHJlZ2V4cC5cbiAgZnVuY3Rpb24gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKSB7XG4gICAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ2FycmF5JztcbiAgICB9XG4gICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgLy8gT2xkIHdlYmtpdHMgKGF0IGxlYXN0IHVudGlsIEFuZHJvaWQgNC4wKSByZXR1cm4gJ2Z1bmN0aW9uJyByYXRoZXIgdGhhblxuICAgICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgICAvLyBwYXNzZXMgUHJvcFR5cGVzLm9iamVjdC5cbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbiAgLy8gU2VlIGBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcmAuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIGlmICh0eXBlb2YgcHJvcFZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBwcm9wVmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiAnJyArIHByb3BWYWx1ZTtcbiAgICB9XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICByZXR1cm4gJ2RhdGUnO1xuICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgcG9zdGZpeGVkIHRvIGEgd2FybmluZyBhYm91dCBhbiBpbnZhbGlkIHR5cGUuXG4gIC8vIEZvciBleGFtcGxlLCBcInVuZGVmaW5lZFwiIG9yIFwib2YgdHlwZSBhcnJheVwiXG4gIGZ1bmN0aW9uIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyh2YWx1ZSkge1xuICAgIHZhciB0eXBlID0gZ2V0UHJlY2lzZVR5cGUodmFsdWUpO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgcmV0dXJuICdhbiAnICsgdHlwZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICByZXR1cm4gJ2EgJyArIHR5cGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIGNsYXNzIG5hbWUgb2YgdGhlIG9iamVjdCwgaWYgYW55LlxuICBmdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gICAgaWYgKCFwcm9wVmFsdWUuY29uc3RydWN0b3IgfHwgIXByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICByZXR1cm4gQU5PTllNT1VTO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBSZWFjdFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcyA9IGNoZWNrUHJvcFR5cGVzO1xuICBSZWFjdFByb3BUeXBlcy5yZXNldFdhcm5pbmdDYWNoZSA9IGNoZWNrUHJvcFR5cGVzLnJlc2V0V2FybmluZ0NhY2hlO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG5cbmZ1bmN0aW9uIGVtcHR5RnVuY3Rpb24oKSB7fVxuZnVuY3Rpb24gZW1wdHlGdW5jdGlvbldpdGhSZXNldCgpIHt9XG5lbXB0eUZ1bmN0aW9uV2l0aFJlc2V0LnJlc2V0V2FybmluZ0NhY2hlID0gZW1wdHlGdW5jdGlvbjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gc2hpbShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgIGlmIChzZWNyZXQgPT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAvLyBJdCBpcyBzdGlsbCBzYWZlIHdoZW4gY2FsbGVkIGZyb20gUmVhY3QuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXG4gICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAnVXNlIFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpIHRvIGNhbGwgdGhlbS4gJyArXG4gICAgICAnUmVhZCBtb3JlIGF0IGh0dHA6Ly9mYi5tZS91c2UtY2hlY2stcHJvcC10eXBlcydcbiAgICApO1xuICAgIGVyci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIHRocm93IGVycjtcbiAgfTtcbiAgc2hpbS5pc1JlcXVpcmVkID0gc2hpbTtcbiAgZnVuY3Rpb24gZ2V0U2hpbSgpIHtcbiAgICByZXR1cm4gc2hpbTtcbiAgfTtcbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzYC5cbiAgdmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICAgIGFycmF5OiBzaGltLFxuICAgIGJvb2w6IHNoaW0sXG4gICAgZnVuYzogc2hpbSxcbiAgICBudW1iZXI6IHNoaW0sXG4gICAgb2JqZWN0OiBzaGltLFxuICAgIHN0cmluZzogc2hpbSxcbiAgICBzeW1ib2w6IHNoaW0sXG5cbiAgICBhbnk6IHNoaW0sXG4gICAgYXJyYXlPZjogZ2V0U2hpbSxcbiAgICBlbGVtZW50OiBzaGltLFxuICAgIGVsZW1lbnRUeXBlOiBzaGltLFxuICAgIGluc3RhbmNlT2Y6IGdldFNoaW0sXG4gICAgbm9kZTogc2hpbSxcbiAgICBvYmplY3RPZjogZ2V0U2hpbSxcbiAgICBvbmVPZjogZ2V0U2hpbSxcbiAgICBvbmVPZlR5cGU6IGdldFNoaW0sXG4gICAgc2hhcGU6IGdldFNoaW0sXG4gICAgZXhhY3Q6IGdldFNoaW0sXG5cbiAgICBjaGVja1Byb3BUeXBlczogZW1wdHlGdW5jdGlvbldpdGhSZXNldCxcbiAgICByZXNldFdhcm5pbmdDYWNoZTogZW1wdHlGdW5jdGlvblxuICB9O1xuXG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdElzID0gcmVxdWlyZSgncmVhY3QtaXMnKTtcblxuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBkZXZlbG9wbWVudCBiZWhhdmlvci5cbiAgLy8gaHR0cDovL2ZiLm1lL3Byb3AtdHlwZXMtaW4tcHJvZFxuICB2YXIgdGhyb3dPbkRpcmVjdEFjY2VzcyA9IHRydWU7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFR5cGVDaGVja2VycycpKFJlYWN0SXMuaXNFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKTtcbn0gZWxzZSB7XG4gIC8vIEJ5IGV4cGxpY2l0bHkgdXNpbmcgYHByb3AtdHlwZXNgIHlvdSBhcmUgb3B0aW5nIGludG8gbmV3IHByb2R1Y3Rpb24gYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcycpKCk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG4vKiBnbG9iYWwgRWxlbWVudCAqL1xuXG5pZiAodHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmICFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gIHZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xuICBwcm90by5tYXRjaGVzID0gcHJvdG8ubWF0Y2hlc1NlbGVjdG9yIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvciB8fCBwcm90by5vTWF0Y2hlc1NlbGVjdG9yIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3Rvcjtcbn1cblxudmFyIGNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0KGVsLCBzZWxlY3Rvciwgcm9vdE5vZGUpIHtcbiAgdmFyIGVsZW1lbnQgPSBlbDtcbiAgd2hpbGUgKGVsZW1lbnQpIHtcbiAgICB2YXIgaXNSb290ID0gZWxlbWVudCA9PT0gcm9vdE5vZGUgfHwgZWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keTtcbiAgICBpZiAoaXNSb290IHx8IGVsZW1lbnQubm9kZVR5cGUgPT09IDEgJiYgZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuICAgICAgaWYgKGlzUm9vdCkge1xuICAgICAgICBlbGVtZW50ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICB9XG4gIHJldHVybiBlbGVtZW50O1xufTtcblxudmFyIGdldFNjcm9sbEVsZW1lbnQgPSBmdW5jdGlvbiBnZXRTY3JvbGxFbGVtZW50KGVsKSB7XG4gIHZhciBlbGVtZW50ID0gZWw7XG4gIGRvIHtcbiAgICB2YXIgX3dpbmRvdyRnZXRDb21wdXRlZFN0ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCksXG4gICAgICAgIG92ZXJmbG93ID0gX3dpbmRvdyRnZXRDb21wdXRlZFN0Lm92ZXJmbG93O1xuXG4gICAgaWYgKChvdmVyZmxvdyA9PT0gJ2F1dG8nIHx8IG92ZXJmbG93ID09PSAnc2Nyb2xsJykgJiYgZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlICYmIChlbGVtZW50Lm9mZnNldFdpZHRoIDwgZWxlbWVudC5zY3JvbGxXaWR0aCB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA8IGVsZW1lbnQuc2Nyb2xsSGVpZ2h0KSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICghZWxlbWVudCB8fCAhZWxlbWVudC5ub2RlVHlwZSB8fCBlbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICBlbGVtZW50ID0gbnVsbDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICB9IHdoaWxlIChlbGVtZW50KTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuXG52YXIgZ2V0RG9tSW5kZXggPSBmdW5jdGlvbiBnZXREb21JbmRleChlbCwgaWdub3JlU2VsZWN0b3JzKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKGVsLnBhcmVudE5vZGUuY2hpbGRyZW4pLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuICAgIHJldHVybiBpZ25vcmVTZWxlY3RvcnMgPT09ICcnID8gdHJ1ZSA6ICFlLm1hdGNoZXMoaWdub3JlU2VsZWN0b3JzKTtcbiAgfSkuaW5kZXhPZihlbCk7XG59O1xuXG5leHBvcnRzLmdldFNjcm9sbEVsZW1lbnQgPSBnZXRTY3JvbGxFbGVtZW50O1xuZXhwb3J0cy5jbG9zZXN0ID0gY2xvc2VzdDtcbmV4cG9ydHMuZ2V0RG9tSW5kZXggPSBnZXREb21JbmRleDsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcHJvcFR5cGVzID0gcmVxdWlyZSgncHJvcC10eXBlcycpO1xuXG52YXIgX3Byb3BUeXBlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9wVHlwZXMpO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgREVGQVVMVF9OT0RFX1NFTEVDVE9SID0gJ3RyJztcbnZhciBESVJFQ1RJT05TID0ge1xuICBUT1A6IDEsXG4gIEJPVFRPTTogM1xufTtcbnZhciBVTklUX1BYID0gJ3B4JztcbnZhciBEUkFHX0xJTkRfU1RZTEUgPSAncG9zaXRpb246Zml4ZWQ7ei1pbmRleDo5OTk5O2hlaWdodDowOycgKyAnbWFyZ2luLXRvcDotMXB4O2JvcmRlci1ib3R0b206ZGFzaGVkIDJweCByZWQ7ZGlzcGxheTpub25lOyc7XG5cbnZhciBSZWFjdERyYWdMaXN0VmlldyA9IGZ1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gICgwLCBfaW5oZXJpdHMzWydkZWZhdWx0J10pKFJlYWN0RHJhZ0xpc3RWaWV3LCBfQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBSZWFjdERyYWdMaXN0Vmlldyhwcm9wcykge1xuICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szWydkZWZhdWx0J10pKHRoaXMsIFJlYWN0RHJhZ0xpc3RWaWV3KTtcblxuICAgIHZhciBfdGhpcyA9ICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjNbJ2RlZmF1bHQnXSkodGhpcywgKFJlYWN0RHJhZ0xpc3RWaWV3Ll9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoUmVhY3REcmFnTGlzdFZpZXcpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICBfdGhpcy5vbk1vdXNlRG93biA9IF90aGlzLm9uTW91c2VEb3duLmJpbmQoX3RoaXMpO1xuICAgIF90aGlzLm9uRHJhZ1N0YXJ0ID0gX3RoaXMub25EcmFnU3RhcnQuYmluZChfdGhpcyk7XG4gICAgX3RoaXMub25EcmFnRW50ZXIgPSBfdGhpcy5vbkRyYWdFbnRlci5iaW5kKF90aGlzKTtcbiAgICBfdGhpcy5vbkRyYWdFbmQgPSBfdGhpcy5vbkRyYWdFbmQuYmluZChfdGhpcyk7XG4gICAgX3RoaXMuYXV0b1Njcm9sbCA9IF90aGlzLmF1dG9TY3JvbGwuYmluZChfdGhpcyk7XG5cbiAgICBfdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZyb21JbmRleDogLTEsXG4gICAgICB0b0luZGV4OiAtMVxuICAgIH07XG5cbiAgICBfdGhpcy5zY3JvbGxFbGVtZW50ID0gbnVsbDtcbiAgICBfdGhpcy5zY3JvbGxUaW1lcklkID0gLTE7XG4gICAgX3RoaXMuZGlyZWN0aW9uID0gRElSRUNUSU9OUy5CT1RUT007XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgKDAsIF9jcmVhdGVDbGFzczNbJ2RlZmF1bHQnXSkoUmVhY3REcmFnTGlzdFZpZXcsIFt7XG4gICAga2V5OiAnY29tcG9uZW50V2lsbFVubW91bnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIGlmICh0aGlzLmRyYWdMaW5lICYmIHRoaXMuZHJhZ0xpbmUucGFyZW50Tm9kZSkge1xuICAgICAgICB0aGlzLmRyYWdMaW5lLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5kcmFnTGluZSk7XG4gICAgICAgIHRoaXMuZHJhZ0xpbmUgPSBudWxsO1xuICAgICAgICB0aGlzLmNhY2hlRHJhZ1RhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25Nb3VzZURvd24nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbk1vdXNlRG93bihlKSB7XG4gICAgICB2YXIgaGFuZGxlID0gdGhpcy5nZXRIYW5kbGVOb2RlKGUudGFyZ2V0KTtcbiAgICAgIGlmIChoYW5kbGUpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9ICF0aGlzLnByb3BzLmhhbmRsZVNlbGVjdG9yIHx8IHRoaXMucHJvcHMuaGFuZGxlU2VsZWN0b3IgPT09IHRoaXMucHJvcHMubm9kZVNlbGVjdG9yID8gaGFuZGxlIDogdGhpcy5nZXREcmFnTm9kZShoYW5kbGUpO1xuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgaGFuZGxlLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgZmFsc2UpO1xuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIHRydWUpO1xuICAgICAgICAgIHRhcmdldC5vbmRyYWdzdGFydCA9IHRoaXMub25EcmFnU3RhcnQ7XG4gICAgICAgICAgdGFyZ2V0Lm9uZHJhZ2VuZCA9IHRoaXMub25EcmFnRW5kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25EcmFnU3RhcnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbkRyYWdTdGFydChlKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXREcmFnTm9kZShlLnRhcmdldCk7XG4gICAgICB2YXIgZXZlbnREYXRhID0gZTtcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgdmFyIHBhcmVudE5vZGUgPSB0YXJnZXQucGFyZW50Tm9kZTtcblxuICAgICAgICBldmVudERhdGEuZGF0YVRyYW5zZmVyLnNldERhdGEoJ1RleHQnLCAnJyk7XG4gICAgICAgIGV2ZW50RGF0YS5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9ICdtb3ZlJztcbiAgICAgICAgcGFyZW50Tm9kZS5vbmRyYWdlbnRlciA9IHRoaXMub25EcmFnRW50ZXI7XG4gICAgICAgIHBhcmVudE5vZGUub25kcmFnb3ZlciA9IGZ1bmN0aW9uIChldikge1xuICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBmcm9tSW5kZXggPSAoMCwgX3V0aWwuZ2V0RG9tSW5kZXgpKHRhcmdldCwgdGhpcy5wcm9wcy5pZ25vcmVTZWxlY3Rvcik7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmcm9tSW5kZXg6IGZyb21JbmRleCwgdG9JbmRleDogZnJvbUluZGV4IH0pO1xuICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnQgPSAoMCwgX3V0aWwuZ2V0U2Nyb2xsRWxlbWVudCkocGFyZW50Tm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25EcmFnRW50ZXInLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbkRyYWdFbnRlcihlKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXREcmFnTm9kZShlLnRhcmdldCk7XG4gICAgICB2YXIgZXZlbnREYXRhID0gZTtcbiAgICAgIHZhciB0b0luZGV4ID0gdm9pZCAwO1xuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICB0b0luZGV4ID0gKDAsIF91dGlsLmdldERvbUluZGV4KSh0YXJnZXQsIHRoaXMucHJvcHMuaWdub3JlU2VsZWN0b3IpO1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5lbmFibGVTY3JvbGwpIHtcbiAgICAgICAgICB0aGlzLnJlc29sdmVBdXRvU2Nyb2xsKGV2ZW50RGF0YSwgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG9JbmRleCA9IC0xO1xuICAgICAgICB0aGlzLnN0b3BBdXRvU2Nyb2xsKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmNhY2hlRHJhZ1RhcmdldCA9IHRhcmdldDtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0b0luZGV4OiB0b0luZGV4IH0pO1xuICAgICAgdGhpcy5maXhEcmFnTGluZSh0YXJnZXQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ29uRHJhZ0VuZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uRHJhZ0VuZChlKSB7XG4gICAgICB2YXIgdGFyZ2V0ID0gdGhpcy5nZXREcmFnTm9kZShlLnRhcmdldCk7XG4gICAgICB0aGlzLnN0b3BBdXRvU2Nyb2xsKCk7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RyYWdnYWJsZScpO1xuICAgICAgICB0YXJnZXQub25kcmFnc3RhcnQgPSBudWxsO1xuICAgICAgICB0YXJnZXQub25kcmFnZW5kID0gbnVsbDtcbiAgICAgICAgdGFyZ2V0LnBhcmVudE5vZGUub25kcmFnZW50ZXIgPSBudWxsO1xuICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5vbmRyYWdvdmVyID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZnJvbUluZGV4ID49IDAgJiYgdGhpcy5zdGF0ZS5mcm9tSW5kZXggIT09IHRoaXMuc3RhdGUudG9JbmRleCkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25EcmFnRW5kKHRoaXMuc3RhdGUuZnJvbUluZGV4LCB0aGlzLnN0YXRlLnRvSW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmhpZGVEcmFnTGluZSgpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZyb21JbmRleDogLTEsIHRvSW5kZXg6IC0xIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldERyYWdOb2RlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RHJhZ05vZGUodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gKDAsIF91dGlsLmNsb3Nlc3QpKHRhcmdldCwgdGhpcy5wcm9wcy5ub2RlU2VsZWN0b3IsIHRoaXMuZHJhZ0xpc3QpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldEhhbmRsZU5vZGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRIYW5kbGVOb2RlKHRhcmdldCkge1xuICAgICAgcmV0dXJuICgwLCBfdXRpbC5jbG9zZXN0KSh0YXJnZXQsIHRoaXMucHJvcHMuaGFuZGxlU2VsZWN0b3IgfHwgdGhpcy5wcm9wcy5ub2RlU2VsZWN0b3IsIHRoaXMuZHJhZ0xpc3QpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldERyYWdMaW5lJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RHJhZ0xpbmUoKSB7XG4gICAgICBpZiAoIXRoaXMuZHJhZ0xpbmUpIHtcbiAgICAgICAgdGhpcy5kcmFnTGluZSA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5kcmFnTGluZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgRFJBR19MSU5EX1NUWUxFKTtcbiAgICAgICAgd2luZG93LmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kcmFnTGluZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmRyYWdMaW5lLmNsYXNzTmFtZSA9IHRoaXMucHJvcHMubGluZUNsYXNzTmFtZSB8fCAnJztcbiAgICAgIHJldHVybiB0aGlzLmRyYWdMaW5lO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3Jlc29sdmVBdXRvU2Nyb2xsJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzb2x2ZUF1dG9TY3JvbGwoZSwgdGFyZ2V0KSB7XG4gICAgICBpZiAoIXRoaXMuc2Nyb2xsRWxlbWVudCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBfc2Nyb2xsRWxlbWVudCRnZXRCb3UgPSB0aGlzLnNjcm9sbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgdG9wID0gX3Njcm9sbEVsZW1lbnQkZ2V0Qm91LnRvcCxcbiAgICAgICAgICBoZWlnaHQgPSBfc2Nyb2xsRWxlbWVudCRnZXRCb3UuaGVpZ2h0O1xuXG4gICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gdGFyZ2V0Lm9mZnNldEhlaWdodDtcbiAgICAgIHZhciBwYWdlWSA9IGUucGFnZVk7XG5cbiAgICAgIHZhciBjb21wYXRpYmxlSGVpZ2h0ID0gdGFyZ2V0SGVpZ2h0ICogKDIgLyAzKTtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gMDtcbiAgICAgIGlmIChwYWdlWSA+IHRvcCArIGhlaWdodCAtIGNvbXBhdGlibGVIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBESVJFQ1RJT05TLkJPVFRPTTtcbiAgICAgIH0gZWxzZSBpZiAocGFnZVkgPCB0b3AgKyBjb21wYXRpYmxlSGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRElSRUNUSU9OUy5UT1A7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsVGltZXJJZCA8IDApIHtcbiAgICAgICAgICB0aGlzLnNjcm9sbFRpbWVySWQgPSBzZXRJbnRlcnZhbCh0aGlzLmF1dG9TY3JvbGwsIDIwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wQXV0b1Njcm9sbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3N0b3BBdXRvU2Nyb2xsJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcEF1dG9TY3JvbGwoKSB7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuc2Nyb2xsVGltZXJJZCk7XG4gICAgICB0aGlzLnNjcm9sbFRpbWVySWQgPSAtMTtcbiAgICAgIHRoaXMuZml4RHJhZ0xpbmUodGhpcy5jYWNoZURyYWdUYXJnZXQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2F1dG9TY3JvbGwnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhdXRvU2Nyb2xsKCkge1xuICAgICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3A7XG5cbiAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRElSRUNUSU9OUy5CT1RUT00pIHtcbiAgICAgICAgdGhpcy5zY3JvbGxFbGVtZW50LnNjcm9sbFRvcCA9IHNjcm9sbFRvcCArIHRoaXMucHJvcHMuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIGlmIChzY3JvbGxUb3AgPT09IHRoaXMuc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3ApIHtcbiAgICAgICAgICB0aGlzLnN0b3BBdXRvU2Nyb2xsKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERJUkVDVElPTlMuVE9QKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AgPSBzY3JvbGxUb3AgLSB0aGlzLnByb3BzLnNjcm9sbFNwZWVkO1xuICAgICAgICBpZiAodGhpcy5zY3JvbGxFbGVtZW50LnNjcm9sbFRvcCA8PSAwKSB7XG4gICAgICAgICAgdGhpcy5zdG9wQXV0b1Njcm9sbCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3BBdXRvU2Nyb2xsKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGlkZURyYWdMaW5lJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGlkZURyYWdMaW5lKCkge1xuICAgICAgaWYgKHRoaXMuZHJhZ0xpbmUpIHtcbiAgICAgICAgdGhpcy5kcmFnTGluZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2ZpeERyYWdMaW5lJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZml4RHJhZ0xpbmUodGFyZ2V0KSB7XG4gICAgICB2YXIgZHJhZ0xpbmUgPSB0aGlzLmdldERyYWdMaW5lKCk7XG4gICAgICBpZiAoIXRhcmdldCB8fCB0aGlzLnN0YXRlLmZyb21JbmRleCA8IDAgfHwgdGhpcy5zdGF0ZS5mcm9tSW5kZXggPT09IHRoaXMuc3RhdGUudG9JbmRleCkge1xuICAgICAgICB0aGlzLmhpZGVEcmFnTGluZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBfdGFyZ2V0JGdldEJvdW5kaW5nQ2wgPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgbGVmdCA9IF90YXJnZXQkZ2V0Qm91bmRpbmdDbC5sZWZ0LFxuICAgICAgICAgIHRvcCA9IF90YXJnZXQkZ2V0Qm91bmRpbmdDbC50b3AsXG4gICAgICAgICAgd2lkdGggPSBfdGFyZ2V0JGdldEJvdW5kaW5nQ2wud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0ID0gX3RhcmdldCRnZXRCb3VuZGluZ0NsLmhlaWdodDtcblxuICAgICAgdmFyIGxpbmVUb3AgPSB0aGlzLnN0YXRlLnRvSW5kZXggPCB0aGlzLnN0YXRlLmZyb21JbmRleCA/IHRvcCA6IHRvcCArIGhlaWdodDtcbiAgICAgIGlmICh0aGlzLnByb3BzLmVuYWJsZVNjcm9sbCAmJiB0aGlzLnNjcm9sbEVsZW1lbnQpIHtcbiAgICAgICAgdmFyIF9zY3JvbGxFbGVtZW50JGdldEJvdTIgPSB0aGlzLnNjcm9sbEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgICBzY3JvbGxIZWlnaHQgPSBfc2Nyb2xsRWxlbWVudCRnZXRCb3UyLmhlaWdodCxcbiAgICAgICAgICAgIHNjcm9sbFRvcCA9IF9zY3JvbGxFbGVtZW50JGdldEJvdTIudG9wO1xuXG4gICAgICAgIGlmIChsaW5lVG9wIDwgc2Nyb2xsVG9wIC0gMiB8fCBsaW5lVG9wID4gc2Nyb2xsVG9wICsgc2Nyb2xsSGVpZ2h0ICsgMikge1xuICAgICAgICAgIHRoaXMuaGlkZURyYWdMaW5lKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBkcmFnTGluZS5zdHlsZS5sZWZ0ID0gbGVmdCArIFVOSVRfUFg7XG4gICAgICBkcmFnTGluZS5zdHlsZS53aWR0aCA9IHdpZHRoICsgVU5JVF9QWDtcbiAgICAgIGRyYWdMaW5lLnN0eWxlLnRvcCA9IGxpbmVUb3AgKyBVTklUX1BYO1xuICAgICAgZHJhZ0xpbmUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBfcmVhY3QyWydkZWZhdWx0J10uY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgcm9sZTogJ3ByZXNlbnRhdGlvbicsIG9uTW91c2VEb3duOiB0aGlzLm9uTW91c2VEb3duLCByZWY6IGZ1bmN0aW9uIHJlZihjKSB7XG4gICAgICAgICAgICBfdGhpczIuZHJhZ0xpc3QgPSBjO1xuICAgICAgICAgIH0gfSxcbiAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFJlYWN0RHJhZ0xpc3RWaWV3O1xufShfcmVhY3QuQ29tcG9uZW50KTtcblxuUmVhY3REcmFnTGlzdFZpZXcucHJvcFR5cGVzID0ge1xuICBvbkRyYWdFbmQ6IF9wcm9wVHlwZXMyWydkZWZhdWx0J10uZnVuYy5pc1JlcXVpcmVkLFxuICBoYW5kbGVTZWxlY3RvcjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gIG5vZGVTZWxlY3RvcjogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gIGlnbm9yZVNlbGVjdG9yOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLnN0cmluZyxcbiAgZW5hYmxlU2Nyb2xsOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLmJvb2wsXG4gIHNjcm9sbFNwZWVkOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm51bWJlcixcbiAgbGluZUNsYXNzTmFtZTogX3Byb3BUeXBlczJbJ2RlZmF1bHQnXS5zdHJpbmcsXG4gIGNoaWxkcmVuOiBfcHJvcFR5cGVzMlsnZGVmYXVsdCddLm5vZGVcbn07XG5SZWFjdERyYWdMaXN0Vmlldy5kZWZhdWx0UHJvcHMgPSB7XG4gIG5vZGVTZWxlY3RvcjogREVGQVVMVF9OT0RFX1NFTEVDVE9SLFxuICBpZ25vcmVTZWxlY3RvcjogJycsXG4gIGVuYWJsZVNjcm9sbDogdHJ1ZSxcbiAgc2Nyb2xsU3BlZWQ6IDEwLFxuICBoYW5kbGVTZWxlY3RvcjogJycsXG4gIGxpbmVDbGFzc05hbWU6ICcnLFxuICBjaGlsZHJlbjogbnVsbFxufTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IFJlYWN0RHJhZ0xpc3RWaWV3O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiLy8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBleGVjKSB7XG4gIHZhciBmbiA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXTtcbiAgdmFyIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uICgpIHsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07XG4iLCIvLyAxOS4xLjIuOSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyICRnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdnZXRQcm90b3R5cGVPZicsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKGl0KSB7XG4gICAgcmV0dXJuICRnZXRQcm90b3R5cGVPZih0b09iamVjdChpdCkpO1xuICB9O1xufSk7XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgfTtcbn0pO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSkge1xuICByZXR1cm4gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mXCIpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpO1xuXG52YXIgX2dldE93blByb3BlcnR5RGVzY3JpcHRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICB2YXIgZGVzYyA9ICgwLCBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yMi5kZWZhdWx0KShvYmplY3QsIHByb3BlcnR5KTtcblxuICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHBhcmVudCA9ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKG9iamVjdCk7XG5cbiAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9nZXQyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldCcpO1xuXG52YXIgX2dldDMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXQyKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX1JlYWN0RHJhZ0xpc3RWaWV3MiA9IHJlcXVpcmUoJy4vUmVhY3REcmFnTGlzdFZpZXcnKTtcblxudmFyIF9SZWFjdERyYWdMaXN0VmlldzMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9SZWFjdERyYWdMaXN0VmlldzIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBVTklUX1BYID0gJ3B4JztcbnZhciBEUkFHX0xJTkRfU1RZTEUgPSAnd2lkdGg6MDttYXJnaW4tbGVmdDotMXB4O21hcmdpbi10b3A6MDsnICsgJ2JvcmRlci1ib3R0b206MCBub25lO2JvcmRlci1sZWZ0OmRhc2hlZCAycHggcmVkOyc7XG52YXIgRElSRUNUSU9OUyA9IHtcbiAgUklHSFQ6IDIsXG4gIExFRlQ6IDRcbn07XG5cbnZhciBSZWFjdERyYWdDb2x1bW5WaWV3ID0gZnVuY3Rpb24gKF9SZWFjdERyYWdMaXN0Vmlldykge1xuICAoMCwgX2luaGVyaXRzM1snZGVmYXVsdCddKShSZWFjdERyYWdDb2x1bW5WaWV3LCBfUmVhY3REcmFnTGlzdFZpZXcpO1xuXG4gIGZ1bmN0aW9uIFJlYWN0RHJhZ0NvbHVtblZpZXcoKSB7XG4gICAgKDAsIF9jbGFzc0NhbGxDaGVjazNbJ2RlZmF1bHQnXSkodGhpcywgUmVhY3REcmFnQ29sdW1uVmlldyk7XG4gICAgcmV0dXJuICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjNbJ2RlZmF1bHQnXSkodGhpcywgKFJlYWN0RHJhZ0NvbHVtblZpZXcuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihSZWFjdERyYWdDb2x1bW5WaWV3KSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICAoMCwgX2NyZWF0ZUNsYXNzM1snZGVmYXVsdCddKShSZWFjdERyYWdDb2x1bW5WaWV3LCBbe1xuICAgIGtleTogJ2dldERyYWdMaW5lJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RHJhZ0xpbmUoKSB7XG4gICAgICBpZiAoIXRoaXMuZHJhZ0xpbmUpIHtcbiAgICAgICAgKDAsIF9nZXQzWydkZWZhdWx0J10pKFJlYWN0RHJhZ0NvbHVtblZpZXcucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoUmVhY3REcmFnQ29sdW1uVmlldy5wcm90b3R5cGUpLCAnZ2V0RHJhZ0xpbmUnLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLmRyYWdMaW5lLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCB0aGlzLmRyYWdMaW5lLmdldEF0dHJpYnV0ZSgnc3R5bGUnKSArIERSQUdfTElORF9TVFlMRSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5kcmFnTGluZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZXNvbHZlQXV0b1Njcm9sbCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlc29sdmVBdXRvU2Nyb2xsKGUsIHRhcmdldCkge1xuICAgICAgaWYgKCF0aGlzLnNjcm9sbEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgX3Njcm9sbEVsZW1lbnQkZ2V0Qm91ID0gdGhpcy5zY3JvbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIGxlZnQgPSBfc2Nyb2xsRWxlbWVudCRnZXRCb3UubGVmdCxcbiAgICAgICAgICB3aWR0aCA9IF9zY3JvbGxFbGVtZW50JGdldEJvdS53aWR0aDtcblxuICAgICAgdmFyIHRhcmdldFdpZHRoID0gdGFyZ2V0Lm9mZnNldFdpZHRoO1xuICAgICAgdmFyIHBhZ2VYID0gZS5wYWdlWDtcblxuICAgICAgdmFyIGNvbXBhdGlibGVXaWR0aCA9IHRhcmdldFdpZHRoICogMiAvIDM7XG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IDA7XG4gICAgICBpZiAocGFnZVggPiBsZWZ0ICsgd2lkdGggLSBjb21wYXRpYmxlV2lkdGgpIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBESVJFQ1RJT05TLlJJR0hUO1xuICAgICAgfSBlbHNlIGlmIChwYWdlWCA8IGxlZnQgKyBjb21wYXRpYmxlV2lkdGgpIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBESVJFQ1RJT05TLkxFRlQ7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kaXJlY3Rpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsVGltZXJJZCA8IDApIHtcbiAgICAgICAgICB0aGlzLnNjcm9sbFRpbWVySWQgPSBzZXRJbnRlcnZhbCh0aGlzLmF1dG9TY3JvbGwsIDIwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wQXV0b1Njcm9sbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2F1dG9TY3JvbGwnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhdXRvU2Nyb2xsKCkge1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLnNjcm9sbEVsZW1lbnQuc2Nyb2xsTGVmdDtcblxuICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBESVJFQ1RJT05TLlJJR0hUKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdCArIHRoaXMucHJvcHMuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIGlmIChzY3JvbGxMZWZ0ID09PSB0aGlzLnNjcm9sbEVsZW1lbnQuc2Nyb2xsTGVmdCkge1xuICAgICAgICAgIHRoaXMuc3RvcEF1dG9TY3JvbGwoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRElSRUNUSU9OUy5MRUZUKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudC5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdCAtIHRoaXMucHJvcHMuc2Nyb2xsU3BlZWQ7XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbEVsZW1lbnQuc2Nyb2xsTGVmdCA8PSAwKSB7XG4gICAgICAgICAgdGhpcy5zdG9wQXV0b1Njcm9sbCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3BBdXRvU2Nyb2xsKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZml4RHJhZ0xpbmUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmaXhEcmFnTGluZSh0YXJnZXQpIHtcbiAgICAgIHZhciBkcmFnTGluZSA9IHRoaXMuZ2V0RHJhZ0xpbmUoKTtcbiAgICAgIGlmICghdGFyZ2V0IHx8IHRoaXMuc3RhdGUuZnJvbUluZGV4IDwgMCB8fCB0aGlzLnN0YXRlLmZyb21JbmRleCA9PT0gdGhpcy5zdGF0ZS50b0luZGV4KSB7XG4gICAgICAgIHRoaXMuaGlkZURyYWdMaW5lKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIF90YXJnZXQkZ2V0Qm91bmRpbmdDbCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgICBsZWZ0ID0gX3RhcmdldCRnZXRCb3VuZGluZ0NsLmxlZnQsXG4gICAgICAgICAgdG9wID0gX3RhcmdldCRnZXRCb3VuZGluZ0NsLnRvcCxcbiAgICAgICAgICB3aWR0aCA9IF90YXJnZXQkZ2V0Qm91bmRpbmdDbC53aWR0aCxcbiAgICAgICAgICBoZWlnaHQgPSBfdGFyZ2V0JGdldEJvdW5kaW5nQ2wuaGVpZ2h0O1xuXG4gICAgICB2YXIgbGluZUxlZnQgPSB0aGlzLnN0YXRlLnRvSW5kZXggPCB0aGlzLnN0YXRlLmZyb21JbmRleCA/IGxlZnQgOiBsZWZ0ICsgd2lkdGg7XG4gICAgICBpZiAodGhpcy5wcm9wcy5lbmFibGVTY3JvbGwgJiYgdGhpcy5zY3JvbGxFbGVtZW50KSB7XG4gICAgICAgIHZhciBfc2Nyb2xsRWxlbWVudCRnZXRCb3UyID0gdGhpcy5zY3JvbGxFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgICAgc2Nyb2xsV2lkdGggPSBfc2Nyb2xsRWxlbWVudCRnZXRCb3UyLndpZHRoLFxuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IF9zY3JvbGxFbGVtZW50JGdldEJvdTIubGVmdDtcblxuICAgICAgICBpZiAobGluZUxlZnQgPCBzY3JvbGxMZWZ0IC0gMiB8fCBsaW5lTGVmdCA+IHNjcm9sbExlZnQgKyBzY3JvbGxXaWR0aCArIDIpIHtcbiAgICAgICAgICB0aGlzLmhpZGVEcmFnTGluZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZHJhZ0xpbmUuc3R5bGUudG9wID0gdG9wICsgVU5JVF9QWDtcbiAgICAgIGRyYWdMaW5lLnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFVOSVRfUFg7XG4gICAgICBkcmFnTGluZS5zdHlsZS5sZWZ0ID0gbGluZUxlZnQgKyBVTklUX1BYO1xuICAgICAgZHJhZ0xpbmUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBSZWFjdERyYWdDb2x1bW5WaWV3O1xufShfUmVhY3REcmFnTGlzdFZpZXczWydkZWZhdWx0J10pO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBSZWFjdERyYWdDb2x1bW5WaWV3O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX1JlYWN0RHJhZ0xpc3RWaWV3ID0gcmVxdWlyZSgnLi9SZWFjdERyYWdMaXN0VmlldycpO1xuXG52YXIgX1JlYWN0RHJhZ0xpc3RWaWV3MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1JlYWN0RHJhZ0xpc3RWaWV3KTtcblxudmFyIF9SZWFjdERyYWdDb2x1bW5WaWV3ID0gcmVxdWlyZSgnLi9SZWFjdERyYWdDb2x1bW5WaWV3Jyk7XG5cbnZhciBfUmVhY3REcmFnQ29sdW1uVmlldzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9SZWFjdERyYWdDb2x1bW5WaWV3KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG5fUmVhY3REcmFnTGlzdFZpZXcyWydkZWZhdWx0J10uRHJhZ0NvbHVtbiA9IF9SZWFjdERyYWdDb2x1bW5WaWV3MlsnZGVmYXVsdCddO1xuZXhwb3J0c1snZGVmYXVsdCddID0gX1JlYWN0RHJhZ0xpc3RWaWV3MlsnZGVmYXVsdCddO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RHJhZ0xpc3RWaWV3IGZyb20gJ3JlYWN0LWRyYWctbGlzdHZpZXcnXG5pbXBvcnQgeyBJRHJhZ0xpc3RWaWV3UHJvcHMgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgRHJhZ0xpc3RWaWV3OiBSZWFjdC5GQzxJRHJhZ0xpc3RWaWV3UHJvcHM+ID0gKHtcbiAgY2hpbGRyZW4sXG4gIC4uLnByb3BzXG59KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPFJlYWN0RHJhZ0xpc3RWaWV3XG4gICAgICBoYW5kbGVyU2VsZWN0b3I9XCIuZHJhZy1oYW5kbGVyXCJcbiAgICAgIG5vZGVTZWxlY3Rvcj1cIi5kcmFnLWl0ZW1cIlxuICAgICAgey4uLnByb3BzfVxuICAgID5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1JlYWN0RHJhZ0xpc3RWaWV3PlxuICApXG59XG4iXSwibmFtZXMiOlsiX19kZWZQcm9wIiwiX19nZXRPd25Qcm9wU3ltYm9scyIsIl9faGFzT3duUHJvcCIsIl9fcHJvcElzRW51bSIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fc3ByZWFkVmFsdWVzIiwiX19vYmpSZXN0IiwiaXNOdW0iLCJpc1N5bWJvbCIsImdsb2JhbCIsIl9nbG9iYWxNb2R1bGUiLCJjb3JlIiwiX2NvcmVNb2R1bGUiLCJyZXF1aXJlJCQwIiwiaXNPYmplY3QiLCJkb2N1bWVudCIsInJlcXVpcmUkJDEiLCJyZXF1aXJlJCQyIiwiYW5PYmplY3QiLCJJRThfRE9NX0RFRklORSIsInRvUHJpbWl0aXZlIiwiZFAiLCJyZXF1aXJlJCQzIiwiY3JlYXRlRGVzYyIsImhhc093blByb3BlcnR5IiwiaGlkZSIsImhhcyIsInJlcXVpcmUkJDQiLCJQUk9UT1RZUEUiLCIkZXhwb3J0IiwiJE9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInRvSW50ZWdlciIsImRlZmluZWQiLCJ0b1N0cmluZyIsImNvZiIsIm1pbiIsInRvSU9iamVjdCIsInN0b3JlIiwiX3NoYXJlZE1vZHVsZSIsImlkIiwic2hhcmVkIiwidWlkIiwiSUVfUFJPVE8iLCIka2V5cyIsImVudW1CdWdLZXlzIiwiZ2V0S2V5cyIsInJlcXVpcmUkJDUiLCJTeW1ib2wiLCJfd2tzTW9kdWxlIiwiY3JlYXRlIiwic2V0VG9TdHJpbmdUYWciLCJ0b09iamVjdCIsIk9iamVjdFByb3RvIiwicmVkZWZpbmUiLCJJdGVyYXRvcnMiLCJyZXF1aXJlJCQ2IiwiZ2V0UHJvdG90eXBlT2YiLCJyZXF1aXJlJCQ3IiwicmVxdWlyZSQkOCIsInByb3RvIiwiTUVUQSIsIl9tZXRhTW9kdWxlIiwid2tzRXh0IiwicElFIiwiZ09QTiIsImdPUEQiLCJyZXF1aXJlJCQ5IiwicmVxdWlyZSQkMTAiLCJyZXF1aXJlJCQxMSIsInJlcXVpcmUkJDEyIiwicmVxdWlyZSQkMTMiLCJyZXF1aXJlJCQxNCIsInJlcXVpcmUkJDE1IiwicmVxdWlyZSQkMTYiLCJyZXF1aXJlJCQxNyIsInJlcXVpcmUkJDE4IiwicmVxdWlyZSQkMTkiLCJyZXF1aXJlJCQyMCIsIl9jcmVhdGUiLCJyZXF1aXJlJCQyMSIsInJlcXVpcmUkJDIyIiwicmVxdWlyZSQkMjMiLCJyZXF1aXJlJCQyNCIsInJlcXVpcmUkJDI1IiwicmVxdWlyZSQkMjYiLCIkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwicmVxdWlyZSQkMjciLCJyZXF1aXJlJCQyOCIsInJlcXVpcmUkJDI5IiwiayIsInJlcXVpcmUkJDMwIiwiX3R5cGVvZl8xIiwiX3R5cGVvZjIiLCJfdHlwZW9mMyIsIlJlYWN0UHJvcFR5cGVzU2VjcmV0IiwicHJvcFR5cGVzTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFDTyxNQUFNLGtCQUFrQixHQUFHLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUM3QyxNQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsRUFBRSxDQUFDOztNQ0Y3QyxJQUFJQSxXQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztNQUN0QyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7TUFDekMsSUFBSSxpQkFBaUIsR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUM7TUFDekQsSUFBSUMscUJBQW1CLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDO01BQ3ZELElBQUlDLGNBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztNQUNuRCxJQUFJQyxjQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztNQUN6RCxJQUFJQyxpQkFBZSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBR0osV0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDaEssSUFBSUssZ0JBQWMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUs7TUFDL0IsRUFBRSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ2hDLElBQUksSUFBSUgsY0FBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUs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QUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDO01BQ3hRLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxHQUFHLE9BQU8sQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxD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
