/* rxjs@7.4.0 */
System.register(['./rxjs-shared.js'], (function (exports) {
    'use strict';
    var Observable, Subscription, observeNotification, applyMixins, Subject, VirtualTimeScheduler, VirtualAction, nextNotification, errorNotification, COMPLETE_NOTIFICATION, animationFrameProvider, dateTimestampProvider, immediateProvider, intervalProvider, timeoutProvider, performanceTimestampProvider;
    return {
        setters: [function (module) {
            Observable = module.O;
            Subscription = module.S;
            observeNotification = module.o;
            applyMixins = module.a;
            Subject = module.b;
            VirtualTimeScheduler = module.V;
            VirtualAction = module.c;
            nextNotification = module.n;
            errorNotification = module.e;
            COMPLETE_NOTIFICATION = module.C;
            animationFrameProvider = module.d;
            dateTimestampProvider = module.f;
            immediateProvider = module.i;
            intervalProvider = module.g;
            timeoutProvider = module.t;
            performanceTimestampProvider = module.p;
        }],
        execute: (function () {

            class SubscriptionLog {
                constructor(subscribedFrame, unsubscribedFrame = Infinity) {
                    this.subscribedFrame = subscribedFrame;
                    this.unsubscribedFrame = unsubscribedFrame;
                }
            }

            class SubscriptionLoggable {
                constructor() {
                    this.subscriptions = [];
                }
                logSubscribedFrame() {
                    this.subscriptions.push(new SubscriptionLog(this.scheduler.now()));
                    return this.subscriptions.length - 1;
                }
                logUnsubscribedFrame(index) {
                    const subscriptionLogs = this.subscriptions;
                    const oldSubscriptionLog = subscriptionLogs[index];
                    subscriptionLogs[index] = new SubscriptionLog(oldSubscriptionLog.subscribedFrame, this.scheduler.now());
                }
            }

            class ColdObservable extends Observable {
                constructor(messages, scheduler) {
                    super(function (subscriber) {
                        const observable = this;
                        const index = observable.logSubscribedFrame();
                        const subscription = new Subscription();
                        subscription.add(new Subscription(() => {
                            observable.logUnsubscribedFrame(index);
                        }));
                        observable.scheduleMessages(subscriber);
                        return subscription;
                    });
                    this.messages = messages;
                    this.subscriptions = [];
                    this.scheduler = scheduler;
                }
                scheduleMessages(subscriber) {
                    const messagesLength = this.messages.length;
                    for (let i = 0; i < messagesLength; i++) {
                        const message = this.messages[i];
                        subscriber.add(this.scheduler.schedule((state) => {
                            const { message: { notification }, subscriber: destination } = state;
                            observeNotification(notification, destination);
                        }, message.frame, { message, subscriber }));
                    }
                }
            }
            applyMixins(ColdObservable, [SubscriptionLoggable]);

            class HotObservable extends Subject {
                constructor(messages, scheduler) {
                    super();
                    this.messages = messages;
                    this.subscriptions = [];
                    this.scheduler = scheduler;
                }
                _subscribe(subscriber) {
                    const subject = this;
                    const index = subject.logSubscribedFrame();
                    const subscription = new Subscription();
                    subscription.add(new Subscription(() => {
                        subject.logUnsubscribedFrame(index);
                    }));
                    subscription.add(super._subscribe(subscriber));
                    return subscription;
                }
                setup() {
                    const subject = this;
                    const messagesLength = subject.messages.length;
                    for (let i = 0; i < messagesLength; i++) {
                        (() => {
                            const { notification, frame } = subject.messages[i];
                            subject.scheduler.schedule(() => {
                                observeNotification(notification, subject);
                            }, frame);
                        })();
                    }
                }
            }
            applyMixins(HotObservable, [SubscriptionLoggable]);

            const defaultMaxFrame = 750;
            class TestScheduler extends VirtualTimeScheduler {
                constructor(assertDeepEqual) {
                    super(VirtualAction, defaultMaxFrame);
                    this.assertDeepEqual = assertDeepEqual;
                    this.hotObservables = [];
                    this.coldObservables = [];
                    this.flushTests = [];
                    this.runMode = false;
                }
                createTime(marbles) {
                    const indexOf = this.runMode ? marbles.trim().indexOf('|') : marbles.indexOf('|');
                    if (indexOf === -1) {
                        throw new Error('marble diagram for time should have a completion marker "|"');
                    }
                    return indexOf * TestScheduler.frameTimeFactor;
                }
                createColdObservable(marbles, values, error) {
                    if (marbles.indexOf('^') !== -1) {
                        throw new Error('cold observable cannot have subscription offset "^"');
                    }
                    if (marbles.indexOf('!') !== -1) {
                        throw new Error('cold observable cannot have unsubscription marker "!"');
                    }
                    const messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
                    const cold = new ColdObservable(messages, this);
                    this.coldObservables.push(cold);
                    return cold;
                }
                createHotObservable(marbles, values, error) {
                    if (marbles.indexOf('!') !== -1) {
                        throw new Error('hot observable cannot have unsubscription marker "!"');
                    }
                    const messages = TestScheduler.parseMarbles(marbles, values, error, undefined, this.runMode);
                    const subject = new HotObservable(messages, this);
                    this.hotObservables.push(subject);
                    return subject;
                }
                materializeInnerObservable(observable, outerFrame) {
                    const messages = [];
                    observable.subscribe((value) => {
                        messages.push({ frame: this.frame - outerFrame, notification: nextNotification(value) });
                    }, (error) => {
                        messages.push({ frame: this.frame - outerFrame, notification: errorNotification(error) });
                    }, () => {
                        messages.push({ frame: this.frame - outerFrame, notification: COMPLETE_NOTIFICATION });
                    });
                    return messages;
                }
                expectObservable(observable, subscriptionMarbles = null) {
                    const actual = [];
                    const flushTest = { actual, ready: false };
                    const subscriptionParsed = TestScheduler.parseMarblesAsSubscriptions(subscriptionMarbles, this.runMode);
                    const subscriptionFrame = subscriptionParsed.subscribedFrame === Infinity ? 0 : subscriptionParsed.subscribedFrame;
                    const unsubscriptionFrame = subscriptionParsed.unsubscribedFrame;
                    let subscription;
                    this.schedule(() => {
                        subscription = observable.subscribe((x) => {
                            const value = x instanceof Observable ? this.materializeInnerObservable(x, this.frame) : x;
                            actual.push({ frame: this.frame, notification: nextNotification(value) });
                        }, (error) => {
                            actual.push({ frame: this.frame, notification: errorNotification(error) });
                        }, () => {
                            actual.push({ frame: this.frame, notification: COMPLETE_NOTIFICATION });
                        });
                    }, subscriptionFrame);
                    if (unsubscriptionFrame !== Infinity) {
                        this.schedule(() => subscription.unsubscribe(), unsubscriptionFrame);
                    }
                    this.flushTests.push(flushTest);
                    const { runMode } = this;
                    return {
                        toBe(marbles, values, errorValue) {
                            flushTest.ready = true;
                            flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true, runMode);
                        },
                        toEqual: (other) => {
                            flushTest.ready = true;
                            flushTest.expected = [];
                            this.schedule(() => {
                                subscription = other.subscribe((x) => {
                                    const value = x instanceof Observable ? this.materializeInnerObservable(x, this.frame) : x;
                                    flushTest.expected.push({ frame: this.frame, notification: nextNotification(value) });
                                }, (error) => {
                                    flushTest.expected.push({ frame: this.frame, notification: errorNotification(error) });
                                }, () => {
                                    flushTest.expected.push({ frame: this.frame, notification: COMPLETE_NOTIFICATION });
                                });
                            }, subscriptionFrame);
                        },
                    };
                }
                expectSubscriptions(actualSubscriptionLogs) {
                    const flushTest = { actual: actualSubscriptionLogs, ready: false };
                    this.flushTests.push(flushTest);
                    const { runMode } = this;
                    return {
                        toBe(marblesOrMarblesArray) {
                            const marblesArray = typeof marblesOrMarblesArray === 'string' ? [marblesOrMarblesArray] : marblesOrMarblesArray;
                            flushTest.ready = true;
                            flushTest.expected = marblesArray
                                .map((marbles) => TestScheduler.parseMarblesAsSubscriptions(marbles, runMode))
                                .filter((marbles) => marbles.subscribedFrame !== Infinity);
                        },
                    };
                }
                flush() {
                    const hotObservables = this.hotObservables;
                    while (hotObservables.length > 0) {
                        hotObservables.shift().setup();
                    }
                    super.flush();
                    this.flushTests = this.flushTests.filter((test) => {
                        if (test.ready) {
                            this.assertDeepEqual(test.actual, test.expected);
                            return false;
                        }
                        return true;
                    });
                }
                static parseMarblesAsSubscriptions(marbles, runMode = false) {
                    if (typeof marbles !== 'string') {
                        return new SubscriptionLog(Infinity);
                    }
                    const characters = [...marbles];
                    const len = characters.length;
                    let groupStart = -1;
                    let subscriptionFrame = Infinity;
                    let unsubscriptionFrame = Infinity;
                    let frame = 0;
                    for (let i = 0; i < len; i++) {
                        let nextFrame = frame;
                        const advanceFrameBy = (count) => {
                            nextFrame += count * this.frameTimeFactor;
                        };
                        const c = characters[i];
                        switch (c) {
                            case ' ':
                                if (!runMode) {
                                    advanceFrameBy(1);
                                }
                                break;
                            case '-':
                                advanceFrameBy(1);
                                break;
                            case '(':
                                groupStart = frame;
                                advanceFrameBy(1);
                                break;
                            case ')':
                                groupStart = -1;
                                advanceFrameBy(1);
                                break;
                            case '^':
                                if (subscriptionFrame !== Infinity) {
                                    throw new Error("found a second subscription point '^' in a " + 'subscription marble diagram. There can only be one.');
                                }
                                subscriptionFrame = groupStart > -1 ? groupStart : frame;
                                advanceFrameBy(1);
                                break;
                            case '!':
                                if (unsubscriptionFrame !== Infinity) {
                                    throw new Error("found a second unsubscription point '!' in a " + 'subscription marble diagram. There can only be one.');
                                }
                                unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                                break;
                            default:
                                if (runMode && c.match(/^[0-9]$/)) {
                                    if (i === 0 || characters[i - 1] === ' ') {
                                        const buffer = characters.slice(i).join('');
                                        const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                                        if (match) {
                                            i += match[0].length - 1;
                                            const duration = parseFloat(match[1]);
                                            const unit = match[2];
                                            let durationInMs;
                                            switch (unit) {
                                                case 'ms':
                                                    durationInMs = duration;
                                                    break;
                                                case 's':
                                                    durationInMs = duration * 1000;
                                                    break;
                                                case 'm':
                                                    durationInMs = duration * 1000 * 60;
                                                    break;
                                            }
                                            advanceFrameBy(durationInMs / this.frameTimeFactor);
                                            break;
                                        }
                                    }
                                }
                                throw new Error("there can only be '^' and '!' markers in a " + "subscription marble diagram. Found instead '" + c + "'.");
                        }
                        frame = nextFrame;
                    }
                    if (unsubscriptionFrame < 0) {
                        return new SubscriptionLog(subscriptionFrame);
                    }
                    else {
                        return new SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
                    }
                }
                static parseMarbles(marbles, values, errorValue, materializeInnerObservables = false, runMode = false) {
                    if (marbles.indexOf('!') !== -1) {
                        throw new Error('conventional marble diagrams cannot have the ' + 'unsubscription marker "!"');
                    }
                    const characters = [...marbles];
                    const len = characters.length;
                    const testMessages = [];
                    const subIndex = runMode ? marbles.replace(/^[ ]+/, '').indexOf('^') : marbles.indexOf('^');
                    let frame = subIndex === -1 ? 0 : subIndex * -this.frameTimeFactor;
                    const getValue = typeof values !== 'object'
                        ? (x) => x
                        : (x) => {
                            if (materializeInnerObservables && values[x] instanceof ColdObservable) {
                                return values[x].messages;
                            }
                            return values[x];
                        };
                    let groupStart = -1;
                    for (let i = 0; i < len; i++) {
                        let nextFrame = frame;
                        const advanceFrameBy = (count) => {
                            nextFrame += count * this.frameTimeFactor;
                        };
                        let notification;
                        const c = characters[i];
                        switch (c) {
                            case ' ':
                                if (!runMode) {
                                    advanceFrameBy(1);
                                }
                                break;
                            case '-':
                                advanceFrameBy(1);
                                break;
                            case '(':
                                groupStart = frame;
                                advanceFrameBy(1);
                                break;
                            case ')':
                                groupStart = -1;
                                advanceFrameBy(1);
                                break;
                            case '|':
                                notification = COMPLETE_NOTIFICATION;
                                advanceFrameBy(1);
                                break;
                            case '^':
                                advanceFrameBy(1);
                                break;
                            case '#':
                                notification = errorNotification(errorValue || 'error');
                                advanceFrameBy(1);
                                break;
                            default:
                                if (runMode && c.match(/^[0-9]$/)) {
                                    if (i === 0 || characters[i - 1] === ' ') {
                                        const buffer = characters.slice(i).join('');
                                        const match = buffer.match(/^([0-9]+(?:\.[0-9]+)?)(ms|s|m) /);
                                        if (match) {
                                            i += match[0].length - 1;
                                            const duration = parseFloat(match[1]);
                                            const unit = match[2];
                                            let durationInMs;
                                            switch (unit) {
                                                case 'ms':
                                                    durationInMs = duration;
                                                    break;
                                                case 's':
                                                    durationInMs = duration * 1000;
                                                    break;
                                                case 'm':
                                                    durationInMs = duration * 1000 * 60;
                                                    break;
                                            }
                                            advanceFrameBy(durationInMs / this.frameTimeFactor);
                                            break;
                                        }
                                    }
                                }
                                notification = nextNotification(getValue(c));
                                advanceFrameBy(1);
                                break;
                        }
                        if (notification) {
                            testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification });
                        }
                        frame = nextFrame;
                    }
                    return testMessages;
                }
                createAnimator() {
                    if (!this.runMode) {
                        throw new Error('animate() must only be used in run mode');
                    }
                    let lastHandle = 0;
                    let map;
                    const delegate = {
                        requestAnimationFrame(callback) {
                            if (!map) {
                                throw new Error('animate() was not called within run()');
                            }
                            const handle = ++lastHandle;
                            map.set(handle, callback);
                            return handle;
                        },
                        cancelAnimationFrame(handle) {
                            if (!map) {
                                throw new Error('animate() was not called within run()');
                            }
                            map.delete(handle);
                        },
                    };
                    const animate = (marbles) => {
                        if (map) {
                            throw new Error('animate() must not be called more than once within run()');
                        }
                        if (/[|#]/.test(marbles)) {
                            throw new Error('animate() must not complete or error');
                        }
                        map = new Map();
                        const messages = TestScheduler.parseMarbles(marbles, undefined, undefined, undefined, true);
                        for (const message of messages) {
                            this.schedule(() => {
                                const now = this.now();
                                const callbacks = Array.from(map.values());
                                map.clear();
                                for (const callback of callbacks) {
                                    callback(now);
                                }
                            }, message.frame);
                        }
                    };
                    return { animate, delegate };
                }
                createDelegates() {
                    let lastHandle = 0;
                    const scheduleLookup = new Map();
                    const run = () => {
                        const now = this.now();
                        const scheduledRecords = Array.from(scheduleLookup.values());
                        const scheduledRecordsDue = scheduledRecords.filter(({ due }) => due <= now);
                        const dueImmediates = scheduledRecordsDue.filter(({ type }) => type === 'immediate');
                        if (dueImmediates.length > 0) {
                            const { handle, handler } = dueImmediates[0];
                            scheduleLookup.delete(handle);
                            handler();
                            return;
                        }
                        const dueIntervals = scheduledRecordsDue.filter(({ type }) => type === 'interval');
                        if (dueIntervals.length > 0) {
                            const firstDueInterval = dueIntervals[0];
                            const { duration, handler } = firstDueInterval;
                            firstDueInterval.due = now + duration;
                            firstDueInterval.subscription = this.schedule(run, duration);
                            handler();
                            return;
                        }
                        const dueTimeouts = scheduledRecordsDue.filter(({ type }) => type === 'timeout');
                        if (dueTimeouts.length > 0) {
                            const { handle, handler } = dueTimeouts[0];
                            scheduleLookup.delete(handle);
                            handler();
                            return;
                        }
                        throw new Error('Expected a due immediate or interval');
                    };
                    const immediate = {
                        setImmediate: (handler) => {
                            const handle = ++lastHandle;
                            scheduleLookup.set(handle, {
                                due: this.now(),
                                duration: 0,
                                handle,
                                handler,
                                subscription: this.schedule(run, 0),
                                type: 'immediate',
                            });
                            return handle;
                        },
                        clearImmediate: (handle) => {
                            const value = scheduleLookup.get(handle);
                            if (value) {
                                value.subscription.unsubscribe();
                                scheduleLookup.delete(handle);
                            }
                        },
                    };
                    const interval = {
                        setInterval: (handler, duration = 0) => {
                            const handle = ++lastHandle;
                            scheduleLookup.set(handle, {
                                due: this.now() + duration,
                                duration,
                                handle,
                                handler,
                                subscription: this.schedule(run, duration),
                                type: 'interval',
                            });
                            return handle;
                        },
                        clearInterval: (handle) => {
                            const value = scheduleLookup.get(handle);
                            if (value) {
                                value.subscription.unsubscribe();
                                scheduleLookup.delete(handle);
                            }
                        },
                    };
                    const timeout = {
                        setTimeout: (handler, duration = 0) => {
                            const handle = ++lastHandle;
                            scheduleLookup.set(handle, {
                                due: this.now() + duration,
                                duration,
                                handle,
                                handler,
                                subscription: this.schedule(run, duration),
                                type: 'timeout',
                            });
                            return handle;
                        },
                        clearTimeout: (handle) => {
                            const value = scheduleLookup.get(handle);
                            if (value) {
                                value.subscription.unsubscribe();
                                scheduleLookup.delete(handle);
                            }
                        },
                    };
                    return { immediate, interval, timeout };
                }
                run(callback) {
                    const prevFrameTimeFactor = TestScheduler.frameTimeFactor;
                    const prevMaxFrames = this.maxFrames;
                    TestScheduler.frameTimeFactor = 1;
                    this.maxFrames = Infinity;
                    this.runMode = true;
                    const animator = this.createAnimator();
                    const delegates = this.createDelegates();
                    animationFrameProvider.delegate = animator.delegate;
                    dateTimestampProvider.delegate = this;
                    immediateProvider.delegate = delegates.immediate;
                    intervalProvider.delegate = delegates.interval;
                    timeoutProvider.delegate = delegates.timeout;
                    performanceTimestampProvider.delegate = this;
                    const helpers = {
                        cold: this.createColdObservable.bind(this),
                        hot: this.createHotObservable.bind(this),
                        flush: this.flush.bind(this),
                        time: this.createTime.bind(this),
                        expectObservable: this.expectObservable.bind(this),
                        expectSubscriptions: this.expectSubscriptions.bind(this),
                        animate: animator.animate,
                    };
                    try {
                        const ret = callback(helpers);
                        this.flush();
                        return ret;
                    }
                    finally {
                        TestScheduler.frameTimeFactor = prevFrameTimeFactor;
                        this.maxFrames = prevMaxFrames;
                        this.runMode = false;
                        animationFrameProvider.delegate = undefined;
                        dateTimestampProvider.delegate = undefined;
                        immediateProvider.delegate = undefined;
                        intervalProvider.delegate = undefined;
                        timeoutProvider.delegate = undefined;
                        performanceTimestampProvider.delegate = undefined;
                    }
                }
            } exports('T', TestScheduler);
            TestScheduler.frameTimeFactor = 10;

        })
    };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnhqcy1zaGFyZWQyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC90ZXN0aW5nL1N1YnNjcmlwdGlvbkxvZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3Rlc3RpbmcvU3Vic2NyaXB0aW9uTG9nZ2FibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC90ZXN0aW5nL0NvbGRPYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdGVzdGluZy9Ib3RPYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdGVzdGluZy9UZXN0U2NoZWR1bGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBTdWJzY3JpcHRpb25Mb2cge1xuICAgIGNvbnN0cnVjdG9yKHN1YnNjcmliZWRGcmFtZSwgdW5zdWJzY3JpYmVkRnJhbWUgPSBJbmZpbml0eSkge1xuICAgICAgICB0aGlzLnN1YnNjcmliZWRGcmFtZSA9IHN1YnNjcmliZWRGcmFtZTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZWRGcmFtZSA9IHVuc3Vic2NyaWJlZEZyYW1lO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN1YnNjcmlwdGlvbkxvZy5qcy5tYXAiLCJpbXBvcnQgeyBTdWJzY3JpcHRpb25Mb2cgfSBmcm9tICcuL1N1YnNjcmlwdGlvbkxvZyc7XG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9uTG9nZ2FibGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBbXTtcbiAgICB9XG4gICAgbG9nU3Vic2NyaWJlZEZyYW1lKCkge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChuZXcgU3Vic2NyaXB0aW9uTG9nKHRoaXMuc2NoZWR1bGVyLm5vdygpKSk7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMubGVuZ3RoIC0gMTtcbiAgICB9XG4gICAgbG9nVW5zdWJzY3JpYmVkRnJhbWUoaW5kZXgpIHtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uTG9ncyA9IHRoaXMuc3Vic2NyaXB0aW9ucztcbiAgICAgICAgY29uc3Qgb2xkU3Vic2NyaXB0aW9uTG9nID0gc3Vic2NyaXB0aW9uTG9nc1tpbmRleF07XG4gICAgICAgIHN1YnNjcmlwdGlvbkxvZ3NbaW5kZXhdID0gbmV3IFN1YnNjcmlwdGlvbkxvZyhvbGRTdWJzY3JpcHRpb25Mb2cuc3Vic2NyaWJlZEZyYW1lLCB0aGlzLnNjaGVkdWxlci5ub3coKSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U3Vic2NyaXB0aW9uTG9nZ2FibGUuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxvZ2dhYmxlIH0gZnJvbSAnLi9TdWJzY3JpcHRpb25Mb2dnYWJsZSc7XG5pbXBvcnQgeyBhcHBseU1peGlucyB9IGZyb20gJy4uL3V0aWwvYXBwbHlNaXhpbnMnO1xuaW1wb3J0IHsgb2JzZXJ2ZU5vdGlmaWNhdGlvbiB9IGZyb20gJy4uL05vdGlmaWNhdGlvbic7XG5leHBvcnQgY2xhc3MgQ29sZE9ic2VydmFibGUgZXh0ZW5kcyBPYnNlcnZhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlcywgc2NoZWR1bGVyKSB7XG4gICAgICAgIHN1cGVyKGZ1bmN0aW9uIChzdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICBjb25zdCBvYnNlcnZhYmxlID0gdGhpcztcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gb2JzZXJ2YWJsZS5sb2dTdWJzY3JpYmVkRnJhbWUoKTtcbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5hZGQobmV3IFN1YnNjcmlwdGlvbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZS5sb2dVbnN1YnNjcmliZWRGcmFtZShpbmRleCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBvYnNlcnZhYmxlLnNjaGVkdWxlTWVzc2FnZXMoc3Vic2NyaWJlcik7XG4gICAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgfVxuICAgIHNjaGVkdWxlTWVzc2FnZXMoc3Vic2NyaWJlcikge1xuICAgICAgICBjb25zdCBtZXNzYWdlc0xlbmd0aCA9IHRoaXMubWVzc2FnZXMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc3NhZ2VzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VzW2ldO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQodGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoKHN0YXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBtZXNzYWdlOiB7IG5vdGlmaWNhdGlvbiB9LCBzdWJzY3JpYmVyOiBkZXN0aW5hdGlvbiB9ID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZU5vdGlmaWNhdGlvbihub3RpZmljYXRpb24sIGRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgIH0sIG1lc3NhZ2UuZnJhbWUsIHsgbWVzc2FnZSwgc3Vic2NyaWJlciB9KSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5hcHBseU1peGlucyhDb2xkT2JzZXJ2YWJsZSwgW1N1YnNjcmlwdGlvbkxvZ2dhYmxlXSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Db2xkT2JzZXJ2YWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTG9nZ2FibGUgfSBmcm9tICcuL1N1YnNjcmlwdGlvbkxvZ2dhYmxlJztcbmltcG9ydCB7IGFwcGx5TWl4aW5zIH0gZnJvbSAnLi4vdXRpbC9hcHBseU1peGlucyc7XG5pbXBvcnQgeyBvYnNlcnZlTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vTm90aWZpY2F0aW9uJztcbmV4cG9ydCBjbGFzcyBIb3RPYnNlcnZhYmxlIGV4dGVuZHMgU3ViamVjdCB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZXMsIHNjaGVkdWxlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXM7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICB9XG4gICAgX3N1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzO1xuICAgICAgICBjb25zdCBpbmRleCA9IHN1YmplY3QubG9nU3Vic2NyaWJlZEZyYW1lKCk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgc3Vic2NyaXB0aW9uLmFkZChuZXcgU3Vic2NyaXB0aW9uKCgpID0+IHtcbiAgICAgICAgICAgIHN1YmplY3QubG9nVW5zdWJzY3JpYmVkRnJhbWUoaW5kZXgpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHN1YnNjcmlwdGlvbi5hZGQoc3VwZXIuX3N1YnNjcmliZShzdWJzY3JpYmVyKSk7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfVxuICAgIHNldHVwKCkge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcztcbiAgICAgICAgY29uc3QgbWVzc2FnZXNMZW5ndGggPSBzdWJqZWN0Lm1lc3NhZ2VzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgbm90aWZpY2F0aW9uLCBmcmFtZSB9ID0gc3ViamVjdC5tZXNzYWdlc1tpXTtcbiAgICAgICAgICAgICAgICBzdWJqZWN0LnNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVOb3RpZmljYXRpb24obm90aWZpY2F0aW9uLCBzdWJqZWN0KTtcbiAgICAgICAgICAgICAgICB9LCBmcmFtZSk7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuYXBwbHlNaXhpbnMoSG90T2JzZXJ2YWJsZSwgW1N1YnNjcmlwdGlvbkxvZ2dhYmxlXSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ib3RPYnNlcnZhYmxlLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IENvbGRPYnNlcnZhYmxlIH0gZnJvbSAnLi9Db2xkT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBIb3RPYnNlcnZhYmxlIH0gZnJvbSAnLi9Ib3RPYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxvZyB9IGZyb20gJy4vU3Vic2NyaXB0aW9uTG9nJztcbmltcG9ydCB7IFZpcnR1YWxUaW1lU2NoZWR1bGVyLCBWaXJ0dWFsQWN0aW9uIH0gZnJvbSAnLi4vc2NoZWR1bGVyL1ZpcnR1YWxUaW1lU2NoZWR1bGVyJztcbmltcG9ydCB7IENPTVBMRVRFX05PVElGSUNBVElPTiwgZXJyb3JOb3RpZmljYXRpb24sIG5leHROb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb25GYWN0b3JpZXMnO1xuaW1wb3J0IHsgZGF0ZVRpbWVzdGFtcFByb3ZpZGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2RhdGVUaW1lc3RhbXBQcm92aWRlcic7XG5pbXBvcnQgeyBwZXJmb3JtYW5jZVRpbWVzdGFtcFByb3ZpZGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL3BlcmZvcm1hbmNlVGltZXN0YW1wUHJvdmlkZXInO1xuaW1wb3J0IHsgYW5pbWF0aW9uRnJhbWVQcm92aWRlciB9IGZyb20gJy4uL3NjaGVkdWxlci9hbmltYXRpb25GcmFtZVByb3ZpZGVyJztcbmltcG9ydCB7IGltbWVkaWF0ZVByb3ZpZGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2ltbWVkaWF0ZVByb3ZpZGVyJztcbmltcG9ydCB7IGludGVydmFsUHJvdmlkZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvaW50ZXJ2YWxQcm92aWRlcic7XG5pbXBvcnQgeyB0aW1lb3V0UHJvdmlkZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvdGltZW91dFByb3ZpZGVyJztcbmNvbnN0IGRlZmF1bHRNYXhGcmFtZSA9IDc1MDtcbmV4cG9ydCBjbGFzcyBUZXN0U2NoZWR1bGVyIGV4dGVuZHMgVmlydHVhbFRpbWVTY2hlZHVsZXIge1xuICAgIGNvbnN0cnVjdG9yKGFzc2VydERlZXBFcXVhbCkge1xuICAgICAgICBzdXBlcihWaXJ0dWFsQWN0aW9uLCBkZWZhdWx0TWF4RnJhbWUpO1xuICAgICAgICB0aGlzLmFzc2VydERlZXBFcXVhbCA9IGFzc2VydERlZXBFcXVhbDtcbiAgICAgICAgdGhpcy5ob3RPYnNlcnZhYmxlcyA9IFtdO1xuICAgICAgICB0aGlzLmNvbGRPYnNlcnZhYmxlcyA9IFtdO1xuICAgICAgICB0aGlzLmZsdXNoVGVzdHMgPSBbXTtcbiAgICAgICAgdGhpcy5ydW5Nb2RlID0gZmFsc2U7XG4gICAgfVxuICAgIGNyZWF0ZVRpbWUobWFyYmxlcykge1xuICAgICAgICBjb25zdCBpbmRleE9mID0gdGhpcy5ydW5Nb2RlID8gbWFyYmxlcy50cmltKCkuaW5kZXhPZignfCcpIDogbWFyYmxlcy5pbmRleE9mKCd8Jyk7XG4gICAgICAgIGlmIChpbmRleE9mID09PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXJibGUgZGlhZ3JhbSBmb3IgdGltZSBzaG91bGQgaGF2ZSBhIGNvbXBsZXRpb24gbWFya2VyIFwifFwiJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGV4T2YgKiBUZXN0U2NoZWR1bGVyLmZyYW1lVGltZUZhY3RvcjtcbiAgICB9XG4gICAgY3JlYXRlQ29sZE9ic2VydmFibGUobWFyYmxlcywgdmFsdWVzLCBlcnJvcikge1xuICAgICAgICBpZiAobWFyYmxlcy5pbmRleE9mKCdeJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbGQgb2JzZXJ2YWJsZSBjYW5ub3QgaGF2ZSBzdWJzY3JpcHRpb24gb2Zmc2V0IFwiXlwiJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hcmJsZXMuaW5kZXhPZignIScpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb2xkIG9ic2VydmFibGUgY2Fubm90IGhhdmUgdW5zdWJzY3JpcHRpb24gbWFya2VyIFwiIVwiJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlcyhtYXJibGVzLCB2YWx1ZXMsIGVycm9yLCB1bmRlZmluZWQsIHRoaXMucnVuTW9kZSk7XG4gICAgICAgIGNvbnN0IGNvbGQgPSBuZXcgQ29sZE9ic2VydmFibGUobWVzc2FnZXMsIHRoaXMpO1xuICAgICAgICB0aGlzLmNvbGRPYnNlcnZhYmxlcy5wdXNoKGNvbGQpO1xuICAgICAgICByZXR1cm4gY29sZDtcbiAgICB9XG4gICAgY3JlYXRlSG90T2JzZXJ2YWJsZShtYXJibGVzLCB2YWx1ZXMsIGVycm9yKSB7XG4gICAgICAgIGlmIChtYXJibGVzLmluZGV4T2YoJyEnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaG90IG9ic2VydmFibGUgY2Fubm90IGhhdmUgdW5zdWJzY3JpcHRpb24gbWFya2VyIFwiIVwiJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlcyhtYXJibGVzLCB2YWx1ZXMsIGVycm9yLCB1bmRlZmluZWQsIHRoaXMucnVuTW9kZSk7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgSG90T2JzZXJ2YWJsZShtZXNzYWdlcywgdGhpcyk7XG4gICAgICAgIHRoaXMuaG90T2JzZXJ2YWJsZXMucHVzaChzdWJqZWN0KTtcbiAgICAgICAgcmV0dXJuIHN1YmplY3Q7XG4gICAgfVxuICAgIG1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlKG9ic2VydmFibGUsIG91dGVyRnJhbWUpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgb2JzZXJ2YWJsZS5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUgLSBvdXRlckZyYW1lLCBub3RpZmljYXRpb246IG5leHROb3RpZmljYXRpb24odmFsdWUpIH0pO1xuICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSAtIG91dGVyRnJhbWUsIG5vdGlmaWNhdGlvbjogZXJyb3JOb3RpZmljYXRpb24oZXJyb3IpIH0pO1xuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUgLSBvdXRlckZyYW1lLCBub3RpZmljYXRpb246IENPTVBMRVRFX05PVElGSUNBVElPTiB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZXNzYWdlcztcbiAgICB9XG4gICAgZXhwZWN0T2JzZXJ2YWJsZShvYnNlcnZhYmxlLCBzdWJzY3JpcHRpb25NYXJibGVzID0gbnVsbCkge1xuICAgICAgICBjb25zdCBhY3R1YWwgPSBbXTtcbiAgICAgICAgY29uc3QgZmx1c2hUZXN0ID0geyBhY3R1YWwsIHJlYWR5OiBmYWxzZSB9O1xuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25QYXJzZWQgPSBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlc0FzU3Vic2NyaXB0aW9ucyhzdWJzY3JpcHRpb25NYXJibGVzLCB0aGlzLnJ1bk1vZGUpO1xuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25GcmFtZSA9IHN1YnNjcmlwdGlvblBhcnNlZC5zdWJzY3JpYmVkRnJhbWUgPT09IEluZmluaXR5ID8gMCA6IHN1YnNjcmlwdGlvblBhcnNlZC5zdWJzY3JpYmVkRnJhbWU7XG4gICAgICAgIGNvbnN0IHVuc3Vic2NyaXB0aW9uRnJhbWUgPSBzdWJzY3JpcHRpb25QYXJzZWQudW5zdWJzY3JpYmVkRnJhbWU7XG4gICAgICAgIGxldCBzdWJzY3JpcHRpb247XG4gICAgICAgIHRoaXMuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uID0gb2JzZXJ2YWJsZS5zdWJzY3JpYmUoKHgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHggaW5zdGFuY2VvZiBPYnNlcnZhYmxlID8gdGhpcy5tYXRlcmlhbGl6ZUlubmVyT2JzZXJ2YWJsZSh4LCB0aGlzLmZyYW1lKSA6IHg7XG4gICAgICAgICAgICAgICAgYWN0dWFsLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSwgbm90aWZpY2F0aW9uOiBuZXh0Tm90aWZpY2F0aW9uKHZhbHVlKSB9KTtcbiAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGFjdHVhbC5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUsIG5vdGlmaWNhdGlvbjogZXJyb3JOb3RpZmljYXRpb24oZXJyb3IpIH0pO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFjdHVhbC5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUsIG5vdGlmaWNhdGlvbjogQ09NUExFVEVfTk9USUZJQ0FUSU9OIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIHN1YnNjcmlwdGlvbkZyYW1lKTtcbiAgICAgICAgaWYgKHVuc3Vic2NyaXB0aW9uRnJhbWUgIT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKCgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpLCB1bnN1YnNjcmlwdGlvbkZyYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZsdXNoVGVzdHMucHVzaChmbHVzaFRlc3QpO1xuICAgICAgICBjb25zdCB7IHJ1bk1vZGUgfSA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b0JlKG1hcmJsZXMsIHZhbHVlcywgZXJyb3JWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGZsdXNoVGVzdC5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZmx1c2hUZXN0LmV4cGVjdGVkID0gVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXMobWFyYmxlcywgdmFsdWVzLCBlcnJvclZhbHVlLCB0cnVlLCBydW5Nb2RlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b0VxdWFsOiAob3RoZXIpID0+IHtcbiAgICAgICAgICAgICAgICBmbHVzaFRlc3QucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZsdXNoVGVzdC5leHBlY3RlZCA9IFtdO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24gPSBvdGhlci5zdWJzY3JpYmUoKHgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0geCBpbnN0YW5jZW9mIE9ic2VydmFibGUgPyB0aGlzLm1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlKHgsIHRoaXMuZnJhbWUpIDogeDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsdXNoVGVzdC5leHBlY3RlZC5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUsIG5vdGlmaWNhdGlvbjogbmV4dE5vdGlmaWNhdGlvbih2YWx1ZSkgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmx1c2hUZXN0LmV4cGVjdGVkLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSwgbm90aWZpY2F0aW9uOiBlcnJvck5vdGlmaWNhdGlvbihlcnJvcikgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsdXNoVGVzdC5leHBlY3RlZC5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUsIG5vdGlmaWNhdGlvbjogQ09NUExFVEVfTk9USUZJQ0FUSU9OIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCBzdWJzY3JpcHRpb25GcmFtZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBleHBlY3RTdWJzY3JpcHRpb25zKGFjdHVhbFN1YnNjcmlwdGlvbkxvZ3MpIHtcbiAgICAgICAgY29uc3QgZmx1c2hUZXN0ID0geyBhY3R1YWw6IGFjdHVhbFN1YnNjcmlwdGlvbkxvZ3MsIHJlYWR5OiBmYWxzZSB9O1xuICAgICAgICB0aGlzLmZsdXNoVGVzdHMucHVzaChmbHVzaFRlc3QpO1xuICAgICAgICBjb25zdCB7IHJ1bk1vZGUgfSA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b0JlKG1hcmJsZXNPck1hcmJsZXNBcnJheSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcmJsZXNBcnJheSA9IHR5cGVvZiBtYXJibGVzT3JNYXJibGVzQXJyYXkgPT09ICdzdHJpbmcnID8gW21hcmJsZXNPck1hcmJsZXNBcnJheV0gOiBtYXJibGVzT3JNYXJibGVzQXJyYXk7XG4gICAgICAgICAgICAgICAgZmx1c2hUZXN0LnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmbHVzaFRlc3QuZXhwZWN0ZWQgPSBtYXJibGVzQXJyYXlcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgobWFyYmxlcykgPT4gVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXNBc1N1YnNjcmlwdGlvbnMobWFyYmxlcywgcnVuTW9kZSkpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKG1hcmJsZXMpID0+IG1hcmJsZXMuc3Vic2NyaWJlZEZyYW1lICE9PSBJbmZpbml0eSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmbHVzaCgpIHtcbiAgICAgICAgY29uc3QgaG90T2JzZXJ2YWJsZXMgPSB0aGlzLmhvdE9ic2VydmFibGVzO1xuICAgICAgICB3aGlsZSAoaG90T2JzZXJ2YWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaG90T2JzZXJ2YWJsZXMuc2hpZnQoKS5zZXR1cCgpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmZsdXNoKCk7XG4gICAgICAgIHRoaXMuZmx1c2hUZXN0cyA9IHRoaXMuZmx1c2hUZXN0cy5maWx0ZXIoKHRlc3QpID0+IHtcbiAgICAgICAgICAgIGlmICh0ZXN0LnJlYWR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NlcnREZWVwRXF1YWwodGVzdC5hY3R1YWwsIHRlc3QuZXhwZWN0ZWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RhdGljIHBhcnNlTWFyYmxlc0FzU3Vic2NyaXB0aW9ucyhtYXJibGVzLCBydW5Nb2RlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtYXJibGVzICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25Mb2coSW5maW5pdHkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlcnMgPSBbLi4ubWFyYmxlc107XG4gICAgICAgIGNvbnN0IGxlbiA9IGNoYXJhY3RlcnMubGVuZ3RoO1xuICAgICAgICBsZXQgZ3JvdXBTdGFydCA9IC0xO1xuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uRnJhbWUgPSBJbmZpbml0eTtcbiAgICAgICAgbGV0IHVuc3Vic2NyaXB0aW9uRnJhbWUgPSBJbmZpbml0eTtcbiAgICAgICAgbGV0IGZyYW1lID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IG5leHRGcmFtZSA9IGZyYW1lO1xuICAgICAgICAgICAgY29uc3QgYWR2YW5jZUZyYW1lQnkgPSAoY291bnQpID0+IHtcbiAgICAgICAgICAgICAgICBuZXh0RnJhbWUgKz0gY291bnQgKiB0aGlzLmZyYW1lVGltZUZhY3RvcjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBjID0gY2hhcmFjdGVyc1tpXTtcbiAgICAgICAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICAgICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJ1bk1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnKCc6XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgPSBmcmFtZTtcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyknOlxuICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbkZyYW1lICE9PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZm91bmQgYSBzZWNvbmQgc3Vic2NyaXB0aW9uIHBvaW50ICdeJyBpbiBhIFwiICsgJ3N1YnNjcmlwdGlvbiBtYXJibGUgZGlhZ3JhbS4gVGhlcmUgY2FuIG9ubHkgYmUgb25lLicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbkZyYW1lID0gZ3JvdXBTdGFydCA+IC0xID8gZ3JvdXBTdGFydCA6IGZyYW1lO1xuICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnISc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lICE9PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZm91bmQgYSBzZWNvbmQgdW5zdWJzY3JpcHRpb24gcG9pbnQgJyEnIGluIGEgXCIgKyAnc3Vic2NyaXB0aW9uIG1hcmJsZSBkaWFncmFtLiBUaGVyZSBjYW4gb25seSBiZSBvbmUuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdW5zdWJzY3JpcHRpb25GcmFtZSA9IGdyb3VwU3RhcnQgPiAtMSA/IGdyb3VwU3RhcnQgOiBmcmFtZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bk1vZGUgJiYgYy5tYXRjaCgvXlswLTldJC8pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCBjaGFyYWN0ZXJzW2kgLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gY2hhcmFjdGVycy5zbGljZShpKS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGJ1ZmZlci5tYXRjaCgvXihbMC05XSsoPzpcXC5bMC05XSspPykobXN8c3xtKSAvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaSArPSBtYXRjaFswXS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1bml0ID0gbWF0Y2hbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkdXJhdGlvbkluTXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodW5pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb24gKiAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb24gKiAxMDAwICogNjA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KGR1cmF0aW9uSW5NcyAvIHRoaXMuZnJhbWVUaW1lRmFjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRoZXJlIGNhbiBvbmx5IGJlICdeJyBhbmQgJyEnIG1hcmtlcnMgaW4gYSBcIiArIFwic3Vic2NyaXB0aW9uIG1hcmJsZSBkaWFncmFtLiBGb3VuZCBpbnN0ZWFkICdcIiArIGMgKyBcIicuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnJhbWUgPSBuZXh0RnJhbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVuc3Vic2NyaXB0aW9uRnJhbWUgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvbkxvZyhzdWJzY3JpcHRpb25GcmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvbkxvZyhzdWJzY3JpcHRpb25GcmFtZSwgdW5zdWJzY3JpcHRpb25GcmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHBhcnNlTWFyYmxlcyhtYXJibGVzLCB2YWx1ZXMsIGVycm9yVmFsdWUsIG1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlcyA9IGZhbHNlLCBydW5Nb2RlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKG1hcmJsZXMuaW5kZXhPZignIScpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb252ZW50aW9uYWwgbWFyYmxlIGRpYWdyYW1zIGNhbm5vdCBoYXZlIHRoZSAnICsgJ3Vuc3Vic2NyaXB0aW9uIG1hcmtlciBcIiFcIicpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNoYXJhY3RlcnMgPSBbLi4ubWFyYmxlc107XG4gICAgICAgIGNvbnN0IGxlbiA9IGNoYXJhY3RlcnMubGVuZ3RoO1xuICAgICAgICBjb25zdCB0ZXN0TWVzc2FnZXMgPSBbXTtcbiAgICAgICAgY29uc3Qgc3ViSW5kZXggPSBydW5Nb2RlID8gbWFyYmxlcy5yZXBsYWNlKC9eWyBdKy8sICcnKS5pbmRleE9mKCdeJykgOiBtYXJibGVzLmluZGV4T2YoJ14nKTtcbiAgICAgICAgbGV0IGZyYW1lID0gc3ViSW5kZXggPT09IC0xID8gMCA6IHN1YkluZGV4ICogLXRoaXMuZnJhbWVUaW1lRmFjdG9yO1xuICAgICAgICBjb25zdCBnZXRWYWx1ZSA9IHR5cGVvZiB2YWx1ZXMgIT09ICdvYmplY3QnXG4gICAgICAgICAgICA/ICh4KSA9PiB4XG4gICAgICAgICAgICA6ICh4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGVyaWFsaXplSW5uZXJPYnNlcnZhYmxlcyAmJiB2YWx1ZXNbeF0gaW5zdGFuY2VvZiBDb2xkT2JzZXJ2YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3hdLm1lc3NhZ2VzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzW3hdO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgbGV0IGdyb3VwU3RhcnQgPSAtMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgbGV0IG5leHRGcmFtZSA9IGZyYW1lO1xuICAgICAgICAgICAgY29uc3QgYWR2YW5jZUZyYW1lQnkgPSAoY291bnQpID0+IHtcbiAgICAgICAgICAgICAgICBuZXh0RnJhbWUgKz0gY291bnQgKiB0aGlzLmZyYW1lVGltZUZhY3RvcjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgbm90aWZpY2F0aW9uO1xuICAgICAgICAgICAgY29uc3QgYyA9IGNoYXJhY3RlcnNbaV07XG4gICAgICAgICAgICBzd2l0Y2ggKGMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFydW5Nb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJygnOlxuICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0ID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcpJzpcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBTdGFydCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbiA9IENPTVBMRVRFX05PVElGSUNBVElPTjtcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvbiA9IGVycm9yTm90aWZpY2F0aW9uKGVycm9yVmFsdWUgfHwgJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAocnVuTW9kZSAmJiBjLm1hdGNoKC9eWzAtOV0kLykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwIHx8IGNoYXJhY3RlcnNbaSAtIDFdID09PSAnICcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBidWZmZXIgPSBjaGFyYWN0ZXJzLnNsaWNlKGkpLmpvaW4oJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gYnVmZmVyLm1hdGNoKC9eKFswLTldKyg/OlxcLlswLTldKyk/KShtc3xzfG0pIC8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpICs9IG1hdGNoWzBdLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHVuaXQgPSBtYXRjaFsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGR1cmF0aW9uSW5NcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh1bml0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdtcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbiAqIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdtJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbiAqIDEwMDAgKiA2MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoZHVyYXRpb25Jbk1zIC8gdGhpcy5mcmFtZVRpbWVGYWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uID0gbmV4dE5vdGlmaWNhdGlvbihnZXRWYWx1ZShjKSk7XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0ZXN0TWVzc2FnZXMucHVzaCh7IGZyYW1lOiBncm91cFN0YXJ0ID4gLTEgPyBncm91cFN0YXJ0IDogZnJhbWUsIG5vdGlmaWNhdGlvbiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZyYW1lID0gbmV4dEZyYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXN0TWVzc2FnZXM7XG4gICAgfVxuICAgIGNyZWF0ZUFuaW1hdG9yKCkge1xuICAgICAgICBpZiAoIXRoaXMucnVuTW9kZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhbmltYXRlKCkgbXVzdCBvbmx5IGJlIHVzZWQgaW4gcnVuIG1vZGUnKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbGFzdEhhbmRsZSA9IDA7XG4gICAgICAgIGxldCBtYXA7XG4gICAgICAgIGNvbnN0IGRlbGVnYXRlID0ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhbmltYXRlKCkgd2FzIG5vdCBjYWxsZWQgd2l0aGluIHJ1bigpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9ICsrbGFzdEhhbmRsZTtcbiAgICAgICAgICAgICAgICBtYXAuc2V0KGhhbmRsZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFtYXApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdhbmltYXRlKCkgd2FzIG5vdCBjYWxsZWQgd2l0aGluIHJ1bigpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1hcC5kZWxldGUoaGFuZGxlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGFuaW1hdGUgPSAobWFyYmxlcykgPT4ge1xuICAgICAgICAgICAgaWYgKG1hcCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYW5pbWF0ZSgpIG11c3Qgbm90IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSB3aXRoaW4gcnVuKCknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgvW3wjXS8udGVzdChtYXJibGVzKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignYW5pbWF0ZSgpIG11c3Qgbm90IGNvbXBsZXRlIG9yIGVycm9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzKG1hcmJsZXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdyA9IHRoaXMubm93KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IEFycmF5LmZyb20obWFwLnZhbHVlcygpKTtcbiAgICAgICAgICAgICAgICAgICAgbWFwLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhub3cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgbWVzc2FnZS5mcmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7IGFuaW1hdGUsIGRlbGVnYXRlIH07XG4gICAgfVxuICAgIGNyZWF0ZURlbGVnYXRlcygpIHtcbiAgICAgICAgbGV0IGxhc3RIYW5kbGUgPSAwO1xuICAgICAgICBjb25zdCBzY2hlZHVsZUxvb2t1cCA9IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gdGhpcy5ub3coKTtcbiAgICAgICAgICAgIGNvbnN0IHNjaGVkdWxlZFJlY29yZHMgPSBBcnJheS5mcm9tKHNjaGVkdWxlTG9va3VwLnZhbHVlcygpKTtcbiAgICAgICAgICAgIGNvbnN0IHNjaGVkdWxlZFJlY29yZHNEdWUgPSBzY2hlZHVsZWRSZWNvcmRzLmZpbHRlcigoeyBkdWUgfSkgPT4gZHVlIDw9IG5vdyk7XG4gICAgICAgICAgICBjb25zdCBkdWVJbW1lZGlhdGVzID0gc2NoZWR1bGVkUmVjb3Jkc0R1ZS5maWx0ZXIoKHsgdHlwZSB9KSA9PiB0eXBlID09PSAnaW1tZWRpYXRlJyk7XG4gICAgICAgICAgICBpZiAoZHVlSW1tZWRpYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBoYW5kbGUsIGhhbmRsZXIgfSA9IGR1ZUltbWVkaWF0ZXNbMF07XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVMb29rdXAuZGVsZXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgaGFuZGxlcigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGR1ZUludGVydmFscyA9IHNjaGVkdWxlZFJlY29yZHNEdWUuZmlsdGVyKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gJ2ludGVydmFsJyk7XG4gICAgICAgICAgICBpZiAoZHVlSW50ZXJ2YWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaXJzdER1ZUludGVydmFsID0gZHVlSW50ZXJ2YWxzWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgZHVyYXRpb24sIGhhbmRsZXIgfSA9IGZpcnN0RHVlSW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgZmlyc3REdWVJbnRlcnZhbC5kdWUgPSBub3cgKyBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICBmaXJzdER1ZUludGVydmFsLnN1YnNjcmlwdGlvbiA9IHRoaXMuc2NoZWR1bGUocnVuLCBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgaGFuZGxlcigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGR1ZVRpbWVvdXRzID0gc2NoZWR1bGVkUmVjb3Jkc0R1ZS5maWx0ZXIoKHsgdHlwZSB9KSA9PiB0eXBlID09PSAndGltZW91dCcpO1xuICAgICAgICAgICAgaWYgKGR1ZVRpbWVvdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGhhbmRsZSwgaGFuZGxlciB9ID0gZHVlVGltZW91dHNbMF07XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVMb29rdXAuZGVsZXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgaGFuZGxlcigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBkdWUgaW1tZWRpYXRlIG9yIGludGVydmFsJyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGltbWVkaWF0ZSA9IHtcbiAgICAgICAgICAgIHNldEltbWVkaWF0ZTogKGhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGUgPSArK2xhc3RIYW5kbGU7XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVMb29rdXAuc2V0KGhhbmRsZSwge1xuICAgICAgICAgICAgICAgICAgICBkdWU6IHRoaXMubm93KCksXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGUsXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbjogdGhpcy5zY2hlZHVsZShydW4sIDApLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1tZWRpYXRlJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlOiAoaGFuZGxlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzY2hlZHVsZUxvb2t1cC5nZXQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlTG9va3VwLmRlbGV0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGludGVydmFsID0ge1xuICAgICAgICAgICAgc2V0SW50ZXJ2YWw6IChoYW5kbGVyLCBkdXJhdGlvbiA9IDApID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGUgPSArK2xhc3RIYW5kbGU7XG4gICAgICAgICAgICAgICAgc2NoZWR1bGVMb29rdXAuc2V0KGhhbmRsZSwge1xuICAgICAgICAgICAgICAgICAgICBkdWU6IHRoaXMubm93KCkgKyBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZSxcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uOiB0aGlzLnNjaGVkdWxlKHJ1biwgZHVyYXRpb24pLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW50ZXJ2YWwnLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbDogKGhhbmRsZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2NoZWR1bGVMb29rdXAuZ2V0KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZUxvb2t1cC5kZWxldGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB0aW1lb3V0ID0ge1xuICAgICAgICAgICAgc2V0VGltZW91dDogKGhhbmRsZXIsIGR1cmF0aW9uID0gMCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9ICsrbGFzdEhhbmRsZTtcbiAgICAgICAgICAgICAgICBzY2hlZHVsZUxvb2t1cC5zZXQoaGFuZGxlLCB7XG4gICAgICAgICAgICAgICAgICAgIGR1ZTogdGhpcy5ub3coKSArIGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb246IHRoaXMuc2NoZWR1bGUocnVuLCBkdXJhdGlvbiksXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0aW1lb3V0JyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsZWFyVGltZW91dDogKGhhbmRsZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2NoZWR1bGVMb29rdXAuZ2V0KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZUxvb2t1cC5kZWxldGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4geyBpbW1lZGlhdGUsIGludGVydmFsLCB0aW1lb3V0IH07XG4gICAgfVxuICAgIHJ1bihjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBwcmV2RnJhbWVUaW1lRmFjdG9yID0gVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3I7XG4gICAgICAgIGNvbnN0IHByZXZNYXhGcmFtZXMgPSB0aGlzLm1heEZyYW1lcztcbiAgICAgICAgVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3IgPSAxO1xuICAgICAgICB0aGlzLm1heEZyYW1lcyA9IEluZmluaXR5O1xuICAgICAgICB0aGlzLnJ1bk1vZGUgPSB0cnVlO1xuICAgICAgICBjb25zdCBhbmltYXRvciA9IHRoaXMuY3JlYXRlQW5pbWF0b3IoKTtcbiAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gdGhpcy5jcmVhdGVEZWxlZ2F0ZXMoKTtcbiAgICAgICAgYW5pbWF0aW9uRnJhbWVQcm92aWRlci5kZWxlZ2F0ZSA9IGFuaW1hdG9yLmRlbGVnYXRlO1xuICAgICAgICBkYXRlVGltZXN0YW1wUHJvdmlkZXIuZGVsZWdhdGUgPSB0aGlzO1xuICAgICAgICBpbW1lZGlhdGVQcm92aWRlci5kZWxlZ2F0ZSA9IGRlbGVnYXRlcy5pbW1lZGlhdGU7XG4gICAgICAgIGludGVydmFsUHJvdmlkZXIuZGVsZWdhdGUgPSBkZWxlZ2F0ZXMuaW50ZXJ2YWw7XG4gICAgICAgIHRpbWVvdXRQcm92aWRlci5kZWxlZ2F0ZSA9IGRlbGVnYXRlcy50aW1lb3V0O1xuICAgICAgICBwZXJmb3JtYW5jZVRpbWVzdGFtcFByb3ZpZGVyLmRlbGVnYXRlID0gdGhpcztcbiAgICAgICAgY29uc3QgaGVscGVycyA9IHtcbiAgICAgICAgICAgIGNvbGQ6IHRoaXMuY3JlYXRlQ29sZE9ic2VydmFibGUuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGhvdDogdGhpcy5jcmVhdGVIb3RPYnNlcnZhYmxlLmJpbmQodGhpcyksXG4gICAgICAgICAgICBmbHVzaDogdGhpcy5mbHVzaC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgdGltZTogdGhpcy5jcmVhdGVUaW1lLmJpbmQodGhpcyksXG4gICAgICAgICAgICBleHBlY3RPYnNlcnZhYmxlOiB0aGlzLmV4cGVjdE9ic2VydmFibGUuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGV4cGVjdFN1YnNjcmlwdGlvbnM6IHRoaXMuZXhwZWN0U3Vic2NyaXB0aW9ucy5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgYW5pbWF0ZTogYW5pbWF0b3IuYW5pbWF0ZSxcbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGNhbGxiYWNrKGhlbHBlcnMpO1xuICAgICAgICAgICAgdGhpcy5mbHVzaCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIFRlc3RTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yID0gcHJldkZyYW1lVGltZUZhY3RvcjtcbiAgICAgICAgICAgIHRoaXMubWF4RnJhbWVzID0gcHJldk1heEZyYW1lcztcbiAgICAgICAgICAgIHRoaXMucnVuTW9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgYW5pbWF0aW9uRnJhbWVQcm92aWRlci5kZWxlZ2F0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGRhdGVUaW1lc3RhbXBQcm92aWRlci5kZWxlZ2F0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGltbWVkaWF0ZVByb3ZpZGVyLmRlbGVnYXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaW50ZXJ2YWxQcm92aWRlci5kZWxlZ2F0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRpbWVvdXRQcm92aWRlci5kZWxlZ2F0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHBlcmZvcm1hbmNlVGltZXN0YW1wUHJvdmlkZXIuZGVsZWdhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5UZXN0U2NoZWR1bGVyLmZyYW1lVGltZUZhY3RvciA9IDEwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VGVzdFNjaGVkdWxlci5qcy5tYXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQUFPLE1BQU0sZUFBZSxDQUFDO1lBQzdCLElBQUksV0FBVyxDQUFDLGVBQWUsRUFBRSxpQkFBaUIsR0FB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
