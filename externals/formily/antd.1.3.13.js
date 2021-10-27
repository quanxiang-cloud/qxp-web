System.register(['@formily/react-schema-renderer', 'react', '@formily/react-shared-components', 'antd', '@formily/shared'], (function (exports) {
  'use strict';
  var _starExcludes = {
    AntdSchemaFieldAdaptor: 1,
    AntdSchemaFormAdaptor: 1,
    Field: 1,
    Form: 1,
    FormButtonGroup: 1,
    FormItem: 1,
    FormItemDeepProvider: 1,
    FormItemShallowProvider: 1,
    FormMegaLayout: 1,
    MegaLayout: 1,
    MegaLayoutItem: 1,
    Reset: 1,
    SchemaForm: 1,
    Submit: 1,
    computeAntdStyleBase: 1,
    computeStyle: 1,
    'default': 1,
    mapStyledProps: 1,
    mapTextComponent: 1,
    normalizeCol: 1,
    pickFormItemProps: 1,
    pickNotFormItemProps: 1,
    pickProps: 1,
    useDeepFormItem: 1,
    useFormTableQuery: 1,
    useShallowFormItem: 1,
    BigData: 1,
    FormConsumer: 1,
    FormEffectHooks: 1,
    FormExpressionScopeContext: 1,
    FormPath: 1,
    FormProvider: 1,
    FormSlot: 1,
    FormSpy: 1,
    InternalField: 1,
    InternalFieldList: 1,
    InternalForm: 1,
    InternalVirtualField: 1,
    JSONCondition: 1,
    Schema: 1,
    SchemaField: 1,
    SchemaMarkupField: 1,
    cleanRegistry: 1,
    complieExpression: 1,
    connect: 1,
    createAsyncFormActions: 1,
    createControllerBox: 1,
    createEffectHook: 1,
    createFormActions: 1,
    createVirtualBox: 1,
    getRegistry: 1,
    parseLinkages: 1,
    registerFieldMiddleware: 1,
    registerFormComponent: 1,
    registerFormField: 1,
    registerFormFields: 1,
    registerFormItemComponent: 1,
    registerValidationFormats: 1,
    registerValidationMTEngine: 1,
    registerValidationRules: 1,
    registerVirtualBox: 1,
    setValidationLanguage: 1,
    setValidationLocale: 1,
    useField: 1,
    useFieldState: 1,
    useForm: 1,
    useFormEffects: 1,
    useFormSpy: 1,
    useFormState: 1,
    useSchemaForm: 1,
    useSchemaProps: 1,
    useValueLinkageEffect: 1,
    useVirtualField: 1
  };
  var getRegistry, FormSpy, LifeCycleTypes, createVirtualBox, SchemaMarkupForm, SchemaMarkupField, InternalForm, Layout, LayoutItem, InternalVirtualField, InternalField, connect, registerFormComponent, registerFormItemComponent, useFormQuery, React$1, createContext, useContext, useRef, useMemo, Fragment, createElement, useState, PreviewText, version, Button, Row, Col, Form$1, each, isArr, isFn$1, log, globalThisPolyfill, defaults;
  return {
    setters: [function (module) {
      getRegistry = module.getRegistry;
      FormSpy = module.FormSpy;
      LifeCycleTypes = module.LifeCycleTypes;
      createVirtualBox = module.createVirtualBox;
      SchemaMarkupForm = module.SchemaMarkupForm;
      SchemaMarkupField = module.SchemaMarkupField;
      InternalForm = module.InternalForm;
      Layout = module.Layout;
      LayoutItem = module.LayoutItem;
      InternalVirtualField = module.InternalVirtualField;
      InternalField = module.InternalField;
      connect = module.connect;
      registerFormComponent = module.registerFormComponent;
      registerFormItemComponent = module.registerFormItemComponent;
      useFormQuery = module.useFormQuery;
      var setter = { BigData: module.BigData, FormConsumer: module.FormConsumer, FormEffectHooks: module.FormEffectHooks, FormExpressionScopeContext: module.FormExpressionScopeContext, FormPath: module.FormPath, FormProvider: module.FormProvider, FormSlot: module.FormSlot, FormSpy: module.FormSpy, InternalField: module.InternalField, InternalFieldList: module.InternalFieldList, InternalForm: module.InternalForm, InternalVirtualField: module.InternalVirtualField, JSONCondition: module.JSONCondition, Schema: module.Schema, SchemaField: module.SchemaField, SchemaMarkupField: module.SchemaMarkupField, cleanRegistry: module.cleanRegistry, complieExpression: module.complieExpression, connect: module.connect, createAsyncFormActions: module.createAsyncFormActions, createControllerBox: module.createControllerBox, createEffectHook: module.createEffectHook, createFormActions: module.createFormActions, createVirtualBox: module.createVirtualBox, getRegistry: module.getRegistry, parseLinkages: module.parseLinkages, registerFieldMiddleware: module.registerFieldMiddleware, registerFormComponent: module.registerFormComponent, registerFormField: module.registerFormField, registerFormFields: module.registerFormFields, registerFormItemComponent: module.registerFormItemComponent, registerValidationFormats: module.registerValidationFormats, registerValidationMTEngine: module.registerValidationMTEngine, registerValidationRules: module.registerValidationRules, registerVirtualBox: module.registerVirtualBox, setValidationLanguage: module.setValidationLanguage, setValidationLocale: module.setValidationLocale, useField: module.useField, useFieldState: module.useFieldState, useForm: module.useForm, useFormEffects: module.useFormEffects, useFormSpy: module.useFormSpy, useFormState: module.useFormState, useSchemaForm: module.useSchemaForm, useSchemaProps: module.useSchemaProps, useValueLinkageEffect: module.useValueLinkageEffect, useVirtualField: module.useVirtualField };
      for (var name in module) {
        if (!_starExcludes[name]) setter[name] = module[name];
      }
      exports(setter);
    }, function (module) {
      React$1 = module["default"];
      createContext = module.createContext;
      useContext = module.useContext;
      useRef = module.useRef;
      useMemo = module.useMemo;
      Fragment = module.Fragment;
      createElement = module.createElement;
      useState = module.useState;
    }, function (module) {
      PreviewText = module.PreviewText;
    }, function (module) {
      version = module.version;
      Button = module.Button;
      Row = module.Row;
      Col = module.Col;
      Form$1 = module.Form;
    }, function (module) {
      each = module.each;
      isArr = module.isArr;
      isFn$1 = module.isFn;
      log = module.log;
      globalThisPolyfill = module.globalThisPolyfill;
      defaults = module.defaults;
    }],
    execute: (function () {

      var __defProp$8 = Object.defineProperty;
      var __defProps$8 = Object.defineProperties;
      var __getOwnPropDescs$8 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$9 = Object.getOwnPropertySymbols;
      var __hasOwnProp$9 = Object.prototype.hasOwnProperty;
      var __propIsEnum$9 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$8 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$9.call(b, prop))
            __defNormalProp$8(a, prop, b[prop]);
        if (__getOwnPropSymbols$9)
          for (var prop of __getOwnPropSymbols$9(b)) {
            if (__propIsEnum$9.call(b, prop))
              __defNormalProp$8(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$8 = (a, b) => __defProps$8(a, __getOwnPropDescs$8(b));
      const isAntdV4 = /^4\./.test(version);
      const cloneChlildren = (children, props) => {
        return React$1.isValidElement(children) ? React$1.cloneElement(children, __spreadProps$8(__spreadValues$8({}, props), {
          children: cloneChlildren(children.props["children"])
        })) : isArr(children) ? children.map((child, key) => cloneChlildren(child, { key })) : children;
      };
      const autoScrollInValidateFailed = (formRef) => {
        if (formRef.current) {
          setTimeout(() => {
            const elements = formRef.current.querySelectorAll(isAntdV4 ? ".ant-form-item-has-error" : ".ant-form-item-control.has-error");
            if (elements && elements.length) {
              if (!elements[0].scrollIntoView)
                return;
              elements[0].scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "center"
              });
            }
          }, 30);
        }
      };
      const mapTextComponent = exports('mapTextComponent', (Target, props, fieldProps = {}) => {
        const { editable } = fieldProps;
        if (editable !== void 0) {
          if (editable === false) {
            return getRegistry().previewText || PreviewText;
          }
        }
        return Target;
      });
      const normalizeCol = exports('normalizeCol', (col, defaultValue) => {
        if (!col) {
          return defaultValue;
        } else {
          return typeof col === "object" ? col : { span: Number(col) };
        }
      });
      const pickProps = exports('pickProps', (object, targets) => {
        const selected = {};
        const otherwise = {};
        each(object, (value, key) => {
          if (targets.includes(key)) {
            selected[key] = value;
          } else {
            otherwise[key] = value;
          }
        });
        return {
          selected,
          otherwise
        };
      });
      const NextFormItemProps = [
        "colon",
        "htmlFor",
        "validateStatus",
        "prefixCls",
        "required",
        "labelAlign",
        "hasFeedback",
        "labelCol",
        "wrapperCol",
        "label",
        "help",
        "extra",
        "itemStyle",
        "itemClassName",
        "addonAfter",
        "tooltip"
      ];
      const pickFormItemProps = exports('pickFormItemProps', (props) => {
        const { selected } = pickProps(props, NextFormItemProps);
        if (!props.label && props.title) {
          selected.label = props.title;
        }
        if (!props.help && props.description) {
          selected.help = props.description;
        }
        if (selected.itemStyle) {
          selected.style = selected.itemStyle;
          delete selected.itemStyle;
        }
        if (selected.itemClassName) {
          selected.className = selected.itemClassName;
          delete selected.itemClassName;
        }
        return selected;
      });
      const pickNotFormItemProps = exports('pickNotFormItemProps', (props) => {
        return pickProps(props, NextFormItemProps).otherwise;
      });
      const mapStyledProps = exports('mapStyledProps', (props, fieldProps) => {
        const { loading, errors } = fieldProps;
        if (loading) {
          props.state = props.state || "loading";
        } else if (errors && errors.length) {
          props.state = "error";
        }
      });

      var __defProp$7 = Object.defineProperty;
      var __defProps$7 = Object.defineProperties;
      var __getOwnPropDescs$7 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
      var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
      var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$7 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$8.call(b, prop))
            __defNormalProp$7(a, prop, b[prop]);
        if (__getOwnPropSymbols$8)
          for (var prop of __getOwnPropSymbols$8(b)) {
            if (__propIsEnum$8.call(b, prop))
              __defNormalProp$7(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$7 = (a, b) => __defProps$7(a, __getOwnPropDescs$7(b));
      var __objRest$5 = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$8.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$8)
          for (var prop of __getOwnPropSymbols$8(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$8.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      const Submit = exports('Submit', (_a) => {
        var _b = _a, { showLoading, onSubmit } = _b, props = __objRest$5(_b, ["showLoading", "onSubmit"]);
        return /* @__PURE__ */ React$1.createElement(FormSpy, {
          selector: [
            LifeCycleTypes.ON_FORM_MOUNT,
            LifeCycleTypes.ON_FORM_SUBMIT_START,
            LifeCycleTypes.ON_FORM_SUBMIT_END
          ],
          reducer: (state, action) => {
            switch (action.type) {
              case LifeCycleTypes.ON_FORM_SUBMIT_START:
                return __spreadProps$7(__spreadValues$7({}, state), {
                  submitting: true
                });
              case LifeCycleTypes.ON_FORM_SUBMIT_END:
                return __spreadProps$7(__spreadValues$7({}, state), {
                  submitting: false
                });
              default:
                return state;
            }
          }
        }, ({ state, form }) => {
          return /* @__PURE__ */ React$1.createElement(Button, __spreadProps$7(__spreadValues$7({
            onClick: (e) => {
              if (onSubmit) {
                form.submit(onSubmit);
              }
              if (props.onClick) {
                props.onClick(e);
              }
            }
          }, props), {
            htmlType: onSubmit ? "button" : "submit",
            loading: showLoading ? state.submitting : void 0
          }), props.children || "\u63D0\u4EA4");
        });
      });
      Submit.defaultProps = {
        showLoading: true,
        type: "primary",
        htmlType: "submit"
      };
      const Reset = exports('Reset', (_c) => {
        var _d = _c, {
          children,
          forceClear,
          validate
        } = _d, props = __objRest$5(_d, [
          "children",
          "forceClear",
          "validate"
        ]);
        return /* @__PURE__ */ React$1.createElement(FormSpy, {
          selector: []
        }, ({ form }) => {
          return /* @__PURE__ */ React$1.createElement(Button, __spreadProps$7(__spreadValues$7({}, props), {
            onClick: () => form.reset({ forceClear, validate })
          }), children || "\u91CD\u7F6E");
        });
      });

      var classnames$1 = {exports: {}};

      /*!
        Copyright (c) 2018 Jed Watson.
        Licensed under the MIT License (MIT), see
        http://jedwatson.github.io/classnames
      */

      (function (module) {
      /* global define */

      (function () {

      	var hasOwn = {}.hasOwnProperty;

      	function classNames() {
      		var classes = [];

      		for (var i = 0; i < arguments.length; i++) {
      			var arg = arguments[i];
      			if (!arg) continue;

      			var argType = typeof arg;

      			if (argType === 'string' || argType === 'number') {
      				classes.push(arg);
      			} else if (Array.isArray(arg)) {
      				if (arg.length) {
      					var inner = classNames.apply(null, arg);
      					if (inner) {
      						classes.push(inner);
      					}
      				}
      			} else if (argType === 'object') {
      				if (arg.toString === Object.prototype.toString) {
      					for (var key in arg) {
      						if (hasOwn.call(arg, key) && arg[key]) {
      							classes.push(key);
      						}
      					}
      				} else {
      					classes.push(arg.toString());
      				}
      			}
      		}

      		return classes.join(' ');
      	}

      	if (module.exports) {
      		classNames.default = classNames;
      		module.exports = classNames;
      	} else {
      		window.classNames = classNames;
      	}
      }());
      }(classnames$1));

      var classnames = classnames$1.exports;

      var utils = {};

      utils.__esModule = true;
      utils.getCompStyle = getCompStyle;

      function getPixelSize(element, style, property, fontSize) {
        var sizeWithSuffix = style[property],
            size = parseFloat(sizeWithSuffix),
            suffix = sizeWithSuffix.split(/\d/)[0],
            rootSize;
        fontSize = fontSize != null ? fontSize : /%|em/.test(suffix) && element && element.parentElement ? getPixelSize(element.parentElement, element.parentElement.currentStyle, "fontSize", null) : 16;
        rootSize = property == "fontSize" ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;
        return suffix == "em" ? size * fontSize : suffix == "in" ? size * 96 : suffix == "pt" ? size * 96 / 72 : suffix == "%" ? size / 100 * rootSize : size;
      }

      function setShortStyleProperty(style, property) {
        var borderSuffix = property == "border" ? "Width" : "",
            t = property + "Top" + borderSuffix,
            r = property + "Right" + borderSuffix,
            b = property + "Bottom" + borderSuffix,
            l = property + "Left" + borderSuffix;
        style[property] = (style[t] == style[r] == style[b] == style[l] ? [style[t]] : style[t] == style[b] && style[l] == style[r] ? [style[t], style[r]] : style[l] == style[r] ? [style[t], style[r], style[b]] : [style[t], style[r], style[b], style[l]]).join(" ");
      }

      function CSSStyleDeclaration(element) {
        var currentStyle = element.currentStyle,
            style = this,
            fontSize = getPixelSize(element, currentStyle, "fontSize", null);

        for (property in currentStyle) {
          if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !== "auto") {
            style[property] = getPixelSize(element, currentStyle, property, fontSize) + "px";
          } else if (property === "styleFloat") {
            style["float"] = currentStyle[property];
          } else {
            style[property] = currentStyle[property];
          }
        }

        setShortStyleProperty(style, "margin");
        setShortStyleProperty(style, "padding");
        setShortStyleProperty(style, "border");
        style.fontSize = fontSize + "px";
        return style;
      }

      CSSStyleDeclaration.prototype = {
        constructor: CSSStyleDeclaration,
        getPropertyPriority: function getPropertyPriority() {},
        getPropertyValue: function getPropertyValue(prop) {
          return this[prop] || "";
        },
        item: function item() {},
        removeProperty: function removeProperty() {},
        setProperty: function setProperty() {},
        getPropertyCSSValue: function getPropertyCSSValue() {}
      };

      function getCompStyle(element) {
        if (window.getComputedStyle) return window.getComputedStyle(element);
        return new CSSStyleDeclaration(element);
      }

      // defined by w3c
      var DOCUMENT_NODE = 9;
      /**
       * Returns `true` if `w` is a Document object, or `false` otherwise.
       *
       * @param {?} d - Document object, maybe
       * @return {Boolean}
       * @private
       */

      function isDocument(d) {
        return d && d.nodeType === DOCUMENT_NODE;
      }
      /**
       * Returns the `document` object associated with the given `node`, which may be
       * a DOM element, the Window object, a Selection, a Range. Basically any DOM
       * object that references the Document in some way, this function will find it.
       *
       * @param {Mixed} node - DOM node, selection, or range in which to find the `document` object
       * @return {Document} the `document` object associated with `node`
       * @public
       */


      function getDocument(node) {
        if (isDocument(node)) {
          return node;
        } else if (isDocument(node.ownerDocument)) {
          return node.ownerDocument;
        } else if (isDocument(node.document)) {
          return node.document;
        } else if (node.parentNode) {
          return getDocument(node.parentNode); // Range support
        } else if (node.commonAncestorContainer) {
          return getDocument(node.commonAncestorContainer);
        } else if (node.startContainer) {
          return getDocument(node.startContainer); // Selection support
        } else if (node.anchorNode) {
          return getDocument(node.anchorNode);
        }
      }

      function withinElement(child, parent) {
        // don't throw if `child` is null
        if (!child) return false; // Range support

        if (child.commonAncestorContainer) child = child.commonAncestorContainer;else if (child.endContainer) child = child.endContainer; // ask the browser if parent contains child

        if (child === window) return true;
        return parent.contains(child);
      }

      var offset = function offset(el) {
        var doc = getDocument(el);
        if (!doc) return; // Make sure it's not a disconnected DOM node

        if (!withinElement(el, doc)) return;
        var body = doc.body;

        if (body === el) {
          return bodyOffset(el);
        }

        var box = {
          top: 0,
          left: 0
        };

        if (typeof el.getBoundingClientRect !== "undefined") {
          // If we don't have gBCR, just use 0,0 rather than error
          // BlackBerry 5, iOS 3 (original iPhone)
          box = el.getBoundingClientRect();

          if (el.collapsed && box.left === 0 && box.top === 0) {
            // collapsed Range instances sometimes report 0, 0
            // see: http://stackoverflow.com/a/6847328/376773
            var span = doc.createElement("span"); // Ensure span has dimensions and position by
            // adding a zero-width space character

            span.appendChild(doc.createTextNode("\u200B"));
            el.insertNode(span);
            box = span.getBoundingClientRect(); // Remove temp SPAN and glue any broken text nodes back together

            var spanParent = span.parentNode;
            spanParent.removeChild(span);
            spanParent.normalize();
          }
        }

        var docEl = doc.documentElement;
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;
        var scrollTop = window.pageYOffset || docEl.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft;
        return {
          top: box.top + scrollTop - clientTop,
          left: box.left + scrollLeft - clientLeft
        };
      };

      function bodyOffset(body) {
        var top = body.offsetTop;
        var left = body.offsetLeft;
        top += parseFloat(body.style.marginTop || 0);
        left += parseFloat(body.style.marginLeft || 0);
        return {
          top: top,
          left: left
        };
      }

      var windowScroll = {exports: {}};

      (function (module) {

      // Window Scroll Position
      //
      // Cross-browser implementation of window.scrollX and window.scrollY.
      //
      // Implementation from jQuery
      // See https://github.com/jquery/jquery/blob/835e8c4ae39f09d11ad42d24e0210bebfa8e8320/src/offset.js#L176-L178
      //

      [
        ["getScrollY", "scrollTop", "pageYOffset"],
        ["getScrollX", "scrollLeft", "pageXOffset"],
      ].forEach(function(props) {
        var fnName = props[0];
        var elProp = props[1];
        var winProp = props[2];

        module.exports[fnName] = function() {
          if (winProp in window) {
            return window[winProp];
          }
          else {
            return window.document.documentElement[elProp];
          }
        };
      });
      }(windowScroll));

      var default_1 = void 0;

      var _react = _interopRequireWildcard(React$1);

      _interopRequireDefault(classnames$1.exports);

      var _utils = utils;

      var _offset = _interopRequireDefault(offset);

      _interopRequireDefault(windowScroll.exports);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

      function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

      function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

      function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

      function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

      function getNum(val) {
        return val !== undefined ? parseInt(val) : 0;
      }

      function isFn(val) {
        return typeof val === 'function';
      }

      var Sticky =
      /*#__PURE__*/
      function (_Component) {
        _inheritsLoose(Sticky, _Component);

        function Sticky() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
            isSticky: false,
            window: {
              height: window.innerHeight,
              width: window.innerWidth
            }
          });

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "StickyRef", _react.default.createRef());

          return _this;
        }

        var _proto = Sticky.prototype;

        _proto.getContainerNode = function getContainerNode() {
          var stickyContainer = this.StickyRef;
          this.container = stickyContainer && stickyContainer.current;
          return this.container;
        };

        _proto.componentDidMount = function componentDidMount() {
          var _this2 = this;

          this.getContainerNode();
          this.initCloneContainerNode();
          this.registerEvents();
          setTimeout(function () {
            _this2.initSticky();
          });
        };

        _proto.initSticky = function initSticky() {
          var _this3 = this;

          this.ifSticky(function () {
            _this3.sticky();
          }, function () {
            _this3.sticky(false);
          });
        };

        _proto.componentWillUnmount = function componentWillUnmount() {
          var _this4 = this;

          this.sticky(false);
          this.cancelEvents();
          setTimeout(function () {
            _this4.wrapperNode.remove();
          });
        };

        _proto.onScrollHandler = function onScrollHandler(context) {
          var createState = context.props.createState;

          var handler = context.bindHandler || function (e) {
            requestAnimationFrame(function () {
              if (createState) {
                var state = createState();

                if (state) {
                  context.setState(state);
                }
              }

              context.ifSticky(function () {
                context.setState({
                  isSticky: true,
                  window: {
                    height: window.innerHeight,
                    width: window.innerWidth
                  }
                });
                context.sticky(true, e.type);
              }, function () {
                context.setState({
                  isSticky: false,
                  window: {
                    height: window.innerHeight,
                    width: window.innerWidth
                  }
                });
                context.sticky(false, e.type);
              });
            });
          };

          context.bindHandler = handler;
          return handler;
        };

        _proto.setStyle = function setStyle(node, styles) {
          var style = node.style;
          Object.keys(styles).forEach(function (name) {
            style[name] = styles[name];
          });
        };

        _proto.sticky = function sticky(isSticky, type) {
          if (isSticky === void 0) {
            isSticky = true;
          }

          var positionNode = this.getPositionNode();
          var nodeData = this.getNodeData(positionNode);
          var self = this;

          if (this.props.edge == 'top') {
            if (isSticky) {
              this.updateContainerSize();
              this.setStyle(this.container, _extends$1({
                position: 'fixed',
                width: nodeData.width + 'px',
                height: nodeData.height + 'px',
                top: this.props.triggerDistance + 'px',
                left: nodeData.offsetLeft + 'px',
                zIndex: self.props.zIndex || '10'
              }, this.props.stickiedStyle));
              this.sticking = true;
            } else {
              if (type === 'resize') this.wrapperNode.style.minHeight = 'auto';
              self.setStyle(self.container, _extends$1({
                left: '',
                zIndex: '',
                width: '',
                height: '',
                position: '',
                top: ''
              }, self.props.unstickiedStyle));
              this.sticking = false;
            }
          } else {
            if (isSticky) {
              this.updateContainerSize();
              this.setStyle(this.container, _extends$1({
                position: 'fixed',
                width: nodeData.width + 'px',
                height: nodeData.height + 'px',
                bottom: self.props.triggerDistance + 'px',
                left: nodeData.offsetLeft + 'px',
                zIndex: self.props.zIndex || '10'
              }, this.props.stickiedStyle));
              this.sticking = true;
            } else {
              if (type === 'resize') this.wrapperNode.style.minHeight = 'auto';
              this.setStyle(this.container, {
                bottom: self.props.triggerDistance + 'px'
              });
              this.container;
              self.setStyle(self.container, _extends$1({
                left: '',
                zIndex: '',
                width: '',
                height: '',
                position: '',
                bottom: ''
              }, self.props.unstickiedStyle));
              this.sticking = false;
            }
          }
        };

        _proto.getPositionNode = function getPositionNode() {
          var node = null;
          if (this.sticking) node = this.wrapperNode;else node = this.container;
          return node;
        };

        _proto.ifSticky = function ifSticky(ok, faild) {
          var positionNode = this.getPositionNode();
          var nodeData = this.getNodeData(positionNode);
          var winData = this.getNodeData(window);
          var self = this;
          var edge = self.props.edge;
          var getStickyBoundary = self.props.getStickyBoundary;
          var triggerDistance = self.props.triggerDistance;
          var isNotSticky = this.state.notSticky;

          if (isFn(getStickyBoundary)) {
            if (!getStickyBoundary()) return faild.call(self);
          }

          if (isNotSticky) {
            return faild.call(self);
          }

          if (edge != 'top') {
            if (winData.scrollTop + winData.height < nodeData.offsetTop + nodeData.height + triggerDistance) {
              return ok.call(self);
            }
          } else {
            if (winData.scrollTop > nodeData.offsetTop - triggerDistance && nodeData.offsetTop > 0) {
              return ok.call(self);
            }
          }

          faild.call(self);
        };

        _proto.getNodeData = function getNodeData(node) {
          node.clientHeight;
              node.clientWidth;
              node.innerHeight;
              node.innerWidth;

          if (node !== window) {
            var offset = (0, _offset.default)(node);
            var offsetLeft = offset ? offset.left : 0;
            var offsetTop = offset ? offset.top : 0;
            var rect = node.getBoundingClientRect();
            var style = (0, _utils.getCompStyle)(node);
            return {
              offsetLeft: offsetLeft - getNum(style['margin-left']),
              offsetTop: offsetTop - getNum(style['margin-top']),
              width: rect.width,
              height: rect.height
            };
          } else {
            return {
              height: window.innerHeight,
              width: window.innerWidth,
              scrollTop: window.pageYOffset,
              scrollLeft: window.pageXOffset
            };
          }
        };

        _proto.getOldNodeHeight = function getOldNodeHeight() {
          var nodeData = this.getNodeData(this.oldNode);
          return nodeData.height;
        };

        _proto.initCloneContainerNode = function initCloneContainerNode() {
          var className = this.props.className;
          if (this.wrapperNode) return this.wrapperNode;
          this.oldNode = this.getContainerNode();
          this.oldNodeHeight = this.getOldNodeHeight();
          this.wrapperNode = document.createElement('div');
          this.wrapperNode.style.minHeight = this.oldNodeHeight + 'px';
          this.wrapperNode.classList.add('sticky-wrapper');
          if (className) this.wrapperNode.classList.add(className);
          this.oldNode.parentNode.insertBefore(this.wrapperNode, this.oldNode);
          this.wrapperNode.appendChild(this.oldNode);
        };

        _proto.updateContainerSize = function updateContainerSize() {
          if (this.wrapperNode) {
            var newHeight = this.getOldNodeHeight();

            if (this.oldNodeHeight !== newHeight) {
              this.wrapperNode.style.minHeight = newHeight + 'px';
              this.oldNodeHeight = newHeight;
            }
          }
        };

        _proto.cancelEvents = function cancelEvents() {
          window.removeEventListener('scroll', this.onScrollHandler(this));
          window.removeEventListener('resize', this.onScrollHandler(this));
        };

        _proto.registerEvents = function registerEvents() {
          window.addEventListener('scroll', this.onScrollHandler(this));
          window.addEventListener('resize', this.onScrollHandler(this));
        };

        _proto.renderContainer = function renderContainer() {
          var _this$props = this.props,
              children = _this$props.children;
              _this$props.className;
          return _react.default.createElement("div", {
            ref: this.StickyRef,
            className: "sticky-container",
            style: this.props.style
          }, typeof children === 'function' ? children(this.state) : children);
        };

        _proto.render = function render() {
          return this.renderContainer();
        };

        return Sticky;
      }(_react.Component);

      _defineProperty(Sticky, "defaultProps", {
        edge: 'bottom',
        triggerDistance: 0
      });

      var _default$1 = Sticky;
      default_1 = _default$1;

      var styledComponents_browser_cjs = {};

      var stylis_min = {exports: {}};

      (function (module, exports) {
      !function(e){module.exports=e(null);}(function e(a){var r=/^\0+/g,c=/[\0\r\f]/g,s=/: */g,t=/zoo|gra/,i=/([,: ])(transform)/g,f=/,+\s*(?![^(]*[)])/g,n=/ +\s*(?![^(]*[)])/g,l=/ *[\0] */g,o=/,\r+?/g,h=/([\t\r\n ])*\f?&/g,u=/:global\(((?:[^\(\)\[\]]*|\[.*\]|\([^\(\)]*\))*)\)/g,d=/\W+/g,b=/@(k\w+)\s*(\S*)\s*/,p=/::(place)/g,k=/:(read-only)/g,g=/\s+(?=[{\];=:>])/g,A=/([[}=:>])\s+/g,C=/(\{[^{]+?);(?=\})/g,w=/\s{2,}/g,v=/([^\(])(:+) */g,m=/[svh]\w+-[tblr]{2}/,x=/\(\s*(.*)\s*\)/g,$=/([\s\S]*?);/g,y=/-self|flex-/g,O=/[^]*?(:[rp][el]a[\w-]+)[^]*/,j=/stretch|:\s*\w+\-(?:conte|avail)/,z=/([^-])(image-set\()/,N="-webkit-",S="-moz-",F="-ms-",W=59,q=125,B=123,D=40,E=41,G=91,H=93,I=10,J=13,K=9,L=64,M=32,P=38,Q=45,R=95,T=42,U=44,V=58,X=39,Y=34,Z=47,_=62,ee=43,ae=126,re=0,ce=12,se=11,te=107,ie=109,fe=115,ne=112,le=111,oe=105,he=99,ue=100,de=112,be=1,pe=1,ke=0,ge=1,Ae=1,Ce=1,we=0,ve=0,me=0,xe=[],$e=[],ye=0,Oe=null,je=-2,ze=-1,Ne=0,Se=1,Fe=2,We=3,qe=0,Be=1,De="",Ee="",Ge="";function He(e,a,s,t,i){for(var f,n,o=0,h=0,u=0,d=0,g=0,A=0,C=0,w=0,m=0,$=0,y=0,O=0,j=0,z=0,R=0,we=0,$e=0,Oe=0,je=0,ze=s.length,Je=ze-1,Re="",Te="",Ue="",Ve="",Xe="",Ye="";R<ze;){if(C=s.charCodeAt(R),R===Je)if(h+d+u+o!==0){if(0!==h)C=h===Z?I:Z;d=u=o=0,ze++,Je++;}if(h+d+u+o===0){if(R===Je){if(we>0)Te=Te.replace(c,"");if(Te.trim().length>0){switch(C){case M:case K:case W:case J:case I:break;default:Te+=s.charAt(R);}C=W;}}if(1===$e)switch(C){case B:case q:case W:case Y:case X:case D:case E:case U:$e=0;case K:case J:case I:case M:break;default:for($e=0,je=R,g=C,R--,C=W;je<ze;)switch(s.charCodeAt(je++)){case I:case J:case W:++R,C=g,je=ze;break;case V:if(we>0)++R,C=g;case B:je=ze;}}switch(C){case B:for(g=(Te=Te.trim()).charCodeAt(0),y=1,je=++R;R<ze;){switch(C=s.charCodeAt(R)){case B:y++;break;case q:y--;break;case Z:switch(A=s.charCodeAt(R+1)){case T:case Z:R=Qe(A,R,Je,s);}break;case G:C++;case D:C++;case Y:case X:for(;R++<Je&&s.charCodeAt(R)!==C;);}if(0===y)break;R++;}if(Ue=s.substring(je,R),g===re)g=(Te=Te.replace(r,"").trim()).charCodeAt(0);switch(g){case L:if(we>0)Te=Te.replace(c,"");switch(A=Te.charCodeAt(1)){case ue:case ie:case fe:case Q:f=a;break;default:f=xe;}if(je=(Ue=He(a,f,Ue,A,i+1)).length,me>0&&0===je)je=Te.length;if(ye>0)if(f=Ie(xe,Te,Oe),n=Pe(We,Ue,f,a,pe,be,je,A,i,t),Te=f.join(""),void 0!==n)if(0===(je=(Ue=n.trim()).length))A=0,Ue="";if(je>0)switch(A){case fe:Te=Te.replace(x,Me);case ue:case ie:case Q:Ue=Te+"{"+Ue+"}";break;case te:if(Ue=(Te=Te.replace(b,"$1 $2"+(Be>0?De:"")))+"{"+Ue+"}",1===Ae||2===Ae&&Le("@"+Ue,3))Ue="@"+N+Ue+"@"+Ue;else Ue="@"+Ue;break;default:if(Ue=Te+Ue,t===de)Ve+=Ue,Ue="";}else Ue="";break;default:Ue=He(a,Ie(a,Te,Oe),Ue,t,i+1);}Xe+=Ue,O=0,$e=0,z=0,we=0,Oe=0,j=0,Te="",Ue="",C=s.charCodeAt(++R);break;case q:case W:if((je=(Te=(we>0?Te.replace(c,""):Te).trim()).length)>1){if(0===z)if((g=Te.charCodeAt(0))===Q||g>96&&g<123)je=(Te=Te.replace(" ",":")).length;if(ye>0)if(void 0!==(n=Pe(Se,Te,a,e,pe,be,Ve.length,t,i,t)))if(0===(je=(Te=n.trim()).length))Te="\0\0";switch(g=Te.charCodeAt(0),A=Te.charCodeAt(1),g){case re:break;case L:if(A===oe||A===he){Ye+=Te+s.charAt(R);break}default:if(Te.charCodeAt(je-1)===V)break;Ve+=Ke(Te,g,A,Te.charCodeAt(2));}}O=0,$e=0,z=0,we=0,Oe=0,Te="",C=s.charCodeAt(++R);}}switch(C){case J:case I:if(h+d+u+o+ve===0)switch($){case E:case X:case Y:case L:case ae:case _:case T:case ee:case Z:case Q:case V:case U:case W:case B:case q:break;default:if(z>0)$e=1;}if(h===Z)h=0;else if(ge+O===0&&t!==te&&Te.length>0)we=1,Te+="\0";if(ye*qe>0)Pe(Ne,Te,a,e,pe,be,Ve.length,t,i,t);be=1,pe++;break;case W:case q:if(h+d+u+o===0){be++;break}default:switch(be++,Re=s.charAt(R),C){case K:case M:if(d+o+h===0)switch(w){case U:case V:case K:case M:Re="";break;default:if(C!==M)Re=" ";}break;case re:Re="\\0";break;case ce:Re="\\f";break;case se:Re="\\v";break;case P:if(d+h+o===0&&ge>0)Oe=1,we=1,Re="\f"+Re;break;case 108:if(d+h+o+ke===0&&z>0)switch(R-z){case 2:if(w===ne&&s.charCodeAt(R-3)===V)ke=w;case 8:if(m===le)ke=m;}break;case V:if(d+h+o===0)z=R;break;case U:if(h+u+d+o===0)we=1,Re+="\r";break;case Y:case X:if(0===h)d=d===C?0:0===d?C:d;break;case G:if(d+h+u===0)o++;break;case H:if(d+h+u===0)o--;break;case E:if(d+h+o===0)u--;break;case D:if(d+h+o===0){if(0===O)switch(2*w+3*m){case 533:break;default:y=0,O=1;}u++;}break;case L:if(h+u+d+o+z+j===0)j=1;break;case T:case Z:if(d+o+u>0)break;switch(h){case 0:switch(2*C+3*s.charCodeAt(R+1)){case 235:h=Z;break;case 220:je=R,h=T;}break;case T:if(C===Z&&w===T&&je+2!==R){if(33===s.charCodeAt(je+2))Ve+=s.substring(je,R+1);Re="",h=0;}}}if(0===h){if(ge+d+o+j===0&&t!==te&&C!==W)switch(C){case U:case ae:case _:case ee:case E:case D:if(0===O){switch(w){case K:case M:case I:case J:Re+="\0";break;default:Re="\0"+Re+(C===U?"":"\0");}we=1;}else switch(C){case D:if(z+7===R&&108===w)z=0;O=++y;break;case E:if(0==(O=--y))we=1,Re+="\0";}break;case K:case M:switch(w){case re:case B:case q:case W:case U:case ce:case K:case M:case I:case J:break;default:if(0===O)we=1,Re+="\0";}}if(Te+=Re,C!==M&&C!==K)$=C;}}m=w,w=C,R++;}if(je=Ve.length,me>0)if(0===je&&0===Xe.length&&0===a[0].length==false)if(t!==ie||1===a.length&&(ge>0?Ee:Ge)===a[0])je=a.join(",").length+2;if(je>0){if(f=0===ge&&t!==te?function(e){for(var a,r,s=0,t=e.length,i=Array(t);s<t;++s){for(var f=e[s].split(l),n="",o=0,h=0,u=0,d=0,b=f.length;o<b;++o){if(0===(h=(r=f[o]).length)&&b>1)continue;if(u=n.charCodeAt(n.length-1),d=r.charCodeAt(0),a="",0!==o)switch(u){case T:case ae:case _:case ee:case M:case D:break;default:a=" ";}switch(d){case P:r=a+Ee;case ae:case _:case ee:case M:case E:case D:break;case G:r=a+r+Ee;break;case V:switch(2*r.charCodeAt(1)+3*r.charCodeAt(2)){case 530:if(Ce>0){r=a+r.substring(8,h-1);break}default:if(o<1||f[o-1].length<1)r=a+Ee+r;}break;case U:a="";default:if(h>1&&r.indexOf(":")>0)r=a+r.replace(v,"$1"+Ee+"$2");else r=a+r+Ee;}n+=r;}i[s]=n.replace(c,"").trim();}return i}(a):a,ye>0)if(void 0!==(n=Pe(Fe,Ve,f,e,pe,be,je,t,i,t))&&0===(Ve=n).length)return Ye+Ve+Xe;if(Ve=f.join(",")+"{"+Ve+"}",Ae*ke!=0){if(2===Ae&&!Le(Ve,2))ke=0;switch(ke){case le:Ve=Ve.replace(k,":"+S+"$1")+Ve;break;case ne:Ve=Ve.replace(p,"::"+N+"input-$1")+Ve.replace(p,"::"+S+"$1")+Ve.replace(p,":"+F+"input-$1")+Ve;}ke=0;}}return Ye+Ve+Xe}function Ie(e,a,r){var c=a.trim().split(o),s=c,t=c.length,i=e.length;switch(i){case 0:case 1:for(var f=0,n=0===i?"":e[0]+" ";f<t;++f)s[f]=Je(n,s[f],r,i).trim();break;default:f=0;var l=0;for(s=[];f<t;++f)for(var h=0;h<i;++h)s[l++]=Je(e[h]+" ",c[f],r,i).trim();}return s}function Je(e,a,r,c){var s=a,t=s.charCodeAt(0);if(t<33)t=(s=s.trim()).charCodeAt(0);switch(t){case P:switch(ge+c){case 0:case 1:if(0===e.trim().length)break;default:return s.replace(h,"$1"+e.trim())}break;case V:switch(s.charCodeAt(1)){case 103:if(Ce>0&&ge>0)return s.replace(u,"$1").replace(h,"$1"+Ge);break;default:return e.trim()+s.replace(h,"$1"+e.trim())}default:if(r*ge>0&&s.indexOf("\f")>0)return s.replace(h,(e.charCodeAt(0)===V?"":"$1")+e.trim())}return e+s}function Ke(e,a,r,c){var l,o=0,h=e+";",u=2*a+3*r+4*c;if(944===u)return function(e){var a=e.length,r=e.indexOf(":",9)+1,c=e.substring(0,r).trim(),s=e.substring(r,a-1).trim();switch(e.charCodeAt(9)*Be){case 0:break;case Q:if(110!==e.charCodeAt(10))break;default:for(var t=s.split((s="",f)),i=0,r=0,a=t.length;i<a;r=0,++i){for(var l=t[i],o=l.split(n);l=o[r];){var h=l.charCodeAt(0);if(1===Be&&(h>L&&h<90||h>96&&h<123||h===R||h===Q&&l.charCodeAt(1)!==Q))switch(isNaN(parseFloat(l))+(-1!==l.indexOf("("))){case 1:switch(l){case"infinite":case"alternate":case"backwards":case"running":case"normal":case"forwards":case"both":case"none":case"linear":case"ease":case"ease-in":case"ease-out":case"ease-in-out":case"paused":case"reverse":case"alternate-reverse":case"inherit":case"initial":case"unset":case"step-start":case"step-end":break;default:l+=De;}}o[r++]=l;}s+=(0===i?"":",")+o.join(" ");}}if(s=c+s+";",1===Ae||2===Ae&&Le(s,1))return N+s+s;return s}(h);else if(0===Ae||2===Ae&&!Le(h,1))return h;switch(u){case 1015:return 97===h.charCodeAt(10)?N+h+h:h;case 951:return 116===h.charCodeAt(3)?N+h+h:h;case 963:return 110===h.charCodeAt(5)?N+h+h:h;case 1009:if(100!==h.charCodeAt(4))break;case 969:case 942:return N+h+h;case 978:return N+h+S+h+h;case 1019:case 983:return N+h+S+h+F+h+h;case 883:if(h.charCodeAt(8)===Q)return N+h+h;if(h.indexOf("image-set(",11)>0)return h.replace(z,"$1"+N+"$2")+h;return h;case 932:if(h.charCodeAt(4)===Q)switch(h.charCodeAt(5)){case 103:return N+"box-"+h.replace("-grow","")+N+h+F+h.replace("grow","positive")+h;case 115:return N+h+F+h.replace("shrink","negative")+h;case 98:return N+h+F+h.replace("basis","preferred-size")+h}return N+h+F+h+h;case 964:return N+h+F+"flex-"+h+h;case 1023:if(99!==h.charCodeAt(8))break;return l=h.substring(h.indexOf(":",15)).replace("flex-","").replace("space-between","justify"),N+"box-pack"+l+N+h+F+"flex-pack"+l+h;case 1005:return t.test(h)?h.replace(s,":"+N)+h.replace(s,":"+S)+h:h;case 1e3:switch(o=(l=h.substring(13).trim()).indexOf("-")+1,l.charCodeAt(0)+l.charCodeAt(o)){case 226:l=h.replace(m,"tb");break;case 232:l=h.replace(m,"tb-rl");break;case 220:l=h.replace(m,"lr");break;default:return h}return N+h+F+l+h;case 1017:if(-1===h.indexOf("sticky",9))return h;case 975:switch(o=(h=e).length-10,u=(l=(33===h.charCodeAt(o)?h.substring(0,o):h).substring(e.indexOf(":",7)+1).trim()).charCodeAt(0)+(0|l.charCodeAt(7))){case 203:if(l.charCodeAt(8)<111)break;case 115:h=h.replace(l,N+l)+";"+h;break;case 207:case 102:h=h.replace(l,N+(u>102?"inline-":"")+"box")+";"+h.replace(l,N+l)+";"+h.replace(l,F+l+"box")+";"+h;}return h+";";case 938:if(h.charCodeAt(5)===Q)switch(h.charCodeAt(6)){case 105:return l=h.replace("-items",""),N+h+N+"box-"+l+F+"flex-"+l+h;case 115:return N+h+F+"flex-item-"+h.replace(y,"")+h;default:return N+h+F+"flex-line-pack"+h.replace("align-content","").replace(y,"")+h}break;case 973:case 989:if(h.charCodeAt(3)!==Q||122===h.charCodeAt(4))break;case 931:case 953:if(true===j.test(e))if(115===(l=e.substring(e.indexOf(":")+1)).charCodeAt(0))return Ke(e.replace("stretch","fill-available"),a,r,c).replace(":fill-available",":stretch");else return h.replace(l,N+l)+h.replace(l,S+l.replace("fill-",""))+h;break;case 962:if(h=N+h+(102===h.charCodeAt(5)?F+h:"")+h,r+c===211&&105===h.charCodeAt(13)&&h.indexOf("transform",10)>0)return h.substring(0,h.indexOf(";",27)+1).replace(i,"$1"+N+"$2")+h}return h}function Le(e,a){var r=e.indexOf(1===a?":":"{"),c=e.substring(0,3!==a?r:10),s=e.substring(r+1,e.length-1);return Oe(2!==a?c:c.replace(O,"$1"),s,a)}function Me(e,a){var r=Ke(a,a.charCodeAt(0),a.charCodeAt(1),a.charCodeAt(2));return r!==a+";"?r.replace($," or ($1)").substring(4):"("+a+")"}function Pe(e,a,r,c,s,t,i,f,n,l){for(var o,h=0,u=a;h<ye;++h)switch(o=$e[h].call(Te,e,u,r,c,s,t,i,f,n,l)){case void 0:case false:case true:case null:break;default:u=o;}if(u!==a)return u}function Qe(e,a,r,c){for(var s=a+1;s<r;++s)switch(c.charCodeAt(s)){case Z:if(e===T)if(c.charCodeAt(s-1)===T&&a+2!==s)return s+1;break;case I:if(e===Z)return s+1}return s}function Re(e){for(var a in e){var r=e[a];switch(a){case"keyframe":Be=0|r;break;case"global":Ce=0|r;break;case"cascade":ge=0|r;break;case"compress":we=0|r;break;case"semicolon":ve=0|r;break;case"preserve":me=0|r;break;case"prefix":if(Oe=null,!r)Ae=0;else if("function"!=typeof r)Ae=1;else Ae=2,Oe=r;}}return Re}function Te(a,r){if(void 0!==this&&this.constructor===Te)return e(a);var s=a,t=s.charCodeAt(0);if(t<33)t=(s=s.trim()).charCodeAt(0);if(Be>0)De=s.replace(d,t===G?"":"-");if(t=1,1===ge)Ge=s;else Ee=s;var i,f=[Ge];if(ye>0)if(void 0!==(i=Pe(ze,r,f,f,pe,be,0,0,0,0))&&"string"==typeof i)r=i;var n=He(xe,f,r,0,0);if(ye>0)if(void 0!==(i=Pe(je,n,f,f,pe,be,n.length,0,0,0))&&"string"!=typeof(n=i))t=0;return De="",Ge="",Ee="",ke=0,pe=1,be=1,we*t==0?n:n.replace(c,"").replace(g,"").replace(A,"$1").replace(C,"$1").replace(w," ")}if(Te.use=function e(a){switch(a){case void 0:case null:ye=$e.length=0;break;default:if("function"==typeof a)$e[ye++]=a;else if("object"==typeof a)for(var r=0,c=a.length;r<c;++r)e(a[r]);else qe=0|!!a;}return e},Te.set=Re,void 0!==a)Re(a);return Te});

      }(stylis_min));

      var stylisRuleSheet = {exports: {}};

      (function (module, exports) {
      (function (factory) {
      	(module['exports'] = factory()) ;
      }(function () {

      	return function (insertRule) {
      		var delimiter = '/*|*/';
      		var needle = delimiter+'}';

      		function toSheet (block) {
      			if (block)
      				try {
      					insertRule(block + '}');
      				} catch (e) {}
      		}

      		return function ruleSheet (context, content, selectors, parents, line, column, length, ns, depth, at) {
      			switch (context) {
      				// property
      				case 1:
      					// @import
      					if (depth === 0 && content.charCodeAt(0) === 64)
      						return insertRule(content+';'), ''
      					break
      				// selector
      				case 2:
      					if (ns === 0)
      						return content + delimiter
      					break
      				// at-rule
      				case 3:
      					switch (ns) {
      						// @font-face, @page
      						case 102:
      						case 112:
      							return insertRule(selectors[0]+content), ''
      						default:
      							return content + (at === 0 ? delimiter : '')
      					}
      				case -2:
      					content.split(needle).forEach(toSheet);
      			}
      		}
      	}
      }));
      }(stylisRuleSheet));

      var unitless_browser_cjs = {};

      Object.defineProperty(unitless_browser_cjs, '__esModule', { value: true });

      var unitlessKeys = {
        animationIterationCount: 1,
        borderImageOutset: 1,
        borderImageSlice: 1,
        borderImageWidth: 1,
        boxFlex: 1,
        boxFlexGroup: 1,
        boxOrdinalGroup: 1,
        columnCount: 1,
        columns: 1,
        flex: 1,
        flexGrow: 1,
        flexPositive: 1,
        flexShrink: 1,
        flexNegative: 1,
        flexOrder: 1,
        gridRow: 1,
        gridRowEnd: 1,
        gridRowSpan: 1,
        gridRowStart: 1,
        gridColumn: 1,
        gridColumnEnd: 1,
        gridColumnSpan: 1,
        gridColumnStart: 1,
        msGridRow: 1,
        msGridRowSpan: 1,
        msGridColumn: 1,
        msGridColumnSpan: 1,
        fontWeight: 1,
        lineHeight: 1,
        opacity: 1,
        order: 1,
        orphans: 1,
        tabSize: 1,
        widows: 1,
        zIndex: 1,
        zoom: 1,
        WebkitLineClamp: 1,
        // SVG-related properties
        fillOpacity: 1,
        floodOpacity: 1,
        stopOpacity: 1,
        strokeDasharray: 1,
        strokeDashoffset: 1,
        strokeMiterlimit: 1,
        strokeOpacity: 1,
        strokeWidth: 1
      };

      unitless_browser_cjs.default = unitlessKeys;

      var reactIs$1 = {exports: {}};

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

      {
        reactIs$1.exports = reactIs_production_min;
      }

      function areInputsEqual(newInputs, lastInputs) {
          if (newInputs.length !== lastInputs.length) {
              return false;
          }
          for (var i = 0; i < newInputs.length; i++) {
              if (newInputs[i] !== lastInputs[i]) {
                  return false;
              }
          }
          return true;
      }

      function memoizeOne(resultFn, isEqual) {
          if (isEqual === void 0) { isEqual = areInputsEqual; }
          var lastThis;
          var lastArgs = [];
          var lastResult;
          var calledOnce = false;
          function memoized() {
              var newArgs = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  newArgs[_i] = arguments[_i];
              }
              if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
                  return lastResult;
              }
              lastResult = resultFn.apply(this, newArgs);
              calledOnce = true;
              lastThis = this;
              lastArgs = newArgs;
              return lastResult;
          }
          return memoized;
      }

      var memoizeOne_cjs = memoizeOne;

      var propTypes = {exports: {}};

      /*
      object-assign
      (c) Sindre Sorhus
      @license MIT
      */
      /* eslint-disable no-unused-vars */
      var getOwnPropertySymbols$1 = Object.getOwnPropertySymbols;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var propIsEnumerable = Object.prototype.propertyIsEnumerable;

      function toObject(val) {
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
      	var to = toObject(target);
      	var symbols;

      	for (var s = 1; s < arguments.length; s++) {
      		from = Object(arguments[s]);

      		for (var key in from) {
      			if (hasOwnProperty.call(from, key)) {
      				to[key] = from[key];
      			}
      		}

      		if (getOwnPropertySymbols$1) {
      			symbols = getOwnPropertySymbols$1(from);
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

      var isPropValid_browser_cjs = {};

      var memoize_browser_cjs = {};

      Object.defineProperty(memoize_browser_cjs, '__esModule', { value: true });

      function memoize$2(fn) {
        var cache = {};
        return function (arg) {
          if (cache[arg] === undefined) cache[arg] = fn(arg);
          return cache[arg];
        };
      }

      memoize_browser_cjs.default = memoize$2;

      Object.defineProperty(isPropValid_browser_cjs, '__esModule', { value: true });

      function _interopDefault$1 (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

      var memoize$1 = _interopDefault$1(memoize_browser_cjs);

      var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

      var index = memoize$1(function (prop) {
        return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
        /* o */
        && prop.charCodeAt(1) === 110
        /* n */
        && prop.charCodeAt(2) < 91;
      }
      /* Z+1 */
      );

      isPropValid_browser_cjs.default = index;

      var index_cjs$1 = {};

      var index_cjs = {};

      Object.defineProperty(index_cjs, '__esModule', { value: true });

      /**
       * Returns the object type of the given payload
       *
       * @param {*} payload
       * @returns {string}
       */
      function getType(payload) {
          return Object.prototype.toString.call(payload).slice(8, -1);
      }
      /**
       * Returns whether the payload is undefined
       *
       * @param {*} payload
       * @returns {payload is undefined}
       */
      function isUndefined(payload) {
          return getType(payload) === 'Undefined';
      }
      /**
       * Returns whether the payload is null
       *
       * @param {*} payload
       * @returns {payload is null}
       */
      function isNull(payload) {
          return getType(payload) === 'Null';
      }
      /**
       * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
       *
       * @param {*} payload
       * @returns {payload is Record<string, any>}
       */
      function isPlainObject$1(payload) {
          if (getType(payload) !== 'Object')
              return false;
          return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype;
      }
      /**
       * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
       *
       * @param {*} payload
       * @returns {payload is Record<string, any>}
       */
      function isObject(payload) {
          return isPlainObject$1(payload);
      }
      /**
       * Returns whether the payload is a an empty object (excluding special classes or objects with other prototypes)
       *
       * @param {*} payload
       * @returns {payload is { [K in any]: never }}
       */
      function isEmptyObject(payload) {
          return isPlainObject$1(payload) && Object.keys(payload).length === 0;
      }
      /**
       * Returns whether the payload is an any kind of object (including special classes or objects with different prototypes)
       *
       * @param {*} payload
       * @returns {payload is Record<string, any>}
       */
      function isAnyObject(payload) {
          return getType(payload) === 'Object';
      }
      /**
       * Returns whether the payload is an object like a type passed in < >
       *
       * Usage: isObjectLike<{id: any}>(payload) // will make sure it's an object and has an `id` prop.
       *
       * @template T this must be passed in < >
       * @param {*} payload
       * @returns {payload is T}
       */
      function isObjectLike(payload) {
          return isAnyObject(payload);
      }
      /**
       * Returns whether the payload is a function (regular or async)
       *
       * @param {*} payload
       * @returns {payload is AnyFunction}
       */
      function isFunction$1(payload) {
          return typeof payload === "function";
      }
      /**
       * Returns whether the payload is an array
       *
       * @param {any} payload
       * @returns {payload is any[]}
       */
      function isArray(payload) {
          return getType(payload) === 'Array';
      }
      /**
       * Returns whether the payload is a an array with at least 1 item
       *
       * @param {*} payload
       * @returns {payload is any[]}
       */
      function isFullArray(payload) {
          return isArray(payload) && payload.length > 0;
      }
      /**
       * Returns whether the payload is a an empty array
       *
       * @param {*} payload
       * @returns {payload is []}
       */
      function isEmptyArray(payload) {
          return isArray(payload) && payload.length === 0;
      }
      /**
       * Returns whether the payload is a string
       *
       * @param {*} payload
       * @returns {payload is string}
       */
      function isString(payload) {
          return getType(payload) === 'String';
      }
      /**
       * Returns whether the payload is a string, BUT returns false for ''
       *
       * @param {*} payload
       * @returns {payload is string}
       */
      function isFullString(payload) {
          return isString(payload) && payload !== '';
      }
      /**
       * Returns whether the payload is ''
       *
       * @param {*} payload
       * @returns {payload is string}
       */
      function isEmptyString(payload) {
          return payload === '';
      }
      /**
       * Returns whether the payload is a number (but not NaN)
       *
       * This will return `false` for `NaN`!!
       *
       * @param {*} payload
       * @returns {payload is number}
       */
      function isNumber(payload) {
          return getType(payload) === 'Number' && !isNaN(payload);
      }
      /**
       * Returns whether the payload is a boolean
       *
       * @param {*} payload
       * @returns {payload is boolean}
       */
      function isBoolean(payload) {
          return getType(payload) === 'Boolean';
      }
      /**
       * Returns whether the payload is a regular expression (RegExp)
       *
       * @param {*} payload
       * @returns {payload is RegExp}
       */
      function isRegExp(payload) {
          return getType(payload) === 'RegExp';
      }
      /**
       * Returns whether the payload is a Map
       *
       * @param {*} payload
       * @returns {payload is Map<any, any>}
       */
      function isMap(payload) {
          return getType(payload) === 'Map';
      }
      /**
       * Returns whether the payload is a WeakMap
       *
       * @param {*} payload
       * @returns {payload is WeakMap<any, any>}
       */
      function isWeakMap(payload) {
          return getType(payload) === 'WeakMap';
      }
      /**
       * Returns whether the payload is a Set
       *
       * @param {*} payload
       * @returns {payload is Set<any>}
       */
      function isSet(payload) {
          return getType(payload) === 'Set';
      }
      /**
       * Returns whether the payload is a WeakSet
       *
       * @param {*} payload
       * @returns {payload is WeakSet<any>}
       */
      function isWeakSet(payload) {
          return getType(payload) === 'WeakSet';
      }
      /**
       * Returns whether the payload is a Symbol
       *
       * @param {*} payload
       * @returns {payload is symbol}
       */
      function isSymbol(payload) {
          return getType(payload) === 'Symbol';
      }
      /**
       * Returns whether the payload is a Date, and that the date is valid
       *
       * @param {*} payload
       * @returns {payload is Date}
       */
      function isDate(payload) {
          return getType(payload) === 'Date' && !isNaN(payload);
      }
      /**
       * Returns whether the payload is a Blob
       *
       * @param {*} payload
       * @returns {payload is Blob}
       */
      function isBlob(payload) {
          return getType(payload) === 'Blob';
      }
      /**
       * Returns whether the payload is a File
       *
       * @param {*} payload
       * @returns {payload is File}
       */
      function isFile(payload) {
          return getType(payload) === 'File';
      }
      /**
       * Returns whether the payload is a Promise
       *
       * @param {*} payload
       * @returns {payload is Promise<any>}
       */
      function isPromise(payload) {
          return getType(payload) === 'Promise';
      }
      /**
       * Returns whether the payload is an Error
       *
       * @param {*} payload
       * @returns {payload is Error}
       */
      function isError(payload) {
          return getType(payload) === 'Error';
      }
      /**
       * Returns whether the payload is literally the value `NaN` (it's `NaN` and also a `number`)
       *
       * @param {*} payload
       * @returns {payload is typeof NaN}
       */
      function isNaNValue(payload) {
          return getType(payload) === 'Number' && isNaN(payload);
      }
      /**
       * Returns whether the payload is a primitive type (eg. Boolean | Null | Undefined | Number | String | Symbol)
       *
       * @param {*} payload
       * @returns {(payload is boolean | null | undefined | number | string | symbol)}
       */
      function isPrimitive(payload) {
          return (isBoolean(payload) ||
              isNull(payload) ||
              isUndefined(payload) ||
              isNumber(payload) ||
              isString(payload) ||
              isSymbol(payload));
      }
      /**
       * Returns true whether the payload is null or undefined
       *
       * @param {*} payload
       * @returns {(payload is null | undefined)}
       */
      function isNullOrUndefined(payload) {
          return isNull(payload) || isUndefined(payload);
      }
      /**
       * Does a generic check to check that the given payload is of a given type.
       * In cases like Number, it will return true for NaN as NaN is a Number (thanks javascript!);
       * It will, however, differentiate between object and null
       *
       * @template T
       * @param {*} payload
       * @param {T} type
       * @throws {TypeError} Will throw type error if type is an invalid type
       * @returns {payload is T}
       */
      function isType(payload, type) {
          if (!(type instanceof Function)) {
              throw new TypeError('Type must be a function');
          }
          if (!Object.prototype.hasOwnProperty.call(type, 'prototype')) {
              throw new TypeError('Type is not a class');
          }
          // Classes usually have names (as functions usually have names)
          var name = type.name;
          return getType(payload) === name || Boolean(payload && payload.constructor === type);
      }

      index_cjs.getType = getType;
      index_cjs.isAnyObject = isAnyObject;
      index_cjs.isArray = isArray;
      index_cjs.isBlob = isBlob;
      index_cjs.isBoolean = isBoolean;
      index_cjs.isDate = isDate;
      index_cjs.isEmptyArray = isEmptyArray;
      index_cjs.isEmptyObject = isEmptyObject;
      index_cjs.isEmptyString = isEmptyString;
      index_cjs.isError = isError;
      index_cjs.isFile = isFile;
      index_cjs.isFullArray = isFullArray;
      index_cjs.isFullString = isFullString;
      index_cjs.isFunction = isFunction$1;
      index_cjs.isMap = isMap;
      index_cjs.isNaNValue = isNaNValue;
      index_cjs.isNull = isNull;
      index_cjs.isNullOrUndefined = isNullOrUndefined;
      index_cjs.isNumber = isNumber;
      index_cjs.isObject = isObject;
      index_cjs.isObjectLike = isObjectLike;
      index_cjs.isPlainObject = isPlainObject$1;
      index_cjs.isPrimitive = isPrimitive;
      index_cjs.isPromise = isPromise;
      index_cjs.isRegExp = isRegExp;
      index_cjs.isSet = isSet;
      index_cjs.isString = isString;
      index_cjs.isSymbol = isSymbol;
      index_cjs.isType = isType;
      index_cjs.isUndefined = isUndefined;
      index_cjs.isWeakMap = isWeakMap;
      index_cjs.isWeakSet = isWeakSet;

      Object.defineProperty(index_cjs$1, '__esModule', { value: true });

      var isWhat = index_cjs;

      /*! *****************************************************************************
      Copyright (c) Microsoft Corporation. All rights reserved.
      Licensed under the Apache License, Version 2.0 (the "License"); you may not use
      this file except in compliance with the License. You may obtain a copy of the
      License at http://www.apache.org/licenses/LICENSE-2.0

      THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
      KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
      WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
      MERCHANTABLITY OR NON-INFRINGEMENT.

      See the Apache Version 2.0 License for specific language governing permissions
      and limitations under the License.
      ***************************************************************************** */

      function __spreadArrays() {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
              for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                  r[k] = a[j];
          return r;
      }

      function assignProp(carry, key, newVal, originalObject) {
          var propType = originalObject.propertyIsEnumerable(key)
              ? 'enumerable'
              : 'nonenumerable';
          if (propType === 'enumerable')
              carry[key] = newVal;
          if (propType === 'nonenumerable') {
              Object.defineProperty(carry, key, {
                  value: newVal,
                  enumerable: false,
                  writable: true,
                  configurable: true
              });
          }
      }
      function mergeRecursively(origin, newComer, extensions) {
          // work directly on newComer if its not an object
          if (!isWhat.isPlainObject(newComer)) {
              // extend merge rules
              if (extensions && isWhat.isArray(extensions)) {
                  extensions.forEach(function (extend) {
                      newComer = extend(origin, newComer);
                  });
              }
              return newComer;
          }
          // define newObject to merge all values upon
          var newObject = {};
          if (isWhat.isPlainObject(origin)) {
              var props_1 = Object.getOwnPropertyNames(origin);
              var symbols_1 = Object.getOwnPropertySymbols(origin);
              newObject = __spreadArrays(props_1, symbols_1).reduce(function (carry, key) {
                  // @ts-ignore
                  var targetVal = origin[key];
                  if ((!isWhat.isSymbol(key) && !Object.getOwnPropertyNames(newComer).includes(key)) ||
                      (isWhat.isSymbol(key) && !Object.getOwnPropertySymbols(newComer).includes(key))) {
                      assignProp(carry, key, targetVal, origin);
                  }
                  return carry;
              }, {});
          }
          var props = Object.getOwnPropertyNames(newComer);
          var symbols = Object.getOwnPropertySymbols(newComer);
          var result = __spreadArrays(props, symbols).reduce(function (carry, key) {
              // re-define the origin and newComer as targetVal and newVal
              var newVal = newComer[key];
              var targetVal = (isWhat.isPlainObject(origin))
                  // @ts-ignore
                  ? origin[key]
                  : undefined;
              // extend merge rules
              if (extensions && isWhat.isArray(extensions)) {
                  extensions.forEach(function (extend) {
                      newVal = extend(targetVal, newVal);
                  });
              }
              // When newVal is an object do the merge recursively
              if (targetVal !== undefined && isWhat.isPlainObject(newVal)) {
                  newVal = mergeRecursively(targetVal, newVal, extensions);
              }
              assignProp(carry, key, newVal, newComer);
              return carry;
          }, newObject);
          return result;
      }
      /**
       * Merge anything recursively.
       * Objects get merged, special objects (classes etc.) are re-assigned "as is".
       * Basic types overwrite objects or other basic types.
       *
       * @param {(IConfig | any)} origin
       * @param {...any[]} newComers
       * @returns the result
       */
      function merge$1(origin) {
          var newComers = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              newComers[_i - 1] = arguments[_i];
          }
          var extensions = null;
          var base = origin;
          if (isWhat.isPlainObject(origin) && origin.extensions && Object.keys(origin).length === 1) {
              base = {};
              extensions = origin.extensions;
          }
          return newComers.reduce(function (result, newComer) {
              return mergeRecursively(result, newComer, extensions);
          }, base);
      }

      function concatArrays(originVal, newVal) {
          if (isWhat.isArray(originVal) && isWhat.isArray(newVal)) {
              // concat logic
              return originVal.concat(newVal);
          }
          return newVal; // always return newVal as fallback!!
      }

      index_cjs$1.concatArrays = concatArrays;
      index_cjs$1.default = merge$1;
      index_cjs$1.merge = merge$1;

      Object.defineProperty(styledComponents_browser_cjs, '__esModule', { value: true });

      function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

      var Stylis = _interopDefault(stylis_min.exports);
      var _insertRulePlugin = _interopDefault(stylisRuleSheet.exports);
      var React = React$1;
      var React__default = _interopDefault(React);
      var unitless = _interopDefault(unitless_browser_cjs);
      var reactIs = reactIs$1.exports;
      var memoize = _interopDefault(memoizeOne_cjs);
      _interopDefault(propTypes.exports);
      var validAttr = _interopDefault(isPropValid_browser_cjs);
      var merge = _interopDefault(index_cjs$1);

      // 

      var interleave = (function (strings, interpolations) {
        var result = [strings[0]];

        for (var i = 0, len = interpolations.length; i < len; i += 1) {
          result.push(interpolations[i], strings[i + 1]);
        }

        return result;
      });

      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      var classCallCheck = function (instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };

      var createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      var inherits = function (subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      };

      var objectWithoutProperties = function (obj, keys) {
        var target = {};

        for (var i in obj) {
          if (keys.indexOf(i) >= 0) continue;
          if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
          target[i] = obj[i];
        }

        return target;
      };

      var possibleConstructorReturn = function (self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
      };

      // 
      var isPlainObject = (function (x) {
        return (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x.constructor === Object;
      });

      // 
      var EMPTY_ARRAY = Object.freeze([]);
      var EMPTY_OBJECT = Object.freeze({});

      // 
      function isFunction(test) {
        return typeof test === 'function';
      }

      // 

      function getComponentName(target) {
        return target.displayName || target.name || 'Component';
      }

      // 
      function isStatelessFunction(test) {
        return typeof test === 'function' && !(test.prototype && test.prototype.isReactComponent);
      }

      // 
      function isStyledComponent(target) {
        return target && typeof target.styledComponentId === 'string';
      }

      // 

      var SC_ATTR = typeof process !== 'undefined' && (process.env.REACT_APP_SC_ATTR || process.env.SC_ATTR) || 'data-styled';

      var SC_VERSION_ATTR = 'data-styled-version';

      var SC_STREAM_ATTR = 'data-styled-streamed';

      var IS_BROWSER = typeof window !== 'undefined' && 'HTMLElement' in window;

      var DISABLE_SPEEDY = typeof SC_DISABLE_SPEEDY === 'boolean' && SC_DISABLE_SPEEDY || typeof process !== 'undefined' && (process.env.REACT_APP_SC_DISABLE_SPEEDY || process.env.SC_DISABLE_SPEEDY) || "production" !== 'production';

      // Shared empty execution context when generating static styles
      var STATIC_EXECUTION_CONTEXT = {};

      /**
       * Create an error file out of errors.md for development and a simple web link to the full errors
       * in production mode.
       */

      var StyledComponentsError = function (_Error) {
        inherits(StyledComponentsError, _Error);

        function StyledComponentsError(code) {
          classCallCheck(this, StyledComponentsError);

          for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            interpolations[_key - 1] = arguments[_key];
          }

          var _this; {
            var _this = possibleConstructorReturn(this, _Error.call(this, 'An error occurred. See https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/utils/errors.md#' + code + ' for more information.' + (interpolations.length > 0 ? ' Additional arguments: ' + interpolations.join(', ') : '')));
          }
          return possibleConstructorReturn(_this);
        }

        return StyledComponentsError;
      }(Error);

      // 
      var SC_COMPONENT_ID = /^[^\S\n]*?\/\* sc-component-id:\s*(\S+)\s+\*\//gm;

      var extractComps = (function (maybeCSS) {
        var css = '' + (maybeCSS || ''); // Definitely a string, and a clone
        var existingComponents = [];
        css.replace(SC_COMPONENT_ID, function (match, componentId, matchIndex) {
          existingComponents.push({ componentId: componentId, matchIndex: matchIndex });
          return match;
        });
        return existingComponents.map(function (_ref, i) {
          var componentId = _ref.componentId,
              matchIndex = _ref.matchIndex;

          var nextComp = existingComponents[i + 1];
          var cssFromDOM = nextComp ? css.slice(matchIndex, nextComp.matchIndex) : css.slice(matchIndex);
          return { componentId: componentId, cssFromDOM: cssFromDOM };
        });
      });

      // 

      var COMMENT_REGEX = /^\s*\/\/.*$/gm;

      // NOTE: This stylis instance is only used to split rules from SSR'd style tags
      var stylisSplitter = new Stylis({
        global: false,
        cascade: true,
        keyframe: false,
        prefix: false,
        compress: false,
        semicolon: true
      });

      var stylis = new Stylis({
        global: false,
        cascade: true,
        keyframe: false,
        prefix: true,
        compress: false,
        semicolon: false // NOTE: This means "autocomplete missing semicolons"
      });

      // Wrap `insertRulePlugin to build a list of rules,
      // and then make our own plugin to return the rules. This
      // makes it easier to hook into the existing SSR architecture

      var parsingRules = [];

      // eslint-disable-next-line consistent-return
      var returnRulesPlugin = function returnRulesPlugin(context) {
        if (context === -2) {
          var parsedRules = parsingRules;
          parsingRules = [];
          return parsedRules;
        }
      };

      var parseRulesPlugin = _insertRulePlugin(function (rule) {
        parsingRules.push(rule);
      });

      var _componentId = void 0;
      var _selector = void 0;
      var _selectorRegexp = void 0;

      var selfReferenceReplacer = function selfReferenceReplacer(match, offset, string) {
        if (
        // the first self-ref is always untouched
        offset > 0 &&
        // there should be at least two self-refs to do a replacement (.b > .b)
        string.slice(0, offset).indexOf(_selector) !== -1 &&
        // no consecutive self refs (.b.b); that is a precedence boost and treated differently
        string.slice(offset - _selector.length, offset) !== _selector) {
          return '.' + _componentId;
        }

        return match;
      };

      /**
       * When writing a style like
       *
       * & + & {
       *   color: red;
       * }
       *
       * The second ampersand should be a reference to the static component class. stylis
       * has no knowledge of static class so we have to intelligently replace the base selector.
       */
      var selfReferenceReplacementPlugin = function selfReferenceReplacementPlugin(context, _, selectors) {
        if (context === 2 && selectors.length && selectors[0].lastIndexOf(_selector) > 0) {
          // eslint-disable-next-line no-param-reassign
          selectors[0] = selectors[0].replace(_selectorRegexp, selfReferenceReplacer);
        }
      };

      stylis.use([selfReferenceReplacementPlugin, parseRulesPlugin, returnRulesPlugin]);
      stylisSplitter.use([parseRulesPlugin, returnRulesPlugin]);

      var splitByRules = function splitByRules(css) {
        return stylisSplitter('', css);
      };

      function stringifyRules(rules, selector, prefix) {
        var componentId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '&';

        var flatCSS = rules.join('').replace(COMMENT_REGEX, ''); // replace JS comments

        var cssStr = selector && prefix ? prefix + ' ' + selector + ' { ' + flatCSS + ' }' : flatCSS;

        // stylis has no concept of state to be passed to plugins
        // but since JS is single=threaded, we can rely on that to ensure
        // these properties stay in sync with the current stylis run
        _componentId = componentId;
        _selector = selector;
        _selectorRegexp = new RegExp('\\' + _selector + '\\b', 'g');

        return stylis(prefix || !selector ? '' : selector, cssStr);
      }

      // 
      /* eslint-disable camelcase, no-undef */

      var getNonce = (function () {
        return typeof __webpack_nonce__ !== 'undefined' ? __webpack_nonce__ : null;
      });

      // 
      /* These are helpers for the StyleTags to keep track of the injected
       * rule names for each (component) ID that they're keeping track of.
       * They're crucial for detecting whether a name has already been
       * injected.
       * (This excludes rehydrated names) */

      /* adds a new ID:name pairing to a names dictionary */
      var addNameForId = function addNameForId(names, id, name) {
        if (name) {
          // eslint-disable-next-line no-param-reassign
          var namesForId = names[id] || (names[id] = Object.create(null));
          namesForId[name] = true;
        }
      };

      /* resets an ID entirely by overwriting it in the dictionary */
      var resetIdNames = function resetIdNames(names, id) {
        // eslint-disable-next-line no-param-reassign
        names[id] = Object.create(null);
      };

      /* factory for a names dictionary checking the existance of an ID:name pairing */
      var hasNameForId = function hasNameForId(names) {
        return function (id, name) {
          return names[id] !== undefined && names[id][name];
        };
      };

      /* stringifies names for the html/element output */
      var stringifyNames = function stringifyNames(names) {
        var str = '';
        // eslint-disable-next-line guard-for-in
        for (var id in names) {
          str += Object.keys(names[id]).join(' ') + ' ';
        }
        return str.trim();
      };

      /* clones the nested names dictionary */
      var cloneNames = function cloneNames(names) {
        var clone = Object.create(null);
        // eslint-disable-next-line guard-for-in
        for (var id in names) {
          clone[id] = _extends({}, names[id]);
        }
        return clone;
      };

      // 

      /* These are helpers that deal with the insertRule (aka speedy) API
       * They are used in the StyleTags and specifically the speedy tag
       */

      /* retrieve a sheet for a given style tag */
      var sheetForTag = function sheetForTag(tag) {
        // $FlowFixMe
        if (tag.sheet) return tag.sheet;

        /* Firefox quirk requires us to step through all stylesheets to find one owned by the given tag */
        var size = tag.ownerDocument.styleSheets.length;
        for (var i = 0; i < size; i += 1) {
          var sheet = tag.ownerDocument.styleSheets[i];
          // $FlowFixMe
          if (sheet.ownerNode === tag) return sheet;
        }

        /* we should always be able to find a tag */
        throw new StyledComponentsError(10);
      };

      /* insert a rule safely and return whether it was actually injected */
      var safeInsertRule = function safeInsertRule(sheet, cssRule, index) {
        /* abort early if cssRule string is falsy */
        if (!cssRule) return false;

        var maxIndex = sheet.cssRules.length;

        try {
          /* use insertRule and cap passed index with maxIndex (no of cssRules) */
          sheet.insertRule(cssRule, index <= maxIndex ? index : maxIndex);
        } catch (err) {
          /* any error indicates an invalid rule */
          return false;
        }

        return true;
      };

      /* deletes `size` rules starting from `removalIndex` */
      var deleteRules = function deleteRules(sheet, removalIndex, size) {
        var lowerBound = removalIndex - size;
        for (var i = removalIndex; i > lowerBound; i -= 1) {
          sheet.deleteRule(i);
        }
      };

      // 

      /* this marker separates component styles and is important for rehydration */
      var makeTextMarker = function makeTextMarker(id) {
        return '\n/* sc-component-id: ' + id + ' */\n';
      };

      /* add up all numbers in array up until and including the index */
      var addUpUntilIndex = function addUpUntilIndex(sizes, index) {
        var totalUpToIndex = 0;
        for (var i = 0; i <= index; i += 1) {
          totalUpToIndex += sizes[i];
        }

        return totalUpToIndex;
      };

      /* create a new style tag after lastEl */
      var makeStyleTag = function makeStyleTag(target, tagEl, insertBefore) {
        var targetDocument = document;
        if (target) targetDocument = target.ownerDocument;else if (tagEl) targetDocument = tagEl.ownerDocument;

        var el = targetDocument.createElement('style');
        el.setAttribute(SC_ATTR, '');
        el.setAttribute(SC_VERSION_ATTR, "4.4.1");

        var nonce = getNonce();
        if (nonce) {
          el.setAttribute('nonce', nonce);
        }

        /* Work around insertRule quirk in EdgeHTML */
        el.appendChild(targetDocument.createTextNode(''));

        if (target && !tagEl) {
          /* Append to target when no previous element was passed */
          target.appendChild(el);
        } else {
          if (!tagEl || !target || !tagEl.parentNode) {
            throw new StyledComponentsError(6);
          }

          /* Insert new style tag after the previous one */
          tagEl.parentNode.insertBefore(el, insertBefore ? tagEl : tagEl.nextSibling);
        }

        return el;
      };

      /* takes a css factory function and outputs an html styled tag factory */
      var wrapAsHtmlTag = function wrapAsHtmlTag(css, names) {
        return function (additionalAttrs) {
          var nonce = getNonce();
          var attrs = [nonce && 'nonce="' + nonce + '"', SC_ATTR + '="' + stringifyNames(names) + '"', SC_VERSION_ATTR + '="' + "4.4.1" + '"', additionalAttrs];

          var htmlAttr = attrs.filter(Boolean).join(' ');
          return '<style ' + htmlAttr + '>' + css() + '</style>';
        };
      };

      /* takes a css factory function and outputs an element factory */
      var wrapAsElement = function wrapAsElement(css, names) {
        return function () {
          var _props;

          var props = (_props = {}, _props[SC_ATTR] = stringifyNames(names), _props[SC_VERSION_ATTR] = "4.4.1", _props);

          var nonce = getNonce();
          if (nonce) {
            // $FlowFixMe
            props.nonce = nonce;
          }

          // eslint-disable-next-line react/no-danger
          return React__default.createElement('style', _extends({}, props, { dangerouslySetInnerHTML: { __html: css() } }));
        };
      };

      var getIdsFromMarkersFactory = function getIdsFromMarkersFactory(markers) {
        return function () {
          return Object.keys(markers);
        };
      };

      /* speedy tags utilise insertRule */
      var makeSpeedyTag = function makeSpeedyTag(el, getImportRuleTag) {
        var names = Object.create(null);
        var markers = Object.create(null);
        var sizes = [];

        var extractImport = getImportRuleTag !== undefined;
        /* indicates whether getImportRuleTag was called */
        var usedImportRuleTag = false;

        var insertMarker = function insertMarker(id) {
          var prev = markers[id];
          if (prev !== undefined) {
            return prev;
          }

          markers[id] = sizes.length;
          sizes.push(0);
          resetIdNames(names, id);

          return markers[id];
        };

        var insertRules = function insertRules(id, cssRules, name) {
          var marker = insertMarker(id);
          var sheet = sheetForTag(el);
          var insertIndex = addUpUntilIndex(sizes, marker);

          var injectedRules = 0;
          var importRules = [];
          var cssRulesSize = cssRules.length;

          for (var i = 0; i < cssRulesSize; i += 1) {
            var cssRule = cssRules[i];
            var mayHaveImport = extractImport; /* @import rules are reordered to appear first */
            if (mayHaveImport && cssRule.indexOf('@import') !== -1) {
              importRules.push(cssRule);
            } else if (safeInsertRule(sheet, cssRule, insertIndex + injectedRules)) {
              mayHaveImport = false;
              injectedRules += 1;
            }
          }

          if (extractImport && importRules.length > 0) {
            usedImportRuleTag = true;
            // $FlowFixMe
            getImportRuleTag().insertRules(id + '-import', importRules);
          }

          sizes[marker] += injectedRules; /* add up no of injected rules */
          addNameForId(names, id, name);
        };

        var removeRules = function removeRules(id) {
          var marker = markers[id];
          if (marker === undefined) return;
          // $FlowFixMe
          if (el.isConnected === false) return;

          var size = sizes[marker];
          var sheet = sheetForTag(el);
          var removalIndex = addUpUntilIndex(sizes, marker) - 1;
          deleteRules(sheet, removalIndex, size);
          sizes[marker] = 0;
          resetIdNames(names, id);

          if (extractImport && usedImportRuleTag) {
            // $FlowFixMe
            getImportRuleTag().removeRules(id + '-import');
          }
        };

        var css = function css() {
          var _sheetForTag = sheetForTag(el),
              cssRules = _sheetForTag.cssRules;

          var str = '';

          // eslint-disable-next-line guard-for-in
          for (var id in markers) {
            str += makeTextMarker(id);
            var marker = markers[id];
            var end = addUpUntilIndex(sizes, marker);
            var size = sizes[marker];
            for (var i = end - size; i < end; i += 1) {
              var rule = cssRules[i];
              if (rule !== undefined) {
                str += rule.cssText;
              }
            }
          }

          return str;
        };

        return {
          clone: function clone() {
            throw new StyledComponentsError(5);
          },

          css: css,
          getIds: getIdsFromMarkersFactory(markers),
          hasNameForId: hasNameForId(names),
          insertMarker: insertMarker,
          insertRules: insertRules,
          removeRules: removeRules,
          sealed: false,
          styleTag: el,
          toElement: wrapAsElement(css, names),
          toHTML: wrapAsHtmlTag(css, names)
        };
      };

      var makeTextNode = function makeTextNode(targetDocument, id) {
        return targetDocument.createTextNode(makeTextMarker(id));
      };

      var makeBrowserTag = function makeBrowserTag(el, getImportRuleTag) {
        var names = Object.create(null);
        var markers = Object.create(null);

        var extractImport = getImportRuleTag !== undefined;

        /* indicates whether getImportRuleTag was called */
        var usedImportRuleTag = false;

        var insertMarker = function insertMarker(id) {
          var prev = markers[id];
          if (prev !== undefined) {
            return prev;
          }

          markers[id] = makeTextNode(el.ownerDocument, id);
          el.appendChild(markers[id]);
          names[id] = Object.create(null);

          return markers[id];
        };

        var insertRules = function insertRules(id, cssRules, name) {
          var marker = insertMarker(id);
          var importRules = [];
          var cssRulesSize = cssRules.length;

          for (var i = 0; i < cssRulesSize; i += 1) {
            var rule = cssRules[i];
            var mayHaveImport = extractImport;
            if (mayHaveImport && rule.indexOf('@import') !== -1) {
              importRules.push(rule);
            } else {
              mayHaveImport = false;
              var separator = i === cssRulesSize - 1 ? '' : ' ';
              marker.appendData('' + rule + separator);
            }
          }

          addNameForId(names, id, name);

          if (extractImport && importRules.length > 0) {
            usedImportRuleTag = true;
            // $FlowFixMe
            getImportRuleTag().insertRules(id + '-import', importRules);
          }
        };

        var removeRules = function removeRules(id) {
          var marker = markers[id];
          if (marker === undefined) return;

          /* create new empty text node and replace the current one */
          var newMarker = makeTextNode(el.ownerDocument, id);
          el.replaceChild(newMarker, marker);
          markers[id] = newMarker;
          resetIdNames(names, id);

          if (extractImport && usedImportRuleTag) {
            // $FlowFixMe
            getImportRuleTag().removeRules(id + '-import');
          }
        };

        var css = function css() {
          var str = '';

          // eslint-disable-next-line guard-for-in
          for (var id in markers) {
            str += markers[id].data;
          }

          return str;
        };

        return {
          clone: function clone() {
            throw new StyledComponentsError(5);
          },

          css: css,
          getIds: getIdsFromMarkersFactory(markers),
          hasNameForId: hasNameForId(names),
          insertMarker: insertMarker,
          insertRules: insertRules,
          removeRules: removeRules,
          sealed: false,
          styleTag: el,
          toElement: wrapAsElement(css, names),
          toHTML: wrapAsHtmlTag(css, names)
        };
      };

      var makeServerTag = function makeServerTag(namesArg, markersArg) {
        var names = namesArg === undefined ? Object.create(null) : namesArg;
        var markers = markersArg === undefined ? Object.create(null) : markersArg;

        var insertMarker = function insertMarker(id) {
          var prev = markers[id];
          if (prev !== undefined) {
            return prev;
          }

          return markers[id] = [''];
        };

        var insertRules = function insertRules(id, cssRules, name) {
          var marker = insertMarker(id);
          marker[0] += cssRules.join(' ');
          addNameForId(names, id, name);
        };

        var removeRules = function removeRules(id) {
          var marker = markers[id];
          if (marker === undefined) return;
          marker[0] = '';
          resetIdNames(names, id);
        };

        var css = function css() {
          var str = '';
          // eslint-disable-next-line guard-for-in
          for (var id in markers) {
            var cssForId = markers[id][0];
            if (cssForId) {
              str += makeTextMarker(id) + cssForId;
            }
          }
          return str;
        };

        var clone = function clone() {
          var namesClone = cloneNames(names);
          var markersClone = Object.create(null);

          // eslint-disable-next-line guard-for-in
          for (var id in markers) {
            markersClone[id] = [markers[id][0]];
          }

          return makeServerTag(namesClone, markersClone);
        };

        var tag = {
          clone: clone,
          css: css,
          getIds: getIdsFromMarkersFactory(markers),
          hasNameForId: hasNameForId(names),
          insertMarker: insertMarker,
          insertRules: insertRules,
          removeRules: removeRules,
          sealed: false,
          styleTag: null,
          toElement: wrapAsElement(css, names),
          toHTML: wrapAsHtmlTag(css, names)
        };

        return tag;
      };

      var makeTag = function makeTag(target, tagEl, forceServer, insertBefore, getImportRuleTag) {
        if (IS_BROWSER && !forceServer) {
          var el = makeStyleTag(target, tagEl, insertBefore);

          if (DISABLE_SPEEDY) {
            return makeBrowserTag(el, getImportRuleTag);
          } else {
            return makeSpeedyTag(el, getImportRuleTag);
          }
        }

        return makeServerTag();
      };

      var rehydrate = function rehydrate(tag, els, extracted) {
        /* add all extracted components to the new tag */
        for (var i = 0, len = extracted.length; i < len; i += 1) {
          var _extracted$i = extracted[i],
              componentId = _extracted$i.componentId,
              cssFromDOM = _extracted$i.cssFromDOM;

          var cssRules = splitByRules(cssFromDOM);
          tag.insertRules(componentId, cssRules);
        }

        /* remove old HTMLStyleElements, since they have been rehydrated */
        for (var _i = 0, _len = els.length; _i < _len; _i += 1) {
          var el = els[_i];
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }
      };

      // 

      var SPLIT_REGEX = /\s+/;

      /* determine the maximum number of components before tags are sharded */
      var MAX_SIZE = void 0;
      if (IS_BROWSER) {
        /* in speedy mode we can keep a lot more rules in a sheet before a slowdown can be expected */
        MAX_SIZE = DISABLE_SPEEDY ? 40 : 1000;
      } else {
        /* for servers we do not need to shard at all */
        MAX_SIZE = -1;
      }

      var sheetRunningId = 0;
      var master = void 0;

      var StyleSheet = function () {

        /* a map from ids to tags */

        /* deferred rules for a given id */

        /* this is used for not reinjecting rules via hasNameForId() */

        /* when rules for an id are removed using remove() we have to ignore rehydratedNames for it */

        /* a list of tags belonging to this StyleSheet */

        /* a tag for import rules */

        /* current capacity until a new tag must be created */

        /* children (aka clones) of this StyleSheet inheriting all and future injections */

        function StyleSheet() {
          var _this = this;

          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IS_BROWSER ? document.head : null;
          var forceServer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          classCallCheck(this, StyleSheet);

          this.getImportRuleTag = function () {
            var importRuleTag = _this.importRuleTag;

            if (importRuleTag !== undefined) {
              return importRuleTag;
            }

            var firstTag = _this.tags[0];
            var insertBefore = true;

            return _this.importRuleTag = makeTag(_this.target, firstTag ? firstTag.styleTag : null, _this.forceServer, insertBefore);
          };

          sheetRunningId += 1;
          this.id = sheetRunningId;
          this.forceServer = forceServer;
          this.target = forceServer ? null : target;
          this.tagMap = {};
          this.deferred = {};
          this.rehydratedNames = {};
          this.ignoreRehydratedNames = {};
          this.tags = [];
          this.capacity = 1;
          this.clones = [];
        }

        /* rehydrate all SSR'd style tags */


        StyleSheet.prototype.rehydrate = function rehydrate$$1() {
          if (!IS_BROWSER || this.forceServer) return this;

          var els = [];
          var extracted = [];
          var isStreamed = false;

          /* retrieve all of our SSR style elements from the DOM */
          var nodes = document.querySelectorAll('style[' + SC_ATTR + '][' + SC_VERSION_ATTR + '="' + "4.4.1" + '"]');

          var nodesSize = nodes.length;

          /* abort rehydration if no previous style tags were found */
          if (!nodesSize) return this;

          for (var i = 0; i < nodesSize; i += 1) {
            var el = nodes[i];

            /* check if style tag is a streamed tag */
            if (!isStreamed) isStreamed = !!el.getAttribute(SC_STREAM_ATTR);

            /* retrieve all component names */
            var elNames = (el.getAttribute(SC_ATTR) || '').trim().split(SPLIT_REGEX);
            var elNamesSize = elNames.length;
            for (var j = 0, name; j < elNamesSize; j += 1) {
              name = elNames[j];
              /* add rehydrated name to sheet to avoid re-adding styles */
              this.rehydratedNames[name] = true;
            }

            /* extract all components and their CSS */
            extracted.push.apply(extracted, extractComps(el.textContent));

            /* store original HTMLStyleElement */
            els.push(el);
          }

          /* abort rehydration if nothing was extracted */
          var extractedSize = extracted.length;
          if (!extractedSize) return this;

          /* create a tag to be used for rehydration */
          var tag = this.makeTag(null);

          rehydrate(tag, els, extracted);

          /* reset capacity and adjust MAX_SIZE by the initial size of the rehydration */
          this.capacity = Math.max(1, MAX_SIZE - extractedSize);
          this.tags.push(tag);

          /* retrieve all component ids */
          for (var _j = 0; _j < extractedSize; _j += 1) {
            this.tagMap[extracted[_j].componentId] = tag;
          }

          return this;
        };

        /* retrieve a "master" instance of StyleSheet which is typically used when no other is available
         * The master StyleSheet is targeted by createGlobalStyle, keyframes, and components outside of any
          * StyleSheetManager's context */


        /* reset the internal "master" instance */
        StyleSheet.reset = function reset() {
          var forceServer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

          master = new StyleSheet(undefined, forceServer).rehydrate();
        };

        /* adds "children" to the StyleSheet that inherit all of the parents' rules
         * while their own rules do not affect the parent */


        StyleSheet.prototype.clone = function clone() {
          var sheet = new StyleSheet(this.target, this.forceServer);

          /* add to clone array */
          this.clones.push(sheet);

          /* clone all tags */
          sheet.tags = this.tags.map(function (tag) {
            var ids = tag.getIds();
            var newTag = tag.clone();

            /* reconstruct tagMap */
            for (var i = 0; i < ids.length; i += 1) {
              sheet.tagMap[ids[i]] = newTag;
            }

            return newTag;
          });

          /* clone other maps */
          sheet.rehydratedNames = _extends({}, this.rehydratedNames);
          sheet.deferred = _extends({}, this.deferred);

          return sheet;
        };

        /* force StyleSheet to create a new tag on the next injection */


        StyleSheet.prototype.sealAllTags = function sealAllTags() {
          this.capacity = 1;

          this.tags.forEach(function (tag) {
            // eslint-disable-next-line no-param-reassign
            tag.sealed = true;
          });
        };

        StyleSheet.prototype.makeTag = function makeTag$$1(tag) {
          var lastEl = tag ? tag.styleTag : null;
          var insertBefore = false;

          return makeTag(this.target, lastEl, this.forceServer, insertBefore, this.getImportRuleTag);
        };

        /* get a tag for a given componentId, assign the componentId to one, or shard */
        StyleSheet.prototype.getTagForId = function getTagForId(id) {
          /* simply return a tag, when the componentId was already assigned one */
          var prev = this.tagMap[id];
          if (prev !== undefined && !prev.sealed) {
            return prev;
          }

          var tag = this.tags[this.tags.length - 1];

          /* shard (create a new tag) if the tag is exhausted (See MAX_SIZE) */
          this.capacity -= 1;

          if (this.capacity === 0) {
            this.capacity = MAX_SIZE;
            tag = this.makeTag(tag);
            this.tags.push(tag);
          }

          return this.tagMap[id] = tag;
        };

        /* mainly for createGlobalStyle to check for its id */


        StyleSheet.prototype.hasId = function hasId(id) {
          return this.tagMap[id] !== undefined;
        };

        /* caching layer checking id+name to already have a corresponding tag and injected rules */


        StyleSheet.prototype.hasNameForId = function hasNameForId(id, name) {
          /* exception for rehydrated names which are checked separately */
          if (this.ignoreRehydratedNames[id] === undefined && this.rehydratedNames[name]) {
            return true;
          }

          var tag = this.tagMap[id];
          return tag !== undefined && tag.hasNameForId(id, name);
        };

        /* registers a componentId and registers it on its tag */


        StyleSheet.prototype.deferredInject = function deferredInject(id, cssRules) {
          /* don't inject when the id is already registered */
          if (this.tagMap[id] !== undefined) return;

          var clones = this.clones;

          for (var i = 0; i < clones.length; i += 1) {
            clones[i].deferredInject(id, cssRules);
          }

          this.getTagForId(id).insertMarker(id);
          this.deferred[id] = cssRules;
        };

        /* injects rules for a given id with a name that will need to be cached */


        StyleSheet.prototype.inject = function inject(id, cssRules, name) {
          var clones = this.clones;


          for (var i = 0; i < clones.length; i += 1) {
            clones[i].inject(id, cssRules, name);
          }

          var tag = this.getTagForId(id);

          /* add deferred rules for component */
          if (this.deferred[id] !== undefined) {
            // Combine passed cssRules with previously deferred CSS rules
            // NOTE: We cannot mutate the deferred array itself as all clones
            // do the same (see clones[i].inject)
            var rules = this.deferred[id].concat(cssRules);
            tag.insertRules(id, rules, name);

            this.deferred[id] = undefined;
          } else {
            tag.insertRules(id, cssRules, name);
          }
        };

        /* removes all rules for a given id, which doesn't remove its marker but resets it */


        StyleSheet.prototype.remove = function remove(id) {
          var tag = this.tagMap[id];
          if (tag === undefined) return;

          var clones = this.clones;

          for (var i = 0; i < clones.length; i += 1) {
            clones[i].remove(id);
          }

          /* remove all rules from the tag */
          tag.removeRules(id);

          /* ignore possible rehydrated names */
          this.ignoreRehydratedNames[id] = true;

          /* delete possible deferred rules */
          this.deferred[id] = undefined;
        };

        StyleSheet.prototype.toHTML = function toHTML() {
          return this.tags.map(function (tag) {
            return tag.toHTML();
          }).join('');
        };

        StyleSheet.prototype.toReactElements = function toReactElements() {
          var id = this.id;


          return this.tags.map(function (tag, i) {
            var key = 'sc-' + id + '-' + i;
            return React.cloneElement(tag.toElement(), { key: key });
          });
        };

        createClass(StyleSheet, null, [{
          key: 'master',
          get: function get$$1() {
            return master || (master = new StyleSheet().rehydrate());
          }

          /* NOTE: This is just for backwards-compatibility with jest-styled-components */

        }, {
          key: 'instance',
          get: function get$$1() {
            return StyleSheet.master;
          }
        }]);
        return StyleSheet;
      }();

      // 

      var Keyframes = function () {
        function Keyframes(name, rules) {
          var _this = this;

          classCallCheck(this, Keyframes);

          this.inject = function (styleSheet) {
            if (!styleSheet.hasNameForId(_this.id, _this.name)) {
              styleSheet.inject(_this.id, _this.rules, _this.name);
            }
          };

          this.toString = function () {
            throw new StyledComponentsError(12, String(_this.name));
          };

          this.name = name;
          this.rules = rules;

          this.id = 'sc-keyframes-' + name;
        }

        Keyframes.prototype.getName = function getName() {
          return this.name;
        };

        return Keyframes;
      }();

      // 

      /**
       * inlined version of
       * https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/hyphenateStyleName.js
       */

      var uppercasePattern = /([A-Z])/g;
      var msPattern = /^ms-/;

      /**
       * Hyphenates a camelcased CSS property name, for example:
       *
       *   > hyphenateStyleName('backgroundColor')
       *   < "background-color"
       *   > hyphenateStyleName('MozTransition')
       *   < "-moz-transition"
       *   > hyphenateStyleName('msTransition')
       *   < "-ms-transition"
       *
       * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
       * is converted to `-ms-`.
       *
       * @param {string} string
       * @return {string}
       */
      function hyphenateStyleName(string) {
        return string.replace(uppercasePattern, '-$1').toLowerCase().replace(msPattern, '-ms-');
      }

      // 

      // Taken from https://github.com/facebook/react/blob/b87aabdfe1b7461e7331abb3601d9e6bb27544bc/packages/react-dom/src/shared/dangerousStyleValue.js
      function addUnitIfNeeded(name, value) {
        // https://github.com/amilajack/eslint-plugin-flowtype-errors/issues/133
        // $FlowFixMe
        if (value == null || typeof value === 'boolean' || value === '') {
          return '';
        }

        if (typeof value === 'number' && value !== 0 && !(name in unitless)) {
          return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
        }

        return String(value).trim();
      }

      // 

      /**
       * It's falsish not falsy because 0 is allowed.
       */
      var isFalsish = function isFalsish(chunk) {
        return chunk === undefined || chunk === null || chunk === false || chunk === '';
      };

      var objToCssArray = function objToCssArray(obj, prevKey) {
        var rules = [];
        var keys = Object.keys(obj);

        keys.forEach(function (key) {
          if (!isFalsish(obj[key])) {
            if (isPlainObject(obj[key])) {
              rules.push.apply(rules, objToCssArray(obj[key], key));

              return rules;
            } else if (isFunction(obj[key])) {
              rules.push(hyphenateStyleName(key) + ':', obj[key], ';');

              return rules;
            }
            rules.push(hyphenateStyleName(key) + ': ' + addUnitIfNeeded(key, obj[key]) + ';');
          }
          return rules;
        });

        return prevKey ? [prevKey + ' {'].concat(rules, ['}']) : rules;
      };

      function flatten(chunk, executionContext, styleSheet) {
        if (Array.isArray(chunk)) {
          var ruleSet = [];

          for (var i = 0, len = chunk.length, result; i < len; i += 1) {
            result = flatten(chunk[i], executionContext, styleSheet);

            if (result === null) continue;else if (Array.isArray(result)) ruleSet.push.apply(ruleSet, result);else ruleSet.push(result);
          }

          return ruleSet;
        }

        if (isFalsish(chunk)) {
          return null;
        }

        /* Handle other components */
        if (isStyledComponent(chunk)) {
          return '.' + chunk.styledComponentId;
        }

        /* Either execute or defer the function */
        if (isFunction(chunk)) {
          if (isStatelessFunction(chunk) && executionContext) {
            var _result = chunk(executionContext);

            return flatten(_result, executionContext, styleSheet);
          } else return chunk;
        }

        if (chunk instanceof Keyframes) {
          if (styleSheet) {
            chunk.inject(styleSheet);
            return chunk.getName();
          } else return chunk;
        }

        /* Handle objects */
        return isPlainObject(chunk) ? objToCssArray(chunk) : chunk.toString();
      }

      // 

      function css(styles) {
        for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          interpolations[_key - 1] = arguments[_key];
        }

        if (isFunction(styles) || isPlainObject(styles)) {
          // $FlowFixMe
          return flatten(interleave(EMPTY_ARRAY, [styles].concat(interpolations)));
        }

        // $FlowFixMe
        return flatten(interleave(styles, interpolations));
      }

      // 

      function constructWithOptions(componentConstructor, tag) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY_OBJECT;

        if (!reactIs.isValidElementType(tag)) {
          throw new StyledComponentsError(1, String(tag));
        }

        /* This is callable directly as a template function */
        // $FlowFixMe: Not typed to avoid destructuring arguments
        var templateFunction = function templateFunction() {
          return componentConstructor(tag, options, css.apply(undefined, arguments));
        };

        /* If config methods are called, wrap up a new template function and merge options */
        templateFunction.withConfig = function (config) {
          return constructWithOptions(componentConstructor, tag, _extends({}, options, config));
        };

        /* Modify/inject new props at runtime */
        templateFunction.attrs = function (attrs) {
          return constructWithOptions(componentConstructor, tag, _extends({}, options, {
            attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean)
          }));
        };

        return templateFunction;
      }

      // 
      // Source: https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js
      function murmurhash(c) {
        for (var e = c.length | 0, a = e | 0, d = 0, b; e >= 4;) {
          b = c.charCodeAt(d) & 255 | (c.charCodeAt(++d) & 255) << 8 | (c.charCodeAt(++d) & 255) << 16 | (c.charCodeAt(++d) & 255) << 24, b = 1540483477 * (b & 65535) + ((1540483477 * (b >>> 16) & 65535) << 16), b ^= b >>> 24, b = 1540483477 * (b & 65535) + ((1540483477 * (b >>> 16) & 65535) << 16), a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16) ^ b, e -= 4, ++d;
        }
        switch (e) {
          case 3:
            a ^= (c.charCodeAt(d + 2) & 255) << 16;
          case 2:
            a ^= (c.charCodeAt(d + 1) & 255) << 8;
          case 1:
            a ^= c.charCodeAt(d) & 255, a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16);
        }
        a ^= a >>> 13;
        a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16);
        return (a ^ a >>> 15) >>> 0;
      }

      // 
      /* eslint-disable no-bitwise */

      /* This is the "capacity" of our alphabet i.e. 2x26 for all letters plus their capitalised
       * counterparts */
      var charsLength = 52;

      /* start at 75 for 'a' until 'z' (25) and then start at 65 for capitalised letters */
      var getAlphabeticChar = function getAlphabeticChar(code) {
        return String.fromCharCode(code + (code > 25 ? 39 : 97));
      };

      /* input a number, usually a hash and convert it to base-52 */
      function generateAlphabeticName(code) {
        var name = '';
        var x = void 0;

        /* get a char and divide by alphabet-length */
        for (x = code; x > charsLength; x = Math.floor(x / charsLength)) {
          name = getAlphabeticChar(x % charsLength) + name;
        }

        return getAlphabeticChar(x % charsLength) + name;
      }

      // 

      function hasFunctionObjectKey(obj) {
        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (var key in obj) {
          if (isFunction(obj[key])) {
            return true;
          }
        }

        return false;
      }

      function isStaticRules(rules, attrs) {
        for (var i = 0; i < rules.length; i += 1) {
          var rule = rules[i];

          // recursive case
          if (Array.isArray(rule) && !isStaticRules(rule, attrs)) {
            return false;
          } else if (isFunction(rule) && !isStyledComponent(rule)) {
            // functions are allowed to be static if they're just being
            // used to get the classname of a nested styled component
            return false;
          }
        }

        if (attrs.some(function (x) {
          return isFunction(x) || hasFunctionObjectKey(x);
        })) return false;

        return true;
      }

      // 

      /* combines hashStr (murmurhash) and nameGenerator for convenience */
      var hasher = function hasher(str) {
        return generateAlphabeticName(murmurhash(str));
      };

      /*
       ComponentStyle is all the CSS-specific stuff, not
       the React-specific stuff.
       */

      var ComponentStyle = function () {
        function ComponentStyle(rules, attrs, componentId) {
          classCallCheck(this, ComponentStyle);

          this.rules = rules;
          this.isStatic = isStaticRules(rules, attrs);
          this.componentId = componentId;

          if (!StyleSheet.master.hasId(componentId)) {
            StyleSheet.master.deferredInject(componentId, []);
          }
        }

        /*
         * Flattens a rule set into valid CSS
         * Hashes it, wraps the whole chunk in a .hash1234 {}
         * Returns the hash to be injected on render()
         * */


        ComponentStyle.prototype.generateAndInjectStyles = function generateAndInjectStyles(executionContext, styleSheet) {
          var isStatic = this.isStatic,
              componentId = this.componentId,
              lastClassName = this.lastClassName;

          if (IS_BROWSER && isStatic && typeof lastClassName === 'string' && styleSheet.hasNameForId(componentId, lastClassName)) {
            return lastClassName;
          }

          var flatCSS = flatten(this.rules, executionContext, styleSheet);
          var name = hasher(this.componentId + flatCSS.join(''));
          if (!styleSheet.hasNameForId(componentId, name)) {
            styleSheet.inject(this.componentId, stringifyRules(flatCSS, '.' + name, undefined, componentId), name);
          }

          this.lastClassName = name;
          return name;
        };

        ComponentStyle.generateName = function generateName(str) {
          return hasher(str);
        };

        return ComponentStyle;
      }();

      // 

      var determineTheme = (function (props, fallbackTheme) {
        var defaultProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY_OBJECT;

        // Props should take precedence over ThemeProvider, which should take precedence over
        // defaultProps, but React automatically puts defaultProps on props.

        /* eslint-disable react/prop-types, flowtype-errors/show-errors */
        var isDefaultTheme = defaultProps ? props.theme === defaultProps.theme : false;
        var theme = props.theme && !isDefaultTheme ? props.theme : fallbackTheme || defaultProps.theme;
        /* eslint-enable */

        return theme;
      });

      // 
      var escapeRegex = /[[\].#*$><+~=|^:(),"'`-]+/g;
      var dashesAtEnds = /(^-|-$)/g;

      /**
       * TODO: Explore using CSS.escape when it becomes more available
       * in evergreen browsers.
       */
      function escape(str) {
        return str
        // Replace all possible CSS selectors
        .replace(escapeRegex, '-')

        // Remove extraneous hyphens at the start and end
        .replace(dashesAtEnds, '');
      }

      // 

      function isTag(target) {
        return typeof target === 'string' && (true);
      }

      // 

      function generateDisplayName(target) {
        // $FlowFixMe
        return isTag(target) ? 'styled.' + target : 'Styled(' + getComponentName(target) + ')';
      }

      var _TYPE_STATICS;

      var REACT_STATICS = {
        childContextTypes: true,
        contextTypes: true,
        defaultProps: true,
        displayName: true,
        getDerivedStateFromProps: true,
        propTypes: true,
        type: true
      };

      var KNOWN_STATICS = {
        name: true,
        length: true,
        prototype: true,
        caller: true,
        callee: true,
        arguments: true,
        arity: true
      };

      var TYPE_STATICS = (_TYPE_STATICS = {}, _TYPE_STATICS[reactIs.ForwardRef] = {
        $$typeof: true,
        render: true
      }, _TYPE_STATICS);

      var defineProperty$1 = Object.defineProperty,
          getOwnPropertyNames = Object.getOwnPropertyNames,
          _Object$getOwnPropert = Object.getOwnPropertySymbols,
          getOwnPropertySymbols = _Object$getOwnPropert === undefined ? function () {
        return [];
      } : _Object$getOwnPropert,
          getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
          getPrototypeOf = Object.getPrototypeOf,
          objectPrototype = Object.prototype;
      var arrayPrototype = Array.prototype;


      function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
        if (typeof sourceComponent !== 'string') {
          // don't hoist over string (html) components

          var inheritedComponent = getPrototypeOf(sourceComponent);

          if (inheritedComponent && inheritedComponent !== objectPrototype) {
            hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
          }

          var keys = arrayPrototype.concat(getOwnPropertyNames(sourceComponent),
          // $FlowFixMe
          getOwnPropertySymbols(sourceComponent));

          var targetStatics = TYPE_STATICS[targetComponent.$$typeof] || REACT_STATICS;

          var sourceStatics = TYPE_STATICS[sourceComponent.$$typeof] || REACT_STATICS;

          var i = keys.length;
          var descriptor = void 0;
          var key = void 0;

          // eslint-disable-next-line no-plusplus
          while (i--) {
            key = keys[i];

            if (
            // $FlowFixMe
            !KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) &&
            // $FlowFixMe
            !(targetStatics && targetStatics[key])) {
              descriptor = getOwnPropertyDescriptor(sourceComponent, key);

              if (descriptor) {
                try {
                  // Avoid failures from read-only properties
                  defineProperty$1(targetComponent, key, descriptor);
                } catch (e) {
                  /* fail silently */
                }
              }
            }
          }

          return targetComponent;
        }

        return targetComponent;
      }

      // 
      function isDerivedReactComponent(fn) {
        return !!(fn && fn.prototype && fn.prototype.isReactComponent);
      }

      // 

      var ThemeContext = React.createContext();

      var ThemeConsumer = ThemeContext.Consumer;

      /**
       * Provide a theme to an entire react component tree via context
       */

      var ThemeProvider = function (_Component) {
        inherits(ThemeProvider, _Component);

        function ThemeProvider(props) {
          classCallCheck(this, ThemeProvider);

          var _this = possibleConstructorReturn(this, _Component.call(this, props));

          _this.getContext = memoize(_this.getContext.bind(_this));
          _this.renderInner = _this.renderInner.bind(_this);
          return _this;
        }

        ThemeProvider.prototype.render = function render() {
          if (!this.props.children) return null;

          return React__default.createElement(
            ThemeContext.Consumer,
            null,
            this.renderInner
          );
        };

        ThemeProvider.prototype.renderInner = function renderInner(outerTheme) {
          var context = this.getContext(this.props.theme, outerTheme);

          return React__default.createElement(
            ThemeContext.Provider,
            { value: context },
            this.props.children
          );
        };

        /**
         * Get the theme from the props, supporting both (outerTheme) => {}
         * as well as object notation
         */


        ThemeProvider.prototype.getTheme = function getTheme(theme, outerTheme) {
          if (isFunction(theme)) {
            var mergedTheme = theme(outerTheme);

            return mergedTheme;
          }

          if (theme === null || Array.isArray(theme) || (typeof theme === 'undefined' ? 'undefined' : _typeof(theme)) !== 'object') {
            throw new StyledComponentsError(8);
          }

          return _extends({}, outerTheme, theme);
        };

        ThemeProvider.prototype.getContext = function getContext(theme, outerTheme) {
          return this.getTheme(theme, outerTheme);
        };

        return ThemeProvider;
      }(React.Component);

      var ServerStyleSheet = function () {
        function ServerStyleSheet() {
          classCallCheck(this, ServerStyleSheet);

          /* The master sheet might be reset, so keep a reference here */
          this.masterSheet = StyleSheet.master;
          this.instance = this.masterSheet.clone();
          this.sealed = false;
        }

        /**
         * Mark the ServerStyleSheet as being fully emitted and manually GC it from the
         * StyleSheet singleton.
         */


        ServerStyleSheet.prototype.seal = function seal() {
          if (!this.sealed) {
            /* Remove sealed StyleSheets from the master sheet */
            var index = this.masterSheet.clones.indexOf(this.instance);
            this.masterSheet.clones.splice(index, 1);
            this.sealed = true;
          }
        };

        ServerStyleSheet.prototype.collectStyles = function collectStyles(children) {
          if (this.sealed) {
            throw new StyledComponentsError(2);
          }

          return React__default.createElement(
            StyleSheetManager,
            { sheet: this.instance },
            children
          );
        };

        ServerStyleSheet.prototype.getStyleTags = function getStyleTags() {
          this.seal();
          return this.instance.toHTML();
        };

        ServerStyleSheet.prototype.getStyleElement = function getStyleElement() {
          this.seal();
          return this.instance.toReactElements();
        };

        ServerStyleSheet.prototype.interleaveWithNodeStream = function interleaveWithNodeStream(readableStream) {

          {
            throw new StyledComponentsError(3);
          }
        };

        return ServerStyleSheet;
      }();

      // 

      var StyleSheetContext = React.createContext();
      var StyleSheetConsumer = StyleSheetContext.Consumer;

      var StyleSheetManager = function (_Component) {
        inherits(StyleSheetManager, _Component);

        function StyleSheetManager(props) {
          classCallCheck(this, StyleSheetManager);

          var _this = possibleConstructorReturn(this, _Component.call(this, props));

          _this.getContext = memoize(_this.getContext);
          return _this;
        }

        StyleSheetManager.prototype.getContext = function getContext(sheet, target) {
          if (sheet) {
            return sheet;
          } else if (target) {
            return new StyleSheet(target);
          } else {
            throw new StyledComponentsError(4);
          }
        };

        StyleSheetManager.prototype.render = function render() {
          var _props = this.props,
              children = _props.children,
              sheet = _props.sheet,
              target = _props.target;


          return React__default.createElement(
            StyleSheetContext.Provider,
            { value: this.getContext(sheet, target) },
            children
          );
        };

        return StyleSheetManager;
      }(React.Component);

      // 

      var identifiers = {};

      /* We depend on components having unique IDs */
      function generateId(_ComponentStyle, _displayName, parentComponentId) {
        var displayName = typeof _displayName !== 'string' ? 'sc' : escape(_displayName);

        /**
         * This ensures uniqueness if two components happen to share
         * the same displayName.
         */
        var nr = (identifiers[displayName] || 0) + 1;
        identifiers[displayName] = nr;

        var componentId = displayName + '-' + _ComponentStyle.generateName(displayName + nr);

        return parentComponentId ? parentComponentId + '-' + componentId : componentId;
      }

      // $FlowFixMe

      var StyledComponent = function (_Component) {
        inherits(StyledComponent, _Component);

        function StyledComponent() {
          classCallCheck(this, StyledComponent);

          var _this = possibleConstructorReturn(this, _Component.call(this));

          _this.attrs = {};

          _this.renderOuter = _this.renderOuter.bind(_this);
          _this.renderInner = _this.renderInner.bind(_this);
          return _this;
        }

        StyledComponent.prototype.render = function render() {
          return React__default.createElement(
            StyleSheetConsumer,
            null,
            this.renderOuter
          );
        };

        StyledComponent.prototype.renderOuter = function renderOuter() {
          var styleSheet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : StyleSheet.master;

          this.styleSheet = styleSheet;

          // No need to subscribe a static component to theme changes, it won't change anything
          if (this.props.forwardedComponent.componentStyle.isStatic) return this.renderInner();

          return React__default.createElement(
            ThemeConsumer,
            null,
            this.renderInner
          );
        };

        StyledComponent.prototype.renderInner = function renderInner(theme) {
          var _props$forwardedCompo = this.props.forwardedComponent,
              componentStyle = _props$forwardedCompo.componentStyle,
              defaultProps = _props$forwardedCompo.defaultProps;
              _props$forwardedCompo.displayName;
              var foldedComponentIds = _props$forwardedCompo.foldedComponentIds,
              styledComponentId = _props$forwardedCompo.styledComponentId,
              target = _props$forwardedCompo.target;


          var generatedClassName = void 0;
          if (componentStyle.isStatic) {
            generatedClassName = this.generateAndInjectStyles(EMPTY_OBJECT, this.props);
          } else {
            generatedClassName = this.generateAndInjectStyles(determineTheme(this.props, theme, defaultProps) || EMPTY_OBJECT, this.props);
          }

          var elementToBeCreated = this.props.as || this.attrs.as || target;
          var isTargetTag = isTag(elementToBeCreated);

          var propsForElement = {};
          var computedProps = _extends({}, this.props, this.attrs);

          var key = void 0;
          // eslint-disable-next-line guard-for-in
          for (key in computedProps) {

            if (key === 'forwardedComponent' || key === 'as') {
              continue;
            } else if (key === 'forwardedRef') propsForElement.ref = computedProps[key];else if (key === 'forwardedAs') propsForElement.as = computedProps[key];else if (!isTargetTag || validAttr(key)) {
              // Don't pass through non HTML tags through to HTML elements
              propsForElement[key] = computedProps[key];
            }
          }

          if (this.props.style && this.attrs.style) {
            propsForElement.style = _extends({}, this.attrs.style, this.props.style);
          }

          propsForElement.className = Array.prototype.concat(foldedComponentIds, styledComponentId, generatedClassName !== styledComponentId ? generatedClassName : null, this.props.className, this.attrs.className).filter(Boolean).join(' ');

          return React.createElement(elementToBeCreated, propsForElement);
        };

        StyledComponent.prototype.buildExecutionContext = function buildExecutionContext(theme, props, attrs) {
          var _this2 = this;

          var context = _extends({}, props, { theme: theme });

          if (!attrs.length) return context;

          this.attrs = {};

          attrs.forEach(function (attrDef) {
            var resolvedAttrDef = attrDef;
            var attrDefWasFn = false;
            var attr = void 0;
            var key = void 0;

            if (isFunction(resolvedAttrDef)) {
              // $FlowFixMe
              resolvedAttrDef = resolvedAttrDef(context);
              attrDefWasFn = true;
            }

            /* eslint-disable guard-for-in */
            // $FlowFixMe
            for (key in resolvedAttrDef) {
              attr = resolvedAttrDef[key];

              if (!attrDefWasFn) {
                if (isFunction(attr) && !isDerivedReactComponent(attr) && !isStyledComponent(attr)) {

                  attr = attr(context);
                }
              }

              _this2.attrs[key] = attr;
              context[key] = attr;
            }
            /* eslint-enable */
          });

          return context;
        };

        StyledComponent.prototype.generateAndInjectStyles = function generateAndInjectStyles(theme, props) {
          var _props$forwardedCompo2 = props.forwardedComponent,
              attrs = _props$forwardedCompo2.attrs,
              componentStyle = _props$forwardedCompo2.componentStyle;
              _props$forwardedCompo2.warnTooManyClasses;

          // statically styled-components don't need to build an execution context object,
          // and shouldn't be increasing the number of class names

          if (componentStyle.isStatic && !attrs.length) {
            return componentStyle.generateAndInjectStyles(EMPTY_OBJECT, this.styleSheet);
          }

          var className = componentStyle.generateAndInjectStyles(this.buildExecutionContext(theme, props, attrs), this.styleSheet);

          return className;
        };

        return StyledComponent;
      }(React.Component);

      function createStyledComponent(target, options, rules) {
        var isTargetStyledComp = isStyledComponent(target);
        var isClass = !isTag(target);

        var _options$displayName = options.displayName,
            displayName = _options$displayName === undefined ? generateDisplayName(target) : _options$displayName,
            _options$componentId = options.componentId,
            componentId = _options$componentId === undefined ? generateId(ComponentStyle, options.displayName, options.parentComponentId) : _options$componentId,
            _options$ParentCompon = options.ParentComponent,
            ParentComponent = _options$ParentCompon === undefined ? StyledComponent : _options$ParentCompon,
            _options$attrs = options.attrs,
            attrs = _options$attrs === undefined ? EMPTY_ARRAY : _options$attrs;


        var styledComponentId = options.displayName && options.componentId ? escape(options.displayName) + '-' + options.componentId : options.componentId || componentId;

        // fold the underlying StyledComponent attrs up (implicit extend)
        var finalAttrs =
        // $FlowFixMe
        isTargetStyledComp && target.attrs ? Array.prototype.concat(target.attrs, attrs).filter(Boolean) : attrs;

        var componentStyle = new ComponentStyle(isTargetStyledComp ? // fold the underlying StyledComponent rules up (implicit extend)
        // $FlowFixMe
        target.componentStyle.rules.concat(rules) : rules, finalAttrs, styledComponentId);

        /**
         * forwardRef creates a new interim component, which we'll take advantage of
         * instead of extending ParentComponent to create _another_ interim class
         */
        var WrappedStyledComponent = void 0;
        var forwardRef = function forwardRef(props, ref) {
          return React__default.createElement(ParentComponent, _extends({}, props, { forwardedComponent: WrappedStyledComponent, forwardedRef: ref }));
        };
        forwardRef.displayName = displayName;
        WrappedStyledComponent = React__default.forwardRef(forwardRef);
        WrappedStyledComponent.displayName = displayName;

        // $FlowFixMe
        WrappedStyledComponent.attrs = finalAttrs;
        // $FlowFixMe
        WrappedStyledComponent.componentStyle = componentStyle;

        // $FlowFixMe
        WrappedStyledComponent.foldedComponentIds = isTargetStyledComp ? // $FlowFixMe
        Array.prototype.concat(target.foldedComponentIds, target.styledComponentId) : EMPTY_ARRAY;

        // $FlowFixMe
        WrappedStyledComponent.styledComponentId = styledComponentId;

        // fold the underlying StyledComponent target up since we folded the styles
        // $FlowFixMe
        WrappedStyledComponent.target = isTargetStyledComp ? target.target : target;

        // $FlowFixMe
        WrappedStyledComponent.withComponent = function withComponent(tag) {
          var previousComponentId = options.componentId,
              optionsToCopy = objectWithoutProperties(options, ['componentId']);


          var newComponentId = previousComponentId && previousComponentId + '-' + (isTag(tag) ? tag : escape(getComponentName(tag)));

          var newOptions = _extends({}, optionsToCopy, {
            attrs: finalAttrs,
            componentId: newComponentId,
            ParentComponent: ParentComponent
          });

          return createStyledComponent(tag, newOptions, rules);
        };

        // $FlowFixMe
        Object.defineProperty(WrappedStyledComponent, 'defaultProps', {
          get: function get$$1() {
            return this._foldedDefaultProps;
          },
          set: function set$$1(obj) {
            // $FlowFixMe
            this._foldedDefaultProps = isTargetStyledComp ? merge(target.defaultProps, obj) : obj;
          }
        });

        // $FlowFixMe
        WrappedStyledComponent.toString = function () {
          return '.' + WrappedStyledComponent.styledComponentId;
        };

        if (isClass) {
          hoistNonReactStatics(WrappedStyledComponent, target, {
            // all SC-specific things should not be hoisted
            attrs: true,
            componentStyle: true,
            displayName: true,
            foldedComponentIds: true,
            styledComponentId: true,
            target: true,
            withComponent: true
          });
        }

        return WrappedStyledComponent;
      }

      // 
      // Thanks to ReactDOMFactories for this handy list!

      var domElements = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',

      // SVG
      'circle', 'clipPath', 'defs', 'ellipse', 'foreignObject', 'g', 'image', 'line', 'linearGradient', 'marker', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];

      // 

      var styled = function styled(tag) {
        return constructWithOptions(createStyledComponent, tag);
      };

      // Shorthands for all valid HTML Elements
      domElements.forEach(function (domElement) {
        styled[domElement] = styled(domElement);
      });

      // 

      var GlobalStyle = function () {
        function GlobalStyle(rules, componentId) {
          classCallCheck(this, GlobalStyle);

          this.rules = rules;
          this.componentId = componentId;
          this.isStatic = isStaticRules(rules, EMPTY_ARRAY);

          if (!StyleSheet.master.hasId(componentId)) {
            StyleSheet.master.deferredInject(componentId, []);
          }
        }

        GlobalStyle.prototype.createStyles = function createStyles(executionContext, styleSheet) {
          var flatCSS = flatten(this.rules, executionContext, styleSheet);
          var css = stringifyRules(flatCSS, '');

          styleSheet.inject(this.componentId, css);
        };

        GlobalStyle.prototype.removeStyles = function removeStyles(styleSheet) {
          var componentId = this.componentId;

          if (styleSheet.hasId(componentId)) {
            styleSheet.remove(componentId);
          }
        };

        // TODO: overwrite in-place instead of remove+create?


        GlobalStyle.prototype.renderStyles = function renderStyles(executionContext, styleSheet) {
          this.removeStyles(styleSheet);
          this.createStyles(executionContext, styleSheet);
        };

        return GlobalStyle;
      }();

      // 

      // place our cache into shared context so it'll persist between HMRs
      if (IS_BROWSER) {
        window.scCGSHMRCache = {};
      }

      function createGlobalStyle(strings) {
        for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          interpolations[_key - 1] = arguments[_key];
        }

        var rules = css.apply(undefined, [strings].concat(interpolations));
        var id = 'sc-global-' + murmurhash(JSON.stringify(rules));
        var style = new GlobalStyle(rules, id);

        var GlobalStyleComponent = function (_React$Component) {
          inherits(GlobalStyleComponent, _React$Component);

          function GlobalStyleComponent(props) {
            classCallCheck(this, GlobalStyleComponent);

            var _this = possibleConstructorReturn(this, _React$Component.call(this, props));

            var _this$constructor = _this.constructor,
                globalStyle = _this$constructor.globalStyle,
                styledComponentId = _this$constructor.styledComponentId;


            if (IS_BROWSER) {
              window.scCGSHMRCache[styledComponentId] = (window.scCGSHMRCache[styledComponentId] || 0) + 1;
            }

            /**
             * This fixes HMR compatibility. Don't ask me why, but this combination of
             * caching the closure variables via statics and then persisting the statics in
             * state works across HMR where no other combination did. ¯\_(ツ)_/¯
             */
            _this.state = {
              globalStyle: globalStyle,
              styledComponentId: styledComponentId
            };
            return _this;
          }

          GlobalStyleComponent.prototype.componentWillUnmount = function componentWillUnmount() {
            if (window.scCGSHMRCache[this.state.styledComponentId]) {
              window.scCGSHMRCache[this.state.styledComponentId] -= 1;
            }
            /**
             * Depending on the order "render" is called this can cause the styles to be lost
             * until the next render pass of the remaining instance, which may
             * not be immediate.
             */
            if (window.scCGSHMRCache[this.state.styledComponentId] === 0) {
              this.state.globalStyle.removeStyles(this.styleSheet);
            }
          };

          GlobalStyleComponent.prototype.render = function render() {
            var _this2 = this;

            return React__default.createElement(
              StyleSheetConsumer,
              null,
              function (styleSheet) {
                _this2.styleSheet = styleSheet || StyleSheet.master;

                var globalStyle = _this2.state.globalStyle;


                if (globalStyle.isStatic) {
                  globalStyle.renderStyles(STATIC_EXECUTION_CONTEXT, _this2.styleSheet);

                  return null;
                } else {
                  return React__default.createElement(
                    ThemeConsumer,
                    null,
                    function (theme) {
                      // $FlowFixMe
                      var defaultProps = _this2.constructor.defaultProps;


                      var context = _extends({}, _this2.props);

                      if (typeof theme !== 'undefined') {
                        context.theme = determineTheme(_this2.props, theme, defaultProps);
                      }

                      globalStyle.renderStyles(context, _this2.styleSheet);

                      return null;
                    }
                  );
                }
              }
            );
          };

          return GlobalStyleComponent;
        }(React__default.Component);

        GlobalStyleComponent.globalStyle = style;
        GlobalStyleComponent.styledComponentId = id;


        return GlobalStyleComponent;
      }

      // 

      var replaceWhitespace = function replaceWhitespace(str) {
        return str.replace(/\s|\\n/g, '');
      };

      function keyframes(strings) {

        for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          interpolations[_key - 1] = arguments[_key];
        }

        var rules = css.apply(undefined, [strings].concat(interpolations));

        var name = generateAlphabeticName(murmurhash(replaceWhitespace(JSON.stringify(rules))));

        return new Keyframes(name, stringifyRules(rules, name, '@keyframes'));
      }

      // 

      var withTheme = (function (Component) {
        var WithTheme = React__default.forwardRef(function (props, ref) {
          return React__default.createElement(
            ThemeConsumer,
            null,
            function (theme) {
              // $FlowFixMe
              var defaultProps = Component.defaultProps;

              var themeProp = determineTheme(props, theme, defaultProps);

              return React__default.createElement(Component, _extends({}, props, { theme: themeProp, ref: ref }));
            }
          );
        });

        hoistNonReactStatics(WithTheme, Component);

        WithTheme.displayName = 'WithTheme(' + getComponentName(Component) + ')';

        return WithTheme;
      });

      // 

      /* eslint-disable */
      var __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS = {
        StyleSheet: StyleSheet
      };

      //

      var _default = styledComponents_browser_cjs.default = styled;
      styledComponents_browser_cjs.createGlobalStyle = createGlobalStyle;
      var css_1 = styledComponents_browser_cjs.css = css;
      styledComponents_browser_cjs.isStyledComponent = isStyledComponent;
      styledComponents_browser_cjs.keyframes = keyframes;
      styledComponents_browser_cjs.ServerStyleSheet = ServerStyleSheet;
      styledComponents_browser_cjs.StyleSheetConsumer = StyleSheetConsumer;
      styledComponents_browser_cjs.StyleSheetContext = StyleSheetContext;
      styledComponents_browser_cjs.StyleSheetManager = StyleSheetManager;
      styledComponents_browser_cjs.ThemeConsumer = ThemeConsumer;
      styledComponents_browser_cjs.ThemeContext = ThemeContext;
      styledComponents_browser_cjs.ThemeProvider = ThemeProvider;
      styledComponents_browser_cjs.withTheme = withTheme;
      styledComponents_browser_cjs.__DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS = __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS;

      var __getOwnPropSymbols$7 = Object.getOwnPropertySymbols;
      var __hasOwnProp$7 = Object.prototype.hasOwnProperty;
      var __propIsEnum$7 = Object.prototype.propertyIsEnumerable;
      var __objRest$4 = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$7.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$7)
          for (var prop of __getOwnPropSymbols$7(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$7.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      const NextFormItemDeepContext = createContext({});
      const NextFormItemShallowContext = createContext({});
      const FormItemDeepProvider = exports('FormItemDeepProvider', ({
        children,
        prefixCls,
        labelAlign,
        labelCol,
        inline,
        wrapperCol,
        size
      }) => /* @__PURE__ */ React$1.createElement(NextFormItemDeepContext.Provider, {
        value: {
          prefixCls,
          labelAlign,
          labelCol,
          wrapperCol,
          inline,
          size
        }
      }, children));
      FormItemDeepProvider.displayName = "FormItemDeepProvider";
      const useDeepFormItem = exports('useDeepFormItem', () => {
        return useContext(NextFormItemDeepContext);
      });
      const FormItemShallowProvider = exports('FormItemShallowProvider', (_a) => {
        var _b = _a, { children } = _b, props = __objRest$4(_b, ["children"]);
        return /* @__PURE__ */ React$1.createElement(NextFormItemShallowContext.Provider, {
          value: props
        }, children);
      });
      const useShallowFormItem = exports('useShallowFormItem', () => {
        return useContext(NextFormItemShallowContext);
      });

      const getAlign = (align) => {
        if (align === "start" || align === "end")
          return align;
        if (align === "left" || align === "top")
          return "flex-start";
        if (align === "right" || align === "bottom")
          return "flex-end";
        return align;
      };
      const isElementInViewport = (rect, {
        offset = 0,
        threshold = 0
      } = {}) => {
        const { top, right, bottom, left, width, height } = rect;
        const intersection = {
          t: bottom,
          r: window.innerWidth - left,
          b: window.innerHeight - top,
          l: right
        };
        const elementThreshold = {
          x: threshold * width,
          y: threshold * height
        };
        return intersection.t >= (offset.top || offset + elementThreshold.y) && intersection.r >= (offset.right || offset + elementThreshold.x) && intersection.b >= (offset.bottom || offset + elementThreshold.y) && intersection.l >= (offset.left || offset + elementThreshold.x);
      };
      const FormButtonGroup = exports('FormButtonGroup', _default((props) => {
        const {
          span,
          zIndex,
          sticky,
          style,
          offset,
          className,
          children,
          triggerDistance,
          itemStyle
        } = props;
        const { inline } = useDeepFormItem();
        const selfRef = useRef();
        const renderChildren = () => {
          return /* @__PURE__ */ React$1.createElement("div", {
            className: "button-group"
          }, /* @__PURE__ */ React$1.createElement(Row, null, /* @__PURE__ */ React$1.createElement(Col, {
            span,
            offset,
            className: "inline"
          }, /* @__PURE__ */ React$1.createElement("div", {
            className: "inline-view",
            style: itemStyle
          }, children))));
        };
        const getStickyBoundaryHandler = () => {
          return () => {
            if (selfRef.current && selfRef.current.parentElement) {
              const container = selfRef.current.parentElement;
              return isElementInViewport(container.getBoundingClientRect());
            }
            return true;
          };
        };
        const content = /* @__PURE__ */ React$1.createElement("div", {
          className: classnames(className, {
            "is-inline": !!inline
          }),
          style
        }, renderChildren());
        if (sticky) {
          return /* @__PURE__ */ React$1.createElement("div", {
            ref: selfRef
          }, /* @__PURE__ */ React$1.createElement(default_1, {
            edge: "bottom",
            triggerDistance,
            zIndex,
            getStickyBoundary: getStickyBoundaryHandler(),
            style: {
              borderTop: "1px solid #eee",
              background: style && style.background || "#fff",
              padding: style && style.padding || "8px 0"
            }
          }, /* @__PURE__ */ React$1.createElement("div", {
            className,
            style
          }, content)));
        }
        return content;
      })`
  ${(props) => props.align ? `display:flex;justify-content: ${getAlign(props.align)}` : ""}
  &.is-inline {
    display: inline-block;
    flex-grow: 3;
  }
  .button-group {
    .inline {
      display: inline-block;
      .inline-view {
        & > * {
          margin-right: 10px;
          margin-left: 0px;
          display: inline-block;
        }
        & > *:last-child {
          margin-right: 0 !important;
        }
      }
    }
  }
`);
      createVirtualBox("button-group", FormButtonGroup);

      var __defProp$6 = Object.defineProperty;
      var __defProps$6 = Object.defineProperties;
      var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
      var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
      var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$6 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$6.call(b, prop))
            __defNormalProp$6(a, prop, b[prop]);
        if (__getOwnPropSymbols$6)
          for (var prop of __getOwnPropSymbols$6(b)) {
            if (__propIsEnum$6.call(b, prop))
              __defNormalProp$6(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
      const SchemaForm = (props) => {
        const formRef = useRef();
        return /* @__PURE__ */ React$1.createElement("div", {
          ref: formRef
        }, /* @__PURE__ */ React$1.createElement(SchemaMarkupForm, __spreadProps$6(__spreadValues$6({}, props), {
          onValidateFailed: (result) => {
            if (props.onValidateFailed) {
              props.onValidateFailed(result);
            }
            autoScrollInValidateFailed(formRef);
          }
        }), props.children));
      }; exports({ SchemaForm: SchemaForm, 'default': SchemaForm });

      const Field = exports('Field', SchemaMarkupField);

      var __defProp$5 = Object.defineProperty;
      var __defProps$5 = Object.defineProperties;
      var __getOwnPropDescs$5 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
      var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
      var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$5 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$5.call(b, prop))
            __defNormalProp$5(a, prop, b[prop]);
        if (__getOwnPropSymbols$5)
          for (var prop of __getOwnPropSymbols$5(b)) {
            if (__propIsEnum$5.call(b, prop))
              __defNormalProp$5(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$5 = (a, b) => __defProps$5(a, __getOwnPropDescs$5(b));
      var __objRest$3 = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$5.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$5)
          for (var prop of __getOwnPropSymbols$5(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$5.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      const Form = exports('Form', (props) => {
        const _a = props, {
          inline,
          effects,
          actions,
          initialValues,
          value,
          defaultValue,
          onChange,
          onSubmit,
          form,
          useDirty,
          onValidateFailed,
          previewPlaceholder,
          editable,
          validateFirst,
          children
        } = _a, rest = __objRest$3(_a, [
          "inline",
          "effects",
          "actions",
          "initialValues",
          "value",
          "defaultValue",
          "onChange",
          "onSubmit",
          "form",
          "useDirty",
          "onValidateFailed",
          "previewPlaceholder",
          "editable",
          "validateFirst",
          "children"
        ]);
        const formRef = useRef();
        return /* @__PURE__ */ React$1.createElement(InternalForm, __spreadProps$5(__spreadValues$5({}, props), {
          onValidateFailed: (result) => {
            if (props.onValidateFailed) {
              props.onValidateFailed(result);
            }
            autoScrollInValidateFailed(formRef);
          }
        }), (form2) => {
          const onSubmit2 = (e) => {
            if (e && e.preventDefault)
              e.preventDefault();
            if (e && e.stopPropagation)
              e.stopPropagation();
            form2.submit().catch((e2) => log.warn(e2));
          };
          const onReset = () => {
            form2.reset({ validate: false, forceClear: false });
          };
          const renderedChildren = isFn$1(children) ? children(form2) : cloneChlildren(children);
          return /* @__PURE__ */ React$1.createElement(PreviewText.ConfigProvider, {
            value: props
          }, /* @__PURE__ */ React$1.createElement(FormItemDeepProvider, __spreadValues$5({}, props), /* @__PURE__ */ React$1.createElement("div", {
            ref: formRef
          }, /* @__PURE__ */ React$1.createElement(Form$1, __spreadProps$5(__spreadValues$5({}, rest), {
            component: useMemo(() => {
              if (isAntdV4) {
                return (props2) => {
                  return React$1.createElement("form", __spreadProps$5(__spreadValues$5({}, props2), {
                    onSubmit: onSubmit2,
                    onReset
                  }));
                };
              }
            }, []),
            onSubmit: onSubmit2,
            onReset,
            labelCol: normalizeCol(props.labelCol),
            wrapperCol: normalizeCol(props.wrapperCol),
            layout: inline ? "inline" : props.layout
          }), renderedChildren))));
        });
      });

      const insetStyle = (props) => {
        const result = {};
        result.borderStyle = `
        .ant-form-item.ant-row {
            display: flex;

            .ant-form-item-children {
                position: relative;
                display: flex;
                align-items: center;
                min-height: 32px;

                .mega-layout-item-content {
                    flex: auto;
                    max-width: 100%;
                }
            }
        }
        ${props.hasBorder ? `
            .ant-form-item.ant-row {
                padding-left: 12px;
                border: 1px solid #D8D8D8;
                border-radius: 4px;
            }
        ` : `
            &.mega-layout-item .ant-form-item.ant-row {
                padding-left: 0;
                border: none;
            }
        `}
    `;
        if (props.isLayout) {
          result.itemStyle = `
            .mega-layout-item-inset {
                flex-direction: column;
            }

            .mega-layout-item-inset-has-error {
                .mega-layout-item-inset-help {
                    color: red;
                }

                .ant-form-item {
                    border-color: red;
                }
            }

            .mega-layout-item-inset-has-warning {
                .mega-layout-item-inset-help {
                    color: #FF6A00;
                }

                .ant-form-item {
                    border-color: #FF6A00;
                }
            }

            .ant-form-item-explain {
                display: none;
            }
        `;
          result.componentStyle = `
            .ant-form-item.ant-row .mega-layout-item-content {
                .ant-picker,
                .ant-select-single:not(.ant-select-customize-input) .ant-select-selector,
                .ant-select-selector,
                .ant-picker-input input,
                .ant-input-number,
                .ant-time-picker-input,
                .ant-select-selection,
                .ant-input {
                    border: none;
                    box-shadow: none;
                }

                .ant-picker {
                    width: 100%;
                    padding-right: 0;
                }

                .ant-radio-group {
                    line-height: 1.5715;
                }
                .ant-checkbox-group {
                    padding-left: 0;
                }

                .ant-picker-range {
                    display: flex;
                    padding-right: 11px;
                    .ant-picker-input {
                        flex: 1;
                    }
                }

                .ant-picker-input {
                    display: flex;
                    padding: 0 11px;
                    > input {
                        flex: 1;
                    }

                    .ant-picker-suffix {
                        flex: initial;
                    }
                }
            }
        `;
        }
        return `
        ${result.itemStyle || ""}
        ${result.componentStyle || ""}
        ${result.borderStyle || ""}
    `;
      };

      var _a, _b, _c;
      const isIECompat = !("grid-column-gap" in (((_c = (_b = (_a = globalThisPolyfill) == null ? void 0 : _a.document) == null ? void 0 : _b.documentElement) == null ? void 0 : _c.style) || {}));
      const getIEGridContainerStyle = (opts) => {
        if (isIECompat) {
          const { gutter, autoRow } = opts;
          const halfGutter = Math.floor(gutter / 2);
          return `
            display: flex;
            ${autoRow ? "flex-flow: row wrap;" : ""}
            margin: -${halfGutter}px -${halfGutter}px;
            grid-column-gap: 0;
            grid-row-gap: 0;
            
            .button-group {
                padding-left: ${halfGutter}px;
                display: flex;
                align-items: center;   
            }
        `;
        }
        return "";
      };
      const getIEContainerAntd3Style = (opts) => {
        if (isIECompat) {
          return `
            .ant-form-item-control-wrapper {
                display: flex;
                flex-direction: column;

                > .ant-form-item-control {

                    > .ant-form-item-children {
                        display: flex;
                        flex-direction: column;
                        min-height: 32px;
                    }
                }
            }

            > .ant-form-item-control-wrapper {
                flex: 1;
            }
            
        `;
        }
        return "";
      };
      const getValidSpan = (span, cols) => span > cols ? cols : span;
      const getIEGridItemStyle = (opts) => {
        if (isIECompat) {
          const {
            gutter,
            span,
            columns,
            isSecondary,
            responsive,
            nested,
            enableResponsive
          } = opts;
          const halfGutter = Math.floor(gutter / 2);
          const flexBase = `${Number((Number(getValidSpan(span, columns)) / Number(columns)).toFixed(6)) * 100}%`;
          const itemStyle = `
            ${nested ? `padding: ${halfGutter}px ${halfGutter}px 0;` : `padding: ${halfGutter}px;`}
            max-width: ${flexBase};
            flex: 0 0 ${flexBase};
        `;
          let responsiveStyle = "";
          if (isSecondary && enableResponsive) {
            const { s, m, lg } = responsive;
            const sFlexBase = `${Number((Number(getValidSpan(span, s)) / Number(s)).toFixed(6)) * 100}%`;
            const mFlexBase = `${Number((Number(getValidSpan(span, m)) / Number(m)).toFixed(6)) * 100}%`;
            const lgFlexBase = `${Number((Number(getValidSpan(span, lg)) / Number(lg)).toFixed(6)) * 100}%`;
            responsiveStyle = `
                @media (max-width: 720px) {
                    flex: 0 0 ${sFlexBase};
                    max-width: ${sFlexBase};
                }
                @media (min-width: 720px) and (max-width: 1200px) {
                    flex: 0 0 ${mFlexBase};
                    max-width: ${mFlexBase};
                }
                @media (min-width: 1200px) {
                    flex: 0 0 ${lgFlexBase};
                    max-width: ${lgFlexBase};
                }
            `;
          }
          return `
            ${itemStyle}
            ${responsiveStyle}
        `;
        }
        return "";
      };

      const formatPx = (num) => typeof num === "string" ? num.replace("px", "") : num;
      const computeAntdStyleBase = exports('computeAntdStyleBase', (props, debug) => {
        const result = {};
        const {
          labelAlign,
          isLayout,
          isSecondary,
          inline,
          nested,
          inset,
          labelCol,
          grid,
          context = {},
          contextColumns,
          columns,
          autoRow,
          span,
          size,
          hasBorder,
          responsive,
          enableSafeWidth
        } = props;
        const { lg, m, s } = responsive || {};
        const labelWidth = formatPx(props.labelWidth);
        const wrapperWidth = formatPx(props.wrapperWidth);
        const gutter = formatPx(props.gutter);
        if (inset) {
          result.insetStyle = insetStyle({ hasBorder, isLayout });
        }
        result.antdV3Style = `
        .ant-form-item-control:first-child:not([class^='ant-col-']):not([class*=' ant-col-']) {
            width: 100%;
        }
        &.ant-row {
            display: flex;
            flex-flow: row wrap;

            .ant-form-item-label {
                line-height: 1.5715;
                float: none;
                > label {
                    display: inline-flex;
                    align-items: center;
                    height: ${size === "small" ? "24px" : size === "middle" || !size ? "32px" : "40px"};
                    font-size: ${size === "small" ? "14px" : size === "middle" || !size ? "14px" : "16px"};
                }
            }

            > .ant-form-item-control-wrapper:not([class*='ant-col-']) {
                float: none;
                flex: 1 1 0;
            }
        }

        .mega-layout-item-content {
            .ant-radio-wrapper {
                vertical-align: middle;
            }
        }
        ${getIEContainerAntd3Style()}
    `;
        const disabledResponsive = context.grid && grid && context.responsive;
        result.labelAlignStyle = `
        & > .ant-form-item-label {
            text-align: ${labelAlign !== "top" ? labelAlign || "right" : "left"};
        }
    `;
        result.addonStyle = `
        & > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-container-wrapper,
        & > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-item-content,
        & > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-container-wrapper,
        & > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-item-content {
            display: flex;
            line-height: ${size === "small" ? "24px" : size === "middle" || !size ? "32px" : "40px"};
            > .mega-layout-container-content {
                margin-bottom: 0;
                flex: 1;
            }

            > .mega-layout-container-before,
            > .formily-mega-item-before {
                flex: initial;
                margin-right: ${`${parseInt(gutter) / 2}px`};
                margin-bottom: 0;
                display: inline-flex;
                align-items: center;
                height: ${size === "small" ? "24px" : size === "middle" || !size ? "32px" : "40px"};
                font-size: ${size === "small" ? "14px" : size === "middle" || !size ? "14px" : "16px"};
            }

            > .mega-layout-container-after,
            > .formily-mega-item-after {
                flex: initial;
                margin-left: ${`${parseInt(gutter) / 2}px`};
                margin-bottom: 0;
                display: inline-flex;
                align-items: center;
                height: ${size === "small" ? "24px" : size === "middle" || !size ? "32px" : "40px"};
                font-size: ${size === "small" ? "14px" : size === "middle" || !size ? "14px" : "16px"};
            }
        }

        & > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-container-wrapper,
        & > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-item-content {
            .ant-form-item-label {
                line-height: 1.5715;
            }            
            .ant-form-item-label label {
                height: ${size === "small" ? "24px" : size === "middle" || !size ? "32px" : "40px"};
                font-size: ${size === "small" ? "14px" : size === "middle" || !size ? "14px" : "16px"};
                display: inline-flex;
                align-items: center;
            }
        }
    `;
        if (labelAlign !== "top" && !labelWidth && !labelCol) {
          result.defaultStyle = `
            display: flex;
            box-sizing: border-box;
        
            & > .ant-form-item-label {
                flex: initial;
            }
            & > .ant-form-item-control {
                flex: 1;
            }
        `;
        }
        if (labelAlign === "top") {
          result.labelAlignStyle += `
            &.mega-layout-item {
                display: ${inline ? "inline-block" : "block"};
            }
        `;
        }
        if (labelAlign === "top") {
          result.defaultStyle = `
            &.ant-form-item.ant-row {
                display: block;
            }
        `;
        }
        if (labelWidth || wrapperWidth) {
          result.widthStyle = `
            display: flex;
            box-sizing: border-box;
            flex-direction: ${props.labelAlign !== "top" ? "row" : "column"};
            
            & > .ant-form-item-label{
                ${labelWidth ? `
                    width: ${labelWidth}px;
                    max-width: ${labelWidth}px;
                    flex: ${labelAlign !== "top" ? `0 0 ${labelWidth}px` : "initial"};
                    ` : ""}
            }

            & > .ant-form-item-control-wrapper,
            & > .ant-form-item-control {
                ${wrapperWidth ? `
                    width: ${wrapperWidth}px;
                    max-width: ${wrapperWidth}px;
                    flex: ${labelAlign !== "top" ? `0 0 ${wrapperWidth}px` : "initial"};
                    ` : `flex: 1;`}
            }
        `;
        }
        if (inline) {
          result.inlineStyle = `
            & {
                display: inline-block;
                vertical-align: top;

                > .ant-form-item-label {
                    display: inline-block;
                    vertical-align: top;
                }

                > .ant-form-item-control {
                    display: ${labelAlign !== "top" ? "inline-block" : "block"};
                }                
            }

            &.mega-layout-item {
                > .ant-form-item-control-wrapper {
                    display: ${labelAlign !== "top" ? "inline-block" : "block"};
                } 
            }
        `;
          if (!isLayout) {
            result.inlineStyle += `
                &.ant-form-item.ant-row {
                    display: inline-block;
                    vertical-align: top;
                }
                &:not(:last-child) {
                    margin-right: ${gutter}px;
                }

                .ant-form-item-explain.show-help-leave {
                    animation-duration: 0s;
                }
            `;
          }
        }
        const gridContainerStyle = (nested2) => {
          const frStyle = !enableSafeWidth || nested2 ? "1fr" : "minmax(100px, 1fr)";
          const containerStyle = !disabledResponsive && responsive ? `
            @media (max-width: 720px) {
                grid-template-columns: repeat(${!enableSafeWidth || autoRow ? s : "auto-fit"}, ${frStyle});
            }
            
            @media (min-width: 720px) and (max-width: 1200px) {
                grid-template-columns: repeat(${!enableSafeWidth || autoRow ? m : "auto-fit"}, ${frStyle});
            }
            @media (min-width: 1200px) {
                grid-template-columns: repeat(${!enableSafeWidth || autoRow ? lg : "auto-fit"}, ${frStyle});
            }
        ` : `
            grid-template-columns: repeat(${!enableSafeWidth || autoRow ? columns : "auto-fit"}, ${frStyle});
        `;
          return `
            display: grid;
            grid-column-gap: ${parseInt(gutter)}px;
            grid-row-gap: ${parseInt(gutter)}px;
            ${containerStyle}
            ${getIEGridContainerStyle({ gutter, autoRow })}            
        `;
        };
        const minColumns = nested ? Math.min(columns, contextColumns) : columns;
        const gridItemSpanStyle = () => {
          const itemStyle = !disabledResponsive && responsive ? `
            @media (max-width: 720px) {
                grid-column-start: span ${s > span ? span : s};
            }
            @media (min-width: 720px) and (max-width: 1200px) {
                grid-column-start: span ${m > span ? span : m};
            }
            @media (min-width: 1200px) {
                grid-column-start: span ${lg > span ? span : lg};
            }
        ` : `
            grid-column-start: span ${minColumns > span ? span : minColumns};
        `;
          return `
            ${itemStyle}
            ${getIEGridItemStyle({
      nested,
      isSecondary,
      gutter,
      enableResponsive: !disabledResponsive && responsive,
      responsive,
      span,
      autoRow,
      columns: contextColumns || columns
    })}
        `;
        };
        if (!context.grid && grid) {
          result.gridStyle = `
            & > .ant-form-item {
                width: 100%;
            }
            & > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-container-wrapper,
            & > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-item-content,
            & > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-container-wrapper,
            & > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-item-content {
                display: flex;
                > .mega-layout-container-content {
                    &.grid {
                        ${gridContainerStyle()}
                    }
                }
            }
        `;
        }
        if (nested) {
          result.nestLayoutItemStyle = `
            &.mega-layout-nest-container {
                > .mega-layout-container {
                    width: 100%;
                    margin-bottom: 0;
                }
                ${gridItemSpanStyle()}
            }
        `;
        }
        if (!context.grid && grid && span) {
          result.gridItemStyle = `
        &.mega-layout-item-col { ${gridItemSpanStyle()} }

        .ant-form-item-explain.show-help-leave {
            animation-duration: 0s;
        }
        `;
        }
        if (context.grid && grid) {
          result.gridStyle = `
            & > .ant-form-item {
                width: 100%;
            }

            & > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-container-wrapper,
            & > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-item-content,
            & > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-container-wrapper,
            & > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-item-content {
                display: flex;
                > .mega-layout-container-content {
                    &.grid {
                        ${gridContainerStyle(true)}
                    }
                }
            }
        `;
        }
        if (isLayout) {
          result.layoutMarginStyle = "";
          if (inline || grid) {
            result.layoutMarginStyle = `
                > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-item-col > .ant-form-item,
                > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-item-col > .mega-layout-item,
                > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-item,
                > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-item-col > .ant-form-item,
                > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-item-col > .mega-layout-item,
                > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-item {
                    margin-bottom: 0;
                }
            `;
          }
          if (!grid && !inline) {
            result.layoutMarginStyle = `
                > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-item:last-child,
                > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-item:last-child {
                    margin-bottom: 0;
                }
            `;
          }
          if (isLayout) {
            result.layoutMarginStyle += `
                > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-container:last-child,
                > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .mega-layout-container-wrapper > .mega-layout-container-content > .mega-layout-container:last-child {
                    margin-bottom: 0;
                }
            `;
          }
        }
        return result;
      });
      const computeStyle = exports('computeStyle', (props, debug) => {
        const styleResult = computeAntdStyleBase(props);
        return css_1`        
        ${styleResult.antdV3Style}
        ${styleResult.labelAlignStyle}
        ${styleResult.addonStyle}
        ${styleResult.defaultStyle}
        ${styleResult.widthStyle}
        ${styleResult.inlineStyle}
        ${styleResult.gridStyle}
        ${styleResult.gridItemStyle}
        ${styleResult.nestLayoutItemStyle}
        ${styleResult.layoutMarginStyle}
        ${styleResult.insetStyle}
    `;
      });

      var __defProp$4 = Object.defineProperty;
      var __defProps$4 = Object.defineProperties;
      var __getOwnPropDescs$4 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
      var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
      var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$4 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$4.call(b, prop))
            __defNormalProp$4(a, prop, b[prop]);
        if (__getOwnPropSymbols$4)
          for (var prop of __getOwnPropSymbols$4(b)) {
            if (__propIsEnum$4.call(b, prop))
              __defNormalProp$4(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$4 = (a, b) => __defProps$4(a, __getOwnPropDescs$4(b));
      var __objRest$2 = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$4.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$4)
          for (var prop of __getOwnPropSymbols$4(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$4.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      const computeAttr = (propAttr, layoutAttr, defaultValue) => {
        if (typeof propAttr !== "undefined")
          return propAttr;
        if (typeof layoutAttr !== "undefined")
          return layoutAttr;
        return defaultValue;
      };
      const StyledLayoutItem = _default((props) => {
        const _a = props, { className, grid, children, addonBefore, addonAfter, labelAlign } = _a, others = __objRest$2(_a, ["className", "grid", "children", "addonBefore", "addonAfter", "labelAlign"]);
        const formItemProps = pickFormItemProps(others);
        formItemProps.style = props.style || {};
        const cls = classnames({
          [className]: true,
          "mega-layout-item": true,
          "mega-layout-item-col": grid
        });
        let finalHelpInfo = null;
        if (props.inset && formItemProps.validateStatus) {
          finalHelpInfo = /* @__PURE__ */ React$1.createElement("div", {
            className: "mega-layout-item-inset-help"
          }, formItemProps.help[0]);
        }
        const finalFormItem = (cls2) => /* @__PURE__ */ React$1.createElement(Form$1.Item, __spreadValues$4({
          className: cls2
        }, formItemProps), /* @__PURE__ */ React$1.createElement("div", {
          className: "mega-layout-item-content"
        }, addonBefore ? /* @__PURE__ */ React$1.createElement("p", {
          className: "formily-mega-item-before"
        }, addonBefore) : null, children, addonAfter ? /* @__PURE__ */ React$1.createElement("p", {
          className: "formily-mega-item-after"
        }, addonAfter) : null));
        if (grid) {
          return /* @__PURE__ */ React$1.createElement("div", {
            className: classnames({
              [cls]: true,
              "mega-layout-item-inset": props.inset,
              "mega-layout-item-inset-has-error": formItemProps.validateStatus === "error",
              "mega-layout-item-inset-has-warning": formItemProps.validateStatus === "warning"
            })
          }, finalFormItem(className), finalHelpInfo);
        }
        return finalFormItem(cls);
      })`${(props) => computeStyle(props)}`;
      const StyledLayoutWrapper = _default((props) => {
        const formItemProps = pickFormItemProps(props);
        const _a = formItemProps, others = __objRest$2(_a, ["labelAlign", "addonAfter", "addonBefore"]);
        others.children = props.children;
        others.className = props.className;
        return /* @__PURE__ */ React$1.createElement(Form$1.Item, __spreadValues$4({}, others));
      })`${(props) => computeStyle(props)}`;
      const StyledLayoutNestWrapper = _default((props) => {
        const { children, style, className } = props;
        return /* @__PURE__ */ React$1.createElement("div", {
          style,
          className: classnames("mega-layout-nest-container", className)
        }, children);
      })`${(props) => computeStyle(props)}`;
      const MegaLayout = exports('MegaLayout', (props) => {
        const _a = props, { children, addonBefore, addonAfter, description, className: megaLayoutClassName } = _a, others = __objRest$2(_a, ["children", "addonBefore", "addonAfter", "description", "className"]);
        const layoutProps = props.layoutProps || {};
        const { size } = useDeepFormItem();
        return /* @__PURE__ */ React$1.createElement(Layout, __spreadProps$4(__spreadValues$4({
          defaultSettings: {
            gutter: 20
          }
        }, others), {
          size,
          children: (layout) => {
            const {
              inline,
              required,
              columns,
              label,
              labelAlign,
              grid,
              gutter,
              autoRow,
              span,
              contextColumns,
              full,
              context,
              isRoot,
              responsive,
              inset,
              hasBorder,
              enableSafeWidth
            } = layout;
            const isSecondary = context.isRoot;
            const itemProps = {
              enableSafeWidth,
              isSecondary,
              inline,
              grid,
              autoRow,
              gutter,
              full,
              context,
              columns,
              contextColumns,
              isRoot,
              isLayout: true,
              responsive,
              size,
              inset,
              hasBorder
            };
            if (label) {
              const labelWidth = computeAttr(layoutProps.labelWidth, context.labelWidth, -1);
              const wrapperWidth = computeAttr(layoutProps.wrapperWidth, context.wrapperWidth, -1);
              const labelCol = computeAttr(layoutProps.labelCol, context.labelCol, -1);
              const wrapperCol = computeAttr(layoutProps.wrapperCol, context.wrapperCol, -1);
              const labelAlign2 = computeAttr(layoutProps.labelAlign, context.labelAlign, -1);
              if (labelAlign2)
                itemProps.labelAlign = labelAlign2;
              if (labelCol !== -1)
                itemProps.labelCol = normalizeCol(labelCol);
              if (wrapperCol !== -1)
                itemProps.wrapperCol = normalizeCol(wrapperCol);
              if (labelWidth !== -1)
                itemProps.labelWidth = labelWidth;
              if (wrapperWidth !== -1)
                itemProps.wrapperWidth = wrapperWidth;
            }
            let ele = /* @__PURE__ */ React$1.createElement(StyledLayoutWrapper, __spreadValues$4({
              className: classnames("mega-layout-container", megaLayoutClassName || ""),
              label,
              required,
              help: description,
              labelAlign: label ? labelAlign : void 0
            }, itemProps), /* @__PURE__ */ React$1.createElement("div", {
              className: "mega-layout-container-wrapper"
            }, addonBefore ? /* @__PURE__ */ React$1.createElement("p", {
              className: "mega-layout-container-before"
            }, addonBefore) : null, /* @__PURE__ */ React$1.createElement("div", {
              className: classnames("mega-layout-container-content", { grid })
            }, children), addonAfter ? /* @__PURE__ */ React$1.createElement("p", {
              className: "mega-layout-container-after"
            }, addonAfter) : null));
            if (!props.grid && grid) {
              return /* @__PURE__ */ React$1.createElement(StyledLayoutNestWrapper, __spreadValues$4({
                nested: true
              }, { span, columns, contextColumns, gutter, isSecondary, context, responsive }), ele);
            }
            return ele;
          }
        }));
      });
      const MegaLayoutItem = exports('MegaLayoutItem', (props) => {
        const _a = props, { children, schemaChildren, itemProps } = _a, others = __objRest$2(_a, ["children", "schemaChildren", "itemProps"]);
        const megaProps = (schemaChildren ? others["x-mega-props"] : others["mega-props"]) || {};
        const isObjectField = others.type === "object";
        return React$1.createElement(LayoutItem, megaProps, (layoutProps) => {
          const componentProps = pickNotFormItemProps(others);
          let schemaComponent = schemaChildren;
          if (layoutProps) {
            const { addonBefore, addonAfter } = megaProps;
            const {
              columns,
              span,
              gutter,
              grid,
              inline,
              labelWidth,
              wrapperWidth,
              labelAlign,
              labelCol,
              wrapperCol,
              full,
              responsive,
              size,
              inset,
              hasBorder,
              context,
              enableSafeWidth
            } = layoutProps;
            const isSecondary = context.isRoot;
            itemProps.isSecondary = isSecondary;
            itemProps.hasBorder = hasBorder;
            itemProps.inset = inset;
            itemProps.labelAlign = labelAlign;
            itemProps.inline = inline;
            itemProps.grid = grid;
            itemProps.gutter = gutter;
            itemProps.span = span;
            itemProps.columns = columns;
            itemProps.full = full;
            itemProps.enableSafeWidth = enableSafeWidth;
            itemProps.responsive = responsive;
            if (labelCol !== -1)
              itemProps.labelCol = normalizeCol(labelCol);
            if (wrapperCol !== -1)
              itemProps.wrapperCol = normalizeCol(wrapperCol);
            if (labelWidth !== -1)
              itemProps.labelWidth = labelWidth;
            if (wrapperWidth !== -1)
              itemProps.wrapperWidth = wrapperWidth;
            if (addonBefore)
              itemProps.addonBefore = addonBefore;
            if (addonAfter)
              itemProps.addonAfter = addonAfter;
            if (full) {
              componentProps.style = __spreadProps$4(__spreadValues$4({}, componentProps.style || {}), {
                width: "100%",
                flex: "1 1 0%"
              });
            }
            if (size) {
              componentProps.size = size;
            }
            if (isObjectField) {
              const objectFieldProps = __spreadValues$4({}, megaProps);
              objectFieldProps.label = itemProps.label;
              return React$1.createElement(MegaLayout, objectFieldProps, schemaChildren ? children(schemaComponent) : children(componentProps));
            }
            return React$1.createElement(StyledLayoutItem, itemProps, schemaChildren ? children(schemaComponent) : children(componentProps));
          }
          return children();
        });
      });
      const FormMegaLayout = exports('FormMegaLayout', createVirtualBox("mega-layout", MegaLayout));

      var __defProp$3 = Object.defineProperty;
      var __defProps$3 = Object.defineProperties;
      var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
      var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
      var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$3 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$3.call(b, prop))
            __defNormalProp$3(a, prop, b[prop]);
        if (__getOwnPropSymbols$3)
          for (var prop of __getOwnPropSymbols$3(b)) {
            if (__propIsEnum$3.call(b, prop))
              __defNormalProp$3(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
      var __objRest$1 = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$3.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$3)
          for (var prop of __getOwnPropSymbols$3(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$3.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      const { Item: AntdFormItem } = Form$1;
      const computeStatus$1 = (props) => {
        if (props.loading) {
          return "validating";
        }
        if (props.invalid) {
          return "error";
        }
        if (props.warnings && props.warnings.length) {
          return "warning";
        }
        if (props.active) {
          return "success";
        }
        return "";
      };
      const computeMessage = (errors, warnings) => {
        const messages = [].concat(errors || [], warnings || []);
        return messages.length ? messages.map((message, index) => React$1.createElement("span", { key: index }, message, messages.length - 1 > index ? " ," : "")) : void 0;
      };
      const ConnectedComponent = Symbol("connected");
      const FormItem = exports('FormItem', (topProps) => {
        const _a = topProps || {}, {
          name,
          initialValue,
          value,
          visible,
          display,
          required,
          editable,
          triggerType,
          unmountRemoveValue,
          valueName,
          eventName,
          getValueFromEvent,
          rules,
          children,
          component,
          props
        } = _a, itemProps = __objRest$1(_a, [
          "name",
          "initialValue",
          "value",
          "visible",
          "display",
          "required",
          "editable",
          "triggerType",
          "unmountRemoveValue",
          "valueName",
          "eventName",
          "getValueFromEvent",
          "rules",
          "children",
          "component",
          "props"
        ]);
        const topFormItemProps = useDeepFormItem();
        const renderComponent = ({ props: props2, state, mutators, form }) => {
          if (!component) {
            if (children)
              return /* @__PURE__ */ React$1.createElement(Fragment, null, children);
            log.error(`Can't fount the component. Its key is ${name}.`);
            return null;
          }
          if (!component["__ALREADY_CONNECTED__"]) {
            component[ConnectedComponent] = component[ConnectedComponent] || connect({
              eventName,
              valueName,
              getValueFromEvent
            })(component);
          }
          return React$1.createElement(component["__ALREADY_CONNECTED__"] ? component : component[ConnectedComponent], __spreadProps$3(__spreadValues$3({}, state), {
            props: {
              ["x-component-props"]: props2
            },
            form,
            mutators
          }), children);
        };
        const renderField = (fieldProps) => {
          const { form, state, mutators } = fieldProps;
          const { props: props2, errors, warnings, editable: editable2, required: required2 } = state;
          const { labelCol, wrapperCol, help } = props2;
          const formItemProps = pickFormItemProps(props2);
          const _a2 = pickNotFormItemProps(props2), componentProps = __objRest$1(_a2, ["inline"]);
          const { size } = topFormItemProps;
          const itemProps2 = __spreadProps$3(__spreadValues$3({}, formItemProps), {
            required: editable2 === false ? void 0 : required2,
            labelCol: formItemProps.label ? normalizeCol(labelCol) : {},
            wrapperCol: formItemProps.label ? normalizeCol(wrapperCol) : {},
            validateStatus: computeStatus$1(state),
            help: computeMessage(errors, warnings) || help
          });
          return /* @__PURE__ */ React$1.createElement(MegaLayoutItem, __spreadValues$3({
            itemProps: __spreadProps$3(__spreadValues$3({}, itemProps2), { size })
          }, props2), (megaComponentProps) => {
            if (megaComponentProps) {
              return renderComponent({ props: megaComponentProps, state, mutators, form });
            }
            return /* @__PURE__ */ React$1.createElement(AntdFormItem, __spreadValues$3({}, itemProps2), renderComponent({ props: componentProps, state, mutators, form }));
          });
        };
        if (!component && children) {
          return /* @__PURE__ */ React$1.createElement(InternalVirtualField, {
            name,
            visible,
            display,
            props: __spreadValues$3(__spreadValues$3(__spreadValues$3({}, topFormItemProps), itemProps), props)
          }, renderField);
        }
        return /* @__PURE__ */ React$1.createElement(InternalField, {
          name,
          initialValue,
          unmountRemoveValue,
          value,
          visible,
          display,
          required,
          rules,
          editable,
          triggerType,
          props: __spreadValues$3(__spreadValues$3(__spreadValues$3({}, topFormItemProps), itemProps), props)
        }, renderField);
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
      var __objRest = (source, exclude) => {
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
      const AntdSchemaFormAdaptor = exports('AntdSchemaFormAdaptor', (props) => {
        const _a = props, { inline, previewPlaceholder, onSubmit, onReset } = _a, rest = __objRest(_a, ["inline", "previewPlaceholder", "onSubmit", "onReset"]);
        return /* @__PURE__ */ React$1.createElement(FormItemDeepProvider, __spreadValues$2({}, props), /* @__PURE__ */ React$1.createElement(PreviewText.ConfigProvider, {
          value: props
        }, /* @__PURE__ */ React$1.createElement(Form$1, __spreadProps$2(__spreadValues$2({}, rest), {
          labelCol: normalizeCol(props.labelCol),
          wrapperCol: normalizeCol(props.wrapperCol),
          layout: inline ? "inline" : props.layout,
          onSubmit,
          onReset,
          component: useMemo(() => {
            if (isAntdV4) {
              return (innerProps) => {
                return React$1.createElement("form", __spreadProps$2(__spreadValues$2({}, innerProps), {
                  onSubmit,
                  onReset
                }));
              };
            }
          }, [])
        }))));
      });

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
      const computeStatus = (props) => {
        if (props.loading) {
          return "validating";
        }
        if (props.invalid) {
          return "error";
        }
        if (props.warnings && props.warnings.length) {
          return "warning";
        }
        return "";
      };
      const computeHelp = (props) => {
        if (props.help)
          return props.help;
        const messages = [].concat(props.errors || [], props.warnings || []);
        return messages.length ? messages.map((message, index) => createElement("span", { key: index }, message, messages.length - 1 > index ? " ," : "")) : props.schema && props.schema.description;
      };
      const computeLabel = (props) => {
        if (props.label)
          return props.label;
        if (props.schema && props.schema.title) {
          return props.schema.title;
        }
      };
      const computeExtra = (props) => {
        if (props.extra)
          return props.extra;
      };
      const computeSchemaExtendProps = (props) => {
        if (props.schema) {
          return pickFormItemProps(__spreadValues$1(__spreadValues$1({}, props.schema.getExtendsItemProps()), props.schema.getExtendsProps()));
        }
      };
      const AntdSchemaFieldAdaptor = exports('AntdSchemaFieldAdaptor', (props) => {
        const {
          prefixCls,
          labelAlign,
          labelCol: contextLabelCol,
          wrapperCol: contextWrapperCol,
          size
        } = useDeepFormItem();
        const help = computeHelp(props);
        const label = computeLabel(props);
        const status = computeStatus(props);
        const extra = computeExtra(props);
        const formItemProps = pickFormItemProps(props);
        const schemaItemProps = computeSchemaExtendProps(props);
        const formItemShallowProps = useShallowFormItem();
        const mergedProps = __spreadValues$1(__spreadValues$1(__spreadValues$1({
          label
        }, formItemShallowProps), formItemProps), schemaItemProps);
        const { labelCol, wrapperCol } = mergedProps;
        const addonAfter = mergedProps.addonAfter;
        delete mergedProps.addonAfter;
        const itemProps = __spreadProps$1(__spreadValues$1({
          prefixCls,
          labelAlign,
          help,
          validateStatus: status,
          extra: extra ? /* @__PURE__ */ React$1.createElement("p", null, extra) : void 0
        }, mergedProps), {
          required: props.editable === false ? void 0 : props.required,
          labelCol: label ? normalizeCol(labelCol || contextLabelCol) : {},
          wrapperCol: label ? normalizeCol(wrapperCol || contextWrapperCol) : {}
        });
        const renderComponent = (children, opts) => {
          const { addonAfter: addonAfter2 } = opts || {};
          return addonAfter2 ? /* @__PURE__ */ React$1.createElement("div", {
            style: { display: "flex", alignItems: "center" }
          }, /* @__PURE__ */ React$1.createElement(FormItemShallowProvider, null, children), addonAfter2) : /* @__PURE__ */ React$1.createElement(FormItemShallowProvider, null, children);
        };
        return /* @__PURE__ */ React$1.createElement(MegaLayoutItem, __spreadProps$1(__spreadValues$1({
          itemProps: __spreadProps$1(__spreadValues$1({}, itemProps), { size })
        }, props.props), {
          schemaChildren: props.children
        }), (megaComponent) => {
          if (megaComponent) {
            return renderComponent(megaComponent, { addonAfter });
          }
          return /* @__PURE__ */ React$1.createElement(Form$1.Item, __spreadValues$1({}, itemProps), renderComponent(props.children, { addonAfter }));
        });
      });

      registerFormComponent(AntdSchemaFormAdaptor);
      registerFormItemComponent(AntdSchemaFieldAdaptor);

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
      const useFormTableQuery = exports('useFormTableQuery', (service, middlewares, defaultProps = {}) => {
        const ref = useRef({});
        const [pagination, setPagination] = useState(defaults({
          current: 1,
          total: 0,
          pageSize: 20
        }, defaultProps.pagination));
        const [sorter, setSorter] = useState(defaultProps.sorter);
        const [filters, setFilters] = useState(defaultProps.filters);
        const { effects, trigger, onSubmit, loading, response } = useFormQuery(async (values) => {
          return service({
            values,
            pagination: ref.current.pagination,
            sorter: ref.current.sorter,
            filters: ref.current.filters
          });
        }, middlewares, ref.current);
        ref.current.trigger = trigger;
        ref.current.pagination = pagination;
        ref.current.sorter = sorter;
        ref.current.filters = filters;
        ref.current.setPagination = setPagination;
        ref.current.setSorter = setSorter;
        ref.current.setFilters = setFilters;
        return {
          setPagination,
          setSorter,
          setFilters,
          trigger,
          form: {
            effects,
            onSubmit
          },
          table: {
            loading,
            dataSource: response.dataSource || [],
            pagination: __spreadProps(__spreadValues({}, pagination), {
              current: response.current || 1,
              pageSize: response.pageSize || 20,
              total: response.total || 0
            }),
            onChange: (pagination2, filters2, sorter2) => {
              let type = "";
              if (pagination2) {
                setPagination(pagination2);
                type = "onPageQuery";
              }
              if (filters2) {
                setFilters(filters2);
                type = "onFilterQuery";
              }
              if (sorter2) {
                setSorter(sorter2);
                type = "onSorterQuery";
              }
              trigger(type);
            }
          }
        };
      });

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW50ZC4xLjMuMTMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGFyZWQudHMiLCIuLi9zcmMvY29tcG9uZW50cy9CdXR0b24udHN4IiwiLi4vbm9kZV9tb2R1bGVzL2NsYXNzbmFtZXMvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcmVhY3Qtc3Rpa2t5L2xpYi91dGlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9yZWFjdC1zdGlra3kvbGliL29mZnNldC5qcyIsIi4uL25vZGVfbW9kdWxlcy93aW5kb3ctc2Nyb2xsL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3JlYWN0LXN0aWtreS9saWIvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGlzL3N0eWxpcy5taW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGlzLXJ1bGUtc2hlZXQvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vdW5pdGxlc3MvZGlzdC91bml0bGVzcy5icm93c2VyLmNqcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1pcy9janMvcmVhY3QtaXMucHJvZHVjdGlvbi5taW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbWVtb2l6ZS1vbmUvZGlzdC9tZW1vaXplLW9uZS5janMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2ZhY3RvcnlXaXRoVHlwZUNoZWNrZXJzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvZmFjdG9yeVdpdGhUaHJvd2luZ1NoaW1zLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vbWVtb2l6ZS9kaXN0L21lbW9pemUuYnJvd3Nlci5janMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGVtb3Rpb24vaXMtcHJvcC12YWxpZC9kaXN0L2lzLXByb3AtdmFsaWQuYnJvd3Nlci5janMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvaXMtd2hhdC9kaXN0L2luZGV4LmNqcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tZXJnZS1hbnl0aGluZy9kaXN0L2luZGV4LmNqcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZWQtY29tcG9uZW50cy9kaXN0L3N0eWxlZC1jb21wb25lbnRzLmJyb3dzZXIuY2pzLmpzIiwiLi4vc3JjL2NvbnRleHQudHN4IiwiLi4vc3JjL2NvbXBvbmVudHMvRm9ybUJ1dHRvbkdyb3VwLnRzeCIsIi4uL3NyYy9jb21wb25lbnRzL1NjaGVtYUZvcm0udHN4IiwiLi4vc3JjL2NvbXBvbmVudHMvRmllbGQudHN4IiwiLi4vc3JjL2NvbXBvbmVudHMvRm9ybS50c3giLCIuLi9zcmMvY29tcG9uZW50cy9Gb3JtTWVnYUxheW91dC9pbnNldC50c3giLCIuLi9zcmMvY29tcG9uZW50cy9Gb3JtTWVnYUxheW91dC9pZS50c3giLCIuLi9zcmMvY29tcG9uZW50cy9Gb3JtTWVnYUxheW91dC9zdHlsZS50c3giLCIuLi9zcmMvY29tcG9uZW50cy9Gb3JtTWVnYUxheW91dC9pbmRleC50c3giLCIuLi9zcmMvY29tcG9uZW50cy9Gb3JtSXRlbS50c3giLCIuLi9zcmMvYWRhcHRvci9Gb3JtLnRzeCIsIi4uL3NyYy9hZGFwdG9yL0Zvcm1JdGVtLnRzeCIsIi4uL3NyYy9hZGFwdG9yL2luZGV4LnRzIiwiLi4vc3JjL2hvb2tzL3VzZUZvcm1UYWJsZVF1ZXJ5LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBQcmV2aWV3VGV4dCB9IGZyb20gJ0Bmb3JtaWx5L3JlYWN0LXNoYXJlZC1jb21wb25lbnRzJ1xuaW1wb3J0IHtcbiAgSUNvbm5lY3RQcm9wcyxcbiAgTWVyZ2VkRmllbGRDb21wb25lbnRQcm9wcyxcbiAgZ2V0UmVnaXN0cnlcbn0gZnJvbSAnQGZvcm1pbHkvcmVhY3Qtc2NoZW1hLXJlbmRlcmVyJ1xuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJ2FudGQnXG5pbXBvcnQgeyBlYWNoLCBpc0FyciB9IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmV4cG9ydCAqIGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcblxuZXhwb3J0IGNvbnN0IGlzQW50ZFY0ID0gL140XFwuLy50ZXN0KHZlcnNpb24pXG5cbmV4cG9ydCBjb25zdCBjbG9uZUNobGlsZHJlbiA9IChjaGlsZHJlbjogYW55LCBwcm9wcz86IGFueSkgPT4ge1xuICByZXR1cm4gUmVhY3QuaXNWYWxpZEVsZW1lbnQoY2hpbGRyZW4pXG4gICAgPyBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGRyZW4sIHtcbiAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgIGNoaWxkcmVuOiBjbG9uZUNobGlsZHJlbihjaGlsZHJlbi5wcm9wc1snY2hpbGRyZW4nXSlcbiAgICAgIH0pXG4gICAgOiBpc0FycihjaGlsZHJlbilcbiAgICA/IGNoaWxkcmVuLm1hcCgoY2hpbGQsIGtleSkgPT4gY2xvbmVDaGxpbGRyZW4oY2hpbGQsIHsga2V5IH0pKVxuICAgIDogY2hpbGRyZW5cbn1cblxuZXhwb3J0IGNvbnN0IGF1dG9TY3JvbGxJblZhbGlkYXRlRmFpbGVkID0gKGZvcm1SZWY6IGFueSkgPT4ge1xuICBpZiAoZm9ybVJlZi5jdXJyZW50KSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50cyA9IGZvcm1SZWYuY3VycmVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICBpc0FudGRWNFxuICAgICAgICAgID8gJy5hbnQtZm9ybS1pdGVtLWhhcy1lcnJvcidcbiAgICAgICAgICA6ICcuYW50LWZvcm0taXRlbS1jb250cm9sLmhhcy1lcnJvcidcbiAgICAgIClcbiAgICAgIGlmIChlbGVtZW50cyAmJiBlbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFlbGVtZW50c1swXS5zY3JvbGxJbnRvVmlldykgcmV0dXJuXG4gICAgICAgIGVsZW1lbnRzWzBdLnNjcm9sbEludG9WaWV3KHtcbiAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCcsXG4gICAgICAgICAgaW5saW5lOiAnY2VudGVyJyxcbiAgICAgICAgICBibG9jazogJ2NlbnRlcidcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LCAzMClcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbWFwVGV4dENvbXBvbmVudCA9IChcbiAgVGFyZ2V0OiBSZWFjdC5KU1hFbGVtZW50Q29uc3RydWN0b3I8YW55PixcbiAgcHJvcHM6IGFueSxcbiAgZmllbGRQcm9wczogYW55ID0ge31cbik6IFJlYWN0LkpTWEVsZW1lbnRDb25zdHJ1Y3Rvcjxhbnk+ID0+IHtcbiAgY29uc3QgeyBlZGl0YWJsZSB9ID0gZmllbGRQcm9wc1xuICBpZiAoZWRpdGFibGUgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChlZGl0YWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBnZXRSZWdpc3RyeSgpLnByZXZpZXdUZXh0IHx8IFByZXZpZXdUZXh0XG4gICAgfVxuICB9XG4gIHJldHVybiBUYXJnZXRcbn1cblxuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybURhdGFTb3VyY2VLZXkgPSAoY29tcG9uZW50LCBkYXRhU291cmNlS2V5KSA9PiB7XG4gIHJldHVybiAoeyBkYXRhU291cmNlLCAuLi5vdGhlcnMgfSkgPT4ge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudCwge1xuICAgICAgW2RhdGFTb3VyY2VLZXldOiBkYXRhU291cmNlLFxuICAgICAgLi4ub3RoZXJzXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgbm9ybWFsaXplQ29sID0gKFxuICBjb2w/OiB7IHNwYW46IG51bWJlcjsgb2Zmc2V0PzogbnVtYmVyIH0gfCBudW1iZXIsXG4gIGRlZmF1bHRWYWx1ZT86IHsgc3BhbjogbnVtYmVyIH1cbik6IHsgc3BhbjogbnVtYmVyOyBvZmZzZXQ/OiBudW1iZXIgfSB8IHVuZGVmaW5lZCA9PiB7XG4gIGlmICghY29sKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB0eXBlb2YgY29sID09PSAnb2JqZWN0JyA/IGNvbCA6IHsgc3BhbjogTnVtYmVyKGNvbCkgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBwaWNrUHJvcHMgPSAob2JqZWN0OiBhbnksIHRhcmdldHM6IHN0cmluZ1tdKSA9PiB7XG4gIGNvbnN0IHNlbGVjdGVkOiBhbnkgPSB7fVxuICBjb25zdCBvdGhlcndpc2U6IGFueSA9IHt9XG4gIGVhY2gob2JqZWN0LCAodmFsdWU6IGFueSwga2V5OiBzdHJpbmcpID0+IHtcbiAgICBpZiAodGFyZ2V0cy5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICBzZWxlY3RlZFtrZXldID0gdmFsdWVcbiAgICB9IGVsc2Uge1xuICAgICAgb3RoZXJ3aXNlW2tleV0gPSB2YWx1ZVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHtcbiAgICBzZWxlY3RlZCxcbiAgICBvdGhlcndpc2VcbiAgfVxufVxuXG5jb25zdCBOZXh0Rm9ybUl0ZW1Qcm9wcyA9IFtcbiAgJ2NvbG9uJyxcbiAgJ2h0bWxGb3InLFxuICAndmFsaWRhdGVTdGF0dXMnLFxuICAncHJlZml4Q2xzJyxcbiAgJ3JlcXVpcmVkJyxcbiAgJ2xhYmVsQWxpZ24nLFxuICAnaGFzRmVlZGJhY2snLFxuICAnbGFiZWxDb2wnLFxuICAnd3JhcHBlckNvbCcsXG4gICdsYWJlbCcsXG4gICdoZWxwJyxcbiAgJ2V4dHJhJyxcbiAgJ2l0ZW1TdHlsZScsXG4gICdpdGVtQ2xhc3NOYW1lJyxcbiAgJ2FkZG9uQWZ0ZXInLFxuICAndG9vbHRpcCdcbl1cblxuZXhwb3J0IGNvbnN0IHBpY2tGb3JtSXRlbVByb3BzID0gKHByb3BzOiBhbnkpID0+IHtcbiAgY29uc3QgeyBzZWxlY3RlZCB9ID0gcGlja1Byb3BzKHByb3BzLCBOZXh0Rm9ybUl0ZW1Qcm9wcylcbiAgaWYgKCFwcm9wcy5sYWJlbCAmJiBwcm9wcy50aXRsZSkge1xuICAgIHNlbGVjdGVkLmxhYmVsID0gcHJvcHMudGl0bGVcbiAgfVxuICBpZiAoIXByb3BzLmhlbHAgJiYgcHJvcHMuZGVzY3JpcHRpb24pIHtcbiAgICBzZWxlY3RlZC5oZWxwID0gcHJvcHMuZGVzY3JpcHRpb25cbiAgfVxuICBpZiAoc2VsZWN0ZWQuaXRlbVN0eWxlKSB7XG4gICAgc2VsZWN0ZWQuc3R5bGUgPSBzZWxlY3RlZC5pdGVtU3R5bGVcbiAgICBkZWxldGUgc2VsZWN0ZWQuaXRlbVN0eWxlXG4gIH1cbiAgaWYgKHNlbGVjdGVkLml0ZW1DbGFzc05hbWUpIHtcbiAgICBzZWxlY3RlZC5jbGFzc05hbWUgPSBzZWxlY3RlZC5pdGVtQ2xhc3NOYW1lXG4gICAgZGVsZXRlIHNlbGVjdGVkLml0ZW1DbGFzc05hbWVcbiAgfVxuICByZXR1cm4gc2VsZWN0ZWRcbn1cblxuZXhwb3J0IGNvbnN0IHBpY2tOb3RGb3JtSXRlbVByb3BzID0gKHByb3BzOiBhbnkpID0+IHtcbiAgcmV0dXJuIHBpY2tQcm9wcyhwcm9wcywgTmV4dEZvcm1JdGVtUHJvcHMpLm90aGVyd2lzZVxufVxuXG5leHBvcnQgY29uc3QgbWFwU3R5bGVkUHJvcHMgPSAoXG4gIHByb3BzOiBJQ29ubmVjdFByb3BzLFxuICBmaWVsZFByb3BzOiBNZXJnZWRGaWVsZENvbXBvbmVudFByb3BzXG4pID0+IHtcbiAgY29uc3QgeyBsb2FkaW5nLCBlcnJvcnMgfSA9IGZpZWxkUHJvcHNcbiAgaWYgKGxvYWRpbmcpIHtcbiAgICBwcm9wcy5zdGF0ZSA9IHByb3BzLnN0YXRlIHx8ICdsb2FkaW5nJ1xuICB9IGVsc2UgaWYgKGVycm9ycyAmJiBlcnJvcnMubGVuZ3RoKSB7XG4gICAgcHJvcHMuc3RhdGUgPSAnZXJyb3InXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSAoLi4uYXJnczogYW55W10pID0+IHtcbiAgcmV0dXJuIChwYXlsb2FkOiBhbnksIC4uLmV4dHJhOiBhbnlbXSkgPT4ge1xuICAgIHJldHVybiBhcmdzLnJlZHVjZSgoYnVmLCBmbikgPT4ge1xuICAgICAgcmV0dXJuIGJ1ZiAhPT0gdW5kZWZpbmVkID8gZm4oYnVmLCAuLi5leHRyYSkgOiBmbihwYXlsb2FkLCAuLi5leHRyYSlcbiAgICB9LCBwYXlsb2FkKVxuICB9XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBGb3JtU3B5LCBMaWZlQ3ljbGVUeXBlcyB9IGZyb20gJ0Bmb3JtaWx5L3JlYWN0LXNjaGVtYS1yZW5kZXJlcidcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJ2FudGQnXG5pbXBvcnQgeyBJU3VibWl0UHJvcHMsIElSZXNldFByb3BzIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBTdWJtaXQgPSAoeyBzaG93TG9hZGluZywgb25TdWJtaXQsIC4uLnByb3BzIH06IElTdWJtaXRQcm9wcykgPT4ge1xuICByZXR1cm4gKFxuICAgIDxGb3JtU3B5XG4gICAgICBzZWxlY3Rvcj17W1xuICAgICAgICBMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX01PVU5ULFxuICAgICAgICBMaWZlQ3ljbGVUeXBlcy5PTl9GT1JNX1NVQk1JVF9TVEFSVCxcbiAgICAgICAgTGlmZUN5Y2xlVHlwZXMuT05fRk9STV9TVUJNSVRfRU5EXG4gICAgICBdfVxuICAgICAgcmVkdWNlcj17KHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICAgIGNhc2UgTGlmZUN5Y2xlVHlwZXMuT05fRk9STV9TVUJNSVRfU1RBUlQ6XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgICAgc3VibWl0dGluZzogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgTGlmZUN5Y2xlVHlwZXMuT05fRk9STV9TVUJNSVRfRU5EOlxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuICAgICAgICB9XG4gICAgICB9fVxuICAgID5cbiAgICAgIHsoeyBzdGF0ZSwgZm9ybSB9KSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17ZSA9PiB7XG4gICAgICAgICAgICAgIGlmIChvblN1Ym1pdCkge1xuICAgICAgICAgICAgICAgIGZvcm0uc3VibWl0KG9uU3VibWl0KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChwcm9wcy5vbkNsaWNrKSB7XG4gICAgICAgICAgICAgICAgcHJvcHMub25DbGljayhlKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgey4uLnByb3BzfVxuICAgICAgICAgICAgaHRtbFR5cGU9e29uU3VibWl0ID8gJ2J1dHRvbicgOiAnc3VibWl0J31cbiAgICAgICAgICAgIGxvYWRpbmc9e3Nob3dMb2FkaW5nID8gc3RhdGUuc3VibWl0dGluZyA6IHVuZGVmaW5lZH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cHJvcHMuY2hpbGRyZW4gfHwgJ+aPkOS6pCd9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIClcbiAgICAgIH19XG4gICAgPC9Gb3JtU3B5PlxuICApXG59XG5cblN1Ym1pdC5kZWZhdWx0UHJvcHMgPSB7XG4gIHNob3dMb2FkaW5nOiB0cnVlLFxuICB0eXBlOiAncHJpbWFyeScsXG4gIGh0bWxUeXBlOiAnc3VibWl0J1xufVxuXG5leHBvcnQgY29uc3QgUmVzZXQ6IFJlYWN0LkZDPElSZXNldFByb3BzPiA9ICh7XG4gIGNoaWxkcmVuLFxuICBmb3JjZUNsZWFyLFxuICB2YWxpZGF0ZSxcbiAgLi4ucHJvcHNcbn0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8Rm9ybVNweSBzZWxlY3Rvcj17W119PlxuICAgICAgeyh7IGZvcm0gfSkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGZvcm0ucmVzZXQoeyBmb3JjZUNsZWFyLCB2YWxpZGF0ZSB9KX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7Y2hpbGRyZW4gfHwgJ+mHjee9rid9XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIClcbiAgICAgIH19XG4gICAgPC9Gb3JtU3B5PlxuICApXG59XG4iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE4IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcygpIHtcblx0XHR2YXIgY2xhc3NlcyA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKGFyZ1R5cGUgPT09ICdzdHJpbmcnIHx8IGFyZ1R5cGUgPT09ICdudW1iZXInKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChhcmcpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcblx0XHRcdFx0aWYgKGFyZy5sZW5ndGgpIHtcblx0XHRcdFx0XHR2YXIgaW5uZXIgPSBjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZyk7XG5cdFx0XHRcdFx0aWYgKGlubmVyKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goaW5uZXIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRpZiAoYXJnLnRvU3RyaW5nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIga2V5IGluIGFyZykge1xuXHRcdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0XHRjbGFzc2VzLnB1c2goa2V5KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZy50b1N0cmluZygpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjbGFzc2VzLmpvaW4oJyAnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdGNsYXNzTmFtZXMuZGVmYXVsdCA9IGNsYXNzTmFtZXM7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuZXhwb3J0cy5nZXRDb21wU3R5bGUgPSBnZXRDb21wU3R5bGU7XG5cbmZ1bmN0aW9uIGdldFBpeGVsU2l6ZShlbGVtZW50LCBzdHlsZSwgcHJvcGVydHksIGZvbnRTaXplKSB7XG4gIHZhciBzaXplV2l0aFN1ZmZpeCA9IHN0eWxlW3Byb3BlcnR5XSxcbiAgICAgIHNpemUgPSBwYXJzZUZsb2F0KHNpemVXaXRoU3VmZml4KSxcbiAgICAgIHN1ZmZpeCA9IHNpemVXaXRoU3VmZml4LnNwbGl0KC9cXGQvKVswXSxcbiAgICAgIHJvb3RTaXplO1xuICBmb250U2l6ZSA9IGZvbnRTaXplICE9IG51bGwgPyBmb250U2l6ZSA6IC8lfGVtLy50ZXN0KHN1ZmZpeCkgJiYgZWxlbWVudCAmJiBlbGVtZW50LnBhcmVudEVsZW1lbnQgPyBnZXRQaXhlbFNpemUoZWxlbWVudC5wYXJlbnRFbGVtZW50LCBlbGVtZW50LnBhcmVudEVsZW1lbnQuY3VycmVudFN0eWxlLCBcImZvbnRTaXplXCIsIG51bGwpIDogMTY7XG4gIHJvb3RTaXplID0gcHJvcGVydHkgPT0gXCJmb250U2l6ZVwiID8gZm9udFNpemUgOiAvd2lkdGgvaS50ZXN0KHByb3BlcnR5KSA/IGVsZW1lbnQuY2xpZW50V2lkdGggOiBlbGVtZW50LmNsaWVudEhlaWdodDtcbiAgcmV0dXJuIHN1ZmZpeCA9PSBcImVtXCIgPyBzaXplICogZm9udFNpemUgOiBzdWZmaXggPT0gXCJpblwiID8gc2l6ZSAqIDk2IDogc3VmZml4ID09IFwicHRcIiA/IHNpemUgKiA5NiAvIDcyIDogc3VmZml4ID09IFwiJVwiID8gc2l6ZSAvIDEwMCAqIHJvb3RTaXplIDogc2l6ZTtcbn1cblxuZnVuY3Rpb24gc2V0U2hvcnRTdHlsZVByb3BlcnR5KHN0eWxlLCBwcm9wZXJ0eSkge1xuICB2YXIgYm9yZGVyU3VmZml4ID0gcHJvcGVydHkgPT0gXCJib3JkZXJcIiA/IFwiV2lkdGhcIiA6IFwiXCIsXG4gICAgICB0ID0gcHJvcGVydHkgKyBcIlRvcFwiICsgYm9yZGVyU3VmZml4LFxuICAgICAgciA9IHByb3BlcnR5ICsgXCJSaWdodFwiICsgYm9yZGVyU3VmZml4LFxuICAgICAgYiA9IHByb3BlcnR5ICsgXCJCb3R0b21cIiArIGJvcmRlclN1ZmZpeCxcbiAgICAgIGwgPSBwcm9wZXJ0eSArIFwiTGVmdFwiICsgYm9yZGVyU3VmZml4O1xuICBzdHlsZVtwcm9wZXJ0eV0gPSAoc3R5bGVbdF0gPT0gc3R5bGVbcl0gPT0gc3R5bGVbYl0gPT0gc3R5bGVbbF0gPyBbc3R5bGVbdF1dIDogc3R5bGVbdF0gPT0gc3R5bGVbYl0gJiYgc3R5bGVbbF0gPT0gc3R5bGVbcl0gPyBbc3R5bGVbdF0sIHN0eWxlW3JdXSA6IHN0eWxlW2xdID09IHN0eWxlW3JdID8gW3N0eWxlW3RdLCBzdHlsZVtyXSwgc3R5bGVbYl1dIDogW3N0eWxlW3RdLCBzdHlsZVtyXSwgc3R5bGVbYl0sIHN0eWxlW2xdXSkuam9pbihcIiBcIik7XG59XG5cbmZ1bmN0aW9uIENTU1N0eWxlRGVjbGFyYXRpb24oZWxlbWVudCkge1xuICB2YXIgY3VycmVudFN0eWxlID0gZWxlbWVudC5jdXJyZW50U3R5bGUsXG4gICAgICBzdHlsZSA9IHRoaXMsXG4gICAgICBmb250U2l6ZSA9IGdldFBpeGVsU2l6ZShlbGVtZW50LCBjdXJyZW50U3R5bGUsIFwiZm9udFNpemVcIiwgbnVsbCk7XG5cbiAgZm9yIChwcm9wZXJ0eSBpbiBjdXJyZW50U3R5bGUpIHtcbiAgICBpZiAoL3dpZHRofGhlaWdodHxtYXJnaW4ufHBhZGRpbmcufGJvcmRlci4rVy8udGVzdChwcm9wZXJ0eSkgJiYgc3R5bGVbcHJvcGVydHldICE9PSBcImF1dG9cIikge1xuICAgICAgc3R5bGVbcHJvcGVydHldID0gZ2V0UGl4ZWxTaXplKGVsZW1lbnQsIGN1cnJlbnRTdHlsZSwgcHJvcGVydHksIGZvbnRTaXplKSArIFwicHhcIjtcbiAgICB9IGVsc2UgaWYgKHByb3BlcnR5ID09PSBcInN0eWxlRmxvYXRcIikge1xuICAgICAgc3R5bGVbXCJmbG9hdFwiXSA9IGN1cnJlbnRTdHlsZVtwcm9wZXJ0eV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlW3Byb3BlcnR5XSA9IGN1cnJlbnRTdHlsZVtwcm9wZXJ0eV07XG4gICAgfVxuICB9XG5cbiAgc2V0U2hvcnRTdHlsZVByb3BlcnR5KHN0eWxlLCBcIm1hcmdpblwiKTtcbiAgc2V0U2hvcnRTdHlsZVByb3BlcnR5KHN0eWxlLCBcInBhZGRpbmdcIik7XG4gIHNldFNob3J0U3R5bGVQcm9wZXJ0eShzdHlsZSwgXCJib3JkZXJcIik7XG4gIHN0eWxlLmZvbnRTaXplID0gZm9udFNpemUgKyBcInB4XCI7XG4gIHJldHVybiBzdHlsZTtcbn1cblxuQ1NTU3R5bGVEZWNsYXJhdGlvbi5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBDU1NTdHlsZURlY2xhcmF0aW9uLFxuICBnZXRQcm9wZXJ0eVByaW9yaXR5OiBmdW5jdGlvbiBnZXRQcm9wZXJ0eVByaW9yaXR5KCkge30sXG4gIGdldFByb3BlcnR5VmFsdWU6IGZ1bmN0aW9uIGdldFByb3BlcnR5VmFsdWUocHJvcCkge1xuICAgIHJldHVybiB0aGlzW3Byb3BdIHx8IFwiXCI7XG4gIH0sXG4gIGl0ZW06IGZ1bmN0aW9uIGl0ZW0oKSB7fSxcbiAgcmVtb3ZlUHJvcGVydHk6IGZ1bmN0aW9uIHJlbW92ZVByb3BlcnR5KCkge30sXG4gIHNldFByb3BlcnR5OiBmdW5jdGlvbiBzZXRQcm9wZXJ0eSgpIHt9LFxuICBnZXRQcm9wZXJ0eUNTU1ZhbHVlOiBmdW5jdGlvbiBnZXRQcm9wZXJ0eUNTU1ZhbHVlKCkge31cbn07XG5cbmZ1bmN0aW9uIGdldENvbXBTdHlsZShlbGVtZW50KSB7XG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICByZXR1cm4gbmV3IENTU1N0eWxlRGVjbGFyYXRpb24oZWxlbWVudCk7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIGRlZmluZWQgYnkgdzNjXG52YXIgRE9DVU1FTlRfTk9ERSA9IDk7XG4vKipcbiAqIFJldHVybnMgYHRydWVgIGlmIGB3YCBpcyBhIERvY3VtZW50IG9iamVjdCwgb3IgYGZhbHNlYCBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHs/fSBkIC0gRG9jdW1lbnQgb2JqZWN0LCBtYXliZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNEb2N1bWVudChkKSB7XG4gIHJldHVybiBkICYmIGQubm9kZVR5cGUgPT09IERPQ1VNRU5UX05PREU7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIGBkb2N1bWVudGAgb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gYG5vZGVgLCB3aGljaCBtYXkgYmVcbiAqIGEgRE9NIGVsZW1lbnQsIHRoZSBXaW5kb3cgb2JqZWN0LCBhIFNlbGVjdGlvbiwgYSBSYW5nZS4gQmFzaWNhbGx5IGFueSBET01cbiAqIG9iamVjdCB0aGF0IHJlZmVyZW5jZXMgdGhlIERvY3VtZW50IGluIHNvbWUgd2F5LCB0aGlzIGZ1bmN0aW9uIHdpbGwgZmluZCBpdC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSBub2RlIC0gRE9NIG5vZGUsIHNlbGVjdGlvbiwgb3IgcmFuZ2UgaW4gd2hpY2ggdG8gZmluZCB0aGUgYGRvY3VtZW50YCBvYmplY3RcbiAqIEByZXR1cm4ge0RvY3VtZW50fSB0aGUgYGRvY3VtZW50YCBvYmplY3QgYXNzb2NpYXRlZCB3aXRoIGBub2RlYFxuICogQHB1YmxpY1xuICovXG5cblxuZnVuY3Rpb24gZ2V0RG9jdW1lbnQobm9kZSkge1xuICBpZiAoaXNEb2N1bWVudChub2RlKSkge1xuICAgIHJldHVybiBub2RlO1xuICB9IGVsc2UgaWYgKGlzRG9jdW1lbnQobm9kZS5vd25lckRvY3VtZW50KSkge1xuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQ7XG4gIH0gZWxzZSBpZiAoaXNEb2N1bWVudChub2RlLmRvY3VtZW50KSkge1xuICAgIHJldHVybiBub2RlLmRvY3VtZW50O1xuICB9IGVsc2UgaWYgKG5vZGUucGFyZW50Tm9kZSkge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLnBhcmVudE5vZGUpOyAvLyBSYW5nZSBzdXBwb3J0XG4gIH0gZWxzZSBpZiAobm9kZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcikge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKTtcbiAgfSBlbHNlIGlmIChub2RlLnN0YXJ0Q29udGFpbmVyKSB7XG4gICAgcmV0dXJuIGdldERvY3VtZW50KG5vZGUuc3RhcnRDb250YWluZXIpOyAvLyBTZWxlY3Rpb24gc3VwcG9ydFxuICB9IGVsc2UgaWYgKG5vZGUuYW5jaG9yTm9kZSkge1xuICAgIHJldHVybiBnZXREb2N1bWVudChub2RlLmFuY2hvck5vZGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHdpdGhpbkVsZW1lbnQoY2hpbGQsIHBhcmVudCkge1xuICAvLyBkb24ndCB0aHJvdyBpZiBgY2hpbGRgIGlzIG51bGxcbiAgaWYgKCFjaGlsZCkgcmV0dXJuIGZhbHNlOyAvLyBSYW5nZSBzdXBwb3J0XG5cbiAgaWYgKGNoaWxkLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKSBjaGlsZCA9IGNoaWxkLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO2Vsc2UgaWYgKGNoaWxkLmVuZENvbnRhaW5lcikgY2hpbGQgPSBjaGlsZC5lbmRDb250YWluZXI7IC8vIGFzayB0aGUgYnJvd3NlciBpZiBwYXJlbnQgY29udGFpbnMgY2hpbGRcblxuICBpZiAoY2hpbGQgPT09IHdpbmRvdykgcmV0dXJuIHRydWU7XG4gIHJldHVybiBwYXJlbnQuY29udGFpbnMoY2hpbGQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9mZnNldChlbCkge1xuICB2YXIgZG9jID0gZ2V0RG9jdW1lbnQoZWwpO1xuICBpZiAoIWRvYykgcmV0dXJuOyAvLyBNYWtlIHN1cmUgaXQncyBub3QgYSBkaXNjb25uZWN0ZWQgRE9NIG5vZGVcblxuICBpZiAoIXdpdGhpbkVsZW1lbnQoZWwsIGRvYykpIHJldHVybjtcbiAgdmFyIGJvZHkgPSBkb2MuYm9keTtcblxuICBpZiAoYm9keSA9PT0gZWwpIHtcbiAgICByZXR1cm4gYm9keU9mZnNldChlbCk7XG4gIH1cblxuICB2YXIgYm94ID0ge1xuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGdCQ1IsIGp1c3QgdXNlIDAsMCByYXRoZXIgdGhhbiBlcnJvclxuICAgIC8vIEJsYWNrQmVycnkgNSwgaU9TIDMgKG9yaWdpbmFsIGlQaG9uZSlcbiAgICBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGlmIChlbC5jb2xsYXBzZWQgJiYgYm94LmxlZnQgPT09IDAgJiYgYm94LnRvcCA9PT0gMCkge1xuICAgICAgLy8gY29sbGFwc2VkIFJhbmdlIGluc3RhbmNlcyBzb21ldGltZXMgcmVwb3J0IDAsIDBcbiAgICAgIC8vIHNlZTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjg0NzMyOC8zNzY3NzNcbiAgICAgIHZhciBzcGFuID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpOyAvLyBFbnN1cmUgc3BhbiBoYXMgZGltZW5zaW9ucyBhbmQgcG9zaXRpb24gYnlcbiAgICAgIC8vIGFkZGluZyBhIHplcm8td2lkdGggc3BhY2UgY2hhcmFjdGVyXG5cbiAgICAgIHNwYW4uYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKFwiXFx1MjAwQlwiKSk7XG4gICAgICBlbC5pbnNlcnROb2RlKHNwYW4pO1xuICAgICAgYm94ID0gc3Bhbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgLy8gUmVtb3ZlIHRlbXAgU1BBTiBhbmQgZ2x1ZSBhbnkgYnJva2VuIHRleHQgbm9kZXMgYmFjayB0b2dldGhlclxuXG4gICAgICB2YXIgc3BhblBhcmVudCA9IHNwYW4ucGFyZW50Tm9kZTtcbiAgICAgIHNwYW5QYXJlbnQucmVtb3ZlQ2hpbGQoc3Bhbik7XG4gICAgICBzcGFuUGFyZW50Lm5vcm1hbGl6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBkb2NFbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gIHZhciBjbGllbnRUb3AgPSBkb2NFbC5jbGllbnRUb3AgfHwgYm9keS5jbGllbnRUb3AgfHwgMDtcbiAgdmFyIGNsaWVudExlZnQgPSBkb2NFbC5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwO1xuICB2YXIgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY0VsLnNjcm9sbFRvcDtcbiAgdmFyIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jRWwuc2Nyb2xsTGVmdDtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IGJveC50b3AgKyBzY3JvbGxUb3AgLSBjbGllbnRUb3AsXG4gICAgbGVmdDogYm94LmxlZnQgKyBzY3JvbGxMZWZ0IC0gY2xpZW50TGVmdFxuICB9O1xufTtcblxuZnVuY3Rpb24gYm9keU9mZnNldChib2R5KSB7XG4gIHZhciB0b3AgPSBib2R5Lm9mZnNldFRvcDtcbiAgdmFyIGxlZnQgPSBib2R5Lm9mZnNldExlZnQ7XG4gIHRvcCArPSBwYXJzZUZsb2F0KGJvZHkuc3R5bGUubWFyZ2luVG9wIHx8IDApO1xuICBsZWZ0ICs9IHBhcnNlRmxvYXQoYm9keS5zdHlsZS5tYXJnaW5MZWZ0IHx8IDApO1xuICByZXR1cm4ge1xuICAgIHRvcDogdG9wLFxuICAgIGxlZnQ6IGxlZnRcbiAgfTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gV2luZG93IFNjcm9sbCBQb3NpdGlvblxuLy9cbi8vIENyb3NzLWJyb3dzZXIgaW1wbGVtZW50YXRpb24gb2Ygd2luZG93LnNjcm9sbFggYW5kIHdpbmRvdy5zY3JvbGxZLlxuLy9cbi8vIEltcGxlbWVudGF0aW9uIGZyb20galF1ZXJ5XG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi84MzVlOGM0YWUzOWYwOWQxMWFkNDJkMjRlMDIxMGJlYmZhOGU4MzIwL3NyYy9vZmZzZXQuanMjTDE3Ni1MMTc4XG4vL1xuXG5bXG4gIFtcImdldFNjcm9sbFlcIiwgXCJzY3JvbGxUb3BcIiwgXCJwYWdlWU9mZnNldFwiXSxcbiAgW1wiZ2V0U2Nyb2xsWFwiLCBcInNjcm9sbExlZnRcIiwgXCJwYWdlWE9mZnNldFwiXSxcbl0uZm9yRWFjaChmdW5jdGlvbihwcm9wcykge1xuICB2YXIgZm5OYW1lID0gcHJvcHNbMF07XG4gIHZhciBlbFByb3AgPSBwcm9wc1sxXTtcbiAgdmFyIHdpblByb3AgPSBwcm9wc1syXTtcblxuICBtb2R1bGUuZXhwb3J0c1tmbk5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHdpblByb3AgaW4gd2luZG93KSB7XG4gICAgICByZXR1cm4gd2luZG93W3dpblByb3BdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB3aW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50W2VsUHJvcF07XG4gICAgfVxuICB9O1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcblxudmFyIF9yZWFjdCA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKHJlcXVpcmUoXCJyZWFjdFwiKSk7XG5cbnZhciBfY2xhc3NuYW1lcyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcImNsYXNzbmFtZXNcIikpO1xuXG52YXIgX3V0aWxzID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5cbnZhciBfb2Zmc2V0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9vZmZzZXRcIikpO1xuXG52YXIgX3dpbmRvd1Njcm9sbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIndpbmRvdy1zY3JvbGxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7IHZhciBkZXNjID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSA6IHt9OyBpZiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTsgfSBlbHNlIHsgbmV3T2JqW2tleV0gPSBvYmpba2V5XTsgfSB9IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9leHRlbmRzKCkgeyBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07IHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuZnVuY3Rpb24gaXNWYWxpZChkKSB7XG4gIHJldHVybiBkICE9PSB1bmRlZmluZWQgJiYgZCAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0TnVtKHZhbCkge1xuICByZXR1cm4gdmFsICE9PSB1bmRlZmluZWQgPyBwYXJzZUludCh2YWwpIDogMDtcbn1cblxuZnVuY3Rpb24gZ2V0VmFsaWRWYWwoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGlzVmFsaWQoaSA8IDAgfHwgYXJndW1lbnRzLmxlbmd0aCA8PSBpID8gdW5kZWZpbmVkIDogYXJndW1lbnRzW2ldKSkge1xuICAgICAgcmV0dXJuIGkgPCAwIHx8IGFyZ3VtZW50cy5sZW5ndGggPD0gaSA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNGbih2YWwpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbic7XG59XG5cbnZhciBTdGlja3kgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgX2luaGVyaXRzTG9vc2UoU3RpY2t5LCBfQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBTdGlja3koKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIF90aGlzID0gX0NvbXBvbmVudC5jYWxsLmFwcGx5KF9Db21wb25lbnQsIFt0aGlzXS5jb25jYXQoYXJncykpIHx8IHRoaXM7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSksIFwic3RhdGVcIiwge1xuICAgICAgaXNTdGlja3k6IGZhbHNlLFxuICAgICAgd2luZG93OiB7XG4gICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGhcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpKSwgXCJTdGlja3lSZWZcIiwgX3JlYWN0LmRlZmF1bHQuY3JlYXRlUmVmKCkpO1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFN0aWNreS5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmdldENvbnRhaW5lck5vZGUgPSBmdW5jdGlvbiBnZXRDb250YWluZXJOb2RlKCkge1xuICAgIHZhciBzdGlja3lDb250YWluZXIgPSB0aGlzLlN0aWNreVJlZjtcbiAgICB0aGlzLmNvbnRhaW5lciA9IHN0aWNreUNvbnRhaW5lciAmJiBzdGlja3lDb250YWluZXIuY3VycmVudDtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XG4gIH07XG5cbiAgX3Byb3RvLmNvbXBvbmVudERpZE1vdW50ID0gZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB0aGlzLmdldENvbnRhaW5lck5vZGUoKTtcbiAgICB0aGlzLmluaXRDbG9uZUNvbnRhaW5lck5vZGUoKTtcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpczIuaW5pdFN0aWNreSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5pbml0U3RpY2t5ID0gZnVuY3Rpb24gaW5pdFN0aWNreSgpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHRoaXMuaWZTdGlja3koZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMzLnN0aWNreSgpO1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzMy5zdGlja3koZmFsc2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5jb21wb25lbnRXaWxsVW5tb3VudCA9IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgdGhpcy5zdGlja3koZmFsc2UpO1xuICAgIHRoaXMuY2FuY2VsRXZlbnRzKCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpczQud3JhcHBlck5vZGUucmVtb3ZlKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLm9uU2Nyb2xsSGFuZGxlciA9IGZ1bmN0aW9uIG9uU2Nyb2xsSGFuZGxlcihjb250ZXh0KSB7XG4gICAgdmFyIGNyZWF0ZVN0YXRlID0gY29udGV4dC5wcm9wcy5jcmVhdGVTdGF0ZTtcblxuICAgIHZhciBoYW5kbGVyID0gY29udGV4dC5iaW5kSGFuZGxlciB8fCBmdW5jdGlvbiAoZSkge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGNyZWF0ZVN0YXRlKSB7XG4gICAgICAgICAgdmFyIHN0YXRlID0gY3JlYXRlU3RhdGUoKTtcblxuICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgY29udGV4dC5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5pZlN0aWNreShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29udGV4dC5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpc1N0aWNreTogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvdzoge1xuICAgICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGV4dC5zdGlja3kodHJ1ZSwgZS50eXBlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnRleHQuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaXNTdGlja3k6IGZhbHNlLFxuICAgICAgICAgICAgd2luZG93OiB7XG4gICAgICAgICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250ZXh0LnN0aWNreShmYWxzZSwgZS50eXBlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29udGV4dC5iaW5kSGFuZGxlciA9IGhhbmRsZXI7XG4gICAgcmV0dXJuIGhhbmRsZXI7XG4gIH07XG5cbiAgX3Byb3RvLnNldFN0eWxlID0gZnVuY3Rpb24gc2V0U3R5bGUobm9kZSwgc3R5bGVzKSB7XG4gICAgdmFyIHN0eWxlID0gbm9kZS5zdHlsZTtcbiAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHN0eWxlW25hbWVdID0gc3R5bGVzW25hbWVdO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5zdGlja3kgPSBmdW5jdGlvbiBzdGlja3koaXNTdGlja3ksIHR5cGUpIHtcbiAgICBpZiAoaXNTdGlja3kgPT09IHZvaWQgMCkge1xuICAgICAgaXNTdGlja3kgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciBwb3NpdGlvbk5vZGUgPSB0aGlzLmdldFBvc2l0aW9uTm9kZSgpO1xuICAgIHZhciBub2RlRGF0YSA9IHRoaXMuZ2V0Tm9kZURhdGEocG9zaXRpb25Ob2RlKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5lZGdlID09ICd0b3AnKSB7XG4gICAgICBpZiAoaXNTdGlja3kpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDb250YWluZXJTaXplKCk7XG4gICAgICAgIHRoaXMuc2V0U3R5bGUodGhpcy5jb250YWluZXIsIF9leHRlbmRzKHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICB3aWR0aDogbm9kZURhdGEud2lkdGggKyAncHgnLFxuICAgICAgICAgIGhlaWdodDogbm9kZURhdGEuaGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICB0b3A6IHRoaXMucHJvcHMudHJpZ2dlckRpc3RhbmNlICsgJ3B4JyxcbiAgICAgICAgICBsZWZ0OiBub2RlRGF0YS5vZmZzZXRMZWZ0ICsgJ3B4JyxcbiAgICAgICAgICB6SW5kZXg6IHNlbGYucHJvcHMuekluZGV4IHx8ICcxMCdcbiAgICAgICAgfSwgdGhpcy5wcm9wcy5zdGlja2llZFN0eWxlKSk7XG4gICAgICAgIHRoaXMuc3RpY2tpbmcgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdyZXNpemUnKSB0aGlzLndyYXBwZXJOb2RlLnN0eWxlLm1pbkhlaWdodCA9ICdhdXRvJztcbiAgICAgICAgc2VsZi5zZXRTdHlsZShzZWxmLmNvbnRhaW5lciwgX2V4dGVuZHMoe1xuICAgICAgICAgIGxlZnQ6ICcnLFxuICAgICAgICAgIHpJbmRleDogJycsXG4gICAgICAgICAgd2lkdGg6ICcnLFxuICAgICAgICAgIGhlaWdodDogJycsXG4gICAgICAgICAgcG9zaXRpb246ICcnLFxuICAgICAgICAgIHRvcDogJydcbiAgICAgICAgfSwgc2VsZi5wcm9wcy51bnN0aWNraWVkU3R5bGUpKTtcbiAgICAgICAgdGhpcy5zdGlja2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNTdGlja3kpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDb250YWluZXJTaXplKCk7XG4gICAgICAgIHRoaXMuc2V0U3R5bGUodGhpcy5jb250YWluZXIsIF9leHRlbmRzKHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICB3aWR0aDogbm9kZURhdGEud2lkdGggKyAncHgnLFxuICAgICAgICAgIGhlaWdodDogbm9kZURhdGEuaGVpZ2h0ICsgJ3B4JyxcbiAgICAgICAgICBib3R0b206IHNlbGYucHJvcHMudHJpZ2dlckRpc3RhbmNlICsgJ3B4JyxcbiAgICAgICAgICBsZWZ0OiBub2RlRGF0YS5vZmZzZXRMZWZ0ICsgJ3B4JyxcbiAgICAgICAgICB6SW5kZXg6IHNlbGYucHJvcHMuekluZGV4IHx8ICcxMCdcbiAgICAgICAgfSwgdGhpcy5wcm9wcy5zdGlja2llZFN0eWxlKSk7XG4gICAgICAgIHRoaXMuc3RpY2tpbmcgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdyZXNpemUnKSB0aGlzLndyYXBwZXJOb2RlLnN0eWxlLm1pbkhlaWdodCA9ICdhdXRvJztcbiAgICAgICAgdGhpcy5zZXRTdHlsZSh0aGlzLmNvbnRhaW5lciwge1xuICAgICAgICAgIGJvdHRvbTogc2VsZi5wcm9wcy50cmlnZ2VyRGlzdGFuY2UgKyAncHgnXG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgY29udGFpbmVyTm9kZSA9IHRoaXMuY29udGFpbmVyO1xuICAgICAgICBzZWxmLnNldFN0eWxlKHNlbGYuY29udGFpbmVyLCBfZXh0ZW5kcyh7XG4gICAgICAgICAgbGVmdDogJycsXG4gICAgICAgICAgekluZGV4OiAnJyxcbiAgICAgICAgICB3aWR0aDogJycsXG4gICAgICAgICAgaGVpZ2h0OiAnJyxcbiAgICAgICAgICBwb3NpdGlvbjogJycsXG4gICAgICAgICAgYm90dG9tOiAnJ1xuICAgICAgICB9LCBzZWxmLnByb3BzLnVuc3RpY2tpZWRTdHlsZSkpO1xuICAgICAgICB0aGlzLnN0aWNraW5nID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5nZXRQb3NpdGlvbk5vZGUgPSBmdW5jdGlvbiBnZXRQb3NpdGlvbk5vZGUoKSB7XG4gICAgdmFyIG5vZGUgPSBudWxsO1xuICAgIGlmICh0aGlzLnN0aWNraW5nKSBub2RlID0gdGhpcy53cmFwcGVyTm9kZTtlbHNlIG5vZGUgPSB0aGlzLmNvbnRhaW5lcjtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcblxuICBfcHJvdG8uaWZTdGlja3kgPSBmdW5jdGlvbiBpZlN0aWNreShvaywgZmFpbGQpIHtcbiAgICB2YXIgcG9zaXRpb25Ob2RlID0gdGhpcy5nZXRQb3NpdGlvbk5vZGUoKTtcbiAgICB2YXIgbm9kZURhdGEgPSB0aGlzLmdldE5vZGVEYXRhKHBvc2l0aW9uTm9kZSk7XG4gICAgdmFyIHdpbkRhdGEgPSB0aGlzLmdldE5vZGVEYXRhKHdpbmRvdyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBlZGdlID0gc2VsZi5wcm9wcy5lZGdlO1xuICAgIHZhciBnZXRTdGlja3lCb3VuZGFyeSA9IHNlbGYucHJvcHMuZ2V0U3RpY2t5Qm91bmRhcnk7XG4gICAgdmFyIHRyaWdnZXJEaXN0YW5jZSA9IHNlbGYucHJvcHMudHJpZ2dlckRpc3RhbmNlO1xuICAgIHZhciBpc05vdFN0aWNreSA9IHRoaXMuc3RhdGUubm90U3RpY2t5O1xuXG4gICAgaWYgKGlzRm4oZ2V0U3RpY2t5Qm91bmRhcnkpKSB7XG4gICAgICBpZiAoIWdldFN0aWNreUJvdW5kYXJ5KCkpIHJldHVybiBmYWlsZC5jYWxsKHNlbGYpO1xuICAgIH1cblxuICAgIGlmIChpc05vdFN0aWNreSkge1xuICAgICAgcmV0dXJuIGZhaWxkLmNhbGwoc2VsZik7XG4gICAgfVxuXG4gICAgaWYgKGVkZ2UgIT0gJ3RvcCcpIHtcbiAgICAgIGlmICh3aW5EYXRhLnNjcm9sbFRvcCArIHdpbkRhdGEuaGVpZ2h0IDwgbm9kZURhdGEub2Zmc2V0VG9wICsgbm9kZURhdGEuaGVpZ2h0ICsgdHJpZ2dlckRpc3RhbmNlKSB7XG4gICAgICAgIHJldHVybiBvay5jYWxsKHNlbGYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAod2luRGF0YS5zY3JvbGxUb3AgPiBub2RlRGF0YS5vZmZzZXRUb3AgLSB0cmlnZ2VyRGlzdGFuY2UgJiYgbm9kZURhdGEub2Zmc2V0VG9wID4gMCkge1xuICAgICAgICByZXR1cm4gb2suY2FsbChzZWxmKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmYWlsZC5jYWxsKHNlbGYpO1xuICB9O1xuXG4gIF9wcm90by5nZXROb2RlRGF0YSA9IGZ1bmN0aW9uIGdldE5vZGVEYXRhKG5vZGUpIHtcbiAgICB2YXIgY2xpZW50SGVpZ2h0ID0gbm9kZS5jbGllbnRIZWlnaHQsXG4gICAgICAgIGNsaWVudFdpZHRoID0gbm9kZS5jbGllbnRXaWR0aCxcbiAgICAgICAgaW5uZXJIZWlnaHQgPSBub2RlLmlubmVySGVpZ2h0LFxuICAgICAgICBpbm5lcldpZHRoID0gbm9kZS5pbm5lcldpZHRoO1xuXG4gICAgaWYgKG5vZGUgIT09IHdpbmRvdykge1xuICAgICAgdmFyIG9mZnNldCA9ICgwLCBfb2Zmc2V0LmRlZmF1bHQpKG5vZGUpO1xuICAgICAgdmFyIG9mZnNldExlZnQgPSBvZmZzZXQgPyBvZmZzZXQubGVmdCA6IDA7XG4gICAgICB2YXIgb2Zmc2V0VG9wID0gb2Zmc2V0ID8gb2Zmc2V0LnRvcCA6IDA7XG4gICAgICB2YXIgcmVjdCA9IG5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB2YXIgc3R5bGUgPSAoMCwgX3V0aWxzLmdldENvbXBTdHlsZSkobm9kZSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvZmZzZXRMZWZ0OiBvZmZzZXRMZWZ0IC0gZ2V0TnVtKHN0eWxlWydtYXJnaW4tbGVmdCddKSxcbiAgICAgICAgb2Zmc2V0VG9wOiBvZmZzZXRUb3AgLSBnZXROdW0oc3R5bGVbJ21hcmdpbi10b3AnXSksXG4gICAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgICBzY3JvbGxUb3A6IHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgICAgc2Nyb2xsTGVmdDogd2luZG93LnBhZ2VYT2Zmc2V0XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5vZGVEYXRhO1xuICB9O1xuXG4gIF9wcm90by5nZXRPbGROb2RlSGVpZ2h0ID0gZnVuY3Rpb24gZ2V0T2xkTm9kZUhlaWdodCgpIHtcbiAgICB2YXIgbm9kZURhdGEgPSB0aGlzLmdldE5vZGVEYXRhKHRoaXMub2xkTm9kZSk7XG4gICAgcmV0dXJuIG5vZGVEYXRhLmhlaWdodDtcbiAgfTtcblxuICBfcHJvdG8uaW5pdENsb25lQ29udGFpbmVyTm9kZSA9IGZ1bmN0aW9uIGluaXRDbG9uZUNvbnRhaW5lck5vZGUoKSB7XG4gICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMucHJvcHMuY2xhc3NOYW1lO1xuICAgIGlmICh0aGlzLndyYXBwZXJOb2RlKSByZXR1cm4gdGhpcy53cmFwcGVyTm9kZTtcbiAgICB0aGlzLm9sZE5vZGUgPSB0aGlzLmdldENvbnRhaW5lck5vZGUoKTtcbiAgICB0aGlzLm9sZE5vZGVIZWlnaHQgPSB0aGlzLmdldE9sZE5vZGVIZWlnaHQoKTtcbiAgICB0aGlzLndyYXBwZXJOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy53cmFwcGVyTm9kZS5zdHlsZS5taW5IZWlnaHQgPSB0aGlzLm9sZE5vZGVIZWlnaHQgKyAncHgnO1xuICAgIHRoaXMud3JhcHBlck5vZGUuY2xhc3NMaXN0LmFkZCgnc3RpY2t5LXdyYXBwZXInKTtcbiAgICBpZiAoY2xhc3NOYW1lKSB0aGlzLndyYXBwZXJOb2RlLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB0aGlzLm9sZE5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcy53cmFwcGVyTm9kZSwgdGhpcy5vbGROb2RlKTtcbiAgICB0aGlzLndyYXBwZXJOb2RlLmFwcGVuZENoaWxkKHRoaXMub2xkTm9kZSk7XG4gIH07XG5cbiAgX3Byb3RvLnVwZGF0ZUNvbnRhaW5lclNpemUgPSBmdW5jdGlvbiB1cGRhdGVDb250YWluZXJTaXplKCkge1xuICAgIGlmICh0aGlzLndyYXBwZXJOb2RlKSB7XG4gICAgICB2YXIgbmV3SGVpZ2h0ID0gdGhpcy5nZXRPbGROb2RlSGVpZ2h0KCk7XG5cbiAgICAgIGlmICh0aGlzLm9sZE5vZGVIZWlnaHQgIT09IG5ld0hlaWdodCkge1xuICAgICAgICB0aGlzLndyYXBwZXJOb2RlLnN0eWxlLm1pbkhlaWdodCA9IG5ld0hlaWdodCArICdweCc7XG4gICAgICAgIHRoaXMub2xkTm9kZUhlaWdodCA9IG5ld0hlaWdodDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmNhbmNlbEV2ZW50cyA9IGZ1bmN0aW9uIGNhbmNlbEV2ZW50cygpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5vblNjcm9sbEhhbmRsZXIodGhpcykpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uU2Nyb2xsSGFuZGxlcih0aGlzKSk7XG4gIH07XG5cbiAgX3Byb3RvLnJlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24gcmVnaXN0ZXJFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMub25TY3JvbGxIYW5kbGVyKHRoaXMpKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vblNjcm9sbEhhbmRsZXIodGhpcykpO1xuICB9O1xuXG4gIF9wcm90by5yZW5kZXJDb250YWluZXIgPSBmdW5jdGlvbiByZW5kZXJDb250YWluZXIoKSB7XG4gICAgdmFyIF90aGlzJHByb3BzID0gdGhpcy5wcm9wcyxcbiAgICAgICAgY2hpbGRyZW4gPSBfdGhpcyRwcm9wcy5jaGlsZHJlbixcbiAgICAgICAgY2xhc3NOYW1lID0gX3RoaXMkcHJvcHMuY2xhc3NOYW1lO1xuICAgIHJldHVybiBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcbiAgICAgIHJlZjogdGhpcy5TdGlja3lSZWYsXG4gICAgICBjbGFzc05hbWU6IFwic3RpY2t5LWNvbnRhaW5lclwiLFxuICAgICAgc3R5bGU6IHRoaXMucHJvcHMuc3R5bGVcbiAgICB9LCB0eXBlb2YgY2hpbGRyZW4gPT09ICdmdW5jdGlvbicgPyBjaGlsZHJlbih0aGlzLnN0YXRlKSA6IGNoaWxkcmVuKTtcbiAgfTtcblxuICBfcHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlckNvbnRhaW5lcigpO1xuICB9O1xuXG4gIHJldHVybiBTdGlja3k7XG59KF9yZWFjdC5Db21wb25lbnQpO1xuXG5fZGVmaW5lUHJvcGVydHkoU3RpY2t5LCBcImRlZmF1bHRQcm9wc1wiLCB7XG4gIGVkZ2U6ICdib3R0b20nLFxuICB0cmlnZ2VyRGlzdGFuY2U6IDBcbn0pO1xuXG52YXIgX2RlZmF1bHQgPSBTdGlja3k7XG5leHBvcnRzLmRlZmF1bHQgPSBfZGVmYXVsdDsiLCIhZnVuY3Rpb24oZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9ZShudWxsKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGUobnVsbCkpOndpbmRvdy5zdHlsaXM9ZShudWxsKX0oZnVuY3Rpb24gZShhKXtcInVzZSBzdHJpY3RcIjt2YXIgcj0vXlxcMCsvZyxjPS9bXFwwXFxyXFxmXS9nLHM9LzogKi9nLHQ9L3pvb3xncmEvLGk9LyhbLDogXSkodHJhbnNmb3JtKS9nLGY9LywrXFxzKig/IVteKF0qWyldKS9nLG49LyArXFxzKig/IVteKF0qWyldKS9nLGw9LyAqW1xcMF0gKi9nLG89LyxcXHIrPy9nLGg9LyhbXFx0XFxyXFxuIF0pKlxcZj8mL2csdT0vOmdsb2JhbFxcKCgoPzpbXlxcKFxcKVxcW1xcXV0qfFxcWy4qXFxdfFxcKFteXFwoXFwpXSpcXCkpKilcXCkvZyxkPS9cXFcrL2csYj0vQChrXFx3KylcXHMqKFxcUyopXFxzKi8scD0vOjoocGxhY2UpL2csaz0vOihyZWFkLW9ubHkpL2csZz0vXFxzKyg/PVt7XFxdOz06Pl0pL2csQT0vKFtbfT06Pl0pXFxzKy9nLEM9LyhcXHtbXntdKz8pOyg/PVxcfSkvZyx3PS9cXHN7Mix9L2csdj0vKFteXFwoXSkoOispICovZyxtPS9bc3ZoXVxcdystW3RibHJdezJ9Lyx4PS9cXChcXHMqKC4qKVxccypcXCkvZywkPS8oW1xcc1xcU10qPyk7L2cseT0vLXNlbGZ8ZmxleC0vZyxPPS9bXl0qPyg6W3JwXVtlbF1hW1xcdy1dKylbXl0qLyxqPS9zdHJldGNofDpcXHMqXFx3K1xcLSg/OmNvbnRlfGF2YWlsKS8sej0vKFteLV0pKGltYWdlLXNldFxcKCkvLE49XCItd2Via2l0LVwiLFM9XCItbW96LVwiLEY9XCItbXMtXCIsVz01OSxxPTEyNSxCPTEyMyxEPTQwLEU9NDEsRz05MSxIPTkzLEk9MTAsSj0xMyxLPTksTD02NCxNPTMyLFA9MzgsUT00NSxSPTk1LFQ9NDIsVT00NCxWPTU4LFg9MzksWT0zNCxaPTQ3LF89NjIsZWU9NDMsYWU9MTI2LHJlPTAsY2U9MTIsc2U9MTEsdGU9MTA3LGllPTEwOSxmZT0xMTUsbmU9MTEyLGxlPTExMSxvZT0xMDUsaGU9OTksdWU9MTAwLGRlPTExMixiZT0xLHBlPTEsa2U9MCxnZT0xLEFlPTEsQ2U9MSx3ZT0wLHZlPTAsbWU9MCx4ZT1bXSwkZT1bXSx5ZT0wLE9lPW51bGwsamU9LTIsemU9LTEsTmU9MCxTZT0xLEZlPTIsV2U9MyxxZT0wLEJlPTEsRGU9XCJcIixFZT1cIlwiLEdlPVwiXCI7ZnVuY3Rpb24gSGUoZSxhLHMsdCxpKXtmb3IodmFyIGYsbixvPTAsaD0wLHU9MCxkPTAsZz0wLEE9MCxDPTAsdz0wLG09MCwkPTAseT0wLE89MCxqPTAsej0wLFI9MCx3ZT0wLCRlPTAsT2U9MCxqZT0wLHplPXMubGVuZ3RoLEplPXplLTEsUmU9XCJcIixUZT1cIlwiLFVlPVwiXCIsVmU9XCJcIixYZT1cIlwiLFllPVwiXCI7Ujx6ZTspe2lmKEM9cy5jaGFyQ29kZUF0KFIpLFI9PT1KZSlpZihoK2QrdStvIT09MCl7aWYoMCE9PWgpQz1oPT09Wj9JOlo7ZD11PW89MCx6ZSsrLEplKyt9aWYoaCtkK3Urbz09PTApe2lmKFI9PT1KZSl7aWYod2U+MClUZT1UZS5yZXBsYWNlKGMsXCJcIik7aWYoVGUudHJpbSgpLmxlbmd0aD4wKXtzd2l0Y2goQyl7Y2FzZSBNOmNhc2UgSzpjYXNlIFc6Y2FzZSBKOmNhc2UgSTpicmVhaztkZWZhdWx0OlRlKz1zLmNoYXJBdChSKX1DPVd9fWlmKDE9PT0kZSlzd2l0Y2goQyl7Y2FzZSBCOmNhc2UgcTpjYXNlIFc6Y2FzZSBZOmNhc2UgWDpjYXNlIEQ6Y2FzZSBFOmNhc2UgVTokZT0wO2Nhc2UgSzpjYXNlIEo6Y2FzZSBJOmNhc2UgTTpicmVhaztkZWZhdWx0OmZvcigkZT0wLGplPVIsZz1DLFItLSxDPVc7amU8emU7KXN3aXRjaChzLmNoYXJDb2RlQXQoamUrKykpe2Nhc2UgSTpjYXNlIEo6Y2FzZSBXOisrUixDPWcsamU9emU7YnJlYWs7Y2FzZSBWOmlmKHdlPjApKytSLEM9ZztjYXNlIEI6amU9emV9fXN3aXRjaChDKXtjYXNlIEI6Zm9yKGc9KFRlPVRlLnRyaW0oKSkuY2hhckNvZGVBdCgwKSx5PTEsamU9KytSO1I8emU7KXtzd2l0Y2goQz1zLmNoYXJDb2RlQXQoUikpe2Nhc2UgQjp5Kys7YnJlYWs7Y2FzZSBxOnktLTticmVhaztjYXNlIFo6c3dpdGNoKEE9cy5jaGFyQ29kZUF0KFIrMSkpe2Nhc2UgVDpjYXNlIFo6Uj1RZShBLFIsSmUscyl9YnJlYWs7Y2FzZSBHOkMrKztjYXNlIEQ6QysrO2Nhc2UgWTpjYXNlIFg6Zm9yKDtSKys8SmUmJnMuY2hhckNvZGVBdChSKSE9PUM7KTt9aWYoMD09PXkpYnJlYWs7UisrfWlmKFVlPXMuc3Vic3RyaW5nKGplLFIpLGc9PT1yZSlnPShUZT1UZS5yZXBsYWNlKHIsXCJcIikudHJpbSgpKS5jaGFyQ29kZUF0KDApO3N3aXRjaChnKXtjYXNlIEw6aWYod2U+MClUZT1UZS5yZXBsYWNlKGMsXCJcIik7c3dpdGNoKEE9VGUuY2hhckNvZGVBdCgxKSl7Y2FzZSB1ZTpjYXNlIGllOmNhc2UgZmU6Y2FzZSBROmY9YTticmVhaztkZWZhdWx0OmY9eGV9aWYoamU9KFVlPUhlKGEsZixVZSxBLGkrMSkpLmxlbmd0aCxtZT4wJiYwPT09amUpamU9VGUubGVuZ3RoO2lmKHllPjApaWYoZj1JZSh4ZSxUZSxPZSksbj1QZShXZSxVZSxmLGEscGUsYmUsamUsQSxpLHQpLFRlPWYuam9pbihcIlwiKSx2b2lkIDAhPT1uKWlmKDA9PT0oamU9KFVlPW4udHJpbSgpKS5sZW5ndGgpKUE9MCxVZT1cIlwiO2lmKGplPjApc3dpdGNoKEEpe2Nhc2UgZmU6VGU9VGUucmVwbGFjZSh4LE1lKTtjYXNlIHVlOmNhc2UgaWU6Y2FzZSBROlVlPVRlK1wie1wiK1VlK1wifVwiO2JyZWFrO2Nhc2UgdGU6aWYoVWU9KFRlPVRlLnJlcGxhY2UoYixcIiQxICQyXCIrKEJlPjA/RGU6XCJcIikpKStcIntcIitVZStcIn1cIiwxPT09QWV8fDI9PT1BZSYmTGUoXCJAXCIrVWUsMykpVWU9XCJAXCIrTitVZStcIkBcIitVZTtlbHNlIFVlPVwiQFwiK1VlO2JyZWFrO2RlZmF1bHQ6aWYoVWU9VGUrVWUsdD09PWRlKVZlKz1VZSxVZT1cIlwifWVsc2UgVWU9XCJcIjticmVhaztkZWZhdWx0OlVlPUhlKGEsSWUoYSxUZSxPZSksVWUsdCxpKzEpfVhlKz1VZSxPPTAsJGU9MCx6PTAsd2U9MCxPZT0wLGo9MCxUZT1cIlwiLFVlPVwiXCIsQz1zLmNoYXJDb2RlQXQoKytSKTticmVhaztjYXNlIHE6Y2FzZSBXOmlmKChqZT0oVGU9KHdlPjA/VGUucmVwbGFjZShjLFwiXCIpOlRlKS50cmltKCkpLmxlbmd0aCk+MSl7aWYoMD09PXopaWYoKGc9VGUuY2hhckNvZGVBdCgwKSk9PT1RfHxnPjk2JiZnPDEyMylqZT0oVGU9VGUucmVwbGFjZShcIiBcIixcIjpcIikpLmxlbmd0aDtpZih5ZT4wKWlmKHZvaWQgMCE9PShuPVBlKFNlLFRlLGEsZSxwZSxiZSxWZS5sZW5ndGgsdCxpLHQpKSlpZigwPT09KGplPShUZT1uLnRyaW0oKSkubGVuZ3RoKSlUZT1cIlxcMFxcMFwiO3N3aXRjaChnPVRlLmNoYXJDb2RlQXQoMCksQT1UZS5jaGFyQ29kZUF0KDEpLGcpe2Nhc2UgcmU6YnJlYWs7Y2FzZSBMOmlmKEE9PT1vZXx8QT09PWhlKXtZZSs9VGUrcy5jaGFyQXQoUik7YnJlYWt9ZGVmYXVsdDppZihUZS5jaGFyQ29kZUF0KGplLTEpPT09VilicmVhaztWZSs9S2UoVGUsZyxBLFRlLmNoYXJDb2RlQXQoMikpfX1PPTAsJGU9MCx6PTAsd2U9MCxPZT0wLFRlPVwiXCIsQz1zLmNoYXJDb2RlQXQoKytSKX19c3dpdGNoKEMpe2Nhc2UgSjpjYXNlIEk6aWYoaCtkK3Urbyt2ZT09PTApc3dpdGNoKCQpe2Nhc2UgRTpjYXNlIFg6Y2FzZSBZOmNhc2UgTDpjYXNlIGFlOmNhc2UgXzpjYXNlIFQ6Y2FzZSBlZTpjYXNlIFo6Y2FzZSBROmNhc2UgVjpjYXNlIFU6Y2FzZSBXOmNhc2UgQjpjYXNlIHE6YnJlYWs7ZGVmYXVsdDppZih6PjApJGU9MX1pZihoPT09WiloPTA7ZWxzZSBpZihnZStPPT09MCYmdCE9PXRlJiZUZS5sZW5ndGg+MCl3ZT0xLFRlKz1cIlxcMFwiO2lmKHllKnFlPjApUGUoTmUsVGUsYSxlLHBlLGJlLFZlLmxlbmd0aCx0LGksdCk7YmU9MSxwZSsrO2JyZWFrO2Nhc2UgVzpjYXNlIHE6aWYoaCtkK3Urbz09PTApe2JlKys7YnJlYWt9ZGVmYXVsdDpzd2l0Y2goYmUrKyxSZT1zLmNoYXJBdChSKSxDKXtjYXNlIEs6Y2FzZSBNOmlmKGQrbytoPT09MClzd2l0Y2godyl7Y2FzZSBVOmNhc2UgVjpjYXNlIEs6Y2FzZSBNOlJlPVwiXCI7YnJlYWs7ZGVmYXVsdDppZihDIT09TSlSZT1cIiBcIn1icmVhaztjYXNlIHJlOlJlPVwiXFxcXDBcIjticmVhaztjYXNlIGNlOlJlPVwiXFxcXGZcIjticmVhaztjYXNlIHNlOlJlPVwiXFxcXHZcIjticmVhaztjYXNlIFA6aWYoZCtoK289PT0wJiZnZT4wKU9lPTEsd2U9MSxSZT1cIlxcZlwiK1JlO2JyZWFrO2Nhc2UgMTA4OmlmKGQraCtvK2tlPT09MCYmej4wKXN3aXRjaChSLXope2Nhc2UgMjppZih3PT09bmUmJnMuY2hhckNvZGVBdChSLTMpPT09VilrZT13O2Nhc2UgODppZihtPT09bGUpa2U9bX1icmVhaztjYXNlIFY6aWYoZCtoK289PT0wKXo9UjticmVhaztjYXNlIFU6aWYoaCt1K2Qrbz09PTApd2U9MSxSZSs9XCJcXHJcIjticmVhaztjYXNlIFk6Y2FzZSBYOmlmKDA9PT1oKWQ9ZD09PUM/MDowPT09ZD9DOmQ7YnJlYWs7Y2FzZSBHOmlmKGQraCt1PT09MClvKys7YnJlYWs7Y2FzZSBIOmlmKGQraCt1PT09MClvLS07YnJlYWs7Y2FzZSBFOmlmKGQraCtvPT09MCl1LS07YnJlYWs7Y2FzZSBEOmlmKGQraCtvPT09MCl7aWYoMD09PU8pc3dpdGNoKDIqdyszKm0pe2Nhc2UgNTMzOmJyZWFrO2RlZmF1bHQ6eT0wLE89MX11Kyt9YnJlYWs7Y2FzZSBMOmlmKGgrdStkK28reitqPT09MClqPTE7YnJlYWs7Y2FzZSBUOmNhc2UgWjppZihkK28rdT4wKWJyZWFrO3N3aXRjaChoKXtjYXNlIDA6c3dpdGNoKDIqQyszKnMuY2hhckNvZGVBdChSKzEpKXtjYXNlIDIzNTpoPVo7YnJlYWs7Y2FzZSAyMjA6amU9UixoPVR9YnJlYWs7Y2FzZSBUOmlmKEM9PT1aJiZ3PT09VCYmamUrMiE9PVIpe2lmKDMzPT09cy5jaGFyQ29kZUF0KGplKzIpKVZlKz1zLnN1YnN0cmluZyhqZSxSKzEpO1JlPVwiXCIsaD0wfX19aWYoMD09PWgpe2lmKGdlK2QrbytqPT09MCYmdCE9PXRlJiZDIT09Vylzd2l0Y2goQyl7Y2FzZSBVOmNhc2UgYWU6Y2FzZSBfOmNhc2UgZWU6Y2FzZSBFOmNhc2UgRDppZigwPT09Tyl7c3dpdGNoKHcpe2Nhc2UgSzpjYXNlIE06Y2FzZSBJOmNhc2UgSjpSZSs9XCJcXDBcIjticmVhaztkZWZhdWx0OlJlPVwiXFwwXCIrUmUrKEM9PT1VP1wiXCI6XCJcXDBcIil9d2U9MX1lbHNlIHN3aXRjaChDKXtjYXNlIEQ6aWYoeis3PT09UiYmMTA4PT09dyl6PTA7Tz0rK3k7YnJlYWs7Y2FzZSBFOmlmKDA9PShPPS0teSkpd2U9MSxSZSs9XCJcXDBcIn1icmVhaztjYXNlIEs6Y2FzZSBNOnN3aXRjaCh3KXtjYXNlIHJlOmNhc2UgQjpjYXNlIHE6Y2FzZSBXOmNhc2UgVTpjYXNlIGNlOmNhc2UgSzpjYXNlIE06Y2FzZSBJOmNhc2UgSjpicmVhaztkZWZhdWx0OmlmKDA9PT1PKXdlPTEsUmUrPVwiXFwwXCJ9fWlmKFRlKz1SZSxDIT09TSYmQyE9PUspJD1DfX1tPXcsdz1DLFIrK31pZihqZT1WZS5sZW5ndGgsbWU+MClpZigwPT09amUmJjA9PT1YZS5sZW5ndGgmJjA9PT1hWzBdLmxlbmd0aD09ZmFsc2UpaWYodCE9PWllfHwxPT09YS5sZW5ndGgmJihnZT4wP0VlOkdlKT09PWFbMF0pamU9YS5qb2luKFwiLFwiKS5sZW5ndGgrMjtpZihqZT4wKXtpZihmPTA9PT1nZSYmdCE9PXRlP2Z1bmN0aW9uKGUpe2Zvcih2YXIgYSxyLHM9MCx0PWUubGVuZ3RoLGk9QXJyYXkodCk7czx0Oysrcyl7Zm9yKHZhciBmPWVbc10uc3BsaXQobCksbj1cIlwiLG89MCxoPTAsdT0wLGQ9MCxiPWYubGVuZ3RoO288YjsrK28pe2lmKDA9PT0oaD0ocj1mW29dKS5sZW5ndGgpJiZiPjEpY29udGludWU7aWYodT1uLmNoYXJDb2RlQXQobi5sZW5ndGgtMSksZD1yLmNoYXJDb2RlQXQoMCksYT1cIlwiLDAhPT1vKXN3aXRjaCh1KXtjYXNlIFQ6Y2FzZSBhZTpjYXNlIF86Y2FzZSBlZTpjYXNlIE06Y2FzZSBEOmJyZWFrO2RlZmF1bHQ6YT1cIiBcIn1zd2l0Y2goZCl7Y2FzZSBQOnI9YStFZTtjYXNlIGFlOmNhc2UgXzpjYXNlIGVlOmNhc2UgTTpjYXNlIEU6Y2FzZSBEOmJyZWFrO2Nhc2UgRzpyPWErcitFZTticmVhaztjYXNlIFY6c3dpdGNoKDIqci5jaGFyQ29kZUF0KDEpKzMqci5jaGFyQ29kZUF0KDIpKXtjYXNlIDUzMDppZihDZT4wKXtyPWErci5zdWJzdHJpbmcoOCxoLTEpO2JyZWFrfWRlZmF1bHQ6aWYobzwxfHxmW28tMV0ubGVuZ3RoPDEpcj1hK0VlK3J9YnJlYWs7Y2FzZSBVOmE9XCJcIjtkZWZhdWx0OmlmKGg+MSYmci5pbmRleE9mKFwiOlwiKT4wKXI9YStyLnJlcGxhY2UodixcIiQxXCIrRWUrXCIkMlwiKTtlbHNlIHI9YStyK0VlfW4rPXJ9aVtzXT1uLnJlcGxhY2UoYyxcIlwiKS50cmltKCl9cmV0dXJuIGl9KGEpOmEseWU+MClpZih2b2lkIDAhPT0obj1QZShGZSxWZSxmLGUscGUsYmUsamUsdCxpLHQpKSYmMD09PShWZT1uKS5sZW5ndGgpcmV0dXJuIFllK1ZlK1hlO2lmKFZlPWYuam9pbihcIixcIikrXCJ7XCIrVmUrXCJ9XCIsQWUqa2UhPTApe2lmKDI9PT1BZSYmIUxlKFZlLDIpKWtlPTA7c3dpdGNoKGtlKXtjYXNlIGxlOlZlPVZlLnJlcGxhY2UoayxcIjpcIitTK1wiJDFcIikrVmU7YnJlYWs7Y2FzZSBuZTpWZT1WZS5yZXBsYWNlKHAsXCI6OlwiK04rXCJpbnB1dC0kMVwiKStWZS5yZXBsYWNlKHAsXCI6OlwiK1MrXCIkMVwiKStWZS5yZXBsYWNlKHAsXCI6XCIrRitcImlucHV0LSQxXCIpK1ZlfWtlPTB9fXJldHVybiBZZStWZStYZX1mdW5jdGlvbiBJZShlLGEscil7dmFyIGM9YS50cmltKCkuc3BsaXQobykscz1jLHQ9Yy5sZW5ndGgsaT1lLmxlbmd0aDtzd2l0Y2goaSl7Y2FzZSAwOmNhc2UgMTpmb3IodmFyIGY9MCxuPTA9PT1pP1wiXCI6ZVswXStcIiBcIjtmPHQ7KytmKXNbZl09SmUobixzW2ZdLHIsaSkudHJpbSgpO2JyZWFrO2RlZmF1bHQ6Zj0wO3ZhciBsPTA7Zm9yKHM9W107Zjx0OysrZilmb3IodmFyIGg9MDtoPGk7KytoKXNbbCsrXT1KZShlW2hdK1wiIFwiLGNbZl0scixpKS50cmltKCl9cmV0dXJuIHN9ZnVuY3Rpb24gSmUoZSxhLHIsYyl7dmFyIHM9YSx0PXMuY2hhckNvZGVBdCgwKTtpZih0PDMzKXQ9KHM9cy50cmltKCkpLmNoYXJDb2RlQXQoMCk7c3dpdGNoKHQpe2Nhc2UgUDpzd2l0Y2goZ2UrYyl7Y2FzZSAwOmNhc2UgMTppZigwPT09ZS50cmltKCkubGVuZ3RoKWJyZWFrO2RlZmF1bHQ6cmV0dXJuIHMucmVwbGFjZShoLFwiJDFcIitlLnRyaW0oKSl9YnJlYWs7Y2FzZSBWOnN3aXRjaChzLmNoYXJDb2RlQXQoMSkpe2Nhc2UgMTAzOmlmKENlPjAmJmdlPjApcmV0dXJuIHMucmVwbGFjZSh1LFwiJDFcIikucmVwbGFjZShoLFwiJDFcIitHZSk7YnJlYWs7ZGVmYXVsdDpyZXR1cm4gZS50cmltKCkrcy5yZXBsYWNlKGgsXCIkMVwiK2UudHJpbSgpKX1kZWZhdWx0OmlmKHIqZ2U+MCYmcy5pbmRleE9mKFwiXFxmXCIpPjApcmV0dXJuIHMucmVwbGFjZShoLChlLmNoYXJDb2RlQXQoMCk9PT1WP1wiXCI6XCIkMVwiKStlLnRyaW0oKSl9cmV0dXJuIGUrc31mdW5jdGlvbiBLZShlLGEscixjKXt2YXIgbCxvPTAsaD1lK1wiO1wiLHU9MiphKzMqcis0KmM7aWYoOTQ0PT09dSlyZXR1cm4gZnVuY3Rpb24oZSl7dmFyIGE9ZS5sZW5ndGgscj1lLmluZGV4T2YoXCI6XCIsOSkrMSxjPWUuc3Vic3RyaW5nKDAscikudHJpbSgpLHM9ZS5zdWJzdHJpbmcocixhLTEpLnRyaW0oKTtzd2l0Y2goZS5jaGFyQ29kZUF0KDkpKkJlKXtjYXNlIDA6YnJlYWs7Y2FzZSBROmlmKDExMCE9PWUuY2hhckNvZGVBdCgxMCkpYnJlYWs7ZGVmYXVsdDpmb3IodmFyIHQ9cy5zcGxpdCgocz1cIlwiLGYpKSxpPTAscj0wLGE9dC5sZW5ndGg7aTxhO3I9MCwrK2kpe2Zvcih2YXIgbD10W2ldLG89bC5zcGxpdChuKTtsPW9bcl07KXt2YXIgaD1sLmNoYXJDb2RlQXQoMCk7aWYoMT09PUJlJiYoaD5MJiZoPDkwfHxoPjk2JiZoPDEyM3x8aD09PVJ8fGg9PT1RJiZsLmNoYXJDb2RlQXQoMSkhPT1RKSlzd2l0Y2goaXNOYU4ocGFyc2VGbG9hdChsKSkrKC0xIT09bC5pbmRleE9mKFwiKFwiKSkpe2Nhc2UgMTpzd2l0Y2gobCl7Y2FzZVwiaW5maW5pdGVcIjpjYXNlXCJhbHRlcm5hdGVcIjpjYXNlXCJiYWNrd2FyZHNcIjpjYXNlXCJydW5uaW5nXCI6Y2FzZVwibm9ybWFsXCI6Y2FzZVwiZm9yd2FyZHNcIjpjYXNlXCJib3RoXCI6Y2FzZVwibm9uZVwiOmNhc2VcImxpbmVhclwiOmNhc2VcImVhc2VcIjpjYXNlXCJlYXNlLWluXCI6Y2FzZVwiZWFzZS1vdXRcIjpjYXNlXCJlYXNlLWluLW91dFwiOmNhc2VcInBhdXNlZFwiOmNhc2VcInJldmVyc2VcIjpjYXNlXCJhbHRlcm5hdGUtcmV2ZXJzZVwiOmNhc2VcImluaGVyaXRcIjpjYXNlXCJpbml0aWFsXCI6Y2FzZVwidW5zZXRcIjpjYXNlXCJzdGVwLXN0YXJ0XCI6Y2FzZVwic3RlcC1lbmRcIjpicmVhaztkZWZhdWx0OmwrPURlfX1vW3IrK109bH1zKz0oMD09PWk/XCJcIjpcIixcIikrby5qb2luKFwiIFwiKX19aWYocz1jK3MrXCI7XCIsMT09PUFlfHwyPT09QWUmJkxlKHMsMSkpcmV0dXJuIE4rcytzO3JldHVybiBzfShoKTtlbHNlIGlmKDA9PT1BZXx8Mj09PUFlJiYhTGUoaCwxKSlyZXR1cm4gaDtzd2l0Y2godSl7Y2FzZSAxMDE1OnJldHVybiA5Nz09PWguY2hhckNvZGVBdCgxMCk/TitoK2g6aDtjYXNlIDk1MTpyZXR1cm4gMTE2PT09aC5jaGFyQ29kZUF0KDMpP04raCtoOmg7Y2FzZSA5NjM6cmV0dXJuIDExMD09PWguY2hhckNvZGVBdCg1KT9OK2graDpoO2Nhc2UgMTAwOTppZigxMDAhPT1oLmNoYXJDb2RlQXQoNCkpYnJlYWs7Y2FzZSA5Njk6Y2FzZSA5NDI6cmV0dXJuIE4raCtoO2Nhc2UgOTc4OnJldHVybiBOK2grUytoK2g7Y2FzZSAxMDE5OmNhc2UgOTgzOnJldHVybiBOK2grUytoK0YraCtoO2Nhc2UgODgzOmlmKGguY2hhckNvZGVBdCg4KT09PVEpcmV0dXJuIE4raCtoO2lmKGguaW5kZXhPZihcImltYWdlLXNldChcIiwxMSk+MClyZXR1cm4gaC5yZXBsYWNlKHosXCIkMVwiK04rXCIkMlwiKStoO3JldHVybiBoO2Nhc2UgOTMyOmlmKGguY2hhckNvZGVBdCg0KT09PVEpc3dpdGNoKGguY2hhckNvZGVBdCg1KSl7Y2FzZSAxMDM6cmV0dXJuIE4rXCJib3gtXCIraC5yZXBsYWNlKFwiLWdyb3dcIixcIlwiKStOK2grRitoLnJlcGxhY2UoXCJncm93XCIsXCJwb3NpdGl2ZVwiKStoO2Nhc2UgMTE1OnJldHVybiBOK2grRitoLnJlcGxhY2UoXCJzaHJpbmtcIixcIm5lZ2F0aXZlXCIpK2g7Y2FzZSA5ODpyZXR1cm4gTitoK0YraC5yZXBsYWNlKFwiYmFzaXNcIixcInByZWZlcnJlZC1zaXplXCIpK2h9cmV0dXJuIE4raCtGK2graDtjYXNlIDk2NDpyZXR1cm4gTitoK0YrXCJmbGV4LVwiK2graDtjYXNlIDEwMjM6aWYoOTkhPT1oLmNoYXJDb2RlQXQoOCkpYnJlYWs7cmV0dXJuIGw9aC5zdWJzdHJpbmcoaC5pbmRleE9mKFwiOlwiLDE1KSkucmVwbGFjZShcImZsZXgtXCIsXCJcIikucmVwbGFjZShcInNwYWNlLWJldHdlZW5cIixcImp1c3RpZnlcIiksTitcImJveC1wYWNrXCIrbCtOK2grRitcImZsZXgtcGFja1wiK2wraDtjYXNlIDEwMDU6cmV0dXJuIHQudGVzdChoKT9oLnJlcGxhY2UocyxcIjpcIitOKStoLnJlcGxhY2UocyxcIjpcIitTKStoOmg7Y2FzZSAxZTM6c3dpdGNoKG89KGw9aC5zdWJzdHJpbmcoMTMpLnRyaW0oKSkuaW5kZXhPZihcIi1cIikrMSxsLmNoYXJDb2RlQXQoMCkrbC5jaGFyQ29kZUF0KG8pKXtjYXNlIDIyNjpsPWgucmVwbGFjZShtLFwidGJcIik7YnJlYWs7Y2FzZSAyMzI6bD1oLnJlcGxhY2UobSxcInRiLXJsXCIpO2JyZWFrO2Nhc2UgMjIwOmw9aC5yZXBsYWNlKG0sXCJsclwiKTticmVhaztkZWZhdWx0OnJldHVybiBofXJldHVybiBOK2grRitsK2g7Y2FzZSAxMDE3OmlmKC0xPT09aC5pbmRleE9mKFwic3RpY2t5XCIsOSkpcmV0dXJuIGg7Y2FzZSA5NzU6c3dpdGNoKG89KGg9ZSkubGVuZ3RoLTEwLHU9KGw9KDMzPT09aC5jaGFyQ29kZUF0KG8pP2guc3Vic3RyaW5nKDAsbyk6aCkuc3Vic3RyaW5nKGUuaW5kZXhPZihcIjpcIiw3KSsxKS50cmltKCkpLmNoYXJDb2RlQXQoMCkrKDB8bC5jaGFyQ29kZUF0KDcpKSl7Y2FzZSAyMDM6aWYobC5jaGFyQ29kZUF0KDgpPDExMSlicmVhaztjYXNlIDExNTpoPWgucmVwbGFjZShsLE4rbCkrXCI7XCIraDticmVhaztjYXNlIDIwNzpjYXNlIDEwMjpoPWgucmVwbGFjZShsLE4rKHU+MTAyP1wiaW5saW5lLVwiOlwiXCIpK1wiYm94XCIpK1wiO1wiK2gucmVwbGFjZShsLE4rbCkrXCI7XCIraC5yZXBsYWNlKGwsRitsK1wiYm94XCIpK1wiO1wiK2h9cmV0dXJuIGgrXCI7XCI7Y2FzZSA5Mzg6aWYoaC5jaGFyQ29kZUF0KDUpPT09USlzd2l0Y2goaC5jaGFyQ29kZUF0KDYpKXtjYXNlIDEwNTpyZXR1cm4gbD1oLnJlcGxhY2UoXCItaXRlbXNcIixcIlwiKSxOK2grTitcImJveC1cIitsK0YrXCJmbGV4LVwiK2wraDtjYXNlIDExNTpyZXR1cm4gTitoK0YrXCJmbGV4LWl0ZW0tXCIraC5yZXBsYWNlKHksXCJcIikraDtkZWZhdWx0OnJldHVybiBOK2grRitcImZsZXgtbGluZS1wYWNrXCIraC5yZXBsYWNlKFwiYWxpZ24tY29udGVudFwiLFwiXCIpLnJlcGxhY2UoeSxcIlwiKStofWJyZWFrO2Nhc2UgOTczOmNhc2UgOTg5OmlmKGguY2hhckNvZGVBdCgzKSE9PVF8fDEyMj09PWguY2hhckNvZGVBdCg0KSlicmVhaztjYXNlIDkzMTpjYXNlIDk1MzppZih0cnVlPT09ai50ZXN0KGUpKWlmKDExNT09PShsPWUuc3Vic3RyaW5nKGUuaW5kZXhPZihcIjpcIikrMSkpLmNoYXJDb2RlQXQoMCkpcmV0dXJuIEtlKGUucmVwbGFjZShcInN0cmV0Y2hcIixcImZpbGwtYXZhaWxhYmxlXCIpLGEscixjKS5yZXBsYWNlKFwiOmZpbGwtYXZhaWxhYmxlXCIsXCI6c3RyZXRjaFwiKTtlbHNlIHJldHVybiBoLnJlcGxhY2UobCxOK2wpK2gucmVwbGFjZShsLFMrbC5yZXBsYWNlKFwiZmlsbC1cIixcIlwiKSkraDticmVhaztjYXNlIDk2MjppZihoPU4raCsoMTAyPT09aC5jaGFyQ29kZUF0KDUpP0YraDpcIlwiKStoLHIrYz09PTIxMSYmMTA1PT09aC5jaGFyQ29kZUF0KDEzKSYmaC5pbmRleE9mKFwidHJhbnNmb3JtXCIsMTApPjApcmV0dXJuIGguc3Vic3RyaW5nKDAsaC5pbmRleE9mKFwiO1wiLDI3KSsxKS5yZXBsYWNlKGksXCIkMVwiK04rXCIkMlwiKStofXJldHVybiBofWZ1bmN0aW9uIExlKGUsYSl7dmFyIHI9ZS5pbmRleE9mKDE9PT1hP1wiOlwiOlwie1wiKSxjPWUuc3Vic3RyaW5nKDAsMyE9PWE/cjoxMCkscz1lLnN1YnN0cmluZyhyKzEsZS5sZW5ndGgtMSk7cmV0dXJuIE9lKDIhPT1hP2M6Yy5yZXBsYWNlKE8sXCIkMVwiKSxzLGEpfWZ1bmN0aW9uIE1lKGUsYSl7dmFyIHI9S2UoYSxhLmNoYXJDb2RlQXQoMCksYS5jaGFyQ29kZUF0KDEpLGEuY2hhckNvZGVBdCgyKSk7cmV0dXJuIHIhPT1hK1wiO1wiP3IucmVwbGFjZSgkLFwiIG9yICgkMSlcIikuc3Vic3RyaW5nKDQpOlwiKFwiK2ErXCIpXCJ9ZnVuY3Rpb24gUGUoZSxhLHIsYyxzLHQsaSxmLG4sbCl7Zm9yKHZhciBvLGg9MCx1PWE7aDx5ZTsrK2gpc3dpdGNoKG89JGVbaF0uY2FsbChUZSxlLHUscixjLHMsdCxpLGYsbixsKSl7Y2FzZSB2b2lkIDA6Y2FzZSBmYWxzZTpjYXNlIHRydWU6Y2FzZSBudWxsOmJyZWFrO2RlZmF1bHQ6dT1vfWlmKHUhPT1hKXJldHVybiB1fWZ1bmN0aW9uIFFlKGUsYSxyLGMpe2Zvcih2YXIgcz1hKzE7czxyOysrcylzd2l0Y2goYy5jaGFyQ29kZUF0KHMpKXtjYXNlIFo6aWYoZT09PVQpaWYoYy5jaGFyQ29kZUF0KHMtMSk9PT1UJiZhKzIhPT1zKXJldHVybiBzKzE7YnJlYWs7Y2FzZSBJOmlmKGU9PT1aKXJldHVybiBzKzF9cmV0dXJuIHN9ZnVuY3Rpb24gUmUoZSl7Zm9yKHZhciBhIGluIGUpe3ZhciByPWVbYV07c3dpdGNoKGEpe2Nhc2VcImtleWZyYW1lXCI6QmU9MHxyO2JyZWFrO2Nhc2VcImdsb2JhbFwiOkNlPTB8cjticmVhaztjYXNlXCJjYXNjYWRlXCI6Z2U9MHxyO2JyZWFrO2Nhc2VcImNvbXByZXNzXCI6d2U9MHxyO2JyZWFrO2Nhc2VcInNlbWljb2xvblwiOnZlPTB8cjticmVhaztjYXNlXCJwcmVzZXJ2ZVwiOm1lPTB8cjticmVhaztjYXNlXCJwcmVmaXhcIjppZihPZT1udWxsLCFyKUFlPTA7ZWxzZSBpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiByKUFlPTE7ZWxzZSBBZT0yLE9lPXJ9fXJldHVybiBSZX1mdW5jdGlvbiBUZShhLHIpe2lmKHZvaWQgMCE9PXRoaXMmJnRoaXMuY29uc3RydWN0b3I9PT1UZSlyZXR1cm4gZShhKTt2YXIgcz1hLHQ9cy5jaGFyQ29kZUF0KDApO2lmKHQ8MzMpdD0ocz1zLnRyaW0oKSkuY2hhckNvZGVBdCgwKTtpZihCZT4wKURlPXMucmVwbGFjZShkLHQ9PT1HP1wiXCI6XCItXCIpO2lmKHQ9MSwxPT09Z2UpR2U9cztlbHNlIEVlPXM7dmFyIGksZj1bR2VdO2lmKHllPjApaWYodm9pZCAwIT09KGk9UGUoemUscixmLGYscGUsYmUsMCwwLDAsMCkpJiZcInN0cmluZ1wiPT10eXBlb2YgaSlyPWk7dmFyIG49SGUoeGUsZixyLDAsMCk7aWYoeWU+MClpZih2b2lkIDAhPT0oaT1QZShqZSxuLGYsZixwZSxiZSxuLmxlbmd0aCwwLDAsMCkpJiZcInN0cmluZ1wiIT10eXBlb2Yobj1pKSl0PTA7cmV0dXJuIERlPVwiXCIsR2U9XCJcIixFZT1cIlwiLGtlPTAscGU9MSxiZT0xLHdlKnQ9PTA/bjpuLnJlcGxhY2UoYyxcIlwiKS5yZXBsYWNlKGcsXCJcIikucmVwbGFjZShBLFwiJDFcIikucmVwbGFjZShDLFwiJDFcIikucmVwbGFjZSh3LFwiIFwiKX1pZihUZS51c2U9ZnVuY3Rpb24gZShhKXtzd2l0Y2goYSl7Y2FzZSB2b2lkIDA6Y2FzZSBudWxsOnllPSRlLmxlbmd0aD0wO2JyZWFrO2RlZmF1bHQ6aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYSkkZVt5ZSsrXT1hO2Vsc2UgaWYoXCJvYmplY3RcIj09dHlwZW9mIGEpZm9yKHZhciByPTAsYz1hLmxlbmd0aDtyPGM7KytyKWUoYVtyXSk7ZWxzZSBxZT0wfCEhYX1yZXR1cm4gZX0sVGUuc2V0PVJlLHZvaWQgMCE9PWEpUmUoYSk7cmV0dXJuIFRlfSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdHlsaXMubWluLmpzLm1hcCIsIihmdW5jdGlvbiAoZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyAobW9kdWxlWydleHBvcnRzJ10gPSBmYWN0b3J5KCkpIDpcblx0XHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZVsnYW1kJ10gPyBkZWZpbmUoZmFjdG9yeSgpKSA6XG5cdFx0XHQod2luZG93WydzdHlsaXNSdWxlU2hlZXQnXSA9IGZhY3RvcnkoKSlcbn0oZnVuY3Rpb24gKCkge1xuXG5cdCd1c2Ugc3RyaWN0J1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5zZXJ0UnVsZSkge1xuXHRcdHZhciBkZWxpbWl0ZXIgPSAnLyp8Ki8nXG5cdFx0dmFyIG5lZWRsZSA9IGRlbGltaXRlcisnfSdcblxuXHRcdGZ1bmN0aW9uIHRvU2hlZXQgKGJsb2NrKSB7XG5cdFx0XHRpZiAoYmxvY2spXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0aW5zZXJ0UnVsZShibG9jayArICd9Jylcblx0XHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHR9XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24gcnVsZVNoZWV0IChjb250ZXh0LCBjb250ZW50LCBzZWxlY3RvcnMsIHBhcmVudHMsIGxpbmUsIGNvbHVtbiwgbGVuZ3RoLCBucywgZGVwdGgsIGF0KSB7XG5cdFx0XHRzd2l0Y2ggKGNvbnRleHQpIHtcblx0XHRcdFx0Ly8gcHJvcGVydHlcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdC8vIEBpbXBvcnRcblx0XHRcdFx0XHRpZiAoZGVwdGggPT09IDAgJiYgY29udGVudC5jaGFyQ29kZUF0KDApID09PSA2NClcblx0XHRcdFx0XHRcdHJldHVybiBpbnNlcnRSdWxlKGNvbnRlbnQrJzsnKSwgJydcblx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHQvLyBzZWxlY3RvclxuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0aWYgKG5zID09PSAwKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGNvbnRlbnQgKyBkZWxpbWl0ZXJcblx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHQvLyBhdC1ydWxlXG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRzd2l0Y2ggKG5zKSB7XG5cdFx0XHRcdFx0XHQvLyBAZm9udC1mYWNlLCBAcGFnZVxuXHRcdFx0XHRcdFx0Y2FzZSAxMDI6XG5cdFx0XHRcdFx0XHRjYXNlIDExMjpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGluc2VydFJ1bGUoc2VsZWN0b3JzWzBdK2NvbnRlbnQpLCAnJ1xuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNvbnRlbnQgKyAoYXQgPT09IDAgPyBkZWxpbWl0ZXIgOiAnJylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgLTI6XG5cdFx0XHRcdFx0Y29udGVudC5zcGxpdChuZWVkbGUpLmZvckVhY2godG9TaGVldClcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pKVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG52YXIgdW5pdGxlc3NLZXlzID0ge1xuICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogMSxcbiAgYm9yZGVySW1hZ2VPdXRzZXQ6IDEsXG4gIGJvcmRlckltYWdlU2xpY2U6IDEsXG4gIGJvcmRlckltYWdlV2lkdGg6IDEsXG4gIGJveEZsZXg6IDEsXG4gIGJveEZsZXhHcm91cDogMSxcbiAgYm94T3JkaW5hbEdyb3VwOiAxLFxuICBjb2x1bW5Db3VudDogMSxcbiAgY29sdW1uczogMSxcbiAgZmxleDogMSxcbiAgZmxleEdyb3c6IDEsXG4gIGZsZXhQb3NpdGl2ZTogMSxcbiAgZmxleFNocmluazogMSxcbiAgZmxleE5lZ2F0aXZlOiAxLFxuICBmbGV4T3JkZXI6IDEsXG4gIGdyaWRSb3c6IDEsXG4gIGdyaWRSb3dFbmQ6IDEsXG4gIGdyaWRSb3dTcGFuOiAxLFxuICBncmlkUm93U3RhcnQ6IDEsXG4gIGdyaWRDb2x1bW46IDEsXG4gIGdyaWRDb2x1bW5FbmQ6IDEsXG4gIGdyaWRDb2x1bW5TcGFuOiAxLFxuICBncmlkQ29sdW1uU3RhcnQ6IDEsXG4gIG1zR3JpZFJvdzogMSxcbiAgbXNHcmlkUm93U3BhbjogMSxcbiAgbXNHcmlkQ29sdW1uOiAxLFxuICBtc0dyaWRDb2x1bW5TcGFuOiAxLFxuICBmb250V2VpZ2h0OiAxLFxuICBsaW5lSGVpZ2h0OiAxLFxuICBvcGFjaXR5OiAxLFxuICBvcmRlcjogMSxcbiAgb3JwaGFuczogMSxcbiAgdGFiU2l6ZTogMSxcbiAgd2lkb3dzOiAxLFxuICB6SW5kZXg6IDEsXG4gIHpvb206IDEsXG4gIFdlYmtpdExpbmVDbGFtcDogMSxcbiAgLy8gU1ZHLXJlbGF0ZWQgcHJvcGVydGllc1xuICBmaWxsT3BhY2l0eTogMSxcbiAgZmxvb2RPcGFjaXR5OiAxLFxuICBzdG9wT3BhY2l0eTogMSxcbiAgc3Ryb2tlRGFzaGFycmF5OiAxLFxuICBzdHJva2VEYXNob2Zmc2V0OiAxLFxuICBzdHJva2VNaXRlcmxpbWl0OiAxLFxuICBzdHJva2VPcGFjaXR5OiAxLFxuICBzdHJva2VXaWR0aDogMVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gdW5pdGxlc3NLZXlzO1xuIiwiLyoqIEBsaWNlbnNlIFJlYWN0IHYxNi4xMy4xXG4gKiByZWFjdC1pcy5wcm9kdWN0aW9uLm1pbi5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbid1c2Ugc3RyaWN0Jzt2YXIgYj1cImZ1bmN0aW9uXCI9PT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yLGM9Yj9TeW1ib2wuZm9yKFwicmVhY3QuZWxlbWVudFwiKTo2MDEwMyxkPWI/U3ltYm9sLmZvcihcInJlYWN0LnBvcnRhbFwiKTo2MDEwNixlPWI/U3ltYm9sLmZvcihcInJlYWN0LmZyYWdtZW50XCIpOjYwMTA3LGY9Yj9TeW1ib2wuZm9yKFwicmVhY3Quc3RyaWN0X21vZGVcIik6NjAxMDgsZz1iP1N5bWJvbC5mb3IoXCJyZWFjdC5wcm9maWxlclwiKTo2MDExNCxoPWI/U3ltYm9sLmZvcihcInJlYWN0LnByb3ZpZGVyXCIpOjYwMTA5LGs9Yj9TeW1ib2wuZm9yKFwicmVhY3QuY29udGV4dFwiKTo2MDExMCxsPWI/U3ltYm9sLmZvcihcInJlYWN0LmFzeW5jX21vZGVcIik6NjAxMTEsbT1iP1N5bWJvbC5mb3IoXCJyZWFjdC5jb25jdXJyZW50X21vZGVcIik6NjAxMTEsbj1iP1N5bWJvbC5mb3IoXCJyZWFjdC5mb3J3YXJkX3JlZlwiKTo2MDExMixwPWI/U3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlXCIpOjYwMTEzLHE9Yj9cblN5bWJvbC5mb3IoXCJyZWFjdC5zdXNwZW5zZV9saXN0XCIpOjYwMTIwLHI9Yj9TeW1ib2wuZm9yKFwicmVhY3QubWVtb1wiKTo2MDExNSx0PWI/U3ltYm9sLmZvcihcInJlYWN0LmxhenlcIik6NjAxMTYsdj1iP1N5bWJvbC5mb3IoXCJyZWFjdC5ibG9ja1wiKTo2MDEyMSx3PWI/U3ltYm9sLmZvcihcInJlYWN0LmZ1bmRhbWVudGFsXCIpOjYwMTE3LHg9Yj9TeW1ib2wuZm9yKFwicmVhY3QucmVzcG9uZGVyXCIpOjYwMTE4LHk9Yj9TeW1ib2wuZm9yKFwicmVhY3Quc2NvcGVcIik6NjAxMTk7XG5mdW5jdGlvbiB6KGEpe2lmKFwib2JqZWN0XCI9PT10eXBlb2YgYSYmbnVsbCE9PWEpe3ZhciB1PWEuJCR0eXBlb2Y7c3dpdGNoKHUpe2Nhc2UgYzpzd2l0Y2goYT1hLnR5cGUsYSl7Y2FzZSBsOmNhc2UgbTpjYXNlIGU6Y2FzZSBnOmNhc2UgZjpjYXNlIHA6cmV0dXJuIGE7ZGVmYXVsdDpzd2l0Y2goYT1hJiZhLiQkdHlwZW9mLGEpe2Nhc2UgazpjYXNlIG46Y2FzZSB0OmNhc2UgcjpjYXNlIGg6cmV0dXJuIGE7ZGVmYXVsdDpyZXR1cm4gdX19Y2FzZSBkOnJldHVybiB1fX19ZnVuY3Rpb24gQShhKXtyZXR1cm4geihhKT09PW19ZXhwb3J0cy5Bc3luY01vZGU9bDtleHBvcnRzLkNvbmN1cnJlbnRNb2RlPW07ZXhwb3J0cy5Db250ZXh0Q29uc3VtZXI9aztleHBvcnRzLkNvbnRleHRQcm92aWRlcj1oO2V4cG9ydHMuRWxlbWVudD1jO2V4cG9ydHMuRm9yd2FyZFJlZj1uO2V4cG9ydHMuRnJhZ21lbnQ9ZTtleHBvcnRzLkxhenk9dDtleHBvcnRzLk1lbW89cjtleHBvcnRzLlBvcnRhbD1kO1xuZXhwb3J0cy5Qcm9maWxlcj1nO2V4cG9ydHMuU3RyaWN0TW9kZT1mO2V4cG9ydHMuU3VzcGVuc2U9cDtleHBvcnRzLmlzQXN5bmNNb2RlPWZ1bmN0aW9uKGEpe3JldHVybiBBKGEpfHx6KGEpPT09bH07ZXhwb3J0cy5pc0NvbmN1cnJlbnRNb2RlPUE7ZXhwb3J0cy5pc0NvbnRleHRDb25zdW1lcj1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PWt9O2V4cG9ydHMuaXNDb250ZXh0UHJvdmlkZXI9ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT1ofTtleHBvcnRzLmlzRWxlbWVudD1mdW5jdGlvbihhKXtyZXR1cm5cIm9iamVjdFwiPT09dHlwZW9mIGEmJm51bGwhPT1hJiZhLiQkdHlwZW9mPT09Y307ZXhwb3J0cy5pc0ZvcndhcmRSZWY9ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT1ufTtleHBvcnRzLmlzRnJhZ21lbnQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT1lfTtleHBvcnRzLmlzTGF6eT1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PXR9O1xuZXhwb3J0cy5pc01lbW89ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT1yfTtleHBvcnRzLmlzUG9ydGFsPWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09ZH07ZXhwb3J0cy5pc1Byb2ZpbGVyPWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09Z307ZXhwb3J0cy5pc1N0cmljdE1vZGU9ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT1mfTtleHBvcnRzLmlzU3VzcGVuc2U9ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT1wfTtcbmV4cG9ydHMuaXNWYWxpZEVsZW1lbnRUeXBlPWZ1bmN0aW9uKGEpe3JldHVyblwic3RyaW5nXCI9PT10eXBlb2YgYXx8XCJmdW5jdGlvblwiPT09dHlwZW9mIGF8fGE9PT1lfHxhPT09bXx8YT09PWd8fGE9PT1mfHxhPT09cHx8YT09PXF8fFwib2JqZWN0XCI9PT10eXBlb2YgYSYmbnVsbCE9PWEmJihhLiQkdHlwZW9mPT09dHx8YS4kJHR5cGVvZj09PXJ8fGEuJCR0eXBlb2Y9PT1ofHxhLiQkdHlwZW9mPT09a3x8YS4kJHR5cGVvZj09PW58fGEuJCR0eXBlb2Y9PT13fHxhLiQkdHlwZW9mPT09eHx8YS4kJHR5cGVvZj09PXl8fGEuJCR0eXBlb2Y9PT12KX07ZXhwb3J0cy50eXBlT2Y9ejtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC1pcy5kZXZlbG9wbWVudC5qcycpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhcmVJbnB1dHNFcXVhbChuZXdJbnB1dHMsIGxhc3RJbnB1dHMpIHtcbiAgICBpZiAobmV3SW5wdXRzLmxlbmd0aCAhPT0gbGFzdElucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld0lucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobmV3SW5wdXRzW2ldICE9PSBsYXN0SW5wdXRzW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIG1lbW9pemVPbmUocmVzdWx0Rm4sIGlzRXF1YWwpIHtcbiAgICBpZiAoaXNFcXVhbCA9PT0gdm9pZCAwKSB7IGlzRXF1YWwgPSBhcmVJbnB1dHNFcXVhbDsgfVxuICAgIHZhciBsYXN0VGhpcztcbiAgICB2YXIgbGFzdEFyZ3MgPSBbXTtcbiAgICB2YXIgbGFzdFJlc3VsdDtcbiAgICB2YXIgY2FsbGVkT25jZSA9IGZhbHNlO1xuICAgIGZ1bmN0aW9uIG1lbW9pemVkKCkge1xuICAgICAgICB2YXIgbmV3QXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgbmV3QXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYWxsZWRPbmNlICYmIGxhc3RUaGlzID09PSB0aGlzICYmIGlzRXF1YWwobmV3QXJncywgbGFzdEFyZ3MpKSB7XG4gICAgICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBsYXN0UmVzdWx0ID0gcmVzdWx0Rm4uYXBwbHkodGhpcywgbmV3QXJncyk7XG4gICAgICAgIGNhbGxlZE9uY2UgPSB0cnVlO1xuICAgICAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgICAgIGxhc3RBcmdzID0gbmV3QXJncztcbiAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiBtZW1vaXplZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZW1vaXplT25lO1xuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdElzID0gcmVxdWlyZSgncmVhY3QtaXMnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG52YXIgY2hlY2tQcm9wVHlwZXMgPSByZXF1aXJlKCcuL2NoZWNrUHJvcFR5cGVzJyk7XG5cbnZhciBoYXMgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG52YXIgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24oKSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgcHJpbnRXYXJuaW5nID0gZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyB0ZXh0O1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyAtLS0gV2VsY29tZSB0byBkZWJ1Z2dpbmcgUmVhY3QgLS0tXG4gICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH0gY2F0Y2ggKHgpIHt9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGwoKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgZWxlbWVudFR5cGU6IGNyZWF0ZUVsZW1lbnRUeXBlVHlwZUNoZWNrZXIoKSxcbiAgICBpbnN0YW5jZU9mOiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyLFxuICAgIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gICAgb2JqZWN0T2Y6IGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIsXG4gICAgb25lT2Y6IGNyZWF0ZUVudW1UeXBlQ2hlY2tlcixcbiAgICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gICAgc2hhcGU6IGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIsXG4gICAgZXhhY3Q6IGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIsXG4gIH07XG5cbiAgLyoqXG4gICAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzXG4gICAqL1xuICAvKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG4gIGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgaWYgKHggPT09IHkpIHtcbiAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gICAgfVxuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4gIC8qKlxuICAgKiBXZSB1c2UgYW4gRXJyb3ItbGlrZSBvYmplY3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgYXMgcGVvcGxlIG1heSBjYWxsXG4gICAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIsIHdlIGRvbid0IHVzZSByZWFsXG4gICAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAgICogaXMgcHJvaGliaXRpdmVseSBleHBlbnNpdmUgaWYgdGhleSBhcmUgY3JlYXRlZCB0b28gb2Z0ZW4sIHN1Y2ggYXMgd2hhdFxuICAgKiBoYXBwZW5zIGluIG9uZU9mVHlwZSgpIGZvciBhbnkgdHlwZSBiZWZvcmUgdGhlIG9uZSB0aGF0IG1hdGNoZWQuXG4gICAqL1xuICBmdW5jdGlvbiBQcm9wVHlwZUVycm9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSAnJztcbiAgfVxuICAvLyBNYWtlIGBpbnN0YW5jZW9mIEVycm9yYCBzdGlsbCB3b3JrIGZvciByZXR1cm5lZCBlcnJvcnMuXG4gIFByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSA9IHt9O1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG5cbiAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAgIGlmICh0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gICAgICAgICAgLy8gTmV3IGJlaGF2aW9yIG9ubHkgZm9yIHVzZXJzIG9mIGBwcm9wLXR5cGVzYCBwYWNrYWdlXG4gICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICAgICAgICdVc2UgYFByb3BUeXBlcy5jaGVja1Byb3BUeXBlcygpYCB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgICAgICAgKTtcbiAgICAgICAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBPbGQgYmVoYXZpb3IgZm9yIHBlb3BsZSB1c2luZyBSZWFjdC5Qcm9wVHlwZXNcbiAgICAgICAgICB2YXIgY2FjaGVLZXkgPSBjb21wb25lbnROYW1lICsgJzonICsgcHJvcE5hbWU7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIW1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSAmJlxuICAgICAgICAgICAgLy8gQXZvaWQgc3BhbW1pbmcgdGhlIGNvbnNvbGUgYmVjYXVzZSB0aGV5IGFyZSBvZnRlbiBub3QgYWN0aW9uYWJsZSBleGNlcHQgZm9yIGxpYiBhdXRob3JzXG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA8IDNcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICAgJ1lvdSBhcmUgbWFudWFsbHkgY2FsbGluZyBhIFJlYWN0LlByb3BUeXBlcyB2YWxpZGF0aW9uICcgK1xuICAgICAgICAgICAgICAnZnVuY3Rpb24gZm9yIHRoZSBgJyArIHByb3BGdWxsTmFtZSArICdgIHByb3Agb24gYCcgKyBjb21wb25lbnROYW1lICArICdgLiBUaGlzIGlzIGRlcHJlY2F0ZWQgJyArXG4gICAgICAgICAgICAgICdhbmQgd2lsbCB0aHJvdyBpbiB0aGUgc3RhbmRhbG9uZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAgICdZb3UgbWF5IGJlIHNlZWluZyB0aGlzIHdhcm5pbmcgZHVlIHRvIGEgdGhpcmQtcGFydHkgUHJvcFR5cGVzICcgK1xuICAgICAgICAgICAgICAnbGlicmFyeS4gU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1kb250LWNhbGwtcHJvcHR5cGVzICcgKyAnZm9yIGRldGFpbHMuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdUaGUgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIGlzIG1hcmtlZCBhcyByZXF1aXJlZCAnICsgKCdpbiBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgYnV0IGl0cyB2YWx1ZSBpcyBgbnVsbGAuJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGB1bmRlZmluZWRgLicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjaGFpbmVkQ2hlY2tUeXBlID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgZmFsc2UpO1xuICAgIGNoYWluZWRDaGVja1R5cGUuaXNSZXF1aXJlZCA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIHRydWUpO1xuXG4gICAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcihleHBlY3RlZFR5cGUpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICAvLyBgcHJvcFZhbHVlYCBiZWluZyBpbnN0YW5jZSBvZiwgc2F5LCBkYXRlL3JlZ2V4cCwgcGFzcyB0aGUgJ29iamVjdCdcbiAgICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAgIC8vICdvZiB0eXBlIGBvYmplY3RgJy5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcmVjaXNlVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnYCcgKyBleHBlY3RlZFR5cGUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFueVR5cGVDaGVja2VyKCkge1xuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZVR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghUmVhY3RJcy5pc1ZhbGlkRWxlbWVudFR5cGUocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQgdHlwZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShleHBlY3RlZFZhbHVlcykpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHByaW50V2FybmluZyhcbiAgICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50cyBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gYXJyYXksIGdvdCAnICsgYXJndW1lbnRzLmxlbmd0aCArICcgYXJndW1lbnRzLiAnICtcbiAgICAgICAgICAgICdBIGNvbW1vbiBtaXN0YWtlIGlzIHRvIHdyaXRlIG9uZU9mKHgsIHksIHopIGluc3RlYWQgb2Ygb25lT2YoW3gsIHksIHpdKS4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmludFdhcm5pbmcoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGFycmF5LicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZW1wdHlGdW5jdGlvblRoYXRSZXR1cm5zTnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcywgZnVuY3Rpb24gcmVwbGFjZXIoa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHZhbHVlIGAnICsgU3RyaW5nKHByb3BWYWx1ZSkgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgb2JqZWN0T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gb2JqZWN0LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKGhhcyhwcm9wVmFsdWUsIGtleSkpIHtcbiAgICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGtleSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICcuJyArIGtleSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIoYXJyYXlPZlR5cGVDaGVja2Vycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHByaW50V2FybmluZygnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb25UaGF0UmV0dXJuc051bGw7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJpbnRXYXJuaW5nKFxuICAgICAgICAgICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mVHlwZS4gRXhwZWN0ZWQgYW4gYXJyYXkgb2YgY2hlY2sgZnVuY3Rpb25zLCBidXQgJyArXG4gICAgICAgICAgJ3JlY2VpdmVkICcgKyBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcoY2hlY2tlcikgKyAnIGF0IGluZGV4ICcgKyBpICsgJy4nXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uVGhhdFJldHVybnNOdWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZUNoZWNrZXIoKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICBpZiAoIWlzTm9kZShwcm9wc1twcm9wTmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgUmVhY3ROb2RlLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2hhcGVUeXBlQ2hlY2tlcihzaGFwZVR5cGVzKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVN0cmljdFNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgYWxsIGtleXMgaW4gY2FzZSBzb21lIGFyZSByZXF1aXJlZCBidXQgbWlzc2luZyBmcm9tXG4gICAgICAvLyBwcm9wcy5cbiAgICAgIHZhciBhbGxLZXlzID0gYXNzaWduKHt9LCBwcm9wc1twcm9wTmFtZV0sIHNoYXBlVHlwZXMpO1xuICAgICAgZm9yICh2YXIga2V5IGluIGFsbEtleXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcihcbiAgICAgICAgICAgICdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBrZXkgYCcgKyBrZXkgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nICtcbiAgICAgICAgICAgICdcXG5CYWQgb2JqZWN0OiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcHNbcHJvcE5hbWVdLCBudWxsLCAnICAnKSArXG4gICAgICAgICAgICAnXFxuVmFsaWQga2V5czogJyArICBKU09OLnN0cmluZ2lmeShPYmplY3Qua2V5cyhzaGFwZVR5cGVzKSwgbnVsbCwgJyAgJylcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBpc1ZhbGlkRWxlbWVudChwcm9wVmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4ocHJvcFZhbHVlKTtcbiAgICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYXRvckZuLmNhbGwocHJvcFZhbHVlKTtcbiAgICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSXRlcmF0b3Igd2lsbCBwcm92aWRlIGVudHJ5IFtrLHZdIHR1cGxlcyByYXRoZXIgdGhhbiB2YWx1ZXMuXG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNOb2RlKGVudHJ5WzFdKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSB7XG4gICAgLy8gTmF0aXZlIFN5bWJvbC5cbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBmYWxzeSB2YWx1ZSBjYW4ndCBiZSBhIFN5bWJvbFxuICAgIGlmICghcHJvcFZhbHVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXSA9PT0gJ1N5bWJvbCdcbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgcHJvcFZhbHVlIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIC8vIE9sZCB3ZWJraXRzIChhdCBsZWFzdCB1bnRpbCBBbmRyb2lkIDQuMCkgcmV0dXJuICdmdW5jdGlvbicgcmF0aGVyIHRoYW5cbiAgICAgIC8vICdvYmplY3QnIGZvciB0eXBlb2YgYSBSZWdFeHAuIFdlJ2xsIG5vcm1hbGl6ZSB0aGlzIGhlcmUgc28gdGhhdCAvYmxhL1xuICAgICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgICByZXR1cm4gJ29iamVjdCc7XG4gICAgfVxuICAgIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIH1cbiAgICByZXR1cm4gcHJvcFR5cGU7XG4gIH1cblxuICAvLyBUaGlzIGhhbmRsZXMgbW9yZSB0eXBlcyB0aGFuIGBnZXRQcm9wVHlwZWAuIE9ubHkgdXNlZCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gIC8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuICBmdW5jdGlvbiBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHByb3BWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvcFZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJycgKyBwcm9wVmFsdWU7XG4gICAgfVxuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIHBvc3RmaXhlZCB0byBhIHdhcm5pbmcgYWJvdXQgYW4gaW52YWxpZCB0eXBlLlxuICAvLyBGb3IgZXhhbXBsZSwgXCJ1bmRlZmluZWRcIiBvciBcIm9mIHR5cGUgYXJyYXlcIlxuICBmdW5jdGlvbiBnZXRQb3N0Zml4Rm9yVHlwZVdhcm5pbmcodmFsdWUpIHtcbiAgICB2YXIgdHlwZSA9IGdldFByZWNpc2VUeXBlKHZhbHVlKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIHJldHVybiAnYW4gJyArIHR5cGU7XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAncmVnZXhwJzpcbiAgICAgICAgcmV0dXJuICdhICcgKyB0eXBlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0dXJucyBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QsIGlmIGFueS5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBjaGVja1Byb3BUeXBlcztcbiAgUmVhY3RQcm9wVHlwZXMucmVzZXRXYXJuaW5nQ2FjaGUgPSBjaGVja1Byb3BUeXBlcy5yZXNldFdhcm5pbmdDYWNoZTtcbiAgUmVhY3RQcm9wVHlwZXMuUHJvcFR5cGVzID0gUmVhY3RQcm9wVHlwZXM7XG5cbiAgcmV0dXJuIFJlYWN0UHJvcFR5cGVzO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xuXG5mdW5jdGlvbiBlbXB0eUZ1bmN0aW9uKCkge31cbmZ1bmN0aW9uIGVtcHR5RnVuY3Rpb25XaXRoUmVzZXQoKSB7fVxuZW1wdHlGdW5jdGlvbldpdGhSZXNldC5yZXNldFdhcm5pbmdDYWNoZSA9IGVtcHR5RnVuY3Rpb247XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHNoaW0ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICBpZiAoc2VjcmV0ID09PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgLy8gSXQgaXMgc3RpbGwgc2FmZSB3aGVuIGNhbGxlZCBmcm9tIFJlYWN0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKFxuICAgICAgJ0NhbGxpbmcgUHJvcFR5cGVzIHZhbGlkYXRvcnMgZGlyZWN0bHkgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYHByb3AtdHlwZXNgIHBhY2thZ2UuICcgK1xuICAgICAgJ1VzZSBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKSB0byBjYWxsIHRoZW0uICcgK1xuICAgICAgJ1JlYWQgbW9yZSBhdCBodHRwOi8vZmIubWUvdXNlLWNoZWNrLXByb3AtdHlwZXMnXG4gICAgKTtcbiAgICBlcnIubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB0aHJvdyBlcnI7XG4gIH07XG4gIHNoaW0uaXNSZXF1aXJlZCA9IHNoaW07XG4gIGZ1bmN0aW9uIGdldFNoaW0oKSB7XG4gICAgcmV0dXJuIHNoaW07XG4gIH07XG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogc2hpbSxcbiAgICBib29sOiBzaGltLFxuICAgIGZ1bmM6IHNoaW0sXG4gICAgbnVtYmVyOiBzaGltLFxuICAgIG9iamVjdDogc2hpbSxcbiAgICBzdHJpbmc6IHNoaW0sXG4gICAgc3ltYm9sOiBzaGltLFxuXG4gICAgYW55OiBzaGltLFxuICAgIGFycmF5T2Y6IGdldFNoaW0sXG4gICAgZWxlbWVudDogc2hpbSxcbiAgICBlbGVtZW50VHlwZTogc2hpbSxcbiAgICBpbnN0YW5jZU9mOiBnZXRTaGltLFxuICAgIG5vZGU6IHNoaW0sXG4gICAgb2JqZWN0T2Y6IGdldFNoaW0sXG4gICAgb25lT2Y6IGdldFNoaW0sXG4gICAgb25lT2ZUeXBlOiBnZXRTaGltLFxuICAgIHNoYXBlOiBnZXRTaGltLFxuICAgIGV4YWN0OiBnZXRTaGltLFxuXG4gICAgY2hlY2tQcm9wVHlwZXM6IGVtcHR5RnVuY3Rpb25XaXRoUmVzZXQsXG4gICAgcmVzZXRXYXJuaW5nQ2FjaGU6IGVtcHR5RnVuY3Rpb25cbiAgfTtcblxuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUmVhY3RJcyA9IHJlcXVpcmUoJ3JlYWN0LWlzJyk7XG5cbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgZGV2ZWxvcG1lbnQgYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgdmFyIHRocm93T25EaXJlY3RBY2Nlc3MgPSB0cnVlO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMnKShSZWFjdElzLmlzRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59IGVsc2Uge1xuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBwcm9kdWN0aW9uIGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMnKSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG5mdW5jdGlvbiBtZW1vaXplKGZuKSB7XG4gIHZhciBjYWNoZSA9IHt9O1xuICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuICAgIGlmIChjYWNoZVthcmddID09PSB1bmRlZmluZWQpIGNhY2hlW2FyZ10gPSBmbihhcmcpO1xuICAgIHJldHVybiBjYWNoZVthcmddO1xuICB9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSBtZW1vaXplO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcERlZmF1bHQgKGV4KSB7IHJldHVybiAoZXggJiYgKHR5cGVvZiBleCA9PT0gJ29iamVjdCcpICYmICdkZWZhdWx0JyBpbiBleCkgPyBleFsnZGVmYXVsdCddIDogZXg7IH1cblxudmFyIG1lbW9pemUgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnQGVtb3Rpb24vbWVtb2l6ZScpKTtcblxudmFyIHJlYWN0UHJvcHNSZWdleCA9IC9eKChjaGlsZHJlbnxkYW5nZXJvdXNseVNldElubmVySFRNTHxrZXl8cmVmfGF1dG9Gb2N1c3xkZWZhdWx0VmFsdWV8ZGVmYXVsdENoZWNrZWR8aW5uZXJIVE1MfHN1cHByZXNzQ29udGVudEVkaXRhYmxlV2FybmluZ3xzdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmd8dmFsdWVMaW5rfGFjY2VwdHxhY2NlcHRDaGFyc2V0fGFjY2Vzc0tleXxhY3Rpb258YWxsb3d8YWxsb3dVc2VyTWVkaWF8YWxsb3dQYXltZW50UmVxdWVzdHxhbGxvd0Z1bGxTY3JlZW58YWxsb3dUcmFuc3BhcmVuY3l8YWx0fGFzeW5jfGF1dG9Db21wbGV0ZXxhdXRvUGxheXxjYXB0dXJlfGNlbGxQYWRkaW5nfGNlbGxTcGFjaW5nfGNoYWxsZW5nZXxjaGFyU2V0fGNoZWNrZWR8Y2l0ZXxjbGFzc0lEfGNsYXNzTmFtZXxjb2xzfGNvbFNwYW58Y29udGVudHxjb250ZW50RWRpdGFibGV8Y29udGV4dE1lbnV8Y29udHJvbHN8Y29udHJvbHNMaXN0fGNvb3Jkc3xjcm9zc09yaWdpbnxkYXRhfGRhdGVUaW1lfGRlY29kaW5nfGRlZmF1bHR8ZGVmZXJ8ZGlyfGRpc2FibGVkfGRpc2FibGVQaWN0dXJlSW5QaWN0dXJlfGRvd25sb2FkfGRyYWdnYWJsZXxlbmNUeXBlfGZvcm18Zm9ybUFjdGlvbnxmb3JtRW5jVHlwZXxmb3JtTWV0aG9kfGZvcm1Ob1ZhbGlkYXRlfGZvcm1UYXJnZXR8ZnJhbWVCb3JkZXJ8aGVhZGVyc3xoZWlnaHR8aGlkZGVufGhpZ2h8aHJlZnxocmVmTGFuZ3xodG1sRm9yfGh0dHBFcXVpdnxpZHxpbnB1dE1vZGV8aW50ZWdyaXR5fGlzfGtleVBhcmFtc3xrZXlUeXBlfGtpbmR8bGFiZWx8bGFuZ3xsaXN0fGxvYWRpbmd8bG9vcHxsb3d8bWFyZ2luSGVpZ2h0fG1hcmdpbldpZHRofG1heHxtYXhMZW5ndGh8bWVkaWF8bWVkaWFHcm91cHxtZXRob2R8bWlufG1pbkxlbmd0aHxtdWx0aXBsZXxtdXRlZHxuYW1lfG5vbmNlfG5vVmFsaWRhdGV8b3BlbnxvcHRpbXVtfHBhdHRlcm58cGxhY2Vob2xkZXJ8cGxheXNJbmxpbmV8cG9zdGVyfHByZWxvYWR8cHJvZmlsZXxyYWRpb0dyb3VwfHJlYWRPbmx5fHJlZmVycmVyUG9saWN5fHJlbHxyZXF1aXJlZHxyZXZlcnNlZHxyb2xlfHJvd3N8cm93U3BhbnxzYW5kYm94fHNjb3BlfHNjb3BlZHxzY3JvbGxpbmd8c2VhbWxlc3N8c2VsZWN0ZWR8c2hhcGV8c2l6ZXxzaXplc3xzbG90fHNwYW58c3BlbGxDaGVja3xzcmN8c3JjRG9jfHNyY0xhbmd8c3JjU2V0fHN0YXJ0fHN0ZXB8c3R5bGV8c3VtbWFyeXx0YWJJbmRleHx0YXJnZXR8dGl0bGV8dHlwZXx1c2VNYXB8dmFsdWV8d2lkdGh8d21vZGV8d3JhcHxhYm91dHxkYXRhdHlwZXxpbmxpc3R8cHJlZml4fHByb3BlcnR5fHJlc291cmNlfHR5cGVvZnx2b2NhYnxhdXRvQ2FwaXRhbGl6ZXxhdXRvQ29ycmVjdHxhdXRvU2F2ZXxjb2xvcnxpbmVydHxpdGVtUHJvcHxpdGVtU2NvcGV8aXRlbVR5cGV8aXRlbUlEfGl0ZW1SZWZ8b258cmVzdWx0c3xzZWN1cml0eXx1bnNlbGVjdGFibGV8YWNjZW50SGVpZ2h0fGFjY3VtdWxhdGV8YWRkaXRpdmV8YWxpZ25tZW50QmFzZWxpbmV8YWxsb3dSZW9yZGVyfGFscGhhYmV0aWN8YW1wbGl0dWRlfGFyYWJpY0Zvcm18YXNjZW50fGF0dHJpYnV0ZU5hbWV8YXR0cmlidXRlVHlwZXxhdXRvUmV2ZXJzZXxhemltdXRofGJhc2VGcmVxdWVuY3l8YmFzZWxpbmVTaGlmdHxiYXNlUHJvZmlsZXxiYm94fGJlZ2lufGJpYXN8Ynl8Y2FsY01vZGV8Y2FwSGVpZ2h0fGNsaXB8Y2xpcFBhdGhVbml0c3xjbGlwUGF0aHxjbGlwUnVsZXxjb2xvckludGVycG9sYXRpb258Y29sb3JJbnRlcnBvbGF0aW9uRmlsdGVyc3xjb2xvclByb2ZpbGV8Y29sb3JSZW5kZXJpbmd8Y29udGVudFNjcmlwdFR5cGV8Y29udGVudFN0eWxlVHlwZXxjdXJzb3J8Y3h8Y3l8ZHxkZWNlbGVyYXRlfGRlc2NlbnR8ZGlmZnVzZUNvbnN0YW50fGRpcmVjdGlvbnxkaXNwbGF5fGRpdmlzb3J8ZG9taW5hbnRCYXNlbGluZXxkdXJ8ZHh8ZHl8ZWRnZU1vZGV8ZWxldmF0aW9ufGVuYWJsZUJhY2tncm91bmR8ZW5kfGV4cG9uZW50fGV4dGVybmFsUmVzb3VyY2VzUmVxdWlyZWR8ZmlsbHxmaWxsT3BhY2l0eXxmaWxsUnVsZXxmaWx0ZXJ8ZmlsdGVyUmVzfGZpbHRlclVuaXRzfGZsb29kQ29sb3J8Zmxvb2RPcGFjaXR5fGZvY3VzYWJsZXxmb250RmFtaWx5fGZvbnRTaXplfGZvbnRTaXplQWRqdXN0fGZvbnRTdHJldGNofGZvbnRTdHlsZXxmb250VmFyaWFudHxmb250V2VpZ2h0fGZvcm1hdHxmcm9tfGZyfGZ4fGZ5fGcxfGcyfGdseXBoTmFtZXxnbHlwaE9yaWVudGF0aW9uSG9yaXpvbnRhbHxnbHlwaE9yaWVudGF0aW9uVmVydGljYWx8Z2x5cGhSZWZ8Z3JhZGllbnRUcmFuc2Zvcm18Z3JhZGllbnRVbml0c3xoYW5naW5nfGhvcml6QWR2WHxob3Jpek9yaWdpblh8aWRlb2dyYXBoaWN8aW1hZ2VSZW5kZXJpbmd8aW58aW4yfGludGVyY2VwdHxrfGsxfGsyfGszfGs0fGtlcm5lbE1hdHJpeHxrZXJuZWxVbml0TGVuZ3RofGtlcm5pbmd8a2V5UG9pbnRzfGtleVNwbGluZXN8a2V5VGltZXN8bGVuZ3RoQWRqdXN0fGxldHRlclNwYWNpbmd8bGlnaHRpbmdDb2xvcnxsaW1pdGluZ0NvbmVBbmdsZXxsb2NhbHxtYXJrZXJFbmR8bWFya2VyTWlkfG1hcmtlclN0YXJ0fG1hcmtlckhlaWdodHxtYXJrZXJVbml0c3xtYXJrZXJXaWR0aHxtYXNrfG1hc2tDb250ZW50VW5pdHN8bWFza1VuaXRzfG1hdGhlbWF0aWNhbHxtb2RlfG51bU9jdGF2ZXN8b2Zmc2V0fG9wYWNpdHl8b3BlcmF0b3J8b3JkZXJ8b3JpZW50fG9yaWVudGF0aW9ufG9yaWdpbnxvdmVyZmxvd3xvdmVybGluZVBvc2l0aW9ufG92ZXJsaW5lVGhpY2tuZXNzfHBhbm9zZTF8cGFpbnRPcmRlcnxwYXRoTGVuZ3RofHBhdHRlcm5Db250ZW50VW5pdHN8cGF0dGVyblRyYW5zZm9ybXxwYXR0ZXJuVW5pdHN8cG9pbnRlckV2ZW50c3xwb2ludHN8cG9pbnRzQXRYfHBvaW50c0F0WXxwb2ludHNBdFp8cHJlc2VydmVBbHBoYXxwcmVzZXJ2ZUFzcGVjdFJhdGlvfHByaW1pdGl2ZVVuaXRzfHJ8cmFkaXVzfHJlZlh8cmVmWXxyZW5kZXJpbmdJbnRlbnR8cmVwZWF0Q291bnR8cmVwZWF0RHVyfHJlcXVpcmVkRXh0ZW5zaW9uc3xyZXF1aXJlZEZlYXR1cmVzfHJlc3RhcnR8cmVzdWx0fHJvdGF0ZXxyeHxyeXxzY2FsZXxzZWVkfHNoYXBlUmVuZGVyaW5nfHNsb3BlfHNwYWNpbmd8c3BlY3VsYXJDb25zdGFudHxzcGVjdWxhckV4cG9uZW50fHNwZWVkfHNwcmVhZE1ldGhvZHxzdGFydE9mZnNldHxzdGREZXZpYXRpb258c3RlbWh8c3RlbXZ8c3RpdGNoVGlsZXN8c3RvcENvbG9yfHN0b3BPcGFjaXR5fHN0cmlrZXRocm91Z2hQb3NpdGlvbnxzdHJpa2V0aHJvdWdoVGhpY2tuZXNzfHN0cmluZ3xzdHJva2V8c3Ryb2tlRGFzaGFycmF5fHN0cm9rZURhc2hvZmZzZXR8c3Ryb2tlTGluZWNhcHxzdHJva2VMaW5lam9pbnxzdHJva2VNaXRlcmxpbWl0fHN0cm9rZU9wYWNpdHl8c3Ryb2tlV2lkdGh8c3VyZmFjZVNjYWxlfHN5c3RlbUxhbmd1YWdlfHRhYmxlVmFsdWVzfHRhcmdldFh8dGFyZ2V0WXx0ZXh0QW5jaG9yfHRleHREZWNvcmF0aW9ufHRleHRSZW5kZXJpbmd8dGV4dExlbmd0aHx0b3x0cmFuc2Zvcm18dTF8dTJ8dW5kZXJsaW5lUG9zaXRpb258dW5kZXJsaW5lVGhpY2tuZXNzfHVuaWNvZGV8dW5pY29kZUJpZGl8dW5pY29kZVJhbmdlfHVuaXRzUGVyRW18dkFscGhhYmV0aWN8dkhhbmdpbmd8dklkZW9ncmFwaGljfHZNYXRoZW1hdGljYWx8dmFsdWVzfHZlY3RvckVmZmVjdHx2ZXJzaW9ufHZlcnRBZHZZfHZlcnRPcmlnaW5YfHZlcnRPcmlnaW5ZfHZpZXdCb3h8dmlld1RhcmdldHx2aXNpYmlsaXR5fHdpZHRoc3x3b3JkU3BhY2luZ3x3cml0aW5nTW9kZXx4fHhIZWlnaHR8eDF8eDJ8eENoYW5uZWxTZWxlY3Rvcnx4bGlua0FjdHVhdGV8eGxpbmtBcmNyb2xlfHhsaW5rSHJlZnx4bGlua1JvbGV8eGxpbmtTaG93fHhsaW5rVGl0bGV8eGxpbmtUeXBlfHhtbEJhc2V8eG1sbnN8eG1sbnNYbGlua3x4bWxMYW5nfHhtbFNwYWNlfHl8eTF8eTJ8eUNoYW5uZWxTZWxlY3Rvcnx6fHpvb21BbmRQYW58Zm9yfGNsYXNzfGF1dG9mb2N1cyl8KChbRGRdW0FhXVtUdF1bQWFdfFtBYV1bUnJdW0lpXVtBYV18eCktLiopKSQvOyAvLyBodHRwczovL2VzYmVuY2guY29tL2JlbmNoLzViZmVlNjhhNGNkN2U2MDA5ZWY2MWQyM1xuXG52YXIgaW5kZXggPSBtZW1vaXplKGZ1bmN0aW9uIChwcm9wKSB7XG4gIHJldHVybiByZWFjdFByb3BzUmVnZXgudGVzdChwcm9wKSB8fCBwcm9wLmNoYXJDb2RlQXQoMCkgPT09IDExMVxuICAvKiBvICovXG4gICYmIHByb3AuY2hhckNvZGVBdCgxKSA9PT0gMTEwXG4gIC8qIG4gKi9cbiAgJiYgcHJvcC5jaGFyQ29kZUF0KDIpIDwgOTE7XG59XG4vKiBaKzEgKi9cbik7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGluZGV4O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG4vKipcclxuICogUmV0dXJucyB0aGUgb2JqZWN0IHR5cGUgb2YgdGhlIGdpdmVuIHBheWxvYWRcclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRUeXBlKHBheWxvYWQpIHtcclxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocGF5bG9hZCkuc2xpY2UoOCwgLTEpO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgdW5kZWZpbmVkXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7cGF5bG9hZCBpcyB1bmRlZmluZWR9XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShwYXlsb2FkKSA9PT0gJ1VuZGVmaW5lZCc7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBudWxsXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7cGF5bG9hZCBpcyBudWxsfVxyXG4gKi9cclxuZnVuY3Rpb24gaXNOdWxsKHBheWxvYWQpIHtcclxuICAgIHJldHVybiBnZXRUeXBlKHBheWxvYWQpID09PSAnTnVsbCc7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0IChleGNsdWRpbmcgc3BlY2lhbCBjbGFzc2VzIG9yIG9iamVjdHMgd2l0aCBvdGhlciBwcm90b3R5cGVzKVxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHBheWxvYWRcclxuICogQHJldHVybnMge3BheWxvYWQgaXMgUmVjb3JkPHN0cmluZywgYW55Pn1cclxuICovXHJcbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QocGF5bG9hZCkge1xyXG4gICAgaWYgKGdldFR5cGUocGF5bG9hZCkgIT09ICdPYmplY3QnKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIHJldHVybiBwYXlsb2FkLmNvbnN0cnVjdG9yID09PSBPYmplY3QgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKHBheWxvYWQpID09PSBPYmplY3QucHJvdG90eXBlO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCAoZXhjbHVkaW5nIHNwZWNpYWwgY2xhc3NlcyBvciBvYmplY3RzIHdpdGggb3RoZXIgcHJvdG90eXBlcylcclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIFJlY29yZDxzdHJpbmcsIGFueT59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc09iamVjdChwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gaXNQbGFpbk9iamVjdChwYXlsb2FkKTtcclxufVxyXG4vKipcclxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGEgYW4gZW1wdHkgb2JqZWN0IChleGNsdWRpbmcgc3BlY2lhbCBjbGFzc2VzIG9yIG9iamVjdHMgd2l0aCBvdGhlciBwcm90b3R5cGVzKVxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHBheWxvYWRcclxuICogQHJldHVybnMge3BheWxvYWQgaXMgeyBbSyBpbiBhbnldOiBuZXZlciB9fVxyXG4gKi9cclxuZnVuY3Rpb24gaXNFbXB0eU9iamVjdChwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gaXNQbGFpbk9iamVjdChwYXlsb2FkKSAmJiBPYmplY3Qua2V5cyhwYXlsb2FkKS5sZW5ndGggPT09IDA7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhbiBhbnkga2luZCBvZiBvYmplY3QgKGluY2x1ZGluZyBzcGVjaWFsIGNsYXNzZXMgb3Igb2JqZWN0cyB3aXRoIGRpZmZlcmVudCBwcm90b3R5cGVzKVxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHBheWxvYWRcclxuICogQHJldHVybnMge3BheWxvYWQgaXMgUmVjb3JkPHN0cmluZywgYW55Pn1cclxuICovXHJcbmZ1bmN0aW9uIGlzQW55T2JqZWN0KHBheWxvYWQpIHtcclxuICAgIHJldHVybiBnZXRUeXBlKHBheWxvYWQpID09PSAnT2JqZWN0JztcclxufVxyXG4vKipcclxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIG9iamVjdCBsaWtlIGEgdHlwZSBwYXNzZWQgaW4gPCA+XHJcbiAqXHJcbiAqIFVzYWdlOiBpc09iamVjdExpa2U8e2lkOiBhbnl9PihwYXlsb2FkKSAvLyB3aWxsIG1ha2Ugc3VyZSBpdCdzIGFuIG9iamVjdCBhbmQgaGFzIGFuIGBpZGAgcHJvcC5cclxuICpcclxuICogQHRlbXBsYXRlIFQgdGhpcyBtdXN0IGJlIHBhc3NlZCBpbiA8ID5cclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIFR9XHJcbiAqL1xyXG5mdW5jdGlvbiBpc09iamVjdExpa2UocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGlzQW55T2JqZWN0KHBheWxvYWQpO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYSBmdW5jdGlvbiAocmVndWxhciBvciBhc3luYylcclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIEFueUZ1bmN0aW9ufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNGdW5jdGlvbihwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHBheWxvYWQgPT09IFwiZnVuY3Rpb25cIjtcclxufVxyXG4vKipcclxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGFycmF5XHJcbiAqXHJcbiAqIEBwYXJhbSB7YW55fSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIGFueVtdfVxyXG4gKi9cclxuZnVuY3Rpb24gaXNBcnJheShwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShwYXlsb2FkKSA9PT0gJ0FycmF5JztcclxufVxyXG4vKipcclxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGEgYW4gYXJyYXkgd2l0aCBhdCBsZWFzdCAxIGl0ZW1cclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIGFueVtdfVxyXG4gKi9cclxuZnVuY3Rpb24gaXNGdWxsQXJyYXkocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGlzQXJyYXkocGF5bG9hZCkgJiYgcGF5bG9hZC5sZW5ndGggPiAwO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYSBhbiBlbXB0eSBhcnJheVxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHBheWxvYWRcclxuICogQHJldHVybnMge3BheWxvYWQgaXMgW119XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5QXJyYXkocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGlzQXJyYXkocGF5bG9hZCkgJiYgcGF5bG9hZC5sZW5ndGggPT09IDA7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhIHN0cmluZ1xyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHBheWxvYWRcclxuICogQHJldHVybnMge3BheWxvYWQgaXMgc3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gaXNTdHJpbmcocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGdldFR5cGUocGF5bG9hZCkgPT09ICdTdHJpbmcnO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYSBzdHJpbmcsIEJVVCByZXR1cm5zIGZhbHNlIGZvciAnJ1xyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHBheWxvYWRcclxuICogQHJldHVybnMge3BheWxvYWQgaXMgc3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gaXNGdWxsU3RyaW5nKHBheWxvYWQpIHtcclxuICAgIHJldHVybiBpc1N0cmluZyhwYXlsb2FkKSAmJiBwYXlsb2FkICE9PSAnJztcclxufVxyXG4vKipcclxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzICcnXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7cGF5bG9hZCBpcyBzdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0VtcHR5U3RyaW5nKHBheWxvYWQpIHtcclxuICAgIHJldHVybiBwYXlsb2FkID09PSAnJztcclxufVxyXG4vKipcclxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGEgbnVtYmVyIChidXQgbm90IE5hTilcclxuICpcclxuICogVGhpcyB3aWxsIHJldHVybiBgZmFsc2VgIGZvciBgTmFOYCEhXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7cGF5bG9hZCBpcyBudW1iZXJ9XHJcbiAqL1xyXG5mdW5jdGlvbiBpc051bWJlcihwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShwYXlsb2FkKSA9PT0gJ051bWJlcicgJiYgIWlzTmFOKHBheWxvYWQpO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYSBib29sZWFuXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7cGF5bG9hZCBpcyBib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNCb29sZWFuKHBheWxvYWQpIHtcclxuICAgIHJldHVybiBnZXRUeXBlKHBheWxvYWQpID09PSAnQm9vbGVhbic7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiAoUmVnRXhwKVxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHBheWxvYWRcclxuICogQHJldHVybnMge3BheWxvYWQgaXMgUmVnRXhwfVxyXG4gKi9cclxuZnVuY3Rpb24gaXNSZWdFeHAocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGdldFR5cGUocGF5bG9hZCkgPT09ICdSZWdFeHAnO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYSBNYXBcclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIE1hcDxhbnksIGFueT59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc01hcChwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShwYXlsb2FkKSA9PT0gJ01hcCc7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhIFdlYWtNYXBcclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIFdlYWtNYXA8YW55LCBhbnk+fVxyXG4gKi9cclxuZnVuY3Rpb24gaXNXZWFrTWFwKHBheWxvYWQpIHtcclxuICAgIHJldHVybiBnZXRUeXBlKHBheWxvYWQpID09PSAnV2Vha01hcCc7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhIFNldFxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHBheWxvYWRcclxuICogQHJldHVybnMge3BheWxvYWQgaXMgU2V0PGFueT59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1NldChwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShwYXlsb2FkKSA9PT0gJ1NldCc7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhIFdlYWtTZXRcclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIFdlYWtTZXQ8YW55Pn1cclxuICovXHJcbmZ1bmN0aW9uIGlzV2Vha1NldChwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShwYXlsb2FkKSA9PT0gJ1dlYWtTZXQnO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYSBTeW1ib2xcclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIHN5bWJvbH1cclxuICovXHJcbmZ1bmN0aW9uIGlzU3ltYm9sKHBheWxvYWQpIHtcclxuICAgIHJldHVybiBnZXRUeXBlKHBheWxvYWQpID09PSAnU3ltYm9sJztcclxufVxyXG4vKipcclxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGEgRGF0ZSwgYW5kIHRoYXQgdGhlIGRhdGUgaXMgdmFsaWRcclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIERhdGV9XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0RhdGUocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGdldFR5cGUocGF5bG9hZCkgPT09ICdEYXRlJyAmJiAhaXNOYU4ocGF5bG9hZCk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhIEJsb2JcclxuICpcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEByZXR1cm5zIHtwYXlsb2FkIGlzIEJsb2J9XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Jsb2IocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGdldFR5cGUocGF5bG9hZCkgPT09ICdCbG9iJztcclxufVxyXG4vKipcclxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGEgRmlsZVxyXG4gKlxyXG4gKiBAcGFyYW0geyp9IHBheWxvYWRcclxuICogQHJldHVybnMge3BheWxvYWQgaXMgRmlsZX1cclxuICovXHJcbmZ1bmN0aW9uIGlzRmlsZShwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShwYXlsb2FkKSA9PT0gJ0ZpbGUnO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHBheWxvYWQgaXMgYSBQcm9taXNlXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7cGF5bG9hZCBpcyBQcm9taXNlPGFueT59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc1Byb21pc2UocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGdldFR5cGUocGF5bG9hZCkgPT09ICdQcm9taXNlJztcclxufVxyXG4vKipcclxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIEVycm9yXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7cGF5bG9hZCBpcyBFcnJvcn1cclxuICovXHJcbmZ1bmN0aW9uIGlzRXJyb3IocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIGdldFR5cGUocGF5bG9hZCkgPT09ICdFcnJvcic7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBsaXRlcmFsbHkgdGhlIHZhbHVlIGBOYU5gIChpdCdzIGBOYU5gIGFuZCBhbHNvIGEgYG51bWJlcmApXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7cGF5bG9hZCBpcyB0eXBlb2YgTmFOfVxyXG4gKi9cclxuZnVuY3Rpb24gaXNOYU5WYWx1ZShwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gZ2V0VHlwZShwYXlsb2FkKSA9PT0gJ051bWJlcicgJiYgaXNOYU4ocGF5bG9hZCk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgd2hldGhlciB0aGUgcGF5bG9hZCBpcyBhIHByaW1pdGl2ZSB0eXBlIChlZy4gQm9vbGVhbiB8IE51bGwgfCBVbmRlZmluZWQgfCBOdW1iZXIgfCBTdHJpbmcgfCBTeW1ib2wpXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7KHBheWxvYWQgaXMgYm9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWQgfCBudW1iZXIgfCBzdHJpbmcgfCBzeW1ib2wpfVxyXG4gKi9cclxuZnVuY3Rpb24gaXNQcmltaXRpdmUocGF5bG9hZCkge1xyXG4gICAgcmV0dXJuIChpc0Jvb2xlYW4ocGF5bG9hZCkgfHxcclxuICAgICAgICBpc051bGwocGF5bG9hZCkgfHxcclxuICAgICAgICBpc1VuZGVmaW5lZChwYXlsb2FkKSB8fFxyXG4gICAgICAgIGlzTnVtYmVyKHBheWxvYWQpIHx8XHJcbiAgICAgICAgaXNTdHJpbmcocGF5bG9hZCkgfHxcclxuICAgICAgICBpc1N5bWJvbChwYXlsb2FkKSk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIG51bGwgb3IgdW5kZWZpbmVkXHJcbiAqXHJcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZFxyXG4gKiBAcmV0dXJucyB7KHBheWxvYWQgaXMgbnVsbCB8IHVuZGVmaW5lZCl9XHJcbiAqL1xyXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChwYXlsb2FkKSB7XHJcbiAgICByZXR1cm4gaXNOdWxsKHBheWxvYWQpIHx8IGlzVW5kZWZpbmVkKHBheWxvYWQpO1xyXG59XHJcbi8qKlxyXG4gKiBEb2VzIGEgZ2VuZXJpYyBjaGVjayB0byBjaGVjayB0aGF0IHRoZSBnaXZlbiBwYXlsb2FkIGlzIG9mIGEgZ2l2ZW4gdHlwZS5cclxuICogSW4gY2FzZXMgbGlrZSBOdW1iZXIsIGl0IHdpbGwgcmV0dXJuIHRydWUgZm9yIE5hTiBhcyBOYU4gaXMgYSBOdW1iZXIgKHRoYW5rcyBqYXZhc2NyaXB0ISk7XHJcbiAqIEl0IHdpbGwsIGhvd2V2ZXIsIGRpZmZlcmVudGlhdGUgYmV0d2VlbiBvYmplY3QgYW5kIG51bGxcclxuICpcclxuICogQHRlbXBsYXRlIFRcclxuICogQHBhcmFtIHsqfSBwYXlsb2FkXHJcbiAqIEBwYXJhbSB7VH0gdHlwZVxyXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IFdpbGwgdGhyb3cgdHlwZSBlcnJvciBpZiB0eXBlIGlzIGFuIGludmFsaWQgdHlwZVxyXG4gKiBAcmV0dXJucyB7cGF5bG9hZCBpcyBUfVxyXG4gKi9cclxuZnVuY3Rpb24gaXNUeXBlKHBheWxvYWQsIHR5cGUpIHtcclxuICAgIGlmICghKHR5cGUgaW5zdGFuY2VvZiBGdW5jdGlvbikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodHlwZSwgJ3Byb3RvdHlwZScpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZSBpcyBub3QgYSBjbGFzcycpO1xyXG4gICAgfVxyXG4gICAgLy8gQ2xhc3NlcyB1c3VhbGx5IGhhdmUgbmFtZXMgKGFzIGZ1bmN0aW9ucyB1c3VhbGx5IGhhdmUgbmFtZXMpXHJcbiAgICB2YXIgbmFtZSA9IHR5cGUubmFtZTtcclxuICAgIHJldHVybiBnZXRUeXBlKHBheWxvYWQpID09PSBuYW1lIHx8IEJvb2xlYW4ocGF5bG9hZCAmJiBwYXlsb2FkLmNvbnN0cnVjdG9yID09PSB0eXBlKTtcclxufVxuXG5leHBvcnRzLmdldFR5cGUgPSBnZXRUeXBlO1xuZXhwb3J0cy5pc0FueU9iamVjdCA9IGlzQW55T2JqZWN0O1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmV4cG9ydHMuaXNCbG9iID0gaXNCbG9iO1xuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcbmV4cG9ydHMuaXNFbXB0eUFycmF5ID0gaXNFbXB0eUFycmF5O1xuZXhwb3J0cy5pc0VtcHR5T2JqZWN0ID0gaXNFbXB0eU9iamVjdDtcbmV4cG9ydHMuaXNFbXB0eVN0cmluZyA9IGlzRW1wdHlTdHJpbmc7XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuZXhwb3J0cy5pc0ZpbGUgPSBpc0ZpbGU7XG5leHBvcnRzLmlzRnVsbEFycmF5ID0gaXNGdWxsQXJyYXk7XG5leHBvcnRzLmlzRnVsbFN0cmluZyA9IGlzRnVsbFN0cmluZztcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5leHBvcnRzLmlzTWFwID0gaXNNYXA7XG5leHBvcnRzLmlzTmFOVmFsdWUgPSBpc05hTlZhbHVlO1xuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5leHBvcnRzLmlzT2JqZWN0TGlrZSA9IGlzT2JqZWN0TGlrZTtcbmV4cG9ydHMuaXNQbGFpbk9iamVjdCA9IGlzUGxhaW5PYmplY3Q7XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5leHBvcnRzLmlzUHJvbWlzZSA9IGlzUHJvbWlzZTtcbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcbmV4cG9ydHMuaXNTZXQgPSBpc1NldDtcbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcbmV4cG9ydHMuaXNUeXBlID0gaXNUeXBlO1xuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuZXhwb3J0cy5pc1dlYWtNYXAgPSBpc1dlYWtNYXA7XG5leHBvcnRzLmlzV2Vha1NldCA9IGlzV2Vha1NldDtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIGlzV2hhdCA9IHJlcXVpcmUoJ2lzLXdoYXQnKTtcblxuLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcbmZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cblxuZnVuY3Rpb24gYXNzaWduUHJvcChjYXJyeSwga2V5LCBuZXdWYWwsIG9yaWdpbmFsT2JqZWN0KSB7XHJcbiAgICB2YXIgcHJvcFR5cGUgPSBvcmlnaW5hbE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpXHJcbiAgICAgICAgPyAnZW51bWVyYWJsZSdcclxuICAgICAgICA6ICdub25lbnVtZXJhYmxlJztcclxuICAgIGlmIChwcm9wVHlwZSA9PT0gJ2VudW1lcmFibGUnKVxyXG4gICAgICAgIGNhcnJ5W2tleV0gPSBuZXdWYWw7XHJcbiAgICBpZiAocHJvcFR5cGUgPT09ICdub25lbnVtZXJhYmxlJykge1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjYXJyeSwga2V5LCB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBuZXdWYWwsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbWVyZ2VSZWN1cnNpdmVseShvcmlnaW4sIG5ld0NvbWVyLCBleHRlbnNpb25zKSB7XHJcbiAgICAvLyB3b3JrIGRpcmVjdGx5IG9uIG5ld0NvbWVyIGlmIGl0cyBub3QgYW4gb2JqZWN0XHJcbiAgICBpZiAoIWlzV2hhdC5pc1BsYWluT2JqZWN0KG5ld0NvbWVyKSkge1xyXG4gICAgICAgIC8vIGV4dGVuZCBtZXJnZSBydWxlc1xyXG4gICAgICAgIGlmIChleHRlbnNpb25zICYmIGlzV2hhdC5pc0FycmF5KGV4dGVuc2lvbnMpKSB7XHJcbiAgICAgICAgICAgIGV4dGVuc2lvbnMuZm9yRWFjaChmdW5jdGlvbiAoZXh0ZW5kKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdDb21lciA9IGV4dGVuZChvcmlnaW4sIG5ld0NvbWVyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdDb21lcjtcclxuICAgIH1cclxuICAgIC8vIGRlZmluZSBuZXdPYmplY3QgdG8gbWVyZ2UgYWxsIHZhbHVlcyB1cG9uXHJcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XHJcbiAgICBpZiAoaXNXaGF0LmlzUGxhaW5PYmplY3Qob3JpZ2luKSkge1xyXG4gICAgICAgIHZhciBwcm9wc18xID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob3JpZ2luKTtcclxuICAgICAgICB2YXIgc3ltYm9sc18xID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvcmlnaW4pO1xyXG4gICAgICAgIG5ld09iamVjdCA9IF9fc3ByZWFkQXJyYXlzKHByb3BzXzEsIHN5bWJvbHNfMSkucmVkdWNlKGZ1bmN0aW9uIChjYXJyeSwga2V5KSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIHRhcmdldFZhbCA9IG9yaWdpbltrZXldO1xyXG4gICAgICAgICAgICBpZiAoKCFpc1doYXQuaXNTeW1ib2woa2V5KSAmJiAhT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobmV3Q29tZXIpLmluY2x1ZGVzKGtleSkpIHx8XHJcbiAgICAgICAgICAgICAgICAoaXNXaGF0LmlzU3ltYm9sKGtleSkgJiYgIU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMobmV3Q29tZXIpLmluY2x1ZGVzKGtleSkpKSB7XHJcbiAgICAgICAgICAgICAgICBhc3NpZ25Qcm9wKGNhcnJ5LCBrZXksIHRhcmdldFZhbCwgb3JpZ2luKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY2Fycnk7XHJcbiAgICAgICAgfSwge30pO1xyXG4gICAgfVxyXG4gICAgdmFyIHByb3BzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobmV3Q29tZXIpO1xyXG4gICAgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG5ld0NvbWVyKTtcclxuICAgIHZhciByZXN1bHQgPSBfX3NwcmVhZEFycmF5cyhwcm9wcywgc3ltYm9scykucmVkdWNlKGZ1bmN0aW9uIChjYXJyeSwga2V5KSB7XHJcbiAgICAgICAgLy8gcmUtZGVmaW5lIHRoZSBvcmlnaW4gYW5kIG5ld0NvbWVyIGFzIHRhcmdldFZhbCBhbmQgbmV3VmFsXHJcbiAgICAgICAgdmFyIG5ld1ZhbCA9IG5ld0NvbWVyW2tleV07XHJcbiAgICAgICAgdmFyIHRhcmdldFZhbCA9IChpc1doYXQuaXNQbGFpbk9iamVjdChvcmlnaW4pKVxyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgID8gb3JpZ2luW2tleV1cclxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgLy8gZXh0ZW5kIG1lcmdlIHJ1bGVzXHJcbiAgICAgICAgaWYgKGV4dGVuc2lvbnMgJiYgaXNXaGF0LmlzQXJyYXkoZXh0ZW5zaW9ucykpIHtcclxuICAgICAgICAgICAgZXh0ZW5zaW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChleHRlbmQpIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbCA9IGV4dGVuZCh0YXJnZXRWYWwsIG5ld1ZhbCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBXaGVuIG5ld1ZhbCBpcyBhbiBvYmplY3QgZG8gdGhlIG1lcmdlIHJlY3Vyc2l2ZWx5XHJcbiAgICAgICAgaWYgKHRhcmdldFZhbCAhPT0gdW5kZWZpbmVkICYmIGlzV2hhdC5pc1BsYWluT2JqZWN0KG5ld1ZhbCkpIHtcclxuICAgICAgICAgICAgbmV3VmFsID0gbWVyZ2VSZWN1cnNpdmVseSh0YXJnZXRWYWwsIG5ld1ZhbCwgZXh0ZW5zaW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFzc2lnblByb3AoY2FycnksIGtleSwgbmV3VmFsLCBuZXdDb21lcik7XHJcbiAgICAgICAgcmV0dXJuIGNhcnJ5O1xyXG4gICAgfSwgbmV3T2JqZWN0KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuLyoqXHJcbiAqIE1lcmdlIGFueXRoaW5nIHJlY3Vyc2l2ZWx5LlxyXG4gKiBPYmplY3RzIGdldCBtZXJnZWQsIHNwZWNpYWwgb2JqZWN0cyAoY2xhc3NlcyBldGMuKSBhcmUgcmUtYXNzaWduZWQgXCJhcyBpc1wiLlxyXG4gKiBCYXNpYyB0eXBlcyBvdmVyd3JpdGUgb2JqZWN0cyBvciBvdGhlciBiYXNpYyB0eXBlcy5cclxuICpcclxuICogQHBhcmFtIHsoSUNvbmZpZyB8IGFueSl9IG9yaWdpblxyXG4gKiBAcGFyYW0gey4uLmFueVtdfSBuZXdDb21lcnNcclxuICogQHJldHVybnMgdGhlIHJlc3VsdFxyXG4gKi9cclxuZnVuY3Rpb24gbWVyZ2Uob3JpZ2luKSB7XHJcbiAgICB2YXIgbmV3Q29tZXJzID0gW107XHJcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgIG5ld0NvbWVyc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgIH1cclxuICAgIHZhciBleHRlbnNpb25zID0gbnVsbDtcclxuICAgIHZhciBiYXNlID0gb3JpZ2luO1xyXG4gICAgaWYgKGlzV2hhdC5pc1BsYWluT2JqZWN0KG9yaWdpbikgJiYgb3JpZ2luLmV4dGVuc2lvbnMgJiYgT2JqZWN0LmtleXMob3JpZ2luKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICBiYXNlID0ge307XHJcbiAgICAgICAgZXh0ZW5zaW9ucyA9IG9yaWdpbi5leHRlbnNpb25zO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld0NvbWVycy5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgbmV3Q29tZXIpIHtcclxuICAgICAgICByZXR1cm4gbWVyZ2VSZWN1cnNpdmVseShyZXN1bHQsIG5ld0NvbWVyLCBleHRlbnNpb25zKTtcclxuICAgIH0sIGJhc2UpO1xyXG59XG5cbmZ1bmN0aW9uIGNvbmNhdEFycmF5cyhvcmlnaW5WYWwsIG5ld1ZhbCkge1xyXG4gICAgaWYgKGlzV2hhdC5pc0FycmF5KG9yaWdpblZhbCkgJiYgaXNXaGF0LmlzQXJyYXkobmV3VmFsKSkge1xyXG4gICAgICAgIC8vIGNvbmNhdCBsb2dpY1xyXG4gICAgICAgIHJldHVybiBvcmlnaW5WYWwuY29uY2F0KG5ld1ZhbCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3VmFsOyAvLyBhbHdheXMgcmV0dXJuIG5ld1ZhbCBhcyBmYWxsYmFjayEhXHJcbn1cblxuZXhwb3J0cy5jb25jYXRBcnJheXMgPSBjb25jYXRBcnJheXM7XG5leHBvcnRzLmRlZmF1bHQgPSBtZXJnZTtcbmV4cG9ydHMubWVyZ2UgPSBtZXJnZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuZnVuY3Rpb24gX2ludGVyb3BEZWZhdWx0IChleCkgeyByZXR1cm4gKGV4ICYmICh0eXBlb2YgZXggPT09ICdvYmplY3QnKSAmJiAnZGVmYXVsdCcgaW4gZXgpID8gZXhbJ2RlZmF1bHQnXSA6IGV4OyB9XG5cbnZhciBTdHlsaXMgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnc3R5bGlzL3N0eWxpcy5taW4nKSk7XG52YXIgX2luc2VydFJ1bGVQbHVnaW4gPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnc3R5bGlzLXJ1bGUtc2hlZXQnKSk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFJlYWN0X19kZWZhdWx0ID0gX2ludGVyb3BEZWZhdWx0KFJlYWN0KTtcbnZhciB1bml0bGVzcyA9IF9pbnRlcm9wRGVmYXVsdChyZXF1aXJlKCdAZW1vdGlvbi91bml0bGVzcycpKTtcbnZhciByZWFjdElzID0gcmVxdWlyZSgncmVhY3QtaXMnKTtcbnZhciBtZW1vaXplID0gX2ludGVyb3BEZWZhdWx0KHJlcXVpcmUoJ21lbW9pemUtb25lJykpO1xudmFyIFByb3BUeXBlcyA9IF9pbnRlcm9wRGVmYXVsdChyZXF1aXJlKCdwcm9wLXR5cGVzJykpO1xudmFyIHZhbGlkQXR0ciA9IF9pbnRlcm9wRGVmYXVsdChyZXF1aXJlKCdAZW1vdGlvbi9pcy1wcm9wLXZhbGlkJykpO1xudmFyIG1lcmdlID0gX2ludGVyb3BEZWZhdWx0KHJlcXVpcmUoJ21lcmdlLWFueXRoaW5nJykpO1xuXG4vLyBcblxudmFyIGludGVybGVhdmUgPSAoZnVuY3Rpb24gKHN0cmluZ3MsIGludGVycG9sYXRpb25zKSB7XG4gIHZhciByZXN1bHQgPSBbc3RyaW5nc1swXV07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGludGVycG9sYXRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgcmVzdWx0LnB1c2goaW50ZXJwb2xhdGlvbnNbaV0sIHN0cmluZ3NbaSArIDFdKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmo7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbn07XG5cbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG52YXIgaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG52YXIgb2JqZWN0V2l0aG91dFByb3BlcnRpZXMgPSBmdW5jdGlvbiAob2JqLCBrZXlzKSB7XG4gIHZhciB0YXJnZXQgPSB7fTtcblxuICBmb3IgKHZhciBpIGluIG9iaikge1xuICAgIGlmIChrZXlzLmluZGV4T2YoaSkgPj0gMCkgY29udGludWU7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkgY29udGludWU7XG4gICAgdGFyZ2V0W2ldID0gb2JqW2ldO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbnZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG4vLyBcbnZhciBpc1BsYWluT2JqZWN0ID0gKGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiAodHlwZW9mIHggPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHgpKSA9PT0gJ29iamVjdCcgJiYgeC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xufSk7XG5cbi8vIFxudmFyIEVNUFRZX0FSUkFZID0gT2JqZWN0LmZyZWV6ZShbXSk7XG52YXIgRU1QVFlfT0JKRUNUID0gT2JqZWN0LmZyZWV6ZSh7fSk7XG5cbi8vIFxuZnVuY3Rpb24gaXNGdW5jdGlvbih0ZXN0KSB7XG4gIHJldHVybiB0eXBlb2YgdGVzdCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuLy8gXG5cbmZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWUodGFyZ2V0KSB7XG4gIHJldHVybiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnICYmIHRhcmdldCA6IGZhbHNlKSB8fCB0YXJnZXQuZGlzcGxheU5hbWUgfHwgdGFyZ2V0Lm5hbWUgfHwgJ0NvbXBvbmVudCc7XG59XG5cbi8vIFxuZnVuY3Rpb24gaXNTdGF0ZWxlc3NGdW5jdGlvbih0ZXN0KSB7XG4gIHJldHVybiB0eXBlb2YgdGVzdCA9PT0gJ2Z1bmN0aW9uJyAmJiAhKHRlc3QucHJvdG90eXBlICYmIHRlc3QucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQpO1xufVxuXG4vLyBcbmZ1bmN0aW9uIGlzU3R5bGVkQ29tcG9uZW50KHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQuc3R5bGVkQ29tcG9uZW50SWQgPT09ICdzdHJpbmcnO1xufVxuXG4vLyBcblxudmFyIFNDX0FUVFIgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgKHByb2Nlc3MuZW52LlJFQUNUX0FQUF9TQ19BVFRSIHx8IHByb2Nlc3MuZW52LlNDX0FUVFIpIHx8ICdkYXRhLXN0eWxlZCc7XG5cbnZhciBTQ19WRVJTSU9OX0FUVFIgPSAnZGF0YS1zdHlsZWQtdmVyc2lvbic7XG5cbnZhciBTQ19TVFJFQU1fQVRUUiA9ICdkYXRhLXN0eWxlZC1zdHJlYW1lZCc7XG5cbnZhciBJU19CUk9XU0VSID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgJ0hUTUxFbGVtZW50JyBpbiB3aW5kb3c7XG5cbnZhciBESVNBQkxFX1NQRUVEWSA9IHR5cGVvZiBTQ19ESVNBQkxFX1NQRUVEWSA9PT0gJ2Jvb2xlYW4nICYmIFNDX0RJU0FCTEVfU1BFRURZIHx8IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiAocHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX1NDX0RJU0FCTEVfU1BFRURZIHx8IHByb2Nlc3MuZW52LlNDX0RJU0FCTEVfU1BFRURZKSB8fCBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nO1xuXG4vLyBTaGFyZWQgZW1wdHkgZXhlY3V0aW9uIGNvbnRleHQgd2hlbiBnZW5lcmF0aW5nIHN0YXRpYyBzdHlsZXNcbnZhciBTVEFUSUNfRVhFQ1VUSU9OX0NPTlRFWFQgPSB7fTtcblxuLy8gXG5cblxuLyoqXG4gKiBQYXJzZSBlcnJvcnMubWQgYW5kIHR1cm4gaXQgaW50byBhIHNpbXBsZSBoYXNoIG9mIGNvZGU6IG1lc3NhZ2VcbiAqL1xudmFyIEVSUk9SUyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB7XG4gIFwiMVwiOiBcIkNhbm5vdCBjcmVhdGUgc3R5bGVkLWNvbXBvbmVudCBmb3IgY29tcG9uZW50OiAlcy5cXG5cXG5cIixcbiAgXCIyXCI6IFwiQ2FuJ3QgY29sbGVjdCBzdHlsZXMgb25jZSB5b3UndmUgY29uc3VtZWQgYSBgU2VydmVyU3R5bGVTaGVldGAncyBzdHlsZXMhIGBTZXJ2ZXJTdHlsZVNoZWV0YCBpcyBhIG9uZSBvZmYgaW5zdGFuY2UgZm9yIGVhY2ggc2VydmVyLXNpZGUgcmVuZGVyIGN5Y2xlLlxcblxcbi0gQXJlIHlvdSB0cnlpbmcgdG8gcmV1c2UgaXQgYWNyb3NzIHJlbmRlcnM/XFxuLSBBcmUgeW91IGFjY2lkZW50YWxseSBjYWxsaW5nIGNvbGxlY3RTdHlsZXMgdHdpY2U/XFxuXFxuXCIsXG4gIFwiM1wiOiBcIlN0cmVhbWluZyBTU1IgaXMgb25seSBzdXBwb3J0ZWQgaW4gYSBOb2RlLmpzIGVudmlyb25tZW50OyBQbGVhc2UgZG8gbm90IHRyeSB0byBjYWxsIHRoaXMgbWV0aG9kIGluIHRoZSBicm93c2VyLlxcblxcblwiLFxuICBcIjRcIjogXCJUaGUgYFN0eWxlU2hlZXRNYW5hZ2VyYCBleHBlY3RzIGEgdmFsaWQgdGFyZ2V0IG9yIHNoZWV0IHByb3AhXFxuXFxuLSBEb2VzIHRoaXMgZXJyb3Igb2NjdXIgb24gdGhlIGNsaWVudCBhbmQgaXMgeW91ciB0YXJnZXQgZmFsc3k/XFxuLSBEb2VzIHRoaXMgZXJyb3Igb2NjdXIgb24gdGhlIHNlcnZlciBhbmQgaXMgdGhlIHNoZWV0IGZhbHN5P1xcblxcblwiLFxuICBcIjVcIjogXCJUaGUgY2xvbmUgbWV0aG9kIGNhbm5vdCBiZSB1c2VkIG9uIHRoZSBjbGllbnQhXFxuXFxuLSBBcmUgeW91IHJ1bm5pbmcgaW4gYSBjbGllbnQtbGlrZSBlbnZpcm9ubWVudCBvbiB0aGUgc2VydmVyP1xcbi0gQXJlIHlvdSB0cnlpbmcgdG8gcnVuIFNTUiBvbiB0aGUgY2xpZW50P1xcblxcblwiLFxuICBcIjZcIjogXCJUcnlpbmcgdG8gaW5zZXJ0IGEgbmV3IHN0eWxlIHRhZywgYnV0IHRoZSBnaXZlbiBOb2RlIGlzIHVubW91bnRlZCFcXG5cXG4tIEFyZSB5b3UgdXNpbmcgYSBjdXN0b20gdGFyZ2V0IHRoYXQgaXNuJ3QgbW91bnRlZD9cXG4tIERvZXMgeW91ciBkb2N1bWVudCBub3QgaGF2ZSBhIHZhbGlkIGhlYWQgZWxlbWVudD9cXG4tIEhhdmUgeW91IGFjY2lkZW50YWxseSByZW1vdmVkIGEgc3R5bGUgdGFnIG1hbnVhbGx5P1xcblxcblwiLFxuICBcIjdcIjogXCJUaGVtZVByb3ZpZGVyOiBQbGVhc2UgcmV0dXJuIGFuIG9iamVjdCBmcm9tIHlvdXIgXFxcInRoZW1lXFxcIiBwcm9wIGZ1bmN0aW9uLCBlLmcuXFxuXFxuYGBganNcXG50aGVtZT17KCkgPT4gKHt9KX1cXG5gYGBcXG5cXG5cIixcbiAgXCI4XCI6IFwiVGhlbWVQcm92aWRlcjogUGxlYXNlIG1ha2UgeW91ciBcXFwidGhlbWVcXFwiIHByb3AgYW4gb2JqZWN0LlxcblxcblwiLFxuICBcIjlcIjogXCJNaXNzaW5nIGRvY3VtZW50IGA8aGVhZD5gXFxuXFxuXCIsXG4gIFwiMTBcIjogXCJDYW5ub3QgZmluZCBhIFN0eWxlU2hlZXQgaW5zdGFuY2UuIFVzdWFsbHkgdGhpcyBoYXBwZW5zIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBjb3BpZXMgb2Ygc3R5bGVkLWNvbXBvbmVudHMgbG9hZGVkIGF0IG9uY2UuIENoZWNrIG91dCB0aGlzIGlzc3VlIGZvciBob3cgdG8gdHJvdWJsZXNob290IGFuZCBmaXggdGhlIGNvbW1vbiBjYXNlcyB3aGVyZSB0aGlzIHNpdHVhdGlvbiBjYW4gaGFwcGVuOiBodHRwczovL2dpdGh1Yi5jb20vc3R5bGVkLWNvbXBvbmVudHMvc3R5bGVkLWNvbXBvbmVudHMvaXNzdWVzLzE5NDEjaXNzdWVjb21tZW50LTQxNzg2MjAyMVxcblxcblwiLFxuICBcIjExXCI6IFwiX1RoaXMgZXJyb3Igd2FzIHJlcGxhY2VkIHdpdGggYSBkZXYtdGltZSB3YXJuaW5nLCBpdCB3aWxsIGJlIGRlbGV0ZWQgZm9yIHY0IGZpbmFsLl8gW2NyZWF0ZUdsb2JhbFN0eWxlXSByZWNlaXZlZCBjaGlsZHJlbiB3aGljaCB3aWxsIG5vdCBiZSByZW5kZXJlZC4gUGxlYXNlIHVzZSB0aGUgY29tcG9uZW50IHdpdGhvdXQgcGFzc2luZyBjaGlsZHJlbiBlbGVtZW50cy5cXG5cXG5cIixcbiAgXCIxMlwiOiBcIkl0IHNlZW1zIHlvdSBhcmUgaW50ZXJwb2xhdGluZyBhIGtleWZyYW1lIGRlY2xhcmF0aW9uICglcykgaW50byBhbiB1bnRhZ2dlZCBzdHJpbmcuIFRoaXMgd2FzIHN1cHBvcnRlZCBpbiBzdHlsZWQtY29tcG9uZW50cyB2MywgYnV0IGlzIG5vdCBsb25nZXIgc3VwcG9ydGVkIGluIHY0IGFzIGtleWZyYW1lcyBhcmUgbm93IGluamVjdGVkIG9uLWRlbWFuZC4gUGxlYXNlIHdyYXAgeW91ciBzdHJpbmcgaW4gdGhlIGNzc1xcXFxgXFxcXGAgaGVscGVyIHdoaWNoIGVuc3VyZXMgdGhlIHN0eWxlcyBhcmUgaW5qZWN0ZWQgY29ycmVjdGx5LiBTZWUgaHR0cHM6Ly93d3cuc3R5bGVkLWNvbXBvbmVudHMuY29tL2RvY3MvYXBpI2Nzc1xcblxcblwiLFxuICBcIjEzXCI6IFwiJXMgaXMgbm90IGEgc3R5bGVkIGNvbXBvbmVudCBhbmQgY2Fubm90IGJlIHJlZmVycmVkIHRvIHZpYSBjb21wb25lbnQgc2VsZWN0b3IuIFNlZSBodHRwczovL3d3dy5zdHlsZWQtY29tcG9uZW50cy5jb20vZG9jcy9hZHZhbmNlZCNyZWZlcnJpbmctdG8tb3RoZXItY29tcG9uZW50cyBmb3IgbW9yZSBkZXRhaWxzLlxcblwiXG59IDoge307XG5cbi8qKlxuICogc3VwZXIgYmFzaWMgdmVyc2lvbiBvZiBzcHJpbnRmXG4gKi9cbmZ1bmN0aW9uIGZvcm1hdCgpIHtcbiAgdmFyIGEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbMF07XG4gIHZhciBiID0gW107XG5cbiAgZm9yICh2YXIgYyA9IDEsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGMgPCBsZW47IGMgKz0gMSkge1xuICAgIGIucHVzaChhcmd1bWVudHMubGVuZ3RoIDw9IGMgPyB1bmRlZmluZWQgOiBhcmd1bWVudHNbY10pO1xuICB9XG5cbiAgYi5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgYSA9IGEucmVwbGFjZSgvJVthLXpdLywgZCk7XG4gIH0pO1xuXG4gIHJldHVybiBhO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBlcnJvciBmaWxlIG91dCBvZiBlcnJvcnMubWQgZm9yIGRldmVsb3BtZW50IGFuZCBhIHNpbXBsZSB3ZWIgbGluayB0byB0aGUgZnVsbCBlcnJvcnNcbiAqIGluIHByb2R1Y3Rpb24gbW9kZS5cbiAqL1xuXG52YXIgU3R5bGVkQ29tcG9uZW50c0Vycm9yID0gZnVuY3Rpb24gKF9FcnJvcikge1xuICBpbmhlcml0cyhTdHlsZWRDb21wb25lbnRzRXJyb3IsIF9FcnJvcik7XG5cbiAgZnVuY3Rpb24gU3R5bGVkQ29tcG9uZW50c0Vycm9yKGNvZGUpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBTdHlsZWRDb21wb25lbnRzRXJyb3IpO1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGludGVycG9sYXRpb25zID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgaW50ZXJwb2xhdGlvbnNbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9FcnJvci5jYWxsKHRoaXMsICdBbiBlcnJvciBvY2N1cnJlZC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zdHlsZWQtY29tcG9uZW50cy9zdHlsZWQtY29tcG9uZW50cy9ibG9iL21hc3Rlci9wYWNrYWdlcy9zdHlsZWQtY29tcG9uZW50cy9zcmMvdXRpbHMvZXJyb3JzLm1kIycgKyBjb2RlICsgJyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nICsgKGludGVycG9sYXRpb25zLmxlbmd0aCA+IDAgPyAnIEFkZGl0aW9uYWwgYXJndW1lbnRzOiAnICsgaW50ZXJwb2xhdGlvbnMuam9pbignLCAnKSA6ICcnKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9FcnJvci5jYWxsKHRoaXMsIGZvcm1hdC5hcHBseSh1bmRlZmluZWQsIFtFUlJPUlNbY29kZV1dLmNvbmNhdChpbnRlcnBvbGF0aW9ucykpLnRyaW0oKSkpO1xuICAgIH1cbiAgICByZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihfdGhpcyk7XG4gIH1cblxuICByZXR1cm4gU3R5bGVkQ29tcG9uZW50c0Vycm9yO1xufShFcnJvcik7XG5cbi8vIFxudmFyIFNDX0NPTVBPTkVOVF9JRCA9IC9eW15cXFNcXG5dKj9cXC9cXCogc2MtY29tcG9uZW50LWlkOlxccyooXFxTKylcXHMrXFwqXFwvL2dtO1xuXG52YXIgZXh0cmFjdENvbXBzID0gKGZ1bmN0aW9uIChtYXliZUNTUykge1xuICB2YXIgY3NzID0gJycgKyAobWF5YmVDU1MgfHwgJycpOyAvLyBEZWZpbml0ZWx5IGEgc3RyaW5nLCBhbmQgYSBjbG9uZVxuICB2YXIgZXhpc3RpbmdDb21wb25lbnRzID0gW107XG4gIGNzcy5yZXBsYWNlKFNDX0NPTVBPTkVOVF9JRCwgZnVuY3Rpb24gKG1hdGNoLCBjb21wb25lbnRJZCwgbWF0Y2hJbmRleCkge1xuICAgIGV4aXN0aW5nQ29tcG9uZW50cy5wdXNoKHsgY29tcG9uZW50SWQ6IGNvbXBvbmVudElkLCBtYXRjaEluZGV4OiBtYXRjaEluZGV4IH0pO1xuICAgIHJldHVybiBtYXRjaDtcbiAgfSk7XG4gIHJldHVybiBleGlzdGluZ0NvbXBvbmVudHMubWFwKGZ1bmN0aW9uIChfcmVmLCBpKSB7XG4gICAgdmFyIGNvbXBvbmVudElkID0gX3JlZi5jb21wb25lbnRJZCxcbiAgICAgICAgbWF0Y2hJbmRleCA9IF9yZWYubWF0Y2hJbmRleDtcblxuICAgIHZhciBuZXh0Q29tcCA9IGV4aXN0aW5nQ29tcG9uZW50c1tpICsgMV07XG4gICAgdmFyIGNzc0Zyb21ET00gPSBuZXh0Q29tcCA/IGNzcy5zbGljZShtYXRjaEluZGV4LCBuZXh0Q29tcC5tYXRjaEluZGV4KSA6IGNzcy5zbGljZShtYXRjaEluZGV4KTtcbiAgICByZXR1cm4geyBjb21wb25lbnRJZDogY29tcG9uZW50SWQsIGNzc0Zyb21ET006IGNzc0Zyb21ET00gfTtcbiAgfSk7XG59KTtcblxuLy8gXG5cbnZhciBDT01NRU5UX1JFR0VYID0gL15cXHMqXFwvXFwvLiokL2dtO1xuXG4vLyBOT1RFOiBUaGlzIHN0eWxpcyBpbnN0YW5jZSBpcyBvbmx5IHVzZWQgdG8gc3BsaXQgcnVsZXMgZnJvbSBTU1InZCBzdHlsZSB0YWdzXG52YXIgc3R5bGlzU3BsaXR0ZXIgPSBuZXcgU3R5bGlzKHtcbiAgZ2xvYmFsOiBmYWxzZSxcbiAgY2FzY2FkZTogdHJ1ZSxcbiAga2V5ZnJhbWU6IGZhbHNlLFxuICBwcmVmaXg6IGZhbHNlLFxuICBjb21wcmVzczogZmFsc2UsXG4gIHNlbWljb2xvbjogdHJ1ZVxufSk7XG5cbnZhciBzdHlsaXMgPSBuZXcgU3R5bGlzKHtcbiAgZ2xvYmFsOiBmYWxzZSxcbiAgY2FzY2FkZTogdHJ1ZSxcbiAga2V5ZnJhbWU6IGZhbHNlLFxuICBwcmVmaXg6IHRydWUsXG4gIGNvbXByZXNzOiBmYWxzZSxcbiAgc2VtaWNvbG9uOiBmYWxzZSAvLyBOT1RFOiBUaGlzIG1lYW5zIFwiYXV0b2NvbXBsZXRlIG1pc3Npbmcgc2VtaWNvbG9uc1wiXG59KTtcblxuLy8gV3JhcCBgaW5zZXJ0UnVsZVBsdWdpbiB0byBidWlsZCBhIGxpc3Qgb2YgcnVsZXMsXG4vLyBhbmQgdGhlbiBtYWtlIG91ciBvd24gcGx1Z2luIHRvIHJldHVybiB0aGUgcnVsZXMuIFRoaXNcbi8vIG1ha2VzIGl0IGVhc2llciB0byBob29rIGludG8gdGhlIGV4aXN0aW5nIFNTUiBhcmNoaXRlY3R1cmVcblxudmFyIHBhcnNpbmdSdWxlcyA9IFtdO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbnZhciByZXR1cm5SdWxlc1BsdWdpbiA9IGZ1bmN0aW9uIHJldHVyblJ1bGVzUGx1Z2luKGNvbnRleHQpIHtcbiAgaWYgKGNvbnRleHQgPT09IC0yKSB7XG4gICAgdmFyIHBhcnNlZFJ1bGVzID0gcGFyc2luZ1J1bGVzO1xuICAgIHBhcnNpbmdSdWxlcyA9IFtdO1xuICAgIHJldHVybiBwYXJzZWRSdWxlcztcbiAgfVxufTtcblxudmFyIHBhcnNlUnVsZXNQbHVnaW4gPSBfaW5zZXJ0UnVsZVBsdWdpbihmdW5jdGlvbiAocnVsZSkge1xuICBwYXJzaW5nUnVsZXMucHVzaChydWxlKTtcbn0pO1xuXG52YXIgX2NvbXBvbmVudElkID0gdm9pZCAwO1xudmFyIF9zZWxlY3RvciA9IHZvaWQgMDtcbnZhciBfc2VsZWN0b3JSZWdleHAgPSB2b2lkIDA7XG5cbnZhciBzZWxmUmVmZXJlbmNlUmVwbGFjZXIgPSBmdW5jdGlvbiBzZWxmUmVmZXJlbmNlUmVwbGFjZXIobWF0Y2gsIG9mZnNldCwgc3RyaW5nKSB7XG4gIGlmIChcbiAgLy8gdGhlIGZpcnN0IHNlbGYtcmVmIGlzIGFsd2F5cyB1bnRvdWNoZWRcbiAgb2Zmc2V0ID4gMCAmJlxuICAvLyB0aGVyZSBzaG91bGQgYmUgYXQgbGVhc3QgdHdvIHNlbGYtcmVmcyB0byBkbyBhIHJlcGxhY2VtZW50ICguYiA+IC5iKVxuICBzdHJpbmcuc2xpY2UoMCwgb2Zmc2V0KS5pbmRleE9mKF9zZWxlY3RvcikgIT09IC0xICYmXG4gIC8vIG5vIGNvbnNlY3V0aXZlIHNlbGYgcmVmcyAoLmIuYik7IHRoYXQgaXMgYSBwcmVjZWRlbmNlIGJvb3N0IGFuZCB0cmVhdGVkIGRpZmZlcmVudGx5XG4gIHN0cmluZy5zbGljZShvZmZzZXQgLSBfc2VsZWN0b3IubGVuZ3RoLCBvZmZzZXQpICE9PSBfc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gJy4nICsgX2NvbXBvbmVudElkO1xuICB9XG5cbiAgcmV0dXJuIG1hdGNoO1xufTtcblxuLyoqXG4gKiBXaGVuIHdyaXRpbmcgYSBzdHlsZSBsaWtlXG4gKlxuICogJiArICYge1xuICogICBjb2xvcjogcmVkO1xuICogfVxuICpcbiAqIFRoZSBzZWNvbmQgYW1wZXJzYW5kIHNob3VsZCBiZSBhIHJlZmVyZW5jZSB0byB0aGUgc3RhdGljIGNvbXBvbmVudCBjbGFzcy4gc3R5bGlzXG4gKiBoYXMgbm8ga25vd2xlZGdlIG9mIHN0YXRpYyBjbGFzcyBzbyB3ZSBoYXZlIHRvIGludGVsbGlnZW50bHkgcmVwbGFjZSB0aGUgYmFzZSBzZWxlY3Rvci5cbiAqL1xudmFyIHNlbGZSZWZlcmVuY2VSZXBsYWNlbWVudFBsdWdpbiA9IGZ1bmN0aW9uIHNlbGZSZWZlcmVuY2VSZXBsYWNlbWVudFBsdWdpbihjb250ZXh0LCBfLCBzZWxlY3RvcnMpIHtcbiAgaWYgKGNvbnRleHQgPT09IDIgJiYgc2VsZWN0b3JzLmxlbmd0aCAmJiBzZWxlY3RvcnNbMF0ubGFzdEluZGV4T2YoX3NlbGVjdG9yKSA+IDApIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICBzZWxlY3RvcnNbMF0gPSBzZWxlY3RvcnNbMF0ucmVwbGFjZShfc2VsZWN0b3JSZWdleHAsIHNlbGZSZWZlcmVuY2VSZXBsYWNlcik7XG4gIH1cbn07XG5cbnN0eWxpcy51c2UoW3NlbGZSZWZlcmVuY2VSZXBsYWNlbWVudFBsdWdpbiwgcGFyc2VSdWxlc1BsdWdpbiwgcmV0dXJuUnVsZXNQbHVnaW5dKTtcbnN0eWxpc1NwbGl0dGVyLnVzZShbcGFyc2VSdWxlc1BsdWdpbiwgcmV0dXJuUnVsZXNQbHVnaW5dKTtcblxudmFyIHNwbGl0QnlSdWxlcyA9IGZ1bmN0aW9uIHNwbGl0QnlSdWxlcyhjc3MpIHtcbiAgcmV0dXJuIHN0eWxpc1NwbGl0dGVyKCcnLCBjc3MpO1xufTtcblxuZnVuY3Rpb24gc3RyaW5naWZ5UnVsZXMocnVsZXMsIHNlbGVjdG9yLCBwcmVmaXgpIHtcbiAgdmFyIGNvbXBvbmVudElkID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAnJic7XG5cbiAgdmFyIGZsYXRDU1MgPSBydWxlcy5qb2luKCcnKS5yZXBsYWNlKENPTU1FTlRfUkVHRVgsICcnKTsgLy8gcmVwbGFjZSBKUyBjb21tZW50c1xuXG4gIHZhciBjc3NTdHIgPSBzZWxlY3RvciAmJiBwcmVmaXggPyBwcmVmaXggKyAnICcgKyBzZWxlY3RvciArICcgeyAnICsgZmxhdENTUyArICcgfScgOiBmbGF0Q1NTO1xuXG4gIC8vIHN0eWxpcyBoYXMgbm8gY29uY2VwdCBvZiBzdGF0ZSB0byBiZSBwYXNzZWQgdG8gcGx1Z2luc1xuICAvLyBidXQgc2luY2UgSlMgaXMgc2luZ2xlPXRocmVhZGVkLCB3ZSBjYW4gcmVseSBvbiB0aGF0IHRvIGVuc3VyZVxuICAvLyB0aGVzZSBwcm9wZXJ0aWVzIHN0YXkgaW4gc3luYyB3aXRoIHRoZSBjdXJyZW50IHN0eWxpcyBydW5cbiAgX2NvbXBvbmVudElkID0gY29tcG9uZW50SWQ7XG4gIF9zZWxlY3RvciA9IHNlbGVjdG9yO1xuICBfc2VsZWN0b3JSZWdleHAgPSBuZXcgUmVnRXhwKCdcXFxcJyArIF9zZWxlY3RvciArICdcXFxcYicsICdnJyk7XG5cbiAgcmV0dXJuIHN0eWxpcyhwcmVmaXggfHwgIXNlbGVjdG9yID8gJycgOiBzZWxlY3RvciwgY3NzU3RyKTtcbn1cblxuLy8gXG4vKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UsIG5vLXVuZGVmICovXG5cbnZhciBnZXROb25jZSA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09ICd1bmRlZmluZWQnID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xufSk7XG5cbi8vIFxuLyogVGhlc2UgYXJlIGhlbHBlcnMgZm9yIHRoZSBTdHlsZVRhZ3MgdG8ga2VlcCB0cmFjayBvZiB0aGUgaW5qZWN0ZWRcbiAqIHJ1bGUgbmFtZXMgZm9yIGVhY2ggKGNvbXBvbmVudCkgSUQgdGhhdCB0aGV5J3JlIGtlZXBpbmcgdHJhY2sgb2YuXG4gKiBUaGV5J3JlIGNydWNpYWwgZm9yIGRldGVjdGluZyB3aGV0aGVyIGEgbmFtZSBoYXMgYWxyZWFkeSBiZWVuXG4gKiBpbmplY3RlZC5cbiAqIChUaGlzIGV4Y2x1ZGVzIHJlaHlkcmF0ZWQgbmFtZXMpICovXG5cbi8qIGFkZHMgYSBuZXcgSUQ6bmFtZSBwYWlyaW5nIHRvIGEgbmFtZXMgZGljdGlvbmFyeSAqL1xudmFyIGFkZE5hbWVGb3JJZCA9IGZ1bmN0aW9uIGFkZE5hbWVGb3JJZChuYW1lcywgaWQsIG5hbWUpIHtcbiAgaWYgKG5hbWUpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICB2YXIgbmFtZXNGb3JJZCA9IG5hbWVzW2lkXSB8fCAobmFtZXNbaWRdID0gT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gICAgbmFtZXNGb3JJZFtuYW1lXSA9IHRydWU7XG4gIH1cbn07XG5cbi8qIHJlc2V0cyBhbiBJRCBlbnRpcmVseSBieSBvdmVyd3JpdGluZyBpdCBpbiB0aGUgZGljdGlvbmFyeSAqL1xudmFyIHJlc2V0SWROYW1lcyA9IGZ1bmN0aW9uIHJlc2V0SWROYW1lcyhuYW1lcywgaWQpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIG5hbWVzW2lkXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG59O1xuXG4vKiBmYWN0b3J5IGZvciBhIG5hbWVzIGRpY3Rpb25hcnkgY2hlY2tpbmcgdGhlIGV4aXN0YW5jZSBvZiBhbiBJRDpuYW1lIHBhaXJpbmcgKi9cbnZhciBoYXNOYW1lRm9ySWQgPSBmdW5jdGlvbiBoYXNOYW1lRm9ySWQobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpZCwgbmFtZSkge1xuICAgIHJldHVybiBuYW1lc1tpZF0gIT09IHVuZGVmaW5lZCAmJiBuYW1lc1tpZF1bbmFtZV07XG4gIH07XG59O1xuXG4vKiBzdHJpbmdpZmllcyBuYW1lcyBmb3IgdGhlIGh0bWwvZWxlbWVudCBvdXRwdXQgKi9cbnZhciBzdHJpbmdpZnlOYW1lcyA9IGZ1bmN0aW9uIHN0cmluZ2lmeU5hbWVzKG5hbWVzKSB7XG4gIHZhciBzdHIgPSAnJztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGd1YXJkLWZvci1pblxuICBmb3IgKHZhciBpZCBpbiBuYW1lcykge1xuICAgIHN0ciArPSBPYmplY3Qua2V5cyhuYW1lc1tpZF0pLmpvaW4oJyAnKSArICcgJztcbiAgfVxuICByZXR1cm4gc3RyLnRyaW0oKTtcbn07XG5cbi8qIGNsb25lcyB0aGUgbmVzdGVkIG5hbWVzIGRpY3Rpb25hcnkgKi9cbnZhciBjbG9uZU5hbWVzID0gZnVuY3Rpb24gY2xvbmVOYW1lcyhuYW1lcykge1xuICB2YXIgY2xvbmUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ3VhcmQtZm9yLWluXG4gIGZvciAodmFyIGlkIGluIG5hbWVzKSB7XG4gICAgY2xvbmVbaWRdID0gX2V4dGVuZHMoe30sIG5hbWVzW2lkXSk7XG4gIH1cbiAgcmV0dXJuIGNsb25lO1xufTtcblxuLy8gXG5cbi8qIFRoZXNlIGFyZSBoZWxwZXJzIHRoYXQgZGVhbCB3aXRoIHRoZSBpbnNlcnRSdWxlIChha2Egc3BlZWR5KSBBUElcbiAqIFRoZXkgYXJlIHVzZWQgaW4gdGhlIFN0eWxlVGFncyBhbmQgc3BlY2lmaWNhbGx5IHRoZSBzcGVlZHkgdGFnXG4gKi9cblxuLyogcmV0cmlldmUgYSBzaGVldCBmb3IgYSBnaXZlbiBzdHlsZSB0YWcgKi9cbnZhciBzaGVldEZvclRhZyA9IGZ1bmN0aW9uIHNoZWV0Rm9yVGFnKHRhZykge1xuICAvLyAkRmxvd0ZpeE1lXG4gIGlmICh0YWcuc2hlZXQpIHJldHVybiB0YWcuc2hlZXQ7XG5cbiAgLyogRmlyZWZveCBxdWlyayByZXF1aXJlcyB1cyB0byBzdGVwIHRocm91Z2ggYWxsIHN0eWxlc2hlZXRzIHRvIGZpbmQgb25lIG93bmVkIGJ5IHRoZSBnaXZlbiB0YWcgKi9cbiAgdmFyIHNpemUgPSB0YWcub3duZXJEb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSArPSAxKSB7XG4gICAgdmFyIHNoZWV0ID0gdGFnLm93bmVyRG9jdW1lbnQuc3R5bGVTaGVldHNbaV07XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIGlmIChzaGVldC5vd25lck5vZGUgPT09IHRhZykgcmV0dXJuIHNoZWV0O1xuICB9XG5cbiAgLyogd2Ugc2hvdWxkIGFsd2F5cyBiZSBhYmxlIHRvIGZpbmQgYSB0YWcgKi9cbiAgdGhyb3cgbmV3IFN0eWxlZENvbXBvbmVudHNFcnJvcigxMCk7XG59O1xuXG4vKiBpbnNlcnQgYSBydWxlIHNhZmVseSBhbmQgcmV0dXJuIHdoZXRoZXIgaXQgd2FzIGFjdHVhbGx5IGluamVjdGVkICovXG52YXIgc2FmZUluc2VydFJ1bGUgPSBmdW5jdGlvbiBzYWZlSW5zZXJ0UnVsZShzaGVldCwgY3NzUnVsZSwgaW5kZXgpIHtcbiAgLyogYWJvcnQgZWFybHkgaWYgY3NzUnVsZSBzdHJpbmcgaXMgZmFsc3kgKi9cbiAgaWYgKCFjc3NSdWxlKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIG1heEluZGV4ID0gc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuXG4gIHRyeSB7XG4gICAgLyogdXNlIGluc2VydFJ1bGUgYW5kIGNhcCBwYXNzZWQgaW5kZXggd2l0aCBtYXhJbmRleCAobm8gb2YgY3NzUnVsZXMpICovXG4gICAgc2hlZXQuaW5zZXJ0UnVsZShjc3NSdWxlLCBpbmRleCA8PSBtYXhJbmRleCA/IGluZGV4IDogbWF4SW5kZXgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvKiBhbnkgZXJyb3IgaW5kaWNhdGVzIGFuIGludmFsaWQgcnVsZSAqL1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyogZGVsZXRlcyBgc2l6ZWAgcnVsZXMgc3RhcnRpbmcgZnJvbSBgcmVtb3ZhbEluZGV4YCAqL1xudmFyIGRlbGV0ZVJ1bGVzID0gZnVuY3Rpb24gZGVsZXRlUnVsZXMoc2hlZXQsIHJlbW92YWxJbmRleCwgc2l6ZSkge1xuICB2YXIgbG93ZXJCb3VuZCA9IHJlbW92YWxJbmRleCAtIHNpemU7XG4gIGZvciAodmFyIGkgPSByZW1vdmFsSW5kZXg7IGkgPiBsb3dlckJvdW5kOyBpIC09IDEpIHtcbiAgICBzaGVldC5kZWxldGVSdWxlKGkpO1xuICB9XG59O1xuXG4vLyBcblxuLyogdGhpcyBtYXJrZXIgc2VwYXJhdGVzIGNvbXBvbmVudCBzdHlsZXMgYW5kIGlzIGltcG9ydGFudCBmb3IgcmVoeWRyYXRpb24gKi9cbnZhciBtYWtlVGV4dE1hcmtlciA9IGZ1bmN0aW9uIG1ha2VUZXh0TWFya2VyKGlkKSB7XG4gIHJldHVybiAnXFxuLyogc2MtY29tcG9uZW50LWlkOiAnICsgaWQgKyAnICovXFxuJztcbn07XG5cbi8qIGFkZCB1cCBhbGwgbnVtYmVycyBpbiBhcnJheSB1cCB1bnRpbCBhbmQgaW5jbHVkaW5nIHRoZSBpbmRleCAqL1xudmFyIGFkZFVwVW50aWxJbmRleCA9IGZ1bmN0aW9uIGFkZFVwVW50aWxJbmRleChzaXplcywgaW5kZXgpIHtcbiAgdmFyIHRvdGFsVXBUb0luZGV4ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPD0gaW5kZXg7IGkgKz0gMSkge1xuICAgIHRvdGFsVXBUb0luZGV4ICs9IHNpemVzW2ldO1xuICB9XG5cbiAgcmV0dXJuIHRvdGFsVXBUb0luZGV4O1xufTtcblxuLyogY3JlYXRlIGEgbmV3IHN0eWxlIHRhZyBhZnRlciBsYXN0RWwgKi9cbnZhciBtYWtlU3R5bGVUYWcgPSBmdW5jdGlvbiBtYWtlU3R5bGVUYWcodGFyZ2V0LCB0YWdFbCwgaW5zZXJ0QmVmb3JlKSB7XG4gIHZhciB0YXJnZXREb2N1bWVudCA9IGRvY3VtZW50O1xuICBpZiAodGFyZ2V0KSB0YXJnZXREb2N1bWVudCA9IHRhcmdldC5vd25lckRvY3VtZW50O2Vsc2UgaWYgKHRhZ0VsKSB0YXJnZXREb2N1bWVudCA9IHRhZ0VsLm93bmVyRG9jdW1lbnQ7XG5cbiAgdmFyIGVsID0gdGFyZ2V0RG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgZWwuc2V0QXR0cmlidXRlKFNDX0FUVFIsICcnKTtcbiAgZWwuc2V0QXR0cmlidXRlKFNDX1ZFUlNJT05fQVRUUiwgXCI0LjQuMVwiKTtcblxuICB2YXIgbm9uY2UgPSBnZXROb25jZSgpO1xuICBpZiAobm9uY2UpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ25vbmNlJywgbm9uY2UpO1xuICB9XG5cbiAgLyogV29yayBhcm91bmQgaW5zZXJ0UnVsZSBxdWlyayBpbiBFZGdlSFRNTCAqL1xuICBlbC5hcHBlbmRDaGlsZCh0YXJnZXREb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJykpO1xuXG4gIGlmICh0YXJnZXQgJiYgIXRhZ0VsKSB7XG4gICAgLyogQXBwZW5kIHRvIHRhcmdldCB3aGVuIG5vIHByZXZpb3VzIGVsZW1lbnQgd2FzIHBhc3NlZCAqL1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCF0YWdFbCB8fCAhdGFyZ2V0IHx8ICF0YWdFbC5wYXJlbnROb2RlKSB7XG4gICAgICB0aHJvdyBuZXcgU3R5bGVkQ29tcG9uZW50c0Vycm9yKDYpO1xuICAgIH1cblxuICAgIC8qIEluc2VydCBuZXcgc3R5bGUgdGFnIGFmdGVyIHRoZSBwcmV2aW91cyBvbmUgKi9cbiAgICB0YWdFbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgaW5zZXJ0QmVmb3JlID8gdGFnRWwgOiB0YWdFbC5uZXh0U2libGluZyk7XG4gIH1cblxuICByZXR1cm4gZWw7XG59O1xuXG4vKiB0YWtlcyBhIGNzcyBmYWN0b3J5IGZ1bmN0aW9uIGFuZCBvdXRwdXRzIGFuIGh0bWwgc3R5bGVkIHRhZyBmYWN0b3J5ICovXG52YXIgd3JhcEFzSHRtbFRhZyA9IGZ1bmN0aW9uIHdyYXBBc0h0bWxUYWcoY3NzLCBuYW1lcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGFkZGl0aW9uYWxBdHRycykge1xuICAgIHZhciBub25jZSA9IGdldE5vbmNlKCk7XG4gICAgdmFyIGF0dHJzID0gW25vbmNlICYmICdub25jZT1cIicgKyBub25jZSArICdcIicsIFNDX0FUVFIgKyAnPVwiJyArIHN0cmluZ2lmeU5hbWVzKG5hbWVzKSArICdcIicsIFNDX1ZFUlNJT05fQVRUUiArICc9XCInICsgXCI0LjQuMVwiICsgJ1wiJywgYWRkaXRpb25hbEF0dHJzXTtcblxuICAgIHZhciBodG1sQXR0ciA9IGF0dHJzLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyk7XG4gICAgcmV0dXJuICc8c3R5bGUgJyArIGh0bWxBdHRyICsgJz4nICsgY3NzKCkgKyAnPC9zdHlsZT4nO1xuICB9O1xufTtcblxuLyogdGFrZXMgYSBjc3MgZmFjdG9yeSBmdW5jdGlvbiBhbmQgb3V0cHV0cyBhbiBlbGVtZW50IGZhY3RvcnkgKi9cbnZhciB3cmFwQXNFbGVtZW50ID0gZnVuY3Rpb24gd3JhcEFzRWxlbWVudChjc3MsIG5hbWVzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9wcm9wcztcblxuICAgIHZhciBwcm9wcyA9IChfcHJvcHMgPSB7fSwgX3Byb3BzW1NDX0FUVFJdID0gc3RyaW5naWZ5TmFtZXMobmFtZXMpLCBfcHJvcHNbU0NfVkVSU0lPTl9BVFRSXSA9IFwiNC40LjFcIiwgX3Byb3BzKTtcblxuICAgIHZhciBub25jZSA9IGdldE5vbmNlKCk7XG4gICAgaWYgKG5vbmNlKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBwcm9wcy5ub25jZSA9IG5vbmNlO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1kYW5nZXJcbiAgICByZXR1cm4gUmVhY3RfX2RlZmF1bHQuY3JlYXRlRWxlbWVudCgnc3R5bGUnLCBfZXh0ZW5kcyh7fSwgcHJvcHMsIHsgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOiBjc3MoKSB9IH0pKTtcbiAgfTtcbn07XG5cbnZhciBnZXRJZHNGcm9tTWFya2Vyc0ZhY3RvcnkgPSBmdW5jdGlvbiBnZXRJZHNGcm9tTWFya2Vyc0ZhY3RvcnkobWFya2Vycykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhtYXJrZXJzKTtcbiAgfTtcbn07XG5cbi8qIHNwZWVkeSB0YWdzIHV0aWxpc2UgaW5zZXJ0UnVsZSAqL1xudmFyIG1ha2VTcGVlZHlUYWcgPSBmdW5jdGlvbiBtYWtlU3BlZWR5VGFnKGVsLCBnZXRJbXBvcnRSdWxlVGFnKSB7XG4gIHZhciBuYW1lcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBtYXJrZXJzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIHNpemVzID0gW107XG5cbiAgdmFyIGV4dHJhY3RJbXBvcnQgPSBnZXRJbXBvcnRSdWxlVGFnICE9PSB1bmRlZmluZWQ7XG4gIC8qIGluZGljYXRlcyB3aGV0aGVyIGdldEltcG9ydFJ1bGVUYWcgd2FzIGNhbGxlZCAqL1xuICB2YXIgdXNlZEltcG9ydFJ1bGVUYWcgPSBmYWxzZTtcblxuICB2YXIgaW5zZXJ0TWFya2VyID0gZnVuY3Rpb24gaW5zZXJ0TWFya2VyKGlkKSB7XG4gICAgdmFyIHByZXYgPSBtYXJrZXJzW2lkXTtcbiAgICBpZiAocHJldiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJldjtcbiAgICB9XG5cbiAgICBtYXJrZXJzW2lkXSA9IHNpemVzLmxlbmd0aDtcbiAgICBzaXplcy5wdXNoKDApO1xuICAgIHJlc2V0SWROYW1lcyhuYW1lcywgaWQpO1xuXG4gICAgcmV0dXJuIG1hcmtlcnNbaWRdO1xuICB9O1xuXG4gIHZhciBpbnNlcnRSdWxlcyA9IGZ1bmN0aW9uIGluc2VydFJ1bGVzKGlkLCBjc3NSdWxlcywgbmFtZSkge1xuICAgIHZhciBtYXJrZXIgPSBpbnNlcnRNYXJrZXIoaWQpO1xuICAgIHZhciBzaGVldCA9IHNoZWV0Rm9yVGFnKGVsKTtcbiAgICB2YXIgaW5zZXJ0SW5kZXggPSBhZGRVcFVudGlsSW5kZXgoc2l6ZXMsIG1hcmtlcik7XG5cbiAgICB2YXIgaW5qZWN0ZWRSdWxlcyA9IDA7XG4gICAgdmFyIGltcG9ydFJ1bGVzID0gW107XG4gICAgdmFyIGNzc1J1bGVzU2l6ZSA9IGNzc1J1bGVzLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3NzUnVsZXNTaXplOyBpICs9IDEpIHtcbiAgICAgIHZhciBjc3NSdWxlID0gY3NzUnVsZXNbaV07XG4gICAgICB2YXIgbWF5SGF2ZUltcG9ydCA9IGV4dHJhY3RJbXBvcnQ7IC8qIEBpbXBvcnQgcnVsZXMgYXJlIHJlb3JkZXJlZCB0byBhcHBlYXIgZmlyc3QgKi9cbiAgICAgIGlmIChtYXlIYXZlSW1wb3J0ICYmIGNzc1J1bGUuaW5kZXhPZignQGltcG9ydCcpICE9PSAtMSkge1xuICAgICAgICBpbXBvcnRSdWxlcy5wdXNoKGNzc1J1bGUpO1xuICAgICAgfSBlbHNlIGlmIChzYWZlSW5zZXJ0UnVsZShzaGVldCwgY3NzUnVsZSwgaW5zZXJ0SW5kZXggKyBpbmplY3RlZFJ1bGVzKSkge1xuICAgICAgICBtYXlIYXZlSW1wb3J0ID0gZmFsc2U7XG4gICAgICAgIGluamVjdGVkUnVsZXMgKz0gMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXh0cmFjdEltcG9ydCAmJiBpbXBvcnRSdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICB1c2VkSW1wb3J0UnVsZVRhZyA9IHRydWU7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICBnZXRJbXBvcnRSdWxlVGFnKCkuaW5zZXJ0UnVsZXMoaWQgKyAnLWltcG9ydCcsIGltcG9ydFJ1bGVzKTtcbiAgICB9XG5cbiAgICBzaXplc1ttYXJrZXJdICs9IGluamVjdGVkUnVsZXM7IC8qIGFkZCB1cCBubyBvZiBpbmplY3RlZCBydWxlcyAqL1xuICAgIGFkZE5hbWVGb3JJZChuYW1lcywgaWQsIG5hbWUpO1xuICB9O1xuXG4gIHZhciByZW1vdmVSdWxlcyA9IGZ1bmN0aW9uIHJlbW92ZVJ1bGVzKGlkKSB7XG4gICAgdmFyIG1hcmtlciA9IG1hcmtlcnNbaWRdO1xuICAgIGlmIChtYXJrZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIC8vICRGbG93Rml4TWVcbiAgICBpZiAoZWwuaXNDb25uZWN0ZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICB2YXIgc2l6ZSA9IHNpemVzW21hcmtlcl07XG4gICAgdmFyIHNoZWV0ID0gc2hlZXRGb3JUYWcoZWwpO1xuICAgIHZhciByZW1vdmFsSW5kZXggPSBhZGRVcFVudGlsSW5kZXgoc2l6ZXMsIG1hcmtlcikgLSAxO1xuICAgIGRlbGV0ZVJ1bGVzKHNoZWV0LCByZW1vdmFsSW5kZXgsIHNpemUpO1xuICAgIHNpemVzW21hcmtlcl0gPSAwO1xuICAgIHJlc2V0SWROYW1lcyhuYW1lcywgaWQpO1xuXG4gICAgaWYgKGV4dHJhY3RJbXBvcnQgJiYgdXNlZEltcG9ydFJ1bGVUYWcpIHtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGdldEltcG9ydFJ1bGVUYWcoKS5yZW1vdmVSdWxlcyhpZCArICctaW1wb3J0Jyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBjc3MgPSBmdW5jdGlvbiBjc3MoKSB7XG4gICAgdmFyIF9zaGVldEZvclRhZyA9IHNoZWV0Rm9yVGFnKGVsKSxcbiAgICAgICAgY3NzUnVsZXMgPSBfc2hlZXRGb3JUYWcuY3NzUnVsZXM7XG5cbiAgICB2YXIgc3RyID0gJyc7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ3VhcmQtZm9yLWluXG4gICAgZm9yICh2YXIgaWQgaW4gbWFya2Vycykge1xuICAgICAgc3RyICs9IG1ha2VUZXh0TWFya2VyKGlkKTtcbiAgICAgIHZhciBtYXJrZXIgPSBtYXJrZXJzW2lkXTtcbiAgICAgIHZhciBlbmQgPSBhZGRVcFVudGlsSW5kZXgoc2l6ZXMsIG1hcmtlcik7XG4gICAgICB2YXIgc2l6ZSA9IHNpemVzW21hcmtlcl07XG4gICAgICBmb3IgKHZhciBpID0gZW5kIC0gc2l6ZTsgaSA8IGVuZDsgaSArPSAxKSB7XG4gICAgICAgIHZhciBydWxlID0gY3NzUnVsZXNbaV07XG4gICAgICAgIGlmIChydWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdHIgKz0gcnVsZS5jc3NUZXh0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICAgIHRocm93IG5ldyBTdHlsZWRDb21wb25lbnRzRXJyb3IoNSk7XG4gICAgfSxcblxuICAgIGNzczogY3NzLFxuICAgIGdldElkczogZ2V0SWRzRnJvbU1hcmtlcnNGYWN0b3J5KG1hcmtlcnMpLFxuICAgIGhhc05hbWVGb3JJZDogaGFzTmFtZUZvcklkKG5hbWVzKSxcbiAgICBpbnNlcnRNYXJrZXI6IGluc2VydE1hcmtlcixcbiAgICBpbnNlcnRSdWxlczogaW5zZXJ0UnVsZXMsXG4gICAgcmVtb3ZlUnVsZXM6IHJlbW92ZVJ1bGVzLFxuICAgIHNlYWxlZDogZmFsc2UsXG4gICAgc3R5bGVUYWc6IGVsLFxuICAgIHRvRWxlbWVudDogd3JhcEFzRWxlbWVudChjc3MsIG5hbWVzKSxcbiAgICB0b0hUTUw6IHdyYXBBc0h0bWxUYWcoY3NzLCBuYW1lcylcbiAgfTtcbn07XG5cbnZhciBtYWtlVGV4dE5vZGUgPSBmdW5jdGlvbiBtYWtlVGV4dE5vZGUodGFyZ2V0RG9jdW1lbnQsIGlkKSB7XG4gIHJldHVybiB0YXJnZXREb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShtYWtlVGV4dE1hcmtlcihpZCkpO1xufTtcblxudmFyIG1ha2VCcm93c2VyVGFnID0gZnVuY3Rpb24gbWFrZUJyb3dzZXJUYWcoZWwsIGdldEltcG9ydFJ1bGVUYWcpIHtcbiAgdmFyIG5hbWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIG1hcmtlcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIHZhciBleHRyYWN0SW1wb3J0ID0gZ2V0SW1wb3J0UnVsZVRhZyAhPT0gdW5kZWZpbmVkO1xuXG4gIC8qIGluZGljYXRlcyB3aGV0aGVyIGdldEltcG9ydFJ1bGVUYWcgd2FzIGNhbGxlZCAqL1xuICB2YXIgdXNlZEltcG9ydFJ1bGVUYWcgPSBmYWxzZTtcblxuICB2YXIgaW5zZXJ0TWFya2VyID0gZnVuY3Rpb24gaW5zZXJ0TWFya2VyKGlkKSB7XG4gICAgdmFyIHByZXYgPSBtYXJrZXJzW2lkXTtcbiAgICBpZiAocHJldiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJldjtcbiAgICB9XG5cbiAgICBtYXJrZXJzW2lkXSA9IG1ha2VUZXh0Tm9kZShlbC5vd25lckRvY3VtZW50LCBpZCk7XG4gICAgZWwuYXBwZW5kQ2hpbGQobWFya2Vyc1tpZF0pO1xuICAgIG5hbWVzW2lkXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICByZXR1cm4gbWFya2Vyc1tpZF07XG4gIH07XG5cbiAgdmFyIGluc2VydFJ1bGVzID0gZnVuY3Rpb24gaW5zZXJ0UnVsZXMoaWQsIGNzc1J1bGVzLCBuYW1lKSB7XG4gICAgdmFyIG1hcmtlciA9IGluc2VydE1hcmtlcihpZCk7XG4gICAgdmFyIGltcG9ydFJ1bGVzID0gW107XG4gICAgdmFyIGNzc1J1bGVzU2l6ZSA9IGNzc1J1bGVzLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3NzUnVsZXNTaXplOyBpICs9IDEpIHtcbiAgICAgIHZhciBydWxlID0gY3NzUnVsZXNbaV07XG4gICAgICB2YXIgbWF5SGF2ZUltcG9ydCA9IGV4dHJhY3RJbXBvcnQ7XG4gICAgICBpZiAobWF5SGF2ZUltcG9ydCAmJiBydWxlLmluZGV4T2YoJ0BpbXBvcnQnKSAhPT0gLTEpIHtcbiAgICAgICAgaW1wb3J0UnVsZXMucHVzaChydWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1heUhhdmVJbXBvcnQgPSBmYWxzZTtcbiAgICAgICAgdmFyIHNlcGFyYXRvciA9IGkgPT09IGNzc1J1bGVzU2l6ZSAtIDEgPyAnJyA6ICcgJztcbiAgICAgICAgbWFya2VyLmFwcGVuZERhdGEoJycgKyBydWxlICsgc2VwYXJhdG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGROYW1lRm9ySWQobmFtZXMsIGlkLCBuYW1lKTtcblxuICAgIGlmIChleHRyYWN0SW1wb3J0ICYmIGltcG9ydFJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHVzZWRJbXBvcnRSdWxlVGFnID0gdHJ1ZTtcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGdldEltcG9ydFJ1bGVUYWcoKS5pbnNlcnRSdWxlcyhpZCArICctaW1wb3J0JywgaW1wb3J0UnVsZXMpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgcmVtb3ZlUnVsZXMgPSBmdW5jdGlvbiByZW1vdmVSdWxlcyhpZCkge1xuICAgIHZhciBtYXJrZXIgPSBtYXJrZXJzW2lkXTtcbiAgICBpZiAobWFya2VyID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIC8qIGNyZWF0ZSBuZXcgZW1wdHkgdGV4dCBub2RlIGFuZCByZXBsYWNlIHRoZSBjdXJyZW50IG9uZSAqL1xuICAgIHZhciBuZXdNYXJrZXIgPSBtYWtlVGV4dE5vZGUoZWwub3duZXJEb2N1bWVudCwgaWQpO1xuICAgIGVsLnJlcGxhY2VDaGlsZChuZXdNYXJrZXIsIG1hcmtlcik7XG4gICAgbWFya2Vyc1tpZF0gPSBuZXdNYXJrZXI7XG4gICAgcmVzZXRJZE5hbWVzKG5hbWVzLCBpZCk7XG5cbiAgICBpZiAoZXh0cmFjdEltcG9ydCAmJiB1c2VkSW1wb3J0UnVsZVRhZykge1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgZ2V0SW1wb3J0UnVsZVRhZygpLnJlbW92ZVJ1bGVzKGlkICsgJy1pbXBvcnQnKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNzcyA9IGZ1bmN0aW9uIGNzcygpIHtcbiAgICB2YXIgc3RyID0gJyc7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ3VhcmQtZm9yLWluXG4gICAgZm9yICh2YXIgaWQgaW4gbWFya2Vycykge1xuICAgICAgc3RyICs9IG1hcmtlcnNbaWRdLmRhdGE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNsb25lOiBmdW5jdGlvbiBjbG9uZSgpIHtcbiAgICAgIHRocm93IG5ldyBTdHlsZWRDb21wb25lbnRzRXJyb3IoNSk7XG4gICAgfSxcblxuICAgIGNzczogY3NzLFxuICAgIGdldElkczogZ2V0SWRzRnJvbU1hcmtlcnNGYWN0b3J5KG1hcmtlcnMpLFxuICAgIGhhc05hbWVGb3JJZDogaGFzTmFtZUZvcklkKG5hbWVzKSxcbiAgICBpbnNlcnRNYXJrZXI6IGluc2VydE1hcmtlcixcbiAgICBpbnNlcnRSdWxlczogaW5zZXJ0UnVsZXMsXG4gICAgcmVtb3ZlUnVsZXM6IHJlbW92ZVJ1bGVzLFxuICAgIHNlYWxlZDogZmFsc2UsXG4gICAgc3R5bGVUYWc6IGVsLFxuICAgIHRvRWxlbWVudDogd3JhcEFzRWxlbWVudChjc3MsIG5hbWVzKSxcbiAgICB0b0hUTUw6IHdyYXBBc0h0bWxUYWcoY3NzLCBuYW1lcylcbiAgfTtcbn07XG5cbnZhciBtYWtlU2VydmVyVGFnID0gZnVuY3Rpb24gbWFrZVNlcnZlclRhZyhuYW1lc0FyZywgbWFya2Vyc0FyZykge1xuICB2YXIgbmFtZXMgPSBuYW1lc0FyZyA9PT0gdW5kZWZpbmVkID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IG5hbWVzQXJnO1xuICB2YXIgbWFya2VycyA9IG1hcmtlcnNBcmcgPT09IHVuZGVmaW5lZCA/IE9iamVjdC5jcmVhdGUobnVsbCkgOiBtYXJrZXJzQXJnO1xuXG4gIHZhciBpbnNlcnRNYXJrZXIgPSBmdW5jdGlvbiBpbnNlcnRNYXJrZXIoaWQpIHtcbiAgICB2YXIgcHJldiA9IG1hcmtlcnNbaWRdO1xuICAgIGlmIChwcmV2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBwcmV2O1xuICAgIH1cblxuICAgIHJldHVybiBtYXJrZXJzW2lkXSA9IFsnJ107XG4gIH07XG5cbiAgdmFyIGluc2VydFJ1bGVzID0gZnVuY3Rpb24gaW5zZXJ0UnVsZXMoaWQsIGNzc1J1bGVzLCBuYW1lKSB7XG4gICAgdmFyIG1hcmtlciA9IGluc2VydE1hcmtlcihpZCk7XG4gICAgbWFya2VyWzBdICs9IGNzc1J1bGVzLmpvaW4oJyAnKTtcbiAgICBhZGROYW1lRm9ySWQobmFtZXMsIGlkLCBuYW1lKTtcbiAgfTtcblxuICB2YXIgcmVtb3ZlUnVsZXMgPSBmdW5jdGlvbiByZW1vdmVSdWxlcyhpZCkge1xuICAgIHZhciBtYXJrZXIgPSBtYXJrZXJzW2lkXTtcbiAgICBpZiAobWFya2VyID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICBtYXJrZXJbMF0gPSAnJztcbiAgICByZXNldElkTmFtZXMobmFtZXMsIGlkKTtcbiAgfTtcblxuICB2YXIgY3NzID0gZnVuY3Rpb24gY3NzKCkge1xuICAgIHZhciBzdHIgPSAnJztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ3VhcmQtZm9yLWluXG4gICAgZm9yICh2YXIgaWQgaW4gbWFya2Vycykge1xuICAgICAgdmFyIGNzc0ZvcklkID0gbWFya2Vyc1tpZF1bMF07XG4gICAgICBpZiAoY3NzRm9ySWQpIHtcbiAgICAgICAgc3RyICs9IG1ha2VUZXh0TWFya2VyKGlkKSArIGNzc0ZvcklkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9O1xuXG4gIHZhciBjbG9uZSA9IGZ1bmN0aW9uIGNsb25lKCkge1xuICAgIHZhciBuYW1lc0Nsb25lID0gY2xvbmVOYW1lcyhuYW1lcyk7XG4gICAgdmFyIG1hcmtlcnNDbG9uZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ3VhcmQtZm9yLWluXG4gICAgZm9yICh2YXIgaWQgaW4gbWFya2Vycykge1xuICAgICAgbWFya2Vyc0Nsb25lW2lkXSA9IFttYXJrZXJzW2lkXVswXV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VTZXJ2ZXJUYWcobmFtZXNDbG9uZSwgbWFya2Vyc0Nsb25lKTtcbiAgfTtcblxuICB2YXIgdGFnID0ge1xuICAgIGNsb25lOiBjbG9uZSxcbiAgICBjc3M6IGNzcyxcbiAgICBnZXRJZHM6IGdldElkc0Zyb21NYXJrZXJzRmFjdG9yeShtYXJrZXJzKSxcbiAgICBoYXNOYW1lRm9ySWQ6IGhhc05hbWVGb3JJZChuYW1lcyksXG4gICAgaW5zZXJ0TWFya2VyOiBpbnNlcnRNYXJrZXIsXG4gICAgaW5zZXJ0UnVsZXM6IGluc2VydFJ1bGVzLFxuICAgIHJlbW92ZVJ1bGVzOiByZW1vdmVSdWxlcyxcbiAgICBzZWFsZWQ6IGZhbHNlLFxuICAgIHN0eWxlVGFnOiBudWxsLFxuICAgIHRvRWxlbWVudDogd3JhcEFzRWxlbWVudChjc3MsIG5hbWVzKSxcbiAgICB0b0hUTUw6IHdyYXBBc0h0bWxUYWcoY3NzLCBuYW1lcylcbiAgfTtcblxuICByZXR1cm4gdGFnO1xufTtcblxudmFyIG1ha2VUYWcgPSBmdW5jdGlvbiBtYWtlVGFnKHRhcmdldCwgdGFnRWwsIGZvcmNlU2VydmVyLCBpbnNlcnRCZWZvcmUsIGdldEltcG9ydFJ1bGVUYWcpIHtcbiAgaWYgKElTX0JST1dTRVIgJiYgIWZvcmNlU2VydmVyKSB7XG4gICAgdmFyIGVsID0gbWFrZVN0eWxlVGFnKHRhcmdldCwgdGFnRWwsIGluc2VydEJlZm9yZSk7XG5cbiAgICBpZiAoRElTQUJMRV9TUEVFRFkpIHtcbiAgICAgIHJldHVybiBtYWtlQnJvd3NlclRhZyhlbCwgZ2V0SW1wb3J0UnVsZVRhZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtYWtlU3BlZWR5VGFnKGVsLCBnZXRJbXBvcnRSdWxlVGFnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWFrZVNlcnZlclRhZygpO1xufTtcblxudmFyIHJlaHlkcmF0ZSA9IGZ1bmN0aW9uIHJlaHlkcmF0ZSh0YWcsIGVscywgZXh0cmFjdGVkKSB7XG4gIC8qIGFkZCBhbGwgZXh0cmFjdGVkIGNvbXBvbmVudHMgdG8gdGhlIG5ldyB0YWcgKi9cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV4dHJhY3RlZC5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgIHZhciBfZXh0cmFjdGVkJGkgPSBleHRyYWN0ZWRbaV0sXG4gICAgICAgIGNvbXBvbmVudElkID0gX2V4dHJhY3RlZCRpLmNvbXBvbmVudElkLFxuICAgICAgICBjc3NGcm9tRE9NID0gX2V4dHJhY3RlZCRpLmNzc0Zyb21ET007XG5cbiAgICB2YXIgY3NzUnVsZXMgPSBzcGxpdEJ5UnVsZXMoY3NzRnJvbURPTSk7XG4gICAgdGFnLmluc2VydFJ1bGVzKGNvbXBvbmVudElkLCBjc3NSdWxlcyk7XG4gIH1cblxuICAvKiByZW1vdmUgb2xkIEhUTUxTdHlsZUVsZW1lbnRzLCBzaW5jZSB0aGV5IGhhdmUgYmVlbiByZWh5ZHJhdGVkICovXG4gIGZvciAodmFyIF9pID0gMCwgX2xlbiA9IGVscy5sZW5ndGg7IF9pIDwgX2xlbjsgX2kgKz0gMSkge1xuICAgIHZhciBlbCA9IGVsc1tfaV07XG4gICAgaWYgKGVsLnBhcmVudE5vZGUpIHtcbiAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gXG5cbnZhciBTUExJVF9SRUdFWCA9IC9cXHMrLztcblxuLyogZGV0ZXJtaW5lIHRoZSBtYXhpbXVtIG51bWJlciBvZiBjb21wb25lbnRzIGJlZm9yZSB0YWdzIGFyZSBzaGFyZGVkICovXG52YXIgTUFYX1NJWkUgPSB2b2lkIDA7XG5pZiAoSVNfQlJPV1NFUikge1xuICAvKiBpbiBzcGVlZHkgbW9kZSB3ZSBjYW4ga2VlcCBhIGxvdCBtb3JlIHJ1bGVzIGluIGEgc2hlZXQgYmVmb3JlIGEgc2xvd2Rvd24gY2FuIGJlIGV4cGVjdGVkICovXG4gIE1BWF9TSVpFID0gRElTQUJMRV9TUEVFRFkgPyA0MCA6IDEwMDA7XG59IGVsc2Uge1xuICAvKiBmb3Igc2VydmVycyB3ZSBkbyBub3QgbmVlZCB0byBzaGFyZCBhdCBhbGwgKi9cbiAgTUFYX1NJWkUgPSAtMTtcbn1cblxudmFyIHNoZWV0UnVubmluZ0lkID0gMDtcbnZhciBtYXN0ZXIgPSB2b2lkIDA7XG5cbnZhciBTdHlsZVNoZWV0ID0gZnVuY3Rpb24gKCkge1xuXG4gIC8qIGEgbWFwIGZyb20gaWRzIHRvIHRhZ3MgKi9cblxuICAvKiBkZWZlcnJlZCBydWxlcyBmb3IgYSBnaXZlbiBpZCAqL1xuXG4gIC8qIHRoaXMgaXMgdXNlZCBmb3Igbm90IHJlaW5qZWN0aW5nIHJ1bGVzIHZpYSBoYXNOYW1lRm9ySWQoKSAqL1xuXG4gIC8qIHdoZW4gcnVsZXMgZm9yIGFuIGlkIGFyZSByZW1vdmVkIHVzaW5nIHJlbW92ZSgpIHdlIGhhdmUgdG8gaWdub3JlIHJlaHlkcmF0ZWROYW1lcyBmb3IgaXQgKi9cblxuICAvKiBhIGxpc3Qgb2YgdGFncyBiZWxvbmdpbmcgdG8gdGhpcyBTdHlsZVNoZWV0ICovXG5cbiAgLyogYSB0YWcgZm9yIGltcG9ydCBydWxlcyAqL1xuXG4gIC8qIGN1cnJlbnQgY2FwYWNpdHkgdW50aWwgYSBuZXcgdGFnIG11c3QgYmUgY3JlYXRlZCAqL1xuXG4gIC8qIGNoaWxkcmVuIChha2EgY2xvbmVzKSBvZiB0aGlzIFN0eWxlU2hlZXQgaW5oZXJpdGluZyBhbGwgYW5kIGZ1dHVyZSBpbmplY3Rpb25zICovXG5cbiAgZnVuY3Rpb24gU3R5bGVTaGVldCgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHRhcmdldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogSVNfQlJPV1NFUiA/IGRvY3VtZW50LmhlYWQgOiBudWxsO1xuICAgIHZhciBmb3JjZVNlcnZlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgU3R5bGVTaGVldCk7XG5cbiAgICB0aGlzLmdldEltcG9ydFJ1bGVUYWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW1wb3J0UnVsZVRhZyA9IF90aGlzLmltcG9ydFJ1bGVUYWc7XG5cbiAgICAgIGlmIChpbXBvcnRSdWxlVGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGltcG9ydFJ1bGVUYWc7XG4gICAgICB9XG5cbiAgICAgIHZhciBmaXJzdFRhZyA9IF90aGlzLnRhZ3NbMF07XG4gICAgICB2YXIgaW5zZXJ0QmVmb3JlID0gdHJ1ZTtcblxuICAgICAgcmV0dXJuIF90aGlzLmltcG9ydFJ1bGVUYWcgPSBtYWtlVGFnKF90aGlzLnRhcmdldCwgZmlyc3RUYWcgPyBmaXJzdFRhZy5zdHlsZVRhZyA6IG51bGwsIF90aGlzLmZvcmNlU2VydmVyLCBpbnNlcnRCZWZvcmUpO1xuICAgIH07XG5cbiAgICBzaGVldFJ1bm5pbmdJZCArPSAxO1xuICAgIHRoaXMuaWQgPSBzaGVldFJ1bm5pbmdJZDtcbiAgICB0aGlzLmZvcmNlU2VydmVyID0gZm9yY2VTZXJ2ZXI7XG4gICAgdGhpcy50YXJnZXQgPSBmb3JjZVNlcnZlciA/IG51bGwgOiB0YXJnZXQ7XG4gICAgdGhpcy50YWdNYXAgPSB7fTtcbiAgICB0aGlzLmRlZmVycmVkID0ge307XG4gICAgdGhpcy5yZWh5ZHJhdGVkTmFtZXMgPSB7fTtcbiAgICB0aGlzLmlnbm9yZVJlaHlkcmF0ZWROYW1lcyA9IHt9O1xuICAgIHRoaXMudGFncyA9IFtdO1xuICAgIHRoaXMuY2FwYWNpdHkgPSAxO1xuICAgIHRoaXMuY2xvbmVzID0gW107XG4gIH1cblxuICAvKiByZWh5ZHJhdGUgYWxsIFNTUidkIHN0eWxlIHRhZ3MgKi9cblxuXG4gIFN0eWxlU2hlZXQucHJvdG90eXBlLnJlaHlkcmF0ZSA9IGZ1bmN0aW9uIHJlaHlkcmF0ZSQkMSgpIHtcbiAgICBpZiAoIUlTX0JST1dTRVIgfHwgdGhpcy5mb3JjZVNlcnZlcikgcmV0dXJuIHRoaXM7XG5cbiAgICB2YXIgZWxzID0gW107XG4gICAgdmFyIGV4dHJhY3RlZCA9IFtdO1xuICAgIHZhciBpc1N0cmVhbWVkID0gZmFsc2U7XG5cbiAgICAvKiByZXRyaWV2ZSBhbGwgb2Ygb3VyIFNTUiBzdHlsZSBlbGVtZW50cyBmcm9tIHRoZSBET00gKi9cbiAgICB2YXIgbm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzdHlsZVsnICsgU0NfQVRUUiArICddWycgKyBTQ19WRVJTSU9OX0FUVFIgKyAnPVwiJyArIFwiNC40LjFcIiArICdcIl0nKTtcblxuICAgIHZhciBub2Rlc1NpemUgPSBub2Rlcy5sZW5ndGg7XG5cbiAgICAvKiBhYm9ydCByZWh5ZHJhdGlvbiBpZiBubyBwcmV2aW91cyBzdHlsZSB0YWdzIHdlcmUgZm91bmQgKi9cbiAgICBpZiAoIW5vZGVzU2l6ZSkgcmV0dXJuIHRoaXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzU2l6ZTsgaSArPSAxKSB7XG4gICAgICB2YXIgZWwgPSBub2Rlc1tpXTtcblxuICAgICAgLyogY2hlY2sgaWYgc3R5bGUgdGFnIGlzIGEgc3RyZWFtZWQgdGFnICovXG4gICAgICBpZiAoIWlzU3RyZWFtZWQpIGlzU3RyZWFtZWQgPSAhIWVsLmdldEF0dHJpYnV0ZShTQ19TVFJFQU1fQVRUUik7XG5cbiAgICAgIC8qIHJldHJpZXZlIGFsbCBjb21wb25lbnQgbmFtZXMgKi9cbiAgICAgIHZhciBlbE5hbWVzID0gKGVsLmdldEF0dHJpYnV0ZShTQ19BVFRSKSB8fCAnJykudHJpbSgpLnNwbGl0KFNQTElUX1JFR0VYKTtcbiAgICAgIHZhciBlbE5hbWVzU2l6ZSA9IGVsTmFtZXMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaiA9IDAsIG5hbWU7IGogPCBlbE5hbWVzU2l6ZTsgaiArPSAxKSB7XG4gICAgICAgIG5hbWUgPSBlbE5hbWVzW2pdO1xuICAgICAgICAvKiBhZGQgcmVoeWRyYXRlZCBuYW1lIHRvIHNoZWV0IHRvIGF2b2lkIHJlLWFkZGluZyBzdHlsZXMgKi9cbiAgICAgICAgdGhpcy5yZWh5ZHJhdGVkTmFtZXNbbmFtZV0gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvKiBleHRyYWN0IGFsbCBjb21wb25lbnRzIGFuZCB0aGVpciBDU1MgKi9cbiAgICAgIGV4dHJhY3RlZC5wdXNoLmFwcGx5KGV4dHJhY3RlZCwgZXh0cmFjdENvbXBzKGVsLnRleHRDb250ZW50KSk7XG5cbiAgICAgIC8qIHN0b3JlIG9yaWdpbmFsIEhUTUxTdHlsZUVsZW1lbnQgKi9cbiAgICAgIGVscy5wdXNoKGVsKTtcbiAgICB9XG5cbiAgICAvKiBhYm9ydCByZWh5ZHJhdGlvbiBpZiBub3RoaW5nIHdhcyBleHRyYWN0ZWQgKi9cbiAgICB2YXIgZXh0cmFjdGVkU2l6ZSA9IGV4dHJhY3RlZC5sZW5ndGg7XG4gICAgaWYgKCFleHRyYWN0ZWRTaXplKSByZXR1cm4gdGhpcztcblxuICAgIC8qIGNyZWF0ZSBhIHRhZyB0byBiZSB1c2VkIGZvciByZWh5ZHJhdGlvbiAqL1xuICAgIHZhciB0YWcgPSB0aGlzLm1ha2VUYWcobnVsbCk7XG5cbiAgICByZWh5ZHJhdGUodGFnLCBlbHMsIGV4dHJhY3RlZCk7XG5cbiAgICAvKiByZXNldCBjYXBhY2l0eSBhbmQgYWRqdXN0IE1BWF9TSVpFIGJ5IHRoZSBpbml0aWFsIHNpemUgb2YgdGhlIHJlaHlkcmF0aW9uICovXG4gICAgdGhpcy5jYXBhY2l0eSA9IE1hdGgubWF4KDEsIE1BWF9TSVpFIC0gZXh0cmFjdGVkU2l6ZSk7XG4gICAgdGhpcy50YWdzLnB1c2godGFnKTtcblxuICAgIC8qIHJldHJpZXZlIGFsbCBjb21wb25lbnQgaWRzICovXG4gICAgZm9yICh2YXIgX2ogPSAwOyBfaiA8IGV4dHJhY3RlZFNpemU7IF9qICs9IDEpIHtcbiAgICAgIHRoaXMudGFnTWFwW2V4dHJhY3RlZFtfal0uY29tcG9uZW50SWRdID0gdGFnO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qIHJldHJpZXZlIGEgXCJtYXN0ZXJcIiBpbnN0YW5jZSBvZiBTdHlsZVNoZWV0IHdoaWNoIGlzIHR5cGljYWxseSB1c2VkIHdoZW4gbm8gb3RoZXIgaXMgYXZhaWxhYmxlXG4gICAqIFRoZSBtYXN0ZXIgU3R5bGVTaGVldCBpcyB0YXJnZXRlZCBieSBjcmVhdGVHbG9iYWxTdHlsZSwga2V5ZnJhbWVzLCBhbmQgY29tcG9uZW50cyBvdXRzaWRlIG9mIGFueVxuICAgICogU3R5bGVTaGVldE1hbmFnZXIncyBjb250ZXh0ICovXG5cblxuICAvKiByZXNldCB0aGUgaW50ZXJuYWwgXCJtYXN0ZXJcIiBpbnN0YW5jZSAqL1xuICBTdHlsZVNoZWV0LnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgdmFyIGZvcmNlU2VydmVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBmYWxzZTtcblxuICAgIG1hc3RlciA9IG5ldyBTdHlsZVNoZWV0KHVuZGVmaW5lZCwgZm9yY2VTZXJ2ZXIpLnJlaHlkcmF0ZSgpO1xuICB9O1xuXG4gIC8qIGFkZHMgXCJjaGlsZHJlblwiIHRvIHRoZSBTdHlsZVNoZWV0IHRoYXQgaW5oZXJpdCBhbGwgb2YgdGhlIHBhcmVudHMnIHJ1bGVzXG4gICAqIHdoaWxlIHRoZWlyIG93biBydWxlcyBkbyBub3QgYWZmZWN0IHRoZSBwYXJlbnQgKi9cblxuXG4gIFN0eWxlU2hlZXQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gY2xvbmUoKSB7XG4gICAgdmFyIHNoZWV0ID0gbmV3IFN0eWxlU2hlZXQodGhpcy50YXJnZXQsIHRoaXMuZm9yY2VTZXJ2ZXIpO1xuXG4gICAgLyogYWRkIHRvIGNsb25lIGFycmF5ICovXG4gICAgdGhpcy5jbG9uZXMucHVzaChzaGVldCk7XG5cbiAgICAvKiBjbG9uZSBhbGwgdGFncyAqL1xuICAgIHNoZWV0LnRhZ3MgPSB0aGlzLnRhZ3MubWFwKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgIHZhciBpZHMgPSB0YWcuZ2V0SWRzKCk7XG4gICAgICB2YXIgbmV3VGFnID0gdGFnLmNsb25lKCk7XG5cbiAgICAgIC8qIHJlY29uc3RydWN0IHRhZ01hcCAqL1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgc2hlZXQudGFnTWFwW2lkc1tpXV0gPSBuZXdUYWc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdUYWc7XG4gICAgfSk7XG5cbiAgICAvKiBjbG9uZSBvdGhlciBtYXBzICovXG4gICAgc2hlZXQucmVoeWRyYXRlZE5hbWVzID0gX2V4dGVuZHMoe30sIHRoaXMucmVoeWRyYXRlZE5hbWVzKTtcbiAgICBzaGVldC5kZWZlcnJlZCA9IF9leHRlbmRzKHt9LCB0aGlzLmRlZmVycmVkKTtcblxuICAgIHJldHVybiBzaGVldDtcbiAgfTtcblxuICAvKiBmb3JjZSBTdHlsZVNoZWV0IHRvIGNyZWF0ZSBhIG5ldyB0YWcgb24gdGhlIG5leHQgaW5qZWN0aW9uICovXG5cblxuICBTdHlsZVNoZWV0LnByb3RvdHlwZS5zZWFsQWxsVGFncyA9IGZ1bmN0aW9uIHNlYWxBbGxUYWdzKCkge1xuICAgIHRoaXMuY2FwYWNpdHkgPSAxO1xuXG4gICAgdGhpcy50YWdzLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICB0YWcuc2VhbGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfTtcblxuICBTdHlsZVNoZWV0LnByb3RvdHlwZS5tYWtlVGFnID0gZnVuY3Rpb24gbWFrZVRhZyQkMSh0YWcpIHtcbiAgICB2YXIgbGFzdEVsID0gdGFnID8gdGFnLnN0eWxlVGFnIDogbnVsbDtcbiAgICB2YXIgaW5zZXJ0QmVmb3JlID0gZmFsc2U7XG5cbiAgICByZXR1cm4gbWFrZVRhZyh0aGlzLnRhcmdldCwgbGFzdEVsLCB0aGlzLmZvcmNlU2VydmVyLCBpbnNlcnRCZWZvcmUsIHRoaXMuZ2V0SW1wb3J0UnVsZVRhZyk7XG4gIH07XG5cbiAgLyogZ2V0IGEgdGFnIGZvciBhIGdpdmVuIGNvbXBvbmVudElkLCBhc3NpZ24gdGhlIGNvbXBvbmVudElkIHRvIG9uZSwgb3Igc2hhcmQgKi9cbiAgU3R5bGVTaGVldC5wcm90b3R5cGUuZ2V0VGFnRm9ySWQgPSBmdW5jdGlvbiBnZXRUYWdGb3JJZChpZCkge1xuICAgIC8qIHNpbXBseSByZXR1cm4gYSB0YWcsIHdoZW4gdGhlIGNvbXBvbmVudElkIHdhcyBhbHJlYWR5IGFzc2lnbmVkIG9uZSAqL1xuICAgIHZhciBwcmV2ID0gdGhpcy50YWdNYXBbaWRdO1xuICAgIGlmIChwcmV2ICE9PSB1bmRlZmluZWQgJiYgIXByZXYuc2VhbGVkKSB7XG4gICAgICByZXR1cm4gcHJldjtcbiAgICB9XG5cbiAgICB2YXIgdGFnID0gdGhpcy50YWdzW3RoaXMudGFncy5sZW5ndGggLSAxXTtcblxuICAgIC8qIHNoYXJkIChjcmVhdGUgYSBuZXcgdGFnKSBpZiB0aGUgdGFnIGlzIGV4aGF1c3RlZCAoU2VlIE1BWF9TSVpFKSAqL1xuICAgIHRoaXMuY2FwYWNpdHkgLT0gMTtcblxuICAgIGlmICh0aGlzLmNhcGFjaXR5ID09PSAwKSB7XG4gICAgICB0aGlzLmNhcGFjaXR5ID0gTUFYX1NJWkU7XG4gICAgICB0YWcgPSB0aGlzLm1ha2VUYWcodGFnKTtcbiAgICAgIHRoaXMudGFncy5wdXNoKHRhZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudGFnTWFwW2lkXSA9IHRhZztcbiAgfTtcblxuICAvKiBtYWlubHkgZm9yIGNyZWF0ZUdsb2JhbFN0eWxlIHRvIGNoZWNrIGZvciBpdHMgaWQgKi9cblxuXG4gIFN0eWxlU2hlZXQucHJvdG90eXBlLmhhc0lkID0gZnVuY3Rpb24gaGFzSWQoaWQpIHtcbiAgICByZXR1cm4gdGhpcy50YWdNYXBbaWRdICE9PSB1bmRlZmluZWQ7XG4gIH07XG5cbiAgLyogY2FjaGluZyBsYXllciBjaGVja2luZyBpZCtuYW1lIHRvIGFscmVhZHkgaGF2ZSBhIGNvcnJlc3BvbmRpbmcgdGFnIGFuZCBpbmplY3RlZCBydWxlcyAqL1xuXG5cbiAgU3R5bGVTaGVldC5wcm90b3R5cGUuaGFzTmFtZUZvcklkID0gZnVuY3Rpb24gaGFzTmFtZUZvcklkKGlkLCBuYW1lKSB7XG4gICAgLyogZXhjZXB0aW9uIGZvciByZWh5ZHJhdGVkIG5hbWVzIHdoaWNoIGFyZSBjaGVja2VkIHNlcGFyYXRlbHkgKi9cbiAgICBpZiAodGhpcy5pZ25vcmVSZWh5ZHJhdGVkTmFtZXNbaWRdID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWh5ZHJhdGVkTmFtZXNbbmFtZV0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciB0YWcgPSB0aGlzLnRhZ01hcFtpZF07XG4gICAgcmV0dXJuIHRhZyAhPT0gdW5kZWZpbmVkICYmIHRhZy5oYXNOYW1lRm9ySWQoaWQsIG5hbWUpO1xuICB9O1xuXG4gIC8qIHJlZ2lzdGVycyBhIGNvbXBvbmVudElkIGFuZCByZWdpc3RlcnMgaXQgb24gaXRzIHRhZyAqL1xuXG5cbiAgU3R5bGVTaGVldC5wcm90b3R5cGUuZGVmZXJyZWRJbmplY3QgPSBmdW5jdGlvbiBkZWZlcnJlZEluamVjdChpZCwgY3NzUnVsZXMpIHtcbiAgICAvKiBkb24ndCBpbmplY3Qgd2hlbiB0aGUgaWQgaXMgYWxyZWFkeSByZWdpc3RlcmVkICovXG4gICAgaWYgKHRoaXMudGFnTWFwW2lkXSAhPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICB2YXIgY2xvbmVzID0gdGhpcy5jbG9uZXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsb25lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY2xvbmVzW2ldLmRlZmVycmVkSW5qZWN0KGlkLCBjc3NSdWxlcyk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRUYWdGb3JJZChpZCkuaW5zZXJ0TWFya2VyKGlkKTtcbiAgICB0aGlzLmRlZmVycmVkW2lkXSA9IGNzc1J1bGVzO1xuICB9O1xuXG4gIC8qIGluamVjdHMgcnVsZXMgZm9yIGEgZ2l2ZW4gaWQgd2l0aCBhIG5hbWUgdGhhdCB3aWxsIG5lZWQgdG8gYmUgY2FjaGVkICovXG5cblxuICBTdHlsZVNoZWV0LnByb3RvdHlwZS5pbmplY3QgPSBmdW5jdGlvbiBpbmplY3QoaWQsIGNzc1J1bGVzLCBuYW1lKSB7XG4gICAgdmFyIGNsb25lcyA9IHRoaXMuY2xvbmVzO1xuXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsb25lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY2xvbmVzW2ldLmluamVjdChpZCwgY3NzUnVsZXMsIG5hbWUpO1xuICAgIH1cblxuICAgIHZhciB0YWcgPSB0aGlzLmdldFRhZ0ZvcklkKGlkKTtcblxuICAgIC8qIGFkZCBkZWZlcnJlZCBydWxlcyBmb3IgY29tcG9uZW50ICovXG4gICAgaWYgKHRoaXMuZGVmZXJyZWRbaWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIENvbWJpbmUgcGFzc2VkIGNzc1J1bGVzIHdpdGggcHJldmlvdXNseSBkZWZlcnJlZCBDU1MgcnVsZXNcbiAgICAgIC8vIE5PVEU6IFdlIGNhbm5vdCBtdXRhdGUgdGhlIGRlZmVycmVkIGFycmF5IGl0c2VsZiBhcyBhbGwgY2xvbmVzXG4gICAgICAvLyBkbyB0aGUgc2FtZSAoc2VlIGNsb25lc1tpXS5pbmplY3QpXG4gICAgICB2YXIgcnVsZXMgPSB0aGlzLmRlZmVycmVkW2lkXS5jb25jYXQoY3NzUnVsZXMpO1xuICAgICAgdGFnLmluc2VydFJ1bGVzKGlkLCBydWxlcywgbmFtZSk7XG5cbiAgICAgIHRoaXMuZGVmZXJyZWRbaWRdID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWcuaW5zZXJ0UnVsZXMoaWQsIGNzc1J1bGVzLCBuYW1lKTtcbiAgICB9XG4gIH07XG5cbiAgLyogcmVtb3ZlcyBhbGwgcnVsZXMgZm9yIGEgZ2l2ZW4gaWQsIHdoaWNoIGRvZXNuJ3QgcmVtb3ZlIGl0cyBtYXJrZXIgYnV0IHJlc2V0cyBpdCAqL1xuXG5cbiAgU3R5bGVTaGVldC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gICAgdmFyIHRhZyA9IHRoaXMudGFnTWFwW2lkXTtcbiAgICBpZiAodGFnID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIHZhciBjbG9uZXMgPSB0aGlzLmNsb25lcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xvbmVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjbG9uZXNbaV0ucmVtb3ZlKGlkKTtcbiAgICB9XG5cbiAgICAvKiByZW1vdmUgYWxsIHJ1bGVzIGZyb20gdGhlIHRhZyAqL1xuICAgIHRhZy5yZW1vdmVSdWxlcyhpZCk7XG5cbiAgICAvKiBpZ25vcmUgcG9zc2libGUgcmVoeWRyYXRlZCBuYW1lcyAqL1xuICAgIHRoaXMuaWdub3JlUmVoeWRyYXRlZE5hbWVzW2lkXSA9IHRydWU7XG5cbiAgICAvKiBkZWxldGUgcG9zc2libGUgZGVmZXJyZWQgcnVsZXMgKi9cbiAgICB0aGlzLmRlZmVycmVkW2lkXSA9IHVuZGVmaW5lZDtcbiAgfTtcblxuICBTdHlsZVNoZWV0LnByb3RvdHlwZS50b0hUTUwgPSBmdW5jdGlvbiB0b0hUTUwoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFncy5tYXAoZnVuY3Rpb24gKHRhZykge1xuICAgICAgcmV0dXJuIHRhZy50b0hUTUwoKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfTtcblxuICBTdHlsZVNoZWV0LnByb3RvdHlwZS50b1JlYWN0RWxlbWVudHMgPSBmdW5jdGlvbiB0b1JlYWN0RWxlbWVudHMoKSB7XG4gICAgdmFyIGlkID0gdGhpcy5pZDtcblxuXG4gICAgcmV0dXJuIHRoaXMudGFncy5tYXAoZnVuY3Rpb24gKHRhZywgaSkge1xuICAgICAgdmFyIGtleSA9ICdzYy0nICsgaWQgKyAnLScgKyBpO1xuICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudCh0YWcudG9FbGVtZW50KCksIHsga2V5OiBrZXkgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY3JlYXRlQ2xhc3MoU3R5bGVTaGVldCwgbnVsbCwgW3tcbiAgICBrZXk6ICdtYXN0ZXInLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIG1hc3RlciB8fCAobWFzdGVyID0gbmV3IFN0eWxlU2hlZXQoKS5yZWh5ZHJhdGUoKSk7XG4gICAgfVxuXG4gICAgLyogTk9URTogVGhpcyBpcyBqdXN0IGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSB3aXRoIGplc3Qtc3R5bGVkLWNvbXBvbmVudHMgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaW5zdGFuY2UnLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgcmV0dXJuIFN0eWxlU2hlZXQubWFzdGVyO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gU3R5bGVTaGVldDtcbn0oKTtcblxuLy8gXG5cbnZhciBLZXlmcmFtZXMgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEtleWZyYW1lcyhuYW1lLCBydWxlcykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBLZXlmcmFtZXMpO1xuXG4gICAgdGhpcy5pbmplY3QgPSBmdW5jdGlvbiAoc3R5bGVTaGVldCkge1xuICAgICAgaWYgKCFzdHlsZVNoZWV0Lmhhc05hbWVGb3JJZChfdGhpcy5pZCwgX3RoaXMubmFtZSkpIHtcbiAgICAgICAgc3R5bGVTaGVldC5pbmplY3QoX3RoaXMuaWQsIF90aGlzLnJ1bGVzLCBfdGhpcy5uYW1lKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRocm93IG5ldyBTdHlsZWRDb21wb25lbnRzRXJyb3IoMTIsIFN0cmluZyhfdGhpcy5uYW1lKSk7XG4gICAgfTtcblxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5ydWxlcyA9IHJ1bGVzO1xuXG4gICAgdGhpcy5pZCA9ICdzYy1rZXlmcmFtZXMtJyArIG5hbWU7XG4gIH1cblxuICBLZXlmcmFtZXMucHJvdG90eXBlLmdldE5hbWUgPSBmdW5jdGlvbiBnZXROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH07XG5cbiAgcmV0dXJuIEtleWZyYW1lcztcbn0oKTtcblxuLy8gXG5cbi8qKlxuICogaW5saW5lZCB2ZXJzaW9uIG9mXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmJqcy9ibG9iL21hc3Rlci9wYWNrYWdlcy9mYmpzL3NyYy9jb3JlL2h5cGhlbmF0ZVN0eWxlTmFtZS5qc1xuICovXG5cbnZhciB1cHBlcmNhc2VQYXR0ZXJuID0gLyhbQS1aXSkvZztcbnZhciBtc1BhdHRlcm4gPSAvXm1zLS87XG5cbi8qKlxuICogSHlwaGVuYXRlcyBhIGNhbWVsY2FzZWQgQ1NTIHByb3BlcnR5IG5hbWUsIGZvciBleGFtcGxlOlxuICpcbiAqICAgPiBoeXBoZW5hdGVTdHlsZU5hbWUoJ2JhY2tncm91bmRDb2xvcicpXG4gKiAgIDwgXCJiYWNrZ3JvdW5kLWNvbG9yXCJcbiAqICAgPiBoeXBoZW5hdGVTdHlsZU5hbWUoJ01velRyYW5zaXRpb24nKVxuICogICA8IFwiLW1vei10cmFuc2l0aW9uXCJcbiAqICAgPiBoeXBoZW5hdGVTdHlsZU5hbWUoJ21zVHJhbnNpdGlvbicpXG4gKiAgIDwgXCItbXMtdHJhbnNpdGlvblwiXG4gKlxuICogQXMgTW9kZXJuaXpyIHN1Z2dlc3RzIChodHRwOi8vbW9kZXJuaXpyLmNvbS9kb2NzLyNwcmVmaXhlZCksIGFuIGBtc2AgcHJlZml4XG4gKiBpcyBjb252ZXJ0ZWQgdG8gYC1tcy1gLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gaHlwaGVuYXRlU3R5bGVOYW1lKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UodXBwZXJjYXNlUGF0dGVybiwgJy0kMScpLnRvTG93ZXJDYXNlKCkucmVwbGFjZShtc1BhdHRlcm4sICctbXMtJyk7XG59XG5cbi8vIFxuXG4vLyBUYWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I4N2FhYmRmZTFiNzQ2MWU3MzMxYWJiMzYwMWQ5ZTZiYjI3NTQ0YmMvcGFja2FnZXMvcmVhY3QtZG9tL3NyYy9zaGFyZWQvZGFuZ2Vyb3VzU3R5bGVWYWx1ZS5qc1xuZnVuY3Rpb24gYWRkVW5pdElmTmVlZGVkKG5hbWUsIHZhbHVlKSB7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbWlsYWphY2svZXNsaW50LXBsdWdpbi1mbG93dHlwZS1lcnJvcnMvaXNzdWVzLzEzM1xuICAvLyAkRmxvd0ZpeE1lXG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIHx8IHZhbHVlID09PSAnJykge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIHZhbHVlICE9PSAwICYmICEobmFtZSBpbiB1bml0bGVzcykpIHtcbiAgICByZXR1cm4gdmFsdWUgKyAncHgnOyAvLyBQcmVzdW1lcyBpbXBsaWNpdCAncHgnIHN1ZmZpeCBmb3IgdW5pdGxlc3MgbnVtYmVyc1xuICB9XG5cbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSkudHJpbSgpO1xufVxuXG4vLyBcblxuLyoqXG4gKiBJdCdzIGZhbHNpc2ggbm90IGZhbHN5IGJlY2F1c2UgMCBpcyBhbGxvd2VkLlxuICovXG52YXIgaXNGYWxzaXNoID0gZnVuY3Rpb24gaXNGYWxzaXNoKGNodW5rKSB7XG4gIHJldHVybiBjaHVuayA9PT0gdW5kZWZpbmVkIHx8IGNodW5rID09PSBudWxsIHx8IGNodW5rID09PSBmYWxzZSB8fCBjaHVuayA9PT0gJyc7XG59O1xuXG52YXIgb2JqVG9Dc3NBcnJheSA9IGZ1bmN0aW9uIG9ialRvQ3NzQXJyYXkob2JqLCBwcmV2S2V5KSB7XG4gIHZhciBydWxlcyA9IFtdO1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG5cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIWlzRmFsc2lzaChvYmpba2V5XSkpIHtcbiAgICAgIGlmIChpc1BsYWluT2JqZWN0KG9ialtrZXldKSkge1xuICAgICAgICBydWxlcy5wdXNoLmFwcGx5KHJ1bGVzLCBvYmpUb0Nzc0FycmF5KG9ialtrZXldLCBrZXkpKTtcblxuICAgICAgICByZXR1cm4gcnVsZXM7XG4gICAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24ob2JqW2tleV0pKSB7XG4gICAgICAgIHJ1bGVzLnB1c2goaHlwaGVuYXRlU3R5bGVOYW1lKGtleSkgKyAnOicsIG9ialtrZXldLCAnOycpO1xuXG4gICAgICAgIHJldHVybiBydWxlcztcbiAgICAgIH1cbiAgICAgIHJ1bGVzLnB1c2goaHlwaGVuYXRlU3R5bGVOYW1lKGtleSkgKyAnOiAnICsgYWRkVW5pdElmTmVlZGVkKGtleSwgb2JqW2tleV0pICsgJzsnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ1bGVzO1xuICB9KTtcblxuICByZXR1cm4gcHJldktleSA/IFtwcmV2S2V5ICsgJyB7J10uY29uY2F0KHJ1bGVzLCBbJ30nXSkgOiBydWxlcztcbn07XG5cbmZ1bmN0aW9uIGZsYXR0ZW4oY2h1bmssIGV4ZWN1dGlvbkNvbnRleHQsIHN0eWxlU2hlZXQpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoY2h1bmspKSB7XG4gICAgdmFyIHJ1bGVTZXQgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjaHVuay5sZW5ndGgsIHJlc3VsdDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICByZXN1bHQgPSBmbGF0dGVuKGNodW5rW2ldLCBleGVjdXRpb25Db250ZXh0LCBzdHlsZVNoZWV0KTtcblxuICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkgY29udGludWU7ZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSBydWxlU2V0LnB1c2guYXBwbHkocnVsZVNldCwgcmVzdWx0KTtlbHNlIHJ1bGVTZXQucHVzaChyZXN1bHQpO1xuICAgIH1cblxuICAgIHJldHVybiBydWxlU2V0O1xuICB9XG5cbiAgaWYgKGlzRmFsc2lzaChjaHVuaykpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qIEhhbmRsZSBvdGhlciBjb21wb25lbnRzICovXG4gIGlmIChpc1N0eWxlZENvbXBvbmVudChjaHVuaykpIHtcbiAgICByZXR1cm4gJy4nICsgY2h1bmsuc3R5bGVkQ29tcG9uZW50SWQ7XG4gIH1cblxuICAvKiBFaXRoZXIgZXhlY3V0ZSBvciBkZWZlciB0aGUgZnVuY3Rpb24gKi9cbiAgaWYgKGlzRnVuY3Rpb24oY2h1bmspKSB7XG4gICAgaWYgKGlzU3RhdGVsZXNzRnVuY3Rpb24oY2h1bmspICYmIGV4ZWN1dGlvbkNvbnRleHQpIHtcbiAgICAgIHZhciBfcmVzdWx0ID0gY2h1bmsoZXhlY3V0aW9uQ29udGV4dCk7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHJlYWN0SXMuaXNFbGVtZW50KF9yZXN1bHQpKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUud2FybihnZXRDb21wb25lbnROYW1lKGNodW5rKSArICcgaXMgbm90IGEgc3R5bGVkIGNvbXBvbmVudCBhbmQgY2Fubm90IGJlIHJlZmVycmVkIHRvIHZpYSBjb21wb25lbnQgc2VsZWN0b3IuIFNlZSBodHRwczovL3d3dy5zdHlsZWQtY29tcG9uZW50cy5jb20vZG9jcy9hZHZhbmNlZCNyZWZlcnJpbmctdG8tb3RoZXItY29tcG9uZW50cyBmb3IgbW9yZSBkZXRhaWxzLicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmxhdHRlbihfcmVzdWx0LCBleGVjdXRpb25Db250ZXh0LCBzdHlsZVNoZWV0KTtcbiAgICB9IGVsc2UgcmV0dXJuIGNodW5rO1xuICB9XG5cbiAgaWYgKGNodW5rIGluc3RhbmNlb2YgS2V5ZnJhbWVzKSB7XG4gICAgaWYgKHN0eWxlU2hlZXQpIHtcbiAgICAgIGNodW5rLmluamVjdChzdHlsZVNoZWV0KTtcbiAgICAgIHJldHVybiBjaHVuay5nZXROYW1lKCk7XG4gICAgfSBlbHNlIHJldHVybiBjaHVuaztcbiAgfVxuXG4gIC8qIEhhbmRsZSBvYmplY3RzICovXG4gIHJldHVybiBpc1BsYWluT2JqZWN0KGNodW5rKSA/IG9ialRvQ3NzQXJyYXkoY2h1bmspIDogY2h1bmsudG9TdHJpbmcoKTtcbn1cblxuLy8gXG5cbmZ1bmN0aW9uIGNzcyhzdHlsZXMpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGludGVycG9sYXRpb25zID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGludGVycG9sYXRpb25zW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIGlmIChpc0Z1bmN0aW9uKHN0eWxlcykgfHwgaXNQbGFpbk9iamVjdChzdHlsZXMpKSB7XG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHJldHVybiBmbGF0dGVuKGludGVybGVhdmUoRU1QVFlfQVJSQVksIFtzdHlsZXNdLmNvbmNhdChpbnRlcnBvbGF0aW9ucykpKTtcbiAgfVxuXG4gIC8vICRGbG93Rml4TWVcbiAgcmV0dXJuIGZsYXR0ZW4oaW50ZXJsZWF2ZShzdHlsZXMsIGludGVycG9sYXRpb25zKSk7XG59XG5cbi8vIFxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RXaXRoT3B0aW9ucyhjb21wb25lbnRDb25zdHJ1Y3RvciwgdGFnKSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBFTVBUWV9PQkpFQ1Q7XG5cbiAgaWYgKCFyZWFjdElzLmlzVmFsaWRFbGVtZW50VHlwZSh0YWcpKSB7XG4gICAgdGhyb3cgbmV3IFN0eWxlZENvbXBvbmVudHNFcnJvcigxLCBTdHJpbmcodGFnKSk7XG4gIH1cblxuICAvKiBUaGlzIGlzIGNhbGxhYmxlIGRpcmVjdGx5IGFzIGEgdGVtcGxhdGUgZnVuY3Rpb24gKi9cbiAgLy8gJEZsb3dGaXhNZTogTm90IHR5cGVkIHRvIGF2b2lkIGRlc3RydWN0dXJpbmcgYXJndW1lbnRzXG4gIHZhciB0ZW1wbGF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24gdGVtcGxhdGVGdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29tcG9uZW50Q29uc3RydWN0b3IodGFnLCBvcHRpb25zLCBjc3MuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpKTtcbiAgfTtcblxuICAvKiBJZiBjb25maWcgbWV0aG9kcyBhcmUgY2FsbGVkLCB3cmFwIHVwIGEgbmV3IHRlbXBsYXRlIGZ1bmN0aW9uIGFuZCBtZXJnZSBvcHRpb25zICovXG4gIHRlbXBsYXRlRnVuY3Rpb24ud2l0aENvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICByZXR1cm4gY29uc3RydWN0V2l0aE9wdGlvbnMoY29tcG9uZW50Q29uc3RydWN0b3IsIHRhZywgX2V4dGVuZHMoe30sIG9wdGlvbnMsIGNvbmZpZykpO1xuICB9O1xuXG4gIC8qIE1vZGlmeS9pbmplY3QgbmV3IHByb3BzIGF0IHJ1bnRpbWUgKi9cbiAgdGVtcGxhdGVGdW5jdGlvbi5hdHRycyA9IGZ1bmN0aW9uIChhdHRycykge1xuICAgIHJldHVybiBjb25zdHJ1Y3RXaXRoT3B0aW9ucyhjb21wb25lbnRDb25zdHJ1Y3RvciwgdGFnLCBfZXh0ZW5kcyh7fSwgb3B0aW9ucywge1xuICAgICAgYXR0cnM6IEFycmF5LnByb3RvdHlwZS5jb25jYXQob3B0aW9ucy5hdHRycywgYXR0cnMpLmZpbHRlcihCb29sZWFuKVxuICAgIH0pKTtcbiAgfTtcblxuICByZXR1cm4gdGVtcGxhdGVGdW5jdGlvbjtcbn1cblxuLy8gXG4vLyBTb3VyY2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9nYXJ5Y291cnQvbXVybXVyaGFzaC1qcy9ibG9iL21hc3Rlci9tdXJtdXJoYXNoMl9nYy5qc1xuZnVuY3Rpb24gbXVybXVyaGFzaChjKSB7XG4gIGZvciAodmFyIGUgPSBjLmxlbmd0aCB8IDAsIGEgPSBlIHwgMCwgZCA9IDAsIGI7IGUgPj0gNDspIHtcbiAgICBiID0gYy5jaGFyQ29kZUF0KGQpICYgMjU1IHwgKGMuY2hhckNvZGVBdCgrK2QpICYgMjU1KSA8PCA4IHwgKGMuY2hhckNvZGVBdCgrK2QpICYgMjU1KSA8PCAxNiB8IChjLmNoYXJDb2RlQXQoKytkKSAmIDI1NSkgPDwgMjQsIGIgPSAxNTQwNDgzNDc3ICogKGIgJiA2NTUzNSkgKyAoKDE1NDA0ODM0NzcgKiAoYiA+Pj4gMTYpICYgNjU1MzUpIDw8IDE2KSwgYiBePSBiID4+PiAyNCwgYiA9IDE1NDA0ODM0NzcgKiAoYiAmIDY1NTM1KSArICgoMTU0MDQ4MzQ3NyAqIChiID4+PiAxNikgJiA2NTUzNSkgPDwgMTYpLCBhID0gMTU0MDQ4MzQ3NyAqIChhICYgNjU1MzUpICsgKCgxNTQwNDgzNDc3ICogKGEgPj4+IDE2KSAmIDY1NTM1KSA8PCAxNikgXiBiLCBlIC09IDQsICsrZDtcbiAgfVxuICBzd2l0Y2ggKGUpIHtcbiAgICBjYXNlIDM6XG4gICAgICBhIF49IChjLmNoYXJDb2RlQXQoZCArIDIpICYgMjU1KSA8PCAxNjtcbiAgICBjYXNlIDI6XG4gICAgICBhIF49IChjLmNoYXJDb2RlQXQoZCArIDEpICYgMjU1KSA8PCA4O1xuICAgIGNhc2UgMTpcbiAgICAgIGEgXj0gYy5jaGFyQ29kZUF0KGQpICYgMjU1LCBhID0gMTU0MDQ4MzQ3NyAqIChhICYgNjU1MzUpICsgKCgxNTQwNDgzNDc3ICogKGEgPj4+IDE2KSAmIDY1NTM1KSA8PCAxNik7XG4gIH1cbiAgYSBePSBhID4+PiAxMztcbiAgYSA9IDE1NDA0ODM0NzcgKiAoYSAmIDY1NTM1KSArICgoMTU0MDQ4MzQ3NyAqIChhID4+PiAxNikgJiA2NTUzNSkgPDwgMTYpO1xuICByZXR1cm4gKGEgXiBhID4+PiAxNSkgPj4+IDA7XG59XG5cbi8vIFxuLyogZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSAqL1xuXG4vKiBUaGlzIGlzIHRoZSBcImNhcGFjaXR5XCIgb2Ygb3VyIGFscGhhYmV0IGkuZS4gMngyNiBmb3IgYWxsIGxldHRlcnMgcGx1cyB0aGVpciBjYXBpdGFsaXNlZFxuICogY291bnRlcnBhcnRzICovXG52YXIgY2hhcnNMZW5ndGggPSA1MjtcblxuLyogc3RhcnQgYXQgNzUgZm9yICdhJyB1bnRpbCAneicgKDI1KSBhbmQgdGhlbiBzdGFydCBhdCA2NSBmb3IgY2FwaXRhbGlzZWQgbGV0dGVycyAqL1xudmFyIGdldEFscGhhYmV0aWNDaGFyID0gZnVuY3Rpb24gZ2V0QWxwaGFiZXRpY0NoYXIoY29kZSkge1xuICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlICsgKGNvZGUgPiAyNSA/IDM5IDogOTcpKTtcbn07XG5cbi8qIGlucHV0IGEgbnVtYmVyLCB1c3VhbGx5IGEgaGFzaCBhbmQgY29udmVydCBpdCB0byBiYXNlLTUyICovXG5mdW5jdGlvbiBnZW5lcmF0ZUFscGhhYmV0aWNOYW1lKGNvZGUpIHtcbiAgdmFyIG5hbWUgPSAnJztcbiAgdmFyIHggPSB2b2lkIDA7XG5cbiAgLyogZ2V0IGEgY2hhciBhbmQgZGl2aWRlIGJ5IGFscGhhYmV0LWxlbmd0aCAqL1xuICBmb3IgKHggPSBjb2RlOyB4ID4gY2hhcnNMZW5ndGg7IHggPSBNYXRoLmZsb29yKHggLyBjaGFyc0xlbmd0aCkpIHtcbiAgICBuYW1lID0gZ2V0QWxwaGFiZXRpY0NoYXIoeCAlIGNoYXJzTGVuZ3RoKSArIG5hbWU7XG4gIH1cblxuICByZXR1cm4gZ2V0QWxwaGFiZXRpY0NoYXIoeCAlIGNoYXJzTGVuZ3RoKSArIG5hbWU7XG59XG5cbi8vIFxuXG5mdW5jdGlvbiBoYXNGdW5jdGlvbk9iamVjdEtleShvYmopIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGd1YXJkLWZvci1pbiwgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChpc0Z1bmN0aW9uKG9ialtrZXldKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1N0YXRpY1J1bGVzKHJ1bGVzLCBhdHRycykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgdmFyIHJ1bGUgPSBydWxlc1tpXTtcblxuICAgIC8vIHJlY3Vyc2l2ZSBjYXNlXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocnVsZSkgJiYgIWlzU3RhdGljUnVsZXMocnVsZSwgYXR0cnMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHJ1bGUpICYmICFpc1N0eWxlZENvbXBvbmVudChydWxlKSkge1xuICAgICAgLy8gZnVuY3Rpb25zIGFyZSBhbGxvd2VkIHRvIGJlIHN0YXRpYyBpZiB0aGV5J3JlIGp1c3QgYmVpbmdcbiAgICAgIC8vIHVzZWQgdG8gZ2V0IHRoZSBjbGFzc25hbWUgb2YgYSBuZXN0ZWQgc3R5bGVkIGNvbXBvbmVudFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhdHRycy5zb21lKGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oeCkgfHwgaGFzRnVuY3Rpb25PYmplY3RLZXkoeCk7XG4gIH0pKSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIFxuXG4vKiBjb21iaW5lcyBoYXNoU3RyIChtdXJtdXJoYXNoKSBhbmQgbmFtZUdlbmVyYXRvciBmb3IgY29udmVuaWVuY2UgKi9cbnZhciBoYXNoZXIgPSBmdW5jdGlvbiBoYXNoZXIoc3RyKSB7XG4gIHJldHVybiBnZW5lcmF0ZUFscGhhYmV0aWNOYW1lKG11cm11cmhhc2goc3RyKSk7XG59O1xuXG4vKlxuIENvbXBvbmVudFN0eWxlIGlzIGFsbCB0aGUgQ1NTLXNwZWNpZmljIHN0dWZmLCBub3RcbiB0aGUgUmVhY3Qtc3BlY2lmaWMgc3R1ZmYuXG4gKi9cblxudmFyIENvbXBvbmVudFN0eWxlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDb21wb25lbnRTdHlsZShydWxlcywgYXR0cnMsIGNvbXBvbmVudElkKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29tcG9uZW50U3R5bGUpO1xuXG4gICAgdGhpcy5ydWxlcyA9IHJ1bGVzO1xuICAgIHRoaXMuaXNTdGF0aWMgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nICYmIGlzU3RhdGljUnVsZXMocnVsZXMsIGF0dHJzKTtcbiAgICB0aGlzLmNvbXBvbmVudElkID0gY29tcG9uZW50SWQ7XG5cbiAgICBpZiAoIVN0eWxlU2hlZXQubWFzdGVyLmhhc0lkKGNvbXBvbmVudElkKSkge1xuICAgICAgU3R5bGVTaGVldC5tYXN0ZXIuZGVmZXJyZWRJbmplY3QoY29tcG9uZW50SWQsIFtdKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgKiBGbGF0dGVucyBhIHJ1bGUgc2V0IGludG8gdmFsaWQgQ1NTXG4gICAqIEhhc2hlcyBpdCwgd3JhcHMgdGhlIHdob2xlIGNodW5rIGluIGEgLmhhc2gxMjM0IHt9XG4gICAqIFJldHVybnMgdGhlIGhhc2ggdG8gYmUgaW5qZWN0ZWQgb24gcmVuZGVyKClcbiAgICogKi9cblxuXG4gIENvbXBvbmVudFN0eWxlLnByb3RvdHlwZS5nZW5lcmF0ZUFuZEluamVjdFN0eWxlcyA9IGZ1bmN0aW9uIGdlbmVyYXRlQW5kSW5qZWN0U3R5bGVzKGV4ZWN1dGlvbkNvbnRleHQsIHN0eWxlU2hlZXQpIHtcbiAgICB2YXIgaXNTdGF0aWMgPSB0aGlzLmlzU3RhdGljLFxuICAgICAgICBjb21wb25lbnRJZCA9IHRoaXMuY29tcG9uZW50SWQsXG4gICAgICAgIGxhc3RDbGFzc05hbWUgPSB0aGlzLmxhc3RDbGFzc05hbWU7XG5cbiAgICBpZiAoSVNfQlJPV1NFUiAmJiBpc1N0YXRpYyAmJiB0eXBlb2YgbGFzdENsYXNzTmFtZSA9PT0gJ3N0cmluZycgJiYgc3R5bGVTaGVldC5oYXNOYW1lRm9ySWQoY29tcG9uZW50SWQsIGxhc3RDbGFzc05hbWUpKSB7XG4gICAgICByZXR1cm4gbGFzdENsYXNzTmFtZTtcbiAgICB9XG5cbiAgICB2YXIgZmxhdENTUyA9IGZsYXR0ZW4odGhpcy5ydWxlcywgZXhlY3V0aW9uQ29udGV4dCwgc3R5bGVTaGVldCk7XG4gICAgdmFyIG5hbWUgPSBoYXNoZXIodGhpcy5jb21wb25lbnRJZCArIGZsYXRDU1Muam9pbignJykpO1xuICAgIGlmICghc3R5bGVTaGVldC5oYXNOYW1lRm9ySWQoY29tcG9uZW50SWQsIG5hbWUpKSB7XG4gICAgICBzdHlsZVNoZWV0LmluamVjdCh0aGlzLmNvbXBvbmVudElkLCBzdHJpbmdpZnlSdWxlcyhmbGF0Q1NTLCAnLicgKyBuYW1lLCB1bmRlZmluZWQsIGNvbXBvbmVudElkKSwgbmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0Q2xhc3NOYW1lID0gbmFtZTtcbiAgICByZXR1cm4gbmFtZTtcbiAgfTtcblxuICBDb21wb25lbnRTdHlsZS5nZW5lcmF0ZU5hbWUgPSBmdW5jdGlvbiBnZW5lcmF0ZU5hbWUoc3RyKSB7XG4gICAgcmV0dXJuIGhhc2hlcihzdHIpO1xuICB9O1xuXG4gIHJldHVybiBDb21wb25lbnRTdHlsZTtcbn0oKTtcblxuLy8gXG5cbnZhciBMSU1JVCA9IDIwMDtcblxudmFyIGNyZWF0ZVdhcm5Ub29NYW55Q2xhc3NlcyA9IChmdW5jdGlvbiAoZGlzcGxheU5hbWUpIHtcbiAgdmFyIGdlbmVyYXRlZENsYXNzZXMgPSB7fTtcbiAgdmFyIHdhcm5pbmdTZWVuID0gZmFsc2U7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICBpZiAoIXdhcm5pbmdTZWVuKSB7XG4gICAgICBnZW5lcmF0ZWRDbGFzc2VzW2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGdlbmVyYXRlZENsYXNzZXMpLmxlbmd0aCA+PSBMSU1JVCkge1xuICAgICAgICAvLyBVbmFibGUgdG8gZmluZCBsYXRlc3RSdWxlIGluIHRlc3QgZW52aXJvbm1lbnQuXG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUsIHByZWZlci10ZW1wbGF0ZSAqL1xuICAgICAgICBjb25zb2xlLndhcm4oJ092ZXIgJyArIExJTUlUICsgJyBjbGFzc2VzIHdlcmUgZ2VuZXJhdGVkIGZvciBjb21wb25lbnQgJyArIGRpc3BsYXlOYW1lICsgJy4gXFxuJyArICdDb25zaWRlciB1c2luZyB0aGUgYXR0cnMgbWV0aG9kLCB0b2dldGhlciB3aXRoIGEgc3R5bGUgb2JqZWN0IGZvciBmcmVxdWVudGx5IGNoYW5nZWQgc3R5bGVzLlxcbicgKyAnRXhhbXBsZTpcXG4nICsgJyAgY29uc3QgQ29tcG9uZW50ID0gc3R5bGVkLmRpdi5hdHRycyhwcm9wcyA9PiAoe1xcbicgKyAnICAgIHN0eWxlOiB7XFxuJyArICcgICAgICBiYWNrZ3JvdW5kOiBwcm9wcy5iYWNrZ3JvdW5kLFxcbicgKyAnICAgIH0sXFxuJyArICcgIH0pKWB3aWR0aDogMTAwJTtgXFxuXFxuJyArICcgIDxDb21wb25lbnQgLz4nKTtcbiAgICAgICAgd2FybmluZ1NlZW4gPSB0cnVlO1xuICAgICAgICBnZW5lcmF0ZWRDbGFzc2VzID0ge307XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG5cbi8vIFxuXG52YXIgZGV0ZXJtaW5lVGhlbWUgPSAoZnVuY3Rpb24gKHByb3BzLCBmYWxsYmFja1RoZW1lKSB7XG4gIHZhciBkZWZhdWx0UHJvcHMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IEVNUFRZX09CSkVDVDtcblxuICAvLyBQcm9wcyBzaG91bGQgdGFrZSBwcmVjZWRlbmNlIG92ZXIgVGhlbWVQcm92aWRlciwgd2hpY2ggc2hvdWxkIHRha2UgcHJlY2VkZW5jZSBvdmVyXG4gIC8vIGRlZmF1bHRQcm9wcywgYnV0IFJlYWN0IGF1dG9tYXRpY2FsbHkgcHV0cyBkZWZhdWx0UHJvcHMgb24gcHJvcHMuXG5cbiAgLyogZXNsaW50LWRpc2FibGUgcmVhY3QvcHJvcC10eXBlcywgZmxvd3R5cGUtZXJyb3JzL3Nob3ctZXJyb3JzICovXG4gIHZhciBpc0RlZmF1bHRUaGVtZSA9IGRlZmF1bHRQcm9wcyA/IHByb3BzLnRoZW1lID09PSBkZWZhdWx0UHJvcHMudGhlbWUgOiBmYWxzZTtcbiAgdmFyIHRoZW1lID0gcHJvcHMudGhlbWUgJiYgIWlzRGVmYXVsdFRoZW1lID8gcHJvcHMudGhlbWUgOiBmYWxsYmFja1RoZW1lIHx8IGRlZmF1bHRQcm9wcy50aGVtZTtcbiAgLyogZXNsaW50LWVuYWJsZSAqL1xuXG4gIHJldHVybiB0aGVtZTtcbn0pO1xuXG4vLyBcbnZhciBlc2NhcGVSZWdleCA9IC9bW1xcXS4jKiQ+PCt+PXxeOigpLFwiJ2AtXSsvZztcbnZhciBkYXNoZXNBdEVuZHMgPSAvKF4tfC0kKS9nO1xuXG4vKipcbiAqIFRPRE86IEV4cGxvcmUgdXNpbmcgQ1NTLmVzY2FwZSB3aGVuIGl0IGJlY29tZXMgbW9yZSBhdmFpbGFibGVcbiAqIGluIGV2ZXJncmVlbiBicm93c2Vycy5cbiAqL1xuZnVuY3Rpb24gZXNjYXBlKHN0cikge1xuICByZXR1cm4gc3RyXG4gIC8vIFJlcGxhY2UgYWxsIHBvc3NpYmxlIENTUyBzZWxlY3RvcnNcbiAgLnJlcGxhY2UoZXNjYXBlUmVnZXgsICctJylcblxuICAvLyBSZW1vdmUgZXh0cmFuZW91cyBoeXBoZW5zIGF0IHRoZSBzdGFydCBhbmQgZW5kXG4gIC5yZXBsYWNlKGRhc2hlc0F0RW5kcywgJycpO1xufVxuXG4vLyBcblxuZnVuY3Rpb24gaXNUYWcodGFyZ2V0KSB7XG4gIHJldHVybiB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyAmJiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHRhcmdldC5jaGFyQXQoMCkgPT09IHRhcmdldC5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSA6IHRydWUpO1xufVxuXG4vLyBcblxuZnVuY3Rpb24gZ2VuZXJhdGVEaXNwbGF5TmFtZSh0YXJnZXQpIHtcbiAgLy8gJEZsb3dGaXhNZVxuICByZXR1cm4gaXNUYWcodGFyZ2V0KSA/ICdzdHlsZWQuJyArIHRhcmdldCA6ICdTdHlsZWQoJyArIGdldENvbXBvbmVudE5hbWUodGFyZ2V0KSArICcpJztcbn1cblxudmFyIF9UWVBFX1NUQVRJQ1M7XG5cbnZhciBSRUFDVF9TVEFUSUNTID0ge1xuICBjaGlsZENvbnRleHRUeXBlczogdHJ1ZSxcbiAgY29udGV4dFR5cGVzOiB0cnVlLFxuICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gIGRpc3BsYXlOYW1lOiB0cnVlLFxuICBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHM6IHRydWUsXG4gIHByb3BUeXBlczogdHJ1ZSxcbiAgdHlwZTogdHJ1ZVxufTtcblxudmFyIEtOT1dOX1NUQVRJQ1MgPSB7XG4gIG5hbWU6IHRydWUsXG4gIGxlbmd0aDogdHJ1ZSxcbiAgcHJvdG90eXBlOiB0cnVlLFxuICBjYWxsZXI6IHRydWUsXG4gIGNhbGxlZTogdHJ1ZSxcbiAgYXJndW1lbnRzOiB0cnVlLFxuICBhcml0eTogdHJ1ZVxufTtcblxudmFyIFRZUEVfU1RBVElDUyA9IChfVFlQRV9TVEFUSUNTID0ge30sIF9UWVBFX1NUQVRJQ1NbcmVhY3RJcy5Gb3J3YXJkUmVmXSA9IHtcbiAgJCR0eXBlb2Y6IHRydWUsXG4gIHJlbmRlcjogdHJ1ZVxufSwgX1RZUEVfU1RBVElDUyk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSQxID0gT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICAgIGdldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgICBfT2JqZWN0JGdldE93blByb3BlcnQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICAgIGdldE93blByb3BlcnR5U3ltYm9scyA9IF9PYmplY3QkZ2V0T3duUHJvcGVydCA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gW107XG59IDogX09iamVjdCRnZXRPd25Qcm9wZXJ0LFxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gICAgZ2V0UHJvdG90eXBlT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YsXG4gICAgb2JqZWN0UHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBhcnJheVByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcblxuXG5mdW5jdGlvbiBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIHNvdXJjZUNvbXBvbmVudCwgYmxhY2tsaXN0KSB7XG4gIGlmICh0eXBlb2Ygc291cmNlQ29tcG9uZW50ICE9PSAnc3RyaW5nJykge1xuICAgIC8vIGRvbid0IGhvaXN0IG92ZXIgc3RyaW5nIChodG1sKSBjb21wb25lbnRzXG5cbiAgICB2YXIgaW5oZXJpdGVkQ29tcG9uZW50ID0gZ2V0UHJvdG90eXBlT2Yoc291cmNlQ29tcG9uZW50KTtcblxuICAgIGlmIChpbmhlcml0ZWRDb21wb25lbnQgJiYgaW5oZXJpdGVkQ29tcG9uZW50ICE9PSBvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgaW5oZXJpdGVkQ29tcG9uZW50LCBibGFja2xpc3QpO1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gYXJyYXlQcm90b3R5cGUuY29uY2F0KGdldE93blByb3BlcnR5TmFtZXMoc291cmNlQ29tcG9uZW50KSxcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZUNvbXBvbmVudCkpO1xuXG4gICAgdmFyIHRhcmdldFN0YXRpY3MgPSBUWVBFX1NUQVRJQ1NbdGFyZ2V0Q29tcG9uZW50LiQkdHlwZW9mXSB8fCBSRUFDVF9TVEFUSUNTO1xuXG4gICAgdmFyIHNvdXJjZVN0YXRpY3MgPSBUWVBFX1NUQVRJQ1Nbc291cmNlQ29tcG9uZW50LiQkdHlwZW9mXSB8fCBSRUFDVF9TVEFUSUNTO1xuXG4gICAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHZvaWQgMDtcbiAgICB2YXIga2V5ID0gdm9pZCAwO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBsdXNwbHVzXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAga2V5ID0ga2V5c1tpXTtcblxuICAgICAgaWYgKFxuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgIUtOT1dOX1NUQVRJQ1Nba2V5XSAmJiAhKGJsYWNrbGlzdCAmJiBibGFja2xpc3Rba2V5XSkgJiYgIShzb3VyY2VTdGF0aWNzICYmIHNvdXJjZVN0YXRpY3Nba2V5XSkgJiZcbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICEodGFyZ2V0U3RhdGljcyAmJiB0YXJnZXRTdGF0aWNzW2tleV0pKSB7XG4gICAgICAgIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlQ29tcG9uZW50LCBrZXkpO1xuXG4gICAgICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEF2b2lkIGZhaWx1cmVzIGZyb20gcmVhZC1vbmx5IHByb3BlcnRpZXNcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnR5JDEodGFyZ2V0Q29tcG9uZW50LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8qIGZhaWwgc2lsZW50bHkgKi9cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0Q29tcG9uZW50O1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldENvbXBvbmVudDtcbn1cblxuLy8gXG5mdW5jdGlvbiBpc0Rlcml2ZWRSZWFjdENvbXBvbmVudChmbikge1xuICByZXR1cm4gISEoZm4gJiYgZm4ucHJvdG90eXBlICYmIGZuLnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50KTtcbn1cblxuLy8gXG4vLyBIZWxwZXIgdG8gY2FsbCBhIGdpdmVuIGZ1bmN0aW9uLCBvbmx5IG9uY2VcbnZhciBvbmNlID0gKGZ1bmN0aW9uIChjYikge1xuICB2YXIgY2FsbGVkID0gZmFsc2U7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgIGNiLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59KTtcblxuLy8gXG5cbnZhciBUaGVtZUNvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0KCk7XG5cbnZhciBUaGVtZUNvbnN1bWVyID0gVGhlbWVDb250ZXh0LkNvbnN1bWVyO1xuXG4vKipcbiAqIFByb3ZpZGUgYSB0aGVtZSB0byBhbiBlbnRpcmUgcmVhY3QgY29tcG9uZW50IHRyZWUgdmlhIGNvbnRleHRcbiAqL1xuXG52YXIgVGhlbWVQcm92aWRlciA9IGZ1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gIGluaGVyaXRzKFRoZW1lUHJvdmlkZXIsIF9Db21wb25lbnQpO1xuXG4gIGZ1bmN0aW9uIFRoZW1lUHJvdmlkZXIocHJvcHMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBUaGVtZVByb3ZpZGVyKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0NvbXBvbmVudC5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICBfdGhpcy5nZXRDb250ZXh0ID0gbWVtb2l6ZShfdGhpcy5nZXRDb250ZXh0LmJpbmQoX3RoaXMpKTtcbiAgICBfdGhpcy5yZW5kZXJJbm5lciA9IF90aGlzLnJlbmRlcklubmVyLmJpbmQoX3RoaXMpO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIFRoZW1lUHJvdmlkZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuY2hpbGRyZW4pIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIFJlYWN0X19kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBUaGVtZUNvbnRleHQuQ29uc3VtZXIsXG4gICAgICBudWxsLFxuICAgICAgdGhpcy5yZW5kZXJJbm5lclxuICAgICk7XG4gIH07XG5cbiAgVGhlbWVQcm92aWRlci5wcm90b3R5cGUucmVuZGVySW5uZXIgPSBmdW5jdGlvbiByZW5kZXJJbm5lcihvdXRlclRoZW1lKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLmdldENvbnRleHQodGhpcy5wcm9wcy50aGVtZSwgb3V0ZXJUaGVtZSk7XG5cbiAgICByZXR1cm4gUmVhY3RfX2RlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgIFRoZW1lQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGNvbnRleHQgfSxcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHRoZW1lIGZyb20gdGhlIHByb3BzLCBzdXBwb3J0aW5nIGJvdGggKG91dGVyVGhlbWUpID0+IHt9XG4gICAqIGFzIHdlbGwgYXMgb2JqZWN0IG5vdGF0aW9uXG4gICAqL1xuXG5cbiAgVGhlbWVQcm92aWRlci5wcm90b3R5cGUuZ2V0VGhlbWUgPSBmdW5jdGlvbiBnZXRUaGVtZSh0aGVtZSwgb3V0ZXJUaGVtZSkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHRoZW1lKSkge1xuICAgICAgdmFyIG1lcmdlZFRoZW1lID0gdGhlbWUob3V0ZXJUaGVtZSk7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIChtZXJnZWRUaGVtZSA9PT0gbnVsbCB8fCBBcnJheS5pc0FycmF5KG1lcmdlZFRoZW1lKSB8fCAodHlwZW9mIG1lcmdlZFRoZW1lID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihtZXJnZWRUaGVtZSkpICE9PSAnb2JqZWN0JykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFN0eWxlZENvbXBvbmVudHNFcnJvcig3KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1lcmdlZFRoZW1lO1xuICAgIH1cblxuICAgIGlmICh0aGVtZSA9PT0gbnVsbCB8fCBBcnJheS5pc0FycmF5KHRoZW1lKSB8fCAodHlwZW9mIHRoZW1lID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZih0aGVtZSkpICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IFN0eWxlZENvbXBvbmVudHNFcnJvcig4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2V4dGVuZHMoe30sIG91dGVyVGhlbWUsIHRoZW1lKTtcbiAgfTtcblxuICBUaGVtZVByb3ZpZGVyLnByb3RvdHlwZS5nZXRDb250ZXh0ID0gZnVuY3Rpb24gZ2V0Q29udGV4dCh0aGVtZSwgb3V0ZXJUaGVtZSkge1xuICAgIHJldHVybiB0aGlzLmdldFRoZW1lKHRoZW1lLCBvdXRlclRoZW1lKTtcbiAgfTtcblxuICByZXR1cm4gVGhlbWVQcm92aWRlcjtcbn0oUmVhY3QuQ29tcG9uZW50KTtcblxuLy8gXG5cbnZhciBDTE9TSU5HX1RBR19SID0gL15cXHMqPFxcL1thLXpdL2k7XG5cbnZhciBTZXJ2ZXJTdHlsZVNoZWV0ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTZXJ2ZXJTdHlsZVNoZWV0KCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFNlcnZlclN0eWxlU2hlZXQpO1xuXG4gICAgLyogVGhlIG1hc3RlciBzaGVldCBtaWdodCBiZSByZXNldCwgc28ga2VlcCBhIHJlZmVyZW5jZSBoZXJlICovXG4gICAgdGhpcy5tYXN0ZXJTaGVldCA9IFN0eWxlU2hlZXQubWFzdGVyO1xuICAgIHRoaXMuaW5zdGFuY2UgPSB0aGlzLm1hc3RlclNoZWV0LmNsb25lKCk7XG4gICAgdGhpcy5zZWFsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrIHRoZSBTZXJ2ZXJTdHlsZVNoZWV0IGFzIGJlaW5nIGZ1bGx5IGVtaXR0ZWQgYW5kIG1hbnVhbGx5IEdDIGl0IGZyb20gdGhlXG4gICAqIFN0eWxlU2hlZXQgc2luZ2xldG9uLlxuICAgKi9cblxuXG4gIFNlcnZlclN0eWxlU2hlZXQucHJvdG90eXBlLnNlYWwgPSBmdW5jdGlvbiBzZWFsKCkge1xuICAgIGlmICghdGhpcy5zZWFsZWQpIHtcbiAgICAgIC8qIFJlbW92ZSBzZWFsZWQgU3R5bGVTaGVldHMgZnJvbSB0aGUgbWFzdGVyIHNoZWV0ICovXG4gICAgICB2YXIgaW5kZXggPSB0aGlzLm1hc3RlclNoZWV0LmNsb25lcy5pbmRleE9mKHRoaXMuaW5zdGFuY2UpO1xuICAgICAgdGhpcy5tYXN0ZXJTaGVldC5jbG9uZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMuc2VhbGVkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgU2VydmVyU3R5bGVTaGVldC5wcm90b3R5cGUuY29sbGVjdFN0eWxlcyA9IGZ1bmN0aW9uIGNvbGxlY3RTdHlsZXMoY2hpbGRyZW4pIHtcbiAgICBpZiAodGhpcy5zZWFsZWQpIHtcbiAgICAgIHRocm93IG5ldyBTdHlsZWRDb21wb25lbnRzRXJyb3IoMik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlYWN0X19kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBTdHlsZVNoZWV0TWFuYWdlcixcbiAgICAgIHsgc2hlZXQ6IHRoaXMuaW5zdGFuY2UgfSxcbiAgICAgIGNoaWxkcmVuXG4gICAgKTtcbiAgfTtcblxuICBTZXJ2ZXJTdHlsZVNoZWV0LnByb3RvdHlwZS5nZXRTdHlsZVRhZ3MgPSBmdW5jdGlvbiBnZXRTdHlsZVRhZ3MoKSB7XG4gICAgdGhpcy5zZWFsKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UudG9IVE1MKCk7XG4gIH07XG5cbiAgU2VydmVyU3R5bGVTaGVldC5wcm90b3R5cGUuZ2V0U3R5bGVFbGVtZW50ID0gZnVuY3Rpb24gZ2V0U3R5bGVFbGVtZW50KCkge1xuICAgIHRoaXMuc2VhbCgpO1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLnRvUmVhY3RFbGVtZW50cygpO1xuICB9O1xuXG4gIFNlcnZlclN0eWxlU2hlZXQucHJvdG90eXBlLmludGVybGVhdmVXaXRoTm9kZVN0cmVhbSA9IGZ1bmN0aW9uIGludGVybGVhdmVXaXRoTm9kZVN0cmVhbShyZWFkYWJsZVN0cmVhbSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB7XG4gICAgICB0aHJvdyBuZXcgU3R5bGVkQ29tcG9uZW50c0Vycm9yKDMpO1xuICAgIH1cblxuICAgIC8qIHRoZSB0YWcgaW5kZXgga2VlcHMgdHJhY2sgb2Ygd2hpY2ggdGFncyBoYXZlIGFscmVhZHkgYmVlbiBlbWl0dGVkICovXG4gICAgdmFyIGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZTtcblxuICAgIHZhciBpbnN0YW5jZVRhZ0luZGV4ID0gMDtcblxuICAgIHZhciBzdHJlYW1BdHRyID0gU0NfU1RSRUFNX0FUVFIgKyAnPVwidHJ1ZVwiJztcblxuICAgIHZhciB0cmFuc2Zvcm1lciA9IG5ldyBzdHJlYW0uVHJhbnNmb3JtKHtcbiAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gYXBwZW5kU3R5bGVDaHVua3MoY2h1bmssIC8qIGVuY29kaW5nICovXywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHRhZ3MgPSBpbnN0YW5jZS50YWdzO1xuXG4gICAgICAgIHZhciBodG1sID0gJyc7XG5cbiAgICAgICAgLyogcmV0cmlldmUgaHRtbCBmb3IgZWFjaCBuZXcgc3R5bGUgdGFnICovXG4gICAgICAgIGZvciAoOyBpbnN0YW5jZVRhZ0luZGV4IDwgdGFncy5sZW5ndGg7IGluc3RhbmNlVGFnSW5kZXggKz0gMSkge1xuICAgICAgICAgIHZhciB0YWcgPSB0YWdzW2luc3RhbmNlVGFnSW5kZXhdO1xuICAgICAgICAgIGh0bWwgKz0gdGFnLnRvSFRNTChzdHJlYW1BdHRyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIGZvcmNlIG91ciBTdHlsZVNoZWV0cyB0byBlbWl0IGVudGlyZWx5IG5ldyB0YWdzICovXG4gICAgICAgIGluc3RhbmNlLnNlYWxBbGxUYWdzKCk7XG5cbiAgICAgICAgdmFyIHJlbmRlcmVkSHRtbCA9IGNodW5rLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgLyogcHJlcGVuZCBzdHlsZSBodG1sIHRvIGNodW5rLCB1bmxlc3MgdGhlIHN0YXJ0IG9mIHRoZSBjaHVuayBpcyBhIGNsb3NpbmcgdGFnIGluIHdoaWNoIGNhc2UgYXBwZW5kIHJpZ2h0IGFmdGVyIHRoYXQgKi9cbiAgICAgICAgaWYgKENMT1NJTkdfVEFHX1IudGVzdChyZW5kZXJlZEh0bWwpKSB7XG4gICAgICAgICAgdmFyIGVuZE9mQ2xvc2luZ1RhZyA9IHJlbmRlcmVkSHRtbC5pbmRleE9mKCc+Jyk7XG5cbiAgICAgICAgICB0aGlzLnB1c2gocmVuZGVyZWRIdG1sLnNsaWNlKDAsIGVuZE9mQ2xvc2luZ1RhZyArIDEpICsgaHRtbCArIHJlbmRlcmVkSHRtbC5zbGljZShlbmRPZkNsb3NpbmdUYWcgKyAxKSk7XG4gICAgICAgIH0gZWxzZSB0aGlzLnB1c2goaHRtbCArIHJlbmRlcmVkSHRtbCk7XG5cbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJlYWRhYmxlU3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX3RoaXMuc2VhbCgpO1xuICAgIH0pO1xuXG4gICAgcmVhZGFibGVTdHJlYW0ub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycikge1xuICAgICAgX3RoaXMuc2VhbCgpO1xuXG4gICAgICAvLyBmb3J3YXJkIHRoZSBlcnJvciB0byB0aGUgdHJhbnNmb3JtIHN0cmVhbVxuICAgICAgdHJhbnNmb3JtZXIuZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlYWRhYmxlU3RyZWFtLnBpcGUodHJhbnNmb3JtZXIpO1xuICB9O1xuXG4gIHJldHVybiBTZXJ2ZXJTdHlsZVNoZWV0O1xufSgpO1xuXG4vLyBcblxudmFyIFN0eWxlU2hlZXRDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dCgpO1xudmFyIFN0eWxlU2hlZXRDb25zdW1lciA9IFN0eWxlU2hlZXRDb250ZXh0LkNvbnN1bWVyO1xuXG52YXIgU3R5bGVTaGVldE1hbmFnZXIgPSBmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBpbmhlcml0cyhTdHlsZVNoZWV0TWFuYWdlciwgX0NvbXBvbmVudCk7XG5cbiAgZnVuY3Rpb24gU3R5bGVTaGVldE1hbmFnZXIocHJvcHMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBTdHlsZVNoZWV0TWFuYWdlcik7XG5cbiAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9Db21wb25lbnQuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgX3RoaXMuZ2V0Q29udGV4dCA9IG1lbW9pemUoX3RoaXMuZ2V0Q29udGV4dCk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgU3R5bGVTaGVldE1hbmFnZXIucHJvdG90eXBlLmdldENvbnRleHQgPSBmdW5jdGlvbiBnZXRDb250ZXh0KHNoZWV0LCB0YXJnZXQpIHtcbiAgICBpZiAoc2hlZXQpIHtcbiAgICAgIHJldHVybiBzaGVldDtcbiAgICB9IGVsc2UgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIG5ldyBTdHlsZVNoZWV0KHRhcmdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBTdHlsZWRDb21wb25lbnRzRXJyb3IoNCk7XG4gICAgfVxuICB9O1xuXG4gIFN0eWxlU2hlZXRNYW5hZ2VyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIF9wcm9wcyA9IHRoaXMucHJvcHMsXG4gICAgICAgIGNoaWxkcmVuID0gX3Byb3BzLmNoaWxkcmVuLFxuICAgICAgICBzaGVldCA9IF9wcm9wcy5zaGVldCxcbiAgICAgICAgdGFyZ2V0ID0gX3Byb3BzLnRhcmdldDtcblxuXG4gICAgcmV0dXJuIFJlYWN0X19kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBTdHlsZVNoZWV0Q29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IHRoaXMuZ2V0Q29udGV4dChzaGVldCwgdGFyZ2V0KSB9LFxuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IFJlYWN0X19kZWZhdWx0LkNoaWxkcmVuLm9ubHkoY2hpbGRyZW4pIDogY2hpbGRyZW5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiBTdHlsZVNoZWV0TWFuYWdlcjtcbn0oUmVhY3QuQ29tcG9uZW50KTtcbnByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IFN0eWxlU2hlZXRNYW5hZ2VyLnByb3BUeXBlcyA9IHtcbiAgc2hlZXQ6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5pbnN0YW5jZU9mKFN0eWxlU2hlZXQpLCBQcm9wVHlwZXMuaW5zdGFuY2VPZihTZXJ2ZXJTdHlsZVNoZWV0KV0pLFxuXG4gIHRhcmdldDogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBhcHBlbmRDaGlsZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9KVxufSA6IHZvaWQgMDtcblxuLy8gXG5cbnZhciBpZGVudGlmaWVycyA9IHt9O1xuXG4vKiBXZSBkZXBlbmQgb24gY29tcG9uZW50cyBoYXZpbmcgdW5pcXVlIElEcyAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVJZChfQ29tcG9uZW50U3R5bGUsIF9kaXNwbGF5TmFtZSwgcGFyZW50Q29tcG9uZW50SWQpIHtcbiAgdmFyIGRpc3BsYXlOYW1lID0gdHlwZW9mIF9kaXNwbGF5TmFtZSAhPT0gJ3N0cmluZycgPyAnc2MnIDogZXNjYXBlKF9kaXNwbGF5TmFtZSk7XG5cbiAgLyoqXG4gICAqIFRoaXMgZW5zdXJlcyB1bmlxdWVuZXNzIGlmIHR3byBjb21wb25lbnRzIGhhcHBlbiB0byBzaGFyZVxuICAgKiB0aGUgc2FtZSBkaXNwbGF5TmFtZS5cbiAgICovXG4gIHZhciBuciA9IChpZGVudGlmaWVyc1tkaXNwbGF5TmFtZV0gfHwgMCkgKyAxO1xuICBpZGVudGlmaWVyc1tkaXNwbGF5TmFtZV0gPSBucjtcblxuICB2YXIgY29tcG9uZW50SWQgPSBkaXNwbGF5TmFtZSArICctJyArIF9Db21wb25lbnRTdHlsZS5nZW5lcmF0ZU5hbWUoZGlzcGxheU5hbWUgKyBucik7XG5cbiAgcmV0dXJuIHBhcmVudENvbXBvbmVudElkID8gcGFyZW50Q29tcG9uZW50SWQgKyAnLScgKyBjb21wb25lbnRJZCA6IGNvbXBvbmVudElkO1xufVxuXG4vLyAkRmxvd0ZpeE1lXG5cbnZhciBTdHlsZWRDb21wb25lbnQgPSBmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBpbmhlcml0cyhTdHlsZWRDb21wb25lbnQsIF9Db21wb25lbnQpO1xuXG4gIGZ1bmN0aW9uIFN0eWxlZENvbXBvbmVudCgpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBTdHlsZWRDb21wb25lbnQpO1xuXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfQ29tcG9uZW50LmNhbGwodGhpcykpO1xuXG4gICAgX3RoaXMuYXR0cnMgPSB7fTtcblxuICAgIF90aGlzLnJlbmRlck91dGVyID0gX3RoaXMucmVuZGVyT3V0ZXIuYmluZChfdGhpcyk7XG4gICAgX3RoaXMucmVuZGVySW5uZXIgPSBfdGhpcy5yZW5kZXJJbm5lci5iaW5kKF90aGlzKTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBfdGhpcy53YXJuSW5uZXJSZWYgPSBvbmNlKGZ1bmN0aW9uIChkaXNwbGF5TmFtZSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS53YXJuKCdUaGUgXCJpbm5lclJlZlwiIEFQSSBoYXMgYmVlbiByZW1vdmVkIGluIHN0eWxlZC1jb21wb25lbnRzIHY0IGluIGZhdm9yIG9mIFJlYWN0IDE2IHJlZiBmb3J3YXJkaW5nLCB1c2UgXCJyZWZcIiBpbnN0ZWFkIGxpa2UgYSB0eXBpY2FsIGNvbXBvbmVudC4gXCJpbm5lclJlZlwiIHdhcyBkZXRlY3RlZCBvbiBjb21wb25lbnQgXCInICsgZGlzcGxheU5hbWUgKyAnXCIuJylcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy53YXJuQXR0cnNGbk9iamVjdEtleURlcHJlY2F0ZWQgPSBvbmNlKGZ1bmN0aW9uIChrZXksIGRpc3BsYXlOYW1lKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ0Z1bmN0aW9ucyBhcyBvYmplY3QtZm9ybSBhdHRycyh7fSkga2V5cyBhcmUgbm93IGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSB2ZXJzaW9uIG9mIHN0eWxlZC1jb21wb25lbnRzLiBTd2l0Y2ggdG8gdGhlIG5ldyBhdHRycyhwcm9wcyA9PiAoe30pKSBzeW50YXggaW5zdGVhZCBmb3IgZWFzaWVyIGFuZCBtb3JlIHBvd2VyZnVsIGNvbXBvc2l0aW9uLiBUaGUgYXR0cnMga2V5IGluIHF1ZXN0aW9uIGlzIFwiJyArIGtleSArICdcIiBvbiBjb21wb25lbnQgXCInICsgZGlzcGxheU5hbWUgKyAnXCIuJywgJ1xcbiAnICsgbmV3IEVycm9yKCkuc3RhY2spXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgICAgX3RoaXMud2Fybk5vblN0eWxlZENvbXBvbmVudEF0dHJzT2JqZWN0S2V5ID0gb25jZShmdW5jdGlvbiAoa2V5LCBkaXNwbGF5TmFtZSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS53YXJuKCdJdCBsb29rcyBsaWtlIHlvdVxcJ3ZlIHVzZWQgYSBub24gc3R5bGVkLWNvbXBvbmVudCBhcyB0aGUgdmFsdWUgZm9yIHRoZSBcIicgKyBrZXkgKyAnXCIgcHJvcCBpbiBhbiBvYmplY3QtZm9ybSBhdHRycyBjb25zdHJ1Y3RvciBvZiBcIicgKyBkaXNwbGF5TmFtZSArICdcIi5cXG4nICsgJ1lvdSBzaG91bGQgdXNlIHRoZSBuZXcgZnVuY3Rpb24tZm9ybSBhdHRycyBjb25zdHJ1Y3RvciB3aGljaCBhdm9pZHMgdGhpcyBpc3N1ZTogYXR0cnMocHJvcHMgPT4gKHsgeW91clN0dWZmIH0pKVxcbicgKyBcIlRvIGNvbnRpbnVlIHVzaW5nIHRoZSBkZXByZWNhdGVkIG9iamVjdCBzeW50YXgsIHlvdSdsbCBuZWVkIHRvIHdyYXAgeW91ciBjb21wb25lbnQgcHJvcCBpbiBhIGZ1bmN0aW9uIHRvIG1ha2UgaXQgYXZhaWxhYmxlIGluc2lkZSB0aGUgc3R5bGVkIGNvbXBvbmVudCAoeW91J2xsIHN0aWxsIGdldCB0aGUgZGVwcmVjYXRpb24gd2FybmluZyB0aG91Z2guKVxcblwiICsgKCdGb3IgZXhhbXBsZSwgeyAnICsga2V5ICsgJzogKCkgPT4gSW5uZXJDb21wb25lbnQgfSBpbnN0ZWFkIG9mIHsgJyArIGtleSArICc6IElubmVyQ29tcG9uZW50IH0nKSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBTdHlsZWRDb21wb25lbnQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3RfX2RlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgIFN0eWxlU2hlZXRDb25zdW1lcixcbiAgICAgIG51bGwsXG4gICAgICB0aGlzLnJlbmRlck91dGVyXG4gICAgKTtcbiAgfTtcblxuICBTdHlsZWRDb21wb25lbnQucHJvdG90eXBlLnJlbmRlck91dGVyID0gZnVuY3Rpb24gcmVuZGVyT3V0ZXIoKSB7XG4gICAgdmFyIHN0eWxlU2hlZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IFN0eWxlU2hlZXQubWFzdGVyO1xuXG4gICAgdGhpcy5zdHlsZVNoZWV0ID0gc3R5bGVTaGVldDtcblxuICAgIC8vIE5vIG5lZWQgdG8gc3Vic2NyaWJlIGEgc3RhdGljIGNvbXBvbmVudCB0byB0aGVtZSBjaGFuZ2VzLCBpdCB3b24ndCBjaGFuZ2UgYW55dGhpbmdcbiAgICBpZiAodGhpcy5wcm9wcy5mb3J3YXJkZWRDb21wb25lbnQuY29tcG9uZW50U3R5bGUuaXNTdGF0aWMpIHJldHVybiB0aGlzLnJlbmRlcklubmVyKCk7XG5cbiAgICByZXR1cm4gUmVhY3RfX2RlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgIFRoZW1lQ29uc3VtZXIsXG4gICAgICBudWxsLFxuICAgICAgdGhpcy5yZW5kZXJJbm5lclxuICAgICk7XG4gIH07XG5cbiAgU3R5bGVkQ29tcG9uZW50LnByb3RvdHlwZS5yZW5kZXJJbm5lciA9IGZ1bmN0aW9uIHJlbmRlcklubmVyKHRoZW1lKSB7XG4gICAgdmFyIF9wcm9wcyRmb3J3YXJkZWRDb21wbyA9IHRoaXMucHJvcHMuZm9yd2FyZGVkQ29tcG9uZW50LFxuICAgICAgICBjb21wb25lbnRTdHlsZSA9IF9wcm9wcyRmb3J3YXJkZWRDb21wby5jb21wb25lbnRTdHlsZSxcbiAgICAgICAgZGVmYXVsdFByb3BzID0gX3Byb3BzJGZvcndhcmRlZENvbXBvLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgZGlzcGxheU5hbWUgPSBfcHJvcHMkZm9yd2FyZGVkQ29tcG8uZGlzcGxheU5hbWUsXG4gICAgICAgIGZvbGRlZENvbXBvbmVudElkcyA9IF9wcm9wcyRmb3J3YXJkZWRDb21wby5mb2xkZWRDb21wb25lbnRJZHMsXG4gICAgICAgIHN0eWxlZENvbXBvbmVudElkID0gX3Byb3BzJGZvcndhcmRlZENvbXBvLnN0eWxlZENvbXBvbmVudElkLFxuICAgICAgICB0YXJnZXQgPSBfcHJvcHMkZm9yd2FyZGVkQ29tcG8udGFyZ2V0O1xuXG5cbiAgICB2YXIgZ2VuZXJhdGVkQ2xhc3NOYW1lID0gdm9pZCAwO1xuICAgIGlmIChjb21wb25lbnRTdHlsZS5pc1N0YXRpYykge1xuICAgICAgZ2VuZXJhdGVkQ2xhc3NOYW1lID0gdGhpcy5nZW5lcmF0ZUFuZEluamVjdFN0eWxlcyhFTVBUWV9PQkpFQ1QsIHRoaXMucHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5lcmF0ZWRDbGFzc05hbWUgPSB0aGlzLmdlbmVyYXRlQW5kSW5qZWN0U3R5bGVzKGRldGVybWluZVRoZW1lKHRoaXMucHJvcHMsIHRoZW1lLCBkZWZhdWx0UHJvcHMpIHx8IEVNUFRZX09CSkVDVCwgdGhpcy5wcm9wcyk7XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnRUb0JlQ3JlYXRlZCA9IHRoaXMucHJvcHMuYXMgfHwgdGhpcy5hdHRycy5hcyB8fCB0YXJnZXQ7XG4gICAgdmFyIGlzVGFyZ2V0VGFnID0gaXNUYWcoZWxlbWVudFRvQmVDcmVhdGVkKTtcblxuICAgIHZhciBwcm9wc0ZvckVsZW1lbnQgPSB7fTtcbiAgICB2YXIgY29tcHV0ZWRQcm9wcyA9IF9leHRlbmRzKHt9LCB0aGlzLnByb3BzLCB0aGlzLmF0dHJzKTtcblxuICAgIHZhciBrZXkgPSB2b2lkIDA7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGd1YXJkLWZvci1pblxuICAgIGZvciAoa2V5IGluIGNvbXB1dGVkUHJvcHMpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIGtleSA9PT0gJ2lubmVyUmVmJyAmJiBpc1RhcmdldFRhZykge1xuICAgICAgICB0aGlzLndhcm5Jbm5lclJlZihkaXNwbGF5TmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkgPT09ICdmb3J3YXJkZWRDb21wb25lbnQnIHx8IGtleSA9PT0gJ2FzJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnZm9yd2FyZGVkUmVmJykgcHJvcHNGb3JFbGVtZW50LnJlZiA9IGNvbXB1dGVkUHJvcHNba2V5XTtlbHNlIGlmIChrZXkgPT09ICdmb3J3YXJkZWRBcycpIHByb3BzRm9yRWxlbWVudC5hcyA9IGNvbXB1dGVkUHJvcHNba2V5XTtlbHNlIGlmICghaXNUYXJnZXRUYWcgfHwgdmFsaWRBdHRyKGtleSkpIHtcbiAgICAgICAgLy8gRG9uJ3QgcGFzcyB0aHJvdWdoIG5vbiBIVE1MIHRhZ3MgdGhyb3VnaCB0byBIVE1MIGVsZW1lbnRzXG4gICAgICAgIHByb3BzRm9yRWxlbWVudFtrZXldID0gY29tcHV0ZWRQcm9wc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnN0eWxlICYmIHRoaXMuYXR0cnMuc3R5bGUpIHtcbiAgICAgIHByb3BzRm9yRWxlbWVudC5zdHlsZSA9IF9leHRlbmRzKHt9LCB0aGlzLmF0dHJzLnN0eWxlLCB0aGlzLnByb3BzLnN0eWxlKTtcbiAgICB9XG5cbiAgICBwcm9wc0ZvckVsZW1lbnQuY2xhc3NOYW1lID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdChmb2xkZWRDb21wb25lbnRJZHMsIHN0eWxlZENvbXBvbmVudElkLCBnZW5lcmF0ZWRDbGFzc05hbWUgIT09IHN0eWxlZENvbXBvbmVudElkID8gZ2VuZXJhdGVkQ2xhc3NOYW1lIDogbnVsbCwgdGhpcy5wcm9wcy5jbGFzc05hbWUsIHRoaXMuYXR0cnMuY2xhc3NOYW1lKS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpO1xuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoZWxlbWVudFRvQmVDcmVhdGVkLCBwcm9wc0ZvckVsZW1lbnQpO1xuICB9O1xuXG4gIFN0eWxlZENvbXBvbmVudC5wcm90b3R5cGUuYnVpbGRFeGVjdXRpb25Db250ZXh0ID0gZnVuY3Rpb24gYnVpbGRFeGVjdXRpb25Db250ZXh0KHRoZW1lLCBwcm9wcywgYXR0cnMpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIHZhciBjb250ZXh0ID0gX2V4dGVuZHMoe30sIHByb3BzLCB7IHRoZW1lOiB0aGVtZSB9KTtcblxuICAgIGlmICghYXR0cnMubGVuZ3RoKSByZXR1cm4gY29udGV4dDtcblxuICAgIHRoaXMuYXR0cnMgPSB7fTtcblxuICAgIGF0dHJzLmZvckVhY2goZnVuY3Rpb24gKGF0dHJEZWYpIHtcbiAgICAgIHZhciByZXNvbHZlZEF0dHJEZWYgPSBhdHRyRGVmO1xuICAgICAgdmFyIGF0dHJEZWZXYXNGbiA9IGZhbHNlO1xuICAgICAgdmFyIGF0dHIgPSB2b2lkIDA7XG4gICAgICB2YXIga2V5ID0gdm9pZCAwO1xuXG4gICAgICBpZiAoaXNGdW5jdGlvbihyZXNvbHZlZEF0dHJEZWYpKSB7XG4gICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICAgcmVzb2x2ZWRBdHRyRGVmID0gcmVzb2x2ZWRBdHRyRGVmKGNvbnRleHQpO1xuICAgICAgICBhdHRyRGVmV2FzRm4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBndWFyZC1mb3ItaW4gKi9cbiAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgIGZvciAoa2V5IGluIHJlc29sdmVkQXR0ckRlZikge1xuICAgICAgICBhdHRyID0gcmVzb2x2ZWRBdHRyRGVmW2tleV07XG5cbiAgICAgICAgaWYgKCFhdHRyRGVmV2FzRm4pIHtcbiAgICAgICAgICBpZiAoaXNGdW5jdGlvbihhdHRyKSAmJiAhaXNEZXJpdmVkUmVhY3RDb21wb25lbnQoYXR0cikgJiYgIWlzU3R5bGVkQ29tcG9uZW50KGF0dHIpKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICBfdGhpczIud2FybkF0dHJzRm5PYmplY3RLZXlEZXByZWNhdGVkKGtleSwgcHJvcHMuZm9yd2FyZGVkQ29tcG9uZW50LmRpc3BsYXlOYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXR0ciA9IGF0dHIoY29udGV4dCk7XG5cbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIFJlYWN0X19kZWZhdWx0LmlzVmFsaWRFbGVtZW50KGF0dHIpKSB7XG4gICAgICAgICAgICAgIF90aGlzMi53YXJuTm9uU3R5bGVkQ29tcG9uZW50QXR0cnNPYmplY3RLZXkoa2V5LCBwcm9wcy5mb3J3YXJkZWRDb21wb25lbnQuZGlzcGxheU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMi5hdHRyc1trZXldID0gYXR0cjtcbiAgICAgICAgY29udGV4dFtrZXldID0gYXR0cjtcbiAgICAgIH1cbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cbiAgICB9KTtcblxuICAgIHJldHVybiBjb250ZXh0O1xuICB9O1xuXG4gIFN0eWxlZENvbXBvbmVudC5wcm90b3R5cGUuZ2VuZXJhdGVBbmRJbmplY3RTdHlsZXMgPSBmdW5jdGlvbiBnZW5lcmF0ZUFuZEluamVjdFN0eWxlcyh0aGVtZSwgcHJvcHMpIHtcbiAgICB2YXIgX3Byb3BzJGZvcndhcmRlZENvbXBvMiA9IHByb3BzLmZvcndhcmRlZENvbXBvbmVudCxcbiAgICAgICAgYXR0cnMgPSBfcHJvcHMkZm9yd2FyZGVkQ29tcG8yLmF0dHJzLFxuICAgICAgICBjb21wb25lbnRTdHlsZSA9IF9wcm9wcyRmb3J3YXJkZWRDb21wbzIuY29tcG9uZW50U3R5bGUsXG4gICAgICAgIHdhcm5Ub29NYW55Q2xhc3NlcyA9IF9wcm9wcyRmb3J3YXJkZWRDb21wbzIud2FyblRvb01hbnlDbGFzc2VzO1xuXG4gICAgLy8gc3RhdGljYWxseSBzdHlsZWQtY29tcG9uZW50cyBkb24ndCBuZWVkIHRvIGJ1aWxkIGFuIGV4ZWN1dGlvbiBjb250ZXh0IG9iamVjdCxcbiAgICAvLyBhbmQgc2hvdWxkbid0IGJlIGluY3JlYXNpbmcgdGhlIG51bWJlciBvZiBjbGFzcyBuYW1lc1xuXG4gICAgaWYgKGNvbXBvbmVudFN0eWxlLmlzU3RhdGljICYmICFhdHRycy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBjb21wb25lbnRTdHlsZS5nZW5lcmF0ZUFuZEluamVjdFN0eWxlcyhFTVBUWV9PQkpFQ1QsIHRoaXMuc3R5bGVTaGVldCk7XG4gICAgfVxuXG4gICAgdmFyIGNsYXNzTmFtZSA9IGNvbXBvbmVudFN0eWxlLmdlbmVyYXRlQW5kSW5qZWN0U3R5bGVzKHRoaXMuYnVpbGRFeGVjdXRpb25Db250ZXh0KHRoZW1lLCBwcm9wcywgYXR0cnMpLCB0aGlzLnN0eWxlU2hlZXQpO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgd2FyblRvb01hbnlDbGFzc2VzKSB3YXJuVG9vTWFueUNsYXNzZXMoY2xhc3NOYW1lKTtcblxuICAgIHJldHVybiBjbGFzc05hbWU7XG4gIH07XG5cbiAgcmV0dXJuIFN0eWxlZENvbXBvbmVudDtcbn0oUmVhY3QuQ29tcG9uZW50KTtcblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVkQ29tcG9uZW50KHRhcmdldCwgb3B0aW9ucywgcnVsZXMpIHtcbiAgdmFyIGlzVGFyZ2V0U3R5bGVkQ29tcCA9IGlzU3R5bGVkQ29tcG9uZW50KHRhcmdldCk7XG4gIHZhciBpc0NsYXNzID0gIWlzVGFnKHRhcmdldCk7XG5cbiAgdmFyIF9vcHRpb25zJGRpc3BsYXlOYW1lID0gb3B0aW9ucy5kaXNwbGF5TmFtZSxcbiAgICAgIGRpc3BsYXlOYW1lID0gX29wdGlvbnMkZGlzcGxheU5hbWUgPT09IHVuZGVmaW5lZCA/IGdlbmVyYXRlRGlzcGxheU5hbWUodGFyZ2V0KSA6IF9vcHRpb25zJGRpc3BsYXlOYW1lLFxuICAgICAgX29wdGlvbnMkY29tcG9uZW50SWQgPSBvcHRpb25zLmNvbXBvbmVudElkLFxuICAgICAgY29tcG9uZW50SWQgPSBfb3B0aW9ucyRjb21wb25lbnRJZCA9PT0gdW5kZWZpbmVkID8gZ2VuZXJhdGVJZChDb21wb25lbnRTdHlsZSwgb3B0aW9ucy5kaXNwbGF5TmFtZSwgb3B0aW9ucy5wYXJlbnRDb21wb25lbnRJZCkgOiBfb3B0aW9ucyRjb21wb25lbnRJZCxcbiAgICAgIF9vcHRpb25zJFBhcmVudENvbXBvbiA9IG9wdGlvbnMuUGFyZW50Q29tcG9uZW50LFxuICAgICAgUGFyZW50Q29tcG9uZW50ID0gX29wdGlvbnMkUGFyZW50Q29tcG9uID09PSB1bmRlZmluZWQgPyBTdHlsZWRDb21wb25lbnQgOiBfb3B0aW9ucyRQYXJlbnRDb21wb24sXG4gICAgICBfb3B0aW9ucyRhdHRycyA9IG9wdGlvbnMuYXR0cnMsXG4gICAgICBhdHRycyA9IF9vcHRpb25zJGF0dHJzID09PSB1bmRlZmluZWQgPyBFTVBUWV9BUlJBWSA6IF9vcHRpb25zJGF0dHJzO1xuXG5cbiAgdmFyIHN0eWxlZENvbXBvbmVudElkID0gb3B0aW9ucy5kaXNwbGF5TmFtZSAmJiBvcHRpb25zLmNvbXBvbmVudElkID8gZXNjYXBlKG9wdGlvbnMuZGlzcGxheU5hbWUpICsgJy0nICsgb3B0aW9ucy5jb21wb25lbnRJZCA6IG9wdGlvbnMuY29tcG9uZW50SWQgfHwgY29tcG9uZW50SWQ7XG5cbiAgLy8gZm9sZCB0aGUgdW5kZXJseWluZyBTdHlsZWRDb21wb25lbnQgYXR0cnMgdXAgKGltcGxpY2l0IGV4dGVuZClcbiAgdmFyIGZpbmFsQXR0cnMgPVxuICAvLyAkRmxvd0ZpeE1lXG4gIGlzVGFyZ2V0U3R5bGVkQ29tcCAmJiB0YXJnZXQuYXR0cnMgPyBBcnJheS5wcm90b3R5cGUuY29uY2F0KHRhcmdldC5hdHRycywgYXR0cnMpLmZpbHRlcihCb29sZWFuKSA6IGF0dHJzO1xuXG4gIHZhciBjb21wb25lbnRTdHlsZSA9IG5ldyBDb21wb25lbnRTdHlsZShpc1RhcmdldFN0eWxlZENvbXAgPyAvLyBmb2xkIHRoZSB1bmRlcmx5aW5nIFN0eWxlZENvbXBvbmVudCBydWxlcyB1cCAoaW1wbGljaXQgZXh0ZW5kKVxuICAvLyAkRmxvd0ZpeE1lXG4gIHRhcmdldC5jb21wb25lbnRTdHlsZS5ydWxlcy5jb25jYXQocnVsZXMpIDogcnVsZXMsIGZpbmFsQXR0cnMsIHN0eWxlZENvbXBvbmVudElkKTtcblxuICAvKipcbiAgICogZm9yd2FyZFJlZiBjcmVhdGVzIGEgbmV3IGludGVyaW0gY29tcG9uZW50LCB3aGljaCB3ZSdsbCB0YWtlIGFkdmFudGFnZSBvZlxuICAgKiBpbnN0ZWFkIG9mIGV4dGVuZGluZyBQYXJlbnRDb21wb25lbnQgdG8gY3JlYXRlIF9hbm90aGVyXyBpbnRlcmltIGNsYXNzXG4gICAqL1xuICB2YXIgV3JhcHBlZFN0eWxlZENvbXBvbmVudCA9IHZvaWQgMDtcbiAgdmFyIGZvcndhcmRSZWYgPSBmdW5jdGlvbiBmb3J3YXJkUmVmKHByb3BzLCByZWYpIHtcbiAgICByZXR1cm4gUmVhY3RfX2RlZmF1bHQuY3JlYXRlRWxlbWVudChQYXJlbnRDb21wb25lbnQsIF9leHRlbmRzKHt9LCBwcm9wcywgeyBmb3J3YXJkZWRDb21wb25lbnQ6IFdyYXBwZWRTdHlsZWRDb21wb25lbnQsIGZvcndhcmRlZFJlZjogcmVmIH0pKTtcbiAgfTtcbiAgZm9yd2FyZFJlZi5kaXNwbGF5TmFtZSA9IGRpc3BsYXlOYW1lO1xuICBXcmFwcGVkU3R5bGVkQ29tcG9uZW50ID0gUmVhY3RfX2RlZmF1bHQuZm9yd2FyZFJlZihmb3J3YXJkUmVmKTtcbiAgV3JhcHBlZFN0eWxlZENvbXBvbmVudC5kaXNwbGF5TmFtZSA9IGRpc3BsYXlOYW1lO1xuXG4gIC8vICRGbG93Rml4TWVcbiAgV3JhcHBlZFN0eWxlZENvbXBvbmVudC5hdHRycyA9IGZpbmFsQXR0cnM7XG4gIC8vICRGbG93Rml4TWVcbiAgV3JhcHBlZFN0eWxlZENvbXBvbmVudC5jb21wb25lbnRTdHlsZSA9IGNvbXBvbmVudFN0eWxlO1xuXG4gIC8vICRGbG93Rml4TWVcbiAgV3JhcHBlZFN0eWxlZENvbXBvbmVudC5mb2xkZWRDb21wb25lbnRJZHMgPSBpc1RhcmdldFN0eWxlZENvbXAgPyAvLyAkRmxvd0ZpeE1lXG4gIEFycmF5LnByb3RvdHlwZS5jb25jYXQodGFyZ2V0LmZvbGRlZENvbXBvbmVudElkcywgdGFyZ2V0LnN0eWxlZENvbXBvbmVudElkKSA6IEVNUFRZX0FSUkFZO1xuXG4gIC8vICRGbG93Rml4TWVcbiAgV3JhcHBlZFN0eWxlZENvbXBvbmVudC5zdHlsZWRDb21wb25lbnRJZCA9IHN0eWxlZENvbXBvbmVudElkO1xuXG4gIC8vIGZvbGQgdGhlIHVuZGVybHlpbmcgU3R5bGVkQ29tcG9uZW50IHRhcmdldCB1cCBzaW5jZSB3ZSBmb2xkZWQgdGhlIHN0eWxlc1xuICAvLyAkRmxvd0ZpeE1lXG4gIFdyYXBwZWRTdHlsZWRDb21wb25lbnQudGFyZ2V0ID0gaXNUYXJnZXRTdHlsZWRDb21wID8gdGFyZ2V0LnRhcmdldCA6IHRhcmdldDtcblxuICAvLyAkRmxvd0ZpeE1lXG4gIFdyYXBwZWRTdHlsZWRDb21wb25lbnQud2l0aENvbXBvbmVudCA9IGZ1bmN0aW9uIHdpdGhDb21wb25lbnQodGFnKSB7XG4gICAgdmFyIHByZXZpb3VzQ29tcG9uZW50SWQgPSBvcHRpb25zLmNvbXBvbmVudElkLFxuICAgICAgICBvcHRpb25zVG9Db3B5ID0gb2JqZWN0V2l0aG91dFByb3BlcnRpZXMob3B0aW9ucywgWydjb21wb25lbnRJZCddKTtcblxuXG4gICAgdmFyIG5ld0NvbXBvbmVudElkID0gcHJldmlvdXNDb21wb25lbnRJZCAmJiBwcmV2aW91c0NvbXBvbmVudElkICsgJy0nICsgKGlzVGFnKHRhZykgPyB0YWcgOiBlc2NhcGUoZ2V0Q29tcG9uZW50TmFtZSh0YWcpKSk7XG5cbiAgICB2YXIgbmV3T3B0aW9ucyA9IF9leHRlbmRzKHt9LCBvcHRpb25zVG9Db3B5LCB7XG4gICAgICBhdHRyczogZmluYWxBdHRycyxcbiAgICAgIGNvbXBvbmVudElkOiBuZXdDb21wb25lbnRJZCxcbiAgICAgIFBhcmVudENvbXBvbmVudDogUGFyZW50Q29tcG9uZW50XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY3JlYXRlU3R5bGVkQ29tcG9uZW50KHRhZywgbmV3T3B0aW9ucywgcnVsZXMpO1xuICB9O1xuXG4gIC8vICRGbG93Rml4TWVcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyYXBwZWRTdHlsZWRDb21wb25lbnQsICdkZWZhdWx0UHJvcHMnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZm9sZGVkRGVmYXVsdFByb3BzO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQkJDEob2JqKSB7XG4gICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICB0aGlzLl9mb2xkZWREZWZhdWx0UHJvcHMgPSBpc1RhcmdldFN0eWxlZENvbXAgPyBtZXJnZSh0YXJnZXQuZGVmYXVsdFByb3BzLCBvYmopIDogb2JqO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgV3JhcHBlZFN0eWxlZENvbXBvbmVudC53YXJuVG9vTWFueUNsYXNzZXMgPSBjcmVhdGVXYXJuVG9vTWFueUNsYXNzZXMoZGlzcGxheU5hbWUpO1xuICB9XG5cbiAgLy8gJEZsb3dGaXhNZVxuICBXcmFwcGVkU3R5bGVkQ29tcG9uZW50LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnLicgKyBXcmFwcGVkU3R5bGVkQ29tcG9uZW50LnN0eWxlZENvbXBvbmVudElkO1xuICB9O1xuXG4gIGlmIChpc0NsYXNzKSB7XG4gICAgaG9pc3ROb25SZWFjdFN0YXRpY3MoV3JhcHBlZFN0eWxlZENvbXBvbmVudCwgdGFyZ2V0LCB7XG4gICAgICAvLyBhbGwgU0Mtc3BlY2lmaWMgdGhpbmdzIHNob3VsZCBub3QgYmUgaG9pc3RlZFxuICAgICAgYXR0cnM6IHRydWUsXG4gICAgICBjb21wb25lbnRTdHlsZTogdHJ1ZSxcbiAgICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgICAgZm9sZGVkQ29tcG9uZW50SWRzOiB0cnVlLFxuICAgICAgc3R5bGVkQ29tcG9uZW50SWQ6IHRydWUsXG4gICAgICB0YXJnZXQ6IHRydWUsXG4gICAgICB3aXRoQ29tcG9uZW50OiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gV3JhcHBlZFN0eWxlZENvbXBvbmVudDtcbn1cblxuLy8gXG4vLyBUaGFua3MgdG8gUmVhY3RET01GYWN0b3JpZXMgZm9yIHRoaXMgaGFuZHkgbGlzdCFcblxudmFyIGRvbUVsZW1lbnRzID0gWydhJywgJ2FiYnInLCAnYWRkcmVzcycsICdhcmVhJywgJ2FydGljbGUnLCAnYXNpZGUnLCAnYXVkaW8nLCAnYicsICdiYXNlJywgJ2JkaScsICdiZG8nLCAnYmlnJywgJ2Jsb2NrcXVvdGUnLCAnYm9keScsICdicicsICdidXR0b24nLCAnY2FudmFzJywgJ2NhcHRpb24nLCAnY2l0ZScsICdjb2RlJywgJ2NvbCcsICdjb2xncm91cCcsICdkYXRhJywgJ2RhdGFsaXN0JywgJ2RkJywgJ2RlbCcsICdkZXRhaWxzJywgJ2RmbicsICdkaWFsb2cnLCAnZGl2JywgJ2RsJywgJ2R0JywgJ2VtJywgJ2VtYmVkJywgJ2ZpZWxkc2V0JywgJ2ZpZ2NhcHRpb24nLCAnZmlndXJlJywgJ2Zvb3RlcicsICdmb3JtJywgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hlYWQnLCAnaGVhZGVyJywgJ2hncm91cCcsICdocicsICdodG1sJywgJ2knLCAnaWZyYW1lJywgJ2ltZycsICdpbnB1dCcsICdpbnMnLCAna2JkJywgJ2tleWdlbicsICdsYWJlbCcsICdsZWdlbmQnLCAnbGknLCAnbGluaycsICdtYWluJywgJ21hcCcsICdtYXJrJywgJ21hcnF1ZWUnLCAnbWVudScsICdtZW51aXRlbScsICdtZXRhJywgJ21ldGVyJywgJ25hdicsICdub3NjcmlwdCcsICdvYmplY3QnLCAnb2wnLCAnb3B0Z3JvdXAnLCAnb3B0aW9uJywgJ291dHB1dCcsICdwJywgJ3BhcmFtJywgJ3BpY3R1cmUnLCAncHJlJywgJ3Byb2dyZXNzJywgJ3EnLCAncnAnLCAncnQnLCAncnVieScsICdzJywgJ3NhbXAnLCAnc2NyaXB0JywgJ3NlY3Rpb24nLCAnc2VsZWN0JywgJ3NtYWxsJywgJ3NvdXJjZScsICdzcGFuJywgJ3N0cm9uZycsICdzdHlsZScsICdzdWInLCAnc3VtbWFyeScsICdzdXAnLCAndGFibGUnLCAndGJvZHknLCAndGQnLCAndGV4dGFyZWEnLCAndGZvb3QnLCAndGgnLCAndGhlYWQnLCAndGltZScsICd0aXRsZScsICd0cicsICd0cmFjaycsICd1JywgJ3VsJywgJ3ZhcicsICd2aWRlbycsICd3YnInLFxuXG4vLyBTVkdcbidjaXJjbGUnLCAnY2xpcFBhdGgnLCAnZGVmcycsICdlbGxpcHNlJywgJ2ZvcmVpZ25PYmplY3QnLCAnZycsICdpbWFnZScsICdsaW5lJywgJ2xpbmVhckdyYWRpZW50JywgJ21hcmtlcicsICdtYXNrJywgJ3BhdGgnLCAncGF0dGVybicsICdwb2x5Z29uJywgJ3BvbHlsaW5lJywgJ3JhZGlhbEdyYWRpZW50JywgJ3JlY3QnLCAnc3RvcCcsICdzdmcnLCAndGV4dCcsICd0c3BhbiddO1xuXG4vLyBcblxudmFyIHN0eWxlZCA9IGZ1bmN0aW9uIHN0eWxlZCh0YWcpIHtcbiAgcmV0dXJuIGNvbnN0cnVjdFdpdGhPcHRpb25zKGNyZWF0ZVN0eWxlZENvbXBvbmVudCwgdGFnKTtcbn07XG5cbi8vIFNob3J0aGFuZHMgZm9yIGFsbCB2YWxpZCBIVE1MIEVsZW1lbnRzXG5kb21FbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChkb21FbGVtZW50KSB7XG4gIHN0eWxlZFtkb21FbGVtZW50XSA9IHN0eWxlZChkb21FbGVtZW50KTtcbn0pO1xuXG4vLyBcblxudmFyIEdsb2JhbFN0eWxlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBHbG9iYWxTdHlsZShydWxlcywgY29tcG9uZW50SWQpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBHbG9iYWxTdHlsZSk7XG5cbiAgICB0aGlzLnJ1bGVzID0gcnVsZXM7XG4gICAgdGhpcy5jb21wb25lbnRJZCA9IGNvbXBvbmVudElkO1xuICAgIHRoaXMuaXNTdGF0aWMgPSBpc1N0YXRpY1J1bGVzKHJ1bGVzLCBFTVBUWV9BUlJBWSk7XG5cbiAgICBpZiAoIVN0eWxlU2hlZXQubWFzdGVyLmhhc0lkKGNvbXBvbmVudElkKSkge1xuICAgICAgU3R5bGVTaGVldC5tYXN0ZXIuZGVmZXJyZWRJbmplY3QoY29tcG9uZW50SWQsIFtdKTtcbiAgICB9XG4gIH1cblxuICBHbG9iYWxTdHlsZS5wcm90b3R5cGUuY3JlYXRlU3R5bGVzID0gZnVuY3Rpb24gY3JlYXRlU3R5bGVzKGV4ZWN1dGlvbkNvbnRleHQsIHN0eWxlU2hlZXQpIHtcbiAgICB2YXIgZmxhdENTUyA9IGZsYXR0ZW4odGhpcy5ydWxlcywgZXhlY3V0aW9uQ29udGV4dCwgc3R5bGVTaGVldCk7XG4gICAgdmFyIGNzcyA9IHN0cmluZ2lmeVJ1bGVzKGZsYXRDU1MsICcnKTtcblxuICAgIHN0eWxlU2hlZXQuaW5qZWN0KHRoaXMuY29tcG9uZW50SWQsIGNzcyk7XG4gIH07XG5cbiAgR2xvYmFsU3R5bGUucHJvdG90eXBlLnJlbW92ZVN0eWxlcyA9IGZ1bmN0aW9uIHJlbW92ZVN0eWxlcyhzdHlsZVNoZWV0KSB7XG4gICAgdmFyIGNvbXBvbmVudElkID0gdGhpcy5jb21wb25lbnRJZDtcblxuICAgIGlmIChzdHlsZVNoZWV0Lmhhc0lkKGNvbXBvbmVudElkKSkge1xuICAgICAgc3R5bGVTaGVldC5yZW1vdmUoY29tcG9uZW50SWQpO1xuICAgIH1cbiAgfTtcblxuICAvLyBUT0RPOiBvdmVyd3JpdGUgaW4tcGxhY2UgaW5zdGVhZCBvZiByZW1vdmUrY3JlYXRlP1xuXG5cbiAgR2xvYmFsU3R5bGUucHJvdG90eXBlLnJlbmRlclN0eWxlcyA9IGZ1bmN0aW9uIHJlbmRlclN0eWxlcyhleGVjdXRpb25Db250ZXh0LCBzdHlsZVNoZWV0KSB7XG4gICAgdGhpcy5yZW1vdmVTdHlsZXMoc3R5bGVTaGVldCk7XG4gICAgdGhpcy5jcmVhdGVTdHlsZXMoZXhlY3V0aW9uQ29udGV4dCwgc3R5bGVTaGVldCk7XG4gIH07XG5cbiAgcmV0dXJuIEdsb2JhbFN0eWxlO1xufSgpO1xuXG4vLyBcblxuLy8gcGxhY2Ugb3VyIGNhY2hlIGludG8gc2hhcmVkIGNvbnRleHQgc28gaXQnbGwgcGVyc2lzdCBiZXR3ZWVuIEhNUnNcbmlmIChJU19CUk9XU0VSKSB7XG4gIHdpbmRvdy5zY0NHU0hNUkNhY2hlID0ge307XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUdsb2JhbFN0eWxlKHN0cmluZ3MpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGludGVycG9sYXRpb25zID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGludGVycG9sYXRpb25zW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciBydWxlcyA9IGNzcy5hcHBseSh1bmRlZmluZWQsIFtzdHJpbmdzXS5jb25jYXQoaW50ZXJwb2xhdGlvbnMpKTtcbiAgdmFyIGlkID0gJ3NjLWdsb2JhbC0nICsgbXVybXVyaGFzaChKU09OLnN0cmluZ2lmeShydWxlcykpO1xuICB2YXIgc3R5bGUgPSBuZXcgR2xvYmFsU3R5bGUocnVsZXMsIGlkKTtcblxuICB2YXIgR2xvYmFsU3R5bGVDb21wb25lbnQgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgIGluaGVyaXRzKEdsb2JhbFN0eWxlQ29tcG9uZW50LCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEdsb2JhbFN0eWxlQ29tcG9uZW50KHByb3BzKSB7XG4gICAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBHbG9iYWxTdHlsZUNvbXBvbmVudCk7XG5cbiAgICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX1JlYWN0JENvbXBvbmVudC5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgIHZhciBfdGhpcyRjb25zdHJ1Y3RvciA9IF90aGlzLmNvbnN0cnVjdG9yLFxuICAgICAgICAgIGdsb2JhbFN0eWxlID0gX3RoaXMkY29uc3RydWN0b3IuZ2xvYmFsU3R5bGUsXG4gICAgICAgICAgc3R5bGVkQ29tcG9uZW50SWQgPSBfdGhpcyRjb25zdHJ1Y3Rvci5zdHlsZWRDb21wb25lbnRJZDtcblxuXG4gICAgICBpZiAoSVNfQlJPV1NFUikge1xuICAgICAgICB3aW5kb3cuc2NDR1NITVJDYWNoZVtzdHlsZWRDb21wb25lbnRJZF0gPSAod2luZG93LnNjQ0dTSE1SQ2FjaGVbc3R5bGVkQ29tcG9uZW50SWRdIHx8IDApICsgMTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBUaGlzIGZpeGVzIEhNUiBjb21wYXRpYmlsaXR5LiBEb24ndCBhc2sgbWUgd2h5LCBidXQgdGhpcyBjb21iaW5hdGlvbiBvZlxuICAgICAgICogY2FjaGluZyB0aGUgY2xvc3VyZSB2YXJpYWJsZXMgdmlhIHN0YXRpY3MgYW5kIHRoZW4gcGVyc2lzdGluZyB0aGUgc3RhdGljcyBpblxuICAgICAgICogc3RhdGUgd29ya3MgYWNyb3NzIEhNUiB3aGVyZSBubyBvdGhlciBjb21iaW5hdGlvbiBkaWQuIMKvXFxfKOODhClfL8KvXG4gICAgICAgKi9cbiAgICAgIF90aGlzLnN0YXRlID0ge1xuICAgICAgICBnbG9iYWxTdHlsZTogZ2xvYmFsU3R5bGUsXG4gICAgICAgIHN0eWxlZENvbXBvbmVudElkOiBzdHlsZWRDb21wb25lbnRJZFxuICAgICAgfTtcbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICBHbG9iYWxTdHlsZUNvbXBvbmVudC5wcm90b3R5cGUuY29tcG9uZW50V2lsbFVubW91bnQgPSBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgIGlmICh3aW5kb3cuc2NDR1NITVJDYWNoZVt0aGlzLnN0YXRlLnN0eWxlZENvbXBvbmVudElkXSkge1xuICAgICAgICB3aW5kb3cuc2NDR1NITVJDYWNoZVt0aGlzLnN0YXRlLnN0eWxlZENvbXBvbmVudElkXSAtPSAxO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBEZXBlbmRpbmcgb24gdGhlIG9yZGVyIFwicmVuZGVyXCIgaXMgY2FsbGVkIHRoaXMgY2FuIGNhdXNlIHRoZSBzdHlsZXMgdG8gYmUgbG9zdFxuICAgICAgICogdW50aWwgdGhlIG5leHQgcmVuZGVyIHBhc3Mgb2YgdGhlIHJlbWFpbmluZyBpbnN0YW5jZSwgd2hpY2ggbWF5XG4gICAgICAgKiBub3QgYmUgaW1tZWRpYXRlLlxuICAgICAgICovXG4gICAgICBpZiAod2luZG93LnNjQ0dTSE1SQ2FjaGVbdGhpcy5zdGF0ZS5zdHlsZWRDb21wb25lbnRJZF0gPT09IDApIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5nbG9iYWxTdHlsZS5yZW1vdmVTdHlsZXModGhpcy5zdHlsZVNoZWV0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgR2xvYmFsU3R5bGVDb21wb25lbnQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBSZWFjdF9fZGVmYXVsdC5DaGlsZHJlbi5jb3VudCh0aGlzLnByb3BzLmNoaWxkcmVuKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLndhcm4oJ1RoZSBnbG9iYWwgc3R5bGUgY29tcG9uZW50ICcgKyB0aGlzLnN0YXRlLnN0eWxlZENvbXBvbmVudElkICsgJyB3YXMgZ2l2ZW4gY2hpbGQgSlNYLiBjcmVhdGVHbG9iYWxTdHlsZSBkb2VzIG5vdCByZW5kZXIgY2hpbGRyZW4uJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBSZWFjdF9fZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBTdHlsZVNoZWV0Q29uc3VtZXIsXG4gICAgICAgIG51bGwsXG4gICAgICAgIGZ1bmN0aW9uIChzdHlsZVNoZWV0KSB7XG4gICAgICAgICAgX3RoaXMyLnN0eWxlU2hlZXQgPSBzdHlsZVNoZWV0IHx8IFN0eWxlU2hlZXQubWFzdGVyO1xuXG4gICAgICAgICAgdmFyIGdsb2JhbFN0eWxlID0gX3RoaXMyLnN0YXRlLmdsb2JhbFN0eWxlO1xuXG5cbiAgICAgICAgICBpZiAoZ2xvYmFsU3R5bGUuaXNTdGF0aWMpIHtcbiAgICAgICAgICAgIGdsb2JhbFN0eWxlLnJlbmRlclN0eWxlcyhTVEFUSUNfRVhFQ1VUSU9OX0NPTlRFWFQsIF90aGlzMi5zdHlsZVNoZWV0KTtcblxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBSZWFjdF9fZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICBUaGVtZUNvbnN1bWVyLFxuICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICBmdW5jdGlvbiAodGhlbWUpIHtcbiAgICAgICAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IF90aGlzMi5jb25zdHJ1Y3Rvci5kZWZhdWx0UHJvcHM7XG5cblxuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0ID0gX2V4dGVuZHMoe30sIF90aGlzMi5wcm9wcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoZW1lICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgY29udGV4dC50aGVtZSA9IGRldGVybWluZVRoZW1lKF90aGlzMi5wcm9wcywgdGhlbWUsIGRlZmF1bHRQcm9wcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZ2xvYmFsU3R5bGUucmVuZGVyU3R5bGVzKGNvbnRleHQsIF90aGlzMi5zdHlsZVNoZWV0KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEdsb2JhbFN0eWxlQ29tcG9uZW50O1xuICB9KFJlYWN0X19kZWZhdWx0LkNvbXBvbmVudCk7XG5cbiAgR2xvYmFsU3R5bGVDb21wb25lbnQuZ2xvYmFsU3R5bGUgPSBzdHlsZTtcbiAgR2xvYmFsU3R5bGVDb21wb25lbnQuc3R5bGVkQ29tcG9uZW50SWQgPSBpZDtcblxuXG4gIHJldHVybiBHbG9iYWxTdHlsZUNvbXBvbmVudDtcbn1cblxuLy8gXG5cbnZhciByZXBsYWNlV2hpdGVzcGFjZSA9IGZ1bmN0aW9uIHJlcGxhY2VXaGl0ZXNwYWNlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcc3xcXFxcbi9nLCAnJyk7XG59O1xuXG5mdW5jdGlvbiBrZXlmcmFtZXMoc3RyaW5ncykge1xuICAvKiBXYXJuaW5nIGlmIHlvdSd2ZSB1c2VkIGtleWZyYW1lcyBvbiBSZWFjdCBOYXRpdmUgKi9cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnByb2R1Y3QgPT09ICdSZWFjdE5hdGl2ZScpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUud2FybignYGtleWZyYW1lc2AgY2Fubm90IGJlIHVzZWQgb24gUmVhY3ROYXRpdmUsIG9ubHkgb24gdGhlIHdlYi4gVG8gZG8gYW5pbWF0aW9uIGluIFJlYWN0TmF0aXZlIHBsZWFzZSB1c2UgQW5pbWF0ZWQuJyk7XG4gIH1cblxuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgaW50ZXJwb2xhdGlvbnMgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgaW50ZXJwb2xhdGlvbnNbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHJ1bGVzID0gY3NzLmFwcGx5KHVuZGVmaW5lZCwgW3N0cmluZ3NdLmNvbmNhdChpbnRlcnBvbGF0aW9ucykpO1xuXG4gIHZhciBuYW1lID0gZ2VuZXJhdGVBbHBoYWJldGljTmFtZShtdXJtdXJoYXNoKHJlcGxhY2VXaGl0ZXNwYWNlKEpTT04uc3RyaW5naWZ5KHJ1bGVzKSkpKTtcblxuICByZXR1cm4gbmV3IEtleWZyYW1lcyhuYW1lLCBzdHJpbmdpZnlSdWxlcyhydWxlcywgbmFtZSwgJ0BrZXlmcmFtZXMnKSk7XG59XG5cbi8vIFxuXG52YXIgd2l0aFRoZW1lID0gKGZ1bmN0aW9uIChDb21wb25lbnQpIHtcbiAgdmFyIFdpdGhUaGVtZSA9IFJlYWN0X19kZWZhdWx0LmZvcndhcmRSZWYoZnVuY3Rpb24gKHByb3BzLCByZWYpIHtcbiAgICByZXR1cm4gUmVhY3RfX2RlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgIFRoZW1lQ29uc3VtZXIsXG4gICAgICBudWxsLFxuICAgICAgZnVuY3Rpb24gKHRoZW1lKSB7XG4gICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICAgdmFyIGRlZmF1bHRQcm9wcyA9IENvbXBvbmVudC5kZWZhdWx0UHJvcHM7XG5cbiAgICAgICAgdmFyIHRoZW1lUHJvcCA9IGRldGVybWluZVRoZW1lKHByb3BzLCB0aGVtZSwgZGVmYXVsdFByb3BzKTtcblxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0aGVtZVByb3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS53YXJuKCdbd2l0aFRoZW1lXSBZb3UgYXJlIG5vdCB1c2luZyBhIFRoZW1lUHJvdmlkZXIgbm9yIHBhc3NpbmcgYSB0aGVtZSBwcm9wIG9yIGEgdGhlbWUgaW4gZGVmYXVsdFByb3BzIGluIGNvbXBvbmVudCBjbGFzcyBcIicgKyBnZXRDb21wb25lbnROYW1lKENvbXBvbmVudCkgKyAnXCInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBSZWFjdF9fZGVmYXVsdC5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgX2V4dGVuZHMoe30sIHByb3BzLCB7IHRoZW1lOiB0aGVtZVByb3AsIHJlZjogcmVmIH0pKTtcbiAgICAgIH1cbiAgICApO1xuICB9KTtcblxuICBob2lzdE5vblJlYWN0U3RhdGljcyhXaXRoVGhlbWUsIENvbXBvbmVudCk7XG5cbiAgV2l0aFRoZW1lLmRpc3BsYXlOYW1lID0gJ1dpdGhUaGVtZSgnICsgZ2V0Q29tcG9uZW50TmFtZShDb21wb25lbnQpICsgJyknO1xuXG4gIHJldHVybiBXaXRoVGhlbWU7XG59KTtcblxuLy8gXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG52YXIgX19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0hBVU5URURfQllfU1BPT0tZX0dIT1NUUyA9IHtcbiAgU3R5bGVTaGVldDogU3R5bGVTaGVldFxufTtcblxuLy8gXG5cbi8qIFdhcm5pbmcgaWYgeW91J3ZlIGltcG9ydGVkIHRoaXMgZmlsZSBvbiBSZWFjdCBOYXRpdmUgKi9cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUud2FybihcIkl0IGxvb2tzIGxpa2UgeW91J3ZlIGltcG9ydGVkICdzdHlsZWQtY29tcG9uZW50cycgb24gUmVhY3QgTmF0aXZlLlxcblwiICsgXCJQZXJoYXBzIHlvdSdyZSBsb29raW5nIHRvIGltcG9ydCAnc3R5bGVkLWNvbXBvbmVudHMvbmF0aXZlJz9cXG5cIiArICdSZWFkIG1vcmUgYWJvdXQgdGhpcyBhdCBodHRwczovL3d3dy5zdHlsZWQtY29tcG9uZW50cy5jb20vZG9jcy9iYXNpY3MjcmVhY3QtbmF0aXZlJyk7XG59XG5cbi8qIFdhcm5pbmcgaWYgdGhlcmUgYXJlIHNldmVyYWwgaW5zdGFuY2VzIG9mIHN0eWxlZC1jb21wb25lbnRzICovXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Rlc3QnICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBuYXZpZ2F0b3IudXNlckFnZW50ID09PSAnc3RyaW5nJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ05vZGUuanMnKSA9PT0gLTEgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdqc2RvbScpID09PSAtMSkge1xuICB3aW5kb3dbJ19fc3R5bGVkLWNvbXBvbmVudHMtaW5pdF9fJ10gPSB3aW5kb3dbJ19fc3R5bGVkLWNvbXBvbmVudHMtaW5pdF9fJ10gfHwgMDtcblxuICBpZiAod2luZG93WydfX3N0eWxlZC1jb21wb25lbnRzLWluaXRfXyddID09PSAxKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLndhcm4oXCJJdCBsb29rcyBsaWtlIHRoZXJlIGFyZSBzZXZlcmFsIGluc3RhbmNlcyBvZiAnc3R5bGVkLWNvbXBvbmVudHMnIGluaXRpYWxpemVkIGluIHRoaXMgYXBwbGljYXRpb24uIFwiICsgJ1RoaXMgbWF5IGNhdXNlIGR5bmFtaWMgc3R5bGVzIG5vdCByZW5kZXJpbmcgcHJvcGVybHksIGVycm9ycyBoYXBwZW5pbmcgZHVyaW5nIHJlaHlkcmF0aW9uIHByb2Nlc3MgJyArICdhbmQgbWFrZXMgeW91ciBhcHBsaWNhdGlvbiBiaWdnZXIgd2l0aG91dCBhIGdvb2QgcmVhc29uLlxcblxcbicgKyAnU2VlIGh0dHBzOi8vcy1jLnNoLzJCQVh6ZWQgZm9yIG1vcmUgaW5mby4nKTtcbiAgfVxuXG4gIHdpbmRvd1snX19zdHlsZWQtY29tcG9uZW50cy1pbml0X18nXSArPSAxO1xufVxuXG4vL1xuXG5leHBvcnRzLmRlZmF1bHQgPSBzdHlsZWQ7XG5leHBvcnRzLmNyZWF0ZUdsb2JhbFN0eWxlID0gY3JlYXRlR2xvYmFsU3R5bGU7XG5leHBvcnRzLmNzcyA9IGNzcztcbmV4cG9ydHMuaXNTdHlsZWRDb21wb25lbnQgPSBpc1N0eWxlZENvbXBvbmVudDtcbmV4cG9ydHMua2V5ZnJhbWVzID0ga2V5ZnJhbWVzO1xuZXhwb3J0cy5TZXJ2ZXJTdHlsZVNoZWV0ID0gU2VydmVyU3R5bGVTaGVldDtcbmV4cG9ydHMuU3R5bGVTaGVldENvbnN1bWVyID0gU3R5bGVTaGVldENvbnN1bWVyO1xuZXhwb3J0cy5TdHlsZVNoZWV0Q29udGV4dCA9IFN0eWxlU2hlZXRDb250ZXh0O1xuZXhwb3J0cy5TdHlsZVNoZWV0TWFuYWdlciA9IFN0eWxlU2hlZXRNYW5hZ2VyO1xuZXhwb3J0cy5UaGVtZUNvbnN1bWVyID0gVGhlbWVDb25zdW1lcjtcbmV4cG9ydHMuVGhlbWVDb250ZXh0ID0gVGhlbWVDb250ZXh0O1xuZXhwb3J0cy5UaGVtZVByb3ZpZGVyID0gVGhlbWVQcm92aWRlcjtcbmV4cG9ydHMud2l0aFRoZW1lID0gd2l0aFRoZW1lO1xuZXhwb3J0cy5fX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfSEFVTlRFRF9CWV9TUE9PS1lfR0hPU1RTID0gX19ET19OT1RfVVNFX09SX1lPVV9XSUxMX0JFX0hBVU5URURfQllfU1BPT0tZX0dIT1NUUztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0eWxlZC1jb21wb25lbnRzLmJyb3dzZXIuY2pzLmpzLm1hcFxuIiwiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IElGb3JtSXRlbVRvcFByb3BzIH0gZnJvbSAnLi90eXBlcydcblxuLy/pgJLlvZLmjqfliLZcbmNvbnN0IE5leHRGb3JtSXRlbURlZXBDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxJRm9ybUl0ZW1Ub3BQcm9wcz4oe30pXG5jb25zdCBOZXh0Rm9ybUl0ZW1TaGFsbG93Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoe30pXG5cbmV4cG9ydCBjb25zdCBGb3JtSXRlbURlZXBQcm92aWRlcjogUmVhY3QuRkM8SUZvcm1JdGVtVG9wUHJvcHM+ID0gKHtcbiAgY2hpbGRyZW4sXG4gIHByZWZpeENscyxcbiAgbGFiZWxBbGlnbixcbiAgbGFiZWxDb2wsXG4gIGlubGluZSxcbiAgd3JhcHBlckNvbCxcbiAgc2l6ZVxufSkgPT4gKFxuICA8TmV4dEZvcm1JdGVtRGVlcENvbnRleHQuUHJvdmlkZXJcbiAgICB2YWx1ZT17e1xuICAgICAgcHJlZml4Q2xzLFxuICAgICAgbGFiZWxBbGlnbixcbiAgICAgIGxhYmVsQ29sLFxuICAgICAgd3JhcHBlckNvbCxcbiAgICAgIGlubGluZSxcbiAgICAgIHNpemVcbiAgICB9fVxuICA+XG4gICAge2NoaWxkcmVufVxuICA8L05leHRGb3JtSXRlbURlZXBDb250ZXh0LlByb3ZpZGVyPlxuKVxuXG5Gb3JtSXRlbURlZXBQcm92aWRlci5kaXNwbGF5TmFtZSA9ICdGb3JtSXRlbURlZXBQcm92aWRlcidcblxuZXhwb3J0IGNvbnN0IHVzZURlZXBGb3JtSXRlbSA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZUNvbnRleHQoTmV4dEZvcm1JdGVtRGVlcENvbnRleHQpXG59XG5cbmV4cG9ydCBjb25zdCBGb3JtSXRlbVNoYWxsb3dQcm92aWRlciA9ICh7IGNoaWxkcmVuLCAuLi5wcm9wcyB9KSA9PiAoXG4gIDxOZXh0Rm9ybUl0ZW1TaGFsbG93Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17cHJvcHN9PlxuICAgIHtjaGlsZHJlbn1cbiAgPC9OZXh0Rm9ybUl0ZW1TaGFsbG93Q29udGV4dC5Qcm92aWRlcj5cbilcblxuZXhwb3J0IGNvbnN0IHVzZVNoYWxsb3dGb3JtSXRlbSA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZUNvbnRleHQoTmV4dEZvcm1JdGVtU2hhbGxvd0NvbnRleHQpXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlUmVmIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBSb3csIENvbCB9IGZyb20gJ2FudGQnXG5pbXBvcnQgU3RpY2t5IGZyb20gJ3JlYWN0LXN0aWtreSdcbmltcG9ydCBjbHMgZnJvbSAnY2xhc3NuYW1lcydcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnXG5pbXBvcnQgeyB1c2VEZWVwRm9ybUl0ZW0gfSBmcm9tICcuLi9jb250ZXh0J1xuaW1wb3J0IHsgSUZvcm1CdXR0b25Hcm91cFByb3BzIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBjcmVhdGVWaXJ0dWFsQm94IH0gZnJvbSAnQGZvcm1pbHkvcmVhY3Qtc2NoZW1hLXJlbmRlcmVyJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElPZmZzZXQge1xuICB0b3A6IG51bWJlciB8IHN0cmluZ1xuICByaWdodDogbnVtYmVyIHwgc3RyaW5nXG4gIGJvdHRvbTogbnVtYmVyIHwgc3RyaW5nXG4gIGxlZnQ6IG51bWJlciB8IHN0cmluZ1xufVxuXG5jb25zdCBnZXRBbGlnbiA9IGFsaWduID0+IHtcbiAgaWYgKGFsaWduID09PSAnc3RhcnQnIHx8IGFsaWduID09PSAnZW5kJykgcmV0dXJuIGFsaWduXG4gIGlmIChhbGlnbiA9PT0gJ2xlZnQnIHx8IGFsaWduID09PSAndG9wJykgcmV0dXJuICdmbGV4LXN0YXJ0J1xuICBpZiAoYWxpZ24gPT09ICdyaWdodCcgfHwgYWxpZ24gPT09ICdib3R0b20nKSByZXR1cm4gJ2ZsZXgtZW5kJ1xuICByZXR1cm4gYWxpZ25cbn1cblxuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IChcbiAgcmVjdDogQ2xpZW50UmVjdCxcbiAge1xuICAgIG9mZnNldCA9IDAsXG4gICAgdGhyZXNob2xkID0gMFxuICB9OiB7XG4gICAgb2Zmc2V0PzogSU9mZnNldCB8IG51bWJlclxuICAgIHRocmVzaG9sZD86IG51bWJlclxuICB9ID0ge31cbik6IGJvb2xlYW4gPT4ge1xuICBjb25zdCB7IHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCwgd2lkdGgsIGhlaWdodCB9ID0gcmVjdFxuICBjb25zdCBpbnRlcnNlY3Rpb24gPSB7XG4gICAgdDogYm90dG9tLFxuICAgIHI6IHdpbmRvdy5pbm5lcldpZHRoIC0gbGVmdCxcbiAgICBiOiB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0b3AsXG4gICAgbDogcmlnaHRcbiAgfVxuXG4gIGNvbnN0IGVsZW1lbnRUaHJlc2hvbGQgPSB7XG4gICAgeDogdGhyZXNob2xkICogd2lkdGgsXG4gICAgeTogdGhyZXNob2xkICogaGVpZ2h0XG4gIH1cblxuICByZXR1cm4gKFxuICAgIGludGVyc2VjdGlvbi50ID49XG4gICAgICAoKG9mZnNldCBhcyBJT2Zmc2V0KS50b3AgfHwgKG9mZnNldCBhcyBudW1iZXIpICsgZWxlbWVudFRocmVzaG9sZC55KSAmJlxuICAgIGludGVyc2VjdGlvbi5yID49XG4gICAgICAoKG9mZnNldCBhcyBJT2Zmc2V0KS5yaWdodCB8fCAob2Zmc2V0IGFzIG51bWJlcikgKyBlbGVtZW50VGhyZXNob2xkLngpICYmXG4gICAgaW50ZXJzZWN0aW9uLmIgPj1cbiAgICAgICgob2Zmc2V0IGFzIElPZmZzZXQpLmJvdHRvbSB8fCAob2Zmc2V0IGFzIG51bWJlcikgKyBlbGVtZW50VGhyZXNob2xkLnkpICYmXG4gICAgaW50ZXJzZWN0aW9uLmwgPj1cbiAgICAgICgob2Zmc2V0IGFzIElPZmZzZXQpLmxlZnQgfHwgKG9mZnNldCBhcyBudW1iZXIpICsgZWxlbWVudFRocmVzaG9sZC54KVxuICApXG59XG5cbmV4cG9ydCBjb25zdCBGb3JtQnV0dG9uR3JvdXA6IFJlYWN0LkZDPElGb3JtQnV0dG9uR3JvdXBQcm9wcz4gPSBzdHlsZWQoXG4gIChwcm9wczogUmVhY3QuUHJvcHNXaXRoQ2hpbGRyZW48SUZvcm1CdXR0b25Hcm91cFByb3BzPikgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHNwYW4sXG4gICAgICB6SW5kZXgsXG4gICAgICBzdGlja3ksXG4gICAgICBzdHlsZSxcbiAgICAgIG9mZnNldCxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGNoaWxkcmVuLFxuICAgICAgdHJpZ2dlckRpc3RhbmNlLFxuICAgICAgaXRlbVN0eWxlXG4gICAgfSA9IHByb3BzXG4gICAgY29uc3QgeyBpbmxpbmUgfSA9IHVzZURlZXBGb3JtSXRlbSgpXG4gICAgY29uc3Qgc2VsZlJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4oKVxuICAgIGNvbnN0IHJlbmRlckNoaWxkcmVuID0gKCkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidXR0b24tZ3JvdXBcIj5cbiAgICAgICAgICA8Um93PlxuICAgICAgICAgICAgPENvbCBzcGFuPXtzcGFufSBvZmZzZXQ9e29mZnNldH0gY2xhc3NOYW1lPVwiaW5saW5lXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5saW5lLXZpZXdcIiBzdHlsZT17aXRlbVN0eWxlfT5cbiAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9Db2w+XG4gICAgICAgICAgPC9Sb3c+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgICBjb25zdCBnZXRTdGlja3lCb3VuZGFyeUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoc2VsZlJlZi5jdXJyZW50ICYmIHNlbGZSZWYuY3VycmVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgY29uc3QgY29udGFpbmVyID0gc2VsZlJlZi5jdXJyZW50LnBhcmVudEVsZW1lbnRcbiAgICAgICAgICByZXR1cm4gaXNFbGVtZW50SW5WaWV3cG9ydChjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb250ZW50ID0gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2NscyhjbGFzc05hbWUsIHtcbiAgICAgICAgICAnaXMtaW5saW5lJzogISFpbmxpbmVcbiAgICAgICAgfSl9XG4gICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgID5cbiAgICAgICAge3JlbmRlckNoaWxkcmVuKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG5cbiAgICBpZiAoc3RpY2t5KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHJlZj17c2VsZlJlZn0+XG4gICAgICAgICAgPFN0aWNreVxuICAgICAgICAgICAgZWRnZT1cImJvdHRvbVwiXG4gICAgICAgICAgICB0cmlnZ2VyRGlzdGFuY2U9e3RyaWdnZXJEaXN0YW5jZX1cbiAgICAgICAgICAgIHpJbmRleD17ekluZGV4fVxuICAgICAgICAgICAgZ2V0U3RpY2t5Qm91bmRhcnk9e2dldFN0aWNreUJvdW5kYXJ5SGFuZGxlcigpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICNlZWUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAoc3R5bGUgJiYgc3R5bGUuYmFja2dyb3VuZCkgfHwgJyNmZmYnLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAoc3R5bGUgJiYgc3R5bGUucGFkZGluZykgfHwgJzhweCAwJ1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBzdHlsZT17c3R5bGV9PlxuICAgICAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvU3RpY2t5PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudFxuICB9XG4pPElGb3JtQnV0dG9uR3JvdXBQcm9wcz5gXG4gICR7KHByb3BzOiBJRm9ybUJ1dHRvbkdyb3VwUHJvcHMpID0+XG4gICAgcHJvcHMuYWxpZ24gPyBgZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDogJHtnZXRBbGlnbihwcm9wcy5hbGlnbil9YCA6ICcnfVxuICAmLmlzLWlubGluZSB7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIGZsZXgtZ3JvdzogMztcbiAgfVxuICAuYnV0dG9uLWdyb3VwIHtcbiAgICAuaW5saW5lIHtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIC5pbmxpbmUtdmlldyB7XG4gICAgICAgICYgPiAqIHtcbiAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gICAgICAgICAgbWFyZ2luLWxlZnQ6IDBweDtcbiAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIH1cbiAgICAgICAgJiA+ICo6bGFzdC1jaGlsZCB7XG4gICAgICAgICAgbWFyZ2luLXJpZ2h0OiAwICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbmBcblxuY3JlYXRlVmlydHVhbEJveDxSZWFjdC5Qcm9wc1dpdGhDaGlsZHJlbjxJRm9ybUJ1dHRvbkdyb3VwUHJvcHM+PihcbiAgJ2J1dHRvbi1ncm91cCcsXG4gIEZvcm1CdXR0b25Hcm91cFxuKVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVJlZiB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgU2NoZW1hTWFya3VwRm9ybSB9IGZyb20gJ0Bmb3JtaWx5L3JlYWN0LXNjaGVtYS1yZW5kZXJlcidcbmltcG9ydCB7IElBbnRkU2NoZW1hRm9ybVByb3BzIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBhdXRvU2Nyb2xsSW5WYWxpZGF0ZUZhaWxlZCB9IGZyb20gJy4uL3NoYXJlZCdcblxuZXhwb3J0IGNvbnN0IFNjaGVtYUZvcm06IFJlYWN0LkZDPElBbnRkU2NoZW1hRm9ybVByb3BzPiA9IHByb3BzID0+IHtcbiAgY29uc3QgZm9ybVJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4oKVxuICByZXR1cm4gKFxuICAgIDxkaXYgcmVmPXtmb3JtUmVmfT5cbiAgICAgIDxTY2hlbWFNYXJrdXBGb3JtXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgb25WYWxpZGF0ZUZhaWxlZD17cmVzdWx0ID0+IHtcbiAgICAgICAgICBpZiAocHJvcHMub25WYWxpZGF0ZUZhaWxlZCkge1xuICAgICAgICAgICAgcHJvcHMub25WYWxpZGF0ZUZhaWxlZChyZXN1bHQpXG4gICAgICAgICAgfVxuICAgICAgICAgIGF1dG9TY3JvbGxJblZhbGlkYXRlRmFpbGVkKGZvcm1SZWYpXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtwcm9wcy5jaGlsZHJlbn1cbiAgICAgIDwvU2NoZW1hTWFya3VwRm9ybT5cbiAgICA8L2Rpdj5cbiAgKVxufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgU2NoZW1hTWFya3VwRmllbGQgfSBmcm9tICdAZm9ybWlseS9yZWFjdC1zY2hlbWEtcmVuZGVyZXInXG5pbXBvcnQgeyBJQW50ZFNjaGVtYUZpZWxkUHJvcHMgfSBmcm9tICcuLi90eXBlcydcbmV4cG9ydCBjb25zdCBGaWVsZDogUmVhY3QuRkM8SUFudGRTY2hlbWFGaWVsZFByb3BzPiA9IFNjaGVtYU1hcmt1cEZpZWxkXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlUmVmLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBGb3JtIGFzIEFudGRGb3JtIH0gZnJvbSAnYW50ZCdcbmltcG9ydCB7IEludGVybmFsRm9ybSB9IGZyb20gJ0Bmb3JtaWx5L3JlYWN0LXNjaGVtYS1yZW5kZXJlcidcbmltcG9ydCB7XG4gIG5vcm1hbGl6ZUNvbCxcbiAgYXV0b1Njcm9sbEluVmFsaWRhdGVGYWlsZWQsXG4gIGlzQW50ZFY0LFxuICBsb2csXG4gIGNsb25lQ2hsaWxkcmVuXG59IGZyb20gJy4uL3NoYXJlZCdcbmltcG9ydCB7IEZvcm1JdGVtRGVlcFByb3ZpZGVyIH0gZnJvbSAnLi4vY29udGV4dCdcbmltcG9ydCB7IElBbnRkRm9ybVByb3BzIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQge1xuICBQcmV2aWV3VGV4dCxcbiAgUHJldmlld1RleHRDb25maWdQcm9wc1xufSBmcm9tICdAZm9ybWlseS9yZWFjdC1zaGFyZWQtY29tcG9uZW50cydcbmltcG9ydCB7IGlzRm4gfSBmcm9tICdAZm9ybWlseS9zaGFyZWQnXG5cbmV4cG9ydCBjb25zdCBGb3JtOiBSZWFjdC5GQzxJQW50ZEZvcm1Qcm9wcyAmXG4gIFByZXZpZXdUZXh0Q29uZmlnUHJvcHM+ID0gcHJvcHMgPT4ge1xuICBjb25zdCB7XG4gICAgaW5saW5lLFxuICAgIGVmZmVjdHMsXG4gICAgYWN0aW9ucyxcbiAgICBpbml0aWFsVmFsdWVzLFxuICAgIHZhbHVlLFxuICAgIGRlZmF1bHRWYWx1ZSxcbiAgICBvbkNoYW5nZSxcbiAgICBvblN1Ym1pdCxcbiAgICBmb3JtLFxuICAgIHVzZURpcnR5LFxuICAgIG9uVmFsaWRhdGVGYWlsZWQsXG4gICAgcHJldmlld1BsYWNlaG9sZGVyLFxuICAgIGVkaXRhYmxlLFxuICAgIHZhbGlkYXRlRmlyc3QsXG4gICAgY2hpbGRyZW4sXG4gICAgLi4ucmVzdFxuICB9ID0gcHJvcHNcbiAgY29uc3QgZm9ybVJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4oKVxuICByZXR1cm4gKFxuICAgIDxJbnRlcm5hbEZvcm1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIG9uVmFsaWRhdGVGYWlsZWQ9e3Jlc3VsdCA9PiB7XG4gICAgICAgIGlmIChwcm9wcy5vblZhbGlkYXRlRmFpbGVkKSB7XG4gICAgICAgICAgcHJvcHMub25WYWxpZGF0ZUZhaWxlZChyZXN1bHQpXG4gICAgICAgIH1cbiAgICAgICAgYXV0b1Njcm9sbEluVmFsaWRhdGVGYWlsZWQoZm9ybVJlZilcbiAgICAgIH19XG4gICAgPlxuICAgICAge2Zvcm0gPT4ge1xuICAgICAgICBjb25zdCBvblN1Ym1pdCA9IGUgPT4ge1xuICAgICAgICAgIGlmIChlICYmIGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIGlmIChlICYmIGUuc3RvcFByb3BhZ2F0aW9uKSBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgZm9ybS5zdWJtaXQoKS5jYXRjaChlID0+IGxvZy53YXJuKGUpKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9uUmVzZXQgPSAoKSA9PiB7XG4gICAgICAgICAgZm9ybS5yZXNldCh7IHZhbGlkYXRlOiBmYWxzZSwgZm9yY2VDbGVhcjogZmFsc2UgfSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZW5kZXJlZENoaWxkcmVuID0gaXNGbihjaGlsZHJlbilcbiAgICAgICAgICA/IGNoaWxkcmVuKGZvcm0pXG4gICAgICAgICAgOiBjbG9uZUNobGlsZHJlbihjaGlsZHJlbilcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8UHJldmlld1RleHQuQ29uZmlnUHJvdmlkZXIgdmFsdWU9e3Byb3BzfT5cbiAgICAgICAgICAgIDxGb3JtSXRlbURlZXBQcm92aWRlciB7Li4ucHJvcHN9PlxuICAgICAgICAgICAgICA8ZGl2IHJlZj17Zm9ybVJlZn0+XG4gICAgICAgICAgICAgICAgPEFudGRGb3JtXG4gICAgICAgICAgICAgICAgICB7Li4ucmVzdH1cbiAgICAgICAgICAgICAgICAgIGNvbXBvbmVudD17dXNlTWVtbygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FudGRWNCkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZm9ybScsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uU3VibWl0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvblJlc2V0XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSwgW10pfVxuICAgICAgICAgICAgICAgICAgb25TdWJtaXQ9e29uU3VibWl0fVxuICAgICAgICAgICAgICAgICAgb25SZXNldD17b25SZXNldH1cbiAgICAgICAgICAgICAgICAgIGxhYmVsQ29sPXtub3JtYWxpemVDb2wocHJvcHMubGFiZWxDb2wpfVxuICAgICAgICAgICAgICAgICAgd3JhcHBlckNvbD17bm9ybWFsaXplQ29sKHByb3BzLndyYXBwZXJDb2wpfVxuICAgICAgICAgICAgICAgICAgbGF5b3V0PXtpbmxpbmUgPyAnaW5saW5lJyA6IHByb3BzLmxheW91dH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7cmVuZGVyZWRDaGlsZHJlbn1cbiAgICAgICAgICAgICAgICA8L0FudGRGb3JtPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvRm9ybUl0ZW1EZWVwUHJvdmlkZXI+XG4gICAgICAgICAgPC9QcmV2aWV3VGV4dC5Db25maWdQcm92aWRlcj5cbiAgICAgICAgKVxuICAgICAgfX1cbiAgICA8L0ludGVybmFsRm9ybT5cbiAgKVxufVxuIiwiY29uc3QgaW5zZXRTdHlsZSA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge307XG4gICAgXG4gICAgcmVzdWx0LmJvcmRlclN0eWxlID0gYFxuICAgICAgICAuYW50LWZvcm0taXRlbS5hbnQtcm93IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG5cbiAgICAgICAgICAgIC5hbnQtZm9ybS1pdGVtLWNoaWxkcmVuIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDMycHg7XG5cbiAgICAgICAgICAgICAgICAubWVnYS1sYXlvdXQtaXRlbS1jb250ZW50IHtcbiAgICAgICAgICAgICAgICAgICAgZmxleDogYXV0bztcbiAgICAgICAgICAgICAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAke3Byb3BzLmhhc0JvcmRlciA/IGBcbiAgICAgICAgICAgIC5hbnQtZm9ybS1pdGVtLmFudC1yb3cge1xuICAgICAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMTJweDtcbiAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjRDhEOEQ4O1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgYCA6IGBcbiAgICAgICAgICAgICYubWVnYS1sYXlvdXQtaXRlbSAuYW50LWZvcm0taXRlbS5hbnQtcm93IHtcbiAgICAgICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgfVxuICAgICAgICBgfVxuICAgIGBcblxuICAgIGlmIChwcm9wcy5pc0xheW91dCkge1xuICAgICAgICByZXN1bHQuaXRlbVN0eWxlID0gYFxuICAgICAgICAgICAgLm1lZ2EtbGF5b3V0LWl0ZW0taW5zZXQge1xuICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5tZWdhLWxheW91dC1pdGVtLWluc2V0LWhhcy1lcnJvciB7XG4gICAgICAgICAgICAgICAgLm1lZ2EtbGF5b3V0LWl0ZW0taW5zZXQtaGVscCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiByZWQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLmFudC1mb3JtLWl0ZW0ge1xuICAgICAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IHJlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5tZWdhLWxheW91dC1pdGVtLWluc2V0LWhhcy13YXJuaW5nIHtcbiAgICAgICAgICAgICAgICAubWVnYS1sYXlvdXQtaXRlbS1pbnNldC1oZWxwIHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICNGRjZBMDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLmFudC1mb3JtLWl0ZW0ge1xuICAgICAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6ICNGRjZBMDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuYW50LWZvcm0taXRlbS1leHBsYWluIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAgfVxuICAgICAgICBgXG5cbiAgICAgICAgcmVzdWx0LmNvbXBvbmVudFN0eWxlID0gYFxuICAgICAgICAgICAgLmFudC1mb3JtLWl0ZW0uYW50LXJvdyAubWVnYS1sYXlvdXQtaXRlbS1jb250ZW50IHtcbiAgICAgICAgICAgICAgICAuYW50LXBpY2tlcixcbiAgICAgICAgICAgICAgICAuYW50LXNlbGVjdC1zaW5nbGU6bm90KC5hbnQtc2VsZWN0LWN1c3RvbWl6ZS1pbnB1dCkgLmFudC1zZWxlY3Qtc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgLmFudC1zZWxlY3Qtc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgLmFudC1waWNrZXItaW5wdXQgaW5wdXQsXG4gICAgICAgICAgICAgICAgLmFudC1pbnB1dC1udW1iZXIsXG4gICAgICAgICAgICAgICAgLmFudC10aW1lLXBpY2tlci1pbnB1dCxcbiAgICAgICAgICAgICAgICAuYW50LXNlbGVjdC1zZWxlY3Rpb24sXG4gICAgICAgICAgICAgICAgLmFudC1pbnB1dCB7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgICAgICAgICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAuYW50LXBpY2tlciB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nLXJpZ2h0OiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5hbnQtcmFkaW8tZ3JvdXAge1xuICAgICAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMS41NzE1O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAuYW50LWNoZWNrYm94LWdyb3VwIHtcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5hbnQtcGlja2VyLXJhbmdlIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMTFweDtcbiAgICAgICAgICAgICAgICAgICAgLmFudC1waWNrZXItaW5wdXQge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC5hbnQtcGlja2VyLWlucHV0IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMCAxMXB4O1xuICAgICAgICAgICAgICAgICAgICA+IGlucHV0IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAuYW50LXBpY2tlci1zdWZmaXgge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmxleDogaW5pdGlhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgYFxuICAgIH1cblxuICAgIHJldHVybiBgXG4gICAgICAgICR7cmVzdWx0Lml0ZW1TdHlsZSB8fCAnJ31cbiAgICAgICAgJHtyZXN1bHQuY29tcG9uZW50U3R5bGUgfHwgJyd9XG4gICAgICAgICR7cmVzdWx0LmJvcmRlclN0eWxlIHx8ICcnfVxuICAgIGBcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5zZXRTdHlsZVxuIiwiaW1wb3J0IHsgZ2xvYmFsVGhpc1BvbHlmaWxsIH0gZnJvbSAnQGZvcm1pbHkvc2hhcmVkJ1xuY29uc3QgaXNJRUNvbXBhdCA9ICEoJ2dyaWQtY29sdW1uLWdhcCcgaW4gKGdsb2JhbFRoaXNQb2x5ZmlsbD8uZG9jdW1lbnQ/LmRvY3VtZW50RWxlbWVudD8uc3R5bGUgfHwge30pKVxuXG5jb25zdCBnZXRJRUdyaWRDb250YWluZXJTdHlsZSA9IChvcHRzKSA9PiB7XG4gICAgaWYgKGlzSUVDb21wYXQpIHtcbiAgICAgICAgY29uc3QgeyBndXR0ZXIsIGF1dG9Sb3cgfSA9IG9wdHNcbiAgICAgICAgY29uc3QgaGFsZkd1dHRlciA9IE1hdGguZmxvb3IoZ3V0dGVyIC8gMilcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAke2F1dG9Sb3cgPyAnZmxleC1mbG93OiByb3cgd3JhcDsnIDogJyd9XG4gICAgICAgICAgICBtYXJnaW46IC0ke2hhbGZHdXR0ZXJ9cHggLSR7aGFsZkd1dHRlcn1weDtcbiAgICAgICAgICAgIGdyaWQtY29sdW1uLWdhcDogMDtcbiAgICAgICAgICAgIGdyaWQtcm93LWdhcDogMDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLmJ1dHRvbi1ncm91cCB7XG4gICAgICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAke2hhbGZHdXR0ZXJ9cHg7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyOyAgIFxuICAgICAgICAgICAgfVxuICAgICAgICBgXG4gICAgfVxuXG4gICAgcmV0dXJuICcnXG59XG5cbmNvbnN0IGdldElFQ29udGFpbmVyQW50ZDNTdHlsZSA9IChvcHRzKSA9PiB7XG4gICAgaWYgKGlzSUVDb21wYXQpIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtd3JhcHBlciB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgICAgICAgICAgICAgPiAuYW50LWZvcm0taXRlbS1jb250cm9sIHtcblxuICAgICAgICAgICAgICAgICAgICA+IC5hbnQtZm9ybS1pdGVtLWNoaWxkcmVuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluLWhlaWdodDogMzJweDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLXdyYXBwZXIge1xuICAgICAgICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgYFxuICAgIH1cblxuICAgIHJldHVybiAnJ1xufVxuXG5jb25zdCBnZXRWYWxpZFNwYW4gPSAoc3BhbiwgY29scykgPT4gc3BhbiA+IGNvbHMgPyBjb2xzIDogc3BhblxuY29uc3QgZ2V0SUVHcmlkSXRlbVN0eWxlID0gKG9wdHMpID0+IHtcbiAgICBpZiAoaXNJRUNvbXBhdCkge1xuICAgICAgICBjb25zdCB7IGd1dHRlciwgc3BhbiwgY29sdW1ucywgaXNTZWNvbmRhcnksXG4gICAgICAgICAgICByZXNwb25zaXZlLCBuZXN0ZWQsXG4gICAgICAgICAgICBlbmFibGVSZXNwb25zaXZlIH0gPSBvcHRzXG4gICAgICAgIGNvbnN0IGhhbGZHdXR0ZXIgPSBNYXRoLmZsb29yKGd1dHRlciAvIDIpXG4gICAgICAgIGNvbnN0IGZsZXhCYXNlID0gYCR7TnVtYmVyKChOdW1iZXIoZ2V0VmFsaWRTcGFuKHNwYW4sIGNvbHVtbnMpKSAvIE51bWJlcihjb2x1bW5zKSkudG9GaXhlZCg2KSkgKiAxMDB9JWBcblxuICAgICAgICBjb25zdCBpdGVtU3R5bGUgPSBgXG4gICAgICAgICAgICAke25lc3RlZCA/IGBwYWRkaW5nOiAke2hhbGZHdXR0ZXJ9cHggJHtoYWxmR3V0dGVyfXB4IDA7YCA6IGBwYWRkaW5nOiAke2hhbGZHdXR0ZXJ9cHg7YH1cbiAgICAgICAgICAgIG1heC13aWR0aDogJHtmbGV4QmFzZX07XG4gICAgICAgICAgICBmbGV4OiAwIDAgJHtmbGV4QmFzZX07XG4gICAgICAgIGBcblxuICAgICAgICBsZXQgcmVzcG9uc2l2ZVN0eWxlID0gJydcbiAgICAgICAgaWYgKGlzU2Vjb25kYXJ5ICYmIGVuYWJsZVJlc3BvbnNpdmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgcywgbSwgbGcgfSA9IHJlc3BvbnNpdmVcbiAgICAgICAgICAgIGNvbnN0IHNGbGV4QmFzZSA9IGAke051bWJlcigoTnVtYmVyKGdldFZhbGlkU3BhbihzcGFuLCBzKSkgLyBOdW1iZXIocykpLnRvRml4ZWQoNikpICogMTAwfSVgXG4gICAgICAgICAgICBjb25zdCBtRmxleEJhc2UgPSBgJHtOdW1iZXIoKE51bWJlcihnZXRWYWxpZFNwYW4oc3BhbiwgbSkpIC8gTnVtYmVyKG0pKS50b0ZpeGVkKDYpKSAqIDEwMH0lYFxuICAgICAgICAgICAgY29uc3QgbGdGbGV4QmFzZSA9IGAke051bWJlcigoTnVtYmVyKGdldFZhbGlkU3BhbihzcGFuLCBsZykpIC8gTnVtYmVyKGxnKSkudG9GaXhlZCg2KSkgKiAxMDB9JWBcblxuICAgICAgICAgICAgcmVzcG9uc2l2ZVN0eWxlID0gYFxuICAgICAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xuICAgICAgICAgICAgICAgICAgICBmbGV4OiAwIDAgJHtzRmxleEJhc2V9O1xuICAgICAgICAgICAgICAgICAgICBtYXgtd2lkdGg6ICR7c0ZsZXhCYXNlfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgQG1lZGlhIChtaW4td2lkdGg6IDcyMHB4KSBhbmQgKG1heC13aWR0aDogMTIwMHB4KSB7XG4gICAgICAgICAgICAgICAgICAgIGZsZXg6IDAgMCAke21GbGV4QmFzZX07XG4gICAgICAgICAgICAgICAgICAgIG1heC13aWR0aDogJHttRmxleEJhc2V9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBAbWVkaWEgKG1pbi13aWR0aDogMTIwMHB4KSB7XG4gICAgICAgICAgICAgICAgICAgIGZsZXg6IDAgMCAke2xnRmxleEJhc2V9O1xuICAgICAgICAgICAgICAgICAgICBtYXgtd2lkdGg6ICR7bGdGbGV4QmFzZX07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgICR7aXRlbVN0eWxlfVxuICAgICAgICAgICAgJHtyZXNwb25zaXZlU3R5bGV9XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICByZXR1cm4gJydcbn1cblxuZXhwb3J0IHtcbiAgICBnZXRJRUNvbnRhaW5lckFudGQzU3R5bGUsXG4gICAgZ2V0SUVHcmlkQ29udGFpbmVyU3R5bGUsXG4gICAgZ2V0SUVHcmlkSXRlbVN0eWxlLFxufVxuIiwiaW1wb3J0IHsgY3NzIH0gZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnXG5pbXBvcnQgaW5zZXRTdHlsZSBmcm9tICcuL2luc2V0J1xuaW1wb3J0IHsgZ2V0SUVDb250YWluZXJBbnRkM1N0eWxlLCBnZXRJRUdyaWRDb250YWluZXJTdHlsZSwgZ2V0SUVHcmlkSXRlbVN0eWxlIH0gZnJvbSAnLi9pZSdcblxuY29uc3QgZm9ybWF0UHggPSBudW0gPT4gKHR5cGVvZiBudW0gPT09ICdzdHJpbmcnID8gbnVtLnJlcGxhY2UoJ3B4JywgJycpIDogbnVtKVxuZXhwb3J0IGNvbnN0IGNvbXB1dGVBbnRkU3R5bGVCYXNlID0gKHByb3BzLCBkZWJ1Zz86IGJvb2xlYW4pID0+IHtcbiAgICBjb25zdCByZXN1bHQ6IGFueSA9IHt9XG4gICAgY29uc3Qge1xuICAgICAgICBsYWJlbEFsaWduLFxuICAgICAgICBpc0xheW91dCxcbiAgICAgICAgaXNTZWNvbmRhcnksXG4gICAgICAgIGlubGluZSxcbiAgICAgICAgbmVzdGVkLFxuICAgICAgICBpbnNldCxcbiAgICAgICAgbGFiZWxDb2wsIGdyaWQsIGNvbnRleHQgPSB7fSwgY29udGV4dENvbHVtbnMsIGNvbHVtbnMsIGF1dG9Sb3csXG4gICAgICAgIHNwYW4sXG4gICAgICAgIHNpemUsXG4gICAgICAgIGhhc0JvcmRlcixcbiAgICAgICAgLy8gbGcsIG0sIHMsXG4gICAgICAgIHJlc3BvbnNpdmUsXG4gICAgICAgIGVuYWJsZVNhZmVXaWR0aCxcbiAgICB9ID0gcHJvcHNcbiAgICBjb25zdCB7IGxnLCBtLCBzIH0gPSByZXNwb25zaXZlIHx8IHt9XG4gICAgY29uc3QgbGFiZWxXaWR0aCA9IGZvcm1hdFB4KHByb3BzLmxhYmVsV2lkdGgpXG4gICAgY29uc3Qgd3JhcHBlcldpZHRoID0gZm9ybWF0UHgocHJvcHMud3JhcHBlcldpZHRoKVxuICAgIGNvbnN0IGd1dHRlciA9IGZvcm1hdFB4KHByb3BzLmd1dHRlcilcblxuICAgIGlmIChpbnNldCkge1xuICAgICAgICByZXN1bHQuaW5zZXRTdHlsZSA9IGluc2V0U3R5bGUoeyBoYXNCb3JkZXIsIGlzTGF5b3V0IH0pXG4gICAgfVxuXG4gICAgcmVzdWx0LmFudGRWM1N0eWxlID0gYFxuICAgICAgICAuYW50LWZvcm0taXRlbS1jb250cm9sOmZpcnN0LWNoaWxkOm5vdChbY2xhc3NePSdhbnQtY29sLSddKTpub3QoW2NsYXNzKj0nIGFudC1jb2wtJ10pIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICB9XG4gICAgICAgICYuYW50LXJvdyB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1mbG93OiByb3cgd3JhcDtcblxuICAgICAgICAgICAgLmFudC1mb3JtLWl0ZW0tbGFiZWwge1xuICAgICAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU3MTU7XG4gICAgICAgICAgICAgICAgZmxvYXQ6IG5vbmU7XG4gICAgICAgICAgICAgICAgPiBsYWJlbCB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICR7c2l6ZSA9PT0gJ3NtYWxsJyA/ICcyNHB4JyA6ICgoc2l6ZSA9PT0gJ21pZGRsZScgfHwgIXNpemUpID8gJzMycHgnIDogJzQwcHgnKSB9O1xuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6ICR7c2l6ZSA9PT0gJ3NtYWxsJyA/ICcxNHB4JyA6ICgoc2l6ZSA9PT0gJ21pZGRsZScgfHwgIXNpemUpID8gJzE0cHgnIDogJzE2cHgnKSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLXdyYXBwZXI6bm90KFtjbGFzcyo9J2FudC1jb2wtJ10pIHtcbiAgICAgICAgICAgICAgICBmbG9hdDogbm9uZTtcbiAgICAgICAgICAgICAgICBmbGV4OiAxIDEgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC5tZWdhLWxheW91dC1pdGVtLWNvbnRlbnQge1xuICAgICAgICAgICAgLmFudC1yYWRpby13cmFwcGVyIHtcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICR7Z2V0SUVDb250YWluZXJBbnRkM1N0eWxlKCl9XG4gICAgYFxuXG4gICAgLy8g5bWM5aWX5LiN6ZyA6KaB5omn6KGM5ZON5bqUXG4gICAgY29uc3QgZGlzYWJsZWRSZXNwb25zaXZlID0gY29udGV4dC5ncmlkICYmIGdyaWQgJiYgY29udGV4dC5yZXNwb25zaXZlXG5cbiAgICAvLyBsYWJlbOWvuem9kOebuOWFsyBsYWJlbEFsaWduXG4gICAgcmVzdWx0LmxhYmVsQWxpZ25TdHlsZSA9IGBcbiAgICAgICAgJiA+IC5hbnQtZm9ybS1pdGVtLWxhYmVsIHtcbiAgICAgICAgICAgIHRleHQtYWxpZ246ICR7bGFiZWxBbGlnbiAhPT0gJ3RvcCcgPyAobGFiZWxBbGlnbiB8fCAncmlnaHQnKSA6ICdsZWZ0J307XG4gICAgICAgIH1cbiAgICBgXG5cbiAgICAvLyDlop7ph4/lsZ7mgKcgYWRkb25CZWZvcmUvYWRkb25BZnRlclxuICAgIHJlc3VsdC5hZGRvblN0eWxlID0gYFxuICAgICAgICAmID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC13cmFwcGVyID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNoaWxkcmVuID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci13cmFwcGVyLFxuICAgICAgICAmID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC13cmFwcGVyID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNoaWxkcmVuID4gLm1lZ2EtbGF5b3V0LWl0ZW0tY29udGVudCxcbiAgICAgICAgJiA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLWlucHV0ID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC1pbnB1dC1jb250ZW50ID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci13cmFwcGVyLFxuICAgICAgICAmID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtaW5wdXQgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLWlucHV0LWNvbnRlbnQgPiAubWVnYS1sYXlvdXQtaXRlbS1jb250ZW50IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogJHtzaXplID09PSAnc21hbGwnID8gJzI0cHgnIDogKChzaXplID09PSAnbWlkZGxlJyB8fCAhc2l6ZSkgPyAnMzJweCcgOiAnNDBweCcpIH07XG4gICAgICAgICAgICA+IC5tZWdhLWxheW91dC1jb250YWluZXItY29udGVudCB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICAgICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICA+IC5tZWdhLWxheW91dC1jb250YWluZXItYmVmb3JlLFxuICAgICAgICAgICAgPiAuZm9ybWlseS1tZWdhLWl0ZW0tYmVmb3JlIHtcbiAgICAgICAgICAgICAgICBmbGV4OiBpbml0aWFsO1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogJHtgJHtwYXJzZUludChndXR0ZXIpIC8gMn1weGB9O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICR7c2l6ZSA9PT0gJ3NtYWxsJyA/ICcyNHB4JyA6ICgoc2l6ZSA9PT0gJ21pZGRsZScgfHwgIXNpemUpID8gJzMycHgnIDogJzQwcHgnKSB9O1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogJHtzaXplID09PSAnc21hbGwnID8gJzE0cHgnIDogKChzaXplID09PSAnbWlkZGxlJyB8fCAhc2l6ZSkgPyAnMTRweCcgOiAnMTZweCcpIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci1hZnRlcixcbiAgICAgICAgICAgID4gLmZvcm1pbHktbWVnYS1pdGVtLWFmdGVyIHtcbiAgICAgICAgICAgICAgICBmbGV4OiBpbml0aWFsO1xuICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAke2Ake3BhcnNlSW50KGd1dHRlcikgLyAyfXB4YH07XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgIGhlaWdodDogJHtzaXplID09PSAnc21hbGwnID8gJzI0cHgnIDogKChzaXplID09PSAnbWlkZGxlJyB8fCAhc2l6ZSkgPyAnMzJweCcgOiAnNDBweCcpIH07XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAke3NpemUgPT09ICdzbWFsbCcgPyAnMTRweCcgOiAoKHNpemUgPT09ICdtaWRkbGUnIHx8ICFzaXplKSA/ICcxNHB4JyA6ICcxNnB4JykgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICYgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLXdyYXBwZXIgPiAuYW50LWZvcm0taXRlbS1jb250cm9sID4gLmFudC1mb3JtLWl0ZW0tY2hpbGRyZW4gPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLXdyYXBwZXIsXG4gICAgICAgICYgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLXdyYXBwZXIgPiAuYW50LWZvcm0taXRlbS1jb250cm9sID4gLmFudC1mb3JtLWl0ZW0tY2hpbGRyZW4gPiAubWVnYS1sYXlvdXQtaXRlbS1jb250ZW50IHtcbiAgICAgICAgICAgIC5hbnQtZm9ybS1pdGVtLWxhYmVsIHtcbiAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMS41NzE1O1xuICAgICAgICAgICAgfSAgICAgICAgICAgIFxuICAgICAgICAgICAgLmFudC1mb3JtLWl0ZW0tbGFiZWwgbGFiZWwge1xuICAgICAgICAgICAgICAgIGhlaWdodDogJHtzaXplID09PSAnc21hbGwnID8gJzI0cHgnIDogKChzaXplID09PSAnbWlkZGxlJyB8fCAhc2l6ZSkgPyAnMzJweCcgOiAnNDBweCcpIH07XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAke3NpemUgPT09ICdzbWFsbCcgPyAnMTRweCcgOiAoKHNpemUgPT09ICdtaWRkbGUnIHx8ICFzaXplKSA/ICcxNHB4JyA6ICcxNnB4JykgfTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgYFxuXG4gICAgLy8g6buY6K6k5Li6ZmxleOW4g+WxgFxuICAgIGlmIChsYWJlbEFsaWduICE9PSAndG9wJyAmJiAhbGFiZWxXaWR0aCAmJiAhbGFiZWxDb2wpIHtcbiAgICAgICAgcmVzdWx0LmRlZmF1bHRTdHlsZSA9IGBcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBcbiAgICAgICAgICAgICYgPiAuYW50LWZvcm0taXRlbS1sYWJlbCB7XG4gICAgICAgICAgICAgICAgZmxleDogaW5pdGlhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICYgPiAuYW50LWZvcm0taXRlbS1jb250cm9sIHtcbiAgICAgICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICBgXG4gICAgfVxuXG4gICAgaWYgKGxhYmVsQWxpZ24gPT09ICd0b3AnKSB7XG4gICAgICAgIHJlc3VsdC5sYWJlbEFsaWduU3R5bGUgKz0gYFxuICAgICAgICAgICAgJi5tZWdhLWxheW91dC1pdGVtIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAke2lubGluZSA/ICdpbmxpbmUtYmxvY2snIDogJ2Jsb2NrJ307XG4gICAgICAgICAgICB9XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICBpZiAobGFiZWxBbGlnbiA9PT0gJ3RvcCcpIHtcbiAgICAgICAgcmVzdWx0LmRlZmF1bHRTdHlsZSA9IGBcbiAgICAgICAgICAgICYuYW50LWZvcm0taXRlbS5hbnQtcm93IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgYFxuICAgIH1cblxuICAgIC8vIOWuveW6puaooeW8j1xuICAgIGlmIChsYWJlbFdpZHRoIHx8IHdyYXBwZXJXaWR0aCkge1xuICAgICAgICByZXN1bHQud2lkdGhTdHlsZSA9IGBcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246ICR7cHJvcHMubGFiZWxBbGlnbiAhPT0gJ3RvcCcgPyAncm93JyA6ICdjb2x1bW4nfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJiA+IC5hbnQtZm9ybS1pdGVtLWxhYmVse1xuICAgICAgICAgICAgICAgICR7bGFiZWxXaWR0aCA/IGBcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICR7bGFiZWxXaWR0aH1weDtcbiAgICAgICAgICAgICAgICAgICAgbWF4LXdpZHRoOiAke2xhYmVsV2lkdGh9cHg7XG4gICAgICAgICAgICAgICAgICAgIGZsZXg6ICR7bGFiZWxBbGlnbiAhPT0gJ3RvcCcgPyBgMCAwICR7bGFiZWxXaWR0aH1weGAgOiAnaW5pdGlhbCd9O1xuICAgICAgICAgICAgICAgICAgICBgIDogXG4gICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC13cmFwcGVyLFxuICAgICAgICAgICAgJiA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wge1xuICAgICAgICAgICAgICAgICR7d3JhcHBlcldpZHRoID8gYFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJHt3cmFwcGVyV2lkdGh9cHg7XG4gICAgICAgICAgICAgICAgICAgIG1heC13aWR0aDogJHt3cmFwcGVyV2lkdGh9cHg7XG4gICAgICAgICAgICAgICAgICAgIGZsZXg6ICR7bGFiZWxBbGlnbiAhPT0gJ3RvcCcgPyBgMCAwICR7d3JhcHBlcldpZHRofXB4YCA6ICdpbml0aWFsJ307XG4gICAgICAgICAgICAgICAgICAgIGAgOiBcbiAgICAgICAgICAgICAgICAgICAgYGZsZXg6IDE7YFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgYFxuICAgIH1cblxuICAgIC8vIOihjOWGheaooeW8j1xuICAgIGlmIChpbmxpbmUpIHtcbiAgICAgICAgcmVzdWx0LmlubGluZVN0eWxlID0gYFxuICAgICAgICAgICAgJiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XG5cbiAgICAgICAgICAgICAgICA+IC5hbnQtZm9ybS1pdGVtLWxhYmVsIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICR7bGFiZWxBbGlnbiAhPT0gJ3RvcCcgPyAnaW5saW5lLWJsb2NrJyA6ICdibG9jayd9O1xuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYubWVnYS1sYXlvdXQtaXRlbSB7XG4gICAgICAgICAgICAgICAgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLXdyYXBwZXIge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAke2xhYmVsQWxpZ24gIT09ICd0b3AnID8gJ2lubGluZS1ibG9jaycgOiAnYmxvY2snfTtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICBgXG5cbiAgICAgICAgaWYgKCFpc0xheW91dCkge1xuICAgICAgICAgICAgcmVzdWx0LmlubGluZVN0eWxlICs9IGBcbiAgICAgICAgICAgICAgICAmLmFudC1mb3JtLWl0ZW0uYW50LXJvdyB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IHRvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJjpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAke2d1dHRlcn1weDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAuYW50LWZvcm0taXRlbS1leHBsYWluLnNob3ctaGVscC1sZWF2ZSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi1kdXJhdGlvbjogMHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgZ3JpZENvbnRhaW5lclN0eWxlID0gKG5lc3RlZD86IGJvb2xlYW4pID0+IHtcbiAgICAgICAgLy8g5L+d5oqk5a695bqm5py65Yi277yM5Y2z5YiX5pWw6L+H5aSa5pe277yM5YaF5a655oyk5Y6L5Lil6YeN77yM5q2k5pe25L2/55So5L+d5bqV55qEMTAwcHjkvZzkuLrmnIDlsI/lrr3luqbkv53miqRcbiAgICAgICAgY29uc3QgZnJTdHlsZSA9ICghZW5hYmxlU2FmZVdpZHRoIHx8IG5lc3RlZCkgPyAnMWZyJyA6ICdtaW5tYXgoMTAwcHgsIDFmciknO1xuICAgICAgICBjb25zdCBjb250YWluZXJTdHlsZSA9ICFkaXNhYmxlZFJlc3BvbnNpdmUgJiYgcmVzcG9uc2l2ZSA/IGBcbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xuICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KCR7KCFlbmFibGVTYWZlV2lkdGggfHwgYXV0b1JvdykgPyBzIDogJ2F1dG8tZml0J30sICR7ZnJTdHlsZX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBAbWVkaWEgKG1pbi13aWR0aDogNzIwcHgpIGFuZCAobWF4LXdpZHRoOiAxMjAwcHgpIHtcbiAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgkeyghZW5hYmxlU2FmZVdpZHRoIHx8IGF1dG9Sb3cpID8gbSA6ICdhdXRvLWZpdCd9LCAke2ZyU3R5bGV9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEBtZWRpYSAobWluLXdpZHRoOiAxMjAwcHgpIHtcbiAgICAgICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgkeyghZW5hYmxlU2FmZVdpZHRoIHx8IGF1dG9Sb3cpID8gbGcgOiAnYXV0by1maXQnfSwgJHtmclN0eWxlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIGAgOiBgXG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgkeyghZW5hYmxlU2FmZVdpZHRoIHx8IGF1dG9Sb3cpID8gY29sdW1ucyA6ICdhdXRvLWZpdCd9LCAke2ZyU3R5bGV9KTtcbiAgICAgICAgYFxuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgICAgIGdyaWQtY29sdW1uLWdhcDogJHtwYXJzZUludChndXR0ZXIpfXB4O1xuICAgICAgICAgICAgZ3JpZC1yb3ctZ2FwOiAke3BhcnNlSW50KGd1dHRlcil9cHg7XG4gICAgICAgICAgICAke2NvbnRhaW5lclN0eWxlfVxuICAgICAgICAgICAgJHtnZXRJRUdyaWRDb250YWluZXJTdHlsZSh7IGd1dHRlciwgYXV0b1JvdyB9KX0gICAgICAgICAgICBcbiAgICAgICAgYFxuICAgIH1cblxuICAgIGNvbnN0IG1pbkNvbHVtbnMgPSBuZXN0ZWQgPyBNYXRoLm1pbihjb2x1bW5zLCBjb250ZXh0Q29sdW1ucykgOiBjb2x1bW5zXG4gICAgY29uc3QgZ3JpZEl0ZW1TcGFuU3R5bGUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGl0ZW1TdHlsZSA9ICFkaXNhYmxlZFJlc3BvbnNpdmUgJiYgcmVzcG9uc2l2ZSA/IGBcbiAgICAgICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkge1xuICAgICAgICAgICAgICAgIGdyaWQtY29sdW1uLXN0YXJ0OiBzcGFuICR7cyA+IHNwYW4gPyBzcGFuIDogc307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBAbWVkaWEgKG1pbi13aWR0aDogNzIwcHgpIGFuZCAobWF4LXdpZHRoOiAxMjAwcHgpIHtcbiAgICAgICAgICAgICAgICBncmlkLWNvbHVtbi1zdGFydDogc3BhbiAke20gPiBzcGFuID8gc3BhbiA6IG19O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgQG1lZGlhIChtaW4td2lkdGg6IDEyMDBweCkge1xuICAgICAgICAgICAgICAgIGdyaWQtY29sdW1uLXN0YXJ0OiBzcGFuICR7bGcgPiBzcGFuID8gc3BhbiA6IGxnfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgYDogYFxuICAgICAgICAgICAgZ3JpZC1jb2x1bW4tc3RhcnQ6IHNwYW4gJHttaW5Db2x1bW5zID4gc3BhbiA/IHNwYW4gOiBtaW5Db2x1bW5zfTtcbiAgICAgICAgYFxuXG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICAke2l0ZW1TdHlsZX1cbiAgICAgICAgICAgICR7Z2V0SUVHcmlkSXRlbVN0eWxlKHtcbiAgICAgICAgICAgICAgICBuZXN0ZWQsXG4gICAgICAgICAgICAgICAgaXNTZWNvbmRhcnksXG4gICAgICAgICAgICAgICAgZ3V0dGVyLFxuICAgICAgICAgICAgICAgIGVuYWJsZVJlc3BvbnNpdmU6ICFkaXNhYmxlZFJlc3BvbnNpdmUgJiYgcmVzcG9uc2l2ZSxcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlLFxuICAgICAgICAgICAgICAgIHNwYW4sXG4gICAgICAgICAgICAgICAgYXV0b1JvdyxcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiBjb250ZXh0Q29sdW1ucyB8fCBjb2x1bW5zLFxuICAgICAgICAgICAgfSl9XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICAvLyBncmlk5qCF5qC85qih5byPXG4gICAgaWYgKCFjb250ZXh0LmdyaWQgJiYgZ3JpZCkge1xuICAgICAgICByZXN1bHQuZ3JpZFN0eWxlID0gYFxuICAgICAgICAgICAgJiA+IC5hbnQtZm9ybS1pdGVtIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICYgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLXdyYXBwZXIgPiAuYW50LWZvcm0taXRlbS1jb250cm9sID4gLmFudC1mb3JtLWl0ZW0tY2hpbGRyZW4gPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLXdyYXBwZXIsXG4gICAgICAgICAgICAmID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC13cmFwcGVyID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNoaWxkcmVuID4gLm1lZ2EtbGF5b3V0LWl0ZW0tY29udGVudCxcbiAgICAgICAgICAgICYgPiAuYW50LWZvcm0taXRlbS1jb250cm9sID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC1pbnB1dCA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtaW5wdXQtY29udGVudCA+IC5tZWdhLWxheW91dC1jb250YWluZXItd3JhcHBlcixcbiAgICAgICAgICAgICYgPiAuYW50LWZvcm0taXRlbS1jb250cm9sID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC1pbnB1dCA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtaW5wdXQtY29udGVudCA+IC5tZWdhLWxheW91dC1pdGVtLWNvbnRlbnQge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLWNvbnRlbnQge1xuICAgICAgICAgICAgICAgICAgICAmLmdyaWQge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHtncmlkQ29udGFpbmVyU3R5bGUoKX1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgYFxuICAgIH1cblxuICAgIGlmIChuZXN0ZWQpIHtcbiAgICAgICAgcmVzdWx0Lm5lc3RMYXlvdXRJdGVtU3R5bGUgPSBgXG4gICAgICAgICAgICAmLm1lZ2EtbGF5b3V0LW5lc3QtY29udGFpbmVyIHtcbiAgICAgICAgICAgICAgICA+IC5tZWdhLWxheW91dC1jb250YWluZXIge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHtncmlkSXRlbVNwYW5TdHlsZSgpfVxuICAgICAgICAgICAgfVxuICAgICAgICBgXG4gICAgfVxuXG4gICAgLy8gZ3JpZCBpdGVtXG4gICAgLy8g5YeP5bCRbGVhdmXnmoTliqjnlLvogJfml7bvvIzpgb/lhY3ljaHpob9cbiAgICBpZiAoIWNvbnRleHQuZ3JpZCAmJiBncmlkICYmIHNwYW4pIHtcbiAgICAgICAgcmVzdWx0LmdyaWRJdGVtU3R5bGUgPSBgXG4gICAgICAgICYubWVnYS1sYXlvdXQtaXRlbS1jb2wgeyAke2dyaWRJdGVtU3BhblN0eWxlKCl9IH1cblxuICAgICAgICAuYW50LWZvcm0taXRlbS1leHBsYWluLnNob3ctaGVscC1sZWF2ZSB7XG4gICAgICAgICAgICBhbmltYXRpb24tZHVyYXRpb246IDBzO1xuICAgICAgICB9XG4gICAgICAgIGBcbiAgICB9XG5cbiAgICAvLyDltYzlpZdncmlk5biD5bGAXG4gICAgaWYgKGNvbnRleHQuZ3JpZCAmJiBncmlkKSB7XG4gICAgICAgIHJlc3VsdC5ncmlkU3R5bGUgPSBgXG4gICAgICAgICAgICAmID4gLmFudC1mb3JtLWl0ZW0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC13cmFwcGVyID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNoaWxkcmVuID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci13cmFwcGVyLFxuICAgICAgICAgICAgJiA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtd3JhcHBlciA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wgPiAuYW50LWZvcm0taXRlbS1jaGlsZHJlbiA+IC5tZWdhLWxheW91dC1pdGVtLWNvbnRlbnQsXG4gICAgICAgICAgICAmID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtaW5wdXQgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLWlucHV0LWNvbnRlbnQgPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLXdyYXBwZXIsXG4gICAgICAgICAgICAmID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtaW5wdXQgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLWlucHV0LWNvbnRlbnQgPiAubWVnYS1sYXlvdXQtaXRlbS1jb250ZW50IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci1jb250ZW50IHtcbiAgICAgICAgICAgICAgICAgICAgJi5ncmlkIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR7Z3JpZENvbnRhaW5lclN0eWxlKHRydWUpfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBgXG4gICAgfVxuICAgIFxuICAgIC8vIOWkhOeQhuW1jOWll+i+uei3nVxuICAgIGlmIChpc0xheW91dCkge1xuICAgICAgICByZXN1bHQubGF5b3V0TWFyZ2luU3R5bGUgPSAnJ1xuICAgICAgICAvLyDlhoXlrrnpg73lnKjlkIzkuIDooYxcbiAgICAgICAgaWYgKGlubGluZSB8fCBncmlkKSB7XG4gICAgICAgICAgICByZXN1bHQubGF5b3V0TWFyZ2luU3R5bGUgPSBgXG4gICAgICAgICAgICAgICAgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLXdyYXBwZXIgPiAuYW50LWZvcm0taXRlbS1jb250cm9sID4gLmFudC1mb3JtLWl0ZW0tY2hpbGRyZW4gPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLXdyYXBwZXIgPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLWNvbnRlbnQgPiAubWVnYS1sYXlvdXQtaXRlbS1jb2wgPiAuYW50LWZvcm0taXRlbSxcbiAgICAgICAgICAgICAgICA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtd3JhcHBlciA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wgPiAuYW50LWZvcm0taXRlbS1jaGlsZHJlbiA+IC5tZWdhLWxheW91dC1jb250YWluZXItd3JhcHBlciA+IC5tZWdhLWxheW91dC1jb250YWluZXItY29udGVudCA+IC5tZWdhLWxheW91dC1pdGVtLWNvbCA+IC5tZWdhLWxheW91dC1pdGVtLFxuICAgICAgICAgICAgICAgID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC13cmFwcGVyID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNoaWxkcmVuID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci13cmFwcGVyID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci1jb250ZW50ID4gLm1lZ2EtbGF5b3V0LWl0ZW0sXG4gICAgICAgICAgICAgICAgPiAuYW50LWZvcm0taXRlbS1jb250cm9sID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC1pbnB1dCA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtaW5wdXQtY29udGVudCA+IC5tZWdhLWxheW91dC1jb250YWluZXItd3JhcHBlciA+IC5tZWdhLWxheW91dC1jb250YWluZXItY29udGVudCA+IC5tZWdhLWxheW91dC1pdGVtLWNvbCA+IC5hbnQtZm9ybS1pdGVtLFxuICAgICAgICAgICAgICAgID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtaW5wdXQgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLWlucHV0LWNvbnRlbnQgPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLXdyYXBwZXIgPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLWNvbnRlbnQgPiAubWVnYS1sYXlvdXQtaXRlbS1jb2wgPiAubWVnYS1sYXlvdXQtaXRlbSxcbiAgICAgICAgICAgICAgICA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLWlucHV0ID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC1pbnB1dC1jb250ZW50ID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci13cmFwcGVyID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci1jb250ZW50ID4gLm1lZ2EtbGF5b3V0LWl0ZW0ge1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGBcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOW4uOinhOW4g+WxgFxuICAgICAgICBpZiAoIWdyaWQgJiYgIWlubGluZSkge1xuICAgICAgICAgICAgcmVzdWx0LmxheW91dE1hcmdpblN0eWxlID0gYFxuICAgICAgICAgICAgICAgID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC13cmFwcGVyID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNoaWxkcmVuID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci13cmFwcGVyID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci1jb250ZW50ID4gLm1lZ2EtbGF5b3V0LWl0ZW06bGFzdC1jaGlsZCxcbiAgICAgICAgICAgICAgICA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLWlucHV0ID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC1pbnB1dC1jb250ZW50ID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci13cmFwcGVyID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci1jb250ZW50ID4gLm1lZ2EtbGF5b3V0LWl0ZW06bGFzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTGF5b3V0KSB7XG4gICAgICAgICAgICByZXN1bHQubGF5b3V0TWFyZ2luU3R5bGUgKz0gYFxuICAgICAgICAgICAgICAgID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbC13cmFwcGVyID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNoaWxkcmVuID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci13cmFwcGVyID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lci1jb250ZW50ID4gLm1lZ2EtbGF5b3V0LWNvbnRhaW5lcjpsYXN0LWNoaWxkLFxuICAgICAgICAgICAgICAgID4gLmFudC1mb3JtLWl0ZW0tY29udHJvbCA+IC5hbnQtZm9ybS1pdGVtLWNvbnRyb2wtaW5wdXQgPiAuYW50LWZvcm0taXRlbS1jb250cm9sLWlucHV0LWNvbnRlbnQgPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLXdyYXBwZXIgPiAubWVnYS1sYXlvdXQtY29udGFpbmVyLWNvbnRlbnQgPiAubWVnYS1sYXlvdXQtY29udGFpbmVyOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGNvbnN0IGNvbXB1dGVTdHlsZSA9IChwcm9wcywgZGVidWc/OiBib29sZWFuKSA9PiB7XG4gICAgY29uc3Qgc3R5bGVSZXN1bHQgPSBjb21wdXRlQW50ZFN0eWxlQmFzZShwcm9wcywgZGVidWcpXG4gICAgXG4gICAgLy8gbGFiZWxBbGlnbiwgYWRkb24g5piv5Lu75L2V5biD5bGA5qih5byP6YO95Y+v5Lul55So5YiwXG4gICAgLy8gaW5saW5lIOWSjCBncmlkIOaYr+S6kuaWpeWFs+ezuywg5LyY5YWI57qnOiBpbmxpbmUgPiBncmlkXG4gICAgLy8g5pyA57uI6LCD55So5LiA5qyhY3Nz6K6h566X5pa55rOV77yM5Lya6Ieq5Yqo562b5Y675ZCM5L2N572u5LiN55Sf5pWI55qE5Luj56CBXG5cbiAgICByZXR1cm4gY3NzYCAgICAgICAgXG4gICAgICAgICR7c3R5bGVSZXN1bHQuYW50ZFYzU3R5bGV9XG4gICAgICAgICR7c3R5bGVSZXN1bHQubGFiZWxBbGlnblN0eWxlfVxuICAgICAgICAke3N0eWxlUmVzdWx0LmFkZG9uU3R5bGV9XG4gICAgICAgICR7c3R5bGVSZXN1bHQuZGVmYXVsdFN0eWxlfVxuICAgICAgICAke3N0eWxlUmVzdWx0LndpZHRoU3R5bGV9XG4gICAgICAgICR7c3R5bGVSZXN1bHQuaW5saW5lU3R5bGV9XG4gICAgICAgICR7c3R5bGVSZXN1bHQuZ3JpZFN0eWxlfVxuICAgICAgICAke3N0eWxlUmVzdWx0LmdyaWRJdGVtU3R5bGV9XG4gICAgICAgICR7c3R5bGVSZXN1bHQubmVzdExheW91dEl0ZW1TdHlsZX1cbiAgICAgICAgJHtzdHlsZVJlc3VsdC5sYXlvdXRNYXJnaW5TdHlsZX1cbiAgICAgICAgJHtzdHlsZVJlc3VsdC5pbnNldFN0eWxlfVxuICAgIGBcbn0iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xuaW1wb3J0IHsgRm9ybSB9IGZyb20gJ2FudGQnXG5pbXBvcnQgeyBjcmVhdGVWaXJ0dWFsQm94LCBMYXlvdXQsIExheW91dEl0ZW0sIElMYXlvdXRQcm9wcyB9IGZyb20gJ0Bmb3JtaWx5L3JlYWN0LXNjaGVtYS1yZW5kZXJlcidcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnXG5pbXBvcnQgeyB1c2VEZWVwRm9ybUl0ZW0gfSBmcm9tICcuLi8uLi9jb250ZXh0J1xuaW1wb3J0IHsgbm9ybWFsaXplQ29sLCBwaWNrRm9ybUl0ZW1Qcm9wcywgcGlja05vdEZvcm1JdGVtUHJvcHMgfSBmcm9tICcuLi8uLi9zaGFyZWQnXG5pbXBvcnQgeyBjb21wdXRlU3R5bGUgfSBmcm9tICcuL3N0eWxlJ1xuXG4vLyDkvJjlhYjnuqfvvJrlvZPliY3lsZ7mgKcgPiBjb250ZXh0IOS8oOmAkueahOWxnuaApyA+IOm7mOiupOWAvFxuY29uc3QgY29tcHV0ZUF0dHIgPSAocHJvcEF0dHIsIGxheW91dEF0dHIsIGRlZmF1bHRWYWx1ZSkgPT4ge1xuICBpZiAodHlwZW9mIHByb3BBdHRyICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIHByb3BBdHRyXG4gIGlmICh0eXBlb2YgbGF5b3V0QXR0ciAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiBsYXlvdXRBdHRyXG4gIHJldHVybiBkZWZhdWx0VmFsdWVcbn07XG5cbmNvbnN0IFN0eWxlZExheW91dEl0ZW0gPSBzdHlsZWQoKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBjbGFzc05hbWUsIGdyaWQsIGNoaWxkcmVuLCBhZGRvbkJlZm9yZSwgYWRkb25BZnRlciwgbGFiZWxBbGlnbiwgLi4ub3RoZXJzIH0gPSBwcm9wc1xuICAgIGNvbnN0IGZvcm1JdGVtUHJvcHMgPSBwaWNrRm9ybUl0ZW1Qcm9wcyhvdGhlcnMpXG4gICAgZm9ybUl0ZW1Qcm9wcy5zdHlsZSA9IHByb3BzLnN0eWxlIHx8IHt9XG4gICAgY29uc3QgY2xzID0gY2xhc3NuYW1lcyh7XG4gICAgICBbY2xhc3NOYW1lXTogdHJ1ZSxcbiAgICAgICdtZWdhLWxheW91dC1pdGVtJzogdHJ1ZSxcbiAgICAgICdtZWdhLWxheW91dC1pdGVtLWNvbCc6IGdyaWQsXG4gICAgfSk7XG5cbiAgICBsZXQgZmluYWxIZWxwSW5mbyA9IG51bGxcbiAgICBpZiAocHJvcHMuaW5zZXQgJiYgZm9ybUl0ZW1Qcm9wcy52YWxpZGF0ZVN0YXR1cykgeyAgICAgIFxuICAgICAgZmluYWxIZWxwSW5mbyA9IDxkaXYgY2xhc3NOYW1lPVwibWVnYS1sYXlvdXQtaXRlbS1pbnNldC1oZWxwXCI+XG4gICAgICAgIHtmb3JtSXRlbVByb3BzLmhlbHBbMF19XG4gICAgICA8L2Rpdj5cbiAgICB9XG5cbiAgICBjb25zdCBmaW5hbEZvcm1JdGVtID0gKGNscykgPT4gKDxGb3JtLkl0ZW0gY2xhc3NOYW1lPXtjbHN9IHsuLi5mb3JtSXRlbVByb3BzfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVnYS1sYXlvdXQtaXRlbS1jb250ZW50XCI+XG4gICAgICAgIHsgYWRkb25CZWZvcmUgPyA8cCBjbGFzc05hbWU9XCJmb3JtaWx5LW1lZ2EtaXRlbS1iZWZvcmVcIj57YWRkb25CZWZvcmV9PC9wPiA6IG51bGwgfVxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgIHsgYWRkb25BZnRlciA/IDxwIGNsYXNzTmFtZT1cImZvcm1pbHktbWVnYS1pdGVtLWFmdGVyXCI+e2FkZG9uQWZ0ZXJ9PC9wPiA6IG51bGwgfVxuICAgICAgPC9kaXY+XG4gICAgPC9Gb3JtLkl0ZW0+KVxuXG4gICAgaWYgKGdyaWQpIHtcbiAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NuYW1lcyh7XG4gICAgICAgIFtjbHNdOiB0cnVlLFxuICAgICAgICAnbWVnYS1sYXlvdXQtaXRlbS1pbnNldCc6IHByb3BzLmluc2V0LFxuICAgICAgICAnbWVnYS1sYXlvdXQtaXRlbS1pbnNldC1oYXMtZXJyb3InOiBmb3JtSXRlbVByb3BzLnZhbGlkYXRlU3RhdHVzID09PSAnZXJyb3InLFxuICAgICAgICAnbWVnYS1sYXlvdXQtaXRlbS1pbnNldC1oYXMtd2FybmluZyc6IGZvcm1JdGVtUHJvcHMudmFsaWRhdGVTdGF0dXMgPT09ICd3YXJuaW5nJyxcbiAgICAgIH0pfT5cbiAgICAgICAge2ZpbmFsRm9ybUl0ZW0oY2xhc3NOYW1lKX1cbiAgICAgICAge2ZpbmFsSGVscEluZm99XG4gICAgICA8L2Rpdj5cbiAgICB9XG5cbiAgICByZXR1cm4gZmluYWxGb3JtSXRlbShjbHMpXG59KWAke3Byb3BzID0+IGNvbXB1dGVTdHlsZShwcm9wcyl9YFxuXG5cbmNvbnN0IFN0eWxlZExheW91dFdyYXBwZXIgPSBzdHlsZWQoKHByb3BzKSA9PiB7XG4gICAgY29uc3QgZm9ybUl0ZW1Qcm9wcyA9IHBpY2tGb3JtSXRlbVByb3BzKHByb3BzKTtcbiAgICBjb25zdCB7IGxhYmVsQWxpZ24sIGFkZG9uQWZ0ZXIsIGFkZG9uQmVmb3JlLCAuLi5vdGhlcnMgfSA9IGZvcm1JdGVtUHJvcHNcbiAgICBvdGhlcnMuY2hpbGRyZW4gPSBwcm9wcy5jaGlsZHJlblxuICAgIG90aGVycy5jbGFzc05hbWUgPSBwcm9wcy5jbGFzc05hbWVcblxuICAgIHJldHVybiA8Rm9ybS5JdGVtIHsuLi5vdGhlcnN9IC8+XG59KWAke3Byb3BzID0+IGNvbXB1dGVTdHlsZShwcm9wcyl9YFxuXG5jb25zdCBTdHlsZWRMYXlvdXROZXN0V3JhcHBlciA9IHN0eWxlZChwcm9wcyA9PiB7XG4gIGNvbnN0IHsgY2hpbGRyZW4sIHN0eWxlLCBjbGFzc05hbWUgfSA9IHByb3BzO1xuICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9IGNsYXNzTmFtZT17Y2xhc3NuYW1lcygnbWVnYS1sYXlvdXQtbmVzdC1jb250YWluZXInLCBjbGFzc05hbWUpfT57Y2hpbGRyZW59PC9kaXY+XG59KWAke3Byb3BzID0+IGNvbXB1dGVTdHlsZShwcm9wcywgdHJ1ZSl9YFxuXG5cbmNvbnN0IE1lZ2FMYXlvdXQgPSAocHJvcHM6IElMYXlvdXRQcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgY2hpbGRyZW4sIGFkZG9uQmVmb3JlLCBhZGRvbkFmdGVyLCBkZXNjcmlwdGlvbiwgY2xhc3NOYW1lOiBtZWdhTGF5b3V0Q2xhc3NOYW1lLCAuLi5vdGhlcnMgfSA9IHByb3BzXG4gICAgY29uc3QgbGF5b3V0UHJvcHMgPSBwcm9wcy5sYXlvdXRQcm9wcyB8fCB7fVxuICAgIGNvbnN0IHsgc2l6ZSB9ID0gdXNlRGVlcEZvcm1JdGVtKClcblxuICAgIC8vIOazqOaEjywgbGFiZWxDb2wvd3JhcHBlckNvbCwgbGFiZWxXaWR0aC93cmFwcGVyV2lkdGggTGF5b3V05Y+q6IO96YCP5Lyg5LiL5Y67XG4gICAgLy8g6Ieq6Lqr55qEIGxhYmVsQ29sL3dyYXBwZXJDb2wsIGxhYmVsV2lkdGgvd3JhcHBlcldpZHRoIOW/hemhu+mAmui/h+WFtmxheW91dFByb3Bz5p2l5o6n5Yi2XG4gICAgXG4gICAgcmV0dXJuIDxMYXlvdXQgICAgICAgIFxuICAgICAgICBkZWZhdWx0U2V0dGluZ3M9e3tcbiAgICAgICAgICAgIGd1dHRlcjogMjAsXG4gICAgICAgIH19XG4gICAgICAgIHsuLi5vdGhlcnN9XG4gICAgICAgIHNpemU9e3NpemV9XG4gICAgICAgIGNoaWxkcmVuPXsobGF5b3V0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGlubGluZSwgcmVxdWlyZWQsIGNvbHVtbnMsIGxhYmVsLCBsYWJlbEFsaWduLFxuICAgICAgICAgICAgICAgIGdyaWQsIGd1dHRlciwgYXV0b1Jvdywgc3BhbiwgY29udGV4dENvbHVtbnMsXG4gICAgICAgICAgICAgICAgZnVsbCwgY29udGV4dCwgaXNSb290LCByZXNwb25zaXZlLCBpbnNldCwgaGFzQm9yZGVyLFxuICAgICAgICAgICAgICAgIGVuYWJsZVNhZmVXaWR0aCxcbiAgICAgICAgICAgIH0gPSBsYXlvdXRcbiAgICAgICAgICAgIGNvbnN0IGlzU2Vjb25kYXJ5ID0gY29udGV4dC5pc1Jvb3RcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1Qcm9wczogYW55ID0ge1xuICAgICAgICAgICAgICBlbmFibGVTYWZlV2lkdGgsXG4gICAgICAgICAgICAgIGlzU2Vjb25kYXJ5LFxuICAgICAgICAgICAgICBpbmxpbmUsXG4gICAgICAgICAgICAgIGdyaWQsXG4gICAgICAgICAgICAgIGF1dG9Sb3csXG4gICAgICAgICAgICAgIGd1dHRlcixcbiAgICAgICAgICAgICAgZnVsbCxcbiAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICAgY29sdW1ucyxcbiAgICAgICAgICAgICAgY29udGV4dENvbHVtbnMsXG4gICAgICAgICAgICAgIGlzUm9vdCxcbiAgICAgICAgICAgICAgaXNMYXlvdXQ6IHRydWUsICAgIFxuICAgICAgICAgICAgICByZXNwb25zaXZlLFxuICAgICAgICAgICAgICBzaXplLFxuICAgICAgICAgICAgICBpbnNldCxcbiAgICAgICAgICAgICAgaGFzQm9yZGVyLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgICAgICAgICAgLy8g5Y+q6IO96YCa6L+HbGF5b3V0UHJvcHPmnaXmlLnliqjlvZPliY1NZWdhTGF5b3V055qEbGFiZWwvd3JhcHBlcuebuOWFs+mFjee9rlxuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsV2lkdGggPSBjb21wdXRlQXR0cihsYXlvdXRQcm9wcy5sYWJlbFdpZHRoLCBjb250ZXh0LmxhYmVsV2lkdGgsIC0xKVxuICAgICAgICAgICAgICAgIGNvbnN0IHdyYXBwZXJXaWR0aCA9IGNvbXB1dGVBdHRyKGxheW91dFByb3BzLndyYXBwZXJXaWR0aCwgY29udGV4dC53cmFwcGVyV2lkdGgsIC0xKVxuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsQ29sID0gY29tcHV0ZUF0dHIobGF5b3V0UHJvcHMubGFiZWxDb2wsIGNvbnRleHQubGFiZWxDb2wsIC0xKVxuICAgICAgICAgICAgICAgIGNvbnN0IHdyYXBwZXJDb2wgPSBjb21wdXRlQXR0cihsYXlvdXRQcm9wcy53cmFwcGVyQ29sLCBjb250ZXh0LndyYXBwZXJDb2wsIC0xKVxuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsQWxpZ24gPSBjb21wdXRlQXR0cihsYXlvdXRQcm9wcy5sYWJlbEFsaWduLCBjb250ZXh0LmxhYmVsQWxpZ24sIC0xKVxuXG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsQWxpZ24pIGl0ZW1Qcm9wcy5sYWJlbEFsaWduID0gbGFiZWxBbGlnblxuICAgICAgICAgICAgICAgIGlmIChsYWJlbENvbCAhPT0gLTEpIGl0ZW1Qcm9wcy5sYWJlbENvbCA9IG5vcm1hbGl6ZUNvbChsYWJlbENvbClcbiAgICAgICAgICAgICAgICBpZiAod3JhcHBlckNvbCAhPT0gLTEpIGl0ZW1Qcm9wcy53cmFwcGVyQ29sID0gbm9ybWFsaXplQ29sKHdyYXBwZXJDb2wpXG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsV2lkdGggIT09IC0xKSBpdGVtUHJvcHMubGFiZWxXaWR0aCA9IGxhYmVsV2lkdGhcbiAgICAgICAgICAgICAgICBpZiAod3JhcHBlcldpZHRoICE9PSAtMSkgaXRlbVByb3BzLndyYXBwZXJXaWR0aCA9IHdyYXBwZXJXaWR0aFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGVsZSA9IDxTdHlsZWRMYXlvdXRXcmFwcGVyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc25hbWVzKFwibWVnYS1sYXlvdXQtY29udGFpbmVyXCIsIG1lZ2FMYXlvdXRDbGFzc05hbWUgfHwgJycpfVxuICAgICAgICAgICAgICAgIGxhYmVsPXtsYWJlbH1cbiAgICAgICAgICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XG4gICAgICAgICAgICAgICAgaGVscD17ZGVzY3JpcHRpb259XG4gICAgICAgICAgICAgICAgbGFiZWxBbGlnbj17bGFiZWwgPyBsYWJlbEFsaWduIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgICAgIHsuLi5pdGVtUHJvcHN9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZWdhLWxheW91dC1jb250YWluZXItd3JhcHBlclwiPlxuICAgICAgICAgICAgICAgICAgICB7IGFkZG9uQmVmb3JlID8gPHAgY2xhc3NOYW1lPVwibWVnYS1sYXlvdXQtY29udGFpbmVyLWJlZm9yZVwiPnthZGRvbkJlZm9yZX08L3A+IDogbnVsbCB9XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKCdtZWdhLWxheW91dC1jb250YWluZXItY29udGVudCcsIHsgZ3JpZCB9KX0+XG4gICAgICAgICAgICAgICAgICAgICAge2NoaWxkcmVufVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgeyBhZGRvbkFmdGVyID8gPHAgY2xhc3NOYW1lPVwibWVnYS1sYXlvdXQtY29udGFpbmVyLWFmdGVyXCI+e2FkZG9uQWZ0ZXJ9PC9wPiA6IG51bGwgfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9TdHlsZWRMYXlvdXRXcmFwcGVyPlxuXG4gICAgICAgICAgICAvLyDltYzlpZfluIPlsYBcbiAgICAgICAgICAgIGlmICghcHJvcHMuZ3JpZCAmJiBncmlkKSB7ICAgXG4gICAgICAgICAgICAgIHJldHVybiA8U3R5bGVkTGF5b3V0TmVzdFdyYXBwZXIgbmVzdGVkIHsuLi57c3BhbiwgY29sdW1ucywgY29udGV4dENvbHVtbnMsIGd1dHRlciwgaXNTZWNvbmRhcnksIGNvbnRleHQsIHJlc3BvbnNpdmV9fT5cbiAgICAgICAgICAgICAgICB7ZWxlfVxuICAgICAgICAgICAgICA8L1N0eWxlZExheW91dE5lc3RXcmFwcGVyPlxuICAgICAgICAgICAgfVxuICAgICBcbiAgICAgICAgICAgIHJldHVybiBlbGVcbiAgICAgICAgfX1cbiAgICAvPlxufTtcblxuY29uc3QgTWVnYUxheW91dEl0ZW0gPSAocHJvcHMpID0+IHtcbiAgY29uc3QgeyBjaGlsZHJlbiwgc2NoZW1hQ2hpbGRyZW4sIGl0ZW1Qcm9wcywgLi4ub3RoZXJzIH0gPSBwcm9wc1xuICBjb25zdCBtZWdhUHJvcHMgPSAoc2NoZW1hQ2hpbGRyZW4gPyBvdGhlcnNbJ3gtbWVnYS1wcm9wcyddIDogb3RoZXJzWydtZWdhLXByb3BzJ10pIHx8IHt9XG4gIGNvbnN0IGlzT2JqZWN0RmllbGQgPSBvdGhlcnMudHlwZSA9PT0gJ29iamVjdCdcblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChMYXlvdXRJdGVtLCBtZWdhUHJvcHMsIGxheW91dFByb3BzID0+IHtcbiAgICBjb25zdCBjb21wb25lbnRQcm9wcyA9IHBpY2tOb3RGb3JtSXRlbVByb3BzKG90aGVycylcbiAgICBsZXQgc2NoZW1hQ29tcG9uZW50ID0gc2NoZW1hQ2hpbGRyZW5cbiAgICAvLyDlkK/nlKjkuoZNZWdhTGF5b3V0XG4gICAgaWYgKGxheW91dFByb3BzKSB7XG4gICAgICBjb25zdCB7IGFkZG9uQmVmb3JlLCBhZGRvbkFmdGVyIH0gPSBtZWdhUHJvcHNcbiAgICAgIGNvbnN0IHsgY29sdW1ucywgc3BhbiwgZ3V0dGVyLCBncmlkLCBpbmxpbmUsIGxhYmVsV2lkdGgsIHdyYXBwZXJXaWR0aCwgbGFiZWxBbGlnbiwgbGFiZWxDb2wsIHdyYXBwZXJDb2wsIGZ1bGwsXG4gICAgICAgIHJlc3BvbnNpdmUsIHNpemUsIGluc2V0LCBoYXNCb3JkZXIsIGNvbnRleHQsIGVuYWJsZVNhZmVXaWR0aFxuICAgICAgfSA9IGxheW91dFByb3BzO1xuXG4gICAgICBjb25zdCBpc1NlY29uZGFyeSA9IGNvbnRleHQuaXNSb290XG4gICAgICBpdGVtUHJvcHMuaXNTZWNvbmRhcnkgPSBpc1NlY29uZGFyeVxuICAgICAgaXRlbVByb3BzLmhhc0JvcmRlciA9IGhhc0JvcmRlclxuICAgICAgaXRlbVByb3BzLmluc2V0ID0gaW5zZXRcbiAgICAgIGl0ZW1Qcm9wcy5sYWJlbEFsaWduID0gbGFiZWxBbGlnblxuICAgICAgaXRlbVByb3BzLmlubGluZSA9IGlubGluZVxuICAgICAgaXRlbVByb3BzLmdyaWQgPSBncmlkXG4gICAgICBpdGVtUHJvcHMuZ3V0dGVyID0gZ3V0dGVyXG4gICAgICBpdGVtUHJvcHMuc3BhbiA9IHNwYW5cbiAgICAgIGl0ZW1Qcm9wcy5jb2x1bW5zID0gY29sdW1uc1xuICAgICAgaXRlbVByb3BzLmZ1bGwgPSBmdWxsXG4gICAgICBpdGVtUHJvcHMuZW5hYmxlU2FmZVdpZHRoID0gZW5hYmxlU2FmZVdpZHRoXG4gICAgICBpdGVtUHJvcHMucmVzcG9uc2l2ZSA9IHJlc3BvbnNpdmVcblxuICAgICAgaWYgKGxhYmVsQ29sICE9PSAtMSkgaXRlbVByb3BzLmxhYmVsQ29sID0gbm9ybWFsaXplQ29sKGxhYmVsQ29sKVxuICAgICAgaWYgKHdyYXBwZXJDb2wgIT09IC0xKSBpdGVtUHJvcHMud3JhcHBlckNvbCA9IG5vcm1hbGl6ZUNvbCh3cmFwcGVyQ29sKVxuICAgICAgaWYgKGxhYmVsV2lkdGggIT09IC0xKSBpdGVtUHJvcHMubGFiZWxXaWR0aCA9IGxhYmVsV2lkdGhcbiAgICAgIGlmICh3cmFwcGVyV2lkdGggIT09IC0xKSBpdGVtUHJvcHMud3JhcHBlcldpZHRoID0gd3JhcHBlcldpZHRoXG4gICAgICBpZiAoYWRkb25CZWZvcmUpIGl0ZW1Qcm9wcy5hZGRvbkJlZm9yZSA9IGFkZG9uQmVmb3JlXG4gICAgICBpZiAoYWRkb25BZnRlcikgaXRlbVByb3BzLmFkZG9uQWZ0ZXIgPSBhZGRvbkFmdGVyXG5cbiAgICAgIC8vIOaSkea7oeWNs+S4uue7hOS7tuWuveW6puS4ujEwMCUsIGZsZXg6IDFcbiAgICAgIGlmIChmdWxsKSB7XG4gICAgICAgIGNvbXBvbmVudFByb3BzLnN0eWxlID0ge1xuICAgICAgICAgIC4uLihjb21wb25lbnRQcm9wcy5zdHlsZSB8fCB7fSksXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBmbGV4OiAnMSAxIDAlJyxcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2l6ZSkge1xuICAgICAgICBjb21wb25lbnRQcm9wcy5zaXplID0gc2l6ZSBcbiAgICAgIH1cblxuICAgICAgaWYgKGlzT2JqZWN0RmllbGQpIHtcbiAgICAgICAgY29uc3Qgb2JqZWN0RmllbGRQcm9wcyA9IHsuLi5tZWdhUHJvcHN9XG4gICAgICAgIG9iamVjdEZpZWxkUHJvcHMubGFiZWwgPSBpdGVtUHJvcHMubGFiZWxcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVnYUxheW91dCwgb2JqZWN0RmllbGRQcm9wcywgXG4gICAgICAgICAgKHNjaGVtYUNoaWxkcmVuID8gY2hpbGRyZW4oc2NoZW1hQ29tcG9uZW50KSA6IGNoaWxkcmVuKGNvbXBvbmVudFByb3BzKSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN0eWxlZExheW91dEl0ZW0sIGl0ZW1Qcm9wcywgXG4gICAgICAgIChzY2hlbWFDaGlsZHJlbiA/IGNoaWxkcmVuKHNjaGVtYUNvbXBvbmVudCkgOiBjaGlsZHJlbihjb21wb25lbnRQcm9wcykpKVxuICAgIH1cblxuICAgIC8vIOayoeacieWQr+eUqE1lZ2FMYXlvdXQsIOS/neaMgeWSjOe6v+S4iuWujOWFqOS4gOiHtOeahOWKn+iDveOAglxuICAgIHJldHVybiBjaGlsZHJlbigpXG4gIH0pXG59XG5cbmNvbnN0IEZvcm1NZWdhTGF5b3V0ID0gY3JlYXRlVmlydHVhbEJveDxPbWl0PElMYXlvdXRQcm9wcywgJ2NoaWxkcmVuJz4gJiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfT4oJ21lZ2EtbGF5b3V0JywgTWVnYUxheW91dClcblxuZXhwb3J0IHtcbiAgICBNZWdhTGF5b3V0LFxuICAgIE1lZ2FMYXlvdXRJdGVtLFxuICAgIEZvcm1NZWdhTGF5b3V0LFxufSIsImltcG9ydCBSZWFjdCwgeyBGcmFnbWVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgRm9ybSBhcyBBbnRkRm9ybSB9IGZyb20gJ2FudGQnXG5pbXBvcnQge1xuICBJbnRlcm5hbEZpZWxkLFxuICBjb25uZWN0LFxuICBJbnRlcm5hbFZpcnR1YWxGaWVsZFxufSBmcm9tICdAZm9ybWlseS9yZWFjdC1zY2hlbWEtcmVuZGVyZXInXG5pbXBvcnQgeyBNZWdhTGF5b3V0SXRlbSB9IGZyb20gJy4vRm9ybU1lZ2FMYXlvdXQvaW5kZXgnXG5pbXBvcnQge1xuICBub3JtYWxpemVDb2wsXG4gIHBpY2tGb3JtSXRlbVByb3BzLFxuICBwaWNrTm90Rm9ybUl0ZW1Qcm9wcyxcbiAgbG9nXG59IGZyb20gJy4uL3NoYXJlZCdcbmltcG9ydCB7IHVzZURlZXBGb3JtSXRlbSB9IGZyb20gJy4uL2NvbnRleHQnXG5pbXBvcnQgeyBJQW50ZEZvcm1JdGVtUHJvcHMgfSBmcm9tICcuLi90eXBlcydcbmNvbnN0IHsgSXRlbTogQW50ZEZvcm1JdGVtIH0gPSBBbnRkRm9ybVxuXG5jb25zdCBjb21wdXRlU3RhdHVzID0gKHByb3BzOiBhbnkpID0+IHtcbiAgaWYgKHByb3BzLmxvYWRpbmcpIHtcbiAgICByZXR1cm4gJ3ZhbGlkYXRpbmcnXG4gIH1cbiAgaWYgKHByb3BzLmludmFsaWQpIHtcbiAgICByZXR1cm4gJ2Vycm9yJ1xuICB9XG4gIGlmIChwcm9wcy53YXJuaW5ncyAmJiBwcm9wcy53YXJuaW5ncy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJ3dhcm5pbmcnXG4gIH1cbiAgaWYocHJvcHMuYWN0aXZlKXtcbiAgICByZXR1cm4gJ3N1Y2Nlc3MnXG4gIH1cbiAgcmV0dXJuICcnXG59XG5cbmNvbnN0IGNvbXB1dGVNZXNzYWdlID0gKGVycm9yczogYW55W10sIHdhcm5pbmdzOiBhbnlbXSkgPT4ge1xuICBjb25zdCBtZXNzYWdlcyA9IFtdLmNvbmNhdChlcnJvcnMgfHwgW10sIHdhcm5pbmdzIHx8IFtdKVxuICByZXR1cm4gbWVzc2FnZXMubGVuZ3RoXG4gICAgPyBtZXNzYWdlcy5tYXAoKG1lc3NhZ2UsIGluZGV4KSA9PlxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICB7IGtleTogaW5kZXggfSxcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgIG1lc3NhZ2VzLmxlbmd0aCAtIDEgPiBpbmRleCA/ICcgLCcgOiAnJ1xuICAgICAgICApXG4gICAgICApXG4gICAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgQ29ubmVjdGVkQ29tcG9uZW50ID0gU3ltYm9sKCdjb25uZWN0ZWQnKVxuXG5leHBvcnQgY29uc3QgRm9ybUl0ZW06IFJlYWN0LkZDPElBbnRkRm9ybUl0ZW1Qcm9wcz4gPSB0b3BQcm9wcyA9PiB7XG4gIGNvbnN0IHtcbiAgICBuYW1lLFxuICAgIGluaXRpYWxWYWx1ZSxcbiAgICB2YWx1ZSxcbiAgICB2aXNpYmxlLFxuICAgIGRpc3BsYXksXG4gICAgcmVxdWlyZWQsXG4gICAgZWRpdGFibGUsXG4gICAgdHJpZ2dlclR5cGUsXG4gICAgdW5tb3VudFJlbW92ZVZhbHVlLFxuICAgIHZhbHVlTmFtZSxcbiAgICBldmVudE5hbWUsXG4gICAgZ2V0VmFsdWVGcm9tRXZlbnQsXG4gICAgcnVsZXMsXG4gICAgY2hpbGRyZW4sXG4gICAgY29tcG9uZW50LFxuICAgIHByb3BzLFxuICAgIC4uLml0ZW1Qcm9wc1xuICB9ID0gdG9wUHJvcHMgfHwge31cbiAgY29uc3QgdG9wRm9ybUl0ZW1Qcm9wcyA9IHVzZURlZXBGb3JtSXRlbSgpXG5cbiAgY29uc3QgcmVuZGVyQ29tcG9uZW50ID0gKHsgcHJvcHMsIHN0YXRlLCBtdXRhdG9ycywgZm9ybSB9KSA9PiB7XG4gICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgIGlmIChjaGlsZHJlbikgcmV0dXJuIDxGcmFnbWVudD57Y2hpbGRyZW59PC9GcmFnbWVudD5cbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYENhbid0IGZvdW50IHRoZSBjb21wb25lbnQuIEl0cyBrZXkgaXMgJHtuYW1lfS5gXG4gICAgICApXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBpZiAoIWNvbXBvbmVudFsnX19BTFJFQURZX0NPTk5FQ1RFRF9fJ10pIHtcbiAgICAgIGNvbXBvbmVudFtDb25uZWN0ZWRDb21wb25lbnRdID1cbiAgICAgICAgY29tcG9uZW50W0Nvbm5lY3RlZENvbXBvbmVudF0gfHxcbiAgICAgICAgY29ubmVjdCh7XG4gICAgICAgICAgZXZlbnROYW1lLFxuICAgICAgICAgIHZhbHVlTmFtZSxcbiAgICAgICAgICBnZXRWYWx1ZUZyb21FdmVudFxuICAgICAgICB9KShjb21wb25lbnQpXG4gICAgfVxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgY29tcG9uZW50WydfX0FMUkVBRFlfQ09OTkVDVEVEX18nXVxuICAgICAgICA/IGNvbXBvbmVudFxuICAgICAgICA6IGNvbXBvbmVudFtDb25uZWN0ZWRDb21wb25lbnRdLFxuICAgICAge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICBbJ3gtY29tcG9uZW50LXByb3BzJ106IHByb3BzXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm0sXG4gICAgICAgIG11dGF0b3JzXG4gICAgICB9LFxuICAgICAgY2hpbGRyZW5cbiAgICApXG4gIH1cblxuICBjb25zdCByZW5kZXJGaWVsZCA9IChmaWVsZFByb3BzOiBhbnkpID0+IHtcbiAgICBjb25zdCB7IGZvcm0sIHN0YXRlLCBtdXRhdG9ycyB9ID0gZmllbGRQcm9wc1xuICAgIGNvbnN0IHsgcHJvcHMsIGVycm9ycywgd2FybmluZ3MsIGVkaXRhYmxlLCByZXF1aXJlZCB9ID0gc3RhdGVcbiAgICBjb25zdCB7IGxhYmVsQ29sLCB3cmFwcGVyQ29sLCBoZWxwIH0gPSBwcm9wc1xuICAgIGNvbnN0IGZvcm1JdGVtUHJvcHMgPSBwaWNrRm9ybUl0ZW1Qcm9wcyhwcm9wcylcbiAgICBjb25zdCB7IGlubGluZSwgLi4uY29tcG9uZW50UHJvcHMgfSA9IHBpY2tOb3RGb3JtSXRlbVByb3BzKHByb3BzKVxuXG4gICAgY29uc3QgeyBzaXplIH0gPSB0b3BGb3JtSXRlbVByb3BzXG4gICAgY29uc3QgaXRlbVByb3BzID0ge1xuICAgICAgLi4uZm9ybUl0ZW1Qcm9wcyxcbiAgICAgIHJlcXVpcmVkOiBlZGl0YWJsZSA9PT0gZmFsc2UgPyB1bmRlZmluZWQgOiByZXF1aXJlZCxcbiAgICAgIGxhYmVsQ29sOiBmb3JtSXRlbVByb3BzLmxhYmVsID8gbm9ybWFsaXplQ29sKGxhYmVsQ29sKSA6IHt9LFxuICAgICAgd3JhcHBlckNvbDogZm9ybUl0ZW1Qcm9wcy5sYWJlbCA/IG5vcm1hbGl6ZUNvbCh3cmFwcGVyQ29sKSA6IHt9LFxuICAgICAgdmFsaWRhdGVTdGF0dXM6IGNvbXB1dGVTdGF0dXMoc3RhdGUpLFxuICAgICAgaGVscDogY29tcHV0ZU1lc3NhZ2UoZXJyb3JzLCB3YXJuaW5ncykgfHwgaGVscCxcbiAgICB9XG5cbiAgICByZXR1cm4gPE1lZ2FMYXlvdXRJdGVtIGl0ZW1Qcm9wcz17eyAuLi5pdGVtUHJvcHMsIHNpemUgfX0gey4uLnByb3BzfT5cbiAgICAgIHsobWVnYUNvbXBvbmVudFByb3BzKSA9PiB7XG4gICAgICAgIGlmIChtZWdhQ29tcG9uZW50UHJvcHMpIHtcbiAgICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KHsgcHJvcHM6IG1lZ2FDb21wb25lbnRQcm9wcywgc3RhdGUsIG11dGF0b3JzLCBmb3JtIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxBbnRkRm9ybUl0ZW0gey4uLml0ZW1Qcm9wc30+XG4gICAgICAgICAgICB7cmVuZGVyQ29tcG9uZW50KHsgcHJvcHM6IGNvbXBvbmVudFByb3BzLCBzdGF0ZSwgbXV0YXRvcnMsIGZvcm0gfSl9XG4gICAgICAgICAgPC9BbnRkRm9ybUl0ZW0+XG4gICAgICAgIClcbiAgICAgIH19ICAgICAgXG4gICAgPC9NZWdhTGF5b3V0SXRlbT5cbiAgfVxuXG4gIGlmICghY29tcG9uZW50ICYmIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxJbnRlcm5hbFZpcnR1YWxGaWVsZFxuICAgICAgICBuYW1lPXtuYW1lfVxuICAgICAgICB2aXNpYmxlPXt2aXNpYmxlfVxuICAgICAgICBkaXNwbGF5PXtkaXNwbGF5fVxuICAgICAgICBwcm9wcz17eyAuLi50b3BGb3JtSXRlbVByb3BzLCAuLi5pdGVtUHJvcHMsIC4uLnByb3BzIH19XG4gICAgICA+XG4gICAgICAgIHtyZW5kZXJGaWVsZH1cbiAgICAgIDwvSW50ZXJuYWxWaXJ0dWFsRmllbGQ+XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8SW50ZXJuYWxGaWVsZFxuICAgICAgbmFtZT17bmFtZX1cbiAgICAgIGluaXRpYWxWYWx1ZT17aW5pdGlhbFZhbHVlfVxuICAgICAgdW5tb3VudFJlbW92ZVZhbHVlPXt1bm1vdW50UmVtb3ZlVmFsdWV9XG4gICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICB2aXNpYmxlPXt2aXNpYmxlfVxuICAgICAgZGlzcGxheT17ZGlzcGxheX1cbiAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cbiAgICAgIHJ1bGVzPXtydWxlc31cbiAgICAgIGVkaXRhYmxlPXtlZGl0YWJsZX1cbiAgICAgIHRyaWdnZXJUeXBlPXt0cmlnZ2VyVHlwZX1cbiAgICAgIHByb3BzPXt7IC4uLnRvcEZvcm1JdGVtUHJvcHMsIC4uLml0ZW1Qcm9wcywgLi4ucHJvcHMgfX1cbiAgICA+XG4gICAgICB7cmVuZGVyRmllbGR9XG4gICAgPC9JbnRlcm5hbEZpZWxkPlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgRm9ybSB9IGZyb20gJ2FudGQnXG5pbXBvcnQgeyBGb3JtUHJvcHMgfSBmcm9tICdhbnRkL2xpYi9mb3JtJ1xuaW1wb3J0IHsgSUZvcm1JdGVtVG9wUHJvcHMgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7IEZvcm1JdGVtRGVlcFByb3ZpZGVyIH0gZnJvbSAnLi4vY29udGV4dCdcbmltcG9ydCB7IG5vcm1hbGl6ZUNvbCwgaXNBbnRkVjQgfSBmcm9tICcuLi9zaGFyZWQnXG5pbXBvcnQge1xuICBQcmV2aWV3VGV4dCxcbiAgUHJldmlld1RleHRDb25maWdQcm9wc1xufSBmcm9tICdAZm9ybWlseS9yZWFjdC1zaGFyZWQtY29tcG9uZW50cydcblxuZXhwb3J0IGNvbnN0IEFudGRTY2hlbWFGb3JtQWRhcHRvcjogUmVhY3QuRkM8Rm9ybVByb3BzICZcbiAgSUZvcm1JdGVtVG9wUHJvcHMgJlxuICBQcmV2aWV3VGV4dENvbmZpZ1Byb3BzICYgeyBvblN1Ym1pdDogKCkgPT4gdm9pZCB9PiA9IHByb3BzID0+IHtcbiAgY29uc3QgeyBpbmxpbmUsIHByZXZpZXdQbGFjZWhvbGRlciwgb25TdWJtaXQsIG9uUmVzZXQsIC4uLnJlc3QgfSA9IHByb3BzXG4gIHJldHVybiAoXG4gICAgPEZvcm1JdGVtRGVlcFByb3ZpZGVyIHsuLi5wcm9wc30+XG4gICAgICA8UHJldmlld1RleHQuQ29uZmlnUHJvdmlkZXIgdmFsdWU9e3Byb3BzfT5cbiAgICAgICAgPEZvcm1cbiAgICAgICAgICB7Li4ucmVzdH1cbiAgICAgICAgICBsYWJlbENvbD17bm9ybWFsaXplQ29sKHByb3BzLmxhYmVsQ29sKX1cbiAgICAgICAgICB3cmFwcGVyQ29sPXtub3JtYWxpemVDb2wocHJvcHMud3JhcHBlckNvbCl9XG4gICAgICAgICAgbGF5b3V0PXtpbmxpbmUgPyAnaW5saW5lJyA6IHByb3BzLmxheW91dH1cbiAgICAgICAgICBvblN1Ym1pdD17b25TdWJtaXR9XG4gICAgICAgICAgb25SZXNldD17b25SZXNldH1cbiAgICAgICAgICBjb21wb25lbnQ9e3VzZU1lbW8oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzQW50ZFY0KSB7XG4gICAgICAgICAgICAgIHJldHVybiBpbm5lclByb3BzID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZm9ybScsIHtcbiAgICAgICAgICAgICAgICAgIC4uLmlubmVyUHJvcHMsXG4gICAgICAgICAgICAgICAgICBvblN1Ym1pdCxcbiAgICAgICAgICAgICAgICAgIG9uUmVzZXRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgW10pfVxuICAgICAgICAvPlxuICAgICAgPC9QcmV2aWV3VGV4dC5Db25maWdQcm92aWRlcj5cbiAgICA8L0Zvcm1JdGVtRGVlcFByb3ZpZGVyPlxuICApXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlRWxlbWVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgRm9ybSB9IGZyb20gJ2FudGQnXG5pbXBvcnQge1xuICB1c2VEZWVwRm9ybUl0ZW0sXG4gIEZvcm1JdGVtU2hhbGxvd1Byb3ZpZGVyLFxuICB1c2VTaGFsbG93Rm9ybUl0ZW1cbn0gZnJvbSAnLi4vY29udGV4dCdcbmltcG9ydCB7IElTY2hlbWFGaWVsZEFkYXB0b3JQcm9wcyB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgbm9ybWFsaXplQ29sLCBwaWNrRm9ybUl0ZW1Qcm9wcyB9IGZyb20gJy4uL3NoYXJlZCdcbmltcG9ydCB7IE1lZ2FMYXlvdXRJdGVtIH0gZnJvbSAnLi4vY29tcG9uZW50cy9Gb3JtTWVnYUxheW91dC9pbmRleCdcblxuY29uc3QgY29tcHV0ZVN0YXR1cyA9IChwcm9wczogSVNjaGVtYUZpZWxkQWRhcHRvclByb3BzKSA9PiB7XG4gIGlmIChwcm9wcy5sb2FkaW5nKSB7XG4gICAgcmV0dXJuICd2YWxpZGF0aW5nJ1xuICB9XG4gIGlmIChwcm9wcy5pbnZhbGlkKSB7XG4gICAgcmV0dXJuICdlcnJvcidcbiAgfVxuICBpZiAocHJvcHMud2FybmluZ3MgJiYgcHJvcHMud2FybmluZ3MubGVuZ3RoKSB7XG4gICAgcmV0dXJuICd3YXJuaW5nJ1xuICB9XG4gIHJldHVybiAnJ1xufVxuXG5jb25zdCBjb21wdXRlSGVscCA9IChwcm9wczogSVNjaGVtYUZpZWxkQWRhcHRvclByb3BzKSA9PiB7XG4gIGlmIChwcm9wcy5oZWxwKSByZXR1cm4gcHJvcHMuaGVscFxuICBjb25zdCBtZXNzYWdlcyA9IFtdLmNvbmNhdChwcm9wcy5lcnJvcnMgfHwgW10sIHByb3BzLndhcm5pbmdzIHx8IFtdKVxuICByZXR1cm4gbWVzc2FnZXMubGVuZ3RoXG4gICAgPyBtZXNzYWdlcy5tYXAoKG1lc3NhZ2UsIGluZGV4KSA9PlxuICAgICAgICBjcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICB7IGtleTogaW5kZXggfSxcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgIG1lc3NhZ2VzLmxlbmd0aCAtIDEgPiBpbmRleCA/ICcgLCcgOiAnJ1xuICAgICAgICApXG4gICAgICApXG4gICAgOiBwcm9wcy5zY2hlbWEgJiYgcHJvcHMuc2NoZW1hLmRlc2NyaXB0aW9uXG59XG5cbmNvbnN0IGNvbXB1dGVMYWJlbCA9IChwcm9wczogSVNjaGVtYUZpZWxkQWRhcHRvclByb3BzKSA9PiB7XG4gIGlmIChwcm9wcy5sYWJlbCkgcmV0dXJuIHByb3BzLmxhYmVsXG4gIGlmIChwcm9wcy5zY2hlbWEgJiYgcHJvcHMuc2NoZW1hLnRpdGxlKSB7XG4gICAgcmV0dXJuIHByb3BzLnNjaGVtYS50aXRsZVxuICB9XG59XG5cbmNvbnN0IGNvbXB1dGVFeHRyYSA9IChwcm9wczogSVNjaGVtYUZpZWxkQWRhcHRvclByb3BzKSA9PiB7XG4gIGlmIChwcm9wcy5leHRyYSkgcmV0dXJuIHByb3BzLmV4dHJhXG59XG5cbmNvbnN0IGNvbXB1dGVTY2hlbWFFeHRlbmRQcm9wcyA9IChwcm9wczogSVNjaGVtYUZpZWxkQWRhcHRvclByb3BzKSA9PiB7XG4gIGlmIChwcm9wcy5zY2hlbWEpIHtcbiAgICByZXR1cm4gcGlja0Zvcm1JdGVtUHJvcHMoe1xuICAgICAgLi4ucHJvcHMuc2NoZW1hLmdldEV4dGVuZHNJdGVtUHJvcHMoKSxcbiAgICAgIC4uLnByb3BzLnNjaGVtYS5nZXRFeHRlbmRzUHJvcHMoKVxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IEFudGRTY2hlbWFGaWVsZEFkYXB0b3I6IFJlYWN0LkZDPElTY2hlbWFGaWVsZEFkYXB0b3JQcm9wcz4gPSBwcm9wcyA9PiB7XG4gIGNvbnN0IHtcbiAgICBwcmVmaXhDbHMsXG4gICAgbGFiZWxBbGlnbixcbiAgICBsYWJlbENvbDogY29udGV4dExhYmVsQ29sLFxuICAgIHdyYXBwZXJDb2w6IGNvbnRleHRXcmFwcGVyQ29sLFxuICAgIHNpemUsXG4gIH0gPSB1c2VEZWVwRm9ybUl0ZW0oKVxuICBjb25zdCBoZWxwID0gY29tcHV0ZUhlbHAocHJvcHMpXG4gIGNvbnN0IGxhYmVsID0gY29tcHV0ZUxhYmVsKHByb3BzKVxuICBjb25zdCBzdGF0dXMgPSBjb21wdXRlU3RhdHVzKHByb3BzKVxuICBjb25zdCBleHRyYSA9IGNvbXB1dGVFeHRyYShwcm9wcylcbiAgY29uc3QgZm9ybUl0ZW1Qcm9wcyA9IHBpY2tGb3JtSXRlbVByb3BzKHByb3BzKVxuICBjb25zdCBzY2hlbWFJdGVtUHJvcHMgPSBjb21wdXRlU2NoZW1hRXh0ZW5kUHJvcHMocHJvcHMpXG4gIGNvbnN0IGZvcm1JdGVtU2hhbGxvd1Byb3BzID0gdXNlU2hhbGxvd0Zvcm1JdGVtKClcblxuICBjb25zdCBtZXJnZWRQcm9wcyA9IHtcbiAgICBsYWJlbCxcbiAgICAuLi5mb3JtSXRlbVNoYWxsb3dQcm9wcyxcbiAgICAuLi5mb3JtSXRlbVByb3BzLFxuICAgIC4uLnNjaGVtYUl0ZW1Qcm9wc1xuICB9XG5cbiAgY29uc3QgeyBsYWJlbENvbCwgd3JhcHBlckNvbCB9ID0gbWVyZ2VkUHJvcHNcblxuICBjb25zdCBhZGRvbkFmdGVyID0gbWVyZ2VkUHJvcHMuYWRkb25BZnRlclxuXG4gIGRlbGV0ZSBtZXJnZWRQcm9wcy5hZGRvbkFmdGVyXG5cbiAgY29uc3QgaXRlbVByb3BzID0ge1xuICAgIHByZWZpeENscyxcbiAgICBsYWJlbEFsaWduLFxuICAgIGhlbHAsXG4gICAgdmFsaWRhdGVTdGF0dXM6IHN0YXR1cyxcbiAgICBleHRyYTogZXh0cmEgPyA8cD57ZXh0cmF9PC9wPiA6IHVuZGVmaW5lZCxcbiAgICAuLi5tZXJnZWRQcm9wcyxcbiAgICByZXF1aXJlZDogcHJvcHMuZWRpdGFibGUgPT09IGZhbHNlID8gdW5kZWZpbmVkIDogcHJvcHMucmVxdWlyZWQsXG4gICAgbGFiZWxDb2w6IGxhYmVsID8gbm9ybWFsaXplQ29sKGxhYmVsQ29sIHx8IGNvbnRleHRMYWJlbENvbCkgOiB7fSxcbiAgICB3cmFwcGVyQ29sOiBsYWJlbCA/IG5vcm1hbGl6ZUNvbCh3cmFwcGVyQ29sIHx8IGNvbnRleHRXcmFwcGVyQ29sKSA6IHt9XG4gIH1cblxuICBjb25zdCByZW5kZXJDb21wb25lbnQgPSAoY2hpbGRyZW4sIG9wdHM/KSA9PiB7XG4gICAgY29uc3QgeyBhZGRvbkFmdGVyIH0gPSBvcHRzIHx8IHt9XG4gICAgcmV0dXJuIGFkZG9uQWZ0ZXIgPyAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicgfX0+XG4gICAgICAgIDxGb3JtSXRlbVNoYWxsb3dQcm92aWRlcj57Y2hpbGRyZW59PC9Gb3JtSXRlbVNoYWxsb3dQcm92aWRlcj5cbiAgICAgICAge2FkZG9uQWZ0ZXJ9XG4gICAgICA8L2Rpdj5cbiAgICApIDogKFxuICAgICAgPEZvcm1JdGVtU2hhbGxvd1Byb3ZpZGVyPntjaGlsZHJlbn08L0Zvcm1JdGVtU2hhbGxvd1Byb3ZpZGVyPlxuICAgIClcbiAgfVxuXG4gIHJldHVybiA8TWVnYUxheW91dEl0ZW0gaXRlbVByb3BzPXt7Li4uaXRlbVByb3BzLCBzaXplLCB9fSB7Li4ucHJvcHMucHJvcHN9IHNjaGVtYUNoaWxkcmVuPXtwcm9wcy5jaGlsZHJlbn0+XG4gICAgeyhtZWdhQ29tcG9uZW50KSA9PiB7XG4gICAgICBpZiAobWVnYUNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gcmVuZGVyQ29tcG9uZW50KG1lZ2FDb21wb25lbnQsIHsgYWRkb25BZnRlciB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gPEZvcm0uSXRlbSB7Li4uaXRlbVByb3BzfT5cbiAgICAgICAge3JlbmRlckNvbXBvbmVudChwcm9wcy5jaGlsZHJlbiwgeyBhZGRvbkFmdGVyIH0pfVxuICAgICAgPC9Gb3JtLkl0ZW0+XG4gICAgfX0gICAgICBcbiAgPC9NZWdhTGF5b3V0SXRlbT5cbn1cbiIsImltcG9ydCB7XG4gIHJlZ2lzdGVyRm9ybUNvbXBvbmVudCxcbiAgcmVnaXN0ZXJGb3JtSXRlbUNvbXBvbmVudFxufSBmcm9tICdAZm9ybWlseS9yZWFjdC1zY2hlbWEtcmVuZGVyZXInXG5pbXBvcnQgeyBBbnRkU2NoZW1hRm9ybUFkYXB0b3IgfSBmcm9tICcuL0Zvcm0nXG5pbXBvcnQgeyBBbnRkU2NoZW1hRmllbGRBZGFwdG9yIH0gZnJvbSAnLi9Gb3JtSXRlbSdcblxucmVnaXN0ZXJGb3JtQ29tcG9uZW50KEFudGRTY2hlbWFGb3JtQWRhcHRvcilcblxucmVnaXN0ZXJGb3JtSXRlbUNvbXBvbmVudChBbnRkU2NoZW1hRmllbGRBZGFwdG9yKVxuXG5leHBvcnQgeyBBbnRkU2NoZW1hRm9ybUFkYXB0b3IsIEFudGRTY2hlbWFGaWVsZEFkYXB0b3IgfVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZVJlZiB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgdXNlRm9ybVF1ZXJ5LFxuICBJRWZmZWN0TWlkZGxld2FyZSxcbiAgSVNjaGVtYUZvcm1BY3Rpb25zXG59IGZyb20gJ0Bmb3JtaWx5L3JlYWN0LXNjaGVtYS1yZW5kZXJlcidcbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnQGZvcm1pbHkvc2hhcmVkJ1xuXG5pbnRlcmZhY2UgSVF1ZXJ5UGFyYW1zIHtcbiAgcGFnaW5hdGlvbjoge1xuICAgIHRvdGFsOiBudW1iZXJcbiAgICBwYWdlU2l6ZTogbnVtYmVyXG4gICAgY3VycmVudDogbnVtYmVyXG4gIH1cbiAgc29ydGVyPzoge1xuICAgIG9yZGVyOiBzdHJpbmdcbiAgICBmaWVsZDogc3RyaW5nXG4gICAgY29sdW1uS2V5OiBzdHJpbmdcbiAgICBjb2x1bW46IGFueVxuICB9XG4gIGZpbHRlcnM/OiB7XG4gICAgW2RhdGFJbmRleDogc3RyaW5nXTogYW55XG4gIH1cbiAgdmFsdWVzOiBhbnlcbn1cblxuaW50ZXJmYWNlIElRdWVyeVJlc3BvbnNlIHtcbiAgZGF0YVNvdXJjZTogYW55W11cbiAgdG90YWw6IG51bWJlclxuICBwYWdlU2l6ZTogbnVtYmVyXG4gIGN1cnJlbnQ6IG51bWJlclxufVxuXG5pbnRlcmZhY2UgSVF1ZXJ5Q29udGV4dCB7XG4gIHBhZ2luYXRpb24/OiBJUXVlcnlQYXJhbXNbJ3BhZ2luYXRpb24nXVxuICBzb3J0ZXI/OiBJUXVlcnlQYXJhbXNbJ3NvcnRlciddXG4gIGZpbHRlcnM/OiBJUXVlcnlQYXJhbXNbJ2ZpbHRlcnMnXVxuICB0cmlnZ2VyPzogKHR5cGU6IHN0cmluZykgPT4gdm9pZFxuICBzZXRQYWdpbmF0aW9uPzogKHBhZ2luYXRpb246IElRdWVyeVBhcmFtc1sncGFnaW5hdGlvbiddKSA9PiB2b2lkXG4gIHNldEZpbHRlcnM/OiAoZmlsdGVyczogSVF1ZXJ5UGFyYW1zWydmaWx0ZXJzJ10pID0+IHZvaWRcbiAgc2V0U29ydGVyPzogKHNvcnRlcjogSVF1ZXJ5UGFyYW1zWydzb3J0ZXInXSkgPT4gdm9pZFxufVxuXG5pbnRlcmZhY2UgSVF1ZXJ5UHJvcHMge1xuICBwYWdpbmF0aW9uPzogSVF1ZXJ5UGFyYW1zWydwYWdpbmF0aW9uJ11cbiAgc29ydGVyPzogSVF1ZXJ5UGFyYW1zWydzb3J0ZXInXVxuICBmaWx0ZXJzPzogSVF1ZXJ5UGFyYW1zWydmaWx0ZXJzJ11cbn1cblxuZXhwb3J0IGNvbnN0IHVzZUZvcm1UYWJsZVF1ZXJ5ID0gKFxuICBzZXJ2aWNlOiAocGF5bG9hZDogSVF1ZXJ5UGFyYW1zKSA9PiBJUXVlcnlSZXNwb25zZSB8IFByb21pc2U8SVF1ZXJ5UmVzcG9uc2U+LFxuICBtaWRkbGV3YXJlcz86IElFZmZlY3RNaWRkbGV3YXJlPElTY2hlbWFGb3JtQWN0aW9ucz5bXSxcbiAgZGVmYXVsdFByb3BzOiBJUXVlcnlQcm9wcyA9IHt9XG4pID0+IHtcbiAgY29uc3QgcmVmID0gdXNlUmVmPElRdWVyeUNvbnRleHQ+KHt9KVxuICBjb25zdCBbcGFnaW5hdGlvbiwgc2V0UGFnaW5hdGlvbl0gPSB1c2VTdGF0ZTxJUXVlcnlQYXJhbXNbJ3BhZ2luYXRpb24nXT4oXG4gICAgZGVmYXVsdHMoXG4gICAgICB7XG4gICAgICAgIGN1cnJlbnQ6IDEsXG4gICAgICAgIHRvdGFsOiAwLFxuICAgICAgICBwYWdlU2l6ZTogMjBcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0UHJvcHMucGFnaW5hdGlvblxuICAgIClcbiAgKVxuICBjb25zdCBbc29ydGVyLCBzZXRTb3J0ZXJdID0gdXNlU3RhdGU8SVF1ZXJ5UGFyYW1zWydzb3J0ZXInXT4oXG4gICAgZGVmYXVsdFByb3BzLnNvcnRlclxuICApXG4gIGNvbnN0IFtmaWx0ZXJzLCBzZXRGaWx0ZXJzXSA9IHVzZVN0YXRlPElRdWVyeVBhcmFtc1snZmlsdGVycyddPihcbiAgICBkZWZhdWx0UHJvcHMuZmlsdGVyc1xuICApXG4gIGNvbnN0IHsgZWZmZWN0cywgdHJpZ2dlciwgb25TdWJtaXQsIGxvYWRpbmcsIHJlc3BvbnNlIH0gPSB1c2VGb3JtUXVlcnk8XG4gICAgSVF1ZXJ5UGFyYW1zLFxuICAgIElRdWVyeVJlc3BvbnNlLFxuICAgIElRdWVyeUNvbnRleHRcbiAgPihcbiAgICBhc3luYyB2YWx1ZXMgPT4ge1xuICAgICAgcmV0dXJuIHNlcnZpY2Uoe1xuICAgICAgICB2YWx1ZXMsXG4gICAgICAgIHBhZ2luYXRpb246IHJlZi5jdXJyZW50LnBhZ2luYXRpb24sXG4gICAgICAgIHNvcnRlcjogcmVmLmN1cnJlbnQuc29ydGVyLFxuICAgICAgICBmaWx0ZXJzOiByZWYuY3VycmVudC5maWx0ZXJzXG4gICAgICB9KVxuICAgIH0sXG4gICAgbWlkZGxld2FyZXMsXG4gICAgcmVmLmN1cnJlbnRcbiAgKVxuICByZWYuY3VycmVudC50cmlnZ2VyID0gdHJpZ2dlclxuICByZWYuY3VycmVudC5wYWdpbmF0aW9uID0gcGFnaW5hdGlvblxuICByZWYuY3VycmVudC5zb3J0ZXIgPSBzb3J0ZXJcbiAgcmVmLmN1cnJlbnQuZmlsdGVycyA9IGZpbHRlcnNcbiAgcmVmLmN1cnJlbnQuc2V0UGFnaW5hdGlvbiA9IHNldFBhZ2luYXRpb25cbiAgcmVmLmN1cnJlbnQuc2V0U29ydGVyID0gc2V0U29ydGVyXG4gIHJlZi5jdXJyZW50LnNldEZpbHRlcnMgPSBzZXRGaWx0ZXJzXG4gIHJldHVybiB7XG4gICAgc2V0UGFnaW5hdGlvbixcbiAgICBzZXRTb3J0ZXIsXG4gICAgc2V0RmlsdGVycyxcbiAgICB0cmlnZ2VyLFxuICAgIGZvcm06IHtcbiAgICAgIGVmZmVjdHMsXG4gICAgICBvblN1Ym1pdFxuICAgIH0sXG4gICAgdGFibGU6IHtcbiAgICAgIGxvYWRpbmcsXG4gICAgICBkYXRhU291cmNlOiByZXNwb25zZS5kYXRhU291cmNlIHx8IFtdLFxuICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAuLi5wYWdpbmF0aW9uLFxuICAgICAgICBjdXJyZW50OiByZXNwb25zZS5jdXJyZW50IHx8IDEsXG4gICAgICAgIHBhZ2VTaXplOiByZXNwb25zZS5wYWdlU2l6ZSB8fCAyMCxcbiAgICAgICAgdG90YWw6IHJlc3BvbnNlLnRvdGFsIHx8IDBcbiAgICAgIH0sXG4gICAgICBvbkNoYW5nZTogKHBhZ2luYXRpb246IGFueSwgZmlsdGVyczogYW55LCBzb3J0ZXI6IGFueSkgPT4ge1xuICAgICAgICBsZXQgdHlwZSA9ICcnXG4gICAgICAgIGlmIChwYWdpbmF0aW9uKSB7XG4gICAgICAgICAgc2V0UGFnaW5hdGlvbihwYWdpbmF0aW9uKVxuICAgICAgICAgIHR5cGUgPSAnb25QYWdlUXVlcnknXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlcnMpIHtcbiAgICAgICAgICBzZXRGaWx0ZXJzKGZpbHRlcnMpXG4gICAgICAgICAgdHlwZSA9ICdvbkZpbHRlclF1ZXJ5J1xuICAgICAgICB9XG4gICAgICAgIGlmIChzb3J0ZXIpIHtcbiAgICAgICAgICBzZXRTb3J0ZXIoc29ydGVyKVxuICAgICAgICAgIHR5cGUgPSAnb25Tb3J0ZXJRdWVyeSdcbiAgICAgICAgfVxuICAgICAgICB0cmlnZ2VyKHR5cGUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOlsiX19kZWZQcm9wIiwiX19kZWZQcm9wcyIsIl9fZ2V0T3duUHJvcERlc2NzIiwiX19nZXRPd25Qcm9wU3ltYm9scyIsIl9faGFzT3duUHJvcCIsIl9fcHJvcElzRW51bSIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fc3ByZWFkVmFsdWVzIiwiX19zcHJlYWRQcm9wcyIsIlJlYWN0IiwiX19vYmpSZXN0IiwicmVxdWlyZSQkMCIsInJlcXVpcmUkJDEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJfZXh0ZW5kcyIsIl9kZWZhdWx0IiwicmVhY3RJc01vZHVsZSIsImdldE93blByb3BlcnR5U3ltYm9scyIsIlJlYWN0UHJvcFR5cGVzU2VjcmV0IiwicHJvcFR5cGVzTW9kdWxlIiwibWVtb2l6ZSIsIl9pbnRlcm9wRGVmYXVsdCIsImlzUGxhaW5PYmplY3QiLCJpc0Z1bmN0aW9uIiwiaW5kZXhfY2pzIiwibWVyZ2UiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNiIsInJlcXVpcmUkJDciLCJyZXF1aXJlJCQ4Iiwic3R5bGVkIiwiY2xzIiwiU3RpY2t5IiwiaXNGbiIsIkFudGRGb3JtIiwiY3NzIiwiRm9ybSIsImNvbXB1dGVTdGF0dXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFBQSxJQUFJQSxXQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztNQUN0QyxJQUFJQyxZQUFVLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO01BQ3pDLElBQUlDLG1CQUFpQixHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQztNQUN6RCxJQUFJQyxxQkFBbUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7TUFDdkQsSUFBSUMsY0FBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO01BQ25ELElBQUlDLGNBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO01BQ3pELElBQUlDLGlCQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssS0FBSyxHQUFHLElBQUksR0FBRyxHQUFHTixXQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztNQUNoSyxJQUFJTyxnQkFBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSztNQUMvQixFQUFFLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDaEMsSUFBSSxJQUFJSCxjQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDbEMsTUFBTUUsaUJBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQ3hDLEVBQUUsSUFBSUgscUJBQW1CO01BQ3pCLElBQUksS0FBSyxJQUFJLElBQUksSUFBSUEscUJBQW1CLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDN0MsTUFBTSxJQUFJRSxjQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDcEMsUUFBUUMsaUJBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQzFDLEtBQUs7TUFDTCxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ1gsQ0FBQyxDQUFDO01BQ0YsSUFBSUUsZUFBYSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBS1AsWUFBVSxDQUFDLENBQUMsRUFBRUMsbUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQXFCM0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUN0QyxNQUFNLGNBQWMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEtBQUs7TUFDbkQsRUFBRSxPQUFPTyxPQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHQSxPQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRUQsZUFBYSxDQUFDRCxnQkFBYyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtNQUNoSCxJQUFJLFFBQVEsRUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUN4RCxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSyxjQUFjLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztNQUNsRyxDQUFDLENBQUM7TUFDSyxNQUFNLDBCQUEwQixHQUFHLENBQUMsT0FBTyxLQUFLO01BQ3ZELEVBQUUsSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO01BQ3ZCLElBQUksVUFBVSxDQUFDLE1BQU07TUFDckIsTUFBTSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsR0FBRywwQkFBMEIsR0FBRyxrQ0FBa0MsQ0FBQyxDQUFDO01BQ3BJLE1BQU0sSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtNQUN2QyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYztNQUN2QyxVQUFVLE9BQU87TUFDakIsUUFBUSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO01BQ25DLFVBQVUsUUFBUSxFQUFFLFFBQVE7TUFDNUIsVUFBVSxNQUFNLEVBQUUsUUFBUTtNQUMxQixVQUFVLEtBQUssRUFBRSxRQUFRO01BQ3pCLFNBQVMsQ0FBQyxDQUFDO01BQ1gsT0FBTztNQUNQLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztNQUNYLEdBQUc7TUFDSCxDQUFDLENBQUM7QUFDVSxZQUFDLGdCQUFnQiwrQkFBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxHQUFHLEVBQUUsS0FBSztNQUNwRSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxVQUFVLENBQUM7TUFDbEMsRUFBRSxJQUFJLFFBQVEsS0FBSyxLQUFLLENBQUMsRUFBRTtNQUMzQixJQUFJLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtNQUM1QixNQUFNLE9BQU8sV0FBVyxFQUFFLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQztNQUN0RCxLQUFLO01BQ0wsR0FBRztNQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7TUFDaEIsR0FBRTtBQVNVLFlBQUMsWUFBWSwyQkFBRyxDQUFDLEdBQUcsRUFBRSxZQUFZLEtBQUs7TUFDbkQsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO01BQ1osSUFBSSxPQUFPLFlBQVksQ0FBQztNQUN4QixHQUFHLE1BQU07TUFDVCxJQUFJLE9BQU8sT0FBTyxHQUFHLEtBQUssUUFBUSxHQUFHLEdBQUcsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztNQUNqRSxHQUFHO01BQ0gsR0FBRTtBQUNVLFlBQUMsU0FBUyx3QkFBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEtBQUs7TUFDOUMsRUFBRSxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7TUFDdEIsRUFBRSxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7TUFDdkIsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSztNQUMvQixJQUFJLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUMvQixNQUFNLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDNUIsS0FBSyxNQUFNO01BQ1gsTUFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO01BQzdCLEtBQUs7TUFDTCxHQUFHLENBQUMsQ0FBQztNQUNMLEVBQUUsT0FBTztNQUNULElBQUksUUFBUTtNQUNaLElBQUksU0FBUztNQUNiLEdBQUcsQ0FBQztNQUNKLEdBQUU7TUFDRixNQUFNLGlCQUFpQixHQUFHO01BQzFCLEVBQUUsT0FBTztNQUNULEVBQUUsU0FBUztNQUNYLEVBQUUsZ0JBQWdCO01BQ2xCLEVBQUUsV0FBVztNQUNiLEVBQUUsVUFBVTtNQUNaLEVBQUUsWUFBWTtNQUNkLEVBQUUsYUFBYTtNQUNmLEVBQUUsVUFBVTtNQUNaLEVBQUUsWUFBWTtNQUNkLEVBQUUsT0FBTztNQUNULEVBQUUsTUFBTTtNQUNSLEVBQUUsT0FBTztNQUNULEVBQUUsV0FBVztNQUNiLEVBQUUsZUFBZTtNQUNqQixFQUFFLFlBQVk7TUFDZCxFQUFFLFNBQVM7TUFDWCxDQUFDLENBQUM7QUFDVSxZQUFDLGlCQUFpQixnQ0FBRyxDQUFDLEtBQUssS0FBSztNQUM1QyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7TUFDM0QsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO01BQ25DLElBQUksUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO01BQ2pDLEdBQUc7TUFDSCxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7TUFDeEMsSUFBSSxRQUFRLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7TUFDdEMsR0FBRztNQUNILEVBQUUsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO01BQzFCLElBQUksUUFBUSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO01BQ3hDLElBQUksT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDO01BQzlCLEdBQUc7TUFDSCxFQUFFLElBQUksUUFBUSxDQUFDLGFBQWEsRUFBRTtNQUM5QixJQUFJLFFBQVEsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztNQUNoRCxJQUFJLE9BQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQztNQUNsQyxHQUFHO01BQ0gsRUFBRSxPQUFPLFFBQVEsQ0FBQztNQUNsQixHQUFFO0FBQ1UsWUFBQyxvQkFBb0IsbUNBQUcsQ0FBQyxLQUFLLEtBQUs7TUFDL0MsRUFBRSxPQUFPLFNBQVMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxTQUFTLENBQUM7TUFDdkQsR0FBRTtBQUNVLFlBQUMsY0FBYyw2QkFBRyxDQUFDLEtBQUssRUFBRSxVQUFVLEtBQUs7TUFDckQsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQztNQUN6QyxFQUFFLElBQUksT0FBTyxFQUFFO01BQ2YsSUFBSSxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDO01BQzNDLEdBQUcsTUFBTSxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO01BQ3RDLElBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7TUFDMUIsR0FBRztNQUNIOztNQ2xKQSxJQUFJUCxXQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztNQUN0QyxJQUFJQyxZQUFVLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO01BQ3pDLElBQUlDLG1CQUFpQixHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQztNQUN6RCxJQUFJQyxxQkFBbUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7TUFDdkQsSUFBSUMsY0FBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO01BQ25ELElBQUlDLGNBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO01BQ3pELElBQUlDLGlCQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssS0FBSyxHQUFHLElBQUksR0FBRyxHQUFHTixXQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztNQUNoSyxJQUFJTyxnQkFBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSztNQUMvQixFQUFFLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDaEMsSUFBSSxJQUFJSCxjQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDbEMsTUFBTUUsaUJBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQ3hDLEVBQUUsSUFBSUgscUJBQW1CO01BQ3pCLElBQUksS0FBSyxJQUFJLElBQUksSUFBSUEscUJBQW1CLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDN0MsTUFBTSxJQUFJRSxjQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDcEMsUUFBUUMsaUJBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQzFDLEtBQUs7TUFDTCxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ1gsQ0FBQyxDQUFDO01BQ0YsSUFBSUUsZUFBYSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBS1AsWUFBVSxDQUFDLENBQUMsRUFBRUMsbUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNsRSxJQUFJUSxXQUFTLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxLQUFLO01BQ3JDLEVBQUUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO01BQ2xCLEVBQUUsS0FBSyxJQUFJLElBQUksSUFBSSxNQUFNO01BQ3pCLElBQUksSUFBSU4sY0FBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO01BQ3BFLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNsQyxFQUFFLElBQUksTUFBTSxJQUFJLElBQUksSUFBSUQscUJBQW1CO01BQzNDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSUEscUJBQW1CLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDbEQsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJRSxjQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7TUFDdEUsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ3BDLEtBQUs7TUFDTCxFQUFFLE9BQU8sTUFBTSxDQUFDO01BQ2hCLENBQUMsQ0FBQztBQUlVLFlBQUMsTUFBTSxxQkFBRyxDQUFDLEVBQUUsS0FBSztNQUM5QixFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsS0FBSyxHQUFHSyxXQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7TUFDbEcsRUFBRSx1QkFBdUJELE9BQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFO01BQ3RELElBQUksUUFBUSxFQUFFO01BQ2QsTUFBTSxjQUFjLENBQUMsYUFBYTtNQUNsQyxNQUFNLGNBQWMsQ0FBQyxvQkFBb0I7TUFDekMsTUFBTSxjQUFjLENBQUMsa0JBQWtCO01BQ3ZDLEtBQUs7TUFDTCxJQUFJLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEtBQUs7TUFDaEMsTUFBTSxRQUFRLE1BQU0sQ0FBQyxJQUFJO01BQ3pCLFFBQVEsS0FBSyxjQUFjLENBQUMsb0JBQW9CO01BQ2hELFVBQVUsT0FBT0QsZUFBYSxDQUFDRCxnQkFBYyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtNQUMxRCxZQUFZLFVBQVUsRUFBRSxJQUFJO01BQzVCLFdBQVcsQ0FBQyxDQUFDO01BQ2IsUUFBUSxLQUFLLGNBQWMsQ0FBQyxrQkFBa0I7TUFDOUMsVUFBVSxPQUFPQyxlQUFhLENBQUNELGdCQUFjLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO01BQzFELFlBQVksVUFBVSxFQUFFLEtBQUs7TUFDN0IsV0FBVyxDQUFDLENBQUM7TUFDYixRQUFRO01BQ1IsVUFBVSxPQUFPLEtBQUssQ0FBQztNQUN2QixPQUFPO01BQ1AsS0FBSztNQUNMLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLO01BQzFCLElBQUksdUJBQXVCRSxPQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRUQsZUFBYSxDQUFDRCxnQkFBYyxDQUFDO01BQ3BGLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQyxLQUFLO01BQ3RCLFFBQVEsSUFBSSxRQUFRLEVBQUU7TUFDdEIsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO01BQ2hDLFNBQVM7TUFDVCxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtNQUMzQixVQUFVLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDM0IsU0FBUztNQUNULE9BQU87TUFDUCxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUU7TUFDZixNQUFNLFFBQVEsRUFBRSxRQUFRLEdBQUcsUUFBUSxHQUFHLFFBQVE7TUFDOUMsTUFBTSxPQUFPLEVBQUUsV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO01BQ3RELEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxRQUFRLElBQUksY0FBYyxDQUFDLENBQUM7TUFDMUMsR0FBRyxDQUFDLENBQUM7TUFDTCxHQUFFO01BQ0YsTUFBTSxDQUFDLFlBQVksR0FBRztNQUN0QixFQUFFLFdBQVcsRUFBRSxJQUFJO01BQ25CLEVBQUUsSUFBSSxFQUFFLFNBQVM7TUFDakIsRUFBRSxRQUFRLEVBQUUsUUFBUTtNQUNwQixDQUFDLENBQUM7QUFDVSxZQUFDLEtBQUssb0JBQUcsQ0FBQyxFQUFFLEtBQUs7TUFDN0IsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7TUFDZixJQUFJLFFBQVE7TUFDWixJQUFJLFVBQVU7TUFDZCxJQUFJLFFBQVE7TUFDWixHQUFHLEdBQUcsRUFBRSxFQUFFLEtBQUssR0FBR0csV0FBUyxDQUFDLEVBQUUsRUFBRTtNQUNoQyxJQUFJLFVBQVU7TUFDZCxJQUFJLFlBQVk7TUFDaEIsSUFBSSxVQUFVO01BQ2QsR0FBRyxDQUFDLENBQUM7TUFDTCxFQUFFLHVCQUF1QkQsT0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUU7TUFDdEQsSUFBSSxRQUFRLEVBQUUsRUFBRTtNQUNoQixHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLO01BQ25CLElBQUksdUJBQXVCQSxPQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRUQsZUFBYSxDQUFDRCxnQkFBYyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtNQUNoRyxNQUFNLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUM7TUFDekQsS0FBSyxDQUFDLEVBQUUsUUFBUSxJQUFJLGNBQWMsQ0FBQyxDQUFDO01BQ3BDLEdBQUcsQ0FBQyxDQUFDO01BQ0w7Ozs7Ozs7Ozs7O01DekZBO0FBQ0E7TUFDQSxDQUFDLFlBQVk7QUFFYjtNQUNBLENBQUMsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztBQUNoQztNQUNBLENBQUMsU0FBUyxVQUFVLEdBQUc7TUFDdkIsRUFBRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbkI7TUFDQSxFQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQzdDLEdBQUcsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzFCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxTQUFTO0FBQ3RCO01BQ0EsR0FBRyxJQUFJLE9BQU8sR0FBRyxPQUFPLEdBQUcsQ0FBQztBQUM1QjtNQUNBLEdBQUcsSUFBSSxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxRQUFRLEVBQUU7TUFDckQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3RCLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFDbEMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7TUFDcEIsS0FBSyxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztNQUM3QyxLQUFLLElBQUksS0FBSyxFQUFFO01BQ2hCLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUMxQixNQUFNO01BQ04sS0FBSztNQUNMLElBQUksTUFBTSxJQUFJLE9BQU8sS0FBSyxRQUFRLEVBQUU7TUFDcEMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7TUFDcEQsS0FBSyxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtNQUMxQixNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BQzdDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN6QixPQUFPO01BQ1AsTUFBTTtNQUNOLEtBQUssTUFBTTtNQUNYLEtBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztNQUNsQyxLQUFLO01BQ0wsSUFBSTtNQUNKLEdBQUc7QUFDSDtNQUNBLEVBQUUsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzNCLEVBQUU7QUFDRjtNQUNBLENBQUMsSUFBcUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtNQUN0RCxFQUFFLFVBQVUsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO01BQ2xDLEVBQUUsaUJBQWlCLFVBQVUsQ0FBQztNQUM5QixFQUFFLE1BS007TUFDUixFQUFFLE1BQU0sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO01BQ2pDLEVBQUU7TUFDRixDQUFDLEVBQUU7Ozs7Ozs7TUN2REgsS0FBTyxjQUFjLElBQUksQ0FBQzt3QkFDTixHQUFHLGFBQWE7QUFDcEM7TUFDQSxTQUFTLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUU7TUFDMUQsRUFBRSxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO01BQ3RDLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxjQUFjLENBQUM7TUFDdkMsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUMsTUFBTSxRQUFRLENBQUM7TUFDZixFQUFFLFFBQVEsR0FBRyxRQUFRLElBQUksSUFBSSxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDcE0sRUFBRSxRQUFRLEdBQUcsUUFBUSxJQUFJLFVBQVUsR0FBRyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7TUFDdEgsRUFBRSxPQUFPLE1BQU0sSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxNQUFNLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsTUFBTSxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQztNQUN4SixDQUFDO0FBQ0Q7TUFDQSxTQUFTLHFCQUFxQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7TUFDaEQsRUFBRSxJQUFJLFlBQVksR0FBRyxRQUFRLElBQUksUUFBUSxHQUFHLE9BQU8sR0FBRyxFQUFFO01BQ3hELE1BQU0sQ0FBQyxHQUFHLFFBQVEsR0FBRyxLQUFLLEdBQUcsWUFBWTtNQUN6QyxNQUFNLENBQUMsR0FBRyxRQUFRLEdBQUcsT0FBTyxHQUFHLFlBQVk7TUFDM0MsTUFBTSxDQUFDLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxZQUFZO01BQzVDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsR0FBRyxNQUFNLEdBQUcsWUFBWSxDQUFDO01BQzNDLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ25RLENBQUM7QUFDRDtNQUNBLFNBQVMsbUJBQW1CLENBQUMsT0FBTyxFQUFFO01BQ3RDLEVBQUUsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVk7TUFDekMsTUFBTSxLQUFLLEdBQUcsSUFBSTtNQUNsQixNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkU7TUFDQSxFQUFFLEtBQUssUUFBUSxJQUFJLFlBQVksRUFBRTtNQUNqQyxJQUFJLElBQUkseUNBQXlDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxNQUFNLEVBQUU7TUFDaEcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztNQUN2RixLQUFLLE1BQU0sSUFBSSxRQUFRLEtBQUssWUFBWSxFQUFFO01BQzFDLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUM5QyxLQUFLLE1BQU07TUFDWCxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDL0MsS0FBSztNQUNMLEdBQUc7QUFDSDtNQUNBLEVBQUUscUJBQXFCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQ3pDLEVBQUUscUJBQXFCLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQzFDLEVBQUUscUJBQXFCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQ3pDLEVBQUUsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDO01BQ25DLEVBQUUsT0FBTyxLQUFLLENBQUM7TUFDZixDQUFDO0FBQ0Q7TUFDQSxtQkFBbUIsQ0FBQyxTQUFTLEdBQUc7TUFDaEMsRUFBRSxXQUFXLEVBQUUsbUJBQW1CO01BQ2xDLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxtQkFBbUIsR0FBRyxFQUFFO01BQ3hELEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7TUFDcEQsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDNUIsR0FBRztNQUNILEVBQUUsSUFBSSxFQUFFLFNBQVMsSUFBSSxHQUFHLEVBQUU7TUFDMUIsRUFBRSxjQUFjLEVBQUUsU0FBUyxjQUFjLEdBQUcsRUFBRTtNQUM5QyxFQUFFLFdBQVcsRUFBRSxTQUFTLFdBQVcsR0FBRyxFQUFFO01BQ3hDLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxtQkFBbUIsR0FBRyxFQUFFO01BQ3hELENBQUMsQ0FBQztBQUNGO01BQ0EsU0FBUyxZQUFZLENBQUMsT0FBTyxFQUFFO01BQy9CLEVBQUUsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDdkUsRUFBRSxPQUFPLElBQUksbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDMUM7O01DM0RBO01BQ0EsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO01BQ3RCO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO0FBQ0E7TUFDQSxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUU7TUFDdkIsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxLQUFLLGFBQWEsQ0FBQztNQUMzQyxDQUFDO01BQ0Q7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO0FBQ0E7QUFDQTtNQUNBLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTtNQUMzQixFQUFFLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3hCLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRyxNQUFNLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtNQUM3QyxJQUFJLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztNQUM5QixHQUFHLE1BQU0sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO01BQ3hDLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO01BQ3pCLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7TUFDOUIsSUFBSSxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7TUFDeEMsR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO01BQzNDLElBQUksT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7TUFDckQsR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtNQUNsQyxJQUFJLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztNQUM1QyxHQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO01BQzlCLElBQUksT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQ3hDLEdBQUc7TUFDSCxDQUFDO0FBQ0Q7TUFDQSxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO01BQ3RDO01BQ0EsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQzNCO01BQ0EsRUFBRSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLHVCQUF1QixDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO0FBQ25JO01BQ0EsRUFBRSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUM7TUFDcEMsRUFBRSxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDaEMsQ0FBQztBQUNEO1VBQ0EsTUFBYyxHQUFHLFNBQVMsTUFBTSxDQUFDLEVBQUUsRUFBRTtNQUNyQyxFQUFFLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUM1QixFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTztBQUNuQjtNQUNBLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsT0FBTztNQUN0QyxFQUFFLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7QUFDdEI7TUFDQSxFQUFFLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtNQUNuQixJQUFJLE9BQU8sVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQzFCLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxHQUFHLEdBQUc7TUFDWixJQUFJLEdBQUcsRUFBRSxDQUFDO01BQ1YsSUFBSSxJQUFJLEVBQUUsQ0FBQztNQUNYLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxJQUFJLE9BQU8sRUFBRSxDQUFDLHFCQUFxQixLQUFLLFdBQVcsRUFBRTtNQUN2RDtNQUNBO01BQ0EsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDckM7TUFDQSxJQUFJLElBQUksRUFBRSxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRTtNQUN6RDtNQUNBO01BQ0EsTUFBTSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQzNDO0FBQ0E7TUFDQSxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO01BQ3JELE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUMxQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUN6QztNQUNBLE1BQU0sSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztNQUN2QyxNQUFNLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDbkMsTUFBTSxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7TUFDN0IsS0FBSztNQUNMLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQztNQUNsQyxFQUFFLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7TUFDekQsRUFBRSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO01BQzVELEVBQUUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDO01BQ3hELEVBQUUsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDO01BQzFELEVBQUUsT0FBTztNQUNULElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLFNBQVM7TUFDeEMsSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLEdBQUcsVUFBVTtNQUM1QyxHQUFHLENBQUM7TUFDSixDQUFDLENBQUM7QUFDRjtNQUNBLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtNQUMxQixFQUFFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7TUFDM0IsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO01BQzdCLEVBQUUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUMvQyxFQUFFLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDakQsRUFBRSxPQUFPO01BQ1QsSUFBSSxHQUFHLEVBQUUsR0FBRztNQUNaLElBQUksSUFBSSxFQUFFLElBQUk7TUFDZCxHQUFHLENBQUM7TUFDSjs7Ozs7QUM5R0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtBQUNBO01BQ0E7TUFDQSxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUM7TUFDNUMsRUFBRSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDO01BQzdDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEVBQUU7TUFDMUIsRUFBRSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDeEIsRUFBRSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDeEIsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekI7TUFDQSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsV0FBVztNQUN0QyxJQUFJLElBQUksT0FBTyxJQUFJLE1BQU0sRUFBRTtNQUMzQixNQUFNLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQzdCLEtBQUs7TUFDTCxTQUFTO01BQ1QsTUFBTSxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ3JELEtBQUs7TUFDTCxHQUFHLENBQUM7TUFDSixDQUFDLENBQUM7OztNQ3ZCRixnQkFBa0IsS0FBSyxDQUFDLENBQUM7QUFDekI7TUFDQSxJQUFJLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQ0ksT0FBZ0IsQ0FBQyxDQUFDO0FBQ3ZEO01BQ2tCLHNCQUFzQixDQUFDQyxvQkFBcUIsRUFBRTtBQUNoRTtNQUNBLElBQUksTUFBTSxHQUFHQyxLQUFrQixDQUFDO0FBQ2hDO01BQ0EsSUFBSSxPQUFPLEdBQUcsc0JBQXNCLENBQUNDLE1BQW1CLENBQUMsQ0FBQztBQUMxRDtNQUNvQixzQkFBc0IsQ0FBQ0Msb0JBQXdCLEVBQUU7QUFDckU7TUFDQSxTQUFTLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDL0Y7TUFDQSxTQUFTLHVCQUF1QixDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsRUFBRSxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxjQUFjLElBQUksTUFBTSxDQUFDLHdCQUF3QixHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxFQUFFLEVBQUU7QUFDeGQ7TUFDQSxTQUFTQyxVQUFRLEdBQUcsRUFBRUEsVUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksVUFBVSxNQUFNLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU9BLFVBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUU7QUFDN1Q7TUFDQSxTQUFTLGNBQWMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLEVBQUUsUUFBUSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLEVBQUU7QUFDdkw7TUFDQSxTQUFTLHNCQUFzQixDQUFDLElBQUksRUFBRSxFQUFFLElBQUksSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxJQUFJLGNBQWMsQ0FBQywyREFBMkQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFO0FBQ3RLO01BQ0EsU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcs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QUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQyxHQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFHLENBQUMsTUFBTSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQyxJQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sUUFBUSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sUUFBUSxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLElBQUksU0FBUyxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sUUFBUSxDQUFDLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLFFBQVEsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxRQUFRLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FB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LE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTttQ0FDOWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUNBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLG1DQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxxQ0FBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsbUNBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7K0NBQ2xOLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENB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QUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO01BQ3BELENBQUM7TUFDRDtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxTQUFTLFFBQVEsQ0FBQyxPQUFPLEVBQUU7TUFDM0IsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUM7TUFDekMsQ0FBQztNQUNEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLFNBQVMsWUFBWSxDQUFDLE9BQU8sRUFBRTtNQUMvQixJQUFJLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sS0FBSyxFQUFFLENBQUM7TUFDL0MsQ0FBQztNQUNEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLFNBQVMsYUFBYSxDQUFDLE9BQU8sRUFBRTtNQUNoQyxJQUFJLE9BQU8sT0FBTyxLQUFLLEVBQUUsQ0FBQztNQUMxQixDQUFDO01BQ0Q7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLFNBQVMsUUFBUSxDQUFDLE9BQU8sRUFBRTtNQUMzQixJQUFJLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUM1RCxDQUFDO01BQ0Q7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0EsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFO01BQzVCLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxDQUFDO01BQzFDLENBQUM7TUFDRDtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxTQUFTLFFBQVEsQ0FBQyxPQUFPLEVBQUU7TUFDM0IsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUM7TUFDekMsQ0FBQztNQUNEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLFNBQVMsS0FBSyxDQUFDLE9BQU8sRUFBRTtNQUN4QixJQUFJLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssQ0FBQztNQUN0QyxDQUFDO01BQ0Q7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0EsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFO01BQzVCLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxDQUFDO01BQzFDLENBQUM7TUFDRDtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxTQUFTLEtBQUssQ0FBQyxPQUFPLEVBQUU7TUFDeEIsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLENBQUM7TUFDdEMsQ0FBQztNQUNEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRTtNQUM1QixJQUFJLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsQ0FBQztNQUMxQyxDQUFDO01BQ0Q7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0EsU0FBUyxRQUFRLENBQUMsT0FBTyxFQUFFO01BQzNCLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDO01BQ3pDLENBQUM7TUFDRDtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxTQUFTLE1BQU0sQ0FBQyxPQUFPLEVBQUU7TUFDekIsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDMUQsQ0FBQztNQUNEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLFNBQVMsTUFBTSxDQUFDLE9BQU8sRUFBRTtNQUN6QixJQUFJLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLE1BQU0sQ0FBQztNQUN2QyxDQUFDO01BQ0Q7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0EsU0FBUyxNQUFNLENBQUMsT0FBTyxFQUFFO01BQ3pCLElBQUksT0FBTyxPQUFPLENBQUMsT0FB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LENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsVUFBVSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxVQUFVLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxLQUFLLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEtBQUssS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztNQUNqWSxHQUFHO01BQ0gsRUFBRSxRQUFRLENBQUM7TUFDWCxJQUFJLEtBQUssQ0FBQztNQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQztNQUM3QyxJQUFJLEtBQUssQ0FBQztNQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLENB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Q0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEs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
