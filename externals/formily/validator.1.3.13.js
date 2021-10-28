System.register(['@formily/shared'], (function (exports) {
  'use strict';
  var FormPath, merge, log, globalThisPolyfill, each, isStr, stringLength, isFn, isBool, toArr, isArr, isValid, isEmpty, isObj, reduce;
  return {
    setters: [function (module) {
      FormPath = module.FormPath;
      merge = module.merge;
      log = module.log;
      globalThisPolyfill = module.globalThisPolyfill;
      each = module.each;
      isStr = module.isStr;
      stringLength = module.stringLength;
      isFn = module.isFn;
      isBool = module.isBool;
      toArr = module.toArr;
      isArr = module.isArr;
      isValid = module.isValid;
      isEmpty = module.isEmpty;
      isObj = module.isObj;
      reduce = module.reduce;
    }],
    execute: (function () {

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

      const getIn = FormPath.getIn;
      const self = globalThisPolyfill;
      const getBrowserlanguage = () => {
        if (!self.navigator) {
          return "en";
        }
        return self.navigator.browserlanguage || self.navigator.language || "en";
      };
      const LOCALE = {
        messages: {},
        lang: getBrowserlanguage()
      };
      const getMatchLang = (lang) => {
        let isoCode = LOCALE.lang;
        if (LOCALE.messages[lang]) {
          return lang;
        }
        each(LOCALE.messages, (messages, key) => {
          if (key.indexOf(lang) > -1 || String(lang).indexOf(key) > -1) {
            isoCode = key;
            return false;
          }
        });
        return isoCode;
      };
      const setValidationLocale = exports('setValidationLocale', (locale) => {
        LOCALE.messages = merge(LOCALE.messages, locale);
      });
      const setLocale = exports('setLocale', setValidationLocale);
      const setValidationLanguage = exports('setValidationLanguage', (lang) => {
        LOCALE.lang = lang;
      });
      const setLanguage = exports('setLanguage', setValidationLanguage);
      const getMessage = exports('getMessage', (path) => {
        const message = getIn(LOCALE.messages, `${getMatchLang(LOCALE.lang)}.${path}`);
        if (!message) {
          log.error(`field is not valid,but not found ${path} error message. Please set the language pack first through setValidationLocale`);
        }
        return message || "Field is invalid";
      });
      setValidationLocale(locales);

      var defaultFormats = {
        url: new RegExp("^(?:(?:(?:https?|ftp|rtmp):)?//)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:22[0-3]|2[01]\\d|[1-9]\\d?|1\\d\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1?\\d{1,2})){2}(?:\\.(?:25[0-4]|2[0-4]\\d|1\\d\\d|[1-9]\\d?))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:/?\\S*)?$"),
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
        if (isArr(value)) {
          for (let i = 0; i < value.length; i++) {
            if (isValid(value[i]))
              return false;
          }
          return true;
        } else {
          return isEmpty(value);
        }
      };
      const getLength = (value) => isStr(value) ? stringLength(value) : value ? value.length : 0;
      const intersection = (arr1, arr2) => {
        return arr1.filter((key) => arr2.includes(key));
      };
      const getRuleMessage = (rule, type, rules) => {
        const allRuleKeys = Object.keys(rules || {});
        const currentRuleKeys = Object.keys(rule || {});
        if (isFn(rule.validator) || intersection(currentRuleKeys, allRuleKeys).length > 2) {
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
          if (isFn(rule.validator)) {
            const response = await Promise.resolve(rule.validator(value, rule, rules));
            if (isBool(response)) {
              return response ? rule.message : "";
            } else {
              return response || "";
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
          const enums = toArr(rule.enum);
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
        if (isStr(message)) {
          if (isFn(FormValidator.template)) {
            return FormValidator.template(message, context);
          }
          return message.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, $0) => {
            return FormPath.getIn(context, $0);
          });
        } else if (isObj(message) && !message["$$typeof"] && !message["_owner"]) {
          return template(message.message, context);
        } else {
          return message;
        }
      };
      const _FormValidator = class {
        constructor(options = {}) {
          this.validate = (path, options) => {
            const pattern = FormPath.getPath(path || "*");
            return this.validateNodes(pattern, options);
          };
          this.register = (path, calculator) => {
            const newPath = FormPath.getPath(path);
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
            const newPath = FormPath.getPath(path);
            delete this.nodes[newPath.toString()];
          };
          this.validateFirst = options.validateFirst;
          this.matchStrategy = options.matchStrategy;
          this.nodes = {};
        }
        transformRules(rules) {
          if (isStr(rules)) {
            if (!ValidatorFormators[rules]) {
              throw new Error("Can not found validator pattern");
            }
            return [
              {
                pattern: ValidatorFormators[rules],
                message: getMessage(rules) || "Can not found validator message."
              }
            ];
          } else if (isFn(rules)) {
            return [
              {
                validator: rules
              }
            ];
          } else if (isArr(rules)) {
            return rules.reduce((buf, rule) => {
              return buf.concat(this.transformRules(rule));
            }, []);
          } else if (isObj(rules)) {
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
          const first = isValid(options.first) ? !!options.first : !!this.validateFirst;
          const errors = [];
          const warnings = [];
          try {
            for (let i = 0; i < rules.length; i++) {
              const ruleObj = rules[i];
              const keys = Object.keys(ruleObj).sort((key) => key === "validator" ? 1 : -1);
              for (let l = 0; l < keys.length; l++) {
                const key = keys[l];
                if (ruleObj.hasOwnProperty(key) && isValid(ruleObj[key])) {
                  const rule = ValidatorRules[key];
                  if (rule) {
                    const payload = await rule(value, ruleObj, ValidatorRules);
                    const message = template(payload, __spreadProps(__spreadValues({}, ruleObj), {
                      rule: ruleObj,
                      value
                    }));
                    if (isStr(payload) || payload["$$typeof"] && payload["_owner"]) {
                      if (first) {
                        if (message) {
                          errors.push(message);
                          throw new Error(message);
                        }
                      }
                      if (message)
                        errors.push(message);
                    } else if (isObj(payload)) {
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
            await Promise.all(reduce(matchNodes, (buf, validator, path) => {
              if (isFn(this.matchStrategy) ? this.matchStrategy(pattern, path) : pattern.match(path)) {
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
            log.error(error);
            return {
              errors,
              warnings
            };
          }
        }
        static registerRules(rules) {
          each(rules, (rule, key) => {
            if (isFn(rule)) {
              ValidatorRules[key] = rule;
            }
          });
        }
        static registerFormats(formats) {
          each(formats, (pattern, key) => {
            if (isStr(pattern) || pattern instanceof RegExp) {
              ValidatorFormators[key] = new RegExp(pattern);
            }
          });
        }
      };
      let FormValidator = exports('FormValidator', _FormValidator);
      FormValidator.registerMTEngine = (template2) => {
        if (isFn(template2)) {
          _FormValidator.template = template2;
        }
      };
      FormValidator.registerFormats(defaultFormats);
      FormValidator.registerRules(defaultRules);

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLjEuMy4xMy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2xvY2FsZS50cyIsIi4uL3NyYy9tZXNzYWdlLnRzIiwiLi4vc3JjL2Zvcm1hdHMudHMiLCIuLi9zcmMvcnVsZXMudHMiLCIuLi9zcmMvdmFsaWRhdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgZW46IHtcbiAgICBwYXR0ZXJuOiAnVGhpcyBmaWVsZCAgZG9lcyBub3QgbWF0Y2ggYW55IHBhdHRlcm4nLFxuICAgIHJlcXVpcmVkOiAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZCcsXG4gICAgbnVtYmVyOiAnVGhpcyBmaWVsZCBpcyBub3QgYSBudW1iZXInLFxuICAgIGludGVnZXI6ICdUaGlzIGZpZWxkIGlzIG5vdCBhbiBpbnRlZ2VyIG51bWJlcicsXG4gICAgdXJsOiAnVGhpcyBmaWVsZCBpcyBhIGludmFsaWQgdXJsJyxcbiAgICBlbWFpbDogJ1RoaXMgZmllbGQgaXMgbm90IGEgZW1haWwgZm9ybWF0JyxcbiAgICBpcHY2OiAnVGhpcyBmaWVsZCBpcyBub3QgYSBpcHY2IGZvcm1hdCcsXG4gICAgaXB2NDogJ1RoaXMgZmllbGQgaXMgbm90IGEgaXB2NCBmb3JtYXQnLFxuICAgIGlkY2FyZDogJ1RoaXMgZmllbGQgaXMgbm90IGFuIGlkY2FyZCBmb3JtYXQnLFxuICAgIHRhb2RvbWFpbjogJ1RoaXMgZmllbGQgaXMgbm90IGEgdGFvYmFvIGRvbWFpbiBmb3JtYXQnLFxuICAgIHFxOiAnVGhpcyBmaWVsZCBpcyBub3QgYSBxcSBudW1iZXIgZm9ybWF0JyxcbiAgICBwaG9uZTogJ1RoaXMgZmllbGQgaXMgbm90IGEgcGhvbmUgbnVtYmVyIGZvcm1hdCcsXG4gICAgbW9uZXk6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIGN1cnJlbmN5IGZvcm1hdCcsXG4gICAgemg6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIGNoaW5lc2Ugc3RyaW5nJyxcbiAgICBkYXRlOiAnVGhpcyBmaWVsZCBpcyBub3QgYSB2YWxpZCBkYXRlIGZvcm1hdCcsXG4gICAgemlwOiAnVGhpcyBmaWVsZCBpcyBub3QgYSB6aXAgZm9ybWF0JyxcbiAgICBsZW46ICdUaGUgbGVuZ3RoIG9yIG51bWJlciBvZiBlbnRyaWVzIG11c3QgYmUge3tsZW59fScsXG4gICAgbWluOiAnVGhlIGxlbmd0aCBvciBudW1iZXIgb2YgZW50cmllcyBtdXN0IGJlIGF0IGxlYXN0IHt7bWlufX0nLFxuICAgIG1heGltdW06ICdUaGUgdmFsdWUgY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiB7e21heGltdW19fScsXG4gICAgZXhjbHVzaXZlTWF4aW11bTogJ1RoZSB2YWx1ZSBtdXN0IGJlIGxlc3MgdGhhbiB7e2V4Y2x1c2l2ZU1heGltdW19fScsXG4gICAgbWluaW11bTogJ1RoZSB2YWx1ZSBjYW5ub3QgYmUgbGVzcyB0aGFuIHt7bWluaW11bX19JyxcbiAgICBleGNsdXNpdmVNaW5pbXVtOiAnVGhlIHZhbHVlIG11c3QgYmUgZ3JlYXRlciB0aGFuIHt7ZXhjbHVzaXZlTWluaW11bX19JyxcbiAgICBtYXg6ICdUaGUgbGVuZ3RoIG9yIG51bWJlciBvZiBlbnRyaWVzIG11c3QgYmUgYXQgbW9zdCB7e21heH19JyxcbiAgICB3aGl0ZXNwYWNlOiAnVGhpcyBmaWVsZCBjYW5ub3QgYmUgYmxhbmsgc3RyaW5nLidcbiAgfSxcbiAgemg6IHtcbiAgICBwYXR0ZXJuOiAn6K+l5a2X5q615LiN5piv5LiA5Liq5ZCI5rOV55qE5a2X5q61JyxcbiAgICByZXF1aXJlZDogJ+ivpeWtl+auteaYr+W/heWhq+Wtl+autScsXG4gICAgbnVtYmVyOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE5pWw5a2XJyxcbiAgICBpbnRlZ2VyOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE5pW05Z6L5pWw5a2XJyxcbiAgICB1cmw6ICfor6XlrZfmrrXkuI3mmK/lkIjms5XnmoR1cmwnLFxuICAgIGVtYWlsOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE6YKu566x5qC85byPJyxcbiAgICBpcHY2OiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qEaXB2NuagvOW8jycsXG4gICAgaXB2NDogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahGlwdjTmoLzlvI8nLFxuICAgIGlkY2FyZDogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOi6q+S7veivgeagvOW8jycsXG4gICAgdGFvZG9tYWluOiAn6K+l5a2X5q615LiN56ym5ZCI5reY57O75Z+f5ZCN6KeE5YiZJyxcbiAgICBxcTogJ+ivpeWtl+auteS4jeespuWQiFFR5Y+35qC85byPJyxcbiAgICBwaG9uZTogJ+ivpeWtl+auteS4jeaYr+acieaViOeahOaJi+acuuWPtycsXG4gICAgbW9uZXk6ICfor6XlrZfmrrXkuI3mmK/mnInmlYjotKfluIHmoLzlvI8nLFxuICAgIHpoOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE5Lit5paH5a2X56ym5LiyJyxcbiAgICBkYXRlOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE5pel5pyf5qC85byPJyxcbiAgICB6aXA6ICfor6XlrZfmrrXkuI3mmK/lkIjms5XnmoTpgq7nvJbmoLzlvI8nLFxuICAgIGxlbjogJ+mVv+W6puaIluadoeebruaVsOW/hemhu+S4unt7bGVufX0nLFxuICAgIG1pbjogJ+mVv+W6puaIluadoeebruaVsOS4jeiDveWwj+S6jnt7bWlufX0nLFxuICAgIG1heDogJ+mVv+W6puaIluadoeebruaVsOS4jeiDveWkp+S6jnt7bWF4fX0nLFxuICAgIG1heGltdW06ICfmlbDlgLzkuI3og73lpKfkuo57e21heGltdW19fScsXG4gICAgZXhjbHVzaXZlTWF4aW11bTogJ+aVsOWAvOW/hemhu+Wwj+S6jnt7ZXhjbHVzaXZlTWF4aW11bX19JyxcbiAgICBtaW5pbXVtOiAn5pWw5YC85LiN6IO95bCP5LqOe3ttaW5pbXVtfX0nLFxuICAgIGV4Y2x1c2l2ZU1pbmltdW06ICfmlbDlgLzlv4XpobvlpKfkuo57e2V4Y2x1c2l2ZU1pbmltdW19fScsXG4gICAgd2hpdGVzcGFjZTogJ+S4jeiDveS4uue6r+epuueZveWtl+espuS4sidcbiAgfSxcbiAgJ2VuLVVTJzoge1xuICAgIHBhdHRlcm46ICdUaGlzIGZpZWxkICBkb2VzIG5vdCBtYXRjaCBhbnkgcGF0dGVybicsXG4gICAgcmVxdWlyZWQ6ICdUaGlzIGZpZWxkIGlzIHJlcXVpcmVkJyxcbiAgICBudW1iZXI6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIG51bWJlcicsXG4gICAgaW50ZWdlcjogJ1RoaXMgZmllbGQgaXMgbm90IGFuIGludGVnZXIgbnVtYmVyJyxcbiAgICB1cmw6ICdUaGlzIGZpZWxkIGlzIGEgaW52YWxpZCB1cmwnLFxuICAgIGVtYWlsOiAnVGhpcyBmaWVsZCBpcyBub3QgYSBlbWFpbCBmb3JtYXQnLFxuICAgIGlwdjY6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIGlwdjYgZm9ybWF0JyxcbiAgICBpcHY0OiAnVGhpcyBmaWVsZCBpcyBub3QgYSBpcHY0IGZvcm1hdCcsXG4gICAgaWRjYXJkOiAnVGhpcyBmaWVsZCBpcyBub3QgYW4gaWRjYXJkIGZvcm1hdCcsXG4gICAgdGFvZG9tYWluOiAnVGhpcyBmaWVsZCBpcyBub3QgYSB0YW9iYW8gZG9tYWluIGZvcm1hdCcsXG4gICAgcXE6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIHFxIG51bWJlciBmb3JtYXQnLFxuICAgIHBob25lOiAnVGhpcyBmaWVsZCBpcyBub3QgYSBwaG9uZSBudW1iZXIgZm9ybWF0JyxcbiAgICBtb25leTogJ1RoaXMgZmllbGQgaXMgbm90IGEgY3VycmVuY3kgZm9ybWF0JyxcbiAgICB6aDogJ1RoaXMgZmllbGQgaXMgbm90IGEgY2hpbmVzZSBzdHJpbmcnLFxuICAgIGRhdGU6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIHZhbGlkIGRhdGUgZm9ybWF0JyxcbiAgICB6aXA6ICdUaGlzIGZpZWxkIGlzIG5vdCBhIHppcCBmb3JtYXQnLFxuICAgIGxlbjogJ1RoZSBsZW5ndGggb3IgbnVtYmVyIG9mIGVudHJpZXMgbXVzdCBiZSB7e2xlbn19JyxcbiAgICBtaW46ICdUaGUgbGVuZ3RoIG9yIG51bWJlciBvZiBlbnRyaWVzIG11c3QgYmUgYXQgbGVhc3Qge3ttaW59fScsXG4gICAgbWF4aW11bTogJ1RoZSB2YWx1ZSBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIHt7bWF4aW11bX19JyxcbiAgICBleGNsdXNpdmVNYXhpbXVtOiAnVGhlIHZhbHVlIG11c3QgYmUgbGVzcyB0aGFuIHt7ZXhjbHVzaXZlTWF4aW11bX19JyxcbiAgICBtaW5pbXVtOiAnVGhlIHZhbHVlIGNhbm5vdCBiZSBsZXNzIHRoYW4ge3ttaW5pbXVtfX0nLFxuICAgIGV4Y2x1c2l2ZU1pbmltdW06ICdUaGUgdmFsdWUgbXVzdCBiZSBncmVhdGVyIHRoYW4ge3tleGNsdXNpdmVNaW5pbXVtfX0nLFxuICAgIG1heDogJ1RoZSBsZW5ndGggb3IgbnVtYmVyIG9mIGVudHJpZXMgbXVzdCBiZSBhdCBtb3N0IHt7bWF4fX0nLFxuICAgIHdoaXRlc3BhY2U6ICdUaGlzIGZpZWxkIGNhbm5vdCBiZSBibGFuayBzdHJpbmcuJ1xuICB9LFxuICAnemgtQ04nOiB7XG4gICAgcGF0dGVybjogJ+ivpeWtl+auteS4jeaYr+S4gOS4quWQiOazleeahOWtl+autScsXG4gICAgcmVxdWlyZWQ6ICfor6XlrZfmrrXmmK/lv4XloavlrZfmrrUnLFxuICAgIG51bWJlcjogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOaVsOWtlycsXG4gICAgaW50ZWdlcjogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOaVtOWei+aVsOWtlycsXG4gICAgdXJsOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qEdXJsJyxcbiAgICBlbWFpbDogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOmCrueuseagvOW8jycsXG4gICAgaXB2NjogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahGlwdjbmoLzlvI8nLFxuICAgIGlwdjQ6ICfor6XlrZfmrrXkuI3mmK/lkIjms5XnmoRpcHY05qC85byPJyxcbiAgICBpZGNhcmQ6ICfor6XlrZfmrrXkuI3mmK/lkIjms5XnmoTouqvku73or4HmoLzlvI8nLFxuICAgIHRhb2RvbWFpbjogJ+ivpeWtl+auteS4jeespuWQiOa3mOezu+Wfn+WQjeinhOWImScsXG4gICAgcXE6ICfor6XlrZfmrrXkuI3nrKblkIhRUeWPt+agvOW8jycsXG4gICAgcGhvbmU6ICfor6XlrZfmrrXkuI3mmK/mnInmlYjnmoTmiYvmnLrlj7cnLFxuICAgIG1vbmV5OiAn6K+l5a2X5q615LiN5piv5pyJ5pWI6LSn5biB5qC85byPJyxcbiAgICB6aDogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOS4reaWh+Wtl+espuS4sicsXG4gICAgZGF0ZTogJ+ivpeWtl+auteS4jeaYr+WQiOazleeahOaXpeacn+agvOW8jycsXG4gICAgemlwOiAn6K+l5a2X5q615LiN5piv5ZCI5rOV55qE6YKu57yW5qC85byPJyxcbiAgICBsZW46ICfplb/luqbmiJbmnaHnm67mlbDlv4XpobvkuLp7e2xlbn19JyxcbiAgICBtaW46ICfplb/luqbmiJbmnaHnm67mlbDkuI3og73lsI/kuo57e21pbn19JyxcbiAgICBtYXg6ICfplb/luqbmiJbmnaHnm67mlbDkuI3og73lpKfkuo57e21heH19JyxcbiAgICBtYXhpbXVtOiAn5pWw5YC85LiN6IO95aSn5LqOe3ttYXhpbXVtfX0nLFxuICAgIGV4Y2x1c2l2ZU1heGltdW06ICfmlbDlgLzlv4XpobvlsI/kuo57e2V4Y2x1c2l2ZU1heGltdW19fScsXG4gICAgbWluaW11bTogJ+aVsOWAvOS4jeiDveWwj+S6jnt7bWluaW11bX19JyxcbiAgICBleGNsdXNpdmVNaW5pbXVtOiAn5pWw5YC85b+F6aG75aSn5LqOe3tleGNsdXNpdmVNaW5pbXVtfX0nLFxuICAgIHdoaXRlc3BhY2U6ICfkuI3og73kuLrnuq/nqbrnmb3lrZfnrKbkuLInXG4gIH0sXG4gICd6aC1UVyc6IHtcbiAgICBwYXR0ZXJuOiAn6Kmy5a2X5q615LiN5piv5LiA5YCL5ZCI5rOV55qE5a2X5q61JyxcbiAgICByZXF1aXJlZDogJ+ipsuWtl+auteaYr+W/heWhq+Wtl+autScsXG4gICAgbnVtYmVyOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE5pW45a2XJyxcbiAgICBpbnRlZ2VyOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE5pW05Z6L5pW45a2XJyxcbiAgICB1cmw6ICfoqbLlrZfmrrXkuI3mmK/lkIjms5XnmoR1cmwnLFxuICAgIGVtYWlsOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE6YO1566x5qC85byPJyxcbiAgICBpcHY2OiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qEaXB2NuagvOW8jycsXG4gICAgaXB2NDogJ+ipsuWtl+auteS4jeaYr+WQiOazleeahGlwdjTmoLzlvI8nLFxuICAgIGlkY2FyZDogJ+ipsuWtl+auteS4jeaYr+WQiOazleeahOi6q+S7veitieagvOW8jycsXG4gICAgdGFvZG9tYWluOiAn6Kmy5a2X5q615LiN56ym5ZCI5reY57O75Z+f5ZCN6KaP5YmHJyxcbiAgICBxcTogJ+ipsuWtl+auteS4jeespuWQiFFR6Jmf5qC85byPJyxcbiAgICBwaG9uZTogJ+ipsuWtl+auteS4jeaYr+acieaViOeahOaJi+apn+iZnycsXG4gICAgbW9uZXk6ICfoqbLlrZfmrrXkuI3mmK/mnInmlYjosqjluaPmoLzlvI8nLFxuICAgIHpoOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE5Lit5paH5a2X56ym5LiyJyxcbiAgICBkYXRlOiAn6Kmy5a2X5q615LiN5piv5ZCI5rOV55qE5pel5pyf5qC85byPJyxcbiAgICB6aXA6ICfoqbLlrZfmrrXkuI3mmK/lkIjms5XnmoTpg7Xnt6jmoLzlvI8nLFxuICAgIGxlbjogJ+mVt+W6puaIluaineebruaVuOW/hemgiOeCunt7bGVufX0nLFxuICAgIG1pbjogJ+mVt+W6puaIluaineebruaVuOS4jeiDveWwj+aWvHt7bWlufX0nLFxuICAgIG1heDogJ+mVt+W6puaIluaineebruaVuOS4jeiDveWkp+aWvHt7bWF4fX0nLFxuICAgIG1heGltdW06ICfmlbjlgLzkuI3og73lpKfmlrx7e21heGltdW19fScsXG4gICAgZXhjbHVzaXZlTWF4aW11bTogJ+aVuOWAvOW/hemgiOWwj+aWvHt7ZXhjbHVzaXZlTWF4aW11bX19JyxcbiAgICBtaW5pbXVtOiAn5pW45YC85LiN6IO95bCP5pa8e3ttaW5pbXVtfX0nLFxuICAgIGV4Y2x1c2l2ZU1pbmltdW06ICfmlbjlgLzlv4XpoIjlpKfmlrx7e2V4Y2x1c2l2ZU1pbmltdW19fScsXG4gICAgd2hpdGVzcGFjZTogJ+S4jeiDveeCuue0lOepuueZveWtl+espuS4sidcbiAgfSxcbiAgamE6IHtcbiAgICB1cmw6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/nhKHlirnjgapVUkzjgafjgZknLFxuICAgIHdoaXRlc3BhY2U6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njgpLnqbrjga7mloflrZfliJfjgavjgZnjgovjgZPjgajjga/jgafjgY3jgb7jgZvjgpPjgIInLFxuICAgIHpoOiAn44GT44Gu44OV44Kj44O844Or44OJ44Gv5Lit5Zu96Kqe44Gu5paH5a2X5YiX44Gn44Gv44GC44KK44G+44Gb44KTJyxcbiAgICB6aXA6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga96aXDlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIGRhdGU6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/mnInlirnjgarml6Xku5jlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIGVtYWlsOiAn44GT44Gu44OV44Kj44O844Or44OJ44Gv44Oh44O844Or5b2i5byP44Gn44Gv44GC44KK44G+44Gb44KTJyxcbiAgICBleGNsdXNpdmVNYXhpbXVtOiAn5YCk44Gve3tleGNsdXNpdmVNYXhpbXVtfX3mnKrmuoDjgafjgYLjgovlv4XopoHjgYzjgYLjgorjgb7jgZknLFxuICAgIGV4Y2x1c2l2ZU1pbmltdW06ICflgKTjga97e2V4Y2x1c2l2ZU1pbmltdW19feOCiOOCiuWkp+OBjeOBhOW/heimgeOBjOOBguOCiuOBvuOBmScsXG4gICAgaWRjYXJkOiAn44GT44Gu44OV44Kj44O844Or44OJ44GvSUTjgqvjg7zjg4nlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIGludGVnZXI6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/mlbTmlbDjgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIGlwdjQ6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga9JUHY05b2i5byP44Gn44Gv44GC44KK44G+44Gb44KTJyxcbiAgICBpcHY2OiAn44GT44Gu44OV44Kj44O844Or44OJ44GvSVB2NuW9ouW8j+OBp+OBr+OBguOCiuOBvuOBm+OCkycsXG4gICAgbGVuOiAn44Ko44Oz44OI44Oq44Gu6ZW344GV44G+44Gf44Gv5pWw44Gve3tsZW59feOBp+OBquOBkeOCjOOBsOOBquOCiuOBvuOBm+OCkycsXG4gICAgbWF4OiAn44Ko44Oz44OI44Oq44Gu6ZW344GV44G+44Gf44Gv5pWw44Gv5pyA5aSne3ttYXh9feOBp+OBquOBkeOCjOOBsOOBquOCiuOBvuOBm+OCkycsXG4gICAgbWF4aW11bTogJ+WApOOBr3t75pyA5aSnfX3jgpLotoXjgYjjgovjgZPjgajjga/jgafjgY3jgb7jgZvjgpMnLFxuICAgIG1pbjogJ+OCqOODs+ODiOODquOBrumVt+OBleOBvuOBn+OBr+aVsOOBr+OAgeWwkeOBquOBj+OBqOOCgnt7bWlufX3jgafjgYLjgovlv4XopoHjgYzjgYLjgorjgb7jgZknLFxuICAgIG1pbmltdW06ICflgKTjga97e21pbmltdW19feS7peS4iuOBq+OBmeOCi+W/heimgeOBjOOBguOCiuOBvuOBmScsXG4gICAgbW9uZXk6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/pgJrosqjlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIG51bWJlcjogJ+OBk+OBruODleOCo+ODvOODq+ODieOBr+aVsOWApOOBp+OBr+OBguOCiuOBvuOBm+OCkycsXG4gICAgcGF0dGVybjogJ+OBk+OBruODleOCo+ODvOODq+ODieOBr+OBqeOBruODkeOCv+ODvOODs+OBqOOCguS4gOiHtOOBl+OBvuOBm+OCkycsXG4gICAgcGhvbmU6ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/pm7voqbHnlarlj7fjga7lvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIHFxOiAn44GT44Gu44OV44Kj44O844Or44OJ44GvcXHmlbDlgKTlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnLFxuICAgIHJlcXVpcmVkOiAn44GT44Gu6aCF55uu44Gv5b+F6aCI44Gn44GZJyxcbiAgICB0YW9kb21haW46ICfjgZPjga7jg5XjgqPjg7zjg6vjg4njga/mt5jlrp3ntrLjg4njg6HjgqTjg7PlvaLlvI/jgafjga/jgYLjgorjgb7jgZvjgpMnXG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIEZvcm1QYXRoLFxuICBlYWNoLFxuICBnbG9iYWxUaGlzUG9seWZpbGwsXG4gIG1lcmdlIGFzIGRlZXBtZXJnZSxcbiAgbG9nXG59IGZyb20gJ0Bmb3JtaWx5L3NoYXJlZCdcbmltcG9ydCBsb2NhbGVzIGZyb20gJy4vbG9jYWxlJ1xuXG5jb25zdCBnZXRJbiA9IEZvcm1QYXRoLmdldEluXG5cbmNvbnN0IHNlbGY6IGFueSA9IGdsb2JhbFRoaXNQb2x5ZmlsbFxuXG5leHBvcnQgaW50ZXJmYWNlIElMb2NhbGVNZXNzYWdlcyB7XG4gIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IElMb2NhbGVNZXNzYWdlc1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMb2NhbGVzIHtcbiAgW2xhbmc6IHN0cmluZ106IElMb2NhbGVNZXNzYWdlc1xufVxuXG5jb25zdCBnZXRCcm93c2VybGFuZ3VhZ2UgPSAoKSA9PiB7XG4gIGlmICghc2VsZi5uYXZpZ2F0b3IpIHtcbiAgICByZXR1cm4gJ2VuJ1xuICB9XG4gIHJldHVybiBzZWxmLm5hdmlnYXRvci5icm93c2VybGFuZ3VhZ2UgfHwgc2VsZi5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJ1xufVxuXG5jb25zdCBMT0NBTEUgPSB7XG4gIG1lc3NhZ2VzOiB7fSxcbiAgbGFuZzogZ2V0QnJvd3Nlcmxhbmd1YWdlKClcbn1cblxuY29uc3QgZ2V0TWF0Y2hMYW5nID0gKGxhbmc6IHN0cmluZykgPT4ge1xuICBsZXQgaXNvQ29kZSA9IExPQ0FMRS5sYW5nXG4gIGlmIChMT0NBTEUubWVzc2FnZXNbbGFuZ10pIHtcbiAgICByZXR1cm4gbGFuZ1xuICB9XG4gIGVhY2goTE9DQUxFLm1lc3NhZ2VzLCAobWVzc2FnZXM6IElMb2NhbGVNZXNzYWdlcywga2V5OiBzdHJpbmcpID0+IHtcbiAgICBpZiAoa2V5LmluZGV4T2YobGFuZykgPiAtMSB8fCBTdHJpbmcobGFuZykuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgIGlzb0NvZGUgPSBrZXlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGlzb0NvZGVcbn1cblxuZXhwb3J0IGNvbnN0IHNldFZhbGlkYXRpb25Mb2NhbGUgPSAobG9jYWxlOiBJTG9jYWxlcykgPT4ge1xuICBMT0NBTEUubWVzc2FnZXMgPSBkZWVwbWVyZ2UoTE9DQUxFLm1lc3NhZ2VzLCBsb2NhbGUpXG59XG5cbmV4cG9ydCBjb25zdCBzZXRMb2NhbGUgPSBzZXRWYWxpZGF0aW9uTG9jYWxlXG5cbmV4cG9ydCBjb25zdCBzZXRWYWxpZGF0aW9uTGFuZ3VhZ2UgPSAobGFuZzogc3RyaW5nKSA9PiB7XG4gIExPQ0FMRS5sYW5nID0gbGFuZ1xufVxuXG5leHBvcnQgY29uc3Qgc2V0TGFuZ3VhZ2UgPSBzZXRWYWxpZGF0aW9uTGFuZ3VhZ2VcblxuZXhwb3J0IGNvbnN0IGdldE1lc3NhZ2UgPSAocGF0aDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBnZXRJbihMT0NBTEUubWVzc2FnZXMsIGAke2dldE1hdGNoTGFuZyhMT0NBTEUubGFuZyl9LiR7cGF0aH1gKVxuICBpZiAoIW1lc3NhZ2UpIHtcbiAgICBsb2cuZXJyb3IoXG4gICAgICBgZmllbGQgaXMgbm90IHZhbGlkLGJ1dCBub3QgZm91bmQgJHtwYXRofSBlcnJvciBtZXNzYWdlLiBQbGVhc2Ugc2V0IHRoZSBsYW5ndWFnZSBwYWNrIGZpcnN0IHRocm91Z2ggc2V0VmFsaWRhdGlvbkxvY2FsZWBcbiAgICApXG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2UgfHwgJ0ZpZWxkIGlzIGludmFsaWQnXG59XG5cbnNldFZhbGlkYXRpb25Mb2NhbGUobG9jYWxlcylcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgdXJsOiBuZXcgUmVnRXhwKFxuICAgIC8vIHByb3RvY29sIGlkZW50aWZpZXJcbiAgICAnXig/Oig/Oig/Omh0dHBzP3xmdHB8cnRtcCk6KT8vLyknICtcbiAgICAgIC8vIHVzZXI6cGFzcyBhdXRoZW50aWNhdGlvblxuICAgICAgJyg/OlxcXFxTKyg/OjpcXFxcUyopP0ApPycgK1xuICAgICAgJyg/OicgK1xuICAgICAgLy8gSVAgYWRkcmVzcyBleGNsdXNpb24gLSBwcml2YXRlICYgbG9jYWwgbmV0d29ya3NcbiAgICAgIC8vIFJlZmVyZW5jZTogaHR0cHM6Ly93d3cuYXJpbi5uZXQva25vd2xlZGdlL2FkZHJlc3NfZmlsdGVycy5odG1sXG5cbiAgICAgIC8vIGZpbHRlciAxMC4qLiouKiBhbmQgMTI3LiouKi4qIGFkcmVzc2VzXG4gICAgICAnKD8hKD86MTB8MTI3KSg/OlxcXFwuXFxcXGR7MSwzfSl7M30pJyArXG4gICAgICAvLyBmaWx0ZXIgMTY5LjI1NC4qLiogYW5kIDE5Mi4xNjguKi4qXG4gICAgICAnKD8hKD86MTY5XFxcXC4yNTR8MTkyXFxcXC4xNjgpKD86XFxcXC5cXFxcZHsxLDN9KXsyfSknICtcbiAgICAgIC8vIGZpbHRlciAxNzIuMTYuMC4wIC0gMTcyLjMxLjI1NS4yNTVcbiAgICAgIC8vIFRPRE86IGFkZCB0ZXN0IHRvIHZhbGlkYXRlIHRoYXQgaXQgaW52YWxpZGVzIGFkZHJlc3MgaW4gMTYtMzEgcmFuZ2VcbiAgICAgICcoPyExNzJcXFxcLig/OjFbNi05XXwyXFxcXGR8M1swLTFdKSg/OlxcXFwuXFxcXGR7MSwzfSl7Mn0pJyArXG4gICAgICAvLyBJUCBhZGRyZXNzIGRvdHRlZCBub3RhdGlvbiBvY3RldHNcbiAgICAgIC8vIGV4Y2x1ZGVzIGxvb3BiYWNrIG5ldHdvcmsgMC4wLjAuMFxuICAgICAgLy8gZXhjbHVkZXMgcmVzZXJ2ZWQgc3BhY2UgPj0gMjI0LjAuMC4wXG4gICAgICAvLyBleGNsdWRlcyBuZXR3b3JrICYgYnJvYWNhc3QgYWRkcmVzc2VzXG4gICAgICAvLyAoZmlyc3QgJiBsYXN0IElQIGFkZHJlc3Mgb2YgZWFjaCBjbGFzcylcblxuICAgICAgLy8gZmlsdGVyIDEuIHBhcnQgZm9yIDEtMjIzXG4gICAgICAnKD86MjJbMC0zXXwyWzAxXVxcXFxkfFsxLTldXFxcXGQ/fDFcXFxcZFxcXFxkKScgK1xuICAgICAgLy8gZmlsdGVyIDIuIGFuZCAzLiBwYXJ0IGZvciAwLTI1NVxuICAgICAgJyg/OlxcXFwuKD86MjVbMC01XXwyWzAtNF1cXFxcZHwxP1xcXFxkezEsMn0pKXsyfScgK1xuICAgICAgLy8gZmlsdGVyIDQuIHBhcnQgZm9yIDEtMjU0XG4gICAgICAnKD86XFxcXC4oPzoyNVswLTRdfDJbMC00XVxcXFxkfDFcXFxcZFxcXFxkfFsxLTldXFxcXGQ/KSknICtcbiAgICAgICd8JyArXG4gICAgICAvLyBob3N0IG5hbWVcbiAgICAgICcoPzooPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0tKikqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKyknICtcbiAgICAgIC8vIGRvbWFpbiBuYW1lXG4gICAgICAnKD86XFxcXC4oPzpbYS16XFxcXHUwMGExLVxcXFx1ZmZmZjAtOV0tKikqW2EtelxcXFx1MDBhMS1cXFxcdWZmZmYwLTldKykqJyArXG4gICAgICAvLyBUTEQgaWRlbnRpZmllclxuICAgICAgJyg/OlxcXFwuKD86W2EtelxcXFx1MDBhMS1cXFxcdWZmZmZdezIsfSkpJyArXG4gICAgICAnKScgK1xuICAgICAgLy8gcG9ydCBudW1iZXJcbiAgICAgICcoPzo6XFxcXGR7Miw1fSk/JyArXG4gICAgICAvLyByZXNvdXJjZSBwYXRoXG4gICAgICAvLyAgaHR0cHM6Ly9naXRodWIuY29tL2FsaWJhYmEvZm9ybWlseS9kaXNjdXNzaW9ucy8xMzY1XG4gICAgICAnKD86Lz9cXFxcUyopPyQnXG4gICksXG4gIGVtYWlsOiAvXlxcdysoWy0rLl1cXHcrKSpAXFx3KyhbLS5dXFx3KykqXFwuXFx3KyhbLS5dXFx3KykqJC8sXG5cbiAgaXB2NjogL15cXHMqKCgoWzAtOUEtRmEtZl17MSw0fTopezd9KFswLTlBLUZhLWZdezEsNH18OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezZ9KDpbMC05QS1GYS1mXXsxLDR9fCgoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7NX0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSwyfSl8OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7NH0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSwzfSl8KCg6WzAtOUEtRmEtZl17MSw0fSk/OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezN9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsNH0pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsMn06KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7Mn0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw1fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCwzfTooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXsxfSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDZ9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDR9OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCg6KCgoOlswLTlBLUZhLWZdezEsNH0pezEsN30pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsNX06KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSkpKCUuKyk/XFxzKiQvLFxuXG4gIGlwdjQ6IC9eKCgyNVswLTVdfDJbMC00XVswLTldfDFbMC05XXsyfXxbMC05XXsxLDJ9KVxcLil7M30oMjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV17Mn18WzAtOV17MSwyfSkkLyxcblxuICBudW1iZXI6IC9eWystXT9cXGQrKFxcLlxcZCspPyQvLFxuXG4gIGludGVnZXI6IC9eWystXT9cXGQrJC8sXG5cbiAgcXE6IC9eKFxcKz9bMS05XVxcZCp8MCkkLyxcblxuICBwaG9uZTogL15cXGR7M30tXFxkezh9JHxeXFxkezR9LVxcZHs3fSR8XlxcZHsxMX0kLyxcblxuICBpZGNhcmQ6IC9eXFxkezE1fSR8XlxcZHsxN30oXFxkfHh8WCkkLyxcblxuICB0YW9kb21haW46IC9eKGh0dHBzP1xcOik/KFxcL1xcLyk/KFthLXpBLVowLTlcXC5cXC1dK1xcLik/KHRhb2Jhb3x0bWFsbHxhbGl0cmlwfHlhb1xcLjk1MDk1KShcXC5kYWlseSk/XFwuKGNvbXxuZXR8aGsoXFwvaGspPykvLFxuXG4gIG1vbmV5OiAvXihbXFx1MDAyNFxcdTAwQTJcXHUwMEEzXFx1MDBBNFxcdTIwQUNcXHUwMEE1XFx1MjBCMVxcMjBCOVxcdUZGRTVdXFxzKikoXFxkKyw/KStcXC4/XFxkKlxccyokLyxcblxuICB6aDogL15bXFx1NGUwMC1cXHU5ZmE1XSskLyxcblxuICBkYXRlOiAvXig/Oig/OjFbNi05XXxbMi05XVswLTldKVswLTldezJ9KFstLy5dPykoPzooPzowP1sxLTldfDFbMC0yXSlcXDEoPzowP1sxLTldfDFbMC05XXwyWzAtOF0pfCg/OjA/WzEzLTldfDFbMC0yXSlcXDEoPzoyOXwzMCl8KD86MD9bMTM1NzhdfDFbMDJdKVxcMSg/OjMxKSl8KD86KD86MVs2LTldfFsyLTldWzAtOV0pKD86MFs0OF18WzI0NjhdWzA0OF18WzEzNTc5XVsyNl0pfCg/OjE2fFsyNDY4XVswNDhdfFszNTc5XVsyNl0pMDApKFstLy5dPykwPzJcXDIoPzoyOSkpKFxccysoWzAxXVswLTldOnwyWzAtM106KT9bMC01XVswLTldOlswLTVdWzAtOV0pPyQvLFxuXG4gIHppcDogL15bMC05XXs2fSQvXG59XG4iLCJpbXBvcnQgeyBnZXRNZXNzYWdlIH0gZnJvbSAnLi9tZXNzYWdlJ1xuaW1wb3J0IHtcbiAgaXNFbXB0eSxcbiAgaXNWYWxpZCxcbiAgc3RyaW5nTGVuZ3RoLFxuICBpc1N0cixcbiAgaXNBcnIsXG4gIGlzRm4sXG4gIHRvQXJyLFxuICBpc0Jvb2xcbn0gZnJvbSAnQGZvcm1pbHkvc2hhcmVkJ1xuaW1wb3J0IHsgVmFsaWRhdGVEZXNjcmlwdGlvbiwgVmFsaWRhdGVSdWxlc01hcCB9IGZyb20gJy4vdHlwZXMnXG5jb25zdCBpc1ZhbGlkYXRlRW1wdHkgPSAodmFsdWU6IGFueSkgPT4ge1xuICBpZiAoaXNBcnIodmFsdWUpKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGlzVmFsaWQodmFsdWVbaV0pKSByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaXNFbXB0eSh2YWx1ZSlcbiAgfVxufVxuXG5jb25zdCBnZXRMZW5ndGggPSAodmFsdWU6IGFueSkgPT5cbiAgaXNTdHIodmFsdWUpID8gc3RyaW5nTGVuZ3RoKHZhbHVlKSA6IHZhbHVlID8gdmFsdWUubGVuZ3RoIDogMFxuXG5jb25zdCBpbnRlcnNlY3Rpb24gPSAoYXJyMTogc3RyaW5nW10sIGFycjI6IHN0cmluZ1tdKSA9PiB7XG4gIHJldHVybiBhcnIxLmZpbHRlcihrZXkgPT4gYXJyMi5pbmNsdWRlcyhrZXkpKVxufVxuXG5jb25zdCBnZXRSdWxlTWVzc2FnZSA9IChydWxlOiBhbnksIHR5cGU6IHN0cmluZywgcnVsZXM/OiBWYWxpZGF0ZVJ1bGVzTWFwKSA9PiB7XG4gIGNvbnN0IGFsbFJ1bGVLZXlzID0gT2JqZWN0LmtleXMocnVsZXMgfHwge30pXG4gIGNvbnN0IGN1cnJlbnRSdWxlS2V5cyA9IE9iamVjdC5rZXlzKHJ1bGUgfHwge30pXG4gIGlmIChcbiAgICBpc0ZuKHJ1bGUudmFsaWRhdG9yKSB8fFxuICAgIGludGVyc2VjdGlvbihjdXJyZW50UnVsZUtleXMsIGFsbFJ1bGVLZXlzKS5sZW5ndGggPiAyXG4gICkge1xuICAgIGlmIChydWxlLmZvcm1hdCkge1xuICAgICAgcmV0dXJuIHJ1bGUubWVzc2FnZSB8fCBnZXRNZXNzYWdlKHR5cGUpXG4gICAgfVxuICAgIHJldHVybiBnZXRNZXNzYWdlKHR5cGUpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJ1bGUubWVzc2FnZSB8fCBnZXRNZXNzYWdlKHR5cGUpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICByZXF1aXJlZCh2YWx1ZTogYW55LCBydWxlOiBWYWxpZGF0ZURlc2NyaXB0aW9uLCBydWxlczogVmFsaWRhdGVSdWxlc01hcCkge1xuICAgIGlmIChydWxlLnJlcXVpcmVkID09PSBmYWxzZSkgcmV0dXJuICcnXG4gICAgcmV0dXJuIGlzVmFsaWRhdGVFbXB0eSh2YWx1ZSkgPyBnZXRSdWxlTWVzc2FnZShydWxlLCAncmVxdWlyZWQnLCBydWxlcykgOiAnJ1xuICB9LFxuICBtYXgodmFsdWU6IGFueSwgcnVsZTogVmFsaWRhdGVEZXNjcmlwdGlvbiwgcnVsZXM6IFZhbGlkYXRlUnVsZXNNYXApIHtcbiAgICBjb25zdCBsZW5ndGggPSBnZXRMZW5ndGgodmFsdWUpXG4gICAgY29uc3QgbWF4ID0gTnVtYmVyKHJ1bGUubWF4KVxuICAgIHJldHVybiBsZW5ndGggPiBtYXggPyBnZXRSdWxlTWVzc2FnZShydWxlLCAnbWF4JywgcnVsZXMpIDogJydcbiAgfSxcbiAgbWF4aW11bSh2YWx1ZTogYW55LCBydWxlOiBWYWxpZGF0ZURlc2NyaXB0aW9uLCBydWxlczogVmFsaWRhdGVSdWxlc01hcCkge1xuICAgIHJldHVybiBOdW1iZXIodmFsdWUpID4gTnVtYmVyKHJ1bGUubWF4aW11bSlcbiAgICAgID8gZ2V0UnVsZU1lc3NhZ2UocnVsZSwgJ21heGltdW0nLCBydWxlcylcbiAgICAgIDogJydcbiAgfSxcbiAgZXhjbHVzaXZlTWF4aW11bShcbiAgICB2YWx1ZTogYW55LFxuICAgIHJ1bGU6IFZhbGlkYXRlRGVzY3JpcHRpb24sXG4gICAgcnVsZXM6IFZhbGlkYXRlUnVsZXNNYXBcbiAgKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPj0gTnVtYmVyKHJ1bGUuZXhjbHVzaXZlTWF4aW11bSlcbiAgICAgID8gZ2V0UnVsZU1lc3NhZ2UocnVsZSwgJ2V4Y2x1c2l2ZU1heGltdW0nLCBydWxlcylcbiAgICAgIDogJydcbiAgfSxcbiAgbWluaW11bSh2YWx1ZTogYW55LCBydWxlOiBWYWxpZGF0ZURlc2NyaXB0aW9uLCBydWxlczogVmFsaWRhdGVSdWxlc01hcCkge1xuICAgIHJldHVybiBOdW1iZXIodmFsdWUpIDwgTnVtYmVyKHJ1bGUubWluaW11bSlcbiAgICAgID8gZ2V0UnVsZU1lc3NhZ2UocnVsZSwgJ21pbmltdW0nLCBydWxlcylcbiAgICAgIDogJydcbiAgfSxcbiAgZXhjbHVzaXZlTWluaW11bShcbiAgICB2YWx1ZTogYW55LFxuICAgIHJ1bGU6IFZhbGlkYXRlRGVzY3JpcHRpb24sXG4gICAgcnVsZXM6IFZhbGlkYXRlUnVsZXNNYXBcbiAgKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSkgPD0gTnVtYmVyKHJ1bGUuZXhjbHVzaXZlTWluaW11bSlcbiAgICAgID8gZ2V0UnVsZU1lc3NhZ2UocnVsZSwgJ2V4Y2x1c2l2ZU1pbmltdW0nLCBydWxlcylcbiAgICAgIDogJydcbiAgfSxcbiAgbGVuKHZhbHVlOiBhbnksIHJ1bGU6IFZhbGlkYXRlRGVzY3JpcHRpb24sIHJ1bGVzOiBWYWxpZGF0ZVJ1bGVzTWFwKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gZ2V0TGVuZ3RoKHZhbHVlKVxuICAgIGNvbnN0IGxlbiA9IE51bWJlcihydWxlLmxlbilcbiAgICByZXR1cm4gbGVuZ3RoICE9PSBsZW4gPyBnZXRSdWxlTWVzc2FnZShydWxlLCAnbGVuJywgcnVsZXMpIDogJydcbiAgfSxcbiAgbWluKHZhbHVlOiBhbnksIHJ1bGU6IFZhbGlkYXRlRGVzY3JpcHRpb24sIHJ1bGVzOiBWYWxpZGF0ZVJ1bGVzTWFwKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gZ2V0TGVuZ3RoKHZhbHVlKVxuICAgIGNvbnN0IG1pbiA9IE51bWJlcihydWxlLm1pbilcbiAgICByZXR1cm4gbGVuZ3RoIDwgbWluID8gZ2V0UnVsZU1lc3NhZ2UocnVsZSwgJ21pbicsIHJ1bGVzKSA6ICcnXG4gIH0sXG4gIHBhdHRlcm4odmFsdWU6IGFueSwgcnVsZTogVmFsaWRhdGVEZXNjcmlwdGlvbiwgcnVsZXM6IFZhbGlkYXRlUnVsZXNNYXApIHtcbiAgICBpZiAoaXNWYWxpZGF0ZUVtcHR5KHZhbHVlKSkgcmV0dXJuICcnXG4gICAgcmV0dXJuICFuZXcgUmVnRXhwKHJ1bGUucGF0dGVybikudGVzdCh2YWx1ZSlcbiAgICAgID8gZ2V0UnVsZU1lc3NhZ2UocnVsZSwgJ3BhdHRlcm4nLCBydWxlcylcbiAgICAgIDogJydcbiAgfSxcbiAgYXN5bmMgdmFsaWRhdG9yKFxuICAgIHZhbHVlOiBhbnksXG4gICAgcnVsZTogVmFsaWRhdGVEZXNjcmlwdGlvbixcbiAgICBydWxlczogVmFsaWRhdGVSdWxlc01hcFxuICApIHtcbiAgICBpZiAoaXNGbihydWxlLnZhbGlkYXRvcikpIHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgUHJvbWlzZS5yZXNvbHZlKHJ1bGUudmFsaWRhdG9yKHZhbHVlLCBydWxlLCBydWxlcykpXG4gICAgICBpZiAoaXNCb29sKHJlc3BvbnNlKSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UgPyBydWxlLm1lc3NhZ2UgOiAnJ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlIHx8ICcnXG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBydWxlJ3MgdmFsaWRhdG9yIHByb3BlcnR5IG11c3QgYmUgYSBmdW5jdGlvbi5cIilcbiAgfSxcbiAgd2hpdGVzcGFjZSh2YWx1ZTogYW55LCBydWxlOiBWYWxpZGF0ZURlc2NyaXB0aW9uLCBydWxlczogVmFsaWRhdGVSdWxlc01hcCkge1xuICAgIGlmIChydWxlLndoaXRlc3BhY2UpIHtcbiAgICAgIHJldHVybiAvXlxccyskLy50ZXN0KHZhbHVlKVxuICAgICAgICA/IGdldFJ1bGVNZXNzYWdlKHJ1bGUsICd3aGl0ZXNwYWNlJywgcnVsZXMpXG4gICAgICAgIDogJydcbiAgICB9XG4gIH0sXG4gIGVudW0odmFsdWU6IGFueSwgcnVsZTogVmFsaWRhdGVEZXNjcmlwdGlvbiwgcnVsZXM6IFZhbGlkYXRlUnVsZXNNYXApIHtcbiAgICBjb25zdCBlbnVtcyA9IHRvQXJyKHJ1bGUuZW51bSlcbiAgICByZXR1cm4gZW51bXMuaW5kZXhPZih2YWx1ZSkgPT09IC0xXG4gICAgICA/IGdldFJ1bGVNZXNzYWdlKHJ1bGUsICdlbnVtJywgcnVsZXMpXG4gICAgICA6ICcnXG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIFZhbGlkYXRvck9wdGlvbnMsXG4gIFZhbGlkYXRlTm9kZU1hcCxcbiAgVmFsaWRhdGVQYXR0ZXJuUnVsZXMsXG4gIFZhbGlkYXRlUnVsZXMsXG4gIFZhbGlkYXRlRm9ybWF0c01hcCxcbiAgVmFsaWRhdGVSdWxlc01hcCxcbiAgVmFsaWRhdGVSZXNwb25zZSxcbiAgVmFsaWRhdGVEZXNjcmlwdGlvbixcbiAgVmFsaWRhdGVGaWVsZE9wdGlvbnMsXG4gIFZhbGlkYXRlQ2FsY3VsYXRvcixcbiAgVmFsaWRhdGVOb2RlLFxuICBWYWxpZGF0ZU5vZGVSZXN1bHQsXG4gIFN5bmNWYWxpZGF0ZVJlc3BvbnNlXG59IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQge1xuICBpc0ZuLFxuICBpc1N0cixcbiAgaXNBcnIsXG4gIGlzT2JqLFxuICBpc1ZhbGlkLFxuICBlYWNoLFxuICBsb2csXG4gIHJlZHVjZSxcbiAgRm9ybVBhdGgsXG4gIEZvcm1QYXRoUGF0dGVyblxufSBmcm9tICdAZm9ybWlseS9zaGFyZWQnXG5pbXBvcnQgeyBnZXRNZXNzYWdlIH0gZnJvbSAnLi9tZXNzYWdlJ1xuaW1wb3J0IGRlZmF1bHRGb3JtYXRzIGZyb20gJy4vZm9ybWF0cydcbmltcG9ydCBkZWZhdWx0UnVsZXMgZnJvbSAnLi9ydWxlcydcblxuLy/moKHpqozop4TliJnpm4blkIhcbmNvbnN0IFZhbGlkYXRvclJ1bGVzOiBWYWxpZGF0ZVJ1bGVzTWFwID0ge31cblxuLy/moKHpqozmoLzlvI/pm4blkIhcbmNvbnN0IFZhbGlkYXRvckZvcm1hdG9yczogVmFsaWRhdGVGb3JtYXRzTWFwID0ge31cblxuLy/mqKHmnb/lvJXmk45cbmNvbnN0IHRlbXBsYXRlID0gKG1lc3NhZ2U6IFN5bmNWYWxpZGF0ZVJlc3BvbnNlLCBjb250ZXh0OiBhbnkpOiBzdHJpbmcgPT4ge1xuICBpZiAoaXNTdHIobWVzc2FnZSkpIHtcbiAgICBpZiAoaXNGbihGb3JtVmFsaWRhdG9yLnRlbXBsYXRlKSkge1xuICAgICAgcmV0dXJuIEZvcm1WYWxpZGF0b3IudGVtcGxhdGUobWVzc2FnZSwgY29udGV4dClcbiAgICB9XG4gICAgcmV0dXJuIG1lc3NhZ2UucmVwbGFjZSgvXFx7XFx7XFxzKihbXFx3Ll0rKVxccypcXH1cXH0vZywgKF8sICQwKSA9PiB7XG4gICAgICByZXR1cm4gRm9ybVBhdGguZ2V0SW4oY29udGV4dCwgJDApXG4gICAgfSlcbiAgfSBlbHNlIGlmIChpc09iaihtZXNzYWdlKSAmJiAhbWVzc2FnZVsnJCR0eXBlb2YnXSAmJiAhbWVzc2FnZVsnX293bmVyJ10pIHtcbiAgICByZXR1cm4gdGVtcGxhdGUobWVzc2FnZS5tZXNzYWdlLCBjb250ZXh0KVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBtZXNzYWdlIGFzIGFueVxuICB9XG59XG5cbmNsYXNzIEZvcm1WYWxpZGF0b3Ige1xuICBwcml2YXRlIHZhbGlkYXRlRmlyc3Q6IGJvb2xlYW5cbiAgcHJpdmF0ZSBub2RlczogVmFsaWRhdGVOb2RlTWFwXG4gIHByaXZhdGUgbWF0Y2hTdHJhdGVneTogVmFsaWRhdG9yT3B0aW9uc1snbWF0Y2hTdHJhdGVneSddXG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogVmFsaWRhdG9yT3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy52YWxpZGF0ZUZpcnN0ID0gb3B0aW9ucy52YWxpZGF0ZUZpcnN0XG4gICAgdGhpcy5tYXRjaFN0cmF0ZWd5ID0gb3B0aW9ucy5tYXRjaFN0cmF0ZWd5XG4gICAgdGhpcy5ub2RlcyA9IHt9XG4gIH1cblxuICB0cmFuc2Zvcm1SdWxlcyhydWxlczogVmFsaWRhdGVQYXR0ZXJuUnVsZXMpIHtcbiAgICBpZiAoaXNTdHIocnVsZXMpKSB7XG4gICAgICBpZiAoIVZhbGlkYXRvckZvcm1hdG9yc1tydWxlc10pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGZvdW5kIHZhbGlkYXRvciBwYXR0ZXJuJylcbiAgICAgIH1cbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwYXR0ZXJuOiBWYWxpZGF0b3JGb3JtYXRvcnNbcnVsZXNdLFxuICAgICAgICAgIG1lc3NhZ2U6IGdldE1lc3NhZ2UocnVsZXMpIHx8ICdDYW4gbm90IGZvdW5kIHZhbGlkYXRvciBtZXNzYWdlLidcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0gZWxzZSBpZiAoaXNGbihydWxlcykpIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICB2YWxpZGF0b3I6IHJ1bGVzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9IGVsc2UgaWYgKGlzQXJyKHJ1bGVzKSkge1xuICAgICAgcmV0dXJuIHJ1bGVzLnJlZHVjZSgoYnVmOiBhbnksIHJ1bGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ1Zi5jb25jYXQodGhpcy50cmFuc2Zvcm1SdWxlcyhydWxlKSlcbiAgICAgIH0sIFtdKVxuICAgIH0gZWxzZSBpZiAoaXNPYmoocnVsZXMpKSB7XG4gICAgICBpZiAocnVsZXMuZm9ybWF0KSB7XG4gICAgICAgIGlmICghVmFsaWRhdG9yRm9ybWF0b3JzW3J1bGVzLmZvcm1hdF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgZm91bmQgdmFsaWRhdG9yIHBhdHRlcm4nKVxuICAgICAgICB9XG4gICAgICAgIHJ1bGVzLnBhdHRlcm4gPSBWYWxpZGF0b3JGb3JtYXRvcnNbcnVsZXMuZm9ybWF0XVxuICAgICAgICBydWxlcy5tZXNzYWdlID0gcnVsZXMubWVzc2FnZSB8fCBnZXRNZXNzYWdlKHJ1bGVzLmZvcm1hdClcbiAgICAgIH1cbiAgICAgIHJldHVybiBbcnVsZXNdXG4gICAgfVxuICAgIHJldHVybiBbXVxuICB9XG5cbiAgYXN5bmMgaW50ZXJuYWxWYWxpZGF0ZShcbiAgICB2YWx1ZTogYW55LFxuICAgIHJ1bGVzOiBWYWxpZGF0ZVJ1bGVzLFxuICAgIG9wdGlvbnM6IFZhbGlkYXRlRmllbGRPcHRpb25zID0ge31cbiAgKTogUHJvbWlzZTx7XG4gICAgZXJyb3JzOiBzdHJpbmdbXVxuICAgIHdhcm5pbmdzOiBzdHJpbmdbXVxuICB9PiB7XG4gICAgY29uc3QgZmlyc3QgPSBpc1ZhbGlkKG9wdGlvbnMuZmlyc3QpXG4gICAgICA/ICEhb3B0aW9ucy5maXJzdFxuICAgICAgOiAhIXRoaXMudmFsaWRhdGVGaXJzdFxuICAgIGNvbnN0IGVycm9yczogc3RyaW5nW10gPSBbXVxuICAgIGNvbnN0IHdhcm5pbmdzID0gW11cbiAgICB0cnkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBydWxlT2JqID0gcnVsZXNbaV1cbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHJ1bGVPYmopLnNvcnQoa2V5ID0+XG4gICAgICAgICAga2V5ID09PSAndmFsaWRhdG9yJyA/IDEgOiAtMVxuICAgICAgICApXG4gICAgICAgIGZvciAobGV0IGwgPSAwOyBsIDwga2V5cy5sZW5ndGg7IGwrKykge1xuICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbbF1cbiAgICAgICAgICBpZiAocnVsZU9iai5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGlzVmFsaWQocnVsZU9ialtrZXldKSkge1xuICAgICAgICAgICAgY29uc3QgcnVsZSA9IFZhbGlkYXRvclJ1bGVzW2tleV1cbiAgICAgICAgICAgIGlmIChydWxlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCBydWxlKHZhbHVlLCBydWxlT2JqLCBWYWxpZGF0b3JSdWxlcylcbiAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRlbXBsYXRlKHBheWxvYWQsIHtcbiAgICAgICAgICAgICAgICAuLi5ydWxlT2JqLFxuICAgICAgICAgICAgICAgIHJ1bGU6IHJ1bGVPYmosXG4gICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGlzU3RyKHBheWxvYWQpIHx8XG4gICAgICAgICAgICAgICAgKHBheWxvYWRbJyQkdHlwZW9mJ10gJiYgcGF5bG9hZFsnX293bmVyJ10pXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2gobWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlKSBlcnJvcnMucHVzaChtZXNzYWdlKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzT2JqKHBheWxvYWQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQudHlwZSA9PT0gJ3dhcm5pbmcnKSB7XG4gICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSkgd2FybmluZ3MucHVzaChtZXNzYWdlKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChtZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZSkgZXJyb3JzLnB1c2gobWVzc2FnZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVycm9ycyxcbiAgICAgICAgd2FybmluZ3NcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBlcnJvcnMsXG4gICAgICAgIHdhcm5pbmdzXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgdmFsaWRhdGVOb2RlcyhcbiAgICBwYXR0ZXJuOiBGb3JtUGF0aCxcbiAgICBvcHRpb25zOiBWYWxpZGF0ZUZpZWxkT3B0aW9uc1xuICApOiBQcm9taXNlPFZhbGlkYXRlTm9kZVJlc3VsdD4ge1xuICAgIGxldCBlcnJvcnMgPSBbXVxuICAgIGxldCB3YXJuaW5ncyA9IFtdXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG5vZGVLZXkgPSBwYXR0ZXJuLnRvU3RyaW5nKClcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVzW25vZGVLZXldXG4gICAgICBjb25zdCBtYXRjaE5vZGVzID0gbm9kZSA/IHsgW25vZGVLZXldOiBub2RlIH0gOiB0aGlzLm5vZGVzXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgcmVkdWNlPFZhbGlkYXRlTm9kZU1hcCwgVmFsaWRhdGVOb2RlPihcbiAgICAgICAgICBtYXRjaE5vZGVzLFxuICAgICAgICAgIChidWYsIHZhbGlkYXRvciwgcGF0aCkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBpc0ZuKHRoaXMubWF0Y2hTdHJhdGVneSlcbiAgICAgICAgICAgICAgICA/IHRoaXMubWF0Y2hTdHJhdGVneShwYXR0ZXJuLCBwYXRoKVxuICAgICAgICAgICAgICAgIDogcGF0dGVybi5tYXRjaChwYXRoKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBidWYuY29uY2F0KFxuICAgICAgICAgICAgICAgIHZhbGlkYXRvcihvcHRpb25zKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gZXJyb3JzLmNvbmNhdCh7XG4gICAgICAgICAgICAgICAgICAgICAgcGF0aDogcGF0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiByZXN1bHQuZXJyb3JzXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lndhcm5pbmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB3YXJuaW5ncyA9IHdhcm5pbmdzLmNvbmNhdCh7XG4gICAgICAgICAgICAgICAgICAgICAgcGF0aDogcGF0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiByZXN1bHQud2FybmluZ3NcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYnVmXG4gICAgICAgICAgfSxcbiAgICAgICAgICBbXVxuICAgICAgICApXG4gICAgICApXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlcnJvcnMsXG4gICAgICAgIHdhcm5pbmdzXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihlcnJvcilcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVycm9ycyxcbiAgICAgICAgd2FybmluZ3NcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB2YWxpZGF0ZSA9IChcbiAgICBwYXRoPzogRm9ybVBhdGhQYXR0ZXJuLFxuICAgIG9wdGlvbnM/OiBWYWxpZGF0ZUZpZWxkT3B0aW9uc1xuICApOiBQcm9taXNlPFZhbGlkYXRlTm9kZVJlc3VsdD4gPT4ge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBGb3JtUGF0aC5nZXRQYXRoKHBhdGggfHwgJyonKVxuICAgIHJldHVybiB0aGlzLnZhbGlkYXRlTm9kZXMocGF0dGVybiwgb3B0aW9ucylcbiAgfVxuXG4gIHJlZ2lzdGVyID0gKHBhdGg6IEZvcm1QYXRoUGF0dGVybiwgY2FsY3VsYXRvcjogVmFsaWRhdGVDYWxjdWxhdG9yKSA9PiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IEZvcm1QYXRoLmdldFBhdGgocGF0aClcbiAgICB0aGlzLm5vZGVzW25ld1BhdGgudG9TdHJpbmcoKV0gPSAob3B0aW9uczogVmFsaWRhdGVGaWVsZE9wdGlvbnMpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCB0bXBSZXN1bHQ6IGFueVxuICAgICAgICBjb25zdCB2YWxpZGF0ZSA9IGFzeW5jICh2YWx1ZTogYW55LCBydWxlczogVmFsaWRhdGVQYXR0ZXJuUnVsZXMpID0+IHtcbiAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIGtleTogbmV3UGF0aC50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLmludGVybmFsVmFsaWRhdGUoXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtUnVsZXMocnVsZXMpLFxuICAgICAgICAgICAgZGF0YVxuICAgICAgICAgICkudGhlbihcbiAgICAgICAgICAgIHBheWxvYWQgPT4ge1xuICAgICAgICAgICAgICB0bXBSZXN1bHQgPSBwYXlsb2FkXG4gICAgICAgICAgICAgIHJldHVybiBwYXlsb2FkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF5bG9hZCA9PiB7XG4gICAgICAgICAgICAgIHRtcFJlc3VsdCA9IHBheWxvYWRcbiAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHBheWxvYWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShjYWxjdWxhdG9yKHZhbGlkYXRlKSkudGhlbihcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHRtcFJlc3VsdClcbiAgICAgICAgICB9LFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdCh0bXBSZXN1bHQpXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHVucmVnaXN0ZXIgPSAocGF0aDogRm9ybVBhdGhQYXR0ZXJuKSA9PiB7XG4gICAgY29uc3QgbmV3UGF0aCA9IEZvcm1QYXRoLmdldFBhdGgocGF0aClcbiAgICBkZWxldGUgdGhpcy5ub2Rlc1tuZXdQYXRoLnRvU3RyaW5nKCldXG4gIH1cblxuICBzdGF0aWMgdGVtcGxhdGU6IChcbiAgICBtZXNzYWdlOiBWYWxpZGF0ZVJlc3BvbnNlLFxuICAgIGRhdGE6IFZhbGlkYXRlRGVzY3JpcHRpb24gJiB7IHZhbHVlOiBhbnk7IGtleTogc3RyaW5nIH1cbiAgKSA9PiBzdHJpbmdcblxuICAvL+azqOWGjOmAmueUqOinhOWImVxuICBzdGF0aWMgcmVnaXN0ZXJSdWxlcyhydWxlczogVmFsaWRhdGVSdWxlc01hcCkge1xuICAgIGVhY2gocnVsZXMsIChydWxlLCBrZXkpID0+IHtcbiAgICAgIGlmIChpc0ZuKHJ1bGUpKSB7XG4gICAgICAgIFZhbGlkYXRvclJ1bGVzW2tleV0gPSBydWxlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICAvKipcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2FsaWJhYmEvZm9ybWlseS9pc3N1ZXMvMjE1XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtWYWxpZGF0ZUZvcm1hdHNNYXB9IGZvcm1hdHNcbiAgICogQG1lbWJlcm9mIEZvcm1WYWxpZGF0b3JcbiAgICovXG4gIHN0YXRpYyByZWdpc3RlckZvcm1hdHMoZm9ybWF0czogVmFsaWRhdGVGb3JtYXRzTWFwKSB7XG4gICAgZWFjaChmb3JtYXRzLCAocGF0dGVybiwga2V5KSA9PiB7XG4gICAgICBpZiAoaXNTdHIocGF0dGVybikgfHwgcGF0dGVybiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICBWYWxpZGF0b3JGb3JtYXRvcnNba2V5XSA9IG5ldyBSZWdFeHAocGF0dGVybilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy/ms6jlhozmoKHpqozmtojmga/mqKHmnb/lvJXmk45cbiAgc3RhdGljIHJlZ2lzdGVyTVRFbmdpbmUgPSB0ZW1wbGF0ZSA9PiB7XG4gICAgaWYgKGlzRm4odGVtcGxhdGUpKSB7XG4gICAgICBGb3JtVmFsaWRhdG9yLnRlbXBsYXRlID0gdGVtcGxhdGVcbiAgICB9XG4gIH1cbn1cblxuRm9ybVZhbGlkYXRvci5yZWdpc3RlckZvcm1hdHMoZGVmYXVsdEZvcm1hdHMpXG5Gb3JtVmFsaWRhdG9yLnJlZ2lzdGVyUnVsZXMoZGVmYXVsdFJ1bGVzKVxuXG5leHBvcnQgeyBGb3JtVmFsaWRhdG9yIH1cbiJdLCJuYW1lcyI6WyJkZWVwbWVyZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0JBQWU7TUFDZixFQUFFLEVBQUUsRUFBRTtNQUNOLElBQUksT0FBTyxFQUFFLHdDQUF3QztNQUNyRCxJQUFJLFFBQVEsRUFBRSx3QkFBd0I7TUFDdEMsSUFBSSxNQUFNLEVBQUUsNEJBQTRCO01BQ3hDLElBQUksT0FBTyxFQUFFLHFDQUFxQztNQUNsRCxJQUFJLEdBQUcsRUFBRSw2QkFBNkI7TUFDdEMsSUFBSSxLQUFLLEVBQUUsa0NBQWtDO01BQzdDLElBQUksSUFBSSxFQUFFLGlDQUFpQztNQUMzQyxJQUFJLElBQUksRUFBRSxpQ0FBaUM7TUFDM0MsSUFBSSxNQUFNLEVBQUUsb0NBQW9DO01BQ2hELElBQUksU0FBUyxFQUFFLDBDQUEwQztNQUN6RCxJQUFJLEVBQUUsRUFBRSxzQ0FBc0M7TUFDOUMsSUFBSSxLQUFLLEVBQUUseUNBQXlDO01BQ3BELElBQUksS0FBSyxFQUFFLHFDQUFxQztNQUNoRCxJQUFJLEVBQUUsRUFBRSxvQ0FBb0M7TUFDNUMsSUFBSSxJQUFJLEVBQUUsdUNBQXVDO01BQ2pELElBQUksR0FBRyxFQUFFLGdDQUFnQztNQUN6QyxJQUFJLEdB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
