System.register([], (function (exports) {
	'use strict';
	return {
		execute: (function () {

			var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

			var lib$1 = {};

			var array = {};

			var types$1 = {};

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			var isType = function (type) { return function (obj) {
			    return obj != null &&
			        (Array.isArray(type) ? type : [type]).some(function (t) { return exports.getType(obj) === "[object " + t + "]"; });
			}; };
			exports.getType = function (obj) { return Object.prototype.toString.call(obj); };
			exports.isFn = isType([
			    'Function',
			    'AsyncFunction',
			    'GeneratorFunction'
			]);
			exports.isArr = Array.isArray;
			exports.isPlainObj = isType('Object');
			exports.isStr = isType('String');
			exports.isBool = isType('Boolean');
			exports.isNum = isType('Number');
			exports.isObj = function (val) { return typeof val === 'object'; };
			exports.isRegExp = isType('RegExp');
			}(types$1));

			Object.defineProperty(array, "__esModule", { value: true });
			var types_1$6 = types$1;
			array.toArr = function (val) { return (types_1$6.isArr(val) ? val : val ? [val] : []); };
			function each(val, iterator, revert) {
			    if (types_1$6.isArr(val) || types_1$6.isStr(val)) {
			        if (revert) {
			            for (var i = val.length - 1; i >= 0; i--) {
			                if (iterator(val[i], i) === false) {
			                    return;
			                }
			            }
			        }
			        else {
			            for (var i = 0; i < val.length; i++) {
			                if (iterator(val[i], i) === false) {
			                    return;
			                }
			            }
			        }
			    }
			    else if (types_1$6.isObj(val)) {
			        var key = void 0;
			        for (key in val) {
			            if (Object.hasOwnProperty.call(val, key)) {
			                if (iterator(val[key], key) === false) {
			                    return;
			                }
			            }
			        }
			    }
			}
			array.each = each;
			function map(val, iterator, revert) {
			    var res = types_1$6.isArr(val) || types_1$6.isStr(val) ? [] : {};
			    each(val, function (item, key) {
			        var value = iterator(item, key);
			        if (types_1$6.isArr(res)) {
			            res.push(value);
			        }
			        else {
			            res[key] = value;
			        }
			    }, revert);
			    return res;
			}
			array.map = map;
			function reduce(val, iterator, accumulator, revert) {
			    var result = accumulator;
			    each(val, function (item, key) {
			        result = iterator(result, item, key);
			    }, revert);
			    return result;
			}
			array.reduce = reduce;
			function every(val, iterator, revert) {
			    var res = true;
			    each(val, function (item, key) {
			        if (!iterator(item, key)) {
			            res = false;
			            return false;
			        }
			    }, revert);
			    return res;
			}
			array.every = every;
			function some(val, iterator, revert) {
			    var res = false;
			    each(val, function (item, key) {
			        if (iterator(item, key)) {
			            res = true;
			            return false;
			        }
			    }, revert);
			    return res;
			}
			array.some = some;
			function findIndex(val, iterator, revert) {
			    var res = -1;
			    each(val, function (item, key) {
			        if (iterator(item, key)) {
			            res = key;
			            return false;
			        }
			    }, revert);
			    return res;
			}
			array.findIndex = findIndex;
			function find(val, iterator, revert) {
			    var res;
			    each(val, function (item, key) {
			        if (iterator(item, key)) {
			            res = item;
			            return false;
			        }
			    }, revert);
			    return res;
			}
			array.find = find;
			function includes(val, searchElement, revert) {
			    if (types_1$6.isStr(val))
			        return val.includes(searchElement);
			    return some(val, function (item) { return item === searchElement; }, revert);
			}
			array.includes = includes;

			var compare = {};

			var _instanceof = {};

			var global$1 = {};

			Object.defineProperty(global$1, "__esModule", { value: true });
			function globalSelf() {
			    try {
			        if (typeof self !== 'undefined') {
			            return self;
			        }
			    }
			    catch (e) { }
			    try {
			        if (typeof window !== 'undefined') {
			            return window;
			        }
			    }
			    catch (e) { }
			    try {
			        if (typeof commonjsGlobal !== 'undefined') {
			            return commonjsGlobal;
			        }
			    }
			    catch (e) { }
			    return Function('return this')();
			}
			global$1.globalThisPolyfill = globalSelf();

			Object.defineProperty(_instanceof, "__esModule", { value: true });
			var global_1 = global$1;
			var types_1$5 = types$1;
			_instanceof.instOf = function (value, cls) {
			    if (types_1$5.isFn(cls))
			        return value instanceof cls;
			    if (types_1$5.isStr(cls))
			        return global_1.globalThisPolyfill[cls]
			            ? value instanceof global_1.globalThisPolyfill[cls]
			            : false;
			    return false;
			};

			var bigData = {};

			var __assign$1 = (commonjsGlobal && commonjsGlobal.__assign) || function () {
			    __assign$1 = Object.assign || function(t) {
			        for (var s, i = 1, n = arguments.length; i < n; i++) {
			            s = arguments[i];
			            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
			                t[p] = s[p];
			        }
			        return t;
			    };
			    return __assign$1.apply(this, arguments);
			};
			Object.defineProperty(bigData, "__esModule", { value: true });
			var types_1$4 = types$1;
			var BIG_DATA_FLAG = Symbol('__BIG_DATA__');
			var BigData = (function () {
			    function BigData(options) {
			        this.options = __assign$1({}, options);
			    }
			    BigData.prototype.create = function (data) {
			        if (data !== undefined) {
			            if (!data[BIG_DATA_FLAG]) {
			                data[BIG_DATA_FLAG] = this.options;
			            }
			        }
			        return data;
			    };
			    BigData.isBigData = function (data) {
			        return data && !!data[BIG_DATA_FLAG];
			    };
			    BigData.compare = function (a, b) {
			        if (BigData.isBigData(a) && BigData.isBigData(b)) {
			            if (a[BIG_DATA_FLAG] === b[BIG_DATA_FLAG]) {
			                return types_1$4.isFn(a[BIG_DATA_FLAG].compare)
			                    ? a[BIG_DATA_FLAG].compare(a, b)
			                    : a === b;
			            }
			            return false;
			        }
			        return a === b;
			    };
			    BigData.clone = function (value) {
			        if (BigData.isBigData(value)) {
			            if (types_1$4.isFn(value[BIG_DATA_FLAG].clone)) {
			                var ctx = value[BIG_DATA_FLAG];
			                var result = value[BIG_DATA_FLAG].clone(value);
			                result[BIG_DATA_FLAG] = ctx;
			                return result;
			            }
			        }
			        return value;
			    };
			    return BigData;
			}());
			bigData.BigData = BigData;

			Object.defineProperty(compare, "__esModule", { value: true });
			var types_1$3 = types$1;
			var instanceof_1$1 = _instanceof;
			var big_data_1$1 = bigData;
			var isArray = types_1$3.isArr;
			var keyList = Object.keys;
			var hasProp = Object.prototype.hasOwnProperty;
			function equal(a, b, compareFunctionString) {
			    if (compareFunctionString === void 0) { compareFunctionString = false; }
			    if (a === b) {
			        return true;
			    }
			    if (a && b && typeof a === 'object' && typeof b === 'object') {
			        var bigDataA = big_data_1$1.BigData.isBigData(a);
			        var bigDataB = big_data_1$1.BigData.isBigData(b);
			        if (bigDataA !== bigDataB) {
			            return false;
			        }
			        if (bigDataA && bigDataB) {
			            return big_data_1$1.BigData.compare(a, b);
			        }
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
			                if (!equal(a[i], b[i], compareFunctionString)) {
			                    return false;
			                }
			            }
			            return true;
			        }
			        if (arrA !== arrB) {
			            return false;
			        }
			        var momentA = a && a._isAMomentObject;
			        var momentB = b && b._isAMomentObject;
			        if (momentA !== momentB)
			            return false;
			        if (momentA && momentB)
			            return a.isSame(b);
			        var immutableA = a && a.toJS;
			        var immutableB = b && b.toJS;
			        if (immutableA !== immutableB)
			            return false;
			        if (immutableA)
			            return a.is ? a.is(b) : a === b;
			        var dateA = instanceof_1$1.instOf(a, 'Date');
			        var dateB = instanceof_1$1.instOf(b, 'Date');
			        if (dateA !== dateB) {
			            return false;
			        }
			        if (dateA && dateB) {
			            return a.getTime() === b.getTime();
			        }
			        var schemaA = a && a.toJSON;
			        var schemaB = b && b.toJSON;
			        if (schemaA !== schemaB)
			            return false;
			        if (schemaA && schemaB)
			            return equal(a.toJSON(), b.toJSON(), compareFunctionString);
			        var regexpA = instanceof_1$1.instOf(a, 'RegExp');
			        var regexpB = instanceof_1$1.instOf(b, 'RegExp');
			        if (regexpA !== regexpB) {
			            return false;
			        }
			        if (regexpA && regexpB) {
			            return a.toString() === b.toString();
			        }
			        var urlA = instanceof_1$1.instOf(a, 'URL');
			        var urlB = instanceof_1$1.instOf(b, 'URL');
			        if (urlA && urlB) {
			            return a.href === b.href;
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
			            if (key === '_owner' && a.$$typeof) {
			                continue;
			            }
			            else {
			                if (!equal(a[key], b[key], compareFunctionString)) {
			                    return false;
			                }
			            }
			        }
			        return true;
			    }
			    if (compareFunctionString) {
			        if (a && b && typeof a === 'function' && typeof b === 'function') {
			            return a.toString() === b.toString();
			        }
			    }
			    return a !== a && b !== b;
			}
			compare.isEqual = function exportedEqual(a, b, compareFunctionString) {
			    if (compareFunctionString === void 0) { compareFunctionString = false; }
			    try {
			        return equal(a, b, compareFunctionString);
			    }
			    catch (error) {
			        if ((error.message && error.message.match(/stack|recursion/i)) ||
			            error.number === -2146828260) {
			            console.warn('Warning: react-fast-compare does not handle circular references.', error.name, error.message);
			            return false;
			        }
			        throw error;
			    }
			};

			var clone = {};

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
			var types_1 = types$1;
			var instanceof_1 = _instanceof;
			var big_data_1 = bigData;
			var NATIVE_KEYS = [
			    ['Map', function (map) { return new Map(map); }],
			    ['WeakMap', function (map) { return new WeakMap(map); }],
			    ['WeakSet', function (set) { return new WeakSet(set); }],
			    ['Set', function (set) { return new Set(set); }],
			    ['Date', function (date) { return new Date(date); }],
			    'FileList',
			    'File',
			    'URL',
			    'RegExp',
			    [
			        'Promise',
			        function (promise) {
			            return new Promise(function (resolve, reject) { return promise.then(resolve, reject); });
			        }
			    ]
			];
			var isNativeObject = function (values) {
			    for (var i = 0; i < NATIVE_KEYS.length; i++) {
			        var item = NATIVE_KEYS[i];
			        if (Array.isArray(item) && item[0]) {
			            if (instanceof_1.instOf(values, item[0])) {
			                return item[1] ? item[1] : item[0];
			            }
			        }
			        else {
			            if (instanceof_1.instOf(values, item)) {
			                return item;
			            }
			        }
			    }
			};
			exports.shallowClone = function (values) {
			    var nativeClone;
			    if (Array.isArray(values)) {
			        return values.slice(0);
			    }
			    else if (isNativeObject(values)) {
			        nativeClone = isNativeObject(values);
			        return types_1.isFn(nativeClone) ? nativeClone(values) : values;
			    }
			    else if (typeof values === 'object' && !!values) {
			        return __assign({}, values);
			    }
			};
			exports.clone = function (values, filter) {
			    var nativeClone;
			    if (Array.isArray(values)) {
			        return values.map(function (item) { return exports.clone(item, filter); });
			    }
			    else if (isNativeObject(values)) {
			        nativeClone = isNativeObject(values);
			        return types_1.isFn(nativeClone) ? nativeClone(values) : values;
			    }
			    else if (typeof values === 'object' && !!values) {
			        if ('$$typeof' in values && '_owner' in values) {
			            return values;
			        }
			        if (values._isAMomentObject) {
			            return values;
			        }
			        if (values._isJSONSchemaObject) {
			            return values;
			        }
			        if (big_data_1.BigData.isBigData(values)) {
			            return big_data_1.BigData.clone(values);
			        }
			        if (types_1.isFn(values.toJS)) {
			            return values;
			        }
			        if (types_1.isFn(values.toJSON)) {
			            return values;
			        }
			        if (Object.getOwnPropertySymbols(values || {}).length) {
			            return values;
			        }
			        var res = {};
			        for (var key in values) {
			            if (Object.hasOwnProperty.call(values, key)) {
			                if (types_1.isFn(filter)) {
			                    if (filter(values[key], key)) {
			                        res[key] = exports.clone(values[key], filter);
			                    }
			                    else {
			                        res[key] = values[key];
			                    }
			                }
			                else {
			                    res[key] = exports.clone(values[key], filter);
			                }
			            }
			        }
			        return res;
			    }
			    else {
			        return values;
			    }
			};
			}(clone));

			var isEmpty$1 = {};

			Object.defineProperty(isEmpty$1, "__esModule", { value: true });
			var instanceof_1 = _instanceof;
			var has = Object.prototype.hasOwnProperty;
			var toString = Object.prototype.toString;
			isEmpty$1.isValid = function (val) { return val !== undefined && val !== null; };
			function isEmpty(val) {
			    if (val == null) {
			        return true;
			    }
			    if (typeof val === 'boolean') {
			        return false;
			    }
			    if (typeof val === 'number') {
			        return false;
			    }
			    if (typeof val === 'string') {
			        return val.length === 0;
			    }
			    if (typeof val === 'function') {
			        return val.length === 0;
			    }
			    if (Array.isArray(val)) {
			        if (val.length === 0) {
			            return true;
			        }
			        for (var i = 0; i < val.length; i++) {
			            if (val[i] !== undefined &&
			                val[i] !== null &&
			                val[i] !== '' &&
			                val[i] !== 0) {
			                return false;
			            }
			        }
			        return true;
			    }
			    if (instanceof_1.instOf(val, 'Error')) {
			        return val.message === '';
			    }
			    if (val.toString === toString) {
			        switch (val.toString()) {
			            case '[object File]':
			            case '[object Map]':
			            case '[object Set]': {
			                return val.size === 0;
			            }
			            case '[object Object]': {
			                for (var key in val) {
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
			isEmpty$1.isEmpty = isEmpty;

			var _case = {};

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
			var upperCase$1 = function (str, locale) {
			  var lang = LANGUAGES$1[locale];

			  str = str == null ? '' : String(str);

			  if (lang) {
			    str = str.replace(lang.regexp, function (m) { return lang.map[m] });
			  }

			  return str.toUpperCase()
			};

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
			var lowerCase$1 = function (str, locale) {
			  var lang = LANGUAGES[locale];

			  str = str == null ? '' : String(str);

			  if (lang) {
			    str = str.replace(lang.regexp, function (m) { return lang.map[m] });
			  }

			  return str.toLowerCase()
			};

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
			var camelCase = function (value, locale, mergeNumbers) {
			  var result = noCase(value, locale);

			  // Replace periods between numeric entities with an underscore.
			  if (!mergeNumbers) {
			    result = result.replace(/ (?=\d)/g, '_');
			  }

			  // Replace spaces between words with an upper cased character.
			  return result.replace(/ (.)/g, function (m, $1) {
			    return upperCase($1, locale)
			  })
			};

			var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
			    return (mod && mod.__esModule) ? mod : { "default": mod };
			};
			Object.defineProperty(_case, "__esModule", { value: true });
			var camel_case_1 = __importDefault$1(camelCase);
			_case.camelCase = camel_case_1.default;
			var lower_case_1 = __importDefault$1(lowerCase$1);
			_case.lowercase = lower_case_1.default;
			var upper_case_1 = __importDefault$1(upperCase$1);
			_case.uppercase = upper_case_1.default;

			var string = {};

			Object.defineProperty(string, "__esModule", { value: true });
			var ansiRegex = function () {
			    var pattern = [
			        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
			        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
			    ].join('|');
			    return new RegExp(pattern, 'g');
			};
			var regex = '[\uD800-\uDBFF][\uDC00-\uDFFF]';
			var astralRegex = function (opts) {
			    return opts && opts.exact ? new RegExp("^" + regex + "$") : new RegExp(regex, 'g');
			};
			var stripAnsi = function (input) {
			    return typeof input === 'string' ? input.replace(ansiRegex(), '') : input;
			};
			string.stringLength = function (input) {
			    return stripAnsi(input).replace(astralRegex(), ' ').length;
			};

			var path = {};

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
			var types_1$2 = types;
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
			        if (types_1$2.isExpandOperator(node.after)) {
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
			                    if (node.after && types_1$2.isWildcardOperator(node.after.after)) {
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
			        if (types_1$2.isIdentifier(node)) {
			            return this.matchIdentifier(path, node);
			        }
			        else if (types_1$2.isIgnoreExpression(node)) {
			            return this.matchIgnoreExpression(path, node);
			        }
			        else if (types_1$2.isDestructorExpression(node)) {
			            return this.matchDestructorExpression(path, node);
			        }
			        else if (types_1$2.isExpandOperator(node)) {
			            return this.matchExpandOperator(path, node);
			        }
			        else if (types_1$2.isWildcardOperator(node)) {
			            return this.matchWildcardOperator(path, node);
			        }
			        else if (types_1$2.isGroupExpression(node)) {
			            return this.matchGroupExpression(path, node);
			        }
			        else if (types_1$2.isRangeExpression(node)) {
			            return this.matchRangeExpression(path, node);
			        }
			        else if (types_1$2.isDotOperator(node)) {
			            return this.matchDotOperator(path, node);
			        }
			        return true;
			    };
			    Matcher.prototype.match = function (path) {
			        var matched = this.matchAtom(path, this.tree);
			        if (!this.tail)
			            return { matched: false };
			        if (this.tail == this.tree && types_1$2.isWildcardOperator(this.tail)) {
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

			var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
			    return (mod && mod.__esModule) ? mod : { "default": mod };
			};
			Object.defineProperty(path, "__esModule", { value: true });
			var cool_path_1 = __importDefault(lib);
			path.FormPath = cool_path_1.default;

			var deprecate$1 = {};

			Object.defineProperty(deprecate$1, "__esModule", { value: true });
			var types_1$1 = types$1;
			var caches = {};
			function deprecate(method, message, help) {
			    if (types_1$1.isFn(method)) {
			        return function (p1, p2, p3, p4, p5) {
			            deprecate(message, help);
			            return method.apply(this, arguments);
			        };
			    }
			    if (types_1$1.isStr(method) && !caches[method]) {
			        caches[method] = true;
			        console.warn(new Error(method + " has been deprecated. Do not continue to use this api." + (message ||
			            '')));
			    }
			}
			deprecate$1.deprecate = deprecate;

			var subscribable = {};

			Object.defineProperty(subscribable, "__esModule", { value: true });
			var types_1 = types$1;
			var array_1 = array;
			var Subscribable = (function () {
			    function Subscribable() {
			        var _this = this;
			        this.subscribers = {
			            index: 0
			        };
			        this.subscribe = function (callback) {
			            if (types_1.isFn(callback)) {
			                var index = _this.subscribers.index + 1;
			                _this.subscribers[index] = callback;
			                _this.subscribers.index++;
			                return index;
			            }
			        };
			        this.unsubscribe = function (index) {
			            if (_this.subscribers[index]) {
			                delete _this.subscribers[index];
			            }
			        };
			        this.notify = function (payload, silent) {
			            if (_this.subscription) {
			                if (_this.subscription && types_1.isFn(_this.subscription.notify)) {
			                    if (_this.subscription.notify.call(_this, payload) === false) {
			                        return;
			                    }
			                }
			            }
			            if (silent)
			                return;
			            var filter = function (payload) {
			                if (_this.subscription && types_1.isFn(_this.subscription.filter)) {
			                    return _this.subscription.filter.call(_this, payload);
			                }
			                return payload;
			            };
			            array_1.each(_this.subscribers, function (callback) {
			                if (types_1.isFn(callback))
			                    callback(filter(payload));
			            });
			        };
			    }
			    return Subscribable;
			}());
			subscribable.Subscribable = Subscribable;

			var merge = {};

			Object.defineProperty(merge, "__esModule", { value: true });
			var big_data_1 = bigData;
			var isEmpty_1 = isEmpty$1;
			function defaultIsMergeableObject(value) {
			    return isNonNullObject(value) && !isSpecial(value);
			}
			function isNonNullObject(value) {
			    return !!value && typeof value === 'object';
			}
			function isSpecial(value) {
			    var stringValue = Object.prototype.toString.call(value);
			    return (stringValue === '[object RegExp]' ||
			        stringValue === '[object Date]' ||
			        isReactElement(value));
			}
			var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
			var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;
			function isReactElement(value) {
			    return value.$$typeof === REACT_ELEMENT_TYPE;
			}
			function emptyTarget(val) {
			    return Array.isArray(val) ? [] : {};
			}
			function cloneUnlessOtherwiseSpecified(value, options) {
			    if (options.clone !== false && options.isMergeableObject(value)) {
			        if (big_data_1.BigData.isBigData(value)) {
			            return big_data_1.BigData.clone(value);
			        }
			        else {
			            return deepmerge(emptyTarget(value), value, options);
			        }
			    }
			    return value;
			}
			function defaultArrayMerge(target, source, options) {
			    return target.concat(source).map(function (element) {
			        return cloneUnlessOtherwiseSpecified(element, options);
			    });
			}
			function getMergeFunction(key, options) {
			    if (!options.customMerge) {
			        return deepmerge;
			    }
			    var customMerge = options.customMerge(key);
			    return typeof customMerge === 'function' ? customMerge : deepmerge;
			}
			function getEnumerableOwnPropertySymbols(target) {
			    return Object.getOwnPropertySymbols
			        ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
			            return target.propertyIsEnumerable(symbol);
			        })
			        : [];
			}
			function getKeys(target) {
			    if (!isEmpty_1.isValid(target))
			        return [];
			    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
			}
			function propertyIsOnObject(object, property) {
			    try {
			        return property in object;
			    }
			    catch (_) {
			        return false;
			    }
			}
			function propertyIsUnsafe(target, key) {
			    return (propertyIsOnObject(target, key) &&
			        !(Object.hasOwnProperty.call(target, key) &&
			            Object.propertyIsEnumerable.call(target, key)));
			}
			function mergeObject(target, source, options) {
			    var destination = options.assign ? target || {} : {};
			    if (!options.isMergeableObject(target))
			        return target;
			    if (!options.assign) {
			        getKeys(target).forEach(function (key) {
			            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
			        });
			    }
			    getKeys(source).forEach(function (key) {
			        if (propertyIsUnsafe(target, key)) {
			            return;
			        }
			        if (!target[key]) {
			            destination[key] = source[key];
			        }
			        if (propertyIsOnObject(target, key) &&
			            options.isMergeableObject(source[key])) {
			            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			        }
			        else {
			            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
			        }
			    });
			    return destination;
			}
			function deepmerge(target, source, options) {
			    options = options || {};
			    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
			    options.isMergeableObject =
			        options.isMergeableObject || defaultIsMergeableObject;
			    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
			    var sourceIsArray = Array.isArray(source);
			    var targetIsArray = Array.isArray(target);
			    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
			    if (!sourceAndTargetTypesMatch) {
			        return cloneUnlessOtherwiseSpecified(source, options);
			    }
			    else if (sourceIsArray) {
			        return options.arrayMerge(target, source, options);
			    }
			    else {
			        return mergeObject(target, source, options);
			    }
			}
			function deepmergeAll(array, options) {
			    if (!Array.isArray(array)) {
			        throw new Error('first argument should be an array');
			    }
			    return array.reduce(function (prev, next) {
			        return deepmerge(prev, next, options);
			    }, {});
			}
			deepmerge.all = deepmergeAll;
			merge.merge = deepmerge;

			var scheduler$1 = {};

			var scheduler = {exports: {}};

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
			  scheduler.exports = scheduler_production_min;
			}

			Object.defineProperty(scheduler$1, "__esModule", { value: true });
			var scheduler_1 = scheduler.exports;
			scheduler$1.scheduler = {
			    applyWithIdlePriority: function (callback) {
			        scheduler_1.unstable_scheduleCallback(scheduler_1.unstable_IdlePriority, callback);
			    },
			    applyWithLowPriority: function (callback) {
			        scheduler_1.unstable_scheduleCallback(scheduler_1.unstable_LowPriority, callback);
			    },
			    applyWidthNormalPriority: function (callback) {
			        scheduler_1.unstable_scheduleCallback(scheduler_1.unstable_NormalPriority, callback);
			    }
			};

			var defaults = {};

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			var array_1 = array;
			var isEmpty_1 = isEmpty$1;
			var types_1 = types$1;
			var big_data_1 = bigData;
			var isUnNormalObject = function (value) {
			    if ((value === null || value === void 0 ? void 0 : value._owner) || (value === null || value === void 0 ? void 0 : value.$$typeof)) {
			        return true;
			    }
			    if ((value === null || value === void 0 ? void 0 : value._isAMomentObject) || (value === null || value === void 0 ? void 0 : value._isJSONSchemaObject)) {
			        return true;
			    }
			    if ((value === null || value === void 0 ? void 0 : value.toJS) || (value === null || value === void 0 ? void 0 : value.toJSON)) {
			        return true;
			    }
			};
			var isPlainValue = function (val) {
			    if (isUnNormalObject(val)) {
			        return false;
			    }
			    if (big_data_1.BigData.isBigData(val)) {
			        return false;
			    }
			    return types_1.isPlainObj(val) || types_1.isArr(val);
			};
			exports.defaults = function (defaults_, targets) {
			    if (types_1.getType(defaults_) !== types_1.getType(targets) ||
			        !isPlainValue(defaults_) ||
			        !isPlainValue(targets)) {
			        return isEmpty_1.isValid(targets) ? targets : defaults_;
			    }
			    else {
			        var results_1 = types_1.isPlainObj(defaults_) ? {} : [];
			        array_1.each(targets, function (value, key) {
			            results_1[key] = exports.defaults(defaults_[key], value);
			        });
			        array_1.each(defaults_, function (value, key) {
			            if (!isEmpty_1.isValid(results_1[key])) {
			                results_1[key] = value;
			            }
			        });
			        return results_1;
			    }
			};
			}(defaults));

			var log = {};

			Object.defineProperty(log, "__esModule", { value: true });
			var TYPE_STRING;
			(function (TYPE_STRING) {
			    TYPE_STRING["UNDEFINED"] = "undefined";
			})(TYPE_STRING || (TYPE_STRING = {}));
			var CONSOLE_METHODS;
			(function (CONSOLE_METHODS) {
			    CONSOLE_METHODS["DEBUG"] = "debug";
			    CONSOLE_METHODS["ERROR"] = "error";
			    CONSOLE_METHODS["INFO"] = "info";
			    CONSOLE_METHODS["LOG"] = "log";
			    CONSOLE_METHODS["WARN"] = "warn";
			    CONSOLE_METHODS["DIR"] = "dir";
			    CONSOLE_METHODS["DIRXML"] = "dirxml";
			    CONSOLE_METHODS["TABLE"] = "table";
			    CONSOLE_METHODS["TRACE"] = "trace";
			    CONSOLE_METHODS["GROUP"] = "group";
			    CONSOLE_METHODS["GROUPCOLLAPSED"] = "groupCollapsed";
			    CONSOLE_METHODS["GROUPEND"] = "groupEnd";
			    CONSOLE_METHODS["CLEAR"] = "clear";
			    CONSOLE_METHODS["COUNT"] = "count";
			    CONSOLE_METHODS["COUNTRESET"] = "countReset";
			    CONSOLE_METHODS["ASSERT"] = "assert";
			    CONSOLE_METHODS["PROFILE"] = "profile";
			    CONSOLE_METHODS["PROFILEEND"] = "profileEnd";
			    CONSOLE_METHODS["TIME"] = "time";
			    CONSOLE_METHODS["TIMELOG"] = "timeLog";
			    CONSOLE_METHODS["TIMEEND"] = "timeEnd";
			    CONSOLE_METHODS["TIMESTAMP"] = "timeStamp";
			    CONSOLE_METHODS["CONTEXT"] = "context";
			    CONSOLE_METHODS["MEMORY"] = "memory";
			    CONSOLE_METHODS["TIPS"] = "tips";
			})(CONSOLE_METHODS || (CONSOLE_METHODS = {}));
			var Log = (function () {
			    function Log(keyword, methods) {
			        this.keyword = 'APP';
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
			    Log.prototype.initConsole = function () {
			        var _this = this;
			        var hasConsole = typeof console === TYPE_STRING.UNDEFINED;
			        this.disabled = hasConsole;
			        this.methods.forEach(function (name) {
			            if (_this.defaultMethods.indexOf(name) > -1)
			                return;
			            _this[name] = _this.wrap(name);
			        });
			    };
			    Log.prototype.wrap = function (name) {
			        var _this = this;
			        return function (content) {
			            _this.callConsole(name, content);
			        };
			    };
			    Log.prototype.getKeyWordStyle = function (name) {
			        return "[ " + this.keyword + " " + name + " ]: ";
			    };
			    Log.prototype.callConsole = function (name, content, tips) {
			        var logData = { content: content, keyword: this.keyword };
			        if (this.disabled) {
			            logData.content = void 0;
			            if (tips) {
			                logData.tips = void 0;
			            }
			            return logData;
			        }
			        var Console = console;
			        var keyword = this.getKeyWordStyle(name);
			        Console[name] && Console[name](keyword, content);
			        if (tips) {
			            logData.tips = tips;
			            Console.info(this.getKeyWordStyle(CONSOLE_METHODS.TIPS), tips);
			        }
			        return logData;
			    };
			    Log.prototype.log = function (content) {
			        return this.callConsole(CONSOLE_METHODS.LOG, content);
			    };
			    Log.prototype.warn = function (content, tips) {
			        return this.callConsole(CONSOLE_METHODS.WARN, content, tips);
			    };
			    Log.prototype.error = function (content, tips) {
			        return this.callConsole(CONSOLE_METHODS.ERROR, content, tips);
			    };
			    Log.prototype.info = function (content) {
			        return this.callConsole(CONSOLE_METHODS.INFO, content);
			    };
			    Log.prototype.close = function () {
			        this.disabled = true;
			    };
			    Log.prototype.open = function () {
			        this.initConsole();
			    };
			    return Log;
			}());
			log.log = new Log('Formily', []);

			var uid$1 = {};

			Object.defineProperty(uid$1, "__esModule", { value: true });
			var IDX = 36, HEX = '';
			while (IDX--)
			    HEX += IDX.toString(36);
			function uid(len) {
			    var str = '', num = len || 11;
			    while (num--)
			        str += HEX[(Math.random() * 36) | 0];
			    return str;
			}
			uid$1.uid = uid;

			(function (exports) {
			function __export(m) {
			    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
			}
			Object.defineProperty(exports, "__esModule", { value: true });
			__export(array);
			__export(compare);
			__export(types$1);
			__export(clone);
			__export(isEmpty$1);
			__export(_case);
			__export(string);
			__export(global$1);
			__export(path);
			__export(deprecate$1);
			__export(subscribable);
			__export(merge);
			__export(_instanceof);
			__export(scheduler$1);
			__export(defaults);
			__export(log);
			__export(bigData);
			__export(uid$1);
			}(lib$1));

			var locales = {
			  en: {
			    pattern: "This field  does not match any pattern",
			    required: "This field is required",
			    number: "This field is not a number",
			    integer: "This field is not an integer number",
			    url: "This field is a invalid url",
			    email: "This field is not a email format",
			    ipv6: "This field is not a ipv6 format",
			    ipv4: "This field is not a ipv4 format",
			    idcard: "This field is not an idcard format",
			    taodomain: "This field is not a taobao domain format",
			    qq: "This field is not a qq number format",
			    phone: "This field is not a phone number format",
			    money: "This field is not a currency format",
			    zh: "This field is not a chinese string",
			    date: "This field is not a valid date format",
			    zip: "This field is not a zip format",
			    len: "The length or number of entries must be {{len}}",
			    min: "The length or number of entries must be at least {{min}}",
			    maximum: "The value cannot be greater than {{maximum}}",
			    exclusiveMaximum: "The value must be less than {{exclusiveMaximum}}",
			    minimum: "The value cannot be less than {{minimum}}",
			    exclusiveMinimum: "The value must be greater than {{exclusiveMinimum}}",
			    max: "The length or number of entries must be at most {{max}}",
			    whitespace: "This field cannot be blank string."
			  },
			  zh: {
			    pattern: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u4E00\u4E2A\u5408\u6CD5\u7684\u5B57\u6BB5",
			    required: "\u8BE5\u5B57\u6BB5\u662F\u5FC5\u586B\u5B57\u6BB5",
			    number: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u6570\u5B57",
			    integer: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u6574\u578B\u6570\u5B57",
			    url: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684url",
			    email: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u90AE\u7BB1\u683C\u5F0F",
			    ipv6: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684ipv6\u683C\u5F0F",
			    ipv4: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684ipv4\u683C\u5F0F",
			    idcard: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u8EAB\u4EFD\u8BC1\u683C\u5F0F",
			    taodomain: "\u8BE5\u5B57\u6BB5\u4E0D\u7B26\u5408\u6DD8\u7CFB\u57DF\u540D\u89C4\u5219",
			    qq: "\u8BE5\u5B57\u6BB5\u4E0D\u7B26\u5408QQ\u53F7\u683C\u5F0F",
			    phone: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u6709\u6548\u7684\u624B\u673A\u53F7",
			    money: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u6709\u6548\u8D27\u5E01\u683C\u5F0F",
			    zh: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u4E2D\u6587\u5B57\u7B26\u4E32",
			    date: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u65E5\u671F\u683C\u5F0F",
			    zip: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u90AE\u7F16\u683C\u5F0F",
			    len: "\u957F\u5EA6\u6216\u6761\u76EE\u6570\u5FC5\u987B\u4E3A{{len}}",
			    min: "\u957F\u5EA6\u6216\u6761\u76EE\u6570\u4E0D\u80FD\u5C0F\u4E8E{{min}}",
			    max: "\u957F\u5EA6\u6216\u6761\u76EE\u6570\u4E0D\u80FD\u5927\u4E8E{{max}}",
			    maximum: "\u6570\u503C\u4E0D\u80FD\u5927\u4E8E{{maximum}}",
			    exclusiveMaximum: "\u6570\u503C\u5FC5\u987B\u5C0F\u4E8E{{exclusiveMaximum}}",
			    minimum: "\u6570\u503C\u4E0D\u80FD\u5C0F\u4E8E{{minimum}}",
			    exclusiveMinimum: "\u6570\u503C\u5FC5\u987B\u5927\u4E8E{{exclusiveMinimum}}",
			    whitespace: "\u4E0D\u80FD\u4E3A\u7EAF\u7A7A\u767D\u5B57\u7B26\u4E32"
			  },
			  "en-US": {
			    pattern: "This field  does not match any pattern",
			    required: "This field is required",
			    number: "This field is not a number",
			    integer: "This field is not an integer number",
			    url: "This field is a invalid url",
			    email: "This field is not a email format",
			    ipv6: "This field is not a ipv6 format",
			    ipv4: "This field is not a ipv4 format",
			    idcard: "This field is not an idcard format",
			    taodomain: "This field is not a taobao domain format",
			    qq: "This field is not a qq number format",
			    phone: "This field is not a phone number format",
			    money: "This field is not a currency format",
			    zh: "This field is not a chinese string",
			    date: "This field is not a valid date format",
			    zip: "This field is not a zip format",
			    len: "The length or number of entries must be {{len}}",
			    min: "The length or number of entries must be at least {{min}}",
			    maximum: "The value cannot be greater than {{maximum}}",
			    exclusiveMaximum: "The value must be less than {{exclusiveMaximum}}",
			    minimum: "The value cannot be less than {{minimum}}",
			    exclusiveMinimum: "The value must be greater than {{exclusiveMinimum}}",
			    max: "The length or number of entries must be at most {{max}}",
			    whitespace: "This field cannot be blank string."
			  },
			  "zh-CN": {
			    pattern: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u4E00\u4E2A\u5408\u6CD5\u7684\u5B57\u6BB5",
			    required: "\u8BE5\u5B57\u6BB5\u662F\u5FC5\u586B\u5B57\u6BB5",
			    number: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u6570\u5B57",
			    integer: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u6574\u578B\u6570\u5B57",
			    url: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684url",
			    email: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u90AE\u7BB1\u683C\u5F0F",
			    ipv6: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684ipv6\u683C\u5F0F",
			    ipv4: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684ipv4\u683C\u5F0F",
			    idcard: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u8EAB\u4EFD\u8BC1\u683C\u5F0F",
			    taodomain: "\u8BE5\u5B57\u6BB5\u4E0D\u7B26\u5408\u6DD8\u7CFB\u57DF\u540D\u89C4\u5219",
			    qq: "\u8BE5\u5B57\u6BB5\u4E0D\u7B26\u5408QQ\u53F7\u683C\u5F0F",
			    phone: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u6709\u6548\u7684\u624B\u673A\u53F7",
			    money: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u6709\u6548\u8D27\u5E01\u683C\u5F0F",
			    zh: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u4E2D\u6587\u5B57\u7B26\u4E32",
			    date: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u65E5\u671F\u683C\u5F0F",
			    zip: "\u8BE5\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u90AE\u7F16\u683C\u5F0F",
			    len: "\u957F\u5EA6\u6216\u6761\u76EE\u6570\u5FC5\u987B\u4E3A{{len}}",
			    min: "\u957F\u5EA6\u6216\u6761\u76EE\u6570\u4E0D\u80FD\u5C0F\u4E8E{{min}}",
			    max: "\u957F\u5EA6\u6216\u6761\u76EE\u6570\u4E0D\u80FD\u5927\u4E8E{{max}}",
			    maximum: "\u6570\u503C\u4E0D\u80FD\u5927\u4E8E{{maximum}}",
			    exclusiveMaximum: "\u6570\u503C\u5FC5\u987B\u5C0F\u4E8E{{exclusiveMaximum}}",
			    minimum: "\u6570\u503C\u4E0D\u80FD\u5C0F\u4E8E{{minimum}}",
			    exclusiveMinimum: "\u6570\u503C\u5FC5\u987B\u5927\u4E8E{{exclusiveMinimum}}",
			    whitespace: "\u4E0D\u80FD\u4E3A\u7EAF\u7A7A\u767D\u5B57\u7B26\u4E32"
			  },
			  "zh-TW": {
			    pattern: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u4E00\u500B\u5408\u6CD5\u7684\u5B57\u6BB5",
			    required: "\u8A72\u5B57\u6BB5\u662F\u5FC5\u586B\u5B57\u6BB5",
			    number: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u6578\u5B57",
			    integer: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u6574\u578B\u6578\u5B57",
			    url: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684url",
			    email: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u90F5\u7BB1\u683C\u5F0F",
			    ipv6: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684ipv6\u683C\u5F0F",
			    ipv4: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684ipv4\u683C\u5F0F",
			    idcard: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u8EAB\u4EFD\u8B49\u683C\u5F0F",
			    taodomain: "\u8A72\u5B57\u6BB5\u4E0D\u7B26\u5408\u6DD8\u7CFB\u57DF\u540D\u898F\u5247",
			    qq: "\u8A72\u5B57\u6BB5\u4E0D\u7B26\u5408QQ\u865F\u683C\u5F0F",
			    phone: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u6709\u6548\u7684\u624B\u6A5F\u865F",
			    money: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u6709\u6548\u8CA8\u5E63\u683C\u5F0F",
			    zh: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u4E2D\u6587\u5B57\u7B26\u4E32",
			    date: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u65E5\u671F\u683C\u5F0F",
			    zip: "\u8A72\u5B57\u6BB5\u4E0D\u662F\u5408\u6CD5\u7684\u90F5\u7DE8\u683C\u5F0F",
			    len: "\u9577\u5EA6\u6216\u689D\u76EE\u6578\u5FC5\u9808\u70BA{{len}}",
			    min: "\u9577\u5EA6\u6216\u689D\u76EE\u6578\u4E0D\u80FD\u5C0F\u65BC{{min}}",
			    max: "\u9577\u5EA6\u6216\u689D\u76EE\u6578\u4E0D\u80FD\u5927\u65BC{{max}}",
			    maximum: "\u6578\u503C\u4E0D\u80FD\u5927\u65BC{{maximum}}",
			    exclusiveMaximum: "\u6578\u503C\u5FC5\u9808\u5C0F\u65BC{{exclusiveMaximum}}",
			    minimum: "\u6578\u503C\u4E0D\u80FD\u5C0F\u65BC{{minimum}}",
			    exclusiveMinimum: "\u6578\u503C\u5FC5\u9808\u5927\u65BC{{exclusiveMinimum}}",
			    whitespace: "\u4E0D\u80FD\u70BA\u7D14\u7A7A\u767D\u5B57\u7B26\u4E32"
			  },
			  ja: {
			    url: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u7121\u52B9\u306AURL\u3067\u3059",
			    whitespace: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u3092\u7A7A\u306E\u6587\u5B57\u5217\u306B\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			    zh: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u4E2D\u56FD\u8A9E\u306E\u6587\u5B57\u5217\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    zip: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306Fzip\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    date: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u6709\u52B9\u306A\u65E5\u4ED8\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    email: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u30E1\u30FC\u30EB\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    exclusiveMaximum: "\u5024\u306F{{exclusiveMaximum}}\u672A\u6E80\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059",
			    exclusiveMinimum: "\u5024\u306F{{exclusiveMinimum}}\u3088\u308A\u5927\u304D\u3044\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059",
			    idcard: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306FID\u30AB\u30FC\u30C9\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    integer: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u6574\u6570\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    ipv4: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306FIPv4\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    ipv6: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306FIPv6\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    len: "\u30A8\u30F3\u30C8\u30EA\u306E\u9577\u3055\u307E\u305F\u306F\u6570\u306F{{len}}\u3067\u306A\u3051\u308C\u3070\u306A\u308A\u307E\u305B\u3093",
			    max: "\u30A8\u30F3\u30C8\u30EA\u306E\u9577\u3055\u307E\u305F\u306F\u6570\u306F\u6700\u5927{{max}}\u3067\u306A\u3051\u308C\u3070\u306A\u308A\u307E\u305B\u3093",
			    maximum: "\u5024\u306F{{\u6700\u5927}}\u3092\u8D85\u3048\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093",
			    min: "\u30A8\u30F3\u30C8\u30EA\u306E\u9577\u3055\u307E\u305F\u306F\u6570\u306F\u3001\u5C11\u306A\u304F\u3068\u3082{{min}}\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059",
			    minimum: "\u5024\u306F{{minimum}}\u4EE5\u4E0A\u306B\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059",
			    money: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u901A\u8CA8\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    number: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u6570\u5024\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    pattern: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u3069\u306E\u30D1\u30BF\u30FC\u30F3\u3068\u3082\u4E00\u81F4\u3057\u307E\u305B\u3093",
			    phone: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u96FB\u8A71\u756A\u53F7\u306E\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    qq: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306Fqq\u6570\u5024\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093",
			    required: "\u3053\u306E\u9805\u76EE\u306F\u5FC5\u9808\u3067\u3059",
			    taodomain: "\u3053\u306E\u30D5\u30A3\u30FC\u30EB\u30C9\u306F\u6DD8\u5B9D\u7DB2\u30C9\u30E1\u30A4\u30F3\u5F62\u5F0F\u3067\u306F\u3042\u308A\u307E\u305B\u3093"
			  }
			};

			const getIn = lib$1.FormPath.getIn;
			const self$1 = lib$1.globalThisPolyfill;
			const getBrowserlanguage = () => {
			  if (!self$1.navigator) {
			    return "en";
			  }
			  return self$1.navigator.browserlanguage || self$1.navigator.language || "en";
			};
			const LOCALE = {
			  messages: {},
			  lang: getBrowserlanguage()
			};
			const getMatchLang = (lang) => {
			  let find = LOCALE.lang;
			  lib$1.each(LOCALE.messages, (messages, key) => {
			    if (key.indexOf(lang) > -1 || String(lang).indexOf(key) > -1) {
			      find = key;
			      return false;
			    }
			  });
			  return find;
			};
			const setValidationLocale = exports('setValidationLocale', (locale) => {
			  LOCALE.messages = lib$1.merge(LOCALE.messages, locale);
			});
			const setLocale = exports('setLocale', setValidationLocale);
			const setValidationLanguage = exports('setValidationLanguage', (lang) => {
			  LOCALE.lang = lang;
			});
			const setLanguage = exports('setLanguage', setValidationLanguage);
			const getMessage = exports('getMessage', (path) => {
			  const message = getIn(LOCALE.messages, `${getMatchLang(LOCALE.lang)}.${path}`);
			  if (!message) {
			    lib$1.log.error(`field is not valid,but not found ${path} error message. Please set the language pack first through setValidationLocale`);
			  }
			  return message || "Field is invalid";
			});
			setValidationLocale(locales);

			var defaultFormats = {
			  url: new RegExp("^(?:(?:(?:https?|ftp|rtmp):)?//)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:22[0-3]|2[01]\\d|[1-9]\\d?|1\\d\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1?\\d{1,2})){2}(?:\\.(?:25[0-4]|2[0-4]\\d|1\\d\\d|[1-9]\\d?))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:/\\S*)?$"),
			  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			  ipv6: /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
			  ipv4: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/,
			  number: /^[+-]?\d+(\.\d+)?$/,
			  integer: /^[+-]?\d+$/,
			  qq: /^(\+?[1-9]\d*|0)$/,
			  phone: /^\d{3}-\d{8}$|^\d{4}-\d{7}$|^\d{11}$/,
			  idcard: /^\d{15}$|^\d{17}(\d|x|X)$/,
			  taodomain: /^(https?\:)?(\/\/)?([a-zA-Z0-9\.\-]+\.)?(taobao|tmall|alitrip|yao\.95095)(\.daily)?\.(com|net|hk(\/hk)?)/,
			  money: /^([\u0024\u00A2\u00A3\u00A4\u20AC\u00A5\u20B1\20B9\uFFE5]\s*)(\d+,?)+\.?\d*\s*$/,
			  zh: /^[\u4e00-\u9fa5]+$/,
			  date: /^(?:(?:1[6-9]|[2-9][0-9])[0-9]{2}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:(?:1[6-9]|[2-9][0-9])(?:0[48]|[2468][048]|[13579][26])|(?:16|[2468][048]|[3579][26])00)([-/.]?)0?2\2(?:29))(\s+([01][0-9]:|2[0-3]:)?[0-5][0-9]:[0-5][0-9])?$/,
			  zip: /^[0-9]{6}$/
			};

			const isValidateEmpty = (value) => {
			  if (lib$1.isArr(value)) {
			    for (let i = 0; i < value.length; i++) {
			      if (lib$1.isValid(value[i]))
			        return false;
			    }
			    return true;
			  } else {
			    return lib$1.isEmpty(value);
			  }
			};
			const getLength = (value) => lib$1.isStr(value) ? lib$1.stringLength(value) : value ? value.length : 0;
			const intersection = (arr1, arr2) => {
			  return arr1.filter((key) => arr2.includes(key));
			};
			const getRuleMessage = (rule, type, rules) => {
			  const allRuleKeys = Object.keys(rules || {});
			  const currentRuleKeys = Object.keys(rule || {});
			  if (lib$1.isFn(rule.validator) || intersection(currentRuleKeys, allRuleKeys).length > 2) {
			    if (rule.format) {
			      return rule.message || getMessage(type);
			    }
			    return getMessage(type);
			  } else {
			    return rule.message || getMessage(type);
			  }
			};
			var defaultRules = {
			  required(value, rule, rules) {
			    if (rule.required === false)
			      return "";
			    return isValidateEmpty(value) ? getRuleMessage(rule, "required", rules) : "";
			  },
			  max(value, rule, rules) {
			    const length = getLength(value);
			    const max = Number(rule.max);
			    return length > max ? getRuleMessage(rule, "max", rules) : "";
			  },
			  maximum(value, rule, rules) {
			    return Number(value) > Number(rule.maximum) ? getRuleMessage(rule, "maximum", rules) : "";
			  },
			  exclusiveMaximum(value, rule, rules) {
			    return Number(value) >= Number(rule.exclusiveMaximum) ? getRuleMessage(rule, "exclusiveMaximum", rules) : "";
			  },
			  minimum(value, rule, rules) {
			    return Number(value) < Number(rule.minimum) ? getRuleMessage(rule, "minimum", rules) : "";
			  },
			  exclusiveMinimum(value, rule, rules) {
			    return Number(value) <= Number(rule.exclusiveMinimum) ? getRuleMessage(rule, "exclusiveMinimum", rules) : "";
			  },
			  len(value, rule, rules) {
			    const length = getLength(value);
			    const len = Number(rule.len);
			    return length !== len ? getRuleMessage(rule, "len", rules) : "";
			  },
			  min(value, rule, rules) {
			    const length = getLength(value);
			    const min = Number(rule.min);
			    return length < min ? getRuleMessage(rule, "min", rules) : "";
			  },
			  pattern(value, rule, rules) {
			    if (isValidateEmpty(value))
			      return "";
			    return !new RegExp(rule.pattern).test(value) ? getRuleMessage(rule, "pattern", rules) : "";
			  },
			  async validator(value, rule, rules) {
			    if (lib$1.isFn(rule.validator)) {
			      const response = await Promise.resolve(rule.validator(value, rule, rules));
			      if (lib$1.isBool(response)) {
			        return response ? rule.message : "";
			      } else {
			        return response;
			      }
			    }
			    throw new Error("The rule's validator property must be a function.");
			  },
			  whitespace(value, rule, rules) {
			    if (rule.whitespace) {
			      return /^\s+$/.test(value) ? getRuleMessage(rule, "whitespace", rules) : "";
			    }
			  },
			  enum(value, rule, rules) {
			    const enums = lib$1.toArr(rule.enum);
			    return enums.indexOf(value) === -1 ? getRuleMessage(rule, "enum", rules) : "";
			  }
			};

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
			const ValidatorRules = {};
			const ValidatorFormators = {};
			const template = (message, context) => {
			  if (lib$1.isStr(message)) {
			    if (lib$1.isFn(FormValidator.template)) {
			      return FormValidator.template(message, context);
			    }
			    return message.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, $0) => {
			      return lib$1.FormPath.getIn(context, $0);
			    });
			  } else if (lib$1.isObj(message) && !message["$$typeof"] && !message["_owner"]) {
			    return template(message.message, context);
			  } else {
			    return message;
			  }
			};
			const _FormValidator = class {
			  constructor(options = {}) {
			    this.validate = (path, options) => {
			      const pattern = lib$1.FormPath.getPath(path || "*");
			      return this.validateNodes(pattern, options);
			    };
			    this.register = (path, calculator) => {
			      const newPath = lib$1.FormPath.getPath(path);
			      this.nodes[newPath.toString()] = (options) => {
			        return new Promise((resolve, reject) => {
			          let tmpResult;
			          const validate = async (value, rules) => {
			            const data = __spreadProps(__spreadValues({}, options), {
			              key: newPath.toString()
			            });
			            return this.internalValidate(value, this.transformRules(rules), data).then((payload) => {
			              tmpResult = payload;
			              return payload;
			            }, (payload) => {
			              tmpResult = payload;
			              return Promise.reject(payload);
			            });
			          };
			          Promise.resolve(calculator(validate)).then(() => {
			            resolve(tmpResult);
			          }, () => {
			            reject(tmpResult);
			          });
			        });
			      };
			    };
			    this.unregister = (path) => {
			      const newPath = lib$1.FormPath.getPath(path);
			      delete this.nodes[newPath.toString()];
			    };
			    this.validateFirst = options.validateFirst;
			    this.matchStrategy = options.matchStrategy;
			    this.nodes = {};
			  }
			  transformRules(rules) {
			    if (lib$1.isStr(rules)) {
			      if (!ValidatorFormators[rules]) {
			        throw new Error("Can not found validator pattern");
			      }
			      return [
			        {
			          pattern: ValidatorFormators[rules],
			          message: getMessage(rules) || "Can not found validator message."
			        }
			      ];
			    } else if (lib$1.isFn(rules)) {
			      return [
			        {
			          validator: rules
			        }
			      ];
			    } else if (lib$1.isArr(rules)) {
			      return rules.reduce((buf, rule) => {
			        return buf.concat(this.transformRules(rule));
			      }, []);
			    } else if (lib$1.isObj(rules)) {
			      if (rules.format) {
			        if (!ValidatorFormators[rules.format]) {
			          throw new Error("Can not found validator pattern");
			        }
			        rules.pattern = ValidatorFormators[rules.format];
			        rules.message = rules.message || getMessage(rules.format);
			      }
			      return [rules];
			    }
			    return [];
			  }
			  async internalValidate(value, rules, options = {}) {
			    const first = lib$1.isValid(options.first) ? !!options.first : !!this.validateFirst;
			    const errors = [];
			    const warnings = [];
			    try {
			      for (let i = 0; i < rules.length; i++) {
			        const ruleObj = rules[i];
			        const keys = Object.keys(ruleObj).sort((key) => key === "validator" ? 1 : -1);
			        for (let l = 0; l < keys.length; l++) {
			          const key = keys[l];
			          if (ruleObj.hasOwnProperty(key) && lib$1.isValid(ruleObj[key])) {
			            const rule = ValidatorRules[key];
			            if (rule) {
			              const payload = await rule(value, ruleObj, ValidatorRules);
			              const message = template(payload, __spreadProps(__spreadValues({}, ruleObj), {
			                rule: ruleObj,
			                value
			              }));
			              if (lib$1.isStr(payload) || payload["$$typeof"] && payload["_owner"]) {
			                if (first) {
			                  if (message) {
			                    errors.push(message);
			                    throw new Error(message);
			                  }
			                }
			                if (message)
			                  errors.push(message);
			              } else if (lib$1.isObj(payload)) {
			                if (payload.type === "warning") {
			                  if (message)
			                    warnings.push(message);
			                } else {
			                  if (first) {
			                    if (message) {
			                      errors.push(message);
			                      throw new Error(message);
			                    }
			                  }
			                  if (message)
			                    errors.push(message);
			                }
			              }
			            }
			          }
			        }
			      }
			      return {
			        errors,
			        warnings
			      };
			    } catch (e) {
			      return {
			        errors,
			        warnings
			      };
			    }
			  }
			  async validateNodes(pattern, options) {
			    let errors = [];
			    let warnings = [];
			    try {
			      const nodeKey = pattern.toString();
			      const node = this.nodes[nodeKey];
			      const matchNodes = node ? { [nodeKey]: node } : this.nodes;
			      await Promise.all(lib$1.reduce(matchNodes, (buf, validator, path) => {
			        if (lib$1.isFn(this.matchStrategy) ? this.matchStrategy(pattern, path) : pattern.match(path)) {
			          return buf.concat(validator(options).then((result) => {
			            if (result.errors.length) {
			              errors = errors.concat({
			                path: path.toString(),
			                messages: result.errors
			              });
			            }
			            if (result.warnings.length) {
			              warnings = warnings.concat({
			                path: path.toString(),
			                messages: result.warnings
			              });
			            }
			          }));
			        }
			        return buf;
			      }, []));
			      return {
			        errors,
			        warnings
			      };
			    } catch (error) {
			      lib$1.log.error(error);
			      return {
			        errors,
			        warnings
			      };
			    }
			  }
			  static registerRules(rules) {
			    lib$1.each(rules, (rule, key) => {
			      if (lib$1.isFn(rule)) {
			        ValidatorRules[key] = rule;
			      }
			    });
			  }
			  static registerFormats(formats) {
			    lib$1.each(formats, (pattern, key) => {
			      if (lib$1.isStr(pattern) || pattern instanceof RegExp) {
			        ValidatorFormators[key] = new RegExp(pattern);
			      }
			    });
			  }
			};
			let FormValidator = exports('FormValidator', _FormValidator);
			FormValidator.registerMTEngine = (template2) => {
			  if (lib$1.isFn(template2)) {
			    _FormValidator.template = template2;
			  }
			};
			FormValidator.registerFormats(defaultFormats);
			FormValidator.registerRules(defaultRules);

		})
	};
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLjEuMy4xMy5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL0Bmb3JtaWx5L3NoYXJlZC9saWIvdHlwZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvQGZvcm1pbHkvc2hhcmVkL2xpYi9hcnJheS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL2luc3RhbmNlb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvQGZvcm1pbHkvc2hhcmVkL2xpYi9iaWctZGF0YS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL2NvbXBhcmUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGZvcm1pbHkvc2hhcmVkL2xpYi9jbG9uZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL2lzRW1wdHkuanMiLCIuLi9ub2RlX21vZHVsZXMvdXBwZXItY2FzZS91cHBlci1jYXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvd2VyLWNhc2UvbG93ZXItY2FzZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9uby1jYXNlL3ZlbmRvci9ub24td29yZC1yZWdleHAuanMiLCIuLi9ub2RlX21vZHVsZXMvbm8tY2FzZS92ZW5kb3IvY2FtZWwtY2FzZS1yZWdleHAuanMiLCIuLi9ub2RlX21vZHVsZXMvbm8tY2FzZS92ZW5kb3IvY2FtZWwtY2FzZS11cHBlci1yZWdleHAuanMiLCIuLi9ub2RlX21vZHVsZXMvbm8tY2FzZS9uby1jYXNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NhbWVsLWNhc2UvY2FtZWwtY2FzZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL2Nhc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvQGZvcm1pbHkvc2hhcmVkL2xpYi9zdHJpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi9jb250ZXh0cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb29sLXBhdGgvbGliL3Rva2Vucy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb29sLXBhdGgvbGliL3Rva2VuaXplci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb29sLXBhdGgvbGliL3R5cGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvdXRpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29vbC1wYXRoL2xpYi9kZXN0cnVjdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvcGFyc2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvbHJ1LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2Nvb2wtcGF0aC9saWIvbWF0Y2hlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb29sLXBhdGgvbGliL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0Bmb3JtaWx5L3NoYXJlZC9saWIvcGF0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL2RlcHJlY2F0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL3N1YnNjcmliYWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL21lcmdlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3NjaGVkdWxlci9janMvc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3NjaGVkdWxlci9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL3NjaGVkdWxlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZm9ybWlseS9zaGFyZWQvbGliL2RlZmF1bHRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0Bmb3JtaWx5L3NoYXJlZC9saWIvbG9nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0Bmb3JtaWx5L3NoYXJlZC9saWIvdWlkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0Bmb3JtaWx5L3NoYXJlZC9saWIvaW5kZXguanMiLCIuLi9zcmMvbG9jYWxlLnRzIiwiLi4vc3JjL21lc3NhZ2UudHMiLCIuLi9zcmMvZm9ybWF0cy50cyIsIi4uL3NyYy9ydWxlcy50cyIsIi4uL3NyYy92YWxpZGF0b3IudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgaXNUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHsgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiZcbiAgICAgICAgKEFycmF5LmlzQXJyYXkodHlwZSkgPyB0eXBlIDogW3R5cGVdKS5zb21lKGZ1bmN0aW9uICh0KSB7IHJldHVybiBleHBvcnRzLmdldFR5cGUob2JqKSA9PT0gXCJbb2JqZWN0IFwiICsgdCArIFwiXVwiOyB9KTtcbn07IH07XG5leHBvcnRzLmdldFR5cGUgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTsgfTtcbmV4cG9ydHMuaXNGbiA9IGlzVHlwZShbXG4gICAgJ0Z1bmN0aW9uJyxcbiAgICAnQXN5bmNGdW5jdGlvbicsXG4gICAgJ0dlbmVyYXRvckZ1bmN0aW9uJ1xuXSk7XG5leHBvcnRzLmlzQXJyID0gQXJyYXkuaXNBcnJheTtcbmV4cG9ydHMuaXNQbGFpbk9iaiA9IGlzVHlwZSgnT2JqZWN0Jyk7XG5leHBvcnRzLmlzU3RyID0gaXNUeXBlKCdTdHJpbmcnKTtcbmV4cG9ydHMuaXNCb29sID0gaXNUeXBlKCdCb29sZWFuJyk7XG5leHBvcnRzLmlzTnVtID0gaXNUeXBlKCdOdW1iZXInKTtcbmV4cG9ydHMuaXNPYmogPSBmdW5jdGlvbiAodmFsKSB7IHJldHVybiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JzsgfTtcbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1R5cGUoJ1JlZ0V4cCcpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuZXhwb3J0cy50b0FyciA9IGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuICh0eXBlc18xLmlzQXJyKHZhbCkgPyB2YWwgOiB2YWwgPyBbdmFsXSA6IFtdKTsgfTtcbmZ1bmN0aW9uIGVhY2godmFsLCBpdGVyYXRvciwgcmV2ZXJ0KSB7XG4gICAgaWYgKHR5cGVzXzEuaXNBcnIodmFsKSB8fCB0eXBlc18xLmlzU3RyKHZhbCkpIHtcbiAgICAgICAgaWYgKHJldmVydCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHZhbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVyYXRvcih2YWxbaV0sIGkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlcmF0b3IodmFsW2ldLCBpKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlc18xLmlzT2JqKHZhbCkpIHtcbiAgICAgICAgdmFyIGtleSA9IHZvaWQgMDtcbiAgICAgICAgZm9yIChrZXkgaW4gdmFsKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodmFsLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhdG9yKHZhbFtrZXldLCBrZXkpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5lYWNoID0gZWFjaDtcbmZ1bmN0aW9uIG1hcCh2YWwsIGl0ZXJhdG9yLCByZXZlcnQpIHtcbiAgICB2YXIgcmVzID0gdHlwZXNfMS5pc0Fycih2YWwpIHx8IHR5cGVzXzEuaXNTdHIodmFsKSA/IFtdIDoge307XG4gICAgZWFjaCh2YWwsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaXRlcmF0b3IoaXRlbSwga2V5KTtcbiAgICAgICAgaWYgKHR5cGVzXzEuaXNBcnIocmVzKSkge1xuICAgICAgICAgICAgO1xuICAgICAgICAgICAgcmVzLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sIHJldmVydCk7XG4gICAgcmV0dXJuIHJlcztcbn1cbmV4cG9ydHMubWFwID0gbWFwO1xuZnVuY3Rpb24gcmVkdWNlKHZhbCwgaXRlcmF0b3IsIGFjY3VtdWxhdG9yLCByZXZlcnQpIHtcbiAgICB2YXIgcmVzdWx0ID0gYWNjdW11bGF0b3I7XG4gICAgZWFjaCh2YWwsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IocmVzdWx0LCBpdGVtLCBrZXkpO1xuICAgIH0sIHJldmVydCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMucmVkdWNlID0gcmVkdWNlO1xuZnVuY3Rpb24gZXZlcnkodmFsLCBpdGVyYXRvciwgcmV2ZXJ0KSB7XG4gICAgdmFyIHJlcyA9IHRydWU7XG4gICAgZWFjaCh2YWwsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgICAgICAgaWYgKCFpdGVyYXRvcihpdGVtLCBrZXkpKSB7XG4gICAgICAgICAgICByZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sIHJldmVydCk7XG4gICAgcmV0dXJuIHJlcztcbn1cbmV4cG9ydHMuZXZlcnkgPSBldmVyeTtcbmZ1bmN0aW9uIHNvbWUodmFsLCBpdGVyYXRvciwgcmV2ZXJ0KSB7XG4gICAgdmFyIHJlcyA9IGZhbHNlO1xuICAgIGVhY2godmFsLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gICAgICAgIGlmIChpdGVyYXRvcihpdGVtLCBrZXkpKSB7XG4gICAgICAgICAgICByZXMgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSwgcmV2ZXJ0KTtcbiAgICByZXR1cm4gcmVzO1xufVxuZXhwb3J0cy5zb21lID0gc29tZTtcbmZ1bmN0aW9uIGZpbmRJbmRleCh2YWwsIGl0ZXJhdG9yLCByZXZlcnQpIHtcbiAgICB2YXIgcmVzID0gLTE7XG4gICAgZWFjaCh2YWwsIGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yKGl0ZW0sIGtleSkpIHtcbiAgICAgICAgICAgIHJlcyA9IGtleTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sIHJldmVydCk7XG4gICAgcmV0dXJuIHJlcztcbn1cbmV4cG9ydHMuZmluZEluZGV4ID0gZmluZEluZGV4O1xuZnVuY3Rpb24gZmluZCh2YWwsIGl0ZXJhdG9yLCByZXZlcnQpIHtcbiAgICB2YXIgcmVzO1xuICAgIGVhY2godmFsLCBmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gICAgICAgIGlmIChpdGVyYXRvcihpdGVtLCBrZXkpKSB7XG4gICAgICAgICAgICByZXMgPSBpdGVtO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSwgcmV2ZXJ0KTtcbiAgICByZXR1cm4gcmVzO1xufVxuZXhwb3J0cy5maW5kID0gZmluZDtcbmZ1bmN0aW9uIGluY2x1ZGVzKHZhbCwgc2VhcmNoRWxlbWVudCwgcmV2ZXJ0KSB7XG4gICAgaWYgKHR5cGVzXzEuaXNTdHIodmFsKSlcbiAgICAgICAgcmV0dXJuIHZhbC5pbmNsdWRlcyhzZWFyY2hFbGVtZW50KTtcbiAgICByZXR1cm4gc29tZSh2YWwsIGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtID09PSBzZWFyY2hFbGVtZW50OyB9LCByZXZlcnQpO1xufVxuZXhwb3J0cy5pbmNsdWRlcyA9IGluY2x1ZGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBnbG9iYWxTZWxmKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7IH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3c7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGUpIHsgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkgeyB9XG4gICAgcmV0dXJuIEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG59XG5leHBvcnRzLmdsb2JhbFRoaXNQb2x5ZmlsbCA9IGdsb2JhbFNlbGYoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGdsb2JhbF8xID0gcmVxdWlyZShcIi4vZ2xvYmFsXCIpO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbmV4cG9ydHMuaW5zdE9mID0gZnVuY3Rpb24gKHZhbHVlLCBjbHMpIHtcbiAgICBpZiAodHlwZXNfMS5pc0ZuKGNscykpXG4gICAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIGNscztcbiAgICBpZiAodHlwZXNfMS5pc1N0cihjbHMpKVxuICAgICAgICByZXR1cm4gZ2xvYmFsXzEuZ2xvYmFsVGhpc1BvbHlmaWxsW2Nsc11cbiAgICAgICAgICAgID8gdmFsdWUgaW5zdGFuY2VvZiBnbG9iYWxfMS5nbG9iYWxUaGlzUG9seWZpbGxbY2xzXVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbnZhciBCSUdfREFUQV9GTEFHID0gU3ltYm9sKCdfX0JJR19EQVRBX18nKTtcbnZhciBCaWdEYXRhID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBCaWdEYXRhKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gX19hc3NpZ24oe30sIG9wdGlvbnMpO1xuICAgIH1cbiAgICBCaWdEYXRhLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoIWRhdGFbQklHX0RBVEFfRkxBR10pIHtcbiAgICAgICAgICAgICAgICBkYXRhW0JJR19EQVRBX0ZMQUddID0gdGhpcy5vcHRpb25zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH07XG4gICAgQmlnRGF0YS5pc0JpZ0RhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YSAmJiAhIWRhdGFbQklHX0RBVEFfRkxBR107XG4gICAgfTtcbiAgICBCaWdEYXRhLmNvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBpZiAoQmlnRGF0YS5pc0JpZ0RhdGEoYSkgJiYgQmlnRGF0YS5pc0JpZ0RhdGEoYikpIHtcbiAgICAgICAgICAgIGlmIChhW0JJR19EQVRBX0ZMQUddID09PSBiW0JJR19EQVRBX0ZMQUddKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVzXzEuaXNGbihhW0JJR19EQVRBX0ZMQUddLmNvbXBhcmUpXG4gICAgICAgICAgICAgICAgICAgID8gYVtCSUdfREFUQV9GTEFHXS5jb21wYXJlKGEsIGIpXG4gICAgICAgICAgICAgICAgICAgIDogYSA9PT0gYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICB9O1xuICAgIEJpZ0RhdGEuY2xvbmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKEJpZ0RhdGEuaXNCaWdEYXRhKHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVzXzEuaXNGbih2YWx1ZVtCSUdfREFUQV9GTEFHXS5jbG9uZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3R4ID0gdmFsdWVbQklHX0RBVEFfRkxBR107XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlW0JJR19EQVRBX0ZMQUddLmNsb25lKHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXN1bHRbQklHX0RBVEFfRkxBR10gPSBjdHg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICByZXR1cm4gQmlnRGF0YTtcbn0oKSk7XG5leHBvcnRzLkJpZ0RhdGEgPSBCaWdEYXRhO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xudmFyIGluc3RhbmNlb2ZfMSA9IHJlcXVpcmUoXCIuL2luc3RhbmNlb2ZcIik7XG52YXIgYmlnX2RhdGFfMSA9IHJlcXVpcmUoXCIuL2JpZy1kYXRhXCIpO1xudmFyIGlzQXJyYXkgPSB0eXBlc18xLmlzQXJyO1xudmFyIGtleUxpc3QgPSBPYmplY3Qua2V5cztcbnZhciBoYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGVxdWFsKGEsIGIsIGNvbXBhcmVGdW5jdGlvblN0cmluZykge1xuICAgIGlmIChjb21wYXJlRnVuY3Rpb25TdHJpbmcgPT09IHZvaWQgMCkgeyBjb21wYXJlRnVuY3Rpb25TdHJpbmcgPSBmYWxzZTsgfVxuICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoYSAmJiBiICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgYiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFyIGJpZ0RhdGFBID0gYmlnX2RhdGFfMS5CaWdEYXRhLmlzQmlnRGF0YShhKTtcbiAgICAgICAgdmFyIGJpZ0RhdGFCID0gYmlnX2RhdGFfMS5CaWdEYXRhLmlzQmlnRGF0YShiKTtcbiAgICAgICAgaWYgKGJpZ0RhdGFBICE9PSBiaWdEYXRhQikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiaWdEYXRhQSAmJiBiaWdEYXRhQikge1xuICAgICAgICAgICAgcmV0dXJuIGJpZ19kYXRhXzEuQmlnRGF0YS5jb21wYXJlKGEsIGIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhcnJBID0gaXNBcnJheShhKTtcbiAgICAgICAgdmFyIGFyckIgPSBpc0FycmF5KGIpO1xuICAgICAgICB2YXIgaSA9IHZvaWQgMDtcbiAgICAgICAgdmFyIGxlbmd0aF8xO1xuICAgICAgICB2YXIga2V5ID0gdm9pZCAwO1xuICAgICAgICBpZiAoYXJyQSAmJiBhcnJCKSB7XG4gICAgICAgICAgICBsZW5ndGhfMSA9IGEubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbmd0aF8xICE9PSBiLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IGxlbmd0aF8xOyBpLS0gIT09IDA7KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcXVhbChhW2ldLCBiW2ldLCBjb21wYXJlRnVuY3Rpb25TdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJyQSAhPT0gYXJyQikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtb21lbnRBID0gYSAmJiBhLl9pc0FNb21lbnRPYmplY3Q7XG4gICAgICAgIHZhciBtb21lbnRCID0gYiAmJiBiLl9pc0FNb21lbnRPYmplY3Q7XG4gICAgICAgIGlmIChtb21lbnRBICE9PSBtb21lbnRCKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAobW9tZW50QSAmJiBtb21lbnRCKVxuICAgICAgICAgICAgcmV0dXJuIGEuaXNTYW1lKGIpO1xuICAgICAgICB2YXIgaW1tdXRhYmxlQSA9IGEgJiYgYS50b0pTO1xuICAgICAgICB2YXIgaW1tdXRhYmxlQiA9IGIgJiYgYi50b0pTO1xuICAgICAgICBpZiAoaW1tdXRhYmxlQSAhPT0gaW1tdXRhYmxlQilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGltbXV0YWJsZUEpXG4gICAgICAgICAgICByZXR1cm4gYS5pcyA/IGEuaXMoYikgOiBhID09PSBiO1xuICAgICAgICB2YXIgZGF0ZUEgPSBpbnN0YW5jZW9mXzEuaW5zdE9mKGEsICdEYXRlJyk7XG4gICAgICAgIHZhciBkYXRlQiA9IGluc3RhbmNlb2ZfMS5pbnN0T2YoYiwgJ0RhdGUnKTtcbiAgICAgICAgaWYgKGRhdGVBICE9PSBkYXRlQikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRlQSAmJiBkYXRlQikge1xuICAgICAgICAgICAgcmV0dXJuIGEuZ2V0VGltZSgpID09PSBiLmdldFRpbWUoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2NoZW1hQSA9IGEgJiYgYS50b0pTT047XG4gICAgICAgIHZhciBzY2hlbWFCID0gYiAmJiBiLnRvSlNPTjtcbiAgICAgICAgaWYgKHNjaGVtYUEgIT09IHNjaGVtYUIpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChzY2hlbWFBICYmIHNjaGVtYUIpXG4gICAgICAgICAgICByZXR1cm4gZXF1YWwoYS50b0pTT04oKSwgYi50b0pTT04oKSwgY29tcGFyZUZ1bmN0aW9uU3RyaW5nKTtcbiAgICAgICAgdmFyIHJlZ2V4cEEgPSBpbnN0YW5jZW9mXzEuaW5zdE9mKGEsICdSZWdFeHAnKTtcbiAgICAgICAgdmFyIHJlZ2V4cEIgPSBpbnN0YW5jZW9mXzEuaW5zdE9mKGIsICdSZWdFeHAnKTtcbiAgICAgICAgaWYgKHJlZ2V4cEEgIT09IHJlZ2V4cEIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVnZXhwQSAmJiByZWdleHBCKSB7XG4gICAgICAgICAgICByZXR1cm4gYS50b1N0cmluZygpID09PSBiLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVybEEgPSBpbnN0YW5jZW9mXzEuaW5zdE9mKGEsICdVUkwnKTtcbiAgICAgICAgdmFyIHVybEIgPSBpbnN0YW5jZW9mXzEuaW5zdE9mKGIsICdVUkwnKTtcbiAgICAgICAgaWYgKHVybEEgJiYgdXJsQikge1xuICAgICAgICAgICAgcmV0dXJuIGEuaHJlZiA9PT0gYi5ocmVmO1xuICAgICAgICB9XG4gICAgICAgIHZhciBrZXlzID0ga2V5TGlzdChhKTtcbiAgICAgICAgbGVuZ3RoXzEgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbmd0aF8xICE9PSBrZXlMaXN0KGIpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IGxlbmd0aF8xOyBpLS0gIT09IDA7KSB7XG4gICAgICAgICAgICBpZiAoIWhhc1Byb3AuY2FsbChiLCBrZXlzW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSBsZW5ndGhfMTsgaS0tICE9PSAwOykge1xuICAgICAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdfb3duZXInICYmIGEuJCR0eXBlb2YpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghZXF1YWwoYVtrZXldLCBiW2tleV0sIGNvbXBhcmVGdW5jdGlvblN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVGdW5jdGlvblN0cmluZykge1xuICAgICAgICBpZiAoYSAmJiBiICYmIHR5cGVvZiBhID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gYS50b1N0cmluZygpID09PSBiLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGEgIT09IGEgJiYgYiAhPT0gYjtcbn1cbmV4cG9ydHMuaXNFcXVhbCA9IGZ1bmN0aW9uIGV4cG9ydGVkRXF1YWwoYSwgYiwgY29tcGFyZUZ1bmN0aW9uU3RyaW5nKSB7XG4gICAgaWYgKGNvbXBhcmVGdW5jdGlvblN0cmluZyA9PT0gdm9pZCAwKSB7IGNvbXBhcmVGdW5jdGlvblN0cmluZyA9IGZhbHNlOyB9XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGVxdWFsKGEsIGIsIGNvbXBhcmVGdW5jdGlvblN0cmluZyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoKGVycm9yLm1lc3NhZ2UgJiYgZXJyb3IubWVzc2FnZS5tYXRjaCgvc3RhY2t8cmVjdXJzaW9uL2kpKSB8fFxuICAgICAgICAgICAgZXJyb3IubnVtYmVyID09PSAtMjE0NjgyODI2MCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiByZWFjdC1mYXN0LWNvbXBhcmUgZG9lcyBub3QgaGFuZGxlIGNpcmN1bGFyIHJlZmVyZW5jZXMuJywgZXJyb3IubmFtZSwgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG52YXIgaW5zdGFuY2VvZl8xID0gcmVxdWlyZShcIi4vaW5zdGFuY2VvZlwiKTtcbnZhciBiaWdfZGF0YV8xID0gcmVxdWlyZShcIi4vYmlnLWRhdGFcIik7XG52YXIgTkFUSVZFX0tFWVMgPSBbXG4gICAgWydNYXAnLCBmdW5jdGlvbiAobWFwKSB7IHJldHVybiBuZXcgTWFwKG1hcCk7IH1dLFxuICAgIFsnV2Vha01hcCcsIGZ1bmN0aW9uIChtYXApIHsgcmV0dXJuIG5ldyBXZWFrTWFwKG1hcCk7IH1dLFxuICAgIFsnV2Vha1NldCcsIGZ1bmN0aW9uIChzZXQpIHsgcmV0dXJuIG5ldyBXZWFrU2V0KHNldCk7IH1dLFxuICAgIFsnU2V0JywgZnVuY3Rpb24gKHNldCkgeyByZXR1cm4gbmV3IFNldChzZXQpOyB9XSxcbiAgICBbJ0RhdGUnLCBmdW5jdGlvbiAoZGF0ZSkgeyByZXR1cm4gbmV3IERhdGUoZGF0ZSk7IH1dLFxuICAgICdGaWxlTGlzdCcsXG4gICAgJ0ZpbGUnLFxuICAgICdVUkwnLFxuICAgICdSZWdFeHAnLFxuICAgIFtcbiAgICAgICAgJ1Byb21pc2UnLFxuICAgICAgICBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgcmV0dXJuIHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpOyB9KTtcbiAgICAgICAgfVxuICAgIF1cbl07XG52YXIgaXNOYXRpdmVPYmplY3QgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBOQVRJVkVfS0VZUy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IE5BVElWRV9LRVlTW2ldO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSAmJiBpdGVtWzBdKSB7XG4gICAgICAgICAgICBpZiAoaW5zdGFuY2VvZl8xLmluc3RPZih2YWx1ZXMsIGl0ZW1bMF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1bMV0gPyBpdGVtWzFdIDogaXRlbVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChpbnN0YW5jZW9mXzEuaW5zdE9mKHZhbHVlcywgaXRlbSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnRzLnNoYWxsb3dDbG9uZSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICB2YXIgbmF0aXZlQ2xvbmU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzLnNsaWNlKDApO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc05hdGl2ZU9iamVjdCh2YWx1ZXMpKSB7XG4gICAgICAgIG5hdGl2ZUNsb25lID0gaXNOYXRpdmVPYmplY3QodmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIHR5cGVzXzEuaXNGbihuYXRpdmVDbG9uZSkgPyBuYXRpdmVDbG9uZSh2YWx1ZXMpIDogdmFsdWVzO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWVzID09PSAnb2JqZWN0JyAmJiAhIXZhbHVlcykge1xuICAgICAgICByZXR1cm4gX19hc3NpZ24oe30sIHZhbHVlcyk7XG4gICAgfVxufTtcbmV4cG9ydHMuY2xvbmUgPSBmdW5jdGlvbiAodmFsdWVzLCBmaWx0ZXIpIHtcbiAgICB2YXIgbmF0aXZlQ2xvbmU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWVzKSkge1xuICAgICAgICByZXR1cm4gdmFsdWVzLm1hcChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gZXhwb3J0cy5jbG9uZShpdGVtLCBmaWx0ZXIpOyB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNOYXRpdmVPYmplY3QodmFsdWVzKSkge1xuICAgICAgICBuYXRpdmVDbG9uZSA9IGlzTmF0aXZlT2JqZWN0KHZhbHVlcyk7XG4gICAgICAgIHJldHVybiB0eXBlc18xLmlzRm4obmF0aXZlQ2xvbmUpID8gbmF0aXZlQ2xvbmUodmFsdWVzKSA6IHZhbHVlcztcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlcyA9PT0gJ29iamVjdCcgJiYgISF2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCckJHR5cGVvZicgaW4gdmFsdWVzICYmICdfb3duZXInIGluIHZhbHVlcykge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWVzLl9pc0FNb21lbnRPYmplY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlcy5faXNKU09OU2NoZW1hT2JqZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiaWdfZGF0YV8xLkJpZ0RhdGEuaXNCaWdEYXRhKHZhbHVlcykpIHtcbiAgICAgICAgICAgIHJldHVybiBiaWdfZGF0YV8xLkJpZ0RhdGEuY2xvbmUodmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZXNfMS5pc0ZuKHZhbHVlcy50b0pTKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZXNfMS5pc0ZuKHZhbHVlcy50b0pTT04pKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHZhbHVlcyB8fCB7fSkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXMgPSB7fTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbHVlcykge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlcywga2V5KSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlc18xLmlzRm4oZmlsdGVyKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyKHZhbHVlc1trZXldLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNba2V5XSA9IGV4cG9ydHMuY2xvbmUodmFsdWVzW2tleV0sIGZpbHRlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNba2V5XSA9IHZhbHVlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNba2V5XSA9IGV4cG9ydHMuY2xvbmUodmFsdWVzW2tleV0sIGZpbHRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBpbnN0YW5jZW9mXzEgPSByZXF1aXJlKFwiLi9pbnN0YW5jZW9mXCIpO1xudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuZXhwb3J0cy5pc1ZhbGlkID0gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsICE9PSB1bmRlZmluZWQgJiYgdmFsICE9PSBudWxsOyB9O1xuZnVuY3Rpb24gaXNFbXB0eSh2YWwpIHtcbiAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHZhbC5sZW5ndGggPT09IDA7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB2YWwubGVuZ3RoID09PSAwO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHZhbFtpXSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgdmFsW2ldICE9PSBudWxsICYmXG4gICAgICAgICAgICAgICAgdmFsW2ldICE9PSAnJyAmJlxuICAgICAgICAgICAgICAgIHZhbFtpXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGluc3RhbmNlb2ZfMS5pbnN0T2YodmFsLCAnRXJyb3InKSkge1xuICAgICAgICByZXR1cm4gdmFsLm1lc3NhZ2UgPT09ICcnO1xuICAgIH1cbiAgICBpZiAodmFsLnRvU3RyaW5nID09PSB0b1N0cmluZykge1xuICAgICAgICBzd2l0Y2ggKHZhbC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICBjYXNlICdbb2JqZWN0IEZpbGVdJzpcbiAgICAgICAgICAgIGNhc2UgJ1tvYmplY3QgTWFwXSc6XG4gICAgICAgICAgICBjYXNlICdbb2JqZWN0IFNldF0nOiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5zaXplID09PSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnW29iamVjdCBPYmplY3RdJzoge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhcy5jYWxsKHZhbCwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydHMuaXNFbXB0eSA9IGlzRW1wdHk7XG4iLCIvKipcbiAqIFNwZWNpYWwgbGFuZ3VhZ2Utc3BlY2lmaWMgb3ZlcnJpZGVzLlxuICpcbiAqIFNvdXJjZTogZnRwOi8vZnRwLnVuaWNvZGUub3JnL1B1YmxpYy9VQ0QvbGF0ZXN0L3VjZC9TcGVjaWFsQ2FzaW5nLnR4dFxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBMQU5HVUFHRVMgPSB7XG4gIHRyOiB7XG4gICAgcmVnZXhwOiAvW1xcdTAwNjldL2csXG4gICAgbWFwOiB7XG4gICAgICAnXFx1MDA2OSc6ICdcXHUwMTMwJ1xuICAgIH1cbiAgfSxcbiAgYXo6IHtcbiAgICByZWdleHA6IC9bXFx1MDA2OV0vZyxcbiAgICBtYXA6IHtcbiAgICAgICdcXHUwMDY5JzogJ1xcdTAxMzAnXG4gICAgfVxuICB9LFxuICBsdDoge1xuICAgIHJlZ2V4cDogL1tcXHUwMDY5XFx1MDA2QVxcdTAxMkZdXFx1MDMwN3xcXHUwMDY5XFx1MDMwN1tcXHUwMzAwXFx1MDMwMVxcdTAzMDNdL2csXG4gICAgbWFwOiB7XG4gICAgICAnXFx1MDA2OVxcdTAzMDcnOiAnXFx1MDA0OScsXG4gICAgICAnXFx1MDA2QVxcdTAzMDcnOiAnXFx1MDA0QScsXG4gICAgICAnXFx1MDEyRlxcdTAzMDcnOiAnXFx1MDEyRScsXG4gICAgICAnXFx1MDA2OVxcdTAzMDdcXHUwMzAwJzogJ1xcdTAwQ0MnLFxuICAgICAgJ1xcdTAwNjlcXHUwMzA3XFx1MDMwMSc6ICdcXHUwMENEJyxcbiAgICAgICdcXHUwMDY5XFx1MDMwN1xcdTAzMDMnOiAnXFx1MDEyOCdcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBVcHBlciBjYXNlIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0ciwgbG9jYWxlKSB7XG4gIHZhciBsYW5nID0gTEFOR1VBR0VTW2xvY2FsZV1cblxuICBzdHIgPSBzdHIgPT0gbnVsbCA/ICcnIDogU3RyaW5nKHN0cilcblxuICBpZiAobGFuZykge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKGxhbmcucmVnZXhwLCBmdW5jdGlvbiAobSkgeyByZXR1cm4gbGFuZy5tYXBbbV0gfSlcbiAgfVxuXG4gIHJldHVybiBzdHIudG9VcHBlckNhc2UoKVxufVxuIiwiLyoqXG4gKiBTcGVjaWFsIGxhbmd1YWdlLXNwZWNpZmljIG92ZXJyaWRlcy5cbiAqXG4gKiBTb3VyY2U6IGZ0cDovL2Z0cC51bmljb2RlLm9yZy9QdWJsaWMvVUNEL2xhdGVzdC91Y2QvU3BlY2lhbENhc2luZy50eHRcbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgTEFOR1VBR0VTID0ge1xuICB0cjoge1xuICAgIHJlZ2V4cDogL1xcdTAxMzB8XFx1MDA0OXxcXHUwMDQ5XFx1MDMwNy9nLFxuICAgIG1hcDoge1xuICAgICAgJ1xcdTAxMzAnOiAnXFx1MDA2OScsXG4gICAgICAnXFx1MDA0OSc6ICdcXHUwMTMxJyxcbiAgICAgICdcXHUwMDQ5XFx1MDMwNyc6ICdcXHUwMDY5J1xuICAgIH1cbiAgfSxcbiAgYXo6IHtcbiAgICByZWdleHA6IC9bXFx1MDEzMF0vZyxcbiAgICBtYXA6IHtcbiAgICAgICdcXHUwMTMwJzogJ1xcdTAwNjknLFxuICAgICAgJ1xcdTAwNDknOiAnXFx1MDEzMScsXG4gICAgICAnXFx1MDA0OVxcdTAzMDcnOiAnXFx1MDA2OSdcbiAgICB9XG4gIH0sXG4gIGx0OiB7XG4gICAgcmVnZXhwOiAvW1xcdTAwNDlcXHUwMDRBXFx1MDEyRVxcdTAwQ0NcXHUwMENEXFx1MDEyOF0vZyxcbiAgICBtYXA6IHtcbiAgICAgICdcXHUwMDQ5JzogJ1xcdTAwNjlcXHUwMzA3JyxcbiAgICAgICdcXHUwMDRBJzogJ1xcdTAwNkFcXHUwMzA3JyxcbiAgICAgICdcXHUwMTJFJzogJ1xcdTAxMkZcXHUwMzA3JyxcbiAgICAgICdcXHUwMENDJzogJ1xcdTAwNjlcXHUwMzA3XFx1MDMwMCcsXG4gICAgICAnXFx1MDBDRCc6ICdcXHUwMDY5XFx1MDMwN1xcdTAzMDEnLFxuICAgICAgJ1xcdTAxMjgnOiAnXFx1MDA2OVxcdTAzMDdcXHUwMzAzJ1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIExvd2VyY2FzZSBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHIsIGxvY2FsZSkge1xuICB2YXIgbGFuZyA9IExBTkdVQUdFU1tsb2NhbGVdXG5cbiAgc3RyID0gc3RyID09IG51bGwgPyAnJyA6IFN0cmluZyhzdHIpXG5cbiAgaWYgKGxhbmcpIHtcbiAgICBzdHIgPSBzdHIucmVwbGFjZShsYW5nLnJlZ2V4cCwgZnVuY3Rpb24gKG0pIHsgcmV0dXJuIGxhbmcubWFwW21dIH0pXG4gIH1cblxuICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKClcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gL1teQS1aYS16XFx4QUFcXHhCNVxceEJBXFx4QzAtXFx4RDZcXHhEOC1cXHhGNlxceEY4LVxcdTAyQzFcXHUwMkM2LVxcdTAyRDFcXHUwMkUwLVxcdTAyRTRcXHUwMkVDXFx1MDJFRVxcdTAzNzAtXFx1MDM3NFxcdTAzNzZcXHUwMzc3XFx1MDM3QS1cXHUwMzdEXFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RS1cXHUwM0ExXFx1MDNBMy1cXHUwM0Y1XFx1MDNGNy1cXHUwNDgxXFx1MDQ4QS1cXHUwNTJGXFx1MDUzMS1cXHUwNTU2XFx1MDU1OVxcdTA1NjEtXFx1MDU4N1xcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGMlxcdTA2MjAtXFx1MDY0QVxcdTA2NkVcXHUwNjZGXFx1MDY3MS1cXHUwNkQzXFx1MDZENVxcdTA2RTVcXHUwNkU2XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0NBLVxcdTA3RUFcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODAwLVxcdTA4MTVcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwODQwLVxcdTA4NThcXHUwOEEwLVxcdTA4QjRcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzEtXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI3MVxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJEMFxcdTBDMDUtXFx1MEMwQ1xcdTBDMEUtXFx1MEMxMFxcdTBDMTItXFx1MEMyOFxcdTBDMkEtXFx1MEMzOVxcdTBDM0RcXHUwQzU4LVxcdTBDNUFcXHUwQzYwXFx1MEM2MVxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0YxXFx1MENGMlxcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ1Ri1cXHUwRDYxXFx1MEQ3QS1cXHUwRDdGXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBFMDEtXFx1MEUzMFxcdTBFMzJcXHUwRTMzXFx1MEU0MC1cXHUwRTQ2XFx1MEU4MVxcdTBFODJcXHUwRTg0XFx1MEU4N1xcdTBFODhcXHUwRThBXFx1MEU4RFxcdTBFOTQtXFx1MEU5N1xcdTBFOTktXFx1MEU5RlxcdTBFQTEtXFx1MEVBM1xcdTBFQTVcXHUwRUE3XFx1MEVBQVxcdTBFQUJcXHUwRUFELVxcdTBFQjBcXHUwRUIyXFx1MEVCM1xcdTBFQkRcXHUwRUMwLVxcdTBFQzRcXHUwRUM2XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGNDAtXFx1MEY0N1xcdTBGNDktXFx1MEY2Q1xcdTBGODgtXFx1MEY4Q1xcdTEwMDAtXFx1MTAyQVxcdTEwM0ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxMEQwLVxcdTEwRkFcXHUxMEZDLVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzODAtXFx1MTM4RlxcdTEzQTAtXFx1MTNGNVxcdTEzRjgtXFx1MTNGRFxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE2RjEtXFx1MTZGOFxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3ODAtXFx1MTdCM1xcdTE3RDdcXHUxN0RDXFx1MTgyMC1cXHUxODc3XFx1MTg4MC1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5NTAtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFBQTdcXHUxQjA1LVxcdTFCMzNcXHUxQjQ1LVxcdTFCNEJcXHUxQjgzLVxcdTFCQTBcXHUxQkFFXFx1MUJBRlxcdTFCQkEtXFx1MUJFNVxcdTFDMDAtXFx1MUMyM1xcdTFDNEQtXFx1MUM0RlxcdTFDNUEtXFx1MUM3RFxcdTFDRTktXFx1MUNFQ1xcdTFDRUUtXFx1MUNGMVxcdTFDRjVcXHUxQ0Y2XFx1MUQwMC1cXHUxREJGXFx1MUUwMC1cXHUxRjE1XFx1MUYxOC1cXHUxRjFEXFx1MUYyMC1cXHUxRjQ1XFx1MUY0OC1cXHUxRjREXFx1MUY1MC1cXHUxRjU3XFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1Ri1cXHUxRjdEXFx1MUY4MC1cXHUxRkI0XFx1MUZCNi1cXHUxRkJDXFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzYtXFx1MUZDQ1xcdTFGRDAtXFx1MUZEM1xcdTFGRDYtXFx1MUZEQlxcdTFGRTAtXFx1MUZFQ1xcdTFGRjItXFx1MUZGNFxcdTFGRjYtXFx1MUZGQ1xcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MjEwMlxcdTIxMDdcXHUyMTBBLVxcdTIxMTNcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEyRi1cXHUyMTM5XFx1MjEzQy1cXHUyMTNGXFx1MjE0NS1cXHUyMTQ5XFx1MjE0RVxcdTIxODNcXHUyMTg0XFx1MkMwMC1cXHUyQzJFXFx1MkMzMC1cXHUyQzVFXFx1MkM2MC1cXHUyQ0U0XFx1MkNFQi1cXHUyQ0VFXFx1MkNGMlxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdTJEMzAtXFx1MkQ2N1xcdTJENkZcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUyRTJGXFx1MzAwNVxcdTMwMDZcXHUzMDMxLVxcdTMwMzVcXHUzMDNCXFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUQtXFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkMtXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZENVxcdUEwMDAtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGRFxcdUE1MDAtXFx1QTYwQ1xcdUE2MTAtXFx1QTYxRlxcdUE2MkFcXHVBNjJCXFx1QTY0MC1cXHVBNjZFXFx1QTY3Ri1cXHVBNjlEXFx1QTZBMC1cXHVBNkU1XFx1QTcxNy1cXHVBNzFGXFx1QTcyMi1cXHVBNzg4XFx1QTc4Qi1cXHVBN0FEXFx1QTdCMC1cXHVBN0I3XFx1QTdGNy1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE4RkRcXHVBOTBBLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUNGXFx1QTlFMC1cXHVBOUU0XFx1QTlFNi1cXHVBOUVGXFx1QTlGQS1cXHVBOUZFXFx1QUEwMC1cXHVBQTI4XFx1QUE0MC1cXHVBQTQyXFx1QUE0NC1cXHVBQTRCXFx1QUE2MC1cXHVBQTc2XFx1QUE3QVxcdUFBN0UtXFx1QUFBRlxcdUFBQjFcXHVBQUI1XFx1QUFCNlxcdUFBQjktXFx1QUFCRFxcdUFBQzBcXHVBQUMyXFx1QUFEQi1cXHVBQUREXFx1QUFFMC1cXHVBQUVBXFx1QUFGMi1cXHVBQUY0XFx1QUIwMS1cXHVBQjA2XFx1QUIwOS1cXHVBQjBFXFx1QUIxMS1cXHVBQjE2XFx1QUIyMC1cXHVBQjI2XFx1QUIyOC1cXHVBQjJFXFx1QUIzMC1cXHVBQjVBXFx1QUI1Qy1cXHVBQjY1XFx1QUI3MC1cXHVBQkUyXFx1QUMwMC1cXHVEN0EzXFx1RDdCMC1cXHVEN0M2XFx1RDdDQi1cXHVEN0ZCXFx1RjkwMC1cXHVGQTZEXFx1RkE3MC1cXHVGQUQ5XFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkIxRFxcdUZCMUYtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkIxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZCXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXFx1RkYyMS1cXHVGRjNBXFx1RkY0MS1cXHVGRjVBXFx1RkY2Ni1cXHVGRkJFXFx1RkZDMi1cXHVGRkM3XFx1RkZDQS1cXHVGRkNGXFx1RkZEMi1cXHVGRkQ3XFx1RkZEQS1cXHVGRkRDMC05XFx4QjJcXHhCM1xceEI5XFx4QkMtXFx4QkVcXHUwNjYwLVxcdTA2NjlcXHUwNkYwLVxcdTA2RjlcXHUwN0MwLVxcdTA3QzlcXHUwOTY2LVxcdTA5NkZcXHUwOUU2LVxcdTA5RUZcXHUwOUY0LVxcdTA5RjlcXHUwQTY2LVxcdTBBNkZcXHUwQUU2LVxcdTBBRUZcXHUwQjY2LVxcdTBCNkZcXHUwQjcyLVxcdTBCNzdcXHUwQkU2LVxcdTBCRjJcXHUwQzY2LVxcdTBDNkZcXHUwQzc4LVxcdTBDN0VcXHUwQ0U2LVxcdTBDRUZcXHUwRDY2LVxcdTBENzVcXHUwREU2LVxcdTBERUZcXHUwRTUwLVxcdTBFNTlcXHUwRUQwLVxcdTBFRDlcXHUwRjIwLVxcdTBGMzNcXHUxMDQwLVxcdTEwNDlcXHUxMDkwLVxcdTEwOTlcXHUxMzY5LVxcdTEzN0NcXHUxNkVFLVxcdTE2RjBcXHUxN0UwLVxcdTE3RTlcXHUxN0YwLVxcdTE3RjlcXHUxODEwLVxcdTE4MTlcXHUxOTQ2LVxcdTE5NEZcXHUxOUQwLVxcdTE5REFcXHUxQTgwLVxcdTFBODlcXHUxQTkwLVxcdTFBOTlcXHUxQjUwLVxcdTFCNTlcXHUxQkIwLVxcdTFCQjlcXHUxQzQwLVxcdTFDNDlcXHUxQzUwLVxcdTFDNTlcXHUyMDcwXFx1MjA3NC1cXHUyMDc5XFx1MjA4MC1cXHUyMDg5XFx1MjE1MC1cXHUyMTgyXFx1MjE4NS1cXHUyMTg5XFx1MjQ2MC1cXHUyNDlCXFx1MjRFQS1cXHUyNEZGXFx1Mjc3Ni1cXHUyNzkzXFx1MkNGRFxcdTMwMDdcXHUzMDIxLVxcdTMwMjlcXHUzMDM4LVxcdTMwM0FcXHUzMTkyLVxcdTMxOTVcXHUzMjIwLVxcdTMyMjlcXHUzMjQ4LVxcdTMyNEZcXHUzMjUxLVxcdTMyNUZcXHUzMjgwLVxcdTMyODlcXHUzMkIxLVxcdTMyQkZcXHVBNjIwLVxcdUE2MjlcXHVBNkU2LVxcdUE2RUZcXHVBODMwLVxcdUE4MzVcXHVBOEQwLVxcdUE4RDlcXHVBOTAwLVxcdUE5MDlcXHVBOUQwLVxcdUE5RDlcXHVBOUYwLVxcdUE5RjlcXHVBQTUwLVxcdUFBNTlcXHVBQkYwLVxcdUFCRjlcXHVGRjEwLVxcdUZGMTldKy9nXG4iLCJtb2R1bGUuZXhwb3J0cyA9IC8oW2EtelxceEI1XFx4REYtXFx4RjZcXHhGOC1cXHhGRlxcdTAxMDFcXHUwMTAzXFx1MDEwNVxcdTAxMDdcXHUwMTA5XFx1MDEwQlxcdTAxMERcXHUwMTBGXFx1MDExMVxcdTAxMTNcXHUwMTE1XFx1MDExN1xcdTAxMTlcXHUwMTFCXFx1MDExRFxcdTAxMUZcXHUwMTIxXFx1MDEyM1xcdTAxMjVcXHUwMTI3XFx1MDEyOVxcdTAxMkJcXHUwMTJEXFx1MDEyRlxcdTAxMzFcXHUwMTMzXFx1MDEzNVxcdTAxMzdcXHUwMTM4XFx1MDEzQVxcdTAxM0NcXHUwMTNFXFx1MDE0MFxcdTAxNDJcXHUwMTQ0XFx1MDE0NlxcdTAxNDhcXHUwMTQ5XFx1MDE0QlxcdTAxNERcXHUwMTRGXFx1MDE1MVxcdTAxNTNcXHUwMTU1XFx1MDE1N1xcdTAxNTlcXHUwMTVCXFx1MDE1RFxcdTAxNUZcXHUwMTYxXFx1MDE2M1xcdTAxNjVcXHUwMTY3XFx1MDE2OVxcdTAxNkJcXHUwMTZEXFx1MDE2RlxcdTAxNzFcXHUwMTczXFx1MDE3NVxcdTAxNzdcXHUwMTdBXFx1MDE3Q1xcdTAxN0UtXFx1MDE4MFxcdTAxODNcXHUwMTg1XFx1MDE4OFxcdTAxOENcXHUwMThEXFx1MDE5MlxcdTAxOTVcXHUwMTk5LVxcdTAxOUJcXHUwMTlFXFx1MDFBMVxcdTAxQTNcXHUwMUE1XFx1MDFBOFxcdTAxQUFcXHUwMUFCXFx1MDFBRFxcdTAxQjBcXHUwMUI0XFx1MDFCNlxcdTAxQjlcXHUwMUJBXFx1MDFCRC1cXHUwMUJGXFx1MDFDNlxcdTAxQzlcXHUwMUNDXFx1MDFDRVxcdTAxRDBcXHUwMUQyXFx1MDFENFxcdTAxRDZcXHUwMUQ4XFx1MDFEQVxcdTAxRENcXHUwMUREXFx1MDFERlxcdTAxRTFcXHUwMUUzXFx1MDFFNVxcdTAxRTdcXHUwMUU5XFx1MDFFQlxcdTAxRURcXHUwMUVGXFx1MDFGMFxcdTAxRjNcXHUwMUY1XFx1MDFGOVxcdTAxRkJcXHUwMUZEXFx1MDFGRlxcdTAyMDFcXHUwMjAzXFx1MDIwNVxcdTAyMDdcXHUwMjA5XFx1MDIwQlxcdTAyMERcXHUwMjBGXFx1MDIxMVxcdTAyMTNcXHUwMjE1XFx1MDIxN1xcdTAyMTlcXHUwMjFCXFx1MDIxRFxcdTAyMUZcXHUwMjIxXFx1MDIyM1xcdTAyMjVcXHUwMjI3XFx1MDIyOVxcdTAyMkJcXHUwMjJEXFx1MDIyRlxcdTAyMzFcXHUwMjMzLVxcdTAyMzlcXHUwMjNDXFx1MDIzRlxcdTAyNDBcXHUwMjQyXFx1MDI0N1xcdTAyNDlcXHUwMjRCXFx1MDI0RFxcdTAyNEYtXFx1MDI5M1xcdTAyOTUtXFx1MDJBRlxcdTAzNzFcXHUwMzczXFx1MDM3N1xcdTAzN0ItXFx1MDM3RFxcdTAzOTBcXHUwM0FDLVxcdTAzQ0VcXHUwM0QwXFx1MDNEMVxcdTAzRDUtXFx1MDNEN1xcdTAzRDlcXHUwM0RCXFx1MDNERFxcdTAzREZcXHUwM0UxXFx1MDNFM1xcdTAzRTVcXHUwM0U3XFx1MDNFOVxcdTAzRUJcXHUwM0VEXFx1MDNFRi1cXHUwM0YzXFx1MDNGNVxcdTAzRjhcXHUwM0ZCXFx1MDNGQ1xcdTA0MzAtXFx1MDQ1RlxcdTA0NjFcXHUwNDYzXFx1MDQ2NVxcdTA0NjdcXHUwNDY5XFx1MDQ2QlxcdTA0NkRcXHUwNDZGXFx1MDQ3MVxcdTA0NzNcXHUwNDc1XFx1MDQ3N1xcdTA0NzlcXHUwNDdCXFx1MDQ3RFxcdTA0N0ZcXHUwNDgxXFx1MDQ4QlxcdTA0OERcXHUwNDhGXFx1MDQ5MVxcdTA0OTNcXHUwNDk1XFx1MDQ5N1xcdTA0OTlcXHUwNDlCXFx1MDQ5RFxcdTA0OUZcXHUwNEExXFx1MDRBM1xcdTA0QTVcXHUwNEE3XFx1MDRBOVxcdTA0QUJcXHUwNEFEXFx1MDRBRlxcdTA0QjFcXHUwNEIzXFx1MDRCNVxcdTA0QjdcXHUwNEI5XFx1MDRCQlxcdTA0QkRcXHUwNEJGXFx1MDRDMlxcdTA0QzRcXHUwNEM2XFx1MDRDOFxcdTA0Q0FcXHUwNENDXFx1MDRDRVxcdTA0Q0ZcXHUwNEQxXFx1MDREM1xcdTA0RDVcXHUwNEQ3XFx1MDREOVxcdTA0REJcXHUwNEREXFx1MDRERlxcdTA0RTFcXHUwNEUzXFx1MDRFNVxcdTA0RTdcXHUwNEU5XFx1MDRFQlxcdTA0RURcXHUwNEVGXFx1MDRGMVxcdTA0RjNcXHUwNEY1XFx1MDRGN1xcdTA0RjlcXHUwNEZCXFx1MDRGRFxcdTA0RkZcXHUwNTAxXFx1MDUwM1xcdTA1MDVcXHUwNTA3XFx1MDUwOVxcdTA1MEJcXHUwNTBEXFx1MDUwRlxcdTA1MTFcXHUwNTEzXFx1MDUxNVxcdTA1MTdcXHUwNTE5XFx1MDUxQlxcdTA1MURcXHUwNTFGXFx1MDUyMVxcdTA1MjNcXHUwNTI1XFx1MDUyN1xcdTA1MjlcXHUwNTJCXFx1MDUyRFxcdTA1MkZcXHUwNTYxLVxcdTA1ODdcXHUxM0Y4LVxcdTEzRkRcXHUxRDAwLVxcdTFEMkJcXHUxRDZCLVxcdTFENzdcXHUxRDc5LVxcdTFEOUFcXHUxRTAxXFx1MUUwM1xcdTFFMDVcXHUxRTA3XFx1MUUwOVxcdTFFMEJcXHUxRTBEXFx1MUUwRlxcdTFFMTFcXHUxRTEzXFx1MUUxNVxcdTFFMTdcXHUxRTE5XFx1MUUxQlxcdTFFMURcXHUxRTFGXFx1MUUyMVxcdTFFMjNcXHUxRTI1XFx1MUUyN1xcdTFFMjlcXHUxRTJCXFx1MUUyRFxcdTFFMkZcXHUxRTMxXFx1MUUzM1xcdTFFMzVcXHUxRTM3XFx1MUUzOVxcdTFFM0JcXHUxRTNEXFx1MUUzRlxcdTFFNDFcXHUxRTQzXFx1MUU0NVxcdTFFNDdcXHUxRTQ5XFx1MUU0QlxcdTFFNERcXHUxRTRGXFx1MUU1MVxcdTFFNTNcXHUxRTU1XFx1MUU1N1xcdTFFNTlcXHUxRTVCXFx1MUU1RFxcdTFFNUZcXHUxRTYxXFx1MUU2M1xcdTFFNjVcXHUxRTY3XFx1MUU2OVxcdTFFNkJcXHUxRTZEXFx1MUU2RlxcdTFFNzFcXHUxRTczXFx1MUU3NVxcdTFFNzdcXHUxRTc5XFx1MUU3QlxcdTFFN0RcXHUxRTdGXFx1MUU4MVxcdTFFODNcXHUxRTg1XFx1MUU4N1xcdTFFODlcXHUxRThCXFx1MUU4RFxcdTFFOEZcXHUxRTkxXFx1MUU5M1xcdTFFOTUtXFx1MUU5RFxcdTFFOUZcXHUxRUExXFx1MUVBM1xcdTFFQTVcXHUxRUE3XFx1MUVBOVxcdTFFQUJcXHUxRUFEXFx1MUVBRlxcdTFFQjFcXHUxRUIzXFx1MUVCNVxcdTFFQjdcXHUxRUI5XFx1MUVCQlxcdTFFQkRcXHUxRUJGXFx1MUVDMVxcdTFFQzNcXHUxRUM1XFx1MUVDN1xcdTFFQzlcXHUxRUNCXFx1MUVDRFxcdTFFQ0ZcXHUxRUQxXFx1MUVEM1xcdTFFRDVcXHUxRUQ3XFx1MUVEOVxcdTFFREJcXHUxRUREXFx1MUVERlxcdTFFRTFcXHUxRUUzXFx1MUVFNVxcdTFFRTdcXHUxRUU5XFx1MUVFQlxcdTFFRURcXHUxRUVGXFx1MUVGMVxcdTFFRjNcXHUxRUY1XFx1MUVGN1xcdTFFRjlcXHUxRUZCXFx1MUVGRFxcdTFFRkYtXFx1MUYwN1xcdTFGMTAtXFx1MUYxNVxcdTFGMjAtXFx1MUYyN1xcdTFGMzAtXFx1MUYzN1xcdTFGNDAtXFx1MUY0NVxcdTFGNTAtXFx1MUY1N1xcdTFGNjAtXFx1MUY2N1xcdTFGNzAtXFx1MUY3RFxcdTFGODAtXFx1MUY4N1xcdTFGOTAtXFx1MUY5N1xcdTFGQTAtXFx1MUZBN1xcdTFGQjAtXFx1MUZCNFxcdTFGQjZcXHUxRkI3XFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzZcXHUxRkM3XFx1MUZEMC1cXHUxRkQzXFx1MUZENlxcdTFGRDdcXHUxRkUwLVxcdTFGRTdcXHUxRkYyLVxcdTFGRjRcXHUxRkY2XFx1MUZGN1xcdTIxMEFcXHUyMTBFXFx1MjEwRlxcdTIxMTNcXHUyMTJGXFx1MjEzNFxcdTIxMzlcXHUyMTNDXFx1MjEzRFxcdTIxNDYtXFx1MjE0OVxcdTIxNEVcXHUyMTg0XFx1MkMzMC1cXHUyQzVFXFx1MkM2MVxcdTJDNjVcXHUyQzY2XFx1MkM2OFxcdTJDNkFcXHUyQzZDXFx1MkM3MVxcdTJDNzNcXHUyQzc0XFx1MkM3Ni1cXHUyQzdCXFx1MkM4MVxcdTJDODNcXHUyQzg1XFx1MkM4N1xcdTJDODlcXHUyQzhCXFx1MkM4RFxcdTJDOEZcXHUyQzkxXFx1MkM5M1xcdTJDOTVcXHUyQzk3XFx1MkM5OVxcdTJDOUJcXHUyQzlEXFx1MkM5RlxcdTJDQTFcXHUyQ0EzXFx1MkNBNVxcdTJDQTdcXHUyQ0E5XFx1MkNBQlxcdTJDQURcXHUyQ0FGXFx1MkNCMVxcdTJDQjNcXHUyQ0I1XFx1MkNCN1xcdTJDQjlcXHUyQ0JCXFx1MkNCRFxcdTJDQkZcXHUyQ0MxXFx1MkNDM1xcdTJDQzVcXHUyQ0M3XFx1MkNDOVxcdTJDQ0JcXHUyQ0NEXFx1MkNDRlxcdTJDRDFcXHUyQ0QzXFx1MkNENVxcdTJDRDdcXHUyQ0Q5XFx1MkNEQlxcdTJDRERcXHUyQ0RGXFx1MkNFMVxcdTJDRTNcXHUyQ0U0XFx1MkNFQ1xcdTJDRUVcXHUyQ0YzXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHVBNjQxXFx1QTY0M1xcdUE2NDVcXHVBNjQ3XFx1QTY0OVxcdUE2NEJcXHVBNjREXFx1QTY0RlxcdUE2NTFcXHVBNjUzXFx1QTY1NVxcdUE2NTdcXHVBNjU5XFx1QTY1QlxcdUE2NURcXHVBNjVGXFx1QTY2MVxcdUE2NjNcXHVBNjY1XFx1QTY2N1xcdUE2NjlcXHVBNjZCXFx1QTY2RFxcdUE2ODFcXHVBNjgzXFx1QTY4NVxcdUE2ODdcXHVBNjg5XFx1QTY4QlxcdUE2OERcXHVBNjhGXFx1QTY5MVxcdUE2OTNcXHVBNjk1XFx1QTY5N1xcdUE2OTlcXHVBNjlCXFx1QTcyM1xcdUE3MjVcXHVBNzI3XFx1QTcyOVxcdUE3MkJcXHVBNzJEXFx1QTcyRi1cXHVBNzMxXFx1QTczM1xcdUE3MzVcXHVBNzM3XFx1QTczOVxcdUE3M0JcXHVBNzNEXFx1QTczRlxcdUE3NDFcXHVBNzQzXFx1QTc0NVxcdUE3NDdcXHVBNzQ5XFx1QTc0QlxcdUE3NERcXHVBNzRGXFx1QTc1MVxcdUE3NTNcXHVBNzU1XFx1QTc1N1xcdUE3NTlcXHVBNzVCXFx1QTc1RFxcdUE3NUZcXHVBNzYxXFx1QTc2M1xcdUE3NjVcXHVBNzY3XFx1QTc2OVxcdUE3NkJcXHVBNzZEXFx1QTc2RlxcdUE3NzEtXFx1QTc3OFxcdUE3N0FcXHVBNzdDXFx1QTc3RlxcdUE3ODFcXHVBNzgzXFx1QTc4NVxcdUE3ODdcXHVBNzhDXFx1QTc4RVxcdUE3OTFcXHVBNzkzLVxcdUE3OTVcXHVBNzk3XFx1QTc5OVxcdUE3OUJcXHVBNzlEXFx1QTc5RlxcdUE3QTFcXHVBN0EzXFx1QTdBNVxcdUE3QTdcXHVBN0E5XFx1QTdCNVxcdUE3QjdcXHVBN0ZBXFx1QUIzMC1cXHVBQjVBXFx1QUI2MC1cXHVBQjY1XFx1QUI3MC1cXHVBQkJGXFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkY0MS1cXHVGRjVBMC05XFx4QjJcXHhCM1xceEI5XFx4QkMtXFx4QkVcXHUwNjYwLVxcdTA2NjlcXHUwNkYwLVxcdTA2RjlcXHUwN0MwLVxcdTA3QzlcXHUwOTY2LVxcdTA5NkZcXHUwOUU2LVxcdTA5RUZcXHUwOUY0LVxcdTA5RjlcXHUwQTY2LVxcdTBBNkZcXHUwQUU2LVxcdTBBRUZcXHUwQjY2LVxcdTBCNkZcXHUwQjcyLVxcdTBCNzdcXHUwQkU2LVxcdTBCRjJcXHUwQzY2LVxcdTBDNkZcXHUwQzc4LVxcdTBDN0VcXHUwQ0U2LVxcdTBDRUZcXHUwRDY2LVxcdTBENzVcXHUwREU2LVxcdTBERUZcXHUwRTUwLVxcdTBFNTlcXHUwRUQwLVxcdTBFRDlcXHUwRjIwLVxcdTBGMzNcXHUxMDQwLVxcdTEwNDlcXHUxMDkwLVxcdTEwOTlcXHUxMzY5LVxcdTEzN0NcXHUxNkVFLVxcdTE2RjBcXHUxN0UwLVxcdTE3RTlcXHUxN0YwLVxcdTE3RjlcXHUxODEwLVxcdTE4MTlcXHUxOTQ2LVxcdTE5NEZcXHUxOUQwLVxcdTE5REFcXHUxQTgwLVxcdTFBODlcXHUxQTkwLVxcdTFBOTlcXHUxQjUwLVxcdTFCNTlcXHUxQkIwLVxcdTFCQjlcXHUxQzQwLVxcdTFDNDlcXHUxQzUwLVxcdTFDNTlcXHUyMDcwXFx1MjA3NC1cXHUyMDc5XFx1MjA4MC1cXHUyMDg5XFx1MjE1MC1cXHUyMTgyXFx1MjE4NS1cXHUyMTg5XFx1MjQ2MC1cXHUyNDlCXFx1MjRFQS1cXHUyNEZGXFx1Mjc3Ni1cXHUyNzkzXFx1MkNGRFxcdTMwMDdcXHUzMDIxLVxcdTMwMjlcXHUzMDM4LVxcdTMwM0FcXHUzMTkyLVxcdTMxOTVcXHUzMjIwLVxcdTMyMjlcXHUzMjQ4LVxcdTMyNEZcXHUzMjUxLVxcdTMyNUZcXHUzMjgwLVxcdTMyODlcXHUzMkIxLVxcdTMyQkZcXHVBNjIwLVxcdUE2MjlcXHVBNkU2LVxcdUE2RUZcXHVBODMwLVxcdUE4MzVcXHVBOEQwLVxcdUE4RDlcXHVBOTAwLVxcdUE5MDlcXHVBOUQwLVxcdUE5RDlcXHVBOUYwLVxcdUE5RjlcXHVBQTUwLVxcdUFBNTlcXHVBQkYwLVxcdUFCRjlcXHVGRjEwLVxcdUZGMTldKShbQS1aXFx4QzAtXFx4RDZcXHhEOC1cXHhERVxcdTAxMDBcXHUwMTAyXFx1MDEwNFxcdTAxMDZcXHUwMTA4XFx1MDEwQVxcdTAxMENcXHUwMTBFXFx1MDExMFxcdTAxMTJcXHUwMTE0XFx1MDExNlxcdTAxMThcXHUwMTFBXFx1MDExQ1xcdTAxMUVcXHUwMTIwXFx1MDEyMlxcdTAxMjRcXHUwMTI2XFx1MDEyOFxcdTAxMkFcXHUwMTJDXFx1MDEyRVxcdTAxMzBcXHUwMTMyXFx1MDEzNFxcdTAxMzZcXHUwMTM5XFx1MDEzQlxcdTAxM0RcXHUwMTNGXFx1MDE0MVxcdTAxNDNcXHUwMTQ1XFx1MDE0N1xcdTAxNEFcXHUwMTRDXFx1MDE0RVxcdTAxNTBcXHUwMTUyXFx1MDE1NFxcdTAxNTZcXHUwMTU4XFx1MDE1QVxcdTAxNUNcXHUwMTVFXFx1MDE2MFxcdTAxNjJcXHUwMTY0XFx1MDE2NlxcdTAxNjhcXHUwMTZBXFx1MDE2Q1xcdTAxNkVcXHUwMTcwXFx1MDE3MlxcdTAxNzRcXHUwMTc2XFx1MDE3OFxcdTAxNzlcXHUwMTdCXFx1MDE3RFxcdTAxODFcXHUwMTgyXFx1MDE4NFxcdTAxODZcXHUwMTg3XFx1MDE4OS1cXHUwMThCXFx1MDE4RS1cXHUwMTkxXFx1MDE5M1xcdTAxOTRcXHUwMTk2LVxcdTAxOThcXHUwMTlDXFx1MDE5RFxcdTAxOUZcXHUwMUEwXFx1MDFBMlxcdTAxQTRcXHUwMUE2XFx1MDFBN1xcdTAxQTlcXHUwMUFDXFx1MDFBRVxcdTAxQUZcXHUwMUIxLVxcdTAxQjNcXHUwMUI1XFx1MDFCN1xcdTAxQjhcXHUwMUJDXFx1MDFDNFxcdTAxQzdcXHUwMUNBXFx1MDFDRFxcdTAxQ0ZcXHUwMUQxXFx1MDFEM1xcdTAxRDVcXHUwMUQ3XFx1MDFEOVxcdTAxREJcXHUwMURFXFx1MDFFMFxcdTAxRTJcXHUwMUU0XFx1MDFFNlxcdTAxRThcXHUwMUVBXFx1MDFFQ1xcdTAxRUVcXHUwMUYxXFx1MDFGNFxcdTAxRjYtXFx1MDFGOFxcdTAxRkFcXHUwMUZDXFx1MDFGRVxcdTAyMDBcXHUwMjAyXFx1MDIwNFxcdTAyMDZcXHUwMjA4XFx1MDIwQVxcdTAyMENcXHUwMjBFXFx1MDIxMFxcdTAyMTJcXHUwMjE0XFx1MDIxNlxcdTAyMThcXHUwMjFBXFx1MDIxQ1xcdTAyMUVcXHUwMjIwXFx1MDIyMlxcdTAyMjRcXHUwMjI2XFx1MDIyOFxcdTAyMkFcXHUwMjJDXFx1MDIyRVxcdTAyMzBcXHUwMjMyXFx1MDIzQVxcdTAyM0JcXHUwMjNEXFx1MDIzRVxcdTAyNDFcXHUwMjQzLVxcdTAyNDZcXHUwMjQ4XFx1MDI0QVxcdTAyNENcXHUwMjRFXFx1MDM3MFxcdTAzNzJcXHUwMzc2XFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RVxcdTAzOEZcXHUwMzkxLVxcdTAzQTFcXHUwM0EzLVxcdTAzQUJcXHUwM0NGXFx1MDNEMi1cXHUwM0Q0XFx1MDNEOFxcdTAzREFcXHUwM0RDXFx1MDNERVxcdTAzRTBcXHUwM0UyXFx1MDNFNFxcdTAzRTZcXHUwM0U4XFx1MDNFQVxcdTAzRUNcXHUwM0VFXFx1MDNGNFxcdTAzRjdcXHUwM0Y5XFx1MDNGQVxcdTAzRkQtXFx1MDQyRlxcdTA0NjBcXHUwNDYyXFx1MDQ2NFxcdTA0NjZcXHUwNDY4XFx1MDQ2QVxcdTA0NkNcXHUwNDZFXFx1MDQ3MFxcdTA0NzJcXHUwNDc0XFx1MDQ3NlxcdTA0NzhcXHUwNDdBXFx1MDQ3Q1xcdTA0N0VcXHUwNDgwXFx1MDQ4QVxcdTA0OENcXHUwNDhFXFx1MDQ5MFxcdTA0OTJcXHUwNDk0XFx1MDQ5NlxcdTA0OThcXHUwNDlBXFx1MDQ5Q1xcdTA0OUVcXHUwNEEwXFx1MDRBMlxcdTA0QTRcXHUwNEE2XFx1MDRBOFxcdTA0QUFcXHUwNEFDXFx1MDRBRVxcdTA0QjBcXHUwNEIyXFx1MDRCNFxcdTA0QjZcXHUwNEI4XFx1MDRCQVxcdTA0QkNcXHUwNEJFXFx1MDRDMFxcdTA0QzFcXHUwNEMzXFx1MDRDNVxcdTA0QzdcXHUwNEM5XFx1MDRDQlxcdTA0Q0RcXHUwNEQwXFx1MDREMlxcdTA0RDRcXHUwNEQ2XFx1MDREOFxcdTA0REFcXHUwNERDXFx1MDRERVxcdTA0RTBcXHUwNEUyXFx1MDRFNFxcdTA0RTZcXHUwNEU4XFx1MDRFQVxcdTA0RUNcXHUwNEVFXFx1MDRGMFxcdTA0RjJcXHUwNEY0XFx1MDRGNlxcdTA0RjhcXHUwNEZBXFx1MDRGQ1xcdTA0RkVcXHUwNTAwXFx1MDUwMlxcdTA1MDRcXHUwNTA2XFx1MDUwOFxcdTA1MEFcXHUwNTBDXFx1MDUwRVxcdTA1MTBcXHUwNTEyXFx1MDUxNFxcdTA1MTZcXHUwNTE4XFx1MDUxQVxcdTA1MUNcXHUwNTFFXFx1MDUyMFxcdTA1MjJcXHUwNTI0XFx1MDUyNlxcdTA1MjhcXHUwNTJBXFx1MDUyQ1xcdTA1MkVcXHUwNTMxLVxcdTA1NTZcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEzQTAtXFx1MTNGNVxcdTFFMDBcXHUxRTAyXFx1MUUwNFxcdTFFMDZcXHUxRTA4XFx1MUUwQVxcdTFFMENcXHUxRTBFXFx1MUUxMFxcdTFFMTJcXHUxRTE0XFx1MUUxNlxcdTFFMThcXHUxRTFBXFx1MUUxQ1xcdTFFMUVcXHUxRTIwXFx1MUUyMlxcdTFFMjRcXHUxRTI2XFx1MUUyOFxcdTFFMkFcXHUxRTJDXFx1MUUyRVxcdTFFMzBcXHUxRTMyXFx1MUUzNFxcdTFFMzZcXHUxRTM4XFx1MUUzQVxcdTFFM0NcXHUxRTNFXFx1MUU0MFxcdTFFNDJcXHUxRTQ0XFx1MUU0NlxcdTFFNDhcXHUxRTRBXFx1MUU0Q1xcdTFFNEVcXHUxRTUwXFx1MUU1MlxcdTFFNTRcXHUxRTU2XFx1MUU1OFxcdTFFNUFcXHUxRTVDXFx1MUU1RVxcdTFFNjBcXHUxRTYyXFx1MUU2NFxcdTFFNjZcXHUxRTY4XFx1MUU2QVxcdTFFNkNcXHUxRTZFXFx1MUU3MFxcdTFFNzJcXHUxRTc0XFx1MUU3NlxcdTFFNzhcXHUxRTdBXFx1MUU3Q1xcdTFFN0VcXHUxRTgwXFx1MUU4MlxcdTFFODRcXHUxRTg2XFx1MUU4OFxcdTFFOEFcXHUxRThDXFx1MUU4RVxcdTFFOTBcXHUxRTkyXFx1MUU5NFxcdTFFOUVcXHUxRUEwXFx1MUVBMlxcdTFFQTRcXHUxRUE2XFx1MUVBOFxcdTFFQUFcXHUxRUFDXFx1MUVBRVxcdTFFQjBcXHUxRUIyXFx1MUVCNFxcdTFFQjZcXHUxRUI4XFx1MUVCQVxcdTFFQkNcXHUxRUJFXFx1MUVDMFxcdTFFQzJcXHUxRUM0XFx1MUVDNlxcdTFFQzhcXHUxRUNBXFx1MUVDQ1xcdTFFQ0VcXHUxRUQwXFx1MUVEMlxcdTFFRDRcXHUxRUQ2XFx1MUVEOFxcdTFFREFcXHUxRURDXFx1MUVERVxcdTFFRTBcXHUxRUUyXFx1MUVFNFxcdTFFRTZcXHUxRUU4XFx1MUVFQVxcdTFFRUNcXHUxRUVFXFx1MUVGMFxcdTFFRjJcXHUxRUY0XFx1MUVGNlxcdTFFRjhcXHUxRUZBXFx1MUVGQ1xcdTFFRkVcXHUxRjA4LVxcdTFGMEZcXHUxRjE4LVxcdTFGMURcXHUxRjI4LVxcdTFGMkZcXHUxRjM4LVxcdTFGM0ZcXHUxRjQ4LVxcdTFGNERcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGXFx1MUY2OC1cXHUxRjZGXFx1MUZCOC1cXHUxRkJCXFx1MUZDOC1cXHUxRkNCXFx1MUZEOC1cXHUxRkRCXFx1MUZFOC1cXHUxRkVDXFx1MUZGOC1cXHUxRkZCXFx1MjEwMlxcdTIxMDdcXHUyMTBCLVxcdTIxMERcXHUyMTEwLVxcdTIxMTJcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEzMC1cXHUyMTMzXFx1MjEzRVxcdTIxM0ZcXHUyMTQ1XFx1MjE4M1xcdTJDMDAtXFx1MkMyRVxcdTJDNjBcXHUyQzYyLVxcdTJDNjRcXHUyQzY3XFx1MkM2OVxcdTJDNkJcXHUyQzZELVxcdTJDNzBcXHUyQzcyXFx1MkM3NVxcdTJDN0UtXFx1MkM4MFxcdTJDODJcXHUyQzg0XFx1MkM4NlxcdTJDODhcXHUyQzhBXFx1MkM4Q1xcdTJDOEVcXHUyQzkwXFx1MkM5MlxcdTJDOTRcXHUyQzk2XFx1MkM5OFxcdTJDOUFcXHUyQzlDXFx1MkM5RVxcdTJDQTBcXHUyQ0EyXFx1MkNBNFxcdTJDQTZcXHUyQ0E4XFx1MkNBQVxcdTJDQUNcXHUyQ0FFXFx1MkNCMFxcdTJDQjJcXHUyQ0I0XFx1MkNCNlxcdTJDQjhcXHUyQ0JBXFx1MkNCQ1xcdTJDQkVcXHUyQ0MwXFx1MkNDMlxcdTJDQzRcXHUyQ0M2XFx1MkNDOFxcdTJDQ0FcXHUyQ0NDXFx1MkNDRVxcdTJDRDBcXHUyQ0QyXFx1MkNENFxcdTJDRDZcXHUyQ0Q4XFx1MkNEQVxcdTJDRENcXHUyQ0RFXFx1MkNFMFxcdTJDRTJcXHUyQ0VCXFx1MkNFRFxcdTJDRjJcXHVBNjQwXFx1QTY0MlxcdUE2NDRcXHVBNjQ2XFx1QTY0OFxcdUE2NEFcXHVBNjRDXFx1QTY0RVxcdUE2NTBcXHVBNjUyXFx1QTY1NFxcdUE2NTZcXHVBNjU4XFx1QTY1QVxcdUE2NUNcXHVBNjVFXFx1QTY2MFxcdUE2NjJcXHVBNjY0XFx1QTY2NlxcdUE2NjhcXHVBNjZBXFx1QTY2Q1xcdUE2ODBcXHVBNjgyXFx1QTY4NFxcdUE2ODZcXHVBNjg4XFx1QTY4QVxcdUE2OENcXHVBNjhFXFx1QTY5MFxcdUE2OTJcXHVBNjk0XFx1QTY5NlxcdUE2OThcXHVBNjlBXFx1QTcyMlxcdUE3MjRcXHVBNzI2XFx1QTcyOFxcdUE3MkFcXHVBNzJDXFx1QTcyRVxcdUE3MzJcXHVBNzM0XFx1QTczNlxcdUE3MzhcXHVBNzNBXFx1QTczQ1xcdUE3M0VcXHVBNzQwXFx1QTc0MlxcdUE3NDRcXHVBNzQ2XFx1QTc0OFxcdUE3NEFcXHVBNzRDXFx1QTc0RVxcdUE3NTBcXHVBNzUyXFx1QTc1NFxcdUE3NTZcXHVBNzU4XFx1QTc1QVxcdUE3NUNcXHVBNzVFXFx1QTc2MFxcdUE3NjJcXHVBNzY0XFx1QTc2NlxcdUE3NjhcXHVBNzZBXFx1QTc2Q1xcdUE3NkVcXHVBNzc5XFx1QTc3QlxcdUE3N0RcXHVBNzdFXFx1QTc4MFxcdUE3ODJcXHVBNzg0XFx1QTc4NlxcdUE3OEJcXHVBNzhEXFx1QTc5MFxcdUE3OTJcXHVBNzk2XFx1QTc5OFxcdUE3OUFcXHVBNzlDXFx1QTc5RVxcdUE3QTBcXHVBN0EyXFx1QTdBNFxcdUE3QTZcXHVBN0E4XFx1QTdBQS1cXHVBN0FEXFx1QTdCMC1cXHVBN0I0XFx1QTdCNlxcdUZGMjEtXFx1RkYzQV0pL2dcbiIsIm1vZHVsZS5leHBvcnRzID0gLyhbQS1aXFx4QzAtXFx4RDZcXHhEOC1cXHhERVxcdTAxMDBcXHUwMTAyXFx1MDEwNFxcdTAxMDZcXHUwMTA4XFx1MDEwQVxcdTAxMENcXHUwMTBFXFx1MDExMFxcdTAxMTJcXHUwMTE0XFx1MDExNlxcdTAxMThcXHUwMTFBXFx1MDExQ1xcdTAxMUVcXHUwMTIwXFx1MDEyMlxcdTAxMjRcXHUwMTI2XFx1MDEyOFxcdTAxMkFcXHUwMTJDXFx1MDEyRVxcdTAxMzBcXHUwMTMyXFx1MDEzNFxcdTAxMzZcXHUwMTM5XFx1MDEzQlxcdTAxM0RcXHUwMTNGXFx1MDE0MVxcdTAxNDNcXHUwMTQ1XFx1MDE0N1xcdTAxNEFcXHUwMTRDXFx1MDE0RVxcdTAxNTBcXHUwMTUyXFx1MDE1NFxcdTAxNTZcXHUwMTU4XFx1MDE1QVxcdTAxNUNcXHUwMTVFXFx1MDE2MFxcdTAxNjJcXHUwMTY0XFx1MDE2NlxcdTAxNjhcXHUwMTZBXFx1MDE2Q1xcdTAxNkVcXHUwMTcwXFx1MDE3MlxcdTAxNzRcXHUwMTc2XFx1MDE3OFxcdTAxNzlcXHUwMTdCXFx1MDE3RFxcdTAxODFcXHUwMTgyXFx1MDE4NFxcdTAxODZcXHUwMTg3XFx1MDE4OS1cXHUwMThCXFx1MDE4RS1cXHUwMTkxXFx1MDE5M1xcdTAxOTRcXHUwMTk2LVxcdTAxOThcXHUwMTlDXFx1MDE5RFxcdTAxOUZcXHUwMUEwXFx1MDFBMlxcdTAxQTRcXHUwMUE2XFx1MDFBN1xcdTAxQTlcXHUwMUFDXFx1MDFBRVxcdTAxQUZcXHUwMUIxLVxcdTAxQjNcXHUwMUI1XFx1MDFCN1xcdTAxQjhcXHUwMUJDXFx1MDFDNFxcdTAxQzdcXHUwMUNBXFx1MDFDRFxcdTAxQ0ZcXHUwMUQxXFx1MDFEM1xcdTAxRDVcXHUwMUQ3XFx1MDFEOVxcdTAxREJcXHUwMURFXFx1MDFFMFxcdTAxRTJcXHUwMUU0XFx1MDFFNlxcdTAxRThcXHUwMUVBXFx1MDFFQ1xcdTAxRUVcXHUwMUYxXFx1MDFGNFxcdTAxRjYtXFx1MDFGOFxcdTAxRkFcXHUwMUZDXFx1MDFGRVxcdTAyMDBcXHUwMjAyXFx1MDIwNFxcdTAyMDZcXHUwMjA4XFx1MDIwQVxcdTAyMENcXHUwMjBFXFx1MDIxMFxcdTAyMTJcXHUwMjE0XFx1MDIxNlxcdTAyMThcXHUwMjFBXFx1MDIxQ1xcdTAyMUVcXHUwMjIwXFx1MDIyMlxcdTAyMjRcXHUwMjI2XFx1MDIyOFxcdTAyMkFcXHUwMjJDXFx1MDIyRVxcdTAyMzBcXHUwMjMyXFx1MDIzQVxcdTAyM0JcXHUwMjNEXFx1MDIzRVxcdTAyNDFcXHUwMjQzLVxcdTAyNDZcXHUwMjQ4XFx1MDI0QVxcdTAyNENcXHUwMjRFXFx1MDM3MFxcdTAzNzJcXHUwMzc2XFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RVxcdTAzOEZcXHUwMzkxLVxcdTAzQTFcXHUwM0EzLVxcdTAzQUJcXHUwM0NGXFx1MDNEMi1cXHUwM0Q0XFx1MDNEOFxcdTAzREFcXHUwM0RDXFx1MDNERVxcdTAzRTBcXHUwM0UyXFx1MDNFNFxcdTAzRTZcXHUwM0U4XFx1MDNFQVxcdTAzRUNcXHUwM0VFXFx1MDNGNFxcdTAzRjdcXHUwM0Y5XFx1MDNGQVxcdTAzRkQtXFx1MDQyRlxcdTA0NjBcXHUwNDYyXFx1MDQ2NFxcdTA0NjZcXHUwNDY4XFx1MDQ2QVxcdTA0NkNcXHUwNDZFXFx1MDQ3MFxcdTA0NzJcXHUwNDc0XFx1MDQ3NlxcdTA0NzhcXHUwNDdBXFx1MDQ3Q1xcdTA0N0VcXHUwNDgwXFx1MDQ4QVxcdTA0OENcXHUwNDhFXFx1MDQ5MFxcdTA0OTJcXHUwNDk0XFx1MDQ5NlxcdTA0OThcXHUwNDlBXFx1MDQ5Q1xcdTA0OUVcXHUwNEEwXFx1MDRBMlxcdTA0QTRcXHUwNEE2XFx1MDRBOFxcdTA0QUFcXHUwNEFDXFx1MDRBRVxcdTA0QjBcXHUwNEIyXFx1MDRCNFxcdTA0QjZcXHUwNEI4XFx1MDRCQVxcdTA0QkNcXHUwNEJFXFx1MDRDMFxcdTA0QzFcXHUwNEMzXFx1MDRDNVxcdTA0QzdcXHUwNEM5XFx1MDRDQlxcdTA0Q0RcXHUwNEQwXFx1MDREMlxcdTA0RDRcXHUwNEQ2XFx1MDREOFxcdTA0REFcXHUwNERDXFx1MDRERVxcdTA0RTBcXHUwNEUyXFx1MDRFNFxcdTA0RTZcXHUwNEU4XFx1MDRFQVxcdTA0RUNcXHUwNEVFXFx1MDRGMFxcdTA0RjJcXHUwNEY0XFx1MDRGNlxcdTA0RjhcXHUwNEZBXFx1MDRGQ1xcdTA0RkVcXHUwNTAwXFx1MDUwMlxcdTA1MDRcXHUwNTA2XFx1MDUwOFxcdTA1MEFcXHUwNTBDXFx1MDUwRVxcdTA1MTBcXHUwNTEyXFx1MDUxNFxcdTA1MTZcXHUwNTE4XFx1MDUxQVxcdTA1MUNcXHUwNTFFXFx1MDUyMFxcdTA1MjJcXHUwNTI0XFx1MDUyNlxcdTA1MjhcXHUwNTJBXFx1MDUyQ1xcdTA1MkVcXHUwNTMxLVxcdTA1NTZcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEzQTAtXFx1MTNGNVxcdTFFMDBcXHUxRTAyXFx1MUUwNFxcdTFFMDZcXHUxRTA4XFx1MUUwQVxcdTFFMENcXHUxRTBFXFx1MUUxMFxcdTFFMTJcXHUxRTE0XFx1MUUxNlxcdTFFMThcXHUxRTFBXFx1MUUxQ1xcdTFFMUVcXHUxRTIwXFx1MUUyMlxcdTFFMjRcXHUxRTI2XFx1MUUyOFxcdTFFMkFcXHUxRTJDXFx1MUUyRVxcdTFFMzBcXHUxRTMyXFx1MUUzNFxcdTFFMzZcXHUxRTM4XFx1MUUzQVxcdTFFM0NcXHUxRTNFXFx1MUU0MFxcdTFFNDJcXHUxRTQ0XFx1MUU0NlxcdTFFNDhcXHUxRTRBXFx1MUU0Q1xcdTFFNEVcXHUxRTUwXFx1MUU1MlxcdTFFNTRcXHUxRTU2XFx1MUU1OFxcdTFFNUFcXHUxRTVDXFx1MUU1RVxcdTFFNjBcXHUxRTYyXFx1MUU2NFxcdTFFNjZcXHUxRTY4XFx1MUU2QVxcdTFFNkNcXHUxRTZFXFx1MUU3MFxcdTFFNzJcXHUxRTc0XFx1MUU3NlxcdTFFNzhcXHUxRTdBXFx1MUU3Q1xcdTFFN0VcXHUxRTgwXFx1MUU4MlxcdTFFODRcXHUxRTg2XFx1MUU4OFxcdTFFOEFcXHUxRThDXFx1MUU4RVxcdTFFOTBcXHUxRTkyXFx1MUU5NFxcdTFFOUVcXHUxRUEwXFx1MUVBMlxcdTFFQTRcXHUxRUE2XFx1MUVBOFxcdTFFQUFcXHUxRUFDXFx1MUVBRVxcdTFFQjBcXHUxRUIyXFx1MUVCNFxcdTFFQjZcXHUxRUI4XFx1MUVCQVxcdTFFQkNcXHUxRUJFXFx1MUVDMFxcdTFFQzJcXHUxRUM0XFx1MUVDNlxcdTFFQzhcXHUxRUNBXFx1MUVDQ1xcdTFFQ0VcXHUxRUQwXFx1MUVEMlxcdTFFRDRcXHUxRUQ2XFx1MUVEOFxcdTFFREFcXHUxRURDXFx1MUVERVxcdTFFRTBcXHUxRUUyXFx1MUVFNFxcdTFFRTZcXHUxRUU4XFx1MUVFQVxcdTFFRUNcXHUxRUVFXFx1MUVGMFxcdTFFRjJcXHUxRUY0XFx1MUVGNlxcdTFFRjhcXHUxRUZBXFx1MUVGQ1xcdTFFRkVcXHUxRjA4LVxcdTFGMEZcXHUxRjE4LVxcdTFGMURcXHUxRjI4LVxcdTFGMkZcXHUxRjM4LVxcdTFGM0ZcXHUxRjQ4LVxcdTFGNERcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGXFx1MUY2OC1cXHUxRjZGXFx1MUZCOC1cXHUxRkJCXFx1MUZDOC1cXHUxRkNCXFx1MUZEOC1cXHUxRkRCXFx1MUZFOC1cXHUxRkVDXFx1MUZGOC1cXHUxRkZCXFx1MjEwMlxcdTIxMDdcXHUyMTBCLVxcdTIxMERcXHUyMTEwLVxcdTIxMTJcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEzMC1cXHUyMTMzXFx1MjEzRVxcdTIxM0ZcXHUyMTQ1XFx1MjE4M1xcdTJDMDAtXFx1MkMyRVxcdTJDNjBcXHUyQzYyLVxcdTJDNjRcXHUyQzY3XFx1MkM2OVxcdTJDNkJcXHUyQzZELVxcdTJDNzBcXHUyQzcyXFx1MkM3NVxcdTJDN0UtXFx1MkM4MFxcdTJDODJcXHUyQzg0XFx1MkM4NlxcdTJDODhcXHUyQzhBXFx1MkM4Q1xcdTJDOEVcXHUyQzkwXFx1MkM5MlxcdTJDOTRcXHUyQzk2XFx1MkM5OFxcdTJDOUFcXHUyQzlDXFx1MkM5RVxcdTJDQTBcXHUyQ0EyXFx1MkNBNFxcdTJDQTZcXHUyQ0E4XFx1MkNBQVxcdTJDQUNcXHUyQ0FFXFx1MkNCMFxcdTJDQjJcXHUyQ0I0XFx1MkNCNlxcdTJDQjhcXHUyQ0JBXFx1MkNCQ1xcdTJDQkVcXHUyQ0MwXFx1MkNDMlxcdTJDQzRcXHUyQ0M2XFx1MkNDOFxcdTJDQ0FcXHUyQ0NDXFx1MkNDRVxcdTJDRDBcXHUyQ0QyXFx1MkNENFxcdTJDRDZcXHUyQ0Q4XFx1MkNEQVxcdTJDRENcXHUyQ0RFXFx1MkNFMFxcdTJDRTJcXHUyQ0VCXFx1MkNFRFxcdTJDRjJcXHVBNjQwXFx1QTY0MlxcdUE2NDRcXHVBNjQ2XFx1QTY0OFxcdUE2NEFcXHVBNjRDXFx1QTY0RVxcdUE2NTBcXHVBNjUyXFx1QTY1NFxcdUE2NTZcXHVBNjU4XFx1QTY1QVxcdUE2NUNcXHVBNjVFXFx1QTY2MFxcdUE2NjJcXHVBNjY0XFx1QTY2NlxcdUE2NjhcXHVBNjZBXFx1QTY2Q1xcdUE2ODBcXHVBNjgyXFx1QTY4NFxcdUE2ODZcXHVBNjg4XFx1QTY4QVxcdUE2OENcXHVBNjhFXFx1QTY5MFxcdUE2OTJcXHVBNjk0XFx1QTY5NlxcdUE2OThcXHVBNjlBXFx1QTcyMlxcdUE3MjRcXHVBNzI2XFx1QTcyOFxcdUE3MkFcXHVBNzJDXFx1QTcyRVxcdUE3MzJcXHVBNzM0XFx1QTczNlxcdUE3MzhcXHVBNzNBXFx1QTczQ1xcdUE3M0VcXHVBNzQwXFx1QTc0MlxcdUE3NDRcXHVBNzQ2XFx1QTc0OFxcdUE3NEFcXHVBNzRDXFx1QTc0RVxcdUE3NTBcXHVBNzUyXFx1QTc1NFxcdUE3NTZcXHVBNzU4XFx1QTc1QVxcdUE3NUNcXHVBNzVFXFx1QTc2MFxcdUE3NjJcXHVBNzY0XFx1QTc2NlxcdUE3NjhcXHVBNzZBXFx1QTc2Q1xcdUE3NkVcXHVBNzc5XFx1QTc3QlxcdUE3N0RcXHVBNzdFXFx1QTc4MFxcdUE3ODJcXHVBNzg0XFx1QTc4NlxcdUE3OEJcXHVBNzhEXFx1QTc5MFxcdUE3OTJcXHVBNzk2XFx1QTc5OFxcdUE3OUFcXHVBNzlDXFx1QTc5RVxcdUE3QTBcXHVBN0EyXFx1QTdBNFxcdUE3QTZcXHVBN0E4XFx1QTdBQS1cXHVBN0FEXFx1QTdCMC1cXHVBN0I0XFx1QTdCNlxcdUZGMjEtXFx1RkYzQV0pKFtBLVpcXHhDMC1cXHhENlxceEQ4LVxceERFXFx1MDEwMFxcdTAxMDJcXHUwMTA0XFx1MDEwNlxcdTAxMDhcXHUwMTBBXFx1MDEwQ1xcdTAxMEVcXHUwMTEwXFx1MDExMlxcdTAxMTRcXHUwMTE2XFx1MDExOFxcdTAxMUFcXHUwMTFDXFx1MDExRVxcdTAxMjBcXHUwMTIyXFx1MDEyNFxcdTAxMjZcXHUwMTI4XFx1MDEyQVxcdTAxMkNcXHUwMTJFXFx1MDEzMFxcdTAxMzJcXHUwMTM0XFx1MDEzNlxcdTAxMzlcXHUwMTNCXFx1MDEzRFxcdTAxM0ZcXHUwMTQxXFx1MDE0M1xcdTAxNDVcXHUwMTQ3XFx1MDE0QVxcdTAxNENcXHUwMTRFXFx1MDE1MFxcdTAxNTJcXHUwMTU0XFx1MDE1NlxcdTAxNThcXHUwMTVBXFx1MDE1Q1xcdTAxNUVcXHUwMTYwXFx1MDE2MlxcdTAxNjRcXHUwMTY2XFx1MDE2OFxcdTAxNkFcXHUwMTZDXFx1MDE2RVxcdTAxNzBcXHUwMTcyXFx1MDE3NFxcdTAxNzZcXHUwMTc4XFx1MDE3OVxcdTAxN0JcXHUwMTdEXFx1MDE4MVxcdTAxODJcXHUwMTg0XFx1MDE4NlxcdTAxODdcXHUwMTg5LVxcdTAxOEJcXHUwMThFLVxcdTAxOTFcXHUwMTkzXFx1MDE5NFxcdTAxOTYtXFx1MDE5OFxcdTAxOUNcXHUwMTlEXFx1MDE5RlxcdTAxQTBcXHUwMUEyXFx1MDFBNFxcdTAxQTZcXHUwMUE3XFx1MDFBOVxcdTAxQUNcXHUwMUFFXFx1MDFBRlxcdTAxQjEtXFx1MDFCM1xcdTAxQjVcXHUwMUI3XFx1MDFCOFxcdTAxQkNcXHUwMUM0XFx1MDFDN1xcdTAxQ0FcXHUwMUNEXFx1MDFDRlxcdTAxRDFcXHUwMUQzXFx1MDFENVxcdTAxRDdcXHUwMUQ5XFx1MDFEQlxcdTAxREVcXHUwMUUwXFx1MDFFMlxcdTAxRTRcXHUwMUU2XFx1MDFFOFxcdTAxRUFcXHUwMUVDXFx1MDFFRVxcdTAxRjFcXHUwMUY0XFx1MDFGNi1cXHUwMUY4XFx1MDFGQVxcdTAxRkNcXHUwMUZFXFx1MDIwMFxcdTAyMDJcXHUwMjA0XFx1MDIwNlxcdTAyMDhcXHUwMjBBXFx1MDIwQ1xcdTAyMEVcXHUwMjEwXFx1MDIxMlxcdTAyMTRcXHUwMjE2XFx1MDIxOFxcdTAyMUFcXHUwMjFDXFx1MDIxRVxcdTAyMjBcXHUwMjIyXFx1MDIyNFxcdTAyMjZcXHUwMjI4XFx1MDIyQVxcdTAyMkNcXHUwMjJFXFx1MDIzMFxcdTAyMzJcXHUwMjNBXFx1MDIzQlxcdTAyM0RcXHUwMjNFXFx1MDI0MVxcdTAyNDMtXFx1MDI0NlxcdTAyNDhcXHUwMjRBXFx1MDI0Q1xcdTAyNEVcXHUwMzcwXFx1MDM3MlxcdTAzNzZcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFXFx1MDM4RlxcdTAzOTEtXFx1MDNBMVxcdTAzQTMtXFx1MDNBQlxcdTAzQ0ZcXHUwM0QyLVxcdTAzRDRcXHUwM0Q4XFx1MDNEQVxcdTAzRENcXHUwM0RFXFx1MDNFMFxcdTAzRTJcXHUwM0U0XFx1MDNFNlxcdTAzRThcXHUwM0VBXFx1MDNFQ1xcdTAzRUVcXHUwM0Y0XFx1MDNGN1xcdTAzRjlcXHUwM0ZBXFx1MDNGRC1cXHUwNDJGXFx1MDQ2MFxcdTA0NjJcXHUwNDY0XFx1MDQ2NlxcdTA0NjhcXHUwNDZBXFx1MDQ2Q1xcdTA0NkVcXHUwNDcwXFx1MDQ3MlxcdTA0NzRcXHUwNDc2XFx1MDQ3OFxcdTA0N0FcXHUwNDdDXFx1MDQ3RVxcdTA0ODBcXHUwNDhBXFx1MDQ4Q1xcdTA0OEVcXHUwNDkwXFx1MDQ5MlxcdTA0OTRcXHUwNDk2XFx1MDQ5OFxcdTA0OUFcXHUwNDlDXFx1MDQ5RVxcdTA0QTBcXHUwNEEyXFx1MDRBNFxcdTA0QTZcXHUwNEE4XFx1MDRBQVxcdTA0QUNcXHUwNEFFXFx1MDRCMFxcdTA0QjJcXHUwNEI0XFx1MDRCNlxcdTA0QjhcXHUwNEJBXFx1MDRCQ1xcdTA0QkVcXHUwNEMwXFx1MDRDMVxcdTA0QzNcXHUwNEM1XFx1MDRDN1xcdTA0QzlcXHUwNENCXFx1MDRDRFxcdTA0RDBcXHUwNEQyXFx1MDRENFxcdTA0RDZcXHUwNEQ4XFx1MDREQVxcdTA0RENcXHUwNERFXFx1MDRFMFxcdTA0RTJcXHUwNEU0XFx1MDRFNlxcdTA0RThcXHUwNEVBXFx1MDRFQ1xcdTA0RUVcXHUwNEYwXFx1MDRGMlxcdTA0RjRcXHUwNEY2XFx1MDRGOFxcdTA0RkFcXHUwNEZDXFx1MDRGRVxcdTA1MDBcXHUwNTAyXFx1MDUwNFxcdTA1MDZcXHUwNTA4XFx1MDUwQVxcdTA1MENcXHUwNTBFXFx1MDUxMFxcdTA1MTJcXHUwNTE0XFx1MDUxNlxcdTA1MThcXHUwNTFBXFx1MDUxQ1xcdTA1MUVcXHUwNTIwXFx1MDUyMlxcdTA1MjRcXHUwNTI2XFx1MDUyOFxcdTA1MkFcXHUwNTJDXFx1MDUyRVxcdTA1MzEtXFx1MDU1NlxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTNBMC1cXHUxM0Y1XFx1MUUwMFxcdTFFMDJcXHUxRTA0XFx1MUUwNlxcdTFFMDhcXHUxRTBBXFx1MUUwQ1xcdTFFMEVcXHUxRTEwXFx1MUUxMlxcdTFFMTRcXHUxRTE2XFx1MUUxOFxcdTFFMUFcXHUxRTFDXFx1MUUxRVxcdTFFMjBcXHUxRTIyXFx1MUUyNFxcdTFFMjZcXHUxRTI4XFx1MUUyQVxcdTFFMkNcXHUxRTJFXFx1MUUzMFxcdTFFMzJcXHUxRTM0XFx1MUUzNlxcdTFFMzhcXHUxRTNBXFx1MUUzQ1xcdTFFM0VcXHUxRTQwXFx1MUU0MlxcdTFFNDRcXHUxRTQ2XFx1MUU0OFxcdTFFNEFcXHUxRTRDXFx1MUU0RVxcdTFFNTBcXHUxRTUyXFx1MUU1NFxcdTFFNTZcXHUxRTU4XFx1MUU1QVxcdTFFNUNcXHUxRTVFXFx1MUU2MFxcdTFFNjJcXHUxRTY0XFx1MUU2NlxcdTFFNjhcXHUxRTZBXFx1MUU2Q1xcdTFFNkVcXHUxRTcwXFx1MUU3MlxcdTFFNzRcXHUxRTc2XFx1MUU3OFxcdTFFN0FcXHUxRTdDXFx1MUU3RVxcdTFFODBcXHUxRTgyXFx1MUU4NFxcdTFFODZcXHUxRTg4XFx1MUU4QVxcdTFFOENcXHUxRThFXFx1MUU5MFxcdTFFOTJcXHUxRTk0XFx1MUU5RVxcdTFFQTBcXHUxRUEyXFx1MUVBNFxcdTFFQTZcXHUxRUE4XFx1MUVBQVxcdTFFQUNcXHUxRUFFXFx1MUVCMFxcdTFFQjJcXHUxRUI0XFx1MUVCNlxcdTFFQjhcXHUxRUJBXFx1MUVCQ1xcdTFFQkVcXHUxRUMwXFx1MUVDMlxcdTFFQzRcXHUxRUM2XFx1MUVDOFxcdTFFQ0FcXHUxRUNDXFx1MUVDRVxcdTFFRDBcXHUxRUQyXFx1MUVENFxcdTFFRDZcXHUxRUQ4XFx1MUVEQVxcdTFFRENcXHUxRURFXFx1MUVFMFxcdTFFRTJcXHUxRUU0XFx1MUVFNlxcdTFFRThcXHUxRUVBXFx1MUVFQ1xcdTFFRUVcXHUxRUYwXFx1MUVGMlxcdTFFRjRcXHUxRUY2XFx1MUVGOFxcdTFFRkFcXHUxRUZDXFx1MUVGRVxcdTFGMDgtXFx1MUYwRlxcdTFGMTgtXFx1MUYxRFxcdTFGMjgtXFx1MUYyRlxcdTFGMzgtXFx1MUYzRlxcdTFGNDgtXFx1MUY0RFxcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUZcXHUxRjY4LVxcdTFGNkZcXHUxRkI4LVxcdTFGQkJcXHUxRkM4LVxcdTFGQ0JcXHUxRkQ4LVxcdTFGREJcXHUxRkU4LVxcdTFGRUNcXHUxRkY4LVxcdTFGRkJcXHUyMTAyXFx1MjEwN1xcdTIxMEItXFx1MjEwRFxcdTIxMTAtXFx1MjExMlxcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTMwLVxcdTIxMzNcXHUyMTNFXFx1MjEzRlxcdTIxNDVcXHUyMTgzXFx1MkMwMC1cXHUyQzJFXFx1MkM2MFxcdTJDNjItXFx1MkM2NFxcdTJDNjdcXHUyQzY5XFx1MkM2QlxcdTJDNkQtXFx1MkM3MFxcdTJDNzJcXHUyQzc1XFx1MkM3RS1cXHUyQzgwXFx1MkM4MlxcdTJDODRcXHUyQzg2XFx1MkM4OFxcdTJDOEFcXHUyQzhDXFx1MkM4RVxcdTJDOTBcXHUyQzkyXFx1MkM5NFxcdTJDOTZcXHUyQzk4XFx1MkM5QVxcdTJDOUNcXHUyQzlFXFx1MkNBMFxcdTJDQTJcXHUyQ0E0XFx1MkNBNlxcdTJDQThcXHUyQ0FBXFx1MkNBQ1xcdTJDQUVcXHUyQ0IwXFx1MkNCMlxcdTJDQjRcXHUyQ0I2XFx1MkNCOFxcdTJDQkFcXHUyQ0JDXFx1MkNCRVxcdTJDQzBcXHUyQ0MyXFx1MkNDNFxcdTJDQzZcXHUyQ0M4XFx1MkNDQVxcdTJDQ0NcXHUyQ0NFXFx1MkNEMFxcdTJDRDJcXHUyQ0Q0XFx1MkNENlxcdTJDRDhcXHUyQ0RBXFx1MkNEQ1xcdTJDREVcXHUyQ0UwXFx1MkNFMlxcdTJDRUJcXHUyQ0VEXFx1MkNGMlxcdUE2NDBcXHVBNjQyXFx1QTY0NFxcdUE2NDZcXHVBNjQ4XFx1QTY0QVxcdUE2NENcXHVBNjRFXFx1QTY1MFxcdUE2NTJcXHVBNjU0XFx1QTY1NlxcdUE2NThcXHVBNjVBXFx1QTY1Q1xcdUE2NUVcXHVBNjYwXFx1QTY2MlxcdUE2NjRcXHVBNjY2XFx1QTY2OFxcdUE2NkFcXHVBNjZDXFx1QTY4MFxcdUE2ODJcXHVBNjg0XFx1QTY4NlxcdUE2ODhcXHVBNjhBXFx1QTY4Q1xcdUE2OEVcXHVBNjkwXFx1QTY5MlxcdUE2OTRcXHVBNjk2XFx1QTY5OFxcdUE2OUFcXHVBNzIyXFx1QTcyNFxcdUE3MjZcXHVBNzI4XFx1QTcyQVxcdUE3MkNcXHVBNzJFXFx1QTczMlxcdUE3MzRcXHVBNzM2XFx1QTczOFxcdUE3M0FcXHVBNzNDXFx1QTczRVxcdUE3NDBcXHVBNzQyXFx1QTc0NFxcdUE3NDZcXHVBNzQ4XFx1QTc0QVxcdUE3NENcXHVBNzRFXFx1QTc1MFxcdUE3NTJcXHVBNzU0XFx1QTc1NlxcdUE3NThcXHVBNzVBXFx1QTc1Q1xcdUE3NUVcXHVBNzYwXFx1QTc2MlxcdUE3NjRcXHVBNzY2XFx1QTc2OFxcdUE3NkFcXHVBNzZDXFx1QTc2RVxcdUE3NzlcXHVBNzdCXFx1QTc3RFxcdUE3N0VcXHVBNzgwXFx1QTc4MlxcdUE3ODRcXHVBNzg2XFx1QTc4QlxcdUE3OERcXHVBNzkwXFx1QTc5MlxcdUE3OTZcXHVBNzk4XFx1QTc5QVxcdUE3OUNcXHVBNzlFXFx1QTdBMFxcdUE3QTJcXHVBN0E0XFx1QTdBNlxcdUE3QThcXHVBN0FBLVxcdUE3QURcXHVBN0IwLVxcdUE3QjRcXHVBN0I2XFx1RkYyMS1cXHVGRjNBXVthLXpcXHhCNVxceERGLVxceEY2XFx4RjgtXFx4RkZcXHUwMTAxXFx1MDEwM1xcdTAxMDVcXHUwMTA3XFx1MDEwOVxcdTAxMEJcXHUwMTBEXFx1MDEwRlxcdTAxMTFcXHUwMTEzXFx1MDExNVxcdTAxMTdcXHUwMTE5XFx1MDExQlxcdTAxMURcXHUwMTFGXFx1MDEyMVxcdTAxMjNcXHUwMTI1XFx1MDEyN1xcdTAxMjlcXHUwMTJCXFx1MDEyRFxcdTAxMkZcXHUwMTMxXFx1MDEzM1xcdTAxMzVcXHUwMTM3XFx1MDEzOFxcdTAxM0FcXHUwMTNDXFx1MDEzRVxcdTAxNDBcXHUwMTQyXFx1MDE0NFxcdTAxNDZcXHUwMTQ4XFx1MDE0OVxcdTAxNEJcXHUwMTREXFx1MDE0RlxcdTAxNTFcXHUwMTUzXFx1MDE1NVxcdTAxNTdcXHUwMTU5XFx1MDE1QlxcdTAxNURcXHUwMTVGXFx1MDE2MVxcdTAxNjNcXHUwMTY1XFx1MDE2N1xcdTAxNjlcXHUwMTZCXFx1MDE2RFxcdTAxNkZcXHUwMTcxXFx1MDE3M1xcdTAxNzVcXHUwMTc3XFx1MDE3QVxcdTAxN0NcXHUwMTdFLVxcdTAxODBcXHUwMTgzXFx1MDE4NVxcdTAxODhcXHUwMThDXFx1MDE4RFxcdTAxOTJcXHUwMTk1XFx1MDE5OS1cXHUwMTlCXFx1MDE5RVxcdTAxQTFcXHUwMUEzXFx1MDFBNVxcdTAxQThcXHUwMUFBXFx1MDFBQlxcdTAxQURcXHUwMUIwXFx1MDFCNFxcdTAxQjZcXHUwMUI5XFx1MDFCQVxcdTAxQkQtXFx1MDFCRlxcdTAxQzZcXHUwMUM5XFx1MDFDQ1xcdTAxQ0VcXHUwMUQwXFx1MDFEMlxcdTAxRDRcXHUwMUQ2XFx1MDFEOFxcdTAxREFcXHUwMURDXFx1MDFERFxcdTAxREZcXHUwMUUxXFx1MDFFM1xcdTAxRTVcXHUwMUU3XFx1MDFFOVxcdTAxRUJcXHUwMUVEXFx1MDFFRlxcdTAxRjBcXHUwMUYzXFx1MDFGNVxcdTAxRjlcXHUwMUZCXFx1MDFGRFxcdTAxRkZcXHUwMjAxXFx1MDIwM1xcdTAyMDVcXHUwMjA3XFx1MDIwOVxcdTAyMEJcXHUwMjBEXFx1MDIwRlxcdTAyMTFcXHUwMjEzXFx1MDIxNVxcdTAyMTdcXHUwMjE5XFx1MDIxQlxcdTAyMURcXHUwMjFGXFx1MDIyMVxcdTAyMjNcXHUwMjI1XFx1MDIyN1xcdTAyMjlcXHUwMjJCXFx1MDIyRFxcdTAyMkZcXHUwMjMxXFx1MDIzMy1cXHUwMjM5XFx1MDIzQ1xcdTAyM0ZcXHUwMjQwXFx1MDI0MlxcdTAyNDdcXHUwMjQ5XFx1MDI0QlxcdTAyNERcXHUwMjRGLVxcdTAyOTNcXHUwMjk1LVxcdTAyQUZcXHUwMzcxXFx1MDM3M1xcdTAzNzdcXHUwMzdCLVxcdTAzN0RcXHUwMzkwXFx1MDNBQy1cXHUwM0NFXFx1MDNEMFxcdTAzRDFcXHUwM0Q1LVxcdTAzRDdcXHUwM0Q5XFx1MDNEQlxcdTAzRERcXHUwM0RGXFx1MDNFMVxcdTAzRTNcXHUwM0U1XFx1MDNFN1xcdTAzRTlcXHUwM0VCXFx1MDNFRFxcdTAzRUYtXFx1MDNGM1xcdTAzRjVcXHUwM0Y4XFx1MDNGQlxcdTAzRkNcXHUwNDMwLVxcdTA0NUZcXHUwNDYxXFx1MDQ2M1xcdTA0NjVcXHUwNDY3XFx1MDQ2OVxcdTA0NkJcXHUwNDZEXFx1MDQ2RlxcdTA0NzFcXHUwNDczXFx1MDQ3NVxcdTA0NzdcXHUwNDc5XFx1MDQ3QlxcdTA0N0RcXHUwNDdGXFx1MDQ4MVxcdTA0OEJcXHUwNDhEXFx1MDQ4RlxcdTA0OTFcXHUwNDkzXFx1MDQ5NVxcdTA0OTdcXHUwNDk5XFx1MDQ5QlxcdTA0OURcXHUwNDlGXFx1MDRBMVxcdTA0QTNcXHUwNEE1XFx1MDRBN1xcdTA0QTlcXHUwNEFCXFx1MDRBRFxcdTA0QUZcXHUwNEIxXFx1MDRCM1xcdTA0QjVcXHUwNEI3XFx1MDRCOVxcdTA0QkJcXHUwNEJEXFx1MDRCRlxcdTA0QzJcXHUwNEM0XFx1MDRDNlxcdTA0QzhcXHUwNENBXFx1MDRDQ1xcdTA0Q0VcXHUwNENGXFx1MDREMVxcdTA0RDNcXHUwNEQ1XFx1MDREN1xcdTA0RDlcXHUwNERCXFx1MDRERFxcdTA0REZcXHUwNEUxXFx1MDRFM1xcdTA0RTVcXHUwNEU3XFx1MDRFOVxcdTA0RUJcXHUwNEVEXFx1MDRFRlxcdTA0RjFcXHUwNEYzXFx1MDRGNVxcdTA0RjdcXHUwNEY5XFx1MDRGQlxcdTA0RkRcXHUwNEZGXFx1MDUwMVxcdTA1MDNcXHUwNTA1XFx1MDUwN1xcdTA1MDlcXHUwNTBCXFx1MDUwRFxcdTA1MEZcXHUwNTExXFx1MDUxM1xcdTA1MTVcXHUwNTE3XFx1MDUxOVxcdTA1MUJcXHUwNTFEXFx1MDUxRlxcdTA1MjFcXHUwNTIzXFx1MDUyNVxcdTA1MjdcXHUwNTI5XFx1MDUyQlxcdTA1MkRcXHUwNTJGXFx1MDU2MS1cXHUwNTg3XFx1MTNGOC1cXHUxM0ZEXFx1MUQwMC1cXHUxRDJCXFx1MUQ2Qi1cXHUxRDc3XFx1MUQ3OS1cXHUxRDlBXFx1MUUwMVxcdTFFMDNcXHUxRTA1XFx1MUUwN1xcdTFFMDlcXHUxRTBCXFx1MUUwRFxcdTFFMEZcXHUxRTExXFx1MUUxM1xcdTFFMTVcXHUxRTE3XFx1MUUxOVxcdTFFMUJcXHUxRTFEXFx1MUUxRlxcdTFFMjFcXHUxRTIzXFx1MUUyNVxcdTFFMjdcXHUxRTI5XFx1MUUyQlxcdTFFMkRcXHUxRTJGXFx1MUUzMVxcdTFFMzNcXHUxRTM1XFx1MUUzN1xcdTFFMzlcXHUxRTNCXFx1MUUzRFxcdTFFM0ZcXHUxRTQxXFx1MUU0M1xcdTFFNDVcXHUxRTQ3XFx1MUU0OVxcdTFFNEJcXHUxRTREXFx1MUU0RlxcdTFFNTFcXHUxRTUzXFx1MUU1NVxcdTFFNTdcXHUxRTU5XFx1MUU1QlxcdTFFNURcXHUxRTVGXFx1MUU2MVxcdTFFNjNcXHUxRTY1XFx1MUU2N1xcdTFFNjlcXHUxRTZCXFx1MUU2RFxcdTFFNkZcXHUxRTcxXFx1MUU3M1xcdTFFNzVcXHUxRTc3XFx1MUU3OVxcdTFFN0JcXHUxRTdEXFx1MUU3RlxcdTFFODFcXHUxRTgzXFx1MUU4NVxcdTFFODdcXHUxRTg5XFx1MUU4QlxcdTFFOERcXHUxRThGXFx1MUU5MVxcdTFFOTNcXHUxRTk1LVxcdTFFOURcXHUxRTlGXFx1MUVBMVxcdTFFQTNcXHUxRUE1XFx1MUVBN1xcdTFFQTlcXHUxRUFCXFx1MUVBRFxcdTFFQUZcXHUxRUIxXFx1MUVCM1xcdTFFQjVcXHUxRUI3XFx1MUVCOVxcdTFFQkJcXHUxRUJEXFx1MUVCRlxcdTFFQzFcXHUxRUMzXFx1MUVDNVxcdTFFQzdcXHUxRUM5XFx1MUVDQlxcdTFFQ0RcXHUxRUNGXFx1MUVEMVxcdTFFRDNcXHUxRUQ1XFx1MUVEN1xcdTFFRDlcXHUxRURCXFx1MUVERFxcdTFFREZcXHUxRUUxXFx1MUVFM1xcdTFFRTVcXHUxRUU3XFx1MUVFOVxcdTFFRUJcXHUxRUVEXFx1MUVFRlxcdTFFRjFcXHUxRUYzXFx1MUVGNVxcdTFFRjdcXHUxRUY5XFx1MUVGQlxcdTFFRkRcXHUxRUZGLVxcdTFGMDdcXHUxRjEwLVxcdTFGMTVcXHUxRjIwLVxcdTFGMjdcXHUxRjMwLVxcdTFGMzdcXHUxRjQwLVxcdTFGNDVcXHUxRjUwLVxcdTFGNTdcXHUxRjYwLVxcdTFGNjdcXHUxRjcwLVxcdTFGN0RcXHUxRjgwLVxcdTFGODdcXHUxRjkwLVxcdTFGOTdcXHUxRkEwLVxcdTFGQTdcXHUxRkIwLVxcdTFGQjRcXHUxRkI2XFx1MUZCN1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2XFx1MUZDN1xcdTFGRDAtXFx1MUZEM1xcdTFGRDZcXHUxRkQ3XFx1MUZFMC1cXHUxRkU3XFx1MUZGMi1cXHUxRkY0XFx1MUZGNlxcdTFGRjdcXHUyMTBBXFx1MjEwRVxcdTIxMEZcXHUyMTEzXFx1MjEyRlxcdTIxMzRcXHUyMTM5XFx1MjEzQ1xcdTIxM0RcXHUyMTQ2LVxcdTIxNDlcXHUyMTRFXFx1MjE4NFxcdTJDMzAtXFx1MkM1RVxcdTJDNjFcXHUyQzY1XFx1MkM2NlxcdTJDNjhcXHUyQzZBXFx1MkM2Q1xcdTJDNzFcXHUyQzczXFx1MkM3NFxcdTJDNzYtXFx1MkM3QlxcdTJDODFcXHUyQzgzXFx1MkM4NVxcdTJDODdcXHUyQzg5XFx1MkM4QlxcdTJDOERcXHUyQzhGXFx1MkM5MVxcdTJDOTNcXHUyQzk1XFx1MkM5N1xcdTJDOTlcXHUyQzlCXFx1MkM5RFxcdTJDOUZcXHUyQ0ExXFx1MkNBM1xcdTJDQTVcXHUyQ0E3XFx1MkNBOVxcdTJDQUJcXHUyQ0FEXFx1MkNBRlxcdTJDQjFcXHUyQ0IzXFx1MkNCNVxcdTJDQjdcXHUyQ0I5XFx1MkNCQlxcdTJDQkRcXHUyQ0JGXFx1MkNDMVxcdTJDQzNcXHUyQ0M1XFx1MkNDN1xcdTJDQzlcXHUyQ0NCXFx1MkNDRFxcdTJDQ0ZcXHUyQ0QxXFx1MkNEM1xcdTJDRDVcXHUyQ0Q3XFx1MkNEOVxcdTJDREJcXHUyQ0REXFx1MkNERlxcdTJDRTFcXHUyQ0UzXFx1MkNFNFxcdTJDRUNcXHUyQ0VFXFx1MkNGM1xcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1QTY0MVxcdUE2NDNcXHVBNjQ1XFx1QTY0N1xcdUE2NDlcXHVBNjRCXFx1QTY0RFxcdUE2NEZcXHVBNjUxXFx1QTY1M1xcdUE2NTVcXHVBNjU3XFx1QTY1OVxcdUE2NUJcXHVBNjVEXFx1QTY1RlxcdUE2NjFcXHVBNjYzXFx1QTY2NVxcdUE2NjdcXHVBNjY5XFx1QTY2QlxcdUE2NkRcXHVBNjgxXFx1QTY4M1xcdUE2ODVcXHVBNjg3XFx1QTY4OVxcdUE2OEJcXHVBNjhEXFx1QTY4RlxcdUE2OTFcXHVBNjkzXFx1QTY5NVxcdUE2OTdcXHVBNjk5XFx1QTY5QlxcdUE3MjNcXHVBNzI1XFx1QTcyN1xcdUE3MjlcXHVBNzJCXFx1QTcyRFxcdUE3MkYtXFx1QTczMVxcdUE3MzNcXHVBNzM1XFx1QTczN1xcdUE3MzlcXHVBNzNCXFx1QTczRFxcdUE3M0ZcXHVBNzQxXFx1QTc0M1xcdUE3NDVcXHVBNzQ3XFx1QTc0OVxcdUE3NEJcXHVBNzREXFx1QTc0RlxcdUE3NTFcXHVBNzUzXFx1QTc1NVxcdUE3NTdcXHVBNzU5XFx1QTc1QlxcdUE3NURcXHVBNzVGXFx1QTc2MVxcdUE3NjNcXHVBNzY1XFx1QTc2N1xcdUE3NjlcXHVBNzZCXFx1QTc2RFxcdUE3NkZcXHVBNzcxLVxcdUE3NzhcXHVBNzdBXFx1QTc3Q1xcdUE3N0ZcXHVBNzgxXFx1QTc4M1xcdUE3ODVcXHVBNzg3XFx1QTc4Q1xcdUE3OEVcXHVBNzkxXFx1QTc5My1cXHVBNzk1XFx1QTc5N1xcdUE3OTlcXHVBNzlCXFx1QTc5RFxcdUE3OUZcXHVBN0ExXFx1QTdBM1xcdUE3QTVcXHVBN0E3XFx1QTdBOVxcdUE3QjVcXHVBN0I3XFx1QTdGQVxcdUFCMzAtXFx1QUI1QVxcdUFCNjAtXFx1QUI2NVxcdUFCNzAtXFx1QUJCRlxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZGNDEtXFx1RkY1QV0pL2dcbiIsInZhciBsb3dlckNhc2UgPSByZXF1aXJlKCdsb3dlci1jYXNlJylcblxudmFyIE5PTl9XT1JEX1JFR0VYUCA9IHJlcXVpcmUoJy4vdmVuZG9yL25vbi13b3JkLXJlZ2V4cCcpXG52YXIgQ0FNRUxfQ0FTRV9SRUdFWFAgPSByZXF1aXJlKCcuL3ZlbmRvci9jYW1lbC1jYXNlLXJlZ2V4cCcpXG52YXIgQ0FNRUxfQ0FTRV9VUFBFUl9SRUdFWFAgPSByZXF1aXJlKCcuL3ZlbmRvci9jYW1lbC1jYXNlLXVwcGVyLXJlZ2V4cCcpXG5cbi8qKlxuICogU2VudGVuY2UgY2FzZSBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICogQHBhcmFtICB7c3RyaW5nfSBsb2NhbGVcbiAqIEBwYXJhbSAge3N0cmluZ30gcmVwbGFjZW1lbnRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyLCBsb2NhbGUsIHJlcGxhY2VtZW50KSB7XG4gIGlmIChzdHIgPT0gbnVsbCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgcmVwbGFjZW1lbnQgPSB0eXBlb2YgcmVwbGFjZW1lbnQgIT09ICdzdHJpbmcnID8gJyAnIDogcmVwbGFjZW1lbnRcblxuICBmdW5jdGlvbiByZXBsYWNlIChtYXRjaCwgaW5kZXgsIHZhbHVlKSB7XG4gICAgaWYgKGluZGV4ID09PSAwIHx8IGluZGV4ID09PSAodmFsdWUubGVuZ3RoIC0gbWF0Y2gubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcGxhY2VtZW50XG4gIH1cblxuICBzdHIgPSBTdHJpbmcoc3RyKVxuICAgIC8vIFN1cHBvcnQgY2FtZWwgY2FzZSAoXCJjYW1lbENhc2VcIiAtPiBcImNhbWVsIENhc2VcIikuXG4gICAgLnJlcGxhY2UoQ0FNRUxfQ0FTRV9SRUdFWFAsICckMSAkMicpXG4gICAgLy8gU3VwcG9ydCBvZGQgY2FtZWwgY2FzZSAoXCJDQU1FTENhc2VcIiAtPiBcIkNBTUVMIENhc2VcIikuXG4gICAgLnJlcGxhY2UoQ0FNRUxfQ0FTRV9VUFBFUl9SRUdFWFAsICckMSAkMicpXG4gICAgLy8gUmVtb3ZlIGFsbCBub24td29yZCBjaGFyYWN0ZXJzIGFuZCByZXBsYWNlIHdpdGggYSBzaW5nbGUgc3BhY2UuXG4gICAgLnJlcGxhY2UoTk9OX1dPUkRfUkVHRVhQLCByZXBsYWNlKVxuXG4gIC8vIExvd2VyIGNhc2UgdGhlIGVudGlyZSBzdHJpbmcuXG4gIHJldHVybiBsb3dlckNhc2Uoc3RyLCBsb2NhbGUpXG59XG4iLCJ2YXIgdXBwZXJDYXNlID0gcmVxdWlyZSgndXBwZXItY2FzZScpXG52YXIgbm9DYXNlID0gcmVxdWlyZSgnbm8tY2FzZScpXG5cbi8qKlxuICogQ2FtZWwgY2FzZSBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IFtsb2NhbGVdXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlLCBsb2NhbGUsIG1lcmdlTnVtYmVycykge1xuICB2YXIgcmVzdWx0ID0gbm9DYXNlKHZhbHVlLCBsb2NhbGUpXG5cbiAgLy8gUmVwbGFjZSBwZXJpb2RzIGJldHdlZW4gbnVtZXJpYyBlbnRpdGllcyB3aXRoIGFuIHVuZGVyc2NvcmUuXG4gIGlmICghbWVyZ2VOdW1iZXJzKSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoLyAoPz1cXGQpL2csICdfJylcbiAgfVxuXG4gIC8vIFJlcGxhY2Ugc3BhY2VzIGJldHdlZW4gd29yZHMgd2l0aCBhbiB1cHBlciBjYXNlZCBjaGFyYWN0ZXIuXG4gIHJldHVybiByZXN1bHQucmVwbGFjZSgvICguKS9nLCBmdW5jdGlvbiAobSwgJDEpIHtcbiAgICByZXR1cm4gdXBwZXJDYXNlKCQxLCBsb2NhbGUpXG4gIH0pXG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBjYW1lbF9jYXNlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImNhbWVsLWNhc2VcIikpO1xuZXhwb3J0cy5jYW1lbENhc2UgPSBjYW1lbF9jYXNlXzEuZGVmYXVsdDtcbnZhciBsb3dlcl9jYXNlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImxvd2VyLWNhc2VcIikpO1xuZXhwb3J0cy5sb3dlcmNhc2UgPSBsb3dlcl9jYXNlXzEuZGVmYXVsdDtcbnZhciB1cHBlcl9jYXNlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInVwcGVyLWNhc2VcIikpO1xuZXhwb3J0cy51cHBlcmNhc2UgPSB1cHBlcl9jYXNlXzEuZGVmYXVsdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGFuc2lSZWdleCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF0dGVybiA9IFtcbiAgICAgICAgJ1tcXFxcdTAwMUJcXFxcdTAwOUJdW1tcXFxcXSgpIzs/XSooPzooPzooPzpbYS16QS1aXFxcXGRdKig/OjtbYS16QS1aXFxcXGRdKikqKT9cXFxcdTAwMDcpJyxcbiAgICAgICAgJyg/Oig/OlxcXFxkezEsNH0oPzo7XFxcXGR7MCw0fSkqKT9bXFxcXGRBLVBSWmNmLW50cXJ5PT48fl0pKSdcbiAgICBdLmpvaW4oJ3wnKTtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChwYXR0ZXJuLCAnZycpO1xufTtcbnZhciByZWdleCA9ICdbXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdJztcbnZhciBhc3RyYWxSZWdleCA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgcmV0dXJuIG9wdHMgJiYgb3B0cy5leGFjdCA/IG5ldyBSZWdFeHAoXCJeXCIgKyByZWdleCArIFwiJFwiKSA6IG5ldyBSZWdFeHAocmVnZXgsICdnJyk7XG59O1xudmFyIHN0cmlwQW5zaSA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnID8gaW5wdXQucmVwbGFjZShhbnNpUmVnZXgoKSwgJycpIDogaW5wdXQ7XG59O1xuZXhwb3J0cy5zdHJpbmdMZW5ndGggPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICByZXR1cm4gc3RyaXBBbnNpKGlucHV0KS5yZXBsYWNlKGFzdHJhbFJlZ2V4KCksICcgJykubGVuZ3RoO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVzdHJ1Y3RvckNvbnRleHQgPSBleHBvcnRzLmJyYWNlQ29udGV4dCA9IGV4cG9ydHMucGFyZW5Db250ZXh0ID0gZXhwb3J0cy5icmFja2V0RENvbnRleHQgPSBleHBvcnRzLmJyYWNrZXRBcnJheUNvbnRleHQgPSBleHBvcnRzLmJyYWNrZXRDb250ZXh0ID0gdm9pZCAwO1xudmFyIENvbnRleHRUeXBlID0gZnVuY3Rpb24gKGZsYWcsIHByb3BzKSB7XG4gICAgcmV0dXJuIF9fYXNzaWduKHsgZmxhZzogZmxhZyB9LCBwcm9wcyk7XG59O1xuZXhwb3J0cy5icmFja2V0Q29udGV4dCA9IENvbnRleHRUeXBlKFwiW11cIik7XG5leHBvcnRzLmJyYWNrZXRBcnJheUNvbnRleHQgPSBDb250ZXh0VHlwZShcIltcXFxcZF1cIik7XG5leHBvcnRzLmJyYWNrZXREQ29udGV4dCA9IENvbnRleHRUeXBlKFwiW1tdXVwiKTtcbmV4cG9ydHMucGFyZW5Db250ZXh0ID0gQ29udGV4dFR5cGUoXCIoKVwiKTtcbmV4cG9ydHMuYnJhY2VDb250ZXh0ID0gQ29udGV4dFR5cGUoXCJ7fVwiKTtcbmV4cG9ydHMuZGVzdHJ1Y3RvckNvbnRleHQgPSBDb250ZXh0VHlwZShcInt4fVwiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZW9mVG9rID0gZXhwb3J0cy5leHBhbmRUb2sgPSBleHBvcnRzLmlnbm9yZVRvayA9IGV4cG9ydHMuY29tbWFUb2sgPSBleHBvcnRzLnBhcmVuUlRvayA9IGV4cG9ydHMucGFyZW5MVG9rID0gZXhwb3J0cy5icmFja2V0RFJUb2sgPSBleHBvcnRzLmJyYWNrZXRETFRvayA9IGV4cG9ydHMuYnJhY2tldFJUb2sgPSBleHBvcnRzLmJyYWNrZXRMVG9rID0gZXhwb3J0cy5icmFjZVJUb2sgPSBleHBvcnRzLmJyYWNlTFRvayA9IGV4cG9ydHMuY29sb25Ub2sgPSBleHBvcnRzLmJhbmdUb2sgPSBleHBvcnRzLmRvdFRvayA9IGV4cG9ydHMuc3RhclRvayA9IGV4cG9ydHMubmFtZVRvayA9IHZvaWQgMDtcbnZhciBjb250ZXh0c18xID0gcmVxdWlyZShcIi4vY29udGV4dHNcIik7XG52YXIgVG9rZW5UeXBlID0gZnVuY3Rpb24gKGZsYWcsIHByb3BzKSB7XG4gICAgcmV0dXJuIF9fYXNzaWduKHsgZmxhZzogZmxhZyB9LCBwcm9wcyk7XG59O1xuZXhwb3J0cy5uYW1lVG9rID0gVG9rZW5UeXBlKCduYW1lJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIChuZXh0ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8XG4gICAgICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0UlRvayB8fFxuICAgICAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2VSVG9rIHx8XG4gICAgICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5jb2xvblRvayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuZXh0ID09PSBleHBvcnRzLmRvdFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5jb21tYVRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5lb2ZUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldFJUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMucGFyZW5SVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmNvbG9uVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmV4cGFuZFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0TFRvayk7XG4gICAgfVxufSk7XG5leHBvcnRzLnN0YXJUb2sgPSBUb2tlblR5cGUoJyonLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIChuZXh0ID09PSBleHBvcnRzLmRvdFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5zdGFyVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLnBhcmVuTFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0TFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5lb2ZUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuY29tbWFUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMucGFyZW5SVG9rKTtcbiAgICB9XG59KTtcbmV4cG9ydHMuZG90VG9rID0gVG9rZW5UeXBlKCcuJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHJldHVybiAobmV4dCA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRETFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5zdGFyVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNlTFRvayk7XG4gICAgfSxcbiAgICBleHBlY3RQcmV2OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICByZXR1cm4gKHByZXYgPT09IGV4cG9ydHMubmFtZVRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5icmFja2V0RFJUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMuc3RhclRvayB8fFxuICAgICAgICAgICAgcHJldiA9PT0gZXhwb3J0cy5wYXJlblJUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMuYnJhY2tldFJUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMuZXhwYW5kVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLmJyYWNlUlRvayk7XG4gICAgfVxufSk7XG5leHBvcnRzLmJhbmdUb2sgPSBUb2tlblR5cGUoJyEnLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMubmFtZVRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRETFRvaztcbiAgICB9XG59KTtcbmV4cG9ydHMuY29sb25Ub2sgPSBUb2tlblR5cGUoJzonLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2VMVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2tldExUb2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMubmFtZVRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRETFRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRSVG9rO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5icmFjZUxUb2sgPSBUb2tlblR5cGUoJ3snLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMubmFtZVRvaztcbiAgICB9LFxuICAgIGV4cGVjdFByZXY6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHByZXYgPT09IGV4cG9ydHMuY29sb25Ub2sgfHwgcHJldiA9PT0gZXhwb3J0cy5jb21tYVRvayB8fCBwcmV2ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcmV2ID09PSBleHBvcnRzLmRvdFRvayB8fCBwcmV2ID09PSBleHBvcnRzLmNvbG9uVG9rO1xuICAgIH0sXG4gICAgdXBkYXRlQ29udGV4dDogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnB1c2goY29udGV4dHNfMS5icmFjZUNvbnRleHQpO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5icmFjZVJUb2sgPSBUb2tlblR5cGUoJ30nLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5jb21tYVRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNlUlRvayB8fCBuZXh0ID09PSBleHBvcnRzLmVvZlRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRSVG9rO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0ID09PSBleHBvcnRzLmRvdFRvayB8fCBuZXh0ID09PSBleHBvcnRzLmVvZlRvaztcbiAgICB9LFxuICAgIGV4cGVjdFByZXY6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIHJldHVybiBwcmV2ID09PSBleHBvcnRzLm5hbWVUb2sgfHwgcHJldiA9PT0gZXhwb3J0cy5icmFjZVJUb2sgfHwgcHJldiA9PT0gZXhwb3J0cy5icmFja2V0UlRvaztcbiAgICB9LFxuICAgIHVwZGF0ZUNvbnRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnBvcChjb250ZXh0c18xLmJyYWNlQ29udGV4dCk7XG4gICAgfVxufSk7XG5leHBvcnRzLmJyYWNrZXRMVG9rID0gVG9rZW5UeXBlKCdbJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMubmFtZVRvayB8fCBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rIHx8IG5leHQgPT09IGV4cG9ydHMuYnJhY2VMVG9rO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAobmV4dCA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRETFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5jb2xvblRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0TFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5pZ25vcmVUb2spO1xuICAgIH0sXG4gICAgZXhwZWN0UHJldjogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJldiA9PT0gZXhwb3J0cy5jb2xvblRvayB8fCBwcmV2ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8IHByZXYgPT09IGV4cG9ydHMuYnJhY2tldExUb2s7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChwcmV2ID09PSBleHBvcnRzLnN0YXJUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMuYnJhY2tldExUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMuZG90VG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09PSBleHBvcnRzLm5hbWVUb2sgfHxcbiAgICAgICAgICAgIHByZXYgPT09IGV4cG9ydHMucGFyZW5MVG9rIHx8XG4gICAgICAgICAgICBwcmV2ID09IGV4cG9ydHMuY29tbWFUb2spO1xuICAgIH0sXG4gICAgdXBkYXRlQ29udGV4dDogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnB1c2goY29udGV4dHNfMS5icmFja2V0Q29udGV4dCk7XG4gICAgfVxufSk7XG5leHBvcnRzLmJyYWNrZXRSVG9rID0gVG9rZW5UeXBlKCddJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzQ29udGV4dChjb250ZXh0c18xLmRlc3RydWN0b3JDb250ZXh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMuY29tbWFUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFjZVJUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0UlRvayB8fCBuZXh0ID09PSBleHBvcnRzLmVvZlRvaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG5leHQgPT09IGV4cG9ydHMuZG90VG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmVvZlRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5jb21tYVRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5wYXJlblJUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldFJUb2spO1xuICAgIH0sXG4gICAgdXBkYXRlQ29udGV4dDogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuYnJhY2tldEFycmF5Q29udGV4dCkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICghdGhpcy5pbmNsdWRlc0NvbnRleHQoY29udGV4dHNfMS5icmFja2V0Q29udGV4dCkpXG4gICAgICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0KCk7XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wb3AoKTtcbiAgICB9XG59KTtcbmV4cG9ydHMuYnJhY2tldERMVG9rID0gVG9rZW5UeXBlKCdbWycsIHtcbiAgICB1cGRhdGVDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wdXNoKGNvbnRleHRzXzEuYnJhY2tldERDb250ZXh0KTtcbiAgICB9XG59KTtcbmV4cG9ydHMuYnJhY2tldERSVG9rID0gVG9rZW5UeXBlKCddXScsIHtcbiAgICB1cGRhdGVDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckNvbnRleHQoKSAhPT0gY29udGV4dHNfMS5icmFja2V0RENvbnRleHQpXG4gICAgICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0KCk7XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wb3AoKTtcbiAgICB9XG59KTtcbmV4cG9ydHMucGFyZW5MVG9rID0gVG9rZW5UeXBlKCcoJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHJldHVybiAobmV4dCA9PT0gZXhwb3J0cy5uYW1lVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRETFRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5iYW5nVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmJyYWNrZXRMVG9rKTtcbiAgICB9LFxuICAgIGV4cGVjdFByZXY6IGZ1bmN0aW9uIChwcmV2KSB7XG4gICAgICAgIHJldHVybiBwcmV2ID09PSBleHBvcnRzLnN0YXJUb2s7XG4gICAgfSxcbiAgICB1cGRhdGVDb250ZXh0OiBmdW5jdGlvbiAocHJldikge1xuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQucHVzaChjb250ZXh0c18xLnBhcmVuQ29udGV4dCk7XG4gICAgfVxufSk7XG5leHBvcnRzLnBhcmVuUlRvayA9IFRva2VuVHlwZSgnKScsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gbmV4dCA9PT0gZXhwb3J0cy5kb3RUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5lb2ZUb2sgfHwgbmV4dCA9PT0gZXhwb3J0cy5jb21tYVRvayB8fCBuZXh0ID09PSBleHBvcnRzLnBhcmVuUlRvaztcbiAgICB9LFxuICAgIHVwZGF0ZUNvbnRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VyQ29udGV4dCgpICE9PSBjb250ZXh0c18xLnBhcmVuQ29udGV4dClcbiAgICAgICAgICAgIHRocm93IHRoaXMudW5leHBlY3QoKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnBvcCgpO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5jb21tYVRvayA9IFRva2VuVHlwZSgnLCcsIHtcbiAgICBleHBlY3ROZXh0OiBmdW5jdGlvbiAobmV4dCkge1xuICAgICAgICByZXR1cm4gKG5leHQgPT09IGV4cG9ydHMubmFtZVRvayB8fFxuICAgICAgICAgICAgbmV4dCA9PT0gZXhwb3J0cy5icmFja2V0RExUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldExUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuYnJhY2VMVG9rKTtcbiAgICB9XG59KTtcbmV4cG9ydHMuaWdub3JlVG9rID0gVG9rZW5UeXBlKCdpZ25vcmUnLCB7XG4gICAgZXhwZWN0TmV4dDogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIG5leHQgPT09IGV4cG9ydHMuYnJhY2tldERSVG9rO1xuICAgIH0sXG4gICAgZXhwZWN0UHJldjogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgcmV0dXJuIHByZXYgPT0gZXhwb3J0cy5icmFja2V0RExUb2s7XG4gICAgfVxufSk7XG5leHBvcnRzLmV4cGFuZFRvayA9IFRva2VuVHlwZSgnZXhwYW5kVG9rJywge1xuICAgIGV4cGVjdE5leHQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHJldHVybiAobmV4dCA9PT0gZXhwb3J0cy5kb3RUb2sgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGV4cG9ydHMuZW9mVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLmNvbW1hVG9rIHx8XG4gICAgICAgICAgICBuZXh0ID09PSBleHBvcnRzLnBhcmVuUlRvayk7XG4gICAgfVxufSk7XG5leHBvcnRzLmVvZlRvayA9IFRva2VuVHlwZSgnZW9mJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVG9rZW5pemVyID0gdm9pZCAwO1xudmFyIHRva2Vuc18xID0gcmVxdWlyZShcIi4vdG9rZW5zXCIpO1xudmFyIGNvbnRleHRzXzEgPSByZXF1aXJlKFwiLi9jb250ZXh0c1wiKTtcbnZhciBub25BU0NJSXdoaXRlc3BhY2UgPSAvW1xcdTE2ODBcXHUxODBlXFx1MjAwMC1cXHUyMDBhXFx1MjAyZlxcdTIwNWZcXHUzMDAwXFx1ZmVmZl0vO1xudmFyIGZ1bGxDaGFyQ29kZUF0UG9zID0gZnVuY3Rpb24gKGlucHV0LCBwb3MpIHtcbiAgICB2YXIgY29kZSA9IGlucHV0LmNoYXJDb2RlQXQocG9zKTtcbiAgICBpZiAoY29kZSA8PSAweGQ3ZmYgfHwgY29kZSA+PSAweGUwMDApXG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIHZhciBuZXh0ID0gaW5wdXQuY2hhckNvZGVBdChwb3MgKyAxKTtcbiAgICByZXR1cm4gKGNvZGUgPDwgMTApICsgbmV4dCAtIDB4MzVmZGMwMDtcbn07XG52YXIgaXNSZXdvcmRDb2RlID0gZnVuY3Rpb24gKGNvZGUpIHtcbiAgICByZXR1cm4gY29kZSA9PT0gNDIgfHxcbiAgICAgICAgY29kZSA9PT0gNDYgfHxcbiAgICAgICAgY29kZSA9PT0gMzMgfHxcbiAgICAgICAgY29kZSA9PT0gOTEgfHxcbiAgICAgICAgY29kZSA9PT0gOTMgfHxcbiAgICAgICAgY29kZSA9PT0gNDAgfHxcbiAgICAgICAgY29kZSA9PT0gNDEgfHxcbiAgICAgICAgY29kZSA9PT0gNDQgfHxcbiAgICAgICAgY29kZSA9PT0gNTggfHxcbiAgICAgICAgY29kZSA9PT0gMTI2IHx8XG4gICAgICAgIGNvZGUgPT09IDEyMyB8fFxuICAgICAgICBjb2RlID09PSAxMjU7XG59O1xudmFyIGdldEVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UsIHByb3BzKSB7XG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICBPYmplY3QuYXNzaWduKGVyciwgcHJvcHMpO1xuICAgIHJldHVybiBlcnI7XG59O1xudmFyIHNsaWNlID0gZnVuY3Rpb24gKHN0cmluZywgc3RhcnQsIGVuZCkge1xuICAgIHZhciBzdHIgPSAnJztcbiAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICB2YXIgY2ggPSBzdHJpbmcuY2hhckF0KGkpO1xuICAgICAgICBpZiAoY2ggIT09ICdcXFxcJykge1xuICAgICAgICAgICAgc3RyICs9IGNoO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59O1xudmFyIFRva2VuaXplciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVG9rZW5pemVyKGlucHV0KSB7XG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvbnRleHQ6IFtdLFxuICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgICAgIHBvczogMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmN1ckNvbnRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLmNvbnRleHRbdGhpcy5zdGF0ZS5jb250ZXh0Lmxlbmd0aCAtIDFdO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5pbmNsdWRlc0NvbnRleHQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgICAgICBmb3IgKHZhciBsZW4gPSB0aGlzLnN0YXRlLmNvbnRleHQubGVuZ3RoIC0gMTsgbGVuID49IDA7IGxlbi0tKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5jb250ZXh0W2xlbl0gPT09IGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnVuZXhwZWN0ID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgdHlwZSA9IHR5cGUgfHwgdGhpcy5zdGF0ZS50eXBlO1xuICAgICAgICByZXR1cm4gZ2V0RXJyb3IoXCJVbmV4cGVjdCB0b2tlbiBcXFwiXCIgKyB0eXBlLmZsYWcgKyBcIlxcXCIgaW4gXCIgKyB0aGlzLnN0YXRlLnBvcyArIFwiIGNoYXIuXCIsIHtcbiAgICAgICAgICAgIHBvczogdGhpcy5zdGF0ZS5wb3NcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmV4cGVjdE5leHQgPSBmdW5jdGlvbiAodHlwZSwgbmV4dCkge1xuICAgICAgICBpZiAodHlwZSAmJiB0eXBlLmV4cGVjdE5leHQpIHtcbiAgICAgICAgICAgIGlmIChuZXh0ICYmICF0eXBlLmV4cGVjdE5leHQuY2FsbCh0aGlzLCBuZXh0KSkge1xuICAgICAgICAgICAgICAgIHRocm93IGdldEVycm9yKFwiVW5leHBlY3QgdG9rZW4gXFxcIlwiICsgbmV4dC5mbGFnICsgXCJcXFwiIHRva2VuIHNob3VsZCBub3QgYmUgYmVoaW5kIFxcXCJcIiArIHR5cGUuZmxhZyArIFwiXFxcIiB0b2tlbi4oXCIgKyB0aGlzLnN0YXRlLnBvcyArIFwidGggY2hhcilcIiwge1xuICAgICAgICAgICAgICAgICAgICBwb3M6IHRoaXMuc3RhdGUucG9zXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuZXhwZWN0UHJldiA9IGZ1bmN0aW9uICh0eXBlLCBwcmV2KSB7XG4gICAgICAgIGlmICh0eXBlICYmIHR5cGUuZXhwZWN0UHJldikge1xuICAgICAgICAgICAgaWYgKHByZXYgJiYgIXR5cGUuZXhwZWN0UHJldi5jYWxsKHRoaXMsIHByZXYpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZ2V0RXJyb3IoXCJVbmV4cGVjdCB0b2tlbiBcXFwiXCIgKyB0eXBlLmZsYWcgKyBcIlxcXCIgc2hvdWxkIG5vdCBiZSBiZWhpbmQgXFxcIlwiICsgcHJldi5mbGFnICsgXCJcXFwiKFwiICsgdGhpcy5zdGF0ZS5wb3MgKyBcInRoIGNoYXIpLlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHBvczogdGhpcy5zdGF0ZS5wb3NcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLnR5cGUgPT09IHR5cGU7XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnNraXBTcGFjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VyQ29udGV4dCgpID09PSBjb250ZXh0c18xLmJyYWNrZXREQ29udGV4dClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbG9vcDogd2hpbGUgKHRoaXMuc3RhdGUucG9zIDwgdGhpcy5pbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciBjaCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyk7XG4gICAgICAgICAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAzMjpcbiAgICAgICAgICAgICAgICBjYXNlIDE2MDpcbiAgICAgICAgICAgICAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDEpID09PSAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgY2FzZSA4MjMyOlxuICAgICAgICAgICAgICAgIGNhc2UgODIzMzpcbiAgICAgICAgICAgICAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKChjaCA+IDggJiYgY2ggPCAxNCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIChjaCA+PSA1NzYwICYmIG5vbkFTQ0lJd2hpdGVzcGFjZS50ZXN0KFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5wdXQubGVuZ3RoIDw9IHRoaXMuc3RhdGUucG9zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5lb2ZUb2spO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2tpcFNwYWNlKCk7XG4gICAgICAgIHRoaXMucmVhZFRva2VuKHRoaXMuZ2V0Q29kZSgpLCB0aGlzLnN0YXRlLnBvcyA+IDAgPyB0aGlzLmdldENvZGUodGhpcy5zdGF0ZS5wb3MgLSAxKSA6IC1JbmZpbml0eSk7XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmdldENvZGUgPSBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIGlmIChwb3MgPT09IHZvaWQgMCkgeyBwb3MgPSB0aGlzLnN0YXRlLnBvczsgfVxuICAgICAgICByZXR1cm4gZnVsbENoYXJDb2RlQXRQb3ModGhpcy5pbnB1dCwgcG9zKTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuZWF0ID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2godHlwZSkpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUucmVhZEtleVdvcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGFydFBvcyA9IHRoaXMuc3RhdGUucG9zLCBzdHJpbmcgPSAnJztcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHZhciBjb2RlID0gdGhpcy5nZXRDb2RlKCk7XG4gICAgICAgICAgICB2YXIgcHJldkNvZGUgPSB0aGlzLmdldENvZGUodGhpcy5zdGF0ZS5wb3MgLSAxKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0Lmxlbmd0aCA9PT0gdGhpcy5zdGF0ZS5wb3MpIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzbGljZSh0aGlzLmlucHV0LCBzdGFydFBvcywgdGhpcy5zdGF0ZS5wb3MgKyAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNSZXdvcmRDb2RlKGNvZGUpIHx8IHByZXZDb2RlID09PSA5Mikge1xuICAgICAgICAgICAgICAgIGlmIChjb2RlID09PSAzMiB8fFxuICAgICAgICAgICAgICAgICAgICBjb2RlID09PSAxNjAgfHxcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9PT0gMTAgfHxcbiAgICAgICAgICAgICAgICAgICAgY29kZSA9PT0gODIzMiB8fFxuICAgICAgICAgICAgICAgICAgICBjb2RlID09PSA4MjMzKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyA9IHNsaWNlKHRoaXMuaW5wdXQsIHN0YXJ0UG9zLCB0aGlzLnN0YXRlLnBvcyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY29kZSA9PT0gMTMgJiYgdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSkgPT09IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyA9IHNsaWNlKHRoaXMuaW5wdXQsIHN0YXJ0UG9zLCB0aGlzLnN0YXRlLnBvcyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKGNvZGUgPiA4ICYmIGNvZGUgPCAxNCkgfHxcbiAgICAgICAgICAgICAgICAgICAgKGNvZGUgPj0gNTc2MCAmJiBub25BU0NJSXdoaXRlc3BhY2UudGVzdChTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nID0gc2xpY2UodGhpcy5pbnB1dCwgc3RhcnRQb3MsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzbGljZSh0aGlzLmlucHV0LCBzdGFydFBvcywgdGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEubmFtZVRvaywgc3RyaW5nKTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUucmVhZEluZ29yZVN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5wb3MsIHByZXZDb2RlLCBzdHJpbmcgPSAnJztcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHZhciBjb2RlID0gdGhpcy5nZXRDb2RlKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5wb3MgPj0gdGhpcy5pbnB1dC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBpZiAoKGNvZGUgPT09IDkxIHx8IGNvZGUgPT09IDkzKSAmJiBwcmV2Q29kZSA9PT0gOTIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgICAgIHByZXZDb2RlID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb2RlID09IDkzICYmIHByZXZDb2RlID09PSA5Mykge1xuICAgICAgICAgICAgICAgIHN0cmluZyA9IHRoaXMuaW5wdXRcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKHN0YXJ0UG9zLCB0aGlzLnN0YXRlLnBvcyAtIDEpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcKFtcXFtcXF1dKS9nLCAnJDEnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgICAgICBwcmV2Q29kZSA9IGNvZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5pZ25vcmVUb2ssIHN0cmluZyk7XG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuYnJhY2tldERSVG9rKTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuZmluaXNoVG9rZW4gPSBmdW5jdGlvbiAodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIHByZVR5cGUgPSB0aGlzLnN0YXRlLnR5cGU7XG4gICAgICAgIHRoaXMuc3RhdGUudHlwZSA9IHR5cGU7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5zdGF0ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmV4cGVjdE5leHQocHJlVHlwZSwgdHlwZSk7XG4gICAgICAgIHRoaXMuZXhwZWN0UHJldih0eXBlLCBwcmVUeXBlKTtcbiAgICAgICAgaWYgKHR5cGUudXBkYXRlQ29udGV4dCkge1xuICAgICAgICAgICAgdHlwZS51cGRhdGVDb250ZXh0LmNhbGwodGhpcywgcHJlVHlwZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUucmVhZFRva2VuID0gZnVuY3Rpb24gKGNvZGUsIHByZXZDb2RlKSB7XG4gICAgICAgIGlmIChwcmV2Q29kZSA9PT0gOTIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWRLZXlXb3JkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW5wdXQubGVuZ3RoIDw9IHRoaXMuc3RhdGUucG9zKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmVvZlRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5jdXJDb250ZXh0KCkgPT09IGNvbnRleHRzXzEuYnJhY2tldERDb250ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnJlYWRJbmdvcmVTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSAxMjMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmJyYWNlTFRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMTI1KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5icmFjZVJUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDQyKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5zdGFyVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSAzMykge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuYmFuZ1Rvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gNDYpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmRvdFRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gOTEpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRDb2RlKCkgPT09IDkxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5icmFja2V0RExUb2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5icmFja2V0TFRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gMTI2KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5leHBhbmRUb2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvZGUgPT09IDkzKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcysrO1xuICAgICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0b2tlbnNfMS5icmFja2V0UlRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gNDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLnBhcmVuTFRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gNDEpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLnBhcmVuUlRvayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29kZSA9PT0gNDQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zKys7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHRva2Vuc18xLmNvbW1hVG9rKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb2RlID09PSA1OCkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MrKztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odG9rZW5zXzEuY29sb25Ub2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWFkS2V5V29yZCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gVG9rZW5pemVyO1xufSgpKTtcbmV4cG9ydHMuVG9rZW5pemVyID0gVG9rZW5pemVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzQXJyYXlQYXR0ZXJuID0gZXhwb3J0cy5pc09iamVjdFBhdHRlcm5Qcm9wZXJ0eSA9IGV4cG9ydHMuaXNPYmplY3RQYXR0ZXJuID0gZXhwb3J0cy5pc0Rlc3RydWN0b3JFeHByZXNzaW9uID0gZXhwb3J0cy5pc1JhbmdlRXhwcmVzc2lvbiA9IGV4cG9ydHMuaXNHcm91cEV4cHJlc3Npb24gPSBleHBvcnRzLmlzRXhwYW5kT3BlcmF0b3IgPSBleHBvcnRzLmlzV2lsZGNhcmRPcGVyYXRvciA9IGV4cG9ydHMuaXNEb3RPcGVyYXRvciA9IGV4cG9ydHMuaXNJZ25vcmVFeHByZXNzaW9uID0gZXhwb3J0cy5pc0lkZW50aWZpZXIgPSBleHBvcnRzLmlzVHlwZSA9IHZvaWQgMDtcbmV4cG9ydHMuaXNUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHsgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai50eXBlID09PSB0eXBlO1xufTsgfTtcbmV4cG9ydHMuaXNJZGVudGlmaWVyID0gZXhwb3J0cy5pc1R5cGUoJ0lkZW50aWZpZXInKTtcbmV4cG9ydHMuaXNJZ25vcmVFeHByZXNzaW9uID0gZXhwb3J0cy5pc1R5cGUoJ0lnbm9yZUV4cHJlc3Npb24nKTtcbmV4cG9ydHMuaXNEb3RPcGVyYXRvciA9IGV4cG9ydHMuaXNUeXBlKCdEb3RPcGVyYXRvcicpO1xuZXhwb3J0cy5pc1dpbGRjYXJkT3BlcmF0b3IgPSBleHBvcnRzLmlzVHlwZSgnV2lsZGNhcmRPcGVyYXRvcicpO1xuZXhwb3J0cy5pc0V4cGFuZE9wZXJhdG9yID0gZXhwb3J0cy5pc1R5cGUoJ0V4cGFuZE9wZXJhdG9yJyk7XG5leHBvcnRzLmlzR3JvdXBFeHByZXNzaW9uID0gZXhwb3J0cy5pc1R5cGUoJ0dyb3VwRXhwcmVzc2lvbicpO1xuZXhwb3J0cy5pc1JhbmdlRXhwcmVzc2lvbiA9IGV4cG9ydHMuaXNUeXBlKCdSYW5nZUV4cHJlc3Npb24nKTtcbmV4cG9ydHMuaXNEZXN0cnVjdG9yRXhwcmVzc2lvbiA9IGV4cG9ydHMuaXNUeXBlKCdEZXN0cnVjdG9yRXhwcmVzc2lvbicpO1xuZXhwb3J0cy5pc09iamVjdFBhdHRlcm4gPSBleHBvcnRzLmlzVHlwZSgnT2JqZWN0UGF0dGVybicpO1xuZXhwb3J0cy5pc09iamVjdFBhdHRlcm5Qcm9wZXJ0eSA9IGV4cG9ydHMuaXNUeXBlKCdPYmplY3RQYXR0ZXJuUHJvcGVydHknKTtcbmV4cG9ydHMuaXNBcnJheVBhdHRlcm4gPSBleHBvcnRzLmlzVHlwZSgnQXJyYXlQYXR0ZXJuJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNFcXVhbCA9IGV4cG9ydHMudG9BcnJheSA9IGV4cG9ydHMuaXNSZWdFeHAgPSBleHBvcnRzLmlzT2JqID0gZXhwb3J0cy5pc051bSA9IGV4cG9ydHMuaXNCb29sID0gZXhwb3J0cy5pc1N0ciA9IGV4cG9ydHMuaXNQbGFpbk9iaiA9IGV4cG9ydHMuaXNBcnIgPSBleHBvcnRzLmlzRm4gPSB2b2lkIDA7XG52YXIgaXNUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHsgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09IFwiW29iamVjdCBcIiArIHR5cGUgKyBcIl1cIjtcbn07IH07XG5leHBvcnRzLmlzRm4gPSBpc1R5cGUoJ0Z1bmN0aW9uJyk7XG5leHBvcnRzLmlzQXJyID0gQXJyYXkuaXNBcnJheSB8fCBpc1R5cGUoJ0FycmF5Jyk7XG5leHBvcnRzLmlzUGxhaW5PYmogPSBpc1R5cGUoJ09iamVjdCcpO1xuZXhwb3J0cy5pc1N0ciA9IGlzVHlwZSgnU3RyaW5nJyk7XG5leHBvcnRzLmlzQm9vbCA9IGlzVHlwZSgnQm9vbGVhbicpO1xuZXhwb3J0cy5pc051bSA9IGlzVHlwZSgnTnVtYmVyJyk7XG5leHBvcnRzLmlzT2JqID0gZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ29iamVjdCc7IH07XG5leHBvcnRzLmlzUmVnRXhwID0gaXNUeXBlKCdSZWdFeHAnKTtcbnZhciBpc0FycmF5ID0gZXhwb3J0cy5pc0FycjtcbnZhciBrZXlMaXN0ID0gT2JqZWN0LmtleXM7XG52YXIgaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5leHBvcnRzLnRvQXJyYXkgPSBmdW5jdGlvbiAodmFsKSB7IHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwgOiB2YWwgIT09IHVuZGVmaW5lZCA/IFt2YWxdIDogW107IH07XG5leHBvcnRzLmlzRXF1YWwgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoYSAmJiBiICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgYiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFyIGFyckEgPSBpc0FycmF5KGEpO1xuICAgICAgICB2YXIgYXJyQiA9IGlzQXJyYXkoYik7XG4gICAgICAgIHZhciBpID0gdm9pZCAwO1xuICAgICAgICB2YXIgbGVuZ3RoXzE7XG4gICAgICAgIHZhciBrZXkgPSB2b2lkIDA7XG4gICAgICAgIGlmIChhcnJBICYmIGFyckIpIHtcbiAgICAgICAgICAgIGxlbmd0aF8xID0gYS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobGVuZ3RoXzEgIT09IGIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gbGVuZ3RoXzE7IGktLSAhPT0gMDspIHtcbiAgICAgICAgICAgICAgICBpZiAoIWV4cG9ydHMuaXNFcXVhbChhW2ldLCBiW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyckEgIT09IGFyckIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIga2V5cyA9IGtleUxpc3QoYSk7XG4gICAgICAgIGxlbmd0aF8xID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIGlmIChsZW5ndGhfMSAhPT0ga2V5TGlzdChiKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSBsZW5ndGhfMTsgaS0tICE9PSAwOykge1xuICAgICAgICAgICAgaWYgKCFoYXNQcm9wLmNhbGwoYiwga2V5c1tpXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gbGVuZ3RoXzE7IGktLSAhPT0gMDspIHtcbiAgICAgICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgICBpZiAoIWV4cG9ydHMuaXNFcXVhbChhW2tleV0sIGJba2V5XSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBhICE9PSBhICYmIGIgIT09IGI7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmV4aXN0SW5CeURlc3RydWN0b3IgPSBleHBvcnRzLmRlbGV0ZUluQnlEZXN0cnVjdG9yID0gZXhwb3J0cy5nZXRJbkJ5RGVzdHJ1Y3RvciA9IGV4cG9ydHMuc2V0SW5CeURlc3RydWN0b3IgPSBleHBvcnRzLnBhcnNlRGVzdHJ1Y3RvclJ1bGVzID0gZXhwb3J0cy5zZXREZXN0cnVjdG9yID0gZXhwb3J0cy5nZXREZXN0cnVjdG9yID0gdm9pZCAwO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgRGVzdHJjdXRvckNhY2hlID0gbmV3IE1hcCgpO1xudmFyIGlzVmFsaWQgPSBmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCAmJiB2YWwgIT09IG51bGw7IH07XG5leHBvcnRzLmdldERlc3RydWN0b3IgPSBmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgcmV0dXJuIERlc3RyY3V0b3JDYWNoZS5nZXQoc291cmNlKTtcbn07XG5leHBvcnRzLnNldERlc3RydWN0b3IgPSBmdW5jdGlvbiAoc291cmNlLCBydWxlcykge1xuICAgIERlc3RyY3V0b3JDYWNoZS5zZXQoc291cmNlLCBydWxlcyk7XG59O1xuZXhwb3J0cy5wYXJzZURlc3RydWN0b3JSdWxlcyA9IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgdmFyIHJ1bGVzID0gW107XG4gICAgaWYgKHR5cGVzXzEuaXNPYmplY3RQYXR0ZXJuKG5vZGUpKSB7XG4gICAgICAgIHZhciBpbmRleF8xID0gMDtcbiAgICAgICAgbm9kZS5wcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICBydWxlc1tpbmRleF8xXSA9IHtcbiAgICAgICAgICAgICAgICBwYXRoOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJ1bGVzW2luZGV4XzFdLmtleSA9IGNoaWxkLmtleS52YWx1ZTtcbiAgICAgICAgICAgIHJ1bGVzW2luZGV4XzFdLnBhdGgucHVzaChjaGlsZC5rZXkudmFsdWUpO1xuICAgICAgICAgICAgaWYgKHR5cGVzXzEuaXNJZGVudGlmaWVyKGNoaWxkLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJ1bGVzW2luZGV4XzFdLmtleSA9IGNoaWxkLnZhbHVlLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGJhc2VQYXRoID0gcnVsZXNbaW5kZXhfMV0ucGF0aDtcbiAgICAgICAgICAgIHZhciBjaGlsZFJ1bGVzID0gZXhwb3J0cy5wYXJzZURlc3RydWN0b3JSdWxlcyhjaGlsZC52YWx1ZSk7XG4gICAgICAgICAgICB2YXIgayA9IGluZGV4XzE7XG4gICAgICAgICAgICBjaGlsZFJ1bGVzLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgICAgICBpZiAocnVsZXNba10pIHtcbiAgICAgICAgICAgICAgICAgICAgcnVsZXNba10ua2V5ID0gcnVsZS5rZXk7XG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzW2tdLnBhdGggPSBiYXNlUGF0aC5jb25jYXQocnVsZS5wYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzW2tdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBydWxlLmtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGJhc2VQYXRoLmNvbmNhdChydWxlLnBhdGgpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGsrKztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGsgPiBpbmRleF8xKSB7XG4gICAgICAgICAgICAgICAgaW5kZXhfMSA9IGs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmRleF8xKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcnVsZXM7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVzXzEuaXNBcnJheVBhdHRlcm4obm9kZSkpIHtcbiAgICAgICAgdmFyIGluZGV4XzIgPSAwO1xuICAgICAgICBub2RlLmVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkLCBrZXkpIHtcbiAgICAgICAgICAgIHJ1bGVzW2luZGV4XzJdID0ge1xuICAgICAgICAgICAgICAgIHBhdGg6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcnVsZXNbaW5kZXhfMl0ua2V5ID0ga2V5O1xuICAgICAgICAgICAgcnVsZXNbaW5kZXhfMl0ucGF0aC5wdXNoKGtleSk7XG4gICAgICAgICAgICBpZiAodHlwZXNfMS5pc0lkZW50aWZpZXIoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgcnVsZXNbaW5kZXhfMl0ua2V5ID0gY2hpbGQudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYmFzZVBhdGggPSBydWxlc1tpbmRleF8yXS5wYXRoO1xuICAgICAgICAgICAgdmFyIGNoaWxkUnVsZXMgPSBleHBvcnRzLnBhcnNlRGVzdHJ1Y3RvclJ1bGVzKGNoaWxkKTtcbiAgICAgICAgICAgIHZhciBrID0gaW5kZXhfMjtcbiAgICAgICAgICAgIGNoaWxkUnVsZXMuZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgICAgICAgIGlmIChydWxlc1trXSkge1xuICAgICAgICAgICAgICAgICAgICBydWxlc1trXS5rZXkgPSBydWxlLmtleTtcbiAgICAgICAgICAgICAgICAgICAgcnVsZXNba10ucGF0aCA9IGJhc2VQYXRoLmNvbmNhdChydWxlLnBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcnVsZXNba10gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHJ1bGUua2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYmFzZVBhdGguY29uY2F0KHJ1bGUucGF0aClcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaysrO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoayA+IGluZGV4XzIpIHtcbiAgICAgICAgICAgICAgICBpbmRleF8yID0gaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluZGV4XzIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBydWxlcztcbiAgICB9XG4gICAgaWYgKHR5cGVzXzEuaXNEZXN0cnVjdG9yRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5wYXJzZURlc3RydWN0b3JSdWxlcyhub2RlLnZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ1bGVzO1xufTtcbmV4cG9ydHMuc2V0SW5CeURlc3RydWN0b3IgPSBmdW5jdGlvbiAoc291cmNlLCBydWxlcywgdmFsdWUsIG11dGF0b3JzKSB7XG4gICAgcnVsZXMuZm9yRWFjaChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGtleSA9IF9hLmtleSwgcGF0aCA9IF9hLnBhdGg7XG4gICAgICAgIG11dGF0b3JzLnNldEluKFtrZXldLCBzb3VyY2UsIG11dGF0b3JzLmdldEluKHBhdGgsIHZhbHVlKSk7XG4gICAgfSk7XG59O1xuZXhwb3J0cy5nZXRJbkJ5RGVzdHJ1Y3RvciA9IGZ1bmN0aW9uIChzb3VyY2UsIHJ1bGVzLCBtdXRhdG9ycykge1xuICAgIHZhciByZXNwb25zZSA9IHt9O1xuICAgIGlmIChydWxlcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHV0aWxzXzEuaXNOdW0ocnVsZXNbMF0ucGF0aFswXSkpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gW107XG4gICAgICAgIH1cbiAgICB9XG4gICAgc291cmNlID0gaXNWYWxpZChzb3VyY2UpID8gc291cmNlIDoge307XG4gICAgcnVsZXMuZm9yRWFjaChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGtleSA9IF9hLmtleSwgcGF0aCA9IF9hLnBhdGg7XG4gICAgICAgIG11dGF0b3JzLnNldEluKHBhdGgsIHJlc3BvbnNlLCBzb3VyY2Vba2V5XSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufTtcbmV4cG9ydHMuZGVsZXRlSW5CeURlc3RydWN0b3IgPSBmdW5jdGlvbiAoc291cmNlLCBydWxlcywgbXV0YXRvcnMpIHtcbiAgICBydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIga2V5ID0gX2Eua2V5O1xuICAgICAgICBtdXRhdG9ycy5kZWxldGVJbihba2V5XSwgc291cmNlKTtcbiAgICB9KTtcbn07XG5leHBvcnRzLmV4aXN0SW5CeURlc3RydWN0b3IgPSBmdW5jdGlvbiAoc291cmNlLCBydWxlcywgc3RhcnQsIG11dGF0b3JzKSB7XG4gICAgcmV0dXJuIHJ1bGVzLmV2ZXJ5KGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIga2V5ID0gX2Eua2V5O1xuICAgICAgICByZXR1cm4gbXV0YXRvcnMuZXhpc3RJbihba2V5XSwgc291cmNlLCBzdGFydCk7XG4gICAgfSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGFyc2VyID0gdm9pZCAwO1xudmFyIHRva2VuaXplcl8xID0gcmVxdWlyZShcIi4vdG9rZW5pemVyXCIpO1xudmFyIHRva2Vuc18xID0gcmVxdWlyZShcIi4vdG9rZW5zXCIpO1xudmFyIGNvbnRleHRzXzEgPSByZXF1aXJlKFwiLi9jb250ZXh0c1wiKTtcbnZhciBkZXN0cnVjdG9yXzEgPSByZXF1aXJlKFwiLi9kZXN0cnVjdG9yXCIpO1xudmFyIFBhcnNlciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFBhcnNlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBQYXJzZXIoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcbiAgICAgICAgICAgIHNlZ21lbnRzOiBbXVxuICAgICAgICB9O1xuICAgICAgICBpZiAoIXRoaXMuZWF0KHRva2Vuc18xLmVvZlRvaykpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgbm9kZSA9IHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhLnRyZWUgPSBub2RlO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKHBhcmVudCwgbm9kZSkge1xuICAgICAgICBpZiAocGFyZW50ICYmIG5vZGUpIHtcbiAgICAgICAgICAgIHBhcmVudC5hZnRlciA9IG5vZGU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VBdG9tID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIHRva2Vuc18xLmJyYWNlTFRvazpcbiAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuYnJhY2tldExUb2s6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSB0b2tlbnNfMS5icmFjZUxUb2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT2JqZWN0UGF0dGVybigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VBcnJheVBhdHRlcm4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURlc3RydWN0b3JFeHByZXNzaW9uKCk7XG4gICAgICAgICAgICBjYXNlIHRva2Vuc18xLm5hbWVUb2s6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VJZGVudGlmaWVyKCk7XG4gICAgICAgICAgICBjYXNlIHRva2Vuc18xLmV4cGFuZFRvazpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUV4cGFuZE9wZXJhdG9yKCk7XG4gICAgICAgICAgICBjYXNlIHRva2Vuc18xLnN0YXJUb2s6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VXaWxkY2FyZE9wZXJhdG9yKCk7XG4gICAgICAgICAgICBjYXNlIHRva2Vuc18xLmJyYWNrZXRETFRvazpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUlnbm9yZUV4cHJlc3Npb24oKTtcbiAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuZG90VG9rOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRG90T3BlcmF0b3IoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wdXNoU2VnbWVudHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHRoaXMuZGF0YS5zZWdtZW50cy5wdXNoKGtleSk7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlSWRlbnRpZmllciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnSWRlbnRpZmllcicsXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5zdGF0ZS52YWx1ZVxuICAgICAgICB9O1xuICAgICAgICB2YXIgaGFzTm90SW5EZXN0cnVjdG9yID0gIXRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuZGVzdHJ1Y3RvckNvbnRleHQpICYmXG4gICAgICAgICAgICAhdGhpcy5pc01hdGNoUGF0dGVybiAmJlxuICAgICAgICAgICAgIXRoaXMuaXNXaWxkTWF0Y2hQYXR0ZXJuO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZXNDb250ZXh0KGNvbnRleHRzXzEuYnJhY2tldEFycmF5Q29udGV4dCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnR5cGUgIT09IHRva2Vuc18xLmJyYWNrZXRSVG9rKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnBvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGhhc05vdEluRGVzdHJ1Y3Rvcikge1xuICAgICAgICAgICAgdGhpcy5wdXNoU2VnbWVudHMobm9kZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUudHlwZSA9PT0gdG9rZW5zXzEuYnJhY2tldExUb2spIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUudHlwZSAhPT0gdG9rZW5zXzEubmFtZVRvaykge1xuICAgICAgICAgICAgICAgIHRocm93IHRoaXMudW5leHBlY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wdXNoKGNvbnRleHRzXzEuYnJhY2tldEFycmF5Q29udGV4dCk7XG4gICAgICAgICAgICB2YXIgaXNOdW1iZXJLZXkgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICgvXlxcZCskLy50ZXN0KHRoaXMuc3RhdGUudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaXNOdW1iZXJLZXkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICAgIHRoaXMucHVzaFNlZ21lbnRzKGlzTnVtYmVyS2V5ID8gTnVtYmVyKHZhbHVlKSA6IHZhbHVlKTtcbiAgICAgICAgICAgIHZhciBhZnRlciA9IHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSk7XG4gICAgICAgICAgICBpZiAoaXNOdW1iZXJLZXkpIHtcbiAgICAgICAgICAgICAgICBhZnRlci5hcnJheUluZGV4ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKG5vZGUsIGFmdGVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKG5vZGUsIHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZUV4cGFuZE9wZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdFeHBhbmRPcGVyYXRvcidcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pc01hdGNoUGF0dGVybiA9IHRydWU7XG4gICAgICAgIHRoaXMuaXNXaWxkTWF0Y2hQYXR0ZXJuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kYXRhLnNlZ21lbnRzID0gW107XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB0aGlzLmFwcGVuZChub2RlLCB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlV2lsZGNhcmRPcGVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnV2lsZGNhcmRPcGVyYXRvcidcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pc01hdGNoUGF0dGVybiA9IHRydWU7XG4gICAgICAgIHRoaXMuaXNXaWxkTWF0Y2hQYXR0ZXJuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kYXRhLnNlZ21lbnRzID0gW107XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS50eXBlID09PSB0b2tlbnNfMS5wYXJlbkxUb2spIHtcbiAgICAgICAgICAgIG5vZGUuZmlsdGVyID0gdGhpcy5wYXJzZUdyb3VwRXhwcmVzc2lvbihub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnR5cGUgPT09IHRva2Vuc18xLmJyYWNrZXRMVG9rKSB7XG4gICAgICAgICAgICBub2RlLmZpbHRlciA9IHRoaXMucGFyc2VSYW5nZUV4cHJlc3Npb24obm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcHBlbmQobm9kZSwgdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZURlc3RydWN0b3JFeHByZXNzaW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdEZXN0cnVjdG9yRXhwcmVzc2lvbidcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnB1c2goY29udGV4dHNfMS5kZXN0cnVjdG9yQ29udGV4dCk7XG4gICAgICAgIHZhciBzdGFydFBvcyA9IHRoaXMuc3RhdGUucG9zIC0gMTtcbiAgICAgICAgbm9kZS52YWx1ZSA9XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnR5cGUgPT09IHRva2Vuc18xLmJyYWNlTFRva1xuICAgICAgICAgICAgICAgID8gdGhpcy5wYXJzZU9iamVjdFBhdHRlcm4oKVxuICAgICAgICAgICAgICAgIDogdGhpcy5wYXJzZUFycmF5UGF0dGVybigpO1xuICAgICAgICB2YXIgZW5kUG9zID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5wb3AoKTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5vZGUsIHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSkpO1xuICAgICAgICBub2RlLnNvdXJjZSA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKHN0YXJ0UG9zLCBlbmRQb3MpLnJlcGxhY2UoL1xccyovZywgJycpO1xuICAgICAgICBkZXN0cnVjdG9yXzEuc2V0RGVzdHJ1Y3Rvcihub2RlLnNvdXJjZSwgZGVzdHJ1Y3Rvcl8xLnBhcnNlRGVzdHJ1Y3RvclJ1bGVzKG5vZGUpKTtcbiAgICAgICAgdGhpcy5wdXNoU2VnbWVudHMobm9kZS5zb3VyY2UpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VBcnJheVBhdHRlcm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ0FycmF5UGF0dGVybicsXG4gICAgICAgICAgICBlbGVtZW50czogW11cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIG5vZGUuZWxlbWVudHMgPSB0aGlzLnBhcnNlQXJyYXlQYXR0ZXJuRWxlbWVudHMoKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQXJyYXlQYXR0ZXJuRWxlbWVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICB3aGlsZSAodGhpcy5zdGF0ZS50eXBlICE9PSB0b2tlbnNfMS5icmFja2V0UlRvayAmJiB0aGlzLnN0YXRlLnR5cGUgIT09IHRva2Vuc18xLmVvZlRvaykge1xuICAgICAgICAgICAgbm9kZXMucHVzaCh0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnR5cGUgPT09IHRva2Vuc18xLmJyYWNrZXRSVG9rKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlT2JqZWN0UGF0dGVybiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnT2JqZWN0UGF0dGVybicsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBbXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgbm9kZS5wcm9wZXJ0aWVzID0gdGhpcy5wYXJzZU9iamVjdFByb3BlcnRpZXMoKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlT2JqZWN0UHJvcGVydGllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgIHdoaWxlICh0aGlzLnN0YXRlLnR5cGUgIT09IHRva2Vuc18xLmJyYWNlUlRvayAmJiB0aGlzLnN0YXRlLnR5cGUgIT09IHRva2Vuc18xLmVvZlRvaykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ09iamVjdFBhdHRlcm5Qcm9wZXJ0eScsXG4gICAgICAgICAgICAgICAga2V5OiB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnR5cGUgPT09IHRva2Vuc18xLmNvbG9uVG9rKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgbm9kZS52YWx1ZSA9IHRoaXMucGFyc2VBdG9tKHRoaXMuc3RhdGUudHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS50eXBlID09PSB0b2tlbnNfMS5icmFjZVJUb2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlcztcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VEb3RPcGVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnRG90T3BlcmF0b3InXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB0aGlzLmFwcGVuZChub2RlLCB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlSWdub3JlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHZhciB2YWx1ZSA9IFN0cmluZyh0aGlzLnN0YXRlLnZhbHVlKS5yZXBsYWNlKC9cXHMqL2csICcnKTtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnSWdub3JlRXhwcmVzc2lvbicsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wdXNoU2VnbWVudHModmFsdWUpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5hcHBlbmQobm9kZSwgdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUucGFyc2VHcm91cEV4cHJlc3Npb24gPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgICAgIHZhciBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogJ0dyb3VwRXhwcmVzc2lvbicsXG4gICAgICAgICAgICB2YWx1ZTogW11cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pc01hdGNoUGF0dGVybiA9IHRydWU7XG4gICAgICAgIHRoaXMuZGF0YS5zZWdtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgbG9vcDogd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5jb21tYVRvazpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuYmFuZ1RvazpcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pc0V4Y2x1ZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhdmVFeGNsdWRlUGF0dGVybiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRva2Vuc18xLmVvZlRvazpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgICAgICBjYXNlIHRva2Vuc18xLnBhcmVuUlRvazpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBub2RlLnZhbHVlLnB1c2godGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHRoaXMuYXBwZW5kKHBhcmVudCwgdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZVJhbmdlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiAnUmFuZ2VFeHByZXNzaW9uJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5pc01hdGNoUGF0dGVybiA9IHRydWU7XG4gICAgICAgIHRoaXMuZGF0YS5zZWdtZW50cyA9IFtdO1xuICAgICAgICB2YXIgc3RhcnQgPSBmYWxzZSwgaGFzQ29sb24gPSBmYWxzZTtcbiAgICAgICAgbG9vcDogd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5jb2xvblRvazpcbiAgICAgICAgICAgICAgICAgICAgaGFzQ29sb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRva2Vuc18xLmJyYWNrZXRSVG9rOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc0NvbG9uICYmICFub2RlLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5lbmQgPSBub2RlLnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIGxvb3A7XG4gICAgICAgICAgICAgICAgY2FzZSB0b2tlbnNfMS5jb21tYVRvazpcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdCgpO1xuICAgICAgICAgICAgICAgIGNhc2UgdG9rZW5zXzEuZW9mVG9rOlxuICAgICAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuc3RhcnQgPSB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5lbmQgPSB0aGlzLnBhcnNlQXRvbSh0aGlzLnN0YXRlLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHRoaXMuYXBwZW5kKHBhcmVudCwgdGhpcy5wYXJzZUF0b20odGhpcy5zdGF0ZS50eXBlKSk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG4gICAgcmV0dXJuIFBhcnNlcjtcbn0odG9rZW5pemVyXzEuVG9rZW5pemVyKSk7XG5leHBvcnRzLlBhcnNlciA9IFBhcnNlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5MUlVNYXAgPSB2b2lkIDA7XG52YXIgTkVXRVIgPSBTeW1ib2woJ25ld2VyJyk7XG52YXIgT0xERVIgPSBTeW1ib2woJ29sZGVyJyk7XG5mdW5jdGlvbiBMUlVNYXAobGltaXQsIGVudHJpZXMpIHtcbiAgICBpZiAodHlwZW9mIGxpbWl0ICE9PSAnbnVtYmVyJykge1xuICAgICAgICBlbnRyaWVzID0gbGltaXQ7XG4gICAgICAgIGxpbWl0ID0gMDtcbiAgICB9XG4gICAgdGhpcy5zaXplID0gMDtcbiAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XG4gICAgdGhpcy5vbGRlc3QgPSB0aGlzLm5ld2VzdCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9rZXltYXAgPSBuZXcgTWFwKCk7XG4gICAgaWYgKGVudHJpZXMpIHtcbiAgICAgICAgdGhpcy5hc3NpZ24oZW50cmllcyk7XG4gICAgICAgIGlmIChsaW1pdCA8IDEpIHtcbiAgICAgICAgICAgIHRoaXMubGltaXQgPSB0aGlzLnNpemU7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkxSVU1hcCA9IExSVU1hcDtcbmZ1bmN0aW9uIEVudHJ5KGtleSwgdmFsdWUpIHtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpc1tORVdFUl0gPSB1bmRlZmluZWQ7XG4gICAgdGhpc1tPTERFUl0gPSB1bmRlZmluZWQ7XG59XG5MUlVNYXAucHJvdG90eXBlLl9tYXJrRW50cnlBc1VzZWQgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICBpZiAoZW50cnkgPT09IHRoaXMubmV3ZXN0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGVudHJ5W05FV0VSXSkge1xuICAgICAgICBpZiAoZW50cnkgPT09IHRoaXMub2xkZXN0KSB7XG4gICAgICAgICAgICB0aGlzLm9sZGVzdCA9IGVudHJ5W05FV0VSXTtcbiAgICAgICAgfVxuICAgICAgICBlbnRyeVtORVdFUl1bT0xERVJdID0gZW50cnlbT0xERVJdO1xuICAgIH1cbiAgICBpZiAoZW50cnlbT0xERVJdKSB7XG4gICAgICAgIGVudHJ5W09MREVSXVtORVdFUl0gPSBlbnRyeVtORVdFUl07XG4gICAgfVxuICAgIGVudHJ5W05FV0VSXSA9IHVuZGVmaW5lZDtcbiAgICBlbnRyeVtPTERFUl0gPSB0aGlzLm5ld2VzdDtcbiAgICBpZiAodGhpcy5uZXdlc3QpIHtcbiAgICAgICAgdGhpcy5uZXdlc3RbTkVXRVJdID0gZW50cnk7XG4gICAgfVxuICAgIHRoaXMubmV3ZXN0ID0gZW50cnk7XG59O1xuTFJVTWFwLnByb3RvdHlwZS5hc3NpZ24gPSBmdW5jdGlvbiAoZW50cmllcykge1xuICAgIHZhciBlbnRyeTtcbiAgICB2YXIgbGltaXQgPSB0aGlzLmxpbWl0IHx8IE51bWJlci5NQVhfVkFMVUU7XG4gICAgdGhpcy5fa2V5bWFwLmNsZWFyKCk7XG4gICAgdmFyIGl0ID0gZW50cmllc1tTeW1ib2wuaXRlcmF0b3JdKCk7XG4gICAgZm9yICh2YXIgaXR2ID0gaXQubmV4dCgpOyAhaXR2LmRvbmU7IGl0diA9IGl0Lm5leHQoKSkge1xuICAgICAgICB2YXIgZSA9IG5ldyBFbnRyeShpdHYudmFsdWVbMF0sIGl0di52YWx1ZVsxXSk7XG4gICAgICAgIHRoaXMuX2tleW1hcC5zZXQoZS5rZXksIGUpO1xuICAgICAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgICAgICB0aGlzLm9sZGVzdCA9IGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbnRyeVtORVdFUl0gPSBlO1xuICAgICAgICAgICAgZVtPTERFUl0gPSBlbnRyeTtcbiAgICAgICAgfVxuICAgICAgICBlbnRyeSA9IGU7XG4gICAgICAgIGlmIChsaW1pdC0tID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ292ZXJmbG93Jyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5uZXdlc3QgPSBlbnRyeTtcbiAgICB0aGlzLnNpemUgPSB0aGlzLl9rZXltYXAuc2l6ZTtcbn07XG5MUlVNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLl9rZXltYXAuZ2V0KGtleSk7XG4gICAgaWYgKCFlbnRyeSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX21hcmtFbnRyeUFzVXNlZChlbnRyeSk7XG4gICAgcmV0dXJuIGVudHJ5LnZhbHVlO1xufTtcbkxSVU1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLl9rZXltYXAuZ2V0KGtleSk7XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICAgIGVudHJ5LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX21hcmtFbnRyeUFzVXNlZChlbnRyeSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLl9rZXltYXAuc2V0KGtleSwgKGVudHJ5ID0gbmV3IEVudHJ5KGtleSwgdmFsdWUpKSk7XG4gICAgaWYgKHRoaXMubmV3ZXN0KSB7XG4gICAgICAgIHRoaXMubmV3ZXN0W05FV0VSXSA9IGVudHJ5O1xuICAgICAgICBlbnRyeVtPTERFUl0gPSB0aGlzLm5ld2VzdDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMub2xkZXN0ID0gZW50cnk7XG4gICAgfVxuICAgIHRoaXMubmV3ZXN0ID0gZW50cnk7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgaWYgKHRoaXMuc2l6ZSA+IHRoaXMubGltaXQpIHtcbiAgICAgICAgdGhpcy5zaGlmdCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5MUlVNYXAucHJvdG90eXBlLnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbnRyeSA9IHRoaXMub2xkZXN0O1xuICAgIGlmIChlbnRyeSkge1xuICAgICAgICBpZiAodGhpcy5vbGRlc3RbTkVXRVJdKSB7XG4gICAgICAgICAgICB0aGlzLm9sZGVzdCA9IHRoaXMub2xkZXN0W05FV0VSXTtcbiAgICAgICAgICAgIHRoaXMub2xkZXN0W09MREVSXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub2xkZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5uZXdlc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZW50cnlbTkVXRVJdID0gZW50cnlbT0xERVJdID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9rZXltYXAuZGVsZXRlKGVudHJ5LmtleSk7XG4gICAgICAgIC0tdGhpcy5zaXplO1xuICAgICAgICByZXR1cm4gW2VudHJ5LmtleSwgZW50cnkudmFsdWVdO1xuICAgIH1cbn07XG5MUlVNYXAucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGUgPSB0aGlzLl9rZXltYXAuZ2V0KGtleSk7XG4gICAgcmV0dXJuIGUgPyBlLnZhbHVlIDogdW5kZWZpbmVkO1xufTtcbkxSVU1hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0aGlzLl9rZXltYXAuaGFzKGtleSk7XG59O1xuTFJVTWFwLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5fa2V5bWFwLmdldChrZXkpO1xuICAgIGlmICghZW50cnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9rZXltYXAuZGVsZXRlKGVudHJ5LmtleSk7XG4gICAgaWYgKGVudHJ5W05FV0VSXSAmJiBlbnRyeVtPTERFUl0pIHtcbiAgICAgICAgZW50cnlbT0xERVJdW05FV0VSXSA9IGVudHJ5W05FV0VSXTtcbiAgICAgICAgZW50cnlbTkVXRVJdW09MREVSXSA9IGVudHJ5W09MREVSXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZW50cnlbTkVXRVJdKSB7XG4gICAgICAgIGVudHJ5W05FV0VSXVtPTERFUl0gPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMub2xkZXN0ID0gZW50cnlbTkVXRVJdO1xuICAgIH1cbiAgICBlbHNlIGlmIChlbnRyeVtPTERFUl0pIHtcbiAgICAgICAgZW50cnlbT0xERVJdW05FV0VSXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5uZXdlc3QgPSBlbnRyeVtPTERFUl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLm9sZGVzdCA9IHRoaXMubmV3ZXN0ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnNpemUtLTtcbiAgICByZXR1cm4gZW50cnkudmFsdWU7XG59O1xuTFJVTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm9sZGVzdCA9IHRoaXMubmV3ZXN0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgdGhpcy5fa2V5bWFwLmNsZWFyKCk7XG59O1xuZnVuY3Rpb24gRW50cnlJdGVyYXRvcihvbGRlc3RFbnRyeSkge1xuICAgIHRoaXMuZW50cnkgPSBvbGRlc3RFbnRyeTtcbn1cbkVudHJ5SXRlcmF0b3IucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuRW50cnlJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZW50ID0gdGhpcy5lbnRyeTtcbiAgICBpZiAoZW50KSB7XG4gICAgICAgIHRoaXMuZW50cnkgPSBlbnRbTkVXRVJdO1xuICAgICAgICByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IFtlbnQua2V5LCBlbnQudmFsdWVdIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG4gICAgfVxufTtcbmZ1bmN0aW9uIEtleUl0ZXJhdG9yKG9sZGVzdEVudHJ5KSB7XG4gICAgdGhpcy5lbnRyeSA9IG9sZGVzdEVudHJ5O1xufVxuS2V5SXRlcmF0b3IucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuS2V5SXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVudCA9IHRoaXMuZW50cnk7XG4gICAgaWYgKGVudCkge1xuICAgICAgICB0aGlzLmVudHJ5ID0gZW50W05FV0VSXTtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBlbnQua2V5IH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogdW5kZWZpbmVkIH07XG4gICAgfVxufTtcbmZ1bmN0aW9uIFZhbHVlSXRlcmF0b3Iob2xkZXN0RW50cnkpIHtcbiAgICB0aGlzLmVudHJ5ID0gb2xkZXN0RW50cnk7XG59XG5WYWx1ZUl0ZXJhdG9yLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xufTtcblZhbHVlSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVudCA9IHRoaXMuZW50cnk7XG4gICAgaWYgKGVudCkge1xuICAgICAgICB0aGlzLmVudHJ5ID0gZW50W05FV0VSXTtcbiAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBlbnQudmFsdWUgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiB1bmRlZmluZWQgfTtcbiAgICB9XG59O1xuTFJVTWFwLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgS2V5SXRlcmF0b3IodGhpcy5vbGRlc3QpO1xufTtcbkxSVU1hcC5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgVmFsdWVJdGVyYXRvcih0aGlzLm9sZGVzdCk7XG59O1xuTFJVTWFwLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xufTtcbkxSVU1hcC5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IEVudHJ5SXRlcmF0b3IodGhpcy5vbGRlc3QpO1xufTtcbkxSVU1hcC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChmdW4sIHRoaXNPYmopIHtcbiAgICBpZiAodHlwZW9mIHRoaXNPYmogIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRoaXNPYmogPSB0aGlzO1xuICAgIH1cbiAgICB2YXIgZW50cnkgPSB0aGlzLm9sZGVzdDtcbiAgICB3aGlsZSAoZW50cnkpIHtcbiAgICAgICAgZnVuLmNhbGwodGhpc09iaiwgZW50cnkudmFsdWUsIGVudHJ5LmtleSwgdGhpcyk7XG4gICAgICAgIGVudHJ5ID0gZW50cnlbTkVXRVJdO1xuICAgIH1cbn07XG5MUlVNYXAucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcyA9IG5ldyBBcnJheSh0aGlzLnNpemUpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgZW50cnkgPSB0aGlzLm9sZGVzdDtcbiAgICB3aGlsZSAoZW50cnkpIHtcbiAgICAgICAgc1tpKytdID0geyBrZXk6IGVudHJ5LmtleSwgdmFsdWU6IGVudHJ5LnZhbHVlIH07XG4gICAgICAgIGVudHJ5ID0gZW50cnlbTkVXRVJdO1xuICAgIH1cbiAgICByZXR1cm4gcztcbn07XG5MUlVNYXAucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzID0gJyc7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5vbGRlc3Q7XG4gICAgd2hpbGUgKGVudHJ5KSB7XG4gICAgICAgIHMgKz0gU3RyaW5nKGVudHJ5LmtleSkgKyAnOicgKyBlbnRyeS52YWx1ZTtcbiAgICAgICAgZW50cnkgPSBlbnRyeVtORVdFUl07XG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgcyArPSAnIDwgJztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcztcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTWF0Y2hlciA9IHZvaWQgMDtcbnZhciB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xudmFyIGlzVmFsaWQgPSBmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCAmJiB2YWwgIT09IG51bGwgJiYgdmFsICE9PSAnJzsgfTtcbnZhciBNYXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNYXRjaGVyKHRyZWUsIHJlY29yZCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLm1hdGNoTmV4dCA9IGZ1bmN0aW9uIChub2RlLCBwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5hZnRlclxuICAgICAgICAgICAgICAgID8gX3RoaXMubWF0Y2hBdG9tKHBhdGgsIG5vZGUuYWZ0ZXIpXG4gICAgICAgICAgICAgICAgOiBpc1ZhbGlkKHBhdGhbX3RoaXMucG9zXSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHJlZSA9IHRyZWU7XG4gICAgICAgIHRoaXMucG9zID0gMDtcbiAgICAgICAgdGhpcy5leGNsdWRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZWNvcmQgPSByZWNvcmQ7XG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICB9XG4gICAgTWF0Y2hlci5wcm90b3R5cGUuY3VycmVudEVsZW1lbnQgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHBhdGhbdGhpcy5wb3NdIHx8ICcnKS5yZXBsYWNlKC9cXHMqL2csICcnKTtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLnJlY29yZE1hdGNoID0gZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbWF0Y2goKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMucmVjb3JkICYmIF90aGlzLnJlY29yZC5zY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlY29yZC5zY29yZSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaElkZW50aWZpZXIgPSBmdW5jdGlvbiAocGF0aCwgbm9kZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnRhaWwgPSBub2RlO1xuICAgICAgICBpZiAoaXNWYWxpZChwYXRoW3RoaXMucG9zICsgMV0pICYmICFub2RlLmFmdGVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5zdGFjay5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RhY2tbaV0uYWZ0ZXIgfHwgIXRoaXMuc3RhY2tbaV0uZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGN1cnJlbnQ7XG4gICAgICAgIHZhciBuZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLm1hdGNoTmV4dChub2RlLCBwYXRoKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVzXzEuaXNFeHBhbmRPcGVyYXRvcihub2RlLmFmdGVyKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IHRoaXMucmVjb3JkTWF0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnZhbHVlID09PSBTdHJpbmcocGF0aFtfdGhpcy5wb3NdKS5zdWJzdHJpbmcoMCwgbm9kZS52YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5yZWNvcmRNYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHV0aWxzXzEuaXNFcXVhbChTdHJpbmcobm9kZS52YWx1ZSksIFN0cmluZyhwYXRoW190aGlzLnBvc10pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmV4Y2x1ZGluZykge1xuICAgICAgICAgICAgaWYgKG5vZGUuYWZ0ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wb3MgPCBwYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudCgpICYmIG5leHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmFmdGVyICYmIHR5cGVzXzEuaXNXaWxkY2FyZE9wZXJhdG9yKG5vZGUuYWZ0ZXIuYWZ0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucG9zID49IHBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJyZW50KCkgJiYgbmV4dCgpO1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hJZ25vcmVFeHByZXNzaW9uID0gZnVuY3Rpb24gKHBhdGgsIG5vZGUpIHtcbiAgICAgICAgcmV0dXJuICh1dGlsc18xLmlzRXF1YWwobm9kZS52YWx1ZSwgdGhpcy5jdXJyZW50RWxlbWVudChwYXRoKSkgJiZcbiAgICAgICAgICAgIHRoaXMubWF0Y2hOZXh0KG5vZGUsIHBhdGgpKTtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoRGVzdHJ1Y3RvckV4cHJlc3Npb24gPSBmdW5jdGlvbiAocGF0aCwgbm9kZSkge1xuICAgICAgICByZXR1cm4gKHV0aWxzXzEuaXNFcXVhbChub2RlLnNvdXJjZSwgdGhpcy5jdXJyZW50RWxlbWVudChwYXRoKSkgJiZcbiAgICAgICAgICAgIHRoaXMubWF0Y2hOZXh0KG5vZGUsIHBhdGgpKTtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoRXhwYW5kT3BlcmF0b3IgPSBmdW5jdGlvbiAocGF0aCwgbm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaEF0b20ocGF0aCwgbm9kZS5hZnRlcik7XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaFdpbGRjYXJkT3BlcmF0b3IgPSBmdW5jdGlvbiAocGF0aCwgbm9kZSkge1xuICAgICAgICB0aGlzLnRhaWwgPSBub2RlO1xuICAgICAgICB0aGlzLnN0YWNrLnB1c2gobm9kZSk7XG4gICAgICAgIHZhciBtYXRjaGVkID0gZmFsc2U7XG4gICAgICAgIGlmIChub2RlLmZpbHRlcikge1xuICAgICAgICAgICAgaWYgKG5vZGUuYWZ0ZXIpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVkID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXRjaEF0b20ocGF0aCwgbm9kZS5maWx0ZXIpICYmIHRoaXMubWF0Y2hBdG9tKHBhdGgsIG5vZGUuYWZ0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlZCA9IHRoaXMubWF0Y2hBdG9tKHBhdGgsIG5vZGUuZmlsdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1hdGNoZWQgPSB0aGlzLm1hdGNoTmV4dChub2RlLCBwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YWNrLnBvcCgpO1xuICAgICAgICByZXR1cm4gbWF0Y2hlZDtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoR3JvdXBFeHByZXNzaW9uID0gZnVuY3Rpb24gKHBhdGgsIG5vZGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLnBvcztcbiAgICAgICAgdGhpcy5leGNsdWRpbmcgPSAhIW5vZGUuaXNFeGNsdWRlO1xuICAgICAgICB2YXIgbWV0aG9kID0gdGhpcy5leGNsdWRpbmcgPyAnZXZlcnknIDogJ3NvbWUnO1xuICAgICAgICB2YXIgcmVzdWx0ID0gdXRpbHNfMS50b0FycmF5KG5vZGUudmFsdWUpW21ldGhvZF0oZnVuY3Rpb24gKF9ub2RlKSB7XG4gICAgICAgICAgICBfdGhpcy5wb3MgPSBjdXJyZW50O1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmV4Y2x1ZGluZ1xuICAgICAgICAgICAgICAgID8gIV90aGlzLm1hdGNoQXRvbShwYXRoLCBfbm9kZSlcbiAgICAgICAgICAgICAgICA6IF90aGlzLm1hdGNoQXRvbShwYXRoLCBfbm9kZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmV4Y2x1ZGluZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hSYW5nZUV4cHJlc3Npb24gPSBmdW5jdGlvbiAocGF0aCwgbm9kZSkge1xuICAgICAgICBpZiAobm9kZS5zdGFydCkge1xuICAgICAgICAgICAgaWYgKG5vZGUuZW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChwYXRoW3RoaXMucG9zXSA+PSBwYXJzZUludChub2RlLnN0YXJ0LnZhbHVlKSAmJlxuICAgICAgICAgICAgICAgICAgICBwYXRoW3RoaXMucG9zXSA8PSBwYXJzZUludChub2RlLmVuZC52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGhbdGhpcy5wb3NdID49IHBhcnNlSW50KG5vZGUuc3RhcnQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5vZGUuZW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhdGhbdGhpcy5wb3NdIDw9IHBhcnNlSW50KG5vZGUuZW5kLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBNYXRjaGVyLnByb3RvdHlwZS5tYXRjaERvdE9wZXJhdG9yID0gZnVuY3Rpb24gKHBhdGgsIG5vZGUpIHtcbiAgICAgICAgdGhpcy5wb3MrKztcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hOZXh0KG5vZGUsIHBhdGgpO1xuICAgIH07XG4gICAgTWF0Y2hlci5wcm90b3R5cGUubWF0Y2hBdG9tID0gZnVuY3Rpb24gKHBhdGgsIG5vZGUpIHtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKGlzVmFsaWQocGF0aFt0aGlzLnBvcyArIDFdKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAodGhpcy5wb3MgPT0gcGF0aC5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlc18xLmlzSWRlbnRpZmllcihub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hJZGVudGlmaWVyKHBhdGgsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVzXzEuaXNJZ25vcmVFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaElnbm9yZUV4cHJlc3Npb24ocGF0aCwgbm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZXNfMS5pc0Rlc3RydWN0b3JFeHByZXNzaW9uKG5vZGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYXRjaERlc3RydWN0b3JFeHByZXNzaW9uKHBhdGgsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVzXzEuaXNFeHBhbmRPcGVyYXRvcihub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hFeHBhbmRPcGVyYXRvcihwYXRoLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlc18xLmlzV2lsZGNhcmRPcGVyYXRvcihub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hXaWxkY2FyZE9wZXJhdG9yKHBhdGgsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVzXzEuaXNHcm91cEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoR3JvdXBFeHByZXNzaW9uKHBhdGgsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVzXzEuaXNSYW5nZUV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoUmFuZ2VFeHByZXNzaW9uKHBhdGgsIG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVzXzEuaXNEb3RPcGVyYXRvcihub2RlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2hEb3RPcGVyYXRvcihwYXRoLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIE1hdGNoZXIucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSB0aGlzLm1hdGNoQXRvbShwYXRoLCB0aGlzLnRyZWUpO1xuICAgICAgICBpZiAoIXRoaXMudGFpbClcbiAgICAgICAgICAgIHJldHVybiB7IG1hdGNoZWQ6IGZhbHNlIH07XG4gICAgICAgIGlmICh0aGlzLnRhaWwgPT0gdGhpcy50cmVlICYmIHR5cGVzXzEuaXNXaWxkY2FyZE9wZXJhdG9yKHRoaXMudGFpbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IG1hdGNoZWQ6IHRydWUgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBtYXRjaGVkOiBtYXRjaGVkLCByZWNvcmQ6IHRoaXMucmVjb3JkIH07XG4gICAgfTtcbiAgICBNYXRjaGVyLm1hdGNoU2VnbWVudHMgPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQsIHJlY29yZCkge1xuICAgICAgICB2YXIgcG9zID0gMDtcbiAgICAgICAgaWYgKHNvdXJjZS5sZW5ndGggIT09IHRhcmdldC5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHZhciBtYXRjaCA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXMgPSB1dGlsc18xLmlzRXF1YWwoc291cmNlW3Bvc10sIHRhcmdldFtwb3NdKTtcbiAgICAgICAgICAgICAgICBpZiAocmVjb3JkICYmIHJlY29yZC5zY29yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZC5zY29yZSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKHBvcyA8IHNvdXJjZS5sZW5ndGggLSAxID8gbWF0Y2gocG9zICsgMSkgOiB0cnVlKTsgfTtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50KCkgJiYgbmV4dCgpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4geyBtYXRjaGVkOiBtYXRjaChwb3MpLCByZWNvcmQ6IHJlY29yZCB9O1xuICAgIH07XG4gICAgcmV0dXJuIE1hdGNoZXI7XG59KCkpO1xuZXhwb3J0cy5NYXRjaGVyID0gTWF0Y2hlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59XG52YXIgX19zcHJlYWRBcnJheXMgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXlzKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xuICAgIHJldHVybiByO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGF0aCA9IHZvaWQgMDtcbnZhciBwYXJzZXJfMSA9IHJlcXVpcmUoXCIuL3BhcnNlclwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG52YXIgZGVzdHJ1Y3Rvcl8xID0gcmVxdWlyZShcIi4vZGVzdHJ1Y3RvclwiKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90eXBlc1wiKSwgZXhwb3J0cyk7XG52YXIgbHJ1XzEgPSByZXF1aXJlKFwiLi9scnVcIik7XG52YXIgbWF0Y2hlcl8xID0gcmVxdWlyZShcIi4vbWF0Y2hlclwiKTtcbnZhciBwYXRoQ2FjaGUgPSBuZXcgbHJ1XzEuTFJVTWFwKDEwMDApO1xudmFyIGlzTWF0Y2hlciA9IFN5bWJvbCgnUEFUSF9NQVRDSEVSJyk7XG52YXIgaXNWYWxpZCA9IGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkICYmIHZhbCAhPT0gbnVsbDsgfTtcbnZhciBhcnJheUV4aXN0ID0gZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICB2YXIgaW5kZXggPSBOdW1iZXIoa2V5KTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+IG9iai5sZW5ndGggLSAxKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgZ2V0SW4gPSBmdW5jdGlvbiAoc2VnbWVudHMsIHNvdXJjZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGluZGV4ID0gc2VnbWVudHNbaV07XG4gICAgICAgIHZhciBydWxlcyA9IGRlc3RydWN0b3JfMS5nZXREZXN0cnVjdG9yKGluZGV4KTtcbiAgICAgICAgaWYgKCFydWxlcykge1xuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSAhPT0gc2VnbWVudHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhcnJheUV4aXN0KHNvdXJjZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IGRlc3RydWN0b3JfMS5nZXRJbkJ5RGVzdHJ1Y3Rvcihzb3VyY2UsIHJ1bGVzLCB7IHNldEluOiBzZXRJbiwgZ2V0SW46IGdldEluIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbn07XG52YXIgc2V0SW4gPSBmdW5jdGlvbiAoc2VnbWVudHMsIHNvdXJjZSwgdmFsdWUpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHNlZ21lbnRzW2ldO1xuICAgICAgICB2YXIgcnVsZXMgPSBkZXN0cnVjdG9yXzEuZ2V0RGVzdHJ1Y3RvcihpbmRleCk7XG4gICAgICAgIGlmICghcnVsZXMpIHtcbiAgICAgICAgICAgIGlmICghaXNWYWxpZChzb3VyY2UpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmICghaXNWYWxpZChzb3VyY2VbaW5kZXhdKSkge1xuICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZChzb3VyY2VbaW5kZXhdKSAmJiAhaXNWYWxpZCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodXRpbHNfMS5pc051bShzZWdtZW50c1tpICsgMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVtpbmRleF0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVtpbmRleF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaSA9PT0gc2VnbWVudHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZVtpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhcnJheUV4aXN0KHNvdXJjZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlc3RydWN0b3JfMS5zZXRJbkJ5RGVzdHJ1Y3Rvcihzb3VyY2UsIHJ1bGVzLCB2YWx1ZSwgeyBzZXRJbjogc2V0SW4sIGdldEluOiBnZXRJbiB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBkZWxldGVJbiA9IGZ1bmN0aW9uIChzZWdtZW50cywgc291cmNlKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaW5kZXggPSBzZWdtZW50c1tpXTtcbiAgICAgICAgdmFyIHJ1bGVzID0gZGVzdHJ1Y3Rvcl8xLmdldERlc3RydWN0b3IoaW5kZXgpO1xuICAgICAgICBpZiAoIXJ1bGVzKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gc2VnbWVudHMubGVuZ3RoIC0gMSAmJiBpc1ZhbGlkKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodXRpbHNfMS5pc0Fycihzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZS5zcGxpY2UoTnVtYmVyKGluZGV4KSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgc291cmNlW2luZGV4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKHNvdXJjZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGFycmF5RXhpc3Qoc291cmNlLCBpbmRleCkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF1dGlsc18xLmlzT2JqKHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZXN0cnVjdG9yXzEuZGVsZXRlSW5CeURlc3RydWN0b3Ioc291cmNlLCBydWxlcywge1xuICAgICAgICAgICAgICAgIHNldEluOiBzZXRJbixcbiAgICAgICAgICAgICAgICBnZXRJbjogZ2V0SW4sXG4gICAgICAgICAgICAgICAgZGVsZXRlSW46IGRlbGV0ZUluLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG52YXIgZXhpc3RJbiA9IGZ1bmN0aW9uIChzZWdtZW50cywgc291cmNlLCBzdGFydCkge1xuICAgIGlmIChzdGFydCBpbnN0YW5jZW9mIFBhdGgpIHtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5sZW5ndGg7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHNlZ21lbnRzW2ldO1xuICAgICAgICB2YXIgcnVsZXMgPSBkZXN0cnVjdG9yXzEuZ2V0RGVzdHJ1Y3RvcihpbmRleCk7XG4gICAgICAgIGlmICghcnVsZXMpIHtcbiAgICAgICAgICAgIGlmIChpID09PSBzZWdtZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZSAmJiBpbmRleCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNWYWxpZChzb3VyY2UpKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChhcnJheUV4aXN0KHNvdXJjZSwgaW5kZXgpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlID0gc291cmNlW2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdXRpbHNfMS5pc09iaihzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRlc3RydWN0b3JfMS5leGlzdEluQnlEZXN0cnVjdG9yKHNvdXJjZSwgcnVsZXMsIHN0YXJ0LCB7XG4gICAgICAgICAgICAgICAgc2V0SW46IHNldEluLFxuICAgICAgICAgICAgICAgIGdldEluOiBnZXRJbixcbiAgICAgICAgICAgICAgICBkZWxldGVJbjogZGVsZXRlSW4sXG4gICAgICAgICAgICAgICAgZXhpc3RJbjogZXhpc3RJbixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbnZhciBQYXRoID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXRoKGlucHV0KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY29uY2F0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSBjb25jYXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcGF0aCA9IG5ldyBQYXRoKCcnKTtcbiAgICAgICAgICAgIHBhdGguc2VnbWVudHMgPSAoX2EgPSBfdGhpcy5zZWdtZW50cykuY29uY2F0LmFwcGx5KF9hLCBhcmdzLm1hcChmdW5jdGlvbiAocykgeyByZXR1cm4gX3RoaXMucGFyc2VTdHJpbmcocyk7IH0pKTtcbiAgICAgICAgICAgIHBhdGguZW50aXJlID0gcGF0aC5zZWdtZW50cy5qb2luKCcuJyk7XG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIHNsaWNlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBhdGggPSBuZXcgUGF0aCgnJyk7XG4gICAgICAgICAgICBwYXRoLnNlZ21lbnRzID0gX3RoaXMuc2VnbWVudHMuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgICAgICAgICBwYXRoLmVudGlyZSA9IHBhdGguc2VnbWVudHMuam9pbignLicpO1xuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucHVzaCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIHB1c2hcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5zZWdtZW50cy5wdXNoKF90aGlzLnBhcnNlU3RyaW5nKGl0ZW0pKTtcbiAgICAgICAgICAgIF90aGlzLmVudGlyZSA9IF90aGlzLnNlZ21lbnRzLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIHBvcFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnNlZ21lbnRzLnBvcCgpO1xuICAgICAgICAgICAgX3RoaXMuZW50aXJlID0gX3RoaXMuc2VnbWVudHMuam9pbignLicpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNwbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICBpdGVtc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgc3BsaWNlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRlbGV0ZUNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaXRlbXMgPSBpdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIF90aGlzLnBhcnNlU3RyaW5nKGl0ZW0pOyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChfYSA9IF90aGlzLnNlZ21lbnRzKS5zcGxpY2UuYXBwbHkoX2EsIF9fc3ByZWFkQXJyYXlzKFtzdGFydCwgZGVsZXRlQ291bnRdLCBpdGVtcykpO1xuICAgICAgICAgICAgX3RoaXMuZW50aXJlID0gX3RoaXMuc2VnbWVudHMuam9pbignLicpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgZWFjaFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLnNlZ21lbnRzLmZvckVhY2goY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1hcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSBtYXBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2VnbWVudHMubWFwKGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZWR1Y2UgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGluaXRpYWwpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihfdGhpcy5lbnRpcmUgKyBcIiBjYW5ub3QgYmUgcmVkdWNlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnNlZ21lbnRzLnJlZHVjZShjYWxsYmFjaywgaW5pdGlhbCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZ2V0TmVhcmVzdENoaWxkUGF0aEJ5ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICAgICAgdmFyIHBhdGggPSBQYXRoLnBhcnNlKHRhcmdldCk7XG4gICAgICAgICAgICBpZiAocGF0aC5sZW5ndGggPCBfdGhpcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmNvbmNhdChwYXRoLnNlZ21lbnRzW190aGlzLmxlbmd0aF0pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnBhcmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5zbGljZSgwLCBfdGhpcy5sZW5ndGggLSAxKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pbmNsdWRlcyA9IGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgICAgICAgICB2YXIgX2EgPSBQYXRoLmdldFBhdGgocGF0dGVybiksIGVudGlyZSA9IF9hLmVudGlyZSwgc2VnbWVudHMgPSBfYS5zZWdtZW50cywgaXNNYXRjaFBhdHRlcm4gPSBfYS5pc01hdGNoUGF0dGVybjtcbiAgICAgICAgICAgIHZhciBjYWNoZSA9IF90aGlzLmluY2x1ZGVzQ2FjaGUuZ2V0KGVudGlyZSk7XG4gICAgICAgICAgICBpZiAoY2FjaGUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGU7XG4gICAgICAgICAgICB2YXIgY2FjaGVXaXRoID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuaW5jbHVkZXNDYWNoZS5zZXQoZW50aXJlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pc01hdGNoUGF0dGVybikge1xuICAgICAgICAgICAgICAgIGlmICghaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlV2l0aChfdGhpcy5tYXRjaChzZWdtZW50cykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSB1c2VkIHRvIG1hdGNoIFwiICsgZW50aXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoX3RoaXMuZW50aXJlICsgXCIgY2Fubm90IGJlIHVzZWQgdG8gbWF0Y2ggXCIgKyBlbnRpcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IF90aGlzLnNlZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVXaXRoKGZhbHNlKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXV0aWxzXzEuaXNFcXVhbChTdHJpbmcoc2VnbWVudHNbaV0pLCBTdHJpbmcoX3RoaXMuc2VnbWVudHNbaV0pKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVXaXRoKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVXaXRoKHRydWUpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IGZ1bmN0aW9uIChyZWdleHAsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpZiAoIXV0aWxzXzEuaXNGbihjYWxsYmFjaykpXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgaWYgKF90aGlzLmlzTWF0Y2hQYXR0ZXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKF90aGlzLmVudGlyZSArIFwiIGNhbm5vdCBiZSB0cmFuc2Zvcm1lZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBhcmdzID0gX3RoaXMuc2VnbWVudHMucmVkdWNlKGZ1bmN0aW9uIChidWYsIGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHJlZ2V4cCkudGVzdChrZXkpID8gYnVmLmNvbmNhdChrZXkpIDogYnVmO1xuICAgICAgICAgICAgfSwgW10pO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHZvaWQgMCwgYXJncyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubWF0Y2ggPSBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgICAgICAgdmFyIHBhdGggPSBQYXRoLmdldFBhdGgocGF0dGVybik7XG4gICAgICAgICAgICB2YXIgY2FjaGUgPSBfdGhpcy5tYXRjaENhY2hlLmdldChwYXRoLmVudGlyZSk7XG4gICAgICAgICAgICBpZiAoY2FjaGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChjYWNoZS5yZWNvcmQgJiYgY2FjaGUucmVjb3JkLnNjb3JlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubWF0Y2hTY29yZSA9IGNhY2hlLnJlY29yZC5zY29yZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlLm1hdGNoZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY2FjaGVXaXRoID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubWF0Y2hDYWNoZS5zZXQocGF0aC5lbnRpcmUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHBhdGguaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBhdGguZW50aXJlICsgXCIgY2Fubm90IG1hdGNoIFwiICsgX3RoaXMuZW50aXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1hdGNoU2NvcmUgPSAwO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVXaXRoKHBhdGgubWF0Y2goX3RoaXMuc2VnbWVudHMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlY29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiAwLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gY2FjaGVXaXRoKG5ldyBtYXRjaGVyXzEuTWF0Y2hlcihfdGhpcy50cmVlLCByZWNvcmQpLm1hdGNoKHBhdGguc2VnbWVudHMpKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubWF0Y2hTY29yZSA9IHJlY29yZC5zY29yZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5tYXRjaGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlY29yZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiAwLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gY2FjaGVXaXRoKG1hdGNoZXJfMS5NYXRjaGVyLm1hdGNoU2VnbWVudHMoX3RoaXMuc2VnbWVudHMsIHBhdGguc2VnbWVudHMsIHJlY29yZCkpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tYXRjaFNjb3JlID0gcmVjb3JkLnNjb3JlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0Lm1hdGNoZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1hdGNoQWxpYXNHcm91cCA9IGZ1bmN0aW9uIChuYW1lLCBhbGlhcykge1xuICAgICAgICAgICAgdmFyIG5hbWVQYXRoID0gUGF0aC5wYXJzZShuYW1lKTtcbiAgICAgICAgICAgIHZhciBhbGlhc1BhdGggPSBQYXRoLnBhcnNlKGFsaWFzKTtcbiAgICAgICAgICAgIHZhciBuYW1lTWF0Y2hlZCA9IF90aGlzLm1hdGNoKG5hbWVQYXRoKTtcbiAgICAgICAgICAgIHZhciBuYW1lTWF0Y2hlZFNjb3JlID0gX3RoaXMubWF0Y2hTY29yZTtcbiAgICAgICAgICAgIHZhciBhbGlhc01hdGNoZWQgPSBfdGhpcy5tYXRjaChhbGlhc1BhdGgpO1xuICAgICAgICAgICAgdmFyIGFsaWFzTWF0Y2hlZFNjb3JlID0gX3RoaXMubWF0Y2hTY29yZTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5oYXZlRXhjbHVkZVBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICBpZiAobmFtZU1hdGNoZWRTY29yZSA+PSBhbGlhc01hdGNoZWRTY29yZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmFtZU1hdGNoZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxpYXNNYXRjaGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBuYW1lTWF0Y2hlZCB8fCBhbGlhc01hdGNoZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZXhpc3RJbiA9IGZ1bmN0aW9uIChzb3VyY2UsIHN0YXJ0KSB7XG4gICAgICAgICAgICBpZiAoc3RhcnQgPT09IHZvaWQgMCkgeyBzdGFydCA9IDA7IH1cbiAgICAgICAgICAgIHJldHVybiBleGlzdEluKF90aGlzLnNlZ21lbnRzLCBzb3VyY2UsIHN0YXJ0KTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXRJbiA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRJbihfdGhpcy5zZWdtZW50cywgc291cmNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRJbiA9IGZ1bmN0aW9uIChzb3VyY2UsIHZhbHVlKSB7XG4gICAgICAgICAgICBzZXRJbihfdGhpcy5zZWdtZW50cywgc291cmNlLCB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmRlbGV0ZUluID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgICAgICAgZGVsZXRlSW4oX3RoaXMuc2VnbWVudHMsIHNvdXJjZSk7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgX2EgPSB0aGlzLnBhcnNlKGlucHV0KSwgdHJlZSA9IF9hLnRyZWUsIHNlZ21lbnRzID0gX2Euc2VnbWVudHMsIGVudGlyZSA9IF9hLmVudGlyZSwgaXNNYXRjaFBhdHRlcm4gPSBfYS5pc01hdGNoUGF0dGVybiwgaXNXaWxkTWF0Y2hQYXR0ZXJuID0gX2EuaXNXaWxkTWF0Y2hQYXR0ZXJuLCBoYXZlRXhjbHVkZVBhdHRlcm4gPSBfYS5oYXZlRXhjbHVkZVBhdHRlcm47XG4gICAgICAgIHRoaXMuZW50aXJlID0gZW50aXJlO1xuICAgICAgICB0aGlzLnNlZ21lbnRzID0gc2VnbWVudHM7XG4gICAgICAgIHRoaXMuaXNNYXRjaFBhdHRlcm4gPSBpc01hdGNoUGF0dGVybjtcbiAgICAgICAgdGhpcy5pc1dpbGRNYXRjaFBhdHRlcm4gPSBpc1dpbGRNYXRjaFBhdHRlcm47XG4gICAgICAgIHRoaXMuaGF2ZUV4Y2x1ZGVQYXR0ZXJuID0gaGF2ZUV4Y2x1ZGVQYXR0ZXJuO1xuICAgICAgICB0aGlzLnRyZWUgPSB0cmVlO1xuICAgICAgICB0aGlzLm1hdGNoQ2FjaGUgPSBuZXcgbHJ1XzEuTFJVTWFwKDIwMCk7XG4gICAgICAgIHRoaXMuaW5jbHVkZXNDYWNoZSA9IG5ldyBscnVfMS5MUlVNYXAoMjAwKTtcbiAgICB9XG4gICAgUGF0aC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGlyZTtcbiAgICB9O1xuICAgIFBhdGgucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlZ21lbnRzO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBhdGgucHJvdG90eXBlLCBcImxlbmd0aFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VnbWVudHMubGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgUGF0aC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAocGF0dGVybiBpbnN0YW5jZW9mIFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZW50aXJlOiBwYXR0ZXJuLmVudGlyZSxcbiAgICAgICAgICAgICAgICBzZWdtZW50czogcGF0dGVybi5zZWdtZW50cy5zbGljZSgpLFxuICAgICAgICAgICAgICAgIGlzV2lsZE1hdGNoUGF0dGVybjogcGF0dGVybi5pc1dpbGRNYXRjaFBhdHRlcm4sXG4gICAgICAgICAgICAgICAgaXNNYXRjaFBhdHRlcm46IHBhdHRlcm4uaXNNYXRjaFBhdHRlcm4sXG4gICAgICAgICAgICAgICAgaGF2ZUV4Y2x1ZGVQYXR0ZXJuOiBwYXR0ZXJuLmhhdmVFeGNsdWRlUGF0dGVybixcbiAgICAgICAgICAgICAgICB0cmVlOiBwYXR0ZXJuLnRyZWUsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHV0aWxzXzEuaXNTdHIocGF0dGVybikpIHtcbiAgICAgICAgICAgIGlmICghcGF0dGVybilcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBlbnRpcmU6ICcnLFxuICAgICAgICAgICAgICAgICAgICBzZWdtZW50czogW10sXG4gICAgICAgICAgICAgICAgICAgIGlzV2lsZE1hdGNoUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGhhdmVFeGNsdWRlUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGlzTWF0Y2hQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBwYXJzZXJfMS5QYXJzZXIocGF0dGVybik7XG4gICAgICAgICAgICB2YXIgdHJlZSA9IHBhcnNlci5wYXJzZSgpO1xuICAgICAgICAgICAgaWYgKCFwYXJzZXIuaXNNYXRjaFBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VnbWVudHMgPSBwYXJzZXIuZGF0YS5zZWdtZW50cztcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBlbnRpcmU6IHNlZ21lbnRzLmpvaW4oJy4nKSxcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IHNlZ21lbnRzLFxuICAgICAgICAgICAgICAgICAgICB0cmVlOiB0cmVlLFxuICAgICAgICAgICAgICAgICAgICBpc1dpbGRNYXRjaFBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBoYXZlRXhjbHVkZVBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpc01hdGNoUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGVudGlyZTogcGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgc2VnbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBpc1dpbGRNYXRjaFBhdHRlcm46IHBhcnNlci5pc1dpbGRNYXRjaFBhdHRlcm4sXG4gICAgICAgICAgICAgICAgICAgIGhhdmVFeGNsdWRlUGF0dGVybjogcGFyc2VyLmhhdmVFeGNsdWRlUGF0dGVybixcbiAgICAgICAgICAgICAgICAgICAgaXNNYXRjaFBhdHRlcm46IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHRyZWU6IHRyZWUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1dGlsc18xLmlzRm4ocGF0dGVybikgJiYgcGF0dGVybltpc01hdGNoZXJdKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZShwYXR0ZXJuWydwYXRoJ10pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHV0aWxzXzEuaXNBcnIocGF0dGVybikpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZW50aXJlOiBwYXR0ZXJuLmpvaW4oJy4nKSxcbiAgICAgICAgICAgICAgICBzZWdtZW50czogcGF0dGVybi5yZWR1Y2UoZnVuY3Rpb24gKGJ1Ziwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWYuY29uY2F0KF90aGlzLnBhcnNlU3RyaW5nKGtleSkpO1xuICAgICAgICAgICAgICAgIH0sIFtdKSxcbiAgICAgICAgICAgICAgICBpc1dpbGRNYXRjaFBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgIGhhdmVFeGNsdWRlUGF0dGVybjogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXNNYXRjaFBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZW50aXJlOiAnJyxcbiAgICAgICAgICAgICAgICBzZWdtZW50czogcGF0dGVybiAhPT0gdW5kZWZpbmVkID8gW3BhdHRlcm5dIDogW10sXG4gICAgICAgICAgICAgICAgaXNXaWxkTWF0Y2hQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBoYXZlRXhjbHVkZVBhdHRlcm46IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzTWF0Y2hQYXR0ZXJuOiBmYWxzZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhdGgucHJvdG90eXBlLnBhcnNlU3RyaW5nID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgICBpZiAodXRpbHNfMS5pc1N0cihzb3VyY2UpKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZSgvXFxzKi9nLCAnJyk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBfYSA9IHRoaXMucGFyc2Uoc291cmNlKSwgc2VnbWVudHMgPSBfYS5zZWdtZW50cywgaXNNYXRjaFBhdHRlcm4gPSBfYS5pc01hdGNoUGF0dGVybjtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWlzTWF0Y2hQYXR0ZXJuID8gc2VnbWVudHMgOiBzb3VyY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc291cmNlIGluc3RhbmNlb2YgUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5zZWdtZW50cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIH07XG4gICAgUGF0aC5tYXRjaCA9IGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgICAgIHZhciBwYXRoID0gUGF0aC5nZXRQYXRoKHBhdHRlcm4pO1xuICAgICAgICB2YXIgbWF0Y2hlciA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXRoLm1hdGNoKHRhcmdldCk7XG4gICAgICAgIH07XG4gICAgICAgIG1hdGNoZXJbaXNNYXRjaGVyXSA9IHRydWU7XG4gICAgICAgIG1hdGNoZXIucGF0aCA9IHBhdGg7XG4gICAgICAgIHJldHVybiBtYXRjaGVyO1xuICAgIH07XG4gICAgUGF0aC50cmFuc2Zvcm0gPSBmdW5jdGlvbiAocGF0dGVybiwgcmVnZXhwLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gUGF0aC5nZXRQYXRoKHBhdHRlcm4pLnRyYW5zZm9ybShyZWdleHAsIGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIFBhdGgucGFyc2UgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICBpZiAocGF0aCA9PT0gdm9pZCAwKSB7IHBhdGggPSAnJzsgfVxuICAgICAgICByZXR1cm4gUGF0aC5nZXRQYXRoKHBhdGgpO1xuICAgIH07XG4gICAgUGF0aC5nZXRQYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICAgICAgaWYgKHBhdGggPT09IHZvaWQgMCkgeyBwYXRoID0gJyc7IH1cbiAgICAgICAgaWYgKHBhdGggaW5zdGFuY2VvZiBQYXRoKSB7XG4gICAgICAgICAgICB2YXIgZm91bmQgPSBwYXRoQ2FjaGUuZ2V0KHBhdGguZW50aXJlKTtcbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhdGhDYWNoZS5zZXQocGF0aC5lbnRpcmUsIHBhdGgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBhdGggJiYgcGF0aFtpc01hdGNoZXJdKSB7XG4gICAgICAgICAgICByZXR1cm4gUGF0aC5nZXRQYXRoKHBhdGhbJ3BhdGgnXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gcGF0aC50b1N0cmluZygpO1xuICAgICAgICAgICAgdmFyIGZvdW5kID0gcGF0aENhY2hlLmdldChrZXkpO1xuICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF0aCA9IG5ldyBQYXRoKHBhdGgpO1xuICAgICAgICAgICAgICAgIHBhdGhDYWNoZS5zZXQoa2V5LCBwYXRoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgUGF0aC5nZXRJbiA9IGZ1bmN0aW9uIChzb3VyY2UsIHBhdHRlcm4pIHtcbiAgICAgICAgdmFyIHBhdGggPSBQYXRoLmdldFBhdGgocGF0dGVybik7XG4gICAgICAgIHJldHVybiBwYXRoLmdldEluKHNvdXJjZSk7XG4gICAgfTtcbiAgICBQYXRoLnNldEluID0gZnVuY3Rpb24gKHNvdXJjZSwgcGF0dGVybiwgdmFsdWUpIHtcbiAgICAgICAgdmFyIHBhdGggPSBQYXRoLmdldFBhdGgocGF0dGVybik7XG4gICAgICAgIHJldHVybiBwYXRoLnNldEluKHNvdXJjZSwgdmFsdWUpO1xuICAgIH07XG4gICAgUGF0aC5kZWxldGVJbiA9IGZ1bmN0aW9uIChzb3VyY2UsIHBhdHRlcm4pIHtcbiAgICAgICAgdmFyIHBhdGggPSBQYXRoLmdldFBhdGgocGF0dGVybik7XG4gICAgICAgIHJldHVybiBwYXRoLmRlbGV0ZUluKHNvdXJjZSk7XG4gICAgfTtcbiAgICBQYXRoLmV4aXN0SW4gPSBmdW5jdGlvbiAoc291cmNlLCBwYXR0ZXJuLCBzdGFydCkge1xuICAgICAgICB2YXIgcGF0aCA9IFBhdGguZ2V0UGF0aChwYXR0ZXJuKTtcbiAgICAgICAgcmV0dXJuIHBhdGguZXhpc3RJbihzb3VyY2UsIHN0YXJ0KTtcbiAgICB9O1xuICAgIHJldHVybiBQYXRoO1xufSgpKTtcbmV4cG9ydHMuUGF0aCA9IFBhdGg7XG5leHBvcnRzLmRlZmF1bHQgPSBQYXRoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgY29vbF9wYXRoXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImNvb2wtcGF0aFwiKSk7XG5leHBvcnRzLkZvcm1QYXRoID0gY29vbF9wYXRoXzEuZGVmYXVsdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbnZhciBjYWNoZXMgPSB7fTtcbmZ1bmN0aW9uIGRlcHJlY2F0ZShtZXRob2QsIG1lc3NhZ2UsIGhlbHApIHtcbiAgICBpZiAodHlwZXNfMS5pc0ZuKG1ldGhvZCkpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChwMSwgcDIsIHAzLCBwNCwgcDUpIHtcbiAgICAgICAgICAgIGRlcHJlY2F0ZShtZXNzYWdlLCBoZWxwKTtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHR5cGVzXzEuaXNTdHIobWV0aG9kKSAmJiAhY2FjaGVzW21ldGhvZF0pIHtcbiAgICAgICAgY2FjaGVzW21ldGhvZF0gPSB0cnVlO1xuICAgICAgICBjb25zb2xlLndhcm4obmV3IEVycm9yKG1ldGhvZCArIFwiIGhhcyBiZWVuIGRlcHJlY2F0ZWQuIERvIG5vdCBjb250aW51ZSB0byB1c2UgdGhpcyBhcGkuXCIgKyAobWVzc2FnZSB8fFxuICAgICAgICAgICAgJycpKSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZXByZWNhdGUgPSBkZXByZWNhdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG52YXIgYXJyYXlfMSA9IHJlcXVpcmUoXCIuL2FycmF5XCIpO1xudmFyIFN1YnNjcmliYWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3Vic2NyaWJhYmxlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnN1YnNjcmliZXJzID0ge1xuICAgICAgICAgICAgaW5kZXg6IDBcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICh0eXBlc18xLmlzRm4oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gX3RoaXMuc3Vic2NyaWJlcnMuaW5kZXggKyAxO1xuICAgICAgICAgICAgICAgIF90aGlzLnN1YnNjcmliZXJzW2luZGV4XSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIF90aGlzLnN1YnNjcmliZXJzLmluZGV4Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuc3Vic2NyaWJlcnNbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIF90aGlzLnN1YnNjcmliZXJzW2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5ub3RpZnkgPSBmdW5jdGlvbiAocGF5bG9hZCwgc2lsZW50KSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnN1YnNjcmlwdGlvbiAmJiB0eXBlc18xLmlzRm4oX3RoaXMuc3Vic2NyaXB0aW9uLm5vdGlmeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLnN1YnNjcmlwdGlvbi5ub3RpZnkuY2FsbChfdGhpcywgcGF5bG9hZCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2lsZW50KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciBmaWx0ZXIgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5zdWJzY3JpcHRpb24gJiYgdHlwZXNfMS5pc0ZuKF90aGlzLnN1YnNjcmlwdGlvbi5maWx0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5zdWJzY3JpcHRpb24uZmlsdGVyLmNhbGwoX3RoaXMsIHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhcnJheV8xLmVhY2goX3RoaXMuc3Vic2NyaWJlcnMsIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlc18xLmlzRm4oY2FsbGJhY2spKVxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmaWx0ZXIocGF5bG9hZCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBTdWJzY3JpYmFibGU7XG59KCkpO1xuZXhwb3J0cy5TdWJzY3JpYmFibGUgPSBTdWJzY3JpYmFibGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBiaWdfZGF0YV8xID0gcmVxdWlyZShcIi4vYmlnLWRhdGFcIik7XG52YXIgaXNFbXB0eV8xID0gcmVxdWlyZShcIi4vaXNFbXB0eVwiKTtcbmZ1bmN0aW9uIGRlZmF1bHRJc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkge1xuICAgIHJldHVybiBpc05vbk51bGxPYmplY3QodmFsdWUpICYmICFpc1NwZWNpYWwodmFsdWUpO1xufVxuZnVuY3Rpb24gaXNOb25OdWxsT2JqZWN0KHZhbHVlKSB7XG4gICAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jztcbn1cbmZ1bmN0aW9uIGlzU3BlY2lhbCh2YWx1ZSkge1xuICAgIHZhciBzdHJpbmdWYWx1ZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gICAgcmV0dXJuIChzdHJpbmdWYWx1ZSA9PT0gJ1tvYmplY3QgUmVnRXhwXScgfHxcbiAgICAgICAgc3RyaW5nVmFsdWUgPT09ICdbb2JqZWN0IERhdGVdJyB8fFxuICAgICAgICBpc1JlYWN0RWxlbWVudCh2YWx1ZSkpO1xufVxudmFyIGNhblVzZVN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvcjtcbnZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSBjYW5Vc2VTeW1ib2wgPyBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgOiAweGVhYzc7XG5mdW5jdGlvbiBpc1JlYWN0RWxlbWVudCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xufVxuZnVuY3Rpb24gZW1wdHlUYXJnZXQodmFsKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsKSA/IFtdIDoge307XG59XG5mdW5jdGlvbiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh2YWx1ZSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmNsb25lICE9PSBmYWxzZSAmJiBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICBpZiAoYmlnX2RhdGFfMS5CaWdEYXRhLmlzQmlnRGF0YSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBiaWdfZGF0YV8xLkJpZ0RhdGEuY2xvbmUodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRlZXBtZXJnZShlbXB0eVRhcmdldCh2YWx1ZSksIHZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBkZWZhdWx0QXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuICAgIHJldHVybiB0YXJnZXQuY29uY2F0KHNvdXJjZSkubWFwKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChlbGVtZW50LCBvcHRpb25zKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLmN1c3RvbU1lcmdlKSB7XG4gICAgICAgIHJldHVybiBkZWVwbWVyZ2U7XG4gICAgfVxuICAgIHZhciBjdXN0b21NZXJnZSA9IG9wdGlvbnMuY3VzdG9tTWVyZ2Uoa2V5KTtcbiAgICByZXR1cm4gdHlwZW9mIGN1c3RvbU1lcmdlID09PSAnZnVuY3Rpb24nID8gY3VzdG9tTWVyZ2UgOiBkZWVwbWVyZ2U7XG59XG5mdW5jdGlvbiBnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG4gICAgICAgID8gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpLmZpbHRlcihmdW5jdGlvbiAoc3ltYm9sKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0LnByb3BlcnR5SXNFbnVtZXJhYmxlKHN5bWJvbCk7XG4gICAgICAgIH0pXG4gICAgICAgIDogW107XG59XG5mdW5jdGlvbiBnZXRLZXlzKHRhcmdldCkge1xuICAgIGlmICghaXNFbXB0eV8xLmlzVmFsaWQodGFyZ2V0KSlcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0YXJnZXQpLmNvbmNhdChnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpO1xufVxuZnVuY3Rpb24gcHJvcGVydHlJc09uT2JqZWN0KG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gcHJvcGVydHkgaW4gb2JqZWN0O1xuICAgIH1cbiAgICBjYXRjaCAoXykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuZnVuY3Rpb24gcHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkge1xuICAgIHJldHVybiAocHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAmJlxuICAgICAgICAhKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwga2V5KSAmJlxuICAgICAgICAgICAgT2JqZWN0LnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodGFyZ2V0LCBrZXkpKSk7XG59XG5mdW5jdGlvbiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucykge1xuICAgIHZhciBkZXN0aW5hdGlvbiA9IG9wdGlvbnMuYXNzaWduID8gdGFyZ2V0IHx8IHt9IDoge307XG4gICAgaWYgKCFvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHRhcmdldCkpXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgaWYgKCFvcHRpb25zLmFzc2lnbikge1xuICAgICAgICBnZXRLZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQodGFyZ2V0W2tleV0sIG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0S2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAocHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRhcmdldFtrZXldKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BlcnR5SXNPbk9iamVjdCh0YXJnZXQsIGtleSkgJiZcbiAgICAgICAgICAgIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3Qoc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlW2tleV0sIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xufVxuZnVuY3Rpb24gZGVlcG1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgb3B0aW9ucy5hcnJheU1lcmdlID0gb3B0aW9ucy5hcnJheU1lcmdlIHx8IGRlZmF1bHRBcnJheU1lcmdlO1xuICAgIG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgPVxuICAgICAgICBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0IHx8IGRlZmF1bHRJc01lcmdlYWJsZU9iamVjdDtcbiAgICBvcHRpb25zLmNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQ7XG4gICAgdmFyIHNvdXJjZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KHNvdXJjZSk7XG4gICAgdmFyIHRhcmdldElzQXJyYXkgPSBBcnJheS5pc0FycmF5KHRhcmdldCk7XG4gICAgdmFyIHNvdXJjZUFuZFRhcmdldFR5cGVzTWF0Y2ggPSBzb3VyY2VJc0FycmF5ID09PSB0YXJnZXRJc0FycmF5O1xuICAgIGlmICghc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCkge1xuICAgICAgICByZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlLCBvcHRpb25zKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc291cmNlSXNBcnJheSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5hcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBtZXJnZU9iamVjdCh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGVlcG1lcmdlQWxsKGFycmF5LCBvcHRpb25zKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpcnN0IGFyZ3VtZW50IHNob3VsZCBiZSBhbiBhcnJheScpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBuZXh0KSB7XG4gICAgICAgIHJldHVybiBkZWVwbWVyZ2UocHJldiwgbmV4dCwgb3B0aW9ucyk7XG4gICAgfSwge30pO1xufVxuZGVlcG1lcmdlLmFsbCA9IGRlZXBtZXJnZUFsbDtcbmV4cG9ydHMubWVyZ2UgPSBkZWVwbWVyZ2U7XG4iLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjAuMTkuMVxuICogc2NoZWR1bGVyLnByb2R1Y3Rpb24ubWluLmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO3ZhciBmLGcsaCxrLGw7XG5pZihcInVuZGVmaW5lZFwiPT09dHlwZW9mIHdpbmRvd3x8XCJmdW5jdGlvblwiIT09dHlwZW9mIE1lc3NhZ2VDaGFubmVsKXt2YXIgcD1udWxsLHE9bnVsbCx0PWZ1bmN0aW9uKCl7aWYobnVsbCE9PXApdHJ5e3ZhciBhPWV4cG9ydHMudW5zdGFibGVfbm93KCk7cCghMCxhKTtwPW51bGx9Y2F0Y2goYil7dGhyb3cgc2V0VGltZW91dCh0LDApLGI7fX0sdT1EYXRlLm5vdygpO2V4cG9ydHMudW5zdGFibGVfbm93PWZ1bmN0aW9uKCl7cmV0dXJuIERhdGUubm93KCktdX07Zj1mdW5jdGlvbihhKXtudWxsIT09cD9zZXRUaW1lb3V0KGYsMCxhKToocD1hLHNldFRpbWVvdXQodCwwKSl9O2c9ZnVuY3Rpb24oYSxiKXtxPXNldFRpbWVvdXQoYSxiKX07aD1mdW5jdGlvbigpe2NsZWFyVGltZW91dChxKX07az1mdW5jdGlvbigpe3JldHVybiExfTtsPWV4cG9ydHMudW5zdGFibGVfZm9yY2VGcmFtZVJhdGU9ZnVuY3Rpb24oKXt9fWVsc2V7dmFyIHc9d2luZG93LnBlcmZvcm1hbmNlLHg9d2luZG93LkRhdGUsXG55PXdpbmRvdy5zZXRUaW1lb3V0LHo9d2luZG93LmNsZWFyVGltZW91dDtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUpe3ZhciBBPXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZTtcImZ1bmN0aW9uXCIhPT10eXBlb2Ygd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSYmY29uc29sZS5lcnJvcihcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLiBNYWtlIHN1cmUgdGhhdCB5b3UgbG9hZCBhIHBvbHlmaWxsIGluIG9sZGVyIGJyb3dzZXJzLiBodHRwczovL2ZiLm1lL3JlYWN0LXBvbHlmaWxsc1wiKTtcImZ1bmN0aW9uXCIhPT10eXBlb2YgQSYmY29uc29sZS5lcnJvcihcIlRoaXMgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgY2FuY2VsQW5pbWF0aW9uRnJhbWUuIE1ha2Ugc3VyZSB0aGF0IHlvdSBsb2FkIGEgcG9seWZpbGwgaW4gb2xkZXIgYnJvd3NlcnMuIGh0dHBzOi8vZmIubWUvcmVhY3QtcG9seWZpbGxzXCIpfWlmKFwib2JqZWN0XCI9PT1cbnR5cGVvZiB3JiZcImZ1bmN0aW9uXCI9PT10eXBlb2Ygdy5ub3cpZXhwb3J0cy51bnN0YWJsZV9ub3c9ZnVuY3Rpb24oKXtyZXR1cm4gdy5ub3coKX07ZWxzZXt2YXIgQj14Lm5vdygpO2V4cG9ydHMudW5zdGFibGVfbm93PWZ1bmN0aW9uKCl7cmV0dXJuIHgubm93KCktQn19dmFyIEM9ITEsRD1udWxsLEU9LTEsRj01LEc9MDtrPWZ1bmN0aW9uKCl7cmV0dXJuIGV4cG9ydHMudW5zdGFibGVfbm93KCk+PUd9O2w9ZnVuY3Rpb24oKXt9O2V4cG9ydHMudW5zdGFibGVfZm9yY2VGcmFtZVJhdGU9ZnVuY3Rpb24oYSl7MD5hfHwxMjU8YT9jb25zb2xlLmVycm9yKFwiZm9yY2VGcmFtZVJhdGUgdGFrZXMgYSBwb3NpdGl2ZSBpbnQgYmV0d2VlbiAwIGFuZCAxMjUsIGZvcmNpbmcgZnJhbWVyYXRlcyBoaWdoZXIgdGhhbiAxMjUgZnBzIGlzIG5vdCB1bnN1cHBvcnRlZFwiKTpGPTA8YT9NYXRoLmZsb29yKDFFMy9hKTo1fTt2YXIgSD1uZXcgTWVzc2FnZUNoYW5uZWwsST1ILnBvcnQyO0gucG9ydDEub25tZXNzYWdlPVxuZnVuY3Rpb24oKXtpZihudWxsIT09RCl7dmFyIGE9ZXhwb3J0cy51bnN0YWJsZV9ub3coKTtHPWErRjt0cnl7RCghMCxhKT9JLnBvc3RNZXNzYWdlKG51bGwpOihDPSExLEQ9bnVsbCl9Y2F0Y2goYil7dGhyb3cgSS5wb3N0TWVzc2FnZShudWxsKSxiO319ZWxzZSBDPSExfTtmPWZ1bmN0aW9uKGEpe0Q9YTtDfHwoQz0hMCxJLnBvc3RNZXNzYWdlKG51bGwpKX07Zz1mdW5jdGlvbihhLGIpe0U9eShmdW5jdGlvbigpe2EoZXhwb3J0cy51bnN0YWJsZV9ub3coKSl9LGIpfTtoPWZ1bmN0aW9uKCl7eihFKTtFPS0xfX1mdW5jdGlvbiBKKGEsYil7dmFyIGM9YS5sZW5ndGg7YS5wdXNoKGIpO2E6Zm9yKDs7KXt2YXIgZD1jLTE+Pj4xLGU9YVtkXTtpZih2b2lkIDAhPT1lJiYwPEsoZSxiKSlhW2RdPWIsYVtjXT1lLGM9ZDtlbHNlIGJyZWFrIGF9fWZ1bmN0aW9uIEwoYSl7YT1hWzBdO3JldHVybiB2b2lkIDA9PT1hP251bGw6YX1cbmZ1bmN0aW9uIE0oYSl7dmFyIGI9YVswXTtpZih2b2lkIDAhPT1iKXt2YXIgYz1hLnBvcCgpO2lmKGMhPT1iKXthWzBdPWM7YTpmb3IodmFyIGQ9MCxlPWEubGVuZ3RoO2Q8ZTspe3ZhciBtPTIqKGQrMSktMSxuPWFbbV0sdj1tKzEscj1hW3ZdO2lmKHZvaWQgMCE9PW4mJjA+SyhuLGMpKXZvaWQgMCE9PXImJjA+SyhyLG4pPyhhW2RdPXIsYVt2XT1jLGQ9dik6KGFbZF09bixhW21dPWMsZD1tKTtlbHNlIGlmKHZvaWQgMCE9PXImJjA+SyhyLGMpKWFbZF09cixhW3ZdPWMsZD12O2Vsc2UgYnJlYWsgYX19cmV0dXJuIGJ9cmV0dXJuIG51bGx9ZnVuY3Rpb24gSyhhLGIpe3ZhciBjPWEuc29ydEluZGV4LWIuc29ydEluZGV4O3JldHVybiAwIT09Yz9jOmEuaWQtYi5pZH12YXIgTj1bXSxPPVtdLFA9MSxRPW51bGwsUj0zLFM9ITEsVD0hMSxVPSExO1xuZnVuY3Rpb24gVihhKXtmb3IodmFyIGI9TChPKTtudWxsIT09Yjspe2lmKG51bGw9PT1iLmNhbGxiYWNrKU0oTyk7ZWxzZSBpZihiLnN0YXJ0VGltZTw9YSlNKE8pLGIuc29ydEluZGV4PWIuZXhwaXJhdGlvblRpbWUsSihOLGIpO2Vsc2UgYnJlYWs7Yj1MKE8pfX1mdW5jdGlvbiBXKGEpe1U9ITE7VihhKTtpZighVClpZihudWxsIT09TChOKSlUPSEwLGYoWCk7ZWxzZXt2YXIgYj1MKE8pO251bGwhPT1iJiZnKFcsYi5zdGFydFRpbWUtYSl9fVxuZnVuY3Rpb24gWChhLGIpe1Q9ITE7VSYmKFU9ITEsaCgpKTtTPSEwO3ZhciBjPVI7dHJ5e1YoYik7Zm9yKFE9TChOKTtudWxsIT09USYmKCEoUS5leHBpcmF0aW9uVGltZT5iKXx8YSYmIWsoKSk7KXt2YXIgZD1RLmNhbGxiYWNrO2lmKG51bGwhPT1kKXtRLmNhbGxiYWNrPW51bGw7Uj1RLnByaW9yaXR5TGV2ZWw7dmFyIGU9ZChRLmV4cGlyYXRpb25UaW1lPD1iKTtiPWV4cG9ydHMudW5zdGFibGVfbm93KCk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGU/US5jYWxsYmFjaz1lOlE9PT1MKE4pJiZNKE4pO1YoYil9ZWxzZSBNKE4pO1E9TChOKX1pZihudWxsIT09USl2YXIgbT0hMDtlbHNle3ZhciBuPUwoTyk7bnVsbCE9PW4mJmcoVyxuLnN0YXJ0VGltZS1iKTttPSExfXJldHVybiBtfWZpbmFsbHl7UT1udWxsLFI9YyxTPSExfX1cbmZ1bmN0aW9uIFkoYSl7c3dpdGNoKGEpe2Nhc2UgMTpyZXR1cm4tMTtjYXNlIDI6cmV0dXJuIDI1MDtjYXNlIDU6cmV0dXJuIDEwNzM3NDE4MjM7Y2FzZSA0OnJldHVybiAxRTQ7ZGVmYXVsdDpyZXR1cm4gNUUzfX12YXIgWj1sO2V4cG9ydHMudW5zdGFibGVfSWRsZVByaW9yaXR5PTU7ZXhwb3J0cy51bnN0YWJsZV9JbW1lZGlhdGVQcmlvcml0eT0xO2V4cG9ydHMudW5zdGFibGVfTG93UHJpb3JpdHk9NDtleHBvcnRzLnVuc3RhYmxlX05vcm1hbFByaW9yaXR5PTM7ZXhwb3J0cy51bnN0YWJsZV9Qcm9maWxpbmc9bnVsbDtleHBvcnRzLnVuc3RhYmxlX1VzZXJCbG9ja2luZ1ByaW9yaXR5PTI7ZXhwb3J0cy51bnN0YWJsZV9jYW5jZWxDYWxsYmFjaz1mdW5jdGlvbihhKXthLmNhbGxiYWNrPW51bGx9O2V4cG9ydHMudW5zdGFibGVfY29udGludWVFeGVjdXRpb249ZnVuY3Rpb24oKXtUfHxTfHwoVD0hMCxmKFgpKX07XG5leHBvcnRzLnVuc3RhYmxlX2dldEN1cnJlbnRQcmlvcml0eUxldmVsPWZ1bmN0aW9uKCl7cmV0dXJuIFJ9O2V4cG9ydHMudW5zdGFibGVfZ2V0Rmlyc3RDYWxsYmFja05vZGU9ZnVuY3Rpb24oKXtyZXR1cm4gTChOKX07ZXhwb3J0cy51bnN0YWJsZV9uZXh0PWZ1bmN0aW9uKGEpe3N3aXRjaChSKXtjYXNlIDE6Y2FzZSAyOmNhc2UgMzp2YXIgYj0zO2JyZWFrO2RlZmF1bHQ6Yj1SfXZhciBjPVI7Uj1iO3RyeXtyZXR1cm4gYSgpfWZpbmFsbHl7Uj1jfX07ZXhwb3J0cy51bnN0YWJsZV9wYXVzZUV4ZWN1dGlvbj1mdW5jdGlvbigpe307ZXhwb3J0cy51bnN0YWJsZV9yZXF1ZXN0UGFpbnQ9WjtleHBvcnRzLnVuc3RhYmxlX3J1bldpdGhQcmlvcml0eT1mdW5jdGlvbihhLGIpe3N3aXRjaChhKXtjYXNlIDE6Y2FzZSAyOmNhc2UgMzpjYXNlIDQ6Y2FzZSA1OmJyZWFrO2RlZmF1bHQ6YT0zfXZhciBjPVI7Uj1hO3RyeXtyZXR1cm4gYigpfWZpbmFsbHl7Uj1jfX07XG5leHBvcnRzLnVuc3RhYmxlX3NjaGVkdWxlQ2FsbGJhY2s9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWV4cG9ydHMudW5zdGFibGVfbm93KCk7aWYoXCJvYmplY3RcIj09PXR5cGVvZiBjJiZudWxsIT09Yyl7dmFyIGU9Yy5kZWxheTtlPVwibnVtYmVyXCI9PT10eXBlb2YgZSYmMDxlP2QrZTpkO2M9XCJudW1iZXJcIj09PXR5cGVvZiBjLnRpbWVvdXQ/Yy50aW1lb3V0OlkoYSl9ZWxzZSBjPVkoYSksZT1kO2M9ZStjO2E9e2lkOlArKyxjYWxsYmFjazpiLHByaW9yaXR5TGV2ZWw6YSxzdGFydFRpbWU6ZSxleHBpcmF0aW9uVGltZTpjLHNvcnRJbmRleDotMX07ZT5kPyhhLnNvcnRJbmRleD1lLEooTyxhKSxudWxsPT09TChOKSYmYT09PUwoTykmJihVP2goKTpVPSEwLGcoVyxlLWQpKSk6KGEuc29ydEluZGV4PWMsSihOLGEpLFR8fFN8fChUPSEwLGYoWCkpKTtyZXR1cm4gYX07XG5leHBvcnRzLnVuc3RhYmxlX3Nob3VsZFlpZWxkPWZ1bmN0aW9uKCl7dmFyIGE9ZXhwb3J0cy51bnN0YWJsZV9ub3coKTtWKGEpO3ZhciBiPUwoTik7cmV0dXJuIGIhPT1RJiZudWxsIT09USYmbnVsbCE9PWImJm51bGwhPT1iLmNhbGxiYWNrJiZiLnN0YXJ0VGltZTw9YSYmYi5leHBpcmF0aW9uVGltZTxRLmV4cGlyYXRpb25UaW1lfHxrKCl9O2V4cG9ydHMudW5zdGFibGVfd3JhcENhbGxiYWNrPWZ1bmN0aW9uKGEpe3ZhciBiPVI7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9UjtSPWI7dHJ5e3JldHVybiBhLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1maW5hbGx5e1I9Y319fTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9zY2hlZHVsZXIucHJvZHVjdGlvbi5taW4uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvc2NoZWR1bGVyLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBzY2hlZHVsZXJfMSA9IHJlcXVpcmUoXCJzY2hlZHVsZXJcIik7XG5leHBvcnRzLnNjaGVkdWxlciA9IHtcbiAgICBhcHBseVdpdGhJZGxlUHJpb3JpdHk6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBzY2hlZHVsZXJfMS51bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrKHNjaGVkdWxlcl8xLnVuc3RhYmxlX0lkbGVQcmlvcml0eSwgY2FsbGJhY2spO1xuICAgIH0sXG4gICAgYXBwbHlXaXRoTG93UHJpb3JpdHk6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBzY2hlZHVsZXJfMS51bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrKHNjaGVkdWxlcl8xLnVuc3RhYmxlX0xvd1ByaW9yaXR5LCBjYWxsYmFjayk7XG4gICAgfSxcbiAgICBhcHBseVdpZHRoTm9ybWFsUHJpb3JpdHk6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBzY2hlZHVsZXJfMS51bnN0YWJsZV9zY2hlZHVsZUNhbGxiYWNrKHNjaGVkdWxlcl8xLnVuc3RhYmxlX05vcm1hbFByaW9yaXR5LCBjYWxsYmFjayk7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGFycmF5XzEgPSByZXF1aXJlKFwiLi9hcnJheVwiKTtcbnZhciBpc0VtcHR5XzEgPSByZXF1aXJlKFwiLi9pc0VtcHR5XCIpO1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbnZhciBiaWdfZGF0YV8xID0gcmVxdWlyZShcIi4vYmlnLWRhdGFcIik7XG52YXIgaXNVbk5vcm1hbE9iamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICgodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHZhbHVlLl9vd25lcikgfHwgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB2b2lkIDAgPyB2b2lkIDAgOiB2YWx1ZS4kJHR5cGVvZikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICgodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHZhbHVlLl9pc0FNb21lbnRPYmplY3QpIHx8ICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmFsdWUuX2lzSlNPTlNjaGVtYU9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICgodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHZhbHVlLnRvSlMpIHx8ICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmFsdWUudG9KU09OKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59O1xudmFyIGlzUGxhaW5WYWx1ZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICBpZiAoaXNVbk5vcm1hbE9iamVjdCh2YWwpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGJpZ19kYXRhXzEuQmlnRGF0YS5pc0JpZ0RhdGEodmFsKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0eXBlc18xLmlzUGxhaW5PYmoodmFsKSB8fCB0eXBlc18xLmlzQXJyKHZhbCk7XG59O1xuZXhwb3J0cy5kZWZhdWx0cyA9IGZ1bmN0aW9uIChkZWZhdWx0c18sIHRhcmdldHMpIHtcbiAgICBpZiAodHlwZXNfMS5nZXRUeXBlKGRlZmF1bHRzXykgIT09IHR5cGVzXzEuZ2V0VHlwZSh0YXJnZXRzKSB8fFxuICAgICAgICAhaXNQbGFpblZhbHVlKGRlZmF1bHRzXykgfHxcbiAgICAgICAgIWlzUGxhaW5WYWx1ZSh0YXJnZXRzKSkge1xuICAgICAgICByZXR1cm4gaXNFbXB0eV8xLmlzVmFsaWQodGFyZ2V0cykgPyB0YXJnZXRzIDogZGVmYXVsdHNfO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdHNfMSA9IHR5cGVzXzEuaXNQbGFpbk9iaihkZWZhdWx0c18pID8ge30gOiBbXTtcbiAgICAgICAgYXJyYXlfMS5lYWNoKHRhcmdldHMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICByZXN1bHRzXzFba2V5XSA9IGV4cG9ydHMuZGVmYXVsdHMoZGVmYXVsdHNfW2tleV0sIHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFycmF5XzEuZWFjaChkZWZhdWx0c18sIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBpZiAoIWlzRW1wdHlfMS5pc1ZhbGlkKHJlc3VsdHNfMVtrZXldKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNfMVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0c18xO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBUWVBFX1NUUklORztcbihmdW5jdGlvbiAoVFlQRV9TVFJJTkcpIHtcbiAgICBUWVBFX1NUUklOR1tcIlVOREVGSU5FRFwiXSA9IFwidW5kZWZpbmVkXCI7XG59KShUWVBFX1NUUklORyB8fCAoVFlQRV9TVFJJTkcgPSB7fSkpO1xudmFyIENPTlNPTEVfTUVUSE9EUztcbihmdW5jdGlvbiAoQ09OU09MRV9NRVRIT0RTKSB7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiREVCVUdcIl0gPSBcImRlYnVnXCI7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiRVJST1JcIl0gPSBcImVycm9yXCI7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiSU5GT1wiXSA9IFwiaW5mb1wiO1xuICAgIENPTlNPTEVfTUVUSE9EU1tcIkxPR1wiXSA9IFwibG9nXCI7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiV0FSTlwiXSA9IFwid2FyblwiO1xuICAgIENPTlNPTEVfTUVUSE9EU1tcIkRJUlwiXSA9IFwiZGlyXCI7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiRElSWE1MXCJdID0gXCJkaXJ4bWxcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJUQUJMRVwiXSA9IFwidGFibGVcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJUUkFDRVwiXSA9IFwidHJhY2VcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJHUk9VUFwiXSA9IFwiZ3JvdXBcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJHUk9VUENPTExBUFNFRFwiXSA9IFwiZ3JvdXBDb2xsYXBzZWRcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJHUk9VUEVORFwiXSA9IFwiZ3JvdXBFbmRcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJDTEVBUlwiXSA9IFwiY2xlYXJcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJDT1VOVFwiXSA9IFwiY291bnRcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJDT1VOVFJFU0VUXCJdID0gXCJjb3VudFJlc2V0XCI7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiQVNTRVJUXCJdID0gXCJhc3NlcnRcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJQUk9GSUxFXCJdID0gXCJwcm9maWxlXCI7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiUFJPRklMRUVORFwiXSA9IFwicHJvZmlsZUVuZFwiO1xuICAgIENPTlNPTEVfTUVUSE9EU1tcIlRJTUVcIl0gPSBcInRpbWVcIjtcbiAgICBDT05TT0xFX01FVEhPRFNbXCJUSU1FTE9HXCJdID0gXCJ0aW1lTG9nXCI7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiVElNRUVORFwiXSA9IFwidGltZUVuZFwiO1xuICAgIENPTlNPTEVfTUVUSE9EU1tcIlRJTUVTVEFNUFwiXSA9IFwidGltZVN0YW1wXCI7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiQ09OVEVYVFwiXSA9IFwiY29udGV4dFwiO1xuICAgIENPTlNPTEVfTUVUSE9EU1tcIk1FTU9SWVwiXSA9IFwibWVtb3J5XCI7XG4gICAgQ09OU09MRV9NRVRIT0RTW1wiVElQU1wiXSA9IFwidGlwc1wiO1xufSkoQ09OU09MRV9NRVRIT0RTIHx8IChDT05TT0xFX01FVEhPRFMgPSB7fSkpO1xudmFyIExvZyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTG9nKGtleXdvcmQsIG1ldGhvZHMpIHtcbiAgICAgICAgdGhpcy5rZXl3b3JkID0gJ0FQUCc7XG4gICAgICAgIHRoaXMuZGVmYXVsdE1ldGhvZHMgPSBbXG4gICAgICAgICAgICBDT05TT0xFX01FVEhPRFMuTE9HLFxuICAgICAgICAgICAgQ09OU09MRV9NRVRIT0RTLkVSUk9SLFxuICAgICAgICAgICAgQ09OU09MRV9NRVRIT0RTLldBUk5cbiAgICAgICAgXTtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubWV0aG9kcyA9IFtdO1xuICAgICAgICB0aGlzLmtleXdvcmQgPSBrZXl3b3JkO1xuICAgICAgICB0aGlzLm1ldGhvZHMgPSBtZXRob2RzO1xuICAgICAgICB0aGlzLmluaXRDb25zb2xlKCk7XG4gICAgfVxuICAgIExvZy5wcm90b3R5cGUuaW5pdENvbnNvbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBoYXNDb25zb2xlID0gdHlwZW9mIGNvbnNvbGUgPT09IFRZUEVfU1RSSU5HLlVOREVGSU5FRDtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGhhc0NvbnNvbGU7XG4gICAgICAgIHRoaXMubWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuZGVmYXVsdE1ldGhvZHMuaW5kZXhPZihuYW1lKSA+IC0xKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIF90aGlzW25hbWVdID0gX3RoaXMud3JhcChuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBMb2cucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLmNhbGxDb25zb2xlKG5hbWUsIGNvbnRlbnQpO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgTG9nLnByb3RvdHlwZS5nZXRLZXlXb3JkU3R5bGUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gXCJbIFwiICsgdGhpcy5rZXl3b3JkICsgXCIgXCIgKyBuYW1lICsgXCIgXTogXCI7XG4gICAgfTtcbiAgICBMb2cucHJvdG90eXBlLmNhbGxDb25zb2xlID0gZnVuY3Rpb24gKG5hbWUsIGNvbnRlbnQsIHRpcHMpIHtcbiAgICAgICAgdmFyIGxvZ0RhdGEgPSB7IGNvbnRlbnQ6IGNvbnRlbnQsIGtleXdvcmQ6IHRoaXMua2V5d29yZCB9O1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgbG9nRGF0YS5jb250ZW50ID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKHRpcHMpIHtcbiAgICAgICAgICAgICAgICBsb2dEYXRhLnRpcHMgPSB2b2lkIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbG9nRGF0YTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgQ29uc29sZSA9IGNvbnNvbGU7XG4gICAgICAgIHZhciBrZXl3b3JkID0gdGhpcy5nZXRLZXlXb3JkU3R5bGUobmFtZSk7XG4gICAgICAgIENvbnNvbGVbbmFtZV0gJiYgQ29uc29sZVtuYW1lXShrZXl3b3JkLCBjb250ZW50KTtcbiAgICAgICAgaWYgKHRpcHMpIHtcbiAgICAgICAgICAgIGxvZ0RhdGEudGlwcyA9IHRpcHM7XG4gICAgICAgICAgICBDb25zb2xlLmluZm8odGhpcy5nZXRLZXlXb3JkU3R5bGUoQ09OU09MRV9NRVRIT0RTLlRJUFMpLCB0aXBzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9nRGF0YTtcbiAgICB9O1xuICAgIExvZy5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbENvbnNvbGUoQ09OU09MRV9NRVRIT0RTLkxPRywgY29udGVudCk7XG4gICAgfTtcbiAgICBMb2cucHJvdG90eXBlLndhcm4gPSBmdW5jdGlvbiAoY29udGVudCwgdGlwcykge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsQ29uc29sZShDT05TT0xFX01FVEhPRFMuV0FSTiwgY29udGVudCwgdGlwcyk7XG4gICAgfTtcbiAgICBMb2cucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGNvbnRlbnQsIHRpcHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbENvbnNvbGUoQ09OU09MRV9NRVRIT0RTLkVSUk9SLCBjb250ZW50LCB0aXBzKTtcbiAgICB9O1xuICAgIExvZy5wcm90b3R5cGUuaW5mbyA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGxDb25zb2xlKENPTlNPTEVfTUVUSE9EUy5JTkZPLCBjb250ZW50KTtcbiAgICB9O1xuICAgIExvZy5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xuICAgIH07XG4gICAgTG9nLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluaXRDb25zb2xlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gTG9nO1xufSgpKTtcbmV4cG9ydHMubG9nID0gbmV3IExvZygnRm9ybWlseScsIFtdKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIElEWCA9IDM2LCBIRVggPSAnJztcbndoaWxlIChJRFgtLSlcbiAgICBIRVggKz0gSURYLnRvU3RyaW5nKDM2KTtcbmZ1bmN0aW9uIHVpZChsZW4pIHtcbiAgICB2YXIgc3RyID0gJycsIG51bSA9IGxlbiB8fCAxMTtcbiAgICB3aGlsZSAobnVtLS0pXG4gICAgICAgIHN0ciArPSBIRVhbKE1hdGgucmFuZG9tKCkgKiAzNikgfCAwXTtcbiAgICByZXR1cm4gc3RyO1xufVxuZXhwb3J0cy51aWQgPSB1aWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbmZ1bmN0aW9uIF9fZXhwb3J0KG0pIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XG59XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9hcnJheVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9jb21wYXJlXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3R5cGVzXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2Nsb25lXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL2lzRW1wdHlcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vY2FzZVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9zdHJpbmdcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vZ2xvYmFsXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3BhdGhcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vZGVwcmVjYXRlXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3N1YnNjcmliYWJsZVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9tZXJnZVwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9pbnN0YW5jZW9mXCIpKTtcbl9fZXhwb3J0KHJlcXVpcmUoXCIuL3NjaGVkdWxlclwiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9kZWZhdWx0c1wiKSk7XG5fX2V4cG9ydChyZXF1aXJlKFwiLi9sb2dcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vYmlnLWRhdGFcIikpO1xuX19leHBvcnQocmVxdWlyZShcIi4vdWlkXCIpKTtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgZW46IHtcbiAgICBwYXR0ZXJuOiAnVGhpcyBmaWVsZCAgZG9lcyBub3QgbWF0Y2ggYW55IHBhdHRlcm4nLFxuICAgIHJlcXVpcmVkOiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCcsXG4gICAgbnVtYmVyOiAnVGhpcyBmaWVsZCBpcyBub3QgYSBudW1iZXInLFxuICAgIGludGVnZXI6ICdUaGlzIGZpZWxkIGlzIG5vdCBhbiBpbnRlZ2VyIG51bWJlcicsXG4gICAgdXJsOiAnVGhpcyBmaWVsZCBpcyBhIGludmFsaWQgdXJsJyxcbiAgICBlbWFpbDogJ1RoaXMgZmllbGQgaXMgbm90IGEgZW1haWwgZm9ybWF0JyxcbiAgICBpcHY2OiAnVGhpcyBmaWVsZCBpcyBub3QgYSBpcHY2IGZvcm1hdCcsXG4gICAgaXB2NDogJ1RoaXMgZmllbGQgaXMgbm90IGEgaXB2NCBmb3JtYXQnLFxuICAgIGlkY2FyZDogJ1RoaXMgZmllbGQgaXMgbm90IGFuIGlkY2FyZCBmb3JtYXQnLFxuICAgIHRhb2RvbWFpbjogJ1RoaXMgZmllbGQgaXMgbm90IGEgdGFvYmFvIGRvbWFpbiBmb3JtYXQnLFxuICAgIHFxOiAnVGhpcyBmaWVsZCBpcyBub3QgYSBxcSBudW1iZXIgZm9ybWF0JyxcbiAgICBwaG9uZTogJ1RoaXMgZmllbGQgaXMgbm90IGEgcGhvbmUgbnVtYmVyIGZvcm1hdCcsXG4gICAgbW9uZXk6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIGN1cnJlbmN5IGZvcm1hdCcsXG4gICAgemg6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIGNoaW5lc2Ugc3RyaW5nJyxcbiAgICBkYXRlOiAnVGhpcyBmaWVsZCBpcyBub3QgYSB2YWxpZCBkYXRlIGZvcm1hdCcsXG4gICAgemlwOiAnVGhpcyBmaWVsZCBpcyBub3QgYSB6aXAgZm9ybWF0JyxcbiAgICBsZW46ICdUaGUgbGVuZ3RoIG9yIG51bWJlciBvZiBlbnRyaWVzIG11c3QgYmUge3tsZW59fScsXG4gICAgbWluOiAnVGhlIGxlbmd0aCBvciBudW1iZXIgb2YgZW50cmllcyBtdXN0IGJlIGF0IGxlYXN0IHt7bWlufX0nLFxuICAgIG1heGltdW06ICdUaGUgdmFsdWUgY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiB7e21heGltdW19fScsXG4gICAgZXhjbHVzaXZlTWF4aW11bTogJ1RoZSB2YWx1ZSBtdXN0IGJlIGxlc3MgdGhhbiB7e2V4Y2x1c2l2ZU1heGltdW19fScsXG4gICAgbWluaW11bTogJ1RoZSB2YWx1ZSBjYW5ub3QgYmUgbGVzcyB0aGFuIHt7bWluaW11bX19JyxcbiAgICBleGNsdXNpdmVNaW5pbXVtOiAnVGhlIHZhbHVlIG11c3QgYmUgZ3JlYXRlciB0aGFuIHt7ZXhjbHVzaXZlTWluaW11bX19JyxcbiAgICBtYXg6ICdUaGUgbGVuZ3RoIG9yIG51bWJlciBvZiBlbnRyaWVzIG11c3QgYmUgYXQgbW9zdCB7e21heH19JyxcbiAgICB3aGl0ZXNwYWNlOiAnVGhpcyBmaWVsZCBjYW5ub3QgYmUgYmxhbmsgc3RyaW5nLidcbiAgfSxcbiAgemg6IHtcbiAgICBwYXR0ZXJuOiAn6K+l5a2X5q615LiN5piv5LiA5Liq5ZCI5rOV55qE5a2X5q61JyxcbiAgICByZXF1aXJlZDogJ+ivpeWtl+auteaYr+W/heWhq+Wtl+autScsXG4gICAgbnVtYmVyOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE5pWw5a2XJyxcbiAgICBpbnRlZ2VyOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE5pW05Z6L5pWw5a2XJyxcbiAgICB1cmw6ICfor6XlrZfmrrXkuI3mmK/lkIjms5XnmoR1cmwnLFxuICAgIGVtYWlsOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE6YKu566x5qC85byPJyxcbiAgICBpcHY2OiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qEaXB2NuagvOW8jycsXG4gICAgaXB2NDogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahGlwdjTmoLzlvI8nLFxuICAgIGlkY2FyZDogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOi6q+S7veivgeagvOW8jycsXG4gICAgdGFvZG9tYWluOiAn6K+l5a2X5q615LiN56ym5ZCI5reY57O75Z+f5ZCN6KeE5YiZJyxcbiAgICBxcTogJ+ivpeWtl+auteS4jeespuWQiFFR5Y+35qC85byPJyxcbiAgICBwaG9uZTogJ+ivpeWtl+auteS4jeaYr+acieaViOeahOaJi+acuuWPtycsXG4gICAgbW9uZXk6ICfor6XlrZfmrrXkuI3mmK/mnInmlYjotKfluIHmoLzlvI8nLFxuICAgIHpoOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE5Lit5paH5a2X56ym5LiyJyxcbiAgICBkYXRlOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE5pel5pyf5qC85byPJyxcbiAgICB6aXA6ICfor6XlrZfmrrXkuI3mmK/lkIjms5XnmoTpgq7nvJbmoLzlvI8nLFxuICAgIGxlbjogJ+mVv+W6puaIluadoeebruaVsOW/hemhu+S4unt7bGVufX0nLFxuICAgIG1pbjogJ+mVv+W6puaIluadoeebruaVsOS4jeiDveWwj+S6jnt7bWlufX0nLFxuICAgIG1heDogJ+mVv+W6puaIluadoeebruaVsOS4jeiDveWkp+S6jnt7bWF4fX0nLFxuICAgIG1heGltdW06ICfmlbDlgLzkuI3og73lpKfkuo57e21heGltdW19fScsXG4gICAgZXhjbHVzaXZlTWF4aW11bTogJ+aVsOWAvOW/hemhu+Wwj+S6jnt7ZXhjbHVzaXZlTWF4aW11bX19JyxcbiAgICBtaW5pbXVtOiAn5pWw5YC85LiN6IO95bCP5LqOe3ttaW5pbXVtfX0nLFxuICAgIGV4Y2x1c2l2ZU1pbmltdW06ICfmlbDlgLzlv4XpobvlpKfkuo57e2V4Y2x1c2l2ZU1pbmltdW19fScsXG4gICAgd2hpdGVzcGFjZTogJ+S4jeiDveS4uue6r+epuueZveWtl+espuS4sidcbiAgfSxcbiAgJ2VuLVVTJzoge1xuICAgIHBhdHRlcm46ICdUaGlzIGZpZWxkICBkb2VzIG5vdCBtYXRjaCBhbnkgcGF0dGVybicsXG4gICAgcmVxdWlyZWQ6ICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkJyxcbiAgICBudW1iZXI6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIG51bWJlcicsXG4gICAgaW50ZWdlcjogJ1RoaXMgZmllbGQgaXMgbm90IGFuIGludGVnZXIgbnVtYmVyJyxcbiAgICB1cmw6ICdUaGlzIGZpZWxkIGlzIGEgaW52YWxpZCB1cmwnLFxuICAgIGVtYWlsOiAnVGhpcyBmaWVsZCBpcyBub3QgYSBlbWFpbCBmb3JtYXQnLFxuICAgIGlwdjY6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIGlwdjYgZm9ybWF0JyxcbiAgICBpcHY0OiAnVGhpcyBmaWVsZCBpcyBub3QgYSBpcHY0IGZvcm1hdCcsXG4gICAgaWRjYXJkOiAnVGhpcyBmaWVsZCBpcyBub3QgYW4gaWRjYXJkIGZvcm1hdCcsXG4gICAgdGFvZG9tYWluOiAnVGhpcyBmaWVsZCBpcyBub3QgYSB0YW9iYW8gZG9tYWluIGZvcm1hdCcsXG4gICAgcXE6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIHFxIG51bWJlciBmb3JtYXQnLFxuICAgIHBob25lOiAnVGhpcyBmaWVsZCBpcyBub3QgYSBwaG9uZSBudW1iZXIgZm9ybWF0JyxcbiAgICBtb25leTogJ1RoaXMgZmllbGQgaXMgbm90IGEgY3VycmVuY3kgZm9ybWF0JyxcbiAgICB6aDogJ1RoaXMgZmllbGQgaXMgbm90IGEgY2hpbmVzZSBzdHJpbmcnLFxuICAgIGRhdGU6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIHZhbGlkIGRhdGUgZm9ybWF0JyxcbiAgICB6aXA6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIHppcCBmb3JtYXQnLFxuICAgIGxlbjogJ1RoZSBsZW5ndGggb3IgbnVtYmVyIG9mIGVudHJpZXMgbXVzdCBiZSB7e2xlbn19JyxcbiAgICBtaW46ICdUaGUgbGVuZ3RoIG9yIG51bWJlciBvZiBlbnRyaWVzIG11c3QgYmUgYXQgbGVhc3Qge3ttaW59fScsXG4gICAgbWF4aW11bTogJ1RoZSB2YWx1ZSBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIHt7bWF4aW11bX19JyxcbiAgICBleGNsdXNpdmVNYXhpbXVtOiAnVGhlIHZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIHt7ZXhjbHVzaXZlTWF4aW11bX19JyxcbiAgICBtaW5pbXVtOiAnVGhlIHZhbHVlIGNhbm5vdCBiZSBsZXNzIHRoYW4ge3ttaW5pbXVtfX0nLFxuICAgIGV4Y2x1c2l2ZU1pbmltdW06ICdUaGUgdmFsdWUgbXVzdCBiZSBncmVhdGVyIHRoYW4ge3tleGNsdXNpdmVNaW5pbXVtfX0nLFxuICAgIG1heDogJ1RoZSBsZW5ndGggb3IgbnVtYmVyIG9mIGVudHJpZXMgbXVzdCBiZSBhdCBtb3N0IHt7bWF4fX0nLFxuICAgIHdoaXRlc3BhY2U6ICdUaGlzIGZpZWxkIGNhbm5vdCBiZSBibGFuayBzdHJpbmcuJ1xuICB9LFxuICAnemgtQ04nOiB7XG4gICAgcGF0dGVybjogJ+ivpeWtl+auteS4jeaYr+S4gOS4quWQiOazleeahOWtl+autScsXG4gICAgcmVxdWlyZWQ6ICfor6XlrZfmrrXmmK/lv4XloavlrZfmrrUnLFxuICAgIG51bWJlcjogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOaVsOWtlycsXG4gICAgaW50ZWdlcjogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOaVtOWei+aVsOWtlycsXG4gICAgdXJsOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qEdXJsJyxcbiAgICBlbWFpbDogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOmCrueuseagvOW8jycsXG4gICAgaXB2NjogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahGlwdjbmoLzlvI8nLFxuICAgIGlwdjQ6ICfor6XlrZfmrrXkuI3mmK/lkIjms5XnmoRpcHY05qC85byPJyxcbiAgICBpZGNhcmQ6ICfor6XlrZfmrrXkuI3mmK/lkIjms5XnmoTouqvku73or4HmoLzlvI8nLFxuICAgIHRhb2RvbWFpbjogJ+ivpeWtl+auteS4jeespuWQiOa3mOezu+Wfn+WQjeinhOWImScsXG4gICAgcXE6ICfor6XlrZfmrrXkuI3nrKblkIhRUeWPt+agvOW8jycsXG4gICAgcGhvbmU6ICfor6XlrZfmrrXkuI3mmK/mnInmlYjnmoTmiYvmnLrlj7cnLFxuICAgIG1vbmV5OiAn6K+l5a2X5q615LiN5piv5pyJ5pWI6LSn5biB5qC85byPJyxcbiAgICB6aDogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOS4reaWh+Wtl+espuS4sicsXG4gICAgZGF0ZTogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOaXpeacn+agvOW8jycsXG4gICAgemlwOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE6YKu57yW5qC85byPJyxcbiAgICBsZW46ICfplb/luqbmiJbmnaHnm67mlbDlv4XpobvkuLp7e2xlbn19JyxcbiAgICBtaW46ICfplb/luqbmiJbmnaHnm67mlbDkuI3og73lsI/kuo57e21pbn19JyxcbiAgICBtYXg6ICfplb/luqbmiJbmnaHnm67mlbDkuI3og73lpKfkuo57e21heH19JyxcbiAgICBtYXhpbXVtOiAn5pWw5YC85LiN6IO95aSn5LqOe3ttYXhpbXVtfX0nLFxuICAgIGV4Y2x1c2l2ZU1heGltdW06ICfmlbDlgLzlv4XpobvlsI/kuo57e2V4Y2x1c2l2ZU1heGltdW19fScsXG4gICAgbWluaW11bTogJ+aVsOWAvOS4jeiDveWwj+S6jnt7bWluaW11bX19JyxcbiAgICBleGNsdXNpdmVNaW5pbXVtOiAn5pWw5YC85b+F6aG75aSn5LqOe3tleGNsdXNpdmVNaW5pbXVtfX0nLFxuICAgIHdoaXRlc3BhY2U6ICfkuI3og73kuLrnuq/nqbrnmb3lrZfnrKbkuLInXG4gIH0sXG4gICd6aC1UVyc6IHtcbiAgICBwYXR0ZXJuOiAn6Kmy5a2X5q615LiN5piv5LiA5YCL5ZCI5rOV55qE5a2X5q61JyxcbiAgICByZXF1aXJlZDogJ+ipsuWtl+auteaYr+W/heWhq+Wtl+autScsXG4gICAgbnVtYmVyOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE5pW45a2XJyxcbiAgICBpbnRlZ2VyOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE5pW05Z6L5pW45a2XJyxcbiAgICB1cmw6ICfoqbLlrZfmrrXkuI3mmK/lkIjms5XnmoR1cmwnLFxuICAgIGVtYWlsOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE6YO1566x5qC85byPJyxcbiAgICBpcHY2OiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qEaXB2NuagvOW8jycsXG4gICAgaXB2NDogJ+ipsuWtl+auteS4jeaYr+WQiOazleeahGlwdjTmoLzlvI8nLFxuICAgIGlkY2FyZDogJ+ipsuWtl+auteS4jeaYr+WQiOazleeahOi6q+S7veitieagvOW8jycsXG4gICAgdGFvZG9tYWluOiAn6Kmy5a2X5q615LiN56ym5ZCI5reY57O75Z+f5ZCN6KaP5YmHJyxcbiAgICBxcTogJ+ipsuWtl+auteS4jeespuWQiFFR6Jmf5qC85byPJyxcbiAgICBwaG9uZTogJ+ipsuWtl+auteS4jeaYr+acieaViOeahOaJi+apn+iZnycsXG4gICAgbW9uZXk6ICfoqbLlrZfmrrXkuI3mmK/mnInmlYjosqjluaPmoLzlvI8nLFxuICAgIHpoOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE5Lit5paH5a2X56ym5LiyJyxcbiAgICBkYXRlOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE5pel5pyf5qC85byPJyxcbiAgICB6aXA6ICfoqbLlrZfmrrXkuI3mmK/lkIjms5XnmoTpg7Xnt6jmoLzlvI8nLFxuICAgIGxlbjogJ+mVt+W6puaIluaineebruaVuOW/hemgiOeCunt7bGVufX0nLFxuICAgIG1pbjogJ+mVt+W6puaIluaineebruaVuOS4jeiDveWwj+aWvHt7bWlufX0nLFxuICAgIG1heDogJ+mVt+W6puaIluaineebruaVuOS4jeiDveWkp+aWvHt7bWF4fX0nLFxuICAgIG1heGltdW06ICfmlbjlgLzkuI3og73lpKfmlrx7e21heGltdW19fScsXG4gICAgZXhjbHVzaXZlTWF4aW11bTogJ+aVuOWAvOW/hemgiOWwj+aWvHt7ZXhjbHVzaXZlTWF4aW11bX19JyxcbiAgICBtaW5pbXVtOiAn5pW45YC85LiN6IO95bCP5pa8e3ttaW5pbXVtfX0nLFxuICAgIGV4Y2x1c2l2ZU1pbmltdW06ICfmlbjlgLzlv4XpoIjlpKfmlrx7e2V4Y2x1c2l2ZU1pbmltdW19fScsXG4gICAgd2hpdGVzcGFjZTogJ+S4jeiDveeCuue0lOepuueZveWtl+espuS4sidcbiAgfSxcbiAgamE6IHtcbiAgICB1cmw6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/nhKHlirnjgapVUkzjgafjgZknLFxuICAgIHdoaXRlc3BhY2U6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njgpLnqbrjga7mloflrZfliJfjgavjgZnjgovjgZPjgajjga/jgafjgY3jgb7jgZvjgpPjgIInLFxuICAgIHpoOiAn44GT44Gu44OV44Kj44O844Or44OJ44Gv5Lit5Zu96Kqe44Gu5paH5a2X5YiX44Gn44Gv44GC44KK44G+44Gb44KTJyxcbiAgICB6aXA6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga96aXDlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIGRhdGU6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/mnInlirnjgarml6Xku5jlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIGVtYWlsOiAn44GT44Gu44OV44Kj44O844Or44OJ44Gv44Oh44O844Or5b2i5byP44Gn44Gv44GC44KK44G+44Gb44KTJyxcbiAgICBleGNsdXNpdmVNYXhpbXVtOiAn5YCk44Gve3tleGNsdXNpdmVNYXhpbXVtfX3mnKrmuoDjgafjgYLjgovlv4XopoHjgYzjgYLjgorjgb7jgZknLFxuICAgIGV4Y2x1c2l2ZU1pbmltdW06ICflgKTjga97e2V4Y2x1c2l2ZU1pbmltdW19feOCiOOCiuWkp+OBjeOBhOW/heimgeOBjOOBguOCiuOBvuOBmScsXG4gICAgaWRjYXJkOiAn44GT44Gu44OV44Kj44O844Or44OJ44GvSUTjgqvjg7zjg4nlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIGludGVnZXI6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/mlbTmlbDjgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIGlwdjQ6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga9JUHY05b2i5byP44Gn44Gv44GC44KK44G+44Gb44KTJyxcbiAgICBpcHY2OiAn44GT44Gu44OV44Kj44O844Or44OJ44GvSVB2NuW9ouW8j+OBp+OBr+OBguOCiuOBvuOBm+OCkycsXG4gICAgbGVuOiAn44Ko44Oz44OI44Oq44Gu6ZW344GV44G+44Gf44Gv5pWw44Gve3tsZW59feOBp+OBquOBkeOCjOOBsOOBquOCiuOBvuOBm+OCkycsXG4gICAgbWF4OiAn44Ko44Oz44OI44Oq44Gu6ZW344GV44G+44Gf44Gv5pWw44Gv5pyA5aSne3ttYXh9feOBp+OBquOBkeOCjOOBsOOBquOCiuOBvuOBm+OCkycsXG4gICAgbWF4aW11bTogJ+WApOOBr3t75pyA5aSnfX3jgpLotoXjgYjjgovjgZPjgajjga/jgafjgY3jgb7jgZvjgpMnLFxuICAgIG1pbjogJ+OCqOODs+ODiOODquOBrumVt+OBleOBvuOBn+OBr+aVsOOBr+OAgeWwkeOBquOBj+OBqOOCgnt7bWlufX3jgafjgYLjgovlv4XopoHjgYzjgYLjgorjgb7jgZknLFxuICAgIG1pbmltdW06ICflgKTjga97e21pbmltdW19feS7peS4iuOBq+OBmeOCi+W/heimgeOBjOOBguOCiuOBvuOBmScsXG4gICAgbW9uZXk6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/pgJrosqjlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIG51bWJlcjogJ+OBk+OBruODleOCo+ODvOODq+ODieOBr+aVsOWApOOBp+OBr+OBguOCiuOBvuOBm+OCkycsXG4gICAgcGF0dGVybjogJ+OBk+OBruODleOCo+ODvOODq+ODieOBr+OBqeOBruODkeOCv+ODvOODs+OBqOOCguS4gOiHtOOBl+OBvuOBm+OCkycsXG4gICAgcGhvbmU6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/pm7voqbHnlarlj7fjga7lvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIHFxOiAn44GT44Gu44OV44Kj44O844Or44OJ44GvcXHmlbDlgKTlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIHJlcXVpcmVkOiAn44GT44Gu6aCF55uu44Gv5b+F6aCI44Gn44GZJyxcbiAgICB0YW9kb21haW46ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/mt5jlrp3ntrLjg4njg6HjgqTjg7PlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnXG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIEZvcm1QYXRoLFxuICBlYWNoLFxuICBnbG9iYWxUaGlzUG9seWZpbGwsXG4gIG1lcmdlIGFzIGRlZXBtZXJnZSxcbiAgbG9nXG59IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCBsb2NhbGVzIGZyb20gJy4vbG9jYWxlJ1xuXG5jb25zdCBnZXRJbiA9IEZvcm1QYXRoLmdldEluXG5cbmNvbnN0IHNlbGY6IGFueSA9IGdsb2JhbFRoaXNQb2x5ZmlsbFxuXG5leHBvcnQgaW50ZXJmYWNlIElMb2NhbGVNZXNzYWdlcyB7XG4gIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IElMb2NhbGVNZXNzYWdlc1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMb2NhbGVzIHtcbiAgW2xhbmc6IHN0cmluZ106IElMb2NhbGVNZXNzYWdlc1xufVxuXG5jb25zdCBnZXRCcm93c2VybGFuZ3VhZ2UgPSAoKSA9PiB7XG4gIGlmICghc2VsZi5uYXZpZ2F0b3IpIHtcbiAgICByZXR1cm4gJ2VuJ1xuICB9XG4gIHJldHVybiBzZWxmLm5hdmlnYXRvci5icm93c2VybGFuZ3VhZ2UgfHwgc2VsZi5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJ1xufVxuXG5jb25zdCBMT0NBTEUgPSB7XG4gIG1lc3NhZ2VzOiB7fSxcbiAgbGFuZzogZ2V0QnJvd3Nlcmxhbmd1YWdlKClcbn1cblxuY29uc3QgZ2V0TWF0Y2hMYW5nID0gKGxhbmc6IHN0cmluZykgPT4ge1xuICBsZXQgZmluZCA9IExPQ0FMRS5sYW5nXG4gIGVhY2goTE9DQUxFLm1lc3NhZ2VzLCAobWVzc2FnZXM6IElMb2NhbGVNZXNzYWdlcywga2V5OiBzdHJpbmcpID0+IHtcbiAgICBpZiAoa2V5LmluZGV4T2YobGFuZykgPiAtMSB8fCBTdHJpbmcobGFuZykuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgIGZpbmQgPSBrZXlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGZpbmRcbn1cblxuZXhwb3J0IGNvbnN0IHNldFZhbGlkYXRpb25Mb2NhbGUgPSAobG9jYWxlOiBJTG9jYWxlcykgPT4ge1xuICBMT0NBTEUubWVzc2FnZXMgPSBkZWVwbWVyZ2UoTE9DQUxFLm1lc3NhZ2VzLCBsb2NhbGUpXG59XG5cbmV4cG9ydCBjb25zdCBzZXRMb2NhbGUgPSBzZXRWYWxpZGF0aW9uTG9jYWxlXG5cbmV4cG9ydCBjb25zdCBzZXRWYWxpZGF0aW9uTGFuZ3VhZ2UgPSAobGFuZzogc3RyaW5nKSA9PiB7XG4gIExPQ0FMRS5sYW5nID0gbGFuZ1xufVxuXG5leHBvcnQgY29uc3Qgc2V0TGFuZ3VhZ2UgPSBzZXRWYWxpZGF0aW9uTGFuZ3VhZ2VcblxuZXhwb3J0IGNvbnN0IGdldE1lc3NhZ2UgPSAocGF0aDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBnZXRJbihMT0NBTEUubWVzc2FnZXMsIGAke2dldE1hdGNoTGFuZyhMT0NBTEUubGFuZyl9LiR7cGF0aH1gKVxuICBpZiAoIW1lc3NhZ2UpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICBgZmllbGQgaXMgbm90IHZhbGlkLGJ1dCBub3QgZm91bmQgJHtwYXRofSBlcnJvciBtZXNzYWdlLiBQbGVhc2Ugc2V0IHRoZSBsYW5ndWFnZSBwYWNrIGZpcnN0IHRocm91Z2ggc2V0VmFsaWRhdGlvbkxvY2FsZWBcbiAgICApXG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2UgfHwgJ0ZpZWxkIGlzIGludmFsaWQnXG59XG5cbnNldFZhbGlkYXRpb25Mb2NhbGUobG9jYWxlcylcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgdXJsOiBuZXcgUmVnRXhwKFxuICAgIC8vIHByb3RvY29sIGlkZW50aWZpZXJcbiAgICAnXig/Oig/Oig/Omh0dHBzP3xmdHB8cnRtcCk6KT8vLyknICtcbiAgICAgIC8vIHVzZXI6cGFzcyBhdXRoZW50aWNhdGlvblxuICAgICAgJyg/OlxcXFxTKyg/OjpcXFxcUyopP0ApPycgK1xuICAgICAgJyg/OicgK1xuICAgICAgLy8gSVAgYWRkcmVzcyBleGNsdXNpb24gLSBwcml2YXRlICYgbG9jYWwgbmV0d29ya3NcbiAgICAgIC8vIFJlZmVyZW5jZTogaHR0cHM6Ly93d3cuYXJpbi5uZXQva25vd2xlZGdlL2FkZHJlc3NfZmlsdGVycy5odG1sXG5cbiAgICAgIC8vIGZpbHRlciAxMC4qLiouKiBhbmQgMTI3LiouKi4qIGFkcmVzc2VzXG4gICAgICAnKD8hKD86MTB8MTI3KSg/OlxcXFwuXFxcXGR7MSwzfSl7M30pJyArXG4gICAgICAvLyBmaWx0ZXIgMTY5LjI1NC4qLiogYW5kIDE5Mi4xNjguKi4qXG4gICAgICAnKD8hKD86MTY5XFxcXC4yNTR8MTkyXFxcXC4xNjgpKD86XFxcXC5cXFxcZHsxLDN9KXsyfSknICtcbiAgICAgIC8vIGZpbHRlciAxNzIuMTYuMC4wIC0gMTcyLjMxLjI1NS4yNTVcbiAgICAgIC8vIFRPRE86IGFkZCB0ZXN0IHRvIHZhbGlkYXRlIHRoYXQgaXQgaW52YWxpZGVzIGFkZHJlc3MgaW4gMTYtMzEgcmFuZ2VcbiAgICAgICcoPyExNzJcXFxcLig/OjFbNi05XXwyXFxcXGR8M1swLTFdKSg/OlxcXFwuXFxcXGR7MSwzfSl7Mn0pJyArXG4gICAgICAvLyBJUCBhZGRyZXNzIGRvdHRlZCBub3RhdGlvbiBvY3RldHNcbiAgICAgIC8vIGV4Y2x1ZGVzIGxvb3BiYWNrIG5ldHdvcmsgMC4wLjAuMFxuICAgICAgLy8gZXhjbHVkZXMgcmVzZXJ2ZWQgc3BhY2UgPj0gMjI0LjAuMC4wXG4gICAgICAvLyBleGNsdWRlcyBuZXR3b3JrICYgYnJvYWNhc3QgYWRkcmVzc2VzXG4gICAgICAvLyAoZmlyc3QgJiBsYXN0IElQIGFkZHJlc3Mgb2YgZWFjaCBjbGFzcylcblxuICAgICAgLy8gZmlsdGVyIDEuIHBhcnQgZm9yIDEtMjIzXG4gICAgICAnKD86MjJbMC0zXXwyWzAxXVxcXFxkfFsxLTldXFxcXGQ/fDFcXFxcZFxcXFxkKScgK1xuICAgICAgLy8gZmlsdGVyIDIuIGFuZCAzLiBwYXJ0IGZvciAwLTI1NVxuICAgICAgJyg/OlxcXFwuKD86MjVbMC01XXwyWzAtNF1cXFxcZHwxP1xcXFxkezEsMn0pKXsyfScgK1xuICAgICAgLy8gZmlsdGVyIDQuIHBhcnQgZm9yIDEtMjU0XG4gICAgICAnKD86XFxcXC4oPzoyNVswLTRdfDJbMC00XVxcXFxkfDFcXFxcZFxcXFxkfFsxLTldXFxcXGQ/KSknICtcbiAgICAgICd8JyArXG4gICAgICAvLyBob3N0IG5hbWVcbiAgICAgICcoPzooPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0tKikqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKyknICtcbiAgICAgIC8vIGRvbWFpbiBuYW1lXG4gICAgICAnKD86XFxcXC4oPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0tKikqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKykqJyArXG4gICAgICAvLyBUTEQgaWRlbnRpZmllclxuICAgICAgJyg/OlxcXFwuKD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmZdezIsfSkpJyArXG4gICAgICAnKScgK1xuICAgICAgLy8gcG9ydCBudW1iZXJcbiAgICAgICcoPzo6XFxcXGR7Miw1fSk/JyArXG4gICAgICAvLyByZXNvdXJjZSBwYXRoXG4gICAgICAnKD86L1xcXFxTKik/JCdcbiAgKSxcbiAgZW1haWw6IC9eXFx3KyhbLSsuXVxcdyspKkBcXHcrKFstLl1cXHcrKSpcXC5cXHcrKFstLl1cXHcrKSokLyxcblxuICBpcHY2OiAvXlxccyooKChbMC05QS1GYS1mXXsxLDR9Oil7N30oWzAtOUEtRmEtZl17MSw0fXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7Nn0oOlswLTlBLUZhLWZdezEsNH18KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXs1fSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDJ9KXw6KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXs0fSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDN9KXwoKDpbMC05QS1GYS1mXXsxLDR9KT86KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7M30oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw0fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCwyfTooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXsyfSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDV9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDN9OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezF9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsNn0pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsNH06KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSl8KDooKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw3fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCw1fTooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKSkoJS4rKT9cXHMqJC8sXG5cbiAgaXB2NDogL14oKDI1WzAtNV18MlswLTRdWzAtOV18MVswLTldezJ9fFswLTldezEsMn0pXFwuKXszfSgyNVswLTVdfDJbMC00XVswLTldfDFbMC05XXsyfXxbMC05XXsxLDJ9KSQvLFxuXG4gIG51bWJlcjogL15bKy1dP1xcZCsoXFwuXFxkKyk/JC8sXG5cbiAgaW50ZWdlcjogL15bKy1dP1xcZCskLyxcblxuICBxcTogL14oXFwrP1sxLTldXFxkKnwwKSQvLFxuXG4gIHBob25lOiAvXlxcZHszfS1cXGR7OH0kfF5cXGR7NH0tXFxkezd9JHxeXFxkezExfSQvLFxuXG4gIGlkY2FyZDogL15cXGR7MTV9JHxeXFxkezE3fShcXGR8eHxYKSQvLFxuXG4gIHRhb2RvbWFpbjogL14oaHR0cHM/XFw6KT8oXFwvXFwvKT8oW2EtekEtWjAtOVxcLlxcLV0rXFwuKT8odGFvYmFvfHRtYWxsfGFsaXRyaXB8eWFvXFwuOTUwOTUpKFxcLmRhaWx5KT9cXC4oY29tfG5ldHxoayhcXC9oayk/KS8sXG5cbiAgbW9uZXk6IC9eKFtcXHUwMDI0XFx1MDBBMlxcdTAwQTNcXHUwMEE0XFx1MjBBQ1xcdTAwQTVcXHUyMEIxXFwyMEI5XFx1RkZFNV1cXHMqKShcXGQrLD8pK1xcLj9cXGQqXFxzKiQvLFxuXG4gIHpoOiAvXltcXHU0ZTAwLVxcdTlmYTVdKyQvLFxuXG4gIGRhdGU6IC9eKD86KD86MVs2LTldfFsyLTldWzAtOV0pWzAtOV17Mn0oWy0vLl0/KSg/Oig/OjA/WzEtOV18MVswLTJdKVxcMSg/OjA/WzEtOV18MVswLTldfDJbMC04XSl8KD86MD9bMTMtOV18MVswLTJdKVxcMSg/OjI5fDMwKXwoPzowP1sxMzU3OF18MVswMl0pXFwxKD86MzEpKXwoPzooPzoxWzYtOV18WzItOV1bMC05XSkoPzowWzQ4XXxbMjQ2OF1bMDQ4XXxbMTM1NzldWzI2XSl8KD86MTZ8WzI0NjhdWzA0OF18WzM1NzldWzI2XSkwMCkoWy0vLl0/KTA/MlxcMig/OjI5KSkoXFxzKyhbMDFdWzAtOV06fDJbMC0zXTopP1swLTVdWzAtOV06WzAtNV1bMC05XSk/JC8sXG5cbiAgemlwOiAvXlswLTldezZ9JC9cbn1cbiIsImltcG9ydCB7IGdldE1lc3NhZ2UgfSBmcm9tICcuL21lc3NhZ2UnXG5pbXBvcnQge1xuICBpc0VtcHR5LFxuICBpc1ZhbGlkLFxuICBzdHJpbmdMZW5ndGgsXG4gIGlzU3RyLFxuICBpc0FycixcbiAgaXNGbixcbiAgdG9BcnIsXG4gIGlzQm9vbFxufSBmcm9tICdAZm9ybWlseS9zaGFyZWQnXG5pbXBvcnQgeyBWYWxpZGF0ZURlc2NyaXB0aW9uLCBWYWxpZGF0ZVJ1bGVzTWFwIH0gZnJvbSAnLi90eXBlcydcbmNvbnN0IGlzVmFsaWRhdGVFbXB0eSA9ICh2YWx1ZTogYW55KSA9PiB7XG4gIGlmIChpc0Fycih2YWx1ZSkpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXNWYWxpZCh2YWx1ZVtpXSkpIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBpc0VtcHR5KHZhbHVlKVxuICB9XG59XG5cbmNvbnN0IGdldExlbmd0aCA9ICh2YWx1ZTogYW55KSA9PlxuICBpc1N0cih2YWx1ZSkgPyBzdHJpbmdMZW5ndGgodmFsdWUpIDogdmFsdWUgPyB2YWx1ZS5sZW5ndGggOiAwXG5cbmNvbnN0IGludGVyc2VjdGlvbiA9IChhcnIxOiBzdHJpbmdbXSwgYXJyMjogc3RyaW5nW10pID0+IHtcbiAgcmV0dXJuIGFycjEuZmlsdGVyKGtleSA9PiBhcnIyLmluY2x1ZGVzKGtleSkpXG59XG5cbmNvbnN0IGdldFJ1bGVNZXNzYWdlID0gKHJ1bGU6IGFueSwgdHlwZTogc3RyaW5nLCBydWxlcz86IFZhbGlkYXRlUnVsZXNNYXApID0+IHtcbiAgY29uc3QgYWxsUnVsZUtleXMgPSBPYmplY3Qua2V5cyhydWxlcyB8fCB7fSlcbiAgY29uc3QgY3VycmVudFJ1bGVLZXlzID0gT2JqZWN0LmtleXMocnVsZSB8fCB7fSlcbiAgaWYgKFxuICAgIGlzRm4ocnVsZS52YWxpZGF0b3IpIHx8XG4gICAgaW50ZXJzZWN0aW9uKGN1cnJlbnRSdWxlS2V5cywgYWxsUnVsZUtleXMpLmxlbmd0aCA+IDJcbiAgKSB7XG4gICAgaWYgKHJ1bGUuZm9ybWF0KSB7XG4gICAgICByZXR1cm4gcnVsZS5tZXNzYWdlIHx8IGdldE1lc3NhZ2UodHlwZSlcbiAgICB9XG4gICAgcmV0dXJuIGdldE1lc3NhZ2UodHlwZSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcnVsZS5tZXNzYWdlIHx8IGdldE1lc3NhZ2UodHlwZSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHJlcXVpcmVkKHZhbHVlOiBhbnksIHJ1bGU6IFZhbGlkYXRlRGVzY3JpcHRpb24sIHJ1bGVzOiBWYWxpZGF0ZVJ1bGVzTWFwKSB7XG4gICAgaWYgKHJ1bGUucmVxdWlyZWQgPT09IGZhbHNlKSByZXR1cm4gJydcbiAgICByZXR1cm4gaXNWYWxpZGF0ZUVtcHR5KHZhbHVlKSA/IGdldFJ1bGVNZXNzYWdlKHJ1bGUsICdyZXF1aXJlZCcsIHJ1bGVzKSA6ICcnXG4gIH0sXG4gIG1heCh2YWx1ZTogYW55LCBydWxlOiBWYWxpZGF0ZURlc2NyaXB0aW9uLCBydWxlczogVmFsaWRhdGVSdWxlc01hcCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IGdldExlbmd0aCh2YWx1ZSlcbiAgICBjb25zdCBtYXggPSBOdW1iZXIocnVsZS5tYXgpXG4gICAgcmV0dXJuIGxlbmd0aCA+IG1heCA/IGdldFJ1bGVNZXNzYWdlKHJ1bGUsICdtYXgnLCBydWxlcykgOiAnJ1xuICB9LFxuICBtYXhpbXVtKHZhbHVlOiBhbnksIHJ1bGU6IFZhbGlkYXRlRGVzY3JpcHRpb24sIHJ1bGVzOiBWYWxpZGF0ZVJ1bGVzTWFwKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPiBOdW1iZXIocnVsZS5tYXhpbXVtKVxuICAgICAgPyBnZXRSdWxlTWVzc2FnZShydWxlLCAnbWF4aW11bScsIHJ1bGVzKVxuICAgICAgOiAnJ1xuICB9LFxuICBleGNsdXNpdmVNYXhpbXVtKFxuICAgIHZhbHVlOiBhbnksXG4gICAgcnVsZTogVmFsaWRhdGVEZXNjcmlwdGlvbixcbiAgICBydWxlczogVmFsaWRhdGVSdWxlc01hcFxuICApIHtcbiAgICByZXR1cm4gTnVtYmVyKHZhbHVlKSA+PSBOdW1iZXIocnVsZS5leGNsdXNpdmVNYXhpbXVtKVxuICAgICAgPyBnZXRSdWxlTWVzc2FnZShydWxlLCAnZXhjbHVzaXZlTWF4aW11bScsIHJ1bGVzKVxuICAgICAgOiAnJ1xuICB9LFxuICBtaW5pbXVtKHZhbHVlOiBhbnksIHJ1bGU6IFZhbGlkYXRlRGVzY3JpcHRpb24sIHJ1bGVzOiBWYWxpZGF0ZVJ1bGVzTWFwKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPCBOdW1iZXIocnVsZS5taW5pbXVtKVxuICAgICAgPyBnZXRSdWxlTWVzc2FnZShydWxlLCAnbWluaW11bScsIHJ1bGVzKVxuICAgICAgOiAnJ1xuICB9LFxuICBleGNsdXNpdmVNaW5pbXVtKFxuICAgIHZhbHVlOiBhbnksXG4gICAgcnVsZTogVmFsaWRhdGVEZXNjcmlwdGlvbixcbiAgICBydWxlczogVmFsaWRhdGVSdWxlc01hcFxuICApIHtcbiAgICByZXR1cm4gTnVtYmVyKHZhbHVlKSA8PSBOdW1iZXIocnVsZS5leGNsdXNpdmVNaW5pbXVtKVxuICAgICAgPyBnZXRSdWxlTWVzc2FnZShydWxlLCAnZXhjbHVzaXZlTWluaW11bScsIHJ1bGVzKVxuICAgICAgOiAnJ1xuICB9LFxuICBsZW4odmFsdWU6IGFueSwgcnVsZTogVmFsaWRhdGVEZXNjcmlwdGlvbiwgcnVsZXM6IFZhbGlkYXRlUnVsZXNNYXApIHtcbiAgICBjb25zdCBsZW5ndGggPSBnZXRMZW5ndGgodmFsdWUpXG4gICAgY29uc3QgbGVuID0gTnVtYmVyKHJ1bGUubGVuKVxuICAgIHJldHVybiBsZW5ndGggIT09IGxlbiA/IGdldFJ1bGVNZXNzYWdlKHJ1bGUsICdsZW4nLCBydWxlcykgOiAnJ1xuICB9LFxuICBtaW4odmFsdWU6IGFueSwgcnVsZTogVmFsaWRhdGVEZXNjcmlwdGlvbiwgcnVsZXM6IFZhbGlkYXRlUnVsZXNNYXApIHtcbiAgICBjb25zdCBsZW5ndGggPSBnZXRMZW5ndGgodmFsdWUpXG4gICAgY29uc3QgbWluID0gTnVtYmVyKHJ1bGUubWluKVxuICAgIHJldHVybiBsZW5ndGggPCBtaW4gPyBnZXRSdWxlTWVzc2FnZShydWxlLCAnbWluJywgcnVsZXMpIDogJydcbiAgfSxcbiAgcGF0dGVybih2YWx1ZTogYW55LCBydWxlOiBWYWxpZGF0ZURlc2NyaXB0aW9uLCBydWxlczogVmFsaWRhdGVSdWxlc01hcCkge1xuICAgIGlmIChpc1ZhbGlkYXRlRW1wdHkodmFsdWUpKSByZXR1cm4gJydcbiAgICByZXR1cm4gIW5ldyBSZWdFeHAocnVsZS5wYXR0ZXJuKS50ZXN0KHZhbHVlKVxuICAgICAgPyBnZXRSdWxlTWVzc2FnZShydWxlLCAncGF0dGVybicsIHJ1bGVzKVxuICAgICAgOiAnJ1xuICB9LFxuICBhc3luYyB2YWxpZGF0b3IoXG4gICAgdmFsdWU6IGFueSxcbiAgICBydWxlOiBWYWxpZGF0ZURlc2NyaXB0aW9uLFxuICAgIHJ1bGVzOiBWYWxpZGF0ZVJ1bGVzTWFwXG4gICkge1xuICAgIGlmIChpc0ZuKHJ1bGUudmFsaWRhdG9yKSkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBQcm9taXNlLnJlc29sdmUocnVsZS52YWxpZGF0b3IodmFsdWUsIHJ1bGUsIHJ1bGVzKSlcbiAgICAgIGlmIChpc0Jvb2wocmVzcG9uc2UpKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZSA/IHJ1bGUubWVzc2FnZSA6ICcnXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHJ1bGUncyB2YWxpZGF0b3IgcHJvcGVydHkgbXVzdCBiZSBhIGZ1bmN0aW9uLlwiKVxuICB9LFxuICB3aGl0ZXNwYWNlKHZhbHVlOiBhbnksIHJ1bGU6IFZhbGlkYXRlRGVzY3JpcHRpb24sIHJ1bGVzOiBWYWxpZGF0ZVJ1bGVzTWFwKSB7XG4gICAgaWYgKHJ1bGUud2hpdGVzcGFjZSkge1xuICAgICAgcmV0dXJuIC9eXFxzKyQvLnRlc3QodmFsdWUpXG4gICAgICAgID8gZ2V0UnVsZU1lc3NhZ2UocnVsZSwgJ3doaXRlc3BhY2UnLCBydWxlcylcbiAgICAgICAgOiAnJ1xuICAgIH1cbiAgfSxcbiAgZW51bSh2YWx1ZTogYW55LCBydWxlOiBWYWxpZGF0ZURlc2NyaXB0aW9uLCBydWxlczogVmFsaWRhdGVSdWxlc01hcCkge1xuICAgIGNvbnN0IGVudW1zID0gdG9BcnIocnVsZS5lbnVtKVxuICAgIHJldHVybiBlbnVtcy5pbmRleE9mKHZhbHVlKSA9PT0gLTFcbiAgICAgID8gZ2V0UnVsZU1lc3NhZ2UocnVsZSwgJ2VudW0nLCBydWxlcylcbiAgICAgIDogJydcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgVmFsaWRhdG9yT3B0aW9ucyxcbiAgVmFsaWRhdGVOb2RlTWFwLFxuICBWYWxpZGF0ZVBhdHRlcm5SdWxlcyxcbiAgVmFsaWRhdGVSdWxlcyxcbiAgVmFsaWRhdGVGb3JtYXRzTWFwLFxuICBWYWxpZGF0ZVJ1bGVzTWFwLFxuICBWYWxpZGF0ZVJlc3BvbnNlLFxuICBWYWxpZGF0ZURlc2NyaXB0aW9uLFxuICBWYWxpZGF0ZUZpZWxkT3B0aW9ucyxcbiAgVmFsaWRhdGVDYWxjdWxhdG9yLFxuICBWYWxpZGF0ZU5vZGUsXG4gIFZhbGlkYXRlTm9kZVJlc3VsdCxcbiAgU3luY1ZhbGlkYXRlUmVzcG9uc2Vcbn0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7XG4gIGlzRm4sXG4gIGlzU3RyLFxuICBpc0FycixcbiAgaXNPYmosXG4gIGlzVmFsaWQsXG4gIGVhY2gsXG4gIGxvZyxcbiAgcmVkdWNlLFxuICBGb3JtUGF0aCxcbiAgRm9ybVBhdGhQYXR0ZXJuXG59IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCB7IGdldE1lc3NhZ2UgfSBmcm9tICcuL21lc3NhZ2UnXG5pbXBvcnQgZGVmYXVsdEZvcm1hdHMgZnJvbSAnLi9mb3JtYXRzJ1xuaW1wb3J0IGRlZmF1bHRSdWxlcyBmcm9tICcuL3J1bGVzJ1xuXG4vL+agoemqjOinhOWImembhuWQiFxuY29uc3QgVmFsaWRhdG9yUnVsZXM6IFZhbGlkYXRlUnVsZXNNYXAgPSB7fVxuXG4vL+agoemqjOagvOW8j+mbhuWQiFxuY29uc3QgVmFsaWRhdG9yRm9ybWF0b3JzOiBWYWxpZGF0ZUZvcm1hdHNNYXAgPSB7fVxuXG4vL+aooeadv+W8leaTjlxuY29uc3QgdGVtcGxhdGUgPSAobWVzc2FnZTogU3luY1ZhbGlkYXRlUmVzcG9uc2UsIGNvbnRleHQ6IGFueSk6IHN0cmluZyA9PiB7XG4gIGlmIChpc1N0cihtZXNzYWdlKSkge1xuICAgIGlmIChpc0ZuKEZvcm1WYWxpZGF0b3IudGVtcGxhdGUpKSB7XG4gICAgICByZXR1cm4gRm9ybVZhbGlkYXRvci50ZW1wbGF0ZShtZXNzYWdlLCBjb250ZXh0KVxuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZS5yZXBsYWNlKC9cXHtcXHtcXHMqKFtcXHcuXSspXFxzKlxcfVxcfS9nLCAoXywgJDApID0+IHtcbiAgICAgIHJldHVybiBGb3JtUGF0aC5nZXRJbihjb250ZXh0LCAkMClcbiAgICB9KVxuICB9IGVsc2UgaWYgKGlzT2JqKG1lc3NhZ2UpICYmICFtZXNzYWdlWyckJHR5cGVvZiddICYmICFtZXNzYWdlWydfb3duZXInXSkge1xuICAgIHJldHVybiB0ZW1wbGF0ZShtZXNzYWdlLm1lc3NhZ2UsIGNvbnRleHQpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1lc3NhZ2UgYXMgYW55XG4gIH1cbn1cblxuY2xhc3MgRm9ybVZhbGlkYXRvciB7XG4gIHByaXZhdGUgdmFsaWRhdGVGaXJzdDogYm9vbGVhblxuICBwcml2YXRlIG5vZGVzOiBWYWxpZGF0ZU5vZGVNYXBcbiAgcHJpdmF0ZSBtYXRjaFN0cmF0ZWd5OiBWYWxpZGF0b3JPcHRpb25zWydtYXRjaFN0cmF0ZWd5J11cblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBWYWxpZGF0b3JPcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnZhbGlkYXRlRmlyc3QgPSBvcHRpb25zLnZhbGlkYXRlRmlyc3RcbiAgICB0aGlzLm1hdGNoU3RyYXRlZ3kgPSBvcHRpb25zLm1hdGNoU3RyYXRlZ3lcbiAgICB0aGlzLm5vZGVzID0ge31cbiAgfVxuXG4gIHRyYW5zZm9ybVJ1bGVzKHJ1bGVzOiBWYWxpZGF0ZVBhdHRlcm5SdWxlcykge1xuICAgIGlmIChpc1N0cihydWxlcykpIHtcbiAgICAgIGlmICghVmFsaWRhdG9yRm9ybWF0b3JzW3J1bGVzXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgZm91bmQgdmFsaWRhdG9yIHBhdHRlcm4nKVxuICAgICAgfVxuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIHBhdHRlcm46IFZhbGlkYXRvckZvcm1hdG9yc1tydWxlc10sXG4gICAgICAgICAgbWVzc2FnZTogZ2V0TWVzc2FnZShydWxlcykgfHwgJ0NhbiBub3QgZm91bmQgdmFsaWRhdG9yIG1lc3NhZ2UuJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfSBlbHNlIGlmIChpc0ZuKHJ1bGVzKSkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIHZhbGlkYXRvcjogcnVsZXNcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0gZWxzZSBpZiAoaXNBcnIocnVsZXMpKSB7XG4gICAgICByZXR1cm4gcnVsZXMucmVkdWNlKChidWY6IGFueSwgcnVsZSkgPT4ge1xuICAgICAgICByZXR1cm4gYnVmLmNvbmNhdCh0aGlzLnRyYW5zZm9ybVJ1bGVzKHJ1bGUpKVxuICAgICAgfSwgW10pXG4gICAgfSBlbHNlIGlmIChpc09iaihydWxlcykpIHtcbiAgICAgIGlmIChydWxlcy5mb3JtYXQpIHtcbiAgICAgICAgaWYgKCFWYWxpZGF0b3JGb3JtYXRvcnNbcnVsZXMuZm9ybWF0XSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBmb3VuZCB2YWxpZGF0b3IgcGF0dGVybicpXG4gICAgICAgIH1cbiAgICAgICAgcnVsZXMucGF0dGVybiA9IFZhbGlkYXRvckZvcm1hdG9yc1tydWxlcy5mb3JtYXRdXG4gICAgICAgIHJ1bGVzLm1lc3NhZ2UgPSBydWxlcy5tZXNzYWdlIHx8IGdldE1lc3NhZ2UocnVsZXMuZm9ybWF0KVxuICAgICAgfVxuICAgICAgcmV0dXJuIFtydWxlc11cbiAgICB9XG4gICAgcmV0dXJuIFtdXG4gIH1cblxuICBhc3luYyBpbnRlcm5hbFZhbGlkYXRlKFxuICAgIHZhbHVlOiBhbnksXG4gICAgcnVsZXM6IFZhbGlkYXRlUnVsZXMsXG4gICAgb3B0aW9uczogVmFsaWRhdGVGaWVsZE9wdGlvbnMgPSB7fVxuICApOiBQcm9taXNlPHtcbiAgICBlcnJvcnM6IHN0cmluZ1tdXG4gICAgd2FybmluZ3M6IHN0cmluZ1tdXG4gIH0+IHtcbiAgICBjb25zdCBmaXJzdCA9IGlzVmFsaWQob3B0aW9ucy5maXJzdClcbiAgICAgID8gISFvcHRpb25zLmZpcnN0XG4gICAgICA6ICEhdGhpcy52YWxpZGF0ZUZpcnN0XG4gICAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdXG4gICAgY29uc3Qgd2FybmluZ3MgPSBbXVxuICAgIHRyeSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJ1bGVPYmogPSBydWxlc1tpXVxuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocnVsZU9iaikuc29ydChrZXkgPT5cbiAgICAgICAgICBrZXkgPT09ICd2YWxpZGF0b3InID8gMSA6IC0xXG4gICAgICAgIClcbiAgICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCBrZXlzLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tsXVxuICAgICAgICAgIGlmIChydWxlT2JqLmhhc093blByb3BlcnR5KGtleSkgJiYgaXNWYWxpZChydWxlT2JqW2tleV0pKSB7XG4gICAgICAgICAgICBjb25zdCBydWxlID0gVmFsaWRhdG9yUnVsZXNba2V5XVxuICAgICAgICAgICAgaWYgKHJ1bGUpIHtcbiAgICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IGF3YWl0IHJ1bGUodmFsdWUsIHJ1bGVPYmosIFZhbGlkYXRvclJ1bGVzKVxuICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gdGVtcGxhdGUocGF5bG9hZCwge1xuICAgICAgICAgICAgICAgIC4uLnJ1bGVPYmosXG4gICAgICAgICAgICAgICAgcnVsZTogcnVsZU9iaixcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgaXNTdHIocGF5bG9hZCkgfHxcbiAgICAgICAgICAgICAgICAocGF5bG9hZFsnJCR0eXBlb2YnXSAmJiBwYXlsb2FkWydfb3duZXInXSlcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChtZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UpIGVycm9ycy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPYmoocGF5bG9hZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAocGF5bG9hZC50eXBlID09PSAnd2FybmluZycpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlKSB3YXJuaW5ncy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlKSBlcnJvcnMucHVzaChtZXNzYWdlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXJyb3JzLFxuICAgICAgICB3YXJuaW5nc1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVycm9ycyxcbiAgICAgICAgd2FybmluZ3NcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyB2YWxpZGF0ZU5vZGVzKFxuICAgIHBhdHRlcm46IEZvcm1QYXRoLFxuICAgIG9wdGlvbnM6IFZhbGlkYXRlRmllbGRPcHRpb25zXG4gICk6IFByb21pc2U8VmFsaWRhdGVOb2RlUmVzdWx0PiB7XG4gICAgbGV0IGVycm9ycyA9IFtdXG4gICAgbGV0IHdhcm5pbmdzID0gW11cbiAgICB0cnkge1xuICAgICAgY29uc3Qgbm9kZUtleSA9IHBhdHRlcm4udG9TdHJpbmcoKVxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZXNbbm9kZUtleV1cbiAgICAgIGNvbnN0IG1hdGNoTm9kZXMgPSBub2RlID8geyBbbm9kZUtleV06IG5vZGUgfSA6IHRoaXMubm9kZXNcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICByZWR1Y2U8VmFsaWRhdGVOb2RlTWFwLCBWYWxpZGF0ZU5vZGU+KFxuICAgICAgICAgIG1hdGNoTm9kZXMsXG4gICAgICAgICAgKGJ1ZiwgdmFsaWRhdG9yLCBwYXRoKSA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGlzRm4odGhpcy5tYXRjaFN0cmF0ZWd5KVxuICAgICAgICAgICAgICAgID8gdGhpcy5tYXRjaFN0cmF0ZWd5KHBhdHRlcm4sIHBhdGgpXG4gICAgICAgICAgICAgICAgOiBwYXR0ZXJuLm1hdGNoKHBhdGgpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGJ1Zi5jb25jYXQoXG4gICAgICAgICAgICAgICAgdmFsaWRhdG9yKG9wdGlvbnMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMuY29uY2F0KHtcbiAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXM6IHJlc3VsdC5lcnJvcnNcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQud2FybmluZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmdzID0gd2FybmluZ3MuY29uY2F0KHtcbiAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXM6IHJlc3VsdC53YXJuaW5nc1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBidWZcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtdXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVycm9ycyxcbiAgICAgICAgd2FybmluZ3NcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKGVycm9yKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXJyb3JzLFxuICAgICAgICB3YXJuaW5nc1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhbGlkYXRlID0gKFxuICAgIHBhdGg/OiBGb3JtUGF0aFBhdHRlcm4sXG4gICAgb3B0aW9ucz86IFZhbGlkYXRlRmllbGRPcHRpb25zXG4gICk6IFByb21pc2U8VmFsaWRhdGVOb2RlUmVzdWx0PiA9PiB7XG4gICAgY29uc3QgcGF0dGVybiA9IEZvcm1QYXRoLmdldFBhdGgocGF0aCB8fCAnKicpXG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdGVOb2RlcyhwYXR0ZXJuLCBvcHRpb25zKVxuICB9XG5cbiAgcmVnaXN0ZXIgPSAocGF0aDogRm9ybVBhdGhQYXR0ZXJuLCBjYWxjdWxhdG9yOiBWYWxpZGF0ZUNhbGN1bGF0b3IpID0+IHtcbiAgICBjb25zdCBuZXdQYXRoID0gRm9ybVBhdGguZ2V0UGF0aChwYXRoKVxuICAgIHRoaXMubm9kZXNbbmV3UGF0aC50b1N0cmluZygpXSA9IChvcHRpb25zOiBWYWxpZGF0ZUZpZWxkT3B0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgbGV0IHRtcFJlc3VsdDogYW55XG4gICAgICAgIGNvbnN0IHZhbGlkYXRlID0gYXN5bmMgKHZhbHVlOiBhbnksIHJ1bGVzOiBWYWxpZGF0ZVBhdHRlcm5SdWxlcykgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAga2V5OiBuZXdQYXRoLnRvU3RyaW5nKClcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxWYWxpZGF0ZShcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1SdWxlcyhydWxlcyksXG4gICAgICAgICAgICBkYXRhXG4gICAgICAgICAgKS50aGVuKFxuICAgICAgICAgICAgcGF5bG9hZCA9PiB7XG4gICAgICAgICAgICAgIHRtcFJlc3VsdCA9IHBheWxvYWRcbiAgICAgICAgICAgICAgcmV0dXJuIHBheWxvYWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXlsb2FkID0+IHtcbiAgICAgICAgICAgICAgdG1wUmVzdWx0ID0gcGF5bG9hZFxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocGF5bG9hZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGNhbGN1bGF0b3IodmFsaWRhdGUpKS50aGVuKFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUodG1wUmVzdWx0KVxuICAgICAgICAgIH0sXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHRtcFJlc3VsdClcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdW5yZWdpc3RlciA9IChwYXRoOiBGb3JtUGF0aFBhdHRlcm4pID0+IHtcbiAgICBjb25zdCBuZXdQYXRoID0gRm9ybVBhdGguZ2V0UGF0aChwYXRoKVxuICAgIGRlbGV0ZSB0aGlzLm5vZGVzW25ld1BhdGgudG9TdHJpbmcoKV1cbiAgfVxuXG4gIHN0YXRpYyB0ZW1wbGF0ZTogKFxuICAgIG1lc3NhZ2U6IFZhbGlkYXRlUmVzcG9uc2UsXG4gICAgZGF0YTogVmFsaWRhdGVEZXNjcmlwdGlvbiAmIHsgdmFsdWU6IGFueTsga2V5OiBzdHJpbmcgfVxuICApID0+IHN0cmluZ1xuXG4gIC8v5rOo5YaM6YCa55So6KeE5YiZXG4gIHN0YXRpYyByZWdpc3RlclJ1bGVzKHJ1bGVzOiBWYWxpZGF0ZVJ1bGVzTWFwKSB7XG4gICAgZWFjaChydWxlcywgKHJ1bGUsIGtleSkgPT4ge1xuICAgICAgaWYgKGlzRm4ocnVsZSkpIHtcbiAgICAgICAgVmFsaWRhdG9yUnVsZXNba2V5XSA9IHJ1bGVcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIC8qKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vYWxpYmFiYS9mb3JtaWx5L2lzc3Vlcy8yMTVcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge1ZhbGlkYXRlRm9ybWF0c01hcH0gZm9ybWF0c1xuICAgKiBAbWVtYmVyb2YgRm9ybVZhbGlkYXRvclxuICAgKi9cbiAgc3RhdGljIHJlZ2lzdGVyRm9ybWF0cyhmb3JtYXRzOiBWYWxpZGF0ZUZvcm1hdHNNYXApIHtcbiAgICBlYWNoKGZvcm1hdHMsIChwYXR0ZXJuLCBrZXkpID0+IHtcbiAgICAgIGlmIChpc1N0cihwYXR0ZXJuKSB8fCBwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIFZhbGlkYXRvckZvcm1hdG9yc1trZXldID0gbmV3IFJlZ0V4cChwYXR0ZXJuKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvL+azqOWGjOagoemqjOa2iOaBr+aooeadv+W8leaTjlxuICBzdGF0aWMgcmVnaXN0ZXJNVEVuZ2luZSA9IHRlbXBsYXRlID0+IHtcbiAgICBpZiAoaXNGbih0ZW1wbGF0ZSkpIHtcbiAgICAgIEZvcm1WYWxpZGF0b3IudGVtcGxhdGUgPSB0ZW1wbGF0ZVxuICAgIH1cbiAgfVxufVxuXG5Gb3JtVmFsaWRhdG9yLnJlZ2lzdGVyRm9ybWF0cyhkZWZhdWx0Rm9ybWF0cylcbkZvcm1WYWxpZGF0b3IucmVnaXN0ZXJSdWxlcyhkZWZhdWx0UnVsZXMpXG5cbmV4cG9ydCB7IEZvcm1WYWxpZGF0b3IgfVxuIl0sIm5hbWVzIjpbInR5cGVzXzEiLCJyZXF1aXJlJCQwIiwiZ2xvYmFsIiwicmVxdWlyZSQkMSIsIl9fYXNzaWduIiwidGhpcyIsImluc3RhbmNlb2ZfMSIsImJpZ19kYXRhXzEiLCJyZXF1aXJlJCQyIiwiaXNFbXB0eV8xIiwiTEFOR1VBR0VTIiwidXBwZXJDYXNlIiwibG93ZXJDYXNlIiwicmVxdWlyZSQkMyIsIm5vQ2FzZSIsIl9faW1wb3J0RGVmYXVsdCIsInRva2Vuc18xIiwiY29udGV4dHNfMSIsInJlcXVpcmUkJDQiLCJyZXF1aXJlJCQ1IiwiZGVwcmVjYXRlXzEiLCJzY2hlZHVsZXJNb2R1bGUiLCJzY2hlZHVsZXIiLCJ1aWRfMSIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ3IiwicmVxdWlyZSQkOCIsInJlcXVpcmUkJDkiLCJyZXF1aXJlJCQxMCIsInJlcXVpcmUkJDExIiwicmVxdWlyZSQkMTIiLCJyZXF1aXJlJCQxMyIsInJlcXVpcmUkJDE0IiwicmVxdWlyZSQkMTUiLCJyZXF1aXJlJCQxNiIsInJlcXVpcmUkJDE3IiwiRm9ybVBhdGgiLCJzZWxmIiwiZ2xvYmFsVGhpc1BvbHlmaWxsIiwiZWFjaCIsImRlZXBtZXJnZSIsImxvZyIsImlzQXJyIiwiaXNWYWxpZCIsImlzRW1wdHkiLCJpc1N0ciIsInN0cmluZ0xlbmd0aCIsImlzRm4iLCJpc0Jvb2wiLCJ0b0FyciIsImlzT2JqIiwicmVkdWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztHQUNBLE1BQU0sQ0FBQyxjQUFjLFVBQVUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7R0FDOUQsSUFBSSxNQUFNLEdBQUcsVUFBVSxJQUFJLEVBQUUsRUFBRSxPQUFPLFVBQVUsR0FBRyxFQUFFO0dBQ3JELElBQUksT0FBTyxHQUFHLElBQUksSUFBSTtHQUN0QixRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLE9BQU8sQ0FBQyxP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S0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO0dBQ3RDLFFBQVEsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMzQyxRQUFRLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDM0MsS0FBSztHQUNMLFNBQVMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7R0FDM0IsUUFBUSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDO0dBQ3hDLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDbkMsS0FBSztHQUNMLFNBQVMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7R0FDM0IsUUFBUSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDO0dBQ3hDLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDbkMsS0FBSztHQUNMLFNBQVM7R0FDVCxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7R0FDOUMsS0FBSztHQUNMLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2hCLElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDO0dBQ3ZCLENBQUMsQ0FBQztHQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFlBQVk7R0FDckMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0dBQzFDLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7R0FDbEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ3pC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QUFPLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDLFVBQVUsR0FBRSxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSTtHQUN2ZixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLFdBQVcsR0FBRyxPQUFPLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLEdBQUcsT0FBTyxNQUFNLENBQUMscUJBQXFCLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyx5SUFBeUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLHdJQUF3SSxFQUFDLENBQUMsR0FBRyxRQUFRO0dBQ2xmLE9BQU8sQ0FBQyxFQUFFLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsZ0NBQWdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0hBQWtILENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVM7R0FDNWYsVUFBVSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDaGQsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNwYSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7R0FDMVAsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQztHQUN4WixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLFFBQVEsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsOEJBQThCLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQywyQkFBMkIsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsZ0NBQWdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsQ0FBQyxtQ0FBbUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7R0FDN2MseUNBQXlDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLHNDQUFzQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxRQUFRLENBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxVQUFVLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLGlDQUFpQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7R0FDcGUsa0NBQWtDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENB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
