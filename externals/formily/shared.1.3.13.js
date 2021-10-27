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
      function equal(a, b, filter) {
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
              if (!equal(a[i], b[i], filter)) {
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
            return equal(a.toJSON(), b.toJSON(), filter);
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
              if (isFn(filter)) {
                if (filter({ a: a[key], b: b[key] }, key)) {
                  if (!equal(a[key], b[key], filter)) {
                    return false;
                  }
                }
              } else {
                if (!equal(a[key], b[key], filter)) {
                  return false;
                }
              }
            }
          }
          return true;
        }
        return a !== a && b !== b;
      }
      const isEqual = exports('isEqual', function exportedEqual(a, b, filter) {
        try {
          return equal(a, b, filter);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLjEuMy4xMy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3R5cGVzLnRzIiwiLi4vc3JjL2FycmF5LnRzIiwiLi4vc3JjL2dsb2JhbC50cyIsIi4uL3NyYy9pbnN0YW5jZW9mLnRzIiwiLi4vc3JjL2JpZy1kYXRhLnRzIiwiLi4vc3JjL2NvbXBhcmUudHMiLCIuLi9zcmMvY2xvbmUudHMiLCIuLi9zcmMvaXNFbXB0eS50cyIsIi4uL25vZGVfbW9kdWxlcy91cHBlci1jYXNlL3VwcGVyLWNhc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvbG93ZXItY2FzZS9sb3dlci1jYXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL25vLWNhc2UvdmVuZG9yL25vbi13b3JkLXJlZ2V4cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9uby1jYXNlL3ZlbmRvci9jYW1lbC1jYXNlLXJlZ2V4cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9uby1jYXNlL3ZlbmRvci9jYW1lbC1jYXNlLXVwcGVyLXJlZ2V4cC5qcyIsIi4uL25vZGVfbW9kdWxlcy9uby1jYXNlL25vLWNhc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvY2FtZWwtY2FzZS9jYW1lbC1jYXNlLmpzIiwiLi4vc3JjL3N0cmluZy50cyIsIi4uL25vZGVfbW9kdWxlcy9jb29sLXBhdGgvbGliL2NvbnRleHRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvdG9rZW5zLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvdG9rZW5pemVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvdHlwZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi91dGlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb29sLXBhdGgvbGliL2Rlc3RydWN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi9wYXJzZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi9scnUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi9tYXRjaGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvaW5kZXguanMiLCIuLi9zcmMvZGVwcmVjYXRlLnRzIiwiLi4vc3JjL3N1YnNjcmliYWJsZS50cyIsIi4uL3NyYy9tZXJnZS50cyIsIi4uL25vZGVfbW9kdWxlcy9zY2hlZHVsZXIvY2pzL3NjaGVkdWxlci5wcm9kdWN0aW9uLm1pbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9zY2hlZHVsZXIvaW5kZXguanMiLCIuLi9zcmMvc2NoZWR1bGVyLnRzIiwiLi4vc3JjL2RlZmF1bHRzLnRzIiwiLi4vc3JjL2xvZy50cyIsIi4uL3NyYy91aWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgaXNUeXBlID0gPFQ+KHR5cGU6IHN0cmluZyB8IHN0cmluZ1tdKSA9PiAob2JqOiB1bmtub3duKTogb2JqIGlzIFQgPT5cbiAgb2JqICE9IG51bGwgJiZcbiAgKEFycmF5LmlzQXJyYXkodHlwZSkgPyB0eXBlIDogW3R5cGVdKS5zb21lKFxuICAgIHQgPT4gZ2V0VHlwZShvYmopID09PSBgW29iamVjdCAke3R9XWBcbiAgKVxuZXhwb3J0IGNvbnN0IGdldFR5cGUgPSAob2JqOiBhbnkpID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopXG5leHBvcnQgY29uc3QgaXNGbiA9IGlzVHlwZTwoLi4uYXJnczogYW55W10pID0+IGFueT4oW1xuICAnRnVuY3Rpb24nLFxuICAnQXN5bmNGdW5jdGlvbicsXG4gICdHZW5lcmF0b3JGdW5jdGlvbidcbl0pXG5leHBvcnQgY29uc3QgaXNBcnIgPSBBcnJheS5pc0FycmF5XG5leHBvcnQgY29uc3QgaXNQbGFpbk9iaiA9IGlzVHlwZTxvYmplY3Q+KCdPYmplY3QnKVxuZXhwb3J0IGNvbnN0IGlzU3RyID0gaXNUeXBlPHN0cmluZz4oJ1N0cmluZycpXG5leHBvcnQgY29uc3QgaXNCb29sID0gaXNUeXBlPGJvb2xlYW4+KCdCb29sZWFuJylcbmV4cG9ydCBjb25zdCBpc051bSA9IGlzVHlwZTxudW1iZXI+KCdOdW1iZXInKVxuZXhwb3J0IGNvbnN0IGlzT2JqID0gKHZhbDogdW5rbm93bik6IHZhbCBpcyBvYmplY3QgPT4gdHlwZW9mIHZhbCA9PT0gJ29iamVjdCdcbmV4cG9ydCBjb25zdCBpc1JlZ0V4cCA9IGlzVHlwZTxSZWdFeHA+KCdSZWdFeHAnKVxuXG5leHBvcnQgdHlwZSBTdWJzY3JpYmVyPFM+ID0gKHBheWxvYWQ6IFMpID0+IHZvaWRcblxuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb248Uz4ge1xuICBub3RpZnk/OiAocGF5bG9hZDogUykgPT4gdm9pZCB8IGJvb2xlYW5cbiAgZmlsdGVyPzogKHBheWxvYWQ6IFMpID0+IGFueVxufVxuIiwiaW1wb3J0IHsgaXNBcnIsIGlzT2JqLCBpc1N0ciB9IGZyb20gJy4vdHlwZXMnXG5cbnR5cGUgRWFjaEFycmF5SXRlcmF0b3I8VD4gPSAoY3VycmVudFZhbHVlOiBULCBrZXk6IG51bWJlcikgPT4gdm9pZCB8IGJvb2xlYW5cbnR5cGUgRWFjaFN0cmluZ0l0ZXJhdG9yID0gKGN1cnJlbnRWYWx1ZTogc3RyaW5nLCBrZXk6IG51bWJlcikgPT4gdm9pZCB8IGJvb2xlYW5cbnR5cGUgRWFjaE9iamVjdEl0ZXJhdG9yPFQgPSBhbnk+ID0gKFxuICBjdXJyZW50VmFsdWU6IFQsXG4gIGtleTogc3RyaW5nXG4pID0+IHZvaWQgfCBib29sZWFuXG50eXBlIE1hcEFycmF5SXRlcmF0b3I8VEl0ZW0sIFRSZXN1bHQ+ID0gKFxuICBjdXJyZW50VmFsdWU6IFRJdGVtLFxuICBrZXk6IG51bWJlclxuKSA9PiBUUmVzdWx0XG50eXBlIE1hcFN0cmluZ0l0ZXJhdG9yPFRSZXN1bHQ+ID0gKGN1cnJlbnRWYWx1ZTogc3RyaW5nLCBrZXk6IG51bWJlcikgPT4gVFJlc3VsdFxudHlwZSBNYXBPYmplY3RJdGVyYXRvcjxUSXRlbSwgVFJlc3VsdD4gPSAoXG4gIGN1cnJlbnRWYWx1ZTogVEl0ZW0sXG4gIGtleTogc3RyaW5nXG4pID0+IFRSZXN1bHRcbnR5cGUgTWVtb0FycmF5SXRlcmF0b3I8VCwgVT4gPSAoXG4gIHByZXZpb3VzVmFsdWU6IFUsXG4gIGN1cnJlbnRWYWx1ZTogVCxcbiAga2V5OiBudW1iZXJcbikgPT4gVVxudHlwZSBNZW1vU3RyaW5nSXRlcmF0b3I8VD4gPSAoXG4gIHByZXZpb3VzVmFsdWU6IFQsXG4gIGN1cnJlbnRWYWx1ZTogc3RyaW5nLFxuICBrZXk6IG51bWJlclxuKSA9PiBUXG50eXBlIE1lbW9PYmplY3RJdGVyYXRvcjxUVmFsdWUsIFRSZXN1bHQ+ID0gKFxuICBwcmV2aW91c1ZhbHVlOiBUUmVzdWx0LFxuICBjdXJyZW50VmFsdWU6IFRWYWx1ZSxcbiAga2V5OiBzdHJpbmdcbikgPT4gVFJlc3VsdFxuXG5leHBvcnQgY29uc3QgdG9BcnIgPSAodmFsOiBhbnkpOiBhbnlbXSA9PiAoaXNBcnIodmFsKSA/IHZhbCA6IHZhbCA/IFt2YWxdIDogW10pXG5leHBvcnQgZnVuY3Rpb24gZWFjaChcbiAgdmFsOiBzdHJpbmcsXG4gIGl0ZXJhdG9yOiBFYWNoU3RyaW5nSXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IHZvaWRcbmV4cG9ydCBmdW5jdGlvbiBlYWNoPFQ+KFxuICB2YWw6IFRbXSxcbiAgaXRlcmF0b3I6IEVhY2hBcnJheUl0ZXJhdG9yPFQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiB2b2lkXG5leHBvcnQgZnVuY3Rpb24gZWFjaDxUIGV4dGVuZHMge30sIFRWYWx1ZT4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IEVhY2hPYmplY3RJdGVyYXRvcjxUVmFsdWU+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiB2b2lkXG5leHBvcnQgZnVuY3Rpb24gZWFjaCh2YWw6IGFueSwgaXRlcmF0b3I6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbik6IHZvaWQge1xuICBpZiAoaXNBcnIodmFsKSB8fCBpc1N0cih2YWwpKSB7XG4gICAgaWYgKHJldmVydCkge1xuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gdmFsLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChpdGVyYXRvcih2YWxbaV0sIGkpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvcih2YWxbaV0sIGkpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqKHZhbCkpIHtcbiAgICBsZXQga2V5OiBzdHJpbmdcbiAgICBmb3IgKGtleSBpbiB2YWwpIHtcbiAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh2YWwsIGtleSkpIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yKHZhbFtrZXldLCBrZXkpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXA8VD4oXG4gIHZhbDogc3RyaW5nLFxuICBpdGVyYXRvcjogTWFwU3RyaW5nSXRlcmF0b3I8VD4sXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGFueVxuZXhwb3J0IGZ1bmN0aW9uIG1hcDxUSXRlbSwgVFJlc3VsdD4oXG4gIHZhbDogVEl0ZW1bXSxcbiAgaXRlcmF0b3I6IE1hcEFycmF5SXRlcmF0b3I8VEl0ZW0sIFRSZXN1bHQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBhbnlcbmV4cG9ydCBmdW5jdGlvbiBtYXA8VCBleHRlbmRzIHt9LCBUUmVzdWx0PihcbiAgdmFsOiBULFxuICBpdGVyYXRvcjogTWFwT2JqZWN0SXRlcmF0b3I8VFtrZXlvZiBUXSwgVFJlc3VsdD4sXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGFueVxuZXhwb3J0IGZ1bmN0aW9uIG1hcCh2YWw6IGFueSwgaXRlcmF0b3I6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbik6IGFueSB7XG4gIGNvbnN0IHJlcyA9IGlzQXJyKHZhbCkgfHwgaXNTdHIodmFsKSA/IFtdIDoge31cbiAgZWFjaChcbiAgICB2YWwsXG4gICAgKGl0ZW0sIGtleSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBpdGVyYXRvcihpdGVtLCBrZXkpXG4gICAgICBpZiAoaXNBcnIocmVzKSkge1xuICAgICAgICA7KHJlcyBhcyBhbnkpLnB1c2godmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNba2V5XSA9IHZhbHVlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXZlcnRcbiAgKVxuICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2U8VCwgVT4oXG4gIHZhbDogVFtdLFxuICBpdGVyYXRvcjogTWVtb0FycmF5SXRlcmF0b3I8VCwgVT4sXG4gIGFjY3VtdWxhdG9yPzogVSxcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogVVxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZTxUPihcbiAgdmFsOiBzdHJpbmcsXG4gIGl0ZXJhdG9yOiBNZW1vU3RyaW5nSXRlcmF0b3I8VD4sXG4gIGFjY3VtdWxhdG9yPzogVCxcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogVFxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZTxUIGV4dGVuZHMge30sIFRWYWx1ZSwgVFJlc3VsdCA9IGFueT4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IE1lbW9PYmplY3RJdGVyYXRvcjxUVmFsdWUsIFRSZXN1bHQ+LFxuICBhY2N1bXVsYXRvcj86IFRSZXN1bHQsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IFRSZXN1bHRcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2UoXG4gIHZhbDogYW55LFxuICBpdGVyYXRvcjogYW55LFxuICBhY2N1bXVsYXRvcj86IGFueSxcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogYW55IHtcbiAgbGV0IHJlc3VsdCA9IGFjY3VtdWxhdG9yXG4gIGVhY2goXG4gICAgdmFsLFxuICAgIChpdGVtLCBrZXkpID0+IHtcbiAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yKHJlc3VsdCwgaXRlbSwga2V5KVxuICAgIH0sXG4gICAgcmV2ZXJ0XG4gIClcbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXZlcnk8VCBleHRlbmRzIHN0cmluZz4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IEVhY2hTdHJpbmdJdGVyYXRvcixcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogYm9vbGVhblxuZXhwb3J0IGZ1bmN0aW9uIGV2ZXJ5PFQ+KFxuICB2YWw6IFRbXSxcbiAgaXRlcmF0b3I6IEVhY2hBcnJheUl0ZXJhdG9yPFQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBib29sZWFuXG5leHBvcnQgZnVuY3Rpb24gZXZlcnk8VCBleHRlbmRzIHt9LCBUVmFsdWU+KFxuICB2YWw6IFQsXG4gIGl0ZXJhdG9yOiBFYWNoT2JqZWN0SXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGJvb2xlYW5cbmV4cG9ydCBmdW5jdGlvbiBldmVyeSh2YWw6IGFueSwgaXRlcmF0b3I6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICBsZXQgcmVzID0gdHJ1ZVxuICBlYWNoKFxuICAgIHZhbCxcbiAgICAoaXRlbSwga2V5KSA9PiB7XG4gICAgICBpZiAoIWl0ZXJhdG9yKGl0ZW0sIGtleSkpIHtcbiAgICAgICAgcmVzID0gZmFsc2VcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXZlcnRcbiAgKVxuICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb21lPFQgZXh0ZW5kcyBzdHJpbmc+KFxuICB2YWw6IFQsXG4gIGl0ZXJhdG9yOiBFYWNoU3RyaW5nSXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGJvb2xlYW5cbmV4cG9ydCBmdW5jdGlvbiBzb21lPFQ+KFxuICB2YWw6IFRbXSxcbiAgaXRlcmF0b3I6IEVhY2hBcnJheUl0ZXJhdG9yPFQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBib29sZWFuXG5leHBvcnQgZnVuY3Rpb24gc29tZTxUIGV4dGVuZHMge30sIFRWYWx1ZT4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IEVhY2hPYmplY3RJdGVyYXRvcixcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogYm9vbGVhblxuZXhwb3J0IGZ1bmN0aW9uIHNvbWUodmFsOiBhbnksIGl0ZXJhdG9yOiBhbnksIHJldmVydD86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgbGV0IHJlcyA9IGZhbHNlXG4gIGVhY2goXG4gICAgdmFsLFxuICAgIChpdGVtLCBrZXkpID0+IHtcbiAgICAgIGlmIChpdGVyYXRvcihpdGVtLCBrZXkpKSB7XG4gICAgICAgIHJlcyA9IHRydWVcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXZlcnRcbiAgKVxuICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW5kZXg8VCBleHRlbmRzIHN0cmluZz4oXG4gIHZhbDogVCxcbiAgaXRlcmF0b3I6IEVhY2hTdHJpbmdJdGVyYXRvcixcbiAgcmV2ZXJ0PzogYm9vbGVhblxuKTogbnVtYmVyXG5leHBvcnQgZnVuY3Rpb24gZmluZEluZGV4PFQ+KFxuICB2YWw6IFRbXSxcbiAgaXRlcmF0b3I6IEVhY2hBcnJheUl0ZXJhdG9yPFQ+LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBudW1iZXJcbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW5kZXg8VCBleHRlbmRzIHt9LCBUVmFsdWU+KFxuICB2YWw6IFQsXG4gIGl0ZXJhdG9yOiBFYWNoT2JqZWN0SXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGtleW9mIFRcbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW5kZXgoXG4gIHZhbDogYW55LFxuICBpdGVyYXRvcjogYW55LFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBzdHJpbmcgfCBudW1iZXIge1xuICBsZXQgcmVzOiBudW1iZXIgfCBzdHJpbmcgPSAtMVxuICBlYWNoKFxuICAgIHZhbCxcbiAgICAoaXRlbSwga2V5KSA9PiB7XG4gICAgICBpZiAoaXRlcmF0b3IoaXRlbSwga2V5KSkge1xuICAgICAgICByZXMgPSBrZXlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICByZXZlcnRcbiAgKVxuICByZXR1cm4gcmVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kPFQgZXh0ZW5kcyBzdHJpbmc+KFxuICB2YWw6IFQsXG4gIGl0ZXJhdG9yOiBFYWNoU3RyaW5nSXRlcmF0b3IsXG4gIHJldmVydD86IGJvb2xlYW5cbik6IGFueVxuZXhwb3J0IGZ1bmN0aW9uIGZpbmQ8VD4oXG4gIHZhbDogVFtdLFxuICBpdGVyYXRvcjogRWFjaEFycmF5SXRlcmF0b3I8VD4sXG4gIHJldmVydD86IGJvb2xlYW5cbik6IFRcbmV4cG9ydCBmdW5jdGlvbiBmaW5kPFQgZXh0ZW5kcyB7fSwgVFZhbHVlPihcbiAgdmFsOiBULFxuICBpdGVyYXRvcjogRWFjaE9iamVjdEl0ZXJhdG9yLFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBUW2tleW9mIFRdXG5leHBvcnQgZnVuY3Rpb24gZmluZCh2YWw6IGFueSwgaXRlcmF0b3I6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbik6IGFueSB7XG4gIGxldCByZXM6IGFueVxuICBlYWNoKFxuICAgIHZhbCxcbiAgICAoaXRlbSwga2V5KSA9PiB7XG4gICAgICBpZiAoaXRlcmF0b3IoaXRlbSwga2V5KSkge1xuICAgICAgICByZXMgPSBpdGVtXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0sXG4gICAgcmV2ZXJ0XG4gIClcbiAgcmV0dXJuIHJlc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5jbHVkZXM8VCBleHRlbmRzIHN0cmluZz4oXG4gIHZhbDogVCxcbiAgc2VhcmNoRWxlbWVudDogc3RyaW5nLFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBib29sZWFuXG5leHBvcnQgZnVuY3Rpb24gaW5jbHVkZXM8VD4oXG4gIHZhbDogVFtdLFxuICBzZWFyY2hFbGVtZW50OiBULFxuICByZXZlcnQ/OiBib29sZWFuXG4pOiBib29sZWFuXG5leHBvcnQgZnVuY3Rpb24gaW5jbHVkZXModmFsOiBhbnksIHNlYXJjaEVsZW1lbnQ6IGFueSwgcmV2ZXJ0PzogYm9vbGVhbikge1xuICBpZiAoaXNTdHIodmFsKSkgcmV0dXJuIHZhbC5pbmNsdWRlcyhzZWFyY2hFbGVtZW50KVxuICByZXR1cm4gc29tZSh2YWwsIGl0ZW0gPT4gaXRlbSA9PT0gc2VhcmNoRWxlbWVudCwgcmV2ZXJ0KVxufVxuIiwiZnVuY3Rpb24gZ2xvYmFsU2VsZigpIHtcbiAgdHJ5IHtcbiAgICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gc2VsZlxuICAgIH1cbiAgfSBjYXRjaCAoZSkge31cbiAgdHJ5IHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB3aW5kb3dcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHt9XG4gIHRyeSB7XG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZ2xvYmFsXG4gICAgfVxuICB9IGNhdGNoIChlKSB7fVxuICByZXR1cm4gRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKVxufVxuZXhwb3J0IGNvbnN0IGdsb2JhbFRoaXNQb2x5ZmlsbCA9IGdsb2JhbFNlbGYoKVxuIiwiaW1wb3J0IHsgZ2xvYmFsVGhpc1BvbHlmaWxsIH0gZnJvbSAnLi9nbG9iYWwnXG5pbXBvcnQgeyBpc1N0ciwgaXNGbiB9IGZyb20gJy4vdHlwZXMnXG5leHBvcnQgY29uc3QgaW5zdE9mID0gKHZhbHVlOiBhbnksIGNsczogYW55KSA9PiB7XG4gIGlmIChpc0ZuKGNscykpIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIGNsc1xuICBpZiAoaXNTdHIoY2xzKSlcbiAgICByZXR1cm4gZ2xvYmFsVGhpc1BvbHlmaWxsW2Nsc11cbiAgICAgID8gdmFsdWUgaW5zdGFuY2VvZiBnbG9iYWxUaGlzUG9seWZpbGxbY2xzXVxuICAgICAgOiBmYWxzZVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsImltcG9ydCB7IGlzRm4gfSBmcm9tICcuL3R5cGVzJ1xuXG5jb25zdCBCSUdfREFUQV9GTEFHID0gU3ltYm9sKCdfX0JJR19EQVRBX18nKVxuXG50eXBlIEJpZ0RhdGFPcHRpb25zID0ge1xuICBjb21wYXJlPzogKHByZXY6IGFueSwgY3VycmVudDogYW55LCBrZXk6IHN0cmluZykgPT4gYm9vbGVhblxuICBjbG9uZT86ICh2YWx1ZTogYW55KSA9PiBhbnlcbn1cblxuZXhwb3J0IGNsYXNzIEJpZ0RhdGEge1xuICBwcml2YXRlIG9wdGlvbnM6IEJpZ0RhdGFPcHRpb25zXG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IEJpZ0RhdGFPcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLi4ub3B0aW9uc1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZShkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIWRhdGFbQklHX0RBVEFfRkxBR10pIHtcbiAgICAgICAgZGF0YVtCSUdfREFUQV9GTEFHXSA9IHRoaXMub3B0aW9uc1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgc3RhdGljIGlzQmlnRGF0YSA9IChkYXRhOiBhbnkpID0+IHtcbiAgICByZXR1cm4gZGF0YSAmJiAhIWRhdGFbQklHX0RBVEFfRkxBR11cbiAgfVxuXG4gIHN0YXRpYyBjb21wYXJlID0gKGE6IGFueSwgYjogYW55KSA9PiB7XG4gICAgaWYgKEJpZ0RhdGEuaXNCaWdEYXRhKGEpICYmIEJpZ0RhdGEuaXNCaWdEYXRhKGIpKSB7XG4gICAgICBpZiAoYVtCSUdfREFUQV9GTEFHXSA9PT0gYltCSUdfREFUQV9GTEFHXSkge1xuICAgICAgICByZXR1cm4gaXNGbihhW0JJR19EQVRBX0ZMQUddLmNvbXBhcmUpXG4gICAgICAgICAgPyBhW0JJR19EQVRBX0ZMQUddLmNvbXBhcmUoYSwgYilcbiAgICAgICAgICA6IGEgPT09IGJcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gYSA9PT0gYlxuICB9XG5cbiAgc3RhdGljIGNsb25lID0gKHZhbHVlOiBhbnkpID0+IHtcbiAgICBpZiAoQmlnRGF0YS5pc0JpZ0RhdGEodmFsdWUpKSB7XG4gICAgICBpZiAoaXNGbih2YWx1ZVtCSUdfREFUQV9GTEFHXS5jbG9uZSkpIHtcbiAgICAgICAgY29uc3QgY3R4ID0gdmFsdWVbQklHX0RBVEFfRkxBR11cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdmFsdWVbQklHX0RBVEFfRkxBR10uY2xvbmUodmFsdWUpXG4gICAgICAgIHJlc3VsdFtCSUdfREFUQV9GTEFHXSA9IGN0eFxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG59XG4iLCJpbXBvcnQgeyBpc0ZuLCBpc0FyciB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBpbnN0T2YgfSBmcm9tICcuL2luc3RhbmNlb2YnXG5pbXBvcnQgeyBCaWdEYXRhIH0gZnJvbSAnLi9iaWctZGF0YSdcbmNvbnN0IGlzQXJyYXkgPSBpc0FyclxuY29uc3Qga2V5TGlzdCA9IE9iamVjdC5rZXlzXG5jb25zdCBoYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuXG50eXBlIEZpbHRlciA9IChjb21wYXJpZXM6IHsgYTogYW55OyBiOiBhbnkgfSwga2V5OiBzdHJpbmcpID0+IGJvb2xlYW5cblxuLyogZXNsaW50LWRpc2FibGUgKi9cbmZ1bmN0aW9uIGVxdWFsKGE6IGFueSwgYjogYW55LCBmaWx0ZXI/OiBGaWx0ZXIpIHtcbiAgLy8gZmFzdC1kZWVwLWVxdWFsIGluZGV4LmpzIDIuMC4xXG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGlmIChhICYmIGIgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnICYmIHR5cGVvZiBiID09PSAnb2JqZWN0Jykge1xuICAgIGNvbnN0IGJpZ0RhdGFBID0gQmlnRGF0YS5pc0JpZ0RhdGEoYSlcbiAgICBjb25zdCBiaWdEYXRhQiA9IEJpZ0RhdGEuaXNCaWdEYXRhKGIpXG5cbiAgICBpZiAoYmlnRGF0YUEgIT09IGJpZ0RhdGFCKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgaWYgKGJpZ0RhdGFBICYmIGJpZ0RhdGFCKSB7XG4gICAgICByZXR1cm4gQmlnRGF0YS5jb21wYXJlKGEsIGIpXG4gICAgfVxuXG4gICAgY29uc3QgYXJyQSA9IGlzQXJyYXkoYSlcbiAgICBjb25zdCBhcnJCID0gaXNBcnJheShiKVxuICAgIGxldCBpOiBudW1iZXJcbiAgICBsZXQgbGVuZ3RoOiBudW1iZXJcbiAgICBsZXQga2V5OiBzdHJpbmcgfCBudW1iZXJcblxuICAgIGlmIChhcnJBICYmIGFyckIpIHtcbiAgICAgIGxlbmd0aCA9IGEubGVuZ3RoXG4gICAgICBpZiAobGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tICE9PSAwOyApIHtcbiAgICAgICAgaWYgKCFlcXVhbChhW2ldLCBiW2ldLCBmaWx0ZXIpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKGFyckEgIT09IGFyckIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IG1vbWVudEEgPSBhICYmIGEuX2lzQU1vbWVudE9iamVjdFxuICAgIGNvbnN0IG1vbWVudEIgPSBiICYmIGIuX2lzQU1vbWVudE9iamVjdFxuICAgIGlmIChtb21lbnRBICE9PSBtb21lbnRCKSByZXR1cm4gZmFsc2VcbiAgICBpZiAobW9tZW50QSAmJiBtb21lbnRCKSByZXR1cm4gYS5pc1NhbWUoYilcbiAgICBjb25zdCBpbW11dGFibGVBID0gYSAmJiBhLnRvSlNcbiAgICBjb25zdCBpbW11dGFibGVCID0gYiAmJiBiLnRvSlNcbiAgICBpZiAoaW1tdXRhYmxlQSAhPT0gaW1tdXRhYmxlQikgcmV0dXJuIGZhbHNlXG4gICAgaWYgKGltbXV0YWJsZUEpIHJldHVybiBhLmlzID8gYS5pcyhiKSA6IGEgPT09IGJcbiAgICBjb25zdCBkYXRlQSA9IGluc3RPZihhLCAnRGF0ZScpXG4gICAgY29uc3QgZGF0ZUIgPSBpbnN0T2YoYiwgJ0RhdGUnKVxuICAgIGlmIChkYXRlQSAhPT0gZGF0ZUIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAoZGF0ZUEgJiYgZGF0ZUIpIHtcbiAgICAgIHJldHVybiBhLmdldFRpbWUoKSA9PT0gYi5nZXRUaW1lKClcbiAgICB9XG4gICAgY29uc3Qgc2NoZW1hQSA9IGEgJiYgYS50b0pTT05cbiAgICBjb25zdCBzY2hlbWFCID0gYiAmJiBiLnRvSlNPTlxuICAgIGlmIChzY2hlbWFBICE9PSBzY2hlbWFCKSByZXR1cm4gZmFsc2VcbiAgICBpZiAoc2NoZW1hQSAmJiBzY2hlbWFCKSByZXR1cm4gZXF1YWwoYS50b0pTT04oKSwgYi50b0pTT04oKSwgZmlsdGVyKVxuICAgIGNvbnN0IHJlZ2V4cEEgPSBpbnN0T2YoYSwgJ1JlZ0V4cCcpXG4gICAgY29uc3QgcmVnZXhwQiA9IGluc3RPZihiLCAnUmVnRXhwJylcbiAgICBpZiAocmVnZXhwQSAhPT0gcmVnZXhwQikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGlmIChyZWdleHBBICYmIHJlZ2V4cEIpIHtcbiAgICAgIHJldHVybiBhLnRvU3RyaW5nKCkgPT09IGIudG9TdHJpbmcoKVxuICAgIH1cbiAgICBjb25zdCB1cmxBID0gaW5zdE9mKGEsICdVUkwnKVxuICAgIGNvbnN0IHVybEIgPSBpbnN0T2YoYiwgJ1VSTCcpXG4gICAgaWYgKHVybEEgJiYgdXJsQikge1xuICAgICAgcmV0dXJuIGEuaHJlZiA9PT0gYi5ocmVmXG4gICAgfVxuXG4gICAgY29uc3Qga2V5cyA9IGtleUxpc3QoYSlcbiAgICBsZW5ndGggPSBrZXlzLmxlbmd0aFxuXG4gICAgaWYgKGxlbmd0aCAhPT0ga2V5TGlzdChiKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tICE9PSAwOyApIHtcbiAgICAgIGlmICghaGFzUHJvcC5jYWxsKGIsIGtleXNbaV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBlbmQgZmFzdC1kZWVwLWVxdWFsXG5cbiAgICAvLyBDdXN0b20gaGFuZGxpbmcgZm9yIFJlYWN0XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gIT09IDA7ICkge1xuICAgICAga2V5ID0ga2V5c1tpXVxuXG4gICAgICBpZiAoa2V5ID09PSAnX293bmVyJyAmJiBhLiQkdHlwZW9mKSB7XG4gICAgICAgIC8vIFJlYWN0LXNwZWNpZmljOiBhdm9pZCB0cmF2ZXJzaW5nIFJlYWN0IGVsZW1lbnRzJyBfb3duZXIuXG4gICAgICAgIC8vICBfb3duZXIgY29udGFpbnMgY2lyY3VsYXIgcmVmZXJlbmNlc1xuICAgICAgICAvLyBhbmQgaXMgbm90IG5lZWRlZCB3aGVuIGNvbXBhcmluZyB0aGUgYWN0dWFsIGVsZW1lbnRzIChhbmQgbm90IHRoZWlyIG93bmVycylcbiAgICAgICAgLy8gLiQkdHlwZW9mIGFuZCAuX3N0b3JlIG9uIGp1c3QgcmVhc29uYWJsZSBtYXJrZXJzIG9mIGEgcmVhY3QgZWxlbWVudFxuICAgICAgICBjb250aW51ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzRm4oZmlsdGVyKSkge1xuICAgICAgICAgIGlmIChmaWx0ZXIoeyBhOiBhW2tleV0sIGI6IGJba2V5XSB9LCBrZXkpKSB7XG4gICAgICAgICAgICBpZiAoIWVxdWFsKGFba2V5XSwgYltrZXldLCBmaWx0ZXIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBhbGwgb3RoZXIgcHJvcGVydGllcyBzaG91bGQgYmUgdHJhdmVyc2VkIGFzIHVzdWFsXG4gICAgICAgICAgaWYgKCFlcXVhbChhW2tleV0sIGJba2V5XSwgZmlsdGVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZmFzdC1kZWVwLWVxdWFsIGluZGV4LmpzIDIuMC4xXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHJldHVybiBhICE9PSBhICYmIGIgIT09IGJcbn1cbi8vIGVuZCBmYXN0LWRlZXAtZXF1YWxcblxuZXhwb3J0IGNvbnN0IGlzRXF1YWwgPSBmdW5jdGlvbiBleHBvcnRlZEVxdWFsKGE6IGFueSwgYjogYW55LCBmaWx0ZXI/OiBGaWx0ZXIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZXF1YWwoYSwgYiwgZmlsdGVyKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChcbiAgICAgIChlcnJvci5tZXNzYWdlICYmIGVycm9yLm1lc3NhZ2UubWF0Y2goL3N0YWNrfHJlY3Vyc2lvbi9pKSkgfHxcbiAgICAgIGVycm9yLm51bWJlciA9PT0gLTIxNDY4MjgyNjBcbiAgICApIHtcbiAgICAgIC8vIHdhcm4gb24gY2lyY3VsYXIgcmVmZXJlbmNlcywgZG9uJ3QgY3Jhc2hcbiAgICAgIC8vIGJyb3dzZXJzIGdpdmUgdGhpcyBkaWZmZXJlbnQgZXJyb3JzIG5hbWUgYW5kIG1lc3NhZ2VzOlxuICAgICAgLy8gY2hyb21lL3NhZmFyaTogXCJSYW5nZUVycm9yXCIsIFwiTWF4aW11bSBjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIlxuICAgICAgLy8gZmlyZWZveDogXCJJbnRlcm5hbEVycm9yXCIsIHRvbyBtdWNoIHJlY3Vyc2lvblwiXG4gICAgICAvLyBlZGdlOiBcIkVycm9yXCIsIFwiT3V0IG9mIHN0YWNrIHNwYWNlXCJcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1dhcm5pbmc6IHJlYWN0LWZhc3QtY29tcGFyZSBkb2VzIG5vdCBoYW5kbGUgY2lyY3VsYXIgcmVmZXJlbmNlcy4nLFxuICAgICAgICBlcnJvci5uYW1lLFxuICAgICAgICBlcnJvci5tZXNzYWdlXG4gICAgICApXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgLy8gc29tZSBvdGhlciBlcnJvci4gd2Ugc2hvdWxkIGRlZmluaXRlbHkga25vdyBhYm91dCB0aGVzZVxuICAgIHRocm93IGVycm9yXG4gIH1cbn1cbiIsImltcG9ydCB7IGlzRm4gfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgaW5zdE9mIH0gZnJvbSAnLi9pbnN0YW5jZW9mJ1xuaW1wb3J0IHsgQmlnRGF0YSB9IGZyb20gJy4vYmlnLWRhdGEnXG50eXBlIEZpbHRlciA9ICh2YWx1ZTogYW55LCBrZXk6IHN0cmluZykgPT4gYm9vbGVhblxuXG5jb25zdCBOQVRJVkVfS0VZUyA9IFtcbiAgWydNYXAnLCAobWFwOiBhbnkpID0+IG5ldyBNYXAobWFwKV0sXG4gIFsnV2Vha01hcCcsIChtYXA6IGFueSkgPT4gbmV3IFdlYWtNYXAobWFwKV0sXG4gIFsnV2Vha1NldCcsIChzZXQ6IGFueSkgPT4gbmV3IFdlYWtTZXQoc2V0KV0sXG4gIFsnU2V0JywgKHNldDogYW55KSA9PiBuZXcgU2V0KHNldCldLFxuICBbJ0RhdGUnLCAoZGF0ZTogYW55KSA9PiBuZXcgRGF0ZShkYXRlKV0sXG4gICdGaWxlTGlzdCcsXG4gICdGaWxlJyxcbiAgJ1VSTCcsXG4gICdSZWdFeHAnLFxuICBbXG4gICAgJ1Byb21pc2UnLFxuICAgIChwcm9taXNlOiBQcm9taXNlPGFueT4pID0+XG4gICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiBwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KSlcbiAgXVxuXVxuXG5jb25zdCBpc05hdGl2ZU9iamVjdCA9ICh2YWx1ZXM6IGFueSk6IGFueSA9PiB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgTkFUSVZFX0tFWVMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBpdGVtID0gTkFUSVZFX0tFWVNbaV1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtWzBdKSB7XG4gICAgICBpZiAoaW5zdE9mKHZhbHVlcywgaXRlbVswXSkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1bMV0gPyBpdGVtWzFdIDogaXRlbVswXVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaW5zdE9mKHZhbHVlcywgaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHNoYWxsb3dDbG9uZSA9ICh2YWx1ZXM6IGFueSkgPT4ge1xuICBsZXQgbmF0aXZlQ2xvbmU6ICh2YWx1ZXM6IGFueSkgPT4gYW55XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICByZXR1cm4gdmFsdWVzLnNsaWNlKDApXG4gIH0gZWxzZSBpZiAoaXNOYXRpdmVPYmplY3QodmFsdWVzKSkge1xuICAgIG5hdGl2ZUNsb25lID0gaXNOYXRpdmVPYmplY3QodmFsdWVzKVxuICAgIHJldHVybiBpc0ZuKG5hdGl2ZUNsb25lKSA/IG5hdGl2ZUNsb25lKHZhbHVlcykgOiB2YWx1ZXNcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSAnb2JqZWN0JyAmJiAhIXZhbHVlcykge1xuICAgIHJldHVybiB7XG4gICAgICAuLi52YWx1ZXNcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGNsb25lID0gKHZhbHVlczogYW55LCBmaWx0ZXI/OiBGaWx0ZXIpID0+IHtcbiAgbGV0IG5hdGl2ZUNsb25lOiAodmFsdWVzOiBhbnkpID0+IGFueVxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgcmV0dXJuIHZhbHVlcy5tYXAoaXRlbSA9PiBjbG9uZShpdGVtLCBmaWx0ZXIpKVxuICB9IGVsc2UgaWYgKGlzTmF0aXZlT2JqZWN0KHZhbHVlcykpIHtcbiAgICBuYXRpdmVDbG9uZSA9IGlzTmF0aXZlT2JqZWN0KHZhbHVlcylcbiAgICByZXR1cm4gaXNGbihuYXRpdmVDbG9uZSkgPyBuYXRpdmVDbG9uZSh2YWx1ZXMpIDogdmFsdWVzXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ29iamVjdCcgJiYgISF2YWx1ZXMpIHtcbiAgICBpZiAoJyQkdHlwZW9mJyBpbiB2YWx1ZXMgJiYgJ19vd25lcicgaW4gdmFsdWVzKSB7XG4gICAgICByZXR1cm4gdmFsdWVzXG4gICAgfVxuICAgIGlmICh2YWx1ZXMuX2lzQU1vbWVudE9iamVjdCkge1xuICAgICAgcmV0dXJuIHZhbHVlc1xuICAgIH1cbiAgICBpZiAodmFsdWVzLl9pc0pTT05TY2hlbWFPYmplY3QpIHtcbiAgICAgIHJldHVybiB2YWx1ZXNcbiAgICB9XG4gICAgaWYgKEJpZ0RhdGEuaXNCaWdEYXRhKHZhbHVlcykpIHtcbiAgICAgIHJldHVybiBCaWdEYXRhLmNsb25lKHZhbHVlcylcbiAgICB9XG4gICAgaWYgKGlzRm4odmFsdWVzLnRvSlMpKSB7XG4gICAgICByZXR1cm4gdmFsdWVzXG4gICAgfVxuICAgIGlmIChpc0ZuKHZhbHVlcy50b0pTT04pKSB7XG4gICAgICByZXR1cm4gdmFsdWVzXG4gICAgfVxuICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHZhbHVlcyB8fCB7fSkubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdmFsdWVzXG4gICAgfVxuICAgIGNvbnN0IHJlcyA9IHt9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdmFsdWVzKSB7XG4gICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodmFsdWVzLCBrZXkpKSB7XG4gICAgICAgIGlmIChpc0ZuKGZpbHRlcikpIHtcbiAgICAgICAgICBpZiAoZmlsdGVyKHZhbHVlc1trZXldLCBrZXkpKSB7XG4gICAgICAgICAgICByZXNba2V5XSA9IGNsb25lKHZhbHVlc1trZXldLCBmaWx0ZXIpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc1trZXldID0gdmFsdWVzW2tleV1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzW2tleV0gPSBjbG9uZSh2YWx1ZXNba2V5XSwgZmlsdGVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXNcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWVzXG4gIH1cbn1cbiIsImltcG9ydCB7IGluc3RPZiB9IGZyb20gJy4vaW5zdGFuY2VvZidcbmNvbnN0IGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcblxuY29uc3QgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbmV4cG9ydCBjb25zdCBpc1ZhbGlkID0gKHZhbDogYW55KSA9PiB2YWwgIT09IHVuZGVmaW5lZCAmJiB2YWwgIT09IG51bGxcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRW1wdHkodmFsOiBhbnkpOiBib29sZWFuIHtcbiAgLy8gTnVsbCBhbmQgVW5kZWZpbmVkLi4uXG4gIGlmICh2YWwgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvLyBCb29sZWFucy4uLlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBOdW1iZXJzLi4uXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgLy8gU3RyaW5ncy4uLlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsLmxlbmd0aCA9PT0gMFxuICB9XG5cbiAgLy8gRnVuY3Rpb25zLi4uXG4gIGlmICh0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHZhbC5sZW5ndGggPT09IDBcbiAgfVxuXG4gIC8vIEFycmF5cy4uLlxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHZhbFtpXSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHZhbFtpXSAhPT0gbnVsbCAmJlxuICAgICAgICB2YWxbaV0gIT09ICcnICYmXG4gICAgICAgIHZhbFtpXSAhPT0gMFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLy8gRXJyb3JzLi4uXG4gIGlmIChpbnN0T2YodmFsLCAnRXJyb3InKSkge1xuICAgIHJldHVybiB2YWwubWVzc2FnZSA9PT0gJydcbiAgfVxuXG4gIC8vIE9iamVjdHMuLi5cbiAgaWYgKHZhbC50b1N0cmluZyA9PT0gdG9TdHJpbmcpIHtcbiAgICBzd2l0Y2ggKHZhbC50b1N0cmluZygpKSB7XG4gICAgICAvLyBNYXBzLCBTZXRzLCBGaWxlcyBhbmQgRXJyb3JzLi4uXG4gICAgICBjYXNlICdbb2JqZWN0IEZpbGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgTWFwXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IFNldF0nOiB7XG4gICAgICAgIHJldHVybiB2YWwuc2l6ZSA9PT0gMFxuICAgICAgfVxuXG4gICAgICAvLyBQbGFpbiBvYmplY3RzLi4uXG4gICAgICBjYXNlICdbb2JqZWN0IE9iamVjdF0nOiB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHZhbCkge1xuICAgICAgICAgIGlmIChoYXMuY2FsbCh2YWwsIGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQW55dGhpbmcgZWxzZS4uLlxuICByZXR1cm4gZmFsc2Vcbn1cbiIsIi8qKlxuICogU3BlY2lhbCBsYW5ndWFnZS1zcGVjaWZpYyBvdmVycmlkZXMuXG4gKlxuICogU291cmNlOiBmdHA6Ly9mdHAudW5pY29kZS5vcmcvUHVibGljL1VDRC9sYXRlc3QvdWNkL1NwZWNpYWxDYXNpbmcudHh0XG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIExBTkdVQUdFUyA9IHtcbiAgdHI6IHtcbiAgICByZWdleHA6IC9bXFx1MDA2OV0vZyxcbiAgICBtYXA6IHtcbiAgICAgICdcXHUwMDY5JzogJ1xcdTAxMzAnXG4gICAgfVxuICB9LFxuICBhejoge1xuICAgIHJlZ2V4cDogL1tcXHUwMDY5XS9nLFxuICAgIG1hcDoge1xuICAgICAgJ1xcdTAwNjknOiAnXFx1MDEzMCdcbiAgICB9XG4gIH0sXG4gIGx0OiB7XG4gICAgcmVnZXhwOiAvW1xcdTAwNjlcXHUwMDZBXFx1MDEyRl1cXHUwMzA3fFxcdTAwNjlcXHUwMzA3W1xcdTAzMDBcXHUwMzAxXFx1MDMwM10vZyxcbiAgICBtYXA6IHtcbiAgICAgICdcXHUwMDY5XFx1MDMwNyc6ICdcXHUwMDQ5JyxcbiAgICAgICdcXHUwMDZBXFx1MDMwNyc6ICdcXHUwMDRBJyxcbiAgICAgICdcXHUwMTJGXFx1MDMwNyc6ICdcXHUwMTJFJyxcbiAgICAgICdcXHUwMDY5XFx1MDMwN1xcdTAzMDAnOiAnXFx1MDBDQycsXG4gICAgICAnXFx1MDA2OVxcdTAzMDdcXHUwMzAxJzogJ1xcdTAwQ0QnLFxuICAgICAgJ1xcdTAwNjlcXHUwMzA3XFx1MDMwMyc6ICdcXHUwMTI4J1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFVwcGVyIGNhc2UgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyLCBsb2NhbGUpIHtcbiAgdmFyIGxhbmcgPSBMQU5HVUFHRVNbbG9jYWxlXVxuXG4gIHN0ciA9IHN0ciA9PSBudWxsID8gJycgOiBTdHJpbmcoc3RyKVxuXG4gIGlmIChsYW5nKSB7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UobGFuZy5yZWdleHAsIGZ1bmN0aW9uIChtKSB7IHJldHVybiBsYW5nLm1hcFttXSB9KVxuICB9XG5cbiAgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpXG59XG4iLCIvKipcbiAqIFNwZWNpYWwgbGFuZ3VhZ2Utc3BlY2lmaWMgb3ZlcnJpZGVzLlxuICpcbiAqIFNvdXJjZTogZnRwOi8vZnRwLnVuaWNvZGUub3JnL1B1YmxpYy9VQ0QvbGF0ZXN0L3VjZC9TcGVjaWFsQ2FzaW5nLnR4dFxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBMQU5HVUFHRVMgPSB7XG4gIHRyOiB7XG4gICAgcmVnZXhwOiAvXFx1MDEzMHxcXHUwMDQ5fFxcdTAwNDlcXHUwMzA3L2csXG4gICAgbWFwOiB7XG4gICAgICAnXFx1MDEzMCc6ICdcXHUwMDY5JyxcbiAgICAgICdcXHUwMDQ5JzogJ1xcdTAxMzEnLFxuICAgICAgJ1xcdTAwNDlcXHUwMzA3JzogJ1xcdTAwNjknXG4gICAgfVxuICB9LFxuICBhejoge1xuICAgIHJlZ2V4cDogL1tcXHUwMTMwXS9nLFxuICAgIG1hcDoge1xuICAgICAgJ1xcdTAxMzAnOiAnXFx1MDA2OScsXG4gICAgICAnXFx1MDA0OSc6ICdcXHUwMTMxJyxcbiAgICAgICdcXHUwMDQ5XFx1MDMwNyc6ICdcXHUwMDY5J1xuICAgIH1cbiAgfSxcbiAgbHQ6IHtcbiAgICByZWdleHA6IC9bXFx1MDA0OVxcdTAwNEFcXHUwMTJFXFx1MDBDQ1xcdTAwQ0RcXHUwMTI4XS9nLFxuICAgIG1hcDoge1xuICAgICAgJ1xcdTAwNDknOiAnXFx1MDA2OVxcdTAzMDcnLFxuICAgICAgJ1xcdTAwNEEnOiAnXFx1MDA2QVxcdTAzMDcnLFxuICAgICAgJ1xcdTAxMkUnOiAnXFx1MDEyRlxcdTAzMDcnLFxuICAgICAgJ1xcdTAwQ0MnOiAnXFx1MDA2OVxcdTAzMDdcXHUwMzAwJyxcbiAgICAgICdcXHUwMENEJzogJ1xcdTAwNjlcXHUwMzA3XFx1MDMwMScsXG4gICAgICAnXFx1MDEyOCc6ICdcXHUwMDY5XFx1MDMwN1xcdTAzMDMnXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTG93ZXJjYXNlIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0ciwgbG9jYWxlKSB7XG4gIHZhciBsYW5nID0gTEFOR1VBR0VTW2xvY2FsZV1cblxuICBzdHIgPSBzdHIgPT0gbnVsbCA/ICcnIDogU3RyaW5nKHN0cilcblxuICBpZiAobGFuZykge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKGxhbmcucmVnZXhwLCBmdW5jdGlvbiAobSkgeyByZXR1cm4gbGFuZy5tYXBbbV0gfSlcbiAgfVxuXG4gIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAvW15BLVphLXpcXHhBQVxceEI1XFx4QkFcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3MC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFLVxcdTAzQTFcXHUwM0EzLVxcdTAzRjVcXHUwM0Y3LVxcdTA0ODFcXHUwNDhBLVxcdTA1MkZcXHUwNTMxLVxcdTA1NTZcXHUwNTU5XFx1MDU2MS1cXHUwNTg3XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFNVxcdTA2RTZcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3Q0EtXFx1MDdFQVxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MDAtXFx1MDgxNVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA4NDAtXFx1MDg1OFxcdTA4QTAtXFx1MDhCNFxcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3MS1cXHUwOTgwXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEFGOVxcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNEXFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjFcXHUwQjcxXFx1MEI4M1xcdTBCODUtXFx1MEI4QVxcdTBCOEUtXFx1MEI5MFxcdTBCOTItXFx1MEI5NVxcdTBCOTlcXHUwQjlBXFx1MEI5Q1xcdTBCOUVcXHUwQjlGXFx1MEJBM1xcdTBCQTRcXHUwQkE4LVxcdTBCQUFcXHUwQkFFLVxcdTBCQjlcXHUwQkQwXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRFxcdTBDNTgtXFx1MEM1QVxcdTBDNjBcXHUwQzYxXFx1MEM4NS1cXHUwQzhDXFx1MEM4RS1cXHUwQzkwXFx1MEM5Mi1cXHUwQ0E4XFx1MENBQS1cXHUwQ0IzXFx1MENCNS1cXHUwQ0I5XFx1MENCRFxcdTBDREVcXHUwQ0UwXFx1MENFMVxcdTBDRjFcXHUwQ0YyXFx1MEQwNS1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRFxcdTBENEVcXHUwRDVGLVxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDZcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFQzZcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRlxcdTEwNTAtXFx1MTA1NVxcdTEwNUEtXFx1MTA1RFxcdTEwNjFcXHUxMDY1XFx1MTA2NlxcdTEwNkUtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwOEVcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEwRDAtXFx1MTBGQVxcdTEwRkMtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTNBMC1cXHUxM0Y1XFx1MTNGOC1cXHUxM0ZEXFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTZGMS1cXHUxNkY4XFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEN1xcdTE3RENcXHUxODIwLVxcdTE4NzdcXHUxODgwLVxcdTE4QThcXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFFXFx1MTk1MC1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlCMC1cXHUxOUM5XFx1MUEwMC1cXHUxQTE2XFx1MUEyMC1cXHUxQTU0XFx1MUFBN1xcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzdEXFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUxRDAwLVxcdTFEQkZcXHUxRTAwLVxcdTFGMTVcXHUxRjE4LVxcdTFGMURcXHUxRjIwLVxcdTFGNDVcXHUxRjQ4LVxcdTFGNERcXHUxRjUwLVxcdTFGNTdcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGLVxcdTFGN0RcXHUxRjgwLVxcdTFGQjRcXHUxRkI2LVxcdTFGQkNcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNi1cXHUxRkNDXFx1MUZEMC1cXHUxRkQzXFx1MUZENi1cXHUxRkRCXFx1MUZFMC1cXHUxRkVDXFx1MUZGMi1cXHUxRkY0XFx1MUZGNi1cXHUxRkZDXFx1MjA3MVxcdTIwN0ZcXHUyMDkwLVxcdTIwOUNcXHUyMTAyXFx1MjEwN1xcdTIxMEEtXFx1MjExM1xcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTJGLVxcdTIxMzlcXHUyMTNDLVxcdTIxM0ZcXHUyMTQ1LVxcdTIxNDlcXHUyMTRFXFx1MjE4M1xcdTIxODRcXHUyQzAwLVxcdTJDMkVcXHUyQzMwLVxcdTJDNUVcXHUyQzYwLVxcdTJDRTRcXHUyQ0VCLVxcdTJDRUVcXHUyQ0YyXFx1MkNGM1xcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1MkQzMC1cXHUyRDY3XFx1MkQ2RlxcdTJEODAtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTJFMkZcXHUzMDA1XFx1MzAwNlxcdTMwMzEtXFx1MzAzNVxcdTMwM0JcXHUzMDNDXFx1MzA0MS1cXHUzMDk2XFx1MzA5RC1cXHUzMDlGXFx1MzBBMS1cXHUzMEZBXFx1MzBGQy1cXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkQ1XFx1QTAwMC1cXHVBNDhDXFx1QTREMC1cXHVBNEZEXFx1QTUwMC1cXHVBNjBDXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjQwLVxcdUE2NkVcXHVBNjdGLVxcdUE2OURcXHVBNkEwLVxcdUE2RTVcXHVBNzE3LVxcdUE3MUZcXHVBNzIyLVxcdUE3ODhcXHVBNzhCLVxcdUE3QURcXHVBN0IwLVxcdUE3QjdcXHVBN0Y3LVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE5MEEtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5Q0ZcXHVBOUUwLVxcdUE5RTRcXHVBOUU2LVxcdUE5RUZcXHVBOUZBLVxcdUE5RkVcXHVBQTAwLVxcdUFBMjhcXHVBQTQwLVxcdUFBNDJcXHVBQTQ0LVxcdUFBNEJcXHVBQTYwLVxcdUFBNzZcXHVBQTdBXFx1QUE3RS1cXHVBQUFGXFx1QUFCMVxcdUFBQjVcXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCLVxcdUFBRERcXHVBQUUwLVxcdUFBRUFcXHVBQUYyLVxcdUFBRjRcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQjMwLVxcdUFCNUFcXHVBQjVDLVxcdUFCNjVcXHVBQjcwLVxcdUFCRTJcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjIxLVxcdUZGM0FcXHVGRjQxLVxcdUZGNUFcXHVGRjY2LVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGREMwLTlcXHhCMlxceEIzXFx4QjlcXHhCQy1cXHhCRVxcdTA2NjAtXFx1MDY2OVxcdTA2RjAtXFx1MDZGOVxcdTA3QzAtXFx1MDdDOVxcdTA5NjYtXFx1MDk2RlxcdTA5RTYtXFx1MDlFRlxcdTA5RjQtXFx1MDlGOVxcdTBBNjYtXFx1MEE2RlxcdTBBRTYtXFx1MEFFRlxcdTBCNjYtXFx1MEI2RlxcdTBCNzItXFx1MEI3N1xcdTBCRTYtXFx1MEJGMlxcdTBDNjYtXFx1MEM2RlxcdTBDNzgtXFx1MEM3RVxcdTBDRTYtXFx1MENFRlxcdTBENjYtXFx1MEQ3NVxcdTBERTYtXFx1MERFRlxcdTBFNTAtXFx1MEU1OVxcdTBFRDAtXFx1MEVEOVxcdTBGMjAtXFx1MEYzM1xcdTEwNDAtXFx1MTA0OVxcdTEwOTAtXFx1MTA5OVxcdTEzNjktXFx1MTM3Q1xcdTE2RUUtXFx1MTZGMFxcdTE3RTAtXFx1MTdFOVxcdTE3RjAtXFx1MTdGOVxcdTE4MTAtXFx1MTgxOVxcdTE5NDYtXFx1MTk0RlxcdTE5RDAtXFx1MTlEQVxcdTFBODAtXFx1MUE4OVxcdTFBOTAtXFx1MUE5OVxcdTFCNTAtXFx1MUI1OVxcdTFCQjAtXFx1MUJCOVxcdTFDNDAtXFx1MUM0OVxcdTFDNTAtXFx1MUM1OVxcdTIwNzBcXHUyMDc0LVxcdTIwNzlcXHUyMDgwLVxcdTIwODlcXHUyMTUwLVxcdTIxODJcXHUyMTg1LVxcdTIxODlcXHUyNDYwLVxcdTI0OUJcXHUyNEVBLVxcdTI0RkZcXHUyNzc2LVxcdTI3OTNcXHUyQ0ZEXFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMzgtXFx1MzAzQVxcdTMxOTItXFx1MzE5NVxcdTMyMjAtXFx1MzIyOVxcdTMyNDgtXFx1MzI0RlxcdTMyNTEtXFx1MzI1RlxcdTMyODAtXFx1MzI4OVxcdTMyQjEtXFx1MzJCRlxcdUE2MjAtXFx1QTYyOVxcdUE2RTYtXFx1QTZFRlxcdUE4MzAtXFx1QTgzNVxcdUE4RDAtXFx1QThEOVxcdUE5MDAtXFx1QTkwOVxcdUE5RDAtXFx1QTlEOVxcdUE5RjAtXFx1QTlGOVxcdUFBNTAtXFx1QUE1OVxcdUFCRjAtXFx1QUJGOVxcdUZGMTAtXFx1RkYxOV0rL2dcbiIsIm1vZHVsZS5leHBvcnRzID0gLyhbYS16XFx4QjVcXHhERi1cXHhGNlxceEY4LVxceEZGXFx1MDEwMVxcdTAxMDNcXHUwMTA1XFx1MDEwN1xcdTAxMDlcXHUwMTBCXFx1MDEwRFxcdTAxMEZcXHUwMTExXFx1MDExM1xcdTAxMTVcXHUwMTE3XFx1MDExOVxcdTAxMUJcXHUwMTFEXFx1MDExRlxcdTAxMjFcXHUwMTIzXFx1MDEyNVxcdTAxMjdcXHUwMTI5XFx1MDEyQlxcdTAxMkRcXHUwMTJGXFx1MDEzMVxcdTAxMzNcXHUwMTM1XFx1MDEzN1xcdTAxMzhcXHUwMTNBXFx1MDEzQ1xcdTAxM0VcXHUwMTQwXFx1MDE0MlxcdTAxNDRcXHUwMTQ2XFx1MDE0OFxcdTAxNDlcXHUwMTRCXFx1MDE0RFxcdTAxNEZcXHUwMTUxXFx1MDE1M1xcdTAxNTVcXHUwMTU3XFx1MDE1OVxcdTAxNUJcXHUwMTVEXFx1MDE1RlxcdTAxNjFcXHUwMTYzXFx1MDE2NVxcdTAxNjdcXHUwMTY5XFx1MDE2QlxcdTAxNkRcXHUwMTZGXFx1MDE3MVxcdTAxNzNcXHUwMTc1XFx1MDE3N1xcdTAxN0FcXHUwMTdDXFx1MDE3RS1cXHUwMTgwXFx1MDE4M1xcdTAxODVcXHUwMTg4XFx1MDE4Q1xcdTAxOERcXHUwMTkyXFx1MDE5NVxcdTAxOTktXFx1MDE5QlxcdTAxOUVcXHUwMUExXFx1MDFBM1xcdTAxQTVcXHUwMUE4XFx1MDFBQVxcdTAxQUJcXHUwMUFEXFx1MDFCMFxcdTAxQjRcXHUwMUI2XFx1MDFCOVxcdTAxQkFcXHUwMUJELVxcdTAxQkZcXHUwMUM2XFx1MDFDOVxcdTAxQ0NcXHUwMUNFXFx1MDFEMFxcdTAxRDJcXHUwMUQ0XFx1MDFENlxcdTAxRDhcXHUwMURBXFx1MDFEQ1xcdTAxRERcXHUwMURGXFx1MDFFMVxcdTAxRTNcXHUwMUU1XFx1MDFFN1xcdTAxRTlcXHUwMUVCXFx1MDFFRFxcdTAxRUZcXHUwMUYwXFx1MDFGM1xcdTAxRjVcXHUwMUY5XFx1MDFGQlxcdTAxRkRcXHUwMUZGXFx1MDIwMVxcdTAyMDNcXHUwMjA1XFx1MDIwN1xcdTAyMDlcXHUwMjBCXFx1MDIwRFxcdTAyMEZcXHUwMjExXFx1MDIxM1xcdTAyMTVcXHUwMjE3XFx1MDIxOVxcdTAyMUJcXHUwMjFEXFx1MDIxRlxcdTAyMjFcXHUwMjIzXFx1MDIyNVxcdTAyMjdcXHUwMjI5XFx1MDIyQlxcdTAyMkRcXHUwMjJGXFx1MDIzMVxcdTAyMzMtXFx1MDIzOVxcdTAyM0NcXHUwMjNGXFx1MDI0MFxcdTAyNDJcXHUwMjQ3XFx1MDI0OVxcdTAyNEJcXHUwMjREXFx1MDI0Ri1cXHUwMjkzXFx1MDI5NS1cXHUwMkFGXFx1MDM3MVxcdTAzNzNcXHUwMzc3XFx1MDM3Qi1cXHUwMzdEXFx1MDM5MFxcdTAzQUMtXFx1MDNDRVxcdTAzRDBcXHUwM0QxXFx1MDNENS1cXHUwM0Q3XFx1MDNEOVxcdTAzREJcXHUwM0REXFx1MDNERlxcdTAzRTFcXHUwM0UzXFx1MDNFNVxcdTAzRTdcXHUwM0U5XFx1MDNFQlxcdTAzRURcXHUwM0VGLVxcdTAzRjNcXHUwM0Y1XFx1MDNGOFxcdTAzRkJcXHUwM0ZDXFx1MDQzMC1cXHUwNDVGXFx1MDQ2MVxcdTA0NjNcXHUwNDY1XFx1MDQ2N1xcdTA0NjlcXHUwNDZCXFx1MDQ2RFxcdTA0NkZcXHUwNDcxXFx1MDQ3M1xcdTA0NzVcXHUwNDc3XFx1MDQ3OVxcdTA0N0JcXHUwNDdEXFx1MDQ3RlxcdTA0ODFcXHUwNDhCXFx1MDQ4RFxcdTA0OEZcXHUwNDkxXFx1MDQ5M1xcdTA0OTVcXHUwNDk3XFx1MDQ5OVxcdTA0OUJcXHUwNDlEXFx1MDQ5RlxcdTA0QTFcXHUwNEEzXFx1MDRBNVxcdTA0QTdcXHUwNEE5XFx1MDRBQlxcdTA0QURcXHUwNEFGXFx1MDRCMVxcdTA0QjNcXHUwNEI1XFx1MDRCN1xcdTA0QjlcXHUwNEJCXFx1MDRCRFxcdTA0QkZcXHUwNEMyXFx1MDRDNFxcdTA0QzZcXHUwNEM4XFx1MDRDQVxcdTA0Q0NcXHUwNENFXFx1MDRDRlxcdTA0RDFcXHUwNEQzXFx1MDRENVxcdTA0RDdcXHUwNEQ5XFx1MDREQlxcdTA0RERcXHUwNERGXFx1MDRFMVxcdTA0RTNcXHUwNEU1XFx1MDRFN1xcdTA0RTlcXHUwNEVCXFx1MDRFRFxcdTA0RUZcXHUwNEYxXFx1MDRGM1xcdTA0RjVcXHUwNEY3XFx1MDRGOVxcdTA0RkJcXHUwNEZEXFx1MDRGRlxcdTA1MDFcXHUwNTAzXFx1MDUwNVxcdTA1MDdcXHUwNTA5XFx1MDUwQlxcdTA1MERcXHUwNTBGXFx1MDUxMVxcdTA1MTNcXHUwNTE1XFx1MDUxN1xcdTA1MTlcXHUwNTFCXFx1MDUxRFxcdTA1MUZcXHUwNTIxXFx1MDUyM1xcdTA1MjVcXHUwNTI3XFx1MDUyOVxcdTA1MkJcXHUwNTJEXFx1MDUyRlxcdTA1NjEtXFx1MDU4N1xcdTEzRjgtXFx1MTNGRFxcdTFEMDAtXFx1MUQyQlxcdTFENkItXFx1MUQ3N1xcdTFENzktXFx1MUQ5QVxcdTFFMDFcXHUxRTAzXFx1MUUwNVxcdTFFMDdcXHUxRTA5XFx1MUUwQlxcdTFFMERcXHUxRTBGXFx1MUUxMVxcdTFFMTNcXHUxRTE1XFx1MUUxN1xcdTFFMTlcXHUxRTFCXFx1MUUxRFxcdTFFMUZcXHUxRTIxXFx1MUUyM1xcdTFFMjVcXHUxRTI3XFx1MUUyOVxcdTFFMkJcXHUxRTJEXFx1MUUyRlxcdTFFMzFcXHUxRTMzXFx1MUUzNVxcdTFFMzdcXHUxRTM5XFx1MUUzQlxcdTFFM0RcXHUxRTNGXFx1MUU0MVxcdTFFNDNcXHUxRTQ1XFx1MUU0N1xcdTFFNDlcXHUxRTRCXFx1MUU0RFxcdTFFNEZcXHUxRTUxXFx1MUU1M1xcdTFFNTVcXHUxRTU3XFx1MUU1OVxcdTFFNUJcXHUxRTVEXFx1MUU1RlxcdTFFNjFcXHUxRTYzXFx1MUU2NVxcdTFFNjdcXHUxRTY5XFx1MUU2QlxcdTFFNkRcXHUxRTZGXFx1MUU3MVxcdTFFNzNcXHUxRTc1XFx1MUU3N1xcdTFFNzlcXHUxRTdCXFx1MUU3RFxcdTFFN0ZcXHUxRTgxXFx1MUU4M1xcdTFFODVcXHUxRTg3XFx1MUU4OVxcdTFFOEJcXHUxRThEXFx1MUU4RlxcdTFFOTFcXHUxRTkzXFx1MUU5NS1cXHUxRTlEXFx1MUU5RlxcdTFFQTFcXHUxRUEzXFx1MUVBNVxcdTFFQTdcXHUxRUE5XFx1MUVBQlxcdTFFQURcXHUxRUFGXFx1MUVCMVxcdTFFQjNcXHUxRUI1XFx1MUVCN1xcdTFFQjlcXHUxRUJCXFx1MUVCRFxcdTFFQkZcXHUxRUMxXFx1MUVDM1xcdTFFQzVcXHUxRUM3XFx1MUVDOVxcdTFFQ0JcXHUxRUNEXFx1MUVDRlxcdTFFRDFcXHUxRUQzXFx1MUVENVxcdTFFRDdcXHUxRUQ5XFx1MUVEQlxcdTFFRERcXHUxRURGXFx1MUVFMVxcdTFFRTNcXHUxRUU1XFx1MUVFN1xcdTFFRTlcXHUxRUVCXFx1MUVFRFxcdTFFRUZcXHUxRUYxXFx1MUVGM1xcdTFFRjVcXHUxRUY3XFx1MUVGOVxcdTFFRkJcXHUxRUZEXFx1MUVGRi1cXHUxRjA3XFx1MUYxMC1cXHUxRjE1XFx1MUYyMC1cXHUxRjI3XFx1MUYzMC1cXHUxRjM3XFx1MUY0MC1cXHUxRjQ1XFx1MUY1MC1cXHUxRjU3XFx1MUY2MC1cXHUxRjY3XFx1MUY3MC1cXHUxRjdEXFx1MUY4MC1cXHUxRjg3XFx1MUY5MC1cXHUxRjk3XFx1MUZBMC1cXHUxRkE3XFx1MUZCMC1cXHUxRkI0XFx1MUZCNlxcdTFGQjdcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNlxcdTFGQzdcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2XFx1MUZEN1xcdTFGRTAtXFx1MUZFN1xcdTFGRjItXFx1MUZGNFxcdTFGRjZcXHUxRkY3XFx1MjEwQVxcdTIxMEVcXHUyMTBGXFx1MjExM1xcdTIxMkZcXHUyMTM0XFx1MjEzOVxcdTIxM0NcXHUyMTNEXFx1MjE0Ni1cXHUyMTQ5XFx1MjE0RVxcdTIxODRcXHUyQzMwLVxcdTJDNUVcXHUyQzYxXFx1MkM2NVxcdTJDNjZcXHUyQzY4XFx1MkM2QVxcdTJDNkNcXHUyQzcxXFx1MkM3M1xcdTJDNzRcXHUyQzc2LVxcdTJDN0JcXHUyQzgxXFx1MkM4M1xcdTJDODVcXHUyQzg3XFx1MkM4OVxcdTJDOEJcXHUyQzhEXFx1MkM4RlxcdTJDOTFcXHUyQzkzXFx1MkM5NVxcdTJDOTdcXHUyQzk5XFx1MkM5QlxcdTJDOURcXHUyQzlGXFx1MkNBMVxcdTJDQTNcXHUyQ0E1XFx1MkNBN1xcdTJDQTlcXHUyQ0FCXFx1MkNBRFxcdTJDQUZcXHUyQ0IxXFx1MkNCM1xcdTJDQjVcXHUyQ0I3XFx1MkNCOVxcdTJDQkJcXHUyQ0JEXFx1MkNCRlxcdTJDQzFcXHUyQ0MzXFx1MkNDNVxcdTJDQzdcXHUyQ0M5XFx1MkNDQlxcdTJDQ0RcXHUyQ0NGXFx1MkNEMVxcdTJDRDNcXHUyQ0Q1XFx1MkNEN1xcdTJDRDlcXHUyQ0RCXFx1MkNERFxcdTJDREZcXHUyQ0UxXFx1MkNFM1xcdTJDRTRcXHUyQ0VDXFx1MkNFRVxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdUE2NDFcXHVBNjQzXFx1QTY0NVxcdUE2NDdcXHVBNjQ5XFx1QTY0QlxcdUE2NERcXHVBNjRGXFx1QTY1MVxcdUE2NTNcXHVBNjU1XFx1QTY1N1xcdUE2NTlcXHVBNjVCXFx1QTY1RFxcdUE2NUZcXHVBNjYxXFx1QTY2M1xcdUE2NjVcXHVBNjY3XFx1QTY2OVxcdUE2NkJcXHVBNjZEXFx1QTY4MVxcdUE2ODNcXHVBNjg1XFx1QTY4N1xcdUE2ODlcXHVBNjhCXFx1QTY4RFxcdUE2OEZcXHVBNjkxXFx1QTY5M1xcdUE2OTVcXHVBNjk3XFx1QTY5OVxcdUE2OUJcXHVBNzIzXFx1QTcyNVxcdUE3MjdcXHVBNzI5XFx1QTcyQlxcdUE3MkRcXHVBNzJGLVxcdUE3MzFcXHVBNzMzXFx1QTczNVxcdUE3MzdcXHVBNzM5XFx1QTczQlxcdUE3M0RcXHVBNzNGXFx1QTc0MVxcdUE3NDNcXHVBNzQ1XFx1QTc0N1xcdUE3NDlcXHVBNzRCXFx1QTc0RFxcdUE3NEZcXHVBNzUxXFx1QTc1M1xcdUE3NTVcXHVBNzU3XFx1QTc1OVxcdUE3NUJcXHVBNzVEXFx1QTc1RlxcdUE3NjFcXHVBNzYzXFx1QTc2NVxcdUE3NjdcXHVBNzY5XFx1QTc2QlxcdUE3NkRcXHVBNzZGXFx1QTc3MS1cXHVBNzc4XFx1QTc3QVxcdUE3N0NcXHVBNzdGXFx1QTc4MVxcdUE3ODNcXHVBNzg1XFx1QTc4N1xcdUE3OENcXHVBNzhFXFx1QTc5MVxcdUE3OTMtXFx1QTc5NVxcdUE3OTdcXHVBNzk5XFx1QTc5QlxcdUE3OURcXHVBNzlGXFx1QTdBMVxcdUE3QTNcXHVBN0E1XFx1QTdBN1xcdUE3QTlcXHVBN0I1XFx1QTdCN1xcdUE3RkFcXHVBQjMwLVxcdUFCNUFcXHVBQjYwLVxcdUFCNjVcXHVBQjcwLVxcdUFCQkZcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGRjQxLVxcdUZGNUEwLTlcXHhCMlxceEIzXFx4QjlcXHhCQy1cXHhCRVxcdTA2NjAtXFx1MDY2OVxcdTA2RjAtXFx1MDZGOVxcdTA3QzAtXFx1MDdDOVxcdTA5NjYtXFx1MDk2RlxcdTA5RTYtXFx1MDlFRlxcdTA5RjQtXFx1MDlGOVxcdTBBNjYtXFx1MEE2RlxcdTBBRTYtXFx1MEFFRlxcdTBCNjYtXFx1MEI2RlxcdTBCNzItXFx1MEI3N1xcdTBCRTYtXFx1MEJGMlxcdTBDNjYtXFx1MEM2RlxcdTBDNzgtXFx1MEM3RVxcdTBDRTYtXFx1MENFRlxcdTBENjYtXFx1MEQ3NVxcdTBERTYtXFx1MERFRlxcdTBFNTAtXFx1MEU1OVxcdTBFRDAtXFx1MEVEOVxcdTBGMjAtXFx1MEYzM1xcdTEwNDAtXFx1MTA0OVxcdTEwOTAtXFx1MTA5OVxcdTEzNjktXFx1MTM3Q1xcdTE2RUUtXFx1MTZGMFxcdTE3RTAtXFx1MTdFOVxcdTE3RjAtXFx1MTdGOVxcdTE4MTAtXFx1MTgxOVxcdTE5NDYtXFx1MTk0RlxcdTE5RDAtXFx1MTlEQVxcdTFBODAtXFx1MUE4OVxcdTFBOTAtXFx1MUE5OVxcdTFCNTAtXFx1MUI1OVxcdTFCQjAtXFx1MUJCOVxcdTFDNDAtXFx1MUM0OVxcdTFDNTAtXFx1MUM1OVxcdTIwNzBcXHUyMDc0LVxcdTIwNzlcXHUyMDgwLVxcdTIwODlcXHUyMTUwLVxcdTIxODJcXHUyMTg1LVxcdTIxODlcXHUyNDYwLVxcdTI0OUJcXHUyNEVBLVxcdTI0RkZcXHUyNzc2LVxcdTI3OTNcXHUyQ0ZEXFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMzgtXFx1MzAzQVxcdTMxOTItXFx1MzE5NVxcdTMyMjAtXFx1MzIyOVxcdTMyNDgtXFx1MzI0RlxcdTMyNTEtXFx1MzI1RlxcdTMyODAtXFx1MzI4OVxcdTMyQjEtXFx1MzJCRlxcdUE2MjAtXFx1QTYyOVxcdUE2RTYtXFx1QTZFRlxcdUE4MzAtXFx1QTgzNVxcdUE4RDAtXFx1QThEOVxcdUE5MDAtXFx1QTkwOVxcdUE5RDAtXFx1QTlEOVxcdUE5RjAtXFx1QTlGOVxcdUFBNTAtXFx1QUE1OVxcdUFCRjAtXFx1QUJGOVxcdUZGMTAtXFx1RkYxOV0pKFtBLVpcXHhDMC1cXHhENlxceEQ4LVxceERFXFx1MDEwMFxcdTAxMDJcXHUwMTA0XFx1MDEwNlxcdTAxMDhcXHUwMTBBXFx1MDEwQ1xcdTAxMEVcXHUwMTEwXFx1MDExMlxcdTAxMTRcXHUwMTE2XFx1MDExOFxcdTAxMUFcXHUwMTFDXFx1MDExRVxcdTAxMjBcXHUwMTIyXFx1MDEyNFxcdTAxMjZcXHUwMTI4XFx1MDEyQVxcdTAxMkNcXHUwMTJFXFx1MDEzMFxcdTAxMzJcXHUwMTM0XFx1MDEzNlxcdTAxMzlcXHUwMTNCXFx1MDEzRFxcdTAxM0ZcXHUwMTQxXFx1MDE0M1xcdTAxNDVcXHUwMTQ3XFx1MDE0QVxcdTAxNENcXHUwMTRFXFx1MDE1MFxcdTAxNTJcXHUwMTU0XFx1MDE1NlxcdTAxNThcXHUwMTVBXFx1MDE1Q1xcdTAxNUVcXHUwMTYwXFx1MDE2MlxcdTAxNjRcXHUwMTY2XFx1MDE2OFxcdTAxNkFcXHUwMTZDXFx1MDE2RVxcdTAxNzBcXHUwMTcyXFx1MDE3NFxcdTAxNzZcXHUwMTc4XFx1MDE3OVxcdTAxN0JcXHUwMTdEXFx1MDE4MVxcdTAxODJcXHUwMTg0XFx1MDE4NlxcdTAxODdcXHUwMTg5LVxcdTAxOEJcXHUwMThFLVxcdTAxOTFcXHUwMTkzXFx1MDE5NFxcdTAxOTYtXFx1MDE5OFxcdTAxOUNcXHUwMTlEXFx1MDE5RlxcdTAxQTBcXHUwMUEyXFx1MDFBNFxcdTAxQTZcXHUwMUE3XFx1MDFBOVxcdTAxQUNcXHUwMUFFXFx1MDFBRlxcdTAxQjEtXFx1MDFCM1xcdTAxQjVcXHUwMUI3XFx1MDFCOFxcdTAxQkNcXHUwMUM0XFx1MDFDN1xcdTAxQ0FcXHUwMUNEXFx1MDFDRlxcdTAxRDFcXHUwMUQzXFx1MDFENVxcdTAxRDdcXHUwMUQ5XFx1MDFEQlxcdTAxREVcXHUwMUUwXFx1MDFFMlxcdTAxRTRcXHUwMUU2XFx1MDFFOFxcdTAxRUFcXHUwMUVDXFx1MDFFRVxcdTAxRjFcXHUwMUY0XFx1MDFGNi1cXHUwMUY4XFx1MDFGQVxcdTAxRkNcXHUwMUZFXFx1MDIwMFxcdTAyMDJcXHUwMjA0XFx1MDIwNlxcdTAyMDhcXHUwMjBBXFx1MDIwQ1xcdTAyMEVcXHUwMjEwXFx1MDIxMlxcdTAyMTRcXHUwMjE2XFx1MDIxOFxcdTAyMUFcXHUwMjFDXFx1MDIxRVxcdTAyMjBcXHUwMjIyXFx1MDIyNFxcdTAyMjZcXHUwMjI4XFx1MDIyQVxcdTAyMkNcXHUwMjJFXFx1MDIzMFxcdTAyMzJcXHUwMjNBXFx1MDIzQlxcdTAyM0RcXHUwMjNFXFx1MDI0MVxcdTAyNDMtXFx1MDI0NlxcdTAyNDhcXHUwMjRBXFx1MDI0Q1xcdTAyNEVcXHUwMzcwXFx1MDM3MlxcdTAzNzZcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFXFx1MDM4RlxcdTAzOTEtXFx1MDNBMVxcdTAzQTMtXFx1MDNBQlxcdTAzQ0ZcXHUwM0QyLVxcdTAzRDRcXHUwM0Q4XFx1MDNEQVxcdTAzRENcXHUwM0RFXFx1MDNFMFxcdTAzRTJcXHUwM0U0XFx1MDNFNlxcdTAzRThcXHUwM0VBXFx1MDNFQ1xcdTAzRUVcXHUwM0Y0XFx1MDNGN1xcdTAzRjlcXHUwM0ZBXFx1MDNGRC1cXHUwNDJGXFx1MDQ2MFxcdTA0NjJcXHUwNDY0XFx1MDQ2NlxcdTA0NjhcXHUwNDZBXFx1MDQ2Q1xcdTA0NkVcXHUwNDcwXFx1MDQ3MlxcdTA0NzRcXHUwNDc2XFx1MDQ3OFxcdTA0N0FcXHUwNDdDXFx1MDQ3RVxcdTA0ODBcXHUwNDhBXFx1MDQ4Q1xcdTA0OEVcXHUwNDkwXFx1MDQ5MlxcdTA0OTRcXHUwNDk2XFx1MDQ5OFxcdTA0OUFcXHUwNDlDXFx1MDQ5RVxcdTA0QTBcXHUwNEEyXFx1MDRBNFxcdTA0QTZcXHUwNEE4XFx1MDRBQVxcdTA0QUNcXHUwNEFFXFx1MDRCMFxcdTA0QjJcXHUwNEI0XFx1MDRCNlxcdTA0QjhcXHUwNEJBXFx1MDRCQ1xcdTA0QkVcXHUwNEMwXFx1MDRDMVxcdTA0QzNcXHUwNEM1XFx1MDRDN1xcdTA0QzlcXHUwNENCXFx1MDRDRFxcdTA0RDBcXHUwNEQyXFx1MDRENFxcdTA0RDZcXHUwNEQ4XFx1MDREQVxcdTA0RENcXHUwNERFXFx1MDRFMFxcdTA0RTJcXHUwNEU0XFx1MDRFNlxcdTA0RThcXHUwNEVBXFx1MDRFQ1xcdTA0RUVcXHUwNEYwXFx1MDRGMlxcdTA0RjRcXHUwNEY2XFx1MDRGOFxcdTA0RkFcXHUwNEZDXFx1MDRGRVxcdTA1MDBcXHUwNTAyXFx1MDUwNFxcdTA1MDZcXHUwNTA4XFx1MDUwQVxcdTA1MENcXHUwNTBFXFx1MDUxMFxcdTA1MTJcXHUwNTE0XFx1MDUxNlxcdTA1MThcXHUwNTFBXFx1MDUxQ1xcdTA1MUVcXHUwNTIwXFx1MDUyMlxcdTA1MjRcXHUwNTI2XFx1MDUyOFxcdTA1MkFcXHUwNTJDXFx1MDUyRVxcdTA1MzEtXFx1MDU1NlxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTNBMC1cXHUxM0Y1XFx1MUUwMFxcdTFFMDJcXHUxRTA0XFx1MUUwNlxcdTFFMDhcXHUxRTBBXFx1MUUwQ1xcdTFFMEVcXHUxRTEwXFx1MUUxMlxcdTFFMTRcXHUxRTE2XFx1MUUxOFxcdTFFMUFcXHUxRTFDXFx1MUUxRVxcdTFFMjBcXHUxRTIyXFx1MUUyNFxcdTFFMjZcXHUxRTI4XFx1MUUyQVxcdTFFMkNcXHUxRTJFXFx1MUUzMFxcdTFFMzJcXHUxRTM0XFx1MUUzNlxcdTFFMzhcXHUxRTNBXFx1MUUzQ1xcdTFFM0VcXHUxRTQwXFx1MUU0MlxcdTFFNDRcXHUxRTQ2XFx1MUU0OFxcdTFFNEFcXHUxRTRDXFx1MUU0RVxcdTFFNTBcXHUxRTUyXFx1MUU1NFxcdTFFNTZcXHUxRTU4XFx1MUU1QVxcdTFFNUNcXHUxRTVFXFx1MUU2MFxcdTFFNjJcXHUxRTY0XFx1MUU2NlxcdTFFNjhcXHUxRTZBXFx1MUU2Q1xcdTFFNkVcXHUxRTcwXFx1MUU3MlxcdTFFNzRcXHUxRTc2XFx1MUU3OFxcdTFFN0FcXHUxRTdDXFx1MUU3RVxcdTFFODBcXHUxRTgyXFx1MUU4NFxcdTFFODZcXHUxRTg4XFx1MUU4QVxcdTFFOENcXHUxRThFXFx1MUU5MFxcdTFFOTJcXHUxRTk0XFx1MUU5RVxcdTFFQTBcXHUxRUEyXFx1MUVBNFxcdTFFQTZcXHUxRUE4XFx1MUVBQVxcdTFFQUNcXHUxRUFFXFx1MUVCMFxcdTFFQjJcXHUxRUI0XFx1MUVCNlxcdTFFQjhcXHUxRUJBXFx1MUVCQ1xcdTFFQkVcXHUxRUMwXFx1MUVDMlxcdTFFQzRcXHUxRUM2XFx1MUVDOFxcdTFFQ0FcXHUxRUNDXFx1MUVDRVxcdTFFRDBcXHUxRUQyXFx1MUVENFxcdTFFRDZcXHUxRUQ4XFx1MUVEQVxcdTFFRENcXHUxRURFXFx1MUVFMFxcdTFFRTJcXHUxRUU0XFx1MUVFNlxcdTFFRThcXHUxRUVBXFx1MUVFQ1xcdTFFRUVcXHUxRUYwXFx1MUVGMlxcdTFFRjRcXHUxRUY2XFx1MUVGOFxcdTFFRkFcXHUxRUZDXFx1MUVGRVxcdTFGMDgtXFx1MUYwRlxcdTFGMTgtXFx1MUYxRFxcdTFGMjgtXFx1MUYyRlxcdTFGMzgtXFx1MUYzRlxcdTFGNDgtXFx1MUY0RFxcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUZcXHUxRjY4LVxcdTFGNkZcXHUxRkI4LVxcdTFGQkJcXHUxRkM4LVxcdTFGQ0JcXHUxRkQ4LVxcdTFGREJcXHUxRkU4LVxcdTFGRUNcXHUxRkY4LVxcdTFGRkJcXHUyMTAyXFx1MjEwN1xcdTIxMEItXFx1MjEwRFxcdTIxMTAtXFx1MjExMlxcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTMwLVxcdTIxMzNcXHUyMTNFXFx1MjEzRlxcdTIxNDVcXHUyMTgzXFx1MkMwMC1cXHUyQzJFXFx1MkM2MFxcdTJDNjItXFx1MkM2NFxcdTJDNjdcXHUyQzY5XFx1MkM2QlxcdTJDNkQtXFx1MkM3MFxcdTJDNzJcXHUyQzc1XFx1MkM3RS1cXHUyQzgwXFx1MkM4MlxcdTJDODRcXHUyQzg2XFx1MkM4OFxcdTJDOEFcXHUyQzhDXFx1MkM4RVxcdTJDOTBcXHUyQzkyXFx1MkM5NFxcdTJDOTZcXHUyQzk4XFx1MkM5QVxcdTJDOUNcXHUyQzlFXFx1MkNBMFxcdTJDQTJcXHUyQ0E0XFx1MkNBNlxcdTJDQThcXHUyQ0FBXFx1MkNBQ1xcdTJDQUVcXHUyQ0IwXFx1MkNCMlxcdTJDQjRcXHUyQ0I2XFx1MkNCOFxcdTJDQkFcXHUyQ0JDXFx1MkNCRVxcdTJDQzBcXHUyQ0MyXFx1MkNDNFxcdTJDQzZcXHUyQ0M4XFx1MkNDQVxcdTJDQ0NcXHUyQ0NFXFx1MkNEMFxcdTJDRDJcXHUyQ0Q0XFx1MkNENlxcdTJDRDhcXHUyQ0RBXFx1MkNEQ1xcdTJDREVcXHUyQ0UwXFx1MkNFMlxcdTJDRUJcXHUyQ0VEXFx1MkNGMlxcdUE2NDBcXHVBNjQyXFx1QTY0NFxcdUE2NDZcXHVBNjQ4XFx1QTY0QVxcdUE2NENcXHVBNjRFXFx1QTY1MFxcdUE2NTJcXHVBNjU0XFx1QTY1NlxcdUE2NThcXHVBNjVBXFx1QTY1Q1xcdUE2NUVcXHVBNjYwXFx1QTY2MlxcdUE2NjRcXHVBNjY2XFx1QTY2OFxcdUE2NkFcXHVBNjZDXFx1QTY4MFxcdUE2ODJcXHVBNjg0XFx1QTY4NlxcdUE2ODhcXHVBNjhBXFx1QTY4Q1xcdUE2OEVcXHVBNjkwXFx1QTY5MlxcdUE2OTRcXHVBNjk2XFx1QTY5OFxcdUE2OUFcXHVBNzIyXFx1QTcyNFxcdUE3MjZcXHVBNzI4XFx1QTcyQVxcdUE3MkNcXHVBNzJFXFx1QTczMlxcdUE3MzRcXHVBNzM2XFx1QTczOFxcdUE3M0FcXHVBNzNDXFx1QTczRVxcdUE3NDBcXHVBNzQyXFx1QTc0NFxcdUE3NDZcXHVBNzQ4XFx1QTc0QVxcdUE3NENcXHVBNzRFXFx1QTc1MFxcdUE3NTJcXHVBNzU0XFx1QTc1NlxcdUE3NThcXHVBNzVBXFx1QTc1Q1xcdUE3NUVcXHVBNzYwXFx1QTc2MlxcdUE3NjRcXHVBNzY2XFx1QTc2OFxcdUE3NkFcXHVBNzZDXFx1QTc2RVxcdUE3NzlcXHVBNzdCXFx1QTc3RFxcdUE3N0VcXHVBNzgwXFx1QTc4MlxcdUE3ODRcXHVBNzg2XFx1QTc4QlxcdUE3OERcXHVBNzkwXFx1QTc5MlxcdUE3OTZcXHVBNzk4XFx1QTc5QVxcdUE3OUNcXHVBNzlFXFx1QTdBMFxcdUE3QTJcXHVBN0E0XFx1QTdBNlxcdUE3QThcXHVBN0FBLVxcdUE3QURcXHVBN0IwLVxcdUE3QjRcXHVBN0I2XFx1RkYyMS1cXHVGRjNBXSkvZ1xuIiwibW9kdWxlLmV4cG9ydHMgPSAvKFtBLVpcXHhDMC1cXHhENlxceEQ4LVxceERFXFx1MDEwMFxcdTAxMDJcXHUwMTA0XFx1MDEwNlxcdTAxMDhcXHUwMTBBXFx1MDEwQ1xcdTAxMEVcXHUwMTEwXFx1MDExMlxcdTAxMTRcXHUwMTE2XFx1MDExOFxcdTAxMUFcXHUwMTFDXFx1MDExRVxcdTAxMjBcXHUwMTIyXFx1MDEyNFxcdTAxMjZcXHUwMTI4XFx1MDEyQVxcdTAxMkNcXHUwMTJFXFx1MDEzMFxcdTAxMzJcXHUwMTM0XFx1MDEzNlxcdTAxMzlcXHUwMTNCXFx1MDEzRFxcdTAxM0ZcXHUwMTQxXFx1MDE0M1xcdTAxNDVcXHUwMTQ3XFx1MDE0QVxcdTAxNENcXHUwMTRFXFx1MDE1MFxcdTAxNTJcXHUwMTU0XFx1MDE1NlxcdTAxNThcXHUwMTVBXFx1MDE1Q1xcdTAxNUVcXHUwMTYwXFx1MDE2MlxcdTAxNjRcXHUwMTY2XFx1MDE2OFxcdTAxNkFcXHUwMTZDXFx1MDE2RVxcdTAxNzBcXHUwMTcyXFx1MDE3NFxcdTAxNzZcXHUwMTc4XFx1MDE3OVxcdTAxN0JcXHUwMTdEXFx1MDE4MVxcdTAxODJcXHUwMTg0XFx1MDE4NlxcdTAxODdcXHUwMTg5LVxcdTAxOEJcXHUwMThFLVxcdTAxOTFcXHUwMTkzXFx1MDE5NFxcdTAxOTYtXFx1MDE5OFxcdTAxOUNcXHUwMTlEXFx1MDE5RlxcdTAxQTBcXHUwMUEyXFx1MDFBNFxcdTAxQTZcXHUwMUE3XFx1MDFBOVxcdTAxQUNcXHUwMUFFXFx1MDFBRlxcdTAxQjEtXFx1MDFCM1xcdTAxQjVcXHUwMUI3XFx1MDFCOFxcdTAxQkNcXHUwMUM0XFx1MDFDN1xcdTAxQ0FcXHUwMUNEXFx1MDFDRlxcdTAxRDFcXHUwMUQzXFx1MDFENVxcdTAxRDdcXHUwMUQ5XFx1MDFEQlxcdTAxREVcXHUwMUUwXFx1MDFFMlxcdTAxRTRcXHUwMUU2XFx1MDFFOFxcdTAxRUFcXHUwMUVDXFx1MDFFRVxcdTAxRjFcXHUwMUY0XFx1MDFGNi1cXHUwMUY4XFx1MDFGQVxcdTAxRkNcXHUwMUZFXFx1MDIwMFxcdTAyMDJcXHUwMjA0XFx1MDIwNlxcdTAyMDhcXHUwMjBBXFx1MDIwQ1xcdTAyMEVcXHUwMjEwXFx1MDIxMlxcdTAyMTRcXHUwMjE2XFx1MDIxOFxcdTAyMUFcXHUwMjFDXFx1MDIxRVxcdTAyMjBcXHUwMjIyXFx1MDIyNFxcdTAyMjZcXHUwMjI4XFx1MDIyQVxcdTAyMkNcXHUwMjJFXFx1MDIzMFxcdTAyMzJcXHUwMjNBXFx1MDIzQlxcdTAyM0RcXHUwMjNFXFx1MDI0MVxcdTAyNDMtXFx1MDI0NlxcdTAyNDhcXHUwMjRBXFx1MDI0Q1xcdTAyNEVcXHUwMzcwXFx1MDM3MlxcdTAzNzZcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFXFx1MDM4RlxcdTAzOTEtXFx1MDNBMVxcdTAzQTMtXFx1MDNBQlxcdTAzQ0ZcXHUwM0QyLVxcdTAzRDRcXHUwM0Q4XFx1MDNEQVxcdTAzRENcXHUwM0RFXFx1MDNFMFxcdTAzRTJcXHUwM0U0XFx1MDNFNlxcdTAzRThcXHUwM0VBXFx1MDNFQ1xcdTAzRUVcXHUwM0Y0XFx1MDNGN1xcdTAzRjlcXHUwM0ZBXFx1MDNGRC1cXHUwNDJGXFx1MDQ2MFxcdTA0NjJcXHUwNDY0XFx1MDQ2NlxcdTA0NjhcXHUwNDZBXFx1MDQ2Q1xcdTA0NkVcXHUwNDcwXFx1MDQ3MlxcdTA0NzRcXHUwNDc2XFx1MDQ3OFxcdTA0N0FcXHUwNDdDXFx1MDQ3RVxcdTA0ODBcXHUwNDhBXFx1MDQ4Q1xcdTA0OEVcXHUwNDkwXFx1MDQ5MlxcdTA0OTRcXHUwNDk2XFx1MDQ5OFxcdTA0OUFcXHUwNDlDXFx1MDQ5RVxcdTA0QTBcXHUwNEEyXFx1MDRBNFxcdTA0QTZcXHUwNEE4XFx1MDRBQVxcdTA0QUNcXHUwNEFFXFx1MDRCMFxcdTA0QjJcXHUwNEI0XFx1MDRCNlxcdTA0QjhcXHUwNEJBXFx1MDRCQ1xcdTA0QkVcXHUwNEMwXFx1MDRDMVxcdTA0QzNcXHUwNEM1XFx1MDRDN1xcdTA0QzlcXHUwNENCXFx1MDRDRFxcdTA0RDBcXHUwNEQyXFx1MDRENFxcdTA0RDZcXHUwNEQ4XFx1MDREQVxcdTA0RENcXHUwNERFXFx1MDRFMFxcdTA0RTJcXHUwNEU0XFx1MDRFNlxcdTA0RThcXHUwNEVBXFx1MDRFQ1xcdTA0RUVcXHUwNEYwXFx1MDRGMlxcdTA0RjRcXHUwNEY2XFx1MDRGOFxcdTA0RkFcXHUwNEZDXFx1MDRGRVxcdTA1MDBcXHUwNTAyXFx1MDUwNFxcdTA1MDZcXHUwNTA4XFx1MDUwQVxcdTA1MENcXHUwNTBFXFx1MDUxMFxcdTA1MTJcXHUwNTE0XFx1MDUxNlxcdTA1MThcXHUwNTFBXFx1MDUxQ1xcdTA1MUVcXHUwNTIwXFx1MDUyMlxcdTA1MjRcXHUwNTI2XFx1MDUyOFxcdTA1MkFcXHUwNTJDXFx1MDUyRVxcdTA1MzEtXFx1MDU1NlxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTNBMC1cXHUxM0Y1XFx1MUUwMFxcdTFFMDJcXHUxRTA0XFx1MUUwNlxcdTFFMDhcXHUxRTBBXFx1MUUwQ1xcdTFFMEVcXHUxRTEwXFx1MUUxMlxcdTFFMTRcXHUxRTE2XFx1MUUxOFxcdTFFMUFcXHUxRTFDXFx1MUUxRVxcdTFFMjBcXHUxRTIyXFx1MUUyNFxcdTFFMjZcXHUxRTI4XFx1MUUyQVxcdTFFMkNcXHUxRTJFXFx1MUUzMFxcdTFFMzJcXHUxRTM0XFx1MUUzNlxcdTFFMzhcXHUxRTNBXFx1MUUzQ1xcdTFFM0VcXHUxRTQwXFx1MUU0MlxcdTFFNDRcXHUxRTQ2XFx1MUU0OFxcdTFFNEFcXHUxRTRDXFx1MUU0RVxcdTFFNTBcXHUxRTUyXFx1MUU1NFxcdTFFNTZcXHUxRTU4XFx1MUU1QVxcdTFFNUNcXHUxRTVFXFx1MUU2MFxcdTFFNjJcXHUxRTY0XFx1MUU2NlxcdTFFNjhcXHUxRTZBXFx1MUU2Q1xcdTFFNkVcXHUxRTcwXFx1MUU3MlxcdTFFNzRcXHUxRTc2XFx1MUU3OFxcdTFFN0FcXHUxRTdDXFx1MUU3RVxcdTFFODBcXHUxRTgyXFx1MUU4NFxcdTFFODZcXHUxRTg4XFx1MUU4QVxcdTFFOENcXHUxRThFXFx1MUU5MFxcdTFFOTJcXHUxRTk0XFx1MUU5RVxcdTFFQTBcXHUxRUEyXFx1MUVBNFxcdTFFQTZcXHUxRUE4XFx1MUVBQVxcdTFFQUNcXHUxRUFFXFx1MUVCMFxcdTFFQjJcXHUxRUI0XFx1MUVCNlxcdTFFQjhcXHUxRUJBXFx1MUVCQ1xcdTFFQkVcXHUxRUMwXFx1MUVDMlxcdTFFQzRcXHUxRUM2XFx1MUVDOFxcdTFFQ0FcXHUxRUNDXFx1MUVDRVxcdTFFRDBcXHUxRUQyXFx1MUVENFxcdTFFRDZcXHUxRUQ4XFx1MUVEQVxcdTFFRENcXHUxRURFXFx1MUVFMFxcdTFFRTJcXHUxRUU0XFx1MUVFNlxcdTFFRThcXHUxRUVBXFx1MUVFQ1xcdTFFRUVcXHUxRUYwXFx1MUVGMlxcdTFFRjRcXHUxRUY2XFx1MUVGOFxcdTFFRkFcXHUxRUZDXFx1MUVGRVxcdTFGMDgtXFx1MUYwRlxcdTFGMTgtXFx1MUYxRFxcdTFGMjgtXFx1MUYyRlxcdTFGMzgtXFx1MUYzRlxcdTFGNDgtXFx1MUY0RFxcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUZcXHUxRjY4LVxcdTFGNkZcXHUxRkI4LVxcdTFGQkJcXHUxRkM4LVxcdTFGQ0JcXHUxRkQ4LVxcdTFGREJcXHUxRkU4LVxcdTFGRUNcXHUxRkY4LVxcdTFGRkJcXHUyMTAyXFx1MjEwN1xcdTIxMEItXFx1MjEwRFxcdTIxMTAtXFx1MjExMlxcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTMwLVxcdTIxMzNcXHUyMTNFXFx1MjEzRlxcdTIxNDVcXHUyMTgzXFx1MkMwMC1cXHUyQzJFXFx1MkM2MFxcdTJDNjItXFx1MkM2NFxcdTJDNjdcXHUyQzY5XFx1MkM2QlxcdTJDNkQtXFx1MkM3MFxcdTJDNzJcXHUyQzc1XFx1MkM3RS1cXHUyQzgwXFx1MkM4MlxcdTJDODRcXHUyQzg2XFx1MkM4OFxcdTJDOEFcXHUyQzhDXFx1MkM4RVxcdTJDOTBcXHUyQzkyXFx1MkM5NFxcdTJDOTZcXHUyQzk4XFx1MkM5QVxcdTJDOUNcXHUyQzlFXFx1MkNBMFxcdTJDQTJcXHUyQ0E0XFx1MkNBNlxcdTJDQThcXHUyQ0FBXFx1MkNBQ1xcdTJDQUVcXHUyQ0IwXFx1MkNCMlxcdTJDQjRcXHUyQ0I2XFx1MkNCOFxcdTJDQkFcXHUyQ0JDXFx1MkNCRVxcdTJDQzBcXHUyQ0MyXFx1MkNDNFxcdTJDQzZcXHUyQ0M4XFx1MkNDQVxcdTJDQ0NcXHUyQ0NFXFx1MkNEMFxcdTJDRDJcXHUyQ0Q0XFx1MkNENlxcdTJDRDhcXHUyQ0RBXFx1MkNEQ1xcdTJDREVcXHUyQ0UwXFx1MkNFMlxcdTJDRUJcXHUyQ0VEXFx1MkNGMlxcdUE2NDBcXHVBNjQyXFx1QTY0NFxcdUE2NDZcXHVBNjQ4XFx1QTY0QVxcdUE2NENcXHVBNjRFXFx1QTY1MFxcdUE2NTJcXHVBNjU0XFx1QTY1NlxcdUE2NThcXHVBNjVBXFx1QTY1Q1xcdUE2NUVcXHVBNjYwXFx1QTY2MlxcdUE2NjRcXHVBNjY2XFx1QTY2OFxcdUE2NkFcXHVBNjZDXFx1QTY4MFxcdUE2ODJcXHVBNjg0XFx1QTY4NlxcdUE2ODhcXHVBNjhBXFx1QTY4Q1xcdUE2OEVcXHVBNjkwXFx1QTY5MlxcdUE2OTRcXHVBNjk2XFx1QTY5OFxcdUE2OUFcXHVBNzIyXFx1QTcyNFxcdUE3MjZcXHVBNzI4XFx1QTcyQVxcdUE3MkNcXHVBNzJFXFx1QTczMlxcdUE3MzRcXHVBNzM2XFx1QTczOFxcdUE3M0FcXHVBNzNDXFx1QTczRVxcdUE3NDBcXHVBNzQyXFx1QTc0NFxcdUE3NDZcXHVBNzQ4XFx1QTc0QVxcdUE3NENcXHVBNzRFXFx1QTc1MFxcdUE3NTJcXHVBNzU0XFx1QTc1NlxcdUE3NThcXHVBNzVBXFx1QTc1Q1xcdUE3NUVcXHVBNzYwXFx1QTc2MlxcdUE3NjRcXHVBNzY2XFx1QTc2OFxcdUE3NkFcXHVBNzZDXFx1QTc2RVxcdUE3NzlcXHVBNzdCXFx1QTc3RFxcdUE3N0VcXHVBNzgwXFx1QTc4MlxcdUE3ODRcXHVBNzg2XFx1QTc4QlxcdUE3OERcXHVBNzkwXFx1QTc5MlxcdUE3OTZcXHVBNzk4XFx1QTc5QVxcdUE3OUNcXHVBNzlFXFx1QTdBMFxcdUE3QTJcXHVBN0E0XFx1QTdBNlxcdUE3QThcXHVBN0FBLVxcdUE3QURcXHVBN0IwLVxcdUE3QjRcXHVBN0I2XFx1RkYyMS1cXHVGRjNBXSkoW0EtWlxceEMwLVxceEQ2XFx4RDgtXFx4REVcXHUwMTAwXFx1MDEwMlxcdTAxMDRcXHUwMTA2XFx1MDEwOFxcdTAxMEFcXHUwMTBDXFx1MDEwRVxcdTAxMTBcXHUwMTEyXFx1MDExNFxcdTAxMTZcXHUwMTE4XFx1MDExQVxcdTAxMUNcXHUwMTFFXFx1MDEyMFxcdTAxMjJcXHUwMTI0XFx1MDEyNlxcdTAxMjhcXHUwMTJBXFx1MDEyQ1xcdTAxMkVcXHUwMTMwXFx1MDEzMlxcdTAxMzRcXHUwMTM2XFx1MDEzOVxcdTAxM0JcXHUwMTNEXFx1MDEzRlxcdTAxNDFcXHUwMTQzXFx1MDE0NVxcdTAxNDdcXHUwMTRBXFx1MDE0Q1xcdTAxNEVcXHUwMTUwXFx1MDE1MlxcdTAxNTRcXHUwMTU2XFx1MDE1OFxcdTAxNUFcXHUwMTVDXFx1MDE1RVxcdTAxNjBcXHUwMTYyXFx1MDE2NFxcdTAxNjZcXHUwMTY4XFx1MDE2QVxcdTAxNkNcXHUwMTZFXFx1MDE3MFxcdTAxNzJcXHUwMTc0XFx1MDE3NlxcdTAxNzhcXHUwMTc5XFx1MDE3QlxcdTAxN0RcXHUwMTgxXFx1MDE4MlxcdTAxODRcXHUwMTg2XFx1MDE4N1xcdTAxODktXFx1MDE4QlxcdTAxOEUtXFx1MDE5MVxcdTAxOTNcXHUwMTk0XFx1MDE5Ni1cXHUwMTk4XFx1MDE5Q1xcdTAxOURcXHUwMTlGXFx1MDFBMFxcdTAxQTJcXHUwMUE0XFx1MDFBNlxcdTAxQTdcXHUwMUE5XFx1MDFBQ1xcdTAxQUVcXHUwMUFGXFx1MDFCMS1cXHUwMUIzXFx1MDFCNVxcdTAxQjdcXHUwMUI4XFx1MDFCQ1xcdTAxQzRcXHUwMUM3XFx1MDFDQVxcdTAxQ0RcXHUwMUNGXFx1MDFEMVxcdTAxRDNcXHUwMUQ1XFx1MDFEN1xcdTAxRDlcXHUwMURCXFx1MDFERVxcdTAxRTBcXHUwMUUyXFx1MDFFNFxcdTAxRTZcXHUwMUU4XFx1MDFFQVxcdTAxRUNcXHUwMUVFXFx1MDFGMVxcdTAxRjRcXHUwMUY2LVxcdTAxRjhcXHUwMUZBXFx1MDFGQ1xcdTAxRkVcXHUwMjAwXFx1MDIwMlxcdTAyMDRcXHUwMjA2XFx1MDIwOFxcdTAyMEFcXHUwMjBDXFx1MDIwRVxcdTAyMTBcXHUwMjEyXFx1MDIxNFxcdTAyMTZcXHUwMjE4XFx1MDIxQVxcdTAyMUNcXHUwMjFFXFx1MDIyMFxcdTAyMjJcXHUwMjI0XFx1MDIyNlxcdTAyMjhcXHUwMjJBXFx1MDIyQ1xcdTAyMkVcXHUwMjMwXFx1MDIzMlxcdTAyM0FcXHUwMjNCXFx1MDIzRFxcdTAyM0VcXHUwMjQxXFx1MDI0My1cXHUwMjQ2XFx1MDI0OFxcdTAyNEFcXHUwMjRDXFx1MDI0RVxcdTAzNzBcXHUwMzcyXFx1MDM3NlxcdTAzN0ZcXHUwMzg2XFx1MDM4OC1cXHUwMzhBXFx1MDM4Q1xcdTAzOEVcXHUwMzhGXFx1MDM5MS1cXHUwM0ExXFx1MDNBMy1cXHUwM0FCXFx1MDNDRlxcdTAzRDItXFx1MDNENFxcdTAzRDhcXHUwM0RBXFx1MDNEQ1xcdTAzREVcXHUwM0UwXFx1MDNFMlxcdTAzRTRcXHUwM0U2XFx1MDNFOFxcdTAzRUFcXHUwM0VDXFx1MDNFRVxcdTAzRjRcXHUwM0Y3XFx1MDNGOVxcdTAzRkFcXHUwM0ZELVxcdTA0MkZcXHUwNDYwXFx1MDQ2MlxcdTA0NjRcXHUwNDY2XFx1MDQ2OFxcdTA0NkFcXHUwNDZDXFx1MDQ2RVxcdTA0NzBcXHUwNDcyXFx1MDQ3NFxcdTA0NzZcXHUwNDc4XFx1MDQ3QVxcdTA0N0NcXHUwNDdFXFx1MDQ4MFxcdTA0OEFcXHUwNDhDXFx1MDQ4RVxcdTA0OTBcXHUwNDkyXFx1MDQ5NFxcdTA0OTZcXHUwNDk4XFx1MDQ5QVxcdTA0OUNcXHUwNDlFXFx1MDRBMFxcdTA0QTJcXHUwNEE0XFx1MDRBNlxcdTA0QThcXHUwNEFBXFx1MDRBQ1xcdTA0QUVcXHUwNEIwXFx1MDRCMlxcdTA0QjRcXHUwNEI2XFx1MDRCOFxcdTA0QkFcXHUwNEJDXFx1MDRCRVxcdTA0QzBcXHUwNEMxXFx1MDRDM1xcdTA0QzVcXHUwNEM3XFx1MDRDOVxcdTA0Q0JcXHUwNENEXFx1MDREMFxcdTA0RDJcXHUwNEQ0XFx1MDRENlxcdTA0RDhcXHUwNERBXFx1MDREQ1xcdTA0REVcXHUwNEUwXFx1MDRFMlxcdTA0RTRcXHUwNEU2XFx1MDRFOFxcdTA0RUFcXHUwNEVDXFx1MDRFRVxcdTA0RjBcXHUwNEYyXFx1MDRGNFxcdTA0RjZcXHUwNEY4XFx1MDRGQVxcdTA0RkNcXHUwNEZFXFx1MDUwMFxcdTA1MDJcXHUwNTA0XFx1MDUwNlxcdTA1MDhcXHUwNTBBXFx1MDUwQ1xcdTA1MEVcXHUwNTEwXFx1MDUxMlxcdTA1MTRcXHUwNTE2XFx1MDUxOFxcdTA1MUFcXHUwNTFDXFx1MDUxRVxcdTA1MjBcXHUwNTIyXFx1MDUyNFxcdTA1MjZcXHUwNTI4XFx1MDUyQVxcdTA1MkNcXHUwNTJFXFx1MDUzMS1cXHUwNTU2XFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxM0EwLVxcdTEzRjVcXHUxRTAwXFx1MUUwMlxcdTFFMDRcXHUxRTA2XFx1MUUwOFxcdTFFMEFcXHUxRTBDXFx1MUUwRVxcdTFFMTBcXHUxRTEyXFx1MUUxNFxcdTFFMTZcXHUxRTE4XFx1MUUxQVxcdTFFMUNcXHUxRTFFXFx1MUUyMFxcdTFFMjJcXHUxRTI0XFx1MUUyNlxcdTFFMjhcXHUxRTJBXFx1MUUyQ1xcdTFFMkVcXHUxRTMwXFx1MUUzMlxcdTFFMzRcXHUxRTM2XFx1MUUzOFxcdTFFM0FcXHUxRTNDXFx1MUUzRVxcdTFFNDBcXHUxRTQyXFx1MUU0NFxcdTFFNDZcXHUxRTQ4XFx1MUU0QVxcdTFFNENcXHUxRTRFXFx1MUU1MFxcdTFFNTJcXHUxRTU0XFx1MUU1NlxcdTFFNThcXHUxRTVBXFx1MUU1Q1xcdTFFNUVcXHUxRTYwXFx1MUU2MlxcdTFFNjRcXHUxRTY2XFx1MUU2OFxcdTFFNkFcXHUxRTZDXFx1MUU2RVxcdTFFNzBcXHUxRTcyXFx1MUU3NFxcdTFFNzZcXHUxRTc4XFx1MUU3QVxcdTFFN0NcXHUxRTdFXFx1MUU4MFxcdTFFODJcXHUxRTg0XFx1MUU4NlxcdTFFODhcXHUxRThBXFx1MUU4Q1xcdTFFOEVcXHUxRTkwXFx1MUU5MlxcdTFFOTRcXHUxRTlFXFx1MUVBMFxcdTFFQTJcXHUxRUE0XFx1MUVBNlxcdTFFQThcXHUxRUFBXFx1MUVBQ1xcdTFFQUVcXHUxRUIwXFx1MUVCMlxcdTFFQjRcXHUxRUI2XFx1MUVCOFxcdTFFQkFcXHUxRUJDXFx1MUVCRVxcdTFFQzBcXHUxRUMyXFx1MUVDNFxcdTFFQzZcXHUxRUM4XFx1MUVDQVxcdTFFQ0NcXHUxRUNFXFx1MUVEMFxcdTFFRDJcXHUxRUQ0XFx1MUVENlxcdTFFRDhcXHUxRURBXFx1MUVEQ1xcdTFFREVcXHUxRUUwXFx1MUVFMlxcdTFFRTRcXHUxRUU2XFx1MUVFOFxcdTFFRUFcXHUxRUVDXFx1MUVFRVxcdTFFRjBcXHUxRUYyXFx1MUVGNFxcdTFFRjZcXHUxRUY4XFx1MUVGQVxcdTFFRkNcXHUxRUZFXFx1MUYwOC1cXHUxRjBGXFx1MUYxOC1cXHUxRjFEXFx1MUYyOC1cXHUxRjJGXFx1MUYzOC1cXHUxRjNGXFx1MUY0OC1cXHUxRjREXFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1RlxcdTFGNjgtXFx1MUY2RlxcdTFGQjgtXFx1MUZCQlxcdTFGQzgtXFx1MUZDQlxcdTFGRDgtXFx1MUZEQlxcdTFGRTgtXFx1MUZFQ1xcdTFGRjgtXFx1MUZGQlxcdTIxMDJcXHUyMTA3XFx1MjEwQi1cXHUyMTBEXFx1MjExMC1cXHUyMTEyXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMzAtXFx1MjEzM1xcdTIxM0VcXHUyMTNGXFx1MjE0NVxcdTIxODNcXHUyQzAwLVxcdTJDMkVcXHUyQzYwXFx1MkM2Mi1cXHUyQzY0XFx1MkM2N1xcdTJDNjlcXHUyQzZCXFx1MkM2RC1cXHUyQzcwXFx1MkM3MlxcdTJDNzVcXHUyQzdFLVxcdTJDODBcXHUyQzgyXFx1MkM4NFxcdTJDODZcXHUyQzg4XFx1MkM4QVxcdTJDOENcXHUyQzhFXFx1MkM5MFxcdTJDOTJcXHUyQzk0XFx1MkM5NlxcdTJDOThcXHUyQzlBXFx1MkM5Q1xcdTJDOUVcXHUyQ0EwXFx1MkNBMlxcdTJDQTRcXHUyQ0E2XFx1MkNBOFxcdTJDQUFcXHUyQ0FDXFx1MkNBRVxcdTJDQjBcXHUyQ0IyXFx1MkNCNFxcdTJDQjZcXHUyQ0I4XFx1MkNCQVxcdTJDQkNcXHUyQ0JFXFx1MkNDMFxcdTJDQzJcXHUyQ0M0XFx1MkNDNlxcdTJDQzhcXHUyQ0NBXFx1MkNDQ1xcdTJDQ0VcXHUyQ0QwXFx1MkNEMlxcdTJDRDRcXHUyQ0Q2XFx1MkNEOFxcdTJDREFcXHUyQ0RDXFx1MkNERVxcdTJDRTBcXHUyQ0UyXFx1MkNFQlxcdTJDRURcXHUyQ0YyXFx1QTY0MFxcdUE2NDJcXHVBNjQ0XFx1QTY0NlxcdUE2NDhcXHVBNjRBXFx1QTY0Q1xcdUE2NEVcXHVBNjUwXFx1QTY1MlxcdUE2NTRcXHVBNjU2XFx1QTY1OFxcdUE2NUFcXHVBNjVDXFx1QTY1RVxcdUE2NjBcXHVBNjYyXFx1QTY2NFxcdUE2NjZcXHVBNjY4XFx1QTY2QVxcdUE2NkNcXHVBNjgwXFx1QTY4MlxcdUE2ODRcXHVBNjg2XFx1QTY4OFxcdUE2OEFcXHVBNjhDXFx1QTY4RVxcdUE2OTBcXHVBNjkyXFx1QTY5NFxcdUE2OTZcXHVBNjk4XFx1QTY5QVxcdUE3MjJcXHVBNzI0XFx1QTcyNlxcdUE3MjhcXHVBNzJBXFx1QTcyQ1xcdUE3MkVcXHVBNzMyXFx1QTczNFxcdUE3MzZcXHVBNzM4XFx1QTczQVxcdUE3M0NcXHVBNzNFXFx1QTc0MFxcdUE3NDJcXHVBNzQ0XFx1QTc0NlxcdUE3NDhcXHVBNzRBXFx1QTc0Q1xcdUE3NEVcXHVBNzUwXFx1QTc1MlxcdUE3NTRcXHVBNzU2XFx1QTc1OFxcdUE3NUFcXHVBNzVDXFx1QTc1RVxcdUE3NjBcXHVBNzYyXFx1QTc2NFxcdUE3NjZcXHVBNzY4XFx1QTc2QVxcdUE3NkNcXHVBNzZFXFx1QTc3OVxcdUE3N0JcXHVBNzdEXFx1QTc3RVxcdUE3ODBcXHVBNzgyXFx1QTc4NFxcdUE3ODZcXHVBNzhCXFx1QTc4RFxcdUE3OTBcXHVBNzkyXFx1QTc5NlxcdUE3OThcXHVBNzlBXFx1QTc5Q1xcdUE3OUVcXHVBN0EwXFx1QTdBMlxcdUE3QTRcXHVBN0E2XFx1QTdBOFxcdUE3QUEtXFx1QTdBRFxcdUE3QjAtXFx1QTdCNFxcdUE3QjZcXHVGRjIxLVxcdUZGM0FdW2EtelxceEI1XFx4REYtXFx4RjZcXHhGOC1cXHhGRlxcdTAxMDFcXHUwMTAzXFx1MDEwNVxcdTAxMDdcXHUwMTA5XFx1MDEwQlxcdTAxMERcXHUwMTBGXFx1MDExMVxcdTAxMTNcXHUwMTE1XFx1MDExN1xcdTAxMTlcXHUwMTFCXFx1MDExRFxcdTAxMUZcXHUwMTIxXFx1MDEyM1xcdTAxMjVcXHUwMTI3XFx1MDEyOVxcdTAxMkJcXHUwMTJEXFx1MDEyRlxcdTAxMzFcXHUwMTMzXFx1MDEzNVxcdTAxMzdcXHUwMTM4XFx1MDEzQVxcdTAxM0NcXHUwMTNFXFx1MDE0MFxcdTAxNDJcXHUwMTQ0XFx1MDE0NlxcdTAxNDhcXHUwMTQ5XFx1MDE0QlxcdTAxNERcXHUwMTRGXFx1MDE1MVxcdTAxNTNcXHUwMTU1XFx1MDE1N1xcdTAxNTlcXHUwMTVCXFx1MDE1RFxcdTAxNUZcXHUwMTYxXFx1MDE2M1xcdTAxNjVcXHUwMTY3XFx1MDE2OVxcdTAxNkJcXHUwMTZEXFx1MDE2RlxcdTAxNzFcXHUwMTczXFx1MDE3NVxcdTAxNzdcXHUwMTdBXFx1MDE3Q1xcdTAxN0UtXFx1MDE4MFxcdTAxODNcXHUwMTg1XFx1MDE4OFxcdTAxOENcXHUwMThEXFx1MDE5MlxcdTAxOTVcXHUwMTk5LVxcdTAxOUJcXHUwMTlFXFx1MDFBMVxcdTAxQTNcXHUwMUE1XFx1MDFBOFxcdTAxQUFcXHUwMUFCXFx1MDFBRFxcdTAxQjBcXHUwMUI0XFx1MDFCNlxcdTAxQjlcXHUwMUJBXFx1MDFCRC1cXHUwMUJGXFx1MDFDNlxcdTAxQzlcXHUwMUNDXFx1MDFDRVxcdTAxRDBcXHUwMUQyXFx1MDFENFxcdTAxRDZcXHUwMUQ4XFx1MDFEQVxcdTAxRENcXHUwMUREXFx1MDFERlxcdTAxRTFcXHUwMUUzXFx1MDFFNVxcdTAxRTdcXHUwMUU5XFx1MDFFQlxcdTAxRURcXHUwMUVGXFx1MDFGMFxcdTAxRjNcXHUwMUY1XFx1MDFGOVxcdTAxRkJcXHUwMUZEXFx1MDFGRlxcdTAyMDFcXHUwMjAzXFx1MDIwNVxcdTAyMDdcXHUwMjA5XFx1MDIwQlxcdTAyMERcXHUwMjBGXFx1MDIxMVxcdTAyMTNcXHUwMjE1XFx1MDIxN1xcdTAyMTlcXHUwMjFCXFx1MDIxRFxcdTAyMUZcXHUwMjIxXFx1MDIyM1xcdTAyMjVcXHUwMjI3XFx1MDIyOVxcdTAyMkJcXHUwMjJEXFx1MDIyRlxcdTAyMzFcXHUwMjMzLVxcdTAyMzlcXHUwMjNDXFx1MDIzRlxcdTAyNDBcXHUwMjQyXFx1MDI0N1xcdTAyNDlcXHUwMjRCXFx1MDI0RFxcdTAyNEYtXFx1MDI5M1xcdTAyOTUtXFx1MDJBRlxcdTAzNzFcXHUwMzczXFx1MDM3N1xcdTAzN0ItXFx1MDM3RFxcdTAzOTBcXHUwM0FDLVxcdTAzQ0VcXHUwM0QwXFx1MDNEMVxcdTAzRDUtXFx1MDNEN1xcdTAzRDlcXHUwM0RCXFx1MDNERFxcdTAzREZcXHUwM0UxXFx1MDNFM1xcdTAzRTVcXHUwM0U3XFx1MDNFOVxcdTAzRUJcXHUwM0VEXFx1MDNFRi1cXHUwM0YzXFx1MDNGNVxcdTAzRjhcXHUwM0ZCXFx1MDNGQ1xcdTA0MzAtXFx1MDQ1RlxcdTA0NjFcXHUwNDYzXFx1MDQ2NVxcdTA0NjdcXHUwNDY5XFx1MDQ2QlxcdTA0NkRcXHUwNDZGXFx1MDQ3MVxcdTA0NzNcXHUwNDc1XFx1MDQ3N1xcdTA0NzlcXHUwNDdCXFx1MDQ3RFxcdTA0N0ZcXHUwNDgxXFx1MDQ4QlxcdTA0OERcXHUwNDhGXFx1MDQ5MVxcdTA0OTNcXHUwNDk1XFx1MDQ5N1xcdTA0OTlcXHUwNDlCXFx1MDQ5RFxcdTA0OUZcXHUwNEExXFx1MDRBM1xcdTA0QTVcXHUwNEE3XFx1MDRBOVxcdTA0QUJcXHUwNEFEXFx1MDRBRlxcdTA0QjFcXHUwNEIzXFx1MDRCNVxcdTA0QjdcXHUwNEI5XFx1MDRCQlxcdTA0QkRcXHUwNEJGXFx1MDRDMlxcdTA0QzRcXHUwNEM2XFx1MDRDOFxcdTA0Q0FcXHUwNENDXFx1MDRDRVxcdTA0Q0ZcXHUwNEQxXFx1MDREM1xcdTA0RDVcXHUwNEQ3XFx1MDREOVxcdTA0REJcXHUwNEREXFx1MDRERlxcdTA0RTFcXHUwNEUzXFx1MDRFNVxcdTA0RTdcXHUwNEU5XFx1MDRFQlxcdTA0RURcXHUwNEVGXFx1MDRGMVxcdTA0RjNcXHUwNEY1XFx1MDRGN1xcdTA0RjlcXHUwNEZCXFx1MDRGRFxcdTA0RkZcXHUwNTAxXFx1MDUwM1xcdTA1MDVcXHUwNTA3XFx1MDUwOVxcdTA1MEJcXHUwNTBEXFx1MDUwRlxcdTA1MTFcXHUwNTEzXFx1MDUxNVxcdTA1MTdcXHUwNTE5XFx1MDUxQlxcdTA1MURcXHUwNTFGXFx1MDUyMVxcdTA1MjNcXHUwNTI1XFx1MDUyN1xcdTA1MjlcXHUwNTJCXFx1MDUyRFxcdTA1MkZcXHUwNTYxLVxcdTA1ODdcXHUxM0Y4LVxcdTEzRkRcXHUxRDAwLVxcdTFEMkJcXHUxRDZCLVxcdTFENzdcXHUxRDc5LVxcdTFEOUFcXHUxRTAxXFx1MUUwM1xcdTFFMDVcXHUxRTA3XFx1MUUwOVxcdTFFMEJcXHUxRTBEXFx1MUUwRlxcdTFFMTFcXHUxRTEzXFx1MUUxNVxcdTFFMTdcXHUxRTE5XFx1MUUxQlxcdTFFMURcXHUxRTFGXFx1MUUyMVxcdTFFMjNcXHUxRTI1XFx1MUUyN1xcdTFFMjlcXHUxRTJCXFx1MUUyRFxcdTFFMkZcXHUxRTMxXFx1MUUzM1xcdTFFMzVcXHUxRTM3XFx1MUUzOVxcdTFFM0JcXHUxRTNEXFx1MUUzRlxcdTFFNDFcXHUxRTQzXFx1MUU0NVxcdTFFNDdcXHUxRTQ5XFx1MUU0QlxcdTFFNERcXHUxRTRGXFx1MUU1MVxcdTFFNTNcXHUxRTU1XFx1MUU1N1xcdTFFNTlcXHUxRTVCXFx1MUU1RFxcdTFFNUZcXHUxRTYxXFx1MUU2M1xcdTFFNjVcXHUxRTY3XFx1MUU2OVxcdTFFNkJcXHUxRTZEXFx1MUU2RlxcdTFFNzFcXHUxRTczXFx1MUU3NVxcdTFFNzdcXHUxRTc5XFx1MUU3QlxcdTFFN0RcXHUxRTdGXFx1MUU4MVxcdTFFODNcXHUxRTg1XFx1MUU4N1xcdTFFODlcXHUxRThCXFx1MUU4RFxcdTFFOEZcXHUxRTkxXFx1MUU5M1xcdTFFOTUtXFx1MUU5RFxcdTFFOUZcXHUxRUExXFx1MUVBM1xcdTFFQTVcXHUxRUE3XFx1MUVBOVxcdTFFQUJcXHUxRUFEXFx1MUVBRlxcdTFFQjFcXHUxRUIzXFx1MUVCNVxcdTFFQjdcXHUxRUI5XFx1MUVCQlxcdTFFQkRcXHUxRUJGXFx1MUVDMVxcdTFFQzNcXHUxRUM1XFx1MUVDN1xcdTFFQzlcXHUxRUNCXFx1MUVDRFxcdTFFQ0ZcXHUxRUQxXFx1MUVEM1xcdTFFRDVcXHUxRUQ3XFx1MUVEOVxcdTFFREJcXHUxRUREXFx1MUVERlxcdTFFRTFcXHUxRUUzXFx1MUVFNVxcdTFFRTdcXHUxRUU5XFx1MUVFQlxcdTFFRURcXHUxRUVGXFx1MUVGMVxcdTFFRjNcXHUxRUY1XFx1MUVGN1xcdTFFRjlcXHUxRUZCXFx1MUVGRFxcdTFFRkYtXFx1MUYwN1xcdTFGMTAtXFx1MUYxNVxcdTFGMjAtXFx1MUYyN1xcdTFGMzAtXFx1MUYzN1xcdTFGNDAtXFx1MUY0NVxcdTFGNTAtXFx1MUY1N1xcdTFGNjAtXFx1MUY2N1xcdTFGNzAtXFx1MUY3RFxcdTFGODAtXFx1MUY4N1xcdTFGOTAtXFx1MUY5N1xcdTFGQTAtXFx1MUZBN1xcdTFGQjAtXFx1MUZCNFxcdTFGQjZcXHUxRkI3XFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzZcXHUxRkM3XFx1MUZEMC1cXHUxRkQzXFx1MUZENlxcdTFGRDdcXHUxRkUwLVxcdTFGRTdcXHUxRkYyLVxcdTFGRjRcXHUxRkY2XFx1MUZGN1xcdTIxMEFcXHUyMTBFXFx1MjEwRlxcdTIxMTNcXHUyMTJGXFx1MjEzNFxcdTIxMzlcXHUyMTNDXFx1MjEzRFxcdTIxNDYtXFx1MjE0OVxcdTIxNEVcXHUyMTg0XFx1MkMzMC1cXHUyQzVFXFx1MkM2MVxcdTJDNjVcXHUyQzY2XFx1MkM2OFxcdTJDNkFcXHUyQzZDXFx1MkM3MVxcdTJDNzNcXHUyQzc0XFx1MkM3Ni1cXHUyQzdCXFx1MkM4MVxcdTJDODNcXHUyQzg1XFx1MkM4N1xcdTJDODlcXHUyQzhCXFx1MkM4RFxcdTJDOEZcXHUyQzkxXFx1MkM5M1xcdTJDOTVcXHUyQzk3XFx1MkM5OVxcdTJDOUJcXHUyQzlEXFx1MkM5RlxcdTJDQTFcXHUyQ0EzXFx1MkNBNVxcdTJDQTdcXHUyQ0E5XFx1MkNBQlxcdTJDQURcXHUyQ0FGXFx1MkNCMVxcdTJDQjNcXHUyQ0I1XFx1MkNCN1xcdTJDQjlcXHUyQ0JCXFx1MkNCRFxcdTJDQkZcXHUyQ0MxXFx1MkNDM1xcdTJDQzVcXHUyQ0M3XFx1MkNDOVxcdTJDQ0JcXHUyQ0NEXFx1MkNDRlxcdTJDRDFcXHUyQ0QzXFx1MkNENVxcdTJDRDdcXHUyQ0Q5XFx1MkNEQlxcdTJDRERcXHUyQ0RGXFx1MkNFMVxcdTJDRTNcXHUyQ0U0XFx1MkNFQ1xcdTJDRUVcXHUyQ0YzXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHVBNjQxXFx1QTY0M1xcdUE2NDVcXHVBNjQ3XFx1QTY0OVxcdUE2NEJcXHVBNjREXFx1QTY0RlxcdUE2NTFcXHVBNjUzXFx1QTY1NVxcdUE2NTdcXHVBNjU5XFx1QTY1QlxcdUE2NURcXHVBNjVGXFx1QTY2MVxcdUE2NjNcXHVBNjY1XFx1QTY2N1xcdUE2NjlcXHVBNjZCXFx1QTY2RFxcdUE2ODFcXHVBNjgzXFx1QTY4NVxcdUE2ODdcXHVBNjg5XFx1QTY4QlxcdUE2OERcXHVBNjhGXFx1QTY5MVxcdUE2OTNcXHVBNjk1XFx1QTY5N1xcdUE2OTlcXHVBNjlCXFx1QTcyM1xcdUE3MjVcXHVBNzI3XFx1QTcyOVxcdUE3MkJcXHVBNzJEXFx1QTcyRi1cXHVBNzMxXFx1QTczM1xcdUE3MzVcXHVBNzM3XFx1QTczOVxcdUE3M0JcXHVBNzNEXFx1QTczRlxcdUE3NDFcXHVBNzQzXFx1QTc0NVxcdUE3NDdcXHVBNzQ5XFx1QTc0QlxcdUE3NERcXHVBNzRGXFx1QTc1MVxcdUE3NTNcXHVBNzU1XFx1QTc1N1xcdUE3NTlcXHVBNzVCXFx1QTc1RFxcdUE3NUZcXHVBNzYxXFx1QTc2M1xcdUE3NjVcXHVBNzY3XFx1QTc2OVxcdUE3NkJcXHVBNzZEXFx1QTc2RlxcdUE3NzEtXFx1QTc3OFxcdUE3N0FcXHVBNzdDXFx1QTc3RlxcdUE3ODFcXHVBNzgzXFx1QTc4NVxcdUE3ODdcXHVBNzhDXFx1QTc4RVxcdUE3OTFcXHVBNzkzLVxcdUE3OTVcXHVBNzk3XFx1QTc5OVxcdUE3OUJcXHVBNzlEXFx1QTc5RlxcdUE3QTFcXHVBN0EzXFx1QTdBNVxcdUE3QTdcXHVBN0E5XFx1QTdCNVxcdUE3QjdcXHVBN0ZBXFx1QUIzMC1cXHVBQjVBXFx1QUI2MC1cXHVBQjY1XFx1QUI3MC1cXHVBQkJGXFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkY0MS1cXHVGRjVBXSkvZ1xuIiwidmFyIGxvd2VyQ2FzZSA9IHJlcXVpcmUoJ2xvd2VyLWNhc2UnKVxuXG52YXIgTk9OX1dPUkRfUkVHRVhQID0gcmVxdWlyZSgnLi92ZW5kb3Ivbm9uLXdvcmQtcmVnZXhwJylcbnZhciBDQU1FTF9DQVNFX1JFR0VYUCA9IHJlcXVpcmUoJy4vdmVuZG9yL2NhbWVsLWNhc2UtcmVnZXhwJylcbnZhciBDQU1FTF9DQVNFX1VQUEVSX1JFR0VYUCA9IHJlcXVpcmUoJy4vdmVuZG9yL2NhbWVsLWNhc2UtdXBwZXItcmVnZXhwJylcblxuLyoqXG4gKiBTZW50ZW5jZSBjYXNlIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGxvY2FsZVxuICogQHBhcmFtICB7c3RyaW5nfSByZXBsYWNlbWVudFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIsIGxvY2FsZSwgcmVwbGFjZW1lbnQpIHtcbiAgaWYgKHN0ciA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICByZXBsYWNlbWVudCA9IHR5cGVvZiByZXBsYWNlbWVudCAhPT0gJ3N0cmluZycgPyAnICcgOiByZXBsYWNlbWVudFxuXG4gIGZ1bmN0aW9uIHJlcGxhY2UgKG1hdGNoLCBpbmRleCwgdmFsdWUpIHtcbiAgICBpZiAoaW5kZXggPT09IDAgfHwgaW5kZXggPT09ICh2YWx1ZS5sZW5ndGggLSBtYXRjaC5sZW5ndGgpKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG5cbiAgICByZXR1cm4gcmVwbGFjZW1lbnRcbiAgfVxuXG4gIHN0ciA9IFN0cmluZyhzdHIpXG4gICAgLy8gU3VwcG9ydCBjYW1lbCBjYXNlIChcImNhbWVsQ2FzZVwiIC0+IFwiY2FtZWwgQ2FzZVwiKS5cbiAgICAucmVwbGFjZShDQU1FTF9DQVNFX1JFR0VYUCwgJyQxICQyJylcbiAgICAvLyBTdXBwb3J0IG9kZCBjYW1lbCBjYXNlIChcIkNBTUVMQ2FzZVwiIC0+IFwiQ0FNRUwgQ2FzZVwiKS5cbiAgICAucmVwbGFjZShDQU1FTF9DQVNFX1VQUEVSX1JFR0VYUCwgJyQxICQyJylcbiAgICAvLyBSZW1vdmUgYWxsIG5vbi13b3JkIGNoYXJhY3RlcnMgYW5kIHJlcGxhY2Ugd2l0aCBhIHNpbmdsZSBzcGFjZS5cbiAgICAucmVwbGFjZShOT05fV09SRF9SRUdFWFAsIHJlcGxhY2UpXG5cbiAgLy8gTG93ZXIgY2FzZSB0aGUgZW50aXJlIHN0cmluZy5cbiAgcmV0dXJuIGxvd2VyQ2FzZShzdHIsIGxvY2FsZSlcbn1cbiIsInZhciB1cHBlckNhc2UgPSByZXF1aXJlKCd1cHBlci1jYXNlJylcbnZhciBub0Nhc2UgPSByZXF1aXJlKCduby1jYXNlJylcblxuLyoqXG4gKiBDYW1lbCBjYXNlIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSAge3N0cmluZ30gW2xvY2FsZV1cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWUsIGxvY2FsZSwgbWVyZ2VOdW1iZXJzKSB7XG4gIHZhciByZXN1bHQgPSBub0Nhc2UodmFsdWUsIGxvY2FsZSlcblxuICAvLyBSZXBsYWNlIHBlcmlvZHMgYmV0d2VlbiBudW1lcmljIGVudGl0aWVzIHdpdGggYW4gdW5kZXJzY29yZS5cbiAgaWYgKCFtZXJnZU51bWJlcnMpIHtcbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvICg/PVxcZCkvZywgJ18nKVxuICB9XG5cbiAgLy8gUmVwbGFjZSBzcGFjZXMgYmV0d2VlbiB3b3JkcyB3aXRoIGFuIHVwcGVyIGNhc2VkIGNoYXJhY3Rlci5cbiAgcmV0dXJuIHJlc3VsdC5yZXBsYWNlKC8gKC4pL2csIGZ1bmN0aW9uIChtLCAkMSkge1xuICAgIHJldHVybiB1cHBlckNhc2UoJDEsIGxvY2FsZSlcbiAgfSlcbn1cbiIsIi8vIGFuc2lSZWdleFxuY29uc3QgYW5zaVJlZ2V4ID0gKCkgPT4ge1xuICBjb25zdCBwYXR0ZXJuID0gW1xuICAgICdbXFxcXHUwMDFCXFxcXHUwMDlCXVtbXFxcXF0oKSM7P10qKD86KD86KD86W2EtekEtWlxcXFxkXSooPzo7W2EtekEtWlxcXFxkXSopKik/XFxcXHUwMDA3KScsXG4gICAgJyg/Oig/OlxcXFxkezEsNH0oPzo7XFxcXGR7MCw0fSkqKT9bXFxcXGRBLVBSWmNmLW50cXJ5PT48fl0pKSdcbiAgXS5qb2luKCd8JylcblxuICByZXR1cm4gbmV3IFJlZ0V4cChwYXR0ZXJuLCAnZycpXG59XG5cbi8vIGFzdHJhbFJlZ2V4XG5jb25zdCByZWdleCA9ICdbXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdJ1xuXG5jb25zdCBhc3RyYWxSZWdleCA9IChvcHRzPzogeyBleGFjdDogYm9vbGVhbiB9KSA9PlxuICBvcHRzICYmIG9wdHMuZXhhY3QgPyBuZXcgUmVnRXhwKGBeJHtyZWdleH0kYCkgOiBuZXcgUmVnRXhwKHJlZ2V4LCAnZycpXG5cbi8vIHN0cmlwQW5zaVxuY29uc3Qgc3RyaXBBbnNpID0gKGlucHV0OiBhbnkpID0+XG4gIHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgPyBpbnB1dC5yZXBsYWNlKGFuc2lSZWdleCgpLCAnJykgOiBpbnB1dFxuXG5leHBvcnQgY29uc3Qgc3RyaW5nTGVuZ3RoID0gKGlucHV0OiBzdHJpbmcpID0+XG4gIHN0cmlwQW5zaShpbnB1dCkucmVwbGFjZShhc3RyYWxSZWdleCgpLCAnICcpLmxlbmd0aFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZXN0cnVjdG9yQ29udGV4dCA9IGV4cG9ydHMuYnJhY2VDb250ZXh0ID0gZXhwb3J0cy5wYXJlbkNvbnRleHQgPSBleHBvcnRzLmJyYWNrZXREQ29udGV4dCA9IGV4cG9ydHMuYnJhY2tldEFycmF5Q29udGV4dCA9IGV4cG9ydHMuYnJhY2tldENvbnRleHQgPSB2b2lkIDA7XG52YXIgQ29udGV4dFR5cGUgPSBmdW5jdGlvbiAoZmxhZywgcHJvcHMpIHtcbiAgICByZXR1cm4gX19hc3NpZ24oeyBmbGFnOiBmbGFnIH0sIHByb3BzKTtcbn07XG5leHBvcnRzLmJyYWNrZXRDb250ZXh0ID0gQ29udGV4dFR5cGUoXCJbXVwiKTtcbmV4cG9ydHMuYnJhY2tldEFycmF5Q29udGV4dCA9IENvbnRleHRUeXBlKFwiW1xcXFxkXVwiKTtcbmV4cG9ydHMuYnJhY2tldERDb250ZXh0ID0gQ29udGV4dFR5cGUoXCJbW11dXCIpO1xuZXhwb3J0cy5wYXJlbkNvbnRleHQgPSBDb250ZXh0VHlwZShcIigpXCIpO1xuZXhwb3J0cy5icmFjZUNvbnRleHQgPSBDb250ZXh0VHlwZShcInt9XCIpO1xuZXhwb3J0cy5kZXN0cnVjdG9yQ29udGV4dCA9IENvbnRleHRUeXBlKFwie3h9XCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5lb2ZUb2sgPSBleHBvcnRzLmV4cGFuZFRvayA9IGV4cG9ydHMuaWdub3JlVG9rID0gZXhwb3J0cy5jb21tYVRvayA9IGV4cG9ydHMucGFyZW5SVG9rID0gZXhwb3J0cy5wYXJlbkxUb2sgPSBleHBvcnRzLmJyYWNrZXREUlRvayA9IGV4cG9ydHMuYnJhY2tldERMVG9rID0gZXhwb3J0cy5icmFja2V0UlRvayA9IGV4cG9ydHMuYnJhY2tldExUb2sgPSBleHBvcnRzLmJyYWNlUlRvayA9IGV4cG9ydHMuYnJhY2VMVG9rID0gZXhwb3J0cy5jb2xvblRvayA9IGV4cG9ydHMuYmFuZ1RvayA9IGV4cG9ydHMuZG90VG9rID0gZXhwb3J0cy5zdGFyVG9rID0gZXhwb3J0cy5uYW1lVG9rID0gdm9pZCAwO1xudmFyIGNvbnRleHRzXzEgPSByZXF1aXJlKFwiLi9jb250ZXh0c1wiKTtcbnZhciBUb2tlblR5cGUgPSBmdW5jdGlvbiAoZmxhZywgcHJvcHMpIHtcbiAgICByZXR1cm4gX19hc3NpZ24oeyBmbGFnOiBmbGFnIH0sIHByb3BzKTtcbn07XG5leHBvcnRzLm5hbWVUb2sgPSBUb2tlblR5cGUoJ25hbWUnLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gKG5leHQgPT09IGV4cG9ydHMuY29tbWFUb2sgfHxcbiAgICAgICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRSVG9rIHx8XG4gICAgICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFjZVJUb2sgfHxcbiAgICAgICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmNvbG9uVG9rKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG5leHQgPT09IGV4cG9ydHMuZG90VG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmVvZlRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0UlRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5wYXJlblJUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuY29sb25Ub2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuZXhwYW5kVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rKTtcbiAgICB9XG59KTtcbmV4cG9ydHMuc3RhclRvayA9IFRva2VuVHlwZSgnKicsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gKG5leHQgPT09IGV4cG9ydHMuZG90VG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLnN0YXJUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMucGFyZW5MVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmVvZlRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5jb21tYVRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5wYXJlblJUb2spO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5kb3RUb2sgPSBUb2tlblR5cGUoJy4nLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIChuZXh0ID09PSBleHBvcnRzLm5hbWVUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldERMVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLnN0YXJUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldExUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2VMVG9rKTtcbiAgICB9LFxuICAgIGV4cGVjdFByZXY6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIHJldHVybiAocHJldiA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLmJyYWNrZXREUlRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5zdGFyVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLnBhcmVuUlRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5icmFja2V0UlRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5leHBhbmRUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMuYnJhY2VSVG9rKTtcbiAgICB9XG59KTtcbmV4cG9ydHMuYmFuZ1RvayA9IFRva2VuVHlwZSgnIScsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2tldERMVG9rO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5jb2xvblRvayA9IFRva2VuVHlwZSgnOicsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLm5hbWVUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFjZUxUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0TFRvaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2tldERMVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2tldFJUb2s7XG4gICAgfVxufSk7XG5leHBvcnRzLmJyYWNlTFRvayA9IFRva2VuVHlwZSgneycsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5uYW1lVG9rO1xuICAgIH0sXG4gICAgZXhwZWN0UHJldjogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJldiA9PT0gZXhwb3J0cy5jb2xvblRvayB8fCBwcmV2ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8IHByZXYgPT09IGV4cG9ydHMuYnJhY2tldExUb2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZXYgPT09IGV4cG9ydHMuZG90VG9rIHx8IHByZXYgPT09IGV4cG9ydHMuY29sb25Ub2s7XG4gICAgfSxcbiAgICB1cGRhdGVDb250ZXh0OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucHVzaChjb250ZXh0c18xLmJyYWNlQ29udGV4dCk7XG4gICAgfVxufSk7XG5leHBvcnRzLmJyYWNlUlRvayA9IFRva2VuVHlwZSgnfScsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2VSVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuZW9mVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2tldFJUb2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMuZG90VG9rIHx8IG5leHQgPT09IGV4cG9ydHMuZW9mVG9rO1xuICAgIH0sXG4gICAgZXhwZWN0UHJldjogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgcmV0dXJuIHByZXYgPT09IGV4cG9ydHMubmFtZVRvayB8fCBwcmV2ID09PSBleHBvcnRzLmJyYWNlUlRvayB8fCBwcmV2ID09PSBleHBvcnRzLmJyYWNrZXRSVG9rO1xuICAgIH0sXG4gICAgdXBkYXRlQ29udGV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucG9wKGNvbnRleHRzXzEuYnJhY2VDb250ZXh0KTtcbiAgICB9XG59KTtcbmV4cG9ydHMuYnJhY2tldExUb2sgPSBUb2tlblR5cGUoJ1snLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2tldExUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFjZUxUb2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuZXh0ID09PSBleHBvcnRzLm5hbWVUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldERMVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmNvbG9uVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmlnbm9yZVRvayk7XG4gICAgfSxcbiAgICBleHBlY3RQcmV2OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmV2ID09PSBleHBvcnRzLmNvbG9uVG9rIHx8IHByZXYgPT09IGV4cG9ydHMuY29tbWFUb2sgfHwgcHJldiA9PT0gZXhwb3J0cy5icmFja2V0TFRvaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHByZXYgPT09IGV4cG9ydHMuc3RhclRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5icmFja2V0TFRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5kb3RUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMubmFtZVRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5wYXJlbkxUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT0gZXhwb3J0cy5jb21tYVRvayk7XG4gICAgfSxcbiAgICB1cGRhdGVDb250ZXh0OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucHVzaChjb250ZXh0c18xLmJyYWNrZXRDb250ZXh0KTtcbiAgICB9XG59KTtcbmV4cG9ydHMuYnJhY2tldFJUb2sgPSBUb2tlblR5cGUoJ10nLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5jb21tYVRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNlUlRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRSVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuZW9mVG9rO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAobmV4dCA9PT0gZXhwb3J0cy5kb3RUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuZW9mVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLnBhcmVuUlRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0UlRvayk7XG4gICAgfSxcbiAgICB1cGRhdGVDb250ZXh0OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5icmFja2V0QXJyYXlDb250ZXh0KSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKCF0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmJyYWNrZXRDb250ZXh0KSlcbiAgICAgICAgICAgIHRocm93IHRoaXMudW5leHBlY3QoKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnBvcCgpO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5icmFja2V0RExUb2sgPSBUb2tlblR5cGUoJ1tbJywge1xuICAgIHVwZGF0ZUNvbnRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnB1c2goY29udGV4dHNfMS5icmFja2V0RENvbnRleHQpO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5icmFja2V0RFJUb2sgPSBUb2tlblR5cGUoJ11dJywge1xuICAgIHVwZGF0ZUNvbnRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VyQ29udGV4dCgpICE9PSBjb250ZXh0c18xLmJyYWNrZXREQ29udGV4dClcbiAgICAgICAgICAgIHRocm93IHRoaXMudW5leHBlY3QoKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnBvcCgpO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5wYXJlbkxUb2sgPSBUb2tlblR5cGUoJygnLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIChuZXh0ID09PSBleHBvcnRzLm5hbWVUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldERMVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJhbmdUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldExUb2spO1xuICAgIH0sXG4gICAgZXhwZWN0UHJldjogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgcmV0dXJuIHByZXYgPT09IGV4cG9ydHMuc3RhclRvaztcbiAgICB9LFxuICAgIHVwZGF0ZUNvbnRleHQ6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wdXNoKGNvbnRleHRzXzEucGFyZW5Db250ZXh0KTtcbiAgICB9XG59KTtcbmV4cG9ydHMucGFyZW5SVG9rID0gVG9rZW5UeXBlKCcpJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLmRvdFRvayB8fCBuZXh0ID09PSBleHBvcnRzLmVvZlRvayB8fCBuZXh0ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8IG5leHQgPT09IGV4cG9ydHMucGFyZW5SVG9rO1xuICAgIH0sXG4gICAgdXBkYXRlQ29udGV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJDb250ZXh0KCkgIT09IGNvbnRleHRzXzEucGFyZW5Db250ZXh0KVxuICAgICAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdCgpO1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucG9wKCk7XG4gICAgfVxufSk7XG5leHBvcnRzLmNvbW1hVG9rID0gVG9rZW5UeXBlKCcsJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHJldHVybiAobmV4dCA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRETFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0TFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFjZUxUb2spO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5pZ25vcmVUb2sgPSBUb2tlblR5cGUoJ2lnbm9yZScsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0RFJUb2s7XG4gICAgfSxcbiAgICBleHBlY3RQcmV2OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICByZXR1cm4gcHJldiA9PSBleHBvcnRzLmJyYWNrZXRETFRvaztcbiAgICB9XG59KTtcbmV4cG9ydHMuZXhwYW5kVG9rID0gVG9rZW5UeXBlKCdleHBhbmRUb2snLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIChuZXh0ID09PSBleHBvcnRzLmRvdFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5lb2ZUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuY29tbWFUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMucGFyZW5SVG9rKTtcbiAgICB9XG59KTtcbmV4cG9ydHMuZW9mVG9rID0gVG9rZW5UeXBlKCdlb2YnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Ub2tlbml6ZXIgPSB2b2lkIDA7XG52YXIgdG9rZW5zXzEgPSByZXF1aXJlKFwiLi90b2tlbnNcIik7XG52YXIgY29udGV4dHNfMSA9IHJlcXVpcmUoXCIuL2NvbnRleHRzXCIpO1xudmFyIG5vbkFTQ0lJd2hpdGVzcGFjZSA9IC9bXFx1MTY4MFxcdTE4MGVcXHUyMDAwLVxcdTIwMGFcXHUyMDJmXFx1MjA1ZlxcdTMwMDBcXHVmZWZmXS87XG52YXIgZnVsbENoYXJDb2RlQXRQb3MgPSBmdW5jdGlvbiAoaW5wdXQsIHBvcykge1xuICAgIHZhciBjb2RlID0gaW5wdXQuY2hhckNvZGVBdChwb3MpO1xuICAgIGlmIChjb2RlIDw9IDB4ZDdmZiB8fCBjb2RlID49IDB4ZTAwMClcbiAgICAgICAgcmV0dXJuIGNvZGU7XG4gICAgdmFyIG5leHQgPSBpbnB1dC5jaGFyQ29kZUF0KHBvcyArIDEpO1xuICAgIHJldHVybiAoY29kZSA8PCAxMCkgKyBuZXh0IC0gMHgzNWZkYzAwO1xufTtcbnZhciBpc1Jld29yZENvZGUgPSBmdW5jdGlvbiAoY29kZSkge1xuICAgIHJldHVybiBjb2RlID09PSA0MiB8fFxuICAgICAgICBjb2RlID09PSA0NiB8fFxuICAgICAgICBjb2RlID09PSAzMyB8fFxuICAgICAgICBjb2RlID09PSA5MSB8fFxuICAgICAgICBjb2RlID09PSA5MyB8fFxuICAgICAgICBjb2RlID09PSA0MCB8fFxuICAgICAgICBjb2RlID09PSA0MSB8fFxuICAgICAgICBjb2RlID09PSA0NCB8fFxuICAgICAgICBjb2RlID09PSA1OCB8fFxuICAgICAgICBjb2RlID09PSAxMjYgfHxcbiAgICAgICAgY29kZSA9PT0gMTIzIHx8XG4gICAgICAgIGNvZGUgPT09IDEyNTtcbn07XG52YXIgZ2V0RXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSwgcHJvcHMpIHtcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIE9iamVjdC5hc3NpZ24oZXJyLCBwcm9wcyk7XG4gICAgcmV0dXJuIGVycjtcbn07XG52YXIgc2xpY2UgPSBmdW5jdGlvbiAoc3RyaW5nLCBzdGFydCwgZW5kKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICAgIHZhciBjaCA9IHN0cmluZy5jaGFyQXQoaSk7XG4gICAgICAgIGlmIChjaCAhPT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICBzdHIgKz0gY2g7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn07XG52YXIgVG9rZW5pemVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUb2tlbml6ZXIoaW5wdXQpIHtcbiAgICAgICAgdGhpcy5pbnB1dCA9IGlucHV0O1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgY29udGV4dDogW10sXG4gICAgICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICAgICAgcG9zOiAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIFRva2VuaXplci5wcm90b3R5cGUuY3VyQ29udGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuY29udGV4dFt0aGlzLnN0YXRlLmNvbnRleHQubGVuZ3RoIC0gMV07XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmluY2x1ZGVzQ29udGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgICAgIGZvciAodmFyIGxlbiA9IHRoaXMuc3RhdGUuY29udGV4dC5sZW5ndGggLSAxOyBsZW4gPj0gMDsgbGVuLS0pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmNvbnRleHRbbGVuXSA9PT0gY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUudW5leHBlY3QgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICB0eXBlID0gdHlwZSB8fCB0aGlzLnN0YXRlLnR5cGU7XG4gICAgICAgIHJldHVybiBnZXRFcnJvcihcIlVuZXhwZWN0IHRva2VuIFxcXCJcIiArIHR5cGUuZmxhZyArIFwiXFxcIiBpbiBcIiArIHRoaXMuc3RhdGUucG9zICsgXCIgY2hhci5cIiwge1xuICAgICAgICAgICAgcG9zOiB0aGlzLnN0YXRlLnBvc1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuZXhwZWN0TmV4dCA9IGZ1bmN0aW9uICh0eXBlLCBuZXh0KSB7XG4gICAgICAgIGlmICh0eXBlICYmIHR5cGUuZXhwZWN0TmV4dCkge1xuICAgICAgICAgICAgaWYgKG5leHQgJiYgIXR5cGUuZXhwZWN0TmV4dC5jYWxsKHRoaXMsIG5leHQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZ2V0RXJyb3IoXCJVbmV4cGVjdCB0b2tlbiBcXFwiXCIgKyBuZXh0LmZsYWcgKyBcIlxcXCIgdG9rZW4gc2hvdWxkIG5vdCBiZSBiZWhpbmQgXFxcIlwiICsgdHlwZS5mbGFnICsgXCJcXFwiIHRva2VuLihcIiArIHRoaXMuc3RhdGUucG9zICsgXCJ0aCBjaGFyKVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHBvczogdGhpcy5zdGF0ZS5wb3NcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5leHBlY3RQcmV2ID0gZnVuY3Rpb24gKHR5cGUsIHByZXYpIHtcbiAgICAgICAgaWYgKHR5cGUgJiYgdHlwZS5leHBlY3RQcmV2KSB7XG4gICAgICAgICAgICBpZiAocHJldiAmJiAhdHlwZS5leHBlY3RQcmV2LmNhbGwodGhpcywgcHJldikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBnZXRFcnJvcihcIlVuZXhwZWN0IHRva2VuIFxcXCJcIiArIHR5cGUuZmxhZyArIFwiXFxcIiBzaG91bGQgbm90IGJlIGJlaGluZCBcXFwiXCIgKyBwcmV2LmZsYWcgKyBcIlxcXCIoXCIgKyB0aGlzLnN0YXRlLnBvcyArIFwidGggY2hhcikuXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zOiB0aGlzLnN0YXRlLnBvc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUudHlwZSA9PT0gdHlwZTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc2tpcFNwYWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJDb250ZXh0KCkgPT09IGNvbnRleHRzXzEuYnJhY2tldERDb250ZXh0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsb29wOiB3aGlsZSAodGhpcy5zdGF0ZS5wb3MgPCB0aGlzLmlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGNoID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgICAgIHN3aXRjaCAoY2gpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDMyOlxuICAgICAgICAgICAgICAgIGNhc2UgMTYwOlxuICAgICAgICAgICAgICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSkgPT09IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICBjYXNlIDgyMzI6XG4gICAgICAgICAgICAgICAgY2FzZSA4MjMzOlxuICAgICAgICAgICAgICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoKGNoID4gOCAmJiBjaCA8IDE0KSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgKGNoID49IDU3NjAgJiYgbm9uQVNDSUl3aGl0ZXNwYWNlLnRlc3QoU3RyaW5nLmZyb21DaGFyQ29kZShjaCkpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIGxvb3A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pbnB1dC5sZW5ndGggPD0gdGhpcy5zdGF0ZS5wb3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmVvZlRvayk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5za2lwU3BhY2UoKTtcbiAgICAgICAgdGhpcy5yZWFkVG9rZW4odGhpcy5nZXRDb2RlKCksIHRoaXMuc3RhdGUucG9zID4gMCA/IHRoaXMuZ2V0Q29kZSh0aGlzLnN0YXRlLnBvcyAtIDEpIDogLUluZmluaXR5KTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuZ2V0Q29kZSA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgaWYgKHBvcyA9PT0gdm9pZCAwKSB7IHBvcyA9IHRoaXMuc3RhdGUucG9zOyB9XG4gICAgICAgIHJldHVybiBmdWxsQ2hhckNvZGVBdFBvcyh0aGlzLmlucHV0LCBwb3MpO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5lYXQgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICBpZiAodGhpcy5tYXRjaCh0eXBlKSkge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5yZWFkS2V5V29yZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5wb3MsIHN0cmluZyA9ICcnO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGNvZGUgPSB0aGlzLmdldENvZGUoKTtcbiAgICAgICAgICAgIHZhciBwcmV2Q29kZSA9IHRoaXMuZ2V0Q29kZSh0aGlzLnN0YXRlLnBvcyAtIDEpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXQubGVuZ3RoID09PSB0aGlzLnN0YXRlLnBvcykge1xuICAgICAgICAgICAgICAgIHN0cmluZyA9IHNsaWNlKHRoaXMuaW5wdXQsIHN0YXJ0UG9zLCB0aGlzLnN0YXRlLnBvcyArIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1Jld29yZENvZGUoY29kZSkgfHwgcHJldkNvZGUgPT09IDkyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvZGUgPT09IDMyIHx8XG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPT09IDE2MCB8fFxuICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAxMCB8fFxuICAgICAgICAgICAgICAgICAgICBjb2RlID09PSA4MjMyIHx8XG4gICAgICAgICAgICAgICAgICAgIGNvZGUgPT09IDgyMzMpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nID0gc2xpY2UodGhpcy5pbnB1dCwgc3RhcnRQb3MsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjb2RlID09PSAxMyAmJiB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAxKSA9PT0gMTApIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nID0gc2xpY2UodGhpcy5pbnB1dCwgc3RhcnRQb3MsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoY29kZSA+IDggJiYgY29kZSA8IDE0KSB8fFxuICAgICAgICAgICAgICAgICAgICAoY29kZSA+PSA1NzYwICYmIG5vbkFTQ0lJd2hpdGVzcGFjZS50ZXN0KFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSkpKSkge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgPSBzbGljZSh0aGlzLmlucHV0LCBzdGFydFBvcywgdGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0cmluZyA9IHNsaWNlKHRoaXMuaW5wdXQsIHN0YXJ0UG9zLCB0aGlzLnN0YXRlLnBvcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5uYW1lVG9rLCBzdHJpbmcpO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5yZWFkSW5nb3JlU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnBvcywgcHJldkNvZGUsIHN0cmluZyA9ICcnO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGNvZGUgPSB0aGlzLmdldENvZGUoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnBvcyA+PSB0aGlzLmlucHV0Lmxlbmd0aClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGlmICgoY29kZSA9PT0gOTEgfHwgY29kZSA9PT0gOTMpICYmIHByZXZDb2RlID09PSA5Mikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICAgICAgcHJldkNvZGUgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvZGUgPT0gOTMgJiYgcHJldkNvZGUgPT09IDkzKSB7XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gdGhpcy5pbnB1dFxuICAgICAgICAgICAgICAgICAgICAuc2xpY2Uoc3RhcnRQb3MsIHRoaXMuc3RhdGUucG9zIC0gMSlcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwoW1xcW1xcXV0pL2csICckMScpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgICAgIHByZXZDb2RlID0gY29kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmlnbm9yZVRvaywgc3RyaW5nKTtcbiAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5icmFja2V0RFJUb2spO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5maW5pc2hUb2tlbiA9IGZ1bmN0aW9uICh0eXBlLCB2YWx1ZSkge1xuICAgICAgICB2YXIgcHJlVHlwZSA9IHRoaXMuc3RhdGUudHlwZTtcbiAgICAgICAgdGhpcy5zdGF0ZS50eXBlID0gdHlwZTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZXhwZWN0TmV4dChwcmVUeXBlLCB0eXBlKTtcbiAgICAgICAgdGhpcy5leHBlY3RQcmV2KHR5cGUsIHByZVR5cGUpO1xuICAgICAgICBpZiAodHlwZS51cGRhdGVDb250ZXh0KSB7XG4gICAgICAgICAgICB0eXBlLnVwZGF0ZUNvbnRleHQuY2FsbCh0aGlzLCBwcmVUeXBlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5yZWFkVG9rZW4gPSBmdW5jdGlvbiAoY29kZSwgcHJldkNvZGUpIHtcbiAgICAgICAgaWYgKHByZXZDb2RlID09PSA5Mikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZEtleVdvcmQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbnB1dC5sZW5ndGggPD0gdGhpcy5zdGF0ZS5wb3MpIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuZW9mVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmN1ckNvbnRleHQoKSA9PT0gY29udGV4dHNfMS5icmFja2V0RENvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMucmVhZEluZ29yZVN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDEyMykge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuYnJhY2VMVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSAxMjUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmJyYWNlUlRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gNDIpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLnN0YXJUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDMzKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5iYW5nVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSA0Nikge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuZG90VG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSA5MSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIGlmICh0aGlzLmdldENvZGUoKSA9PT0gOTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmJyYWNrZXRETFRvayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmJyYWNrZXRMVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSAxMjYpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmV4cGFuZFRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gOTMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmJyYWNrZXRSVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSA0MCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEucGFyZW5MVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSA0MSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEucGFyZW5SVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSA0NCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuY29tbWFUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDU4KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5jb2xvblRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWRLZXlXb3JkKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBUb2tlbml6ZXI7XG59KCkpO1xuZXhwb3J0cy5Ub2tlbml6ZXIgPSBUb2tlbml6ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNBcnJheVBhdHRlcm4gPSBleHBvcnRzLmlzT2JqZWN0UGF0dGVyblByb3BlcnR5ID0gZXhwb3J0cy5pc09iamVjdFBhdHRlcm4gPSBleHBvcnRzLmlzRGVzdHJ1Y3RvckV4cHJlc3Npb24gPSBleHBvcnRzLmlzUmFuZ2VFeHByZXNzaW9uID0gZXhwb3J0cy5pc0dyb3VwRXhwcmVzc2lvbiA9IGV4cG9ydHMuaXNFeHBhbmRPcGVyYXRvciA9IGV4cG9ydHMuaXNXaWxkY2FyZE9wZXJhdG9yID0gZXhwb3J0cy5pc0RvdE9wZXJhdG9yID0gZXhwb3J0cy5pc0lnbm9yZUV4cHJlc3Npb24gPSBleHBvcnRzLmlzSWRlbnRpZmllciA9IGV4cG9ydHMuaXNUeXBlID0gdm9pZCAwO1xuZXhwb3J0cy5pc1R5cGUgPSBmdW5jdGlvbiAodHlwZSkgeyByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLnR5cGUgPT09IHR5cGU7XG59OyB9O1xuZXhwb3J0cy5pc0lkZW50aWZpZXIgPSBleHBvcnRzLmlzVHlwZSgnSWRlbnRpZmllcicpO1xuZXhwb3J0cy5pc0lnbm9yZUV4cHJlc3Npb24gPSBleHBvcnRzLmlzVHlwZSgnSWdub3JlRXhwcmVzc2lvbicpO1xuZXhwb3J0cy5pc0RvdE9wZXJhdG9yID0gZXhwb3J0cy5pc1R5cGUoJ0RvdE9wZXJhdG9yJyk7XG5leHBvcnRzLmlzV2lsZGNhcmRPcGVyYXRvciA9IGV4cG9ydHMuaXNUeXBlKCdXaWxkY2FyZE9wZXJhdG9yJyk7XG5leHBvcnRzLmlzRXhwYW5kT3BlcmF0b3IgPSBleHBvcnRzLmlzVHlwZSgnRXhwYW5kT3BlcmF0b3InKTtcbmV4cG9ydHMuaXNHcm91cEV4cHJlc3Npb24gPSBleHBvcnRzLmlzVHlwZSgnR3JvdXBFeHByZXNzaW9uJyk7XG5leHBvcnRzLmlzUmFuZ2VFeHByZXNzaW9uID0gZXhwb3J0cy5pc1R5cGUoJ1JhbmdlRXhwcmVzc2lvbicpO1xuZXhwb3J0cy5pc0Rlc3RydWN0b3JFeHByZXNzaW9uID0gZXhwb3J0cy5pc1R5cGUoJ0Rlc3RydWN0b3JFeHByZXNzaW9uJyk7XG5leHBvcnRzLmlzT2JqZWN0UGF0dGVybiA9IGV4cG9ydHMuaXNUeXBlKCdPYmplY3RQYXR0ZXJuJyk7XG5leHBvcnRzLmlzT2JqZWN0UGF0dGVyblByb3BlcnR5ID0gZXhwb3J0cy5pc1R5cGUoJ09iamVjdFBhdHRlcm5Qcm9wZXJ0eScpO1xuZXhwb3J0cy5pc0FycmF5UGF0dGVybiA9IGV4cG9ydHMuaXNUeXBlKCdBcnJheVBhdHRlcm4nKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0VxdWFsID0gZXhwb3J0cy50b0FycmF5ID0gZXhwb3J0cy5pc1JlZ0V4cCA9IGV4cG9ydHMuaXNPYmogPSBleHBvcnRzLmlzTnVtID0gZXhwb3J0cy5pc0Jvb2wgPSBleHBvcnRzLmlzU3RyID0gZXhwb3J0cy5pc1BsYWluT2JqID0gZXhwb3J0cy5pc0FyciA9IGV4cG9ydHMuaXNGbiA9IHZvaWQgMDtcbnZhciBpc1R5cGUgPSBmdW5jdGlvbiAodHlwZSkgeyByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IFwiICsgdHlwZSArIFwiXVwiO1xufTsgfTtcbmV4cG9ydHMuaXNGbiA9IGlzVHlwZSgnRnVuY3Rpb24nKTtcbmV4cG9ydHMuaXNBcnIgPSBBcnJheS5pc0FycmF5IHx8IGlzVHlwZSgnQXJyYXknKTtcbmV4cG9ydHMuaXNQbGFpbk9iaiA9IGlzVHlwZSgnT2JqZWN0Jyk7XG5leHBvcnRzLmlzU3RyID0gaXNUeXBlKCdTdHJpbmcnKTtcbmV4cG9ydHMuaXNCb29sID0gaXNUeXBlKCdCb29sZWFuJyk7XG5leHBvcnRzLmlzTnVtID0gaXNUeXBlKCdOdW1iZXInKTtcbmV4cG9ydHMuaXNPYmogPSBmdW5jdGlvbiAodmFsKSB7IHJldHVybiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JzsgfTtcbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1R5cGUoJ1JlZ0V4cCcpO1xudmFyIGlzQXJyYXkgPSBleHBvcnRzLmlzQXJyO1xudmFyIGtleUxpc3QgPSBPYmplY3Qua2V5cztcbnZhciBoYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmV4cG9ydHMudG9BcnJheSA9IGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKSA/IHZhbCA6IHZhbCAhPT0gdW5kZWZpbmVkID8gW3ZhbF0gOiBbXTsgfTtcbmV4cG9ydHMuaXNFcXVhbCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChhICYmIGIgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnICYmIHR5cGVvZiBiID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2YXIgYXJyQSA9IGlzQXJyYXkoYSk7XG4gICAgICAgIHZhciBhcnJCID0gaXNBcnJheShiKTtcbiAgICAgICAgdmFyIGkgPSB2b2lkIDA7XG4gICAgICAgIHZhciBsZW5ndGhfMTtcbiAgICAgICAgdmFyIGtleSA9IHZvaWQgMDtcbiAgICAgICAgaWYgKGFyckEgJiYgYXJyQikge1xuICAgICAgICAgICAgbGVuZ3RoXzEgPSBhLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChsZW5ndGhfMSAhPT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSBsZW5ndGhfMTsgaS0tICE9PSAwOykge1xuICAgICAgICAgICAgICAgIGlmICghZXhwb3J0cy5pc0VxdWFsKGFbaV0sIGJbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJyQSAhPT0gYXJyQikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrZXlzID0ga2V5TGlzdChhKTtcbiAgICAgICAgbGVuZ3RoXzEgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbmd0aF8xICE9PSBrZXlMaXN0KGIpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IGxlbmd0aF8xOyBpLS0gIT09IDA7KSB7XG4gICAgICAgICAgICBpZiAoIWhhc1Byb3AuY2FsbChiLCBrZXlzW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSBsZW5ndGhfMTsgaS0tICE9PSAwOykge1xuICAgICAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgIGlmICghZXhwb3J0cy5pc0VxdWFsKGFba2V5XSwgYltrZXldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGEgIT09IGEgJiYgYiAhPT0gYjtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZXhpc3RJbkJ5RGVzdHJ1Y3RvciA9IGV4cG9ydHMuZGVsZXRlSW5CeURlc3RydWN0b3IgPSBleHBvcnRzLmdldEluQnlEZXN0cnVjdG9yID0gZXhwb3J0cy5zZXRJbkJ5RGVzdHJ1Y3RvciA9IGV4cG9ydHMucGFyc2VEZXN0cnVjdG9yUnVsZXMgPSBleHBvcnRzLnNldERlc3RydWN0b3IgPSBleHBvcnRzLmdldERlc3RydWN0b3IgPSB2b2lkIDA7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBEZXN0cmN1dG9yQ2FjaGUgPSBuZXcgTWFwKCk7XG52YXIgaXNWYWxpZCA9IGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkICYmIHZhbCAhPT0gbnVsbDsgfTtcbmV4cG9ydHMuZ2V0RGVzdHJ1Y3RvciA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICByZXR1cm4gRGVzdHJjdXRvckNhY2hlLmdldChzb3VyY2UpO1xufTtcbmV4cG9ydHMuc2V0RGVzdHJ1Y3RvciA9IGZ1bmN0aW9uIChzb3VyY2UsIHJ1bGVzKSB7XG4gICAgRGVzdHJjdXRvckNhY2hlLnNldChzb3VyY2UsIHJ1bGVzKTtcbn07XG5leHBvcnRzLnBhcnNlRGVzdHJ1Y3RvclJ1bGVzID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgcnVsZXMgPSBbXTtcbiAgICBpZiAodHlwZXNfMS5pc09iamVjdFBhdHRlcm4obm9kZSkpIHtcbiAgICAgICAgdmFyIGluZGV4XzEgPSAwO1xuICAgICAgICBub2RlLnByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIHJ1bGVzW2luZGV4XzFdID0ge1xuICAgICAgICAgICAgICAgIHBhdGg6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcnVsZXNbaW5kZXhfMV0ua2V5ID0gY2hpbGQua2V5LnZhbHVlO1xuICAgICAgICAgICAgcnVsZXNbaW5kZXhfMV0ucGF0aC5wdXNoKGNoaWxkLmtleS52YWx1ZSk7XG4gICAgICAgICAgICBpZiAodHlwZXNfMS5pc0lkZW50aWZpZXIoY2hpbGQudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcnVsZXNbaW5kZXhfMV0ua2V5ID0gY2hpbGQudmFsdWUudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYmFzZVBhdGggPSBydWxlc1tpbmRleF8xXS5wYXRoO1xuICAgICAgICAgICAgdmFyIGNoaWxkUnVsZXMgPSBleHBvcnRzLnBhcnNlRGVzdHJ1Y3RvclJ1bGVzKGNoaWxkLnZhbHVlKTtcbiAgICAgICAgICAgIHZhciBrID0gaW5kZXhfMTtcbiAgICAgICAgICAgIGNoaWxkUnVsZXMuZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgICAgICAgIGlmIChydWxlc1trXSkge1xuICAgICAgICAgICAgICAgICAgICBydWxlc1trXS5rZXkgPSBydWxlLmtleTtcbiAgICAgICAgICAgICAgICAgICAgcnVsZXNba10ucGF0aCA9IGJhc2VQYXRoLmNvbmNhdChydWxlLnBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcnVsZXNba10gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHJ1bGUua2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYmFzZVBhdGguY29uY2F0KHJ1bGUucGF0aClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoayA+IGluZGV4XzEpIHtcbiAgICAgICAgICAgICAgICBpbmRleF8xID0gaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZGV4XzErKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBydWxlcztcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZXNfMS5pc0FycmF5UGF0dGVybihub2RlKSkge1xuICAgICAgICB2YXIgaW5kZXhfMiA9IDA7XG4gICAgICAgIG5vZGUuZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGtleSkge1xuICAgICAgICAgICAgcnVsZXNbaW5kZXhfMl0gPSB7XG4gICAgICAgICAgICAgICAgcGF0aDogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBydWxlc1tpbmRleF8yXS5rZXkgPSBrZXk7XG4gICAgICAgICAgICBydWxlc1tpbmRleF8yXS5wYXRoLnB1c2goa2V5KTtcbiAgICAgICAgICAgIGlmICh0eXBlc18xLmlzSWRlbnRpZmllcihjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICBydWxlc1tpbmRleF8yXS5rZXkgPSBjaGlsZC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiYXNlUGF0aCA9IHJ1bGVzW2luZGV4XzJdLnBhdGg7XG4gICAgICAgICAgICB2YXIgY2hpbGRSdWxlcyA9IGV4cG9ydHMucGFyc2VEZXN0cnVjdG9yUnVsZXMoY2hpbGQpO1xuICAgICAgICAgICAgdmFyIGsgPSBpbmRleF8yO1xuICAgICAgICAgICAgY2hpbGRSdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJ1bGVzW2tdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzW2tdLmtleSA9IHJ1bGUua2V5O1xuICAgICAgICAgICAgICAgICAgICBydWxlc1trXS5wYXRoID0gYmFzZVBhdGguY29uY2F0KHJ1bGUucGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBydWxlc1trXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogcnVsZS5rZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBiYXNlUGF0aC5jb25jYXQocnVsZS5wYXRoKVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrKys7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChrID4gaW5kZXhfMikge1xuICAgICAgICAgICAgICAgIGluZGV4XzIgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5kZXhfMisrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJ1bGVzO1xuICAgIH1cbiAgICBpZiAodHlwZXNfMS5pc0Rlc3RydWN0b3JFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiBleHBvcnRzLnBhcnNlRGVzdHJ1Y3RvclJ1bGVzKG5vZGUudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gcnVsZXM7XG59O1xuZXhwb3J0cy5zZXRJbkJ5RGVzdHJ1Y3RvciA9IGZ1bmN0aW9uIChzb3VyY2UsIHJ1bGVzLCB2YWx1ZSwgbXV0YXRvcnMpIHtcbiAgICBydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIga2V5ID0gX2Eua2V5LCBwYXRoID0gX2EucGF0aDtcbiAgICAgICAgbXV0YXRvcnMuc2V0SW4oW2tleV0sIHNvdXJjZSwgbXV0YXRvcnMuZ2V0SW4ocGF0aCwgdmFsdWUpKTtcbiAgICB9KTtcbn07XG5leHBvcnRzLmdldEluQnlEZXN0cnVjdG9yID0gZnVuY3Rpb24gKHNvdXJjZSwgcnVsZXMsIG11dGF0b3JzKSB7XG4gICAgdmFyIHJlc3BvbnNlID0ge307XG4gICAgaWYgKHJ1bGVzLmxlbmd0aCkge1xuICAgICAgICBpZiAodXRpbHNfMS5pc051bShydWxlc1swXS5wYXRoWzBdKSkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzb3VyY2UgPSBpc1ZhbGlkKHNvdXJjZSkgPyBzb3VyY2UgOiB7fTtcbiAgICBydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIga2V5ID0gX2Eua2V5LCBwYXRoID0gX2EucGF0aDtcbiAgICAgICAgbXV0YXRvcnMuc2V0SW4ocGF0aCwgcmVzcG9uc2UsIHNvdXJjZVtrZXldKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG59O1xuZXhwb3J0cy5kZWxldGVJbkJ5RGVzdHJ1Y3RvciA9IGZ1bmN0aW9uIChzb3VyY2UsIHJ1bGVzLCBtdXRhdG9ycykge1xuICAgIHJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBrZXkgPSBfYS5rZXk7XG4gICAgICAgIG11dGF0b3JzLmRlbGV0ZUluKFtrZXldLCBzb3VyY2UpO1xuICAgIH0pO1xufTtcbmV4cG9ydHMuZXhpc3RJbkJ5RGVzdHJ1Y3RvciA9IGZ1bmN0aW9uIChzb3VyY2UsIHJ1bGVzLCBzdGFydCwgbXV0YXRvcnMpIHtcbiAgICByZXR1cm4gcnVsZXMuZXZlcnkoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBrZXkgPSBfYS5rZXk7XG4gICAgICAgIHJldHVybiBtdXRhdG9ycy5leGlzdEluKFtrZXldLCBzb3VyY2UsIHN0YXJ0KTtcbiAgICB9KTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXJzZXIgPSB2b2lkIDA7XG52YXIgdG9rZW5pemVyXzEgPSByZXF1aXJlKFwiLi90b2tlbml6ZXJcIik7XG52YXIgdG9rZW5zXzEgPSByZXF1aXJlKFwiLi90b2tlbnNcIik7XG52YXIgY29udGV4dHNfMSA9IHJlcXVpcmUoXCIuL2NvbnRleHRzXCIpO1xudmFyIGRlc3RydWN0b3JfMSA9IHJlcXVpcmUoXCIuL2Rlc3RydWN0b3JcIik7XG52YXIgUGFyc2VyID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUGFyc2VyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFBhcnNlcigpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgdGhpcy5kYXRhID0ge1xuICAgICAgICAgICAgc2VnbWVudHM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIGlmICghdGhpcy5lYXQodG9rZW5zXzEuZW9mVG9rKSkge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICBub2RlID0gdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGEudHJlZSA9IG5vZGU7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAocGFyZW50LCBub2RlKSB7XG4gICAgICAgIGlmIChwYXJlbnQgJiYgbm9kZSkge1xuICAgICAgICAgICAgcGFyZW50LmFmdGVyID0gbm9kZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUF0b20gPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuYnJhY2VMVG9rOlxuICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5icmFja2V0TFRvazpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IHRva2Vuc18xLmJyYWNlTFRvaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPYmplY3RQYXR0ZXJuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUFycmF5UGF0dGVybigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGVzdHJ1Y3RvckV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEubmFtZVRvazpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuZXhwYW5kVG9rOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRXhwYW5kT3BlcmF0b3IoKTtcbiAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuc3RhclRvazpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVdpbGRjYXJkT3BlcmF0b3IoKTtcbiAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuYnJhY2tldERMVG9rOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlSWdub3JlRXhwcmVzc2lvbigpO1xuICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5kb3RUb2s6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEb3RPcGVyYXRvcigpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnB1c2hTZWdtZW50cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdGhpcy5kYXRhLnNlZ21lbnRzLnB1c2goa2V5KTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VJZGVudGlmaWVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdJZGVudGlmaWVyJyxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLnN0YXRlLnZhbHVlXG4gICAgICAgIH07XG4gICAgICAgIHZhciBoYXNOb3RJbkRlc3RydWN0b3IgPSAhdGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCkgJiZcbiAgICAgICAgICAgICF0aGlzLmlzTWF0Y2hQYXR0ZXJuICYmXG4gICAgICAgICAgICAhdGhpcy5pc1dpbGRNYXRjaFBhdHRlcm47XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICBpZiAodGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5icmFja2V0QXJyYXlDb250ZXh0KSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUudHlwZSAhPT0gdG9rZW5zXzEuYnJhY2tldFJUb2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaGFzTm90SW5EZXN0cnVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hTZWdtZW50cyhub2RlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS50eXBlID09PSB0b2tlbnNfMS5icmFja2V0TFRvaykge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS50eXBlICE9PSB0b2tlbnNfMS5uYW1lVG9rKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnB1c2goY29udGV4dHNfMS5icmFja2V0QXJyYXlDb250ZXh0KTtcbiAgICAgICAgICAgIHZhciBpc051bWJlcktleSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKC9eXFxkKyQvLnRlc3QodGhpcy5zdGF0ZS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpc051bWJlcktleSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5wdXNoU2VnbWVudHMoaXNOdW1iZXJLZXkgPyBOdW1iZXIodmFsdWUpIDogdmFsdWUpO1xuICAgICAgICAgICAgdmFyIGFmdGVyID0gdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKTtcbiAgICAgICAgICAgIGlmIChpc051bWJlcktleSkge1xuICAgICAgICAgICAgICAgIGFmdGVyLmFycmF5SW5kZXggPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcHBlbmQobm9kZSwgYWZ0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmQobm9kZSwgdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlRXhwYW5kT3BlcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ0V4cGFuZE9wZXJhdG9yJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmlzTWF0Y2hQYXR0ZXJuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc1dpbGRNYXRjaFBhdHRlcm4gPSB0cnVlO1xuICAgICAgICB0aGlzLmRhdGEuc2VnbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5vZGUsIHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VXaWxkY2FyZE9wZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdXaWxkY2FyZE9wZXJhdG9yJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmlzTWF0Y2hQYXR0ZXJuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc1dpbGRNYXRjaFBhdHRlcm4gPSB0cnVlO1xuICAgICAgICB0aGlzLmRhdGEuc2VnbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnR5cGUgPT09IHRva2Vuc18xLnBhcmVuTFRvaykge1xuICAgICAgICAgICAgbm9kZS5maWx0ZXIgPSB0aGlzLnBhcnNlR3JvdXBFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudHlwZSA9PT0gdG9rZW5zXzEuYnJhY2tldExUb2spIHtcbiAgICAgICAgICAgIG5vZGUuZmlsdGVyID0gdGhpcy5wYXJzZVJhbmdlRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFwcGVuZChub2RlLCB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlRGVzdHJ1Y3RvckV4cHJlc3Npb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ0Rlc3RydWN0b3JFeHByZXNzaW9uJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucHVzaChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KTtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5wb3MgLSAxO1xuICAgICAgICBub2RlLnZhbHVlID1cbiAgICAgICAgICAgIHRoaXMuc3RhdGUudHlwZSA9PT0gdG9rZW5zXzEuYnJhY2VMVG9rXG4gICAgICAgICAgICAgICAgPyB0aGlzLnBhcnNlT2JqZWN0UGF0dGVybigpXG4gICAgICAgICAgICAgICAgOiB0aGlzLnBhcnNlQXJyYXlQYXR0ZXJuKCk7XG4gICAgICAgIHZhciBlbmRQb3MgPSB0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnBvcCgpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5hcHBlbmQobm9kZSwgdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgIG5vZGUuc291cmNlID0gdGhpcy5pbnB1dC5zdWJzdHJpbmcoc3RhcnRQb3MsIGVuZFBvcykucmVwbGFjZSgvXFxzKi9nLCAnJyk7XG4gICAgICAgIGRlc3RydWN0b3JfMS5zZXREZXN0cnVjdG9yKG5vZGUuc291cmNlLCBkZXN0cnVjdG9yXzEucGFyc2VEZXN0cnVjdG9yUnVsZXMobm9kZSkpO1xuICAgICAgICB0aGlzLnB1c2hTZWdtZW50cyhub2RlLnNvdXJjZSk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUFycmF5UGF0dGVybiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnQXJyYXlQYXR0ZXJuJyxcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgbm9kZS5lbGVtZW50cyA9IHRoaXMucGFyc2VBcnJheVBhdHRlcm5FbGVtZW50cygpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VBcnJheVBhdHRlcm5FbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgIHdoaWxlICh0aGlzLnN0YXRlLnR5cGUgIT09IHRva2Vuc18xLmJyYWNrZXRSVG9rICYmIHRoaXMuc3RhdGUudHlwZSAhPT0gdG9rZW5zXzEuZW9mVG9rKSB7XG4gICAgICAgICAgICBub2Rlcy5wdXNoKHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUudHlwZSA9PT0gdG9rZW5zXzEuYnJhY2tldFJUb2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlcztcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VPYmplY3RQYXR0ZXJuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdPYmplY3RQYXR0ZXJuJyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICBub2RlLnByb3BlcnRpZXMgPSB0aGlzLnBhcnNlT2JqZWN0UHJvcGVydGllcygpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VPYmplY3RQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgd2hpbGUgKHRoaXMuc3RhdGUudHlwZSAhPT0gdG9rZW5zXzEuYnJhY2VSVG9rICYmIHRoaXMuc3RhdGUudHlwZSAhPT0gdG9rZW5zXzEuZW9mVG9rKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnT2JqZWN0UGF0dGVyblByb3BlcnR5JyxcbiAgICAgICAgICAgICAgICBrZXk6IHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBub2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUudHlwZSA9PT0gdG9rZW5zXzEuY29sb25Ub2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBub2RlLnZhbHVlID0gdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnR5cGUgPT09IHRva2Vuc18xLmJyYWNlUlRvaykge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZURvdE9wZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdEb3RPcGVyYXRvcidcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5vZGUsIHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VJZ25vcmVFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdmFyIHZhbHVlID0gU3RyaW5nKHRoaXMuc3RhdGUudmFsdWUpLnJlcGxhY2UoL1xccyovZywgJycpO1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdJZ25vcmVFeHByZXNzaW9uJyxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnB1c2hTZWdtZW50cyh2YWx1ZSk7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB0aGlzLmFwcGVuZChub2RlLCB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUdyb3VwRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnR3JvdXBFeHByZXNzaW9uJyxcbiAgICAgICAgICAgIHZhbHVlOiBbXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmlzTWF0Y2hQYXR0ZXJuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kYXRhLnNlZ21lbnRzID0gW107XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICBsb29wOiB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIHRva2Vuc18xLmNvbW1hVG9rOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5iYW5nVG9rOlxuICAgICAgICAgICAgICAgICAgICBub2RlLmlzRXhjbHVkZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGF2ZUV4Y2x1ZGVQYXR0ZXJuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuZW9mVG9rOlxuICAgICAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEucGFyZW5SVG9rOlxuICAgICAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIG5vZGUudmFsdWUucHVzaCh0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5hcHBlbmQocGFyZW50LCB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlUmFuZ2VFeHByZXNzaW9uID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdSYW5nZUV4cHJlc3Npb24nXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB0aGlzLmlzTWF0Y2hQYXR0ZXJuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kYXRhLnNlZ21lbnRzID0gW107XG4gICAgICAgIHZhciBzdGFydCA9IGZhbHNlLCBoYXNDb2xvbiA9IGZhbHNlO1xuICAgICAgICBsb29wOiB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIHRva2Vuc18xLmNvbG9uVG9rOlxuICAgICAgICAgICAgICAgICAgICBoYXNDb2xvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuYnJhY2tldFJUb2s6XG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFzQ29sb24gJiYgIW5vZGUuZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmVuZCA9IG5vZGUuc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgICAgICBjYXNlIHRva2Vuc18xLmNvbW1hVG9rOlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0KCk7XG4gICAgICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5lb2ZUb2s6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIGxvb3A7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5zdGFydCA9IHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmVuZCA9IHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5hcHBlbmQocGFyZW50LCB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICByZXR1cm4gUGFyc2VyO1xufSh0b2tlbml6ZXJfMS5Ub2tlbml6ZXIpKTtcbmV4cG9ydHMuUGFyc2VyID0gUGFyc2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkxSVU1hcCA9IHZvaWQgMDtcbnZhciBORVdFUiA9IFN5bWJvbCgnbmV3ZXInKTtcbnZhciBPTERFUiA9IFN5bWJvbCgnb2xkZXInKTtcbmZ1bmN0aW9uIExSVU1hcChsaW1pdCwgZW50cmllcykge1xuICAgIGlmICh0eXBlb2YgbGltaXQgIT09ICdudW1iZXInKSB7XG4gICAgICAgIGVudHJpZXMgPSBsaW1pdDtcbiAgICAgICAgbGltaXQgPSAwO1xuICAgIH1cbiAgICB0aGlzLnNpemUgPSAwO1xuICAgIHRoaXMubGltaXQgPSBsaW1pdDtcbiAgICB0aGlzLm9sZGVzdCA9IHRoaXMubmV3ZXN0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2tleW1hcCA9IG5ldyBNYXAoKTtcbiAgICBpZiAoZW50cmllcykge1xuICAgICAgICB0aGlzLmFzc2lnbihlbnRyaWVzKTtcbiAgICAgICAgaWYgKGxpbWl0IDwgMSkge1xuICAgICAgICAgICAgdGhpcy5saW1pdCA9IHRoaXMuc2l6ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuTFJVTWFwID0gTFJVTWFwO1xuZnVuY3Rpb24gRW50cnkoa2V5LCB2YWx1ZSkge1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzW05FV0VSXSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzW09MREVSXSA9IHVuZGVmaW5lZDtcbn1cbkxSVU1hcC5wcm90b3R5cGUuX21hcmtFbnRyeUFzVXNlZCA9IGZ1bmN0aW9uIChlbnRyeSkge1xuICAgIGlmIChlbnRyeSA9PT0gdGhpcy5uZXdlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZW50cnlbTkVXRVJdKSB7XG4gICAgICAgIGlmIChlbnRyeSA9PT0gdGhpcy5vbGRlc3QpIHtcbiAgICAgICAgICAgIHRoaXMub2xkZXN0ID0gZW50cnlbTkVXRVJdO1xuICAgICAgICB9XG4gICAgICAgIGVudHJ5W05FV0VSXVtPTERFUl0gPSBlbnRyeVtPTERFUl07XG4gICAgfVxuICAgIGlmIChlbnRyeVtPTERFUl0pIHtcbiAgICAgICAgZW50cnlbT0xERVJdW05FV0VSXSA9IGVudHJ5W05FV0VSXTtcbiAgICB9XG4gICAgZW50cnlbTkVXRVJdID0gdW5kZWZpbmVkO1xuICAgIGVudHJ5W09MREVSXSA9IHRoaXMubmV3ZXN0O1xuICAgIGlmICh0aGlzLm5ld2VzdCkge1xuICAgICAgICB0aGlzLm5ld2VzdFtORVdFUl0gPSBlbnRyeTtcbiAgICB9XG4gICAgdGhpcy5uZXdlc3QgPSBlbnRyeTtcbn07XG5MUlVNYXAucHJvdG90eXBlLmFzc2lnbiA9IGZ1bmN0aW9uIChlbnRyaWVzKSB7XG4gICAgdmFyIGVudHJ5O1xuICAgIHZhciBsaW1pdCA9IHRoaXMubGltaXQgfHwgTnVtYmVyLk1BWF9WQUxVRTtcbiAgICB0aGlzLl9rZXltYXAuY2xlYXIoKTtcbiAgICB2YXIgaXQgPSBlbnRyaWVzW1N5bWJvbC5pdGVyYXRvcl0oKTtcbiAgICBmb3IgKHZhciBpdHYgPSBpdC5uZXh0KCk7ICFpdHYuZG9uZTsgaXR2ID0gaXQubmV4dCgpKSB7XG4gICAgICAgIHZhciBlID0gbmV3IEVudHJ5KGl0di52YWx1ZVswXSwgaXR2LnZhbHVlWzFdKTtcbiAgICAgICAgdGhpcy5fa2V5bWFwLnNldChlLmtleSwgZSk7XG4gICAgICAgIGlmICghZW50cnkpIHtcbiAgICAgICAgICAgIHRoaXMub2xkZXN0ID0gZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVudHJ5W05FV0VSXSA9IGU7XG4gICAgICAgICAgICBlW09MREVSXSA9IGVudHJ5O1xuICAgICAgICB9XG4gICAgICAgIGVudHJ5ID0gZTtcbiAgICAgICAgaWYgKGxpbWl0LS0gPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb3ZlcmZsb3cnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm5ld2VzdCA9IGVudHJ5O1xuICAgIHRoaXMuc2l6ZSA9IHRoaXMuX2tleW1hcC5zaXplO1xufTtcbkxSVU1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBlbnRyeSA9IHRoaXMuX2tleW1hcC5nZXQoa2V5KTtcbiAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fbWFya0VudHJ5QXNVc2VkKGVudHJ5KTtcbiAgICByZXR1cm4gZW50cnkudmFsdWU7XG59O1xuTFJVTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHZhciBlbnRyeSA9IHRoaXMuX2tleW1hcC5nZXQoa2V5KTtcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgZW50cnkudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fbWFya0VudHJ5QXNVc2VkKGVudHJ5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoaXMuX2tleW1hcC5zZXQoa2V5LCAoZW50cnkgPSBuZXcgRW50cnkoa2V5LCB2YWx1ZSkpKTtcbiAgICBpZiAodGhpcy5uZXdlc3QpIHtcbiAgICAgICAgdGhpcy5uZXdlc3RbTkVXRVJdID0gZW50cnk7XG4gICAgICAgIGVudHJ5W09MREVSXSA9IHRoaXMubmV3ZXN0O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5vbGRlc3QgPSBlbnRyeTtcbiAgICB9XG4gICAgdGhpcy5uZXdlc3QgPSBlbnRyeTtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBpZiAodGhpcy5zaXplID4gdGhpcy5saW1pdCkge1xuICAgICAgICB0aGlzLnNoaWZ0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkxSVU1hcC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5vbGRlc3Q7XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICAgIGlmICh0aGlzLm9sZGVzdFtORVdFUl0pIHtcbiAgICAgICAgICAgIHRoaXMub2xkZXN0ID0gdGhpcy5vbGRlc3RbTkVXRVJdO1xuICAgICAgICAgICAgdGhpcy5vbGRlc3RbT0xERVJdID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbGRlc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLm5ld2VzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbnRyeVtORVdFUl0gPSBlbnRyeVtPTERFUl0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2tleW1hcC5kZWxldGUoZW50cnkua2V5KTtcbiAgICAgICAgLS10aGlzLnNpemU7XG4gICAgICAgIHJldHVybiBbZW50cnkua2V5LCBlbnRyeS52YWx1ZV07XG4gICAgfVxufTtcbkxSVU1hcC5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgZSA9IHRoaXMuX2tleW1hcC5nZXQoa2V5KTtcbiAgICByZXR1cm4gZSA/IGUudmFsdWUgOiB1bmRlZmluZWQ7XG59O1xuTFJVTWFwLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2tleW1hcC5oYXMoa2V5KTtcbn07XG5MUlVNYXAucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLl9rZXltYXAuZ2V0KGtleSk7XG4gICAgaWYgKCFlbnRyeSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2tleW1hcC5kZWxldGUoZW50cnkua2V5KTtcbiAgICBpZiAoZW50cnlbTkVXRVJdICYmIGVudHJ5W09MREVSXSkge1xuICAgICAgICBlbnRyeVtPTERFUl1bTkVXRVJdID0gZW50cnlbTkVXRVJdO1xuICAgICAgICBlbnRyeVtORVdFUl1bT0xERVJdID0gZW50cnlbT0xERVJdO1xuICAgIH1cbiAgICBlbHNlIGlmIChlbnRyeVtORVdFUl0pIHtcbiAgICAgICAgZW50cnlbTkVXRVJdW09MREVSXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5vbGRlc3QgPSBlbnRyeVtORVdFUl07XG4gICAgfVxuICAgIGVsc2UgaWYgKGVudHJ5W09MREVSXSkge1xuICAgICAgICBlbnRyeVtPTERFUl1bTkVXRVJdID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm5ld2VzdCA9IGVudHJ5W09MREVSXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMub2xkZXN0ID0gdGhpcy5uZXdlc3QgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuc2l6ZS0tO1xuICAgIHJldHVybiBlbnRyeS52YWx1ZTtcbn07XG5MUlVNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub2xkZXN0ID0gdGhpcy5uZXdlc3QgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zaXplID0gMDtcbiAgICB0aGlzLl9rZXltYXAuY2xlYXIoKTtcbn07XG5mdW5jdGlvbiBFbnRyeUl0ZXJhdG9yKG9sZGVzdEVudHJ5KSB7XG4gICAgdGhpcy5lbnRyeSA9IG9sZGVzdEVudHJ5O1xufVxuRW50cnlJdGVyYXRvci5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbn07XG5FbnRyeUl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbnQgPSB0aGlzLmVudHJ5O1xuICAgIGlmIChlbnQpIHtcbiAgICAgICAgdGhpcy5lbnRyeSA9IGVudFtORVdFUl07XG4gICAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogW2VudC5rZXksIGVudC52YWx1ZV0gfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcbiAgICB9XG59O1xuZnVuY3Rpb24gS2V5SXRlcmF0b3Iob2xkZXN0RW50cnkpIHtcbiAgICB0aGlzLmVudHJ5ID0gb2xkZXN0RW50cnk7XG59XG5LZXlJdGVyYXRvci5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbn07XG5LZXlJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW50ID0gdGhpcy5lbnRyeTtcbiAgICBpZiAoZW50KSB7XG4gICAgICAgIHRoaXMuZW50cnkgPSBlbnRbTkVXRVJdO1xuICAgICAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IGVudC5rZXkgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcbiAgICB9XG59O1xuZnVuY3Rpb24gVmFsdWVJdGVyYXRvcihvbGRlc3RFbnRyeSkge1xuICAgIHRoaXMuZW50cnkgPSBvbGRlc3RFbnRyeTtcbn1cblZhbHVlSXRlcmF0b3IucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuVmFsdWVJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW50ID0gdGhpcy5lbnRyeTtcbiAgICBpZiAoZW50KSB7XG4gICAgICAgIHRoaXMuZW50cnkgPSBlbnRbTkVXRVJdO1xuICAgICAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IGVudC52YWx1ZSB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuICAgIH1cbn07XG5MUlVNYXAucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBLZXlJdGVyYXRvcih0aGlzLm9sZGVzdCk7XG59O1xuTFJVTWFwLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBWYWx1ZUl0ZXJhdG9yKHRoaXMub2xkZXN0KTtcbn07XG5MUlVNYXAucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuTFJVTWFwLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgRW50cnlJdGVyYXRvcih0aGlzLm9sZGVzdCk7XG59O1xuTFJVTWFwLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGZ1biwgdGhpc09iaikge1xuICAgIGlmICh0eXBlb2YgdGhpc09iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpc09iaiA9IHRoaXM7XG4gICAgfVxuICAgIHZhciBlbnRyeSA9IHRoaXMub2xkZXN0O1xuICAgIHdoaWxlIChlbnRyeSkge1xuICAgICAgICBmdW4uY2FsbCh0aGlzT2JqLCBlbnRyeS52YWx1ZSwgZW50cnkua2V5LCB0aGlzKTtcbiAgICAgICAgZW50cnkgPSBlbnRyeVtORVdFUl07XG4gICAgfVxufTtcbkxSVU1hcC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzID0gbmV3IEFycmF5KHRoaXMuc2l6ZSk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBlbnRyeSA9IHRoaXMub2xkZXN0O1xuICAgIHdoaWxlIChlbnRyeSkge1xuICAgICAgICBzW2krK10gPSB7IGtleTogZW50cnkua2V5LCB2YWx1ZTogZW50cnkudmFsdWUgfTtcbiAgICAgICAgZW50cnkgPSBlbnRyeVtORVdFUl07XG4gICAgfVxuICAgIHJldHVybiBzO1xufTtcbkxSVU1hcC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHMgPSAnJztcbiAgICB2YXIgZW50cnkgPSB0aGlzLm9sZGVzdDtcbiAgICB3aGlsZSAoZW50cnkpIHtcbiAgICAgICAgcyArPSBTdHJpbmcoZW50cnkua2V5KSArICc6JyArIGVudHJ5LnZhbHVlO1xuICAgICAgICBlbnRyeSA9IGVudHJ5W05FV0VSXTtcbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICBzICs9ICcgPCAnO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5NYXRjaGVyID0gdm9pZCAwO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgaXNWYWxpZCA9IGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkICYmIHZhbCAhPT0gbnVsbCAmJiB2YWwgIT09ICcnOyB9O1xudmFyIE1hdGNoZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1hdGNoZXIodHJlZSwgcmVjb3JkKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMubWF0Y2hOZXh0ID0gZnVuY3Rpb24gKG5vZGUsIHBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmFmdGVyXG4gICAgICAgICAgICAgICAgPyBfdGhpcy5tYXRjaEF0b20ocGF0aCwgbm9kZS5hZnRlcilcbiAgICAgICAgICAgICAgICA6IGlzVmFsaWQocGF0aFtfdGhpcy5wb3NdKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50cmVlID0gdHJlZTtcbiAgICAgICAgdGhpcy5wb3MgPSAwO1xuICAgICAgICB0aGlzLmV4Y2x1ZGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlY29yZCA9IHJlY29yZDtcbiAgICAgICAgdGhpcy5zdGFjayA9IFtdO1xuICAgIH1cbiAgICBNYXRjaGVyLnByb3RvdHlwZS5jdXJyZW50RWxlbWVudCA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcocGF0aFt0aGlzLnBvc10gfHwgJycpLnJlcGxhY2UoL1xccyovZywgJycpO1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUucmVjb3JkTWF0Y2ggPSBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBtYXRjaCgpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5yZWNvcmQgJiYgX3RoaXMucmVjb3JkLnNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVjb3JkLnNjb3JlKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoSWRlbnRpZmllciA9IGZ1bmN0aW9uIChwYXRoLCBub2RlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMudGFpbCA9IG5vZGU7XG4gICAgICAgIGlmIChpc1ZhbGlkKHBhdGhbdGhpcy5wb3MgKyAxXSkgJiYgIW5vZGUuYWZ0ZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnN0YWNrLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zdGFja1tpXS5hZnRlciB8fCAhdGhpcy5zdGFja1tpXS5maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgY3VycmVudDtcbiAgICAgICAgdmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMubWF0Y2hOZXh0KG5vZGUsIHBhdGgpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZXNfMS5pc0V4cGFuZE9wZXJhdG9yKG5vZGUuYWZ0ZXIpKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5yZWNvcmRNYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUudmFsdWUgPT09IFN0cmluZyhwYXRoW190aGlzLnBvc10pLnN1YnN0cmluZygwLCBub2RlLnZhbHVlLmxlbmd0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLnJlY29yZE1hdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXRpbHNfMS5pc0VxdWFsKFN0cmluZyhub2RlLnZhbHVlKSwgU3RyaW5nKHBhdGhbX3RoaXMucG9zXSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZXhjbHVkaW5nKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5hZnRlcikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBvcyA8IHBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50KCkgJiYgbmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuYWZ0ZXIgJiYgdHlwZXNfMS5pc1dpbGRjYXJkT3BlcmF0b3Iobm9kZS5hZnRlci5hZnRlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3MgPj0gcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnJlbnQoKSAmJiBuZXh0KCk7XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaElnbm9yZUV4cHJlc3Npb24gPSBmdW5jdGlvbiAocGF0aCwgbm9kZSkge1xuICAgICAgICByZXR1cm4gKHV0aWxzXzEuaXNFcXVhbChub2RlLnZhbHVlLCB0aGlzLmN1cnJlbnRFbGVtZW50KHBhdGgpKSAmJlxuICAgICAgICAgICAgdGhpcy5tYXRjaE5leHQobm9kZSwgcGF0aCkpO1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hEZXN0cnVjdG9yRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIChwYXRoLCBub2RlKSB7XG4gICAgICAgIHJldHVybiAodXRpbHNfMS5pc0VxdWFsKG5vZGUuc291cmNlLCB0aGlzLmN1cnJlbnRFbGVtZW50KHBhdGgpKSAmJlxuICAgICAgICAgICAgdGhpcy5tYXRjaE5leHQobm9kZSwgcGF0aCkpO1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hFeHBhbmRPcGVyYXRvciA9IGZ1bmN0aW9uIChwYXRoLCBub2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hdGNoQXRvbShwYXRoLCBub2RlLmFmdGVyKTtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoV2lsZGNhcmRPcGVyYXRvciA9IGZ1bmN0aW9uIChwYXRoLCBub2RlKSB7XG4gICAgICAgIHRoaXMudGFpbCA9IG5vZGU7XG4gICAgICAgIHRoaXMuc3RhY2sucHVzaChub2RlKTtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG5vZGUuZmlsdGVyKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5hZnRlcikge1xuICAgICAgICAgICAgICAgIG1hdGNoZWQgPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGNoQXRvbShwYXRoLCBub2RlLmZpbHRlcikgJiYgdGhpcy5tYXRjaEF0b20ocGF0aCwgbm9kZS5hZnRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVkID0gdGhpcy5tYXRjaEF0b20ocGF0aCwgbm9kZS5maWx0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbWF0Y2hlZCA9IHRoaXMubWF0Y2hOZXh0KG5vZGUsIHBhdGgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhY2sucG9wKCk7XG4gICAgICAgIHJldHVybiBtYXRjaGVkO1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hHcm91cEV4cHJlc3Npb24gPSBmdW5jdGlvbiAocGF0aCwgbm9kZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMucG9zO1xuICAgICAgICB0aGlzLmV4Y2x1ZGluZyA9ICEhbm9kZS5pc0V4Y2x1ZGU7XG4gICAgICAgIHZhciBtZXRob2QgPSB0aGlzLmV4Y2x1ZGluZyA/ICdldmVyeScgOiAnc29tZSc7XG4gICAgICAgIHZhciByZXN1bHQgPSB1dGlsc18xLnRvQXJyYXkobm9kZS52YWx1ZSlbbWV0aG9kXShmdW5jdGlvbiAoX25vZGUpIHtcbiAgICAgICAgICAgIF90aGlzLnBvcyA9IGN1cnJlbnQ7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuZXhjbHVkaW5nXG4gICAgICAgICAgICAgICAgPyAhX3RoaXMubWF0Y2hBdG9tKHBhdGgsIF9ub2RlKVxuICAgICAgICAgICAgICAgIDogX3RoaXMubWF0Y2hBdG9tKHBhdGgsIF9ub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZXhjbHVkaW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaFJhbmdlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIChwYXRoLCBub2RlKSB7XG4gICAgICAgIGlmIChub2RlLnN0YXJ0KSB7XG4gICAgICAgICAgICBpZiAobm9kZS5lbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHBhdGhbdGhpcy5wb3NdID49IHBhcnNlSW50KG5vZGUuc3RhcnQudmFsdWUpICYmXG4gICAgICAgICAgICAgICAgICAgIHBhdGhbdGhpcy5wb3NdIDw9IHBhcnNlSW50KG5vZGUuZW5kLnZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aFt0aGlzLnBvc10gPj0gcGFyc2VJbnQobm9kZS5zdGFydC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAobm9kZS5lbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aFt0aGlzLnBvc10gPD0gcGFyc2VJbnQobm9kZS5lbmQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoRG90T3BlcmF0b3IgPSBmdW5jdGlvbiAocGF0aCwgbm9kZSkge1xuICAgICAgICB0aGlzLnBvcysrO1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaE5leHQobm9kZSwgcGF0aCk7XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaEF0b20gPSBmdW5jdGlvbiAocGF0aCwgbm9kZSkge1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBpZiAoaXNWYWxpZChwYXRoW3RoaXMucG9zICsgMV0pKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBvcyA9PSBwYXRoLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVzXzEuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaElkZW50aWZpZXIocGF0aCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZXNfMS5pc0lnbm9yZUV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoSWdub3JlRXhwcmVzc2lvbihwYXRoLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlc18xLmlzRGVzdHJ1Y3RvckV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoRGVzdHJ1Y3RvckV4cHJlc3Npb24ocGF0aCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZXNfMS5pc0V4cGFuZE9wZXJhdG9yKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEV4cGFuZE9wZXJhdG9yKHBhdGgsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVzXzEuaXNXaWxkY2FyZE9wZXJhdG9yKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaFdpbGRjYXJkT3BlcmF0b3IocGF0aCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZXNfMS5pc0dyb3VwRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hHcm91cEV4cHJlc3Npb24ocGF0aCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZXNfMS5pc1JhbmdlRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hSYW5nZUV4cHJlc3Npb24ocGF0aCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZXNfMS5pc0RvdE9wZXJhdG9yKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaERvdE9wZXJhdG9yKHBhdGgsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IHRoaXMubWF0Y2hBdG9tKHBhdGgsIHRoaXMudHJlZSk7XG4gICAgICAgIGlmICghdGhpcy50YWlsKVxuICAgICAgICAgICAgcmV0dXJuIHsgbWF0Y2hlZDogZmFsc2UgfTtcbiAgICAgICAgaWYgKHRoaXMudGFpbCA9PSB0aGlzLnRyZWUgJiYgdHlwZXNfMS5pc1dpbGRjYXJkT3BlcmF0b3IodGhpcy50YWlsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgbWF0Y2hlZDogdHJ1ZSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IG1hdGNoZWQ6IG1hdGNoZWQsIHJlY29yZDogdGhpcy5yZWNvcmQgfTtcbiAgICB9O1xuICAgIE1hdGNoZXIubWF0Y2hTZWdtZW50cyA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCwgcmVjb3JkKSB7XG4gICAgICAgIHZhciBwb3MgPSAwO1xuICAgICAgICBpZiAoc291cmNlLmxlbmd0aCAhPT0gdGFyZ2V0Lmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIG1hdGNoID0gZnVuY3Rpb24gKHBvcykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IHV0aWxzXzEuaXNFcXVhbChzb3VyY2VbcG9zXSwgdGFyZ2V0W3Bvc10pO1xuICAgICAgICAgICAgICAgIGlmIChyZWNvcmQgJiYgcmVjb3JkLnNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3JkLnNjb3JlKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAocG9zIDwgc291cmNlLmxlbmd0aCAtIDEgPyBtYXRjaChwb3MgKyAxKSA6IHRydWUpOyB9O1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQoKSAmJiBuZXh0KCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7IG1hdGNoZWQ6IG1hdGNoKHBvcyksIHJlY29yZDogcmVjb3JkIH07XG4gICAgfTtcbiAgICByZXR1cm4gTWF0Y2hlcjtcbn0oKSk7XG5leHBvcnRzLk1hdGNoZXIgPSBNYXRjaGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcbn1cbnZhciBfX3NwcmVhZEFycmF5cyA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheXMpIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxuICAgICAgICAgICAgcltrXSA9IGFbal07XG4gICAgcmV0dXJuIHI7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXRoID0gdm9pZCAwO1xudmFyIHBhcnNlcl8xID0gcmVxdWlyZShcIi4vcGFyc2VyXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBkZXN0cnVjdG9yXzEgPSByZXF1aXJlKFwiLi9kZXN0cnVjdG9yXCIpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3R5cGVzXCIpLCBleHBvcnRzKTtcbnZhciBscnVfMSA9IHJlcXVpcmUoXCIuL2xydVwiKTtcbnZhciBtYXRjaGVyXzEgPSByZXF1aXJlKFwiLi9tYXRjaGVyXCIpO1xudmFyIHBhdGhDYWNoZSA9IG5ldyBscnVfMS5MUlVNYXAoMTAwMCk7XG52YXIgaXNNYXRjaGVyID0gU3ltYm9sKCdQQVRIX01BVENIRVInKTtcbnZhciBpc1ZhbGlkID0gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsICE9PSB1bmRlZmluZWQgJiYgdmFsICE9PSBudWxsOyB9O1xudmFyIGFycmF5RXhpc3QgPSBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICAgIHZhciBpbmRleCA9IE51bWJlcihrZXkpO1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID4gb2JqLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcbnZhciBnZXRJbiA9IGZ1bmN0aW9uIChzZWdtZW50cywgc291cmNlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaW5kZXggPSBzZWdtZW50c1tpXTtcbiAgICAgICAgdmFyIHJ1bGVzID0gZGVzdHJ1Y3Rvcl8xLmdldERlc3RydWN0b3IoaW5kZXgpO1xuICAgICAgICBpZiAoIXJ1bGVzKSB7XG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQoc291cmNlKSkge1xuICAgICAgICAgICAgICAgIGlmIChpICE9PSBzZWdtZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFycmF5RXhpc3Qoc291cmNlLCBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc291cmNlID0gZGVzdHJ1Y3Rvcl8xLmdldEluQnlEZXN0cnVjdG9yKHNvdXJjZSwgcnVsZXMsIHsgc2V0SW46IHNldEluLCBnZXRJbjogZ2V0SW4gfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xufTtcbnZhciBzZXRJbiA9IGZ1bmN0aW9uIChzZWdtZW50cywgc291cmNlLCB2YWx1ZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGluZGV4ID0gc2VnbWVudHNbaV07XG4gICAgICAgIHZhciBydWxlcyA9IGRlc3RydWN0b3JfMS5nZXREZXN0cnVjdG9yKGluZGV4KTtcbiAgICAgICAgaWYgKCFydWxlcykge1xuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKHNvdXJjZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKHNvdXJjZVtpbmRleF0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKHNvdXJjZVtpbmRleF0pICYmICFpc1ZhbGlkKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh1dGlsc18xLmlzTnVtKHNlZ21lbnRzW2kgKyAxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlW2luZGV4XSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlW2luZGV4XSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpID09PSBzZWdtZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgc291cmNlW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFycmF5RXhpc3Qoc291cmNlLCBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVzdHJ1Y3Rvcl8xLnNldEluQnlEZXN0cnVjdG9yKHNvdXJjZSwgcnVsZXMsIHZhbHVlLCB7IHNldEluOiBzZXRJbiwgZ2V0SW46IGdldEluIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIGRlbGV0ZUluID0gZnVuY3Rpb24gKHNlZ21lbnRzLCBzb3VyY2UpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHNlZ21lbnRzW2ldO1xuICAgICAgICB2YXIgcnVsZXMgPSBkZXN0cnVjdG9yXzEuZ2V0RGVzdHJ1Y3RvcihpbmRleCk7XG4gICAgICAgIGlmICghcnVsZXMpIHtcbiAgICAgICAgICAgIGlmIChpID09PSBzZWdtZW50cy5sZW5ndGggLSAxICYmIGlzVmFsaWQoc291cmNlKSkge1xuICAgICAgICAgICAgICAgIGlmICh1dGlsc18xLmlzQXJyKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlLnNwbGljZShOdW1iZXIoaW5kZXgpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQoc291cmNlKSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZiAoYXJyYXlFeGlzdChzb3VyY2UsIGluZGV4KSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZVtpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXV0aWxzXzEuaXNPYmooc291cmNlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlc3RydWN0b3JfMS5kZWxldGVJbkJ5RGVzdHJ1Y3Rvcihzb3VyY2UsIHJ1bGVzLCB7XG4gICAgICAgICAgICAgICAgc2V0SW46IHNldEluLFxuICAgICAgICAgICAgICAgIGdldEluOiBnZXRJbixcbiAgICAgICAgICAgICAgICBkZWxldGVJbjogZGVsZXRlSW4sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBleGlzdEluID0gZnVuY3Rpb24gKHNlZ21lbnRzLCBzb3VyY2UsIHN0YXJ0KSB7XG4gICAgaWYgKHN0YXJ0IGluc3RhbmNlb2YgUGF0aCkge1xuICAgICAgICBzdGFydCA9IHN0YXJ0Lmxlbmd0aDtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGluZGV4ID0gc2VnbWVudHNbaV07XG4gICAgICAgIHZhciBydWxlcyA9IGRlc3RydWN0b3JfMS5nZXREZXN0cnVjdG9yKGluZGV4KTtcbiAgICAgICAgaWYgKCFydWxlcykge1xuICAgICAgICAgICAgaWYgKGkgPT09IHNlZ21lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoc291cmNlICYmIGluZGV4IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKHNvdXJjZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKGFycmF5RXhpc3Qoc291cmNlLCBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF1dGlsc18xLmlzT2JqKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGVzdHJ1Y3Rvcl8xLmV4aXN0SW5CeURlc3RydWN0b3Ioc291cmNlLCBydWxlcywgc3RhcnQsIHtcbiAgICAgICAgICAgICAgICBzZXRJbjogc2V0SW4sXG4gICAgICAgICAgICAgICAgZ2V0SW46IGdldEluLFxuICAgICAgICAgICAgICAgIGRlbGV0ZUluOiBkZWxldGVJbixcbiAgICAgICAgICAgICAgICBleGlzdEluOiBleGlzdEluLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xudmFyIFBhdGggPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBhdGgoaW5wdXQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jb25jYXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIGNvbmNhdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwYXRoID0gbmV3IFBhdGgoJycpO1xuICAgICAgICAgICAgcGF0aC5zZWdtZW50cyA9IChfYSA9IF90aGlzLnNlZ21lbnRzKS5jb25jYXQuYXBwbHkoX2EsIGFyZ3MubWFwKGZ1bmN0aW9uIChzKSB7IHJldHVybiBfdGhpcy5wYXJzZVN0cmluZyhzKTsgfSkpO1xuICAgICAgICAgICAgcGF0aC5lbnRpcmUgPSBwYXRoLnNlZ21lbnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgc2xpY2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcGF0aCA9IG5ldyBQYXRoKCcnKTtcbiAgICAgICAgICAgIHBhdGguc2VnbWVudHMgPSBfdGhpcy5zZWdtZW50cy5zbGljZShzdGFydCwgZW5kKTtcbiAgICAgICAgICAgIHBhdGguZW50aXJlID0gcGF0aC5zZWdtZW50cy5qb2luKCcuJyk7XG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wdXNoID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgcHVzaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnNlZ21lbnRzLnB1c2goX3RoaXMucGFyc2VTdHJpbmcoaXRlbSkpO1xuICAgICAgICAgICAgX3RoaXMuZW50aXJlID0gX3RoaXMuc2VnbWVudHMuam9pbignLicpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnBvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgcG9wXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuc2VnbWVudHMucG9wKCk7XG4gICAgICAgICAgICBfdGhpcy5lbnRpcmUgPSBfdGhpcy5zZWdtZW50cy5qb2luKCcuJyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc3BsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGl0ZW1zW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSBzcGxpY2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGVsZXRlQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICBpdGVtcyA9IGl0ZW1zLm1hcChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gX3RoaXMucGFyc2VTdHJpbmcoaXRlbSk7IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKF9hID0gX3RoaXMuc2VnbWVudHMpLnNwbGljZS5hcHBseShfYSwgX19zcHJlYWRBcnJheXMoW3N0YXJ0LCBkZWxldGVDb3VudF0sIGl0ZW1zKSk7XG4gICAgICAgICAgICBfdGhpcy5lbnRpcmUgPSBfdGhpcy5zZWdtZW50cy5qb2luKCcuJyk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZm9yRWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSBlYWNoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuc2VnbWVudHMuZm9yRWFjaChjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubWFwID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIG1hcFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5zZWdtZW50cy5tYXAoY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnJlZHVjZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgaW5pdGlhbCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSByZWR1Y2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2VnbWVudHMucmVkdWNlKGNhbGxiYWNrLCBpbml0aWFsKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXROZWFyZXN0Q2hpbGRQYXRoQnkgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICB2YXIgcGF0aCA9IFBhdGgucGFyc2UodGFyZ2V0KTtcbiAgICAgICAgICAgIGlmIChwYXRoLmxlbmd0aCA8IF90aGlzLmxlbmd0aClcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuY29uY2F0KHBhdGguc2VnbWVudHNbX3RoaXMubGVuZ3RoXSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucGFyZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnNsaWNlKDAsIF90aGlzLmxlbmd0aCAtIDEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmluY2x1ZGVzID0gZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICAgICAgICAgIHZhciBfYSA9IFBhdGguZ2V0UGF0aChwYXR0ZXJuKSwgZW50aXJlID0gX2EuZW50aXJlLCBzZWdtZW50cyA9IF9hLnNlZ21lbnRzLCBpc01hdGNoUGF0dGVybiA9IF9hLmlzTWF0Y2hQYXR0ZXJuO1xuICAgICAgICAgICAgdmFyIGNhY2hlID0gX3RoaXMuaW5jbHVkZXNDYWNoZS5nZXQoZW50aXJlKTtcbiAgICAgICAgICAgIGlmIChjYWNoZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZTtcbiAgICAgICAgICAgIHZhciBjYWNoZVdpdGggPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbmNsdWRlc0NhY2hlLnNldChlbnRpcmUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVXaXRoKF90aGlzLm1hdGNoKHNlZ21lbnRzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIHVzZWQgdG8gbWF0Y2ggXCIgKyBlbnRpcmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgdXNlZCB0byBtYXRjaCBcIiArIGVudGlyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID4gX3RoaXMuc2VnbWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZVdpdGgoZmFsc2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdXRpbHNfMS5pc0VxdWFsKFN0cmluZyhzZWdtZW50c1tpXSksIFN0cmluZyhfdGhpcy5zZWdtZW50c1tpXSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZVdpdGgoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjYWNoZVdpdGgodHJ1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gZnVuY3Rpb24gKHJlZ2V4cCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICghdXRpbHNfMS5pc0ZuKGNhbGxiYWNrKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIHRyYW5zZm9ybWVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBfdGhpcy5zZWdtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKGJ1Ziwga2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAocmVnZXhwKS50ZXN0KGtleSkgPyBidWYuY29uY2F0KGtleSkgOiBidWY7XG4gICAgICAgICAgICB9LCBbXSk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5tYXRjaCA9IGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgICAgICAgICB2YXIgcGF0aCA9IFBhdGguZ2V0UGF0aChwYXR0ZXJuKTtcbiAgICAgICAgICAgIHZhciBjYWNoZSA9IF90aGlzLm1hdGNoQ2FjaGUuZ2V0KHBhdGguZW50aXJlKTtcbiAgICAgICAgICAgIGlmIChjYWNoZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlLnJlY29yZCAmJiBjYWNoZS5yZWNvcmQuc2NvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tYXRjaFNjb3JlID0gY2FjaGUucmVjb3JkLnNjb3JlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGUubWF0Y2hlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjYWNoZVdpdGggPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tYXRjaENhY2hlLnNldChwYXRoLmVudGlyZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocGF0aC5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGF0aC5lbnRpcmUgKyBcIiBjYW5ub3QgbWF0Y2ggXCIgKyBfdGhpcy5lbnRpcmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubWF0Y2hTY29yZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZVdpdGgocGF0aC5tYXRjaChfdGhpcy5zZWdtZW50cykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVjb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBjYWNoZVdpdGgobmV3IG1hdGNoZXJfMS5NYXRjaGVyKF90aGlzLnRyZWUsIHJlY29yZCkubWF0Y2gocGF0aC5zZWdtZW50cykpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tYXRjaFNjb3JlID0gcmVjb3JkLnNjb3JlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0Lm1hdGNoZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVjb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBjYWNoZVdpdGgobWF0Y2hlcl8xLk1hdGNoZXIubWF0Y2hTZWdtZW50cyhfdGhpcy5zZWdtZW50cywgcGF0aC5zZWdtZW50cywgcmVjb3JkKSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1hdGNoU2NvcmUgPSByZWNvcmQuc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQubWF0Y2hlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubWF0Y2hBbGlhc0dyb3VwID0gZnVuY3Rpb24gKG5hbWUsIGFsaWFzKSB7XG4gICAgICAgICAgICB2YXIgbmFtZVBhdGggPSBQYXRoLnBhcnNlKG5hbWUpO1xuICAgICAgICAgICAgdmFyIGFsaWFzUGF0aCA9IFBhdGgucGFyc2UoYWxpYXMpO1xuICAgICAgICAgICAgdmFyIG5hbWVNYXRjaGVkID0gX3RoaXMubWF0Y2gobmFtZVBhdGgpO1xuICAgICAgICAgICAgdmFyIG5hbWVNYXRjaGVkU2NvcmUgPSBfdGhpcy5tYXRjaFNjb3JlO1xuICAgICAgICAgICAgdmFyIGFsaWFzTWF0Y2hlZCA9IF90aGlzLm1hdGNoKGFsaWFzUGF0aCk7XG4gICAgICAgICAgICB2YXIgYWxpYXNNYXRjaGVkU2NvcmUgPSBfdGhpcy5tYXRjaFNjb3JlO1xuICAgICAgICAgICAgaWYgKF90aGlzLmhhdmVFeGNsdWRlUGF0dGVybikge1xuICAgICAgICAgICAgICAgIGlmIChuYW1lTWF0Y2hlZFNjb3JlID49IGFsaWFzTWF0Y2hlZFNjb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lTWF0Y2hlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGlhc01hdGNoZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hbWVNYXRjaGVkIHx8IGFsaWFzTWF0Y2hlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5leGlzdEluID0gZnVuY3Rpb24gKHNvdXJjZSwgc3RhcnQpIHtcbiAgICAgICAgICAgIGlmIChzdGFydCA9PT0gdm9pZCAwKSB7IHN0YXJ0ID0gMDsgfVxuICAgICAgICAgICAgcmV0dXJuIGV4aXN0SW4oX3RoaXMuc2VnbWVudHMsIHNvdXJjZSwgc3RhcnQpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldEluID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldEluKF90aGlzLnNlZ21lbnRzLCBzb3VyY2UpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldEluID0gZnVuY3Rpb24gKHNvdXJjZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHNldEluKF90aGlzLnNlZ21lbnRzLCBzb3VyY2UsIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZGVsZXRlSW4gPSBmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICAgICAgICBkZWxldGVJbihfdGhpcy5zZWdtZW50cywgc291cmNlKTtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBfYSA9IHRoaXMucGFyc2UoaW5wdXQpLCB0cmVlID0gX2EudHJlZSwgc2VnbWVudHMgPSBfYS5zZWdtZW50cywgZW50aXJlID0gX2EuZW50aXJlLCBpc01hdGNoUGF0dGVybiA9IF9hLmlzTWF0Y2hQYXR0ZXJuLCBpc1dpbGRNYXRjaFBhdHRlcm4gPSBfYS5pc1dpbGRNYXRjaFBhdHRlcm4sIGhhdmVFeGNsdWRlUGF0dGVybiA9IF9hLmhhdmVFeGNsdWRlUGF0dGVybjtcbiAgICAgICAgdGhpcy5lbnRpcmUgPSBlbnRpcmU7XG4gICAgICAgIHRoaXMuc2VnbWVudHMgPSBzZWdtZW50cztcbiAgICAgICAgdGhpcy5pc01hdGNoUGF0dGVybiA9IGlzTWF0Y2hQYXR0ZXJuO1xuICAgICAgICB0aGlzLmlzV2lsZE1hdGNoUGF0dGVybiA9IGlzV2lsZE1hdGNoUGF0dGVybjtcbiAgICAgICAgdGhpcy5oYXZlRXhjbHVkZVBhdHRlcm4gPSBoYXZlRXhjbHVkZVBhdHRlcm47XG4gICAgICAgIHRoaXMudHJlZSA9IHRyZWU7XG4gICAgICAgIHRoaXMubWF0Y2hDYWNoZSA9IG5ldyBscnVfMS5MUlVNYXAoMjAwKTtcbiAgICAgICAgdGhpcy5pbmNsdWRlc0NhY2hlID0gbmV3IGxydV8xLkxSVU1hcCgyMDApO1xuICAgIH1cbiAgICBQYXRoLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXJlO1xuICAgIH07XG4gICAgUGF0aC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VnbWVudHM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGF0aC5wcm90b3R5cGUsIFwibGVuZ3RoXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWdtZW50cy5sZW5ndGg7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBQYXRoLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChwYXR0ZXJuIGluc3RhbmNlb2YgUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlbnRpcmU6IHBhdHRlcm4uZW50aXJlLFxuICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBwYXR0ZXJuLnNlZ21lbnRzLnNsaWNlKCksXG4gICAgICAgICAgICAgICAgaXNXaWxkTWF0Y2hQYXR0ZXJuOiBwYXR0ZXJuLmlzV2lsZE1hdGNoUGF0dGVybixcbiAgICAgICAgICAgICAgICBpc01hdGNoUGF0dGVybjogcGF0dGVybi5pc01hdGNoUGF0dGVybixcbiAgICAgICAgICAgICAgICBoYXZlRXhjbHVkZVBhdHRlcm46IHBhdHRlcm4uaGF2ZUV4Y2x1ZGVQYXR0ZXJuLFxuICAgICAgICAgICAgICAgIHRyZWU6IHBhdHRlcm4udHJlZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbHNfMS5pc1N0cihwYXR0ZXJuKSkge1xuICAgICAgICAgICAgaWYgKCFwYXR0ZXJuKVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGVudGlyZTogJycsXG4gICAgICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgaXNXaWxkTWF0Y2hQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaGF2ZUV4Y2x1ZGVQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaXNNYXRjaFBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IHBhcnNlcl8xLlBhcnNlcihwYXR0ZXJuKTtcbiAgICAgICAgICAgIHZhciB0cmVlID0gcGFyc2VyLnBhcnNlKCk7XG4gICAgICAgICAgICBpZiAoIXBhcnNlci5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHZhciBzZWdtZW50cyA9IHBhcnNlci5kYXRhLnNlZ21lbnRzO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGVudGlyZTogc2VnbWVudHMuam9pbignLicpLFxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogc2VnbWVudHMsXG4gICAgICAgICAgICAgICAgICAgIHRyZWU6IHRyZWUsXG4gICAgICAgICAgICAgICAgICAgIGlzV2lsZE1hdGNoUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhdmVFeGNsdWRlUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGlzTWF0Y2hQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXJlOiBwYXR0ZXJuLFxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW10sXG4gICAgICAgICAgICAgICAgICAgIGlzV2lsZE1hdGNoUGF0dGVybjogcGFyc2VyLmlzV2lsZE1hdGNoUGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgaGF2ZUV4Y2x1ZGVQYXR0ZXJuOiBwYXJzZXIuaGF2ZUV4Y2x1ZGVQYXR0ZXJuLFxuICAgICAgICAgICAgICAgICAgICBpc01hdGNoUGF0dGVybjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHJlZTogdHJlZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHV0aWxzXzEuaXNGbihwYXR0ZXJuKSAmJiBwYXR0ZXJuW2lzTWF0Y2hlcl0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlKHBhdHRlcm5bJ3BhdGgnXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXRpbHNfMS5pc0FycihwYXR0ZXJuKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlbnRpcmU6IHBhdHRlcm4uam9pbignLicpLFxuICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBwYXR0ZXJuLnJlZHVjZShmdW5jdGlvbiAoYnVmLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1Zi5jb25jYXQoX3RoaXMucGFyc2VTdHJpbmcoa2V5KSk7XG4gICAgICAgICAgICAgICAgfSwgW10pLFxuICAgICAgICAgICAgICAgIGlzV2lsZE1hdGNoUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgaGF2ZUV4Y2x1ZGVQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpc01hdGNoUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlbnRpcmU6ICcnLFxuICAgICAgICAgICAgICAgIHNlZ21lbnRzOiBwYXR0ZXJuICE9PSB1bmRlZmluZWQgPyBbcGF0dGVybl0gOiBbXSxcbiAgICAgICAgICAgICAgICBpc1dpbGRNYXRjaFBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgIGhhdmVFeGNsdWRlUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNNYXRjaFBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGF0aC5wcm90b3R5cGUucGFyc2VTdHJpbmcgPSBmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICAgIGlmICh1dGlsc18xLmlzU3RyKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKC9cXHMqL2csICcnKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hID0gdGhpcy5wYXJzZShzb3VyY2UpLCBzZWdtZW50cyA9IF9hLnNlZ21lbnRzLCBpc01hdGNoUGF0dGVybiA9IF9hLmlzTWF0Y2hQYXR0ZXJuO1xuICAgICAgICAgICAgICAgIHJldHVybiAhaXNNYXRjaFBhdHRlcm4gPyBzZWdtZW50cyA6IHNvdXJjZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlLnNlZ21lbnRzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfTtcbiAgICBQYXRoLm1hdGNoID0gZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICAgICAgdmFyIHBhdGggPSBQYXRoLmdldFBhdGgocGF0dGVybik7XG4gICAgICAgIHZhciBtYXRjaGVyID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGgubWF0Y2godGFyZ2V0KTtcbiAgICAgICAgfTtcbiAgICAgICAgbWF0Y2hlcltpc01hdGNoZXJdID0gdHJ1ZTtcbiAgICAgICAgbWF0Y2hlci5wYXRoID0gcGF0aDtcbiAgICAgICAgcmV0dXJuIG1hdGNoZXI7XG4gICAgfTtcbiAgICBQYXRoLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChwYXR0ZXJuLCByZWdleHAsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBQYXRoLmdldFBhdGgocGF0dGVybikudHJhbnNmb3JtKHJlZ2V4cCwgY2FsbGJhY2spO1xuICAgIH07XG4gICAgUGF0aC5wYXJzZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgICAgIGlmIChwYXRoID09PSB2b2lkIDApIHsgcGF0aCA9ICcnOyB9XG4gICAgICAgIHJldHVybiBQYXRoLmdldFBhdGgocGF0aCk7XG4gICAgfTtcbiAgICBQYXRoLmdldFBhdGggPSBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICBpZiAocGF0aCA9PT0gdm9pZCAwKSB7IHBhdGggPSAnJzsgfVxuICAgICAgICBpZiAocGF0aCBpbnN0YW5jZW9mIFBhdGgpIHtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IHBhdGhDYWNoZS5nZXQocGF0aC5lbnRpcmUpO1xuICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF0aENhY2hlLnNldChwYXRoLmVudGlyZSwgcGF0aCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGF0aCAmJiBwYXRoW2lzTWF0Y2hlcl0pIHtcbiAgICAgICAgICAgIHJldHVybiBQYXRoLmdldFBhdGgocGF0aFsncGF0aCddKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBwYXRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgZm91bmQgPSBwYXRoQ2FjaGUuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXRoID0gbmV3IFBhdGgocGF0aCk7XG4gICAgICAgICAgICAgICAgcGF0aENhY2hlLnNldChrZXksIHBhdGgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXRoLmdldEluID0gZnVuY3Rpb24gKHNvdXJjZSwgcGF0dGVybikge1xuICAgICAgICB2YXIgcGF0aCA9IFBhdGguZ2V0UGF0aChwYXR0ZXJuKTtcbiAgICAgICAgcmV0dXJuIHBhdGguZ2V0SW4oc291cmNlKTtcbiAgICB9O1xuICAgIFBhdGguc2V0SW4gPSBmdW5jdGlvbiAoc291cmNlLCBwYXR0ZXJuLCB2YWx1ZSkge1xuICAgICAgICB2YXIgcGF0aCA9IFBhdGguZ2V0UGF0aChwYXR0ZXJuKTtcbiAgICAgICAgcmV0dXJuIHBhdGguc2V0SW4oc291cmNlLCB2YWx1ZSk7XG4gICAgfTtcbiAgICBQYXRoLmRlbGV0ZUluID0gZnVuY3Rpb24gKHNvdXJjZSwgcGF0dGVybikge1xuICAgICAgICB2YXIgcGF0aCA9IFBhdGguZ2V0UGF0aChwYXR0ZXJuKTtcbiAgICAgICAgcmV0dXJuIHBhdGguZGVsZXRlSW4oc291cmNlKTtcbiAgICB9O1xuICAgIFBhdGguZXhpc3RJbiA9IGZ1bmN0aW9uIChzb3VyY2UsIHBhdHRlcm4sIHN0YXJ0KSB7XG4gICAgICAgIHZhciBwYXRoID0gUGF0aC5nZXRQYXRoKHBhdHRlcm4pO1xuICAgICAgICByZXR1cm4gcGF0aC5leGlzdEluKHNvdXJjZSwgc3RhcnQpO1xuICAgIH07XG4gICAgcmV0dXJuIFBhdGg7XG59KCkpO1xuZXhwb3J0cy5QYXRoID0gUGF0aDtcbmV4cG9ydHMuZGVmYXVsdCA9IFBhdGg7XG4iLCJpbXBvcnQgeyBpc0ZuLCBpc1N0ciB9IGZyb20gJy4vdHlwZXMnXG5cbmNvbnN0IGNhY2hlcyA9IHt9XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXByZWNhdGU8UDEgPSBhbnksIFAyID0gYW55LCBQMyA9IGFueSwgUDQgPSBhbnksIFA1ID0gYW55PihcbiAgbWV0aG9kOiBhbnksXG4gIG1lc3NhZ2U/OiBzdHJpbmcsXG4gIGhlbHA/OiBzdHJpbmdcbikge1xuICBpZiAoaXNGbihtZXRob2QpKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICAgIHJldHVybiBmdW5jdGlvbihwMT86IFAxLCBwMj86IFAyLCBwMz86IFAzLCBwND86IFA0LCBwNT86IFA1KSB7XG4gICAgICBkZXByZWNhdGUobWVzc2FnZSwgaGVscClcbiAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIH1cbiAgfVxuICBpZiAoaXNTdHIobWV0aG9kKSAmJiAhY2FjaGVzW21ldGhvZF0pIHtcbiAgICBjYWNoZXNbbWV0aG9kXSA9IHRydWVcbiAgICBjb25zb2xlLndhcm4oXG4gICAgICBuZXcgRXJyb3IoXG4gICAgICAgIGAke21ldGhvZH0gaGFzIGJlZW4gZGVwcmVjYXRlZC4gRG8gbm90IGNvbnRpbnVlIHRvIHVzZSB0aGlzIGFwaS4ke21lc3NhZ2UgfHxcbiAgICAgICAgICAnJ31gXG4gICAgICApXG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBpc0ZuLCBTdWJzY3JpYmVyLCBTdWJzY3JpcHRpb24gfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgZWFjaCB9IGZyb20gJy4vYXJyYXknXG5cbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmFibGU8UGF5bG9hZCA9IGFueT4ge1xuICBzdWJzY3JpYmVyczoge1xuICAgIGluZGV4PzogbnVtYmVyXG4gICAgW2tleTogbnVtYmVyXTogU3Vic2NyaWJlcjxQYXlsb2FkPlxuICB9ID0ge1xuICAgIGluZGV4OiAwXG4gIH1cblxuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjxQYXlsb2FkPlxuXG4gIHN1YnNjcmliZSA9IChjYWxsYmFjaz86IFN1YnNjcmliZXI8UGF5bG9hZD4pOiBudW1iZXIgPT4ge1xuICAgIGlmIChpc0ZuKGNhbGxiYWNrKSkge1xuICAgICAgY29uc3QgaW5kZXg6IG51bWJlciA9IHRoaXMuc3Vic2NyaWJlcnMuaW5kZXggKyAxXG4gICAgICB0aGlzLnN1YnNjcmliZXJzW2luZGV4XSA9IGNhbGxiYWNrXG4gICAgICB0aGlzLnN1YnNjcmliZXJzLmluZGV4KytcbiAgICAgIHJldHVybiBpbmRleFxuICAgIH1cbiAgfVxuXG4gIHVuc3Vic2NyaWJlID0gKGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBpZiAodGhpcy5zdWJzY3JpYmVyc1tpbmRleF0pIHtcbiAgICAgIGRlbGV0ZSB0aGlzLnN1YnNjcmliZXJzW2luZGV4XVxuICAgIH1cbiAgfVxuXG4gIG5vdGlmeSA9IChwYXlsb2FkPzogUGF5bG9hZCwgc2lsZW50PzogYm9vbGVhbikgPT4ge1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uICYmIGlzRm4odGhpcy5zdWJzY3JpcHRpb24ubm90aWZ5KSkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24ubm90aWZ5LmNhbGwodGhpcywgcGF5bG9hZCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNpbGVudCkgcmV0dXJuXG4gICAgY29uc3QgZmlsdGVyID0gKHBheWxvYWQ6IFBheWxvYWQpID0+IHtcbiAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbiAmJiBpc0ZuKHRoaXMuc3Vic2NyaXB0aW9uLmZpbHRlcikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0aW9uLmZpbHRlci5jYWxsKHRoaXMsIHBheWxvYWQpXG4gICAgICB9XG4gICAgICByZXR1cm4gcGF5bG9hZFxuICAgIH1cbiAgICBlYWNoKHRoaXMuc3Vic2NyaWJlcnMsIChjYWxsYmFjazogYW55KSA9PiB7XG4gICAgICBpZiAoaXNGbihjYWxsYmFjaykpIGNhbGxiYWNrKGZpbHRlcihwYXlsb2FkKSlcbiAgICB9KVxuICB9XG59XG4iLCJpbXBvcnQgeyBCaWdEYXRhIH0gZnJvbSAnLi9iaWctZGF0YSdcbmltcG9ydCB7IGlzVmFsaWQgfSBmcm9tICcuL2lzRW1wdHknXG5cbmZ1bmN0aW9uIGRlZmF1bHRJc01lcmdlYWJsZU9iamVjdCh2YWx1ZTogYW55KSB7XG4gIHJldHVybiBpc05vbk51bGxPYmplY3QodmFsdWUpICYmICFpc1NwZWNpYWwodmFsdWUpXG59XG5cbmZ1bmN0aW9uIGlzTm9uTnVsbE9iamVjdCh2YWx1ZTogYW55KSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gaXNTcGVjaWFsKHZhbHVlOiBhbnkpIHtcbiAgY29uc3Qgc3RyaW5nVmFsdWUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpXG5cbiAgcmV0dXJuIChcbiAgICBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgUmVnRXhwXScgfHxcbiAgICBzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgRGF0ZV0nIHx8XG4gICAgaXNSZWFjdEVsZW1lbnQodmFsdWUpXG4gIClcbn1cblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I1YWM5NjNmYjc5MWQxMjk4ZTdmMzk2MjM2MzgzYmM5NTVmOTE2YzEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjEtTDI1XG5jb25zdCBjYW5Vc2VTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3JcbmNvbnN0IFJFQUNUX0VMRU1FTlRfVFlQRSA9IGNhblVzZVN5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjN1xuXG5mdW5jdGlvbiBpc1JlYWN0RWxlbWVudCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRVxufVxuXG5mdW5jdGlvbiBlbXB0eVRhcmdldCh2YWw6IGFueSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWwpID8gW10gOiB7fVxufVxuXG5mdW5jdGlvbiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh2YWx1ZTogYW55LCBvcHRpb25zOiBPcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmNsb25lICE9PSBmYWxzZSAmJiBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHZhbHVlKSkge1xuICAgIGlmIChCaWdEYXRhLmlzQmlnRGF0YSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBCaWdEYXRhLmNsb25lKHZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVlcG1lcmdlKGVtcHR5VGFyZ2V0KHZhbHVlKSwgdmFsdWUsIG9wdGlvbnMpXG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0QXJyYXlNZXJnZSh0YXJnZXQ6IGFueSwgc291cmNlOiBhbnksIG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgcmV0dXJuIHRhcmdldC5jb25jYXQoc291cmNlKS5tYXAoZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChlbGVtZW50LCBvcHRpb25zKVxuICB9KVxufVxuXG5mdW5jdGlvbiBnZXRNZXJnZUZ1bmN0aW9uKGtleTogc3RyaW5nLCBvcHRpb25zOiBPcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucy5jdXN0b21NZXJnZSkge1xuICAgIHJldHVybiBkZWVwbWVyZ2VcbiAgfVxuICBjb25zdCBjdXN0b21NZXJnZSA9IG9wdGlvbnMuY3VzdG9tTWVyZ2Uoa2V5KVxuICByZXR1cm4gdHlwZW9mIGN1c3RvbU1lcmdlID09PSAnZnVuY3Rpb24nID8gY3VzdG9tTWVyZ2UgOiBkZWVwbWVyZ2Vcbn1cblxuZnVuY3Rpb24gZ2V0RW51bWVyYWJsZU93blByb3BlcnR5U3ltYm9scyh0YXJnZXQ6IGFueSk6IGFueSB7XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG4gICAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkuZmlsdGVyKGZ1bmN0aW9uKHN5bWJvbCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0LnByb3BlcnR5SXNFbnVtZXJhYmxlKHN5bWJvbClcbiAgICAgIH0pXG4gICAgOiBbXVxufVxuXG5mdW5jdGlvbiBnZXRLZXlzKHRhcmdldDogYW55KSB7XG4gIGlmICghaXNWYWxpZCh0YXJnZXQpKSByZXR1cm4gW11cbiAgcmV0dXJuIE9iamVjdC5rZXlzKHRhcmdldCkuY29uY2F0KGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSlcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlJc09uT2JqZWN0KG9iamVjdDogYW55LCBwcm9wZXJ0eTogYW55KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHByb3BlcnR5IGluIG9iamVjdFxuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuLy8gUHJvdGVjdHMgZnJvbSBwcm90b3R5cGUgcG9pc29uaW5nIGFuZCB1bmV4cGVjdGVkIG1lcmdpbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbi5cbmZ1bmN0aW9uIHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpIHtcbiAgcmV0dXJuIChcbiAgICBwcm9wZXJ0eUlzT25PYmplY3QodGFyZ2V0LCBrZXkpICYmIC8vIFByb3BlcnRpZXMgYXJlIHNhZmUgdG8gbWVyZ2UgaWYgdGhleSBkb24ndCBleGlzdCBpbiB0aGUgdGFyZ2V0IHlldCxcbiAgICAhKFxuICAgICAgT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpICYmIC8vIHVuc2FmZSBpZiB0aGV5IGV4aXN0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sXG4gICAgICBPYmplY3QucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh0YXJnZXQsIGtleSlcbiAgICApXG4gICkgLy8gYW5kIGFsc28gdW5zYWZlIGlmIHRoZXkncmUgbm9uZW51bWVyYWJsZS5cbn1cblxuZnVuY3Rpb24gbWVyZ2VPYmplY3QodGFyZ2V0OiBhbnksIHNvdXJjZTogYW55LCBvcHRpb25zOiBPcHRpb25zKSB7XG4gIGNvbnN0IGRlc3RpbmF0aW9uID0gb3B0aW9ucy5hc3NpZ24gPyB0YXJnZXQgfHwge30gOiB7fVxuICBpZiAoIW9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodGFyZ2V0KSkgcmV0dXJuIHRhcmdldFxuICBpZiAoIW9wdGlvbnMuYXNzaWduKSB7XG4gICAgZ2V0S2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQodGFyZ2V0W2tleV0sIG9wdGlvbnMpXG4gICAgfSlcbiAgfVxuICBnZXRLZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAocHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIXRhcmdldFtrZXldKSB7XG4gICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV1cbiAgICB9XG4gICAgaWYgKFxuICAgICAgcHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAmJlxuICAgICAgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdChzb3VyY2Vba2V5XSlcbiAgICApIHtcbiAgICAgIGRlc3RpbmF0aW9uW2tleV0gPSBnZXRNZXJnZUZ1bmN0aW9uKGtleSwgb3B0aW9ucykoXG4gICAgICAgIHRhcmdldFtrZXldLFxuICAgICAgICBzb3VyY2Vba2V5XSxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICBkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlW2tleV0sIG9wdGlvbnMpXG4gICAgfVxuICB9KVxuICByZXR1cm4gZGVzdGluYXRpb25cbn1cblxuaW50ZXJmYWNlIE9wdGlvbnMge1xuICBhcnJheU1lcmdlPyh0YXJnZXQ6IGFueVtdLCBzb3VyY2U6IGFueVtdLCBvcHRpb25zPzogT3B0aW9ucyk6IGFueVtdXG4gIGNsb25lPzogYm9vbGVhblxuICBhc3NpZ24/OiBib29sZWFuXG4gIGN1c3RvbU1lcmdlPzogKFxuICAgIGtleTogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBPcHRpb25zXG4gICkgPT4gKCh4OiBhbnksIHk6IGFueSkgPT4gYW55KSB8IHVuZGVmaW5lZFxuICBpc01lcmdlYWJsZU9iamVjdD8odmFsdWU6IG9iamVjdCk6IGJvb2xlYW5cbn1cblxuZnVuY3Rpb24gZGVlcG1lcmdlPFQ+KHg6IFBhcnRpYWw8VD4sIHk6IFBhcnRpYWw8VD4sIG9wdGlvbnM/OiBPcHRpb25zKTogVFxuZnVuY3Rpb24gZGVlcG1lcmdlPFQxLCBUMj4oXG4gIHg6IFBhcnRpYWw8VDE+LFxuICB5OiBQYXJ0aWFsPFQyPixcbiAgb3B0aW9ucz86IE9wdGlvbnNcbik6IFQxICYgVDJcbmZ1bmN0aW9uIGRlZXBtZXJnZSh0YXJnZXQ6IGFueSwgc291cmNlOiBhbnksIG9wdGlvbnM6IGFueSkge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICBvcHRpb25zLmFycmF5TWVyZ2UgPSBvcHRpb25zLmFycmF5TWVyZ2UgfHwgZGVmYXVsdEFycmF5TWVyZ2VcbiAgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCA9XG4gICAgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCB8fCBkZWZhdWx0SXNNZXJnZWFibGVPYmplY3RcbiAgLy8gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQgaXMgYWRkZWQgdG8gYG9wdGlvbnNgIHNvIHRoYXQgY3VzdG9tIGFycmF5TWVyZ2UoKVxuICAvLyBpbXBsZW1lbnRhdGlvbnMgY2FuIHVzZSBpdC4gVGhlIGNhbGxlciBtYXkgbm90IHJlcGxhY2UgaXQuXG4gIG9wdGlvbnMuY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQgPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZFxuXG4gIGNvbnN0IHNvdXJjZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KHNvdXJjZSlcbiAgY29uc3QgdGFyZ2V0SXNBcnJheSA9IEFycmF5LmlzQXJyYXkodGFyZ2V0KVxuICBjb25zdCBzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoID0gc291cmNlSXNBcnJheSA9PT0gdGFyZ2V0SXNBcnJheVxuXG4gIGlmICghc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCkge1xuICAgIHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2UsIG9wdGlvbnMpXG4gIH0gZWxzZSBpZiAoc291cmNlSXNBcnJheSkge1xuICAgIHJldHVybiBvcHRpb25zLmFycmF5TWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuICB9XG59XG5mdW5jdGlvbiBkZWVwbWVyZ2VBbGwob2JqZWN0czogb2JqZWN0W10sIG9wdGlvbnM/OiBPcHRpb25zKTogb2JqZWN0XG5mdW5jdGlvbiBkZWVwbWVyZ2VBbGw8VD4ob2JqZWN0czogUGFydGlhbDxUPltdLCBvcHRpb25zPzogT3B0aW9ucyk6IFRcbmZ1bmN0aW9uIGRlZXBtZXJnZUFsbChhcnJheTogYW55LCBvcHRpb25zOiBhbnkpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuICAgIHRocm93IG5ldyBFcnJvcignZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIGFuIGFycmF5JylcbiAgfVxuXG4gIHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbmV4dCkge1xuICAgIHJldHVybiBkZWVwbWVyZ2UocHJldiwgbmV4dCwgb3B0aW9ucylcbiAgfSwge30pXG59XG5cbmRlZXBtZXJnZS5hbGwgPSBkZWVwbWVyZ2VBbGxcblxuZXhwb3J0IGNvbnN0IG1lcmdlID0gZGVlcG1lcmdlXG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjAuMTkuMVxuICogc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO3ZhciBmLGcsaCxrLGw7XG5pZihcInVuZGVmaW5lZFwiPT09dHlwZW9mIHdpbmRvd3x8XCJmdW5jdGlvblwiIT09dHlwZW9mIE1lc3NhZ2VDaGFubmVsKXt2YXIgcD1udWxsLHE9bnVsbCx0PWZ1bmN0aW9uKCl7aWYobnVsbCE9PXApdHJ5e3ZhciBhPWV4cG9ydHMudW5zdGFibGVfbm93KCk7cCghMCxhKTtwPW51bGx9Y2F0Y2goYil7dGhyb3cgc2V0VGltZW91dCh0LDApLGI7fX0sdT1EYXRlLm5vdygpO2V4cG9ydHMudW5zdGFibGVfbm93PWZ1bmN0aW9uKCl7cmV0dXJuIERhdGUubm93KCktdX07Zj1mdW5jdGlvbihhKXtudWxsIT09cD9zZXRUaW1lb3V0KGYsMCxhKToocD1hLHNldFRpbWVvdXQodCwwKSl9O2c9ZnVuY3Rpb24oYSxiKXtxPXNldFRpbWVvdXQoYSxiKX07aD1mdW5jdGlvbigpe2NsZWFyVGltZW91dChxKX07az1mdW5jdGlvbigpe3JldHVybiExfTtsPWV4cG9ydHMudW5zdGFibGVfZm9yY2VGcmFtZVJhdGU9ZnVuY3Rpb24oKXt9fWVsc2V7dmFyIHc9d2luZG93LnBlcmZvcm1hbmNlLHg9d2luZG93LkRhdGUsXG55PXdpbmRvdy5zZXRUaW1lb3V0LHo9d2luZG93LmNsZWFyVGltZW91dDtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUpe3ZhciBBPXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZTtcImZ1bmN0aW9uXCIhPT10eXBlb2Ygd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSYmY29uc29sZS5lcnJvcihcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLiBNYWtlIHN1cmUgdGhhdCB5b3UgbG9hZCBhIHBvbHlmaWxsIGluIG9sZGVyIGJyb3dzZXJzLiBodHRwczovL2ZiLm1lL3JlYWN0LXBvbHlmaWxsc1wiKTtcImZ1bmN0aW9uXCIhPT10eXBlb2YgQSYmY29uc29sZS5lcnJvcihcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgY2FuY2VsQW5pbWF0aW9uRnJhbWUuIE1ha2Ugc3VyZSB0aGF0IHlvdSBsb2FkIGEgcG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vZmIubWUvcmVhY3QtcG9seWZpbGxzXCIpfWlmKFwib2JqZWN0XCI9PT1cbnR5cGVvZiB3JiZcImZ1bmN0aW9uXCI9PT10eXBlb2Ygdy5ub3cpZXhwb3J0cy51bnN0YWJsZV9ub3c9ZnVuY3Rpb24oKXtyZXR1cm4gdy5ub3coKX07ZWxzZXt2YXIgQj14Lm5vdygpO2V4cG9ydHMudW5zdGFibGVfbm93PWZ1bmN0aW9uKCl7cmV0dXJuIHgubm93KCktQn19dmFyIEM9ITEsRD1udWxsLEU9LTEsRj01LEc9MDtrPWZ1bmN0aW9uKCl7cmV0dXJuIGV4cG9ydHMudW5zdGFibGVfbm93KCk+PUd9O2w9ZnVuY3Rpb24oKXt9O2V4cG9ydHMudW5zdGFibGVfZm9yY2VGcmFtZVJhdGU9ZnVuY3Rpb24oYSl7MD5hfHwxMjU8YT9jb25zb2xlLmVycm9yKFwiZm9yY2VGcmFtZVJhdGUgdGFrZXMgYSBwb3NpdGl2ZSBpbnQgYmV0d2VlbiAwIGFuZCAxMjUsIGZvcmNpbmcgZnJhbWVyYXRlcyBoaWdoZXIgdGhhbiAxMjUgZnBzIGlzIG5vdCB1bnN1cHBvcnRlZFwiKTpGPTA8YT9NYXRoLmZsb29yKDFFMy9hKTo1fTt2YXIgSD1uZXcgTWVzc2FnZUNoYW5uZWwsST1ILnBvcnQyO0gucG9ydDEub25tZXNzYWdlPVxuZnVuY3Rpb24oKXtpZihudWxsIT09RCl7dmFyIGE9ZXhwb3J0cy51bnN0YWJsZV9ub3coKTtHPWErRjt0cnl7RCghMCxhKT9JLnBvc3RNZXNzYWdlKG51bGwpOihDPSExLEQ9bnVsbCl9Y2F0Y2goYil7dGhyb3cgSS5wb3N0TWVzc2FnZShudWxsKSxiO319ZWxzZSBDPSExfTtmPWZ1bmN0aW9uKGEpe0Q9YTtDfHwoQz0hMCxJLnBvc3RNZXNzYWdlKG51bGwpKX07Zz1mdW5jdGlvbihhLGIpe0U9eShmdW5jdGlvbigpe2EoZXhwb3J0cy51bnN0YWJsZV9ub3coKSl9LGIpfTtoPWZ1bmN0aW9uKCl7eihFKTtFPS0xfX1mdW5jdGlvbiBKKGEsYil7dmFyIGM9YS5sZW5ndGg7YS5wdXNoKGIpO2E6Zm9yKDs7KXt2YXIgZD1jLTE+Pj4xLGU9YVtkXTtpZih2b2lkIDAhPT1lJiYwPEsoZSxiKSlhW2RdPWIsYVtjXT1lLGM9ZDtlbHNlIGJyZWFrIGF9fWZ1bmN0aW9uIEwoYSl7YT1hWzBdO3JldHVybiB2b2lkIDA9PT1hP251bGw6YX1cbmZ1bmN0aW9uIE0oYSl7dmFyIGI9YVswXTtpZih2b2lkIDAhPT1iKXt2YXIgYz1hLnBvcCgpO2lmKGMhPT1iKXthWzBdPWM7YTpmb3IodmFyIGQ9MCxlPWEubGVuZ3RoO2Q8ZTspe3ZhciBtPTIqKGQrMSktMSxuPWFbbV0sdj1tKzEscj1hW3ZdO2lmKHZvaWQgMCE9PW4mJjA+SyhuLGMpKXZvaWQgMCE9PXImJjA+SyhyLG4pPyhhW2RdPXIsYVt2XT1jLGQ9dik6KGFbZF09bixhW21dPWMsZD1tKTtlbHNlIGlmKHZvaWQgMCE9PXImJjA+SyhyLGMpKWFbZF09cixhW3ZdPWMsZD12O2Vsc2UgYnJlYWsgYX19cmV0dXJuIGJ9cmV0dXJuIG51bGx9ZnVuY3Rpb24gSyhhLGIpe3ZhciBjPWEuc29ydEluZGV4LWIuc29ydEluZGV4O3JldHVybiAwIT09Yz9jOmEuaWQtYi5pZH12YXIgTj1bXSxPPVtdLFA9MSxRPW51bGwsUj0zLFM9ITEsVD0hMSxVPSExO1xuZnVuY3Rpb24gVihhKXtmb3IodmFyIGI9TChPKTtudWxsIT09Yjspe2lmKG51bGw9PT1iLmNhbGxiYWNrKU0oTyk7ZWxzZSBpZihiLnN0YXJ0VGltZTw9YSlNKE8pLGIuc29ydEluZGV4PWIuZXhwaXJhdGlvblRpbWUsSihOLGIpO2Vsc2UgYnJlYWs7Yj1MKE8pfX1mdW5jdGlvbiBXKGEpe1U9ITE7VihhKTtpZighVClpZihudWxsIT09TChOKSlUPSEwLGYoWCk7ZWxzZXt2YXIgYj1MKE8pO251bGwhPT1iJiZnKFcsYi5zdGFydFRpbWUtYSl9fVxuZnVuY3Rpb24gWChhLGIpe1Q9ITE7VSYmKFU9ITEsaCgpKTtTPSEwO3ZhciBjPVI7dHJ5e1YoYik7Zm9yKFE9TChOKTtudWxsIT09USYmKCEoUS5leHBpcmF0aW9uVGltZT5iKXx8YSYmIWsoKSk7KXt2YXIgZD1RLmNhbGxiYWNrO2lmKG51bGwhPT1kKXtRLmNhbGxiYWNrPW51bGw7Uj1RLnByaW9yaXR5TGV2ZWw7dmFyIGU9ZChRLmV4cGlyYXRpb25UaW1lPD1iKTtiPWV4cG9ydHMudW5zdGFibGVfbm93KCk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGU/US5jYWxsYmFjaz1lOlE9PT1MKE4pJiZNKE4pO1YoYil9ZWxzZSBNKE4pO1E9TChOKX1pZihudWxsIT09USl2YXIgbT0hMDtlbHNle3ZhciBuPUwoTyk7bnVsbCE9PW4mJmcoVyxuLnN0YXJ0VGltZS1iKTttPSExfXJldHVybiBtfWZpbmFsbHl7UT1udWxsLFI9YyxTPSExfX1cbmZ1bmN0aW9uIFkoYSl7c3dpdGNoKGEpe2Nhc2UgMTpyZXR1cm4tMTtjYXNlIDI6cmV0dXJuIDI1MDtjYXNlIDU6cmV0dXJuIDEwNzM3NDE4MjM7Y2FzZSA0OnJldHVybiAxRTQ7ZGVmYXVsdDpyZXR1cm4gNUUzfX12YXIgWj1sO2V4cG9ydHMudW5zdGFibGVfSWRsZVByaW9yaXR5PTU7ZXhwb3J0cy51bnN0YWJsZV9JbW1lZGlhdGVQcmlvcml0eT0xO2V4cG9ydHMudW5zdGFibGVfTG93UHJpb3JpdHk9NDtleHBvcnRzLnVuc3RhYmxlX05vcm1hbFByaW9yaXR5PTM7ZXhwb3J0cy51bnN0YWJsZV9Qcm9maWxpbmc9bnVsbDtleHBvcnRzLnVuc3RhYmxlX1VzZXJCbG9ja2luZ1ByaW9yaXR5PTI7ZXhwb3J0cy51bnN0YWJsZV9jYW5jZWxDYWxsYmFjaz1mdW5jdGlvbihhKXthLmNhbGxiYWNrPW51bGx9O2V4cG9ydHMudW5zdGFibGVfY29udGludWVFeGVjdXRpb249ZnVuY3Rpb24oKXtUfHxTfHwoVD0hMCxmKFgpKX07XG5leHBvcnRzLnVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsPWZ1bmN0aW9uKCl7cmV0dXJuIFJ9O2V4cG9ydHMudW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGU9ZnVuY3Rpb24oKXtyZXR1cm4gTChOKX07ZXhwb3J0cy51bnN0YWJsZV9uZXh0PWZ1bmN0aW9uKGEpe3N3aXRjaChSKXtjYXNlIDE6Y2FzZSAyOmNhc2UgMzp2YXIgYj0zO2JyZWFrO2RlZmF1bHQ6Yj1SfXZhciBjPVI7Uj1iO3RyeXtyZXR1cm4gYSgpfWZpbmFsbHl7Uj1jfX07ZXhwb3J0cy51bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbj1mdW5jdGlvbigpe307ZXhwb3J0cy51bnN0YWJsZV9yZXF1ZXN0UGFpbnQ9WjtleHBvcnRzLnVuc3RhYmxlX3J1bldpdGhQcmlvcml0eT1mdW5jdGlvbihhLGIpe3N3aXRjaChhKXtjYXNlIDE6Y2FzZSAyOmNhc2UgMzpjYXNlIDQ6Y2FzZSA1OmJyZWFrO2RlZmF1bHQ6YT0zfXZhciBjPVI7Uj1hO3RyeXtyZXR1cm4gYigpfWZpbmFsbHl7Uj1jfX07XG5leHBvcnRzLnVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2s9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWV4cG9ydHMudW5zdGFibGVfbm93KCk7aWYoXCJvYmplY3RcIj09PXR5cGVvZiBjJiZudWxsIT09Yyl7dmFyIGU9Yy5kZWxheTtlPVwibnVtYmVyXCI9PT10eXBlb2YgZSYmMDxlP2QrZTpkO2M9XCJudW1iZXJcIj09PXR5cGVvZiBjLnRpbWVvdXQ/Yy50aW1lb3V0OlkoYSl9ZWxzZSBjPVkoYSksZT1kO2M9ZStjO2E9e2lkOlArKyxjYWxsYmFjazpiLHByaW9yaXR5TGV2ZWw6YSxzdGFydFRpbWU6ZSxleHBpcmF0aW9uVGltZTpjLHNvcnRJbmRleDotMX07ZT5kPyhhLnNvcnRJbmRleD1lLEooTyxhKSxudWxsPT09TChOKSYmYT09PUwoTykmJihVP2goKTpVPSEwLGcoVyxlLWQpKSk6KGEuc29ydEluZGV4PWMsSihOLGEpLFR8fFN8fChUPSEwLGYoWCkpKTtyZXR1cm4gYX07XG5leHBvcnRzLnVuc3RhYmxlX3Nob3VsZFlpZWxkPWZ1bmN0aW9uKCl7dmFyIGE9ZXhwb3J0cy51bnN0YWJsZV9ub3coKTtWKGEpO3ZhciBiPUwoTik7cmV0dXJuIGIhPT1RJiZudWxsIT09USYmbnVsbCE9PWImJm51bGwhPT1iLmNhbGxiYWNrJiZiLnN0YXJ0VGltZTw9YSYmYi5leHBpcmF0aW9uVGltZTxRLmV4cGlyYXRpb25UaW1lfHxrKCl9O2V4cG9ydHMudW5zdGFibGVfd3JhcENhbGxiYWNrPWZ1bmN0aW9uKGEpe3ZhciBiPVI7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9UjtSPWI7dHJ5e3JldHVybiBhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1maW5hbGx5e1I9Y319fTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9zY2hlZHVsZXIucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvc2NoZWR1bGVyLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuaW1wb3J0IHtcbiAgdW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayxcbiAgdW5zdGFibGVfTG93UHJpb3JpdHksXG4gIHVuc3RhYmxlX0lkbGVQcmlvcml0eSxcbiAgdW5zdGFibGVfTm9ybWFsUHJpb3JpdHlcbn0gZnJvbSAnc2NoZWR1bGVyJ1xuXG5leHBvcnQgY29uc3Qgc2NoZWR1bGVyID0ge1xuICBhcHBseVdpdGhJZGxlUHJpb3JpdHkoY2FsbGJhY2s6KCk9PnZvaWQpe1xuICAgIHVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2sodW5zdGFibGVfSWRsZVByaW9yaXR5LGNhbGxiYWNrKVxuICB9LFxuICBhcHBseVdpdGhMb3dQcmlvcml0eShjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgIHVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2sodW5zdGFibGVfTG93UHJpb3JpdHksIGNhbGxiYWNrKVxuICB9LFxuICBhcHBseVdpZHRoTm9ybWFsUHJpb3JpdHkoY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICB1bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrKHVuc3RhYmxlX05vcm1hbFByaW9yaXR5LCBjYWxsYmFjaylcbiAgfVxufVxuIiwiaW1wb3J0IHsgZWFjaCB9IGZyb20gJy4vYXJyYXknXG5pbXBvcnQgeyBpc1ZhbGlkIH0gZnJvbSAnLi9pc0VtcHR5J1xuaW1wb3J0IHsgaXNQbGFpbk9iaiwgaXNBcnIsIGdldFR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQmlnRGF0YSB9IGZyb20gJy4vYmlnLWRhdGEnXG5jb25zdCBpc1VuTm9ybWFsT2JqZWN0ID0gKHZhbHVlOiBhbnkpID0+IHtcbiAgaWYgKHZhbHVlPy5fb3duZXIgfHwgdmFsdWU/LiQkdHlwZW9mKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBpZiAodmFsdWU/Ll9pc0FNb21lbnRPYmplY3QgfHwgdmFsdWU/Ll9pc0pTT05TY2hlbWFPYmplY3QpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGlmICh2YWx1ZT8udG9KUyB8fCB2YWx1ZT8udG9KU09OKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuXG5jb25zdCBpc1BsYWluVmFsdWUgPSAodmFsOiBhbnkpID0+IHtcbiAgaWYgKGlzVW5Ob3JtYWxPYmplY3QodmFsKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIGlmIChCaWdEYXRhLmlzQmlnRGF0YSh2YWwpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGlzUGxhaW5PYmoodmFsKSB8fCBpc0Fycih2YWwpXG59XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBkZWZhdWx0c1xuICogQHBhcmFtIHRhcmdldHNcbiAqL1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRzID0gKGRlZmF1bHRzXzogYW55LCB0YXJnZXRzOiBhbnkpID0+IHtcbiAgaWYgKFxuICAgIGdldFR5cGUoZGVmYXVsdHNfKSAhPT0gZ2V0VHlwZSh0YXJnZXRzKSB8fFxuICAgICFpc1BsYWluVmFsdWUoZGVmYXVsdHNfKSB8fFxuICAgICFpc1BsYWluVmFsdWUodGFyZ2V0cylcbiAgKSB7XG4gICAgcmV0dXJuIGlzVmFsaWQodGFyZ2V0cykgPyB0YXJnZXRzIDogZGVmYXVsdHNfXG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IGlzUGxhaW5PYmooZGVmYXVsdHNfKSA/IHt9IDogW11cbiAgICBlYWNoKHRhcmdldHMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICByZXN1bHRzW2tleV0gPSBkZWZhdWx0cyhkZWZhdWx0c19ba2V5XSwgdmFsdWUpXG4gICAgfSlcbiAgICBlYWNoKGRlZmF1bHRzXywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIGlmICghaXNWYWxpZChyZXN1bHRzW2tleV0pKSB7XG4gICAgICAgIHJlc3VsdHNba2V5XSA9IHZhbHVlXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG59XG4iLCJlbnVtIFRZUEVfU1RSSU5HIHtcbiAgVU5ERUZJTkVEID0gJ3VuZGVmaW5lZCdcbn1cbmVudW0gQ09OU09MRV9NRVRIT0RTIHtcbiAgREVCVUcgPSAnZGVidWcnLFxuICBFUlJPUiA9ICdlcnJvcicsXG4gIElORk8gPSAnaW5mbycsXG4gIExPRyA9ICdsb2cnLFxuICBXQVJOID0gJ3dhcm4nLFxuICBESVIgPSAnZGlyJyxcbiAgRElSWE1MID0gJ2RpcnhtbCcsXG4gIFRBQkxFID0gJ3RhYmxlJyxcbiAgVFJBQ0UgPSAndHJhY2UnLFxuICBHUk9VUCA9ICdncm91cCcsXG4gIEdST1VQQ09MTEFQU0VEID0gJ2dyb3VwQ29sbGFwc2VkJyxcbiAgR1JPVVBFTkQgPSAnZ3JvdXBFbmQnLFxuICBDTEVBUiA9ICdjbGVhcicsXG4gIENPVU5UID0gJ2NvdW50JyxcbiAgQ09VTlRSRVNFVCA9ICdjb3VudFJlc2V0JyxcbiAgQVNTRVJUID0gJ2Fzc2VydCcsXG4gIFBST0ZJTEUgPSAncHJvZmlsZScsXG4gIFBST0ZJTEVFTkQgPSAncHJvZmlsZUVuZCcsXG4gIFRJTUUgPSAndGltZScsXG4gIFRJTUVMT0cgPSAndGltZUxvZycsXG4gIFRJTUVFTkQgPSAndGltZUVuZCcsXG4gIFRJTUVTVEFNUCA9ICd0aW1lU3RhbXAnLFxuICBDT05URVhUID0gJ2NvbnRleHQnLFxuICBNRU1PUlkgPSAnbWVtb3J5JyxcbiAgLy8gY3VzdG9tIG5hbWVcbiAgVElQUyA9ICd0aXBzJ1xufVxudHlwZSBJTG9nRGF0YTxDLCBUPiA9IHtcbiAgY29udGVudDogQ1xuICB0aXBzPzogVFxuICBrZXl3b3JkOiBzdHJpbmdcbn1cblxuY2xhc3MgTG9nIHtcbiAgcHJpdmF0ZSBrZXl3b3JkID0gJ0FQUCdcbiAgcHJpdmF0ZSBkZWZhdWx0TWV0aG9kcyA9IFtcbiAgICBDT05TT0xFX01FVEhPRFMuTE9HLFxuICAgIENPTlNPTEVfTUVUSE9EUy5FUlJPUixcbiAgICBDT05TT0xFX01FVEhPRFMuV0FSTlxuICBdXG4gIHByaXZhdGUgZGlzYWJsZWQgPSB0cnVlXG4gIHByaXZhdGUgbWV0aG9kczogQ09OU09MRV9NRVRIT0RTW10gPSBbXVxuICBjb25zdHJ1Y3RvcihrZXl3b3JkOiBzdHJpbmcsIG1ldGhvZHM6IENPTlNPTEVfTUVUSE9EU1tdKSB7XG4gICAgdGhpcy5rZXl3b3JkID0ga2V5d29yZFxuICAgIHRoaXMubWV0aG9kcyA9IG1ldGhvZHNcbiAgICB0aGlzLmluaXRDb25zb2xlKClcbiAgfVxuICBwcml2YXRlIGluaXRDb25zb2xlKCk6IHZvaWQge1xuICAgIGNvbnN0IGhhc0NvbnNvbGUgPSB0eXBlb2YgY29uc29sZSA9PT0gVFlQRV9TVFJJTkcuVU5ERUZJTkVEXG4gICAgdGhpcy5kaXNhYmxlZCA9IGhhc0NvbnNvbGVcbiAgICB0aGlzLm1ldGhvZHMuZm9yRWFjaCgobmFtZTogQ09OU09MRV9NRVRIT0RTKSA9PiB7XG4gICAgICBpZiAodGhpcy5kZWZhdWx0TWV0aG9kcy5pbmRleE9mKG5hbWUpID4gLTEpIHJldHVyblxuICAgICAgdGhpc1tuYW1lXSA9IHRoaXMud3JhcChuYW1lKVxuICAgIH0pXG4gIH1cbiAgcHJpdmF0ZSB3cmFwKG5hbWU6IENPTlNPTEVfTUVUSE9EUyk6IChjb250ZW50OiBhbnkpID0+IHZvaWQge1xuICAgIHJldHVybiAoY29udGVudDogYW55KSA9PiB7XG4gICAgICB0aGlzLmNhbGxDb25zb2xlPGFueSwgYW55PihuYW1lLCBjb250ZW50KVxuICAgIH1cbiAgfVxuICBwcml2YXRlIGdldEtleVdvcmRTdHlsZShuYW1lOiBDT05TT0xFX01FVEhPRFMpOiBzdHJpbmcge1xuICAgIHJldHVybiBgWyAke3RoaXMua2V5d29yZH0gJHtuYW1lfSBdOiBgXG4gIH1cbiAgcHJpdmF0ZSBjYWxsQ29uc29sZTxDLCBUPihuYW1lOiBDT05TT0xFX01FVEhPRFMsIGNvbnRlbnQ6IEMsIHRpcHM/OiBUKSB7XG4gICAgY29uc3QgbG9nRGF0YTogSUxvZ0RhdGE8QywgVD4gPSB7IGNvbnRlbnQsIGtleXdvcmQ6IHRoaXMua2V5d29yZCB9XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGxvZ0RhdGEuY29udGVudCA9IHZvaWQgMFxuICAgICAgaWYgKHRpcHMpIHtcbiAgICAgICAgbG9nRGF0YS50aXBzID0gdm9pZCAwXG4gICAgICB9XG4gICAgICByZXR1cm4gbG9nRGF0YVxuICAgIH1cbiAgICBjb25zdCBDb25zb2xlID0gY29uc29sZVxuICAgIGNvbnN0IGtleXdvcmQgPSB0aGlzLmdldEtleVdvcmRTdHlsZShuYW1lKVxuICAgIENvbnNvbGVbbmFtZV0gJiYgQ29uc29sZVtuYW1lXShrZXl3b3JkLCBjb250ZW50KVxuICAgIGlmICh0aXBzKSB7XG4gICAgICBsb2dEYXRhLnRpcHMgPSB0aXBzXG4gICAgICBDb25zb2xlLmluZm8odGhpcy5nZXRLZXlXb3JkU3R5bGUoQ09OU09MRV9NRVRIT0RTLlRJUFMpLCB0aXBzKVxuICAgIH1cbiAgICByZXR1cm4gbG9nRGF0YVxuICB9XG4gIHB1YmxpYyBsb2c8QywgVD4oY29udGVudDogQykge1xuICAgIHJldHVybiB0aGlzLmNhbGxDb25zb2xlPEMsIFQ+KENPTlNPTEVfTUVUSE9EUy5MT0csIGNvbnRlbnQpXG4gIH1cbiAgcHVibGljIHdhcm48QywgVD4oY29udGVudDogQywgdGlwcz86IFQpIHtcbiAgICByZXR1cm4gdGhpcy5jYWxsQ29uc29sZTxDLCBUPihDT05TT0xFX01FVEhPRFMuV0FSTiwgY29udGVudCwgdGlwcylcbiAgfVxuICBwdWJsaWMgZXJyb3I8QywgVD4oY29udGVudDogQywgdGlwcz86IFQpIHtcbiAgICByZXR1cm4gdGhpcy5jYWxsQ29uc29sZTxDLCBUPihDT05TT0xFX01FVEhPRFMuRVJST1IsIGNvbnRlbnQsIHRpcHMpXG4gIH1cbiAgcHVibGljIGluZm88QywgVD4oY29udGVudDogQykge1xuICAgIHJldHVybiB0aGlzLmNhbGxDb25zb2xlPEMsIFQ+KENPTlNPTEVfTUVUSE9EUy5JTkZPLCBjb250ZW50KVxuICB9XG4gIHB1YmxpYyBjbG9zZSgpIHtcbiAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZVxuICB9XG4gIHB1YmxpYyBvcGVuKCkge1xuICAgIHRoaXMuaW5pdENvbnNvbGUoKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBsb2cgPSBuZXcgTG9nKCdGb3JtaWx5JywgW10pXG4iLCJsZXQgSURYID0gMzYsXG4gIEhFWCA9ICcnXG53aGlsZSAoSURYLS0pIEhFWCArPSBJRFgudG9TdHJpbmcoMzYpXG5cbmV4cG9ydCBmdW5jdGlvbiB1aWQobGVuPzogbnVtYmVyKSB7XG4gIGxldCBzdHIgPSAnJyxcbiAgICBudW0gPSBsZW4gfHwgMTFcbiAgd2hpbGUgKG51bS0tKSBzdHIgKz0gSEVYWyhNYXRoLnJhbmRvbSgpICogMzYpIHwgMF1cbiAgcmV0dXJuIHN0clxufVxuIl0sIm5hbWVzIjpbIl9fZGVmUHJvcCIsIl9fZ2V0T3duUHJvcFN5bWJvbHMiLCJfX2hhc093blByb3AiLCJfX3Byb3BJc0VudW0iLCJfX2RlZk5vcm1hbFByb3AiLCJfX3NwcmVhZFZhbHVlcyIsImlzVmFsaWQiLCJMQU5HVUFHRVMiLCJ1cHBlckNhc2UiLCJsb3dlckNhc2UiLCJyZXF1aXJlJCQwIiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDIiLCJyZXF1aXJlJCQzIiwibm9DYXNlIiwidGhpcyIsInRva2Vuc18xIiwiY29udGV4dHNfMSIsInJlcXVpcmUkJDQiLCJyZXF1aXJlJCQ1Iiwic2NoZWR1bGVyTW9kdWxlIiwidW5zdGFibGVfc2NoZWR1bGVDYWxsYmFjayIsInVuc3RhYmxlX0lkbGVQcmlvcml0eSIsInVuc3RhYmxlX0xvd1ByaW9yaXR5IiwidW5zdGFibGVfTm9ybWFsUHJpb3JpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7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LEVBQUUsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxnQ0FBZ0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxrSEFBa0gsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUztNQUM1ZixVQUFVLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUNoZCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3BhLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztNQUMxUCxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENB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LENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7TUFDOWEsNkJBQTZCLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLDhCQUE4QixTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7OztNQ2xCeFI7TUFDM0MsRUFBRWMsbUJBQWMsR0FBR1Ysd0JBQTRDLENBQUM7TUFDaEU7O0FDRVksWUFBQyxTQUFTLHdCQUFHO01BQ3pCLEVBQUUscUJBQXFCLENBQUMsUUFBUSxFQUFFO01BQ2xDLElBQUlXLDZDQUF5QixDQUFDQyx5Q0FBcUIsRUFBRSxRQUFRLENBQUMsQ0FBQztNQUMvRCxHQUFHO01BQ0gsRUFBRSxvQkFBb0IsQ0FBQyxRQUFRLEVBQUU7TUFDakMsSUFBSUQsNkNBQXlCLENBQUNFLHdDQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQzlELEdBQUc7TUFDSCxFQUFFLHdCQUF3QixDQUFDLFFBQVEsRUFBRTtNQUNyQyxJQUFJRiw2Q0FBeUIsQ0FBQ0csMkNBQXVCLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDakUsR0FBRztNQUNIOztNQ1pBLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLEtBQUs7TUFDcEMsRUFBRSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxNQUFNLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO01BQzVGLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztNQUNILEVBQUUsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixNQUFNLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7TUFDakgsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO01BQ0gsRUFBRSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxNQUFNLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO01BQ3hGLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztNQUNILENBQUMsQ0FBQztNQUNGLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBRyxLQUFLO01BQzlCLEVBQUUsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUM3QixJQUFJLE9BQU8sS0FBSyxDQUFDO01BQ2pCLEdBQUc7TUFDSCxFQUFFLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUM5QixJQUFJLE9BQU8sS0FBSyxDQUFDO01BQ2pCLEdBQUc7TUFDSCxFQUFFLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN2QyxDQUFDLENBQUM7QUFDVSxZQUFDLFFBQVEsdUJBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxLQUFLO01BQ2hELEVBQUUsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFO01BQ3JHLElBQUksT0FBT2xCLFNBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLEdBQUcsU0FBUyxDQUFDO01BQ2xELEdBQUcsTUFBTTtNQUNULElBQUksTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7TUFDcEQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSztNQUNsQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQ3JELEtBQUssQ0FBQyxDQUFDO01BQ1AsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSztNQUNwQyxNQUFNLElBQUksQ0FBQ0EsU0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO01BQ2xDLFFBQVEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztNQUM3QixPQUFPO01BQ1AsS0FBSyxDQUFDLENBQUM7TUFDUCxJQUFJLE9BQU8sT0FBTyxDQUFDO01BQ25CLEdBQUc7TUFDSDs7TUN2Q0EsSUFBSSxXQUFXLENBQUM7TUFDaEIsQ0FBQyxTQUFTLFlBQVksRUFBRTtNQUN4QixFQUFFLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7TUFDMUMsQ0FBQyxFQUFFLFdBQVcsS0FBSyxXQUFXLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUN0QyxJQUFJLGVBQWUsQ0FBQztNQUNwQixDQUFDLFNBQVMsZ0JBQWdCLEVBQUU7TUFDNUIsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7TUFDdEMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7TUFDdEMsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7TUFDcEMsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDbEMsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7TUFDcEMsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDbEMsRUFBRSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUM7TUFDeEMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7TUFDdEMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7TUFDdEMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7TUFDdEMsRUFBRSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO01BQ3hELEVBQUUsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO01BQzVDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO01BQ3RDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO01BQ3RDLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEdBQUcsWUFBWSxDQUFDO01BQ2hELEVBQUUsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDO01BQ3hDLEVBQUUsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO01BQzFDLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEdBQUcsWUFBWSxDQUFDO01BQ2hELEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO01BQ3BDLEVBQUUsZ0JB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
