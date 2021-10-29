/* rxjs@6.6.7 */
System.register(['./rxjs-shared.js'], (function (exports) {
    'use strict';
    var Observable, Subscription, applyMixins, Subject, VirtualTimeScheduler, VirtualAction, Notification, AsyncScheduler;
    return {
        setters: [function (module) {
            Observable = module.O;
            Subscription = module.S;
            applyMixins = module.a;
            Subject = module.b;
            VirtualTimeScheduler = module.V;
            VirtualAction = module.c;
            Notification = module.N;
            AsyncScheduler = module.A;
        }],
        execute: (function () {

            class SubscriptionLog {
                constructor(subscribedFrame, unsubscribedFrame = Number.POSITIVE_INFINITY) {
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
                        subscriber.add(this.scheduler.schedule(({ message, subscriber }) => { message.notification.observe(subscriber); }, message.frame, { message, subscriber }));
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
                    for (var i = 0; i < messagesLength; i++) {
                        (() => {
                            var message = subject.messages[i];
                            subject.scheduler.schedule(() => { message.notification.observe(subject); }, message.frame);
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
                    const indexOf = marbles.indexOf('|');
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
                        messages.push({ frame: this.frame - outerFrame, notification: Notification.createNext(value) });
                    }, (err) => {
                        messages.push({ frame: this.frame - outerFrame, notification: Notification.createError(err) });
                    }, () => {
                        messages.push({ frame: this.frame - outerFrame, notification: Notification.createComplete() });
                    });
                    return messages;
                }
                expectObservable(observable, subscriptionMarbles = null) {
                    const actual = [];
                    const flushTest = { actual, ready: false };
                    const subscriptionParsed = TestScheduler.parseMarblesAsSubscriptions(subscriptionMarbles, this.runMode);
                    const subscriptionFrame = subscriptionParsed.subscribedFrame === Number.POSITIVE_INFINITY ?
                        0 : subscriptionParsed.subscribedFrame;
                    const unsubscriptionFrame = subscriptionParsed.unsubscribedFrame;
                    let subscription;
                    this.schedule(() => {
                        subscription = observable.subscribe(x => {
                            let value = x;
                            if (x instanceof Observable) {
                                value = this.materializeInnerObservable(value, this.frame);
                            }
                            actual.push({ frame: this.frame, notification: Notification.createNext(value) });
                        }, (err) => {
                            actual.push({ frame: this.frame, notification: Notification.createError(err) });
                        }, () => {
                            actual.push({ frame: this.frame, notification: Notification.createComplete() });
                        });
                    }, subscriptionFrame);
                    if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
                        this.schedule(() => subscription.unsubscribe(), unsubscriptionFrame);
                    }
                    this.flushTests.push(flushTest);
                    const { runMode } = this;
                    return {
                        toBe(marbles, values, errorValue) {
                            flushTest.ready = true;
                            flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true, runMode);
                        }
                    };
                }
                expectSubscriptions(actualSubscriptionLogs) {
                    const flushTest = { actual: actualSubscriptionLogs, ready: false };
                    this.flushTests.push(flushTest);
                    const { runMode } = this;
                    return {
                        toBe(marbles) {
                            const marblesArray = (typeof marbles === 'string') ? [marbles] : marbles;
                            flushTest.ready = true;
                            flushTest.expected = marblesArray.map(marbles => TestScheduler.parseMarblesAsSubscriptions(marbles, runMode));
                        }
                    };
                }
                flush() {
                    const hotObservables = this.hotObservables;
                    while (hotObservables.length > 0) {
                        hotObservables.shift().setup();
                    }
                    super.flush();
                    this.flushTests = this.flushTests.filter(test => {
                        if (test.ready) {
                            this.assertDeepEqual(test.actual, test.expected);
                            return false;
                        }
                        return true;
                    });
                }
                static parseMarblesAsSubscriptions(marbles, runMode = false) {
                    if (typeof marbles !== 'string') {
                        return new SubscriptionLog(Number.POSITIVE_INFINITY);
                    }
                    const len = marbles.length;
                    let groupStart = -1;
                    let subscriptionFrame = Number.POSITIVE_INFINITY;
                    let unsubscriptionFrame = Number.POSITIVE_INFINITY;
                    let frame = 0;
                    for (let i = 0; i < len; i++) {
                        let nextFrame = frame;
                        const advanceFrameBy = (count) => {
                            nextFrame += count * this.frameTimeFactor;
                        };
                        const c = marbles[i];
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
                                if (subscriptionFrame !== Number.POSITIVE_INFINITY) {
                                    throw new Error('found a second subscription point \'^\' in a ' +
                                        'subscription marble diagram. There can only be one.');
                                }
                                subscriptionFrame = groupStart > -1 ? groupStart : frame;
                                advanceFrameBy(1);
                                break;
                            case '!':
                                if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
                                    throw new Error('found a second subscription point \'^\' in a ' +
                                        'subscription marble diagram. There can only be one.');
                                }
                                unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                                break;
                            default:
                                if (runMode && c.match(/^[0-9]$/)) {
                                    if (i === 0 || marbles[i - 1] === ' ') {
                                        const buffer = marbles.slice(i);
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
                                throw new Error('there can only be \'^\' and \'!\' markers in a ' +
                                    'subscription marble diagram. Found instead \'' + c + '\'.');
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
                        throw new Error('conventional marble diagrams cannot have the ' +
                            'unsubscription marker "!"');
                    }
                    const len = marbles.length;
                    const testMessages = [];
                    const subIndex = runMode ? marbles.replace(/^[ ]+/, '').indexOf('^') : marbles.indexOf('^');
                    let frame = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
                    const getValue = typeof values !== 'object' ?
                        (x) => x :
                        (x) => {
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
                        const c = marbles[i];
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
                                notification = Notification.createComplete();
                                advanceFrameBy(1);
                                break;
                            case '^':
                                advanceFrameBy(1);
                                break;
                            case '#':
                                notification = Notification.createError(errorValue || 'error');
                                advanceFrameBy(1);
                                break;
                            default:
                                if (runMode && c.match(/^[0-9]$/)) {
                                    if (i === 0 || marbles[i - 1] === ' ') {
                                        const buffer = marbles.slice(i);
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
                                notification = Notification.createNext(getValue(c));
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
                run(callback) {
                    const prevFrameTimeFactor = TestScheduler.frameTimeFactor;
                    const prevMaxFrames = this.maxFrames;
                    TestScheduler.frameTimeFactor = 1;
                    this.maxFrames = Number.POSITIVE_INFINITY;
                    this.runMode = true;
                    AsyncScheduler.delegate = this;
                    const helpers = {
                        cold: this.createColdObservable.bind(this),
                        hot: this.createHotObservable.bind(this),
                        flush: this.flush.bind(this),
                        expectObservable: this.expectObservable.bind(this),
                        expectSubscriptions: this.expectSubscriptions.bind(this),
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
                        AsyncScheduler.delegate = undefined;
                    }
                }
            } exports('T', TestScheduler);

        })
    };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnhqcy1zaGFyZWQyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtMjAxNS9pbnRlcm5hbC90ZXN0aW5nL1N1YnNjcmlwdGlvbkxvZy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL19lc20yMDE1L2ludGVybmFsL3Rlc3RpbmcvU3Vic2NyaXB0aW9uTG9nZ2FibGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9fZXNtMjAxNS9pbnRlcm5hbC90ZXN0aW5nL0NvbGRPYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTIwMTUvaW50ZXJuYWwvdGVzdGluZy9Ib3RPYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvX2VzbTIwMTUvaW50ZXJuYWwvdGVzdGluZy9UZXN0U2NoZWR1bGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBTdWJzY3JpcHRpb25Mb2cge1xuICAgIGNvbnN0cnVjdG9yKHN1YnNjcmliZWRGcmFtZSwgdW5zdWJzY3JpYmVkRnJhbWUgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVkRnJhbWUgPSBzdWJzY3JpYmVkRnJhbWU7XG4gICAgICAgIHRoaXMudW5zdWJzY3JpYmVkRnJhbWUgPSB1bnN1YnNjcmliZWRGcmFtZTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdWJzY3JpcHRpb25Mb2cuanMubWFwIiwiaW1wb3J0IHsgU3Vic2NyaXB0aW9uTG9nIH0gZnJvbSAnLi9TdWJzY3JpcHRpb25Mb2cnO1xuZXhwb3J0IGNsYXNzIFN1YnNjcmlwdGlvbkxvZ2dhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gICAgfVxuICAgIGxvZ1N1YnNjcmliZWRGcmFtZSgpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2gobmV3IFN1YnNjcmlwdGlvbkxvZyh0aGlzLnNjaGVkdWxlci5ub3coKSkpO1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmxlbmd0aCAtIDE7XG4gICAgfVxuICAgIGxvZ1Vuc3Vic2NyaWJlZEZyYW1lKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbkxvZ3MgPSB0aGlzLnN1YnNjcmlwdGlvbnM7XG4gICAgICAgIGNvbnN0IG9sZFN1YnNjcmlwdGlvbkxvZyA9IHN1YnNjcmlwdGlvbkxvZ3NbaW5kZXhdO1xuICAgICAgICBzdWJzY3JpcHRpb25Mb2dzW2luZGV4XSA9IG5ldyBTdWJzY3JpcHRpb25Mb2cob2xkU3Vic2NyaXB0aW9uTG9nLnN1YnNjcmliZWRGcmFtZSwgdGhpcy5zY2hlZHVsZXIubm93KCkpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN1YnNjcmlwdGlvbkxvZ2dhYmxlLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25Mb2dnYWJsZSB9IGZyb20gJy4vU3Vic2NyaXB0aW9uTG9nZ2FibGUnO1xuaW1wb3J0IHsgYXBwbHlNaXhpbnMgfSBmcm9tICcuLi91dGlsL2FwcGx5TWl4aW5zJztcbmV4cG9ydCBjbGFzcyBDb2xkT2JzZXJ2YWJsZSBleHRlbmRzIE9ic2VydmFibGUge1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2VzLCBzY2hlZHVsZXIpIHtcbiAgICAgICAgc3VwZXIoZnVuY3Rpb24gKHN1YnNjcmliZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmFibGUgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBvYnNlcnZhYmxlLmxvZ1N1YnNjcmliZWRGcmFtZSgpO1xuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmFkZChuZXcgU3Vic2NyaXB0aW9uKCgpID0+IHtcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlLmxvZ1Vuc3Vic2NyaWJlZEZyYW1lKGluZGV4KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIG9ic2VydmFibGUuc2NoZWR1bGVNZXNzYWdlcyhzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXM7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICB9XG4gICAgc2NoZWR1bGVNZXNzYWdlcyhzdWJzY3JpYmVyKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzTGVuZ3RoID0gdGhpcy5tZXNzYWdlcy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzc2FnZXNMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRoaXMubWVzc2FnZXNbaV07XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmFkZCh0aGlzLnNjaGVkdWxlci5zY2hlZHVsZSgoeyBtZXNzYWdlLCBzdWJzY3JpYmVyIH0pID0+IHsgbWVzc2FnZS5ub3RpZmljYXRpb24ub2JzZXJ2ZShzdWJzY3JpYmVyKTsgfSwgbWVzc2FnZS5mcmFtZSwgeyBtZXNzYWdlLCBzdWJzY3JpYmVyIH0pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFwcGx5TWl4aW5zKENvbGRPYnNlcnZhYmxlLCBbU3Vic2NyaXB0aW9uTG9nZ2FibGVdKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbGRPYnNlcnZhYmxlLmpzLm1hcCIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25Mb2dnYWJsZSB9IGZyb20gJy4vU3Vic2NyaXB0aW9uTG9nZ2FibGUnO1xuaW1wb3J0IHsgYXBwbHlNaXhpbnMgfSBmcm9tICcuLi91dGlsL2FwcGx5TWl4aW5zJztcbmV4cG9ydCBjbGFzcyBIb3RPYnNlcnZhYmxlIGV4dGVuZHMgU3ViamVjdCB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZXMsIHNjaGVkdWxlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXM7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICB9XG4gICAgX3N1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzO1xuICAgICAgICBjb25zdCBpbmRleCA9IHN1YmplY3QubG9nU3Vic2NyaWJlZEZyYW1lKCk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgc3Vic2NyaXB0aW9uLmFkZChuZXcgU3Vic2NyaXB0aW9uKCgpID0+IHtcbiAgICAgICAgICAgIHN1YmplY3QubG9nVW5zdWJzY3JpYmVkRnJhbWUoaW5kZXgpO1xuICAgICAgICB9KSk7XG4gICAgICAgIHN1YnNjcmlwdGlvbi5hZGQoc3VwZXIuX3N1YnNjcmliZShzdWJzY3JpYmVyKSk7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfVxuICAgIHNldHVwKCkge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcztcbiAgICAgICAgY29uc3QgbWVzc2FnZXNMZW5ndGggPSBzdWJqZWN0Lm1lc3NhZ2VzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXNzYWdlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gc3ViamVjdC5tZXNzYWdlc1tpXTtcbiAgICAgICAgICAgICAgICBzdWJqZWN0LnNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7IG1lc3NhZ2Uubm90aWZpY2F0aW9uLm9ic2VydmUoc3ViamVjdCk7IH0sIG1lc3NhZ2UuZnJhbWUpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmFwcGx5TWl4aW5zKEhvdE9ic2VydmFibGUsIFtTdWJzY3JpcHRpb25Mb2dnYWJsZV0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SG90T2JzZXJ2YWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb24nO1xuaW1wb3J0IHsgQ29sZE9ic2VydmFibGUgfSBmcm9tICcuL0NvbGRPYnNlcnZhYmxlJztcbmltcG9ydCB7IEhvdE9ic2VydmFibGUgfSBmcm9tICcuL0hvdE9ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTG9nIH0gZnJvbSAnLi9TdWJzY3JpcHRpb25Mb2cnO1xuaW1wb3J0IHsgVmlydHVhbFRpbWVTY2hlZHVsZXIsIFZpcnR1YWxBY3Rpb24gfSBmcm9tICcuLi9zY2hlZHVsZXIvVmlydHVhbFRpbWVTY2hlZHVsZXInO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvQXN5bmNTY2hlZHVsZXInO1xuY29uc3QgZGVmYXVsdE1heEZyYW1lID0gNzUwO1xuZXhwb3J0IGNsYXNzIFRlc3RTY2hlZHVsZXIgZXh0ZW5kcyBWaXJ0dWFsVGltZVNjaGVkdWxlciB7XG4gICAgY29uc3RydWN0b3IoYXNzZXJ0RGVlcEVxdWFsKSB7XG4gICAgICAgIHN1cGVyKFZpcnR1YWxBY3Rpb24sIGRlZmF1bHRNYXhGcmFtZSk7XG4gICAgICAgIHRoaXMuYXNzZXJ0RGVlcEVxdWFsID0gYXNzZXJ0RGVlcEVxdWFsO1xuICAgICAgICB0aGlzLmhvdE9ic2VydmFibGVzID0gW107XG4gICAgICAgIHRoaXMuY29sZE9ic2VydmFibGVzID0gW107XG4gICAgICAgIHRoaXMuZmx1c2hUZXN0cyA9IFtdO1xuICAgICAgICB0aGlzLnJ1bk1vZGUgPSBmYWxzZTtcbiAgICB9XG4gICAgY3JlYXRlVGltZShtYXJibGVzKSB7XG4gICAgICAgIGNvbnN0IGluZGV4T2YgPSBtYXJibGVzLmluZGV4T2YoJ3wnKTtcbiAgICAgICAgaWYgKGluZGV4T2YgPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hcmJsZSBkaWFncmFtIGZvciB0aW1lIHNob3VsZCBoYXZlIGEgY29tcGxldGlvbiBtYXJrZXIgXCJ8XCInKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5kZXhPZiAqIFRlc3RTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yO1xuICAgIH1cbiAgICBjcmVhdGVDb2xkT2JzZXJ2YWJsZShtYXJibGVzLCB2YWx1ZXMsIGVycm9yKSB7XG4gICAgICAgIGlmIChtYXJibGVzLmluZGV4T2YoJ14nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY29sZCBvYnNlcnZhYmxlIGNhbm5vdCBoYXZlIHN1YnNjcmlwdGlvbiBvZmZzZXQgXCJeXCInKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWFyYmxlcy5pbmRleE9mKCchJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbGQgb2JzZXJ2YWJsZSBjYW5ub3QgaGF2ZSB1bnN1YnNjcmlwdGlvbiBtYXJrZXIgXCIhXCInKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzKG1hcmJsZXMsIHZhbHVlcywgZXJyb3IsIHVuZGVmaW5lZCwgdGhpcy5ydW5Nb2RlKTtcbiAgICAgICAgY29uc3QgY29sZCA9IG5ldyBDb2xkT2JzZXJ2YWJsZShtZXNzYWdlcywgdGhpcyk7XG4gICAgICAgIHRoaXMuY29sZE9ic2VydmFibGVzLnB1c2goY29sZCk7XG4gICAgICAgIHJldHVybiBjb2xkO1xuICAgIH1cbiAgICBjcmVhdGVIb3RPYnNlcnZhYmxlKG1hcmJsZXMsIHZhbHVlcywgZXJyb3IpIHtcbiAgICAgICAgaWYgKG1hcmJsZXMuaW5kZXhPZignIScpICE9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdob3Qgb2JzZXJ2YWJsZSBjYW5ub3QgaGF2ZSB1bnN1YnNjcmlwdGlvbiBtYXJrZXIgXCIhXCInKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzKG1hcmJsZXMsIHZhbHVlcywgZXJyb3IsIHVuZGVmaW5lZCwgdGhpcy5ydW5Nb2RlKTtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IG5ldyBIb3RPYnNlcnZhYmxlKG1lc3NhZ2VzLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ob3RPYnNlcnZhYmxlcy5wdXNoKHN1YmplY3QpO1xuICAgICAgICByZXR1cm4gc3ViamVjdDtcbiAgICB9XG4gICAgbWF0ZXJpYWxpemVJbm5lck9ic2VydmFibGUob2JzZXJ2YWJsZSwgb3V0ZXJGcmFtZSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IFtdO1xuICAgICAgICBvYnNlcnZhYmxlLnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSAtIG91dGVyRnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpIH0pO1xuICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUgLSBvdXRlckZyYW1lLCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbi5jcmVhdGVFcnJvcihlcnIpIH0pO1xuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUgLSBvdXRlckZyYW1lLCBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbi5jcmVhdGVDb21wbGV0ZSgpIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xuICAgIH1cbiAgICBleHBlY3RPYnNlcnZhYmxlKG9ic2VydmFibGUsIHN1YnNjcmlwdGlvbk1hcmJsZXMgPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGFjdHVhbCA9IFtdO1xuICAgICAgICBjb25zdCBmbHVzaFRlc3QgPSB7IGFjdHVhbCwgcmVhZHk6IGZhbHNlIH07XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvblBhcnNlZCA9IFRlc3RTY2hlZHVsZXIucGFyc2VNYXJibGVzQXNTdWJzY3JpcHRpb25zKHN1YnNjcmlwdGlvbk1hcmJsZXMsIHRoaXMucnVuTW9kZSk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbkZyYW1lID0gc3Vic2NyaXB0aW9uUGFyc2VkLnN1YnNjcmliZWRGcmFtZSA9PT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZID9cbiAgICAgICAgICAgIDAgOiBzdWJzY3JpcHRpb25QYXJzZWQuc3Vic2NyaWJlZEZyYW1lO1xuICAgICAgICBjb25zdCB1bnN1YnNjcmlwdGlvbkZyYW1lID0gc3Vic2NyaXB0aW9uUGFyc2VkLnVuc3Vic2NyaWJlZEZyYW1lO1xuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uO1xuICAgICAgICB0aGlzLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbiA9IG9ic2VydmFibGUuc3Vic2NyaWJlKHggPT4ge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHg7XG4gICAgICAgICAgICAgICAgaWYgKHggaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5tYXRlcmlhbGl6ZUlubmVyT2JzZXJ2YWJsZSh2YWx1ZSwgdGhpcy5mcmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjdHVhbC5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpIH0pO1xuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGFjdHVhbC5wdXNoKHsgZnJhbWU6IHRoaXMuZnJhbWUsIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLmNyZWF0ZUVycm9yKGVycikgfSk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYWN0dWFsLnB1c2goeyBmcmFtZTogdGhpcy5mcmFtZSwgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBzdWJzY3JpcHRpb25GcmFtZSk7XG4gICAgICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lICE9PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCksIHVuc3Vic2NyaXB0aW9uRnJhbWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmx1c2hUZXN0cy5wdXNoKGZsdXNoVGVzdCk7XG4gICAgICAgIGNvbnN0IHsgcnVuTW9kZSB9ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvQmUobWFyYmxlcywgdmFsdWVzLCBlcnJvclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZmx1c2hUZXN0LnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmbHVzaFRlc3QuZXhwZWN0ZWQgPSBUZXN0U2NoZWR1bGVyLnBhcnNlTWFyYmxlcyhtYXJibGVzLCB2YWx1ZXMsIGVycm9yVmFsdWUsIHRydWUsIHJ1bk1vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBleHBlY3RTdWJzY3JpcHRpb25zKGFjdHVhbFN1YnNjcmlwdGlvbkxvZ3MpIHtcbiAgICAgICAgY29uc3QgZmx1c2hUZXN0ID0geyBhY3R1YWw6IGFjdHVhbFN1YnNjcmlwdGlvbkxvZ3MsIHJlYWR5OiBmYWxzZSB9O1xuICAgICAgICB0aGlzLmZsdXNoVGVzdHMucHVzaChmbHVzaFRlc3QpO1xuICAgICAgICBjb25zdCB7IHJ1bk1vZGUgfSA9IHRoaXM7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b0JlKG1hcmJsZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXJibGVzQXJyYXkgPSAodHlwZW9mIG1hcmJsZXMgPT09ICdzdHJpbmcnKSA/IFttYXJibGVzXSA6IG1hcmJsZXM7XG4gICAgICAgICAgICAgICAgZmx1c2hUZXN0LnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmbHVzaFRlc3QuZXhwZWN0ZWQgPSBtYXJibGVzQXJyYXkubWFwKG1hcmJsZXMgPT4gVGVzdFNjaGVkdWxlci5wYXJzZU1hcmJsZXNBc1N1YnNjcmlwdGlvbnMobWFyYmxlcywgcnVuTW9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmbHVzaCgpIHtcbiAgICAgICAgY29uc3QgaG90T2JzZXJ2YWJsZXMgPSB0aGlzLmhvdE9ic2VydmFibGVzO1xuICAgICAgICB3aGlsZSAoaG90T2JzZXJ2YWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaG90T2JzZXJ2YWJsZXMuc2hpZnQoKS5zZXR1cCgpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmZsdXNoKCk7XG4gICAgICAgIHRoaXMuZmx1c2hUZXN0cyA9IHRoaXMuZmx1c2hUZXN0cy5maWx0ZXIodGVzdCA9PiB7XG4gICAgICAgICAgICBpZiAodGVzdC5yZWFkeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXJ0RGVlcEVxdWFsKHRlc3QuYWN0dWFsLCB0ZXN0LmV4cGVjdGVkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHN0YXRpYyBwYXJzZU1hcmJsZXNBc1N1YnNjcmlwdGlvbnMobWFyYmxlcywgcnVuTW9kZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbWFyYmxlcyAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uTG9nKE51bWJlci5QT1NJVElWRV9JTkZJTklUWSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGVuID0gbWFyYmxlcy5sZW5ndGg7XG4gICAgICAgIGxldCBncm91cFN0YXJ0ID0gLTE7XG4gICAgICAgIGxldCBzdWJzY3JpcHRpb25GcmFtZSA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICAgICAgbGV0IHVuc3Vic2NyaXB0aW9uRnJhbWUgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgICAgIGxldCBmcmFtZSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuZXh0RnJhbWUgPSBmcmFtZTtcbiAgICAgICAgICAgIGNvbnN0IGFkdmFuY2VGcmFtZUJ5ID0gKGNvdW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbmV4dEZyYW1lICs9IGNvdW50ICogdGhpcy5mcmFtZVRpbWVGYWN0b3I7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgYyA9IG1hcmJsZXNbaV07XG4gICAgICAgICAgICBzd2l0Y2ggKGMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFydW5Nb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJygnOlxuICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0ID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICcpJzpcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBTdGFydCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpcHRpb25GcmFtZSAhPT0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZvdW5kIGEgc2Vjb25kIHN1YnNjcmlwdGlvbiBwb2ludCBcXCdeXFwnIGluIGEgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3N1YnNjcmlwdGlvbiBtYXJibGUgZGlhZ3JhbS4gVGhlcmUgY2FuIG9ubHkgYmUgb25lLicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbkZyYW1lID0gZ3JvdXBTdGFydCA+IC0xID8gZ3JvdXBTdGFydCA6IGZyYW1lO1xuICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnISc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lICE9PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZm91bmQgYSBzZWNvbmQgc3Vic2NyaXB0aW9uIHBvaW50IFxcJ15cXCcgaW4gYSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3Vic2NyaXB0aW9uIG1hcmJsZSBkaWFncmFtLiBUaGVyZSBjYW4gb25seSBiZSBvbmUuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdW5zdWJzY3JpcHRpb25GcmFtZSA9IGdyb3VwU3RhcnQgPiAtMSA/IGdyb3VwU3RhcnQgOiBmcmFtZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bk1vZGUgJiYgYy5tYXRjaCgvXlswLTldJC8pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCB8fCBtYXJibGVzW2kgLSAxXSA9PT0gJyAnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gbWFyYmxlcy5zbGljZShpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGJ1ZmZlci5tYXRjaCgvXihbMC05XSsoPzpcXC5bMC05XSspPykobXN8c3xtKSAvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaSArPSBtYXRjaFswXS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1bml0ID0gbWF0Y2hbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkdXJhdGlvbkluTXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodW5pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbXMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb24gKiAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25Jbk1zID0gZHVyYXRpb24gKiAxMDAwICogNjA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KGR1cmF0aW9uSW5NcyAvIHRoaXMuZnJhbWVUaW1lRmFjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlcmUgY2FuIG9ubHkgYmUgXFwnXlxcJyBhbmQgXFwnIVxcJyBtYXJrZXJzIGluIGEgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3Vic2NyaXB0aW9uIG1hcmJsZSBkaWFncmFtLiBGb3VuZCBpbnN0ZWFkIFxcJycgKyBjICsgJ1xcJy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZyYW1lID0gbmV4dEZyYW1lO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bnN1YnNjcmlwdGlvbkZyYW1lIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25Mb2coc3Vic2NyaXB0aW9uRnJhbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25Mb2coc3Vic2NyaXB0aW9uRnJhbWUsIHVuc3Vic2NyaXB0aW9uRnJhbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBwYXJzZU1hcmJsZXMobWFyYmxlcywgdmFsdWVzLCBlcnJvclZhbHVlLCBtYXRlcmlhbGl6ZUlubmVyT2JzZXJ2YWJsZXMgPSBmYWxzZSwgcnVuTW9kZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChtYXJibGVzLmluZGV4T2YoJyEnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY29udmVudGlvbmFsIG1hcmJsZSBkaWFncmFtcyBjYW5ub3QgaGF2ZSB0aGUgJyArXG4gICAgICAgICAgICAgICAgJ3Vuc3Vic2NyaXB0aW9uIG1hcmtlciBcIiFcIicpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxlbiA9IG1hcmJsZXMubGVuZ3RoO1xuICAgICAgICBjb25zdCB0ZXN0TWVzc2FnZXMgPSBbXTtcbiAgICAgICAgY29uc3Qgc3ViSW5kZXggPSBydW5Nb2RlID8gbWFyYmxlcy5yZXBsYWNlKC9eWyBdKy8sICcnKS5pbmRleE9mKCdeJykgOiBtYXJibGVzLmluZGV4T2YoJ14nKTtcbiAgICAgICAgbGV0IGZyYW1lID0gc3ViSW5kZXggPT09IC0xID8gMCA6IChzdWJJbmRleCAqIC10aGlzLmZyYW1lVGltZUZhY3Rvcik7XG4gICAgICAgIGNvbnN0IGdldFZhbHVlID0gdHlwZW9mIHZhbHVlcyAhPT0gJ29iamVjdCcgP1xuICAgICAgICAgICAgKHgpID0+IHggOlxuICAgICAgICAgICAgKHgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWxpemVJbm5lck9ic2VydmFibGVzICYmIHZhbHVlc1t4XSBpbnN0YW5jZW9mIENvbGRPYnNlcnZhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbeF0ubWVzc2FnZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbeF07XG4gICAgICAgICAgICB9O1xuICAgICAgICBsZXQgZ3JvdXBTdGFydCA9IC0xO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV4dEZyYW1lID0gZnJhbWU7XG4gICAgICAgICAgICBjb25zdCBhZHZhbmNlRnJhbWVCeSA9IChjb3VudCkgPT4ge1xuICAgICAgICAgICAgICAgIG5leHRGcmFtZSArPSBjb3VudCAqIHRoaXMuZnJhbWVUaW1lRmFjdG9yO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBub3RpZmljYXRpb247XG4gICAgICAgICAgICBjb25zdCBjID0gbWFyYmxlc1tpXTtcbiAgICAgICAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICAgICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJ1bk1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeSgxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnKCc6XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwU3RhcnQgPSBmcmFtZTtcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyknOlxuICAgICAgICAgICAgICAgICAgICBncm91cFN0YXJ0ID0gLTE7XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uID0gTm90aWZpY2F0aW9uLmNyZWF0ZUNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgICAgICAgICAgICBub3RpZmljYXRpb24gPSBOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyb3JWYWx1ZSB8fCAnZXJyb3InKTtcbiAgICAgICAgICAgICAgICAgICAgYWR2YW5jZUZyYW1lQnkoMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmIChydW5Nb2RlICYmIGMubWF0Y2goL15bMC05XSQvKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDAgfHwgbWFyYmxlc1tpIC0gMV0gPT09ICcgJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IG1hcmJsZXMuc2xpY2UoaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBidWZmZXIubWF0Y2goL14oWzAtOV0rKD86XFwuWzAtOV0rKT8pKG1zfHN8bSkgLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgKz0gbWF0Y2hbMF0ubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdW5pdCA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZHVyYXRpb25Jbk1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHVuaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ21zJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbkluTXMgPSBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uICogMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uSW5NcyA9IGR1cmF0aW9uICogMTAwMCAqIDYwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZHZhbmNlRnJhbWVCeShkdXJhdGlvbkluTXMgLyB0aGlzLmZyYW1lVGltZUZhY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBub3RpZmljYXRpb24gPSBOb3RpZmljYXRpb24uY3JlYXRlTmV4dChnZXRWYWx1ZShjKSk7XG4gICAgICAgICAgICAgICAgICAgIGFkdmFuY2VGcmFtZUJ5KDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0ZXN0TWVzc2FnZXMucHVzaCh7IGZyYW1lOiBncm91cFN0YXJ0ID4gLTEgPyBncm91cFN0YXJ0IDogZnJhbWUsIG5vdGlmaWNhdGlvbiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZyYW1lID0gbmV4dEZyYW1lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXN0TWVzc2FnZXM7XG4gICAgfVxuICAgIHJ1bihjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBwcmV2RnJhbWVUaW1lRmFjdG9yID0gVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3I7XG4gICAgICAgIGNvbnN0IHByZXZNYXhGcmFtZXMgPSB0aGlzLm1heEZyYW1lcztcbiAgICAgICAgVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3IgPSAxO1xuICAgICAgICB0aGlzLm1heEZyYW1lcyA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICAgICAgdGhpcy5ydW5Nb2RlID0gdHJ1ZTtcbiAgICAgICAgQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgPSB0aGlzO1xuICAgICAgICBjb25zdCBoZWxwZXJzID0ge1xuICAgICAgICAgICAgY29sZDogdGhpcy5jcmVhdGVDb2xkT2JzZXJ2YWJsZS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgaG90OiB0aGlzLmNyZWF0ZUhvdE9ic2VydmFibGUuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZsdXNoOiB0aGlzLmZsdXNoLmJpbmQodGhpcyksXG4gICAgICAgICAgICBleHBlY3RPYnNlcnZhYmxlOiB0aGlzLmV4cGVjdE9ic2VydmFibGUuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGV4cGVjdFN1YnNjcmlwdGlvbnM6IHRoaXMuZXhwZWN0U3Vic2NyaXB0aW9ucy5iaW5kKHRoaXMpLFxuICAgICAgICB9O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0ID0gY2FsbGJhY2soaGVscGVycyk7XG4gICAgICAgICAgICB0aGlzLmZsdXNoKCk7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgVGVzdFNjaGVkdWxlci5mcmFtZVRpbWVGYWN0b3IgPSBwcmV2RnJhbWVUaW1lRmFjdG9yO1xuICAgICAgICAgICAgdGhpcy5tYXhGcmFtZXMgPSBwcmV2TWF4RnJhbWVzO1xuICAgICAgICAgICAgdGhpcy5ydW5Nb2RlID0gZmFsc2U7XG4gICAgICAgICAgICBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRlc3RTY2hlZHVsZXIuanMubWFwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBQU8sTUFBTSxlQUFlLENBQUM7WUFDN0IsSUFBSSxXQUFXLENBQUMsZUFBZSxFQUFFLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtZQUMvRSxRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1lBQy9DLFFBQVEsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1lBQ25ELEtBQUs7WUFDTDs7WUNKTyxNQUFNLG9CQUFvQixDQUFDO1lBQ2xDLElBQUksV0FBVyxHQUFHO1lBQ2xCLFFBQVEsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7WUFDaEMsS0FBSztZQUNMLElBQUksa0JBQWtCLEdBQUc7WUFDekIsUUFBUSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzRSxRQUFRLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQzdDLEtBQUs7WUFDTCxJQUFJLG9CQUFvQixDQUFDLEtBQUssRUFBRTtZQUNoQyxRQUFRLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNwRCxRQUFRLE1BQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0QsUUFBUSxnQkFBZ0IsQ0FBQyxL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
