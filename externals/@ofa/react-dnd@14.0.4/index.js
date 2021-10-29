System.register(['react'], (function (exports) {
  'use strict';
  var createContext, require$$0, memo, useEffect, isValidElement, cloneElement, createRef, Component, useLayoutEffect, useMemo, useContext, useState, useCallback;
  return {
    setters: [function (module) {
      createContext = module.createContext;
      require$$0 = module["default"];
      memo = module.memo;
      useEffect = module.useEffect;
      isValidElement = module.isValidElement;
      cloneElement = module.cloneElement;
      createRef = module.createRef;
      Component = module.Component;
      useLayoutEffect = module.useLayoutEffect;
      useMemo = module.useMemo;
      useContext = module.useContext;
      useState = module.useState;
      useCallback = module.useCallback;
    }],
    execute: (function () {

      exports({
        DragLayer: DragLayer,
        DragSource: DragSource,
        DropTarget: DropTarget,
        useDrag: useDrag,
        useDragDropManager: useDragDropManager,
        useDragLayer: useDragLayer,
        useDrop: useDrop
      });

      /**
       * Create the React Context
       */

      var DndContext = exports('DndContext', createContext({
        dragDropManager: undefined
      }));

      var jsxRuntime = {exports: {}};

      var reactJsxRuntime_production_min = {};

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

      /** @license React v17.0.2
       * react-jsx-runtime.production.min.js
       *
       * Copyright (c) Facebook, Inc. and its affiliates.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */
      var f$1=require$$0,g$1=60103;reactJsxRuntime_production_min.Fragment=60107;if("function"===typeof Symbol&&Symbol.for){var h$1=Symbol.for;g$1=h$1("react.element");reactJsxRuntime_production_min.Fragment=h$1("react.fragment");}var m$1=f$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n$1=Object.prototype.hasOwnProperty,p$1={key:!0,ref:!0,__self:!0,__source:!0};
      function q$1(c,a,k){var b,d={},e=null,l=null;void 0!==k&&(e=""+k);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(l=a.ref);for(b in a)n$1.call(a,b)&&!p$1.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:g$1,type:c,key:e,ref:l,props:d,_owner:m$1.current}}reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

      {
        jsxRuntime.exports = reactJsxRuntime_production_min;
      }

      var HandlerRole;

      (function (HandlerRole) {
        HandlerRole["SOURCE"] = "SOURCE";
        HandlerRole["TARGET"] = "TARGET";
      })(HandlerRole || (HandlerRole = {}));

      /**
       * Use invariant() to assert state which your program assumes to be true.
       *
       * Provide sprintf-style format (only %s is supported) and arguments
       * to provide information about what broke and what you were
       * expecting.
       *
       * The invariant message will be stripped in production, but the invariant
       * will remain to ensure logic does not differ in production.
       */
      function invariant(condition, format) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        if (!condition) {
          var error;

          if (format === undefined) {
            error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
          } else {
            var argIndex = 0;
            error = new Error(format.replace(/%s/g, function () {
              return args[argIndex++];
            }));
            error.name = 'Invariant Violation';
          }

          error.framesToPop = 1; // we don't care about invariant's own frame

          throw error;
        }
      }

      var INIT_COORDS = 'dnd-core/INIT_COORDS';
      var BEGIN_DRAG = 'dnd-core/BEGIN_DRAG';
      var PUBLISH_DRAG_SOURCE = 'dnd-core/PUBLISH_DRAG_SOURCE';
      var HOVER = 'dnd-core/HOVER';
      var DROP = 'dnd-core/DROP';
      var END_DRAG = 'dnd-core/END_DRAG';

      function setClientOffset(clientOffset, sourceClientOffset) {
        return {
          type: INIT_COORDS,
          payload: {
            sourceClientOffset: sourceClientOffset || null,
            clientOffset: clientOffset || null
          }
        };
      }

      function _typeof$6(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$6 = function _typeof(obj) { return typeof obj; }; } else { _typeof$6 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$6(obj); }

      // cheap lodash replacements

      /**
       * drop-in replacement for _.get
       * @param obj
       * @param path
       * @param defaultValue
       */
      function get(obj, path, defaultValue) {
        return path.split('.').reduce(function (a, c) {
          return a && a[c] ? a[c] : defaultValue || null;
        }, obj);
      }
      /**
       * drop-in replacement for _.without
       */

      function without(items, item) {
        return items.filter(function (i) {
          return i !== item;
        });
      }
      /**
       * drop-in replacement for _.isString
       * @param input
       */

      function isObject(input) {
        return _typeof$6(input) === 'object';
      }
      /**
       * repalcement for _.xor
       * @param itemsA
       * @param itemsB
       */

      function xor(itemsA, itemsB) {
        var map = new Map();

        var insertItem = function insertItem(item) {
          map.set(item, map.has(item) ? map.get(item) + 1 : 1);
        };

        itemsA.forEach(insertItem);
        itemsB.forEach(insertItem);
        var result = [];
        map.forEach(function (count, key) {
          if (count === 1) {
            result.push(key);
          }
        });
        return result;
      }
      /**
       * replacement for _.intersection
       * @param itemsA
       * @param itemsB
       */

      function intersection(itemsA, itemsB) {
        return itemsA.filter(function (t) {
          return itemsB.indexOf(t) > -1;
        });
      }

      var ResetCoordinatesAction = {
        type: INIT_COORDS,
        payload: {
          clientOffset: null,
          sourceClientOffset: null
        }
      };
      function createBeginDrag(manager) {
        return function beginDrag() {
          var sourceIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
            publishSource: true
          };
          var _options$publishSourc = options.publishSource,
              publishSource = _options$publishSourc === void 0 ? true : _options$publishSourc,
              clientOffset = options.clientOffset,
              getSourceClientOffset = options.getSourceClientOffset;
          var monitor = manager.getMonitor();
          var registry = manager.getRegistry(); // Initialize the coordinates using the client offset

          manager.dispatch(setClientOffset(clientOffset));
          verifyInvariants$1(sourceIds, monitor, registry); // Get the draggable source

          var sourceId = getDraggableSource(sourceIds, monitor);

          if (sourceId === null) {
            manager.dispatch(ResetCoordinatesAction);
            return;
          } // Get the source client offset


          var sourceClientOffset = null;

          if (clientOffset) {
            if (!getSourceClientOffset) {
              throw new Error('getSourceClientOffset must be defined');
            }

            verifyGetSourceClientOffsetIsFunction(getSourceClientOffset);
            sourceClientOffset = getSourceClientOffset(sourceId);
          } // Initialize the full coordinates


          manager.dispatch(setClientOffset(clientOffset, sourceClientOffset));
          var source = registry.getSource(sourceId);
          var item = source.beginDrag(monitor, sourceId); // If source.beginDrag returns null, this is an indicator to cancel the drag

          if (item == null) {
            return undefined;
          }

          verifyItemIsObject(item);
          registry.pinSource(sourceId);
          var itemType = registry.getSourceType(sourceId);
          return {
            type: BEGIN_DRAG,
            payload: {
              itemType: itemType,
              item: item,
              sourceId: sourceId,
              clientOffset: clientOffset || null,
              sourceClientOffset: sourceClientOffset || null,
              isSourcePublic: !!publishSource
            }
          };
        };
      }

      function verifyInvariants$1(sourceIds, monitor, registry) {
        invariant(!monitor.isDragging(), 'Cannot call beginDrag while dragging.');
        sourceIds.forEach(function (sourceId) {
          invariant(registry.getSource(sourceId), 'Expected sourceIds to be registered.');
        });
      }

      function verifyGetSourceClientOffsetIsFunction(getSourceClientOffset) {
        invariant(typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
      }

      function verifyItemIsObject(item) {
        invariant(isObject(item), 'Item must be an object.');
      }

      function getDraggableSource(sourceIds, monitor) {
        var sourceId = null;

        for (var i = sourceIds.length - 1; i >= 0; i--) {
          if (monitor.canDragSource(sourceIds[i])) {
            sourceId = sourceIds[i];
            break;
          }
        }

        return sourceId;
      }

      function createPublishDragSource(manager) {
        return function publishDragSource() {
          var monitor = manager.getMonitor();

          if (monitor.isDragging()) {
            return {
              type: PUBLISH_DRAG_SOURCE
            };
          }
        };
      }

      function matchesType(targetType, draggedItemType) {
        if (draggedItemType === null) {
          return targetType === null;
        }

        return Array.isArray(targetType) ? targetType.some(function (t) {
          return t === draggedItemType;
        }) : targetType === draggedItemType;
      }

      function createHover(manager) {
        return function hover(targetIdsArg) {
          var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
              clientOffset = _ref.clientOffset;

          verifyTargetIdsIsArray(targetIdsArg);
          var targetIds = targetIdsArg.slice(0);
          var monitor = manager.getMonitor();
          var registry = manager.getRegistry();
          checkInvariants(targetIds, monitor, registry);
          var draggedItemType = monitor.getItemType();
          removeNonMatchingTargetIds(targetIds, registry, draggedItemType);
          hoverAllTargets(targetIds, monitor, registry);
          return {
            type: HOVER,
            payload: {
              targetIds: targetIds,
              clientOffset: clientOffset || null
            }
          };
        };
      }

      function verifyTargetIdsIsArray(targetIdsArg) {
        invariant(Array.isArray(targetIdsArg), 'Expected targetIds to be an array.');
      }

      function checkInvariants(targetIds, monitor, registry) {
        invariant(monitor.isDragging(), 'Cannot call hover while not dragging.');
        invariant(!monitor.didDrop(), 'Cannot call hover after drop.');

        for (var i = 0; i < targetIds.length; i++) {
          var targetId = targetIds[i];
          invariant(targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');
          var target = registry.getTarget(targetId);
          invariant(target, 'Expected targetIds to be registered.');
        }
      }

      function removeNonMatchingTargetIds(targetIds, registry, draggedItemType) {
        // Remove those targetIds that don't match the targetType.  This
        // fixes shallow isOver which would only be non-shallow because of
        // non-matching targets.
        for (var i = targetIds.length - 1; i >= 0; i--) {
          var targetId = targetIds[i];
          var targetType = registry.getTargetType(targetId);

          if (!matchesType(targetType, draggedItemType)) {
            targetIds.splice(i, 1);
          }
        }
      }

      function hoverAllTargets(targetIds, monitor, registry) {
        // Finally call hover on all matching targets.
        targetIds.forEach(function (targetId) {
          var target = registry.getTarget(targetId);
          target.hover(monitor, targetId);
        });
      }

      function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

      function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty$h(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

      function _defineProperty$h(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      function createDrop(manager) {
        return function drop() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var monitor = manager.getMonitor();
          var registry = manager.getRegistry();
          verifyInvariants(monitor);
          var targetIds = getDroppableTargets(monitor); // Multiple actions are dispatched here, which is why this doesn't return an action

          targetIds.forEach(function (targetId, index) {
            var dropResult = determineDropResult(targetId, index, registry, monitor);
            var action = {
              type: DROP,
              payload: {
                dropResult: _objectSpread$3(_objectSpread$3({}, options), dropResult)
              }
            };
            manager.dispatch(action);
          });
        };
      }

      function verifyInvariants(monitor) {
        invariant(monitor.isDragging(), 'Cannot call drop while not dragging.');
        invariant(!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');
      }

      function determineDropResult(targetId, index, registry, monitor) {
        var target = registry.getTarget(targetId);
        var dropResult = target ? target.drop(monitor, targetId) : undefined;
        verifyDropResultType(dropResult);

        if (typeof dropResult === 'undefined') {
          dropResult = index === 0 ? {} : monitor.getDropResult();
        }

        return dropResult;
      }

      function verifyDropResultType(dropResult) {
        invariant(typeof dropResult === 'undefined' || isObject(dropResult), 'Drop result must either be an object or undefined.');
      }

      function getDroppableTargets(monitor) {
        var targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);
        targetIds.reverse();
        return targetIds;
      }

      function createEndDrag(manager) {
        return function endDrag() {
          var monitor = manager.getMonitor();
          var registry = manager.getRegistry();
          verifyIsDragging(monitor);
          var sourceId = monitor.getSourceId();

          if (sourceId != null) {
            var source = registry.getSource(sourceId, true);
            source.endDrag(monitor, sourceId);
            registry.unpinSource();
          }

          return {
            type: END_DRAG
          };
        };
      }

      function verifyIsDragging(monitor) {
        invariant(monitor.isDragging(), 'Cannot call endDrag while not dragging.');
      }

      function createDragDropActions(manager) {
        return {
          beginDrag: createBeginDrag(manager),
          publishDragSource: createPublishDragSource(manager),
          hover: createHover(manager),
          drop: createDrop(manager),
          endDrag: createEndDrag(manager)
        };
      }

      function _classCallCheck$d(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$d(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$d(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$d(Constructor.prototype, protoProps); if (staticProps) _defineProperties$d(Constructor, staticProps); return Constructor; }

      function _defineProperty$g(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var DragDropManagerImpl = /*#__PURE__*/function () {
        function DragDropManagerImpl(store, monitor) {
          var _this = this;

          _classCallCheck$d(this, DragDropManagerImpl);

          _defineProperty$g(this, "store", void 0);

          _defineProperty$g(this, "monitor", void 0);

          _defineProperty$g(this, "backend", void 0);

          _defineProperty$g(this, "isSetUp", false);

          _defineProperty$g(this, "handleRefCountChange", function () {
            var shouldSetUp = _this.store.getState().refCount > 0;

            if (_this.backend) {
              if (shouldSetUp && !_this.isSetUp) {
                _this.backend.setup();

                _this.isSetUp = true;
              } else if (!shouldSetUp && _this.isSetUp) {
                _this.backend.teardown();

                _this.isSetUp = false;
              }
            }
          });

          this.store = store;
          this.monitor = monitor;
          store.subscribe(this.handleRefCountChange);
        }

        _createClass$d(DragDropManagerImpl, [{
          key: "receiveBackend",
          value: function receiveBackend(backend) {
            this.backend = backend;
          }
        }, {
          key: "getMonitor",
          value: function getMonitor() {
            return this.monitor;
          }
        }, {
          key: "getBackend",
          value: function getBackend() {
            return this.backend;
          }
        }, {
          key: "getRegistry",
          value: function getRegistry() {
            return this.monitor.registry;
          }
        }, {
          key: "getActions",
          value: function getActions() {
            /* eslint-disable-next-line @typescript-eslint/no-this-alias */
            var manager = this;
            var dispatch = this.store.dispatch;

            function bindActionCreator(actionCreator) {
              return function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                var action = actionCreator.apply(manager, args);

                if (typeof action !== 'undefined') {
                  dispatch(action);
                }
              };
            }

            var actions = createDragDropActions(this);
            return Object.keys(actions).reduce(function (boundActions, key) {
              var action = actions[key];
              boundActions[key] = bindActionCreator(action);
              return boundActions;
            }, {});
          }
        }, {
          key: "dispatch",
          value: function dispatch(action) {
            this.store.dispatch(action);
          }
        }]);

        return DragDropManagerImpl;
      }();

      /**
       * Adapted from React: https://github.com/facebook/react/blob/master/packages/shared/formatProdErrorMessage.js
       *
       * Do not require this module directly! Use normal throw error calls. These messages will be replaced with error codes
       * during build.
       * @param {number} code
       */
      function formatProdErrorMessage(code) {
        return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or " + 'use the non-minified dev environment for full errors. ';
      }

      // Inlined version of the `symbol-observable` polyfill
      var $$observable = (function () {
        return typeof Symbol === 'function' && Symbol.observable || '@@observable';
      })();

      /**
       * These are private action types reserved by Redux.
       * For any unknown actions, you must return the current state.
       * If the current state is undefined, you must return the initial state.
       * Do not reference these action types directly in your code.
       */
      var randomString = function randomString() {
        return Math.random().toString(36).substring(7).split('').join('.');
      };

      var ActionTypes = {
        INIT: "@@redux/INIT" + randomString(),
        REPLACE: "@@redux/REPLACE" + randomString(),
        PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
          return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
        }
      };

      /**
       * @param {any} obj The object to inspect.
       * @returns {boolean} True if the argument appears to be a plain object.
       */
      function isPlainObject$1(obj) {
        if (typeof obj !== 'object' || obj === null) return false;
        var proto = obj;

        while (Object.getPrototypeOf(proto) !== null) {
          proto = Object.getPrototypeOf(proto);
        }

        return Object.getPrototypeOf(obj) === proto;
      }

      /**
       * Creates a Redux store that holds the state tree.
       * The only way to change the data in the store is to call `dispatch()` on it.
       *
       * There should only be a single store in your app. To specify how different
       * parts of the state tree respond to actions, you may combine several reducers
       * into a single reducer function by using `combineReducers`.
       *
       * @param {Function} reducer A function that returns the next state tree, given
       * the current state tree and the action to handle.
       *
       * @param {any} [preloadedState] The initial state. You may optionally specify it
       * to hydrate the state from the server in universal apps, or to restore a
       * previously serialized user session.
       * If you use `combineReducers` to produce the root reducer function, this must be
       * an object with the same shape as `combineReducers` keys.
       *
       * @param {Function} [enhancer] The store enhancer. You may optionally specify it
       * to enhance the store with third-party capabilities such as middleware,
       * time travel, persistence, etc. The only store enhancer that ships with Redux
       * is `applyMiddleware()`.
       *
       * @returns {Store} A Redux store that lets you read the state, dispatch actions
       * and subscribe to changes.
       */

      function createStore(reducer, preloadedState, enhancer) {
        var _ref2;

        if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
          throw new Error(formatProdErrorMessage(0) );
        }

        if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
          enhancer = preloadedState;
          preloadedState = undefined;
        }

        if (typeof enhancer !== 'undefined') {
          if (typeof enhancer !== 'function') {
            throw new Error(formatProdErrorMessage(1) );
          }

          return enhancer(createStore)(reducer, preloadedState);
        }

        if (typeof reducer !== 'function') {
          throw new Error(formatProdErrorMessage(2) );
        }

        var currentReducer = reducer;
        var currentState = preloadedState;
        var currentListeners = [];
        var nextListeners = currentListeners;
        var isDispatching = false;
        /**
         * This makes a shallow copy of currentListeners so we can use
         * nextListeners as a temporary list while dispatching.
         *
         * This prevents any bugs around consumers calling
         * subscribe/unsubscribe in the middle of a dispatch.
         */

        function ensureCanMutateNextListeners() {
          if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice();
          }
        }
        /**
         * Reads the state tree managed by the store.
         *
         * @returns {any} The current state tree of your application.
         */


        function getState() {
          if (isDispatching) {
            throw new Error(formatProdErrorMessage(3) );
          }

          return currentState;
        }
        /**
         * Adds a change listener. It will be called any time an action is dispatched,
         * and some part of the state tree may potentially have changed. You may then
         * call `getState()` to read the current state tree inside the callback.
         *
         * You may call `dispatch()` from a change listener, with the following
         * caveats:
         *
         * 1. The subscriptions are snapshotted just before every `dispatch()` call.
         * If you subscribe or unsubscribe while the listeners are being invoked, this
         * will not have any effect on the `dispatch()` that is currently in progress.
         * However, the next `dispatch()` call, whether nested or not, will use a more
         * recent snapshot of the subscription list.
         *
         * 2. The listener should not expect to see all state changes, as the state
         * might have been updated multiple times during a nested `dispatch()` before
         * the listener is called. It is, however, guaranteed that all subscribers
         * registered before the `dispatch()` started will be called with the latest
         * state by the time it exits.
         *
         * @param {Function} listener A callback to be invoked on every dispatch.
         * @returns {Function} A function to remove this change listener.
         */


        function subscribe(listener) {
          if (typeof listener !== 'function') {
            throw new Error(formatProdErrorMessage(4) );
          }

          if (isDispatching) {
            throw new Error(formatProdErrorMessage(5) );
          }

          var isSubscribed = true;
          ensureCanMutateNextListeners();
          nextListeners.push(listener);
          return function unsubscribe() {
            if (!isSubscribed) {
              return;
            }

            if (isDispatching) {
              throw new Error(formatProdErrorMessage(6) );
            }

            isSubscribed = false;
            ensureCanMutateNextListeners();
            var index = nextListeners.indexOf(listener);
            nextListeners.splice(index, 1);
            currentListeners = null;
          };
        }
        /**
         * Dispatches an action. It is the only way to trigger a state change.
         *
         * The `reducer` function, used to create the store, will be called with the
         * current state tree and the given `action`. Its return value will
         * be considered the **next** state of the tree, and the change listeners
         * will be notified.
         *
         * The base implementation only supports plain object actions. If you want to
         * dispatch a Promise, an Observable, a thunk, or something else, you need to
         * wrap your store creating function into the corresponding middleware. For
         * example, see the documentation for the `redux-thunk` package. Even the
         * middleware will eventually dispatch plain object actions using this method.
         *
         * @param {Object} action A plain object representing “what changed”. It is
         * a good idea to keep actions serializable so you can record and replay user
         * sessions, or use the time travelling `redux-devtools`. An action must have
         * a `type` property which may not be `undefined`. It is a good idea to use
         * string constants for action types.
         *
         * @returns {Object} For convenience, the same action object you dispatched.
         *
         * Note that, if you use a custom middleware, it may wrap `dispatch()` to
         * return something else (for example, a Promise you can await).
         */


        function dispatch(action) {
          if (!isPlainObject$1(action)) {
            throw new Error(formatProdErrorMessage(7) );
          }

          if (typeof action.type === 'undefined') {
            throw new Error(formatProdErrorMessage(8) );
          }

          if (isDispatching) {
            throw new Error(formatProdErrorMessage(9) );
          }

          try {
            isDispatching = true;
            currentState = currentReducer(currentState, action);
          } finally {
            isDispatching = false;
          }

          var listeners = currentListeners = nextListeners;

          for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            listener();
          }

          return action;
        }
        /**
         * Replaces the reducer currently used by the store to calculate the state.
         *
         * You might need this if your app implements code splitting and you want to
         * load some of the reducers dynamically. You might also need this if you
         * implement a hot reloading mechanism for Redux.
         *
         * @param {Function} nextReducer The reducer for the store to use instead.
         * @returns {void}
         */


        function replaceReducer(nextReducer) {
          if (typeof nextReducer !== 'function') {
            throw new Error(formatProdErrorMessage(10) );
          }

          currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
          // Any reducers that existed in both the new and old rootReducer
          // will receive the previous state. This effectively populates
          // the new state tree with any relevant data from the old one.

          dispatch({
            type: ActionTypes.REPLACE
          });
        }
        /**
         * Interoperability point for observable/reactive libraries.
         * @returns {observable} A minimal observable of state changes.
         * For more information, see the observable proposal:
         * https://github.com/tc39/proposal-observable
         */


        function observable() {
          var _ref;

          var outerSubscribe = subscribe;
          return _ref = {
            /**
             * The minimal observable subscription method.
             * @param {Object} observer Any object that can be used as an observer.
             * The observer object should have a `next` method.
             * @returns {subscription} An object with an `unsubscribe` method that can
             * be used to unsubscribe the observable from the store, and prevent further
             * emission of values from the observable.
             */
            subscribe: function subscribe(observer) {
              if (typeof observer !== 'object' || observer === null) {
                throw new Error(formatProdErrorMessage(11) );
              }

              function observeState() {
                if (observer.next) {
                  observer.next(getState());
                }
              }

              observeState();
              var unsubscribe = outerSubscribe(observeState);
              return {
                unsubscribe: unsubscribe
              };
            }
          }, _ref[$$observable] = function () {
            return this;
          }, _ref;
        } // When a store is created, an "INIT" action is dispatched so that every
        // reducer returns their initial state. This effectively populates
        // the initial state tree.


        dispatch({
          type: ActionTypes.INIT
        });
        return _ref2 = {
          dispatch: dispatch,
          subscribe: subscribe,
          getState: getState,
          replaceReducer: replaceReducer
        }, _ref2[$$observable] = observable, _ref2;
      }

      var strictEquality = function strictEquality(a, b) {
        return a === b;
      };
      /**
       * Determine if two cartesian coordinate offsets are equal
       * @param offsetA
       * @param offsetB
       */

      function areCoordsEqual(offsetA, offsetB) {
        if (!offsetA && !offsetB) {
          return true;
        } else if (!offsetA || !offsetB) {
          return false;
        } else {
          return offsetA.x === offsetB.x && offsetA.y === offsetB.y;
        }
      }
      /**
       * Determines if two arrays of items are equal
       * @param a The first array of items
       * @param b The second array of items
       */

      function areArraysEqual(a, b) {
        var isEqual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : strictEquality;

        if (a.length !== b.length) {
          return false;
        }

        for (var i = 0; i < a.length; ++i) {
          if (!isEqual(a[i], b[i])) {
            return false;
          }
        }

        return true;
      }

      function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

      function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty$f(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

      function _defineProperty$f(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var initialState$1 = {
        initialSourceClientOffset: null,
        initialClientOffset: null,
        clientOffset: null
      };
      function reduce$5() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState$1;
        var action = arguments.length > 1 ? arguments[1] : undefined;
        var payload = action.payload;

        switch (action.type) {
          case INIT_COORDS:
          case BEGIN_DRAG:
            return {
              initialSourceClientOffset: payload.sourceClientOffset,
              initialClientOffset: payload.clientOffset,
              clientOffset: payload.clientOffset
            };

          case HOVER:
            if (areCoordsEqual(state.clientOffset, payload.clientOffset)) {
              return state;
            }

            return _objectSpread$2(_objectSpread$2({}, state), {}, {
              clientOffset: payload.clientOffset
            });

          case END_DRAG:
          case DROP:
            return initialState$1;

          default:
            return state;
        }
      }

      var ADD_SOURCE = 'dnd-core/ADD_SOURCE';
      var ADD_TARGET = 'dnd-core/ADD_TARGET';
      var REMOVE_SOURCE = 'dnd-core/REMOVE_SOURCE';
      var REMOVE_TARGET = 'dnd-core/REMOVE_TARGET';
      function addSource(sourceId) {
        return {
          type: ADD_SOURCE,
          payload: {
            sourceId: sourceId
          }
        };
      }
      function addTarget(targetId) {
        return {
          type: ADD_TARGET,
          payload: {
            targetId: targetId
          }
        };
      }
      function removeSource(sourceId) {
        return {
          type: REMOVE_SOURCE,
          payload: {
            sourceId: sourceId
          }
        };
      }
      function removeTarget(targetId) {
        return {
          type: REMOVE_TARGET,
          payload: {
            targetId: targetId
          }
        };
      }

      function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

      function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$e(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

      function _defineProperty$e(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var initialState = {
        itemType: null,
        item: null,
        sourceId: null,
        targetIds: [],
        dropResult: null,
        didDrop: false,
        isSourcePublic: null
      };
      function reduce$4() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments.length > 1 ? arguments[1] : undefined;
        var payload = action.payload;

        switch (action.type) {
          case BEGIN_DRAG:
            return _objectSpread$1(_objectSpread$1({}, state), {}, {
              itemType: payload.itemType,
              item: payload.item,
              sourceId: payload.sourceId,
              isSourcePublic: payload.isSourcePublic,
              dropResult: null,
              didDrop: false
            });

          case PUBLISH_DRAG_SOURCE:
            return _objectSpread$1(_objectSpread$1({}, state), {}, {
              isSourcePublic: true
            });

          case HOVER:
            return _objectSpread$1(_objectSpread$1({}, state), {}, {
              targetIds: payload.targetIds
            });

          case REMOVE_TARGET:
            if (state.targetIds.indexOf(payload.targetId) === -1) {
              return state;
            }

            return _objectSpread$1(_objectSpread$1({}, state), {}, {
              targetIds: without(state.targetIds, payload.targetId)
            });

          case DROP:
            return _objectSpread$1(_objectSpread$1({}, state), {}, {
              dropResult: payload.dropResult,
              didDrop: true,
              targetIds: []
            });

          case END_DRAG:
            return _objectSpread$1(_objectSpread$1({}, state), {}, {
              itemType: null,
              item: null,
              sourceId: null,
              dropResult: null,
              didDrop: false,
              isSourcePublic: null,
              targetIds: []
            });

          default:
            return state;
        }
      }

      function reduce$3() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var action = arguments.length > 1 ? arguments[1] : undefined;

        switch (action.type) {
          case ADD_SOURCE:
          case ADD_TARGET:
            return state + 1;

          case REMOVE_SOURCE:
          case REMOVE_TARGET:
            return state - 1;

          default:
            return state;
        }
      }

      var NONE = [];
      var ALL = [];
      NONE.__IS_NONE__ = true;
      ALL.__IS_ALL__ = true;
      /**
       * Determines if the given handler IDs are dirty or not.
       *
       * @param dirtyIds The set of dirty handler ids
       * @param handlerIds The set of handler ids to check
       */

      function areDirty(dirtyIds, handlerIds) {
        if (dirtyIds === NONE) {
          return false;
        }

        if (dirtyIds === ALL || typeof handlerIds === 'undefined') {
          return true;
        }

        var commonIds = intersection(handlerIds, dirtyIds);
        return commonIds.length > 0;
      }

      function reduce$2() {

        var action = arguments.length > 1 ? arguments[1] : undefined;

        switch (action.type) {
          case HOVER:
            break;

          case ADD_SOURCE:
          case ADD_TARGET:
          case REMOVE_TARGET:
          case REMOVE_SOURCE:
            return NONE;

          case BEGIN_DRAG:
          case PUBLISH_DRAG_SOURCE:
          case END_DRAG:
          case DROP:
          default:
            return ALL;
        }

        var _action$payload = action.payload,
            _action$payload$targe = _action$payload.targetIds,
            targetIds = _action$payload$targe === void 0 ? [] : _action$payload$targe,
            _action$payload$prevT = _action$payload.prevTargetIds,
            prevTargetIds = _action$payload$prevT === void 0 ? [] : _action$payload$prevT;
        var result = xor(targetIds, prevTargetIds);
        var didChange = result.length > 0 || !areArraysEqual(targetIds, prevTargetIds);

        if (!didChange) {
          return NONE;
        } // Check the target ids at the innermost position. If they are valid, add them
        // to the result


        var prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
        var innermostTargetId = targetIds[targetIds.length - 1];

        if (prevInnermostTargetId !== innermostTargetId) {
          if (prevInnermostTargetId) {
            result.push(prevInnermostTargetId);
          }

          if (innermostTargetId) {
            result.push(innermostTargetId);
          }
        }

        return result;
      }

      function reduce$1() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        return state + 1;
      }

      function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

      function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty$d(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

      function _defineProperty$d(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      function reduce() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var action = arguments.length > 1 ? arguments[1] : undefined;
        return {
          dirtyHandlerIds: reduce$2(state.dirtyHandlerIds, {
            type: action.type,
            payload: _objectSpread(_objectSpread({}, action.payload), {}, {
              prevTargetIds: get(state, 'dragOperation.targetIds', [])
            })
          }),
          dragOffset: reduce$5(state.dragOffset, action),
          refCount: reduce$3(state.refCount, action),
          dragOperation: reduce$4(state.dragOperation, action),
          stateId: reduce$1(state.stateId)
        };
      }

      /**
       * Coordinate addition
       * @param a The first coordinate
       * @param b The second coordinate
       */
      function add(a, b) {
        return {
          x: a.x + b.x,
          y: a.y + b.y
        };
      }
      /**
       * Coordinate subtraction
       * @param a The first coordinate
       * @param b The second coordinate
       */

      function subtract(a, b) {
        return {
          x: a.x - b.x,
          y: a.y - b.y
        };
      }
      /**
       * Returns the cartesian distance of the drag source component's position, based on its position
       * at the time when the current drag operation has started, and the movement difference.
       *
       * Returns null if no item is being dragged.
       *
       * @param state The offset state to compute from
       */

      function getSourceClientOffset(state) {
        var clientOffset = state.clientOffset,
            initialClientOffset = state.initialClientOffset,
            initialSourceClientOffset = state.initialSourceClientOffset;

        if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
          return null;
        }

        return subtract(add(clientOffset, initialSourceClientOffset), initialClientOffset);
      }
      /**
       * Determines the x,y offset between the client offset and the initial client offset
       *
       * @param state The offset state to compute from
       */

      function getDifferenceFromInitialOffset(state) {
        var clientOffset = state.clientOffset,
            initialClientOffset = state.initialClientOffset;

        if (!clientOffset || !initialClientOffset) {
          return null;
        }

        return subtract(clientOffset, initialClientOffset);
      }

      function _classCallCheck$c(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$c(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$c(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$c(Constructor.prototype, protoProps); if (staticProps) _defineProperties$c(Constructor, staticProps); return Constructor; }

      function _defineProperty$c(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var DragDropMonitorImpl = /*#__PURE__*/function () {
        function DragDropMonitorImpl(store, registry) {
          _classCallCheck$c(this, DragDropMonitorImpl);

          _defineProperty$c(this, "store", void 0);

          _defineProperty$c(this, "registry", void 0);

          this.store = store;
          this.registry = registry;
        }

        _createClass$c(DragDropMonitorImpl, [{
          key: "subscribeToStateChange",
          value: function subscribeToStateChange(listener) {
            var _this = this;

            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
              handlerIds: undefined
            };
            var handlerIds = options.handlerIds;
            invariant(typeof listener === 'function', 'listener must be a function.');
            invariant(typeof handlerIds === 'undefined' || Array.isArray(handlerIds), 'handlerIds, when specified, must be an array of strings.');
            var prevStateId = this.store.getState().stateId;

            var handleChange = function handleChange() {
              var state = _this.store.getState();

              var currentStateId = state.stateId;

              try {
                var canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !areDirty(state.dirtyHandlerIds, handlerIds);

                if (!canSkipListener) {
                  listener();
                }
              } finally {
                prevStateId = currentStateId;
              }
            };

            return this.store.subscribe(handleChange);
          }
        }, {
          key: "subscribeToOffsetChange",
          value: function subscribeToOffsetChange(listener) {
            var _this2 = this;

            invariant(typeof listener === 'function', 'listener must be a function.');
            var previousState = this.store.getState().dragOffset;

            var handleChange = function handleChange() {
              var nextState = _this2.store.getState().dragOffset;

              if (nextState === previousState) {
                return;
              }

              previousState = nextState;
              listener();
            };

            return this.store.subscribe(handleChange);
          }
        }, {
          key: "canDragSource",
          value: function canDragSource(sourceId) {
            if (!sourceId) {
              return false;
            }

            var source = this.registry.getSource(sourceId);
            invariant(source, "Expected to find a valid source. sourceId=".concat(sourceId));

            if (this.isDragging()) {
              return false;
            }

            return source.canDrag(this, sourceId);
          }
        }, {
          key: "canDropOnTarget",
          value: function canDropOnTarget(targetId) {
            // undefined on initial render
            if (!targetId) {
              return false;
            }

            var target = this.registry.getTarget(targetId);
            invariant(target, "Expected to find a valid target. targetId=".concat(targetId));

            if (!this.isDragging() || this.didDrop()) {
              return false;
            }

            var targetType = this.registry.getTargetType(targetId);
            var draggedItemType = this.getItemType();
            return matchesType(targetType, draggedItemType) && target.canDrop(this, targetId);
          }
        }, {
          key: "isDragging",
          value: function isDragging() {
            return Boolean(this.getItemType());
          }
        }, {
          key: "isDraggingSource",
          value: function isDraggingSource(sourceId) {
            // undefined on initial render
            if (!sourceId) {
              return false;
            }

            var source = this.registry.getSource(sourceId, true);
            invariant(source, "Expected to find a valid source. sourceId=".concat(sourceId));

            if (!this.isDragging() || !this.isSourcePublic()) {
              return false;
            }

            var sourceType = this.registry.getSourceType(sourceId);
            var draggedItemType = this.getItemType();

            if (sourceType !== draggedItemType) {
              return false;
            }

            return source.isDragging(this, sourceId);
          }
        }, {
          key: "isOverTarget",
          value: function isOverTarget(targetId) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
              shallow: false
            };

            // undefined on initial render
            if (!targetId) {
              return false;
            }

            var shallow = options.shallow;

            if (!this.isDragging()) {
              return false;
            }

            var targetType = this.registry.getTargetType(targetId);
            var draggedItemType = this.getItemType();

            if (draggedItemType && !matchesType(targetType, draggedItemType)) {
              return false;
            }

            var targetIds = this.getTargetIds();

            if (!targetIds.length) {
              return false;
            }

            var index = targetIds.indexOf(targetId);

            if (shallow) {
              return index === targetIds.length - 1;
            } else {
              return index > -1;
            }
          }
        }, {
          key: "getItemType",
          value: function getItemType() {
            return this.store.getState().dragOperation.itemType;
          }
        }, {
          key: "getItem",
          value: function getItem() {
            return this.store.getState().dragOperation.item;
          }
        }, {
          key: "getSourceId",
          value: function getSourceId() {
            return this.store.getState().dragOperation.sourceId;
          }
        }, {
          key: "getTargetIds",
          value: function getTargetIds() {
            return this.store.getState().dragOperation.targetIds;
          }
        }, {
          key: "getDropResult",
          value: function getDropResult() {
            return this.store.getState().dragOperation.dropResult;
          }
        }, {
          key: "didDrop",
          value: function didDrop() {
            return this.store.getState().dragOperation.didDrop;
          }
        }, {
          key: "isSourcePublic",
          value: function isSourcePublic() {
            return Boolean(this.store.getState().dragOperation.isSourcePublic);
          }
        }, {
          key: "getInitialClientOffset",
          value: function getInitialClientOffset() {
            return this.store.getState().dragOffset.initialClientOffset;
          }
        }, {
          key: "getInitialSourceClientOffset",
          value: function getInitialSourceClientOffset() {
            return this.store.getState().dragOffset.initialSourceClientOffset;
          }
        }, {
          key: "getClientOffset",
          value: function getClientOffset() {
            return this.store.getState().dragOffset.clientOffset;
          }
        }, {
          key: "getSourceClientOffset",
          value: function getSourceClientOffset$1() {
            return getSourceClientOffset(this.store.getState().dragOffset);
          }
        }, {
          key: "getDifferenceFromInitialOffset",
          value: function getDifferenceFromInitialOffset$1() {
            return getDifferenceFromInitialOffset(this.store.getState().dragOffset);
          }
        }]);

        return DragDropMonitorImpl;
      }();

      var nextUniqueId = 0;
      function getNextUniqueId() {
        return nextUniqueId++;
      }

      function _typeof$5(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$5 = function _typeof(obj) { return typeof obj; }; } else { _typeof$5 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$5(obj); }
      function validateSourceContract(source) {
        invariant(typeof source.canDrag === 'function', 'Expected canDrag to be a function.');
        invariant(typeof source.beginDrag === 'function', 'Expected beginDrag to be a function.');
        invariant(typeof source.endDrag === 'function', 'Expected endDrag to be a function.');
      }
      function validateTargetContract(target) {
        invariant(typeof target.canDrop === 'function', 'Expected canDrop to be a function.');
        invariant(typeof target.hover === 'function', 'Expected hover to be a function.');
        invariant(typeof target.drop === 'function', 'Expected beginDrag to be a function.');
      }
      function validateType(type, allowArray) {
        if (allowArray && Array.isArray(type)) {
          type.forEach(function (t) {
            return validateType(t, false);
          });
          return;
        }

        invariant(typeof type === 'string' || _typeof$5(type) === 'symbol', allowArray ? 'Type can only be a string, a symbol, or an array of either.' : 'Type can only be a string or a symbol.');
      }

      // Use the fastest means possible to execute a task in its own turn, with
      // priority over other events including IO, animation, reflow, and redraw
      // events in browsers.
      //
      // An exception thrown by a task will permanently interrupt the processing of
      // subsequent tasks. The higher level `asap` function ensures that if an
      // exception is thrown by a task, that the task queue will continue flushing as
      // soon as possible, but if you use `rawAsap` directly, you are responsible to
      // either ensure that no exceptions are thrown from your task, or to manually
      // call `rawAsap.requestFlush` if an exception is thrown.
      function rawAsap(task) {
        if (!queue.length) {
          requestFlush();
        } // Equivalent to push, but avoids a function call.


        queue[queue.length] = task;
      }
      var queue = []; // Once a flush has been requested, no further calls to `requestFlush` are
      // off a `flush` event as quickly as possible. `flush` will attempt to exhaust
      // the event queue before yielding to the browser's own event loop.

      var requestFlush; // The position of the next task to execute in the task queue. This is
      // preserved between calls to `flush` so that it can be resumed if
      // a task throws an exception.

      var index = 0; // If a task schedules additional tasks recursively, the task queue can grow
      // unbounded. To prevent memory exhaustion, the task queue will periodically
      // truncate already-completed tasks.

      var capacity = 1024; // The flush function processes all tasks that have been scheduled with
      // `rawAsap` unless and until one of those tasks throws an exception.
      // If a task throws an exception, `flush` ensures that its state will remain
      // consistent and will resume where it left off when called again.
      // However, `flush` does not make any arrangements to be called again if an
      // exception is thrown.

      function flush() {
        while (index < queue.length) {
          var currentIndex = index; // Advance the index before calling the task. This ensures that we will
          // begin flushing on the next task the task throws an error.

          index = index + 1;
          queue[currentIndex].call(); // Prevent leaking memory for long chains of recursive calls to `asap`.
          // If we call `asap` within tasks scheduled by `asap`, the queue will
          // grow, but to avoid an O(n) walk for every task we execute, we don't
          // shift tasks off the queue after they have been executed.
          // Instead, we periodically shift 1024 tasks off the queue.

          if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
              queue[scan] = queue[scan + index];
            }

            queue.length -= index;
            index = 0;
          }
        }

        queue.length = 0;
        index = 0;
      } // `requestFlush` is implemented using a strategy based on data collected from
      // every available SauceLabs Selenium web driver worker at time of writing.
      // https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593
      // Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
      // have WebKitMutationObserver but not un-prefixed MutationObserver.
      // Must use `global` or `self` instead of `window` to work in both frames and web
      // workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

      /* globals self */


      var scope = typeof global !== 'undefined' ? global : self;
      var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver; // MutationObservers are desirable because they have high priority and work
      // reliably everywhere they are implemented.
      // They are implemented in all modern browsers.
      //
      // - Android 4-4.3
      // - Chrome 26-34
      // - Firefox 14-29
      // - Internet Explorer 11
      // - iPad Safari 6-7.1
      // - iPhone Safari 7-7.1
      // - Safari 6-7

      if (typeof BrowserMutationObserver === 'function') {
        requestFlush = makeRequestCallFromMutationObserver(flush); // MessageChannels are desirable because they give direct access to the HTML
        // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
        // 11-12, and in web workers in many engines.
        // Although message channels yield to any queued rendering and IO tasks, they
        // would be better than imposing the 4ms delay of timers.
        // However, they do not work reliably in Internet Explorer or Safari.
        // Internet Explorer 10 is the only browser that has setImmediate but does
        // not have MutationObservers.
        // Although setImmediate yields to the browser's renderer, it would be
        // preferrable to falling back to setTimeout since it does not have
        // the minimum 4ms penalty.
        // Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
        // Desktop to a lesser extent) that renders both setImmediate and
        // MessageChannel useless for the purposes of ASAP.
        // https://github.com/kriskowal/q/issues/396
        // Timers are implemented universally.
        // We fall back to timers in workers in most engines, and in foreground
        // contexts in the following browsers.
        // However, note that even this simple case requires nuances to operate in a
        // broad spectrum of browsers.
        //
        // - Firefox 3-13
        // - Internet Explorer 6-9
        // - iPad Safari 4.3
        // - Lynx 2.8.7
      } else {
        requestFlush = makeRequestCallFromTimer(flush);
      } // `requestFlush` requests that the high priority event queue be flushed as
      // soon as possible.
      // This is useful to prevent an error thrown in a task from stalling the event
      // queue if the exception handled by Node.js’s
      // `process.on("uncaughtException")` or by a domain.


      rawAsap.requestFlush = requestFlush; // To request a high priority event, we induce a mutation observer by toggling
      // the text of a text node between "1" and "-1".

      function makeRequestCallFromMutationObserver(callback) {
        var toggle = 1;
        var observer = new BrowserMutationObserver(callback);
        var node = document.createTextNode('');
        observer.observe(node, {
          characterData: true
        });
        return function requestCall() {
          toggle = -toggle;
          node.data = toggle;
        };
      } // The message channel technique was discovered by Malte Ubl and was the
      // original foundation for this library.
      // http://www.nonblocking.io/2011/06/windownexttick.html
      // Safari 6.0.5 (at least) intermittently fails to create message ports on a
      // page's first load. Thankfully, this version of Safari supports
      // MutationObservers, so we don't need to fall back in that case.
      // function makeRequestCallFromMessageChannel(callback) {
      //     var channel = new MessageChannel();
      //     channel.port1.onmessage = callback;
      //     return function requestCall() {
      //         channel.port2.postMessage(0);
      //     };
      // }
      // For reasons explained above, we are also unable to use `setImmediate`
      // under any circumstances.
      // Even if we were, there is another bug in Internet Explorer 10.
      // It is not sufficient to assign `setImmediate` to `requestFlush` because
      // `setImmediate` must be called *by name* and therefore must be wrapped in a
      // closure.
      // Never forget.
      // function makeRequestCallFromSetImmediate(callback) {
      //     return function requestCall() {
      //         setImmediate(callback);
      //     };
      // }
      // Safari 6.0 has a problem where timers will get lost while the user is
      // scrolling. This problem does not impact ASAP because Safari 6.0 supports
      // mutation observers, so that implementation is used instead.
      // However, if we ever elect to use timers in Safari, the prevalent work-around
      // is to add a scroll event listener that calls for a flush.
      // `setTimeout` does not call the passed callback if the delay is less than
      // approximately 7 in web workers in Firefox 8 through 18, and sometimes not
      // even then.


      function makeRequestCallFromTimer(callback) {
        return function requestCall() {
          // We dispatch a timeout with a specified delay of 0 for engines that
          // can reliably accommodate that request. This will usually be snapped
          // to a 4 milisecond delay, but once we're flushing, there's no delay
          // between events.
          var timeoutHandle = setTimeout(handleTimer, 0); // However, since this timer gets frequently dropped in Firefox
          // workers, we enlist an interval handle that will try to fire
          // an event 20 times per second until it succeeds.

          var intervalHandle = setInterval(handleTimer, 50);

          function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
          }
        };
      } // This is for `asap.js` only.
      // Its name will be periodically randomized to break any code that depends on
      // its existence.


      rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer; // ASAP was originally a nextTick shim included in Q. This was factored out
      // into this ASAP package. It was later adapted to RSVP which made further
      // amendments. These decisions, particularly to marginalize MessageChannel and
      // to capture the MutationObserver implementation in a closure, were integrated
      // back into ASAP proper.
      // https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

      // RawTasks are recycled to reduce GC churn.

      var freeTasks = []; // We queue errors to ensure they are thrown in right order (FIFO).
      // Array-as-queue is good enough here, since we are just dealing with exceptions.

      var pendingErrors = [];
      var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

      function throwFirstError() {
        if (pendingErrors.length) {
          throw pendingErrors.shift();
        }
      }
      /**
       * Calls a task as soon as possible after returning, in its own event, with priority
       * over other events like animation, reflow, and repaint. An error thrown from an
       * event will not interrupt, nor even substantially slow down the processing of
       * other events, but will be rather postponed to a lower priority event.
       * @param {{call}} task A callable object, typically a function that takes no
       * arguments.
       */


      function asap(task) {
        var rawTask;

        if (freeTasks.length) {
          rawTask = freeTasks.pop();
        } else {
          rawTask = new RawTask();
        }

        rawTask.task = task;
        rawAsap(rawTask);
      } // We wrap tasks with recyclable task objects.  A task object implements
      // `call`, just like a function.

      var RawTask =
      /** @class */
      function () {
        function RawTask() {}

        RawTask.prototype.call = function () {
          try {
            this.task.call();
          } catch (error) {
            if (asap.onerror) {
              // This hook exists purely for testing purposes.
              // Its name will be periodically randomized to break any code that
              // depends on its existence.
              asap.onerror(error);
            } else {
              // In a web browser, exceptions are not fatal. However, to avoid
              // slowing down the queue of pending tasks, we rethrow the error in a
              // lower priority turn.
              pendingErrors.push(error);
              requestErrorThrow();
            }
          } finally {
            this.task = null;
            freeTasks[freeTasks.length] = this;
          }
        };

        return RawTask;
      }();

      function _classCallCheck$b(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$b(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$b(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$b(Constructor.prototype, protoProps); if (staticProps) _defineProperties$b(Constructor, staticProps); return Constructor; }

      function _defineProperty$b(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

      function _slicedToArray$7(arr, i) { return _arrayWithHoles$7(arr) || _iterableToArrayLimit$7(arr, i) || _unsupportedIterableToArray$8(arr, i) || _nonIterableRest$7(); }

      function _nonIterableRest$7() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray$8(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$8(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$8(o, minLen); }

      function _arrayLikeToArray$8(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

      function _iterableToArrayLimit$7(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

      function _arrayWithHoles$7(arr) { if (Array.isArray(arr)) return arr; }

      function getNextHandlerId(role) {
        var id = getNextUniqueId().toString();

        switch (role) {
          case HandlerRole.SOURCE:
            return "S".concat(id);

          case HandlerRole.TARGET:
            return "T".concat(id);

          default:
            throw new Error("Unknown Handler Role: ".concat(role));
        }
      }

      function parseRoleFromHandlerId(handlerId) {
        switch (handlerId[0]) {
          case 'S':
            return HandlerRole.SOURCE;

          case 'T':
            return HandlerRole.TARGET;

          default:
            invariant(false, "Cannot parse handler ID: ".concat(handlerId));
        }
      }

      function mapContainsValue(map, searchValue) {
        var entries = map.entries();
        var isDone = false;

        do {
          var _entries$next = entries.next(),
              done = _entries$next.done,
              _entries$next$value = _slicedToArray$7(_entries$next.value, 2),
              value = _entries$next$value[1];

          if (value === searchValue) {
            return true;
          }

          isDone = !!done;
        } while (!isDone);

        return false;
      }

      var HandlerRegistryImpl = /*#__PURE__*/function () {
        function HandlerRegistryImpl(store) {
          _classCallCheck$b(this, HandlerRegistryImpl);

          _defineProperty$b(this, "types", new Map());

          _defineProperty$b(this, "dragSources", new Map());

          _defineProperty$b(this, "dropTargets", new Map());

          _defineProperty$b(this, "pinnedSourceId", null);

          _defineProperty$b(this, "pinnedSource", null);

          _defineProperty$b(this, "store", void 0);

          this.store = store;
        }

        _createClass$b(HandlerRegistryImpl, [{
          key: "addSource",
          value: function addSource$1(type, source) {
            validateType(type);
            validateSourceContract(source);
            var sourceId = this.addHandler(HandlerRole.SOURCE, type, source);
            this.store.dispatch(addSource(sourceId));
            return sourceId;
          }
        }, {
          key: "addTarget",
          value: function addTarget$1(type, target) {
            validateType(type, true);
            validateTargetContract(target);
            var targetId = this.addHandler(HandlerRole.TARGET, type, target);
            this.store.dispatch(addTarget(targetId));
            return targetId;
          }
        }, {
          key: "containsHandler",
          value: function containsHandler(handler) {
            return mapContainsValue(this.dragSources, handler) || mapContainsValue(this.dropTargets, handler);
          }
        }, {
          key: "getSource",
          value: function getSource(sourceId) {
            var includePinned = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
            var isPinned = includePinned && sourceId === this.pinnedSourceId;
            var source = isPinned ? this.pinnedSource : this.dragSources.get(sourceId);
            return source;
          }
        }, {
          key: "getTarget",
          value: function getTarget(targetId) {
            invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
            return this.dropTargets.get(targetId);
          }
        }, {
          key: "getSourceType",
          value: function getSourceType(sourceId) {
            invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
            return this.types.get(sourceId);
          }
        }, {
          key: "getTargetType",
          value: function getTargetType(targetId) {
            invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
            return this.types.get(targetId);
          }
        }, {
          key: "isSourceId",
          value: function isSourceId(handlerId) {
            var role = parseRoleFromHandlerId(handlerId);
            return role === HandlerRole.SOURCE;
          }
        }, {
          key: "isTargetId",
          value: function isTargetId(handlerId) {
            var role = parseRoleFromHandlerId(handlerId);
            return role === HandlerRole.TARGET;
          }
        }, {
          key: "removeSource",
          value: function removeSource$1(sourceId) {
            var _this = this;

            invariant(this.getSource(sourceId), 'Expected an existing source.');
            this.store.dispatch(removeSource(sourceId));
            asap(function () {
              _this.dragSources.delete(sourceId);

              _this.types.delete(sourceId);
            });
          }
        }, {
          key: "removeTarget",
          value: function removeTarget$1(targetId) {
            invariant(this.getTarget(targetId), 'Expected an existing target.');
            this.store.dispatch(removeTarget(targetId));
            this.dropTargets.delete(targetId);
            this.types.delete(targetId);
          }
        }, {
          key: "pinSource",
          value: function pinSource(sourceId) {
            var source = this.getSource(sourceId);
            invariant(source, 'Expected an existing source.');
            this.pinnedSourceId = sourceId;
            this.pinnedSource = source;
          }
        }, {
          key: "unpinSource",
          value: function unpinSource() {
            invariant(this.pinnedSource, 'No source is pinned at the time.');
            this.pinnedSourceId = null;
            this.pinnedSource = null;
          }
        }, {
          key: "addHandler",
          value: function addHandler(role, type, handler) {
            var id = getNextHandlerId(role);
            this.types.set(id, type);

            if (role === HandlerRole.SOURCE) {
              this.dragSources.set(id, handler);
            } else if (role === HandlerRole.TARGET) {
              this.dropTargets.set(id, handler);
            }

            return id;
          }
        }]);

        return HandlerRegistryImpl;
      }();

      function createDragDropManager(backendFactory) {
        var globalContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var backendOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var debugMode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var store = makeStoreInstance(debugMode);
        var monitor = new DragDropMonitorImpl(store, new HandlerRegistryImpl(store));
        var manager = new DragDropManagerImpl(store, monitor);
        var backend = backendFactory(manager, globalContext, backendOptions);
        manager.receiveBackend(backend);
        return manager;
      }

      function makeStoreInstance(debugMode) {
        // TODO: if we ever make a react-native version of this,
        // we'll need to consider how to pull off dev-tooling
        var reduxDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;
        return createStore(reduce, debugMode && reduxDevTools && reduxDevTools({
          name: 'dnd-core',
          instanceId: 'dnd-core'
        }));
      }

      var _excluded = ["children"];

      function _slicedToArray$6(arr, i) { return _arrayWithHoles$6(arr) || _iterableToArrayLimit$6(arr, i) || _unsupportedIterableToArray$7(arr, i) || _nonIterableRest$6(); }

      function _nonIterableRest$6() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray$7(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$7(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$7(o, minLen); }

      function _arrayLikeToArray$7(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

      function _iterableToArrayLimit$6(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

      function _arrayWithHoles$6(arr) { if (Array.isArray(arr)) return arr; }

      function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

      function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
      var refCount = 0;
      var INSTANCE_SYM = Symbol.for('__REACT_DND_CONTEXT_INSTANCE__');
      /**
       * A React component that provides the React-DnD context
       */

      var DndProvider = exports('DndProvider', memo(function DndProvider(_ref) {
        var children = _ref.children,
            props = _objectWithoutProperties(_ref, _excluded);

        var _getDndContextValue = getDndContextValue(props),
            _getDndContextValue2 = _slicedToArray$6(_getDndContextValue, 2),
            manager = _getDndContextValue2[0],
            isGlobalInstance = _getDndContextValue2[1]; // memoized from props

        /**
         * If the global context was used to store the DND context
         * then where theres no more references to it we should
         * clean it up to avoid memory leaks
         */


        useEffect(function () {
          if (isGlobalInstance) {
            var context = getGlobalContext();
            ++refCount;
            return function () {
              if (--refCount === 0) {
                context[INSTANCE_SYM] = null;
              }
            };
          }
        }, []);
        return jsxRuntime.exports.jsx(DndContext.Provider, Object.assign({
          value: manager
        }, {
          children: children
        }), void 0);
      }));

      function getDndContextValue(props) {
        if ('manager' in props) {
          var _manager = {
            dragDropManager: props.manager
          };
          return [_manager, false];
        }

        var manager = createSingletonDndContext(props.backend, props.context, props.options, props.debugMode);
        var isGlobalInstance = !props.context;
        return [manager, isGlobalInstance];
      }

      function createSingletonDndContext(backend) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getGlobalContext();
        var options = arguments.length > 2 ? arguments[2] : undefined;
        var debugMode = arguments.length > 3 ? arguments[3] : undefined;
        var ctx = context;

        if (!ctx[INSTANCE_SYM]) {
          ctx[INSTANCE_SYM] = {
            dragDropManager: createDragDropManager(backend, context, options, debugMode)
          };
        }

        return ctx[INSTANCE_SYM];
      }

      function getGlobalContext() {
        return typeof global !== 'undefined' ? global : window;
      }

      /**
       * A utility for rendering a drag preview image
       */

      var DragPreviewImage = exports('DragPreviewImage', memo(function DragPreviewImage(_ref) {
        var connect = _ref.connect,
            src = _ref.src;
        useEffect(function () {
          if (typeof Image === 'undefined') return;
          var connected = false;
          var img = new Image();
          img.src = src;

          img.onload = function () {
            connect(img);
            connected = true;
          };

          return function () {
            if (connected) {
              connect(null);
            }
          };
        });
        return null;
      }));

      function _classCallCheck$a(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$a(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$a(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$a(Constructor.prototype, protoProps); if (staticProps) _defineProperties$a(Constructor, staticProps); return Constructor; }

      function _defineProperty$a(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var isCallingCanDrag = false;
      var isCallingIsDragging = false;
      var DragSourceMonitorImpl = /*#__PURE__*/function () {
        function DragSourceMonitorImpl(manager) {
          _classCallCheck$a(this, DragSourceMonitorImpl);

          _defineProperty$a(this, "internalMonitor", void 0);

          _defineProperty$a(this, "sourceId", null);

          this.internalMonitor = manager.getMonitor();
        }

        _createClass$a(DragSourceMonitorImpl, [{
          key: "receiveHandlerId",
          value: function receiveHandlerId(sourceId) {
            this.sourceId = sourceId;
          }
        }, {
          key: "getHandlerId",
          value: function getHandlerId() {
            return this.sourceId;
          }
        }, {
          key: "canDrag",
          value: function canDrag() {
            invariant(!isCallingCanDrag, 'You may not call monitor.canDrag() inside your canDrag() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor');

            try {
              isCallingCanDrag = true;
              return this.internalMonitor.canDragSource(this.sourceId);
            } finally {
              isCallingCanDrag = false;
            }
          }
        }, {
          key: "isDragging",
          value: function isDragging() {
            if (!this.sourceId) {
              return false;
            }

            invariant(!isCallingIsDragging, 'You may not call monitor.isDragging() inside your isDragging() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source-monitor');

            try {
              isCallingIsDragging = true;
              return this.internalMonitor.isDraggingSource(this.sourceId);
            } finally {
              isCallingIsDragging = false;
            }
          }
        }, {
          key: "subscribeToStateChange",
          value: function subscribeToStateChange(listener, options) {
            return this.internalMonitor.subscribeToStateChange(listener, options);
          }
        }, {
          key: "isDraggingSource",
          value: function isDraggingSource(sourceId) {
            return this.internalMonitor.isDraggingSource(sourceId);
          }
        }, {
          key: "isOverTarget",
          value: function isOverTarget(targetId, options) {
            return this.internalMonitor.isOverTarget(targetId, options);
          }
        }, {
          key: "getTargetIds",
          value: function getTargetIds() {
            return this.internalMonitor.getTargetIds();
          }
        }, {
          key: "isSourcePublic",
          value: function isSourcePublic() {
            return this.internalMonitor.isSourcePublic();
          }
        }, {
          key: "getSourceId",
          value: function getSourceId() {
            return this.internalMonitor.getSourceId();
          }
        }, {
          key: "subscribeToOffsetChange",
          value: function subscribeToOffsetChange(listener) {
            return this.internalMonitor.subscribeToOffsetChange(listener);
          }
        }, {
          key: "canDragSource",
          value: function canDragSource(sourceId) {
            return this.internalMonitor.canDragSource(sourceId);
          }
        }, {
          key: "canDropOnTarget",
          value: function canDropOnTarget(targetId) {
            return this.internalMonitor.canDropOnTarget(targetId);
          }
        }, {
          key: "getItemType",
          value: function getItemType() {
            return this.internalMonitor.getItemType();
          }
        }, {
          key: "getItem",
          value: function getItem() {
            return this.internalMonitor.getItem();
          }
        }, {
          key: "getDropResult",
          value: function getDropResult() {
            return this.internalMonitor.getDropResult();
          }
        }, {
          key: "didDrop",
          value: function didDrop() {
            return this.internalMonitor.didDrop();
          }
        }, {
          key: "getInitialClientOffset",
          value: function getInitialClientOffset() {
            return this.internalMonitor.getInitialClientOffset();
          }
        }, {
          key: "getInitialSourceClientOffset",
          value: function getInitialSourceClientOffset() {
            return this.internalMonitor.getInitialSourceClientOffset();
          }
        }, {
          key: "getSourceClientOffset",
          value: function getSourceClientOffset() {
            return this.internalMonitor.getSourceClientOffset();
          }
        }, {
          key: "getClientOffset",
          value: function getClientOffset() {
            return this.internalMonitor.getClientOffset();
          }
        }, {
          key: "getDifferenceFromInitialOffset",
          value: function getDifferenceFromInitialOffset() {
            return this.internalMonitor.getDifferenceFromInitialOffset();
          }
        }]);

        return DragSourceMonitorImpl;
      }();

      function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$9(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$9(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$9(Constructor.prototype, protoProps); if (staticProps) _defineProperties$9(Constructor, staticProps); return Constructor; }

      function _defineProperty$9(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var isCallingCanDrop = false;
      var DropTargetMonitorImpl = /*#__PURE__*/function () {
        function DropTargetMonitorImpl(manager) {
          _classCallCheck$9(this, DropTargetMonitorImpl);

          _defineProperty$9(this, "internalMonitor", void 0);

          _defineProperty$9(this, "targetId", null);

          this.internalMonitor = manager.getMonitor();
        }

        _createClass$9(DropTargetMonitorImpl, [{
          key: "receiveHandlerId",
          value: function receiveHandlerId(targetId) {
            this.targetId = targetId;
          }
        }, {
          key: "getHandlerId",
          value: function getHandlerId() {
            return this.targetId;
          }
        }, {
          key: "subscribeToStateChange",
          value: function subscribeToStateChange(listener, options) {
            return this.internalMonitor.subscribeToStateChange(listener, options);
          }
        }, {
          key: "canDrop",
          value: function canDrop() {
            // Cut out early if the target id has not been set. This should prevent errors
            // where the user has an older version of dnd-core like in
            // https://github.com/react-dnd/react-dnd/issues/1310
            if (!this.targetId) {
              return false;
            }

            invariant(!isCallingCanDrop, 'You may not call monitor.canDrop() inside your canDrop() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target-monitor');

            try {
              isCallingCanDrop = true;
              return this.internalMonitor.canDropOnTarget(this.targetId);
            } finally {
              isCallingCanDrop = false;
            }
          }
        }, {
          key: "isOver",
          value: function isOver(options) {
            if (!this.targetId) {
              return false;
            }

            return this.internalMonitor.isOverTarget(this.targetId, options);
          }
        }, {
          key: "getItemType",
          value: function getItemType() {
            return this.internalMonitor.getItemType();
          }
        }, {
          key: "getItem",
          value: function getItem() {
            return this.internalMonitor.getItem();
          }
        }, {
          key: "getDropResult",
          value: function getDropResult() {
            return this.internalMonitor.getDropResult();
          }
        }, {
          key: "didDrop",
          value: function didDrop() {
            return this.internalMonitor.didDrop();
          }
        }, {
          key: "getInitialClientOffset",
          value: function getInitialClientOffset() {
            return this.internalMonitor.getInitialClientOffset();
          }
        }, {
          key: "getInitialSourceClientOffset",
          value: function getInitialSourceClientOffset() {
            return this.internalMonitor.getInitialSourceClientOffset();
          }
        }, {
          key: "getSourceClientOffset",
          value: function getSourceClientOffset() {
            return this.internalMonitor.getSourceClientOffset();
          }
        }, {
          key: "getClientOffset",
          value: function getClientOffset() {
            return this.internalMonitor.getClientOffset();
          }
        }, {
          key: "getDifferenceFromInitialOffset",
          value: function getDifferenceFromInitialOffset() {
            return this.internalMonitor.getDifferenceFromInitialOffset();
          }
        }]);

        return DropTargetMonitorImpl;
      }();

      function throwIfCompositeComponentElement(element) {
        // Custom components can no longer be wrapped directly in React DnD 2.0
        // so that we don't need to depend on findDOMNode() from react-dom.
        if (typeof element.type === 'string') {
          return;
        }

        var displayName = element.type.displayName || element.type.name || 'the component';
        throw new Error('Only native element nodes can now be passed to React DnD connectors.' + "You can either wrap ".concat(displayName, " into a <div>, or turn it into a ") + 'drag source or a drop target itself.');
      }

      function wrapHookToRecognizeElement(hook) {
        return function () {
          var elementOrNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

          // When passed a node, call the hook straight away.
          if (!isValidElement(elementOrNode)) {
            var node = elementOrNode;
            hook(node, options); // return the node so it can be chained (e.g. when within callback refs
            // <div ref={node => connectDragSource(connectDropTarget(node))}/>

            return node;
          } // If passed a ReactElement, clone it and attach this function as a ref.
          // This helps us achieve a neat API where user doesn't even know that refs
          // are being used under the hood.


          var element = elementOrNode;
          throwIfCompositeComponentElement(element); // When no options are passed, use the hook directly

          var ref = options ? function (node) {
            return hook(node, options);
          } : hook;
          return cloneWithRef(element, ref);
        };
      }

      function wrapConnectorHooks(hooks) {
        var wrappedHooks = {};
        Object.keys(hooks).forEach(function (key) {
          var hook = hooks[key]; // ref objects should be passed straight through without wrapping

          if (key.endsWith('Ref')) {
            wrappedHooks[key] = hooks[key];
          } else {
            var wrappedHook = wrapHookToRecognizeElement(hook);

            wrappedHooks[key] = function () {
              return wrappedHook;
            };
          }
        });
        return wrappedHooks;
      }

      function setRef(ref, node) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }

      function cloneWithRef(element, newRef) {
        var previousRef = element.ref;
        invariant(typeof previousRef !== 'string', 'Cannot connect React DnD to an element with an existing string ref. ' + 'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' + 'Read more: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs');

        if (!previousRef) {
          // When there is no ref on the element, use the new ref directly
          return cloneElement(element, {
            ref: newRef
          });
        } else {
          return cloneElement(element, {
            ref: function ref(node) {
              setRef(previousRef, node);
              setRef(newRef, node);
            }
          });
        }
      }

      function _typeof$4(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }

      function isRef(obj) {
        return (// eslint-disable-next-line no-prototype-builtins
          obj !== null && _typeof$4(obj) === 'object' && Object.prototype.hasOwnProperty.call(obj, 'current')
        );
      }

      function shallowEqual(objA, objB, compare, compareContext) {
        var compareResult = compare ? compare.call(compareContext, objA, objB) : void 0;

        if (compareResult !== void 0) {
          return !!compareResult;
        }

        if (objA === objB) {
          return true;
        }

        if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB) {
          return false;
        }

        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
          return false;
        }

        var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB); // Test for A's keys different from B.

        for (var idx = 0; idx < keysA.length; idx++) {
          var key = keysA[idx];

          if (!bHasOwnProperty(key)) {
            return false;
          }

          var valueA = objA[key];
          var valueB = objB[key];
          compareResult = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

          if (compareResult === false || compareResult === void 0 && valueA !== valueB) {
            return false;
          }
        }

        return true;
      }

      function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$8(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$8(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$8(Constructor.prototype, protoProps); if (staticProps) _defineProperties$8(Constructor, staticProps); return Constructor; }

      function _defineProperty$8(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var SourceConnector = /*#__PURE__*/function () {
        // The drop target may either be attached via ref or connect function
        // The drag preview may either be attached via ref or connect function
        function SourceConnector(backend) {
          var _this = this;

          _classCallCheck$8(this, SourceConnector);

          _defineProperty$8(this, "hooks", wrapConnectorHooks({
            dragSource: function dragSource(node, options) {
              _this.clearDragSource();

              _this.dragSourceOptions = options || null;

              if (isRef(node)) {
                _this.dragSourceRef = node;
              } else {
                _this.dragSourceNode = node;
              }

              _this.reconnectDragSource();
            },
            dragPreview: function dragPreview(node, options) {
              _this.clearDragPreview();

              _this.dragPreviewOptions = options || null;

              if (isRef(node)) {
                _this.dragPreviewRef = node;
              } else {
                _this.dragPreviewNode = node;
              }

              _this.reconnectDragPreview();
            }
          }));

          _defineProperty$8(this, "handlerId", null);

          _defineProperty$8(this, "dragSourceRef", null);

          _defineProperty$8(this, "dragSourceNode", void 0);

          _defineProperty$8(this, "dragSourceOptionsInternal", null);

          _defineProperty$8(this, "dragSourceUnsubscribe", void 0);

          _defineProperty$8(this, "dragPreviewRef", null);

          _defineProperty$8(this, "dragPreviewNode", void 0);

          _defineProperty$8(this, "dragPreviewOptionsInternal", null);

          _defineProperty$8(this, "dragPreviewUnsubscribe", void 0);

          _defineProperty$8(this, "lastConnectedHandlerId", null);

          _defineProperty$8(this, "lastConnectedDragSource", null);

          _defineProperty$8(this, "lastConnectedDragSourceOptions", null);

          _defineProperty$8(this, "lastConnectedDragPreview", null);

          _defineProperty$8(this, "lastConnectedDragPreviewOptions", null);

          _defineProperty$8(this, "backend", void 0);

          this.backend = backend;
        }

        _createClass$8(SourceConnector, [{
          key: "receiveHandlerId",
          value: function receiveHandlerId(newHandlerId) {
            if (this.handlerId === newHandlerId) {
              return;
            }

            this.handlerId = newHandlerId;
            this.reconnect();
          }
        }, {
          key: "connectTarget",
          get: function get() {
            return this.dragSource;
          }
        }, {
          key: "dragSourceOptions",
          get: function get() {
            return this.dragSourceOptionsInternal;
          },
          set: function set(options) {
            this.dragSourceOptionsInternal = options;
          }
        }, {
          key: "dragPreviewOptions",
          get: function get() {
            return this.dragPreviewOptionsInternal;
          },
          set: function set(options) {
            this.dragPreviewOptionsInternal = options;
          }
        }, {
          key: "reconnect",
          value: function reconnect() {
            this.reconnectDragSource();
            this.reconnectDragPreview();
          }
        }, {
          key: "reconnectDragSource",
          value: function reconnectDragSource() {
            var dragSource = this.dragSource; // if nothing has changed then don't resubscribe

            var didChange = this.didHandlerIdChange() || this.didConnectedDragSourceChange() || this.didDragSourceOptionsChange();

            if (didChange) {
              this.disconnectDragSource();
            }

            if (!this.handlerId) {
              return;
            }

            if (!dragSource) {
              this.lastConnectedDragSource = dragSource;
              return;
            }

            if (didChange) {
              this.lastConnectedHandlerId = this.handlerId;
              this.lastConnectedDragSource = dragSource;
              this.lastConnectedDragSourceOptions = this.dragSourceOptions;
              this.dragSourceUnsubscribe = this.backend.connectDragSource(this.handlerId, dragSource, this.dragSourceOptions);
            }
          }
        }, {
          key: "reconnectDragPreview",
          value: function reconnectDragPreview() {
            var dragPreview = this.dragPreview; // if nothing has changed then don't resubscribe

            var didChange = this.didHandlerIdChange() || this.didConnectedDragPreviewChange() || this.didDragPreviewOptionsChange();

            if (didChange) {
              this.disconnectDragPreview();
            }

            if (!this.handlerId) {
              return;
            }

            if (!dragPreview) {
              this.lastConnectedDragPreview = dragPreview;
              return;
            }

            if (didChange) {
              this.lastConnectedHandlerId = this.handlerId;
              this.lastConnectedDragPreview = dragPreview;
              this.lastConnectedDragPreviewOptions = this.dragPreviewOptions;
              this.dragPreviewUnsubscribe = this.backend.connectDragPreview(this.handlerId, dragPreview, this.dragPreviewOptions);
            }
          }
        }, {
          key: "didHandlerIdChange",
          value: function didHandlerIdChange() {
            return this.lastConnectedHandlerId !== this.handlerId;
          }
        }, {
          key: "didConnectedDragSourceChange",
          value: function didConnectedDragSourceChange() {
            return this.lastConnectedDragSource !== this.dragSource;
          }
        }, {
          key: "didConnectedDragPreviewChange",
          value: function didConnectedDragPreviewChange() {
            return this.lastConnectedDragPreview !== this.dragPreview;
          }
        }, {
          key: "didDragSourceOptionsChange",
          value: function didDragSourceOptionsChange() {
            return !shallowEqual(this.lastConnectedDragSourceOptions, this.dragSourceOptions);
          }
        }, {
          key: "didDragPreviewOptionsChange",
          value: function didDragPreviewOptionsChange() {
            return !shallowEqual(this.lastConnectedDragPreviewOptions, this.dragPreviewOptions);
          }
        }, {
          key: "disconnectDragSource",
          value: function disconnectDragSource() {
            if (this.dragSourceUnsubscribe) {
              this.dragSourceUnsubscribe();
              this.dragSourceUnsubscribe = undefined;
            }
          }
        }, {
          key: "disconnectDragPreview",
          value: function disconnectDragPreview() {
            if (this.dragPreviewUnsubscribe) {
              this.dragPreviewUnsubscribe();
              this.dragPreviewUnsubscribe = undefined;
              this.dragPreviewNode = null;
              this.dragPreviewRef = null;
            }
          }
        }, {
          key: "dragSource",
          get: function get() {
            return this.dragSourceNode || this.dragSourceRef && this.dragSourceRef.current;
          }
        }, {
          key: "dragPreview",
          get: function get() {
            return this.dragPreviewNode || this.dragPreviewRef && this.dragPreviewRef.current;
          }
        }, {
          key: "clearDragSource",
          value: function clearDragSource() {
            this.dragSourceNode = null;
            this.dragSourceRef = null;
          }
        }, {
          key: "clearDragPreview",
          value: function clearDragPreview() {
            this.dragPreviewNode = null;
            this.dragPreviewRef = null;
          }
        }]);

        return SourceConnector;
      }();

      function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$7(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$7(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$7(Constructor.prototype, protoProps); if (staticProps) _defineProperties$7(Constructor, staticProps); return Constructor; }

      function _defineProperty$7(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var TargetConnector = /*#__PURE__*/function () {
        // The drop target may either be attached via ref or connect function
        function TargetConnector(backend) {
          var _this = this;

          _classCallCheck$7(this, TargetConnector);

          _defineProperty$7(this, "hooks", wrapConnectorHooks({
            dropTarget: function dropTarget(node, options) {
              _this.clearDropTarget();

              _this.dropTargetOptions = options;

              if (isRef(node)) {
                _this.dropTargetRef = node;
              } else {
                _this.dropTargetNode = node;
              }

              _this.reconnect();
            }
          }));

          _defineProperty$7(this, "handlerId", null);

          _defineProperty$7(this, "dropTargetRef", null);

          _defineProperty$7(this, "dropTargetNode", void 0);

          _defineProperty$7(this, "dropTargetOptionsInternal", null);

          _defineProperty$7(this, "unsubscribeDropTarget", void 0);

          _defineProperty$7(this, "lastConnectedHandlerId", null);

          _defineProperty$7(this, "lastConnectedDropTarget", null);

          _defineProperty$7(this, "lastConnectedDropTargetOptions", null);

          _defineProperty$7(this, "backend", void 0);

          this.backend = backend;
        }

        _createClass$7(TargetConnector, [{
          key: "connectTarget",
          get: function get() {
            return this.dropTarget;
          }
        }, {
          key: "reconnect",
          value: function reconnect() {
            // if nothing has changed then don't resubscribe
            var didChange = this.didHandlerIdChange() || this.didDropTargetChange() || this.didOptionsChange();

            if (didChange) {
              this.disconnectDropTarget();
            }

            var dropTarget = this.dropTarget;

            if (!this.handlerId) {
              return;
            }

            if (!dropTarget) {
              this.lastConnectedDropTarget = dropTarget;
              return;
            }

            if (didChange) {
              this.lastConnectedHandlerId = this.handlerId;
              this.lastConnectedDropTarget = dropTarget;
              this.lastConnectedDropTargetOptions = this.dropTargetOptions;
              this.unsubscribeDropTarget = this.backend.connectDropTarget(this.handlerId, dropTarget, this.dropTargetOptions);
            }
          }
        }, {
          key: "receiveHandlerId",
          value: function receiveHandlerId(newHandlerId) {
            if (newHandlerId === this.handlerId) {
              return;
            }

            this.handlerId = newHandlerId;
            this.reconnect();
          }
        }, {
          key: "dropTargetOptions",
          get: function get() {
            return this.dropTargetOptionsInternal;
          },
          set: function set(options) {
            this.dropTargetOptionsInternal = options;
          }
        }, {
          key: "didHandlerIdChange",
          value: function didHandlerIdChange() {
            return this.lastConnectedHandlerId !== this.handlerId;
          }
        }, {
          key: "didDropTargetChange",
          value: function didDropTargetChange() {
            return this.lastConnectedDropTarget !== this.dropTarget;
          }
        }, {
          key: "didOptionsChange",
          value: function didOptionsChange() {
            return !shallowEqual(this.lastConnectedDropTargetOptions, this.dropTargetOptions);
          }
        }, {
          key: "disconnectDropTarget",
          value: function disconnectDropTarget() {
            if (this.unsubscribeDropTarget) {
              this.unsubscribeDropTarget();
              this.unsubscribeDropTarget = undefined;
            }
          }
        }, {
          key: "dropTarget",
          get: function get() {
            return this.dropTargetNode || this.dropTargetRef && this.dropTargetRef.current;
          }
        }, {
          key: "clearDropTarget",
          value: function clearDropTarget() {
            this.dropTargetRef = null;
            this.dropTargetNode = null;
          }
        }]);

        return TargetConnector;
      }();

      function registerTarget(type, target, manager) {
        var registry = manager.getRegistry();
        var targetId = registry.addTarget(type, target);
        return [targetId, function () {
          return registry.removeTarget(targetId);
        }];
      }
      function registerSource(type, source, manager) {
        var registry = manager.getRegistry();
        var sourceId = registry.addSource(type, source);
        return [sourceId, function () {
          return registry.removeSource(sourceId);
        }];
      }

      function _typeof$3(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }

      function getDecoratedComponent(instanceRef) {
        var currentRef = instanceRef.current;

        if (currentRef == null) {
          return null;
        } else if (currentRef.decoratedRef) {
          // go through the private field in decorateHandler to avoid the invariant hit
          return currentRef.decoratedRef.current;
        } else {
          return currentRef;
        }
      }
      function isClassComponent(Component) {
        return Component && Component.prototype && typeof Component.prototype.render === 'function';
      }
      function isRefForwardingComponent(C) {
        var _item$$$typeof;

        var item = C;
        return (item === null || item === void 0 ? void 0 : (_item$$$typeof = item.$$typeof) === null || _item$$$typeof === void 0 ? void 0 : _item$$$typeof.toString()) === 'Symbol(react.forward_ref)';
      }
      function isRefable(C) {
        return isClassComponent(C) || isRefForwardingComponent(C);
      }
      function isFunction(input) {
        return typeof input === 'function';
      }
      function noop() {// noop
      }

      function isObjectLike(input) {
        return _typeof$3(input) === 'object' && input !== null;
      }

      function isPlainObject(input) {
        if (!isObjectLike(input)) {
          return false;
        }

        if (Object.getPrototypeOf(input) === null) {
          return true;
        }

        var proto = input;

        while (Object.getPrototypeOf(proto) !== null) {
          proto = Object.getPrototypeOf(proto);
        }

        return Object.getPrototypeOf(input) === proto;
      }
      function isValidType(type, allowArray) {
        return typeof type === 'string' || _typeof$3(type) === 'symbol' || !!allowArray && Array.isArray(type) && type.every(function (t) {
          return isValidType(t, false);
        });
      }

      function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$6(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$6(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$6(Constructor.prototype, protoProps); if (staticProps) _defineProperties$6(Constructor, staticProps); return Constructor; }

      function _defineProperty$6(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      /**
       * Provides a set of static methods for creating Disposables.
       * @param {Function} action Action to run during the first call to dispose.
       * The action is guaranteed to be run at most once.
       */

      var Disposable = /*#__PURE__*/function () {
        function Disposable(action) {
          _classCallCheck$6(this, Disposable);

          _defineProperty$6(this, "isDisposed", false);

          _defineProperty$6(this, "action", void 0);

          this.action = isFunction(action) ? action : noop;
        }
        /** Performs the task of cleaning up resources. */


        _createClass$6(Disposable, [{
          key: "dispose",
          value: function dispose() {
            if (!this.isDisposed) {
              this.action();
              this.isDisposed = true;
            }
          }
        }], [{
          key: "isDisposable",
          value:
          /**
           * Gets the disposable that does nothing when disposed.
           */

          /**
           * Validates whether the given object is a disposable
           * @param {Object} Object to test whether it has a dispose method
           * @returns {Boolean} true if a disposable object, else false.
           */
          function isDisposable(d) {
            return Boolean(d && isFunction(d.dispose));
          }
        }, {
          key: "_fixup",
          value: function _fixup(result) {
            return Disposable.isDisposable(result) ? result : Disposable.empty;
          }
          /**
           * Creates a disposable object that invokes the specified action when disposed.
           * @param {Function} dispose Action to run during the first call to dispose.
           * The action is guaranteed to be run at most once.
           * @return {Disposable} The disposable object that runs the given action upon disposal.
           */

        }, {
          key: "create",
          value: function create(action) {
            return new Disposable(action);
          }
        }]);

        return Disposable;
      }();
      /**
       * Represents a group of disposable resources that are disposed together.
       * @constructor
       */

      _defineProperty$6(Disposable, "empty", {
        dispose: noop
      });

      var CompositeDisposable = /*#__PURE__*/function () {
        function CompositeDisposable() {
          _classCallCheck$6(this, CompositeDisposable);

          _defineProperty$6(this, "isDisposed", false);

          _defineProperty$6(this, "disposables", void 0);

          for (var _len = arguments.length, disposables = new Array(_len), _key = 0; _key < _len; _key++) {
            disposables[_key] = arguments[_key];
          }

          this.disposables = disposables;
        }
        /**
         * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
         * @param {Any} item Disposable to add.
         */


        _createClass$6(CompositeDisposable, [{
          key: "add",
          value: function add(item) {
            if (this.isDisposed) {
              item.dispose();
            } else {
              this.disposables.push(item);
            }
          }
          /**
           * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
           * @param {Any} item Disposable to remove.
           * @returns {Boolean} true if found; false otherwise.
           */

        }, {
          key: "remove",
          value: function remove(item) {
            var shouldDispose = false;

            if (!this.isDisposed) {
              var idx = this.disposables.indexOf(item);

              if (idx !== -1) {
                shouldDispose = true;
                this.disposables.splice(idx, 1);
                item.dispose();
              }
            }

            return shouldDispose;
          }
          /**
           *  Disposes all disposables in the group and removes them from the group but
           *  does not dispose the CompositeDisposable.
           */

        }, {
          key: "clear",
          value: function clear() {
            if (!this.isDisposed) {
              var len = this.disposables.length;
              var currentDisposables = new Array(len);

              for (var i = 0; i < len; i++) {
                currentDisposables[i] = this.disposables[i];
              }

              this.disposables = [];

              for (var _i = 0; _i < len; _i++) {
                currentDisposables[_i].dispose();
              }
            }
          }
          /**
           *  Disposes all disposables in the group and removes them from the group.
           */

        }, {
          key: "dispose",
          value: function dispose() {
            if (!this.isDisposed) {
              this.isDisposed = true;
              var len = this.disposables.length;
              var currentDisposables = new Array(len);

              for (var i = 0; i < len; i++) {
                currentDisposables[i] = this.disposables[i];
              }

              this.disposables = [];

              for (var _i2 = 0; _i2 < len; _i2++) {
                currentDisposables[_i2].dispose();
              }
            }
          }
        }]);

        return CompositeDisposable;
      }();
      /**
       * Represents a disposable resource whose underlying disposable resource can
       * be replaced by another disposable resource, causing automatic disposal of
       * the previous underlying disposable resource.
       */

      var SerialDisposable = /*#__PURE__*/function () {
        function SerialDisposable() {
          _classCallCheck$6(this, SerialDisposable);

          _defineProperty$6(this, "isDisposed", false);

          _defineProperty$6(this, "current", void 0);
        }

        _createClass$6(SerialDisposable, [{
          key: "getDisposable",
          value:
          /**
           * Gets the underlying disposable.
           * @returns {Any} the underlying disposable.
           */
          function getDisposable() {
            return this.current;
          }
        }, {
          key: "setDisposable",
          value: function setDisposable(value) {
            var shouldDispose = this.isDisposed;

            if (!shouldDispose) {
              var old = this.current;
              this.current = value;

              if (old) {
                old.dispose();
              }
            }

            if (shouldDispose && value) {
              value.dispose();
            }
          }
          /** Performs the task of cleaning up resources. */

        }, {
          key: "dispose",
          value: function dispose() {
            if (!this.isDisposed) {
              this.isDisposed = true;
              var old = this.current;
              this.current = undefined;

              if (old) {
                old.dispose();
              }
            }
          }
        }]);

        return SerialDisposable;
      }();

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

      var hoistStatics = hoistNonReactStatics_cjs;

      function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }

      function _slicedToArray$5(arr, i) { return _arrayWithHoles$5(arr) || _iterableToArrayLimit$5(arr, i) || _unsupportedIterableToArray$6(arr, i) || _nonIterableRest$5(); }

      function _nonIterableRest$5() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray$6(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$6(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$6(o, minLen); }

      function _arrayLikeToArray$6(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

      function _iterableToArrayLimit$5(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

      function _arrayWithHoles$5(arr) { if (Array.isArray(arr)) return arr; }

      function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$5(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$5(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$5(Constructor.prototype, protoProps); if (staticProps) _defineProperties$5(Constructor, staticProps); return Constructor; }

      function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

      function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

      function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf$1(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$1(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$1(this, result); }; }

      function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$2(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$1(self); }

      function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

      function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

      function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

      function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      function decorateHandler(_ref) {
        var DecoratedComponent = _ref.DecoratedComponent,
            createHandler = _ref.createHandler,
            createMonitor = _ref.createMonitor,
            createConnector = _ref.createConnector,
            registerHandler = _ref.registerHandler,
            containerDisplayName = _ref.containerDisplayName,
            getType = _ref.getType,
            collect = _ref.collect,
            options = _ref.options;
        var _options$arePropsEqua = options.arePropsEqual,
            arePropsEqual = _options$arePropsEqua === void 0 ? shallowEqual : _options$arePropsEqua;
        var Decorated = DecoratedComponent;
        var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

        var DragDropContainer = /*#__PURE__*/function (_Component) {
          _inherits$1(DragDropContainer, _Component);

          var _super = _createSuper$1(DragDropContainer);

          function DragDropContainer(props) {
            var _this;

            _classCallCheck$5(this, DragDropContainer);

            _this = _super.call(this, props);

            _defineProperty$5(_assertThisInitialized$1(_this), "decoratedRef", createRef());

            _defineProperty$5(_assertThisInitialized$1(_this), "handlerId", void 0);

            _defineProperty$5(_assertThisInitialized$1(_this), "manager", void 0);

            _defineProperty$5(_assertThisInitialized$1(_this), "handlerMonitor", void 0);

            _defineProperty$5(_assertThisInitialized$1(_this), "handlerConnector", void 0);

            _defineProperty$5(_assertThisInitialized$1(_this), "handler", void 0);

            _defineProperty$5(_assertThisInitialized$1(_this), "disposable", void 0);

            _defineProperty$5(_assertThisInitialized$1(_this), "currentType", void 0);

            _defineProperty$5(_assertThisInitialized$1(_this), "handleChange", function () {
              var nextState = _this.getCurrentState();

              if (!shallowEqual(nextState, _this.state)) {
                _this.setState(nextState);
              }
            });

            _this.disposable = new SerialDisposable();

            _this.receiveProps(props);

            _this.dispose();

            return _this;
          }

          _createClass$5(DragDropContainer, [{
            key: "getHandlerId",
            value: function getHandlerId() {
              return this.handlerId;
            }
          }, {
            key: "getDecoratedComponentInstance",
            value: function getDecoratedComponentInstance() {
              invariant(this.decoratedRef.current, 'In order to access an instance of the decorated component, it must either be a class component or use React.forwardRef()');
              return this.decoratedRef.current;
            }
          }, {
            key: "shouldComponentUpdate",
            value: function shouldComponentUpdate(nextProps, nextState) {
              return !arePropsEqual(nextProps, this.props) || !shallowEqual(nextState, this.state);
            }
          }, {
            key: "componentDidMount",
            value: function componentDidMount() {
              this.disposable = new SerialDisposable();
              this.currentType = undefined;
              this.receiveProps(this.props);
              this.handleChange();
            }
          }, {
            key: "componentDidUpdate",
            value: function componentDidUpdate(prevProps) {
              if (!arePropsEqual(this.props, prevProps)) {
                this.receiveProps(this.props);
                this.handleChange();
              }
            }
          }, {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
              this.dispose();
            }
          }, {
            key: "receiveProps",
            value: function receiveProps(props) {
              if (!this.handler) {
                return;
              }

              this.handler.receiveProps(props);
              this.receiveType(getType(props));
            }
          }, {
            key: "receiveType",
            value: function receiveType(type) {
              if (!this.handlerMonitor || !this.manager || !this.handlerConnector) {
                return;
              }

              if (type === this.currentType) {
                return;
              }

              this.currentType = type;

              var _registerHandler = registerHandler(type, this.handler, this.manager),
                  _registerHandler2 = _slicedToArray$5(_registerHandler, 2),
                  handlerId = _registerHandler2[0],
                  unregister = _registerHandler2[1];

              this.handlerId = handlerId;
              this.handlerMonitor.receiveHandlerId(handlerId);
              this.handlerConnector.receiveHandlerId(handlerId);
              var globalMonitor = this.manager.getMonitor();
              var unsubscribe = globalMonitor.subscribeToStateChange(this.handleChange, {
                handlerIds: [handlerId]
              });
              this.disposable.setDisposable(new CompositeDisposable(new Disposable(unsubscribe), new Disposable(unregister)));
            }
          }, {
            key: "dispose",
            value: function dispose() {
              this.disposable.dispose();

              if (this.handlerConnector) {
                this.handlerConnector.receiveHandlerId(null);
              }
            }
          }, {
            key: "getCurrentState",
            value: function getCurrentState() {
              if (!this.handlerConnector) {
                return {};
              }

              var nextState = collect(this.handlerConnector.hooks, this.handlerMonitor, this.props);

              return nextState;
            }
          }, {
            key: "render",
            value: function render() {
              var _this2 = this;

              return jsxRuntime.exports.jsx(DndContext.Consumer, {
                children: function children(_ref2) {
                  var dragDropManager = _ref2.dragDropManager;

                  _this2.receiveDragDropManager(dragDropManager);

                  if (typeof requestAnimationFrame !== 'undefined') {
                    requestAnimationFrame(function () {
                      var _this2$handlerConnect;

                      return (_this2$handlerConnect = _this2.handlerConnector) === null || _this2$handlerConnect === void 0 ? void 0 : _this2$handlerConnect.reconnect();
                    });
                  }

                  return jsxRuntime.exports.jsx(Decorated, Object.assign({}, _this2.props, _this2.getCurrentState(), {
                    // NOTE: if Decorated is a Function Component, decoratedRef will not be populated unless it's a refforwarding component.
                    ref: isRefable(Decorated) ? _this2.decoratedRef : null
                  }), void 0);
                }
              }, void 0);
            }
          }, {
            key: "receiveDragDropManager",
            value: function receiveDragDropManager(dragDropManager) {
              if (this.manager !== undefined) {
                return;
              }

              invariant(dragDropManager !== undefined, 'Could not find the drag and drop manager in the context of %s. ' + 'Make sure to render a DndProvider component in your top-level component. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/troubleshooting#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);

              if (dragDropManager === undefined) {
                return;
              }

              this.manager = dragDropManager;
              this.handlerMonitor = createMonitor(dragDropManager);
              this.handlerConnector = createConnector(dragDropManager.getBackend());
              this.handler = createHandler(this.handlerMonitor, this.decoratedRef);
            }
          }]);

          return DragDropContainer;
        }(Component);

        _defineProperty$5(DragDropContainer, "DecoratedComponent", DecoratedComponent);

        _defineProperty$5(DragDropContainer, "displayName", "".concat(containerDisplayName, "(").concat(displayName, ")"));

        return hoistStatics(DragDropContainer, DecoratedComponent);
      }

      function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); return Constructor; }

      function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var ALLOWED_SPEC_METHODS$1 = ['canDrag', 'beginDrag', 'isDragging', 'endDrag'];
      var REQUIRED_SPEC_METHODS = ['beginDrag'];

      var SourceImpl = /*#__PURE__*/function () {
        function SourceImpl(spec, monitor, ref) {
          var _this = this;

          _classCallCheck$4(this, SourceImpl);

          _defineProperty$4(this, "props", null);

          _defineProperty$4(this, "spec", void 0);

          _defineProperty$4(this, "monitor", void 0);

          _defineProperty$4(this, "ref", void 0);

          _defineProperty$4(this, "beginDrag", function () {
            if (!_this.props) {
              return;
            }

            var item = _this.spec.beginDrag(_this.props, _this.monitor, _this.ref.current);

            return item;
          });

          this.spec = spec;
          this.monitor = monitor;
          this.ref = ref;
        }

        _createClass$4(SourceImpl, [{
          key: "receiveProps",
          value: function receiveProps(props) {
            this.props = props;
          }
        }, {
          key: "canDrag",
          value: function canDrag() {
            if (!this.props) {
              return false;
            }

            if (!this.spec.canDrag) {
              return true;
            }

            return this.spec.canDrag(this.props, this.monitor);
          }
        }, {
          key: "isDragging",
          value: function isDragging(globalMonitor, sourceId) {
            if (!this.props) {
              return false;
            }

            if (!this.spec.isDragging) {
              return sourceId === globalMonitor.getSourceId();
            }

            return this.spec.isDragging(this.props, this.monitor);
          }
        }, {
          key: "endDrag",
          value: function endDrag() {
            if (!this.props) {
              return;
            }

            if (!this.spec.endDrag) {
              return;
            }

            this.spec.endDrag(this.props, this.monitor, getDecoratedComponent(this.ref));
          }
        }]);

        return SourceImpl;
      }();

      function createSourceFactory(spec) {
        Object.keys(spec).forEach(function (key) {
          invariant(ALLOWED_SPEC_METHODS$1.indexOf(key) > -1, 'Expected the drag source specification to only have ' + 'some of the following keys: %s. ' + 'Instead received a specification with an unexpected "%s" key. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', ALLOWED_SPEC_METHODS$1.join(', '), key);
          invariant(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', key, key, spec[key]);
        });
        REQUIRED_SPEC_METHODS.forEach(function (key) {
          invariant(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', key, key, spec[key]);
        });
        return function createSource(monitor, ref) {
          return new SourceImpl(spec, monitor, ref);
        };
      }

      /**
       * Decorates a component as a dragsource
       * @param type The dragsource type
       * @param spec The drag source specification
       * @param collect The props collector function
       * @param options DnD options
       */

      function DragSource(type, spec, collect) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        var getType = type;

        if (typeof type !== 'function') {
          invariant(isValidType(type), 'Expected "type" provided as the first argument to DragSource to be ' + 'a string, or a function that returns a string given the current props. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', type);

          getType = function getType() {
            return type;
          };
        }

        invariant(isPlainObject(spec), 'Expected "spec" provided as the second argument to DragSource to be ' + 'a plain object. Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', spec);
        var createSource = createSourceFactory(spec);
        invariant(typeof collect === 'function', 'Expected "collect" provided as the third argument to DragSource to be ' + 'a function that returns a plain object of props to inject. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', collect);
        invariant(isPlainObject(options), 'Expected "options" provided as the fourth argument to DragSource to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-source', collect);
        return function decorateSource(DecoratedComponent) {
          return decorateHandler({
            containerDisplayName: 'DragSource',
            createHandler: createSource,
            registerHandler: registerSource,
            createConnector: function createConnector(backend) {
              return new SourceConnector(backend);
            },
            createMonitor: function createMonitor(manager) {
              return new DragSourceMonitorImpl(manager);
            },
            DecoratedComponent: DecoratedComponent,
            getType: getType,
            collect: collect,
            options: options
          });
        };
      }

      function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }

      function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      var ALLOWED_SPEC_METHODS = ['canDrop', 'hover', 'drop'];

      var TargetImpl = /*#__PURE__*/function () {
        function TargetImpl(spec, monitor, ref) {
          _classCallCheck$3(this, TargetImpl);

          _defineProperty$3(this, "props", null);

          _defineProperty$3(this, "spec", void 0);

          _defineProperty$3(this, "monitor", void 0);

          _defineProperty$3(this, "ref", void 0);

          this.spec = spec;
          this.monitor = monitor;
          this.ref = ref;
        }

        _createClass$3(TargetImpl, [{
          key: "receiveProps",
          value: function receiveProps(props) {
            this.props = props;
          }
        }, {
          key: "receiveMonitor",
          value: function receiveMonitor(monitor) {
            this.monitor = monitor;
          }
        }, {
          key: "canDrop",
          value: function canDrop() {
            if (!this.spec.canDrop) {
              return true;
            }

            return this.spec.canDrop(this.props, this.monitor);
          }
        }, {
          key: "hover",
          value: function hover() {
            if (!this.spec.hover || !this.props) {
              return;
            }

            this.spec.hover(this.props, this.monitor, getDecoratedComponent(this.ref));
          }
        }, {
          key: "drop",
          value: function drop() {
            if (!this.spec.drop) {
              return undefined;
            }

            var dropResult = this.spec.drop(this.props, this.monitor, this.ref.current);

            return dropResult;
          }
        }]);

        return TargetImpl;
      }();

      function createTargetFactory(spec) {
        Object.keys(spec).forEach(function (key) {
          invariant(ALLOWED_SPEC_METHODS.indexOf(key) > -1, 'Expected the drop target specification to only have ' + 'some of the following keys: %s. ' + 'Instead received a specification with an unexpected "%s" key. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', ALLOWED_SPEC_METHODS.join(', '), key);
          invariant(typeof spec[key] === 'function', 'Expected %s in the drop target specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', key, key, spec[key]);
        });
        return function createTarget(monitor, ref) {
          return new TargetImpl(spec, monitor, ref);
        };
      }

      /**
       * @param type The accepted target type
       * @param spec The DropTarget specification
       * @param collect The props collector function
       * @param options Options
       */

      function DropTarget(type, spec, collect) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        var getType = type;

        if (typeof type !== 'function') {
          invariant(isValidType(type, true), 'Expected "type" provided as the first argument to DropTarget to be ' + 'a string, an array of strings, or a function that returns either given ' + 'the current props. Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', type);

          getType = function getType() {
            return type;
          };
        }

        invariant(isPlainObject(spec), 'Expected "spec" provided as the second argument to DropTarget to be ' + 'a plain object. Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', spec);
        var createTarget = createTargetFactory(spec);
        invariant(typeof collect === 'function', 'Expected "collect" provided as the third argument to DropTarget to be ' + 'a function that returns a plain object of props to inject. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', collect);
        invariant(isPlainObject(options), 'Expected "options" provided as the fourth argument to DropTarget to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/api/drop-target', collect);
        return function decorateTarget(DecoratedComponent) {
          return decorateHandler({
            containerDisplayName: 'DropTarget',
            createHandler: createTarget,
            registerHandler: registerTarget,
            createMonitor: function createMonitor(manager) {
              return new DropTargetMonitorImpl(manager);
            },
            createConnector: function createConnector(backend) {
              return new TargetConnector(backend);
            },
            DecoratedComponent: DecoratedComponent,
            getType: getType,
            collect: collect,
            options: options
          });
        };
      }

      function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

      function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

      function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

      function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

      function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

      function _possibleConstructorReturn(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

      function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

      function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

      function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

      function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
      /**
       * @param collect The props collector function
       * @param options The DnD options
       */

      function DragLayer(collect) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        invariant(typeof collect === 'function', 'Expected "collect" provided as the first argument to DragLayer to be a function that collects props to inject into the component. ', 'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-layer', collect);
        invariant(isPlainObject(options), 'Expected "options" provided as the second argument to DragLayer to be a plain object when specified. ' + 'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs/api/drag-layer', options);
        return function decorateLayer(DecoratedComponent) {
          var Decorated = DecoratedComponent;
          var _options$arePropsEqua = options.arePropsEqual,
              arePropsEqual = _options$arePropsEqua === void 0 ? shallowEqual : _options$arePropsEqua;
          var displayName = Decorated.displayName || Decorated.name || 'Component';

          var DragLayerContainer = /*#__PURE__*/function (_Component) {
            _inherits(DragLayerContainer, _Component);

            var _super = _createSuper(DragLayerContainer);

            function DragLayerContainer() {
              var _this;

              _classCallCheck$2(this, DragLayerContainer);

              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              _this = _super.call.apply(_super, [this].concat(args));

              _defineProperty$2(_assertThisInitialized(_this), "manager", void 0);

              _defineProperty$2(_assertThisInitialized(_this), "isCurrentlyMounted", false);

              _defineProperty$2(_assertThisInitialized(_this), "unsubscribeFromOffsetChange", void 0);

              _defineProperty$2(_assertThisInitialized(_this), "unsubscribeFromStateChange", void 0);

              _defineProperty$2(_assertThisInitialized(_this), "ref", createRef());

              _defineProperty$2(_assertThisInitialized(_this), "handleChange", function () {
                if (!_this.isCurrentlyMounted) {
                  return;
                }

                var nextState = _this.getCurrentState();

                if (!shallowEqual(nextState, _this.state)) {
                  _this.setState(nextState);
                }
              });

              return _this;
            }

            _createClass$2(DragLayerContainer, [{
              key: "getDecoratedComponentInstance",
              value: function getDecoratedComponentInstance() {
                invariant(this.ref.current, 'In order to access an instance of the decorated component, it must either be a class component or use React.forwardRef()');
                return this.ref.current;
              }
            }, {
              key: "shouldComponentUpdate",
              value: function shouldComponentUpdate(nextProps, nextState) {
                return !arePropsEqual(nextProps, this.props) || !shallowEqual(nextState, this.state);
              }
            }, {
              key: "componentDidMount",
              value: function componentDidMount() {
                this.isCurrentlyMounted = true;
                this.handleChange();
              }
            }, {
              key: "componentWillUnmount",
              value: function componentWillUnmount() {
                this.isCurrentlyMounted = false;

                if (this.unsubscribeFromOffsetChange) {
                  this.unsubscribeFromOffsetChange();
                  this.unsubscribeFromOffsetChange = undefined;
                }

                if (this.unsubscribeFromStateChange) {
                  this.unsubscribeFromStateChange();
                  this.unsubscribeFromStateChange = undefined;
                }
              }
            }, {
              key: "render",
              value: function render() {
                var _this2 = this;

                return jsxRuntime.exports.jsx(DndContext.Consumer, {
                  children: function children(_ref) {
                    var dragDropManager = _ref.dragDropManager;

                    if (dragDropManager === undefined) {
                      return null;
                    }

                    _this2.receiveDragDropManager(dragDropManager); // Let componentDidMount fire to initialize the collected state


                    if (!_this2.isCurrentlyMounted) {
                      return null;
                    }

                    return jsxRuntime.exports.jsx(Decorated, Object.assign({}, _this2.props, _this2.state, {
                      ref: isRefable(Decorated) ? _this2.ref : null
                    }), void 0);
                  }
                }, void 0);
              }
            }, {
              key: "receiveDragDropManager",
              value: function receiveDragDropManager(dragDropManager) {
                if (this.manager !== undefined) {
                  return;
                }

                this.manager = dragDropManager;
                invariant(_typeof$1(dragDropManager) === 'object', 'Could not find the drag and drop manager in the context of %s. ' + 'Make sure to render a DndProvider component in your top-level component. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs/troubleshooting#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);
                var monitor = this.manager.getMonitor();
                this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(this.handleChange);
                this.unsubscribeFromStateChange = monitor.subscribeToStateChange(this.handleChange);
              }
            }, {
              key: "getCurrentState",
              value: function getCurrentState() {
                if (!this.manager) {
                  return {};
                }

                var monitor = this.manager.getMonitor();
                return collect(monitor, this.props);
              }
            }]);

            return DragLayerContainer;
          }(Component);

          _defineProperty$2(DragLayerContainer, "displayName", "DragLayer(".concat(displayName, ")"));

          _defineProperty$2(DragLayerContainer, "DecoratedComponent", DecoratedComponent);

          return hoistStatics(DragLayerContainer, DecoratedComponent);
        };
      }

      var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

      function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

      function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

      function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

      var DragSourceImpl = /*#__PURE__*/function () {
        function DragSourceImpl(spec, monitor, connector) {
          _classCallCheck$1(this, DragSourceImpl);

          _defineProperty$1(this, "spec", void 0);

          _defineProperty$1(this, "monitor", void 0);

          _defineProperty$1(this, "connector", void 0);

          this.spec = spec;
          this.monitor = monitor;
          this.connector = connector;
        }

        _createClass$1(DragSourceImpl, [{
          key: "beginDrag",
          value: function beginDrag() {
            var _result;

            var spec = this.spec;
            var monitor = this.monitor;
            var result = null;

            if (_typeof(spec.item) === 'object') {
              result = spec.item;
            } else if (typeof spec.item === 'function') {
              result = spec.item(monitor);
            } else {
              result = {};
            }

            return (_result = result) !== null && _result !== void 0 ? _result : null;
          }
        }, {
          key: "canDrag",
          value: function canDrag() {
            var spec = this.spec;
            var monitor = this.monitor;

            if (typeof spec.canDrag === 'boolean') {
              return spec.canDrag;
            } else if (typeof spec.canDrag === 'function') {
              return spec.canDrag(monitor);
            } else {
              return true;
            }
          }
        }, {
          key: "isDragging",
          value: function isDragging(globalMonitor, target) {
            var spec = this.spec;
            var monitor = this.monitor;
            var isDragging = spec.isDragging;
            return isDragging ? isDragging(monitor) : target === globalMonitor.getSourceId();
          }
        }, {
          key: "endDrag",
          value: function endDrag() {
            var spec = this.spec;
            var monitor = this.monitor;
            var connector = this.connector;
            var end = spec.end;

            if (end) {
              end(monitor.getItem(), monitor);
            }

            connector.reconnect();
          }
        }]);

        return DragSourceImpl;
      }();

      function useDragSource(spec, monitor, connector) {
        var handler = useMemo(function () {
          return new DragSourceImpl(spec, monitor, connector);
        }, [monitor, connector]);
        useEffect(function () {
          handler.spec = spec;
        }, [spec]);
        return handler;
      }

      /**
       * A hook to retrieve the DragDropManager from Context
       */

      function useDragDropManager() {
        var _useContext = useContext(DndContext),
            dragDropManager = _useContext.dragDropManager;

        invariant(dragDropManager != null, 'Expected drag drop context');
        return dragDropManager;
      }

      function useDragType(spec) {
        return useMemo(function () {
          var result = spec.type;
          invariant(result != null, 'spec.type must be defined');
          return result;
        }, [spec]);
      }

      function _slicedToArray$4(arr, i) { return _arrayWithHoles$4(arr) || _iterableToArrayLimit$4(arr, i) || _unsupportedIterableToArray$5(arr, i) || _nonIterableRest$4(); }

      function _nonIterableRest$4() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray$5(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$5(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$5(o, minLen); }

      function _arrayLikeToArray$5(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

      function _iterableToArrayLimit$4(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

      function _arrayWithHoles$4(arr) { if (Array.isArray(arr)) return arr; }
      function useRegisteredDragSource(spec, monitor, connector) {
        var manager = useDragDropManager();
        var handler = useDragSource(spec, monitor, connector);
        var itemType = useDragType(spec);
        useIsomorphicLayoutEffect(function registerDragSource() {
          if (itemType != null) {
            var _registerSource = registerSource(itemType, handler, manager),
                _registerSource2 = _slicedToArray$4(_registerSource, 2),
                handlerId = _registerSource2[0],
                unregister = _registerSource2[1];

            monitor.receiveHandlerId(handlerId);
            connector.receiveHandlerId(handlerId);
            return unregister;
          }
        }, [manager, monitor, connector, handler, itemType]);
      }

      function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$4(arr) || _nonIterableSpread(); }

      function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }

      function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

      function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$4(arr); }

      function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
      function useOptionalFactory(arg, deps) {
        var memoDeps = _toConsumableArray(deps || []);

        if (deps == null && typeof arg !== 'function') {
          memoDeps.push(arg);
        }

        return useMemo(function () {
          return typeof arg === 'function' ? arg() : arg;
        }, memoDeps);
      }

      function useDragSourceMonitor() {
        var manager = useDragDropManager();
        return useMemo(function () {
          return new DragSourceMonitorImpl(manager);
        }, [manager]);
      }

      function useDragSourceConnector(dragSourceOptions, dragPreviewOptions) {
        var manager = useDragDropManager();
        var connector = useMemo(function () {
          return new SourceConnector(manager.getBackend());
        }, [manager]);
        useIsomorphicLayoutEffect(function () {
          connector.dragSourceOptions = dragSourceOptions || null;
          connector.reconnect();
          return function () {
            return connector.disconnectDragSource();
          };
        }, [connector, dragSourceOptions]);
        useIsomorphicLayoutEffect(function () {
          connector.dragPreviewOptions = dragPreviewOptions || null;
          connector.reconnect();
          return function () {
            return connector.disconnectDragPreview();
          };
        }, [connector, dragPreviewOptions]);
        return connector;
      }

      // do not edit .js files directly - edit src/index.jst



      var fastDeepEqual = function equal(a, b) {
        if (a === b) return true;

        if (a && b && typeof a == 'object' && typeof b == 'object') {
          if (a.constructor !== b.constructor) return false;

          var length, i, keys;
          if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length) return false;
            for (i = length; i-- !== 0;)
              if (!equal(a[i], b[i])) return false;
            return true;
          }



          if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
          if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
          if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

          keys = Object.keys(a);
          length = keys.length;
          if (length !== Object.keys(b).length) return false;

          for (i = length; i-- !== 0;)
            if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

          for (i = length; i-- !== 0;) {
            var key = keys[i];

            if (!equal(a[key], b[key])) return false;
          }

          return true;
        }

        // true if both NaN, false otherwise
        return a!==a && b!==b;
      };

      function _slicedToArray$3(arr, i) { return _arrayWithHoles$3(arr) || _iterableToArrayLimit$3(arr, i) || _unsupportedIterableToArray$3(arr, i) || _nonIterableRest$3(); }

      function _nonIterableRest$3() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

      function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

      function _iterableToArrayLimit$3(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

      function _arrayWithHoles$3(arr) { if (Array.isArray(arr)) return arr; }
      /**
       *
       * @param monitor The monitor to collect state from
       * @param collect The collecting function
       * @param onUpdate A method to invoke when updates occur
       */

      function useCollector(monitor, collect, onUpdate) {
        var _useState = useState(function () {
          return collect(monitor);
        }),
            _useState2 = _slicedToArray$3(_useState, 2),
            collected = _useState2[0],
            setCollected = _useState2[1];

        var updateCollected = useCallback(function () {
          var nextValue = collect(monitor); // This needs to be a deep-equality check because some monitor-collected values
          // include XYCoord objects that may be equivalent, but do not have instance equality.

          if (!fastDeepEqual(collected, nextValue)) {
            setCollected(nextValue);

            if (onUpdate) {
              onUpdate();
            }
          }
        }, [collected, monitor, onUpdate]); // update the collected properties after react renders.
        // Note that the "Dustbin Stress Test" fails if this is not
        // done when the component updates

        useIsomorphicLayoutEffect(updateCollected);
        return [collected, updateCollected];
      }

      function _slicedToArray$2(arr, i) { return _arrayWithHoles$2(arr) || _iterableToArrayLimit$2(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest$2(); }

      function _nonIterableRest$2() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

      function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

      function _iterableToArrayLimit$2(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

      function _arrayWithHoles$2(arr) { if (Array.isArray(arr)) return arr; }
      function useMonitorOutput(monitor, collect, onCollect) {
        var _useCollector = useCollector(monitor, collect, onCollect),
            _useCollector2 = _slicedToArray$2(_useCollector, 2),
            collected = _useCollector2[0],
            updateCollected = _useCollector2[1];

        useIsomorphicLayoutEffect(function subscribeToMonitorStateChange() {
          var handlerId = monitor.getHandlerId();

          if (handlerId == null) {
            return;
          }

          return monitor.subscribeToStateChange(updateCollected, {
            handlerIds: [handlerId]
          });
        }, [monitor, updateCollected]);
        return collected;
      }

      function useCollectedProps(collector, monitor, connector) {
        return useMonitorOutput(monitor, collector || function () {
          return {};
        }, function () {
          return connector.reconnect();
        });
      }

      function useConnectDragSource(connector) {
        return useMemo(function () {
          return connector.hooks.dragSource();
        }, [connector]);
      }
      function useConnectDragPreview(connector) {
        return useMemo(function () {
          return connector.hooks.dragPreview();
        }, [connector]);
      }

      /**
       * useDragSource hook
       * @param sourceSpec The drag source specification (object or function, function preferred)
       * @param deps The memoization deps array to use when evaluating spec changes
       */

      function useDrag(specArg, deps) {
        var spec = useOptionalFactory(specArg, deps);
        invariant(!spec.begin, "useDrag::spec.begin was deprecated in v14. Replace spec.begin() with spec.item(). (see more here - https://react-dnd.github.io/react-dnd/docs/api/use-drag)");
        var monitor = useDragSourceMonitor();
        var connector = useDragSourceConnector(spec.options, spec.previewOptions);
        useRegisteredDragSource(spec, monitor, connector);
        return [useCollectedProps(spec.collect, monitor, connector), useConnectDragSource(connector), useConnectDragPreview(connector)];
      }

      /**
       * Internal utility hook to get an array-version of spec.accept.
       * The main utility here is that we aren't creating a new array on every render if a non-array spec.accept is passed in.
       * @param spec
       */

      function useAccept(spec) {
        var accept = spec.accept;
        return useMemo(function () {
          invariant(spec.accept != null, 'accept must be defined');
          return Array.isArray(accept) ? accept : [accept];
        }, [accept]);
      }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

      function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

      function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

      var DropTargetImpl = /*#__PURE__*/function () {
        function DropTargetImpl(spec, monitor) {
          _classCallCheck(this, DropTargetImpl);

          _defineProperty(this, "spec", void 0);

          _defineProperty(this, "monitor", void 0);

          this.spec = spec;
          this.monitor = monitor;
        }

        _createClass(DropTargetImpl, [{
          key: "canDrop",
          value: function canDrop() {
            var spec = this.spec;
            var monitor = this.monitor;
            return spec.canDrop ? spec.canDrop(monitor.getItem(), monitor) : true;
          }
        }, {
          key: "hover",
          value: function hover() {
            var spec = this.spec;
            var monitor = this.monitor;

            if (spec.hover) {
              spec.hover(monitor.getItem(), monitor);
            }
          }
        }, {
          key: "drop",
          value: function drop() {
            var spec = this.spec;
            var monitor = this.monitor;

            if (spec.drop) {
              return spec.drop(monitor.getItem(), monitor);
            }
          }
        }]);

        return DropTargetImpl;
      }();

      function useDropTarget(spec, monitor) {
        var dropTarget = useMemo(function () {
          return new DropTargetImpl(spec, monitor);
        }, [monitor]);
        useEffect(function () {
          dropTarget.spec = spec;
        }, [spec]);
        return dropTarget;
      }

      function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1(); }

      function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

      function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

      function _iterableToArrayLimit$1(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

      function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }
      function useRegisteredDropTarget(spec, monitor, connector) {
        var manager = useDragDropManager();
        var dropTarget = useDropTarget(spec, monitor);
        var accept = useAccept(spec);
        useIsomorphicLayoutEffect(function registerDropTarget() {
          var _registerTarget = registerTarget(accept, dropTarget, manager),
              _registerTarget2 = _slicedToArray$1(_registerTarget, 2),
              handlerId = _registerTarget2[0],
              unregister = _registerTarget2[1];

          monitor.receiveHandlerId(handlerId);
          connector.receiveHandlerId(handlerId);
          return unregister;
        }, [manager, monitor, dropTarget, connector, accept.map(function (a) {
          return a.toString();
        }).join('|')]);
      }

      function useDropTargetMonitor() {
        var manager = useDragDropManager();
        return useMemo(function () {
          return new DropTargetMonitorImpl(manager);
        }, [manager]);
      }

      function useDropTargetConnector(options) {
        var manager = useDragDropManager();
        var connector = useMemo(function () {
          return new TargetConnector(manager.getBackend());
        }, [manager]);
        useIsomorphicLayoutEffect(function () {
          connector.dropTargetOptions = options || null;
          connector.reconnect();
          return function () {
            return connector.disconnectDropTarget();
          };
        }, [options]);
        return connector;
      }

      function useConnectDropTarget(connector) {
        return useMemo(function () {
          return connector.hooks.dropTarget();
        }, [connector]);
      }

      /**
       * useDropTarget Hook
       * @param spec The drop target specification (object or function, function preferred)
       * @param deps The memoization deps array to use when evaluating spec changes
       */

      function useDrop(specArg, deps) {
        var spec = useOptionalFactory(specArg, deps);
        var monitor = useDropTargetMonitor();
        var connector = useDropTargetConnector(spec.options);
        useRegisteredDropTarget(spec, monitor, connector);
        return [useCollectedProps(spec.collect, monitor, connector), useConnectDropTarget(connector)];
      }

      function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

      function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

      function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

      function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

      function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

      function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
      /**
       * useDragLayer Hook
       * @param collector The property collector
       */

      function useDragLayer(collect) {
        var dragDropManager = useDragDropManager();
        var monitor = dragDropManager.getMonitor();

        var _useCollector = useCollector(monitor, collect),
            _useCollector2 = _slicedToArray(_useCollector, 2),
            collected = _useCollector2[0],
            updateCollected = _useCollector2[1];

        useEffect(function () {
          return monitor.subscribeToOffsetChange(updateCollected);
        });
        useEffect(function () {
          return monitor.subscribeToStateChange(updateCollected);
        });
        return collected;
      }

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vY29yZS9EbmRDb250ZXh0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QvY2pzL3JlYWN0LWpzeC1ydW50aW1lLnByb2R1Y3Rpb24ubWluLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0L2pzeC1ydW50aW1lLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RuZC1jb3JlL2Rpc3QvZXNtL2ludGVyZmFjZXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHJlYWN0LWRuZC9pbnZhcmlhbnQvZGlzdC9pbnZhcmlhbnQuZXNtLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RuZC1jb3JlL2Rpc3QvZXNtL2FjdGlvbnMvZHJhZ0Ryb3AvdHlwZXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vYWN0aW9ucy9kcmFnRHJvcC9sb2NhbC9zZXRDbGllbnRPZmZzZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vdXRpbHMvanNfdXRpbHMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vYWN0aW9ucy9kcmFnRHJvcC9iZWdpbkRyYWcuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vYWN0aW9ucy9kcmFnRHJvcC9wdWJsaXNoRHJhZ1NvdXJjZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kbmQtY29yZS9kaXN0L2VzbS91dGlscy9tYXRjaGVzVHlwZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kbmQtY29yZS9kaXN0L2VzbS9hY3Rpb25zL2RyYWdEcm9wL2hvdmVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RuZC1jb3JlL2Rpc3QvZXNtL2FjdGlvbnMvZHJhZ0Ryb3AvZHJvcC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kbmQtY29yZS9kaXN0L2VzbS9hY3Rpb25zL2RyYWdEcm9wL2VuZERyYWcuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vYWN0aW9ucy9kcmFnRHJvcC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kbmQtY29yZS9kaXN0L2VzbS9jbGFzc2VzL0RyYWdEcm9wTWFuYWdlckltcGwuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVkdXgvZXMvcmVkdXguanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vdXRpbHMvZXF1YWxpdHkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vcmVkdWNlcnMvZHJhZ09mZnNldC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kbmQtY29yZS9kaXN0L2VzbS9hY3Rpb25zL3JlZ2lzdHJ5LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RuZC1jb3JlL2Rpc3QvZXNtL3JlZHVjZXJzL2RyYWdPcGVyYXRpb24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vcmVkdWNlcnMvcmVmQ291bnQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vdXRpbHMvZGlydGluZXNzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RuZC1jb3JlL2Rpc3QvZXNtL3JlZHVjZXJzL2RpcnR5SGFuZGxlcklkcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kbmQtY29yZS9kaXN0L2VzbS9yZWR1Y2Vycy9zdGF0ZUlkLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RuZC1jb3JlL2Rpc3QvZXNtL3JlZHVjZXJzL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RuZC1jb3JlL2Rpc3QvZXNtL3V0aWxzL2Nvb3Jkcy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kbmQtY29yZS9kaXN0L2VzbS9jbGFzc2VzL0RyYWdEcm9wTW9uaXRvckltcGwuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vdXRpbHMvZ2V0TmV4dFVuaXF1ZUlkLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2RuZC1jb3JlL2Rpc3QvZXNtL2NvbnRyYWN0cy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcmVhY3QtZG5kL2FzYXAvZGlzdC9lc20vYnJvd3Nlci9yYXcuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQHJlYWN0LWRuZC9hc2FwL2Rpc3QvZXNtL2Jyb3dzZXIvYXNhcC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9kbmQtY29yZS9kaXN0L2VzbS9jbGFzc2VzL0hhbmRsZXJSZWdpc3RyeUltcGwuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZG5kLWNvcmUvZGlzdC9lc20vY3JlYXRlRHJhZ0Ryb3BNYW5hZ2VyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9jb3JlL0RuZFByb3ZpZGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9jb3JlL0RyYWdQcmV2aWV3SW1hZ2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2ludGVybmFscy9EcmFnU291cmNlTW9uaXRvckltcGwuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2ludGVybmFscy9Ecm9wVGFyZ2V0TW9uaXRvckltcGwuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2ludGVybmFscy93cmFwQ29ubmVjdG9ySG9va3MuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2ludGVybmFscy9pc1JlZi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9AcmVhY3QtZG5kL3NoYWxsb3dlcXVhbC9kaXN0L3NoYWxsb3dlcXVhbC5lc20uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2ludGVybmFscy9Tb3VyY2VDb25uZWN0b3IuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2ludGVybmFscy9UYXJnZXRDb25uZWN0b3IuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2ludGVybmFscy9yZWdpc3RyYXRpb24uanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2RlY29yYXRvcnMvdXRpbHMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2RlY29yYXRvcnMvZGlzcG9zYWJsZXMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3Mvbm9kZV9tb2R1bGVzL3JlYWN0LWlzL2Nqcy9yZWFjdC1pcy5wcm9kdWN0aW9uLm1pbi5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ob2lzdC1ub24tcmVhY3Qtc3RhdGljcy9ub2RlX21vZHVsZXMvcmVhY3QtaXMvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvZGlzdC9ob2lzdC1ub24tcmVhY3Qtc3RhdGljcy5janMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2RlY29yYXRvcnMvZGVjb3JhdGVIYW5kbGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9kZWNvcmF0b3JzL2NyZWF0ZVNvdXJjZUZhY3RvcnkuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2RlY29yYXRvcnMvRHJhZ1NvdXJjZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vZGVjb3JhdG9ycy9jcmVhdGVUYXJnZXRGYWN0b3J5LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9kZWNvcmF0b3JzL0Ryb3BUYXJnZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2RlY29yYXRvcnMvRHJhZ0xheWVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9ob29rcy91c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9ob29rcy91c2VEcmFnL0RyYWdTb3VyY2VJbXBsLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9ob29rcy91c2VEcmFnL3VzZURyYWdTb3VyY2UuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2hvb2tzL3VzZURyYWdEcm9wTWFuYWdlci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vaG9va3MvdXNlRHJhZy91c2VEcmFnVHlwZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vaG9va3MvdXNlRHJhZy91c2VSZWdpc3RlcmVkRHJhZ1NvdXJjZS5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vaG9va3MvdXNlT3B0aW9uYWxGYWN0b3J5LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9ob29rcy91c2VEcmFnL3VzZURyYWdTb3VyY2VNb25pdG9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9ob29rcy91c2VEcmFnL3VzZURyYWdTb3VyY2VDb25uZWN0b3IuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZmFzdC1kZWVwLWVxdWFsL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9ob29rcy91c2VDb2xsZWN0b3IuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2hvb2tzL3VzZU1vbml0b3JPdXRwdXQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2hvb2tzL3VzZUNvbGxlY3RlZFByb3BzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9ob29rcy91c2VEcmFnL2Nvbm5lY3RvcnMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2hvb2tzL3VzZURyYWcvdXNlRHJhZy5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vaG9va3MvdXNlRHJvcC91c2VBY2NlcHQuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2hvb2tzL3VzZURyb3AvRHJvcFRhcmdldEltcGwuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2hvb2tzL3VzZURyb3AvdXNlRHJvcFRhcmdldC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vaG9va3MvdXNlRHJvcC91c2VSZWdpc3RlcmVkRHJvcFRhcmdldC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vaG9va3MvdXNlRHJvcC91c2VEcm9wVGFyZ2V0TW9uaXRvci5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vaG9va3MvdXNlRHJvcC91c2VEcm9wVGFyZ2V0Q29ubmVjdG9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3JlYWN0LWRuZC9kaXN0L2VzbS9ob29rcy91c2VEcm9wL2Nvbm5lY3RvcnMuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVhY3QtZG5kL2Rpc3QvZXNtL2hvb2tzL3VzZURyb3AvdXNlRHJvcC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWFjdC1kbmQvZGlzdC9lc20vaG9va3MvdXNlRHJhZ0xheWVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG4vKipcbiAqIENyZWF0ZSB0aGUgUmVhY3QgQ29udGV4dFxuICovXG5cbmV4cG9ydCB2YXIgRG5kQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQoe1xuICBkcmFnRHJvcE1hbmFnZXI6IHVuZGVmaW5lZFxufSk7IiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIi8qKiBAbGljZW5zZSBSZWFjdCB2MTcuMC4yXG4gKiByZWFjdC1qc3gtcnVudGltZS5wcm9kdWN0aW9uLm1pbi5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgRmFjZWJvb2ssIEluYy4gYW5kIGl0cyBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG4ndXNlIHN0cmljdCc7cmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7dmFyIGY9cmVxdWlyZShcInJlYWN0XCIpLGc9NjAxMDM7ZXhwb3J0cy5GcmFnbWVudD02MDEwNztpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgU3ltYm9sJiZTeW1ib2wuZm9yKXt2YXIgaD1TeW1ib2wuZm9yO2c9aChcInJlYWN0LmVsZW1lbnRcIik7ZXhwb3J0cy5GcmFnbWVudD1oKFwicmVhY3QuZnJhZ21lbnRcIil9dmFyIG09Zi5fX1NFQ1JFVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9ZT1VfV0lMTF9CRV9GSVJFRC5SZWFjdEN1cnJlbnRPd25lcixuPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkscD17a2V5OiEwLHJlZjohMCxfX3NlbGY6ITAsX19zb3VyY2U6ITB9O1xuZnVuY3Rpb24gcShjLGEsayl7dmFyIGIsZD17fSxlPW51bGwsbD1udWxsO3ZvaWQgMCE9PWsmJihlPVwiXCIrayk7dm9pZCAwIT09YS5rZXkmJihlPVwiXCIrYS5rZXkpO3ZvaWQgMCE9PWEucmVmJiYobD1hLnJlZik7Zm9yKGIgaW4gYSluLmNhbGwoYSxiKSYmIXAuaGFzT3duUHJvcGVydHkoYikmJihkW2JdPWFbYl0pO2lmKGMmJmMuZGVmYXVsdFByb3BzKWZvcihiIGluIGE9Yy5kZWZhdWx0UHJvcHMsYSl2b2lkIDA9PT1kW2JdJiYoZFtiXT1hW2JdKTtyZXR1cm57JCR0eXBlb2Y6Zyx0eXBlOmMsa2V5OmUscmVmOmwscHJvcHM6ZCxfb3duZXI6bS5jdXJyZW50fX1leHBvcnRzLmpzeD1xO2V4cG9ydHMuanN4cz1xO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWpzeC1ydW50aW1lLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWpzeC1ydW50aW1lLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCJleHBvcnQgdmFyIEhhbmRsZXJSb2xlO1xuXG4oZnVuY3Rpb24gKEhhbmRsZXJSb2xlKSB7XG4gIEhhbmRsZXJSb2xlW1wiU09VUkNFXCJdID0gXCJTT1VSQ0VcIjtcbiAgSGFuZGxlclJvbGVbXCJUQVJHRVRcIl0gPSBcIlRBUkdFVFwiO1xufSkoSGFuZGxlclJvbGUgfHwgKEhhbmRsZXJSb2xlID0ge30pKTsiLCIvKipcclxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxyXG4gKlxyXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xyXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcclxuICogZXhwZWN0aW5nLlxyXG4gKlxyXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxyXG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXHJcbiAqL1xuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4gPiAyID8gX2xlbiAtIDIgOiAwKSwgX2tleSA9IDI7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXkgLSAyXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG5cbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0IHsgaW52YXJpYW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnZhcmlhbnQuZXNtLmpzLm1hcFxuIiwiZXhwb3J0IHZhciBJTklUX0NPT1JEUyA9ICdkbmQtY29yZS9JTklUX0NPT1JEUyc7XG5leHBvcnQgdmFyIEJFR0lOX0RSQUcgPSAnZG5kLWNvcmUvQkVHSU5fRFJBRyc7XG5leHBvcnQgdmFyIFBVQkxJU0hfRFJBR19TT1VSQ0UgPSAnZG5kLWNvcmUvUFVCTElTSF9EUkFHX1NPVVJDRSc7XG5leHBvcnQgdmFyIEhPVkVSID0gJ2RuZC1jb3JlL0hPVkVSJztcbmV4cG9ydCB2YXIgRFJPUCA9ICdkbmQtY29yZS9EUk9QJztcbmV4cG9ydCB2YXIgRU5EX0RSQUcgPSAnZG5kLWNvcmUvRU5EX0RSQUcnOyIsImltcG9ydCB7IElOSVRfQ09PUkRTIH0gZnJvbSAnLi4vdHlwZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIHNldENsaWVudE9mZnNldChjbGllbnRPZmZzZXQsIHNvdXJjZUNsaWVudE9mZnNldCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IElOSVRfQ09PUkRTLFxuICAgIHBheWxvYWQ6IHtcbiAgICAgIHNvdXJjZUNsaWVudE9mZnNldDogc291cmNlQ2xpZW50T2Zmc2V0IHx8IG51bGwsXG4gICAgICBjbGllbnRPZmZzZXQ6IGNsaWVudE9mZnNldCB8fCBudWxsXG4gICAgfVxuICB9O1xufSIsImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuLy8gY2hlYXAgbG9kYXNoIHJlcGxhY2VtZW50c1xuXG4vKipcbiAqIGRyb3AtaW4gcmVwbGFjZW1lbnQgZm9yIF8uZ2V0XG4gKiBAcGFyYW0gb2JqXG4gKiBAcGFyYW0gcGF0aFxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIHJldHVybiBwYXRoLnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uIChhLCBjKSB7XG4gICAgcmV0dXJuIGEgJiYgYVtjXSA/IGFbY10gOiBkZWZhdWx0VmFsdWUgfHwgbnVsbDtcbiAgfSwgb2JqKTtcbn1cbi8qKlxuICogZHJvcC1pbiByZXBsYWNlbWVudCBmb3IgXy53aXRob3V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhvdXQoaXRlbXMsIGl0ZW0pIHtcbiAgcmV0dXJuIGl0ZW1zLmZpbHRlcihmdW5jdGlvbiAoaSkge1xuICAgIHJldHVybiBpICE9PSBpdGVtO1xuICB9KTtcbn1cbi8qKlxuICogZHJvcC1pbiByZXBsYWNlbWVudCBmb3IgXy5pc1N0cmluZ1xuICogQHBhcmFtIGlucHV0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKGlucHV0KSB7XG4gIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnO1xufVxuLyoqXG4gKiBkcm9wLWluIHJlcGxhY2VtZW50IGZvciBfLmlzU3RyaW5nXG4gKiBAcGFyYW0gaW5wdXRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QoaW5wdXQpIHtcbiAgcmV0dXJuIF90eXBlb2YoaW5wdXQpID09PSAnb2JqZWN0Jztcbn1cbi8qKlxuICogcmVwYWxjZW1lbnQgZm9yIF8ueG9yXG4gKiBAcGFyYW0gaXRlbXNBXG4gKiBAcGFyYW0gaXRlbXNCXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHhvcihpdGVtc0EsIGl0ZW1zQikge1xuICB2YXIgbWFwID0gbmV3IE1hcCgpO1xuXG4gIHZhciBpbnNlcnRJdGVtID0gZnVuY3Rpb24gaW5zZXJ0SXRlbShpdGVtKSB7XG4gICAgbWFwLnNldChpdGVtLCBtYXAuaGFzKGl0ZW0pID8gbWFwLmdldChpdGVtKSArIDEgOiAxKTtcbiAgfTtcblxuICBpdGVtc0EuZm9yRWFjaChpbnNlcnRJdGVtKTtcbiAgaXRlbXNCLmZvckVhY2goaW5zZXJ0SXRlbSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgbWFwLmZvckVhY2goZnVuY3Rpb24gKGNvdW50LCBrZXkpIHtcbiAgICBpZiAoY291bnQgPT09IDEpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogcmVwbGFjZW1lbnQgZm9yIF8uaW50ZXJzZWN0aW9uXG4gKiBAcGFyYW0gaXRlbXNBXG4gKiBAcGFyYW0gaXRlbXNCXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdGlvbihpdGVtc0EsIGl0ZW1zQikge1xuICByZXR1cm4gaXRlbXNBLmZpbHRlcihmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiBpdGVtc0IuaW5kZXhPZih0KSA+IC0xO1xuICB9KTtcbn0iLCJpbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICdAcmVhY3QtZG5kL2ludmFyaWFudCc7XG5pbXBvcnQgeyBzZXRDbGllbnRPZmZzZXQgfSBmcm9tICcuL2xvY2FsL3NldENsaWVudE9mZnNldCc7XG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJy4uLy4uL3V0aWxzL2pzX3V0aWxzJztcbmltcG9ydCB7IEJFR0lOX0RSQUcsIElOSVRfQ09PUkRTIH0gZnJvbSAnLi90eXBlcyc7XG52YXIgUmVzZXRDb29yZGluYXRlc0FjdGlvbiA9IHtcbiAgdHlwZTogSU5JVF9DT09SRFMsXG4gIHBheWxvYWQ6IHtcbiAgICBjbGllbnRPZmZzZXQ6IG51bGwsXG4gICAgc291cmNlQ2xpZW50T2Zmc2V0OiBudWxsXG4gIH1cbn07XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQmVnaW5EcmFnKG1hbmFnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJlZ2luRHJhZygpIHtcbiAgICB2YXIgc291cmNlSWRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBbXTtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge1xuICAgICAgcHVibGlzaFNvdXJjZTogdHJ1ZVxuICAgIH07XG4gICAgdmFyIF9vcHRpb25zJHB1Ymxpc2hTb3VyYyA9IG9wdGlvbnMucHVibGlzaFNvdXJjZSxcbiAgICAgICAgcHVibGlzaFNvdXJjZSA9IF9vcHRpb25zJHB1Ymxpc2hTb3VyYyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHB1Ymxpc2hTb3VyYyxcbiAgICAgICAgY2xpZW50T2Zmc2V0ID0gb3B0aW9ucy5jbGllbnRPZmZzZXQsXG4gICAgICAgIGdldFNvdXJjZUNsaWVudE9mZnNldCA9IG9wdGlvbnMuZ2V0U291cmNlQ2xpZW50T2Zmc2V0O1xuICAgIHZhciBtb25pdG9yID0gbWFuYWdlci5nZXRNb25pdG9yKCk7XG4gICAgdmFyIHJlZ2lzdHJ5ID0gbWFuYWdlci5nZXRSZWdpc3RyeSgpOyAvLyBJbml0aWFsaXplIHRoZSBjb29yZGluYXRlcyB1c2luZyB0aGUgY2xpZW50IG9mZnNldFxuXG4gICAgbWFuYWdlci5kaXNwYXRjaChzZXRDbGllbnRPZmZzZXQoY2xpZW50T2Zmc2V0KSk7XG4gICAgdmVyaWZ5SW52YXJpYW50cyhzb3VyY2VJZHMsIG1vbml0b3IsIHJlZ2lzdHJ5KTsgLy8gR2V0IHRoZSBkcmFnZ2FibGUgc291cmNlXG5cbiAgICB2YXIgc291cmNlSWQgPSBnZXREcmFnZ2FibGVTb3VyY2Uoc291cmNlSWRzLCBtb25pdG9yKTtcblxuICAgIGlmIChzb3VyY2VJZCA9PT0gbnVsbCkge1xuICAgICAgbWFuYWdlci5kaXNwYXRjaChSZXNldENvb3JkaW5hdGVzQWN0aW9uKTtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIEdldCB0aGUgc291cmNlIGNsaWVudCBvZmZzZXRcblxuXG4gICAgdmFyIHNvdXJjZUNsaWVudE9mZnNldCA9IG51bGw7XG5cbiAgICBpZiAoY2xpZW50T2Zmc2V0KSB7XG4gICAgICBpZiAoIWdldFNvdXJjZUNsaWVudE9mZnNldCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldFNvdXJjZUNsaWVudE9mZnNldCBtdXN0IGJlIGRlZmluZWQnKTtcbiAgICAgIH1cblxuICAgICAgdmVyaWZ5R2V0U291cmNlQ2xpZW50T2Zmc2V0SXNGdW5jdGlvbihnZXRTb3VyY2VDbGllbnRPZmZzZXQpO1xuICAgICAgc291cmNlQ2xpZW50T2Zmc2V0ID0gZ2V0U291cmNlQ2xpZW50T2Zmc2V0KHNvdXJjZUlkKTtcbiAgICB9IC8vIEluaXRpYWxpemUgdGhlIGZ1bGwgY29vcmRpbmF0ZXNcblxuXG4gICAgbWFuYWdlci5kaXNwYXRjaChzZXRDbGllbnRPZmZzZXQoY2xpZW50T2Zmc2V0LCBzb3VyY2VDbGllbnRPZmZzZXQpKTtcbiAgICB2YXIgc291cmNlID0gcmVnaXN0cnkuZ2V0U291cmNlKHNvdXJjZUlkKTtcbiAgICB2YXIgaXRlbSA9IHNvdXJjZS5iZWdpbkRyYWcobW9uaXRvciwgc291cmNlSWQpOyAvLyBJZiBzb3VyY2UuYmVnaW5EcmFnIHJldHVybnMgbnVsbCwgdGhpcyBpcyBhbiBpbmRpY2F0b3IgdG8gY2FuY2VsIHRoZSBkcmFnXG5cbiAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZlcmlmeUl0ZW1Jc09iamVjdChpdGVtKTtcbiAgICByZWdpc3RyeS5waW5Tb3VyY2Uoc291cmNlSWQpO1xuICAgIHZhciBpdGVtVHlwZSA9IHJlZ2lzdHJ5LmdldFNvdXJjZVR5cGUoc291cmNlSWQpO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBCRUdJTl9EUkFHLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICBpdGVtVHlwZTogaXRlbVR5cGUsXG4gICAgICAgIGl0ZW06IGl0ZW0sXG4gICAgICAgIHNvdXJjZUlkOiBzb3VyY2VJZCxcbiAgICAgICAgY2xpZW50T2Zmc2V0OiBjbGllbnRPZmZzZXQgfHwgbnVsbCxcbiAgICAgICAgc291cmNlQ2xpZW50T2Zmc2V0OiBzb3VyY2VDbGllbnRPZmZzZXQgfHwgbnVsbCxcbiAgICAgICAgaXNTb3VyY2VQdWJsaWM6ICEhcHVibGlzaFNvdXJjZVxuICAgICAgfVxuICAgIH07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHZlcmlmeUludmFyaWFudHMoc291cmNlSWRzLCBtb25pdG9yLCByZWdpc3RyeSkge1xuICBpbnZhcmlhbnQoIW1vbml0b3IuaXNEcmFnZ2luZygpLCAnQ2Fubm90IGNhbGwgYmVnaW5EcmFnIHdoaWxlIGRyYWdnaW5nLicpO1xuICBzb3VyY2VJZHMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlSWQpIHtcbiAgICBpbnZhcmlhbnQocmVnaXN0cnkuZ2V0U291cmNlKHNvdXJjZUlkKSwgJ0V4cGVjdGVkIHNvdXJjZUlkcyB0byBiZSByZWdpc3RlcmVkLicpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5R2V0U291cmNlQ2xpZW50T2Zmc2V0SXNGdW5jdGlvbihnZXRTb3VyY2VDbGllbnRPZmZzZXQpIHtcbiAgaW52YXJpYW50KHR5cGVvZiBnZXRTb3VyY2VDbGllbnRPZmZzZXQgPT09ICdmdW5jdGlvbicsICdXaGVuIGNsaWVudE9mZnNldCBpcyBwcm92aWRlZCwgZ2V0U291cmNlQ2xpZW50T2Zmc2V0IG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5SXRlbUlzT2JqZWN0KGl0ZW0pIHtcbiAgaW52YXJpYW50KGlzT2JqZWN0KGl0ZW0pLCAnSXRlbSBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbn1cblxuZnVuY3Rpb24gZ2V0RHJhZ2dhYmxlU291cmNlKHNvdXJjZUlkcywgbW9uaXRvcikge1xuICB2YXIgc291cmNlSWQgPSBudWxsO1xuXG4gIGZvciAodmFyIGkgPSBzb3VyY2VJZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAobW9uaXRvci5jYW5EcmFnU291cmNlKHNvdXJjZUlkc1tpXSkpIHtcbiAgICAgIHNvdXJjZUlkID0gc291cmNlSWRzW2ldO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNvdXJjZUlkO1xufSIsImltcG9ydCB7IFBVQkxJU0hfRFJBR19TT1VSQ0UgfSBmcm9tICcuL3R5cGVzJztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQdWJsaXNoRHJhZ1NvdXJjZShtYW5hZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwdWJsaXNoRHJhZ1NvdXJjZSgpIHtcbiAgICB2YXIgbW9uaXRvciA9IG1hbmFnZXIuZ2V0TW9uaXRvcigpO1xuXG4gICAgaWYgKG1vbml0b3IuaXNEcmFnZ2luZygpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBQVUJMSVNIX0RSQUdfU09VUkNFXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0iLCJleHBvcnQgZnVuY3Rpb24gbWF0Y2hlc1R5cGUodGFyZ2V0VHlwZSwgZHJhZ2dlZEl0ZW1UeXBlKSB7XG4gIGlmIChkcmFnZ2VkSXRlbVR5cGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gdGFyZ2V0VHlwZSA9PT0gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBBcnJheS5pc0FycmF5KHRhcmdldFR5cGUpID8gdGFyZ2V0VHlwZS5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgPT09IGRyYWdnZWRJdGVtVHlwZTtcbiAgfSkgOiB0YXJnZXRUeXBlID09PSBkcmFnZ2VkSXRlbVR5cGU7XG59IiwiaW1wb3J0IHsgaW52YXJpYW50IH0gZnJvbSAnQHJlYWN0LWRuZC9pbnZhcmlhbnQnO1xuaW1wb3J0IHsgbWF0Y2hlc1R5cGUgfSBmcm9tICcuLi8uLi91dGlscy9tYXRjaGVzVHlwZSc7XG5pbXBvcnQgeyBIT1ZFUiB9IGZyb20gJy4vdHlwZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUhvdmVyKG1hbmFnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGhvdmVyKHRhcmdldElkc0FyZykge1xuICAgIHZhciBfcmVmID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fSxcbiAgICAgICAgY2xpZW50T2Zmc2V0ID0gX3JlZi5jbGllbnRPZmZzZXQ7XG5cbiAgICB2ZXJpZnlUYXJnZXRJZHNJc0FycmF5KHRhcmdldElkc0FyZyk7XG4gICAgdmFyIHRhcmdldElkcyA9IHRhcmdldElkc0FyZy5zbGljZSgwKTtcbiAgICB2YXIgbW9uaXRvciA9IG1hbmFnZXIuZ2V0TW9uaXRvcigpO1xuICAgIHZhciByZWdpc3RyeSA9IG1hbmFnZXIuZ2V0UmVnaXN0cnkoKTtcbiAgICBjaGVja0ludmFyaWFudHModGFyZ2V0SWRzLCBtb25pdG9yLCByZWdpc3RyeSk7XG4gICAgdmFyIGRyYWdnZWRJdGVtVHlwZSA9IG1vbml0b3IuZ2V0SXRlbVR5cGUoKTtcbiAgICByZW1vdmVOb25NYXRjaGluZ1RhcmdldElkcyh0YXJnZXRJZHMsIHJlZ2lzdHJ5LCBkcmFnZ2VkSXRlbVR5cGUpO1xuICAgIGhvdmVyQWxsVGFyZ2V0cyh0YXJnZXRJZHMsIG1vbml0b3IsIHJlZ2lzdHJ5KTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogSE9WRVIsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIHRhcmdldElkczogdGFyZ2V0SWRzLFxuICAgICAgICBjbGllbnRPZmZzZXQ6IGNsaWVudE9mZnNldCB8fCBudWxsXG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5VGFyZ2V0SWRzSXNBcnJheSh0YXJnZXRJZHNBcmcpIHtcbiAgaW52YXJpYW50KEFycmF5LmlzQXJyYXkodGFyZ2V0SWRzQXJnKSwgJ0V4cGVjdGVkIHRhcmdldElkcyB0byBiZSBhbiBhcnJheS4nKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnZhcmlhbnRzKHRhcmdldElkcywgbW9uaXRvciwgcmVnaXN0cnkpIHtcbiAgaW52YXJpYW50KG1vbml0b3IuaXNEcmFnZ2luZygpLCAnQ2Fubm90IGNhbGwgaG92ZXIgd2hpbGUgbm90IGRyYWdnaW5nLicpO1xuICBpbnZhcmlhbnQoIW1vbml0b3IuZGlkRHJvcCgpLCAnQ2Fubm90IGNhbGwgaG92ZXIgYWZ0ZXIgZHJvcC4nKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldElkcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0YXJnZXRJZCA9IHRhcmdldElkc1tpXTtcbiAgICBpbnZhcmlhbnQodGFyZ2V0SWRzLmxhc3RJbmRleE9mKHRhcmdldElkKSA9PT0gaSwgJ0V4cGVjdGVkIHRhcmdldElkcyB0byBiZSB1bmlxdWUgaW4gdGhlIHBhc3NlZCBhcnJheS4nKTtcbiAgICB2YXIgdGFyZ2V0ID0gcmVnaXN0cnkuZ2V0VGFyZ2V0KHRhcmdldElkKTtcbiAgICBpbnZhcmlhbnQodGFyZ2V0LCAnRXhwZWN0ZWQgdGFyZ2V0SWRzIHRvIGJlIHJlZ2lzdGVyZWQuJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlTm9uTWF0Y2hpbmdUYXJnZXRJZHModGFyZ2V0SWRzLCByZWdpc3RyeSwgZHJhZ2dlZEl0ZW1UeXBlKSB7XG4gIC8vIFJlbW92ZSB0aG9zZSB0YXJnZXRJZHMgdGhhdCBkb24ndCBtYXRjaCB0aGUgdGFyZ2V0VHlwZS4gIFRoaXNcbiAgLy8gZml4ZXMgc2hhbGxvdyBpc092ZXIgd2hpY2ggd291bGQgb25seSBiZSBub24tc2hhbGxvdyBiZWNhdXNlIG9mXG4gIC8vIG5vbi1tYXRjaGluZyB0YXJnZXRzLlxuICBmb3IgKHZhciBpID0gdGFyZ2V0SWRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIHRhcmdldElkID0gdGFyZ2V0SWRzW2ldO1xuICAgIHZhciB0YXJnZXRUeXBlID0gcmVnaXN0cnkuZ2V0VGFyZ2V0VHlwZSh0YXJnZXRJZCk7XG5cbiAgICBpZiAoIW1hdGNoZXNUeXBlKHRhcmdldFR5cGUsIGRyYWdnZWRJdGVtVHlwZSkpIHtcbiAgICAgIHRhcmdldElkcy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGhvdmVyQWxsVGFyZ2V0cyh0YXJnZXRJZHMsIG1vbml0b3IsIHJlZ2lzdHJ5KSB7XG4gIC8vIEZpbmFsbHkgY2FsbCBob3ZlciBvbiBhbGwgbWF0Y2hpbmcgdGFyZ2V0cy5cbiAgdGFyZ2V0SWRzLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldElkKSB7XG4gICAgdmFyIHRhcmdldCA9IHJlZ2lzdHJ5LmdldFRhcmdldCh0YXJnZXRJZCk7XG4gICAgdGFyZ2V0LmhvdmVyKG1vbml0b3IsIHRhcmdldElkKTtcbiAgfSk7XG59IiwiZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7IHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7IGlmIChlbnVtZXJhYmxlT25seSkgeyBzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTsgfSk7IH0ga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9OyBpZiAoaSAlIDIpIHsgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KTsgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykgeyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpOyB9IGVsc2UgeyBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5pbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICdAcmVhY3QtZG5kL2ludmFyaWFudCc7XG5pbXBvcnQgeyBEUk9QIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJy4uLy4uL3V0aWxzL2pzX3V0aWxzJztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEcm9wKG1hbmFnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRyb3AoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBtb25pdG9yID0gbWFuYWdlci5nZXRNb25pdG9yKCk7XG4gICAgdmFyIHJlZ2lzdHJ5ID0gbWFuYWdlci5nZXRSZWdpc3RyeSgpO1xuICAgIHZlcmlmeUludmFyaWFudHMobW9uaXRvcik7XG4gICAgdmFyIHRhcmdldElkcyA9IGdldERyb3BwYWJsZVRhcmdldHMobW9uaXRvcik7IC8vIE11bHRpcGxlIGFjdGlvbnMgYXJlIGRpc3BhdGNoZWQgaGVyZSwgd2hpY2ggaXMgd2h5IHRoaXMgZG9lc24ndCByZXR1cm4gYW4gYWN0aW9uXG5cbiAgICB0YXJnZXRJZHMuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0SWQsIGluZGV4KSB7XG4gICAgICB2YXIgZHJvcFJlc3VsdCA9IGRldGVybWluZURyb3BSZXN1bHQodGFyZ2V0SWQsIGluZGV4LCByZWdpc3RyeSwgbW9uaXRvcik7XG4gICAgICB2YXIgYWN0aW9uID0ge1xuICAgICAgICB0eXBlOiBEUk9QLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgZHJvcFJlc3VsdDogX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBvcHRpb25zKSwgZHJvcFJlc3VsdClcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIG1hbmFnZXIuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5SW52YXJpYW50cyhtb25pdG9yKSB7XG4gIGludmFyaWFudChtb25pdG9yLmlzRHJhZ2dpbmcoKSwgJ0Nhbm5vdCBjYWxsIGRyb3Agd2hpbGUgbm90IGRyYWdnaW5nLicpO1xuICBpbnZhcmlhbnQoIW1vbml0b3IuZGlkRHJvcCgpLCAnQ2Fubm90IGNhbGwgZHJvcCB0d2ljZSBkdXJpbmcgb25lIGRyYWcgb3BlcmF0aW9uLicpO1xufVxuXG5mdW5jdGlvbiBkZXRlcm1pbmVEcm9wUmVzdWx0KHRhcmdldElkLCBpbmRleCwgcmVnaXN0cnksIG1vbml0b3IpIHtcbiAgdmFyIHRhcmdldCA9IHJlZ2lzdHJ5LmdldFRhcmdldCh0YXJnZXRJZCk7XG4gIHZhciBkcm9wUmVzdWx0ID0gdGFyZ2V0ID8gdGFyZ2V0LmRyb3AobW9uaXRvciwgdGFyZ2V0SWQpIDogdW5kZWZpbmVkO1xuICB2ZXJpZnlEcm9wUmVzdWx0VHlwZShkcm9wUmVzdWx0KTtcblxuICBpZiAodHlwZW9mIGRyb3BSZXN1bHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZHJvcFJlc3VsdCA9IGluZGV4ID09PSAwID8ge30gOiBtb25pdG9yLmdldERyb3BSZXN1bHQoKTtcbiAgfVxuXG4gIHJldHVybiBkcm9wUmVzdWx0O1xufVxuXG5mdW5jdGlvbiB2ZXJpZnlEcm9wUmVzdWx0VHlwZShkcm9wUmVzdWx0KSB7XG4gIGludmFyaWFudCh0eXBlb2YgZHJvcFJlc3VsdCA9PT0gJ3VuZGVmaW5lZCcgfHwgaXNPYmplY3QoZHJvcFJlc3VsdCksICdEcm9wIHJlc3VsdCBtdXN0IGVpdGhlciBiZSBhbiBvYmplY3Qgb3IgdW5kZWZpbmVkLicpO1xufVxuXG5mdW5jdGlvbiBnZXREcm9wcGFibGVUYXJnZXRzKG1vbml0b3IpIHtcbiAgdmFyIHRhcmdldElkcyA9IG1vbml0b3IuZ2V0VGFyZ2V0SWRzKCkuZmlsdGVyKG1vbml0b3IuY2FuRHJvcE9uVGFyZ2V0LCBtb25pdG9yKTtcbiAgdGFyZ2V0SWRzLnJldmVyc2UoKTtcbiAgcmV0dXJuIHRhcmdldElkcztcbn0iLCJpbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICdAcmVhY3QtZG5kL2ludmFyaWFudCc7XG5pbXBvcnQgeyBFTkRfRFJBRyB9IGZyb20gJy4vdHlwZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVuZERyYWcobWFuYWdlcikge1xuICByZXR1cm4gZnVuY3Rpb24gZW5kRHJhZygpIHtcbiAgICB2YXIgbW9uaXRvciA9IG1hbmFnZXIuZ2V0TW9uaXRvcigpO1xuICAgIHZhciByZWdpc3RyeSA9IG1hbmFnZXIuZ2V0UmVnaXN0cnkoKTtcbiAgICB2ZXJpZnlJc0RyYWdnaW5nKG1vbml0b3IpO1xuICAgIHZhciBzb3VyY2VJZCA9IG1vbml0b3IuZ2V0U291cmNlSWQoKTtcblxuICAgIGlmIChzb3VyY2VJZCAhPSBudWxsKSB7XG4gICAgICB2YXIgc291cmNlID0gcmVnaXN0cnkuZ2V0U291cmNlKHNvdXJjZUlkLCB0cnVlKTtcbiAgICAgIHNvdXJjZS5lbmREcmFnKG1vbml0b3IsIHNvdXJjZUlkKTtcbiAgICAgIHJlZ2lzdHJ5LnVucGluU291cmNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IEVORF9EUkFHXG4gICAgfTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5SXNEcmFnZ2luZyhtb25pdG9yKSB7XG4gIGludmFyaWFudChtb25pdG9yLmlzRHJhZ2dpbmcoKSwgJ0Nhbm5vdCBjYWxsIGVuZERyYWcgd2hpbGUgbm90IGRyYWdnaW5nLicpO1xufSIsImltcG9ydCB7IGNyZWF0ZUJlZ2luRHJhZyB9IGZyb20gJy4vYmVnaW5EcmFnJztcbmltcG9ydCB7IGNyZWF0ZVB1Ymxpc2hEcmFnU291cmNlIH0gZnJvbSAnLi9wdWJsaXNoRHJhZ1NvdXJjZSc7XG5pbXBvcnQgeyBjcmVhdGVIb3ZlciB9IGZyb20gJy4vaG92ZXInO1xuaW1wb3J0IHsgY3JlYXRlRHJvcCB9IGZyb20gJy4vZHJvcCc7XG5pbXBvcnQgeyBjcmVhdGVFbmREcmFnIH0gZnJvbSAnLi9lbmREcmFnJztcbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMnO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURyYWdEcm9wQWN0aW9ucyhtYW5hZ2VyKSB7XG4gIHJldHVybiB7XG4gICAgYmVnaW5EcmFnOiBjcmVhdGVCZWdpbkRyYWcobWFuYWdlciksXG4gICAgcHVibGlzaERyYWdTb3VyY2U6IGNyZWF0ZVB1Ymxpc2hEcmFnU291cmNlKG1hbmFnZXIpLFxuICAgIGhvdmVyOiBjcmVhdGVIb3ZlcihtYW5hZ2VyKSxcbiAgICBkcm9wOiBjcmVhdGVEcm9wKG1hbmFnZXIpLFxuICAgIGVuZERyYWc6IGNyZWF0ZUVuZERyYWcobWFuYWdlcilcbiAgfTtcbn0iLCJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmltcG9ydCB7IGNyZWF0ZURyYWdEcm9wQWN0aW9ucyB9IGZyb20gJy4uL2FjdGlvbnMvZHJhZ0Ryb3AnO1xuZXhwb3J0IHZhciBEcmFnRHJvcE1hbmFnZXJJbXBsID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRHJhZ0Ryb3BNYW5hZ2VySW1wbChzdG9yZSwgbW9uaXRvcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRHJhZ0Ryb3BNYW5hZ2VySW1wbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJzdG9yZVwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibW9uaXRvclwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiYmFja2VuZFwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaXNTZXRVcFwiLCBmYWxzZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJoYW5kbGVSZWZDb3VudENoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2hvdWxkU2V0VXAgPSBfdGhpcy5zdG9yZS5nZXRTdGF0ZSgpLnJlZkNvdW50ID4gMDtcblxuICAgICAgaWYgKF90aGlzLmJhY2tlbmQpIHtcbiAgICAgICAgaWYgKHNob3VsZFNldFVwICYmICFfdGhpcy5pc1NldFVwKSB7XG4gICAgICAgICAgX3RoaXMuYmFja2VuZC5zZXR1cCgpO1xuXG4gICAgICAgICAgX3RoaXMuaXNTZXRVcCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoIXNob3VsZFNldFVwICYmIF90aGlzLmlzU2V0VXApIHtcbiAgICAgICAgICBfdGhpcy5iYWNrZW5kLnRlYXJkb3duKCk7XG5cbiAgICAgICAgICBfdGhpcy5pc1NldFVwID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICB0aGlzLm1vbml0b3IgPSBtb25pdG9yO1xuICAgIHN0b3JlLnN1YnNjcmliZSh0aGlzLmhhbmRsZVJlZkNvdW50Q2hhbmdlKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhEcmFnRHJvcE1hbmFnZXJJbXBsLCBbe1xuICAgIGtleTogXCJyZWNlaXZlQmFja2VuZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWNlaXZlQmFja2VuZChiYWNrZW5kKSB7XG4gICAgICB0aGlzLmJhY2tlbmQgPSBiYWNrZW5kO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRNb25pdG9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldE1vbml0b3IoKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb25pdG9yO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRCYWNrZW5kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEJhY2tlbmQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5iYWNrZW5kO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRSZWdpc3RyeVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRSZWdpc3RyeSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vbml0b3IucmVnaXN0cnk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEFjdGlvbnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QWN0aW9ucygpIHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhcyAqL1xuICAgICAgdmFyIG1hbmFnZXIgPSB0aGlzO1xuICAgICAgdmFyIGRpc3BhdGNoID0gdGhpcy5zdG9yZS5kaXNwYXRjaDtcblxuICAgICAgZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgYWN0aW9uID0gYWN0aW9uQ3JlYXRvci5hcHBseShtYW5hZ2VyLCBhcmdzKTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgYWN0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZGlzcGF0Y2goYWN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHZhciBhY3Rpb25zID0gY3JlYXRlRHJhZ0Ryb3BBY3Rpb25zKHRoaXMpO1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGFjdGlvbnMpLnJlZHVjZShmdW5jdGlvbiAoYm91bmRBY3Rpb25zLCBrZXkpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IGFjdGlvbnNba2V5XTtcbiAgICAgICAgYm91bmRBY3Rpb25zW2tleV0gPSBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb24pO1xuICAgICAgICByZXR1cm4gYm91bmRBY3Rpb25zO1xuICAgICAgfSwge30pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaXNwYXRjaFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goYWN0aW9uKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRHJhZ0Ryb3BNYW5hZ2VySW1wbDtcbn0oKTsiLCJpbXBvcnQgX29iamVjdFNwcmVhZCBmcm9tICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9vYmplY3RTcHJlYWQyJztcblxuLyoqXG4gKiBBZGFwdGVkIGZyb20gUmVhY3Q6IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL21hc3Rlci9wYWNrYWdlcy9zaGFyZWQvZm9ybWF0UHJvZEVycm9yTWVzc2FnZS5qc1xuICpcbiAqIERvIG5vdCByZXF1aXJlIHRoaXMgbW9kdWxlIGRpcmVjdGx5ISBVc2Ugbm9ybWFsIHRocm93IGVycm9yIGNhbGxzLiBUaGVzZSBtZXNzYWdlcyB3aWxsIGJlIHJlcGxhY2VkIHdpdGggZXJyb3IgY29kZXNcbiAqIGR1cmluZyBidWlsZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2RlXG4gKi9cbmZ1bmN0aW9uIGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoY29kZSkge1xuICByZXR1cm4gXCJNaW5pZmllZCBSZWR1eCBlcnJvciAjXCIgKyBjb2RlICsgXCI7IHZpc2l0IGh0dHBzOi8vcmVkdXguanMub3JnL0Vycm9ycz9jb2RlPVwiICsgY29kZSArIFwiIGZvciB0aGUgZnVsbCBtZXNzYWdlIG9yIFwiICsgJ3VzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCBmb3IgZnVsbCBlcnJvcnMuICc7XG59XG5cbi8vIElubGluZWQgdmVyc2lvbiBvZiB0aGUgYHN5bWJvbC1vYnNlcnZhYmxlYCBwb2x5ZmlsbFxudmFyICQkb2JzZXJ2YWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5vYnNlcnZhYmxlIHx8ICdAQG9ic2VydmFibGUnO1xufSkoKTtcblxuLyoqXG4gKiBUaGVzZSBhcmUgcHJpdmF0ZSBhY3Rpb24gdHlwZXMgcmVzZXJ2ZWQgYnkgUmVkdXguXG4gKiBGb3IgYW55IHVua25vd24gYWN0aW9ucywgeW91IG11c3QgcmV0dXJuIHRoZSBjdXJyZW50IHN0YXRlLlxuICogSWYgdGhlIGN1cnJlbnQgc3RhdGUgaXMgdW5kZWZpbmVkLCB5b3UgbXVzdCByZXR1cm4gdGhlIGluaXRpYWwgc3RhdGUuXG4gKiBEbyBub3QgcmVmZXJlbmNlIHRoZXNlIGFjdGlvbiB0eXBlcyBkaXJlY3RseSBpbiB5b3VyIGNvZGUuXG4gKi9cbnZhciByYW5kb21TdHJpbmcgPSBmdW5jdGlvbiByYW5kb21TdHJpbmcoKSB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNykuc3BsaXQoJycpLmpvaW4oJy4nKTtcbn07XG5cbnZhciBBY3Rpb25UeXBlcyA9IHtcbiAgSU5JVDogXCJAQHJlZHV4L0lOSVRcIiArIHJhbmRvbVN0cmluZygpLFxuICBSRVBMQUNFOiBcIkBAcmVkdXgvUkVQTEFDRVwiICsgcmFuZG9tU3RyaW5nKCksXG4gIFBST0JFX1VOS05PV05fQUNUSU9OOiBmdW5jdGlvbiBQUk9CRV9VTktOT1dOX0FDVElPTigpIHtcbiAgICByZXR1cm4gXCJAQHJlZHV4L1BST0JFX1VOS05PV05fQUNUSU9OXCIgKyByYW5kb21TdHJpbmcoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0ge2FueX0gb2JqIFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBhcmd1bWVudCBhcHBlYXJzIHRvIGJlIGEgcGxhaW4gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gIHZhciBwcm90byA9IG9iajtcblxuICB3aGlsZSAoT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKSAhPT0gbnVsbCkge1xuICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSA9PT0gcHJvdG87XG59XG5cbi8vIElubGluZWQgLyBzaG9ydGVuZWQgdmVyc2lvbiBvZiBga2luZE9mYCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9qb25zY2hsaW5rZXJ0L2tpbmQtb2ZcbmZ1bmN0aW9uIG1pbmlLaW5kT2YodmFsKSB7XG4gIGlmICh2YWwgPT09IHZvaWQgMCkgcmV0dXJuICd1bmRlZmluZWQnO1xuICBpZiAodmFsID09PSBudWxsKSByZXR1cm4gJ251bGwnO1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICBjYXNlICdudW1iZXInOlxuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAge1xuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgIH1cbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHJldHVybiAnYXJyYXknO1xuICBpZiAoaXNEYXRlKHZhbCkpIHJldHVybiAnZGF0ZSc7XG4gIGlmIChpc0Vycm9yKHZhbCkpIHJldHVybiAnZXJyb3InO1xuICB2YXIgY29uc3RydWN0b3JOYW1lID0gY3Rvck5hbWUodmFsKTtcblxuICBzd2l0Y2ggKGNvbnN0cnVjdG9yTmFtZSkge1xuICAgIGNhc2UgJ1N5bWJvbCc6XG4gICAgY2FzZSAnUHJvbWlzZSc6XG4gICAgY2FzZSAnV2Vha01hcCc6XG4gICAgY2FzZSAnV2Vha1NldCc6XG4gICAgY2FzZSAnTWFwJzpcbiAgICBjYXNlICdTZXQnOlxuICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yTmFtZTtcbiAgfSAvLyBvdGhlclxuXG5cbiAgcmV0dXJuIHR5cGUuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzL2csICcnKTtcbn1cblxuZnVuY3Rpb24gY3Rvck5hbWUodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nID8gdmFsLmNvbnN0cnVjdG9yLm5hbWUgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBpc0Vycm9yKHZhbCkge1xuICByZXR1cm4gdmFsIGluc3RhbmNlb2YgRXJyb3IgfHwgdHlwZW9mIHZhbC5tZXNzYWdlID09PSAnc3RyaW5nJyAmJiB2YWwuY29uc3RydWN0b3IgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5zdGFja1RyYWNlTGltaXQgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc0RhdGUodmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBEYXRlKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIHR5cGVvZiB2YWwudG9EYXRlU3RyaW5nID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB2YWwuZ2V0RGF0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsLnNldERhdGUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGtpbmRPZih2YWwpIHtcbiAgdmFyIHR5cGVPZlZhbCA9IHR5cGVvZiB2YWw7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICB0eXBlT2ZWYWwgPSBtaW5pS2luZE9mKHZhbCk7XG4gIH1cblxuICByZXR1cm4gdHlwZU9mVmFsO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBSZWR1eCBzdG9yZSB0aGF0IGhvbGRzIHRoZSBzdGF0ZSB0cmVlLlxuICogVGhlIG9ubHkgd2F5IHRvIGNoYW5nZSB0aGUgZGF0YSBpbiB0aGUgc3RvcmUgaXMgdG8gY2FsbCBgZGlzcGF0Y2goKWAgb24gaXQuXG4gKlxuICogVGhlcmUgc2hvdWxkIG9ubHkgYmUgYSBzaW5nbGUgc3RvcmUgaW4geW91ciBhcHAuIFRvIHNwZWNpZnkgaG93IGRpZmZlcmVudFxuICogcGFydHMgb2YgdGhlIHN0YXRlIHRyZWUgcmVzcG9uZCB0byBhY3Rpb25zLCB5b3UgbWF5IGNvbWJpbmUgc2V2ZXJhbCByZWR1Y2Vyc1xuICogaW50byBhIHNpbmdsZSByZWR1Y2VyIGZ1bmN0aW9uIGJ5IHVzaW5nIGBjb21iaW5lUmVkdWNlcnNgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlZHVjZXIgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG5leHQgc3RhdGUgdHJlZSwgZ2l2ZW5cbiAqIHRoZSBjdXJyZW50IHN0YXRlIHRyZWUgYW5kIHRoZSBhY3Rpb24gdG8gaGFuZGxlLlxuICpcbiAqIEBwYXJhbSB7YW55fSBbcHJlbG9hZGVkU3RhdGVdIFRoZSBpbml0aWFsIHN0YXRlLiBZb3UgbWF5IG9wdGlvbmFsbHkgc3BlY2lmeSBpdFxuICogdG8gaHlkcmF0ZSB0aGUgc3RhdGUgZnJvbSB0aGUgc2VydmVyIGluIHVuaXZlcnNhbCBhcHBzLCBvciB0byByZXN0b3JlIGFcbiAqIHByZXZpb3VzbHkgc2VyaWFsaXplZCB1c2VyIHNlc3Npb24uXG4gKiBJZiB5b3UgdXNlIGBjb21iaW5lUmVkdWNlcnNgIHRvIHByb2R1Y2UgdGhlIHJvb3QgcmVkdWNlciBmdW5jdGlvbiwgdGhpcyBtdXN0IGJlXG4gKiBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzaGFwZSBhcyBgY29tYmluZVJlZHVjZXJzYCBrZXlzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtlbmhhbmNlcl0gVGhlIHN0b3JlIGVuaGFuY2VyLiBZb3UgbWF5IG9wdGlvbmFsbHkgc3BlY2lmeSBpdFxuICogdG8gZW5oYW5jZSB0aGUgc3RvcmUgd2l0aCB0aGlyZC1wYXJ0eSBjYXBhYmlsaXRpZXMgc3VjaCBhcyBtaWRkbGV3YXJlLFxuICogdGltZSB0cmF2ZWwsIHBlcnNpc3RlbmNlLCBldGMuIFRoZSBvbmx5IHN0b3JlIGVuaGFuY2VyIHRoYXQgc2hpcHMgd2l0aCBSZWR1eFxuICogaXMgYGFwcGx5TWlkZGxld2FyZSgpYC5cbiAqXG4gKiBAcmV0dXJucyB7U3RvcmV9IEEgUmVkdXggc3RvcmUgdGhhdCBsZXRzIHlvdSByZWFkIHRoZSBzdGF0ZSwgZGlzcGF0Y2ggYWN0aW9uc1xuICogYW5kIHN1YnNjcmliZSB0byBjaGFuZ2VzLlxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVN0b3JlKHJlZHVjZXIsIHByZWxvYWRlZFN0YXRlLCBlbmhhbmNlcikge1xuICB2YXIgX3JlZjI7XG5cbiAgaWYgKHR5cGVvZiBwcmVsb2FkZWRTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZW5oYW5jZXIgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIGVuaGFuY2VyID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBhcmd1bWVudHNbM10gPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgwKSA6ICdJdCBsb29rcyBsaWtlIHlvdSBhcmUgcGFzc2luZyBzZXZlcmFsIHN0b3JlIGVuaGFuY2VycyB0byAnICsgJ2NyZWF0ZVN0b3JlKCkuIFRoaXMgaXMgbm90IHN1cHBvcnRlZC4gSW5zdGVhZCwgY29tcG9zZSB0aGVtICcgKyAndG9nZXRoZXIgdG8gYSBzaW5nbGUgZnVuY3Rpb24uIFNlZSBodHRwczovL3JlZHV4LmpzLm9yZy90dXRvcmlhbHMvZnVuZGFtZW50YWxzL3BhcnQtNC1zdG9yZSNjcmVhdGluZy1hLXN0b3JlLXdpdGgtZW5oYW5jZXJzIGZvciBhbiBleGFtcGxlLicpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBwcmVsb2FkZWRTdGF0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZW5oYW5jZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgZW5oYW5jZXIgPSBwcmVsb2FkZWRTdGF0ZTtcbiAgICBwcmVsb2FkZWRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZW5oYW5jZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBlbmhhbmNlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMSkgOiBcIkV4cGVjdGVkIHRoZSBlbmhhbmNlciB0byBiZSBhIGZ1bmN0aW9uLiBJbnN0ZWFkLCByZWNlaXZlZDogJ1wiICsga2luZE9mKGVuaGFuY2VyKSArIFwiJ1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZW5oYW5jZXIoY3JlYXRlU3RvcmUpKHJlZHVjZXIsIHByZWxvYWRlZFN0YXRlKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgcmVkdWNlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDIpIDogXCJFeHBlY3RlZCB0aGUgcm9vdCByZWR1Y2VyIHRvIGJlIGEgZnVuY3Rpb24uIEluc3RlYWQsIHJlY2VpdmVkOiAnXCIgKyBraW5kT2YocmVkdWNlcikgKyBcIidcIik7XG4gIH1cblxuICB2YXIgY3VycmVudFJlZHVjZXIgPSByZWR1Y2VyO1xuICB2YXIgY3VycmVudFN0YXRlID0gcHJlbG9hZGVkU3RhdGU7XG4gIHZhciBjdXJyZW50TGlzdGVuZXJzID0gW107XG4gIHZhciBuZXh0TGlzdGVuZXJzID0gY3VycmVudExpc3RlbmVycztcbiAgdmFyIGlzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgLyoqXG4gICAqIFRoaXMgbWFrZXMgYSBzaGFsbG93IGNvcHkgb2YgY3VycmVudExpc3RlbmVycyBzbyB3ZSBjYW4gdXNlXG4gICAqIG5leHRMaXN0ZW5lcnMgYXMgYSB0ZW1wb3JhcnkgbGlzdCB3aGlsZSBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogVGhpcyBwcmV2ZW50cyBhbnkgYnVncyBhcm91bmQgY29uc3VtZXJzIGNhbGxpbmdcbiAgICogc3Vic2NyaWJlL3Vuc3Vic2NyaWJlIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC5cbiAgICovXG5cbiAgZnVuY3Rpb24gZW5zdXJlQ2FuTXV0YXRlTmV4dExpc3RlbmVycygpIHtcbiAgICBpZiAobmV4dExpc3RlbmVycyA9PT0gY3VycmVudExpc3RlbmVycykge1xuICAgICAgbmV4dExpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnMuc2xpY2UoKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFJlYWRzIHRoZSBzdGF0ZSB0cmVlIG1hbmFnZWQgYnkgdGhlIHN0b3JlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7YW55fSBUaGUgY3VycmVudCBzdGF0ZSB0cmVlIG9mIHlvdXIgYXBwbGljYXRpb24uXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG4gICAgaWYgKGlzRGlzcGF0Y2hpbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDMpIDogJ1lvdSBtYXkgbm90IGNhbGwgc3RvcmUuZ2V0U3RhdGUoKSB3aGlsZSB0aGUgcmVkdWNlciBpcyBleGVjdXRpbmcuICcgKyAnVGhlIHJlZHVjZXIgaGFzIGFscmVhZHkgcmVjZWl2ZWQgdGhlIHN0YXRlIGFzIGFuIGFyZ3VtZW50LiAnICsgJ1Bhc3MgaXQgZG93biBmcm9tIHRoZSB0b3AgcmVkdWNlciBpbnN0ZWFkIG9mIHJlYWRpbmcgaXQgZnJvbSB0aGUgc3RvcmUuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRTdGF0ZTtcbiAgfVxuICAvKipcbiAgICogQWRkcyBhIGNoYW5nZSBsaXN0ZW5lci4gSXQgd2lsbCBiZSBjYWxsZWQgYW55IHRpbWUgYW4gYWN0aW9uIGlzIGRpc3BhdGNoZWQsXG4gICAqIGFuZCBzb21lIHBhcnQgb2YgdGhlIHN0YXRlIHRyZWUgbWF5IHBvdGVudGlhbGx5IGhhdmUgY2hhbmdlZC4gWW91IG1heSB0aGVuXG4gICAqIGNhbGwgYGdldFN0YXRlKClgIHRvIHJlYWQgdGhlIGN1cnJlbnQgc3RhdGUgdHJlZSBpbnNpZGUgdGhlIGNhbGxiYWNrLlxuICAgKlxuICAgKiBZb3UgbWF5IGNhbGwgYGRpc3BhdGNoKClgIGZyb20gYSBjaGFuZ2UgbGlzdGVuZXIsIHdpdGggdGhlIGZvbGxvd2luZ1xuICAgKiBjYXZlYXRzOlxuICAgKlxuICAgKiAxLiBUaGUgc3Vic2NyaXB0aW9ucyBhcmUgc25hcHNob3R0ZWQganVzdCBiZWZvcmUgZXZlcnkgYGRpc3BhdGNoKClgIGNhbGwuXG4gICAqIElmIHlvdSBzdWJzY3JpYmUgb3IgdW5zdWJzY3JpYmUgd2hpbGUgdGhlIGxpc3RlbmVycyBhcmUgYmVpbmcgaW52b2tlZCwgdGhpc1xuICAgKiB3aWxsIG5vdCBoYXZlIGFueSBlZmZlY3Qgb24gdGhlIGBkaXNwYXRjaCgpYCB0aGF0IGlzIGN1cnJlbnRseSBpbiBwcm9ncmVzcy5cbiAgICogSG93ZXZlciwgdGhlIG5leHQgYGRpc3BhdGNoKClgIGNhbGwsIHdoZXRoZXIgbmVzdGVkIG9yIG5vdCwgd2lsbCB1c2UgYSBtb3JlXG4gICAqIHJlY2VudCBzbmFwc2hvdCBvZiB0aGUgc3Vic2NyaXB0aW9uIGxpc3QuXG4gICAqXG4gICAqIDIuIFRoZSBsaXN0ZW5lciBzaG91bGQgbm90IGV4cGVjdCB0byBzZWUgYWxsIHN0YXRlIGNoYW5nZXMsIGFzIHRoZSBzdGF0ZVxuICAgKiBtaWdodCBoYXZlIGJlZW4gdXBkYXRlZCBtdWx0aXBsZSB0aW1lcyBkdXJpbmcgYSBuZXN0ZWQgYGRpc3BhdGNoKClgIGJlZm9yZVxuICAgKiB0aGUgbGlzdGVuZXIgaXMgY2FsbGVkLiBJdCBpcywgaG93ZXZlciwgZ3VhcmFudGVlZCB0aGF0IGFsbCBzdWJzY3JpYmVyc1xuICAgKiByZWdpc3RlcmVkIGJlZm9yZSB0aGUgYGRpc3BhdGNoKClgIHN0YXJ0ZWQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgbGF0ZXN0XG4gICAqIHN0YXRlIGJ5IHRoZSB0aW1lIGl0IGV4aXRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBBIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgb24gZXZlcnkgZGlzcGF0Y2guXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0byByZW1vdmUgdGhpcyBjaGFuZ2UgbGlzdGVuZXIuXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gc3Vic2NyaWJlKGxpc3RlbmVyKSB7XG4gICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoNCkgOiBcIkV4cGVjdGVkIHRoZSBsaXN0ZW5lciB0byBiZSBhIGZ1bmN0aW9uLiBJbnN0ZWFkLCByZWNlaXZlZDogJ1wiICsga2luZE9mKGxpc3RlbmVyKSArIFwiJ1wiKTtcbiAgICB9XG5cbiAgICBpZiAoaXNEaXNwYXRjaGluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoNSkgOiAnWW91IG1heSBub3QgY2FsbCBzdG9yZS5zdWJzY3JpYmUoKSB3aGlsZSB0aGUgcmVkdWNlciBpcyBleGVjdXRpbmcuICcgKyAnSWYgeW91IHdvdWxkIGxpa2UgdG8gYmUgbm90aWZpZWQgYWZ0ZXIgdGhlIHN0b3JlIGhhcyBiZWVuIHVwZGF0ZWQsIHN1YnNjcmliZSBmcm9tIGEgJyArICdjb21wb25lbnQgYW5kIGludm9rZSBzdG9yZS5nZXRTdGF0ZSgpIGluIHRoZSBjYWxsYmFjayB0byBhY2Nlc3MgdGhlIGxhdGVzdCBzdGF0ZS4gJyArICdTZWUgaHR0cHM6Ly9yZWR1eC5qcy5vcmcvYXBpL3N0b3JlI3N1YnNjcmliZWxpc3RlbmVyIGZvciBtb3JlIGRldGFpbHMuJyk7XG4gICAgfVxuXG4gICAgdmFyIGlzU3Vic2NyaWJlZCA9IHRydWU7XG4gICAgZW5zdXJlQ2FuTXV0YXRlTmV4dExpc3RlbmVycygpO1xuICAgIG5leHRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHVuc3Vic2NyaWJlKCkge1xuICAgICAgaWYgKCFpc1N1YnNjcmliZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNEaXNwYXRjaGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg2KSA6ICdZb3UgbWF5IG5vdCB1bnN1YnNjcmliZSBmcm9tIGEgc3RvcmUgbGlzdGVuZXIgd2hpbGUgdGhlIHJlZHVjZXIgaXMgZXhlY3V0aW5nLiAnICsgJ1NlZSBodHRwczovL3JlZHV4LmpzLm9yZy9hcGkvc3RvcmUjc3Vic2NyaWJlbGlzdGVuZXIgZm9yIG1vcmUgZGV0YWlscy4nKTtcbiAgICAgIH1cblxuICAgICAgaXNTdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgICBlbnN1cmVDYW5NdXRhdGVOZXh0TGlzdGVuZXJzKCk7XG4gICAgICB2YXIgaW5kZXggPSBuZXh0TGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgbmV4dExpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgY3VycmVudExpc3RlbmVycyA9IG51bGw7XG4gICAgfTtcbiAgfVxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhbiBhY3Rpb24uIEl0IGlzIHRoZSBvbmx5IHdheSB0byB0cmlnZ2VyIGEgc3RhdGUgY2hhbmdlLlxuICAgKlxuICAgKiBUaGUgYHJlZHVjZXJgIGZ1bmN0aW9uLCB1c2VkIHRvIGNyZWF0ZSB0aGUgc3RvcmUsIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlXG4gICAqIGN1cnJlbnQgc3RhdGUgdHJlZSBhbmQgdGhlIGdpdmVuIGBhY3Rpb25gLiBJdHMgcmV0dXJuIHZhbHVlIHdpbGxcbiAgICogYmUgY29uc2lkZXJlZCB0aGUgKipuZXh0Kiogc3RhdGUgb2YgdGhlIHRyZWUsIGFuZCB0aGUgY2hhbmdlIGxpc3RlbmVyc1xuICAgKiB3aWxsIGJlIG5vdGlmaWVkLlxuICAgKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvbmx5IHN1cHBvcnRzIHBsYWluIG9iamVjdCBhY3Rpb25zLiBJZiB5b3Ugd2FudCB0b1xuICAgKiBkaXNwYXRjaCBhIFByb21pc2UsIGFuIE9ic2VydmFibGUsIGEgdGh1bmssIG9yIHNvbWV0aGluZyBlbHNlLCB5b3UgbmVlZCB0b1xuICAgKiB3cmFwIHlvdXIgc3RvcmUgY3JlYXRpbmcgZnVuY3Rpb24gaW50byB0aGUgY29ycmVzcG9uZGluZyBtaWRkbGV3YXJlLiBGb3JcbiAgICogZXhhbXBsZSwgc2VlIHRoZSBkb2N1bWVudGF0aW9uIGZvciB0aGUgYHJlZHV4LXRodW5rYCBwYWNrYWdlLiBFdmVuIHRoZVxuICAgKiBtaWRkbGV3YXJlIHdpbGwgZXZlbnR1YWxseSBkaXNwYXRjaCBwbGFpbiBvYmplY3QgYWN0aW9ucyB1c2luZyB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiBBIHBsYWluIG9iamVjdCByZXByZXNlbnRpbmcg4oCcd2hhdCBjaGFuZ2Vk4oCdLiBJdCBpc1xuICAgKiBhIGdvb2QgaWRlYSB0byBrZWVwIGFjdGlvbnMgc2VyaWFsaXphYmxlIHNvIHlvdSBjYW4gcmVjb3JkIGFuZCByZXBsYXkgdXNlclxuICAgKiBzZXNzaW9ucywgb3IgdXNlIHRoZSB0aW1lIHRyYXZlbGxpbmcgYHJlZHV4LWRldnRvb2xzYC4gQW4gYWN0aW9uIG11c3QgaGF2ZVxuICAgKiBhIGB0eXBlYCBwcm9wZXJ0eSB3aGljaCBtYXkgbm90IGJlIGB1bmRlZmluZWRgLiBJdCBpcyBhIGdvb2QgaWRlYSB0byB1c2VcbiAgICogc3RyaW5nIGNvbnN0YW50cyBmb3IgYWN0aW9uIHR5cGVzLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBGb3IgY29udmVuaWVuY2UsIHRoZSBzYW1lIGFjdGlvbiBvYmplY3QgeW91IGRpc3BhdGNoZWQuXG4gICAqXG4gICAqIE5vdGUgdGhhdCwgaWYgeW91IHVzZSBhIGN1c3RvbSBtaWRkbGV3YXJlLCBpdCBtYXkgd3JhcCBgZGlzcGF0Y2goKWAgdG9cbiAgICogcmV0dXJuIHNvbWV0aGluZyBlbHNlIChmb3IgZXhhbXBsZSwgYSBQcm9taXNlIHlvdSBjYW4gYXdhaXQpLlxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIGRpc3BhdGNoKGFjdGlvbikge1xuICAgIGlmICghaXNQbGFpbk9iamVjdChhY3Rpb24pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg3KSA6IFwiQWN0aW9ucyBtdXN0IGJlIHBsYWluIG9iamVjdHMuIEluc3RlYWQsIHRoZSBhY3R1YWwgdHlwZSB3YXM6ICdcIiArIGtpbmRPZihhY3Rpb24pICsgXCInLiBZb3UgbWF5IG5lZWQgdG8gYWRkIG1pZGRsZXdhcmUgdG8geW91ciBzdG9yZSBzZXR1cCB0byBoYW5kbGUgZGlzcGF0Y2hpbmcgb3RoZXIgdmFsdWVzLCBzdWNoIGFzICdyZWR1eC10aHVuaycgdG8gaGFuZGxlIGRpc3BhdGNoaW5nIGZ1bmN0aW9ucy4gU2VlIGh0dHBzOi8vcmVkdXguanMub3JnL3R1dG9yaWFscy9mdW5kYW1lbnRhbHMvcGFydC00LXN0b3JlI21pZGRsZXdhcmUgYW5kIGh0dHBzOi8vcmVkdXguanMub3JnL3R1dG9yaWFscy9mdW5kYW1lbnRhbHMvcGFydC02LWFzeW5jLWxvZ2ljI3VzaW5nLXRoZS1yZWR1eC10aHVuay1taWRkbGV3YXJlIGZvciBleGFtcGxlcy5cIik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBhY3Rpb24udHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDgpIDogJ0FjdGlvbnMgbWF5IG5vdCBoYXZlIGFuIHVuZGVmaW5lZCBcInR5cGVcIiBwcm9wZXJ0eS4gWW91IG1heSBoYXZlIG1pc3NwZWxsZWQgYW4gYWN0aW9uIHR5cGUgc3RyaW5nIGNvbnN0YW50LicpO1xuICAgIH1cblxuICAgIGlmIChpc0Rpc3BhdGNoaW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSg5KSA6ICdSZWR1Y2VycyBtYXkgbm90IGRpc3BhdGNoIGFjdGlvbnMuJyk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudFJlZHVjZXIoY3VycmVudFN0YXRlLCBhY3Rpb24pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGxpc3RlbmVycyA9IGN1cnJlbnRMaXN0ZW5lcnMgPSBuZXh0TGlzdGVuZXJzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgIGxpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfVxuICAvKipcbiAgICogUmVwbGFjZXMgdGhlIHJlZHVjZXIgY3VycmVudGx5IHVzZWQgYnkgdGhlIHN0b3JlIHRvIGNhbGN1bGF0ZSB0aGUgc3RhdGUuXG4gICAqXG4gICAqIFlvdSBtaWdodCBuZWVkIHRoaXMgaWYgeW91ciBhcHAgaW1wbGVtZW50cyBjb2RlIHNwbGl0dGluZyBhbmQgeW91IHdhbnQgdG9cbiAgICogbG9hZCBzb21lIG9mIHRoZSByZWR1Y2VycyBkeW5hbWljYWxseS4gWW91IG1pZ2h0IGFsc28gbmVlZCB0aGlzIGlmIHlvdVxuICAgKiBpbXBsZW1lbnQgYSBob3QgcmVsb2FkaW5nIG1lY2hhbmlzbSBmb3IgUmVkdXguXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG5leHRSZWR1Y2VyIFRoZSByZWR1Y2VyIGZvciB0aGUgc3RvcmUgdG8gdXNlIGluc3RlYWQuXG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIHJlcGxhY2VSZWR1Y2VyKG5leHRSZWR1Y2VyKSB7XG4gICAgaWYgKHR5cGVvZiBuZXh0UmVkdWNlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTApIDogXCJFeHBlY3RlZCB0aGUgbmV4dFJlZHVjZXIgdG8gYmUgYSBmdW5jdGlvbi4gSW5zdGVhZCwgcmVjZWl2ZWQ6ICdcIiArIGtpbmRPZihuZXh0UmVkdWNlcikpO1xuICAgIH1cblxuICAgIGN1cnJlbnRSZWR1Y2VyID0gbmV4dFJlZHVjZXI7IC8vIFRoaXMgYWN0aW9uIGhhcyBhIHNpbWlsaWFyIGVmZmVjdCB0byBBY3Rpb25UeXBlcy5JTklULlxuICAgIC8vIEFueSByZWR1Y2VycyB0aGF0IGV4aXN0ZWQgaW4gYm90aCB0aGUgbmV3IGFuZCBvbGQgcm9vdFJlZHVjZXJcbiAgICAvLyB3aWxsIHJlY2VpdmUgdGhlIHByZXZpb3VzIHN0YXRlLiBUaGlzIGVmZmVjdGl2ZWx5IHBvcHVsYXRlc1xuICAgIC8vIHRoZSBuZXcgc3RhdGUgdHJlZSB3aXRoIGFueSByZWxldmFudCBkYXRhIGZyb20gdGhlIG9sZCBvbmUuXG5cbiAgICBkaXNwYXRjaCh7XG4gICAgICB0eXBlOiBBY3Rpb25UeXBlcy5SRVBMQUNFXG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIEludGVyb3BlcmFiaWxpdHkgcG9pbnQgZm9yIG9ic2VydmFibGUvcmVhY3RpdmUgbGlicmFyaWVzLlxuICAgKiBAcmV0dXJucyB7b2JzZXJ2YWJsZX0gQSBtaW5pbWFsIG9ic2VydmFibGUgb2Ygc3RhdGUgY2hhbmdlcy5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGUgb2JzZXJ2YWJsZSBwcm9wb3NhbDpcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JzZXJ2YWJsZVxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIG9ic2VydmFibGUoKSB7XG4gICAgdmFyIF9yZWY7XG5cbiAgICB2YXIgb3V0ZXJTdWJzY3JpYmUgPSBzdWJzY3JpYmU7XG4gICAgcmV0dXJuIF9yZWYgPSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBtaW5pbWFsIG9ic2VydmFibGUgc3Vic2NyaXB0aW9uIG1ldGhvZC5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYnNlcnZlciBBbnkgb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gb2JzZXJ2ZXIuXG4gICAgICAgKiBUaGUgb2JzZXJ2ZXIgb2JqZWN0IHNob3VsZCBoYXZlIGEgYG5leHRgIG1ldGhvZC5cbiAgICAgICAqIEByZXR1cm5zIHtzdWJzY3JpcHRpb259IEFuIG9iamVjdCB3aXRoIGFuIGB1bnN1YnNjcmliZWAgbWV0aG9kIHRoYXQgY2FuXG4gICAgICAgKiBiZSB1c2VkIHRvIHVuc3Vic2NyaWJlIHRoZSBvYnNlcnZhYmxlIGZyb20gdGhlIHN0b3JlLCBhbmQgcHJldmVudCBmdXJ0aGVyXG4gICAgICAgKiBlbWlzc2lvbiBvZiB2YWx1ZXMgZnJvbSB0aGUgb2JzZXJ2YWJsZS5cbiAgICAgICAqL1xuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiBzdWJzY3JpYmUob2JzZXJ2ZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYnNlcnZlciAhPT0gJ29iamVjdCcgfHwgb2JzZXJ2ZXIgPT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxMSkgOiBcIkV4cGVjdGVkIHRoZSBvYnNlcnZlciB0byBiZSBhbiBvYmplY3QuIEluc3RlYWQsIHJlY2VpdmVkOiAnXCIgKyBraW5kT2Yob2JzZXJ2ZXIpICsgXCInXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb2JzZXJ2ZVN0YXRlKCkge1xuICAgICAgICAgIGlmIChvYnNlcnZlci5uZXh0KSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KGdldFN0YXRlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9ic2VydmVTdGF0ZSgpO1xuICAgICAgICB2YXIgdW5zdWJzY3JpYmUgPSBvdXRlclN1YnNjcmliZShvYnNlcnZlU3RhdGUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlOiB1bnN1YnNjcmliZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIF9yZWZbJCRvYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9yZWY7XG4gIH0gLy8gV2hlbiBhIHN0b3JlIGlzIGNyZWF0ZWQsIGFuIFwiSU5JVFwiIGFjdGlvbiBpcyBkaXNwYXRjaGVkIHNvIHRoYXQgZXZlcnlcbiAgLy8gcmVkdWNlciByZXR1cm5zIHRoZWlyIGluaXRpYWwgc3RhdGUuIFRoaXMgZWZmZWN0aXZlbHkgcG9wdWxhdGVzXG4gIC8vIHRoZSBpbml0aWFsIHN0YXRlIHRyZWUuXG5cblxuICBkaXNwYXRjaCh7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuSU5JVFxuICB9KTtcbiAgcmV0dXJuIF9yZWYyID0ge1xuICAgIGRpc3BhdGNoOiBkaXNwYXRjaCxcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICBnZXRTdGF0ZTogZ2V0U3RhdGUsXG4gICAgcmVwbGFjZVJlZHVjZXI6IHJlcGxhY2VSZWR1Y2VyXG4gIH0sIF9yZWYyWyQkb2JzZXJ2YWJsZV0gPSBvYnNlcnZhYmxlLCBfcmVmMjtcbn1cblxuLyoqXG4gKiBQcmludHMgYSB3YXJuaW5nIGluIHRoZSBjb25zb2xlIGlmIGl0IGV4aXN0cy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSBUaGUgd2FybmluZyBtZXNzYWdlLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHdhcm5pbmcobWVzc2FnZSkge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuXG5cbiAgdHJ5IHtcbiAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IGlmIHlvdSBlbmFibGVcbiAgICAvLyBcImJyZWFrIG9uIGFsbCBleGNlcHRpb25zXCIgaW4geW91ciBjb25zb2xlLFxuICAgIC8vIGl0IHdvdWxkIHBhdXNlIHRoZSBleGVjdXRpb24gYXQgdGhpcyBsaW5lLlxuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfSBjYXRjaCAoZSkge30gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lbXB0eVxuXG59XG5cbmZ1bmN0aW9uIGdldFVuZXhwZWN0ZWRTdGF0ZVNoYXBlV2FybmluZ01lc3NhZ2UoaW5wdXRTdGF0ZSwgcmVkdWNlcnMsIGFjdGlvbiwgdW5leHBlY3RlZEtleUNhY2hlKSB7XG4gIHZhciByZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKHJlZHVjZXJzKTtcbiAgdmFyIGFyZ3VtZW50TmFtZSA9IGFjdGlvbiAmJiBhY3Rpb24udHlwZSA9PT0gQWN0aW9uVHlwZXMuSU5JVCA/ICdwcmVsb2FkZWRTdGF0ZSBhcmd1bWVudCBwYXNzZWQgdG8gY3JlYXRlU3RvcmUnIDogJ3ByZXZpb3VzIHN0YXRlIHJlY2VpdmVkIGJ5IHRoZSByZWR1Y2VyJztcblxuICBpZiAocmVkdWNlcktleXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuICdTdG9yZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcmVkdWNlci4gTWFrZSBzdXJlIHRoZSBhcmd1bWVudCBwYXNzZWQgJyArICd0byBjb21iaW5lUmVkdWNlcnMgaXMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgcmVkdWNlcnMuJztcbiAgfVxuXG4gIGlmICghaXNQbGFpbk9iamVjdChpbnB1dFN0YXRlKSkge1xuICAgIHJldHVybiBcIlRoZSBcIiArIGFyZ3VtZW50TmFtZSArIFwiIGhhcyB1bmV4cGVjdGVkIHR5cGUgb2YgXFxcIlwiICsga2luZE9mKGlucHV0U3RhdGUpICsgXCJcXFwiLiBFeHBlY3RlZCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIFwiICsgKFwia2V5czogXFxcIlwiICsgcmVkdWNlcktleXMuam9pbignXCIsIFwiJykgKyBcIlxcXCJcIik7XG4gIH1cblxuICB2YXIgdW5leHBlY3RlZEtleXMgPSBPYmplY3Qua2V5cyhpbnB1dFN0YXRlKS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiAhcmVkdWNlcnMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhdW5leHBlY3RlZEtleUNhY2hlW2tleV07XG4gIH0pO1xuICB1bmV4cGVjdGVkS2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB1bmV4cGVjdGVkS2V5Q2FjaGVba2V5XSA9IHRydWU7XG4gIH0pO1xuICBpZiAoYWN0aW9uICYmIGFjdGlvbi50eXBlID09PSBBY3Rpb25UeXBlcy5SRVBMQUNFKSByZXR1cm47XG5cbiAgaWYgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXCJVbmV4cGVjdGVkIFwiICsgKHVuZXhwZWN0ZWRLZXlzLmxlbmd0aCA+IDEgPyAna2V5cycgOiAna2V5JykgKyBcIiBcIiArIChcIlxcXCJcIiArIHVuZXhwZWN0ZWRLZXlzLmpvaW4oJ1wiLCBcIicpICsgXCJcXFwiIGZvdW5kIGluIFwiICsgYXJndW1lbnROYW1lICsgXCIuIFwiKSArIFwiRXhwZWN0ZWQgdG8gZmluZCBvbmUgb2YgdGhlIGtub3duIHJlZHVjZXIga2V5cyBpbnN0ZWFkOiBcIiArIChcIlxcXCJcIiArIHJlZHVjZXJLZXlzLmpvaW4oJ1wiLCBcIicpICsgXCJcXFwiLiBVbmV4cGVjdGVkIGtleXMgd2lsbCBiZSBpZ25vcmVkLlwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRSZWR1Y2VyU2hhcGUocmVkdWNlcnMpIHtcbiAgT2JqZWN0LmtleXMocmVkdWNlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciByZWR1Y2VyID0gcmVkdWNlcnNba2V5XTtcbiAgICB2YXIgaW5pdGlhbFN0YXRlID0gcmVkdWNlcih1bmRlZmluZWQsIHtcbiAgICAgIHR5cGU6IEFjdGlvblR5cGVzLklOSVRcbiAgICB9KTtcblxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFN0YXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTIpIDogXCJUaGUgc2xpY2UgcmVkdWNlciBmb3Iga2V5IFxcXCJcIiArIGtleSArIFwiXFxcIiByZXR1cm5lZCB1bmRlZmluZWQgZHVyaW5nIGluaXRpYWxpemF0aW9uLiBcIiArIFwiSWYgdGhlIHN0YXRlIHBhc3NlZCB0byB0aGUgcmVkdWNlciBpcyB1bmRlZmluZWQsIHlvdSBtdXN0IFwiICsgXCJleHBsaWNpdGx5IHJldHVybiB0aGUgaW5pdGlhbCBzdGF0ZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5IFwiICsgXCJub3QgYmUgdW5kZWZpbmVkLiBJZiB5b3UgZG9uJ3Qgd2FudCB0byBzZXQgYSB2YWx1ZSBmb3IgdGhpcyByZWR1Y2VyLCBcIiArIFwieW91IGNhbiB1c2UgbnVsbCBpbnN0ZWFkIG9mIHVuZGVmaW5lZC5cIik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByZWR1Y2VyKHVuZGVmaW5lZCwge1xuICAgICAgdHlwZTogQWN0aW9uVHlwZXMuUFJPQkVfVU5LTk9XTl9BQ1RJT04oKVxuICAgIH0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTMpIDogXCJUaGUgc2xpY2UgcmVkdWNlciBmb3Iga2V5IFxcXCJcIiArIGtleSArIFwiXFxcIiByZXR1cm5lZCB1bmRlZmluZWQgd2hlbiBwcm9iZWQgd2l0aCBhIHJhbmRvbSB0eXBlLiBcIiArIChcIkRvbid0IHRyeSB0byBoYW5kbGUgJ1wiICsgQWN0aW9uVHlwZXMuSU5JVCArIFwiJyBvciBvdGhlciBhY3Rpb25zIGluIFxcXCJyZWR1eC8qXFxcIiBcIikgKyBcIm5hbWVzcGFjZS4gVGhleSBhcmUgY29uc2lkZXJlZCBwcml2YXRlLiBJbnN0ZWFkLCB5b3UgbXVzdCByZXR1cm4gdGhlIFwiICsgXCJjdXJyZW50IHN0YXRlIGZvciBhbnkgdW5rbm93biBhY3Rpb25zLCB1bmxlc3MgaXQgaXMgdW5kZWZpbmVkLCBcIiArIFwiaW4gd2hpY2ggY2FzZSB5b3UgbXVzdCByZXR1cm4gdGhlIGluaXRpYWwgc3RhdGUsIHJlZ2FyZGxlc3Mgb2YgdGhlIFwiICsgXCJhY3Rpb24gdHlwZS4gVGhlIGluaXRpYWwgc3RhdGUgbWF5IG5vdCBiZSB1bmRlZmluZWQsIGJ1dCBjYW4gYmUgbnVsbC5cIik7XG4gICAgfVxuICB9KTtcbn1cbi8qKlxuICogVHVybnMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgZGlmZmVyZW50IHJlZHVjZXIgZnVuY3Rpb25zLCBpbnRvIGEgc2luZ2xlXG4gKiByZWR1Y2VyIGZ1bmN0aW9uLiBJdCB3aWxsIGNhbGwgZXZlcnkgY2hpbGQgcmVkdWNlciwgYW5kIGdhdGhlciB0aGVpciByZXN1bHRzXG4gKiBpbnRvIGEgc2luZ2xlIHN0YXRlIG9iamVjdCwgd2hvc2Uga2V5cyBjb3JyZXNwb25kIHRvIHRoZSBrZXlzIG9mIHRoZSBwYXNzZWRcbiAqIHJlZHVjZXIgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWR1Y2VycyBBbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGNvcnJlc3BvbmQgdG8gZGlmZmVyZW50XG4gKiByZWR1Y2VyIGZ1bmN0aW9ucyB0aGF0IG5lZWQgdG8gYmUgY29tYmluZWQgaW50byBvbmUuIE9uZSBoYW5keSB3YXkgdG8gb2J0YWluXG4gKiBpdCBpcyB0byB1c2UgRVM2IGBpbXBvcnQgKiBhcyByZWR1Y2Vyc2Agc3ludGF4LiBUaGUgcmVkdWNlcnMgbWF5IG5ldmVyIHJldHVyblxuICogdW5kZWZpbmVkIGZvciBhbnkgYWN0aW9uLiBJbnN0ZWFkLCB0aGV5IHNob3VsZCByZXR1cm4gdGhlaXIgaW5pdGlhbCBzdGF0ZVxuICogaWYgdGhlIHN0YXRlIHBhc3NlZCB0byB0aGVtIHdhcyB1bmRlZmluZWQsIGFuZCB0aGUgY3VycmVudCBzdGF0ZSBmb3IgYW55XG4gKiB1bnJlY29nbml6ZWQgYWN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSByZWR1Y2VyIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBldmVyeSByZWR1Y2VyIGluc2lkZSB0aGVcbiAqIHBhc3NlZCBvYmplY3QsIGFuZCBidWlsZHMgYSBzdGF0ZSBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzaGFwZS5cbiAqL1xuXG5cbmZ1bmN0aW9uIGNvbWJpbmVSZWR1Y2VycyhyZWR1Y2Vycykge1xuICB2YXIgcmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhyZWR1Y2Vycyk7XG4gIHZhciBmaW5hbFJlZHVjZXJzID0ge307XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWR1Y2VyS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSByZWR1Y2VyS2V5c1tpXTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAodHlwZW9mIHJlZHVjZXJzW2tleV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdhcm5pbmcoXCJObyByZWR1Y2VyIHByb3ZpZGVkIGZvciBrZXkgXFxcIlwiICsga2V5ICsgXCJcXFwiXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcmVkdWNlcnNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZmluYWxSZWR1Y2Vyc1trZXldID0gcmVkdWNlcnNba2V5XTtcbiAgICB9XG4gIH1cblxuICB2YXIgZmluYWxSZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKGZpbmFsUmVkdWNlcnMpOyAvLyBUaGlzIGlzIHVzZWQgdG8gbWFrZSBzdXJlIHdlIGRvbid0IHdhcm4gYWJvdXQgdGhlIHNhbWVcbiAgLy8ga2V5cyBtdWx0aXBsZSB0aW1lcy5cblxuICB2YXIgdW5leHBlY3RlZEtleUNhY2hlO1xuXG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgdW5leHBlY3RlZEtleUNhY2hlID0ge307XG4gIH1cblxuICB2YXIgc2hhcGVBc3NlcnRpb25FcnJvcjtcblxuICB0cnkge1xuICAgIGFzc2VydFJlZHVjZXJTaGFwZShmaW5hbFJlZHVjZXJzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHNoYXBlQXNzZXJ0aW9uRXJyb3IgPSBlO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbWJpbmF0aW9uKHN0YXRlLCBhY3Rpb24pIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoc2hhcGVBc3NlcnRpb25FcnJvcikge1xuICAgICAgdGhyb3cgc2hhcGVBc3NlcnRpb25FcnJvcjtcbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgdmFyIHdhcm5pbmdNZXNzYWdlID0gZ2V0VW5leHBlY3RlZFN0YXRlU2hhcGVXYXJuaW5nTWVzc2FnZShzdGF0ZSwgZmluYWxSZWR1Y2VycywgYWN0aW9uLCB1bmV4cGVjdGVkS2V5Q2FjaGUpO1xuXG4gICAgICBpZiAod2FybmluZ01lc3NhZ2UpIHtcbiAgICAgICAgd2FybmluZyh3YXJuaW5nTWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGhhc0NoYW5nZWQgPSBmYWxzZTtcbiAgICB2YXIgbmV4dFN0YXRlID0ge307XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgZmluYWxSZWR1Y2VyS2V5cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfa2V5ID0gZmluYWxSZWR1Y2VyS2V5c1tfaV07XG4gICAgICB2YXIgcmVkdWNlciA9IGZpbmFsUmVkdWNlcnNbX2tleV07XG4gICAgICB2YXIgcHJldmlvdXNTdGF0ZUZvcktleSA9IHN0YXRlW19rZXldO1xuICAgICAgdmFyIG5leHRTdGF0ZUZvcktleSA9IHJlZHVjZXIocHJldmlvdXNTdGF0ZUZvcktleSwgYWN0aW9uKTtcblxuICAgICAgaWYgKHR5cGVvZiBuZXh0U3RhdGVGb3JLZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBhY3Rpb25UeXBlID0gYWN0aW9uICYmIGFjdGlvbi50eXBlO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gZm9ybWF0UHJvZEVycm9yTWVzc2FnZSgxNCkgOiBcIldoZW4gY2FsbGVkIHdpdGggYW4gYWN0aW9uIG9mIHR5cGUgXCIgKyAoYWN0aW9uVHlwZSA/IFwiXFxcIlwiICsgU3RyaW5nKGFjdGlvblR5cGUpICsgXCJcXFwiXCIgOiAnKHVua25vd24gdHlwZSknKSArIFwiLCB0aGUgc2xpY2UgcmVkdWNlciBmb3Iga2V5IFxcXCJcIiArIF9rZXkgKyBcIlxcXCIgcmV0dXJuZWQgdW5kZWZpbmVkLiBcIiArIFwiVG8gaWdub3JlIGFuIGFjdGlvbiwgeW91IG11c3QgZXhwbGljaXRseSByZXR1cm4gdGhlIHByZXZpb3VzIHN0YXRlLiBcIiArIFwiSWYgeW91IHdhbnQgdGhpcyByZWR1Y2VyIHRvIGhvbGQgbm8gdmFsdWUsIHlvdSBjYW4gcmV0dXJuIG51bGwgaW5zdGVhZCBvZiB1bmRlZmluZWQuXCIpO1xuICAgICAgfVxuXG4gICAgICBuZXh0U3RhdGVbX2tleV0gPSBuZXh0U3RhdGVGb3JLZXk7XG4gICAgICBoYXNDaGFuZ2VkID0gaGFzQ2hhbmdlZCB8fCBuZXh0U3RhdGVGb3JLZXkgIT09IHByZXZpb3VzU3RhdGVGb3JLZXk7XG4gICAgfVxuXG4gICAgaGFzQ2hhbmdlZCA9IGhhc0NoYW5nZWQgfHwgZmluYWxSZWR1Y2VyS2V5cy5sZW5ndGggIT09IE9iamVjdC5rZXlzKHN0YXRlKS5sZW5ndGg7XG4gICAgcmV0dXJuIGhhc0NoYW5nZWQgPyBuZXh0U3RhdGUgOiBzdGF0ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvciwgZGlzcGF0Y2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2goYWN0aW9uQ3JlYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cbi8qKlxuICogVHVybnMgYW4gb2JqZWN0IHdob3NlIHZhbHVlcyBhcmUgYWN0aW9uIGNyZWF0b3JzLCBpbnRvIGFuIG9iamVjdCB3aXRoIHRoZVxuICogc2FtZSBrZXlzLCBidXQgd2l0aCBldmVyeSBmdW5jdGlvbiB3cmFwcGVkIGludG8gYSBgZGlzcGF0Y2hgIGNhbGwgc28gdGhleVxuICogbWF5IGJlIGludm9rZWQgZGlyZWN0bHkuIFRoaXMgaXMganVzdCBhIGNvbnZlbmllbmNlIG1ldGhvZCwgYXMgeW91IGNhbiBjYWxsXG4gKiBgc3RvcmUuZGlzcGF0Y2goTXlBY3Rpb25DcmVhdG9ycy5kb1NvbWV0aGluZygpKWAgeW91cnNlbGYganVzdCBmaW5lLlxuICpcbiAqIEZvciBjb252ZW5pZW5jZSwgeW91IGNhbiBhbHNvIHBhc3MgYW4gYWN0aW9uIGNyZWF0b3IgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LFxuICogYW5kIGdldCBhIGRpc3BhdGNoIHdyYXBwZWQgZnVuY3Rpb24gaW4gcmV0dXJuLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBhY3Rpb25DcmVhdG9ycyBBbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSBhY3Rpb25cbiAqIGNyZWF0b3IgZnVuY3Rpb25zLiBPbmUgaGFuZHkgd2F5IHRvIG9idGFpbiBpdCBpcyB0byB1c2UgRVM2IGBpbXBvcnQgKiBhc2BcbiAqIHN5bnRheC4gWW91IG1heSBhbHNvIHBhc3MgYSBzaW5nbGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZGlzcGF0Y2ggVGhlIGBkaXNwYXRjaGAgZnVuY3Rpb24gYXZhaWxhYmxlIG9uIHlvdXIgUmVkdXhcbiAqIHN0b3JlLlxuICpcbiAqIEByZXR1cm5zIHtGdW5jdGlvbnxPYmplY3R9IFRoZSBvYmplY3QgbWltaWNraW5nIHRoZSBvcmlnaW5hbCBvYmplY3QsIGJ1dCB3aXRoXG4gKiBldmVyeSBhY3Rpb24gY3JlYXRvciB3cmFwcGVkIGludG8gdGhlIGBkaXNwYXRjaGAgY2FsbC4gSWYgeW91IHBhc3NlZCBhXG4gKiBmdW5jdGlvbiBhcyBgYWN0aW9uQ3JlYXRvcnNgLCB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYWxzbyBiZSBhIHNpbmdsZVxuICogZnVuY3Rpb24uXG4gKi9cblxuXG5mdW5jdGlvbiBiaW5kQWN0aW9uQ3JlYXRvcnMoYWN0aW9uQ3JlYXRvcnMsIGRpc3BhdGNoKSB7XG4gIGlmICh0eXBlb2YgYWN0aW9uQ3JlYXRvcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gYmluZEFjdGlvbkNyZWF0b3IoYWN0aW9uQ3JlYXRvcnMsIGRpc3BhdGNoKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYWN0aW9uQ3JlYXRvcnMgIT09ICdvYmplY3QnIHx8IGFjdGlvbkNyZWF0b3JzID09PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGZvcm1hdFByb2RFcnJvck1lc3NhZ2UoMTYpIDogXCJiaW5kQWN0aW9uQ3JlYXRvcnMgZXhwZWN0ZWQgYW4gb2JqZWN0IG9yIGEgZnVuY3Rpb24sIGJ1dCBpbnN0ZWFkIHJlY2VpdmVkOiAnXCIgKyBraW5kT2YoYWN0aW9uQ3JlYXRvcnMpICsgXCInLiBcIiArIFwiRGlkIHlvdSB3cml0ZSBcXFwiaW1wb3J0IEFjdGlvbkNyZWF0b3JzIGZyb21cXFwiIGluc3RlYWQgb2YgXFxcImltcG9ydCAqIGFzIEFjdGlvbkNyZWF0b3JzIGZyb21cXFwiP1wiKTtcbiAgfVxuXG4gIHZhciBib3VuZEFjdGlvbkNyZWF0b3JzID0ge307XG5cbiAgZm9yICh2YXIga2V5IGluIGFjdGlvbkNyZWF0b3JzKSB7XG4gICAgdmFyIGFjdGlvbkNyZWF0b3IgPSBhY3Rpb25DcmVhdG9yc1trZXldO1xuXG4gICAgaWYgKHR5cGVvZiBhY3Rpb25DcmVhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBib3VuZEFjdGlvbkNyZWF0b3JzW2tleV0gPSBiaW5kQWN0aW9uQ3JlYXRvcihhY3Rpb25DcmVhdG9yLCBkaXNwYXRjaCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJvdW5kQWN0aW9uQ3JlYXRvcnM7XG59XG5cbi8qKlxuICogQ29tcG9zZXMgc2luZ2xlLWFyZ3VtZW50IGZ1bmN0aW9ucyBmcm9tIHJpZ2h0IHRvIGxlZnQuIFRoZSByaWdodG1vc3RcbiAqIGZ1bmN0aW9uIGNhbiB0YWtlIG11bHRpcGxlIGFyZ3VtZW50cyBhcyBpdCBwcm92aWRlcyB0aGUgc2lnbmF0dXJlIGZvclxuICogdGhlIHJlc3VsdGluZyBjb21wb3NpdGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3MgVGhlIGZ1bmN0aW9ucyB0byBjb21wb3NlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIG9idGFpbmVkIGJ5IGNvbXBvc2luZyB0aGUgYXJndW1lbnQgZnVuY3Rpb25zXG4gKiBmcm9tIHJpZ2h0IHRvIGxlZnQuIEZvciBleGFtcGxlLCBjb21wb3NlKGYsIGcsIGgpIGlzIGlkZW50aWNhbCB0byBkb2luZ1xuICogKC4uLmFyZ3MpID0+IGYoZyhoKC4uLmFyZ3MpKSkuXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmdW5jcyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBmdW5jc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIGlmIChmdW5jcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFyZykge1xuICAgICAgcmV0dXJuIGFyZztcbiAgICB9O1xuICB9XG5cbiAgaWYgKGZ1bmNzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBmdW5jc1swXTtcbiAgfVxuXG4gIHJldHVybiBmdW5jcy5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGEoYi5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBzdG9yZSBlbmhhbmNlciB0aGF0IGFwcGxpZXMgbWlkZGxld2FyZSB0byB0aGUgZGlzcGF0Y2ggbWV0aG9kXG4gKiBvZiB0aGUgUmVkdXggc3RvcmUuIFRoaXMgaXMgaGFuZHkgZm9yIGEgdmFyaWV0eSBvZiB0YXNrcywgc3VjaCBhcyBleHByZXNzaW5nXG4gKiBhc3luY2hyb25vdXMgYWN0aW9ucyBpbiBhIGNvbmNpc2UgbWFubmVyLCBvciBsb2dnaW5nIGV2ZXJ5IGFjdGlvbiBwYXlsb2FkLlxuICpcbiAqIFNlZSBgcmVkdXgtdGh1bmtgIHBhY2thZ2UgYXMgYW4gZXhhbXBsZSBvZiB0aGUgUmVkdXggbWlkZGxld2FyZS5cbiAqXG4gKiBCZWNhdXNlIG1pZGRsZXdhcmUgaXMgcG90ZW50aWFsbHkgYXN5bmNocm9ub3VzLCB0aGlzIHNob3VsZCBiZSB0aGUgZmlyc3RcbiAqIHN0b3JlIGVuaGFuY2VyIGluIHRoZSBjb21wb3NpdGlvbiBjaGFpbi5cbiAqXG4gKiBOb3RlIHRoYXQgZWFjaCBtaWRkbGV3YXJlIHdpbGwgYmUgZ2l2ZW4gdGhlIGBkaXNwYXRjaGAgYW5kIGBnZXRTdGF0ZWAgZnVuY3Rpb25zXG4gKiBhcyBuYW1lZCBhcmd1bWVudHMuXG4gKlxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gbWlkZGxld2FyZXMgVGhlIG1pZGRsZXdhcmUgY2hhaW4gdG8gYmUgYXBwbGllZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBzdG9yZSBlbmhhbmNlciBhcHBseWluZyB0aGUgbWlkZGxld2FyZS5cbiAqL1xuXG5mdW5jdGlvbiBhcHBseU1pZGRsZXdhcmUoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBtaWRkbGV3YXJlcyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBtaWRkbGV3YXJlc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoY3JlYXRlU3RvcmUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0b3JlID0gY3JlYXRlU3RvcmUuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuXG4gICAgICB2YXIgX2Rpc3BhdGNoID0gZnVuY3Rpb24gZGlzcGF0Y2goKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBmb3JtYXRQcm9kRXJyb3JNZXNzYWdlKDE1KSA6ICdEaXNwYXRjaGluZyB3aGlsZSBjb25zdHJ1Y3RpbmcgeW91ciBtaWRkbGV3YXJlIGlzIG5vdCBhbGxvd2VkLiAnICsgJ090aGVyIG1pZGRsZXdhcmUgd291bGQgbm90IGJlIGFwcGxpZWQgdG8gdGhpcyBkaXNwYXRjaC4nKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBtaWRkbGV3YXJlQVBJID0ge1xuICAgICAgICBnZXRTdGF0ZTogc3RvcmUuZ2V0U3RhdGUsXG4gICAgICAgIGRpc3BhdGNoOiBmdW5jdGlvbiBkaXNwYXRjaCgpIHtcbiAgICAgICAgICByZXR1cm4gX2Rpc3BhdGNoLmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBjaGFpbiA9IG1pZGRsZXdhcmVzLm1hcChmdW5jdGlvbiAobWlkZGxld2FyZSkge1xuICAgICAgICByZXR1cm4gbWlkZGxld2FyZShtaWRkbGV3YXJlQVBJKTtcbiAgICAgIH0pO1xuICAgICAgX2Rpc3BhdGNoID0gY29tcG9zZS5hcHBseSh2b2lkIDAsIGNoYWluKShzdG9yZS5kaXNwYXRjaCk7XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdG9yZSksIHt9LCB7XG4gICAgICAgIGRpc3BhdGNoOiBfZGlzcGF0Y2hcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG59XG5cbi8qXG4gKiBUaGlzIGlzIGEgZHVtbXkgZnVuY3Rpb24gdG8gY2hlY2sgaWYgdGhlIGZ1bmN0aW9uIG5hbWUgaGFzIGJlZW4gYWx0ZXJlZCBieSBtaW5pZmljYXRpb24uXG4gKiBJZiB0aGUgZnVuY3Rpb24gaGFzIGJlZW4gbWluaWZpZWQgYW5kIE5PREVfRU5WICE9PSAncHJvZHVjdGlvbicsIHdhcm4gdGhlIHVzZXIuXG4gKi9cblxuZnVuY3Rpb24gaXNDcnVzaGVkKCkge31cblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgdHlwZW9mIGlzQ3J1c2hlZC5uYW1lID09PSAnc3RyaW5nJyAmJiBpc0NydXNoZWQubmFtZSAhPT0gJ2lzQ3J1c2hlZCcpIHtcbiAgd2FybmluZygnWW91IGFyZSBjdXJyZW50bHkgdXNpbmcgbWluaWZpZWQgY29kZSBvdXRzaWRlIG9mIE5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIi4gJyArICdUaGlzIG1lYW5zIHRoYXQgeW91IGFyZSBydW5uaW5nIGEgc2xvd2VyIGRldmVsb3BtZW50IGJ1aWxkIG9mIFJlZHV4LiAnICsgJ1lvdSBjYW4gdXNlIGxvb3NlLWVudmlmeSAoaHR0cHM6Ly9naXRodWIuY29tL3plcnRvc2gvbG9vc2UtZW52aWZ5KSBmb3IgYnJvd3NlcmlmeSAnICsgJ29yIHNldHRpbmcgbW9kZSB0byBwcm9kdWN0aW9uIGluIHdlYnBhY2sgKGh0dHBzOi8vd2VicGFjay5qcy5vcmcvY29uY2VwdHMvbW9kZS8pICcgKyAndG8gZW5zdXJlIHlvdSBoYXZlIHRoZSBjb3JyZWN0IGNvZGUgZm9yIHlvdXIgcHJvZHVjdGlvbiBidWlsZC4nKTtcbn1cblxuZXhwb3J0IHsgQWN0aW9uVHlwZXMgYXMgX19ET19OT1RfVVNFX19BY3Rpb25UeXBlcywgYXBwbHlNaWRkbGV3YXJlLCBiaW5kQWN0aW9uQ3JlYXRvcnMsIGNvbWJpbmVSZWR1Y2VycywgY29tcG9zZSwgY3JlYXRlU3RvcmUgfTtcbiIsImV4cG9ydCB2YXIgc3RyaWN0RXF1YWxpdHkgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbGl0eShhLCBiKSB7XG4gIHJldHVybiBhID09PSBiO1xufTtcbi8qKlxuICogRGV0ZXJtaW5lIGlmIHR3byBjYXJ0ZXNpYW4gY29vcmRpbmF0ZSBvZmZzZXRzIGFyZSBlcXVhbFxuICogQHBhcmFtIG9mZnNldEFcbiAqIEBwYXJhbSBvZmZzZXRCXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGFyZUNvb3Jkc0VxdWFsKG9mZnNldEEsIG9mZnNldEIpIHtcbiAgaWYgKCFvZmZzZXRBICYmICFvZmZzZXRCKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoIW9mZnNldEEgfHwgIW9mZnNldEIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG9mZnNldEEueCA9PT0gb2Zmc2V0Qi54ICYmIG9mZnNldEEueSA9PT0gb2Zmc2V0Qi55O1xuICB9XG59XG4vKipcbiAqIERldGVybWluZXMgaWYgdHdvIGFycmF5cyBvZiBpdGVtcyBhcmUgZXF1YWxcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBhcnJheSBvZiBpdGVtc1xuICogQHBhcmFtIGIgVGhlIHNlY29uZCBhcnJheSBvZiBpdGVtc1xuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBhcmVBcnJheXNFcXVhbChhLCBiKSB7XG4gIHZhciBpc0VxdWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBzdHJpY3RFcXVhbGl0eTtcblxuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCFpc0VxdWFsKGFbaV0sIGJbaV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59IiwiZnVuY3Rpb24gb3duS2V5cyhvYmplY3QsIGVudW1lcmFibGVPbmx5KSB7IHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTsgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHsgdmFyIHN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCk7IGlmIChlbnVtZXJhYmxlT25seSkgeyBzeW1ib2xzID0gc3ltYm9scy5maWx0ZXIoZnVuY3Rpb24gKHN5bSkgeyByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHN5bSkuZW51bWVyYWJsZTsgfSk7IH0ga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHt9OyBpZiAoaSAlIDIpIHsgb3duS2V5cyhPYmplY3Qoc291cmNlKSwgdHJ1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KTsgfSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycykgeyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHNvdXJjZSkpOyB9IGVsc2UgeyBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5pbXBvcnQgeyBJTklUX0NPT1JEUywgQkVHSU5fRFJBRywgSE9WRVIsIEVORF9EUkFHLCBEUk9QIH0gZnJvbSAnLi4vYWN0aW9ucy9kcmFnRHJvcCc7XG5pbXBvcnQgeyBhcmVDb29yZHNFcXVhbCB9IGZyb20gJy4uL3V0aWxzL2VxdWFsaXR5JztcbnZhciBpbml0aWFsU3RhdGUgPSB7XG4gIGluaXRpYWxTb3VyY2VDbGllbnRPZmZzZXQ6IG51bGwsXG4gIGluaXRpYWxDbGllbnRPZmZzZXQ6IG51bGwsXG4gIGNsaWVudE9mZnNldDogbnVsbFxufTtcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2UoKSB7XG4gIHZhciBzdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogaW5pdGlhbFN0YXRlO1xuICB2YXIgYWN0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gIHZhciBwYXlsb2FkID0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgIGNhc2UgSU5JVF9DT09SRFM6XG4gICAgY2FzZSBCRUdJTl9EUkFHOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdGlhbFNvdXJjZUNsaWVudE9mZnNldDogcGF5bG9hZC5zb3VyY2VDbGllbnRPZmZzZXQsXG4gICAgICAgIGluaXRpYWxDbGllbnRPZmZzZXQ6IHBheWxvYWQuY2xpZW50T2Zmc2V0LFxuICAgICAgICBjbGllbnRPZmZzZXQ6IHBheWxvYWQuY2xpZW50T2Zmc2V0XG4gICAgICB9O1xuXG4gICAgY2FzZSBIT1ZFUjpcbiAgICAgIGlmIChhcmVDb29yZHNFcXVhbChzdGF0ZS5jbGllbnRPZmZzZXQsIHBheWxvYWQuY2xpZW50T2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHN0YXRlKSwge30sIHtcbiAgICAgICAgY2xpZW50T2Zmc2V0OiBwYXlsb2FkLmNsaWVudE9mZnNldFxuICAgICAgfSk7XG5cbiAgICBjYXNlIEVORF9EUkFHOlxuICAgIGNhc2UgRFJPUDpcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGU7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59IiwiZXhwb3J0IHZhciBBRERfU09VUkNFID0gJ2RuZC1jb3JlL0FERF9TT1VSQ0UnO1xuZXhwb3J0IHZhciBBRERfVEFSR0VUID0gJ2RuZC1jb3JlL0FERF9UQVJHRVQnO1xuZXhwb3J0IHZhciBSRU1PVkVfU09VUkNFID0gJ2RuZC1jb3JlL1JFTU9WRV9TT1VSQ0UnO1xuZXhwb3J0IHZhciBSRU1PVkVfVEFSR0VUID0gJ2RuZC1jb3JlL1JFTU9WRV9UQVJHRVQnO1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFNvdXJjZShzb3VyY2VJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFERF9TT1VSQ0UsXG4gICAgcGF5bG9hZDoge1xuICAgICAgc291cmNlSWQ6IHNvdXJjZUlkXG4gICAgfVxuICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRhcmdldCh0YXJnZXRJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFERF9UQVJHRVQsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdGFyZ2V0SWQ6IHRhcmdldElkXG4gICAgfVxuICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVNvdXJjZShzb3VyY2VJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFJFTU9WRV9TT1VSQ0UsXG4gICAgcGF5bG9hZDoge1xuICAgICAgc291cmNlSWQ6IHNvdXJjZUlkXG4gICAgfVxuICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVRhcmdldCh0YXJnZXRJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IFJFTU9WRV9UQVJHRVQsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdGFyZ2V0SWQ6IHRhcmdldElkXG4gICAgfVxuICB9O1xufSIsImZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBpZiAoZW51bWVyYWJsZU9ubHkpIHsgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pOyB9IGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTsgaWYgKGkgJSAyKSB7IG93bktleXMoT2JqZWN0KHNvdXJjZSksIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSk7IH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHsgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTsgfSBlbHNlIHsgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpOyB9KTsgfSB9IHJldHVybiB0YXJnZXQ7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuaW1wb3J0IHsgQkVHSU5fRFJBRywgUFVCTElTSF9EUkFHX1NPVVJDRSwgSE9WRVIsIEVORF9EUkFHLCBEUk9QIH0gZnJvbSAnLi4vYWN0aW9ucy9kcmFnRHJvcCc7XG5pbXBvcnQgeyBSRU1PVkVfVEFSR0VUIH0gZnJvbSAnLi4vYWN0aW9ucy9yZWdpc3RyeSc7XG5pbXBvcnQgeyB3aXRob3V0IH0gZnJvbSAnLi4vdXRpbHMvanNfdXRpbHMnO1xudmFyIGluaXRpYWxTdGF0ZSA9IHtcbiAgaXRlbVR5cGU6IG51bGwsXG4gIGl0ZW06IG51bGwsXG4gIHNvdXJjZUlkOiBudWxsLFxuICB0YXJnZXRJZHM6IFtdLFxuICBkcm9wUmVzdWx0OiBudWxsLFxuICBkaWREcm9wOiBmYWxzZSxcbiAgaXNTb3VyY2VQdWJsaWM6IG51bGxcbn07XG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlKCkge1xuICB2YXIgc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IGluaXRpYWxTdGF0ZTtcbiAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICB2YXIgcGF5bG9hZCA9IGFjdGlvbi5wYXlsb2FkO1xuXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIEJFR0lOX0RSQUc6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgICAgIGl0ZW1UeXBlOiBwYXlsb2FkLml0ZW1UeXBlLFxuICAgICAgICBpdGVtOiBwYXlsb2FkLml0ZW0sXG4gICAgICAgIHNvdXJjZUlkOiBwYXlsb2FkLnNvdXJjZUlkLFxuICAgICAgICBpc1NvdXJjZVB1YmxpYzogcGF5bG9hZC5pc1NvdXJjZVB1YmxpYyxcbiAgICAgICAgZHJvcFJlc3VsdDogbnVsbCxcbiAgICAgICAgZGlkRHJvcDogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgY2FzZSBQVUJMSVNIX0RSQUdfU09VUkNFOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgc3RhdGUpLCB7fSwge1xuICAgICAgICBpc1NvdXJjZVB1YmxpYzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICBjYXNlIEhPVkVSOlxuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgc3RhdGUpLCB7fSwge1xuICAgICAgICB0YXJnZXRJZHM6IHBheWxvYWQudGFyZ2V0SWRzXG4gICAgICB9KTtcblxuICAgIGNhc2UgUkVNT1ZFX1RBUkdFVDpcbiAgICAgIGlmIChzdGF0ZS50YXJnZXRJZHMuaW5kZXhPZihwYXlsb2FkLnRhcmdldElkKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgICAgIHRhcmdldElkczogd2l0aG91dChzdGF0ZS50YXJnZXRJZHMsIHBheWxvYWQudGFyZ2V0SWQpXG4gICAgICB9KTtcblxuICAgIGNhc2UgRFJPUDpcbiAgICAgIHJldHVybiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIHN0YXRlKSwge30sIHtcbiAgICAgICAgZHJvcFJlc3VsdDogcGF5bG9hZC5kcm9wUmVzdWx0LFxuICAgICAgICBkaWREcm9wOiB0cnVlLFxuICAgICAgICB0YXJnZXRJZHM6IFtdXG4gICAgICB9KTtcblxuICAgIGNhc2UgRU5EX0RSQUc6XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZChfb2JqZWN0U3ByZWFkKHt9LCBzdGF0ZSksIHt9LCB7XG4gICAgICAgIGl0ZW1UeXBlOiBudWxsLFxuICAgICAgICBpdGVtOiBudWxsLFxuICAgICAgICBzb3VyY2VJZDogbnVsbCxcbiAgICAgICAgZHJvcFJlc3VsdDogbnVsbCxcbiAgICAgICAgZGlkRHJvcDogZmFsc2UsXG4gICAgICAgIGlzU291cmNlUHVibGljOiBudWxsLFxuICAgICAgICB0YXJnZXRJZHM6IFtdXG4gICAgICB9KTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn0iLCJpbXBvcnQgeyBBRERfU09VUkNFLCBBRERfVEFSR0VULCBSRU1PVkVfU09VUkNFLCBSRU1PVkVfVEFSR0VUIH0gZnJvbSAnLi4vYWN0aW9ucy9yZWdpc3RyeSc7XG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlKCkge1xuICB2YXIgc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IDA7XG4gIHZhciBhY3Rpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcblxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBBRERfU09VUkNFOlxuICAgIGNhc2UgQUREX1RBUkdFVDpcbiAgICAgIHJldHVybiBzdGF0ZSArIDE7XG5cbiAgICBjYXNlIFJFTU9WRV9TT1VSQ0U6XG4gICAgY2FzZSBSRU1PVkVfVEFSR0VUOlxuICAgICAgcmV0dXJuIHN0YXRlIC0gMTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn0iLCJpbXBvcnQgeyBpbnRlcnNlY3Rpb24gfSBmcm9tICcuL2pzX3V0aWxzJztcbmV4cG9ydCB2YXIgTk9ORSA9IFtdO1xuZXhwb3J0IHZhciBBTEwgPSBbXTtcbk5PTkUuX19JU19OT05FX18gPSB0cnVlO1xuQUxMLl9fSVNfQUxMX18gPSB0cnVlO1xuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBnaXZlbiBoYW5kbGVyIElEcyBhcmUgZGlydHkgb3Igbm90LlxuICpcbiAqIEBwYXJhbSBkaXJ0eUlkcyBUaGUgc2V0IG9mIGRpcnR5IGhhbmRsZXIgaWRzXG4gKiBAcGFyYW0gaGFuZGxlcklkcyBUaGUgc2V0IG9mIGhhbmRsZXIgaWRzIHRvIGNoZWNrXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGFyZURpcnR5KGRpcnR5SWRzLCBoYW5kbGVySWRzKSB7XG4gIGlmIChkaXJ0eUlkcyA9PT0gTk9ORSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChkaXJ0eUlkcyA9PT0gQUxMIHx8IHR5cGVvZiBoYW5kbGVySWRzID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGNvbW1vbklkcyA9IGludGVyc2VjdGlvbihoYW5kbGVySWRzLCBkaXJ0eUlkcyk7XG4gIHJldHVybiBjb21tb25JZHMubGVuZ3RoID4gMDtcbn0iLCJpbXBvcnQgeyBCRUdJTl9EUkFHLCBQVUJMSVNIX0RSQUdfU09VUkNFLCBIT1ZFUiwgRU5EX0RSQUcsIERST1AgfSBmcm9tICcuLi9hY3Rpb25zL2RyYWdEcm9wJztcbmltcG9ydCB7IEFERF9TT1VSQ0UsIEFERF9UQVJHRVQsIFJFTU9WRV9TT1VSQ0UsIFJFTU9WRV9UQVJHRVQgfSBmcm9tICcuLi9hY3Rpb25zL3JlZ2lzdHJ5JztcbmltcG9ydCB7IGFyZUFycmF5c0VxdWFsIH0gZnJvbSAnLi4vdXRpbHMvZXF1YWxpdHknO1xuaW1wb3J0IHsgTk9ORSwgQUxMIH0gZnJvbSAnLi4vdXRpbHMvZGlydGluZXNzJztcbmltcG9ydCB7IHhvciB9IGZyb20gJy4uL3V0aWxzL2pzX3V0aWxzJztcbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2UoKSB7XG4gIHZhciBfc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IE5PTkU7XG5cbiAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIEhPVkVSOlxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIEFERF9TT1VSQ0U6XG4gICAgY2FzZSBBRERfVEFSR0VUOlxuICAgIGNhc2UgUkVNT1ZFX1RBUkdFVDpcbiAgICBjYXNlIFJFTU9WRV9TT1VSQ0U6XG4gICAgICByZXR1cm4gTk9ORTtcblxuICAgIGNhc2UgQkVHSU5fRFJBRzpcbiAgICBjYXNlIFBVQkxJU0hfRFJBR19TT1VSQ0U6XG4gICAgY2FzZSBFTkRfRFJBRzpcbiAgICBjYXNlIERST1A6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBBTEw7XG4gIH1cblxuICB2YXIgX2FjdGlvbiRwYXlsb2FkID0gYWN0aW9uLnBheWxvYWQsXG4gICAgICBfYWN0aW9uJHBheWxvYWQkdGFyZ2UgPSBfYWN0aW9uJHBheWxvYWQudGFyZ2V0SWRzLFxuICAgICAgdGFyZ2V0SWRzID0gX2FjdGlvbiRwYXlsb2FkJHRhcmdlID09PSB2b2lkIDAgPyBbXSA6IF9hY3Rpb24kcGF5bG9hZCR0YXJnZSxcbiAgICAgIF9hY3Rpb24kcGF5bG9hZCRwcmV2VCA9IF9hY3Rpb24kcGF5bG9hZC5wcmV2VGFyZ2V0SWRzLFxuICAgICAgcHJldlRhcmdldElkcyA9IF9hY3Rpb24kcGF5bG9hZCRwcmV2VCA9PT0gdm9pZCAwID8gW10gOiBfYWN0aW9uJHBheWxvYWQkcHJldlQ7XG4gIHZhciByZXN1bHQgPSB4b3IodGFyZ2V0SWRzLCBwcmV2VGFyZ2V0SWRzKTtcbiAgdmFyIGRpZENoYW5nZSA9IHJlc3VsdC5sZW5ndGggPiAwIHx8ICFhcmVBcnJheXNFcXVhbCh0YXJnZXRJZHMsIHByZXZUYXJnZXRJZHMpO1xuXG4gIGlmICghZGlkQ2hhbmdlKSB7XG4gICAgcmV0dXJuIE5PTkU7XG4gIH0gLy8gQ2hlY2sgdGhlIHRhcmdldCBpZHMgYXQgdGhlIGlubmVybW9zdCBwb3NpdGlvbi4gSWYgdGhleSBhcmUgdmFsaWQsIGFkZCB0aGVtXG4gIC8vIHRvIHRoZSByZXN1bHRcblxuXG4gIHZhciBwcmV2SW5uZXJtb3N0VGFyZ2V0SWQgPSBwcmV2VGFyZ2V0SWRzW3ByZXZUYXJnZXRJZHMubGVuZ3RoIC0gMV07XG4gIHZhciBpbm5lcm1vc3RUYXJnZXRJZCA9IHRhcmdldElkc1t0YXJnZXRJZHMubGVuZ3RoIC0gMV07XG5cbiAgaWYgKHByZXZJbm5lcm1vc3RUYXJnZXRJZCAhPT0gaW5uZXJtb3N0VGFyZ2V0SWQpIHtcbiAgICBpZiAocHJldklubmVybW9zdFRhcmdldElkKSB7XG4gICAgICByZXN1bHQucHVzaChwcmV2SW5uZXJtb3N0VGFyZ2V0SWQpO1xuICAgIH1cblxuICAgIGlmIChpbm5lcm1vc3RUYXJnZXRJZCkge1xuICAgICAgcmVzdWx0LnB1c2goaW5uZXJtb3N0VGFyZ2V0SWQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59IiwiZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZSgpIHtcbiAgdmFyIHN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiAwO1xuICByZXR1cm4gc3RhdGUgKyAxO1xufSIsImZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBpZiAoZW51bWVyYWJsZU9ubHkpIHsgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pOyB9IGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTsgaWYgKGkgJSAyKSB7IG93bktleXMoT2JqZWN0KHNvdXJjZSksIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSk7IH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHsgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTsgfSBlbHNlIHsgb3duS2V5cyhPYmplY3Qoc291cmNlKSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpOyB9KTsgfSB9IHJldHVybiB0YXJnZXQ7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuaW1wb3J0IHsgcmVkdWNlIGFzIGRyYWdPZmZzZXQgfSBmcm9tICcuL2RyYWdPZmZzZXQnO1xuaW1wb3J0IHsgcmVkdWNlIGFzIGRyYWdPcGVyYXRpb24gfSBmcm9tICcuL2RyYWdPcGVyYXRpb24nO1xuaW1wb3J0IHsgcmVkdWNlIGFzIHJlZkNvdW50IH0gZnJvbSAnLi9yZWZDb3VudCc7XG5pbXBvcnQgeyByZWR1Y2UgYXMgZGlydHlIYW5kbGVySWRzIH0gZnJvbSAnLi9kaXJ0eUhhbmRsZXJJZHMnO1xuaW1wb3J0IHsgcmVkdWNlIGFzIHN0YXRlSWQgfSBmcm9tICcuL3N0YXRlSWQnO1xuaW1wb3J0IHsgZ2V0IH0gZnJvbSAnLi4vdXRpbHMvanNfdXRpbHMnO1xuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZSgpIHtcbiAgdmFyIHN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICByZXR1cm4ge1xuICAgIGRpcnR5SGFuZGxlcklkczogZGlydHlIYW5kbGVySWRzKHN0YXRlLmRpcnR5SGFuZGxlcklkcywge1xuICAgICAgdHlwZTogYWN0aW9uLnR5cGUsXG4gICAgICBwYXlsb2FkOiBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIGFjdGlvbi5wYXlsb2FkKSwge30sIHtcbiAgICAgICAgcHJldlRhcmdldElkczogZ2V0KHN0YXRlLCAnZHJhZ09wZXJhdGlvbi50YXJnZXRJZHMnLCBbXSlcbiAgICAgIH0pXG4gICAgfSksXG4gICAgZHJhZ09mZnNldDogZHJhZ09mZnNldChzdGF0ZS5kcmFnT2Zmc2V0LCBhY3Rpb24pLFxuICAgIHJlZkNvdW50OiByZWZDb3VudChzdGF0ZS5yZWZDb3VudCwgYWN0aW9uKSxcbiAgICBkcmFnT3BlcmF0aW9uOiBkcmFnT3BlcmF0aW9uKHN0YXRlLmRyYWdPcGVyYXRpb24sIGFjdGlvbiksXG4gICAgc3RhdGVJZDogc3RhdGVJZChzdGF0ZS5zdGF0ZUlkKVxuICB9O1xufSIsIi8qKlxuICogQ29vcmRpbmF0ZSBhZGRpdGlvblxuICogQHBhcmFtIGEgVGhlIGZpcnN0IGNvb3JkaW5hdGVcbiAqIEBwYXJhbSBiIFRoZSBzZWNvbmQgY29vcmRpbmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkKGEsIGIpIHtcbiAgcmV0dXJuIHtcbiAgICB4OiBhLnggKyBiLngsXG4gICAgeTogYS55ICsgYi55XG4gIH07XG59XG4vKipcbiAqIENvb3JkaW5hdGUgc3VidHJhY3Rpb25cbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBjb29yZGluYXRlXG4gKiBAcGFyYW0gYiBUaGUgc2Vjb25kIGNvb3JkaW5hdGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gc3VidHJhY3QoYSwgYikge1xuICByZXR1cm4ge1xuICAgIHg6IGEueCAtIGIueCxcbiAgICB5OiBhLnkgLSBiLnlcbiAgfTtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgY2FydGVzaWFuIGRpc3RhbmNlIG9mIHRoZSBkcmFnIHNvdXJjZSBjb21wb25lbnQncyBwb3NpdGlvbiwgYmFzZWQgb24gaXRzIHBvc2l0aW9uXG4gKiBhdCB0aGUgdGltZSB3aGVuIHRoZSBjdXJyZW50IGRyYWcgb3BlcmF0aW9uIGhhcyBzdGFydGVkLCBhbmQgdGhlIG1vdmVtZW50IGRpZmZlcmVuY2UuXG4gKlxuICogUmV0dXJucyBudWxsIGlmIG5vIGl0ZW0gaXMgYmVpbmcgZHJhZ2dlZC5cbiAqXG4gKiBAcGFyYW0gc3RhdGUgVGhlIG9mZnNldCBzdGF0ZSB0byBjb21wdXRlIGZyb21cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U291cmNlQ2xpZW50T2Zmc2V0KHN0YXRlKSB7XG4gIHZhciBjbGllbnRPZmZzZXQgPSBzdGF0ZS5jbGllbnRPZmZzZXQsXG4gICAgICBpbml0aWFsQ2xpZW50T2Zmc2V0ID0gc3RhdGUuaW5pdGlhbENsaWVudE9mZnNldCxcbiAgICAgIGluaXRpYWxTb3VyY2VDbGllbnRPZmZzZXQgPSBzdGF0ZS5pbml0aWFsU291cmNlQ2xpZW50T2Zmc2V0O1xuXG4gIGlmICghY2xpZW50T2Zmc2V0IHx8ICFpbml0aWFsQ2xpZW50T2Zmc2V0IHx8ICFpbml0aWFsU291cmNlQ2xpZW50T2Zmc2V0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gc3VidHJhY3QoYWRkKGNsaWVudE9mZnNldCwgaW5pdGlhbFNvdXJjZUNsaWVudE9mZnNldCksIGluaXRpYWxDbGllbnRPZmZzZXQpO1xufVxuLyoqXG4gKiBEZXRlcm1pbmVzIHRoZSB4LHkgb2Zmc2V0IGJldHdlZW4gdGhlIGNsaWVudCBvZmZzZXQgYW5kIHRoZSBpbml0aWFsIGNsaWVudCBvZmZzZXRcbiAqXG4gKiBAcGFyYW0gc3RhdGUgVGhlIG9mZnNldCBzdGF0ZSB0byBjb21wdXRlIGZyb21cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGlmZmVyZW5jZUZyb21Jbml0aWFsT2Zmc2V0KHN0YXRlKSB7XG4gIHZhciBjbGllbnRPZmZzZXQgPSBzdGF0ZS5jbGllbnRPZmZzZXQsXG4gICAgICBpbml0aWFsQ2xpZW50T2Zmc2V0ID0gc3RhdGUuaW5pdGlhbENsaWVudE9mZnNldDtcblxuICBpZiAoIWNsaWVudE9mZnNldCB8fCAhaW5pdGlhbENsaWVudE9mZnNldCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHN1YnRyYWN0KGNsaWVudE9mZnNldCwgaW5pdGlhbENsaWVudE9mZnNldCk7XG59IiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5pbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICdAcmVhY3QtZG5kL2ludmFyaWFudCc7XG5pbXBvcnQgeyBtYXRjaGVzVHlwZSB9IGZyb20gJy4uL3V0aWxzL21hdGNoZXNUeXBlJztcbmltcG9ydCB7IGdldFNvdXJjZUNsaWVudE9mZnNldCBhcyBfZ2V0U291cmNlQ2xpZW50T2Zmc2V0LCBnZXREaWZmZXJlbmNlRnJvbUluaXRpYWxPZmZzZXQgYXMgX2dldERpZmZlcmVuY2VGcm9tSW5pdGlhbE9mZnNldCB9IGZyb20gJy4uL3V0aWxzL2Nvb3Jkcyc7XG5pbXBvcnQgeyBhcmVEaXJ0eSB9IGZyb20gJy4uL3V0aWxzL2RpcnRpbmVzcyc7XG5leHBvcnQgdmFyIERyYWdEcm9wTW9uaXRvckltcGwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEcmFnRHJvcE1vbml0b3JJbXBsKHN0b3JlLCByZWdpc3RyeSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEcmFnRHJvcE1vbml0b3JJbXBsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInN0b3JlXCIsIHZvaWQgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJyZWdpc3RyeVwiLCB2b2lkIDApO1xuXG4gICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgIHRoaXMucmVnaXN0cnkgPSByZWdpc3RyeTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhEcmFnRHJvcE1vbml0b3JJbXBsLCBbe1xuICAgIGtleTogXCJzdWJzY3JpYmVUb1N0YXRlQ2hhbmdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN1YnNjcmliZVRvU3RhdGVDaGFuZ2UobGlzdGVuZXIpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7XG4gICAgICAgIGhhbmRsZXJJZHM6IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICAgIHZhciBoYW5kbGVySWRzID0gb3B0aW9ucy5oYW5kbGVySWRzO1xuICAgICAgaW52YXJpYW50KHR5cGVvZiBsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJywgJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcbiAgICAgIGludmFyaWFudCh0eXBlb2YgaGFuZGxlcklkcyA9PT0gJ3VuZGVmaW5lZCcgfHwgQXJyYXkuaXNBcnJheShoYW5kbGVySWRzKSwgJ2hhbmRsZXJJZHMsIHdoZW4gc3BlY2lmaWVkLCBtdXN0IGJlIGFuIGFycmF5IG9mIHN0cmluZ3MuJyk7XG4gICAgICB2YXIgcHJldlN0YXRlSWQgPSB0aGlzLnN0b3JlLmdldFN0YXRlKCkuc3RhdGVJZDtcblxuICAgICAgdmFyIGhhbmRsZUNoYW5nZSA9IGZ1bmN0aW9uIGhhbmRsZUNoYW5nZSgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gX3RoaXMuc3RvcmUuZ2V0U3RhdGUoKTtcblxuICAgICAgICB2YXIgY3VycmVudFN0YXRlSWQgPSBzdGF0ZS5zdGF0ZUlkO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGNhblNraXBMaXN0ZW5lciA9IGN1cnJlbnRTdGF0ZUlkID09PSBwcmV2U3RhdGVJZCB8fCBjdXJyZW50U3RhdGVJZCA9PT0gcHJldlN0YXRlSWQgKyAxICYmICFhcmVEaXJ0eShzdGF0ZS5kaXJ0eUhhbmRsZXJJZHMsIGhhbmRsZXJJZHMpO1xuXG4gICAgICAgICAgaWYgKCFjYW5Ta2lwTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHByZXZTdGF0ZUlkID0gY3VycmVudFN0YXRlSWQ7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLnN1YnNjcmliZShoYW5kbGVDaGFuZ2UpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdWJzY3JpYmVUb09mZnNldENoYW5nZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdWJzY3JpYmVUb09mZnNldENoYW5nZShsaXN0ZW5lcikge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIGludmFyaWFudCh0eXBlb2YgbGlzdGVuZXIgPT09ICdmdW5jdGlvbicsICdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gICAgICB2YXIgcHJldmlvdXNTdGF0ZSA9IHRoaXMuc3RvcmUuZ2V0U3RhdGUoKS5kcmFnT2Zmc2V0O1xuXG4gICAgICB2YXIgaGFuZGxlQ2hhbmdlID0gZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKCkge1xuICAgICAgICB2YXIgbmV4dFN0YXRlID0gX3RoaXMyLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09mZnNldDtcblxuICAgICAgICBpZiAobmV4dFN0YXRlID09PSBwcmV2aW91c1N0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJldmlvdXNTdGF0ZSA9IG5leHRTdGF0ZTtcbiAgICAgICAgbGlzdGVuZXIoKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLnN1YnNjcmliZShoYW5kbGVDaGFuZ2UpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjYW5EcmFnU291cmNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhbkRyYWdTb3VyY2Uoc291cmNlSWQpIHtcbiAgICAgIGlmICghc291cmNlSWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlID0gdGhpcy5yZWdpc3RyeS5nZXRTb3VyY2Uoc291cmNlSWQpO1xuICAgICAgaW52YXJpYW50KHNvdXJjZSwgXCJFeHBlY3RlZCB0byBmaW5kIGEgdmFsaWQgc291cmNlLiBzb3VyY2VJZD1cIi5jb25jYXQoc291cmNlSWQpKTtcblxuICAgICAgaWYgKHRoaXMuaXNEcmFnZ2luZygpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNvdXJjZS5jYW5EcmFnKHRoaXMsIHNvdXJjZUlkKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2FuRHJvcE9uVGFyZ2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhbkRyb3BPblRhcmdldCh0YXJnZXRJZCkge1xuICAgICAgLy8gdW5kZWZpbmVkIG9uIGluaXRpYWwgcmVuZGVyXG4gICAgICBpZiAoIXRhcmdldElkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRhcmdldCA9IHRoaXMucmVnaXN0cnkuZ2V0VGFyZ2V0KHRhcmdldElkKTtcbiAgICAgIGludmFyaWFudCh0YXJnZXQsIFwiRXhwZWN0ZWQgdG8gZmluZCBhIHZhbGlkIHRhcmdldC4gdGFyZ2V0SWQ9XCIuY29uY2F0KHRhcmdldElkKSk7XG5cbiAgICAgIGlmICghdGhpcy5pc0RyYWdnaW5nKCkgfHwgdGhpcy5kaWREcm9wKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGFyZ2V0VHlwZSA9IHRoaXMucmVnaXN0cnkuZ2V0VGFyZ2V0VHlwZSh0YXJnZXRJZCk7XG4gICAgICB2YXIgZHJhZ2dlZEl0ZW1UeXBlID0gdGhpcy5nZXRJdGVtVHlwZSgpO1xuICAgICAgcmV0dXJuIG1hdGNoZXNUeXBlKHRhcmdldFR5cGUsIGRyYWdnZWRJdGVtVHlwZSkgJiYgdGFyZ2V0LmNhbkRyb3AodGhpcywgdGFyZ2V0SWQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc0RyYWdnaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzRHJhZ2dpbmcoKSB7XG4gICAgICByZXR1cm4gQm9vbGVhbih0aGlzLmdldEl0ZW1UeXBlKCkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc0RyYWdnaW5nU291cmNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzRHJhZ2dpbmdTb3VyY2Uoc291cmNlSWQpIHtcbiAgICAgIC8vIHVuZGVmaW5lZCBvbiBpbml0aWFsIHJlbmRlclxuICAgICAgaWYgKCFzb3VyY2VJZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBzb3VyY2UgPSB0aGlzLnJlZ2lzdHJ5LmdldFNvdXJjZShzb3VyY2VJZCwgdHJ1ZSk7XG4gICAgICBpbnZhcmlhbnQoc291cmNlLCBcIkV4cGVjdGVkIHRvIGZpbmQgYSB2YWxpZCBzb3VyY2UuIHNvdXJjZUlkPVwiLmNvbmNhdChzb3VyY2VJZCkpO1xuXG4gICAgICBpZiAoIXRoaXMuaXNEcmFnZ2luZygpIHx8ICF0aGlzLmlzU291cmNlUHVibGljKCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc291cmNlVHlwZSA9IHRoaXMucmVnaXN0cnkuZ2V0U291cmNlVHlwZShzb3VyY2VJZCk7XG4gICAgICB2YXIgZHJhZ2dlZEl0ZW1UeXBlID0gdGhpcy5nZXRJdGVtVHlwZSgpO1xuXG4gICAgICBpZiAoc291cmNlVHlwZSAhPT0gZHJhZ2dlZEl0ZW1UeXBlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNvdXJjZS5pc0RyYWdnaW5nKHRoaXMsIHNvdXJjZUlkKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaXNPdmVyVGFyZ2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzT3ZlclRhcmdldCh0YXJnZXRJZCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHtcbiAgICAgICAgc2hhbGxvdzogZmFsc2VcbiAgICAgIH07XG5cbiAgICAgIC8vIHVuZGVmaW5lZCBvbiBpbml0aWFsIHJlbmRlclxuICAgICAgaWYgKCF0YXJnZXRJZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBzaGFsbG93ID0gb3B0aW9ucy5zaGFsbG93O1xuXG4gICAgICBpZiAoIXRoaXMuaXNEcmFnZ2luZygpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRhcmdldFR5cGUgPSB0aGlzLnJlZ2lzdHJ5LmdldFRhcmdldFR5cGUodGFyZ2V0SWQpO1xuICAgICAgdmFyIGRyYWdnZWRJdGVtVHlwZSA9IHRoaXMuZ2V0SXRlbVR5cGUoKTtcblxuICAgICAgaWYgKGRyYWdnZWRJdGVtVHlwZSAmJiAhbWF0Y2hlc1R5cGUodGFyZ2V0VHlwZSwgZHJhZ2dlZEl0ZW1UeXBlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciB0YXJnZXRJZHMgPSB0aGlzLmdldFRhcmdldElkcygpO1xuXG4gICAgICBpZiAoIXRhcmdldElkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5kZXggPSB0YXJnZXRJZHMuaW5kZXhPZih0YXJnZXRJZCk7XG5cbiAgICAgIGlmIChzaGFsbG93KSB7XG4gICAgICAgIHJldHVybiBpbmRleCA9PT0gdGFyZ2V0SWRzLmxlbmd0aCAtIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaW5kZXggPiAtMTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0SXRlbVR5cGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SXRlbVR5cGUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZS5nZXRTdGF0ZSgpLmRyYWdPcGVyYXRpb24uaXRlbVR5cGU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEl0ZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SXRlbSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09wZXJhdGlvbi5pdGVtO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRTb3VyY2VJZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTb3VyY2VJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09wZXJhdGlvbi5zb3VyY2VJZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0VGFyZ2V0SWRzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFRhcmdldElkcygpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09wZXJhdGlvbi50YXJnZXRJZHM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldERyb3BSZXN1bHRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RHJvcFJlc3VsdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09wZXJhdGlvbi5kcm9wUmVzdWx0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaWREcm9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpZERyb3AoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZS5nZXRTdGF0ZSgpLmRyYWdPcGVyYXRpb24uZGlkRHJvcDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaXNTb3VyY2VQdWJsaWNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNTb3VyY2VQdWJsaWMoKSB7XG4gICAgICByZXR1cm4gQm9vbGVhbih0aGlzLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09wZXJhdGlvbi5pc1NvdXJjZVB1YmxpYyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEluaXRpYWxDbGllbnRPZmZzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbENsaWVudE9mZnNldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09mZnNldC5pbml0aWFsQ2xpZW50T2Zmc2V0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJbml0aWFsU291cmNlQ2xpZW50T2Zmc2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEluaXRpYWxTb3VyY2VDbGllbnRPZmZzZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZS5nZXRTdGF0ZSgpLmRyYWdPZmZzZXQuaW5pdGlhbFNvdXJjZUNsaWVudE9mZnNldDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0Q2xpZW50T2Zmc2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldENsaWVudE9mZnNldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09mZnNldC5jbGllbnRPZmZzZXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFNvdXJjZUNsaWVudE9mZnNldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTb3VyY2VDbGllbnRPZmZzZXQoKSB7XG4gICAgICByZXR1cm4gX2dldFNvdXJjZUNsaWVudE9mZnNldCh0aGlzLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09mZnNldCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldERpZmZlcmVuY2VGcm9tSW5pdGlhbE9mZnNldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXREaWZmZXJlbmNlRnJvbUluaXRpYWxPZmZzZXQoKSB7XG4gICAgICByZXR1cm4gX2dldERpZmZlcmVuY2VGcm9tSW5pdGlhbE9mZnNldCh0aGlzLnN0b3JlLmdldFN0YXRlKCkuZHJhZ09mZnNldCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIERyYWdEcm9wTW9uaXRvckltcGw7XG59KCk7IiwidmFyIG5leHRVbmlxdWVJZCA9IDA7XG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV4dFVuaXF1ZUlkKCkge1xuICByZXR1cm4gbmV4dFVuaXF1ZUlkKys7XG59IiwiZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5pbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICdAcmVhY3QtZG5kL2ludmFyaWFudCc7XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVTb3VyY2VDb250cmFjdChzb3VyY2UpIHtcbiAgaW52YXJpYW50KHR5cGVvZiBzb3VyY2UuY2FuRHJhZyA9PT0gJ2Z1bmN0aW9uJywgJ0V4cGVjdGVkIGNhbkRyYWcgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgaW52YXJpYW50KHR5cGVvZiBzb3VyY2UuYmVnaW5EcmFnID09PSAnZnVuY3Rpb24nLCAnRXhwZWN0ZWQgYmVnaW5EcmFnIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG4gIGludmFyaWFudCh0eXBlb2Ygc291cmNlLmVuZERyYWcgPT09ICdmdW5jdGlvbicsICdFeHBlY3RlZCBlbmREcmFnIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVUYXJnZXRDb250cmFjdCh0YXJnZXQpIHtcbiAgaW52YXJpYW50KHR5cGVvZiB0YXJnZXQuY2FuRHJvcCA9PT0gJ2Z1bmN0aW9uJywgJ0V4cGVjdGVkIGNhbkRyb3AgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgaW52YXJpYW50KHR5cGVvZiB0YXJnZXQuaG92ZXIgPT09ICdmdW5jdGlvbicsICdFeHBlY3RlZCBob3ZlciB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICBpbnZhcmlhbnQodHlwZW9mIHRhcmdldC5kcm9wID09PSAnZnVuY3Rpb24nLCAnRXhwZWN0ZWQgYmVnaW5EcmFnIHRvIGJlIGEgZnVuY3Rpb24uJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVUeXBlKHR5cGUsIGFsbG93QXJyYXkpIHtcbiAgaWYgKGFsbG93QXJyYXkgJiYgQXJyYXkuaXNBcnJheSh0eXBlKSkge1xuICAgIHR5cGUuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIHZhbGlkYXRlVHlwZSh0LCBmYWxzZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaW52YXJpYW50KHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCBfdHlwZW9mKHR5cGUpID09PSAnc3ltYm9sJywgYWxsb3dBcnJheSA/ICdUeXBlIGNhbiBvbmx5IGJlIGEgc3RyaW5nLCBhIHN5bWJvbCwgb3IgYW4gYXJyYXkgb2YgZWl0aGVyLicgOiAnVHlwZSBjYW4gb25seSBiZSBhIHN0cmluZyBvciBhIHN5bWJvbC4nKTtcbn0iLCIvLyBVc2UgdGhlIGZhc3Rlc3QgbWVhbnMgcG9zc2libGUgdG8gZXhlY3V0ZSBhIHRhc2sgaW4gaXRzIG93biB0dXJuLCB3aXRoXG4vLyBwcmlvcml0eSBvdmVyIG90aGVyIGV2ZW50cyBpbmNsdWRpbmcgSU8sIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVkcmF3XG4vLyBldmVudHMgaW4gYnJvd3NlcnMuXG4vL1xuLy8gQW4gZXhjZXB0aW9uIHRocm93biBieSBhIHRhc2sgd2lsbCBwZXJtYW5lbnRseSBpbnRlcnJ1cHQgdGhlIHByb2Nlc3Npbmcgb2Zcbi8vIHN1YnNlcXVlbnQgdGFza3MuIFRoZSBoaWdoZXIgbGV2ZWwgYGFzYXBgIGZ1bmN0aW9uIGVuc3VyZXMgdGhhdCBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93biBieSBhIHRhc2ssIHRoYXQgdGhlIHRhc2sgcXVldWUgd2lsbCBjb250aW51ZSBmbHVzaGluZyBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZSwgYnV0IGlmIHlvdSB1c2UgYHJhd0FzYXBgIGRpcmVjdGx5LCB5b3UgYXJlIHJlc3BvbnNpYmxlIHRvXG4vLyBlaXRoZXIgZW5zdXJlIHRoYXQgbm8gZXhjZXB0aW9ucyBhcmUgdGhyb3duIGZyb20geW91ciB0YXNrLCBvciB0byBtYW51YWxseVxuLy8gY2FsbCBgcmF3QXNhcC5yZXF1ZXN0Rmx1c2hgIGlmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5leHBvcnQgZnVuY3Rpb24gcmF3QXNhcCh0YXNrKSB7XG4gIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgcmVxdWVzdEZsdXNoKCk7XG4gICAgZmx1c2hpbmcgPSB0cnVlO1xuICB9IC8vIEVxdWl2YWxlbnQgdG8gcHVzaCwgYnV0IGF2b2lkcyBhIGZ1bmN0aW9uIGNhbGwuXG5cblxuICBxdWV1ZVtxdWV1ZS5sZW5ndGhdID0gdGFzaztcbn1cbnZhciBxdWV1ZSA9IFtdOyAvLyBPbmNlIGEgZmx1c2ggaGFzIGJlZW4gcmVxdWVzdGVkLCBubyBmdXJ0aGVyIGNhbGxzIHRvIGByZXF1ZXN0Rmx1c2hgIGFyZVxuLy8gbmVjZXNzYXJ5IHVudGlsIHRoZSBuZXh0IGBmbHVzaGAgY29tcGxldGVzLlxuLy8gQHRzLWlnbm9yZVxuXG52YXIgZmx1c2hpbmcgPSBmYWxzZTsgLy8gYHJlcXVlc3RGbHVzaGAgaXMgYW4gaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgbWV0aG9kIHRoYXQgYXR0ZW1wdHMgdG8ga2lja1xuLy8gb2ZmIGEgYGZsdXNoYCBldmVudCBhcyBxdWlja2x5IGFzIHBvc3NpYmxlLiBgZmx1c2hgIHdpbGwgYXR0ZW1wdCB0byBleGhhdXN0XG4vLyB0aGUgZXZlbnQgcXVldWUgYmVmb3JlIHlpZWxkaW5nIHRvIHRoZSBicm93c2VyJ3Mgb3duIGV2ZW50IGxvb3AuXG5cbnZhciByZXF1ZXN0Rmx1c2g7IC8vIFRoZSBwb3NpdGlvbiBvZiB0aGUgbmV4dCB0YXNrIHRvIGV4ZWN1dGUgaW4gdGhlIHRhc2sgcXVldWUuIFRoaXMgaXNcbi8vIHByZXNlcnZlZCBiZXR3ZWVuIGNhbGxzIHRvIGBmbHVzaGAgc28gdGhhdCBpdCBjYW4gYmUgcmVzdW1lZCBpZlxuLy8gYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24uXG5cbnZhciBpbmRleCA9IDA7IC8vIElmIGEgdGFzayBzY2hlZHVsZXMgYWRkaXRpb25hbCB0YXNrcyByZWN1cnNpdmVseSwgdGhlIHRhc2sgcXVldWUgY2FuIGdyb3dcbi8vIHVuYm91bmRlZC4gVG8gcHJldmVudCBtZW1vcnkgZXhoYXVzdGlvbiwgdGhlIHRhc2sgcXVldWUgd2lsbCBwZXJpb2RpY2FsbHlcbi8vIHRydW5jYXRlIGFscmVhZHktY29tcGxldGVkIHRhc2tzLlxuXG52YXIgY2FwYWNpdHkgPSAxMDI0OyAvLyBUaGUgZmx1c2ggZnVuY3Rpb24gcHJvY2Vzc2VzIGFsbCB0YXNrcyB0aGF0IGhhdmUgYmVlbiBzY2hlZHVsZWQgd2l0aFxuLy8gYHJhd0FzYXBgIHVubGVzcyBhbmQgdW50aWwgb25lIG9mIHRob3NlIHRhc2tzIHRocm93cyBhbiBleGNlcHRpb24uXG4vLyBJZiBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgYGZsdXNoYCBlbnN1cmVzIHRoYXQgaXRzIHN0YXRlIHdpbGwgcmVtYWluXG4vLyBjb25zaXN0ZW50IGFuZCB3aWxsIHJlc3VtZSB3aGVyZSBpdCBsZWZ0IG9mZiB3aGVuIGNhbGxlZCBhZ2Fpbi5cbi8vIEhvd2V2ZXIsIGBmbHVzaGAgZG9lcyBub3QgbWFrZSBhbnkgYXJyYW5nZW1lbnRzIHRvIGJlIGNhbGxlZCBhZ2FpbiBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93bi5cblxuZnVuY3Rpb24gZmx1c2goKSB7XG4gIHdoaWxlIChpbmRleCA8IHF1ZXVlLmxlbmd0aCkge1xuICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDsgLy8gQWR2YW5jZSB0aGUgaW5kZXggYmVmb3JlIGNhbGxpbmcgdGhlIHRhc2suIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGxcbiAgICAvLyBiZWdpbiBmbHVzaGluZyBvbiB0aGUgbmV4dCB0YXNrIHRoZSB0YXNrIHRocm93cyBhbiBlcnJvci5cblxuICAgIGluZGV4ID0gaW5kZXggKyAxO1xuICAgIHF1ZXVlW2N1cnJlbnRJbmRleF0uY2FsbCgpOyAvLyBQcmV2ZW50IGxlYWtpbmcgbWVtb3J5IGZvciBsb25nIGNoYWlucyBvZiByZWN1cnNpdmUgY2FsbHMgdG8gYGFzYXBgLlxuICAgIC8vIElmIHdlIGNhbGwgYGFzYXBgIHdpdGhpbiB0YXNrcyBzY2hlZHVsZWQgYnkgYGFzYXBgLCB0aGUgcXVldWUgd2lsbFxuICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IHRhc2sgd2UgZXhlY3V0ZSwgd2UgZG9uJ3RcbiAgICAvLyBzaGlmdCB0YXNrcyBvZmYgdGhlIHF1ZXVlIGFmdGVyIHRoZXkgaGF2ZSBiZWVuIGV4ZWN1dGVkLlxuICAgIC8vIEluc3RlYWQsIHdlIHBlcmlvZGljYWxseSBzaGlmdCAxMDI0IHRhc2tzIG9mZiB0aGUgcXVldWUuXG5cbiAgICBpZiAoaW5kZXggPiBjYXBhY2l0eSkge1xuICAgICAgLy8gTWFudWFsbHkgc2hpZnQgYWxsIHZhbHVlcyBzdGFydGluZyBhdCB0aGUgaW5kZXggYmFjayB0byB0aGVcbiAgICAgIC8vIGJlZ2lubmluZyBvZiB0aGUgcXVldWUuXG4gICAgICBmb3IgKHZhciBzY2FuID0gMCwgbmV3TGVuZ3RoID0gcXVldWUubGVuZ3RoIC0gaW5kZXg7IHNjYW4gPCBuZXdMZW5ndGg7IHNjYW4rKykge1xuICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICB9XG5cbiAgICAgIHF1ZXVlLmxlbmd0aCAtPSBpbmRleDtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gIH1cblxuICBxdWV1ZS5sZW5ndGggPSAwO1xuICBpbmRleCA9IDA7XG4gIGZsdXNoaW5nID0gZmFsc2U7XG59IC8vIGByZXF1ZXN0Rmx1c2hgIGlzIGltcGxlbWVudGVkIHVzaW5nIGEgc3RyYXRlZ3kgYmFzZWQgb24gZGF0YSBjb2xsZWN0ZWQgZnJvbVxuLy8gZXZlcnkgYXZhaWxhYmxlIFNhdWNlTGFicyBTZWxlbml1bSB3ZWIgZHJpdmVyIHdvcmtlciBhdCB0aW1lIG9mIHdyaXRpbmcuXG4vLyBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xbUctNVVZR3VwNXF4R2RFTVdraFA2QldDejA1M05VYjJFMVFvVVRVMTZ1QS9lZGl0I2dpZD03ODM3MjQ1OTNcbi8vIFNhZmFyaSA2IGFuZCA2LjEgZm9yIGRlc2t0b3AsIGlQYWQsIGFuZCBpUGhvbmUgYXJlIHRoZSBvbmx5IGJyb3dzZXJzIHRoYXRcbi8vIGhhdmUgV2ViS2l0TXV0YXRpb25PYnNlcnZlciBidXQgbm90IHVuLXByZWZpeGVkIE11dGF0aW9uT2JzZXJ2ZXIuXG4vLyBNdXN0IHVzZSBgZ2xvYmFsYCBvciBgc2VsZmAgaW5zdGVhZCBvZiBgd2luZG93YCB0byB3b3JrIGluIGJvdGggZnJhbWVzIGFuZCB3ZWJcbi8vIHdvcmtlcnMuIGBnbG9iYWxgIGlzIGEgcHJvdmlzaW9uIG9mIEJyb3dzZXJpZnksIE1yLCBNcnMsIG9yIE1vcC5cblxuLyogZ2xvYmFscyBzZWxmICovXG5cblxudmFyIHNjb3BlID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiBzZWxmO1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gc2NvcGUuTXV0YXRpb25PYnNlcnZlciB8fCBzY29wZS5XZWJLaXRNdXRhdGlvbk9ic2VydmVyOyAvLyBNdXRhdGlvbk9ic2VydmVycyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBoYXZlIGhpZ2ggcHJpb3JpdHkgYW5kIHdvcmtcbi8vIHJlbGlhYmx5IGV2ZXJ5d2hlcmUgdGhleSBhcmUgaW1wbGVtZW50ZWQuXG4vLyBUaGV5IGFyZSBpbXBsZW1lbnRlZCBpbiBhbGwgbW9kZXJuIGJyb3dzZXJzLlxuLy9cbi8vIC0gQW5kcm9pZCA0LTQuM1xuLy8gLSBDaHJvbWUgMjYtMzRcbi8vIC0gRmlyZWZveCAxNC0yOVxuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciAxMVxuLy8gLSBpUGFkIFNhZmFyaSA2LTcuMVxuLy8gLSBpUGhvbmUgU2FmYXJpIDctNy4xXG4vLyAtIFNhZmFyaSA2LTdcblxuaWYgKHR5cGVvZiBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7IC8vIE1lc3NhZ2VDaGFubmVscyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBnaXZlIGRpcmVjdCBhY2Nlc3MgdG8gdGhlIEhUTUxcbiAgLy8gdGFzayBxdWV1ZSwgYXJlIGltcGxlbWVudGVkIGluIEludGVybmV0IEV4cGxvcmVyIDEwLCBTYWZhcmkgNS4wLTEsIGFuZCBPcGVyYVxuICAvLyAxMS0xMiwgYW5kIGluIHdlYiB3b3JrZXJzIGluIG1hbnkgZW5naW5lcy5cbiAgLy8gQWx0aG91Z2ggbWVzc2FnZSBjaGFubmVscyB5aWVsZCB0byBhbnkgcXVldWVkIHJlbmRlcmluZyBhbmQgSU8gdGFza3MsIHRoZXlcbiAgLy8gd291bGQgYmUgYmV0dGVyIHRoYW4gaW1wb3NpbmcgdGhlIDRtcyBkZWxheSBvZiB0aW1lcnMuXG4gIC8vIEhvd2V2ZXIsIHRoZXkgZG8gbm90IHdvcmsgcmVsaWFibHkgaW4gSW50ZXJuZXQgRXhwbG9yZXIgb3IgU2FmYXJpLlxuICAvLyBJbnRlcm5ldCBFeHBsb3JlciAxMCBpcyB0aGUgb25seSBicm93c2VyIHRoYXQgaGFzIHNldEltbWVkaWF0ZSBidXQgZG9lc1xuICAvLyBub3QgaGF2ZSBNdXRhdGlvbk9ic2VydmVycy5cbiAgLy8gQWx0aG91Z2ggc2V0SW1tZWRpYXRlIHlpZWxkcyB0byB0aGUgYnJvd3NlcidzIHJlbmRlcmVyLCBpdCB3b3VsZCBiZVxuICAvLyBwcmVmZXJyYWJsZSB0byBmYWxsaW5nIGJhY2sgdG8gc2V0VGltZW91dCBzaW5jZSBpdCBkb2VzIG5vdCBoYXZlXG4gIC8vIHRoZSBtaW5pbXVtIDRtcyBwZW5hbHR5LlxuICAvLyBVbmZvcnR1bmF0ZWx5IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAgTW9iaWxlIChhbmRcbiAgLy8gRGVza3RvcCB0byBhIGxlc3NlciBleHRlbnQpIHRoYXQgcmVuZGVycyBib3RoIHNldEltbWVkaWF0ZSBhbmRcbiAgLy8gTWVzc2FnZUNoYW5uZWwgdXNlbGVzcyBmb3IgdGhlIHB1cnBvc2VzIG9mIEFTQVAuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS9pc3N1ZXMvMzk2XG4gIC8vIFRpbWVycyBhcmUgaW1wbGVtZW50ZWQgdW5pdmVyc2FsbHkuXG4gIC8vIFdlIGZhbGwgYmFjayB0byB0aW1lcnMgaW4gd29ya2VycyBpbiBtb3N0IGVuZ2luZXMsIGFuZCBpbiBmb3JlZ3JvdW5kXG4gIC8vIGNvbnRleHRzIGluIHRoZSBmb2xsb3dpbmcgYnJvd3NlcnMuXG4gIC8vIEhvd2V2ZXIsIG5vdGUgdGhhdCBldmVuIHRoaXMgc2ltcGxlIGNhc2UgcmVxdWlyZXMgbnVhbmNlcyB0byBvcGVyYXRlIGluIGFcbiAgLy8gYnJvYWQgc3BlY3RydW0gb2YgYnJvd3NlcnMuXG4gIC8vXG4gIC8vIC0gRmlyZWZveCAzLTEzXG4gIC8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi05XG4gIC8vIC0gaVBhZCBTYWZhcmkgNC4zXG4gIC8vIC0gTHlueCAyLjguN1xufSBlbHNlIHtcbiAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGZsdXNoKTtcbn0gLy8gYHJlcXVlc3RGbHVzaGAgcmVxdWVzdHMgdGhhdCB0aGUgaGlnaCBwcmlvcml0eSBldmVudCBxdWV1ZSBiZSBmbHVzaGVkIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLlxuLy8gVGhpcyBpcyB1c2VmdWwgdG8gcHJldmVudCBhbiBlcnJvciB0aHJvd24gaW4gYSB0YXNrIGZyb20gc3RhbGxpbmcgdGhlIGV2ZW50XG4vLyBxdWV1ZSBpZiB0aGUgZXhjZXB0aW9uIGhhbmRsZWQgYnkgTm9kZS5qc+KAmXNcbi8vIGBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIilgIG9yIGJ5IGEgZG9tYWluLlxuXG5cbnJhd0FzYXAucmVxdWVzdEZsdXNoID0gcmVxdWVzdEZsdXNoOyAvLyBUbyByZXF1ZXN0IGEgaGlnaCBwcmlvcml0eSBldmVudCwgd2UgaW5kdWNlIGEgbXV0YXRpb24gb2JzZXJ2ZXIgYnkgdG9nZ2xpbmdcbi8vIHRoZSB0ZXh0IG9mIGEgdGV4dCBub2RlIGJldHdlZW4gXCIxXCIgYW5kIFwiLTFcIi5cblxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spIHtcbiAgdmFyIHRvZ2dsZSA9IDE7XG4gIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtcbiAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgdG9nZ2xlID0gLXRvZ2dsZTtcbiAgICBub2RlLmRhdGEgPSB0b2dnbGU7XG4gIH07XG59IC8vIFRoZSBtZXNzYWdlIGNoYW5uZWwgdGVjaG5pcXVlIHdhcyBkaXNjb3ZlcmVkIGJ5IE1hbHRlIFVibCBhbmQgd2FzIHRoZVxuLy8gb3JpZ2luYWwgZm91bmRhdGlvbiBmb3IgdGhpcyBsaWJyYXJ5LlxuLy8gaHR0cDovL3d3dy5ub25ibG9ja2luZy5pby8yMDExLzA2L3dpbmRvd25leHR0aWNrLmh0bWxcbi8vIFNhZmFyaSA2LjAuNSAoYXQgbGVhc3QpIGludGVybWl0dGVudGx5IGZhaWxzIHRvIGNyZWF0ZSBtZXNzYWdlIHBvcnRzIG9uIGFcbi8vIHBhZ2UncyBmaXJzdCBsb2FkLiBUaGFua2Z1bGx5LCB0aGlzIHZlcnNpb24gb2YgU2FmYXJpIHN1cHBvcnRzXG4vLyBNdXRhdGlvbk9ic2VydmVycywgc28gd2UgZG9uJ3QgbmVlZCB0byBmYWxsIGJhY2sgaW4gdGhhdCBjYXNlLlxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU1lc3NhZ2VDaGFubmVsKGNhbGxiYWNrKSB7XG4vLyAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbi8vICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGNhbGxiYWNrO1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbi8vICAgICB9O1xuLy8gfVxuLy8gRm9yIHJlYXNvbnMgZXhwbGFpbmVkIGFib3ZlLCB3ZSBhcmUgYWxzbyB1bmFibGUgdG8gdXNlIGBzZXRJbW1lZGlhdGVgXG4vLyB1bmRlciBhbnkgY2lyY3Vtc3RhbmNlcy5cbi8vIEV2ZW4gaWYgd2Ugd2VyZSwgdGhlcmUgaXMgYW5vdGhlciBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAuXG4vLyBJdCBpcyBub3Qgc3VmZmljaWVudCB0byBhc3NpZ24gYHNldEltbWVkaWF0ZWAgdG8gYHJlcXVlc3RGbHVzaGAgYmVjYXVzZVxuLy8gYHNldEltbWVkaWF0ZWAgbXVzdCBiZSBjYWxsZWQgKmJ5IG5hbWUqIGFuZCB0aGVyZWZvcmUgbXVzdCBiZSB3cmFwcGVkIGluIGFcbi8vIGNsb3N1cmUuXG4vLyBOZXZlciBmb3JnZXQuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tU2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBzZXRJbW1lZGlhdGUoY2FsbGJhY2spO1xuLy8gICAgIH07XG4vLyB9XG4vLyBTYWZhcmkgNi4wIGhhcyBhIHByb2JsZW0gd2hlcmUgdGltZXJzIHdpbGwgZ2V0IGxvc3Qgd2hpbGUgdGhlIHVzZXIgaXNcbi8vIHNjcm9sbGluZy4gVGhpcyBwcm9ibGVtIGRvZXMgbm90IGltcGFjdCBBU0FQIGJlY2F1c2UgU2FmYXJpIDYuMCBzdXBwb3J0c1xuLy8gbXV0YXRpb24gb2JzZXJ2ZXJzLCBzbyB0aGF0IGltcGxlbWVudGF0aW9uIGlzIHVzZWQgaW5zdGVhZC5cbi8vIEhvd2V2ZXIsIGlmIHdlIGV2ZXIgZWxlY3QgdG8gdXNlIHRpbWVycyBpbiBTYWZhcmksIHRoZSBwcmV2YWxlbnQgd29yay1hcm91bmRcbi8vIGlzIHRvIGFkZCBhIHNjcm9sbCBldmVudCBsaXN0ZW5lciB0aGF0IGNhbGxzIGZvciBhIGZsdXNoLlxuLy8gYHNldFRpbWVvdXRgIGRvZXMgbm90IGNhbGwgdGhlIHBhc3NlZCBjYWxsYmFjayBpZiB0aGUgZGVsYXkgaXMgbGVzcyB0aGFuXG4vLyBhcHByb3hpbWF0ZWx5IDcgaW4gd2ViIHdvcmtlcnMgaW4gRmlyZWZveCA4IHRocm91Z2ggMTgsIGFuZCBzb21ldGltZXMgbm90XG4vLyBldmVuIHRoZW4uXG5cblxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAvLyBXZSBkaXNwYXRjaCBhIHRpbWVvdXQgd2l0aCBhIHNwZWNpZmllZCBkZWxheSBvZiAwIGZvciBlbmdpbmVzIHRoYXRcbiAgICAvLyBjYW4gcmVsaWFibHkgYWNjb21tb2RhdGUgdGhhdCByZXF1ZXN0LiBUaGlzIHdpbGwgdXN1YWxseSBiZSBzbmFwcGVkXG4gICAgLy8gdG8gYSA0IG1pbGlzZWNvbmQgZGVsYXksIGJ1dCBvbmNlIHdlJ3JlIGZsdXNoaW5nLCB0aGVyZSdzIG5vIGRlbGF5XG4gICAgLy8gYmV0d2VlbiBldmVudHMuXG4gICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGhhbmRsZVRpbWVyLCAwKTsgLy8gSG93ZXZlciwgc2luY2UgdGhpcyB0aW1lciBnZXRzIGZyZXF1ZW50bHkgZHJvcHBlZCBpbiBGaXJlZm94XG4gICAgLy8gd29ya2Vycywgd2UgZW5saXN0IGFuIGludGVydmFsIGhhbmRsZSB0aGF0IHdpbGwgdHJ5IHRvIGZpcmVcbiAgICAvLyBhbiBldmVudCAyMCB0aW1lcyBwZXIgc2Vjb25kIHVudGlsIGl0IHN1Y2NlZWRzLlxuXG4gICAgdmFyIGludGVydmFsSGFuZGxlID0gc2V0SW50ZXJ2YWwoaGFuZGxlVGltZXIsIDUwKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVRpbWVyKCkge1xuICAgICAgLy8gV2hpY2hldmVyIHRpbWVyIHN1Y2NlZWRzIHdpbGwgY2FuY2VsIGJvdGggdGltZXJzIGFuZFxuICAgICAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2suXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dEhhbmRsZSk7XG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsSGFuZGxlKTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9O1xufSAvLyBUaGlzIGlzIGZvciBgYXNhcC5qc2Agb25seS5cbi8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdCBkZXBlbmRzIG9uXG4vLyBpdHMgZXhpc3RlbmNlLlxuXG5cbnJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyOyAvLyBBU0FQIHdhcyBvcmlnaW5hbGx5IGEgbmV4dFRpY2sgc2hpbSBpbmNsdWRlZCBpbiBRLiBUaGlzIHdhcyBmYWN0b3JlZCBvdXRcbi8vIGludG8gdGhpcyBBU0FQIHBhY2thZ2UuIEl0IHdhcyBsYXRlciBhZGFwdGVkIHRvIFJTVlAgd2hpY2ggbWFkZSBmdXJ0aGVyXG4vLyBhbWVuZG1lbnRzLiBUaGVzZSBkZWNpc2lvbnMsIHBhcnRpY3VsYXJseSB0byBtYXJnaW5hbGl6ZSBNZXNzYWdlQ2hhbm5lbCBhbmRcbi8vIHRvIGNhcHR1cmUgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gaW4gYSBjbG9zdXJlLCB3ZXJlIGludGVncmF0ZWRcbi8vIGJhY2sgaW50byBBU0FQIHByb3Blci5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aWxkZWlvL3JzdnAuanMvYmxvYi9jZGRmNzIzMjU0NmE5Y2Y4NTg1MjRiNzVjZGU2ZjllZGY3MjYyMGE3L2xpYi9yc3ZwL2FzYXAuanMiLCJpbXBvcnQgeyByYXdBc2FwIH0gZnJvbSAnLi9yYXcnOyAvLyByYXdBc2FwIHByb3ZpZGVzIGV2ZXJ5dGhpbmcgd2UgbmVlZCBleGNlcHQgZXhjZXB0aW9uIG1hbmFnZW1lbnQuXG4vLyBSYXdUYXNrcyBhcmUgcmVjeWNsZWQgdG8gcmVkdWNlIEdDIGNodXJuLlxuXG52YXIgZnJlZVRhc2tzID0gW107IC8vIFdlIHF1ZXVlIGVycm9ycyB0byBlbnN1cmUgdGhleSBhcmUgdGhyb3duIGluIHJpZ2h0IG9yZGVyIChGSUZPKS5cbi8vIEFycmF5LWFzLXF1ZXVlIGlzIGdvb2QgZW5vdWdoIGhlcmUsIHNpbmNlIHdlIGFyZSBqdXN0IGRlYWxpbmcgd2l0aCBleGNlcHRpb25zLlxuXG52YXIgcGVuZGluZ0Vycm9ycyA9IFtdO1xudmFyIHJlcXVlc3RFcnJvclRocm93ID0gcmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIodGhyb3dGaXJzdEVycm9yKTtcblxuZnVuY3Rpb24gdGhyb3dGaXJzdEVycm9yKCkge1xuICBpZiAocGVuZGluZ0Vycm9ycy5sZW5ndGgpIHtcbiAgICB0aHJvdyBwZW5kaW5nRXJyb3JzLnNoaWZ0KCk7XG4gIH1cbn1cbi8qKlxuICogQ2FsbHMgYSB0YXNrIGFzIHNvb24gYXMgcG9zc2libGUgYWZ0ZXIgcmV0dXJuaW5nLCBpbiBpdHMgb3duIGV2ZW50LCB3aXRoIHByaW9yaXR5XG4gKiBvdmVyIG90aGVyIGV2ZW50cyBsaWtlIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVwYWludC4gQW4gZXJyb3IgdGhyb3duIGZyb20gYW5cbiAqIGV2ZW50IHdpbGwgbm90IGludGVycnVwdCwgbm9yIGV2ZW4gc3Vic3RhbnRpYWxseSBzbG93IGRvd24gdGhlIHByb2Nlc3Npbmcgb2ZcbiAqIG90aGVyIGV2ZW50cywgYnV0IHdpbGwgYmUgcmF0aGVyIHBvc3Rwb25lZCB0byBhIGxvd2VyIHByaW9yaXR5IGV2ZW50LlxuICogQHBhcmFtIHt7Y2FsbH19IHRhc2sgQSBjYWxsYWJsZSBvYmplY3QsIHR5cGljYWxseSBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgbm9cbiAqIGFyZ3VtZW50cy5cbiAqL1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBhc2FwKHRhc2spIHtcbiAgdmFyIHJhd1Rhc2s7XG5cbiAgaWYgKGZyZWVUYXNrcy5sZW5ndGgpIHtcbiAgICByYXdUYXNrID0gZnJlZVRhc2tzLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHJhd1Rhc2sgPSBuZXcgUmF3VGFzaygpO1xuICB9XG5cbiAgcmF3VGFzay50YXNrID0gdGFzaztcbiAgcmF3QXNhcChyYXdUYXNrKTtcbn0gLy8gV2Ugd3JhcCB0YXNrcyB3aXRoIHJlY3ljbGFibGUgdGFzayBvYmplY3RzLiAgQSB0YXNrIG9iamVjdCBpbXBsZW1lbnRzXG4vLyBgY2FsbGAsIGp1c3QgbGlrZSBhIGZ1bmN0aW9uLlxuXG52YXIgUmF3VGFzayA9XG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJhd1Rhc2soKSB7fVxuXG4gIFJhd1Rhc2sucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudGFzay5jYWxsKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChhc2FwLm9uZXJyb3IpIHtcbiAgICAgICAgLy8gVGhpcyBob29rIGV4aXN0cyBwdXJlbHkgZm9yIHRlc3RpbmcgcHVycG9zZXMuXG4gICAgICAgIC8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdFxuICAgICAgICAvLyBkZXBlbmRzIG9uIGl0cyBleGlzdGVuY2UuXG4gICAgICAgIGFzYXAub25lcnJvcihlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJbiBhIHdlYiBicm93c2VyLCBleGNlcHRpb25zIGFyZSBub3QgZmF0YWwuIEhvd2V2ZXIsIHRvIGF2b2lkXG4gICAgICAgIC8vIHNsb3dpbmcgZG93biB0aGUgcXVldWUgb2YgcGVuZGluZyB0YXNrcywgd2UgcmV0aHJvdyB0aGUgZXJyb3IgaW4gYVxuICAgICAgICAvLyBsb3dlciBwcmlvcml0eSB0dXJuLlxuICAgICAgICBwZW5kaW5nRXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICByZXF1ZXN0RXJyb3JUaHJvdygpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnRhc2sgPSBudWxsO1xuICAgICAgZnJlZVRhc2tzW2ZyZWVUYXNrcy5sZW5ndGhdID0gdGhpcztcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFJhd1Rhc2s7XG59KCk7IiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyB2YXIgX2kgPSBhcnIgPT0gbnVsbCA/IG51bGwgOiB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGFycltTeW1ib2wuaXRlcmF0b3JdIHx8IGFycltcIkBAaXRlcmF0b3JcIl07IGlmIChfaSA9PSBudWxsKSByZXR1cm47IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX3MsIF9lOyB0cnkgeyBmb3IgKF9pID0gX2kuY2FsbChhcnIpOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbmltcG9ydCB7IGludmFyaWFudCB9IGZyb20gJ0ByZWFjdC1kbmQvaW52YXJpYW50JztcbmltcG9ydCB7IGFkZFNvdXJjZSBhcyBfYWRkU291cmNlLCBhZGRUYXJnZXQgYXMgX2FkZFRhcmdldCwgcmVtb3ZlU291cmNlIGFzIF9yZW1vdmVTb3VyY2UsIHJlbW92ZVRhcmdldCBhcyBfcmVtb3ZlVGFyZ2V0IH0gZnJvbSAnLi4vYWN0aW9ucy9yZWdpc3RyeSc7XG5pbXBvcnQgeyBnZXROZXh0VW5pcXVlSWQgfSBmcm9tICcuLi91dGlscy9nZXROZXh0VW5pcXVlSWQnO1xuaW1wb3J0IHsgSGFuZGxlclJvbGUgfSBmcm9tICcuLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IHZhbGlkYXRlU291cmNlQ29udHJhY3QsIHZhbGlkYXRlVGFyZ2V0Q29udHJhY3QsIHZhbGlkYXRlVHlwZSB9IGZyb20gJy4uL2NvbnRyYWN0cyc7XG5pbXBvcnQgeyBhc2FwIH0gZnJvbSAnQHJlYWN0LWRuZC9hc2FwJztcblxuZnVuY3Rpb24gZ2V0TmV4dEhhbmRsZXJJZChyb2xlKSB7XG4gIHZhciBpZCA9IGdldE5leHRVbmlxdWVJZCgpLnRvU3RyaW5nKCk7XG5cbiAgc3dpdGNoIChyb2xlKSB7XG4gICAgY2FzZSBIYW5kbGVyUm9sZS5TT1VSQ0U6XG4gICAgICByZXR1cm4gXCJTXCIuY29uY2F0KGlkKTtcblxuICAgIGNhc2UgSGFuZGxlclJvbGUuVEFSR0VUOlxuICAgICAgcmV0dXJuIFwiVFwiLmNvbmNhdChpZCk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBIYW5kbGVyIFJvbGU6IFwiLmNvbmNhdChyb2xlKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VSb2xlRnJvbUhhbmRsZXJJZChoYW5kbGVySWQpIHtcbiAgc3dpdGNoIChoYW5kbGVySWRbMF0pIHtcbiAgICBjYXNlICdTJzpcbiAgICAgIHJldHVybiBIYW5kbGVyUm9sZS5TT1VSQ0U7XG5cbiAgICBjYXNlICdUJzpcbiAgICAgIHJldHVybiBIYW5kbGVyUm9sZS5UQVJHRVQ7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgaW52YXJpYW50KGZhbHNlLCBcIkNhbm5vdCBwYXJzZSBoYW5kbGVyIElEOiBcIi5jb25jYXQoaGFuZGxlcklkKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwQ29udGFpbnNWYWx1ZShtYXAsIHNlYXJjaFZhbHVlKSB7XG4gIHZhciBlbnRyaWVzID0gbWFwLmVudHJpZXMoKTtcbiAgdmFyIGlzRG9uZSA9IGZhbHNlO1xuXG4gIGRvIHtcbiAgICB2YXIgX2VudHJpZXMkbmV4dCA9IGVudHJpZXMubmV4dCgpLFxuICAgICAgICBkb25lID0gX2VudHJpZXMkbmV4dC5kb25lLFxuICAgICAgICBfZW50cmllcyRuZXh0JHZhbHVlID0gX3NsaWNlZFRvQXJyYXkoX2VudHJpZXMkbmV4dC52YWx1ZSwgMiksXG4gICAgICAgIHZhbHVlID0gX2VudHJpZXMkbmV4dCR2YWx1ZVsxXTtcblxuICAgIGlmICh2YWx1ZSA9PT0gc2VhcmNoVmFsdWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlzRG9uZSA9ICEhZG9uZTtcbiAgfSB3aGlsZSAoIWlzRG9uZSk7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgdmFyIEhhbmRsZXJSZWdpc3RyeUltcGwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBIYW5kbGVyUmVnaXN0cnlJbXBsKHN0b3JlKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEhhbmRsZXJSZWdpc3RyeUltcGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwidHlwZXNcIiwgbmV3IE1hcCgpKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRyYWdTb3VyY2VzXCIsIG5ldyBNYXAoKSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkcm9wVGFyZ2V0c1wiLCBuZXcgTWFwKCkpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicGlubmVkU291cmNlSWRcIiwgbnVsbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJwaW5uZWRTb3VyY2VcIiwgbnVsbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJzdG9yZVwiLCB2b2lkIDApO1xuXG4gICAgdGhpcy5zdG9yZSA9IHN0b3JlO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEhhbmRsZXJSZWdpc3RyeUltcGwsIFt7XG4gICAga2V5OiBcImFkZFNvdXJjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRTb3VyY2UodHlwZSwgc291cmNlKSB7XG4gICAgICB2YWxpZGF0ZVR5cGUodHlwZSk7XG4gICAgICB2YWxpZGF0ZVNvdXJjZUNvbnRyYWN0KHNvdXJjZSk7XG4gICAgICB2YXIgc291cmNlSWQgPSB0aGlzLmFkZEhhbmRsZXIoSGFuZGxlclJvbGUuU09VUkNFLCB0eXBlLCBzb3VyY2UpO1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChfYWRkU291cmNlKHNvdXJjZUlkKSk7XG4gICAgICByZXR1cm4gc291cmNlSWQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZFRhcmdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRUYXJnZXQodHlwZSwgdGFyZ2V0KSB7XG4gICAgICB2YWxpZGF0ZVR5cGUodHlwZSwgdHJ1ZSk7XG4gICAgICB2YWxpZGF0ZVRhcmdldENvbnRyYWN0KHRhcmdldCk7XG4gICAgICB2YXIgdGFyZ2V0SWQgPSB0aGlzLmFkZEhhbmRsZXIoSGFuZGxlclJvbGUuVEFSR0VULCB0eXBlLCB0YXJnZXQpO1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChfYWRkVGFyZ2V0KHRhcmdldElkKSk7XG4gICAgICByZXR1cm4gdGFyZ2V0SWQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNvbnRhaW5zSGFuZGxlclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb250YWluc0hhbmRsZXIoaGFuZGxlcikge1xuICAgICAgcmV0dXJuIG1hcENvbnRhaW5zVmFsdWUodGhpcy5kcmFnU291cmNlcywgaGFuZGxlcikgfHwgbWFwQ29udGFpbnNWYWx1ZSh0aGlzLmRyb3BUYXJnZXRzLCBoYW5kbGVyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0U291cmNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFNvdXJjZShzb3VyY2VJZCkge1xuICAgICAgdmFyIGluY2x1ZGVQaW5uZWQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xuICAgICAgaW52YXJpYW50KHRoaXMuaXNTb3VyY2VJZChzb3VyY2VJZCksICdFeHBlY3RlZCBhIHZhbGlkIHNvdXJjZSBJRC4nKTtcbiAgICAgIHZhciBpc1Bpbm5lZCA9IGluY2x1ZGVQaW5uZWQgJiYgc291cmNlSWQgPT09IHRoaXMucGlubmVkU291cmNlSWQ7XG4gICAgICB2YXIgc291cmNlID0gaXNQaW5uZWQgPyB0aGlzLnBpbm5lZFNvdXJjZSA6IHRoaXMuZHJhZ1NvdXJjZXMuZ2V0KHNvdXJjZUlkKTtcbiAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFRhcmdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0SWQpIHtcbiAgICAgIGludmFyaWFudCh0aGlzLmlzVGFyZ2V0SWQodGFyZ2V0SWQpLCAnRXhwZWN0ZWQgYSB2YWxpZCB0YXJnZXQgSUQuJyk7XG4gICAgICByZXR1cm4gdGhpcy5kcm9wVGFyZ2V0cy5nZXQodGFyZ2V0SWQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRTb3VyY2VUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFNvdXJjZVR5cGUoc291cmNlSWQpIHtcbiAgICAgIGludmFyaWFudCh0aGlzLmlzU291cmNlSWQoc291cmNlSWQpLCAnRXhwZWN0ZWQgYSB2YWxpZCBzb3VyY2UgSUQuJyk7XG4gICAgICByZXR1cm4gdGhpcy50eXBlcy5nZXQoc291cmNlSWQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRUYXJnZXRUeXBlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFRhcmdldFR5cGUodGFyZ2V0SWQpIHtcbiAgICAgIGludmFyaWFudCh0aGlzLmlzVGFyZ2V0SWQodGFyZ2V0SWQpLCAnRXhwZWN0ZWQgYSB2YWxpZCB0YXJnZXQgSUQuJyk7XG4gICAgICByZXR1cm4gdGhpcy50eXBlcy5nZXQodGFyZ2V0SWQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc1NvdXJjZUlkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzU291cmNlSWQoaGFuZGxlcklkKSB7XG4gICAgICB2YXIgcm9sZSA9IHBhcnNlUm9sZUZyb21IYW5kbGVySWQoaGFuZGxlcklkKTtcbiAgICAgIHJldHVybiByb2xlID09PSBIYW5kbGVyUm9sZS5TT1VSQ0U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImlzVGFyZ2V0SWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNUYXJnZXRJZChoYW5kbGVySWQpIHtcbiAgICAgIHZhciByb2xlID0gcGFyc2VSb2xlRnJvbUhhbmRsZXJJZChoYW5kbGVySWQpO1xuICAgICAgcmV0dXJuIHJvbGUgPT09IEhhbmRsZXJSb2xlLlRBUkdFVDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlU291cmNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZVNvdXJjZShzb3VyY2VJZCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgaW52YXJpYW50KHRoaXMuZ2V0U291cmNlKHNvdXJjZUlkKSwgJ0V4cGVjdGVkIGFuIGV4aXN0aW5nIHNvdXJjZS4nKTtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goX3JlbW92ZVNvdXJjZShzb3VyY2VJZCkpO1xuICAgICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLmRyYWdTb3VyY2VzLmRlbGV0ZShzb3VyY2VJZCk7XG5cbiAgICAgICAgX3RoaXMudHlwZXMuZGVsZXRlKHNvdXJjZUlkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZW1vdmVUYXJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlVGFyZ2V0KHRhcmdldElkKSB7XG4gICAgICBpbnZhcmlhbnQodGhpcy5nZXRUYXJnZXQodGFyZ2V0SWQpLCAnRXhwZWN0ZWQgYW4gZXhpc3RpbmcgdGFyZ2V0LicpO1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChfcmVtb3ZlVGFyZ2V0KHRhcmdldElkKSk7XG4gICAgICB0aGlzLmRyb3BUYXJnZXRzLmRlbGV0ZSh0YXJnZXRJZCk7XG4gICAgICB0aGlzLnR5cGVzLmRlbGV0ZSh0YXJnZXRJZCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBpblNvdXJjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwaW5Tb3VyY2Uoc291cmNlSWQpIHtcbiAgICAgIHZhciBzb3VyY2UgPSB0aGlzLmdldFNvdXJjZShzb3VyY2VJZCk7XG4gICAgICBpbnZhcmlhbnQoc291cmNlLCAnRXhwZWN0ZWQgYW4gZXhpc3Rpbmcgc291cmNlLicpO1xuICAgICAgdGhpcy5waW5uZWRTb3VyY2VJZCA9IHNvdXJjZUlkO1xuICAgICAgdGhpcy5waW5uZWRTb3VyY2UgPSBzb3VyY2U7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVucGluU291cmNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVucGluU291cmNlKCkge1xuICAgICAgaW52YXJpYW50KHRoaXMucGlubmVkU291cmNlLCAnTm8gc291cmNlIGlzIHBpbm5lZCBhdCB0aGUgdGltZS4nKTtcbiAgICAgIHRoaXMucGlubmVkU291cmNlSWQgPSBudWxsO1xuICAgICAgdGhpcy5waW5uZWRTb3VyY2UgPSBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRIYW5kbGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZEhhbmRsZXIocm9sZSwgdHlwZSwgaGFuZGxlcikge1xuICAgICAgdmFyIGlkID0gZ2V0TmV4dEhhbmRsZXJJZChyb2xlKTtcbiAgICAgIHRoaXMudHlwZXMuc2V0KGlkLCB0eXBlKTtcblxuICAgICAgaWYgKHJvbGUgPT09IEhhbmRsZXJSb2xlLlNPVVJDRSkge1xuICAgICAgICB0aGlzLmRyYWdTb3VyY2VzLnNldChpZCwgaGFuZGxlcik7XG4gICAgICB9IGVsc2UgaWYgKHJvbGUgPT09IEhhbmRsZXJSb2xlLlRBUkdFVCkge1xuICAgICAgICB0aGlzLmRyb3BUYXJnZXRzLnNldChpZCwgaGFuZGxlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSGFuZGxlclJlZ2lzdHJ5SW1wbDtcbn0oKTsiLCJpbXBvcnQgeyBEcmFnRHJvcE1hbmFnZXJJbXBsIH0gZnJvbSAnLi9jbGFzc2VzL0RyYWdEcm9wTWFuYWdlckltcGwnO1xuaW1wb3J0IHsgY3JlYXRlU3RvcmUgfSBmcm9tICdyZWR1eCc7XG5pbXBvcnQgeyByZWR1Y2UgfSBmcm9tICcuL3JlZHVjZXJzJztcbmltcG9ydCB7IERyYWdEcm9wTW9uaXRvckltcGwgfSBmcm9tICcuL2NsYXNzZXMvRHJhZ0Ryb3BNb25pdG9ySW1wbCc7XG5pbXBvcnQgeyBIYW5kbGVyUmVnaXN0cnlJbXBsIH0gZnJvbSAnLi9jbGFzc2VzL0hhbmRsZXJSZWdpc3RyeUltcGwnO1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURyYWdEcm9wTWFuYWdlcihiYWNrZW5kRmFjdG9yeSkge1xuICB2YXIgZ2xvYmFsQ29udGV4dCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICB2YXIgYmFja2VuZE9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuICB2YXIgZGVidWdNb2RlID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBmYWxzZTtcbiAgdmFyIHN0b3JlID0gbWFrZVN0b3JlSW5zdGFuY2UoZGVidWdNb2RlKTtcbiAgdmFyIG1vbml0b3IgPSBuZXcgRHJhZ0Ryb3BNb25pdG9ySW1wbChzdG9yZSwgbmV3IEhhbmRsZXJSZWdpc3RyeUltcGwoc3RvcmUpKTtcbiAgdmFyIG1hbmFnZXIgPSBuZXcgRHJhZ0Ryb3BNYW5hZ2VySW1wbChzdG9yZSwgbW9uaXRvcik7XG4gIHZhciBiYWNrZW5kID0gYmFja2VuZEZhY3RvcnkobWFuYWdlciwgZ2xvYmFsQ29udGV4dCwgYmFja2VuZE9wdGlvbnMpO1xuICBtYW5hZ2VyLnJlY2VpdmVCYWNrZW5kKGJhY2tlbmQpO1xuICByZXR1cm4gbWFuYWdlcjtcbn1cblxuZnVuY3Rpb24gbWFrZVN0b3JlSW5zdGFuY2UoZGVidWdNb2RlKSB7XG4gIC8vIFRPRE86IGlmIHdlIGV2ZXIgbWFrZSBhIHJlYWN0LW5hdGl2ZSB2ZXJzaW9uIG9mIHRoaXMsXG4gIC8vIHdlJ2xsIG5lZWQgdG8gY29uc2lkZXIgaG93IHRvIHB1bGwgb2ZmIGRldi10b29saW5nXG4gIHZhciByZWR1eERldlRvb2xzID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX187XG4gIHJldHVybiBjcmVhdGVTdG9yZShyZWR1Y2UsIGRlYnVnTW9kZSAmJiByZWR1eERldlRvb2xzICYmIHJlZHV4RGV2VG9vbHMoe1xuICAgIG5hbWU6ICdkbmQtY29yZScsXG4gICAgaW5zdGFuY2VJZDogJ2RuZC1jb3JlJ1xuICB9KSk7XG59IiwidmFyIF9leGNsdWRlZCA9IFtcImNoaWxkcmVuXCJdO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyB2YXIgX2kgPSBhcnIgPT0gbnVsbCA/IG51bGwgOiB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGFycltTeW1ib2wuaXRlcmF0b3JdIHx8IGFycltcIkBAaXRlcmF0b3JcIl07IGlmIChfaSA9PSBudWxsKSByZXR1cm47IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX3MsIF9lOyB0cnkgeyBmb3IgKF9pID0gX2kuY2FsbChhcnIpOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllcyhzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCk7IHZhciBrZXksIGk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzb3VyY2VTeW1ib2xLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2UpOyBmb3IgKGkgPSAwOyBpIDwgc291cmNlU3ltYm9sS2V5cy5sZW5ndGg7IGkrKykgeyBrZXkgPSBzb3VyY2VTeW1ib2xLZXlzW2ldOyBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlOyBpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzb3VyY2UsIGtleSkpIGNvbnRpbnVlOyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gcmV0dXJuIHRhcmdldDsgfVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7IGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9OyB2YXIgdGFyZ2V0ID0ge307IHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTsgdmFyIGtleSwgaTsgZm9yIChpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspIHsga2V5ID0gc291cmNlS2V5c1tpXTsgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSByZXR1cm4gdGFyZ2V0OyB9XG5cbmltcG9ydCB7IGpzeCBhcyBfanN4IH0gZnJvbSBcInJlYWN0L2pzeC1ydW50aW1lXCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIG1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjcmVhdGVEcmFnRHJvcE1hbmFnZXIgfSBmcm9tICdkbmQtY29yZSc7XG5pbXBvcnQgeyBEbmRDb250ZXh0IH0gZnJvbSAnLi9EbmRDb250ZXh0JztcbnZhciByZWZDb3VudCA9IDA7XG52YXIgSU5TVEFOQ0VfU1lNID0gU3ltYm9sLmZvcignX19SRUFDVF9ETkRfQ09OVEVYVF9JTlNUQU5DRV9fJyk7XG4vKipcbiAqIEEgUmVhY3QgY29tcG9uZW50IHRoYXQgcHJvdmlkZXMgdGhlIFJlYWN0LURuRCBjb250ZXh0XG4gKi9cblxuZXhwb3J0IHZhciBEbmRQcm92aWRlciA9IG1lbW8oZnVuY3Rpb24gRG5kUHJvdmlkZXIoX3JlZikge1xuICB2YXIgY2hpbGRyZW4gPSBfcmVmLmNoaWxkcmVuLFxuICAgICAgcHJvcHMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMoX3JlZiwgX2V4Y2x1ZGVkKTtcblxuICB2YXIgX2dldERuZENvbnRleHRWYWx1ZSA9IGdldERuZENvbnRleHRWYWx1ZShwcm9wcyksXG4gICAgICBfZ2V0RG5kQ29udGV4dFZhbHVlMiA9IF9zbGljZWRUb0FycmF5KF9nZXREbmRDb250ZXh0VmFsdWUsIDIpLFxuICAgICAgbWFuYWdlciA9IF9nZXREbmRDb250ZXh0VmFsdWUyWzBdLFxuICAgICAgaXNHbG9iYWxJbnN0YW5jZSA9IF9nZXREbmRDb250ZXh0VmFsdWUyWzFdOyAvLyBtZW1vaXplZCBmcm9tIHByb3BzXG5cbiAgLyoqXG4gICAqIElmIHRoZSBnbG9iYWwgY29udGV4dCB3YXMgdXNlZCB0byBzdG9yZSB0aGUgRE5EIGNvbnRleHRcbiAgICogdGhlbiB3aGVyZSB0aGVyZXMgbm8gbW9yZSByZWZlcmVuY2VzIHRvIGl0IHdlIHNob3VsZFxuICAgKiBjbGVhbiBpdCB1cCB0byBhdm9pZCBtZW1vcnkgbGVha3NcbiAgICovXG5cblxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmIChpc0dsb2JhbEluc3RhbmNlKSB7XG4gICAgICB2YXIgY29udGV4dCA9IGdldEdsb2JhbENvbnRleHQoKTtcbiAgICAgICsrcmVmQ291bnQ7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoLS1yZWZDb3VudCA9PT0gMCkge1xuICAgICAgICAgIGNvbnRleHRbSU5TVEFOQ0VfU1lNXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9LCBbXSk7XG4gIHJldHVybiBfanN4KERuZENvbnRleHQuUHJvdmlkZXIsIE9iamVjdC5hc3NpZ24oe1xuICAgIHZhbHVlOiBtYW5hZ2VyXG4gIH0sIHtcbiAgICBjaGlsZHJlbjogY2hpbGRyZW5cbiAgfSksIHZvaWQgMCk7XG59KTtcblxuZnVuY3Rpb24gZ2V0RG5kQ29udGV4dFZhbHVlKHByb3BzKSB7XG4gIGlmICgnbWFuYWdlcicgaW4gcHJvcHMpIHtcbiAgICB2YXIgX21hbmFnZXIgPSB7XG4gICAgICBkcmFnRHJvcE1hbmFnZXI6IHByb3BzLm1hbmFnZXJcbiAgICB9O1xuICAgIHJldHVybiBbX21hbmFnZXIsIGZhbHNlXTtcbiAgfVxuXG4gIHZhciBtYW5hZ2VyID0gY3JlYXRlU2luZ2xldG9uRG5kQ29udGV4dChwcm9wcy5iYWNrZW5kLCBwcm9wcy5jb250ZXh0LCBwcm9wcy5vcHRpb25zLCBwcm9wcy5kZWJ1Z01vZGUpO1xuICB2YXIgaXNHbG9iYWxJbnN0YW5jZSA9ICFwcm9wcy5jb250ZXh0O1xuICByZXR1cm4gW21hbmFnZXIsIGlzR2xvYmFsSW5zdGFuY2VdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTaW5nbGV0b25EbmRDb250ZXh0KGJhY2tlbmQpIHtcbiAgdmFyIGNvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGdldEdsb2JhbENvbnRleHQoKTtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgdmFyIGRlYnVnTW9kZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAzID8gYXJndW1lbnRzWzNdIDogdW5kZWZpbmVkO1xuICB2YXIgY3R4ID0gY29udGV4dDtcblxuICBpZiAoIWN0eFtJTlNUQU5DRV9TWU1dKSB7XG4gICAgY3R4W0lOU1RBTkNFX1NZTV0gPSB7XG4gICAgICBkcmFnRHJvcE1hbmFnZXI6IGNyZWF0ZURyYWdEcm9wTWFuYWdlcihiYWNrZW5kLCBjb250ZXh0LCBvcHRpb25zLCBkZWJ1Z01vZGUpXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBjdHhbSU5TVEFOQ0VfU1lNXTtcbn1cblxuZnVuY3Rpb24gZ2V0R2xvYmFsQ29udGV4dCgpIHtcbiAgcmV0dXJuIHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93O1xufSIsImltcG9ydCB7IHVzZUVmZmVjdCwgbWVtbyB9IGZyb20gJ3JlYWN0Jztcbi8qKlxuICogQSB1dGlsaXR5IGZvciByZW5kZXJpbmcgYSBkcmFnIHByZXZpZXcgaW1hZ2VcbiAqL1xuXG5leHBvcnQgdmFyIERyYWdQcmV2aWV3SW1hZ2UgPSBtZW1vKGZ1bmN0aW9uIERyYWdQcmV2aWV3SW1hZ2UoX3JlZikge1xuICB2YXIgY29ubmVjdCA9IF9yZWYuY29ubmVjdCxcbiAgICAgIHNyYyA9IF9yZWYuc3JjO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgSW1hZ2UgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgdmFyIGNvbm5lY3RlZCA9IGZhbHNlO1xuICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcuc3JjID0gc3JjO1xuXG4gICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbm5lY3QoaW1nKTtcbiAgICAgIGNvbm5lY3RlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoY29ubmVjdGVkKSB7XG4gICAgICAgIGNvbm5lY3QobnVsbCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBudWxsO1xufSk7IiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5pbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICdAcmVhY3QtZG5kL2ludmFyaWFudCc7XG52YXIgaXNDYWxsaW5nQ2FuRHJhZyA9IGZhbHNlO1xudmFyIGlzQ2FsbGluZ0lzRHJhZ2dpbmcgPSBmYWxzZTtcbmV4cG9ydCB2YXIgRHJhZ1NvdXJjZU1vbml0b3JJbXBsID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRHJhZ1NvdXJjZU1vbml0b3JJbXBsKG1hbmFnZXIpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRHJhZ1NvdXJjZU1vbml0b3JJbXBsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImludGVybmFsTW9uaXRvclwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwic291cmNlSWRcIiwgbnVsbCk7XG5cbiAgICB0aGlzLmludGVybmFsTW9uaXRvciA9IG1hbmFnZXIuZ2V0TW9uaXRvcigpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKERyYWdTb3VyY2VNb25pdG9ySW1wbCwgW3tcbiAgICBrZXk6IFwicmVjZWl2ZUhhbmRsZXJJZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWNlaXZlSGFuZGxlcklkKHNvdXJjZUlkKSB7XG4gICAgICB0aGlzLnNvdXJjZUlkID0gc291cmNlSWQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldEhhbmRsZXJJZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRIYW5kbGVySWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VJZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2FuRHJhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5EcmFnKCkge1xuICAgICAgaW52YXJpYW50KCFpc0NhbGxpbmdDYW5EcmFnLCAnWW91IG1heSBub3QgY2FsbCBtb25pdG9yLmNhbkRyYWcoKSBpbnNpZGUgeW91ciBjYW5EcmFnKCkgaW1wbGVtZW50YXRpb24uICcgKyAnUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvZHJhZy1zb3VyY2UtbW9uaXRvcicpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpc0NhbGxpbmdDYW5EcmFnID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLmNhbkRyYWdTb3VyY2UodGhpcy5zb3VyY2VJZCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpc0NhbGxpbmdDYW5EcmFnID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImlzRHJhZ2dpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaXNEcmFnZ2luZygpIHtcbiAgICAgIGlmICghdGhpcy5zb3VyY2VJZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGludmFyaWFudCghaXNDYWxsaW5nSXNEcmFnZ2luZywgJ1lvdSBtYXkgbm90IGNhbGwgbW9uaXRvci5pc0RyYWdnaW5nKCkgaW5zaWRlIHlvdXIgaXNEcmFnZ2luZygpIGltcGxlbWVudGF0aW9uLiAnICsgJ1JlYWQgbW9yZTogaHR0cDovL3JlYWN0LWRuZC5naXRodWIuaW8vcmVhY3QtZG5kL2RvY3MvYXBpL2RyYWctc291cmNlLW1vbml0b3InKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaXNDYWxsaW5nSXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsTW9uaXRvci5pc0RyYWdnaW5nU291cmNlKHRoaXMuc291cmNlSWQpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaXNDYWxsaW5nSXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdWJzY3JpYmVUb1N0YXRlQ2hhbmdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN1YnNjcmliZVRvU3RhdGVDaGFuZ2UobGlzdGVuZXIsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsTW9uaXRvci5zdWJzY3JpYmVUb1N0YXRlQ2hhbmdlKGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaXNEcmFnZ2luZ1NvdXJjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc0RyYWdnaW5nU291cmNlKHNvdXJjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuaXNEcmFnZ2luZ1NvdXJjZShzb3VyY2VJZCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImlzT3ZlclRhcmdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc092ZXJUYXJnZXQodGFyZ2V0SWQsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsTW9uaXRvci5pc092ZXJUYXJnZXQodGFyZ2V0SWQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRUYXJnZXRJZHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VGFyZ2V0SWRzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLmdldFRhcmdldElkcygpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc1NvdXJjZVB1YmxpY1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc1NvdXJjZVB1YmxpYygpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsTW9uaXRvci5pc1NvdXJjZVB1YmxpYygpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRTb3VyY2VJZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTb3VyY2VJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsTW9uaXRvci5nZXRTb3VyY2VJZCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdWJzY3JpYmVUb09mZnNldENoYW5nZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdWJzY3JpYmVUb09mZnNldENoYW5nZShsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLnN1YnNjcmliZVRvT2Zmc2V0Q2hhbmdlKGxpc3RlbmVyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2FuRHJhZ1NvdXJjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5EcmFnU291cmNlKHNvdXJjZUlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuY2FuRHJhZ1NvdXJjZShzb3VyY2VJZCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNhbkRyb3BPblRhcmdldFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5Ecm9wT25UYXJnZXQodGFyZ2V0SWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsTW9uaXRvci5jYW5Ecm9wT25UYXJnZXQodGFyZ2V0SWQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJdGVtVHlwZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRJdGVtVHlwZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsTW9uaXRvci5nZXRJdGVtVHlwZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJdGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEl0ZW0oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZ2V0SXRlbSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXREcm9wUmVzdWx0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldERyb3BSZXN1bHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZ2V0RHJvcFJlc3VsdCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaWREcm9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpZERyb3AoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZGlkRHJvcCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJbml0aWFsQ2xpZW50T2Zmc2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEluaXRpYWxDbGllbnRPZmZzZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZ2V0SW5pdGlhbENsaWVudE9mZnNldCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJbml0aWFsU291cmNlQ2xpZW50T2Zmc2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEluaXRpYWxTb3VyY2VDbGllbnRPZmZzZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZ2V0SW5pdGlhbFNvdXJjZUNsaWVudE9mZnNldCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRTb3VyY2VDbGllbnRPZmZzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U291cmNlQ2xpZW50T2Zmc2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLmdldFNvdXJjZUNsaWVudE9mZnNldCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRDbGllbnRPZmZzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q2xpZW50T2Zmc2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLmdldENsaWVudE9mZnNldCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXREaWZmZXJlbmNlRnJvbUluaXRpYWxPZmZzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RGlmZmVyZW5jZUZyb21Jbml0aWFsT2Zmc2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLmdldERpZmZlcmVuY2VGcm9tSW5pdGlhbE9mZnNldCgpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEcmFnU291cmNlTW9uaXRvckltcGw7XG59KCk7IiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5pbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICdAcmVhY3QtZG5kL2ludmFyaWFudCc7XG52YXIgaXNDYWxsaW5nQ2FuRHJvcCA9IGZhbHNlO1xuZXhwb3J0IHZhciBEcm9wVGFyZ2V0TW9uaXRvckltcGwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEcm9wVGFyZ2V0TW9uaXRvckltcGwobWFuYWdlcikge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEcm9wVGFyZ2V0TW9uaXRvckltcGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaW50ZXJuYWxNb25pdG9yXCIsIHZvaWQgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJ0YXJnZXRJZFwiLCBudWxsKTtcblxuICAgIHRoaXMuaW50ZXJuYWxNb25pdG9yID0gbWFuYWdlci5nZXRNb25pdG9yKCk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoRHJvcFRhcmdldE1vbml0b3JJbXBsLCBbe1xuICAgIGtleTogXCJyZWNlaXZlSGFuZGxlcklkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlY2VpdmVIYW5kbGVySWQodGFyZ2V0SWQpIHtcbiAgICAgIHRoaXMudGFyZ2V0SWQgPSB0YXJnZXRJZDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0SGFuZGxlcklkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEhhbmRsZXJJZCgpIHtcbiAgICAgIHJldHVybiB0aGlzLnRhcmdldElkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzdWJzY3JpYmVUb1N0YXRlQ2hhbmdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN1YnNjcmliZVRvU3RhdGVDaGFuZ2UobGlzdGVuZXIsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsTW9uaXRvci5zdWJzY3JpYmVUb1N0YXRlQ2hhbmdlKGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2FuRHJvcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5Ecm9wKCkge1xuICAgICAgLy8gQ3V0IG91dCBlYXJseSBpZiB0aGUgdGFyZ2V0IGlkIGhhcyBub3QgYmVlbiBzZXQuIFRoaXMgc2hvdWxkIHByZXZlbnQgZXJyb3JzXG4gICAgICAvLyB3aGVyZSB0aGUgdXNlciBoYXMgYW4gb2xkZXIgdmVyc2lvbiBvZiBkbmQtY29yZSBsaWtlIGluXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcmVhY3QtZG5kL3JlYWN0LWRuZC9pc3N1ZXMvMTMxMFxuICAgICAgaWYgKCF0aGlzLnRhcmdldElkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaW52YXJpYW50KCFpc0NhbGxpbmdDYW5Ecm9wLCAnWW91IG1heSBub3QgY2FsbCBtb25pdG9yLmNhbkRyb3AoKSBpbnNpZGUgeW91ciBjYW5Ecm9wKCkgaW1wbGVtZW50YXRpb24uICcgKyAnUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvZHJvcC10YXJnZXQtbW9uaXRvcicpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpc0NhbGxpbmdDYW5Ecm9wID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLmNhbkRyb3BPblRhcmdldCh0aGlzLnRhcmdldElkKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlzQ2FsbGluZ0NhbkRyb3AgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaXNPdmVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzT3ZlcihvcHRpb25zKSB7XG4gICAgICBpZiAoIXRoaXMudGFyZ2V0SWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuaXNPdmVyVGFyZ2V0KHRoaXMudGFyZ2V0SWQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJdGVtVHlwZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRJdGVtVHlwZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsTW9uaXRvci5nZXRJdGVtVHlwZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJdGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEl0ZW0oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZ2V0SXRlbSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXREcm9wUmVzdWx0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldERyb3BSZXN1bHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZ2V0RHJvcFJlc3VsdCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaWREcm9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpZERyb3AoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZGlkRHJvcCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJbml0aWFsQ2xpZW50T2Zmc2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEluaXRpYWxDbGllbnRPZmZzZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZ2V0SW5pdGlhbENsaWVudE9mZnNldCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRJbml0aWFsU291cmNlQ2xpZW50T2Zmc2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEluaXRpYWxTb3VyY2VDbGllbnRPZmZzZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbE1vbml0b3IuZ2V0SW5pdGlhbFNvdXJjZUNsaWVudE9mZnNldCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRTb3VyY2VDbGllbnRPZmZzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U291cmNlQ2xpZW50T2Zmc2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLmdldFNvdXJjZUNsaWVudE9mZnNldCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRDbGllbnRPZmZzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Q2xpZW50T2Zmc2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLmdldENsaWVudE9mZnNldCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXREaWZmZXJlbmNlRnJvbUluaXRpYWxPZmZzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RGlmZmVyZW5jZUZyb21Jbml0aWFsT2Zmc2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxNb25pdG9yLmdldERpZmZlcmVuY2VGcm9tSW5pdGlhbE9mZnNldCgpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEcm9wVGFyZ2V0TW9uaXRvckltcGw7XG59KCk7IiwiaW1wb3J0IHsgaW52YXJpYW50IH0gZnJvbSAnQHJlYWN0LWRuZC9pbnZhcmlhbnQnO1xuaW1wb3J0IHsgY2xvbmVFbGVtZW50LCBpc1ZhbGlkRWxlbWVudCB9IGZyb20gJ3JlYWN0JztcblxuZnVuY3Rpb24gdGhyb3dJZkNvbXBvc2l0ZUNvbXBvbmVudEVsZW1lbnQoZWxlbWVudCkge1xuICAvLyBDdXN0b20gY29tcG9uZW50cyBjYW4gbm8gbG9uZ2VyIGJlIHdyYXBwZWQgZGlyZWN0bHkgaW4gUmVhY3QgRG5EIDIuMFxuICAvLyBzbyB0aGF0IHdlIGRvbid0IG5lZWQgdG8gZGVwZW5kIG9uIGZpbmRET01Ob2RlKCkgZnJvbSByZWFjdC1kb20uXG4gIGlmICh0eXBlb2YgZWxlbWVudC50eXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBkaXNwbGF5TmFtZSA9IGVsZW1lbnQudHlwZS5kaXNwbGF5TmFtZSB8fCBlbGVtZW50LnR5cGUubmFtZSB8fCAndGhlIGNvbXBvbmVudCc7XG4gIHRocm93IG5ldyBFcnJvcignT25seSBuYXRpdmUgZWxlbWVudCBub2RlcyBjYW4gbm93IGJlIHBhc3NlZCB0byBSZWFjdCBEbkQgY29ubmVjdG9ycy4nICsgXCJZb3UgY2FuIGVpdGhlciB3cmFwIFwiLmNvbmNhdChkaXNwbGF5TmFtZSwgXCIgaW50byBhIDxkaXY+LCBvciB0dXJuIGl0IGludG8gYSBcIikgKyAnZHJhZyBzb3VyY2Ugb3IgYSBkcm9wIHRhcmdldCBpdHNlbGYuJyk7XG59XG5cbmZ1bmN0aW9uIHdyYXBIb29rVG9SZWNvZ25pemVFbGVtZW50KGhvb2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWxlbWVudE9yTm9kZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbnVsbDtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbnVsbDtcblxuICAgIC8vIFdoZW4gcGFzc2VkIGEgbm9kZSwgY2FsbCB0aGUgaG9vayBzdHJhaWdodCBhd2F5LlxuICAgIGlmICghaXNWYWxpZEVsZW1lbnQoZWxlbWVudE9yTm9kZSkpIHtcbiAgICAgIHZhciBub2RlID0gZWxlbWVudE9yTm9kZTtcbiAgICAgIGhvb2sobm9kZSwgb3B0aW9ucyk7IC8vIHJldHVybiB0aGUgbm9kZSBzbyBpdCBjYW4gYmUgY2hhaW5lZCAoZS5nLiB3aGVuIHdpdGhpbiBjYWxsYmFjayByZWZzXG4gICAgICAvLyA8ZGl2IHJlZj17bm9kZSA9PiBjb25uZWN0RHJhZ1NvdXJjZShjb25uZWN0RHJvcFRhcmdldChub2RlKSl9Lz5cblxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSAvLyBJZiBwYXNzZWQgYSBSZWFjdEVsZW1lbnQsIGNsb25lIGl0IGFuZCBhdHRhY2ggdGhpcyBmdW5jdGlvbiBhcyBhIHJlZi5cbiAgICAvLyBUaGlzIGhlbHBzIHVzIGFjaGlldmUgYSBuZWF0IEFQSSB3aGVyZSB1c2VyIGRvZXNuJ3QgZXZlbiBrbm93IHRoYXQgcmVmc1xuICAgIC8vIGFyZSBiZWluZyB1c2VkIHVuZGVyIHRoZSBob29kLlxuXG5cbiAgICB2YXIgZWxlbWVudCA9IGVsZW1lbnRPck5vZGU7XG4gICAgdGhyb3dJZkNvbXBvc2l0ZUNvbXBvbmVudEVsZW1lbnQoZWxlbWVudCk7IC8vIFdoZW4gbm8gb3B0aW9ucyBhcmUgcGFzc2VkLCB1c2UgdGhlIGhvb2sgZGlyZWN0bHlcblxuICAgIHZhciByZWYgPSBvcHRpb25zID8gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIHJldHVybiBob29rKG5vZGUsIG9wdGlvbnMpO1xuICAgIH0gOiBob29rO1xuICAgIHJldHVybiBjbG9uZVdpdGhSZWYoZWxlbWVudCwgcmVmKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBDb25uZWN0b3JIb29rcyhob29rcykge1xuICB2YXIgd3JhcHBlZEhvb2tzID0ge307XG4gIE9iamVjdC5rZXlzKGhvb2tzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgaG9vayA9IGhvb2tzW2tleV07IC8vIHJlZiBvYmplY3RzIHNob3VsZCBiZSBwYXNzZWQgc3RyYWlnaHQgdGhyb3VnaCB3aXRob3V0IHdyYXBwaW5nXG5cbiAgICBpZiAoa2V5LmVuZHNXaXRoKCdSZWYnKSkge1xuICAgICAgd3JhcHBlZEhvb2tzW2tleV0gPSBob29rc1trZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgd3JhcHBlZEhvb2sgPSB3cmFwSG9va1RvUmVjb2duaXplRWxlbWVudChob29rKTtcblxuICAgICAgd3JhcHBlZEhvb2tzW2tleV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB3cmFwcGVkSG9vaztcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHdyYXBwZWRIb29rcztcbn1cblxuZnVuY3Rpb24gc2V0UmVmKHJlZiwgbm9kZSkge1xuICBpZiAodHlwZW9mIHJlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJlZihub2RlKTtcbiAgfSBlbHNlIHtcbiAgICByZWYuY3VycmVudCA9IG5vZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xvbmVXaXRoUmVmKGVsZW1lbnQsIG5ld1JlZikge1xuICB2YXIgcHJldmlvdXNSZWYgPSBlbGVtZW50LnJlZjtcbiAgaW52YXJpYW50KHR5cGVvZiBwcmV2aW91c1JlZiAhPT0gJ3N0cmluZycsICdDYW5ub3QgY29ubmVjdCBSZWFjdCBEbkQgdG8gYW4gZWxlbWVudCB3aXRoIGFuIGV4aXN0aW5nIHN0cmluZyByZWYuICcgKyAnUGxlYXNlIGNvbnZlcnQgaXQgdG8gdXNlIGEgY2FsbGJhY2sgcmVmIGluc3RlYWQsIG9yIHdyYXAgaXQgaW50byBhIDxzcGFuPiBvciA8ZGl2Pi4gJyArICdSZWFkIG1vcmU6IGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWZzLWFuZC10aGUtZG9tLmh0bWwjY2FsbGJhY2stcmVmcycpO1xuXG4gIGlmICghcHJldmlvdXNSZWYpIHtcbiAgICAvLyBXaGVuIHRoZXJlIGlzIG5vIHJlZiBvbiB0aGUgZWxlbWVudCwgdXNlIHRoZSBuZXcgcmVmIGRpcmVjdGx5XG4gICAgcmV0dXJuIGNsb25lRWxlbWVudChlbGVtZW50LCB7XG4gICAgICByZWY6IG5ld1JlZlxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjbG9uZUVsZW1lbnQoZWxlbWVudCwge1xuICAgICAgcmVmOiBmdW5jdGlvbiByZWYobm9kZSkge1xuICAgICAgICBzZXRSZWYocHJldmlvdXNSZWYsIG5vZGUpO1xuICAgICAgICBzZXRSZWYobmV3UmVmLCBub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSIsImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVmKG9iaikge1xuICByZXR1cm4gKC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgICBvYmogIT09IG51bGwgJiYgX3R5cGVvZihvYmopID09PSAnb2JqZWN0JyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCAnY3VycmVudCcpXG4gICk7XG59IiwiZnVuY3Rpb24gc2hhbGxvd0VxdWFsKG9iakEsIG9iakIsIGNvbXBhcmUsIGNvbXBhcmVDb250ZXh0KSB7XG4gIHZhciBjb21wYXJlUmVzdWx0ID0gY29tcGFyZSA/IGNvbXBhcmUuY2FsbChjb21wYXJlQ29udGV4dCwgb2JqQSwgb2JqQikgOiB2b2lkIDA7XG5cbiAgaWYgKGNvbXBhcmVSZXN1bHQgIT09IHZvaWQgMCkge1xuICAgIHJldHVybiAhIWNvbXBhcmVSZXN1bHQ7XG4gIH1cblxuICBpZiAob2JqQSA9PT0gb2JqQikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmpBICE9PSAnb2JqZWN0JyB8fCAhb2JqQSB8fCB0eXBlb2Ygb2JqQiAhPT0gJ29iamVjdCcgfHwgIW9iakIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIga2V5c0EgPSBPYmplY3Qua2V5cyhvYmpBKTtcbiAgdmFyIGtleXNCID0gT2JqZWN0LmtleXMob2JqQik7XG5cbiAgaWYgKGtleXNBLmxlbmd0aCAhPT0ga2V5c0IubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGJIYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuYmluZChvYmpCKTsgLy8gVGVzdCBmb3IgQSdzIGtleXMgZGlmZmVyZW50IGZyb20gQi5cblxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBrZXlzQS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNBW2lkeF07XG5cbiAgICBpZiAoIWJIYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlQSA9IG9iakFba2V5XTtcbiAgICB2YXIgdmFsdWVCID0gb2JqQltrZXldO1xuICAgIGNvbXBhcmVSZXN1bHQgPSBjb21wYXJlID8gY29tcGFyZS5jYWxsKGNvbXBhcmVDb250ZXh0LCB2YWx1ZUEsIHZhbHVlQiwga2V5KSA6IHZvaWQgMDtcblxuICAgIGlmIChjb21wYXJlUmVzdWx0ID09PSBmYWxzZSB8fCBjb21wYXJlUmVzdWx0ID09PSB2b2lkIDAgJiYgdmFsdWVBICE9PSB2YWx1ZUIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IHsgc2hhbGxvd0VxdWFsIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaGFsbG93ZXF1YWwuZXNtLmpzLm1hcFxuIiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5pbXBvcnQgeyB3cmFwQ29ubmVjdG9ySG9va3MgfSBmcm9tICcuL3dyYXBDb25uZWN0b3JIb29rcyc7XG5pbXBvcnQgeyBpc1JlZiB9IGZyb20gJy4vaXNSZWYnO1xuaW1wb3J0IHsgc2hhbGxvd0VxdWFsIH0gZnJvbSAnQHJlYWN0LWRuZC9zaGFsbG93ZXF1YWwnO1xuZXhwb3J0IHZhciBTb3VyY2VDb25uZWN0b3IgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAvLyBUaGUgZHJvcCB0YXJnZXQgbWF5IGVpdGhlciBiZSBhdHRhY2hlZCB2aWEgcmVmIG9yIGNvbm5lY3QgZnVuY3Rpb25cbiAgLy8gVGhlIGRyYWcgcHJldmlldyBtYXkgZWl0aGVyIGJlIGF0dGFjaGVkIHZpYSByZWYgb3IgY29ubmVjdCBmdW5jdGlvblxuICBmdW5jdGlvbiBTb3VyY2VDb25uZWN0b3IoYmFja2VuZCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU291cmNlQ29ubmVjdG9yKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhvb2tzXCIsIHdyYXBDb25uZWN0b3JIb29rcyh7XG4gICAgICBkcmFnU291cmNlOiBmdW5jdGlvbiBkcmFnU291cmNlKG5vZGUsIG9wdGlvbnMpIHtcbiAgICAgICAgX3RoaXMuY2xlYXJEcmFnU291cmNlKCk7XG5cbiAgICAgICAgX3RoaXMuZHJhZ1NvdXJjZU9wdGlvbnMgPSBvcHRpb25zIHx8IG51bGw7XG5cbiAgICAgICAgaWYgKGlzUmVmKG5vZGUpKSB7XG4gICAgICAgICAgX3RoaXMuZHJhZ1NvdXJjZVJlZiA9IG5vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXMuZHJhZ1NvdXJjZU5vZGUgPSBub2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMucmVjb25uZWN0RHJhZ1NvdXJjZSgpO1xuICAgICAgfSxcbiAgICAgIGRyYWdQcmV2aWV3OiBmdW5jdGlvbiBkcmFnUHJldmlldyhub2RlLCBvcHRpb25zKSB7XG4gICAgICAgIF90aGlzLmNsZWFyRHJhZ1ByZXZpZXcoKTtcblxuICAgICAgICBfdGhpcy5kcmFnUHJldmlld09wdGlvbnMgPSBvcHRpb25zIHx8IG51bGw7XG5cbiAgICAgICAgaWYgKGlzUmVmKG5vZGUpKSB7XG4gICAgICAgICAgX3RoaXMuZHJhZ1ByZXZpZXdSZWYgPSBub2RlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLmRyYWdQcmV2aWV3Tm9kZSA9IG5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpcy5yZWNvbm5lY3REcmFnUHJldmlldygpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhhbmRsZXJJZFwiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRyYWdTb3VyY2VSZWZcIiwgbnVsbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkcmFnU291cmNlTm9kZVwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiZHJhZ1NvdXJjZU9wdGlvbnNJbnRlcm5hbFwiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRyYWdTb3VyY2VVbnN1YnNjcmliZVwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiZHJhZ1ByZXZpZXdSZWZcIiwgbnVsbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkcmFnUHJldmlld05vZGVcIiwgdm9pZCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRyYWdQcmV2aWV3T3B0aW9uc0ludGVybmFsXCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiZHJhZ1ByZXZpZXdVbnN1YnNjcmliZVwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibGFzdENvbm5lY3RlZEhhbmRsZXJJZFwiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImxhc3RDb25uZWN0ZWREcmFnU291cmNlXCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibGFzdENvbm5lY3RlZERyYWdTb3VyY2VPcHRpb25zXCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibGFzdENvbm5lY3RlZERyYWdQcmV2aWV3XCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibGFzdENvbm5lY3RlZERyYWdQcmV2aWV3T3B0aW9uc1wiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImJhY2tlbmRcIiwgdm9pZCAwKTtcblxuICAgIHRoaXMuYmFja2VuZCA9IGJhY2tlbmQ7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU291cmNlQ29ubmVjdG9yLCBbe1xuICAgIGtleTogXCJyZWNlaXZlSGFuZGxlcklkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlY2VpdmVIYW5kbGVySWQobmV3SGFuZGxlcklkKSB7XG4gICAgICBpZiAodGhpcy5oYW5kbGVySWQgPT09IG5ld0hhbmRsZXJJZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlcklkID0gbmV3SGFuZGxlcklkO1xuICAgICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29ubmVjdFRhcmdldFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZHJhZ1NvdXJjZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHJhZ1NvdXJjZU9wdGlvbnNcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRyYWdTb3VyY2VPcHRpb25zSW50ZXJuYWw7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldChvcHRpb25zKSB7XG4gICAgICB0aGlzLmRyYWdTb3VyY2VPcHRpb25zSW50ZXJuYWwgPSBvcHRpb25zO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkcmFnUHJldmlld09wdGlvbnNcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRyYWdQcmV2aWV3T3B0aW9uc0ludGVybmFsO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQob3B0aW9ucykge1xuICAgICAgdGhpcy5kcmFnUHJldmlld09wdGlvbnNJbnRlcm5hbCA9IG9wdGlvbnM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlY29ubmVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWNvbm5lY3QoKSB7XG4gICAgICB0aGlzLnJlY29ubmVjdERyYWdTb3VyY2UoKTtcbiAgICAgIHRoaXMucmVjb25uZWN0RHJhZ1ByZXZpZXcoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVjb25uZWN0RHJhZ1NvdXJjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWNvbm5lY3REcmFnU291cmNlKCkge1xuICAgICAgdmFyIGRyYWdTb3VyY2UgPSB0aGlzLmRyYWdTb3VyY2U7IC8vIGlmIG5vdGhpbmcgaGFzIGNoYW5nZWQgdGhlbiBkb24ndCByZXN1YnNjcmliZVxuXG4gICAgICB2YXIgZGlkQ2hhbmdlID0gdGhpcy5kaWRIYW5kbGVySWRDaGFuZ2UoKSB8fCB0aGlzLmRpZENvbm5lY3RlZERyYWdTb3VyY2VDaGFuZ2UoKSB8fCB0aGlzLmRpZERyYWdTb3VyY2VPcHRpb25zQ2hhbmdlKCk7XG5cbiAgICAgIGlmIChkaWRDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0RHJhZ1NvdXJjZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGFuZGxlcklkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkcmFnU291cmNlKSB7XG4gICAgICAgIHRoaXMubGFzdENvbm5lY3RlZERyYWdTb3VyY2UgPSBkcmFnU291cmNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChkaWRDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5sYXN0Q29ubmVjdGVkSGFuZGxlcklkID0gdGhpcy5oYW5kbGVySWQ7XG4gICAgICAgIHRoaXMubGFzdENvbm5lY3RlZERyYWdTb3VyY2UgPSBkcmFnU291cmNlO1xuICAgICAgICB0aGlzLmxhc3RDb25uZWN0ZWREcmFnU291cmNlT3B0aW9ucyA9IHRoaXMuZHJhZ1NvdXJjZU9wdGlvbnM7XG4gICAgICAgIHRoaXMuZHJhZ1NvdXJjZVVuc3Vic2NyaWJlID0gdGhpcy5iYWNrZW5kLmNvbm5lY3REcmFnU291cmNlKHRoaXMuaGFuZGxlcklkLCBkcmFnU291cmNlLCB0aGlzLmRyYWdTb3VyY2VPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVjb25uZWN0RHJhZ1ByZXZpZXdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVjb25uZWN0RHJhZ1ByZXZpZXcoKSB7XG4gICAgICB2YXIgZHJhZ1ByZXZpZXcgPSB0aGlzLmRyYWdQcmV2aWV3OyAvLyBpZiBub3RoaW5nIGhhcyBjaGFuZ2VkIHRoZW4gZG9uJ3QgcmVzdWJzY3JpYmVcblxuICAgICAgdmFyIGRpZENoYW5nZSA9IHRoaXMuZGlkSGFuZGxlcklkQ2hhbmdlKCkgfHwgdGhpcy5kaWRDb25uZWN0ZWREcmFnUHJldmlld0NoYW5nZSgpIHx8IHRoaXMuZGlkRHJhZ1ByZXZpZXdPcHRpb25zQ2hhbmdlKCk7XG5cbiAgICAgIGlmIChkaWRDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0RHJhZ1ByZXZpZXcoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmhhbmRsZXJJZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghZHJhZ1ByZXZpZXcpIHtcbiAgICAgICAgdGhpcy5sYXN0Q29ubmVjdGVkRHJhZ1ByZXZpZXcgPSBkcmFnUHJldmlldztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGlkQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMubGFzdENvbm5lY3RlZEhhbmRsZXJJZCA9IHRoaXMuaGFuZGxlcklkO1xuICAgICAgICB0aGlzLmxhc3RDb25uZWN0ZWREcmFnUHJldmlldyA9IGRyYWdQcmV2aWV3O1xuICAgICAgICB0aGlzLmxhc3RDb25uZWN0ZWREcmFnUHJldmlld09wdGlvbnMgPSB0aGlzLmRyYWdQcmV2aWV3T3B0aW9ucztcbiAgICAgICAgdGhpcy5kcmFnUHJldmlld1Vuc3Vic2NyaWJlID0gdGhpcy5iYWNrZW5kLmNvbm5lY3REcmFnUHJldmlldyh0aGlzLmhhbmRsZXJJZCwgZHJhZ1ByZXZpZXcsIHRoaXMuZHJhZ1ByZXZpZXdPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlkSGFuZGxlcklkQ2hhbmdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpZEhhbmRsZXJJZENoYW5nZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmxhc3RDb25uZWN0ZWRIYW5kbGVySWQgIT09IHRoaXMuaGFuZGxlcklkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaWRDb25uZWN0ZWREcmFnU291cmNlQ2hhbmdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpZENvbm5lY3RlZERyYWdTb3VyY2VDaGFuZ2UoKSB7XG4gICAgICByZXR1cm4gdGhpcy5sYXN0Q29ubmVjdGVkRHJhZ1NvdXJjZSAhPT0gdGhpcy5kcmFnU291cmNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaWRDb25uZWN0ZWREcmFnUHJldmlld0NoYW5nZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaWRDb25uZWN0ZWREcmFnUHJldmlld0NoYW5nZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmxhc3RDb25uZWN0ZWREcmFnUHJldmlldyAhPT0gdGhpcy5kcmFnUHJldmlldztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlkRHJhZ1NvdXJjZU9wdGlvbnNDaGFuZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlkRHJhZ1NvdXJjZU9wdGlvbnNDaGFuZ2UoKSB7XG4gICAgICByZXR1cm4gIXNoYWxsb3dFcXVhbCh0aGlzLmxhc3RDb25uZWN0ZWREcmFnU291cmNlT3B0aW9ucywgdGhpcy5kcmFnU291cmNlT3B0aW9ucyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRpZERyYWdQcmV2aWV3T3B0aW9uc0NoYW5nZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaWREcmFnUHJldmlld09wdGlvbnNDaGFuZ2UoKSB7XG4gICAgICByZXR1cm4gIXNoYWxsb3dFcXVhbCh0aGlzLmxhc3RDb25uZWN0ZWREcmFnUHJldmlld09wdGlvbnMsIHRoaXMuZHJhZ1ByZXZpZXdPcHRpb25zKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzY29ubmVjdERyYWdTb3VyY2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzY29ubmVjdERyYWdTb3VyY2UoKSB7XG4gICAgICBpZiAodGhpcy5kcmFnU291cmNlVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgdGhpcy5kcmFnU291cmNlVW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5kcmFnU291cmNlVW5zdWJzY3JpYmUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRpc2Nvbm5lY3REcmFnUHJldmlld1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0RHJhZ1ByZXZpZXcoKSB7XG4gICAgICBpZiAodGhpcy5kcmFnUHJldmlld1Vuc3Vic2NyaWJlKSB7XG4gICAgICAgIHRoaXMuZHJhZ1ByZXZpZXdVbnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLmRyYWdQcmV2aWV3VW5zdWJzY3JpYmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZHJhZ1ByZXZpZXdOb2RlID0gbnVsbDtcbiAgICAgICAgdGhpcy5kcmFnUHJldmlld1JlZiA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRyYWdTb3VyY2VcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRyYWdTb3VyY2VOb2RlIHx8IHRoaXMuZHJhZ1NvdXJjZVJlZiAmJiB0aGlzLmRyYWdTb3VyY2VSZWYuY3VycmVudDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHJhZ1ByZXZpZXdcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRyYWdQcmV2aWV3Tm9kZSB8fCB0aGlzLmRyYWdQcmV2aWV3UmVmICYmIHRoaXMuZHJhZ1ByZXZpZXdSZWYuY3VycmVudDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJEcmFnU291cmNlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyRHJhZ1NvdXJjZSgpIHtcbiAgICAgIHRoaXMuZHJhZ1NvdXJjZU5vZGUgPSBudWxsO1xuICAgICAgdGhpcy5kcmFnU291cmNlUmVmID0gbnVsbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJEcmFnUHJldmlld1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhckRyYWdQcmV2aWV3KCkge1xuICAgICAgdGhpcy5kcmFnUHJldmlld05vZGUgPSBudWxsO1xuICAgICAgdGhpcy5kcmFnUHJldmlld1JlZiA9IG51bGw7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNvdXJjZUNvbm5lY3Rvcjtcbn0oKTsiLCJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmltcG9ydCB7IHNoYWxsb3dFcXVhbCB9IGZyb20gJ0ByZWFjdC1kbmQvc2hhbGxvd2VxdWFsJztcbmltcG9ydCB7IHdyYXBDb25uZWN0b3JIb29rcyB9IGZyb20gJy4vd3JhcENvbm5lY3Rvckhvb2tzJztcbmltcG9ydCB7IGlzUmVmIH0gZnJvbSAnLi9pc1JlZic7XG5leHBvcnQgdmFyIFRhcmdldENvbm5lY3RvciA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIC8vIFRoZSBkcm9wIHRhcmdldCBtYXkgZWl0aGVyIGJlIGF0dGFjaGVkIHZpYSByZWYgb3IgY29ubmVjdCBmdW5jdGlvblxuICBmdW5jdGlvbiBUYXJnZXRDb25uZWN0b3IoYmFja2VuZCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgVGFyZ2V0Q29ubmVjdG9yKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhvb2tzXCIsIHdyYXBDb25uZWN0b3JIb29rcyh7XG4gICAgICBkcm9wVGFyZ2V0OiBmdW5jdGlvbiBkcm9wVGFyZ2V0KG5vZGUsIG9wdGlvbnMpIHtcbiAgICAgICAgX3RoaXMuY2xlYXJEcm9wVGFyZ2V0KCk7XG5cbiAgICAgICAgX3RoaXMuZHJvcFRhcmdldE9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgICAgIGlmIChpc1JlZihub2RlKSkge1xuICAgICAgICAgIF90aGlzLmRyb3BUYXJnZXRSZWYgPSBub2RlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLmRyb3BUYXJnZXROb2RlID0gbm9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLnJlY29ubmVjdCgpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhhbmRsZXJJZFwiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRyb3BUYXJnZXRSZWZcIiwgbnVsbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkcm9wVGFyZ2V0Tm9kZVwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiZHJvcFRhcmdldE9wdGlvbnNJbnRlcm5hbFwiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInVuc3Vic2NyaWJlRHJvcFRhcmdldFwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibGFzdENvbm5lY3RlZEhhbmRsZXJJZFwiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImxhc3RDb25uZWN0ZWREcm9wVGFyZ2V0XCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibGFzdENvbm5lY3RlZERyb3BUYXJnZXRPcHRpb25zXCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiYmFja2VuZFwiLCB2b2lkIDApO1xuXG4gICAgdGhpcy5iYWNrZW5kID0gYmFja2VuZDtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhUYXJnZXRDb25uZWN0b3IsIFt7XG4gICAga2V5OiBcImNvbm5lY3RUYXJnZXRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRyb3BUYXJnZXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlY29ubmVjdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWNvbm5lY3QoKSB7XG4gICAgICAvLyBpZiBub3RoaW5nIGhhcyBjaGFuZ2VkIHRoZW4gZG9uJ3QgcmVzdWJzY3JpYmVcbiAgICAgIHZhciBkaWRDaGFuZ2UgPSB0aGlzLmRpZEhhbmRsZXJJZENoYW5nZSgpIHx8IHRoaXMuZGlkRHJvcFRhcmdldENoYW5nZSgpIHx8IHRoaXMuZGlkT3B0aW9uc0NoYW5nZSgpO1xuXG4gICAgICBpZiAoZGlkQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdERyb3BUYXJnZXQoKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRyb3BUYXJnZXQgPSB0aGlzLmRyb3BUYXJnZXQ7XG5cbiAgICAgIGlmICghdGhpcy5oYW5kbGVySWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRyb3BUYXJnZXQpIHtcbiAgICAgICAgdGhpcy5sYXN0Q29ubmVjdGVkRHJvcFRhcmdldCA9IGRyb3BUYXJnZXQ7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpZENoYW5nZSkge1xuICAgICAgICB0aGlzLmxhc3RDb25uZWN0ZWRIYW5kbGVySWQgPSB0aGlzLmhhbmRsZXJJZDtcbiAgICAgICAgdGhpcy5sYXN0Q29ubmVjdGVkRHJvcFRhcmdldCA9IGRyb3BUYXJnZXQ7XG4gICAgICAgIHRoaXMubGFzdENvbm5lY3RlZERyb3BUYXJnZXRPcHRpb25zID0gdGhpcy5kcm9wVGFyZ2V0T3B0aW9ucztcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZURyb3BUYXJnZXQgPSB0aGlzLmJhY2tlbmQuY29ubmVjdERyb3BUYXJnZXQodGhpcy5oYW5kbGVySWQsIGRyb3BUYXJnZXQsIHRoaXMuZHJvcFRhcmdldE9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWNlaXZlSGFuZGxlcklkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlY2VpdmVIYW5kbGVySWQobmV3SGFuZGxlcklkKSB7XG4gICAgICBpZiAobmV3SGFuZGxlcklkID09PSB0aGlzLmhhbmRsZXJJZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGFuZGxlcklkID0gbmV3SGFuZGxlcklkO1xuICAgICAgdGhpcy5yZWNvbm5lY3QoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHJvcFRhcmdldE9wdGlvbnNcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRyb3BUYXJnZXRPcHRpb25zSW50ZXJuYWw7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldChvcHRpb25zKSB7XG4gICAgICB0aGlzLmRyb3BUYXJnZXRPcHRpb25zSW50ZXJuYWwgPSBvcHRpb25zO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkaWRIYW5kbGVySWRDaGFuZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlkSGFuZGxlcklkQ2hhbmdlKCkge1xuICAgICAgcmV0dXJuIHRoaXMubGFzdENvbm5lY3RlZEhhbmRsZXJJZCAhPT0gdGhpcy5oYW5kbGVySWQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRpZERyb3BUYXJnZXRDaGFuZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlkRHJvcFRhcmdldENoYW5nZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmxhc3RDb25uZWN0ZWREcm9wVGFyZ2V0ICE9PSB0aGlzLmRyb3BUYXJnZXQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRpZE9wdGlvbnNDaGFuZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlkT3B0aW9uc0NoYW5nZSgpIHtcbiAgICAgIHJldHVybiAhc2hhbGxvd0VxdWFsKHRoaXMubGFzdENvbm5lY3RlZERyb3BUYXJnZXRPcHRpb25zLCB0aGlzLmRyb3BUYXJnZXRPcHRpb25zKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGlzY29ubmVjdERyb3BUYXJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzY29ubmVjdERyb3BUYXJnZXQoKSB7XG4gICAgICBpZiAodGhpcy51bnN1YnNjcmliZURyb3BUYXJnZXQpIHtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZURyb3BUYXJnZXQoKTtcbiAgICAgICAgdGhpcy51bnN1YnNjcmliZURyb3BUYXJnZXQgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRyb3BUYXJnZXRcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRyb3BUYXJnZXROb2RlIHx8IHRoaXMuZHJvcFRhcmdldFJlZiAmJiB0aGlzLmRyb3BUYXJnZXRSZWYuY3VycmVudDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY2xlYXJEcm9wVGFyZ2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyRHJvcFRhcmdldCgpIHtcbiAgICAgIHRoaXMuZHJvcFRhcmdldFJlZiA9IG51bGw7XG4gICAgICB0aGlzLmRyb3BUYXJnZXROb2RlID0gbnVsbDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gVGFyZ2V0Q29ubmVjdG9yO1xufSgpOyIsImV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclRhcmdldCh0eXBlLCB0YXJnZXQsIG1hbmFnZXIpIHtcbiAgdmFyIHJlZ2lzdHJ5ID0gbWFuYWdlci5nZXRSZWdpc3RyeSgpO1xuICB2YXIgdGFyZ2V0SWQgPSByZWdpc3RyeS5hZGRUYXJnZXQodHlwZSwgdGFyZ2V0KTtcbiAgcmV0dXJuIFt0YXJnZXRJZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiByZWdpc3RyeS5yZW1vdmVUYXJnZXQodGFyZ2V0SWQpO1xuICB9XTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclNvdXJjZSh0eXBlLCBzb3VyY2UsIG1hbmFnZXIpIHtcbiAgdmFyIHJlZ2lzdHJ5ID0gbWFuYWdlci5nZXRSZWdpc3RyeSgpO1xuICB2YXIgc291cmNlSWQgPSByZWdpc3RyeS5hZGRTb3VyY2UodHlwZSwgc291cmNlKTtcbiAgcmV0dXJuIFtzb3VyY2VJZCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiByZWdpc3RyeS5yZW1vdmVTb3VyY2Uoc291cmNlSWQpO1xuICB9XTtcbn0iLCJmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWNvcmF0ZWRDb21wb25lbnQoaW5zdGFuY2VSZWYpIHtcbiAgdmFyIGN1cnJlbnRSZWYgPSBpbnN0YW5jZVJlZi5jdXJyZW50O1xuXG4gIGlmIChjdXJyZW50UmVmID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIGlmIChjdXJyZW50UmVmLmRlY29yYXRlZFJlZikge1xuICAgIC8vIGdvIHRocm91Z2ggdGhlIHByaXZhdGUgZmllbGQgaW4gZGVjb3JhdGVIYW5kbGVyIHRvIGF2b2lkIHRoZSBpbnZhcmlhbnQgaGl0XG4gICAgcmV0dXJuIGN1cnJlbnRSZWYuZGVjb3JhdGVkUmVmLmN1cnJlbnQ7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGN1cnJlbnRSZWY7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0NsYXNzQ29tcG9uZW50KENvbXBvbmVudCkge1xuICByZXR1cm4gQ29tcG9uZW50ICYmIENvbXBvbmVudC5wcm90b3R5cGUgJiYgdHlwZW9mIENvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVmRm9yd2FyZGluZ0NvbXBvbmVudChDKSB7XG4gIHZhciBfaXRlbSQkJHR5cGVvZjtcblxuICB2YXIgaXRlbSA9IEM7XG4gIHJldHVybiAoaXRlbSA9PT0gbnVsbCB8fCBpdGVtID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX2l0ZW0kJCR0eXBlb2YgPSBpdGVtLiQkdHlwZW9mKSA9PT0gbnVsbCB8fCBfaXRlbSQkJHR5cGVvZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2l0ZW0kJCR0eXBlb2YudG9TdHJpbmcoKSkgPT09ICdTeW1ib2wocmVhY3QuZm9yd2FyZF9yZWYpJztcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1JlZmFibGUoQykge1xuICByZXR1cm4gaXNDbGFzc0NvbXBvbmVudChDKSB8fCBpc1JlZkZvcndhcmRpbmdDb21wb25lbnQoQyk7XG59XG5leHBvcnQgZnVuY3Rpb24gY2hlY2tEZWNvcmF0b3JBcmd1bWVudHMoZnVuY3Rpb25OYW1lLCBzaWduYXR1cmUpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IChhcmd1bWVudHMubGVuZ3RoIDw9IDIgPyAwIDogYXJndW1lbnRzLmxlbmd0aCAtIDIpOyBpKyspIHtcbiAgICAgIHZhciBhcmcgPSBpICsgMiA8IDIgfHwgYXJndW1lbnRzLmxlbmd0aCA8PSBpICsgMiA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1tpICsgMl07XG5cbiAgICAgIGlmIChhcmcgJiYgYXJnLnByb3RvdHlwZSAmJiBhcmcucHJvdG90eXBlLnJlbmRlcikge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKCdZb3Ugc2VlbSB0byBiZSBhcHBseWluZyB0aGUgYXJndW1lbnRzIGluIHRoZSB3cm9uZyBvcmRlci4gJyArIFwiSXQgc2hvdWxkIGJlIFwiLmNvbmNhdChmdW5jdGlvbk5hbWUsIFwiKFwiKS5jb25jYXQoc2lnbmF0dXJlLCBcIikoQ29tcG9uZW50KSwgbm90IHRoZSBvdGhlciB3YXkgYXJvdW5kLiBcIikgKyAnUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy90cm91Ymxlc2hvb3RpbmcjeW91LXNlZW0tdG8tYmUtYXBwbHlpbmctdGhlLWFyZ3VtZW50cy1pbi10aGUtd3Jvbmctb3JkZXInKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24oaW5wdXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpbnB1dCA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydCBmdW5jdGlvbiBub29wKCkgey8vIG5vb3Bcbn1cblxuZnVuY3Rpb24gaXNPYmplY3RMaWtlKGlucHV0KSB7XG4gIHJldHVybiBfdHlwZW9mKGlucHV0KSA9PT0gJ29iamVjdCcgJiYgaW5wdXQgIT09IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KGlucHV0KSB7XG4gIGlmICghaXNPYmplY3RMaWtlKGlucHV0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5wdXQpID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIgcHJvdG8gPSBpbnB1dDtcblxuICB3aGlsZSAoT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKSAhPT0gbnVsbCkge1xuICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5wdXQpID09PSBwcm90bztcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkVHlwZSh0eXBlLCBhbGxvd0FycmF5KSB7XG4gIHJldHVybiB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycgfHwgX3R5cGVvZih0eXBlKSA9PT0gJ3N5bWJvbCcgfHwgISFhbGxvd0FycmF5ICYmIEFycmF5LmlzQXJyYXkodHlwZSkgJiYgdHlwZS5ldmVyeShmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiBpc1ZhbGlkVHlwZSh0LCBmYWxzZSk7XG4gIH0pO1xufSIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuaW1wb3J0IHsgaXNGdW5jdGlvbiwgbm9vcCB9IGZyb20gJy4vdXRpbHMnO1xuLyoqXG4gKiBQcm92aWRlcyBhIHNldCBvZiBzdGF0aWMgbWV0aG9kcyBmb3IgY3JlYXRpbmcgRGlzcG9zYWJsZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhY3Rpb24gQWN0aW9uIHRvIHJ1biBkdXJpbmcgdGhlIGZpcnN0IGNhbGwgdG8gZGlzcG9zZS5cbiAqIFRoZSBhY3Rpb24gaXMgZ3VhcmFudGVlZCB0byBiZSBydW4gYXQgbW9zdCBvbmNlLlxuICovXG5cbmV4cG9ydCB2YXIgRGlzcG9zYWJsZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIERpc3Bvc2FibGUoYWN0aW9uKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERpc3Bvc2FibGUpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaXNEaXNwb3NlZFwiLCBmYWxzZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJhY3Rpb25cIiwgdm9pZCAwKTtcblxuICAgIHRoaXMuYWN0aW9uID0gaXNGdW5jdGlvbihhY3Rpb24pID8gYWN0aW9uIDogbm9vcDtcbiAgfVxuICAvKiogUGVyZm9ybXMgdGhlIHRhc2sgb2YgY2xlYW5pbmcgdXAgcmVzb3VyY2VzLiAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKERpc3Bvc2FibGUsIFt7XG4gICAga2V5OiBcImRpc3Bvc2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzcG9zZSgpIHtcbiAgICAgIGlmICghdGhpcy5pc0Rpc3Bvc2VkKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uKCk7XG4gICAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XSwgW3tcbiAgICBrZXk6IFwiaXNEaXNwb3NhYmxlXCIsXG4gICAgdmFsdWU6XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZGlzcG9zYWJsZSB0aGF0IGRvZXMgbm90aGluZyB3aGVuIGRpc3Bvc2VkLlxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhIGRpc3Bvc2FibGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gT2JqZWN0IHRvIHRlc3Qgd2hldGhlciBpdCBoYXMgYSBkaXNwb3NlIG1ldGhvZFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIGEgZGlzcG9zYWJsZSBvYmplY3QsIGVsc2UgZmFsc2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNEaXNwb3NhYmxlKGQpIHtcbiAgICAgIHJldHVybiBCb29sZWFuKGQgJiYgaXNGdW5jdGlvbihkLmRpc3Bvc2UpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiX2ZpeHVwXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9maXh1cChyZXN1bHQpIHtcbiAgICAgIHJldHVybiBEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZShyZXN1bHQpID8gcmVzdWx0IDogRGlzcG9zYWJsZS5lbXB0eTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGRpc3Bvc2FibGUgb2JqZWN0IHRoYXQgaW52b2tlcyB0aGUgc3BlY2lmaWVkIGFjdGlvbiB3aGVuIGRpc3Bvc2VkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGRpc3Bvc2UgQWN0aW9uIHRvIHJ1biBkdXJpbmcgdGhlIGZpcnN0IGNhbGwgdG8gZGlzcG9zZS5cbiAgICAgKiBUaGUgYWN0aW9uIGlzIGd1YXJhbnRlZWQgdG8gYmUgcnVuIGF0IG1vc3Qgb25jZS5cbiAgICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBUaGUgZGlzcG9zYWJsZSBvYmplY3QgdGhhdCBydW5zIHRoZSBnaXZlbiBhY3Rpb24gdXBvbiBkaXNwb3NhbC5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGUoYWN0aW9uKSB7XG4gICAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoYWN0aW9uKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRGlzcG9zYWJsZTtcbn0oKTtcbi8qKlxuICogUmVwcmVzZW50cyBhIGdyb3VwIG9mIGRpc3Bvc2FibGUgcmVzb3VyY2VzIHRoYXQgYXJlIGRpc3Bvc2VkIHRvZ2V0aGVyLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuX2RlZmluZVByb3BlcnR5KERpc3Bvc2FibGUsIFwiZW1wdHlcIiwge1xuICBkaXNwb3NlOiBub29wXG59KTtcblxuZXhwb3J0IHZhciBDb21wb3NpdGVEaXNwb3NhYmxlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ29tcG9zaXRlRGlzcG9zYWJsZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29tcG9zaXRlRGlzcG9zYWJsZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpc0Rpc3Bvc2VkXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRpc3Bvc2FibGVzXCIsIHZvaWQgMCk7XG5cbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgZGlzcG9zYWJsZXMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBkaXNwb3NhYmxlc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gZGlzcG9zYWJsZXM7XG4gIH1cbiAgLyoqXG4gICAqIEFkZHMgYSBkaXNwb3NhYmxlIHRvIHRoZSBDb21wb3NpdGVEaXNwb3NhYmxlIG9yIGRpc3Bvc2VzIHRoZSBkaXNwb3NhYmxlIGlmIHRoZSBDb21wb3NpdGVEaXNwb3NhYmxlIGlzIGRpc3Bvc2VkLlxuICAgKiBAcGFyYW0ge0FueX0gaXRlbSBEaXNwb3NhYmxlIHRvIGFkZC5cbiAgICovXG5cblxuICBfY3JlYXRlQ2xhc3MoQ29tcG9zaXRlRGlzcG9zYWJsZSwgW3tcbiAgICBrZXk6IFwiYWRkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZChpdGVtKSB7XG4gICAgICBpZiAodGhpcy5pc0Rpc3Bvc2VkKSB7XG4gICAgICAgIGl0ZW0uZGlzcG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFuZCBkaXNwb3NlcyB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhIGRpc3Bvc2FibGUgZnJvbSB0aGUgQ29tcG9zaXRlRGlzcG9zYWJsZS5cbiAgICAgKiBAcGFyYW0ge0FueX0gaXRlbSBEaXNwb3NhYmxlIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiBmb3VuZDsgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZShpdGVtKSB7XG4gICAgICB2YXIgc2hvdWxkRGlzcG9zZSA9IGZhbHNlO1xuXG4gICAgICBpZiAoIXRoaXMuaXNEaXNwb3NlZCkge1xuICAgICAgICB2YXIgaWR4ID0gdGhpcy5kaXNwb3NhYmxlcy5pbmRleE9mKGl0ZW0pO1xuXG4gICAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgICAgc2hvdWxkRGlzcG9zZSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICBpdGVtLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2hvdWxkRGlzcG9zZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogIERpc3Bvc2VzIGFsbCBkaXNwb3NhYmxlcyBpbiB0aGUgZ3JvdXAgYW5kIHJlbW92ZXMgdGhlbSBmcm9tIHRoZSBncm91cCBidXRcbiAgICAgKiAgZG9lcyBub3QgZGlzcG9zZSB0aGUgQ29tcG9zaXRlRGlzcG9zYWJsZS5cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImNsZWFyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgaWYgKCF0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgICAgdmFyIGxlbiA9IHRoaXMuZGlzcG9zYWJsZXMubGVuZ3RoO1xuICAgICAgICB2YXIgY3VycmVudERpc3Bvc2FibGVzID0gbmV3IEFycmF5KGxlbik7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGN1cnJlbnREaXNwb3NhYmxlc1tpXSA9IHRoaXMuZGlzcG9zYWJsZXNbaV07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxlbjsgX2krKykge1xuICAgICAgICAgIGN1cnJlbnREaXNwb3NhYmxlc1tfaV0uZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqICBEaXNwb3NlcyBhbGwgZGlzcG9zYWJsZXMgaW4gdGhlIGdyb3VwIGFuZCByZW1vdmVzIHRoZW0gZnJvbSB0aGUgZ3JvdXAuXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJkaXNwb3NlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3Bvc2UoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNEaXNwb3NlZCkge1xuICAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgICB2YXIgbGVuID0gdGhpcy5kaXNwb3NhYmxlcy5sZW5ndGg7XG4gICAgICAgIHZhciBjdXJyZW50RGlzcG9zYWJsZXMgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgY3VycmVudERpc3Bvc2FibGVzW2ldID0gdGhpcy5kaXNwb3NhYmxlc1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBsZW47IF9pMisrKSB7XG4gICAgICAgICAgY3VycmVudERpc3Bvc2FibGVzW19pMl0uZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENvbXBvc2l0ZURpc3Bvc2FibGU7XG59KCk7XG4vKipcbiAqIFJlcHJlc2VudHMgYSBkaXNwb3NhYmxlIHJlc291cmNlIHdob3NlIHVuZGVybHlpbmcgZGlzcG9zYWJsZSByZXNvdXJjZSBjYW5cbiAqIGJlIHJlcGxhY2VkIGJ5IGFub3RoZXIgZGlzcG9zYWJsZSByZXNvdXJjZSwgY2F1c2luZyBhdXRvbWF0aWMgZGlzcG9zYWwgb2ZcbiAqIHRoZSBwcmV2aW91cyB1bmRlcmx5aW5nIGRpc3Bvc2FibGUgcmVzb3VyY2UuXG4gKi9cblxuZXhwb3J0IHZhciBTZXJpYWxEaXNwb3NhYmxlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2VyaWFsRGlzcG9zYWJsZSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2VyaWFsRGlzcG9zYWJsZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpc0Rpc3Bvc2VkXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImN1cnJlbnRcIiwgdm9pZCAwKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTZXJpYWxEaXNwb3NhYmxlLCBbe1xuICAgIGtleTogXCJnZXREaXNwb3NhYmxlXCIsXG4gICAgdmFsdWU6XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdW5kZXJseWluZyBkaXNwb3NhYmxlLlxuICAgICAqIEByZXR1cm5zIHtBbnl9IHRoZSB1bmRlcmx5aW5nIGRpc3Bvc2FibGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0RGlzcG9zYWJsZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldERpc3Bvc2FibGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0RGlzcG9zYWJsZSh2YWx1ZSkge1xuICAgICAgdmFyIHNob3VsZERpc3Bvc2UgPSB0aGlzLmlzRGlzcG9zZWQ7XG5cbiAgICAgIGlmICghc2hvdWxkRGlzcG9zZSkge1xuICAgICAgICB2YXIgb2xkID0gdGhpcy5jdXJyZW50O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB2YWx1ZTtcblxuICAgICAgICBpZiAob2xkKSB7XG4gICAgICAgICAgb2xkLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2hvdWxkRGlzcG9zZSAmJiB2YWx1ZSkge1xuICAgICAgICB2YWx1ZS5kaXNwb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKiBQZXJmb3JtcyB0aGUgdGFzayBvZiBjbGVhbmluZyB1cCByZXNvdXJjZXMuICovXG5cbiAgfSwge1xuICAgIGtleTogXCJkaXNwb3NlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3Bvc2UoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNEaXNwb3NlZCkge1xuICAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgICB2YXIgb2xkID0gdGhpcy5jdXJyZW50O1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKG9sZCkge1xuICAgICAgICAgIG9sZC5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU2VyaWFsRGlzcG9zYWJsZTtcbn0oKTsiLCIvKiogQGxpY2Vuc2UgUmVhY3QgdjE2LjEzLjFcbiAqIHJlYWN0LWlzLnByb2R1Y3Rpb24ubWluLmpzXG4gKlxuICogQ29weXJpZ2h0IChjKSBGYWNlYm9vaywgSW5jLiBhbmQgaXRzIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO3ZhciBiPVwiZnVuY3Rpb25cIj09PXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5mb3IsYz1iP1N5bWJvbC5mb3IoXCJyZWFjdC5lbGVtZW50XCIpOjYwMTAzLGQ9Yj9TeW1ib2wuZm9yKFwicmVhY3QucG9ydGFsXCIpOjYwMTA2LGU9Yj9TeW1ib2wuZm9yKFwicmVhY3QuZnJhZ21lbnRcIik6NjAxMDcsZj1iP1N5bWJvbC5mb3IoXCJyZWFjdC5zdHJpY3RfbW9kZVwiKTo2MDEwOCxnPWI/U3ltYm9sLmZvcihcInJlYWN0LnByb2ZpbGVyXCIpOjYwMTE0LGg9Yj9TeW1ib2wuZm9yKFwicmVhY3QucHJvdmlkZXJcIik6NjAxMDksaz1iP1N5bWJvbC5mb3IoXCJyZWFjdC5jb250ZXh0XCIpOjYwMTEwLGw9Yj9TeW1ib2wuZm9yKFwicmVhY3QuYXN5bmNfbW9kZVwiKTo2MDExMSxtPWI/U3ltYm9sLmZvcihcInJlYWN0LmNvbmN1cnJlbnRfbW9kZVwiKTo2MDExMSxuPWI/U3ltYm9sLmZvcihcInJlYWN0LmZvcndhcmRfcmVmXCIpOjYwMTEyLHA9Yj9TeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VcIik6NjAxMTMscT1iP1xuU3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlX2xpc3RcIik6NjAxMjAscj1iP1N5bWJvbC5mb3IoXCJyZWFjdC5tZW1vXCIpOjYwMTE1LHQ9Yj9TeW1ib2wuZm9yKFwicmVhY3QubGF6eVwiKTo2MDExNix2PWI/U3ltYm9sLmZvcihcInJlYWN0LmJsb2NrXCIpOjYwMTIxLHc9Yj9TeW1ib2wuZm9yKFwicmVhY3QuZnVuZGFtZW50YWxcIik6NjAxMTcseD1iP1N5bWJvbC5mb3IoXCJyZWFjdC5yZXNwb25kZXJcIik6NjAxMTgseT1iP1N5bWJvbC5mb3IoXCJyZWFjdC5zY29wZVwiKTo2MDExOTtcbmZ1bmN0aW9uIHooYSl7aWYoXCJvYmplY3RcIj09PXR5cGVvZiBhJiZudWxsIT09YSl7dmFyIHU9YS4kJHR5cGVvZjtzd2l0Y2godSl7Y2FzZSBjOnN3aXRjaChhPWEudHlwZSxhKXtjYXNlIGw6Y2FzZSBtOmNhc2UgZTpjYXNlIGc6Y2FzZSBmOmNhc2UgcDpyZXR1cm4gYTtkZWZhdWx0OnN3aXRjaChhPWEmJmEuJCR0eXBlb2YsYSl7Y2FzZSBrOmNhc2UgbjpjYXNlIHQ6Y2FzZSByOmNhc2UgaDpyZXR1cm4gYTtkZWZhdWx0OnJldHVybiB1fX1jYXNlIGQ6cmV0dXJuIHV9fX1mdW5jdGlvbiBBKGEpe3JldHVybiB6KGEpPT09bX1leHBvcnRzLkFzeW5jTW9kZT1sO2V4cG9ydHMuQ29uY3VycmVudE1vZGU9bTtleHBvcnRzLkNvbnRleHRDb25zdW1lcj1rO2V4cG9ydHMuQ29udGV4dFByb3ZpZGVyPWg7ZXhwb3J0cy5FbGVtZW50PWM7ZXhwb3J0cy5Gb3J3YXJkUmVmPW47ZXhwb3J0cy5GcmFnbWVudD1lO2V4cG9ydHMuTGF6eT10O2V4cG9ydHMuTWVtbz1yO2V4cG9ydHMuUG9ydGFsPWQ7XG5leHBvcnRzLlByb2ZpbGVyPWc7ZXhwb3J0cy5TdHJpY3RNb2RlPWY7ZXhwb3J0cy5TdXNwZW5zZT1wO2V4cG9ydHMuaXNBc3luY01vZGU9ZnVuY3Rpb24oYSl7cmV0dXJuIEEoYSl8fHooYSk9PT1sfTtleHBvcnRzLmlzQ29uY3VycmVudE1vZGU9QTtleHBvcnRzLmlzQ29udGV4dENvbnN1bWVyPWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09a307ZXhwb3J0cy5pc0NvbnRleHRQcm92aWRlcj1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PWh9O2V4cG9ydHMuaXNFbGVtZW50PWZ1bmN0aW9uKGEpe3JldHVyblwib2JqZWN0XCI9PT10eXBlb2YgYSYmbnVsbCE9PWEmJmEuJCR0eXBlb2Y9PT1jfTtleHBvcnRzLmlzRm9yd2FyZFJlZj1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PW59O2V4cG9ydHMuaXNGcmFnbWVudD1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PWV9O2V4cG9ydHMuaXNMYXp5PWZ1bmN0aW9uKGEpe3JldHVybiB6KGEpPT09dH07XG5leHBvcnRzLmlzTWVtbz1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PXJ9O2V4cG9ydHMuaXNQb3J0YWw9ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT1kfTtleHBvcnRzLmlzUHJvZmlsZXI9ZnVuY3Rpb24oYSl7cmV0dXJuIHooYSk9PT1nfTtleHBvcnRzLmlzU3RyaWN0TW9kZT1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PWZ9O2V4cG9ydHMuaXNTdXNwZW5zZT1mdW5jdGlvbihhKXtyZXR1cm4geihhKT09PXB9O1xuZXhwb3J0cy5pc1ZhbGlkRWxlbWVudFR5cGU9ZnVuY3Rpb24oYSl7cmV0dXJuXCJzdHJpbmdcIj09PXR5cGVvZiBhfHxcImZ1bmN0aW9uXCI9PT10eXBlb2YgYXx8YT09PWV8fGE9PT1tfHxhPT09Z3x8YT09PWZ8fGE9PT1wfHxhPT09cXx8XCJvYmplY3RcIj09PXR5cGVvZiBhJiZudWxsIT09YSYmKGEuJCR0eXBlb2Y9PT10fHxhLiQkdHlwZW9mPT09cnx8YS4kJHR5cGVvZj09PWh8fGEuJCR0eXBlb2Y9PT1rfHxhLiQkdHlwZW9mPT09bnx8YS4kJHR5cGVvZj09PXd8fGEuJCR0eXBlb2Y9PT14fHxhLiQkdHlwZW9mPT09eXx8YS4kJHR5cGVvZj09PXYpfTtleHBvcnRzLnR5cGVPZj16O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWlzLnByb2R1Y3Rpb24ubWluLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LWlzLmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZWFjdElzID0gcmVxdWlyZSgncmVhY3QtaXMnKTtcblxuLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgWWFob28hIEluYy5cbiAqIENvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS4gU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiAqL1xudmFyIFJFQUNUX1NUQVRJQ1MgPSB7XG4gIGNoaWxkQ29udGV4dFR5cGVzOiB0cnVlLFxuICBjb250ZXh0VHlwZTogdHJ1ZSxcbiAgY29udGV4dFR5cGVzOiB0cnVlLFxuICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gIGRpc3BsYXlOYW1lOiB0cnVlLFxuICBnZXREZWZhdWx0UHJvcHM6IHRydWUsXG4gIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcjogdHJ1ZSxcbiAgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzOiB0cnVlLFxuICBtaXhpbnM6IHRydWUsXG4gIHByb3BUeXBlczogdHJ1ZSxcbiAgdHlwZTogdHJ1ZVxufTtcbnZhciBLTk9XTl9TVEFUSUNTID0ge1xuICBuYW1lOiB0cnVlLFxuICBsZW5ndGg6IHRydWUsXG4gIHByb3RvdHlwZTogdHJ1ZSxcbiAgY2FsbGVyOiB0cnVlLFxuICBjYWxsZWU6IHRydWUsXG4gIGFyZ3VtZW50czogdHJ1ZSxcbiAgYXJpdHk6IHRydWVcbn07XG52YXIgRk9SV0FSRF9SRUZfU1RBVElDUyA9IHtcbiAgJyQkdHlwZW9mJzogdHJ1ZSxcbiAgcmVuZGVyOiB0cnVlLFxuICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gIGRpc3BsYXlOYW1lOiB0cnVlLFxuICBwcm9wVHlwZXM6IHRydWVcbn07XG52YXIgTUVNT19TVEFUSUNTID0ge1xuICAnJCR0eXBlb2YnOiB0cnVlLFxuICBjb21wYXJlOiB0cnVlLFxuICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gIGRpc3BsYXlOYW1lOiB0cnVlLFxuICBwcm9wVHlwZXM6IHRydWUsXG4gIHR5cGU6IHRydWVcbn07XG52YXIgVFlQRV9TVEFUSUNTID0ge307XG5UWVBFX1NUQVRJQ1NbcmVhY3RJcy5Gb3J3YXJkUmVmXSA9IEZPUldBUkRfUkVGX1NUQVRJQ1M7XG5UWVBFX1NUQVRJQ1NbcmVhY3RJcy5NZW1vXSA9IE1FTU9fU1RBVElDUztcblxuZnVuY3Rpb24gZ2V0U3RhdGljcyhjb21wb25lbnQpIHtcbiAgLy8gUmVhY3QgdjE2LjExIGFuZCBiZWxvd1xuICBpZiAocmVhY3RJcy5pc01lbW8oY29tcG9uZW50KSkge1xuICAgIHJldHVybiBNRU1PX1NUQVRJQ1M7XG4gIH0gLy8gUmVhY3QgdjE2LjEyIGFuZCBhYm92ZVxuXG5cbiAgcmV0dXJuIFRZUEVfU1RBVElDU1tjb21wb25lbnRbJyQkdHlwZW9mJ11dIHx8IFJFQUNUX1NUQVRJQ1M7XG59XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xudmFyIG9iamVjdFByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGU7XG5mdW5jdGlvbiBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIHNvdXJjZUNvbXBvbmVudCwgYmxhY2tsaXN0KSB7XG4gIGlmICh0eXBlb2Ygc291cmNlQ29tcG9uZW50ICE9PSAnc3RyaW5nJykge1xuICAgIC8vIGRvbid0IGhvaXN0IG92ZXIgc3RyaW5nIChodG1sKSBjb21wb25lbnRzXG4gICAgaWYgKG9iamVjdFByb3RvdHlwZSkge1xuICAgICAgdmFyIGluaGVyaXRlZENvbXBvbmVudCA9IGdldFByb3RvdHlwZU9mKHNvdXJjZUNvbXBvbmVudCk7XG5cbiAgICAgIGlmIChpbmhlcml0ZWRDb21wb25lbnQgJiYgaW5oZXJpdGVkQ29tcG9uZW50ICE9PSBvYmplY3RQcm90b3R5cGUpIHtcbiAgICAgICAgaG9pc3ROb25SZWFjdFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50LCBpbmhlcml0ZWRDb21wb25lbnQsIGJsYWNrbGlzdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZUNvbXBvbmVudCk7XG5cbiAgICBpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgICBrZXlzID0ga2V5cy5jb25jYXQoZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZUNvbXBvbmVudCkpO1xuICAgIH1cblxuICAgIHZhciB0YXJnZXRTdGF0aWNzID0gZ2V0U3RhdGljcyh0YXJnZXRDb21wb25lbnQpO1xuICAgIHZhciBzb3VyY2VTdGF0aWNzID0gZ2V0U3RhdGljcyhzb3VyY2VDb21wb25lbnQpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcblxuICAgICAgaWYgKCFLTk9XTl9TVEFUSUNTW2tleV0gJiYgIShibGFja2xpc3QgJiYgYmxhY2tsaXN0W2tleV0pICYmICEoc291cmNlU3RhdGljcyAmJiBzb3VyY2VTdGF0aWNzW2tleV0pICYmICEodGFyZ2V0U3RhdGljcyAmJiB0YXJnZXRTdGF0aWNzW2tleV0pKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZUNvbXBvbmVudCwga2V5KTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIEF2b2lkIGZhaWx1cmVzIGZyb20gcmVhZC1vbmx5IHByb3BlcnRpZXNcbiAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0YXJnZXRDb21wb25lbnQsIGtleSwgZGVzY3JpcHRvcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldENvbXBvbmVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBob2lzdE5vblJlYWN0U3RhdGljcztcbiIsImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsgdmFyIF9pID0gYXJyID09IG51bGwgPyBudWxsIDogdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcnJbU3ltYm9sLml0ZXJhdG9yXSB8fCBhcnJbXCJAQGl0ZXJhdG9yXCJdOyBpZiAoX2kgPT0gbnVsbCkgcmV0dXJuOyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9zLCBfZTsgdHJ5IHsgZm9yIChfaSA9IF9pLmNhbGwoYXJyKTsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVTdXBlcihEZXJpdmVkKSB7IHZhciBoYXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0ID0gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpOyByZXR1cm4gZnVuY3Rpb24gX2NyZWF0ZVN1cGVySW50ZXJuYWwoKSB7IHZhciBTdXBlciA9IF9nZXRQcm90b3R5cGVPZihEZXJpdmVkKSwgcmVzdWx0OyBpZiAoaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCkgeyB2YXIgTmV3VGFyZ2V0ID0gX2dldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yOyByZXN1bHQgPSBSZWZsZWN0LmNvbnN0cnVjdChTdXBlciwgYXJndW1lbnRzLCBOZXdUYXJnZXQpOyB9IGVsc2UgeyByZXN1bHQgPSBTdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9IHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCByZXN1bHQpOyB9OyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gZWxzZSBpZiAoY2FsbCAhPT0gdm9pZCAwKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJEZXJpdmVkIGNvbnN0cnVjdG9ycyBtYXkgb25seSByZXR1cm4gb2JqZWN0IG9yIHVuZGVmaW5lZFwiKTsgfSByZXR1cm4gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTsgfVxuXG5mdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHsgaWYgKHNlbGYgPT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIHNlbGY7IH1cblxuZnVuY3Rpb24gX2lzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCgpIHsgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcInVuZGVmaW5lZFwiIHx8ICFSZWZsZWN0LmNvbnN0cnVjdCkgcmV0dXJuIGZhbHNlOyBpZiAoUmVmbGVjdC5jb25zdHJ1Y3Quc2hhbSkgcmV0dXJuIGZhbHNlOyBpZiAodHlwZW9mIFByb3h5ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB0cnVlOyB0cnkgeyBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoQm9vbGVhbiwgW10sIGZ1bmN0aW9uICgpIHt9KSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9XG5cbmZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7IHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7IH07IHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuaW1wb3J0IHsganN4IGFzIF9qc3ggfSBmcm9tIFwicmVhY3QvanN4LXJ1bnRpbWVcIjtcbmltcG9ydCB7IGNyZWF0ZVJlZiwgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgc2hhbGxvd0VxdWFsIH0gZnJvbSAnQHJlYWN0LWRuZC9zaGFsbG93ZXF1YWwnO1xuaW1wb3J0IHsgaW52YXJpYW50IH0gZnJvbSAnQHJlYWN0LWRuZC9pbnZhcmlhbnQnO1xuaW1wb3J0IHsgRG5kQ29udGV4dCB9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0IHsgaXNQbGFpbk9iamVjdCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgU2VyaWFsRGlzcG9zYWJsZSB9IGZyb20gJy4vZGlzcG9zYWJsZXMnO1xuaW1wb3J0IHsgaXNSZWZhYmxlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgaG9pc3RTdGF0aWNzIGZyb20gJ2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzJztcbmV4cG9ydCBmdW5jdGlvbiBkZWNvcmF0ZUhhbmRsZXIoX3JlZikge1xuICB2YXIgRGVjb3JhdGVkQ29tcG9uZW50ID0gX3JlZi5EZWNvcmF0ZWRDb21wb25lbnQsXG4gICAgICBjcmVhdGVIYW5kbGVyID0gX3JlZi5jcmVhdGVIYW5kbGVyLFxuICAgICAgY3JlYXRlTW9uaXRvciA9IF9yZWYuY3JlYXRlTW9uaXRvcixcbiAgICAgIGNyZWF0ZUNvbm5lY3RvciA9IF9yZWYuY3JlYXRlQ29ubmVjdG9yLFxuICAgICAgcmVnaXN0ZXJIYW5kbGVyID0gX3JlZi5yZWdpc3RlckhhbmRsZXIsXG4gICAgICBjb250YWluZXJEaXNwbGF5TmFtZSA9IF9yZWYuY29udGFpbmVyRGlzcGxheU5hbWUsXG4gICAgICBnZXRUeXBlID0gX3JlZi5nZXRUeXBlLFxuICAgICAgY29sbGVjdCA9IF9yZWYuY29sbGVjdCxcbiAgICAgIG9wdGlvbnMgPSBfcmVmLm9wdGlvbnM7XG4gIHZhciBfb3B0aW9ucyRhcmVQcm9wc0VxdWEgPSBvcHRpb25zLmFyZVByb3BzRXF1YWwsXG4gICAgICBhcmVQcm9wc0VxdWFsID0gX29wdGlvbnMkYXJlUHJvcHNFcXVhID09PSB2b2lkIDAgPyBzaGFsbG93RXF1YWwgOiBfb3B0aW9ucyRhcmVQcm9wc0VxdWE7XG4gIHZhciBEZWNvcmF0ZWQgPSBEZWNvcmF0ZWRDb21wb25lbnQ7XG4gIHZhciBkaXNwbGF5TmFtZSA9IERlY29yYXRlZENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fCBEZWNvcmF0ZWRDb21wb25lbnQubmFtZSB8fCAnQ29tcG9uZW50JztcblxuICB2YXIgRHJhZ0Ryb3BDb250YWluZXIgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgICBfaW5oZXJpdHMoRHJhZ0Ryb3BDb250YWluZXIsIF9Db21wb25lbnQpO1xuXG4gICAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihEcmFnRHJvcENvbnRhaW5lcik7XG5cbiAgICBmdW5jdGlvbiBEcmFnRHJvcENvbnRhaW5lcihwcm9wcykge1xuICAgICAgdmFyIF90aGlzO1xuXG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRHJhZ0Ryb3BDb250YWluZXIpO1xuXG4gICAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHByb3BzKTtcblxuICAgICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImRlY29yYXRlZFJlZlwiLCBjcmVhdGVSZWYoKSk7XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJoYW5kbGVySWRcIiwgdm9pZCAwKTtcblxuICAgICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcIm1hbmFnZXJcIiwgdm9pZCAwKTtcblxuICAgICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImhhbmRsZXJNb25pdG9yXCIsIHZvaWQgMCk7XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJoYW5kbGVyQ29ubmVjdG9yXCIsIHZvaWQgMCk7XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJoYW5kbGVyXCIsIHZvaWQgMCk7XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJkaXNwb3NhYmxlXCIsIHZvaWQgMCk7XG5cbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJjdXJyZW50VHlwZVwiLCB2b2lkIDApO1xuXG4gICAgICBfZGVmaW5lUHJvcGVydHkoX2Fzc2VydFRoaXNJbml0aWFsaXplZChfdGhpcyksIFwiaGFuZGxlQ2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5leHRTdGF0ZSA9IF90aGlzLmdldEN1cnJlbnRTdGF0ZSgpO1xuXG4gICAgICAgIGlmICghc2hhbGxvd0VxdWFsKG5leHRTdGF0ZSwgX3RoaXMuc3RhdGUpKSB7XG4gICAgICAgICAgX3RoaXMuc2V0U3RhdGUobmV4dFN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIF90aGlzLmRpc3Bvc2FibGUgPSBuZXcgU2VyaWFsRGlzcG9zYWJsZSgpO1xuXG4gICAgICBfdGhpcy5yZWNlaXZlUHJvcHMocHJvcHMpO1xuXG4gICAgICBfdGhpcy5kaXNwb3NlKCk7XG5cbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoRHJhZ0Ryb3BDb250YWluZXIsIFt7XG4gICAgICBrZXk6IFwiZ2V0SGFuZGxlcklkXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SGFuZGxlcklkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVySWQ7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImdldERlY29yYXRlZENvbXBvbmVudEluc3RhbmNlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RGVjb3JhdGVkQ29tcG9uZW50SW5zdGFuY2UoKSB7XG4gICAgICAgIGludmFyaWFudCh0aGlzLmRlY29yYXRlZFJlZi5jdXJyZW50LCAnSW4gb3JkZXIgdG8gYWNjZXNzIGFuIGluc3RhbmNlIG9mIHRoZSBkZWNvcmF0ZWQgY29tcG9uZW50LCBpdCBtdXN0IGVpdGhlciBiZSBhIGNsYXNzIGNvbXBvbmVudCBvciB1c2UgUmVhY3QuZm9yd2FyZFJlZigpJyk7XG4gICAgICAgIHJldHVybiB0aGlzLmRlY29yYXRlZFJlZi5jdXJyZW50O1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJzaG91bGRDb21wb25lbnRVcGRhdGVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICAgICAgcmV0dXJuICFhcmVQcm9wc0VxdWFsKG5leHRQcm9wcywgdGhpcy5wcm9wcykgfHwgIXNoYWxsb3dFcXVhbChuZXh0U3RhdGUsIHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJjb21wb25lbnREaWRNb3VudFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmRpc3Bvc2FibGUgPSBuZXcgU2VyaWFsRGlzcG9zYWJsZSgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRUeXBlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnJlY2VpdmVQcm9wcyh0aGlzLnByb3BzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UoKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiY29tcG9uZW50RGlkVXBkYXRlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgICAgICBpZiAoIWFyZVByb3BzRXF1YWwodGhpcy5wcm9wcywgcHJldlByb3BzKSkge1xuICAgICAgICAgIHRoaXMucmVjZWl2ZVByb3BzKHRoaXMucHJvcHMpO1xuICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiY29tcG9uZW50V2lsbFVubW91bnRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgdGhpcy5kaXNwb3NlKCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcInJlY2VpdmVQcm9wc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgICAgICBpZiAoIXRoaXMuaGFuZGxlcikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGFuZGxlci5yZWNlaXZlUHJvcHMocHJvcHMpO1xuICAgICAgICB0aGlzLnJlY2VpdmVUeXBlKGdldFR5cGUocHJvcHMpKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwicmVjZWl2ZVR5cGVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZWNlaXZlVHlwZSh0eXBlKSB7XG4gICAgICAgIGlmICghdGhpcy5oYW5kbGVyTW9uaXRvciB8fCAhdGhpcy5tYW5hZ2VyIHx8ICF0aGlzLmhhbmRsZXJDb25uZWN0b3IpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZSA9PT0gdGhpcy5jdXJyZW50VHlwZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFR5cGUgPSB0eXBlO1xuXG4gICAgICAgIHZhciBfcmVnaXN0ZXJIYW5kbGVyID0gcmVnaXN0ZXJIYW5kbGVyKHR5cGUsIHRoaXMuaGFuZGxlciwgdGhpcy5tYW5hZ2VyKSxcbiAgICAgICAgICAgIF9yZWdpc3RlckhhbmRsZXIyID0gX3NsaWNlZFRvQXJyYXkoX3JlZ2lzdGVySGFuZGxlciwgMiksXG4gICAgICAgICAgICBoYW5kbGVySWQgPSBfcmVnaXN0ZXJIYW5kbGVyMlswXSxcbiAgICAgICAgICAgIHVucmVnaXN0ZXIgPSBfcmVnaXN0ZXJIYW5kbGVyMlsxXTtcblxuICAgICAgICB0aGlzLmhhbmRsZXJJZCA9IGhhbmRsZXJJZDtcbiAgICAgICAgdGhpcy5oYW5kbGVyTW9uaXRvci5yZWNlaXZlSGFuZGxlcklkKGhhbmRsZXJJZCk7XG4gICAgICAgIHRoaXMuaGFuZGxlckNvbm5lY3Rvci5yZWNlaXZlSGFuZGxlcklkKGhhbmRsZXJJZCk7XG4gICAgICAgIHZhciBnbG9iYWxNb25pdG9yID0gdGhpcy5tYW5hZ2VyLmdldE1vbml0b3IoKTtcbiAgICAgICAgdmFyIHVuc3Vic2NyaWJlID0gZ2xvYmFsTW9uaXRvci5zdWJzY3JpYmVUb1N0YXRlQ2hhbmdlKHRoaXMuaGFuZGxlQ2hhbmdlLCB7XG4gICAgICAgICAgaGFuZGxlcklkczogW2hhbmRsZXJJZF1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZS5zZXREaXNwb3NhYmxlKG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKG5ldyBEaXNwb3NhYmxlKHVuc3Vic2NyaWJlKSwgbmV3IERpc3Bvc2FibGUodW5yZWdpc3RlcikpKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZGlzcG9zZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRpc3Bvc2UoKSB7XG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlckNvbm5lY3Rvcikge1xuICAgICAgICAgIHRoaXMuaGFuZGxlckNvbm5lY3Rvci5yZWNlaXZlSGFuZGxlcklkKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImdldEN1cnJlbnRTdGF0ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEN1cnJlbnRTdGF0ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhbmRsZXJDb25uZWN0b3IpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV4dFN0YXRlID0gY29sbGVjdCh0aGlzLmhhbmRsZXJDb25uZWN0b3IuaG9va3MsIHRoaXMuaGFuZGxlck1vbml0b3IsIHRoaXMucHJvcHMpO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgaW52YXJpYW50KGlzUGxhaW5PYmplY3QobmV4dFN0YXRlKSwgJ0V4cGVjdGVkIGBjb2xsZWN0YCBzcGVjaWZpZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byAnICsgJyVzIGZvciAlcyB0byByZXR1cm4gYSBwbGFpbiBvYmplY3Qgb2YgcHJvcHMgdG8gaW5qZWN0LiAnICsgJ0luc3RlYWQsIHJlY2VpdmVkICVzLicsIGNvbnRhaW5lckRpc3BsYXlOYW1lLCBkaXNwbGF5TmFtZSwgbmV4dFN0YXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0U3RhdGU7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcInJlbmRlclwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIF9qc3goRG5kQ29udGV4dC5Db25zdW1lciwge1xuICAgICAgICAgIGNoaWxkcmVuOiBmdW5jdGlvbiBjaGlsZHJlbihfcmVmMikge1xuICAgICAgICAgICAgdmFyIGRyYWdEcm9wTWFuYWdlciA9IF9yZWYyLmRyYWdEcm9wTWFuYWdlcjtcblxuICAgICAgICAgICAgX3RoaXMyLnJlY2VpdmVEcmFnRHJvcE1hbmFnZXIoZHJhZ0Ryb3BNYW5hZ2VyKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzMiRoYW5kbGVyQ29ubmVjdDtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoX3RoaXMyJGhhbmRsZXJDb25uZWN0ID0gX3RoaXMyLmhhbmRsZXJDb25uZWN0b3IpID09PSBudWxsIHx8IF90aGlzMiRoYW5kbGVyQ29ubmVjdCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMyJGhhbmRsZXJDb25uZWN0LnJlY29ubmVjdCgpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIF9qc3goRGVjb3JhdGVkLCBPYmplY3QuYXNzaWduKHt9LCBfdGhpczIucHJvcHMsIF90aGlzMi5nZXRDdXJyZW50U3RhdGUoKSwge1xuICAgICAgICAgICAgICAvLyBOT1RFOiBpZiBEZWNvcmF0ZWQgaXMgYSBGdW5jdGlvbiBDb21wb25lbnQsIGRlY29yYXRlZFJlZiB3aWxsIG5vdCBiZSBwb3B1bGF0ZWQgdW5sZXNzIGl0J3MgYSByZWZmb3J3YXJkaW5nIGNvbXBvbmVudC5cbiAgICAgICAgICAgICAgcmVmOiBpc1JlZmFibGUoRGVjb3JhdGVkKSA/IF90aGlzMi5kZWNvcmF0ZWRSZWYgOiBudWxsXG4gICAgICAgICAgICB9KSwgdm9pZCAwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHZvaWQgMCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcInJlY2VpdmVEcmFnRHJvcE1hbmFnZXJcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZWNlaXZlRHJhZ0Ryb3BNYW5hZ2VyKGRyYWdEcm9wTWFuYWdlcikge1xuICAgICAgICBpZiAodGhpcy5tYW5hZ2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhcmlhbnQoZHJhZ0Ryb3BNYW5hZ2VyICE9PSB1bmRlZmluZWQsICdDb3VsZCBub3QgZmluZCB0aGUgZHJhZyBhbmQgZHJvcCBtYW5hZ2VyIGluIHRoZSBjb250ZXh0IG9mICVzLiAnICsgJ01ha2Ugc3VyZSB0byByZW5kZXIgYSBEbmRQcm92aWRlciBjb21wb25lbnQgaW4geW91ciB0b3AtbGV2ZWwgY29tcG9uZW50LiAnICsgJ1JlYWQgbW9yZTogaHR0cDovL3JlYWN0LWRuZC5naXRodWIuaW8vcmVhY3QtZG5kL2RvY3MvdHJvdWJsZXNob290aW5nI2NvdWxkLW5vdC1maW5kLXRoZS1kcmFnLWFuZC1kcm9wLW1hbmFnZXItaW4tdGhlLWNvbnRleHQnLCBkaXNwbGF5TmFtZSwgZGlzcGxheU5hbWUpO1xuXG4gICAgICAgIGlmIChkcmFnRHJvcE1hbmFnZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFuYWdlciA9IGRyYWdEcm9wTWFuYWdlcjtcbiAgICAgICAgdGhpcy5oYW5kbGVyTW9uaXRvciA9IGNyZWF0ZU1vbml0b3IoZHJhZ0Ryb3BNYW5hZ2VyKTtcbiAgICAgICAgdGhpcy5oYW5kbGVyQ29ubmVjdG9yID0gY3JlYXRlQ29ubmVjdG9yKGRyYWdEcm9wTWFuYWdlci5nZXRCYWNrZW5kKCkpO1xuICAgICAgICB0aGlzLmhhbmRsZXIgPSBjcmVhdGVIYW5kbGVyKHRoaXMuaGFuZGxlck1vbml0b3IsIHRoaXMuZGVjb3JhdGVkUmVmKTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gRHJhZ0Ryb3BDb250YWluZXI7XG4gIH0oQ29tcG9uZW50KTtcblxuICBfZGVmaW5lUHJvcGVydHkoRHJhZ0Ryb3BDb250YWluZXIsIFwiRGVjb3JhdGVkQ29tcG9uZW50XCIsIERlY29yYXRlZENvbXBvbmVudCk7XG5cbiAgX2RlZmluZVByb3BlcnR5KERyYWdEcm9wQ29udGFpbmVyLCBcImRpc3BsYXlOYW1lXCIsIFwiXCIuY29uY2F0KGNvbnRhaW5lckRpc3BsYXlOYW1lLCBcIihcIikuY29uY2F0KGRpc3BsYXlOYW1lLCBcIilcIikpO1xuXG4gIHJldHVybiBob2lzdFN0YXRpY3MoRHJhZ0Ryb3BDb250YWluZXIsIERlY29yYXRlZENvbXBvbmVudCk7XG59IiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5pbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICdAcmVhY3QtZG5kL2ludmFyaWFudCc7XG5pbXBvcnQgeyBpc1BsYWluT2JqZWN0LCBnZXREZWNvcmF0ZWRDb21wb25lbnQgfSBmcm9tICcuL3V0aWxzJztcbnZhciBBTExPV0VEX1NQRUNfTUVUSE9EUyA9IFsnY2FuRHJhZycsICdiZWdpbkRyYWcnLCAnaXNEcmFnZ2luZycsICdlbmREcmFnJ107XG52YXIgUkVRVUlSRURfU1BFQ19NRVRIT0RTID0gWydiZWdpbkRyYWcnXTtcblxudmFyIFNvdXJjZUltcGwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTb3VyY2VJbXBsKHNwZWMsIG1vbml0b3IsIHJlZikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU291cmNlSW1wbCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJwcm9wc1wiLCBudWxsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInNwZWNcIiwgdm9pZCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIm1vbml0b3JcIiwgdm9pZCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInJlZlwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiYmVnaW5EcmFnXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghX3RoaXMucHJvcHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXRlbSA9IF90aGlzLnNwZWMuYmVnaW5EcmFnKF90aGlzLnByb3BzLCBfdGhpcy5tb25pdG9yLCBfdGhpcy5yZWYuY3VycmVudCk7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGludmFyaWFudChpc1BsYWluT2JqZWN0KGl0ZW0pLCAnYmVnaW5EcmFnKCkgbXVzdCByZXR1cm4gYSBwbGFpbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBkcmFnZ2VkIGl0ZW0uICcgKyAnSW5zdGVhZCByZWNlaXZlZCAlcy4gJyArICdSZWFkIG1vcmU6IGh0dHA6Ly9yZWFjdC1kbmQuZ2l0aHViLmlvL3JlYWN0LWRuZC9kb2NzL2FwaS9kcmFnLXNvdXJjZScsIGl0ZW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3BlYyA9IHNwZWM7XG4gICAgdGhpcy5tb25pdG9yID0gbW9uaXRvcjtcbiAgICB0aGlzLnJlZiA9IHJlZjtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTb3VyY2VJbXBsLCBbe1xuICAgIGtleTogXCJyZWNlaXZlUHJvcHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVjZWl2ZVByb3BzKHByb3BzKSB7XG4gICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNhbkRyYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FuRHJhZygpIHtcbiAgICAgIGlmICghdGhpcy5wcm9wcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5zcGVjLmNhbkRyYWcpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNwZWMuY2FuRHJhZyh0aGlzLnByb3BzLCB0aGlzLm1vbml0b3IpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc0RyYWdnaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzRHJhZ2dpbmcoZ2xvYmFsTW9uaXRvciwgc291cmNlSWQpIHtcbiAgICAgIGlmICghdGhpcy5wcm9wcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5zcGVjLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgcmV0dXJuIHNvdXJjZUlkID09PSBnbG9iYWxNb25pdG9yLmdldFNvdXJjZUlkKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNwZWMuaXNEcmFnZ2luZyh0aGlzLnByb3BzLCB0aGlzLm1vbml0b3IpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJlbmREcmFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuZERyYWcoKSB7XG4gICAgICBpZiAoIXRoaXMucHJvcHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuc3BlYy5lbmREcmFnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zcGVjLmVuZERyYWcodGhpcy5wcm9wcywgdGhpcy5tb25pdG9yLCBnZXREZWNvcmF0ZWRDb21wb25lbnQodGhpcy5yZWYpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU291cmNlSW1wbDtcbn0oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNvdXJjZUZhY3Rvcnkoc3BlYykge1xuICBPYmplY3Qua2V5cyhzcGVjKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpbnZhcmlhbnQoQUxMT1dFRF9TUEVDX01FVEhPRFMuaW5kZXhPZihrZXkpID4gLTEsICdFeHBlY3RlZCB0aGUgZHJhZyBzb3VyY2Ugc3BlY2lmaWNhdGlvbiB0byBvbmx5IGhhdmUgJyArICdzb21lIG9mIHRoZSBmb2xsb3dpbmcga2V5czogJXMuICcgKyAnSW5zdGVhZCByZWNlaXZlZCBhIHNwZWNpZmljYXRpb24gd2l0aCBhbiB1bmV4cGVjdGVkIFwiJXNcIiBrZXkuICcgKyAnUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvZHJhZy1zb3VyY2UnLCBBTExPV0VEX1NQRUNfTUVUSE9EUy5qb2luKCcsICcpLCBrZXkpO1xuICAgIGludmFyaWFudCh0eXBlb2Ygc3BlY1trZXldID09PSAnZnVuY3Rpb24nLCAnRXhwZWN0ZWQgJXMgaW4gdGhlIGRyYWcgc291cmNlIHNwZWNpZmljYXRpb24gdG8gYmUgYSBmdW5jdGlvbi4gJyArICdJbnN0ZWFkIHJlY2VpdmVkIGEgc3BlY2lmaWNhdGlvbiB3aXRoICVzOiAlcy4gJyArICdSZWFkIG1vcmU6IGh0dHA6Ly9yZWFjdC1kbmQuZ2l0aHViLmlvL3JlYWN0LWRuZC9kb2NzL2FwaS9kcmFnLXNvdXJjZScsIGtleSwga2V5LCBzcGVjW2tleV0pO1xuICB9KTtcbiAgUkVRVUlSRURfU1BFQ19NRVRIT0RTLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGludmFyaWFudCh0eXBlb2Ygc3BlY1trZXldID09PSAnZnVuY3Rpb24nLCAnRXhwZWN0ZWQgJXMgaW4gdGhlIGRyYWcgc291cmNlIHNwZWNpZmljYXRpb24gdG8gYmUgYSBmdW5jdGlvbi4gJyArICdJbnN0ZWFkIHJlY2VpdmVkIGEgc3BlY2lmaWNhdGlvbiB3aXRoICVzOiAlcy4gJyArICdSZWFkIG1vcmU6IGh0dHA6Ly9yZWFjdC1kbmQuZ2l0aHViLmlvL3JlYWN0LWRuZC9kb2NzL2FwaS9kcmFnLXNvdXJjZScsIGtleSwga2V5LCBzcGVjW2tleV0pO1xuICB9KTtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZVNvdXJjZShtb25pdG9yLCByZWYpIHtcbiAgICByZXR1cm4gbmV3IFNvdXJjZUltcGwoc3BlYywgbW9uaXRvciwgcmVmKTtcbiAgfTtcbn0iLCJpbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICdAcmVhY3QtZG5kL2ludmFyaWFudCc7XG5pbXBvcnQgeyByZWdpc3RlclNvdXJjZSwgRHJhZ1NvdXJjZU1vbml0b3JJbXBsLCBTb3VyY2VDb25uZWN0b3IgfSBmcm9tICcuLi9pbnRlcm5hbHMnO1xuaW1wb3J0IHsgY2hlY2tEZWNvcmF0b3JBcmd1bWVudHMsIGlzUGxhaW5PYmplY3QsIGlzVmFsaWRUeXBlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBkZWNvcmF0ZUhhbmRsZXIgfSBmcm9tICcuL2RlY29yYXRlSGFuZGxlcic7XG5pbXBvcnQgeyBjcmVhdGVTb3VyY2VGYWN0b3J5IH0gZnJvbSAnLi9jcmVhdGVTb3VyY2VGYWN0b3J5Jztcbi8qKlxuICogRGVjb3JhdGVzIGEgY29tcG9uZW50IGFzIGEgZHJhZ3NvdXJjZVxuICogQHBhcmFtIHR5cGUgVGhlIGRyYWdzb3VyY2UgdHlwZVxuICogQHBhcmFtIHNwZWMgVGhlIGRyYWcgc291cmNlIHNwZWNpZmljYXRpb25cbiAqIEBwYXJhbSBjb2xsZWN0IFRoZSBwcm9wcyBjb2xsZWN0b3IgZnVuY3Rpb25cbiAqIEBwYXJhbSBvcHRpb25zIERuRCBvcHRpb25zXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIERyYWdTb3VyY2UodHlwZSwgc3BlYywgY29sbGVjdCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDoge307XG4gIGNoZWNrRGVjb3JhdG9yQXJndW1lbnRzKCdEcmFnU291cmNlJywgJ3R5cGUsIHNwZWMsIGNvbGxlY3RbLCBvcHRpb25zXScsIHR5cGUsIHNwZWMsIGNvbGxlY3QsIG9wdGlvbnMpO1xuICB2YXIgZ2V0VHlwZSA9IHR5cGU7XG5cbiAgaWYgKHR5cGVvZiB0eXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgaW52YXJpYW50KGlzVmFsaWRUeXBlKHR5cGUpLCAnRXhwZWN0ZWQgXCJ0eXBlXCIgcHJvdmlkZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIERyYWdTb3VyY2UgdG8gYmUgJyArICdhIHN0cmluZywgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdHJpbmcgZ2l2ZW4gdGhlIGN1cnJlbnQgcHJvcHMuICcgKyAnSW5zdGVhZCwgcmVjZWl2ZWQgJXMuICcgKyAnUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvZHJhZy1zb3VyY2UnLCB0eXBlKTtcblxuICAgIGdldFR5cGUgPSBmdW5jdGlvbiBnZXRUeXBlKCkge1xuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfTtcbiAgfVxuXG4gIGludmFyaWFudChpc1BsYWluT2JqZWN0KHNwZWMpLCAnRXhwZWN0ZWQgXCJzcGVjXCIgcHJvdmlkZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byBEcmFnU291cmNlIHRvIGJlICcgKyAnYSBwbGFpbiBvYmplY3QuIEluc3RlYWQsIHJlY2VpdmVkICVzLiAnICsgJ1JlYWQgbW9yZTogaHR0cDovL3JlYWN0LWRuZC5naXRodWIuaW8vcmVhY3QtZG5kL2RvY3MvYXBpL2RyYWctc291cmNlJywgc3BlYyk7XG4gIHZhciBjcmVhdGVTb3VyY2UgPSBjcmVhdGVTb3VyY2VGYWN0b3J5KHNwZWMpO1xuICBpbnZhcmlhbnQodHlwZW9mIGNvbGxlY3QgPT09ICdmdW5jdGlvbicsICdFeHBlY3RlZCBcImNvbGxlY3RcIiBwcm92aWRlZCBhcyB0aGUgdGhpcmQgYXJndW1lbnQgdG8gRHJhZ1NvdXJjZSB0byBiZSAnICsgJ2EgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGxhaW4gb2JqZWN0IG9mIHByb3BzIHRvIGluamVjdC4gJyArICdJbnN0ZWFkLCByZWNlaXZlZCAlcy4gJyArICdSZWFkIG1vcmU6IGh0dHA6Ly9yZWFjdC1kbmQuZ2l0aHViLmlvL3JlYWN0LWRuZC9kb2NzL2FwaS9kcmFnLXNvdXJjZScsIGNvbGxlY3QpO1xuICBpbnZhcmlhbnQoaXNQbGFpbk9iamVjdChvcHRpb25zKSwgJ0V4cGVjdGVkIFwib3B0aW9uc1wiIHByb3ZpZGVkIGFzIHRoZSBmb3VydGggYXJndW1lbnQgdG8gRHJhZ1NvdXJjZSB0byBiZSAnICsgJ2EgcGxhaW4gb2JqZWN0IHdoZW4gc3BlY2lmaWVkLiAnICsgJ0luc3RlYWQsIHJlY2VpdmVkICVzLiAnICsgJ1JlYWQgbW9yZTogaHR0cDovL3JlYWN0LWRuZC5naXRodWIuaW8vcmVhY3QtZG5kL2RvY3MvYXBpL2RyYWctc291cmNlJywgY29sbGVjdCk7XG4gIHJldHVybiBmdW5jdGlvbiBkZWNvcmF0ZVNvdXJjZShEZWNvcmF0ZWRDb21wb25lbnQpIHtcbiAgICByZXR1cm4gZGVjb3JhdGVIYW5kbGVyKHtcbiAgICAgIGNvbnRhaW5lckRpc3BsYXlOYW1lOiAnRHJhZ1NvdXJjZScsXG4gICAgICBjcmVhdGVIYW5kbGVyOiBjcmVhdGVTb3VyY2UsXG4gICAgICByZWdpc3RlckhhbmRsZXI6IHJlZ2lzdGVyU291cmNlLFxuICAgICAgY3JlYXRlQ29ubmVjdG9yOiBmdW5jdGlvbiBjcmVhdGVDb25uZWN0b3IoYmFja2VuZCkge1xuICAgICAgICByZXR1cm4gbmV3IFNvdXJjZUNvbm5lY3RvcihiYWNrZW5kKTtcbiAgICAgIH0sXG4gICAgICBjcmVhdGVNb25pdG9yOiBmdW5jdGlvbiBjcmVhdGVNb25pdG9yKG1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEcmFnU291cmNlTW9uaXRvckltcGwobWFuYWdlcik7XG4gICAgICB9LFxuICAgICAgRGVjb3JhdGVkQ29tcG9uZW50OiBEZWNvcmF0ZWRDb21wb25lbnQsXG4gICAgICBnZXRUeXBlOiBnZXRUeXBlLFxuICAgICAgY29sbGVjdDogY29sbGVjdCxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9KTtcbiAgfTtcbn0iLCJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmltcG9ydCB7IGludmFyaWFudCB9IGZyb20gJ0ByZWFjdC1kbmQvaW52YXJpYW50JztcbmltcG9ydCB7IGlzUGxhaW5PYmplY3QsIGdldERlY29yYXRlZENvbXBvbmVudCB9IGZyb20gJy4vdXRpbHMnO1xudmFyIEFMTE9XRURfU1BFQ19NRVRIT0RTID0gWydjYW5Ecm9wJywgJ2hvdmVyJywgJ2Ryb3AnXTtcblxudmFyIFRhcmdldEltcGwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBUYXJnZXRJbXBsKHNwZWMsIG1vbml0b3IsIHJlZikge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUYXJnZXRJbXBsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInByb3BzXCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwic3BlY1wiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwibW9uaXRvclwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwicmVmXCIsIHZvaWQgMCk7XG5cbiAgICB0aGlzLnNwZWMgPSBzcGVjO1xuICAgIHRoaXMubW9uaXRvciA9IG1vbml0b3I7XG4gICAgdGhpcy5yZWYgPSByZWY7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoVGFyZ2V0SW1wbCwgW3tcbiAgICBrZXk6IFwicmVjZWl2ZVByb3BzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlY2VpdmVQcm9wcyhwcm9wcykge1xuICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWNlaXZlTW9uaXRvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWNlaXZlTW9uaXRvcihtb25pdG9yKSB7XG4gICAgICB0aGlzLm1vbml0b3IgPSBtb25pdG9yO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjYW5Ecm9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhbkRyb3AoKSB7XG4gICAgICBpZiAoIXRoaXMuc3BlYy5jYW5Ecm9wKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zcGVjLmNhbkRyb3AodGhpcy5wcm9wcywgdGhpcy5tb25pdG9yKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaG92ZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaG92ZXIoKSB7XG4gICAgICBpZiAoIXRoaXMuc3BlYy5ob3ZlciB8fCAhdGhpcy5wcm9wcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3BlYy5ob3Zlcih0aGlzLnByb3BzLCB0aGlzLm1vbml0b3IsIGdldERlY29yYXRlZENvbXBvbmVudCh0aGlzLnJlZikpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkcm9wXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRyb3AoKSB7XG4gICAgICBpZiAoIXRoaXMuc3BlYy5kcm9wKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBkcm9wUmVzdWx0ID0gdGhpcy5zcGVjLmRyb3AodGhpcy5wcm9wcywgdGhpcy5tb25pdG9yLCB0aGlzLnJlZi5jdXJyZW50KTtcblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgaW52YXJpYW50KHR5cGVvZiBkcm9wUmVzdWx0ID09PSAndW5kZWZpbmVkJyB8fCBpc1BsYWluT2JqZWN0KGRyb3BSZXN1bHQpLCAnZHJvcCgpIG11c3QgZWl0aGVyIHJldHVybiB1bmRlZmluZWQsIG9yIGFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIGRyb3AgcmVzdWx0LiAnICsgJ0luc3RlYWQgcmVjZWl2ZWQgJXMuICcgKyAnUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvZHJvcC10YXJnZXQnLCBkcm9wUmVzdWx0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRyb3BSZXN1bHQ7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFRhcmdldEltcGw7XG59KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUYXJnZXRGYWN0b3J5KHNwZWMpIHtcbiAgT2JqZWN0LmtleXMoc3BlYykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaW52YXJpYW50KEFMTE9XRURfU1BFQ19NRVRIT0RTLmluZGV4T2Yoa2V5KSA+IC0xLCAnRXhwZWN0ZWQgdGhlIGRyb3AgdGFyZ2V0IHNwZWNpZmljYXRpb24gdG8gb25seSBoYXZlICcgKyAnc29tZSBvZiB0aGUgZm9sbG93aW5nIGtleXM6ICVzLiAnICsgJ0luc3RlYWQgcmVjZWl2ZWQgYSBzcGVjaWZpY2F0aW9uIHdpdGggYW4gdW5leHBlY3RlZCBcIiVzXCIga2V5LiAnICsgJ1JlYWQgbW9yZTogaHR0cDovL3JlYWN0LWRuZC5naXRodWIuaW8vcmVhY3QtZG5kL2RvY3MvYXBpL2Ryb3AtdGFyZ2V0JywgQUxMT1dFRF9TUEVDX01FVEhPRFMuam9pbignLCAnKSwga2V5KTtcbiAgICBpbnZhcmlhbnQodHlwZW9mIHNwZWNba2V5XSA9PT0gJ2Z1bmN0aW9uJywgJ0V4cGVjdGVkICVzIGluIHRoZSBkcm9wIHRhcmdldCBzcGVjaWZpY2F0aW9uIHRvIGJlIGEgZnVuY3Rpb24uICcgKyAnSW5zdGVhZCByZWNlaXZlZCBhIHNwZWNpZmljYXRpb24gd2l0aCAlczogJXMuICcgKyAnUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvZHJvcC10YXJnZXQnLCBrZXksIGtleSwgc3BlY1trZXldKTtcbiAgfSk7XG4gIHJldHVybiBmdW5jdGlvbiBjcmVhdGVUYXJnZXQobW9uaXRvciwgcmVmKSB7XG4gICAgcmV0dXJuIG5ldyBUYXJnZXRJbXBsKHNwZWMsIG1vbml0b3IsIHJlZik7XG4gIH07XG59IiwiaW1wb3J0IHsgaW52YXJpYW50IH0gZnJvbSAnQHJlYWN0LWRuZC9pbnZhcmlhbnQnO1xuaW1wb3J0IHsgVGFyZ2V0Q29ubmVjdG9yLCBEcm9wVGFyZ2V0TW9uaXRvckltcGwsIHJlZ2lzdGVyVGFyZ2V0IH0gZnJvbSAnLi4vaW50ZXJuYWxzJztcbmltcG9ydCB7IGlzUGxhaW5PYmplY3QsIGlzVmFsaWRUeXBlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBjaGVja0RlY29yYXRvckFyZ3VtZW50cyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgZGVjb3JhdGVIYW5kbGVyIH0gZnJvbSAnLi9kZWNvcmF0ZUhhbmRsZXInO1xuaW1wb3J0IHsgY3JlYXRlVGFyZ2V0RmFjdG9yeSB9IGZyb20gJy4vY3JlYXRlVGFyZ2V0RmFjdG9yeSc7XG4vKipcbiAqIEBwYXJhbSB0eXBlIFRoZSBhY2NlcHRlZCB0YXJnZXQgdHlwZVxuICogQHBhcmFtIHNwZWMgVGhlIERyb3BUYXJnZXQgc3BlY2lmaWNhdGlvblxuICogQHBhcmFtIGNvbGxlY3QgVGhlIHByb3BzIGNvbGxlY3RvciBmdW5jdGlvblxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uc1xuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBEcm9wVGFyZ2V0KHR5cGUsIHNwZWMsIGNvbGxlY3QpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHt9O1xuICBjaGVja0RlY29yYXRvckFyZ3VtZW50cygnRHJvcFRhcmdldCcsICd0eXBlLCBzcGVjLCBjb2xsZWN0Wywgb3B0aW9uc10nLCB0eXBlLCBzcGVjLCBjb2xsZWN0LCBvcHRpb25zKTtcbiAgdmFyIGdldFR5cGUgPSB0eXBlO1xuXG4gIGlmICh0eXBlb2YgdHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGludmFyaWFudChpc1ZhbGlkVHlwZSh0eXBlLCB0cnVlKSwgJ0V4cGVjdGVkIFwidHlwZVwiIHByb3ZpZGVkIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0byBEcm9wVGFyZ2V0IHRvIGJlICcgKyAnYSBzdHJpbmcsIGFuIGFycmF5IG9mIHN0cmluZ3MsIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGVpdGhlciBnaXZlbiAnICsgJ3RoZSBjdXJyZW50IHByb3BzLiBJbnN0ZWFkLCByZWNlaXZlZCAlcy4gJyArICdSZWFkIG1vcmU6IGh0dHA6Ly9yZWFjdC1kbmQuZ2l0aHViLmlvL3JlYWN0LWRuZC9kb2NzL2FwaS9kcm9wLXRhcmdldCcsIHR5cGUpO1xuXG4gICAgZ2V0VHlwZSA9IGZ1bmN0aW9uIGdldFR5cGUoKSB7XG4gICAgICByZXR1cm4gdHlwZTtcbiAgICB9O1xuICB9XG5cbiAgaW52YXJpYW50KGlzUGxhaW5PYmplY3Qoc3BlYyksICdFeHBlY3RlZCBcInNwZWNcIiBwcm92aWRlZCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIERyb3BUYXJnZXQgdG8gYmUgJyArICdhIHBsYWluIG9iamVjdC4gSW5zdGVhZCwgcmVjZWl2ZWQgJXMuICcgKyAnUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvZHJvcC10YXJnZXQnLCBzcGVjKTtcbiAgdmFyIGNyZWF0ZVRhcmdldCA9IGNyZWF0ZVRhcmdldEZhY3Rvcnkoc3BlYyk7XG4gIGludmFyaWFudCh0eXBlb2YgY29sbGVjdCA9PT0gJ2Z1bmN0aW9uJywgJ0V4cGVjdGVkIFwiY29sbGVjdFwiIHByb3ZpZGVkIGFzIHRoZSB0aGlyZCBhcmd1bWVudCB0byBEcm9wVGFyZ2V0IHRvIGJlICcgKyAnYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwbGFpbiBvYmplY3Qgb2YgcHJvcHMgdG8gaW5qZWN0LiAnICsgJ0luc3RlYWQsIHJlY2VpdmVkICVzLiAnICsgJ1JlYWQgbW9yZTogaHR0cDovL3JlYWN0LWRuZC5naXRodWIuaW8vcmVhY3QtZG5kL2RvY3MvYXBpL2Ryb3AtdGFyZ2V0JywgY29sbGVjdCk7XG4gIGludmFyaWFudChpc1BsYWluT2JqZWN0KG9wdGlvbnMpLCAnRXhwZWN0ZWQgXCJvcHRpb25zXCIgcHJvdmlkZWQgYXMgdGhlIGZvdXJ0aCBhcmd1bWVudCB0byBEcm9wVGFyZ2V0IHRvIGJlICcgKyAnYSBwbGFpbiBvYmplY3Qgd2hlbiBzcGVjaWZpZWQuICcgKyAnSW5zdGVhZCwgcmVjZWl2ZWQgJXMuICcgKyAnUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvZHJvcC10YXJnZXQnLCBjb2xsZWN0KTtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlY29yYXRlVGFyZ2V0KERlY29yYXRlZENvbXBvbmVudCkge1xuICAgIHJldHVybiBkZWNvcmF0ZUhhbmRsZXIoe1xuICAgICAgY29udGFpbmVyRGlzcGxheU5hbWU6ICdEcm9wVGFyZ2V0JyxcbiAgICAgIGNyZWF0ZUhhbmRsZXI6IGNyZWF0ZVRhcmdldCxcbiAgICAgIHJlZ2lzdGVySGFuZGxlcjogcmVnaXN0ZXJUYXJnZXQsXG4gICAgICBjcmVhdGVNb25pdG9yOiBmdW5jdGlvbiBjcmVhdGVNb25pdG9yKG1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEcm9wVGFyZ2V0TW9uaXRvckltcGwobWFuYWdlcik7XG4gICAgICB9LFxuICAgICAgY3JlYXRlQ29ubmVjdG9yOiBmdW5jdGlvbiBjcmVhdGVDb25uZWN0b3IoYmFja2VuZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRhcmdldENvbm5lY3RvcihiYWNrZW5kKTtcbiAgICAgIH0sXG4gICAgICBEZWNvcmF0ZWRDb21wb25lbnQ6IERlY29yYXRlZENvbXBvbmVudCxcbiAgICAgIGdldFR5cGU6IGdldFR5cGUsXG4gICAgICBjb2xsZWN0OiBjb2xsZWN0LFxuICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH0pO1xuICB9O1xufSIsImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlU3VwZXIoRGVyaXZlZCkgeyB2YXIgaGFzTmF0aXZlUmVmbGVjdENvbnN0cnVjdCA9IF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKTsgcmV0dXJuIGZ1bmN0aW9uIF9jcmVhdGVTdXBlckludGVybmFsKCkgeyB2YXIgU3VwZXIgPSBfZ2V0UHJvdG90eXBlT2YoRGVyaXZlZCksIHJlc3VsdDsgaWYgKGhhc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QpIHsgdmFyIE5ld1RhcmdldCA9IF9nZXRQcm90b3R5cGVPZih0aGlzKS5jb25zdHJ1Y3RvcjsgcmVzdWx0ID0gUmVmbGVjdC5jb25zdHJ1Y3QoU3VwZXIsIGFyZ3VtZW50cywgTmV3VGFyZ2V0KTsgfSBlbHNlIHsgcmVzdWx0ID0gU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfSByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgcmVzdWx0KTsgfTsgfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7IHJldHVybiBjYWxsOyB9IGVsc2UgaWYgKGNhbGwgIT09IHZvaWQgMCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiRGVyaXZlZCBjb25zdHJ1Y3RvcnMgbWF5IG9ubHkgcmV0dXJuIG9iamVjdCBvciB1bmRlZmluZWRcIik7IH0gcmV0dXJuIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7IH1cblxuZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7IGlmIChzZWxmID09PSB2b2lkIDApIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pc05hdGl2ZVJlZmxlY3RDb25zdHJ1Y3QoKSB7IGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhUmVmbGVjdC5jb25zdHJ1Y3QpIHJldHVybiBmYWxzZTsgaWYgKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pIHJldHVybiBmYWxzZTsgaWYgKHR5cGVvZiBQcm94eSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gdHJ1ZTsgdHJ5IHsgQm9vbGVhbi5wcm90b3R5cGUudmFsdWVPZi5jYWxsKFJlZmxlY3QuY29uc3RydWN0KEJvb2xlYW4sIFtdLCBmdW5jdGlvbiAoKSB7fSkpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfVxuXG5mdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2YobykgeyByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pOyB9OyByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmltcG9ydCB7IGpzeCBhcyBfanN4IH0gZnJvbSBcInJlYWN0L2pzeC1ydW50aW1lXCI7XG5pbXBvcnQgeyBjcmVhdGVSZWYsIENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHNoYWxsb3dFcXVhbCB9IGZyb20gJ0ByZWFjdC1kbmQvc2hhbGxvd2VxdWFsJztcbmltcG9ydCB7IGludmFyaWFudCB9IGZyb20gJ0ByZWFjdC1kbmQvaW52YXJpYW50JztcbmltcG9ydCBob2lzdFN0YXRpY3MgZnJvbSAnaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MnO1xuaW1wb3J0IHsgRG5kQ29udGV4dCB9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0IHsgaXNSZWZhYmxlLCBjaGVja0RlY29yYXRvckFyZ3VtZW50cywgaXNQbGFpbk9iamVjdCB9IGZyb20gJy4vdXRpbHMnO1xuLyoqXG4gKiBAcGFyYW0gY29sbGVjdCBUaGUgcHJvcHMgY29sbGVjdG9yIGZ1bmN0aW9uXG4gKiBAcGFyYW0gb3B0aW9ucyBUaGUgRG5EIG9wdGlvbnNcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gRHJhZ0xheWVyKGNvbGxlY3QpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICBjaGVja0RlY29yYXRvckFyZ3VtZW50cygnRHJhZ0xheWVyJywgJ2NvbGxlY3RbLCBvcHRpb25zXScsIGNvbGxlY3QsIG9wdGlvbnMpO1xuICBpbnZhcmlhbnQodHlwZW9mIGNvbGxlY3QgPT09ICdmdW5jdGlvbicsICdFeHBlY3RlZCBcImNvbGxlY3RcIiBwcm92aWRlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdG8gRHJhZ0xheWVyIHRvIGJlIGEgZnVuY3Rpb24gdGhhdCBjb2xsZWN0cyBwcm9wcyB0byBpbmplY3QgaW50byB0aGUgY29tcG9uZW50LiAnLCAnSW5zdGVhZCwgcmVjZWl2ZWQgJXMuIFJlYWQgbW9yZTogaHR0cDovL3JlYWN0LWRuZC5naXRodWIuaW8vcmVhY3QtZG5kL2RvY3MvYXBpL2RyYWctbGF5ZXInLCBjb2xsZWN0KTtcbiAgaW52YXJpYW50KGlzUGxhaW5PYmplY3Qob3B0aW9ucyksICdFeHBlY3RlZCBcIm9wdGlvbnNcIiBwcm92aWRlZCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIERyYWdMYXllciB0byBiZSBhIHBsYWluIG9iamVjdCB3aGVuIHNwZWNpZmllZC4gJyArICdJbnN0ZWFkLCByZWNlaXZlZCAlcy4gUmVhZCBtb3JlOiBodHRwOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvZHJhZy1sYXllcicsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gZGVjb3JhdGVMYXllcihEZWNvcmF0ZWRDb21wb25lbnQpIHtcbiAgICB2YXIgRGVjb3JhdGVkID0gRGVjb3JhdGVkQ29tcG9uZW50O1xuICAgIHZhciBfb3B0aW9ucyRhcmVQcm9wc0VxdWEgPSBvcHRpb25zLmFyZVByb3BzRXF1YWwsXG4gICAgICAgIGFyZVByb3BzRXF1YWwgPSBfb3B0aW9ucyRhcmVQcm9wc0VxdWEgPT09IHZvaWQgMCA/IHNoYWxsb3dFcXVhbCA6IF9vcHRpb25zJGFyZVByb3BzRXF1YTtcbiAgICB2YXIgZGlzcGxheU5hbWUgPSBEZWNvcmF0ZWQuZGlzcGxheU5hbWUgfHwgRGVjb3JhdGVkLm5hbWUgfHwgJ0NvbXBvbmVudCc7XG5cbiAgICB2YXIgRHJhZ0xheWVyQ29udGFpbmVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gICAgICBfaW5oZXJpdHMoRHJhZ0xheWVyQ29udGFpbmVyLCBfQ29tcG9uZW50KTtcblxuICAgICAgdmFyIF9zdXBlciA9IF9jcmVhdGVTdXBlcihEcmFnTGF5ZXJDb250YWluZXIpO1xuXG4gICAgICBmdW5jdGlvbiBEcmFnTGF5ZXJDb250YWluZXIoKSB7XG4gICAgICAgIHZhciBfdGhpcztcblxuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRHJhZ0xheWVyQ29udGFpbmVyKTtcblxuICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMgPSBfc3VwZXIuY2FsbC5hcHBseShfc3VwZXIsIFt0aGlzXS5jb25jYXQoYXJncykpO1xuXG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJtYW5hZ2VyXCIsIHZvaWQgMCk7XG5cbiAgICAgICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcImlzQ3VycmVudGx5TW91bnRlZFwiLCBmYWxzZSk7XG5cbiAgICAgICAgX2RlZmluZVByb3BlcnR5KF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoX3RoaXMpLCBcInVuc3Vic2NyaWJlRnJvbU9mZnNldENoYW5nZVwiLCB2b2lkIDApO1xuXG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJ1bnN1YnNjcmliZUZyb21TdGF0ZUNoYW5nZVwiLCB2b2lkIDApO1xuXG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJyZWZcIiwgY3JlYXRlUmVmKCkpO1xuXG4gICAgICAgIF9kZWZpbmVQcm9wZXJ0eShfYXNzZXJ0VGhpc0luaXRpYWxpemVkKF90aGlzKSwgXCJoYW5kbGVDaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghX3RoaXMuaXNDdXJyZW50bHlNb3VudGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIG5leHRTdGF0ZSA9IF90aGlzLmdldEN1cnJlbnRTdGF0ZSgpO1xuXG4gICAgICAgICAgaWYgKCFzaGFsbG93RXF1YWwobmV4dFN0YXRlLCBfdGhpcy5zdGF0ZSkpIHtcbiAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKG5leHRTdGF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICB9XG5cbiAgICAgIF9jcmVhdGVDbGFzcyhEcmFnTGF5ZXJDb250YWluZXIsIFt7XG4gICAgICAgIGtleTogXCJnZXREZWNvcmF0ZWRDb21wb25lbnRJbnN0YW5jZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RGVjb3JhdGVkQ29tcG9uZW50SW5zdGFuY2UoKSB7XG4gICAgICAgICAgaW52YXJpYW50KHRoaXMucmVmLmN1cnJlbnQsICdJbiBvcmRlciB0byBhY2Nlc3MgYW4gaW5zdGFuY2Ugb2YgdGhlIGRlY29yYXRlZCBjb21wb25lbnQsIGl0IG11c3QgZWl0aGVyIGJlIGEgY2xhc3MgY29tcG9uZW50IG9yIHVzZSBSZWFjdC5mb3J3YXJkUmVmKCknKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZWYuY3VycmVudDtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6IFwic2hvdWxkQ29tcG9uZW50VXBkYXRlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzaG91bGRDb21wb25lbnRVcGRhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4gIWFyZVByb3BzRXF1YWwobmV4dFByb3BzLCB0aGlzLnByb3BzKSB8fCAhc2hhbGxvd0VxdWFsKG5leHRTdGF0ZSwgdGhpcy5zdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNvbXBvbmVudERpZE1vdW50XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICB0aGlzLmlzQ3VycmVudGx5TW91bnRlZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6IFwiY29tcG9uZW50V2lsbFVubW91bnRcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICAgIHRoaXMuaXNDdXJyZW50bHlNb3VudGVkID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAodGhpcy51bnN1YnNjcmliZUZyb21PZmZzZXRDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmVGcm9tT2Zmc2V0Q2hhbmdlKCk7XG4gICAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlRnJvbU9mZnNldENoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy51bnN1YnNjcmliZUZyb21TdGF0ZUNoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZUZyb21TdGF0ZUNoYW5nZSgpO1xuICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZUZyb21TdGF0ZUNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiBcInJlbmRlclwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgcmV0dXJuIF9qc3goRG5kQ29udGV4dC5Db25zdW1lciwge1xuICAgICAgICAgICAgY2hpbGRyZW46IGZ1bmN0aW9uIGNoaWxkcmVuKF9yZWYpIHtcbiAgICAgICAgICAgICAgdmFyIGRyYWdEcm9wTWFuYWdlciA9IF9yZWYuZHJhZ0Ryb3BNYW5hZ2VyO1xuXG4gICAgICAgICAgICAgIGlmIChkcmFnRHJvcE1hbmFnZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgX3RoaXMyLnJlY2VpdmVEcmFnRHJvcE1hbmFnZXIoZHJhZ0Ryb3BNYW5hZ2VyKTsgLy8gTGV0IGNvbXBvbmVudERpZE1vdW50IGZpcmUgdG8gaW5pdGlhbGl6ZSB0aGUgY29sbGVjdGVkIHN0YXRlXG5cblxuICAgICAgICAgICAgICBpZiAoIV90aGlzMi5pc0N1cnJlbnRseU1vdW50ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiBfanN4KERlY29yYXRlZCwgT2JqZWN0LmFzc2lnbih7fSwgX3RoaXMyLnByb3BzLCBfdGhpczIuc3RhdGUsIHtcbiAgICAgICAgICAgICAgICByZWY6IGlzUmVmYWJsZShEZWNvcmF0ZWQpID8gX3RoaXMyLnJlZiA6IG51bGxcbiAgICAgICAgICAgICAgfSksIHZvaWQgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdm9pZCAwKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6IFwicmVjZWl2ZURyYWdEcm9wTWFuYWdlclwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVjZWl2ZURyYWdEcm9wTWFuYWdlcihkcmFnRHJvcE1hbmFnZXIpIHtcbiAgICAgICAgICBpZiAodGhpcy5tYW5hZ2VyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLm1hbmFnZXIgPSBkcmFnRHJvcE1hbmFnZXI7XG4gICAgICAgICAgaW52YXJpYW50KF90eXBlb2YoZHJhZ0Ryb3BNYW5hZ2VyKSA9PT0gJ29iamVjdCcsICdDb3VsZCBub3QgZmluZCB0aGUgZHJhZyBhbmQgZHJvcCBtYW5hZ2VyIGluIHRoZSBjb250ZXh0IG9mICVzLiAnICsgJ01ha2Ugc3VyZSB0byByZW5kZXIgYSBEbmRQcm92aWRlciBjb21wb25lbnQgaW4geW91ciB0b3AtbGV2ZWwgY29tcG9uZW50LiAnICsgJ1JlYWQgbW9yZTogaHR0cDovL3JlYWN0LWRuZC5naXRodWIuaW8vcmVhY3QtZG5kL2RvY3MvdHJvdWJsZXNob290aW5nI2NvdWxkLW5vdC1maW5kLXRoZS1kcmFnLWFuZC1kcm9wLW1hbmFnZXItaW4tdGhlLWNvbnRleHQnLCBkaXNwbGF5TmFtZSwgZGlzcGxheU5hbWUpO1xuICAgICAgICAgIHZhciBtb25pdG9yID0gdGhpcy5tYW5hZ2VyLmdldE1vbml0b3IoKTtcbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlRnJvbU9mZnNldENoYW5nZSA9IG1vbml0b3Iuc3Vic2NyaWJlVG9PZmZzZXRDaGFuZ2UodGhpcy5oYW5kbGVDaGFuZ2UpO1xuICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmVGcm9tU3RhdGVDaGFuZ2UgPSBtb25pdG9yLnN1YnNjcmliZVRvU3RhdGVDaGFuZ2UodGhpcy5oYW5kbGVDaGFuZ2UpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogXCJnZXRDdXJyZW50U3RhdGVcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEN1cnJlbnRTdGF0ZSgpIHtcbiAgICAgICAgICBpZiAoIXRoaXMubWFuYWdlcikge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBtb25pdG9yID0gdGhpcy5tYW5hZ2VyLmdldE1vbml0b3IoKTtcbiAgICAgICAgICByZXR1cm4gY29sbGVjdChtb25pdG9yLCB0aGlzLnByb3BzKTtcbiAgICAgICAgfVxuICAgICAgfV0pO1xuXG4gICAgICByZXR1cm4gRHJhZ0xheWVyQ29udGFpbmVyO1xuICAgIH0oQ29tcG9uZW50KTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eShEcmFnTGF5ZXJDb250YWluZXIsIFwiZGlzcGxheU5hbWVcIiwgXCJEcmFnTGF5ZXIoXCIuY29uY2F0KGRpc3BsYXlOYW1lLCBcIilcIikpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KERyYWdMYXllckNvbnRhaW5lciwgXCJEZWNvcmF0ZWRDb21wb25lbnRcIiwgRGVjb3JhdGVkQ29tcG9uZW50KTtcblxuICAgIHJldHVybiBob2lzdFN0YXRpY3MoRHJhZ0xheWVyQ29udGFpbmVyLCBEZWNvcmF0ZWRDb21wb25lbnQpO1xuICB9O1xufSIsImltcG9ydCB7IHVzZUxheW91dEVmZmVjdCwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnOyAvLyBzdXBwcmVzcyB0aGUgdXNlTGF5b3V0RWZmZWN0IHdhcm5pbmcgb24gc2VydmVyIHNpZGUuXG5cbmV4cG9ydCB2YXIgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gdXNlTGF5b3V0RWZmZWN0IDogdXNlRWZmZWN0OyIsImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5leHBvcnQgdmFyIERyYWdTb3VyY2VJbXBsID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRHJhZ1NvdXJjZUltcGwoc3BlYywgbW9uaXRvciwgY29ubmVjdG9yKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERyYWdTb3VyY2VJbXBsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInNwZWNcIiwgdm9pZCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIm1vbml0b3JcIiwgdm9pZCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImNvbm5lY3RvclwiLCB2b2lkIDApO1xuXG4gICAgdGhpcy5zcGVjID0gc3BlYztcbiAgICB0aGlzLm1vbml0b3IgPSBtb25pdG9yO1xuICAgIHRoaXMuY29ubmVjdG9yID0gY29ubmVjdG9yO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKERyYWdTb3VyY2VJbXBsLCBbe1xuICAgIGtleTogXCJiZWdpbkRyYWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYmVnaW5EcmFnKCkge1xuICAgICAgdmFyIF9yZXN1bHQ7XG5cbiAgICAgIHZhciBzcGVjID0gdGhpcy5zcGVjO1xuICAgICAgdmFyIG1vbml0b3IgPSB0aGlzLm1vbml0b3I7XG4gICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgaWYgKF90eXBlb2Yoc3BlYy5pdGVtKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmVzdWx0ID0gc3BlYy5pdGVtO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BlYy5pdGVtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJlc3VsdCA9IHNwZWMuaXRlbShtb25pdG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKF9yZXN1bHQgPSByZXN1bHQpICE9PSBudWxsICYmIF9yZXN1bHQgIT09IHZvaWQgMCA/IF9yZXN1bHQgOiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjYW5EcmFnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhbkRyYWcoKSB7XG4gICAgICB2YXIgc3BlYyA9IHRoaXMuc3BlYztcbiAgICAgIHZhciBtb25pdG9yID0gdGhpcy5tb25pdG9yO1xuXG4gICAgICBpZiAodHlwZW9mIHNwZWMuY2FuRHJhZyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHJldHVybiBzcGVjLmNhbkRyYWc7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGVjLmNhbkRyYWcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIHNwZWMuY2FuRHJhZyhtb25pdG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc0RyYWdnaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzRHJhZ2dpbmcoZ2xvYmFsTW9uaXRvciwgdGFyZ2V0KSB7XG4gICAgICB2YXIgc3BlYyA9IHRoaXMuc3BlYztcbiAgICAgIHZhciBtb25pdG9yID0gdGhpcy5tb25pdG9yO1xuICAgICAgdmFyIGlzRHJhZ2dpbmcgPSBzcGVjLmlzRHJhZ2dpbmc7XG4gICAgICByZXR1cm4gaXNEcmFnZ2luZyA/IGlzRHJhZ2dpbmcobW9uaXRvcikgOiB0YXJnZXQgPT09IGdsb2JhbE1vbml0b3IuZ2V0U291cmNlSWQoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZW5kRHJhZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmREcmFnKCkge1xuICAgICAgdmFyIHNwZWMgPSB0aGlzLnNwZWM7XG4gICAgICB2YXIgbW9uaXRvciA9IHRoaXMubW9uaXRvcjtcbiAgICAgIHZhciBjb25uZWN0b3IgPSB0aGlzLmNvbm5lY3RvcjtcbiAgICAgIHZhciBlbmQgPSBzcGVjLmVuZDtcblxuICAgICAgaWYgKGVuZCkge1xuICAgICAgICBlbmQobW9uaXRvci5nZXRJdGVtKCksIG1vbml0b3IpO1xuICAgICAgfVxuXG4gICAgICBjb25uZWN0b3IucmVjb25uZWN0KCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIERyYWdTb3VyY2VJbXBsO1xufSgpOyIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IERyYWdTb3VyY2VJbXBsIH0gZnJvbSAnLi9EcmFnU291cmNlSW1wbCc7XG5leHBvcnQgZnVuY3Rpb24gdXNlRHJhZ1NvdXJjZShzcGVjLCBtb25pdG9yLCBjb25uZWN0b3IpIHtcbiAgdmFyIGhhbmRsZXIgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IERyYWdTb3VyY2VJbXBsKHNwZWMsIG1vbml0b3IsIGNvbm5lY3Rvcik7XG4gIH0sIFttb25pdG9yLCBjb25uZWN0b3JdKTtcbiAgdXNlRWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBoYW5kbGVyLnNwZWMgPSBzcGVjO1xuICB9LCBbc3BlY10pO1xuICByZXR1cm4gaGFuZGxlcjtcbn0iLCJpbXBvcnQgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgaW52YXJpYW50IH0gZnJvbSAnQHJlYWN0LWRuZC9pbnZhcmlhbnQnO1xuaW1wb3J0IHsgRG5kQ29udGV4dCB9IGZyb20gJy4uL2NvcmUnO1xuLyoqXG4gKiBBIGhvb2sgdG8gcmV0cmlldmUgdGhlIERyYWdEcm9wTWFuYWdlciBmcm9tIENvbnRleHRcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlRHJhZ0Ryb3BNYW5hZ2VyKCkge1xuICB2YXIgX3VzZUNvbnRleHQgPSB1c2VDb250ZXh0KERuZENvbnRleHQpLFxuICAgICAgZHJhZ0Ryb3BNYW5hZ2VyID0gX3VzZUNvbnRleHQuZHJhZ0Ryb3BNYW5hZ2VyO1xuXG4gIGludmFyaWFudChkcmFnRHJvcE1hbmFnZXIgIT0gbnVsbCwgJ0V4cGVjdGVkIGRyYWcgZHJvcCBjb250ZXh0Jyk7XG4gIHJldHVybiBkcmFnRHJvcE1hbmFnZXI7XG59IiwiaW1wb3J0IHsgaW52YXJpYW50IH0gZnJvbSAnQHJlYWN0LWRuZC9pbnZhcmlhbnQnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmV4cG9ydCBmdW5jdGlvbiB1c2VEcmFnVHlwZShzcGVjKSB7XG4gIHJldHVybiB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gc3BlYy50eXBlO1xuICAgIGludmFyaWFudChyZXN1bHQgIT0gbnVsbCwgJ3NwZWMudHlwZSBtdXN0IGJlIGRlZmluZWQnKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LCBbc3BlY10pO1xufSIsImZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfaSA9IGFyciA9PSBudWxsID8gbnVsbCA6IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJyW1N5bWJvbC5pdGVyYXRvcl0gfHwgYXJyW1wiQEBpdGVyYXRvclwiXTsgaWYgKF9pID09IG51bGwpIHJldHVybjsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfcywgX2U7IHRyeSB7IGZvciAoX2kgPSBfaS5jYWxsKGFycik7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuaW1wb3J0IHsgcmVnaXN0ZXJTb3VyY2UgfSBmcm9tICcuLi8uLi9pbnRlcm5hbHMnO1xuaW1wb3J0IHsgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCB9IGZyb20gJy4uL3VzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QnO1xuaW1wb3J0IHsgdXNlRHJhZ1NvdXJjZSB9IGZyb20gJy4vdXNlRHJhZ1NvdXJjZSc7XG5pbXBvcnQgeyB1c2VEcmFnRHJvcE1hbmFnZXIgfSBmcm9tICcuLi91c2VEcmFnRHJvcE1hbmFnZXInO1xuaW1wb3J0IHsgdXNlRHJhZ1R5cGUgfSBmcm9tICcuL3VzZURyYWdUeXBlJztcbmV4cG9ydCBmdW5jdGlvbiB1c2VSZWdpc3RlcmVkRHJhZ1NvdXJjZShzcGVjLCBtb25pdG9yLCBjb25uZWN0b3IpIHtcbiAgdmFyIG1hbmFnZXIgPSB1c2VEcmFnRHJvcE1hbmFnZXIoKTtcbiAgdmFyIGhhbmRsZXIgPSB1c2VEcmFnU291cmNlKHNwZWMsIG1vbml0b3IsIGNvbm5lY3Rvcik7XG4gIHZhciBpdGVtVHlwZSA9IHVzZURyYWdUeXBlKHNwZWMpO1xuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KGZ1bmN0aW9uIHJlZ2lzdGVyRHJhZ1NvdXJjZSgpIHtcbiAgICBpZiAoaXRlbVR5cGUgIT0gbnVsbCkge1xuICAgICAgdmFyIF9yZWdpc3RlclNvdXJjZSA9IHJlZ2lzdGVyU291cmNlKGl0ZW1UeXBlLCBoYW5kbGVyLCBtYW5hZ2VyKSxcbiAgICAgICAgICBfcmVnaXN0ZXJTb3VyY2UyID0gX3NsaWNlZFRvQXJyYXkoX3JlZ2lzdGVyU291cmNlLCAyKSxcbiAgICAgICAgICBoYW5kbGVySWQgPSBfcmVnaXN0ZXJTb3VyY2UyWzBdLFxuICAgICAgICAgIHVucmVnaXN0ZXIgPSBfcmVnaXN0ZXJTb3VyY2UyWzFdO1xuXG4gICAgICBtb25pdG9yLnJlY2VpdmVIYW5kbGVySWQoaGFuZGxlcklkKTtcbiAgICAgIGNvbm5lY3Rvci5yZWNlaXZlSGFuZGxlcklkKGhhbmRsZXJJZCk7XG4gICAgICByZXR1cm4gdW5yZWdpc3RlcjtcbiAgICB9XG4gIH0sIFttYW5hZ2VyLCBtb25pdG9yLCBjb25uZWN0b3IsIGhhbmRsZXIsIGl0ZW1UeXBlXSk7XG59IiwiZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyW1N5bWJvbC5pdGVyYXRvcl0gIT0gbnVsbCB8fCBpdGVyW1wiQEBpdGVyYXRvclwiXSAhPSBudWxsKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZU9wdGlvbmFsRmFjdG9yeShhcmcsIGRlcHMpIHtcbiAgdmFyIG1lbW9EZXBzID0gX3RvQ29uc3VtYWJsZUFycmF5KGRlcHMgfHwgW10pO1xuXG4gIGlmIChkZXBzID09IG51bGwgJiYgdHlwZW9mIGFyZyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIG1lbW9EZXBzLnB1c2goYXJnKTtcbiAgfVxuXG4gIHJldHVybiB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJyA/IGFyZygpIDogYXJnO1xuICB9LCBtZW1vRGVwcyk7XG59IiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IERyYWdTb3VyY2VNb25pdG9ySW1wbCB9IGZyb20gJy4uLy4uL2ludGVybmFscyc7XG5pbXBvcnQgeyB1c2VEcmFnRHJvcE1hbmFnZXIgfSBmcm9tICcuLi91c2VEcmFnRHJvcE1hbmFnZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZURyYWdTb3VyY2VNb25pdG9yKCkge1xuICB2YXIgbWFuYWdlciA9IHVzZURyYWdEcm9wTWFuYWdlcigpO1xuICByZXR1cm4gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBEcmFnU291cmNlTW9uaXRvckltcGwobWFuYWdlcik7XG4gIH0sIFttYW5hZ2VyXSk7XG59IiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFNvdXJjZUNvbm5lY3RvciB9IGZyb20gJy4uLy4uL2ludGVybmFscyc7XG5pbXBvcnQgeyB1c2VEcmFnRHJvcE1hbmFnZXIgfSBmcm9tICcuLi91c2VEcmFnRHJvcE1hbmFnZXInO1xuaW1wb3J0IHsgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCB9IGZyb20gJy4uL3VzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZURyYWdTb3VyY2VDb25uZWN0b3IoZHJhZ1NvdXJjZU9wdGlvbnMsIGRyYWdQcmV2aWV3T3B0aW9ucykge1xuICB2YXIgbWFuYWdlciA9IHVzZURyYWdEcm9wTWFuYWdlcigpO1xuICB2YXIgY29ubmVjdG9yID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VDb25uZWN0b3IobWFuYWdlci5nZXRCYWNrZW5kKCkpO1xuICB9LCBbbWFuYWdlcl0pO1xuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBjb25uZWN0b3IuZHJhZ1NvdXJjZU9wdGlvbnMgPSBkcmFnU291cmNlT3B0aW9ucyB8fCBudWxsO1xuICAgIGNvbm5lY3Rvci5yZWNvbm5lY3QoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNvbm5lY3Rvci5kaXNjb25uZWN0RHJhZ1NvdXJjZSgpO1xuICAgIH07XG4gIH0sIFtjb25uZWN0b3IsIGRyYWdTb3VyY2VPcHRpb25zXSk7XG4gIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGNvbm5lY3Rvci5kcmFnUHJldmlld09wdGlvbnMgPSBkcmFnUHJldmlld09wdGlvbnMgfHwgbnVsbDtcbiAgICBjb25uZWN0b3IucmVjb25uZWN0KCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBjb25uZWN0b3IuZGlzY29ubmVjdERyYWdQcmV2aWV3KCk7XG4gICAgfTtcbiAgfSwgW2Nvbm5lY3RvciwgZHJhZ1ByZXZpZXdPcHRpb25zXSk7XG4gIHJldHVybiBjb25uZWN0b3I7XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBkbyBub3QgZWRpdCAuanMgZmlsZXMgZGlyZWN0bHkgLSBlZGl0IHNyYy9pbmRleC5qc3RcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXF1YWwoYSwgYikge1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIHRydWU7XG5cbiAgaWYgKGEgJiYgYiAmJiB0eXBlb2YgYSA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgYiA9PSAnb2JqZWN0Jykge1xuICAgIGlmIChhLmNvbnN0cnVjdG9yICE9PSBiLmNvbnN0cnVjdG9yKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgbGVuZ3RoLCBpLCBrZXlzO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGEpKSB7XG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tICE9PSAwOylcbiAgICAgICAgaWYgKCFlcXVhbChhW2ldLCBiW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG5cblxuICAgIGlmIChhLmNvbnN0cnVjdG9yID09PSBSZWdFeHApIHJldHVybiBhLnNvdXJjZSA9PT0gYi5zb3VyY2UgJiYgYS5mbGFncyA9PT0gYi5mbGFncztcbiAgICBpZiAoYS52YWx1ZU9mICE9PSBPYmplY3QucHJvdG90eXBlLnZhbHVlT2YpIHJldHVybiBhLnZhbHVlT2YoKSA9PT0gYi52YWx1ZU9mKCk7XG4gICAgaWYgKGEudG9TdHJpbmcgIT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcpIHJldHVybiBhLnRvU3RyaW5nKCkgPT09IGIudG9TdHJpbmcoKTtcblxuICAgIGtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoICE9PSBPYmplY3Qua2V5cyhiKS5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tICE9PSAwOylcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIGtleXNbaV0pKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSAhPT0gMDspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuXG4gICAgICBpZiAoIWVxdWFsKGFba2V5XSwgYltrZXldKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gdHJ1ZSBpZiBib3RoIE5hTiwgZmFsc2Ugb3RoZXJ3aXNlXG4gIHJldHVybiBhIT09YSAmJiBiIT09Yjtcbn07XG4iLCJmdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHsgcmV0dXJuIF9hcnJheVdpdGhIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IF9ub25JdGVyYWJsZVJlc3QoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgeyB2YXIgX2kgPSBhcnIgPT0gbnVsbCA/IG51bGwgOiB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIGFycltTeW1ib2wuaXRlcmF0b3JdIHx8IGFycltcIkBAaXRlcmF0b3JcIl07IGlmIChfaSA9PSBudWxsKSByZXR1cm47IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX3MsIF9lOyB0cnkgeyBmb3IgKF9pID0gX2kuY2FsbChhcnIpOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyOyB9XG5cbmltcG9ydCBlcXVhbCBmcm9tICdmYXN0LWRlZXAtZXF1YWwnO1xuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCB9IGZyb20gJy4vdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCc7XG4vKipcbiAqXG4gKiBAcGFyYW0gbW9uaXRvciBUaGUgbW9uaXRvciB0byBjb2xsZWN0IHN0YXRlIGZyb21cbiAqIEBwYXJhbSBjb2xsZWN0IFRoZSBjb2xsZWN0aW5nIGZ1bmN0aW9uXG4gKiBAcGFyYW0gb25VcGRhdGUgQSBtZXRob2QgdG8gaW52b2tlIHdoZW4gdXBkYXRlcyBvY2N1clxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VDb2xsZWN0b3IobW9uaXRvciwgY29sbGVjdCwgb25VcGRhdGUpIHtcbiAgdmFyIF91c2VTdGF0ZSA9IHVzZVN0YXRlKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY29sbGVjdChtb25pdG9yKTtcbiAgfSksXG4gICAgICBfdXNlU3RhdGUyID0gX3NsaWNlZFRvQXJyYXkoX3VzZVN0YXRlLCAyKSxcbiAgICAgIGNvbGxlY3RlZCA9IF91c2VTdGF0ZTJbMF0sXG4gICAgICBzZXRDb2xsZWN0ZWQgPSBfdXNlU3RhdGUyWzFdO1xuXG4gIHZhciB1cGRhdGVDb2xsZWN0ZWQgPSB1c2VDYWxsYmFjayhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5leHRWYWx1ZSA9IGNvbGxlY3QobW9uaXRvcik7IC8vIFRoaXMgbmVlZHMgdG8gYmUgYSBkZWVwLWVxdWFsaXR5IGNoZWNrIGJlY2F1c2Ugc29tZSBtb25pdG9yLWNvbGxlY3RlZCB2YWx1ZXNcbiAgICAvLyBpbmNsdWRlIFhZQ29vcmQgb2JqZWN0cyB0aGF0IG1heSBiZSBlcXVpdmFsZW50LCBidXQgZG8gbm90IGhhdmUgaW5zdGFuY2UgZXF1YWxpdHkuXG5cbiAgICBpZiAoIWVxdWFsKGNvbGxlY3RlZCwgbmV4dFZhbHVlKSkge1xuICAgICAgc2V0Q29sbGVjdGVkKG5leHRWYWx1ZSk7XG5cbiAgICAgIGlmIChvblVwZGF0ZSkge1xuICAgICAgICBvblVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwgW2NvbGxlY3RlZCwgbW9uaXRvciwgb25VcGRhdGVdKTsgLy8gdXBkYXRlIHRoZSBjb2xsZWN0ZWQgcHJvcGVydGllcyBhZnRlciByZWFjdCByZW5kZXJzLlxuICAvLyBOb3RlIHRoYXQgdGhlIFwiRHVzdGJpbiBTdHJlc3MgVGVzdFwiIGZhaWxzIGlmIHRoaXMgaXMgbm90XG4gIC8vIGRvbmUgd2hlbiB0aGUgY29tcG9uZW50IHVwZGF0ZXNcblxuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KHVwZGF0ZUNvbGxlY3RlZCk7XG4gIHJldHVybiBbY29sbGVjdGVkLCB1cGRhdGVDb2xsZWN0ZWRdO1xufSIsImZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfaSA9IGFyciA9PSBudWxsID8gbnVsbCA6IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJyW1N5bWJvbC5pdGVyYXRvcl0gfHwgYXJyW1wiQEBpdGVyYXRvclwiXTsgaWYgKF9pID09IG51bGwpIHJldHVybjsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfcywgX2U7IHRyeSB7IGZvciAoX2kgPSBfaS5jYWxsKGFycik7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuaW1wb3J0IHsgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCB9IGZyb20gJy4vdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCc7XG5pbXBvcnQgeyB1c2VDb2xsZWN0b3IgfSBmcm9tICcuL3VzZUNvbGxlY3Rvcic7XG5leHBvcnQgZnVuY3Rpb24gdXNlTW9uaXRvck91dHB1dChtb25pdG9yLCBjb2xsZWN0LCBvbkNvbGxlY3QpIHtcbiAgdmFyIF91c2VDb2xsZWN0b3IgPSB1c2VDb2xsZWN0b3IobW9uaXRvciwgY29sbGVjdCwgb25Db2xsZWN0KSxcbiAgICAgIF91c2VDb2xsZWN0b3IyID0gX3NsaWNlZFRvQXJyYXkoX3VzZUNvbGxlY3RvciwgMiksXG4gICAgICBjb2xsZWN0ZWQgPSBfdXNlQ29sbGVjdG9yMlswXSxcbiAgICAgIHVwZGF0ZUNvbGxlY3RlZCA9IF91c2VDb2xsZWN0b3IyWzFdO1xuXG4gIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoZnVuY3Rpb24gc3Vic2NyaWJlVG9Nb25pdG9yU3RhdGVDaGFuZ2UoKSB7XG4gICAgdmFyIGhhbmRsZXJJZCA9IG1vbml0b3IuZ2V0SGFuZGxlcklkKCk7XG5cbiAgICBpZiAoaGFuZGxlcklkID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9uaXRvci5zdWJzY3JpYmVUb1N0YXRlQ2hhbmdlKHVwZGF0ZUNvbGxlY3RlZCwge1xuICAgICAgaGFuZGxlcklkczogW2hhbmRsZXJJZF1cbiAgICB9KTtcbiAgfSwgW21vbml0b3IsIHVwZGF0ZUNvbGxlY3RlZF0pO1xuICByZXR1cm4gY29sbGVjdGVkO1xufSIsImltcG9ydCB7IHVzZU1vbml0b3JPdXRwdXQgfSBmcm9tICcuL3VzZU1vbml0b3JPdXRwdXQnO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUNvbGxlY3RlZFByb3BzKGNvbGxlY3RvciwgbW9uaXRvciwgY29ubmVjdG9yKSB7XG4gIHJldHVybiB1c2VNb25pdG9yT3V0cHV0KG1vbml0b3IsIGNvbGxlY3RvciB8fCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvbm5lY3Rvci5yZWNvbm5lY3QoKTtcbiAgfSk7XG59IiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmV4cG9ydCBmdW5jdGlvbiB1c2VDb25uZWN0RHJhZ1NvdXJjZShjb25uZWN0b3IpIHtcbiAgcmV0dXJuIHVzZU1lbW8oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjb25uZWN0b3IuaG9va3MuZHJhZ1NvdXJjZSgpO1xuICB9LCBbY29ubmVjdG9yXSk7XG59XG5leHBvcnQgZnVuY3Rpb24gdXNlQ29ubmVjdERyYWdQcmV2aWV3KGNvbm5lY3Rvcikge1xuICByZXR1cm4gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvbm5lY3Rvci5ob29rcy5kcmFnUHJldmlldygpO1xuICB9LCBbY29ubmVjdG9yXSk7XG59IiwiaW1wb3J0IHsgdXNlUmVnaXN0ZXJlZERyYWdTb3VyY2UgfSBmcm9tICcuL3VzZVJlZ2lzdGVyZWREcmFnU291cmNlJztcbmltcG9ydCB7IHVzZU9wdGlvbmFsRmFjdG9yeSB9IGZyb20gJy4uL3VzZU9wdGlvbmFsRmFjdG9yeSc7XG5pbXBvcnQgeyB1c2VEcmFnU291cmNlTW9uaXRvciB9IGZyb20gJy4vdXNlRHJhZ1NvdXJjZU1vbml0b3InO1xuaW1wb3J0IHsgdXNlRHJhZ1NvdXJjZUNvbm5lY3RvciB9IGZyb20gJy4vdXNlRHJhZ1NvdXJjZUNvbm5lY3Rvcic7XG5pbXBvcnQgeyB1c2VDb2xsZWN0ZWRQcm9wcyB9IGZyb20gJy4uL3VzZUNvbGxlY3RlZFByb3BzJztcbmltcG9ydCB7IHVzZUNvbm5lY3REcmFnUHJldmlldywgdXNlQ29ubmVjdERyYWdTb3VyY2UgfSBmcm9tICcuL2Nvbm5lY3RvcnMnO1xuaW1wb3J0IHsgaW52YXJpYW50IH0gZnJvbSAnQHJlYWN0LWRuZC9pbnZhcmlhbnQnO1xuLyoqXG4gKiB1c2VEcmFnU291cmNlIGhvb2tcbiAqIEBwYXJhbSBzb3VyY2VTcGVjIFRoZSBkcmFnIHNvdXJjZSBzcGVjaWZpY2F0aW9uIChvYmplY3Qgb3IgZnVuY3Rpb24sIGZ1bmN0aW9uIHByZWZlcnJlZClcbiAqIEBwYXJhbSBkZXBzIFRoZSBtZW1vaXphdGlvbiBkZXBzIGFycmF5IHRvIHVzZSB3aGVuIGV2YWx1YXRpbmcgc3BlYyBjaGFuZ2VzXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURyYWcoc3BlY0FyZywgZGVwcykge1xuICB2YXIgc3BlYyA9IHVzZU9wdGlvbmFsRmFjdG9yeShzcGVjQXJnLCBkZXBzKTtcbiAgaW52YXJpYW50KCFzcGVjLmJlZ2luLCBcInVzZURyYWc6OnNwZWMuYmVnaW4gd2FzIGRlcHJlY2F0ZWQgaW4gdjE0LiBSZXBsYWNlIHNwZWMuYmVnaW4oKSB3aXRoIHNwZWMuaXRlbSgpLiAoc2VlIG1vcmUgaGVyZSAtIGh0dHBzOi8vcmVhY3QtZG5kLmdpdGh1Yi5pby9yZWFjdC1kbmQvZG9jcy9hcGkvdXNlLWRyYWcpXCIpO1xuICB2YXIgbW9uaXRvciA9IHVzZURyYWdTb3VyY2VNb25pdG9yKCk7XG4gIHZhciBjb25uZWN0b3IgPSB1c2VEcmFnU291cmNlQ29ubmVjdG9yKHNwZWMub3B0aW9ucywgc3BlYy5wcmV2aWV3T3B0aW9ucyk7XG4gIHVzZVJlZ2lzdGVyZWREcmFnU291cmNlKHNwZWMsIG1vbml0b3IsIGNvbm5lY3Rvcik7XG4gIHJldHVybiBbdXNlQ29sbGVjdGVkUHJvcHMoc3BlYy5jb2xsZWN0LCBtb25pdG9yLCBjb25uZWN0b3IpLCB1c2VDb25uZWN0RHJhZ1NvdXJjZShjb25uZWN0b3IpLCB1c2VDb25uZWN0RHJhZ1ByZXZpZXcoY29ubmVjdG9yKV07XG59IiwiaW1wb3J0IHsgaW52YXJpYW50IH0gZnJvbSAnQHJlYWN0LWRuZC9pbnZhcmlhbnQnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0Jztcbi8qKlxuICogSW50ZXJuYWwgdXRpbGl0eSBob29rIHRvIGdldCBhbiBhcnJheS12ZXJzaW9uIG9mIHNwZWMuYWNjZXB0LlxuICogVGhlIG1haW4gdXRpbGl0eSBoZXJlIGlzIHRoYXQgd2UgYXJlbid0IGNyZWF0aW5nIGEgbmV3IGFycmF5IG9uIGV2ZXJ5IHJlbmRlciBpZiBhIG5vbi1hcnJheSBzcGVjLmFjY2VwdCBpcyBwYXNzZWQgaW4uXG4gKiBAcGFyYW0gc3BlY1xuICovXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBY2NlcHQoc3BlYykge1xuICB2YXIgYWNjZXB0ID0gc3BlYy5hY2NlcHQ7XG4gIHJldHVybiB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICBpbnZhcmlhbnQoc3BlYy5hY2NlcHQgIT0gbnVsbCwgJ2FjY2VwdCBtdXN0IGJlIGRlZmluZWQnKTtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhY2NlcHQpID8gYWNjZXB0IDogW2FjY2VwdF07XG4gIH0sIFthY2NlcHRdKTtcbn0iLCJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmV4cG9ydCB2YXIgRHJvcFRhcmdldEltcGwgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEcm9wVGFyZ2V0SW1wbChzcGVjLCBtb25pdG9yKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERyb3BUYXJnZXRJbXBsKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInNwZWNcIiwgdm9pZCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIm1vbml0b3JcIiwgdm9pZCAwKTtcblxuICAgIHRoaXMuc3BlYyA9IHNwZWM7XG4gICAgdGhpcy5tb25pdG9yID0gbW9uaXRvcjtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhEcm9wVGFyZ2V0SW1wbCwgW3tcbiAgICBrZXk6IFwiY2FuRHJvcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjYW5Ecm9wKCkge1xuICAgICAgdmFyIHNwZWMgPSB0aGlzLnNwZWM7XG4gICAgICB2YXIgbW9uaXRvciA9IHRoaXMubW9uaXRvcjtcbiAgICAgIHJldHVybiBzcGVjLmNhbkRyb3AgPyBzcGVjLmNhbkRyb3AobW9uaXRvci5nZXRJdGVtKCksIG1vbml0b3IpIDogdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaG92ZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaG92ZXIoKSB7XG4gICAgICB2YXIgc3BlYyA9IHRoaXMuc3BlYztcbiAgICAgIHZhciBtb25pdG9yID0gdGhpcy5tb25pdG9yO1xuXG4gICAgICBpZiAoc3BlYy5ob3Zlcikge1xuICAgICAgICBzcGVjLmhvdmVyKG1vbml0b3IuZ2V0SXRlbSgpLCBtb25pdG9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZHJvcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkcm9wKCkge1xuICAgICAgdmFyIHNwZWMgPSB0aGlzLnNwZWM7XG4gICAgICB2YXIgbW9uaXRvciA9IHRoaXMubW9uaXRvcjtcblxuICAgICAgaWYgKHNwZWMuZHJvcCkge1xuICAgICAgICByZXR1cm4gc3BlYy5kcm9wKG1vbml0b3IuZ2V0SXRlbSgpLCBtb25pdG9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRHJvcFRhcmdldEltcGw7XG59KCk7IiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgRHJvcFRhcmdldEltcGwgfSBmcm9tICcuL0Ryb3BUYXJnZXRJbXBsJztcbmV4cG9ydCBmdW5jdGlvbiB1c2VEcm9wVGFyZ2V0KHNwZWMsIG1vbml0b3IpIHtcbiAgdmFyIGRyb3BUYXJnZXQgPSB1c2VNZW1vKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IERyb3BUYXJnZXRJbXBsKHNwZWMsIG1vbml0b3IpO1xuICB9LCBbbW9uaXRvcl0pO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIGRyb3BUYXJnZXQuc3BlYyA9IHNwZWM7XG4gIH0sIFtzcGVjXSk7XG4gIHJldHVybiBkcm9wVGFyZ2V0O1xufSIsImZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkgeyByZXR1cm4gX2FycmF5V2l0aEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgX25vbkl0ZXJhYmxlUmVzdCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7IHZhciBfaSA9IGFyciA9PSBudWxsID8gbnVsbCA6IHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgYXJyW1N5bWJvbC5pdGVyYXRvcl0gfHwgYXJyW1wiQEBpdGVyYXRvclwiXTsgaWYgKF9pID09IG51bGwpIHJldHVybjsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfcywgX2U7IHRyeSB7IGZvciAoX2kgPSBfaS5jYWxsKGFycik7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7IH1cblxuaW1wb3J0IHsgcmVnaXN0ZXJUYXJnZXQgfSBmcm9tICcuLi8uLi9pbnRlcm5hbHMnO1xuaW1wb3J0IHsgdXNlRHJhZ0Ryb3BNYW5hZ2VyIH0gZnJvbSAnLi4vdXNlRHJhZ0Ryb3BNYW5hZ2VyJztcbmltcG9ydCB7IHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QgfSBmcm9tICcuLi91c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0JztcbmltcG9ydCB7IHVzZUFjY2VwdCB9IGZyb20gJy4vdXNlQWNjZXB0JztcbmltcG9ydCB7IHVzZURyb3BUYXJnZXQgfSBmcm9tICcuL3VzZURyb3BUYXJnZXQnO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVJlZ2lzdGVyZWREcm9wVGFyZ2V0KHNwZWMsIG1vbml0b3IsIGNvbm5lY3Rvcikge1xuICB2YXIgbWFuYWdlciA9IHVzZURyYWdEcm9wTWFuYWdlcigpO1xuICB2YXIgZHJvcFRhcmdldCA9IHVzZURyb3BUYXJnZXQoc3BlYywgbW9uaXRvcik7XG4gIHZhciBhY2NlcHQgPSB1c2VBY2NlcHQoc3BlYyk7XG4gIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoZnVuY3Rpb24gcmVnaXN0ZXJEcm9wVGFyZ2V0KCkge1xuICAgIHZhciBfcmVnaXN0ZXJUYXJnZXQgPSByZWdpc3RlclRhcmdldChhY2NlcHQsIGRyb3BUYXJnZXQsIG1hbmFnZXIpLFxuICAgICAgICBfcmVnaXN0ZXJUYXJnZXQyID0gX3NsaWNlZFRvQXJyYXkoX3JlZ2lzdGVyVGFyZ2V0LCAyKSxcbiAgICAgICAgaGFuZGxlcklkID0gX3JlZ2lzdGVyVGFyZ2V0MlswXSxcbiAgICAgICAgdW5yZWdpc3RlciA9IF9yZWdpc3RlclRhcmdldDJbMV07XG5cbiAgICBtb25pdG9yLnJlY2VpdmVIYW5kbGVySWQoaGFuZGxlcklkKTtcbiAgICBjb25uZWN0b3IucmVjZWl2ZUhhbmRsZXJJZChoYW5kbGVySWQpO1xuICAgIHJldHVybiB1bnJlZ2lzdGVyO1xuICB9LCBbbWFuYWdlciwgbW9uaXRvciwgZHJvcFRhcmdldCwgY29ubmVjdG9yLCBhY2NlcHQubWFwKGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuIGEudG9TdHJpbmcoKTtcbiAgfSkuam9pbignfCcpXSk7XG59IiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IERyb3BUYXJnZXRNb25pdG9ySW1wbCB9IGZyb20gJy4uLy4uL2ludGVybmFscyc7XG5pbXBvcnQgeyB1c2VEcmFnRHJvcE1hbmFnZXIgfSBmcm9tICcuLi91c2VEcmFnRHJvcE1hbmFnZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZURyb3BUYXJnZXRNb25pdG9yKCkge1xuICB2YXIgbWFuYWdlciA9IHVzZURyYWdEcm9wTWFuYWdlcigpO1xuICByZXR1cm4gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBEcm9wVGFyZ2V0TW9uaXRvckltcGwobWFuYWdlcik7XG4gIH0sIFttYW5hZ2VyXSk7XG59IiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFRhcmdldENvbm5lY3RvciB9IGZyb20gJy4uLy4uL2ludGVybmFscyc7XG5pbXBvcnQgeyB1c2VEcmFnRHJvcE1hbmFnZXIgfSBmcm9tICcuLi91c2VEcmFnRHJvcE1hbmFnZXInO1xuaW1wb3J0IHsgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCB9IGZyb20gJy4uL3VzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZURyb3BUYXJnZXRDb25uZWN0b3Iob3B0aW9ucykge1xuICB2YXIgbWFuYWdlciA9IHVzZURyYWdEcm9wTWFuYWdlcigpO1xuICB2YXIgY29ubmVjdG9yID0gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBUYXJnZXRDb25uZWN0b3IobWFuYWdlci5nZXRCYWNrZW5kKCkpO1xuICB9LCBbbWFuYWdlcl0pO1xuICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KGZ1bmN0aW9uICgpIHtcbiAgICBjb25uZWN0b3IuZHJvcFRhcmdldE9wdGlvbnMgPSBvcHRpb25zIHx8IG51bGw7XG4gICAgY29ubmVjdG9yLnJlY29ubmVjdCgpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gY29ubmVjdG9yLmRpc2Nvbm5lY3REcm9wVGFyZ2V0KCk7XG4gICAgfTtcbiAgfSwgW29wdGlvbnNdKTtcbiAgcmV0dXJuIGNvbm5lY3Rvcjtcbn0iLCJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUNvbm5lY3REcm9wVGFyZ2V0KGNvbm5lY3Rvcikge1xuICByZXR1cm4gdXNlTWVtbyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvbm5lY3Rvci5ob29rcy5kcm9wVGFyZ2V0KCk7XG4gIH0sIFtjb25uZWN0b3JdKTtcbn0iLCJpbXBvcnQgeyB1c2VSZWdpc3RlcmVkRHJvcFRhcmdldCB9IGZyb20gJy4vdXNlUmVnaXN0ZXJlZERyb3BUYXJnZXQnO1xuaW1wb3J0IHsgdXNlT3B0aW9uYWxGYWN0b3J5IH0gZnJvbSAnLi4vdXNlT3B0aW9uYWxGYWN0b3J5JztcbmltcG9ydCB7IHVzZURyb3BUYXJnZXRNb25pdG9yIH0gZnJvbSAnLi91c2VEcm9wVGFyZ2V0TW9uaXRvcic7XG5pbXBvcnQgeyB1c2VEcm9wVGFyZ2V0Q29ubmVjdG9yIH0gZnJvbSAnLi91c2VEcm9wVGFyZ2V0Q29ubmVjdG9yJztcbmltcG9ydCB7IHVzZUNvbGxlY3RlZFByb3BzIH0gZnJvbSAnLi4vdXNlQ29sbGVjdGVkUHJvcHMnO1xuaW1wb3J0IHsgdXNlQ29ubmVjdERyb3BUYXJnZXQgfSBmcm9tICcuL2Nvbm5lY3RvcnMnO1xuLyoqXG4gKiB1c2VEcm9wVGFyZ2V0IEhvb2tcbiAqIEBwYXJhbSBzcGVjIFRoZSBkcm9wIHRhcmdldCBzcGVjaWZpY2F0aW9uIChvYmplY3Qgb3IgZnVuY3Rpb24sIGZ1bmN0aW9uIHByZWZlcnJlZClcbiAqIEBwYXJhbSBkZXBzIFRoZSBtZW1vaXphdGlvbiBkZXBzIGFycmF5IHRvIHVzZSB3aGVuIGV2YWx1YXRpbmcgc3BlYyBjaGFuZ2VzXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZURyb3Aoc3BlY0FyZywgZGVwcykge1xuICB2YXIgc3BlYyA9IHVzZU9wdGlvbmFsRmFjdG9yeShzcGVjQXJnLCBkZXBzKTtcbiAgdmFyIG1vbml0b3IgPSB1c2VEcm9wVGFyZ2V0TW9uaXRvcigpO1xuICB2YXIgY29ubmVjdG9yID0gdXNlRHJvcFRhcmdldENvbm5lY3RvcihzcGVjLm9wdGlvbnMpO1xuICB1c2VSZWdpc3RlcmVkRHJvcFRhcmdldChzcGVjLCBtb25pdG9yLCBjb25uZWN0b3IpO1xuICByZXR1cm4gW3VzZUNvbGxlY3RlZFByb3BzKHNwZWMuY29sbGVjdCwgbW9uaXRvciwgY29ubmVjdG9yKSwgdXNlQ29ubmVjdERyb3BUYXJnZXQoY29ubmVjdG9yKV07XG59IiwiZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7IHJldHVybiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBfbm9uSXRlcmFibGVSZXN0KCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTsgfVxuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7IGlmICghbykgcmV0dXJuOyBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7IGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7IGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pOyBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IH1cblxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHsgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgeyBhcnIyW2ldID0gYXJyW2ldOyB9IHJldHVybiBhcnIyOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHsgdmFyIF9pID0gYXJyID09IG51bGwgPyBudWxsIDogdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcnJbU3ltYm9sLml0ZXJhdG9yXSB8fCBhcnJbXCJAQGl0ZXJhdG9yXCJdOyBpZiAoX2kgPT0gbnVsbCkgcmV0dXJuOyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9zLCBfZTsgdHJ5IHsgZm9yIChfaSA9IF9pLmNhbGwoYXJyKTsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9XG5cbmZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjsgfVxuXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VEcmFnRHJvcE1hbmFnZXIgfSBmcm9tICcuL3VzZURyYWdEcm9wTWFuYWdlcic7XG5pbXBvcnQgeyB1c2VDb2xsZWN0b3IgfSBmcm9tICcuL3VzZUNvbGxlY3Rvcic7XG4vKipcbiAqIHVzZURyYWdMYXllciBIb29rXG4gKiBAcGFyYW0gY29sbGVjdG9yIFRoZSBwcm9wZXJ0eSBjb2xsZWN0b3JcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlRHJhZ0xheWVyKGNvbGxlY3QpIHtcbiAgdmFyIGRyYWdEcm9wTWFuYWdlciA9IHVzZURyYWdEcm9wTWFuYWdlcigpO1xuICB2YXIgbW9uaXRvciA9IGRyYWdEcm9wTWFuYWdlci5nZXRNb25pdG9yKCk7XG5cbiAgdmFyIF91c2VDb2xsZWN0b3IgPSB1c2VDb2xsZWN0b3IobW9uaXRvciwgY29sbGVjdCksXG4gICAgICBfdXNlQ29sbGVjdG9yMiA9IF9zbGljZWRUb0FycmF5KF91c2VDb2xsZWN0b3IsIDIpLFxuICAgICAgY29sbGVjdGVkID0gX3VzZUNvbGxlY3RvcjJbMF0sXG4gICAgICB1cGRhdGVDb2xsZWN0ZWQgPSBfdXNlQ29sbGVjdG9yMlsxXTtcblxuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBtb25pdG9yLnN1YnNjcmliZVRvT2Zmc2V0Q2hhbmdlKHVwZGF0ZUNvbGxlY3RlZCk7XG4gIH0pO1xuICB1c2VFZmZlY3QoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBtb25pdG9yLnN1YnNjcmliZVRvU3RhdGVDaGFuZ2UodXBkYXRlQ29sbGVjdGVkKTtcbiAgfSk7XG4gIHJldHVybiBjb2xsZWN0ZWQ7XG59Il0sIm5hbWVzIjpbImdldE93blByb3BlcnR5U3ltYm9scyIsImYiLCJnIiwiaCIsIm0iLCJuIiwicCIsInEiLCJqc3hSdW50aW1lTW9kdWxlIiwicmVxdWlyZSQkMCIsIl90eXBlb2YiLCJ2ZXJpZnlJbnZhcmlhbnRzIiwib3duS2V5cyIsIl9vYmplY3RTcHJlYWQiLCJfZGVmaW5lUHJvcGVydHkiLCJfY2xhc3NDYWxsQ2hlY2siLCJfZGVmaW5lUHJvcGVydGllcyIsIl9jcmVhdGVDbGFzcyIsImlzUGxhaW5PYmplY3QiLCJpbml0aWFsU3RhdGUiLCJyZWR1Y2UiLCJkaXJ0eUhhbmRsZXJJZHMiLCJkcmFnT2Zmc2V0IiwicmVmQ291bnQiLCJkcmFnT3BlcmF0aW9uIiwic3RhdGVJZCIsImdldFNvdXJjZUNsaWVudE9mZnNldCIsIl9nZXRTb3VyY2VDbGllbnRPZmZzZXQiLCJnZXREaWZmZXJlbmNlRnJvbUluaXRpYWxPZmZzZXQiLCJfZ2V0RGlmZmVyZW5jZUZyb21Jbml0aWFsT2Zmc2V0IiwiX3NsaWNlZFRvQXJyYXkiLCJfYXJyYXlXaXRoSG9sZXMiLCJfaXRlcmFibGVUb0FycmF5TGltaXQiLCJfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkiLCJfbm9uSXRlcmFibGVSZXN0IiwiX2FycmF5TGlrZVRvQXJyYXkiLCJhZGRTb3VyY2UiLCJfYWRkU291cmNlIiwiYWRkVGFyZ2V0IiwiX2FkZFRhcmdldCIsInJlbW92ZVNvdXJjZSIsIl9yZW1vdmVTb3VyY2UiLCJyZW1vdmVUYXJnZXQiLCJfcmVtb3ZlVGFyZ2V0IiwiX2pzeCIsInJlYWN0SXNNb2R1bGUiLCJfaW5oZXJpdHMiLCJfc2V0UHJvdG90eXBlT2YiLCJfY3JlYXRlU3VwZXIiLCJfaXNOYXRpdmVSZWZsZWN0Q29uc3RydWN0IiwiX2dldFByb3RvdHlwZU9mIiwiX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4iLCJfYXNzZXJ0VGhpc0luaXRpYWxpemVkIiwiQUxMT1dFRF9TUEVDX01FVEhPRFMiLCJlcXVhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUNBO01BQ0E7TUFDQTtBQUNBO0FBQ1UsVUFBQyxVQUFVLHlCQUFHLGFBQWEsQ0FBQztNQUN0QyxFQUFFLGVBQWUsRUFBRSxTQUFTO01BQzVCLENBQUM7Ozs7Ozs7Ozs7O01DQUQ7TUFDQSxJQUFJQSx1QkFBcUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7TUFDekQsSUFBSSxjQUFjLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7TUFDckQsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO0FBQzdEO01BQ0EsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFO01BQ3ZCLENBQUMsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7TUFDeEMsRUFBRSxNQUFNLElBQUks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Q0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDelcsU0FBU0MsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDRixHQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDQyxHQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxRQUFRLENBQUNKLEdBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQ0UsR0FBQyxDQUFDLE9BQU8sQ0FBQyxtQ0FBWSxDQUFDRyx1Q0FBYyxD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QyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssV0FBVyxJQUFJLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPQSxtQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRTtBQUNoYTtNQUNBLFNBQVNBLG1CQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUU7QUFDdkw7TUFDQSxTQUFTSCx1QkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMs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QUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUU7QUFDdkw7TUFDQSxTQUFTSCx1QkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsU0FB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Q0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO21DQUM5YyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQ0FBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsbUNBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLHFDQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxtQ0FBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTsrQ0FDbE4sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsT0FBTyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsUUFB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LElBQUksRUFBRSxHQUFHLEdBQUcsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUU7QUFDamdCO01BQ0EsU0FBU0QsaUJBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUs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O01BQ0EsU0FBU0EsbUJBQWlCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRTtBQUN2TDtNQUNBLFNBQVNILHVCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxHQUFHLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENB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QyxDQUFDLENBQUMsRUFBRSxPQUFPQSxtQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRTtBQUNoYTtNQUNBLFNBQVNBLG1CQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUU7QUFDdkw7TUFDQSxTQUFTSCx1QkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLElB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U0FBUyxnQkFBZ0IsR0FBRyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsMklBQTJJLENBQUMsQ0FBQyxFQUFFO0FBQ2pNO01BQ0EsU0FBUywyQkFBMkIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUUsT0FBTyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssV0FBVyxJQUFJLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLGlCQUFpQixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQ2hhO01BQ0EsU0FBUyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFO0FBQ3ZMO01BQ0EsU0FBUyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRTtBQUNqZ0I7TUFDQSxTQUFTLGVBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsRUFBRTtNQUtyRTtNQUNBO01BQ0E7TUFDQTtBQUNBO01BQ08sU0FBUyxZQUFZLENBQUMsT0FBTyxFQUFFO01BQ3RDLEVBQUUsSUFBSSxlQUFlLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztNQUM3QyxFQUFFLElBQUksT0FBTyxHQUFHLGVBQWUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUM3QztNQUNBLEVBQUUsSUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7TUFDcEQsTUFBTSxjQUFjLEdBQUcsY0FBYyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7TUFDdkQsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQztNQUNuQyxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUM7TUFDQSxFQUFFLFNBQVMsQ0FBQyxZQUFZO01BQ3hCLElBQUksT0FBTyxPQUFPLENBQUMsdUJBQXVCLENBQUMsZUFBZSxDQUFDLENBQUM7TUFDNUQsR0FBRyxDQUFDLENBQUM7TUFDTCxFQUFFLFNBQVMsQ0FBQyxZQUFZO01BQ3hCLElBQUksT0FBTyxPQUFPLENBQUMsc0JBQXNCLENBQUMsZUFBZSxDQUFDLENBQUM7TUFDM0QsR0FBRyxDQUFDLENBQUM7TUFDTCxFQUFFLE9BQU8sU0FBUyxDQUFDO01BQ25COzs7Ozs7OzsifQ==
