/* rxjs@7.4.0 */
System.register([], (function (exports) {
    'use strict';
    return {
        execute: (function () {

            exports({
                $: empty,
                D: pipe,
                E: noop,
                F: identity,
                G: isObservable,
                H: lastValueFrom,
                I: firstValueFrom,
                Q: bindCallback,
                W: bindNodeCallback,
                X: combineLatest$1,
                Y: concat$1,
                Z: connectable,
                _: defer,
                a: applyMixins,
                a$: isEmpty,
                a0: forkJoin,
                a1: from,
                a2: fromEvent,
                a3: fromEventPattern,
                a4: generate,
                a5: iif,
                a6: interval,
                a7: merge$1,
                a8: never,
                a9: of,
                aA: concatMapTo,
                aB: concatWith,
                aC: connect,
                aD: count,
                aE: debounce,
                aF: debounceTime,
                aG: defaultIfEmpty,
                aH: delay,
                aI: delayWhen,
                aJ: dematerialize,
                aK: distinct,
                aL: distinctUntilChanged,
                aM: distinctUntilKeyChanged,
                aN: elementAt,
                aO: endWith,
                aP: every,
                aR: exhaustAll,
                aS: exhaustMap,
                aT: expand,
                aU: filter,
                aV: finalize,
                aW: find,
                aX: findIndex,
                aY: first,
                aZ: groupBy,
                a_: ignoreElements,
                aa: onErrorResumeNext,
                ab: pairs,
                ac: partition$1,
                ad: race$1,
                ae: range,
                af: throwError,
                ag: timer,
                ah: using,
                ai: zip$1,
                aj: scheduled,
                an: audit,
                ao: auditTime,
                ap: buffer,
                aq: bufferCount,
                ar: bufferTime,
                as: bufferToggle,
                at: bufferWhen,
                au: catchError,
                aw: combineLatestAll,
                ax: combineLatestWith,
                ay: concatAll,
                az: concatMap,
                b$: zipAll,
                b0: last,
                b1: map,
                b2: mapTo,
                b3: materialize,
                b4: max,
                b5: mergeAll,
                b7: mergeMap,
                b8: mergeMapTo,
                b9: mergeScan,
                bA: skipUntil,
                bB: skipWhile,
                bC: startWith,
                bD: subscribeOn,
                bE: switchAll,
                bF: switchMap,
                bG: switchMapTo,
                bH: switchScan,
                bI: take,
                bJ: takeLast,
                bK: takeUntil,
                bL: takeWhile,
                bM: tap,
                bN: throttle,
                bO: throttleTime,
                bP: throwIfEmpty,
                bQ: timeInterval,
                bR: timeout,
                bS: timeoutWith,
                bT: timestamp,
                bU: toArray,
                bV: window,
                bW: windowCount,
                bX: windowTime,
                bY: windowToggle,
                bZ: windowWhen,
                b_: withLatestFrom,
                ba: mergeWith,
                bb: min,
                bc: multicast,
                bd: observeOn,
                be: pairwise,
                bf: pluck,
                bg: publish,
                bh: publishBehavior,
                bi: publishLast,
                bj: publishReplay,
                bk: raceWith,
                bl: reduce,
                bm: repeat,
                bn: repeatWhen,
                bo: retry,
                bp: retryWhen,
                bq: refCount,
                br: sample,
                bs: sampleTime,
                bt: scan,
                bu: sequenceEqual,
                bv: share,
                bw: shareReplay,
                bx: single,
                by: skip,
                bz: skipLast,
                c0: zipWith,
                c1: combineLatest,
                c2: concat,
                c3: merge,
                c4: onErrorResumeNext$1,
                c5: partition,
                c6: race,
                c7: zip,
                cc: fromFetch,
                cd: webSocket,
                e: errorNotification,
                k: animationFrames,
                n: nextNotification,
                o: observeNotification
            });

            function isFunction(value) {
                return typeof value === 'function';
            }

            function createErrorClass(createImpl) {
                const _super = (instance) => {
                    Error.call(instance);
                    instance.stack = new Error().stack;
                };
                const ctorFunc = createImpl(_super);
                ctorFunc.prototype = Object.create(Error.prototype);
                ctorFunc.prototype.constructor = ctorFunc;
                return ctorFunc;
            }

            const UnsubscriptionError = exports('U', createErrorClass((_super) => function UnsubscriptionErrorImpl(errors) {
                _super(this);
                this.message = errors
                    ? `${errors.length} errors occurred during unsubscription:
${errors.map((err, i) => `${i + 1}) ${err.toString()}`).join('\n  ')}`
                    : '';
                this.name = 'UnsubscriptionError';
                this.errors = errors;
            }));

            function arrRemove(arr, item) {
                if (arr) {
                    const index = arr.indexOf(item);
                    0 <= index && arr.splice(index, 1);
                }
            }

            class Subscription {
                constructor(initialTeardown) {
                    this.initialTeardown = initialTeardown;
                    this.closed = false;
                    this._parentage = null;
                    this._teardowns = null;
                }
                unsubscribe() {
                    let errors;
                    if (!this.closed) {
                        this.closed = true;
                        const { _parentage } = this;
                        if (_parentage) {
                            this._parentage = null;
                            if (Array.isArray(_parentage)) {
                                for (const parent of _parentage) {
                                    parent.remove(this);
                                }
                            }
                            else {
                                _parentage.remove(this);
                            }
                        }
                        const { initialTeardown } = this;
                        if (isFunction(initialTeardown)) {
                            try {
                                initialTeardown();
                            }
                            catch (e) {
                                errors = e instanceof UnsubscriptionError ? e.errors : [e];
                            }
                        }
                        const { _teardowns } = this;
                        if (_teardowns) {
                            this._teardowns = null;
                            for (const teardown of _teardowns) {
                                try {
                                    execTeardown(teardown);
                                }
                                catch (err) {
                                    errors = errors !== null && errors !== void 0 ? errors : [];
                                    if (err instanceof UnsubscriptionError) {
                                        errors = [...errors, ...err.errors];
                                    }
                                    else {
                                        errors.push(err);
                                    }
                                }
                            }
                        }
                        if (errors) {
                            throw new UnsubscriptionError(errors);
                        }
                    }
                }
                add(teardown) {
                    var _a;
                    if (teardown && teardown !== this) {
                        if (this.closed) {
                            execTeardown(teardown);
                        }
                        else {
                            if (teardown instanceof Subscription) {
                                if (teardown.closed || teardown._hasParent(this)) {
                                    return;
                                }
                                teardown._addParent(this);
                            }
                            (this._teardowns = (_a = this._teardowns) !== null && _a !== void 0 ? _a : []).push(teardown);
                        }
                    }
                }
                _hasParent(parent) {
                    const { _parentage } = this;
                    return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
                }
                _addParent(parent) {
                    const { _parentage } = this;
                    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
                }
                _removeParent(parent) {
                    const { _parentage } = this;
                    if (_parentage === parent) {
                        this._parentage = null;
                    }
                    else if (Array.isArray(_parentage)) {
                        arrRemove(_parentage, parent);
                    }
                }
                remove(teardown) {
                    const { _teardowns } = this;
                    _teardowns && arrRemove(_teardowns, teardown);
                    if (teardown instanceof Subscription) {
                        teardown._removeParent(this);
                    }
                }
            } exports('S', Subscription);
            Subscription.EMPTY = (() => {
                const empty = new Subscription();
                empty.closed = true;
                return empty;
            })();
            const EMPTY_SUBSCRIPTION = Subscription.EMPTY;
            function isSubscription(value) {
                return (value instanceof Subscription ||
                    (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
            }
            function execTeardown(teardown) {
                if (isFunction(teardown)) {
                    teardown();
                }
                else {
                    teardown.unsubscribe();
                }
            }

            const config = exports('am', {
                onUnhandledError: null,
                onStoppedNotification: null,
                Promise: undefined,
                useDeprecatedSynchronousErrorHandling: false,
                useDeprecatedNextContext: false,
            });

            const timeoutProvider = exports('t', {
                setTimeout(...args) {
                    const { delegate } = timeoutProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) || setTimeout)(...args);
                },
                clearTimeout(handle) {
                    const { delegate } = timeoutProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
                },
                delegate: undefined,
            });

            function reportUnhandledError(err) {
                timeoutProvider.setTimeout(() => {
                    const { onUnhandledError } = config;
                    if (onUnhandledError) {
                        onUnhandledError(err);
                    }
                    else {
                        throw err;
                    }
                });
            }

            function noop() { }

            const COMPLETE_NOTIFICATION = exports('C', (() => createNotification('C', undefined, undefined))());
            function errorNotification(error) {
                return createNotification('E', undefined, error);
            }
            function nextNotification(value) {
                return createNotification('N', value, undefined);
            }
            function createNotification(kind, value, error) {
                return {
                    kind,
                    value,
                    error,
                };
            }

            let context = null;
            function errorContext(cb) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    const isRoot = !context;
                    if (isRoot) {
                        context = { errorThrown: false, error: null };
                    }
                    cb();
                    if (isRoot) {
                        const { errorThrown, error } = context;
                        context = null;
                        if (errorThrown) {
                            throw error;
                        }
                    }
                }
                else {
                    cb();
                }
            }
            function captureError(err) {
                if (config.useDeprecatedSynchronousErrorHandling && context) {
                    context.errorThrown = true;
                    context.error = err;
                }
            }

            class Subscriber extends Subscription {
                constructor(destination) {
                    super();
                    this.isStopped = false;
                    if (destination) {
                        this.destination = destination;
                        if (isSubscription(destination)) {
                            destination.add(this);
                        }
                    }
                    else {
                        this.destination = EMPTY_OBSERVER;
                    }
                }
                static create(next, error, complete) {
                    return new SafeSubscriber(next, error, complete);
                }
                next(value) {
                    if (this.isStopped) {
                        handleStoppedNotification(nextNotification(value), this);
                    }
                    else {
                        this._next(value);
                    }
                }
                error(err) {
                    if (this.isStopped) {
                        handleStoppedNotification(errorNotification(err), this);
                    }
                    else {
                        this.isStopped = true;
                        this._error(err);
                    }
                }
                complete() {
                    if (this.isStopped) {
                        handleStoppedNotification(COMPLETE_NOTIFICATION, this);
                    }
                    else {
                        this.isStopped = true;
                        this._complete();
                    }
                }
                unsubscribe() {
                    if (!this.closed) {
                        this.isStopped = true;
                        super.unsubscribe();
                        this.destination = null;
                    }
                }
                _next(value) {
                    this.destination.next(value);
                }
                _error(err) {
                    try {
                        this.destination.error(err);
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
                _complete() {
                    try {
                        this.destination.complete();
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
            } exports('y', Subscriber);
            class SafeSubscriber extends Subscriber {
                constructor(observerOrNext, error, complete) {
                    super();
                    let next;
                    if (isFunction(observerOrNext)) {
                        next = observerOrNext;
                    }
                    else if (observerOrNext) {
                        ({ next, error, complete } = observerOrNext);
                        let context;
                        if (this && config.useDeprecatedNextContext) {
                            context = Object.create(observerOrNext);
                            context.unsubscribe = () => this.unsubscribe();
                        }
                        else {
                            context = observerOrNext;
                        }
                        next = next === null || next === void 0 ? void 0 : next.bind(context);
                        error = error === null || error === void 0 ? void 0 : error.bind(context);
                        complete = complete === null || complete === void 0 ? void 0 : complete.bind(context);
                    }
                    this.destination = {
                        next: next ? wrapForErrorHandling(next) : noop,
                        error: wrapForErrorHandling(error !== null && error !== void 0 ? error : defaultErrorHandler),
                        complete: complete ? wrapForErrorHandling(complete) : noop,
                    };
                }
            }
            function wrapForErrorHandling(handler, instance) {
                return (...args) => {
                    try {
                        handler(...args);
                    }
                    catch (err) {
                        if (config.useDeprecatedSynchronousErrorHandling) {
                            captureError(err);
                        }
                        else {
                            reportUnhandledError(err);
                        }
                    }
                };
            }
            function defaultErrorHandler(err) {
                throw err;
            }
            function handleStoppedNotification(notification, subscriber) {
                const { onStoppedNotification } = config;
                onStoppedNotification && timeoutProvider.setTimeout(() => onStoppedNotification(notification, subscriber));
            }
            const EMPTY_OBSERVER = {
                closed: true,
                next: noop,
                error: defaultErrorHandler,
                complete: noop,
            };

            const observable = exports('j', (() => (typeof Symbol === 'function' && Symbol.observable) || '@@observable')());

            function identity(x) {
                return x;
            }

            function pipe(...fns) {
                return pipeFromArray(fns);
            }
            function pipeFromArray(fns) {
                if (fns.length === 0) {
                    return identity;
                }
                if (fns.length === 1) {
                    return fns[0];
                }
                return function piped(input) {
                    return fns.reduce((prev, fn) => fn(prev), input);
                };
            }

            class Observable {
                constructor(subscribe) {
                    if (subscribe) {
                        this._subscribe = subscribe;
                    }
                }
                lift(operator) {
                    const observable = new Observable();
                    observable.source = this;
                    observable.operator = operator;
                    return observable;
                }
                subscribe(observerOrNext, error, complete) {
                    const subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
                    errorContext(() => {
                        const { operator, source } = this;
                        subscriber.add(operator
                            ?
                                operator.call(subscriber, source)
                            : source
                                ?
                                    this._subscribe(subscriber)
                                :
                                    this._trySubscribe(subscriber));
                    });
                    return subscriber;
                }
                _trySubscribe(sink) {
                    try {
                        return this._subscribe(sink);
                    }
                    catch (err) {
                        sink.error(err);
                    }
                }
                forEach(next, promiseCtor) {
                    promiseCtor = getPromiseCtor(promiseCtor);
                    return new promiseCtor((resolve, reject) => {
                        let subscription;
                        subscription = this.subscribe((value) => {
                            try {
                                next(value);
                            }
                            catch (err) {
                                reject(err);
                                subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe();
                            }
                        }, reject, resolve);
                    });
                }
                _subscribe(subscriber) {
                    var _a;
                    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
                }
                [observable]() {
                    return this;
                }
                pipe(...operations) {
                    return pipeFromArray(operations)(this);
                }
                toPromise(promiseCtor) {
                    promiseCtor = getPromiseCtor(promiseCtor);
                    return new promiseCtor((resolve, reject) => {
                        let value;
                        this.subscribe((x) => (value = x), (err) => reject(err), () => resolve(value));
                    });
                }
            } exports('O', Observable);
            Observable.create = (subscribe) => {
                return new Observable(subscribe);
            };
            function getPromiseCtor(promiseCtor) {
                var _a;
                return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
            }
            function isObserver(value) {
                return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
            }
            function isSubscriber(value) {
                return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
            }

            function hasLift(source) {
                return isFunction(source === null || source === void 0 ? void 0 : source.lift);
            }
            function operate(init) {
                return (source) => {
                    if (hasLift(source)) {
                        return source.lift(function (liftedSource) {
                            try {
                                return init(liftedSource, this);
                            }
                            catch (err) {
                                this.error(err);
                            }
                        });
                    }
                    throw new TypeError('Unable to lift unknown Observable type');
                };
            }

            class OperatorSubscriber extends Subscriber {
                constructor(destination, onNext, onComplete, onError, onFinalize) {
                    super(destination);
                    this.onFinalize = onFinalize;
                    this._next = onNext
                        ? function (value) {
                            try {
                                onNext(value);
                            }
                            catch (err) {
                                destination.error(err);
                            }
                        }
                        : super._next;
                    this._error = onError
                        ? function (err) {
                            try {
                                onError(err);
                            }
                            catch (err) {
                                destination.error(err);
                            }
                            finally {
                                this.unsubscribe();
                            }
                        }
                        : super._error;
                    this._complete = onComplete
                        ? function () {
                            try {
                                onComplete();
                            }
                            catch (err) {
                                destination.error(err);
                            }
                            finally {
                                this.unsubscribe();
                            }
                        }
                        : super._complete;
                }
                unsubscribe() {
                    var _a;
                    const { closed } = this;
                    super.unsubscribe();
                    !closed && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
                }
            }

            function refCount() {
                return operate((source, subscriber) => {
                    let connection = null;
                    source._refCount++;
                    const refCounter = new OperatorSubscriber(subscriber, undefined, undefined, undefined, () => {
                        if (!source || source._refCount <= 0 || 0 < --source._refCount) {
                            connection = null;
                            return;
                        }
                        const sharedConnection = source._connection;
                        const conn = connection;
                        connection = null;
                        if (sharedConnection && (!conn || sharedConnection === conn)) {
                            sharedConnection.unsubscribe();
                        }
                        subscriber.unsubscribe();
                    });
                    source.subscribe(refCounter);
                    if (!refCounter.closed) {
                        connection = source.connect();
                    }
                });
            }

            class ConnectableObservable extends Observable {
                constructor(source, subjectFactory) {
                    super();
                    this.source = source;
                    this.subjectFactory = subjectFactory;
                    this._subject = null;
                    this._refCount = 0;
                    this._connection = null;
                    if (hasLift(source)) {
                        this.lift = source.lift;
                    }
                }
                _subscribe(subscriber) {
                    return this.getSubject().subscribe(subscriber);
                }
                getSubject() {
                    const subject = this._subject;
                    if (!subject || subject.isStopped) {
                        this._subject = this.subjectFactory();
                    }
                    return this._subject;
                }
                _teardown() {
                    this._refCount = 0;
                    const { _connection } = this;
                    this._subject = this._connection = null;
                    _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
                }
                connect() {
                    let connection = this._connection;
                    if (!connection) {
                        connection = this._connection = new Subscription();
                        const subject = this.getSubject();
                        connection.add(this.source.subscribe(new OperatorSubscriber(subject, undefined, () => {
                            this._teardown();
                            subject.complete();
                        }, (err) => {
                            this._teardown();
                            subject.error(err);
                        }, () => this._teardown())));
                        if (connection.closed) {
                            this._connection = null;
                            connection = Subscription.EMPTY;
                        }
                    }
                    return connection;
                }
                refCount() {
                    return refCount()(this);
                }
            } exports('h', ConnectableObservable);

            const performanceTimestampProvider = exports('p', {
                now() {
                    return (performanceTimestampProvider.delegate || performance).now();
                },
                delegate: undefined,
            });

            const animationFrameProvider = exports('d', {
                schedule(callback) {
                    let request = requestAnimationFrame;
                    let cancel = cancelAnimationFrame;
                    const { delegate } = animationFrameProvider;
                    if (delegate) {
                        request = delegate.requestAnimationFrame;
                        cancel = delegate.cancelAnimationFrame;
                    }
                    const handle = request((timestamp) => {
                        cancel = undefined;
                        callback(timestamp);
                    });
                    return new Subscription(() => cancel === null || cancel === void 0 ? void 0 : cancel(handle));
                },
                requestAnimationFrame(...args) {
                    const { delegate } = animationFrameProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame)(...args);
                },
                cancelAnimationFrame(...args) {
                    const { delegate } = animationFrameProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame)(...args);
                },
                delegate: undefined,
            });

            function animationFrames(timestampProvider) {
                return timestampProvider ? animationFramesFactory(timestampProvider) : DEFAULT_ANIMATION_FRAMES;
            }
            function animationFramesFactory(timestampProvider) {
                const { schedule } = animationFrameProvider;
                return new Observable(subscriber => {
                    const subscription = new Subscription();
                    const provider = timestampProvider || performanceTimestampProvider;
                    const start = provider.now();
                    const run = (timestamp) => {
                        const now = provider.now();
                        subscriber.next({
                            timestamp: timestampProvider ? now : timestamp,
                            elapsed: now - start
                        });
                        if (!subscriber.closed) {
                            subscription.add(schedule(run));
                        }
                    };
                    subscription.add(schedule(run));
                    return subscription;
                });
            }
            const DEFAULT_ANIMATION_FRAMES = animationFramesFactory();

            const ObjectUnsubscribedError = exports('M', createErrorClass((_super) => function ObjectUnsubscribedErrorImpl() {
                _super(this);
                this.name = 'ObjectUnsubscribedError';
                this.message = 'object unsubscribed';
            }));

            class Subject extends Observable {
                constructor() {
                    super();
                    this.closed = false;
                    this.observers = [];
                    this.isStopped = false;
                    this.hasError = false;
                    this.thrownError = null;
                }
                lift(operator) {
                    const subject = new AnonymousSubject(this, this);
                    subject.operator = operator;
                    return subject;
                }
                _throwIfClosed() {
                    if (this.closed) {
                        throw new ObjectUnsubscribedError();
                    }
                }
                next(value) {
                    errorContext(() => {
                        this._throwIfClosed();
                        if (!this.isStopped) {
                            const copy = this.observers.slice();
                            for (const observer of copy) {
                                observer.next(value);
                            }
                        }
                    });
                }
                error(err) {
                    errorContext(() => {
                        this._throwIfClosed();
                        if (!this.isStopped) {
                            this.hasError = this.isStopped = true;
                            this.thrownError = err;
                            const { observers } = this;
                            while (observers.length) {
                                observers.shift().error(err);
                            }
                        }
                    });
                }
                complete() {
                    errorContext(() => {
                        this._throwIfClosed();
                        if (!this.isStopped) {
                            this.isStopped = true;
                            const { observers } = this;
                            while (observers.length) {
                                observers.shift().complete();
                            }
                        }
                    });
                }
                unsubscribe() {
                    this.isStopped = this.closed = true;
                    this.observers = null;
                }
                get observed() {
                    var _a;
                    return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
                }
                _trySubscribe(subscriber) {
                    this._throwIfClosed();
                    return super._trySubscribe(subscriber);
                }
                _subscribe(subscriber) {
                    this._throwIfClosed();
                    this._checkFinalizedStatuses(subscriber);
                    return this._innerSubscribe(subscriber);
                }
                _innerSubscribe(subscriber) {
                    const { hasError, isStopped, observers } = this;
                    return hasError || isStopped
                        ? EMPTY_SUBSCRIPTION
                        : (observers.push(subscriber), new Subscription(() => arrRemove(observers, subscriber)));
                }
                _checkFinalizedStatuses(subscriber) {
                    const { hasError, thrownError, isStopped } = this;
                    if (hasError) {
                        subscriber.error(thrownError);
                    }
                    else if (isStopped) {
                        subscriber.complete();
                    }
                }
                asObservable() {
                    const observable = new Observable();
                    observable.source = this;
                    return observable;
                }
            } exports('b', Subject);
            Subject.create = (destination, source) => {
                return new AnonymousSubject(destination, source);
            };
            class AnonymousSubject extends Subject {
                constructor(destination, source) {
                    super();
                    this.destination = destination;
                    this.source = source;
                }
                next(value) {
                    var _a, _b;
                    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
                }
                error(err) {
                    var _a, _b;
                    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
                }
                complete() {
                    var _a, _b;
                    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
                }
                _subscribe(subscriber) {
                    var _a, _b;
                    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
                }
            }

            class BehaviorSubject extends Subject {
                constructor(_value) {
                    super();
                    this._value = _value;
                }
                get value() {
                    return this.getValue();
                }
                _subscribe(subscriber) {
                    const subscription = super._subscribe(subscriber);
                    !subscription.closed && subscriber.next(this._value);
                    return subscription;
                }
                getValue() {
                    const { hasError, thrownError, _value } = this;
                    if (hasError) {
                        throw thrownError;
                    }
                    this._throwIfClosed();
                    return _value;
                }
                next(value) {
                    super.next((this._value = value));
                }
            } exports('B', BehaviorSubject);

            const dateTimestampProvider = exports('f', {
                now() {
                    return (dateTimestampProvider.delegate || Date).now();
                },
                delegate: undefined,
            });

            class ReplaySubject extends Subject {
                constructor(_bufferSize = Infinity, _windowTime = Infinity, _timestampProvider = dateTimestampProvider) {
                    super();
                    this._bufferSize = _bufferSize;
                    this._windowTime = _windowTime;
                    this._timestampProvider = _timestampProvider;
                    this._buffer = [];
                    this._infiniteTimeWindow = true;
                    this._infiniteTimeWindow = _windowTime === Infinity;
                    this._bufferSize = Math.max(1, _bufferSize);
                    this._windowTime = Math.max(1, _windowTime);
                }
                next(value) {
                    const { isStopped, _buffer, _infiniteTimeWindow, _timestampProvider, _windowTime } = this;
                    if (!isStopped) {
                        _buffer.push(value);
                        !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
                    }
                    this._trimBuffer();
                    super.next(value);
                }
                _subscribe(subscriber) {
                    this._throwIfClosed();
                    this._trimBuffer();
                    const subscription = this._innerSubscribe(subscriber);
                    const { _infiniteTimeWindow, _buffer } = this;
                    const copy = _buffer.slice();
                    for (let i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
                        subscriber.next(copy[i]);
                    }
                    this._checkFinalizedStatuses(subscriber);
                    return subscription;
                }
                _trimBuffer() {
                    const { _bufferSize, _timestampProvider, _buffer, _infiniteTimeWindow } = this;
                    const adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
                    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
                    if (!_infiniteTimeWindow) {
                        const now = _timestampProvider.now();
                        let last = 0;
                        for (let i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
                            last = i;
                        }
                        last && _buffer.splice(0, last + 1);
                    }
                }
            } exports('R', ReplaySubject);

            class AsyncSubject extends Subject {
                constructor() {
                    super(...arguments);
                    this._value = null;
                    this._hasValue = false;
                    this._isComplete = false;
                }
                _checkFinalizedStatuses(subscriber) {
                    const { hasError, _hasValue, _value, thrownError, isStopped, _isComplete } = this;
                    if (hasError) {
                        subscriber.error(thrownError);
                    }
                    else if (isStopped || _isComplete) {
                        _hasValue && subscriber.next(_value);
                        subscriber.complete();
                    }
                }
                next(value) {
                    if (!this.isStopped) {
                        this._value = value;
                        this._hasValue = true;
                    }
                }
                complete() {
                    const { _hasValue, _value, _isComplete } = this;
                    if (!_isComplete) {
                        this._isComplete = true;
                        _hasValue && super.next(_value);
                        super.complete();
                    }
                }
            } exports('A', AsyncSubject);

            class Action extends Subscription {
                constructor(scheduler, work) {
                    super();
                }
                schedule(state, delay = 0) {
                    return this;
                }
            }

            const intervalProvider = exports('g', {
                setInterval(...args) {
                    const { delegate } = intervalProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) || setInterval)(...args);
                },
                clearInterval(handle) {
                    const { delegate } = intervalProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
                },
                delegate: undefined,
            });

            class AsyncAction extends Action {
                constructor(scheduler, work) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                    this.pending = false;
                }
                schedule(state, delay = 0) {
                    if (this.closed) {
                        return this;
                    }
                    this.state = state;
                    const id = this.id;
                    const scheduler = this.scheduler;
                    if (id != null) {
                        this.id = this.recycleAsyncId(scheduler, id, delay);
                    }
                    this.pending = true;
                    this.delay = delay;
                    this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
                    return this;
                }
                requestAsyncId(scheduler, _id, delay = 0) {
                    return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
                }
                recycleAsyncId(_scheduler, id, delay = 0) {
                    if (delay != null && this.delay === delay && this.pending === false) {
                        return id;
                    }
                    intervalProvider.clearInterval(id);
                    return undefined;
                }
                execute(state, delay) {
                    if (this.closed) {
                        return new Error('executing a cancelled action');
                    }
                    this.pending = false;
                    const error = this._execute(state, delay);
                    if (error) {
                        return error;
                    }
                    else if (this.pending === false && this.id != null) {
                        this.id = this.recycleAsyncId(this.scheduler, this.id, null);
                    }
                }
                _execute(state, _delay) {
                    let errored = false;
                    let errorValue;
                    try {
                        this.work(state);
                    }
                    catch (e) {
                        errored = true;
                        errorValue = e ? e : new Error('Scheduled action threw falsy error');
                    }
                    if (errored) {
                        this.unsubscribe();
                        return errorValue;
                    }
                }
                unsubscribe() {
                    if (!this.closed) {
                        const { id, scheduler } = this;
                        const { actions } = scheduler;
                        this.work = this.state = this.scheduler = null;
                        this.pending = false;
                        arrRemove(actions, this);
                        if (id != null) {
                            this.id = this.recycleAsyncId(scheduler, id, null);
                        }
                        this.delay = null;
                        super.unsubscribe();
                    }
                }
            }

            let nextHandle = 1;
            let resolved;
            const activeHandles = {};
            function findAndClearHandle(handle) {
                if (handle in activeHandles) {
                    delete activeHandles[handle];
                    return true;
                }
                return false;
            }
            const Immediate = {
                setImmediate(cb) {
                    const handle = nextHandle++;
                    activeHandles[handle] = true;
                    if (!resolved) {
                        resolved = Promise.resolve();
                    }
                    resolved.then(() => findAndClearHandle(handle) && cb());
                    return handle;
                },
                clearImmediate(handle) {
                    findAndClearHandle(handle);
                },
            };

            const { setImmediate, clearImmediate } = Immediate;
            const immediateProvider = exports('i', {
                setImmediate(...args) {
                    const { delegate } = immediateProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate)(...args);
                },
                clearImmediate(handle) {
                    const { delegate } = immediateProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
                },
                delegate: undefined,
            });

            class AsapAction extends AsyncAction {
                constructor(scheduler, work) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                }
                requestAsyncId(scheduler, id, delay = 0) {
                    if (delay !== null && delay > 0) {
                        return super.requestAsyncId(scheduler, id, delay);
                    }
                    scheduler.actions.push(this);
                    return scheduler._scheduled || (scheduler._scheduled = immediateProvider.setImmediate(scheduler.flush.bind(scheduler, undefined)));
                }
                recycleAsyncId(scheduler, id, delay = 0) {
                    if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
                        return super.recycleAsyncId(scheduler, id, delay);
                    }
                    if (scheduler.actions.length === 0) {
                        immediateProvider.clearImmediate(id);
                        scheduler._scheduled = undefined;
                    }
                    return undefined;
                }
            }

            class Scheduler {
                constructor(schedulerActionCtor, now = Scheduler.now) {
                    this.schedulerActionCtor = schedulerActionCtor;
                    this.now = now;
                }
                schedule(work, delay = 0, state) {
                    return new this.schedulerActionCtor(this, work).schedule(state, delay);
                }
            } exports('x', Scheduler);
            Scheduler.now = dateTimestampProvider.now;

            class AsyncScheduler extends Scheduler {
                constructor(SchedulerAction, now = Scheduler.now) {
                    super(SchedulerAction, now);
                    this.actions = [];
                    this._active = false;
                    this._scheduled = undefined;
                }
                flush(action) {
                    const { actions } = this;
                    if (this._active) {
                        actions.push(action);
                        return;
                    }
                    let error;
                    this._active = true;
                    do {
                        if ((error = action.execute(action.state, action.delay))) {
                            break;
                        }
                    } while ((action = actions.shift()));
                    this._active = false;
                    if (error) {
                        while ((action = actions.shift())) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                }
            }

            class AsapScheduler extends AsyncScheduler {
                flush(action) {
                    this._active = true;
                    this._scheduled = undefined;
                    const { actions } = this;
                    let error;
                    let index = -1;
                    action = action || actions.shift();
                    const count = actions.length;
                    do {
                        if ((error = action.execute(action.state, action.delay))) {
                            break;
                        }
                    } while (++index < count && (action = actions.shift()));
                    this._active = false;
                    if (error) {
                        while (++index < count && (action = actions.shift())) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                }
            }

            const asapScheduler = exports('m', new AsapScheduler(AsapAction));
            const asap = exports('l', asapScheduler);

            const asyncScheduler = exports('r', new AsyncScheduler(AsyncAction));
            const async = exports('q', asyncScheduler);

            class QueueAction extends AsyncAction {
                constructor(scheduler, work) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                }
                schedule(state, delay = 0) {
                    if (delay > 0) {
                        return super.schedule(state, delay);
                    }
                    this.delay = delay;
                    this.state = state;
                    this.scheduler.flush(this);
                    return this;
                }
                execute(state, delay) {
                    return (delay > 0 || this.closed) ?
                        super.execute(state, delay) :
                        this._execute(state, delay);
                }
                requestAsyncId(scheduler, id, delay = 0) {
                    if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
                        return super.requestAsyncId(scheduler, id, delay);
                    }
                    return scheduler.flush(this);
                }
            }

            class QueueScheduler extends AsyncScheduler {
            }

            const queueScheduler = exports('u', new QueueScheduler(QueueAction));
            const queue = exports('s', queueScheduler);

            class AnimationFrameAction extends AsyncAction {
                constructor(scheduler, work) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                }
                requestAsyncId(scheduler, id, delay = 0) {
                    if (delay !== null && delay > 0) {
                        return super.requestAsyncId(scheduler, id, delay);
                    }
                    scheduler.actions.push(this);
                    return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider.requestAnimationFrame(() => scheduler.flush(undefined)));
                }
                recycleAsyncId(scheduler, id, delay = 0) {
                    if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
                        return super.recycleAsyncId(scheduler, id, delay);
                    }
                    if (scheduler.actions.length === 0) {
                        animationFrameProvider.cancelAnimationFrame(id);
                        scheduler._scheduled = undefined;
                    }
                    return undefined;
                }
            }

            class AnimationFrameScheduler extends AsyncScheduler {
                flush(action) {
                    this._active = true;
                    this._scheduled = undefined;
                    const { actions } = this;
                    let error;
                    let index = -1;
                    action = action || actions.shift();
                    const count = actions.length;
                    do {
                        if ((error = action.execute(action.state, action.delay))) {
                            break;
                        }
                    } while (++index < count && (action = actions.shift()));
                    this._active = false;
                    if (error) {
                        while (++index < count && (action = actions.shift())) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                }
            }

            const animationFrameScheduler = exports('w', new AnimationFrameScheduler(AnimationFrameAction));
            const animationFrame = exports('v', animationFrameScheduler);

            class VirtualTimeScheduler extends AsyncScheduler {
                constructor(schedulerActionCtor = VirtualAction, maxFrames = Infinity) {
                    super(schedulerActionCtor, () => this.frame);
                    this.maxFrames = maxFrames;
                    this.frame = 0;
                    this.index = -1;
                }
                flush() {
                    const { actions, maxFrames } = this;
                    let error;
                    let action;
                    while ((action = actions[0]) && action.delay <= maxFrames) {
                        actions.shift();
                        this.frame = action.delay;
                        if ((error = action.execute(action.state, action.delay))) {
                            break;
                        }
                    }
                    if (error) {
                        while ((action = actions.shift())) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                }
            } exports('V', VirtualTimeScheduler);
            VirtualTimeScheduler.frameTimeFactor = 10;
            class VirtualAction extends AsyncAction {
                constructor(scheduler, work, index = (scheduler.index += 1)) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                    this.index = index;
                    this.active = true;
                    this.index = scheduler.index = index;
                }
                schedule(state, delay = 0) {
                    if (Number.isFinite(delay)) {
                        if (!this.id) {
                            return super.schedule(state, delay);
                        }
                        this.active = false;
                        const action = new VirtualAction(this.scheduler, this.work);
                        this.add(action);
                        return action.schedule(state, delay);
                    }
                    else {
                        return Subscription.EMPTY;
                    }
                }
                requestAsyncId(scheduler, id, delay = 0) {
                    this.delay = scheduler.frame + delay;
                    const { actions } = scheduler;
                    actions.push(this);
                    actions.sort(VirtualAction.sortActions);
                    return true;
                }
                recycleAsyncId(scheduler, id, delay = 0) {
                    return undefined;
                }
                _execute(state, delay) {
                    if (this.active === true) {
                        return super._execute(state, delay);
                    }
                }
                static sortActions(a, b) {
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
                }
            } exports('c', VirtualAction);

            const EMPTY = exports('ak', new Observable((subscriber) => subscriber.complete()));
            function empty(scheduler) {
                return scheduler ? emptyScheduled(scheduler) : EMPTY;
            }
            function emptyScheduled(scheduler) {
                return new Observable((subscriber) => scheduler.schedule(() => subscriber.complete()));
            }

            function isScheduler(value) {
                return value && isFunction(value.schedule);
            }

            function last$1(arr) {
                return arr[arr.length - 1];
            }
            function popResultSelector(args) {
                return isFunction(last$1(args)) ? args.pop() : undefined;
            }
            function popScheduler(args) {
                return isScheduler(last$1(args)) ? args.pop() : undefined;
            }
            function popNumber(args, defaultValue) {
                return typeof last$1(args) === 'number' ? args.pop() : defaultValue;
            }

            /*! *****************************************************************************
            Copyright (c) Microsoft Corporation.

            Permission to use, copy, modify, and/or distribute this software for any
            purpose with or without fee is hereby granted.

            THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
            REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
            AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
            INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
            LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
            OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
            PERFORMANCE OF THIS SOFTWARE.
            ***************************************************************************** */

            function __rest(s, e) {
                var t = {};
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                    t[p] = s[p];
                if (s != null && typeof Object.getOwnPropertySymbols === "function")
                    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                            t[p[i]] = s[p[i]];
                    }
                return t;
            }

            function __awaiter(thisArg, _arguments, P, generator) {
                function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            }

            function __values(o) {
                var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
                if (m) return m.call(o);
                if (o && typeof o.length === "number") return {
                    next: function () {
                        if (o && i >= o.length) o = void 0;
                        return { value: o && o[i++], done: !o };
                    }
                };
                throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
            }

            function __await(v) {
                return this instanceof __await ? (this.v = v, this) : new __await(v);
            }

            function __asyncGenerator(thisArg, _arguments, generator) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var g = generator.apply(thisArg, _arguments || []), i, q = [];
                return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
                function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
                function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
                function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
                function fulfill(value) { resume("next", value); }
                function reject(value) { resume("throw", value); }
                function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
            }

            function __asyncValues(o) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var m = o[Symbol.asyncIterator], i;
                return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
                function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
                function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
            }

            const isArrayLike = ((x) => x && typeof x.length === 'number' && typeof x !== 'function');

            function isPromise(value) {
                return isFunction(value === null || value === void 0 ? void 0 : value.then);
            }

            function isInteropObservable(input) {
                return isFunction(input[observable]);
            }

            function isAsyncIterable(obj) {
                return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
            }

            function createInvalidObservableTypeError(input) {
                return new TypeError(`You provided ${input !== null && typeof input === 'object' ? 'an invalid object' : `'${input}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
            }

            function getSymbolIterator() {
                if (typeof Symbol !== 'function' || !Symbol.iterator) {
                    return '@@iterator';
                }
                return Symbol.iterator;
            }
            const iterator = getSymbolIterator();

            function isIterable(input) {
                return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
            }

            function readableStreamLikeToAsyncGenerator(readableStream) {
                return __asyncGenerator(this, arguments, function* readableStreamLikeToAsyncGenerator_1() {
                    const reader = readableStream.getReader();
                    try {
                        while (true) {
                            const { value, done } = yield __await(reader.read());
                            if (done) {
                                return yield __await(void 0);
                            }
                            yield yield __await(value);
                        }
                    }
                    finally {
                        reader.releaseLock();
                    }
                });
            }
            function isReadableStreamLike(obj) {
                return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
            }

            function innerFrom(input) {
                if (input instanceof Observable) {
                    return input;
                }
                if (input != null) {
                    if (isInteropObservable(input)) {
                        return fromInteropObservable(input);
                    }
                    if (isArrayLike(input)) {
                        return fromArrayLike(input);
                    }
                    if (isPromise(input)) {
                        return fromPromise(input);
                    }
                    if (isAsyncIterable(input)) {
                        return fromAsyncIterable(input);
                    }
                    if (isIterable(input)) {
                        return fromIterable(input);
                    }
                    if (isReadableStreamLike(input)) {
                        return fromReadableStreamLike(input);
                    }
                }
                throw createInvalidObservableTypeError(input);
            }
            function fromInteropObservable(obj) {
                return new Observable((subscriber) => {
                    const obs = obj[observable]();
                    if (isFunction(obs.subscribe)) {
                        return obs.subscribe(subscriber);
                    }
                    throw new TypeError('Provided object does not correctly implement Symbol.observable');
                });
            }
            function fromArrayLike(array) {
                return new Observable((subscriber) => {
                    for (let i = 0; i < array.length && !subscriber.closed; i++) {
                        subscriber.next(array[i]);
                    }
                    subscriber.complete();
                });
            }
            function fromPromise(promise) {
                return new Observable((subscriber) => {
                    promise
                        .then((value) => {
                        if (!subscriber.closed) {
                            subscriber.next(value);
                            subscriber.complete();
                        }
                    }, (err) => subscriber.error(err))
                        .then(null, reportUnhandledError);
                });
            }
            function fromIterable(iterable) {
                return new Observable((subscriber) => {
                    for (const value of iterable) {
                        subscriber.next(value);
                        if (subscriber.closed) {
                            return;
                        }
                    }
                    subscriber.complete();
                });
            }
            function fromAsyncIterable(asyncIterable) {
                return new Observable((subscriber) => {
                    process(asyncIterable, subscriber).catch((err) => subscriber.error(err));
                });
            }
            function fromReadableStreamLike(readableStream) {
                return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
            }
            function process(asyncIterable, subscriber) {
                var asyncIterable_1, asyncIterable_1_1;
                var e_1, _a;
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        for (asyncIterable_1 = __asyncValues(asyncIterable); asyncIterable_1_1 = yield asyncIterable_1.next(), !asyncIterable_1_1.done;) {
                            const value = asyncIterable_1_1.value;
                            subscriber.next(value);
                            if (subscriber.closed) {
                                return;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return)) yield _a.call(asyncIterable_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    subscriber.complete();
                });
            }

            function executeSchedule(parentSubscription, scheduler, work, delay = 0, repeat = false) {
                const scheduleSubscription = scheduler.schedule(function () {
                    work();
                    if (repeat) {
                        parentSubscription.add(this.schedule(null, delay));
                    }
                    else {
                        this.unsubscribe();
                    }
                }, delay);
                parentSubscription.add(scheduleSubscription);
                if (!repeat) {
                    return scheduleSubscription;
                }
            }

            function observeOn(scheduler, delay = 0) {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => executeSchedule(subscriber, scheduler, () => subscriber.next(value), delay), () => executeSchedule(subscriber, scheduler, () => subscriber.complete(), delay), (err) => executeSchedule(subscriber, scheduler, () => subscriber.error(err), delay)));
                });
            }

            function subscribeOn(scheduler, delay = 0) {
                return operate((source, subscriber) => {
                    subscriber.add(scheduler.schedule(() => source.subscribe(subscriber), delay));
                });
            }

            function scheduleObservable(input, scheduler) {
                return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
            }

            function schedulePromise(input, scheduler) {
                return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
            }

            function scheduleArray(input, scheduler) {
                return new Observable((subscriber) => {
                    let i = 0;
                    return scheduler.schedule(function () {
                        if (i === input.length) {
                            subscriber.complete();
                        }
                        else {
                            subscriber.next(input[i++]);
                            if (!subscriber.closed) {
                                this.schedule();
                            }
                        }
                    });
                });
            }

            function scheduleIterable(input, scheduler) {
                return new Observable((subscriber) => {
                    let iterator$1;
                    executeSchedule(subscriber, scheduler, () => {
                        iterator$1 = input[iterator]();
                        executeSchedule(subscriber, scheduler, () => {
                            let value;
                            let done;
                            try {
                                ({ value, done } = iterator$1.next());
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
                            }
                        }, 0, true);
                    });
                    return () => isFunction(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) && iterator$1.return();
                });
            }

            function scheduleAsyncIterable(input, scheduler) {
                if (!input) {
                    throw new Error('Iterable cannot be null');
                }
                return new Observable((subscriber) => {
                    executeSchedule(subscriber, scheduler, () => {
                        const iterator = input[Symbol.asyncIterator]();
                        executeSchedule(subscriber, scheduler, () => {
                            iterator.next().then((result) => {
                                if (result.done) {
                                    subscriber.complete();
                                }
                                else {
                                    subscriber.next(result.value);
                                }
                            });
                        }, 0, true);
                    });
                });
            }

            function scheduleReadableStreamLike(input, scheduler) {
                return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
            }

            function scheduled(input, scheduler) {
                if (input != null) {
                    if (isInteropObservable(input)) {
                        return scheduleObservable(input, scheduler);
                    }
                    if (isArrayLike(input)) {
                        return scheduleArray(input, scheduler);
                    }
                    if (isPromise(input)) {
                        return schedulePromise(input, scheduler);
                    }
                    if (isAsyncIterable(input)) {
                        return scheduleAsyncIterable(input, scheduler);
                    }
                    if (isIterable(input)) {
                        return scheduleIterable(input, scheduler);
                    }
                    if (isReadableStreamLike(input)) {
                        return scheduleReadableStreamLike(input, scheduler);
                    }
                }
                throw createInvalidObservableTypeError(input);
            }

            function from(input, scheduler) {
                return scheduler ? scheduled(input, scheduler) : innerFrom(input);
            }

            function of(...args) {
                const scheduler = popScheduler(args);
                return from(args, scheduler);
            }

            function throwError(errorOrErrorFactory, scheduler) {
                const errorFactory = isFunction(errorOrErrorFactory) ? errorOrErrorFactory : () => errorOrErrorFactory;
                const init = (subscriber) => subscriber.error(errorFactory());
                return new Observable(scheduler ? (subscriber) => scheduler.schedule(init, 0, subscriber) : init);
            }

            var NotificationKind; exports('z', NotificationKind);
            (function (NotificationKind) {
                NotificationKind["NEXT"] = "N";
                NotificationKind["ERROR"] = "E";
                NotificationKind["COMPLETE"] = "C";
            })(NotificationKind || (exports('z', NotificationKind = {})));
            class Notification {
                constructor(kind, value, error) {
                    this.kind = kind;
                    this.value = value;
                    this.error = error;
                    this.hasValue = kind === 'N';
                }
                observe(observer) {
                    return observeNotification(this, observer);
                }
                do(nextHandler, errorHandler, completeHandler) {
                    const { kind, value, error } = this;
                    return kind === 'N' ? nextHandler === null || nextHandler === void 0 ? void 0 : nextHandler(value) : kind === 'E' ? errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler(error) : completeHandler === null || completeHandler === void 0 ? void 0 : completeHandler();
                }
                accept(nextOrObserver, error, complete) {
                    var _a;
                    return isFunction((_a = nextOrObserver) === null || _a === void 0 ? void 0 : _a.next)
                        ? this.observe(nextOrObserver)
                        : this.do(nextOrObserver, error, complete);
                }
                toObservable() {
                    const { kind, value, error } = this;
                    const result = kind === 'N'
                        ?
                            of(value)
                        :
                            kind === 'E'
                                ?
                                    throwError(() => error)
                                :
                                    kind === 'C'
                                        ?
                                            EMPTY
                                        :
                                            0;
                    if (!result) {
                        throw new TypeError(`Unexpected notification kind ${kind}`);
                    }
                    return result;
                }
                static createNext(value) {
                    return new Notification('N', value);
                }
                static createError(err) {
                    return new Notification('E', undefined, err);
                }
                static createComplete() {
                    return Notification.completeNotification;
                }
            } exports('N', Notification);
            Notification.completeNotification = new Notification('C');
            function observeNotification(notification, observer) {
                var _a, _b, _c;
                const { kind, value, error } = notification;
                if (typeof kind !== 'string') {
                    throw new TypeError('Invalid notification, missing "kind"');
                }
                kind === 'N' ? (_a = observer.next) === null || _a === void 0 ? void 0 : _a.call(observer, value) : kind === 'E' ? (_b = observer.error) === null || _b === void 0 ? void 0 : _b.call(observer, error) : (_c = observer.complete) === null || _c === void 0 ? void 0 : _c.call(observer);
            }

            function isObservable(obj) {
                return !!obj && (obj instanceof Observable || (isFunction(obj.lift) && isFunction(obj.subscribe)));
            }

            const EmptyError = exports('K', createErrorClass((_super) => function EmptyErrorImpl() {
                _super(this);
                this.name = 'EmptyError';
                this.message = 'no elements in sequence';
            }));

            function lastValueFrom(source, config) {
                const hasConfig = typeof config === 'object';
                return new Promise((resolve, reject) => {
                    let _hasValue = false;
                    let _value;
                    source.subscribe({
                        next: (value) => {
                            _value = value;
                            _hasValue = true;
                        },
                        error: reject,
                        complete: () => {
                            if (_hasValue) {
                                resolve(_value);
                            }
                            else if (hasConfig) {
                                resolve(config.defaultValue);
                            }
                            else {
                                reject(new EmptyError());
                            }
                        },
                    });
                });
            }

            function firstValueFrom(source, config) {
                const hasConfig = typeof config === 'object';
                return new Promise((resolve, reject) => {
                    const subscriber = new SafeSubscriber({
                        next: (value) => {
                            resolve(value);
                            subscriber.unsubscribe();
                        },
                        error: reject,
                        complete: () => {
                            if (hasConfig) {
                                resolve(config.defaultValue);
                            }
                            else {
                                reject(new EmptyError());
                            }
                        },
                    });
                    source.subscribe(subscriber);
                });
            }

            const ArgumentOutOfRangeError = exports('J', createErrorClass((_super) => function ArgumentOutOfRangeErrorImpl() {
                _super(this);
                this.name = 'ArgumentOutOfRangeError';
                this.message = 'argument out of range';
            }));

            const NotFoundError = exports('L', createErrorClass((_super) => function NotFoundErrorImpl(message) {
                _super(this);
                this.name = 'NotFoundError';
                this.message = message;
            }));

            const SequenceError = exports('P', createErrorClass((_super) => function SequenceErrorImpl(message) {
                _super(this);
                this.name = 'SequenceError';
                this.message = message;
            }));

            function isValidDate(value) {
                return value instanceof Date && !isNaN(value);
            }

            const TimeoutError = exports('T', createErrorClass((_super) => function TimeoutErrorImpl(info = null) {
                _super(this);
                this.message = 'Timeout has occurred';
                this.name = 'TimeoutError';
                this.info = info;
            }));
            function timeout(config, schedulerArg) {
                const { first, each, with: _with = timeoutErrorFactory, scheduler = schedulerArg !== null && schedulerArg !== void 0 ? schedulerArg : asyncScheduler, meta = null } = (isValidDate(config)
                    ? { first: config }
                    : typeof config === 'number'
                        ? { each: config }
                        : config);
                if (first == null && each == null) {
                    throw new TypeError('No timeout provided.');
                }
                return operate((source, subscriber) => {
                    let originalSourceSubscription;
                    let timerSubscription;
                    let lastValue = null;
                    let seen = 0;
                    const startTimer = (delay) => {
                        timerSubscription = executeSchedule(subscriber, scheduler, () => {
                            try {
                                originalSourceSubscription.unsubscribe();
                                innerFrom(_with({
                                    meta,
                                    lastValue,
                                    seen,
                                })).subscribe(subscriber);
                            }
                            catch (err) {
                                subscriber.error(err);
                            }
                        }, delay);
                    };
                    originalSourceSubscription = source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
                        seen++;
                        subscriber.next((lastValue = value));
                        each > 0 && startTimer(each);
                    }, undefined, undefined, () => {
                        if (!(timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.closed)) {
                            timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
                        }
                        lastValue = null;
                    }));
                    startTimer(first != null ? (typeof first === 'number' ? first : +first - scheduler.now()) : each);
                });
            }
            function timeoutErrorFactory(info) {
                throw new TimeoutError(info);
            }

            function map(project, thisArg) {
                return operate((source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        subscriber.next(project.call(thisArg, value, index++));
                    }));
                });
            }

            const { isArray: isArray$2 } = Array;
            function callOrApply(fn, args) {
                return isArray$2(args) ? fn(...args) : fn(args);
            }
            function mapOneOrManyArgs(fn) {
                return map(args => callOrApply(fn, args));
            }

            function bindCallbackInternals(isNodeStyle, callbackFunc, resultSelector, scheduler) {
                if (resultSelector) {
                    if (isScheduler(resultSelector)) {
                        scheduler = resultSelector;
                    }
                    else {
                        return function (...args) {
                            return bindCallbackInternals(isNodeStyle, callbackFunc, scheduler)
                                .apply(this, args)
                                .pipe(mapOneOrManyArgs(resultSelector));
                        };
                    }
                }
                if (scheduler) {
                    return function (...args) {
                        return bindCallbackInternals(isNodeStyle, callbackFunc)
                            .apply(this, args)
                            .pipe(subscribeOn(scheduler), observeOn(scheduler));
                    };
                }
                return function (...args) {
                    const subject = new AsyncSubject();
                    let uninitialized = true;
                    return new Observable((subscriber) => {
                        const subs = subject.subscribe(subscriber);
                        if (uninitialized) {
                            uninitialized = false;
                            let isAsync = false;
                            let isComplete = false;
                            callbackFunc.apply(this, [
                                ...args,
                                (...results) => {
                                    if (isNodeStyle) {
                                        const err = results.shift();
                                        if (err != null) {
                                            subject.error(err);
                                            return;
                                        }
                                    }
                                    subject.next(1 < results.length ? results : results[0]);
                                    isComplete = true;
                                    if (isAsync) {
                                        subject.complete();
                                    }
                                },
                            ]);
                            if (isComplete) {
                                subject.complete();
                            }
                            isAsync = true;
                        }
                        return subs;
                    });
                };
            }

            function bindCallback(callbackFunc, resultSelector, scheduler) {
                return bindCallbackInternals(false, callbackFunc, resultSelector, scheduler);
            }

            function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
                return bindCallbackInternals(true, callbackFunc, resultSelector, scheduler);
            }

            const { isArray: isArray$1 } = Array;
            const { getPrototypeOf, prototype: objectProto, keys: getKeys } = Object;
            function argsArgArrayOrObject(args) {
                if (args.length === 1) {
                    const first = args[0];
                    if (isArray$1(first)) {
                        return { args: first, keys: null };
                    }
                    if (isPOJO(first)) {
                        const keys = getKeys(first);
                        return {
                            args: keys.map((key) => first[key]),
                            keys,
                        };
                    }
                }
                return { args: args, keys: null };
            }
            function isPOJO(obj) {
                return obj && typeof obj === 'object' && getPrototypeOf(obj) === objectProto;
            }

            function createObject(keys, values) {
                return keys.reduce((result, key, i) => ((result[key] = values[i]), result), {});
            }

            function combineLatest$1(...args) {
                const scheduler = popScheduler(args);
                const resultSelector = popResultSelector(args);
                const { args: observables, keys } = argsArgArrayOrObject(args);
                if (observables.length === 0) {
                    return from([], scheduler);
                }
                const result = new Observable(combineLatestInit(observables, scheduler, keys
                    ?
                        (values) => createObject(keys, values)
                    :
                        identity));
                return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
            }
            function combineLatestInit(observables, scheduler, valueTransform = identity) {
                return (subscriber) => {
                    maybeSchedule(scheduler, () => {
                        const { length } = observables;
                        const values = new Array(length);
                        let active = length;
                        let remainingFirstValues = length;
                        for (let i = 0; i < length; i++) {
                            maybeSchedule(scheduler, () => {
                                const source = from(observables[i], scheduler);
                                let hasFirstValue = false;
                                source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                                    values[i] = value;
                                    if (!hasFirstValue) {
                                        hasFirstValue = true;
                                        remainingFirstValues--;
                                    }
                                    if (!remainingFirstValues) {
                                        subscriber.next(valueTransform(values.slice()));
                                    }
                                }, () => {
                                    if (!--active) {
                                        subscriber.complete();
                                    }
                                }));
                            }, subscriber);
                        }
                    }, subscriber);
                };
            }
            function maybeSchedule(scheduler, execute, subscription) {
                if (scheduler) {
                    executeSchedule(subscription, scheduler, execute);
                }
                else {
                    execute();
                }
            }

            function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalTeardown) {
                const buffer = [];
                let active = 0;
                let index = 0;
                let isComplete = false;
                const checkComplete = () => {
                    if (isComplete && !buffer.length && !active) {
                        subscriber.complete();
                    }
                };
                const outerNext = (value) => (active < concurrent ? doInnerSub(value) : buffer.push(value));
                const doInnerSub = (value) => {
                    expand && subscriber.next(value);
                    active++;
                    let innerComplete = false;
                    innerFrom(project(value, index++)).subscribe(new OperatorSubscriber(subscriber, (innerValue) => {
                        onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
                        if (expand) {
                            outerNext(innerValue);
                        }
                        else {
                            subscriber.next(innerValue);
                        }
                    }, () => {
                        innerComplete = true;
                    }, undefined, () => {
                        if (innerComplete) {
                            try {
                                active--;
                                while (buffer.length && active < concurrent) {
                                    const bufferedValue = buffer.shift();
                                    if (innerSubScheduler) {
                                        executeSchedule(subscriber, innerSubScheduler, () => doInnerSub(bufferedValue));
                                    }
                                    else {
                                        doInnerSub(bufferedValue);
                                    }
                                }
                                checkComplete();
                            }
                            catch (err) {
                                subscriber.error(err);
                            }
                        }
                    }));
                };
                source.subscribe(new OperatorSubscriber(subscriber, outerNext, () => {
                    isComplete = true;
                    checkComplete();
                }));
                return () => {
                    additionalTeardown === null || additionalTeardown === void 0 ? void 0 : additionalTeardown();
                };
            }

            function mergeMap(project, resultSelector, concurrent = Infinity) {
                if (isFunction(resultSelector)) {
                    return mergeMap((a, i) => map((b, ii) => resultSelector(a, b, i, ii))(innerFrom(project(a, i))), concurrent);
                }
                else if (typeof resultSelector === 'number') {
                    concurrent = resultSelector;
                }
                return operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent));
            }

            function mergeAll(concurrent = Infinity) {
                return mergeMap(identity, concurrent);
            }

            function concatAll() {
                return mergeAll(1);
            }

            function concat$1(...args) {
                return concatAll()(from(args, popScheduler(args)));
            }

            function defer(observableFactory) {
                return new Observable((subscriber) => {
                    innerFrom(observableFactory()).subscribe(subscriber);
                });
            }

            const DEFAULT_CONFIG$1 = {
                connector: () => new Subject(),
                resetOnDisconnect: true,
            };
            function connectable(source, config = DEFAULT_CONFIG$1) {
                let connection = null;
                const { connector, resetOnDisconnect = true } = config;
                let subject = connector();
                const result = new Observable((subscriber) => {
                    return subject.subscribe(subscriber);
                });
                result.connect = () => {
                    if (!connection || connection.closed) {
                        connection = defer(() => source).subscribe(subject);
                        if (resetOnDisconnect) {
                            connection.add(() => (subject = connector()));
                        }
                    }
                    return connection;
                };
                return result;
            }

            function forkJoin(...args) {
                const resultSelector = popResultSelector(args);
                const { args: sources, keys } = argsArgArrayOrObject(args);
                const result = new Observable((subscriber) => {
                    const { length } = sources;
                    if (!length) {
                        subscriber.complete();
                        return;
                    }
                    const values = new Array(length);
                    let remainingCompletions = length;
                    let remainingEmissions = length;
                    for (let sourceIndex = 0; sourceIndex < length; sourceIndex++) {
                        let hasValue = false;
                        innerFrom(sources[sourceIndex]).subscribe(new OperatorSubscriber(subscriber, (value) => {
                            if (!hasValue) {
                                hasValue = true;
                                remainingEmissions--;
                            }
                            values[sourceIndex] = value;
                        }, () => remainingCompletions--, undefined, () => {
                            if (!remainingCompletions || !hasValue) {
                                if (!remainingEmissions) {
                                    subscriber.next(keys ? createObject(keys, values) : values);
                                }
                                subscriber.complete();
                            }
                        }));
                    }
                });
                return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
            }

            const nodeEventEmitterMethods = ['addListener', 'removeListener'];
            const eventTargetMethods = ['addEventListener', 'removeEventListener'];
            const jqueryMethods = ['on', 'off'];
            function fromEvent(target, eventName, options, resultSelector) {
                if (isFunction(options)) {
                    resultSelector = options;
                    options = undefined;
                }
                if (resultSelector) {
                    return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
                }
                const [add, remove] = isEventTarget(target)
                    ? eventTargetMethods.map((methodName) => (handler) => target[methodName](eventName, handler, options))
                    :
                        isNodeStyleEventEmitter(target)
                            ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName))
                            : isJQueryStyleEventEmitter(target)
                                ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName))
                                : [];
                if (!add) {
                    if (isArrayLike(target)) {
                        return mergeMap((subTarget) => fromEvent(subTarget, eventName, options))(innerFrom(target));
                    }
                }
                if (!add) {
                    throw new TypeError('Invalid event target');
                }
                return new Observable((subscriber) => {
                    const handler = (...args) => subscriber.next(1 < args.length ? args : args[0]);
                    add(handler);
                    return () => remove(handler);
                });
            }
            function toCommonHandlerRegistry(target, eventName) {
                return (methodName) => (handler) => target[methodName](eventName, handler);
            }
            function isNodeStyleEventEmitter(target) {
                return isFunction(target.addListener) && isFunction(target.removeListener);
            }
            function isJQueryStyleEventEmitter(target) {
                return isFunction(target.on) && isFunction(target.off);
            }
            function isEventTarget(target) {
                return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
            }

            function fromEventPattern(addHandler, removeHandler, resultSelector) {
                if (resultSelector) {
                    return fromEventPattern(addHandler, removeHandler).pipe(mapOneOrManyArgs(resultSelector));
                }
                return new Observable((subscriber) => {
                    const handler = (...e) => subscriber.next(e.length === 1 ? e[0] : e);
                    const retValue = addHandler(handler);
                    return isFunction(removeHandler) ? () => removeHandler(handler, retValue) : undefined;
                });
            }

            function generate(initialStateOrOptions, condition, iterate, resultSelectorOrScheduler, scheduler) {
                let resultSelector;
                let initialState;
                if (arguments.length === 1) {
                    ({
                        initialState,
                        condition,
                        iterate,
                        resultSelector = identity,
                        scheduler,
                    } = initialStateOrOptions);
                }
                else {
                    initialState = initialStateOrOptions;
                    if (!resultSelectorOrScheduler || isScheduler(resultSelectorOrScheduler)) {
                        resultSelector = identity;
                        scheduler = resultSelectorOrScheduler;
                    }
                    else {
                        resultSelector = resultSelectorOrScheduler;
                    }
                }
                function* gen() {
                    for (let state = initialState; !condition || condition(state); state = iterate(state)) {
                        yield resultSelector(state);
                    }
                }
                return defer((scheduler
                    ?
                        () => scheduleIterable(gen(), scheduler)
                    :
                        gen));
            }

            function iif(condition, trueResult, falseResult) {
                return defer(() => (condition() ? trueResult : falseResult));
            }

            function timer(dueTime = 0, intervalOrScheduler, scheduler = async) {
                let intervalDuration = -1;
                if (intervalOrScheduler != null) {
                    if (isScheduler(intervalOrScheduler)) {
                        scheduler = intervalOrScheduler;
                    }
                    else {
                        intervalDuration = intervalOrScheduler;
                    }
                }
                return new Observable((subscriber) => {
                    let due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
                    if (due < 0) {
                        due = 0;
                    }
                    let n = 0;
                    return scheduler.schedule(function () {
                        if (!subscriber.closed) {
                            subscriber.next(n++);
                            if (0 <= intervalDuration) {
                                this.schedule(undefined, intervalDuration);
                            }
                            else {
                                subscriber.complete();
                            }
                        }
                    }, due);
                });
            }

            function interval(period = 0, scheduler = asyncScheduler) {
                if (period < 0) {
                    period = 0;
                }
                return timer(period, period, scheduler);
            }

            function merge$1(...args) {
                const scheduler = popScheduler(args);
                const concurrent = popNumber(args, Infinity);
                const sources = args;
                return !sources.length
                    ?
                        EMPTY
                    : sources.length === 1
                        ?
                            innerFrom(sources[0])
                        :
                            mergeAll(concurrent)(from(sources, scheduler));
            }

            const NEVER = exports('al', new Observable(noop));
            function never() {
                return NEVER;
            }

            const { isArray } = Array;
            function argsOrArgArray(args) {
                return args.length === 1 && isArray(args[0]) ? args[0] : args;
            }

            function onErrorResumeNext$1(...sources) {
                const nextSources = argsOrArgArray(sources);
                return operate((source, subscriber) => {
                    const remaining = [source, ...nextSources];
                    const subscribeNext = () => {
                        if (!subscriber.closed) {
                            if (remaining.length > 0) {
                                let nextSource;
                                try {
                                    nextSource = innerFrom(remaining.shift());
                                }
                                catch (err) {
                                    subscribeNext();
                                    return;
                                }
                                const innerSub = new OperatorSubscriber(subscriber, undefined, noop, noop);
                                subscriber.add(nextSource.subscribe(innerSub));
                                innerSub.add(subscribeNext);
                            }
                            else {
                                subscriber.complete();
                            }
                        }
                    };
                    subscribeNext();
                });
            }

            function onErrorResumeNext(...sources) {
                return onErrorResumeNext$1(argsOrArgArray(sources))(EMPTY);
            }

            function pairs(obj, scheduler) {
                return from(Object.entries(obj), scheduler);
            }

            function not(pred, thisArg) {
                return (value, index) => !pred.call(thisArg, value, index);
            }

            function filter(predicate, thisArg) {
                return operate((source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => predicate.call(thisArg, value, index++) && subscriber.next(value)));
                });
            }

            function partition$1(source, predicate, thisArg) {
                return [filter(predicate, thisArg)(innerFrom(source)), filter(not(predicate, thisArg))(innerFrom(source))];
            }

            function race$1(...sources) {
                sources = argsOrArgArray(sources);
                return sources.length === 1 ? innerFrom(sources[0]) : new Observable(raceInit(sources));
            }
            function raceInit(sources) {
                return (subscriber) => {
                    let subscriptions = [];
                    for (let i = 0; subscriptions && !subscriber.closed && i < sources.length; i++) {
                        subscriptions.push(innerFrom(sources[i]).subscribe(new OperatorSubscriber(subscriber, (value) => {
                            if (subscriptions) {
                                for (let s = 0; s < subscriptions.length; s++) {
                                    s !== i && subscriptions[s].unsubscribe();
                                }
                                subscriptions = null;
                            }
                            subscriber.next(value);
                        })));
                    }
                };
            }

            function range(start, count, scheduler) {
                if (count == null) {
                    count = start;
                    start = 0;
                }
                if (count <= 0) {
                    return EMPTY;
                }
                const end = count + start;
                return new Observable(scheduler
                    ?
                        (subscriber) => {
                            let n = start;
                            return scheduler.schedule(function () {
                                if (n < end) {
                                    subscriber.next(n++);
                                    this.schedule();
                                }
                                else {
                                    subscriber.complete();
                                }
                            });
                        }
                    :
                        (subscriber) => {
                            let n = start;
                            while (n < end && !subscriber.closed) {
                                subscriber.next(n++);
                            }
                            subscriber.complete();
                        });
            }

            function using(resourceFactory, observableFactory) {
                return new Observable((subscriber) => {
                    const resource = resourceFactory();
                    const result = observableFactory(resource);
                    const source = result ? innerFrom(result) : EMPTY;
                    source.subscribe(subscriber);
                    return () => {
                        if (resource) {
                            resource.unsubscribe();
                        }
                    };
                });
            }

            function zip$1(...args) {
                const resultSelector = popResultSelector(args);
                const sources = argsOrArgArray(args);
                return sources.length
                    ? new Observable((subscriber) => {
                        let buffers = sources.map(() => []);
                        let completed = sources.map(() => false);
                        subscriber.add(() => {
                            buffers = completed = null;
                        });
                        for (let sourceIndex = 0; !subscriber.closed && sourceIndex < sources.length; sourceIndex++) {
                            innerFrom(sources[sourceIndex]).subscribe(new OperatorSubscriber(subscriber, (value) => {
                                buffers[sourceIndex].push(value);
                                if (buffers.every((buffer) => buffer.length)) {
                                    const result = buffers.map((buffer) => buffer.shift());
                                    subscriber.next(resultSelector ? resultSelector(...result) : result);
                                    if (buffers.some((buffer, i) => !buffer.length && completed[i])) {
                                        subscriber.complete();
                                    }
                                }
                            }, () => {
                                completed[sourceIndex] = true;
                                !buffers[sourceIndex].length && subscriber.complete();
                            }));
                        }
                        return () => {
                            buffers = completed = null;
                        };
                    })
                    : EMPTY;
            }

            function audit(durationSelector) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    let lastValue = null;
                    let durationSubscriber = null;
                    let isComplete = false;
                    const endDuration = () => {
                        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                        durationSubscriber = null;
                        if (hasValue) {
                            hasValue = false;
                            const value = lastValue;
                            lastValue = null;
                            subscriber.next(value);
                        }
                        isComplete && subscriber.complete();
                    };
                    const cleanupDuration = () => {
                        durationSubscriber = null;
                        isComplete && subscriber.complete();
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        lastValue = value;
                        if (!durationSubscriber) {
                            innerFrom(durationSelector(value)).subscribe((durationSubscriber = new OperatorSubscriber(subscriber, endDuration, cleanupDuration)));
                        }
                    }, () => {
                        isComplete = true;
                        (!hasValue || !durationSubscriber || durationSubscriber.closed) && subscriber.complete();
                    }));
                });
            }

            function auditTime(duration, scheduler = async) {
                return audit(() => timer(duration, scheduler));
            }

            function buffer(closingNotifier) {
                return operate((source, subscriber) => {
                    let currentBuffer = [];
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => currentBuffer.push(value), () => {
                        subscriber.next(currentBuffer);
                        subscriber.complete();
                    }));
                    closingNotifier.subscribe(new OperatorSubscriber(subscriber, () => {
                        const b = currentBuffer;
                        currentBuffer = [];
                        subscriber.next(b);
                    }, noop));
                    return () => {
                        currentBuffer = null;
                    };
                });
            }

            function bufferCount(bufferSize, startBufferEvery = null) {
                startBufferEvery = startBufferEvery !== null && startBufferEvery !== void 0 ? startBufferEvery : bufferSize;
                return operate((source, subscriber) => {
                    let buffers = [];
                    let count = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        let toEmit = null;
                        if (count++ % startBufferEvery === 0) {
                            buffers.push([]);
                        }
                        for (const buffer of buffers) {
                            buffer.push(value);
                            if (bufferSize <= buffer.length) {
                                toEmit = toEmit !== null && toEmit !== void 0 ? toEmit : [];
                                toEmit.push(buffer);
                            }
                        }
                        if (toEmit) {
                            for (const buffer of toEmit) {
                                arrRemove(buffers, buffer);
                                subscriber.next(buffer);
                            }
                        }
                    }, () => {
                        for (const buffer of buffers) {
                            subscriber.next(buffer);
                        }
                        subscriber.complete();
                    }, undefined, () => {
                        buffers = null;
                    }));
                });
            }

            function bufferTime(bufferTimeSpan, ...otherArgs) {
                var _a, _b;
                const scheduler = (_a = popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : asyncScheduler;
                const bufferCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
                const maxBufferSize = otherArgs[1] || Infinity;
                return operate((source, subscriber) => {
                    let bufferRecords = [];
                    let restartOnEmit = false;
                    const emit = (record) => {
                        const { buffer, subs } = record;
                        subs.unsubscribe();
                        arrRemove(bufferRecords, record);
                        subscriber.next(buffer);
                        restartOnEmit && startBuffer();
                    };
                    const startBuffer = () => {
                        if (bufferRecords) {
                            const subs = new Subscription();
                            subscriber.add(subs);
                            const buffer = [];
                            const record = {
                                buffer,
                                subs,
                            };
                            bufferRecords.push(record);
                            executeSchedule(subs, scheduler, () => emit(record), bufferTimeSpan);
                        }
                    };
                    if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
                        executeSchedule(subscriber, scheduler, startBuffer, bufferCreationInterval, true);
                    }
                    else {
                        restartOnEmit = true;
                    }
                    startBuffer();
                    const bufferTimeSubscriber = new OperatorSubscriber(subscriber, (value) => {
                        const recordsCopy = bufferRecords.slice();
                        for (const record of recordsCopy) {
                            const { buffer } = record;
                            buffer.push(value);
                            maxBufferSize <= buffer.length && emit(record);
                        }
                    }, () => {
                        while (bufferRecords === null || bufferRecords === void 0 ? void 0 : bufferRecords.length) {
                            subscriber.next(bufferRecords.shift().buffer);
                        }
                        bufferTimeSubscriber === null || bufferTimeSubscriber === void 0 ? void 0 : bufferTimeSubscriber.unsubscribe();
                        subscriber.complete();
                        subscriber.unsubscribe();
                    }, undefined, () => (bufferRecords = null));
                    source.subscribe(bufferTimeSubscriber);
                });
            }

            function bufferToggle(openings, closingSelector) {
                return operate((source, subscriber) => {
                    const buffers = [];
                    innerFrom(openings).subscribe(new OperatorSubscriber(subscriber, (openValue) => {
                        const buffer = [];
                        buffers.push(buffer);
                        const closingSubscription = new Subscription();
                        const emitBuffer = () => {
                            arrRemove(buffers, buffer);
                            subscriber.next(buffer);
                            closingSubscription.unsubscribe();
                        };
                        closingSubscription.add(innerFrom(closingSelector(openValue)).subscribe(new OperatorSubscriber(subscriber, emitBuffer, noop)));
                    }, noop));
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        for (const buffer of buffers) {
                            buffer.push(value);
                        }
                    }, () => {
                        while (buffers.length > 0) {
                            subscriber.next(buffers.shift());
                        }
                        subscriber.complete();
                    }));
                });
            }

            function bufferWhen(closingSelector) {
                return operate((source, subscriber) => {
                    let buffer = null;
                    let closingSubscriber = null;
                    const openBuffer = () => {
                        closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
                        const b = buffer;
                        buffer = [];
                        b && subscriber.next(b);
                        innerFrom(closingSelector()).subscribe((closingSubscriber = new OperatorSubscriber(subscriber, openBuffer, noop)));
                    };
                    openBuffer();
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => buffer === null || buffer === void 0 ? void 0 : buffer.push(value), () => {
                        buffer && subscriber.next(buffer);
                        subscriber.complete();
                    }, undefined, () => (buffer = closingSubscriber = null)));
                });
            }

            function catchError(selector) {
                return operate((source, subscriber) => {
                    let innerSub = null;
                    let syncUnsub = false;
                    let handledResult;
                    innerSub = source.subscribe(new OperatorSubscriber(subscriber, undefined, undefined, (err) => {
                        handledResult = innerFrom(selector(err, catchError(selector)(source)));
                        if (innerSub) {
                            innerSub.unsubscribe();
                            innerSub = null;
                            handledResult.subscribe(subscriber);
                        }
                        else {
                            syncUnsub = true;
                        }
                    }));
                    if (syncUnsub) {
                        innerSub.unsubscribe();
                        innerSub = null;
                        handledResult.subscribe(subscriber);
                    }
                });
            }

            function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
                return (source, subscriber) => {
                    let hasState = hasSeed;
                    let state = seed;
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const i = index++;
                        state = hasState
                            ?
                                accumulator(state, value, i)
                            :
                                ((hasState = true), value);
                        emitOnNext && subscriber.next(state);
                    }, emitBeforeComplete &&
                        (() => {
                            hasState && subscriber.next(state);
                            subscriber.complete();
                        })));
                };
            }

            function reduce(accumulator, seed) {
                return operate(scanInternals(accumulator, seed, arguments.length >= 2, false, true));
            }

            const arrReducer = (arr, value) => (arr.push(value), arr);
            function toArray() {
                return operate((source, subscriber) => {
                    reduce(arrReducer, [])(source).subscribe(subscriber);
                });
            }

            function joinAllInternals(joinFn, project) {
                return pipe(toArray(), mergeMap((sources) => joinFn(sources)), project ? mapOneOrManyArgs(project) : identity);
            }

            function combineLatestAll(project) {
                return joinAllInternals(combineLatest$1, project);
            }

            const combineAll = exports('av', combineLatestAll);

            function combineLatest(...args) {
                const resultSelector = popResultSelector(args);
                return resultSelector
                    ? pipe(combineLatest(...args), mapOneOrManyArgs(resultSelector))
                    : operate((source, subscriber) => {
                        combineLatestInit([source, ...argsOrArgArray(args)])(subscriber);
                    });
            }

            function combineLatestWith(...otherSources) {
                return combineLatest(...otherSources);
            }

            function concatMap(project, resultSelector) {
                return isFunction(resultSelector) ? mergeMap(project, resultSelector, 1) : mergeMap(project, 1);
            }

            function concatMapTo(innerObservable, resultSelector) {
                return isFunction(resultSelector) ? concatMap(() => innerObservable, resultSelector) : concatMap(() => innerObservable);
            }

            function concat(...args) {
                const scheduler = popScheduler(args);
                return operate((source, subscriber) => {
                    concatAll()(from([source, ...args], scheduler)).subscribe(subscriber);
                });
            }

            function concatWith(...otherSources) {
                return concat(...otherSources);
            }

            function fromSubscribable(subscribable) {
                return new Observable((subscriber) => subscribable.subscribe(subscriber));
            }

            const DEFAULT_CONFIG = {
                connector: () => new Subject(),
            };
            function connect(selector, config = DEFAULT_CONFIG) {
                const { connector } = config;
                return operate((source, subscriber) => {
                    const subject = connector();
                    from(selector(fromSubscribable(subject))).subscribe(subscriber);
                    subscriber.add(source.subscribe(subject));
                });
            }

            function count(predicate) {
                return reduce((total, value, i) => (!predicate || predicate(value, i) ? total + 1 : total), 0);
            }

            function debounce(durationSelector) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    let lastValue = null;
                    let durationSubscriber = null;
                    const emit = () => {
                        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                        durationSubscriber = null;
                        if (hasValue) {
                            hasValue = false;
                            const value = lastValue;
                            lastValue = null;
                            subscriber.next(value);
                        }
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                        hasValue = true;
                        lastValue = value;
                        durationSubscriber = new OperatorSubscriber(subscriber, emit, noop);
                        innerFrom(durationSelector(value)).subscribe(durationSubscriber);
                    }, () => {
                        emit();
                        subscriber.complete();
                    }, undefined, () => {
                        lastValue = durationSubscriber = null;
                    }));
                });
            }

            function debounceTime(dueTime, scheduler = asyncScheduler) {
                return operate((source, subscriber) => {
                    let activeTask = null;
                    let lastValue = null;
                    let lastTime = null;
                    const emit = () => {
                        if (activeTask) {
                            activeTask.unsubscribe();
                            activeTask = null;
                            const value = lastValue;
                            lastValue = null;
                            subscriber.next(value);
                        }
                    };
                    function emitWhenIdle() {
                        const targetTime = lastTime + dueTime;
                        const now = scheduler.now();
                        if (now < targetTime) {
                            activeTask = this.schedule(undefined, targetTime - now);
                            subscriber.add(activeTask);
                            return;
                        }
                        emit();
                    }
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        lastValue = value;
                        lastTime = scheduler.now();
                        if (!activeTask) {
                            activeTask = scheduler.schedule(emitWhenIdle, dueTime);
                            subscriber.add(activeTask);
                        }
                    }, () => {
                        emit();
                        subscriber.complete();
                    }, undefined, () => {
                        lastValue = activeTask = null;
                    }));
                });
            }

            function defaultIfEmpty(defaultValue) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        subscriber.next(value);
                    }, () => {
                        if (!hasValue) {
                            subscriber.next(defaultValue);
                        }
                        subscriber.complete();
                    }));
                });
            }

            function take(count) {
                return count <= 0
                    ?
                        () => EMPTY
                    : operate((source, subscriber) => {
                        let seen = 0;
                        source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                            if (++seen <= count) {
                                subscriber.next(value);
                                if (count <= seen) {
                                    subscriber.complete();
                                }
                            }
                        }));
                    });
            }

            function ignoreElements() {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, noop));
                });
            }

            function mapTo(value) {
                return map(() => value);
            }

            function delayWhen(delayDurationSelector, subscriptionDelay) {
                if (subscriptionDelay) {
                    return (source) => concat$1(subscriptionDelay.pipe(take(1), ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
                }
                return mergeMap((value, index) => delayDurationSelector(value, index).pipe(take(1), mapTo(value)));
            }

            function delay(due, scheduler = asyncScheduler) {
                const duration = timer(due, scheduler);
                return delayWhen(() => duration);
            }

            function dematerialize() {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, (notification) => observeNotification(notification, subscriber)));
                });
            }

            function distinct(keySelector, flushes) {
                return operate((source, subscriber) => {
                    const distinctKeys = new Set();
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const key = keySelector ? keySelector(value) : value;
                        if (!distinctKeys.has(key)) {
                            distinctKeys.add(key);
                            subscriber.next(value);
                        }
                    }));
                    flushes === null || flushes === void 0 ? void 0 : flushes.subscribe(new OperatorSubscriber(subscriber, () => distinctKeys.clear(), noop));
                });
            }

            function distinctUntilChanged(comparator, keySelector = identity) {
                comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
                return operate((source, subscriber) => {
                    let previousKey;
                    let first = true;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const currentKey = keySelector(value);
                        if (first || !comparator(previousKey, currentKey)) {
                            first = false;
                            previousKey = currentKey;
                            subscriber.next(value);
                        }
                    }));
                });
            }
            function defaultCompare(a, b) {
                return a === b;
            }

            function distinctUntilKeyChanged(key, compare) {
                return distinctUntilChanged((x, y) => compare ? compare(x[key], y[key]) : x[key] === y[key]);
            }

            function throwIfEmpty(errorFactory = defaultErrorFactory) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        subscriber.next(value);
                    }, () => (hasValue ? subscriber.complete() : subscriber.error(errorFactory()))));
                });
            }
            function defaultErrorFactory() {
                return new EmptyError();
            }

            function elementAt(index, defaultValue) {
                if (index < 0) {
                    throw new ArgumentOutOfRangeError();
                }
                const hasDefaultValue = arguments.length >= 2;
                return (source) => source.pipe(filter((v, i) => i === index), take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new ArgumentOutOfRangeError()));
            }

            function endWith(...values) {
                return (source) => concat$1(source, of(...values));
            }

            function every(predicate, thisArg) {
                return operate((source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        if (!predicate.call(thisArg, value, index++, source)) {
                            subscriber.next(false);
                            subscriber.complete();
                        }
                    }, () => {
                        subscriber.next(true);
                        subscriber.complete();
                    }));
                });
            }

            function exhaustAll() {
                return operate((source, subscriber) => {
                    let isComplete = false;
                    let innerSub = null;
                    source.subscribe(new OperatorSubscriber(subscriber, (inner) => {
                        if (!innerSub) {
                            innerSub = innerFrom(inner).subscribe(new OperatorSubscriber(subscriber, undefined, () => {
                                innerSub = null;
                                isComplete && subscriber.complete();
                            }));
                        }
                    }, () => {
                        isComplete = true;
                        !innerSub && subscriber.complete();
                    }));
                });
            }

            const exhaust = exports('aQ', exhaustAll);

            function exhaustMap(project, resultSelector) {
                if (resultSelector) {
                    return (source) => source.pipe(exhaustMap((a, i) => innerFrom(project(a, i)).pipe(map((b, ii) => resultSelector(a, b, i, ii)))));
                }
                return operate((source, subscriber) => {
                    let index = 0;
                    let innerSub = null;
                    let isComplete = false;
                    source.subscribe(new OperatorSubscriber(subscriber, (outerValue) => {
                        if (!innerSub) {
                            innerSub = new OperatorSubscriber(subscriber, undefined, () => {
                                innerSub = null;
                                isComplete && subscriber.complete();
                            });
                            innerFrom(project(outerValue, index++)).subscribe(innerSub);
                        }
                    }, () => {
                        isComplete = true;
                        !innerSub && subscriber.complete();
                    }));
                });
            }

            function expand(project, concurrent = Infinity, scheduler) {
                concurrent = (concurrent || 0) < 1 ? Infinity : concurrent;
                return operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent, undefined, true, scheduler));
            }

            function finalize(callback) {
                return operate((source, subscriber) => {
                    try {
                        source.subscribe(subscriber);
                    }
                    finally {
                        subscriber.add(callback);
                    }
                });
            }

            function find(predicate, thisArg) {
                return operate(createFind(predicate, thisArg, 'value'));
            }
            function createFind(predicate, thisArg, emit) {
                const findIndex = emit === 'index';
                return (source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const i = index++;
                        if (predicate.call(thisArg, value, i, source)) {
                            subscriber.next(findIndex ? i : value);
                            subscriber.complete();
                        }
                    }, () => {
                        subscriber.next(findIndex ? -1 : undefined);
                        subscriber.complete();
                    }));
                };
            }

            function findIndex(predicate, thisArg) {
                return operate(createFind(predicate, thisArg, 'index'));
            }

            function first(predicate, defaultValue) {
                const hasDefaultValue = arguments.length >= 2;
                return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
            }

            function groupBy(keySelector, elementOrOptions, duration, connector) {
                return operate((source, subscriber) => {
                    let element;
                    if (!elementOrOptions || typeof elementOrOptions === 'function') {
                        element = elementOrOptions;
                    }
                    else {
                        ({ duration, element, connector } = elementOrOptions);
                    }
                    const groups = new Map();
                    const notify = (cb) => {
                        groups.forEach(cb);
                        cb(subscriber);
                    };
                    const handleError = (err) => notify((consumer) => consumer.error(err));
                    const groupBySourceSubscriber = new GroupBySubscriber(subscriber, (value) => {
                        try {
                            const key = keySelector(value);
                            let group = groups.get(key);
                            if (!group) {
                                groups.set(key, (group = connector ? connector() : new Subject()));
                                const grouped = createGroupedObservable(key, group);
                                subscriber.next(grouped);
                                if (duration) {
                                    const durationSubscriber = new OperatorSubscriber(group, () => {
                                        group.complete();
                                        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                                    }, undefined, undefined, () => groups.delete(key));
                                    groupBySourceSubscriber.add(innerFrom(duration(grouped)).subscribe(durationSubscriber));
                                }
                            }
                            group.next(element ? element(value) : value);
                        }
                        catch (err) {
                            handleError(err);
                        }
                    }, () => notify((consumer) => consumer.complete()), handleError, () => groups.clear());
                    source.subscribe(groupBySourceSubscriber);
                    function createGroupedObservable(key, groupSubject) {
                        const result = new Observable((groupSubscriber) => {
                            groupBySourceSubscriber.activeGroups++;
                            const innerSub = groupSubject.subscribe(groupSubscriber);
                            return () => {
                                innerSub.unsubscribe();
                                --groupBySourceSubscriber.activeGroups === 0 &&
                                    groupBySourceSubscriber.teardownAttempted &&
                                    groupBySourceSubscriber.unsubscribe();
                            };
                        });
                        result.key = key;
                        return result;
                    }
                });
            }
            class GroupBySubscriber extends OperatorSubscriber {
                constructor() {
                    super(...arguments);
                    this.activeGroups = 0;
                    this.teardownAttempted = false;
                }
                unsubscribe() {
                    this.teardownAttempted = true;
                    this.activeGroups === 0 && super.unsubscribe();
                }
            }

            function isEmpty() {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, () => {
                        subscriber.next(false);
                        subscriber.complete();
                    }, () => {
                        subscriber.next(true);
                        subscriber.complete();
                    }));
                });
            }

            function takeLast(count) {
                return count <= 0
                    ? () => EMPTY
                    : operate((source, subscriber) => {
                        let buffer = [];
                        source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                            buffer.push(value);
                            count < buffer.length && buffer.shift();
                        }, () => {
                            for (const value of buffer) {
                                subscriber.next(value);
                            }
                            subscriber.complete();
                        }, undefined, () => {
                            buffer = null;
                        }));
                    });
            }

            function last(predicate, defaultValue) {
                const hasDefaultValue = arguments.length >= 2;
                return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, takeLast(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
            }

            function materialize() {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        subscriber.next(Notification.createNext(value));
                    }, () => {
                        subscriber.next(Notification.createComplete());
                        subscriber.complete();
                    }, (err) => {
                        subscriber.next(Notification.createError(err));
                        subscriber.complete();
                    }));
                });
            }

            function max(comparer) {
                return reduce(isFunction(comparer) ? (x, y) => (comparer(x, y) > 0 ? x : y) : (x, y) => (x > y ? x : y));
            }

            const flatMap = exports('b6', mergeMap);

            function mergeMapTo(innerObservable, resultSelector, concurrent = Infinity) {
                if (isFunction(resultSelector)) {
                    return mergeMap(() => innerObservable, resultSelector, concurrent);
                }
                if (typeof resultSelector === 'number') {
                    concurrent = resultSelector;
                }
                return mergeMap(() => innerObservable, concurrent);
            }

            function mergeScan(accumulator, seed, concurrent = Infinity) {
                return operate((source, subscriber) => {
                    let state = seed;
                    return mergeInternals(source, subscriber, (value, index) => accumulator(state, value, index), concurrent, (value) => {
                        state = value;
                    }, false, undefined, () => (state = null));
                });
            }

            function merge(...args) {
                const scheduler = popScheduler(args);
                const concurrent = popNumber(args, Infinity);
                args = argsOrArgArray(args);
                return operate((source, subscriber) => {
                    mergeAll(concurrent)(from([source, ...args], scheduler)).subscribe(subscriber);
                });
            }

            function mergeWith(...otherSources) {
                return merge(...otherSources);
            }

            function min(comparer) {
                return reduce(isFunction(comparer) ? (x, y) => (comparer(x, y) < 0 ? x : y) : (x, y) => (x < y ? x : y));
            }

            function multicast(subjectOrSubjectFactory, selector) {
                const subjectFactory = isFunction(subjectOrSubjectFactory) ? subjectOrSubjectFactory : () => subjectOrSubjectFactory;
                if (isFunction(selector)) {
                    return connect(selector, {
                        connector: subjectFactory,
                    });
                }
                return (source) => new ConnectableObservable(source, subjectFactory);
            }

            function pairwise() {
                return operate((source, subscriber) => {
                    let prev;
                    let hasPrev = false;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const p = prev;
                        prev = value;
                        hasPrev && subscriber.next([p, value]);
                        hasPrev = true;
                    }));
                });
            }

            function pluck(...properties) {
                const length = properties.length;
                if (length === 0) {
                    throw new Error('list of properties cannot be empty.');
                }
                return map((x) => {
                    let currentProp = x;
                    for (let i = 0; i < length; i++) {
                        const p = currentProp === null || currentProp === void 0 ? void 0 : currentProp[properties[i]];
                        if (typeof p !== 'undefined') {
                            currentProp = p;
                        }
                        else {
                            return undefined;
                        }
                    }
                    return currentProp;
                });
            }

            function publish(selector) {
                return selector ? (source) => connect(selector)(source) : (source) => multicast(new Subject())(source);
            }

            function publishBehavior(initialValue) {
                return (source) => {
                    const subject = new BehaviorSubject(initialValue);
                    return new ConnectableObservable(source, () => subject);
                };
            }

            function publishLast() {
                return (source) => {
                    const subject = new AsyncSubject();
                    return new ConnectableObservable(source, () => subject);
                };
            }

            function publishReplay(bufferSize, windowTime, selectorOrScheduler, timestampProvider) {
                if (selectorOrScheduler && !isFunction(selectorOrScheduler)) {
                    timestampProvider = selectorOrScheduler;
                }
                const selector = isFunction(selectorOrScheduler) ? selectorOrScheduler : undefined;
                return (source) => multicast(new ReplaySubject(bufferSize, windowTime, timestampProvider), selector)(source);
            }

            function raceWith(...otherSources) {
                return !otherSources.length
                    ? identity
                    : operate((source, subscriber) => {
                        raceInit([source, ...otherSources])(subscriber);
                    });
            }

            function repeat(count = Infinity) {
                return count <= 0
                    ? () => EMPTY
                    : operate((source, subscriber) => {
                        let soFar = 0;
                        let innerSub;
                        const subscribeForRepeat = () => {
                            let syncUnsub = false;
                            innerSub = source.subscribe(new OperatorSubscriber(subscriber, undefined, () => {
                                if (++soFar < count) {
                                    if (innerSub) {
                                        innerSub.unsubscribe();
                                        innerSub = null;
                                        subscribeForRepeat();
                                    }
                                    else {
                                        syncUnsub = true;
                                    }
                                }
                                else {
                                    subscriber.complete();
                                }
                            }));
                            if (syncUnsub) {
                                innerSub.unsubscribe();
                                innerSub = null;
                                subscribeForRepeat();
                            }
                        };
                        subscribeForRepeat();
                    });
            }

            function repeatWhen(notifier) {
                return operate((source, subscriber) => {
                    let innerSub;
                    let syncResub = false;
                    let completions$;
                    let isNotifierComplete = false;
                    let isMainComplete = false;
                    const checkComplete = () => isMainComplete && isNotifierComplete && (subscriber.complete(), true);
                    const getCompletionSubject = () => {
                        if (!completions$) {
                            completions$ = new Subject();
                            notifier(completions$).subscribe(new OperatorSubscriber(subscriber, () => {
                                if (innerSub) {
                                    subscribeForRepeatWhen();
                                }
                                else {
                                    syncResub = true;
                                }
                            }, () => {
                                isNotifierComplete = true;
                                checkComplete();
                            }));
                        }
                        return completions$;
                    };
                    const subscribeForRepeatWhen = () => {
                        isMainComplete = false;
                        innerSub = source.subscribe(new OperatorSubscriber(subscriber, undefined, () => {
                            isMainComplete = true;
                            !checkComplete() && getCompletionSubject().next();
                        }));
                        if (syncResub) {
                            innerSub.unsubscribe();
                            innerSub = null;
                            syncResub = false;
                            subscribeForRepeatWhen();
                        }
                    };
                    subscribeForRepeatWhen();
                });
            }

            function retry(configOrCount = Infinity) {
                let config;
                if (configOrCount && typeof configOrCount === 'object') {
                    config = configOrCount;
                }
                else {
                    config = {
                        count: configOrCount,
                    };
                }
                const { count = Infinity, delay, resetOnSuccess: resetOnSuccess = false } = config;
                return count <= 0
                    ? identity
                    : operate((source, subscriber) => {
                        let soFar = 0;
                        let innerSub;
                        const subscribeForRetry = () => {
                            let syncUnsub = false;
                            innerSub = source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                                if (resetOnSuccess) {
                                    soFar = 0;
                                }
                                subscriber.next(value);
                            }, undefined, (err) => {
                                if (soFar++ < count) {
                                    const resub = () => {
                                        if (innerSub) {
                                            innerSub.unsubscribe();
                                            innerSub = null;
                                            subscribeForRetry();
                                        }
                                        else {
                                            syncUnsub = true;
                                        }
                                    };
                                    if (delay != null) {
                                        const notifier = typeof delay === 'number' ? timer(delay) : innerFrom(delay(err, soFar));
                                        const notifierSubscriber = new OperatorSubscriber(subscriber, () => {
                                            notifierSubscriber.unsubscribe();
                                            resub();
                                        }, () => {
                                            subscriber.complete();
                                        });
                                        notifier.subscribe(notifierSubscriber);
                                    }
                                    else {
                                        resub();
                                    }
                                }
                                else {
                                    subscriber.error(err);
                                }
                            }));
                            if (syncUnsub) {
                                innerSub.unsubscribe();
                                innerSub = null;
                                subscribeForRetry();
                            }
                        };
                        subscribeForRetry();
                    });
            }

            function retryWhen(notifier) {
                return operate((source, subscriber) => {
                    let innerSub;
                    let syncResub = false;
                    let errors$;
                    const subscribeForRetryWhen = () => {
                        innerSub = source.subscribe(new OperatorSubscriber(subscriber, undefined, undefined, (err) => {
                            if (!errors$) {
                                errors$ = new Subject();
                                notifier(errors$).subscribe(new OperatorSubscriber(subscriber, () => innerSub ? subscribeForRetryWhen() : (syncResub = true)));
                            }
                            if (errors$) {
                                errors$.next(err);
                            }
                        }));
                        if (syncResub) {
                            innerSub.unsubscribe();
                            innerSub = null;
                            syncResub = false;
                            subscribeForRetryWhen();
                        }
                    };
                    subscribeForRetryWhen();
                });
            }

            function sample(notifier) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    let lastValue = null;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        lastValue = value;
                    }));
                    const emit = () => {
                        if (hasValue) {
                            hasValue = false;
                            const value = lastValue;
                            lastValue = null;
                            subscriber.next(value);
                        }
                    };
                    notifier.subscribe(new OperatorSubscriber(subscriber, emit, noop));
                });
            }

            function sampleTime(period, scheduler = asyncScheduler) {
                return sample(interval(period, scheduler));
            }

            function scan(accumulator, seed) {
                return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
            }

            function sequenceEqual(compareTo, comparator = (a, b) => a === b) {
                return operate((source, subscriber) => {
                    const aState = createState();
                    const bState = createState();
                    const emit = (isEqual) => {
                        subscriber.next(isEqual);
                        subscriber.complete();
                    };
                    const createSubscriber = (selfState, otherState) => {
                        const sequenceEqualSubscriber = new OperatorSubscriber(subscriber, (a) => {
                            const { buffer, complete } = otherState;
                            if (buffer.length === 0) {
                                complete ? emit(false) : selfState.buffer.push(a);
                            }
                            else {
                                !comparator(a, buffer.shift()) && emit(false);
                            }
                        }, () => {
                            selfState.complete = true;
                            const { complete, buffer } = otherState;
                            complete && emit(buffer.length === 0);
                            sequenceEqualSubscriber === null || sequenceEqualSubscriber === void 0 ? void 0 : sequenceEqualSubscriber.unsubscribe();
                        });
                        return sequenceEqualSubscriber;
                    };
                    source.subscribe(createSubscriber(aState, bState));
                    compareTo.subscribe(createSubscriber(bState, aState));
                });
            }
            function createState() {
                return {
                    buffer: [],
                    complete: false,
                };
            }

            function share(options = {}) {
                const { connector = () => new Subject(), resetOnError = true, resetOnComplete = true, resetOnRefCountZero = true } = options;
                return (wrapperSource) => {
                    let connection = null;
                    let resetConnection = null;
                    let subject = null;
                    let refCount = 0;
                    let hasCompleted = false;
                    let hasErrored = false;
                    const cancelReset = () => {
                        resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
                        resetConnection = null;
                    };
                    const reset = () => {
                        cancelReset();
                        connection = subject = null;
                        hasCompleted = hasErrored = false;
                    };
                    const resetAndUnsubscribe = () => {
                        const conn = connection;
                        reset();
                        conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
                    };
                    return operate((source, subscriber) => {
                        refCount++;
                        if (!hasErrored && !hasCompleted) {
                            cancelReset();
                        }
                        const dest = (subject = subject !== null && subject !== void 0 ? subject : connector());
                        subscriber.add(() => {
                            refCount--;
                            if (refCount === 0 && !hasErrored && !hasCompleted) {
                                resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
                            }
                        });
                        dest.subscribe(subscriber);
                        if (!connection) {
                            connection = new SafeSubscriber({
                                next: (value) => dest.next(value),
                                error: (err) => {
                                    hasErrored = true;
                                    cancelReset();
                                    resetConnection = handleReset(reset, resetOnError, err);
                                    dest.error(err);
                                },
                                complete: () => {
                                    hasCompleted = true;
                                    cancelReset();
                                    resetConnection = handleReset(reset, resetOnComplete);
                                    dest.complete();
                                },
                            });
                            from(source).subscribe(connection);
                        }
                    })(wrapperSource);
                };
            }
            function handleReset(reset, on, ...args) {
                if (on === true) {
                    reset();
                    return null;
                }
                if (on === false) {
                    return null;
                }
                return on(...args)
                    .pipe(take(1))
                    .subscribe(() => reset());
            }

            function shareReplay(configOrBufferSize, windowTime, scheduler) {
                var _a, _b;
                let bufferSize;
                let refCount = false;
                if (configOrBufferSize && typeof configOrBufferSize === 'object') {
                    bufferSize = (_a = configOrBufferSize.bufferSize) !== null && _a !== void 0 ? _a : Infinity;
                    windowTime = (_b = configOrBufferSize.windowTime) !== null && _b !== void 0 ? _b : Infinity;
                    refCount = !!configOrBufferSize.refCount;
                    scheduler = configOrBufferSize.scheduler;
                }
                else {
                    bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
                }
                return share({
                    connector: () => new ReplaySubject(bufferSize, windowTime, scheduler),
                    resetOnError: true,
                    resetOnComplete: false,
                    resetOnRefCountZero: refCount
                });
            }

            function single(predicate) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    let singleValue;
                    let seenValue = false;
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        seenValue = true;
                        if (!predicate || predicate(value, index++, source)) {
                            hasValue && subscriber.error(new SequenceError('Too many matching values'));
                            hasValue = true;
                            singleValue = value;
                        }
                    }, () => {
                        if (hasValue) {
                            subscriber.next(singleValue);
                            subscriber.complete();
                        }
                        else {
                            subscriber.error(seenValue ? new NotFoundError('No matching values') : new EmptyError());
                        }
                    }));
                });
            }

            function skip(count) {
                return filter((_, index) => count <= index);
            }

            function skipLast(skipCount) {
                return skipCount <= 0
                    ?
                        identity
                    : operate((source, subscriber) => {
                        let ring = new Array(skipCount);
                        let seen = 0;
                        source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                            const valueIndex = seen++;
                            if (valueIndex < skipCount) {
                                ring[valueIndex] = value;
                            }
                            else {
                                const index = valueIndex % skipCount;
                                const oldValue = ring[index];
                                ring[index] = value;
                                subscriber.next(oldValue);
                            }
                        }));
                        return () => {
                            ring = null;
                        };
                    });
            }

            function skipUntil(notifier) {
                return operate((source, subscriber) => {
                    let taking = false;
                    const skipSubscriber = new OperatorSubscriber(subscriber, () => {
                        skipSubscriber === null || skipSubscriber === void 0 ? void 0 : skipSubscriber.unsubscribe();
                        taking = true;
                    }, noop);
                    innerFrom(notifier).subscribe(skipSubscriber);
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => taking && subscriber.next(value)));
                });
            }

            function skipWhile(predicate) {
                return operate((source, subscriber) => {
                    let taking = false;
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => (taking || (taking = !predicate(value, index++))) && subscriber.next(value)));
                });
            }

            function startWith(...values) {
                const scheduler = popScheduler(values);
                return operate((source, subscriber) => {
                    (scheduler ? concat$1(values, source, scheduler) : concat$1(values, source)).subscribe(subscriber);
                });
            }

            function switchMap(project, resultSelector) {
                return operate((source, subscriber) => {
                    let innerSubscriber = null;
                    let index = 0;
                    let isComplete = false;
                    const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
                        let innerIndex = 0;
                        const outerIndex = index++;
                        innerFrom(project(value, outerIndex)).subscribe((innerSubscriber = new OperatorSubscriber(subscriber, (innerValue) => subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue), () => {
                            innerSubscriber = null;
                            checkComplete();
                        })));
                    }, () => {
                        isComplete = true;
                        checkComplete();
                    }));
                });
            }

            function switchAll() {
                return switchMap(identity);
            }

            function switchMapTo(innerObservable, resultSelector) {
                return isFunction(resultSelector) ? switchMap(() => innerObservable, resultSelector) : switchMap(() => innerObservable);
            }

            function switchScan(accumulator, seed) {
                return operate((source, subscriber) => {
                    let state = seed;
                    switchMap((value, index) => accumulator(state, value, index), (_, innerValue) => ((state = innerValue), innerValue))(source).subscribe(subscriber);
                    return () => {
                        state = null;
                    };
                });
            }

            function takeUntil(notifier) {
                return operate((source, subscriber) => {
                    innerFrom(notifier).subscribe(new OperatorSubscriber(subscriber, () => subscriber.complete(), noop));
                    !subscriber.closed && source.subscribe(subscriber);
                });
            }

            function takeWhile(predicate, inclusive = false) {
                return operate((source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const result = predicate(value, index++);
                        (result || inclusive) && subscriber.next(value);
                        !result && subscriber.complete();
                    }));
                });
            }

            function tap(observerOrNext, error, complete) {
                const tapObserver = isFunction(observerOrNext) || error || complete
                    ?
                        { next: observerOrNext, error, complete }
                    : observerOrNext;
                return tapObserver
                    ? operate((source, subscriber) => {
                        var _a;
                        (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                        let isUnsub = true;
                        source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                            var _a;
                            (_a = tapObserver.next) === null || _a === void 0 ? void 0 : _a.call(tapObserver, value);
                            subscriber.next(value);
                        }, () => {
                            var _a;
                            isUnsub = false;
                            (_a = tapObserver.complete) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                            subscriber.complete();
                        }, (err) => {
                            var _a;
                            isUnsub = false;
                            (_a = tapObserver.error) === null || _a === void 0 ? void 0 : _a.call(tapObserver, err);
                            subscriber.error(err);
                        }, () => {
                            var _a, _b;
                            if (isUnsub) {
                                (_a = tapObserver.unsubscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                            }
                            (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
                        }));
                    })
                    :
                        identity;
            }

            const defaultThrottleConfig = {
                leading: true,
                trailing: false,
            };
            function throttle(durationSelector, { leading, trailing } = defaultThrottleConfig) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    let sendValue = null;
                    let throttled = null;
                    let isComplete = false;
                    const endThrottling = () => {
                        throttled === null || throttled === void 0 ? void 0 : throttled.unsubscribe();
                        throttled = null;
                        if (trailing) {
                            send();
                            isComplete && subscriber.complete();
                        }
                    };
                    const cleanupThrottling = () => {
                        throttled = null;
                        isComplete && subscriber.complete();
                    };
                    const startThrottle = (value) => (throttled = innerFrom(durationSelector(value)).subscribe(new OperatorSubscriber(subscriber, endThrottling, cleanupThrottling)));
                    const send = () => {
                        if (hasValue) {
                            hasValue = false;
                            const value = sendValue;
                            sendValue = null;
                            subscriber.next(value);
                            !isComplete && startThrottle(value);
                        }
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        sendValue = value;
                        !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
                    }, () => {
                        isComplete = true;
                        !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
                    }));
                });
            }

            function throttleTime(duration, scheduler = asyncScheduler, config = defaultThrottleConfig) {
                const duration$ = timer(duration, scheduler);
                return throttle(() => duration$, config);
            }

            function timeInterval(scheduler = async) {
                return (source) => defer(() => {
                    return source.pipe(scan(({ current }, value) => ({ value, current: scheduler.now(), last: current }), {
                        current: scheduler.now(),
                        value: undefined,
                        last: undefined,
                    }), map(({ current, last, value }) => new TimeInterval(value, current - last)));
                });
            }
            class TimeInterval {
                constructor(value, interval) {
                    this.value = value;
                    this.interval = interval;
                }
            }

            function timeoutWith(due, withObservable, scheduler) {
                let first;
                let each;
                let _with;
                scheduler = scheduler !== null && scheduler !== void 0 ? scheduler : async;
                if (isValidDate(due)) {
                    first = due;
                }
                else if (typeof due === 'number') {
                    each = due;
                }
                if (withObservable) {
                    _with = () => withObservable;
                }
                else {
                    throw new TypeError('No observable provided to switch to');
                }
                if (first == null && each == null) {
                    throw new TypeError('No timeout provided.');
                }
                return timeout({
                    first,
                    each,
                    scheduler,
                    with: _with,
                });
            }

            function timestamp(timestampProvider = dateTimestampProvider) {
                return map((value) => ({ value, timestamp: timestampProvider.now() }));
            }

            function window(windowBoundaries) {
                return operate((source, subscriber) => {
                    let windowSubject = new Subject();
                    subscriber.next(windowSubject.asObservable());
                    const errorHandler = (err) => {
                        windowSubject.error(err);
                        subscriber.error(err);
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.next(value), () => {
                        windowSubject.complete();
                        subscriber.complete();
                    }, errorHandler));
                    windowBoundaries.subscribe(new OperatorSubscriber(subscriber, () => {
                        windowSubject.complete();
                        subscriber.next((windowSubject = new Subject()));
                    }, noop, errorHandler));
                    return () => {
                        windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.unsubscribe();
                        windowSubject = null;
                    };
                });
            }

            function windowCount(windowSize, startWindowEvery = 0) {
                const startEvery = startWindowEvery > 0 ? startWindowEvery : windowSize;
                return operate((source, subscriber) => {
                    let windows = [new Subject()];
                    let starts = [];
                    let count = 0;
                    subscriber.next(windows[0].asObservable());
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        for (const window of windows) {
                            window.next(value);
                        }
                        const c = count - windowSize + 1;
                        if (c >= 0 && c % startEvery === 0) {
                            windows.shift().complete();
                        }
                        if (++count % startEvery === 0) {
                            const window = new Subject();
                            windows.push(window);
                            subscriber.next(window.asObservable());
                        }
                    }, () => {
                        while (windows.length > 0) {
                            windows.shift().complete();
                        }
                        subscriber.complete();
                    }, (err) => {
                        while (windows.length > 0) {
                            windows.shift().error(err);
                        }
                        subscriber.error(err);
                    }, () => {
                        starts = null;
                        windows = null;
                    }));
                });
            }

            function windowTime(windowTimeSpan, ...otherArgs) {
                var _a, _b;
                const scheduler = (_a = popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : asyncScheduler;
                const windowCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
                const maxWindowSize = otherArgs[1] || Infinity;
                return operate((source, subscriber) => {
                    let windowRecords = [];
                    let restartOnClose = false;
                    const closeWindow = (record) => {
                        const { window, subs } = record;
                        window.complete();
                        subs.unsubscribe();
                        arrRemove(windowRecords, record);
                        restartOnClose && startWindow();
                    };
                    const startWindow = () => {
                        if (windowRecords) {
                            const subs = new Subscription();
                            subscriber.add(subs);
                            const window = new Subject();
                            const record = {
                                window,
                                subs,
                                seen: 0,
                            };
                            windowRecords.push(record);
                            subscriber.next(window.asObservable());
                            executeSchedule(subs, scheduler, () => closeWindow(record), windowTimeSpan);
                        }
                    };
                    if (windowCreationInterval !== null && windowCreationInterval >= 0) {
                        executeSchedule(subscriber, scheduler, startWindow, windowCreationInterval, true);
                    }
                    else {
                        restartOnClose = true;
                    }
                    startWindow();
                    const loop = (cb) => windowRecords.slice().forEach(cb);
                    const terminate = (cb) => {
                        loop(({ window }) => cb(window));
                        cb(subscriber);
                        subscriber.unsubscribe();
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        loop((record) => {
                            record.window.next(value);
                            maxWindowSize <= ++record.seen && closeWindow(record);
                        });
                    }, () => terminate((consumer) => consumer.complete()), (err) => terminate((consumer) => consumer.error(err))));
                    return () => {
                        windowRecords = null;
                    };
                });
            }

            function windowToggle(openings, closingSelector) {
                return operate((source, subscriber) => {
                    const windows = [];
                    const handleError = (err) => {
                        while (0 < windows.length) {
                            windows.shift().error(err);
                        }
                        subscriber.error(err);
                    };
                    innerFrom(openings).subscribe(new OperatorSubscriber(subscriber, (openValue) => {
                        const window = new Subject();
                        windows.push(window);
                        const closingSubscription = new Subscription();
                        const closeWindow = () => {
                            arrRemove(windows, window);
                            window.complete();
                            closingSubscription.unsubscribe();
                        };
                        let closingNotifier;
                        try {
                            closingNotifier = innerFrom(closingSelector(openValue));
                        }
                        catch (err) {
                            handleError(err);
                            return;
                        }
                        subscriber.next(window.asObservable());
                        closingSubscription.add(closingNotifier.subscribe(new OperatorSubscriber(subscriber, closeWindow, noop, handleError)));
                    }, noop));
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const windowsCopy = windows.slice();
                        for (const window of windowsCopy) {
                            window.next(value);
                        }
                    }, () => {
                        while (0 < windows.length) {
                            windows.shift().complete();
                        }
                        subscriber.complete();
                    }, handleError, () => {
                        while (0 < windows.length) {
                            windows.shift().unsubscribe();
                        }
                    }));
                });
            }

            function windowWhen(closingSelector) {
                return operate((source, subscriber) => {
                    let window;
                    let closingSubscriber;
                    const handleError = (err) => {
                        window.error(err);
                        subscriber.error(err);
                    };
                    const openWindow = () => {
                        closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
                        window === null || window === void 0 ? void 0 : window.complete();
                        window = new Subject();
                        subscriber.next(window.asObservable());
                        let closingNotifier;
                        try {
                            closingNotifier = innerFrom(closingSelector());
                        }
                        catch (err) {
                            handleError(err);
                            return;
                        }
                        closingNotifier.subscribe((closingSubscriber = new OperatorSubscriber(subscriber, openWindow, openWindow, handleError)));
                    };
                    openWindow();
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => window.next(value), () => {
                        window.complete();
                        subscriber.complete();
                    }, handleError, () => {
                        closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
                        window = null;
                    }));
                });
            }

            function withLatestFrom(...inputs) {
                const project = popResultSelector(inputs);
                return operate((source, subscriber) => {
                    const len = inputs.length;
                    const otherValues = new Array(len);
                    let hasValue = inputs.map(() => false);
                    let ready = false;
                    for (let i = 0; i < len; i++) {
                        innerFrom(inputs[i]).subscribe(new OperatorSubscriber(subscriber, (value) => {
                            otherValues[i] = value;
                            if (!ready && !hasValue[i]) {
                                hasValue[i] = true;
                                (ready = hasValue.every(identity)) && (hasValue = null);
                            }
                        }, noop));
                    }
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        if (ready) {
                            const values = [value, ...otherValues];
                            subscriber.next(project ? project(...values) : values);
                        }
                    }));
                });
            }

            function zipAll(project) {
                return joinAllInternals(zip$1, project);
            }

            function zip(...sources) {
                return operate((source, subscriber) => {
                    zip$1(source, ...sources).subscribe(subscriber);
                });
            }

            function zipWith(...otherInputs) {
                return zip(...otherInputs);
            }

            function partition(predicate, thisArg) {
                return (source) => [filter(predicate, thisArg)(source), filter(not(predicate, thisArg))(source)];
            }

            function race(...args) {
                return raceWith(...argsOrArgArray(args));
            }

            function getXHRResponse(xhr) {
                switch (xhr.responseType) {
                    case 'json': {
                        if ('response' in xhr) {
                            return xhr.response;
                        }
                        else {
                            const ieXHR = xhr;
                            return JSON.parse(ieXHR.responseText);
                        }
                    }
                    case 'document':
                        return xhr.responseXML;
                    case 'text':
                    default: {
                        if ('response' in xhr) {
                            return xhr.response;
                        }
                        else {
                            const ieXHR = xhr;
                            return ieXHR.responseText;
                        }
                    }
                }
            }

            class AjaxResponse {
                constructor(originalEvent, xhr, request, type = 'download_load') {
                    this.originalEvent = originalEvent;
                    this.xhr = xhr;
                    this.request = request;
                    this.type = type;
                    const { status, responseType } = xhr;
                    this.status = status !== null && status !== void 0 ? status : 0;
                    this.responseType = responseType !== null && responseType !== void 0 ? responseType : '';
                    const allHeaders = xhr.getAllResponseHeaders();
                    this.responseHeaders = allHeaders
                        ?
                            allHeaders.split('\n').reduce((headers, line) => {
                                const index = line.indexOf(': ');
                                headers[line.slice(0, index)] = line.slice(index + 2);
                                return headers;
                            }, {})
                        : {};
                    this.response = getXHRResponse(xhr);
                    const { loaded, total } = originalEvent;
                    this.loaded = loaded;
                    this.total = total;
                }
            } exports('cb', AjaxResponse);

            const AjaxError = exports('c9', createErrorClass((_super) => function AjaxErrorImpl(message, xhr, request) {
                this.message = message;
                this.name = 'AjaxError';
                this.xhr = xhr;
                this.request = request;
                this.status = xhr.status;
                this.responseType = xhr.responseType;
                let response;
                try {
                    response = getXHRResponse(xhr);
                }
                catch (err) {
                    response = xhr.responseText;
                }
                this.response = response;
            }));
            const AjaxTimeoutError = exports('ca', (() => {
                function AjaxTimeoutErrorImpl(xhr, request) {
                    AjaxError.call(this, 'ajax timeout', xhr, request);
                    this.name = 'AjaxTimeoutError';
                    return this;
                }
                AjaxTimeoutErrorImpl.prototype = Object.create(AjaxError.prototype);
                return AjaxTimeoutErrorImpl;
            })());

            function ajaxGet(url, headers) {
                return ajax({ method: 'GET', url, headers });
            }
            function ajaxPost(url, body, headers) {
                return ajax({ method: 'POST', url, body, headers });
            }
            function ajaxDelete(url, headers) {
                return ajax({ method: 'DELETE', url, headers });
            }
            function ajaxPut(url, body, headers) {
                return ajax({ method: 'PUT', url, body, headers });
            }
            function ajaxPatch(url, body, headers) {
                return ajax({ method: 'PATCH', url, body, headers });
            }
            const mapResponse = map((x) => x.response);
            function ajaxGetJSON(url, headers) {
                return mapResponse(ajax({
                    method: 'GET',
                    url,
                    headers,
                }));
            }
            const ajax = exports('c8', (() => {
                const create = (urlOrConfig) => {
                    const config = typeof urlOrConfig === 'string'
                        ? {
                            url: urlOrConfig,
                        }
                        : urlOrConfig;
                    return fromAjax(config);
                };
                create.get = ajaxGet;
                create.post = ajaxPost;
                create.delete = ajaxDelete;
                create.put = ajaxPut;
                create.patch = ajaxPatch;
                create.getJSON = ajaxGetJSON;
                return create;
            })());
            const UPLOAD = 'upload';
            const DOWNLOAD = 'download';
            const LOADSTART = 'loadstart';
            const PROGRESS = 'progress';
            const LOAD = 'load';
            function fromAjax(config) {
                return new Observable((destination) => {
                    var _a, _b;
                    const { queryParams, body: configuredBody, headers: configuredHeaders } = config, remainingConfig = __rest(config, ["queryParams", "body", "headers"]);
                    let { url } = remainingConfig;
                    if (!url) {
                        throw new TypeError('url is required');
                    }
                    if (queryParams) {
                        let searchParams;
                        if (url.includes('?')) {
                            const parts = url.split('?');
                            if (2 < parts.length) {
                                throw new TypeError('invalid url');
                            }
                            searchParams = new URLSearchParams(parts[1]);
                            new URLSearchParams(queryParams).forEach((value, key) => searchParams.set(key, value));
                            url = parts[0] + '?' + searchParams;
                        }
                        else {
                            searchParams = new URLSearchParams(queryParams);
                            url = url + '?' + searchParams;
                        }
                    }
                    const headers = {};
                    if (configuredHeaders) {
                        for (const key in configuredHeaders) {
                            if (configuredHeaders.hasOwnProperty(key)) {
                                headers[key.toLowerCase()] = configuredHeaders[key];
                            }
                        }
                    }
                    if (!config.crossDomain && !('x-requested-with' in headers)) {
                        headers['x-requested-with'] = 'XMLHttpRequest';
                    }
                    const { withCredentials, xsrfCookieName, xsrfHeaderName } = remainingConfig;
                    if ((withCredentials || !remainingConfig.crossDomain) && xsrfCookieName && xsrfHeaderName) {
                        const xsrfCookie = (_b = (_a = document === null || document === void 0 ? void 0 : document.cookie.match(new RegExp(`(^|;\\s*)(${xsrfCookieName})=([^;]*)`))) === null || _a === void 0 ? void 0 : _a.pop()) !== null && _b !== void 0 ? _b : '';
                        if (xsrfCookie) {
                            headers[xsrfHeaderName] = xsrfCookie;
                        }
                    }
                    const body = extractContentTypeAndMaybeSerializeBody(configuredBody, headers);
                    const _request = Object.assign(Object.assign({ async: true, crossDomain: true, withCredentials: false, method: 'GET', timeout: 0, responseType: 'json' }, remainingConfig), { url,
                        headers,
                        body });
                    let xhr;
                    xhr = config.createXHR ? config.createXHR() : new XMLHttpRequest();
                    {
                        const { progressSubscriber, includeDownloadProgress = false, includeUploadProgress = false } = config;
                        const addErrorEvent = (type, errorFactory) => {
                            xhr.addEventListener(type, () => {
                                var _a;
                                const error = errorFactory();
                                (_a = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.error) === null || _a === void 0 ? void 0 : _a.call(progressSubscriber, error);
                                destination.error(error);
                            });
                        };
                        addErrorEvent('timeout', () => new AjaxTimeoutError(xhr, _request));
                        addErrorEvent('abort', () => new AjaxError('aborted', xhr, _request));
                        const createResponse = (direction, event) => new AjaxResponse(event, xhr, _request, `${direction}_${event.type}`);
                        const addProgressEvent = (target, type, direction) => {
                            target.addEventListener(type, (event) => {
                                destination.next(createResponse(direction, event));
                            });
                        };
                        if (includeUploadProgress) {
                            [LOADSTART, PROGRESS, LOAD].forEach((type) => addProgressEvent(xhr.upload, type, UPLOAD));
                        }
                        if (progressSubscriber) {
                            [LOADSTART, PROGRESS].forEach((type) => xhr.upload.addEventListener(type, (e) => { var _a; return (_a = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.next) === null || _a === void 0 ? void 0 : _a.call(progressSubscriber, e); }));
                        }
                        if (includeDownloadProgress) {
                            [LOADSTART, PROGRESS].forEach((type) => addProgressEvent(xhr, type, DOWNLOAD));
                        }
                        const emitError = (status) => {
                            const msg = 'ajax error' + (status ? ' ' + status : '');
                            destination.error(new AjaxError(msg, xhr, _request));
                        };
                        xhr.addEventListener('error', (e) => {
                            var _a;
                            (_a = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.error) === null || _a === void 0 ? void 0 : _a.call(progressSubscriber, e);
                            emitError();
                        });
                        xhr.addEventListener(LOAD, (event) => {
                            var _a, _b;
                            const { status } = xhr;
                            if (status < 400) {
                                (_a = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.complete) === null || _a === void 0 ? void 0 : _a.call(progressSubscriber);
                                let response;
                                try {
                                    response = createResponse(DOWNLOAD, event);
                                }
                                catch (err) {
                                    destination.error(err);
                                    return;
                                }
                                destination.next(response);
                                destination.complete();
                            }
                            else {
                                (_b = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.error) === null || _b === void 0 ? void 0 : _b.call(progressSubscriber, event);
                                emitError(status);
                            }
                        });
                    }
                    const { user, method, async } = _request;
                    if (user) {
                        xhr.open(method, url, async, user, _request.password);
                    }
                    else {
                        xhr.open(method, url, async);
                    }
                    if (async) {
                        xhr.timeout = _request.timeout;
                        xhr.responseType = _request.responseType;
                    }
                    if ('withCredentials' in xhr) {
                        xhr.withCredentials = _request.withCredentials;
                    }
                    for (const key in headers) {
                        if (headers.hasOwnProperty(key)) {
                            xhr.setRequestHeader(key, headers[key]);
                        }
                    }
                    if (body) {
                        xhr.send(body);
                    }
                    else {
                        xhr.send();
                    }
                    return () => {
                        if (xhr && xhr.readyState !== 4) {
                            xhr.abort();
                        }
                    };
                });
            }
            function extractContentTypeAndMaybeSerializeBody(body, headers) {
                var _a;
                if (!body ||
                    typeof body === 'string' ||
                    isFormData(body) ||
                    isURLSearchParams(body) ||
                    isArrayBuffer(body) ||
                    isFile(body) ||
                    isBlob(body) ||
                    isReadableStream(body)) {
                    return body;
                }
                if (isArrayBufferView(body)) {
                    return body.buffer;
                }
                if (typeof body === 'object') {
                    headers['content-type'] = (_a = headers['content-type']) !== null && _a !== void 0 ? _a : 'application/json;charset=utf-8';
                    return JSON.stringify(body);
                }
                throw new TypeError('Unknown body type');
            }
            const _toString = Object.prototype.toString;
            function toStringCheck(obj, name) {
                return _toString.call(obj) === `[object ${name}]`;
            }
            function isArrayBuffer(body) {
                return toStringCheck(body, 'ArrayBuffer');
            }
            function isFile(body) {
                return toStringCheck(body, 'File');
            }
            function isBlob(body) {
                return toStringCheck(body, 'Blob');
            }
            function isArrayBufferView(body) {
                return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(body);
            }
            function isFormData(body) {
                return typeof FormData !== 'undefined' && body instanceof FormData;
            }
            function isURLSearchParams(body) {
                return typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;
            }
            function isReadableStream(body) {
                return typeof ReadableStream !== 'undefined' && body instanceof ReadableStream;
            }

            function fromFetch(input, initWithSelector = {}) {
                const { selector } = initWithSelector, init = __rest(initWithSelector, ["selector"]);
                return new Observable((subscriber) => {
                    const controller = new AbortController();
                    const { signal } = controller;
                    let abortable = true;
                    const { signal: outerSignal } = init;
                    if (outerSignal) {
                        if (outerSignal.aborted) {
                            controller.abort();
                        }
                        else {
                            const outerSignalHandler = () => {
                                if (!signal.aborted) {
                                    controller.abort();
                                }
                            };
                            outerSignal.addEventListener('abort', outerSignalHandler);
                            subscriber.add(() => outerSignal.removeEventListener('abort', outerSignalHandler));
                        }
                    }
                    const perSubscriberInit = Object.assign(Object.assign({}, init), { signal });
                    const handleError = (err) => {
                        abortable = false;
                        subscriber.error(err);
                    };
                    fetch(input, perSubscriberInit)
                        .then((response) => {
                        if (selector) {
                            innerFrom(selector(response)).subscribe(new OperatorSubscriber(subscriber, undefined, () => {
                                abortable = false;
                                subscriber.complete();
                            }, handleError));
                        }
                        else {
                            abortable = false;
                            subscriber.next(response);
                            subscriber.complete();
                        }
                    })
                        .catch(handleError);
                    return () => {
                        if (abortable) {
                            controller.abort();
                        }
                    };
                });
            }

            const DEFAULT_WEBSOCKET_CONFIG = {
                url: '',
                deserializer: (e) => JSON.parse(e.data),
                serializer: (value) => JSON.stringify(value),
            };
            const WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT = 'WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }';
            class WebSocketSubject extends AnonymousSubject {
                constructor(urlConfigOrSource, destination) {
                    super();
                    this._socket = null;
                    if (urlConfigOrSource instanceof Observable) {
                        this.destination = destination;
                        this.source = urlConfigOrSource;
                    }
                    else {
                        const config = (this._config = Object.assign({}, DEFAULT_WEBSOCKET_CONFIG));
                        this._output = new Subject();
                        if (typeof urlConfigOrSource === 'string') {
                            config.url = urlConfigOrSource;
                        }
                        else {
                            for (const key in urlConfigOrSource) {
                                if (urlConfigOrSource.hasOwnProperty(key)) {
                                    config[key] = urlConfigOrSource[key];
                                }
                            }
                        }
                        if (!config.WebSocketCtor && WebSocket) {
                            config.WebSocketCtor = WebSocket;
                        }
                        else if (!config.WebSocketCtor) {
                            throw new Error('no WebSocket constructor can be found');
                        }
                        this.destination = new ReplaySubject();
                    }
                }
                lift(operator) {
                    const sock = new WebSocketSubject(this._config, this.destination);
                    sock.operator = operator;
                    sock.source = this;
                    return sock;
                }
                _resetState() {
                    this._socket = null;
                    if (!this.source) {
                        this.destination = new ReplaySubject();
                    }
                    this._output = new Subject();
                }
                multiplex(subMsg, unsubMsg, messageFilter) {
                    const self = this;
                    return new Observable((observer) => {
                        try {
                            self.next(subMsg());
                        }
                        catch (err) {
                            observer.error(err);
                        }
                        const subscription = self.subscribe((x) => {
                            try {
                                if (messageFilter(x)) {
                                    observer.next(x);
                                }
                            }
                            catch (err) {
                                observer.error(err);
                            }
                        }, (err) => observer.error(err), () => observer.complete());
                        return () => {
                            try {
                                self.next(unsubMsg());
                            }
                            catch (err) {
                                observer.error(err);
                            }
                            subscription.unsubscribe();
                        };
                    });
                }
                _connectSocket() {
                    const { WebSocketCtor, protocol, url, binaryType } = this._config;
                    const observer = this._output;
                    let socket = null;
                    try {
                        socket = protocol ? new WebSocketCtor(url, protocol) : new WebSocketCtor(url);
                        this._socket = socket;
                        if (binaryType) {
                            this._socket.binaryType = binaryType;
                        }
                    }
                    catch (e) {
                        observer.error(e);
                        return;
                    }
                    const subscription = new Subscription(() => {
                        this._socket = null;
                        if (socket && socket.readyState === 1) {
                            socket.close();
                        }
                    });
                    socket.onopen = (evt) => {
                        const { _socket } = this;
                        if (!_socket) {
                            socket.close();
                            this._resetState();
                            return;
                        }
                        const { openObserver } = this._config;
                        if (openObserver) {
                            openObserver.next(evt);
                        }
                        const queue = this.destination;
                        this.destination = Subscriber.create((x) => {
                            if (socket.readyState === 1) {
                                try {
                                    const { serializer } = this._config;
                                    socket.send(serializer(x));
                                }
                                catch (e) {
                                    this.destination.error(e);
                                }
                            }
                        }, (err) => {
                            const { closingObserver } = this._config;
                            if (closingObserver) {
                                closingObserver.next(undefined);
                            }
                            if (err && err.code) {
                                socket.close(err.code, err.reason);
                            }
                            else {
                                observer.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT));
                            }
                            this._resetState();
                        }, () => {
                            const { closingObserver } = this._config;
                            if (closingObserver) {
                                closingObserver.next(undefined);
                            }
                            socket.close();
                            this._resetState();
                        });
                        if (queue && queue instanceof ReplaySubject) {
                            subscription.add(queue.subscribe(this.destination));
                        }
                    };
                    socket.onerror = (e) => {
                        this._resetState();
                        observer.error(e);
                    };
                    socket.onclose = (e) => {
                        this._resetState();
                        const { closeObserver } = this._config;
                        if (closeObserver) {
                            closeObserver.next(e);
                        }
                        if (e.wasClean) {
                            observer.complete();
                        }
                        else {
                            observer.error(e);
                        }
                    };
                    socket.onmessage = (e) => {
                        try {
                            const { deserializer } = this._config;
                            observer.next(deserializer(e));
                        }
                        catch (err) {
                            observer.error(err);
                        }
                    };
                }
                _subscribe(subscriber) {
                    const { source } = this;
                    if (source) {
                        return source.subscribe(subscriber);
                    }
                    if (!this._socket) {
                        this._connectSocket();
                    }
                    this._output.subscribe(subscriber);
                    subscriber.add(() => {
                        const { _socket } = this;
                        if (this._output.observers.length === 0) {
                            if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
                                _socket.close();
                            }
                            this._resetState();
                        }
                    });
                    return subscriber;
                }
                unsubscribe() {
                    const { _socket } = this;
                    if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
                        _socket.close();
                    }
                    this._resetState();
                    super.unsubscribe();
                }
            } exports('ce', WebSocketSubject);

            function webSocket(urlConfigOrSource) {
                return new WebSocketSubject(urlConfigOrSource);
            }

            function applyMixins(derivedCtor, baseCtors) {
                for (let i = 0, len = baseCtors.length; i < len; i++) {
                    const baseCtor = baseCtors[i];
                    const propertyKeys = Object.getOwnPropertyNames(baseCtor.prototype);
                    for (let j = 0, len2 = propertyKeys.length; j < len2; j++) {
                        const name = propertyKeys[j];
                        derivedCtor.prototype[name] = baseCtor.prototype[name];
                    }
                }
            }

        })
    };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnhqcy1zaGFyZWQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaXNGdW5jdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvY3JlYXRlRXJyb3JDbGFzcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvYXJyUmVtb3ZlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvU3Vic2NyaXB0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvY29uZmlnLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL3RpbWVvdXRQcm92aWRlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvcmVwb3J0VW5oYW5kbGVkRXJyb3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL25vb3AuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9Ob3RpZmljYXRpb25GYWN0b3JpZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL2Vycm9yQ29udGV4dC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL1N1YnNjcmliZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zeW1ib2wvb2JzZXJ2YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaWRlbnRpdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL3BpcGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9PYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9saWZ0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL09wZXJhdG9yU3Vic2NyaWJlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9yZWZDb3VudC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL3BlcmZvcm1hbmNlVGltZXN0YW1wUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZXIvYW5pbWF0aW9uRnJhbWVQcm92aWRlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvZG9tL2FuaW1hdGlvbkZyYW1lcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9TdWJqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvQmVoYXZpb3JTdWJqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL2RhdGVUaW1lc3RhbXBQcm92aWRlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL1JlcGxheVN1YmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9Bc3luY1N1YmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZXIvQWN0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL2ludGVydmFsUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZXIvQXN5bmNBY3Rpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL0ltbWVkaWF0ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9pbW1lZGlhdGVQcm92aWRlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9Bc2FwQWN0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvU2NoZWR1bGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL0FzeW5jU2NoZWR1bGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL0FzYXBTY2hlZHVsZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZXIvYXNhcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9hc3luYy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9RdWV1ZUFjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9RdWV1ZVNjaGVkdWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9xdWV1ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9BbmltYXRpb25GcmFtZUFjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9BbmltYXRpb25GcmFtZVNjaGVkdWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9hbmltYXRpb25GcmFtZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9WaXJ0dWFsVGltZVNjaGVkdWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvZW1wdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL2lzU2NoZWR1bGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9hcmdzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaXNBcnJheUxpa2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL2lzUHJvbWlzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaXNJbnRlcm9wT2JzZXJ2YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaXNBc3luY0l0ZXJhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC90aHJvd1Vub2JzZXJ2YWJsZUVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc3ltYm9sL2l0ZXJhdG9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9pc0l0ZXJhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9pc1JlYWRhYmxlU3RyZWFtTGlrZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvaW5uZXJGcm9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9leGVjdXRlU2NoZWR1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvb2JzZXJ2ZU9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3N1YnNjcmliZU9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVkL3NjaGVkdWxlT2JzZXJ2YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZVByb21pc2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZWQvc2NoZWR1bGVBcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZUl0ZXJhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVkL3NjaGVkdWxlQXN5bmNJdGVyYWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZVJlYWRhYmxlU3RyZWFtTGlrZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb20uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL29mLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS90aHJvd0Vycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvTm90aWZpY2F0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9pc09ic2VydmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL0VtcHR5RXJyb3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9sYXN0VmFsdWVGcm9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvZmlyc3RWYWx1ZUZyb20uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9Ob3RGb3VuZEVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9TZXF1ZW5jZUVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9pc0RhdGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGltZW91dC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9tYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL21hcE9uZU9yTWFueUFyZ3MuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2JpbmRDYWxsYmFja0ludGVybmFscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvYmluZENhbGxiYWNrLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9iaW5kTm9kZUNhbGxiYWNrLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9hcmdzQXJnQXJyYXlPck9iamVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvY3JlYXRlT2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9jb21iaW5lTGF0ZXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlSW50ZXJuYWxzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlTWFwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlQWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2NvbmNhdEFsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvY29uY2F0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9kZWZlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvY29ubmVjdGFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2ZvcmtKb2luLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tRXZlbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21FdmVudFBhdHRlcm4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2dlbmVyYXRlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9paWYuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL3RpbWVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9pbnRlcnZhbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvbWVyZ2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL25ldmVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9hcmdzT3JBcmdBcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9vbkVycm9yUmVzdW1lTmV4dC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvb25FcnJvclJlc3VtZU5leHQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL3BhaXJzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9ub3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZmlsdGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9wYXJ0aXRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhY2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhbmdlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS91c2luZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvemlwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2F1ZGl0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2F1ZGl0VGltZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9idWZmZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyQ291bnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyVGltZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9idWZmZXJUb2dnbGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyV2hlbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jYXRjaEVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3NjYW5JbnRlcm5hbHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmVkdWNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3RvQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvam9pbkFsbEludGVybmFscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jb21iaW5lTGF0ZXN0QWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2NvbWJpbmVBbGwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvY29tYmluZUxhdGVzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jb21iaW5lTGF0ZXN0V2l0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jb25jYXRNYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvY29uY2F0TWFwVG8uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvY29uY2F0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2NvbmNhdFdpdGguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21TdWJzY3JpYmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvY29ubmVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jb3VudC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kZWJvdW5jZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kZWJvdW5jZVRpbWUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZGVmYXVsdElmRW1wdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9pZ25vcmVFbGVtZW50cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9tYXBUby5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kZWxheVdoZW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZGVsYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZGVtYXRlcmlhbGl6ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdFVudGlsQ2hhbmdlZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdFVudGlsS2V5Q2hhbmdlZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90aHJvd0lmRW1wdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZWxlbWVudEF0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2VuZFdpdGguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZXZlcnkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZXhoYXVzdEFsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9leGhhdXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2V4aGF1c3RNYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZXhwYW5kLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2ZpbmFsaXplLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2ZpbmQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZmluZEluZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2ZpcnN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2dyb3VwQnkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvaXNFbXB0eS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90YWtlTGFzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9sYXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21hdGVyaWFsaXplLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21heC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9mbGF0TWFwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlTWFwVG8uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvbWVyZ2VTY2FuLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlV2l0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9taW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvbXVsdGljYXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3BhaXJ3aXNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3BsdWNrLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3B1Ymxpc2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcHVibGlzaEJlaGF2aW9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3B1Ymxpc2hMYXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3B1Ymxpc2hSZXBsYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmFjZVdpdGguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmVwZWF0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3JlcGVhdFdoZW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmV0cnkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmV0cnlXaGVuLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3NhbXBsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zYW1wbGVUaW1lLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3NjYW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvc2VxdWVuY2VFcXVhbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zaGFyZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zaGFyZVJlcGxheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zaW5nbGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvc2tpcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9za2lwTGFzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9za2lwVW50aWwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvc2tpcFdoaWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3N0YXJ0V2l0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zd2l0Y2hNYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvc3dpdGNoQWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3N3aXRjaE1hcFRvLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3N3aXRjaFNjYW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZVVudGlsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3Rha2VXaGlsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90YXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGhyb3R0bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGhyb3R0bGVUaW1lLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3RpbWVJbnRlcnZhbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90aW1lb3V0V2l0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90aW1lc3RhbXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvd2luZG93LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvd0NvdW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvd1RpbWUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvd2luZG93VG9nZ2xlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvd1doZW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvd2l0aExhdGVzdEZyb20uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvemlwQWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3ppcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy96aXBXaXRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3BhcnRpdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9yYWNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvYWpheC9nZXRYSFJSZXNwb25zZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL2FqYXgvQWpheFJlc3BvbnNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvYWpheC9lcnJvcnMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9hamF4L2FqYXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2RvbS9mZXRjaC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvZG9tL1dlYlNvY2tldFN1YmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2RvbS93ZWJTb2NrZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL2FwcGx5TWl4aW5zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzRnVuY3Rpb24uanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVycm9yQ2xhc3MoY3JlYXRlSW1wbCkge1xuICAgIGNvbnN0IF9zdXBlciA9IChpbnN0YW5jZSkgPT4ge1xuICAgICAgICBFcnJvci5jYWxsKGluc3RhbmNlKTtcbiAgICAgICAgaW5zdGFuY2Uuc3RhY2sgPSBuZXcgRXJyb3IoKS5zdGFjaztcbiAgICB9O1xuICAgIGNvbnN0IGN0b3JGdW5jID0gY3JlYXRlSW1wbChfc3VwZXIpO1xuICAgIGN0b3JGdW5jLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgICBjdG9yRnVuYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yRnVuYztcbiAgICByZXR1cm4gY3RvckZ1bmM7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGVFcnJvckNsYXNzLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuL2NyZWF0ZUVycm9yQ2xhc3MnO1xuZXhwb3J0IGNvbnN0IFVuc3Vic2NyaXB0aW9uRXJyb3IgPSBjcmVhdGVFcnJvckNsYXNzKChfc3VwZXIpID0+IGZ1bmN0aW9uIFVuc3Vic2NyaXB0aW9uRXJyb3JJbXBsKGVycm9ycykge1xuICAgIF9zdXBlcih0aGlzKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBlcnJvcnNcbiAgICAgICAgPyBgJHtlcnJvcnMubGVuZ3RofSBlcnJvcnMgb2NjdXJyZWQgZHVyaW5nIHVuc3Vic2NyaXB0aW9uOlxuJHtlcnJvcnMubWFwKChlcnIsIGkpID0+IGAke2kgKyAxfSkgJHtlcnIudG9TdHJpbmcoKX1gKS5qb2luKCdcXG4gICcpfWBcbiAgICAgICAgOiAnJztcbiAgICB0aGlzLm5hbWUgPSAnVW5zdWJzY3JpcHRpb25FcnJvcic7XG4gICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVVuc3Vic2NyaXB0aW9uRXJyb3IuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGFyclJlbW92ZShhcnIsIGl0ZW0pIHtcbiAgICBpZiAoYXJyKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG4gICAgICAgIDAgPD0gaW5kZXggJiYgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJyUmVtb3ZlLmpzLm1hcCIsImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBVbnN1YnNjcmlwdGlvbkVycm9yIH0gZnJvbSAnLi91dGlsL1Vuc3Vic2NyaXB0aW9uRXJyb3InO1xuaW1wb3J0IHsgYXJyUmVtb3ZlIH0gZnJvbSAnLi91dGlsL2FyclJlbW92ZSc7XG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsVGVhcmRvd24pIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVGVhcmRvd24gPSBpbml0aWFsVGVhcmRvd247XG4gICAgICAgIHRoaXMuY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlYXJkb3ducyA9IG51bGw7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBsZXQgZXJyb3JzO1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCB7IF9wYXJlbnRhZ2UgfSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoX3BhcmVudGFnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXJlbnQgb2YgX3BhcmVudGFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3BhcmVudGFnZS5yZW1vdmUodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBpbml0aWFsVGVhcmRvd24gfSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihpbml0aWFsVGVhcmRvd24pKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFRlYXJkb3duKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IGUgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yID8gZS5lcnJvcnMgOiBbZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBfdGVhcmRvd25zIH0gPSB0aGlzO1xuICAgICAgICAgICAgaWYgKF90ZWFyZG93bnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90ZWFyZG93bnMgPSBudWxsO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGVhcmRvd24gb2YgX3RlYXJkb3ducykge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhlY1RlYXJkb3duKHRlYXJkb3duKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMgIT09IG51bGwgJiYgZXJyb3JzICE9PSB2b2lkIDAgPyBlcnJvcnMgOiBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gWy4uLmVycm9ycywgLi4uZXJyLmVycm9yc107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBVbnN1YnNjcmlwdGlvbkVycm9yKGVycm9ycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKHRlYXJkb3duKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKHRlYXJkb3duICYmIHRlYXJkb3duICE9PSB0aGlzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBleGVjVGVhcmRvd24odGVhcmRvd24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRlYXJkb3duIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZWFyZG93bi5jbG9zZWQgfHwgdGVhcmRvd24uX2hhc1BhcmVudCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRlYXJkb3duLl9hZGRQYXJlbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICh0aGlzLl90ZWFyZG93bnMgPSAoX2EgPSB0aGlzLl90ZWFyZG93bnMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdKS5wdXNoKHRlYXJkb3duKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfaGFzUGFyZW50KHBhcmVudCkge1xuICAgICAgICBjb25zdCB7IF9wYXJlbnRhZ2UgfSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBfcGFyZW50YWdlID09PSBwYXJlbnQgfHwgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkgJiYgX3BhcmVudGFnZS5pbmNsdWRlcyhwYXJlbnQpKTtcbiAgICB9XG4gICAgX2FkZFBhcmVudChwYXJlbnQpIHtcbiAgICAgICAgY29uc3QgeyBfcGFyZW50YWdlIH0gPSB0aGlzO1xuICAgICAgICB0aGlzLl9wYXJlbnRhZ2UgPSBBcnJheS5pc0FycmF5KF9wYXJlbnRhZ2UpID8gKF9wYXJlbnRhZ2UucHVzaChwYXJlbnQpLCBfcGFyZW50YWdlKSA6IF9wYXJlbnRhZ2UgPyBbX3BhcmVudGFnZSwgcGFyZW50XSA6IHBhcmVudDtcbiAgICB9XG4gICAgX3JlbW92ZVBhcmVudChwYXJlbnQpIHtcbiAgICAgICAgY29uc3QgeyBfcGFyZW50YWdlIH0gPSB0aGlzO1xuICAgICAgICBpZiAoX3BhcmVudGFnZSA9PT0gcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnRhZ2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkpIHtcbiAgICAgICAgICAgIGFyclJlbW92ZShfcGFyZW50YWdlLCBwYXJlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZSh0ZWFyZG93bikge1xuICAgICAgICBjb25zdCB7IF90ZWFyZG93bnMgfSA9IHRoaXM7XG4gICAgICAgIF90ZWFyZG93bnMgJiYgYXJyUmVtb3ZlKF90ZWFyZG93bnMsIHRlYXJkb3duKTtcbiAgICAgICAgaWYgKHRlYXJkb3duIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0ZWFyZG93bi5fcmVtb3ZlUGFyZW50KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuU3Vic2NyaXB0aW9uLkVNUFRZID0gKCgpID0+IHtcbiAgICBjb25zdCBlbXB0eSA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBlbXB0eS5jbG9zZWQgPSB0cnVlO1xuICAgIHJldHVybiBlbXB0eTtcbn0pKCk7XG5leHBvcnQgY29uc3QgRU1QVFlfU1VCU0NSSVBUSU9OID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3Vic2NyaXB0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIFN1YnNjcmlwdGlvbiB8fFxuICAgICAgICAodmFsdWUgJiYgJ2Nsb3NlZCcgaW4gdmFsdWUgJiYgaXNGdW5jdGlvbih2YWx1ZS5yZW1vdmUpICYmIGlzRnVuY3Rpb24odmFsdWUuYWRkKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnVuc3Vic2NyaWJlKSkpO1xufVxuZnVuY3Rpb24gZXhlY1RlYXJkb3duKHRlYXJkb3duKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odGVhcmRvd24pKSB7XG4gICAgICAgIHRlYXJkb3duKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0ZWFyZG93bi51bnN1YnNjcmliZSgpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN1YnNjcmlwdGlvbi5qcy5tYXAiLCJleHBvcnQgY29uc3QgY29uZmlnID0ge1xuICAgIG9uVW5oYW5kbGVkRXJyb3I6IG51bGwsXG4gICAgb25TdG9wcGVkTm90aWZpY2F0aW9uOiBudWxsLFxuICAgIFByb21pc2U6IHVuZGVmaW5lZCxcbiAgICB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nOiBmYWxzZSxcbiAgICB1c2VEZXByZWNhdGVkTmV4dENvbnRleHQ6IGZhbHNlLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbmZpZy5qcy5tYXAiLCJleHBvcnQgY29uc3QgdGltZW91dFByb3ZpZGVyID0ge1xuICAgIHNldFRpbWVvdXQoLi4uYXJncykge1xuICAgICAgICBjb25zdCB7IGRlbGVnYXRlIH0gPSB0aW1lb3V0UHJvdmlkZXI7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5zZXRUaW1lb3V0KSB8fCBzZXRUaW1lb3V0KSguLi5hcmdzKTtcbiAgICB9LFxuICAgIGNsZWFyVGltZW91dChoYW5kbGUpIHtcbiAgICAgICAgY29uc3QgeyBkZWxlZ2F0ZSB9ID0gdGltZW91dFByb3ZpZGVyO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuY2xlYXJUaW1lb3V0KSB8fCBjbGVhclRpbWVvdXQpKGhhbmRsZSk7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWVvdXRQcm92aWRlci5qcy5tYXAiLCJpbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHsgdGltZW91dFByb3ZpZGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL3RpbWVvdXRQcm92aWRlcic7XG5leHBvcnQgZnVuY3Rpb24gcmVwb3J0VW5oYW5kbGVkRXJyb3IoZXJyKSB7XG4gICAgdGltZW91dFByb3ZpZGVyLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCB7IG9uVW5oYW5kbGVkRXJyb3IgfSA9IGNvbmZpZztcbiAgICAgICAgaWYgKG9uVW5oYW5kbGVkRXJyb3IpIHtcbiAgICAgICAgICAgIG9uVW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVwb3J0VW5oYW5kbGVkRXJyb3IuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKSB7IH1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vb3AuanMubWFwIiwiZXhwb3J0IGNvbnN0IENPTVBMRVRFX05PVElGSUNBVElPTiA9ICgoKSA9PiBjcmVhdGVOb3RpZmljYXRpb24oJ0MnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCkpKCk7XG5leHBvcnQgZnVuY3Rpb24gZXJyb3JOb3RpZmljYXRpb24oZXJyb3IpIHtcbiAgICByZXR1cm4gY3JlYXRlTm90aWZpY2F0aW9uKCdFJywgdW5kZWZpbmVkLCBlcnJvcik7XG59XG5leHBvcnQgZnVuY3Rpb24gbmV4dE5vdGlmaWNhdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBjcmVhdGVOb3RpZmljYXRpb24oJ04nLCB2YWx1ZSwgdW5kZWZpbmVkKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOb3RpZmljYXRpb24oa2luZCwgdmFsdWUsIGVycm9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2luZCxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGVycm9yLFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob3RpZmljYXRpb25GYWN0b3JpZXMuanMubWFwIiwiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmxldCBjb250ZXh0ID0gbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBlcnJvckNvbnRleHQoY2IpIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgY29uc3QgaXNSb290ID0gIWNvbnRleHQ7XG4gICAgICAgIGlmIChpc1Jvb3QpIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSB7IGVycm9yVGhyb3duOiBmYWxzZSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBjYigpO1xuICAgICAgICBpZiAoaXNSb290KSB7XG4gICAgICAgICAgICBjb25zdCB7IGVycm9yVGhyb3duLCBlcnJvciB9ID0gY29udGV4dDtcbiAgICAgICAgICAgIGNvbnRleHQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNiKCk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGNhcHR1cmVFcnJvcihlcnIpIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgJiYgY29udGV4dCkge1xuICAgICAgICBjb250ZXh0LmVycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgY29udGV4dC5lcnJvciA9IGVycjtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lcnJvckNvbnRleHQuanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGlzU3Vic2NyaXB0aW9uLCBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyByZXBvcnRVbmhhbmRsZWRFcnJvciB9IGZyb20gJy4vdXRpbC9yZXBvcnRVbmhhbmRsZWRFcnJvcic7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgbmV4dE5vdGlmaWNhdGlvbiwgZXJyb3JOb3RpZmljYXRpb24sIENPTVBMRVRFX05PVElGSUNBVElPTiB9IGZyb20gJy4vTm90aWZpY2F0aW9uRmFjdG9yaWVzJztcbmltcG9ydCB7IHRpbWVvdXRQcm92aWRlciB9IGZyb20gJy4vc2NoZWR1bGVyL3RpbWVvdXRQcm92aWRlcic7XG5pbXBvcnQgeyBjYXB0dXJlRXJyb3IgfSBmcm9tICcuL3V0aWwvZXJyb3JDb250ZXh0JztcbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmVyIGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoZGVzdGluYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIGlmIChpc1N1YnNjcmlwdGlvbihkZXN0aW5hdGlvbikpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5hZGQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gRU1QVFlfT0JTRVJWRVI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShuZXh0LCBlcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTYWZlU3Vic2NyaWJlcihuZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgIH1cbiAgICBuZXh0KHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgaGFuZGxlU3RvcHBlZE5vdGlmaWNhdGlvbihuZXh0Tm90aWZpY2F0aW9uKHZhbHVlKSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlcnJvcihlcnIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICBoYW5kbGVTdG9wcGVkTm90aWZpY2F0aW9uKGVycm9yTm90aWZpY2F0aW9uKGVyciksIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICBoYW5kbGVTdG9wcGVkTm90aWZpY2F0aW9uKENPTVBMRVRFX05PVElGSUNBVElPTiwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX25leHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9XG4gICAgX2Vycm9yKGVycikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9jb21wbGV0ZSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTYWZlU3Vic2NyaWJlciBleHRlbmRzIFN1YnNjcmliZXIge1xuICAgIGNvbnN0cnVjdG9yKG9ic2VydmVyT3JOZXh0LCBlcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgbGV0IG5leHQ7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKG9ic2VydmVyT3JOZXh0KSkge1xuICAgICAgICAgICAgbmV4dCA9IG9ic2VydmVyT3JOZXh0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9ic2VydmVyT3JOZXh0KSB7XG4gICAgICAgICAgICAoeyBuZXh0LCBlcnJvciwgY29tcGxldGUgfSA9IG9ic2VydmVyT3JOZXh0KTtcbiAgICAgICAgICAgIGxldCBjb250ZXh0O1xuICAgICAgICAgICAgaWYgKHRoaXMgJiYgY29uZmlnLnVzZURlcHJlY2F0ZWROZXh0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBPYmplY3QuY3JlYXRlKG9ic2VydmVyT3JOZXh0KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnVuc3Vic2NyaWJlID0gKCkgPT4gdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IG9ic2VydmVyT3JOZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dCA9IG5leHQgPT09IG51bGwgfHwgbmV4dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogbmV4dC5iaW5kKGNvbnRleHQpO1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvciA9PT0gbnVsbCB8fCBlcnJvciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyb3IuYmluZChjb250ZXh0KTtcbiAgICAgICAgICAgIGNvbXBsZXRlID0gY29tcGxldGUgPT09IG51bGwgfHwgY29tcGxldGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbXBsZXRlLmJpbmQoY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IHtcbiAgICAgICAgICAgIG5leHQ6IG5leHQgPyB3cmFwRm9yRXJyb3JIYW5kbGluZyhuZXh0LCB0aGlzKSA6IG5vb3AsXG4gICAgICAgICAgICBlcnJvcjogd3JhcEZvckVycm9ySGFuZGxpbmcoZXJyb3IgIT09IG51bGwgJiYgZXJyb3IgIT09IHZvaWQgMCA/IGVycm9yIDogZGVmYXVsdEVycm9ySGFuZGxlciwgdGhpcyksXG4gICAgICAgICAgICBjb21wbGV0ZTogY29tcGxldGUgPyB3cmFwRm9yRXJyb3JIYW5kbGluZyhjb21wbGV0ZSwgdGhpcykgOiBub29wLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmZ1bmN0aW9uIHdyYXBGb3JFcnJvckhhbmRsaW5nKGhhbmRsZXIsIGluc3RhbmNlKSB7XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgICAgICAgIGNhcHR1cmVFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVwb3J0VW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBkZWZhdWx0RXJyb3JIYW5kbGVyKGVycikge1xuICAgIHRocm93IGVycjtcbn1cbmZ1bmN0aW9uIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24obm90aWZpY2F0aW9uLCBzdWJzY3JpYmVyKSB7XG4gICAgY29uc3QgeyBvblN0b3BwZWROb3RpZmljYXRpb24gfSA9IGNvbmZpZztcbiAgICBvblN0b3BwZWROb3RpZmljYXRpb24gJiYgdGltZW91dFByb3ZpZGVyLnNldFRpbWVvdXQoKCkgPT4gb25TdG9wcGVkTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbiwgc3Vic2NyaWJlcikpO1xufVxuZXhwb3J0IGNvbnN0IEVNUFRZX09CU0VSVkVSID0ge1xuICAgIGNsb3NlZDogdHJ1ZSxcbiAgICBuZXh0OiBub29wLFxuICAgIGVycm9yOiBkZWZhdWx0RXJyb3JIYW5kbGVyLFxuICAgIGNvbXBsZXRlOiBub29wLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN1YnNjcmliZXIuanMubWFwIiwiZXhwb3J0IGNvbnN0IG9ic2VydmFibGUgPSAoKCkgPT4gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLm9ic2VydmFibGUpIHx8ICdAQG9ic2VydmFibGUnKSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2JzZXJ2YWJsZS5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICAgIHJldHVybiB4O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aWRlbnRpdHkuanMubWFwIiwiaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiBwaXBlKC4uLmZucykge1xuICAgIHJldHVybiBwaXBlRnJvbUFycmF5KGZucyk7XG59XG5leHBvcnQgZnVuY3Rpb24gcGlwZUZyb21BcnJheShmbnMpIHtcbiAgICBpZiAoZm5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gaWRlbnRpdHk7XG4gICAgfVxuICAgIGlmIChmbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBmbnNbMF07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiBwaXBlZChpbnB1dCkge1xuICAgICAgICByZXR1cm4gZm5zLnJlZHVjZSgocHJldiwgZm4pID0+IGZuKHByZXYpLCBpbnB1dCk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcGUuanMubWFwIiwiaW1wb3J0IHsgU2FmZVN1YnNjcmliZXIsIFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgaXNTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBwaXBlRnJvbUFycmF5IH0gZnJvbSAnLi91dGlsL3BpcGUnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGVycm9yQ29udGV4dCB9IGZyb20gJy4vdXRpbC9lcnJvckNvbnRleHQnO1xuZXhwb3J0IGNsYXNzIE9ic2VydmFibGUge1xuICAgIGNvbnN0cnVjdG9yKHN1YnNjcmliZSkge1xuICAgICAgICBpZiAoc3Vic2NyaWJlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmUgPSBzdWJzY3JpYmU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGlmdChvcGVyYXRvcikge1xuICAgICAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgb2JzZXJ2YWJsZS5zb3VyY2UgPSB0aGlzO1xuICAgICAgICBvYnNlcnZhYmxlLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICAgIH1cbiAgICBzdWJzY3JpYmUob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVyID0gaXNTdWJzY3JpYmVyKG9ic2VydmVyT3JOZXh0KSA/IG9ic2VydmVyT3JOZXh0IDogbmV3IFNhZmVTdWJzY3JpYmVyKG9ic2VydmVyT3JOZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgICAgICBlcnJvckNvbnRleHQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcGVyYXRvciwgc291cmNlIH0gPSB0aGlzO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQob3BlcmF0b3JcbiAgICAgICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yLmNhbGwoc3Vic2NyaWJlciwgc291cmNlKVxuICAgICAgICAgICAgICAgIDogc291cmNlXG4gICAgICAgICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZShzdWJzY3JpYmVyKVxuICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cnlTdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gICAgfVxuICAgIF90cnlTdWJzY3JpYmUoc2luaykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1YnNjcmliZShzaW5rKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzaW5rLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yRWFjaChuZXh0LCBwcm9taXNlQ3Rvcikge1xuICAgICAgICBwcm9taXNlQ3RvciA9IGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yKTtcbiAgICAgICAgcmV0dXJuIG5ldyBwcm9taXNlQ3RvcigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgc3Vic2NyaXB0aW9uO1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbiA9PT0gbnVsbCB8fCBzdWJzY3JpcHRpb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5zb3VyY2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfVxuICAgIFtTeW1ib2xfb2JzZXJ2YWJsZV0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBwaXBlKC4uLm9wZXJhdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHBpcGVGcm9tQXJyYXkob3BlcmF0aW9ucykodGhpcyk7XG4gICAgfVxuICAgIHRvUHJvbWlzZShwcm9taXNlQ3Rvcikge1xuICAgICAgICBwcm9taXNlQ3RvciA9IGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yKTtcbiAgICAgICAgcmV0dXJuIG5ldyBwcm9taXNlQ3RvcigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZSgoeCkgPT4gKHZhbHVlID0geCksIChlcnIpID0+IHJlamVjdChlcnIpLCAoKSA9PiByZXNvbHZlKHZhbHVlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbk9ic2VydmFibGUuY3JlYXRlID0gKHN1YnNjcmliZSkgPT4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmUpO1xufTtcbmZ1bmN0aW9uIGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiAoX2EgPSBwcm9taXNlQ3RvciAhPT0gbnVsbCAmJiBwcm9taXNlQ3RvciAhPT0gdm9pZCAwID8gcHJvbWlzZUN0b3IgOiBjb25maWcuUHJvbWlzZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogUHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGlzT2JzZXJ2ZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgaXNGdW5jdGlvbih2YWx1ZS5uZXh0KSAmJiBpc0Z1bmN0aW9uKHZhbHVlLmVycm9yKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLmNvbXBsZXRlKTtcbn1cbmZ1bmN0aW9uIGlzU3Vic2NyaWJlcih2YWx1ZSkge1xuICAgIHJldHVybiAodmFsdWUgJiYgdmFsdWUgaW5zdGFuY2VvZiBTdWJzY3JpYmVyKSB8fCAoaXNPYnNlcnZlcih2YWx1ZSkgJiYgaXNTdWJzY3JpcHRpb24odmFsdWUpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU9ic2VydmFibGUuanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gaGFzTGlmdChzb3VyY2UpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihzb3VyY2UgPT09IG51bGwgfHwgc291cmNlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzb3VyY2UubGlmdCk7XG59XG5leHBvcnQgZnVuY3Rpb24gb3BlcmF0ZShpbml0KSB7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IHtcbiAgICAgICAgaWYgKGhhc0xpZnQoc291cmNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5saWZ0KGZ1bmN0aW9uIChsaWZ0ZWRTb3VyY2UpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5pdChsaWZ0ZWRTb3VyY2UsIHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmFibGUgdG8gbGlmdCB1bmtub3duIE9ic2VydmFibGUgdHlwZScpO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1saWZ0LmpzLm1hcCIsImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmV4cG9ydCBjbGFzcyBPcGVyYXRvclN1YnNjcmliZXIgZXh0ZW5kcyBTdWJzY3JpYmVyIHtcbiAgICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbiwgb25OZXh0LCBvbkNvbXBsZXRlLCBvbkVycm9yLCBvbkZpbmFsaXplKSB7XG4gICAgICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICAgICAgdGhpcy5vbkZpbmFsaXplID0gb25GaW5hbGl6ZTtcbiAgICAgICAgdGhpcy5fbmV4dCA9IG9uTmV4dFxuICAgICAgICAgICAgPyBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBvbk5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBzdXBlci5fbmV4dDtcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBvbkVycm9yXG4gICAgICAgICAgICA/IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHN1cGVyLl9lcnJvcjtcbiAgICAgICAgdGhpcy5fY29tcGxldGUgPSBvbkNvbXBsZXRlXG4gICAgICAgICAgICA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHN1cGVyLl9jb21wbGV0ZTtcbiAgICB9XG4gICAgdW5zdWJzY3JpYmUoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgY29uc3QgeyBjbG9zZWQgfSA9IHRoaXM7XG4gICAgICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICFjbG9zZWQgJiYgKChfYSA9IHRoaXMub25GaW5hbGl6ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGhpcykpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU9wZXJhdG9yU3Vic2NyaWJlci5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiByZWZDb3VudCgpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBjb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgc291cmNlLl9yZWZDb3VudCsrO1xuICAgICAgICBjb25zdCByZWZDb3VudGVyID0gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXNvdXJjZSB8fCBzb3VyY2UuX3JlZkNvdW50IDw9IDAgfHwgMCA8IC0tc291cmNlLl9yZWZDb3VudCkge1xuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNoYXJlZENvbm5lY3Rpb24gPSBzb3VyY2UuX2Nvbm5lY3Rpb247XG4gICAgICAgICAgICBjb25zdCBjb25uID0gY29ubmVjdGlvbjtcbiAgICAgICAgICAgIGNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgaWYgKHNoYXJlZENvbm5lY3Rpb24gJiYgKCFjb25uIHx8IHNoYXJlZENvbm5lY3Rpb24gPT09IGNvbm4pKSB7XG4gICAgICAgICAgICAgICAgc2hhcmVkQ29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShyZWZDb3VudGVyKTtcbiAgICAgICAgaWYgKCFyZWZDb3VudGVyLmNsb3NlZCkge1xuICAgICAgICAgICAgY29ubmVjdGlvbiA9IHNvdXJjZS5jb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlZkNvdW50LmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyByZWZDb3VudCBhcyBoaWdoZXJPcmRlclJlZkNvdW50IH0gZnJvbSAnLi4vb3BlcmF0b3JzL3JlZkNvdW50JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4uL29wZXJhdG9ycy9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaGFzTGlmdCB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5leHBvcnQgY2xhc3MgQ29ubmVjdGFibGVPYnNlcnZhYmxlIGV4dGVuZHMgT2JzZXJ2YWJsZSB7XG4gICAgY29uc3RydWN0b3Ioc291cmNlLCBzdWJqZWN0RmFjdG9yeSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgdGhpcy5zdWJqZWN0RmFjdG9yeSA9IHN1YmplY3RGYWN0b3J5O1xuICAgICAgICB0aGlzLl9zdWJqZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcmVmQ291bnQgPSAwO1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgaWYgKGhhc0xpZnQoc291cmNlKSkge1xuICAgICAgICAgICAgdGhpcy5saWZ0ID0gc291cmNlLmxpZnQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3N1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN1YmplY3QoKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfVxuICAgIGdldFN1YmplY3QoKSB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLl9zdWJqZWN0O1xuICAgICAgICBpZiAoIXN1YmplY3QgfHwgc3ViamVjdC5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLnN1YmplY3RGYWN0b3J5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1YmplY3Q7XG4gICAgfVxuICAgIF90ZWFyZG93bigpIHtcbiAgICAgICAgdGhpcy5fcmVmQ291bnQgPSAwO1xuICAgICAgICBjb25zdCB7IF9jb25uZWN0aW9uIH0gPSB0aGlzO1xuICAgICAgICB0aGlzLl9zdWJqZWN0ID0gdGhpcy5fY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICAgIF9jb25uZWN0aW9uID09PSBudWxsIHx8IF9jb25uZWN0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfY29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBjb25uZWN0KCkge1xuICAgICAgICBsZXQgY29ubmVjdGlvbiA9IHRoaXMuX2Nvbm5lY3Rpb247XG4gICAgICAgIGlmICghY29ubmVjdGlvbikge1xuICAgICAgICAgICAgY29ubmVjdGlvbiA9IHRoaXMuX2Nvbm5lY3Rpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5nZXRTdWJqZWN0KCk7XG4gICAgICAgICAgICBjb25uZWN0aW9uLmFkZCh0aGlzLnNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJqZWN0LCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl90ZWFyZG93bigpO1xuICAgICAgICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl90ZWFyZG93bigpO1xuICAgICAgICAgICAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH0sICgpID0+IHRoaXMuX3RlYXJkb3duKCkpKSk7XG4gICAgICAgICAgICBpZiAoY29ubmVjdGlvbi5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25uZWN0aW9uO1xuICAgIH1cbiAgICByZWZDb3VudCgpIHtcbiAgICAgICAgcmV0dXJuIGhpZ2hlck9yZGVyUmVmQ291bnQoKSh0aGlzKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Db25uZWN0YWJsZU9ic2VydmFibGUuanMubWFwIiwiZXhwb3J0IGNvbnN0IHBlcmZvcm1hbmNlVGltZXN0YW1wUHJvdmlkZXIgPSB7XG4gICAgbm93KCkge1xuICAgICAgICByZXR1cm4gKHBlcmZvcm1hbmNlVGltZXN0YW1wUHJvdmlkZXIuZGVsZWdhdGUgfHwgcGVyZm9ybWFuY2UpLm5vdygpO1xuICAgIH0sXG4gICAgZGVsZWdhdGU6IHVuZGVmaW5lZCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wZXJmb3JtYW5jZVRpbWVzdGFtcFByb3ZpZGVyLmpzLm1hcCIsImltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5leHBvcnQgY29uc3QgYW5pbWF0aW9uRnJhbWVQcm92aWRlciA9IHtcbiAgICBzY2hlZHVsZShjYWxsYmFjaykge1xuICAgICAgICBsZXQgcmVxdWVzdCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgbGV0IGNhbmNlbCA9IGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICBjb25zdCB7IGRlbGVnYXRlIH0gPSBhbmltYXRpb25GcmFtZVByb3ZpZGVyO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICAgIHJlcXVlc3QgPSBkZWxlZ2F0ZS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgICAgICAgICBjYW5jZWwgPSBkZWxlZ2F0ZS5jYW5jZWxBbmltYXRpb25GcmFtZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBoYW5kbGUgPSByZXF1ZXN0KCh0aW1lc3RhbXApID0+IHtcbiAgICAgICAgICAgIGNhbmNlbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNhbGxiYWNrKHRpbWVzdGFtcCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvbigoKSA9PiBjYW5jZWwgPT09IG51bGwgfHwgY2FuY2VsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjYW5jZWwoaGFuZGxlKSk7XG4gICAgfSxcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoLi4uYXJncykge1xuICAgICAgICBjb25zdCB7IGRlbGVnYXRlIH0gPSBhbmltYXRpb25GcmFtZVByb3ZpZGVyO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB8fCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUpKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoLi4uYXJncykge1xuICAgICAgICBjb25zdCB7IGRlbGVnYXRlIH0gPSBhbmltYXRpb25GcmFtZVByb3ZpZGVyO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHx8IGNhbmNlbEFuaW1hdGlvbkZyYW1lKSguLi5hcmdzKTtcbiAgICB9LFxuICAgIGRlbGVnYXRlOiB1bmRlZmluZWQsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5pbWF0aW9uRnJhbWVQcm92aWRlci5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgcGVyZm9ybWFuY2VUaW1lc3RhbXBQcm92aWRlciB9IGZyb20gJy4uLy4uL3NjaGVkdWxlci9wZXJmb3JtYW5jZVRpbWVzdGFtcFByb3ZpZGVyJztcbmltcG9ydCB7IGFuaW1hdGlvbkZyYW1lUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9zY2hlZHVsZXIvYW5pbWF0aW9uRnJhbWVQcm92aWRlcic7XG5leHBvcnQgZnVuY3Rpb24gYW5pbWF0aW9uRnJhbWVzKHRpbWVzdGFtcFByb3ZpZGVyKSB7XG4gICAgcmV0dXJuIHRpbWVzdGFtcFByb3ZpZGVyID8gYW5pbWF0aW9uRnJhbWVzRmFjdG9yeSh0aW1lc3RhbXBQcm92aWRlcikgOiBERUZBVUxUX0FOSU1BVElPTl9GUkFNRVM7XG59XG5mdW5jdGlvbiBhbmltYXRpb25GcmFtZXNGYWN0b3J5KHRpbWVzdGFtcFByb3ZpZGVyKSB7XG4gICAgY29uc3QgeyBzY2hlZHVsZSB9ID0gYW5pbWF0aW9uRnJhbWVQcm92aWRlcjtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aW1lc3RhbXBQcm92aWRlciB8fCBwZXJmb3JtYW5jZVRpbWVzdGFtcFByb3ZpZGVyO1xuICAgICAgICBjb25zdCBzdGFydCA9IHByb3ZpZGVyLm5vdygpO1xuICAgICAgICBjb25zdCBydW4gPSAodGltZXN0YW1wKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBwcm92aWRlci5ub3coKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgdGltZXN0YW1wOiB0aW1lc3RhbXBQcm92aWRlciA/IG5vdyA6IHRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgICBlbGFwc2VkOiBub3cgLSBzdGFydFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmFkZChzY2hlZHVsZShydW4pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc3Vic2NyaXB0aW9uLmFkZChzY2hlZHVsZShydW4pKTtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9KTtcbn1cbmNvbnN0IERFRkFVTFRfQU5JTUFUSU9OX0ZSQU1FUyA9IGFuaW1hdGlvbkZyYW1lc0ZhY3RvcnkoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFuaW1hdGlvbkZyYW1lcy5qcy5tYXAiLCJpbXBvcnQgeyBjcmVhdGVFcnJvckNsYXNzIH0gZnJvbSAnLi9jcmVhdGVFcnJvckNsYXNzJztcbmV4cG9ydCBjb25zdCBPYmplY3RVbnN1YnNjcmliZWRFcnJvciA9IGNyZWF0ZUVycm9yQ2xhc3MoKF9zdXBlcikgPT4gZnVuY3Rpb24gT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3JJbXBsKCkge1xuICAgIF9zdXBlcih0aGlzKTtcbiAgICB0aGlzLm5hbWUgPSAnT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuICAgIHRoaXMubWVzc2FnZSA9ICdvYmplY3QgdW5zdWJzY3JpYmVkJztcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIEVNUFRZX1NVQlNDUklQVElPTiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbmltcG9ydCB7IGFyclJlbW92ZSB9IGZyb20gJy4vdXRpbC9hcnJSZW1vdmUnO1xuaW1wb3J0IHsgZXJyb3JDb250ZXh0IH0gZnJvbSAnLi91dGlsL2Vycm9yQ29udGV4dCc7XG5leHBvcnQgY2xhc3MgU3ViamVjdCBleHRlbmRzIE9ic2VydmFibGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9ic2VydmVycyA9IFtdO1xuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhhc0Vycm9yID0gZmFsc2U7XG4gICAgICAgIHRoaXMudGhyb3duRXJyb3IgPSBudWxsO1xuICAgIH1cbiAgICBsaWZ0KG9wZXJhdG9yKSB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgQW5vbnltb3VzU3ViamVjdCh0aGlzLCB0aGlzKTtcbiAgICAgICAgc3ViamVjdC5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICByZXR1cm4gc3ViamVjdDtcbiAgICB9XG4gICAgX3Rocm93SWZDbG9zZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmV4dCh2YWx1ZSkge1xuICAgICAgICBlcnJvckNvbnRleHQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdGhyb3dJZkNsb3NlZCgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvcHkgPSB0aGlzLm9ic2VydmVycy5zbGljZSgpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgb2JzZXJ2ZXIgb2YgY29weSkge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlcnJvcihlcnIpIHtcbiAgICAgICAgZXJyb3JDb250ZXh0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc0Vycm9yID0gdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3duRXJyb3IgPSBlcnI7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgd2hpbGUgKG9ic2VydmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXJzLnNoaWZ0KCkuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgZXJyb3JDb250ZXh0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgd2hpbGUgKG9ic2VydmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXJzLnNoaWZ0KCkuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1bnN1YnNjcmliZSgpIHtcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gbnVsbDtcbiAgICB9XG4gICAgZ2V0IG9ic2VydmVkKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoKF9hID0gdGhpcy5vYnNlcnZlcnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpID4gMDtcbiAgICB9XG4gICAgX3RyeVN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgcmV0dXJuIHN1cGVyLl90cnlTdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfVxuICAgIF9zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgICAgICB0aGlzLl90aHJvd0lmQ2xvc2VkKCk7XG4gICAgICAgIHRoaXMuX2NoZWNrRmluYWxpemVkU3RhdHVzZXMoc3Vic2NyaWJlcik7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbm5lclN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9XG4gICAgX2lubmVyU3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgaXNTdG9wcGVkLCBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBoYXNFcnJvciB8fCBpc1N0b3BwZWRcbiAgICAgICAgICAgID8gRU1QVFlfU1VCU0NSSVBUSU9OXG4gICAgICAgICAgICA6IChvYnNlcnZlcnMucHVzaChzdWJzY3JpYmVyKSwgbmV3IFN1YnNjcmlwdGlvbigoKSA9PiBhcnJSZW1vdmUob2JzZXJ2ZXJzLCBzdWJzY3JpYmVyKSkpO1xuICAgIH1cbiAgICBfY2hlY2tGaW5hbGl6ZWRTdGF0dXNlcyhzdWJzY3JpYmVyKSB7XG4gICAgICAgIGNvbnN0IHsgaGFzRXJyb3IsIHRocm93bkVycm9yLCBpc1N0b3BwZWQgfSA9IHRoaXM7XG4gICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcih0aHJvd25FcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXNPYnNlcnZhYmxlKCkge1xuICAgICAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgb2JzZXJ2YWJsZS5zb3VyY2UgPSB0aGlzO1xuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgICB9XG59XG5TdWJqZWN0LmNyZWF0ZSA9IChkZXN0aW5hdGlvbiwgc291cmNlKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNTdWJqZWN0KGRlc3RpbmF0aW9uLCBzb3VyY2UpO1xufTtcbmV4cG9ydCBjbGFzcyBBbm9ueW1vdXNTdWJqZWN0IGV4dGVuZHMgU3ViamVjdCB7XG4gICAgY29uc3RydWN0b3IoZGVzdGluYXRpb24sIHNvdXJjZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIH1cbiAgICBuZXh0KHZhbHVlKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIChfYiA9IChfYSA9IHRoaXMuZGVzdGluYXRpb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uZXh0KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSwgdmFsdWUpO1xuICAgIH1cbiAgICBlcnJvcihlcnIpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgKF9iID0gKF9hID0gdGhpcy5kZXN0aW5hdGlvbikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVycm9yKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSwgZXJyKTtcbiAgICB9XG4gICAgY29tcGxldGUoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIChfYiA9IChfYSA9IHRoaXMuZGVzdGluYXRpb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb21wbGV0ZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EpO1xuICAgIH1cbiAgICBfc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgcmV0dXJuIChfYiA9IChfYSA9IHRoaXMuc291cmNlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc3Vic2NyaWJlKHN1YnNjcmliZXIpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBFTVBUWV9TVUJTQ1JJUFRJT047XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3ViamVjdC5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmV4cG9ydCBjbGFzcyBCZWhhdmlvclN1YmplY3QgZXh0ZW5kcyBTdWJqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihfdmFsdWUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBfdmFsdWU7XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoKTtcbiAgICB9XG4gICAgX3N1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHN1cGVyLl9zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICFzdWJzY3JpcHRpb24uY2xvc2VkICYmIHN1YnNjcmliZXIubmV4dCh0aGlzLl92YWx1ZSk7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfVxuICAgIGdldFZhbHVlKCkge1xuICAgICAgICBjb25zdCB7IGhhc0Vycm9yLCB0aHJvd25FcnJvciwgX3ZhbHVlIH0gPSB0aGlzO1xuICAgICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IHRocm93bkVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgcmV0dXJuIF92YWx1ZTtcbiAgICB9XG4gICAgbmV4dCh2YWx1ZSkge1xuICAgICAgICBzdXBlci5uZXh0KCh0aGlzLl92YWx1ZSA9IHZhbHVlKSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmVoYXZpb3JTdWJqZWN0LmpzLm1hcCIsImV4cG9ydCBjb25zdCBkYXRlVGltZXN0YW1wUHJvdmlkZXIgPSB7XG4gICAgbm93KCkge1xuICAgICAgICByZXR1cm4gKGRhdGVUaW1lc3RhbXBQcm92aWRlci5kZWxlZ2F0ZSB8fCBEYXRlKS5ub3coKTtcbiAgICB9LFxuICAgIGRlbGVnYXRlOiB1bmRlZmluZWQsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0ZVRpbWVzdGFtcFByb3ZpZGVyLmpzLm1hcCIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xuaW1wb3J0IHsgZGF0ZVRpbWVzdGFtcFByb3ZpZGVyIH0gZnJvbSAnLi9zY2hlZHVsZXIvZGF0ZVRpbWVzdGFtcFByb3ZpZGVyJztcbmV4cG9ydCBjbGFzcyBSZXBsYXlTdWJqZWN0IGV4dGVuZHMgU3ViamVjdCB7XG4gICAgY29uc3RydWN0b3IoX2J1ZmZlclNpemUgPSBJbmZpbml0eSwgX3dpbmRvd1RpbWUgPSBJbmZpbml0eSwgX3RpbWVzdGFtcFByb3ZpZGVyID0gZGF0ZVRpbWVzdGFtcFByb3ZpZGVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2J1ZmZlclNpemUgPSBfYnVmZmVyU2l6ZTtcbiAgICAgICAgdGhpcy5fd2luZG93VGltZSA9IF93aW5kb3dUaW1lO1xuICAgICAgICB0aGlzLl90aW1lc3RhbXBQcm92aWRlciA9IF90aW1lc3RhbXBQcm92aWRlcjtcbiAgICAgICAgdGhpcy5fYnVmZmVyID0gW107XG4gICAgICAgIHRoaXMuX2luZmluaXRlVGltZVdpbmRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2luZmluaXRlVGltZVdpbmRvdyA9IF93aW5kb3dUaW1lID09PSBJbmZpbml0eTtcbiAgICAgICAgdGhpcy5fYnVmZmVyU2l6ZSA9IE1hdGgubWF4KDEsIF9idWZmZXJTaXplKTtcbiAgICAgICAgdGhpcy5fd2luZG93VGltZSA9IE1hdGgubWF4KDEsIF93aW5kb3dUaW1lKTtcbiAgICB9XG4gICAgbmV4dCh2YWx1ZSkge1xuICAgICAgICBjb25zdCB7IGlzU3RvcHBlZCwgX2J1ZmZlciwgX2luZmluaXRlVGltZVdpbmRvdywgX3RpbWVzdGFtcFByb3ZpZGVyLCBfd2luZG93VGltZSB9ID0gdGhpcztcbiAgICAgICAgaWYgKCFpc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIF9idWZmZXIucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAhX2luZmluaXRlVGltZVdpbmRvdyAmJiBfYnVmZmVyLnB1c2goX3RpbWVzdGFtcFByb3ZpZGVyLm5vdygpICsgX3dpbmRvd1RpbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RyaW1CdWZmZXIoKTtcbiAgICAgICAgc3VwZXIubmV4dCh2YWx1ZSk7XG4gICAgfVxuICAgIF9zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgICAgICB0aGlzLl90aHJvd0lmQ2xvc2VkKCk7XG4gICAgICAgIHRoaXMuX3RyaW1CdWZmZXIoKTtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gdGhpcy5faW5uZXJTdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgIGNvbnN0IHsgX2luZmluaXRlVGltZVdpbmRvdywgX2J1ZmZlciB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgY29weSA9IF9idWZmZXIuc2xpY2UoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3B5Lmxlbmd0aCAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkgKz0gX2luZmluaXRlVGltZVdpbmRvdyA/IDEgOiAyKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoY29weVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2hlY2tGaW5hbGl6ZWRTdGF0dXNlcyhzdWJzY3JpYmVyKTtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9XG4gICAgX3RyaW1CdWZmZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgX2J1ZmZlclNpemUsIF90aW1lc3RhbXBQcm92aWRlciwgX2J1ZmZlciwgX2luZmluaXRlVGltZVdpbmRvdyB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgYWRqdXN0ZWRCdWZmZXJTaXplID0gKF9pbmZpbml0ZVRpbWVXaW5kb3cgPyAxIDogMikgKiBfYnVmZmVyU2l6ZTtcbiAgICAgICAgX2J1ZmZlclNpemUgPCBJbmZpbml0eSAmJiBhZGp1c3RlZEJ1ZmZlclNpemUgPCBfYnVmZmVyLmxlbmd0aCAmJiBfYnVmZmVyLnNwbGljZSgwLCBfYnVmZmVyLmxlbmd0aCAtIGFkanVzdGVkQnVmZmVyU2l6ZSk7XG4gICAgICAgIGlmICghX2luZmluaXRlVGltZVdpbmRvdykge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gX3RpbWVzdGFtcFByb3ZpZGVyLm5vdygpO1xuICAgICAgICAgICAgbGV0IGxhc3QgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBfYnVmZmVyLmxlbmd0aCAmJiBfYnVmZmVyW2ldIDw9IG5vdzsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgbGFzdCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0ICYmIF9idWZmZXIuc3BsaWNlKDAsIGxhc3QgKyAxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVJlcGxheVN1YmplY3QuanMubWFwIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vU3ViamVjdCc7XG5leHBvcnQgY2xhc3MgQXN5bmNTdWJqZWN0IGV4dGVuZHMgU3ViamVjdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gbnVsbDtcbiAgICAgICAgdGhpcy5faGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faXNDb21wbGV0ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBfY2hlY2tGaW5hbGl6ZWRTdGF0dXNlcyhzdWJzY3JpYmVyKSB7XG4gICAgICAgIGNvbnN0IHsgaGFzRXJyb3IsIF9oYXNWYWx1ZSwgX3ZhbHVlLCB0aHJvd25FcnJvciwgaXNTdG9wcGVkLCBfaXNDb21wbGV0ZSB9ID0gdGhpcztcbiAgICAgICAgaWYgKGhhc0Vycm9yKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKHRocm93bkVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1N0b3BwZWQgfHwgX2lzQ29tcGxldGUpIHtcbiAgICAgICAgICAgIF9oYXNWYWx1ZSAmJiBzdWJzY3JpYmVyLm5leHQoX3ZhbHVlKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuZXh0KHZhbHVlKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9oYXNWYWx1ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcGxldGUoKSB7XG4gICAgICAgIGNvbnN0IHsgX2hhc1ZhbHVlLCBfdmFsdWUsIF9pc0NvbXBsZXRlIH0gPSB0aGlzO1xuICAgICAgICBpZiAoIV9pc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9pc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIF9oYXNWYWx1ZSAmJiBzdXBlci5uZXh0KF92YWx1ZSk7XG4gICAgICAgICAgICBzdXBlci5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXN5bmNTdWJqZWN0LmpzLm1hcCIsImltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5leHBvcnQgY2xhc3MgQWN0aW9uIGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihzY2hlZHVsZXIsIHdvcmspIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgc2NoZWR1bGUoc3RhdGUsIGRlbGF5ID0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1BY3Rpb24uanMubWFwIiwiZXhwb3J0IGNvbnN0IGludGVydmFsUHJvdmlkZXIgPSB7XG4gICAgc2V0SW50ZXJ2YWwoLi4uYXJncykge1xuICAgICAgICBjb25zdCB7IGRlbGVnYXRlIH0gPSBpbnRlcnZhbFByb3ZpZGVyO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuc2V0SW50ZXJ2YWwpIHx8IHNldEludGVydmFsKSguLi5hcmdzKTtcbiAgICB9LFxuICAgIGNsZWFySW50ZXJ2YWwoaGFuZGxlKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IGludGVydmFsUHJvdmlkZXI7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5jbGVhckludGVydmFsKSB8fCBjbGVhckludGVydmFsKShoYW5kbGUpO1xuICAgIH0sXG4gICAgZGVsZWdhdGU6IHVuZGVmaW5lZCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnRlcnZhbFByb3ZpZGVyLmpzLm1hcCIsImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vQWN0aW9uJztcbmltcG9ydCB7IGludGVydmFsUHJvdmlkZXIgfSBmcm9tICcuL2ludGVydmFsUHJvdmlkZXInO1xuaW1wb3J0IHsgYXJyUmVtb3ZlIH0gZnJvbSAnLi4vdXRpbC9hcnJSZW1vdmUnO1xuZXhwb3J0IGNsYXNzIEFzeW5jQWN0aW9uIGV4dGVuZHMgQWN0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihzY2hlZHVsZXIsIHdvcmspIHtcbiAgICAgICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgICAgIHRoaXMud29yayA9IHdvcms7XG4gICAgICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBzY2hlZHVsZShzdGF0ZSwgZGVsYXkgPSAwKSB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGVuZGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAgICAgdGhpcy5pZCA9IHRoaXMuaWQgfHwgdGhpcy5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIHRoaXMuaWQsIGRlbGF5KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgX2lkLCBkZWxheSA9IDApIHtcbiAgICAgICAgcmV0dXJuIGludGVydmFsUHJvdmlkZXIuc2V0SW50ZXJ2YWwoc2NoZWR1bGVyLmZsdXNoLmJpbmQoc2NoZWR1bGVyLCB0aGlzKSwgZGVsYXkpO1xuICAgIH1cbiAgICByZWN5Y2xlQXN5bmNJZChfc2NoZWR1bGVyLCBpZCwgZGVsYXkgPSAwKSB7XG4gICAgICAgIGlmIChkZWxheSAhPSBudWxsICYmIHRoaXMuZGVsYXkgPT09IGRlbGF5ICYmIHRoaXMucGVuZGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuICAgICAgICBpbnRlcnZhbFByb3ZpZGVyLmNsZWFySW50ZXJ2YWwoaWQpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBleGVjdXRlKHN0YXRlLCBkZWxheSkge1xuICAgICAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ2V4ZWN1dGluZyBhIGNhbmNlbGxlZCBhY3Rpb24nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSB0aGlzLl9leGVjdXRlKHN0YXRlLCBkZWxheSk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucGVuZGluZyA9PT0gZmFsc2UgJiYgdGhpcy5pZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZCh0aGlzLnNjaGVkdWxlciwgdGhpcy5pZCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2V4ZWN1dGUoc3RhdGUsIF9kZWxheSkge1xuICAgICAgICBsZXQgZXJyb3JlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgZXJyb3JWYWx1ZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMud29yayhzdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGVycm9yZWQgPSB0cnVlO1xuICAgICAgICAgICAgZXJyb3JWYWx1ZSA9IGUgPyBlIDogbmV3IEVycm9yKCdTY2hlZHVsZWQgYWN0aW9uIHRocmV3IGZhbHN5IGVycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yZWQpIHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHJldHVybiBlcnJvclZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICBjb25zdCB7IGlkLCBzY2hlZHVsZXIgfSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IGFjdGlvbnMgfSA9IHNjaGVkdWxlcjtcbiAgICAgICAgICAgIHRoaXMud29yayA9IHRoaXMuc3RhdGUgPSB0aGlzLnNjaGVkdWxlciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGFyclJlbW92ZShhY3Rpb25zLCB0aGlzKTtcbiAgICAgICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pZCA9IHRoaXMucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlbGF5ID0gbnVsbDtcbiAgICAgICAgICAgIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Bc3luY0FjdGlvbi5qcy5tYXAiLCJsZXQgbmV4dEhhbmRsZSA9IDE7XG5sZXQgcmVzb2x2ZWQ7XG5jb25zdCBhY3RpdmVIYW5kbGVzID0ge307XG5mdW5jdGlvbiBmaW5kQW5kQ2xlYXJIYW5kbGUoaGFuZGxlKSB7XG4gICAgaWYgKGhhbmRsZSBpbiBhY3RpdmVIYW5kbGVzKSB7XG4gICAgICAgIGRlbGV0ZSBhY3RpdmVIYW5kbGVzW2hhbmRsZV07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnQgY29uc3QgSW1tZWRpYXRlID0ge1xuICAgIHNldEltbWVkaWF0ZShjYikge1xuICAgICAgICBjb25zdCBoYW5kbGUgPSBuZXh0SGFuZGxlKys7XG4gICAgICAgIGFjdGl2ZUhhbmRsZXNbaGFuZGxlXSA9IHRydWU7XG4gICAgICAgIGlmICghcmVzb2x2ZWQpIHtcbiAgICAgICAgICAgIHJlc29sdmVkID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZWQudGhlbigoKSA9PiBmaW5kQW5kQ2xlYXJIYW5kbGUoaGFuZGxlKSAmJiBjYigpKTtcbiAgICAgICAgcmV0dXJuIGhhbmRsZTtcbiAgICB9LFxuICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBmaW5kQW5kQ2xlYXJIYW5kbGUoaGFuZGxlKTtcbiAgICB9LFxufTtcbmV4cG9ydCBjb25zdCBUZXN0VG9vbHMgPSB7XG4gICAgcGVuZGluZygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGFjdGl2ZUhhbmRsZXMpLmxlbmd0aDtcbiAgICB9XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SW1tZWRpYXRlLmpzLm1hcCIsImltcG9ydCB7IEltbWVkaWF0ZSB9IGZyb20gJy4uL3V0aWwvSW1tZWRpYXRlJztcbmNvbnN0IHsgc2V0SW1tZWRpYXRlLCBjbGVhckltbWVkaWF0ZSB9ID0gSW1tZWRpYXRlO1xuZXhwb3J0IGNvbnN0IGltbWVkaWF0ZVByb3ZpZGVyID0ge1xuICAgIHNldEltbWVkaWF0ZSguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IGltbWVkaWF0ZVByb3ZpZGVyO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuc2V0SW1tZWRpYXRlKSB8fCBzZXRJbW1lZGlhdGUpKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IGltbWVkaWF0ZVByb3ZpZGVyO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuY2xlYXJJbW1lZGlhdGUpIHx8IGNsZWFySW1tZWRpYXRlKShoYW5kbGUpO1xuICAgIH0sXG4gICAgZGVsZWdhdGU6IHVuZGVmaW5lZCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbW1lZGlhdGVQcm92aWRlci5qcy5tYXAiLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgaW1tZWRpYXRlUHJvdmlkZXIgfSBmcm9tICcuL2ltbWVkaWF0ZVByb3ZpZGVyJztcbmV4cG9ydCBjbGFzcyBBc2FwQWN0aW9uIGV4dGVuZHMgQXN5bmNBY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKHNjaGVkdWxlciwgd29yaykge1xuICAgICAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgICAgdGhpcy53b3JrID0gd29yaztcbiAgICB9XG4gICAgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkgPSAwKSB7XG4gICAgICAgIGlmIChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVyLmFjdGlvbnMucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlci5fc2NoZWR1bGVkIHx8IChzY2hlZHVsZXIuX3NjaGVkdWxlZCA9IGltbWVkaWF0ZVByb3ZpZGVyLnNldEltbWVkaWF0ZShzY2hlZHVsZXIuZmx1c2guYmluZChzY2hlZHVsZXIsIHVuZGVmaW5lZCkpKTtcbiAgICB9XG4gICAgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkgPSAwKSB7XG4gICAgICAgIGlmICgoZGVsYXkgIT0gbnVsbCAmJiBkZWxheSA+IDApIHx8IChkZWxheSA9PSBudWxsICYmIHRoaXMuZGVsYXkgPiAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NoZWR1bGVyLmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpbW1lZGlhdGVQcm92aWRlci5jbGVhckltbWVkaWF0ZShpZCk7XG4gICAgICAgICAgICBzY2hlZHVsZXIuX3NjaGVkdWxlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFzYXBBY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgZGF0ZVRpbWVzdGFtcFByb3ZpZGVyIH0gZnJvbSAnLi9zY2hlZHVsZXIvZGF0ZVRpbWVzdGFtcFByb3ZpZGVyJztcbmV4cG9ydCBjbGFzcyBTY2hlZHVsZXIge1xuICAgIGNvbnN0cnVjdG9yKHNjaGVkdWxlckFjdGlvbkN0b3IsIG5vdyA9IFNjaGVkdWxlci5ub3cpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZXJBY3Rpb25DdG9yID0gc2NoZWR1bGVyQWN0aW9uQ3RvcjtcbiAgICAgICAgdGhpcy5ub3cgPSBub3c7XG4gICAgfVxuICAgIHNjaGVkdWxlKHdvcmssIGRlbGF5ID0gMCwgc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLnNjaGVkdWxlckFjdGlvbkN0b3IodGhpcywgd29yaykuc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9XG59XG5TY2hlZHVsZXIubm93ID0gZGF0ZVRpbWVzdGFtcFByb3ZpZGVyLm5vdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVNjaGVkdWxlci5qcy5tYXAiLCJpbXBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tICcuLi9TY2hlZHVsZXInO1xuZXhwb3J0IGNsYXNzIEFzeW5jU2NoZWR1bGVyIGV4dGVuZHMgU2NoZWR1bGVyIHtcbiAgICBjb25zdHJ1Y3RvcihTY2hlZHVsZXJBY3Rpb24sIG5vdyA9IFNjaGVkdWxlci5ub3cpIHtcbiAgICAgICAgc3VwZXIoU2NoZWR1bGVyQWN0aW9uLCBub3cpO1xuICAgICAgICB0aGlzLmFjdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlZCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZmx1c2goYWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9ucyB9ID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKGFjdGlvbik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGVycm9yO1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSB0cnVlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICgoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSk7XG4gICAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHdoaWxlICgoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSkge1xuICAgICAgICAgICAgICAgIGFjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Bc3luY1NjaGVkdWxlci5qcy5tYXAiLCJpbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuZXhwb3J0IGNsYXNzIEFzYXBTY2hlZHVsZXIgZXh0ZW5kcyBBc3luY1NjaGVkdWxlciB7XG4gICAgZmx1c2goYWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgeyBhY3Rpb25zIH0gPSB0aGlzO1xuICAgICAgICBsZXQgZXJyb3I7XG4gICAgICAgIGxldCBpbmRleCA9IC0xO1xuICAgICAgICBhY3Rpb24gPSBhY3Rpb24gfHwgYWN0aW9ucy5zaGlmdCgpO1xuICAgICAgICBjb25zdCBjb3VudCA9IGFjdGlvbnMubGVuZ3RoO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICgrK2luZGV4IDwgY291bnQgJiYgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpO1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB3aGlsZSAoKytpbmRleCA8IGNvdW50ICYmIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFzYXBTY2hlZHVsZXIuanMubWFwIiwiaW1wb3J0IHsgQXNhcEFjdGlvbiB9IGZyb20gJy4vQXNhcEFjdGlvbic7XG5pbXBvcnQgeyBBc2FwU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc2FwU2NoZWR1bGVyJztcbmV4cG9ydCBjb25zdCBhc2FwU2NoZWR1bGVyID0gbmV3IEFzYXBTY2hlZHVsZXIoQXNhcEFjdGlvbik7XG5leHBvcnQgY29uc3QgYXNhcCA9IGFzYXBTY2hlZHVsZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hc2FwLmpzLm1hcCIsImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuZXhwb3J0IGNvbnN0IGFzeW5jU2NoZWR1bGVyID0gbmV3IEFzeW5jU2NoZWR1bGVyKEFzeW5jQWN0aW9uKTtcbmV4cG9ydCBjb25zdCBhc3luYyA9IGFzeW5jU2NoZWR1bGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXN5bmMuanMubWFwIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmV4cG9ydCBjbGFzcyBRdWV1ZUFjdGlvbiBleHRlbmRzIEFzeW5jQWN0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihzY2hlZHVsZXIsIHdvcmspIHtcbiAgICAgICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgICAgIHRoaXMud29yayA9IHdvcms7XG4gICAgfVxuICAgIHNjaGVkdWxlKHN0YXRlLCBkZWxheSA9IDApIHtcbiAgICAgICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVyLmZsdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZXhlY3V0ZShzdGF0ZSwgZGVsYXkpIHtcbiAgICAgICAgcmV0dXJuIChkZWxheSA+IDAgfHwgdGhpcy5jbG9zZWQpID9cbiAgICAgICAgICAgIHN1cGVyLmV4ZWN1dGUoc3RhdGUsIGRlbGF5KSA6XG4gICAgICAgICAgICB0aGlzLl9leGVjdXRlKHN0YXRlLCBkZWxheSk7XG4gICAgfVxuICAgIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5ID0gMCkge1xuICAgICAgICBpZiAoKGRlbGF5ICE9IG51bGwgJiYgZGVsYXkgPiAwKSB8fCAoZGVsYXkgPT0gbnVsbCAmJiB0aGlzLmRlbGF5ID4gMCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlci5mbHVzaCh0aGlzKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1RdWV1ZUFjdGlvbi5qcy5tYXAiLCJpbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuZXhwb3J0IGNsYXNzIFF1ZXVlU2NoZWR1bGVyIGV4dGVuZHMgQXN5bmNTY2hlZHVsZXIge1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UXVldWVTY2hlZHVsZXIuanMubWFwIiwiaW1wb3J0IHsgUXVldWVBY3Rpb24gfSBmcm9tICcuL1F1ZXVlQWN0aW9uJztcbmltcG9ydCB7IFF1ZXVlU2NoZWR1bGVyIH0gZnJvbSAnLi9RdWV1ZVNjaGVkdWxlcic7XG5leHBvcnQgY29uc3QgcXVldWVTY2hlZHVsZXIgPSBuZXcgUXVldWVTY2hlZHVsZXIoUXVldWVBY3Rpb24pO1xuZXhwb3J0IGNvbnN0IHF1ZXVlID0gcXVldWVTY2hlZHVsZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1xdWV1ZS5qcy5tYXAiLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgYW5pbWF0aW9uRnJhbWVQcm92aWRlciB9IGZyb20gJy4vYW5pbWF0aW9uRnJhbWVQcm92aWRlcic7XG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uRnJhbWVBY3Rpb24gZXh0ZW5kcyBBc3luY0FjdGlvbiB7XG4gICAgY29uc3RydWN0b3Ioc2NoZWR1bGVyLCB3b3JrKSB7XG4gICAgICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICB0aGlzLndvcmsgPSB3b3JrO1xuICAgIH1cbiAgICByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSA9IDApIHtcbiAgICAgICAgaWYgKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICBzY2hlZHVsZXIuYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLl9zY2hlZHVsZWQgfHwgKHNjaGVkdWxlci5fc2NoZWR1bGVkID0gYW5pbWF0aW9uRnJhbWVQcm92aWRlci5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gc2NoZWR1bGVyLmZsdXNoKHVuZGVmaW5lZCkpKTtcbiAgICB9XG4gICAgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkgPSAwKSB7XG4gICAgICAgIGlmICgoZGVsYXkgIT0gbnVsbCAmJiBkZWxheSA+IDApIHx8IChkZWxheSA9PSBudWxsICYmIHRoaXMuZGVsYXkgPiAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2NoZWR1bGVyLmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBhbmltYXRpb25GcmFtZVByb3ZpZGVyLmNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKTtcbiAgICAgICAgICAgIHNjaGVkdWxlci5fc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QW5pbWF0aW9uRnJhbWVBY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcbmV4cG9ydCBjbGFzcyBBbmltYXRpb25GcmFtZVNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcbiAgICBmbHVzaChhY3Rpb24pIHtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCB7IGFjdGlvbnMgfSA9IHRoaXM7XG4gICAgICAgIGxldCBlcnJvcjtcbiAgICAgICAgbGV0IGluZGV4ID0gLTE7XG4gICAgICAgIGFjdGlvbiA9IGFjdGlvbiB8fCBhY3Rpb25zLnNoaWZ0KCk7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gYWN0aW9ucy5sZW5ndGg7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmICgoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKCsraW5kZXggPCBjb3VudCAmJiAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSk7XG4gICAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHdoaWxlICgrK2luZGV4IDwgY291bnQgJiYgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIuanMubWFwIiwiaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWVBY3Rpb24gfSBmcm9tICcuL0FuaW1hdGlvbkZyYW1lQWN0aW9uJztcbmltcG9ydCB7IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyIH0gZnJvbSAnLi9BbmltYXRpb25GcmFtZVNjaGVkdWxlcic7XG5leHBvcnQgY29uc3QgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgPSBuZXcgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIoQW5pbWF0aW9uRnJhbWVBY3Rpb24pO1xuZXhwb3J0IGNvbnN0IGFuaW1hdGlvbkZyYW1lID0gYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRpb25GcmFtZS5qcy5tYXAiLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5leHBvcnQgY2xhc3MgVmlydHVhbFRpbWVTY2hlZHVsZXIgZXh0ZW5kcyBBc3luY1NjaGVkdWxlciB7XG4gICAgY29uc3RydWN0b3Ioc2NoZWR1bGVyQWN0aW9uQ3RvciA9IFZpcnR1YWxBY3Rpb24sIG1heEZyYW1lcyA9IEluZmluaXR5KSB7XG4gICAgICAgIHN1cGVyKHNjaGVkdWxlckFjdGlvbkN0b3IsICgpID0+IHRoaXMuZnJhbWUpO1xuICAgICAgICB0aGlzLm1heEZyYW1lcyA9IG1heEZyYW1lcztcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICB9XG4gICAgZmx1c2goKSB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9ucywgbWF4RnJhbWVzIH0gPSB0aGlzO1xuICAgICAgICBsZXQgZXJyb3I7XG4gICAgICAgIGxldCBhY3Rpb247XG4gICAgICAgIHdoaWxlICgoYWN0aW9uID0gYWN0aW9uc1swXSkgJiYgYWN0aW9uLmRlbGF5IDw9IG1heEZyYW1lcykge1xuICAgICAgICAgICAgYWN0aW9ucy5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IGFjdGlvbi5kZWxheTtcbiAgICAgICAgICAgIGlmICgoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxufVxuVmlydHVhbFRpbWVTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yID0gMTA7XG5leHBvcnQgY2xhc3MgVmlydHVhbEFjdGlvbiBleHRlbmRzIEFzeW5jQWN0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihzY2hlZHVsZXIsIHdvcmssIGluZGV4ID0gKHNjaGVkdWxlci5pbmRleCArPSAxKSkge1xuICAgICAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgICAgdGhpcy53b3JrID0gd29yaztcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuaW5kZXggPSBzY2hlZHVsZXIuaW5kZXggPSBpbmRleDtcbiAgICB9XG4gICAgc2NoZWR1bGUoc3RhdGUsIGRlbGF5ID0gMCkge1xuICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRlbGF5KSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gbmV3IFZpcnR1YWxBY3Rpb24odGhpcy5zY2hlZHVsZXIsIHRoaXMud29yayk7XG4gICAgICAgICAgICB0aGlzLmFkZChhY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSA9IDApIHtcbiAgICAgICAgdGhpcy5kZWxheSA9IHNjaGVkdWxlci5mcmFtZSArIGRlbGF5O1xuICAgICAgICBjb25zdCB7IGFjdGlvbnMgfSA9IHNjaGVkdWxlcjtcbiAgICAgICAgYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgICAgICBhY3Rpb25zLnNvcnQoVmlydHVhbEFjdGlvbi5zb3J0QWN0aW9ucyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSA9IDApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9leGVjdXRlKHN0YXRlLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHNvcnRBY3Rpb25zKGEsIGIpIHtcbiAgICAgICAgaWYgKGEuZGVsYXkgPT09IGIuZGVsYXkpIHtcbiAgICAgICAgICAgIGlmIChhLmluZGV4ID09PSBiLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhLmluZGV4ID4gYi5pbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGEuZGVsYXkgPiBiLmRlbGF5KSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVZpcnR1YWxUaW1lU2NoZWR1bGVyLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmV4cG9ydCBjb25zdCBFTVBUWSA9IG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpO1xuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5KHNjaGVkdWxlcikge1xuICAgIHJldHVybiBzY2hlZHVsZXIgPyBlbXB0eVNjaGVkdWxlZChzY2hlZHVsZXIpIDogRU1QVFk7XG59XG5mdW5jdGlvbiBlbXB0eVNjaGVkdWxlZChzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVtcHR5LmpzLm1hcCIsImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzRnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2NoZWR1bGVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIGlzRnVuY3Rpb24odmFsdWUuc2NoZWR1bGUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNTY2hlZHVsZXIuanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4vaXNTY2hlZHVsZXInO1xuZnVuY3Rpb24gbGFzdChhcnIpIHtcbiAgICByZXR1cm4gYXJyW2Fyci5sZW5ndGggLSAxXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwb3BSZXN1bHRTZWxlY3RvcihhcmdzKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24obGFzdChhcmdzKSkgPyBhcmdzLnBvcCgpIDogdW5kZWZpbmVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBvcFNjaGVkdWxlcihhcmdzKSB7XG4gICAgcmV0dXJuIGlzU2NoZWR1bGVyKGxhc3QoYXJncykpID8gYXJncy5wb3AoKSA6IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwb3BOdW1iZXIoYXJncywgZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBsYXN0KGFyZ3MpID09PSAnbnVtYmVyJyA/IGFyZ3MucG9wKCkgOiBkZWZhdWx0VmFsdWU7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcmdzLmpzLm1hcCIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgaWwgPSBmcm9tLmxlbmd0aCwgaiA9IHRvLmxlbmd0aDsgaSA8IGlsOyBpKyssIGorKylcclxuICAgICAgICB0b1tqXSA9IGZyb21baV07XHJcbiAgICByZXR1cm4gdG87XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRHZXQocmVjZWl2ZXIsIHByaXZhdGVNYXApIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBnZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcHJpdmF0ZU1hcC5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgcHJpdmF0ZU1hcCwgdmFsdWUpIHtcclxuICAgIGlmICghcHJpdmF0ZU1hcC5oYXMocmVjZWl2ZXIpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImF0dGVtcHRlZCB0byBzZXQgcHJpdmF0ZSBmaWVsZCBvbiBub24taW5zdGFuY2VcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlTWFwLnNldChyZWNlaXZlciwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59XHJcbiIsImV4cG9ydCBjb25zdCBpc0FycmF5TGlrZSA9ICgoeCkgPT4geCAmJiB0eXBlb2YgeC5sZW5ndGggPT09ICdudW1iZXInICYmIHR5cGVvZiB4ICE9PSAnZnVuY3Rpb24nKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzQXJyYXlMaWtlLmpzLm1hcCIsImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tIFwiLi9pc0Z1bmN0aW9uXCI7XG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24odmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHZhbHVlLnRoZW4pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNQcm9taXNlLmpzLm1hcCIsImltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBpc0ludGVyb3BPYnNlcnZhYmxlKGlucHV0KSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oaW5wdXRbU3ltYm9sX29ic2VydmFibGVdKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzSW50ZXJvcE9ic2VydmFibGUuanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gaXNBc3luY0l0ZXJhYmxlKG9iaikge1xuICAgIHJldHVybiBTeW1ib2wuYXN5bmNJdGVyYXRvciAmJiBpc0Z1bmN0aW9uKG9iaiA9PT0gbnVsbCB8fCBvYmogPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9ialtTeW1ib2wuYXN5bmNJdGVyYXRvcl0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNBc3luY0l0ZXJhYmxlLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbnZhbGlkT2JzZXJ2YWJsZVR5cGVFcnJvcihpbnB1dCkge1xuICAgIHJldHVybiBuZXcgVHlwZUVycm9yKGBZb3UgcHJvdmlkZWQgJHtpbnB1dCAhPT0gbnVsbCAmJiB0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnID8gJ2FuIGludmFsaWQgb2JqZWN0JyA6IGAnJHtpbnB1dH0nYH0gd2hlcmUgYSBzdHJlYW0gd2FzIGV4cGVjdGVkLiBZb3UgY2FuIHByb3ZpZGUgYW4gT2JzZXJ2YWJsZSwgUHJvbWlzZSwgUmVhZGFibGVTdHJlYW0sIEFycmF5LCBBc3luY0l0ZXJhYmxlLCBvciBJdGVyYWJsZS5gKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRocm93VW5vYnNlcnZhYmxlRXJyb3IuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFN5bWJvbEl0ZXJhdG9yKCkge1xuICAgIGlmICh0eXBlb2YgU3ltYm9sICE9PSAnZnVuY3Rpb24nIHx8ICFTeW1ib2wuaXRlcmF0b3IpIHtcbiAgICAgICAgcmV0dXJuICdAQGl0ZXJhdG9yJztcbiAgICB9XG4gICAgcmV0dXJuIFN5bWJvbC5pdGVyYXRvcjtcbn1cbmV4cG9ydCBjb25zdCBpdGVyYXRvciA9IGdldFN5bWJvbEl0ZXJhdG9yKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pdGVyYXRvci5qcy5tYXAiLCJpbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZShpbnB1dCkge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKGlucHV0ID09PSBudWxsIHx8IGlucHV0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBpbnB1dFtTeW1ib2xfaXRlcmF0b3JdKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzSXRlcmFibGUuanMubWFwIiwiaW1wb3J0IHsgX19hc3luY0dlbmVyYXRvciwgX19hd2FpdCB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gcmVhZGFibGVTdHJlYW1MaWtlVG9Bc3luY0dlbmVyYXRvcihyZWFkYWJsZVN0cmVhbSkge1xuICAgIHJldHVybiBfX2FzeW5jR2VuZXJhdG9yKHRoaXMsIGFyZ3VtZW50cywgZnVuY3Rpb24qIHJlYWRhYmxlU3RyZWFtTGlrZVRvQXN5bmNHZW5lcmF0b3JfMSgpIHtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gcmVhZGFibGVTdHJlYW0uZ2V0UmVhZGVyKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgdmFsdWUsIGRvbmUgfSA9IHlpZWxkIF9fYXdhaXQocmVhZGVyLnJlYWQoKSk7XG4gICAgICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIF9fYXdhaXQodm9pZCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQgeWllbGQgX19hd2FpdCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICByZWFkZXIucmVsZWFzZUxvY2soKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVhZGFibGVTdHJlYW1MaWtlKG9iaikge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKG9iaiA9PT0gbnVsbCB8fCBvYmogPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9iai5nZXRSZWFkZXIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNSZWFkYWJsZVN0cmVhbUxpa2UuanMubWFwIiwiaW1wb3J0IHsgX19hc3luY1ZhbHVlcywgX19hd2FpdGVyIH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheUxpa2UnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi4vdXRpbC9pc1Byb21pc2UnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNJbnRlcm9wT2JzZXJ2YWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJbnRlcm9wT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FzeW5jSXRlcmFibGUgfSBmcm9tICcuLi91dGlsL2lzQXN5bmNJdGVyYWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVJbnZhbGlkT2JzZXJ2YWJsZVR5cGVFcnJvciB9IGZyb20gJy4uL3V0aWwvdGhyb3dVbm9ic2VydmFibGVFcnJvcic7XG5pbXBvcnQgeyBpc0l0ZXJhYmxlIH0gZnJvbSAnLi4vdXRpbC9pc0l0ZXJhYmxlJztcbmltcG9ydCB7IGlzUmVhZGFibGVTdHJlYW1MaWtlLCByZWFkYWJsZVN0cmVhbUxpa2VUb0FzeW5jR2VuZXJhdG9yIH0gZnJvbSAnLi4vdXRpbC9pc1JlYWRhYmxlU3RyZWFtTGlrZSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IHJlcG9ydFVuaGFuZGxlZEVycm9yIH0gZnJvbSAnLi4vdXRpbC9yZXBvcnRVbmhhbmRsZWRFcnJvcic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuZXhwb3J0IGZ1bmN0aW9uIGlubmVyRnJvbShpbnB1dCkge1xuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbiAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcm9tSW50ZXJvcE9ic2VydmFibGUoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FycmF5TGlrZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcm9taXNlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb21Qcm9taXNlKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBc3luY0l0ZXJhYmxlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb21Bc3luY0l0ZXJhYmxlKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNJdGVyYWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcm9tSXRlcmFibGUoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1JlYWRhYmxlU3RyZWFtTGlrZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcm9tUmVhZGFibGVTdHJlYW1MaWtlKGlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBjcmVhdGVJbnZhbGlkT2JzZXJ2YWJsZVR5cGVFcnJvcihpbnB1dCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbUludGVyb3BPYnNlcnZhYmxlKG9iaikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25zdCBvYnMgPSBvYmpbU3ltYm9sX29ic2VydmFibGVdKCk7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKG9icy5zdWJzY3JpYmUpKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JzLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm92aWRlZCBvYmplY3QgZG9lcyBub3QgY29ycmVjdGx5IGltcGxlbWVudCBTeW1ib2wub2JzZXJ2YWJsZScpO1xuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZyb21BcnJheUxpa2UoYXJyYXkpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGggJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChhcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZyb21Qcm9taXNlKHByb21pc2UpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgcHJvbWlzZVxuICAgICAgICAgICAgLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIChlcnIpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyKSlcbiAgICAgICAgICAgIC50aGVuKG51bGwsIHJlcG9ydFVuaGFuZGxlZEVycm9yKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmcm9tSXRlcmFibGUoaXRlcmFibGUpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbUFzeW5jSXRlcmFibGUoYXN5bmNJdGVyYWJsZSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBwcm9jZXNzKGFzeW5jSXRlcmFibGUsIHN1YnNjcmliZXIpLmNhdGNoKChlcnIpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyKSk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbVJlYWRhYmxlU3RyZWFtTGlrZShyZWFkYWJsZVN0cmVhbSkge1xuICAgIHJldHVybiBmcm9tQXN5bmNJdGVyYWJsZShyZWFkYWJsZVN0cmVhbUxpa2VUb0FzeW5jR2VuZXJhdG9yKHJlYWRhYmxlU3RyZWFtKSk7XG59XG5mdW5jdGlvbiBwcm9jZXNzKGFzeW5jSXRlcmFibGUsIHN1YnNjcmliZXIpIHtcbiAgICB2YXIgYXN5bmNJdGVyYWJsZV8xLCBhc3luY0l0ZXJhYmxlXzFfMTtcbiAgICB2YXIgZV8xLCBfYTtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChhc3luY0l0ZXJhYmxlXzEgPSBfX2FzeW5jVmFsdWVzKGFzeW5jSXRlcmFibGUpOyBhc3luY0l0ZXJhYmxlXzFfMSA9IHlpZWxkIGFzeW5jSXRlcmFibGVfMS5uZXh0KCksICFhc3luY0l0ZXJhYmxlXzFfMS5kb25lOykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gYXN5bmNJdGVyYWJsZV8xXzEudmFsdWU7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKGFzeW5jSXRlcmFibGVfMV8xICYmICFhc3luY0l0ZXJhYmxlXzFfMS5kb25lICYmIChfYSA9IGFzeW5jSXRlcmFibGVfMS5yZXR1cm4pKSB5aWVsZCBfYS5jYWxsKGFzeW5jSXRlcmFibGVfMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaW5hbGx5IHsgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yOyB9XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5uZXJGcm9tLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBleGVjdXRlU2NoZWR1bGUocGFyZW50U3Vic2NyaXB0aW9uLCBzY2hlZHVsZXIsIHdvcmssIGRlbGF5ID0gMCwgcmVwZWF0ID0gZmFsc2UpIHtcbiAgICBjb25zdCBzY2hlZHVsZVN1YnNjcmlwdGlvbiA9IHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdvcmsoKTtcbiAgICAgICAgaWYgKHJlcGVhdCkge1xuICAgICAgICAgICAgcGFyZW50U3Vic2NyaXB0aW9uLmFkZCh0aGlzLnNjaGVkdWxlKG51bGwsIGRlbGF5KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9LCBkZWxheSk7XG4gICAgcGFyZW50U3Vic2NyaXB0aW9uLmFkZChzY2hlZHVsZVN1YnNjcmlwdGlvbik7XG4gICAgaWYgKCFyZXBlYXQpIHtcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlU3Vic2NyaXB0aW9uO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4ZWN1dGVTY2hlZHVsZS5qcy5tYXAiLCJpbXBvcnQgeyBleGVjdXRlU2NoZWR1bGUgfSBmcm9tICcuLi91dGlsL2V4ZWN1dGVTY2hlZHVsZSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlT24oc2NoZWR1bGVyLCBkZWxheSA9IDApIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IGV4ZWN1dGVTY2hlZHVsZShzdWJzY3JpYmVyLCBzY2hlZHVsZXIsICgpID0+IHN1YnNjcmliZXIubmV4dCh2YWx1ZSksIGRlbGF5KSwgKCkgPT4gZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmliZXIsIHNjaGVkdWxlciwgKCkgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpLCBkZWxheSksIChlcnIpID0+IGV4ZWN1dGVTY2hlZHVsZShzdWJzY3JpYmVyLCBzY2hlZHVsZXIsICgpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyKSwgZGVsYXkpKSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vYnNlcnZlT24uanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5leHBvcnQgZnVuY3Rpb24gc3Vic2NyaWJlT24oc2NoZWR1bGVyLCBkZWxheSA9IDApIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIHN1YnNjcmliZXIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpLCBkZWxheSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3Vic2NyaWJlT24uanMubWFwIiwiaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgb2JzZXJ2ZU9uIH0gZnJvbSAnLi4vb3BlcmF0b3JzL29ic2VydmVPbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVPbiB9IGZyb20gJy4uL29wZXJhdG9ycy9zdWJzY3JpYmVPbic7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVPYnNlcnZhYmxlKGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gaW5uZXJGcm9tKGlucHV0KS5waXBlKHN1YnNjcmliZU9uKHNjaGVkdWxlciksIG9ic2VydmVPbihzY2hlZHVsZXIpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjaGVkdWxlT2JzZXJ2YWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBvYnNlcnZlT24gfSBmcm9tICcuLi9vcGVyYXRvcnMvb2JzZXJ2ZU9uJztcbmltcG9ydCB7IHN1YnNjcmliZU9uIH0gZnJvbSAnLi4vb3BlcmF0b3JzL3N1YnNjcmliZU9uJztcbmV4cG9ydCBmdW5jdGlvbiBzY2hlZHVsZVByb21pc2UoaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBpbm5lckZyb20oaW5wdXQpLnBpcGUoc3Vic2NyaWJlT24oc2NoZWR1bGVyKSwgb2JzZXJ2ZU9uKHNjaGVkdWxlcikpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVQcm9taXNlLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmV4cG9ydCBmdW5jdGlvbiBzY2hlZHVsZUFycmF5KGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpID09PSBpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoaW5wdXRbaSsrXSk7XG4gICAgICAgICAgICAgICAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjaGVkdWxlQXJyYXkuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXRlcmF0b3IgYXMgU3ltYm9sX2l0ZXJhdG9yIH0gZnJvbSAnLi4vc3ltYm9sL2l0ZXJhdG9yJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgZXhlY3V0ZVNjaGVkdWxlIH0gZnJvbSAnLi4vdXRpbC9leGVjdXRlU2NoZWR1bGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlSXRlcmFibGUoaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaXRlcmF0b3I7XG4gICAgICAgIGV4ZWN1dGVTY2hlZHVsZShzdWJzY3JpYmVyLCBzY2hlZHVsZXIsICgpID0+IHtcbiAgICAgICAgICAgIGl0ZXJhdG9yID0gaW5wdXRbU3ltYm9sX2l0ZXJhdG9yXSgpO1xuICAgICAgICAgICAgZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmliZXIsIHNjaGVkdWxlciwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgICAgICAgICBsZXQgZG9uZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAoeyB2YWx1ZSwgZG9uZSB9ID0gaXRlcmF0b3IubmV4dCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAwLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAoKSA9PiBpc0Z1bmN0aW9uKGl0ZXJhdG9yID09PSBudWxsIHx8IGl0ZXJhdG9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBpdGVyYXRvci5yZXR1cm4pICYmIGl0ZXJhdG9yLnJldHVybigpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVJdGVyYWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBleGVjdXRlU2NoZWR1bGUgfSBmcm9tICcuLi91dGlsL2V4ZWN1dGVTY2hlZHVsZSc7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVBc3luY0l0ZXJhYmxlKGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSXRlcmFibGUgY2Fubm90IGJlIG51bGwnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGV4ZWN1dGVTY2hlZHVsZShzdWJzY3JpYmVyLCBzY2hlZHVsZXIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZXJhdG9yID0gaW5wdXRbU3ltYm9sLmFzeW5jSXRlcmF0b3JdKCk7XG4gICAgICAgICAgICBleGVjdXRlU2NoZWR1bGUoc3Vic2NyaWJlciwgc2NoZWR1bGVyLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3IubmV4dCgpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChyZXN1bHQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCAwLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZUFzeW5jSXRlcmFibGUuanMubWFwIiwiaW1wb3J0IHsgc2NoZWR1bGVBc3luY0l0ZXJhYmxlIH0gZnJvbSAnLi9zY2hlZHVsZUFzeW5jSXRlcmFibGUnO1xuaW1wb3J0IHsgcmVhZGFibGVTdHJlYW1MaWtlVG9Bc3luY0dlbmVyYXRvciB9IGZyb20gJy4uL3V0aWwvaXNSZWFkYWJsZVN0cmVhbUxpa2UnO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlUmVhZGFibGVTdHJlYW1MaWtlKGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gc2NoZWR1bGVBc3luY0l0ZXJhYmxlKHJlYWRhYmxlU3RyZWFtTGlrZVRvQXN5bmNHZW5lcmF0b3IoaW5wdXQpLCBzY2hlZHVsZXIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVSZWFkYWJsZVN0cmVhbUxpa2UuanMubWFwIiwiaW1wb3J0IHsgc2NoZWR1bGVPYnNlcnZhYmxlIH0gZnJvbSAnLi9zY2hlZHVsZU9ic2VydmFibGUnO1xuaW1wb3J0IHsgc2NoZWR1bGVQcm9taXNlIH0gZnJvbSAnLi9zY2hlZHVsZVByb21pc2UnO1xuaW1wb3J0IHsgc2NoZWR1bGVBcnJheSB9IGZyb20gJy4vc2NoZWR1bGVBcnJheSc7XG5pbXBvcnQgeyBzY2hlZHVsZUl0ZXJhYmxlIH0gZnJvbSAnLi9zY2hlZHVsZUl0ZXJhYmxlJztcbmltcG9ydCB7IHNjaGVkdWxlQXN5bmNJdGVyYWJsZSB9IGZyb20gJy4vc2NoZWR1bGVBc3luY0l0ZXJhYmxlJztcbmltcG9ydCB7IGlzSW50ZXJvcE9ic2VydmFibGUgfSBmcm9tICcuLi91dGlsL2lzSW50ZXJvcE9ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi4vdXRpbC9pc1Byb21pc2UnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuLi91dGlsL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzSXRlcmFibGUgfSBmcm9tICcuLi91dGlsL2lzSXRlcmFibGUnO1xuaW1wb3J0IHsgaXNBc3luY0l0ZXJhYmxlIH0gZnJvbSAnLi4vdXRpbC9pc0FzeW5jSXRlcmFibGUnO1xuaW1wb3J0IHsgY3JlYXRlSW52YWxpZE9ic2VydmFibGVUeXBlRXJyb3IgfSBmcm9tICcuLi91dGlsL3Rocm93VW5vYnNlcnZhYmxlRXJyb3InO1xuaW1wb3J0IHsgaXNSZWFkYWJsZVN0cmVhbUxpa2UgfSBmcm9tICcuLi91dGlsL2lzUmVhZGFibGVTdHJlYW1MaWtlJztcbmltcG9ydCB7IHNjaGVkdWxlUmVhZGFibGVTdHJlYW1MaWtlIH0gZnJvbSAnLi9zY2hlZHVsZVJlYWRhYmxlU3RyZWFtTGlrZSc7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVkKGlucHV0LCBzY2hlZHVsZXIpIHtcbiAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNJbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZU9ic2VydmFibGUoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXlMaWtlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVkdWxlQXJyYXkoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJvbWlzZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZVByb21pc2UoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXN5bmNJdGVyYWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZUFzeW5jSXRlcmFibGUoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzSXRlcmFibGUoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NoZWR1bGVJdGVyYWJsZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNSZWFkYWJsZVN0cmVhbUxpa2UoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NoZWR1bGVSZWFkYWJsZVN0cmVhbUxpa2UoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgY3JlYXRlSW52YWxpZE9ic2VydmFibGVUeXBlRXJyb3IoaW5wdXQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVkLmpzLm1hcCIsImltcG9ydCB7IHNjaGVkdWxlZCB9IGZyb20gJy4uL3NjaGVkdWxlZC9zY2hlZHVsZWQnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi9pbm5lckZyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIGZyb20oaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBzY2hlZHVsZXIgPyBzY2hlZHVsZWQoaW5wdXQsIHNjaGVkdWxlcikgOiBpbm5lckZyb20oaW5wdXQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJvbS5qcy5tYXAiLCJpbXBvcnQgeyBwb3BTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gb2YoLi4uYXJncykge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHBvcFNjaGVkdWxlcihhcmdzKTtcbiAgICByZXR1cm4gZnJvbShhcmdzLCBzY2hlZHVsZXIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2YuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gdGhyb3dFcnJvcihlcnJvck9yRXJyb3JGYWN0b3J5LCBzY2hlZHVsZXIpIHtcbiAgICBjb25zdCBlcnJvckZhY3RvcnkgPSBpc0Z1bmN0aW9uKGVycm9yT3JFcnJvckZhY3RvcnkpID8gZXJyb3JPckVycm9yRmFjdG9yeSA6ICgpID0+IGVycm9yT3JFcnJvckZhY3Rvcnk7XG4gICAgY29uc3QgaW5pdCA9IChzdWJzY3JpYmVyKSA9PiBzdWJzY3JpYmVyLmVycm9yKGVycm9yRmFjdG9yeSgpKTtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc2NoZWR1bGVyID8gKHN1YnNjcmliZXIpID0+IHNjaGVkdWxlci5zY2hlZHVsZShpbml0LCAwLCBzdWJzY3JpYmVyKSA6IGluaXQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGhyb3dFcnJvci5qcy5tYXAiLCJpbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBvZiB9IGZyb20gJy4vb2JzZXJ2YWJsZS9vZic7XG5pbXBvcnQgeyB0aHJvd0Vycm9yIH0gZnJvbSAnLi9vYnNlcnZhYmxlL3Rocm93RXJyb3InO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmV4cG9ydCB2YXIgTm90aWZpY2F0aW9uS2luZDtcbihmdW5jdGlvbiAoTm90aWZpY2F0aW9uS2luZCkge1xuICAgIE5vdGlmaWNhdGlvbktpbmRbXCJORVhUXCJdID0gXCJOXCI7XG4gICAgTm90aWZpY2F0aW9uS2luZFtcIkVSUk9SXCJdID0gXCJFXCI7XG4gICAgTm90aWZpY2F0aW9uS2luZFtcIkNPTVBMRVRFXCJdID0gXCJDXCI7XG59KShOb3RpZmljYXRpb25LaW5kIHx8IChOb3RpZmljYXRpb25LaW5kID0ge30pKTtcbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGtpbmQsIHZhbHVlLCBlcnJvcikge1xuICAgICAgICB0aGlzLmtpbmQgPSBraW5kO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgdGhpcy5oYXNWYWx1ZSA9IGtpbmQgPT09ICdOJztcbiAgICB9XG4gICAgb2JzZXJ2ZShvYnNlcnZlcikge1xuICAgICAgICByZXR1cm4gb2JzZXJ2ZU5vdGlmaWNhdGlvbih0aGlzLCBvYnNlcnZlcik7XG4gICAgfVxuICAgIGRvKG5leHRIYW5kbGVyLCBlcnJvckhhbmRsZXIsIGNvbXBsZXRlSGFuZGxlcikge1xuICAgICAgICBjb25zdCB7IGtpbmQsIHZhbHVlLCBlcnJvciB9ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGtpbmQgPT09ICdOJyA/IG5leHRIYW5kbGVyID09PSBudWxsIHx8IG5leHRIYW5kbGVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuZXh0SGFuZGxlcih2YWx1ZSkgOiBraW5kID09PSAnRScgPyBlcnJvckhhbmRsZXIgPT09IG51bGwgfHwgZXJyb3JIYW5kbGVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlcnJvckhhbmRsZXIoZXJyb3IpIDogY29tcGxldGVIYW5kbGVyID09PSBudWxsIHx8IGNvbXBsZXRlSGFuZGxlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29tcGxldGVIYW5kbGVyKCk7XG4gICAgfVxuICAgIGFjY2VwdChuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIGlzRnVuY3Rpb24oKF9hID0gbmV4dE9yT2JzZXJ2ZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5uZXh0KVxuICAgICAgICAgICAgPyB0aGlzLm9ic2VydmUobmV4dE9yT2JzZXJ2ZXIpXG4gICAgICAgICAgICA6IHRoaXMuZG8obmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSk7XG4gICAgfVxuICAgIHRvT2JzZXJ2YWJsZSgpIHtcbiAgICAgICAgY29uc3QgeyBraW5kLCB2YWx1ZSwgZXJyb3IgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGtpbmQgPT09ICdOJ1xuICAgICAgICAgICAgP1xuICAgICAgICAgICAgICAgIG9mKHZhbHVlKVxuICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgIGtpbmQgPT09ICdFJ1xuICAgICAgICAgICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKCgpID0+IGVycm9yKVxuICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICBraW5kID09PSAnQydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVNUFRZXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwO1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVW5leHBlY3RlZCBub3RpZmljYXRpb24ga2luZCAke2tpbmR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZU5leHQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24oJ04nLCB2YWx1ZSk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGVFcnJvcihlcnIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24oJ0UnLCB1bmRlZmluZWQsIGVycik7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGVDb21wbGV0ZSgpIHtcbiAgICAgICAgcmV0dXJuIE5vdGlmaWNhdGlvbi5jb21wbGV0ZU5vdGlmaWNhdGlvbjtcbiAgICB9XG59XG5Ob3RpZmljYXRpb24uY29tcGxldGVOb3RpZmljYXRpb24gPSBuZXcgTm90aWZpY2F0aW9uKCdDJyk7XG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZU5vdGlmaWNhdGlvbihub3RpZmljYXRpb24sIG9ic2VydmVyKSB7XG4gICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgY29uc3QgeyBraW5kLCB2YWx1ZSwgZXJyb3IgfSA9IG5vdGlmaWNhdGlvbjtcbiAgICBpZiAodHlwZW9mIGtpbmQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbm90aWZpY2F0aW9uLCBtaXNzaW5nIFwia2luZFwiJyk7XG4gICAgfVxuICAgIGtpbmQgPT09ICdOJyA/IChfYSA9IG9ic2VydmVyLm5leHQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKG9ic2VydmVyLCB2YWx1ZSkgOiBraW5kID09PSAnRScgPyAoX2IgPSBvYnNlcnZlci5lcnJvcikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwob2JzZXJ2ZXIsIGVycm9yKSA6IChfYyA9IG9ic2VydmVyLmNvbXBsZXRlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuY2FsbChvYnNlcnZlcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob3RpZmljYXRpb24uanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gaXNPYnNlcnZhYmxlKG9iaikge1xuICAgIHJldHVybiAhIW9iaiAmJiAob2JqIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSB8fCAoaXNGdW5jdGlvbihvYmoubGlmdCkgJiYgaXNGdW5jdGlvbihvYmouc3Vic2NyaWJlKSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNPYnNlcnZhYmxlLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuL2NyZWF0ZUVycm9yQ2xhc3MnO1xuZXhwb3J0IGNvbnN0IEVtcHR5RXJyb3IgPSBjcmVhdGVFcnJvckNsYXNzKChfc3VwZXIpID0+IGZ1bmN0aW9uIEVtcHR5RXJyb3JJbXBsKCkge1xuICAgIF9zdXBlcih0aGlzKTtcbiAgICB0aGlzLm5hbWUgPSAnRW1wdHlFcnJvcic7XG4gICAgdGhpcy5tZXNzYWdlID0gJ25vIGVsZW1lbnRzIGluIHNlcXVlbmNlJztcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RW1wdHlFcnJvci5qcy5tYXAiLCJpbXBvcnQgeyBFbXB0eUVycm9yIH0gZnJvbSAnLi91dGlsL0VtcHR5RXJyb3InO1xuZXhwb3J0IGZ1bmN0aW9uIGxhc3RWYWx1ZUZyb20oc291cmNlLCBjb25maWcpIHtcbiAgICBjb25zdCBoYXNDb25maWcgPSB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBsZXQgX2hhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIGxldCBfdmFsdWU7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgbmV4dDogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgX2hhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogcmVqZWN0LFxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoX2hhc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoX3ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29uZmlnLmRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVtcHR5RXJyb3IoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sYXN0VmFsdWVGcm9tLmpzLm1hcCIsImltcG9ydCB7IEVtcHR5RXJyb3IgfSBmcm9tICcuL3V0aWwvRW1wdHlFcnJvcic7XG5pbXBvcnQgeyBTYWZlU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gZmlyc3RWYWx1ZUZyb20oc291cmNlLCBjb25maWcpIHtcbiAgICBjb25zdCBoYXNDb25maWcgPSB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVyID0gbmV3IFNhZmVTdWJzY3JpYmVyKHtcbiAgICAgICAgICAgIG5leHQ6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogcmVqZWN0LFxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzQ29uZmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29uZmlnLmRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVtcHR5RXJyb3IoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maXJzdFZhbHVlRnJvbS5qcy5tYXAiLCJpbXBvcnQgeyBjcmVhdGVFcnJvckNsYXNzIH0gZnJvbSAnLi9jcmVhdGVFcnJvckNsYXNzJztcbmV4cG9ydCBjb25zdCBBcmd1bWVudE91dE9mUmFuZ2VFcnJvciA9IGNyZWF0ZUVycm9yQ2xhc3MoKF9zdXBlcikgPT4gZnVuY3Rpb24gQXJndW1lbnRPdXRPZlJhbmdlRXJyb3JJbXBsKCkge1xuICAgIF9zdXBlcih0aGlzKTtcbiAgICB0aGlzLm5hbWUgPSAnQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuICAgIHRoaXMubWVzc2FnZSA9ICdhcmd1bWVudCBvdXQgb2YgcmFuZ2UnO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Bcmd1bWVudE91dE9mUmFuZ2VFcnJvci5qcy5tYXAiLCJpbXBvcnQgeyBjcmVhdGVFcnJvckNsYXNzIH0gZnJvbSAnLi9jcmVhdGVFcnJvckNsYXNzJztcbmV4cG9ydCBjb25zdCBOb3RGb3VuZEVycm9yID0gY3JlYXRlRXJyb3JDbGFzcygoX3N1cGVyKSA9PiBmdW5jdGlvbiBOb3RGb3VuZEVycm9ySW1wbChtZXNzYWdlKSB7XG4gICAgX3N1cGVyKHRoaXMpO1xuICAgIHRoaXMubmFtZSA9ICdOb3RGb3VuZEVycm9yJztcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob3RGb3VuZEVycm9yLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuL2NyZWF0ZUVycm9yQ2xhc3MnO1xuZXhwb3J0IGNvbnN0IFNlcXVlbmNlRXJyb3IgPSBjcmVhdGVFcnJvckNsYXNzKChfc3VwZXIpID0+IGZ1bmN0aW9uIFNlcXVlbmNlRXJyb3JJbXBsKG1lc3NhZ2UpIHtcbiAgICBfc3VwZXIodGhpcyk7XG4gICAgdGhpcy5uYW1lID0gJ1NlcXVlbmNlRXJyb3InO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVNlcXVlbmNlRXJyb3IuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWREYXRlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRGF0ZSAmJiAhaXNOYU4odmFsdWUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNEYXRlLmpzLm1hcCIsImltcG9ydCB7IGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IGlzVmFsaWREYXRlIH0gZnJvbSAnLi4vdXRpbC9pc0RhdGUnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBjcmVhdGVFcnJvckNsYXNzIH0gZnJvbSAnLi4vdXRpbC9jcmVhdGVFcnJvckNsYXNzJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGV4ZWN1dGVTY2hlZHVsZSB9IGZyb20gJy4uL3V0aWwvZXhlY3V0ZVNjaGVkdWxlJztcbmV4cG9ydCBjb25zdCBUaW1lb3V0RXJyb3IgPSBjcmVhdGVFcnJvckNsYXNzKChfc3VwZXIpID0+IGZ1bmN0aW9uIFRpbWVvdXRFcnJvckltcGwoaW5mbyA9IG51bGwpIHtcbiAgICBfc3VwZXIodGhpcyk7XG4gICAgdGhpcy5tZXNzYWdlID0gJ1RpbWVvdXQgaGFzIG9jY3VycmVkJztcbiAgICB0aGlzLm5hbWUgPSAnVGltZW91dEVycm9yJztcbiAgICB0aGlzLmluZm8gPSBpbmZvO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gdGltZW91dChjb25maWcsIHNjaGVkdWxlckFyZykge1xuICAgIGNvbnN0IHsgZmlyc3QsIGVhY2gsIHdpdGg6IF93aXRoID0gdGltZW91dEVycm9yRmFjdG9yeSwgc2NoZWR1bGVyID0gc2NoZWR1bGVyQXJnICE9PSBudWxsICYmIHNjaGVkdWxlckFyZyAhPT0gdm9pZCAwID8gc2NoZWR1bGVyQXJnIDogYXN5bmNTY2hlZHVsZXIsIG1ldGEgPSBudWxsIH0gPSAoaXNWYWxpZERhdGUoY29uZmlnKVxuICAgICAgICA/IHsgZmlyc3Q6IGNvbmZpZyB9XG4gICAgICAgIDogdHlwZW9mIGNvbmZpZyA9PT0gJ251bWJlcidcbiAgICAgICAgICAgID8geyBlYWNoOiBjb25maWcgfVxuICAgICAgICAgICAgOiBjb25maWcpO1xuICAgIGlmIChmaXJzdCA9PSBudWxsICYmIGVhY2ggPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdObyB0aW1lb3V0IHByb3ZpZGVkLicpO1xuICAgIH1cbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBvcmlnaW5hbFNvdXJjZVN1YnNjcmlwdGlvbjtcbiAgICAgICAgbGV0IHRpbWVyU3Vic2NyaXB0aW9uO1xuICAgICAgICBsZXQgbGFzdFZhbHVlID0gbnVsbDtcbiAgICAgICAgbGV0IHNlZW4gPSAwO1xuICAgICAgICBjb25zdCBzdGFydFRpbWVyID0gKGRlbGF5KSA9PiB7XG4gICAgICAgICAgICB0aW1lclN1YnNjcmlwdGlvbiA9IGV4ZWN1dGVTY2hlZHVsZShzdWJzY3JpYmVyLCBzY2hlZHVsZXIsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFNvdXJjZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICBpbm5lckZyb20oX3dpdGgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlZW4sXG4gICAgICAgICAgICAgICAgICAgIH0pKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGRlbGF5KTtcbiAgICAgICAgfTtcbiAgICAgICAgb3JpZ2luYWxTb3VyY2VTdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aW1lclN1YnNjcmlwdGlvbiA9PT0gbnVsbCB8fCB0aW1lclN1YnNjcmlwdGlvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGltZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHNlZW4rKztcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCgobGFzdFZhbHVlID0gdmFsdWUpKTtcbiAgICAgICAgICAgIGVhY2ggPiAwICYmIHN0YXJ0VGltZXIoZWFjaCk7XG4gICAgICAgIH0sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoISh0aW1lclN1YnNjcmlwdGlvbiA9PT0gbnVsbCB8fCB0aW1lclN1YnNjcmlwdGlvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGltZXJTdWJzY3JpcHRpb24uY2xvc2VkKSkge1xuICAgICAgICAgICAgICAgIHRpbWVyU3Vic2NyaXB0aW9uID09PSBudWxsIHx8IHRpbWVyU3Vic2NyaXB0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0aW1lclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFzdFZhbHVlID0gbnVsbDtcbiAgICAgICAgfSkpO1xuICAgICAgICBzdGFydFRpbWVyKGZpcnN0ICE9IG51bGwgPyAodHlwZW9mIGZpcnN0ID09PSAnbnVtYmVyJyA/IGZpcnN0IDogK2ZpcnN0IC0gc2NoZWR1bGVyLm5vdygpKSA6IGVhY2gpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gdGltZW91dEVycm9yRmFjdG9yeShpbmZvKSB7XG4gICAgdGhyb3cgbmV3IFRpbWVvdXRFcnJvcihpbmZvKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWVvdXQuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gbWFwKHByb2plY3QsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwcm9qZWN0LmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4KyspKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwLmpzLm1hcCIsImltcG9ydCB7IG1hcCB9IGZyb20gXCIuLi9vcGVyYXRvcnMvbWFwXCI7XG5jb25zdCB7IGlzQXJyYXkgfSA9IEFycmF5O1xuZnVuY3Rpb24gY2FsbE9yQXBwbHkoZm4sIGFyZ3MpIHtcbiAgICByZXR1cm4gaXNBcnJheShhcmdzKSA/IGZuKC4uLmFyZ3MpIDogZm4oYXJncyk7XG59XG5leHBvcnQgZnVuY3Rpb24gbWFwT25lT3JNYW55QXJncyhmbikge1xuICAgIHJldHVybiBtYXAoYXJncyA9PiBjYWxsT3JBcHBseShmbiwgYXJncykpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwT25lT3JNYW55QXJncy5qcy5tYXAiLCJpbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgc3Vic2NyaWJlT24gfSBmcm9tICcuLi9vcGVyYXRvcnMvc3Vic2NyaWJlT24nO1xuaW1wb3J0IHsgbWFwT25lT3JNYW55QXJncyB9IGZyb20gJy4uL3V0aWwvbWFwT25lT3JNYW55QXJncyc7XG5pbXBvcnQgeyBvYnNlcnZlT24gfSBmcm9tICcuLi9vcGVyYXRvcnMvb2JzZXJ2ZU9uJztcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJy4uL0FzeW5jU3ViamVjdCc7XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrSW50ZXJuYWxzKGlzTm9kZVN0eWxlLCBjYWxsYmFja0Z1bmMsIHJlc3VsdFNlbGVjdG9yLCBzY2hlZHVsZXIpIHtcbiAgICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAgICAgaWYgKGlzU2NoZWR1bGVyKHJlc3VsdFNlbGVjdG9yKSkge1xuICAgICAgICAgICAgc2NoZWR1bGVyID0gcmVzdWx0U2VsZWN0b3I7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmluZENhbGxiYWNrSW50ZXJuYWxzKGlzTm9kZVN0eWxlLCBjYWxsYmFja0Z1bmMsIHNjaGVkdWxlcilcbiAgICAgICAgICAgICAgICAgICAgLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgICAgICAgICAgICAgICAgIC5waXBlKG1hcE9uZU9yTWFueUFyZ3MocmVzdWx0U2VsZWN0b3IpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kQ2FsbGJhY2tJbnRlcm5hbHMoaXNOb2RlU3R5bGUsIGNhbGxiYWNrRnVuYylcbiAgICAgICAgICAgICAgICAuYXBwbHkodGhpcywgYXJncylcbiAgICAgICAgICAgICAgICAucGlwZShzdWJzY3JpYmVPbihzY2hlZHVsZXIpLCBvYnNlcnZlT24oc2NoZWR1bGVyKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gbmV3IEFzeW5jU3ViamVjdCgpO1xuICAgICAgICBsZXQgdW5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3VicyA9IHN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgaWYgKHVuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICB1bmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IGlzQXN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgaXNDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrRnVuYy5hcHBseSh0aGlzLCBbXG4gICAgICAgICAgICAgICAgICAgIC4uLmFyZ3MsXG4gICAgICAgICAgICAgICAgICAgICguLi5yZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOb2RlU3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSByZXN1bHRzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YmplY3QubmV4dCgxIDwgcmVzdWx0cy5sZW5ndGggPyByZXN1bHRzIDogcmVzdWx0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0FzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIGlmIChpc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXNBc3luYyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3VicztcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJpbmRDYWxsYmFja0ludGVybmFscy5qcy5tYXAiLCJpbXBvcnQgeyBiaW5kQ2FsbGJhY2tJbnRlcm5hbHMgfSBmcm9tICcuL2JpbmRDYWxsYmFja0ludGVybmFscyc7XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrKGNhbGxiYWNrRnVuYywgcmVzdWx0U2VsZWN0b3IsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBiaW5kQ2FsbGJhY2tJbnRlcm5hbHMoZmFsc2UsIGNhbGxiYWNrRnVuYywgcmVzdWx0U2VsZWN0b3IsIHNjaGVkdWxlcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1iaW5kQ2FsbGJhY2suanMubWFwIiwiaW1wb3J0IHsgYmluZENhbGxiYWNrSW50ZXJuYWxzIH0gZnJvbSAnLi9iaW5kQ2FsbGJhY2tJbnRlcm5hbHMnO1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2soY2FsbGJhY2tGdW5jLCByZXN1bHRTZWxlY3Rvciwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIGJpbmRDYWxsYmFja0ludGVybmFscyh0cnVlLCBjYWxsYmFja0Z1bmMsIHJlc3VsdFNlbGVjdG9yLCBzY2hlZHVsZXIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmluZE5vZGVDYWxsYmFjay5qcy5tYXAiLCJjb25zdCB7IGlzQXJyYXkgfSA9IEFycmF5O1xuY29uc3QgeyBnZXRQcm90b3R5cGVPZiwgcHJvdG90eXBlOiBvYmplY3RQcm90bywga2V5czogZ2V0S2V5cyB9ID0gT2JqZWN0O1xuZXhwb3J0IGZ1bmN0aW9uIGFyZ3NBcmdBcnJheU9yT2JqZWN0KGFyZ3MpIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29uc3QgZmlyc3QgPSBhcmdzWzBdO1xuICAgICAgICBpZiAoaXNBcnJheShmaXJzdCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGFyZ3M6IGZpcnN0LCBrZXlzOiBudWxsIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUE9KTyhmaXJzdCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBnZXRLZXlzKGZpcnN0KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYXJnczoga2V5cy5tYXAoKGtleSkgPT4gZmlyc3Rba2V5XSksXG4gICAgICAgICAgICAgICAga2V5cyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgYXJnczogYXJncywga2V5czogbnVsbCB9O1xufVxuZnVuY3Rpb24gaXNQT0pPKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgZ2V0UHJvdG90eXBlT2Yob2JqKSA9PT0gb2JqZWN0UHJvdG87XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcmdzQXJnQXJyYXlPck9iamVjdC5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlT2JqZWN0KGtleXMsIHZhbHVlcykge1xuICAgIHJldHVybiBrZXlzLnJlZHVjZSgocmVzdWx0LCBrZXksIGkpID0+ICgocmVzdWx0W2tleV0gPSB2YWx1ZXNbaV0pLCByZXN1bHQpLCB7fSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGVPYmplY3QuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgYXJnc0FyZ0FycmF5T3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2FyZ3NBcmdBcnJheU9yT2JqZWN0JztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmltcG9ydCB7IG1hcE9uZU9yTWFueUFyZ3MgfSBmcm9tICcuLi91dGlsL21hcE9uZU9yTWFueUFyZ3MnO1xuaW1wb3J0IHsgcG9wUmVzdWx0U2VsZWN0b3IsIHBvcFNjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5pbXBvcnQgeyBjcmVhdGVPYmplY3QgfSBmcm9tICcuLi91dGlsL2NyZWF0ZU9iamVjdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuLi9vcGVyYXRvcnMvT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGV4ZWN1dGVTY2hlZHVsZSB9IGZyb20gJy4uL3V0aWwvZXhlY3V0ZVNjaGVkdWxlJztcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0KC4uLmFyZ3MpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSBwb3BTY2hlZHVsZXIoYXJncyk7XG4gICAgY29uc3QgcmVzdWx0U2VsZWN0b3IgPSBwb3BSZXN1bHRTZWxlY3RvcihhcmdzKTtcbiAgICBjb25zdCB7IGFyZ3M6IG9ic2VydmFibGVzLCBrZXlzIH0gPSBhcmdzQXJnQXJyYXlPck9iamVjdChhcmdzKTtcbiAgICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmcm9tKFtdLCBzY2hlZHVsZXIpO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSBuZXcgT2JzZXJ2YWJsZShjb21iaW5lTGF0ZXN0SW5pdChvYnNlcnZhYmxlcywgc2NoZWR1bGVyLCBrZXlzXG4gICAgICAgID9cbiAgICAgICAgICAgICh2YWx1ZXMpID0+IGNyZWF0ZU9iamVjdChrZXlzLCB2YWx1ZXMpXG4gICAgICAgIDpcbiAgICAgICAgICAgIGlkZW50aXR5KSk7XG4gICAgcmV0dXJuIHJlc3VsdFNlbGVjdG9yID8gcmVzdWx0LnBpcGUobWFwT25lT3JNYW55QXJncyhyZXN1bHRTZWxlY3RvcikpIDogcmVzdWx0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3RJbml0KG9ic2VydmFibGVzLCBzY2hlZHVsZXIsIHZhbHVlVHJhbnNmb3JtID0gaWRlbnRpdHkpIHtcbiAgICByZXR1cm4gKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbWF5YmVTY2hlZHVsZShzY2hlZHVsZXIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSBvYnNlcnZhYmxlcztcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgICAgICAgICAgbGV0IGFjdGl2ZSA9IGxlbmd0aDtcbiAgICAgICAgICAgIGxldCByZW1haW5pbmdGaXJzdFZhbHVlcyA9IGxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBtYXliZVNjaGVkdWxlKHNjaGVkdWxlciwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2UgPSBmcm9tKG9ic2VydmFibGVzW2ldLCBzY2hlZHVsZXIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaGFzRmlyc3RWYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbaV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGFzRmlyc3RWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0ZpcnN0VmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ0ZpcnN0VmFsdWVzLS07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlbWFpbmluZ0ZpcnN0VmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlVHJhbnNmb3JtKHZhbHVlcy5zbGljZSgpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghLS1hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9LCBzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgc3Vic2NyaWJlcik7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG1heWJlU2NoZWR1bGUoc2NoZWR1bGVyLCBleGVjdXRlLCBzdWJzY3JpcHRpb24pIHtcbiAgICBpZiAoc2NoZWR1bGVyKSB7XG4gICAgICAgIGV4ZWN1dGVTY2hlZHVsZShzdWJzY3JpcHRpb24sIHNjaGVkdWxlciwgZXhlY3V0ZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBleGVjdXRlKCk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tYmluZUxhdGVzdC5qcy5tYXAiLCJpbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBleGVjdXRlU2NoZWR1bGUgfSBmcm9tICcuLi91dGlsL2V4ZWN1dGVTY2hlZHVsZSc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VJbnRlcm5hbHMoc291cmNlLCBzdWJzY3JpYmVyLCBwcm9qZWN0LCBjb25jdXJyZW50LCBvbkJlZm9yZU5leHQsIGV4cGFuZCwgaW5uZXJTdWJTY2hlZHVsZXIsIGFkZGl0aW9uYWxUZWFyZG93bikge1xuICAgIGNvbnN0IGJ1ZmZlciA9IFtdO1xuICAgIGxldCBhY3RpdmUgPSAwO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IGlzQ29tcGxldGUgPSBmYWxzZTtcbiAgICBjb25zdCBjaGVja0NvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICBpZiAoaXNDb21wbGV0ZSAmJiAhYnVmZmVyLmxlbmd0aCAmJiAhYWN0aXZlKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IG91dGVyTmV4dCA9ICh2YWx1ZSkgPT4gKGFjdGl2ZSA8IGNvbmN1cnJlbnQgPyBkb0lubmVyU3ViKHZhbHVlKSA6IGJ1ZmZlci5wdXNoKHZhbHVlKSk7XG4gICAgY29uc3QgZG9Jbm5lclN1YiA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICBleHBhbmQgJiYgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgYWN0aXZlKys7XG4gICAgICAgIGxldCBpbm5lckNvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGlubmVyRnJvbShwcm9qZWN0KHZhbHVlLCBpbmRleCsrKSkuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKGlubmVyVmFsdWUpID0+IHtcbiAgICAgICAgICAgIG9uQmVmb3JlTmV4dCA9PT0gbnVsbCB8fCBvbkJlZm9yZU5leHQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9uQmVmb3JlTmV4dChpbm5lclZhbHVlKTtcbiAgICAgICAgICAgIGlmIChleHBhbmQpIHtcbiAgICAgICAgICAgICAgICBvdXRlck5leHQoaW5uZXJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoaW5uZXJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGlubmVyQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICB9LCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChpbm5lckNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLS07XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChidWZmZXIubGVuZ3RoICYmIGFjdGl2ZSA8IGNvbmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlcmVkVmFsdWUgPSBidWZmZXIuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbm5lclN1YlNjaGVkdWxlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVTY2hlZHVsZShzdWJzY3JpYmVyLCBpbm5lclN1YlNjaGVkdWxlciwgKCkgPT4gZG9Jbm5lclN1YihidWZmZXJlZFZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb0lubmVyU3ViKGJ1ZmZlcmVkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfTtcbiAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgb3V0ZXJOZXh0LCAoKSA9PiB7XG4gICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICBjaGVja0NvbXBsZXRlKCk7XG4gICAgfSkpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGFkZGl0aW9uYWxUZWFyZG93biA9PT0gbnVsbCB8fCBhZGRpdGlvbmFsVGVhcmRvd24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGFkZGl0aW9uYWxUZWFyZG93bigpO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZXJnZUludGVybmFscy5qcy5tYXAiLCJpbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IG1lcmdlSW50ZXJuYWxzIH0gZnJvbSAnLi9tZXJnZUludGVybmFscyc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU1hcChwcm9qZWN0LCByZXN1bHRTZWxlY3RvciwgY29uY3VycmVudCA9IEluZmluaXR5KSB7XG4gICAgaWYgKGlzRnVuY3Rpb24ocmVzdWx0U2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBtZXJnZU1hcCgoYSwgaSkgPT4gbWFwKChiLCBpaSkgPT4gcmVzdWx0U2VsZWN0b3IoYSwgYiwgaSwgaWkpKShpbm5lckZyb20ocHJvamVjdChhLCBpKSkpLCBjb25jdXJyZW50KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIHJlc3VsdFNlbGVjdG9yID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb25jdXJyZW50ID0gcmVzdWx0U2VsZWN0b3I7XG4gICAgfVxuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IG1lcmdlSW50ZXJuYWxzKHNvdXJjZSwgc3Vic2NyaWJlciwgcHJvamVjdCwgY29uY3VycmVudCkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVyZ2VNYXAuanMubWFwIiwiaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICcuL21lcmdlTWFwJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VBbGwoY29uY3VycmVudCA9IEluZmluaXR5KSB7XG4gICAgcmV0dXJuIG1lcmdlTWFwKGlkZW50aXR5LCBjb25jdXJyZW50KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lcmdlQWxsLmpzLm1hcCIsImltcG9ydCB7IG1lcmdlQWxsIH0gZnJvbSAnLi9tZXJnZUFsbCc7XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0QWxsKCkge1xuICAgIHJldHVybiBtZXJnZUFsbCgxKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbmNhdEFsbC5qcy5tYXAiLCJpbXBvcnQgeyBjb25jYXRBbGwgfSBmcm9tICcuLi9vcGVyYXRvcnMvY29uY2F0QWxsJztcbmltcG9ydCB7IHBvcFNjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQoLi4uYXJncykge1xuICAgIHJldHVybiBjb25jYXRBbGwoKShmcm9tKGFyZ3MsIHBvcFNjaGVkdWxlcihhcmdzKSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uY2F0LmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4vaW5uZXJGcm9tJztcbmV4cG9ydCBmdW5jdGlvbiBkZWZlcihvYnNlcnZhYmxlRmFjdG9yeSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBpbm5lckZyb20ob2JzZXJ2YWJsZUZhY3RvcnkoKSkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVmZXIuanMubWFwIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZGVmZXIgfSBmcm9tICcuL2RlZmVyJztcbmNvbnN0IERFRkFVTFRfQ09ORklHID0ge1xuICAgIGNvbm5lY3RvcjogKCkgPT4gbmV3IFN1YmplY3QoKSxcbiAgICByZXNldE9uRGlzY29ubmVjdDogdHJ1ZSxcbn07XG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdGFibGUoc291cmNlLCBjb25maWcgPSBERUZBVUxUX0NPTkZJRykge1xuICAgIGxldCBjb25uZWN0aW9uID0gbnVsbDtcbiAgICBjb25zdCB7IGNvbm5lY3RvciwgcmVzZXRPbkRpc2Nvbm5lY3QgPSB0cnVlIH0gPSBjb25maWc7XG4gICAgbGV0IHN1YmplY3QgPSBjb25uZWN0b3IoKTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICByZXR1cm4gc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSk7XG4gICAgcmVzdWx0LmNvbm5lY3QgPSAoKSA9PiB7XG4gICAgICAgIGlmICghY29ubmVjdGlvbiB8fCBjb25uZWN0aW9uLmNsb3NlZCkge1xuICAgICAgICAgICAgY29ubmVjdGlvbiA9IGRlZmVyKCgpID0+IHNvdXJjZSkuc3Vic2NyaWJlKHN1YmplY3QpO1xuICAgICAgICAgICAgaWYgKHJlc2V0T25EaXNjb25uZWN0KSB7XG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbi5hZGQoKCkgPT4gKHN1YmplY3QgPSBjb25uZWN0b3IoKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25uZWN0aW9uO1xuICAgIH07XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbm5lY3RhYmxlLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGFyZ3NBcmdBcnJheU9yT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9hcmdzQXJnQXJyYXlPck9iamVjdCc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBwb3BSZXN1bHRTZWxlY3RvciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuLi9vcGVyYXRvcnMvT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IG1hcE9uZU9yTWFueUFyZ3MgfSBmcm9tICcuLi91dGlsL21hcE9uZU9yTWFueUFyZ3MnO1xuaW1wb3J0IHsgY3JlYXRlT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9jcmVhdGVPYmplY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luKC4uLmFyZ3MpIHtcbiAgICBjb25zdCByZXN1bHRTZWxlY3RvciA9IHBvcFJlc3VsdFNlbGVjdG9yKGFyZ3MpO1xuICAgIGNvbnN0IHsgYXJnczogc291cmNlcywga2V5cyB9ID0gYXJnc0FyZ0FycmF5T3JPYmplY3QoYXJncyk7XG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3QgeyBsZW5ndGggfSA9IHNvdXJjZXM7XG4gICAgICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgIGxldCByZW1haW5pbmdDb21wbGV0aW9ucyA9IGxlbmd0aDtcbiAgICAgICAgbGV0IHJlbWFpbmluZ0VtaXNzaW9ucyA9IGxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgc291cmNlSW5kZXggPSAwOyBzb3VyY2VJbmRleCA8IGxlbmd0aDsgc291cmNlSW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBpbm5lckZyb20oc291cmNlc1tzb3VyY2VJbmRleF0pLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghaGFzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZW1haW5pbmdFbWlzc2lvbnMtLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWVzW3NvdXJjZUluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSwgKCkgPT4gcmVtYWluaW5nQ29tcGxldGlvbnMtLSwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZW1haW5pbmdDb21wbGV0aW9ucyB8fCAhaGFzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZW1haW5pbmdFbWlzc2lvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChrZXlzID8gY3JlYXRlT2JqZWN0KGtleXMsIHZhbHVlcykgOiB2YWx1ZXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3IgPyByZXN1bHQucGlwZShtYXBPbmVPck1hbnlBcmdzKHJlc3VsdFNlbGVjdG9yKSkgOiByZXN1bHQ7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3JrSm9pbi5qcy5tYXAiLCJpbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tZXJnZU1hcCc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheUxpa2UnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBtYXBPbmVPck1hbnlBcmdzIH0gZnJvbSAnLi4vdXRpbC9tYXBPbmVPck1hbnlBcmdzJztcbmNvbnN0IG5vZGVFdmVudEVtaXR0ZXJNZXRob2RzID0gWydhZGRMaXN0ZW5lcicsICdyZW1vdmVMaXN0ZW5lciddO1xuY29uc3QgZXZlbnRUYXJnZXRNZXRob2RzID0gWydhZGRFdmVudExpc3RlbmVyJywgJ3JlbW92ZUV2ZW50TGlzdGVuZXInXTtcbmNvbnN0IGpxdWVyeU1ldGhvZHMgPSBbJ29uJywgJ29mZiddO1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudCh0YXJnZXQsIGV2ZW50TmFtZSwgb3B0aW9ucywgcmVzdWx0U2VsZWN0b3IpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihvcHRpb25zKSkge1xuICAgICAgICByZXN1bHRTZWxlY3RvciA9IG9wdGlvbnM7XG4gICAgICAgIG9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZnJvbUV2ZW50KHRhcmdldCwgZXZlbnROYW1lLCBvcHRpb25zKS5waXBlKG1hcE9uZU9yTWFueUFyZ3MocmVzdWx0U2VsZWN0b3IpKTtcbiAgICB9XG4gICAgY29uc3QgW2FkZCwgcmVtb3ZlXSA9IGlzRXZlbnRUYXJnZXQodGFyZ2V0KVxuICAgICAgICA/IGV2ZW50VGFyZ2V0TWV0aG9kcy5tYXAoKG1ldGhvZE5hbWUpID0+IChoYW5kbGVyKSA9PiB0YXJnZXRbbWV0aG9kTmFtZV0oZXZlbnROYW1lLCBoYW5kbGVyLCBvcHRpb25zKSlcbiAgICAgICAgOlxuICAgICAgICAgICAgaXNOb2RlU3R5bGVFdmVudEVtaXR0ZXIodGFyZ2V0KVxuICAgICAgICAgICAgICAgID8gbm9kZUV2ZW50RW1pdHRlck1ldGhvZHMubWFwKHRvQ29tbW9uSGFuZGxlclJlZ2lzdHJ5KHRhcmdldCwgZXZlbnROYW1lKSlcbiAgICAgICAgICAgICAgICA6IGlzSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXIodGFyZ2V0KVxuICAgICAgICAgICAgICAgICAgICA/IGpxdWVyeU1ldGhvZHMubWFwKHRvQ29tbW9uSGFuZGxlclJlZ2lzdHJ5KHRhcmdldCwgZXZlbnROYW1lKSlcbiAgICAgICAgICAgICAgICAgICAgOiBbXTtcbiAgICBpZiAoIWFkZCkge1xuICAgICAgICBpZiAoaXNBcnJheUxpa2UodGFyZ2V0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG1lcmdlTWFwKChzdWJUYXJnZXQpID0+IGZyb21FdmVudChzdWJUYXJnZXQsIGV2ZW50TmFtZSwgb3B0aW9ucykpKGlubmVyRnJvbSh0YXJnZXQpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWFkZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGV2ZW50IHRhcmdldCcpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9ICguLi5hcmdzKSA9PiBzdWJzY3JpYmVyLm5leHQoMSA8IGFyZ3MubGVuZ3RoID8gYXJncyA6IGFyZ3NbMF0pO1xuICAgICAgICBhZGQoaGFuZGxlcik7XG4gICAgICAgIHJldHVybiAoKSA9PiByZW1vdmUoaGFuZGxlcik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB0b0NvbW1vbkhhbmRsZXJSZWdpc3RyeSh0YXJnZXQsIGV2ZW50TmFtZSkge1xuICAgIHJldHVybiAobWV0aG9kTmFtZSkgPT4gKGhhbmRsZXIpID0+IHRhcmdldFttZXRob2ROYW1lXShldmVudE5hbWUsIGhhbmRsZXIpO1xufVxuZnVuY3Rpb24gaXNOb2RlU3R5bGVFdmVudEVtaXR0ZXIodGFyZ2V0KSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24odGFyZ2V0LmFkZExpc3RlbmVyKSAmJiBpc0Z1bmN0aW9uKHRhcmdldC5yZW1vdmVMaXN0ZW5lcik7XG59XG5mdW5jdGlvbiBpc0pRdWVyeVN0eWxlRXZlbnRFbWl0dGVyKHRhcmdldCkge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKHRhcmdldC5vbikgJiYgaXNGdW5jdGlvbih0YXJnZXQub2ZmKTtcbn1cbmZ1bmN0aW9uIGlzRXZlbnRUYXJnZXQodGFyZ2V0KSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24odGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIpICYmIGlzRnVuY3Rpb24odGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJvbUV2ZW50LmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgbWFwT25lT3JNYW55QXJncyB9IGZyb20gJy4uL3V0aWwvbWFwT25lT3JNYW55QXJncyc7XG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50UGF0dGVybihhZGRIYW5kbGVyLCByZW1vdmVIYW5kbGVyLCByZXN1bHRTZWxlY3Rvcikge1xuICAgIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZnJvbUV2ZW50UGF0dGVybihhZGRIYW5kbGVyLCByZW1vdmVIYW5kbGVyKS5waXBlKG1hcE9uZU9yTWFueUFyZ3MocmVzdWx0U2VsZWN0b3IpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uZSkgPT4gc3Vic2NyaWJlci5uZXh0KGUubGVuZ3RoID09PSAxID8gZVswXSA6IGUpO1xuICAgICAgICBjb25zdCByZXRWYWx1ZSA9IGFkZEhhbmRsZXIoaGFuZGxlcik7XG4gICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKHJlbW92ZUhhbmRsZXIpID8gKCkgPT4gcmVtb3ZlSGFuZGxlcihoYW5kbGVyLCByZXRWYWx1ZSkgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mcm9tRXZlbnRQYXR0ZXJuLmpzLm1hcCIsImltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgZGVmZXIgfSBmcm9tICcuL2RlZmVyJztcbmltcG9ydCB7IHNjaGVkdWxlSXRlcmFibGUgfSBmcm9tICcuLi9zY2hlZHVsZWQvc2NoZWR1bGVJdGVyYWJsZSc7XG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGUoaW5pdGlhbFN0YXRlT3JPcHRpb25zLCBjb25kaXRpb24sIGl0ZXJhdGUsIHJlc3VsdFNlbGVjdG9yT3JTY2hlZHVsZXIsIHNjaGVkdWxlcikge1xuICAgIGxldCByZXN1bHRTZWxlY3RvcjtcbiAgICBsZXQgaW5pdGlhbFN0YXRlO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICh7XG4gICAgICAgICAgICBpbml0aWFsU3RhdGUsXG4gICAgICAgICAgICBjb25kaXRpb24sXG4gICAgICAgICAgICBpdGVyYXRlLFxuICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3IgPSBpZGVudGl0eSxcbiAgICAgICAgICAgIHNjaGVkdWxlcixcbiAgICAgICAgfSA9IGluaXRpYWxTdGF0ZU9yT3B0aW9ucyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpbml0aWFsU3RhdGUgPSBpbml0aWFsU3RhdGVPck9wdGlvbnM7XG4gICAgICAgIGlmICghcmVzdWx0U2VsZWN0b3JPclNjaGVkdWxlciB8fCBpc1NjaGVkdWxlcihyZXN1bHRTZWxlY3Rvck9yU2NoZWR1bGVyKSkge1xuICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3IgPSBpZGVudGl0eTtcbiAgICAgICAgICAgIHNjaGVkdWxlciA9IHJlc3VsdFNlbGVjdG9yT3JTY2hlZHVsZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRTZWxlY3RvciA9IHJlc3VsdFNlbGVjdG9yT3JTY2hlZHVsZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24qIGdlbigpIHtcbiAgICAgICAgZm9yIChsZXQgc3RhdGUgPSBpbml0aWFsU3RhdGU7ICFjb25kaXRpb24gfHwgY29uZGl0aW9uKHN0YXRlKTsgc3RhdGUgPSBpdGVyYXRlKHN0YXRlKSkge1xuICAgICAgICAgICAgeWllbGQgcmVzdWx0U2VsZWN0b3Ioc3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZWZlcigoc2NoZWR1bGVyXG4gICAgICAgID9cbiAgICAgICAgICAgICgpID0+IHNjaGVkdWxlSXRlcmFibGUoZ2VuKCksIHNjaGVkdWxlcilcbiAgICAgICAgOlxuICAgICAgICAgICAgZ2VuKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZW5lcmF0ZS5qcy5tYXAiLCJpbXBvcnQgeyBkZWZlciB9IGZyb20gJy4vZGVmZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGlpZihjb25kaXRpb24sIHRydWVSZXN1bHQsIGZhbHNlUmVzdWx0KSB7XG4gICAgcmV0dXJuIGRlZmVyKCgpID0+IChjb25kaXRpb24oKSA/IHRydWVSZXN1bHQgOiBmYWxzZVJlc3VsdCkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aWlmLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGFzeW5jIGFzIGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBpc1ZhbGlkRGF0ZSB9IGZyb20gJy4uL3V0aWwvaXNEYXRlJztcbmV4cG9ydCBmdW5jdGlvbiB0aW1lcihkdWVUaW1lID0gMCwgaW50ZXJ2YWxPclNjaGVkdWxlciwgc2NoZWR1bGVyID0gYXN5bmNTY2hlZHVsZXIpIHtcbiAgICBsZXQgaW50ZXJ2YWxEdXJhdGlvbiA9IC0xO1xuICAgIGlmIChpbnRlcnZhbE9yU2NoZWR1bGVyICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGlzU2NoZWR1bGVyKGludGVydmFsT3JTY2hlZHVsZXIpKSB7XG4gICAgICAgICAgICBzY2hlZHVsZXIgPSBpbnRlcnZhbE9yU2NoZWR1bGVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWxEdXJhdGlvbiA9IGludGVydmFsT3JTY2hlZHVsZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBkdWUgPSBpc1ZhbGlkRGF0ZShkdWVUaW1lKSA/ICtkdWVUaW1lIC0gc2NoZWR1bGVyLm5vdygpIDogZHVlVGltZTtcbiAgICAgICAgaWYgKGR1ZSA8IDApIHtcbiAgICAgICAgICAgIGR1ZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG4gPSAwO1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQobisrKTtcbiAgICAgICAgICAgICAgICBpZiAoMCA8PSBpbnRlcnZhbER1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUodW5kZWZpbmVkLCBpbnRlcnZhbER1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGR1ZSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aW1lci5qcy5tYXAiLCJpbXBvcnQgeyBhc3luY1NjaGVkdWxlciB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyB0aW1lciB9IGZyb20gJy4vdGltZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGludGVydmFsKHBlcmlvZCA9IDAsIHNjaGVkdWxlciA9IGFzeW5jU2NoZWR1bGVyKSB7XG4gICAgaWYgKHBlcmlvZCA8IDApIHtcbiAgICAgICAgcGVyaW9kID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRpbWVyKHBlcmlvZCwgcGVyaW9kLCBzY2hlZHVsZXIpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW50ZXJ2YWwuanMubWFwIiwiaW1wb3J0IHsgbWVyZ2VBbGwgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWVyZ2VBbGwnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi9pbm5lckZyb20nO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IHBvcE51bWJlciwgcG9wU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9hcmdzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKC4uLmFyZ3MpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSBwb3BTY2hlZHVsZXIoYXJncyk7XG4gICAgY29uc3QgY29uY3VycmVudCA9IHBvcE51bWJlcihhcmdzLCBJbmZpbml0eSk7XG4gICAgY29uc3Qgc291cmNlcyA9IGFyZ3M7XG4gICAgcmV0dXJuICFzb3VyY2VzLmxlbmd0aFxuICAgICAgICA/XG4gICAgICAgICAgICBFTVBUWVxuICAgICAgICA6IHNvdXJjZXMubGVuZ3RoID09PSAxXG4gICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgaW5uZXJGcm9tKHNvdXJjZXNbMF0pXG4gICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgbWVyZ2VBbGwoY29uY3VycmVudCkoZnJvbShzb3VyY2VzLCBzY2hlZHVsZXIpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lcmdlLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuZXhwb3J0IGNvbnN0IE5FVkVSID0gbmV3IE9ic2VydmFibGUobm9vcCk7XG5leHBvcnQgZnVuY3Rpb24gbmV2ZXIoKSB7XG4gICAgcmV0dXJuIE5FVkVSO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bmV2ZXIuanMubWFwIiwiY29uc3QgeyBpc0FycmF5IH0gPSBBcnJheTtcbmV4cG9ydCBmdW5jdGlvbiBhcmdzT3JBcmdBcnJheShhcmdzKSB7XG4gICAgcmV0dXJuIGFyZ3MubGVuZ3RoID09PSAxICYmIGlzQXJyYXkoYXJnc1swXSkgPyBhcmdzWzBdIDogYXJncztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFyZ3NPckFyZ0FycmF5LmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgYXJnc09yQXJnQXJyYXkgfSBmcm9tICcuLi91dGlsL2FyZ3NPckFyZ0FycmF5JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0KC4uLnNvdXJjZXMpIHtcbiAgICBjb25zdCBuZXh0U291cmNlcyA9IGFyZ3NPckFyZ0FycmF5KHNvdXJjZXMpO1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3QgcmVtYWluaW5nID0gW3NvdXJjZSwgLi4ubmV4dFNvdXJjZXNdO1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVOZXh0ID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgIGlmIChyZW1haW5pbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dFNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTb3VyY2UgPSBpbm5lckZyb20ocmVtYWluaW5nLnNoaWZ0KCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZU5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbm5lclN1YiA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgdW5kZWZpbmVkLCBub29wLCBub29wKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQobmV4dFNvdXJjZS5zdWJzY3JpYmUoaW5uZXJTdWIpKTtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJTdWIuYWRkKHN1YnNjcmliZU5leHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc3Vic2NyaWJlTmV4dCgpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b25FcnJvclJlc3VtZU5leHQuanMubWFwIiwiaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IG9uRXJyb3JSZXN1bWVOZXh0IGFzIG9uRXJyb3JSZXN1bWVOZXh0V2l0aCB9IGZyb20gJy4uL29wZXJhdG9ycy9vbkVycm9yUmVzdW1lTmV4dCc7XG5pbXBvcnQgeyBhcmdzT3JBcmdBcnJheSB9IGZyb20gJy4uL3V0aWwvYXJnc09yQXJnQXJyYXknO1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0KC4uLnNvdXJjZXMpIHtcbiAgICByZXR1cm4gb25FcnJvclJlc3VtZU5leHRXaXRoKGFyZ3NPckFyZ0FycmF5KHNvdXJjZXMpKShFTVBUWSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vbkVycm9yUmVzdW1lTmV4dC5qcy5tYXAiLCJpbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmV4cG9ydCBmdW5jdGlvbiBwYWlycyhvYmosIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBmcm9tKE9iamVjdC5lbnRyaWVzKG9iaiksIHNjaGVkdWxlcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYWlycy5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gbm90KHByZWQsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gKHZhbHVlLCBpbmRleCkgPT4gIXByZWQuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bm90LmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlcihwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHByZWRpY2F0ZS5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpbmRleCsrKSAmJiBzdWJzY3JpYmVyLm5leHQodmFsdWUpKSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXIuanMubWFwIiwiaW1wb3J0IHsgbm90IH0gZnJvbSAnLi4vdXRpbC9ub3QnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnLi4vb3BlcmF0b3JzL2ZpbHRlcic7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuL2lubmVyRnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gcGFydGl0aW9uKHNvdXJjZSwgcHJlZGljYXRlLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIFtmaWx0ZXIocHJlZGljYXRlLCB0aGlzQXJnKShpbm5lckZyb20oc291cmNlKSksIGZpbHRlcihub3QocHJlZGljYXRlLCB0aGlzQXJnKSkoaW5uZXJGcm9tKHNvdXJjZSkpXTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnRpdGlvbi5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBhcmdzT3JBcmdBcnJheSB9IGZyb20gJy4uL3V0aWwvYXJnc09yQXJnQXJyYXknO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi4vb3BlcmF0b3JzL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gcmFjZSguLi5zb3VyY2VzKSB7XG4gICAgc291cmNlcyA9IGFyZ3NPckFyZ0FycmF5KHNvdXJjZXMpO1xuICAgIHJldHVybiBzb3VyY2VzLmxlbmd0aCA9PT0gMSA/IGlubmVyRnJvbShzb3VyY2VzWzBdKSA6IG5ldyBPYnNlcnZhYmxlKHJhY2VJbml0KHNvdXJjZXMpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByYWNlSW5pdChzb3VyY2VzKSB7XG4gICAgcmV0dXJuIChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBzdWJzY3JpcHRpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBzdWJzY3JpcHRpb25zICYmICFzdWJzY3JpYmVyLmNsb3NlZCAmJiBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9ucy5wdXNoKGlubmVyRnJvbShzb3VyY2VzW2ldKS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaXB0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzID0gMDsgcyA8IHN1YnNjcmlwdGlvbnMubGVuZ3RoOyBzKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgIT09IGkgJiYgc3Vic2NyaXB0aW9uc1tzXS51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgfVxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yYWNlLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9lbXB0eSc7XG5leHBvcnQgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGNvdW50LCBzY2hlZHVsZXIpIHtcbiAgICBpZiAoY291bnQgPT0gbnVsbCkge1xuICAgICAgICBjb3VudCA9IHN0YXJ0O1xuICAgICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIGlmIChjb3VudCA8PSAwKSB7XG4gICAgICAgIHJldHVybiBFTVBUWTtcbiAgICB9XG4gICAgY29uc3QgZW5kID0gY291bnQgKyBzdGFydDtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc2NoZWR1bGVyXG4gICAgICAgID9cbiAgICAgICAgICAgIChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG4gPSBzdGFydDtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG4gPCBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChuKyspO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIDpcbiAgICAgICAgICAgIChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG4gPSBzdGFydDtcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA8IGVuZCAmJiAhc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KG4rKyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmFuZ2UuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi9pbm5lckZyb20nO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmV4cG9ydCBmdW5jdGlvbiB1c2luZyhyZXNvdXJjZUZhY3RvcnksIG9ic2VydmFibGVGYWN0b3J5KSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc291cmNlID0gcmVzb3VyY2VGYWN0b3J5KCk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG9ic2VydmFibGVGYWN0b3J5KHJlc291cmNlKTtcbiAgICAgICAgY29uc3Qgc291cmNlID0gcmVzdWx0ID8gaW5uZXJGcm9tKHJlc3VsdCkgOiBFTVBUWTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHJlc291cmNlLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD11c2luZy5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBhcmdzT3JBcmdBcnJheSB9IGZyb20gJy4uL3V0aWwvYXJnc09yQXJnQXJyYXknO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4uL29wZXJhdG9ycy9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgcG9wUmVzdWx0U2VsZWN0b3IgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuZXhwb3J0IGZ1bmN0aW9uIHppcCguLi5hcmdzKSB7XG4gICAgY29uc3QgcmVzdWx0U2VsZWN0b3IgPSBwb3BSZXN1bHRTZWxlY3RvcihhcmdzKTtcbiAgICBjb25zdCBzb3VyY2VzID0gYXJnc09yQXJnQXJyYXkoYXJncyk7XG4gICAgcmV0dXJuIHNvdXJjZXMubGVuZ3RoXG4gICAgICAgID8gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIGxldCBidWZmZXJzID0gc291cmNlcy5tYXAoKCkgPT4gW10pO1xuICAgICAgICAgICAgbGV0IGNvbXBsZXRlZCA9IHNvdXJjZXMubWFwKCgpID0+IGZhbHNlKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKCgpID0+IHtcbiAgICAgICAgICAgICAgICBidWZmZXJzID0gY29tcGxldGVkID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9yIChsZXQgc291cmNlSW5kZXggPSAwOyAhc3Vic2NyaWJlci5jbG9zZWQgJiYgc291cmNlSW5kZXggPCBzb3VyY2VzLmxlbmd0aDsgc291cmNlSW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlubmVyRnJvbShzb3VyY2VzW3NvdXJjZUluZGV4XSkuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcnNbc291cmNlSW5kZXhdLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnVmZmVycy5ldmVyeSgoYnVmZmVyKSA9PiBidWZmZXIubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYnVmZmVycy5tYXAoKGJ1ZmZlcikgPT4gYnVmZmVyLnNoaWZ0KCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHJlc3VsdFNlbGVjdG9yID8gcmVzdWx0U2VsZWN0b3IoLi4ucmVzdWx0KSA6IHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnVmZmVycy5zb21lKChidWZmZXIsIGkpID0+ICFidWZmZXIubGVuZ3RoICYmIGNvbXBsZXRlZFtpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZFtzb3VyY2VJbmRleF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAhYnVmZmVyc1tzb3VyY2VJbmRleF0ubGVuZ3RoICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGJ1ZmZlcnMgPSBjb21wbGV0ZWQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICAgOiBFTVBUWTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXppcC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBhdWRpdChkdXJhdGlvblNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IG51bGw7XG4gICAgICAgIGxldCBkdXJhdGlvblN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgICBsZXQgaXNDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBjb25zdCBlbmREdXJhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGR1cmF0aW9uU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBkdXJhdGlvblN1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGR1cmF0aW9uU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgZHVyYXRpb25TdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBsYXN0VmFsdWU7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNDb21wbGV0ZSAmJiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNsZWFudXBEdXJhdGlvbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGR1cmF0aW9uU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgICAgICBpc0NvbXBsZXRlICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaGFzVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICBpZiAoIWR1cmF0aW9uU3Vic2NyaWJlcikge1xuICAgICAgICAgICAgICAgIGlubmVyRnJvbShkdXJhdGlvblNlbGVjdG9yKHZhbHVlKSkuc3Vic2NyaWJlKChkdXJhdGlvblN1YnNjcmliZXIgPSBuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGVuZER1cmF0aW9uLCBjbGVhbnVwRHVyYXRpb24pKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgKCFoYXNWYWx1ZSB8fCAhZHVyYXRpb25TdWJzY3JpYmVyIHx8IGR1cmF0aW9uU3Vic2NyaWJlci5jbG9zZWQpICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXVkaXQuanMubWFwIiwiaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgYXVkaXQgfSBmcm9tICcuL2F1ZGl0JztcbmltcG9ydCB7IHRpbWVyIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS90aW1lcic7XG5leHBvcnQgZnVuY3Rpb24gYXVkaXRUaW1lKGR1cmF0aW9uLCBzY2hlZHVsZXIgPSBhc3luYykge1xuICAgIHJldHVybiBhdWRpdCgoKSA9PiB0aW1lcihkdXJhdGlvbiwgc2NoZWR1bGVyKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdWRpdFRpbWUuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBidWZmZXIoY2xvc2luZ05vdGlmaWVyKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgY3VycmVudEJ1ZmZlciA9IFtdO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiBjdXJyZW50QnVmZmVyLnB1c2godmFsdWUpLCAoKSA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoY3VycmVudEJ1ZmZlcik7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgY2xvc2luZ05vdGlmaWVyLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBjdXJyZW50QnVmZmVyO1xuICAgICAgICAgICAgY3VycmVudEJ1ZmZlciA9IFtdO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGIpO1xuICAgICAgICB9LCBub29wKSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1ZmZlci5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGFyclJlbW92ZSB9IGZyb20gJy4uL3V0aWwvYXJyUmVtb3ZlJztcbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJDb3VudChidWZmZXJTaXplLCBzdGFydEJ1ZmZlckV2ZXJ5ID0gbnVsbCkge1xuICAgIHN0YXJ0QnVmZmVyRXZlcnkgPSBzdGFydEJ1ZmZlckV2ZXJ5ICE9PSBudWxsICYmIHN0YXJ0QnVmZmVyRXZlcnkgIT09IHZvaWQgMCA/IHN0YXJ0QnVmZmVyRXZlcnkgOiBidWZmZXJTaXplO1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGJ1ZmZlcnMgPSBbXTtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHRvRW1pdCA9IG51bGw7XG4gICAgICAgICAgICBpZiAoY291bnQrKyAlIHN0YXJ0QnVmZmVyRXZlcnkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBidWZmZXJzLnB1c2goW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBidWZmZXIgb2YgYnVmZmVycykge1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoYnVmZmVyU2l6ZSA8PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvRW1pdCA9IHRvRW1pdCAhPT0gbnVsbCAmJiB0b0VtaXQgIT09IHZvaWQgMCA/IHRvRW1pdCA6IFtdO1xuICAgICAgICAgICAgICAgICAgICB0b0VtaXQucHVzaChidWZmZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0b0VtaXQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJ1ZmZlciBvZiB0b0VtaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyUmVtb3ZlKGJ1ZmZlcnMsIGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChidWZmZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBidWZmZXIgb2YgYnVmZmVycykge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChidWZmZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9LCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgIGJ1ZmZlcnMgPSBudWxsO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWZmZXJDb3VudC5qcy5tYXAiLCJpbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBhcnJSZW1vdmUgfSBmcm9tICcuLi91dGlsL2FyclJlbW92ZSc7XG5pbXBvcnQgeyBhc3luY1NjaGVkdWxlciB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBwb3BTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuaW1wb3J0IHsgZXhlY3V0ZVNjaGVkdWxlIH0gZnJvbSAnLi4vdXRpbC9leGVjdXRlU2NoZWR1bGUnO1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlclRpbWUoYnVmZmVyVGltZVNwYW4sIC4uLm90aGVyQXJncykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gKF9hID0gcG9wU2NoZWR1bGVyKG90aGVyQXJncykpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGFzeW5jU2NoZWR1bGVyO1xuICAgIGNvbnN0IGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwgPSAoX2IgPSBvdGhlckFyZ3NbMF0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG51bGw7XG4gICAgY29uc3QgbWF4QnVmZmVyU2l6ZSA9IG90aGVyQXJnc1sxXSB8fCBJbmZpbml0eTtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBidWZmZXJSZWNvcmRzID0gW107XG4gICAgICAgIGxldCByZXN0YXJ0T25FbWl0ID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGVtaXQgPSAocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGJ1ZmZlciwgc3VicyB9ID0gcmVjb3JkO1xuICAgICAgICAgICAgc3Vicy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgYXJyUmVtb3ZlKGJ1ZmZlclJlY29yZHMsIHJlY29yZCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoYnVmZmVyKTtcbiAgICAgICAgICAgIHJlc3RhcnRPbkVtaXQgJiYgc3RhcnRCdWZmZXIoKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3RhcnRCdWZmZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoYnVmZmVyUmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnMgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoc3Vicyk7XG4gICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICBidWZmZXIsXG4gICAgICAgICAgICAgICAgICAgIHN1YnMsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBidWZmZXJSZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICAgICAgICAgICAgICBleGVjdXRlU2NoZWR1bGUoc3Vicywgc2NoZWR1bGVyLCAoKSA9PiBlbWl0KHJlY29yZCksIGJ1ZmZlclRpbWVTcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwgIT09IG51bGwgJiYgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCA+PSAwKSB7XG4gICAgICAgICAgICBleGVjdXRlU2NoZWR1bGUoc3Vic2NyaWJlciwgc2NoZWR1bGVyLCBzdGFydEJ1ZmZlciwgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN0YXJ0T25FbWl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBzdGFydEJ1ZmZlcigpO1xuICAgICAgICBjb25zdCBidWZmZXJUaW1lU3Vic2NyaWJlciA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWNvcmRzQ29weSA9IGJ1ZmZlclJlY29yZHMuc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVjb3JkIG9mIHJlY29yZHNDb3B5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBidWZmZXIgfSA9IHJlY29yZDtcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbWF4QnVmZmVyU2l6ZSA8PSBidWZmZXIubGVuZ3RoICYmIGVtaXQocmVjb3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgd2hpbGUgKGJ1ZmZlclJlY29yZHMgPT09IG51bGwgfHwgYnVmZmVyUmVjb3JkcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogYnVmZmVyUmVjb3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoYnVmZmVyUmVjb3Jkcy5zaGlmdCgpLmJ1ZmZlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidWZmZXJUaW1lU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBidWZmZXJUaW1lU3Vic2NyaWJlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogYnVmZmVyVGltZVN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSwgdW5kZWZpbmVkLCAoKSA9PiAoYnVmZmVyUmVjb3JkcyA9IG51bGwpKTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShidWZmZXJUaW1lU3Vic2NyaWJlcik7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWZmZXJUaW1lLmpzLm1hcCIsImltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgYXJyUmVtb3ZlIH0gZnJvbSAnLi4vdXRpbC9hcnJSZW1vdmUnO1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlclRvZ2dsZShvcGVuaW5ncywgY2xvc2luZ1NlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25zdCBidWZmZXJzID0gW107XG4gICAgICAgIGlubmVyRnJvbShvcGVuaW5ncykuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKG9wZW5WYWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gW107XG4gICAgICAgICAgICBidWZmZXJzLnB1c2goYnVmZmVyKTtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NpbmdTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICBjb25zdCBlbWl0QnVmZmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFyclJlbW92ZShidWZmZXJzLCBidWZmZXIpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChidWZmZXIpO1xuICAgICAgICAgICAgICAgIGNsb3NpbmdTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjbG9zaW5nU3Vic2NyaXB0aW9uLmFkZChpbm5lckZyb20oY2xvc2luZ1NlbGVjdG9yKG9wZW5WYWx1ZSkpLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGVtaXRCdWZmZXIsIG5vb3ApKSk7XG4gICAgICAgIH0sIG5vb3ApKTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBidWZmZXIgb2YgYnVmZmVycykge1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgd2hpbGUgKGJ1ZmZlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChidWZmZXJzLnNoaWZ0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWZmZXJUb2dnbGUuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJXaGVuKGNsb3NpbmdTZWxlY3Rvcikge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG51bGw7XG4gICAgICAgIGxldCBjbG9zaW5nU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgIGNvbnN0IG9wZW5CdWZmZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBjbG9zaW5nU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBjbG9zaW5nU3Vic2NyaWJlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xvc2luZ1N1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBidWZmZXI7XG4gICAgICAgICAgICBidWZmZXIgPSBbXTtcbiAgICAgICAgICAgIGIgJiYgc3Vic2NyaWJlci5uZXh0KGIpO1xuICAgICAgICAgICAgaW5uZXJGcm9tKGNsb3NpbmdTZWxlY3RvcigpKS5zdWJzY3JpYmUoKGNsb3NpbmdTdWJzY3JpYmVyID0gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBvcGVuQnVmZmVyLCBub29wKSkpO1xuICAgICAgICB9O1xuICAgICAgICBvcGVuQnVmZmVyKCk7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IGJ1ZmZlciA9PT0gbnVsbCB8fCBidWZmZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGJ1ZmZlci5wdXNoKHZhbHVlKSwgKCkgPT4ge1xuICAgICAgICAgICAgYnVmZmVyICYmIHN1YnNjcmliZXIubmV4dChidWZmZXIpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9LCB1bmRlZmluZWQsICgpID0+IChidWZmZXIgPSBjbG9zaW5nU3Vic2NyaWJlciA9IG51bGwpKSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWZmZXJXaGVuLmpzLm1hcCIsImltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuZXhwb3J0IGZ1bmN0aW9uIGNhdGNoRXJyb3Ioc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBpbm5lclN1YiA9IG51bGw7XG4gICAgICAgIGxldCBzeW5jVW5zdWIgPSBmYWxzZTtcbiAgICAgICAgbGV0IGhhbmRsZWRSZXN1bHQ7XG4gICAgICAgIGlubmVyU3ViID0gc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVkUmVzdWx0ID0gaW5uZXJGcm9tKHNlbGVjdG9yKGVyciwgY2F0Y2hFcnJvcihzZWxlY3Rvcikoc291cmNlKSkpO1xuICAgICAgICAgICAgaWYgKGlubmVyU3ViKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJTdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICBpbm5lclN1YiA9IG51bGw7XG4gICAgICAgICAgICAgICAgaGFuZGxlZFJlc3VsdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzeW5jVW5zdWIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIGlmIChzeW5jVW5zdWIpIHtcbiAgICAgICAgICAgIGlubmVyU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICBpbm5lclN1YiA9IG51bGw7XG4gICAgICAgICAgICBoYW5kbGVkUmVzdWx0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2F0Y2hFcnJvci5qcy5tYXAiLCJpbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gc2NhbkludGVybmFscyhhY2N1bXVsYXRvciwgc2VlZCwgaGFzU2VlZCwgZW1pdE9uTmV4dCwgZW1pdEJlZm9yZUNvbXBsZXRlKSB7XG4gICAgcmV0dXJuIChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGhhc1N0YXRlID0gaGFzU2VlZDtcbiAgICAgICAgbGV0IHN0YXRlID0gc2VlZDtcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaSA9IGluZGV4Kys7XG4gICAgICAgICAgICBzdGF0ZSA9IGhhc1N0YXRlXG4gICAgICAgICAgICAgICAgP1xuICAgICAgICAgICAgICAgICAgICBhY2N1bXVsYXRvcihzdGF0ZSwgdmFsdWUsIGkpXG4gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAoKGhhc1N0YXRlID0gdHJ1ZSksIHZhbHVlKTtcbiAgICAgICAgICAgIGVtaXRPbk5leHQgJiYgc3Vic2NyaWJlci5uZXh0KHN0YXRlKTtcbiAgICAgICAgfSwgZW1pdEJlZm9yZUNvbXBsZXRlICYmXG4gICAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGhhc1N0YXRlICYmIHN1YnNjcmliZXIubmV4dChzdGF0ZSk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSkpKTtcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NhbkludGVybmFscy5qcy5tYXAiLCJpbXBvcnQgeyBzY2FuSW50ZXJuYWxzIH0gZnJvbSAnLi9zY2FuSW50ZXJuYWxzJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZShhY2N1bXVsYXRvciwgc2VlZCkge1xuICAgIHJldHVybiBvcGVyYXRlKHNjYW5JbnRlcm5hbHMoYWNjdW11bGF0b3IsIHNlZWQsIGFyZ3VtZW50cy5sZW5ndGggPj0gMiwgZmFsc2UsIHRydWUpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlZHVjZS5qcy5tYXAiLCJpbXBvcnQgeyByZWR1Y2UgfSBmcm9tICcuL3JlZHVjZSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmNvbnN0IGFyclJlZHVjZXIgPSAoYXJyLCB2YWx1ZSkgPT4gKGFyci5wdXNoKHZhbHVlKSwgYXJyKTtcbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5KCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgcmVkdWNlKGFyclJlZHVjZXIsIFtdKShzb3VyY2UpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRvQXJyYXkuanMubWFwIiwiaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmltcG9ydCB7IG1hcE9uZU9yTWFueUFyZ3MgfSBmcm9tICcuLi91dGlsL21hcE9uZU9yTWFueUFyZ3MnO1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJy4uL3V0aWwvcGlwZSc7XG5pbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJy4vbWVyZ2VNYXAnO1xuaW1wb3J0IHsgdG9BcnJheSB9IGZyb20gJy4vdG9BcnJheSc7XG5leHBvcnQgZnVuY3Rpb24gam9pbkFsbEludGVybmFscyhqb2luRm4sIHByb2plY3QpIHtcbiAgICByZXR1cm4gcGlwZSh0b0FycmF5KCksIG1lcmdlTWFwKChzb3VyY2VzKSA9PiBqb2luRm4oc291cmNlcykpLCBwcm9qZWN0ID8gbWFwT25lT3JNYW55QXJncyhwcm9qZWN0KSA6IGlkZW50aXR5KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWpvaW5BbGxJbnRlcm5hbHMuanMubWFwIiwiaW1wb3J0IHsgY29tYmluZUxhdGVzdCB9IGZyb20gJy4uL29ic2VydmFibGUvY29tYmluZUxhdGVzdCc7XG5pbXBvcnQgeyBqb2luQWxsSW50ZXJuYWxzIH0gZnJvbSAnLi9qb2luQWxsSW50ZXJuYWxzJztcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0QWxsKHByb2plY3QpIHtcbiAgICByZXR1cm4gam9pbkFsbEludGVybmFscyhjb21iaW5lTGF0ZXN0LCBwcm9qZWN0KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbWJpbmVMYXRlc3RBbGwuanMubWFwIiwiaW1wb3J0IHsgY29tYmluZUxhdGVzdEFsbCB9IGZyb20gJy4vY29tYmluZUxhdGVzdEFsbCc7XG5leHBvcnQgY29uc3QgY29tYmluZUFsbCA9IGNvbWJpbmVMYXRlc3RBbGw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21iaW5lQWxsLmpzLm1hcCIsImltcG9ydCB7IGNvbWJpbmVMYXRlc3RJbml0IH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9jb21iaW5lTGF0ZXN0JztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgYXJnc09yQXJnQXJyYXkgfSBmcm9tICcuLi91dGlsL2FyZ3NPckFyZ0FycmF5JztcbmltcG9ydCB7IG1hcE9uZU9yTWFueUFyZ3MgfSBmcm9tICcuLi91dGlsL21hcE9uZU9yTWFueUFyZ3MnO1xuaW1wb3J0IHsgcGlwZSB9IGZyb20gJy4uL3V0aWwvcGlwZSc7XG5pbXBvcnQgeyBwb3BSZXN1bHRTZWxlY3RvciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdCguLi5hcmdzKSB7XG4gICAgY29uc3QgcmVzdWx0U2VsZWN0b3IgPSBwb3BSZXN1bHRTZWxlY3RvcihhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3JcbiAgICAgICAgPyBwaXBlKGNvbWJpbmVMYXRlc3QoLi4uYXJncyksIG1hcE9uZU9yTWFueUFyZ3MocmVzdWx0U2VsZWN0b3IpKVxuICAgICAgICA6IG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICAgICAgY29tYmluZUxhdGVzdEluaXQoW3NvdXJjZSwgLi4uYXJnc09yQXJnQXJyYXkoYXJncyldKShzdWJzY3JpYmVyKTtcbiAgICAgICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21iaW5lTGF0ZXN0LmpzLm1hcCIsImltcG9ydCB7IGNvbWJpbmVMYXRlc3QgfSBmcm9tICcuL2NvbWJpbmVMYXRlc3QnO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3RXaXRoKC4uLm90aGVyU291cmNlcykge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KC4uLm90aGVyU291cmNlcyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21iaW5lTGF0ZXN0V2l0aC5qcy5tYXAiLCJpbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJy4vbWVyZ2VNYXAnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0TWFwKHByb2plY3QsIHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24ocmVzdWx0U2VsZWN0b3IpID8gbWVyZ2VNYXAocHJvamVjdCwgcmVzdWx0U2VsZWN0b3IsIDEpIDogbWVyZ2VNYXAocHJvamVjdCwgMSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25jYXRNYXAuanMubWFwIiwiaW1wb3J0IHsgY29uY2F0TWFwIH0gZnJvbSAnLi9jb25jYXRNYXAnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0TWFwVG8oaW5uZXJPYnNlcnZhYmxlLCByZXN1bHRTZWxlY3Rvcikge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKHJlc3VsdFNlbGVjdG9yKSA/IGNvbmNhdE1hcCgoKSA9PiBpbm5lck9ic2VydmFibGUsIHJlc3VsdFNlbGVjdG9yKSA6IGNvbmNhdE1hcCgoKSA9PiBpbm5lck9ic2VydmFibGUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uY2F0TWFwVG8uanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBjb25jYXRBbGwgfSBmcm9tICcuL2NvbmNhdEFsbCc7XG5pbXBvcnQgeyBwb3BTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvZnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0KC4uLmFyZ3MpIHtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSBwb3BTY2hlZHVsZXIoYXJncyk7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25jYXRBbGwoKShmcm9tKFtzb3VyY2UsIC4uLmFyZ3NdLCBzY2hlZHVsZXIpKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25jYXQuanMubWFwIiwiaW1wb3J0IHsgY29uY2F0IH0gZnJvbSAnLi9jb25jYXQnO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdFdpdGgoLi4ub3RoZXJTb3VyY2VzKSB7XG4gICAgcmV0dXJuIGNvbmNhdCguLi5vdGhlclNvdXJjZXMpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uY2F0V2l0aC5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5leHBvcnQgZnVuY3Rpb24gZnJvbVN1YnNjcmliYWJsZShzdWJzY3JpYmFibGUpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHN1YnNjcmliYWJsZS5zdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJvbVN1YnNjcmliYWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgZnJvbVN1YnNjcmliYWJsZSB9IGZyb20gJy4uL29ic2VydmFibGUvZnJvbVN1YnNjcmliYWJsZSc7XG5jb25zdCBERUZBVUxUX0NPTkZJRyA9IHtcbiAgICBjb25uZWN0b3I6ICgpID0+IG5ldyBTdWJqZWN0KCksXG59O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbm5lY3Qoc2VsZWN0b3IsIGNvbmZpZyA9IERFRkFVTFRfQ09ORklHKSB7XG4gICAgY29uc3QgeyBjb25uZWN0b3IgfSA9IGNvbmZpZztcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBjb25uZWN0b3IoKTtcbiAgICAgICAgZnJvbShzZWxlY3Rvcihmcm9tU3Vic2NyaWJhYmxlKHN1YmplY3QpKSkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICBzdWJzY3JpYmVyLmFkZChzb3VyY2Uuc3Vic2NyaWJlKHN1YmplY3QpKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbm5lY3QuanMubWFwIiwiaW1wb3J0IHsgcmVkdWNlIH0gZnJvbSAnLi9yZWR1Y2UnO1xuZXhwb3J0IGZ1bmN0aW9uIGNvdW50KHByZWRpY2F0ZSkge1xuICAgIHJldHVybiByZWR1Y2UoKHRvdGFsLCB2YWx1ZSwgaSkgPT4gKCFwcmVkaWNhdGUgfHwgcHJlZGljYXRlKHZhbHVlLCBpKSA/IHRvdGFsICsgMSA6IHRvdGFsKSwgMCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb3VudC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlKGR1cmF0aW9uU2VsZWN0b3IpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBoYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbGFzdFZhbHVlID0gbnVsbDtcbiAgICAgICAgbGV0IGR1cmF0aW9uU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgIGNvbnN0IGVtaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICBkdXJhdGlvblN1YnNjcmliZXIgPT09IG51bGwgfHwgZHVyYXRpb25TdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkdXJhdGlvblN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGR1cmF0aW9uU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBoYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gbGFzdFZhbHVlO1xuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgZHVyYXRpb25TdWJzY3JpYmVyID09PSBudWxsIHx8IGR1cmF0aW9uU3Vic2NyaWJlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZHVyYXRpb25TdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICBoYXNWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGR1cmF0aW9uU3Vic2NyaWJlciA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZW1pdCwgbm9vcCk7XG4gICAgICAgICAgICBpbm5lckZyb20oZHVyYXRpb25TZWxlY3Rvcih2YWx1ZSkpLnN1YnNjcmliZShkdXJhdGlvblN1YnNjcmliZXIpO1xuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBlbWl0KCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgbGFzdFZhbHVlID0gZHVyYXRpb25TdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVib3VuY2UuanMubWFwIiwiaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2VUaW1lKGR1ZVRpbWUsIHNjaGVkdWxlciA9IGFzeW5jU2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgYWN0aXZlVGFzayA9IG51bGw7XG4gICAgICAgIGxldCBsYXN0VmFsdWUgPSBudWxsO1xuICAgICAgICBsZXQgbGFzdFRpbWUgPSBudWxsO1xuICAgICAgICBjb25zdCBlbWl0ID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGFjdGl2ZVRhc2spIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVUYXNrLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgYWN0aXZlVGFzayA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBsYXN0VmFsdWU7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiBlbWl0V2hlbklkbGUoKSB7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRUaW1lID0gbGFzdFRpbWUgKyBkdWVUaW1lO1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gc2NoZWR1bGVyLm5vdygpO1xuICAgICAgICAgICAgaWYgKG5vdyA8IHRhcmdldFRpbWUpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVUYXNrID0gdGhpcy5zY2hlZHVsZSh1bmRlZmluZWQsIHRhcmdldFRpbWUgLSBub3cpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKGFjdGl2ZVRhc2spO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVtaXQoKTtcbiAgICAgICAgfVxuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGxhc3RUaW1lID0gc2NoZWR1bGVyLm5vdygpO1xuICAgICAgICAgICAgaWYgKCFhY3RpdmVUYXNrKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlVGFzayA9IHNjaGVkdWxlci5zY2hlZHVsZShlbWl0V2hlbklkbGUsIGR1ZVRpbWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKGFjdGl2ZVRhc2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBlbWl0KCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgbGFzdFZhbHVlID0gYWN0aXZlVGFzayA9IG51bGw7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlYm91bmNlVGltZS5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0SWZFbXB0eShkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBoYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBoYXNWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWhhc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlZmF1bHRJZkVtcHR5LmpzLm1hcCIsImltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiB0YWtlKGNvdW50KSB7XG4gICAgcmV0dXJuIGNvdW50IDw9IDBcbiAgICAgICAgP1xuICAgICAgICAgICAgKCkgPT4gRU1QVFlcbiAgICAgICAgOiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIGxldCBzZWVuID0gMDtcbiAgICAgICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoKytzZWVuIDw9IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA8PSBzZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZS5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuZXhwb3J0IGZ1bmN0aW9uIGlnbm9yZUVsZW1lbnRzKCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIG5vb3ApKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlnbm9yZUVsZW1lbnRzLmpzLm1hcCIsImltcG9ydCB7IG1hcCB9IGZyb20gJy4vbWFwJztcbmV4cG9ydCBmdW5jdGlvbiBtYXBUbyh2YWx1ZSkge1xuICAgIHJldHVybiBtYXAoKCkgPT4gdmFsdWUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwVG8uanMubWFwIiwiaW1wb3J0IHsgY29uY2F0IH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9jb25jYXQnO1xuaW1wb3J0IHsgdGFrZSB9IGZyb20gJy4vdGFrZSc7XG5pbXBvcnQgeyBpZ25vcmVFbGVtZW50cyB9IGZyb20gJy4vaWdub3JlRWxlbWVudHMnO1xuaW1wb3J0IHsgbWFwVG8gfSBmcm9tICcuL21hcFRvJztcbmltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAnLi9tZXJnZU1hcCc7XG5leHBvcnQgZnVuY3Rpb24gZGVsYXlXaGVuKGRlbGF5RHVyYXRpb25TZWxlY3Rvciwgc3Vic2NyaXB0aW9uRGVsYXkpIHtcbiAgICBpZiAoc3Vic2NyaXB0aW9uRGVsYXkpIHtcbiAgICAgICAgcmV0dXJuIChzb3VyY2UpID0+IGNvbmNhdChzdWJzY3JpcHRpb25EZWxheS5waXBlKHRha2UoMSksIGlnbm9yZUVsZW1lbnRzKCkpLCBzb3VyY2UucGlwZShkZWxheVdoZW4oZGVsYXlEdXJhdGlvblNlbGVjdG9yKSkpO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VNYXAoKHZhbHVlLCBpbmRleCkgPT4gZGVsYXlEdXJhdGlvblNlbGVjdG9yKHZhbHVlLCBpbmRleCkucGlwZSh0YWtlKDEpLCBtYXBUbyh2YWx1ZSkpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlbGF5V2hlbi5qcy5tYXAiLCJpbXBvcnQgeyBhc3luY1NjaGVkdWxlciB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBkZWxheVdoZW4gfSBmcm9tICcuL2RlbGF5V2hlbic7XG5pbXBvcnQgeyB0aW1lciB9IGZyb20gJy4uL29ic2VydmFibGUvdGltZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KGR1ZSwgc2NoZWR1bGVyID0gYXN5bmNTY2hlZHVsZXIpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRpbWVyKGR1ZSwgc2NoZWR1bGVyKTtcbiAgICByZXR1cm4gZGVsYXlXaGVuKCgpID0+IGR1cmF0aW9uKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlbGF5LmpzLm1hcCIsImltcG9ydCB7IG9ic2VydmVOb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb24nO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gZGVtYXRlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAobm90aWZpY2F0aW9uKSA9PiBvYnNlcnZlTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbiwgc3Vic2NyaWJlcikpKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlbWF0ZXJpYWxpemUuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdChrZXlTZWxlY3RvciwgZmx1c2hlcykge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3QgZGlzdGluY3RLZXlzID0gbmV3IFNldCgpO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlTZWxlY3RvciA/IGtleVNlbGVjdG9yKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgICAgICAgaWYgKCFkaXN0aW5jdEtleXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgICAgICBkaXN0aW5jdEtleXMuYWRkKGtleSk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICBmbHVzaGVzID09PSBudWxsIHx8IGZsdXNoZXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGZsdXNoZXMuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKCkgPT4gZGlzdGluY3RLZXlzLmNsZWFyKCksIG5vb3ApKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpc3RpbmN0LmpzLm1hcCIsImltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsQ2hhbmdlZChjb21wYXJhdG9yLCBrZXlTZWxlY3RvciA9IGlkZW50aXR5KSB7XG4gICAgY29tcGFyYXRvciA9IGNvbXBhcmF0b3IgIT09IG51bGwgJiYgY29tcGFyYXRvciAhPT0gdm9pZCAwID8gY29tcGFyYXRvciA6IGRlZmF1bHRDb21wYXJlO1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IHByZXZpb3VzS2V5O1xuICAgICAgICBsZXQgZmlyc3QgPSB0cnVlO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50S2V5ID0ga2V5U2VsZWN0b3IodmFsdWUpO1xuICAgICAgICAgICAgaWYgKGZpcnN0IHx8ICFjb21wYXJhdG9yKHByZXZpb3VzS2V5LCBjdXJyZW50S2V5KSkge1xuICAgICAgICAgICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNLZXkgPSBjdXJyZW50S2V5O1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlKGEsIGIpIHtcbiAgICByZXR1cm4gYSA9PT0gYjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpc3RpbmN0VW50aWxDaGFuZ2VkLmpzLm1hcCIsImltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAnLi9kaXN0aW5jdFVudGlsQ2hhbmdlZCc7XG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3RVbnRpbEtleUNoYW5nZWQoa2V5LCBjb21wYXJlKSB7XG4gICAgcmV0dXJuIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiBjb21wYXJlID8gY29tcGFyZSh4W2tleV0sIHlba2V5XSkgOiB4W2tleV0gPT09IHlba2V5XSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaXN0aW5jdFVudGlsS2V5Q2hhbmdlZC5qcy5tYXAiLCJpbXBvcnQgeyBFbXB0eUVycm9yIH0gZnJvbSAnLi4vdXRpbC9FbXB0eUVycm9yJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93SWZFbXB0eShlcnJvckZhY3RvcnkgPSBkZWZhdWx0RXJyb3JGYWN0b3J5KSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaGFzVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgfSwgKCkgPT4gKGhhc1ZhbHVlID8gc3Vic2NyaWJlci5jb21wbGV0ZSgpIDogc3Vic2NyaWJlci5lcnJvcihlcnJvckZhY3RvcnkoKSkpKSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBkZWZhdWx0RXJyb3JGYWN0b3J5KCkge1xuICAgIHJldHVybiBuZXcgRW1wdHlFcnJvcigpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGhyb3dJZkVtcHR5LmpzLm1hcCIsImltcG9ydCB7IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yIH0gZnJvbSAnLi4vdXRpbC9Bcmd1bWVudE91dE9mUmFuZ2VFcnJvcic7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuL2ZpbHRlcic7XG5pbXBvcnQgeyB0aHJvd0lmRW1wdHkgfSBmcm9tICcuL3Rocm93SWZFbXB0eSc7XG5pbXBvcnQgeyBkZWZhdWx0SWZFbXB0eSB9IGZyb20gJy4vZGVmYXVsdElmRW1wdHknO1xuaW1wb3J0IHsgdGFrZSB9IGZyb20gJy4vdGFrZSc7XG5leHBvcnQgZnVuY3Rpb24gZWxlbWVudEF0KGluZGV4LCBkZWZhdWx0VmFsdWUpIHtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgIHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvcigpO1xuICAgIH1cbiAgICBjb25zdCBoYXNEZWZhdWx0VmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID49IDI7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IHNvdXJjZS5waXBlKGZpbHRlcigodiwgaSkgPT4gaSA9PT0gaW5kZXgpLCB0YWtlKDEpLCBoYXNEZWZhdWx0VmFsdWUgPyBkZWZhdWx0SWZFbXB0eShkZWZhdWx0VmFsdWUpIDogdGhyb3dJZkVtcHR5KCgpID0+IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvcigpKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lbGVtZW50QXQuanMubWFwIiwiaW1wb3J0IHsgY29uY2F0IH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9jb25jYXQnO1xuaW1wb3J0IHsgb2YgfSBmcm9tICcuLi9vYnNlcnZhYmxlL29mJztcbmV4cG9ydCBmdW5jdGlvbiBlbmRXaXRoKC4uLnZhbHVlcykge1xuICAgIHJldHVybiAoc291cmNlKSA9PiBjb25jYXQoc291cmNlLCBvZiguLi52YWx1ZXMpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVuZFdpdGguanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gZXZlcnkocHJlZGljYXRlLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXByZWRpY2F0ZS5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpbmRleCsrLCBzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGZhbHNlKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh0cnVlKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXZlcnkuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gZXhoYXVzdEFsbCgpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBpc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGxldCBpbm5lclN1YiA9IG51bGw7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAoaW5uZXIpID0+IHtcbiAgICAgICAgICAgIGlmICghaW5uZXJTdWIpIHtcbiAgICAgICAgICAgICAgICBpbm5lclN1YiA9IGlubmVyRnJvbShpbm5lcikuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZSAmJiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBpc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICFpbm5lclN1YiAmJiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4aGF1c3RBbGwuanMubWFwIiwiaW1wb3J0IHsgZXhoYXVzdEFsbCB9IGZyb20gJy4vZXhoYXVzdEFsbCc7XG5leHBvcnQgY29uc3QgZXhoYXVzdCA9IGV4aGF1c3RBbGw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1leGhhdXN0LmpzLm1hcCIsImltcG9ydCB7IG1hcCB9IGZyb20gJy4vbWFwJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGV4aGF1c3RNYXAocHJvamVjdCwgcmVzdWx0U2VsZWN0b3IpIHtcbiAgICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIChzb3VyY2UpID0+IHNvdXJjZS5waXBlKGV4aGF1c3RNYXAoKGEsIGkpID0+IGlubmVyRnJvbShwcm9qZWN0KGEsIGkpKS5waXBlKG1hcCgoYiwgaWkpID0+IHJlc3VsdFNlbGVjdG9yKGEsIGIsIGksIGlpKSkpKSk7XG4gICAgfVxuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgbGV0IGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgbGV0IGlzQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIChvdXRlclZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlubmVyU3ViKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJTdWIgPSBuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbm5lclN1YiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGUgJiYgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlubmVyRnJvbShwcm9qZWN0KG91dGVyVmFsdWUsIGluZGV4KyspKS5zdWJzY3JpYmUoaW5uZXJTdWIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBpc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICFpbm5lclN1YiAmJiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4aGF1c3RNYXAuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBtZXJnZUludGVybmFscyB9IGZyb20gJy4vbWVyZ2VJbnRlcm5hbHMnO1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZChwcm9qZWN0LCBjb25jdXJyZW50ID0gSW5maW5pdHksIHNjaGVkdWxlcikge1xuICAgIGNvbmN1cnJlbnQgPSAoY29uY3VycmVudCB8fCAwKSA8IDEgPyBJbmZpbml0eSA6IGNvbmN1cnJlbnQ7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4gbWVyZ2VJbnRlcm5hbHMoc291cmNlLCBzdWJzY3JpYmVyLCBwcm9qZWN0LCBjb25jdXJyZW50LCB1bmRlZmluZWQsIHRydWUsIHNjaGVkdWxlcikpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhwYW5kLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmFsaXplKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmluYWxpemUuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gZmluZChwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gb3BlcmF0ZShjcmVhdGVGaW5kKHByZWRpY2F0ZSwgdGhpc0FyZywgJ3ZhbHVlJykpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZpbmQocHJlZGljYXRlLCB0aGlzQXJnLCBlbWl0KSB7XG4gICAgY29uc3QgZmluZEluZGV4ID0gZW1pdCA9PT0gJ2luZGV4JztcbiAgICByZXR1cm4gKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpID0gaW5kZXgrKztcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaSwgc291cmNlKSkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChmaW5kSW5kZXggPyBpIDogdmFsdWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGZpbmRJbmRleCA/IC0xIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maW5kLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgY3JlYXRlRmluZCB9IGZyb20gJy4vZmluZCc7XG5leHBvcnQgZnVuY3Rpb24gZmluZEluZGV4KHByZWRpY2F0ZSwgdGhpc0FyZykge1xuICAgIHJldHVybiBvcGVyYXRlKGNyZWF0ZUZpbmQocHJlZGljYXRlLCB0aGlzQXJnLCAnaW5kZXgnKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maW5kSW5kZXguanMubWFwIiwiaW1wb3J0IHsgRW1wdHlFcnJvciB9IGZyb20gJy4uL3V0aWwvRW1wdHlFcnJvcic7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuL2ZpbHRlcic7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAnLi90YWtlJztcbmltcG9ydCB7IGRlZmF1bHRJZkVtcHR5IH0gZnJvbSAnLi9kZWZhdWx0SWZFbXB0eSc7XG5pbXBvcnQgeyB0aHJvd0lmRW1wdHkgfSBmcm9tICcuL3Rocm93SWZFbXB0eSc7XG5pbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJy4uL3V0aWwvaWRlbnRpdHknO1xuZXhwb3J0IGZ1bmN0aW9uIGZpcnN0KHByZWRpY2F0ZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgY29uc3QgaGFzRGVmYXVsdFZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA+PSAyO1xuICAgIHJldHVybiAoc291cmNlKSA9PiBzb3VyY2UucGlwZShwcmVkaWNhdGUgPyBmaWx0ZXIoKHYsIGkpID0+IHByZWRpY2F0ZSh2LCBpLCBzb3VyY2UpKSA6IGlkZW50aXR5LCB0YWtlKDEpLCBoYXNEZWZhdWx0VmFsdWUgPyBkZWZhdWx0SWZFbXB0eShkZWZhdWx0VmFsdWUpIDogdGhyb3dJZkVtcHR5KCgpID0+IG5ldyBFbXB0eUVycm9yKCkpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpcnN0LmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwQnkoa2V5U2VsZWN0b3IsIGVsZW1lbnRPck9wdGlvbnMsIGR1cmF0aW9uLCBjb25uZWN0b3IpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBlbGVtZW50O1xuICAgICAgICBpZiAoIWVsZW1lbnRPck9wdGlvbnMgfHwgdHlwZW9mIGVsZW1lbnRPck9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50T3JPcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKHsgZHVyYXRpb24sIGVsZW1lbnQsIGNvbm5lY3RvciB9ID0gZWxlbWVudE9yT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZ3JvdXBzID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBub3RpZnkgPSAoY2IpID0+IHtcbiAgICAgICAgICAgIGdyb3Vwcy5mb3JFYWNoKGNiKTtcbiAgICAgICAgICAgIGNiKHN1YnNjcmliZXIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBoYW5kbGVFcnJvciA9IChlcnIpID0+IG5vdGlmeSgoY29uc3VtZXIpID0+IGNvbnN1bWVyLmVycm9yKGVycikpO1xuICAgICAgICBjb25zdCBncm91cEJ5U291cmNlU3Vic2NyaWJlciA9IG5ldyBHcm91cEJ5U3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0ga2V5U2VsZWN0b3IodmFsdWUpO1xuICAgICAgICAgICAgICAgIGxldCBncm91cCA9IGdyb3Vwcy5nZXQoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoIWdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3Vwcy5zZXQoa2V5LCAoZ3JvdXAgPSBjb25uZWN0b3IgPyBjb25uZWN0b3IoKSA6IG5ldyBTdWJqZWN0KCkpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBlZCA9IGNyZWF0ZUdyb3VwZWRPYnNlcnZhYmxlKGtleSwgZ3JvdXApO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoZ3JvdXBlZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZHVyYXRpb25TdWJzY3JpYmVyID0gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihncm91cCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25TdWJzY3JpYmVyID09PSBudWxsIHx8IGR1cmF0aW9uU3Vic2NyaWJlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZHVyYXRpb25TdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgKCkgPT4gZ3JvdXBzLmRlbGV0ZShrZXkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnlTb3VyY2VTdWJzY3JpYmVyLmFkZChpbm5lckZyb20oZHVyYXRpb24oZ3JvdXBlZCkpLnN1YnNjcmliZShkdXJhdGlvblN1YnNjcmliZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBncm91cC5uZXh0KGVsZW1lbnQgPyBlbGVtZW50KHZhbHVlKSA6IHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiBub3RpZnkoKGNvbnN1bWVyKSA9PiBjb25zdW1lci5jb21wbGV0ZSgpKSwgaGFuZGxlRXJyb3IsICgpID0+IGdyb3Vwcy5jbGVhcigpKTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShncm91cEJ5U291cmNlU3Vic2NyaWJlcik7XG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUdyb3VwZWRPYnNlcnZhYmxlKGtleSwgZ3JvdXBTdWJqZWN0KSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgT2JzZXJ2YWJsZSgoZ3JvdXBTdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgZ3JvdXBCeVNvdXJjZVN1YnNjcmliZXIuYWN0aXZlR3JvdXBzKys7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5uZXJTdWIgPSBncm91cFN1YmplY3Quc3Vic2NyaWJlKGdyb3VwU3Vic2NyaWJlcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJTdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICAgICAgLS1ncm91cEJ5U291cmNlU3Vic2NyaWJlci5hY3RpdmVHcm91cHMgPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnlTb3VyY2VTdWJzY3JpYmVyLnRlYXJkb3duQXR0ZW1wdGVkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cEJ5U291cmNlU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc3VsdC5rZXkgPSBrZXk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfSk7XG59XG5jbGFzcyBHcm91cEJ5U3Vic2NyaWJlciBleHRlbmRzIE9wZXJhdG9yU3Vic2NyaWJlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuYWN0aXZlR3JvdXBzID0gMDtcbiAgICAgICAgdGhpcy50ZWFyZG93bkF0dGVtcHRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB1bnN1YnNjcmliZSgpIHtcbiAgICAgICAgdGhpcy50ZWFyZG93bkF0dGVtcHRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYWN0aXZlR3JvdXBzID09PSAwICYmIHN1cGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3JvdXBCeS5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChmYWxzZSk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh0cnVlKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNFbXB0eS5qcy5tYXAiLCJpbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4uL29ic2VydmFibGUvZW1wdHknO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gdGFrZUxhc3QoY291bnQpIHtcbiAgICByZXR1cm4gY291bnQgPD0gMFxuICAgICAgICA/ICgpID0+IEVNUFRZXG4gICAgICAgIDogb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gW107XG4gICAgICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIGNvdW50IDwgYnVmZmVyLmxlbmd0aCAmJiBidWZmZXIuc2hpZnQoKTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIGJ1ZmZlcikge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9LCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBidWZmZXIgPSBudWxsO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2VMYXN0LmpzLm1hcCIsImltcG9ydCB7IEVtcHR5RXJyb3IgfSBmcm9tICcuLi91dGlsL0VtcHR5RXJyb3InO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnLi9maWx0ZXInO1xuaW1wb3J0IHsgdGFrZUxhc3QgfSBmcm9tICcuL3Rha2VMYXN0JztcbmltcG9ydCB7IHRocm93SWZFbXB0eSB9IGZyb20gJy4vdGhyb3dJZkVtcHR5JztcbmltcG9ydCB7IGRlZmF1bHRJZkVtcHR5IH0gZnJvbSAnLi9kZWZhdWx0SWZFbXB0eSc7XG5pbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJy4uL3V0aWwvaWRlbnRpdHknO1xuZXhwb3J0IGZ1bmN0aW9uIGxhc3QocHJlZGljYXRlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICBjb25zdCBoYXNEZWZhdWx0VmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID49IDI7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IHNvdXJjZS5waXBlKHByZWRpY2F0ZSA/IGZpbHRlcigodiwgaSkgPT4gcHJlZGljYXRlKHYsIGksIHNvdXJjZSkpIDogaWRlbnRpdHksIHRha2VMYXN0KDEpLCBoYXNEZWZhdWx0VmFsdWUgPyBkZWZhdWx0SWZFbXB0eShkZWZhdWx0VmFsdWUpIDogdGhyb3dJZkVtcHR5KCgpID0+IG5ldyBFbXB0eUVycm9yKCkpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxhc3QuanMubWFwIiwiaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vTm90aWZpY2F0aW9uJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIG1hdGVyaWFsaXplKCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KE5vdGlmaWNhdGlvbi5jcmVhdGVOZXh0KHZhbHVlKSk7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyKSk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hdGVyaWFsaXplLmpzLm1hcCIsImltcG9ydCB7IHJlZHVjZSB9IGZyb20gJy4vcmVkdWNlJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIG1heChjb21wYXJlcikge1xuICAgIHJldHVybiByZWR1Y2UoaXNGdW5jdGlvbihjb21wYXJlcikgPyAoeCwgeSkgPT4gKGNvbXBhcmVyKHgsIHkpID4gMCA/IHggOiB5KSA6ICh4LCB5KSA9PiAoeCA+IHkgPyB4IDogeSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWF4LmpzLm1hcCIsImltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAnLi9tZXJnZU1hcCc7XG5leHBvcnQgY29uc3QgZmxhdE1hcCA9IG1lcmdlTWFwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmxhdE1hcC5qcy5tYXAiLCJpbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJy4vbWVyZ2VNYXAnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VNYXBUbyhpbm5lck9ic2VydmFibGUsIHJlc3VsdFNlbGVjdG9yLCBjb25jdXJyZW50ID0gSW5maW5pdHkpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihyZXN1bHRTZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIG1lcmdlTWFwKCgpID0+IGlubmVyT2JzZXJ2YWJsZSwgcmVzdWx0U2VsZWN0b3IsIGNvbmN1cnJlbnQpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHJlc3VsdFNlbGVjdG9yID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb25jdXJyZW50ID0gcmVzdWx0U2VsZWN0b3I7XG4gICAgfVxuICAgIHJldHVybiBtZXJnZU1hcCgoKSA9PiBpbm5lck9ic2VydmFibGUsIGNvbmN1cnJlbnQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVyZ2VNYXBUby5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IG1lcmdlSW50ZXJuYWxzIH0gZnJvbSAnLi9tZXJnZUludGVybmFscyc7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VTY2FuKGFjY3VtdWxhdG9yLCBzZWVkLCBjb25jdXJyZW50ID0gSW5maW5pdHkpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBzdGF0ZSA9IHNlZWQ7XG4gICAgICAgIHJldHVybiBtZXJnZUludGVybmFscyhzb3VyY2UsIHN1YnNjcmliZXIsICh2YWx1ZSwgaW5kZXgpID0+IGFjY3VtdWxhdG9yKHN0YXRlLCB2YWx1ZSwgaW5kZXgpLCBjb25jdXJyZW50LCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHN0YXRlID0gdmFsdWU7XG4gICAgICAgIH0sIGZhbHNlLCB1bmRlZmluZWQsICgpID0+IChzdGF0ZSA9IG51bGwpKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lcmdlU2Nhbi5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IGFyZ3NPckFyZ0FycmF5IH0gZnJvbSAnLi4vdXRpbC9hcmdzT3JBcmdBcnJheSc7XG5pbXBvcnQgeyBtZXJnZUFsbCB9IGZyb20gJy4vbWVyZ2VBbGwnO1xuaW1wb3J0IHsgcG9wTnVtYmVyLCBwb3BTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvZnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2UoLi4uYXJncykge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHBvcFNjaGVkdWxlcihhcmdzKTtcbiAgICBjb25zdCBjb25jdXJyZW50ID0gcG9wTnVtYmVyKGFyZ3MsIEluZmluaXR5KTtcbiAgICBhcmdzID0gYXJnc09yQXJnQXJyYXkoYXJncyk7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBtZXJnZUFsbChjb25jdXJyZW50KShmcm9tKFtzb3VyY2UsIC4uLmFyZ3NdLCBzY2hlZHVsZXIpKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZXJnZS5qcy5tYXAiLCJpbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4vbWVyZ2UnO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlV2l0aCguLi5vdGhlclNvdXJjZXMpIHtcbiAgICByZXR1cm4gbWVyZ2UoLi4ub3RoZXJTb3VyY2VzKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lcmdlV2l0aC5qcy5tYXAiLCJpbXBvcnQgeyByZWR1Y2UgfSBmcm9tICcuL3JlZHVjZSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBtaW4oY29tcGFyZXIpIHtcbiAgICByZXR1cm4gcmVkdWNlKGlzRnVuY3Rpb24oY29tcGFyZXIpID8gKHgsIHkpID0+IChjb21wYXJlcih4LCB5KSA8IDAgPyB4IDogeSkgOiAoeCwgeSkgPT4gKHggPCB5ID8geCA6IHkpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1pbi5qcy5tYXAiLCJpbXBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi9vYnNlcnZhYmxlL0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICcuL2Nvbm5lY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIG11bHRpY2FzdChzdWJqZWN0T3JTdWJqZWN0RmFjdG9yeSwgc2VsZWN0b3IpIHtcbiAgICBjb25zdCBzdWJqZWN0RmFjdG9yeSA9IGlzRnVuY3Rpb24oc3ViamVjdE9yU3ViamVjdEZhY3RvcnkpID8gc3ViamVjdE9yU3ViamVjdEZhY3RvcnkgOiAoKSA9PiBzdWJqZWN0T3JTdWJqZWN0RmFjdG9yeTtcbiAgICBpZiAoaXNGdW5jdGlvbihzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIGNvbm5lY3Qoc2VsZWN0b3IsIHtcbiAgICAgICAgICAgIGNvbm5lY3Rvcjogc3ViamVjdEZhY3RvcnksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gKHNvdXJjZSkgPT4gbmV3IENvbm5lY3RhYmxlT2JzZXJ2YWJsZShzb3VyY2UsIHN1YmplY3RGYWN0b3J5KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW11bHRpY2FzdC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBwYWlyd2lzZSgpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBwcmV2O1xuICAgICAgICBsZXQgaGFzUHJldiA9IGZhbHNlO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwID0gcHJldjtcbiAgICAgICAgICAgIHByZXYgPSB2YWx1ZTtcbiAgICAgICAgICAgIGhhc1ByZXYgJiYgc3Vic2NyaWJlci5uZXh0KFtwLCB2YWx1ZV0pO1xuICAgICAgICAgICAgaGFzUHJldiA9IHRydWU7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhaXJ3aXNlLmpzLm1hcCIsImltcG9ydCB7IG1hcCB9IGZyb20gJy4vbWFwJztcbmV4cG9ydCBmdW5jdGlvbiBwbHVjayguLi5wcm9wZXJ0aWVzKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gcHJvcGVydGllcy5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2xpc3Qgb2YgcHJvcGVydGllcyBjYW5ub3QgYmUgZW1wdHkuJyk7XG4gICAgfVxuICAgIHJldHVybiBtYXAoKHgpID0+IHtcbiAgICAgICAgbGV0IGN1cnJlbnRQcm9wID0geDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcCA9IGN1cnJlbnRQcm9wID09PSBudWxsIHx8IGN1cnJlbnRQcm9wID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJyZW50UHJvcFtwcm9wZXJ0aWVzW2ldXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UHJvcCA9IHA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJyZW50UHJvcDtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBsdWNrLmpzLm1hcCIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IG11bHRpY2FzdCB9IGZyb20gJy4vbXVsdGljYXN0JztcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICcuL2Nvbm5lY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIHB1Ymxpc2goc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gc2VsZWN0b3IgPyAoc291cmNlKSA9PiBjb25uZWN0KHNlbGVjdG9yKShzb3VyY2UpIDogKHNvdXJjZSkgPT4gbXVsdGljYXN0KG5ldyBTdWJqZWN0KCkpKHNvdXJjZSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wdWJsaXNoLmpzLm1hcCIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJy4uL0JlaGF2aW9yU3ViamVjdCc7XG5pbXBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi9vYnNlcnZhYmxlL0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSc7XG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaEJlaGF2aW9yKGluaXRpYWxWYWx1ZSkge1xuICAgIHJldHVybiAoc291cmNlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGluaXRpYWxWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgQ29ubmVjdGFibGVPYnNlcnZhYmxlKHNvdXJjZSwgKCkgPT4gc3ViamVjdCk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXB1Ymxpc2hCZWhhdmlvci5qcy5tYXAiLCJpbXBvcnQgeyBBc3luY1N1YmplY3QgfSBmcm9tICcuLi9Bc3luY1N1YmplY3QnO1xuaW1wb3J0IHsgQ29ubmVjdGFibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9Db25uZWN0YWJsZU9ic2VydmFibGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHB1Ymxpc2hMYXN0KCkge1xuICAgIHJldHVybiAoc291cmNlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0KCk7XG4gICAgICAgIHJldHVybiBuZXcgQ29ubmVjdGFibGVPYnNlcnZhYmxlKHNvdXJjZSwgKCkgPT4gc3ViamVjdCk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXB1Ymxpc2hMYXN0LmpzLm1hcCIsImltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICcuLi9SZXBsYXlTdWJqZWN0JztcbmltcG9ydCB7IG11bHRpY2FzdCB9IGZyb20gJy4vbXVsdGljYXN0JztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIHB1Ymxpc2hSZXBsYXkoYnVmZmVyU2l6ZSwgd2luZG93VGltZSwgc2VsZWN0b3JPclNjaGVkdWxlciwgdGltZXN0YW1wUHJvdmlkZXIpIHtcbiAgICBpZiAoc2VsZWN0b3JPclNjaGVkdWxlciAmJiAhaXNGdW5jdGlvbihzZWxlY3Rvck9yU2NoZWR1bGVyKSkge1xuICAgICAgICB0aW1lc3RhbXBQcm92aWRlciA9IHNlbGVjdG9yT3JTY2hlZHVsZXI7XG4gICAgfVxuICAgIGNvbnN0IHNlbGVjdG9yID0gaXNGdW5jdGlvbihzZWxlY3Rvck9yU2NoZWR1bGVyKSA/IHNlbGVjdG9yT3JTY2hlZHVsZXIgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IG11bHRpY2FzdChuZXcgUmVwbGF5U3ViamVjdChidWZmZXJTaXplLCB3aW5kb3dUaW1lLCB0aW1lc3RhbXBQcm92aWRlciksIHNlbGVjdG9yKShzb3VyY2UpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHVibGlzaFJlcGxheS5qcy5tYXAiLCJpbXBvcnQgeyByYWNlSW5pdCB9IGZyb20gJy4uL29ic2VydmFibGUvcmFjZSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5leHBvcnQgZnVuY3Rpb24gcmFjZVdpdGgoLi4ub3RoZXJTb3VyY2VzKSB7XG4gICAgcmV0dXJuICFvdGhlclNvdXJjZXMubGVuZ3RoXG4gICAgICAgID8gaWRlbnRpdHlcbiAgICAgICAgOiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIHJhY2VJbml0KFtzb3VyY2UsIC4uLm90aGVyU291cmNlc10pKHN1YnNjcmliZXIpO1xuICAgICAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJhY2VXaXRoLmpzLm1hcCIsImltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiByZXBlYXQoY291bnQgPSBJbmZpbml0eSkge1xuICAgIHJldHVybiBjb3VudCA8PSAwXG4gICAgICAgID8gKCkgPT4gRU1QVFlcbiAgICAgICAgOiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIGxldCBzb0ZhciA9IDA7XG4gICAgICAgICAgICBsZXQgaW5uZXJTdWI7XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVGb3JSZXBlYXQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN5bmNVbnN1YiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlubmVyU3ViID0gc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKytzb0ZhciA8IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5uZXJTdWIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVGb3JSZXBlYXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5bmNVbnN1YiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgaWYgKHN5bmNVbnN1Yikge1xuICAgICAgICAgICAgICAgICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICBpbm5lclN1YiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZUZvclJlcGVhdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdWJzY3JpYmVGb3JSZXBlYXQoKTtcbiAgICAgICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXBlYXQuanMubWFwIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gcmVwZWF0V2hlbihub3RpZmllcikge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGlubmVyU3ViO1xuICAgICAgICBsZXQgc3luY1Jlc3ViID0gZmFsc2U7XG4gICAgICAgIGxldCBjb21wbGV0aW9ucyQ7XG4gICAgICAgIGxldCBpc05vdGlmaWVyQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgbGV0IGlzTWFpbkNvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGNoZWNrQ29tcGxldGUgPSAoKSA9PiBpc01haW5Db21wbGV0ZSAmJiBpc05vdGlmaWVyQ29tcGxldGUgJiYgKHN1YnNjcmliZXIuY29tcGxldGUoKSwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGdldENvbXBsZXRpb25TdWJqZWN0ID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFjb21wbGV0aW9ucyQpIHtcbiAgICAgICAgICAgICAgICBjb21wbGV0aW9ucyQgPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICAgICAgICAgIG5vdGlmaWVyKGNvbXBsZXRpb25zJCkuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5uZXJTdWIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZUZvclJlcGVhdFdoZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bmNSZXN1YiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlzTm90aWZpZXJDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29tcGxldGlvbnMkO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVGb3JSZXBlYXRXaGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgaXNNYWluQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlubmVyU3ViID0gc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlzTWFpbkNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAhY2hlY2tDb21wbGV0ZSgpICYmIGdldENvbXBsZXRpb25TdWJqZWN0KCkubmV4dCgpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgaWYgKHN5bmNSZXN1Yikge1xuICAgICAgICAgICAgICAgIGlubmVyU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgaW5uZXJTdWIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHN5bmNSZXN1YiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZUZvclJlcGVhdFdoZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc3Vic2NyaWJlRm9yUmVwZWF0V2hlbigpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVwZWF0V2hlbi5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyB0aW1lciB9IGZyb20gJy4uL29ic2VydmFibGUvdGltZXInO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIHJldHJ5KGNvbmZpZ09yQ291bnQgPSBJbmZpbml0eSkge1xuICAgIGxldCBjb25maWc7XG4gICAgaWYgKGNvbmZpZ09yQ291bnQgJiYgdHlwZW9mIGNvbmZpZ09yQ291bnQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZ09yQ291bnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25maWcgPSB7XG4gICAgICAgICAgICBjb3VudDogY29uZmlnT3JDb3VudCxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgeyBjb3VudCA9IEluZmluaXR5LCBkZWxheSwgcmVzZXRPblN1Y2Nlc3M6IHJlc2V0T25TdWNjZXNzID0gZmFsc2UgfSA9IGNvbmZpZztcbiAgICByZXR1cm4gY291bnQgPD0gMFxuICAgICAgICA/IGlkZW50aXR5XG4gICAgICAgIDogb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgICAgICBsZXQgc29GYXIgPSAwO1xuICAgICAgICAgICAgbGV0IGlubmVyU3ViO1xuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaWJlRm9yUmV0cnkgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHN5bmNVbnN1YiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlubmVyU3ViID0gc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzZXRPblN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvRmFyID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0sIHVuZGVmaW5lZCwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc29GYXIrKyA8IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1YiA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5uZXJTdWIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJTdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJTdWIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVGb3JSZXRyeSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3luY1Vuc3ViID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlbGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub3RpZmllciA9IHR5cGVvZiBkZWxheSA9PT0gJ251bWJlcicgPyB0aW1lcihkZWxheSkgOiBpbm5lckZyb20oZGVsYXkoZXJyLCBzb0ZhcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdGlmaWVyU3Vic2NyaWJlciA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RpZmllclN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RpZmllci5zdWJzY3JpYmUobm90aWZpZXJTdWJzY3JpYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3ViKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgaWYgKHN5bmNVbnN1Yikge1xuICAgICAgICAgICAgICAgICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICBpbm5lclN1YiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZUZvclJldHJ5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHN1YnNjcmliZUZvclJldHJ5KCk7XG4gICAgICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmV0cnkuanMubWFwIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gcmV0cnlXaGVuKG5vdGlmaWVyKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaW5uZXJTdWI7XG4gICAgICAgIGxldCBzeW5jUmVzdWIgPSBmYWxzZTtcbiAgICAgICAgbGV0IGVycm9ycyQ7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZUZvclJldHJ5V2hlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGlubmVyU3ViID0gc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFlcnJvcnMkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycyQgPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICBub3RpZmllcihlcnJvcnMkKS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAoKSA9PiBpbm5lclN1YiA/IHN1YnNjcmliZUZvclJldHJ5V2hlbigpIDogKHN5bmNSZXN1YiA9IHRydWUpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnJvcnMkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycyQubmV4dChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGlmIChzeW5jUmVzdWIpIHtcbiAgICAgICAgICAgICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzeW5jUmVzdWIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVGb3JSZXRyeVdoZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc3Vic2NyaWJlRm9yUmV0cnlXaGVuKCk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXRyeVdoZW4uanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBzYW1wbGUobm90aWZpZXIpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBoYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbGFzdFZhbHVlID0gbnVsbDtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaGFzVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgbGFzdFZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0pKTtcbiAgICAgICAgY29uc3QgZW1pdCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBsYXN0VmFsdWU7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBub3RpZmllci5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBlbWl0LCBub29wKSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zYW1wbGUuanMubWFwIiwiaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgc2FtcGxlIH0gZnJvbSAnLi9zYW1wbGUnO1xuaW1wb3J0IHsgaW50ZXJ2YWwgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2ludGVydmFsJztcbmV4cG9ydCBmdW5jdGlvbiBzYW1wbGVUaW1lKHBlcmlvZCwgc2NoZWR1bGVyID0gYXN5bmNTY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gc2FtcGxlKGludGVydmFsKHBlcmlvZCwgc2NoZWR1bGVyKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zYW1wbGVUaW1lLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgc2NhbkludGVybmFscyB9IGZyb20gJy4vc2NhbkludGVybmFscyc7XG5leHBvcnQgZnVuY3Rpb24gc2NhbihhY2N1bXVsYXRvciwgc2VlZCkge1xuICAgIHJldHVybiBvcGVyYXRlKHNjYW5JbnRlcm5hbHMoYWNjdW11bGF0b3IsIHNlZWQsIGFyZ3VtZW50cy5sZW5ndGggPj0gMiwgdHJ1ZSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2Nhbi5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZUVxdWFsKGNvbXBhcmVUbywgY29tcGFyYXRvciA9IChhLCBiKSA9PiBhID09PSBiKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25zdCBhU3RhdGUgPSBjcmVhdGVTdGF0ZSgpO1xuICAgICAgICBjb25zdCBiU3RhdGUgPSBjcmVhdGVTdGF0ZSgpO1xuICAgICAgICBjb25zdCBlbWl0ID0gKGlzRXF1YWwpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChpc0VxdWFsKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY3JlYXRlU3Vic2NyaWJlciA9IChzZWxmU3RhdGUsIG90aGVyU3RhdGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyID0gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAoYSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYnVmZmVyLCBjb21wbGV0ZSB9ID0gb3RoZXJTdGF0ZTtcbiAgICAgICAgICAgICAgICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZSA/IGVtaXQoZmFsc2UpIDogc2VsZlN0YXRlLmJ1ZmZlci5wdXNoKGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgIWNvbXBhcmF0b3IoYSwgYnVmZmVyLnNoaWZ0KCkpICYmIGVtaXQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmU3RhdGUuY29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY29tcGxldGUsIGJ1ZmZlciB9ID0gb3RoZXJTdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZSAmJiBlbWl0KGJ1ZmZlci5sZW5ndGggPT09IDApO1xuICAgICAgICAgICAgICAgIHNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyID09PSBudWxsIHx8IHNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzZXF1ZW5jZUVxdWFsU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gc2VxdWVuY2VFcXVhbFN1YnNjcmliZXI7XG4gICAgICAgIH07XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUoY3JlYXRlU3Vic2NyaWJlcihhU3RhdGUsIGJTdGF0ZSkpO1xuICAgICAgICBjb21wYXJlVG8uc3Vic2NyaWJlKGNyZWF0ZVN1YnNjcmliZXIoYlN0YXRlLCBhU3RhdGUpKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGJ1ZmZlcjogW10sXG4gICAgICAgIGNvbXBsZXRlOiBmYWxzZSxcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2VxdWVuY2VFcXVhbC5qcy5tYXAiLCJpbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICcuLi9vcGVyYXRvcnMvdGFrZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBTYWZlU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5leHBvcnQgZnVuY3Rpb24gc2hhcmUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgeyBjb25uZWN0b3IgPSAoKSA9PiBuZXcgU3ViamVjdCgpLCByZXNldE9uRXJyb3IgPSB0cnVlLCByZXNldE9uQ29tcGxldGUgPSB0cnVlLCByZXNldE9uUmVmQ291bnRaZXJvID0gdHJ1ZSB9ID0gb3B0aW9ucztcbiAgICByZXR1cm4gKHdyYXBwZXJTb3VyY2UpID0+IHtcbiAgICAgICAgbGV0IGNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICBsZXQgcmVzZXRDb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgbGV0IHN1YmplY3QgPSBudWxsO1xuICAgICAgICBsZXQgcmVmQ291bnQgPSAwO1xuICAgICAgICBsZXQgaGFzQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgIGxldCBoYXNFcnJvcmVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGNhbmNlbFJlc2V0ID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzZXRDb25uZWN0aW9uID09PSBudWxsIHx8IHJlc2V0Q29ubmVjdGlvbiA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVzZXRDb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICByZXNldENvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXNldCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNhbmNlbFJlc2V0KCk7XG4gICAgICAgICAgICBjb25uZWN0aW9uID0gc3ViamVjdCA9IG51bGw7XG4gICAgICAgICAgICBoYXNDb21wbGV0ZWQgPSBoYXNFcnJvcmVkID0gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc2V0QW5kVW5zdWJzY3JpYmUgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb25uID0gY29ubmVjdGlvbjtcbiAgICAgICAgICAgIHJlc2V0KCk7XG4gICAgICAgICAgICBjb25uID09PSBudWxsIHx8IGNvbm4gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbm4udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICAgICAgcmVmQ291bnQrKztcbiAgICAgICAgICAgIGlmICghaGFzRXJyb3JlZCAmJiAhaGFzQ29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgY2FuY2VsUmVzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRlc3QgPSAoc3ViamVjdCA9IHN1YmplY3QgIT09IG51bGwgJiYgc3ViamVjdCAhPT0gdm9pZCAwID8gc3ViamVjdCA6IGNvbm5lY3RvcigpKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKCgpID0+IHtcbiAgICAgICAgICAgICAgICByZWZDb3VudC0tO1xuICAgICAgICAgICAgICAgIGlmIChyZWZDb3VudCA9PT0gMCAmJiAhaGFzRXJyb3JlZCAmJiAhaGFzQ29tcGxldGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0Q29ubmVjdGlvbiA9IGhhbmRsZVJlc2V0KHJlc2V0QW5kVW5zdWJzY3JpYmUsIHJlc2V0T25SZWZDb3VudFplcm8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGVzdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICAgICBpZiAoIWNvbm5lY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uID0gbmV3IFNhZmVTdWJzY3JpYmVyKHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dDogKHZhbHVlKSA9PiBkZXN0Lm5leHQodmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzRXJyb3JlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxSZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRDb25uZWN0aW9uID0gaGFuZGxlUmVzZXQocmVzZXQsIHJlc2V0T25FcnJvciwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxSZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRDb25uZWN0aW9uID0gaGFuZGxlUmVzZXQocmVzZXQsIHJlc2V0T25Db21wbGV0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXN0LmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZnJvbShzb3VyY2UpLnN1YnNjcmliZShjb25uZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkod3JhcHBlclNvdXJjZSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVJlc2V0KHJlc2V0LCBvbiwgLi4uYXJncykge1xuICAgIGlmIChvbiA9PT0gdHJ1ZSkge1xuICAgICAgICByZXNldCgpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKG9uID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG9uKC4uLmFyZ3MpXG4gICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gcmVzZXQoKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaGFyZS5qcy5tYXAiLCJpbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAnLi4vUmVwbGF5U3ViamVjdCc7XG5pbXBvcnQgeyBzaGFyZSB9IGZyb20gJy4vc2hhcmUnO1xuZXhwb3J0IGZ1bmN0aW9uIHNoYXJlUmVwbGF5KGNvbmZpZ09yQnVmZmVyU2l6ZSwgd2luZG93VGltZSwgc2NoZWR1bGVyKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBsZXQgYnVmZmVyU2l6ZTtcbiAgICBsZXQgcmVmQ291bnQgPSBmYWxzZTtcbiAgICBpZiAoY29uZmlnT3JCdWZmZXJTaXplICYmIHR5cGVvZiBjb25maWdPckJ1ZmZlclNpemUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGJ1ZmZlclNpemUgPSAoX2EgPSBjb25maWdPckJ1ZmZlclNpemUuYnVmZmVyU2l6ZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogSW5maW5pdHk7XG4gICAgICAgIHdpbmRvd1RpbWUgPSAoX2IgPSBjb25maWdPckJ1ZmZlclNpemUud2luZG93VGltZSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogSW5maW5pdHk7XG4gICAgICAgIHJlZkNvdW50ID0gISFjb25maWdPckJ1ZmZlclNpemUucmVmQ291bnQ7XG4gICAgICAgIHNjaGVkdWxlciA9IGNvbmZpZ09yQnVmZmVyU2l6ZS5zY2hlZHVsZXI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBidWZmZXJTaXplID0gY29uZmlnT3JCdWZmZXJTaXplICE9PSBudWxsICYmIGNvbmZpZ09yQnVmZmVyU2l6ZSAhPT0gdm9pZCAwID8gY29uZmlnT3JCdWZmZXJTaXplIDogSW5maW5pdHk7XG4gICAgfVxuICAgIHJldHVybiBzaGFyZSh7XG4gICAgICAgIGNvbm5lY3RvcjogKCkgPT4gbmV3IFJlcGxheVN1YmplY3QoYnVmZmVyU2l6ZSwgd2luZG93VGltZSwgc2NoZWR1bGVyKSxcbiAgICAgICAgcmVzZXRPbkVycm9yOiB0cnVlLFxuICAgICAgICByZXNldE9uQ29tcGxldGU6IGZhbHNlLFxuICAgICAgICByZXNldE9uUmVmQ291bnRaZXJvOiByZWZDb3VudFxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2hhcmVSZXBsYXkuanMubWFwIiwiaW1wb3J0IHsgRW1wdHlFcnJvciB9IGZyb20gJy4uL3V0aWwvRW1wdHlFcnJvcic7XG5pbXBvcnQgeyBTZXF1ZW5jZUVycm9yIH0gZnJvbSAnLi4vdXRpbC9TZXF1ZW5jZUVycm9yJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi91dGlsL05vdEZvdW5kRXJyb3InO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gc2luZ2xlKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIGxldCBzaW5nbGVWYWx1ZTtcbiAgICAgICAgbGV0IHNlZW5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBzZWVuVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKCFwcmVkaWNhdGUgfHwgcHJlZGljYXRlKHZhbHVlLCBpbmRleCsrLCBzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgaGFzVmFsdWUgJiYgc3Vic2NyaWJlci5lcnJvcihuZXcgU2VxdWVuY2VFcnJvcignVG9vIG1hbnkgbWF0Y2hpbmcgdmFsdWVzJykpO1xuICAgICAgICAgICAgICAgIGhhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzaW5nbGVWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoc2luZ2xlVmFsdWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3Ioc2VlblZhbHVlID8gbmV3IE5vdEZvdW5kRXJyb3IoJ05vIG1hdGNoaW5nIHZhbHVlcycpIDogbmV3IEVtcHR5RXJyb3IoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpbmdsZS5qcy5tYXAiLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuL2ZpbHRlcic7XG5leHBvcnQgZnVuY3Rpb24gc2tpcChjb3VudCkge1xuICAgIHJldHVybiBmaWx0ZXIoKF8sIGluZGV4KSA9PiBjb3VudCA8PSBpbmRleCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwLmpzLm1hcCIsImltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBza2lwTGFzdChza2lwQ291bnQpIHtcbiAgICByZXR1cm4gc2tpcENvdW50IDw9IDBcbiAgICAgICAgP1xuICAgICAgICAgICAgaWRlbnRpdHlcbiAgICAgICAgOiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIGxldCByaW5nID0gbmV3IEFycmF5KHNraXBDb3VudCk7XG4gICAgICAgICAgICBsZXQgc2VlbiA9IDA7XG4gICAgICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVJbmRleCA9IHNlZW4rKztcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVJbmRleCA8IHNraXBDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICByaW5nW3ZhbHVlSW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHZhbHVlSW5kZXggJSBza2lwQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gcmluZ1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHJpbmdbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICByaW5nID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcExhc3QuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcbmV4cG9ydCBmdW5jdGlvbiBza2lwVW50aWwobm90aWZpZXIpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCB0YWtpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3Qgc2tpcFN1YnNjcmliZXIgPSBuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICgpID0+IHtcbiAgICAgICAgICAgIHNraXBTdWJzY3JpYmVyID09PSBudWxsIHx8IHNraXBTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBza2lwU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGFraW5nID0gdHJ1ZTtcbiAgICAgICAgfSwgbm9vcCk7XG4gICAgICAgIGlubmVyRnJvbShub3RpZmllcikuc3Vic2NyaWJlKHNraXBTdWJzY3JpYmVyKTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4gdGFraW5nICYmIHN1YnNjcmliZXIubmV4dCh2YWx1ZSkpKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNraXBVbnRpbC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBza2lwV2hpbGUocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgdGFraW5nID0gZmFsc2U7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+ICh0YWtpbmcgfHwgKHRha2luZyA9ICFwcmVkaWNhdGUodmFsdWUsIGluZGV4KyspKSkgJiYgc3Vic2NyaWJlci5uZXh0KHZhbHVlKSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcFdoaWxlLmpzLm1hcCIsImltcG9ydCB7IGNvbmNhdCB9IGZyb20gJy4uL29ic2VydmFibGUvY29uY2F0JztcbmltcG9ydCB7IHBvcFNjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdpdGgoLi4udmFsdWVzKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gcG9wU2NoZWR1bGVyKHZhbHVlcyk7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICAoc2NoZWR1bGVyID8gY29uY2F0KHZhbHVlcywgc291cmNlLCBzY2hlZHVsZXIpIDogY29uY2F0KHZhbHVlcywgc291cmNlKSkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhcnRXaXRoLmpzLm1hcCIsImltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaE1hcChwcm9qZWN0LCByZXN1bHRTZWxlY3Rvcikge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGlubmVyU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGxldCBpc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGNoZWNrQ29tcGxldGUgPSAoKSA9PiBpc0NvbXBsZXRlICYmICFpbm5lclN1YnNjcmliZXIgJiYgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpbm5lclN1YnNjcmliZXIgPT09IG51bGwgfHwgaW5uZXJTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBpbm5lclN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGxldCBpbm5lckluZGV4ID0gMDtcbiAgICAgICAgICAgIGNvbnN0IG91dGVySW5kZXggPSBpbmRleCsrO1xuICAgICAgICAgICAgaW5uZXJGcm9tKHByb2plY3QodmFsdWUsIG91dGVySW5kZXgpKS5zdWJzY3JpYmUoKGlubmVyU3Vic2NyaWJlciA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKGlubmVyVmFsdWUpID0+IHN1YnNjcmliZXIubmV4dChyZXN1bHRTZWxlY3RvciA/IHJlc3VsdFNlbGVjdG9yKHZhbHVlLCBpbm5lclZhbHVlLCBvdXRlckluZGV4LCBpbm5lckluZGV4KyspIDogaW5uZXJWYWx1ZSksICgpID0+IHtcbiAgICAgICAgICAgICAgICBpbm5lclN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNoZWNrQ29tcGxldGUoKTtcbiAgICAgICAgICAgIH0pKSk7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgY2hlY2tDb21wbGV0ZSgpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zd2l0Y2hNYXAuanMubWFwIiwiaW1wb3J0IHsgc3dpdGNoTWFwIH0gZnJvbSAnLi9zd2l0Y2hNYXAnO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hBbGwoKSB7XG4gICAgcmV0dXJuIHN3aXRjaE1hcChpZGVudGl0eSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zd2l0Y2hBbGwuanMubWFwIiwiaW1wb3J0IHsgc3dpdGNoTWFwIH0gZnJvbSAnLi9zd2l0Y2hNYXAnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoTWFwVG8oaW5uZXJPYnNlcnZhYmxlLCByZXN1bHRTZWxlY3Rvcikge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKHJlc3VsdFNlbGVjdG9yKSA/IHN3aXRjaE1hcCgoKSA9PiBpbm5lck9ic2VydmFibGUsIHJlc3VsdFNlbGVjdG9yKSA6IHN3aXRjaE1hcCgoKSA9PiBpbm5lck9ic2VydmFibGUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3dpdGNoTWFwVG8uanMubWFwIiwiaW1wb3J0IHsgc3dpdGNoTWFwIH0gZnJvbSAnLi9zd2l0Y2hNYXAnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoU2NhbihhY2N1bXVsYXRvciwgc2VlZCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IHN0YXRlID0gc2VlZDtcbiAgICAgICAgc3dpdGNoTWFwKCh2YWx1ZSwgaW5kZXgpID0+IGFjY3VtdWxhdG9yKHN0YXRlLCB2YWx1ZSwgaW5kZXgpLCAoXywgaW5uZXJWYWx1ZSkgPT4gKChzdGF0ZSA9IGlubmVyVmFsdWUpLCBpbm5lclZhbHVlKSkoc291cmNlKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBzdGF0ZSA9IG51bGw7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zd2l0Y2hTY2FuLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5leHBvcnQgZnVuY3Rpb24gdGFrZVVudGlsKG5vdGlmaWVyKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBpbm5lckZyb20obm90aWZpZXIpLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICgpID0+IHN1YnNjcmliZXIuY29tcGxldGUoKSwgbm9vcCkpO1xuICAgICAgICAhc3Vic2NyaWJlci5jbG9zZWQgJiYgc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2VVbnRpbC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGUocHJlZGljYXRlLCBpbmNsdXNpdmUgPSBmYWxzZSkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcHJlZGljYXRlKHZhbHVlLCBpbmRleCsrKTtcbiAgICAgICAgICAgIChyZXN1bHQgfHwgaW5jbHVzaXZlKSAmJiBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgIXJlc3VsdCAmJiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2VXaGlsZS5qcy5tYXAiLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiB0YXAob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgIGNvbnN0IHRhcE9ic2VydmVyID0gaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkgfHwgZXJyb3IgfHwgY29tcGxldGVcbiAgICAgICAgP1xuICAgICAgICAgICAgeyBuZXh0OiBvYnNlcnZlck9yTmV4dCwgZXJyb3IsIGNvbXBsZXRlIH1cbiAgICAgICAgOiBvYnNlcnZlck9yTmV4dDtcbiAgICByZXR1cm4gdGFwT2JzZXJ2ZXJcbiAgICAgICAgPyBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIChfYSA9IHRhcE9ic2VydmVyLnN1YnNjcmliZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGFwT2JzZXJ2ZXIpO1xuICAgICAgICAgICAgbGV0IGlzVW5zdWIgPSB0cnVlO1xuICAgICAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAoX2EgPSB0YXBPYnNlcnZlci5uZXh0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0YXBPYnNlcnZlciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIGlzVW5zdWIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAoX2EgPSB0YXBPYnNlcnZlci5jb21wbGV0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGFwT2JzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgaXNVbnN1YiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIChfYSA9IHRhcE9ic2VydmVyLmVycm9yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0YXBPYnNlcnZlciwgZXJyKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICBpZiAoaXNVbnN1Yikge1xuICAgICAgICAgICAgICAgICAgICAoX2EgPSB0YXBPYnNlcnZlci51bnN1YnNjcmliZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGFwT2JzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAoX2IgPSB0YXBPYnNlcnZlci5maW5hbGl6ZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwodGFwT2JzZXJ2ZXIpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KVxuICAgICAgICA6XG4gICAgICAgICAgICBpZGVudGl0eTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhcC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmV4cG9ydCBjb25zdCBkZWZhdWx0VGhyb3R0bGVDb25maWcgPSB7XG4gICAgbGVhZGluZzogdHJ1ZSxcbiAgICB0cmFpbGluZzogZmFsc2UsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlKGR1cmF0aW9uU2VsZWN0b3IsIHsgbGVhZGluZywgdHJhaWxpbmcgfSA9IGRlZmF1bHRUaHJvdHRsZUNvbmZpZykge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIGxldCBzZW5kVmFsdWUgPSBudWxsO1xuICAgICAgICBsZXQgdGhyb3R0bGVkID0gbnVsbDtcbiAgICAgICAgbGV0IGlzQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgZW5kVGhyb3R0bGluZyA9ICgpID0+IHtcbiAgICAgICAgICAgIHRocm90dGxlZCA9PT0gbnVsbCB8fCB0aHJvdHRsZWQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRocm90dGxlZC51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhyb3R0bGVkID0gbnVsbDtcbiAgICAgICAgICAgIGlmICh0cmFpbGluZykge1xuICAgICAgICAgICAgICAgIHNlbmQoKTtcbiAgICAgICAgICAgICAgICBpc0NvbXBsZXRlICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2xlYW51cFRocm90dGxpbmcgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aHJvdHRsZWQgPSBudWxsO1xuICAgICAgICAgICAgaXNDb21wbGV0ZSAmJiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN0YXJ0VGhyb3R0bGUgPSAodmFsdWUpID0+ICh0aHJvdHRsZWQgPSBpbm5lckZyb20oZHVyYXRpb25TZWxlY3Rvcih2YWx1ZSkpLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGVuZFRocm90dGxpbmcsIGNsZWFudXBUaHJvdHRsaW5nKSkpO1xuICAgICAgICBjb25zdCBzZW5kID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNlbmRWYWx1ZTtcbiAgICAgICAgICAgICAgICBzZW5kVmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgIWlzQ29tcGxldGUgJiYgc3RhcnRUaHJvdHRsZSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGhhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbmRWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgISh0aHJvdHRsZWQgJiYgIXRocm90dGxlZC5jbG9zZWQpICYmIChsZWFkaW5nID8gc2VuZCgpIDogc3RhcnRUaHJvdHRsZSh2YWx1ZSkpO1xuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBpc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICEodHJhaWxpbmcgJiYgaGFzVmFsdWUgJiYgdGhyb3R0bGVkICYmICF0aHJvdHRsZWQuY2xvc2VkKSAmJiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRocm90dGxlLmpzLm1hcCIsImltcG9ydCB7IGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IGRlZmF1bHRUaHJvdHRsZUNvbmZpZywgdGhyb3R0bGUgfSBmcm9tICcuL3Rocm90dGxlJztcbmltcG9ydCB7IHRpbWVyIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS90aW1lcic7XG5leHBvcnQgZnVuY3Rpb24gdGhyb3R0bGVUaW1lKGR1cmF0aW9uLCBzY2hlZHVsZXIgPSBhc3luY1NjaGVkdWxlciwgY29uZmlnID0gZGVmYXVsdFRocm90dGxlQ29uZmlnKSB7XG4gICAgY29uc3QgZHVyYXRpb24kID0gdGltZXIoZHVyYXRpb24sIHNjaGVkdWxlcik7XG4gICAgcmV0dXJuIHRocm90dGxlKCgpID0+IGR1cmF0aW9uJCwgY29uZmlnKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRocm90dGxlVGltZS5qcy5tYXAiLCJpbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBzY2FuIH0gZnJvbSAnLi9zY2FuJztcbmltcG9ydCB7IGRlZmVyIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9kZWZlcic7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5leHBvcnQgZnVuY3Rpb24gdGltZUludGVydmFsKHNjaGVkdWxlciA9IGFzeW5jKSB7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IGRlZmVyKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5waXBlKHNjYW4oKHsgY3VycmVudCB9LCB2YWx1ZSkgPT4gKHsgdmFsdWUsIGN1cnJlbnQ6IHNjaGVkdWxlci5ub3coKSwgbGFzdDogY3VycmVudCB9KSwge1xuICAgICAgICAgICAgY3VycmVudDogc2NoZWR1bGVyLm5vdygpLFxuICAgICAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGxhc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgfSksIG1hcCgoeyBjdXJyZW50LCBsYXN0LCB2YWx1ZSB9KSA9PiBuZXcgVGltZUludGVydmFsKHZhbHVlLCBjdXJyZW50IC0gbGFzdCkpKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBjbGFzcyBUaW1lSW50ZXJ2YWwge1xuICAgIGNvbnN0cnVjdG9yKHZhbHVlLCBpbnRlcnZhbCkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBpbnRlcnZhbDtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aW1lSW50ZXJ2YWwuanMubWFwIiwiaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgaXNWYWxpZERhdGUgfSBmcm9tICcuLi91dGlsL2lzRGF0ZSc7XG5pbXBvcnQgeyB0aW1lb3V0IH0gZnJvbSAnLi90aW1lb3V0JztcbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0V2l0aChkdWUsIHdpdGhPYnNlcnZhYmxlLCBzY2hlZHVsZXIpIHtcbiAgICBsZXQgZmlyc3Q7XG4gICAgbGV0IGVhY2g7XG4gICAgbGV0IF93aXRoO1xuICAgIHNjaGVkdWxlciA9IHNjaGVkdWxlciAhPT0gbnVsbCAmJiBzY2hlZHVsZXIgIT09IHZvaWQgMCA/IHNjaGVkdWxlciA6IGFzeW5jO1xuICAgIGlmIChpc1ZhbGlkRGF0ZShkdWUpKSB7XG4gICAgICAgIGZpcnN0ID0gZHVlO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgZHVlID09PSAnbnVtYmVyJykge1xuICAgICAgICBlYWNoID0gZHVlO1xuICAgIH1cbiAgICBpZiAod2l0aE9ic2VydmFibGUpIHtcbiAgICAgICAgX3dpdGggPSAoKSA9PiB3aXRoT2JzZXJ2YWJsZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIG9ic2VydmFibGUgcHJvdmlkZWQgdG8gc3dpdGNoIHRvJyk7XG4gICAgfVxuICAgIGlmIChmaXJzdCA9PSBudWxsICYmIGVhY2ggPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdObyB0aW1lb3V0IHByb3ZpZGVkLicpO1xuICAgIH1cbiAgICByZXR1cm4gdGltZW91dCh7XG4gICAgICAgIGZpcnN0LFxuICAgICAgICBlYWNoLFxuICAgICAgICBzY2hlZHVsZXIsXG4gICAgICAgIHdpdGg6IF93aXRoLFxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGltZW91dFdpdGguanMubWFwIiwiaW1wb3J0IHsgZGF0ZVRpbWVzdGFtcFByb3ZpZGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2RhdGVUaW1lc3RhbXBQcm92aWRlcic7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5leHBvcnQgZnVuY3Rpb24gdGltZXN0YW1wKHRpbWVzdGFtcFByb3ZpZGVyID0gZGF0ZVRpbWVzdGFtcFByb3ZpZGVyKSB7XG4gICAgcmV0dXJuIG1hcCgodmFsdWUpID0+ICh7IHZhbHVlLCB0aW1lc3RhbXA6IHRpbWVzdGFtcFByb3ZpZGVyLm5vdygpIH0pKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWVzdGFtcC5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvdyh3aW5kb3dCb3VuZGFyaWVzKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgd2luZG93U3ViamVjdCA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCh3aW5kb3dTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpKTtcbiAgICAgICAgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycikgPT4ge1xuICAgICAgICAgICAgd2luZG93U3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICB9O1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB3aW5kb3dTdWJqZWN0ID09PSBudWxsIHx8IHdpbmRvd1N1YmplY3QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHdpbmRvd1N1YmplY3QubmV4dCh2YWx1ZSksICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvd1N1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSwgZXJyb3JIYW5kbGVyKSk7XG4gICAgICAgIHdpbmRvd0JvdW5kYXJpZXMuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93U3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KCh3aW5kb3dTdWJqZWN0ID0gbmV3IFN1YmplY3QoKSkpO1xuICAgICAgICB9LCBub29wLCBlcnJvckhhbmRsZXIpKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvd1N1YmplY3QgPT09IG51bGwgfHwgd2luZG93U3ViamVjdCA9PT0gdm9pZCAwID8gdm9pZCAwIDogd2luZG93U3ViamVjdC51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgd2luZG93U3ViamVjdCA9IG51bGw7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD13aW5kb3cuanMubWFwIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gd2luZG93Q291bnQod2luZG93U2l6ZSwgc3RhcnRXaW5kb3dFdmVyeSA9IDApIHtcbiAgICBjb25zdCBzdGFydEV2ZXJ5ID0gc3RhcnRXaW5kb3dFdmVyeSA+IDAgPyBzdGFydFdpbmRvd0V2ZXJ5IDogd2luZG93U2l6ZTtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCB3aW5kb3dzID0gW25ldyBTdWJqZWN0KCldO1xuICAgICAgICBsZXQgc3RhcnRzID0gW107XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCh3aW5kb3dzWzBdLmFzT2JzZXJ2YWJsZSgpKTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCB3aW5kb3cgb2Ygd2luZG93cykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGMgPSBjb3VudCAtIHdpbmRvd1NpemUgKyAxO1xuICAgICAgICAgICAgaWYgKGMgPj0gMCAmJiBjICUgc3RhcnRFdmVyeSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHdpbmRvd3Muc2hpZnQoKS5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCsrY291bnQgJSBzdGFydEV2ZXJ5ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2luZG93ID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgICAgICAgICB3aW5kb3dzLnB1c2god2luZG93KTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQod2luZG93LmFzT2JzZXJ2YWJsZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgd2hpbGUgKHdpbmRvd3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHdpbmRvd3Muc2hpZnQoKS5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICB3aGlsZSAod2luZG93cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgd2luZG93cy5zaGlmdCgpLmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHN0YXJ0cyA9IG51bGw7XG4gICAgICAgICAgICB3aW5kb3dzID0gbnVsbDtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2luZG93Q291bnQuanMubWFwIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgYXJyUmVtb3ZlIH0gZnJvbSAnLi4vdXRpbC9hcnJSZW1vdmUnO1xuaW1wb3J0IHsgcG9wU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9hcmdzJztcbmltcG9ydCB7IGV4ZWN1dGVTY2hlZHVsZSB9IGZyb20gJy4uL3V0aWwvZXhlY3V0ZVNjaGVkdWxlJztcbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dUaW1lKHdpbmRvd1RpbWVTcGFuLCAuLi5vdGhlckFyZ3MpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IChfYSA9IHBvcFNjaGVkdWxlcihvdGhlckFyZ3MpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBhc3luY1NjaGVkdWxlcjtcbiAgICBjb25zdCB3aW5kb3dDcmVhdGlvbkludGVydmFsID0gKF9iID0gb3RoZXJBcmdzWzBdKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBudWxsO1xuICAgIGNvbnN0IG1heFdpbmRvd1NpemUgPSBvdGhlckFyZ3NbMV0gfHwgSW5maW5pdHk7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgd2luZG93UmVjb3JkcyA9IFtdO1xuICAgICAgICBsZXQgcmVzdGFydE9uQ2xvc2UgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgY2xvc2VXaW5kb3cgPSAocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHdpbmRvdywgc3VicyB9ID0gcmVjb3JkO1xuICAgICAgICAgICAgd2luZG93LmNvbXBsZXRlKCk7XG4gICAgICAgICAgICBzdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICBhcnJSZW1vdmUod2luZG93UmVjb3JkcywgcmVjb3JkKTtcbiAgICAgICAgICAgIHJlc3RhcnRPbkNsb3NlICYmIHN0YXJ0V2luZG93KCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN0YXJ0V2luZG93ID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHdpbmRvd1JlY29yZHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKHN1YnMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkID0ge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3csXG4gICAgICAgICAgICAgICAgICAgIHN1YnMsXG4gICAgICAgICAgICAgICAgICAgIHNlZW46IDAsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB3aW5kb3dSZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQod2luZG93LmFzT2JzZXJ2YWJsZSgpKTtcbiAgICAgICAgICAgICAgICBleGVjdXRlU2NoZWR1bGUoc3Vicywgc2NoZWR1bGVyLCAoKSA9PiBjbG9zZVdpbmRvdyhyZWNvcmQpLCB3aW5kb3dUaW1lU3Bhbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmICh3aW5kb3dDcmVhdGlvbkludGVydmFsICE9PSBudWxsICYmIHdpbmRvd0NyZWF0aW9uSW50ZXJ2YWwgPj0gMCkge1xuICAgICAgICAgICAgZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmliZXIsIHNjaGVkdWxlciwgc3RhcnRXaW5kb3csIHdpbmRvd0NyZWF0aW9uSW50ZXJ2YWwsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzdGFydE9uQ2xvc2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0V2luZG93KCk7XG4gICAgICAgIGNvbnN0IGxvb3AgPSAoY2IpID0+IHdpbmRvd1JlY29yZHMuc2xpY2UoKS5mb3JFYWNoKGNiKTtcbiAgICAgICAgY29uc3QgdGVybWluYXRlID0gKGNiKSA9PiB7XG4gICAgICAgICAgICBsb29wKCh7IHdpbmRvdyB9KSA9PiBjYih3aW5kb3cpKTtcbiAgICAgICAgICAgIGNiKHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICB9O1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBsb29wKChyZWNvcmQpID0+IHtcbiAgICAgICAgICAgICAgICByZWNvcmQud2luZG93Lm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIG1heFdpbmRvd1NpemUgPD0gKytyZWNvcmQuc2VlbiAmJiBjbG9zZVdpbmRvdyhyZWNvcmQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sICgpID0+IHRlcm1pbmF0ZSgoY29uc3VtZXIpID0+IGNvbnN1bWVyLmNvbXBsZXRlKCkpLCAoZXJyKSA9PiB0ZXJtaW5hdGUoKGNvbnN1bWVyKSA9PiBjb25zdW1lci5lcnJvcihlcnIpKSkpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93UmVjb3JkcyA9IG51bGw7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD13aW5kb3dUaW1lLmpzLm1hcCIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgYXJyUmVtb3ZlIH0gZnJvbSAnLi4vdXRpbC9hcnJSZW1vdmUnO1xuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvd1RvZ2dsZShvcGVuaW5ncywgY2xvc2luZ1NlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25zdCB3aW5kb3dzID0gW107XG4gICAgICAgIGNvbnN0IGhhbmRsZUVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgICAgd2hpbGUgKDAgPCB3aW5kb3dzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHdpbmRvd3Muc2hpZnQoKS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICB9O1xuICAgICAgICBpbm5lckZyb20ob3BlbmluZ3MpLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIChvcGVuVmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgICAgICB3aW5kb3dzLnB1c2god2luZG93KTtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NpbmdTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICBjb25zdCBjbG9zZVdpbmRvdyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBhcnJSZW1vdmUod2luZG93cywgd2luZG93KTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICBjbG9zaW5nU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGNsb3NpbmdOb3RpZmllcjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY2xvc2luZ05vdGlmaWVyID0gaW5uZXJGcm9tKGNsb3NpbmdTZWxlY3RvcihvcGVuVmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh3aW5kb3cuYXNPYnNlcnZhYmxlKCkpO1xuICAgICAgICAgICAgY2xvc2luZ1N1YnNjcmlwdGlvbi5hZGQoY2xvc2luZ05vdGlmaWVyLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGNsb3NlV2luZG93LCBub29wLCBoYW5kbGVFcnJvcikpKTtcbiAgICAgICAgfSwgbm9vcCkpO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB3aW5kb3dzQ29weSA9IHdpbmRvd3Muc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd2luZG93IG9mIHdpbmRvd3NDb3B5KSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICB3aGlsZSAoMCA8IHdpbmRvd3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93cy5zaGlmdCgpLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIGhhbmRsZUVycm9yLCAoKSA9PiB7XG4gICAgICAgICAgICB3aGlsZSAoMCA8IHdpbmRvd3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93cy5zaGlmdCgpLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdpbmRvd1RvZ2dsZS5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dXaGVuKGNsb3NpbmdTZWxlY3Rvcikge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IHdpbmRvdztcbiAgICAgICAgbGV0IGNsb3NpbmdTdWJzY3JpYmVyO1xuICAgICAgICBjb25zdCBoYW5kbGVFcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvcGVuV2luZG93ID0gKCkgPT4ge1xuICAgICAgICAgICAgY2xvc2luZ1N1YnNjcmliZXIgPT09IG51bGwgfHwgY2xvc2luZ1N1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNsb3NpbmdTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB3aW5kb3cgPT09IG51bGwgfHwgd2luZG93ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB3aW5kb3cuY29tcGxldGUoKTtcbiAgICAgICAgICAgIHdpbmRvdyA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQod2luZG93LmFzT2JzZXJ2YWJsZSgpKTtcbiAgICAgICAgICAgIGxldCBjbG9zaW5nTm90aWZpZXI7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNsb3NpbmdOb3RpZmllciA9IGlubmVyRnJvbShjbG9zaW5nU2VsZWN0b3IoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbG9zaW5nTm90aWZpZXIuc3Vic2NyaWJlKChjbG9zaW5nU3Vic2NyaWJlciA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgb3BlbldpbmRvdywgb3BlbldpbmRvdywgaGFuZGxlRXJyb3IpKSk7XG4gICAgICAgIH07XG4gICAgICAgIG9wZW5XaW5kb3coKTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4gd2luZG93Lm5leHQodmFsdWUpLCAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cuY29tcGxldGUoKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSwgaGFuZGxlRXJyb3IsICgpID0+IHtcbiAgICAgICAgICAgIGNsb3NpbmdTdWJzY3JpYmVyID09PSBudWxsIHx8IGNsb3NpbmdTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjbG9zaW5nU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgd2luZG93ID0gbnVsbDtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2luZG93V2hlbi5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcbmltcG9ydCB7IHBvcFJlc3VsdFNlbGVjdG9yIH0gZnJvbSAnLi4vdXRpbC9hcmdzJztcbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbSguLi5pbnB1dHMpIHtcbiAgICBjb25zdCBwcm9qZWN0ID0gcG9wUmVzdWx0U2VsZWN0b3IoaW5wdXRzKTtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGxlbiA9IGlucHV0cy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IG90aGVyVmFsdWVzID0gbmV3IEFycmF5KGxlbik7XG4gICAgICAgIGxldCBoYXNWYWx1ZSA9IGlucHV0cy5tYXAoKCkgPT4gZmFsc2UpO1xuICAgICAgICBsZXQgcmVhZHkgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaW5uZXJGcm9tKGlucHV0c1tpXSkuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgb3RoZXJWYWx1ZXNbaV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlYWR5ICYmICFoYXNWYWx1ZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNWYWx1ZVtpXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIChyZWFkeSA9IGhhc1ZhbHVlLmV2ZXJ5KGlkZW50aXR5KSkgJiYgKGhhc1ZhbHVlID0gbnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgbm9vcCkpO1xuICAgICAgICB9XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmIChyZWFkeSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IFt2YWx1ZSwgLi4ub3RoZXJWYWx1ZXNdO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChwcm9qZWN0ID8gcHJvamVjdCguLi52YWx1ZXMpIDogdmFsdWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2l0aExhdGVzdEZyb20uanMubWFwIiwiaW1wb3J0IHsgemlwIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS96aXAnO1xuaW1wb3J0IHsgam9pbkFsbEludGVybmFscyB9IGZyb20gJy4vam9pbkFsbEludGVybmFscyc7XG5leHBvcnQgZnVuY3Rpb24gemlwQWxsKHByb2plY3QpIHtcbiAgICByZXR1cm4gam9pbkFsbEludGVybmFscyh6aXAsIHByb2plY3QpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9emlwQWxsLmpzLm1hcCIsImltcG9ydCB7IHppcCBhcyB6aXBTdGF0aWMgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3ppcCc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmV4cG9ydCBmdW5jdGlvbiB6aXAoLi4uc291cmNlcykge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgemlwU3RhdGljKHNvdXJjZSwgLi4uc291cmNlcykuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9emlwLmpzLm1hcCIsImltcG9ydCB7IHppcCB9IGZyb20gJy4vemlwJztcbmV4cG9ydCBmdW5jdGlvbiB6aXBXaXRoKC4uLm90aGVySW5wdXRzKSB7XG4gICAgcmV0dXJuIHppcCguLi5vdGhlcklucHV0cyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD16aXBXaXRoLmpzLm1hcCIsImltcG9ydCB7IG5vdCB9IGZyb20gJy4uL3V0aWwvbm90JztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJy4vZmlsdGVyJztcbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aXRpb24ocHJlZGljYXRlLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IFtmaWx0ZXIocHJlZGljYXRlLCB0aGlzQXJnKShzb3VyY2UpLCBmaWx0ZXIobm90KHByZWRpY2F0ZSwgdGhpc0FyZykpKHNvdXJjZSldO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFydGl0aW9uLmpzLm1hcCIsImltcG9ydCB7IGFyZ3NPckFyZ0FycmF5IH0gZnJvbSAnLi4vdXRpbC9hcmdzT3JBcmdBcnJheSc7XG5pbXBvcnQgeyByYWNlV2l0aCB9IGZyb20gJy4vcmFjZVdpdGgnO1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2UoLi4uYXJncykge1xuICAgIHJldHVybiByYWNlV2l0aCguLi5hcmdzT3JBcmdBcnJheShhcmdzKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yYWNlLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBnZXRYSFJSZXNwb25zZSh4aHIpIHtcbiAgICBzd2l0Y2ggKHhoci5yZXNwb25zZVR5cGUpIHtcbiAgICAgICAgY2FzZSAnanNvbic6IHtcbiAgICAgICAgICAgIGlmICgncmVzcG9uc2UnIGluIHhocikge1xuICAgICAgICAgICAgICAgIHJldHVybiB4aHIucmVzcG9uc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZVhIUiA9IHhocjtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShpZVhIUi5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2RvY3VtZW50JzpcbiAgICAgICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VYTUw7XG4gICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBpZiAoJ3Jlc3BvbnNlJyBpbiB4aHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geGhyLnJlc3BvbnNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWVYSFIgPSB4aHI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGllWEhSLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdldFhIUlJlc3BvbnNlLmpzLm1hcCIsImltcG9ydCB7IGdldFhIUlJlc3BvbnNlIH0gZnJvbSAnLi9nZXRYSFJSZXNwb25zZSc7XG5leHBvcnQgY2xhc3MgQWpheFJlc3BvbnNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcmlnaW5hbEV2ZW50LCB4aHIsIHJlcXVlc3QsIHR5cGUgPSAnZG93bmxvYWRfbG9hZCcpIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gb3JpZ2luYWxFdmVudDtcbiAgICAgICAgdGhpcy54aHIgPSB4aHI7XG4gICAgICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIGNvbnN0IHsgc3RhdHVzLCByZXNwb25zZVR5cGUgfSA9IHhocjtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXMgIT09IG51bGwgJiYgc3RhdHVzICE9PSB2b2lkIDAgPyBzdGF0dXMgOiAwO1xuICAgICAgICB0aGlzLnJlc3BvbnNlVHlwZSA9IHJlc3BvbnNlVHlwZSAhPT0gbnVsbCAmJiByZXNwb25zZVR5cGUgIT09IHZvaWQgMCA/IHJlc3BvbnNlVHlwZSA6ICcnO1xuICAgICAgICBjb25zdCBhbGxIZWFkZXJzID0geGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpO1xuICAgICAgICB0aGlzLnJlc3BvbnNlSGVhZGVycyA9IGFsbEhlYWRlcnNcbiAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICBhbGxIZWFkZXJzLnNwbGl0KCdcXG4nKS5yZWR1Y2UoKGhlYWRlcnMsIGxpbmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBsaW5lLmluZGV4T2YoJzogJyk7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnNbbGluZS5zbGljZSgwLCBpbmRleCldID0gbGluZS5zbGljZShpbmRleCArIDIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGVhZGVycztcbiAgICAgICAgICAgICAgICB9LCB7fSlcbiAgICAgICAgICAgIDoge307XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSBnZXRYSFJSZXNwb25zZSh4aHIpO1xuICAgICAgICBjb25zdCB7IGxvYWRlZCwgdG90YWwgfSA9IG9yaWdpbmFsRXZlbnQ7XG4gICAgICAgIHRoaXMubG9hZGVkID0gbG9hZGVkO1xuICAgICAgICB0aGlzLnRvdGFsID0gdG90YWw7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QWpheFJlc3BvbnNlLmpzLm1hcCIsImltcG9ydCB7IGdldFhIUlJlc3BvbnNlIH0gZnJvbSAnLi9nZXRYSFJSZXNwb25zZSc7XG5pbXBvcnQgeyBjcmVhdGVFcnJvckNsYXNzIH0gZnJvbSAnLi4vdXRpbC9jcmVhdGVFcnJvckNsYXNzJztcbmV4cG9ydCBjb25zdCBBamF4RXJyb3IgPSBjcmVhdGVFcnJvckNsYXNzKChfc3VwZXIpID0+IGZ1bmN0aW9uIEFqYXhFcnJvckltcGwobWVzc2FnZSwgeGhyLCByZXF1ZXN0KSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLm5hbWUgPSAnQWpheEVycm9yJztcbiAgICB0aGlzLnhociA9IHhocjtcbiAgICB0aGlzLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIHRoaXMuc3RhdHVzID0geGhyLnN0YXR1cztcbiAgICB0aGlzLnJlc3BvbnNlVHlwZSA9IHhoci5yZXNwb25zZVR5cGU7XG4gICAgbGV0IHJlc3BvbnNlO1xuICAgIHRyeSB7XG4gICAgICAgIHJlc3BvbnNlID0gZ2V0WEhSUmVzcG9uc2UoeGhyKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgfVxuICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcbn0pO1xuZXhwb3J0IGNvbnN0IEFqYXhUaW1lb3V0RXJyb3IgPSAoKCkgPT4ge1xuICAgIGZ1bmN0aW9uIEFqYXhUaW1lb3V0RXJyb3JJbXBsKHhociwgcmVxdWVzdCkge1xuICAgICAgICBBamF4RXJyb3IuY2FsbCh0aGlzLCAnYWpheCB0aW1lb3V0JywgeGhyLCByZXF1ZXN0KTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ0FqYXhUaW1lb3V0RXJyb3InO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgQWpheFRpbWVvdXRFcnJvckltcGwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShBamF4RXJyb3IucHJvdG90eXBlKTtcbiAgICByZXR1cm4gQWpheFRpbWVvdXRFcnJvckltcGw7XG59KSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3JzLmpzLm1hcCIsImltcG9ydCB7IF9fcmVzdCB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBBamF4UmVzcG9uc2UgfSBmcm9tICcuL0FqYXhSZXNwb25zZSc7XG5pbXBvcnQgeyBBamF4VGltZW91dEVycm9yLCBBamF4RXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XG5mdW5jdGlvbiBhamF4R2V0KHVybCwgaGVhZGVycykge1xuICAgIHJldHVybiBhamF4KHsgbWV0aG9kOiAnR0VUJywgdXJsLCBoZWFkZXJzIH0pO1xufVxuZnVuY3Rpb24gYWpheFBvc3QodXJsLCBib2R5LCBoZWFkZXJzKSB7XG4gICAgcmV0dXJuIGFqYXgoeyBtZXRob2Q6ICdQT1NUJywgdXJsLCBib2R5LCBoZWFkZXJzIH0pO1xufVxuZnVuY3Rpb24gYWpheERlbGV0ZSh1cmwsIGhlYWRlcnMpIHtcbiAgICByZXR1cm4gYWpheCh7IG1ldGhvZDogJ0RFTEVURScsIHVybCwgaGVhZGVycyB9KTtcbn1cbmZ1bmN0aW9uIGFqYXhQdXQodXJsLCBib2R5LCBoZWFkZXJzKSB7XG4gICAgcmV0dXJuIGFqYXgoeyBtZXRob2Q6ICdQVVQnLCB1cmwsIGJvZHksIGhlYWRlcnMgfSk7XG59XG5mdW5jdGlvbiBhamF4UGF0Y2godXJsLCBib2R5LCBoZWFkZXJzKSB7XG4gICAgcmV0dXJuIGFqYXgoeyBtZXRob2Q6ICdQQVRDSCcsIHVybCwgYm9keSwgaGVhZGVycyB9KTtcbn1cbmNvbnN0IG1hcFJlc3BvbnNlID0gbWFwKCh4KSA9PiB4LnJlc3BvbnNlKTtcbmZ1bmN0aW9uIGFqYXhHZXRKU09OKHVybCwgaGVhZGVycykge1xuICAgIHJldHVybiBtYXBSZXNwb25zZShhamF4KHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXJsLFxuICAgICAgICBoZWFkZXJzLFxuICAgIH0pKTtcbn1cbmV4cG9ydCBjb25zdCBhamF4ID0gKCgpID0+IHtcbiAgICBjb25zdCBjcmVhdGUgPSAodXJsT3JDb25maWcpID0+IHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdHlwZW9mIHVybE9yQ29uZmlnID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmxPckNvbmZpZyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogdXJsT3JDb25maWc7XG4gICAgICAgIHJldHVybiBmcm9tQWpheChjb25maWcpO1xuICAgIH07XG4gICAgY3JlYXRlLmdldCA9IGFqYXhHZXQ7XG4gICAgY3JlYXRlLnBvc3QgPSBhamF4UG9zdDtcbiAgICBjcmVhdGUuZGVsZXRlID0gYWpheERlbGV0ZTtcbiAgICBjcmVhdGUucHV0ID0gYWpheFB1dDtcbiAgICBjcmVhdGUucGF0Y2ggPSBhamF4UGF0Y2g7XG4gICAgY3JlYXRlLmdldEpTT04gPSBhamF4R2V0SlNPTjtcbiAgICByZXR1cm4gY3JlYXRlO1xufSkoKTtcbmNvbnN0IFVQTE9BRCA9ICd1cGxvYWQnO1xuY29uc3QgRE9XTkxPQUQgPSAnZG93bmxvYWQnO1xuY29uc3QgTE9BRFNUQVJUID0gJ2xvYWRzdGFydCc7XG5jb25zdCBQUk9HUkVTUyA9ICdwcm9ncmVzcyc7XG5jb25zdCBMT0FEID0gJ2xvYWQnO1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21BamF4KGNvbmZpZykge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoZGVzdGluYXRpb24pID0+IHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgY29uc3QgeyBxdWVyeVBhcmFtcywgYm9keTogY29uZmlndXJlZEJvZHksIGhlYWRlcnM6IGNvbmZpZ3VyZWRIZWFkZXJzIH0gPSBjb25maWcsIHJlbWFpbmluZ0NvbmZpZyA9IF9fcmVzdChjb25maWcsIFtcInF1ZXJ5UGFyYW1zXCIsIFwiYm9keVwiLCBcImhlYWRlcnNcIl0pO1xuICAgICAgICBsZXQgeyB1cmwgfSA9IHJlbWFpbmluZ0NvbmZpZztcbiAgICAgICAgaWYgKCF1cmwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3VybCBpcyByZXF1aXJlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChxdWVyeVBhcmFtcykge1xuICAgICAgICAgICAgbGV0IHNlYXJjaFBhcmFtcztcbiAgICAgICAgICAgIGlmICh1cmwuaW5jbHVkZXMoJz8nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gdXJsLnNwbGl0KCc/Jyk7XG4gICAgICAgICAgICAgICAgaWYgKDIgPCBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCB1cmwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhwYXJ0c1sxXSk7XG4gICAgICAgICAgICAgICAgbmV3IFVSTFNlYXJjaFBhcmFtcyhxdWVyeVBhcmFtcykuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4gc2VhcmNoUGFyYW1zLnNldChrZXksIHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgdXJsID0gcGFydHNbMF0gKyAnPycgKyBzZWFyY2hQYXJhbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJ5UGFyYW1zKTtcbiAgICAgICAgICAgICAgICB1cmwgPSB1cmwgKyAnPycgKyBzZWFyY2hQYXJhbXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHt9O1xuICAgICAgICBpZiAoY29uZmlndXJlZEhlYWRlcnMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZ3VyZWRIZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZ3VyZWRIZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1trZXkudG9Mb3dlckNhc2UoKV0gPSBjb25maWd1cmVkSGVhZGVyc1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvbmZpZy5jcm9zc0RvbWFpbiAmJiAhKCd4LXJlcXVlc3RlZC13aXRoJyBpbiBoZWFkZXJzKSkge1xuICAgICAgICAgICAgaGVhZGVyc1sneC1yZXF1ZXN0ZWQtd2l0aCddID0gJ1hNTEh0dHBSZXF1ZXN0JztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IHdpdGhDcmVkZW50aWFscywgeHNyZkNvb2tpZU5hbWUsIHhzcmZIZWFkZXJOYW1lIH0gPSByZW1haW5pbmdDb25maWc7XG4gICAgICAgIGlmICgod2l0aENyZWRlbnRpYWxzIHx8ICFyZW1haW5pbmdDb25maWcuY3Jvc3NEb21haW4pICYmIHhzcmZDb29raWVOYW1lICYmIHhzcmZIZWFkZXJOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCB4c3JmQ29va2llID0gKF9iID0gKF9hID0gZG9jdW1lbnQgPT09IG51bGwgfHwgZG9jdW1lbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKGAoXnw7XFxcXHMqKSgke3hzcmZDb29raWVOYW1lfSk9KFteO10qKWApKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBvcCgpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAnJztcbiAgICAgICAgICAgIGlmICh4c3JmQ29va2llKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVyc1t4c3JmSGVhZGVyTmFtZV0gPSB4c3JmQ29va2llO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJvZHkgPSBleHRyYWN0Q29udGVudFR5cGVBbmRNYXliZVNlcmlhbGl6ZUJvZHkoY29uZmlndXJlZEJvZHksIGhlYWRlcnMpO1xuICAgICAgICBjb25zdCBfcmVxdWVzdCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7IGFzeW5jOiB0cnVlLCBjcm9zc0RvbWFpbjogdHJ1ZSwgd2l0aENyZWRlbnRpYWxzOiBmYWxzZSwgbWV0aG9kOiAnR0VUJywgdGltZW91dDogMCwgcmVzcG9uc2VUeXBlOiAnanNvbicgfSwgcmVtYWluaW5nQ29uZmlnKSwgeyB1cmwsXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgYm9keSB9KTtcbiAgICAgICAgbGV0IHhocjtcbiAgICAgICAgeGhyID0gY29uZmlnLmNyZWF0ZVhIUiA/IGNvbmZpZy5jcmVhdGVYSFIoKSA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCB7IHByb2dyZXNzU3Vic2NyaWJlciwgaW5jbHVkZURvd25sb2FkUHJvZ3Jlc3MgPSBmYWxzZSwgaW5jbHVkZVVwbG9hZFByb2dyZXNzID0gZmFsc2UgfSA9IGNvbmZpZztcbiAgICAgICAgICAgIGNvbnN0IGFkZEVycm9yRXZlbnQgPSAodHlwZSwgZXJyb3JGYWN0b3J5KSA9PiB7XG4gICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gZXJyb3JGYWN0b3J5KCk7XG4gICAgICAgICAgICAgICAgICAgIChfYSA9IHByb2dyZXNzU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBwcm9ncmVzc1N1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByb2dyZXNzU3Vic2NyaWJlci5lcnJvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwocHJvZ3Jlc3NTdWJzY3JpYmVyLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhZGRFcnJvckV2ZW50KCd0aW1lb3V0JywgKCkgPT4gbmV3IEFqYXhUaW1lb3V0RXJyb3IoeGhyLCBfcmVxdWVzdCkpO1xuICAgICAgICAgICAgYWRkRXJyb3JFdmVudCgnYWJvcnQnLCAoKSA9PiBuZXcgQWpheEVycm9yKCdhYm9ydGVkJywgeGhyLCBfcmVxdWVzdCkpO1xuICAgICAgICAgICAgY29uc3QgY3JlYXRlUmVzcG9uc2UgPSAoZGlyZWN0aW9uLCBldmVudCkgPT4gbmV3IEFqYXhSZXNwb25zZShldmVudCwgeGhyLCBfcmVxdWVzdCwgYCR7ZGlyZWN0aW9ufV8ke2V2ZW50LnR5cGV9YCk7XG4gICAgICAgICAgICBjb25zdCBhZGRQcm9ncmVzc0V2ZW50ID0gKHRhcmdldCwgdHlwZSwgZGlyZWN0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLm5leHQoY3JlYXRlUmVzcG9uc2UoZGlyZWN0aW9uLCBldmVudCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChpbmNsdWRlVXBsb2FkUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICBbTE9BRFNUQVJULCBQUk9HUkVTUywgTE9BRF0uZm9yRWFjaCgodHlwZSkgPT4gYWRkUHJvZ3Jlc3NFdmVudCh4aHIudXBsb2FkLCB0eXBlLCBVUExPQUQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9ncmVzc1N1YnNjcmliZXIpIHtcbiAgICAgICAgICAgICAgICBbTE9BRFNUQVJULCBQUk9HUkVTU10uZm9yRWFjaCgodHlwZSkgPT4geGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIChlKSA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IHByb2dyZXNzU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBwcm9ncmVzc1N1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByb2dyZXNzU3Vic2NyaWJlci5uZXh0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChwcm9ncmVzc1N1YnNjcmliZXIsIGUpOyB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5jbHVkZURvd25sb2FkUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICBbTE9BRFNUQVJULCBQUk9HUkVTU10uZm9yRWFjaCgodHlwZSkgPT4gYWRkUHJvZ3Jlc3NFdmVudCh4aHIsIHR5cGUsIERPV05MT0FEKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBlbWl0RXJyb3IgPSAoc3RhdHVzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gJ2FqYXggZXJyb3InICsgKHN0YXR1cyA/ICcgJyArIHN0YXR1cyA6ICcnKTtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihuZXcgQWpheEVycm9yKG1zZywgeGhyLCBfcmVxdWVzdCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9IHByb2dyZXNzU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBwcm9ncmVzc1N1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByb2dyZXNzU3Vic2NyaWJlci5lcnJvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwocHJvZ3Jlc3NTdWJzY3JpYmVyLCBlKTtcbiAgICAgICAgICAgICAgICBlbWl0RXJyb3IoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoTE9BRCwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXR1cyB9ID0geGhyO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPCA0MDApIHtcbiAgICAgICAgICAgICAgICAgICAgKF9hID0gcHJvZ3Jlc3NTdWJzY3JpYmVyID09PSBudWxsIHx8IHByb2dyZXNzU3Vic2NyaWJlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJvZ3Jlc3NTdWJzY3JpYmVyLmNvbXBsZXRlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbChwcm9ncmVzc1N1YnNjcmliZXIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGNyZWF0ZVJlc3BvbnNlKERPV05MT0FELCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5uZXh0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIChfYiA9IHByb2dyZXNzU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBwcm9ncmVzc1N1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByb2dyZXNzU3Vic2NyaWJlci5lcnJvcikgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwocHJvZ3Jlc3NTdWJzY3JpYmVyLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGVtaXRFcnJvcihzdGF0dXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgdXNlciwgbWV0aG9kLCBhc3luYyB9ID0gX3JlcXVlc3Q7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgYXN5bmMsIHVzZXIsIF9yZXF1ZXN0LnBhc3N3b3JkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCBhc3luYyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgICB4aHIudGltZW91dCA9IF9yZXF1ZXN0LnRpbWVvdXQ7XG4gICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gX3JlcXVlc3QucmVzcG9uc2VUeXBlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBfcmVxdWVzdC53aXRoQ3JlZGVudGlhbHM7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gaGVhZGVycykge1xuICAgICAgICAgICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYm9keSkge1xuICAgICAgICAgICAgeGhyLnNlbmQoYm9keSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyICYmIHhoci5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBleHRyYWN0Q29udGVudFR5cGVBbmRNYXliZVNlcmlhbGl6ZUJvZHkoYm9keSwgaGVhZGVycykge1xuICAgIHZhciBfYTtcbiAgICBpZiAoIWJvZHkgfHxcbiAgICAgICAgdHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgIGlzRm9ybURhdGEoYm9keSkgfHxcbiAgICAgICAgaXNVUkxTZWFyY2hQYXJhbXMoYm9keSkgfHxcbiAgICAgICAgaXNBcnJheUJ1ZmZlcihib2R5KSB8fFxuICAgICAgICBpc0ZpbGUoYm9keSkgfHxcbiAgICAgICAgaXNCbG9iKGJvZHkpIHx8XG4gICAgICAgIGlzUmVhZGFibGVTdHJlYW0oYm9keSkpIHtcbiAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuICAgIGlmIChpc0FycmF5QnVmZmVyVmlldyhib2R5KSkge1xuICAgICAgICByZXR1cm4gYm9keS5idWZmZXI7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaGVhZGVyc1snY29udGVudC10eXBlJ10gPSAoX2EgPSBoZWFkZXJzWydjb250ZW50LXR5cGUnXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogJ2FwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOCc7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBib2R5IHR5cGUnKTtcbn1cbmNvbnN0IF90b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5mdW5jdGlvbiB0b1N0cmluZ0NoZWNrKG9iaiwgbmFtZSkge1xuICAgIHJldHVybiBfdG9TdHJpbmcuY2FsbChvYmopID09PSBgW29iamVjdCAke25hbWV9XWA7XG59XG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyKGJvZHkpIHtcbiAgICByZXR1cm4gdG9TdHJpbmdDaGVjayhib2R5LCAnQXJyYXlCdWZmZXInKTtcbn1cbmZ1bmN0aW9uIGlzRmlsZShib2R5KSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nQ2hlY2soYm9keSwgJ0ZpbGUnKTtcbn1cbmZ1bmN0aW9uIGlzQmxvYihib2R5KSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nQ2hlY2soYm9keSwgJ0Jsb2InKTtcbn1cbmZ1bmN0aW9uIGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpIHtcbiAgICByZXR1cm4gdHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiBBcnJheUJ1ZmZlci5pc1ZpZXcoYm9keSk7XG59XG5mdW5jdGlvbiBpc0Zvcm1EYXRhKGJvZHkpIHtcbiAgICByZXR1cm4gdHlwZW9mIEZvcm1EYXRhICE9PSAndW5kZWZpbmVkJyAmJiBib2R5IGluc3RhbmNlb2YgRm9ybURhdGE7XG59XG5mdW5jdGlvbiBpc1VSTFNlYXJjaFBhcmFtcyhib2R5KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBVUkxTZWFyY2hQYXJhbXMgIT09ICd1bmRlZmluZWQnICYmIGJvZHkgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5mdW5jdGlvbiBpc1JlYWRhYmxlU3RyZWFtKGJvZHkpIHtcbiAgICByZXR1cm4gdHlwZW9mIFJlYWRhYmxlU3RyZWFtICE9PSAndW5kZWZpbmVkJyAmJiBib2R5IGluc3RhbmNlb2YgUmVhZGFibGVTdHJlYW07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hamF4LmpzLm1hcCIsImltcG9ydCB7IF9fcmVzdCB9IGZyb20gXCJ0c2xpYlwiO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi4vLi4vb3BlcmF0b3JzL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi8uLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gZnJvbUZldGNoKGlucHV0LCBpbml0V2l0aFNlbGVjdG9yID0ge30pIHtcbiAgICBjb25zdCB7IHNlbGVjdG9yIH0gPSBpbml0V2l0aFNlbGVjdG9yLCBpbml0ID0gX19yZXN0KGluaXRXaXRoU2VsZWN0b3IsIFtcInNlbGVjdG9yXCJdKTtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgICAgY29uc3QgeyBzaWduYWwgfSA9IGNvbnRyb2xsZXI7XG4gICAgICAgIGxldCBhYm9ydGFibGUgPSB0cnVlO1xuICAgICAgICBjb25zdCB7IHNpZ25hbDogb3V0ZXJTaWduYWwgfSA9IGluaXQ7XG4gICAgICAgIGlmIChvdXRlclNpZ25hbCkge1xuICAgICAgICAgICAgaWYgKG91dGVyU2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmFib3J0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvdXRlclNpZ25hbEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgb3V0ZXJTaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvdXRlclNpZ25hbEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuYWRkKCgpID0+IG91dGVyU2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb3V0ZXJTaWduYWxIYW5kbGVyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGVyU3Vic2NyaWJlckluaXQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGluaXQpLCB7IHNpZ25hbCB9KTtcbiAgICAgICAgY29uc3QgaGFuZGxlRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgICBhYm9ydGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgfTtcbiAgICAgICAgZmV0Y2goaW5wdXQsIHBlclN1YnNjcmliZXJJbml0KVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICBpbm5lckZyb20oc2VsZWN0b3IocmVzcG9uc2UpKS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWJvcnRhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9LCBoYW5kbGVFcnJvcikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWJvcnRhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goaGFuZGxlRXJyb3IpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGFib3J0YWJsZSkge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZldGNoLmpzLm1hcCIsImltcG9ydCB7IFN1YmplY3QsIEFub255bW91c1N1YmplY3QgfSBmcm9tICcuLi8uLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi8uLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi8uLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uLy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAnLi4vLi4vUmVwbGF5U3ViamVjdCc7XG5jb25zdCBERUZBVUxUX1dFQlNPQ0tFVF9DT05GSUcgPSB7XG4gICAgdXJsOiAnJyxcbiAgICBkZXNlcmlhbGl6ZXI6IChlKSA9PiBKU09OLnBhcnNlKGUuZGF0YSksXG4gICAgc2VyaWFsaXplcjogKHZhbHVlKSA9PiBKU09OLnN0cmluZ2lmeSh2YWx1ZSksXG59O1xuY29uc3QgV0VCU09DS0VUU1VCSkVDVF9JTlZBTElEX0VSUk9SX09CSkVDVCA9ICdXZWJTb2NrZXRTdWJqZWN0LmVycm9yIG11c3QgYmUgY2FsbGVkIHdpdGggYW4gb2JqZWN0IHdpdGggYW4gZXJyb3IgY29kZSwgYW5kIGFuIG9wdGlvbmFsIHJlYXNvbjogeyBjb2RlOiBudW1iZXIsIHJlYXNvbjogc3RyaW5nIH0nO1xuZXhwb3J0IGNsYXNzIFdlYlNvY2tldFN1YmplY3QgZXh0ZW5kcyBBbm9ueW1vdXNTdWJqZWN0IHtcbiAgICBjb25zdHJ1Y3Rvcih1cmxDb25maWdPclNvdXJjZSwgZGVzdGluYXRpb24pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gbnVsbDtcbiAgICAgICAgaWYgKHVybENvbmZpZ09yU291cmNlIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSB1cmxDb25maWdPclNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9ICh0aGlzLl9jb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1dFQlNPQ0tFVF9DT05GSUcpKTtcbiAgICAgICAgICAgIHRoaXMuX291dHB1dCA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHVybENvbmZpZ09yU291cmNlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGNvbmZpZy51cmwgPSB1cmxDb25maWdPclNvdXJjZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHVybENvbmZpZ09yU291cmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1cmxDb25maWdPclNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWdba2V5XSA9IHVybENvbmZpZ09yU291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNvbmZpZy5XZWJTb2NrZXRDdG9yICYmIFdlYlNvY2tldCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5XZWJTb2NrZXRDdG9yID0gV2ViU29ja2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIWNvbmZpZy5XZWJTb2NrZXRDdG9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBXZWJTb2NrZXQgY29uc3RydWN0b3IgY2FuIGJlIGZvdW5kJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbmV3IFJlcGxheVN1YmplY3QoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsaWZ0KG9wZXJhdG9yKSB7XG4gICAgICAgIGNvbnN0IHNvY2sgPSBuZXcgV2ViU29ja2V0U3ViamVjdCh0aGlzLl9jb25maWcsIHRoaXMuZGVzdGluYXRpb24pO1xuICAgICAgICBzb2NrLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHNvY2suc291cmNlID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHNvY2s7XG4gICAgfVxuICAgIF9yZXNldFN0YXRlKCkge1xuICAgICAgICB0aGlzLl9zb2NrZXQgPSBudWxsO1xuICAgICAgICBpZiAoIXRoaXMuc291cmNlKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbmV3IFJlcGxheVN1YmplY3QoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vdXRwdXQgPSBuZXcgU3ViamVjdCgpO1xuICAgIH1cbiAgICBtdWx0aXBsZXgoc3ViTXNnLCB1bnN1Yk1zZywgbWVzc2FnZUZpbHRlcikge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzZWxmLm5leHQoc3ViTXNnKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzZWxmLnN1YnNjcmliZSgoeCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlRmlsdGVyKHgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAoZXJyKSA9PiBvYnNlcnZlci5lcnJvcihlcnIpLCAoKSA9PiBvYnNlcnZlci5jb21wbGV0ZSgpKTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5uZXh0KHVuc3ViTXNnKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9jb25uZWN0U29ja2V0KCkge1xuICAgICAgICBjb25zdCB7IFdlYlNvY2tldEN0b3IsIHByb3RvY29sLCB1cmwsIGJpbmFyeVR5cGUgfSA9IHRoaXMuX2NvbmZpZztcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSB0aGlzLl9vdXRwdXQ7XG4gICAgICAgIGxldCBzb2NrZXQgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc29ja2V0ID0gcHJvdG9jb2wgPyBuZXcgV2ViU29ja2V0Q3Rvcih1cmwsIHByb3RvY29sKSA6IG5ldyBXZWJTb2NrZXRDdG9yKHVybCk7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQgPSBzb2NrZXQ7XG4gICAgICAgICAgICBpZiAoYmluYXJ5VHlwZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NvY2tldC5iaW5hcnlUeXBlID0gYmluYXJ5VHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHNvY2tldCAmJiBzb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc29ja2V0Lm9ub3BlbiA9IChldnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgX3NvY2tldCB9ID0gdGhpcztcbiAgICAgICAgICAgIGlmICghX3NvY2tldCkge1xuICAgICAgICAgICAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IG9wZW5PYnNlcnZlciB9ID0gdGhpcy5fY29uZmlnO1xuICAgICAgICAgICAgaWYgKG9wZW5PYnNlcnZlcikge1xuICAgICAgICAgICAgICAgIG9wZW5PYnNlcnZlci5uZXh0KGV2dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBxdWV1ZSA9IHRoaXMuZGVzdGluYXRpb247XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gU3Vic2NyaWJlci5jcmVhdGUoKHgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgc2VyaWFsaXplciB9ID0gdGhpcy5fY29uZmlnO1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ja2V0LnNlbmQoc2VyaWFsaXplcih4KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjbG9zaW5nT2JzZXJ2ZXIgfSA9IHRoaXMuX2NvbmZpZztcbiAgICAgICAgICAgICAgICBpZiAoY2xvc2luZ09ic2VydmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NpbmdPYnNlcnZlci5uZXh0KHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnIgJiYgZXJyLmNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc29ja2V0LmNsb3NlKGVyci5jb2RlLCBlcnIucmVhc29uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKG5ldyBUeXBlRXJyb3IoV0VCU09DS0VUU1VCSkVDVF9JTlZBTElEX0VSUk9SX09CSkVDVCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjbG9zaW5nT2JzZXJ2ZXIgfSA9IHRoaXMuX2NvbmZpZztcbiAgICAgICAgICAgICAgICBpZiAoY2xvc2luZ09ic2VydmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsb3NpbmdPYnNlcnZlci5uZXh0KHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHF1ZXVlICYmIHF1ZXVlIGluc3RhbmNlb2YgUmVwbGF5U3ViamVjdCkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5hZGQocXVldWUuc3Vic2NyaWJlKHRoaXMuZGVzdGluYXRpb24pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc29ja2V0Lm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZSk7XG4gICAgICAgIH07XG4gICAgICAgIHNvY2tldC5vbmNsb3NlID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcbiAgICAgICAgICAgIGNvbnN0IHsgY2xvc2VPYnNlcnZlciB9ID0gdGhpcy5fY29uZmlnO1xuICAgICAgICAgICAgaWYgKGNsb3NlT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICBjbG9zZU9ic2VydmVyLm5leHQoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZS53YXNDbGVhbikge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGVzZXJpYWxpemVyIH0gPSB0aGlzLl9jb25maWc7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChkZXNlcmlhbGl6ZXIoZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIF9zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgICAgICBjb25zdCB7IHNvdXJjZSB9ID0gdGhpcztcbiAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9zb2NrZXQpIHtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTb2NrZXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9vdXRwdXQuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICBzdWJzY3JpYmVyLmFkZCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IF9zb2NrZXQgfSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAodGhpcy5fb3V0cHV0Lm9ic2VydmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoX3NvY2tldCAmJiAoX3NvY2tldC5yZWFkeVN0YXRlID09PSAxIHx8IF9zb2NrZXQucmVhZHlTdGF0ZSA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3NvY2tldC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gc3Vic2NyaWJlcjtcbiAgICB9XG4gICAgdW5zdWJzY3JpYmUoKSB7XG4gICAgICAgIGNvbnN0IHsgX3NvY2tldCB9ID0gdGhpcztcbiAgICAgICAgaWYgKF9zb2NrZXQgJiYgKF9zb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSB8fCBfc29ja2V0LnJlYWR5U3RhdGUgPT09IDApKSB7XG4gICAgICAgICAgICBfc29ja2V0LmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVdlYlNvY2tldFN1YmplY3QuanMubWFwIiwiaW1wb3J0IHsgV2ViU29ja2V0U3ViamVjdCB9IGZyb20gJy4vV2ViU29ja2V0U3ViamVjdCc7XG5leHBvcnQgZnVuY3Rpb24gd2ViU29ja2V0KHVybENvbmZpZ09yU291cmNlKSB7XG4gICAgcmV0dXJuIG5ldyBXZWJTb2NrZXRTdWJqZWN0KHVybENvbmZpZ09yU291cmNlKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdlYlNvY2tldC5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gYXBwbHlNaXhpbnMoZGVyaXZlZEN0b3IsIGJhc2VDdG9ycykge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBiYXNlQ3RvcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uc3QgYmFzZUN0b3IgPSBiYXNlQ3RvcnNbaV07XG4gICAgICAgIGNvbnN0IHByb3BlcnR5S2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2VDdG9yLnByb3RvdHlwZSk7XG4gICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4yID0gcHJvcGVydHlLZXlzLmxlbmd0aDsgaiA8IGxlbjI7IGorKykge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IHByb3BlcnR5S2V5c1tqXTtcbiAgICAgICAgICAgIGRlcml2ZWRDdG9yLnByb3RvdHlwZVtuYW1lXSA9IGJhc2VDdG9yLnByb3RvdHlwZVtuYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcGx5TWl4aW5zLmpzLm1hcCJdLCJuYW1lcyI6WyJTeW1ib2xfb2JzZXJ2YWJsZSIsImhpZ2hlck9yZGVyUmVmQ291bnQiLCJsYXN0IiwiU3ltYm9sX2l0ZXJhdG9yIiwiaXRlcmF0b3IiLCJpc0FycmF5IiwiY29tYmluZUxhdGVzdCIsImNvbmNhdCIsIkRFRkFVTFRfQ09ORklHIiwiYXN5bmNTY2hlZHVsZXIiLCJtZXJnZSIsIm9uRXJyb3JSZXN1bWVOZXh0Iiwib25FcnJvclJlc3VtZU5leHRXaXRoIiwicGFydGl0aW9uIiwicmFjZSIsInppcCIsInppcFN0YXRpYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBQU8sU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFF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U0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtZQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM5RSxLQUFLLENBQUMsQ0FBQztZQUNQLENBQUM7QUF5Q0Q7WUFDTyxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUU7WUFDNUIsSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xGLElBQUksSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRSxPQUFPO1lBQ2xELFFBQVEsSUFBSSxFQUFFLFlBQVk7WUFDMUIsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDL0MsWUFBWSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNwRCxTQUFTO1lBQ1QsS0FBSyxDQUFDO1lBQ04sSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyx5QkFBeUIsR0FBRyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQzNGLENBQUM7QUF3Q0Q7WUFDTyxTQUFTLE9BQU8sQ0FBQyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxPQUFPLElBQUksWUFBWSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLENBQUM7QUFDRDtZQUNPLFNBQVMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUU7WUFDakUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDM0YsSUFBSSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDbEUsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxZQUFZLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxSCxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDOUksSUFBSSxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN0RixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1SCxJQUFJLFNBQVMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN0RCxJQUFJLFNBQVMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN0RCxJQUFJLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdEYsQ0FBQztBQU9EO1lBQ08sU0FBUyxhQUFhLENBQUMsQ0FBQyxFQUFFO1lBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQzNGLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdkMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLFFBQVEsS0FBSyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsWUFBWSxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyTixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxD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
