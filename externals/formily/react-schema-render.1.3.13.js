System.register(['@formily/react', 'react', '@formily/validator', '@formily/shared'], (function (exports) {
	'use strict';
	var _starExcludes = {
		FormComponentsContext: 1,
		FormExpressionScopeContext: 1,
		FormSchemaContext: 1,
		FormSlot: 1,
		JSONCondition: 1,
		MarkupContext: 1,
		Schema: 1,
		SchemaField: 1,
		SchemaFieldPropsContext: 1,
		SchemaForm: 1,
		SchemaMarkupField: 1,
		SchemaMarkupForm: 1,
		cleanRegistry: 1,
		complieExpression: 1,
		connect: 1,
		createAsyncFormActions: 1,
		createControllerBox: 1,
		createFormActions: 1,
		createVirtualBox: 1,
		getRegistry: 1,
		parseLinkages: 1,
		registerFieldMiddleware: 1,
		registerFormComponent: 1,
		registerFormField: 1,
		registerFormFields: 1,
		registerFormItemComponent: 1,
		registerPreviewTextComponent: 1,
		registerVirtualBox: 1,
		useSchemaForm: 1,
		useSchemaProps: 1,
		useValueLinkageEffect: 1,
		'default': 1,
		BigData: 1,
		FormConsumer: 1,
		FormEffectHooks: 1,
		FormPath: 1,
		FormPathPattern: 1,
		FormProvider: 1,
		FormSpy: 1,
		InternalField: 1,
		InternalFieldList: 1,
		InternalForm: 1,
		InternalVirtualField: 1,
		createEffectHook: 1,
		registerValidationFormats: 1,
		registerValidationMTEngine: 1,
		registerValidationRules: 1,
		setValidationLanguage: 1,
		setValidationLocale: 1,
		useField: 1,
		useFieldState: 1,
		useForm: 1,
		useFormEffects: 1,
		useFormQuery: 1,
		useFormSpy: 1,
		useFormState: 1,
		useVirtualField: 1
	};
	var createFormActions$1, createAsyncFormActions$1, useLayout, FormEffectHooks, useForm, Field, VirtualField, Form, React, useRef, useMemo, createElement, createContext, useContext, Fragment, getMessage, each, FormPath, isEmpty$2, isArr, isValid, toArr, isEqual, isBool, deprecate, map$2, lowercase, reduce$2, isFn$1, log, defaults, isStr, isPlainObj, BigData, merge$4, globalThisPolyfill;
	return {
		setters: [function (module) {
			createFormActions$1 = module.createFormActions;
			createAsyncFormActions$1 = module.createAsyncFormActions;
			useLayout = module.useLayout;
			FormEffectHooks = module.FormEffectHooks;
			useForm = module.useForm;
			Field = module.Field;
			VirtualField = module.VirtualField;
			Form = module.Form;
			var setter = { BigData: module.BigData, FormConsumer: module.FormConsumer, FormEffectHooks: module.FormEffectHooks, FormPath: module.FormPath, FormPathPattern: module.FormPathPattern, FormProvider: module.FormProvider, FormSpy: module.FormSpy, InternalField: module.Field, InternalFieldList: module.FieldList, InternalForm: module.Form, InternalVirtualField: module.VirtualField, createEffectHook: module.createEffectHook, registerValidationFormats: module.registerValidationFormats, registerValidationMTEngine: module.registerValidationMTEngine, registerValidationRules: module.registerValidationRules, setValidationLanguage: module.setValidationLanguage, setValidationLocale: module.setValidationLocale, useField: module.useField, useFieldState: module.useFieldState, useForm: module.useForm, useFormEffects: module.useFormEffects, useFormQuery: module.useFormQuery, useFormSpy: module.useFormSpy, useFormState: module.useFormState, useVirtualField: module.useVirtualField };
			for (var name in module) {
				if (!_starExcludes[name]) setter[name] = module[name];
			}
			exports(setter);
		}, function (module) {
			React = module["default"];
			useRef = module.useRef;
			useMemo = module.useMemo;
			createElement = module.createElement;
			createContext = module.createContext;
			useContext = module.useContext;
			Fragment = module.Fragment;
		}, function (module) {
			getMessage = module.getMessage;
		}, function (module) {
			each = module.each;
			FormPath = module.FormPath;
			isEmpty$2 = module.isEmpty;
			isArr = module.isArr;
			isValid = module.isValid;
			toArr = module.toArr;
			isEqual = module.isEqual;
			isBool = module.isBool;
			deprecate = module.deprecate;
			map$2 = module.map;
			lowercase = module.lowercase;
			reduce$2 = module.reduce;
			isFn$1 = module.isFn;
			log = module.log;
			defaults = module.defaults;
			isStr = module.isStr;
			isPlainObj = module.isPlainObj;
			BigData = module.BigData;
			merge$4 = module.merge;
			globalThisPolyfill = module.globalThisPolyfill;
		}],
		execute: (function () {

			exports({
				createControllerBox: createControllerBox,
				createVirtualBox: createVirtualBox,
				registerFormComponent: registerFormComponent,
				registerFormField: registerFormField,
				registerFormFields: registerFormFields,
				registerFormItemComponent: registerFormItemComponent,
				registerPreviewTextComponent: registerPreviewTextComponent,
				registerVirtualBox: registerVirtualBox
			});

			var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

			var Subject$3 = {};

			var Subject$2 = {};

			var rxjs = {};

			var Observable$1 = {};

			var canReportError$1 = {};

			var Subscriber$1 = {};

			var isFunction$1 = {};

			Object.defineProperty(isFunction$1, "__esModule", { value: true });
			function isFunction(x) {
			    return typeof x === 'function';
			}
			isFunction$1.isFunction = isFunction;

			var Observer = {};

			var config = {};

			Object.defineProperty(config, "__esModule", { value: true });
			var _enable_super_gross_mode_that_will_cause_bad_things = false;
			config.config = {
			    Promise: undefined,
			    set useDeprecatedSynchronousErrorHandling(value) {
			        if (value) {
			            var error = new Error();
			            console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
			        }
			        else if (_enable_super_gross_mode_that_will_cause_bad_things) {
			            console.log('RxJS: Back to a better error behavior. Thank you. <3');
			        }
			        _enable_super_gross_mode_that_will_cause_bad_things = value;
			    },
			    get useDeprecatedSynchronousErrorHandling() {
			        return _enable_super_gross_mode_that_will_cause_bad_things;
			    },
			};

			var hostReportError$1 = {};

			Object.defineProperty(hostReportError$1, "__esModule", { value: true });
			function hostReportError(err) {
			    setTimeout(function () { throw err; }, 0);
			}
			hostReportError$1.hostReportError = hostReportError;

			Object.defineProperty(Observer, "__esModule", { value: true });
			var config_1$3 = config;
			var hostReportError_1$2 = hostReportError$1;
			Observer.empty = {
			    closed: true,
			    next: function (value) { },
			    error: function (err) {
			        if (config_1$3.config.useDeprecatedSynchronousErrorHandling) {
			            throw err;
			        }
			        else {
			            hostReportError_1$2.hostReportError(err);
			        }
			    },
			    complete: function () { }
			};

			var Subscription$1 = {};

			var isArray = {};

			Object.defineProperty(isArray, "__esModule", { value: true });
			isArray.isArray = (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

			var isObject$1 = {};

			Object.defineProperty(isObject$1, "__esModule", { value: true });
			function isObject(x) {
			    return x !== null && typeof x === 'object';
			}
			isObject$1.isObject = isObject;

			var UnsubscriptionError = {};

			Object.defineProperty(UnsubscriptionError, "__esModule", { value: true });
			var UnsubscriptionErrorImpl = (function () {
			    function UnsubscriptionErrorImpl(errors) {
			        Error.call(this);
			        this.message = errors ?
			            errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
			        this.name = 'UnsubscriptionError';
			        this.errors = errors;
			        return this;
			    }
			    UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
			    return UnsubscriptionErrorImpl;
			})();
			UnsubscriptionError.UnsubscriptionError = UnsubscriptionErrorImpl;

			Object.defineProperty(Subscription$1, "__esModule", { value: true });
			var isArray_1$d = isArray;
			var isObject_1$2 = isObject$1;
			var isFunction_1$4 = isFunction$1;
			var UnsubscriptionError_1$1 = UnsubscriptionError;
			var Subscription = (function () {
			    function Subscription(unsubscribe) {
			        this.closed = false;
			        this._parentOrParents = null;
			        this._subscriptions = null;
			        if (unsubscribe) {
			            this._ctorUnsubscribe = true;
			            this._unsubscribe = unsubscribe;
			        }
			    }
			    Subscription.prototype.unsubscribe = function () {
			        var errors;
			        if (this.closed) {
			            return;
			        }
			        var _a = this, _parentOrParents = _a._parentOrParents, _ctorUnsubscribe = _a._ctorUnsubscribe, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
			        this.closed = true;
			        this._parentOrParents = null;
			        this._subscriptions = null;
			        if (_parentOrParents instanceof Subscription) {
			            _parentOrParents.remove(this);
			        }
			        else if (_parentOrParents !== null) {
			            for (var index = 0; index < _parentOrParents.length; ++index) {
			                var parent_1 = _parentOrParents[index];
			                parent_1.remove(this);
			            }
			        }
			        if (isFunction_1$4.isFunction(_unsubscribe)) {
			            if (_ctorUnsubscribe) {
			                this._unsubscribe = undefined;
			            }
			            try {
			                _unsubscribe.call(this);
			            }
			            catch (e) {
			                errors = e instanceof UnsubscriptionError_1$1.UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
			            }
			        }
			        if (isArray_1$d.isArray(_subscriptions)) {
			            var index = -1;
			            var len = _subscriptions.length;
			            while (++index < len) {
			                var sub = _subscriptions[index];
			                if (isObject_1$2.isObject(sub)) {
			                    try {
			                        sub.unsubscribe();
			                    }
			                    catch (e) {
			                        errors = errors || [];
			                        if (e instanceof UnsubscriptionError_1$1.UnsubscriptionError) {
			                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
			                        }
			                        else {
			                            errors.push(e);
			                        }
			                    }
			                }
			            }
			        }
			        if (errors) {
			            throw new UnsubscriptionError_1$1.UnsubscriptionError(errors);
			        }
			    };
			    Subscription.prototype.add = function (teardown) {
			        var subscription = teardown;
			        if (!teardown) {
			            return Subscription.EMPTY;
			        }
			        switch (typeof teardown) {
			            case 'function':
			                subscription = new Subscription(teardown);
			            case 'object':
			                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
			                    return subscription;
			                }
			                else if (this.closed) {
			                    subscription.unsubscribe();
			                    return subscription;
			                }
			                else if (!(subscription instanceof Subscription)) {
			                    var tmp = subscription;
			                    subscription = new Subscription();
			                    subscription._subscriptions = [tmp];
			                }
			                break;
			            default: {
			                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
			            }
			        }
			        var _parentOrParents = subscription._parentOrParents;
			        if (_parentOrParents === null) {
			            subscription._parentOrParents = this;
			        }
			        else if (_parentOrParents instanceof Subscription) {
			            if (_parentOrParents === this) {
			                return subscription;
			            }
			            subscription._parentOrParents = [_parentOrParents, this];
			        }
			        else if (_parentOrParents.indexOf(this) === -1) {
			            _parentOrParents.push(this);
			        }
			        else {
			            return subscription;
			        }
			        var subscriptions = this._subscriptions;
			        if (subscriptions === null) {
			            this._subscriptions = [subscription];
			        }
			        else {
			            subscriptions.push(subscription);
			        }
			        return subscription;
			    };
			    Subscription.prototype.remove = function (subscription) {
			        var subscriptions = this._subscriptions;
			        if (subscriptions) {
			            var subscriptionIndex = subscriptions.indexOf(subscription);
			            if (subscriptionIndex !== -1) {
			                subscriptions.splice(subscriptionIndex, 1);
			            }
			        }
			    };
			    Subscription.EMPTY = (function (empty) {
			        empty.closed = true;
			        return empty;
			    }(new Subscription()));
			    return Subscription;
			}());
			Subscription$1.Subscription = Subscription;
			function flattenUnsubscriptionErrors(errors) {
			    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1$1.UnsubscriptionError) ? err.errors : err); }, []);
			}

			var rxSubscriber = {};

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.rxSubscriber = (function () {
			    return typeof Symbol === 'function'
			        ? Symbol('rxSubscriber')
			        : '@@rxSubscriber_' + Math.random();
			})();
			exports.$$rxSubscriber = exports.rxSubscriber;

			}(rxSubscriber));

			var __extends$1m = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(Subscriber$1, "__esModule", { value: true });
			var isFunction_1$3 = isFunction$1;
			var Observer_1$1 = Observer;
			var Subscription_1$h = Subscription$1;
			var rxSubscriber_1$2 = rxSubscriber;
			var config_1$2 = config;
			var hostReportError_1$1 = hostReportError$1;
			var Subscriber = (function (_super) {
			    __extends$1m(Subscriber, _super);
			    function Subscriber(destinationOrNext, error, complete) {
			        var _this = _super.call(this) || this;
			        _this.syncErrorValue = null;
			        _this.syncErrorThrown = false;
			        _this.syncErrorThrowable = false;
			        _this.isStopped = false;
			        switch (arguments.length) {
			            case 0:
			                _this.destination = Observer_1$1.empty;
			                break;
			            case 1:
			                if (!destinationOrNext) {
			                    _this.destination = Observer_1$1.empty;
			                    break;
			                }
			                if (typeof destinationOrNext === 'object') {
			                    if (destinationOrNext instanceof Subscriber) {
			                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
			                        _this.destination = destinationOrNext;
			                        destinationOrNext.add(_this);
			                    }
			                    else {
			                        _this.syncErrorThrowable = true;
			                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
			                    }
			                    break;
			                }
			            default:
			                _this.syncErrorThrowable = true;
			                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
			                break;
			        }
			        return _this;
			    }
			    Subscriber.prototype[rxSubscriber_1$2.rxSubscriber] = function () { return this; };
			    Subscriber.create = function (next, error, complete) {
			        var subscriber = new Subscriber(next, error, complete);
			        subscriber.syncErrorThrowable = false;
			        return subscriber;
			    };
			    Subscriber.prototype.next = function (value) {
			        if (!this.isStopped) {
			            this._next(value);
			        }
			    };
			    Subscriber.prototype.error = function (err) {
			        if (!this.isStopped) {
			            this.isStopped = true;
			            this._error(err);
			        }
			    };
			    Subscriber.prototype.complete = function () {
			        if (!this.isStopped) {
			            this.isStopped = true;
			            this._complete();
			        }
			    };
			    Subscriber.prototype.unsubscribe = function () {
			        if (this.closed) {
			            return;
			        }
			        this.isStopped = true;
			        _super.prototype.unsubscribe.call(this);
			    };
			    Subscriber.prototype._next = function (value) {
			        this.destination.next(value);
			    };
			    Subscriber.prototype._error = function (err) {
			        this.destination.error(err);
			        this.unsubscribe();
			    };
			    Subscriber.prototype._complete = function () {
			        this.destination.complete();
			        this.unsubscribe();
			    };
			    Subscriber.prototype._unsubscribeAndRecycle = function () {
			        var _parentOrParents = this._parentOrParents;
			        this._parentOrParents = null;
			        this.unsubscribe();
			        this.closed = false;
			        this.isStopped = false;
			        this._parentOrParents = _parentOrParents;
			        return this;
			    };
			    return Subscriber;
			}(Subscription_1$h.Subscription));
			Subscriber$1.Subscriber = Subscriber;
			var SafeSubscriber = (function (_super) {
			    __extends$1m(SafeSubscriber, _super);
			    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
			        var _this = _super.call(this) || this;
			        _this._parentSubscriber = _parentSubscriber;
			        var next;
			        var context = _this;
			        if (isFunction_1$3.isFunction(observerOrNext)) {
			            next = observerOrNext;
			        }
			        else if (observerOrNext) {
			            next = observerOrNext.next;
			            error = observerOrNext.error;
			            complete = observerOrNext.complete;
			            if (observerOrNext !== Observer_1$1.empty) {
			                context = Object.create(observerOrNext);
			                if (isFunction_1$3.isFunction(context.unsubscribe)) {
			                    _this.add(context.unsubscribe.bind(context));
			                }
			                context.unsubscribe = _this.unsubscribe.bind(_this);
			            }
			        }
			        _this._context = context;
			        _this._next = next;
			        _this._error = error;
			        _this._complete = complete;
			        return _this;
			    }
			    SafeSubscriber.prototype.next = function (value) {
			        if (!this.isStopped && this._next) {
			            var _parentSubscriber = this._parentSubscriber;
			            if (!config_1$2.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
			                this.__tryOrUnsub(this._next, value);
			            }
			            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
			                this.unsubscribe();
			            }
			        }
			    };
			    SafeSubscriber.prototype.error = function (err) {
			        if (!this.isStopped) {
			            var _parentSubscriber = this._parentSubscriber;
			            var useDeprecatedSynchronousErrorHandling = config_1$2.config.useDeprecatedSynchronousErrorHandling;
			            if (this._error) {
			                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
			                    this.__tryOrUnsub(this._error, err);
			                    this.unsubscribe();
			                }
			                else {
			                    this.__tryOrSetError(_parentSubscriber, this._error, err);
			                    this.unsubscribe();
			                }
			            }
			            else if (!_parentSubscriber.syncErrorThrowable) {
			                this.unsubscribe();
			                if (useDeprecatedSynchronousErrorHandling) {
			                    throw err;
			                }
			                hostReportError_1$1.hostReportError(err);
			            }
			            else {
			                if (useDeprecatedSynchronousErrorHandling) {
			                    _parentSubscriber.syncErrorValue = err;
			                    _parentSubscriber.syncErrorThrown = true;
			                }
			                else {
			                    hostReportError_1$1.hostReportError(err);
			                }
			                this.unsubscribe();
			            }
			        }
			    };
			    SafeSubscriber.prototype.complete = function () {
			        var _this = this;
			        if (!this.isStopped) {
			            var _parentSubscriber = this._parentSubscriber;
			            if (this._complete) {
			                var wrappedComplete = function () { return _this._complete.call(_this._context); };
			                if (!config_1$2.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
			                    this.__tryOrUnsub(wrappedComplete);
			                    this.unsubscribe();
			                }
			                else {
			                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
			                    this.unsubscribe();
			                }
			            }
			            else {
			                this.unsubscribe();
			            }
			        }
			    };
			    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
			        try {
			            fn.call(this._context, value);
			        }
			        catch (err) {
			            this.unsubscribe();
			            if (config_1$2.config.useDeprecatedSynchronousErrorHandling) {
			                throw err;
			            }
			            else {
			                hostReportError_1$1.hostReportError(err);
			            }
			        }
			    };
			    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
			        if (!config_1$2.config.useDeprecatedSynchronousErrorHandling) {
			            throw new Error('bad call');
			        }
			        try {
			            fn.call(this._context, value);
			        }
			        catch (err) {
			            if (config_1$2.config.useDeprecatedSynchronousErrorHandling) {
			                parent.syncErrorValue = err;
			                parent.syncErrorThrown = true;
			                return true;
			            }
			            else {
			                hostReportError_1$1.hostReportError(err);
			                return true;
			            }
			        }
			        return false;
			    };
			    SafeSubscriber.prototype._unsubscribe = function () {
			        var _parentSubscriber = this._parentSubscriber;
			        this._context = null;
			        this._parentSubscriber = null;
			        _parentSubscriber.unsubscribe();
			    };
			    return SafeSubscriber;
			}(Subscriber));
			Subscriber$1.SafeSubscriber = SafeSubscriber;

			Object.defineProperty(canReportError$1, "__esModule", { value: true });
			var Subscriber_1$L = Subscriber$1;
			function canReportError(observer) {
			    while (observer) {
			        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
			        if (closed_1 || isStopped) {
			            return false;
			        }
			        else if (destination && destination instanceof Subscriber_1$L.Subscriber) {
			            observer = destination;
			        }
			        else {
			            observer = null;
			        }
			    }
			    return true;
			}
			canReportError$1.canReportError = canReportError;

			var toSubscriber$1 = {};

			Object.defineProperty(toSubscriber$1, "__esModule", { value: true });
			var Subscriber_1$K = Subscriber$1;
			var rxSubscriber_1$1 = rxSubscriber;
			var Observer_1 = Observer;
			function toSubscriber(nextOrObserver, error, complete) {
			    if (nextOrObserver) {
			        if (nextOrObserver instanceof Subscriber_1$K.Subscriber) {
			            return nextOrObserver;
			        }
			        if (nextOrObserver[rxSubscriber_1$1.rxSubscriber]) {
			            return nextOrObserver[rxSubscriber_1$1.rxSubscriber]();
			        }
			    }
			    if (!nextOrObserver && !error && !complete) {
			        return new Subscriber_1$K.Subscriber(Observer_1.empty);
			    }
			    return new Subscriber_1$K.Subscriber(nextOrObserver, error, complete);
			}
			toSubscriber$1.toSubscriber = toSubscriber;

			var observable = {};

			Object.defineProperty(observable, "__esModule", { value: true });
			observable.observable = (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

			var pipe$1 = {};

			var identity$1 = {};

			Object.defineProperty(identity$1, "__esModule", { value: true });
			function identity(x) {
			    return x;
			}
			identity$1.identity = identity;

			Object.defineProperty(pipe$1, "__esModule", { value: true });
			var identity_1$6 = identity$1;
			function pipe() {
			    var fns = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        fns[_i] = arguments[_i];
			    }
			    return pipeFromArray(fns);
			}
			pipe$1.pipe = pipe;
			function pipeFromArray(fns) {
			    if (fns.length === 0) {
			        return identity_1$6.identity;
			    }
			    if (fns.length === 1) {
			        return fns[0];
			    }
			    return function piped(input) {
			        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
			    };
			}
			pipe$1.pipeFromArray = pipeFromArray;

			Object.defineProperty(Observable$1, "__esModule", { value: true });
			var canReportError_1$2 = canReportError$1;
			var toSubscriber_1 = toSubscriber$1;
			var observable_1$5 = observable;
			var pipe_1$2 = pipe$1;
			var config_1$1 = config;
			var Observable = (function () {
			    function Observable(subscribe) {
			        this._isScalar = false;
			        if (subscribe) {
			            this._subscribe = subscribe;
			        }
			    }
			    Observable.prototype.lift = function (operator) {
			        var observable = new Observable();
			        observable.source = this;
			        observable.operator = operator;
			        return observable;
			    };
			    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
			        var operator = this.operator;
			        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
			        if (operator) {
			            sink.add(operator.call(sink, this.source));
			        }
			        else {
			            sink.add(this.source || (config_1$1.config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
			                this._subscribe(sink) :
			                this._trySubscribe(sink));
			        }
			        if (config_1$1.config.useDeprecatedSynchronousErrorHandling) {
			            if (sink.syncErrorThrowable) {
			                sink.syncErrorThrowable = false;
			                if (sink.syncErrorThrown) {
			                    throw sink.syncErrorValue;
			                }
			            }
			        }
			        return sink;
			    };
			    Observable.prototype._trySubscribe = function (sink) {
			        try {
			            return this._subscribe(sink);
			        }
			        catch (err) {
			            if (config_1$1.config.useDeprecatedSynchronousErrorHandling) {
			                sink.syncErrorThrown = true;
			                sink.syncErrorValue = err;
			            }
			            if (canReportError_1$2.canReportError(sink)) {
			                sink.error(err);
			            }
			            else {
			                console.warn(err);
			            }
			        }
			    };
			    Observable.prototype.forEach = function (next, promiseCtor) {
			        var _this = this;
			        promiseCtor = getPromiseCtor(promiseCtor);
			        return new promiseCtor(function (resolve, reject) {
			            var subscription;
			            subscription = _this.subscribe(function (value) {
			                try {
			                    next(value);
			                }
			                catch (err) {
			                    reject(err);
			                    if (subscription) {
			                        subscription.unsubscribe();
			                    }
			                }
			            }, reject, resolve);
			        });
			    };
			    Observable.prototype._subscribe = function (subscriber) {
			        var source = this.source;
			        return source && source.subscribe(subscriber);
			    };
			    Observable.prototype[observable_1$5.observable] = function () {
			        return this;
			    };
			    Observable.prototype.pipe = function () {
			        var operations = [];
			        for (var _i = 0; _i < arguments.length; _i++) {
			            operations[_i] = arguments[_i];
			        }
			        if (operations.length === 0) {
			            return this;
			        }
			        return pipe_1$2.pipeFromArray(operations)(this);
			    };
			    Observable.prototype.toPromise = function (promiseCtor) {
			        var _this = this;
			        promiseCtor = getPromiseCtor(promiseCtor);
			        return new promiseCtor(function (resolve, reject) {
			            var value;
			            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
			        });
			    };
			    Observable.create = function (subscribe) {
			        return new Observable(subscribe);
			    };
			    return Observable;
			}());
			Observable$1.Observable = Observable;
			function getPromiseCtor(promiseCtor) {
			    if (!promiseCtor) {
			        promiseCtor = config_1$1.config.Promise || Promise;
			    }
			    if (!promiseCtor) {
			        throw new Error('no Promise impl found');
			    }
			    return promiseCtor;
			}

			var ConnectableObservable$1 = {};

			var Subject$1 = {};

			var ObjectUnsubscribedError = {};

			Object.defineProperty(ObjectUnsubscribedError, "__esModule", { value: true });
			var ObjectUnsubscribedErrorImpl = (function () {
			    function ObjectUnsubscribedErrorImpl() {
			        Error.call(this);
			        this.message = 'object unsubscribed';
			        this.name = 'ObjectUnsubscribedError';
			        return this;
			    }
			    ObjectUnsubscribedErrorImpl.prototype = Object.create(Error.prototype);
			    return ObjectUnsubscribedErrorImpl;
			})();
			ObjectUnsubscribedError.ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

			var SubjectSubscription$1 = {};

			var __extends$1l = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(SubjectSubscription$1, "__esModule", { value: true });
			var Subscription_1$g = Subscription$1;
			var SubjectSubscription = (function (_super) {
			    __extends$1l(SubjectSubscription, _super);
			    function SubjectSubscription(subject, subscriber) {
			        var _this = _super.call(this) || this;
			        _this.subject = subject;
			        _this.subscriber = subscriber;
			        _this.closed = false;
			        return _this;
			    }
			    SubjectSubscription.prototype.unsubscribe = function () {
			        if (this.closed) {
			            return;
			        }
			        this.closed = true;
			        var subject = this.subject;
			        var observers = subject.observers;
			        this.subject = null;
			        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
			            return;
			        }
			        var subscriberIndex = observers.indexOf(this.subscriber);
			        if (subscriberIndex !== -1) {
			            observers.splice(subscriberIndex, 1);
			        }
			    };
			    return SubjectSubscription;
			}(Subscription_1$g.Subscription));
			SubjectSubscription$1.SubjectSubscription = SubjectSubscription;

			var __extends$1k = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(Subject$1, "__esModule", { value: true });
			var Observable_1$u = Observable$1;
			var Subscriber_1$J = Subscriber$1;
			var Subscription_1$f = Subscription$1;
			var ObjectUnsubscribedError_1$3 = ObjectUnsubscribedError;
			var SubjectSubscription_1$1 = SubjectSubscription$1;
			var rxSubscriber_1 = rxSubscriber;
			var SubjectSubscriber = (function (_super) {
			    __extends$1k(SubjectSubscriber, _super);
			    function SubjectSubscriber(destination) {
			        var _this = _super.call(this, destination) || this;
			        _this.destination = destination;
			        return _this;
			    }
			    return SubjectSubscriber;
			}(Subscriber_1$J.Subscriber));
			Subject$1.SubjectSubscriber = SubjectSubscriber;
			var Subject = (function (_super) {
			    __extends$1k(Subject, _super);
			    function Subject() {
			        var _this = _super.call(this) || this;
			        _this.observers = [];
			        _this.closed = false;
			        _this.isStopped = false;
			        _this.hasError = false;
			        _this.thrownError = null;
			        return _this;
			    }
			    Subject.prototype[rxSubscriber_1.rxSubscriber] = function () {
			        return new SubjectSubscriber(this);
			    };
			    Subject.prototype.lift = function (operator) {
			        var subject = new AnonymousSubject(this, this);
			        subject.operator = operator;
			        return subject;
			    };
			    Subject.prototype.next = function (value) {
			        if (this.closed) {
			            throw new ObjectUnsubscribedError_1$3.ObjectUnsubscribedError();
			        }
			        if (!this.isStopped) {
			            var observers = this.observers;
			            var len = observers.length;
			            var copy = observers.slice();
			            for (var i = 0; i < len; i++) {
			                copy[i].next(value);
			            }
			        }
			    };
			    Subject.prototype.error = function (err) {
			        if (this.closed) {
			            throw new ObjectUnsubscribedError_1$3.ObjectUnsubscribedError();
			        }
			        this.hasError = true;
			        this.thrownError = err;
			        this.isStopped = true;
			        var observers = this.observers;
			        var len = observers.length;
			        var copy = observers.slice();
			        for (var i = 0; i < len; i++) {
			            copy[i].error(err);
			        }
			        this.observers.length = 0;
			    };
			    Subject.prototype.complete = function () {
			        if (this.closed) {
			            throw new ObjectUnsubscribedError_1$3.ObjectUnsubscribedError();
			        }
			        this.isStopped = true;
			        var observers = this.observers;
			        var len = observers.length;
			        var copy = observers.slice();
			        for (var i = 0; i < len; i++) {
			            copy[i].complete();
			        }
			        this.observers.length = 0;
			    };
			    Subject.prototype.unsubscribe = function () {
			        this.isStopped = true;
			        this.closed = true;
			        this.observers = null;
			    };
			    Subject.prototype._trySubscribe = function (subscriber) {
			        if (this.closed) {
			            throw new ObjectUnsubscribedError_1$3.ObjectUnsubscribedError();
			        }
			        else {
			            return _super.prototype._trySubscribe.call(this, subscriber);
			        }
			    };
			    Subject.prototype._subscribe = function (subscriber) {
			        if (this.closed) {
			            throw new ObjectUnsubscribedError_1$3.ObjectUnsubscribedError();
			        }
			        else if (this.hasError) {
			            subscriber.error(this.thrownError);
			            return Subscription_1$f.Subscription.EMPTY;
			        }
			        else if (this.isStopped) {
			            subscriber.complete();
			            return Subscription_1$f.Subscription.EMPTY;
			        }
			        else {
			            this.observers.push(subscriber);
			            return new SubjectSubscription_1$1.SubjectSubscription(this, subscriber);
			        }
			    };
			    Subject.prototype.asObservable = function () {
			        var observable = new Observable_1$u.Observable();
			        observable.source = this;
			        return observable;
			    };
			    Subject.create = function (destination, source) {
			        return new AnonymousSubject(destination, source);
			    };
			    return Subject;
			}(Observable_1$u.Observable));
			Subject$1.Subject = Subject;
			var AnonymousSubject = (function (_super) {
			    __extends$1k(AnonymousSubject, _super);
			    function AnonymousSubject(destination, source) {
			        var _this = _super.call(this) || this;
			        _this.destination = destination;
			        _this.source = source;
			        return _this;
			    }
			    AnonymousSubject.prototype.next = function (value) {
			        var destination = this.destination;
			        if (destination && destination.next) {
			            destination.next(value);
			        }
			    };
			    AnonymousSubject.prototype.error = function (err) {
			        var destination = this.destination;
			        if (destination && destination.error) {
			            this.destination.error(err);
			        }
			    };
			    AnonymousSubject.prototype.complete = function () {
			        var destination = this.destination;
			        if (destination && destination.complete) {
			            this.destination.complete();
			        }
			    };
			    AnonymousSubject.prototype._subscribe = function (subscriber) {
			        var source = this.source;
			        if (source) {
			            return this.source.subscribe(subscriber);
			        }
			        else {
			            return Subscription_1$f.Subscription.EMPTY;
			        }
			    };
			    return AnonymousSubject;
			}(Subject));
			Subject$1.AnonymousSubject = AnonymousSubject;

			var refCount$1 = {};

			var __extends$1j = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(refCount$1, "__esModule", { value: true });
			var Subscriber_1$I = Subscriber$1;
			function refCount() {
			    return function refCountOperatorFunction(source) {
			        return source.lift(new RefCountOperator(source));
			    };
			}
			refCount$1.refCount = refCount;
			var RefCountOperator = (function () {
			    function RefCountOperator(connectable) {
			        this.connectable = connectable;
			    }
			    RefCountOperator.prototype.call = function (subscriber, source) {
			        var connectable = this.connectable;
			        connectable._refCount++;
			        var refCounter = new RefCountSubscriber(subscriber, connectable);
			        var subscription = source.subscribe(refCounter);
			        if (!refCounter.closed) {
			            refCounter.connection = connectable.connect();
			        }
			        return subscription;
			    };
			    return RefCountOperator;
			}());
			var RefCountSubscriber = (function (_super) {
			    __extends$1j(RefCountSubscriber, _super);
			    function RefCountSubscriber(destination, connectable) {
			        var _this = _super.call(this, destination) || this;
			        _this.connectable = connectable;
			        return _this;
			    }
			    RefCountSubscriber.prototype._unsubscribe = function () {
			        var connectable = this.connectable;
			        if (!connectable) {
			            this.connection = null;
			            return;
			        }
			        this.connectable = null;
			        var refCount = connectable._refCount;
			        if (refCount <= 0) {
			            this.connection = null;
			            return;
			        }
			        connectable._refCount = refCount - 1;
			        if (refCount > 1) {
			            this.connection = null;
			            return;
			        }
			        var connection = this.connection;
			        var sharedConnection = connectable._connection;
			        this.connection = null;
			        if (sharedConnection && (!connection || sharedConnection === connection)) {
			            sharedConnection.unsubscribe();
			        }
			    };
			    return RefCountSubscriber;
			}(Subscriber_1$I.Subscriber));

			var __extends$1i = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(ConnectableObservable$1, "__esModule", { value: true });
			var Subject_1$e = Subject$1;
			var Observable_1$t = Observable$1;
			var Subscriber_1$H = Subscriber$1;
			var Subscription_1$e = Subscription$1;
			var refCount_1$2 = refCount$1;
			var ConnectableObservable = (function (_super) {
			    __extends$1i(ConnectableObservable, _super);
			    function ConnectableObservable(source, subjectFactory) {
			        var _this = _super.call(this) || this;
			        _this.source = source;
			        _this.subjectFactory = subjectFactory;
			        _this._refCount = 0;
			        _this._isComplete = false;
			        return _this;
			    }
			    ConnectableObservable.prototype._subscribe = function (subscriber) {
			        return this.getSubject().subscribe(subscriber);
			    };
			    ConnectableObservable.prototype.getSubject = function () {
			        var subject = this._subject;
			        if (!subject || subject.isStopped) {
			            this._subject = this.subjectFactory();
			        }
			        return this._subject;
			    };
			    ConnectableObservable.prototype.connect = function () {
			        var connection = this._connection;
			        if (!connection) {
			            this._isComplete = false;
			            connection = this._connection = new Subscription_1$e.Subscription();
			            connection.add(this.source
			                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
			            if (connection.closed) {
			                this._connection = null;
			                connection = Subscription_1$e.Subscription.EMPTY;
			            }
			        }
			        return connection;
			    };
			    ConnectableObservable.prototype.refCount = function () {
			        return refCount_1$2.refCount()(this);
			    };
			    return ConnectableObservable;
			}(Observable_1$t.Observable));
			ConnectableObservable$1.ConnectableObservable = ConnectableObservable;
			ConnectableObservable$1.connectableObservableDescriptor = (function () {
			    var connectableProto = ConnectableObservable.prototype;
			    return {
			        operator: { value: null },
			        _refCount: { value: 0, writable: true },
			        _subject: { value: null, writable: true },
			        _connection: { value: null, writable: true },
			        _subscribe: { value: connectableProto._subscribe },
			        _isComplete: { value: connectableProto._isComplete, writable: true },
			        getSubject: { value: connectableProto.getSubject },
			        connect: { value: connectableProto.connect },
			        refCount: { value: connectableProto.refCount }
			    };
			})();
			var ConnectableSubscriber = (function (_super) {
			    __extends$1i(ConnectableSubscriber, _super);
			    function ConnectableSubscriber(destination, connectable) {
			        var _this = _super.call(this, destination) || this;
			        _this.connectable = connectable;
			        return _this;
			    }
			    ConnectableSubscriber.prototype._error = function (err) {
			        this._unsubscribe();
			        _super.prototype._error.call(this, err);
			    };
			    ConnectableSubscriber.prototype._complete = function () {
			        this.connectable._isComplete = true;
			        this._unsubscribe();
			        _super.prototype._complete.call(this);
			    };
			    ConnectableSubscriber.prototype._unsubscribe = function () {
			        var connectable = this.connectable;
			        if (connectable) {
			            this.connectable = null;
			            var connection = connectable._connection;
			            connectable._refCount = 0;
			            connectable._subject = null;
			            connectable._connection = null;
			            if (connection) {
			                connection.unsubscribe();
			            }
			        }
			    };
			    return ConnectableSubscriber;
			}(Subject_1$e.SubjectSubscriber));
			((function (_super) {
			    __extends$1i(RefCountSubscriber, _super);
			    function RefCountSubscriber(destination, connectable) {
			        var _this = _super.call(this, destination) || this;
			        _this.connectable = connectable;
			        return _this;
			    }
			    RefCountSubscriber.prototype._unsubscribe = function () {
			        var connectable = this.connectable;
			        if (!connectable) {
			            this.connection = null;
			            return;
			        }
			        this.connectable = null;
			        var refCount = connectable._refCount;
			        if (refCount <= 0) {
			            this.connection = null;
			            return;
			        }
			        connectable._refCount = refCount - 1;
			        if (refCount > 1) {
			            this.connection = null;
			            return;
			        }
			        var connection = this.connection;
			        var sharedConnection = connectable._connection;
			        this.connection = null;
			        if (sharedConnection && (!connection || sharedConnection === connection)) {
			            sharedConnection.unsubscribe();
			        }
			    };
			    return RefCountSubscriber;
			})(Subscriber_1$H.Subscriber));

			var groupBy$1 = {};

			var __extends$1h = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(groupBy$1, "__esModule", { value: true });
			var Subscriber_1$G = Subscriber$1;
			var Subscription_1$d = Subscription$1;
			var Observable_1$s = Observable$1;
			var Subject_1$d = Subject$1;
			function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
			    return function (source) {
			        return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
			    };
			}
			groupBy$1.groupBy = groupBy;
			var GroupByOperator = (function () {
			    function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
			        this.keySelector = keySelector;
			        this.elementSelector = elementSelector;
			        this.durationSelector = durationSelector;
			        this.subjectSelector = subjectSelector;
			    }
			    GroupByOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
			    };
			    return GroupByOperator;
			}());
			var GroupBySubscriber = (function (_super) {
			    __extends$1h(GroupBySubscriber, _super);
			    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.keySelector = keySelector;
			        _this.elementSelector = elementSelector;
			        _this.durationSelector = durationSelector;
			        _this.subjectSelector = subjectSelector;
			        _this.groups = null;
			        _this.attemptedToUnsubscribe = false;
			        _this.count = 0;
			        return _this;
			    }
			    GroupBySubscriber.prototype._next = function (value) {
			        var key;
			        try {
			            key = this.keySelector(value);
			        }
			        catch (err) {
			            this.error(err);
			            return;
			        }
			        this._group(value, key);
			    };
			    GroupBySubscriber.prototype._group = function (value, key) {
			        var groups = this.groups;
			        if (!groups) {
			            groups = this.groups = new Map();
			        }
			        var group = groups.get(key);
			        var element;
			        if (this.elementSelector) {
			            try {
			                element = this.elementSelector(value);
			            }
			            catch (err) {
			                this.error(err);
			            }
			        }
			        else {
			            element = value;
			        }
			        if (!group) {
			            group = (this.subjectSelector ? this.subjectSelector() : new Subject_1$d.Subject());
			            groups.set(key, group);
			            var groupedObservable = new GroupedObservable(key, group, this);
			            this.destination.next(groupedObservable);
			            if (this.durationSelector) {
			                var duration = void 0;
			                try {
			                    duration = this.durationSelector(new GroupedObservable(key, group));
			                }
			                catch (err) {
			                    this.error(err);
			                    return;
			                }
			                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
			            }
			        }
			        if (!group.closed) {
			            group.next(element);
			        }
			    };
			    GroupBySubscriber.prototype._error = function (err) {
			        var groups = this.groups;
			        if (groups) {
			            groups.forEach(function (group, key) {
			                group.error(err);
			            });
			            groups.clear();
			        }
			        this.destination.error(err);
			    };
			    GroupBySubscriber.prototype._complete = function () {
			        var groups = this.groups;
			        if (groups) {
			            groups.forEach(function (group, key) {
			                group.complete();
			            });
			            groups.clear();
			        }
			        this.destination.complete();
			    };
			    GroupBySubscriber.prototype.removeGroup = function (key) {
			        this.groups.delete(key);
			    };
			    GroupBySubscriber.prototype.unsubscribe = function () {
			        if (!this.closed) {
			            this.attemptedToUnsubscribe = true;
			            if (this.count === 0) {
			                _super.prototype.unsubscribe.call(this);
			            }
			        }
			    };
			    return GroupBySubscriber;
			}(Subscriber_1$G.Subscriber));
			var GroupDurationSubscriber = (function (_super) {
			    __extends$1h(GroupDurationSubscriber, _super);
			    function GroupDurationSubscriber(key, group, parent) {
			        var _this = _super.call(this, group) || this;
			        _this.key = key;
			        _this.group = group;
			        _this.parent = parent;
			        return _this;
			    }
			    GroupDurationSubscriber.prototype._next = function (value) {
			        this.complete();
			    };
			    GroupDurationSubscriber.prototype._unsubscribe = function () {
			        var _a = this, parent = _a.parent, key = _a.key;
			        this.key = this.parent = null;
			        if (parent) {
			            parent.removeGroup(key);
			        }
			    };
			    return GroupDurationSubscriber;
			}(Subscriber_1$G.Subscriber));
			var GroupedObservable = (function (_super) {
			    __extends$1h(GroupedObservable, _super);
			    function GroupedObservable(key, groupSubject, refCountSubscription) {
			        var _this = _super.call(this) || this;
			        _this.key = key;
			        _this.groupSubject = groupSubject;
			        _this.refCountSubscription = refCountSubscription;
			        return _this;
			    }
			    GroupedObservable.prototype._subscribe = function (subscriber) {
			        var subscription = new Subscription_1$d.Subscription();
			        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
			        if (refCountSubscription && !refCountSubscription.closed) {
			            subscription.add(new InnerRefCountSubscription(refCountSubscription));
			        }
			        subscription.add(groupSubject.subscribe(subscriber));
			        return subscription;
			    };
			    return GroupedObservable;
			}(Observable_1$s.Observable));
			groupBy$1.GroupedObservable = GroupedObservable;
			var InnerRefCountSubscription = (function (_super) {
			    __extends$1h(InnerRefCountSubscription, _super);
			    function InnerRefCountSubscription(parent) {
			        var _this = _super.call(this) || this;
			        _this.parent = parent;
			        parent.count++;
			        return _this;
			    }
			    InnerRefCountSubscription.prototype.unsubscribe = function () {
			        var parent = this.parent;
			        if (!parent.closed && !this.closed) {
			            _super.prototype.unsubscribe.call(this);
			            parent.count -= 1;
			            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
			                parent.unsubscribe();
			            }
			        }
			    };
			    return InnerRefCountSubscription;
			}(Subscription_1$d.Subscription));

			var BehaviorSubject$1 = {};

			var __extends$1g = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(BehaviorSubject$1, "__esModule", { value: true });
			var Subject_1$c = Subject$1;
			var ObjectUnsubscribedError_1$2 = ObjectUnsubscribedError;
			var BehaviorSubject = (function (_super) {
			    __extends$1g(BehaviorSubject, _super);
			    function BehaviorSubject(_value) {
			        var _this = _super.call(this) || this;
			        _this._value = _value;
			        return _this;
			    }
			    Object.defineProperty(BehaviorSubject.prototype, "value", {
			        get: function () {
			            return this.getValue();
			        },
			        enumerable: true,
			        configurable: true
			    });
			    BehaviorSubject.prototype._subscribe = function (subscriber) {
			        var subscription = _super.prototype._subscribe.call(this, subscriber);
			        if (subscription && !subscription.closed) {
			            subscriber.next(this._value);
			        }
			        return subscription;
			    };
			    BehaviorSubject.prototype.getValue = function () {
			        if (this.hasError) {
			            throw this.thrownError;
			        }
			        else if (this.closed) {
			            throw new ObjectUnsubscribedError_1$2.ObjectUnsubscribedError();
			        }
			        else {
			            return this._value;
			        }
			    };
			    BehaviorSubject.prototype.next = function (value) {
			        _super.prototype.next.call(this, this._value = value);
			    };
			    return BehaviorSubject;
			}(Subject_1$c.Subject));
			BehaviorSubject$1.BehaviorSubject = BehaviorSubject;

			var ReplaySubject$1 = {};

			var queue = {};

			var QueueAction$1 = {};

			var AsyncAction$1 = {};

			var Action$1 = {};

			var __extends$1f = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(Action$1, "__esModule", { value: true });
			var Subscription_1$c = Subscription$1;
			var Action = (function (_super) {
			    __extends$1f(Action, _super);
			    function Action(scheduler, work) {
			        return _super.call(this) || this;
			    }
			    Action.prototype.schedule = function (state, delay) {
			        return this;
			    };
			    return Action;
			}(Subscription_1$c.Subscription));
			Action$1.Action = Action;

			var __extends$1e = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(AsyncAction$1, "__esModule", { value: true });
			var Action_1 = Action$1;
			var AsyncAction = (function (_super) {
			    __extends$1e(AsyncAction, _super);
			    function AsyncAction(scheduler, work) {
			        var _this = _super.call(this, scheduler, work) || this;
			        _this.scheduler = scheduler;
			        _this.work = work;
			        _this.pending = false;
			        return _this;
			    }
			    AsyncAction.prototype.schedule = function (state, delay) {
			        if (delay === void 0) { delay = 0; }
			        if (this.closed) {
			            return this;
			        }
			        this.state = state;
			        var id = this.id;
			        var scheduler = this.scheduler;
			        if (id != null) {
			            this.id = this.recycleAsyncId(scheduler, id, delay);
			        }
			        this.pending = true;
			        this.delay = delay;
			        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
			        return this;
			    };
			    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
			        if (delay === void 0) { delay = 0; }
			        return setInterval(scheduler.flush.bind(scheduler, this), delay);
			    };
			    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
			        if (delay === void 0) { delay = 0; }
			        if (delay !== null && this.delay === delay && this.pending === false) {
			            return id;
			        }
			        clearInterval(id);
			        return undefined;
			    };
			    AsyncAction.prototype.execute = function (state, delay) {
			        if (this.closed) {
			            return new Error('executing a cancelled action');
			        }
			        this.pending = false;
			        var error = this._execute(state, delay);
			        if (error) {
			            return error;
			        }
			        else if (this.pending === false && this.id != null) {
			            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
			        }
			    };
			    AsyncAction.prototype._execute = function (state, delay) {
			        var errored = false;
			        var errorValue = undefined;
			        try {
			            this.work(state);
			        }
			        catch (e) {
			            errored = true;
			            errorValue = !!e && e || new Error(e);
			        }
			        if (errored) {
			            this.unsubscribe();
			            return errorValue;
			        }
			    };
			    AsyncAction.prototype._unsubscribe = function () {
			        var id = this.id;
			        var scheduler = this.scheduler;
			        var actions = scheduler.actions;
			        var index = actions.indexOf(this);
			        this.work = null;
			        this.state = null;
			        this.pending = false;
			        this.scheduler = null;
			        if (index !== -1) {
			            actions.splice(index, 1);
			        }
			        if (id != null) {
			            this.id = this.recycleAsyncId(scheduler, id, null);
			        }
			        this.delay = null;
			    };
			    return AsyncAction;
			}(Action_1.Action));
			AsyncAction$1.AsyncAction = AsyncAction;

			var __extends$1d = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(QueueAction$1, "__esModule", { value: true });
			var AsyncAction_1$3 = AsyncAction$1;
			var QueueAction = (function (_super) {
			    __extends$1d(QueueAction, _super);
			    function QueueAction(scheduler, work) {
			        var _this = _super.call(this, scheduler, work) || this;
			        _this.scheduler = scheduler;
			        _this.work = work;
			        return _this;
			    }
			    QueueAction.prototype.schedule = function (state, delay) {
			        if (delay === void 0) { delay = 0; }
			        if (delay > 0) {
			            return _super.prototype.schedule.call(this, state, delay);
			        }
			        this.delay = delay;
			        this.state = state;
			        this.scheduler.flush(this);
			        return this;
			    };
			    QueueAction.prototype.execute = function (state, delay) {
			        return (delay > 0 || this.closed) ?
			            _super.prototype.execute.call(this, state, delay) :
			            this._execute(state, delay);
			    };
			    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
			        if (delay === void 0) { delay = 0; }
			        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
			            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
			        }
			        return scheduler.flush(this);
			    };
			    return QueueAction;
			}(AsyncAction_1$3.AsyncAction));
			QueueAction$1.QueueAction = QueueAction;

			var QueueScheduler$1 = {};

			var AsyncScheduler$1 = {};

			var Scheduler$1 = {};

			Object.defineProperty(Scheduler$1, "__esModule", { value: true });
			var Scheduler = (function () {
			    function Scheduler(SchedulerAction, now) {
			        if (now === void 0) { now = Scheduler.now; }
			        this.SchedulerAction = SchedulerAction;
			        this.now = now;
			    }
			    Scheduler.prototype.schedule = function (work, delay, state) {
			        if (delay === void 0) { delay = 0; }
			        return new this.SchedulerAction(this, work).schedule(state, delay);
			    };
			    Scheduler.now = function () { return Date.now(); };
			    return Scheduler;
			}());
			Scheduler$1.Scheduler = Scheduler;

			var __extends$1c = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(AsyncScheduler$1, "__esModule", { value: true });
			var Scheduler_1$1 = Scheduler$1;
			var AsyncScheduler = (function (_super) {
			    __extends$1c(AsyncScheduler, _super);
			    function AsyncScheduler(SchedulerAction, now) {
			        if (now === void 0) { now = Scheduler_1$1.Scheduler.now; }
			        var _this = _super.call(this, SchedulerAction, function () {
			            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
			                return AsyncScheduler.delegate.now();
			            }
			            else {
			                return now();
			            }
			        }) || this;
			        _this.actions = [];
			        _this.active = false;
			        _this.scheduled = undefined;
			        return _this;
			    }
			    AsyncScheduler.prototype.schedule = function (work, delay, state) {
			        if (delay === void 0) { delay = 0; }
			        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
			            return AsyncScheduler.delegate.schedule(work, delay, state);
			        }
			        else {
			            return _super.prototype.schedule.call(this, work, delay, state);
			        }
			    };
			    AsyncScheduler.prototype.flush = function (action) {
			        var actions = this.actions;
			        if (this.active) {
			            actions.push(action);
			            return;
			        }
			        var error;
			        this.active = true;
			        do {
			            if (error = action.execute(action.state, action.delay)) {
			                break;
			            }
			        } while (action = actions.shift());
			        this.active = false;
			        if (error) {
			            while (action = actions.shift()) {
			                action.unsubscribe();
			            }
			            throw error;
			        }
			    };
			    return AsyncScheduler;
			}(Scheduler_1$1.Scheduler));
			AsyncScheduler$1.AsyncScheduler = AsyncScheduler;

			var __extends$1b = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(QueueScheduler$1, "__esModule", { value: true });
			var AsyncScheduler_1$3 = AsyncScheduler$1;
			var QueueScheduler = (function (_super) {
			    __extends$1b(QueueScheduler, _super);
			    function QueueScheduler() {
			        return _super !== null && _super.apply(this, arguments) || this;
			    }
			    return QueueScheduler;
			}(AsyncScheduler_1$3.AsyncScheduler));
			QueueScheduler$1.QueueScheduler = QueueScheduler;

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			var QueueAction_1 = QueueAction$1;
			var QueueScheduler_1 = QueueScheduler$1;
			exports.queueScheduler = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
			exports.queue = exports.queueScheduler;

			}(queue));

			var observeOn$1 = {};

			var Notification = {};

			var empty = {};

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			var Observable_1 = Observable$1;
			exports.EMPTY = new Observable_1.Observable(function (subscriber) { return subscriber.complete(); });
			function empty(scheduler) {
			    return scheduler ? emptyScheduled(scheduler) : exports.EMPTY;
			}
			exports.empty = empty;
			function emptyScheduled(scheduler) {
			    return new Observable_1.Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
			}

			}(empty));

			var of$1 = {};

			var isScheduler$1 = {};

			Object.defineProperty(isScheduler$1, "__esModule", { value: true });
			function isScheduler(value) {
			    return value && typeof value.schedule === 'function';
			}
			isScheduler$1.isScheduler = isScheduler;

			var fromArray$1 = {};

			var subscribeToArray = {};

			Object.defineProperty(subscribeToArray, "__esModule", { value: true });
			subscribeToArray.subscribeToArray = function (array) { return function (subscriber) {
			    for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
			        subscriber.next(array[i]);
			    }
			    subscriber.complete();
			}; };

			var scheduleArray$1 = {};

			Object.defineProperty(scheduleArray$1, "__esModule", { value: true });
			var Observable_1$r = Observable$1;
			var Subscription_1$b = Subscription$1;
			function scheduleArray(input, scheduler) {
			    return new Observable_1$r.Observable(function (subscriber) {
			        var sub = new Subscription_1$b.Subscription();
			        var i = 0;
			        sub.add(scheduler.schedule(function () {
			            if (i === input.length) {
			                subscriber.complete();
			                return;
			            }
			            subscriber.next(input[i++]);
			            if (!subscriber.closed) {
			                sub.add(this.schedule());
			            }
			        }));
			        return sub;
			    });
			}
			scheduleArray$1.scheduleArray = scheduleArray;

			Object.defineProperty(fromArray$1, "__esModule", { value: true });
			var Observable_1$q = Observable$1;
			var subscribeToArray_1$1 = subscribeToArray;
			var scheduleArray_1$2 = scheduleArray$1;
			function fromArray(input, scheduler) {
			    if (!scheduler) {
			        return new Observable_1$q.Observable(subscribeToArray_1$1.subscribeToArray(input));
			    }
			    else {
			        return scheduleArray_1$2.scheduleArray(input, scheduler);
			    }
			}
			fromArray$1.fromArray = fromArray;

			Object.defineProperty(of$1, "__esModule", { value: true });
			var isScheduler_1$9 = isScheduler$1;
			var fromArray_1$4 = fromArray$1;
			var scheduleArray_1$1 = scheduleArray$1;
			function of() {
			    var args = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        args[_i] = arguments[_i];
			    }
			    var scheduler = args[args.length - 1];
			    if (isScheduler_1$9.isScheduler(scheduler)) {
			        args.pop();
			        return scheduleArray_1$1.scheduleArray(args, scheduler);
			    }
			    else {
			        return fromArray_1$4.fromArray(args);
			    }
			}
			of$1.of = of;

			var throwError$1 = {};

			Object.defineProperty(throwError$1, "__esModule", { value: true });
			var Observable_1$p = Observable$1;
			function throwError(error, scheduler) {
			    if (!scheduler) {
			        return new Observable_1$p.Observable(function (subscriber) { return subscriber.error(error); });
			    }
			    else {
			        return new Observable_1$p.Observable(function (subscriber) { return scheduler.schedule(dispatch$7, 0, { error: error, subscriber: subscriber }); });
			    }
			}
			throwError$1.throwError = throwError;
			function dispatch$7(_a) {
			    var error = _a.error, subscriber = _a.subscriber;
			    subscriber.error(error);
			}

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			var empty_1 = empty;
			var of_1 = of$1;
			var throwError_1 = throwError$1;
			(function (NotificationKind) {
			    NotificationKind["NEXT"] = "N";
			    NotificationKind["ERROR"] = "E";
			    NotificationKind["COMPLETE"] = "C";
			})(exports.NotificationKind || (exports.NotificationKind = {}));
			var Notification = (function () {
			    function Notification(kind, value, error) {
			        this.kind = kind;
			        this.value = value;
			        this.error = error;
			        this.hasValue = kind === 'N';
			    }
			    Notification.prototype.observe = function (observer) {
			        switch (this.kind) {
			            case 'N':
			                return observer.next && observer.next(this.value);
			            case 'E':
			                return observer.error && observer.error(this.error);
			            case 'C':
			                return observer.complete && observer.complete();
			        }
			    };
			    Notification.prototype.do = function (next, error, complete) {
			        var kind = this.kind;
			        switch (kind) {
			            case 'N':
			                return next && next(this.value);
			            case 'E':
			                return error && error(this.error);
			            case 'C':
			                return complete && complete();
			        }
			    };
			    Notification.prototype.accept = function (nextOrObserver, error, complete) {
			        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
			            return this.observe(nextOrObserver);
			        }
			        else {
			            return this.do(nextOrObserver, error, complete);
			        }
			    };
			    Notification.prototype.toObservable = function () {
			        var kind = this.kind;
			        switch (kind) {
			            case 'N':
			                return of_1.of(this.value);
			            case 'E':
			                return throwError_1.throwError(this.error);
			            case 'C':
			                return empty_1.empty();
			        }
			        throw new Error('unexpected notification kind value');
			    };
			    Notification.createNext = function (value) {
			        if (typeof value !== 'undefined') {
			            return new Notification('N', value);
			        }
			        return Notification.undefinedValueNotification;
			    };
			    Notification.createError = function (err) {
			        return new Notification('E', undefined, err);
			    };
			    Notification.createComplete = function () {
			        return Notification.completeNotification;
			    };
			    Notification.completeNotification = new Notification('C');
			    Notification.undefinedValueNotification = new Notification('N', undefined);
			    return Notification;
			}());
			exports.Notification = Notification;

			}(Notification));

			var __extends$1a = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(observeOn$1, "__esModule", { value: true });
			var Subscriber_1$F = Subscriber$1;
			var Notification_1$3 = Notification;
			function observeOn(scheduler, delay) {
			    if (delay === void 0) { delay = 0; }
			    return function observeOnOperatorFunction(source) {
			        return source.lift(new ObserveOnOperator(scheduler, delay));
			    };
			}
			observeOn$1.observeOn = observeOn;
			var ObserveOnOperator = (function () {
			    function ObserveOnOperator(scheduler, delay) {
			        if (delay === void 0) { delay = 0; }
			        this.scheduler = scheduler;
			        this.delay = delay;
			    }
			    ObserveOnOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
			    };
			    return ObserveOnOperator;
			}());
			observeOn$1.ObserveOnOperator = ObserveOnOperator;
			var ObserveOnSubscriber = (function (_super) {
			    __extends$1a(ObserveOnSubscriber, _super);
			    function ObserveOnSubscriber(destination, scheduler, delay) {
			        if (delay === void 0) { delay = 0; }
			        var _this = _super.call(this, destination) || this;
			        _this.scheduler = scheduler;
			        _this.delay = delay;
			        return _this;
			    }
			    ObserveOnSubscriber.dispatch = function (arg) {
			        var notification = arg.notification, destination = arg.destination;
			        notification.observe(destination);
			        this.unsubscribe();
			    };
			    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
			        var destination = this.destination;
			        destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
			    };
			    ObserveOnSubscriber.prototype._next = function (value) {
			        this.scheduleMessage(Notification_1$3.Notification.createNext(value));
			    };
			    ObserveOnSubscriber.prototype._error = function (err) {
			        this.scheduleMessage(Notification_1$3.Notification.createError(err));
			        this.unsubscribe();
			    };
			    ObserveOnSubscriber.prototype._complete = function () {
			        this.scheduleMessage(Notification_1$3.Notification.createComplete());
			        this.unsubscribe();
			    };
			    return ObserveOnSubscriber;
			}(Subscriber_1$F.Subscriber));
			observeOn$1.ObserveOnSubscriber = ObserveOnSubscriber;
			var ObserveOnMessage = (function () {
			    function ObserveOnMessage(notification, destination) {
			        this.notification = notification;
			        this.destination = destination;
			    }
			    return ObserveOnMessage;
			}());
			observeOn$1.ObserveOnMessage = ObserveOnMessage;

			var __extends$19 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(ReplaySubject$1, "__esModule", { value: true });
			var Subject_1$b = Subject$1;
			var queue_1$1 = queue;
			var Subscription_1$a = Subscription$1;
			var observeOn_1$1 = observeOn$1;
			var ObjectUnsubscribedError_1$1 = ObjectUnsubscribedError;
			var SubjectSubscription_1 = SubjectSubscription$1;
			var ReplaySubject = (function (_super) {
			    __extends$19(ReplaySubject, _super);
			    function ReplaySubject(bufferSize, windowTime, scheduler) {
			        if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
			        if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
			        var _this = _super.call(this) || this;
			        _this.scheduler = scheduler;
			        _this._events = [];
			        _this._infiniteTimeWindow = false;
			        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
			        _this._windowTime = windowTime < 1 ? 1 : windowTime;
			        if (windowTime === Number.POSITIVE_INFINITY) {
			            _this._infiniteTimeWindow = true;
			            _this.next = _this.nextInfiniteTimeWindow;
			        }
			        else {
			            _this.next = _this.nextTimeWindow;
			        }
			        return _this;
			    }
			    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
			        if (!this.isStopped) {
			            var _events = this._events;
			            _events.push(value);
			            if (_events.length > this._bufferSize) {
			                _events.shift();
			            }
			        }
			        _super.prototype.next.call(this, value);
			    };
			    ReplaySubject.prototype.nextTimeWindow = function (value) {
			        if (!this.isStopped) {
			            this._events.push(new ReplayEvent(this._getNow(), value));
			            this._trimBufferThenGetEvents();
			        }
			        _super.prototype.next.call(this, value);
			    };
			    ReplaySubject.prototype._subscribe = function (subscriber) {
			        var _infiniteTimeWindow = this._infiniteTimeWindow;
			        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
			        var scheduler = this.scheduler;
			        var len = _events.length;
			        var subscription;
			        if (this.closed) {
			            throw new ObjectUnsubscribedError_1$1.ObjectUnsubscribedError();
			        }
			        else if (this.isStopped || this.hasError) {
			            subscription = Subscription_1$a.Subscription.EMPTY;
			        }
			        else {
			            this.observers.push(subscriber);
			            subscription = new SubjectSubscription_1.SubjectSubscription(this, subscriber);
			        }
			        if (scheduler) {
			            subscriber.add(subscriber = new observeOn_1$1.ObserveOnSubscriber(subscriber, scheduler));
			        }
			        if (_infiniteTimeWindow) {
			            for (var i = 0; i < len && !subscriber.closed; i++) {
			                subscriber.next(_events[i]);
			            }
			        }
			        else {
			            for (var i = 0; i < len && !subscriber.closed; i++) {
			                subscriber.next(_events[i].value);
			            }
			        }
			        if (this.hasError) {
			            subscriber.error(this.thrownError);
			        }
			        else if (this.isStopped) {
			            subscriber.complete();
			        }
			        return subscription;
			    };
			    ReplaySubject.prototype._getNow = function () {
			        return (this.scheduler || queue_1$1.queue).now();
			    };
			    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
			        var now = this._getNow();
			        var _bufferSize = this._bufferSize;
			        var _windowTime = this._windowTime;
			        var _events = this._events;
			        var eventsCount = _events.length;
			        var spliceCount = 0;
			        while (spliceCount < eventsCount) {
			            if ((now - _events[spliceCount].time) < _windowTime) {
			                break;
			            }
			            spliceCount++;
			        }
			        if (eventsCount > _bufferSize) {
			            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
			        }
			        if (spliceCount > 0) {
			            _events.splice(0, spliceCount);
			        }
			        return _events;
			    };
			    return ReplaySubject;
			}(Subject_1$b.Subject));
			ReplaySubject$1.ReplaySubject = ReplaySubject;
			var ReplayEvent = (function () {
			    function ReplayEvent(time, value) {
			        this.time = time;
			        this.value = value;
			    }
			    return ReplayEvent;
			}());

			var AsyncSubject$1 = {};

			var __extends$18 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(AsyncSubject$1, "__esModule", { value: true });
			var Subject_1$a = Subject$1;
			var Subscription_1$9 = Subscription$1;
			var AsyncSubject = (function (_super) {
			    __extends$18(AsyncSubject, _super);
			    function AsyncSubject() {
			        var _this = _super !== null && _super.apply(this, arguments) || this;
			        _this.value = null;
			        _this.hasNext = false;
			        _this.hasCompleted = false;
			        return _this;
			    }
			    AsyncSubject.prototype._subscribe = function (subscriber) {
			        if (this.hasError) {
			            subscriber.error(this.thrownError);
			            return Subscription_1$9.Subscription.EMPTY;
			        }
			        else if (this.hasCompleted && this.hasNext) {
			            subscriber.next(this.value);
			            subscriber.complete();
			            return Subscription_1$9.Subscription.EMPTY;
			        }
			        return _super.prototype._subscribe.call(this, subscriber);
			    };
			    AsyncSubject.prototype.next = function (value) {
			        if (!this.hasCompleted) {
			            this.value = value;
			            this.hasNext = true;
			        }
			    };
			    AsyncSubject.prototype.error = function (error) {
			        if (!this.hasCompleted) {
			            _super.prototype.error.call(this, error);
			        }
			    };
			    AsyncSubject.prototype.complete = function () {
			        this.hasCompleted = true;
			        if (this.hasNext) {
			            _super.prototype.next.call(this, this.value);
			        }
			        _super.prototype.complete.call(this);
			    };
			    return AsyncSubject;
			}(Subject_1$a.Subject));
			AsyncSubject$1.AsyncSubject = AsyncSubject;

			var asap = {};

			var AsapAction$1 = {};

			var Immediate = {};

			Object.defineProperty(Immediate, "__esModule", { value: true });
			var nextHandle = 1;
			var RESOLVED = (function () { return Promise.resolve(); })();
			var activeHandles = {};
			function findAndClearHandle(handle) {
			    if (handle in activeHandles) {
			        delete activeHandles[handle];
			        return true;
			    }
			    return false;
			}
			Immediate.Immediate = {
			    setImmediate: function (cb) {
			        var handle = nextHandle++;
			        activeHandles[handle] = true;
			        RESOLVED.then(function () { return findAndClearHandle(handle) && cb(); });
			        return handle;
			    },
			    clearImmediate: function (handle) {
			        findAndClearHandle(handle);
			    },
			};
			Immediate.TestTools = {
			    pending: function () {
			        return Object.keys(activeHandles).length;
			    }
			};

			var __extends$17 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(AsapAction$1, "__esModule", { value: true });
			var Immediate_1 = Immediate;
			var AsyncAction_1$2 = AsyncAction$1;
			var AsapAction = (function (_super) {
			    __extends$17(AsapAction, _super);
			    function AsapAction(scheduler, work) {
			        var _this = _super.call(this, scheduler, work) || this;
			        _this.scheduler = scheduler;
			        _this.work = work;
			        return _this;
			    }
			    AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
			        if (delay === void 0) { delay = 0; }
			        if (delay !== null && delay > 0) {
			            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
			        }
			        scheduler.actions.push(this);
			        return scheduler.scheduled || (scheduler.scheduled = Immediate_1.Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
			    };
			    AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
			        if (delay === void 0) { delay = 0; }
			        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
			            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
			        }
			        if (scheduler.actions.length === 0) {
			            Immediate_1.Immediate.clearImmediate(id);
			            scheduler.scheduled = undefined;
			        }
			        return undefined;
			    };
			    return AsapAction;
			}(AsyncAction_1$2.AsyncAction));
			AsapAction$1.AsapAction = AsapAction;

			var AsapScheduler$1 = {};

			var __extends$16 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(AsapScheduler$1, "__esModule", { value: true });
			var AsyncScheduler_1$2 = AsyncScheduler$1;
			var AsapScheduler = (function (_super) {
			    __extends$16(AsapScheduler, _super);
			    function AsapScheduler() {
			        return _super !== null && _super.apply(this, arguments) || this;
			    }
			    AsapScheduler.prototype.flush = function (action) {
			        this.active = true;
			        this.scheduled = undefined;
			        var actions = this.actions;
			        var error;
			        var index = -1;
			        var count = actions.length;
			        action = action || actions.shift();
			        do {
			            if (error = action.execute(action.state, action.delay)) {
			                break;
			            }
			        } while (++index < count && (action = actions.shift()));
			        this.active = false;
			        if (error) {
			            while (++index < count && (action = actions.shift())) {
			                action.unsubscribe();
			            }
			            throw error;
			        }
			    };
			    return AsapScheduler;
			}(AsyncScheduler_1$2.AsyncScheduler));
			AsapScheduler$1.AsapScheduler = AsapScheduler;

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			var AsapAction_1 = AsapAction$1;
			var AsapScheduler_1 = AsapScheduler$1;
			exports.asapScheduler = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);
			exports.asap = exports.asapScheduler;

			}(asap));

			var async = {};

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			var AsyncAction_1 = AsyncAction$1;
			var AsyncScheduler_1 = AsyncScheduler$1;
			exports.asyncScheduler = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
			exports.async = exports.asyncScheduler;

			}(async));

			var animationFrame = {};

			var AnimationFrameAction$1 = {};

			var __extends$15 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(AnimationFrameAction$1, "__esModule", { value: true });
			var AsyncAction_1$1 = AsyncAction$1;
			var AnimationFrameAction = (function (_super) {
			    __extends$15(AnimationFrameAction, _super);
			    function AnimationFrameAction(scheduler, work) {
			        var _this = _super.call(this, scheduler, work) || this;
			        _this.scheduler = scheduler;
			        _this.work = work;
			        return _this;
			    }
			    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
			        if (delay === void 0) { delay = 0; }
			        if (delay !== null && delay > 0) {
			            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
			        }
			        scheduler.actions.push(this);
			        return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
			    };
			    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
			        if (delay === void 0) { delay = 0; }
			        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
			            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
			        }
			        if (scheduler.actions.length === 0) {
			            cancelAnimationFrame(id);
			            scheduler.scheduled = undefined;
			        }
			        return undefined;
			    };
			    return AnimationFrameAction;
			}(AsyncAction_1$1.AsyncAction));
			AnimationFrameAction$1.AnimationFrameAction = AnimationFrameAction;

			var AnimationFrameScheduler$1 = {};

			var __extends$14 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(AnimationFrameScheduler$1, "__esModule", { value: true });
			var AsyncScheduler_1$1 = AsyncScheduler$1;
			var AnimationFrameScheduler = (function (_super) {
			    __extends$14(AnimationFrameScheduler, _super);
			    function AnimationFrameScheduler() {
			        return _super !== null && _super.apply(this, arguments) || this;
			    }
			    AnimationFrameScheduler.prototype.flush = function (action) {
			        this.active = true;
			        this.scheduled = undefined;
			        var actions = this.actions;
			        var error;
			        var index = -1;
			        var count = actions.length;
			        action = action || actions.shift();
			        do {
			            if (error = action.execute(action.state, action.delay)) {
			                break;
			            }
			        } while (++index < count && (action = actions.shift()));
			        this.active = false;
			        if (error) {
			            while (++index < count && (action = actions.shift())) {
			                action.unsubscribe();
			            }
			            throw error;
			        }
			    };
			    return AnimationFrameScheduler;
			}(AsyncScheduler_1$1.AsyncScheduler));
			AnimationFrameScheduler$1.AnimationFrameScheduler = AnimationFrameScheduler;

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			var AnimationFrameAction_1 = AnimationFrameAction$1;
			var AnimationFrameScheduler_1 = AnimationFrameScheduler$1;
			exports.animationFrameScheduler = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
			exports.animationFrame = exports.animationFrameScheduler;

			}(animationFrame));

			var VirtualTimeScheduler$1 = {};

			var __extends$13 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(VirtualTimeScheduler$1, "__esModule", { value: true });
			var AsyncAction_1 = AsyncAction$1;
			var AsyncScheduler_1 = AsyncScheduler$1;
			var VirtualTimeScheduler = (function (_super) {
			    __extends$13(VirtualTimeScheduler, _super);
			    function VirtualTimeScheduler(SchedulerAction, maxFrames) {
			        if (SchedulerAction === void 0) { SchedulerAction = VirtualAction; }
			        if (maxFrames === void 0) { maxFrames = Number.POSITIVE_INFINITY; }
			        var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
			        _this.maxFrames = maxFrames;
			        _this.frame = 0;
			        _this.index = -1;
			        return _this;
			    }
			    VirtualTimeScheduler.prototype.flush = function () {
			        var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
			        var error, action;
			        while ((action = actions[0]) && action.delay <= maxFrames) {
			            actions.shift();
			            this.frame = action.delay;
			            if (error = action.execute(action.state, action.delay)) {
			                break;
			            }
			        }
			        if (error) {
			            while (action = actions.shift()) {
			                action.unsubscribe();
			            }
			            throw error;
			        }
			    };
			    VirtualTimeScheduler.frameTimeFactor = 10;
			    return VirtualTimeScheduler;
			}(AsyncScheduler_1.AsyncScheduler));
			VirtualTimeScheduler$1.VirtualTimeScheduler = VirtualTimeScheduler;
			var VirtualAction = (function (_super) {
			    __extends$13(VirtualAction, _super);
			    function VirtualAction(scheduler, work, index) {
			        if (index === void 0) { index = scheduler.index += 1; }
			        var _this = _super.call(this, scheduler, work) || this;
			        _this.scheduler = scheduler;
			        _this.work = work;
			        _this.index = index;
			        _this.active = true;
			        _this.index = scheduler.index = index;
			        return _this;
			    }
			    VirtualAction.prototype.schedule = function (state, delay) {
			        if (delay === void 0) { delay = 0; }
			        if (!this.id) {
			            return _super.prototype.schedule.call(this, state, delay);
			        }
			        this.active = false;
			        var action = new VirtualAction(this.scheduler, this.work);
			        this.add(action);
			        return action.schedule(state, delay);
			    };
			    VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
			        if (delay === void 0) { delay = 0; }
			        this.delay = scheduler.frame + delay;
			        var actions = scheduler.actions;
			        actions.push(this);
			        actions.sort(VirtualAction.sortActions);
			        return true;
			    };
			    VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
			        return undefined;
			    };
			    VirtualAction.prototype._execute = function (state, delay) {
			        if (this.active === true) {
			            return _super.prototype._execute.call(this, state, delay);
			        }
			    };
			    VirtualAction.sortActions = function (a, b) {
			        if (a.delay === b.delay) {
			            if (a.index === b.index) {
			                return 0;
			            }
			            else if (a.index > b.index) {
			                return 1;
			            }
			            else {
			                return -1;
			            }
			        }
			        else if (a.delay > b.delay) {
			            return 1;
			        }
			        else {
			            return -1;
			        }
			    };
			    return VirtualAction;
			}(AsyncAction_1.AsyncAction));
			VirtualTimeScheduler$1.VirtualAction = VirtualAction;

			var noop$1 = {};

			Object.defineProperty(noop$1, "__esModule", { value: true });
			function noop() { }
			noop$1.noop = noop;

			var isObservable$1 = {};

			Object.defineProperty(isObservable$1, "__esModule", { value: true });
			var Observable_1$o = Observable$1;
			function isObservable(obj) {
			    return !!obj && (obj instanceof Observable_1$o.Observable || (typeof obj.lift === 'function' && typeof obj.subscribe === 'function'));
			}
			isObservable$1.isObservable = isObservable;

			var ArgumentOutOfRangeError = {};

			Object.defineProperty(ArgumentOutOfRangeError, "__esModule", { value: true });
			var ArgumentOutOfRangeErrorImpl = (function () {
			    function ArgumentOutOfRangeErrorImpl() {
			        Error.call(this);
			        this.message = 'argument out of range';
			        this.name = 'ArgumentOutOfRangeError';
			        return this;
			    }
			    ArgumentOutOfRangeErrorImpl.prototype = Object.create(Error.prototype);
			    return ArgumentOutOfRangeErrorImpl;
			})();
			ArgumentOutOfRangeError.ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;

			var EmptyError = {};

			Object.defineProperty(EmptyError, "__esModule", { value: true });
			var EmptyErrorImpl = (function () {
			    function EmptyErrorImpl() {
			        Error.call(this);
			        this.message = 'no elements in sequence';
			        this.name = 'EmptyError';
			        return this;
			    }
			    EmptyErrorImpl.prototype = Object.create(Error.prototype);
			    return EmptyErrorImpl;
			})();
			EmptyError.EmptyError = EmptyErrorImpl;

			var TimeoutError = {};

			Object.defineProperty(TimeoutError, "__esModule", { value: true });
			var TimeoutErrorImpl = (function () {
			    function TimeoutErrorImpl() {
			        Error.call(this);
			        this.message = 'Timeout has occurred';
			        this.name = 'TimeoutError';
			        return this;
			    }
			    TimeoutErrorImpl.prototype = Object.create(Error.prototype);
			    return TimeoutErrorImpl;
			})();
			TimeoutError.TimeoutError = TimeoutErrorImpl;

			var bindCallback$1 = {};

			var map$1 = {};

			var __extends$12 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(map$1, "__esModule", { value: true });
			var Subscriber_1$E = Subscriber$1;
			function map(project, thisArg) {
			    return function mapOperation(source) {
			        if (typeof project !== 'function') {
			            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
			        }
			        return source.lift(new MapOperator(project, thisArg));
			    };
			}
			map$1.map = map;
			var MapOperator = (function () {
			    function MapOperator(project, thisArg) {
			        this.project = project;
			        this.thisArg = thisArg;
			    }
			    MapOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
			    };
			    return MapOperator;
			}());
			map$1.MapOperator = MapOperator;
			var MapSubscriber = (function (_super) {
			    __extends$12(MapSubscriber, _super);
			    function MapSubscriber(destination, project, thisArg) {
			        var _this = _super.call(this, destination) || this;
			        _this.project = project;
			        _this.count = 0;
			        _this.thisArg = thisArg || _this;
			        return _this;
			    }
			    MapSubscriber.prototype._next = function (value) {
			        var result;
			        try {
			            result = this.project.call(this.thisArg, value, this.count++);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        this.destination.next(result);
			    };
			    return MapSubscriber;
			}(Subscriber_1$E.Subscriber));

			Object.defineProperty(bindCallback$1, "__esModule", { value: true });
			var Observable_1$n = Observable$1;
			var AsyncSubject_1$3 = AsyncSubject$1;
			var map_1$b = map$1;
			var canReportError_1$1 = canReportError$1;
			var isArray_1$c = isArray;
			var isScheduler_1$8 = isScheduler$1;
			function bindCallback(callbackFunc, resultSelector, scheduler) {
			    if (resultSelector) {
			        if (isScheduler_1$8.isScheduler(resultSelector)) {
			            scheduler = resultSelector;
			        }
			        else {
			            return function () {
			                var args = [];
			                for (var _i = 0; _i < arguments.length; _i++) {
			                    args[_i] = arguments[_i];
			                }
			                return bindCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map_1$b.map(function (args) { return isArray_1$c.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
			            };
			        }
			    }
			    return function () {
			        var args = [];
			        for (var _i = 0; _i < arguments.length; _i++) {
			            args[_i] = arguments[_i];
			        }
			        var context = this;
			        var subject;
			        var params = {
			            context: context,
			            subject: subject,
			            callbackFunc: callbackFunc,
			            scheduler: scheduler,
			        };
			        return new Observable_1$n.Observable(function (subscriber) {
			            if (!scheduler) {
			                if (!subject) {
			                    subject = new AsyncSubject_1$3.AsyncSubject();
			                    var handler = function () {
			                        var innerArgs = [];
			                        for (var _i = 0; _i < arguments.length; _i++) {
			                            innerArgs[_i] = arguments[_i];
			                        }
			                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
			                        subject.complete();
			                    };
			                    try {
			                        callbackFunc.apply(context, args.concat([handler]));
			                    }
			                    catch (err) {
			                        if (canReportError_1$1.canReportError(subject)) {
			                            subject.error(err);
			                        }
			                        else {
			                            console.warn(err);
			                        }
			                    }
			                }
			                return subject.subscribe(subscriber);
			            }
			            else {
			                var state = {
			                    args: args, subscriber: subscriber, params: params,
			                };
			                return scheduler.schedule(dispatch$6, 0, state);
			            }
			        });
			    };
			}
			bindCallback$1.bindCallback = bindCallback;
			function dispatch$6(state) {
			    var _this = this;
			    var args = state.args, subscriber = state.subscriber, params = state.params;
			    var callbackFunc = params.callbackFunc, context = params.context, scheduler = params.scheduler;
			    var subject = params.subject;
			    if (!subject) {
			        subject = params.subject = new AsyncSubject_1$3.AsyncSubject();
			        var handler = function () {
			            var innerArgs = [];
			            for (var _i = 0; _i < arguments.length; _i++) {
			                innerArgs[_i] = arguments[_i];
			            }
			            var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
			            _this.add(scheduler.schedule(dispatchNext$3, 0, { value: value, subject: subject }));
			        };
			        try {
			            callbackFunc.apply(context, args.concat([handler]));
			        }
			        catch (err) {
			            subject.error(err);
			        }
			    }
			    this.add(subject.subscribe(subscriber));
			}
			function dispatchNext$3(state) {
			    var value = state.value, subject = state.subject;
			    subject.next(value);
			    subject.complete();
			}

			var bindNodeCallback$1 = {};

			Object.defineProperty(bindNodeCallback$1, "__esModule", { value: true });
			var Observable_1$m = Observable$1;
			var AsyncSubject_1$2 = AsyncSubject$1;
			var map_1$a = map$1;
			var canReportError_1 = canReportError$1;
			var isScheduler_1$7 = isScheduler$1;
			var isArray_1$b = isArray;
			function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
			    if (resultSelector) {
			        if (isScheduler_1$7.isScheduler(resultSelector)) {
			            scheduler = resultSelector;
			        }
			        else {
			            return function () {
			                var args = [];
			                for (var _i = 0; _i < arguments.length; _i++) {
			                    args[_i] = arguments[_i];
			                }
			                return bindNodeCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map_1$a.map(function (args) { return isArray_1$b.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
			            };
			        }
			    }
			    return function () {
			        var args = [];
			        for (var _i = 0; _i < arguments.length; _i++) {
			            args[_i] = arguments[_i];
			        }
			        var params = {
			            subject: undefined,
			            args: args,
			            callbackFunc: callbackFunc,
			            scheduler: scheduler,
			            context: this,
			        };
			        return new Observable_1$m.Observable(function (subscriber) {
			            var context = params.context;
			            var subject = params.subject;
			            if (!scheduler) {
			                if (!subject) {
			                    subject = params.subject = new AsyncSubject_1$2.AsyncSubject();
			                    var handler = function () {
			                        var innerArgs = [];
			                        for (var _i = 0; _i < arguments.length; _i++) {
			                            innerArgs[_i] = arguments[_i];
			                        }
			                        var err = innerArgs.shift();
			                        if (err) {
			                            subject.error(err);
			                            return;
			                        }
			                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
			                        subject.complete();
			                    };
			                    try {
			                        callbackFunc.apply(context, args.concat([handler]));
			                    }
			                    catch (err) {
			                        if (canReportError_1.canReportError(subject)) {
			                            subject.error(err);
			                        }
			                        else {
			                            console.warn(err);
			                        }
			                    }
			                }
			                return subject.subscribe(subscriber);
			            }
			            else {
			                return scheduler.schedule(dispatch$5, 0, { params: params, subscriber: subscriber, context: context });
			            }
			        });
			    };
			}
			bindNodeCallback$1.bindNodeCallback = bindNodeCallback;
			function dispatch$5(state) {
			    var _this = this;
			    var params = state.params, subscriber = state.subscriber, context = state.context;
			    var callbackFunc = params.callbackFunc, args = params.args, scheduler = params.scheduler;
			    var subject = params.subject;
			    if (!subject) {
			        subject = params.subject = new AsyncSubject_1$2.AsyncSubject();
			        var handler = function () {
			            var innerArgs = [];
			            for (var _i = 0; _i < arguments.length; _i++) {
			                innerArgs[_i] = arguments[_i];
			            }
			            var err = innerArgs.shift();
			            if (err) {
			                _this.add(scheduler.schedule(dispatchError, 0, { err: err, subject: subject }));
			            }
			            else {
			                var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
			                _this.add(scheduler.schedule(dispatchNext$2, 0, { value: value, subject: subject }));
			            }
			        };
			        try {
			            callbackFunc.apply(context, args.concat([handler]));
			        }
			        catch (err) {
			            this.add(scheduler.schedule(dispatchError, 0, { err: err, subject: subject }));
			        }
			    }
			    this.add(subject.subscribe(subscriber));
			}
			function dispatchNext$2(arg) {
			    var value = arg.value, subject = arg.subject;
			    subject.next(value);
			    subject.complete();
			}
			function dispatchError(arg) {
			    var err = arg.err, subject = arg.subject;
			    subject.error(err);
			}

			var combineLatest$3 = {};

			var OuterSubscriber$1 = {};

			var __extends$11 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(OuterSubscriber$1, "__esModule", { value: true });
			var Subscriber_1$D = Subscriber$1;
			var OuterSubscriber = (function (_super) {
			    __extends$11(OuterSubscriber, _super);
			    function OuterSubscriber() {
			        return _super !== null && _super.apply(this, arguments) || this;
			    }
			    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
			        this.destination.next(innerValue);
			    };
			    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
			        this.destination.error(error);
			    };
			    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
			        this.destination.complete();
			    };
			    return OuterSubscriber;
			}(Subscriber_1$D.Subscriber));
			OuterSubscriber$1.OuterSubscriber = OuterSubscriber;

			var subscribeToResult$1 = {};

			var InnerSubscriber$1 = {};

			var __extends$10 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(InnerSubscriber$1, "__esModule", { value: true });
			var Subscriber_1$C = Subscriber$1;
			var InnerSubscriber = (function (_super) {
			    __extends$10(InnerSubscriber, _super);
			    function InnerSubscriber(parent, outerValue, outerIndex) {
			        var _this = _super.call(this) || this;
			        _this.parent = parent;
			        _this.outerValue = outerValue;
			        _this.outerIndex = outerIndex;
			        _this.index = 0;
			        return _this;
			    }
			    InnerSubscriber.prototype._next = function (value) {
			        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
			    };
			    InnerSubscriber.prototype._error = function (error) {
			        this.parent.notifyError(error, this);
			        this.unsubscribe();
			    };
			    InnerSubscriber.prototype._complete = function () {
			        this.parent.notifyComplete(this);
			        this.unsubscribe();
			    };
			    return InnerSubscriber;
			}(Subscriber_1$C.Subscriber));
			InnerSubscriber$1.InnerSubscriber = InnerSubscriber;

			var subscribeTo = {};

			var subscribeToPromise = {};

			Object.defineProperty(subscribeToPromise, "__esModule", { value: true });
			var hostReportError_1 = hostReportError$1;
			subscribeToPromise.subscribeToPromise = function (promise) { return function (subscriber) {
			    promise.then(function (value) {
			        if (!subscriber.closed) {
			            subscriber.next(value);
			            subscriber.complete();
			        }
			    }, function (err) { return subscriber.error(err); })
			        .then(null, hostReportError_1.hostReportError);
			    return subscriber;
			}; };

			var subscribeToIterable = {};

			var iterator = {};

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			function getSymbolIterator() {
			    if (typeof Symbol !== 'function' || !Symbol.iterator) {
			        return '@@iterator';
			    }
			    return Symbol.iterator;
			}
			exports.getSymbolIterator = getSymbolIterator;
			exports.iterator = getSymbolIterator();
			exports.$$iterator = exports.iterator;

			}(iterator));

			Object.defineProperty(subscribeToIterable, "__esModule", { value: true });
			var iterator_1$4 = iterator;
			subscribeToIterable.subscribeToIterable = function (iterable) { return function (subscriber) {
			    var iterator = iterable[iterator_1$4.iterator]();
			    do {
			        var item = void 0;
			        try {
			            item = iterator.next();
			        }
			        catch (err) {
			            subscriber.error(err);
			            return subscriber;
			        }
			        if (item.done) {
			            subscriber.complete();
			            break;
			        }
			        subscriber.next(item.value);
			        if (subscriber.closed) {
			            break;
			        }
			    } while (true);
			    if (typeof iterator.return === 'function') {
			        subscriber.add(function () {
			            if (iterator.return) {
			                iterator.return();
			            }
			        });
			    }
			    return subscriber;
			}; };

			var subscribeToObservable = {};

			Object.defineProperty(subscribeToObservable, "__esModule", { value: true });
			var observable_1$4 = observable;
			subscribeToObservable.subscribeToObservable = function (obj) { return function (subscriber) {
			    var obs = obj[observable_1$4.observable]();
			    if (typeof obs.subscribe !== 'function') {
			        throw new TypeError('Provided object does not correctly implement Symbol.observable');
			    }
			    else {
			        return obs.subscribe(subscriber);
			    }
			}; };

			var isArrayLike = {};

			Object.defineProperty(isArrayLike, "__esModule", { value: true });
			isArrayLike.isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

			var isPromise$1 = {};

			Object.defineProperty(isPromise$1, "__esModule", { value: true });
			function isPromise(value) {
			    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
			}
			isPromise$1.isPromise = isPromise;

			Object.defineProperty(subscribeTo, "__esModule", { value: true });
			var subscribeToArray_1 = subscribeToArray;
			var subscribeToPromise_1 = subscribeToPromise;
			var subscribeToIterable_1 = subscribeToIterable;
			var subscribeToObservable_1 = subscribeToObservable;
			var isArrayLike_1$1 = isArrayLike;
			var isPromise_1$1 = isPromise$1;
			var isObject_1$1 = isObject$1;
			var iterator_1$3 = iterator;
			var observable_1$3 = observable;
			subscribeTo.subscribeTo = function (result) {
			    if (!!result && typeof result[observable_1$3.observable] === 'function') {
			        return subscribeToObservable_1.subscribeToObservable(result);
			    }
			    else if (isArrayLike_1$1.isArrayLike(result)) {
			        return subscribeToArray_1.subscribeToArray(result);
			    }
			    else if (isPromise_1$1.isPromise(result)) {
			        return subscribeToPromise_1.subscribeToPromise(result);
			    }
			    else if (!!result && typeof result[iterator_1$3.iterator] === 'function') {
			        return subscribeToIterable_1.subscribeToIterable(result);
			    }
			    else {
			        var value = isObject_1$1.isObject(result) ? 'an invalid object' : "'" + result + "'";
			        var msg = "You provided " + value + " where a stream was expected."
			            + ' You can provide an Observable, Promise, Array, or Iterable.';
			        throw new TypeError(msg);
			    }
			};

			Object.defineProperty(subscribeToResult$1, "__esModule", { value: true });
			var InnerSubscriber_1 = InnerSubscriber$1;
			var subscribeTo_1$3 = subscribeTo;
			var Observable_1$l = Observable$1;
			function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, innerSubscriber) {
			    if (innerSubscriber === void 0) { innerSubscriber = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex); }
			    if (innerSubscriber.closed) {
			        return undefined;
			    }
			    if (result instanceof Observable_1$l.Observable) {
			        return result.subscribe(innerSubscriber);
			    }
			    return subscribeTo_1$3.subscribeTo(result)(innerSubscriber);
			}
			subscribeToResult$1.subscribeToResult = subscribeToResult;

			var __extends$$ = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(combineLatest$3, "__esModule", { value: true });
			var isScheduler_1$6 = isScheduler$1;
			var isArray_1$a = isArray;
			var OuterSubscriber_1$6 = OuterSubscriber$1;
			var subscribeToResult_1$6 = subscribeToResult$1;
			var fromArray_1$3 = fromArray$1;
			var NONE = {};
			function combineLatest$2() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    var resultSelector = undefined;
			    var scheduler = undefined;
			    if (isScheduler_1$6.isScheduler(observables[observables.length - 1])) {
			        scheduler = observables.pop();
			    }
			    if (typeof observables[observables.length - 1] === 'function') {
			        resultSelector = observables.pop();
			    }
			    if (observables.length === 1 && isArray_1$a.isArray(observables[0])) {
			        observables = observables[0];
			    }
			    return fromArray_1$3.fromArray(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
			}
			combineLatest$3.combineLatest = combineLatest$2;
			var CombineLatestOperator = (function () {
			    function CombineLatestOperator(resultSelector) {
			        this.resultSelector = resultSelector;
			    }
			    CombineLatestOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
			    };
			    return CombineLatestOperator;
			}());
			combineLatest$3.CombineLatestOperator = CombineLatestOperator;
			var CombineLatestSubscriber = (function (_super) {
			    __extends$$(CombineLatestSubscriber, _super);
			    function CombineLatestSubscriber(destination, resultSelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.resultSelector = resultSelector;
			        _this.active = 0;
			        _this.values = [];
			        _this.observables = [];
			        return _this;
			    }
			    CombineLatestSubscriber.prototype._next = function (observable) {
			        this.values.push(NONE);
			        this.observables.push(observable);
			    };
			    CombineLatestSubscriber.prototype._complete = function () {
			        var observables = this.observables;
			        var len = observables.length;
			        if (len === 0) {
			            this.destination.complete();
			        }
			        else {
			            this.active = len;
			            this.toRespond = len;
			            for (var i = 0; i < len; i++) {
			                var observable = observables[i];
			                this.add(subscribeToResult_1$6.subscribeToResult(this, observable, undefined, i));
			            }
			        }
			    };
			    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
			        if ((this.active -= 1) === 0) {
			            this.destination.complete();
			        }
			    };
			    CombineLatestSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
			        var values = this.values;
			        var oldVal = values[outerIndex];
			        var toRespond = !this.toRespond
			            ? 0
			            : oldVal === NONE ? --this.toRespond : this.toRespond;
			        values[outerIndex] = innerValue;
			        if (toRespond === 0) {
			            if (this.resultSelector) {
			                this._tryResultSelector(values);
			            }
			            else {
			                this.destination.next(values.slice());
			            }
			        }
			    };
			    CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
			        var result;
			        try {
			            result = this.resultSelector.apply(this, values);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        this.destination.next(result);
			    };
			    return CombineLatestSubscriber;
			}(OuterSubscriber_1$6.OuterSubscriber));
			combineLatest$3.CombineLatestSubscriber = CombineLatestSubscriber;

			var concat$3 = {};

			var concatAll$1 = {};

			var mergeAll$1 = {};

			var mergeMap$1 = {};

			var from$1 = {};

			var scheduled$1 = {};

			var scheduleObservable$1 = {};

			Object.defineProperty(scheduleObservable$1, "__esModule", { value: true });
			var Observable_1$k = Observable$1;
			var Subscription_1$8 = Subscription$1;
			var observable_1$2 = observable;
			function scheduleObservable(input, scheduler) {
			    return new Observable_1$k.Observable(function (subscriber) {
			        var sub = new Subscription_1$8.Subscription();
			        sub.add(scheduler.schedule(function () {
			            var observable = input[observable_1$2.observable]();
			            sub.add(observable.subscribe({
			                next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
			                error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
			                complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
			            }));
			        }));
			        return sub;
			    });
			}
			scheduleObservable$1.scheduleObservable = scheduleObservable;

			var schedulePromise$1 = {};

			Object.defineProperty(schedulePromise$1, "__esModule", { value: true });
			var Observable_1$j = Observable$1;
			var Subscription_1$7 = Subscription$1;
			function schedulePromise(input, scheduler) {
			    return new Observable_1$j.Observable(function (subscriber) {
			        var sub = new Subscription_1$7.Subscription();
			        sub.add(scheduler.schedule(function () { return input.then(function (value) {
			            sub.add(scheduler.schedule(function () {
			                subscriber.next(value);
			                sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
			            }));
			        }, function (err) {
			            sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
			        }); }));
			        return sub;
			    });
			}
			schedulePromise$1.schedulePromise = schedulePromise;

			var scheduleIterable$1 = {};

			Object.defineProperty(scheduleIterable$1, "__esModule", { value: true });
			var Observable_1$i = Observable$1;
			var Subscription_1$6 = Subscription$1;
			var iterator_1$2 = iterator;
			function scheduleIterable(input, scheduler) {
			    if (!input) {
			        throw new Error('Iterable cannot be null');
			    }
			    return new Observable_1$i.Observable(function (subscriber) {
			        var sub = new Subscription_1$6.Subscription();
			        var iterator;
			        sub.add(function () {
			            if (iterator && typeof iterator.return === 'function') {
			                iterator.return();
			            }
			        });
			        sub.add(scheduler.schedule(function () {
			            iterator = input[iterator_1$2.iterator]();
			            sub.add(scheduler.schedule(function () {
			                if (subscriber.closed) {
			                    return;
			                }
			                var value;
			                var done;
			                try {
			                    var result = iterator.next();
			                    value = result.value;
			                    done = result.done;
			                }
			                catch (err) {
			                    subscriber.error(err);
			                    return;
			                }
			                if (done) {
			                    subscriber.complete();
			                }
			                else {
			                    subscriber.next(value);
			                    this.schedule();
			                }
			            }));
			        }));
			        return sub;
			    });
			}
			scheduleIterable$1.scheduleIterable = scheduleIterable;

			var isInteropObservable$1 = {};

			Object.defineProperty(isInteropObservable$1, "__esModule", { value: true });
			var observable_1$1 = observable;
			function isInteropObservable(input) {
			    return input && typeof input[observable_1$1.observable] === 'function';
			}
			isInteropObservable$1.isInteropObservable = isInteropObservable;

			var isIterable$1 = {};

			Object.defineProperty(isIterable$1, "__esModule", { value: true });
			var iterator_1$1 = iterator;
			function isIterable(input) {
			    return input && typeof input[iterator_1$1.iterator] === 'function';
			}
			isIterable$1.isIterable = isIterable;

			Object.defineProperty(scheduled$1, "__esModule", { value: true });
			var scheduleObservable_1 = scheduleObservable$1;
			var schedulePromise_1 = schedulePromise$1;
			var scheduleArray_1 = scheduleArray$1;
			var scheduleIterable_1 = scheduleIterable$1;
			var isInteropObservable_1 = isInteropObservable$1;
			var isPromise_1 = isPromise$1;
			var isArrayLike_1 = isArrayLike;
			var isIterable_1 = isIterable$1;
			function scheduled(input, scheduler) {
			    if (input != null) {
			        if (isInteropObservable_1.isInteropObservable(input)) {
			            return scheduleObservable_1.scheduleObservable(input, scheduler);
			        }
			        else if (isPromise_1.isPromise(input)) {
			            return schedulePromise_1.schedulePromise(input, scheduler);
			        }
			        else if (isArrayLike_1.isArrayLike(input)) {
			            return scheduleArray_1.scheduleArray(input, scheduler);
			        }
			        else if (isIterable_1.isIterable(input) || typeof input === 'string') {
			            return scheduleIterable_1.scheduleIterable(input, scheduler);
			        }
			    }
			    throw new TypeError((input !== null && typeof input || input) + ' is not observable');
			}
			scheduled$1.scheduled = scheduled;

			Object.defineProperty(from$1, "__esModule", { value: true });
			var Observable_1$h = Observable$1;
			var subscribeTo_1$2 = subscribeTo;
			var scheduled_1$1 = scheduled$1;
			function from(input, scheduler) {
			    if (!scheduler) {
			        if (input instanceof Observable_1$h.Observable) {
			            return input;
			        }
			        return new Observable_1$h.Observable(subscribeTo_1$2.subscribeTo(input));
			    }
			    else {
			        return scheduled_1$1.scheduled(input, scheduler);
			    }
			}
			from$1.from = from;

			var innerSubscribe$1 = {};

			var __extends$_ = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(innerSubscribe$1, "__esModule", { value: true });
			var Subscriber_1$B = Subscriber$1;
			var Observable_1$g = Observable$1;
			var subscribeTo_1$1 = subscribeTo;
			var SimpleInnerSubscriber = (function (_super) {
			    __extends$_(SimpleInnerSubscriber, _super);
			    function SimpleInnerSubscriber(parent) {
			        var _this = _super.call(this) || this;
			        _this.parent = parent;
			        return _this;
			    }
			    SimpleInnerSubscriber.prototype._next = function (value) {
			        this.parent.notifyNext(value);
			    };
			    SimpleInnerSubscriber.prototype._error = function (error) {
			        this.parent.notifyError(error);
			        this.unsubscribe();
			    };
			    SimpleInnerSubscriber.prototype._complete = function () {
			        this.parent.notifyComplete();
			        this.unsubscribe();
			    };
			    return SimpleInnerSubscriber;
			}(Subscriber_1$B.Subscriber));
			innerSubscribe$1.SimpleInnerSubscriber = SimpleInnerSubscriber;
			var ComplexInnerSubscriber = (function (_super) {
			    __extends$_(ComplexInnerSubscriber, _super);
			    function ComplexInnerSubscriber(parent, outerValue, outerIndex) {
			        var _this = _super.call(this) || this;
			        _this.parent = parent;
			        _this.outerValue = outerValue;
			        _this.outerIndex = outerIndex;
			        return _this;
			    }
			    ComplexInnerSubscriber.prototype._next = function (value) {
			        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this);
			    };
			    ComplexInnerSubscriber.prototype._error = function (error) {
			        this.parent.notifyError(error);
			        this.unsubscribe();
			    };
			    ComplexInnerSubscriber.prototype._complete = function () {
			        this.parent.notifyComplete(this);
			        this.unsubscribe();
			    };
			    return ComplexInnerSubscriber;
			}(Subscriber_1$B.Subscriber));
			innerSubscribe$1.ComplexInnerSubscriber = ComplexInnerSubscriber;
			var SimpleOuterSubscriber = (function (_super) {
			    __extends$_(SimpleOuterSubscriber, _super);
			    function SimpleOuterSubscriber() {
			        return _super !== null && _super.apply(this, arguments) || this;
			    }
			    SimpleOuterSubscriber.prototype.notifyNext = function (innerValue) {
			        this.destination.next(innerValue);
			    };
			    SimpleOuterSubscriber.prototype.notifyError = function (err) {
			        this.destination.error(err);
			    };
			    SimpleOuterSubscriber.prototype.notifyComplete = function () {
			        this.destination.complete();
			    };
			    return SimpleOuterSubscriber;
			}(Subscriber_1$B.Subscriber));
			innerSubscribe$1.SimpleOuterSubscriber = SimpleOuterSubscriber;
			var ComplexOuterSubscriber = (function (_super) {
			    __extends$_(ComplexOuterSubscriber, _super);
			    function ComplexOuterSubscriber() {
			        return _super !== null && _super.apply(this, arguments) || this;
			    }
			    ComplexOuterSubscriber.prototype.notifyNext = function (_outerValue, innerValue, _outerIndex, _innerSub) {
			        this.destination.next(innerValue);
			    };
			    ComplexOuterSubscriber.prototype.notifyError = function (error) {
			        this.destination.error(error);
			    };
			    ComplexOuterSubscriber.prototype.notifyComplete = function (_innerSub) {
			        this.destination.complete();
			    };
			    return ComplexOuterSubscriber;
			}(Subscriber_1$B.Subscriber));
			innerSubscribe$1.ComplexOuterSubscriber = ComplexOuterSubscriber;
			function innerSubscribe(result, innerSubscriber) {
			    if (innerSubscriber.closed) {
			        return undefined;
			    }
			    if (result instanceof Observable_1$g.Observable) {
			        return result.subscribe(innerSubscriber);
			    }
			    return subscribeTo_1$1.subscribeTo(result)(innerSubscriber);
			}
			innerSubscribe$1.innerSubscribe = innerSubscribe;

			var __extends$Z = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(mergeMap$1, "__esModule", { value: true });
			var map_1$9 = map$1;
			var from_1$9 = from$1;
			var innerSubscribe_1$k = innerSubscribe$1;
			function mergeMap(project, resultSelector, concurrent) {
			    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
			    if (typeof resultSelector === 'function') {
			        return function (source) { return source.pipe(mergeMap(function (a, i) { return from_1$9.from(project(a, i)).pipe(map_1$9.map(function (b, ii) { return resultSelector(a, b, i, ii); })); }, concurrent)); };
			    }
			    else if (typeof resultSelector === 'number') {
			        concurrent = resultSelector;
			    }
			    return function (source) { return source.lift(new MergeMapOperator(project, concurrent)); };
			}
			mergeMap$1.mergeMap = mergeMap;
			var MergeMapOperator = (function () {
			    function MergeMapOperator(project, concurrent) {
			        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
			        this.project = project;
			        this.concurrent = concurrent;
			    }
			    MergeMapOperator.prototype.call = function (observer, source) {
			        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
			    };
			    return MergeMapOperator;
			}());
			mergeMap$1.MergeMapOperator = MergeMapOperator;
			var MergeMapSubscriber = (function (_super) {
			    __extends$Z(MergeMapSubscriber, _super);
			    function MergeMapSubscriber(destination, project, concurrent) {
			        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
			        var _this = _super.call(this, destination) || this;
			        _this.project = project;
			        _this.concurrent = concurrent;
			        _this.hasCompleted = false;
			        _this.buffer = [];
			        _this.active = 0;
			        _this.index = 0;
			        return _this;
			    }
			    MergeMapSubscriber.prototype._next = function (value) {
			        if (this.active < this.concurrent) {
			            this._tryNext(value);
			        }
			        else {
			            this.buffer.push(value);
			        }
			    };
			    MergeMapSubscriber.prototype._tryNext = function (value) {
			        var result;
			        var index = this.index++;
			        try {
			            result = this.project(value, index);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        this.active++;
			        this._innerSub(result);
			    };
			    MergeMapSubscriber.prototype._innerSub = function (ish) {
			        var innerSubscriber = new innerSubscribe_1$k.SimpleInnerSubscriber(this);
			        var destination = this.destination;
			        destination.add(innerSubscriber);
			        var innerSubscription = innerSubscribe_1$k.innerSubscribe(ish, innerSubscriber);
			        if (innerSubscription !== innerSubscriber) {
			            destination.add(innerSubscription);
			        }
			    };
			    MergeMapSubscriber.prototype._complete = function () {
			        this.hasCompleted = true;
			        if (this.active === 0 && this.buffer.length === 0) {
			            this.destination.complete();
			        }
			        this.unsubscribe();
			    };
			    MergeMapSubscriber.prototype.notifyNext = function (innerValue) {
			        this.destination.next(innerValue);
			    };
			    MergeMapSubscriber.prototype.notifyComplete = function () {
			        var buffer = this.buffer;
			        this.active--;
			        if (buffer.length > 0) {
			            this._next(buffer.shift());
			        }
			        else if (this.active === 0 && this.hasCompleted) {
			            this.destination.complete();
			        }
			    };
			    return MergeMapSubscriber;
			}(innerSubscribe_1$k.SimpleOuterSubscriber));
			mergeMap$1.MergeMapSubscriber = MergeMapSubscriber;
			mergeMap$1.flatMap = mergeMap;

			Object.defineProperty(mergeAll$1, "__esModule", { value: true });
			var mergeMap_1$3 = mergeMap$1;
			var identity_1$5 = identity$1;
			function mergeAll(concurrent) {
			    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
			    return mergeMap_1$3.mergeMap(identity_1$5.identity, concurrent);
			}
			mergeAll$1.mergeAll = mergeAll;

			Object.defineProperty(concatAll$1, "__esModule", { value: true });
			var mergeAll_1$2 = mergeAll$1;
			function concatAll() {
			    return mergeAll_1$2.mergeAll(1);
			}
			concatAll$1.concatAll = concatAll;

			Object.defineProperty(concat$3, "__esModule", { value: true });
			var of_1$2 = of$1;
			var concatAll_1$1 = concatAll$1;
			function concat$2() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    return concatAll_1$1.concatAll()(of_1$2.of.apply(void 0, observables));
			}
			concat$3.concat = concat$2;

			var defer$1 = {};

			Object.defineProperty(defer$1, "__esModule", { value: true });
			var Observable_1$f = Observable$1;
			var from_1$8 = from$1;
			var empty_1$7 = empty;
			function defer(observableFactory) {
			    return new Observable_1$f.Observable(function (subscriber) {
			        var input;
			        try {
			            input = observableFactory();
			        }
			        catch (err) {
			            subscriber.error(err);
			            return undefined;
			        }
			        var source = input ? from_1$8.from(input) : empty_1$7.empty();
			        return source.subscribe(subscriber);
			    });
			}
			defer$1.defer = defer;

			var forkJoin$1 = {};

			Object.defineProperty(forkJoin$1, "__esModule", { value: true });
			var Observable_1$e = Observable$1;
			var isArray_1$9 = isArray;
			var map_1$8 = map$1;
			var isObject_1 = isObject$1;
			var from_1$7 = from$1;
			function forkJoin() {
			    var sources = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        sources[_i] = arguments[_i];
			    }
			    if (sources.length === 1) {
			        var first_1 = sources[0];
			        if (isArray_1$9.isArray(first_1)) {
			            return forkJoinInternal(first_1, null);
			        }
			        if (isObject_1.isObject(first_1) && Object.getPrototypeOf(first_1) === Object.prototype) {
			            var keys = Object.keys(first_1);
			            return forkJoinInternal(keys.map(function (key) { return first_1[key]; }), keys);
			        }
			    }
			    if (typeof sources[sources.length - 1] === 'function') {
			        var resultSelector_1 = sources.pop();
			        sources = (sources.length === 1 && isArray_1$9.isArray(sources[0])) ? sources[0] : sources;
			        return forkJoinInternal(sources, null).pipe(map_1$8.map(function (args) { return resultSelector_1.apply(void 0, args); }));
			    }
			    return forkJoinInternal(sources, null);
			}
			forkJoin$1.forkJoin = forkJoin;
			function forkJoinInternal(sources, keys) {
			    return new Observable_1$e.Observable(function (subscriber) {
			        var len = sources.length;
			        if (len === 0) {
			            subscriber.complete();
			            return;
			        }
			        var values = new Array(len);
			        var completed = 0;
			        var emitted = 0;
			        var _loop_1 = function (i) {
			            var source = from_1$7.from(sources[i]);
			            var hasValue = false;
			            subscriber.add(source.subscribe({
			                next: function (value) {
			                    if (!hasValue) {
			                        hasValue = true;
			                        emitted++;
			                    }
			                    values[i] = value;
			                },
			                error: function (err) { return subscriber.error(err); },
			                complete: function () {
			                    completed++;
			                    if (completed === len || !hasValue) {
			                        if (emitted === len) {
			                            subscriber.next(keys ?
			                                keys.reduce(function (result, key, i) { return (result[key] = values[i], result); }, {}) :
			                                values);
			                        }
			                        subscriber.complete();
			                    }
			                }
			            }));
			        };
			        for (var i = 0; i < len; i++) {
			            _loop_1(i);
			        }
			    });
			}

			var fromEvent$1 = {};

			Object.defineProperty(fromEvent$1, "__esModule", { value: true });
			var Observable_1$d = Observable$1;
			var isArray_1$8 = isArray;
			var isFunction_1$2 = isFunction$1;
			var map_1$7 = map$1;
			function fromEvent(target, eventName, options, resultSelector) {
			    if (isFunction_1$2.isFunction(options)) {
			        resultSelector = options;
			        options = undefined;
			    }
			    if (resultSelector) {
			        return fromEvent(target, eventName, options).pipe(map_1$7.map(function (args) { return isArray_1$8.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
			    }
			    return new Observable_1$d.Observable(function (subscriber) {
			        function handler(e) {
			            if (arguments.length > 1) {
			                subscriber.next(Array.prototype.slice.call(arguments));
			            }
			            else {
			                subscriber.next(e);
			            }
			        }
			        setupSubscription(target, eventName, handler, subscriber, options);
			    });
			}
			fromEvent$1.fromEvent = fromEvent;
			function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
			    var unsubscribe;
			    if (isEventTarget(sourceObj)) {
			        var source_1 = sourceObj;
			        sourceObj.addEventListener(eventName, handler, options);
			        unsubscribe = function () { return source_1.removeEventListener(eventName, handler, options); };
			    }
			    else if (isJQueryStyleEventEmitter(sourceObj)) {
			        var source_2 = sourceObj;
			        sourceObj.on(eventName, handler);
			        unsubscribe = function () { return source_2.off(eventName, handler); };
			    }
			    else if (isNodeStyleEventEmitter(sourceObj)) {
			        var source_3 = sourceObj;
			        sourceObj.addListener(eventName, handler);
			        unsubscribe = function () { return source_3.removeListener(eventName, handler); };
			    }
			    else if (sourceObj && sourceObj.length) {
			        for (var i = 0, len = sourceObj.length; i < len; i++) {
			            setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
			        }
			    }
			    else {
			        throw new TypeError('Invalid event target');
			    }
			    subscriber.add(unsubscribe);
			}
			function isNodeStyleEventEmitter(sourceObj) {
			    return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
			}
			function isJQueryStyleEventEmitter(sourceObj) {
			    return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
			}
			function isEventTarget(sourceObj) {
			    return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
			}

			var fromEventPattern$1 = {};

			Object.defineProperty(fromEventPattern$1, "__esModule", { value: true });
			var Observable_1$c = Observable$1;
			var isArray_1$7 = isArray;
			var isFunction_1$1 = isFunction$1;
			var map_1$6 = map$1;
			function fromEventPattern(addHandler, removeHandler, resultSelector) {
			    if (resultSelector) {
			        return fromEventPattern(addHandler, removeHandler).pipe(map_1$6.map(function (args) { return isArray_1$7.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
			    }
			    return new Observable_1$c.Observable(function (subscriber) {
			        var handler = function () {
			            var e = [];
			            for (var _i = 0; _i < arguments.length; _i++) {
			                e[_i] = arguments[_i];
			            }
			            return subscriber.next(e.length === 1 ? e[0] : e);
			        };
			        var retValue;
			        try {
			            retValue = addHandler(handler);
			        }
			        catch (err) {
			            subscriber.error(err);
			            return undefined;
			        }
			        if (!isFunction_1$1.isFunction(removeHandler)) {
			            return undefined;
			        }
			        return function () { return removeHandler(handler, retValue); };
			    });
			}
			fromEventPattern$1.fromEventPattern = fromEventPattern;

			var generate$1 = {};

			Object.defineProperty(generate$1, "__esModule", { value: true });
			var Observable_1$b = Observable$1;
			var identity_1$4 = identity$1;
			var isScheduler_1$5 = isScheduler$1;
			function generate(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
			    var resultSelector;
			    var initialState;
			    if (arguments.length == 1) {
			        var options = initialStateOrOptions;
			        initialState = options.initialState;
			        condition = options.condition;
			        iterate = options.iterate;
			        resultSelector = options.resultSelector || identity_1$4.identity;
			        scheduler = options.scheduler;
			    }
			    else if (resultSelectorOrObservable === undefined || isScheduler_1$5.isScheduler(resultSelectorOrObservable)) {
			        initialState = initialStateOrOptions;
			        resultSelector = identity_1$4.identity;
			        scheduler = resultSelectorOrObservable;
			    }
			    else {
			        initialState = initialStateOrOptions;
			        resultSelector = resultSelectorOrObservable;
			    }
			    return new Observable_1$b.Observable(function (subscriber) {
			        var state = initialState;
			        if (scheduler) {
			            return scheduler.schedule(dispatch$4, 0, {
			                subscriber: subscriber,
			                iterate: iterate,
			                condition: condition,
			                resultSelector: resultSelector,
			                state: state
			            });
			        }
			        do {
			            if (condition) {
			                var conditionResult = void 0;
			                try {
			                    conditionResult = condition(state);
			                }
			                catch (err) {
			                    subscriber.error(err);
			                    return undefined;
			                }
			                if (!conditionResult) {
			                    subscriber.complete();
			                    break;
			                }
			            }
			            var value = void 0;
			            try {
			                value = resultSelector(state);
			            }
			            catch (err) {
			                subscriber.error(err);
			                return undefined;
			            }
			            subscriber.next(value);
			            if (subscriber.closed) {
			                break;
			            }
			            try {
			                state = iterate(state);
			            }
			            catch (err) {
			                subscriber.error(err);
			                return undefined;
			            }
			        } while (true);
			        return undefined;
			    });
			}
			generate$1.generate = generate;
			function dispatch$4(state) {
			    var subscriber = state.subscriber, condition = state.condition;
			    if (subscriber.closed) {
			        return undefined;
			    }
			    if (state.needIterate) {
			        try {
			            state.state = state.iterate(state.state);
			        }
			        catch (err) {
			            subscriber.error(err);
			            return undefined;
			        }
			    }
			    else {
			        state.needIterate = true;
			    }
			    if (condition) {
			        var conditionResult = void 0;
			        try {
			            conditionResult = condition(state.state);
			        }
			        catch (err) {
			            subscriber.error(err);
			            return undefined;
			        }
			        if (!conditionResult) {
			            subscriber.complete();
			            return undefined;
			        }
			        if (subscriber.closed) {
			            return undefined;
			        }
			    }
			    var value;
			    try {
			        value = state.resultSelector(state.state);
			    }
			    catch (err) {
			        subscriber.error(err);
			        return undefined;
			    }
			    if (subscriber.closed) {
			        return undefined;
			    }
			    subscriber.next(value);
			    if (subscriber.closed) {
			        return undefined;
			    }
			    return this.schedule(state);
			}

			var iif$1 = {};

			Object.defineProperty(iif$1, "__esModule", { value: true });
			var defer_1$2 = defer$1;
			var empty_1$6 = empty;
			function iif(condition, trueResult, falseResult) {
			    if (trueResult === void 0) { trueResult = empty_1$6.EMPTY; }
			    if (falseResult === void 0) { falseResult = empty_1$6.EMPTY; }
			    return defer_1$2.defer(function () { return condition() ? trueResult : falseResult; });
			}
			iif$1.iif = iif;

			var interval$1 = {};

			var isNumeric$1 = {};

			Object.defineProperty(isNumeric$1, "__esModule", { value: true });
			var isArray_1$6 = isArray;
			function isNumeric(val) {
			    return !isArray_1$6.isArray(val) && (val - parseFloat(val) + 1) >= 0;
			}
			isNumeric$1.isNumeric = isNumeric;

			Object.defineProperty(interval$1, "__esModule", { value: true });
			var Observable_1$a = Observable$1;
			var async_1$d = async;
			var isNumeric_1$3 = isNumeric$1;
			function interval(period, scheduler) {
			    if (period === void 0) { period = 0; }
			    if (scheduler === void 0) { scheduler = async_1$d.async; }
			    if (!isNumeric_1$3.isNumeric(period) || period < 0) {
			        period = 0;
			    }
			    if (!scheduler || typeof scheduler.schedule !== 'function') {
			        scheduler = async_1$d.async;
			    }
			    return new Observable_1$a.Observable(function (subscriber) {
			        subscriber.add(scheduler.schedule(dispatch$3, period, { subscriber: subscriber, counter: 0, period: period }));
			        return subscriber;
			    });
			}
			interval$1.interval = interval;
			function dispatch$3(state) {
			    var subscriber = state.subscriber, counter = state.counter, period = state.period;
			    subscriber.next(counter);
			    this.schedule({ subscriber: subscriber, counter: counter + 1, period: period }, period);
			}

			var merge$3 = {};

			Object.defineProperty(merge$3, "__esModule", { value: true });
			var Observable_1$9 = Observable$1;
			var isScheduler_1$4 = isScheduler$1;
			var mergeAll_1$1 = mergeAll$1;
			var fromArray_1$2 = fromArray$1;
			function merge$2() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    var concurrent = Number.POSITIVE_INFINITY;
			    var scheduler = null;
			    var last = observables[observables.length - 1];
			    if (isScheduler_1$4.isScheduler(last)) {
			        scheduler = observables.pop();
			        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
			            concurrent = observables.pop();
			        }
			    }
			    else if (typeof last === 'number') {
			        concurrent = observables.pop();
			    }
			    if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable_1$9.Observable) {
			        return observables[0];
			    }
			    return mergeAll_1$1.mergeAll(concurrent)(fromArray_1$2.fromArray(observables, scheduler));
			}
			merge$3.merge = merge$2;

			var never = {};

			(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			var Observable_1 = Observable$1;
			var noop_1 = noop$1;
			exports.NEVER = new Observable_1.Observable(noop_1.noop);
			function never() {
			    return exports.NEVER;
			}
			exports.never = never;

			}(never));

			var onErrorResumeNext$3 = {};

			Object.defineProperty(onErrorResumeNext$3, "__esModule", { value: true });
			var Observable_1$8 = Observable$1;
			var from_1$6 = from$1;
			var isArray_1$5 = isArray;
			var empty_1$5 = empty;
			function onErrorResumeNext$2() {
			    var sources = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        sources[_i] = arguments[_i];
			    }
			    if (sources.length === 0) {
			        return empty_1$5.EMPTY;
			    }
			    var first = sources[0], remainder = sources.slice(1);
			    if (sources.length === 1 && isArray_1$5.isArray(first)) {
			        return onErrorResumeNext$2.apply(void 0, first);
			    }
			    return new Observable_1$8.Observable(function (subscriber) {
			        var subNext = function () { return subscriber.add(onErrorResumeNext$2.apply(void 0, remainder).subscribe(subscriber)); };
			        return from_1$6.from(first).subscribe({
			            next: function (value) { subscriber.next(value); },
			            error: subNext,
			            complete: subNext,
			        });
			    });
			}
			onErrorResumeNext$3.onErrorResumeNext = onErrorResumeNext$2;

			var pairs$1 = {};

			Object.defineProperty(pairs$1, "__esModule", { value: true });
			var Observable_1$7 = Observable$1;
			var Subscription_1$5 = Subscription$1;
			function pairs(obj, scheduler) {
			    if (!scheduler) {
			        return new Observable_1$7.Observable(function (subscriber) {
			            var keys = Object.keys(obj);
			            for (var i = 0; i < keys.length && !subscriber.closed; i++) {
			                var key = keys[i];
			                if (obj.hasOwnProperty(key)) {
			                    subscriber.next([key, obj[key]]);
			                }
			            }
			            subscriber.complete();
			        });
			    }
			    else {
			        return new Observable_1$7.Observable(function (subscriber) {
			            var keys = Object.keys(obj);
			            var subscription = new Subscription_1$5.Subscription();
			            subscription.add(scheduler.schedule(dispatch$2, 0, { keys: keys, index: 0, subscriber: subscriber, subscription: subscription, obj: obj }));
			            return subscription;
			        });
			    }
			}
			pairs$1.pairs = pairs;
			function dispatch$2(state) {
			    var keys = state.keys, index = state.index, subscriber = state.subscriber, subscription = state.subscription, obj = state.obj;
			    if (!subscriber.closed) {
			        if (index < keys.length) {
			            var key = keys[index];
			            subscriber.next([key, obj[key]]);
			            subscription.add(this.schedule({ keys: keys, index: index + 1, subscriber: subscriber, subscription: subscription, obj: obj }));
			        }
			        else {
			            subscriber.complete();
			        }
			    }
			}
			pairs$1.dispatch = dispatch$2;

			var partition$3 = {};

			var not$1 = {};

			Object.defineProperty(not$1, "__esModule", { value: true });
			function not(pred, thisArg) {
			    function notPred() {
			        return !(notPred.pred.apply(notPred.thisArg, arguments));
			    }
			    notPred.pred = pred;
			    notPred.thisArg = thisArg;
			    return notPred;
			}
			not$1.not = not;

			var filter$3 = {};

			var __extends$Y = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(filter$3, "__esModule", { value: true });
			var Subscriber_1$A = Subscriber$1;
			function filter$2(predicate, thisArg) {
			    return function filterOperatorFunction(source) {
			        return source.lift(new FilterOperator(predicate, thisArg));
			    };
			}
			filter$3.filter = filter$2;
			var FilterOperator = (function () {
			    function FilterOperator(predicate, thisArg) {
			        this.predicate = predicate;
			        this.thisArg = thisArg;
			    }
			    FilterOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
			    };
			    return FilterOperator;
			}());
			var FilterSubscriber = (function (_super) {
			    __extends$Y(FilterSubscriber, _super);
			    function FilterSubscriber(destination, predicate, thisArg) {
			        var _this = _super.call(this, destination) || this;
			        _this.predicate = predicate;
			        _this.thisArg = thisArg;
			        _this.count = 0;
			        return _this;
			    }
			    FilterSubscriber.prototype._next = function (value) {
			        var result;
			        try {
			            result = this.predicate.call(this.thisArg, value, this.count++);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        if (result) {
			            this.destination.next(value);
			        }
			    };
			    return FilterSubscriber;
			}(Subscriber_1$A.Subscriber));

			Object.defineProperty(partition$3, "__esModule", { value: true });
			var not_1$1 = not$1;
			var subscribeTo_1 = subscribeTo;
			var filter_1$5 = filter$3;
			var Observable_1$6 = Observable$1;
			function partition$2(source, predicate, thisArg) {
			    return [
			        filter_1$5.filter(predicate, thisArg)(new Observable_1$6.Observable(subscribeTo_1.subscribeTo(source))),
			        filter_1$5.filter(not_1$1.not(predicate, thisArg))(new Observable_1$6.Observable(subscribeTo_1.subscribeTo(source)))
			    ];
			}
			partition$3.partition = partition$2;

			var race$3 = {};

			var __extends$X = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(race$3, "__esModule", { value: true });
			var isArray_1$4 = isArray;
			var fromArray_1$1 = fromArray$1;
			var OuterSubscriber_1$5 = OuterSubscriber$1;
			var subscribeToResult_1$5 = subscribeToResult$1;
			function race$2() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    if (observables.length === 1) {
			        if (isArray_1$4.isArray(observables[0])) {
			            observables = observables[0];
			        }
			        else {
			            return observables[0];
			        }
			    }
			    return fromArray_1$1.fromArray(observables, undefined).lift(new RaceOperator());
			}
			race$3.race = race$2;
			var RaceOperator = (function () {
			    function RaceOperator() {
			    }
			    RaceOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new RaceSubscriber(subscriber));
			    };
			    return RaceOperator;
			}());
			race$3.RaceOperator = RaceOperator;
			var RaceSubscriber = (function (_super) {
			    __extends$X(RaceSubscriber, _super);
			    function RaceSubscriber(destination) {
			        var _this = _super.call(this, destination) || this;
			        _this.hasFirst = false;
			        _this.observables = [];
			        _this.subscriptions = [];
			        return _this;
			    }
			    RaceSubscriber.prototype._next = function (observable) {
			        this.observables.push(observable);
			    };
			    RaceSubscriber.prototype._complete = function () {
			        var observables = this.observables;
			        var len = observables.length;
			        if (len === 0) {
			            this.destination.complete();
			        }
			        else {
			            for (var i = 0; i < len && !this.hasFirst; i++) {
			                var observable = observables[i];
			                var subscription = subscribeToResult_1$5.subscribeToResult(this, observable, undefined, i);
			                if (this.subscriptions) {
			                    this.subscriptions.push(subscription);
			                }
			                this.add(subscription);
			            }
			            this.observables = null;
			        }
			    };
			    RaceSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
			        if (!this.hasFirst) {
			            this.hasFirst = true;
			            for (var i = 0; i < this.subscriptions.length; i++) {
			                if (i !== outerIndex) {
			                    var subscription = this.subscriptions[i];
			                    subscription.unsubscribe();
			                    this.remove(subscription);
			                }
			            }
			            this.subscriptions = null;
			        }
			        this.destination.next(innerValue);
			    };
			    return RaceSubscriber;
			}(OuterSubscriber_1$5.OuterSubscriber));
			race$3.RaceSubscriber = RaceSubscriber;

			var range$1 = {};

			Object.defineProperty(range$1, "__esModule", { value: true });
			var Observable_1$5 = Observable$1;
			function range(start, count, scheduler) {
			    if (start === void 0) { start = 0; }
			    return new Observable_1$5.Observable(function (subscriber) {
			        if (count === undefined) {
			            count = start;
			            start = 0;
			        }
			        var index = 0;
			        var current = start;
			        if (scheduler) {
			            return scheduler.schedule(dispatch$1, 0, {
			                index: index, count: count, start: start, subscriber: subscriber
			            });
			        }
			        else {
			            do {
			                if (index++ >= count) {
			                    subscriber.complete();
			                    break;
			                }
			                subscriber.next(current++);
			                if (subscriber.closed) {
			                    break;
			                }
			            } while (true);
			        }
			        return undefined;
			    });
			}
			range$1.range = range;
			function dispatch$1(state) {
			    var start = state.start, index = state.index, count = state.count, subscriber = state.subscriber;
			    if (index >= count) {
			        subscriber.complete();
			        return;
			    }
			    subscriber.next(start);
			    if (subscriber.closed) {
			        return;
			    }
			    state.index = index + 1;
			    state.start = start + 1;
			    this.schedule(state);
			}
			range$1.dispatch = dispatch$1;

			var timer$1 = {};

			Object.defineProperty(timer$1, "__esModule", { value: true });
			var Observable_1$4 = Observable$1;
			var async_1$c = async;
			var isNumeric_1$2 = isNumeric$1;
			var isScheduler_1$3 = isScheduler$1;
			function timer(dueTime, periodOrScheduler, scheduler) {
			    if (dueTime === void 0) { dueTime = 0; }
			    var period = -1;
			    if (isNumeric_1$2.isNumeric(periodOrScheduler)) {
			        period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
			    }
			    else if (isScheduler_1$3.isScheduler(periodOrScheduler)) {
			        scheduler = periodOrScheduler;
			    }
			    if (!isScheduler_1$3.isScheduler(scheduler)) {
			        scheduler = async_1$c.async;
			    }
			    return new Observable_1$4.Observable(function (subscriber) {
			        var due = isNumeric_1$2.isNumeric(dueTime)
			            ? dueTime
			            : (+dueTime - scheduler.now());
			        return scheduler.schedule(dispatch, due, {
			            index: 0, period: period, subscriber: subscriber
			        });
			    });
			}
			timer$1.timer = timer;
			function dispatch(state) {
			    var index = state.index, period = state.period, subscriber = state.subscriber;
			    subscriber.next(index);
			    if (subscriber.closed) {
			        return;
			    }
			    else if (period === -1) {
			        return subscriber.complete();
			    }
			    state.index = index + 1;
			    this.schedule(state, period);
			}

			var using$1 = {};

			Object.defineProperty(using$1, "__esModule", { value: true });
			var Observable_1$3 = Observable$1;
			var from_1$5 = from$1;
			var empty_1$4 = empty;
			function using(resourceFactory, observableFactory) {
			    return new Observable_1$3.Observable(function (subscriber) {
			        var resource;
			        try {
			            resource = resourceFactory();
			        }
			        catch (err) {
			            subscriber.error(err);
			            return undefined;
			        }
			        var result;
			        try {
			            result = observableFactory(resource);
			        }
			        catch (err) {
			            subscriber.error(err);
			            return undefined;
			        }
			        var source = result ? from_1$5.from(result) : empty_1$4.EMPTY;
			        var subscription = source.subscribe(subscriber);
			        return function () {
			            subscription.unsubscribe();
			            if (resource) {
			                resource.unsubscribe();
			            }
			        };
			    });
			}
			using$1.using = using;

			var zip$3 = {};

			var __extends$W = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(zip$3, "__esModule", { value: true });
			var fromArray_1 = fromArray$1;
			var isArray_1$3 = isArray;
			var Subscriber_1$z = Subscriber$1;
			var iterator_1 = iterator;
			var innerSubscribe_1$j = innerSubscribe$1;
			function zip$2() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    var resultSelector = observables[observables.length - 1];
			    if (typeof resultSelector === 'function') {
			        observables.pop();
			    }
			    return fromArray_1.fromArray(observables, undefined).lift(new ZipOperator(resultSelector));
			}
			zip$3.zip = zip$2;
			var ZipOperator = (function () {
			    function ZipOperator(resultSelector) {
			        this.resultSelector = resultSelector;
			    }
			    ZipOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
			    };
			    return ZipOperator;
			}());
			zip$3.ZipOperator = ZipOperator;
			var ZipSubscriber = (function (_super) {
			    __extends$W(ZipSubscriber, _super);
			    function ZipSubscriber(destination, resultSelector, values) {
			        var _this = _super.call(this, destination) || this;
			        _this.resultSelector = resultSelector;
			        _this.iterators = [];
			        _this.active = 0;
			        _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : undefined;
			        return _this;
			    }
			    ZipSubscriber.prototype._next = function (value) {
			        var iterators = this.iterators;
			        if (isArray_1$3.isArray(value)) {
			            iterators.push(new StaticArrayIterator(value));
			        }
			        else if (typeof value[iterator_1.iterator] === 'function') {
			            iterators.push(new StaticIterator(value[iterator_1.iterator]()));
			        }
			        else {
			            iterators.push(new ZipBufferIterator(this.destination, this, value));
			        }
			    };
			    ZipSubscriber.prototype._complete = function () {
			        var iterators = this.iterators;
			        var len = iterators.length;
			        this.unsubscribe();
			        if (len === 0) {
			            this.destination.complete();
			            return;
			        }
			        this.active = len;
			        for (var i = 0; i < len; i++) {
			            var iterator = iterators[i];
			            if (iterator.stillUnsubscribed) {
			                var destination = this.destination;
			                destination.add(iterator.subscribe());
			            }
			            else {
			                this.active--;
			            }
			        }
			    };
			    ZipSubscriber.prototype.notifyInactive = function () {
			        this.active--;
			        if (this.active === 0) {
			            this.destination.complete();
			        }
			    };
			    ZipSubscriber.prototype.checkIterators = function () {
			        var iterators = this.iterators;
			        var len = iterators.length;
			        var destination = this.destination;
			        for (var i = 0; i < len; i++) {
			            var iterator = iterators[i];
			            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
			                return;
			            }
			        }
			        var shouldComplete = false;
			        var args = [];
			        for (var i = 0; i < len; i++) {
			            var iterator = iterators[i];
			            var result = iterator.next();
			            if (iterator.hasCompleted()) {
			                shouldComplete = true;
			            }
			            if (result.done) {
			                destination.complete();
			                return;
			            }
			            args.push(result.value);
			        }
			        if (this.resultSelector) {
			            this._tryresultSelector(args);
			        }
			        else {
			            destination.next(args);
			        }
			        if (shouldComplete) {
			            destination.complete();
			        }
			    };
			    ZipSubscriber.prototype._tryresultSelector = function (args) {
			        var result;
			        try {
			            result = this.resultSelector.apply(this, args);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        this.destination.next(result);
			    };
			    return ZipSubscriber;
			}(Subscriber_1$z.Subscriber));
			zip$3.ZipSubscriber = ZipSubscriber;
			var StaticIterator = (function () {
			    function StaticIterator(iterator) {
			        this.iterator = iterator;
			        this.nextResult = iterator.next();
			    }
			    StaticIterator.prototype.hasValue = function () {
			        return true;
			    };
			    StaticIterator.prototype.next = function () {
			        var result = this.nextResult;
			        this.nextResult = this.iterator.next();
			        return result;
			    };
			    StaticIterator.prototype.hasCompleted = function () {
			        var nextResult = this.nextResult;
			        return Boolean(nextResult && nextResult.done);
			    };
			    return StaticIterator;
			}());
			var StaticArrayIterator = (function () {
			    function StaticArrayIterator(array) {
			        this.array = array;
			        this.index = 0;
			        this.length = 0;
			        this.length = array.length;
			    }
			    StaticArrayIterator.prototype[iterator_1.iterator] = function () {
			        return this;
			    };
			    StaticArrayIterator.prototype.next = function (value) {
			        var i = this.index++;
			        var array = this.array;
			        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
			    };
			    StaticArrayIterator.prototype.hasValue = function () {
			        return this.array.length > this.index;
			    };
			    StaticArrayIterator.prototype.hasCompleted = function () {
			        return this.array.length === this.index;
			    };
			    return StaticArrayIterator;
			}());
			var ZipBufferIterator = (function (_super) {
			    __extends$W(ZipBufferIterator, _super);
			    function ZipBufferIterator(destination, parent, observable) {
			        var _this = _super.call(this, destination) || this;
			        _this.parent = parent;
			        _this.observable = observable;
			        _this.stillUnsubscribed = true;
			        _this.buffer = [];
			        _this.isComplete = false;
			        return _this;
			    }
			    ZipBufferIterator.prototype[iterator_1.iterator] = function () {
			        return this;
			    };
			    ZipBufferIterator.prototype.next = function () {
			        var buffer = this.buffer;
			        if (buffer.length === 0 && this.isComplete) {
			            return { value: null, done: true };
			        }
			        else {
			            return { value: buffer.shift(), done: false };
			        }
			    };
			    ZipBufferIterator.prototype.hasValue = function () {
			        return this.buffer.length > 0;
			    };
			    ZipBufferIterator.prototype.hasCompleted = function () {
			        return this.buffer.length === 0 && this.isComplete;
			    };
			    ZipBufferIterator.prototype.notifyComplete = function () {
			        if (this.buffer.length > 0) {
			            this.isComplete = true;
			            this.parent.notifyInactive();
			        }
			        else {
			            this.destination.complete();
			        }
			    };
			    ZipBufferIterator.prototype.notifyNext = function (innerValue) {
			        this.buffer.push(innerValue);
			        this.parent.checkIterators();
			    };
			    ZipBufferIterator.prototype.subscribe = function () {
			        return innerSubscribe_1$j.innerSubscribe(this.observable, new innerSubscribe_1$j.SimpleInnerSubscriber(this));
			    };
			    return ZipBufferIterator;
			}(innerSubscribe_1$j.SimpleOuterSubscriber));

			Object.defineProperty(rxjs, "__esModule", { value: true });
			var Observable_1$2 = Observable$1;
			rxjs.Observable = Observable_1$2.Observable;
			var ConnectableObservable_1$1 = ConnectableObservable$1;
			rxjs.ConnectableObservable = ConnectableObservable_1$1.ConnectableObservable;
			var groupBy_1$1 = groupBy$1;
			rxjs.GroupedObservable = groupBy_1$1.GroupedObservable;
			var observable_1 = observable;
			rxjs.observable = observable_1.observable;
			var Subject_1$9 = Subject$1;
			rxjs.Subject = Subject_1$9.Subject;
			var BehaviorSubject_1$1 = BehaviorSubject$1;
			rxjs.BehaviorSubject = BehaviorSubject_1$1.BehaviorSubject;
			var ReplaySubject_1$2 = ReplaySubject$1;
			rxjs.ReplaySubject = ReplaySubject_1$2.ReplaySubject;
			var AsyncSubject_1$1 = AsyncSubject$1;
			rxjs.AsyncSubject = AsyncSubject_1$1.AsyncSubject;
			var asap_1$1 = asap;
			rxjs.asap = asap_1$1.asap;
			rxjs.asapScheduler = asap_1$1.asapScheduler;
			var async_1$b = async;
			rxjs.async = async_1$b.async;
			rxjs.asyncScheduler = async_1$b.asyncScheduler;
			var queue_1 = queue;
			rxjs.queue = queue_1.queue;
			rxjs.queueScheduler = queue_1.queueScheduler;
			var animationFrame_1 = animationFrame;
			rxjs.animationFrame = animationFrame_1.animationFrame;
			rxjs.animationFrameScheduler = animationFrame_1.animationFrameScheduler;
			var VirtualTimeScheduler_1 = VirtualTimeScheduler$1;
			rxjs.VirtualTimeScheduler = VirtualTimeScheduler_1.VirtualTimeScheduler;
			rxjs.VirtualAction = VirtualTimeScheduler_1.VirtualAction;
			var Scheduler_1 = Scheduler$1;
			rxjs.Scheduler = Scheduler_1.Scheduler;
			var Subscription_1$4 = Subscription$1;
			rxjs.Subscription = Subscription_1$4.Subscription;
			var Subscriber_1$y = Subscriber$1;
			rxjs.Subscriber = Subscriber_1$y.Subscriber;
			var Notification_1$2 = Notification;
			rxjs.Notification = Notification_1$2.Notification;
			rxjs.NotificationKind = Notification_1$2.NotificationKind;
			var pipe_1$1 = pipe$1;
			rxjs.pipe = pipe_1$1.pipe;
			var noop_1$1 = noop$1;
			rxjs.noop = noop_1$1.noop;
			var identity_1$3 = identity$1;
			rxjs.identity = identity_1$3.identity;
			var isObservable_1 = isObservable$1;
			rxjs.isObservable = isObservable_1.isObservable;
			var ArgumentOutOfRangeError_1$4 = ArgumentOutOfRangeError;
			rxjs.ArgumentOutOfRangeError = ArgumentOutOfRangeError_1$4.ArgumentOutOfRangeError;
			var EmptyError_1$4 = EmptyError;
			rxjs.EmptyError = EmptyError_1$4.EmptyError;
			var ObjectUnsubscribedError_1 = ObjectUnsubscribedError;
			rxjs.ObjectUnsubscribedError = ObjectUnsubscribedError_1.ObjectUnsubscribedError;
			var UnsubscriptionError_1 = UnsubscriptionError;
			rxjs.UnsubscriptionError = UnsubscriptionError_1.UnsubscriptionError;
			var TimeoutError_1$1 = TimeoutError;
			rxjs.TimeoutError = TimeoutError_1$1.TimeoutError;
			var bindCallback_1 = bindCallback$1;
			rxjs.bindCallback = bindCallback_1.bindCallback;
			var bindNodeCallback_1 = bindNodeCallback$1;
			rxjs.bindNodeCallback = bindNodeCallback_1.bindNodeCallback;
			var combineLatest_1$3 = combineLatest$3;
			rxjs.combineLatest = combineLatest_1$3.combineLatest;
			var concat_1$4 = concat$3;
			rxjs.concat = concat_1$4.concat;
			var defer_1$1 = defer$1;
			rxjs.defer = defer_1$1.defer;
			var empty_1$3 = empty;
			rxjs.empty = empty_1$3.empty;
			var forkJoin_1 = forkJoin$1;
			rxjs.forkJoin = forkJoin_1.forkJoin;
			var from_1$4 = from$1;
			rxjs.from = from_1$4.from;
			var fromEvent_1 = fromEvent$1;
			rxjs.fromEvent = fromEvent_1.fromEvent;
			var fromEventPattern_1 = fromEventPattern$1;
			rxjs.fromEventPattern = fromEventPattern_1.fromEventPattern;
			var generate_1 = generate$1;
			rxjs.generate = generate_1.generate;
			var iif_1 = iif$1;
			rxjs.iif = iif_1.iif;
			var interval_1 = interval$1;
			rxjs.interval = interval_1.interval;
			var merge_1$2 = merge$3;
			rxjs.merge = merge_1$2.merge;
			var never_1 = never;
			rxjs.never = never_1.never;
			var of_1$1 = of$1;
			rxjs.of = of_1$1.of;
			var onErrorResumeNext_1$1 = onErrorResumeNext$3;
			rxjs.onErrorResumeNext = onErrorResumeNext_1$1.onErrorResumeNext;
			var pairs_1 = pairs$1;
			rxjs.pairs = pairs_1.pairs;
			var partition_1$1 = partition$3;
			rxjs.partition = partition_1$1.partition;
			var race_1$2 = race$3;
			rxjs.race = race_1$2.race;
			var range_1 = range$1;
			rxjs.range = range_1.range;
			var throwError_1$1 = throwError$1;
			rxjs.throwError = throwError_1$1.throwError;
			var timer_1$1 = timer$1;
			rxjs.timer = timer_1$1.timer;
			var using_1 = using$1;
			rxjs.using = using_1.using;
			var zip_1$3 = zip$3;
			rxjs.zip = zip_1$3.zip;
			var scheduled_1 = scheduled$1;
			rxjs.scheduled = scheduled_1.scheduled;
			var empty_2 = empty;
			rxjs.EMPTY = empty_2.EMPTY;
			var never_2 = never;
			rxjs.NEVER = never_2.NEVER;
			var config_1 = config;
			rxjs.config = config_1.config;

			Object.defineProperty(Subject$2, "__esModule", { value: true });
			var rxjs_1 = rxjs;
			Subject$2.Subject = rxjs_1.Subject;

			(function (exports) {
			function __export(m) {
			    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
			}
			Object.defineProperty(exports, "__esModule", { value: true });
			__export(Subject$2);

			}(Subject$3));

			var filter$1 = {};

			var filter = {};

			var operators = {};

			var audit$1 = {};

			var __extends$V = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(audit$1, "__esModule", { value: true });
			var innerSubscribe_1$i = innerSubscribe$1;
			function audit(durationSelector) {
			    return function auditOperatorFunction(source) {
			        return source.lift(new AuditOperator(durationSelector));
			    };
			}
			audit$1.audit = audit;
			var AuditOperator = (function () {
			    function AuditOperator(durationSelector) {
			        this.durationSelector = durationSelector;
			    }
			    AuditOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
			    };
			    return AuditOperator;
			}());
			var AuditSubscriber = (function (_super) {
			    __extends$V(AuditSubscriber, _super);
			    function AuditSubscriber(destination, durationSelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.durationSelector = durationSelector;
			        _this.hasValue = false;
			        return _this;
			    }
			    AuditSubscriber.prototype._next = function (value) {
			        this.value = value;
			        this.hasValue = true;
			        if (!this.throttled) {
			            var duration = void 0;
			            try {
			                var durationSelector = this.durationSelector;
			                duration = durationSelector(value);
			            }
			            catch (err) {
			                return this.destination.error(err);
			            }
			            var innerSubscription = innerSubscribe_1$i.innerSubscribe(duration, new innerSubscribe_1$i.SimpleInnerSubscriber(this));
			            if (!innerSubscription || innerSubscription.closed) {
			                this.clearThrottle();
			            }
			            else {
			                this.add(this.throttled = innerSubscription);
			            }
			        }
			    };
			    AuditSubscriber.prototype.clearThrottle = function () {
			        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
			        if (throttled) {
			            this.remove(throttled);
			            this.throttled = undefined;
			            throttled.unsubscribe();
			        }
			        if (hasValue) {
			            this.value = undefined;
			            this.hasValue = false;
			            this.destination.next(value);
			        }
			    };
			    AuditSubscriber.prototype.notifyNext = function () {
			        this.clearThrottle();
			    };
			    AuditSubscriber.prototype.notifyComplete = function () {
			        this.clearThrottle();
			    };
			    return AuditSubscriber;
			}(innerSubscribe_1$i.SimpleOuterSubscriber));

			var auditTime$1 = {};

			Object.defineProperty(auditTime$1, "__esModule", { value: true });
			var async_1$a = async;
			var audit_1$1 = audit$1;
			var timer_1 = timer$1;
			function auditTime(duration, scheduler) {
			    if (scheduler === void 0) { scheduler = async_1$a.async; }
			    return audit_1$1.audit(function () { return timer_1.timer(duration, scheduler); });
			}
			auditTime$1.auditTime = auditTime;

			var buffer$1 = {};

			var __extends$U = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(buffer$1, "__esModule", { value: true });
			var innerSubscribe_1$h = innerSubscribe$1;
			function buffer(closingNotifier) {
			    return function bufferOperatorFunction(source) {
			        return source.lift(new BufferOperator(closingNotifier));
			    };
			}
			buffer$1.buffer = buffer;
			var BufferOperator = (function () {
			    function BufferOperator(closingNotifier) {
			        this.closingNotifier = closingNotifier;
			    }
			    BufferOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
			    };
			    return BufferOperator;
			}());
			var BufferSubscriber = (function (_super) {
			    __extends$U(BufferSubscriber, _super);
			    function BufferSubscriber(destination, closingNotifier) {
			        var _this = _super.call(this, destination) || this;
			        _this.buffer = [];
			        _this.add(innerSubscribe_1$h.innerSubscribe(closingNotifier, new innerSubscribe_1$h.SimpleInnerSubscriber(_this)));
			        return _this;
			    }
			    BufferSubscriber.prototype._next = function (value) {
			        this.buffer.push(value);
			    };
			    BufferSubscriber.prototype.notifyNext = function () {
			        var buffer = this.buffer;
			        this.buffer = [];
			        this.destination.next(buffer);
			    };
			    return BufferSubscriber;
			}(innerSubscribe_1$h.SimpleOuterSubscriber));

			var bufferCount$1 = {};

			var __extends$T = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(bufferCount$1, "__esModule", { value: true });
			var Subscriber_1$x = Subscriber$1;
			function bufferCount(bufferSize, startBufferEvery) {
			    if (startBufferEvery === void 0) { startBufferEvery = null; }
			    return function bufferCountOperatorFunction(source) {
			        return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
			    };
			}
			bufferCount$1.bufferCount = bufferCount;
			var BufferCountOperator = (function () {
			    function BufferCountOperator(bufferSize, startBufferEvery) {
			        this.bufferSize = bufferSize;
			        this.startBufferEvery = startBufferEvery;
			        if (!startBufferEvery || bufferSize === startBufferEvery) {
			            this.subscriberClass = BufferCountSubscriber;
			        }
			        else {
			            this.subscriberClass = BufferSkipCountSubscriber;
			        }
			    }
			    BufferCountOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
			    };
			    return BufferCountOperator;
			}());
			var BufferCountSubscriber = (function (_super) {
			    __extends$T(BufferCountSubscriber, _super);
			    function BufferCountSubscriber(destination, bufferSize) {
			        var _this = _super.call(this, destination) || this;
			        _this.bufferSize = bufferSize;
			        _this.buffer = [];
			        return _this;
			    }
			    BufferCountSubscriber.prototype._next = function (value) {
			        var buffer = this.buffer;
			        buffer.push(value);
			        if (buffer.length == this.bufferSize) {
			            this.destination.next(buffer);
			            this.buffer = [];
			        }
			    };
			    BufferCountSubscriber.prototype._complete = function () {
			        var buffer = this.buffer;
			        if (buffer.length > 0) {
			            this.destination.next(buffer);
			        }
			        _super.prototype._complete.call(this);
			    };
			    return BufferCountSubscriber;
			}(Subscriber_1$x.Subscriber));
			var BufferSkipCountSubscriber = (function (_super) {
			    __extends$T(BufferSkipCountSubscriber, _super);
			    function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
			        var _this = _super.call(this, destination) || this;
			        _this.bufferSize = bufferSize;
			        _this.startBufferEvery = startBufferEvery;
			        _this.buffers = [];
			        _this.count = 0;
			        return _this;
			    }
			    BufferSkipCountSubscriber.prototype._next = function (value) {
			        var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
			        this.count++;
			        if (count % startBufferEvery === 0) {
			            buffers.push([]);
			        }
			        for (var i = buffers.length; i--;) {
			            var buffer = buffers[i];
			            buffer.push(value);
			            if (buffer.length === bufferSize) {
			                buffers.splice(i, 1);
			                this.destination.next(buffer);
			            }
			        }
			    };
			    BufferSkipCountSubscriber.prototype._complete = function () {
			        var _a = this, buffers = _a.buffers, destination = _a.destination;
			        while (buffers.length > 0) {
			            var buffer = buffers.shift();
			            if (buffer.length > 0) {
			                destination.next(buffer);
			            }
			        }
			        _super.prototype._complete.call(this);
			    };
			    return BufferSkipCountSubscriber;
			}(Subscriber_1$x.Subscriber));

			var bufferTime$1 = {};

			var __extends$S = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(bufferTime$1, "__esModule", { value: true });
			var async_1$9 = async;
			var Subscriber_1$w = Subscriber$1;
			var isScheduler_1$2 = isScheduler$1;
			function bufferTime(bufferTimeSpan) {
			    var length = arguments.length;
			    var scheduler = async_1$9.async;
			    if (isScheduler_1$2.isScheduler(arguments[arguments.length - 1])) {
			        scheduler = arguments[arguments.length - 1];
			        length--;
			    }
			    var bufferCreationInterval = null;
			    if (length >= 2) {
			        bufferCreationInterval = arguments[1];
			    }
			    var maxBufferSize = Number.POSITIVE_INFINITY;
			    if (length >= 3) {
			        maxBufferSize = arguments[2];
			    }
			    return function bufferTimeOperatorFunction(source) {
			        return source.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
			    };
			}
			bufferTime$1.bufferTime = bufferTime;
			var BufferTimeOperator = (function () {
			    function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
			        this.bufferTimeSpan = bufferTimeSpan;
			        this.bufferCreationInterval = bufferCreationInterval;
			        this.maxBufferSize = maxBufferSize;
			        this.scheduler = scheduler;
			    }
			    BufferTimeOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
			    };
			    return BufferTimeOperator;
			}());
			var Context = (function () {
			    function Context() {
			        this.buffer = [];
			    }
			    return Context;
			}());
			var BufferTimeSubscriber = (function (_super) {
			    __extends$S(BufferTimeSubscriber, _super);
			    function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
			        var _this = _super.call(this, destination) || this;
			        _this.bufferTimeSpan = bufferTimeSpan;
			        _this.bufferCreationInterval = bufferCreationInterval;
			        _this.maxBufferSize = maxBufferSize;
			        _this.scheduler = scheduler;
			        _this.contexts = [];
			        var context = _this.openContext();
			        _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
			        if (_this.timespanOnly) {
			            var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
			            _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
			        }
			        else {
			            var closeState = { subscriber: _this, context: context };
			            var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
			            _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
			            _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
			        }
			        return _this;
			    }
			    BufferTimeSubscriber.prototype._next = function (value) {
			        var contexts = this.contexts;
			        var len = contexts.length;
			        var filledBufferContext;
			        for (var i = 0; i < len; i++) {
			            var context_1 = contexts[i];
			            var buffer = context_1.buffer;
			            buffer.push(value);
			            if (buffer.length == this.maxBufferSize) {
			                filledBufferContext = context_1;
			            }
			        }
			        if (filledBufferContext) {
			            this.onBufferFull(filledBufferContext);
			        }
			    };
			    BufferTimeSubscriber.prototype._error = function (err) {
			        this.contexts.length = 0;
			        _super.prototype._error.call(this, err);
			    };
			    BufferTimeSubscriber.prototype._complete = function () {
			        var _a = this, contexts = _a.contexts, destination = _a.destination;
			        while (contexts.length > 0) {
			            var context_2 = contexts.shift();
			            destination.next(context_2.buffer);
			        }
			        _super.prototype._complete.call(this);
			    };
			    BufferTimeSubscriber.prototype._unsubscribe = function () {
			        this.contexts = null;
			    };
			    BufferTimeSubscriber.prototype.onBufferFull = function (context) {
			        this.closeContext(context);
			        var closeAction = context.closeAction;
			        closeAction.unsubscribe();
			        this.remove(closeAction);
			        if (!this.closed && this.timespanOnly) {
			            context = this.openContext();
			            var bufferTimeSpan = this.bufferTimeSpan;
			            var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
			            this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
			        }
			    };
			    BufferTimeSubscriber.prototype.openContext = function () {
			        var context = new Context();
			        this.contexts.push(context);
			        return context;
			    };
			    BufferTimeSubscriber.prototype.closeContext = function (context) {
			        this.destination.next(context.buffer);
			        var contexts = this.contexts;
			        var spliceIndex = contexts ? contexts.indexOf(context) : -1;
			        if (spliceIndex >= 0) {
			            contexts.splice(contexts.indexOf(context), 1);
			        }
			    };
			    return BufferTimeSubscriber;
			}(Subscriber_1$w.Subscriber));
			function dispatchBufferTimeSpanOnly(state) {
			    var subscriber = state.subscriber;
			    var prevContext = state.context;
			    if (prevContext) {
			        subscriber.closeContext(prevContext);
			    }
			    if (!subscriber.closed) {
			        state.context = subscriber.openContext();
			        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
			    }
			}
			function dispatchBufferCreation(state) {
			    var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
			    var context = subscriber.openContext();
			    var action = this;
			    if (!subscriber.closed) {
			        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
			        action.schedule(state, bufferCreationInterval);
			    }
			}
			function dispatchBufferClose(arg) {
			    var subscriber = arg.subscriber, context = arg.context;
			    subscriber.closeContext(context);
			}

			var bufferToggle$1 = {};

			var __extends$R = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(bufferToggle$1, "__esModule", { value: true });
			var Subscription_1$3 = Subscription$1;
			var subscribeToResult_1$4 = subscribeToResult$1;
			var OuterSubscriber_1$4 = OuterSubscriber$1;
			function bufferToggle(openings, closingSelector) {
			    return function bufferToggleOperatorFunction(source) {
			        return source.lift(new BufferToggleOperator(openings, closingSelector));
			    };
			}
			bufferToggle$1.bufferToggle = bufferToggle;
			var BufferToggleOperator = (function () {
			    function BufferToggleOperator(openings, closingSelector) {
			        this.openings = openings;
			        this.closingSelector = closingSelector;
			    }
			    BufferToggleOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
			    };
			    return BufferToggleOperator;
			}());
			var BufferToggleSubscriber = (function (_super) {
			    __extends$R(BufferToggleSubscriber, _super);
			    function BufferToggleSubscriber(destination, openings, closingSelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.closingSelector = closingSelector;
			        _this.contexts = [];
			        _this.add(subscribeToResult_1$4.subscribeToResult(_this, openings));
			        return _this;
			    }
			    BufferToggleSubscriber.prototype._next = function (value) {
			        var contexts = this.contexts;
			        var len = contexts.length;
			        for (var i = 0; i < len; i++) {
			            contexts[i].buffer.push(value);
			        }
			    };
			    BufferToggleSubscriber.prototype._error = function (err) {
			        var contexts = this.contexts;
			        while (contexts.length > 0) {
			            var context_1 = contexts.shift();
			            context_1.subscription.unsubscribe();
			            context_1.buffer = null;
			            context_1.subscription = null;
			        }
			        this.contexts = null;
			        _super.prototype._error.call(this, err);
			    };
			    BufferToggleSubscriber.prototype._complete = function () {
			        var contexts = this.contexts;
			        while (contexts.length > 0) {
			            var context_2 = contexts.shift();
			            this.destination.next(context_2.buffer);
			            context_2.subscription.unsubscribe();
			            context_2.buffer = null;
			            context_2.subscription = null;
			        }
			        this.contexts = null;
			        _super.prototype._complete.call(this);
			    };
			    BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue) {
			        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
			    };
			    BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
			        this.closeBuffer(innerSub.context);
			    };
			    BufferToggleSubscriber.prototype.openBuffer = function (value) {
			        try {
			            var closingSelector = this.closingSelector;
			            var closingNotifier = closingSelector.call(this, value);
			            if (closingNotifier) {
			                this.trySubscribe(closingNotifier);
			            }
			        }
			        catch (err) {
			            this._error(err);
			        }
			    };
			    BufferToggleSubscriber.prototype.closeBuffer = function (context) {
			        var contexts = this.contexts;
			        if (contexts && context) {
			            var buffer = context.buffer, subscription = context.subscription;
			            this.destination.next(buffer);
			            contexts.splice(contexts.indexOf(context), 1);
			            this.remove(subscription);
			            subscription.unsubscribe();
			        }
			    };
			    BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
			        var contexts = this.contexts;
			        var buffer = [];
			        var subscription = new Subscription_1$3.Subscription();
			        var context = { buffer: buffer, subscription: subscription };
			        contexts.push(context);
			        var innerSubscription = subscribeToResult_1$4.subscribeToResult(this, closingNotifier, context);
			        if (!innerSubscription || innerSubscription.closed) {
			            this.closeBuffer(context);
			        }
			        else {
			            innerSubscription.context = context;
			            this.add(innerSubscription);
			            subscription.add(innerSubscription);
			        }
			    };
			    return BufferToggleSubscriber;
			}(OuterSubscriber_1$4.OuterSubscriber));

			var bufferWhen$1 = {};

			var __extends$Q = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(bufferWhen$1, "__esModule", { value: true });
			var Subscription_1$2 = Subscription$1;
			var innerSubscribe_1$g = innerSubscribe$1;
			function bufferWhen(closingSelector) {
			    return function (source) {
			        return source.lift(new BufferWhenOperator(closingSelector));
			    };
			}
			bufferWhen$1.bufferWhen = bufferWhen;
			var BufferWhenOperator = (function () {
			    function BufferWhenOperator(closingSelector) {
			        this.closingSelector = closingSelector;
			    }
			    BufferWhenOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
			    };
			    return BufferWhenOperator;
			}());
			var BufferWhenSubscriber = (function (_super) {
			    __extends$Q(BufferWhenSubscriber, _super);
			    function BufferWhenSubscriber(destination, closingSelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.closingSelector = closingSelector;
			        _this.subscribing = false;
			        _this.openBuffer();
			        return _this;
			    }
			    BufferWhenSubscriber.prototype._next = function (value) {
			        this.buffer.push(value);
			    };
			    BufferWhenSubscriber.prototype._complete = function () {
			        var buffer = this.buffer;
			        if (buffer) {
			            this.destination.next(buffer);
			        }
			        _super.prototype._complete.call(this);
			    };
			    BufferWhenSubscriber.prototype._unsubscribe = function () {
			        this.buffer = undefined;
			        this.subscribing = false;
			    };
			    BufferWhenSubscriber.prototype.notifyNext = function () {
			        this.openBuffer();
			    };
			    BufferWhenSubscriber.prototype.notifyComplete = function () {
			        if (this.subscribing) {
			            this.complete();
			        }
			        else {
			            this.openBuffer();
			        }
			    };
			    BufferWhenSubscriber.prototype.openBuffer = function () {
			        var closingSubscription = this.closingSubscription;
			        if (closingSubscription) {
			            this.remove(closingSubscription);
			            closingSubscription.unsubscribe();
			        }
			        var buffer = this.buffer;
			        if (this.buffer) {
			            this.destination.next(buffer);
			        }
			        this.buffer = [];
			        var closingNotifier;
			        try {
			            var closingSelector = this.closingSelector;
			            closingNotifier = closingSelector();
			        }
			        catch (err) {
			            return this.error(err);
			        }
			        closingSubscription = new Subscription_1$2.Subscription();
			        this.closingSubscription = closingSubscription;
			        this.add(closingSubscription);
			        this.subscribing = true;
			        closingSubscription.add(innerSubscribe_1$g.innerSubscribe(closingNotifier, new innerSubscribe_1$g.SimpleInnerSubscriber(this)));
			        this.subscribing = false;
			    };
			    return BufferWhenSubscriber;
			}(innerSubscribe_1$g.SimpleOuterSubscriber));

			var catchError$1 = {};

			var __extends$P = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(catchError$1, "__esModule", { value: true });
			var innerSubscribe_1$f = innerSubscribe$1;
			function catchError(selector) {
			    return function catchErrorOperatorFunction(source) {
			        var operator = new CatchOperator(selector);
			        var caught = source.lift(operator);
			        return (operator.caught = caught);
			    };
			}
			catchError$1.catchError = catchError;
			var CatchOperator = (function () {
			    function CatchOperator(selector) {
			        this.selector = selector;
			    }
			    CatchOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
			    };
			    return CatchOperator;
			}());
			var CatchSubscriber = (function (_super) {
			    __extends$P(CatchSubscriber, _super);
			    function CatchSubscriber(destination, selector, caught) {
			        var _this = _super.call(this, destination) || this;
			        _this.selector = selector;
			        _this.caught = caught;
			        return _this;
			    }
			    CatchSubscriber.prototype.error = function (err) {
			        if (!this.isStopped) {
			            var result = void 0;
			            try {
			                result = this.selector(err, this.caught);
			            }
			            catch (err2) {
			                _super.prototype.error.call(this, err2);
			                return;
			            }
			            this._unsubscribeAndRecycle();
			            var innerSubscriber = new innerSubscribe_1$f.SimpleInnerSubscriber(this);
			            this.add(innerSubscriber);
			            var innerSubscription = innerSubscribe_1$f.innerSubscribe(result, innerSubscriber);
			            if (innerSubscription !== innerSubscriber) {
			                this.add(innerSubscription);
			            }
			        }
			    };
			    return CatchSubscriber;
			}(innerSubscribe_1$f.SimpleOuterSubscriber));

			var combineAll$1 = {};

			Object.defineProperty(combineAll$1, "__esModule", { value: true });
			var combineLatest_1$2 = combineLatest$3;
			function combineAll(project) {
			    return function (source) { return source.lift(new combineLatest_1$2.CombineLatestOperator(project)); };
			}
			combineAll$1.combineAll = combineAll;

			var combineLatest$1 = {};

			Object.defineProperty(combineLatest$1, "__esModule", { value: true });
			var isArray_1$2 = isArray;
			var combineLatest_1$1 = combineLatest$3;
			var from_1$3 = from$1;
			function combineLatest() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    var project = null;
			    if (typeof observables[observables.length - 1] === 'function') {
			        project = observables.pop();
			    }
			    if (observables.length === 1 && isArray_1$2.isArray(observables[0])) {
			        observables = observables[0].slice();
			    }
			    return function (source) { return source.lift.call(from_1$3.from([source].concat(observables)), new combineLatest_1$1.CombineLatestOperator(project)); };
			}
			combineLatest$1.combineLatest = combineLatest;

			var concat$1 = {};

			Object.defineProperty(concat$1, "__esModule", { value: true });
			var concat_1$3 = concat$3;
			function concat() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    return function (source) { return source.lift.call(concat_1$3.concat.apply(void 0, [source].concat(observables))); };
			}
			concat$1.concat = concat;

			var concatMap$1 = {};

			Object.defineProperty(concatMap$1, "__esModule", { value: true });
			var mergeMap_1$2 = mergeMap$1;
			function concatMap(project, resultSelector) {
			    return mergeMap_1$2.mergeMap(project, resultSelector, 1);
			}
			concatMap$1.concatMap = concatMap;

			var concatMapTo$1 = {};

			Object.defineProperty(concatMapTo$1, "__esModule", { value: true });
			var concatMap_1$1 = concatMap$1;
			function concatMapTo(innerObservable, resultSelector) {
			    return concatMap_1$1.concatMap(function () { return innerObservable; }, resultSelector);
			}
			concatMapTo$1.concatMapTo = concatMapTo;

			var count$1 = {};

			var __extends$O = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(count$1, "__esModule", { value: true });
			var Subscriber_1$v = Subscriber$1;
			function count(predicate) {
			    return function (source) { return source.lift(new CountOperator(predicate, source)); };
			}
			count$1.count = count;
			var CountOperator = (function () {
			    function CountOperator(predicate, source) {
			        this.predicate = predicate;
			        this.source = source;
			    }
			    CountOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
			    };
			    return CountOperator;
			}());
			var CountSubscriber = (function (_super) {
			    __extends$O(CountSubscriber, _super);
			    function CountSubscriber(destination, predicate, source) {
			        var _this = _super.call(this, destination) || this;
			        _this.predicate = predicate;
			        _this.source = source;
			        _this.count = 0;
			        _this.index = 0;
			        return _this;
			    }
			    CountSubscriber.prototype._next = function (value) {
			        if (this.predicate) {
			            this._tryPredicate(value);
			        }
			        else {
			            this.count++;
			        }
			    };
			    CountSubscriber.prototype._tryPredicate = function (value) {
			        var result;
			        try {
			            result = this.predicate(value, this.index++, this.source);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        if (result) {
			            this.count++;
			        }
			    };
			    CountSubscriber.prototype._complete = function () {
			        this.destination.next(this.count);
			        this.destination.complete();
			    };
			    return CountSubscriber;
			}(Subscriber_1$v.Subscriber));

			var debounce$1 = {};

			var __extends$N = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(debounce$1, "__esModule", { value: true });
			var innerSubscribe_1$e = innerSubscribe$1;
			function debounce(durationSelector) {
			    return function (source) { return source.lift(new DebounceOperator(durationSelector)); };
			}
			debounce$1.debounce = debounce;
			var DebounceOperator = (function () {
			    function DebounceOperator(durationSelector) {
			        this.durationSelector = durationSelector;
			    }
			    DebounceOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
			    };
			    return DebounceOperator;
			}());
			var DebounceSubscriber = (function (_super) {
			    __extends$N(DebounceSubscriber, _super);
			    function DebounceSubscriber(destination, durationSelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.durationSelector = durationSelector;
			        _this.hasValue = false;
			        return _this;
			    }
			    DebounceSubscriber.prototype._next = function (value) {
			        try {
			            var result = this.durationSelector.call(this, value);
			            if (result) {
			                this._tryNext(value, result);
			            }
			        }
			        catch (err) {
			            this.destination.error(err);
			        }
			    };
			    DebounceSubscriber.prototype._complete = function () {
			        this.emitValue();
			        this.destination.complete();
			    };
			    DebounceSubscriber.prototype._tryNext = function (value, duration) {
			        var subscription = this.durationSubscription;
			        this.value = value;
			        this.hasValue = true;
			        if (subscription) {
			            subscription.unsubscribe();
			            this.remove(subscription);
			        }
			        subscription = innerSubscribe_1$e.innerSubscribe(duration, new innerSubscribe_1$e.SimpleInnerSubscriber(this));
			        if (subscription && !subscription.closed) {
			            this.add(this.durationSubscription = subscription);
			        }
			    };
			    DebounceSubscriber.prototype.notifyNext = function () {
			        this.emitValue();
			    };
			    DebounceSubscriber.prototype.notifyComplete = function () {
			        this.emitValue();
			    };
			    DebounceSubscriber.prototype.emitValue = function () {
			        if (this.hasValue) {
			            var value = this.value;
			            var subscription = this.durationSubscription;
			            if (subscription) {
			                this.durationSubscription = undefined;
			                subscription.unsubscribe();
			                this.remove(subscription);
			            }
			            this.value = undefined;
			            this.hasValue = false;
			            _super.prototype._next.call(this, value);
			        }
			    };
			    return DebounceSubscriber;
			}(innerSubscribe_1$e.SimpleOuterSubscriber));

			var debounceTime$1 = {};

			var __extends$M = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(debounceTime$1, "__esModule", { value: true });
			var Subscriber_1$u = Subscriber$1;
			var async_1$8 = async;
			function debounceTime(dueTime, scheduler) {
			    if (scheduler === void 0) { scheduler = async_1$8.async; }
			    return function (source) { return source.lift(new DebounceTimeOperator(dueTime, scheduler)); };
			}
			debounceTime$1.debounceTime = debounceTime;
			var DebounceTimeOperator = (function () {
			    function DebounceTimeOperator(dueTime, scheduler) {
			        this.dueTime = dueTime;
			        this.scheduler = scheduler;
			    }
			    DebounceTimeOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
			    };
			    return DebounceTimeOperator;
			}());
			var DebounceTimeSubscriber = (function (_super) {
			    __extends$M(DebounceTimeSubscriber, _super);
			    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
			        var _this = _super.call(this, destination) || this;
			        _this.dueTime = dueTime;
			        _this.scheduler = scheduler;
			        _this.debouncedSubscription = null;
			        _this.lastValue = null;
			        _this.hasValue = false;
			        return _this;
			    }
			    DebounceTimeSubscriber.prototype._next = function (value) {
			        this.clearDebounce();
			        this.lastValue = value;
			        this.hasValue = true;
			        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext$1, this.dueTime, this));
			    };
			    DebounceTimeSubscriber.prototype._complete = function () {
			        this.debouncedNext();
			        this.destination.complete();
			    };
			    DebounceTimeSubscriber.prototype.debouncedNext = function () {
			        this.clearDebounce();
			        if (this.hasValue) {
			            var lastValue = this.lastValue;
			            this.lastValue = null;
			            this.hasValue = false;
			            this.destination.next(lastValue);
			        }
			    };
			    DebounceTimeSubscriber.prototype.clearDebounce = function () {
			        var debouncedSubscription = this.debouncedSubscription;
			        if (debouncedSubscription !== null) {
			            this.remove(debouncedSubscription);
			            debouncedSubscription.unsubscribe();
			            this.debouncedSubscription = null;
			        }
			    };
			    return DebounceTimeSubscriber;
			}(Subscriber_1$u.Subscriber));
			function dispatchNext$1(subscriber) {
			    subscriber.debouncedNext();
			}

			var defaultIfEmpty$1 = {};

			var __extends$L = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(defaultIfEmpty$1, "__esModule", { value: true });
			var Subscriber_1$t = Subscriber$1;
			function defaultIfEmpty(defaultValue) {
			    if (defaultValue === void 0) { defaultValue = null; }
			    return function (source) { return source.lift(new DefaultIfEmptyOperator(defaultValue)); };
			}
			defaultIfEmpty$1.defaultIfEmpty = defaultIfEmpty;
			var DefaultIfEmptyOperator = (function () {
			    function DefaultIfEmptyOperator(defaultValue) {
			        this.defaultValue = defaultValue;
			    }
			    DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
			    };
			    return DefaultIfEmptyOperator;
			}());
			var DefaultIfEmptySubscriber = (function (_super) {
			    __extends$L(DefaultIfEmptySubscriber, _super);
			    function DefaultIfEmptySubscriber(destination, defaultValue) {
			        var _this = _super.call(this, destination) || this;
			        _this.defaultValue = defaultValue;
			        _this.isEmpty = true;
			        return _this;
			    }
			    DefaultIfEmptySubscriber.prototype._next = function (value) {
			        this.isEmpty = false;
			        this.destination.next(value);
			    };
			    DefaultIfEmptySubscriber.prototype._complete = function () {
			        if (this.isEmpty) {
			            this.destination.next(this.defaultValue);
			        }
			        this.destination.complete();
			    };
			    return DefaultIfEmptySubscriber;
			}(Subscriber_1$t.Subscriber));

			var delay$1 = {};

			var isDate$1 = {};

			Object.defineProperty(isDate$1, "__esModule", { value: true });
			function isDate(value) {
			    return value instanceof Date && !isNaN(+value);
			}
			isDate$1.isDate = isDate;

			var __extends$K = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(delay$1, "__esModule", { value: true });
			var async_1$7 = async;
			var isDate_1$1 = isDate$1;
			var Subscriber_1$s = Subscriber$1;
			var Notification_1$1 = Notification;
			function delay(delay, scheduler) {
			    if (scheduler === void 0) { scheduler = async_1$7.async; }
			    var absoluteDelay = isDate_1$1.isDate(delay);
			    var delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
			    return function (source) { return source.lift(new DelayOperator(delayFor, scheduler)); };
			}
			delay$1.delay = delay;
			var DelayOperator = (function () {
			    function DelayOperator(delay, scheduler) {
			        this.delay = delay;
			        this.scheduler = scheduler;
			    }
			    DelayOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
			    };
			    return DelayOperator;
			}());
			var DelaySubscriber = (function (_super) {
			    __extends$K(DelaySubscriber, _super);
			    function DelaySubscriber(destination, delay, scheduler) {
			        var _this = _super.call(this, destination) || this;
			        _this.delay = delay;
			        _this.scheduler = scheduler;
			        _this.queue = [];
			        _this.active = false;
			        _this.errored = false;
			        return _this;
			    }
			    DelaySubscriber.dispatch = function (state) {
			        var source = state.source;
			        var queue = source.queue;
			        var scheduler = state.scheduler;
			        var destination = state.destination;
			        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
			            queue.shift().notification.observe(destination);
			        }
			        if (queue.length > 0) {
			            var delay_1 = Math.max(0, queue[0].time - scheduler.now());
			            this.schedule(state, delay_1);
			        }
			        else {
			            this.unsubscribe();
			            source.active = false;
			        }
			    };
			    DelaySubscriber.prototype._schedule = function (scheduler) {
			        this.active = true;
			        var destination = this.destination;
			        destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
			            source: this, destination: this.destination, scheduler: scheduler
			        }));
			    };
			    DelaySubscriber.prototype.scheduleNotification = function (notification) {
			        if (this.errored === true) {
			            return;
			        }
			        var scheduler = this.scheduler;
			        var message = new DelayMessage(scheduler.now() + this.delay, notification);
			        this.queue.push(message);
			        if (this.active === false) {
			            this._schedule(scheduler);
			        }
			    };
			    DelaySubscriber.prototype._next = function (value) {
			        this.scheduleNotification(Notification_1$1.Notification.createNext(value));
			    };
			    DelaySubscriber.prototype._error = function (err) {
			        this.errored = true;
			        this.queue = [];
			        this.destination.error(err);
			        this.unsubscribe();
			    };
			    DelaySubscriber.prototype._complete = function () {
			        this.scheduleNotification(Notification_1$1.Notification.createComplete());
			        this.unsubscribe();
			    };
			    return DelaySubscriber;
			}(Subscriber_1$s.Subscriber));
			var DelayMessage = (function () {
			    function DelayMessage(time, notification) {
			        this.time = time;
			        this.notification = notification;
			    }
			    return DelayMessage;
			}());

			var delayWhen$1 = {};

			var __extends$J = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(delayWhen$1, "__esModule", { value: true });
			var Subscriber_1$r = Subscriber$1;
			var Observable_1$1 = Observable$1;
			var OuterSubscriber_1$3 = OuterSubscriber$1;
			var subscribeToResult_1$3 = subscribeToResult$1;
			function delayWhen(delayDurationSelector, subscriptionDelay) {
			    if (subscriptionDelay) {
			        return function (source) {
			            return new SubscriptionDelayObservable(source, subscriptionDelay)
			                .lift(new DelayWhenOperator(delayDurationSelector));
			        };
			    }
			    return function (source) { return source.lift(new DelayWhenOperator(delayDurationSelector)); };
			}
			delayWhen$1.delayWhen = delayWhen;
			var DelayWhenOperator = (function () {
			    function DelayWhenOperator(delayDurationSelector) {
			        this.delayDurationSelector = delayDurationSelector;
			    }
			    DelayWhenOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
			    };
			    return DelayWhenOperator;
			}());
			var DelayWhenSubscriber = (function (_super) {
			    __extends$J(DelayWhenSubscriber, _super);
			    function DelayWhenSubscriber(destination, delayDurationSelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.delayDurationSelector = delayDurationSelector;
			        _this.completed = false;
			        _this.delayNotifierSubscriptions = [];
			        _this.index = 0;
			        return _this;
			    }
			    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, _innerValue, _outerIndex, _innerIndex, innerSub) {
			        this.destination.next(outerValue);
			        this.removeSubscription(innerSub);
			        this.tryComplete();
			    };
			    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
			        this._error(error);
			    };
			    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
			        var value = this.removeSubscription(innerSub);
			        if (value) {
			            this.destination.next(value);
			        }
			        this.tryComplete();
			    };
			    DelayWhenSubscriber.prototype._next = function (value) {
			        var index = this.index++;
			        try {
			            var delayNotifier = this.delayDurationSelector(value, index);
			            if (delayNotifier) {
			                this.tryDelay(delayNotifier, value);
			            }
			        }
			        catch (err) {
			            this.destination.error(err);
			        }
			    };
			    DelayWhenSubscriber.prototype._complete = function () {
			        this.completed = true;
			        this.tryComplete();
			        this.unsubscribe();
			    };
			    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
			        subscription.unsubscribe();
			        var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
			        if (subscriptionIdx !== -1) {
			            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
			        }
			        return subscription.outerValue;
			    };
			    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
			        var notifierSubscription = subscribeToResult_1$3.subscribeToResult(this, delayNotifier, value);
			        if (notifierSubscription && !notifierSubscription.closed) {
			            var destination = this.destination;
			            destination.add(notifierSubscription);
			            this.delayNotifierSubscriptions.push(notifierSubscription);
			        }
			    };
			    DelayWhenSubscriber.prototype.tryComplete = function () {
			        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
			            this.destination.complete();
			        }
			    };
			    return DelayWhenSubscriber;
			}(OuterSubscriber_1$3.OuterSubscriber));
			var SubscriptionDelayObservable = (function (_super) {
			    __extends$J(SubscriptionDelayObservable, _super);
			    function SubscriptionDelayObservable(source, subscriptionDelay) {
			        var _this = _super.call(this) || this;
			        _this.source = source;
			        _this.subscriptionDelay = subscriptionDelay;
			        return _this;
			    }
			    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
			        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
			    };
			    return SubscriptionDelayObservable;
			}(Observable_1$1.Observable));
			var SubscriptionDelaySubscriber = (function (_super) {
			    __extends$J(SubscriptionDelaySubscriber, _super);
			    function SubscriptionDelaySubscriber(parent, source) {
			        var _this = _super.call(this) || this;
			        _this.parent = parent;
			        _this.source = source;
			        _this.sourceSubscribed = false;
			        return _this;
			    }
			    SubscriptionDelaySubscriber.prototype._next = function (unused) {
			        this.subscribeToSource();
			    };
			    SubscriptionDelaySubscriber.prototype._error = function (err) {
			        this.unsubscribe();
			        this.parent.error(err);
			    };
			    SubscriptionDelaySubscriber.prototype._complete = function () {
			        this.unsubscribe();
			        this.subscribeToSource();
			    };
			    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
			        if (!this.sourceSubscribed) {
			            this.sourceSubscribed = true;
			            this.unsubscribe();
			            this.source.subscribe(this.parent);
			        }
			    };
			    return SubscriptionDelaySubscriber;
			}(Subscriber_1$r.Subscriber));

			var dematerialize$1 = {};

			var __extends$I = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(dematerialize$1, "__esModule", { value: true });
			var Subscriber_1$q = Subscriber$1;
			function dematerialize() {
			    return function dematerializeOperatorFunction(source) {
			        return source.lift(new DeMaterializeOperator());
			    };
			}
			dematerialize$1.dematerialize = dematerialize;
			var DeMaterializeOperator = (function () {
			    function DeMaterializeOperator() {
			    }
			    DeMaterializeOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new DeMaterializeSubscriber(subscriber));
			    };
			    return DeMaterializeOperator;
			}());
			var DeMaterializeSubscriber = (function (_super) {
			    __extends$I(DeMaterializeSubscriber, _super);
			    function DeMaterializeSubscriber(destination) {
			        return _super.call(this, destination) || this;
			    }
			    DeMaterializeSubscriber.prototype._next = function (value) {
			        value.observe(this.destination);
			    };
			    return DeMaterializeSubscriber;
			}(Subscriber_1$q.Subscriber));

			var distinct$1 = {};

			var __extends$H = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(distinct$1, "__esModule", { value: true });
			var innerSubscribe_1$d = innerSubscribe$1;
			function distinct(keySelector, flushes) {
			    return function (source) { return source.lift(new DistinctOperator(keySelector, flushes)); };
			}
			distinct$1.distinct = distinct;
			var DistinctOperator = (function () {
			    function DistinctOperator(keySelector, flushes) {
			        this.keySelector = keySelector;
			        this.flushes = flushes;
			    }
			    DistinctOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
			    };
			    return DistinctOperator;
			}());
			var DistinctSubscriber = (function (_super) {
			    __extends$H(DistinctSubscriber, _super);
			    function DistinctSubscriber(destination, keySelector, flushes) {
			        var _this = _super.call(this, destination) || this;
			        _this.keySelector = keySelector;
			        _this.values = new Set();
			        if (flushes) {
			            _this.add(innerSubscribe_1$d.innerSubscribe(flushes, new innerSubscribe_1$d.SimpleInnerSubscriber(_this)));
			        }
			        return _this;
			    }
			    DistinctSubscriber.prototype.notifyNext = function () {
			        this.values.clear();
			    };
			    DistinctSubscriber.prototype.notifyError = function (error) {
			        this._error(error);
			    };
			    DistinctSubscriber.prototype._next = function (value) {
			        if (this.keySelector) {
			            this._useKeySelector(value);
			        }
			        else {
			            this._finalizeNext(value, value);
			        }
			    };
			    DistinctSubscriber.prototype._useKeySelector = function (value) {
			        var key;
			        var destination = this.destination;
			        try {
			            key = this.keySelector(value);
			        }
			        catch (err) {
			            destination.error(err);
			            return;
			        }
			        this._finalizeNext(key, value);
			    };
			    DistinctSubscriber.prototype._finalizeNext = function (key, value) {
			        var values = this.values;
			        if (!values.has(key)) {
			            values.add(key);
			            this.destination.next(value);
			        }
			    };
			    return DistinctSubscriber;
			}(innerSubscribe_1$d.SimpleOuterSubscriber));
			distinct$1.DistinctSubscriber = DistinctSubscriber;

			var distinctUntilChanged$1 = {};

			var __extends$G = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(distinctUntilChanged$1, "__esModule", { value: true });
			var Subscriber_1$p = Subscriber$1;
			function distinctUntilChanged(compare, keySelector) {
			    return function (source) { return source.lift(new DistinctUntilChangedOperator(compare, keySelector)); };
			}
			distinctUntilChanged$1.distinctUntilChanged = distinctUntilChanged;
			var DistinctUntilChangedOperator = (function () {
			    function DistinctUntilChangedOperator(compare, keySelector) {
			        this.compare = compare;
			        this.keySelector = keySelector;
			    }
			    DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
			    };
			    return DistinctUntilChangedOperator;
			}());
			var DistinctUntilChangedSubscriber = (function (_super) {
			    __extends$G(DistinctUntilChangedSubscriber, _super);
			    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.keySelector = keySelector;
			        _this.hasKey = false;
			        if (typeof compare === 'function') {
			            _this.compare = compare;
			        }
			        return _this;
			    }
			    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
			        return x === y;
			    };
			    DistinctUntilChangedSubscriber.prototype._next = function (value) {
			        var key;
			        try {
			            var keySelector = this.keySelector;
			            key = keySelector ? keySelector(value) : value;
			        }
			        catch (err) {
			            return this.destination.error(err);
			        }
			        var result = false;
			        if (this.hasKey) {
			            try {
			                var compare = this.compare;
			                result = compare(this.key, key);
			            }
			            catch (err) {
			                return this.destination.error(err);
			            }
			        }
			        else {
			            this.hasKey = true;
			        }
			        if (!result) {
			            this.key = key;
			            this.destination.next(value);
			        }
			    };
			    return DistinctUntilChangedSubscriber;
			}(Subscriber_1$p.Subscriber));

			var distinctUntilKeyChanged$1 = {};

			Object.defineProperty(distinctUntilKeyChanged$1, "__esModule", { value: true });
			var distinctUntilChanged_1$1 = distinctUntilChanged$1;
			function distinctUntilKeyChanged(key, compare) {
			    return distinctUntilChanged_1$1.distinctUntilChanged(function (x, y) { return compare ? compare(x[key], y[key]) : x[key] === y[key]; });
			}
			distinctUntilKeyChanged$1.distinctUntilKeyChanged = distinctUntilKeyChanged;

			var elementAt$1 = {};

			var throwIfEmpty$1 = {};

			var __extends$F = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(throwIfEmpty$1, "__esModule", { value: true });
			var EmptyError_1$3 = EmptyError;
			var Subscriber_1$o = Subscriber$1;
			function throwIfEmpty(errorFactory) {
			    if (errorFactory === void 0) { errorFactory = defaultErrorFactory; }
			    return function (source) {
			        return source.lift(new ThrowIfEmptyOperator(errorFactory));
			    };
			}
			throwIfEmpty$1.throwIfEmpty = throwIfEmpty;
			var ThrowIfEmptyOperator = (function () {
			    function ThrowIfEmptyOperator(errorFactory) {
			        this.errorFactory = errorFactory;
			    }
			    ThrowIfEmptyOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new ThrowIfEmptySubscriber(subscriber, this.errorFactory));
			    };
			    return ThrowIfEmptyOperator;
			}());
			var ThrowIfEmptySubscriber = (function (_super) {
			    __extends$F(ThrowIfEmptySubscriber, _super);
			    function ThrowIfEmptySubscriber(destination, errorFactory) {
			        var _this = _super.call(this, destination) || this;
			        _this.errorFactory = errorFactory;
			        _this.hasValue = false;
			        return _this;
			    }
			    ThrowIfEmptySubscriber.prototype._next = function (value) {
			        this.hasValue = true;
			        this.destination.next(value);
			    };
			    ThrowIfEmptySubscriber.prototype._complete = function () {
			        if (!this.hasValue) {
			            var err = void 0;
			            try {
			                err = this.errorFactory();
			            }
			            catch (e) {
			                err = e;
			            }
			            this.destination.error(err);
			        }
			        else {
			            return this.destination.complete();
			        }
			    };
			    return ThrowIfEmptySubscriber;
			}(Subscriber_1$o.Subscriber));
			function defaultErrorFactory() {
			    return new EmptyError_1$3.EmptyError();
			}

			var take$1 = {};

			var __extends$E = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(take$1, "__esModule", { value: true });
			var Subscriber_1$n = Subscriber$1;
			var ArgumentOutOfRangeError_1$3 = ArgumentOutOfRangeError;
			var empty_1$2 = empty;
			function take(count) {
			    return function (source) {
			        if (count === 0) {
			            return empty_1$2.empty();
			        }
			        else {
			            return source.lift(new TakeOperator(count));
			        }
			    };
			}
			take$1.take = take;
			var TakeOperator = (function () {
			    function TakeOperator(total) {
			        this.total = total;
			        if (this.total < 0) {
			            throw new ArgumentOutOfRangeError_1$3.ArgumentOutOfRangeError;
			        }
			    }
			    TakeOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new TakeSubscriber(subscriber, this.total));
			    };
			    return TakeOperator;
			}());
			var TakeSubscriber = (function (_super) {
			    __extends$E(TakeSubscriber, _super);
			    function TakeSubscriber(destination, total) {
			        var _this = _super.call(this, destination) || this;
			        _this.total = total;
			        _this.count = 0;
			        return _this;
			    }
			    TakeSubscriber.prototype._next = function (value) {
			        var total = this.total;
			        var count = ++this.count;
			        if (count <= total) {
			            this.destination.next(value);
			            if (count === total) {
			                this.destination.complete();
			                this.unsubscribe();
			            }
			        }
			    };
			    return TakeSubscriber;
			}(Subscriber_1$n.Subscriber));

			Object.defineProperty(elementAt$1, "__esModule", { value: true });
			var ArgumentOutOfRangeError_1$2 = ArgumentOutOfRangeError;
			var filter_1$4 = filter$3;
			var throwIfEmpty_1$3 = throwIfEmpty$1;
			var defaultIfEmpty_1$4 = defaultIfEmpty$1;
			var take_1$2 = take$1;
			function elementAt(index, defaultValue) {
			    if (index < 0) {
			        throw new ArgumentOutOfRangeError_1$2.ArgumentOutOfRangeError();
			    }
			    var hasDefaultValue = arguments.length >= 2;
			    return function (source) { return source.pipe(filter_1$4.filter(function (v, i) { return i === index; }), take_1$2.take(1), hasDefaultValue
			        ? defaultIfEmpty_1$4.defaultIfEmpty(defaultValue)
			        : throwIfEmpty_1$3.throwIfEmpty(function () { return new ArgumentOutOfRangeError_1$2.ArgumentOutOfRangeError(); })); };
			}
			elementAt$1.elementAt = elementAt;

			var endWith$1 = {};

			Object.defineProperty(endWith$1, "__esModule", { value: true });
			var concat_1$2 = concat$3;
			var of_1 = of$1;
			function endWith() {
			    var array = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        array[_i] = arguments[_i];
			    }
			    return function (source) { return concat_1$2.concat(source, of_1.of.apply(void 0, array)); };
			}
			endWith$1.endWith = endWith;

			var every$1 = {};

			var __extends$D = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(every$1, "__esModule", { value: true });
			var Subscriber_1$m = Subscriber$1;
			function every(predicate, thisArg) {
			    return function (source) { return source.lift(new EveryOperator(predicate, thisArg, source)); };
			}
			every$1.every = every;
			var EveryOperator = (function () {
			    function EveryOperator(predicate, thisArg, source) {
			        this.predicate = predicate;
			        this.thisArg = thisArg;
			        this.source = source;
			    }
			    EveryOperator.prototype.call = function (observer, source) {
			        return source.subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
			    };
			    return EveryOperator;
			}());
			var EverySubscriber = (function (_super) {
			    __extends$D(EverySubscriber, _super);
			    function EverySubscriber(destination, predicate, thisArg, source) {
			        var _this = _super.call(this, destination) || this;
			        _this.predicate = predicate;
			        _this.thisArg = thisArg;
			        _this.source = source;
			        _this.index = 0;
			        _this.thisArg = thisArg || _this;
			        return _this;
			    }
			    EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
			        this.destination.next(everyValueMatch);
			        this.destination.complete();
			    };
			    EverySubscriber.prototype._next = function (value) {
			        var result = false;
			        try {
			            result = this.predicate.call(this.thisArg, value, this.index++, this.source);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        if (!result) {
			            this.notifyComplete(false);
			        }
			    };
			    EverySubscriber.prototype._complete = function () {
			        this.notifyComplete(true);
			    };
			    return EverySubscriber;
			}(Subscriber_1$m.Subscriber));

			var exhaust$1 = {};

			var __extends$C = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(exhaust$1, "__esModule", { value: true });
			var innerSubscribe_1$c = innerSubscribe$1;
			function exhaust() {
			    return function (source) { return source.lift(new SwitchFirstOperator()); };
			}
			exhaust$1.exhaust = exhaust;
			var SwitchFirstOperator = (function () {
			    function SwitchFirstOperator() {
			    }
			    SwitchFirstOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new SwitchFirstSubscriber(subscriber));
			    };
			    return SwitchFirstOperator;
			}());
			var SwitchFirstSubscriber = (function (_super) {
			    __extends$C(SwitchFirstSubscriber, _super);
			    function SwitchFirstSubscriber(destination) {
			        var _this = _super.call(this, destination) || this;
			        _this.hasCompleted = false;
			        _this.hasSubscription = false;
			        return _this;
			    }
			    SwitchFirstSubscriber.prototype._next = function (value) {
			        if (!this.hasSubscription) {
			            this.hasSubscription = true;
			            this.add(innerSubscribe_1$c.innerSubscribe(value, new innerSubscribe_1$c.SimpleInnerSubscriber(this)));
			        }
			    };
			    SwitchFirstSubscriber.prototype._complete = function () {
			        this.hasCompleted = true;
			        if (!this.hasSubscription) {
			            this.destination.complete();
			        }
			    };
			    SwitchFirstSubscriber.prototype.notifyComplete = function () {
			        this.hasSubscription = false;
			        if (this.hasCompleted) {
			            this.destination.complete();
			        }
			    };
			    return SwitchFirstSubscriber;
			}(innerSubscribe_1$c.SimpleOuterSubscriber));

			var exhaustMap$1 = {};

			var __extends$B = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(exhaustMap$1, "__esModule", { value: true });
			var map_1$5 = map$1;
			var from_1$2 = from$1;
			var innerSubscribe_1$b = innerSubscribe$1;
			function exhaustMap(project, resultSelector) {
			    if (resultSelector) {
			        return function (source) { return source.pipe(exhaustMap(function (a, i) { return from_1$2.from(project(a, i)).pipe(map_1$5.map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
			    }
			    return function (source) {
			        return source.lift(new ExhaustMapOperator(project));
			    };
			}
			exhaustMap$1.exhaustMap = exhaustMap;
			var ExhaustMapOperator = (function () {
			    function ExhaustMapOperator(project) {
			        this.project = project;
			    }
			    ExhaustMapOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new ExhaustMapSubscriber(subscriber, this.project));
			    };
			    return ExhaustMapOperator;
			}());
			var ExhaustMapSubscriber = (function (_super) {
			    __extends$B(ExhaustMapSubscriber, _super);
			    function ExhaustMapSubscriber(destination, project) {
			        var _this = _super.call(this, destination) || this;
			        _this.project = project;
			        _this.hasSubscription = false;
			        _this.hasCompleted = false;
			        _this.index = 0;
			        return _this;
			    }
			    ExhaustMapSubscriber.prototype._next = function (value) {
			        if (!this.hasSubscription) {
			            this.tryNext(value);
			        }
			    };
			    ExhaustMapSubscriber.prototype.tryNext = function (value) {
			        var result;
			        var index = this.index++;
			        try {
			            result = this.project(value, index);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        this.hasSubscription = true;
			        this._innerSub(result);
			    };
			    ExhaustMapSubscriber.prototype._innerSub = function (result) {
			        var innerSubscriber = new innerSubscribe_1$b.SimpleInnerSubscriber(this);
			        var destination = this.destination;
			        destination.add(innerSubscriber);
			        var innerSubscription = innerSubscribe_1$b.innerSubscribe(result, innerSubscriber);
			        if (innerSubscription !== innerSubscriber) {
			            destination.add(innerSubscription);
			        }
			    };
			    ExhaustMapSubscriber.prototype._complete = function () {
			        this.hasCompleted = true;
			        if (!this.hasSubscription) {
			            this.destination.complete();
			        }
			        this.unsubscribe();
			    };
			    ExhaustMapSubscriber.prototype.notifyNext = function (innerValue) {
			        this.destination.next(innerValue);
			    };
			    ExhaustMapSubscriber.prototype.notifyError = function (err) {
			        this.destination.error(err);
			    };
			    ExhaustMapSubscriber.prototype.notifyComplete = function () {
			        this.hasSubscription = false;
			        if (this.hasCompleted) {
			            this.destination.complete();
			        }
			    };
			    return ExhaustMapSubscriber;
			}(innerSubscribe_1$b.SimpleOuterSubscriber));

			var expand$1 = {};

			var __extends$A = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(expand$1, "__esModule", { value: true });
			var innerSubscribe_1$a = innerSubscribe$1;
			function expand(project, concurrent, scheduler) {
			    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
			    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
			    return function (source) { return source.lift(new ExpandOperator(project, concurrent, scheduler)); };
			}
			expand$1.expand = expand;
			var ExpandOperator = (function () {
			    function ExpandOperator(project, concurrent, scheduler) {
			        this.project = project;
			        this.concurrent = concurrent;
			        this.scheduler = scheduler;
			    }
			    ExpandOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
			    };
			    return ExpandOperator;
			}());
			expand$1.ExpandOperator = ExpandOperator;
			var ExpandSubscriber = (function (_super) {
			    __extends$A(ExpandSubscriber, _super);
			    function ExpandSubscriber(destination, project, concurrent, scheduler) {
			        var _this = _super.call(this, destination) || this;
			        _this.project = project;
			        _this.concurrent = concurrent;
			        _this.scheduler = scheduler;
			        _this.index = 0;
			        _this.active = 0;
			        _this.hasCompleted = false;
			        if (concurrent < Number.POSITIVE_INFINITY) {
			            _this.buffer = [];
			        }
			        return _this;
			    }
			    ExpandSubscriber.dispatch = function (arg) {
			        var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
			        subscriber.subscribeToProjection(result, value, index);
			    };
			    ExpandSubscriber.prototype._next = function (value) {
			        var destination = this.destination;
			        if (destination.closed) {
			            this._complete();
			            return;
			        }
			        var index = this.index++;
			        if (this.active < this.concurrent) {
			            destination.next(value);
			            try {
			                var project = this.project;
			                var result = project(value, index);
			                if (!this.scheduler) {
			                    this.subscribeToProjection(result, value, index);
			                }
			                else {
			                    var state = { subscriber: this, result: result, value: value, index: index };
			                    var destination_1 = this.destination;
			                    destination_1.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
			                }
			            }
			            catch (e) {
			                destination.error(e);
			            }
			        }
			        else {
			            this.buffer.push(value);
			        }
			    };
			    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
			        this.active++;
			        var destination = this.destination;
			        destination.add(innerSubscribe_1$a.innerSubscribe(result, new innerSubscribe_1$a.SimpleInnerSubscriber(this)));
			    };
			    ExpandSubscriber.prototype._complete = function () {
			        this.hasCompleted = true;
			        if (this.hasCompleted && this.active === 0) {
			            this.destination.complete();
			        }
			        this.unsubscribe();
			    };
			    ExpandSubscriber.prototype.notifyNext = function (innerValue) {
			        this._next(innerValue);
			    };
			    ExpandSubscriber.prototype.notifyComplete = function () {
			        var buffer = this.buffer;
			        this.active--;
			        if (buffer && buffer.length > 0) {
			            this._next(buffer.shift());
			        }
			        if (this.hasCompleted && this.active === 0) {
			            this.destination.complete();
			        }
			    };
			    return ExpandSubscriber;
			}(innerSubscribe_1$a.SimpleOuterSubscriber));
			expand$1.ExpandSubscriber = ExpandSubscriber;

			var finalize$1 = {};

			var __extends$z = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(finalize$1, "__esModule", { value: true });
			var Subscriber_1$l = Subscriber$1;
			var Subscription_1$1 = Subscription$1;
			function finalize(callback) {
			    return function (source) { return source.lift(new FinallyOperator(callback)); };
			}
			finalize$1.finalize = finalize;
			var FinallyOperator = (function () {
			    function FinallyOperator(callback) {
			        this.callback = callback;
			    }
			    FinallyOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new FinallySubscriber(subscriber, this.callback));
			    };
			    return FinallyOperator;
			}());
			var FinallySubscriber = (function (_super) {
			    __extends$z(FinallySubscriber, _super);
			    function FinallySubscriber(destination, callback) {
			        var _this = _super.call(this, destination) || this;
			        _this.add(new Subscription_1$1.Subscription(callback));
			        return _this;
			    }
			    return FinallySubscriber;
			}(Subscriber_1$l.Subscriber));

			var find$1 = {};

			var __extends$y = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(find$1, "__esModule", { value: true });
			var Subscriber_1$k = Subscriber$1;
			function find(predicate, thisArg) {
			    if (typeof predicate !== 'function') {
			        throw new TypeError('predicate is not a function');
			    }
			    return function (source) { return source.lift(new FindValueOperator(predicate, source, false, thisArg)); };
			}
			find$1.find = find;
			var FindValueOperator = (function () {
			    function FindValueOperator(predicate, source, yieldIndex, thisArg) {
			        this.predicate = predicate;
			        this.source = source;
			        this.yieldIndex = yieldIndex;
			        this.thisArg = thisArg;
			    }
			    FindValueOperator.prototype.call = function (observer, source) {
			        return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
			    };
			    return FindValueOperator;
			}());
			find$1.FindValueOperator = FindValueOperator;
			var FindValueSubscriber = (function (_super) {
			    __extends$y(FindValueSubscriber, _super);
			    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
			        var _this = _super.call(this, destination) || this;
			        _this.predicate = predicate;
			        _this.source = source;
			        _this.yieldIndex = yieldIndex;
			        _this.thisArg = thisArg;
			        _this.index = 0;
			        return _this;
			    }
			    FindValueSubscriber.prototype.notifyComplete = function (value) {
			        var destination = this.destination;
			        destination.next(value);
			        destination.complete();
			        this.unsubscribe();
			    };
			    FindValueSubscriber.prototype._next = function (value) {
			        var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
			        var index = this.index++;
			        try {
			            var result = predicate.call(thisArg || this, value, index, this.source);
			            if (result) {
			                this.notifyComplete(this.yieldIndex ? index : value);
			            }
			        }
			        catch (err) {
			            this.destination.error(err);
			        }
			    };
			    FindValueSubscriber.prototype._complete = function () {
			        this.notifyComplete(this.yieldIndex ? -1 : undefined);
			    };
			    return FindValueSubscriber;
			}(Subscriber_1$k.Subscriber));
			find$1.FindValueSubscriber = FindValueSubscriber;

			var findIndex$1 = {};

			Object.defineProperty(findIndex$1, "__esModule", { value: true });
			var find_1$1 = find$1;
			function findIndex(predicate, thisArg) {
			    return function (source) { return source.lift(new find_1$1.FindValueOperator(predicate, source, true, thisArg)); };
			}
			findIndex$1.findIndex = findIndex;

			var first$1 = {};

			Object.defineProperty(first$1, "__esModule", { value: true });
			var EmptyError_1$2 = EmptyError;
			var filter_1$3 = filter$3;
			var take_1$1 = take$1;
			var defaultIfEmpty_1$3 = defaultIfEmpty$1;
			var throwIfEmpty_1$2 = throwIfEmpty$1;
			var identity_1$2 = identity$1;
			function first(predicate, defaultValue) {
			    var hasDefaultValue = arguments.length >= 2;
			    return function (source) { return source.pipe(predicate ? filter_1$3.filter(function (v, i) { return predicate(v, i, source); }) : identity_1$2.identity, take_1$1.take(1), hasDefaultValue ? defaultIfEmpty_1$3.defaultIfEmpty(defaultValue) : throwIfEmpty_1$2.throwIfEmpty(function () { return new EmptyError_1$2.EmptyError(); })); };
			}
			first$1.first = first;

			var ignoreElements$1 = {};

			var __extends$x = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(ignoreElements$1, "__esModule", { value: true });
			var Subscriber_1$j = Subscriber$1;
			function ignoreElements() {
			    return function ignoreElementsOperatorFunction(source) {
			        return source.lift(new IgnoreElementsOperator());
			    };
			}
			ignoreElements$1.ignoreElements = ignoreElements;
			var IgnoreElementsOperator = (function () {
			    function IgnoreElementsOperator() {
			    }
			    IgnoreElementsOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new IgnoreElementsSubscriber(subscriber));
			    };
			    return IgnoreElementsOperator;
			}());
			var IgnoreElementsSubscriber = (function (_super) {
			    __extends$x(IgnoreElementsSubscriber, _super);
			    function IgnoreElementsSubscriber() {
			        return _super !== null && _super.apply(this, arguments) || this;
			    }
			    IgnoreElementsSubscriber.prototype._next = function (unused) {
			    };
			    return IgnoreElementsSubscriber;
			}(Subscriber_1$j.Subscriber));

			var isEmpty$1 = {};

			var __extends$w = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(isEmpty$1, "__esModule", { value: true });
			var Subscriber_1$i = Subscriber$1;
			function isEmpty() {
			    return function (source) { return source.lift(new IsEmptyOperator()); };
			}
			isEmpty$1.isEmpty = isEmpty;
			var IsEmptyOperator = (function () {
			    function IsEmptyOperator() {
			    }
			    IsEmptyOperator.prototype.call = function (observer, source) {
			        return source.subscribe(new IsEmptySubscriber(observer));
			    };
			    return IsEmptyOperator;
			}());
			var IsEmptySubscriber = (function (_super) {
			    __extends$w(IsEmptySubscriber, _super);
			    function IsEmptySubscriber(destination) {
			        return _super.call(this, destination) || this;
			    }
			    IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
			        var destination = this.destination;
			        destination.next(isEmpty);
			        destination.complete();
			    };
			    IsEmptySubscriber.prototype._next = function (value) {
			        this.notifyComplete(false);
			    };
			    IsEmptySubscriber.prototype._complete = function () {
			        this.notifyComplete(true);
			    };
			    return IsEmptySubscriber;
			}(Subscriber_1$i.Subscriber));

			var last$1 = {};

			var takeLast$1 = {};

			var __extends$v = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(takeLast$1, "__esModule", { value: true });
			var Subscriber_1$h = Subscriber$1;
			var ArgumentOutOfRangeError_1$1 = ArgumentOutOfRangeError;
			var empty_1$1 = empty;
			function takeLast(count) {
			    return function takeLastOperatorFunction(source) {
			        if (count === 0) {
			            return empty_1$1.empty();
			        }
			        else {
			            return source.lift(new TakeLastOperator(count));
			        }
			    };
			}
			takeLast$1.takeLast = takeLast;
			var TakeLastOperator = (function () {
			    function TakeLastOperator(total) {
			        this.total = total;
			        if (this.total < 0) {
			            throw new ArgumentOutOfRangeError_1$1.ArgumentOutOfRangeError;
			        }
			    }
			    TakeLastOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new TakeLastSubscriber(subscriber, this.total));
			    };
			    return TakeLastOperator;
			}());
			var TakeLastSubscriber = (function (_super) {
			    __extends$v(TakeLastSubscriber, _super);
			    function TakeLastSubscriber(destination, total) {
			        var _this = _super.call(this, destination) || this;
			        _this.total = total;
			        _this.ring = new Array();
			        _this.count = 0;
			        return _this;
			    }
			    TakeLastSubscriber.prototype._next = function (value) {
			        var ring = this.ring;
			        var total = this.total;
			        var count = this.count++;
			        if (ring.length < total) {
			            ring.push(value);
			        }
			        else {
			            var index = count % total;
			            ring[index] = value;
			        }
			    };
			    TakeLastSubscriber.prototype._complete = function () {
			        var destination = this.destination;
			        var count = this.count;
			        if (count > 0) {
			            var total = this.count >= this.total ? this.total : this.count;
			            var ring = this.ring;
			            for (var i = 0; i < total; i++) {
			                var idx = (count++) % total;
			                destination.next(ring[idx]);
			            }
			        }
			        destination.complete();
			    };
			    return TakeLastSubscriber;
			}(Subscriber_1$h.Subscriber));

			Object.defineProperty(last$1, "__esModule", { value: true });
			var EmptyError_1$1 = EmptyError;
			var filter_1$2 = filter$3;
			var takeLast_1$2 = takeLast$1;
			var throwIfEmpty_1$1 = throwIfEmpty$1;
			var defaultIfEmpty_1$2 = defaultIfEmpty$1;
			var identity_1$1 = identity$1;
			function last(predicate, defaultValue) {
			    var hasDefaultValue = arguments.length >= 2;
			    return function (source) { return source.pipe(predicate ? filter_1$2.filter(function (v, i) { return predicate(v, i, source); }) : identity_1$1.identity, takeLast_1$2.takeLast(1), hasDefaultValue ? defaultIfEmpty_1$2.defaultIfEmpty(defaultValue) : throwIfEmpty_1$1.throwIfEmpty(function () { return new EmptyError_1$1.EmptyError(); })); };
			}
			last$1.last = last;

			var mapTo$1 = {};

			var __extends$u = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(mapTo$1, "__esModule", { value: true });
			var Subscriber_1$g = Subscriber$1;
			function mapTo(value) {
			    return function (source) { return source.lift(new MapToOperator(value)); };
			}
			mapTo$1.mapTo = mapTo;
			var MapToOperator = (function () {
			    function MapToOperator(value) {
			        this.value = value;
			    }
			    MapToOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new MapToSubscriber(subscriber, this.value));
			    };
			    return MapToOperator;
			}());
			var MapToSubscriber = (function (_super) {
			    __extends$u(MapToSubscriber, _super);
			    function MapToSubscriber(destination, value) {
			        var _this = _super.call(this, destination) || this;
			        _this.value = value;
			        return _this;
			    }
			    MapToSubscriber.prototype._next = function (x) {
			        this.destination.next(this.value);
			    };
			    return MapToSubscriber;
			}(Subscriber_1$g.Subscriber));

			var materialize$1 = {};

			var __extends$t = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(materialize$1, "__esModule", { value: true });
			var Subscriber_1$f = Subscriber$1;
			var Notification_1 = Notification;
			function materialize() {
			    return function materializeOperatorFunction(source) {
			        return source.lift(new MaterializeOperator());
			    };
			}
			materialize$1.materialize = materialize;
			var MaterializeOperator = (function () {
			    function MaterializeOperator() {
			    }
			    MaterializeOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new MaterializeSubscriber(subscriber));
			    };
			    return MaterializeOperator;
			}());
			var MaterializeSubscriber = (function (_super) {
			    __extends$t(MaterializeSubscriber, _super);
			    function MaterializeSubscriber(destination) {
			        return _super.call(this, destination) || this;
			    }
			    MaterializeSubscriber.prototype._next = function (value) {
			        this.destination.next(Notification_1.Notification.createNext(value));
			    };
			    MaterializeSubscriber.prototype._error = function (err) {
			        var destination = this.destination;
			        destination.next(Notification_1.Notification.createError(err));
			        destination.complete();
			    };
			    MaterializeSubscriber.prototype._complete = function () {
			        var destination = this.destination;
			        destination.next(Notification_1.Notification.createComplete());
			        destination.complete();
			    };
			    return MaterializeSubscriber;
			}(Subscriber_1$f.Subscriber));

			var max$1 = {};

			var reduce$1 = {};

			var scan$1 = {};

			var __extends$s = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(scan$1, "__esModule", { value: true });
			var Subscriber_1$e = Subscriber$1;
			function scan(accumulator, seed) {
			    var hasSeed = false;
			    if (arguments.length >= 2) {
			        hasSeed = true;
			    }
			    return function scanOperatorFunction(source) {
			        return source.lift(new ScanOperator(accumulator, seed, hasSeed));
			    };
			}
			scan$1.scan = scan;
			var ScanOperator = (function () {
			    function ScanOperator(accumulator, seed, hasSeed) {
			        if (hasSeed === void 0) { hasSeed = false; }
			        this.accumulator = accumulator;
			        this.seed = seed;
			        this.hasSeed = hasSeed;
			    }
			    ScanOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
			    };
			    return ScanOperator;
			}());
			var ScanSubscriber = (function (_super) {
			    __extends$s(ScanSubscriber, _super);
			    function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
			        var _this = _super.call(this, destination) || this;
			        _this.accumulator = accumulator;
			        _this._seed = _seed;
			        _this.hasSeed = hasSeed;
			        _this.index = 0;
			        return _this;
			    }
			    Object.defineProperty(ScanSubscriber.prototype, "seed", {
			        get: function () {
			            return this._seed;
			        },
			        set: function (value) {
			            this.hasSeed = true;
			            this._seed = value;
			        },
			        enumerable: true,
			        configurable: true
			    });
			    ScanSubscriber.prototype._next = function (value) {
			        if (!this.hasSeed) {
			            this.seed = value;
			            this.destination.next(value);
			        }
			        else {
			            return this._tryNext(value);
			        }
			    };
			    ScanSubscriber.prototype._tryNext = function (value) {
			        var index = this.index++;
			        var result;
			        try {
			            result = this.accumulator(this.seed, value, index);
			        }
			        catch (err) {
			            this.destination.error(err);
			        }
			        this.seed = result;
			        this.destination.next(result);
			    };
			    return ScanSubscriber;
			}(Subscriber_1$e.Subscriber));

			Object.defineProperty(reduce$1, "__esModule", { value: true });
			var scan_1$2 = scan$1;
			var takeLast_1$1 = takeLast$1;
			var defaultIfEmpty_1$1 = defaultIfEmpty$1;
			var pipe_1 = pipe$1;
			function reduce(accumulator, seed) {
			    if (arguments.length >= 2) {
			        return function reduceOperatorFunctionWithSeed(source) {
			            return pipe_1.pipe(scan_1$2.scan(accumulator, seed), takeLast_1$1.takeLast(1), defaultIfEmpty_1$1.defaultIfEmpty(seed))(source);
			        };
			    }
			    return function reduceOperatorFunction(source) {
			        return pipe_1.pipe(scan_1$2.scan(function (acc, value, index) { return accumulator(acc, value, index + 1); }), takeLast_1$1.takeLast(1))(source);
			    };
			}
			reduce$1.reduce = reduce;

			Object.defineProperty(max$1, "__esModule", { value: true });
			var reduce_1$3 = reduce$1;
			function max(comparer) {
			    var max = (typeof comparer === 'function')
			        ? function (x, y) { return comparer(x, y) > 0 ? x : y; }
			        : function (x, y) { return x > y ? x : y; };
			    return reduce_1$3.reduce(max);
			}
			max$1.max = max;

			var merge$1 = {};

			Object.defineProperty(merge$1, "__esModule", { value: true });
			var merge_1$1 = merge$3;
			function merge() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    return function (source) { return source.lift.call(merge_1$1.merge.apply(void 0, [source].concat(observables))); };
			}
			merge$1.merge = merge;

			var mergeMapTo$1 = {};

			Object.defineProperty(mergeMapTo$1, "__esModule", { value: true });
			var mergeMap_1$1 = mergeMap$1;
			function mergeMapTo(innerObservable, resultSelector, concurrent) {
			    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
			    if (typeof resultSelector === 'function') {
			        return mergeMap_1$1.mergeMap(function () { return innerObservable; }, resultSelector, concurrent);
			    }
			    if (typeof resultSelector === 'number') {
			        concurrent = resultSelector;
			    }
			    return mergeMap_1$1.mergeMap(function () { return innerObservable; }, concurrent);
			}
			mergeMapTo$1.mergeMapTo = mergeMapTo;

			var mergeScan$1 = {};

			var __extends$r = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(mergeScan$1, "__esModule", { value: true });
			var innerSubscribe_1$9 = innerSubscribe$1;
			function mergeScan(accumulator, seed, concurrent) {
			    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
			    return function (source) { return source.lift(new MergeScanOperator(accumulator, seed, concurrent)); };
			}
			mergeScan$1.mergeScan = mergeScan;
			var MergeScanOperator = (function () {
			    function MergeScanOperator(accumulator, seed, concurrent) {
			        this.accumulator = accumulator;
			        this.seed = seed;
			        this.concurrent = concurrent;
			    }
			    MergeScanOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new MergeScanSubscriber(subscriber, this.accumulator, this.seed, this.concurrent));
			    };
			    return MergeScanOperator;
			}());
			mergeScan$1.MergeScanOperator = MergeScanOperator;
			var MergeScanSubscriber = (function (_super) {
			    __extends$r(MergeScanSubscriber, _super);
			    function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
			        var _this = _super.call(this, destination) || this;
			        _this.accumulator = accumulator;
			        _this.acc = acc;
			        _this.concurrent = concurrent;
			        _this.hasValue = false;
			        _this.hasCompleted = false;
			        _this.buffer = [];
			        _this.active = 0;
			        _this.index = 0;
			        return _this;
			    }
			    MergeScanSubscriber.prototype._next = function (value) {
			        if (this.active < this.concurrent) {
			            var index = this.index++;
			            var destination = this.destination;
			            var ish = void 0;
			            try {
			                var accumulator = this.accumulator;
			                ish = accumulator(this.acc, value, index);
			            }
			            catch (e) {
			                return destination.error(e);
			            }
			            this.active++;
			            this._innerSub(ish);
			        }
			        else {
			            this.buffer.push(value);
			        }
			    };
			    MergeScanSubscriber.prototype._innerSub = function (ish) {
			        var innerSubscriber = new innerSubscribe_1$9.SimpleInnerSubscriber(this);
			        var destination = this.destination;
			        destination.add(innerSubscriber);
			        var innerSubscription = innerSubscribe_1$9.innerSubscribe(ish, innerSubscriber);
			        if (innerSubscription !== innerSubscriber) {
			            destination.add(innerSubscription);
			        }
			    };
			    MergeScanSubscriber.prototype._complete = function () {
			        this.hasCompleted = true;
			        if (this.active === 0 && this.buffer.length === 0) {
			            if (this.hasValue === false) {
			                this.destination.next(this.acc);
			            }
			            this.destination.complete();
			        }
			        this.unsubscribe();
			    };
			    MergeScanSubscriber.prototype.notifyNext = function (innerValue) {
			        var destination = this.destination;
			        this.acc = innerValue;
			        this.hasValue = true;
			        destination.next(innerValue);
			    };
			    MergeScanSubscriber.prototype.notifyComplete = function () {
			        var buffer = this.buffer;
			        this.active--;
			        if (buffer.length > 0) {
			            this._next(buffer.shift());
			        }
			        else if (this.active === 0 && this.hasCompleted) {
			            if (this.hasValue === false) {
			                this.destination.next(this.acc);
			            }
			            this.destination.complete();
			        }
			    };
			    return MergeScanSubscriber;
			}(innerSubscribe_1$9.SimpleOuterSubscriber));
			mergeScan$1.MergeScanSubscriber = MergeScanSubscriber;

			var min$1 = {};

			Object.defineProperty(min$1, "__esModule", { value: true });
			var reduce_1$2 = reduce$1;
			function min(comparer) {
			    var min = (typeof comparer === 'function')
			        ? function (x, y) { return comparer(x, y) < 0 ? x : y; }
			        : function (x, y) { return x < y ? x : y; };
			    return reduce_1$2.reduce(min);
			}
			min$1.min = min;

			var multicast$1 = {};

			Object.defineProperty(multicast$1, "__esModule", { value: true });
			var ConnectableObservable_1 = ConnectableObservable$1;
			function multicast(subjectOrSubjectFactory, selector) {
			    return function multicastOperatorFunction(source) {
			        var subjectFactory;
			        if (typeof subjectOrSubjectFactory === 'function') {
			            subjectFactory = subjectOrSubjectFactory;
			        }
			        else {
			            subjectFactory = function subjectFactory() {
			                return subjectOrSubjectFactory;
			            };
			        }
			        if (typeof selector === 'function') {
			            return source.lift(new MulticastOperator(subjectFactory, selector));
			        }
			        var connectable = Object.create(source, ConnectableObservable_1.connectableObservableDescriptor);
			        connectable.source = source;
			        connectable.subjectFactory = subjectFactory;
			        return connectable;
			    };
			}
			multicast$1.multicast = multicast;
			var MulticastOperator = (function () {
			    function MulticastOperator(subjectFactory, selector) {
			        this.subjectFactory = subjectFactory;
			        this.selector = selector;
			    }
			    MulticastOperator.prototype.call = function (subscriber, source) {
			        var selector = this.selector;
			        var subject = this.subjectFactory();
			        var subscription = selector(subject).subscribe(subscriber);
			        subscription.add(source.subscribe(subject));
			        return subscription;
			    };
			    return MulticastOperator;
			}());
			multicast$1.MulticastOperator = MulticastOperator;

			var onErrorResumeNext$1 = {};

			var __extends$q = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(onErrorResumeNext$1, "__esModule", { value: true });
			var from_1$1 = from$1;
			var isArray_1$1 = isArray;
			var innerSubscribe_1$8 = innerSubscribe$1;
			function onErrorResumeNext() {
			    var nextSources = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        nextSources[_i] = arguments[_i];
			    }
			    if (nextSources.length === 1 && isArray_1$1.isArray(nextSources[0])) {
			        nextSources = nextSources[0];
			    }
			    return function (source) { return source.lift(new OnErrorResumeNextOperator(nextSources)); };
			}
			onErrorResumeNext$1.onErrorResumeNext = onErrorResumeNext;
			function onErrorResumeNextStatic() {
			    var nextSources = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        nextSources[_i] = arguments[_i];
			    }
			    var source = undefined;
			    if (nextSources.length === 1 && isArray_1$1.isArray(nextSources[0])) {
			        nextSources = nextSources[0];
			    }
			    source = nextSources.shift();
			    return from_1$1.from(source).lift(new OnErrorResumeNextOperator(nextSources));
			}
			onErrorResumeNext$1.onErrorResumeNextStatic = onErrorResumeNextStatic;
			var OnErrorResumeNextOperator = (function () {
			    function OnErrorResumeNextOperator(nextSources) {
			        this.nextSources = nextSources;
			    }
			    OnErrorResumeNextOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
			    };
			    return OnErrorResumeNextOperator;
			}());
			var OnErrorResumeNextSubscriber = (function (_super) {
			    __extends$q(OnErrorResumeNextSubscriber, _super);
			    function OnErrorResumeNextSubscriber(destination, nextSources) {
			        var _this = _super.call(this, destination) || this;
			        _this.destination = destination;
			        _this.nextSources = nextSources;
			        return _this;
			    }
			    OnErrorResumeNextSubscriber.prototype.notifyError = function () {
			        this.subscribeToNextSource();
			    };
			    OnErrorResumeNextSubscriber.prototype.notifyComplete = function () {
			        this.subscribeToNextSource();
			    };
			    OnErrorResumeNextSubscriber.prototype._error = function (err) {
			        this.subscribeToNextSource();
			        this.unsubscribe();
			    };
			    OnErrorResumeNextSubscriber.prototype._complete = function () {
			        this.subscribeToNextSource();
			        this.unsubscribe();
			    };
			    OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
			        var next = this.nextSources.shift();
			        if (!!next) {
			            var innerSubscriber = new innerSubscribe_1$8.SimpleInnerSubscriber(this);
			            var destination = this.destination;
			            destination.add(innerSubscriber);
			            var innerSubscription = innerSubscribe_1$8.innerSubscribe(next, innerSubscriber);
			            if (innerSubscription !== innerSubscriber) {
			                destination.add(innerSubscription);
			            }
			        }
			        else {
			            this.destination.complete();
			        }
			    };
			    return OnErrorResumeNextSubscriber;
			}(innerSubscribe_1$8.SimpleOuterSubscriber));

			var pairwise$1 = {};

			var __extends$p = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(pairwise$1, "__esModule", { value: true });
			var Subscriber_1$d = Subscriber$1;
			function pairwise() {
			    return function (source) { return source.lift(new PairwiseOperator()); };
			}
			pairwise$1.pairwise = pairwise;
			var PairwiseOperator = (function () {
			    function PairwiseOperator() {
			    }
			    PairwiseOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new PairwiseSubscriber(subscriber));
			    };
			    return PairwiseOperator;
			}());
			var PairwiseSubscriber = (function (_super) {
			    __extends$p(PairwiseSubscriber, _super);
			    function PairwiseSubscriber(destination) {
			        var _this = _super.call(this, destination) || this;
			        _this.hasPrev = false;
			        return _this;
			    }
			    PairwiseSubscriber.prototype._next = function (value) {
			        var pair;
			        if (this.hasPrev) {
			            pair = [this.prev, value];
			        }
			        else {
			            this.hasPrev = true;
			        }
			        this.prev = value;
			        if (pair) {
			            this.destination.next(pair);
			        }
			    };
			    return PairwiseSubscriber;
			}(Subscriber_1$d.Subscriber));

			var partition$1 = {};

			Object.defineProperty(partition$1, "__esModule", { value: true });
			var not_1 = not$1;
			var filter_1$1 = filter$3;
			function partition(predicate, thisArg) {
			    return function (source) { return [
			        filter_1$1.filter(predicate, thisArg)(source),
			        filter_1$1.filter(not_1.not(predicate, thisArg))(source)
			    ]; };
			}
			partition$1.partition = partition;

			var pluck$1 = {};

			Object.defineProperty(pluck$1, "__esModule", { value: true });
			var map_1$4 = map$1;
			function pluck() {
			    var properties = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        properties[_i] = arguments[_i];
			    }
			    var length = properties.length;
			    if (length === 0) {
			        throw new Error('list of properties cannot be empty.');
			    }
			    return function (source) { return map_1$4.map(plucker(properties, length))(source); };
			}
			pluck$1.pluck = pluck;
			function plucker(props, length) {
			    var mapper = function (x) {
			        var currentProp = x;
			        for (var i = 0; i < length; i++) {
			            var p = currentProp != null ? currentProp[props[i]] : undefined;
			            if (p !== void 0) {
			                currentProp = p;
			            }
			            else {
			                return undefined;
			            }
			        }
			        return currentProp;
			    };
			    return mapper;
			}

			var publish$1 = {};

			Object.defineProperty(publish$1, "__esModule", { value: true });
			var Subject_1$8 = Subject$1;
			var multicast_1$5 = multicast$1;
			function publish(selector) {
			    return selector ?
			        multicast_1$5.multicast(function () { return new Subject_1$8.Subject(); }, selector) :
			        multicast_1$5.multicast(new Subject_1$8.Subject());
			}
			publish$1.publish = publish;

			var publishBehavior$1 = {};

			Object.defineProperty(publishBehavior$1, "__esModule", { value: true });
			var BehaviorSubject_1 = BehaviorSubject$1;
			var multicast_1$4 = multicast$1;
			function publishBehavior(value) {
			    return function (source) { return multicast_1$4.multicast(new BehaviorSubject_1.BehaviorSubject(value))(source); };
			}
			publishBehavior$1.publishBehavior = publishBehavior;

			var publishLast$1 = {};

			Object.defineProperty(publishLast$1, "__esModule", { value: true });
			var AsyncSubject_1 = AsyncSubject$1;
			var multicast_1$3 = multicast$1;
			function publishLast() {
			    return function (source) { return multicast_1$3.multicast(new AsyncSubject_1.AsyncSubject())(source); };
			}
			publishLast$1.publishLast = publishLast;

			var publishReplay$1 = {};

			Object.defineProperty(publishReplay$1, "__esModule", { value: true });
			var ReplaySubject_1$1 = ReplaySubject$1;
			var multicast_1$2 = multicast$1;
			function publishReplay(bufferSize, windowTime, selectorOrScheduler, scheduler) {
			    if (selectorOrScheduler && typeof selectorOrScheduler !== 'function') {
			        scheduler = selectorOrScheduler;
			    }
			    var selector = typeof selectorOrScheduler === 'function' ? selectorOrScheduler : undefined;
			    var subject = new ReplaySubject_1$1.ReplaySubject(bufferSize, windowTime, scheduler);
			    return function (source) { return multicast_1$2.multicast(function () { return subject; }, selector)(source); };
			}
			publishReplay$1.publishReplay = publishReplay;

			var race$1 = {};

			Object.defineProperty(race$1, "__esModule", { value: true });
			var isArray_1 = isArray;
			var race_1$1 = race$3;
			function race() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    return function raceOperatorFunction(source) {
			        if (observables.length === 1 && isArray_1.isArray(observables[0])) {
			            observables = observables[0];
			        }
			        return source.lift.call(race_1$1.race.apply(void 0, [source].concat(observables)));
			    };
			}
			race$1.race = race;

			var repeat$1 = {};

			var __extends$o = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(repeat$1, "__esModule", { value: true });
			var Subscriber_1$c = Subscriber$1;
			var empty_1 = empty;
			function repeat(count) {
			    if (count === void 0) { count = -1; }
			    return function (source) {
			        if (count === 0) {
			            return empty_1.empty();
			        }
			        else if (count < 0) {
			            return source.lift(new RepeatOperator(-1, source));
			        }
			        else {
			            return source.lift(new RepeatOperator(count - 1, source));
			        }
			    };
			}
			repeat$1.repeat = repeat;
			var RepeatOperator = (function () {
			    function RepeatOperator(count, source) {
			        this.count = count;
			        this.source = source;
			    }
			    RepeatOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
			    };
			    return RepeatOperator;
			}());
			var RepeatSubscriber = (function (_super) {
			    __extends$o(RepeatSubscriber, _super);
			    function RepeatSubscriber(destination, count, source) {
			        var _this = _super.call(this, destination) || this;
			        _this.count = count;
			        _this.source = source;
			        return _this;
			    }
			    RepeatSubscriber.prototype.complete = function () {
			        if (!this.isStopped) {
			            var _a = this, source = _a.source, count = _a.count;
			            if (count === 0) {
			                return _super.prototype.complete.call(this);
			            }
			            else if (count > -1) {
			                this.count = count - 1;
			            }
			            source.subscribe(this._unsubscribeAndRecycle());
			        }
			    };
			    return RepeatSubscriber;
			}(Subscriber_1$c.Subscriber));

			var repeatWhen$1 = {};

			var __extends$n = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(repeatWhen$1, "__esModule", { value: true });
			var Subject_1$7 = Subject$1;
			var innerSubscribe_1$7 = innerSubscribe$1;
			function repeatWhen(notifier) {
			    return function (source) { return source.lift(new RepeatWhenOperator(notifier)); };
			}
			repeatWhen$1.repeatWhen = repeatWhen;
			var RepeatWhenOperator = (function () {
			    function RepeatWhenOperator(notifier) {
			        this.notifier = notifier;
			    }
			    RepeatWhenOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
			    };
			    return RepeatWhenOperator;
			}());
			var RepeatWhenSubscriber = (function (_super) {
			    __extends$n(RepeatWhenSubscriber, _super);
			    function RepeatWhenSubscriber(destination, notifier, source) {
			        var _this = _super.call(this, destination) || this;
			        _this.notifier = notifier;
			        _this.source = source;
			        _this.sourceIsBeingSubscribedTo = true;
			        return _this;
			    }
			    RepeatWhenSubscriber.prototype.notifyNext = function () {
			        this.sourceIsBeingSubscribedTo = true;
			        this.source.subscribe(this);
			    };
			    RepeatWhenSubscriber.prototype.notifyComplete = function () {
			        if (this.sourceIsBeingSubscribedTo === false) {
			            return _super.prototype.complete.call(this);
			        }
			    };
			    RepeatWhenSubscriber.prototype.complete = function () {
			        this.sourceIsBeingSubscribedTo = false;
			        if (!this.isStopped) {
			            if (!this.retries) {
			                this.subscribeToRetries();
			            }
			            if (!this.retriesSubscription || this.retriesSubscription.closed) {
			                return _super.prototype.complete.call(this);
			            }
			            this._unsubscribeAndRecycle();
			            this.notifications.next(undefined);
			        }
			    };
			    RepeatWhenSubscriber.prototype._unsubscribe = function () {
			        var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
			        if (notifications) {
			            notifications.unsubscribe();
			            this.notifications = undefined;
			        }
			        if (retriesSubscription) {
			            retriesSubscription.unsubscribe();
			            this.retriesSubscription = undefined;
			        }
			        this.retries = undefined;
			    };
			    RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
			        var _unsubscribe = this._unsubscribe;
			        this._unsubscribe = null;
			        _super.prototype._unsubscribeAndRecycle.call(this);
			        this._unsubscribe = _unsubscribe;
			        return this;
			    };
			    RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
			        this.notifications = new Subject_1$7.Subject();
			        var retries;
			        try {
			            var notifier = this.notifier;
			            retries = notifier(this.notifications);
			        }
			        catch (e) {
			            return _super.prototype.complete.call(this);
			        }
			        this.retries = retries;
			        this.retriesSubscription = innerSubscribe_1$7.innerSubscribe(retries, new innerSubscribe_1$7.SimpleInnerSubscriber(this));
			    };
			    return RepeatWhenSubscriber;
			}(innerSubscribe_1$7.SimpleOuterSubscriber));

			var retry$1 = {};

			var __extends$m = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(retry$1, "__esModule", { value: true });
			var Subscriber_1$b = Subscriber$1;
			function retry(count) {
			    if (count === void 0) { count = -1; }
			    return function (source) { return source.lift(new RetryOperator(count, source)); };
			}
			retry$1.retry = retry;
			var RetryOperator = (function () {
			    function RetryOperator(count, source) {
			        this.count = count;
			        this.source = source;
			    }
			    RetryOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new RetrySubscriber(subscriber, this.count, this.source));
			    };
			    return RetryOperator;
			}());
			var RetrySubscriber = (function (_super) {
			    __extends$m(RetrySubscriber, _super);
			    function RetrySubscriber(destination, count, source) {
			        var _this = _super.call(this, destination) || this;
			        _this.count = count;
			        _this.source = source;
			        return _this;
			    }
			    RetrySubscriber.prototype.error = function (err) {
			        if (!this.isStopped) {
			            var _a = this, source = _a.source, count = _a.count;
			            if (count === 0) {
			                return _super.prototype.error.call(this, err);
			            }
			            else if (count > -1) {
			                this.count = count - 1;
			            }
			            source.subscribe(this._unsubscribeAndRecycle());
			        }
			    };
			    return RetrySubscriber;
			}(Subscriber_1$b.Subscriber));

			var retryWhen$1 = {};

			var __extends$l = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(retryWhen$1, "__esModule", { value: true });
			var Subject_1$6 = Subject$1;
			var innerSubscribe_1$6 = innerSubscribe$1;
			function retryWhen(notifier) {
			    return function (source) { return source.lift(new RetryWhenOperator(notifier, source)); };
			}
			retryWhen$1.retryWhen = retryWhen;
			var RetryWhenOperator = (function () {
			    function RetryWhenOperator(notifier, source) {
			        this.notifier = notifier;
			        this.source = source;
			    }
			    RetryWhenOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
			    };
			    return RetryWhenOperator;
			}());
			var RetryWhenSubscriber = (function (_super) {
			    __extends$l(RetryWhenSubscriber, _super);
			    function RetryWhenSubscriber(destination, notifier, source) {
			        var _this = _super.call(this, destination) || this;
			        _this.notifier = notifier;
			        _this.source = source;
			        return _this;
			    }
			    RetryWhenSubscriber.prototype.error = function (err) {
			        if (!this.isStopped) {
			            var errors = this.errors;
			            var retries = this.retries;
			            var retriesSubscription = this.retriesSubscription;
			            if (!retries) {
			                errors = new Subject_1$6.Subject();
			                try {
			                    var notifier = this.notifier;
			                    retries = notifier(errors);
			                }
			                catch (e) {
			                    return _super.prototype.error.call(this, e);
			                }
			                retriesSubscription = innerSubscribe_1$6.innerSubscribe(retries, new innerSubscribe_1$6.SimpleInnerSubscriber(this));
			            }
			            else {
			                this.errors = undefined;
			                this.retriesSubscription = undefined;
			            }
			            this._unsubscribeAndRecycle();
			            this.errors = errors;
			            this.retries = retries;
			            this.retriesSubscription = retriesSubscription;
			            errors.next(err);
			        }
			    };
			    RetryWhenSubscriber.prototype._unsubscribe = function () {
			        var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
			        if (errors) {
			            errors.unsubscribe();
			            this.errors = undefined;
			        }
			        if (retriesSubscription) {
			            retriesSubscription.unsubscribe();
			            this.retriesSubscription = undefined;
			        }
			        this.retries = undefined;
			    };
			    RetryWhenSubscriber.prototype.notifyNext = function () {
			        var _unsubscribe = this._unsubscribe;
			        this._unsubscribe = null;
			        this._unsubscribeAndRecycle();
			        this._unsubscribe = _unsubscribe;
			        this.source.subscribe(this);
			    };
			    return RetryWhenSubscriber;
			}(innerSubscribe_1$6.SimpleOuterSubscriber));

			var sample$1 = {};

			var __extends$k = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(sample$1, "__esModule", { value: true });
			var innerSubscribe_1$5 = innerSubscribe$1;
			function sample(notifier) {
			    return function (source) { return source.lift(new SampleOperator(notifier)); };
			}
			sample$1.sample = sample;
			var SampleOperator = (function () {
			    function SampleOperator(notifier) {
			        this.notifier = notifier;
			    }
			    SampleOperator.prototype.call = function (subscriber, source) {
			        var sampleSubscriber = new SampleSubscriber(subscriber);
			        var subscription = source.subscribe(sampleSubscriber);
			        subscription.add(innerSubscribe_1$5.innerSubscribe(this.notifier, new innerSubscribe_1$5.SimpleInnerSubscriber(sampleSubscriber)));
			        return subscription;
			    };
			    return SampleOperator;
			}());
			var SampleSubscriber = (function (_super) {
			    __extends$k(SampleSubscriber, _super);
			    function SampleSubscriber() {
			        var _this = _super !== null && _super.apply(this, arguments) || this;
			        _this.hasValue = false;
			        return _this;
			    }
			    SampleSubscriber.prototype._next = function (value) {
			        this.value = value;
			        this.hasValue = true;
			    };
			    SampleSubscriber.prototype.notifyNext = function () {
			        this.emitValue();
			    };
			    SampleSubscriber.prototype.notifyComplete = function () {
			        this.emitValue();
			    };
			    SampleSubscriber.prototype.emitValue = function () {
			        if (this.hasValue) {
			            this.hasValue = false;
			            this.destination.next(this.value);
			        }
			    };
			    return SampleSubscriber;
			}(innerSubscribe_1$5.SimpleOuterSubscriber));

			var sampleTime$1 = {};

			var __extends$j = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(sampleTime$1, "__esModule", { value: true });
			var Subscriber_1$a = Subscriber$1;
			var async_1$6 = async;
			function sampleTime(period, scheduler) {
			    if (scheduler === void 0) { scheduler = async_1$6.async; }
			    return function (source) { return source.lift(new SampleTimeOperator(period, scheduler)); };
			}
			sampleTime$1.sampleTime = sampleTime;
			var SampleTimeOperator = (function () {
			    function SampleTimeOperator(period, scheduler) {
			        this.period = period;
			        this.scheduler = scheduler;
			    }
			    SampleTimeOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
			    };
			    return SampleTimeOperator;
			}());
			var SampleTimeSubscriber = (function (_super) {
			    __extends$j(SampleTimeSubscriber, _super);
			    function SampleTimeSubscriber(destination, period, scheduler) {
			        var _this = _super.call(this, destination) || this;
			        _this.period = period;
			        _this.scheduler = scheduler;
			        _this.hasValue = false;
			        _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
			        return _this;
			    }
			    SampleTimeSubscriber.prototype._next = function (value) {
			        this.lastValue = value;
			        this.hasValue = true;
			    };
			    SampleTimeSubscriber.prototype.notifyNext = function () {
			        if (this.hasValue) {
			            this.hasValue = false;
			            this.destination.next(this.lastValue);
			        }
			    };
			    return SampleTimeSubscriber;
			}(Subscriber_1$a.Subscriber));
			function dispatchNotification(state) {
			    var subscriber = state.subscriber, period = state.period;
			    subscriber.notifyNext();
			    this.schedule(state, period);
			}

			var sequenceEqual$1 = {};

			var __extends$i = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(sequenceEqual$1, "__esModule", { value: true });
			var Subscriber_1$9 = Subscriber$1;
			function sequenceEqual(compareTo, comparator) {
			    return function (source) { return source.lift(new SequenceEqualOperator(compareTo, comparator)); };
			}
			sequenceEqual$1.sequenceEqual = sequenceEqual;
			var SequenceEqualOperator = (function () {
			    function SequenceEqualOperator(compareTo, comparator) {
			        this.compareTo = compareTo;
			        this.comparator = comparator;
			    }
			    SequenceEqualOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparator));
			    };
			    return SequenceEqualOperator;
			}());
			sequenceEqual$1.SequenceEqualOperator = SequenceEqualOperator;
			var SequenceEqualSubscriber = (function (_super) {
			    __extends$i(SequenceEqualSubscriber, _super);
			    function SequenceEqualSubscriber(destination, compareTo, comparator) {
			        var _this = _super.call(this, destination) || this;
			        _this.compareTo = compareTo;
			        _this.comparator = comparator;
			        _this._a = [];
			        _this._b = [];
			        _this._oneComplete = false;
			        _this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
			        return _this;
			    }
			    SequenceEqualSubscriber.prototype._next = function (value) {
			        if (this._oneComplete && this._b.length === 0) {
			            this.emit(false);
			        }
			        else {
			            this._a.push(value);
			            this.checkValues();
			        }
			    };
			    SequenceEqualSubscriber.prototype._complete = function () {
			        if (this._oneComplete) {
			            this.emit(this._a.length === 0 && this._b.length === 0);
			        }
			        else {
			            this._oneComplete = true;
			        }
			        this.unsubscribe();
			    };
			    SequenceEqualSubscriber.prototype.checkValues = function () {
			        var _c = this, _a = _c._a, _b = _c._b, comparator = _c.comparator;
			        while (_a.length > 0 && _b.length > 0) {
			            var a = _a.shift();
			            var b = _b.shift();
			            var areEqual = false;
			            try {
			                areEqual = comparator ? comparator(a, b) : a === b;
			            }
			            catch (e) {
			                this.destination.error(e);
			            }
			            if (!areEqual) {
			                this.emit(false);
			            }
			        }
			    };
			    SequenceEqualSubscriber.prototype.emit = function (value) {
			        var destination = this.destination;
			        destination.next(value);
			        destination.complete();
			    };
			    SequenceEqualSubscriber.prototype.nextB = function (value) {
			        if (this._oneComplete && this._a.length === 0) {
			            this.emit(false);
			        }
			        else {
			            this._b.push(value);
			            this.checkValues();
			        }
			    };
			    SequenceEqualSubscriber.prototype.completeB = function () {
			        if (this._oneComplete) {
			            this.emit(this._a.length === 0 && this._b.length === 0);
			        }
			        else {
			            this._oneComplete = true;
			        }
			    };
			    return SequenceEqualSubscriber;
			}(Subscriber_1$9.Subscriber));
			sequenceEqual$1.SequenceEqualSubscriber = SequenceEqualSubscriber;
			var SequenceEqualCompareToSubscriber = (function (_super) {
			    __extends$i(SequenceEqualCompareToSubscriber, _super);
			    function SequenceEqualCompareToSubscriber(destination, parent) {
			        var _this = _super.call(this, destination) || this;
			        _this.parent = parent;
			        return _this;
			    }
			    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
			        this.parent.nextB(value);
			    };
			    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
			        this.parent.error(err);
			        this.unsubscribe();
			    };
			    SequenceEqualCompareToSubscriber.prototype._complete = function () {
			        this.parent.completeB();
			        this.unsubscribe();
			    };
			    return SequenceEqualCompareToSubscriber;
			}(Subscriber_1$9.Subscriber));

			var share$1 = {};

			Object.defineProperty(share$1, "__esModule", { value: true });
			var multicast_1$1 = multicast$1;
			var refCount_1$1 = refCount$1;
			var Subject_1$5 = Subject$1;
			function shareSubjectFactory() {
			    return new Subject_1$5.Subject();
			}
			function share() {
			    return function (source) { return refCount_1$1.refCount()(multicast_1$1.multicast(shareSubjectFactory)(source)); };
			}
			share$1.share = share;

			var shareReplay$1 = {};

			Object.defineProperty(shareReplay$1, "__esModule", { value: true });
			var ReplaySubject_1 = ReplaySubject$1;
			function shareReplay(configOrBufferSize, windowTime, scheduler) {
			    var config;
			    if (configOrBufferSize && typeof configOrBufferSize === 'object') {
			        config = configOrBufferSize;
			    }
			    else {
			        config = {
			            bufferSize: configOrBufferSize,
			            windowTime: windowTime,
			            refCount: false,
			            scheduler: scheduler
			        };
			    }
			    return function (source) { return source.lift(shareReplayOperator(config)); };
			}
			shareReplay$1.shareReplay = shareReplay;
			function shareReplayOperator(_a) {
			    var _b = _a.bufferSize, bufferSize = _b === void 0 ? Number.POSITIVE_INFINITY : _b, _c = _a.windowTime, windowTime = _c === void 0 ? Number.POSITIVE_INFINITY : _c, useRefCount = _a.refCount, scheduler = _a.scheduler;
			    var subject;
			    var refCount = 0;
			    var subscription;
			    var hasError = false;
			    var isComplete = false;
			    return function shareReplayOperation(source) {
			        refCount++;
			        var innerSub;
			        if (!subject || hasError) {
			            hasError = false;
			            subject = new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler);
			            innerSub = subject.subscribe(this);
			            subscription = source.subscribe({
			                next: function (value) { subject.next(value); },
			                error: function (err) {
			                    hasError = true;
			                    subject.error(err);
			                },
			                complete: function () {
			                    isComplete = true;
			                    subscription = undefined;
			                    subject.complete();
			                },
			            });
			        }
			        else {
			            innerSub = subject.subscribe(this);
			        }
			        this.add(function () {
			            refCount--;
			            innerSub.unsubscribe();
			            if (subscription && !isComplete && useRefCount && refCount === 0) {
			                subscription.unsubscribe();
			                subscription = undefined;
			                subject = undefined;
			            }
			        });
			    };
			}

			var single$1 = {};

			var __extends$h = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(single$1, "__esModule", { value: true });
			var Subscriber_1$8 = Subscriber$1;
			var EmptyError_1 = EmptyError;
			function single(predicate) {
			    return function (source) { return source.lift(new SingleOperator(predicate, source)); };
			}
			single$1.single = single;
			var SingleOperator = (function () {
			    function SingleOperator(predicate, source) {
			        this.predicate = predicate;
			        this.source = source;
			    }
			    SingleOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
			    };
			    return SingleOperator;
			}());
			var SingleSubscriber = (function (_super) {
			    __extends$h(SingleSubscriber, _super);
			    function SingleSubscriber(destination, predicate, source) {
			        var _this = _super.call(this, destination) || this;
			        _this.predicate = predicate;
			        _this.source = source;
			        _this.seenValue = false;
			        _this.index = 0;
			        return _this;
			    }
			    SingleSubscriber.prototype.applySingleValue = function (value) {
			        if (this.seenValue) {
			            this.destination.error('Sequence contains more than one element');
			        }
			        else {
			            this.seenValue = true;
			            this.singleValue = value;
			        }
			    };
			    SingleSubscriber.prototype._next = function (value) {
			        var index = this.index++;
			        if (this.predicate) {
			            this.tryNext(value, index);
			        }
			        else {
			            this.applySingleValue(value);
			        }
			    };
			    SingleSubscriber.prototype.tryNext = function (value, index) {
			        try {
			            if (this.predicate(value, index, this.source)) {
			                this.applySingleValue(value);
			            }
			        }
			        catch (err) {
			            this.destination.error(err);
			        }
			    };
			    SingleSubscriber.prototype._complete = function () {
			        var destination = this.destination;
			        if (this.index > 0) {
			            destination.next(this.seenValue ? this.singleValue : undefined);
			            destination.complete();
			        }
			        else {
			            destination.error(new EmptyError_1.EmptyError);
			        }
			    };
			    return SingleSubscriber;
			}(Subscriber_1$8.Subscriber));

			var skip$1 = {};

			var __extends$g = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(skip$1, "__esModule", { value: true });
			var Subscriber_1$7 = Subscriber$1;
			function skip(count) {
			    return function (source) { return source.lift(new SkipOperator(count)); };
			}
			skip$1.skip = skip;
			var SkipOperator = (function () {
			    function SkipOperator(total) {
			        this.total = total;
			    }
			    SkipOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new SkipSubscriber(subscriber, this.total));
			    };
			    return SkipOperator;
			}());
			var SkipSubscriber = (function (_super) {
			    __extends$g(SkipSubscriber, _super);
			    function SkipSubscriber(destination, total) {
			        var _this = _super.call(this, destination) || this;
			        _this.total = total;
			        _this.count = 0;
			        return _this;
			    }
			    SkipSubscriber.prototype._next = function (x) {
			        if (++this.count > this.total) {
			            this.destination.next(x);
			        }
			    };
			    return SkipSubscriber;
			}(Subscriber_1$7.Subscriber));

			var skipLast$1 = {};

			var __extends$f = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(skipLast$1, "__esModule", { value: true });
			var Subscriber_1$6 = Subscriber$1;
			var ArgumentOutOfRangeError_1 = ArgumentOutOfRangeError;
			function skipLast(count) {
			    return function (source) { return source.lift(new SkipLastOperator(count)); };
			}
			skipLast$1.skipLast = skipLast;
			var SkipLastOperator = (function () {
			    function SkipLastOperator(_skipCount) {
			        this._skipCount = _skipCount;
			        if (this._skipCount < 0) {
			            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
			        }
			    }
			    SkipLastOperator.prototype.call = function (subscriber, source) {
			        if (this._skipCount === 0) {
			            return source.subscribe(new Subscriber_1$6.Subscriber(subscriber));
			        }
			        else {
			            return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
			        }
			    };
			    return SkipLastOperator;
			}());
			var SkipLastSubscriber = (function (_super) {
			    __extends$f(SkipLastSubscriber, _super);
			    function SkipLastSubscriber(destination, _skipCount) {
			        var _this = _super.call(this, destination) || this;
			        _this._skipCount = _skipCount;
			        _this._count = 0;
			        _this._ring = new Array(_skipCount);
			        return _this;
			    }
			    SkipLastSubscriber.prototype._next = function (value) {
			        var skipCount = this._skipCount;
			        var count = this._count++;
			        if (count < skipCount) {
			            this._ring[count] = value;
			        }
			        else {
			            var currentIndex = count % skipCount;
			            var ring = this._ring;
			            var oldValue = ring[currentIndex];
			            ring[currentIndex] = value;
			            this.destination.next(oldValue);
			        }
			    };
			    return SkipLastSubscriber;
			}(Subscriber_1$6.Subscriber));

			var skipUntil$1 = {};

			var __extends$e = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(skipUntil$1, "__esModule", { value: true });
			var innerSubscribe_1$4 = innerSubscribe$1;
			function skipUntil(notifier) {
			    return function (source) { return source.lift(new SkipUntilOperator(notifier)); };
			}
			skipUntil$1.skipUntil = skipUntil;
			var SkipUntilOperator = (function () {
			    function SkipUntilOperator(notifier) {
			        this.notifier = notifier;
			    }
			    SkipUntilOperator.prototype.call = function (destination, source) {
			        return source.subscribe(new SkipUntilSubscriber(destination, this.notifier));
			    };
			    return SkipUntilOperator;
			}());
			var SkipUntilSubscriber = (function (_super) {
			    __extends$e(SkipUntilSubscriber, _super);
			    function SkipUntilSubscriber(destination, notifier) {
			        var _this = _super.call(this, destination) || this;
			        _this.hasValue = false;
			        var innerSubscriber = new innerSubscribe_1$4.SimpleInnerSubscriber(_this);
			        _this.add(innerSubscriber);
			        _this.innerSubscription = innerSubscriber;
			        var innerSubscription = innerSubscribe_1$4.innerSubscribe(notifier, innerSubscriber);
			        if (innerSubscription !== innerSubscriber) {
			            _this.add(innerSubscription);
			            _this.innerSubscription = innerSubscription;
			        }
			        return _this;
			    }
			    SkipUntilSubscriber.prototype._next = function (value) {
			        if (this.hasValue) {
			            _super.prototype._next.call(this, value);
			        }
			    };
			    SkipUntilSubscriber.prototype.notifyNext = function () {
			        this.hasValue = true;
			        if (this.innerSubscription) {
			            this.innerSubscription.unsubscribe();
			        }
			    };
			    SkipUntilSubscriber.prototype.notifyComplete = function () {
			    };
			    return SkipUntilSubscriber;
			}(innerSubscribe_1$4.SimpleOuterSubscriber));

			var skipWhile$1 = {};

			var __extends$d = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(skipWhile$1, "__esModule", { value: true });
			var Subscriber_1$5 = Subscriber$1;
			function skipWhile(predicate) {
			    return function (source) { return source.lift(new SkipWhileOperator(predicate)); };
			}
			skipWhile$1.skipWhile = skipWhile;
			var SkipWhileOperator = (function () {
			    function SkipWhileOperator(predicate) {
			        this.predicate = predicate;
			    }
			    SkipWhileOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
			    };
			    return SkipWhileOperator;
			}());
			var SkipWhileSubscriber = (function (_super) {
			    __extends$d(SkipWhileSubscriber, _super);
			    function SkipWhileSubscriber(destination, predicate) {
			        var _this = _super.call(this, destination) || this;
			        _this.predicate = predicate;
			        _this.skipping = true;
			        _this.index = 0;
			        return _this;
			    }
			    SkipWhileSubscriber.prototype._next = function (value) {
			        var destination = this.destination;
			        if (this.skipping) {
			            this.tryCallPredicate(value);
			        }
			        if (!this.skipping) {
			            destination.next(value);
			        }
			    };
			    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
			        try {
			            var result = this.predicate(value, this.index++);
			            this.skipping = Boolean(result);
			        }
			        catch (err) {
			            this.destination.error(err);
			        }
			    };
			    return SkipWhileSubscriber;
			}(Subscriber_1$5.Subscriber));

			var startWith$1 = {};

			Object.defineProperty(startWith$1, "__esModule", { value: true });
			var concat_1$1 = concat$3;
			var isScheduler_1$1 = isScheduler$1;
			function startWith() {
			    var array = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        array[_i] = arguments[_i];
			    }
			    var scheduler = array[array.length - 1];
			    if (isScheduler_1$1.isScheduler(scheduler)) {
			        array.pop();
			        return function (source) { return concat_1$1.concat(array, source, scheduler); };
			    }
			    else {
			        return function (source) { return concat_1$1.concat(array, source); };
			    }
			}
			startWith$1.startWith = startWith;

			var subscribeOn$1 = {};

			var SubscribeOnObservable$1 = {};

			var __extends$c = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(SubscribeOnObservable$1, "__esModule", { value: true });
			var Observable_1 = Observable$1;
			var asap_1 = asap;
			var isNumeric_1$1 = isNumeric$1;
			var SubscribeOnObservable = (function (_super) {
			    __extends$c(SubscribeOnObservable, _super);
			    function SubscribeOnObservable(source, delayTime, scheduler) {
			        if (delayTime === void 0) { delayTime = 0; }
			        if (scheduler === void 0) { scheduler = asap_1.asap; }
			        var _this = _super.call(this) || this;
			        _this.source = source;
			        _this.delayTime = delayTime;
			        _this.scheduler = scheduler;
			        if (!isNumeric_1$1.isNumeric(delayTime) || delayTime < 0) {
			            _this.delayTime = 0;
			        }
			        if (!scheduler || typeof scheduler.schedule !== 'function') {
			            _this.scheduler = asap_1.asap;
			        }
			        return _this;
			    }
			    SubscribeOnObservable.create = function (source, delay, scheduler) {
			        if (delay === void 0) { delay = 0; }
			        if (scheduler === void 0) { scheduler = asap_1.asap; }
			        return new SubscribeOnObservable(source, delay, scheduler);
			    };
			    SubscribeOnObservable.dispatch = function (arg) {
			        var source = arg.source, subscriber = arg.subscriber;
			        return this.add(source.subscribe(subscriber));
			    };
			    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
			        var delay = this.delayTime;
			        var source = this.source;
			        var scheduler = this.scheduler;
			        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
			            source: source, subscriber: subscriber
			        });
			    };
			    return SubscribeOnObservable;
			}(Observable_1.Observable));
			SubscribeOnObservable$1.SubscribeOnObservable = SubscribeOnObservable;

			Object.defineProperty(subscribeOn$1, "__esModule", { value: true });
			var SubscribeOnObservable_1 = SubscribeOnObservable$1;
			function subscribeOn(scheduler, delay) {
			    if (delay === void 0) { delay = 0; }
			    return function subscribeOnOperatorFunction(source) {
			        return source.lift(new SubscribeOnOperator(scheduler, delay));
			    };
			}
			subscribeOn$1.subscribeOn = subscribeOn;
			var SubscribeOnOperator = (function () {
			    function SubscribeOnOperator(scheduler, delay) {
			        this.scheduler = scheduler;
			        this.delay = delay;
			    }
			    SubscribeOnOperator.prototype.call = function (subscriber, source) {
			        return new SubscribeOnObservable_1.SubscribeOnObservable(source, this.delay, this.scheduler).subscribe(subscriber);
			    };
			    return SubscribeOnOperator;
			}());

			var switchAll$1 = {};

			var switchMap$1 = {};

			var __extends$b = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(switchMap$1, "__esModule", { value: true });
			var map_1$3 = map$1;
			var from_1 = from$1;
			var innerSubscribe_1$3 = innerSubscribe$1;
			function switchMap(project, resultSelector) {
			    if (typeof resultSelector === 'function') {
			        return function (source) { return source.pipe(switchMap(function (a, i) { return from_1.from(project(a, i)).pipe(map_1$3.map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
			    }
			    return function (source) { return source.lift(new SwitchMapOperator(project)); };
			}
			switchMap$1.switchMap = switchMap;
			var SwitchMapOperator = (function () {
			    function SwitchMapOperator(project) {
			        this.project = project;
			    }
			    SwitchMapOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
			    };
			    return SwitchMapOperator;
			}());
			var SwitchMapSubscriber = (function (_super) {
			    __extends$b(SwitchMapSubscriber, _super);
			    function SwitchMapSubscriber(destination, project) {
			        var _this = _super.call(this, destination) || this;
			        _this.project = project;
			        _this.index = 0;
			        return _this;
			    }
			    SwitchMapSubscriber.prototype._next = function (value) {
			        var result;
			        var index = this.index++;
			        try {
			            result = this.project(value, index);
			        }
			        catch (error) {
			            this.destination.error(error);
			            return;
			        }
			        this._innerSub(result);
			    };
			    SwitchMapSubscriber.prototype._innerSub = function (result) {
			        var innerSubscription = this.innerSubscription;
			        if (innerSubscription) {
			            innerSubscription.unsubscribe();
			        }
			        var innerSubscriber = new innerSubscribe_1$3.SimpleInnerSubscriber(this);
			        var destination = this.destination;
			        destination.add(innerSubscriber);
			        this.innerSubscription = innerSubscribe_1$3.innerSubscribe(result, innerSubscriber);
			        if (this.innerSubscription !== innerSubscriber) {
			            destination.add(this.innerSubscription);
			        }
			    };
			    SwitchMapSubscriber.prototype._complete = function () {
			        var innerSubscription = this.innerSubscription;
			        if (!innerSubscription || innerSubscription.closed) {
			            _super.prototype._complete.call(this);
			        }
			        this.unsubscribe();
			    };
			    SwitchMapSubscriber.prototype._unsubscribe = function () {
			        this.innerSubscription = undefined;
			    };
			    SwitchMapSubscriber.prototype.notifyComplete = function () {
			        this.innerSubscription = undefined;
			        if (this.isStopped) {
			            _super.prototype._complete.call(this);
			        }
			    };
			    SwitchMapSubscriber.prototype.notifyNext = function (innerValue) {
			        this.destination.next(innerValue);
			    };
			    return SwitchMapSubscriber;
			}(innerSubscribe_1$3.SimpleOuterSubscriber));

			Object.defineProperty(switchAll$1, "__esModule", { value: true });
			var switchMap_1$2 = switchMap$1;
			var identity_1 = identity$1;
			function switchAll() {
			    return switchMap_1$2.switchMap(identity_1.identity);
			}
			switchAll$1.switchAll = switchAll;

			var switchMapTo$1 = {};

			Object.defineProperty(switchMapTo$1, "__esModule", { value: true });
			var switchMap_1$1 = switchMap$1;
			function switchMapTo(innerObservable, resultSelector) {
			    return resultSelector ? switchMap_1$1.switchMap(function () { return innerObservable; }, resultSelector) : switchMap_1$1.switchMap(function () { return innerObservable; });
			}
			switchMapTo$1.switchMapTo = switchMapTo;

			var takeUntil$1 = {};

			var __extends$a = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(takeUntil$1, "__esModule", { value: true });
			var innerSubscribe_1$2 = innerSubscribe$1;
			function takeUntil(notifier) {
			    return function (source) { return source.lift(new TakeUntilOperator(notifier)); };
			}
			takeUntil$1.takeUntil = takeUntil;
			var TakeUntilOperator = (function () {
			    function TakeUntilOperator(notifier) {
			        this.notifier = notifier;
			    }
			    TakeUntilOperator.prototype.call = function (subscriber, source) {
			        var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
			        var notifierSubscription = innerSubscribe_1$2.innerSubscribe(this.notifier, new innerSubscribe_1$2.SimpleInnerSubscriber(takeUntilSubscriber));
			        if (notifierSubscription && !takeUntilSubscriber.seenValue) {
			            takeUntilSubscriber.add(notifierSubscription);
			            return source.subscribe(takeUntilSubscriber);
			        }
			        return takeUntilSubscriber;
			    };
			    return TakeUntilOperator;
			}());
			var TakeUntilSubscriber = (function (_super) {
			    __extends$a(TakeUntilSubscriber, _super);
			    function TakeUntilSubscriber(destination) {
			        var _this = _super.call(this, destination) || this;
			        _this.seenValue = false;
			        return _this;
			    }
			    TakeUntilSubscriber.prototype.notifyNext = function () {
			        this.seenValue = true;
			        this.complete();
			    };
			    TakeUntilSubscriber.prototype.notifyComplete = function () {
			    };
			    return TakeUntilSubscriber;
			}(innerSubscribe_1$2.SimpleOuterSubscriber));

			var takeWhile$1 = {};

			var __extends$9 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(takeWhile$1, "__esModule", { value: true });
			var Subscriber_1$4 = Subscriber$1;
			function takeWhile(predicate, inclusive) {
			    if (inclusive === void 0) { inclusive = false; }
			    return function (source) {
			        return source.lift(new TakeWhileOperator(predicate, inclusive));
			    };
			}
			takeWhile$1.takeWhile = takeWhile;
			var TakeWhileOperator = (function () {
			    function TakeWhileOperator(predicate, inclusive) {
			        this.predicate = predicate;
			        this.inclusive = inclusive;
			    }
			    TakeWhileOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate, this.inclusive));
			    };
			    return TakeWhileOperator;
			}());
			var TakeWhileSubscriber = (function (_super) {
			    __extends$9(TakeWhileSubscriber, _super);
			    function TakeWhileSubscriber(destination, predicate, inclusive) {
			        var _this = _super.call(this, destination) || this;
			        _this.predicate = predicate;
			        _this.inclusive = inclusive;
			        _this.index = 0;
			        return _this;
			    }
			    TakeWhileSubscriber.prototype._next = function (value) {
			        var destination = this.destination;
			        var result;
			        try {
			            result = this.predicate(value, this.index++);
			        }
			        catch (err) {
			            destination.error(err);
			            return;
			        }
			        this.nextOrComplete(value, result);
			    };
			    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
			        var destination = this.destination;
			        if (Boolean(predicateResult)) {
			            destination.next(value);
			        }
			        else {
			            if (this.inclusive) {
			                destination.next(value);
			            }
			            destination.complete();
			        }
			    };
			    return TakeWhileSubscriber;
			}(Subscriber_1$4.Subscriber));

			var tap$1 = {};

			var __extends$8 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(tap$1, "__esModule", { value: true });
			var Subscriber_1$3 = Subscriber$1;
			var noop_1 = noop$1;
			var isFunction_1 = isFunction$1;
			function tap(nextOrObserver, error, complete) {
			    return function tapOperatorFunction(source) {
			        return source.lift(new DoOperator(nextOrObserver, error, complete));
			    };
			}
			tap$1.tap = tap;
			var DoOperator = (function () {
			    function DoOperator(nextOrObserver, error, complete) {
			        this.nextOrObserver = nextOrObserver;
			        this.error = error;
			        this.complete = complete;
			    }
			    DoOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
			    };
			    return DoOperator;
			}());
			var TapSubscriber = (function (_super) {
			    __extends$8(TapSubscriber, _super);
			    function TapSubscriber(destination, observerOrNext, error, complete) {
			        var _this = _super.call(this, destination) || this;
			        _this._tapNext = noop_1.noop;
			        _this._tapError = noop_1.noop;
			        _this._tapComplete = noop_1.noop;
			        _this._tapError = error || noop_1.noop;
			        _this._tapComplete = complete || noop_1.noop;
			        if (isFunction_1.isFunction(observerOrNext)) {
			            _this._context = _this;
			            _this._tapNext = observerOrNext;
			        }
			        else if (observerOrNext) {
			            _this._context = observerOrNext;
			            _this._tapNext = observerOrNext.next || noop_1.noop;
			            _this._tapError = observerOrNext.error || noop_1.noop;
			            _this._tapComplete = observerOrNext.complete || noop_1.noop;
			        }
			        return _this;
			    }
			    TapSubscriber.prototype._next = function (value) {
			        try {
			            this._tapNext.call(this._context, value);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        this.destination.next(value);
			    };
			    TapSubscriber.prototype._error = function (err) {
			        try {
			            this._tapError.call(this._context, err);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        this.destination.error(err);
			    };
			    TapSubscriber.prototype._complete = function () {
			        try {
			            this._tapComplete.call(this._context);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        return this.destination.complete();
			    };
			    return TapSubscriber;
			}(Subscriber_1$3.Subscriber));

			var throttle = {};

			(function (exports) {
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
			Object.defineProperty(exports, "__esModule", { value: true });
			var innerSubscribe_1 = innerSubscribe$1;
			exports.defaultThrottleConfig = {
			    leading: true,
			    trailing: false
			};
			function throttle(durationSelector, config) {
			    if (config === void 0) { config = exports.defaultThrottleConfig; }
			    return function (source) { return source.lift(new ThrottleOperator(durationSelector, !!config.leading, !!config.trailing)); };
			}
			exports.throttle = throttle;
			var ThrottleOperator = (function () {
			    function ThrottleOperator(durationSelector, leading, trailing) {
			        this.durationSelector = durationSelector;
			        this.leading = leading;
			        this.trailing = trailing;
			    }
			    ThrottleOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
			    };
			    return ThrottleOperator;
			}());
			var ThrottleSubscriber = (function (_super) {
			    __extends(ThrottleSubscriber, _super);
			    function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
			        var _this = _super.call(this, destination) || this;
			        _this.destination = destination;
			        _this.durationSelector = durationSelector;
			        _this._leading = _leading;
			        _this._trailing = _trailing;
			        _this._hasValue = false;
			        return _this;
			    }
			    ThrottleSubscriber.prototype._next = function (value) {
			        this._hasValue = true;
			        this._sendValue = value;
			        if (!this._throttled) {
			            if (this._leading) {
			                this.send();
			            }
			            else {
			                this.throttle(value);
			            }
			        }
			    };
			    ThrottleSubscriber.prototype.send = function () {
			        var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
			        if (_hasValue) {
			            this.destination.next(_sendValue);
			            this.throttle(_sendValue);
			        }
			        this._hasValue = false;
			        this._sendValue = undefined;
			    };
			    ThrottleSubscriber.prototype.throttle = function (value) {
			        var duration = this.tryDurationSelector(value);
			        if (!!duration) {
			            this.add(this._throttled = innerSubscribe_1.innerSubscribe(duration, new innerSubscribe_1.SimpleInnerSubscriber(this)));
			        }
			    };
			    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
			        try {
			            return this.durationSelector(value);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return null;
			        }
			    };
			    ThrottleSubscriber.prototype.throttlingDone = function () {
			        var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
			        if (_throttled) {
			            _throttled.unsubscribe();
			        }
			        this._throttled = undefined;
			        if (_trailing) {
			            this.send();
			        }
			    };
			    ThrottleSubscriber.prototype.notifyNext = function () {
			        this.throttlingDone();
			    };
			    ThrottleSubscriber.prototype.notifyComplete = function () {
			        this.throttlingDone();
			    };
			    return ThrottleSubscriber;
			}(innerSubscribe_1.SimpleOuterSubscriber));

			}(throttle));

			var throttleTime$1 = {};

			var __extends$7 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(throttleTime$1, "__esModule", { value: true });
			var Subscriber_1$2 = Subscriber$1;
			var async_1$5 = async;
			var throttle_1$1 = throttle;
			function throttleTime(duration, scheduler, config) {
			    if (scheduler === void 0) { scheduler = async_1$5.async; }
			    if (config === void 0) { config = throttle_1$1.defaultThrottleConfig; }
			    return function (source) { return source.lift(new ThrottleTimeOperator(duration, scheduler, config.leading, config.trailing)); };
			}
			throttleTime$1.throttleTime = throttleTime;
			var ThrottleTimeOperator = (function () {
			    function ThrottleTimeOperator(duration, scheduler, leading, trailing) {
			        this.duration = duration;
			        this.scheduler = scheduler;
			        this.leading = leading;
			        this.trailing = trailing;
			    }
			    ThrottleTimeOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler, this.leading, this.trailing));
			    };
			    return ThrottleTimeOperator;
			}());
			var ThrottleTimeSubscriber = (function (_super) {
			    __extends$7(ThrottleTimeSubscriber, _super);
			    function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
			        var _this = _super.call(this, destination) || this;
			        _this.duration = duration;
			        _this.scheduler = scheduler;
			        _this.leading = leading;
			        _this.trailing = trailing;
			        _this._hasTrailingValue = false;
			        _this._trailingValue = null;
			        return _this;
			    }
			    ThrottleTimeSubscriber.prototype._next = function (value) {
			        if (this.throttled) {
			            if (this.trailing) {
			                this._trailingValue = value;
			                this._hasTrailingValue = true;
			            }
			        }
			        else {
			            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
			            if (this.leading) {
			                this.destination.next(value);
			            }
			            else if (this.trailing) {
			                this._trailingValue = value;
			                this._hasTrailingValue = true;
			            }
			        }
			    };
			    ThrottleTimeSubscriber.prototype._complete = function () {
			        if (this._hasTrailingValue) {
			            this.destination.next(this._trailingValue);
			            this.destination.complete();
			        }
			        else {
			            this.destination.complete();
			        }
			    };
			    ThrottleTimeSubscriber.prototype.clearThrottle = function () {
			        var throttled = this.throttled;
			        if (throttled) {
			            if (this.trailing && this._hasTrailingValue) {
			                this.destination.next(this._trailingValue);
			                this._trailingValue = null;
			                this._hasTrailingValue = false;
			            }
			            throttled.unsubscribe();
			            this.remove(throttled);
			            this.throttled = null;
			        }
			    };
			    return ThrottleTimeSubscriber;
			}(Subscriber_1$2.Subscriber));
			function dispatchNext(arg) {
			    var subscriber = arg.subscriber;
			    subscriber.clearThrottle();
			}

			var timeInterval$1 = {};

			Object.defineProperty(timeInterval$1, "__esModule", { value: true });
			var async_1$4 = async;
			var scan_1$1 = scan$1;
			var defer_1 = defer$1;
			var map_1$2 = map$1;
			function timeInterval(scheduler) {
			    if (scheduler === void 0) { scheduler = async_1$4.async; }
			    return function (source) { return defer_1.defer(function () {
			        return source.pipe(scan_1$1.scan(function (_a, value) {
			            var current = _a.current;
			            return ({ value: value, current: scheduler.now(), last: current });
			        }, { current: scheduler.now(), value: undefined, last: undefined }), map_1$2.map(function (_a) {
			            var current = _a.current, last = _a.last, value = _a.value;
			            return new TimeInterval(value, current - last);
			        }));
			    }); };
			}
			timeInterval$1.timeInterval = timeInterval;
			var TimeInterval = (function () {
			    function TimeInterval(value, interval) {
			        this.value = value;
			        this.interval = interval;
			    }
			    return TimeInterval;
			}());
			timeInterval$1.TimeInterval = TimeInterval;

			var timeout$1 = {};

			var timeoutWith$1 = {};

			var __extends$6 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(timeoutWith$1, "__esModule", { value: true });
			var async_1$3 = async;
			var isDate_1 = isDate$1;
			var innerSubscribe_1$1 = innerSubscribe$1;
			function timeoutWith(due, withObservable, scheduler) {
			    if (scheduler === void 0) { scheduler = async_1$3.async; }
			    return function (source) {
			        var absoluteTimeout = isDate_1.isDate(due);
			        var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
			        return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
			    };
			}
			timeoutWith$1.timeoutWith = timeoutWith;
			var TimeoutWithOperator = (function () {
			    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
			        this.waitFor = waitFor;
			        this.absoluteTimeout = absoluteTimeout;
			        this.withObservable = withObservable;
			        this.scheduler = scheduler;
			    }
			    TimeoutWithOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
			    };
			    return TimeoutWithOperator;
			}());
			var TimeoutWithSubscriber = (function (_super) {
			    __extends$6(TimeoutWithSubscriber, _super);
			    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
			        var _this = _super.call(this, destination) || this;
			        _this.absoluteTimeout = absoluteTimeout;
			        _this.waitFor = waitFor;
			        _this.withObservable = withObservable;
			        _this.scheduler = scheduler;
			        _this.scheduleTimeout();
			        return _this;
			    }
			    TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
			        var withObservable = subscriber.withObservable;
			        subscriber._unsubscribeAndRecycle();
			        subscriber.add(innerSubscribe_1$1.innerSubscribe(withObservable, new innerSubscribe_1$1.SimpleInnerSubscriber(subscriber)));
			    };
			    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
			        var action = this.action;
			        if (action) {
			            this.action = action.schedule(this, this.waitFor);
			        }
			        else {
			            this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
			        }
			    };
			    TimeoutWithSubscriber.prototype._next = function (value) {
			        if (!this.absoluteTimeout) {
			            this.scheduleTimeout();
			        }
			        _super.prototype._next.call(this, value);
			    };
			    TimeoutWithSubscriber.prototype._unsubscribe = function () {
			        this.action = undefined;
			        this.scheduler = null;
			        this.withObservable = null;
			    };
			    return TimeoutWithSubscriber;
			}(innerSubscribe_1$1.SimpleOuterSubscriber));

			Object.defineProperty(timeout$1, "__esModule", { value: true });
			var async_1$2 = async;
			var TimeoutError_1 = TimeoutError;
			var timeoutWith_1$1 = timeoutWith$1;
			var throwError_1 = throwError$1;
			function timeout(due, scheduler) {
			    if (scheduler === void 0) { scheduler = async_1$2.async; }
			    return timeoutWith_1$1.timeoutWith(due, throwError_1.throwError(new TimeoutError_1.TimeoutError()), scheduler);
			}
			timeout$1.timeout = timeout;

			var timestamp$1 = {};

			Object.defineProperty(timestamp$1, "__esModule", { value: true });
			var async_1$1 = async;
			var map_1$1 = map$1;
			function timestamp(scheduler) {
			    if (scheduler === void 0) { scheduler = async_1$1.async; }
			    return map_1$1.map(function (value) { return new Timestamp(value, scheduler.now()); });
			}
			timestamp$1.timestamp = timestamp;
			var Timestamp = (function () {
			    function Timestamp(value, timestamp) {
			        this.value = value;
			        this.timestamp = timestamp;
			    }
			    return Timestamp;
			}());
			timestamp$1.Timestamp = Timestamp;

			var toArray$1 = {};

			Object.defineProperty(toArray$1, "__esModule", { value: true });
			var reduce_1$1 = reduce$1;
			function toArrayReducer(arr, item, index) {
			    if (index === 0) {
			        return [item];
			    }
			    arr.push(item);
			    return arr;
			}
			function toArray() {
			    return reduce_1$1.reduce(toArrayReducer, []);
			}
			toArray$1.toArray = toArray;

			var window$2 = {};

			var __extends$5 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(window$2, "__esModule", { value: true });
			var Subject_1$4 = Subject$1;
			var innerSubscribe_1 = innerSubscribe$1;
			function window$1(windowBoundaries) {
			    return function windowOperatorFunction(source) {
			        return source.lift(new WindowOperator$1(windowBoundaries));
			    };
			}
			window$2.window = window$1;
			var WindowOperator$1 = (function () {
			    function WindowOperator(windowBoundaries) {
			        this.windowBoundaries = windowBoundaries;
			    }
			    WindowOperator.prototype.call = function (subscriber, source) {
			        var windowSubscriber = new WindowSubscriber$1(subscriber);
			        var sourceSubscription = source.subscribe(windowSubscriber);
			        if (!sourceSubscription.closed) {
			            windowSubscriber.add(innerSubscribe_1.innerSubscribe(this.windowBoundaries, new innerSubscribe_1.SimpleInnerSubscriber(windowSubscriber)));
			        }
			        return sourceSubscription;
			    };
			    return WindowOperator;
			}());
			var WindowSubscriber$1 = (function (_super) {
			    __extends$5(WindowSubscriber, _super);
			    function WindowSubscriber(destination) {
			        var _this = _super.call(this, destination) || this;
			        _this.window = new Subject_1$4.Subject();
			        destination.next(_this.window);
			        return _this;
			    }
			    WindowSubscriber.prototype.notifyNext = function () {
			        this.openWindow();
			    };
			    WindowSubscriber.prototype.notifyError = function (error) {
			        this._error(error);
			    };
			    WindowSubscriber.prototype.notifyComplete = function () {
			        this._complete();
			    };
			    WindowSubscriber.prototype._next = function (value) {
			        this.window.next(value);
			    };
			    WindowSubscriber.prototype._error = function (err) {
			        this.window.error(err);
			        this.destination.error(err);
			    };
			    WindowSubscriber.prototype._complete = function () {
			        this.window.complete();
			        this.destination.complete();
			    };
			    WindowSubscriber.prototype._unsubscribe = function () {
			        this.window = null;
			    };
			    WindowSubscriber.prototype.openWindow = function () {
			        var prevWindow = this.window;
			        if (prevWindow) {
			            prevWindow.complete();
			        }
			        var destination = this.destination;
			        var newWindow = this.window = new Subject_1$4.Subject();
			        destination.next(newWindow);
			    };
			    return WindowSubscriber;
			}(innerSubscribe_1.SimpleOuterSubscriber));

			var windowCount$1 = {};

			var __extends$4 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(windowCount$1, "__esModule", { value: true });
			var Subscriber_1$1 = Subscriber$1;
			var Subject_1$3 = Subject$1;
			function windowCount(windowSize, startWindowEvery) {
			    if (startWindowEvery === void 0) { startWindowEvery = 0; }
			    return function windowCountOperatorFunction(source) {
			        return source.lift(new WindowCountOperator(windowSize, startWindowEvery));
			    };
			}
			windowCount$1.windowCount = windowCount;
			var WindowCountOperator = (function () {
			    function WindowCountOperator(windowSize, startWindowEvery) {
			        this.windowSize = windowSize;
			        this.startWindowEvery = startWindowEvery;
			    }
			    WindowCountOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
			    };
			    return WindowCountOperator;
			}());
			var WindowCountSubscriber = (function (_super) {
			    __extends$4(WindowCountSubscriber, _super);
			    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
			        var _this = _super.call(this, destination) || this;
			        _this.destination = destination;
			        _this.windowSize = windowSize;
			        _this.startWindowEvery = startWindowEvery;
			        _this.windows = [new Subject_1$3.Subject()];
			        _this.count = 0;
			        destination.next(_this.windows[0]);
			        return _this;
			    }
			    WindowCountSubscriber.prototype._next = function (value) {
			        var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
			        var destination = this.destination;
			        var windowSize = this.windowSize;
			        var windows = this.windows;
			        var len = windows.length;
			        for (var i = 0; i < len && !this.closed; i++) {
			            windows[i].next(value);
			        }
			        var c = this.count - windowSize + 1;
			        if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
			            windows.shift().complete();
			        }
			        if (++this.count % startWindowEvery === 0 && !this.closed) {
			            var window_1 = new Subject_1$3.Subject();
			            windows.push(window_1);
			            destination.next(window_1);
			        }
			    };
			    WindowCountSubscriber.prototype._error = function (err) {
			        var windows = this.windows;
			        if (windows) {
			            while (windows.length > 0 && !this.closed) {
			                windows.shift().error(err);
			            }
			        }
			        this.destination.error(err);
			    };
			    WindowCountSubscriber.prototype._complete = function () {
			        var windows = this.windows;
			        if (windows) {
			            while (windows.length > 0 && !this.closed) {
			                windows.shift().complete();
			            }
			        }
			        this.destination.complete();
			    };
			    WindowCountSubscriber.prototype._unsubscribe = function () {
			        this.count = 0;
			        this.windows = null;
			    };
			    return WindowCountSubscriber;
			}(Subscriber_1$1.Subscriber));

			var windowTime$1 = {};

			var __extends$3 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(windowTime$1, "__esModule", { value: true });
			var Subject_1$2 = Subject$1;
			var async_1 = async;
			var Subscriber_1 = Subscriber$1;
			var isNumeric_1 = isNumeric$1;
			var isScheduler_1 = isScheduler$1;
			function windowTime(windowTimeSpan) {
			    var scheduler = async_1.async;
			    var windowCreationInterval = null;
			    var maxWindowSize = Number.POSITIVE_INFINITY;
			    if (isScheduler_1.isScheduler(arguments[3])) {
			        scheduler = arguments[3];
			    }
			    if (isScheduler_1.isScheduler(arguments[2])) {
			        scheduler = arguments[2];
			    }
			    else if (isNumeric_1.isNumeric(arguments[2])) {
			        maxWindowSize = Number(arguments[2]);
			    }
			    if (isScheduler_1.isScheduler(arguments[1])) {
			        scheduler = arguments[1];
			    }
			    else if (isNumeric_1.isNumeric(arguments[1])) {
			        windowCreationInterval = Number(arguments[1]);
			    }
			    return function windowTimeOperatorFunction(source) {
			        return source.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler));
			    };
			}
			windowTime$1.windowTime = windowTime;
			var WindowTimeOperator = (function () {
			    function WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
			        this.windowTimeSpan = windowTimeSpan;
			        this.windowCreationInterval = windowCreationInterval;
			        this.maxWindowSize = maxWindowSize;
			        this.scheduler = scheduler;
			    }
			    WindowTimeOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.maxWindowSize, this.scheduler));
			    };
			    return WindowTimeOperator;
			}());
			var CountedSubject = (function (_super) {
			    __extends$3(CountedSubject, _super);
			    function CountedSubject() {
			        var _this = _super !== null && _super.apply(this, arguments) || this;
			        _this._numberOfNextedValues = 0;
			        return _this;
			    }
			    CountedSubject.prototype.next = function (value) {
			        this._numberOfNextedValues++;
			        _super.prototype.next.call(this, value);
			    };
			    Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
			        get: function () {
			            return this._numberOfNextedValues;
			        },
			        enumerable: true,
			        configurable: true
			    });
			    return CountedSubject;
			}(Subject_1$2.Subject));
			var WindowTimeSubscriber = (function (_super) {
			    __extends$3(WindowTimeSubscriber, _super);
			    function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
			        var _this = _super.call(this, destination) || this;
			        _this.destination = destination;
			        _this.windowTimeSpan = windowTimeSpan;
			        _this.windowCreationInterval = windowCreationInterval;
			        _this.maxWindowSize = maxWindowSize;
			        _this.scheduler = scheduler;
			        _this.windows = [];
			        var window = _this.openWindow();
			        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
			            var closeState = { subscriber: _this, window: window, context: null };
			            var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: _this, scheduler: scheduler };
			            _this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
			            _this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
			        }
			        else {
			            var timeSpanOnlyState = { subscriber: _this, window: window, windowTimeSpan: windowTimeSpan };
			            _this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
			        }
			        return _this;
			    }
			    WindowTimeSubscriber.prototype._next = function (value) {
			        var windows = this.windows;
			        var len = windows.length;
			        for (var i = 0; i < len; i++) {
			            var window_1 = windows[i];
			            if (!window_1.closed) {
			                window_1.next(value);
			                if (window_1.numberOfNextedValues >= this.maxWindowSize) {
			                    this.closeWindow(window_1);
			                }
			            }
			        }
			    };
			    WindowTimeSubscriber.prototype._error = function (err) {
			        var windows = this.windows;
			        while (windows.length > 0) {
			            windows.shift().error(err);
			        }
			        this.destination.error(err);
			    };
			    WindowTimeSubscriber.prototype._complete = function () {
			        var windows = this.windows;
			        while (windows.length > 0) {
			            var window_2 = windows.shift();
			            if (!window_2.closed) {
			                window_2.complete();
			            }
			        }
			        this.destination.complete();
			    };
			    WindowTimeSubscriber.prototype.openWindow = function () {
			        var window = new CountedSubject();
			        this.windows.push(window);
			        var destination = this.destination;
			        destination.next(window);
			        return window;
			    };
			    WindowTimeSubscriber.prototype.closeWindow = function (window) {
			        window.complete();
			        var windows = this.windows;
			        windows.splice(windows.indexOf(window), 1);
			    };
			    return WindowTimeSubscriber;
			}(Subscriber_1.Subscriber));
			function dispatchWindowTimeSpanOnly(state) {
			    var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
			    if (window) {
			        subscriber.closeWindow(window);
			    }
			    state.window = subscriber.openWindow();
			    this.schedule(state, windowTimeSpan);
			}
			function dispatchWindowCreation(state) {
			    var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
			    var window = subscriber.openWindow();
			    var action = this;
			    var context = { action: action, subscription: null };
			    var timeSpanState = { subscriber: subscriber, window: window, context: context };
			    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
			    action.add(context.subscription);
			    action.schedule(state, windowCreationInterval);
			}
			function dispatchWindowClose(state) {
			    var subscriber = state.subscriber, window = state.window, context = state.context;
			    if (context && context.action && context.subscription) {
			        context.action.remove(context.subscription);
			    }
			    subscriber.closeWindow(window);
			}

			var windowToggle$1 = {};

			var __extends$2 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(windowToggle$1, "__esModule", { value: true });
			var Subject_1$1 = Subject$1;
			var Subscription_1 = Subscription$1;
			var OuterSubscriber_1$2 = OuterSubscriber$1;
			var subscribeToResult_1$2 = subscribeToResult$1;
			function windowToggle(openings, closingSelector) {
			    return function (source) { return source.lift(new WindowToggleOperator(openings, closingSelector)); };
			}
			windowToggle$1.windowToggle = windowToggle;
			var WindowToggleOperator = (function () {
			    function WindowToggleOperator(openings, closingSelector) {
			        this.openings = openings;
			        this.closingSelector = closingSelector;
			    }
			    WindowToggleOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
			    };
			    return WindowToggleOperator;
			}());
			var WindowToggleSubscriber = (function (_super) {
			    __extends$2(WindowToggleSubscriber, _super);
			    function WindowToggleSubscriber(destination, openings, closingSelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.openings = openings;
			        _this.closingSelector = closingSelector;
			        _this.contexts = [];
			        _this.add(_this.openSubscription = subscribeToResult_1$2.subscribeToResult(_this, openings, openings));
			        return _this;
			    }
			    WindowToggleSubscriber.prototype._next = function (value) {
			        var contexts = this.contexts;
			        if (contexts) {
			            var len = contexts.length;
			            for (var i = 0; i < len; i++) {
			                contexts[i].window.next(value);
			            }
			        }
			    };
			    WindowToggleSubscriber.prototype._error = function (err) {
			        var contexts = this.contexts;
			        this.contexts = null;
			        if (contexts) {
			            var len = contexts.length;
			            var index = -1;
			            while (++index < len) {
			                var context_1 = contexts[index];
			                context_1.window.error(err);
			                context_1.subscription.unsubscribe();
			            }
			        }
			        _super.prototype._error.call(this, err);
			    };
			    WindowToggleSubscriber.prototype._complete = function () {
			        var contexts = this.contexts;
			        this.contexts = null;
			        if (contexts) {
			            var len = contexts.length;
			            var index = -1;
			            while (++index < len) {
			                var context_2 = contexts[index];
			                context_2.window.complete();
			                context_2.subscription.unsubscribe();
			            }
			        }
			        _super.prototype._complete.call(this);
			    };
			    WindowToggleSubscriber.prototype._unsubscribe = function () {
			        var contexts = this.contexts;
			        this.contexts = null;
			        if (contexts) {
			            var len = contexts.length;
			            var index = -1;
			            while (++index < len) {
			                var context_3 = contexts[index];
			                context_3.window.unsubscribe();
			                context_3.subscription.unsubscribe();
			            }
			        }
			    };
			    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
			        if (outerValue === this.openings) {
			            var closingNotifier = void 0;
			            try {
			                var closingSelector = this.closingSelector;
			                closingNotifier = closingSelector(innerValue);
			            }
			            catch (e) {
			                return this.error(e);
			            }
			            var window_1 = new Subject_1$1.Subject();
			            var subscription = new Subscription_1.Subscription();
			            var context_4 = { window: window_1, subscription: subscription };
			            this.contexts.push(context_4);
			            var innerSubscription = subscribeToResult_1$2.subscribeToResult(this, closingNotifier, context_4);
			            if (innerSubscription.closed) {
			                this.closeWindow(this.contexts.length - 1);
			            }
			            else {
			                innerSubscription.context = context_4;
			                subscription.add(innerSubscription);
			            }
			            this.destination.next(window_1);
			        }
			        else {
			            this.closeWindow(this.contexts.indexOf(outerValue));
			        }
			    };
			    WindowToggleSubscriber.prototype.notifyError = function (err) {
			        this.error(err);
			    };
			    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
			        if (inner !== this.openSubscription) {
			            this.closeWindow(this.contexts.indexOf(inner.context));
			        }
			    };
			    WindowToggleSubscriber.prototype.closeWindow = function (index) {
			        if (index === -1) {
			            return;
			        }
			        var contexts = this.contexts;
			        var context = contexts[index];
			        var window = context.window, subscription = context.subscription;
			        contexts.splice(index, 1);
			        window.complete();
			        subscription.unsubscribe();
			    };
			    return WindowToggleSubscriber;
			}(OuterSubscriber_1$2.OuterSubscriber));

			var windowWhen$1 = {};

			var __extends$1 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
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
			Object.defineProperty(windowWhen$1, "__esModule", { value: true });
			var Subject_1 = Subject$1;
			var OuterSubscriber_1$1 = OuterSubscriber$1;
			var subscribeToResult_1$1 = subscribeToResult$1;
			function windowWhen(closingSelector) {
			    return function windowWhenOperatorFunction(source) {
			        return source.lift(new WindowOperator(closingSelector));
			    };
			}
			windowWhen$1.windowWhen = windowWhen;
			var WindowOperator = (function () {
			    function WindowOperator(closingSelector) {
			        this.closingSelector = closingSelector;
			    }
			    WindowOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new WindowSubscriber(subscriber, this.closingSelector));
			    };
			    return WindowOperator;
			}());
			var WindowSubscriber = (function (_super) {
			    __extends$1(WindowSubscriber, _super);
			    function WindowSubscriber(destination, closingSelector) {
			        var _this = _super.call(this, destination) || this;
			        _this.destination = destination;
			        _this.closingSelector = closingSelector;
			        _this.openWindow();
			        return _this;
			    }
			    WindowSubscriber.prototype.notifyNext = function (_outerValue, _innerValue, _outerIndex, _innerIndex, innerSub) {
			        this.openWindow(innerSub);
			    };
			    WindowSubscriber.prototype.notifyError = function (error) {
			        this._error(error);
			    };
			    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
			        this.openWindow(innerSub);
			    };
			    WindowSubscriber.prototype._next = function (value) {
			        this.window.next(value);
			    };
			    WindowSubscriber.prototype._error = function (err) {
			        this.window.error(err);
			        this.destination.error(err);
			        this.unsubscribeClosingNotification();
			    };
			    WindowSubscriber.prototype._complete = function () {
			        this.window.complete();
			        this.destination.complete();
			        this.unsubscribeClosingNotification();
			    };
			    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
			        if (this.closingNotification) {
			            this.closingNotification.unsubscribe();
			        }
			    };
			    WindowSubscriber.prototype.openWindow = function (innerSub) {
			        if (innerSub === void 0) { innerSub = null; }
			        if (innerSub) {
			            this.remove(innerSub);
			            innerSub.unsubscribe();
			        }
			        var prevWindow = this.window;
			        if (prevWindow) {
			            prevWindow.complete();
			        }
			        var window = this.window = new Subject_1.Subject();
			        this.destination.next(window);
			        var closingNotifier;
			        try {
			            var closingSelector = this.closingSelector;
			            closingNotifier = closingSelector();
			        }
			        catch (e) {
			            this.destination.error(e);
			            this.window.error(e);
			            return;
			        }
			        this.add(this.closingNotification = subscribeToResult_1$1.subscribeToResult(this, closingNotifier));
			    };
			    return WindowSubscriber;
			}(OuterSubscriber_1$1.OuterSubscriber));

			var withLatestFrom$1 = {};

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
			Object.defineProperty(withLatestFrom$1, "__esModule", { value: true });
			var OuterSubscriber_1 = OuterSubscriber$1;
			var subscribeToResult_1 = subscribeToResult$1;
			function withLatestFrom() {
			    var args = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        args[_i] = arguments[_i];
			    }
			    return function (source) {
			        var project;
			        if (typeof args[args.length - 1] === 'function') {
			            project = args.pop();
			        }
			        var observables = args;
			        return source.lift(new WithLatestFromOperator(observables, project));
			    };
			}
			withLatestFrom$1.withLatestFrom = withLatestFrom;
			var WithLatestFromOperator = (function () {
			    function WithLatestFromOperator(observables, project) {
			        this.observables = observables;
			        this.project = project;
			    }
			    WithLatestFromOperator.prototype.call = function (subscriber, source) {
			        return source.subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
			    };
			    return WithLatestFromOperator;
			}());
			var WithLatestFromSubscriber = (function (_super) {
			    __extends(WithLatestFromSubscriber, _super);
			    function WithLatestFromSubscriber(destination, observables, project) {
			        var _this = _super.call(this, destination) || this;
			        _this.observables = observables;
			        _this.project = project;
			        _this.toRespond = [];
			        var len = observables.length;
			        _this.values = new Array(len);
			        for (var i = 0; i < len; i++) {
			            _this.toRespond.push(i);
			        }
			        for (var i = 0; i < len; i++) {
			            var observable = observables[i];
			            _this.add(subscribeToResult_1.subscribeToResult(_this, observable, undefined, i));
			        }
			        return _this;
			    }
			    WithLatestFromSubscriber.prototype.notifyNext = function (_outerValue, innerValue, outerIndex) {
			        this.values[outerIndex] = innerValue;
			        var toRespond = this.toRespond;
			        if (toRespond.length > 0) {
			            var found = toRespond.indexOf(outerIndex);
			            if (found !== -1) {
			                toRespond.splice(found, 1);
			            }
			        }
			    };
			    WithLatestFromSubscriber.prototype.notifyComplete = function () {
			    };
			    WithLatestFromSubscriber.prototype._next = function (value) {
			        if (this.toRespond.length === 0) {
			            var args = [value].concat(this.values);
			            if (this.project) {
			                this._tryProject(args);
			            }
			            else {
			                this.destination.next(args);
			            }
			        }
			    };
			    WithLatestFromSubscriber.prototype._tryProject = function (args) {
			        var result;
			        try {
			            result = this.project.apply(this, args);
			        }
			        catch (err) {
			            this.destination.error(err);
			            return;
			        }
			        this.destination.next(result);
			    };
			    return WithLatestFromSubscriber;
			}(OuterSubscriber_1.OuterSubscriber));

			var zip$1 = {};

			Object.defineProperty(zip$1, "__esModule", { value: true });
			var zip_1$2 = zip$3;
			function zip() {
			    var observables = [];
			    for (var _i = 0; _i < arguments.length; _i++) {
			        observables[_i] = arguments[_i];
			    }
			    return function zipOperatorFunction(source) {
			        return source.lift.call(zip_1$2.zip.apply(void 0, [source].concat(observables)));
			    };
			}
			zip$1.zip = zip;

			var zipAll$1 = {};

			Object.defineProperty(zipAll$1, "__esModule", { value: true });
			var zip_1$1 = zip$3;
			function zipAll(project) {
			    return function (source) { return source.lift(new zip_1$1.ZipOperator(project)); };
			}
			zipAll$1.zipAll = zipAll;

			Object.defineProperty(operators, "__esModule", { value: true });
			var audit_1 = audit$1;
			operators.audit = audit_1.audit;
			var auditTime_1 = auditTime$1;
			operators.auditTime = auditTime_1.auditTime;
			var buffer_1 = buffer$1;
			operators.buffer = buffer_1.buffer;
			var bufferCount_1 = bufferCount$1;
			operators.bufferCount = bufferCount_1.bufferCount;
			var bufferTime_1 = bufferTime$1;
			operators.bufferTime = bufferTime_1.bufferTime;
			var bufferToggle_1 = bufferToggle$1;
			operators.bufferToggle = bufferToggle_1.bufferToggle;
			var bufferWhen_1 = bufferWhen$1;
			operators.bufferWhen = bufferWhen_1.bufferWhen;
			var catchError_1 = catchError$1;
			operators.catchError = catchError_1.catchError;
			var combineAll_1 = combineAll$1;
			operators.combineAll = combineAll_1.combineAll;
			var combineLatest_1 = combineLatest$1;
			operators.combineLatest = combineLatest_1.combineLatest;
			var concat_1 = concat$1;
			operators.concat = concat_1.concat;
			var concatAll_1 = concatAll$1;
			operators.concatAll = concatAll_1.concatAll;
			var concatMap_1 = concatMap$1;
			operators.concatMap = concatMap_1.concatMap;
			var concatMapTo_1 = concatMapTo$1;
			operators.concatMapTo = concatMapTo_1.concatMapTo;
			var count_1 = count$1;
			operators.count = count_1.count;
			var debounce_1 = debounce$1;
			operators.debounce = debounce_1.debounce;
			var debounceTime_1 = debounceTime$1;
			operators.debounceTime = debounceTime_1.debounceTime;
			var defaultIfEmpty_1 = defaultIfEmpty$1;
			operators.defaultIfEmpty = defaultIfEmpty_1.defaultIfEmpty;
			var delay_1 = delay$1;
			operators.delay = delay_1.delay;
			var delayWhen_1 = delayWhen$1;
			operators.delayWhen = delayWhen_1.delayWhen;
			var dematerialize_1 = dematerialize$1;
			operators.dematerialize = dematerialize_1.dematerialize;
			var distinct_1 = distinct$1;
			operators.distinct = distinct_1.distinct;
			var distinctUntilChanged_1 = distinctUntilChanged$1;
			operators.distinctUntilChanged = distinctUntilChanged_1.distinctUntilChanged;
			var distinctUntilKeyChanged_1 = distinctUntilKeyChanged$1;
			operators.distinctUntilKeyChanged = distinctUntilKeyChanged_1.distinctUntilKeyChanged;
			var elementAt_1 = elementAt$1;
			operators.elementAt = elementAt_1.elementAt;
			var endWith_1 = endWith$1;
			operators.endWith = endWith_1.endWith;
			var every_1 = every$1;
			operators.every = every_1.every;
			var exhaust_1 = exhaust$1;
			operators.exhaust = exhaust_1.exhaust;
			var exhaustMap_1 = exhaustMap$1;
			operators.exhaustMap = exhaustMap_1.exhaustMap;
			var expand_1 = expand$1;
			operators.expand = expand_1.expand;
			var filter_1 = filter$3;
			operators.filter = filter_1.filter;
			var finalize_1 = finalize$1;
			operators.finalize = finalize_1.finalize;
			var find_1 = find$1;
			operators.find = find_1.find;
			var findIndex_1 = findIndex$1;
			operators.findIndex = findIndex_1.findIndex;
			var first_1 = first$1;
			operators.first = first_1.first;
			var groupBy_1 = groupBy$1;
			operators.groupBy = groupBy_1.groupBy;
			var ignoreElements_1 = ignoreElements$1;
			operators.ignoreElements = ignoreElements_1.ignoreElements;
			var isEmpty_1 = isEmpty$1;
			operators.isEmpty = isEmpty_1.isEmpty;
			var last_1 = last$1;
			operators.last = last_1.last;
			var map_1 = map$1;
			operators.map = map_1.map;
			var mapTo_1 = mapTo$1;
			operators.mapTo = mapTo_1.mapTo;
			var materialize_1 = materialize$1;
			operators.materialize = materialize_1.materialize;
			var max_1 = max$1;
			operators.max = max_1.max;
			var merge_1 = merge$1;
			operators.merge = merge_1.merge;
			var mergeAll_1 = mergeAll$1;
			operators.mergeAll = mergeAll_1.mergeAll;
			var mergeMap_1 = mergeMap$1;
			operators.mergeMap = mergeMap_1.mergeMap;
			operators.flatMap = mergeMap_1.flatMap;
			var mergeMapTo_1 = mergeMapTo$1;
			operators.mergeMapTo = mergeMapTo_1.mergeMapTo;
			var mergeScan_1 = mergeScan$1;
			operators.mergeScan = mergeScan_1.mergeScan;
			var min_1 = min$1;
			operators.min = min_1.min;
			var multicast_1 = multicast$1;
			operators.multicast = multicast_1.multicast;
			var observeOn_1 = observeOn$1;
			operators.observeOn = observeOn_1.observeOn;
			var onErrorResumeNext_1 = onErrorResumeNext$1;
			operators.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNext;
			var pairwise_1 = pairwise$1;
			operators.pairwise = pairwise_1.pairwise;
			var partition_1 = partition$1;
			operators.partition = partition_1.partition;
			var pluck_1 = pluck$1;
			operators.pluck = pluck_1.pluck;
			var publish_1 = publish$1;
			operators.publish = publish_1.publish;
			var publishBehavior_1 = publishBehavior$1;
			operators.publishBehavior = publishBehavior_1.publishBehavior;
			var publishLast_1 = publishLast$1;
			operators.publishLast = publishLast_1.publishLast;
			var publishReplay_1 = publishReplay$1;
			operators.publishReplay = publishReplay_1.publishReplay;
			var race_1 = race$1;
			operators.race = race_1.race;
			var reduce_1 = reduce$1;
			operators.reduce = reduce_1.reduce;
			var repeat_1 = repeat$1;
			operators.repeat = repeat_1.repeat;
			var repeatWhen_1 = repeatWhen$1;
			operators.repeatWhen = repeatWhen_1.repeatWhen;
			var retry_1 = retry$1;
			operators.retry = retry_1.retry;
			var retryWhen_1 = retryWhen$1;
			operators.retryWhen = retryWhen_1.retryWhen;
			var refCount_1 = refCount$1;
			operators.refCount = refCount_1.refCount;
			var sample_1 = sample$1;
			operators.sample = sample_1.sample;
			var sampleTime_1 = sampleTime$1;
			operators.sampleTime = sampleTime_1.sampleTime;
			var scan_1 = scan$1;
			operators.scan = scan_1.scan;
			var sequenceEqual_1 = sequenceEqual$1;
			operators.sequenceEqual = sequenceEqual_1.sequenceEqual;
			var share_1 = share$1;
			operators.share = share_1.share;
			var shareReplay_1 = shareReplay$1;
			operators.shareReplay = shareReplay_1.shareReplay;
			var single_1 = single$1;
			operators.single = single_1.single;
			var skip_1 = skip$1;
			operators.skip = skip_1.skip;
			var skipLast_1 = skipLast$1;
			operators.skipLast = skipLast_1.skipLast;
			var skipUntil_1 = skipUntil$1;
			operators.skipUntil = skipUntil_1.skipUntil;
			var skipWhile_1 = skipWhile$1;
			operators.skipWhile = skipWhile_1.skipWhile;
			var startWith_1 = startWith$1;
			operators.startWith = startWith_1.startWith;
			var subscribeOn_1 = subscribeOn$1;
			operators.subscribeOn = subscribeOn_1.subscribeOn;
			var switchAll_1 = switchAll$1;
			operators.switchAll = switchAll_1.switchAll;
			var switchMap_1 = switchMap$1;
			operators.switchMap = switchMap_1.switchMap;
			var switchMapTo_1 = switchMapTo$1;
			operators.switchMapTo = switchMapTo_1.switchMapTo;
			var take_1 = take$1;
			operators.take = take_1.take;
			var takeLast_1 = takeLast$1;
			operators.takeLast = takeLast_1.takeLast;
			var takeUntil_1 = takeUntil$1;
			operators.takeUntil = takeUntil_1.takeUntil;
			var takeWhile_1 = takeWhile$1;
			operators.takeWhile = takeWhile_1.takeWhile;
			var tap_1 = tap$1;
			operators.tap = tap_1.tap;
			var throttle_1 = throttle;
			operators.throttle = throttle_1.throttle;
			var throttleTime_1 = throttleTime$1;
			operators.throttleTime = throttleTime_1.throttleTime;
			var throwIfEmpty_1 = throwIfEmpty$1;
			operators.throwIfEmpty = throwIfEmpty_1.throwIfEmpty;
			var timeInterval_1 = timeInterval$1;
			operators.timeInterval = timeInterval_1.timeInterval;
			var timeout_1 = timeout$1;
			operators.timeout = timeout_1.timeout;
			var timeoutWith_1 = timeoutWith$1;
			operators.timeoutWith = timeoutWith_1.timeoutWith;
			var timestamp_1 = timestamp$1;
			operators.timestamp = timestamp_1.timestamp;
			var toArray_1 = toArray$1;
			operators.toArray = toArray_1.toArray;
			var window_1 = window$2;
			operators.window = window_1.window;
			var windowCount_1 = windowCount$1;
			operators.windowCount = windowCount_1.windowCount;
			var windowTime_1 = windowTime$1;
			operators.windowTime = windowTime_1.windowTime;
			var windowToggle_1 = windowToggle$1;
			operators.windowToggle = windowToggle_1.windowToggle;
			var windowWhen_1 = windowWhen$1;
			operators.windowWhen = windowWhen_1.windowWhen;
			var withLatestFrom_1 = withLatestFrom$1;
			operators.withLatestFrom = withLatestFrom_1.withLatestFrom;
			var zip_1 = zip$1;
			operators.zip = zip_1.zip;
			var zipAll_1 = zipAll$1;
			operators.zipAll = zipAll_1.zipAll;

			Object.defineProperty(filter, "__esModule", { value: true });
			var operators_1 = operators;
			filter.filter = operators_1.filter;

			(function (exports) {
			function __export(m) {
			    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
			}
			Object.defineProperty(exports, "__esModule", { value: true });
			__export(filter);

			}(filter$1));

			var useEva_1 = mergeActions_1 = createAsyncActions_1 = createActions_1 = void 0;

			var _react = _interopRequireWildcard(React);

			var _Subject = Subject$3;

			var _filter = filter$1;

			function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

			function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

			var isFn = function isFn(val) {
			  return typeof val === "function";
			};

			var implementSymbol = Symbol["for"]("__REVA_IMPLEMENT__");
			var namesSymbol = Symbol["for"]("__REVA_NAMES__");
			var actionsSymbol$1 = Symbol["for"]("__REVA_ACTIONS");

			var createEva = function createEva(actions, effects, subscribes) {
			  subscribes = subscribes || {};

			  var subscription = function subscription() {
			    if (isFn(effects)) {
			      effects(function (type, $filter) {
			        if (!subscribes[type]) {
			          subscribes[type] = new _Subject.Subject();
			        }

			        if (isFn($filter)) {
			          return subscribes[type].pipe((0, _filter.filter)($filter));
			        }

			        return subscribes[type];
			      });
			    }
			  };

			  var dispatch = function dispatch(type) {
			    if (subscribes[type]) {
			      var _subscribes$type;

			      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			        args[_key - 1] = arguments[_key];
			      }

			      (_subscribes$type = subscribes[type]).next.apply(_subscribes$type, args);
			    }
			  };

			  dispatch.lazy = function (type, fn) {
			    if (subscribes[type] && isFn(fn)) {
			      subscribes[type].next(fn());
			    }
			  };

			  var implementAction = function implementAction(name, fn) {
			    if (actions && actions[implementSymbol]) {
			      actions[implementSymbol](name, fn);
			    }

			    return fn;
			  };

			  var implementActions = function implementActions(obj) {
			    var actions = {};

			    for (var name in obj) {
			      if (obj.hasOwnProperty(name) && isFn(obj[name])) {
			        actions[name] = implementAction(name, obj[name]);
			      }
			    }

			    return actions;
			  };

			  return {
			    dispatch: dispatch,
			    subscription: subscription,
			    implementActions: implementActions
			  };
			};

			var ActionFactory = function ActionFactory(names, isAsync) {
			  var _this = this;

			  if (isAsync === void 0) {
			    isAsync = true;
			  }

			  var resolvers = {};
			  var actions = {};
			  names.forEach(function (name) {
			    _this[name] = function () {
			      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			        args[_key2] = arguments[_key2];
			      }

			      if (isAsync) {
			        return new Promise(function (resolve, reject) {
			          if (actions[name]) {
			            resolve(actions[name].apply(actions, args));
			          } else {
			            resolvers[name] = resolvers[name] || [];
			            resolvers[name].push({
			              resolve: resolve,
			              args: args,
			              reject: reject
			            });
			          }
			        });
			      } else {
			        if (actions[name]) {
			          return actions[name].apply(actions, args);
			        } else {
			          resolvers[name] = resolvers[name] || [];
			          resolvers[name].push({
			            resolve: null,
			            args: args,
			            reject: null
			          });

			          if (console && console.error) {
			            console.error("The action \"" + name + "\" is not implemented! We recommend that you call this method by `createAsyncFormActions`");
			          }
			        }
			      }
			    };
			  });
			  this[actionsSymbol$1] = true;
			  this[namesSymbol] = names;

			  this[implementSymbol] = function (name, fn) {
			    if (resolvers[name] && resolvers[name].length) {
			      setTimeout(function () {
			        for (var i = 0; i < resolvers[name].length; i++) {
			          var _resolvers$name$i = resolvers[name][i],
			              resolve = _resolvers$name$i.resolve,
			              args = _resolvers$name$i.args;
			          if (resolve) resolve(fn.apply(void 0, args));else {
			            fn.apply(void 0, args);
			          }
			        }

			        resolvers[name].length = 0;
			      });
			    }

			    actions[name] = fn;
			    return fn;
			  };
			};

			var createActions = function createActions() {
			  for (var _len3 = arguments.length, names = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			    names[_key3] = arguments[_key3];
			  }

			  return new ActionFactory(names, false);
			};

			var createActions_1 = createActions;

			var createAsyncActions = function createAsyncActions() {
			  for (var _len4 = arguments.length, names = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			    names[_key4] = arguments[_key4];
			  }

			  return new ActionFactory(names, true);
			};

			var createAsyncActions_1 = createAsyncActions;

			var mergeActions = function mergeActions() {
			  for (var _len5 = arguments.length, all = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
			    all[_key5] = arguments[_key5];
			  }

			  var implement = function implement(name, fn) {
			    all.forEach(function (actions) {
			      if (actions[implementSymbol] && actions[namesSymbol].indexOf(name) > -1) {
			        actions[implementSymbol](name, fn);
			      }
			    });
			    return fn;
			  };

			  var result = {};

			  for (var i = 0; i < all.length; i++) {
			    var actions = all[i];
			    result[namesSymbol] = result[namesSymbol] || [];
			    result[namesSymbol] = result[namesSymbol].concat(actions[namesSymbol]);
			    var key = void 0;

			    for (key in actions) {
			      if (actions.hasOwnProperty(key) && key !== implementSymbol && key !== namesSymbol) {
			        result[key] = actions[key];
			      }
			    }
			  }

			  result[actionsSymbol$1] = true;
			  result[implementSymbol] = implement;
			  return result;
			};

			var mergeActions_1 = mergeActions;

			var useEva = function useEva(_temp) {
			  var _ref = _temp === void 0 ? {} : _temp,
			      actions = _ref.actions,
			      effects = _ref.effects,
			      subscribes = _ref.subscribes,
			      _ref$autoRun = _ref.autoRun,
			      autoRun = _ref$autoRun === void 0 ? true : _ref$autoRun;

			  return _react["default"].useMemo(function () {
			    var manager = createEva(actions, effects, subscribes);

			    if (autoRun) {
			      manager.subscription();
			    }

			    return manager;
			  }, []);
			};

			useEva_1 = useEva;

			const createSchemaFormActions = () => mergeActions_1(createFormActions$1(), createActions_1("getSchema", "getFormSchema"));
			const createAsyncSchemaFormActions = () => mergeActions_1(createAsyncFormActions$1(), createAsyncActions_1("getSchema", "getFormSchema"));

			var __defProp$6 = Object.defineProperty;
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
			var __objRest$3 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$6.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$6)
			    for (var prop of __getOwnPropSymbols$6(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$6.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			const numberRE = /^\d+$/;
			const findProperty = (object, propertyKey) => {
			  if (!object)
			    return object;
			  if (object[propertyKey]) {
			    return object[propertyKey];
			  }
			  for (let key in object) {
			    if (FormPath.parse(key).match(`[[${propertyKey}]]`)) {
			      return object[key];
			    }
			  }
			};
			const filterProperties = (object, keys) => {
			  let result = {};
			  for (let key in object) {
			    if (!keys.includes(key) && Object.hasOwnProperty.call(object, key)) {
			      result[key] = object[key];
			    }
			  }
			  return result;
			};
			const COMPAT_FORM_ITEM_PROPS = [
			  "required",
			  "prefix",
			  "labelAlign",
			  "hasFeedback",
			  "labelCol",
			  "wrapperCol",
			  "label",
			  "help",
			  "labelTextAlign",
			  "fullWidth",
			  "extra",
			  "size",
			  "asterisk",
			  "labelWidth",
			  "device",
			  "isPreview",
			  "renderPreview",
			  "validateState",
			  "colon",
			  "htmlFor",
			  "validateStatus",
			  "prefixCls",
			  "triggerType",
			  "itemStyle",
			  "itemClassName",
			  "addonAfter"
			];
			const _Schema = class {
			  constructor(json, parent, key) {
			    this._isJSONSchemaObject = true;
			    this.version = "1.0";
			    if (parent) {
			      this.parent = parent;
			    }
			    if (key) {
			      this.key = key;
			    }
			    if (this.parent && this.parent.isArray()) {
			      this.path = this.parent.path + ".*";
			    } else {
			      if (this.parent) {
			        this.path = this.parent.path ? this.parent.path + "." + this.key : this.key;
			      } else {
			        this.path = "";
			      }
			    }
			    return this.fromJSON(json);
			  }
			  get(path) {
			    if (!path) {
			      return this;
			    }
			    let res = this;
			    let depth = 0;
			    let parsed = FormPath.parse(path);
			    parsed.forEach((key) => {
			      if (res && !isEmpty$2(res.properties)) {
			        res = findProperty(res.properties, key) || findProperty(res.properties, parsed.segments.slice(depth).join("."));
			      } else if (res && !isEmpty$2(res.items) && numberRE.test(key)) {
			        res = isArr(res.items) ? findProperty(res.items, key) : res.items;
			      }
			      depth++;
			    });
			    return res;
			  }
			  merge(spec) {
			    if (spec instanceof _Schema) {
			      Object.assign(this, spec.getSelfProps());
			    } else {
			      Object.assign(this, spec);
			    }
			    return this;
			  }
			  getEmptyValue() {
			    if (this.type === "string") {
			      return "";
			    }
			    if (this.type === "array") {
			      return [];
			    }
			    if (this.type === "object") {
			      return {};
			    }
			    if (this.type === "number") {
			      return 0;
			    }
			  }
			  getSelfProps() {
			    const _a = this, props = __objRest$3(_a, [
			      "_isJSONSchemaObject",
			      "properties",
			      "additionalProperties",
			      "additionalItems",
			      "patternProperties",
			      "items",
			      "path",
			      "parent"
			    ]);
			    return props;
			  }
			  getExtendsRules() {
			    let rules = [];
			    if (this.format) {
			      rules.push({ format: this.format });
			    }
			    if (isValid(this.maxItems)) {
			      rules.push({ max: this.maxItems });
			    }
			    if (isValid(this.minItems)) {
			      rules.push({ min: this.minItems });
			    }
			    if (isValid(this.maxLength)) {
			      rules.push({ max: this.maxLength });
			    }
			    if (isValid(this.minLength)) {
			      rules.push({ min: this.minLength });
			    }
			    if (isValid(this.maximum)) {
			      rules.push({ maximum: this.maximum });
			    }
			    if (isValid(this.minimum)) {
			      rules.push({ minimum: this.minimum });
			    }
			    if (isValid(this.exclusiveMaximum)) {
			      rules.push({ exclusiveMaximum: this.exclusiveMaximum });
			    }
			    if (isValid(this.exclusiveMinimum)) {
			      rules.push({ exclusiveMinimum: this.exclusiveMinimum });
			    }
			    if (isValid(this.pattern)) {
			      rules.push({ pattern: this.pattern });
			    }
			    if (isValid(this.const)) {
			      rules.push({
			        validator: (value) => {
			          return value === this.const ? "" : getMessage("schema.const");
			        }
			      });
			    }
			    if (isValid(this.multipleOf)) {
			      rules.push({
			        validator: (value) => {
			          return value % this.multipleOf === 0 ? "" : getMessage("schema.multipleOf");
			        }
			      });
			    }
			    if (isValid(this.maxProperties)) {
			      rules.push({
			        validator: (value) => {
			          return Object.keys(value || {}).length <= this.maxProperties ? "" : getMessage("schema.maxProperties");
			        }
			      });
			    }
			    if (isValid(this.minProperties)) {
			      rules.push({
			        validator: (value) => {
			          return Object.keys(value || {}).length >= this.minProperties ? "" : getMessage("schema.minProperties");
			        }
			      });
			    }
			    if (isValid(this.uniqueItems) && this.uniqueItems) {
			      rules.push({
			        validator: (value) => {
			          value = toArr(value);
			          return value.some((item, index) => {
			            for (let start = index; start < value.length; start++) {
			              if (isEqual(value[start], item)) {
			                return false;
			              }
			            }
			          }) ? getMessage("schema.uniqueItems") : "";
			        }
			      });
			    }
			    if (isValid(this["x-rules"])) {
			      rules = rules.concat(this["x-rules"]);
			    }
			    return rules;
			  }
			  getExtendsRequired() {
			    var _a, _b;
			    if (isBool(this.required)) {
			      return this.required;
			    } else if (isArr((_a = this.parent) == null ? void 0 : _a.required) && ((_b = this.parent) == null ? void 0 : _b.required.includes(this.key))) {
			      return true;
			    }
			  }
			  getExtendsEditable() {
			    const { editable } = this.getExtendsComponentProps();
			    if (isValid(this.editable)) {
			      return this.editable;
			    } else if (isValid(editable)) {
			      return editable;
			    } else if (isValid(this.readOnly)) {
			      return !this.readOnly;
			    }
			  }
			  getExtendsVisible() {
			    const { visible } = this.getExtendsComponentProps();
			    if (isValid(this.visible)) {
			      return this.visible;
			    } else if (isValid(visible)) {
			      return visible;
			    }
			  }
			  getExtendsDisplay() {
			    const { display } = this.getExtendsComponentProps();
			    if (isValid(this.display)) {
			      return this.display;
			    } else if (isValid(display)) {
			      return display;
			    }
			  }
			  getMegaLayoutProps() {
			    return this["x-mega-props"] || this.getExtendsComponentProps()["mega-props"] || {};
			  }
			  getExtendsTriggerType() {
			    const itemProps = this.getExtendsItemProps();
			    const props = this.getExtendsProps();
			    const componentProps = this.getExtendsComponentProps();
			    if (this.triggerType) {
			      return this.triggerType;
			    }
			    if (itemProps.triggerType) {
			      return itemProps.triggerType;
			    } else if (props.triggerType) {
			      return props.triggerType;
			    } else if (componentProps.triggerType) {
			      return componentProps.triggerType;
			    }
			  }
			  getExtendsItemProps() {
			    if (isValid(this["x-item-props"])) {
			      deprecate("x-item-props is deprecate in future, Please do not use it.");
			    }
			    return this["x-item-props"] || {};
			  }
			  getExtendsComponent() {
			    return this["x-component"];
			  }
			  getExtendsRenderer() {
			    if (isValid(this["x-render"])) {
			      deprecate("x-render is deprecate in future, Please do not use it.");
			    }
			    return this["x-render"];
			  }
			  getExtendsEffect() {
			    return this["x-effect"];
			  }
			  getExtendsProps() {
			    return this["x-props"] || {};
			  }
			  getExtendsComponentProps() {
			    return __spreadValues$6(__spreadValues$6({}, filterProperties(this["x-props"], COMPAT_FORM_ITEM_PROPS)), this["x-component-props"]);
			  }
			  getExtendsLinkages() {
			    return this["x-linkages"];
			  }
			  setProperty(key, schema) {
			    this.properties = this.properties || {};
			    this.properties[key] = new _Schema(schema, this, key);
			    return this.properties[key];
			  }
			  setProperties(properties) {
			    each(properties, (schema, key) => {
			      this.setProperty(key, schema);
			    });
			    return this.properties;
			  }
			  setArrayItems(schema) {
			    this.items = new _Schema(schema, this);
			    return this.items;
			  }
			  toJSON() {
			    const result = this.getSelfProps();
			    if (isValid(this.properties)) {
			      result.properties = map$2(this.properties, (schema) => {
			        return schema.toJSON();
			      });
			    }
			    if (isValid(this.items)) {
			      result.items = isArr(this.items) ? this.items.map((schema) => schema.toJSON()) : this.items.toJSON();
			    }
			    if (isValid(this.additionalItems)) {
			      result.additionalItems = this.additionalItems.toJSON();
			    }
			    if (isValid(this.additionalProperties)) {
			      result.additionalProperties = this.additionalProperties.toJSON();
			    }
			    if (isValid(this.patternProperties)) {
			      result.patternProperties = map$2(this.patternProperties, (schema) => {
			        return schema.toJSON();
			      });
			    }
			    return result;
			  }
			  fromJSON(json = {}) {
			    if (typeof json === "boolean")
			      return json;
			    if (json instanceof _Schema) {
			      Object.assign(this, json);
			      return this;
			    } else {
			      Object.assign(this, json);
			    }
			    if (isValid(json.type)) {
			      this.type = lowercase(String(json.type));
			    }
			    if (isValid(json["x-component"])) {
			      this["x-component"] = lowercase(json["x-component"]);
			    }
			    if (!isEmpty$2(json.properties)) {
			      this.properties = map$2(json.properties, (item, key) => {
			        return new _Schema(item, this, key);
			      });
			      if (isValid(json.additionalProperties)) {
			        this.additionalProperties = new _Schema(json.additionalProperties, this);
			      }
			      if (isValid(json.patternProperties)) {
			        this.patternProperties = map$2(json.patternProperties, (item, key) => {
			          return new _Schema(item, this, key);
			        });
			      }
			    } else if (!isEmpty$2(json.items)) {
			      this.items = isArr(json.items) ? map$2(json.items, (item) => new _Schema(item, this)) : new _Schema(json.items, this);
			      if (isValid(json.additionalItems)) {
			        this.additionalItems = new _Schema(json.additionalItems, this);
			      }
			    }
			    return this;
			  }
			  isObject() {
			    return this.type === "object";
			  }
			  isArray() {
			    return this.type === "array";
			  }
			  mapProperties(callback) {
			    return this.getOrderProperties().map(({ schema, key }) => {
			      return callback(schema, key);
			    });
			  }
			  getOrderProperties() {
			    return _Schema.getOrderProperties(this);
			  }
			  unrelease_getOrderPatternProperties() {
			    return _Schema.getOrderProperties(this, "patternProperties");
			  }
			  unrelease_mapPatternProperties(callback) {
			    return this.unrelease_getOrderPatternProperties().map(({ schema, key }) => {
			      return callback(schema, key);
			    });
			  }
			};
			let Schema = exports('Schema', _Schema);
			Schema.getOrderProperties = (schema = {}, propertiesName = "properties") => {
			  const newSchema = new _Schema(schema);
			  const orderProperties = [];
			  const unorderProperties = [];
			  each(newSchema[propertiesName], (item, key) => {
			    const index = item["x-index"];
			    if (!isNaN(index)) {
			      orderProperties[index] = { schema: item, key };
			    } else {
			      unorderProperties.push({ schema: item, key });
			    }
			  });
			  return orderProperties.concat(unorderProperties).filter((item) => !!item);
			};

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
			var upperCase$2 = function (str, locale) {
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

			var upperCase$1 = upperCase$2;
			var noCase = noCase$1;

			/**
			 * Camel case a string.
			 *
			 * @param  {string} value
			 * @param  {string} [locale]
			 * @return {string}
			 */
			var camelCase$1 = function (value, locale, mergeNumbers) {
			  var result = noCase(value, locale);

			  // Replace periods between numeric entities with an underscore.
			  if (!mergeNumbers) {
			    result = result.replace(/ (?=\d)/g, '_');
			  }

			  // Replace spaces between words with an upper cased character.
			  return result.replace(/ (.)/g, function (m, $1) {
			    return upperCase$1($1, locale)
			  })
			};

			var upperCase = upperCase$2;

			/**
			 * Upper case the first character of a string.
			 *
			 * @param  {String} str
			 * @return {String}
			 */
			var upperCaseFirst$1 = function (str, locale) {
			  if (str == null) {
			    return ''
			  }

			  str = String(str);

			  return upperCase(str.charAt(0), locale) + str.substr(1)
			};

			var camelCase = camelCase$1;
			var upperCaseFirst = upperCaseFirst$1;

			/**
			 * Pascal case a string.
			 *
			 * @param  {string}  value
			 * @param  {string}  [locale]
			 * @param  {boolean} [mergeNumbers]
			 * @return {string}
			 */
			var pascalCase = function (value, locale, mergeNumbers) {
			  return upperCaseFirst(camelCase(value, locale, mergeNumbers), locale)
			};

			const registry = {
			  fields: {},
			  virtualFields: {},
			  wrappers: [],
			  formItemComponent: ({ children }) => children,
			  formComponent: "form",
			  previewText: null
			};
			const getRegistry = exports('getRegistry', () => {
			  return {
			    fields: registry.fields,
			    virtualFields: registry.virtualFields,
			    formItemComponent: registry.formItemComponent,
			    formComponent: registry.formComponent,
			    previewText: registry.previewText
			  };
			});
			const cleanRegistry = exports('cleanRegistry', () => {
			  registry.fields = {};
			  registry.virtualFields = {};
			  registry.wrappers = [];
			  registry.previewText = null;
			});
			function registerFormComponent(component) {
			  if (isFn$1(component)) {
			    registry.formComponent = component;
			  }
			}
			function compose(payload, args, revert) {
			  return reduce$2(args, (buf, fn) => {
			    return isFn$1(fn) ? fn(buf) : buf;
			  }, payload, revert);
			}
			function registerFormField(name, component, noWrapper = false) {
			  if (name && (isFn$1(component) || typeof component.styledComponentId === "string")) {
			    name = lowercase(name);
			    if (registry.fields[name]) {
			      log.warn("Component registration naming conflict. Please change the name. Globally registered components will no longer support overlay registration in the future.");
			    }
			    if (noWrapper) {
			      registry.fields[name] = component;
			      registry.fields[name].__WRAPPERS__ = [];
			    } else {
			      registry.fields[name] = compose(component, registry.wrappers, true);
			      registry.fields[name].__WRAPPERS__ = registry.wrappers;
			    }
			    registry.fields[name].displayName = pascalCase(name);
			  }
			}
			function registerFormFields(object) {
			  each(object, (component, key) => {
			    registerFormField(key, component);
			  });
			}
			function registerVirtualBox(name, component) {
			  if (name && (isFn$1(component) || typeof component.styledComponentId === "string")) {
			    name = lowercase(name);
			    registry.virtualFields[name] = component;
			    registry.virtualFields[name].displayName = pascalCase(name);
			  }
			}
			function registerFormItemComponent(component) {
			  if (isFn$1(component)) {
			    registry.formItemComponent = component;
			  }
			}
			const registerFieldMiddleware = exports('registerFieldMiddleware', deprecate(function registerFieldMiddleware2(...wrappers) {
			  registry.wrappers = registry.wrappers.concat(wrappers);
			  each(registry.fields, (component, key) => {
			    if (!component.__WRAPPERS__.some((wrapper) => wrappers.indexOf(wrapper) > -1)) {
			      registry.fields[key] = compose(registry.fields[key], wrappers, true);
			      registry.fields[key].__WRAPPERS__ = wrappers;
			    }
			  });
			}));
			function registerPreviewTextComponent(component) {
			  if (isFn$1(component)) {
			    registry.previewText = component;
			  }
			}

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

			var reactIs = reactIs$1.exports;

			/**
			 * Copyright 2015, Yahoo! Inc.
			 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
			 */
			var REACT_STATICS = {
			  childContextTypes: true,
			  contextType: true,
			  contextTypes: true,
			  defaultProps: true,
			  displayName: true,
			  getDefaultProps: true,
			  getDerivedStateFromError: true,
			  getDerivedStateFromProps: true,
			  mixins: true,
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
			var FORWARD_REF_STATICS = {
			  '$$typeof': true,
			  render: true,
			  defaultProps: true,
			  displayName: true,
			  propTypes: true
			};
			var MEMO_STATICS = {
			  '$$typeof': true,
			  compare: true,
			  defaultProps: true,
			  displayName: true,
			  propTypes: true,
			  type: true
			};
			var TYPE_STATICS = {};
			TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
			TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

			function getStatics(component) {
			  // React v16.11 and below
			  if (reactIs.isMemo(component)) {
			    return MEMO_STATICS;
			  } // React v16.12 and above


			  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
			}

			var defineProperty = Object.defineProperty;
			var getOwnPropertyNames = Object.getOwnPropertyNames;
			var getOwnPropertySymbols = Object.getOwnPropertySymbols;
			var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
			var getPrototypeOf = Object.getPrototypeOf;
			var objectPrototype = Object.prototype;
			function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
			  if (typeof sourceComponent !== 'string') {
			    // don't hoist over string (html) components
			    if (objectPrototype) {
			      var inheritedComponent = getPrototypeOf(sourceComponent);

			      if (inheritedComponent && inheritedComponent !== objectPrototype) {
			        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
			      }
			    }

			    var keys = getOwnPropertyNames(sourceComponent);

			    if (getOwnPropertySymbols) {
			      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
			    }

			    var targetStatics = getStatics(targetComponent);
			    var sourceStatics = getStatics(sourceComponent);

			    for (var i = 0; i < keys.length; ++i) {
			      var key = keys[i];

			      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
			        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

			        try {
			          // Avoid failures from read-only properties
			          defineProperty(targetComponent, key, descriptor);
			        } catch (e) {}
			      }
			    }
			  }

			  return targetComponent;
			}

			var hoistNonReactStatics_cjs = hoistNonReactStatics;

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
			const createEnum = (enums) => {
			  if (isArr(enums)) {
			    return enums.map((item) => {
			      if (typeof item === "object") {
			        return item;
			      } else {
			        return {
			          label: item,
			          value: item
			        };
			      }
			    });
			  }
			  return [];
			};
			const bindEffects = (props, fieldProps, effect, notify) => {
			  each(effect((type, payload) => notify(type, { payload, name: fieldProps.name, path: fieldProps.path }), __spreadValues$5({}, props)), (event, key) => {
			    const prevEvent = key === "onChange" ? props[key] : void 0;
			    props[key] = (...args) => {
			      if (isFn$1(event)) {
			        event(...args);
			      }
			      if (isFn$1(prevEvent)) {
			        return prevEvent(...args);
			      }
			    };
			  });
			  return props;
			};
			const connect = exports('connect', (options) => {
			  options = defaults({
			    valueName: "value",
			    eventName: "onChange"
			  }, options);
			  return (Component) => {
			    const ConnectedComponent = (fieldProps) => {
			      const { value, name, mutators, form, editable, props } = fieldProps;
			      const schema = new Schema(props);
			      const schemaComponentProps = schema.getExtendsComponentProps();
			      let componentProps = __spreadProps$5(__spreadValues$5(__spreadValues$5({}, options.defaultProps), schemaComponentProps), {
			        [options.valueName]: value,
			        [options.eventName]: (event, ...args) => {
			          mutators.change(options.getValueFromEvent ? options.getValueFromEvent.call({
			            props: componentProps,
			            schema,
			            field: fieldProps
			          }, event, ...args) : event, ...args);
			          if (isFn$1(schemaComponentProps[options.eventName])) {
			            return schemaComponentProps[options.eventName](event, ...args);
			          }
			        },
			        onBlur: (...args) => {
			          mutators.blur();
			          if (isFn$1(schemaComponentProps["onBlur"])) {
			            return schemaComponentProps["onBlur"](...args);
			          }
			        },
			        onFocus: (...args) => {
			          mutators.focus();
			          if (isFn$1(schemaComponentProps["onFocus"])) {
			            return schemaComponentProps["onFocus"](...args);
			          }
			        }
			      });
			      if (isValid(editable)) {
			        if (isFn$1(editable)) {
			          if (!editable(name)) {
			            componentProps.disabled = true;
			            componentProps.readOnly = true;
			          }
			        } else if (editable === false) {
			          componentProps.disabled = true;
			          componentProps.readOnly = true;
			        }
			      }
			      const extendsEffect = schema.getExtendsEffect();
			      if (isFn$1(extendsEffect)) {
			        componentProps = bindEffects(componentProps, fieldProps, extendsEffect, form.notify);
			      }
			      if (isFn$1(options.getProps)) {
			        const newProps = options.getProps(componentProps, fieldProps);
			        if (isValid(newProps)) {
			          componentProps = newProps;
			        }
			      }
			      if (isArr(props.enum) && !componentProps.dataSource) {
			        componentProps.dataSource = createEnum(props.enum);
			      } else if (componentProps.dataSource) {
			        componentProps.dataSource = createEnum(componentProps.dataSource);
			      }
			      if (isValid(componentProps.editable)) {
			        delete componentProps.editable;
			      }
			      const megaProps = schema.getMegaLayoutProps();
			      const { full, size } = useLayout(megaProps);
			      if (full) {
			        componentProps.style = __spreadProps$5(__spreadValues$5({}, componentProps.style || {}), {
			          width: "100%",
			          flex: "1 1 0%"
			        });
			      }
			      if (size) {
			        componentProps.size = size;
			      }
			      return React.createElement(isFn$1(options.getComponent) ? options.getComponent(Component, props, fieldProps) : Component, componentProps);
			    };
			    Object.assign(ConnectedComponent, {
			      __ALREADY_CONNECTED__: true
			    });
			    if (Component) {
			      hoistNonReactStatics_cjs(ConnectedComponent, Component);
			    }
			    return ConnectedComponent;
			  };
			});

			const _JSONCondition = class {
			  constructor(json, value) {
			    this.complieAtom = (source = []) => {
			      switch (source[0]) {
			        case "&&":
			          return source.slice(1).every(this.complieAtom);
			        case "||":
			          return source.slice(1).some(this.complieAtom);
			        case ">":
			          return Number(this.value) > Number(source[1]);
			        case "<":
			          return Number(this.value) < Number(source[1]);
			        case ">=":
			          return Number(this.value) >= Number(source[1]);
			        case "<=":
			          return Number(this.value) <= Number(source[1]);
			        case "=":
			        case "==":
			          return isEqual(this.value, source[1]);
			        case "!=":
			          return !isEqual(this.value, source[1]);
			        case "!":
			          return !this.value;
			        case "includes":
			          if (isArr(this.value)) {
			            return this.value.indexOf(source[1]) > -1;
			          }
			          return String(this.value).includes(source[1]);
			        case "pattern":
			          return new RegExp(source[1]).test(this.value);
			        case "startWith":
			          return String(this.value).startsWith(source[1]);
			        case "endWith":
			          return String(this.value).endsWith(source[1]);
			      }
			      return false;
			    };
			    this.source = json || [];
			    this.value = value;
			  }
			  complie() {
			    return this.complieAtom(this.source);
			  }
			};
			let JSONCondition = exports('JSONCondition', _JSONCondition);
			JSONCondition.calculate = (condition, value) => {
			  if (isArr(condition)) {
			    return new _JSONCondition(condition, value).complie();
			  }
			  if (isBool(condition))
			    return condition;
			  return false;
			};

			const ExpRE = /^\s*\{\{(.*)\}\}\s*$/;
			const actionsSymbol = Symbol.for("__REVA_ACTIONS");
			const complieExpression = exports('complieExpression', (source, context, exclude) => {
			  const seenObjects = [];
			  const complie = (source2) => {
			    if (isStr(source2)) {
			      const matched = source2.match(ExpRE);
			      if (!matched)
			        return source2;
			      const vars = Object.keys(context || {});
			      const params = vars.map((key) => context[key]);
			      return new Function(...vars, `return (${matched[1]});`)(...params);
			    } else if (isArr(source2)) {
			      return source2.map((value) => complie(value));
			    } else if (isPlainObj(source2)) {
			      if ("$$typeof" in source2 && "_owner" in source2) {
			        return source2;
			      }
			      if (source2[actionsSymbol]) {
			        return source2;
			      }
			      if (source2["_isAMomentObject"]) {
			        return source2;
			      }
			      if (source2["_isJSONSchemaObject"]) {
			        return source2;
			      }
			      if (BigData.isBigData(source2)) {
			        return source2;
			      }
			      if (isFn$1(source2["toJS"])) {
			        return source2;
			      }
			      if (isFn$1(source2["toJSON"])) {
			        return source2;
			      }
			      if (seenObjects.includes(source2)) {
			        return source2;
			      }
			      seenObjects.push(source2);
			      return reduce$2(source2, (buf, value, key) => {
			        if (isFn$1(exclude)) {
			          if (exclude(key, value)) {
			            buf[key] = value;
			            return buf;
			          }
			        }
			        if (key == "x-linkages") {
			          buf[key] = value;
			          return buf;
			        }
			        if (value && value["_owner"] && value["$$typeof"]) {
			          buf[key] = value;
			          return buf;
			        }
			        buf[key] = complie(value);
			        return buf;
			      }, {});
			    }
			    return source2;
			  };
			  return complie(source);
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
			const pathExpRE = /\[\s*(?:([+-])\s*(\d+)?)?\s*\]/g;
			const transformTargetPath = (target, indexes, basePath) => {
			  if (!isStr(target))
			    return target;
			  let index = 0;
			  const newTarget = target.replace(/^\s*(\.+)/, (_, $1) => {
			    const depth = $1.length;
			    let path = basePath;
			    for (let i = 0; i < depth; i++) {
			      path = path.parent();
			    }
			    return path.toString() + ".";
			  }).replace(pathExpRE, (_, operator, delta) => {
			    if (delta) {
			      if (operator === "+") {
			        return String(indexes[index++] + Number(delta));
			      } else if (operator === "-") {
			        return String(indexes[index++] - Number(delta));
			      }
			    } else {
			      if (operator === "+") {
			        return String(indexes[index++] + 1);
			      } else if (operator === "-") {
			        return String(indexes[index++] - 1);
			      }
			    }
			    return String(indexes[index++]);
			  });
			  pathExpRE.lastIndex = 0;
			  return newTarget;
			};
			const getPathIndexes = (path) => {
			  return path.transform(/\d+/, (...args) => args.map((i) => Number(i)));
			};
			const parseLinkages = exports('parseLinkages', (fieldState, {
			  getFieldState,
			  getFormState,
			  scope: outerScope
			} = {}) => {
			  const schema = new Schema(fieldState.props);
			  const linkages = schema.getExtendsLinkages();
			  if (!isArr(linkages))
			    return [];
			  const fieldName = FormPath.parse(fieldState.name);
			  const fieldIndexes = getPathIndexes(fieldName);
			  const formState = getFormState ? getFormState() : {};
			  return linkages.map((_a) => {
			    var _b = _a, { target, condition, scope } = _b, params = __objRest$2(_b, ["target", "condition", "scope"]);
			    const newTarget = transformTargetPath(target, fieldIndexes, fieldName);
			    const targetState = getFieldState ? getFieldState(newTarget) : {};
			    const fieldValue = fieldName.getIn(formState.values);
			    const _scope = __spreadProps$4(__spreadValues$4(__spreadValues$4({}, outerScope), scope), {
			      $value: fieldValue,
			      $self: fieldState || {},
			      $form: formState || {},
			      $target: targetState || {}
			    });
			    const options = params;
			    options.complie = (path = "", scope2) => {
			      return complieExpression(FormPath.getIn(params, path), __spreadValues$4(__spreadValues$4({}, _scope), scope2));
			    };
			    if (condition !== void 0) {
			      options.condition = JSONCondition.calculate(complieExpression(condition, _scope), fieldValue);
			    }
			    options.target = newTarget;
			    return options;
			  });
			});
			const useValueLinkageEffect = exports('useValueLinkageEffect', ({
			  type,
			  resolve,
			  reject,
			  scope
			} = {}) => {
			  if (!type || !isFn$1(resolve))
			    return;
			  const actions = createFormActions$1();
			  const { getFormState, getFieldState, hasChanged } = actions;
			  const { onFieldChange$ } = FormEffectHooks;
			  onFieldChange$("*").subscribe((fieldState) => {
			    if (!hasChanged(fieldState, "value") && !hasChanged(fieldState, "initialized") && !hasChanged(fieldState, "visible")) {
			      return;
			    }
			    const linkages = parseLinkages(fieldState, {
			      getFieldState,
			      getFormState,
			      scope
			    });
			    linkages.forEach((options) => {
			      const { type: linkageType, condition } = options;
			      if (linkageType !== type)
			        return;
			      if (isFn$1(resolve)) {
			        if (condition === true || condition === void 0)
			          resolve(options, actions);
			      }
			      if (isFn$1(reject)) {
			        if (condition === false)
			          reject(options, actions);
			      }
			    });
			  });
			});

			const useValueVisibleLinkageEffect = (scope) => useValueLinkageEffect({
			  type: "value:visible",
			  resolve: ({ target }, { setFieldState }) => {
			    setFieldState(target, (innerState) => {
			      innerState.visible = true;
			    });
			  },
			  reject: ({ target }, { setFieldState }) => {
			    setFieldState(target, (innerState) => {
			      innerState.visible = false;
			    });
			  },
			  scope
			});

			const useValueSchemaLinkageEffect = (scope) => useValueLinkageEffect({
			  type: "value:schema",
			  resolve: ({ target, complie }, { setFieldState }) => {
			    setFieldState(target, (innerState) => {
			      merge$4(innerState.props, complie("schema", {
			        $target: innerState
			      }), {
			        assign: true,
			        arrayMerge: (target2, source) => source
			      });
			    });
			  },
			  reject: ({ target, otherwise, complie }, { setFieldState }) => {
			    if (!otherwise)
			      return;
			    setFieldState(target, (innerState) => {
			      merge$4(innerState.props, complie("otherwise", {
			        $target: innerState
			      }), {
			        assign: true,
			        arrayMerge: (target2, source) => source
			      });
			    });
			  },
			  scope
			});

			const useValueStateLinkageEffect = (scope) => useValueLinkageEffect({
			  type: "value:state",
			  resolve: ({ target, complie }, { setFieldState }) => {
			    setFieldState(target, (innerState) => {
			      merge$4(innerState, complie("state", {
			        $target: innerState
			      }), {
			        assign: true,
			        arrayMerge: (target2, source) => source
			      });
			    });
			  },
			  reject: ({ target, otherwise, complie }, { setFieldState }) => {
			    if (!otherwise)
			      return;
			    setFieldState(target, (innerState) => {
			      merge$4(innerState, complie("otherwise", {
			        $target: innerState
			      }), {
			        assign: true,
			        arrayMerge: (target2, source) => source
			      });
			    });
			  },
			  scope
			});

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
			const lowercaseKeys = (obj) => {
			  const result = {};
			  each(obj, (value, key) => {
			    result[lowercase(key)] = value;
			  });
			  return result;
			};
			const ConnectedComponent = Symbol.for("connected");
			const transformComponents = (components) => {
			  const fieldComponents = {};
			  const virtualFieldComponents = {};
			  each(components, (component, name) => {
			    if (!isFn$1(component) && !component["styledComponentId"])
			      fieldComponents[name] = () => {
			        return createElement("div", {}, "Can not found any component.");
			      };
			    if (component["__ALREADY_CONNECTED__"] || component["isFieldComponent"]) {
			      fieldComponents[name] = component;
			    } else if (component["__VIRTUAL_BOX__"]) {
			      virtualFieldComponents[component["__VIRTUAL_BOX__"]["key"]] = component["__VIRTUAL_BOX__"]["component"];
			    } else if (component["isVirtualFieldComponent"]) {
			      virtualFieldComponents[name] = component;
			    } else if (!component[ConnectedComponent]) {
			      component[ConnectedComponent] = connect()(component);
			      fieldComponents[name] = component[ConnectedComponent];
			    } else {
			      fieldComponents[name] = component[ConnectedComponent];
			    }
			  });
			  return { fieldComponents, virtualFieldComponents };
			};
			const useInternalSchemaForm = (props) => {
			  const _a = props, {
			    fields,
			    virtualFields,
			    components,
			    formComponent,
			    formItemComponent,
			    componentPropsInterceptor,
			    schema: propsSchema,
			    defaultValue,
			    value,
			    initialValues,
			    actions,
			    effects,
			    onChange,
			    onSubmit,
			    onReset,
			    onValidateFailed,
			    useDirty,
			    children,
			    expressionScope,
			    form,
			    editable,
			    validateFirst
			  } = _a, formComponentProps = __objRest$1(_a, [
			    "fields",
			    "virtualFields",
			    "components",
			    "formComponent",
			    "formItemComponent",
			    "componentPropsInterceptor",
			    "schema",
			    "defaultValue",
			    "value",
			    "initialValues",
			    "actions",
			    "effects",
			    "onChange",
			    "onSubmit",
			    "onReset",
			    "onValidateFailed",
			    "useDirty",
			    "children",
			    "expressionScope",
			    "form",
			    "editable",
			    "validateFirst"
			  ]);
			  const { implementActions } = useEva_1({
			    actions
			  });
			  const schema = useMemo(() => {
			    const result = new Schema(propsSchema);
			    implementActions({
			      getSchema: deprecate(() => result, "Please use the getFormSchema."),
			      getFormSchema: () => result
			    });
			    return result;
			  }, [propsSchema]);
			  const registry = getRegistry();
			  const { fieldComponents, virtualFieldComponents } = transformComponents(components);
			  return {
			    form: useForm(__spreadProps$3(__spreadValues$3({}, props), {
			      effects: ($, actions2) => {
			        useValueVisibleLinkageEffect(expressionScope);
			        useValueSchemaLinkageEffect(expressionScope);
			        useValueStateLinkageEffect(expressionScope);
			        if (isFn$1(effects)) {
			          effects($, actions2);
			        }
			      }
			    })),
			    formComponentProps: __spreadValues$3(__spreadValues$3({}, formComponentProps), schema.getExtendsComponentProps()),
			    fields: lowercaseKeys(__spreadValues$3(__spreadValues$3(__spreadValues$3({}, registry.fields), fields), fieldComponents)),
			    virtualFields: lowercaseKeys(__spreadValues$3(__spreadValues$3(__spreadValues$3({}, registry.virtualFields), virtualFields), virtualFieldComponents)),
			    formComponent: formComponent ? formComponent : registry.formComponent,
			    formItemComponent: formItemComponent ? formItemComponent : registry.formItemComponent,
			    schema,
			    componentPropsInterceptor,
			    children
			  };
			};
			const useSchemaForm = exports('useSchemaForm', (props) => {
			  const actionsRef = useRef(null);
			  actionsRef.current = actionsRef.current || props.actions || createSchemaFormActions();
			  return useInternalSchemaForm(__spreadProps$3(__spreadValues$3({}, props), {
			    actions: actionsRef.current
			  }));
			});

			const FormComponentsContext = exports('FormComponentsContext', createContext(null));
			const FormExpressionScopeContext = exports('FormExpressionScopeContext', createContext({}));
			const SchemaFieldPropsContext = exports('SchemaFieldPropsContext', createContext(null));
			const FormSchemaContext = exports('FormSchemaContext', createContext(null));

			const useSchemaProps = exports('useSchemaProps', () => useContext(SchemaFieldPropsContext));

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
			const computeSchemaState = (draft, prevState) => {
			  const schema = new Schema(draft.props);
			  const prevSchema = new Schema(prevState.props);
			  const currentRequired = schema.getExtendsRequired();
			  const prevRequired = prevSchema.getExtendsRequired();
			  const currentRules = schema.getExtendsRules();
			  const prevRules = prevSchema.getExtendsRules();
			  const currentEditable = schema.getExtendsEditable();
			  const prevEditable = prevSchema.getExtendsEditable();
			  if (isValid(currentRequired) && !isEqual(currentRequired, prevRequired)) {
			    draft.required = currentRequired;
			  }
			  if (isValid(currentRules) && !isEqual(currentRules, prevRules)) {
			    draft.rules = currentRules;
			  }
			  if (isValid(currentEditable) && !isEqual(currentEditable, prevEditable)) {
			    draft.selfEditable = currentEditable;
			  }
			};
			const SchemaField = exports('SchemaField', (props) => {
			  const path = FormPath.parse(props.path);
			  const formSchema = useContext(FormSchemaContext);
			  const fieldSchema = new Schema(props.schema || formSchema.get(path));
			  const formRegistry = useContext(FormComponentsContext);
			  const expressionScope = useContext(FormExpressionScopeContext);
			  const ErrorTipPathStr = path.toString();
			  if (!fieldSchema) {
			    throw new Error(`Can not found schema node by ${ErrorTipPathStr}.`);
			  }
			  if (!formRegistry) {
			    throw new Error(`Can not found any form components.`);
			  }
			  const schemaType = fieldSchema.type;
			  const schemaComponent = fieldSchema.getExtendsComponent();
			  const schemaRenderer = fieldSchema.getExtendsRenderer();
			  const initialComponent = schemaComponent || schemaType;
			  const renderField = (addtionKey, reactKey) => {
			    return /* @__PURE__ */ React.createElement(SchemaField, {
			      key: reactKey,
			      path: path.concat(addtionKey)
			    });
			  };
			  const getPropsFromInterceptor = (stateProps) => {
			    let interceptorProps = {};
			    if (isFn$1(formRegistry.componentPropsInterceptor)) {
			      interceptorProps = formRegistry.componentPropsInterceptor(props) || {};
			    }
			    return __spreadProps$2(__spreadValues$2({}, stateProps), {
			      ["x-component-props"]: __spreadValues$2(__spreadValues$2({}, stateProps["x-component-props"] || {}), interceptorProps)
			    });
			  };
			  const renderFieldDelegate = (callback) => {
			    return /* @__PURE__ */ React.createElement(Field, {
			      path,
			      initialValue: complieExpression(fieldSchema.default, expressionScope),
			      props: complieExpression(fieldSchema.getSelfProps(), expressionScope, (key) => key == "x-linkages"),
			      dataType: fieldSchema.type,
			      triggerType: fieldSchema.getExtendsTriggerType(),
			      editable: fieldSchema.getExtendsEditable(),
			      visible: complieExpression(fieldSchema.getExtendsVisible(), expressionScope),
			      display: complieExpression(fieldSchema.getExtendsDisplay(), expressionScope),
			      required: complieExpression(fieldSchema.getExtendsRequired(), expressionScope),
			      rules: complieExpression(fieldSchema.getExtendsRules(), expressionScope),
			      computeState: computeSchemaState
			    }, ({ state, mutators, form }) => {
			      const stateProps = getPropsFromInterceptor(state.props);
			      const props2 = __spreadProps$2(__spreadValues$2({}, state), {
			        props: stateProps,
			        schema: new Schema(fieldSchema).merge(stateProps),
			        form,
			        mutators,
			        renderField
			      });
			      return /* @__PURE__ */ React.createElement(SchemaFieldPropsContext.Provider, {
			        value: props2
			      }, callback(props2));
			    });
			  };
			  const renderVirtualFieldDelegate = (callback) => {
			    return /* @__PURE__ */ React.createElement(VirtualField, {
			      path,
			      visible: complieExpression(fieldSchema.getExtendsVisible(), expressionScope),
			      display: complieExpression(fieldSchema.getExtendsDisplay(), expressionScope),
			      props: complieExpression(fieldSchema.getSelfProps(), expressionScope, (key) => key == "x-linkages")
			    }, ({ state, form }) => {
			      const stateProps = getPropsFromInterceptor(state.props);
			      const props2 = __spreadProps$2(__spreadValues$2({}, state), {
			        props: stateProps,
			        schema: new Schema(fieldSchema).merge(stateProps),
			        form,
			        renderField,
			        children: fieldSchema.mapProperties((schema, key) => {
			          return /* @__PURE__ */ React.createElement(SchemaField, {
			            schema,
			            key,
			            path: path.concat(key)
			          });
			        })
			      });
			      return /* @__PURE__ */ React.createElement(SchemaFieldPropsContext.Provider, {
			        value: props2
			      }, callback(props2));
			    });
			  };
			  const renderProperties = () => {
			    return fieldSchema.mapProperties((schema, key) => {
			      const childPath = path.concat(key);
			      return /* @__PURE__ */ React.createElement(SchemaField, {
			        schema,
			        key: childPath.toString(),
			        path: childPath
			      });
			    });
			  };
			  if (fieldSchema.isObject() && !schemaComponent) {
			    if (path.length == 0 || props.onlyRenderProperties) {
			      return /* @__PURE__ */ React.createElement(Fragment, null, renderProperties());
			    }
			    return renderFieldDelegate((props2) => {
			      const renderComponent = () => {
			        if (!formRegistry.formItemComponent) {
			          log.error(`Can not found any component.Its key is ${ErrorTipPathStr}.`);
			          return null;
			        }
			        return React.createElement(formRegistry.formItemComponent, props2, renderProperties());
			      };
			      if (isFn$1(schemaRenderer)) {
			        return schemaRenderer(__spreadProps$2(__spreadValues$2({}, props2), { renderComponent }));
			      }
			      return renderComponent();
			    });
			  } else {
			    if (isStr(initialComponent)) {
			      if (formRegistry.fields[initialComponent]) {
			        return renderFieldDelegate((props2) => {
			          const stateComponent = lowercase(props2.schema.getExtendsComponent() || props2.schema.type);
			          if (!isStr(stateComponent)) {
			            log.error(`Can not found any form component <${stateComponent}>.Its key is ${ErrorTipPathStr}.`);
			            return null;
			          }
			          const renderComponent = () => {
			            if (!formRegistry.fields[stateComponent]) {
			              log.error(`Can not found the field component <${stateComponent}>.Its key is ${ErrorTipPathStr}.`);
			              return null;
			            }
			            return React.createElement(formRegistry.formItemComponent, props2, React.createElement(formRegistry.fields[stateComponent], props2));
			          };
			          if (isFn$1(schemaRenderer)) {
			            return schemaRenderer(__spreadProps$2(__spreadValues$2({}, props2), { renderComponent }));
			          }
			          return renderComponent();
			        });
			      } else if (formRegistry.virtualFields[initialComponent]) {
			        return renderVirtualFieldDelegate((props2) => {
			          const stateComponent = lowercase(props2.schema.getExtendsComponent() || props2.schema.type);
			          if (!isStr(stateComponent)) {
			            log.error(`Can not found any virtual form component <${stateComponent}>.Its key is ${ErrorTipPathStr}.`);
			            return null;
			          }
			          const renderComponent = () => {
			            if (!formRegistry.virtualFields[stateComponent]) {
			              log.error(`Can not found the virtual field component <${stateComponent}>.Its key is ${ErrorTipPathStr}.`);
			              return null;
			            }
			            return React.createElement(formRegistry.virtualFields[stateComponent], props2);
			          };
			          if (isFn$1(schemaRenderer)) {
			            return schemaRenderer(__spreadProps$2(__spreadValues$2({}, props2), { renderComponent }));
			          }
			          return renderComponent();
			        });
			      } else {
			        log.error(`Can not found the field component <${initialComponent}>.Its key is ${ErrorTipPathStr}.`);
			        return null;
			      }
			    } else {
			      log.error(`Can not found the field component <${initialComponent}>.Its key is ${ErrorTipPathStr}.`);
			      return null;
			    }
			  }
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
			const SchemaForm = exports('SchemaForm', (props) => {
			  const {
			    fields,
			    virtualFields,
			    formComponent,
			    componentPropsInterceptor,
			    formItemComponent,
			    formComponentProps,
			    schema,
			    form,
			    children
			  } = useSchemaForm(props);
			  return /* @__PURE__ */ React.createElement(FormComponentsContext.Provider, {
			    value: { fields, virtualFields, formComponent, formItemComponent, componentPropsInterceptor }
			  }, /* @__PURE__ */ React.createElement(FormExpressionScopeContext.Provider, {
			    value: props.expressionScope
			  }, /* @__PURE__ */ React.createElement(FormSchemaContext.Provider, {
			    value: schema
			  }, /* @__PURE__ */ React.createElement(Form, {
			    form
			  }, React.createElement(formComponent, __spreadProps$1(__spreadValues$1({}, formComponentProps), {
			    onSubmit: (e) => {
			      if (e && e.preventDefault)
			        e.preventDefault();
			      if (e && e.stopPropagation)
			        e.stopPropagation();
			      form.submit().catch((e2) => log.warn(e2));
			    },
			    onReset: () => {
			      form.reset({ validate: false, forceClear: false });
			    }
			  }), /* @__PURE__ */ React.createElement(SchemaField, {
			    schema,
			    path: ""
			  }), children)))));
			});
			SchemaForm.defaultProps = {
			  schema: {}
			};

			const env$1 = {
			  portalDOM: null
			};
			const render = (element) => {
			  if (globalThisPolyfill["document"]) {
			    env$1.portalDOM = env$1.portalDOM || globalThisPolyfill["document"].createElement("div");
			    return require("react-dom").createPortal(element, env$1.portalDOM);
			  } else {
			    return /* @__PURE__ */ React.createElement("template", null, element);
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
			const env = {
			  nonameId: 0
			};
			const MarkupContext = exports('MarkupContext', createContext(null));
			const getRandomName = () => {
			  return `NO_NAME_FIELD_$${env.nonameId++}`;
			};
			const SchemaMarkupField = exports('SchemaMarkupField', (_a) => {
			  var _b = _a, {
			    children
			  } = _b, props = __objRest(_b, [
			    "children"
			  ]);
			  const parentSchema = useContext(MarkupContext);
			  if (!parentSchema)
			    return /* @__PURE__ */ React.createElement(Fragment, null);
			  if (parentSchema.isObject()) {
			    props.name = props.name || getRandomName();
			    const schema = parentSchema.setProperty(props.name, props);
			    if (typeof children === "string") {
			      schema["x-component-props"].children = children;
			    }
			    return /* @__PURE__ */ React.createElement(MarkupContext.Provider, {
			      value: schema
			    }, children);
			  } else if (parentSchema.isArray()) {
			    const schema = parentSchema.setArrayItems(props);
			    return /* @__PURE__ */ React.createElement(MarkupContext.Provider, {
			      value: schema
			    }, children);
			  } else {
			    return children || /* @__PURE__ */ React.createElement(React.Fragment, null);
			  }
			});
			SchemaMarkupField.displayName = "SchemaMarkupField";
			const SchemaMarkupForm = exports('SchemaMarkupForm', (props) => {
			  let alreadyHasSchema = false;
			  let finalSchema;
			  if (props.schema) {
			    alreadyHasSchema = true;
			    finalSchema = new Schema(props.schema);
			  } else {
			    finalSchema = new Schema({ type: "object" });
			  }
			  env.nonameId = 0;
			  return /* @__PURE__ */ React.createElement(Fragment, null, !alreadyHasSchema && render(/* @__PURE__ */ React.createElement(MarkupContext.Provider, {
			    value: finalSchema
			  }, props.children)), /* @__PURE__ */ React.createElement(SchemaForm, __spreadProps(__spreadValues({}, props), {
			    schema: finalSchema
			  })));
			});
			SchemaMarkupForm.displayName = "SchemaMarkupForm";
			const __VIRTUAL_BOX__ = "__VIRTUAL_BOX__";
			function createVirtualBox(key, component) {
			  const finalComponent = component ? ({ schema, children }) => {
			    const props = schema.getExtendsComponentProps();
			    return React.createElement(component, __spreadValues({
			      children
			    }, props));
			  } : () => /* @__PURE__ */ React.createElement(Fragment, null);
			  registerVirtualBox(key, finalComponent);
			  const VirtualBox = (_a) => {
			    var _b = _a, {
			      children,
			      name,
			      visible,
			      display
			    } = _b, props = __objRest(_b, [
			      "children",
			      "name",
			      "visible",
			      "display"
			    ]);
			    return /* @__PURE__ */ React.createElement(SchemaMarkupField, {
			      type: "object",
			      name,
			      visible,
			      display,
			      "x-component": key,
			      "x-component-props": props
			    }, children);
			  };
			  VirtualBox[__VIRTUAL_BOX__] = { key, component: finalComponent };
			  return VirtualBox;
			}
			function createControllerBox(key, component) {
			  const finalComponent = component ? component : () => /* @__PURE__ */ React.createElement(Fragment, null);
			  registerVirtualBox(key, finalComponent);
			  const VirtualBox = (_a) => {
			    var _b = _a, {
			      children,
			      name
			    } = _b, props = __objRest(_b, [
			      "children",
			      "name"
			    ]);
			    return /* @__PURE__ */ React.createElement(SchemaMarkupField, {
			      type: "object",
			      name,
			      "x-component": key,
			      "x-component-props": props
			    }, children);
			  };
			  VirtualBox[__VIRTUAL_BOX__] = { key, component: finalComponent };
			  return VirtualBox;
			}
			const FormSlot = exports('FormSlot', ({ name, children }) => {
			  return /* @__PURE__ */ React.createElement(SchemaMarkupField, {
			    type: "object",
			    name,
			    "x-render": () => {
			      return /* @__PURE__ */ React.createElement(Fragment, null, children);
			    }
			  });
			});

			const createFormActions = exports('createFormActions', createSchemaFormActions);
			const createAsyncFormActions = exports('createAsyncFormActions', createAsyncSchemaFormActions);

		})
	};
}));