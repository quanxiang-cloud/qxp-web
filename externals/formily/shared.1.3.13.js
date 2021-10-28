System.register([], (function (exports) {
  'use strict';
  return {
    execute: (function () {

      exports({
        deprecate: deprecate,
        each: each,
        every: every,
        find: find,
        findIndex: findIndex,
        includes: includes,
        isEmpty: isEmpty,
        map: map,
        reduce: reduce,
        some: some,
        uid: uid
      });

      const isType = (type) => (obj) => obj != null && (Array.isArray(type) ? type : [type]).some((t) => getType(obj) === `[object ${t}]`);
      const getType = exports('getType', (obj) => Object.prototype.toString.call(obj));
      const isFn = exports('isFn', isType([
        "Function",
        "AsyncFunction",
        "GeneratorFunction"
      ]));
      const isArr = exports('isArr', Array.isArray);
      const isPlainObj = exports('isPlainObj', isType("Object"));
      const isStr = exports('isStr', isType("String"));
      const isBool = exports('isBool', isType("Boolean"));
      const isNum = exports('isNum', isType("Number"));
      const isObj = exports('isObj', (val) => typeof val === "object");
      const isRegExp = exports('isRegExp', isType("RegExp"));

      const toArr = exports('toArr', (val) => isArr(val) ? val : val ? [val] : []);
      function each(val, iterator, revert) {
        if (isArr(val) || isStr(val)) {
          if (revert) {
            for (let i = val.length - 1; i >= 0; i--) {
              if (iterator(val[i], i) === false) {
                return;
              }
            }
          } else {
            for (let i = 0; i < val.length; i++) {
              if (iterator(val[i], i) === false) {
                return;
              }
            }
          }
        } else if (isObj(val)) {
          let key;
          for (key in val) {
            if (Object.hasOwnProperty.call(val, key)) {
              if (iterator(val[key], key) === false) {
                return;
              }
            }
          }
        }
      }
      function map(val, iterator, revert) {
        const res = isArr(val) || isStr(val) ? [] : {};
        each(val, (item, key) => {
          const value = iterator(item, key);
          if (isArr(res)) {
            res.push(value);
          } else {
            res[key] = value;
          }
        }, revert);
        return res;
      }
      function reduce(val, iterator, accumulator, revert) {
        let result = accumulator;
        each(val, (item, key) => {
          result = iterator(result, item, key);
        }, revert);
        return result;
      }
      function every(val, iterator, revert) {
        let res = true;
        each(val, (item, key) => {
          if (!iterator(item, key)) {
            res = false;
            return false;
          }
        }, revert);
        return res;
      }
      function some(val, iterator, revert) {
        let res = false;
        each(val, (item, key) => {
          if (iterator(item, key)) {
            res = true;
            return false;
          }
        }, revert);
        return res;
      }
      function findIndex(val, iterator, revert) {
        let res = -1;
        each(val, (item, key) => {
          if (iterator(item, key)) {
            res = key;
            return false;
          }
        }, revert);
        return res;
      }
      function find(val, iterator, revert) {
        let res;
        each(val, (item, key) => {
          if (iterator(item, key)) {
            res = item;
            return false;
          }
        }, revert);
        return res;
      }
      function includes(val, searchElement, revert) {
        if (isStr(val))
          return val.includes(searchElement);
        return some(val, (item) => item === searchElement, revert);
      }

      function globalSelf() {
        try {
          if (typeof self !== "undefined") {
            return self;
          }
        } catch (e) {
        }
        try {
          if (typeof window !== "undefined") {
            return window;
          }
        } catch (e) {
        }
        try {
          if (typeof global !== "undefined") {
            return global;
          }
        } catch (e) {
        }
        return Function("return this")();
      }
      const globalThisPolyfill = exports('globalThisPolyfill', globalSelf());

      const instOf = exports('instOf', (value, cls) => {
        if (isFn(cls))
          return value instanceof cls;
        if (isStr(cls))
          return globalThisPolyfill[cls] ? value instanceof globalThisPolyfill[cls] : false;
        return false;
      });

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
      const BIG_DATA_FLAG = Symbol("__BIG_DATA__");
      const _BigData = class {
        constructor(options) {
          this.options = __spreadValues$1({}, options);
        }
        create(data) {
          if (data !== void 0) {
            if (!data[BIG_DATA_FLAG]) {
              data[BIG_DATA_FLAG] = this.options;
            }
          }
          return data;
        }
      };
      let BigData = exports('BigData', _BigData);
      BigData.isBigData = (data) => {
        return data && !!data[BIG_DATA_FLAG];
      };
      BigData.compare = (a, b) => {
        if (_BigData.isBigData(a) && _BigData.isBigData(b)) {
          if (a[BIG_DATA_FLAG] === b[BIG_DATA_FLAG]) {
            return isFn(a[BIG_DATA_FLAG].compare) ? a[BIG_DATA_FLAG].compare(a, b) : a === b;
          }
          return false;
        }
        return a === b;
      };
      BigData.clone = (value) => {
        if (_BigData.isBigData(value)) {
          if (isFn(value[BIG_DATA_FLAG].clone)) {
            const ctx = value[BIG_DATA_FLAG];
            const result = value[BIG_DATA_FLAG].clone(value);
            result[BIG_DATA_FLAG] = ctx;
            return result;
          }
        }
        return value;
      };

      const isArray = isArr;
      const keyList = Object.keys;
      const hasProp = Object.prototype.hasOwnProperty;
      function equal(a, b, compareFunctionString = false) {
        if (a === b) {
          return true;
        }
        if (a && b && typeof a === "object" && typeof b === "object") {
          const bigDataA = BigData.isBigData(a);
          const bigDataB = BigData.isBigData(b);
          if (bigDataA !== bigDataB) {
            return false;
          }
          if (bigDataA && bigDataB) {
            return BigData.compare(a, b);
          }
          const arrA = isArray(a);
          const arrB = isArray(b);
          let i;
          let length;
          let key;
          if (arrA && arrB) {
            length = a.length;
            if (length !== b.length) {
              return false;
            }
            for (i = length; i-- !== 0; ) {
              if (!equal(a[i], b[i], compareFunctionString)) {
                return false;
              }
            }
            return true;
          }
          if (arrA !== arrB) {
            return false;
          }
          const momentA = a && a._isAMomentObject;
          const momentB = b && b._isAMomentObject;
          if (momentA !== momentB)
            return false;
          if (momentA && momentB)
            return a.isSame(b);
          const immutableA = a && a.toJS;
          const immutableB = b && b.toJS;
          if (immutableA !== immutableB)
            return false;
          if (immutableA)
            return a.is ? a.is(b) : a === b;
          const dateA = instOf(a, "Date");
          const dateB = instOf(b, "Date");
          if (dateA !== dateB) {
            return false;
          }
          if (dateA && dateB) {
            return a.getTime() === b.getTime();
          }
          const schemaA = a && a.toJSON;
          const schemaB = b && b.toJSON;
          if (schemaA !== schemaB)
            return false;
          if (schemaA && schemaB)
            return equal(a.toJSON(), b.toJSON(), compareFunctionString);
          const regexpA = instOf(a, "RegExp");
          const regexpB = instOf(b, "RegExp");
          if (regexpA !== regexpB) {
            return false;
          }
          if (regexpA && regexpB) {
            return a.toString() === b.toString();
          }
          const urlA = instOf(a, "URL");
          const urlB = instOf(b, "URL");
          if (urlA && urlB) {
            return a.href === b.href;
          }
          const keys = keyList(a);
          length = keys.length;
          if (length !== keyList(b).length) {
            return false;
          }
          for (i = length; i-- !== 0; ) {
            if (!hasProp.call(b, keys[i])) {
              return false;
            }
          }
          for (i = length; i-- !== 0; ) {
            key = keys[i];
            if (key === "_owner" && a.$$typeof) {
              continue;
            } else {
              if (!equal(a[key], b[key], compareFunctionString)) {
                return false;
              }
            }
          }
          return true;
        }
        if (compareFunctionString) {
          if (a && b && typeof a === "function" && typeof b === "function") {
            return a.toString() === b.toString();
          }
        }
        return a !== a && b !== b;
      }
      const isEqual = exports('isEqual', function exportedEqual(a, b, compareFunctionString = false) {
        try {
          return equal(a, b, compareFunctionString);
        } catch (error) {
          if (error.message && error.message.match(/stack|recursion/i) || error.number === -2146828260) {
            console.warn("Warning: react-fast-compare does not handle circular references.", error.name, error.message);
            return false;
          }
          throw error;
        }
      });

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
      const NATIVE_KEYS = [
        ["Map", (map) => new Map(map)],
        ["WeakMap", (map) => new WeakMap(map)],
        ["WeakSet", (set) => new WeakSet(set)],
        ["Set", (set) => new Set(set)],
        ["Date", (date) => new Date(date)],
        "FileList",
        "File",
        "URL",
        "RegExp",
        [
          "Promise",
          (promise) => new Promise((resolve, reject) => promise.then(resolve, reject))
        ]
      ];
      const isNativeObject = (values) => {
        for (let i = 0; i < NATIVE_KEYS.length; i++) {
          const item = NATIVE_KEYS[i];
          if (Array.isArray(item) && item[0]) {
            if (instOf(values, item[0])) {
              return item[1] ? item[1] : item[0];
            }
          } else {
            if (instOf(values, item)) {
              return item;
            }
          }
        }
      };
      const shallowClone = exports('shallowClone', (values) => {
        let nativeClone;
        if (Array.isArray(values)) {
          return values.slice(0);
        } else if (isNativeObject(values)) {
          nativeClone = isNativeObject(values);
          return isFn(nativeClone) ? nativeClone(values) : values;
        } else if (typeof values === "object" && !!values) {
          return __spreadValues({}, values);
        }
      });
      const clone = exports('clone', (values, filter) => {
        let nativeClone;
        if (Array.isArray(values)) {
          return values.map((item) => clone(item, filter));
        } else if (isNativeObject(values)) {
          nativeClone = isNativeObject(values);
          return isFn(nativeClone) ? nativeClone(values) : values;
        } else if (typeof values === "object" && !!values) {
          if ("$$typeof" in values && "_owner" in values) {
            return values;
          }
          if (values._isAMomentObject) {
            return values;
          }
          if (values._isJSONSchemaObject) {
            return values;
          }
          if (BigData.isBigData(values)) {
            return BigData.clone(values);
          }
          if (isFn(values.toJS)) {
            return values;
          }
          if (isFn(values.toJSON)) {
            return values;
          }
          if (Object.getOwnPropertySymbols(values || {}).length) {
            return values;
          }
          const res = {};
          for (const key in values) {
            if (Object.hasOwnProperty.call(values, key)) {
              if (isFn(filter)) {
                if (filter(values[key], key)) {
                  res[key] = clone(values[key], filter);
                } else {
                  res[key] = values[key];
                }
              } else {
                res[key] = clone(values[key], filter);
              }
            }
          }
          return res;
        } else {
          return values;
        }
      });

      const has = Object.prototype.hasOwnProperty;
      const toString = Object.prototype.toString;
      const isValid$1 = exports('isValid', (val) => val !== void 0 && val !== null);
      function isEmpty(val) {
        if (val == null) {
          return true;
        }
        if (typeof val === "boolean") {
          return false;
        }
        if (typeof val === "number") {
          return false;
        }
        if (typeof val === "string") {
          return val.length === 0;
        }
        if (typeof val === "function") {
          return val.length === 0;
        }
        if (Array.isArray(val)) {
          if (val.length === 0) {
            return true;
          }
          for (let i = 0; i < val.length; i++) {
            if (val[i] !== void 0 && val[i] !== null && val[i] !== "" && val[i] !== 0) {
              return false;
            }
          }
          return true;
        }
        if (instOf(val, "Error")) {
          return val.message === "";
        }
        if (val.toString === toString) {
          switch (val.toString()) {
            case "[object File]":
            case "[object Map]":
            case "[object Set]": {
              return val.size === 0;
            }
            case "[object Object]": {
              for (const key in val) {
                if (has.call(val, key)) {
                  return false;
                }
              }
              return true;
            }
          }
        }
        return false;
      }

      var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

      function getDefaultExportFromCjs (x) {
      	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
      }

      /**
       * Special language-specific overrides.
       *
       * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
       *
       * @type {Object}
       */

      var LANGUAGES$1 = {
        tr: {
          regexp: /[\u0069]/g,
          map: {
            '\u0069': '\u0130'
          }
        },
        az: {
          regexp: /[\u0069]/g,
          map: {
            '\u0069': '\u0130'
          }
        },
        lt: {
          regexp: /[\u0069\u006A\u012F]\u0307|\u0069\u0307[\u0300\u0301\u0303]/g,
          map: {
            '\u0069\u0307': '\u0049',
            '\u006A\u0307': '\u004A',
            '\u012F\u0307': '\u012E',
            '\u0069\u0307\u0300': '\u00CC',
            '\u0069\u0307\u0301': '\u00CD',
            '\u0069\u0307\u0303': '\u0128'
          }
        }
      };

      /**
       * Upper case a string.
       *
       * @param  {String} str
       * @return {String}
       */
      var upperCase$1 = exports('uppercase', function (str, locale) {
        var lang = LANGUAGES$1[locale];

        str = str == null ? '' : String(str);

        if (lang) {
          str = str.replace(lang.regexp, function (m) { return lang.map[m] });
        }

        return str.toUpperCase()
      });

      /**
       * Special language-specific overrides.
       *
       * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
       *
       * @type {Object}
       */

      var LANGUAGES = {
        tr: {
          regexp: /\u0130|\u0049|\u0049\u0307/g,
          map: {
            '\u0130': '\u0069',
            '\u0049': '\u0131',
            '\u0049\u0307': '\u0069'
          }
        },
        az: {
          regexp: /[\u0130]/g,
          map: {
            '\u0130': '\u0069',
            '\u0049': '\u0131',
            '\u0049\u0307': '\u0069'
          }
        },
        lt: {
          regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
          map: {
            '\u0049': '\u0069\u0307',
            '\u004A': '\u006A\u0307',
            '\u012E': '\u012F\u0307',
            '\u00CC': '\u0069\u0307\u0300',
            '\u00CD': '\u0069\u0307\u0301',
            '\u0128': '\u0069\u0307\u0303'
          }
        }
      };

      /**
       * Lowercase a string.
       *
       * @param  {String} str
       * @return {String}
       */
      var lowerCase$1 = exports('lowercase', function (str, locale) {
        var lang = LANGUAGES[locale];

        str = str == null ? '' : String(str);

        if (lang) {
          str = str.replace(lang.regexp, function (m) { return lang.map[m] });
        }

        return str.toLowerCase()
      });

      var nonWordRegexp = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;

      var camelCaseRegexp = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;

      var camelCaseUpperRegexp = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;

      var lowerCase = lowerCase$1;

      var NON_WORD_REGEXP = nonWordRegexp;
      var CAMEL_CASE_REGEXP = camelCaseRegexp;
      var CAMEL_CASE_UPPER_REGEXP = camelCaseUpperRegexp;

      /**
       * Sentence case a string.
       *
       * @param  {string} str
       * @param  {string} locale
       * @param  {string} replacement
       * @return {string}
       */
      var noCase$1 = function (str, locale, replacement) {
        if (str == null) {
          return ''
        }

        replacement = typeof replacement !== 'string' ? ' ' : replacement;

        function replace (match, index, value) {
          if (index === 0 || index === (value.length - match.length)) {
            return ''
          }

          return replacement
        }

        str = String(str)
          // Support camel case ("camelCase" -> "camel Case").
          .replace(CAMEL_CASE_REGEXP, '$1 $2')
          // Support odd camel case ("CAMELCase" -> "CAMEL Case").
          .replace(CAMEL_CASE_UPPER_REGEXP, '$1 $2')
          // Remove all non-word characters and replace with a single space.
          .replace(NON_WORD_REGEXP, replace);

        // Lower case the entire string.
        return lowerCase(str, locale)
      };

      var upperCase = upperCase$1;
      var noCase = noCase$1;

      /**
       * Camel case a string.
       *
       * @param  {string} value
       * @param  {string} [locale]
       * @return {string}
       */
      var camelCase = exports('camelCase', function (value, locale, mergeNumbers) {
        var result = noCase(value, locale);

        // Replace periods between numeric entities with an underscore.
        if (!mergeNumbers) {
          result = result.replace(/ (?=\d)/g, '_');
        }

        // Replace spaces between words with an upper cased character.
        return result.replace(/ (.)/g, function (m, $1) {
          return upperCase($1, locale)
        })
      });

      const ansiRegex = () => {
        const pattern = [
          "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)",
          "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
        ].join("|");
        return new RegExp(pattern, "g");
      };
      const regex = "[\uD800-\uDBFF][\uDC00-\uDFFF]";
      const astralRegex = (opts) => opts && opts.exact ? new RegExp(`^${regex}$`) : new RegExp(regex, "g");
      const stripAnsi = (input) => typeof input === "string" ? input.replace(ansiRegex(), "") : input;
      const stringLength = exports('stringLength', (input) => stripAnsi(input).replace(astralRegex(), " ").length);

      var lib = {};

      var parser = {};

      var tokenizer = {};

      var tokens = {};

      var contexts = {};

      var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
          __assign = Object.assign || function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                      t[p] = s[p];
              }
              return t;
          };
          return __assign.apply(this, arguments);
      };
      Object.defineProperty(contexts, "__esModule", { value: true });
      contexts.destructorContext = contexts.braceContext = contexts.parenContext = contexts.bracketDContext = contexts.bracketArrayContext = contexts.bracketContext = void 0;
      var ContextType = function (flag, props) {
          return __assign({ flag: flag }, props);
      };
      contexts.bracketContext = ContextType("[]");
      contexts.bracketArrayContext = ContextType("[\\d]");
      contexts.bracketDContext = ContextType("[[]]");
      contexts.parenContext = ContextType("()");
      contexts.braceContext = ContextType("{}");
      contexts.destructorContext = ContextType("{x}");

      (function (exports) {
      var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
          __assign = Object.assign || function(t) {
              for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                      t[p] = s[p];
              }
              return t;
          };
          return __assign.apply(this, arguments);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.eofTok = exports.expandTok = exports.ignoreTok = exports.commaTok = exports.parenRTok = exports.parenLTok = exports.bracketDRTok = exports.bracketDLTok = exports.bracketRTok = exports.bracketLTok = exports.braceRTok = exports.braceLTok = exports.colonTok = exports.bangTok = exports.dotTok = exports.starTok = exports.nameTok = void 0;
      var contexts_1 = contexts;
      var TokenType = function (flag, props) {
          return __assign({ flag: flag }, props);
      };
      exports.nameTok = TokenType('name', {
          expectNext: function (next) {
              if (this.includesContext(contexts_1.destructorContext)) {
                  return (next === exports.commaTok ||
                      next === exports.bracketRTok ||
                      next === exports.braceRTok ||
                      next === exports.colonTok);
              }
              return (next === exports.dotTok ||
                  next === exports.commaTok ||
                  next === exports.eofTok ||
                  next === exports.bracketRTok ||
                  next === exports.parenRTok ||
                  next === exports.colonTok ||
                  next === exports.expandTok ||
                  next === exports.bracketLTok);
          }
      });
      exports.starTok = TokenType('*', {
          expectNext: function (next) {
              return (next === exports.dotTok ||
                  next === exports.starTok ||
                  next === exports.parenLTok ||
                  next === exports.bracketLTok ||
                  next === exports.eofTok ||
                  next === exports.commaTok ||
                  next === exports.parenRTok);
          }
      });
      exports.dotTok = TokenType('.', {
          expectNext: function (next) {
              return (next === exports.nameTok ||
                  next === exports.bracketDLTok ||
                  next === exports.starTok ||
                  next === exports.bracketLTok ||
                  next === exports.braceLTok);
          },
          expectPrev: function (prev) {
              return (prev === exports.nameTok ||
                  prev === exports.bracketDRTok ||
                  prev === exports.starTok ||
                  prev === exports.parenRTok ||
                  prev === exports.bracketRTok ||
                  prev === exports.expandTok ||
                  prev === exports.braceRTok);
          }
      });
      exports.bangTok = TokenType('!', {
          expectNext: function (next) {
              return next === exports.nameTok || next === exports.bracketDLTok;
          }
      });
      exports.colonTok = TokenType(':', {
          expectNext: function (next) {
              if (this.includesContext(contexts_1.destructorContext)) {
                  return next === exports.nameTok || next === exports.braceLTok || next === exports.bracketLTok;
              }
              return next === exports.nameTok || next === exports.bracketDLTok || next === exports.bracketRTok;
          }
      });
      exports.braceLTok = TokenType('{', {
          expectNext: function (next) {
              return next === exports.nameTok;
          },
          expectPrev: function (prev) {
              if (this.includesContext(contexts_1.destructorContext)) {
                  return prev === exports.colonTok || prev === exports.commaTok || prev === exports.bracketLTok;
              }
              return prev === exports.dotTok || prev === exports.colonTok;
          },
          updateContext: function (prev) {
              this.state.context.push(contexts_1.braceContext);
          }
      });
      exports.braceRTok = TokenType('}', {
          expectNext: function (next) {
              if (this.includesContext(contexts_1.destructorContext)) {
                  return next === exports.commaTok || next === exports.braceRTok || next === exports.eofTok || next === exports.bracketRTok;
              }
              return next === exports.dotTok || next === exports.eofTok;
          },
          expectPrev: function (prev) {
              return prev === exports.nameTok || prev === exports.braceRTok || prev === exports.bracketRTok;
          },
          updateContext: function () {
              this.state.context.pop(contexts_1.braceContext);
          }
      });
      exports.bracketLTok = TokenType('[', {
          expectNext: function (next) {
              if (this.includesContext(contexts_1.destructorContext)) {
                  return next === exports.nameTok || next === exports.bracketLTok || next === exports.braceLTok;
              }
              return (next === exports.nameTok ||
                  next === exports.bracketDLTok ||
                  next === exports.colonTok ||
                  next === exports.bracketLTok ||
                  next === exports.ignoreTok);
          },
          expectPrev: function (prev) {
              if (this.includesContext(contexts_1.destructorContext)) {
                  return prev === exports.colonTok || prev === exports.commaTok || prev === exports.bracketLTok;
              }
              return (prev === exports.starTok ||
                  prev === exports.bracketLTok ||
                  prev === exports.dotTok ||
                  prev === exports.nameTok ||
                  prev === exports.parenLTok ||
                  prev == exports.commaTok);
          },
          updateContext: function (prev) {
              this.state.context.push(contexts_1.bracketContext);
          }
      });
      exports.bracketRTok = TokenType(']', {
          expectNext: function (next) {
              if (this.includesContext(contexts_1.destructorContext)) {
                  return next === exports.commaTok || next === exports.braceRTok || next === exports.bracketRTok || next === exports.eofTok;
              }
              return (next === exports.dotTok ||
                  next === exports.eofTok ||
                  next === exports.commaTok ||
                  next === exports.parenRTok ||
                  next === exports.bracketRTok);
          },
          updateContext: function (prev) {
              if (this.includesContext(contexts_1.bracketArrayContext))
                  return;
              if (!this.includesContext(contexts_1.bracketContext))
                  throw this.unexpect();
              this.state.context.pop();
          }
      });
      exports.bracketDLTok = TokenType('[[', {
          updateContext: function () {
              this.state.context.push(contexts_1.bracketDContext);
          }
      });
      exports.bracketDRTok = TokenType(']]', {
          updateContext: function () {
              if (this.curContext() !== contexts_1.bracketDContext)
                  throw this.unexpect();
              this.state.context.pop();
          }
      });
      exports.parenLTok = TokenType('(', {
          expectNext: function (next) {
              return (next === exports.nameTok ||
                  next === exports.bracketDLTok ||
                  next === exports.bangTok ||
                  next === exports.bracketLTok);
          },
          expectPrev: function (prev) {
              return prev === exports.starTok;
          },
          updateContext: function (prev) {
              this.state.context.push(contexts_1.parenContext);
          }
      });
      exports.parenRTok = TokenType(')', {
          expectNext: function (next) {
              return next === exports.dotTok || next === exports.eofTok || next === exports.commaTok || next === exports.parenRTok;
          },
          updateContext: function () {
              if (this.curContext() !== contexts_1.parenContext)
                  throw this.unexpect();
              this.state.context.pop();
          }
      });
      exports.commaTok = TokenType(',', {
          expectNext: function (next) {
              return (next === exports.nameTok ||
                  next === exports.bracketDLTok ||
                  next === exports.bracketLTok ||
                  next === exports.braceLTok);
          }
      });
      exports.ignoreTok = TokenType('ignore', {
          expectNext: function (next) {
              return next === exports.bracketDRTok;
          },
          expectPrev: function (prev) {
              return prev == exports.bracketDLTok;
          }
      });
      exports.expandTok = TokenType('expandTok', {
          expectNext: function (next) {
              return (next === exports.dotTok ||
                  next === exports.eofTok ||
                  next === exports.commaTok ||
                  next === exports.parenRTok);
          }
      });
      exports.eofTok = TokenType('eof');
      }(tokens));

      Object.defineProperty(tokenizer, "__esModule", { value: true });
      tokenizer.Tokenizer = void 0;
      var tokens_1$1 = tokens;
      var contexts_1$1 = contexts;
      var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
      var fullCharCodeAtPos = function (input, pos) {
          var code = input.charCodeAt(pos);
          if (code <= 0xd7ff || code >= 0xe000)
              return code;
          var next = input.charCodeAt(pos + 1);
          return (code << 10) + next - 0x35fdc00;
      };
      var isRewordCode = function (code) {
          return code === 42 ||
              code === 46 ||
              code === 33 ||
              code === 91 ||
              code === 93 ||
              code === 40 ||
              code === 41 ||
              code === 44 ||
              code === 58 ||
              code === 126 ||
              code === 123 ||
              code === 125;
      };
      var getError = function (message, props) {
          var err = new Error(message);
          Object.assign(err, props);
          return err;
      };
      var slice = function (string, start, end) {
          var str = '';
          for (var i = start; i < end; i++) {
              var ch = string.charAt(i);
              if (ch !== '\\') {
                  str += ch;
              }
          }
          return str;
      };
      var Tokenizer = (function () {
          function Tokenizer(input) {
              this.input = input;
              this.state = {
                  context: [],
                  type: null,
                  pos: 0
              };
          }
          Tokenizer.prototype.curContext = function () {
              return this.state.context[this.state.context.length - 1];
          };
          Tokenizer.prototype.includesContext = function (context) {
              for (var len = this.state.context.length - 1; len >= 0; len--) {
                  if (this.state.context[len] === context) {
                      return true;
                  }
              }
              return false;
          };
          Tokenizer.prototype.unexpect = function (type) {
              type = type || this.state.type;
              return getError("Unexpect token \"" + type.flag + "\" in " + this.state.pos + " char.", {
                  pos: this.state.pos
              });
          };
          Tokenizer.prototype.expectNext = function (type, next) {
              if (type && type.expectNext) {
                  if (next && !type.expectNext.call(this, next)) {
                      throw getError("Unexpect token \"" + next.flag + "\" token should not be behind \"" + type.flag + "\" token.(" + this.state.pos + "th char)", {
                          pos: this.state.pos
                      });
                  }
              }
          };
          Tokenizer.prototype.expectPrev = function (type, prev) {
              if (type && type.expectPrev) {
                  if (prev && !type.expectPrev.call(this, prev)) {
                      throw getError("Unexpect token \"" + type.flag + "\" should not be behind \"" + prev.flag + "\"(" + this.state.pos + "th char).", {
                          pos: this.state.pos
                      });
                  }
              }
          };
          Tokenizer.prototype.match = function (type) {
              return this.state.type === type;
          };
          Tokenizer.prototype.skipSpace = function () {
              if (this.curContext() === contexts_1$1.bracketDContext)
                  return;
              loop: while (this.state.pos < this.input.length) {
                  var ch = this.input.charCodeAt(this.state.pos);
                  switch (ch) {
                      case 32:
                      case 160:
                          ++this.state.pos;
                          break;
                      case 13:
                          if (this.input.charCodeAt(this.state.pos + 1) === 10) {
                              ++this.state.pos;
                          }
                      case 10:
                      case 8232:
                      case 8233:
                          ++this.state.pos;
                          break;
                      default:
                          if ((ch > 8 && ch < 14) ||
                              (ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch)))) {
                              ++this.state.pos;
                          }
                          else {
                              break loop;
                          }
                  }
              }
          };
          Tokenizer.prototype.next = function () {
              if (this.input.length <= this.state.pos) {
                  return this.finishToken(tokens_1$1.eofTok);
              }
              this.skipSpace();
              this.readToken(this.getCode(), this.state.pos > 0 ? this.getCode(this.state.pos - 1) : -Infinity);
          };
          Tokenizer.prototype.getCode = function (pos) {
              if (pos === void 0) { pos = this.state.pos; }
              return fullCharCodeAtPos(this.input, pos);
          };
          Tokenizer.prototype.eat = function (type) {
              if (this.match(type)) {
                  this.next();
                  return true;
              }
              else {
                  return false;
              }
          };
          Tokenizer.prototype.readKeyWord = function () {
              var startPos = this.state.pos, string = '';
              while (true) {
                  var code = this.getCode();
                  var prevCode = this.getCode(this.state.pos - 1);
                  if (this.input.length === this.state.pos) {
                      string = slice(this.input, startPos, this.state.pos + 1);
                      break;
                  }
                  if (!isRewordCode(code) || prevCode === 92) {
                      if (code === 32 ||
                          code === 160 ||
                          code === 10 ||
                          code === 8232 ||
                          code === 8233) {
                          string = slice(this.input, startPos, this.state.pos);
                          break;
                      }
                      if (code === 13 && this.input.charCodeAt(this.state.pos + 1) === 10) {
                          string = slice(this.input, startPos, this.state.pos);
                          break;
                      }
                      if ((code > 8 && code < 14) ||
                          (code >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(code)))) {
                          string = slice(this.input, startPos, this.state.pos);
                          break;
                      }
                      this.state.pos++;
                  }
                  else {
                      string = slice(this.input, startPos, this.state.pos);
                      break;
                  }
              }
              this.finishToken(tokens_1$1.nameTok, string);
          };
          Tokenizer.prototype.readIngoreString = function () {
              var startPos = this.state.pos, prevCode, string = '';
              while (true) {
                  var code = this.getCode();
                  if (this.state.pos >= this.input.length)
                      break;
                  if ((code === 91 || code === 93) && prevCode === 92) {
                      this.state.pos++;
                      prevCode = '';
                  }
                  else if (code == 93 && prevCode === 93) {
                      string = this.input
                          .slice(startPos, this.state.pos - 1)
                          .replace(/\\([\[\]])/g, '$1');
                      this.state.pos++;
                      break;
                  }
                  else {
                      this.state.pos++;
                      prevCode = code;
                  }
              }
              this.finishToken(tokens_1$1.ignoreTok, string);
              this.finishToken(tokens_1$1.bracketDRTok);
          };
          Tokenizer.prototype.finishToken = function (type, value) {
              var preType = this.state.type;
              this.state.type = type;
              if (value !== undefined)
                  this.state.value = value;
              this.expectNext(preType, type);
              this.expectPrev(type, preType);
              if (type.updateContext) {
                  type.updateContext.call(this, preType);
              }
          };
          Tokenizer.prototype.readToken = function (code, prevCode) {
              if (prevCode === 92) {
                  return this.readKeyWord();
              }
              if (this.input.length <= this.state.pos) {
                  this.finishToken(tokens_1$1.eofTok);
              }
              else if (this.curContext() === contexts_1$1.bracketDContext) {
                  this.readIngoreString();
              }
              else if (code === 123) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.braceLTok);
              }
              else if (code === 125) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.braceRTok);
              }
              else if (code === 42) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.starTok);
              }
              else if (code === 33) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.bangTok);
              }
              else if (code === 46) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.dotTok);
              }
              else if (code === 91) {
                  this.state.pos++;
                  if (this.getCode() === 91) {
                      this.state.pos++;
                      return this.finishToken(tokens_1$1.bracketDLTok);
                  }
                  this.finishToken(tokens_1$1.bracketLTok);
              }
              else if (code === 126) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.expandTok);
              }
              else if (code === 93) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.bracketRTok);
              }
              else if (code === 40) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.parenLTok);
              }
              else if (code === 41) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.parenRTok);
              }
              else if (code === 44) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.commaTok);
              }
              else if (code === 58) {
                  this.state.pos++;
                  this.finishToken(tokens_1$1.colonTok);
              }
              else {
                  this.readKeyWord();
              }
          };
          return Tokenizer;
      }());
      tokenizer.Tokenizer = Tokenizer;

      var destructor = {};

      var types = {};

      (function (exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isArrayPattern = exports.isObjectPatternProperty = exports.isObjectPattern = exports.isDestructorExpression = exports.isRangeExpression = exports.isGroupExpression = exports.isExpandOperator = exports.isWildcardOperator = exports.isDotOperator = exports.isIgnoreExpression = exports.isIdentifier = exports.isType = void 0;
      exports.isType = function (type) { return function (obj) {
          return obj && obj.type === type;
      }; };
      exports.isIdentifier = exports.isType('Identifier');
      exports.isIgnoreExpression = exports.isType('IgnoreExpression');
      exports.isDotOperator = exports.isType('DotOperator');
      exports.isWildcardOperator = exports.isType('WildcardOperator');
      exports.isExpandOperator = exports.isType('ExpandOperator');
      exports.isGroupExpression = exports.isType('GroupExpression');
      exports.isRangeExpression = exports.isType('RangeExpression');
      exports.isDestructorExpression = exports.isType('DestructorExpression');
      exports.isObjectPattern = exports.isType('ObjectPattern');
      exports.isObjectPatternProperty = exports.isType('ObjectPatternProperty');
      exports.isArrayPattern = exports.isType('ArrayPattern');
      }(types));

      var utils = {};

      (function (exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isEqual = exports.toArray = exports.isRegExp = exports.isObj = exports.isNum = exports.isBool = exports.isStr = exports.isPlainObj = exports.isArr = exports.isFn = void 0;
      var isType = function (type) { return function (obj) {
          return obj != null && Object.prototype.toString.call(obj) === "[object " + type + "]";
      }; };
      exports.isFn = isType('Function');
      exports.isArr = Array.isArray || isType('Array');
      exports.isPlainObj = isType('Object');
      exports.isStr = isType('String');
      exports.isBool = isType('Boolean');
      exports.isNum = isType('Number');
      exports.isObj = function (val) { return typeof val === 'object'; };
      exports.isRegExp = isType('RegExp');
      var isArray = exports.isArr;
      var keyList = Object.keys;
      var hasProp = Object.prototype.hasOwnProperty;
      exports.toArray = function (val) { return Array.isArray(val) ? val : val !== undefined ? [val] : []; };
      exports.isEqual = function (a, b) {
          if (a === b) {
              return true;
          }
          if (a && b && typeof a === 'object' && typeof b === 'object') {
              var arrA = isArray(a);
              var arrB = isArray(b);
              var i = void 0;
              var length_1;
              var key = void 0;
              if (arrA && arrB) {
                  length_1 = a.length;
                  if (length_1 !== b.length) {
                      return false;
                  }
                  for (i = length_1; i-- !== 0;) {
                      if (!exports.isEqual(a[i], b[i])) {
                          return false;
                      }
                  }
                  return true;
              }
              if (arrA !== arrB) {
                  return false;
              }
              var keys = keyList(a);
              length_1 = keys.length;
              if (length_1 !== keyList(b).length) {
                  return false;
              }
              for (i = length_1; i-- !== 0;) {
                  if (!hasProp.call(b, keys[i])) {
                      return false;
                  }
              }
              for (i = length_1; i-- !== 0;) {
                  key = keys[i];
                  if (!exports.isEqual(a[key], b[key])) {
                      return false;
                  }
              }
              return true;
          }
          return a !== a && b !== b;
      };
      }(utils));

      (function (exports) {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.existInByDestructor = exports.deleteInByDestructor = exports.getInByDestructor = exports.setInByDestructor = exports.parseDestructorRules = exports.setDestructor = exports.getDestructor = void 0;
      var types_1 = types;
      var utils_1 = utils;
      var DestrcutorCache = new Map();
      var isValid = function (val) { return val !== undefined && val !== null; };
      exports.getDestructor = function (source) {
          return DestrcutorCache.get(source);
      };
      exports.setDestructor = function (source, rules) {
          DestrcutorCache.set(source, rules);
      };
      exports.parseDestructorRules = function (node) {
          var rules = [];
          if (types_1.isObjectPattern(node)) {
              var index_1 = 0;
              node.properties.forEach(function (child) {
                  rules[index_1] = {
                      path: []
                  };
                  rules[index_1].key = child.key.value;
                  rules[index_1].path.push(child.key.value);
                  if (types_1.isIdentifier(child.value)) {
                      rules[index_1].key = child.value.value;
                  }
                  var basePath = rules[index_1].path;
                  var childRules = exports.parseDestructorRules(child.value);
                  var k = index_1;
                  childRules.forEach(function (rule) {
                      if (rules[k]) {
                          rules[k].key = rule.key;
                          rules[k].path = basePath.concat(rule.path);
                      }
                      else {
                          rules[k] = {
                              key: rule.key,
                              path: basePath.concat(rule.path)
                          };
                      }
                      k++;
                  });
                  if (k > index_1) {
                      index_1 = k;
                  }
                  else {
                      index_1++;
                  }
              });
              return rules;
          }
          else if (types_1.isArrayPattern(node)) {
              var index_2 = 0;
              node.elements.forEach(function (child, key) {
                  rules[index_2] = {
                      path: []
                  };
                  rules[index_2].key = key;
                  rules[index_2].path.push(key);
                  if (types_1.isIdentifier(child)) {
                      rules[index_2].key = child.value;
                  }
                  var basePath = rules[index_2].path;
                  var childRules = exports.parseDestructorRules(child);
                  var k = index_2;
                  childRules.forEach(function (rule) {
                      if (rules[k]) {
                          rules[k].key = rule.key;
                          rules[k].path = basePath.concat(rule.path);
                      }
                      else {
                          rules[k] = {
                              key: rule.key,
                              path: basePath.concat(rule.path)
                          };
                      }
                      k++;
                  });
                  if (k > index_2) {
                      index_2 = k;
                  }
                  else {
                      index_2++;
                  }
              });
              return rules;
          }
          if (types_1.isDestructorExpression(node)) {
              return exports.parseDestructorRules(node.value);
          }
          return rules;
      };
      exports.setInByDestructor = function (source, rules, value, mutators) {
          rules.forEach(function (_a) {
              var key = _a.key, path = _a.path;
              mutators.setIn([key], source, mutators.getIn(path, value));
          });
      };
      exports.getInByDestructor = function (source, rules, mutators) {
          var response = {};
          if (rules.length) {
              if (utils_1.isNum(rules[0].path[0])) {
                  response = [];
              }
          }
          source = isValid(source) ? source : {};
          rules.forEach(function (_a) {
              var key = _a.key, path = _a.path;
              mutators.setIn(path, response, source[key]);
          });
          return response;
      };
      exports.deleteInByDestructor = function (source, rules, mutators) {
          rules.forEach(function (_a) {
              var key = _a.key;
              mutators.deleteIn([key], source);
          });
      };
      exports.existInByDestructor = function (source, rules, start, mutators) {
          return rules.every(function (_a) {
              var key = _a.key;
              return mutators.existIn([key], source, start);
          });
      };
      }(destructor));

      var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
          var extendStatics = function (d, b) {
              extendStatics = Object.setPrototypeOf ||
                  ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                  function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
              return extendStatics(d, b);
          };
          return function (d, b) {
              extendStatics(d, b);
              function __() { this.constructor = d; }
              d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
          };
      })();
      Object.defineProperty(parser, "__esModule", { value: true });
      parser.Parser = void 0;
      var tokenizer_1 = tokenizer;
      var tokens_1 = tokens;
      var contexts_1 = contexts;
      var destructor_1 = destructor;
      var Parser = (function (_super) {
          __extends(Parser, _super);
          function Parser() {
              return _super !== null && _super.apply(this, arguments) || this;
          }
          Parser.prototype.parse = function () {
              var node;
              this.data = {
                  segments: []
              };
              if (!this.eat(tokens_1.eofTok)) {
                  this.next();
                  node = this.parseAtom(this.state.type);
              }
              this.data.tree = node;
              return node;
          };
          Parser.prototype.append = function (parent, node) {
              if (parent && node) {
                  parent.after = node;
              }
          };
          Parser.prototype.parseAtom = function (type) {
              switch (type) {
                  case tokens_1.braceLTok:
                  case tokens_1.bracketLTok:
                      if (this.includesContext(contexts_1.destructorContext)) {
                          if (type === tokens_1.braceLTok) {
                              return this.parseObjectPattern();
                          }
                          else {
                              return this.parseArrayPattern();
                          }
                      }
                      return this.parseDestructorExpression();
                  case tokens_1.nameTok:
                      return this.parseIdentifier();
                  case tokens_1.expandTok:
                      return this.parseExpandOperator();
                  case tokens_1.starTok:
                      return this.parseWildcardOperator();
                  case tokens_1.bracketDLTok:
                      return this.parseIgnoreExpression();
                  case tokens_1.dotTok:
                      return this.parseDotOperator();
              }
          };
          Parser.prototype.pushSegments = function (key) {
              this.data.segments.push(key);
          };
          Parser.prototype.parseIdentifier = function () {
              var node = {
                  type: 'Identifier',
                  value: this.state.value
              };
              var hasNotInDestructor = !this.includesContext(contexts_1.destructorContext) &&
                  !this.isMatchPattern &&
                  !this.isWildMatchPattern;
              this.next();
              if (this.includesContext(contexts_1.bracketArrayContext)) {
                  if (this.state.type !== tokens_1.bracketRTok) {
                      throw this.unexpect();
                  }
                  else {
                      this.state.context.pop();
                      this.next();
                  }
              }
              else if (hasNotInDestructor) {
                  this.pushSegments(node.value);
              }
              if (this.state.type === tokens_1.bracketLTok) {
                  this.next();
                  if (this.state.type !== tokens_1.nameTok) {
                      throw this.unexpect();
                  }
                  this.state.context.push(contexts_1.bracketArrayContext);
                  var isNumberKey = false;
                  if (/^\d+$/.test(this.state.value)) {
                      isNumberKey = true;
                  }
                  var value = this.state.value;
                  this.pushSegments(isNumberKey ? Number(value) : value);
                  var after = this.parseAtom(this.state.type);
                  if (isNumberKey) {
                      after.arrayIndex = true;
                  }
                  this.append(node, after);
              }
              else {
                  this.append(node, this.parseAtom(this.state.type));
              }
              return node;
          };
          Parser.prototype.parseExpandOperator = function () {
              var node = {
                  type: 'ExpandOperator'
              };
              this.isMatchPattern = true;
              this.isWildMatchPattern = true;
              this.data.segments = [];
              this.next();
              this.append(node, this.parseAtom(this.state.type));
              return node;
          };
          Parser.prototype.parseWildcardOperator = function () {
              var node = {
                  type: 'WildcardOperator'
              };
              this.isMatchPattern = true;
              this.isWildMatchPattern = true;
              this.data.segments = [];
              this.next();
              if (this.state.type === tokens_1.parenLTok) {
                  node.filter = this.parseGroupExpression(node);
              }
              else if (this.state.type === tokens_1.bracketLTok) {
                  node.filter = this.parseRangeExpression(node);
              }
              this.append(node, this.parseAtom(this.state.type));
              return node;
          };
          Parser.prototype.parseDestructorExpression = function () {
              var node = {
                  type: 'DestructorExpression'
              };
              this.state.context.push(contexts_1.destructorContext);
              var startPos = this.state.pos - 1;
              node.value =
                  this.state.type === tokens_1.braceLTok
                      ? this.parseObjectPattern()
                      : this.parseArrayPattern();
              var endPos = this.state.pos;
              this.state.context.pop();
              this.next();
              this.append(node, this.parseAtom(this.state.type));
              node.source = this.input.substring(startPos, endPos).replace(/\s*/g, '');
              destructor_1.setDestructor(node.source, destructor_1.parseDestructorRules(node));
              this.pushSegments(node.source);
              return node;
          };
          Parser.prototype.parseArrayPattern = function () {
              var node = {
                  type: 'ArrayPattern',
                  elements: []
              };
              this.next();
              node.elements = this.parseArrayPatternElements();
              return node;
          };
          Parser.prototype.parseArrayPatternElements = function () {
              var nodes = [];
              while (this.state.type !== tokens_1.bracketRTok && this.state.type !== tokens_1.eofTok) {
                  nodes.push(this.parseAtom(this.state.type));
                  if (this.state.type === tokens_1.bracketRTok) {
                      this.next();
                      break;
                  }
                  this.next();
              }
              return nodes;
          };
          Parser.prototype.parseObjectPattern = function () {
              var node = {
                  type: 'ObjectPattern',
                  properties: []
              };
              this.next();
              node.properties = this.parseObjectProperties();
              return node;
          };
          Parser.prototype.parseObjectProperties = function () {
              var nodes = [];
              while (this.state.type !== tokens_1.braceRTok && this.state.type !== tokens_1.eofTok) {
                  var node = {
                      type: 'ObjectPatternProperty',
                      key: this.parseAtom(this.state.type)
                  };
                  nodes.push(node);
                  if (this.state.type === tokens_1.colonTok) {
                      this.next();
                      node.value = this.parseAtom(this.state.type);
                  }
                  if (this.state.type === tokens_1.braceRTok) {
                      this.next();
                      break;
                  }
                  this.next();
              }
              return nodes;
          };
          Parser.prototype.parseDotOperator = function () {
              var node = {
                  type: 'DotOperator'
              };
              this.next();
              this.append(node, this.parseAtom(this.state.type));
              return node;
          };
          Parser.prototype.parseIgnoreExpression = function () {
              this.next();
              var value = String(this.state.value).replace(/\s*/g, '');
              var node = {
                  type: 'IgnoreExpression',
                  value: value
              };
              this.pushSegments(value);
              this.next();
              this.append(node, this.parseAtom(this.state.type));
              this.next();
              return node;
          };
          Parser.prototype.parseGroupExpression = function (parent) {
              var node = {
                  type: 'GroupExpression',
                  value: []
              };
              this.isMatchPattern = true;
              this.data.segments = [];
              this.next();
              loop: while (true) {
                  switch (this.state.type) {
                      case tokens_1.commaTok:
                          this.next();
                          break;
                      case tokens_1.bangTok:
                          node.isExclude = true;
                          this.haveExcludePattern = true;
                          this.next();
                          break;
                      case tokens_1.eofTok:
                          break loop;
                      case tokens_1.parenRTok:
                          break loop;
                      default:
                          node.value.push(this.parseAtom(this.state.type));
                  }
              }
              this.next();
              this.append(parent, this.parseAtom(this.state.type));
              return node;
          };
          Parser.prototype.parseRangeExpression = function (parent) {
              var node = {
                  type: 'RangeExpression'
              };
              this.next();
              this.isMatchPattern = true;
              this.data.segments = [];
              var start = false, hasColon = false;
              loop: while (true) {
                  switch (this.state.type) {
                      case tokens_1.colonTok:
                          hasColon = true;
                          start = true;
                          this.next();
                          break;
                      case tokens_1.bracketRTok:
                          if (!hasColon && !node.end) {
                              node.end = node.start;
                          }
                          break loop;
                      case tokens_1.commaTok:
                          throw this.unexpect();
                      case tokens_1.eofTok:
                          break loop;
                      default:
                          if (!start) {
                              node.start = this.parseAtom(this.state.type);
                          }
                          else {
                              node.end = this.parseAtom(this.state.type);
                          }
                  }
              }
              this.next();
              this.append(parent, this.parseAtom(this.state.type));
              return node;
          };
          return Parser;
      }(tokenizer_1.Tokenizer));
      parser.Parser = Parser;

      var lru = {};

      Object.defineProperty(lru, "__esModule", { value: true });
      lru.LRUMap = void 0;
      var NEWER = Symbol('newer');
      var OLDER = Symbol('older');
      function LRUMap(limit, entries) {
          if (typeof limit !== 'number') {
              entries = limit;
              limit = 0;
          }
          this.size = 0;
          this.limit = limit;
          this.oldest = this.newest = undefined;
          this._keymap = new Map();
          if (entries) {
              this.assign(entries);
              if (limit < 1) {
                  this.limit = this.size;
              }
          }
      }
      lru.LRUMap = LRUMap;
      function Entry(key, value) {
          this.key = key;
          this.value = value;
          this[NEWER] = undefined;
          this[OLDER] = undefined;
      }
      LRUMap.prototype._markEntryAsUsed = function (entry) {
          if (entry === this.newest) {
              return;
          }
          if (entry[NEWER]) {
              if (entry === this.oldest) {
                  this.oldest = entry[NEWER];
              }
              entry[NEWER][OLDER] = entry[OLDER];
          }
          if (entry[OLDER]) {
              entry[OLDER][NEWER] = entry[NEWER];
          }
          entry[NEWER] = undefined;
          entry[OLDER] = this.newest;
          if (this.newest) {
              this.newest[NEWER] = entry;
          }
          this.newest = entry;
      };
      LRUMap.prototype.assign = function (entries) {
          var entry;
          var limit = this.limit || Number.MAX_VALUE;
          this._keymap.clear();
          var it = entries[Symbol.iterator]();
          for (var itv = it.next(); !itv.done; itv = it.next()) {
              var e = new Entry(itv.value[0], itv.value[1]);
              this._keymap.set(e.key, e);
              if (!entry) {
                  this.oldest = e;
              }
              else {
                  entry[NEWER] = e;
                  e[OLDER] = entry;
              }
              entry = e;
              if (limit-- === 0) {
                  throw new Error('overflow');
              }
          }
          this.newest = entry;
          this.size = this._keymap.size;
      };
      LRUMap.prototype.get = function (key) {
          var entry = this._keymap.get(key);
          if (!entry) {
              return;
          }
          this._markEntryAsUsed(entry);
          return entry.value;
      };
      LRUMap.prototype.set = function (key, value) {
          var entry = this._keymap.get(key);
          if (entry) {
              entry.value = value;
              this._markEntryAsUsed(entry);
              return this;
          }
          this._keymap.set(key, (entry = new Entry(key, value)));
          if (this.newest) {
              this.newest[NEWER] = entry;
              entry[OLDER] = this.newest;
          }
          else {
              this.oldest = entry;
          }
          this.newest = entry;
          ++this.size;
          if (this.size > this.limit) {
              this.shift();
          }
          return this;
      };
      LRUMap.prototype.shift = function () {
          var entry = this.oldest;
          if (entry) {
              if (this.oldest[NEWER]) {
                  this.oldest = this.oldest[NEWER];
                  this.oldest[OLDER] = undefined;
              }
              else {
                  this.oldest = undefined;
                  this.newest = undefined;
              }
              entry[NEWER] = entry[OLDER] = undefined;
              this._keymap.delete(entry.key);
              --this.size;
              return [entry.key, entry.value];
          }
      };
      LRUMap.prototype.find = function (key) {
          var e = this._keymap.get(key);
          return e ? e.value : undefined;
      };
      LRUMap.prototype.has = function (key) {
          return this._keymap.has(key);
      };
      LRUMap.prototype.delete = function (key) {
          var entry = this._keymap.get(key);
          if (!entry) {
              return;
          }
          this._keymap.delete(entry.key);
          if (entry[NEWER] && entry[OLDER]) {
              entry[OLDER][NEWER] = entry[NEWER];
              entry[NEWER][OLDER] = entry[OLDER];
          }
          else if (entry[NEWER]) {
              entry[NEWER][OLDER] = undefined;
              this.oldest = entry[NEWER];
          }
          else if (entry[OLDER]) {
              entry[OLDER][NEWER] = undefined;
              this.newest = entry[OLDER];
          }
          else {
              this.oldest = this.newest = undefined;
          }
          this.size--;
          return entry.value;
      };
      LRUMap.prototype.clear = function () {
          this.oldest = this.newest = undefined;
          this.size = 0;
          this._keymap.clear();
      };
      function EntryIterator(oldestEntry) {
          this.entry = oldestEntry;
      }
      EntryIterator.prototype[Symbol.iterator] = function () {
          return this;
      };
      EntryIterator.prototype.next = function () {
          var ent = this.entry;
          if (ent) {
              this.entry = ent[NEWER];
              return { done: false, value: [ent.key, ent.value] };
          }
          else {
              return { done: true, value: undefined };
          }
      };
      function KeyIterator(oldestEntry) {
          this.entry = oldestEntry;
      }
      KeyIterator.prototype[Symbol.iterator] = function () {
          return this;
      };
      KeyIterator.prototype.next = function () {
          var ent = this.entry;
          if (ent) {
              this.entry = ent[NEWER];
              return { done: false, value: ent.key };
          }
          else {
              return { done: true, value: undefined };
          }
      };
      function ValueIterator(oldestEntry) {
          this.entry = oldestEntry;
      }
      ValueIterator.prototype[Symbol.iterator] = function () {
          return this;
      };
      ValueIterator.prototype.next = function () {
          var ent = this.entry;
          if (ent) {
              this.entry = ent[NEWER];
              return { done: false, value: ent.value };
          }
          else {
              return { done: true, value: undefined };
          }
      };
      LRUMap.prototype.keys = function () {
          return new KeyIterator(this.oldest);
      };
      LRUMap.prototype.values = function () {
          return new ValueIterator(this.oldest);
      };
      LRUMap.prototype.entries = function () {
          return this;
      };
      LRUMap.prototype[Symbol.iterator] = function () {
          return new EntryIterator(this.oldest);
      };
      LRUMap.prototype.forEach = function (fun, thisObj) {
          if (typeof thisObj !== 'object') {
              thisObj = this;
          }
          var entry = this.oldest;
          while (entry) {
              fun.call(thisObj, entry.value, entry.key, this);
              entry = entry[NEWER];
          }
      };
      LRUMap.prototype.toJSON = function () {
          var s = new Array(this.size);
          var i = 0;
          var entry = this.oldest;
          while (entry) {
              s[i++] = { key: entry.key, value: entry.value };
              entry = entry[NEWER];
          }
          return s;
      };
      LRUMap.prototype.toString = function () {
          var s = '';
          var entry = this.oldest;
          while (entry) {
              s += String(entry.key) + ':' + entry.value;
              entry = entry[NEWER];
              if (entry) {
                  s += ' < ';
              }
          }
          return s;
      };

      var matcher = {};

      Object.defineProperty(matcher, "__esModule", { value: true });
      matcher.Matcher = void 0;
      var types_1 = types;
      var utils_1 = utils;
      var isValid = function (val) { return val !== undefined && val !== null && val !== ''; };
      var Matcher = (function () {
          function Matcher(tree, record) {
              var _this = this;
              this.matchNext = function (node, path) {
                  return node.after
                      ? _this.matchAtom(path, node.after)
                      : isValid(path[_this.pos]);
              };
              this.tree = tree;
              this.pos = 0;
              this.excluding = false;
              this.record = record;
              this.stack = [];
          }
          Matcher.prototype.currentElement = function (path) {
              return String(path[this.pos] || '').replace(/\s*/g, '');
          };
          Matcher.prototype.recordMatch = function (match) {
              var _this = this;
              return function () {
                  var result = match();
                  if (result) {
                      if (_this.record && _this.record.score !== undefined) {
                          _this.record.score++;
                      }
                  }
                  return result;
              };
          };
          Matcher.prototype.matchIdentifier = function (path, node) {
              var _this = this;
              this.tail = node;
              if (isValid(path[this.pos + 1]) && !node.after) {
                  if (this.stack.length) {
                      for (var i = this.stack.length - 1; i >= 0; i--) {
                          if (!this.stack[i].after || !this.stack[i].filter) {
                              return false;
                          }
                      }
                  }
                  else {
                      return false;
                  }
              }
              var current;
              var next = function () {
                  return _this.matchNext(node, path);
              };
              if (types_1.isExpandOperator(node.after)) {
                  current = this.recordMatch(function () {
                      return node.value === String(path[_this.pos]).substring(0, node.value.length);
                  });
              }
              else {
                  current = this.recordMatch(function () {
                      return utils_1.isEqual(String(node.value), String(path[_this.pos]));
                  });
              }
              if (this.excluding) {
                  if (node.after) {
                      if (this.pos < path.length) {
                          return current() && next();
                      }
                      else {
                          if (node.after && types_1.isWildcardOperator(node.after.after)) {
                              return true;
                          }
                          return false;
                      }
                  }
                  else {
                      if (this.pos >= path.length) {
                          return true;
                      }
                      return current();
                  }
              }
              return current() && next();
          };
          Matcher.prototype.matchIgnoreExpression = function (path, node) {
              return (utils_1.isEqual(node.value, this.currentElement(path)) &&
                  this.matchNext(node, path));
          };
          Matcher.prototype.matchDestructorExpression = function (path, node) {
              return (utils_1.isEqual(node.source, this.currentElement(path)) &&
                  this.matchNext(node, path));
          };
          Matcher.prototype.matchExpandOperator = function (path, node) {
              return this.matchAtom(path, node.after);
          };
          Matcher.prototype.matchWildcardOperator = function (path, node) {
              this.tail = node;
              this.stack.push(node);
              var matched = false;
              if (node.filter) {
                  if (node.after) {
                      matched =
                          this.matchAtom(path, node.filter) && this.matchAtom(path, node.after);
                  }
                  else {
                      matched = this.matchAtom(path, node.filter);
                  }
              }
              else {
                  matched = this.matchNext(node, path);
              }
              this.stack.pop();
              return matched;
          };
          Matcher.prototype.matchGroupExpression = function (path, node) {
              var _this = this;
              var current = this.pos;
              this.excluding = !!node.isExclude;
              var method = this.excluding ? 'every' : 'some';
              var result = utils_1.toArray(node.value)[method](function (_node) {
                  _this.pos = current;
                  return _this.excluding
                      ? !_this.matchAtom(path, _node)
                      : _this.matchAtom(path, _node);
              });
              this.excluding = false;
              return result;
          };
          Matcher.prototype.matchRangeExpression = function (path, node) {
              if (node.start) {
                  if (node.end) {
                      return (path[this.pos] >= parseInt(node.start.value) &&
                          path[this.pos] <= parseInt(node.end.value));
                  }
                  else {
                      return path[this.pos] >= parseInt(node.start.value);
                  }
              }
              else {
                  if (node.end) {
                      return path[this.pos] <= parseInt(node.end.value);
                  }
                  else {
                      return true;
                  }
              }
          };
          Matcher.prototype.matchDotOperator = function (path, node) {
              this.pos++;
              return this.matchNext(node, path);
          };
          Matcher.prototype.matchAtom = function (path, node) {
              if (!node) {
                  if (this.stack.length > 0)
                      return true;
                  if (isValid(path[this.pos + 1]))
                      return false;
                  if (this.pos == path.length - 1)
                      return true;
              }
              if (types_1.isIdentifier(node)) {
                  return this.matchIdentifier(path, node);
              }
              else if (types_1.isIgnoreExpression(node)) {
                  return this.matchIgnoreExpression(path, node);
              }
              else if (types_1.isDestructorExpression(node)) {
                  return this.matchDestructorExpression(path, node);
              }
              else if (types_1.isExpandOperator(node)) {
                  return this.matchExpandOperator(path, node);
              }
              else if (types_1.isWildcardOperator(node)) {
                  return this.matchWildcardOperator(path, node);
              }
              else if (types_1.isGroupExpression(node)) {
                  return this.matchGroupExpression(path, node);
              }
              else if (types_1.isRangeExpression(node)) {
                  return this.matchRangeExpression(path, node);
              }
              else if (types_1.isDotOperator(node)) {
                  return this.matchDotOperator(path, node);
              }
              return true;
          };
          Matcher.prototype.match = function (path) {
              var matched = this.matchAtom(path, this.tree);
              if (!this.tail)
                  return { matched: false };
              if (this.tail == this.tree && types_1.isWildcardOperator(this.tail)) {
                  return { matched: true };
              }
              return { matched: matched, record: this.record };
          };
          Matcher.matchSegments = function (source, target, record) {
              var pos = 0;
              if (source.length !== target.length)
                  return false;
              var match = function (pos) {
                  var current = function () {
                      var res = utils_1.isEqual(source[pos], target[pos]);
                      if (record && record.score !== undefined) {
                          record.score++;
                      }
                      return res;
                  };
                  var next = function () { return (pos < source.length - 1 ? match(pos + 1) : true); };
                  return current() && next();
              };
              return { matched: match(pos), record: record };
          };
          return Matcher;
      }());
      matcher.Matcher = Matcher;

      (function (exports) {
      var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
      }) : (function(o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          o[k2] = m[k];
      }));
      var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
          for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
      };
      var __spreadArrays = (commonjsGlobal && commonjsGlobal.__spreadArrays) || function () {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
              for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                  r[k] = a[j];
          return r;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Path = void 0;
      var parser_1 = parser;
      var utils_1 = utils;
      var destructor_1 = destructor;
      __exportStar(types, exports);
      var lru_1 = lru;
      var matcher_1 = matcher;
      var pathCache = new lru_1.LRUMap(1000);
      var isMatcher = Symbol('PATH_MATCHER');
      var isValid = function (val) { return val !== undefined && val !== null; };
      var arrayExist = function (obj, key) {
          if (Array.isArray(obj)) {
              var index = Number(key);
              if (index < 0 || index > obj.length - 1)
                  return false;
          }
          return true;
      };
      var getIn = function (segments, source) {
          for (var i = 0; i < segments.length; i++) {
              var index = segments[i];
              var rules = destructor_1.getDestructor(index);
              if (!rules) {
                  if (!isValid(source)) {
                      if (i !== segments.length - 1) {
                          return source;
                      }
                      break;
                  }
                  if (arrayExist(source, index)) {
                      source = source[index];
                  }
                  else {
                      return;
                  }
              }
              else {
                  source = destructor_1.getInByDestructor(source, rules, { setIn: setIn, getIn: getIn });
                  break;
              }
          }
          return source;
      };
      var setIn = function (segments, source, value) {
          for (var i = 0; i < segments.length; i++) {
              var index = segments[i];
              var rules = destructor_1.getDestructor(index);
              if (!rules) {
                  if (!isValid(source))
                      return;
                  if (!isValid(source[index])) {
                      if (!isValid(source[index]) && !isValid(value)) {
                          return;
                      }
                      if (utils_1.isNum(segments[i + 1])) {
                          source[index] = [];
                      }
                      else {
                          source[index] = {};
                      }
                  }
                  if (i === segments.length - 1) {
                      source[index] = value;
                  }
                  if (arrayExist(source, index)) {
                      source = source[index];
                  }
              }
              else {
                  destructor_1.setInByDestructor(source, rules, value, { setIn: setIn, getIn: getIn });
                  break;
              }
          }
      };
      var deleteIn = function (segments, source) {
          for (var i = 0; i < segments.length; i++) {
              var index = segments[i];
              var rules = destructor_1.getDestructor(index);
              if (!rules) {
                  if (i === segments.length - 1 && isValid(source)) {
                      if (utils_1.isArr(source)) {
                          source.splice(Number(index), 1);
                      }
                      else {
                          delete source[index];
                      }
                      return;
                  }
                  if (!isValid(source))
                      return;
                  if (arrayExist(source, index)) {
                      source = source[index];
                  }
                  else {
                      return;
                  }
                  if (!utils_1.isObj(source)) {
                      return;
                  }
              }
              else {
                  destructor_1.deleteInByDestructor(source, rules, {
                      setIn: setIn,
                      getIn: getIn,
                      deleteIn: deleteIn,
                  });
                  break;
              }
          }
      };
      var existIn = function (segments, source, start) {
          if (start instanceof Path) {
              start = start.length;
          }
          for (var i = start; i < segments.length; i++) {
              var index = segments[i];
              var rules = destructor_1.getDestructor(index);
              if (!rules) {
                  if (i === segments.length - 1) {
                      if (source && index in source) {
                          return true;
                      }
                      return false;
                  }
                  if (!isValid(source))
                      return false;
                  if (arrayExist(source, index)) {
                      source = source[index];
                  }
                  else {
                      return false;
                  }
                  if (!utils_1.isObj(source)) {
                      return false;
                  }
              }
              else {
                  return destructor_1.existInByDestructor(source, rules, start, {
                      setIn: setIn,
                      getIn: getIn,
                      deleteIn: deleteIn,
                      existIn: existIn,
                  });
              }
          }
      };
      var Path = (function () {
          function Path(input) {
              var _this = this;
              this.concat = function () {
                  var _a;
                  var args = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                      args[_i] = arguments[_i];
                  }
                  if (_this.isMatchPattern) {
                      throw new Error(_this.entire + " cannot be concat");
                  }
                  var path = new Path('');
                  path.segments = (_a = _this.segments).concat.apply(_a, args.map(function (s) { return _this.parseString(s); }));
                  path.entire = path.segments.join('.');
                  return path;
              };
              this.slice = function (start, end) {
                  if (_this.isMatchPattern) {
                      throw new Error(_this.entire + " cannot be slice");
                  }
                  var path = new Path('');
                  path.segments = _this.segments.slice(start, end);
                  path.entire = path.segments.join('.');
                  return path;
              };
              this.push = function (item) {
                  if (_this.isMatchPattern) {
                      throw new Error(_this.entire + " cannot be push");
                  }
                  _this.segments.push(_this.parseString(item));
                  _this.entire = _this.segments.join('.');
                  return _this;
              };
              this.pop = function () {
                  if (_this.isMatchPattern) {
                      throw new Error(_this.entire + " cannot be pop");
                  }
                  _this.segments.pop();
                  _this.entire = _this.segments.join('.');
              };
              this.splice = function (start, deleteCount) {
                  var _a;
                  var items = [];
                  for (var _i = 2; _i < arguments.length; _i++) {
                      items[_i - 2] = arguments[_i];
                  }
                  if (_this.isMatchPattern) {
                      throw new Error(_this.entire + " cannot be splice");
                  }
                  if (deleteCount === 0) {
                      items = items.map(function (item) { return _this.parseString(item); });
                  }
                  (_a = _this.segments).splice.apply(_a, __spreadArrays([start, deleteCount], items));
                  _this.entire = _this.segments.join('.');
                  return _this;
              };
              this.forEach = function (callback) {
                  if (_this.isMatchPattern) {
                      throw new Error(_this.entire + " cannot be each");
                  }
                  _this.segments.forEach(callback);
              };
              this.map = function (callback) {
                  if (_this.isMatchPattern) {
                      throw new Error(_this.entire + " cannot be map");
                  }
                  return _this.segments.map(callback);
              };
              this.reduce = function (callback, initial) {
                  if (_this.isMatchPattern) {
                      throw new Error(_this.entire + " cannot be reduce");
                  }
                  return _this.segments.reduce(callback, initial);
              };
              this.getNearestChildPathBy = function (target) {
                  var path = Path.parse(target);
                  if (path.length < _this.length)
                      return _this;
                  return _this.concat(path.segments[_this.length]);
              };
              this.parent = function () {
                  return _this.slice(0, _this.length - 1);
              };
              this.includes = function (pattern) {
                  var _a = Path.getPath(pattern), entire = _a.entire, segments = _a.segments, isMatchPattern = _a.isMatchPattern;
                  var cache = _this.includesCache.get(entire);
                  if (cache !== undefined)
                      return cache;
                  var cacheWith = function (value) {
                      _this.includesCache.set(entire, value);
                      return value;
                  };
                  if (_this.isMatchPattern) {
                      if (!isMatchPattern) {
                          return cacheWith(_this.match(segments));
                      }
                      else {
                          throw new Error(_this.entire + " cannot be used to match " + entire);
                      }
                  }
                  if (isMatchPattern) {
                      throw new Error(_this.entire + " cannot be used to match " + entire);
                  }
                  if (segments.length > _this.segments.length)
                      return cacheWith(false);
                  for (var i = 0; i < segments.length; i++) {
                      if (!utils_1.isEqual(String(segments[i]), String(_this.segments[i]))) {
                          return cacheWith(false);
                      }
                  }
                  return cacheWith(true);
              };
              this.transform = function (regexp, callback) {
                  if (!utils_1.isFn(callback))
                      return '';
                  if (_this.isMatchPattern) {
                      throw new Error(_this.entire + " cannot be transformed");
                  }
                  var args = _this.segments.reduce(function (buf, key) {
                      return new RegExp(regexp).test(key) ? buf.concat(key) : buf;
                  }, []);
                  return callback.apply(void 0, args);
              };
              this.match = function (pattern) {
                  var path = Path.getPath(pattern);
                  var cache = _this.matchCache.get(path.entire);
                  if (cache !== undefined) {
                      if (cache.record && cache.record.score !== undefined) {
                          _this.matchScore = cache.record.score;
                      }
                      return cache.matched;
                  }
                  var cacheWith = function (value) {
                      _this.matchCache.set(path.entire, value);
                      return value;
                  };
                  if (path.isMatchPattern) {
                      if (_this.isMatchPattern) {
                          throw new Error(path.entire + " cannot match " + _this.entire);
                      }
                      else {
                          _this.matchScore = 0;
                          return cacheWith(path.match(_this.segments));
                      }
                  }
                  else {
                      if (_this.isMatchPattern) {
                          var record = {
                              score: 0,
                          };
                          var result = cacheWith(new matcher_1.Matcher(_this.tree, record).match(path.segments));
                          _this.matchScore = record.score;
                          return result.matched;
                      }
                      else {
                          var record = {
                              score: 0,
                          };
                          var result = cacheWith(matcher_1.Matcher.matchSegments(_this.segments, path.segments, record));
                          _this.matchScore = record.score;
                          return result.matched;
                      }
                  }
              };
              this.matchAliasGroup = function (name, alias) {
                  var namePath = Path.parse(name);
                  var aliasPath = Path.parse(alias);
                  var nameMatched = _this.match(namePath);
                  var nameMatchedScore = _this.matchScore;
                  var aliasMatched = _this.match(aliasPath);
                  var aliasMatchedScore = _this.matchScore;
                  if (_this.haveExcludePattern) {
                      if (nameMatchedScore >= aliasMatchedScore) {
                          return nameMatched;
                      }
                      else {
                          return aliasMatched;
                      }
                  }
                  else {
                      return nameMatched || aliasMatched;
                  }
              };
              this.existIn = function (source, start) {
                  if (start === void 0) { start = 0; }
                  return existIn(_this.segments, source, start);
              };
              this.getIn = function (source) {
                  return getIn(_this.segments, source);
              };
              this.setIn = function (source, value) {
                  setIn(_this.segments, source, value);
                  return source;
              };
              this.deleteIn = function (source) {
                  deleteIn(_this.segments, source);
                  return source;
              };
              var _a = this.parse(input), tree = _a.tree, segments = _a.segments, entire = _a.entire, isMatchPattern = _a.isMatchPattern, isWildMatchPattern = _a.isWildMatchPattern, haveExcludePattern = _a.haveExcludePattern;
              this.entire = entire;
              this.segments = segments;
              this.isMatchPattern = isMatchPattern;
              this.isWildMatchPattern = isWildMatchPattern;
              this.haveExcludePattern = haveExcludePattern;
              this.tree = tree;
              this.matchCache = new lru_1.LRUMap(200);
              this.includesCache = new lru_1.LRUMap(200);
          }
          Path.prototype.toString = function () {
              return this.entire;
          };
          Path.prototype.toArray = function () {
              return this.segments;
          };
          Object.defineProperty(Path.prototype, "length", {
              get: function () {
                  return this.segments.length;
              },
              enumerable: false,
              configurable: true
          });
          Path.prototype.parse = function (pattern) {
              var _this = this;
              if (pattern instanceof Path) {
                  return {
                      entire: pattern.entire,
                      segments: pattern.segments.slice(),
                      isWildMatchPattern: pattern.isWildMatchPattern,
                      isMatchPattern: pattern.isMatchPattern,
                      haveExcludePattern: pattern.haveExcludePattern,
                      tree: pattern.tree,
                  };
              }
              else if (utils_1.isStr(pattern)) {
                  if (!pattern)
                      return {
                          entire: '',
                          segments: [],
                          isWildMatchPattern: false,
                          haveExcludePattern: false,
                          isMatchPattern: false,
                      };
                  var parser = new parser_1.Parser(pattern);
                  var tree = parser.parse();
                  if (!parser.isMatchPattern) {
                      var segments = parser.data.segments;
                      return {
                          entire: segments.join('.'),
                          segments: segments,
                          tree: tree,
                          isWildMatchPattern: false,
                          haveExcludePattern: false,
                          isMatchPattern: false,
                      };
                  }
                  else {
                      return {
                          entire: pattern,
                          segments: [],
                          isWildMatchPattern: parser.isWildMatchPattern,
                          haveExcludePattern: parser.haveExcludePattern,
                          isMatchPattern: true,
                          tree: tree,
                      };
                  }
              }
              else if (utils_1.isFn(pattern) && pattern[isMatcher]) {
                  return this.parse(pattern['path']);
              }
              else if (utils_1.isArr(pattern)) {
                  return {
                      entire: pattern.join('.'),
                      segments: pattern.reduce(function (buf, key) {
                          return buf.concat(_this.parseString(key));
                      }, []),
                      isWildMatchPattern: false,
                      haveExcludePattern: false,
                      isMatchPattern: false,
                  };
              }
              else {
                  return {
                      entire: '',
                      segments: pattern !== undefined ? [pattern] : [],
                      isWildMatchPattern: false,
                      haveExcludePattern: false,
                      isMatchPattern: false,
                  };
              }
          };
          Path.prototype.parseString = function (source) {
              if (utils_1.isStr(source)) {
                  source = source.replace(/\s*/g, '');
                  try {
                      var _a = this.parse(source), segments = _a.segments, isMatchPattern = _a.isMatchPattern;
                      return !isMatchPattern ? segments : source;
                  }
                  catch (e) {
                      return source;
                  }
              }
              else if (source instanceof Path) {
                  return source.segments;
              }
              return source;
          };
          Path.match = function (pattern) {
              var path = Path.getPath(pattern);
              var matcher = function (target) {
                  return path.match(target);
              };
              matcher[isMatcher] = true;
              matcher.path = path;
              return matcher;
          };
          Path.transform = function (pattern, regexp, callback) {
              return Path.getPath(pattern).transform(regexp, callback);
          };
          Path.parse = function (path) {
              if (path === void 0) { path = ''; }
              return Path.getPath(path);
          };
          Path.getPath = function (path) {
              if (path === void 0) { path = ''; }
              if (path instanceof Path) {
                  var found = pathCache.get(path.entire);
                  if (found) {
                      return found;
                  }
                  else {
                      pathCache.set(path.entire, path);
                      return path;
                  }
              }
              else if (path && path[isMatcher]) {
                  return Path.getPath(path['path']);
              }
              else {
                  var key = path.toString();
                  var found = pathCache.get(key);
                  if (found) {
                      return found;
                  }
                  else {
                      path = new Path(path);
                      pathCache.set(key, path);
                      return path;
                  }
              }
          };
          Path.getIn = function (source, pattern) {
              var path = Path.getPath(pattern);
              return path.getIn(source);
          };
          Path.setIn = function (source, pattern, value) {
              var path = Path.getPath(pattern);
              return path.setIn(source, value);
          };
          Path.deleteIn = function (source, pattern) {
              var path = Path.getPath(pattern);
              return path.deleteIn(source);
          };
          Path.existIn = function (source, pattern, start) {
              var path = Path.getPath(pattern);
              return path.existIn(source, start);
          };
          return Path;
      }());
      exports.Path = Path;
      exports.default = Path;
      }(lib));

      var index = exports('FormPath', /*@__PURE__*/getDefaultExportFromCjs(lib));

      const caches = {};
      function deprecate(method, message, help) {
        if (isFn(method)) {
          return function(p1, p2, p3, p4, p5) {
            deprecate(message, help);
            return method.apply(this, arguments);
          };
        }
        if (isStr(method) && !caches[method]) {
          caches[method] = true;
          console.warn(new Error(`${method} has been deprecated. Do not continue to use this api.${message || ""}`));
        }
      }

      class Subscribable {
        constructor() {
          this.subscribers = {
            index: 0
          };
          this.subscribe = (callback) => {
            if (isFn(callback)) {
              const index = this.subscribers.index + 1;
              this.subscribers[index] = callback;
              this.subscribers.index++;
              return index;
            }
          };
          this.unsubscribe = (index) => {
            if (this.subscribers[index]) {
              delete this.subscribers[index];
            }
          };
          this.notify = (payload, silent) => {
            if (this.subscription) {
              if (this.subscription && isFn(this.subscription.notify)) {
                if (this.subscription.notify.call(this, payload) === false) {
                  return;
                }
              }
            }
            if (silent)
              return;
            const filter = (payload2) => {
              if (this.subscription && isFn(this.subscription.filter)) {
                return this.subscription.filter.call(this, payload2);
              }
              return payload2;
            };
            each(this.subscribers, (callback) => {
              if (isFn(callback))
                callback(filter(payload));
            });
          };
        }
      } exports('Subscribable', Subscribable);

      function defaultIsMergeableObject(value) {
        return isNonNullObject(value) && !isSpecial(value);
      }
      function isNonNullObject(value) {
        return !!value && typeof value === "object";
      }
      function isSpecial(value) {
        const stringValue = Object.prototype.toString.call(value);
        return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
      }
      const canUseSymbol = typeof Symbol === "function" && Symbol.for;
      const REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for("react.element") : 60103;
      function isReactElement(value) {
        return value.$$typeof === REACT_ELEMENT_TYPE;
      }
      function emptyTarget(val) {
        return Array.isArray(val) ? [] : {};
      }
      function cloneUnlessOtherwiseSpecified(value, options) {
        if (options.clone !== false && options.isMergeableObject(value)) {
          if (BigData.isBigData(value)) {
            return BigData.clone(value);
          } else {
            return deepmerge(emptyTarget(value), value, options);
          }
        }
        return value;
      }
      function defaultArrayMerge(target, source, options) {
        return target.concat(source).map(function(element) {
          return cloneUnlessOtherwiseSpecified(element, options);
        });
      }
      function getMergeFunction(key, options) {
        if (!options.customMerge) {
          return deepmerge;
        }
        const customMerge = options.customMerge(key);
        return typeof customMerge === "function" ? customMerge : deepmerge;
      }
      function getEnumerableOwnPropertySymbols(target) {
        return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
          return target.propertyIsEnumerable(symbol);
        }) : [];
      }
      function getKeys(target) {
        if (!isValid$1(target))
          return [];
        return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
      }
      function propertyIsOnObject(object, property) {
        try {
          return property in object;
        } catch (_) {
          return false;
        }
      }
      function propertyIsUnsafe(target, key) {
        return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
      }
      function mergeObject(target, source, options) {
        const destination = options.assign ? target || {} : {};
        if (!options.isMergeableObject(target))
          return target;
        if (!options.assign) {
          getKeys(target).forEach(function(key) {
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
          });
        }
        getKeys(source).forEach(function(key) {
          if (propertyIsUnsafe(target, key)) {
            return;
          }
          if (!target[key]) {
            destination[key] = source[key];
          }
          if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
          } else {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
          }
        });
        return destination;
      }
      function deepmerge(target, source, options) {
        options = options || {};
        options.arrayMerge = options.arrayMerge || defaultArrayMerge;
        options.isMergeableObject = options.isMergeableObject || defaultIsMergeableObject;
        options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
        const sourceIsArray = Array.isArray(source);
        const targetIsArray = Array.isArray(target);
        const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
        if (!sourceAndTargetTypesMatch) {
          return cloneUnlessOtherwiseSpecified(source, options);
        } else if (sourceIsArray) {
          return options.arrayMerge(target, source, options);
        } else {
          return mergeObject(target, source, options);
        }
      }
      function deepmergeAll(array, options) {
        if (!Array.isArray(array)) {
          throw new Error("first argument should be an array");
        }
        return array.reduce(function(prev, next) {
          return deepmerge(prev, next, options);
        }, {});
      }
      deepmerge.all = deepmergeAll;
      const merge = exports('merge', deepmerge);

      var scheduler$1 = {exports: {}};

      var scheduler_production_min = {};

      /** @license React v0.19.1
       * scheduler.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      (function (exports) {
      var f,g,h,k,l;
      if("undefined"===typeof window||"function"!==typeof MessageChannel){var p=null,q=null,t=function(){if(null!==p)try{var a=exports.unstable_now();p(!0,a);p=null;}catch(b){throw setTimeout(t,0),b;}},u=Date.now();exports.unstable_now=function(){return Date.now()-u};f=function(a){null!==p?setTimeout(f,0,a):(p=a,setTimeout(t,0));};g=function(a,b){q=setTimeout(a,b);};h=function(){clearTimeout(q);};k=function(){return !1};l=exports.unstable_forceFrameRate=function(){};}else {var w=window.performance,x=window.Date,
      y=window.setTimeout,z=window.clearTimeout;if("undefined"!==typeof console){var A=window.cancelAnimationFrame;"function"!==typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills");"function"!==typeof A&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills");}if("object"===
      typeof w&&"function"===typeof w.now)exports.unstable_now=function(){return w.now()};else {var B=x.now();exports.unstable_now=function(){return x.now()-B};}var C=!1,D=null,E=-1,F=5,G=0;k=function(){return exports.unstable_now()>=G};l=function(){};exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing framerates higher than 125 fps is not unsupported"):F=0<a?Math.floor(1E3/a):5;};var H=new MessageChannel,I=H.port2;H.port1.onmessage=
      function(){if(null!==D){var a=exports.unstable_now();G=a+F;try{D(!0,a)?I.postMessage(null):(C=!1,D=null);}catch(b){throw I.postMessage(null),b;}}else C=!1;};f=function(a){D=a;C||(C=!0,I.postMessage(null));};g=function(a,b){E=y(function(){a(exports.unstable_now());},b);};h=function(){z(E);E=-1;};}function J(a,b){var c=a.length;a.push(b);a:for(;;){var d=c-1>>>1,e=a[d];if(void 0!==e&&0<K(e,b))a[d]=b,a[c]=e,c=d;else break a}}function L(a){a=a[0];return void 0===a?null:a}
      function M(a){var b=a[0];if(void 0!==b){var c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length;d<e;){var m=2*(d+1)-1,n=a[m],v=m+1,r=a[v];if(void 0!==n&&0>K(n,c))void 0!==r&&0>K(r,n)?(a[d]=r,a[v]=c,d=v):(a[d]=n,a[m]=c,d=m);else if(void 0!==r&&0>K(r,c))a[d]=r,a[v]=c,d=v;else break a}}return b}return null}function K(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}var N=[],O=[],P=1,Q=null,R=3,S=!1,T=!1,U=!1;
      function V(a){for(var b=L(O);null!==b;){if(null===b.callback)M(O);else if(b.startTime<=a)M(O),b.sortIndex=b.expirationTime,J(N,b);else break;b=L(O);}}function W(a){U=!1;V(a);if(!T)if(null!==L(N))T=!0,f(X);else {var b=L(O);null!==b&&g(W,b.startTime-a);}}
      function X(a,b){T=!1;U&&(U=!1,h());S=!0;var c=R;try{V(b);for(Q=L(N);null!==Q&&(!(Q.expirationTime>b)||a&&!k());){var d=Q.callback;if(null!==d){Q.callback=null;R=Q.priorityLevel;var e=d(Q.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?Q.callback=e:Q===L(N)&&M(N);V(b);}else M(N);Q=L(N);}if(null!==Q)var m=!0;else {var n=L(O);null!==n&&g(W,n.startTime-b);m=!1;}return m}finally{Q=null,R=c,S=!1;}}
      function Y(a){switch(a){case 1:return -1;case 2:return 250;case 5:return 1073741823;case 4:return 1E4;default:return 5E3}}var Z=l;exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null;};exports.unstable_continueExecution=function(){T||S||(T=!0,f(X));};
      exports.unstable_getCurrentPriorityLevel=function(){return R};exports.unstable_getFirstCallbackNode=function(){return L(N)};exports.unstable_next=function(a){switch(R){case 1:case 2:case 3:var b=3;break;default:b=R;}var c=R;R=b;try{return a()}finally{R=c;}};exports.unstable_pauseExecution=function(){};exports.unstable_requestPaint=Z;exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3;}var c=R;R=a;try{return b()}finally{R=c;}};
      exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();if("object"===typeof c&&null!==c){var e=c.delay;e="number"===typeof e&&0<e?d+e:d;c="number"===typeof c.timeout?c.timeout:Y(a);}else c=Y(a),e=d;c=e+c;a={id:P++,callback:b,priorityLevel:a,startTime:e,expirationTime:c,sortIndex:-1};e>d?(a.sortIndex=e,J(O,a),null===L(N)&&a===L(O)&&(U?h():U=!0,g(W,e-d))):(a.sortIndex=c,J(N,a),T||S||(T=!0,f(X)));return a};
      exports.unstable_shouldYield=function(){var a=exports.unstable_now();V(a);var b=L(N);return b!==Q&&null!==Q&&null!==b&&null!==b.callback&&b.startTime<=a&&b.expirationTime<Q.expirationTime||k()};exports.unstable_wrapCallback=function(a){var b=R;return function(){var c=R;R=b;try{return a.apply(this,arguments)}finally{R=c;}}};
      }(scheduler_production_min));

      {
        scheduler$1.exports = scheduler_production_min;
      }

      const scheduler = exports('scheduler', {
        applyWithIdlePriority(callback) {
          scheduler$1.exports.unstable_scheduleCallback(scheduler$1.exports.unstable_IdlePriority, callback);
        },
        applyWithLowPriority(callback) {
          scheduler$1.exports.unstable_scheduleCallback(scheduler$1.exports.unstable_LowPriority, callback);
        },
        applyWidthNormalPriority(callback) {
          scheduler$1.exports.unstable_scheduleCallback(scheduler$1.exports.unstable_NormalPriority, callback);
        }
      });

      const isUnNormalObject = (value) => {
        if ((value == null ? void 0 : value._owner) || (value == null ? void 0 : value.$$typeof)) {
          return true;
        }
        if ((value == null ? void 0 : value._isAMomentObject) || (value == null ? void 0 : value._isJSONSchemaObject)) {
          return true;
        }
        if ((value == null ? void 0 : value.toJS) || (value == null ? void 0 : value.toJSON)) {
          return true;
        }
      };
      const isPlainValue = (val) => {
        if (isUnNormalObject(val)) {
          return false;
        }
        if (BigData.isBigData(val)) {
          return false;
        }
        return isPlainObj(val) || isArr(val);
      };
      const defaults = exports('defaults', (defaults_, targets) => {
        if (getType(defaults_) !== getType(targets) || !isPlainValue(defaults_) || !isPlainValue(targets)) {
          return isValid$1(targets) ? targets : defaults_;
        } else {
          const results = isPlainObj(defaults_) ? {} : [];
          each(targets, (value, key) => {
            results[key] = defaults(defaults_[key], value);
          });
          each(defaults_, (value, key) => {
            if (!isValid$1(results[key])) {
              results[key] = value;
            }
          });
          return results;
        }
      });

      var TYPE_STRING;
      (function(TYPE_STRING2) {
        TYPE_STRING2["UNDEFINED"] = "undefined";
      })(TYPE_STRING || (TYPE_STRING = {}));
      var CONSOLE_METHODS;
      (function(CONSOLE_METHODS2) {
        CONSOLE_METHODS2["DEBUG"] = "debug";
        CONSOLE_METHODS2["ERROR"] = "error";
        CONSOLE_METHODS2["INFO"] = "info";
        CONSOLE_METHODS2["LOG"] = "log";
        CONSOLE_METHODS2["WARN"] = "warn";
        CONSOLE_METHODS2["DIR"] = "dir";
        CONSOLE_METHODS2["DIRXML"] = "dirxml";
        CONSOLE_METHODS2["TABLE"] = "table";
        CONSOLE_METHODS2["TRACE"] = "trace";
        CONSOLE_METHODS2["GROUP"] = "group";
        CONSOLE_METHODS2["GROUPCOLLAPSED"] = "groupCollapsed";
        CONSOLE_METHODS2["GROUPEND"] = "groupEnd";
        CONSOLE_METHODS2["CLEAR"] = "clear";
        CONSOLE_METHODS2["COUNT"] = "count";
        CONSOLE_METHODS2["COUNTRESET"] = "countReset";
        CONSOLE_METHODS2["ASSERT"] = "assert";
        CONSOLE_METHODS2["PROFILE"] = "profile";
        CONSOLE_METHODS2["PROFILEEND"] = "profileEnd";
        CONSOLE_METHODS2["TIME"] = "time";
        CONSOLE_METHODS2["TIMELOG"] = "timeLog";
        CONSOLE_METHODS2["TIMEEND"] = "timeEnd";
        CONSOLE_METHODS2["TIMESTAMP"] = "timeStamp";
        CONSOLE_METHODS2["CONTEXT"] = "context";
        CONSOLE_METHODS2["MEMORY"] = "memory";
        CONSOLE_METHODS2["TIPS"] = "tips";
      })(CONSOLE_METHODS || (CONSOLE_METHODS = {}));
      class Log {
        constructor(keyword, methods) {
          this.keyword = "APP";
          this.defaultMethods = [
            CONSOLE_METHODS.LOG,
            CONSOLE_METHODS.ERROR,
            CONSOLE_METHODS.WARN
          ];
          this.disabled = true;
          this.methods = [];
          this.keyword = keyword;
          this.methods = methods;
          this.initConsole();
        }
        initConsole() {
          const hasConsole = typeof console === TYPE_STRING.UNDEFINED;
          this.disabled = hasConsole;
          this.methods.forEach((name) => {
            if (this.defaultMethods.indexOf(name) > -1)
              return;
            this[name] = this.wrap(name);
          });
        }
        wrap(name) {
          return (content) => {
            this.callConsole(name, content);
          };
        }
        getKeyWordStyle(name) {
          return `[ ${this.keyword} ${name} ]: `;
        }
        callConsole(name, content, tips) {
          const logData = { content, keyword: this.keyword };
          if (this.disabled) {
            logData.content = void 0;
            if (tips) {
              logData.tips = void 0;
            }
            return logData;
          }
          const Console = console;
          const keyword = this.getKeyWordStyle(name);
          Console[name] && Console[name](keyword, content);
          if (tips) {
            logData.tips = tips;
            Console.info(this.getKeyWordStyle(CONSOLE_METHODS.TIPS), tips);
          }
          return logData;
        }
        log(content) {
          return this.callConsole(CONSOLE_METHODS.LOG, content);
        }
        warn(content, tips) {
          return this.callConsole(CONSOLE_METHODS.WARN, content, tips);
        }
        error(content, tips) {
          return this.callConsole(CONSOLE_METHODS.ERROR, content, tips);
        }
        info(content) {
          return this.callConsole(CONSOLE_METHODS.INFO, content);
        }
        close() {
          this.disabled = true;
        }
        open() {
          this.initConsole();
        }
      }
      const log = exports('log', new Log("Formily", []));

      let IDX = 36, HEX = "";
      while (IDX--)
        HEX += IDX.toString(36);
      function uid(len) {
        let str = "", num = len || 11;
        while (num--)
          str += HEX[Math.random() * 36 | 0];
        return str;
      }

      exports('FormPathPattern', lib.Pattern);

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLjEuMy4xMy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3R5cGVzLnRzIiwiLi4vc3JjL2FycmF5LnRzIiwiLi4vc3JjL2dsb2JhbC50cyIsIi4uL3NyYy9pbnN0YW5jZW9mLnRzIiwiLi4vc3JjL2JpZy1kYXRhLnRzIiwiLi4vc3JjL2NvbXBhcmUudHMiLCIuLi9zcmMvY2xvbmUudHMiLCIuLi9zcmMvaXNFbXB0eS50cyIsIi4uL25vZGVfbW9kdWxlcy91cHBlci1jYXNlL3VwcGVyLWNhc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvbG93ZXItY2FzZS9sb3dlci1jYXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL25vLWNhc2UvdmVuZG9yL25vbi13b3JkLXJlZ2V4cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9uby1jYXNlL3ZlbmRvci9jYW1lbC1jYXNlLXJlZ2V4cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9uby1jYXNlL3ZlbmRvci9jYW1lbC1jYXNlLXVwcGVyLXJlZ2V4cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9uby1jYXNlL25vLWNhc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvY2FtZWwtY2FzZS9jYW1lbC1jYXNlLmpzIiwiLi4vc3JjL3N0cmluZy50cyIsIi4uL25vZGVfbW9kdWxlcy9jb29sLXBhdGgvbGliL2NvbnRleHRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvdG9rZW5zLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvdG9rZW5pemVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvdHlwZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi91dGlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb29sLXBhdGgvbGliL2Rlc3RydWN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi9wYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi9scnUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi9tYXRjaGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvaW5kZXguanMiLCIuLi9zcmMvZGVwcmVjYXRlLnRzIiwiLi4vc3JjL3N1YnNjcmliYWJsZS50cyIsIi4uL3NyYy9tZXJnZS50cyIsIi4uL25vZGVfbW9kdWxlcy9zY2hlZHVsZXIvY2pzL3NjaGVkdWxlci5wcm9kdWN0aW9uLm1pbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9zY2hlZHVsZXIvaW5kZXguanMiLCIuLi9zcmMvc2NoZWR1bGVyLnRzIiwiLi4vc3JjL2RlZmF1bHRzLnRzIiwiLi4vc3JjL2xvZy50cyIsIi4uL3NyYy91aWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaXNUeXBlID0gPFQ+KHR5cGU6IHN0cmluZyB8IHN0cmluZ1tdKSA9PiAob2JqOiB1bmtub3duKTogb2JqIGlzIFQgPT5cbiAgb2JqICE9IG51bGwgJiZcbiAgKEFycmF5LmlzQXJyYXkodHlwZSkgPyB0eXBlIDogW3R5cGVdKS5zb21lKFxuICAgIHQgPT4gZ2V0VHlwZShvYmopID09PSBgW29iamVjdCAke3R9XWBcbiAgKVxuZXhwb3J0IGNvbnN0IGdldFR5cGUgPSAob2JqOiBhbnkpID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopXG5leHBvcnQgY29uc3QgaXNGbiA9IGlzVHlwZTwoLi4uYXJnczogYW55W10pID0+IGFueT4oW1xuICAnRnVuY3Rpb24nLFxuICAnQXN5bmNGdW5jdGlvbicsXG4gICdHZW5lcmF0b3JGdW5jdGlvbidcbl0pXG5leHBvcnQgY29uc3QgaXNBcnIgPSBBcnJheS5pc0FycmF5XG5leHBvcnQgY29uc3QgaXNQbGFpbk9iaiA9IGlzVHlwZTxvYmplY3Q+KCdPYmplY3QnKVxuZXhwb3J0IGNvbnN0IGlzU3RyID0gaXNUeXBlPHN0cmluZz4oJ1N0cmluZycpXG5leHBvcnQgY29uc3QgaXNCb29sID0gaXNUeXBlPGJvb2xlYW4+KCdCb29sZWFuJylcbmV4cG9ydCBjb25zdCBpc051bSA9IGlzVHlwZTxudW1iZXI+KCdOdW1iZXInKVxuZXhwb3J0IGNvbnN0IGlzT2JqID0gKHZhbDogdW5rbm93bik6IHZhbCBpcyBvYmplY3QgPT4gdHlwZW9mIHZhbCA9PT0gJ29iamVjdCdcbmV4cG9ydCBjb25zdCBpc1JlZ0V4cCA9IGlzVHlwZTxSZWdFeHA+KCdSZWdFeHAnKVxuXG5leHBvcnQgdHlwZSBTdWJzY3JpYmVyPFM+ID0gKHBheWxvYWQ6IFMpID0+IHZvaWRcblxuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb248Uz4ge1xuICBub3RpZnk/OiAocGF5bG9hZDogUykgPT4gdm9pZCB8IGJvb2xlYW5cbiAgZmlsdGVyPzogKHBheWxvYWQ6IFMpID0+IGFueVxufVxuIiwiaW1wb3J0IHsgaXNBcnIsIGlzT2JqLCBpc1N0ciB9IGZyb20gJy4vdHlwZXMnXG5cbnR5cGUgRWFjaEFycmF5SXRlcmF0b3I8VD4gPSAoY3VycmVudFZhbHVlOiBULCBrZXk6IG51bWJlcikgPT4gdm9pZCB8IGJvb2xlYW5cbnR5cGUgRWFjaFN0cmluZ0l0ZXJhdG9yID0gKGN1cnJlbnRWYWx1ZTogc3RyaW5nLCBrZXk6IG51bWJlcikgPT4gdm9pZCB8IGJvb2xlYW5cbnR5cGUgRWFjaE9iamVjdEl0ZXJhdG9yPFQgPSBhbnk+ID0gKFxuICBjdXJyZW50VmFsdWU6IFQsXG4gIGtleTogc3RyaW5nXG4pID0+IHZvaWQgfCBib29sZWFuXG50eXBlIE1hcEFycmF5SXRlcmF0b3I8VEl0ZW0sIFRSZXN1bHQ+ID0gKFxuICBjdXJyZW50VmFsdWU6IFRJdGVtLFxuICBrZXk6IG51bWJlclxuKSA9PiBUUmVzdWx0XG50eXBlIE1hcFN0cmluZ0l0ZXJhdG9yPFRSZXN1bHQ+ID0gKGN1cnJlbnRWYWx1ZTogc3RyaW5nLCBrZXk6IG51bWJlcikgPT4gVFJlc3VsdFxudHlwZSBNYXBPYmplY3RJdGVyYXRvcjxUSXRlbSwgVFJlc3VsdD4gPSAoXG4gIGN1cnJlbnRWYWx1ZTogVEl0ZW0sXG4gIGtleTogc3RyaW5nXG4pID0+IFRSZXN1bHRcbnR5cGUgTWVtb0FycmF5SXRlcmF0b3I8VCwgVT4gPSAoXG4gIHByZXZpb3VzVmFsdWU6IFUsXG4gIGN1cnJlbnRWYWx1ZTogVCxcbiAga2V5OiBudW1iZXJcbikgPT4gVVxudHlwZSBNZW1vU3RyaW5nSXRlcmF0b3I8VD4gPSAoXG4gIHByZXZpb3VzVmFsdWU6IFQsXG4gIGN1cnJlbnRWYWx1ZTogc3RyaW5nLFxuICBrZXk6IG51bWJlclxuKSA9PiBUXG50eXBlIE1lbW9PYmplY3RJdGVyYXRvcjxUVmFsdWUsIFRSZXN1bHQ+ID0gKFxuICBwcmV2aW91c1ZhbHVlOiBUUmVzdWx0LFxuICBjdXJyZW50VmFsdWU6IFRWYWx1ZSxcbiAga2V5OiBzdHJpbmdcbikgPT4gVFJlc3VsdFxuXG5leHBvcnQgY29uc3QgdG9BcnIgPSAodmFsOiBhbnkpOiBhbnlbXSA9PiAoaXNBcnIodmFsKSA/IHZhbCA6IHZhbCA/IFt2YWxdIDogW10pXG5leHBvcnQgZnVuY3Rpb24gZWFjaChcbiAgdmFsOiBzdHJpbmcsXG4gIGl0ZXJhdG9yOiBFYWNoU3RyaW5nSXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IHZvaWRcbmV4cG9ydCBmdW5jdGlvbiBlYWNoPFQ+KFxuICB2YWw6IFRbXSxcbiAgaXRlcmF0b3I6IEVhY2hBcnJheUl0ZXJhdG9yPFQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiB2b2lkXG5leHBvcnQgZnVuY3Rpb24gZWFjaDxUIGV4dGVuZHMge30sIFRWYWx1ZT4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IEVhY2hPYmplY3RJdGVyYXRvcjxUVmFsdWU+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiB2b2lkXG5leHBvcnQgZnVuY3Rpb24gZWFjaCh2YWw6IGFueSwgaXRlcmF0b3I6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbik6IHZvaWQge1xuICBpZiAoaXNBcnIodmFsKSB8fCBpc1N0cih2YWwpKSB7XG4gICAgaWYgKHJldmVydCkge1xuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gdmFsLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChpdGVyYXRvcih2YWxbaV0sIGkpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvcih2YWxbaV0sIGkpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqKHZhbCkpIHtcbiAgICBsZXQga2V5OiBzdHJpbmdcbiAgICBmb3IgKGtleSBpbiB2YWwpIHtcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh2YWwsIGtleSkpIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yKHZhbFtrZXldLCBrZXkpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXA8VD4oXG4gIHZhbDogc3RyaW5nLFxuICBpdGVyYXRvcjogTWFwU3RyaW5nSXRlcmF0b3I8VD4sXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGFueVxuZXhwb3J0IGZ1bmN0aW9uIG1hcDxUSXRlbSwgVFJlc3VsdD4oXG4gIHZhbDogVEl0ZW1bXSxcbiAgaXRlcmF0b3I6IE1hcEFycmF5SXRlcmF0b3I8VEl0ZW0sIFRSZXN1bHQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBhbnlcbmV4cG9ydCBmdW5jdGlvbiBtYXA8VCBleHRlbmRzIHt9LCBUUmVzdWx0PihcbiAgdmFsOiBULFxuICBpdGVyYXRvcjogTWFwT2JqZWN0SXRlcmF0b3I8VFtrZXlvZiBUXSwgVFJlc3VsdD4sXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGFueVxuZXhwb3J0IGZ1bmN0aW9uIG1hcCh2YWw6IGFueSwgaXRlcmF0b3I6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbik6IGFueSB7XG4gIGNvbnN0IHJlcyA9IGlzQXJyKHZhbCkgfHwgaXNTdHIodmFsKSA/IFtdIDoge31cbiAgZWFjaChcbiAgICB2YWwsXG4gICAgKGl0ZW0sIGtleSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBpdGVyYXRvcihpdGVtLCBrZXkpXG4gICAgICBpZiAoaXNBcnIocmVzKSkge1xuICAgICAgICA7KHJlcyBhcyBhbnkpLnB1c2godmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNba2V5XSA9IHZhbHVlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXZlcnRcbiAgKVxuICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2U8VCwgVT4oXG4gIHZhbDogVFtdLFxuICBpdGVyYXRvcjogTWVtb0FycmF5SXRlcmF0b3I8VCwgVT4sXG4gIGFjY3VtdWxhdG9yPzogVSxcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogVVxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZTxUPihcbiAgdmFsOiBzdHJpbmcsXG4gIGl0ZXJhdG9yOiBNZW1vU3RyaW5nSXRlcmF0b3I8VD4sXG4gIGFjY3VtdWxhdG9yPzogVCxcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogVFxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZTxUIGV4dGVuZHMge30sIFRWYWx1ZSwgVFJlc3VsdCA9IGFueT4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IE1lbW9PYmplY3RJdGVyYXRvcjxUVmFsdWUsIFRSZXN1bHQ+LFxuICBhY2N1bXVsYXRvcj86IFRSZXN1bHQsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IFRSZXN1bHRcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2UoXG4gIHZhbDogYW55LFxuICBpdGVyYXRvcjogYW55LFxuICBhY2N1bXVsYXRvcj86IGFueSxcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogYW55IHtcbiAgbGV0IHJlc3VsdCA9IGFjY3VtdWxhdG9yXG4gIGVhY2goXG4gICAgdmFsLFxuICAgIChpdGVtLCBrZXkpID0+IHtcbiAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yKHJlc3VsdCwgaXRlbSwga2V5KVxuICAgIH0sXG4gICAgcmV2ZXJ0XG4gIClcbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXZlcnk8VCBleHRlbmRzIHN0cmluZz4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IEVhY2hTdHJpbmdJdGVyYXRvcixcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogYm9vbGVhblxuZXhwb3J0IGZ1bmN0aW9uIGV2ZXJ5PFQ+KFxuICB2YWw6IFRbXSxcbiAgaXRlcmF0b3I6IEVhY2hBcnJheUl0ZXJhdG9yPFQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBib29sZWFuXG5leHBvcnQgZnVuY3Rpb24gZXZlcnk8VCBleHRlbmRzIHt9LCBUVmFsdWU+KFxuICB2YWw6IFQsXG4gIGl0ZXJhdG9yOiBFYWNoT2JqZWN0SXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGJvb2xlYW5cbmV4cG9ydCBmdW5jdGlvbiBldmVyeSh2YWw6IGFueSwgaXRlcmF0b3I6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICBsZXQgcmVzID0gdHJ1ZVxuICBlYWNoKFxuICAgIHZhbCxcbiAgICAoaXRlbSwga2V5KSA9PiB7XG4gICAgICBpZiAoIWl0ZXJhdG9yKGl0ZW0sIGtleSkpIHtcbiAgICAgICAgcmVzID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXZlcnRcbiAgKVxuICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb21lPFQgZXh0ZW5kcyBzdHJpbmc+KFxuICB2YWw6IFQsXG4gIGl0ZXJhdG9yOiBFYWNoU3RyaW5nSXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGJvb2xlYW5cbmV4cG9ydCBmdW5jdGlvbiBzb21lPFQ+KFxuICB2YWw6IFRbXSxcbiAgaXRlcmF0b3I6IEVhY2hBcnJheUl0ZXJhdG9yPFQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBib29sZWFuXG5leHBvcnQgZnVuY3Rpb24gc29tZTxUIGV4dGVuZHMge30sIFRWYWx1ZT4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IEVhY2hPYmplY3RJdGVyYXRvcixcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogYm9vbGVhblxuZXhwb3J0IGZ1bmN0aW9uIHNvbWUodmFsOiBhbnksIGl0ZXJhdG9yOiBhbnksIHJldmVydD86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgbGV0IHJlcyA9IGZhbHNlXG4gIGVhY2goXG4gICAgdmFsLFxuICAgIChpdGVtLCBrZXkpID0+IHtcbiAgICAgIGlmIChpdGVyYXRvcihpdGVtLCBrZXkpKSB7XG4gICAgICAgIHJlcyA9IHRydWVcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXZlcnRcbiAgKVxuICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW5kZXg8VCBleHRlbmRzIHN0cmluZz4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IEVhY2hTdHJpbmdJdGVyYXRvcixcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogbnVtYmVyXG5leHBvcnQgZnVuY3Rpb24gZmluZEluZGV4PFQ+KFxuICB2YWw6IFRbXSxcbiAgaXRlcmF0b3I6IEVhY2hBcnJheUl0ZXJhdG9yPFQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBudW1iZXJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW5kZXg8VCBleHRlbmRzIHt9LCBUVmFsdWU+KFxuICB2YWw6IFQsXG4gIGl0ZXJhdG9yOiBFYWNoT2JqZWN0SXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGtleW9mIFRcbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW5kZXgoXG4gIHZhbDogYW55LFxuICBpdGVyYXRvcjogYW55LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBzdHJpbmcgfCBudW1iZXIge1xuICBsZXQgcmVzOiBudW1iZXIgfCBzdHJpbmcgPSAtMVxuICBlYWNoKFxuICAgIHZhbCxcbiAgICAoaXRlbSwga2V5KSA9PiB7XG4gICAgICBpZiAoaXRlcmF0b3IoaXRlbSwga2V5KSkge1xuICAgICAgICByZXMgPSBrZXlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXZlcnRcbiAgKVxuICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kPFQgZXh0ZW5kcyBzdHJpbmc+KFxuICB2YWw6IFQsXG4gIGl0ZXJhdG9yOiBFYWNoU3RyaW5nSXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGFueVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmQ8VD4oXG4gIHZhbDogVFtdLFxuICBpdGVyYXRvcjogRWFjaEFycmF5SXRlcmF0b3I8VD4sXG4gIHJldmVydD86IGJvb2xlYW5cbik6IFRcbmV4cG9ydCBmdW5jdGlvbiBmaW5kPFQgZXh0ZW5kcyB7fSwgVFZhbHVlPihcbiAgdmFsOiBULFxuICBpdGVyYXRvcjogRWFjaE9iamVjdEl0ZXJhdG9yLFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBUW2tleW9mIFRdXG5leHBvcnQgZnVuY3Rpb24gZmluZCh2YWw6IGFueSwgaXRlcmF0b3I6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbik6IGFueSB7XG4gIGxldCByZXM6IGFueVxuICBlYWNoKFxuICAgIHZhbCxcbiAgICAoaXRlbSwga2V5KSA9PiB7XG4gICAgICBpZiAoaXRlcmF0b3IoaXRlbSwga2V5KSkge1xuICAgICAgICByZXMgPSBpdGVtXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgcmV2ZXJ0XG4gIClcbiAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5jbHVkZXM8VCBleHRlbmRzIHN0cmluZz4oXG4gIHZhbDogVCxcbiAgc2VhcmNoRWxlbWVudDogc3RyaW5nLFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBib29sZWFuXG5leHBvcnQgZnVuY3Rpb24gaW5jbHVkZXM8VD4oXG4gIHZhbDogVFtdLFxuICBzZWFyY2hFbGVtZW50OiBULFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBib29sZWFuXG5leHBvcnQgZnVuY3Rpb24gaW5jbHVkZXModmFsOiBhbnksIHNlYXJjaEVsZW1lbnQ6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbikge1xuICBpZiAoaXNTdHIodmFsKSkgcmV0dXJuIHZhbC5pbmNsdWRlcyhzZWFyY2hFbGVtZW50KVxuICByZXR1cm4gc29tZSh2YWwsIGl0ZW0gPT4gaXRlbSA9PT0gc2VhcmNoRWxlbWVudCwgcmV2ZXJ0KVxufVxuIiwiZnVuY3Rpb24gZ2xvYmFsU2VsZigpIHtcbiAgdHJ5IHtcbiAgICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gc2VsZlxuICAgIH1cbiAgfSBjYXRjaCAoZSkge31cbiAgdHJ5IHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB3aW5kb3dcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHt9XG4gIHRyeSB7XG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZ2xvYmFsXG4gICAgfVxuICB9IGNhdGNoIChlKSB7fVxuICByZXR1cm4gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKVxufVxuZXhwb3J0IGNvbnN0IGdsb2JhbFRoaXNQb2x5ZmlsbCA9IGdsb2JhbFNlbGYoKVxuIiwiaW1wb3J0IHsgZ2xvYmFsVGhpc1BvbHlmaWxsIH0gZnJvbSAnLi9nbG9iYWwnXG5pbXBvcnQgeyBpc1N0ciwgaXNGbiB9IGZyb20gJy4vdHlwZXMnXG5leHBvcnQgY29uc3QgaW5zdE9mID0gKHZhbHVlOiBhbnksIGNsczogYW55KSA9PiB7XG4gIGlmIChpc0ZuKGNscykpIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIGNsc1xuICBpZiAoaXNTdHIoY2xzKSlcbiAgICByZXR1cm4gZ2xvYmFsVGhpc1BvbHlmaWxsW2Nsc11cbiAgICAgID8gdmFsdWUgaW5zdGFuY2VvZiBnbG9iYWxUaGlzUG9seWZpbGxbY2xzXVxuICAgICAgOiBmYWxzZVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsImltcG9ydCB7IGlzRm4gfSBmcm9tICcuL3R5cGVzJ1xuXG5jb25zdCBCSUdfREFUQV9GTEFHID0gU3ltYm9sKCdfX0JJR19EQVRBX18nKVxuXG50eXBlIEJpZ0RhdGFPcHRpb25zID0ge1xuICBjb21wYXJlPzogKHByZXY6IGFueSwgY3VycmVudDogYW55LCBrZXk6IHN0cmluZykgPT4gYm9vbGVhblxuICBjbG9uZT86ICh2YWx1ZTogYW55KSA9PiBhbnlcbn1cblxuZXhwb3J0IGNsYXNzIEJpZ0RhdGEge1xuICBwcml2YXRlIG9wdGlvbnM6IEJpZ0RhdGFPcHRpb25zXG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IEJpZ0RhdGFPcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLi4ub3B0aW9uc1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZShkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIWRhdGFbQklHX0RBVEFfRkxBR10pIHtcbiAgICAgICAgZGF0YVtCSUdfREFUQV9GTEFHXSA9IHRoaXMub3B0aW9uc1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgc3RhdGljIGlzQmlnRGF0YSA9IChkYXRhOiBhbnkpID0+IHtcbiAgICByZXR1cm4gZGF0YSAmJiAhIWRhdGFbQklHX0RBVEFfRkxBR11cbiAgfVxuXG4gIHN0YXRpYyBjb21wYXJlID0gKGE6IGFueSwgYjogYW55KSA9PiB7XG4gICAgaWYgKEJpZ0RhdGEuaXNCaWdEYXRhKGEpICYmIEJpZ0RhdGEuaXNCaWdEYXRhKGIpKSB7XG4gICAgICBpZiAoYVtCSUdfREFUQV9GTEFHXSA9PT0gYltCSUdfREFUQV9GTEFHXSkge1xuICAgICAgICByZXR1cm4gaXNGbihhW0JJR19EQVRBX0ZMQUddLmNvbXBhcmUpXG4gICAgICAgICAgPyBhW0JJR19EQVRBX0ZMQUddLmNvbXBhcmUoYSwgYilcbiAgICAgICAgICA6IGEgPT09IGJcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gYSA9PT0gYlxuICB9XG5cbiAgc3RhdGljIGNsb25lID0gKHZhbHVlOiBhbnkpID0+IHtcbiAgICBpZiAoQmlnRGF0YS5pc0JpZ0RhdGEodmFsdWUpKSB7XG4gICAgICBpZiAoaXNGbih2YWx1ZVtCSUdfREFUQV9GTEFHXS5jbG9uZSkpIHtcbiAgICAgICAgY29uc3QgY3R4ID0gdmFsdWVbQklHX0RBVEFfRkxBR11cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdmFsdWVbQklHX0RBVEFfRkxBR10uY2xvbmUodmFsdWUpXG4gICAgICAgIHJlc3VsdFtCSUdfREFUQV9GTEFHXSA9IGN0eFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG59XG4iLCJpbXBvcnQgeyBpc0FyciB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBpbnN0T2YgfSBmcm9tICcuL2luc3RhbmNlb2YnXG5pbXBvcnQgeyBCaWdEYXRhIH0gZnJvbSAnLi9iaWctZGF0YSdcbmNvbnN0IGlzQXJyYXkgPSBpc0FyclxuY29uc3Qga2V5TGlzdCA9IE9iamVjdC5rZXlzXG5jb25zdCBoYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuZnVuY3Rpb24gZXF1YWwoYTogYW55LCBiOiBhbnksIGNvbXBhcmVGdW5jdGlvblN0cmluZyA9IGZhbHNlKSB7XG4gIC8vIGZhc3QtZGVlcC1lcXVhbCBpbmRleC5qcyAyLjAuMVxuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpZiAoYSAmJiBiICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgYiA9PT0gJ29iamVjdCcpIHtcbiAgICBjb25zdCBiaWdEYXRhQSA9IEJpZ0RhdGEuaXNCaWdEYXRhKGEpXG4gICAgY29uc3QgYmlnRGF0YUIgPSBCaWdEYXRhLmlzQmlnRGF0YShiKVxuXG4gICAgaWYgKGJpZ0RhdGFBICE9PSBiaWdEYXRhQikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGlmIChiaWdEYXRhQSAmJiBiaWdEYXRhQikge1xuICAgICAgcmV0dXJuIEJpZ0RhdGEuY29tcGFyZShhLCBiKVxuICAgIH1cblxuICAgIGNvbnN0IGFyckEgPSBpc0FycmF5KGEpXG4gICAgY29uc3QgYXJyQiA9IGlzQXJyYXkoYilcbiAgICBsZXQgaTogbnVtYmVyXG4gICAgbGV0IGxlbmd0aDogbnVtYmVyXG4gICAgbGV0IGtleTogc3RyaW5nIHwgbnVtYmVyXG5cbiAgICBpZiAoYXJyQSAmJiBhcnJCKSB7XG4gICAgICBsZW5ndGggPSBhLmxlbmd0aFxuICAgICAgaWYgKGxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSAhPT0gMDsgKSB7XG4gICAgICAgIGlmICghZXF1YWwoYVtpXSwgYltpXSwgY29tcGFyZUZ1bmN0aW9uU3RyaW5nKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChhcnJBICE9PSBhcnJCKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCBtb21lbnRBID0gYSAmJiBhLl9pc0FNb21lbnRPYmplY3RcbiAgICBjb25zdCBtb21lbnRCID0gYiAmJiBiLl9pc0FNb21lbnRPYmplY3RcbiAgICBpZiAobW9tZW50QSAhPT0gbW9tZW50QikgcmV0dXJuIGZhbHNlXG4gICAgaWYgKG1vbWVudEEgJiYgbW9tZW50QikgcmV0dXJuIGEuaXNTYW1lKGIpXG4gICAgY29uc3QgaW1tdXRhYmxlQSA9IGEgJiYgYS50b0pTXG4gICAgY29uc3QgaW1tdXRhYmxlQiA9IGIgJiYgYi50b0pTXG4gICAgaWYgKGltbXV0YWJsZUEgIT09IGltbXV0YWJsZUIpIHJldHVybiBmYWxzZVxuICAgIGlmIChpbW11dGFibGVBKSByZXR1cm4gYS5pcyA/IGEuaXMoYikgOiBhID09PSBiXG4gICAgY29uc3QgZGF0ZUEgPSBpbnN0T2YoYSwgJ0RhdGUnKVxuICAgIGNvbnN0IGRhdGVCID0gaW5zdE9mKGIsICdEYXRlJylcbiAgICBpZiAoZGF0ZUEgIT09IGRhdGVCKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgaWYgKGRhdGVBICYmIGRhdGVCKSB7XG4gICAgICByZXR1cm4gYS5nZXRUaW1lKCkgPT09IGIuZ2V0VGltZSgpXG4gICAgfVxuICAgIGNvbnN0IHNjaGVtYUEgPSBhICYmIGEudG9KU09OXG4gICAgY29uc3Qgc2NoZW1hQiA9IGIgJiYgYi50b0pTT05cbiAgICBpZiAoc2NoZW1hQSAhPT0gc2NoZW1hQikgcmV0dXJuIGZhbHNlXG4gICAgaWYgKHNjaGVtYUEgJiYgc2NoZW1hQilcbiAgICAgIHJldHVybiBlcXVhbChhLnRvSlNPTigpLCBiLnRvSlNPTigpLCBjb21wYXJlRnVuY3Rpb25TdHJpbmcpXG4gICAgY29uc3QgcmVnZXhwQSA9IGluc3RPZihhLCAnUmVnRXhwJylcbiAgICBjb25zdCByZWdleHBCID0gaW5zdE9mKGIsICdSZWdFeHAnKVxuICAgIGlmIChyZWdleHBBICE9PSByZWdleHBCKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgaWYgKHJlZ2V4cEEgJiYgcmVnZXhwQikge1xuICAgICAgcmV0dXJuIGEudG9TdHJpbmcoKSA9PT0gYi50b1N0cmluZygpXG4gICAgfVxuICAgIGNvbnN0IHVybEEgPSBpbnN0T2YoYSwgJ1VSTCcpXG4gICAgY29uc3QgdXJsQiA9IGluc3RPZihiLCAnVVJMJylcbiAgICBpZiAodXJsQSAmJiB1cmxCKSB7XG4gICAgICByZXR1cm4gYS5ocmVmID09PSBiLmhyZWZcbiAgICB9XG5cbiAgICBjb25zdCBrZXlzID0ga2V5TGlzdChhKVxuICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoXG5cbiAgICBpZiAobGVuZ3RoICE9PSBrZXlMaXN0KGIpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gIT09IDA7ICkge1xuICAgICAgaWYgKCFoYXNQcm9wLmNhbGwoYiwga2V5c1tpXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIC8vIGVuZCBmYXN0LWRlZXAtZXF1YWxcblxuICAgIC8vIEN1c3RvbSBoYW5kbGluZyBmb3IgUmVhY3RcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSAhPT0gMDsgKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldXG5cbiAgICAgIGlmIChrZXkgPT09ICdfb3duZXInICYmIGEuJCR0eXBlb2YpIHtcbiAgICAgICAgLy8gUmVhY3Qtc3BlY2lmaWM6IGF2b2lkIHRyYXZlcnNpbmcgUmVhY3QgZWxlbWVudHMnIF9vd25lci5cbiAgICAgICAgLy8gIF9vd25lciBjb250YWlucyBjaXJjdWxhciByZWZlcmVuY2VzXG4gICAgICAgIC8vIGFuZCBpcyBub3QgbmVlZGVkIHdoZW4gY29tcGFyaW5nIHRoZSBhY3R1YWwgZWxlbWVudHMgKGFuZCBub3QgdGhlaXIgb3duZXJzKVxuICAgICAgICAvLyAuJCR0eXBlb2YgYW5kIC5fc3RvcmUgb24ganVzdCByZWFzb25hYmxlIG1hcmtlcnMgb2YgYSByZWFjdCBlbGVtZW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhbGwgb3RoZXIgcHJvcGVydGllcyBzaG91bGQgYmUgdHJhdmVyc2VkIGFzIHVzdWFsXG4gICAgICAgIGlmICghZXF1YWwoYVtrZXldLCBiW2tleV0sIGNvbXBhcmVGdW5jdGlvblN0cmluZykpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZhc3QtZGVlcC1lcXVhbCBpbmRleC5qcyAyLjAuMVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgaWYgKGNvbXBhcmVGdW5jdGlvblN0cmluZykge1xuICAgIGlmIChhICYmIGIgJiYgdHlwZW9mIGEgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBhLnRvU3RyaW5nKCkgPT09IGIudG9TdHJpbmcoKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhICE9PSBhICYmIGIgIT09IGJcbn1cbi8vIGVuZCBmYXN0LWRlZXAtZXF1YWxcblxuZXhwb3J0IGNvbnN0IGlzRXF1YWwgPSBmdW5jdGlvbiBleHBvcnRlZEVxdWFsKFxuICBhOiBhbnksXG4gIGI6IGFueSxcbiAgY29tcGFyZUZ1bmN0aW9uU3RyaW5nID0gZmFsc2Vcbikge1xuICB0cnkge1xuICAgIHJldHVybiBlcXVhbChhLCBiLCBjb21wYXJlRnVuY3Rpb25TdHJpbmcpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKFxuICAgICAgKGVycm9yLm1lc3NhZ2UgJiYgZXJyb3IubWVzc2FnZS5tYXRjaCgvc3RhY2t8cmVjdXJzaW9uL2kpKSB8fFxuICAgICAgZXJyb3IubnVtYmVyID09PSAtMjE0NjgyODI2MFxuICAgICkge1xuICAgICAgLy8gd2FybiBvbiBjaXJjdWxhciByZWZlcmVuY2VzLCBkb24ndCBjcmFzaFxuICAgICAgLy8gYnJvd3NlcnMgZ2l2ZSB0aGlzIGRpZmZlcmVudCBlcnJvcnMgbmFtZSBhbmQgbWVzc2FnZXM6XG4gICAgICAvLyBjaHJvbWUvc2FmYXJpOiBcIlJhbmdlRXJyb3JcIiwgXCJNYXhpbXVtIGNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiXG4gICAgICAvLyBmaXJlZm94OiBcIkludGVybmFsRXJyb3JcIiwgdG9vIG11Y2ggcmVjdXJzaW9uXCJcbiAgICAgIC8vIGVkZ2U6IFwiRXJyb3JcIiwgXCJPdXQgb2Ygc3RhY2sgc3BhY2VcIlxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnV2FybmluZzogcmVhY3QtZmFzdC1jb21wYXJlIGRvZXMgbm90IGhhbmRsZSBjaXJjdWxhciByZWZlcmVuY2VzLicsXG4gICAgICAgIGVycm9yLm5hbWUsXG4gICAgICAgIGVycm9yLm1lc3NhZ2VcbiAgICAgIClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICAvLyBzb21lIG90aGVyIGVycm9yLiB3ZSBzaG91bGQgZGVmaW5pdGVseSBrbm93IGFib3V0IHRoZXNlXG4gICAgdGhyb3cgZXJyb3JcbiAgfVxufVxuIiwiaW1wb3J0IHsgaXNGbiB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBpbnN0T2YgfSBmcm9tICcuL2luc3RhbmNlb2YnXG5pbXBvcnQgeyBCaWdEYXRhIH0gZnJvbSAnLi9iaWctZGF0YSdcbnR5cGUgRmlsdGVyID0gKHZhbHVlOiBhbnksIGtleTogc3RyaW5nKSA9PiBib29sZWFuXG5cbmNvbnN0IE5BVElWRV9LRVlTID0gW1xuICBbJ01hcCcsIChtYXA6IGFueSkgPT4gbmV3IE1hcChtYXApXSxcbiAgWydXZWFrTWFwJywgKG1hcDogYW55KSA9PiBuZXcgV2Vha01hcChtYXApXSxcbiAgWydXZWFrU2V0JywgKHNldDogYW55KSA9PiBuZXcgV2Vha1NldChzZXQpXSxcbiAgWydTZXQnLCAoc2V0OiBhbnkpID0+IG5ldyBTZXQoc2V0KV0sXG4gIFsnRGF0ZScsIChkYXRlOiBhbnkpID0+IG5ldyBEYXRlKGRhdGUpXSxcbiAgJ0ZpbGVMaXN0JyxcbiAgJ0ZpbGUnLFxuICAnVVJMJyxcbiAgJ1JlZ0V4cCcsXG4gIFtcbiAgICAnUHJvbWlzZScsXG4gICAgKHByb21pc2U6IFByb21pc2U8YW55PikgPT5cbiAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpKVxuICBdXG5dXG5cbmNvbnN0IGlzTmF0aXZlT2JqZWN0ID0gKHZhbHVlczogYW55KTogYW55ID0+IHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBOQVRJVkVfS0VZUy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGl0ZW0gPSBOQVRJVkVfS0VZU1tpXVxuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pICYmIGl0ZW1bMF0pIHtcbiAgICAgIGlmIChpbnN0T2YodmFsdWVzLCBpdGVtWzBdKSkge1xuICAgICAgICByZXR1cm4gaXRlbVsxXSA/IGl0ZW1bMV0gOiBpdGVtWzBdXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbnN0T2YodmFsdWVzLCBpdGVtKSkge1xuICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2hhbGxvd0Nsb25lID0gKHZhbHVlczogYW55KSA9PiB7XG4gIGxldCBuYXRpdmVDbG9uZTogKHZhbHVlczogYW55KSA9PiBhbnlcbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgIHJldHVybiB2YWx1ZXMuc2xpY2UoMClcbiAgfSBlbHNlIGlmIChpc05hdGl2ZU9iamVjdCh2YWx1ZXMpKSB7XG4gICAgbmF0aXZlQ2xvbmUgPSBpc05hdGl2ZU9iamVjdCh2YWx1ZXMpXG4gICAgcmV0dXJuIGlzRm4obmF0aXZlQ2xvbmUpID8gbmF0aXZlQ2xvbmUodmFsdWVzKSA6IHZhbHVlc1xuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZXMgPT09ICdvYmplY3QnICYmICEhdmFsdWVzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnZhbHVlc1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgY2xvbmUgPSAodmFsdWVzOiBhbnksIGZpbHRlcj86IEZpbHRlcikgPT4ge1xuICBsZXQgbmF0aXZlQ2xvbmU6ICh2YWx1ZXM6IGFueSkgPT4gYW55XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICByZXR1cm4gdmFsdWVzLm1hcChpdGVtID0+IGNsb25lKGl0ZW0sIGZpbHRlcikpXG4gIH0gZWxzZSBpZiAoaXNOYXRpdmVPYmplY3QodmFsdWVzKSkge1xuICAgIG5hdGl2ZUNsb25lID0gaXNOYXRpdmVPYmplY3QodmFsdWVzKVxuICAgIHJldHVybiBpc0ZuKG5hdGl2ZUNsb25lKSA/IG5hdGl2ZUNsb25lKHZhbHVlcykgOiB2YWx1ZXNcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSAnb2JqZWN0JyAmJiAhIXZhbHVlcykge1xuICAgIGlmICgnJCR0eXBlb2YnIGluIHZhbHVlcyAmJiAnX293bmVyJyBpbiB2YWx1ZXMpIHtcbiAgICAgIHJldHVybiB2YWx1ZXNcbiAgICB9XG4gICAgaWYgKHZhbHVlcy5faXNBTW9tZW50T2JqZWN0KSB7XG4gICAgICByZXR1cm4gdmFsdWVzXG4gICAgfVxuICAgIGlmICh2YWx1ZXMuX2lzSlNPTlNjaGVtYU9iamVjdCkge1xuICAgICAgcmV0dXJuIHZhbHVlc1xuICAgIH1cbiAgICBpZiAoQmlnRGF0YS5pc0JpZ0RhdGEodmFsdWVzKSkge1xuICAgICAgcmV0dXJuIEJpZ0RhdGEuY2xvbmUodmFsdWVzKVxuICAgIH1cbiAgICBpZiAoaXNGbih2YWx1ZXMudG9KUykpIHtcbiAgICAgIHJldHVybiB2YWx1ZXNcbiAgICB9XG4gICAgaWYgKGlzRm4odmFsdWVzLnRvSlNPTikpIHtcbiAgICAgIHJldHVybiB2YWx1ZXNcbiAgICB9XG4gICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModmFsdWVzIHx8IHt9KS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB2YWx1ZXNcbiAgICB9XG4gICAgY29uc3QgcmVzID0ge31cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB2YWx1ZXMpIHtcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZXMsIGtleSkpIHtcbiAgICAgICAgaWYgKGlzRm4oZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChmaWx0ZXIodmFsdWVzW2tleV0sIGtleSkpIHtcbiAgICAgICAgICAgIHJlc1trZXldID0gY2xvbmUodmFsdWVzW2tleV0sIGZpbHRlcilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzW2tleV0gPSB2YWx1ZXNba2V5XVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNba2V5XSA9IGNsb25lKHZhbHVlc1trZXldLCBmaWx0ZXIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWx1ZXNcbiAgfVxufVxuIiwiaW1wb3J0IHsgaW5zdE9mIH0gZnJvbSAnLi9pbnN0YW5jZW9mJ1xuY29uc3QgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuXG5jb25zdCB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxuZXhwb3J0IGNvbnN0IGlzVmFsaWQgPSAodmFsOiBhbnkpID0+IHZhbCAhPT0gdW5kZWZpbmVkICYmIHZhbCAhPT0gbnVsbFxuXG5leHBvcnQgZnVuY3Rpb24gaXNFbXB0eSh2YWw6IGFueSk6IGJvb2xlYW4ge1xuICAvLyBOdWxsIGFuZCBVbmRlZmluZWQuLi5cbiAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8vIEJvb2xlYW5zLi4uXG4gIGlmICh0eXBlb2YgdmFsID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIE51bWJlcnMuLi5cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBTdHJpbmdzLi4uXG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWwubGVuZ3RoID09PSAwXG4gIH1cblxuICAvLyBGdW5jdGlvbnMuLi5cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdmFsLmxlbmd0aCA9PT0gMFxuICB9XG5cbiAgLy8gQXJyYXlzLi4uXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChcbiAgICAgICAgdmFsW2ldICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgdmFsW2ldICE9PSBudWxsICYmXG4gICAgICAgIHZhbFtpXSAhPT0gJycgJiZcbiAgICAgICAgdmFsW2ldICE9PSAwXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvLyBFcnJvcnMuLi5cbiAgaWYgKGluc3RPZih2YWwsICdFcnJvcicpKSB7XG4gICAgcmV0dXJuIHZhbC5tZXNzYWdlID09PSAnJ1xuICB9XG5cbiAgLy8gT2JqZWN0cy4uLlxuICBpZiAodmFsLnRvU3RyaW5nID09PSB0b1N0cmluZykge1xuICAgIHN3aXRjaCAodmFsLnRvU3RyaW5nKCkpIHtcbiAgICAgIC8vIE1hcHMsIFNldHMsIEZpbGVzIGFuZCBFcnJvcnMuLi5cbiAgICAgIGNhc2UgJ1tvYmplY3QgRmlsZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBNYXBdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgU2V0XSc6IHtcbiAgICAgICAgcmV0dXJuIHZhbC5zaXplID09PSAwXG4gICAgICB9XG5cbiAgICAgIC8vIFBsYWluIG9iamVjdHMuLi5cbiAgICAgIGNhc2UgJ1tvYmplY3QgT2JqZWN0XSc6IHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdmFsKSB7XG4gICAgICAgICAgaWYgKGhhcy5jYWxsKHZhbCwga2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBBbnl0aGluZyBlbHNlLi4uXG4gIHJldHVybiBmYWxzZVxufVxuIiwiLyoqXG4gKiBTcGVjaWFsIGxhbmd1YWdlLXNwZWNpZmljIG92ZXJyaWRlcy5cbiAqXG4gKiBTb3VyY2U6IGZ0cDovL2Z0cC51bmljb2RlLm9yZy9QdWJsaWMvVUNEL2xhdGVzdC91Y2QvU3BlY2lhbENhc2luZy50eHRcbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgTEFOR1VBR0VTID0ge1xuICB0cjoge1xuICAgIHJlZ2V4cDogL1tcXHUwMDY5XS9nLFxuICAgIG1hcDoge1xuICAgICAgJ1xcdTAwNjknOiAnXFx1MDEzMCdcbiAgICB9XG4gIH0sXG4gIGF6OiB7XG4gICAgcmVnZXhwOiAvW1xcdTAwNjldL2csXG4gICAgbWFwOiB7XG4gICAgICAnXFx1MDA2OSc6ICdcXHUwMTMwJ1xuICAgIH1cbiAgfSxcbiAgbHQ6IHtcbiAgICByZWdleHA6IC9bXFx1MDA2OVxcdTAwNkFcXHUwMTJGXVxcdTAzMDd8XFx1MDA2OVxcdTAzMDdbXFx1MDMwMFxcdTAzMDFcXHUwMzAzXS9nLFxuICAgIG1hcDoge1xuICAgICAgJ1xcdTAwNjlcXHUwMzA3JzogJ1xcdTAwNDknLFxuICAgICAgJ1xcdTAwNkFcXHUwMzA3JzogJ1xcdTAwNEEnLFxuICAgICAgJ1xcdTAxMkZcXHUwMzA3JzogJ1xcdTAxMkUnLFxuICAgICAgJ1xcdTAwNjlcXHUwMzA3XFx1MDMwMCc6ICdcXHUwMENDJyxcbiAgICAgICdcXHUwMDY5XFx1MDMwN1xcdTAzMDEnOiAnXFx1MDBDRCcsXG4gICAgICAnXFx1MDA2OVxcdTAzMDdcXHUwMzAzJzogJ1xcdTAxMjgnXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVXBwZXIgY2FzZSBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIsIGxvY2FsZSkge1xuICB2YXIgbGFuZyA9IExBTkdVQUdFU1tsb2NhbGVdXG5cbiAgc3RyID0gc3RyID09IG51bGwgPyAnJyA6IFN0cmluZyhzdHIpXG5cbiAgaWYgKGxhbmcpIHtcbiAgICBzdHIgPSBzdHIucmVwbGFjZShsYW5nLnJlZ2V4cCwgZnVuY3Rpb24gKG0pIHsgcmV0dXJuIGxhbmcubWFwW21dIH0pXG4gIH1cblxuICByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKClcbn1cbiIsIi8qKlxuICogU3BlY2lhbCBsYW5ndWFnZS1zcGVjaWZpYyBvdmVycmlkZXMuXG4gKlxuICogU291cmNlOiBmdHA6Ly9mdHAudW5pY29kZS5vcmcvUHVibGljL1VDRC9sYXRlc3QvdWNkL1NwZWNpYWxDYXNpbmcudHh0XG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIExBTkdVQUdFUyA9IHtcbiAgdHI6IHtcbiAgICByZWdleHA6IC9cXHUwMTMwfFxcdTAwNDl8XFx1MDA0OVxcdTAzMDcvZyxcbiAgICBtYXA6IHtcbiAgICAgICdcXHUwMTMwJzogJ1xcdTAwNjknLFxuICAgICAgJ1xcdTAwNDknOiAnXFx1MDEzMScsXG4gICAgICAnXFx1MDA0OVxcdTAzMDcnOiAnXFx1MDA2OSdcbiAgICB9XG4gIH0sXG4gIGF6OiB7XG4gICAgcmVnZXhwOiAvW1xcdTAxMzBdL2csXG4gICAgbWFwOiB7XG4gICAgICAnXFx1MDEzMCc6ICdcXHUwMDY5JyxcbiAgICAgICdcXHUwMDQ5JzogJ1xcdTAxMzEnLFxuICAgICAgJ1xcdTAwNDlcXHUwMzA3JzogJ1xcdTAwNjknXG4gICAgfVxuICB9LFxuICBsdDoge1xuICAgIHJlZ2V4cDogL1tcXHUwMDQ5XFx1MDA0QVxcdTAxMkVcXHUwMENDXFx1MDBDRFxcdTAxMjhdL2csXG4gICAgbWFwOiB7XG4gICAgICAnXFx1MDA0OSc6ICdcXHUwMDY5XFx1MDMwNycsXG4gICAgICAnXFx1MDA0QSc6ICdcXHUwMDZBXFx1MDMwNycsXG4gICAgICAnXFx1MDEyRSc6ICdcXHUwMTJGXFx1MDMwNycsXG4gICAgICAnXFx1MDBDQyc6ICdcXHUwMDY5XFx1MDMwN1xcdTAzMDAnLFxuICAgICAgJ1xcdTAwQ0QnOiAnXFx1MDA2OVxcdTAzMDdcXHUwMzAxJyxcbiAgICAgICdcXHUwMTI4JzogJ1xcdTAwNjlcXHUwMzA3XFx1MDMwMydcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBMb3dlcmNhc2UgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyLCBsb2NhbGUpIHtcbiAgdmFyIGxhbmcgPSBMQU5HVUFHRVNbbG9jYWxlXVxuXG4gIHN0ciA9IHN0ciA9PSBudWxsID8gJycgOiBTdHJpbmcoc3RyKVxuXG4gIGlmIChsYW5nKSB7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UobGFuZy5yZWdleHAsIGZ1bmN0aW9uIChtKSB7IHJldHVybiBsYW5nLm1hcFttXSB9KVxuICB9XG5cbiAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IC9bXkEtWmEtelxceEFBXFx4QjVcXHhCQVxceEMwLVxceEQ2XFx4RDgtXFx4RjZcXHhGOC1cXHUwMkMxXFx1MDJDNi1cXHUwMkQxXFx1MDJFMC1cXHUwMkU0XFx1MDJFQ1xcdTAyRUVcXHUwMzcwLVxcdTAzNzRcXHUwMzc2XFx1MDM3N1xcdTAzN0EtXFx1MDM3RFxcdTAzN0ZcXHUwMzg2XFx1MDM4OC1cXHUwMzhBXFx1MDM4Q1xcdTAzOEUtXFx1MDNBMVxcdTAzQTMtXFx1MDNGNVxcdTAzRjctXFx1MDQ4MVxcdTA0OEEtXFx1MDUyRlxcdTA1MzEtXFx1MDU1NlxcdTA1NTlcXHUwNTYxLVxcdTA1ODdcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjJcXHUwNjIwLVxcdTA2NEFcXHUwNjZFXFx1MDY2RlxcdTA2NzEtXFx1MDZEM1xcdTA2RDVcXHUwNkU1XFx1MDZFNlxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDQS1cXHUwN0VBXFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgwMC1cXHUwODE1XFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDg0MC1cXHUwODU4XFx1MDhBMC1cXHUwOEI0XFx1MDkwNC1cXHUwOTM5XFx1MDkzRFxcdTA5NTBcXHUwOTU4LVxcdTA5NjFcXHUwOTcxLVxcdTA5ODBcXHUwOTg1LVxcdTA5OENcXHUwOThGXFx1MDk5MFxcdTA5OTMtXFx1MDlBOFxcdTA5QUEtXFx1MDlCMFxcdTA5QjJcXHUwOUI2LVxcdTA5QjlcXHUwOUJEXFx1MDlDRVxcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUxXFx1MDlGMFxcdTA5RjFcXHUwQTA1LVxcdTBBMEFcXHUwQTBGXFx1MEExMFxcdTBBMTMtXFx1MEEyOFxcdTBBMkEtXFx1MEEzMFxcdTBBMzJcXHUwQTMzXFx1MEEzNVxcdTBBMzZcXHUwQTM4XFx1MEEzOVxcdTBBNTktXFx1MEE1Q1xcdTBBNUVcXHUwQTcyLVxcdTBBNzRcXHUwQTg1LVxcdTBBOERcXHUwQThGLVxcdTBBOTFcXHUwQTkzLVxcdTBBQThcXHUwQUFBLVxcdTBBQjBcXHUwQUIyXFx1MEFCM1xcdTBBQjUtXFx1MEFCOVxcdTBBQkRcXHUwQUQwXFx1MEFFMFxcdTBBRTFcXHUwQUY5XFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzlcXHUwQzNEXFx1MEM1OC1cXHUwQzVBXFx1MEM2MFxcdTBDNjFcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NlxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVDNlxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGXFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTBEMC1cXHUxMEZBXFx1MTBGQy1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxM0EwLVxcdTEzRjVcXHUxM0Y4LVxcdTEzRkRcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkYxLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0Q3XFx1MTdEQ1xcdTE4MjAtXFx1MTg3N1xcdTE4ODAtXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTUwLVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQUE3XFx1MUIwNS1cXHUxQjMzXFx1MUI0NS1cXHUxQjRCXFx1MUI4My1cXHUxQkEwXFx1MUJBRVxcdTFCQUZcXHUxQkJBLVxcdTFCRTVcXHUxQzAwLVxcdTFDMjNcXHUxQzRELVxcdTFDNEZcXHUxQzVBLVxcdTFDN0RcXHUxQ0U5LVxcdTFDRUNcXHUxQ0VFLVxcdTFDRjFcXHUxQ0Y1XFx1MUNGNlxcdTFEMDAtXFx1MURCRlxcdTFFMDAtXFx1MUYxNVxcdTFGMTgtXFx1MUYxRFxcdTFGMjAtXFx1MUY0NVxcdTFGNDgtXFx1MUY0RFxcdTFGNTAtXFx1MUY1N1xcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUYtXFx1MUY3RFxcdTFGODAtXFx1MUZCNFxcdTFGQjYtXFx1MUZCQ1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2LVxcdTFGQ0NcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2LVxcdTFGREJcXHUxRkUwLVxcdTFGRUNcXHUxRkYyLVxcdTFGRjRcXHUxRkY2LVxcdTFGRkNcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTIxMDJcXHUyMTA3XFx1MjEwQS1cXHUyMTEzXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMkYtXFx1MjEzOVxcdTIxM0MtXFx1MjEzRlxcdTIxNDUtXFx1MjE0OVxcdTIxNEVcXHUyMTgzXFx1MjE4NFxcdTJDMDAtXFx1MkMyRVxcdTJDMzAtXFx1MkM1RVxcdTJDNjAtXFx1MkNFNFxcdTJDRUItXFx1MkNFRVxcdTJDRjJcXHUyQ0YzXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHUyRDMwLVxcdTJENjdcXHUyRDZGXFx1MkQ4MC1cXHUyRDk2XFx1MkRBMC1cXHUyREE2XFx1MkRBOC1cXHUyREFFXFx1MkRCMC1cXHUyREI2XFx1MkRCOC1cXHUyREJFXFx1MkRDMC1cXHUyREM2XFx1MkRDOC1cXHUyRENFXFx1MkREMC1cXHUyREQ2XFx1MkREOC1cXHUyRERFXFx1MkUyRlxcdTMwMDVcXHUzMDA2XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDlELVxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZDLVxcdTMwRkZcXHUzMTA1LVxcdTMxMkRcXHUzMTMxLVxcdTMxOEVcXHUzMUEwLVxcdTMxQkFcXHUzMUYwLVxcdTMxRkZcXHUzNDAwLVxcdTREQjVcXHU0RTAwLVxcdTlGRDVcXHVBMDAwLVxcdUE0OENcXHVBNEQwLVxcdUE0RkRcXHVBNTAwLVxcdUE2MENcXHVBNjEwLVxcdUE2MUZcXHVBNjJBXFx1QTYyQlxcdUE2NDAtXFx1QTY2RVxcdUE2N0YtXFx1QTY5RFxcdUE2QTAtXFx1QTZFNVxcdUE3MTctXFx1QTcxRlxcdUE3MjItXFx1QTc4OFxcdUE3OEItXFx1QTdBRFxcdUE3QjAtXFx1QTdCN1xcdUE3RjctXFx1QTgwMVxcdUE4MDMtXFx1QTgwNVxcdUE4MDctXFx1QTgwQVxcdUE4MEMtXFx1QTgyMlxcdUE4NDAtXFx1QTg3M1xcdUE4ODItXFx1QThCM1xcdUE4RjItXFx1QThGN1xcdUE4RkJcXHVBOEZEXFx1QTkwQS1cXHVBOTI1XFx1QTkzMC1cXHVBOTQ2XFx1QTk2MC1cXHVBOTdDXFx1QTk4NC1cXHVBOUIyXFx1QTlDRlxcdUE5RTAtXFx1QTlFNFxcdUE5RTYtXFx1QTlFRlxcdUE5RkEtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREItXFx1QUFERFxcdUFBRTAtXFx1QUFFQVxcdUFBRjItXFx1QUFGNFxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCMzAtXFx1QUI1QVxcdUFCNUMtXFx1QUI2NVxcdUFCNzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGMjEtXFx1RkYzQVxcdUZGNDEtXFx1RkY1QVxcdUZGNjYtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQzAtOVxceEIyXFx4QjNcXHhCOVxceEJDLVxceEJFXFx1MDY2MC1cXHUwNjY5XFx1MDZGMC1cXHUwNkY5XFx1MDdDMC1cXHUwN0M5XFx1MDk2Ni1cXHUwOTZGXFx1MDlFNi1cXHUwOUVGXFx1MDlGNC1cXHUwOUY5XFx1MEE2Ni1cXHUwQTZGXFx1MEFFNi1cXHUwQUVGXFx1MEI2Ni1cXHUwQjZGXFx1MEI3Mi1cXHUwQjc3XFx1MEJFNi1cXHUwQkYyXFx1MEM2Ni1cXHUwQzZGXFx1MEM3OC1cXHUwQzdFXFx1MENFNi1cXHUwQ0VGXFx1MEQ2Ni1cXHUwRDc1XFx1MERFNi1cXHUwREVGXFx1MEU1MC1cXHUwRTU5XFx1MEVEMC1cXHUwRUQ5XFx1MEYyMC1cXHUwRjMzXFx1MTA0MC1cXHUxMDQ5XFx1MTA5MC1cXHUxMDk5XFx1MTM2OS1cXHUxMzdDXFx1MTZFRS1cXHUxNkYwXFx1MTdFMC1cXHUxN0U5XFx1MTdGMC1cXHUxN0Y5XFx1MTgxMC1cXHUxODE5XFx1MTk0Ni1cXHUxOTRGXFx1MTlEMC1cXHUxOURBXFx1MUE4MC1cXHUxQTg5XFx1MUE5MC1cXHUxQTk5XFx1MUI1MC1cXHUxQjU5XFx1MUJCMC1cXHUxQkI5XFx1MUM0MC1cXHUxQzQ5XFx1MUM1MC1cXHUxQzU5XFx1MjA3MFxcdTIwNzQtXFx1MjA3OVxcdTIwODAtXFx1MjA4OVxcdTIxNTAtXFx1MjE4MlxcdTIxODUtXFx1MjE4OVxcdTI0NjAtXFx1MjQ5QlxcdTI0RUEtXFx1MjRGRlxcdTI3NzYtXFx1Mjc5M1xcdTJDRkRcXHUzMDA3XFx1MzAyMS1cXHUzMDI5XFx1MzAzOC1cXHUzMDNBXFx1MzE5Mi1cXHUzMTk1XFx1MzIyMC1cXHUzMjI5XFx1MzI0OC1cXHUzMjRGXFx1MzI1MS1cXHUzMjVGXFx1MzI4MC1cXHUzMjg5XFx1MzJCMS1cXHUzMkJGXFx1QTYyMC1cXHVBNjI5XFx1QTZFNi1cXHVBNkVGXFx1QTgzMC1cXHVBODM1XFx1QThEMC1cXHVBOEQ5XFx1QTkwMC1cXHVBOTA5XFx1QTlEMC1cXHVBOUQ5XFx1QTlGMC1cXHVBOUY5XFx1QUE1MC1cXHVBQTU5XFx1QUJGMC1cXHVBQkY5XFx1RkYxMC1cXHVGRjE5XSsvZ1xuIiwibW9kdWxlLmV4cG9ydHMgPSAvKFthLXpcXHhCNVxceERGLVxceEY2XFx4RjgtXFx4RkZcXHUwMTAxXFx1MDEwM1xcdTAxMDVcXHUwMTA3XFx1MDEwOVxcdTAxMEJcXHUwMTBEXFx1MDEwRlxcdTAxMTFcXHUwMTEzXFx1MDExNVxcdTAxMTdcXHUwMTE5XFx1MDExQlxcdTAxMURcXHUwMTFGXFx1MDEyMVxcdTAxMjNcXHUwMTI1XFx1MDEyN1xcdTAxMjlcXHUwMTJCXFx1MDEyRFxcdTAxMkZcXHUwMTMxXFx1MDEzM1xcdTAxMzVcXHUwMTM3XFx1MDEzOFxcdTAxM0FcXHUwMTNDXFx1MDEzRVxcdTAxNDBcXHUwMTQyXFx1MDE0NFxcdTAxNDZcXHUwMTQ4XFx1MDE0OVxcdTAxNEJcXHUwMTREXFx1MDE0RlxcdTAxNTFcXHUwMTUzXFx1MDE1NVxcdTAxNTdcXHUwMTU5XFx1MDE1QlxcdTAxNURcXHUwMTVGXFx1MDE2MVxcdTAxNjNcXHUwMTY1XFx1MDE2N1xcdTAxNjlcXHUwMTZCXFx1MDE2RFxcdTAxNkZcXHUwMTcxXFx1MDE3M1xcdTAxNzVcXHUwMTc3XFx1MDE3QVxcdTAxN0NcXHUwMTdFLVxcdTAxODBcXHUwMTgzXFx1MDE4NVxcdTAxODhcXHUwMThDXFx1MDE4RFxcdTAxOTJcXHUwMTk1XFx1MDE5OS1cXHUwMTlCXFx1MDE5RVxcdTAxQTFcXHUwMUEzXFx1MDFBNVxcdTAxQThcXHUwMUFBXFx1MDFBQlxcdTAxQURcXHUwMUIwXFx1MDFCNFxcdTAxQjZcXHUwMUI5XFx1MDFCQVxcdTAxQkQtXFx1MDFCRlxcdTAxQzZcXHUwMUM5XFx1MDFDQ1xcdTAxQ0VcXHUwMUQwXFx1MDFEMlxcdTAxRDRcXHUwMUQ2XFx1MDFEOFxcdTAxREFcXHUwMURDXFx1MDFERFxcdTAxREZcXHUwMUUxXFx1MDFFM1xcdTAxRTVcXHUwMUU3XFx1MDFFOVxcdTAxRUJcXHUwMUVEXFx1MDFFRlxcdTAxRjBcXHUwMUYzXFx1MDFGNVxcdTAxRjlcXHUwMUZCXFx1MDFGRFxcdTAxRkZcXHUwMjAxXFx1MDIwM1xcdTAyMDVcXHUwMjA3XFx1MDIwOVxcdTAyMEJcXHUwMjBEXFx1MDIwRlxcdTAyMTFcXHUwMjEzXFx1MDIxNVxcdTAyMTdcXHUwMjE5XFx1MDIxQlxcdTAyMURcXHUwMjFGXFx1MDIyMVxcdTAyMjNcXHUwMjI1XFx1MDIyN1xcdTAyMjlcXHUwMjJCXFx1MDIyRFxcdTAyMkZcXHUwMjMxXFx1MDIzMy1cXHUwMjM5XFx1MDIzQ1xcdTAyM0ZcXHUwMjQwXFx1MDI0MlxcdTAyNDdcXHUwMjQ5XFx1MDI0QlxcdTAyNERcXHUwMjRGLVxcdTAyOTNcXHUwMjk1LVxcdTAyQUZcXHUwMzcxXFx1MDM3M1xcdTAzNzdcXHUwMzdCLVxcdTAzN0RcXHUwMzkwXFx1MDNBQy1cXHUwM0NFXFx1MDNEMFxcdTAzRDFcXHUwM0Q1LVxcdTAzRDdcXHUwM0Q5XFx1MDNEQlxcdTAzRERcXHUwM0RGXFx1MDNFMVxcdTAzRTNcXHUwM0U1XFx1MDNFN1xcdTAzRTlcXHUwM0VCXFx1MDNFRFxcdTAzRUYtXFx1MDNGM1xcdTAzRjVcXHUwM0Y4XFx1MDNGQlxcdTAzRkNcXHUwNDMwLVxcdTA0NUZcXHUwNDYxXFx1MDQ2M1xcdTA0NjVcXHUwNDY3XFx1MDQ2OVxcdTA0NkJcXHUwNDZEXFx1MDQ2RlxcdTA0NzFcXHUwNDczXFx1MDQ3NVxcdTA0NzdcXHUwNDc5XFx1MDQ3QlxcdTA0N0RcXHUwNDdGXFx1MDQ4MVxcdTA0OEJcXHUwNDhEXFx1MDQ4RlxcdTA0OTFcXHUwNDkzXFx1MDQ5NVxcdTA0OTdcXHUwNDk5XFx1MDQ5QlxcdTA0OURcXHUwNDlGXFx1MDRBMVxcdTA0QTNcXHUwNEE1XFx1MDRBN1xcdTA0QTlcXHUwNEFCXFx1MDRBRFxcdTA0QUZcXHUwNEIxXFx1MDRCM1xcdTA0QjVcXHUwNEI3XFx1MDRCOVxcdTA0QkJcXHUwNEJEXFx1MDRCRlxcdTA0QzJcXHUwNEM0XFx1MDRDNlxcdTA0QzhcXHUwNENBXFx1MDRDQ1xcdTA0Q0VcXHUwNENGXFx1MDREMVxcdTA0RDNcXHUwNEQ1XFx1MDREN1xcdTA0RDlcXHUwNERCXFx1MDRERFxcdTA0REZcXHUwNEUxXFx1MDRFM1xcdTA0RTVcXHUwNEU3XFx1MDRFOVxcdTA0RUJcXHUwNEVEXFx1MDRFRlxcdTA0RjFcXHUwNEYzXFx1MDRGNVxcdTA0RjdcXHUwNEY5XFx1MDRGQlxcdTA0RkRcXHUwNEZGXFx1MDUwMVxcdTA1MDNcXHUwNTA1XFx1MDUwN1xcdTA1MDlcXHUwNTBCXFx1MDUwRFxcdTA1MEZcXHUwNTExXFx1MDUxM1xcdTA1MTVcXHUwNTE3XFx1MDUxOVxcdTA1MUJcXHUwNTFEXFx1MDUxRlxcdTA1MjFcXHUwNTIzXFx1MDUyNVxcdTA1MjdcXHUwNTI5XFx1MDUyQlxcdTA1MkRcXHUwNTJGXFx1MDU2MS1cXHUwNTg3XFx1MTNGOC1cXHUxM0ZEXFx1MUQwMC1cXHUxRDJCXFx1MUQ2Qi1cXHUxRDc3XFx1MUQ3OS1cXHUxRDlBXFx1MUUwMVxcdTFFMDNcXHUxRTA1XFx1MUUwN1xcdTFFMDlcXHUxRTBCXFx1MUUwRFxcdTFFMEZcXHUxRTExXFx1MUUxM1xcdTFFMTVcXHUxRTE3XFx1MUUxOVxcdTFFMUJcXHUxRTFEXFx1MUUxRlxcdTFFMjFcXHUxRTIzXFx1MUUyNVxcdTFFMjdcXHUxRTI5XFx1MUUyQlxcdTFFMkRcXHUxRTJGXFx1MUUzMVxcdTFFMzNcXHUxRTM1XFx1MUUzN1xcdTFFMzlcXHUxRTNCXFx1MUUzRFxcdTFFM0ZcXHUxRTQxXFx1MUU0M1xcdTFFNDVcXHUxRTQ3XFx1MUU0OVxcdTFFNEJcXHUxRTREXFx1MUU0RlxcdTFFNTFcXHUxRTUzXFx1MUU1NVxcdTFFNTdcXHUxRTU5XFx1MUU1QlxcdTFFNURcXHUxRTVGXFx1MUU2MVxcdTFFNjNcXHUxRTY1XFx1MUU2N1xcdTFFNjlcXHUxRTZCXFx1MUU2RFxcdTFFNkZcXHUxRTcxXFx1MUU3M1xcdTFFNzVcXHUxRTc3XFx1MUU3OVxcdTFFN0JcXHUxRTdEXFx1MUU3RlxcdTFFODFcXHUxRTgzXFx1MUU4NVxcdTFFODdcXHUxRTg5XFx1MUU4QlxcdTFFOERcXHUxRThGXFx1MUU5MVxcdTFFOTNcXHUxRTk1LVxcdTFFOURcXHUxRTlGXFx1MUVBMVxcdTFFQTNcXHUxRUE1XFx1MUVBN1xcdTFFQTlcXHUxRUFCXFx1MUVBRFxcdTFFQUZcXHUxRUIxXFx1MUVCM1xcdTFFQjVcXHUxRUI3XFx1MUVCOVxcdTFFQkJcXHUxRUJEXFx1MUVCRlxcdTFFQzFcXHUxRUMzXFx1MUVDNVxcdTFFQzdcXHUxRUM5XFx1MUVDQlxcdTFFQ0RcXHUxRUNGXFx1MUVEMVxcdTFFRDNcXHUxRUQ1XFx1MUVEN1xcdTFFRDlcXHUxRURCXFx1MUVERFxcdTFFREZcXHUxRUUxXFx1MUVFM1xcdTFFRTVcXHUxRUU3XFx1MUVFOVxcdTFFRUJcXHUxRUVEXFx1MUVFRlxcdTFFRjFcXHUxRUYzXFx1MUVGNVxcdTFFRjdcXHUxRUY5XFx1MUVGQlxcdTFFRkRcXHUxRUZGLVxcdTFGMDdcXHUxRjEwLVxcdTFGMTVcXHUxRjIwLVxcdTFGMjdcXHUxRjMwLVxcdTFGMzdcXHUxRjQwLVxcdTFGNDVcXHUxRjUwLVxcdTFGNTdcXHUxRjYwLVxcdTFGNjdcXHUxRjcwLVxcdTFGN0RcXHUxRjgwLVxcdTFGODdcXHUxRjkwLVxcdTFGOTdcXHUxRkEwLVxcdTFGQTdcXHUxRkIwLVxcdTFGQjRcXHUxRkI2XFx1MUZCN1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2XFx1MUZDN1xcdTFGRDAtXFx1MUZEM1xcdTFGRDZcXHUxRkQ3XFx1MUZFMC1cXHUxRkU3XFx1MUZGMi1cXHUxRkY0XFx1MUZGNlxcdTFGRjdcXHUyMTBBXFx1MjEwRVxcdTIxMEZcXHUyMTEzXFx1MjEyRlxcdTIxMzRcXHUyMTM5XFx1MjEzQ1xcdTIxM0RcXHUyMTQ2LVxcdTIxNDlcXHUyMTRFXFx1MjE4NFxcdTJDMzAtXFx1MkM1RVxcdTJDNjFcXHUyQzY1XFx1MkM2NlxcdTJDNjhcXHUyQzZBXFx1MkM2Q1xcdTJDNzFcXHUyQzczXFx1MkM3NFxcdTJDNzYtXFx1MkM3QlxcdTJDODFcXHUyQzgzXFx1MkM4NVxcdTJDODdcXHUyQzg5XFx1MkM4QlxcdTJDOERcXHUyQzhGXFx1MkM5MVxcdTJDOTNcXHUyQzk1XFx1MkM5N1xcdTJDOTlcXHUyQzlCXFx1MkM5RFxcdTJDOUZcXHUyQ0ExXFx1MkNBM1xcdTJDQTVcXHUyQ0E3XFx1MkNBOVxcdTJDQUJcXHUyQ0FEXFx1MkNBRlxcdTJDQjFcXHUyQ0IzXFx1MkNCNVxcdTJDQjdcXHUyQ0I5XFx1MkNCQlxcdTJDQkRcXHUyQ0JGXFx1MkNDMVxcdTJDQzNcXHUyQ0M1XFx1MkNDN1xcdTJDQzlcXHUyQ0NCXFx1MkNDRFxcdTJDQ0ZcXHUyQ0QxXFx1MkNEM1xcdTJDRDVcXHUyQ0Q3XFx1MkNEOVxcdTJDREJcXHUyQ0REXFx1MkNERlxcdTJDRTFcXHUyQ0UzXFx1MkNFNFxcdTJDRUNcXHUyQ0VFXFx1MkNGM1xcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1QTY0MVxcdUE2NDNcXHVBNjQ1XFx1QTY0N1xcdUE2NDlcXHVBNjRCXFx1QTY0RFxcdUE2NEZcXHVBNjUxXFx1QTY1M1xcdUE2NTVcXHVBNjU3XFx1QTY1OVxcdUE2NUJcXHVBNjVEXFx1QTY1RlxcdUE2NjFcXHVBNjYzXFx1QTY2NVxcdUE2NjdcXHVBNjY5XFx1QTY2QlxcdUE2NkRcXHVBNjgxXFx1QTY4M1xcdUE2ODVcXHVBNjg3XFx1QTY4OVxcdUE2OEJcXHVBNjhEXFx1QTY4RlxcdUE2OTFcXHVBNjkzXFx1QTY5NVxcdUE2OTdcXHVBNjk5XFx1QTY5QlxcdUE3MjNcXHVBNzI1XFx1QTcyN1xcdUE3MjlcXHVBNzJCXFx1QTcyRFxcdUE3MkYtXFx1QTczMVxcdUE3MzNcXHVBNzM1XFx1QTczN1xcdUE3MzlcXHVBNzNCXFx1QTczRFxcdUE3M0ZcXHVBNzQxXFx1QTc0M1xcdUE3NDVcXHVBNzQ3XFx1QTc0OVxcdUE3NEJcXHVBNzREXFx1QTc0RlxcdUE3NTFcXHVBNzUzXFx1QTc1NVxcdUE3NTdcXHVBNzU5XFx1QTc1QlxcdUE3NURcXHVBNzVGXFx1QTc2MVxcdUE3NjNcXHVBNzY1XFx1QTc2N1xcdUE3NjlcXHVBNzZCXFx1QTc2RFxcdUE3NkZcXHVBNzcxLVxcdUE3NzhcXHVBNzdBXFx1QTc3Q1xcdUE3N0ZcXHVBNzgxXFx1QTc4M1xcdUE3ODVcXHVBNzg3XFx1QTc4Q1xcdUE3OEVcXHVBNzkxXFx1QTc5My1cXHVBNzk1XFx1QTc5N1xcdUE3OTlcXHVBNzlCXFx1QTc5RFxcdUE3OUZcXHVBN0ExXFx1QTdBM1xcdUE3QTVcXHVBN0E3XFx1QTdBOVxcdUE3QjVcXHVBN0I3XFx1QTdGQVxcdUFCMzAtXFx1QUI1QVxcdUFCNjAtXFx1QUI2NVxcdUFCNzAtXFx1QUJCRlxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZGNDEtXFx1RkY1QTAtOVxceEIyXFx4QjNcXHhCOVxceEJDLVxceEJFXFx1MDY2MC1cXHUwNjY5XFx1MDZGMC1cXHUwNkY5XFx1MDdDMC1cXHUwN0M5XFx1MDk2Ni1cXHUwOTZGXFx1MDlFNi1cXHUwOUVGXFx1MDlGNC1cXHUwOUY5XFx1MEE2Ni1cXHUwQTZGXFx1MEFFNi1cXHUwQUVGXFx1MEI2Ni1cXHUwQjZGXFx1MEI3Mi1cXHUwQjc3XFx1MEJFNi1cXHUwQkYyXFx1MEM2Ni1cXHUwQzZGXFx1MEM3OC1cXHUwQzdFXFx1MENFNi1cXHUwQ0VGXFx1MEQ2Ni1cXHUwRDc1XFx1MERFNi1cXHUwREVGXFx1MEU1MC1cXHUwRTU5XFx1MEVEMC1cXHUwRUQ5XFx1MEYyMC1cXHUwRjMzXFx1MTA0MC1cXHUxMDQ5XFx1MTA5MC1cXHUxMDk5XFx1MTM2OS1cXHUxMzdDXFx1MTZFRS1cXHUxNkYwXFx1MTdFMC1cXHUxN0U5XFx1MTdGMC1cXHUxN0Y5XFx1MTgxMC1cXHUxODE5XFx1MTk0Ni1cXHUxOTRGXFx1MTlEMC1cXHUxOURBXFx1MUE4MC1cXHUxQTg5XFx1MUE5MC1cXHUxQTk5XFx1MUI1MC1cXHUxQjU5XFx1MUJCMC1cXHUxQkI5XFx1MUM0MC1cXHUxQzQ5XFx1MUM1MC1cXHUxQzU5XFx1MjA3MFxcdTIwNzQtXFx1MjA3OVxcdTIwODAtXFx1MjA4OVxcdTIxNTAtXFx1MjE4MlxcdTIxODUtXFx1MjE4OVxcdTI0NjAtXFx1MjQ5QlxcdTI0RUEtXFx1MjRGRlxcdTI3NzYtXFx1Mjc5M1xcdTJDRkRcXHUzMDA3XFx1MzAyMS1cXHUzMDI5XFx1MzAzOC1cXHUzMDNBXFx1MzE5Mi1cXHUzMTk1XFx1MzIyMC1cXHUzMjI5XFx1MzI0OC1cXHUzMjRGXFx1MzI1MS1cXHUzMjVGXFx1MzI4MC1cXHUzMjg5XFx1MzJCMS1cXHUzMkJGXFx1QTYyMC1cXHVBNjI5XFx1QTZFNi1cXHVBNkVGXFx1QTgzMC1cXHVBODM1XFx1QThEMC1cXHVBOEQ5XFx1QTkwMC1cXHVBOTA5XFx1QTlEMC1cXHVBOUQ5XFx1QTlGMC1cXHVBOUY5XFx1QUE1MC1cXHVBQTU5XFx1QUJGMC1cXHVBQkY5XFx1RkYxMC1cXHVGRjE5XSkoW0EtWlxceEMwLVxceEQ2XFx4RDgtXFx4REVcXHUwMTAwXFx1MDEwMlxcdTAxMDRcXHUwMTA2XFx1MDEwOFxcdTAxMEFcXHUwMTBDXFx1MDEwRVxcdTAxMTBcXHUwMTEyXFx1MDExNFxcdTAxMTZcXHUwMTE4XFx1MDExQVxcdTAxMUNcXHUwMTFFXFx1MDEyMFxcdTAxMjJcXHUwMTI0XFx1MDEyNlxcdTAxMjhcXHUwMTJBXFx1MDEyQ1xcdTAxMkVcXHUwMTMwXFx1MDEzMlxcdTAxMzRcXHUwMTM2XFx1MDEzOVxcdTAxM0JcXHUwMTNEXFx1MDEzRlxcdTAxNDFcXHUwMTQzXFx1MDE0NVxcdTAxNDdcXHUwMTRBXFx1MDE0Q1xcdTAxNEVcXHUwMTUwXFx1MDE1MlxcdTAxNTRcXHUwMTU2XFx1MDE1OFxcdTAxNUFcXHUwMTVDXFx1MDE1RVxcdTAxNjBcXHUwMTYyXFx1MDE2NFxcdTAxNjZcXHUwMTY4XFx1MDE2QVxcdTAxNkNcXHUwMTZFXFx1MDE3MFxcdTAxNzJcXHUwMTc0XFx1MDE3NlxcdTAxNzhcXHUwMTc5XFx1MDE3QlxcdTAxN0RcXHUwMTgxXFx1MDE4MlxcdTAxODRcXHUwMTg2XFx1MDE4N1xcdTAxODktXFx1MDE4QlxcdTAxOEUtXFx1MDE5MVxcdTAxOTNcXHUwMTk0XFx1MDE5Ni1cXHUwMTk4XFx1MDE5Q1xcdTAxOURcXHUwMTlGXFx1MDFBMFxcdTAxQTJcXHUwMUE0XFx1MDFBNlxcdTAxQTdcXHUwMUE5XFx1MDFBQ1xcdTAxQUVcXHUwMUFGXFx1MDFCMS1cXHUwMUIzXFx1MDFCNVxcdTAxQjdcXHUwMUI4XFx1MDFCQ1xcdTAxQzRcXHUwMUM3XFx1MDFDQVxcdTAxQ0RcXHUwMUNGXFx1MDFEMVxcdTAxRDNcXHUwMUQ1XFx1MDFEN1xcdTAxRDlcXHUwMURCXFx1MDFERVxcdTAxRTBcXHUwMUUyXFx1MDFFNFxcdTAxRTZcXHUwMUU4XFx1MDFFQVxcdTAxRUNcXHUwMUVFXFx1MDFGMVxcdTAxRjRcXHUwMUY2LVxcdTAxRjhcXHUwMUZBXFx1MDFGQ1xcdTAxRkVcXHUwMjAwXFx1MDIwMlxcdTAyMDRcXHUwMjA2XFx1MDIwOFxcdTAyMEFcXHUwMjBDXFx1MDIwRVxcdTAyMTBcXHUwMjEyXFx1MDIxNFxcdTAyMTZcXHUwMjE4XFx1MDIxQVxcdTAyMUNcXHUwMjFFXFx1MDIyMFxcdTAyMjJcXHUwMjI0XFx1MDIyNlxcdTAyMjhcXHUwMjJBXFx1MDIyQ1xcdTAyMkVcXHUwMjMwXFx1MDIzMlxcdTAyM0FcXHUwMjNCXFx1MDIzRFxcdTAyM0VcXHUwMjQxXFx1MDI0My1cXHUwMjQ2XFx1MDI0OFxcdTAyNEFcXHUwMjRDXFx1MDI0RVxcdTAzNzBcXHUwMzcyXFx1MDM3NlxcdTAzN0ZcXHUwMzg2XFx1MDM4OC1cXHUwMzhBXFx1MDM4Q1xcdTAzOEVcXHUwMzhGXFx1MDM5MS1cXHUwM0ExXFx1MDNBMy1cXHUwM0FCXFx1MDNDRlxcdTAzRDItXFx1MDNENFxcdTAzRDhcXHUwM0RBXFx1MDNEQ1xcdTAzREVcXHUwM0UwXFx1MDNFMlxcdTAzRTRcXHUwM0U2XFx1MDNFOFxcdTAzRUFcXHUwM0VDXFx1MDNFRVxcdTAzRjRcXHUwM0Y3XFx1MDNGOVxcdTAzRkFcXHUwM0ZELVxcdTA0MkZcXHUwNDYwXFx1MDQ2MlxcdTA0NjRcXHUwNDY2XFx1MDQ2OFxcdTA0NkFcXHUwNDZDXFx1MDQ2RVxcdTA0NzBcXHUwNDcyXFx1MDQ3NFxcdTA0NzZcXHUwNDc4XFx1MDQ3QVxcdTA0N0NcXHUwNDdFXFx1MDQ4MFxcdTA0OEFcXHUwNDhDXFx1MDQ4RVxcdTA0OTBcXHUwNDkyXFx1MDQ5NFxcdTA0OTZcXHUwNDk4XFx1MDQ5QVxcdTA0OUNcXHUwNDlFXFx1MDRBMFxcdTA0QTJcXHUwNEE0XFx1MDRBNlxcdTA0QThcXHUwNEFBXFx1MDRBQ1xcdTA0QUVcXHUwNEIwXFx1MDRCMlxcdTA0QjRcXHUwNEI2XFx1MDRCOFxcdTA0QkFcXHUwNEJDXFx1MDRCRVxcdTA0QzBcXHUwNEMxXFx1MDRDM1xcdTA0QzVcXHUwNEM3XFx1MDRDOVxcdTA0Q0JcXHUwNENEXFx1MDREMFxcdTA0RDJcXHUwNEQ0XFx1MDRENlxcdTA0RDhcXHUwNERBXFx1MDREQ1xcdTA0REVcXHUwNEUwXFx1MDRFMlxcdTA0RTRcXHUwNEU2XFx1MDRFOFxcdTA0RUFcXHUwNEVDXFx1MDRFRVxcdTA0RjBcXHUwNEYyXFx1MDRGNFxcdTA0RjZcXHUwNEY4XFx1MDRGQVxcdTA0RkNcXHUwNEZFXFx1MDUwMFxcdTA1MDJcXHUwNTA0XFx1MDUwNlxcdTA1MDhcXHUwNTBBXFx1MDUwQ1xcdTA1MEVcXHUwNTEwXFx1MDUxMlxcdTA1MTRcXHUwNTE2XFx1MDUxOFxcdTA1MUFcXHUwNTFDXFx1MDUxRVxcdTA1MjBcXHUwNTIyXFx1MDUyNFxcdTA1MjZcXHUwNTI4XFx1MDUyQVxcdTA1MkNcXHUwNTJFXFx1MDUzMS1cXHUwNTU2XFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxM0EwLVxcdTEzRjVcXHUxRTAwXFx1MUUwMlxcdTFFMDRcXHUxRTA2XFx1MUUwOFxcdTFFMEFcXHUxRTBDXFx1MUUwRVxcdTFFMTBcXHUxRTEyXFx1MUUxNFxcdTFFMTZcXHUxRTE4XFx1MUUxQVxcdTFFMUNcXHUxRTFFXFx1MUUyMFxcdTFFMjJcXHUxRTI0XFx1MUUyNlxcdTFFMjhcXHUxRTJBXFx1MUUyQ1xcdTFFMkVcXHUxRTMwXFx1MUUzMlxcdTFFMzRcXHUxRTM2XFx1MUUzOFxcdTFFM0FcXHUxRTNDXFx1MUUzRVxcdTFFNDBcXHUxRTQyXFx1MUU0NFxcdTFFNDZcXHUxRTQ4XFx1MUU0QVxcdTFFNENcXHUxRTRFXFx1MUU1MFxcdTFFNTJcXHUxRTU0XFx1MUU1NlxcdTFFNThcXHUxRTVBXFx1MUU1Q1xcdTFFNUVcXHUxRTYwXFx1MUU2MlxcdTFFNjRcXHUxRTY2XFx1MUU2OFxcdTFFNkFcXHUxRTZDXFx1MUU2RVxcdTFFNzBcXHUxRTcyXFx1MUU3NFxcdTFFNzZcXHUxRTc4XFx1MUU3QVxcdTFFN0NcXHUxRTdFXFx1MUU4MFxcdTFFODJcXHUxRTg0XFx1MUU4NlxcdTFFODhcXHUxRThBXFx1MUU4Q1xcdTFFOEVcXHUxRTkwXFx1MUU5MlxcdTFFOTRcXHUxRTlFXFx1MUVBMFxcdTFFQTJcXHUxRUE0XFx1MUVBNlxcdTFFQThcXHUxRUFBXFx1MUVBQ1xcdTFFQUVcXHUxRUIwXFx1MUVCMlxcdTFFQjRcXHUxRUI2XFx1MUVCOFxcdTFFQkFcXHUxRUJDXFx1MUVCRVxcdTFFQzBcXHUxRUMyXFx1MUVDNFxcdTFFQzZcXHUxRUM4XFx1MUVDQVxcdTFFQ0NcXHUxRUNFXFx1MUVEMFxcdTFFRDJcXHUxRUQ0XFx1MUVENlxcdTFFRDhcXHUxRURBXFx1MUVEQ1xcdTFFREVcXHUxRUUwXFx1MUVFMlxcdTFFRTRcXHUxRUU2XFx1MUVFOFxcdTFFRUFcXHUxRUVDXFx1MUVFRVxcdTFFRjBcXHUxRUYyXFx1MUVGNFxcdTFFRjZcXHUxRUY4XFx1MUVGQVxcdTFFRkNcXHUxRUZFXFx1MUYwOC1cXHUxRjBGXFx1MUYxOC1cXHUxRjFEXFx1MUYyOC1cXHUxRjJGXFx1MUYzOC1cXHUxRjNGXFx1MUY0OC1cXHUxRjREXFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1RlxcdTFGNjgtXFx1MUY2RlxcdTFGQjgtXFx1MUZCQlxcdTFGQzgtXFx1MUZDQlxcdTFGRDgtXFx1MUZEQlxcdTFGRTgtXFx1MUZFQ1xcdTFGRjgtXFx1MUZGQlxcdTIxMDJcXHUyMTA3XFx1MjEwQi1cXHUyMTBEXFx1MjExMC1cXHUyMTEyXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMzAtXFx1MjEzM1xcdTIxM0VcXHUyMTNGXFx1MjE0NVxcdTIxODNcXHUyQzAwLVxcdTJDMkVcXHUyQzYwXFx1MkM2Mi1cXHUyQzY0XFx1MkM2N1xcdTJDNjlcXHUyQzZCXFx1MkM2RC1cXHUyQzcwXFx1MkM3MlxcdTJDNzVcXHUyQzdFLVxcdTJDODBcXHUyQzgyXFx1MkM4NFxcdTJDODZcXHUyQzg4XFx1MkM4QVxcdTJDOENcXHUyQzhFXFx1MkM5MFxcdTJDOTJcXHUyQzk0XFx1MkM5NlxcdTJDOThcXHUyQzlBXFx1MkM5Q1xcdTJDOUVcXHUyQ0EwXFx1MkNBMlxcdTJDQTRcXHUyQ0E2XFx1MkNBOFxcdTJDQUFcXHUyQ0FDXFx1MkNBRVxcdTJDQjBcXHUyQ0IyXFx1MkNCNFxcdTJDQjZcXHUyQ0I4XFx1MkNCQVxcdTJDQkNcXHUyQ0JFXFx1MkNDMFxcdTJDQzJcXHUyQ0M0XFx1MkNDNlxcdTJDQzhcXHUyQ0NBXFx1MkNDQ1xcdTJDQ0VcXHUyQ0QwXFx1MkNEMlxcdTJDRDRcXHUyQ0Q2XFx1MkNEOFxcdTJDREFcXHUyQ0RDXFx1MkNERVxcdTJDRTBcXHUyQ0UyXFx1MkNFQlxcdTJDRURcXHUyQ0YyXFx1QTY0MFxcdUE2NDJcXHVBNjQ0XFx1QTY0NlxcdUE2NDhcXHVBNjRBXFx1QTY0Q1xcdUE2NEVcXHVBNjUwXFx1QTY1MlxcdUE2NTRcXHVBNjU2XFx1QTY1OFxcdUE2NUFcXHVBNjVDXFx1QTY1RVxcdUE2NjBcXHVBNjYyXFx1QTY2NFxcdUE2NjZcXHVBNjY4XFx1QTY2QVxcdUE2NkNcXHVBNjgwXFx1QTY4MlxcdUE2ODRcXHVBNjg2XFx1QTY4OFxcdUE2OEFcXHVBNjhDXFx1QTY4RVxcdUE2OTBcXHVBNjkyXFx1QTY5NFxcdUE2OTZcXHVBNjk4XFx1QTY5QVxcdUE3MjJcXHVBNzI0XFx1QTcyNlxcdUE3MjhcXHVBNzJBXFx1QTcyQ1xcdUE3MkVcXHVBNzMyXFx1QTczNFxcdUE3MzZcXHVBNzM4XFx1QTczQVxcdUE3M0NcXHVBNzNFXFx1QTc0MFxcdUE3NDJcXHVBNzQ0XFx1QTc0NlxcdUE3NDhcXHVBNzRBXFx1QTc0Q1xcdUE3NEVcXHVBNzUwXFx1QTc1MlxcdUE3NTRcXHVBNzU2XFx1QTc1OFxcdUE3NUFcXHVBNzVDXFx1QTc1RVxcdUE3NjBcXHVBNzYyXFx1QTc2NFxcdUE3NjZcXHVBNzY4XFx1QTc2QVxcdUE3NkNcXHVBNzZFXFx1QTc3OVxcdUE3N0JcXHVBNzdEXFx1QTc3RVxcdUE3ODBcXHVBNzgyXFx1QTc4NFxcdUE3ODZcXHVBNzhCXFx1QTc4RFxcdUE3OTBcXHVBNzkyXFx1QTc5NlxcdUE3OThcXHVBNzlBXFx1QTc5Q1xcdUE3OUVcXHVBN0EwXFx1QTdBMlxcdUE3QTRcXHVBN0E2XFx1QTdBOFxcdUE3QUEtXFx1QTdBRFxcdUE3QjAtXFx1QTdCNFxcdUE3QjZcXHVGRjIxLVxcdUZGM0FdKS9nXG4iLCJtb2R1bGUuZXhwb3J0cyA9IC8oW0EtWlxceEMwLVxceEQ2XFx4RDgtXFx4REVcXHUwMTAwXFx1MDEwMlxcdTAxMDRcXHUwMTA2XFx1MDEwOFxcdTAxMEFcXHUwMTBDXFx1MDEwRVxcdTAxMTBcXHUwMTEyXFx1MDExNFxcdTAxMTZcXHUwMTE4XFx1MDExQVxcdTAxMUNcXHUwMTFFXFx1MDEyMFxcdTAxMjJcXHUwMTI0XFx1MDEyNlxcdTAxMjhcXHUwMTJBXFx1MDEyQ1xcdTAxMkVcXHUwMTMwXFx1MDEzMlxcdTAxMzRcXHUwMTM2XFx1MDEzOVxcdTAxM0JcXHUwMTNEXFx1MDEzRlxcdTAxNDFcXHUwMTQzXFx1MDE0NVxcdTAxNDdcXHUwMTRBXFx1MDE0Q1xcdTAxNEVcXHUwMTUwXFx1MDE1MlxcdTAxNTRcXHUwMTU2XFx1MDE1OFxcdTAxNUFcXHUwMTVDXFx1MDE1RVxcdTAxNjBcXHUwMTYyXFx1MDE2NFxcdTAxNjZcXHUwMTY4XFx1MDE2QVxcdTAxNkNcXHUwMTZFXFx1MDE3MFxcdTAxNzJcXHUwMTc0XFx1MDE3NlxcdTAxNzhcXHUwMTc5XFx1MDE3QlxcdTAxN0RcXHUwMTgxXFx1MDE4MlxcdTAxODRcXHUwMTg2XFx1MDE4N1xcdTAxODktXFx1MDE4QlxcdTAxOEUtXFx1MDE5MVxcdTAxOTNcXHUwMTk0XFx1MDE5Ni1cXHUwMTk4XFx1MDE5Q1xcdTAxOURcXHUwMTlGXFx1MDFBMFxcdTAxQTJcXHUwMUE0XFx1MDFBNlxcdTAxQTdcXHUwMUE5XFx1MDFBQ1xcdTAxQUVcXHUwMUFGXFx1MDFCMS1cXHUwMUIzXFx1MDFCNVxcdTAxQjdcXHUwMUI4XFx1MDFCQ1xcdTAxQzRcXHUwMUM3XFx1MDFDQVxcdTAxQ0RcXHUwMUNGXFx1MDFEMVxcdTAxRDNcXHUwMUQ1XFx1MDFEN1xcdTAxRDlcXHUwMURCXFx1MDFERVxcdTAxRTBcXHUwMUUyXFx1MDFFNFxcdTAxRTZcXHUwMUU4XFx1MDFFQVxcdTAxRUNcXHUwMUVFXFx1MDFGMVxcdTAxRjRcXHUwMUY2LVxcdTAxRjhcXHUwMUZBXFx1MDFGQ1xcdTAxRkVcXHUwMjAwXFx1MDIwMlxcdTAyMDRcXHUwMjA2XFx1MDIwOFxcdTAyMEFcXHUwMjBDXFx1MDIwRVxcdTAyMTBcXHUwMjEyXFx1MDIxNFxcdTAyMTZcXHUwMjE4XFx1MDIxQVxcdTAyMUNcXHUwMjFFXFx1MDIyMFxcdTAyMjJcXHUwMjI0XFx1MDIyNlxcdTAyMjhcXHUwMjJBXFx1MDIyQ1xcdTAyMkVcXHUwMjMwXFx1MDIzMlxcdTAyM0FcXHUwMjNCXFx1MDIzRFxcdTAyM0VcXHUwMjQxXFx1MDI0My1cXHUwMjQ2XFx1MDI0OFxcdTAyNEFcXHUwMjRDXFx1MDI0RVxcdTAzNzBcXHUwMzcyXFx1MDM3NlxcdTAzN0ZcXHUwMzg2XFx1MDM4OC1cXHUwMzhBXFx1MDM4Q1xcdTAzOEVcXHUwMzhGXFx1MDM5MS1cXHUwM0ExXFx1MDNBMy1cXHUwM0FCXFx1MDNDRlxcdTAzRDItXFx1MDNENFxcdTAzRDhcXHUwM0RBXFx1MDNEQ1xcdTAzREVcXHUwM0UwXFx1MDNFMlxcdTAzRTRcXHUwM0U2XFx1MDNFOFxcdTAzRUFcXHUwM0VDXFx1MDNFRVxcdTAzRjRcXHUwM0Y3XFx1MDNGOVxcdTAzRkFcXHUwM0ZELVxcdTA0MkZcXHUwNDYwXFx1MDQ2MlxcdTA0NjRcXHUwNDY2XFx1MDQ2OFxcdTA0NkFcXHUwNDZDXFx1MDQ2RVxcdTA0NzBcXHUwNDcyXFx1MDQ3NFxcdTA0NzZcXHUwNDc4XFx1MDQ3QVxcdTA0N0NcXHUwNDdFXFx1MDQ4MFxcdTA0OEFcXHUwNDhDXFx1MDQ4RVxcdTA0OTBcXHUwNDkyXFx1MDQ5NFxcdTA0OTZcXHUwNDk4XFx1MDQ5QVxcdTA0OUNcXHUwNDlFXFx1MDRBMFxcdTA0QTJcXHUwNEE0XFx1MDRBNlxcdTA0QThcXHUwNEFBXFx1MDRBQ1xcdTA0QUVcXHUwNEIwXFx1MDRCMlxcdTA0QjRcXHUwNEI2XFx1MDRCOFxcdTA0QkFcXHUwNEJDXFx1MDRCRVxcdTA0QzBcXHUwNEMxXFx1MDRDM1xcdTA0QzVcXHUwNEM3XFx1MDRDOVxcdTA0Q0JcXHUwNENEXFx1MDREMFxcdTA0RDJcXHUwNEQ0XFx1MDRENlxcdTA0RDhcXHUwNERBXFx1MDREQ1xcdTA0REVcXHUwNEUwXFx1MDRFMlxcdTA0RTRcXHUwNEU2XFx1MDRFOFxcdTA0RUFcXHUwNEVDXFx1MDRFRVxcdTA0RjBcXHUwNEYyXFx1MDRGNFxcdTA0RjZcXHUwNEY4XFx1MDRGQVxcdTA0RkNcXHUwNEZFXFx1MDUwMFxcdTA1MDJcXHUwNTA0XFx1MDUwNlxcdTA1MDhcXHUwNTBBXFx1MDUwQ1xcdTA1MEVcXHUwNTEwXFx1MDUxMlxcdTA1MTRcXHUwNTE2XFx1MDUxOFxcdTA1MUFcXHUwNTFDXFx1MDUxRVxcdTA1MjBcXHUwNTIyXFx1MDUyNFxcdTA1MjZcXHUwNTI4XFx1MDUyQVxcdTA1MkNcXHUwNTJFXFx1MDUzMS1cXHUwNTU2XFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxM0EwLVxcdTEzRjVcXHUxRTAwXFx1MUUwMlxcdTFFMDRcXHUxRTA2XFx1MUUwOFxcdTFFMEFcXHUxRTBDXFx1MUUwRVxcdTFFMTBcXHUxRTEyXFx1MUUxNFxcdTFFMTZcXHUxRTE4XFx1MUUxQVxcdTFFMUNcXHUxRTFFXFx1MUUyMFxcdTFFMjJcXHUxRTI0XFx1MUUyNlxcdTFFMjhcXHUxRTJBXFx1MUUyQ1xcdTFFMkVcXHUxRTMwXFx1MUUzMlxcdTFFMzRcXHUxRTM2XFx1MUUzOFxcdTFFM0FcXHUxRTNDXFx1MUUzRVxcdTFFNDBcXHUxRTQyXFx1MUU0NFxcdTFFNDZcXHUxRTQ4XFx1MUU0QVxcdTFFNENcXHUxRTRFXFx1MUU1MFxcdTFFNTJcXHUxRTU0XFx1MUU1NlxcdTFFNThcXHUxRTVBXFx1MUU1Q1xcdTFFNUVcXHUxRTYwXFx1MUU2MlxcdTFFNjRcXHUxRTY2XFx1MUU2OFxcdTFFNkFcXHUxRTZDXFx1MUU2RVxcdTFFNzBcXHUxRTcyXFx1MUU3NFxcdTFFNzZcXHUxRTc4XFx1MUU3QVxcdTFFN0NcXHUxRTdFXFx1MUU4MFxcdTFFODJcXHUxRTg0XFx1MUU4NlxcdTFFODhcXHUxRThBXFx1MUU4Q1xcdTFFOEVcXHUxRTkwXFx1MUU5MlxcdTFFOTRcXHUxRTlFXFx1MUVBMFxcdTFFQTJcXHUxRUE0XFx1MUVBNlxcdTFFQThcXHUxRUFBXFx1MUVBQ1xcdTFFQUVcXHUxRUIwXFx1MUVCMlxcdTFFQjRcXHUxRUI2XFx1MUVCOFxcdTFFQkFcXHUxRUJDXFx1MUVCRVxcdTFFQzBcXHUxRUMyXFx1MUVDNFxcdTFFQzZcXHUxRUM4XFx1MUVDQVxcdTFFQ0NcXHUxRUNFXFx1MUVEMFxcdTFFRDJcXHUxRUQ0XFx1MUVENlxcdTFFRDhcXHUxRURBXFx1MUVEQ1xcdTFFREVcXHUxRUUwXFx1MUVFMlxcdTFFRTRcXHUxRUU2XFx1MUVFOFxcdTFFRUFcXHUxRUVDXFx1MUVFRVxcdTFFRjBcXHUxRUYyXFx1MUVGNFxcdTFFRjZcXHUxRUY4XFx1MUVGQVxcdTFFRkNcXHUxRUZFXFx1MUYwOC1cXHUxRjBGXFx1MUYxOC1cXHUxRjFEXFx1MUYyOC1cXHUxRjJGXFx1MUYzOC1cXHUxRjNGXFx1MUY0OC1cXHUxRjREXFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1RlxcdTFGNjgtXFx1MUY2RlxcdTFGQjgtXFx1MUZCQlxcdTFGQzgtXFx1MUZDQlxcdTFGRDgtXFx1MUZEQlxcdTFGRTgtXFx1MUZFQ1xcdTFGRjgtXFx1MUZGQlxcdTIxMDJcXHUyMTA3XFx1MjEwQi1cXHUyMTBEXFx1MjExMC1cXHUyMTEyXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMzAtXFx1MjEzM1xcdTIxM0VcXHUyMTNGXFx1MjE0NVxcdTIxODNcXHUyQzAwLVxcdTJDMkVcXHUyQzYwXFx1MkM2Mi1cXHUyQzY0XFx1MkM2N1xcdTJDNjlcXHUyQzZCXFx1MkM2RC1cXHUyQzcwXFx1MkM3MlxcdTJDNzVcXHUyQzdFLVxcdTJDODBcXHUyQzgyXFx1MkM4NFxcdTJDODZcXHUyQzg4XFx1MkM4QVxcdTJDOENcXHUyQzhFXFx1MkM5MFxcdTJDOTJcXHUyQzk0XFx1MkM5NlxcdTJDOThcXHUyQzlBXFx1MkM5Q1xcdTJDOUVcXHUyQ0EwXFx1MkNBMlxcdTJDQTRcXHUyQ0E2XFx1MkNBOFxcdTJDQUFcXHUyQ0FDXFx1MkNBRVxcdTJDQjBcXHUyQ0IyXFx1MkNCNFxcdTJDQjZcXHUyQ0I4XFx1MkNCQVxcdTJDQkNcXHUyQ0JFXFx1MkNDMFxcdTJDQzJcXHUyQ0M0XFx1MkNDNlxcdTJDQzhcXHUyQ0NBXFx1MkNDQ1xcdTJDQ0VcXHUyQ0QwXFx1MkNEMlxcdTJDRDRcXHUyQ0Q2XFx1MkNEOFxcdTJDREFcXHUyQ0RDXFx1MkNERVxcdTJDRTBcXHUyQ0UyXFx1MkNFQlxcdTJDRURcXHUyQ0YyXFx1QTY0MFxcdUE2NDJcXHVBNjQ0XFx1QTY0NlxcdUE2NDhcXHVBNjRBXFx1QTY0Q1xcdUE2NEVcXHVBNjUwXFx1QTY1MlxcdUE2NTRcXHVBNjU2XFx1QTY1OFxcdUE2NUFcXHVBNjVDXFx1QTY1RVxcdUE2NjBcXHVBNjYyXFx1QTY2NFxcdUE2NjZcXHVBNjY4XFx1QTY2QVxcdUE2NkNcXHVBNjgwXFx1QTY4MlxcdUE2ODRcXHVBNjg2XFx1QTY4OFxcdUE2OEFcXHVBNjhDXFx1QTY4RVxcdUE2OTBcXHVBNjkyXFx1QTY5NFxcdUE2OTZcXHVBNjk4XFx1QTY5QVxcdUE3MjJcXHVBNzI0XFx1QTcyNlxcdUE3MjhcXHVBNzJBXFx1QTcyQ1xcdUE3MkVcXHVBNzMyXFx1QTczNFxcdUE3MzZcXHVBNzM4XFx1QTczQVxcdUE3M0NcXHVBNzNFXFx1QTc0MFxcdUE3NDJcXHVBNzQ0XFx1QTc0NlxcdUE3NDhcXHVBNzRBXFx1QTc0Q1xcdUE3NEVcXHVBNzUwXFx1QTc1MlxcdUE3NTRcXHVBNzU2XFx1QTc1OFxcdUE3NUFcXHVBNzVDXFx1QTc1RVxcdUE3NjBcXHVBNzYyXFx1QTc2NFxcdUE3NjZcXHVBNzY4XFx1QTc2QVxcdUE3NkNcXHVBNzZFXFx1QTc3OVxcdUE3N0JcXHVBNzdEXFx1QTc3RVxcdUE3ODBcXHVBNzgyXFx1QTc4NFxcdUE3ODZcXHVBNzhCXFx1QTc4RFxcdUE3OTBcXHVBNzkyXFx1QTc5NlxcdUE3OThcXHVBNzlBXFx1QTc5Q1xcdUE3OUVcXHVBN0EwXFx1QTdBMlxcdUE3QTRcXHVBN0E2XFx1QTdBOFxcdUE3QUEtXFx1QTdBRFxcdUE3QjAtXFx1QTdCNFxcdUE3QjZcXHVGRjIxLVxcdUZGM0FdKShbQS1aXFx4QzAtXFx4RDZcXHhEOC1cXHhERVxcdTAxMDBcXHUwMTAyXFx1MDEwNFxcdTAxMDZcXHUwMTA4XFx1MDEwQVxcdTAxMENcXHUwMTBFXFx1MDExMFxcdTAxMTJcXHUwMTE0XFx1MDExNlxcdTAxMThcXHUwMTFBXFx1MDExQ1xcdTAxMUVcXHUwMTIwXFx1MDEyMlxcdTAxMjRcXHUwMTI2XFx1MDEyOFxcdTAxMkFcXHUwMTJDXFx1MDEyRVxcdTAxMzBcXHUwMTMyXFx1MDEzNFxcdTAxMzZcXHUwMTM5XFx1MDEzQlxcdTAxM0RcXHUwMTNGXFx1MDE0MVxcdTAxNDNcXHUwMTQ1XFx1MDE0N1xcdTAxNEFcXHUwMTRDXFx1MDE0RVxcdTAxNTBcXHUwMTUyXFx1MDE1NFxcdTAxNTZcXHUwMTU4XFx1MDE1QVxcdTAxNUNcXHUwMTVFXFx1MDE2MFxcdTAxNjJcXHUwMTY0XFx1MDE2NlxcdTAxNjhcXHUwMTZBXFx1MDE2Q1xcdTAxNkVcXHUwMTcwXFx1MDE3MlxcdTAxNzRcXHUwMTc2XFx1MDE3OFxcdTAxNzlcXHUwMTdCXFx1MDE3RFxcdTAxODFcXHUwMTgyXFx1MDE4NFxcdTAxODZcXHUwMTg3XFx1MDE4OS1cXHUwMThCXFx1MDE4RS1cXHUwMTkxXFx1MDE5M1xcdTAxOTRcXHUwMTk2LVxcdTAxOThcXHUwMTlDXFx1MDE5RFxcdTAxOUZcXHUwMUEwXFx1MDFBMlxcdTAxQTRcXHUwMUE2XFx1MDFBN1xcdTAxQTlcXHUwMUFDXFx1MDFBRVxcdTAxQUZcXHUwMUIxLVxcdTAxQjNcXHUwMUI1XFx1MDFCN1xcdTAxQjhcXHUwMUJDXFx1MDFDNFxcdTAxQzdcXHUwMUNBXFx1MDFDRFxcdTAxQ0ZcXHUwMUQxXFx1MDFEM1xcdTAxRDVcXHUwMUQ3XFx1MDFEOVxcdTAxREJcXHUwMURFXFx1MDFFMFxcdTAxRTJcXHUwMUU0XFx1MDFFNlxcdTAxRThcXHUwMUVBXFx1MDFFQ1xcdTAxRUVcXHUwMUYxXFx1MDFGNFxcdTAxRjYtXFx1MDFGOFxcdTAxRkFcXHUwMUZDXFx1MDFGRVxcdTAyMDBcXHUwMjAyXFx1MDIwNFxcdTAyMDZcXHUwMjA4XFx1MDIwQVxcdTAyMENcXHUwMjBFXFx1MDIxMFxcdTAyMTJcXHUwMjE0XFx1MDIxNlxcdTAyMThcXHUwMjFBXFx1MDIxQ1xcdTAyMUVcXHUwMjIwXFx1MDIyMlxcdTAyMjRcXHUwMjI2XFx1MDIyOFxcdTAyMkFcXHUwMjJDXFx1MDIyRVxcdTAyMzBcXHUwMjMyXFx1MDIzQVxcdTAyM0JcXHUwMjNEXFx1MDIzRVxcdTAyNDFcXHUwMjQzLVxcdTAyNDZcXHUwMjQ4XFx1MDI0QVxcdTAyNENcXHUwMjRFXFx1MDM3MFxcdTAzNzJcXHUwMzc2XFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RVxcdTAzOEZcXHUwMzkxLVxcdTAzQTFcXHUwM0EzLVxcdTAzQUJcXHUwM0NGXFx1MDNEMi1cXHUwM0Q0XFx1MDNEOFxcdTAzREFcXHUwM0RDXFx1MDNERVxcdTAzRTBcXHUwM0UyXFx1MDNFNFxcdTAzRTZcXHUwM0U4XFx1MDNFQVxcdTAzRUNcXHUwM0VFXFx1MDNGNFxcdTAzRjdcXHUwM0Y5XFx1MDNGQVxcdTAzRkQtXFx1MDQyRlxcdTA0NjBcXHUwNDYyXFx1MDQ2NFxcdTA0NjZcXHUwNDY4XFx1MDQ2QVxcdTA0NkNcXHUwNDZFXFx1MDQ3MFxcdTA0NzJcXHUwNDc0XFx1MDQ3NlxcdTA0NzhcXHUwNDdBXFx1MDQ3Q1xcdTA0N0VcXHUwNDgwXFx1MDQ4QVxcdTA0OENcXHUwNDhFXFx1MDQ5MFxcdTA0OTJcXHUwNDk0XFx1MDQ5NlxcdTA0OThcXHUwNDlBXFx1MDQ5Q1xcdTA0OUVcXHUwNEEwXFx1MDRBMlxcdTA0QTRcXHUwNEE2XFx1MDRBOFxcdTA0QUFcXHUwNEFDXFx1MDRBRVxcdTA0QjBcXHUwNEIyXFx1MDRCNFxcdTA0QjZcXHUwNEI4XFx1MDRCQVxcdTA0QkNcXHUwNEJFXFx1MDRDMFxcdTA0QzFcXHUwNEMzXFx1MDRDNVxcdTA0QzdcXHUwNEM5XFx1MDRDQlxcdTA0Q0RcXHUwNEQwXFx1MDREMlxcdTA0RDRcXHUwNEQ2XFx1MDREOFxcdTA0REFcXHUwNERDXFx1MDRERVxcdTA0RTBcXHUwNEUyXFx1MDRFNFxcdTA0RTZcXHUwNEU4XFx1MDRFQVxcdTA0RUNcXHUwNEVFXFx1MDRGMFxcdTA0RjJcXHUwNEY0XFx1MDRGNlxcdTA0RjhcXHUwNEZBXFx1MDRGQ1xcdTA0RkVcXHUwNTAwXFx1MDUwMlxcdTA1MDRcXHUwNTA2XFx1MDUwOFxcdTA1MEFcXHUwNTBDXFx1MDUwRVxcdTA1MTBcXHUwNTEyXFx1MDUxNFxcdTA1MTZcXHUwNTE4XFx1MDUxQVxcdTA1MUNcXHUwNTFFXFx1MDUyMFxcdTA1MjJcXHUwNTI0XFx1MDUyNlxcdTA1MjhcXHUwNTJBXFx1MDUyQ1xcdTA1MkVcXHUwNTMxLVxcdTA1NTZcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEzQTAtXFx1MTNGNVxcdTFFMDBcXHUxRTAyXFx1MUUwNFxcdTFFMDZcXHUxRTA4XFx1MUUwQVxcdTFFMENcXHUxRTBFXFx1MUUxMFxcdTFFMTJcXHUxRTE0XFx1MUUxNlxcdTFFMThcXHUxRTFBXFx1MUUxQ1xcdTFFMUVcXHUxRTIwXFx1MUUyMlxcdTFFMjRcXHUxRTI2XFx1MUUyOFxcdTFFMkFcXHUxRTJDXFx1MUUyRVxcdTFFMzBcXHUxRTMyXFx1MUUzNFxcdTFFMzZcXHUxRTM4XFx1MUUzQVxcdTFFM0NcXHUxRTNFXFx1MUU0MFxcdTFFNDJcXHUxRTQ0XFx1MUU0NlxcdTFFNDhcXHUxRTRBXFx1MUU0Q1xcdTFFNEVcXHUxRTUwXFx1MUU1MlxcdTFFNTRcXHUxRTU2XFx1MUU1OFxcdTFFNUFcXHUxRTVDXFx1MUU1RVxcdTFFNjBcXHUxRTYyXFx1MUU2NFxcdTFFNjZcXHUxRTY4XFx1MUU2QVxcdTFFNkNcXHUxRTZFXFx1MUU3MFxcdTFFNzJcXHUxRTc0XFx1MUU3NlxcdTFFNzhcXHUxRTdBXFx1MUU3Q1xcdTFFN0VcXHUxRTgwXFx1MUU4MlxcdTFFODRcXHUxRTg2XFx1MUU4OFxcdTFFOEFcXHUxRThDXFx1MUU4RVxcdTFFOTBcXHUxRTkyXFx1MUU5NFxcdTFFOUVcXHUxRUEwXFx1MUVBMlxcdTFFQTRcXHUxRUE2XFx1MUVBOFxcdTFFQUFcXHUxRUFDXFx1MUVBRVxcdTFFQjBcXHUxRUIyXFx1MUVCNFxcdTFFQjZcXHUxRUI4XFx1MUVCQVxcdTFFQkNcXHUxRUJFXFx1MUVDMFxcdTFFQzJcXHUxRUM0XFx1MUVDNlxcdTFFQzhcXHUxRUNBXFx1MUVDQ1xcdTFFQ0VcXHUxRUQwXFx1MUVEMlxcdTFFRDRcXHUxRUQ2XFx1MUVEOFxcdTFFREFcXHUxRURDXFx1MUVERVxcdTFFRTBcXHUxRUUyXFx1MUVFNFxcdTFFRTZcXHUxRUU4XFx1MUVFQVxcdTFFRUNcXHUxRUVFXFx1MUVGMFxcdTFFRjJcXHUxRUY0XFx1MUVGNlxcdTFFRjhcXHUxRUZBXFx1MUVGQ1xcdTFFRkVcXHUxRjA4LVxcdTFGMEZcXHUxRjE4LVxcdTFGMURcXHUxRjI4LVxcdTFGMkZcXHUxRjM4LVxcdTFGM0ZcXHUxRjQ4LVxcdTFGNERcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGXFx1MUY2OC1cXHUxRjZGXFx1MUZCOC1cXHUxRkJCXFx1MUZDOC1cXHUxRkNCXFx1MUZEOC1cXHUxRkRCXFx1MUZFOC1cXHUxRkVDXFx1MUZGOC1cXHUxRkZCXFx1MjEwMlxcdTIxMDdcXHUyMTBCLVxcdTIxMERcXHUyMTEwLVxcdTIxMTJcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEzMC1cXHUyMTMzXFx1MjEzRVxcdTIxM0ZcXHUyMTQ1XFx1MjE4M1xcdTJDMDAtXFx1MkMyRVxcdTJDNjBcXHUyQzYyLVxcdTJDNjRcXHUyQzY3XFx1MkM2OVxcdTJDNkJcXHUyQzZELVxcdTJDNzBcXHUyQzcyXFx1MkM3NVxcdTJDN0UtXFx1MkM4MFxcdTJDODJcXHUyQzg0XFx1MkM4NlxcdTJDODhcXHUyQzhBXFx1MkM4Q1xcdTJDOEVcXHUyQzkwXFx1MkM5MlxcdTJDOTRcXHUyQzk2XFx1MkM5OFxcdTJDOUFcXHUyQzlDXFx1MkM5RVxcdTJDQTBcXHUyQ0EyXFx1MkNBNFxcdTJDQTZcXHUyQ0E4XFx1MkNBQVxcdTJDQUNcXHUyQ0FFXFx1MkNCMFxcdTJDQjJcXHUyQ0I0XFx1MkNCNlxcdTJDQjhcXHUyQ0JBXFx1MkNCQ1xcdTJDQkVcXHUyQ0MwXFx1MkNDMlxcdTJDQzRcXHUyQ0M2XFx1MkNDOFxcdTJDQ0FcXHUyQ0NDXFx1MkNDRVxcdTJDRDBcXHUyQ0QyXFx1MkNENFxcdTJDRDZcXHUyQ0Q4XFx1MkNEQVxcdTJDRENcXHUyQ0RFXFx1MkNFMFxcdTJDRTJcXHUyQ0VCXFx1MkNFRFxcdTJDRjJcXHVBNjQwXFx1QTY0MlxcdUE2NDRcXHVBNjQ2XFx1QTY0OFxcdUE2NEFcXHVBNjRDXFx1QTY0RVxcdUE2NTBcXHVBNjUyXFx1QTY1NFxcdUE2NTZcXHVBNjU4XFx1QTY1QVxcdUE2NUNcXHVBNjVFXFx1QTY2MFxcdUE2NjJcXHVBNjY0XFx1QTY2NlxcdUE2NjhcXHVBNjZBXFx1QTY2Q1xcdUE2ODBcXHVBNjgyXFx1QTY4NFxcdUE2ODZcXHVBNjg4XFx1QTY4QVxcdUE2OENcXHVBNjhFXFx1QTY5MFxcdUE2OTJcXHVBNjk0XFx1QTY5NlxcdUE2OThcXHVBNjlBXFx1QTcyMlxcdUE3MjRcXHVBNzI2XFx1QTcyOFxcdUE3MkFcXHVBNzJDXFx1QTcyRVxcdUE3MzJcXHVBNzM0XFx1QTczNlxcdUE3MzhcXHVBNzNBXFx1QTczQ1xcdUE3M0VcXHVBNzQwXFx1QTc0MlxcdUE3NDRcXHVBNzQ2XFx1QTc0OFxcdUE3NEFcXHVBNzRDXFx1QTc0RVxcdUE3NTBcXHVBNzUyXFx1QTc1NFxcdUE3NTZcXHVBNzU4XFx1QTc1QVxcdUE3NUNcXHVBNzVFXFx1QTc2MFxcdUE3NjJcXHVBNzY0XFx1QTc2NlxcdUE3NjhcXHVBNzZBXFx1QTc2Q1xcdUE3NkVcXHVBNzc5XFx1QTc3QlxcdUE3N0RcXHVBNzdFXFx1QTc4MFxcdUE3ODJcXHVBNzg0XFx1QTc4NlxcdUE3OEJcXHVBNzhEXFx1QTc5MFxcdUE3OTJcXHVBNzk2XFx1QTc5OFxcdUE3OUFcXHVBNzlDXFx1QTc5RVxcdUE3QTBcXHVBN0EyXFx1QTdBNFxcdUE3QTZcXHVBN0E4XFx1QTdBQS1cXHVBN0FEXFx1QTdCMC1cXHVBN0I0XFx1QTdCNlxcdUZGMjEtXFx1RkYzQV1bYS16XFx4QjVcXHhERi1cXHhGNlxceEY4LVxceEZGXFx1MDEwMVxcdTAxMDNcXHUwMTA1XFx1MDEwN1xcdTAxMDlcXHUwMTBCXFx1MDEwRFxcdTAxMEZcXHUwMTExXFx1MDExM1xcdTAxMTVcXHUwMTE3XFx1MDExOVxcdTAxMUJcXHUwMTFEXFx1MDExRlxcdTAxMjFcXHUwMTIzXFx1MDEyNVxcdTAxMjdcXHUwMTI5XFx1MDEyQlxcdTAxMkRcXHUwMTJGXFx1MDEzMVxcdTAxMzNcXHUwMTM1XFx1MDEzN1xcdTAxMzhcXHUwMTNBXFx1MDEzQ1xcdTAxM0VcXHUwMTQwXFx1MDE0MlxcdTAxNDRcXHUwMTQ2XFx1MDE0OFxcdTAxNDlcXHUwMTRCXFx1MDE0RFxcdTAxNEZcXHUwMTUxXFx1MDE1M1xcdTAxNTVcXHUwMTU3XFx1MDE1OVxcdTAxNUJcXHUwMTVEXFx1MDE1RlxcdTAxNjFcXHUwMTYzXFx1MDE2NVxcdTAxNjdcXHUwMTY5XFx1MDE2QlxcdTAxNkRcXHUwMTZGXFx1MDE3MVxcdTAxNzNcXHUwMTc1XFx1MDE3N1xcdTAxN0FcXHUwMTdDXFx1MDE3RS1cXHUwMTgwXFx1MDE4M1xcdTAxODVcXHUwMTg4XFx1MDE4Q1xcdTAxOERcXHUwMTkyXFx1MDE5NVxcdTAxOTktXFx1MDE5QlxcdTAxOUVcXHUwMUExXFx1MDFBM1xcdTAxQTVcXHUwMUE4XFx1MDFBQVxcdTAxQUJcXHUwMUFEXFx1MDFCMFxcdTAxQjRcXHUwMUI2XFx1MDFCOVxcdTAxQkFcXHUwMUJELVxcdTAxQkZcXHUwMUM2XFx1MDFDOVxcdTAxQ0NcXHUwMUNFXFx1MDFEMFxcdTAxRDJcXHUwMUQ0XFx1MDFENlxcdTAxRDhcXHUwMURBXFx1MDFEQ1xcdTAxRERcXHUwMURGXFx1MDFFMVxcdTAxRTNcXHUwMUU1XFx1MDFFN1xcdTAxRTlcXHUwMUVCXFx1MDFFRFxcdTAxRUZcXHUwMUYwXFx1MDFGM1xcdTAxRjVcXHUwMUY5XFx1MDFGQlxcdTAxRkRcXHUwMUZGXFx1MDIwMVxcdTAyMDNcXHUwMjA1XFx1MDIwN1xcdTAyMDlcXHUwMjBCXFx1MDIwRFxcdTAyMEZcXHUwMjExXFx1MDIxM1xcdTAyMTVcXHUwMjE3XFx1MDIxOVxcdTAyMUJcXHUwMjFEXFx1MDIxRlxcdTAyMjFcXHUwMjIzXFx1MDIyNVxcdTAyMjdcXHUwMjI5XFx1MDIyQlxcdTAyMkRcXHUwMjJGXFx1MDIzMVxcdTAyMzMtXFx1MDIzOVxcdTAyM0NcXHUwMjNGXFx1MDI0MFxcdTAyNDJcXHUwMjQ3XFx1MDI0OVxcdTAyNEJcXHUwMjREXFx1MDI0Ri1cXHUwMjkzXFx1MDI5NS1cXHUwMkFGXFx1MDM3MVxcdTAzNzNcXHUwMzc3XFx1MDM3Qi1cXHUwMzdEXFx1MDM5MFxcdTAzQUMtXFx1MDNDRVxcdTAzRDBcXHUwM0QxXFx1MDNENS1cXHUwM0Q3XFx1MDNEOVxcdTAzREJcXHUwM0REXFx1MDNERlxcdTAzRTFcXHUwM0UzXFx1MDNFNVxcdTAzRTdcXHUwM0U5XFx1MDNFQlxcdTAzRURcXHUwM0VGLVxcdTAzRjNcXHUwM0Y1XFx1MDNGOFxcdTAzRkJcXHUwM0ZDXFx1MDQzMC1cXHUwNDVGXFx1MDQ2MVxcdTA0NjNcXHUwNDY1XFx1MDQ2N1xcdTA0NjlcXHUwNDZCXFx1MDQ2RFxcdTA0NkZcXHUwNDcxXFx1MDQ3M1xcdTA0NzVcXHUwNDc3XFx1MDQ3OVxcdTA0N0JcXHUwNDdEXFx1MDQ3RlxcdTA0ODFcXHUwNDhCXFx1MDQ4RFxcdTA0OEZcXHUwNDkxXFx1MDQ5M1xcdTA0OTVcXHUwNDk3XFx1MDQ5OVxcdTA0OUJcXHUwNDlEXFx1MDQ5RlxcdTA0QTFcXHUwNEEzXFx1MDRBNVxcdTA0QTdcXHUwNEE5XFx1MDRBQlxcdTA0QURcXHUwNEFGXFx1MDRCMVxcdTA0QjNcXHUwNEI1XFx1MDRCN1xcdTA0QjlcXHUwNEJCXFx1MDRCRFxcdTA0QkZcXHUwNEMyXFx1MDRDNFxcdTA0QzZcXHUwNEM4XFx1MDRDQVxcdTA0Q0NcXHUwNENFXFx1MDRDRlxcdTA0RDFcXHUwNEQzXFx1MDRENVxcdTA0RDdcXHUwNEQ5XFx1MDREQlxcdTA0RERcXHUwNERGXFx1MDRFMVxcdTA0RTNcXHUwNEU1XFx1MDRFN1xcdTA0RTlcXHUwNEVCXFx1MDRFRFxcdTA0RUZcXHUwNEYxXFx1MDRGM1xcdTA0RjVcXHUwNEY3XFx1MDRGOVxcdTA0RkJcXHUwNEZEXFx1MDRGRlxcdTA1MDFcXHUwNTAzXFx1MDUwNVxcdTA1MDdcXHUwNTA5XFx1MDUwQlxcdTA1MERcXHUwNTBGXFx1MDUxMVxcdTA1MTNcXHUwNTE1XFx1MDUxN1xcdTA1MTlcXHUwNTFCXFx1MDUxRFxcdTA1MUZcXHUwNTIxXFx1MDUyM1xcdTA1MjVcXHUwNTI3XFx1MDUyOVxcdTA1MkJcXHUwNTJEXFx1MDUyRlxcdTA1NjEtXFx1MDU4N1xcdTEzRjgtXFx1MTNGRFxcdTFEMDAtXFx1MUQyQlxcdTFENkItXFx1MUQ3N1xcdTFENzktXFx1MUQ5QVxcdTFFMDFcXHUxRTAzXFx1MUUwNVxcdTFFMDdcXHUxRTA5XFx1MUUwQlxcdTFFMERcXHUxRTBGXFx1MUUxMVxcdTFFMTNcXHUxRTE1XFx1MUUxN1xcdTFFMTlcXHUxRTFCXFx1MUUxRFxcdTFFMUZcXHUxRTIxXFx1MUUyM1xcdTFFMjVcXHUxRTI3XFx1MUUyOVxcdTFFMkJcXHUxRTJEXFx1MUUyRlxcdTFFMzFcXHUxRTMzXFx1MUUzNVxcdTFFMzdcXHUxRTM5XFx1MUUzQlxcdTFFM0RcXHUxRTNGXFx1MUU0MVxcdTFFNDNcXHUxRTQ1XFx1MUU0N1xcdTFFNDlcXHUxRTRCXFx1MUU0RFxcdTFFNEZcXHUxRTUxXFx1MUU1M1xcdTFFNTVcXHUxRTU3XFx1MUU1OVxcdTFFNUJcXHUxRTVEXFx1MUU1RlxcdTFFNjFcXHUxRTYzXFx1MUU2NVxcdTFFNjdcXHUxRTY5XFx1MUU2QlxcdTFFNkRcXHUxRTZGXFx1MUU3MVxcdTFFNzNcXHUxRTc1XFx1MUU3N1xcdTFFNzlcXHUxRTdCXFx1MUU3RFxcdTFFN0ZcXHUxRTgxXFx1MUU4M1xcdTFFODVcXHUxRTg3XFx1MUU4OVxcdTFFOEJcXHUxRThEXFx1MUU4RlxcdTFFOTFcXHUxRTkzXFx1MUU5NS1cXHUxRTlEXFx1MUU5RlxcdTFFQTFcXHUxRUEzXFx1MUVBNVxcdTFFQTdcXHUxRUE5XFx1MUVBQlxcdTFFQURcXHUxRUFGXFx1MUVCMVxcdTFFQjNcXHUxRUI1XFx1MUVCN1xcdTFFQjlcXHUxRUJCXFx1MUVCRFxcdTFFQkZcXHUxRUMxXFx1MUVDM1xcdTFFQzVcXHUxRUM3XFx1MUVDOVxcdTFFQ0JcXHUxRUNEXFx1MUVDRlxcdTFFRDFcXHUxRUQzXFx1MUVENVxcdTFFRDdcXHUxRUQ5XFx1MUVEQlxcdTFFRERcXHUxRURGXFx1MUVFMVxcdTFFRTNcXHUxRUU1XFx1MUVFN1xcdTFFRTlcXHUxRUVCXFx1MUVFRFxcdTFFRUZcXHUxRUYxXFx1MUVGM1xcdTFFRjVcXHUxRUY3XFx1MUVGOVxcdTFFRkJcXHUxRUZEXFx1MUVGRi1cXHUxRjA3XFx1MUYxMC1cXHUxRjE1XFx1MUYyMC1cXHUxRjI3XFx1MUYzMC1cXHUxRjM3XFx1MUY0MC1cXHUxRjQ1XFx1MUY1MC1cXHUxRjU3XFx1MUY2MC1cXHUxRjY3XFx1MUY3MC1cXHUxRjdEXFx1MUY4MC1cXHUxRjg3XFx1MUY5MC1cXHUxRjk3XFx1MUZBMC1cXHUxRkE3XFx1MUZCMC1cXHUxRkI0XFx1MUZCNlxcdTFGQjdcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNlxcdTFGQzdcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2XFx1MUZEN1xcdTFGRTAtXFx1MUZFN1xcdTFGRjItXFx1MUZGNFxcdTFGRjZcXHUxRkY3XFx1MjEwQVxcdTIxMEVcXHUyMTBGXFx1MjExM1xcdTIxMkZcXHUyMTM0XFx1MjEzOVxcdTIxM0NcXHUyMTNEXFx1MjE0Ni1cXHUyMTQ5XFx1MjE0RVxcdTIxODRcXHUyQzMwLVxcdTJDNUVcXHUyQzYxXFx1MkM2NVxcdTJDNjZcXHUyQzY4XFx1MkM2QVxcdTJDNkNcXHUyQzcxXFx1MkM3M1xcdTJDNzRcXHUyQzc2LVxcdTJDN0JcXHUyQzgxXFx1MkM4M1xcdTJDODVcXHUyQzg3XFx1MkM4OVxcdTJDOEJcXHUyQzhEXFx1MkM4RlxcdTJDOTFcXHUyQzkzXFx1MkM5NVxcdTJDOTdcXHUyQzk5XFx1MkM5QlxcdTJDOURcXHUyQzlGXFx1MkNBMVxcdTJDQTNcXHUyQ0E1XFx1MkNBN1xcdTJDQTlcXHUyQ0FCXFx1MkNBRFxcdTJDQUZcXHUyQ0IxXFx1MkNCM1xcdTJDQjVcXHUyQ0I3XFx1MkNCOVxcdTJDQkJcXHUyQ0JEXFx1MkNCRlxcdTJDQzFcXHUyQ0MzXFx1MkNDNVxcdTJDQzdcXHUyQ0M5XFx1MkNDQlxcdTJDQ0RcXHUyQ0NGXFx1MkNEMVxcdTJDRDNcXHUyQ0Q1XFx1MkNEN1xcdTJDRDlcXHUyQ0RCXFx1MkNERFxcdTJDREZcXHUyQ0UxXFx1MkNFM1xcdTJDRTRcXHUyQ0VDXFx1MkNFRVxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdUE2NDFcXHVBNjQzXFx1QTY0NVxcdUE2NDdcXHVBNjQ5XFx1QTY0QlxcdUE2NERcXHVBNjRGXFx1QTY1MVxcdUE2NTNcXHVBNjU1XFx1QTY1N1xcdUE2NTlcXHVBNjVCXFx1QTY1RFxcdUE2NUZcXHVBNjYxXFx1QTY2M1xcdUE2NjVcXHVBNjY3XFx1QTY2OVxcdUE2NkJcXHVBNjZEXFx1QTY4MVxcdUE2ODNcXHVBNjg1XFx1QTY4N1xcdUE2ODlcXHVBNjhCXFx1QTY4RFxcdUE2OEZcXHVBNjkxXFx1QTY5M1xcdUE2OTVcXHVBNjk3XFx1QTY5OVxcdUE2OUJcXHVBNzIzXFx1QTcyNVxcdUE3MjdcXHVBNzI5XFx1QTcyQlxcdUE3MkRcXHVBNzJGLVxcdUE3MzFcXHVBNzMzXFx1QTczNVxcdUE3MzdcXHVBNzM5XFx1QTczQlxcdUE3M0RcXHVBNzNGXFx1QTc0MVxcdUE3NDNcXHVBNzQ1XFx1QTc0N1xcdUE3NDlcXHVBNzRCXFx1QTc0RFxcdUE3NEZcXHVBNzUxXFx1QTc1M1xcdUE3NTVcXHVBNzU3XFx1QTc1OVxcdUE3NUJcXHVBNzVEXFx1QTc1RlxcdUE3NjFcXHVBNzYzXFx1QTc2NVxcdUE3NjdcXHVBNzY5XFx1QTc2QlxcdUE3NkRcXHVBNzZGXFx1QTc3MS1cXHVBNzc4XFx1QTc3QVxcdUE3N0NcXHVBNzdGXFx1QTc4MVxcdUE3ODNcXHVBNzg1XFx1QTc4N1xcdUE3OENcXHVBNzhFXFx1QTc5MVxcdUE3OTMtXFx1QTc5NVxcdUE3OTdcXHVBNzk5XFx1QTc5QlxcdUE3OURcXHVBNzlGXFx1QTdBMVxcdUE3QTNcXHVBN0E1XFx1QTdBN1xcdUE3QTlcXHVBN0I1XFx1QTdCN1xcdUE3RkFcXHVBQjMwLVxcdUFCNUFcXHVBQjYwLVxcdUFCNjVcXHVBQjcwLVxcdUFCQkZcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGRjQxLVxcdUZGNUFdKS9nXG4iLCJ2YXIgbG93ZXJDYXNlID0gcmVxdWlyZSgnbG93ZXItY2FzZScpXG5cbnZhciBOT05fV09SRF9SRUdFWFAgPSByZXF1aXJlKCcuL3ZlbmRvci9ub24td29yZC1yZWdleHAnKVxudmFyIENBTUVMX0NBU0VfUkVHRVhQID0gcmVxdWlyZSgnLi92ZW5kb3IvY2FtZWwtY2FzZS1yZWdleHAnKVxudmFyIENBTUVMX0NBU0VfVVBQRVJfUkVHRVhQID0gcmVxdWlyZSgnLi92ZW5kb3IvY2FtZWwtY2FzZS11cHBlci1yZWdleHAnKVxuXG4vKipcbiAqIFNlbnRlbmNlIGNhc2UgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBzdHJcbiAqIEBwYXJhbSAge3N0cmluZ30gbG9jYWxlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHJlcGxhY2VtZW50XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0ciwgbG9jYWxlLCByZXBsYWNlbWVudCkge1xuICBpZiAoc3RyID09IG51bGwpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIHJlcGxhY2VtZW50ID0gdHlwZW9mIHJlcGxhY2VtZW50ICE9PSAnc3RyaW5nJyA/ICcgJyA6IHJlcGxhY2VtZW50XG5cbiAgZnVuY3Rpb24gcmVwbGFjZSAobWF0Y2gsIGluZGV4LCB2YWx1ZSkge1xuICAgIGlmIChpbmRleCA9PT0gMCB8fCBpbmRleCA9PT0gKHZhbHVlLmxlbmd0aCAtIG1hdGNoLmxlbmd0aCkpIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHJldHVybiByZXBsYWNlbWVudFxuICB9XG5cbiAgc3RyID0gU3RyaW5nKHN0cilcbiAgICAvLyBTdXBwb3J0IGNhbWVsIGNhc2UgKFwiY2FtZWxDYXNlXCIgLT4gXCJjYW1lbCBDYXNlXCIpLlxuICAgIC5yZXBsYWNlKENBTUVMX0NBU0VfUkVHRVhQLCAnJDEgJDInKVxuICAgIC8vIFN1cHBvcnQgb2RkIGNhbWVsIGNhc2UgKFwiQ0FNRUxDYXNlXCIgLT4gXCJDQU1FTCBDYXNlXCIpLlxuICAgIC5yZXBsYWNlKENBTUVMX0NBU0VfVVBQRVJfUkVHRVhQLCAnJDEgJDInKVxuICAgIC8vIFJlbW92ZSBhbGwgbm9uLXdvcmQgY2hhcmFjdGVycyBhbmQgcmVwbGFjZSB3aXRoIGEgc2luZ2xlIHNwYWNlLlxuICAgIC5yZXBsYWNlKE5PTl9XT1JEX1JFR0VYUCwgcmVwbGFjZSlcblxuICAvLyBMb3dlciBjYXNlIHRoZSBlbnRpcmUgc3RyaW5nLlxuICByZXR1cm4gbG93ZXJDYXNlKHN0ciwgbG9jYWxlKVxufVxuIiwidmFyIHVwcGVyQ2FzZSA9IHJlcXVpcmUoJ3VwcGVyLWNhc2UnKVxudmFyIG5vQ2FzZSA9IHJlcXVpcmUoJ25vLWNhc2UnKVxuXG4vKipcbiAqIENhbWVsIGNhc2UgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtICB7c3RyaW5nfSBbbG9jYWxlXVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSwgbG9jYWxlLCBtZXJnZU51bWJlcnMpIHtcbiAgdmFyIHJlc3VsdCA9IG5vQ2FzZSh2YWx1ZSwgbG9jYWxlKVxuXG4gIC8vIFJlcGxhY2UgcGVyaW9kcyBiZXR3ZWVuIG51bWVyaWMgZW50aXRpZXMgd2l0aCBhbiB1bmRlcnNjb3JlLlxuICBpZiAoIW1lcmdlTnVtYmVycykge1xuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC8gKD89XFxkKS9nLCAnXycpXG4gIH1cblxuICAvLyBSZXBsYWNlIHNwYWNlcyBiZXR3ZWVuIHdvcmRzIHdpdGggYW4gdXBwZXIgY2FzZWQgY2hhcmFjdGVyLlxuICByZXR1cm4gcmVzdWx0LnJlcGxhY2UoLyAoLikvZywgZnVuY3Rpb24gKG0sICQxKSB7XG4gICAgcmV0dXJuIHVwcGVyQ2FzZSgkMSwgbG9jYWxlKVxuICB9KVxufVxuIiwiLy8gYW5zaVJlZ2V4XG5jb25zdCBhbnNpUmVnZXggPSAoKSA9PiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBbXG4gICAgJ1tcXFxcdTAwMUJcXFxcdTAwOUJdW1tcXFxcXSgpIzs/XSooPzooPzooPzpbYS16QS1aXFxcXGRdKig/OjtbYS16QS1aXFxcXGRdKikqKT9cXFxcdTAwMDcpJyxcbiAgICAnKD86KD86XFxcXGR7MSw0fSg/OjtcXFxcZHswLDR9KSopP1tcXFxcZEEtUFJaY2YtbnRxcnk9Pjx+XSkpJ1xuICBdLmpvaW4oJ3wnKVxuXG4gIHJldHVybiBuZXcgUmVnRXhwKHBhdHRlcm4sICdnJylcbn1cblxuLy8gYXN0cmFsUmVnZXhcbmNvbnN0IHJlZ2V4ID0gJ1tcXHVEODAwLVxcdURCRkZdW1xcdURDMDAtXFx1REZGRl0nXG5cbmNvbnN0IGFzdHJhbFJlZ2V4ID0gKG9wdHM/OiB7IGV4YWN0OiBib29sZWFuIH0pID0+XG4gIG9wdHMgJiYgb3B0cy5leGFjdCA/IG5ldyBSZWdFeHAoYF4ke3JlZ2V4fSRgKSA6IG5ldyBSZWdFeHAocmVnZXgsICdnJylcblxuLy8gc3RyaXBBbnNpXG5jb25zdCBzdHJpcEFuc2kgPSAoaW5wdXQ6IGFueSkgPT5cbiAgdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyA/IGlucHV0LnJlcGxhY2UoYW5zaVJlZ2V4KCksICcnKSA6IGlucHV0XG5cbmV4cG9ydCBjb25zdCBzdHJpbmdMZW5ndGggPSAoaW5wdXQ6IHN0cmluZykgPT5cbiAgc3RyaXBBbnNpKGlucHV0KS5yZXBsYWNlKGFzdHJhbFJlZ2V4KCksICcgJykubGVuZ3RoXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlc3RydWN0b3JDb250ZXh0ID0gZXhwb3J0cy5icmFjZUNvbnRleHQgPSBleHBvcnRzLnBhcmVuQ29udGV4dCA9IGV4cG9ydHMuYnJhY2tldERDb250ZXh0ID0gZXhwb3J0cy5icmFja2V0QXJyYXlDb250ZXh0ID0gZXhwb3J0cy5icmFja2V0Q29udGV4dCA9IHZvaWQgMDtcbnZhciBDb250ZXh0VHlwZSA9IGZ1bmN0aW9uIChmbGFnLCBwcm9wcykge1xuICAgIHJldHVybiBfX2Fzc2lnbih7IGZsYWc6IGZsYWcgfSwgcHJvcHMpO1xufTtcbmV4cG9ydHMuYnJhY2tldENvbnRleHQgPSBDb250ZXh0VHlwZShcIltdXCIpO1xuZXhwb3J0cy5icmFja2V0QXJyYXlDb250ZXh0ID0gQ29udGV4dFR5cGUoXCJbXFxcXGRdXCIpO1xuZXhwb3J0cy5icmFja2V0RENvbnRleHQgPSBDb250ZXh0VHlwZShcIltbXV1cIik7XG5leHBvcnRzLnBhcmVuQ29udGV4dCA9IENvbnRleHRUeXBlKFwiKClcIik7XG5leHBvcnRzLmJyYWNlQ29udGV4dCA9IENvbnRleHRUeXBlKFwie31cIik7XG5leHBvcnRzLmRlc3RydWN0b3JDb250ZXh0ID0gQ29udGV4dFR5cGUoXCJ7eH1cIik7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmVvZlRvayA9IGV4cG9ydHMuZXhwYW5kVG9rID0gZXhwb3J0cy5pZ25vcmVUb2sgPSBleHBvcnRzLmNvbW1hVG9rID0gZXhwb3J0cy5wYXJlblJUb2sgPSBleHBvcnRzLnBhcmVuTFRvayA9IGV4cG9ydHMuYnJhY2tldERSVG9rID0gZXhwb3J0cy5icmFja2V0RExUb2sgPSBleHBvcnRzLmJyYWNrZXRSVG9rID0gZXhwb3J0cy5icmFja2V0TFRvayA9IGV4cG9ydHMuYnJhY2VSVG9rID0gZXhwb3J0cy5icmFjZUxUb2sgPSBleHBvcnRzLmNvbG9uVG9rID0gZXhwb3J0cy5iYW5nVG9rID0gZXhwb3J0cy5kb3RUb2sgPSBleHBvcnRzLnN0YXJUb2sgPSBleHBvcnRzLm5hbWVUb2sgPSB2b2lkIDA7XG52YXIgY29udGV4dHNfMSA9IHJlcXVpcmUoXCIuL2NvbnRleHRzXCIpO1xudmFyIFRva2VuVHlwZSA9IGZ1bmN0aW9uIChmbGFnLCBwcm9wcykge1xuICAgIHJldHVybiBfX2Fzc2lnbih7IGZsYWc6IGZsYWcgfSwgcHJvcHMpO1xufTtcbmV4cG9ydHMubmFtZVRvayA9IFRva2VuVHlwZSgnbmFtZScsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiAobmV4dCA9PT0gZXhwb3J0cy5jb21tYVRvayB8fFxuICAgICAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldFJUb2sgfHxcbiAgICAgICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNlUlRvayB8fFxuICAgICAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuY29sb25Ub2spO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAobmV4dCA9PT0gZXhwb3J0cy5kb3RUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuY29tbWFUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuZW9mVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRSVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLnBhcmVuUlRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5jb2xvblRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5leHBhbmRUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldExUb2spO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5zdGFyVG9rID0gVG9rZW5UeXBlKCcqJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHJldHVybiAobmV4dCA9PT0gZXhwb3J0cy5kb3RUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuc3RhclRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5wYXJlbkxUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldExUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuZW9mVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLnBhcmVuUlRvayk7XG4gICAgfVxufSk7XG5leHBvcnRzLmRvdFRvayA9IFRva2VuVHlwZSgnLicsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gKG5leHQgPT09IGV4cG9ydHMubmFtZVRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0RExUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuc3RhclRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0TFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFjZUxUb2spO1xuICAgIH0sXG4gICAgZXhwZWN0UHJldjogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgcmV0dXJuIChwcmV2ID09PSBleHBvcnRzLm5hbWVUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMuYnJhY2tldERSVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLnN0YXJUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMucGFyZW5SVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLmJyYWNrZXRSVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLmV4cGFuZFRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5icmFjZVJUb2spO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5iYW5nVG9rID0gVG9rZW5UeXBlKCchJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLm5hbWVUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0RExUb2s7XG4gICAgfVxufSk7XG5leHBvcnRzLmNvbG9uVG9rID0gVG9rZW5UeXBlKCc6Jywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMubmFtZVRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNlTFRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLm5hbWVUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0RExUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0UlRvaztcbiAgICB9XG59KTtcbmV4cG9ydHMuYnJhY2VMVG9rID0gVG9rZW5UeXBlKCd7Jywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLm5hbWVUb2s7XG4gICAgfSxcbiAgICBleHBlY3RQcmV2OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmV2ID09PSBleHBvcnRzLmNvbG9uVG9rIHx8IHByZXYgPT09IGV4cG9ydHMuY29tbWFUb2sgfHwgcHJldiA9PT0gZXhwb3J0cy5icmFja2V0TFRvaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJldiA9PT0gZXhwb3J0cy5kb3RUb2sgfHwgcHJldiA9PT0gZXhwb3J0cy5jb2xvblRvaztcbiAgICB9LFxuICAgIHVwZGF0ZUNvbnRleHQ6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wdXNoKGNvbnRleHRzXzEuYnJhY2VDb250ZXh0KTtcbiAgICB9XG59KTtcbmV4cG9ydHMuYnJhY2VSVG9rID0gVG9rZW5UeXBlKCd9Jywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMuY29tbWFUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFjZVJUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5lb2ZUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0UlRvaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5kb3RUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5lb2ZUb2s7XG4gICAgfSxcbiAgICBleHBlY3RQcmV2OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICByZXR1cm4gcHJldiA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8IHByZXYgPT09IGV4cG9ydHMuYnJhY2VSVG9rIHx8IHByZXYgPT09IGV4cG9ydHMuYnJhY2tldFJUb2s7XG4gICAgfSxcbiAgICB1cGRhdGVDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wb3AoY29udGV4dHNfMS5icmFjZUNvbnRleHQpO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5icmFja2V0TFRvayA9IFRva2VuVHlwZSgnWycsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLm5hbWVUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0TFRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNlTFRvaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG5leHQgPT09IGV4cG9ydHMubmFtZVRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0RExUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuY29sb25Ub2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldExUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuaWdub3JlVG9rKTtcbiAgICB9LFxuICAgIGV4cGVjdFByZXY6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHByZXYgPT09IGV4cG9ydHMuY29sb25Ub2sgfHwgcHJldiA9PT0gZXhwb3J0cy5jb21tYVRvayB8fCBwcmV2ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAocHJldiA9PT0gZXhwb3J0cy5zdGFyVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLmRvdFRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLnBhcmVuTFRvayB8fFxuICAgICAgICAgICAgcHJldiA9PSBleHBvcnRzLmNvbW1hVG9rKTtcbiAgICB9LFxuICAgIHVwZGF0ZUNvbnRleHQ6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wdXNoKGNvbnRleHRzXzEuYnJhY2tldENvbnRleHQpO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5icmFja2V0UlRvayA9IFRva2VuVHlwZSgnXScsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2VSVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2tldFJUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5lb2ZUb2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuZXh0ID09PSBleHBvcnRzLmRvdFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5lb2ZUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuY29tbWFUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMucGFyZW5SVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRSVG9rKTtcbiAgICB9LFxuICAgIHVwZGF0ZUNvbnRleHQ6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmJyYWNrZXRBcnJheUNvbnRleHQpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAoIXRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuYnJhY2tldENvbnRleHQpKVxuICAgICAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdCgpO1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucG9wKCk7XG4gICAgfVxufSk7XG5leHBvcnRzLmJyYWNrZXRETFRvayA9IFRva2VuVHlwZSgnW1snLCB7XG4gICAgdXBkYXRlQ29udGV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucHVzaChjb250ZXh0c18xLmJyYWNrZXREQ29udGV4dCk7XG4gICAgfVxufSk7XG5leHBvcnRzLmJyYWNrZXREUlRvayA9IFRva2VuVHlwZSgnXV0nLCB7XG4gICAgdXBkYXRlQ29udGV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJDb250ZXh0KCkgIT09IGNvbnRleHRzXzEuYnJhY2tldERDb250ZXh0KVxuICAgICAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdCgpO1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucG9wKCk7XG4gICAgfVxufSk7XG5leHBvcnRzLnBhcmVuTFRvayA9IFRva2VuVHlwZSgnKCcsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gKG5leHQgPT09IGV4cG9ydHMubmFtZVRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0RExUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYmFuZ1RvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0TFRvayk7XG4gICAgfSxcbiAgICBleHBlY3RQcmV2OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICByZXR1cm4gcHJldiA9PT0gZXhwb3J0cy5zdGFyVG9rO1xuICAgIH0sXG4gICAgdXBkYXRlQ29udGV4dDogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnB1c2goY29udGV4dHNfMS5wYXJlbkNvbnRleHQpO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5wYXJlblJUb2sgPSBUb2tlblR5cGUoJyknLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMuZG90VG9rIHx8IG5leHQgPT09IGV4cG9ydHMuZW9mVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuY29tbWFUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5wYXJlblJUb2s7XG4gICAgfSxcbiAgICB1cGRhdGVDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckNvbnRleHQoKSAhPT0gY29udGV4dHNfMS5wYXJlbkNvbnRleHQpXG4gICAgICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0KCk7XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wb3AoKTtcbiAgICB9XG59KTtcbmV4cG9ydHMuY29tbWFUb2sgPSBUb2tlblR5cGUoJywnLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIChuZXh0ID09PSBleHBvcnRzLm5hbWVUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldERMVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNlTFRvayk7XG4gICAgfVxufSk7XG5leHBvcnRzLmlnbm9yZVRvayA9IFRva2VuVHlwZSgnaWdub3JlJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXREUlRvaztcbiAgICB9LFxuICAgIGV4cGVjdFByZXY6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIHJldHVybiBwcmV2ID09IGV4cG9ydHMuYnJhY2tldERMVG9rO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5leHBhbmRUb2sgPSBUb2tlblR5cGUoJ2V4cGFuZFRvaycsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gKG5leHQgPT09IGV4cG9ydHMuZG90VG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmVvZlRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5jb21tYVRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5wYXJlblJUb2spO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5lb2ZUb2sgPSBUb2tlblR5cGUoJ2VvZicpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlRva2VuaXplciA9IHZvaWQgMDtcbnZhciB0b2tlbnNfMSA9IHJlcXVpcmUoXCIuL3Rva2Vuc1wiKTtcbnZhciBjb250ZXh0c18xID0gcmVxdWlyZShcIi4vY29udGV4dHNcIik7XG52YXIgbm9uQVNDSUl3aGl0ZXNwYWNlID0gL1tcXHUxNjgwXFx1MTgwZVxcdTIwMDAtXFx1MjAwYVxcdTIwMmZcXHUyMDVmXFx1MzAwMFxcdWZlZmZdLztcbnZhciBmdWxsQ2hhckNvZGVBdFBvcyA9IGZ1bmN0aW9uIChpbnB1dCwgcG9zKSB7XG4gICAgdmFyIGNvZGUgPSBpbnB1dC5jaGFyQ29kZUF0KHBvcyk7XG4gICAgaWYgKGNvZGUgPD0gMHhkN2ZmIHx8IGNvZGUgPj0gMHhlMDAwKVxuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB2YXIgbmV4dCA9IGlucHV0LmNoYXJDb2RlQXQocG9zICsgMSk7XG4gICAgcmV0dXJuIChjb2RlIDw8IDEwKSArIG5leHQgLSAweDM1ZmRjMDA7XG59O1xudmFyIGlzUmV3b3JkQ29kZSA9IGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgcmV0dXJuIGNvZGUgPT09IDQyIHx8XG4gICAgICAgIGNvZGUgPT09IDQ2IHx8XG4gICAgICAgIGNvZGUgPT09IDMzIHx8XG4gICAgICAgIGNvZGUgPT09IDkxIHx8XG4gICAgICAgIGNvZGUgPT09IDkzIHx8XG4gICAgICAgIGNvZGUgPT09IDQwIHx8XG4gICAgICAgIGNvZGUgPT09IDQxIHx8XG4gICAgICAgIGNvZGUgPT09IDQ0IHx8XG4gICAgICAgIGNvZGUgPT09IDU4IHx8XG4gICAgICAgIGNvZGUgPT09IDEyNiB8fFxuICAgICAgICBjb2RlID09PSAxMjMgfHxcbiAgICAgICAgY29kZSA9PT0gMTI1O1xufTtcbnZhciBnZXRFcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlLCBwcm9wcykge1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgT2JqZWN0LmFzc2lnbihlcnIsIHByb3BzKTtcbiAgICByZXR1cm4gZXJyO1xufTtcbnZhciBzbGljZSA9IGZ1bmN0aW9uIChzdHJpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgc3RyID0gJyc7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgICAgdmFyIGNoID0gc3RyaW5nLmNoYXJBdChpKTtcbiAgICAgICAgaWYgKGNoICE9PSAnXFxcXCcpIHtcbiAgICAgICAgICAgIHN0ciArPSBjaDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufTtcbnZhciBUb2tlbml6ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRva2VuaXplcihpbnB1dCkge1xuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBjb250ZXh0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgICAgICBwb3M6IDBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5jdXJDb250ZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS5jb250ZXh0W3RoaXMuc3RhdGUuY29udGV4dC5sZW5ndGggLSAxXTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuaW5jbHVkZXNDb250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgICAgZm9yICh2YXIgbGVuID0gdGhpcy5zdGF0ZS5jb250ZXh0Lmxlbmd0aCAtIDE7IGxlbiA+PSAwOyBsZW4tLSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuY29udGV4dFtsZW5dID09PSBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS51bmV4cGVjdCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIHR5cGUgPSB0eXBlIHx8IHRoaXMuc3RhdGUudHlwZTtcbiAgICAgICAgcmV0dXJuIGdldEVycm9yKFwiVW5leHBlY3QgdG9rZW4gXFxcIlwiICsgdHlwZS5mbGFnICsgXCJcXFwiIGluIFwiICsgdGhpcy5zdGF0ZS5wb3MgKyBcIiBjaGFyLlwiLCB7XG4gICAgICAgICAgICBwb3M6IHRoaXMuc3RhdGUucG9zXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5leHBlY3ROZXh0ID0gZnVuY3Rpb24gKHR5cGUsIG5leHQpIHtcbiAgICAgICAgaWYgKHR5cGUgJiYgdHlwZS5leHBlY3ROZXh0KSB7XG4gICAgICAgICAgICBpZiAobmV4dCAmJiAhdHlwZS5leHBlY3ROZXh0LmNhbGwodGhpcywgbmV4dCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBnZXRFcnJvcihcIlVuZXhwZWN0IHRva2VuIFxcXCJcIiArIG5leHQuZmxhZyArIFwiXFxcIiB0b2tlbiBzaG91bGQgbm90IGJlIGJlaGluZCBcXFwiXCIgKyB0eXBlLmZsYWcgKyBcIlxcXCIgdG9rZW4uKFwiICsgdGhpcy5zdGF0ZS5wb3MgKyBcInRoIGNoYXIpXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zOiB0aGlzLnN0YXRlLnBvc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmV4cGVjdFByZXYgPSBmdW5jdGlvbiAodHlwZSwgcHJldikge1xuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmV4cGVjdFByZXYpIHtcbiAgICAgICAgICAgIGlmIChwcmV2ICYmICF0eXBlLmV4cGVjdFByZXYuY2FsbCh0aGlzLCBwcmV2KSkge1xuICAgICAgICAgICAgICAgIHRocm93IGdldEVycm9yKFwiVW5leHBlY3QgdG9rZW4gXFxcIlwiICsgdHlwZS5mbGFnICsgXCJcXFwiIHNob3VsZCBub3QgYmUgYmVoaW5kIFxcXCJcIiArIHByZXYuZmxhZyArIFwiXFxcIihcIiArIHRoaXMuc3RhdGUucG9zICsgXCJ0aCBjaGFyKS5cIiwge1xuICAgICAgICAgICAgICAgICAgICBwb3M6IHRoaXMuc3RhdGUucG9zXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZS50eXBlID09PSB0eXBlO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5za2lwU3BhY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckNvbnRleHQoKSA9PT0gY29udGV4dHNfMS5icmFja2V0RENvbnRleHQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGxvb3A6IHdoaWxlICh0aGlzLnN0YXRlLnBvcyA8IHRoaXMuaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgY2ggPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgICAgICAgc3dpdGNoIChjaCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMzI6XG4gICAgICAgICAgICAgICAgY2FzZSAxNjA6XG4gICAgICAgICAgICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAxKSA9PT0gMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgIGNhc2UgODIzMjpcbiAgICAgICAgICAgICAgICBjYXNlIDgyMzM6XG4gICAgICAgICAgICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICgoY2ggPiA4ICYmIGNoIDwgMTQpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAoY2ggPj0gNTc2MCAmJiBub25BU0NJSXdoaXRlc3BhY2UudGVzdChTdHJpbmcuZnJvbUNoYXJDb2RlKGNoKSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlucHV0Lmxlbmd0aCA8PSB0aGlzLnN0YXRlLnBvcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuZW9mVG9rKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNraXBTcGFjZSgpO1xuICAgICAgICB0aGlzLnJlYWRUb2tlbih0aGlzLmdldENvZGUoKSwgdGhpcy5zdGF0ZS5wb3MgPiAwID8gdGhpcy5nZXRDb2RlKHRoaXMuc3RhdGUucG9zIC0gMSkgOiAtSW5maW5pdHkpO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5nZXRDb2RlID0gZnVuY3Rpb24gKHBvcykge1xuICAgICAgICBpZiAocG9zID09PSB2b2lkIDApIHsgcG9zID0gdGhpcy5zdGF0ZS5wb3M7IH1cbiAgICAgICAgcmV0dXJuIGZ1bGxDaGFyQ29kZUF0UG9zKHRoaXMuaW5wdXQsIHBvcyk7XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmVhdCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKHR5cGUpKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnJlYWRLZXlXb3JkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnBvcywgc3RyaW5nID0gJyc7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgY29kZSA9IHRoaXMuZ2V0Q29kZSgpO1xuICAgICAgICAgICAgdmFyIHByZXZDb2RlID0gdGhpcy5nZXRDb2RlKHRoaXMuc3RhdGUucG9zIC0gMSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dC5sZW5ndGggPT09IHRoaXMuc3RhdGUucG9zKSB7XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gc2xpY2UodGhpcy5pbnB1dCwgc3RhcnRQb3MsIHRoaXMuc3RhdGUucG9zICsgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzUmV3b3JkQ29kZShjb2RlKSB8fCBwcmV2Q29kZSA9PT0gOTIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29kZSA9PT0gMzIgfHxcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9PT0gMTYwIHx8XG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPT09IDEwIHx8XG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPT09IDgyMzIgfHxcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9PT0gODIzMykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgPSBzbGljZSh0aGlzLmlucHV0LCBzdGFydFBvcywgdGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNvZGUgPT09IDEzICYmIHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDEpID09PSAxMCkge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgPSBzbGljZSh0aGlzLmlucHV0LCBzdGFydFBvcywgdGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKChjb2RlID4gOCAmJiBjb2RlIDwgMTQpIHx8XG4gICAgICAgICAgICAgICAgICAgIChjb2RlID49IDU3NjAgJiYgbm9uQVNDSUl3aGl0ZXNwYWNlLnRlc3QoU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyA9IHNsaWNlKHRoaXMuaW5wdXQsIHN0YXJ0UG9zLCB0aGlzLnN0YXRlLnBvcyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gc2xpY2UodGhpcy5pbnB1dCwgc3RhcnRQb3MsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLm5hbWVUb2ssIHN0cmluZyk7XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnJlYWRJbmdvcmVTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGFydFBvcyA9IHRoaXMuc3RhdGUucG9zLCBwcmV2Q29kZSwgc3RyaW5nID0gJyc7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgY29kZSA9IHRoaXMuZ2V0Q29kZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUucG9zID49IHRoaXMuaW5wdXQubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgaWYgKChjb2RlID09PSA5MSB8fCBjb2RlID09PSA5MykgJiYgcHJldkNvZGUgPT09IDkyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgICAgICBwcmV2Q29kZSA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29kZSA9PSA5MyAmJiBwcmV2Q29kZSA9PT0gOTMpIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSB0aGlzLmlucHV0XG4gICAgICAgICAgICAgICAgICAgIC5zbGljZShzdGFydFBvcywgdGhpcy5zdGF0ZS5wb3MgLSAxKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXChbXFxbXFxdXSkvZywgJyQxJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICAgICAgcHJldkNvZGUgPSBjb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuaWdub3JlVG9rLCBzdHJpbmcpO1xuICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmJyYWNrZXREUlRvayk7XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmZpbmlzaFRva2VuID0gZnVuY3Rpb24gKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgIHZhciBwcmVUeXBlID0gdGhpcy5zdGF0ZS50eXBlO1xuICAgICAgICB0aGlzLnN0YXRlLnR5cGUgPSB0eXBlO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5leHBlY3ROZXh0KHByZVR5cGUsIHR5cGUpO1xuICAgICAgICB0aGlzLmV4cGVjdFByZXYodHlwZSwgcHJlVHlwZSk7XG4gICAgICAgIGlmICh0eXBlLnVwZGF0ZUNvbnRleHQpIHtcbiAgICAgICAgICAgIHR5cGUudXBkYXRlQ29udGV4dC5jYWxsKHRoaXMsIHByZVR5cGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnJlYWRUb2tlbiA9IGZ1bmN0aW9uIChjb2RlLCBwcmV2Q29kZSkge1xuICAgICAgICBpZiAocHJldkNvZGUgPT09IDkyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkS2V5V29yZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlucHV0Lmxlbmd0aCA8PSB0aGlzLnN0YXRlLnBvcykge1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5lb2ZUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY3VyQ29udGV4dCgpID09PSBjb250ZXh0c18xLmJyYWNrZXREQ29udGV4dCkge1xuICAgICAgICAgICAgdGhpcy5yZWFkSW5nb3JlU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMTIzKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5icmFjZUxUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDEyNSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuYnJhY2VSVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSA0Mikge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuc3RhclRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMzMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmJhbmdUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDQ2KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5kb3RUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDkxKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q29kZSgpID09PSA5MSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuYnJhY2tldERMVG9rKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuYnJhY2tldExUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDEyNikge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuZXhwYW5kVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSA5Mykge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuYnJhY2tldFJUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDQwKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5wYXJlbkxUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDQxKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5wYXJlblJUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDQ0KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5jb21tYVRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gNTgpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmNvbG9uVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVhZEtleVdvcmQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFRva2VuaXplcjtcbn0oKSk7XG5leHBvcnRzLlRva2VuaXplciA9IFRva2VuaXplcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0FycmF5UGF0dGVybiA9IGV4cG9ydHMuaXNPYmplY3RQYXR0ZXJuUHJvcGVydHkgPSBleHBvcnRzLmlzT2JqZWN0UGF0dGVybiA9IGV4cG9ydHMuaXNEZXN0cnVjdG9yRXhwcmVzc2lvbiA9IGV4cG9ydHMuaXNSYW5nZUV4cHJlc3Npb24gPSBleHBvcnRzLmlzR3JvdXBFeHByZXNzaW9uID0gZXhwb3J0cy5pc0V4cGFuZE9wZXJhdG9yID0gZXhwb3J0cy5pc1dpbGRjYXJkT3BlcmF0b3IgPSBleHBvcnRzLmlzRG90T3BlcmF0b3IgPSBleHBvcnRzLmlzSWdub3JlRXhwcmVzc2lvbiA9IGV4cG9ydHMuaXNJZGVudGlmaWVyID0gZXhwb3J0cy5pc1R5cGUgPSB2b2lkIDA7XG5leHBvcnRzLmlzVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7IHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmoudHlwZSA9PT0gdHlwZTtcbn07IH07XG5leHBvcnRzLmlzSWRlbnRpZmllciA9IGV4cG9ydHMuaXNUeXBlKCdJZGVudGlmaWVyJyk7XG5leHBvcnRzLmlzSWdub3JlRXhwcmVzc2lvbiA9IGV4cG9ydHMuaXNUeXBlKCdJZ25vcmVFeHByZXNzaW9uJyk7XG5leHBvcnRzLmlzRG90T3BlcmF0b3IgPSBleHBvcnRzLmlzVHlwZSgnRG90T3BlcmF0b3InKTtcbmV4cG9ydHMuaXNXaWxkY2FyZE9wZXJhdG9yID0gZXhwb3J0cy5pc1R5cGUoJ1dpbGRjYXJkT3BlcmF0b3InKTtcbmV4cG9ydHMuaXNFeHBhbmRPcGVyYXRvciA9IGV4cG9ydHMuaXNUeXBlKCdFeHBhbmRPcGVyYXRvcicpO1xuZXhwb3J0cy5pc0dyb3VwRXhwcmVzc2lvbiA9IGV4cG9ydHMuaXNUeXBlKCdHcm91cEV4cHJlc3Npb24nKTtcbmV4cG9ydHMuaXNSYW5nZUV4cHJlc3Npb24gPSBleHBvcnRzLmlzVHlwZSgnUmFuZ2VFeHByZXNzaW9uJyk7XG5leHBvcnRzLmlzRGVzdHJ1Y3RvckV4cHJlc3Npb24gPSBleHBvcnRzLmlzVHlwZSgnRGVzdHJ1Y3RvckV4cHJlc3Npb24nKTtcbmV4cG9ydHMuaXNPYmplY3RQYXR0ZXJuID0gZXhwb3J0cy5pc1R5cGUoJ09iamVjdFBhdHRlcm4nKTtcbmV4cG9ydHMuaXNPYmplY3RQYXR0ZXJuUHJvcGVydHkgPSBleHBvcnRzLmlzVHlwZSgnT2JqZWN0UGF0dGVyblByb3BlcnR5Jyk7XG5leHBvcnRzLmlzQXJyYXlQYXR0ZXJuID0gZXhwb3J0cy5pc1R5cGUoJ0FycmF5UGF0dGVybicpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzRXF1YWwgPSBleHBvcnRzLnRvQXJyYXkgPSBleHBvcnRzLmlzUmVnRXhwID0gZXhwb3J0cy5pc09iaiA9IGV4cG9ydHMuaXNOdW0gPSBleHBvcnRzLmlzQm9vbCA9IGV4cG9ydHMuaXNTdHIgPSBleHBvcnRzLmlzUGxhaW5PYmogPSBleHBvcnRzLmlzQXJyID0gZXhwb3J0cy5pc0ZuID0gdm9pZCAwO1xudmFyIGlzVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7IHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSBcIltvYmplY3QgXCIgKyB0eXBlICsgXCJdXCI7XG59OyB9O1xuZXhwb3J0cy5pc0ZuID0gaXNUeXBlKCdGdW5jdGlvbicpO1xuZXhwb3J0cy5pc0FyciA9IEFycmF5LmlzQXJyYXkgfHwgaXNUeXBlKCdBcnJheScpO1xuZXhwb3J0cy5pc1BsYWluT2JqID0gaXNUeXBlKCdPYmplY3QnKTtcbmV4cG9ydHMuaXNTdHIgPSBpc1R5cGUoJ1N0cmluZycpO1xuZXhwb3J0cy5pc0Jvb2wgPSBpc1R5cGUoJ0Jvb2xlYW4nKTtcbmV4cG9ydHMuaXNOdW0gPSBpc1R5cGUoJ051bWJlcicpO1xuZXhwb3J0cy5pc09iaiA9IGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnOyB9O1xuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzVHlwZSgnUmVnRXhwJyk7XG52YXIgaXNBcnJheSA9IGV4cG9ydHMuaXNBcnI7XG52YXIga2V5TGlzdCA9IE9iamVjdC5rZXlzO1xudmFyIGhhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZXhwb3J0cy50b0FycmF5ID0gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsIDogdmFsICE9PSB1bmRlZmluZWQgPyBbdmFsXSA6IFtdOyB9O1xuZXhwb3J0cy5pc0VxdWFsID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGEgJiYgYiAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGIgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBhcnJBID0gaXNBcnJheShhKTtcbiAgICAgICAgdmFyIGFyckIgPSBpc0FycmF5KGIpO1xuICAgICAgICB2YXIgaSA9IHZvaWQgMDtcbiAgICAgICAgdmFyIGxlbmd0aF8xO1xuICAgICAgICB2YXIga2V5ID0gdm9pZCAwO1xuICAgICAgICBpZiAoYXJyQSAmJiBhcnJCKSB7XG4gICAgICAgICAgICBsZW5ndGhfMSA9IGEubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbmd0aF8xICE9PSBiLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IGxlbmd0aF8xOyBpLS0gIT09IDA7KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFleHBvcnRzLmlzRXF1YWwoYVtpXSwgYltpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcnJBICE9PSBhcnJCKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGtleXMgPSBrZXlMaXN0KGEpO1xuICAgICAgICBsZW5ndGhfMSA9IGtleXMubGVuZ3RoO1xuICAgICAgICBpZiAobGVuZ3RoXzEgIT09IGtleUxpc3QoYikubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gbGVuZ3RoXzE7IGktLSAhPT0gMDspIHtcbiAgICAgICAgICAgIGlmICghaGFzUHJvcC5jYWxsKGIsIGtleXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IGxlbmd0aF8xOyBpLS0gIT09IDA7KSB7XG4gICAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgICAgaWYgKCFleHBvcnRzLmlzRXF1YWwoYVtrZXldLCBiW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gYSAhPT0gYSAmJiBiICE9PSBiO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leGlzdEluQnlEZXN0cnVjdG9yID0gZXhwb3J0cy5kZWxldGVJbkJ5RGVzdHJ1Y3RvciA9IGV4cG9ydHMuZ2V0SW5CeURlc3RydWN0b3IgPSBleHBvcnRzLnNldEluQnlEZXN0cnVjdG9yID0gZXhwb3J0cy5wYXJzZURlc3RydWN0b3JSdWxlcyA9IGV4cG9ydHMuc2V0RGVzdHJ1Y3RvciA9IGV4cG9ydHMuZ2V0RGVzdHJ1Y3RvciA9IHZvaWQgMDtcbnZhciB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIERlc3RyY3V0b3JDYWNoZSA9IG5ldyBNYXAoKTtcbnZhciBpc1ZhbGlkID0gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsICE9PSB1bmRlZmluZWQgJiYgdmFsICE9PSBudWxsOyB9O1xuZXhwb3J0cy5nZXREZXN0cnVjdG9yID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHJldHVybiBEZXN0cmN1dG9yQ2FjaGUuZ2V0KHNvdXJjZSk7XG59O1xuZXhwb3J0cy5zZXREZXN0cnVjdG9yID0gZnVuY3Rpb24gKHNvdXJjZSwgcnVsZXMpIHtcbiAgICBEZXN0cmN1dG9yQ2FjaGUuc2V0KHNvdXJjZSwgcnVsZXMpO1xufTtcbmV4cG9ydHMucGFyc2VEZXN0cnVjdG9yUnVsZXMgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBydWxlcyA9IFtdO1xuICAgIGlmICh0eXBlc18xLmlzT2JqZWN0UGF0dGVybihub2RlKSkge1xuICAgICAgICB2YXIgaW5kZXhfMSA9IDA7XG4gICAgICAgIG5vZGUucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgcnVsZXNbaW5kZXhfMV0gPSB7XG4gICAgICAgICAgICAgICAgcGF0aDogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBydWxlc1tpbmRleF8xXS5rZXkgPSBjaGlsZC5rZXkudmFsdWU7XG4gICAgICAgICAgICBydWxlc1tpbmRleF8xXS5wYXRoLnB1c2goY2hpbGQua2V5LnZhbHVlKTtcbiAgICAgICAgICAgIGlmICh0eXBlc18xLmlzSWRlbnRpZmllcihjaGlsZC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBydWxlc1tpbmRleF8xXS5rZXkgPSBjaGlsZC52YWx1ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiYXNlUGF0aCA9IHJ1bGVzW2luZGV4XzFdLnBhdGg7XG4gICAgICAgICAgICB2YXIgY2hpbGRSdWxlcyA9IGV4cG9ydHMucGFyc2VEZXN0cnVjdG9yUnVsZXMoY2hpbGQudmFsdWUpO1xuICAgICAgICAgICAgdmFyIGsgPSBpbmRleF8xO1xuICAgICAgICAgICAgY2hpbGRSdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJ1bGVzW2tdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzW2tdLmtleSA9IHJ1bGUua2V5O1xuICAgICAgICAgICAgICAgICAgICBydWxlc1trXS5wYXRoID0gYmFzZVBhdGguY29uY2F0KHJ1bGUucGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBydWxlc1trXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogcnVsZS5rZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBiYXNlUGF0aC5jb25jYXQocnVsZS5wYXRoKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChrID4gaW5kZXhfMSkge1xuICAgICAgICAgICAgICAgIGluZGV4XzEgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5kZXhfMSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJ1bGVzO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlc18xLmlzQXJyYXlQYXR0ZXJuKG5vZGUpKSB7XG4gICAgICAgIHZhciBpbmRleF8yID0gMDtcbiAgICAgICAgbm9kZS5lbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCwga2V5KSB7XG4gICAgICAgICAgICBydWxlc1tpbmRleF8yXSA9IHtcbiAgICAgICAgICAgICAgICBwYXRoOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJ1bGVzW2luZGV4XzJdLmtleSA9IGtleTtcbiAgICAgICAgICAgIHJ1bGVzW2luZGV4XzJdLnBhdGgucHVzaChrZXkpO1xuICAgICAgICAgICAgaWYgKHR5cGVzXzEuaXNJZGVudGlmaWVyKGNoaWxkKSkge1xuICAgICAgICAgICAgICAgIHJ1bGVzW2luZGV4XzJdLmtleSA9IGNoaWxkLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJhc2VQYXRoID0gcnVsZXNbaW5kZXhfMl0ucGF0aDtcbiAgICAgICAgICAgIHZhciBjaGlsZFJ1bGVzID0gZXhwb3J0cy5wYXJzZURlc3RydWN0b3JSdWxlcyhjaGlsZCk7XG4gICAgICAgICAgICB2YXIgayA9IGluZGV4XzI7XG4gICAgICAgICAgICBjaGlsZFJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgICAgICBpZiAocnVsZXNba10pIHtcbiAgICAgICAgICAgICAgICAgICAgcnVsZXNba10ua2V5ID0gcnVsZS5rZXk7XG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzW2tdLnBhdGggPSBiYXNlUGF0aC5jb25jYXQocnVsZS5wYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzW2tdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBydWxlLmtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGJhc2VQYXRoLmNvbmNhdChydWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGsgPiBpbmRleF8yKSB7XG4gICAgICAgICAgICAgICAgaW5kZXhfMiA9IGs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmRleF8yKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcnVsZXM7XG4gICAgfVxuICAgIGlmICh0eXBlc18xLmlzRGVzdHJ1Y3RvckV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMucGFyc2VEZXN0cnVjdG9yUnVsZXMobm9kZS52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBydWxlcztcbn07XG5leHBvcnRzLnNldEluQnlEZXN0cnVjdG9yID0gZnVuY3Rpb24gKHNvdXJjZSwgcnVsZXMsIHZhbHVlLCBtdXRhdG9ycykge1xuICAgIHJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBrZXkgPSBfYS5rZXksIHBhdGggPSBfYS5wYXRoO1xuICAgICAgICBtdXRhdG9ycy5zZXRJbihba2V5XSwgc291cmNlLCBtdXRhdG9ycy5nZXRJbihwYXRoLCB2YWx1ZSkpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMuZ2V0SW5CeURlc3RydWN0b3IgPSBmdW5jdGlvbiAoc291cmNlLCBydWxlcywgbXV0YXRvcnMpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSB7fTtcbiAgICBpZiAocnVsZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh1dGlsc18xLmlzTnVtKHJ1bGVzWzBdLnBhdGhbMF0pKSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNvdXJjZSA9IGlzVmFsaWQoc291cmNlKSA/IHNvdXJjZSA6IHt9O1xuICAgIHJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBrZXkgPSBfYS5rZXksIHBhdGggPSBfYS5wYXRoO1xuICAgICAgICBtdXRhdG9ycy5zZXRJbihwYXRoLCByZXNwb25zZSwgc291cmNlW2tleV0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXNwb25zZTtcbn07XG5leHBvcnRzLmRlbGV0ZUluQnlEZXN0cnVjdG9yID0gZnVuY3Rpb24gKHNvdXJjZSwgcnVsZXMsIG11dGF0b3JzKSB7XG4gICAgcnVsZXMuZm9yRWFjaChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGtleSA9IF9hLmtleTtcbiAgICAgICAgbXV0YXRvcnMuZGVsZXRlSW4oW2tleV0sIHNvdXJjZSk7XG4gICAgfSk7XG59O1xuZXhwb3J0cy5leGlzdEluQnlEZXN0cnVjdG9yID0gZnVuY3Rpb24gKHNvdXJjZSwgcnVsZXMsIHN0YXJ0LCBtdXRhdG9ycykge1xuICAgIHJldHVybiBydWxlcy5ldmVyeShmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGtleSA9IF9hLmtleTtcbiAgICAgICAgcmV0dXJuIG11dGF0b3JzLmV4aXN0SW4oW2tleV0sIHNvdXJjZSwgc3RhcnQpO1xuICAgIH0pO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBhcnNlciA9IHZvaWQgMDtcbnZhciB0b2tlbml6ZXJfMSA9IHJlcXVpcmUoXCIuL3Rva2VuaXplclwiKTtcbnZhciB0b2tlbnNfMSA9IHJlcXVpcmUoXCIuL3Rva2Vuc1wiKTtcbnZhciBjb250ZXh0c18xID0gcmVxdWlyZShcIi4vY29udGV4dHNcIik7XG52YXIgZGVzdHJ1Y3Rvcl8xID0gcmVxdWlyZShcIi4vZGVzdHJ1Y3RvclwiKTtcbnZhciBQYXJzZXIgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhQYXJzZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUGFyc2VyKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlO1xuICAgICAgICB0aGlzLmRhdGEgPSB7XG4gICAgICAgICAgICBzZWdtZW50czogW11cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCF0aGlzLmVhdCh0b2tlbnNfMS5lb2ZUb2spKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIG5vZGUgPSB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YS50cmVlID0gbm9kZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChwYXJlbnQsIG5vZGUpIHtcbiAgICAgICAgaWYgKHBhcmVudCAmJiBub2RlKSB7XG4gICAgICAgICAgICBwYXJlbnQuYWZ0ZXIgPSBub2RlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQXRvbSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5icmFjZUxUb2s6XG4gICAgICAgICAgICBjYXNlIHRva2Vuc18xLmJyYWNrZXRMVG9rOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gdG9rZW5zXzEuYnJhY2VMVG9rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9iamVjdFBhdHRlcm4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQXJyYXlQYXR0ZXJuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEZXN0cnVjdG9yRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5uYW1lVG9rOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlSWRlbnRpZmllcigpO1xuICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5leHBhbmRUb2s6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VFeHBhbmRPcGVyYXRvcigpO1xuICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5zdGFyVG9rOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlV2lsZGNhcmRPcGVyYXRvcigpO1xuICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5icmFja2V0RExUb2s6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VJZ25vcmVFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICBjYXNlIHRva2Vuc18xLmRvdFRvazpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURvdE9wZXJhdG9yKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucHVzaFNlZ21lbnRzID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB0aGlzLmRhdGEuc2VnbWVudHMucHVzaChrZXkpO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUlkZW50aWZpZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ0lkZW50aWZpZXInLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuc3RhdGUudmFsdWVcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGhhc05vdEluRGVzdHJ1Y3RvciA9ICF0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KSAmJlxuICAgICAgICAgICAgIXRoaXMuaXNNYXRjaFBhdHRlcm4gJiZcbiAgICAgICAgICAgICF0aGlzLmlzV2lsZE1hdGNoUGF0dGVybjtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmJyYWNrZXRBcnJheUNvbnRleHQpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS50eXBlICE9PSB0b2tlbnNfMS5icmFja2V0UlRvaykge1xuICAgICAgICAgICAgICAgIHRocm93IHRoaXMudW5leHBlY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wb3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChoYXNOb3RJbkRlc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMucHVzaFNlZ21lbnRzKG5vZGUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnR5cGUgPT09IHRva2Vuc18xLmJyYWNrZXRMVG9rKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnR5cGUgIT09IHRva2Vuc18xLm5hbWVUb2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucHVzaChjb250ZXh0c18xLmJyYWNrZXRBcnJheUNvbnRleHQpO1xuICAgICAgICAgICAgdmFyIGlzTnVtYmVyS2V5ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoL15cXGQrJC8udGVzdCh0aGlzLnN0YXRlLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGlzTnVtYmVyS2V5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgICAgICAgICB0aGlzLnB1c2hTZWdtZW50cyhpc051bWJlcktleSA/IE51bWJlcih2YWx1ZSkgOiB2YWx1ZSk7XG4gICAgICAgICAgICB2YXIgYWZ0ZXIgPSB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpO1xuICAgICAgICAgICAgaWYgKGlzTnVtYmVyS2V5KSB7XG4gICAgICAgICAgICAgICAgYWZ0ZXIuYXJyYXlJbmRleCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFwcGVuZChub2RlLCBhZnRlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZChub2RlLCB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VFeHBhbmRPcGVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnRXhwYW5kT3BlcmF0b3InXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaXNNYXRjaFBhdHRlcm4gPSB0cnVlO1xuICAgICAgICB0aGlzLmlzV2lsZE1hdGNoUGF0dGVybiA9IHRydWU7XG4gICAgICAgIHRoaXMuZGF0YS5zZWdtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5hcHBlbmQobm9kZSwgdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVdpbGRjYXJkT3BlcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ1dpbGRjYXJkT3BlcmF0b3InXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaXNNYXRjaFBhdHRlcm4gPSB0cnVlO1xuICAgICAgICB0aGlzLmlzV2lsZE1hdGNoUGF0dGVybiA9IHRydWU7XG4gICAgICAgIHRoaXMuZGF0YS5zZWdtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUudHlwZSA9PT0gdG9rZW5zXzEucGFyZW5MVG9rKSB7XG4gICAgICAgICAgICBub2RlLmZpbHRlciA9IHRoaXMucGFyc2VHcm91cEV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGF0ZS50eXBlID09PSB0b2tlbnNfMS5icmFja2V0TFRvaykge1xuICAgICAgICAgICAgbm9kZS5maWx0ZXIgPSB0aGlzLnBhcnNlUmFuZ2VFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXBwZW5kKG5vZGUsIHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VEZXN0cnVjdG9yRXhwcmVzc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnRGVzdHJ1Y3RvckV4cHJlc3Npb24nXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wdXNoKGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpO1xuICAgICAgICB2YXIgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnBvcyAtIDE7XG4gICAgICAgIG5vZGUudmFsdWUgPVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS50eXBlID09PSB0b2tlbnNfMS5icmFjZUxUb2tcbiAgICAgICAgICAgICAgICA/IHRoaXMucGFyc2VPYmplY3RQYXR0ZXJuKClcbiAgICAgICAgICAgICAgICA6IHRoaXMucGFyc2VBcnJheVBhdHRlcm4oKTtcbiAgICAgICAgdmFyIGVuZFBvcyA9IHRoaXMuc3RhdGUucG9zO1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucG9wKCk7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB0aGlzLmFwcGVuZChub2RlLCB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgbm9kZS5zb3VyY2UgPSB0aGlzLmlucHV0LnN1YnN0cmluZyhzdGFydFBvcywgZW5kUG9zKS5yZXBsYWNlKC9cXHMqL2csICcnKTtcbiAgICAgICAgZGVzdHJ1Y3Rvcl8xLnNldERlc3RydWN0b3Iobm9kZS5zb3VyY2UsIGRlc3RydWN0b3JfMS5wYXJzZURlc3RydWN0b3JSdWxlcyhub2RlKSk7XG4gICAgICAgIHRoaXMucHVzaFNlZ21lbnRzKG5vZGUuc291cmNlKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQXJyYXlQYXR0ZXJuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdBcnJheVBhdHRlcm4nLFxuICAgICAgICAgICAgZWxlbWVudHM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICBub2RlLmVsZW1lbnRzID0gdGhpcy5wYXJzZUFycmF5UGF0dGVybkVsZW1lbnRzKCk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUFycmF5UGF0dGVybkVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgd2hpbGUgKHRoaXMuc3RhdGUudHlwZSAhPT0gdG9rZW5zXzEuYnJhY2tldFJUb2sgJiYgdGhpcy5zdGF0ZS50eXBlICE9PSB0b2tlbnNfMS5lb2ZUb2spIHtcbiAgICAgICAgICAgIG5vZGVzLnB1c2godGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS50eXBlID09PSB0b2tlbnNfMS5icmFja2V0UlRvaykge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZU9iamVjdFBhdHRlcm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ09iamVjdFBhdHRlcm4nLFxuICAgICAgICAgICAgcHJvcGVydGllczogW11cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIG5vZGUucHJvcGVydGllcyA9IHRoaXMucGFyc2VPYmplY3RQcm9wZXJ0aWVzKCk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZU9iamVjdFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICB3aGlsZSAodGhpcy5zdGF0ZS50eXBlICE9PSB0b2tlbnNfMS5icmFjZVJUb2sgJiYgdGhpcy5zdGF0ZS50eXBlICE9PSB0b2tlbnNfMS5lb2ZUb2spIHtcbiAgICAgICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdPYmplY3RQYXR0ZXJuUHJvcGVydHknLFxuICAgICAgICAgICAgICAgIGtleTogdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS50eXBlID09PSB0b2tlbnNfMS5jb2xvblRvaykge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIG5vZGUudmFsdWUgPSB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUudHlwZSA9PT0gdG9rZW5zXzEuYnJhY2VSVG9rKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlRG90T3BlcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ0RvdE9wZXJhdG9yJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5hcHBlbmQobm9kZSwgdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUlnbm9yZUV4cHJlc3Npb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB2YXIgdmFsdWUgPSBTdHJpbmcodGhpcy5zdGF0ZS52YWx1ZSkucmVwbGFjZSgvXFxzKi9nLCAnJyk7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ0lnbm9yZUV4cHJlc3Npb24nLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucHVzaFNlZ21lbnRzKHZhbHVlKTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5vZGUsIHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlR3JvdXBFeHByZXNzaW9uID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdHcm91cEV4cHJlc3Npb24nLFxuICAgICAgICAgICAgdmFsdWU6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaXNNYXRjaFBhdHRlcm4gPSB0cnVlO1xuICAgICAgICB0aGlzLmRhdGEuc2VnbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIGxvb3A6IHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuY29tbWFUb2s6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRva2Vuc18xLmJhbmdUb2s6XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaXNFeGNsdWRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXZlRXhjbHVkZVBhdHRlcm4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5lb2ZUb2s6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIGxvb3A7XG4gICAgICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5wYXJlblJUb2s6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIGxvb3A7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgbm9kZS52YWx1ZS5wdXNoKHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB0aGlzLmFwcGVuZChwYXJlbnQsIHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VSYW5nZUV4cHJlc3Npb24gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ1JhbmdlRXhwcmVzc2lvbidcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHRoaXMuaXNNYXRjaFBhdHRlcm4gPSB0cnVlO1xuICAgICAgICB0aGlzLmRhdGEuc2VnbWVudHMgPSBbXTtcbiAgICAgICAgdmFyIHN0YXJ0ID0gZmFsc2UsIGhhc0NvbG9uID0gZmFsc2U7XG4gICAgICAgIGxvb3A6IHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuY29sb25Ub2s6XG4gICAgICAgICAgICAgICAgICAgIGhhc0NvbG9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5icmFja2V0UlRvazpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNDb2xvbiAmJiAhbm9kZS5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZW5kID0gbm9kZS5zdGFydDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuY29tbWFUb2s6XG4gICAgICAgICAgICAgICAgICAgIHRocm93IHRoaXMudW5leHBlY3QoKTtcbiAgICAgICAgICAgICAgICBjYXNlIHRva2Vuc18xLmVvZlRvazpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnN0YXJ0ID0gdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZW5kID0gdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB0aGlzLmFwcGVuZChwYXJlbnQsIHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIHJldHVybiBQYXJzZXI7XG59KHRva2VuaXplcl8xLlRva2VuaXplcikpO1xuZXhwb3J0cy5QYXJzZXIgPSBQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTFJVTWFwID0gdm9pZCAwO1xudmFyIE5FV0VSID0gU3ltYm9sKCduZXdlcicpO1xudmFyIE9MREVSID0gU3ltYm9sKCdvbGRlcicpO1xuZnVuY3Rpb24gTFJVTWFwKGxpbWl0LCBlbnRyaWVzKSB7XG4gICAgaWYgKHR5cGVvZiBsaW1pdCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgZW50cmllcyA9IGxpbWl0O1xuICAgICAgICBsaW1pdCA9IDA7XG4gICAgfVxuICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgdGhpcy5saW1pdCA9IGxpbWl0O1xuICAgIHRoaXMub2xkZXN0ID0gdGhpcy5uZXdlc3QgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fa2V5bWFwID0gbmV3IE1hcCgpO1xuICAgIGlmIChlbnRyaWVzKSB7XG4gICAgICAgIHRoaXMuYXNzaWduKGVudHJpZXMpO1xuICAgICAgICBpZiAobGltaXQgPCAxKSB7XG4gICAgICAgICAgICB0aGlzLmxpbWl0ID0gdGhpcy5zaXplO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5MUlVNYXAgPSBMUlVNYXA7XG5mdW5jdGlvbiBFbnRyeShrZXksIHZhbHVlKSB7XG4gICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXNbTkVXRVJdID0gdW5kZWZpbmVkO1xuICAgIHRoaXNbT0xERVJdID0gdW5kZWZpbmVkO1xufVxuTFJVTWFwLnByb3RvdHlwZS5fbWFya0VudHJ5QXNVc2VkID0gZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgaWYgKGVudHJ5ID09PSB0aGlzLm5ld2VzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChlbnRyeVtORVdFUl0pIHtcbiAgICAgICAgaWYgKGVudHJ5ID09PSB0aGlzLm9sZGVzdCkge1xuICAgICAgICAgICAgdGhpcy5vbGRlc3QgPSBlbnRyeVtORVdFUl07XG4gICAgICAgIH1cbiAgICAgICAgZW50cnlbTkVXRVJdW09MREVSXSA9IGVudHJ5W09MREVSXTtcbiAgICB9XG4gICAgaWYgKGVudHJ5W09MREVSXSkge1xuICAgICAgICBlbnRyeVtPTERFUl1bTkVXRVJdID0gZW50cnlbTkVXRVJdO1xuICAgIH1cbiAgICBlbnRyeVtORVdFUl0gPSB1bmRlZmluZWQ7XG4gICAgZW50cnlbT0xERVJdID0gdGhpcy5uZXdlc3Q7XG4gICAgaWYgKHRoaXMubmV3ZXN0KSB7XG4gICAgICAgIHRoaXMubmV3ZXN0W05FV0VSXSA9IGVudHJ5O1xuICAgIH1cbiAgICB0aGlzLm5ld2VzdCA9IGVudHJ5O1xufTtcbkxSVU1hcC5wcm90b3R5cGUuYXNzaWduID0gZnVuY3Rpb24gKGVudHJpZXMpIHtcbiAgICB2YXIgZW50cnk7XG4gICAgdmFyIGxpbWl0ID0gdGhpcy5saW1pdCB8fCBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgIHRoaXMuX2tleW1hcC5jbGVhcigpO1xuICAgIHZhciBpdCA9IGVudHJpZXNbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICAgIGZvciAodmFyIGl0diA9IGl0Lm5leHQoKTsgIWl0di5kb25lOyBpdHYgPSBpdC5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGUgPSBuZXcgRW50cnkoaXR2LnZhbHVlWzBdLCBpdHYudmFsdWVbMV0pO1xuICAgICAgICB0aGlzLl9rZXltYXAuc2V0KGUua2V5LCBlKTtcbiAgICAgICAgaWYgKCFlbnRyeSkge1xuICAgICAgICAgICAgdGhpcy5vbGRlc3QgPSBlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZW50cnlbTkVXRVJdID0gZTtcbiAgICAgICAgICAgIGVbT0xERVJdID0gZW50cnk7XG4gICAgICAgIH1cbiAgICAgICAgZW50cnkgPSBlO1xuICAgICAgICBpZiAobGltaXQtLSA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdvdmVyZmxvdycpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMubmV3ZXN0ID0gZW50cnk7XG4gICAgdGhpcy5zaXplID0gdGhpcy5fa2V5bWFwLnNpemU7XG59O1xuTFJVTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5fa2V5bWFwLmdldChrZXkpO1xuICAgIGlmICghZW50cnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9tYXJrRW50cnlBc1VzZWQoZW50cnkpO1xuICAgIHJldHVybiBlbnRyeS52YWx1ZTtcbn07XG5MUlVNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5fa2V5bWFwLmdldChrZXkpO1xuICAgIGlmIChlbnRyeSkge1xuICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9tYXJrRW50cnlBc1VzZWQoZW50cnkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdGhpcy5fa2V5bWFwLnNldChrZXksIChlbnRyeSA9IG5ldyBFbnRyeShrZXksIHZhbHVlKSkpO1xuICAgIGlmICh0aGlzLm5ld2VzdCkge1xuICAgICAgICB0aGlzLm5ld2VzdFtORVdFUl0gPSBlbnRyeTtcbiAgICAgICAgZW50cnlbT0xERVJdID0gdGhpcy5uZXdlc3Q7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLm9sZGVzdCA9IGVudHJ5O1xuICAgIH1cbiAgICB0aGlzLm5ld2VzdCA9IGVudHJ5O1xuICAgICsrdGhpcy5zaXplO1xuICAgIGlmICh0aGlzLnNpemUgPiB0aGlzLmxpbWl0KSB7XG4gICAgICAgIHRoaXMuc2hpZnQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuTFJVTWFwLnByb3RvdHlwZS5zaGlmdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLm9sZGVzdDtcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgaWYgKHRoaXMub2xkZXN0W05FV0VSXSkge1xuICAgICAgICAgICAgdGhpcy5vbGRlc3QgPSB0aGlzLm9sZGVzdFtORVdFUl07XG4gICAgICAgICAgICB0aGlzLm9sZGVzdFtPTERFUl0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9sZGVzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMubmV3ZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVudHJ5W05FV0VSXSA9IGVudHJ5W09MREVSXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fa2V5bWFwLmRlbGV0ZShlbnRyeS5rZXkpO1xuICAgICAgICAtLXRoaXMuc2l6ZTtcbiAgICAgICAgcmV0dXJuIFtlbnRyeS5rZXksIGVudHJ5LnZhbHVlXTtcbiAgICB9XG59O1xuTFJVTWFwLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBlID0gdGhpcy5fa2V5bWFwLmdldChrZXkpO1xuICAgIHJldHVybiBlID8gZS52YWx1ZSA6IHVuZGVmaW5lZDtcbn07XG5MUlVNYXAucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5bWFwLmhhcyhrZXkpO1xufTtcbkxSVU1hcC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBlbnRyeSA9IHRoaXMuX2tleW1hcC5nZXQoa2V5KTtcbiAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fa2V5bWFwLmRlbGV0ZShlbnRyeS5rZXkpO1xuICAgIGlmIChlbnRyeVtORVdFUl0gJiYgZW50cnlbT0xERVJdKSB7XG4gICAgICAgIGVudHJ5W09MREVSXVtORVdFUl0gPSBlbnRyeVtORVdFUl07XG4gICAgICAgIGVudHJ5W05FV0VSXVtPTERFUl0gPSBlbnRyeVtPTERFUl07XG4gICAgfVxuICAgIGVsc2UgaWYgKGVudHJ5W05FV0VSXSkge1xuICAgICAgICBlbnRyeVtORVdFUl1bT0xERVJdID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm9sZGVzdCA9IGVudHJ5W05FV0VSXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZW50cnlbT0xERVJdKSB7XG4gICAgICAgIGVudHJ5W09MREVSXVtORVdFUl0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubmV3ZXN0ID0gZW50cnlbT0xERVJdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5vbGRlc3QgPSB0aGlzLm5ld2VzdCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5zaXplLS07XG4gICAgcmV0dXJuIGVudHJ5LnZhbHVlO1xufTtcbkxSVU1hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5vbGRlc3QgPSB0aGlzLm5ld2VzdCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNpemUgPSAwO1xuICAgIHRoaXMuX2tleW1hcC5jbGVhcigpO1xufTtcbmZ1bmN0aW9uIEVudHJ5SXRlcmF0b3Iob2xkZXN0RW50cnkpIHtcbiAgICB0aGlzLmVudHJ5ID0gb2xkZXN0RW50cnk7XG59XG5FbnRyeUl0ZXJhdG9yLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xufTtcbkVudHJ5SXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVudCA9IHRoaXMuZW50cnk7XG4gICAgaWYgKGVudCkge1xuICAgICAgICB0aGlzLmVudHJ5ID0gZW50W05FV0VSXTtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBbZW50LmtleSwgZW50LnZhbHVlXSB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuICAgIH1cbn07XG5mdW5jdGlvbiBLZXlJdGVyYXRvcihvbGRlc3RFbnRyeSkge1xuICAgIHRoaXMuZW50cnkgPSBvbGRlc3RFbnRyeTtcbn1cbktleUl0ZXJhdG9yLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xufTtcbktleUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbnQgPSB0aGlzLmVudHJ5O1xuICAgIGlmIChlbnQpIHtcbiAgICAgICAgdGhpcy5lbnRyeSA9IGVudFtORVdFUl07XG4gICAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogZW50LmtleSB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuICAgIH1cbn07XG5mdW5jdGlvbiBWYWx1ZUl0ZXJhdG9yKG9sZGVzdEVudHJ5KSB7XG4gICAgdGhpcy5lbnRyeSA9IG9sZGVzdEVudHJ5O1xufVxuVmFsdWVJdGVyYXRvci5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbn07XG5WYWx1ZUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbnQgPSB0aGlzLmVudHJ5O1xuICAgIGlmIChlbnQpIHtcbiAgICAgICAgdGhpcy5lbnRyeSA9IGVudFtORVdFUl07XG4gICAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogZW50LnZhbHVlIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG4gICAgfVxufTtcbkxSVU1hcC5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IEtleUl0ZXJhdG9yKHRoaXMub2xkZXN0KTtcbn07XG5MUlVNYXAucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFZhbHVlSXRlcmF0b3IodGhpcy5vbGRlc3QpO1xufTtcbkxSVU1hcC5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbn07XG5MUlVNYXAucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBFbnRyeUl0ZXJhdG9yKHRoaXMub2xkZXN0KTtcbn07XG5MUlVNYXAucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoZnVuLCB0aGlzT2JqKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzT2JqICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzT2JqID0gdGhpcztcbiAgICB9XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5vbGRlc3Q7XG4gICAgd2hpbGUgKGVudHJ5KSB7XG4gICAgICAgIGZ1bi5jYWxsKHRoaXNPYmosIGVudHJ5LnZhbHVlLCBlbnRyeS5rZXksIHRoaXMpO1xuICAgICAgICBlbnRyeSA9IGVudHJ5W05FV0VSXTtcbiAgICB9XG59O1xuTFJVTWFwLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHMgPSBuZXcgQXJyYXkodGhpcy5zaXplKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5vbGRlc3Q7XG4gICAgd2hpbGUgKGVudHJ5KSB7XG4gICAgICAgIHNbaSsrXSA9IHsga2V5OiBlbnRyeS5rZXksIHZhbHVlOiBlbnRyeS52YWx1ZSB9O1xuICAgICAgICBlbnRyeSA9IGVudHJ5W05FV0VSXTtcbiAgICB9XG4gICAgcmV0dXJuIHM7XG59O1xuTFJVTWFwLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcyA9ICcnO1xuICAgIHZhciBlbnRyeSA9IHRoaXMub2xkZXN0O1xuICAgIHdoaWxlIChlbnRyeSkge1xuICAgICAgICBzICs9IFN0cmluZyhlbnRyeS5rZXkpICsgJzonICsgZW50cnkudmFsdWU7XG4gICAgICAgIGVudHJ5ID0gZW50cnlbTkVXRVJdO1xuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgIHMgKz0gJyA8ICc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHM7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLk1hdGNoZXIgPSB2b2lkIDA7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBpc1ZhbGlkID0gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsICE9PSB1bmRlZmluZWQgJiYgdmFsICE9PSBudWxsICYmIHZhbCAhPT0gJyc7IH07XG52YXIgTWF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTWF0Y2hlcih0cmVlLCByZWNvcmQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5tYXRjaE5leHQgPSBmdW5jdGlvbiAobm9kZSwgcGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuYWZ0ZXJcbiAgICAgICAgICAgICAgICA/IF90aGlzLm1hdGNoQXRvbShwYXRoLCBub2RlLmFmdGVyKVxuICAgICAgICAgICAgICAgIDogaXNWYWxpZChwYXRoW190aGlzLnBvc10pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRyZWUgPSB0cmVlO1xuICAgICAgICB0aGlzLnBvcyA9IDA7XG4gICAgICAgIHRoaXMuZXhjbHVkaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVjb3JkID0gcmVjb3JkO1xuICAgICAgICB0aGlzLnN0YWNrID0gW107XG4gICAgfVxuICAgIE1hdGNoZXIucHJvdG90eXBlLmN1cnJlbnRFbGVtZW50ID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyhwYXRoW3RoaXMucG9zXSB8fCAnJykucmVwbGFjZSgvXFxzKi9nLCAnJyk7XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5yZWNvcmRNYXRjaCA9IGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1hdGNoKCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnJlY29yZCAmJiBfdGhpcy5yZWNvcmQuc2NvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZWNvcmQuc2NvcmUrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hJZGVudGlmaWVyID0gZnVuY3Rpb24gKHBhdGgsIG5vZGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy50YWlsID0gbm9kZTtcbiAgICAgICAgaWYgKGlzVmFsaWQocGF0aFt0aGlzLnBvcyArIDFdKSAmJiAhbm9kZS5hZnRlcikge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuc3RhY2subGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnN0YWNrW2ldLmFmdGVyIHx8ICF0aGlzLnN0YWNrW2ldLmZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBjdXJyZW50O1xuICAgICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5tYXRjaE5leHQobm9kZSwgcGF0aCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlc18xLmlzRXhwYW5kT3BlcmF0b3Iobm9kZS5hZnRlcikpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLnJlY29yZE1hdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS52YWx1ZSA9PT0gU3RyaW5nKHBhdGhbX3RoaXMucG9zXSkuc3Vic3RyaW5nKDAsIG5vZGUudmFsdWUubGVuZ3RoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudCA9IHRoaXMucmVjb3JkTWF0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1dGlsc18xLmlzRXF1YWwoU3RyaW5nKG5vZGUudmFsdWUpLCBTdHJpbmcocGF0aFtfdGhpcy5wb3NdKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5leGNsdWRpbmcpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmFmdGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucG9zIDwgcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQoKSAmJiBuZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5hZnRlciAmJiB0eXBlc18xLmlzV2lsZGNhcmRPcGVyYXRvcihub2RlLmFmdGVyLmFmdGVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBvcyA+PSBwYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VycmVudCgpICYmIG5leHQoKTtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoSWdub3JlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIChwYXRoLCBub2RlKSB7XG4gICAgICAgIHJldHVybiAodXRpbHNfMS5pc0VxdWFsKG5vZGUudmFsdWUsIHRoaXMuY3VycmVudEVsZW1lbnQocGF0aCkpICYmXG4gICAgICAgICAgICB0aGlzLm1hdGNoTmV4dChub2RlLCBwYXRoKSk7XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaERlc3RydWN0b3JFeHByZXNzaW9uID0gZnVuY3Rpb24gKHBhdGgsIG5vZGUpIHtcbiAgICAgICAgcmV0dXJuICh1dGlsc18xLmlzRXF1YWwobm9kZS5zb3VyY2UsIHRoaXMuY3VycmVudEVsZW1lbnQocGF0aCkpICYmXG4gICAgICAgICAgICB0aGlzLm1hdGNoTmV4dChub2RlLCBwYXRoKSk7XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaEV4cGFuZE9wZXJhdG9yID0gZnVuY3Rpb24gKHBhdGgsIG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hBdG9tKHBhdGgsIG5vZGUuYWZ0ZXIpO1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hXaWxkY2FyZE9wZXJhdG9yID0gZnVuY3Rpb24gKHBhdGgsIG5vZGUpIHtcbiAgICAgICAgdGhpcy50YWlsID0gbm9kZTtcbiAgICAgICAgdGhpcy5zdGFjay5wdXNoKG5vZGUpO1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICBpZiAobm9kZS5maWx0ZXIpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmFmdGVyKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlZCA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hBdG9tKHBhdGgsIG5vZGUuZmlsdGVyKSAmJiB0aGlzLm1hdGNoQXRvbShwYXRoLCBub2RlLmFmdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hdGNoZWQgPSB0aGlzLm1hdGNoQXRvbShwYXRoLCBub2RlLmZpbHRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtYXRjaGVkID0gdGhpcy5tYXRjaE5leHQobm9kZSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGFjay5wb3AoKTtcbiAgICAgICAgcmV0dXJuIG1hdGNoZWQ7XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaEdyb3VwRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIChwYXRoLCBub2RlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5wb3M7XG4gICAgICAgIHRoaXMuZXhjbHVkaW5nID0gISFub2RlLmlzRXhjbHVkZTtcbiAgICAgICAgdmFyIG1ldGhvZCA9IHRoaXMuZXhjbHVkaW5nID8gJ2V2ZXJ5JyA6ICdzb21lJztcbiAgICAgICAgdmFyIHJlc3VsdCA9IHV0aWxzXzEudG9BcnJheShub2RlLnZhbHVlKVttZXRob2RdKGZ1bmN0aW9uIChfbm9kZSkge1xuICAgICAgICAgICAgX3RoaXMucG9zID0gY3VycmVudDtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5leGNsdWRpbmdcbiAgICAgICAgICAgICAgICA/ICFfdGhpcy5tYXRjaEF0b20ocGF0aCwgX25vZGUpXG4gICAgICAgICAgICAgICAgOiBfdGhpcy5tYXRjaEF0b20ocGF0aCwgX25vZGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5leGNsdWRpbmcgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoUmFuZ2VFeHByZXNzaW9uID0gZnVuY3Rpb24gKHBhdGgsIG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuc3RhcnQpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmVuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAocGF0aFt0aGlzLnBvc10gPj0gcGFyc2VJbnQobm9kZS5zdGFydC52YWx1ZSkgJiZcbiAgICAgICAgICAgICAgICAgICAgcGF0aFt0aGlzLnBvc10gPD0gcGFyc2VJbnQobm9kZS5lbmQudmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoW3RoaXMucG9zXSA+PSBwYXJzZUludChub2RlLnN0YXJ0LnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChub2RlLmVuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoW3RoaXMucG9zXSA8PSBwYXJzZUludChub2RlLmVuZC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hEb3RPcGVyYXRvciA9IGZ1bmN0aW9uIChwYXRoLCBub2RlKSB7XG4gICAgICAgIHRoaXMucG9zKys7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdGNoTmV4dChub2RlLCBwYXRoKTtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoQXRvbSA9IGZ1bmN0aW9uIChwYXRoLCBub2RlKSB7XG4gICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkKHBhdGhbdGhpcy5wb3MgKyAxXSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMucG9zID09IHBhdGgubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZXNfMS5pc0lkZW50aWZpZXIobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoSWRlbnRpZmllcihwYXRoLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlc18xLmlzSWdub3JlRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hJZ25vcmVFeHByZXNzaW9uKHBhdGgsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVzXzEuaXNEZXN0cnVjdG9yRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hEZXN0cnVjdG9yRXhwcmVzc2lvbihwYXRoLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlc18xLmlzRXhwYW5kT3BlcmF0b3Iobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoRXhwYW5kT3BlcmF0b3IocGF0aCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZXNfMS5pc1dpbGRjYXJkT3BlcmF0b3Iobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoV2lsZGNhcmRPcGVyYXRvcihwYXRoLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlc18xLmlzR3JvdXBFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEdyb3VwRXhwcmVzc2lvbihwYXRoLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlc18xLmlzUmFuZ2VFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaFJhbmdlRXhwcmVzc2lvbihwYXRoLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlc18xLmlzRG90T3BlcmF0b3Iobm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoRG90T3BlcmF0b3IocGF0aCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgIHZhciBtYXRjaGVkID0gdGhpcy5tYXRjaEF0b20ocGF0aCwgdGhpcy50cmVlKTtcbiAgICAgICAgaWYgKCF0aGlzLnRhaWwpXG4gICAgICAgICAgICByZXR1cm4geyBtYXRjaGVkOiBmYWxzZSB9O1xuICAgICAgICBpZiAodGhpcy50YWlsID09IHRoaXMudHJlZSAmJiB0eXBlc18xLmlzV2lsZGNhcmRPcGVyYXRvcih0aGlzLnRhaWwpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBtYXRjaGVkOiB0cnVlIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgbWF0Y2hlZDogbWF0Y2hlZCwgcmVjb3JkOiB0aGlzLnJlY29yZCB9O1xuICAgIH07XG4gICAgTWF0Y2hlci5tYXRjaFNlZ21lbnRzID0gZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0LCByZWNvcmQpIHtcbiAgICAgICAgdmFyIHBvcyA9IDA7XG4gICAgICAgIGlmIChzb3VyY2UubGVuZ3RoICE9PSB0YXJnZXQubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YXIgbWF0Y2ggPSBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzID0gdXRpbHNfMS5pc0VxdWFsKHNvdXJjZVtwb3NdLCB0YXJnZXRbcG9zXSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlY29yZCAmJiByZWNvcmQuc2NvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZWNvcmQuc2NvcmUrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIChwb3MgPCBzb3VyY2UubGVuZ3RoIC0gMSA/IG1hdGNoKHBvcyArIDEpIDogdHJ1ZSk7IH07XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudCgpICYmIG5leHQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHsgbWF0Y2hlZDogbWF0Y2gocG9zKSwgcmVjb3JkOiByZWNvcmQgfTtcbiAgICB9O1xuICAgIHJldHVybiBNYXRjaGVyO1xufSgpKTtcbmV4cG9ydHMuTWF0Y2hlciA9IE1hdGNoZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufVxudmFyIF9fc3ByZWFkQXJyYXlzID0gKHRoaXMgJiYgdGhpcy5fX3NwcmVhZEFycmF5cykgfHwgZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcbiAgICByZXR1cm4gcjtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBhdGggPSB2b2lkIDA7XG52YXIgcGFyc2VyXzEgPSByZXF1aXJlKFwiLi9wYXJzZXJcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIGRlc3RydWN0b3JfMSA9IHJlcXVpcmUoXCIuL2Rlc3RydWN0b3JcIik7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdHlwZXNcIiksIGV4cG9ydHMpO1xudmFyIGxydV8xID0gcmVxdWlyZShcIi4vbHJ1XCIpO1xudmFyIG1hdGNoZXJfMSA9IHJlcXVpcmUoXCIuL21hdGNoZXJcIik7XG52YXIgcGF0aENhY2hlID0gbmV3IGxydV8xLkxSVU1hcCgxMDAwKTtcbnZhciBpc01hdGNoZXIgPSBTeW1ib2woJ1BBVEhfTUFUQ0hFUicpO1xudmFyIGlzVmFsaWQgPSBmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCAmJiB2YWwgIT09IG51bGw7IH07XG52YXIgYXJyYXlFeGlzdCA9IGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gTnVtYmVyKGtleSk7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiBvYmoubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xudmFyIGdldEluID0gZnVuY3Rpb24gKHNlZ21lbnRzLCBzb3VyY2UpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHNlZ21lbnRzW2ldO1xuICAgICAgICB2YXIgcnVsZXMgPSBkZXN0cnVjdG9yXzEuZ2V0RGVzdHJ1Y3RvcihpbmRleCk7XG4gICAgICAgIGlmICghcnVsZXMpIHtcbiAgICAgICAgICAgIGlmICghaXNWYWxpZChzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgIT09IHNlZ21lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXJyYXlFeGlzdChzb3VyY2UsIGluZGV4KSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZVtpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzb3VyY2UgPSBkZXN0cnVjdG9yXzEuZ2V0SW5CeURlc3RydWN0b3Ioc291cmNlLCBydWxlcywgeyBzZXRJbjogc2V0SW4sIGdldEluOiBnZXRJbiB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2U7XG59O1xudmFyIHNldEluID0gZnVuY3Rpb24gKHNlZ21lbnRzLCBzb3VyY2UsIHZhbHVlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaW5kZXggPSBzZWdtZW50c1tpXTtcbiAgICAgICAgdmFyIHJ1bGVzID0gZGVzdHJ1Y3Rvcl8xLmdldERlc3RydWN0b3IoaW5kZXgpO1xuICAgICAgICBpZiAoIXJ1bGVzKSB7XG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQoc291cmNlKSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQoc291cmNlW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQoc291cmNlW2luZGV4XSkgJiYgIWlzVmFsaWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHV0aWxzXzEuaXNOdW0oc2VnbWVudHNbaSArIDFdKSkge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VbaW5kZXhdID0gW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VbaW5kZXhdID0ge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGkgPT09IHNlZ21lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXJyYXlFeGlzdChzb3VyY2UsIGluZGV4KSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZVtpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZXN0cnVjdG9yXzEuc2V0SW5CeURlc3RydWN0b3Ioc291cmNlLCBydWxlcywgdmFsdWUsIHsgc2V0SW46IHNldEluLCBnZXRJbjogZ2V0SW4gfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgZGVsZXRlSW4gPSBmdW5jdGlvbiAoc2VnbWVudHMsIHNvdXJjZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGluZGV4ID0gc2VnbWVudHNbaV07XG4gICAgICAgIHZhciBydWxlcyA9IGRlc3RydWN0b3JfMS5nZXREZXN0cnVjdG9yKGluZGV4KTtcbiAgICAgICAgaWYgKCFydWxlcykge1xuICAgICAgICAgICAgaWYgKGkgPT09IHNlZ21lbnRzLmxlbmd0aCAtIDEgJiYgaXNWYWxpZChzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHV0aWxzXzEuaXNBcnIoc291cmNlKSkge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2Uuc3BsaWNlKE51bWJlcihpbmRleCksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNvdXJjZVtpbmRleF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNWYWxpZChzb3VyY2UpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmIChhcnJheUV4aXN0KHNvdXJjZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdXRpbHNfMS5pc09iaihzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVzdHJ1Y3Rvcl8xLmRlbGV0ZUluQnlEZXN0cnVjdG9yKHNvdXJjZSwgcnVsZXMsIHtcbiAgICAgICAgICAgICAgICBzZXRJbjogc2V0SW4sXG4gICAgICAgICAgICAgICAgZ2V0SW46IGdldEluLFxuICAgICAgICAgICAgICAgIGRlbGV0ZUluOiBkZWxldGVJbixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIGV4aXN0SW4gPSBmdW5jdGlvbiAoc2VnbWVudHMsIHNvdXJjZSwgc3RhcnQpIHtcbiAgICBpZiAoc3RhcnQgaW5zdGFuY2VvZiBQYXRoKSB7XG4gICAgICAgIHN0YXJ0ID0gc3RhcnQubGVuZ3RoO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaW5kZXggPSBzZWdtZW50c1tpXTtcbiAgICAgICAgdmFyIHJ1bGVzID0gZGVzdHJ1Y3Rvcl8xLmdldERlc3RydWN0b3IoaW5kZXgpO1xuICAgICAgICBpZiAoIXJ1bGVzKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gc2VnbWVudHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2UgJiYgaW5kZXggaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQoc291cmNlKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoYXJyYXlFeGlzdChzb3VyY2UsIGluZGV4KSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZVtpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXV0aWxzXzEuaXNPYmooc291cmNlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkZXN0cnVjdG9yXzEuZXhpc3RJbkJ5RGVzdHJ1Y3Rvcihzb3VyY2UsIHJ1bGVzLCBzdGFydCwge1xuICAgICAgICAgICAgICAgIHNldEluOiBzZXRJbixcbiAgICAgICAgICAgICAgICBnZXRJbjogZ2V0SW4sXG4gICAgICAgICAgICAgICAgZGVsZXRlSW46IGRlbGV0ZUluLFxuICAgICAgICAgICAgICAgIGV4aXN0SW46IGV4aXN0SW4sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgUGF0aCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGF0aChpbnB1dCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbmNhdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGFyZ3NbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgY29uY2F0XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBhdGggPSBuZXcgUGF0aCgnJyk7XG4gICAgICAgICAgICBwYXRoLnNlZ21lbnRzID0gKF9hID0gX3RoaXMuc2VnbWVudHMpLmNvbmNhdC5hcHBseShfYSwgYXJncy5tYXAoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIF90aGlzLnBhcnNlU3RyaW5nKHMpOyB9KSk7XG4gICAgICAgICAgICBwYXRoLmVudGlyZSA9IHBhdGguc2VnbWVudHMuam9pbignLicpO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSBzbGljZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwYXRoID0gbmV3IFBhdGgoJycpO1xuICAgICAgICAgICAgcGF0aC5zZWdtZW50cyA9IF90aGlzLnNlZ21lbnRzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgICAgICAgICAgcGF0aC5lbnRpcmUgPSBwYXRoLnNlZ21lbnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnB1c2ggPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSBwdXNoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuc2VnbWVudHMucHVzaChfdGhpcy5wYXJzZVN0cmluZyhpdGVtKSk7XG4gICAgICAgICAgICBfdGhpcy5lbnRpcmUgPSBfdGhpcy5zZWdtZW50cy5qb2luKCcuJyk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSBwb3BcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5zZWdtZW50cy5wb3AoKTtcbiAgICAgICAgICAgIF90aGlzLmVudGlyZSA9IF90aGlzLnNlZ21lbnRzLmpvaW4oJy4nKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zcGxpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGRlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgaXRlbXNbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIHNwbGljZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZWxldGVDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGl0ZW1zID0gaXRlbXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBfdGhpcy5wYXJzZVN0cmluZyhpdGVtKTsgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoX2EgPSBfdGhpcy5zZWdtZW50cykuc3BsaWNlLmFwcGx5KF9hLCBfX3NwcmVhZEFycmF5cyhbc3RhcnQsIGRlbGV0ZUNvdW50XSwgaXRlbXMpKTtcbiAgICAgICAgICAgIF90aGlzLmVudGlyZSA9IF90aGlzLnNlZ21lbnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5mb3JFYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIGVhY2hcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5zZWdtZW50cy5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5tYXAgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgbWFwXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnNlZ21lbnRzLm1hcChjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVkdWNlID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBpbml0aWFsKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIHJlZHVjZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5zZWdtZW50cy5yZWR1Y2UoY2FsbGJhY2ssIGluaXRpYWwpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldE5lYXJlc3RDaGlsZFBhdGhCeSA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgIHZhciBwYXRoID0gUGF0aC5wYXJzZSh0YXJnZXQpO1xuICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoIDwgX3RoaXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5jb25jYXQocGF0aC5zZWdtZW50c1tfdGhpcy5sZW5ndGhdKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2xpY2UoMCwgX3RoaXMubGVuZ3RoIC0gMSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaW5jbHVkZXMgPSBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgICAgICAgdmFyIF9hID0gUGF0aC5nZXRQYXRoKHBhdHRlcm4pLCBlbnRpcmUgPSBfYS5lbnRpcmUsIHNlZ21lbnRzID0gX2Euc2VnbWVudHMsIGlzTWF0Y2hQYXR0ZXJuID0gX2EuaXNNYXRjaFBhdHRlcm47XG4gICAgICAgICAgICB2YXIgY2FjaGUgPSBfdGhpcy5pbmNsdWRlc0NhY2hlLmdldChlbnRpcmUpO1xuICAgICAgICAgICAgaWYgKGNhY2hlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlO1xuICAgICAgICAgICAgdmFyIGNhY2hlV2l0aCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLmluY2x1ZGVzQ2FjaGUuc2V0KGVudGlyZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZVdpdGgoX3RoaXMubWF0Y2goc2VnbWVudHMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgdXNlZCB0byBtYXRjaCBcIiArIGVudGlyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSB1c2VkIHRvIG1hdGNoIFwiICsgZW50aXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPiBfdGhpcy5zZWdtZW50cy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlV2l0aChmYWxzZSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1dGlsc18xLmlzRXF1YWwoU3RyaW5nKHNlZ21lbnRzW2ldKSwgU3RyaW5nKF90aGlzLnNlZ21lbnRzW2ldKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlV2l0aChmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlV2l0aCh0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSBmdW5jdGlvbiAocmVnZXhwLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKCF1dGlsc18xLmlzRm4oY2FsbGJhY2spKVxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgdHJhbnNmb3JtZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXJncyA9IF90aGlzLnNlZ21lbnRzLnJlZHVjZShmdW5jdGlvbiAoYnVmLCBrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdleHApLnRlc3Qoa2V5KSA/IGJ1Zi5jb25jYXQoa2V5KSA6IGJ1ZjtcbiAgICAgICAgICAgIH0sIFtdKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh2b2lkIDAsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1hdGNoID0gZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICAgICAgICAgIHZhciBwYXRoID0gUGF0aC5nZXRQYXRoKHBhdHRlcm4pO1xuICAgICAgICAgICAgdmFyIGNhY2hlID0gX3RoaXMubWF0Y2hDYWNoZS5nZXQocGF0aC5lbnRpcmUpO1xuICAgICAgICAgICAgaWYgKGNhY2hlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FjaGUucmVjb3JkICYmIGNhY2hlLnJlY29yZC5zY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1hdGNoU2NvcmUgPSBjYWNoZS5yZWNvcmQuc2NvcmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZS5tYXRjaGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNhY2hlV2l0aCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLm1hdGNoQ2FjaGUuc2V0KHBhdGguZW50aXJlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChwYXRoLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwYXRoLmVudGlyZSArIFwiIGNhbm5vdCBtYXRjaCBcIiArIF90aGlzLmVudGlyZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tYXRjaFNjb3JlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlV2l0aChwYXRoLm1hdGNoKF90aGlzLnNlZ21lbnRzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWNvcmQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZTogMCxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNhY2hlV2l0aChuZXcgbWF0Y2hlcl8xLk1hdGNoZXIoX3RoaXMudHJlZSwgcmVjb3JkKS5tYXRjaChwYXRoLnNlZ21lbnRzKSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1hdGNoU2NvcmUgPSByZWNvcmQuc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQubWF0Y2hlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWNvcmQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZTogMCxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNhY2hlV2l0aChtYXRjaGVyXzEuTWF0Y2hlci5tYXRjaFNlZ21lbnRzKF90aGlzLnNlZ21lbnRzLCBwYXRoLnNlZ21lbnRzLCByZWNvcmQpKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubWF0Y2hTY29yZSA9IHJlY29yZC5zY29yZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5tYXRjaGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5tYXRjaEFsaWFzR3JvdXAgPSBmdW5jdGlvbiAobmFtZSwgYWxpYXMpIHtcbiAgICAgICAgICAgIHZhciBuYW1lUGF0aCA9IFBhdGgucGFyc2UobmFtZSk7XG4gICAgICAgICAgICB2YXIgYWxpYXNQYXRoID0gUGF0aC5wYXJzZShhbGlhcyk7XG4gICAgICAgICAgICB2YXIgbmFtZU1hdGNoZWQgPSBfdGhpcy5tYXRjaChuYW1lUGF0aCk7XG4gICAgICAgICAgICB2YXIgbmFtZU1hdGNoZWRTY29yZSA9IF90aGlzLm1hdGNoU2NvcmU7XG4gICAgICAgICAgICB2YXIgYWxpYXNNYXRjaGVkID0gX3RoaXMubWF0Y2goYWxpYXNQYXRoKTtcbiAgICAgICAgICAgIHZhciBhbGlhc01hdGNoZWRTY29yZSA9IF90aGlzLm1hdGNoU2NvcmU7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaGF2ZUV4Y2x1ZGVQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWVNYXRjaGVkU2NvcmUgPj0gYWxpYXNNYXRjaGVkU2NvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVNYXRjaGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsaWFzTWF0Y2hlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmFtZU1hdGNoZWQgfHwgYWxpYXNNYXRjaGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmV4aXN0SW4gPSBmdW5jdGlvbiAoc291cmNlLCBzdGFydCkge1xuICAgICAgICAgICAgaWYgKHN0YXJ0ID09PSB2b2lkIDApIHsgc3RhcnQgPSAwOyB9XG4gICAgICAgICAgICByZXR1cm4gZXhpc3RJbihfdGhpcy5zZWdtZW50cywgc291cmNlLCBzdGFydCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0SW4gPSBmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0SW4oX3RoaXMuc2VnbWVudHMsIHNvdXJjZSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0SW4gPSBmdW5jdGlvbiAoc291cmNlLCB2YWx1ZSkge1xuICAgICAgICAgICAgc2V0SW4oX3RoaXMuc2VnbWVudHMsIHNvdXJjZSwgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kZWxldGVJbiA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZUluKF90aGlzLnNlZ21lbnRzLCBzb3VyY2UpO1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5wYXJzZShpbnB1dCksIHRyZWUgPSBfYS50cmVlLCBzZWdtZW50cyA9IF9hLnNlZ21lbnRzLCBlbnRpcmUgPSBfYS5lbnRpcmUsIGlzTWF0Y2hQYXR0ZXJuID0gX2EuaXNNYXRjaFBhdHRlcm4sIGlzV2lsZE1hdGNoUGF0dGVybiA9IF9hLmlzV2lsZE1hdGNoUGF0dGVybiwgaGF2ZUV4Y2x1ZGVQYXR0ZXJuID0gX2EuaGF2ZUV4Y2x1ZGVQYXR0ZXJuO1xuICAgICAgICB0aGlzLmVudGlyZSA9IGVudGlyZTtcbiAgICAgICAgdGhpcy5zZWdtZW50cyA9IHNlZ21lbnRzO1xuICAgICAgICB0aGlzLmlzTWF0Y2hQYXR0ZXJuID0gaXNNYXRjaFBhdHRlcm47XG4gICAgICAgIHRoaXMuaXNXaWxkTWF0Y2hQYXR0ZXJuID0gaXNXaWxkTWF0Y2hQYXR0ZXJuO1xuICAgICAgICB0aGlzLmhhdmVFeGNsdWRlUGF0dGVybiA9IGhhdmVFeGNsdWRlUGF0dGVybjtcbiAgICAgICAgdGhpcy50cmVlID0gdHJlZTtcbiAgICAgICAgdGhpcy5tYXRjaENhY2hlID0gbmV3IGxydV8xLkxSVU1hcCgyMDApO1xuICAgICAgICB0aGlzLmluY2x1ZGVzQ2FjaGUgPSBuZXcgbHJ1XzEuTFJVTWFwKDIwMCk7XG4gICAgfVxuICAgIFBhdGgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpcmU7XG4gICAgfTtcbiAgICBQYXRoLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZWdtZW50cztcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQYXRoLnByb3RvdHlwZSwgXCJsZW5ndGhcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlZ21lbnRzLmxlbmd0aDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFBhdGgucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHBhdHRlcm4gaW5zdGFuY2VvZiBQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVudGlyZTogcGF0dGVybi5lbnRpcmUsXG4gICAgICAgICAgICAgICAgc2VnbWVudHM6IHBhdHRlcm4uc2VnbWVudHMuc2xpY2UoKSxcbiAgICAgICAgICAgICAgICBpc1dpbGRNYXRjaFBhdHRlcm46IHBhdHRlcm4uaXNXaWxkTWF0Y2hQYXR0ZXJuLFxuICAgICAgICAgICAgICAgIGlzTWF0Y2hQYXR0ZXJuOiBwYXR0ZXJuLmlzTWF0Y2hQYXR0ZXJuLFxuICAgICAgICAgICAgICAgIGhhdmVFeGNsdWRlUGF0dGVybjogcGF0dGVybi5oYXZlRXhjbHVkZVBhdHRlcm4sXG4gICAgICAgICAgICAgICAgdHJlZTogcGF0dGVybi50cmVlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1dGlsc18xLmlzU3RyKHBhdHRlcm4pKSB7XG4gICAgICAgICAgICBpZiAoIXBhdHRlcm4pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXJlOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBpc1dpbGRNYXRjaFBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBoYXZlRXhjbHVkZVBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpc01hdGNoUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgcGFyc2VyXzEuUGFyc2VyKHBhdHRlcm4pO1xuICAgICAgICAgICAgdmFyIHRyZWUgPSBwYXJzZXIucGFyc2UoKTtcbiAgICAgICAgICAgIGlmICghcGFyc2VyLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlZ21lbnRzID0gcGFyc2VyLmRhdGEuc2VnbWVudHM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXJlOiBzZWdtZW50cy5qb2luKCcuJyksXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBzZWdtZW50cyxcbiAgICAgICAgICAgICAgICAgICAgdHJlZTogdHJlZSxcbiAgICAgICAgICAgICAgICAgICAgaXNXaWxkTWF0Y2hQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaGF2ZUV4Y2x1ZGVQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaXNNYXRjaFBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBlbnRpcmU6IHBhdHRlcm4sXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgaXNXaWxkTWF0Y2hQYXR0ZXJuOiBwYXJzZXIuaXNXaWxkTWF0Y2hQYXR0ZXJuLFxuICAgICAgICAgICAgICAgICAgICBoYXZlRXhjbHVkZVBhdHRlcm46IHBhcnNlci5oYXZlRXhjbHVkZVBhdHRlcm4sXG4gICAgICAgICAgICAgICAgICAgIGlzTWF0Y2hQYXR0ZXJuOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB0cmVlOiB0cmVlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbHNfMS5pc0ZuKHBhdHRlcm4pICYmIHBhdHRlcm5baXNNYXRjaGVyXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2UocGF0dGVyblsncGF0aCddKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1dGlsc18xLmlzQXJyKHBhdHRlcm4pKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVudGlyZTogcGF0dGVybi5qb2luKCcuJyksXG4gICAgICAgICAgICAgICAgc2VnbWVudHM6IHBhdHRlcm4ucmVkdWNlKGZ1bmN0aW9uIChidWYsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmLmNvbmNhdChfdGhpcy5wYXJzZVN0cmluZyhrZXkpKTtcbiAgICAgICAgICAgICAgICB9LCBbXSksXG4gICAgICAgICAgICAgICAgaXNXaWxkTWF0Y2hQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBoYXZlRXhjbHVkZVBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzTWF0Y2hQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVudGlyZTogJycsXG4gICAgICAgICAgICAgICAgc2VnbWVudHM6IHBhdHRlcm4gIT09IHVuZGVmaW5lZCA/IFtwYXR0ZXJuXSA6IFtdLFxuICAgICAgICAgICAgICAgIGlzV2lsZE1hdGNoUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgaGF2ZUV4Y2x1ZGVQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc01hdGNoUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXRoLnByb3RvdHlwZS5wYXJzZVN0cmluZyA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgaWYgKHV0aWxzXzEuaXNTdHIoc291cmNlKSkge1xuICAgICAgICAgICAgc291cmNlID0gc291cmNlLnJlcGxhY2UoL1xccyovZywgJycpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgX2EgPSB0aGlzLnBhcnNlKHNvdXJjZSksIHNlZ21lbnRzID0gX2Euc2VnbWVudHMsIGlzTWF0Y2hQYXR0ZXJuID0gX2EuaXNNYXRjaFBhdHRlcm47XG4gICAgICAgICAgICAgICAgcmV0dXJuICFpc01hdGNoUGF0dGVybiA/IHNlZ21lbnRzIDogc291cmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2Uuc2VnbWVudHM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9O1xuICAgIFBhdGgubWF0Y2ggPSBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgICB2YXIgcGF0aCA9IFBhdGguZ2V0UGF0aChwYXR0ZXJuKTtcbiAgICAgICAgdmFyIG1hdGNoZXIgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aC5tYXRjaCh0YXJnZXQpO1xuICAgICAgICB9O1xuICAgICAgICBtYXRjaGVyW2lzTWF0Y2hlcl0gPSB0cnVlO1xuICAgICAgICBtYXRjaGVyLnBhdGggPSBwYXRoO1xuICAgICAgICByZXR1cm4gbWF0Y2hlcjtcbiAgICB9O1xuICAgIFBhdGgudHJhbnNmb3JtID0gZnVuY3Rpb24gKHBhdHRlcm4sIHJlZ2V4cCwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIFBhdGguZ2V0UGF0aChwYXR0ZXJuKS50cmFuc2Zvcm0ocmVnZXhwLCBjYWxsYmFjayk7XG4gICAgfTtcbiAgICBQYXRoLnBhcnNlID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgaWYgKHBhdGggPT09IHZvaWQgMCkgeyBwYXRoID0gJyc7IH1cbiAgICAgICAgcmV0dXJuIFBhdGguZ2V0UGF0aChwYXRoKTtcbiAgICB9O1xuICAgIFBhdGguZ2V0UGF0aCA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgIGlmIChwYXRoID09PSB2b2lkIDApIHsgcGF0aCA9ICcnOyB9XG4gICAgICAgIGlmIChwYXRoIGluc3RhbmNlb2YgUGF0aCkge1xuICAgICAgICAgICAgdmFyIGZvdW5kID0gcGF0aENhY2hlLmdldChwYXRoLmVudGlyZSk7XG4gICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXRoQ2FjaGUuc2V0KHBhdGguZW50aXJlLCBwYXRoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwYXRoICYmIHBhdGhbaXNNYXRjaGVyXSkge1xuICAgICAgICAgICAgcmV0dXJuIFBhdGguZ2V0UGF0aChwYXRoWydwYXRoJ10pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGtleSA9IHBhdGgudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IHBhdGhDYWNoZS5nZXQoa2V5KTtcbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhdGggPSBuZXcgUGF0aChwYXRoKTtcbiAgICAgICAgICAgICAgICBwYXRoQ2FjaGUuc2V0KGtleSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhdGguZ2V0SW4gPSBmdW5jdGlvbiAoc291cmNlLCBwYXR0ZXJuKSB7XG4gICAgICAgIHZhciBwYXRoID0gUGF0aC5nZXRQYXRoKHBhdHRlcm4pO1xuICAgICAgICByZXR1cm4gcGF0aC5nZXRJbihzb3VyY2UpO1xuICAgIH07XG4gICAgUGF0aC5zZXRJbiA9IGZ1bmN0aW9uIChzb3VyY2UsIHBhdHRlcm4sIHZhbHVlKSB7XG4gICAgICAgIHZhciBwYXRoID0gUGF0aC5nZXRQYXRoKHBhdHRlcm4pO1xuICAgICAgICByZXR1cm4gcGF0aC5zZXRJbihzb3VyY2UsIHZhbHVlKTtcbiAgICB9O1xuICAgIFBhdGguZGVsZXRlSW4gPSBmdW5jdGlvbiAoc291cmNlLCBwYXR0ZXJuKSB7XG4gICAgICAgIHZhciBwYXRoID0gUGF0aC5nZXRQYXRoKHBhdHRlcm4pO1xuICAgICAgICByZXR1cm4gcGF0aC5kZWxldGVJbihzb3VyY2UpO1xuICAgIH07XG4gICAgUGF0aC5leGlzdEluID0gZnVuY3Rpb24gKHNvdXJjZSwgcGF0dGVybiwgc3RhcnQpIHtcbiAgICAgICAgdmFyIHBhdGggPSBQYXRoLmdldFBhdGgocGF0dGVybik7XG4gICAgICAgIHJldHVybiBwYXRoLmV4aXN0SW4oc291cmNlLCBzdGFydCk7XG4gICAgfTtcbiAgICByZXR1cm4gUGF0aDtcbn0oKSk7XG5leHBvcnRzLlBhdGggPSBQYXRoO1xuZXhwb3J0cy5kZWZhdWx0ID0gUGF0aDtcbiIsImltcG9ydCB7IGlzRm4sIGlzU3RyIH0gZnJvbSAnLi90eXBlcydcblxuY29uc3QgY2FjaGVzID0ge31cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcHJlY2F0ZTxQMSA9IGFueSwgUDIgPSBhbnksIFAzID0gYW55LCBQNCA9IGFueSwgUDUgPSBhbnk+KFxuICBtZXRob2Q6IGFueSxcbiAgbWVzc2FnZT86IHN0cmluZyxcbiAgaGVscD86IHN0cmluZ1xuKSB7XG4gIGlmIChpc0ZuKG1ldGhvZCkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHAxPzogUDEsIHAyPzogUDIsIHAzPzogUDMsIHA0PzogUDQsIHA1PzogUDUpIHtcbiAgICAgIGRlcHJlY2F0ZShtZXNzYWdlLCBoZWxwKVxuICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfVxuICB9XG4gIGlmIChpc1N0cihtZXRob2QpICYmICFjYWNoZXNbbWV0aG9kXSkge1xuICAgIGNhY2hlc1ttZXRob2RdID0gdHJ1ZVxuICAgIGNvbnNvbGUud2FybihcbiAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgYCR7bWV0aG9kfSBoYXMgYmVlbiBkZXByZWNhdGVkLiBEbyBub3QgY29udGludWUgdG8gdXNlIHRoaXMgYXBpLiR7bWVzc2FnZSB8fFxuICAgICAgICAgICcnfWBcbiAgICAgIClcbiAgICApXG4gIH1cbn1cbiIsImltcG9ydCB7IGlzRm4sIFN1YnNjcmliZXIsIFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBlYWNoIH0gZnJvbSAnLi9hcnJheSdcblxuZXhwb3J0IGNsYXNzIFN1YnNjcmliYWJsZTxQYXlsb2FkID0gYW55PiB7XG4gIHN1YnNjcmliZXJzOiB7XG4gICAgaW5kZXg/OiBudW1iZXJcbiAgICBba2V5OiBudW1iZXJdOiBTdWJzY3JpYmVyPFBheWxvYWQ+XG4gIH0gPSB7XG4gICAgaW5kZXg6IDBcbiAgfVxuXG4gIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uPFBheWxvYWQ+XG5cbiAgc3Vic2NyaWJlID0gKGNhbGxiYWNrPzogU3Vic2NyaWJlcjxQYXlsb2FkPik6IG51bWJlciA9PiB7XG4gICAgaWYgKGlzRm4oY2FsbGJhY2spKSB7XG4gICAgICBjb25zdCBpbmRleDogbnVtYmVyID0gdGhpcy5zdWJzY3JpYmVycy5pbmRleCArIDFcbiAgICAgIHRoaXMuc3Vic2NyaWJlcnNbaW5kZXhdID0gY2FsbGJhY2tcbiAgICAgIHRoaXMuc3Vic2NyaWJlcnMuaW5kZXgrK1xuICAgICAgcmV0dXJuIGluZGV4XG4gICAgfVxuICB9XG5cbiAgdW5zdWJzY3JpYmUgPSAoaW5kZXg6IG51bWJlcikgPT4ge1xuICAgIGlmICh0aGlzLnN1YnNjcmliZXJzW2luZGV4XSkge1xuICAgICAgZGVsZXRlIHRoaXMuc3Vic2NyaWJlcnNbaW5kZXhdXG4gICAgfVxuICB9XG5cbiAgbm90aWZ5ID0gKHBheWxvYWQ/OiBQYXlsb2FkLCBzaWxlbnQ/OiBib29sZWFuKSA9PiB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24gJiYgaXNGbih0aGlzLnN1YnNjcmlwdGlvbi5ub3RpZnkpKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbi5ub3RpZnkuY2FsbCh0aGlzLCBwYXlsb2FkKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2lsZW50KSByZXR1cm5cbiAgICBjb25zdCBmaWx0ZXIgPSAocGF5bG9hZDogUGF5bG9hZCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uICYmIGlzRm4odGhpcy5zdWJzY3JpcHRpb24uZmlsdGVyKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb24uZmlsdGVyLmNhbGwodGhpcywgcGF5bG9hZClcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXlsb2FkXG4gICAgfVxuICAgIGVhY2godGhpcy5zdWJzY3JpYmVycywgKGNhbGxiYWNrOiBhbnkpID0+IHtcbiAgICAgIGlmIChpc0ZuKGNhbGxiYWNrKSkgY2FsbGJhY2soZmlsdGVyKHBheWxvYWQpKVxuICAgIH0pXG4gIH1cbn1cbiIsImltcG9ydCB7IEJpZ0RhdGEgfSBmcm9tICcuL2JpZy1kYXRhJ1xuaW1wb3J0IHsgaXNWYWxpZCB9IGZyb20gJy4vaXNFbXB0eSdcblxuZnVuY3Rpb24gZGVmYXVsdElzTWVyZ2VhYmxlT2JqZWN0KHZhbHVlOiBhbnkpIHtcbiAgcmV0dXJuIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSkgJiYgIWlzU3BlY2lhbCh2YWx1ZSlcbn1cblxuZnVuY3Rpb24gaXNOb25OdWxsT2JqZWN0KHZhbHVlOiBhbnkpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0J1xufVxuXG5mdW5jdGlvbiBpc1NwZWNpYWwodmFsdWU6IGFueSkge1xuICBjb25zdCBzdHJpbmdWYWx1ZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSlcblxuICByZXR1cm4gKFxuICAgIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBSZWdFeHBdJyB8fFxuICAgIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBEYXRlXScgfHxcbiAgICBpc1JlYWN0RWxlbWVudCh2YWx1ZSlcbiAgKVxufVxuXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2Jsb2IvYjVhYzk2M2ZiNzkxZDEyOThlN2YzOTYyMzYzODNiYzk1NWY5MTZjMS9zcmMvaXNvbW9ycGhpYy9jbGFzc2ljL2VsZW1lbnQvUmVhY3RFbGVtZW50LmpzI0wyMS1MMjVcbmNvbnN0IGNhblVzZVN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvclxuY29uc3QgUkVBQ1RfRUxFTUVOVF9UWVBFID0gY2FuVXNlU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3XG5cbmZ1bmN0aW9uIGlzUmVhY3RFbGVtZW50KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFXG59XG5cbmZ1bmN0aW9uIGVtcHR5VGFyZ2V0KHZhbDogYW55KSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHZhbHVlOiBhbnksIG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuY2xvbmUgIT09IGZhbHNlICYmIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodmFsdWUpKSB7XG4gICAgaWYgKEJpZ0RhdGEuaXNCaWdEYXRhKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIEJpZ0RhdGEuY2xvbmUodmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkZWVwbWVyZ2UoZW1wdHlUYXJnZXQodmFsdWUpLCB2YWx1ZSwgb3B0aW9ucylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBcnJheU1lcmdlKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSwgb3B0aW9uczogT3B0aW9ucykge1xuICByZXR1cm4gdGFyZ2V0LmNvbmNhdChzb3VyY2UpLm1hcChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgcmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKGVsZW1lbnQsIG9wdGlvbnMpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGdldE1lcmdlRnVuY3Rpb24oa2V5OiBzdHJpbmcsIG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zLmN1c3RvbU1lcmdlKSB7XG4gICAgcmV0dXJuIGRlZXBtZXJnZVxuICB9XG4gIGNvbnN0IGN1c3RvbU1lcmdlID0gb3B0aW9ucy5jdXN0b21NZXJnZShrZXkpXG4gIHJldHVybiB0eXBlb2YgY3VzdG9tTWVyZ2UgPT09ICdmdW5jdGlvbicgPyBjdXN0b21NZXJnZSA6IGRlZXBtZXJnZVxufVxuXG5mdW5jdGlvbiBnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldDogYW55KTogYW55IHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbiAgICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KS5maWx0ZXIoZnVuY3Rpb24oc3ltYm9sKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQucHJvcGVydHlJc0VudW1lcmFibGUoc3ltYm9sKVxuICAgICAgfSlcbiAgICA6IFtdXG59XG5cbmZ1bmN0aW9uIGdldEtleXModGFyZ2V0OiBhbnkpIHtcbiAgaWYgKCFpc1ZhbGlkKHRhcmdldCkpIHJldHVybiBbXVxuICByZXR1cm4gT2JqZWN0LmtleXModGFyZ2V0KS5jb25jYXQoZ2V0RW51bWVyYWJsZU93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpKVxufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUlzT25PYmplY3Qob2JqZWN0OiBhbnksIHByb3BlcnR5OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcHJvcGVydHkgaW4gb2JqZWN0XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG4vLyBQcm90ZWN0cyBmcm9tIHByb3RvdHlwZSBwb2lzb25pbmcgYW5kIHVuZXhwZWN0ZWQgbWVyZ2luZyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuZnVuY3Rpb24gcHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkge1xuICByZXR1cm4gKFxuICAgIHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgJiYgLy8gUHJvcGVydGllcyBhcmUgc2FmZSB0byBtZXJnZSBpZiB0aGV5IGRvbid0IGV4aXN0IGluIHRoZSB0YXJnZXQgeWV0LFxuICAgICEoXG4gICAgICBPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkgJiYgLy8gdW5zYWZlIGlmIHRoZXkgZXhpc3QgdXAgdGhlIHByb3RvdHlwZSBjaGFpbixcbiAgICAgIE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRhcmdldCwga2V5KVxuICAgIClcbiAgKSAvLyBhbmQgYWxzbyB1bnNhZmUgaWYgdGhleSdyZSBub25lbnVtZXJhYmxlLlxufVxuXG5mdW5jdGlvbiBtZXJnZU9iamVjdCh0YXJnZXQ6IGFueSwgc291cmNlOiBhbnksIG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgY29uc3QgZGVzdGluYXRpb24gPSBvcHRpb25zLmFzc2lnbiA/IHRhcmdldCB8fCB7fSA6IHt9XG4gIGlmICghb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh0YXJnZXQpKSByZXR1cm4gdGFyZ2V0XG4gIGlmICghb3B0aW9ucy5hc3NpZ24pIHtcbiAgICBnZXRLZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh0YXJnZXRba2V5XSwgb3B0aW9ucylcbiAgICB9KVxuICB9XG4gIGdldEtleXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChwcm9wZXJ0eUlzVW5zYWZlKHRhcmdldCwga2V5KSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICghdGFyZ2V0W2tleV0pIHtcbiAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBzb3VyY2Vba2V5XVxuICAgIH1cbiAgICBpZiAoXG4gICAgICBwcm9wZXJ0eUlzT25PYmplY3QodGFyZ2V0LCBrZXkpICYmXG4gICAgICBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHNvdXJjZVtrZXldKVxuICAgICkge1xuICAgICAgZGVzdGluYXRpb25ba2V5XSA9IGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKShcbiAgICAgICAgdGFyZ2V0W2tleV0sXG4gICAgICAgIHNvdXJjZVtrZXldLFxuICAgICAgICBvcHRpb25zXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2Vba2V5XSwgb3B0aW9ucylcbiAgICB9XG4gIH0pXG4gIHJldHVybiBkZXN0aW5hdGlvblxufVxuXG5pbnRlcmZhY2UgT3B0aW9ucyB7XG4gIGFycmF5TWVyZ2U/KHRhcmdldDogYW55W10sIHNvdXJjZTogYW55W10sIG9wdGlvbnM/OiBPcHRpb25zKTogYW55W11cbiAgY2xvbmU/OiBib29sZWFuXG4gIGFzc2lnbj86IGJvb2xlYW5cbiAgY3VzdG9tTWVyZ2U/OiAoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IE9wdGlvbnNcbiAgKSA9PiAoKHg6IGFueSwgeTogYW55KSA9PiBhbnkpIHwgdW5kZWZpbmVkXG4gIGlzTWVyZ2VhYmxlT2JqZWN0Pyh2YWx1ZTogb2JqZWN0KTogYm9vbGVhblxufVxuXG5mdW5jdGlvbiBkZWVwbWVyZ2U8VD4oeDogUGFydGlhbDxUPiwgeTogUGFydGlhbDxUPiwgb3B0aW9ucz86IE9wdGlvbnMpOiBUXG5mdW5jdGlvbiBkZWVwbWVyZ2U8VDEsIFQyPihcbiAgeDogUGFydGlhbDxUMT4sXG4gIHk6IFBhcnRpYWw8VDI+LFxuICBvcHRpb25zPzogT3B0aW9uc1xuKTogVDEgJiBUMlxuZnVuY3Rpb24gZGVlcG1lcmdlKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSwgb3B0aW9uczogYW55KSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIG9wdGlvbnMuYXJyYXlNZXJnZSA9IG9wdGlvbnMuYXJyYXlNZXJnZSB8fCBkZWZhdWx0QXJyYXlNZXJnZVxuICBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0ID1cbiAgICBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0IHx8IGRlZmF1bHRJc01lcmdlYWJsZU9iamVjdFxuICAvLyBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCBpcyBhZGRlZCB0byBgb3B0aW9uc2Agc28gdGhhdCBjdXN0b20gYXJyYXlNZXJnZSgpXG4gIC8vIGltcGxlbWVudGF0aW9ucyBjYW4gdXNlIGl0LiBUaGUgY2FsbGVyIG1heSBub3QgcmVwbGFjZSBpdC5cbiAgb3B0aW9ucy5jbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkXG5cbiAgY29uc3Qgc291cmNlSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoc291cmNlKVxuICBjb25zdCB0YXJnZXRJc0FycmF5ID0gQXJyYXkuaXNBcnJheSh0YXJnZXQpXG4gIGNvbnN0IHNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2ggPSBzb3VyY2VJc0FycmF5ID09PSB0YXJnZXRJc0FycmF5XG5cbiAgaWYgKCFzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoKSB7XG4gICAgcmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZSwgb3B0aW9ucylcbiAgfSBlbHNlIGlmIChzb3VyY2VJc0FycmF5KSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuYXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucylcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG4gIH1cbn1cbmZ1bmN0aW9uIGRlZXBtZXJnZUFsbChvYmplY3RzOiBvYmplY3RbXSwgb3B0aW9ucz86IE9wdGlvbnMpOiBvYmplY3RcbmZ1bmN0aW9uIGRlZXBtZXJnZUFsbDxUPihvYmplY3RzOiBQYXJ0aWFsPFQ+W10sIG9wdGlvbnM/OiBPcHRpb25zKTogVFxuZnVuY3Rpb24gZGVlcG1lcmdlQWxsKGFycmF5OiBhbnksIG9wdGlvbnM6IGFueSkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmaXJzdCBhcmd1bWVudCBzaG91bGQgYmUgYW4gYXJyYXknKVxuICB9XG5cbiAgcmV0dXJuIGFycmF5LnJlZHVjZShmdW5jdGlvbihwcmV2LCBuZXh0KSB7XG4gICAgcmV0dXJuIGRlZXBtZXJnZShwcmV2LCBuZXh0LCBvcHRpb25zKVxuICB9LCB7fSlcbn1cblxuZGVlcG1lcmdlLmFsbCA9IGRlZXBtZXJnZUFsbFxuXG5leHBvcnQgY29uc3QgbWVyZ2UgPSBkZWVwbWVyZ2VcbiIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MC4xOS4xXG4gKiBzY2hlZHVsZXIucHJvZHVjdGlvbi5taW4uanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIEZhY2Vib29rLCBJbmMuIGFuZCBpdHMgYWZmaWxpYXRlcy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7dmFyIGYsZyxoLGssbDtcbmlmKFwidW5kZWZpbmVkXCI9PT10eXBlb2Ygd2luZG93fHxcImZ1bmN0aW9uXCIhPT10eXBlb2YgTWVzc2FnZUNoYW5uZWwpe3ZhciBwPW51bGwscT1udWxsLHQ9ZnVuY3Rpb24oKXtpZihudWxsIT09cCl0cnl7dmFyIGE9ZXhwb3J0cy51bnN0YWJsZV9ub3coKTtwKCEwLGEpO3A9bnVsbH1jYXRjaChiKXt0aHJvdyBzZXRUaW1lb3V0KHQsMCksYjt9fSx1PURhdGUubm93KCk7ZXhwb3J0cy51bnN0YWJsZV9ub3c9ZnVuY3Rpb24oKXtyZXR1cm4gRGF0ZS5ub3coKS11fTtmPWZ1bmN0aW9uKGEpe251bGwhPT1wP3NldFRpbWVvdXQoZiwwLGEpOihwPWEsc2V0VGltZW91dCh0LDApKX07Zz1mdW5jdGlvbihhLGIpe3E9c2V0VGltZW91dChhLGIpfTtoPWZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHEpfTtrPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2w9ZXhwb3J0cy51bnN0YWJsZV9mb3JjZUZyYW1lUmF0ZT1mdW5jdGlvbigpe319ZWxzZXt2YXIgdz13aW5kb3cucGVyZm9ybWFuY2UseD13aW5kb3cuRGF0ZSxcbnk9d2luZG93LnNldFRpbWVvdXQsej13aW5kb3cuY2xlYXJUaW1lb3V0O2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7dmFyIEE9d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lO1wiZnVuY3Rpb25cIiE9PXR5cGVvZiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lJiZjb25zb2xlLmVycm9yKFwiVGhpcyBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuIE1ha2Ugc3VyZSB0aGF0IHlvdSBsb2FkIGEgcG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vZmIubWUvcmVhY3QtcG9seWZpbGxzXCIpO1wiZnVuY3Rpb25cIiE9PXR5cGVvZiBBJiZjb25zb2xlLmVycm9yKFwiVGhpcyBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBjYW5jZWxBbmltYXRpb25GcmFtZS4gTWFrZSBzdXJlIHRoYXQgeW91IGxvYWQgYSBwb2x5ZmlsbCBpbiBvbGRlciBicm93c2Vycy4gaHR0cHM6Ly9mYi5tZS9yZWFjdC1wb2x5ZmlsbHNcIil9aWYoXCJvYmplY3RcIj09PVxudHlwZW9mIHcmJlwiZnVuY3Rpb25cIj09PXR5cGVvZiB3Lm5vdylleHBvcnRzLnVuc3RhYmxlX25vdz1mdW5jdGlvbigpe3JldHVybiB3Lm5vdygpfTtlbHNle3ZhciBCPXgubm93KCk7ZXhwb3J0cy51bnN0YWJsZV9ub3c9ZnVuY3Rpb24oKXtyZXR1cm4geC5ub3coKS1CfX12YXIgQz0hMSxEPW51bGwsRT0tMSxGPTUsRz0wO2s9ZnVuY3Rpb24oKXtyZXR1cm4gZXhwb3J0cy51bnN0YWJsZV9ub3coKT49R307bD1mdW5jdGlvbigpe307ZXhwb3J0cy51bnN0YWJsZV9mb3JjZUZyYW1lUmF0ZT1mdW5jdGlvbihhKXswPmF8fDEyNTxhP2NvbnNvbGUuZXJyb3IoXCJmb3JjZUZyYW1lUmF0ZSB0YWtlcyBhIHBvc2l0aXZlIGludCBiZXR3ZWVuIDAgYW5kIDEyNSwgZm9yY2luZyBmcmFtZXJhdGVzIGhpZ2hlciB0aGFuIDEyNSBmcHMgaXMgbm90IHVuc3VwcG9ydGVkXCIpOkY9MDxhP01hdGguZmxvb3IoMUUzL2EpOjV9O3ZhciBIPW5ldyBNZXNzYWdlQ2hhbm5lbCxJPUgucG9ydDI7SC5wb3J0MS5vbm1lc3NhZ2U9XG5mdW5jdGlvbigpe2lmKG51bGwhPT1EKXt2YXIgYT1leHBvcnRzLnVuc3RhYmxlX25vdygpO0c9YStGO3RyeXtEKCEwLGEpP0kucG9zdE1lc3NhZ2UobnVsbCk6KEM9ITEsRD1udWxsKX1jYXRjaChiKXt0aHJvdyBJLnBvc3RNZXNzYWdlKG51bGwpLGI7fX1lbHNlIEM9ITF9O2Y9ZnVuY3Rpb24oYSl7RD1hO0N8fChDPSEwLEkucG9zdE1lc3NhZ2UobnVsbCkpfTtnPWZ1bmN0aW9uKGEsYil7RT15KGZ1bmN0aW9uKCl7YShleHBvcnRzLnVuc3RhYmxlX25vdygpKX0sYil9O2g9ZnVuY3Rpb24oKXt6KEUpO0U9LTF9fWZ1bmN0aW9uIEooYSxiKXt2YXIgYz1hLmxlbmd0aDthLnB1c2goYik7YTpmb3IoOzspe3ZhciBkPWMtMT4+PjEsZT1hW2RdO2lmKHZvaWQgMCE9PWUmJjA8SyhlLGIpKWFbZF09YixhW2NdPWUsYz1kO2Vsc2UgYnJlYWsgYX19ZnVuY3Rpb24gTChhKXthPWFbMF07cmV0dXJuIHZvaWQgMD09PWE/bnVsbDphfVxuZnVuY3Rpb24gTShhKXt2YXIgYj1hWzBdO2lmKHZvaWQgMCE9PWIpe3ZhciBjPWEucG9wKCk7aWYoYyE9PWIpe2FbMF09YzthOmZvcih2YXIgZD0wLGU9YS5sZW5ndGg7ZDxlOyl7dmFyIG09MiooZCsxKS0xLG49YVttXSx2PW0rMSxyPWFbdl07aWYodm9pZCAwIT09biYmMD5LKG4sYykpdm9pZCAwIT09ciYmMD5LKHIsbik/KGFbZF09cixhW3ZdPWMsZD12KTooYVtkXT1uLGFbbV09YyxkPW0pO2Vsc2UgaWYodm9pZCAwIT09ciYmMD5LKHIsYykpYVtkXT1yLGFbdl09YyxkPXY7ZWxzZSBicmVhayBhfX1yZXR1cm4gYn1yZXR1cm4gbnVsbH1mdW5jdGlvbiBLKGEsYil7dmFyIGM9YS5zb3J0SW5kZXgtYi5zb3J0SW5kZXg7cmV0dXJuIDAhPT1jP2M6YS5pZC1iLmlkfXZhciBOPVtdLE89W10sUD0xLFE9bnVsbCxSPTMsUz0hMSxUPSExLFU9ITE7XG5mdW5jdGlvbiBWKGEpe2Zvcih2YXIgYj1MKE8pO251bGwhPT1iOyl7aWYobnVsbD09PWIuY2FsbGJhY2spTShPKTtlbHNlIGlmKGIuc3RhcnRUaW1lPD1hKU0oTyksYi5zb3J0SW5kZXg9Yi5leHBpcmF0aW9uVGltZSxKKE4sYik7ZWxzZSBicmVhaztiPUwoTyl9fWZ1bmN0aW9uIFcoYSl7VT0hMTtWKGEpO2lmKCFUKWlmKG51bGwhPT1MKE4pKVQ9ITAsZihYKTtlbHNle3ZhciBiPUwoTyk7bnVsbCE9PWImJmcoVyxiLnN0YXJ0VGltZS1hKX19XG5mdW5jdGlvbiBYKGEsYil7VD0hMTtVJiYoVT0hMSxoKCkpO1M9ITA7dmFyIGM9Ujt0cnl7VihiKTtmb3IoUT1MKE4pO251bGwhPT1RJiYoIShRLmV4cGlyYXRpb25UaW1lPmIpfHxhJiYhaygpKTspe3ZhciBkPVEuY2FsbGJhY2s7aWYobnVsbCE9PWQpe1EuY2FsbGJhY2s9bnVsbDtSPVEucHJpb3JpdHlMZXZlbDt2YXIgZT1kKFEuZXhwaXJhdGlvblRpbWU8PWIpO2I9ZXhwb3J0cy51bnN0YWJsZV9ub3coKTtcImZ1bmN0aW9uXCI9PT10eXBlb2YgZT9RLmNhbGxiYWNrPWU6UT09PUwoTikmJk0oTik7VihiKX1lbHNlIE0oTik7UT1MKE4pfWlmKG51bGwhPT1RKXZhciBtPSEwO2Vsc2V7dmFyIG49TChPKTtudWxsIT09biYmZyhXLG4uc3RhcnRUaW1lLWIpO209ITF9cmV0dXJuIG19ZmluYWxseXtRPW51bGwsUj1jLFM9ITF9fVxuZnVuY3Rpb24gWShhKXtzd2l0Y2goYSl7Y2FzZSAxOnJldHVybi0xO2Nhc2UgMjpyZXR1cm4gMjUwO2Nhc2UgNTpyZXR1cm4gMTA3Mzc0MTgyMztjYXNlIDQ6cmV0dXJuIDFFNDtkZWZhdWx0OnJldHVybiA1RTN9fXZhciBaPWw7ZXhwb3J0cy51bnN0YWJsZV9JZGxlUHJpb3JpdHk9NTtleHBvcnRzLnVuc3RhYmxlX0ltbWVkaWF0ZVByaW9yaXR5PTE7ZXhwb3J0cy51bnN0YWJsZV9Mb3dQcmlvcml0eT00O2V4cG9ydHMudW5zdGFibGVfTm9ybWFsUHJpb3JpdHk9MztleHBvcnRzLnVuc3RhYmxlX1Byb2ZpbGluZz1udWxsO2V4cG9ydHMudW5zdGFibGVfVXNlckJsb2NraW5nUHJpb3JpdHk9MjtleHBvcnRzLnVuc3RhYmxlX2NhbmNlbENhbGxiYWNrPWZ1bmN0aW9uKGEpe2EuY2FsbGJhY2s9bnVsbH07ZXhwb3J0cy51bnN0YWJsZV9jb250aW51ZUV4ZWN1dGlvbj1mdW5jdGlvbigpe1R8fFN8fChUPSEwLGYoWCkpfTtcbmV4cG9ydHMudW5zdGFibGVfZ2V0Q3VycmVudFByaW9yaXR5TGV2ZWw9ZnVuY3Rpb24oKXtyZXR1cm4gUn07ZXhwb3J0cy51bnN0YWJsZV9nZXRGaXJzdENhbGxiYWNrTm9kZT1mdW5jdGlvbigpe3JldHVybiBMKE4pfTtleHBvcnRzLnVuc3RhYmxlX25leHQ9ZnVuY3Rpb24oYSl7c3dpdGNoKFIpe2Nhc2UgMTpjYXNlIDI6Y2FzZSAzOnZhciBiPTM7YnJlYWs7ZGVmYXVsdDpiPVJ9dmFyIGM9UjtSPWI7dHJ5e3JldHVybiBhKCl9ZmluYWxseXtSPWN9fTtleHBvcnRzLnVuc3RhYmxlX3BhdXNlRXhlY3V0aW9uPWZ1bmN0aW9uKCl7fTtleHBvcnRzLnVuc3RhYmxlX3JlcXVlc3RQYWludD1aO2V4cG9ydHMudW5zdGFibGVfcnVuV2l0aFByaW9yaXR5PWZ1bmN0aW9uKGEsYil7c3dpdGNoKGEpe2Nhc2UgMTpjYXNlIDI6Y2FzZSAzOmNhc2UgNDpjYXNlIDU6YnJlYWs7ZGVmYXVsdDphPTN9dmFyIGM9UjtSPWE7dHJ5e3JldHVybiBiKCl9ZmluYWxseXtSPWN9fTtcbmV4cG9ydHMudW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjaz1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9ZXhwb3J0cy51bnN0YWJsZV9ub3coKTtpZihcIm9iamVjdFwiPT09dHlwZW9mIGMmJm51bGwhPT1jKXt2YXIgZT1jLmRlbGF5O2U9XCJudW1iZXJcIj09PXR5cGVvZiBlJiYwPGU/ZCtlOmQ7Yz1cIm51bWJlclwiPT09dHlwZW9mIGMudGltZW91dD9jLnRpbWVvdXQ6WShhKX1lbHNlIGM9WShhKSxlPWQ7Yz1lK2M7YT17aWQ6UCsrLGNhbGxiYWNrOmIscHJpb3JpdHlMZXZlbDphLHN0YXJ0VGltZTplLGV4cGlyYXRpb25UaW1lOmMsc29ydEluZGV4Oi0xfTtlPmQ/KGEuc29ydEluZGV4PWUsSihPLGEpLG51bGw9PT1MKE4pJiZhPT09TChPKSYmKFU/aCgpOlU9ITAsZyhXLGUtZCkpKTooYS5zb3J0SW5kZXg9YyxKKE4sYSksVHx8U3x8KFQ9ITAsZihYKSkpO3JldHVybiBhfTtcbmV4cG9ydHMudW5zdGFibGVfc2hvdWxkWWllbGQ9ZnVuY3Rpb24oKXt2YXIgYT1leHBvcnRzLnVuc3RhYmxlX25vdygpO1YoYSk7dmFyIGI9TChOKTtyZXR1cm4gYiE9PVEmJm51bGwhPT1RJiZudWxsIT09YiYmbnVsbCE9PWIuY2FsbGJhY2smJmIuc3RhcnRUaW1lPD1hJiZiLmV4cGlyYXRpb25UaW1lPFEuZXhwaXJhdGlvblRpbWV8fGsoKX07ZXhwb3J0cy51bnN0YWJsZV93cmFwQ2FsbGJhY2s9ZnVuY3Rpb24oYSl7dmFyIGI9UjtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1SO1I9Yjt0cnl7cmV0dXJuIGEuYXBwbHkodGhpcyxhcmd1bWVudHMpfWZpbmFsbHl7Uj1jfX19O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3NjaGVkdWxlci5wcm9kdWN0aW9uLm1pbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9zY2hlZHVsZXIuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlICovXG5pbXBvcnQge1xuICB1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrLFxuICB1bnN0YWJsZV9Mb3dQcmlvcml0eSxcbiAgdW5zdGFibGVfSWRsZVByaW9yaXR5LFxuICB1bnN0YWJsZV9Ob3JtYWxQcmlvcml0eVxufSBmcm9tICdzY2hlZHVsZXInXG5cbmV4cG9ydCBjb25zdCBzY2hlZHVsZXIgPSB7XG4gIGFwcGx5V2l0aElkbGVQcmlvcml0eShjYWxsYmFjazooKT0+dm9pZCl7XG4gICAgdW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayh1bnN0YWJsZV9JZGxlUHJpb3JpdHksY2FsbGJhY2spXG4gIH0sXG4gIGFwcGx5V2l0aExvd1ByaW9yaXR5KGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgdW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayh1bnN0YWJsZV9Mb3dQcmlvcml0eSwgY2FsbGJhY2spXG4gIH0sXG4gIGFwcGx5V2lkdGhOb3JtYWxQcmlvcml0eShjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgIHVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2sodW5zdGFibGVfTm9ybWFsUHJpb3JpdHksIGNhbGxiYWNrKVxuICB9XG59XG4iLCJpbXBvcnQgeyBlYWNoIH0gZnJvbSAnLi9hcnJheSdcbmltcG9ydCB7IGlzVmFsaWQgfSBmcm9tICcuL2lzRW1wdHknXG5pbXBvcnQgeyBpc1BsYWluT2JqLCBpc0FyciwgZ2V0VHlwZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBCaWdEYXRhIH0gZnJvbSAnLi9iaWctZGF0YSdcbmNvbnN0IGlzVW5Ob3JtYWxPYmplY3QgPSAodmFsdWU6IGFueSkgPT4ge1xuICBpZiAodmFsdWU/Ll9vd25lciB8fCB2YWx1ZT8uJCR0eXBlb2YpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGlmICh2YWx1ZT8uX2lzQU1vbWVudE9iamVjdCB8fCB2YWx1ZT8uX2lzSlNPTlNjaGVtYU9iamVjdCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgaWYgKHZhbHVlPy50b0pTIHx8IHZhbHVlPy50b0pTT04pIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbmNvbnN0IGlzUGxhaW5WYWx1ZSA9ICh2YWw6IGFueSkgPT4ge1xuICBpZiAoaXNVbk5vcm1hbE9iamVjdCh2YWwpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgaWYgKEJpZ0RhdGEuaXNCaWdEYXRhKHZhbCkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gaXNQbGFpbk9iaih2YWwpIHx8IGlzQXJyKHZhbClcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGRlZmF1bHRzXG4gKiBAcGFyYW0gdGFyZ2V0c1xuICovXG5leHBvcnQgY29uc3QgZGVmYXVsdHMgPSAoZGVmYXVsdHNfOiBhbnksIHRhcmdldHM6IGFueSkgPT4ge1xuICBpZiAoXG4gICAgZ2V0VHlwZShkZWZhdWx0c18pICE9PSBnZXRUeXBlKHRhcmdldHMpIHx8XG4gICAgIWlzUGxhaW5WYWx1ZShkZWZhdWx0c18pIHx8XG4gICAgIWlzUGxhaW5WYWx1ZSh0YXJnZXRzKVxuICApIHtcbiAgICByZXR1cm4gaXNWYWxpZCh0YXJnZXRzKSA/IHRhcmdldHMgOiBkZWZhdWx0c19cbiAgfSBlbHNlIHtcbiAgICBjb25zdCByZXN1bHRzID0gaXNQbGFpbk9iaihkZWZhdWx0c18pID8ge30gOiBbXVxuICAgIGVhY2godGFyZ2V0cywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHJlc3VsdHNba2V5XSA9IGRlZmF1bHRzKGRlZmF1bHRzX1trZXldLCB2YWx1ZSlcbiAgICB9KVxuICAgIGVhY2goZGVmYXVsdHNfLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgaWYgKCFpc1ZhbGlkKHJlc3VsdHNba2V5XSkpIHtcbiAgICAgICAgcmVzdWx0c1trZXldID0gdmFsdWVcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cbn1cbiIsImVudW0gVFlQRV9TVFJJTkcge1xuICBVTkRFRklORUQgPSAndW5kZWZpbmVkJ1xufVxuZW51bSBDT05TT0xFX01FVEhPRFMge1xuICBERUJVRyA9ICdkZWJ1ZycsXG4gIEVSUk9SID0gJ2Vycm9yJyxcbiAgSU5GTyA9ICdpbmZvJyxcbiAgTE9HID0gJ2xvZycsXG4gIFdBUk4gPSAnd2FybicsXG4gIERJUiA9ICdkaXInLFxuICBESVJYTUwgPSAnZGlyeG1sJyxcbiAgVEFCTEUgPSAndGFibGUnLFxuICBUUkFDRSA9ICd0cmFjZScsXG4gIEdST1VQID0gJ2dyb3VwJyxcbiAgR1JPVVBDT0xMQVBTRUQgPSAnZ3JvdXBDb2xsYXBzZWQnLFxuICBHUk9VUEVORCA9ICdncm91cEVuZCcsXG4gIENMRUFSID0gJ2NsZWFyJyxcbiAgQ09VTlQgPSAnY291bnQnLFxuICBDT1VOVFJFU0VUID0gJ2NvdW50UmVzZXQnLFxuICBBU1NFUlQgPSAnYXNzZXJ0JyxcbiAgUFJPRklMRSA9ICdwcm9maWxlJyxcbiAgUFJPRklMRUVORCA9ICdwcm9maWxlRW5kJyxcbiAgVElNRSA9ICd0aW1lJyxcbiAgVElNRUxPRyA9ICd0aW1lTG9nJyxcbiAgVElNRUVORCA9ICd0aW1lRW5kJyxcbiAgVElNRVNUQU1QID0gJ3RpbWVTdGFtcCcsXG4gIENPTlRFWFQgPSAnY29udGV4dCcsXG4gIE1FTU9SWSA9ICdtZW1vcnknLFxuICAvLyBjdXN0b20gbmFtZVxuICBUSVBTID0gJ3RpcHMnXG59XG50eXBlIElMb2dEYXRhPEMsIFQ+ID0ge1xuICBjb250ZW50OiBDXG4gIHRpcHM/OiBUXG4gIGtleXdvcmQ6IHN0cmluZ1xufVxuXG5jbGFzcyBMb2cge1xuICBwcml2YXRlIGtleXdvcmQgPSAnQVBQJ1xuICBwcml2YXRlIGRlZmF1bHRNZXRob2RzID0gW1xuICAgIENPTlNPTEVfTUVUSE9EUy5MT0csXG4gICAgQ09OU09MRV9NRVRIT0RTLkVSUk9SLFxuICAgIENPTlNPTEVfTUVUSE9EUy5XQVJOXG4gIF1cbiAgcHJpdmF0ZSBkaXNhYmxlZCA9IHRydWVcbiAgcHJpdmF0ZSBtZXRob2RzOiBDT05TT0xFX01FVEhPRFNbXSA9IFtdXG4gIGNvbnN0cnVjdG9yKGtleXdvcmQ6IHN0cmluZywgbWV0aG9kczogQ09OU09MRV9NRVRIT0RTW10pIHtcbiAgICB0aGlzLmtleXdvcmQgPSBrZXl3b3JkXG4gICAgdGhpcy5tZXRob2RzID0gbWV0aG9kc1xuICAgIHRoaXMuaW5pdENvbnNvbGUoKVxuICB9XG4gIHByaXZhdGUgaW5pdENvbnNvbGUoKTogdm9pZCB7XG4gICAgY29uc3QgaGFzQ29uc29sZSA9IHR5cGVvZiBjb25zb2xlID09PSBUWVBFX1NUUklORy5VTkRFRklORURcbiAgICB0aGlzLmRpc2FibGVkID0gaGFzQ29uc29sZVxuICAgIHRoaXMubWV0aG9kcy5mb3JFYWNoKChuYW1lOiBDT05TT0xFX01FVEhPRFMpID0+IHtcbiAgICAgIGlmICh0aGlzLmRlZmF1bHRNZXRob2RzLmluZGV4T2YobmFtZSkgPiAtMSkgcmV0dXJuXG4gICAgICB0aGlzW25hbWVdID0gdGhpcy53cmFwKG5hbWUpXG4gICAgfSlcbiAgfVxuICBwcml2YXRlIHdyYXAobmFtZTogQ09OU09MRV9NRVRIT0RTKTogKGNvbnRlbnQ6IGFueSkgPT4gdm9pZCB7XG4gICAgcmV0dXJuIChjb250ZW50OiBhbnkpID0+IHtcbiAgICAgIHRoaXMuY2FsbENvbnNvbGU8YW55LCBhbnk+KG5hbWUsIGNvbnRlbnQpXG4gICAgfVxuICB9XG4gIHByaXZhdGUgZ2V0S2V5V29yZFN0eWxlKG5hbWU6IENPTlNPTEVfTUVUSE9EUyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBbICR7dGhpcy5rZXl3b3JkfSAke25hbWV9IF06IGBcbiAgfVxuICBwcml2YXRlIGNhbGxDb25zb2xlPEMsIFQ+KG5hbWU6IENPTlNPTEVfTUVUSE9EUywgY29udGVudDogQywgdGlwcz86IFQpIHtcbiAgICBjb25zdCBsb2dEYXRhOiBJTG9nRGF0YTxDLCBUPiA9IHsgY29udGVudCwga2V5d29yZDogdGhpcy5rZXl3b3JkIH1cbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgbG9nRGF0YS5jb250ZW50ID0gdm9pZCAwXG4gICAgICBpZiAodGlwcykge1xuICAgICAgICBsb2dEYXRhLnRpcHMgPSB2b2lkIDBcbiAgICAgIH1cbiAgICAgIHJldHVybiBsb2dEYXRhXG4gICAgfVxuICAgIGNvbnN0IENvbnNvbGUgPSBjb25zb2xlXG4gICAgY29uc3Qga2V5d29yZCA9IHRoaXMuZ2V0S2V5V29yZFN0eWxlKG5hbWUpXG4gICAgQ29uc29sZVtuYW1lXSAmJiBDb25zb2xlW25hbWVdKGtleXdvcmQsIGNvbnRlbnQpXG4gICAgaWYgKHRpcHMpIHtcbiAgICAgIGxvZ0RhdGEudGlwcyA9IHRpcHNcbiAgICAgIENvbnNvbGUuaW5mbyh0aGlzLmdldEtleVdvcmRTdHlsZShDT05TT0xFX01FVEhPRFMuVElQUyksIHRpcHMpXG4gICAgfVxuICAgIHJldHVybiBsb2dEYXRhXG4gIH1cbiAgcHVibGljIGxvZzxDLCBUPihjb250ZW50OiBDKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsbENvbnNvbGU8QywgVD4oQ09OU09MRV9NRVRIT0RTLkxPRywgY29udGVudClcbiAgfVxuICBwdWJsaWMgd2FybjxDLCBUPihjb250ZW50OiBDLCB0aXBzPzogVCkge1xuICAgIHJldHVybiB0aGlzLmNhbGxDb25zb2xlPEMsIFQ+KENPTlNPTEVfTUVUSE9EUy5XQVJOLCBjb250ZW50LCB0aXBzKVxuICB9XG4gIHB1YmxpYyBlcnJvcjxDLCBUPihjb250ZW50OiBDLCB0aXBzPzogVCkge1xuICAgIHJldHVybiB0aGlzLmNhbGxDb25zb2xlPEMsIFQ+KENPTlNPTEVfTUVUSE9EUy5FUlJPUiwgY29udGVudCwgdGlwcylcbiAgfVxuICBwdWJsaWMgaW5mbzxDLCBUPihjb250ZW50OiBDKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsbENvbnNvbGU8QywgVD4oQ09OU09MRV9NRVRIT0RTLklORk8sIGNvbnRlbnQpXG4gIH1cbiAgcHVibGljIGNsb3NlKCkge1xuICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlXG4gIH1cbiAgcHVibGljIG9wZW4oKSB7XG4gICAgdGhpcy5pbml0Q29uc29sZSgpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGxvZyA9IG5ldyBMb2coJ0Zvcm1pbHknLCBbXSlcbiIsImxldCBJRFggPSAzNixcbiAgSEVYID0gJydcbndoaWxlIChJRFgtLSkgSEVYICs9IElEWC50b1N0cmluZygzNilcblxuZXhwb3J0IGZ1bmN0aW9uIHVpZChsZW4/OiBudW1iZXIpIHtcbiAgbGV0IHN0ciA9ICcnLFxuICAgIG51bSA9IGxlbiB8fCAxMVxuICB3aGlsZSAobnVtLS0pIHN0ciArPSBIRVhbKE1hdGgucmFuZG9tKCkgKiAzNikgfCAwXVxuICByZXR1cm4gc3RyXG59XG4iXSwibmFtZXMiOlsiX19kZWZQcm9wIiwiX19nZXRPd25Qcm9wU3ltYm9scyIsIl9faGFzT3duUHJvcCIsIl9fcHJvcElzRW51bSIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fc3ByZWFkVmFsdWVzIiwiaXNWYWxpZCIsIkxBTkdVQUdFUyIsInVwcGVyQ2FzZSIsImxvd2VyQ2FzZSIsInJlcXVpcmUkJDAiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMiIsInJlcXVpcmUkJDMiLCJub0Nhc2UiLCJ0aGlzIiwidG9rZW5zXzEiLCJjb250ZXh0c18xIiwicmVxdWlyZSQkNCIsInJlcXVpcmUkJDUiLCJzY2hlZHVsZXJNb2R1bGUiLCJ1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrIiwidW5zdGFibGVfSWRsZVByaW9yaXR5IiwidW5zdGFibGVfTG93UHJpb3JpdHkiLCJ1bnN0YWJsZV9Ob3JtYWxQcmlvcml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUFBLE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekgsWUFBQyxPQUFPLHNCQUFHLENBQUMsR0FBRyxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUU7QUFDeEQsWUFBQyxJQUFJLG1CQUFHLE1BQU0sQ0FBQztNQUMzQixFQUFFLFVBQVU7TUFDWixFQUFFLGVBQWU7TUFDakIsRUFBRSxtQkFBbUI7TUFDckIsQ0FBQyxHQUFFO0FBQ1MsWUFBQyxLQUFLLG9CQUFHLEtBQUssQ0FBQyxTQUFRO0FBQ3ZCLFlBQUMsVUFBVSx5QkFBRyxNQUFNLENBQUMsUUFBUSxHQUFFO0FBQy9CLFlBQUMsS0FBSyxvQkFBRyxNQUFNLENBQUMsUUFBUSxHQUFFO0FBQzFCLFlBQUMsTUFBTSxxQkFBRyxNQUFNLENBQUMsU0FBUyxHQUFFO0FBQzVCLFlBQUMsS0FBSyxvQkFBRyxNQUFNLENBQUMsUUFBUSxHQUFFO0FBQzFCLFlBQUMsS0FBSyxvQkFBRyxDQUFDLEdBQUcsS0FBSyxPQUFPLEdBQUcsS0FBSyxVQUFTO0FBQzFDLFlBQUMsUUFBUSx1QkFBRyxNQUFNLENBQUMsUUFBUTs7QUNaM0IsWUFBQyxLQUFLLG9CQUFHLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBRztNQUMzRCxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtNQUM1QyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUNoQyxJQUFJLElBQUksTUFBTSxFQUFFO01BQ2hCLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ2hELFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtNQUMzQyxVQUFVLE9BQU87TUFDakIsU0FBUztNQUNULE9BQU87TUFDUCxLQUFLLE1BQU07TUFDWCxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQzNDLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtNQUMzQyxVQUFVLE9BQU87TUFDakIsU0FBUztNQUNULE9BQU87TUFDUCxLQUFLO01BQ0wsR0FBRyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BQ3pCLElBQUksSUFBSSxHQUFHLENBQUM7TUFDWixJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBRTtNQUNyQixNQUFNLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFO01BQ2hELFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEtBQUssRUFBRTtNQUMvQyxVQUFVLE9BQU87TUFDakIsU0FBUztNQUNULE9BQU87TUFDUCxLQUFLO01BQ0wsR0FBRztNQUNILENBQUM7TUFDTSxTQUFTLEdBQUcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtNQUMzQyxFQUFFLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztNQUNqRCxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLO01BQzNCLElBQUksTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztNQUN0QyxJQUFJLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BRXBCLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN0QixLQUFLLE1BQU07TUFDWCxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDdkIsS0FBSztNQUNMLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUNiLEVBQUUsT0FBTyxHQUFHLENBQUM7TUFDYixDQUFDO01BQ00sU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFO01BQzNELEVBQUUsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDO01BQzNCLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUs7TUFDM0IsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDekMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO01BQ2IsRUFBRSxPQUFPLE1BQU0sQ0FBQztNQUNoQixDQUFDO01BQ00sU0FBUyxLQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7TUFDN0MsRUFBRSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7TUFDakIsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSztNQUMzQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO01BQzlCLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQztNQUNsQixNQUFNLE9BQU8sS0FBSyxDQUFDO01BQ25CLEtBQUs7TUFDTCxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDYixFQUFFLE9BQU8sR0FBRyxDQUFDO01BQ2IsQ0FBQztNQUNNLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO01BQzVDLEVBQUUsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO01BQ2xCLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUs7TUFDM0IsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7TUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO01BQ2pCLE1BQU0sT0FBTyxLQUFLLENBQUM7TUFDbkIsS0FBSztNQUNMLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUNiLEVBQUUsT0FBTyxHQUFHLENBQUM7TUFDYixDQUFDO01BQ00sU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7TUFDakQsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztNQUNmLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUs7TUFDM0IsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7TUFDN0IsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDO01BQ2hCLE1BQU0sT0FBTyxLQUFLLENBQUM7TUFDbkIsS0FBSztNQUNMLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUNiLEVBQUUsT0FBTyxHQUFHLENBQUM7TUFDYixDQUFDO01BQ00sU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7TUFDNUMsRUFBRSxJQUFJLEdBQUcsQ0FBQztNQUNWLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUs7TUFDM0IsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7TUFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO01BQ2pCLE1BQU0sT0FBTyxLQUFLLENBQUM7TUFDbkIsS0FBSztNQUNMLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUNiLEVBQUUsT0FBTyxHQUFHLENBQUM7TUFDYixDQUFDO01BQ00sU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUU7TUFDckQsRUFBRSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUM7TUFDaEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7TUFDdkMsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEtBQUssSUFBSSxLQUFLLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUM3RDs7TUM1RkEsU0FBUyxVQUFVLEdBQUc7TUFDdEIsRUFBRSxJQUFJO01BQ04sSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsRUFBRTtNQUNyQyxNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDZCxHQUFHO01BQ0gsRUFBRSxJQUFJO01BQ04sSUFBSSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtNQUN2QyxNQUFNLE9BQU8sTUFBTSxDQUFDO01BQ3BCLEtBQUs7TUFDTCxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDZCxHQUFHO01BQ0gsRUFBRSxJQUFJO01BQ04sSUFBSSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtNQUN2QyxNQUFNLE9BQU8sTUFBTSxDQUFDO01BQ3BCLEtBQUs7TUFDTCxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDZCxHQUFHO01BQ0gsRUFBRSxPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO01BQ25DLENBQUM7QUFDVyxZQUFDLGtCQUFrQixpQ0FBRyxVQUFVOztBQ25CaEMsWUFBQyxNQUFNLHFCQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSztNQUN0QyxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQztNQUNmLElBQUksT0FBTyxLQUFLLFlBQVksR0FBRyxDQUFDO01BQ2hDLEVBQUUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDO01BQ2hCLElBQUksT0FBTyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLFlBQVksa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO01BQ3RGLEVBQUUsT0FBTyxLQUFLLENBQUM7TUFDZjs7TUNSQSxJQUFJQSxXQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztNQUN0QyxJQUFJQyxxQkFBbUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7TUFDdkQsSUFBSUMsY0FBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO01BQ25ELElBQUlDLGNBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO01BQ3pELElBQUlDLGlCQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssS0FBSyxHQUFHLElBQUksR0FBRyxHQUFHSixXQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztNQUNoSyxJQUFJSyxnQkFBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSztNQUMvQixFQUFFLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDaEMsSUFBSSxJQUFJSCxjQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDbEMsTUFBTUUsaUJBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQ3hDLEVBQUUsSUFBSUgscUJBQW1CO01BQ3pCLElBQUksS0FBSyxJQUFJLElBQUksSUFBSUEscUJBQW1CLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDN0MsTUFBTSxJQUFJRSxjQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDcEMsUUFBUUMsaUJBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQzFDLEtBQUs7TUFDTCxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ1gsQ0FBQyxDQUFDO01BRUYsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO01BQzdDLE1BQU0sUUFBUSxHQUFHLE1BQU07TUFDdkIsRUFBRSxXQUFXLENBQUMsT0FBTyxFQUFFO01BQ3ZCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBR0MsZ0JBQWMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDL0MsR0FBRztNQUNILEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRTtNQUNmLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7TUFDekIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO01BQ2hDLFFBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7TUFDM0MsT0FBTztNQUNQLEtBQUs7TUFDTCxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7TUFDSCxDQUFDLENBQUM7QUFDUSxVQUFDLE9BQU8sc0JBQUcsVUFBUztNQUM5QixPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxLQUFLO01BQzlCLEVBQUUsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztNQUN2QyxDQUFDLENBQUM7TUFDRixPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSztNQUM1QixFQUFFLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQ3RELElBQUksSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFO01BQy9DLE1BQU0sT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdkYsS0FBSztNQUNMLElBQUksT0FBTyxLQUFLLENBQUM7TUFDakIsR0FBRztNQUNILEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ2pCLENBQUMsQ0FBQztNQUNGLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEtBQUs7TUFDM0IsRUFBRSxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDakMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDMUMsTUFBTSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7TUFDdkMsTUFBTSxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3ZELE1BQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUNsQyxNQUFNLE9BQU8sTUFBTSxDQUFDO01BQ3BCLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBRSxPQUFPLEtBQUssQ0FBQztNQUNmLENBQUM7O01DbkRELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQztNQUN0QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO01BQzVCLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO01BQ2hELFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUscUJBQXFCLEdBQUcsS0FBSyxFQUFFO01BQ3BELEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ2YsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO01BQ0gsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtNQUNoRSxJQUFJLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDMUMsSUFBSSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzFDLElBQUksSUFBSSxRQUFRLEtBQUssUUFBUSxFQUFFO01BQy9CLE1BQU0sT0FBTyxLQUFLLENBQUM7TUFDbkIsS0FBSztNQUNMLElBQUksSUFBSSxRQUFRLElBQUksUUFBUSxFQUFFO01BQzlCLE1BQU0sT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUNuQyxLQUFLO01BQ0wsSUFBSSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUIsSUFBSSxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUIsSUFBSSxJQUFJLENBQUMsQ0FBQztNQUNWLElBQUksSUFBSSxNQUFNLENBQUM7TUFDZixJQUFJLElBQUksR0FBRyxDQUFDO01BQ1osSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7TUFDdEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztNQUN4QixNQUFNLElBQUksTUFBTSxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUU7TUFDL0IsUUFBUSxPQUFPLEtBQUssQ0FBQztNQUNyQixPQUFPO01BQ1AsTUFBTSxLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJO01BQ3BDLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLHFCQUFxQixDQUFDLEVBQUU7TUFDdkQsVUFBVSxPQUFPLEtBQUssQ0FBQztNQUN2QixTQUFTO01BQ1QsT0FBTztNQUNQLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO01BQ3ZCLE1BQU0sT0FBTyxLQUFLLENBQUM7TUFDbkIsS0FBSztNQUNMLElBQUksTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztNQUM1QyxJQUFJLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUM7TUFDNUMsSUFBSSxJQUFJLE9BQU8sS0FBSyxPQUFPO01BQzNCLE1BQU0sT0FBTyxLQUFLLENBQUM7TUFDbkIsSUFBSSxJQUFJLE9BQU8sSUFBSSxPQUFPO01BQzFCLE1BQU0sT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3pCLElBQUksTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7TUFDbkMsSUFBSSxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQztNQUNuQyxJQUFJLElBQUksVUFBVSxLQUFLLFVBQVU7TUFDakMsTUFBTSxPQUFPLEtBQUssQ0FBQztNQUNuQixJQUFJLElBQUksVUFBVTtNQUNsQixNQUFNLE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdEMsSUFBSSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO01BQ3BDLElBQUksTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUNwQyxJQUFJLElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtNQUN6QixNQUFNLE9BQU8sS0FBSyxDQUFDO01BQ25CLEtBQUs7TUFDTCxJQUFJLElBQUksS0FBSyxJQUFJLEtBQUssRUFBRTtNQUN4QixNQUFNLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztNQUN6QyxLQUFLO01BQ0wsSUFBSSxNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztNQUNsQyxJQUFJLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO01BQ2xDLElBQUksSUFBSSxPQUFPLEtBQUssT0FBTztNQUMzQixNQUFNLE9BQU8sS0FBSyxDQUFDO01BQ25CLElBQUksSUFBSSxPQUFPLElBQUksT0FBTztNQUMxQixNQUFNLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUscUJBQXFCLENBQUMsQ0FBQztNQUNsRSxJQUFJLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDeEMsSUFBSSxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQ3hDLElBQUksSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO01BQzdCLE1BQU0sT0FBTyxLQUFLLENBQUM7TUFDbkIsS0FBSztNQUNMLElBQUksSUFBSSxPQUFPLElBQUksT0FBTyxFQUFFO01BQzVCLE1BQU0sT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO01BQzNDLEtBQUs7TUFDTCxJQUFJLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDbEMsSUFBSSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQ2xDLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO01BQ3RCLE1BQU0sT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7TUFDL0IsS0FBSztNQUNMLElBQUksTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzVCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDekIsSUFBSSxJQUFJLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO01BQ3RDLE1BQU0sT0FBTyxLQUFLLENBQUM7TUFDbkIsS0FBSztNQUNMLElBQUksS0FBSyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSTtNQUNsQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUNyQyxRQUFRLE9BQU8sS0FBSyxDQUFDO01BQ3JCLE9BQU87TUFDUCxLQUFLO01BQ0wsSUFBSSxLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJO01BQ2xDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNwQixNQUFNLElBQUksR0FBRyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO01BQzFDLFFBQVEsU0FBUztNQUNqQixPQUFPLE1BQU07TUFDYixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxxQkFBcUIsQ0FBQyxFQUFFO01BQzNELFVBQVUsT0FBTyxLQUFLLENBQUM7TUFDdkIsU0FBUztNQUNULE9BQU87TUFDUCxLQUFLO01BQ0wsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO01BQ0gsRUFBRSxJQUFJLHFCQUFxQixFQUFFO01BQzdCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFVBQVUsSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLEVBQUU7TUFDdEUsTUFBTSxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7TUFDM0MsS0FBSztNQUNMLEdBQUc7TUFDSCxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzVCLENBQUM7QUFDVyxZQUFDLE9BQU8sc0JBQUcsU0FBUyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxxQkFBcUIsR0FBRyxLQUFLLEVBQUU7TUFDbkYsRUFBRSxJQUFJO01BQ04sSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLHFCQUFxQixDQUFDLENBQUM7TUFDOUMsR0FBRyxDQUFDLE9BQU8sS0FBSyxFQUFFO01BQ2xCLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLFVBQVUsRUFBRTtNQUNsRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0VBQWtFLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDbEgsTUFBTSxPQUFPLEtBQUssQ0FBQztNQUNuQixLQUFLO01BQ0wsSUFBSSxNQUFNLEtBQUssQ0FBQztNQUNoQixHQUFHO01BQ0g7O01DckhBLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7TUFDdEMsSUFBSSxtQkFBbUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7TUFDdkQsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7TUFDbkQsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztNQUN6RCxJQUFJLGVBQWUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxLQUFLLEdBQUcsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDaEssSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLO01BQy9CLEVBQUUsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNoQyxJQUFJLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO01BQ2xDLE1BQU0sZUFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDeEMsRUFBRSxJQUFJLG1CQUFtQjtNQUN6QixJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDN0MsTUFBTSxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztNQUNwQyxRQUFRLGVBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQzFDLEtBQUs7TUFDTCxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ1gsQ0FBQyxDQUFDO01BSUYsTUFBTSxXQUFXLEdBQUc7TUFDcEIsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNoQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxLQUFLLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3hDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLEtBQUssSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDeEMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNoQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ3BDLEVBQUUsVUFBVTtNQUNaLEVBQUUsTUFBTTtNQUNSLEVBQUUsS0FBSztNQUNQLEVBQUUsUUFBUTtNQUNWLEVBQUU7TUFDRixJQUFJLFNBQVM7TUFDYixJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sS0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztNQUNoRixHQUFHO01BQ0gsQ0FBQyxDQUFDO01BQ0YsTUFBTSxjQUFjLEdBQUcsQ0FBQyxNQUFNLEtBQUs7TUFDbkMsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUMvQyxJQUFJLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNoQyxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDeEMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDbkMsUUFBUSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzNDLE9BQU87TUFDUCxLQUFLLE1BQU07TUFDWCxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtNQUNoQyxRQUFRLE9BQU8sSUFBSSxDQUFDO01BQ3BCLE9BQU87TUFDUCxLQUFLO01BQ0wsR0FBRztNQUNILENBQUMsQ0FBQztBQUNVLFlBQUMsWUFBWSwyQkFBRyxDQUFDLE1BQU0sS0FBSztNQUN4QyxFQUFFLElBQUksV0FBVyxDQUFDO01BQ2xCLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQzdCLElBQUksT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzNCLEdBQUcsTUFBTSxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUNyQyxJQUFJLFdBQVcsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDekMsSUFBSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO01BQzVELEdBQUcsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO01BQ3JELElBQUksT0FBTyxjQUFjLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO01BQ3RDLEdBQUc7TUFDSCxHQUFFO0FBQ1UsWUFBQyxLQUFLLG9CQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sS0FBSztNQUN6QyxFQUFFLElBQUksV0FBVyxDQUFDO01BQ2xCLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQzdCLElBQUksT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztNQUNyRCxHQUFHLE1BQU0sSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDckMsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ3pDLElBQUksT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztNQUM1RCxHQUFHLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtNQUNyRCxJQUFJLElBQUksVUFBVSxJQUFJLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxFQUFFO01BQ3BELE1BQU0sT0FBTyxNQUFNLENBQUM7TUFDcEIsS0FBSztNQUNMLElBQUksSUFBSSxNQUFNLENBQUMsZ0JBQWdCLEVBQUU7TUFDakMsTUFBTSxPQUFPLE1BQU0sQ0FBQztNQUNwQixLQUFLO01BQ0wsSUFBSSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtNQUNwQyxNQUFNLE9BQU8sTUFBTSxDQUFDO01BQ3BCLEtBQUs7TUFDTCxJQUFJLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUNuQyxNQUFNLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNuQyxLQUFLO01BQ0wsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDM0IsTUFBTSxPQUFPLE1BQU0sQ0FBQztNQUNwQixLQUFLO01BQ0wsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDN0IsTUFBTSxPQUFPLE1BQU0sQ0FBQztNQUNwQixLQUFLO01BQ0wsSUFBSSxJQUFJLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO01BQzNELE1BQU0sT0FBTyxNQUFNLENBQUM7TUFDcEIsS0FBSztNQUNMLElBQUksTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO01BQ25CLElBQUksS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUU7TUFDOUIsTUFBTSxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRTtNQUNuRCxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQzFCLFVBQVUsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO01BQ3hDLFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDbEQsV0FBVyxNQUFNO01BQ2pCLFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNuQyxXQUFXO01BQ1gsU0FBUyxNQUFNO01BQ2YsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUNoRCxTQUFTO01BQ1QsT0FBTztNQUNQLEtBQUs7TUFDTCxJQUFJLE9BQU8sR0FBRyxDQUFDO01BQ2YsR0FBRyxNQUFNO01BQ1QsSUFBSSxPQUFPLE1BQU0sQ0FBQztNQUNsQixHQUFHO01BQ0g7O01DekdBLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO01BQzVDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0FBQy9CLFlBQUNDLFNBQU8sc0JBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxNQUFLO01BQ3hELFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRTtNQUM3QixFQUFFLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtNQUNuQixJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7TUFDSCxFQUFFLElBQUksT0FBTyxHQUFHLEtBQUssU0FBUyxFQUFFO01BQ2hDLElBQUksT0FBTyxLQUFLLENBQUM7TUFDakIsR0FBRztNQUNILEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7TUFDL0IsSUFBSSxPQUFPLEtBQUssQ0FBQztNQUNqQixHQUFHO01BQ0gsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtNQUMvQixJQUFJLE9BQU8sR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7TUFDNUIsR0FBRztNQUNILEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxVQUFVLEVBQUU7TUFDakMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO01BQzVCLEdBQUc7TUFDSCxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUMxQixJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDMUIsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUN6QyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ2pGLFFBQVEsT0FBTyxLQUFLLENBQUM7TUFDckIsT0FBTztNQUNQLEtBQUs7TUFDTCxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7TUFDSCxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRTtNQUM1QixJQUFJLE9BQU8sR0FBRyxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7TUFDOUIsR0FBRztNQUNILEVBQUUsSUFBSSxHQUFHLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtNQUNqQyxJQUFJLFFBQVEsR0FBRyxDQUFDLFFBQVEsRUFBRTtNQUMxQixNQUFNLEtBQUssZUFBZSxDQUFDO01BQzNCLE1BQU0sS0FBSyxjQUFjLENBQUM7TUFDMUIsTUFBTSxLQUFLLGNBQWMsRUFBRTtNQUMzQixRQUFRLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUM7TUFDOUIsT0FBTztNQUNQLE1BQU0sS0FBSyxpQkFBaUIsRUFBRTtNQUM5QixRQUFRLEtBQUssTUFBTSxHQUFHLElBQUksR0FBRyxFQUFFO01BQy9CLFVBQVUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRTtNQUNsQyxZQUFZLE9BQU8sS0FBSyxDQUFDO01BQ3pCLFdBQVc7TUFDWCxTQUFTO01BQ1QsUUFBUSxPQUFPLElBQUksQ0FBQztNQUNwQixPQUFPO01BQ1AsS0FBSztNQUNMLEdBQUc7TUFDSCxFQUFFLE9BQU8sS0FBSyxDQUFDO01BQ2Y7Ozs7Ozs7Ozs7Ozs7Ozs7TUM3Q0EsSUFBSUMsV0FBUyxHQUFHO01BQ2hCLEVBQUUsRUFBRSxFQUFFO01BQ04sSUFBSSxNQUFNLEVBQUUsV0FBVztNQUN2QixJQUFJLEdBQUcsRUFBRTtNQUNULE1BQU0sUUFBUSxFQUFFLFFBQVE7TUFDeEIsS0FBSztNQUNMLEdBQUc7TUFDSCxFQUFFLEVBQUUsRUFBRTtNQUNOLElBQUksTUFBTSxFQUFFLFdBQVc7TUFDdkIsSUFBSSxHQUFHLEVBQUU7TUFDVCxNQUFNLFFBQVEsRUFBRSxRQUFRO01BQ3hCLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBRSxFQUFFLEVBQUU7TUFDTixJQUFJLE1BQU0sRUFBRSw4REFBOEQ7TUFDMUUsSUFBSSxHQUFHLEVBQUU7TUFDVCxNQUFNLGNBQWMsRUFBRSxRQUFRO01BQzlCLE1BQU0sY0FBYyxFQUFFLFFBQVE7TUFDOUIsTUFBTSxjQUFjLEVBQUUsUUFBUTtNQUM5QixNQUFNLG9CQUFvQixFQUFFLFFBQVE7TUFDcEMsTUFBTSxvQkFBb0IsRUFBRSxRQUFRO01BQ3BDLE1BQU0sb0JBQW9CLEVBQUUsUUFBUTtNQUNwQyxLQUFLO01BQ0wsR0FBRztNQUNILEVBQUM7QUFDRDtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtVQUNBQyxXQUFjLHdCQUFHLFVBQVUsR0FBRyxFQUFFLE1BQU0sRUFBRTtNQUN4QyxFQUFFLElBQUksSUFBSSxHQUFHRCxXQUFTLENBQUMsTUFBTSxFQUFDO0FBQzlCO01BQ0EsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBQztBQUN0QztNQUNBLEVBQUUsSUFBSSxJQUFJLEVBQUU7TUFDWixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQztNQUN2RSxHQUFHO0FBQ0g7TUFDQSxFQUFFLE9BQU8sR0FBRyxDQUFDLFdBQVcsRUFBRTtNQUMxQjs7Ozs7Ozs7OztNQzFDQSxJQUFJLFNBQVMsR0FBRztNQUNoQixFQUFFLEVBQUUsRUFBRTtNQUNOLElBQUksTUFBTSxFQUFFLDZCQUE2QjtNQUN6QyxJQUFJLEdBQUcsRUFBRTtNQUNULE1BQU0sUUFBUSxFQUFFLFFBQVE7TUFDeEIsTUFBTSxRQUFRLEVBQUUsUUFBUTtNQUN4QixNQUFNLGNBQWMsRUFBRSxRQUFRO01BQzlCLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBRSxFQUFFLEVBQUU7TUFDTixJQUFJLE1BQU0sRUFBRSxXQUFXO01BQ3ZCLElBQUksR0FBRyxFQUFFO01BQ1QsTUFBTSxRQUFRLEVBQUUsUUFBUTtNQUN4QixNQUFNLFFBQVEsRUFBRSxRQUFRO01BQ3hCLE1BQU0sY0FBYyxFQUFFLFFBQVE7TUFDOUIsS0FBSztNQUNMLEdBQUc7TUFDSCxFQUFFLEVBQUUsRUFBRTtNQUNOLElBQUksTUFBTSxFQUFFLHlDQUF5QztNQUNyRCxJQUFJLEdBQUcsRUFBRTtNQUNULE1BQU0sUUFBUSxFQUFFLGNBQWM7TUFDOUIsTUFBTSxRQUFRLEVBQUUsY0FBYztNQUM5QixNQUFNLFFBQVEsRUFBRSxjQUFjO01BQzlCLE1BQU0sUUFBUSxFQUFFLG9CQUFvQjtNQUNwQyxNQUFNLFFBQVEsRUFBRSxvQkFBb0I7TUFDcEMsTUFBTSxRQUFRLEVBQUUsb0JBQW9CO01BQ3BDLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBQztBQUNEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO1VBQ0FFLFdBQWMsd0JBQUcsVUFBVSxHQUFHLEVBQUUsTUFBTSxFQUFFO01BQ3hDLEVBQUUsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBQztBQUM5QjtNQUNBLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUM7QUFDdEM7TUFDQSxFQUFFLElBQUksSUFBSSxFQUFFO01BQ1osSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUM7TUFDdkUsR0FBRztBQUNIO01BQ0EsRUFBRSxPQUFPLEdBQUcsQ0FBQyxXQUFXLEVBQUU7TUFDMUI7O1VDckRBLGFBQWMsR0FBRzs7VUNBakIsZUFBYyxHQUFHOztVQ0FqQixvQkFBYyxHQUFHOztNQ0FqQixJQUFJLFNBQVMsR0FBR0MsWUFBcUI7QUFDckM7TUFDQSxJQUFJLGVBQWUsR0FBR0MsY0FBbUM7TUFDekQsSUFBSSxpQkFBaUIsR0FBR0MsZ0JBQXFDO01BQzdELElBQUksdUJBQXVCLEdBQUdDLHFCQUEyQztBQUN6RTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7VUFDQUMsUUFBYyxHQUFHLFVBQVUsR0FBRyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7TUFDckQsRUFBRSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7TUFDbkIsSUFBSSxPQUFPLEVBQUU7TUFDYixHQUFHO0FBQ0g7TUFDQSxFQUFFLFdBQVcsR0FBRyxPQUFPLFdBQVcsS0FBSyxRQUFRLEdBQUcsR0FBRyxHQUFHLFlBQVc7QUFDbkU7TUFDQSxFQUFFLFNBQVMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO01BQ3pDLElBQUksSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUNoRSxNQUFNLE9BQU8sRUFBRTtNQUNmLEtBQUs7QUFDTDtNQUNBLElBQUksT0FBTyxXQUFXO01BQ3RCLEdBQUc7QUFDSDtNQUNBLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7TUFDbkI7TUFDQSxLQUFLLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUM7TUFDeEM7TUFDQSxLQUFLLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxPQUFPLENBQUM7TUFDOUM7TUFDQSxLQUFLLE9BQU8sQ0FBQyxlQUFlLEVBQUUsT0FBTyxFQUFDO0FBQ3RDO01BQ0E7TUFDQSxFQUFFLE9BQU8sU0FBUyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7TUFDL0I7O01DdkNBLElBQUksU0FBUyxHQUFHSixZQUFxQjtNQUNyQyxJQUFJLE1BQU0sR0FBR0MsU0FBa0I7QUFDL0I7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtVQUNBLFNBQWMsd0JBQUcsVUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRTtNQUN4RCxFQUFFLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFDO0FBQ3BDO01BQ0E7TUFDQSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUU7TUFDckIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFDO01BQzVDLEdBQUc7QUFDSDtNQUNBO01BQ0EsRUFBRSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtNQUNsRCxJQUFJLE9BQU8sU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7TUFDaEMsR0FBRyxDQUFDO01BQ0o7O01DdEJBLE1BQU0sU0FBUyxHQUFHLE1BQU07TUFDeEIsRUFBRSxNQUFNLE9BQU8sR0FBRztNQUNsQixJQUFJLCtFQUErRTtNQUNuRixJQUFJLHdEQUF3RDtNQUM1RCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2QsRUFBRSxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztNQUNsQyxDQUFDLENBQUM7TUFDRixNQUFNLEtBQUssR0FBRyxnQ0FBZ0MsQ0FBQztNQUMvQyxNQUFNLFdBQVcsR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDckcsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFLLEtBQUssT0FBTyxLQUFLLEtBQUssUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ3BGLFlBQUMsWUFBWSwyQkFBRyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7TUNUcEYsSUFBSSxRQUFRLEdBQUcsQ0FBQ0ksY0FBSSxJQUFJQSxjQUFJLENBQUMsUUFBUSxLQUFLLFlBQVk7TUFDdEQsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsRUFBRTtNQUM1QyxRQUFRLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO01BQzdELFlBQVksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM3QixZQUFZLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDM0UsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUIsU0FBUztNQUNULFFBQVEsT0FBTyxDQUFDLENBQUM7TUFDakIsS0FBSyxDQUFDO01BQ04sSUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQzNDLENBQUMsQ0FBQztNQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dDQUNyQyx3QkFBdUIsd0JBQXVCLDJCQUEwQiwrQkFBOEIsMEJBQXlCLEdBQUcsS0FBSyxFQUFFO01BQ2xLLElBQUksV0FBVyxHQUFHLFVBQVUsSUFBSSxFQUFFLEtBQUssRUFBRTtNQUN6QyxJQUFJLE9BQU8sUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQzNDLENBQUMsQ0FBQzs2QkFDb0IsR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFO2tDQUNoQixHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUU7OEJBQzVCLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRTsyQkFDMUIsR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFOzJCQUNyQixHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUU7Z0NBQ2hCLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQzs7O01DckI5QyxJQUFJLFFBQVEsR0FBRyxDQUFDQSxjQUFJLElBQUlBLGNBQUksQ0FBQyxRQUFRLEtBQUssWUFBWTtNQUN0RCxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxFQUFFO01BQzVDLFFBQVEsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDN0QsWUFBWSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzdCLFlBQVksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUMzRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM1QixTQUFTO01BQ1QsUUFBUSxPQUFPLENBQUMsQ0FBQztNQUNqQixLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDM0MsQ0FBQyxDQUFDO01BQ0YsTUFBTSxDQUFDLGNBQWMsVUFBVSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztNQUM5RCxpQkFBaUIsb0JBQW9CLG9CQUFvQixtQkFBbUIsb0JBQW9CLG9CQUFvQix1QkFBdUIsdUJBQXVCLHNCQUFzQixzQkFBc0Isb0JBQW9CLG9CQUFvQixtQkFBbUIsa0JBQWtCLGlCQUFpQixrQkFBa0Isa0JBQWtCLEtBQUssQ0FBQyxDQUFDO01BQ3ZWLElBQUksVUFBVSxHQUFHTCxRQUFxQixDQUFDO01BQ3ZDLElBQUksU0FBUyxHQUFHLFVBQVUsSUFBSSxFQUFFLEtBQUssRUFBRTtNQUN2QyxJQUFJLE9BQU8sUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQzNDLENBQUMsQ0FBQztNQUNGLGtCQUFrQixTQUFTLENBQUMsTUFBTSxFQUFFO01BQ3BDLElBQUksVUFBVSxFQUFFLFVBQVUsSUFBSSxFQUFFO01BQ2hDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO01BQ2hFLFlBQVksUUFBUSxJQUFJLEtBQUssT0FBTyxDQUFDLFFBQVE7TUFDN0MsZ0JBQWdCLElBQUksS0FBSyxPQUFPLENBQUMsV0FBVztNQUM1QyxnQkFBZ0IsSUFBSSxLQUFLLE9BQU8sQ0FBQyxTQUFTO01BQzFDLGdCQUFnQixJQUFJLEtBQUssT0FBTyxDQUFDLFFBQVEsRUFBRTtNQUMzQyxTQUFTO01BQ1QsUUFBUSxRQUFRLElBQUksS0FBSyxPQUFPLENBQUMsTUFBTTtNQUN2QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsUUFBUTtNQUNyQyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsTUFBTTtNQUNuQyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsV0FBVztNQUN4QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsU0FBUztNQUN0QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsUUFBUTtNQUNyQyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsU0FBUztNQUN0QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsV0FBVyxFQUFFO01BQzFDLEtBQUs7TUFDTCxDQUFDLENBQUMsQ0FBQztNQUNILGtCQUFrQixTQUFTLENBQUMsR0FBRyxFQUFFO01BQ2pDLElBQUksVUFBVSxFQUFFLFVBQVUsSUFBSSxFQUFFO01BQ2hDLFFBQVEsUUFBUSxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU07TUFDdkMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLE9BQU87TUFDcEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVM7TUFDdEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFdBQVc7TUFDeEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU07TUFDbkMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFFBQVE7TUFDckMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVMsRUFBRTtNQUN4QyxLQUFLO01BQ0wsQ0FBQyxDQUFDLENBQUM7TUFDSCxpQkFBaUIsU0FBUyxDQUFDLEdBQUcsRUFBRTtNQUNoQyxJQUFJLFVBQVUsRUFBRSxVQUFVLElBQUksRUFBRTtNQUNoQyxRQUFRLFFBQVEsSUFBSSxLQUFLLE9BQU8sQ0FBQyxPQUFPO01BQ3hDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxZQUFZO01BQ3pDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxPQUFPO01BQ3BDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxXQUFXO01BQ3hDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUU7TUFDeEMsS0FBSztNQUNMLElBQUksVUFBVSxFQUFFLFVBQVUsSUFBSSxFQUFFO01BQ2hDLFFBQVEsUUFBUSxJQUFJLEtBQUssT0FBTyxDQUFDLE9BQU87TUFDeEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFlBQVk7TUFDekMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLE9BQU87TUFDcEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVM7TUFDdEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFdBQVc7TUFDeEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVM7TUFDdEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVMsRUFBRTtNQUN4QyxLQUFLO01BQ0wsQ0FBQyxDQUFDLENBQUM7TUFDSCxrQkFBa0IsU0FBUyxDQUFDLEdBQUcsRUFBRTtNQUNqQyxJQUFJLFVBQVUsRUFBRSxVQUFVLElBQUksRUFBRTtNQUNoQyxRQUFRLE9BQU8sSUFBSSxLQUFLLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxZQUFZLENBQUM7TUFDekUsS0FBSztNQUNMLENBQUMsQ0FBQyxDQUFDO01BQ0gsbUJBQW1CLFNBQVMsQ0FBQyxHQUFHLEVBQUU7TUFDbEMsSUFBSSxVQUFVLEVBQUUsVUFBVSxJQUFJLEVBQUU7TUFDaEMsUUFBUSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7TUFDaEUsWUFBWSxPQUFPLElBQUksS0FBSyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksS0FBSyxPQUFPLENBQUMsU0FBUyxJQUFJLElBQUksS0FBSyxPQUFPLENBQUMsV0FBVyxDQUFDO01BQzFHLFNBQVM7TUFDVCxRQUFRLE9BQU8sSUFBSSxLQUFLLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxZQUFZLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUM7TUFDekcsS0FBSztNQUNMLENBQUMsQ0FBQyxDQUFDO01BQ0gsb0JBQW9CLFNBQVMsQ0FBQyxHQUFHLEVBQUU7TUFDbkMsSUFBSSxVQUFVLEVBQUUsVUFBVSxJQUFJLEVBQUU7TUFDaEMsUUFBUSxPQUFPLElBQUksS0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDO01BQ3hDLEtBQUs7TUFDTCxJQUFJLFVBQVUsRUFBRSxVQUFVLElBQUksRUFBRTtNQUNoQyxRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsRUFBRTtNQUNoRSxZQUFZLE9BQU8sSUFBSSxLQUFLLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUM7TUFDMUcsU0FBUztNQUNULFFBQVEsT0FBTyxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQztNQUNwRSxLQUFLO01BQ0wsSUFBSSxhQUFhLEVBQUUsVUFBVSxJQUFJLEVBQUU7TUFDbkMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ3pELEtBQUs7TUFDTCxDQUFDLENBQUMsQ0FBQztNQUNILG9CQUFvQixTQUFTLENBQUMsR0FBRyxFQUFFO01BQ25DLElBQUksVUFBVSxFQUFFLFVBQVUsSUFBSSxFQUFFO01BQ2hDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO01BQ2hFLFlBQVksT0FBTyxJQUFJLEtBQUssT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFdBQVcsQ0FBQztNQUN0SSxTQUFTO01BQ1QsUUFBUSxPQUFPLElBQUksS0FBSyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksS0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDO01BQ2xFLEtBQUs7TUFDTCxJQUFJLFVBQVUsRUFBRSxVQUFVLElBQUksRUFBRTtNQUNoQyxRQUFRLE9BQU8sSUFBSSxLQUFLLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxTQUFTLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUM7TUFDdEcsS0FBSztNQUNMLElBQUksYUFBYSxFQUFFLFlBQVk7TUFDL0IsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ3hELEtBQUs7TUFDTCxDQUFDLENBQUMsQ0FBQztNQUNILHNCQUFzQixTQUFTLENBQUMsR0FBRyxFQUFFO01BQ3JDLElBQUksVUFBVSxFQUFFLFVBQVUsSUFBSSxFQUFFO01BQ2hDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO01BQ2hFLFlBQVksT0FBTyxJQUFJLEtBQUssT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQztNQUMxRyxTQUFTO01BQ1QsUUFBUSxRQUFRLElBQUksS0FBSyxPQUFPLENBQUMsT0FBTztNQUN4QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsWUFBWTtNQUN6QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsUUFBUTtNQUNyQyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsV0FBVztNQUN4QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsU0FBUyxFQUFFO01BQ3hDLEtBQUs7TUFDTCxJQUFJLFVBQVUsRUFBRSxVQUFVLElBQUksRUFBRTtNQUNoQyxRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsRUFBRTtNQUNoRSxZQUFZLE9BQU8sSUFBSSxLQUFLLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxLQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUM7TUFDMUcsU0FBUztNQUNULFFBQVEsUUFBUSxJQUFJLEtBQUssT0FBTyxDQUFDLE9BQU87TUFDeEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFdBQVc7TUFDeEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU07TUFDbkMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLE9BQU87TUFDcEMsWUFBWSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVM7TUFDdEMsWUFBWSxJQUFJLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtNQUN0QyxLQUFLO01BQ0wsSUFBSSxhQUFhLEVBQUUsVUFBVSxJQUFJLEVBQUU7TUFDbkMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO01BQzNELEtBQUs7TUFDTCxDQUFDLENBQUMsQ0FBQztNQUNILHNCQUFzQixTQUFTLENBQUMsR0FBRyxFQUFFO01BQ3JDLElBQUksVUFBVSxFQUFFLFVBQVUsSUFBSSxFQUFFO01BQ2hDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO01BQ2hFLFlBQVksT0FBTyxJQUFJLEtBQUssT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQztNQUN0SSxTQUFTO01BQ1QsUUFBUSxRQUFRLElBQUksS0FBSyxPQUFPLENBQUMsTUFBTTtNQUN2QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsTUFBTTtNQUNuQyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsUUFBUTtNQUNyQyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsU0FBUztNQUN0QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsV0FBVyxFQUFFO01BQzFDLEtBQUs7TUFDTCxJQUFJLGFBQWEsRUFBRSxVQUFVLElBQUksRUFBRTtNQUNuQyxRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUM7TUFDaEUsWUFBWSxPQUFPO01BQ25CLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztNQUM1RCxZQUFZLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO01BQ2xDLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDakMsS0FBSztNQUNMLENBQUMsQ0FBQyxDQUFDO01BQ0gsdUJBQXVCLFNBQVMsQ0FBQyxJQUFJLEVBQUU7TUFDdkMsSUFBSSxhQUFhLEVBQUUsWUFBWTtNQUMvQixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUM7TUFDNUQsS0FBSztNQUNMLENBQUMsQ0FBQyxDQUFDO01BQ0gsdUJBQXVCLFNBQVMsQ0FBQyxJQUFJLEVBQUU7TUFDdkMsSUFBSSxhQUFhLEVBQUUsWUFBWTtNQUMvQixRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLFVBQVUsQ0FBQyxlQUFlO01BQzVELFlBQVksTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7TUFDbEMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNqQyxLQUFLO01BQ0wsQ0FBQyxDQUFDLENBQUM7TUFDSCxvQkFBb0IsU0FBUyxDQUFDLEdBQUcsRUFBRTtNQUNuQyxJQUFJLFVBQVUsRUFBRSxVQUFVLElBQUksRUFBRTtNQUNoQyxRQUFRLFFBQVEsSUFBSSxLQUFLLE9BQU8sQ0FBQyxPQUFPO01BQ3hDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxZQUFZO01BQ3pDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxPQUFPO01BQ3BDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxXQUFXLEVBQUU7TUFDMUMsS0FBSztNQUNMLElBQUksVUFBVSxFQUFFLFVBQVUsSUFBSSxFQUFFO01BQ2hDLFFBQVEsT0FBTyxJQUFJLEtBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQztNQUN4QyxLQUFLO01BQ0wsSUFBSSxhQUFhLEVBQUUsVUFBVSxJQUFJLEVBQUU7TUFDbkMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ3pELEtBQUs7TUFDTCxDQUFDLENBQUMsQ0FBQztNQUNILG9CQUFvQixTQUFTLENBQUMsR0FBRyxFQUFFO01BQ25DLElBQUksVUFBVSxFQUFFLFVBQVUsSUFBSSxFQUFFO01BQ2hDLFFBQVEsT0FBTyxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU0sSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQztNQUM3SCxLQUFLO01BQ0wsSUFBSSxhQUFhLEVBQUUsWUFBWTtNQUMvQixRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLFVBQVUsQ0FBQyxZQUFZO01BQ3pELFlBQVksTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7TUFDbEMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNqQyxLQUFLO01BQ0wsQ0FBQyxDQUFDLENBQUM7TUFDSCxtQkFBbUIsU0FBUyxDQUFDLEdBQUcsRUFBRTtNQUNsQyxJQUFJLFVBQVUsRUFBRSxVQUFVLElBQUksRUFBRTtNQUNoQyxRQUFRLFFBQVEsSUFBSSxLQUFLLE9BQU8sQ0FBQyxPQUFPO01BQ3hDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxZQUFZO01BQ3pDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxXQUFXO01BQ3hDLFlBQVksSUFBSSxLQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUU7TUFDeEMsS0FBSztNQUNMLENBQUMsQ0FBQyxDQUFDO01BQ0gsb0JBQW9CLFNBQVMsQ0FBQyxRQUFRLEVBQUU7TUFDeEMsSUFBSSxVQUFVLEVBQUUsVUFBVSxJQUFJLEVBQUU7TUFDaEMsUUFBUSxPQUFPLElBQUksS0FBSyxPQUFPLENBQUMsWUFBWSxDQUFDO01BQzdDLEtBQUs7TUFDTCxJQUFJLFVBQVUsRUFBRSxVQUFVLElBQUksRUFBRTtNQUNoQyxRQUFRLE9BQU8sSUFBSSxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUM7TUFDNUMsS0FBSztNQUNMLENBQUMsQ0FBQyxDQUFDO01BQ0gsb0JBQW9CLFNBQVMsQ0FBQyxXQUFXLEVBQUU7TUFDM0MsSUFBSSxVQUFVLEVBQUUsVUFBVSxJQUFJLEVBQUU7TUFDaEMsUUFBUSxRQUFRLElBQUksS0FBSyxPQUFPLENBQUMsTUFBTTtNQUN2QyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsTUFBTTtNQUNuQyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsUUFBUTtNQUNyQyxZQUFZLElBQUksS0FBSyxPQUFPLENBQUMsU0FBUyxFQUFFO01BQ3hDLEtBQUs7TUFDTCxDQUFDLENBQUMsQ0FBQztNQUNILGlCQUFpQixTQUFTLENBQUMsS0FBSyxDQUFDOzs7TUNsTmpDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO3lCQUM3QyxHQUFHLEtBQUssRUFBRTtNQUMzQixJQUFJTSxVQUFRLEdBQUdOLE1BQW1CLENBQUM7TUFDbkMsSUFBSU8sWUFBVSxHQUFHTixRQUFxQixDQUFDO01BQ3ZDLElBQUksa0JBQWtCLEdBQUcscURBQXFELENBQUM7TUFDL0UsSUFBSSxpQkFBaUIsR0FBRyxVQUFVLEtBQUssRUFBRSxHQUFHLEVBQUU7TUFDOUMsSUFBSSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3JDLElBQUksSUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNO01BQ3hDLFFBQVEsT0FBTyxJQUFJLENBQUM7TUFDcEIsSUFBSSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztNQUN6QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7TUFDM0MsQ0FBQyxDQUFDO01BQ0YsSUFBSSxZQUFZLEdBQUcsVUFBVSxJQUFJLEVBQUU7TUFDbkMsSUFBSSxPQUFPLElBQUksS0FBSyxFQUFFO01BQ3RCLFFBQVEsSUFBSSxLQUFLLEVBQUU7TUFDbkIsUUFBUSxJQUFJLEtBQUssRUFBRTtNQUNuQixRQUFRLElBQUksS0FBSyxFQUFFO01BQ25CLFFBQVEsSUFBSSxLQUFLLEVBQUU7TUFDbkIsUUFBUSxJQUFJLEtBQUssRUFBRTtNQUNuQixRQUFRLElBQUksS0FBSyxFQUFFO01BQ25CLFFBQVEsSUFBSSxLQUFLLEVBQUU7TUFDbkIsUUFBUSxJQUFJLEtBQUssRUFBRTtNQUNuQixRQUFRLElBQUksS0FBSyxHQUFHO01BQ3BCLFFBQVEsSUFBSSxLQUFLLEdBQUc7TUFDcEIsUUFBUSxJQUFJLEtBQUssR0FBRyxDQUFDO01BQ3JCLENBQUMsQ0FBQztNQUNGLElBQUksUUFBUSxHQUFHLFVBQVUsT0FBTyxFQUFFLEtBQUssRUFBRTtNQUN6QyxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQ2pDLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDOUIsSUFBSSxPQUFPLEdBQUcsQ0FBQztNQUNmLENBQUMsQ0FBQztNQUNGLElBQUksS0FBSyxHQUFHLFVBQVUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7TUFDMUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7TUFDakIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3RDLFFBQVEsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNsQyxRQUFRLElBQUksRUFBRSxLQUFLLElBQUksRUFBRTtNQUN6QixZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUM7TUFDdEIsU0FBUztNQUNULEtBQUs7TUFDTCxJQUFJLE9BQU8sR0FBRyxDQUFDO01BQ2YsQ0FBQyxDQUFDO01BQ0YsSUFBSSxTQUFTLElBQUksWUFBWTtNQUM3QixJQUFJLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtNQUM5QixRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO01BQzNCLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRztNQUNyQixZQUFZLE9BQU8sRUFBRSxFQUFFO01BQ3ZCLFlBQVksSUFBSSxFQUFFLElBQUk7TUFDdEIsWUFBWSxHQUFHLEVBQUUsQ0FBQztNQUNsQixTQUFTLENBQUM7TUFDVixLQUFLO01BQ0wsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxZQUFZO01BQ2pELFFBQVEsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDakUsS0FBSyxDQUFDO01BQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxVQUFVLE9BQU8sRUFBRTtNQUM3RCxRQUFRLEtBQUssSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO01BQ3ZFLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxPQUFPLEVBQUU7TUFDckQsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDO01BQzVCLGFBQWE7TUFDYixTQUFTO01BQ1QsUUFBUSxPQUFPLEtBQUssQ0FBQztNQUNyQixLQUFLLENBQUM7TUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsSUFBSSxFQUFFO01BQ25ELFFBQVEsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztNQUN2QyxRQUFRLE9BQU8sUUFBUSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsRUFBRTtNQUNoRyxZQUFZLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUc7TUFDL0IsU0FBUyxDQUFDLENBQUM7TUFDWCxLQUFLLENBQUM7TUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSSxFQUFFLElBQUksRUFBRTtNQUMzRCxRQUFRLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7TUFDckMsWUFBWSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtNQUMzRCxnQkFBZ0IsTUFBTSxRQUFRLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxrQ0FBa0MsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxVQUFVLEVBQUU7TUFDOUosb0JBQW9CLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUc7TUFDdkMsaUJBQWlCLENBQUMsQ0FBQztNQUNuQixhQUFhO01BQ2IsU0FBUztNQUNULEtBQUssQ0FBQztNQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFO01BQzNELFFBQVEsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtNQUNyQyxZQUFZLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO01BQzNELGdCQUFnQixNQUFNLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLDRCQUE0QixHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFdBQVcsRUFBRTtNQUNsSixvQkFBb0IsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztNQUN2QyxpQkFBaUIsQ0FBQyxDQUFDO01BQ25CLGFBQWE7TUFDYixTQUFTO01BQ1QsS0FBSyxDQUFDO01BQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLElBQUksRUFBRTtNQUNoRCxRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO01BQ3hDLEtBQUssQ0FBQztNQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsWUFBWTtNQUNoRCxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLTSxZQUFVLENBQUMsZUFBZTtNQUM1RCxZQUFZLE9BQU87TUFDbkIsUUFBUSxJQUFJLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtNQUN6RCxZQUFZLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDM0QsWUFBWSxRQUFRLEVBQUU7TUFDdEIsZ0JBQWdCLEtBQUssRUFBRSxDQUFDO01BQ3hCLGdCQUFnQixLQUFLLEdBQUc7TUFDeEIsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7TUFDckMsb0JBQW9CLE1BQU07TUFDMUIsZ0JBQWdCLEtBQUssRUFBRTtNQUN2QixvQkFBb0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7TUFDMUUsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7TUFDekMscUJBQXFCO01BQ3JCLGdCQUFnQixLQUFLLEVBQUUsQ0FBQztNQUN4QixnQkFBZ0IsS0FBSyxJQUFJLENBQUM7TUFDMUIsZ0JBQWdCLEtBQUssSUFBSTtNQUN6QixvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztNQUNyQyxvQkFBb0IsTUFBTTtNQUMxQixnQkFBZ0I7TUFDaEIsb0JBQW9CLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO01BQzFDLHlCQUF5QixFQUFFLElBQUksSUFBSSxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUMxRix3QkFBd0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztNQUN6QyxxQkFBcUI7TUFDckIseUJBQXlCO01BQ3pCLHdCQUF3QixNQUFNLElBQUksQ0FBQztNQUNuQyxxQkFBcUI7TUFDckIsYUFBYTtNQUNiLFNBQVM7TUFDVCxLQUFLLENBQUM7TUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVk7TUFDM0MsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO01BQ2pELFlBQVksT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDRCxVQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDckQsU0FBUztNQUNULFFBQVEsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO01BQ3pCLFFBQVEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUMxRyxLQUFLLENBQUM7TUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsR0FBRyxFQUFFO01BQ2pELFFBQVEsSUFBSSxHQUFHLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUNyRCxRQUFRLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztNQUNsRCxLQUFLLENBQUM7TUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFVBQVUsSUFBSSxFQUFFO01BQzlDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO01BQzlCLFlBQVksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ3hCLFlBQVksT0FBTyxJQUFJLENBQUM7TUFDeEIsU0FBUztNQUNULGFBQWE7TUFDYixZQUFZLE9BQU8sS0FBSyxDQUFDO01BQ3pCLFNBQVM7TUFDVCxLQUFLLENBQUM7TUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFlBQVk7TUFDbEQsUUFBUSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDO01BQ25ELFFBQVEsT0FBTyxJQUFJLEVBQUU7TUFDckIsWUFBWSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7TUFDdEMsWUFBWSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQzVELFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtNQUN0RCxnQkFBZ0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztNQUN6RSxnQkFBZ0IsTUFBTTtNQUN0QixhQUFhO01BQ2IsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7TUFDeEQsZ0JBQWdCLElBQUksSUFBSSxLQUFLLEVBQUU7TUFDL0Isb0JBQW9CLElBQUksS0FBSyxHQUFHO01BQ2hDLG9CQUFvQixJQUFJLEtBQUssRUFBRTtNQUMvQixvQkFBb0IsSUFBSSxLQUFLLElBQUk7TUFDakMsb0JBQW9CLElBQUksS0FBSyxJQUFJLEVBQUU7TUFDbkMsb0JBQW9CLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN6RSxvQkFBb0IsTUFBTTtNQUMxQixpQkFBaUI7TUFDakIsZ0JBQWdCLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7TUFDckYsb0JBQW9CLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN6RSxvQkFBb0IsTUFBTTtNQUMxQixpQkFBaUI7TUFDakIsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFO01BQzFDLHFCQUFxQixJQUFJLElBQUksSUFBSSxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUMxRixvQkFBb0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3pFLG9CQUFvQixNQUFNO01BQzFCLGlCQUFpQjtNQUNqQixnQkFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNqQyxhQUFhO01BQ2IsaUJBQWlCO01BQ2pCLGdCQUFnQixNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDckUsZ0JBQWdCLE1BQU07TUFDdEIsYUFBYTtNQUNiLFNBQVM7TUFDVCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUNBLFVBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDbkQsS0FBSyxDQUFDO01BQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFlBQVk7TUFDdkQsUUFBUSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQztNQUM3RCxRQUFRLE9BQU8sSUFBSSxFQUFFO01BQ3JCLFlBQVksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO01BQ3RDLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07TUFDbkQsZ0JBQWdCLE1BQU07TUFDdEIsWUFBWSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsSUFBSSxJQUFJLEtBQUssRUFBRSxLQUFLLFFBQVEsS0FBSyxFQUFFLEVBQUU7TUFDakUsZ0JBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDakMsZ0JBQWdCLFFBQVEsR0FBRyxFQUFFLENBQUM7TUFDOUIsYUFBYTtNQUNiLGlCQUFpQixJQUFJLElBQUksSUFBSSxFQUFFLElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTtNQUNwRCxnQkFBZ0IsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLO01BQ25DLHFCQUFxQixLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztNQUN4RCxxQkFBcUIsT0FBTyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztNQUNsRCxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNqQyxnQkFBZ0IsTUFBTTtNQUN0QixhQUFhO01BQ2IsaUJBQWlCO01BQ2pCLGdCQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ2pDLGdCQUFnQixRQUFRLEdBQUcsSUFBSSxDQUFDO01BQ2hDLGFBQWE7TUFDYixTQUFTO01BQ1QsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDQSxVQUFRLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO01BQ3JELFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQ0EsVUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ2hELEtBQUssQ0FBQztNQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxJQUFJLEVBQUUsS0FBSyxFQUFFO01BQzdELFFBQVEsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7TUFDdEMsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7TUFDL0IsUUFBUSxJQUFJLEtBQUssS0FBSyxTQUFTO01BQy9CLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO01BQ3JDLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDdkMsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUN2QyxRQUFRLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtNQUNoQyxZQUFZLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNuRCxTQUFTO01BQ1QsS0FBSyxDQUFDO01BQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxVQUFVLElBQUksRUFBRSxRQUFRLEVBQUU7TUFDOUQsUUFBUSxJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7TUFDN0IsWUFBWSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztNQUN0QyxTQUFTO01BQ1QsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO01BQ2pELFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQ0EsVUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQzlDLFNBQVM7TUFDVCxhQUFhLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLQyxZQUFVLENBQUMsZUFBZSxFQUFFO01BQ25FLFlBQVksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7TUFDcEMsU0FBUztNQUNULGFBQWEsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFO01BQy9CLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUM3QixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUNELFVBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztNQUNqRCxTQUFTO01BQ1QsYUFBYSxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7TUFDL0IsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQzdCLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQ0EsVUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ2pELFNBQVM7TUFDVCxhQUFhLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtNQUM5QixZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDN0IsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDQSxVQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDL0MsU0FBUztNQUNULGFBQWEsSUFBSSxJQUFJLEtBQUssRUFBRSxFQUFFO01BQzlCLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUM3QixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUNBLFVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUMvQyxTQUFTO01BQ1QsYUFBYSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7TUFDOUIsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQzdCLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQ0EsVUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQzlDLFNBQVM7TUFDVCxhQUFhLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtNQUM5QixZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDN0IsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7TUFDdkMsZ0JBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDakMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQ0EsVUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQy9ELGFBQWE7TUFDYixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUNBLFVBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUNuRCxTQUFTO01BQ1QsYUFBYSxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUU7TUFDL0IsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQzdCLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQ0EsVUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ2pELFNBQVM7TUFDVCxhQUFhLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtNQUM5QixZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDN0IsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDQSxVQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7TUFDbkQsU0FBUztNQUNULGFBQWEsSUFBSSxJQUFJLEtBQUssRUFBRSxFQUFFO01BQzlCLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUM3QixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUNBLFVBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztNQUNqRCxTQUFTO01BQ1QsYUFBYSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7TUFDOUIsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQzdCLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQ0EsVUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ2pELFNBQVM7TUFDVCxhQUFhLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtNQUM5QixZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDN0IsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDQSxVQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDaEQsU0FBUztNQUNULGFBQWEsSUFBSSxJQUFJLEtBQUssRUFBRSxFQUFFO01BQzlCLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUM3QixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUNBLFVBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUNoRCxTQUFTO01BQ1QsYUFBYTtNQUNiLFlBQVksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO01BQy9CLFNBQVM7TUFDVCxLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sU0FBUyxDQUFDO01BQ3JCLENBQUMsRUFBRSxDQUFDLENBQUM7eUJBQ1ksR0FBRyxTQUFTOzs7Ozs7O01DdFI3QixNQUFNLENBQUMsY0FBYyxVQUFVLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO01BQzlELHlCQUF5QixrQ0FBa0MsMEJBQTBCLGlDQUFpQyw0QkFBNEIsNEJBQTRCLDJCQUEyQiw2QkFBNkIsd0JBQXdCLDZCQUE2Qix1QkFBdUIsaUJBQWlCLEtBQUssQ0FBQyxDQUFDO01BQzFVLGlCQUFpQixVQUFVLElBQUksRUFBRSxFQUFFLE9BQU8sVUFBVSxHQUFHLEVBQUU7TUFDekQsSUFBSSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztNQUNwQyxDQUFDLENBQUMsRUFBRSxDQUFDO01BQ0wsdUJBQXVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7TUFDcEQsNkJBQTZCLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQztNQUNoRSx3QkFBd0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztNQUN0RCw2QkFBNkIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO01BQ2hFLDJCQUEyQixPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7TUFDNUQsNEJBQTRCLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztNQUM5RCw0QkFBNEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO01BQzlELGlDQUFpQyxPQUFPLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUM7TUFDeEUsMEJBQTBCLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7TUFDMUQsa0NBQWtDLE9BQU8sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztNQUMxRSx5QkFBeUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7Ozs7OztNQ2Z2RCxNQUFNLENBQUMsY0FBYyxVQUFVLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO01BQzlELGtCQUFrQixrQkFBa0IsbUJBQW1CLGdCQUFnQixnQkFBZ0IsaUJBQWlCLGdCQUFnQixxQkFBcUIsZ0JBQWdCLGVBQWUsS0FBSyxDQUFDLENBQUM7TUFDbkwsSUFBSSxNQUFNLEdBQUcsVUFBVSxJQUFJLEVBQUUsRUFBRSxPQUFPLFVBQVUsR0FBRyxFQUFFO01BQ3JELElBQUksT0FBTyxHQUFHLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxVQUFVLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztNQUMxRixDQUFDLENBQUMsRUFBRSxDQUFDO01BQ0wsZUFBZSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7TUFDbEMsZ0JBQWdCLEtBQUssQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQ2pELHFCQUFxQixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDdEMsZ0JBQWdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUNqQyxpQkFBaUIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ25DLGdCQUFnQixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDakMsZ0JBQWdCLFVBQVUsR0FBRyxFQUFFLEVBQUUsT0FBTyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUMsRUFBRSxDQUFDO01BQ25FLG1CQUFtQixNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDcEMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztNQUM1QixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO01BQzFCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO01BQzlDLGtCQUFrQixVQUFVLEdBQUcsRUFBRSxFQUFFLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFLLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7TUFDdkcsa0JBQWtCLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUNsQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNqQixRQUFRLE9BQU8sSUFBSSxDQUFDO01BQ3BCLEtBQUs7TUFDTCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO01BQ2xFLFFBQVEsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzlCLFFBQVEsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzlCLFFBQVEsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7TUFDdkIsUUFBUSxJQUFJLFFBQVEsQ0FBQztNQUNyQixRQUFRLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO01BQ3pCLFFBQVEsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO01BQzFCLFlBQVksUUFBUSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7TUFDaEMsWUFBWSxJQUFJLFFBQVEsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO01BQ3ZDLGdCQUFnQixPQUFPLEtBQUssQ0FBQztNQUM3QixhQUFhO01BQ2IsWUFBWSxLQUFLLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHO01BQzNDLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDbEQsb0JBQW9CLE9BQU8sS0FBSyxDQUFDO01BQ2pDLGlCQUFpQjtNQUNqQixhQUFhO01BQ2IsWUFBWSxPQUFPLElBQUksQ0FBQztNQUN4QixTQUFTO01BQ1QsUUFBUSxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7TUFDM0IsWUFBWSxPQUFPLEtBQUssQ0FBQztNQUN6QixTQUFTO01BQ1QsUUFBUSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDOUIsUUFBUSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUMvQixRQUFRLElBQUksUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7TUFDNUMsWUFBWSxPQUFPLEtBQUssQ0FBQztNQUN6QixTQUFTO01BQ1QsUUFBUSxLQUFLLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHO01BQ3ZDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQzNDLGdCQUFnQixPQUFPLEtBQUssQ0FBQztNQUM3QixhQUFhO01BQ2IsU0FBUztNQUNULFFBQVEsS0FBSyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRztNQUN2QyxZQUFZLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDMUIsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7TUFDbEQsZ0JBQWdCLE9BQU8sS0FBSyxDQUFDO01BQzdCLGFBQWE7TUFDYixTQUFTO01BQ1QsUUFBUSxPQUFPLElBQUksQ0FBQztNQUNwQixLQUFLO01BQ0wsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUM5QixDQUFDOzs7O01DN0RELE1BQU0sQ0FBQyxjQUFjLFVBQVUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7TUFDOUQsOEJBQThCLCtCQUErQiw0QkFBNEIsNEJBQTRCLCtCQUErQix3QkFBd0Isd0JBQXdCLEtBQUssQ0FBQyxDQUFDO01BQzNNLElBQUksT0FBTyxHQUFHTixLQUFrQixDQUFDO01BQ2pDLElBQUksT0FBTyxHQUFHQyxLQUFrQixDQUFDO01BQ2pDLElBQUksZUFBZSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7TUFDaEMsSUFBSSxPQUFPLEdBQUcsVUFBVSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7TUFDM0Usd0JBQXdCLFVBQVUsTUFBTSxFQUFFO01BQzFDLElBQUksT0FBTyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ3ZDLENBQUMsQ0FBQztNQUNGLHdCQUF3QixVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUU7TUFDakQsSUFBSSxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztNQUN2QyxDQUFDLENBQUM7TUFDRiwrQkFBK0IsVUFBVSxJQUFJLEVBQUU7TUFDL0MsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7TUFDbkIsSUFBSSxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDdkMsUUFBUSxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7TUFDeEIsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssRUFBRTtNQUNqRCxZQUFZLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRztNQUM3QixnQkFBZ0IsSUFBSSxFQUFFLEVBQUU7TUFDeEIsYUFBYSxDQUFDO01BQ2QsWUFBWSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO01BQ2pELFlBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN0RCxZQUFZLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDbkQsZ0JBQWdCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7TUFDdkQsYUFBYTtNQUNiLFlBQVksSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztNQUMvQyxZQUFZLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdkUsWUFBWSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7TUFDNUIsWUFBWSxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFO01BQy9DLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUM5QixvQkFBb0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO01BQzVDLG9CQUFvQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQy9ELGlCQUFpQjtNQUNqQixxQkFBcUI7TUFDckIsb0JBQW9CLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRztNQUMvQix3QkFBd0IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO01BQ3JDLHdCQUF3QixJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ3hELHFCQUFxQixDQUFDO01BQ3RCLGlCQUFpQjtNQUNqQixnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7TUFDcEIsYUFBYSxDQUFDLENBQUM7TUFDZixZQUFZLElBQUksQ0FBQyxHQUFHLE9BQU8sRUFBRTtNQUM3QixnQkFBZ0IsT0FBTyxHQUFHLENBQUMsQ0FBQztNQUM1QixhQUFhO01BQ2IsaUJBQWlCO01BQ2pCLGdCQUFnQixPQUFPLEVBQUUsQ0FBQztNQUMxQixhQUFhO01BQ2IsU0FBUyxDQUFDLENBQUM7TUFDWCxRQUFRLE9BQU8sS0FBSyxDQUFDO01BQ3JCLEtBQUs7TUFDTCxTQUFTLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUMzQyxRQUFRLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztNQUN4QixRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSyxFQUFFLEdBQUcsRUFBRTtNQUNwRCxZQUFZLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRztNQUM3QixnQkFBZ0IsSUFBSSxFQUFFLEVBQUU7TUFDeEIsYUFBYSxDQUFDO01BQ2QsWUFBWSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztNQUNyQyxZQUFZLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzFDLFlBQVksSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQzdDLGdCQUFnQixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7TUFDakQsYUFBYTtNQUNiLFlBQVksSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztNQUMvQyxZQUFZLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUNqRSxZQUFZLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQztNQUM1QixZQUFZLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUU7TUFDL0MsZ0JBQWdCLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQzlCLG9CQUFvQixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7TUFDNUMsb0JBQW9CLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDL0QsaUJBQWlCO01BQ2pCLHFCQUFxQjtNQUNyQixvQkFBb0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHO01BQy9CLHdCQUF3QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7TUFDckMsd0JBQXdCLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7TUFDeEQscUJBQXFCLENBQUM7TUFDdEIsaUJBQWlCO01BQ2pCLGdCQUFnQixDQUFDLEVBQUUsQ0FBQztNQUNwQixhQUFhLENBQUMsQ0FBQztNQUNmLFlBQVksSUFBSSxDQUFDLEdBQUcsT0FBTyxFQUFFO01BQzdCLGdCQUFnQixPQUFPLEdBQUcsQ0FBQyxDQUFDO01BQzVCLGFBQWE7TUFDYixpQkFBaUI7TUFDakIsZ0JBQWdCLE9BQU8sRUFBRSxDQUFDO01BQzFCLGFBQWE7TUFDYixTQUFTLENBQUMsQ0FBQztNQUNYLFFBQVEsT0FBTyxLQUFLLENBQUM7TUFDckIsS0FBSztNQUNMLElBQUksSUFBSSxPQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDOUMsUUFBUSxPQUFPLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDeEQsS0FBSztNQUNMLElBQUksT0FBTyxLQUFLLENBQUM7TUFDakIsQ0FBQyxDQUFDO01BQ0YsNEJBQTRCLFVBQVUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO01BQ3RFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRTtNQUNoQyxRQUFRLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7TUFDekMsUUFBUSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7TUFDbkUsS0FBSyxDQUFDLENBQUM7TUFDUCxDQUFDLENBQUM7TUFDRiw0QkFBNEIsVUFBVSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtNQUMvRCxJQUFJLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztNQUN0QixJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtNQUN0QixRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDN0MsWUFBWSxRQUFRLEdBQUcsRUFBRSxDQUFDO01BQzFCLFNBQVM7TUFDVCxLQUFLO01BQ0wsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUM7TUFDM0MsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFO01BQ2hDLFFBQVEsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztNQUN6QyxRQUFRLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztNQUNwRCxLQUFLLENBQUMsQ0FBQztNQUNQLElBQUksT0FBTyxRQUFRLENBQUM7TUFDcEIsQ0FBQyxDQUFDO01BQ0YsK0JBQStCLFVBQVUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7TUFDbEUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFO01BQ2hDLFFBQVEsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQztNQUN6QixRQUFRLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUN6QyxLQUFLLENBQUMsQ0FBQztNQUNQLENBQUMsQ0FBQztNQUNGLDhCQUE4QixVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtNQUN4RSxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsRUFBRTtNQUNyQyxRQUFRLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7TUFDekIsUUFBUSxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDdEQsS0FBSyxDQUFDLENBQUM7TUFDUCxDQUFDOzs7TUMxSEQsSUFBSSxTQUFTLEdBQUcsQ0FBQ0ksY0FBSSxJQUFJQSxjQUFJLENBQUMsU0FBUyxLQUFLLENBQUMsWUFBWTtNQUN6RCxJQUFJLElBQUksYUFBYSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUN4QyxRQUFRLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztNQUM3QyxhQUFhLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7TUFDeEYsWUFBWSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7TUFDdkYsUUFBUSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDbkMsS0FBSyxDQUFDO01BQ04sSUFBSSxPQUFPLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUMzQixRQUFRLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDNUIsUUFBUSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7TUFDL0MsUUFBUSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQzdGLEtBQUssQ0FBQztNQUNOLENBQUMsR0FBRyxDQUFDO01BQ0wsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFPLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7bUJBQ2hELEdBQUcsS0FBSyxFQUFFO01BQ3hCLElBQUksV0FBVyxHQUFHTCxTQUFzQixDQUFDO01BQ3pDLElBQUksUUFBUSxHQUFHQyxNQUFtQixDQUFDO01BQ25DLElBQUksVUFBVSxHQUFHQyxRQUFxQixDQUFDO01BQ3ZDLElBQUksWUFBWSxHQUFHQyxVQUF1QixDQUFDO01BQzNDLElBQUksTUFBTSxJQUFJLFVBQVUsTUFBTSxFQUFFO01BQ2hDLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztNQUM5QixJQUFJLFNBQVMsTUFBTSxHQUFHO01BQ3RCLFFBQVEsT0FBTyxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQztNQUN4RSxLQUFLO01BQ0wsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxZQUFZO01BQ3pDLFFBQVEsSUFBSSxJQUFJLENBQUM7TUFDakIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHO01BQ3BCLFlBQVksUUFBUSxFQUFFLEVBQUU7TUFDeEIsU0FBUyxDQUFDO01BQ1YsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDeEMsWUFBWSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDeEIsWUFBWSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ25ELFNBQVM7TUFDVCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztNQUM5QixRQUFRLE9BQU8sSUFBSSxDQUFDO01BQ3BCLEtBQUssQ0FBQztNQUNOLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxNQUFNLEVBQUUsSUFBSSxFQUFFO01BQ3RELFFBQVEsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO01BQzVCLFlBQVksTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7TUFDaEMsU0FBUztNQUNULEtBQUssQ0FBQztNQUNOLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsVUFBVSxJQUFJLEVBQUU7TUFDakQsUUFBUSxRQUFRLElBQUk7TUFDcEIsWUFBWSxLQUFLLFFBQVEsQ0FBQyxTQUFTLENBQUM7TUFDcEMsWUFBWSxLQUFLLFFBQVEsQ0FBQyxXQUFXO01BQ3JDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7TUFDeEUsb0JBQW9CLElBQUksSUFBSSxLQUFLLFFBQVEsQ0FBQyxTQUFTLEVBQUU7TUFDckQsd0JBQXdCLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7TUFDekQscUJBQXFCO01BQ3JCLHlCQUF5QjtNQUN6Qix3QkFBd0IsT0FBTyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztNQUN4RCxxQkFBcUI7TUFDckIsaUJBQWlCO01BQ2pCLGdCQUFnQixPQUFPLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO01BQ3hELFlBQVksS0FBSyxRQUFRLENBQUMsT0FBTztNQUNqQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7TUFDOUMsWUFBWSxLQUFLLFFBQVEsQ0FBQyxTQUFTO01BQ25DLGdCQUFnQixPQUFPLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO01BQ2xELFlBQVksS0FBSyxRQUFRLENBQUMsT0FBTztNQUNqQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztNQUNwRCxZQUFZLEtBQUssUUFBUSxDQUFDLFlBQVk7TUFDdEMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7TUFDcEQsWUFBWSxLQUFLLFFBQVEsQ0FBQyxNQUFNO01BQ2hDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO01BQy9DLFNBQVM7TUFDVCxLQUFLLENBQUM7TUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBWSxHQUFHLFVBQVUsR0FBRyxFQUFFO01BQ25ELFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3JDLEtBQUssQ0FBQztNQUNOLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEdBQUcsWUFBWTtNQUNuRCxRQUFRLElBQUksSUFBSSxHQUFHO01BQ25CLFlBQVksSUFBSSxFQUFFLFlBQVk7TUFDOUIsWUFBWSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO01BQ25DLFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDO01BQ3BGLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYztNQUNoQyxZQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO01BQ3JDLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ3BCLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO01BQ2xFLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsV0FBVyxFQUFFO01BQzFELGdCQUFnQixNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztNQUN0QyxhQUFhO01BQ2IsaUJBQWlCO01BQ2pCLGdCQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUN6QyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQzVCLGFBQWE7TUFDYixTQUFTO01BQ1QsYUFBYSxJQUFJLGtCQUFrQixFQUFFO01BQ3JDLFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDMUMsU0FBUztNQUNULFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsV0FBVyxFQUFFO01BQ3RELFlBQVksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ3hCLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsT0FBTyxFQUFFO01BQ3RELGdCQUFnQixNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztNQUN0QyxhQUFhO01BQ2IsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUM7TUFDcEUsWUFBWSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7TUFDcEMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNoRCxnQkFBZ0IsV0FBVyxHQUFHLElBQUksQ0FBQztNQUNuQyxhQUFhO01BQ2IsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztNQUN6QyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztNQUNuRSxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN4RCxZQUFZLElBQUksV0FBVyxFQUFFO01BQzdCLGdCQUFnQixLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztNQUN4QyxhQUFhO01BQ2IsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztNQUNyQyxTQUFTO01BQ1QsYUFBYTtNQUNiLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDL0QsU0FBUztNQUNULFFBQVEsT0FBTyxJQUFJLENBQUM7TUFDcEIsS0FBSyxDQUFDO01BQ04sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFtQixHQUFHLFlBQVk7TUFDdkQsUUFBUSxJQUFJLElBQUksR0FBRztNQUNuQixZQUFZLElBQUksRUFBRSxnQkFBZ0I7TUFDbEMsU0FBUyxDQUFDO01BQ1YsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztNQUNuQyxRQUFRLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7TUFDdkMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7TUFDaEMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDcEIsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUMzRCxRQUFRLE9BQU8sSUFBSSxDQUFDO01BQ3BCLEtBQUssQ0FBQztNQUNOLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsR0FBRyxZQUFZO01BQ3pELFFBQVEsSUFBSSxJQUFJLEdBQUc7TUFDbkIsWUFBWSxJQUFJLEVBQUUsa0JBQWtCO01BQ3BDLFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7TUFDbkMsUUFBUSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO01BQ3ZDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO01BQ2hDLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ3BCLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsU0FBUyxFQUFFO01BQ3BELFlBQVksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDMUQsU0FBUztNQUNULGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsV0FBVyxFQUFFO01BQzNELFlBQVksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDMUQsU0FBUztNQUNULFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDM0QsUUFBUSxPQUFPLElBQUksQ0FBQztNQUNwQixLQUFLLENBQUM7TUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMseUJBQXlCLEdBQUcsWUFBWTtNQUM3RCxRQUFRLElBQUksSUFBSSxHQUFHO01BQ25CLFlBQVksSUFBSSxFQUFFLHNCQUFzQjtNQUN4QyxTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztNQUM5RCxRQUFRLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztNQUMxQyxRQUFRLElBQUksQ0FBQyxLQUFLO01BQ2xCLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLFNBQVM7TUFDbEQsa0JBQWtCLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtNQUMzQyxrQkFBa0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7TUFDM0MsUUFBUSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztNQUNwQyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ2pDLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ3BCLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDM0QsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ2pGLFFBQVEsWUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQ3pGLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDdkMsUUFBUSxPQUFPLElBQUksQ0FBQztNQUNwQixLQUFLLENBQUM7TUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEdBQUcsWUFBWTtNQUNyRCxRQUFRLElBQUksSUFBSSxHQUFHO01BQ25CLFlBQVksSUFBSSxFQUFFLGNBQWM7TUFDaEMsWUFBWSxRQUFRLEVBQUUsRUFBRTtNQUN4QixTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNwQixRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7TUFDekQsUUFBUSxPQUFPLElBQUksQ0FBQztNQUNwQixLQUFLLENBQUM7TUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMseUJBQXlCLEdBQUcsWUFBWTtNQUM3RCxRQUFRLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztNQUN2QixRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsTUFBTSxFQUFFO01BQ2hHLFlBQVksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUN4RCxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLFdBQVcsRUFBRTtNQUMxRCxnQkFBZ0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQzVCLGdCQUFnQixNQUFNO01BQ3RCLGFBQWE7TUFDYixZQUFZLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUN4QixTQUFTO01BQ1QsUUFBUSxPQUFPLEtBQUssQ0FBQztNQUNyQixLQUFLLENBQUM7TUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEdBQUcsWUFBWTtNQUN0RCxRQUFRLElBQUksSUFBSSxHQUFHO01BQ25CLFlBQVksSUFBSSxFQUFFLGVBQWU7TUFDakMsWUFBWSxVQUFVLEVBQUUsRUFBRTtNQUMxQixTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNwQixRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7TUFDdkQsUUFBUSxPQUFPLElBQUksQ0FBQztNQUNwQixLQUFLLENBQUM7TUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMscUJBQXFCLEdBQUcsWUFBWTtNQUN6RCxRQUFRLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztNQUN2QixRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsTUFBTSxFQUFFO01BQzlGLFlBQVksSUFBSSxJQUFJLEdBQUc7TUFDdkIsZ0JBQWdCLElBQUksRUFBRSx1QkFBdUI7TUFDN0MsZ0JBQWdCLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO01BQ3BELGFBQWEsQ0FBQztNQUNkLFlBQVksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUM3QixZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLFFBQVEsRUFBRTtNQUN2RCxnQkFBZ0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQzVCLGdCQUFnQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUM3RCxhQUFhO01BQ2IsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxTQUFTLEVBQUU7TUFDeEQsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUM1QixnQkFBZ0IsTUFBTTtNQUN0QixhQUFhO01BQ2IsWUFBWSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDeEIsU0FBUztNQUNULFFBQVEsT0FBTyxLQUFLLENBQUM7TUFDckIsS0FBSyxDQUFDO01BQ04sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFlBQVk7TUFDcEQsUUFBUSxJQUFJLElBQUksR0FBRztNQUNuQixZQUFZLElBQUksRUFBRSxhQUFhO01BQy9CLFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ3BCLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDM0QsUUFBUSxPQUFPLElBQUksQ0FBQztNQUNwQixLQUFLLENBQUM7TUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMscUJBQXFCLEdBQUcsWUFBWTtNQUN6RCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNwQixRQUFRLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7TUFDakUsUUFBUSxJQUFJLElBQUksR0FBRztNQUNuQixZQUFZLElBQUksRUFBRSxrQkFBa0I7TUFDcEMsWUFBWSxLQUFLLEVBQUUsS0FBSztNQUN4QixTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDakMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDcEIsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUMzRCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNwQixRQUFRLE9BQU8sSUFBSSxDQUFDO01BQ3BCLEtBQUssQ0FBQztNQUNOLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLE1BQU0sRUFBRTtNQUM5RCxRQUFRLElBQUksSUFBSSxHQUFHO01BQ25CLFlBQVksSUFBSSxFQUFFLGlCQUFpQjtNQUNuQyxZQUFZLEtBQUssRUFBRSxFQUFFO01BQ3JCLFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7TUFDbkMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7TUFDaEMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDcEIsUUFBUSxJQUFJLEVBQUUsT0FBTyxJQUFJLEVBQUU7TUFDM0IsWUFBWSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtNQUNuQyxnQkFBZ0IsS0FBSyxRQUFRLENBQUMsUUFBUTtNQUN0QyxvQkFBb0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ2hDLG9CQUFvQixNQUFNO01BQzFCLGdCQUFnQixLQUFLLFFBQVEsQ0FBQyxPQUFPO01BQ3JDLG9CQUFvQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztNQUMxQyxvQkFBb0IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztNQUNuRCxvQkFBb0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ2hDLG9CQUFvQixNQUFNO01BQzFCLGdCQUFnQixLQUFLLFFBQVEsQ0FBQyxNQUFNO01BQ3BDLG9CQUFvQixNQUFNLElBQUksQ0FBQztNQUMvQixnQkFBZ0IsS0FBSyxRQUFRLENBQUMsU0FBUztNQUN2QyxvQkFBb0IsTUFBTSxJQUFJLENBQUM7TUFDL0IsZ0JBQWdCO01BQ2hCLG9CQUFvQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUNyRSxhQUFhO01BQ2IsU0FBUztNQUNULFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ3BCLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDN0QsUUFBUSxPQUFPLElBQUksQ0FBQztNQUNwQixLQUFLLENBQUM7TUFDTixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEdBQUcsVUFBVSxNQUFNLEVBQUU7TUFDOUQsUUFBUSxJQUFJLElBQUksR0FBRztNQUNuQixZQUFZLElBQUksRUFBRSxpQkFBaUI7TUFDbkMsU0FBUyxDQUFDO01BQ1YsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDcEIsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztNQUNuQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztNQUNoQyxRQUFRLElBQUksS0FBSyxHQUFHLEtBQUssRUFBRSxRQUFRLEdBQUcsS0FBSyxDQUFDO01BQzVDLFFBQVEsSUFBSSxFQUFFLE9BQU8sSUFBSSxFQUFFO01BQzNCLFlBQVksUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUk7TUFDbkMsZ0JBQWdCLEtBQUssUUFBUSxDQUFDLFFBQVE7TUFDdEMsb0JBQW9CLFFBQVEsR0FBRyxJQUFJLENBQUM7TUFDcEMsb0JBQW9CLEtBQUssR0FBRyxJQUFJLENBQUM7TUFDakMsb0JBQW9CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNoQyxvQkFBb0IsTUFBTTtNQUMxQixnQkFBZ0IsS0FBSyxRQUFRLENBQUMsV0FBVztNQUN6QyxvQkFBb0IsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7TUFDaEQsd0JBQXdCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUM5QyxxQkFBcUI7TUFDckIsb0JBQW9CLE1BQU0sSUFBSSxDQUFDO01BQy9CLGdCQUFnQixLQUFLLFFBQVEsQ0FBQyxRQUFRO01BQ3RDLG9CQUFvQixNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztNQUMxQyxnQkFBZ0IsS0FBSyxRQUFRLENBQUMsTUFBTTtNQUNwQyxvQkFBb0IsTUFBTSxJQUFJLENBQUM7TUFDL0IsZ0JBQWdCO01BQ2hCLG9CQUFvQixJQUFJLENBQUMsS0FBSyxFQUFFO01BQ2hDLHdCQUF3QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNyRSxxQkFBcUI7TUFDckIseUJBQXlCO01BQ3pCLHdCQUF3QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNuRSxxQkFBcUI7TUFDckIsYUFBYTtNQUNiLFNBQVM7TUFDVCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNwQixRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQzdELFFBQVEsT0FBTyxJQUFJLENBQUM7TUFDcEIsS0FBSyxDQUFDO01BQ04sSUFBSSxPQUFPLE1BQU0sQ0FBQztNQUNsQixDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7bUJBQ1osR0FBRyxNQUFNOzs7O01DNVN2QixNQUFNLENBQUMsY0FBYyxDQUFDLEdBQU8sRUFBRSxZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDaEQsR0FBRyxLQUFLLEVBQUU7TUFDeEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQzVCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUM1QixTQUFTLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO01BQ2hDLElBQUksSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7TUFDbkMsUUFBUSxPQUFPLEdBQUcsS0FBSyxDQUFDO01BQ3hCLFFBQVEsS0FBSyxHQUFHLENBQUMsQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztNQUNsQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO01BQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztNQUMxQyxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztNQUM3QixJQUFJLElBQUksT0FBTyxFQUFFO01BQ2pCLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUM3QixRQUFRLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtNQUN2QixZQUFZLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztNQUNuQyxTQUFTO01BQ1QsS0FBSztNQUNMLENBQUM7Z0JBQ2EsR0FBRyxNQUFNLENBQUM7TUFDeEIsU0FBUyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtNQUMzQixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO01BQ25CLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7TUFDdkIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDO01BQzVCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQztNQUM1QixDQUFDO01BQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLEtBQUssRUFBRTtNQUNyRCxJQUFJLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDL0IsUUFBUSxPQUFPO01BQ2YsS0FBSztNQUNMLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDdEIsUUFBUSxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO01BQ25DLFlBQVksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdkMsU0FBUztNQUNULFFBQVEsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUMzQyxLQUFLO01BQ0wsSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUN0QixRQUFRLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDM0MsS0FBSztNQUNMLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQztNQUM3QixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO01BQy9CLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO01BQ3JCLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDbkMsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7TUFDeEIsQ0FBQyxDQUFDO01BQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxPQUFPLEVBQUU7TUFDN0MsSUFBSSxJQUFJLEtBQUssQ0FBQztNQUNkLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDO01BQy9DLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztNQUN6QixJQUFJLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztNQUN4QyxJQUFJLEtBQUssSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO01BQzFELFFBQVEsSUFBSSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdEQsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ25DLFFBQVEsSUFBSSxDQUFDLEtBQUssRUFBRTtNQUNwQixZQUFZLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO01BQzVCLFNBQVM7TUFDVCxhQUFhO01BQ2IsWUFBWSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzdCLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztNQUM3QixTQUFTO01BQ1QsUUFBUSxLQUFLLEdBQUcsQ0FBQyxDQUFDO01BQ2xCLFFBQVEsSUFBSSxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUU7TUFDM0IsWUFBWSxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQ3hDLFNBQVM7TUFDVCxLQUFLO01BQ0wsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztNQUN4QixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7TUFDbEMsQ0FBQyxDQUFDO01BQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLEVBQUU7TUFDdEMsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN0QyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7TUFDaEIsUUFBUSxPQUFPO01BQ2YsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ2pDLElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDO01BQ3ZCLENBQUMsQ0FBQztNQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRyxFQUFFLEtBQUssRUFBRTtNQUM3QyxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3RDLElBQUksSUFBSSxLQUFLLEVBQUU7TUFDZixRQUFRLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO01BQzVCLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3JDLFFBQVEsT0FBTyxJQUFJLENBQUM7TUFDcEIsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQztNQUMzRCxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUNyQixRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO01BQ25DLFFBQVEsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDbkMsS0FBSztNQUNMLFNBQVM7TUFDVCxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO01BQzVCLEtBQUs7TUFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO01BQ3hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ2hCLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7TUFDaEMsUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7TUFDckIsS0FBSztNQUNMLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsQ0FBQyxDQUFDO01BQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsWUFBWTtNQUNyQyxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDNUIsSUFBSSxJQUFJLEtBQUssRUFBRTtNQUNmLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ2hDLFlBQVksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzdDLFlBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUM7TUFDM0MsU0FBUztNQUNULGFBQWE7TUFDYixZQUFZLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO01BQ3BDLFlBQVksSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7TUFDcEMsU0FBUztNQUNULFFBQVEsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUM7TUFDaEQsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDdkMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7TUFDcEIsUUFBUSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDeEMsS0FBSztNQUNMLENBQUMsQ0FBQztNQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRyxFQUFFO01BQ3ZDLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDbEMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztNQUNuQyxDQUFDLENBQUM7TUFDRixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUcsRUFBRTtNQUN0QyxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDakMsQ0FBQyxDQUFDO01BQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHLEVBQUU7TUFDekMsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN0QyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7TUFDaEIsUUFBUSxPQUFPO01BQ2YsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ25DLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ3RDLFFBQVEsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUMzQyxRQUFRLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDM0MsS0FBSztNQUNMLFNBQVMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDM0IsUUFBUSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDO01BQ3hDLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDbkMsS0FBSztNQUNMLFNBQVMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDM0IsUUFBUSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDO01BQ3hDLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDbkMsS0FBSztNQUNMLFNBQVM7TUFDVCxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7TUFDOUMsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ2hCLElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDO01BQ3ZCLENBQUMsQ0FBQztNQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFlBQVk7TUFDckMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO01BQzFDLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7TUFDbEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO01BQ3pCLENBQUMsQ0FBQztNQUNGLFNBQVMsYUFBYSxDQUFDLFdBQVcsRUFBRTtNQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO01BQzdCLENBQUM7TUFDRCxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxZQUFZO01BQ3ZELElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsQ0FBQyxDQUFDO01BQ0YsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBWTtNQUMzQyxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDekIsSUFBSSxJQUFJLEdBQUcsRUFBRTtNQUNiLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDaEMsUUFBUSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO01BQzVELEtBQUs7TUFDTCxTQUFTO01BQ1QsUUFBUSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7TUFDaEQsS0FBSztNQUNMLENBQUMsQ0FBQztNQUNGLFNBQVMsV0FBVyxDQUFDLFdBQVcsRUFBRTtNQUNsQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO01BQzdCLENBQUM7TUFDRCxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxZQUFZO01BQ3JELElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsQ0FBQyxDQUFDO01BQ0YsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBWTtNQUN6QyxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDekIsSUFBSSxJQUFJLEdBQUcsRUFBRTtNQUNiLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDaEMsUUFBUSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQy9DLEtBQUs7TUFDTCxTQUFTO01BQ1QsUUFBUSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7TUFDaEQsS0FBSztNQUNMLENBQUMsQ0FBQztNQUNGLFNBQVMsYUFBYSxDQUFDLFdBQVcsRUFBRTtNQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO01BQzdCLENBQUM7TUFDRCxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxZQUFZO01BQ3ZELElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsQ0FBQyxDQUFDO01BQ0YsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsWUFBWTtNQUMzQyxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDekIsSUFBSSxJQUFJLEdBQUcsRUFBRTtNQUNiLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDaEMsUUFBUSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO01BQ2pELEtBQUs7TUFDTCxTQUFTO01BQ1QsUUFBUSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUM7TUFDaEQsS0FBSztNQUNMLENBQUMsQ0FBQztNQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVk7TUFDcEMsSUFBSSxPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUN4QyxDQUFDLENBQUM7TUFDRixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxZQUFZO01BQ3RDLElBQUksT0FBTyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDMUMsQ0FBQyxDQUFDO01BQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsWUFBWTtNQUN2QyxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLENBQUMsQ0FBQztNQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFlBQVk7TUFDaEQsSUFBSSxPQUFPLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUMxQyxDQUFDLENBQUM7TUFDRixNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsRUFBRSxPQUFPLEVBQUU7TUFDbkQsSUFBSSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtNQUNyQyxRQUFRLE9BQU8sR0FBRyxJQUFJLENBQUM7TUFDdkIsS0FBSztNQUNMLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUM1QixJQUFJLE9BQU8sS0FBSyxFQUFFO01BQ2xCLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQ3hELFFBQVEsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUM3QixLQUFLO01BQ0wsQ0FBQyxDQUFDO01BQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBWTtNQUN0QyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNqQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNkLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUM1QixJQUFJLE9BQU8sS0FBSyxFQUFFO01BQ2xCLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO01BQ3hELFFBQVEsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUM3QixLQUFLO01BQ0wsSUFBSSxPQUFPLENBQUMsQ0FBQztNQUNiLENBQUMsQ0FBQztNQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFlBQVk7TUFDeEMsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDZixJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDNUIsSUFBSSxPQUFPLEtBQUssRUFBRTtNQUNsQixRQUFRLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO01BQ25ELFFBQVEsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUM3QixRQUFRLElBQUksS0FBSyxFQUFFO01BQ25CLFlBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQztNQUN2QixTQUFTO01BQ1QsS0FBSztNQUNMLElBQUksT0FBTyxDQUFDLENBQUM7TUFDYixDQUFDOzs7O01DcFBELE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO3FCQUMvQyxHQUFHLEtBQUssRUFBRTtNQUN6QixJQUFJLE9BQU8sR0FBR0gsS0FBa0IsQ0FBQztNQUNqQyxJQUFJLE9BQU8sR0FBR0MsS0FBa0IsQ0FBQztNQUNqQyxJQUFJLE9BQU8sR0FBRyxVQUFVLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDO01BQ3pGLElBQUksT0FBTyxJQUFJLFlBQVk7TUFDM0IsSUFBSSxTQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO01BQ25DLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3pCLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUU7TUFDL0MsWUFBWSxPQUFPLElBQUksQ0FBQyxLQUFLO01BQzdCLGtCQUFrQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO01BQ25ELGtCQUFrQixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQzNDLFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7TUFDekIsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztNQUNyQixRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO01BQy9CLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7TUFDN0IsUUFBUSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztNQUN4QixLQUFLO01BQ0wsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLGNBQWMsR0FBRyxVQUFVLElBQUksRUFBRTtNQUN2RCxRQUFRLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztNQUNoRSxLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsS0FBSyxFQUFFO01BQ3JELFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3pCLFFBQVEsT0FBTyxZQUFZO01BQzNCLFlBQVksSUFBSSxNQUFNLEdBQUcsS0FBSyxFQUFFLENBQUM7TUFDakMsWUFBWSxJQUFJLE1BQU0sRUFBRTtNQUN4QixnQkFBZ0IsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtNQUN0RSxvQkFBb0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztNQUN6QyxpQkFBaUI7TUFDakIsYUFBYTtNQUNiLFlBQVksT0FBTyxNQUFNLENBQUM7TUFDMUIsU0FBUyxDQUFDO01BQ1YsS0FBSyxDQUFDO01BQ04sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUU7TUFDOUQsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7TUFDekIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztNQUN6QixRQUFRLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO01BQ3hELFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtNQUNuQyxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUNqRSxvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7TUFDdkUsd0JBQXdCLE9BQU8sS0FBSyxDQUFDO01BQ3JDLHFCQUFxQjtNQUNyQixpQkFBaUI7TUFDakIsYUFBYTtNQUNiLGlCQUFpQjtNQUNqQixnQkFBZ0IsT0FBTyxLQUFLLENBQUM7TUFDN0IsYUFBYTtNQUNiLFNBQVM7TUFDVCxRQUFRLElBQUksT0FBTyxDQUFDO01BQ3BCLFFBQVEsSUFBSSxJQUFJLEdBQUcsWUFBWTtNQUMvQixZQUFZLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDL0MsU0FBUyxDQUFDO01BQ1YsUUFBUSxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDbEQsWUFBWSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZO01BQ25ELGdCQUFnQixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDOUYsYUFBYSxDQUFDLENBQUM7TUFDZixTQUFTO01BQ1QsYUFBYTtNQUNiLFlBQVksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWTtNQUNuRCxnQkFBZ0IsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3BGLGFBQWEsQ0FBQyxDQUFDO01BQ2YsU0FBUztNQUNULFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO01BQzVCLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO01BQzVCLGdCQUFnQixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUM1QyxvQkFBb0IsT0FBTyxPQUFPLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQztNQUMvQyxpQkFBaUI7TUFDakIscUJBQXFCO01BQ3JCLG9CQUFvQixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDcEYsd0JBQXdCLE9BQU8sSUFBSSxDQUFDO01BQ3BDLHFCQUFxQjtNQUNyQixvQkFBb0IsT0FBTyxLQUFLLENBQUM7TUFDakMsaUJBQWlCO01BQ2pCLGFBQWE7TUFDYixpQkFBaUI7TUFDakIsZ0JBQWdCLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO01BQzdDLG9CQUFvQixPQUFPLElBQUksQ0FBQztNQUNoQyxpQkFBaUI7TUFDakIsZ0JBQWdCLE9BQU8sT0FBTyxFQUFFLENBQUM7TUFDakMsYUFBYTtNQUNiLFNBQVM7TUFDVCxRQUFRLE9BQU8sT0FBTyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUM7TUFDbkMsS0FBSyxDQUFDO01BQ04sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLHFCQUFxQixHQUFHLFVBQVUsSUFBSSxFQUFFLElBQUksRUFBRTtNQUNwRSxRQUFRLFFBQVEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdEUsWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtNQUN4QyxLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMseUJBQXlCLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFO01BQ3hFLFFBQVEsUUFBUSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN2RSxZQUFZLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO01BQ3hDLEtBQUssQ0FBQztNQUNOLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUU7TUFDbEUsUUFBUSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUNoRCxLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMscUJBQXFCLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFO01BQ3BFLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7TUFDekIsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUM5QixRQUFRLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztNQUM1QixRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUN6QixZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtNQUM1QixnQkFBZ0IsT0FBTztNQUN2QixvQkFBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUMxRixhQUFhO01BQ2IsaUJBQWlCO01BQ2pCLGdCQUFnQixPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQzVELGFBQWE7TUFDYixTQUFTO01BQ1QsYUFBYTtNQUNiLFlBQVksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO01BQ2pELFNBQVM7TUFDVCxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDekIsUUFBUSxPQUFPLE9BQU8sQ0FBQztNQUN2QixLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFO01BQ25FLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3pCLFFBQVEsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztNQUMvQixRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7TUFDMUMsUUFBUSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7TUFDdkQsUUFBUSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEtBQUssRUFBRTtNQUMxRSxZQUFZLEtBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO01BQ2hDLFlBQVksT0FBTyxLQUFLLENBQUMsU0FBUztNQUNsQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7TUFDL0Msa0JBQWtCLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQy9DLFNBQVMsQ0FBQyxDQUFDO01BQ1gsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztNQUMvQixRQUFRLE9BQU8sTUFBTSxDQUFDO01BQ3RCLEtBQUssQ0FBQztNQUNOLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUU7TUFDbkUsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7TUFDeEIsWUFBWSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7TUFDMUIsZ0JBQWdCLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7TUFDcEUsb0JBQW9CLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDaEUsYUFBYTtNQUNiLGlCQUFpQjtNQUNqQixnQkFBZ0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3BFLGFBQWE7TUFDYixTQUFTO01BQ1QsYUFBYTtNQUNiLFlBQVksSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO01BQzFCLGdCQUFnQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDbEUsYUFBYTtNQUNiLGlCQUFpQjtNQUNqQixnQkFBZ0IsT0FBTyxJQUFJLENBQUM7TUFDNUIsYUFBYTtNQUNiLFNBQVM7TUFDVCxLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSSxFQUFFO01BQy9ELFFBQVEsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ25CLFFBQVEsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUMxQyxLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFVBQVUsSUFBSSxFQUFFLElBQUksRUFBRTtNQUN4RCxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDbkIsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7TUFDckMsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDO01BQzVCLFlBQVksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDM0MsZ0JBQWdCLE9BQU8sS0FBSyxDQUFDO01BQzdCLFlBQVksSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQztNQUMzQyxnQkFBZ0IsT0FBTyxJQUFJLENBQUM7TUFDNUIsU0FBUztNQUNULFFBQVEsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3hDLFlBQVksT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUNwRCxTQUFTO01BQ1QsYUFBYSxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNuRCxZQUFZLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUMxRCxTQUFTO01BQ1QsYUFBYSxJQUFJLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUN2RCxZQUFZLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUM5RCxTQUFTO01BQ1QsYUFBYSxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNqRCxZQUFZLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUN4RCxTQUFTO01BQ1QsYUFBYSxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNuRCxZQUFZLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUMxRCxTQUFTO01BQ1QsYUFBYSxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNsRCxZQUFZLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUN6RCxTQUFTO01BQ1QsYUFBYSxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNsRCxZQUFZLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUN6RCxTQUFTO01BQ1QsYUFBYSxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDOUMsWUFBWSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDckQsU0FBUztNQUNULFFBQVEsT0FBTyxJQUFJLENBQUM7TUFDcEIsS0FBSyxDQUFDO01BQ04sSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLElBQUksRUFBRTtNQUM5QyxRQUFRLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN0RCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtNQUN0QixZQUFZLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7TUFDdEMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQzdFLFlBQVksT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztNQUNyQyxTQUFTO01BQ1QsUUFBUSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO01BQ3pELEtBQUssQ0FBQztNQUNOLElBQUksT0FBTyxDQUFDLGFBQWEsR0FBRyxVQUFVLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO01BQzlELFFBQVEsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO01BQ3BCLFFBQVEsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNO01BQzNDLFlBQVksT0FBTyxLQUFLLENBQUM7TUFDekIsUUFBUSxJQUFJLEtBQUssR0FBRyxVQUFVLEdBQUcsRUFBRTtNQUNuQyxZQUFZLElBQUksT0FBTyxHQUFHLFlBQVk7TUFDdEMsZ0JBQWdCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQ3BFLGdCQUFnQixJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtNQUMxRCxvQkFBb0IsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO01BQ25DLGlCQUFpQjtNQUNqQixnQkFBZ0IsT0FBTyxHQUFHLENBQUM7TUFDM0IsYUFBYSxDQUFDO01BQ2QsWUFBWSxJQUFJLElBQUksR0FBRyxZQUFZLEVBQUUsUUFBUSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDO01BQ2pHLFlBQVksT0FBTyxPQUFPLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQztNQUN2QyxTQUFTLENBQUM7TUFDVixRQUFRLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQztNQUN2RCxLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sT0FBTyxDQUFDO01BQ25CLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ1UsR0FBRyxPQUFPOzs7TUN0TnpCLElBQUksZUFBZSxHQUFHLENBQUNJLGNBQUksSUFBSUEsY0FBSSxDQUFDLGVBQWUsTUFBTSxNQUFNLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO01BQ2hHLElBQUksSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDakMsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztNQUN6RixDQUFDLEtBQUssU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7TUFDNUIsSUFBSSxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztNQUNqQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNKLElBQUksWUFBWSxHQUFHLENBQUNBLGNBQUksSUFBSUEsY0FBSSxDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUU7TUFDdkUsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ3ZHLEVBQUM7TUFDRCxJQUFJLGNBQWMsR0FBRyxDQUFDQSxjQUFJLElBQUlBLGNBQUksQ0FBQyxjQUFjLEtBQUssWUFBWTtNQUNsRSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztNQUN4RixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRTtNQUNwRCxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7TUFDekUsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3hCLElBQUksT0FBTyxDQUFDLENBQUM7TUFDYixDQUFDLENBQUM7TUFDRixNQUFNLENBQUMsY0FBYyxVQUFVLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO01BQzlELGVBQWUsS0FBSyxDQUFDLENBQUM7TUFDdEIsSUFBSSxRQUFRLEdBQUdMLE1BQW1CLENBQUM7TUFDbkMsSUFBSSxPQUFPLEdBQUdDLEtBQWtCLENBQUM7TUFDakMsSUFBSSxZQUFZLEdBQUdDLFVBQXVCLENBQUM7TUFDM0MsWUFBWSxDQUFDQyxLQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQzFDLElBQUksS0FBSyxHQUFHSyxHQUFnQixDQUFDO01BQzdCLElBQUksU0FBUyxHQUFHQyxPQUFvQixDQUFDO01BQ3JDLElBQUksU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN2QyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7TUFDdkMsSUFBSSxPQUFPLEdBQUcsVUFBVSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsS0FBSyxTQUFTLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7TUFDM0UsSUFBSSxVQUFVLEdBQUcsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFO01BQ3JDLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO01BQzVCLFFBQVEsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2hDLFFBQVEsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUM7TUFDL0MsWUFBWSxPQUFPLEtBQUssQ0FBQztNQUN6QixLQUFLO01BQ0wsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixDQUFDLENBQUM7TUFDRixJQUFJLEtBQUssR0FBRyxVQUFVLFFBQVEsRUFBRSxNQUFNLEVBQUU7TUFDeEMsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUM5QyxRQUFRLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNoQyxRQUFRLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdEQsUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFO01BQ3BCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUNsQyxnQkFBZ0IsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDL0Msb0JBQW9CLE9BQU8sTUFBTSxDQUFDO01BQ2xDLGlCQUFpQjtNQUNqQixnQkFBZ0IsTUFBTTtNQUN0QixhQUFhO01BQ2IsWUFBWSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7TUFDM0MsZ0JBQWdCLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdkMsYUFBYTtNQUNiLGlCQUFpQjtNQUNqQixnQkFBZ0IsT0FBTztNQUN2QixhQUFhO01BQ2IsU0FBUztNQUNULGFBQWE7TUFDYixZQUFZLE1BQU0sR0FBRyxZQUFZLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7TUFDbkcsWUFBWSxNQUFNO01BQ2xCLFNBQVM7TUFDVCxLQUFLO01BQ0wsSUFBSSxPQUFPLE1BQU0sQ0FBQztNQUNsQixDQUFDLENBQUM7TUFDRixJQUFJLEtBQUssR0FBRyxVQUFVLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO01BQy9DLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDOUMsUUFBUSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDaEMsUUFBUSxJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3RELFFBQVEsSUFBSSxDQUFDLEtBQUssRUFBRTtNQUNwQixZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO01BQ2hDLGdCQUFnQixPQUFPO01BQ3ZCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtNQUN6QyxnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNoRSxvQkFBb0IsT0FBTztNQUMzQixpQkFBaUI7TUFDakIsZ0JBQWdCLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDcEQsb0JBQW9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDdkMsaUJBQWlCO01BQ2pCLHFCQUFxQjtNQUNyQixvQkFBb0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUN2QyxpQkFBaUI7TUFDakIsYUFBYTtNQUNiLFlBQVksSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDM0MsZ0JBQWdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDdEMsYUFBYTtNQUNiLFlBQVksSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFO01BQzNDLGdCQUFnQixNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3ZDLGFBQWE7TUFDYixTQUFTO01BQ1QsYUFBYTtNQUNiLFlBQVksWUFBWSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztNQUNqRyxZQUFZLE1BQU07TUFDbEIsU0FBUztNQUNULEtBQUs7TUFDTCxDQUFDLENBQUM7TUFDRixJQUFJLFFBQVEsR0FBRyxVQUFVLFFBQVEsRUFBRSxNQUFNLEVBQUU7TUFDM0MsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUM5QyxRQUFRLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNoQyxRQUFRLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdEQsUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFO01BQ3BCLFlBQVksSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQzlELGdCQUFnQixJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDM0Msb0JBQW9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ3BELGlCQUFpQjtNQUNqQixxQkFBcUI7TUFDckIsb0JBQW9CLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3pDLGlCQUFpQjtNQUNqQixnQkFBZ0IsT0FBTztNQUN2QixhQUFhO01BQ2IsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztNQUNoQyxnQkFBZ0IsT0FBTztNQUN2QixZQUFZLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtNQUMzQyxnQkFBZ0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN2QyxhQUFhO01BQ2IsaUJBQWlCO01BQ2pCLGdCQUFnQixPQUFPO01BQ3ZCLGFBQWE7TUFDYixZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQ3hDLGdCQUFnQixPQUFPO01BQ3ZCLGFBQWE7TUFDYixTQUFTO01BQ1QsYUFBYTtNQUNiLFlBQVksWUFBWSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7TUFDN0QsZ0JBQWdCLEtBQUssRUFBRSxLQUFLO01BQzVCLGdCQUFnQixLQUFLLEVBQUUsS0FBSztNQUM1QixnQkFBZ0IsUUFBUSxFQUFFLFFBQVE7TUFDbEMsYUFBYSxDQUFDLENBQUM7TUFDZixZQUFZLE1BQU07TUFDbEIsU0FBUztNQUNULEtBQUs7TUFDTCxDQUFDLENBQUM7TUFDRixJQUFJLE9BQU8sR0FBRyxVQUFVLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO01BQ2pELElBQUksSUFBSSxLQUFLLFlBQVksSUFBSSxFQUFFO01BQy9CLFFBQVEsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7TUFDN0IsS0FBSztNQUNMLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDbEQsUUFBUSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDaEMsUUFBUSxJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3RELFFBQVEsSUFBSSxDQUFDLEtBQUssRUFBRTtNQUNwQixZQUFZLElBQUksQ0FBQyxLQUFLLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQzNDLGdCQUFnQixJQUFJLE1BQU0sSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO01BQy9DLG9CQUFvQixPQUFPLElBQUksQ0FBQztNQUNoQyxpQkFBaUI7TUFDakIsZ0JBQWdCLE9BQU8sS0FBSyxDQUFDO01BQzdCLGFBQWE7TUFDYixZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO01BQ2hDLGdCQUFnQixPQUFPLEtBQUssQ0FBQztNQUM3QixZQUFZLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtNQUMzQyxnQkFBZ0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN2QyxhQUFhO01BQ2IsaUJBQWlCO01BQ2pCLGdCQUFnQixPQUFPLEtBQUssQ0FBQztNQUM3QixhQUFhO01BQ2IsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUN4QyxnQkFBZ0IsT0FBTyxLQUFLLENBQUM7TUFDN0IsYUFBYTtNQUNiLFNBQVM7TUFDVCxhQUFhO01BQ2IsWUFBWSxPQUFPLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtNQUMxRSxnQkFBZ0IsS0FBSyxFQUFFLEtBQUs7TUFDNUIsZ0JBQWdCLEtBQUssRUFBRSxLQUFLO01BQzVCLGdCQUFnQixRQUFRLEVBQUUsUUFBUTtNQUNsQyxnQkFBZ0IsT0FBTyxFQUFFLE9BQU87TUFDaEMsYUFBYSxDQUFDLENBQUM7TUFDZixTQUFTO01BQ1QsS0FBSztNQUNMLENBQUMsQ0FBQztNQUNGLElBQUksSUFBSSxJQUFJLFlBQVk7TUFDeEIsSUFBSSxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7TUFDekIsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7TUFDekIsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVk7TUFDbEMsWUFBWSxJQUFJLEVBQUUsQ0FBQztNQUNuQixZQUFZLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztNQUMxQixZQUFZLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO01BQzFELGdCQUFnQixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ3pDLGFBQWE7TUFDYixZQUFZLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtNQUN0QyxnQkFBZ0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLG1CQUFtQixDQUFDLENBQUM7TUFDcEUsYUFBYTtNQUNiLFlBQVksSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDcEMsWUFBWSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQzVILFlBQVksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNsRCxZQUFZLE9BQU8sSUFBSSxDQUFDO01BQ3hCLFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLEtBQUssRUFBRSxHQUFHLEVBQUU7TUFDM0MsWUFBWSxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7TUFDdEMsZ0JBQWdCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxDQUFDO01BQ25FLGFBQWE7TUFDYixZQUFZLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ3BDLFlBQVksSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDN0QsWUFBWSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2xELFlBQVksT0FBTyxJQUFJLENBQUM7TUFDeEIsU0FBUyxDQUFDO01BQ1YsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsSUFBSSxFQUFFO01BQ3BDLFlBQVksSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFO01BQ3RDLGdCQUFnQixNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztNQUNsRSxhQUFhO01BQ2IsWUFBWSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDekQsWUFBWSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3BELFlBQVksT0FBTyxLQUFLLENBQUM7TUFDekIsU0FBUyxDQUFDO01BQ1YsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLFlBQVk7TUFDL0IsWUFBWSxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7TUFDdEMsZ0JBQWdCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO01BQ2pFLGFBQWE7TUFDYixZQUFZLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDakMsWUFBWSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3BELFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLEtBQUssRUFBRSxXQUFXLEVBQUU7TUFDcEQsWUFBWSxJQUFJLEVBQUUsQ0FBQztNQUNuQixZQUFZLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztNQUMzQixZQUFZLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO01BQzFELGdCQUFnQixLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUM5QyxhQUFhO01BQ2IsWUFBWSxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7TUFDdEMsZ0JBQWdCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO01BQ3BFLGFBQWE7TUFDYixZQUFZLElBQUksV0FBVyxLQUFLLENBQUMsRUFBRTtNQUNuQyxnQkFBZ0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUUsRUFBRSxPQUFPLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDdkYsYUFBYTtNQUNiLFlBQVksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUNoRyxZQUFZLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDcEQsWUFBWSxPQUFPLEtBQUssQ0FBQztNQUN6QixTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxRQUFRLEVBQUU7TUFDM0MsWUFBWSxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7TUFDdEMsZ0JBQWdCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO01BQ2xFLGFBQWE7TUFDYixZQUFZLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO01BQzdDLFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLFFBQVEsRUFBRTtNQUN2QyxZQUFZLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtNQUN0QyxnQkFBZ0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLGdCQUFnQixDQUFDLENBQUM7TUFDakUsYUFBYTtNQUNiLFlBQVksT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUNoRCxTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxRQUFRLEVBQUUsT0FBTyxFQUFFO01BQ25ELFlBQVksSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFO01BQ3RDLGdCQUFnQixNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztNQUNwRSxhQUFhO01BQ2IsWUFBWSxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUM1RCxTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxVQUFVLE1BQU0sRUFBRTtNQUN2RCxZQUFZLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDMUMsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU07TUFDMUMsZ0JBQWdCLE9BQU8sS0FBSyxDQUFDO01BQzdCLFlBQVksT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFDN0QsU0FBUyxDQUFDO01BQ1YsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVk7TUFDbEMsWUFBWSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDcEQsU0FBUyxDQUFDO01BQ1YsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsT0FBTyxFQUFFO01BQzNDLFlBQVksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxjQUFjLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztNQUMzSCxZQUFZLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ3hELFlBQVksSUFBSSxLQUFLLEtBQUssU0FBUztNQUNuQyxnQkFBZ0IsT0FBTyxLQUFLLENBQUM7TUFDN0IsWUFBWSxJQUFJLFNBQVMsR0FBRyxVQUFVLEtBQUssRUFBRTtNQUM3QyxnQkFBZ0IsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQ3ZELGdCQUFnQixPQUFPLEtBQUssQ0FBQztNQUM3QixhQUFhLENBQUM7TUFDZCxZQUFZLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtNQUN0QyxnQkFBZ0IsSUFBSSxDQUFDLGNBQWMsRUFBRTtNQUNyQyxvQkFBb0IsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO01BQzVELGlCQUFpQjtNQUNqQixxQkFBcUI7TUFDckIsb0JBQW9CLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRywyQkFBMkIsR0FBRyxNQUFNLENBQUMsQ0FBQztNQUN6RixpQkFBaUI7TUFDakIsYUFBYTtNQUNiLFlBQVksSUFBSSxjQUFjLEVBQUU7TUFDaEMsZ0JBQWdCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRywyQkFBMkIsR0FBRyxNQUFNLENBQUMsQ0FBQztNQUNyRixhQUFhO01BQ2IsWUFBWSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNO01BQ3ZELGdCQUFnQixPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN4QyxZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3RELGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQ3RGLG9CQUFvQixPQUFPLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUM1QyxpQkFBaUI7TUFDakIsYUFBYTtNQUNiLFlBQVksT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDbkMsU0FBUyxDQUFDO01BQ1YsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsTUFBTSxFQUFFLFFBQVEsRUFBRTtNQUNyRCxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztNQUN2QyxnQkFBZ0IsT0FBTyxFQUFFLENBQUM7TUFDMUIsWUFBWSxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7TUFDdEMsZ0JBQWdCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyx3QkFBd0IsQ0FBQyxDQUFDO01BQ3pFLGFBQWE7TUFDYixZQUFZLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLEdBQUcsRUFBRTtNQUNqRSxnQkFBZ0IsT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7TUFDNUUsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ25CLFlBQVksT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQ2hELFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLE9BQU8sRUFBRTtNQUN4QyxZQUFZLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDN0MsWUFBWSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDMUQsWUFBWSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7TUFDckMsZ0JBQWdCLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7TUFDdEUsb0JBQW9CLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7TUFDMUQsaUJBQWlCO01BQ2pCLGdCQUFnQixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUM7TUFDckMsYUFBYTtNQUNiLFlBQVksSUFBSSxTQUFTLEdBQUcsVUFBVSxLQUFLLEVBQUU7TUFDN0MsZ0JBQWdCLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDekQsZ0JBQWdCLE9BQU8sS0FBSyxDQUFDO01BQzdCLGFBQWEsQ0FBQztNQUNkLFlBQVksSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO01BQ3JDLGdCQUFnQixJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUU7TUFDMUMsb0JBQW9CLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDbkYsaUJBQWlCO01BQ2pCLHFCQUFxQjtNQUNyQixvQkFBb0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7TUFDekMsb0JBQW9CLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7TUFDakUsaUJBQWlCO01BQ2pCLGFBQWE7TUFDYixpQkFBaUI7TUFDakIsZ0JBQWdCLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtNQUMxQyxvQkFBb0IsSUFBSSxNQUFNLEdBQUc7TUFDakMsd0JBQXdCLEtBQUssRUFBRSxDQUFDO01BQ2hDLHFCQUFxQixDQUFDO01BQ3RCLG9CQUFvQixJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO01BQzNHLG9CQUFvQixLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7TUFDcEQsb0JBQW9CLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQztNQUMxQyxpQkFBaUI7TUFDakIscUJBQXFCO01BQ3JCLG9CQUFvQixJQUFJLE1BQU0sR0FBRztNQUNqQyx3QkFBd0IsS0FBSyxFQUFFLENBQUM7TUFDaEMscUJBQXFCLENBQUM7TUFDdEIsb0JBQW9CLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztNQUNuSCxvQkFBb0IsS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO01BQ3BELG9CQUFvQixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUM7TUFDMUMsaUJBQWlCO01BQ2pCLGFBQWE7TUFDYixTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsVUFBVSxJQUFJLEVBQUUsS0FBSyxFQUFFO01BQ3RELFlBQVksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUM1QyxZQUFZLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDOUMsWUFBWSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO01BQ3BELFlBQVksSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO01BQ3BELFlBQVksSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztNQUN0RCxZQUFZLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztNQUNyRCxZQUFZLElBQUksS0FBSyxDQUFDLGtCQUFrQixFQUFFO01BQzFDLGdCQUFnQixJQUFJLGdCQUFnQixJQUFJLGlCQUFpQixFQUFFO01BQzNELG9CQUFvQixPQUFPLFdBQVcsQ0FBQztNQUN2QyxpQkFBaUI7TUFDakIscUJBQXFCO01BQ3JCLG9CQUFvQixPQUFPLFlBQVksQ0FBQztNQUN4QyxpQkFBaUI7TUFDakIsYUFBYTtNQUNiLGlCQUFpQjtNQUNqQixnQkFBZ0IsT0FBTyxXQUFXLElBQUksWUFBWSxDQUFDO01BQ25ELGFBQWE7TUFDYixTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxNQUFNLEVBQUUsS0FBSyxFQUFFO01BQ2hELFlBQVksSUFBSSxLQUFLLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7TUFDaEQsWUFBWSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztNQUMxRCxTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxNQUFNLEVBQUU7TUFDdkMsWUFBWSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO01BQ2pELFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUU7TUFDOUMsWUFBWSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDakQsWUFBWSxPQUFPLE1BQU0sQ0FBQztNQUMxQixTQUFTLENBQUM7TUFDVixRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxNQUFNLEVBQUU7TUFDMUMsWUFBWSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztNQUM3QyxZQUFZLE9BQU8sTUFBTSxDQUFDO01BQzFCLFNBQVMsQ0FBQztNQUNWLFFBQVEsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxjQUFjLEdBQUcsRUFBRSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsR0FBRyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsa0JBQWtCLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDO01BQzNOLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7TUFDN0IsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztNQUNqQyxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO01BQzdDLFFBQVEsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO01BQ3JELFFBQVEsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO01BQ3JELFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7TUFDekIsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNoRCxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ25ELEtBQUs7TUFDTCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFlBQVk7TUFDMUMsUUFBUSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDM0IsS0FBSyxDQUFDO01BQ04sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxZQUFZO01BQ3pDLFFBQVEsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO01BQzdCLEtBQUssQ0FBQztNQUNOLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRTtNQUNwRCxRQUFRLEdBQUcsRUFBRSxZQUFZO01BQ3pCLFlBQVksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztNQUN4QyxTQUFTO01BQ1QsUUFBUSxVQUFVLEVBQUUsS0FBSztNQUN6QixRQUFRLFlBQVksRUFBRSxJQUFJO01BQzFCLEtBQUssQ0FBQyxDQUFDO01BQ1AsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLE9BQU8sRUFBRTtNQUM5QyxRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztNQUN6QixRQUFRLElBQUksT0FBTyxZQUFZLElBQUksRUFBRTtNQUNyQyxZQUFZLE9BQU87TUFDbkIsZ0JBQWdCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtNQUN0QyxnQkFBZ0IsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO01BQ2xELGdCQUFnQixrQkFBa0IsRUFBRSxPQUFPLENBQUMsa0JBQWtCO01BQzlELGdCQUFnQixjQUFjLEVBQUUsT0FBTyxDQUFDLGNBQWM7TUFDdEQsZ0JBQWdCLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxrQkFBa0I7TUFDOUQsZ0JBQWdCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtNQUNsQyxhQUFhLENBQUM7TUFDZCxTQUFTO01BQ1QsYUFBYSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDekMsWUFBWSxJQUFJLENBQUMsT0FBTztNQUN4QixnQkFBZ0IsT0FBTztNQUN2QixvQkFBb0IsTUFBTSxFQUFFLEVBQUU7TUFDOUIsb0JBQW9CLFFBQVEsRUFBRSxFQUFFO01BQ2hDLG9CQUFvQixrQkFBa0IsRUFBRSxLQUFLO01BQzdDLG9CQUFvQixrQkFBa0IsRUFBRSxLQUFLO01BQzdDLG9CQUFvQixjQUFjLEVBQUUsS0FBSztNQUN6QyxpQkFBaUIsQ0FBQztNQUNsQixZQUFZLElBQUksTUFBTSxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUN0RCxZQUFZLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztNQUN0QyxZQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO01BQ3hDLGdCQUFnQixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztNQUNwRCxnQkFBZ0IsT0FBTztNQUN2QixvQkFBb0IsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO01BQzlDLG9CQUFvQixRQUFRLEVBQUUsUUFBUTtNQUN0QyxvQkFBb0IsSUFBSSxFQUFFLElBQUk7TUFDOUIsb0JBQW9CLGtCQUFrQixFQUFFLEtBQUs7TUFDN0Msb0JBQW9CLGtCQUFrQixFQUFFLEtBQUs7TUFDN0Msb0JBQW9CLGNBQWMsRUFBRSxLQUFLO01BQ3pDLGlCQUFpQixDQUFDO01BQ2xCLGFBQWE7TUFDYixpQkFBaUI7TUFDakIsZ0JBQWdCLE9BQU87TUFDdkIsb0JBQW9CLE1BQU0sRUFBRSxPQUFPO01BQ25DLG9CQUFvQixRQUFRLEVBQUUsRUFBRTtNQUNoQyxvQkFBb0Isa0JBQWtCLEVBQUUsTUFBTSxDQUFDLGtCQUFrQjtNQUNqRSxvQkFBb0Isa0JBQWtCLEVBQUUsTUFBTSxDQUFDLGtCQUFrQjtNQUNqRSxvQkFBb0IsY0FBYyxFQUFFLElBQUk7TUFDeEMsb0JBQW9CLElBQUksRUFBRSxJQUFJO01BQzlCLGlCQUFpQixDQUFDO01BQ2xCLGFBQWE7TUFDYixTQUFTO01BQ1QsYUFBYSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO01BQzlELFlBQVksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO01BQy9DLFNBQVM7TUFDVCxhQUFhLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtNQUN6QyxZQUFZLE9BQU87TUFDbkIsZ0JBQWdCLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztNQUN6QyxnQkFBZ0IsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFO01BQzdELG9CQUFvQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQzlELGlCQUFpQixFQUFFLEVBQUUsQ0FBQztNQUN0QixnQkFBZ0Isa0JBQWtCLEVBQUUsS0FBSztNQUN6QyxnQkFBZ0Isa0JBQWtCLEVBQUUsS0FBSztNQUN6QyxnQkFBZ0IsY0FBYyxFQUFFLEtBQUs7TUFDckMsYUFBYSxDQUFDO01BQ2QsU0FBUztNQUNULGFBQWE7TUFDYixZQUFZLE9BQU87TUFDbkIsZ0JBQWdCLE1BQU0sRUFBRSxFQUFFO01BQzFCLGdCQUFnQixRQUFRLEVBQUUsT0FBTyxLQUFLLFNBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7TUFDaEUsZ0JBQWdCLGtCQUFrQixFQUFFLEtBQUs7TUFDekMsZ0JBQWdCLGtCQUFrQixFQUFFLEtBQUs7TUFDekMsZ0JBQWdCLGNBQWMsRUFBRSxLQUFLO01BQ3JDLGFBQWEsQ0FBQztNQUNkLFNBQVM7TUFDVCxLQUFLLENBQUM7TUFDTixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFVBQVUsTUFBTSxFQUFFO01BQ25ELFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQ25DLFlBQVksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ2hELFlBQVksSUFBSTtNQUNoQixnQkFBZ0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxjQUFjLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztNQUN4RyxnQkFBZ0IsT0FBTyxDQUFDLGNBQWMsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO01BQzNELGFBQWE7TUFDYixZQUFZLE9BQU8sQ0FBQyxFQUFFO01BQ3RCLGdCQUFnQixPQUFPLE1BQU0sQ0FBQztNQUM5QixhQUFhO01BQ2IsU0FBUztNQUNULGFBQWEsSUFBSSxNQUFNLFlBQVksSUFBSSxFQUFFO01BQ3pDLFlBQVksT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDO01BQ25DLFNBQVM7TUFDVCxRQUFRLE9BQU8sTUFBTSxDQUFDO01BQ3RCLEtBQUssQ0FBQztNQUNOLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLE9BQU8sRUFBRTtNQUNwQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDekMsUUFBUSxJQUFJLE9BQU8sR0FBRyxVQUFVLE1BQU0sRUFBRTtNQUN4QyxZQUFZLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUN0QyxTQUFTLENBQUM7TUFDVixRQUFRLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7TUFDbEMsUUFBUSxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztNQUM1QixRQUFRLE9BQU8sT0FBTyxDQUFDO01BQ3ZCLEtBQUssQ0FBQztNQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO01BQzFELFFBQVEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDakUsS0FBSyxDQUFDO01BQ04sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsSUFBSSxFQUFFO01BQ2pDLFFBQVEsSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUU7TUFDM0MsUUFBUSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDbEMsS0FBSyxDQUFDO01BQ04sSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSSxFQUFFO01BQ25DLFFBQVEsSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUU7TUFDM0MsUUFBUSxJQUFJLElBQUksWUFBWSxJQUFJLEVBQUU7TUFDbEMsWUFBWSxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNuRCxZQUFZLElBQUksS0FBSyxFQUFFO01BQ3ZCLGdCQUFnQixPQUFPLEtBQUssQ0FBQztNQUM3QixhQUFhO01BQ2IsaUJBQWlCO01BQ2pCLGdCQUFnQixTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDakQsZ0JBQWdCLE9BQU8sSUFBSSxDQUFDO01BQzVCLGFBQWE7TUFDYixTQUFTO01BQ1QsYUFBYSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7TUFDMUMsWUFBWSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFDOUMsU0FBUztNQUNULGFBQWE7TUFDYixZQUFZLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztNQUN0QyxZQUFZLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDM0MsWUFBWSxJQUFJLEtBQUssRUFBRTtNQUN2QixnQkFBZ0IsT0FBTyxLQUFLLENBQUM7TUFDN0IsYUFBYTtNQUNiLGlCQUFpQjtNQUNqQixnQkFBZ0IsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ3RDLGdCQUFnQixTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztNQUN6QyxnQkFBZ0IsT0FBTyxJQUFJLENBQUM7TUFDNUIsYUFBYTtNQUNiLFNBQVM7TUFDVCxLQUFLLENBQUM7TUFDTixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxNQUFNLEVBQUUsT0FBTyxFQUFFO01BQzVDLFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUN6QyxRQUFRLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNsQyxLQUFLLENBQUM7TUFDTixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtNQUNuRCxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDekMsUUFBUSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQ3pDLEtBQUssQ0FBQztNQUNOLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLE1BQU0sRUFBRSxPQUFPLEVBQUU7TUFDL0MsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQ3pDLFFBQVEsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ3JDLEtBQUssQ0FBQztNQUNOLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO01BQ3JELFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUN6QyxRQUFRLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDM0MsS0FBSyxDQUFDO01BQ04sSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ0wsZUFBZSxJQUFJLENBQUM7TUFDcEIsa0JBQWtCLElBQUk7Ozs7O01DdGhCdEIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO01BQ1gsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7TUFDakQsRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtNQUNwQixJQUFJLE9BQU8sU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO01BQ3hDLE1BQU0sU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztNQUMvQixNQUFNLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDM0MsS0FBSyxDQUFDO01BQ04sR0FBRztNQUNILEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDeEMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO01BQzFCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLHNEQUFzRCxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUMvRyxHQUFHO01BQ0g7O01DWE8sTUFBTSxZQUFZLENBQUM7TUFDMUIsRUFBRSxXQUFXLEdBQUc7TUFDaEIsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHO01BQ3ZCLE1BQU0sS0FBSyxFQUFFLENBQUM7TUFDZCxLQUFLLENBQUM7TUFDTixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxRQUFRLEtBQUs7TUFDbkMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtNQUMxQixRQUFRLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztNQUNqRCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO01BQzNDLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztNQUNqQyxRQUFRLE9BQU8sS0FBSyxDQUFDO01BQ3JCLE9BQU87TUFDUCxLQUFLLENBQUM7TUFDTixJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxLQUFLLEtBQUs7TUFDbEMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDbkMsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdkMsT0FBTztNQUNQLEtBQUssQ0FBQztNQUNOLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEtBQUs7TUFDdkMsTUFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7TUFDN0IsUUFBUSxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7TUFDakUsVUFBVSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssS0FBSyxFQUFFO01BQ3RFLFlBQVksT0FBTztNQUNuQixXQUFXO01BQ1gsU0FBUztNQUNULE9BQU87TUFDUCxNQUFNLElBQUksTUFBTTtNQUNoQixRQUFRLE9BQU87TUFDZixNQUFNLE1BQU0sTUFBTSxHQUFHLENBQUMsUUFBUSxLQUFLO01BQ25DLFFBQVEsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQ2pFLFVBQVUsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQy9ELFNBQVM7TUFDVCxRQUFRLE9BQU8sUUFBUSxDQUFDO01BQ3hCLE9BQU8sQ0FBQztNQUNSLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLEtBQUs7TUFDM0MsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7TUFDMUIsVUFBVSxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7TUFDcEMsT0FBTyxDQUFDLENBQUM7TUFDVCxLQUFLLENBQUM7TUFDTixHQUFHO01BQ0g7O01DeENBLFNBQVMsd0JBQXdCLENBQUMsS0FBSyxFQUFFO01BQ3pDLEVBQUUsT0FBTyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDckQsQ0FBQztNQUNELFNBQVMsZUFBZSxDQUFDLEtBQUssRUFBRTtNQUNoQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7TUFDOUMsQ0FBQztNQUNELFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRTtNQUMxQixFQUFFLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUM1RCxFQUFFLE9BQU8sV0FBVyxLQUFLLGlCQUFpQixJQUFJLFdBQVcsS0FBSyxlQUFlLElBQUksY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3ZHLENBQUM7TUFDRCxNQUFNLFlBQVksR0FBRyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQztNQUNoRSxNQUFNLGtCQUFrQixHQUFHLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEtBQUssQ0FBQztNQUM5RSxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUU7TUFDL0IsRUFBRSxPQUFPLEtBQUssQ0FBQyxRQUFRLEtBQUssa0JBQWtCLENBQUM7TUFDL0MsQ0FBQztNQUNELFNBQVMsV0FBVyxDQUFDLEdBQUcsRUFBRTtNQUMxQixFQUFFLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO01BQ3RDLENBQUM7TUFDRCxTQUFTLDZCQUE2QixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7TUFDdkQsRUFBRSxJQUFJLE9BQU8sQ0FBQyxLQUFLLEtBQUssS0FBSyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNuRSxJQUFJLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNsQyxNQUFNLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUNsQyxLQUFLLE1BQU07TUFDWCxNQUFNLE9BQU8sU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDM0QsS0FBSztNQUNMLEdBQUc7TUFDSCxFQUFFLE9BQU8sS0FBSyxDQUFDO01BQ2YsQ0FBQztNQUNELFNBQVMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7TUFDcEQsRUFBRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsT0FBTyxFQUFFO01BQ3JELElBQUksT0FBTyw2QkFBNkIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDM0QsR0FBRyxDQUFDLENBQUM7TUFDTCxDQUFDO01BQ0QsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO01BQ3hDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7TUFDNUIsSUFBSSxPQUFPLFNBQVMsQ0FBQztNQUNyQixHQUFHO01BQ0gsRUFBRSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQy9DLEVBQUUsT0FBTyxPQUFPLFdBQVcsS0FBSyxVQUFVLEdBQUcsV0FBVyxHQUFHLFNBQVMsQ0FBQztNQUNyRSxDQUFDO01BQ0QsU0FBUywrQkFBK0IsQ0FBQyxNQUFNLEVBQUU7TUFDakQsRUFBRSxPQUFPLE1BQU0sQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsTUFBTSxFQUFFO01BQ3JHLElBQUksT0FBTyxNQUFNLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDL0MsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ1YsQ0FBQztNQUNELFNBQVMsT0FBTyxDQUFDLE1BQU0sRUFBRTtNQUN6QixFQUFFLElBQUksQ0FBQ2IsU0FBTyxDQUFDLE1BQU0sQ0FBQztNQUN0QixJQUFJLE9BQU8sRUFBRSxDQUFDO01BQ2QsRUFBRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFDN0UsQ0FBQztNQUNELFNBQVMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtNQUM5QyxFQUFFLElBQUk7TUFDTixJQUFJLE9BQU8sUUFBUSxJQUFJLE1BQU0sQ0FBQztNQUM5QixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDZCxJQUFJLE9BQU8sS0FBSyxDQUFDO01BQ2pCLEdBQUc7TUFDSCxDQUFDO01BQ0QsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO01BQ3ZDLEVBQUUsT0FBTyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztNQUN4SSxDQUFDO01BQ0QsU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7TUFDOUMsRUFBRSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO01BQ3pELEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7TUFDeEMsSUFBSSxPQUFPLE1BQU0sQ0FBQztNQUNsQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO01BQ3ZCLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsRUFBRTtNQUMxQyxNQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyw2QkFBNkIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDN0UsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHO01BQ0gsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxFQUFFO01BQ3hDLElBQUksSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7TUFDdkMsTUFBTSxPQUFPO01BQ2IsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUN0QixNQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDckMsS0FBSztNQUNMLElBQUksSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO01BQ25GLE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQzNGLEtBQUssTUFBTTtNQUNYLE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLDZCQUE2QixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUM3RSxLQUFLO01BQ0wsR0FBRyxDQUFDLENBQUM7TUFDTCxFQUFFLE9BQU8sV0FBVyxDQUFDO01BQ3JCLENBQUM7TUFDRCxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtNQUM1QyxFQUFFLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO01BQzFCLEVBQUUsT0FBTyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLGlCQUFpQixDQUFDO01BQy9ELEVBQUUsT0FBTyxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsSUFBSSx3QkFBd0IsQ0FBQztNQUNwRixFQUFFLE9BQU8sQ0FBQyw2QkFBNkIsR0FBRyw2QkFBNkIsQ0FBQztNQUN4RSxFQUFFLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDOUMsRUFBRSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQzlDLEVBQUUsTUFBTSx5QkFBeUIsR0FBRyxhQUFhLEtBQUssYUFBYSxDQUFDO01BQ3BFLEVBQUUsSUFBSSxDQUFDLHlCQUF5QixFQUFFO01BQ2xDLElBQUksT0FBTyw2QkFBNkIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDMUQsR0FBRyxNQUFNLElBQUksYUFBYSxFQUFFO01BQzVCLElBQUksT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDdkQsR0FBRyxNQUFNO01BQ1QsSUFBSSxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ2hELEdBQUc7TUFDSCxDQUFDO01BQ0QsU0FBUyxZQUFZLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtNQUN0QyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQzdCLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO01BQ3pELEdBQUc7TUFDSCxFQUFFLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRSxJQUFJLEVBQUU7TUFDM0MsSUFBSSxPQUFPLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQzFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztNQUNULENBQUM7TUFDRCxTQUFTLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQztBQUNqQixZQUFDLEtBQUssb0JBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7TUN0R1IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzNCLEdBQUcsV0FBVyxHQUFHLE9BQU8sTUFBTSxFQUFFLFVBQVUsR0FBRyxPQUFPLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDLFVBQVUsR0FBRSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSTtNQUN2ZixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFdBQVcsR0FBRyxPQUFPLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLEdBQUcsT0FBTyxNQUFNLENBQUMscUJBQXFCLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyx5SUFBeUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLHdJQUF3SSxFQUFDLENBQUMsR0FBRyxRQUFRO01BQ2xmLE9BQU8sQ0FBQyxFQUFFLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsZ0NBQWdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0hBQWtILENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVM7TUFDNWYsVUFBVSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDaGQsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNwYSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7TUFDMVAsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztNQUN4WixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsOEJBQThCLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQywyQkFBMkIsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsZ0NBQWdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsQ0FBQyxtQ0FBbUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7TUFDN2MseUNBQXlDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLHNDQUFzQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxVQUFVLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLGlDQUFpQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7TUFDcGUsa0NBQWtDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO01BQzlhLDZCQUE2QixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FB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
