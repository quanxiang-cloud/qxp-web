System.register(['draft-js'], (function (exports) {
	'use strict';
	var require$$1;
	return {
		setters: [function (module) {
			require$$1 = module["default"];
		}],
		execute: (function () {

			var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

			function getDefaultExportFromCjs (x) {
				return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
			}

			var htmlToDraftjs$1 = {exports: {}};

			var immutable = {exports: {}};

			/**
			 *  Copyright (c) 2014-2015, Facebook, Inc.
			 *  All rights reserved.
			 *
			 *  This source code is licensed under the BSD-style license found in the
			 *  LICENSE file in the root directory of this source tree. An additional grant
			 *  of patent rights can be found in the PATENTS file in the same directory.
			 */

			(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory() ;
			}(commonjsGlobal, function () {var SLICE$0 = Array.prototype.slice;

			  function createClass(ctor, superClass) {
			    if (superClass) {
			      ctor.prototype = Object.create(superClass.prototype);
			    }
			    ctor.prototype.constructor = ctor;
			  }

			  function Iterable(value) {
			      return isIterable(value) ? value : Seq(value);
			    }


			  createClass(KeyedIterable, Iterable);
			    function KeyedIterable(value) {
			      return isKeyed(value) ? value : KeyedSeq(value);
			    }


			  createClass(IndexedIterable, Iterable);
			    function IndexedIterable(value) {
			      return isIndexed(value) ? value : IndexedSeq(value);
			    }


			  createClass(SetIterable, Iterable);
			    function SetIterable(value) {
			      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
			    }



			  function isIterable(maybeIterable) {
			    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
			  }

			  function isKeyed(maybeKeyed) {
			    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
			  }

			  function isIndexed(maybeIndexed) {
			    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
			  }

			  function isAssociative(maybeAssociative) {
			    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
			  }

			  function isOrdered(maybeOrdered) {
			    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
			  }

			  Iterable.isIterable = isIterable;
			  Iterable.isKeyed = isKeyed;
			  Iterable.isIndexed = isIndexed;
			  Iterable.isAssociative = isAssociative;
			  Iterable.isOrdered = isOrdered;

			  Iterable.Keyed = KeyedIterable;
			  Iterable.Indexed = IndexedIterable;
			  Iterable.Set = SetIterable;


			  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
			  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
			  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
			  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

			  // Used for setting prototype methods that IE8 chokes on.
			  var DELETE = 'delete';

			  // Constants describing the size of trie nodes.
			  var SHIFT = 5; // Resulted in best performance after ______?
			  var SIZE = 1 << SHIFT;
			  var MASK = SIZE - 1;

			  // A consistent shared value representing "not set" which equals nothing other
			  // than itself, and nothing that could be provided externally.
			  var NOT_SET = {};

			  // Boolean references, Rough equivalent of `bool &`.
			  var CHANGE_LENGTH = { value: false };
			  var DID_ALTER = { value: false };

			  function MakeRef(ref) {
			    ref.value = false;
			    return ref;
			  }

			  function SetRef(ref) {
			    ref && (ref.value = true);
			  }

			  // A function which returns a value representing an "owner" for transient writes
			  // to tries. The return value will only ever equal itself, and will not equal
			  // the return of any subsequent call of this function.
			  function OwnerID() {}

			  // http://jsperf.com/copy-array-inline
			  function arrCopy(arr, offset) {
			    offset = offset || 0;
			    var len = Math.max(0, arr.length - offset);
			    var newArr = new Array(len);
			    for (var ii = 0; ii < len; ii++) {
			      newArr[ii] = arr[ii + offset];
			    }
			    return newArr;
			  }

			  function ensureSize(iter) {
			    if (iter.size === undefined) {
			      iter.size = iter.__iterate(returnTrue);
			    }
			    return iter.size;
			  }

			  function wrapIndex(iter, index) {
			    // This implements "is array index" which the ECMAString spec defines as:
			    //
			    //     A String property name P is an array index if and only if
			    //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
			    //     to 2^32−1.
			    //
			    // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
			    if (typeof index !== 'number') {
			      var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
			      if ('' + uint32Index !== index || uint32Index === 4294967295) {
			        return NaN;
			      }
			      index = uint32Index;
			    }
			    return index < 0 ? ensureSize(iter) + index : index;
			  }

			  function returnTrue() {
			    return true;
			  }

			  function wholeSlice(begin, end, size) {
			    return (begin === 0 || (size !== undefined && begin <= -size)) &&
			      (end === undefined || (size !== undefined && end >= size));
			  }

			  function resolveBegin(begin, size) {
			    return resolveIndex(begin, size, 0);
			  }

			  function resolveEnd(end, size) {
			    return resolveIndex(end, size, size);
			  }

			  function resolveIndex(index, size, defaultIndex) {
			    return index === undefined ?
			      defaultIndex :
			      index < 0 ?
			        Math.max(0, size + index) :
			        size === undefined ?
			          index :
			          Math.min(size, index);
			  }

			  /* global Symbol */

			  var ITERATE_KEYS = 0;
			  var ITERATE_VALUES = 1;
			  var ITERATE_ENTRIES = 2;

			  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
			  var FAUX_ITERATOR_SYMBOL = '@@iterator';

			  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;


			  function Iterator(next) {
			      this.next = next;
			    }

			    Iterator.prototype.toString = function() {
			      return '[Iterator]';
			    };


			  Iterator.KEYS = ITERATE_KEYS;
			  Iterator.VALUES = ITERATE_VALUES;
			  Iterator.ENTRIES = ITERATE_ENTRIES;

			  Iterator.prototype.inspect =
			  Iterator.prototype.toSource = function () { return this.toString(); };
			  Iterator.prototype[ITERATOR_SYMBOL] = function () {
			    return this;
			  };


			  function iteratorValue(type, k, v, iteratorResult) {
			    var value = type === 0 ? k : type === 1 ? v : [k, v];
			    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
			      value: value, done: false
			    });
			    return iteratorResult;
			  }

			  function iteratorDone() {
			    return { value: undefined, done: true };
			  }

			  function hasIterator(maybeIterable) {
			    return !!getIteratorFn(maybeIterable);
			  }

			  function isIterator(maybeIterator) {
			    return maybeIterator && typeof maybeIterator.next === 'function';
			  }

			  function getIterator(iterable) {
			    var iteratorFn = getIteratorFn(iterable);
			    return iteratorFn && iteratorFn.call(iterable);
			  }

			  function getIteratorFn(iterable) {
			    var iteratorFn = iterable && (
			      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
			      iterable[FAUX_ITERATOR_SYMBOL]
			    );
			    if (typeof iteratorFn === 'function') {
			      return iteratorFn;
			    }
			  }

			  function isArrayLike(value) {
			    return value && typeof value.length === 'number';
			  }

			  createClass(Seq, Iterable);
			    function Seq(value) {
			      return value === null || value === undefined ? emptySequence() :
			        isIterable(value) ? value.toSeq() : seqFromValue(value);
			    }

			    Seq.of = function(/*...values*/) {
			      return Seq(arguments);
			    };

			    Seq.prototype.toSeq = function() {
			      return this;
			    };

			    Seq.prototype.toString = function() {
			      return this.__toString('Seq {', '}');
			    };

			    Seq.prototype.cacheResult = function() {
			      if (!this._cache && this.__iterateUncached) {
			        this._cache = this.entrySeq().toArray();
			        this.size = this._cache.length;
			      }
			      return this;
			    };

			    // abstract __iterateUncached(fn, reverse)

			    Seq.prototype.__iterate = function(fn, reverse) {
			      return seqIterate(this, fn, reverse, true);
			    };

			    // abstract __iteratorUncached(type, reverse)

			    Seq.prototype.__iterator = function(type, reverse) {
			      return seqIterator(this, type, reverse, true);
			    };



			  createClass(KeyedSeq, Seq);
			    function KeyedSeq(value) {
			      return value === null || value === undefined ?
			        emptySequence().toKeyedSeq() :
			        isIterable(value) ?
			          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
			          keyedSeqFromValue(value);
			    }

			    KeyedSeq.prototype.toKeyedSeq = function() {
			      return this;
			    };



			  createClass(IndexedSeq, Seq);
			    function IndexedSeq(value) {
			      return value === null || value === undefined ? emptySequence() :
			        !isIterable(value) ? indexedSeqFromValue(value) :
			        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
			    }

			    IndexedSeq.of = function(/*...values*/) {
			      return IndexedSeq(arguments);
			    };

			    IndexedSeq.prototype.toIndexedSeq = function() {
			      return this;
			    };

			    IndexedSeq.prototype.toString = function() {
			      return this.__toString('Seq [', ']');
			    };

			    IndexedSeq.prototype.__iterate = function(fn, reverse) {
			      return seqIterate(this, fn, reverse, false);
			    };

			    IndexedSeq.prototype.__iterator = function(type, reverse) {
			      return seqIterator(this, type, reverse, false);
			    };



			  createClass(SetSeq, Seq);
			    function SetSeq(value) {
			      return (
			        value === null || value === undefined ? emptySequence() :
			        !isIterable(value) ? indexedSeqFromValue(value) :
			        isKeyed(value) ? value.entrySeq() : value
			      ).toSetSeq();
			    }

			    SetSeq.of = function(/*...values*/) {
			      return SetSeq(arguments);
			    };

			    SetSeq.prototype.toSetSeq = function() {
			      return this;
			    };



			  Seq.isSeq = isSeq;
			  Seq.Keyed = KeyedSeq;
			  Seq.Set = SetSeq;
			  Seq.Indexed = IndexedSeq;

			  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

			  Seq.prototype[IS_SEQ_SENTINEL] = true;



			  createClass(ArraySeq, IndexedSeq);
			    function ArraySeq(array) {
			      this._array = array;
			      this.size = array.length;
			    }

			    ArraySeq.prototype.get = function(index, notSetValue) {
			      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
			    };

			    ArraySeq.prototype.__iterate = function(fn, reverse) {
			      var array = this._array;
			      var maxIndex = array.length - 1;
			      for (var ii = 0; ii <= maxIndex; ii++) {
			        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
			          return ii + 1;
			        }
			      }
			      return ii;
			    };

			    ArraySeq.prototype.__iterator = function(type, reverse) {
			      var array = this._array;
			      var maxIndex = array.length - 1;
			      var ii = 0;
			      return new Iterator(function() 
			        {return ii > maxIndex ?
			          iteratorDone() :
			          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
			      );
			    };



			  createClass(ObjectSeq, KeyedSeq);
			    function ObjectSeq(object) {
			      var keys = Object.keys(object);
			      this._object = object;
			      this._keys = keys;
			      this.size = keys.length;
			    }

			    ObjectSeq.prototype.get = function(key, notSetValue) {
			      if (notSetValue !== undefined && !this.has(key)) {
			        return notSetValue;
			      }
			      return this._object[key];
			    };

			    ObjectSeq.prototype.has = function(key) {
			      return this._object.hasOwnProperty(key);
			    };

			    ObjectSeq.prototype.__iterate = function(fn, reverse) {
			      var object = this._object;
			      var keys = this._keys;
			      var maxIndex = keys.length - 1;
			      for (var ii = 0; ii <= maxIndex; ii++) {
			        var key = keys[reverse ? maxIndex - ii : ii];
			        if (fn(object[key], key, this) === false) {
			          return ii + 1;
			        }
			      }
			      return ii;
			    };

			    ObjectSeq.prototype.__iterator = function(type, reverse) {
			      var object = this._object;
			      var keys = this._keys;
			      var maxIndex = keys.length - 1;
			      var ii = 0;
			      return new Iterator(function()  {
			        var key = keys[reverse ? maxIndex - ii : ii];
			        return ii++ > maxIndex ?
			          iteratorDone() :
			          iteratorValue(type, key, object[key]);
			      });
			    };

			  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;


			  createClass(IterableSeq, IndexedSeq);
			    function IterableSeq(iterable) {
			      this._iterable = iterable;
			      this.size = iterable.length || iterable.size;
			    }

			    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
			      if (reverse) {
			        return this.cacheResult().__iterate(fn, reverse);
			      }
			      var iterable = this._iterable;
			      var iterator = getIterator(iterable);
			      var iterations = 0;
			      if (isIterator(iterator)) {
			        var step;
			        while (!(step = iterator.next()).done) {
			          if (fn(step.value, iterations++, this) === false) {
			            break;
			          }
			        }
			      }
			      return iterations;
			    };

			    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
			      if (reverse) {
			        return this.cacheResult().__iterator(type, reverse);
			      }
			      var iterable = this._iterable;
			      var iterator = getIterator(iterable);
			      if (!isIterator(iterator)) {
			        return new Iterator(iteratorDone);
			      }
			      var iterations = 0;
			      return new Iterator(function()  {
			        var step = iterator.next();
			        return step.done ? step : iteratorValue(type, iterations++, step.value);
			      });
			    };



			  createClass(IteratorSeq, IndexedSeq);
			    function IteratorSeq(iterator) {
			      this._iterator = iterator;
			      this._iteratorCache = [];
			    }

			    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
			      if (reverse) {
			        return this.cacheResult().__iterate(fn, reverse);
			      }
			      var iterator = this._iterator;
			      var cache = this._iteratorCache;
			      var iterations = 0;
			      while (iterations < cache.length) {
			        if (fn(cache[iterations], iterations++, this) === false) {
			          return iterations;
			        }
			      }
			      var step;
			      while (!(step = iterator.next()).done) {
			        var val = step.value;
			        cache[iterations] = val;
			        if (fn(val, iterations++, this) === false) {
			          break;
			        }
			      }
			      return iterations;
			    };

			    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
			      if (reverse) {
			        return this.cacheResult().__iterator(type, reverse);
			      }
			      var iterator = this._iterator;
			      var cache = this._iteratorCache;
			      var iterations = 0;
			      return new Iterator(function()  {
			        if (iterations >= cache.length) {
			          var step = iterator.next();
			          if (step.done) {
			            return step;
			          }
			          cache[iterations] = step.value;
			        }
			        return iteratorValue(type, iterations, cache[iterations++]);
			      });
			    };




			  // # pragma Helper functions

			  function isSeq(maybeSeq) {
			    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
			  }

			  var EMPTY_SEQ;

			  function emptySequence() {
			    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
			  }

			  function keyedSeqFromValue(value) {
			    var seq =
			      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
			      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
			      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
			      typeof value === 'object' ? new ObjectSeq(value) :
			      undefined;
			    if (!seq) {
			      throw new TypeError(
			        'Expected Array or iterable object of [k, v] entries, '+
			        'or keyed object: ' + value
			      );
			    }
			    return seq;
			  }

			  function indexedSeqFromValue(value) {
			    var seq = maybeIndexedSeqFromValue(value);
			    if (!seq) {
			      throw new TypeError(
			        'Expected Array or iterable object of values: ' + value
			      );
			    }
			    return seq;
			  }

			  function seqFromValue(value) {
			    var seq = maybeIndexedSeqFromValue(value) ||
			      (typeof value === 'object' && new ObjectSeq(value));
			    if (!seq) {
			      throw new TypeError(
			        'Expected Array or iterable object of values, or keyed object: ' + value
			      );
			    }
			    return seq;
			  }

			  function maybeIndexedSeqFromValue(value) {
			    return (
			      isArrayLike(value) ? new ArraySeq(value) :
			      isIterator(value) ? new IteratorSeq(value) :
			      hasIterator(value) ? new IterableSeq(value) :
			      undefined
			    );
			  }

			  function seqIterate(seq, fn, reverse, useKeys) {
			    var cache = seq._cache;
			    if (cache) {
			      var maxIndex = cache.length - 1;
			      for (var ii = 0; ii <= maxIndex; ii++) {
			        var entry = cache[reverse ? maxIndex - ii : ii];
			        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
			          return ii + 1;
			        }
			      }
			      return ii;
			    }
			    return seq.__iterateUncached(fn, reverse);
			  }

			  function seqIterator(seq, type, reverse, useKeys) {
			    var cache = seq._cache;
			    if (cache) {
			      var maxIndex = cache.length - 1;
			      var ii = 0;
			      return new Iterator(function()  {
			        var entry = cache[reverse ? maxIndex - ii : ii];
			        return ii++ > maxIndex ?
			          iteratorDone() :
			          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
			      });
			    }
			    return seq.__iteratorUncached(type, reverse);
			  }

			  function fromJS(json, converter) {
			    return converter ?
			      fromJSWith(converter, json, '', {'': json}) :
			      fromJSDefault(json);
			  }

			  function fromJSWith(converter, json, key, parentJSON) {
			    if (Array.isArray(json)) {
			      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
			    }
			    if (isPlainObj(json)) {
			      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
			    }
			    return json;
			  }

			  function fromJSDefault(json) {
			    if (Array.isArray(json)) {
			      return IndexedSeq(json).map(fromJSDefault).toList();
			    }
			    if (isPlainObj(json)) {
			      return KeyedSeq(json).map(fromJSDefault).toMap();
			    }
			    return json;
			  }

			  function isPlainObj(value) {
			    return value && (value.constructor === Object || value.constructor === undefined);
			  }

			  /**
			   * An extension of the "same-value" algorithm as [described for use by ES6 Map
			   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
			   *
			   * NaN is considered the same as NaN, however -0 and 0 are considered the same
			   * value, which is different from the algorithm described by
			   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
			   *
			   * This is extended further to allow Objects to describe the values they
			   * represent, by way of `valueOf` or `equals` (and `hashCode`).
			   *
			   * Note: because of this extension, the key equality of Immutable.Map and the
			   * value equality of Immutable.Set will differ from ES6 Map and Set.
			   *
			   * ### Defining custom values
			   *
			   * The easiest way to describe the value an object represents is by implementing
			   * `valueOf`. For example, `Date` represents a value by returning a unix
			   * timestamp for `valueOf`:
			   *
			   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
			   *     var date2 = new Date(1234567890000);
			   *     date1.valueOf(); // 1234567890000
			   *     assert( date1 !== date2 );
			   *     assert( Immutable.is( date1, date2 ) );
			   *
			   * Note: overriding `valueOf` may have other implications if you use this object
			   * where JavaScript expects a primitive, such as implicit string coercion.
			   *
			   * For more complex types, especially collections, implementing `valueOf` may
			   * not be performant. An alternative is to implement `equals` and `hashCode`.
			   *
			   * `equals` takes another object, presumably of similar type, and returns true
			   * if the it is equal. Equality is symmetrical, so the same result should be
			   * returned if this and the argument are flipped.
			   *
			   *     assert( a.equals(b) === b.equals(a) );
			   *
			   * `hashCode` returns a 32bit integer number representing the object which will
			   * be used to determine how to store the value object in a Map or Set. You must
			   * provide both or neither methods, one must not exist without the other.
			   *
			   * Also, an important relationship between these methods must be upheld: if two
			   * values are equal, they *must* return the same hashCode. If the values are not
			   * equal, they might have the same hashCode; this is called a hash collision,
			   * and while undesirable for performance reasons, it is acceptable.
			   *
			   *     if (a.equals(b)) {
			   *       assert( a.hashCode() === b.hashCode() );
			   *     }
			   *
			   * All Immutable collections implement `equals` and `hashCode`.
			   *
			   */
			  function is(valueA, valueB) {
			    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
			      return true;
			    }
			    if (!valueA || !valueB) {
			      return false;
			    }
			    if (typeof valueA.valueOf === 'function' &&
			        typeof valueB.valueOf === 'function') {
			      valueA = valueA.valueOf();
			      valueB = valueB.valueOf();
			      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
			        return true;
			      }
			      if (!valueA || !valueB) {
			        return false;
			      }
			    }
			    if (typeof valueA.equals === 'function' &&
			        typeof valueB.equals === 'function' &&
			        valueA.equals(valueB)) {
			      return true;
			    }
			    return false;
			  }

			  function deepEqual(a, b) {
			    if (a === b) {
			      return true;
			    }

			    if (
			      !isIterable(b) ||
			      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
			      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
			      isKeyed(a) !== isKeyed(b) ||
			      isIndexed(a) !== isIndexed(b) ||
			      isOrdered(a) !== isOrdered(b)
			    ) {
			      return false;
			    }

			    if (a.size === 0 && b.size === 0) {
			      return true;
			    }

			    var notAssociative = !isAssociative(a);

			    if (isOrdered(a)) {
			      var entries = a.entries();
			      return b.every(function(v, k)  {
			        var entry = entries.next().value;
			        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
			      }) && entries.next().done;
			    }

			    var flipped = false;

			    if (a.size === undefined) {
			      if (b.size === undefined) {
			        if (typeof a.cacheResult === 'function') {
			          a.cacheResult();
			        }
			      } else {
			        flipped = true;
			        var _ = a;
			        a = b;
			        b = _;
			      }
			    }

			    var allEqual = true;
			    var bSize = b.__iterate(function(v, k)  {
			      if (notAssociative ? !a.has(v) :
			          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
			        allEqual = false;
			        return false;
			      }
			    });

			    return allEqual && a.size === bSize;
			  }

			  createClass(Repeat, IndexedSeq);

			    function Repeat(value, times) {
			      if (!(this instanceof Repeat)) {
			        return new Repeat(value, times);
			      }
			      this._value = value;
			      this.size = times === undefined ? Infinity : Math.max(0, times);
			      if (this.size === 0) {
			        if (EMPTY_REPEAT) {
			          return EMPTY_REPEAT;
			        }
			        EMPTY_REPEAT = this;
			      }
			    }

			    Repeat.prototype.toString = function() {
			      if (this.size === 0) {
			        return 'Repeat []';
			      }
			      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
			    };

			    Repeat.prototype.get = function(index, notSetValue) {
			      return this.has(index) ? this._value : notSetValue;
			    };

			    Repeat.prototype.includes = function(searchValue) {
			      return is(this._value, searchValue);
			    };

			    Repeat.prototype.slice = function(begin, end) {
			      var size = this.size;
			      return wholeSlice(begin, end, size) ? this :
			        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
			    };

			    Repeat.prototype.reverse = function() {
			      return this;
			    };

			    Repeat.prototype.indexOf = function(searchValue) {
			      if (is(this._value, searchValue)) {
			        return 0;
			      }
			      return -1;
			    };

			    Repeat.prototype.lastIndexOf = function(searchValue) {
			      if (is(this._value, searchValue)) {
			        return this.size;
			      }
			      return -1;
			    };

			    Repeat.prototype.__iterate = function(fn, reverse) {
			      for (var ii = 0; ii < this.size; ii++) {
			        if (fn(this._value, ii, this) === false) {
			          return ii + 1;
			        }
			      }
			      return ii;
			    };

			    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
			      var ii = 0;
			      return new Iterator(function() 
			        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
			      );
			    };

			    Repeat.prototype.equals = function(other) {
			      return other instanceof Repeat ?
			        is(this._value, other._value) :
			        deepEqual(other);
			    };


			  var EMPTY_REPEAT;

			  function invariant(condition, error) {
			    if (!condition) throw new Error(error);
			  }

			  createClass(Range, IndexedSeq);

			    function Range(start, end, step) {
			      if (!(this instanceof Range)) {
			        return new Range(start, end, step);
			      }
			      invariant(step !== 0, 'Cannot step a Range by 0');
			      start = start || 0;
			      if (end === undefined) {
			        end = Infinity;
			      }
			      step = step === undefined ? 1 : Math.abs(step);
			      if (end < start) {
			        step = -step;
			      }
			      this._start = start;
			      this._end = end;
			      this._step = step;
			      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
			      if (this.size === 0) {
			        if (EMPTY_RANGE) {
			          return EMPTY_RANGE;
			        }
			        EMPTY_RANGE = this;
			      }
			    }

			    Range.prototype.toString = function() {
			      if (this.size === 0) {
			        return 'Range []';
			      }
			      return 'Range [ ' +
			        this._start + '...' + this._end +
			        (this._step > 1 ? ' by ' + this._step : '') +
			      ' ]';
			    };

			    Range.prototype.get = function(index, notSetValue) {
			      return this.has(index) ?
			        this._start + wrapIndex(this, index) * this._step :
			        notSetValue;
			    };

			    Range.prototype.includes = function(searchValue) {
			      var possibleIndex = (searchValue - this._start) / this._step;
			      return possibleIndex >= 0 &&
			        possibleIndex < this.size &&
			        possibleIndex === Math.floor(possibleIndex);
			    };

			    Range.prototype.slice = function(begin, end) {
			      if (wholeSlice(begin, end, this.size)) {
			        return this;
			      }
			      begin = resolveBegin(begin, this.size);
			      end = resolveEnd(end, this.size);
			      if (end <= begin) {
			        return new Range(0, 0);
			      }
			      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
			    };

			    Range.prototype.indexOf = function(searchValue) {
			      var offsetValue = searchValue - this._start;
			      if (offsetValue % this._step === 0) {
			        var index = offsetValue / this._step;
			        if (index >= 0 && index < this.size) {
			          return index
			        }
			      }
			      return -1;
			    };

			    Range.prototype.lastIndexOf = function(searchValue) {
			      return this.indexOf(searchValue);
			    };

			    Range.prototype.__iterate = function(fn, reverse) {
			      var maxIndex = this.size - 1;
			      var step = this._step;
			      var value = reverse ? this._start + maxIndex * step : this._start;
			      for (var ii = 0; ii <= maxIndex; ii++) {
			        if (fn(value, ii, this) === false) {
			          return ii + 1;
			        }
			        value += reverse ? -step : step;
			      }
			      return ii;
			    };

			    Range.prototype.__iterator = function(type, reverse) {
			      var maxIndex = this.size - 1;
			      var step = this._step;
			      var value = reverse ? this._start + maxIndex * step : this._start;
			      var ii = 0;
			      return new Iterator(function()  {
			        var v = value;
			        value += reverse ? -step : step;
			        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
			      });
			    };

			    Range.prototype.equals = function(other) {
			      return other instanceof Range ?
			        this._start === other._start &&
			        this._end === other._end &&
			        this._step === other._step :
			        deepEqual(this, other);
			    };


			  var EMPTY_RANGE;

			  createClass(Collection, Iterable);
			    function Collection() {
			      throw TypeError('Abstract');
			    }


			  createClass(KeyedCollection, Collection);function KeyedCollection() {}

			  createClass(IndexedCollection, Collection);function IndexedCollection() {}

			  createClass(SetCollection, Collection);function SetCollection() {}


			  Collection.Keyed = KeyedCollection;
			  Collection.Indexed = IndexedCollection;
			  Collection.Set = SetCollection;

			  var imul =
			    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
			    Math.imul :
			    function imul(a, b) {
			      a = a | 0; // int
			      b = b | 0; // int
			      var c = a & 0xffff;
			      var d = b & 0xffff;
			      // Shift by 0 fixes the sign on the high part.
			      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
			    };

			  // v8 has an optimization for storing 31-bit signed numbers.
			  // Values which have either 00 or 11 as the high order bits qualify.
			  // This function drops the highest order bit in a signed number, maintaining
			  // the sign bit.
			  function smi(i32) {
			    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
			  }

			  function hash(o) {
			    if (o === false || o === null || o === undefined) {
			      return 0;
			    }
			    if (typeof o.valueOf === 'function') {
			      o = o.valueOf();
			      if (o === false || o === null || o === undefined) {
			        return 0;
			      }
			    }
			    if (o === true) {
			      return 1;
			    }
			    var type = typeof o;
			    if (type === 'number') {
			      var h = o | 0;
			      if (h !== o) {
			        h ^= o * 0xFFFFFFFF;
			      }
			      while (o > 0xFFFFFFFF) {
			        o /= 0xFFFFFFFF;
			        h ^= o;
			      }
			      return smi(h);
			    }
			    if (type === 'string') {
			      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
			    }
			    if (typeof o.hashCode === 'function') {
			      return o.hashCode();
			    }
			    if (type === 'object') {
			      return hashJSObj(o);
			    }
			    if (typeof o.toString === 'function') {
			      return hashString(o.toString());
			    }
			    throw new Error('Value type ' + type + ' cannot be hashed.');
			  }

			  function cachedHashString(string) {
			    var hash = stringHashCache[string];
			    if (hash === undefined) {
			      hash = hashString(string);
			      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
			        STRING_HASH_CACHE_SIZE = 0;
			        stringHashCache = {};
			      }
			      STRING_HASH_CACHE_SIZE++;
			      stringHashCache[string] = hash;
			    }
			    return hash;
			  }

			  // http://jsperf.com/hashing-strings
			  function hashString(string) {
			    // This is the hash from JVM
			    // The hash code for a string is computed as
			    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
			    // where s[i] is the ith character of the string and n is the length of
			    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
			    // (exclusive) by dropping high bits.
			    var hash = 0;
			    for (var ii = 0; ii < string.length; ii++) {
			      hash = 31 * hash + string.charCodeAt(ii) | 0;
			    }
			    return smi(hash);
			  }

			  function hashJSObj(obj) {
			    var hash;
			    if (usingWeakMap) {
			      hash = weakMap.get(obj);
			      if (hash !== undefined) {
			        return hash;
			      }
			    }

			    hash = obj[UID_HASH_KEY];
			    if (hash !== undefined) {
			      return hash;
			    }

			    if (!canDefineProperty) {
			      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
			      if (hash !== undefined) {
			        return hash;
			      }

			      hash = getIENodeHash(obj);
			      if (hash !== undefined) {
			        return hash;
			      }
			    }

			    hash = ++objHashUID;
			    if (objHashUID & 0x40000000) {
			      objHashUID = 0;
			    }

			    if (usingWeakMap) {
			      weakMap.set(obj, hash);
			    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
			      throw new Error('Non-extensible objects are not allowed as keys.');
			    } else if (canDefineProperty) {
			      Object.defineProperty(obj, UID_HASH_KEY, {
			        'enumerable': false,
			        'configurable': false,
			        'writable': false,
			        'value': hash
			      });
			    } else if (obj.propertyIsEnumerable !== undefined &&
			               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
			      // Since we can't define a non-enumerable property on the object
			      // we'll hijack one of the less-used non-enumerable properties to
			      // save our hash on it. Since this is a function it will not show up in
			      // `JSON.stringify` which is what we want.
			      obj.propertyIsEnumerable = function() {
			        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
			      };
			      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
			    } else if (obj.nodeType !== undefined) {
			      // At this point we couldn't get the IE `uniqueID` to use as a hash
			      // and we couldn't use a non-enumerable property to exploit the
			      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
			      // itself.
			      obj[UID_HASH_KEY] = hash;
			    } else {
			      throw new Error('Unable to set a non-enumerable property on object.');
			    }

			    return hash;
			  }

			  // Get references to ES5 object methods.
			  var isExtensible = Object.isExtensible;

			  // True if Object.defineProperty works as expected. IE8 fails this test.
			  var canDefineProperty = (function() {
			    try {
			      Object.defineProperty({}, '@', {});
			      return true;
			    } catch (e) {
			      return false;
			    }
			  }());

			  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
			  // and avoid memory leaks from the IE cloneNode bug.
			  function getIENodeHash(node) {
			    if (node && node.nodeType > 0) {
			      switch (node.nodeType) {
			        case 1: // Element
			          return node.uniqueID;
			        case 9: // Document
			          return node.documentElement && node.documentElement.uniqueID;
			      }
			    }
			  }

			  // If possible, use a WeakMap.
			  var usingWeakMap = typeof WeakMap === 'function';
			  var weakMap;
			  if (usingWeakMap) {
			    weakMap = new WeakMap();
			  }

			  var objHashUID = 0;

			  var UID_HASH_KEY = '__immutablehash__';
			  if (typeof Symbol === 'function') {
			    UID_HASH_KEY = Symbol(UID_HASH_KEY);
			  }

			  var STRING_HASH_CACHE_MIN_STRLEN = 16;
			  var STRING_HASH_CACHE_MAX_SIZE = 255;
			  var STRING_HASH_CACHE_SIZE = 0;
			  var stringHashCache = {};

			  function assertNotInfinite(size) {
			    invariant(
			      size !== Infinity,
			      'Cannot perform this action with an infinite size.'
			    );
			  }

			  createClass(Map, KeyedCollection);

			    // @pragma Construction

			    function Map(value) {
			      return value === null || value === undefined ? emptyMap() :
			        isMap(value) && !isOrdered(value) ? value :
			        emptyMap().withMutations(function(map ) {
			          var iter = KeyedIterable(value);
			          assertNotInfinite(iter.size);
			          iter.forEach(function(v, k)  {return map.set(k, v)});
			        });
			    }

			    Map.prototype.toString = function() {
			      return this.__toString('Map {', '}');
			    };

			    // @pragma Access

			    Map.prototype.get = function(k, notSetValue) {
			      return this._root ?
			        this._root.get(0, undefined, k, notSetValue) :
			        notSetValue;
			    };

			    // @pragma Modification

			    Map.prototype.set = function(k, v) {
			      return updateMap(this, k, v);
			    };

			    Map.prototype.setIn = function(keyPath, v) {
			      return this.updateIn(keyPath, NOT_SET, function()  {return v});
			    };

			    Map.prototype.remove = function(k) {
			      return updateMap(this, k, NOT_SET);
			    };

			    Map.prototype.deleteIn = function(keyPath) {
			      return this.updateIn(keyPath, function()  {return NOT_SET});
			    };

			    Map.prototype.update = function(k, notSetValue, updater) {
			      return arguments.length === 1 ?
			        k(this) :
			        this.updateIn([k], notSetValue, updater);
			    };

			    Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
			      if (!updater) {
			        updater = notSetValue;
			        notSetValue = undefined;
			      }
			      var updatedValue = updateInDeepMap(
			        this,
			        forceIterator(keyPath),
			        notSetValue,
			        updater
			      );
			      return updatedValue === NOT_SET ? undefined : updatedValue;
			    };

			    Map.prototype.clear = function() {
			      if (this.size === 0) {
			        return this;
			      }
			      if (this.__ownerID) {
			        this.size = 0;
			        this._root = null;
			        this.__hash = undefined;
			        this.__altered = true;
			        return this;
			      }
			      return emptyMap();
			    };

			    // @pragma Composition

			    Map.prototype.merge = function(/*...iters*/) {
			      return mergeIntoMapWith(this, undefined, arguments);
			    };

			    Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
			      return mergeIntoMapWith(this, merger, iters);
			    };

			    Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
			      return this.updateIn(
			        keyPath,
			        emptyMap(),
			        function(m ) {return typeof m.merge === 'function' ?
			          m.merge.apply(m, iters) :
			          iters[iters.length - 1]}
			      );
			    };

			    Map.prototype.mergeDeep = function(/*...iters*/) {
			      return mergeIntoMapWith(this, deepMerger, arguments);
			    };

			    Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
			      return mergeIntoMapWith(this, deepMergerWith(merger), iters);
			    };

			    Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
			      return this.updateIn(
			        keyPath,
			        emptyMap(),
			        function(m ) {return typeof m.mergeDeep === 'function' ?
			          m.mergeDeep.apply(m, iters) :
			          iters[iters.length - 1]}
			      );
			    };

			    Map.prototype.sort = function(comparator) {
			      // Late binding
			      return OrderedMap(sortFactory(this, comparator));
			    };

			    Map.prototype.sortBy = function(mapper, comparator) {
			      // Late binding
			      return OrderedMap(sortFactory(this, comparator, mapper));
			    };

			    // @pragma Mutability

			    Map.prototype.withMutations = function(fn) {
			      var mutable = this.asMutable();
			      fn(mutable);
			      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
			    };

			    Map.prototype.asMutable = function() {
			      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
			    };

			    Map.prototype.asImmutable = function() {
			      return this.__ensureOwner();
			    };

			    Map.prototype.wasAltered = function() {
			      return this.__altered;
			    };

			    Map.prototype.__iterator = function(type, reverse) {
			      return new MapIterator(this, type, reverse);
			    };

			    Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
			      var iterations = 0;
			      this._root && this._root.iterate(function(entry ) {
			        iterations++;
			        return fn(entry[1], entry[0], this$0);
			      }, reverse);
			      return iterations;
			    };

			    Map.prototype.__ensureOwner = function(ownerID) {
			      if (ownerID === this.__ownerID) {
			        return this;
			      }
			      if (!ownerID) {
			        this.__ownerID = ownerID;
			        this.__altered = false;
			        return this;
			      }
			      return makeMap(this.size, this._root, ownerID, this.__hash);
			    };


			  function isMap(maybeMap) {
			    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
			  }

			  Map.isMap = isMap;

			  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

			  var MapPrototype = Map.prototype;
			  MapPrototype[IS_MAP_SENTINEL] = true;
			  MapPrototype[DELETE] = MapPrototype.remove;
			  MapPrototype.removeIn = MapPrototype.deleteIn;


			  // #pragma Trie Nodes



			    function ArrayMapNode(ownerID, entries) {
			      this.ownerID = ownerID;
			      this.entries = entries;
			    }

			    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
			      var entries = this.entries;
			      for (var ii = 0, len = entries.length; ii < len; ii++) {
			        if (is(key, entries[ii][0])) {
			          return entries[ii][1];
			        }
			      }
			      return notSetValue;
			    };

			    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
			      var removed = value === NOT_SET;

			      var entries = this.entries;
			      var idx = 0;
			      for (var len = entries.length; idx < len; idx++) {
			        if (is(key, entries[idx][0])) {
			          break;
			        }
			      }
			      var exists = idx < len;

			      if (exists ? entries[idx][1] === value : removed) {
			        return this;
			      }

			      SetRef(didAlter);
			      (removed || !exists) && SetRef(didChangeSize);

			      if (removed && entries.length === 1) {
			        return; // undefined
			      }

			      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
			        return createNodes(ownerID, entries, key, value);
			      }

			      var isEditable = ownerID && ownerID === this.ownerID;
			      var newEntries = isEditable ? entries : arrCopy(entries);

			      if (exists) {
			        if (removed) {
			          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
			        } else {
			          newEntries[idx] = [key, value];
			        }
			      } else {
			        newEntries.push([key, value]);
			      }

			      if (isEditable) {
			        this.entries = newEntries;
			        return this;
			      }

			      return new ArrayMapNode(ownerID, newEntries);
			    };




			    function BitmapIndexedNode(ownerID, bitmap, nodes) {
			      this.ownerID = ownerID;
			      this.bitmap = bitmap;
			      this.nodes = nodes;
			    }

			    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
			      if (keyHash === undefined) {
			        keyHash = hash(key);
			      }
			      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
			      var bitmap = this.bitmap;
			      return (bitmap & bit) === 0 ? notSetValue :
			        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
			    };

			    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
			      if (keyHash === undefined) {
			        keyHash = hash(key);
			      }
			      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
			      var bit = 1 << keyHashFrag;
			      var bitmap = this.bitmap;
			      var exists = (bitmap & bit) !== 0;

			      if (!exists && value === NOT_SET) {
			        return this;
			      }

			      var idx = popCount(bitmap & (bit - 1));
			      var nodes = this.nodes;
			      var node = exists ? nodes[idx] : undefined;
			      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

			      if (newNode === node) {
			        return this;
			      }

			      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
			        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
			      }

			      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
			        return nodes[idx ^ 1];
			      }

			      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
			        return newNode;
			      }

			      var isEditable = ownerID && ownerID === this.ownerID;
			      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
			      var newNodes = exists ? newNode ?
			        setIn(nodes, idx, newNode, isEditable) :
			        spliceOut(nodes, idx, isEditable) :
			        spliceIn(nodes, idx, newNode, isEditable);

			      if (isEditable) {
			        this.bitmap = newBitmap;
			        this.nodes = newNodes;
			        return this;
			      }

			      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
			    };




			    function HashArrayMapNode(ownerID, count, nodes) {
			      this.ownerID = ownerID;
			      this.count = count;
			      this.nodes = nodes;
			    }

			    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
			      if (keyHash === undefined) {
			        keyHash = hash(key);
			      }
			      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
			      var node = this.nodes[idx];
			      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
			    };

			    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
			      if (keyHash === undefined) {
			        keyHash = hash(key);
			      }
			      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
			      var removed = value === NOT_SET;
			      var nodes = this.nodes;
			      var node = nodes[idx];

			      if (removed && !node) {
			        return this;
			      }

			      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
			      if (newNode === node) {
			        return this;
			      }

			      var newCount = this.count;
			      if (!node) {
			        newCount++;
			      } else if (!newNode) {
			        newCount--;
			        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
			          return packNodes(ownerID, nodes, newCount, idx);
			        }
			      }

			      var isEditable = ownerID && ownerID === this.ownerID;
			      var newNodes = setIn(nodes, idx, newNode, isEditable);

			      if (isEditable) {
			        this.count = newCount;
			        this.nodes = newNodes;
			        return this;
			      }

			      return new HashArrayMapNode(ownerID, newCount, newNodes);
			    };




			    function HashCollisionNode(ownerID, keyHash, entries) {
			      this.ownerID = ownerID;
			      this.keyHash = keyHash;
			      this.entries = entries;
			    }

			    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
			      var entries = this.entries;
			      for (var ii = 0, len = entries.length; ii < len; ii++) {
			        if (is(key, entries[ii][0])) {
			          return entries[ii][1];
			        }
			      }
			      return notSetValue;
			    };

			    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
			      if (keyHash === undefined) {
			        keyHash = hash(key);
			      }

			      var removed = value === NOT_SET;

			      if (keyHash !== this.keyHash) {
			        if (removed) {
			          return this;
			        }
			        SetRef(didAlter);
			        SetRef(didChangeSize);
			        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
			      }

			      var entries = this.entries;
			      var idx = 0;
			      for (var len = entries.length; idx < len; idx++) {
			        if (is(key, entries[idx][0])) {
			          break;
			        }
			      }
			      var exists = idx < len;

			      if (exists ? entries[idx][1] === value : removed) {
			        return this;
			      }

			      SetRef(didAlter);
			      (removed || !exists) && SetRef(didChangeSize);

			      if (removed && len === 2) {
			        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
			      }

			      var isEditable = ownerID && ownerID === this.ownerID;
			      var newEntries = isEditable ? entries : arrCopy(entries);

			      if (exists) {
			        if (removed) {
			          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
			        } else {
			          newEntries[idx] = [key, value];
			        }
			      } else {
			        newEntries.push([key, value]);
			      }

			      if (isEditable) {
			        this.entries = newEntries;
			        return this;
			      }

			      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
			    };




			    function ValueNode(ownerID, keyHash, entry) {
			      this.ownerID = ownerID;
			      this.keyHash = keyHash;
			      this.entry = entry;
			    }

			    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
			      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
			    };

			    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
			      var removed = value === NOT_SET;
			      var keyMatch = is(key, this.entry[0]);
			      if (keyMatch ? value === this.entry[1] : removed) {
			        return this;
			      }

			      SetRef(didAlter);

			      if (removed) {
			        SetRef(didChangeSize);
			        return; // undefined
			      }

			      if (keyMatch) {
			        if (ownerID && ownerID === this.ownerID) {
			          this.entry[1] = value;
			          return this;
			        }
			        return new ValueNode(ownerID, this.keyHash, [key, value]);
			      }

			      SetRef(didChangeSize);
			      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
			    };



			  // #pragma Iterators

			  ArrayMapNode.prototype.iterate =
			  HashCollisionNode.prototype.iterate = function (fn, reverse) {
			    var entries = this.entries;
			    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
			      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
			        return false;
			      }
			    }
			  };

			  BitmapIndexedNode.prototype.iterate =
			  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
			    var nodes = this.nodes;
			    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
			      var node = nodes[reverse ? maxIndex - ii : ii];
			      if (node && node.iterate(fn, reverse) === false) {
			        return false;
			      }
			    }
			  };

			  ValueNode.prototype.iterate = function (fn, reverse) {
			    return fn(this.entry);
			  };

			  createClass(MapIterator, Iterator);

			    function MapIterator(map, type, reverse) {
			      this._type = type;
			      this._reverse = reverse;
			      this._stack = map._root && mapIteratorFrame(map._root);
			    }

			    MapIterator.prototype.next = function() {
			      var type = this._type;
			      var stack = this._stack;
			      while (stack) {
			        var node = stack.node;
			        var index = stack.index++;
			        var maxIndex;
			        if (node.entry) {
			          if (index === 0) {
			            return mapIteratorValue(type, node.entry);
			          }
			        } else if (node.entries) {
			          maxIndex = node.entries.length - 1;
			          if (index <= maxIndex) {
			            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
			          }
			        } else {
			          maxIndex = node.nodes.length - 1;
			          if (index <= maxIndex) {
			            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
			            if (subNode) {
			              if (subNode.entry) {
			                return mapIteratorValue(type, subNode.entry);
			              }
			              stack = this._stack = mapIteratorFrame(subNode, stack);
			            }
			            continue;
			          }
			        }
			        stack = this._stack = this._stack.__prev;
			      }
			      return iteratorDone();
			    };


			  function mapIteratorValue(type, entry) {
			    return iteratorValue(type, entry[0], entry[1]);
			  }

			  function mapIteratorFrame(node, prev) {
			    return {
			      node: node,
			      index: 0,
			      __prev: prev
			    };
			  }

			  function makeMap(size, root, ownerID, hash) {
			    var map = Object.create(MapPrototype);
			    map.size = size;
			    map._root = root;
			    map.__ownerID = ownerID;
			    map.__hash = hash;
			    map.__altered = false;
			    return map;
			  }

			  var EMPTY_MAP;
			  function emptyMap() {
			    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
			  }

			  function updateMap(map, k, v) {
			    var newRoot;
			    var newSize;
			    if (!map._root) {
			      if (v === NOT_SET) {
			        return map;
			      }
			      newSize = 1;
			      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
			    } else {
			      var didChangeSize = MakeRef(CHANGE_LENGTH);
			      var didAlter = MakeRef(DID_ALTER);
			      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
			      if (!didAlter.value) {
			        return map;
			      }
			      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
			    }
			    if (map.__ownerID) {
			      map.size = newSize;
			      map._root = newRoot;
			      map.__hash = undefined;
			      map.__altered = true;
			      return map;
			    }
			    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
			  }

			  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
			    if (!node) {
			      if (value === NOT_SET) {
			        return node;
			      }
			      SetRef(didAlter);
			      SetRef(didChangeSize);
			      return new ValueNode(ownerID, keyHash, [key, value]);
			    }
			    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
			  }

			  function isLeafNode(node) {
			    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
			  }

			  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
			    if (node.keyHash === keyHash) {
			      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
			    }

			    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
			    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

			    var newNode;
			    var nodes = idx1 === idx2 ?
			      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
			      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);

			    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
			  }

			  function createNodes(ownerID, entries, key, value) {
			    if (!ownerID) {
			      ownerID = new OwnerID();
			    }
			    var node = new ValueNode(ownerID, hash(key), [key, value]);
			    for (var ii = 0; ii < entries.length; ii++) {
			      var entry = entries[ii];
			      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
			    }
			    return node;
			  }

			  function packNodes(ownerID, nodes, count, excluding) {
			    var bitmap = 0;
			    var packedII = 0;
			    var packedNodes = new Array(count);
			    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
			      var node = nodes[ii];
			      if (node !== undefined && ii !== excluding) {
			        bitmap |= bit;
			        packedNodes[packedII++] = node;
			      }
			    }
			    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
			  }

			  function expandNodes(ownerID, nodes, bitmap, including, node) {
			    var count = 0;
			    var expandedNodes = new Array(SIZE);
			    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
			      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
			    }
			    expandedNodes[including] = node;
			    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
			  }

			  function mergeIntoMapWith(map, merger, iterables) {
			    var iters = [];
			    for (var ii = 0; ii < iterables.length; ii++) {
			      var value = iterables[ii];
			      var iter = KeyedIterable(value);
			      if (!isIterable(value)) {
			        iter = iter.map(function(v ) {return fromJS(v)});
			      }
			      iters.push(iter);
			    }
			    return mergeIntoCollectionWith(map, merger, iters);
			  }

			  function deepMerger(existing, value, key) {
			    return existing && existing.mergeDeep && isIterable(value) ?
			      existing.mergeDeep(value) :
			      is(existing, value) ? existing : value;
			  }

			  function deepMergerWith(merger) {
			    return function(existing, value, key)  {
			      if (existing && existing.mergeDeepWith && isIterable(value)) {
			        return existing.mergeDeepWith(merger, value);
			      }
			      var nextValue = merger(existing, value, key);
			      return is(existing, nextValue) ? existing : nextValue;
			    };
			  }

			  function mergeIntoCollectionWith(collection, merger, iters) {
			    iters = iters.filter(function(x ) {return x.size !== 0});
			    if (iters.length === 0) {
			      return collection;
			    }
			    if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
			      return collection.constructor(iters[0]);
			    }
			    return collection.withMutations(function(collection ) {
			      var mergeIntoMap = merger ?
			        function(value, key)  {
			          collection.update(key, NOT_SET, function(existing )
			            {return existing === NOT_SET ? value : merger(existing, value, key)}
			          );
			        } :
			        function(value, key)  {
			          collection.set(key, value);
			        };
			      for (var ii = 0; ii < iters.length; ii++) {
			        iters[ii].forEach(mergeIntoMap);
			      }
			    });
			  }

			  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
			    var isNotSet = existing === NOT_SET;
			    var step = keyPathIter.next();
			    if (step.done) {
			      var existingValue = isNotSet ? notSetValue : existing;
			      var newValue = updater(existingValue);
			      return newValue === existingValue ? existing : newValue;
			    }
			    invariant(
			      isNotSet || (existing && existing.set),
			      'invalid keyPath'
			    );
			    var key = step.value;
			    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
			    var nextUpdated = updateInDeepMap(
			      nextExisting,
			      keyPathIter,
			      notSetValue,
			      updater
			    );
			    return nextUpdated === nextExisting ? existing :
			      nextUpdated === NOT_SET ? existing.remove(key) :
			      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
			  }

			  function popCount(x) {
			    x = x - ((x >> 1) & 0x55555555);
			    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
			    x = (x + (x >> 4)) & 0x0f0f0f0f;
			    x = x + (x >> 8);
			    x = x + (x >> 16);
			    return x & 0x7f;
			  }

			  function setIn(array, idx, val, canEdit) {
			    var newArray = canEdit ? array : arrCopy(array);
			    newArray[idx] = val;
			    return newArray;
			  }

			  function spliceIn(array, idx, val, canEdit) {
			    var newLen = array.length + 1;
			    if (canEdit && idx + 1 === newLen) {
			      array[idx] = val;
			      return array;
			    }
			    var newArray = new Array(newLen);
			    var after = 0;
			    for (var ii = 0; ii < newLen; ii++) {
			      if (ii === idx) {
			        newArray[ii] = val;
			        after = -1;
			      } else {
			        newArray[ii] = array[ii + after];
			      }
			    }
			    return newArray;
			  }

			  function spliceOut(array, idx, canEdit) {
			    var newLen = array.length - 1;
			    if (canEdit && idx === newLen) {
			      array.pop();
			      return array;
			    }
			    var newArray = new Array(newLen);
			    var after = 0;
			    for (var ii = 0; ii < newLen; ii++) {
			      if (ii === idx) {
			        after = 1;
			      }
			      newArray[ii] = array[ii + after];
			    }
			    return newArray;
			  }

			  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
			  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
			  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

			  createClass(List, IndexedCollection);

			    // @pragma Construction

			    function List(value) {
			      var empty = emptyList();
			      if (value === null || value === undefined) {
			        return empty;
			      }
			      if (isList(value)) {
			        return value;
			      }
			      var iter = IndexedIterable(value);
			      var size = iter.size;
			      if (size === 0) {
			        return empty;
			      }
			      assertNotInfinite(size);
			      if (size > 0 && size < SIZE) {
			        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
			      }
			      return empty.withMutations(function(list ) {
			        list.setSize(size);
			        iter.forEach(function(v, i)  {return list.set(i, v)});
			      });
			    }

			    List.of = function(/*...values*/) {
			      return this(arguments);
			    };

			    List.prototype.toString = function() {
			      return this.__toString('List [', ']');
			    };

			    // @pragma Access

			    List.prototype.get = function(index, notSetValue) {
			      index = wrapIndex(this, index);
			      if (index >= 0 && index < this.size) {
			        index += this._origin;
			        var node = listNodeFor(this, index);
			        return node && node.array[index & MASK];
			      }
			      return notSetValue;
			    };

			    // @pragma Modification

			    List.prototype.set = function(index, value) {
			      return updateList(this, index, value);
			    };

			    List.prototype.remove = function(index) {
			      return !this.has(index) ? this :
			        index === 0 ? this.shift() :
			        index === this.size - 1 ? this.pop() :
			        this.splice(index, 1);
			    };

			    List.prototype.insert = function(index, value) {
			      return this.splice(index, 0, value);
			    };

			    List.prototype.clear = function() {
			      if (this.size === 0) {
			        return this;
			      }
			      if (this.__ownerID) {
			        this.size = this._origin = this._capacity = 0;
			        this._level = SHIFT;
			        this._root = this._tail = null;
			        this.__hash = undefined;
			        this.__altered = true;
			        return this;
			      }
			      return emptyList();
			    };

			    List.prototype.push = function(/*...values*/) {
			      var values = arguments;
			      var oldSize = this.size;
			      return this.withMutations(function(list ) {
			        setListBounds(list, 0, oldSize + values.length);
			        for (var ii = 0; ii < values.length; ii++) {
			          list.set(oldSize + ii, values[ii]);
			        }
			      });
			    };

			    List.prototype.pop = function() {
			      return setListBounds(this, 0, -1);
			    };

			    List.prototype.unshift = function(/*...values*/) {
			      var values = arguments;
			      return this.withMutations(function(list ) {
			        setListBounds(list, -values.length);
			        for (var ii = 0; ii < values.length; ii++) {
			          list.set(ii, values[ii]);
			        }
			      });
			    };

			    List.prototype.shift = function() {
			      return setListBounds(this, 1);
			    };

			    // @pragma Composition

			    List.prototype.merge = function(/*...iters*/) {
			      return mergeIntoListWith(this, undefined, arguments);
			    };

			    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
			      return mergeIntoListWith(this, merger, iters);
			    };

			    List.prototype.mergeDeep = function(/*...iters*/) {
			      return mergeIntoListWith(this, deepMerger, arguments);
			    };

			    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
			      return mergeIntoListWith(this, deepMergerWith(merger), iters);
			    };

			    List.prototype.setSize = function(size) {
			      return setListBounds(this, 0, size);
			    };

			    // @pragma Iteration

			    List.prototype.slice = function(begin, end) {
			      var size = this.size;
			      if (wholeSlice(begin, end, size)) {
			        return this;
			      }
			      return setListBounds(
			        this,
			        resolveBegin(begin, size),
			        resolveEnd(end, size)
			      );
			    };

			    List.prototype.__iterator = function(type, reverse) {
			      var index = 0;
			      var values = iterateList(this, reverse);
			      return new Iterator(function()  {
			        var value = values();
			        return value === DONE ?
			          iteratorDone() :
			          iteratorValue(type, index++, value);
			      });
			    };

			    List.prototype.__iterate = function(fn, reverse) {
			      var index = 0;
			      var values = iterateList(this, reverse);
			      var value;
			      while ((value = values()) !== DONE) {
			        if (fn(value, index++, this) === false) {
			          break;
			        }
			      }
			      return index;
			    };

			    List.prototype.__ensureOwner = function(ownerID) {
			      if (ownerID === this.__ownerID) {
			        return this;
			      }
			      if (!ownerID) {
			        this.__ownerID = ownerID;
			        return this;
			      }
			      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
			    };


			  function isList(maybeList) {
			    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
			  }

			  List.isList = isList;

			  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

			  var ListPrototype = List.prototype;
			  ListPrototype[IS_LIST_SENTINEL] = true;
			  ListPrototype[DELETE] = ListPrototype.remove;
			  ListPrototype.setIn = MapPrototype.setIn;
			  ListPrototype.deleteIn =
			  ListPrototype.removeIn = MapPrototype.removeIn;
			  ListPrototype.update = MapPrototype.update;
			  ListPrototype.updateIn = MapPrototype.updateIn;
			  ListPrototype.mergeIn = MapPrototype.mergeIn;
			  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
			  ListPrototype.withMutations = MapPrototype.withMutations;
			  ListPrototype.asMutable = MapPrototype.asMutable;
			  ListPrototype.asImmutable = MapPrototype.asImmutable;
			  ListPrototype.wasAltered = MapPrototype.wasAltered;



			    function VNode(array, ownerID) {
			      this.array = array;
			      this.ownerID = ownerID;
			    }

			    // TODO: seems like these methods are very similar

			    VNode.prototype.removeBefore = function(ownerID, level, index) {
			      if (index === level ? 1 << level : this.array.length === 0) {
			        return this;
			      }
			      var originIndex = (index >>> level) & MASK;
			      if (originIndex >= this.array.length) {
			        return new VNode([], ownerID);
			      }
			      var removingFirst = originIndex === 0;
			      var newChild;
			      if (level > 0) {
			        var oldChild = this.array[originIndex];
			        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
			        if (newChild === oldChild && removingFirst) {
			          return this;
			        }
			      }
			      if (removingFirst && !newChild) {
			        return this;
			      }
			      var editable = editableVNode(this, ownerID);
			      if (!removingFirst) {
			        for (var ii = 0; ii < originIndex; ii++) {
			          editable.array[ii] = undefined;
			        }
			      }
			      if (newChild) {
			        editable.array[originIndex] = newChild;
			      }
			      return editable;
			    };

			    VNode.prototype.removeAfter = function(ownerID, level, index) {
			      if (index === (level ? 1 << level : 0) || this.array.length === 0) {
			        return this;
			      }
			      var sizeIndex = ((index - 1) >>> level) & MASK;
			      if (sizeIndex >= this.array.length) {
			        return this;
			      }

			      var newChild;
			      if (level > 0) {
			        var oldChild = this.array[sizeIndex];
			        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
			        if (newChild === oldChild && sizeIndex === this.array.length - 1) {
			          return this;
			        }
			      }

			      var editable = editableVNode(this, ownerID);
			      editable.array.splice(sizeIndex + 1);
			      if (newChild) {
			        editable.array[sizeIndex] = newChild;
			      }
			      return editable;
			    };



			  var DONE = {};

			  function iterateList(list, reverse) {
			    var left = list._origin;
			    var right = list._capacity;
			    var tailPos = getTailOffset(right);
			    var tail = list._tail;

			    return iterateNodeOrLeaf(list._root, list._level, 0);

			    function iterateNodeOrLeaf(node, level, offset) {
			      return level === 0 ?
			        iterateLeaf(node, offset) :
			        iterateNode(node, level, offset);
			    }

			    function iterateLeaf(node, offset) {
			      var array = offset === tailPos ? tail && tail.array : node && node.array;
			      var from = offset > left ? 0 : left - offset;
			      var to = right - offset;
			      if (to > SIZE) {
			        to = SIZE;
			      }
			      return function()  {
			        if (from === to) {
			          return DONE;
			        }
			        var idx = reverse ? --to : from++;
			        return array && array[idx];
			      };
			    }

			    function iterateNode(node, level, offset) {
			      var values;
			      var array = node && node.array;
			      var from = offset > left ? 0 : (left - offset) >> level;
			      var to = ((right - offset) >> level) + 1;
			      if (to > SIZE) {
			        to = SIZE;
			      }
			      return function()  {
			        do {
			          if (values) {
			            var value = values();
			            if (value !== DONE) {
			              return value;
			            }
			            values = null;
			          }
			          if (from === to) {
			            return DONE;
			          }
			          var idx = reverse ? --to : from++;
			          values = iterateNodeOrLeaf(
			            array && array[idx], level - SHIFT, offset + (idx << level)
			          );
			        } while (true);
			      };
			    }
			  }

			  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
			    var list = Object.create(ListPrototype);
			    list.size = capacity - origin;
			    list._origin = origin;
			    list._capacity = capacity;
			    list._level = level;
			    list._root = root;
			    list._tail = tail;
			    list.__ownerID = ownerID;
			    list.__hash = hash;
			    list.__altered = false;
			    return list;
			  }

			  var EMPTY_LIST;
			  function emptyList() {
			    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
			  }

			  function updateList(list, index, value) {
			    index = wrapIndex(list, index);

			    if (index !== index) {
			      return list;
			    }

			    if (index >= list.size || index < 0) {
			      return list.withMutations(function(list ) {
			        index < 0 ?
			          setListBounds(list, index).set(0, value) :
			          setListBounds(list, 0, index + 1).set(index, value);
			      });
			    }

			    index += list._origin;

			    var newTail = list._tail;
			    var newRoot = list._root;
			    var didAlter = MakeRef(DID_ALTER);
			    if (index >= getTailOffset(list._capacity)) {
			      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
			    } else {
			      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
			    }

			    if (!didAlter.value) {
			      return list;
			    }

			    if (list.__ownerID) {
			      list._root = newRoot;
			      list._tail = newTail;
			      list.__hash = undefined;
			      list.__altered = true;
			      return list;
			    }
			    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
			  }

			  function updateVNode(node, ownerID, level, index, value, didAlter) {
			    var idx = (index >>> level) & MASK;
			    var nodeHas = node && idx < node.array.length;
			    if (!nodeHas && value === undefined) {
			      return node;
			    }

			    var newNode;

			    if (level > 0) {
			      var lowerNode = node && node.array[idx];
			      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
			      if (newLowerNode === lowerNode) {
			        return node;
			      }
			      newNode = editableVNode(node, ownerID);
			      newNode.array[idx] = newLowerNode;
			      return newNode;
			    }

			    if (nodeHas && node.array[idx] === value) {
			      return node;
			    }

			    SetRef(didAlter);

			    newNode = editableVNode(node, ownerID);
			    if (value === undefined && idx === newNode.array.length - 1) {
			      newNode.array.pop();
			    } else {
			      newNode.array[idx] = value;
			    }
			    return newNode;
			  }

			  function editableVNode(node, ownerID) {
			    if (ownerID && node && ownerID === node.ownerID) {
			      return node;
			    }
			    return new VNode(node ? node.array.slice() : [], ownerID);
			  }

			  function listNodeFor(list, rawIndex) {
			    if (rawIndex >= getTailOffset(list._capacity)) {
			      return list._tail;
			    }
			    if (rawIndex < 1 << (list._level + SHIFT)) {
			      var node = list._root;
			      var level = list._level;
			      while (node && level > 0) {
			        node = node.array[(rawIndex >>> level) & MASK];
			        level -= SHIFT;
			      }
			      return node;
			    }
			  }

			  function setListBounds(list, begin, end) {
			    // Sanitize begin & end using this shorthand for ToInt32(argument)
			    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
			    if (begin !== undefined) {
			      begin = begin | 0;
			    }
			    if (end !== undefined) {
			      end = end | 0;
			    }
			    var owner = list.__ownerID || new OwnerID();
			    var oldOrigin = list._origin;
			    var oldCapacity = list._capacity;
			    var newOrigin = oldOrigin + begin;
			    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
			    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
			      return list;
			    }

			    // If it's going to end after it starts, it's empty.
			    if (newOrigin >= newCapacity) {
			      return list.clear();
			    }

			    var newLevel = list._level;
			    var newRoot = list._root;

			    // New origin might need creating a higher root.
			    var offsetShift = 0;
			    while (newOrigin + offsetShift < 0) {
			      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
			      newLevel += SHIFT;
			      offsetShift += 1 << newLevel;
			    }
			    if (offsetShift) {
			      newOrigin += offsetShift;
			      oldOrigin += offsetShift;
			      newCapacity += offsetShift;
			      oldCapacity += offsetShift;
			    }

			    var oldTailOffset = getTailOffset(oldCapacity);
			    var newTailOffset = getTailOffset(newCapacity);

			    // New size might need creating a higher root.
			    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
			      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
			      newLevel += SHIFT;
			    }

			    // Locate or create the new tail.
			    var oldTail = list._tail;
			    var newTail = newTailOffset < oldTailOffset ?
			      listNodeFor(list, newCapacity - 1) :
			      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

			    // Merge Tail into tree.
			    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
			      newRoot = editableVNode(newRoot, owner);
			      var node = newRoot;
			      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
			        var idx = (oldTailOffset >>> level) & MASK;
			        node = node.array[idx] = editableVNode(node.array[idx], owner);
			      }
			      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
			    }

			    // If the size has been reduced, there's a chance the tail needs to be trimmed.
			    if (newCapacity < oldCapacity) {
			      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
			    }

			    // If the new origin is within the tail, then we do not need a root.
			    if (newOrigin >= newTailOffset) {
			      newOrigin -= newTailOffset;
			      newCapacity -= newTailOffset;
			      newLevel = SHIFT;
			      newRoot = null;
			      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

			    // Otherwise, if the root has been trimmed, garbage collect.
			    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
			      offsetShift = 0;

			      // Identify the new top root node of the subtree of the old root.
			      while (newRoot) {
			        var beginIndex = (newOrigin >>> newLevel) & MASK;
			        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
			          break;
			        }
			        if (beginIndex) {
			          offsetShift += (1 << newLevel) * beginIndex;
			        }
			        newLevel -= SHIFT;
			        newRoot = newRoot.array[beginIndex];
			      }

			      // Trim the new sides of the new root.
			      if (newRoot && newOrigin > oldOrigin) {
			        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
			      }
			      if (newRoot && newTailOffset < oldTailOffset) {
			        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
			      }
			      if (offsetShift) {
			        newOrigin -= offsetShift;
			        newCapacity -= offsetShift;
			      }
			    }

			    if (list.__ownerID) {
			      list.size = newCapacity - newOrigin;
			      list._origin = newOrigin;
			      list._capacity = newCapacity;
			      list._level = newLevel;
			      list._root = newRoot;
			      list._tail = newTail;
			      list.__hash = undefined;
			      list.__altered = true;
			      return list;
			    }
			    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
			  }

			  function mergeIntoListWith(list, merger, iterables) {
			    var iters = [];
			    var maxSize = 0;
			    for (var ii = 0; ii < iterables.length; ii++) {
			      var value = iterables[ii];
			      var iter = IndexedIterable(value);
			      if (iter.size > maxSize) {
			        maxSize = iter.size;
			      }
			      if (!isIterable(value)) {
			        iter = iter.map(function(v ) {return fromJS(v)});
			      }
			      iters.push(iter);
			    }
			    if (maxSize > list.size) {
			      list = list.setSize(maxSize);
			    }
			    return mergeIntoCollectionWith(list, merger, iters);
			  }

			  function getTailOffset(size) {
			    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
			  }

			  createClass(OrderedMap, Map);

			    // @pragma Construction

			    function OrderedMap(value) {
			      return value === null || value === undefined ? emptyOrderedMap() :
			        isOrderedMap(value) ? value :
			        emptyOrderedMap().withMutations(function(map ) {
			          var iter = KeyedIterable(value);
			          assertNotInfinite(iter.size);
			          iter.forEach(function(v, k)  {return map.set(k, v)});
			        });
			    }

			    OrderedMap.of = function(/*...values*/) {
			      return this(arguments);
			    };

			    OrderedMap.prototype.toString = function() {
			      return this.__toString('OrderedMap {', '}');
			    };

			    // @pragma Access

			    OrderedMap.prototype.get = function(k, notSetValue) {
			      var index = this._map.get(k);
			      return index !== undefined ? this._list.get(index)[1] : notSetValue;
			    };

			    // @pragma Modification

			    OrderedMap.prototype.clear = function() {
			      if (this.size === 0) {
			        return this;
			      }
			      if (this.__ownerID) {
			        this.size = 0;
			        this._map.clear();
			        this._list.clear();
			        return this;
			      }
			      return emptyOrderedMap();
			    };

			    OrderedMap.prototype.set = function(k, v) {
			      return updateOrderedMap(this, k, v);
			    };

			    OrderedMap.prototype.remove = function(k) {
			      return updateOrderedMap(this, k, NOT_SET);
			    };

			    OrderedMap.prototype.wasAltered = function() {
			      return this._map.wasAltered() || this._list.wasAltered();
			    };

			    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
			      return this._list.__iterate(
			        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
			        reverse
			      );
			    };

			    OrderedMap.prototype.__iterator = function(type, reverse) {
			      return this._list.fromEntrySeq().__iterator(type, reverse);
			    };

			    OrderedMap.prototype.__ensureOwner = function(ownerID) {
			      if (ownerID === this.__ownerID) {
			        return this;
			      }
			      var newMap = this._map.__ensureOwner(ownerID);
			      var newList = this._list.__ensureOwner(ownerID);
			      if (!ownerID) {
			        this.__ownerID = ownerID;
			        this._map = newMap;
			        this._list = newList;
			        return this;
			      }
			      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
			    };


			  function isOrderedMap(maybeOrderedMap) {
			    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
			  }

			  OrderedMap.isOrderedMap = isOrderedMap;

			  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
			  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;



			  function makeOrderedMap(map, list, ownerID, hash) {
			    var omap = Object.create(OrderedMap.prototype);
			    omap.size = map ? map.size : 0;
			    omap._map = map;
			    omap._list = list;
			    omap.__ownerID = ownerID;
			    omap.__hash = hash;
			    return omap;
			  }

			  var EMPTY_ORDERED_MAP;
			  function emptyOrderedMap() {
			    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
			  }

			  function updateOrderedMap(omap, k, v) {
			    var map = omap._map;
			    var list = omap._list;
			    var i = map.get(k);
			    var has = i !== undefined;
			    var newMap;
			    var newList;
			    if (v === NOT_SET) { // removed
			      if (!has) {
			        return omap;
			      }
			      if (list.size >= SIZE && list.size >= map.size * 2) {
			        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
			        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
			        if (omap.__ownerID) {
			          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
			        }
			      } else {
			        newMap = map.remove(k);
			        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
			      }
			    } else {
			      if (has) {
			        if (v === list.get(i)[1]) {
			          return omap;
			        }
			        newMap = map;
			        newList = list.set(i, [k, v]);
			      } else {
			        newMap = map.set(k, list.size);
			        newList = list.set(list.size, [k, v]);
			      }
			    }
			    if (omap.__ownerID) {
			      omap.size = newMap.size;
			      omap._map = newMap;
			      omap._list = newList;
			      omap.__hash = undefined;
			      return omap;
			    }
			    return makeOrderedMap(newMap, newList);
			  }

			  createClass(ToKeyedSequence, KeyedSeq);
			    function ToKeyedSequence(indexed, useKeys) {
			      this._iter = indexed;
			      this._useKeys = useKeys;
			      this.size = indexed.size;
			    }

			    ToKeyedSequence.prototype.get = function(key, notSetValue) {
			      return this._iter.get(key, notSetValue);
			    };

			    ToKeyedSequence.prototype.has = function(key) {
			      return this._iter.has(key);
			    };

			    ToKeyedSequence.prototype.valueSeq = function() {
			      return this._iter.valueSeq();
			    };

			    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
			      var reversedSequence = reverseFactory(this, true);
			      if (!this._useKeys) {
			        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
			      }
			      return reversedSequence;
			    };

			    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
			      var mappedSequence = mapFactory(this, mapper, context);
			      if (!this._useKeys) {
			        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
			      }
			      return mappedSequence;
			    };

			    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
			      var ii;
			      return this._iter.__iterate(
			        this._useKeys ?
			          function(v, k)  {return fn(v, k, this$0)} :
			          ((ii = reverse ? resolveSize(this) : 0),
			            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
			        reverse
			      );
			    };

			    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
			      if (this._useKeys) {
			        return this._iter.__iterator(type, reverse);
			      }
			      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
			      var ii = reverse ? resolveSize(this) : 0;
			      return new Iterator(function()  {
			        var step = iterator.next();
			        return step.done ? step :
			          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
			      });
			    };

			  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;


			  createClass(ToIndexedSequence, IndexedSeq);
			    function ToIndexedSequence(iter) {
			      this._iter = iter;
			      this.size = iter.size;
			    }

			    ToIndexedSequence.prototype.includes = function(value) {
			      return this._iter.includes(value);
			    };

			    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
			      var iterations = 0;
			      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
			    };

			    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
			      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
			      var iterations = 0;
			      return new Iterator(function()  {
			        var step = iterator.next();
			        return step.done ? step :
			          iteratorValue(type, iterations++, step.value, step)
			      });
			    };



			  createClass(ToSetSequence, SetSeq);
			    function ToSetSequence(iter) {
			      this._iter = iter;
			      this.size = iter.size;
			    }

			    ToSetSequence.prototype.has = function(key) {
			      return this._iter.includes(key);
			    };

			    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
			      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
			    };

			    ToSetSequence.prototype.__iterator = function(type, reverse) {
			      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
			      return new Iterator(function()  {
			        var step = iterator.next();
			        return step.done ? step :
			          iteratorValue(type, step.value, step.value, step);
			      });
			    };



			  createClass(FromEntriesSequence, KeyedSeq);
			    function FromEntriesSequence(entries) {
			      this._iter = entries;
			      this.size = entries.size;
			    }

			    FromEntriesSequence.prototype.entrySeq = function() {
			      return this._iter.toSeq();
			    };

			    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
			      return this._iter.__iterate(function(entry ) {
			        // Check if entry exists first so array access doesn't throw for holes
			        // in the parent iteration.
			        if (entry) {
			          validateEntry(entry);
			          var indexedIterable = isIterable(entry);
			          return fn(
			            indexedIterable ? entry.get(1) : entry[1],
			            indexedIterable ? entry.get(0) : entry[0],
			            this$0
			          );
			        }
			      }, reverse);
			    };

			    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
			      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
			      return new Iterator(function()  {
			        while (true) {
			          var step = iterator.next();
			          if (step.done) {
			            return step;
			          }
			          var entry = step.value;
			          // Check if entry exists first so array access doesn't throw for holes
			          // in the parent iteration.
			          if (entry) {
			            validateEntry(entry);
			            var indexedIterable = isIterable(entry);
			            return iteratorValue(
			              type,
			              indexedIterable ? entry.get(0) : entry[0],
			              indexedIterable ? entry.get(1) : entry[1],
			              step
			            );
			          }
			        }
			      });
			    };


			  ToIndexedSequence.prototype.cacheResult =
			  ToKeyedSequence.prototype.cacheResult =
			  ToSetSequence.prototype.cacheResult =
			  FromEntriesSequence.prototype.cacheResult =
			    cacheResultThrough;


			  function flipFactory(iterable) {
			    var flipSequence = makeSequence(iterable);
			    flipSequence._iter = iterable;
			    flipSequence.size = iterable.size;
			    flipSequence.flip = function()  {return iterable};
			    flipSequence.reverse = function () {
			      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
			      reversedSequence.flip = function()  {return iterable.reverse()};
			      return reversedSequence;
			    };
			    flipSequence.has = function(key ) {return iterable.includes(key)};
			    flipSequence.includes = function(key ) {return iterable.has(key)};
			    flipSequence.cacheResult = cacheResultThrough;
			    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
			      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
			    };
			    flipSequence.__iteratorUncached = function(type, reverse) {
			      if (type === ITERATE_ENTRIES) {
			        var iterator = iterable.__iterator(type, reverse);
			        return new Iterator(function()  {
			          var step = iterator.next();
			          if (!step.done) {
			            var k = step.value[0];
			            step.value[0] = step.value[1];
			            step.value[1] = k;
			          }
			          return step;
			        });
			      }
			      return iterable.__iterator(
			        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
			        reverse
			      );
			    };
			    return flipSequence;
			  }


			  function mapFactory(iterable, mapper, context) {
			    var mappedSequence = makeSequence(iterable);
			    mappedSequence.size = iterable.size;
			    mappedSequence.has = function(key ) {return iterable.has(key)};
			    mappedSequence.get = function(key, notSetValue)  {
			      var v = iterable.get(key, NOT_SET);
			      return v === NOT_SET ?
			        notSetValue :
			        mapper.call(context, v, key, iterable);
			    };
			    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
			      return iterable.__iterate(
			        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
			        reverse
			      );
			    };
			    mappedSequence.__iteratorUncached = function (type, reverse) {
			      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
			      return new Iterator(function()  {
			        var step = iterator.next();
			        if (step.done) {
			          return step;
			        }
			        var entry = step.value;
			        var key = entry[0];
			        return iteratorValue(
			          type,
			          key,
			          mapper.call(context, entry[1], key, iterable),
			          step
			        );
			      });
			    };
			    return mappedSequence;
			  }


			  function reverseFactory(iterable, useKeys) {
			    var reversedSequence = makeSequence(iterable);
			    reversedSequence._iter = iterable;
			    reversedSequence.size = iterable.size;
			    reversedSequence.reverse = function()  {return iterable};
			    if (iterable.flip) {
			      reversedSequence.flip = function () {
			        var flipSequence = flipFactory(iterable);
			        flipSequence.reverse = function()  {return iterable.flip()};
			        return flipSequence;
			      };
			    }
			    reversedSequence.get = function(key, notSetValue) 
			      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
			    reversedSequence.has = function(key )
			      {return iterable.has(useKeys ? key : -1 - key)};
			    reversedSequence.includes = function(value ) {return iterable.includes(value)};
			    reversedSequence.cacheResult = cacheResultThrough;
			    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
			      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
			    };
			    reversedSequence.__iterator =
			      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
			    return reversedSequence;
			  }


			  function filterFactory(iterable, predicate, context, useKeys) {
			    var filterSequence = makeSequence(iterable);
			    if (useKeys) {
			      filterSequence.has = function(key ) {
			        var v = iterable.get(key, NOT_SET);
			        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
			      };
			      filterSequence.get = function(key, notSetValue)  {
			        var v = iterable.get(key, NOT_SET);
			        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
			          v : notSetValue;
			      };
			    }
			    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
			      var iterations = 0;
			      iterable.__iterate(function(v, k, c)  {
			        if (predicate.call(context, v, k, c)) {
			          iterations++;
			          return fn(v, useKeys ? k : iterations - 1, this$0);
			        }
			      }, reverse);
			      return iterations;
			    };
			    filterSequence.__iteratorUncached = function (type, reverse) {
			      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
			      var iterations = 0;
			      return new Iterator(function()  {
			        while (true) {
			          var step = iterator.next();
			          if (step.done) {
			            return step;
			          }
			          var entry = step.value;
			          var key = entry[0];
			          var value = entry[1];
			          if (predicate.call(context, value, key, iterable)) {
			            return iteratorValue(type, useKeys ? key : iterations++, value, step);
			          }
			        }
			      });
			    };
			    return filterSequence;
			  }


			  function countByFactory(iterable, grouper, context) {
			    var groups = Map().asMutable();
			    iterable.__iterate(function(v, k)  {
			      groups.update(
			        grouper.call(context, v, k, iterable),
			        0,
			        function(a ) {return a + 1}
			      );
			    });
			    return groups.asImmutable();
			  }


			  function groupByFactory(iterable, grouper, context) {
			    var isKeyedIter = isKeyed(iterable);
			    var groups = (isOrdered(iterable) ? OrderedMap() : Map()).asMutable();
			    iterable.__iterate(function(v, k)  {
			      groups.update(
			        grouper.call(context, v, k, iterable),
			        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
			      );
			    });
			    var coerce = iterableClass(iterable);
			    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
			  }


			  function sliceFactory(iterable, begin, end, useKeys) {
			    var originalSize = iterable.size;

			    // Sanitize begin & end using this shorthand for ToInt32(argument)
			    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
			    if (begin !== undefined) {
			      begin = begin | 0;
			    }
			    if (end !== undefined) {
			      end = end | 0;
			    }

			    if (wholeSlice(begin, end, originalSize)) {
			      return iterable;
			    }

			    var resolvedBegin = resolveBegin(begin, originalSize);
			    var resolvedEnd = resolveEnd(end, originalSize);

			    // begin or end will be NaN if they were provided as negative numbers and
			    // this iterable's size is unknown. In that case, cache first so there is
			    // a known size and these do not resolve to NaN.
			    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
			      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
			    }

			    // Note: resolvedEnd is undefined when the original sequence's length is
			    // unknown and this slice did not supply an end and should contain all
			    // elements after resolvedBegin.
			    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
			    var resolvedSize = resolvedEnd - resolvedBegin;
			    var sliceSize;
			    if (resolvedSize === resolvedSize) {
			      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
			    }

			    var sliceSeq = makeSequence(iterable);

			    // If iterable.size is undefined, the size of the realized sliceSeq is
			    // unknown at this point unless the number of items to slice is 0
			    sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || undefined;

			    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
			      sliceSeq.get = function (index, notSetValue) {
			        index = wrapIndex(this, index);
			        return index >= 0 && index < sliceSize ?
			          iterable.get(index + resolvedBegin, notSetValue) :
			          notSetValue;
			      };
			    }

			    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
			      if (sliceSize === 0) {
			        return 0;
			      }
			      if (reverse) {
			        return this.cacheResult().__iterate(fn, reverse);
			      }
			      var skipped = 0;
			      var isSkipping = true;
			      var iterations = 0;
			      iterable.__iterate(function(v, k)  {
			        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
			          iterations++;
			          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
			                 iterations !== sliceSize;
			        }
			      });
			      return iterations;
			    };

			    sliceSeq.__iteratorUncached = function(type, reverse) {
			      if (sliceSize !== 0 && reverse) {
			        return this.cacheResult().__iterator(type, reverse);
			      }
			      // Don't bother instantiating parent iterator if taking 0.
			      var iterator = sliceSize !== 0 && iterable.__iterator(type, reverse);
			      var skipped = 0;
			      var iterations = 0;
			      return new Iterator(function()  {
			        while (skipped++ < resolvedBegin) {
			          iterator.next();
			        }
			        if (++iterations > sliceSize) {
			          return iteratorDone();
			        }
			        var step = iterator.next();
			        if (useKeys || type === ITERATE_VALUES) {
			          return step;
			        } else if (type === ITERATE_KEYS) {
			          return iteratorValue(type, iterations - 1, undefined, step);
			        } else {
			          return iteratorValue(type, iterations - 1, step.value[1], step);
			        }
			      });
			    };

			    return sliceSeq;
			  }


			  function takeWhileFactory(iterable, predicate, context) {
			    var takeSequence = makeSequence(iterable);
			    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
			      if (reverse) {
			        return this.cacheResult().__iterate(fn, reverse);
			      }
			      var iterations = 0;
			      iterable.__iterate(function(v, k, c) 
			        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
			      );
			      return iterations;
			    };
			    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
			      if (reverse) {
			        return this.cacheResult().__iterator(type, reverse);
			      }
			      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
			      var iterating = true;
			      return new Iterator(function()  {
			        if (!iterating) {
			          return iteratorDone();
			        }
			        var step = iterator.next();
			        if (step.done) {
			          return step;
			        }
			        var entry = step.value;
			        var k = entry[0];
			        var v = entry[1];
			        if (!predicate.call(context, v, k, this$0)) {
			          iterating = false;
			          return iteratorDone();
			        }
			        return type === ITERATE_ENTRIES ? step :
			          iteratorValue(type, k, v, step);
			      });
			    };
			    return takeSequence;
			  }


			  function skipWhileFactory(iterable, predicate, context, useKeys) {
			    var skipSequence = makeSequence(iterable);
			    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
			      if (reverse) {
			        return this.cacheResult().__iterate(fn, reverse);
			      }
			      var isSkipping = true;
			      var iterations = 0;
			      iterable.__iterate(function(v, k, c)  {
			        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
			          iterations++;
			          return fn(v, useKeys ? k : iterations - 1, this$0);
			        }
			      });
			      return iterations;
			    };
			    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
			      if (reverse) {
			        return this.cacheResult().__iterator(type, reverse);
			      }
			      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
			      var skipping = true;
			      var iterations = 0;
			      return new Iterator(function()  {
			        var step, k, v;
			        do {
			          step = iterator.next();
			          if (step.done) {
			            if (useKeys || type === ITERATE_VALUES) {
			              return step;
			            } else if (type === ITERATE_KEYS) {
			              return iteratorValue(type, iterations++, undefined, step);
			            } else {
			              return iteratorValue(type, iterations++, step.value[1], step);
			            }
			          }
			          var entry = step.value;
			          k = entry[0];
			          v = entry[1];
			          skipping && (skipping = predicate.call(context, v, k, this$0));
			        } while (skipping);
			        return type === ITERATE_ENTRIES ? step :
			          iteratorValue(type, k, v, step);
			      });
			    };
			    return skipSequence;
			  }


			  function concatFactory(iterable, values) {
			    var isKeyedIterable = isKeyed(iterable);
			    var iters = [iterable].concat(values).map(function(v ) {
			      if (!isIterable(v)) {
			        v = isKeyedIterable ?
			          keyedSeqFromValue(v) :
			          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
			      } else if (isKeyedIterable) {
			        v = KeyedIterable(v);
			      }
			      return v;
			    }).filter(function(v ) {return v.size !== 0});

			    if (iters.length === 0) {
			      return iterable;
			    }

			    if (iters.length === 1) {
			      var singleton = iters[0];
			      if (singleton === iterable ||
			          isKeyedIterable && isKeyed(singleton) ||
			          isIndexed(iterable) && isIndexed(singleton)) {
			        return singleton;
			      }
			    }

			    var concatSeq = new ArraySeq(iters);
			    if (isKeyedIterable) {
			      concatSeq = concatSeq.toKeyedSeq();
			    } else if (!isIndexed(iterable)) {
			      concatSeq = concatSeq.toSetSeq();
			    }
			    concatSeq = concatSeq.flatten(true);
			    concatSeq.size = iters.reduce(
			      function(sum, seq)  {
			        if (sum !== undefined) {
			          var size = seq.size;
			          if (size !== undefined) {
			            return sum + size;
			          }
			        }
			      },
			      0
			    );
			    return concatSeq;
			  }


			  function flattenFactory(iterable, depth, useKeys) {
			    var flatSequence = makeSequence(iterable);
			    flatSequence.__iterateUncached = function(fn, reverse) {
			      var iterations = 0;
			      var stopped = false;
			      function flatDeep(iter, currentDepth) {var this$0 = this;
			        iter.__iterate(function(v, k)  {
			          if ((!depth || currentDepth < depth) && isIterable(v)) {
			            flatDeep(v, currentDepth + 1);
			          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
			            stopped = true;
			          }
			          return !stopped;
			        }, reverse);
			      }
			      flatDeep(iterable, 0);
			      return iterations;
			    };
			    flatSequence.__iteratorUncached = function(type, reverse) {
			      var iterator = iterable.__iterator(type, reverse);
			      var stack = [];
			      var iterations = 0;
			      return new Iterator(function()  {
			        while (iterator) {
			          var step = iterator.next();
			          if (step.done !== false) {
			            iterator = stack.pop();
			            continue;
			          }
			          var v = step.value;
			          if (type === ITERATE_ENTRIES) {
			            v = v[1];
			          }
			          if ((!depth || stack.length < depth) && isIterable(v)) {
			            stack.push(iterator);
			            iterator = v.__iterator(type, reverse);
			          } else {
			            return useKeys ? step : iteratorValue(type, iterations++, v, step);
			          }
			        }
			        return iteratorDone();
			      });
			    };
			    return flatSequence;
			  }


			  function flatMapFactory(iterable, mapper, context) {
			    var coerce = iterableClass(iterable);
			    return iterable.toSeq().map(
			      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
			    ).flatten(true);
			  }


			  function interposeFactory(iterable, separator) {
			    var interposedSequence = makeSequence(iterable);
			    interposedSequence.size = iterable.size && iterable.size * 2 -1;
			    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
			      var iterations = 0;
			      iterable.__iterate(function(v, k) 
			        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
			        fn(v, iterations++, this$0) !== false},
			        reverse
			      );
			      return iterations;
			    };
			    interposedSequence.__iteratorUncached = function(type, reverse) {
			      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
			      var iterations = 0;
			      var step;
			      return new Iterator(function()  {
			        if (!step || iterations % 2) {
			          step = iterator.next();
			          if (step.done) {
			            return step;
			          }
			        }
			        return iterations % 2 ?
			          iteratorValue(type, iterations++, separator) :
			          iteratorValue(type, iterations++, step.value, step);
			      });
			    };
			    return interposedSequence;
			  }


			  function sortFactory(iterable, comparator, mapper) {
			    if (!comparator) {
			      comparator = defaultComparator;
			    }
			    var isKeyedIterable = isKeyed(iterable);
			    var index = 0;
			    var entries = iterable.toSeq().map(
			      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
			    ).toArray();
			    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
			      isKeyedIterable ?
			      function(v, i)  { entries[i].length = 2; } :
			      function(v, i)  { entries[i] = v[1]; }
			    );
			    return isKeyedIterable ? KeyedSeq(entries) :
			      isIndexed(iterable) ? IndexedSeq(entries) :
			      SetSeq(entries);
			  }


			  function maxFactory(iterable, comparator, mapper) {
			    if (!comparator) {
			      comparator = defaultComparator;
			    }
			    if (mapper) {
			      var entry = iterable.toSeq()
			        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
			        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
			      return entry && entry[0];
			    } else {
			      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
			    }
			  }

			  function maxCompare(comparator, a, b) {
			    var comp = comparator(b, a);
			    // b is considered the new max if the comparator declares them equal, but
			    // they are not equal and b is in fact a nullish value.
			    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
			  }


			  function zipWithFactory(keyIter, zipper, iters) {
			    var zipSequence = makeSequence(keyIter);
			    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
			    // Note: this a generic base implementation of __iterate in terms of
			    // __iterator which may be more generically useful in the future.
			    zipSequence.__iterate = function(fn, reverse) {
			      /* generic:
			      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
			      var step;
			      var iterations = 0;
			      while (!(step = iterator.next()).done) {
			        iterations++;
			        if (fn(step.value[1], step.value[0], this) === false) {
			          break;
			        }
			      }
			      return iterations;
			      */
			      // indexed:
			      var iterator = this.__iterator(ITERATE_VALUES, reverse);
			      var step;
			      var iterations = 0;
			      while (!(step = iterator.next()).done) {
			        if (fn(step.value, iterations++, this) === false) {
			          break;
			        }
			      }
			      return iterations;
			    };
			    zipSequence.__iteratorUncached = function(type, reverse) {
			      var iterators = iters.map(function(i )
			        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
			      );
			      var iterations = 0;
			      var isDone = false;
			      return new Iterator(function()  {
			        var steps;
			        if (!isDone) {
			          steps = iterators.map(function(i ) {return i.next()});
			          isDone = steps.some(function(s ) {return s.done});
			        }
			        if (isDone) {
			          return iteratorDone();
			        }
			        return iteratorValue(
			          type,
			          iterations++,
			          zipper.apply(null, steps.map(function(s ) {return s.value}))
			        );
			      });
			    };
			    return zipSequence
			  }


			  // #pragma Helper Functions

			  function reify(iter, seq) {
			    return isSeq(iter) ? seq : iter.constructor(seq);
			  }

			  function validateEntry(entry) {
			    if (entry !== Object(entry)) {
			      throw new TypeError('Expected [K, V] tuple: ' + entry);
			    }
			  }

			  function resolveSize(iter) {
			    assertNotInfinite(iter.size);
			    return ensureSize(iter);
			  }

			  function iterableClass(iterable) {
			    return isKeyed(iterable) ? KeyedIterable :
			      isIndexed(iterable) ? IndexedIterable :
			      SetIterable;
			  }

			  function makeSequence(iterable) {
			    return Object.create(
			      (
			        isKeyed(iterable) ? KeyedSeq :
			        isIndexed(iterable) ? IndexedSeq :
			        SetSeq
			      ).prototype
			    );
			  }

			  function cacheResultThrough() {
			    if (this._iter.cacheResult) {
			      this._iter.cacheResult();
			      this.size = this._iter.size;
			      return this;
			    } else {
			      return Seq.prototype.cacheResult.call(this);
			    }
			  }

			  function defaultComparator(a, b) {
			    return a > b ? 1 : a < b ? -1 : 0;
			  }

			  function forceIterator(keyPath) {
			    var iter = getIterator(keyPath);
			    if (!iter) {
			      // Array might not be iterable in this environment, so we need a fallback
			      // to our wrapped type.
			      if (!isArrayLike(keyPath)) {
			        throw new TypeError('Expected iterable or array-like: ' + keyPath);
			      }
			      iter = getIterator(Iterable(keyPath));
			    }
			    return iter;
			  }

			  createClass(Record, KeyedCollection);

			    function Record(defaultValues, name) {
			      var hasInitialized;

			      var RecordType = function Record(values) {
			        if (values instanceof RecordType) {
			          return values;
			        }
			        if (!(this instanceof RecordType)) {
			          return new RecordType(values);
			        }
			        if (!hasInitialized) {
			          hasInitialized = true;
			          var keys = Object.keys(defaultValues);
			          setProps(RecordTypePrototype, keys);
			          RecordTypePrototype.size = keys.length;
			          RecordTypePrototype._name = name;
			          RecordTypePrototype._keys = keys;
			          RecordTypePrototype._defaultValues = defaultValues;
			        }
			        this._map = Map(values);
			      };

			      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
			      RecordTypePrototype.constructor = RecordType;

			      return RecordType;
			    }

			    Record.prototype.toString = function() {
			      return this.__toString(recordName(this) + ' {', '}');
			    };

			    // @pragma Access

			    Record.prototype.has = function(k) {
			      return this._defaultValues.hasOwnProperty(k);
			    };

			    Record.prototype.get = function(k, notSetValue) {
			      if (!this.has(k)) {
			        return notSetValue;
			      }
			      var defaultVal = this._defaultValues[k];
			      return this._map ? this._map.get(k, defaultVal) : defaultVal;
			    };

			    // @pragma Modification

			    Record.prototype.clear = function() {
			      if (this.__ownerID) {
			        this._map && this._map.clear();
			        return this;
			      }
			      var RecordType = this.constructor;
			      return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));
			    };

			    Record.prototype.set = function(k, v) {
			      if (!this.has(k)) {
			        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
			      }
			      var newMap = this._map && this._map.set(k, v);
			      if (this.__ownerID || newMap === this._map) {
			        return this;
			      }
			      return makeRecord(this, newMap);
			    };

			    Record.prototype.remove = function(k) {
			      if (!this.has(k)) {
			        return this;
			      }
			      var newMap = this._map && this._map.remove(k);
			      if (this.__ownerID || newMap === this._map) {
			        return this;
			      }
			      return makeRecord(this, newMap);
			    };

			    Record.prototype.wasAltered = function() {
			      return this._map.wasAltered();
			    };

			    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
			      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
			    };

			    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
			      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
			    };

			    Record.prototype.__ensureOwner = function(ownerID) {
			      if (ownerID === this.__ownerID) {
			        return this;
			      }
			      var newMap = this._map && this._map.__ensureOwner(ownerID);
			      if (!ownerID) {
			        this.__ownerID = ownerID;
			        this._map = newMap;
			        return this;
			      }
			      return makeRecord(this, newMap, ownerID);
			    };


			  var RecordPrototype = Record.prototype;
			  RecordPrototype[DELETE] = RecordPrototype.remove;
			  RecordPrototype.deleteIn =
			  RecordPrototype.removeIn = MapPrototype.removeIn;
			  RecordPrototype.merge = MapPrototype.merge;
			  RecordPrototype.mergeWith = MapPrototype.mergeWith;
			  RecordPrototype.mergeIn = MapPrototype.mergeIn;
			  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
			  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
			  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
			  RecordPrototype.setIn = MapPrototype.setIn;
			  RecordPrototype.update = MapPrototype.update;
			  RecordPrototype.updateIn = MapPrototype.updateIn;
			  RecordPrototype.withMutations = MapPrototype.withMutations;
			  RecordPrototype.asMutable = MapPrototype.asMutable;
			  RecordPrototype.asImmutable = MapPrototype.asImmutable;


			  function makeRecord(likeRecord, map, ownerID) {
			    var record = Object.create(Object.getPrototypeOf(likeRecord));
			    record._map = map;
			    record.__ownerID = ownerID;
			    return record;
			  }

			  function recordName(record) {
			    return record._name || record.constructor.name || 'Record';
			  }

			  function setProps(prototype, names) {
			    try {
			      names.forEach(setProp.bind(undefined, prototype));
			    } catch (error) {
			      // Object.defineProperty failed. Probably IE8.
			    }
			  }

			  function setProp(prototype, name) {
			    Object.defineProperty(prototype, name, {
			      get: function() {
			        return this.get(name);
			      },
			      set: function(value) {
			        invariant(this.__ownerID, 'Cannot set on an immutable record.');
			        this.set(name, value);
			      }
			    });
			  }

			  createClass(Set, SetCollection);

			    // @pragma Construction

			    function Set(value) {
			      return value === null || value === undefined ? emptySet() :
			        isSet(value) && !isOrdered(value) ? value :
			        emptySet().withMutations(function(set ) {
			          var iter = SetIterable(value);
			          assertNotInfinite(iter.size);
			          iter.forEach(function(v ) {return set.add(v)});
			        });
			    }

			    Set.of = function(/*...values*/) {
			      return this(arguments);
			    };

			    Set.fromKeys = function(value) {
			      return this(KeyedIterable(value).keySeq());
			    };

			    Set.prototype.toString = function() {
			      return this.__toString('Set {', '}');
			    };

			    // @pragma Access

			    Set.prototype.has = function(value) {
			      return this._map.has(value);
			    };

			    // @pragma Modification

			    Set.prototype.add = function(value) {
			      return updateSet(this, this._map.set(value, true));
			    };

			    Set.prototype.remove = function(value) {
			      return updateSet(this, this._map.remove(value));
			    };

			    Set.prototype.clear = function() {
			      return updateSet(this, this._map.clear());
			    };

			    // @pragma Composition

			    Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
			      iters = iters.filter(function(x ) {return x.size !== 0});
			      if (iters.length === 0) {
			        return this;
			      }
			      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
			        return this.constructor(iters[0]);
			      }
			      return this.withMutations(function(set ) {
			        for (var ii = 0; ii < iters.length; ii++) {
			          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
			        }
			      });
			    };

			    Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
			      if (iters.length === 0) {
			        return this;
			      }
			      iters = iters.map(function(iter ) {return SetIterable(iter)});
			      var originalSet = this;
			      return this.withMutations(function(set ) {
			        originalSet.forEach(function(value ) {
			          if (!iters.every(function(iter ) {return iter.includes(value)})) {
			            set.remove(value);
			          }
			        });
			      });
			    };

			    Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
			      if (iters.length === 0) {
			        return this;
			      }
			      iters = iters.map(function(iter ) {return SetIterable(iter)});
			      var originalSet = this;
			      return this.withMutations(function(set ) {
			        originalSet.forEach(function(value ) {
			          if (iters.some(function(iter ) {return iter.includes(value)})) {
			            set.remove(value);
			          }
			        });
			      });
			    };

			    Set.prototype.merge = function() {
			      return this.union.apply(this, arguments);
			    };

			    Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
			      return this.union.apply(this, iters);
			    };

			    Set.prototype.sort = function(comparator) {
			      // Late binding
			      return OrderedSet(sortFactory(this, comparator));
			    };

			    Set.prototype.sortBy = function(mapper, comparator) {
			      // Late binding
			      return OrderedSet(sortFactory(this, comparator, mapper));
			    };

			    Set.prototype.wasAltered = function() {
			      return this._map.wasAltered();
			    };

			    Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
			      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
			    };

			    Set.prototype.__iterator = function(type, reverse) {
			      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
			    };

			    Set.prototype.__ensureOwner = function(ownerID) {
			      if (ownerID === this.__ownerID) {
			        return this;
			      }
			      var newMap = this._map.__ensureOwner(ownerID);
			      if (!ownerID) {
			        this.__ownerID = ownerID;
			        this._map = newMap;
			        return this;
			      }
			      return this.__make(newMap, ownerID);
			    };


			  function isSet(maybeSet) {
			    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
			  }

			  Set.isSet = isSet;

			  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

			  var SetPrototype = Set.prototype;
			  SetPrototype[IS_SET_SENTINEL] = true;
			  SetPrototype[DELETE] = SetPrototype.remove;
			  SetPrototype.mergeDeep = SetPrototype.merge;
			  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
			  SetPrototype.withMutations = MapPrototype.withMutations;
			  SetPrototype.asMutable = MapPrototype.asMutable;
			  SetPrototype.asImmutable = MapPrototype.asImmutable;

			  SetPrototype.__empty = emptySet;
			  SetPrototype.__make = makeSet;

			  function updateSet(set, newMap) {
			    if (set.__ownerID) {
			      set.size = newMap.size;
			      set._map = newMap;
			      return set;
			    }
			    return newMap === set._map ? set :
			      newMap.size === 0 ? set.__empty() :
			      set.__make(newMap);
			  }

			  function makeSet(map, ownerID) {
			    var set = Object.create(SetPrototype);
			    set.size = map ? map.size : 0;
			    set._map = map;
			    set.__ownerID = ownerID;
			    return set;
			  }

			  var EMPTY_SET;
			  function emptySet() {
			    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
			  }

			  createClass(OrderedSet, Set);

			    // @pragma Construction

			    function OrderedSet(value) {
			      return value === null || value === undefined ? emptyOrderedSet() :
			        isOrderedSet(value) ? value :
			        emptyOrderedSet().withMutations(function(set ) {
			          var iter = SetIterable(value);
			          assertNotInfinite(iter.size);
			          iter.forEach(function(v ) {return set.add(v)});
			        });
			    }

			    OrderedSet.of = function(/*...values*/) {
			      return this(arguments);
			    };

			    OrderedSet.fromKeys = function(value) {
			      return this(KeyedIterable(value).keySeq());
			    };

			    OrderedSet.prototype.toString = function() {
			      return this.__toString('OrderedSet {', '}');
			    };


			  function isOrderedSet(maybeOrderedSet) {
			    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
			  }

			  OrderedSet.isOrderedSet = isOrderedSet;

			  var OrderedSetPrototype = OrderedSet.prototype;
			  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;

			  OrderedSetPrototype.__empty = emptyOrderedSet;
			  OrderedSetPrototype.__make = makeOrderedSet;

			  function makeOrderedSet(map, ownerID) {
			    var set = Object.create(OrderedSetPrototype);
			    set.size = map ? map.size : 0;
			    set._map = map;
			    set.__ownerID = ownerID;
			    return set;
			  }

			  var EMPTY_ORDERED_SET;
			  function emptyOrderedSet() {
			    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
			  }

			  createClass(Stack, IndexedCollection);

			    // @pragma Construction

			    function Stack(value) {
			      return value === null || value === undefined ? emptyStack() :
			        isStack(value) ? value :
			        emptyStack().unshiftAll(value);
			    }

			    Stack.of = function(/*...values*/) {
			      return this(arguments);
			    };

			    Stack.prototype.toString = function() {
			      return this.__toString('Stack [', ']');
			    };

			    // @pragma Access

			    Stack.prototype.get = function(index, notSetValue) {
			      var head = this._head;
			      index = wrapIndex(this, index);
			      while (head && index--) {
			        head = head.next;
			      }
			      return head ? head.value : notSetValue;
			    };

			    Stack.prototype.peek = function() {
			      return this._head && this._head.value;
			    };

			    // @pragma Modification

			    Stack.prototype.push = function(/*...values*/) {
			      if (arguments.length === 0) {
			        return this;
			      }
			      var newSize = this.size + arguments.length;
			      var head = this._head;
			      for (var ii = arguments.length - 1; ii >= 0; ii--) {
			        head = {
			          value: arguments[ii],
			          next: head
			        };
			      }
			      if (this.__ownerID) {
			        this.size = newSize;
			        this._head = head;
			        this.__hash = undefined;
			        this.__altered = true;
			        return this;
			      }
			      return makeStack(newSize, head);
			    };

			    Stack.prototype.pushAll = function(iter) {
			      iter = IndexedIterable(iter);
			      if (iter.size === 0) {
			        return this;
			      }
			      assertNotInfinite(iter.size);
			      var newSize = this.size;
			      var head = this._head;
			      iter.reverse().forEach(function(value ) {
			        newSize++;
			        head = {
			          value: value,
			          next: head
			        };
			      });
			      if (this.__ownerID) {
			        this.size = newSize;
			        this._head = head;
			        this.__hash = undefined;
			        this.__altered = true;
			        return this;
			      }
			      return makeStack(newSize, head);
			    };

			    Stack.prototype.pop = function() {
			      return this.slice(1);
			    };

			    Stack.prototype.unshift = function(/*...values*/) {
			      return this.push.apply(this, arguments);
			    };

			    Stack.prototype.unshiftAll = function(iter) {
			      return this.pushAll(iter);
			    };

			    Stack.prototype.shift = function() {
			      return this.pop.apply(this, arguments);
			    };

			    Stack.prototype.clear = function() {
			      if (this.size === 0) {
			        return this;
			      }
			      if (this.__ownerID) {
			        this.size = 0;
			        this._head = undefined;
			        this.__hash = undefined;
			        this.__altered = true;
			        return this;
			      }
			      return emptyStack();
			    };

			    Stack.prototype.slice = function(begin, end) {
			      if (wholeSlice(begin, end, this.size)) {
			        return this;
			      }
			      var resolvedBegin = resolveBegin(begin, this.size);
			      var resolvedEnd = resolveEnd(end, this.size);
			      if (resolvedEnd !== this.size) {
			        // super.slice(begin, end);
			        return IndexedCollection.prototype.slice.call(this, begin, end);
			      }
			      var newSize = this.size - resolvedBegin;
			      var head = this._head;
			      while (resolvedBegin--) {
			        head = head.next;
			      }
			      if (this.__ownerID) {
			        this.size = newSize;
			        this._head = head;
			        this.__hash = undefined;
			        this.__altered = true;
			        return this;
			      }
			      return makeStack(newSize, head);
			    };

			    // @pragma Mutability

			    Stack.prototype.__ensureOwner = function(ownerID) {
			      if (ownerID === this.__ownerID) {
			        return this;
			      }
			      if (!ownerID) {
			        this.__ownerID = ownerID;
			        this.__altered = false;
			        return this;
			      }
			      return makeStack(this.size, this._head, ownerID, this.__hash);
			    };

			    // @pragma Iteration

			    Stack.prototype.__iterate = function(fn, reverse) {
			      if (reverse) {
			        return this.reverse().__iterate(fn);
			      }
			      var iterations = 0;
			      var node = this._head;
			      while (node) {
			        if (fn(node.value, iterations++, this) === false) {
			          break;
			        }
			        node = node.next;
			      }
			      return iterations;
			    };

			    Stack.prototype.__iterator = function(type, reverse) {
			      if (reverse) {
			        return this.reverse().__iterator(type);
			      }
			      var iterations = 0;
			      var node = this._head;
			      return new Iterator(function()  {
			        if (node) {
			          var value = node.value;
			          node = node.next;
			          return iteratorValue(type, iterations++, value);
			        }
			        return iteratorDone();
			      });
			    };


			  function isStack(maybeStack) {
			    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
			  }

			  Stack.isStack = isStack;

			  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

			  var StackPrototype = Stack.prototype;
			  StackPrototype[IS_STACK_SENTINEL] = true;
			  StackPrototype.withMutations = MapPrototype.withMutations;
			  StackPrototype.asMutable = MapPrototype.asMutable;
			  StackPrototype.asImmutable = MapPrototype.asImmutable;
			  StackPrototype.wasAltered = MapPrototype.wasAltered;


			  function makeStack(size, head, ownerID, hash) {
			    var map = Object.create(StackPrototype);
			    map.size = size;
			    map._head = head;
			    map.__ownerID = ownerID;
			    map.__hash = hash;
			    map.__altered = false;
			    return map;
			  }

			  var EMPTY_STACK;
			  function emptyStack() {
			    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
			  }

			  /**
			   * Contributes additional methods to a constructor
			   */
			  function mixin(ctor, methods) {
			    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
			    Object.keys(methods).forEach(keyCopier);
			    Object.getOwnPropertySymbols &&
			      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
			    return ctor;
			  }

			  Iterable.Iterator = Iterator;

			  mixin(Iterable, {

			    // ### Conversion to other types

			    toArray: function() {
			      assertNotInfinite(this.size);
			      var array = new Array(this.size || 0);
			      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
			      return array;
			    },

			    toIndexedSeq: function() {
			      return new ToIndexedSequence(this);
			    },

			    toJS: function() {
			      return this.toSeq().map(
			        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
			      ).__toJS();
			    },

			    toJSON: function() {
			      return this.toSeq().map(
			        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
			      ).__toJS();
			    },

			    toKeyedSeq: function() {
			      return new ToKeyedSequence(this, true);
			    },

			    toMap: function() {
			      // Use Late Binding here to solve the circular dependency.
			      return Map(this.toKeyedSeq());
			    },

			    toObject: function() {
			      assertNotInfinite(this.size);
			      var object = {};
			      this.__iterate(function(v, k)  { object[k] = v; });
			      return object;
			    },

			    toOrderedMap: function() {
			      // Use Late Binding here to solve the circular dependency.
			      return OrderedMap(this.toKeyedSeq());
			    },

			    toOrderedSet: function() {
			      // Use Late Binding here to solve the circular dependency.
			      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
			    },

			    toSet: function() {
			      // Use Late Binding here to solve the circular dependency.
			      return Set(isKeyed(this) ? this.valueSeq() : this);
			    },

			    toSetSeq: function() {
			      return new ToSetSequence(this);
			    },

			    toSeq: function() {
			      return isIndexed(this) ? this.toIndexedSeq() :
			        isKeyed(this) ? this.toKeyedSeq() :
			        this.toSetSeq();
			    },

			    toStack: function() {
			      // Use Late Binding here to solve the circular dependency.
			      return Stack(isKeyed(this) ? this.valueSeq() : this);
			    },

			    toList: function() {
			      // Use Late Binding here to solve the circular dependency.
			      return List(isKeyed(this) ? this.valueSeq() : this);
			    },


			    // ### Common JavaScript methods and properties

			    toString: function() {
			      return '[Iterable]';
			    },

			    __toString: function(head, tail) {
			      if (this.size === 0) {
			        return head + tail;
			      }
			      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
			    },


			    // ### ES6 Collection methods (ES6 Array and Map)

			    concat: function() {var values = SLICE$0.call(arguments, 0);
			      return reify(this, concatFactory(this, values));
			    },

			    includes: function(searchValue) {
			      return this.some(function(value ) {return is(value, searchValue)});
			    },

			    entries: function() {
			      return this.__iterator(ITERATE_ENTRIES);
			    },

			    every: function(predicate, context) {
			      assertNotInfinite(this.size);
			      var returnValue = true;
			      this.__iterate(function(v, k, c)  {
			        if (!predicate.call(context, v, k, c)) {
			          returnValue = false;
			          return false;
			        }
			      });
			      return returnValue;
			    },

			    filter: function(predicate, context) {
			      return reify(this, filterFactory(this, predicate, context, true));
			    },

			    find: function(predicate, context, notSetValue) {
			      var entry = this.findEntry(predicate, context);
			      return entry ? entry[1] : notSetValue;
			    },

			    findEntry: function(predicate, context) {
			      var found;
			      this.__iterate(function(v, k, c)  {
			        if (predicate.call(context, v, k, c)) {
			          found = [k, v];
			          return false;
			        }
			      });
			      return found;
			    },

			    findLastEntry: function(predicate, context) {
			      return this.toSeq().reverse().findEntry(predicate, context);
			    },

			    forEach: function(sideEffect, context) {
			      assertNotInfinite(this.size);
			      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
			    },

			    join: function(separator) {
			      assertNotInfinite(this.size);
			      separator = separator !== undefined ? '' + separator : ',';
			      var joined = '';
			      var isFirst = true;
			      this.__iterate(function(v ) {
			        isFirst ? (isFirst = false) : (joined += separator);
			        joined += v !== null && v !== undefined ? v.toString() : '';
			      });
			      return joined;
			    },

			    keys: function() {
			      return this.__iterator(ITERATE_KEYS);
			    },

			    map: function(mapper, context) {
			      return reify(this, mapFactory(this, mapper, context));
			    },

			    reduce: function(reducer, initialReduction, context) {
			      assertNotInfinite(this.size);
			      var reduction;
			      var useFirst;
			      if (arguments.length < 2) {
			        useFirst = true;
			      } else {
			        reduction = initialReduction;
			      }
			      this.__iterate(function(v, k, c)  {
			        if (useFirst) {
			          useFirst = false;
			          reduction = v;
			        } else {
			          reduction = reducer.call(context, reduction, v, k, c);
			        }
			      });
			      return reduction;
			    },

			    reduceRight: function(reducer, initialReduction, context) {
			      var reversed = this.toKeyedSeq().reverse();
			      return reversed.reduce.apply(reversed, arguments);
			    },

			    reverse: function() {
			      return reify(this, reverseFactory(this, true));
			    },

			    slice: function(begin, end) {
			      return reify(this, sliceFactory(this, begin, end, true));
			    },

			    some: function(predicate, context) {
			      return !this.every(not(predicate), context);
			    },

			    sort: function(comparator) {
			      return reify(this, sortFactory(this, comparator));
			    },

			    values: function() {
			      return this.__iterator(ITERATE_VALUES);
			    },


			    // ### More sequential methods

			    butLast: function() {
			      return this.slice(0, -1);
			    },

			    isEmpty: function() {
			      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
			    },

			    count: function(predicate, context) {
			      return ensureSize(
			        predicate ? this.toSeq().filter(predicate, context) : this
			      );
			    },

			    countBy: function(grouper, context) {
			      return countByFactory(this, grouper, context);
			    },

			    equals: function(other) {
			      return deepEqual(this, other);
			    },

			    entrySeq: function() {
			      var iterable = this;
			      if (iterable._cache) {
			        // We cache as an entries array, so we can just return the cache!
			        return new ArraySeq(iterable._cache);
			      }
			      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
			      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
			      return entriesSequence;
			    },

			    filterNot: function(predicate, context) {
			      return this.filter(not(predicate), context);
			    },

			    findLast: function(predicate, context, notSetValue) {
			      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
			    },

			    first: function() {
			      return this.find(returnTrue);
			    },

			    flatMap: function(mapper, context) {
			      return reify(this, flatMapFactory(this, mapper, context));
			    },

			    flatten: function(depth) {
			      return reify(this, flattenFactory(this, depth, true));
			    },

			    fromEntrySeq: function() {
			      return new FromEntriesSequence(this);
			    },

			    get: function(searchKey, notSetValue) {
			      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
			    },

			    getIn: function(searchKeyPath, notSetValue) {
			      var nested = this;
			      // Note: in an ES6 environment, we would prefer:
			      // for (var key of searchKeyPath) {
			      var iter = forceIterator(searchKeyPath);
			      var step;
			      while (!(step = iter.next()).done) {
			        var key = step.value;
			        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
			        if (nested === NOT_SET) {
			          return notSetValue;
			        }
			      }
			      return nested;
			    },

			    groupBy: function(grouper, context) {
			      return groupByFactory(this, grouper, context);
			    },

			    has: function(searchKey) {
			      return this.get(searchKey, NOT_SET) !== NOT_SET;
			    },

			    hasIn: function(searchKeyPath) {
			      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
			    },

			    isSubset: function(iter) {
			      iter = typeof iter.includes === 'function' ? iter : Iterable(iter);
			      return this.every(function(value ) {return iter.includes(value)});
			    },

			    isSuperset: function(iter) {
			      iter = typeof iter.isSubset === 'function' ? iter : Iterable(iter);
			      return iter.isSubset(this);
			    },

			    keySeq: function() {
			      return this.toSeq().map(keyMapper).toIndexedSeq();
			    },

			    last: function() {
			      return this.toSeq().reverse().first();
			    },

			    max: function(comparator) {
			      return maxFactory(this, comparator);
			    },

			    maxBy: function(mapper, comparator) {
			      return maxFactory(this, comparator, mapper);
			    },

			    min: function(comparator) {
			      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
			    },

			    minBy: function(mapper, comparator) {
			      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
			    },

			    rest: function() {
			      return this.slice(1);
			    },

			    skip: function(amount) {
			      return this.slice(Math.max(0, amount));
			    },

			    skipLast: function(amount) {
			      return reify(this, this.toSeq().reverse().skip(amount).reverse());
			    },

			    skipWhile: function(predicate, context) {
			      return reify(this, skipWhileFactory(this, predicate, context, true));
			    },

			    skipUntil: function(predicate, context) {
			      return this.skipWhile(not(predicate), context);
			    },

			    sortBy: function(mapper, comparator) {
			      return reify(this, sortFactory(this, comparator, mapper));
			    },

			    take: function(amount) {
			      return this.slice(0, Math.max(0, amount));
			    },

			    takeLast: function(amount) {
			      return reify(this, this.toSeq().reverse().take(amount).reverse());
			    },

			    takeWhile: function(predicate, context) {
			      return reify(this, takeWhileFactory(this, predicate, context));
			    },

			    takeUntil: function(predicate, context) {
			      return this.takeWhile(not(predicate), context);
			    },

			    valueSeq: function() {
			      return this.toIndexedSeq();
			    },


			    // ### Hashable Object

			    hashCode: function() {
			      return this.__hash || (this.__hash = hashIterable(this));
			    }


			    // ### Internal

			    // abstract __iterate(fn, reverse)

			    // abstract __iterator(type, reverse)
			  });

			  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
			  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
			  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
			  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

			  var IterablePrototype = Iterable.prototype;
			  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
			  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
			  IterablePrototype.__toJS = IterablePrototype.toArray;
			  IterablePrototype.__toStringMapper = quoteString;
			  IterablePrototype.inspect =
			  IterablePrototype.toSource = function() { return this.toString(); };
			  IterablePrototype.chain = IterablePrototype.flatMap;
			  IterablePrototype.contains = IterablePrototype.includes;

			  // Temporary warning about using length
			  (function () {
			    try {
			      Object.defineProperty(IterablePrototype, 'length', {
			        get: function () {
			          if (!Iterable.noLengthWarning) {
			            var stack;
			            try {
			              throw new Error();
			            } catch (error) {
			              stack = error.stack;
			            }
			            if (stack.indexOf('_wrapObject') === -1) {
			              console && console.warn && console.warn(
			                'iterable.length has been deprecated, '+
			                'use iterable.size or iterable.count(). '+
			                'This warning will become a silent error in a future version. ' +
			                stack
			              );
			              return this.size;
			            }
			          }
			        }
			      });
			    } catch (e) {}
			  })();



			  mixin(KeyedIterable, {

			    // ### More sequential methods

			    flip: function() {
			      return reify(this, flipFactory(this));
			    },

			    findKey: function(predicate, context) {
			      var entry = this.findEntry(predicate, context);
			      return entry && entry[0];
			    },

			    findLastKey: function(predicate, context) {
			      return this.toSeq().reverse().findKey(predicate, context);
			    },

			    keyOf: function(searchValue) {
			      return this.findKey(function(value ) {return is(value, searchValue)});
			    },

			    lastKeyOf: function(searchValue) {
			      return this.findLastKey(function(value ) {return is(value, searchValue)});
			    },

			    mapEntries: function(mapper, context) {var this$0 = this;
			      var iterations = 0;
			      return reify(this,
			        this.toSeq().map(
			          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
			        ).fromEntrySeq()
			      );
			    },

			    mapKeys: function(mapper, context) {var this$0 = this;
			      return reify(this,
			        this.toSeq().flip().map(
			          function(k, v)  {return mapper.call(context, k, v, this$0)}
			        ).flip()
			      );
			    }

			  });

			  var KeyedIterablePrototype = KeyedIterable.prototype;
			  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
			  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
			  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
			  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return JSON.stringify(k) + ': ' + quoteString(v)};



			  mixin(IndexedIterable, {

			    // ### Conversion to other types

			    toKeyedSeq: function() {
			      return new ToKeyedSequence(this, false);
			    },


			    // ### ES6 Collection methods (ES6 Array and Map)

			    filter: function(predicate, context) {
			      return reify(this, filterFactory(this, predicate, context, false));
			    },

			    findIndex: function(predicate, context) {
			      var entry = this.findEntry(predicate, context);
			      return entry ? entry[0] : -1;
			    },

			    indexOf: function(searchValue) {
			      var key = this.toKeyedSeq().keyOf(searchValue);
			      return key === undefined ? -1 : key;
			    },

			    lastIndexOf: function(searchValue) {
			      var key = this.toKeyedSeq().reverse().keyOf(searchValue);
			      return key === undefined ? -1 : key;

			      // var index =
			      // return this.toSeq().reverse().indexOf(searchValue);
			    },

			    reverse: function() {
			      return reify(this, reverseFactory(this, false));
			    },

			    slice: function(begin, end) {
			      return reify(this, sliceFactory(this, begin, end, false));
			    },

			    splice: function(index, removeNum /*, ...values*/) {
			      var numArgs = arguments.length;
			      removeNum = Math.max(removeNum | 0, 0);
			      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
			        return this;
			      }
			      // If index is negative, it should resolve relative to the size of the
			      // collection. However size may be expensive to compute if not cached, so
			      // only call count() if the number is in fact negative.
			      index = resolveBegin(index, index < 0 ? this.count() : this.size);
			      var spliced = this.slice(0, index);
			      return reify(
			        this,
			        numArgs === 1 ?
			          spliced :
			          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
			      );
			    },


			    // ### More collection methods

			    findLastIndex: function(predicate, context) {
			      var key = this.toKeyedSeq().findLastKey(predicate, context);
			      return key === undefined ? -1 : key;
			    },

			    first: function() {
			      return this.get(0);
			    },

			    flatten: function(depth) {
			      return reify(this, flattenFactory(this, depth, false));
			    },

			    get: function(index, notSetValue) {
			      index = wrapIndex(this, index);
			      return (index < 0 || (this.size === Infinity ||
			          (this.size !== undefined && index > this.size))) ?
			        notSetValue :
			        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
			    },

			    has: function(index) {
			      index = wrapIndex(this, index);
			      return index >= 0 && (this.size !== undefined ?
			        this.size === Infinity || index < this.size :
			        this.indexOf(index) !== -1
			      );
			    },

			    interpose: function(separator) {
			      return reify(this, interposeFactory(this, separator));
			    },

			    interleave: function(/*...iterables*/) {
			      var iterables = [this].concat(arrCopy(arguments));
			      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
			      var interleaved = zipped.flatten(true);
			      if (zipped.size) {
			        interleaved.size = zipped.size * iterables.length;
			      }
			      return reify(this, interleaved);
			    },

			    last: function() {
			      return this.get(-1);
			    },

			    skipWhile: function(predicate, context) {
			      return reify(this, skipWhileFactory(this, predicate, context, false));
			    },

			    zip: function(/*, ...iterables */) {
			      var iterables = [this].concat(arrCopy(arguments));
			      return reify(this, zipWithFactory(this, defaultZipper, iterables));
			    },

			    zipWith: function(zipper/*, ...iterables */) {
			      var iterables = arrCopy(arguments);
			      iterables[0] = this;
			      return reify(this, zipWithFactory(this, zipper, iterables));
			    }

			  });

			  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
			  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;



			  mixin(SetIterable, {

			    // ### ES6 Collection methods (ES6 Array and Map)

			    get: function(value, notSetValue) {
			      return this.has(value) ? value : notSetValue;
			    },

			    includes: function(value) {
			      return this.has(value);
			    },


			    // ### More sequential methods

			    keySeq: function() {
			      return this.valueSeq();
			    }

			  });

			  SetIterable.prototype.has = IterablePrototype.includes;


			  // Mixin subclasses

			  mixin(KeyedSeq, KeyedIterable.prototype);
			  mixin(IndexedSeq, IndexedIterable.prototype);
			  mixin(SetSeq, SetIterable.prototype);

			  mixin(KeyedCollection, KeyedIterable.prototype);
			  mixin(IndexedCollection, IndexedIterable.prototype);
			  mixin(SetCollection, SetIterable.prototype);


			  // #pragma Helper functions

			  function keyMapper(v, k) {
			    return k;
			  }

			  function entryMapper(v, k) {
			    return [k, v];
			  }

			  function not(predicate) {
			    return function() {
			      return !predicate.apply(this, arguments);
			    }
			  }

			  function neg(predicate) {
			    return function() {
			      return -predicate.apply(this, arguments);
			    }
			  }

			  function quoteString(value) {
			    return typeof value === 'string' ? JSON.stringify(value) : value;
			  }

			  function defaultZipper() {
			    return arrCopy(arguments);
			  }

			  function defaultNegComparator(a, b) {
			    return a < b ? 1 : a > b ? -1 : 0;
			  }

			  function hashIterable(iterable) {
			    if (iterable.size === Infinity) {
			      return 0;
			    }
			    var ordered = isOrdered(iterable);
			    var keyed = isKeyed(iterable);
			    var h = ordered ? 1 : 0;
			    var size = iterable.__iterate(
			      keyed ?
			        ordered ?
			          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
			          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
			        ordered ?
			          function(v ) { h = 31 * h + hash(v) | 0; } :
			          function(v ) { h = h + hash(v) | 0; }
			    );
			    return murmurHashOfSize(size, h);
			  }

			  function murmurHashOfSize(size, h) {
			    h = imul(h, 0xCC9E2D51);
			    h = imul(h << 15 | h >>> -15, 0x1B873593);
			    h = imul(h << 13 | h >>> -13, 5);
			    h = (h + 0xE6546B64 | 0) ^ size;
			    h = imul(h ^ h >>> 16, 0x85EBCA6B);
			    h = imul(h ^ h >>> 13, 0xC2B2AE35);
			    h = smi(h ^ h >>> 16);
			    return h;
			  }

			  function hashMerge(a, b) {
			    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
			  }

			  var Immutable = {

			    Iterable: Iterable,

			    Seq: Seq,
			    Collection: Collection,
			    Map: Map,
			    OrderedMap: OrderedMap,
			    List: List,
			    Stack: Stack,
			    Set: Set,
			    OrderedSet: OrderedSet,

			    Record: Record,
			    Range: Range,
			    Repeat: Repeat,

			    is: is,
			    fromJS: fromJS

			  };

			  return Immutable;

			}));
			}(immutable));

			(function (module, exports) {
			!function(e,t){module.exports=t(immutable.exports,require$$1);}(window,function(n,r){return o={},i.m=a=[function(e,t){e.exports=n;},function(e,t){e.exports=r;},function(e,t,n){e.exports=n(3);},function(e,t,n){n.r(t);var v=n(1),u=n(0),s=function(e){var t,n=null;return document.implementation&&document.implementation.createHTMLDocument&&((t=document.implementation.createHTMLDocument("foo")).documentElement.innerHTML=e,n=t.getElementsByTagName("body")[0]),n},x=function(e,t,n){var r,i=e.textContent;return ""===i.trim()?{chunk:(r=n,{text:" ",inlines:[new u.OrderedSet],entities:[r],blocks:[]})}:{chunk:{text:i,inlines:Array(i.length).fill(t),entities:Array(i.length).fill(n),blocks:[]}}},M=function(){return {text:"\n",inlines:[new u.OrderedSet],entities:new Array(1),blocks:[]}},k=function(){return {text:"",inlines:[],entities:[],blocks:[]}},E=function(e,t){return {text:"",inlines:[],entities:[],blocks:[{type:e,depth:0,data:t||new u.Map({})}]}},w=function(e,t,n){return {text:"\r",inlines:[],entities:[],blocks:[{type:e,depth:Math.max(0,Math.min(4,t)),data:n||new u.Map({})}]}},T=function(e){return {text:"\r ",inlines:[new u.OrderedSet],entities:[e],blocks:[{type:"atomic",depth:0,data:new u.Map({})}]}},L=function(e,t){return {text:e.text+t.text,inlines:e.inlines.concat(t.inlines),entities:e.entities.concat(t.entities),blocks:e.blocks.concat(t.blocks)}},A=new u.Map({"header-one":{element:"h1"},"header-two":{element:"h2"},"header-three":{element:"h3"},"header-four":{element:"h4"},"header-five":{element:"h5"},"header-six":{element:"h6"},"unordered-list-item":{element:"li",wrapper:"ul"},"ordered-list-item":{element:"li",wrapper:"ol"},blockquote:{element:"blockquote"},code:{element:"pre"},atomic:{element:"figure"},unstyled:{element:"p",aliasedElements:["div"]}});var O={code:"CODE",del:"STRIKETHROUGH",em:"ITALIC",strong:"BOLD",ins:"UNDERLINE",sub:"SUBSCRIPT",sup:"SUPERSCRIPT"};function S(e){return e.style.textAlign?new u.Map({"text-align":e.style.textAlign}):e.style.marginLeft?new u.Map({"margin-left":e.style.marginLeft}):void 0}var _=function(e){var t=void 0;if(e instanceof HTMLAnchorElement){var n={};t=e.dataset&&void 0!==e.dataset.mention?(n.url=e.href,n.text=e.innerHTML,n.value=e.dataset.value,v.Entity.__create("MENTION","IMMUTABLE",n)):(n.url=e.getAttribute&&e.getAttribute("href")||e.href,n.title=e.innerHTML,n.targetOption=e.target,v.Entity.__create("LINK","MUTABLE",n));}return t};n.d(t,"default",function(){return r});var d=" ",f=new RegExp("&nbsp;","g"),j=!0;function I(e,t,n,r,i,a){var o=e.nodeName.toLowerCase();if(a){var l=a(o,e);if(l){var c=v.Entity.__create(l.type,l.mutability,l.data||{});return {chunk:T(c)}}}if("#text"===o&&"\n"!==e.textContent)return x(e,t,i);if("br"===o)return {chunk:M()};if("img"===o&&e instanceof HTMLImageElement){var u={};u.src=e.getAttribute&&e.getAttribute("src")||e.src,u.alt=e.alt,u.height=e.style.height,u.width=e.style.width,e.style.float&&(u.alignment=e.style.float);var s=v.Entity.__create("IMAGE","MUTABLE",u);return {chunk:T(s)}}if("video"===o&&e instanceof HTMLVideoElement){var d={};d.src=e.getAttribute&&e.getAttribute("src")||e.src,d.alt=e.alt,d.height=e.style.height,d.width=e.style.width,e.style.float&&(d.alignment=e.style.float);var f=v.Entity.__create("VIDEO","MUTABLE",d);return {chunk:T(f)}}if("iframe"===o&&e instanceof HTMLIFrameElement){var m={};m.src=e.getAttribute&&e.getAttribute("src")||e.src,m.height=e.height,m.width=e.width;var p=v.Entity.__create("EMBEDDED_LINK","MUTABLE",m);return {chunk:T(p)}}var h,y=function(t,n){var e=A.filter(function(e){return e.element===t&&(!e.wrapper||e.wrapper===n)||e.wrapper===t||e.aliasedElements&&-1<e.aliasedElements.indexOf(t)}).keySeq().toSet().toArray();if(1===e.length)return e[0]}(o,r);y&&("ul"===o||"ol"===o?(r=o,n+=1):("unordered-list-item"!==y&&"ordered-list-item"!==y&&(r="",n=-1),j?(h=E(y,S(e)),j=!1):h=w(y,n,S(e)))),h=h||k(),t=function(e,t,n){var r,i=O[e];if(i)r=n.add(i).toOrderedSet();else if(t instanceof HTMLElement){var c=t;r=(r=n).withMutations(function(e){var t=c.style.color,n=c.style.backgroundColor,r=c.style.fontSize,i=c.style.fontFamily.replace(/^"|"$/g,""),a=c.style.fontWeight,o=c.style.textDecoration,l=c.style.fontStyle;t&&e.add("color-".concat(t.replace(/ /g,""))),n&&e.add("bgcolor-".concat(n.replace(/ /g,""))),r&&e.add("fontsize-".concat(r.replace(/px$/g,""))),i&&e.add("fontfamily-".concat(i)),"bold"===a&&e.add(O.strong),"underline"===o&&e.add(O.ins),"italic"===l&&e.add(O.em);}).toOrderedSet();}return r}(o,e,t);for(var b=e.firstChild;b;){var g=I(b,t,n,r,_(b)||i,a).chunk;h=L(h,g),b=b.nextSibling;}return {chunk:h}}function r(e,t){var n,r,i,a=(n=t,r=e.trim().replace(f,d),(i=s(r))?(j=!0,{chunk:I(i,new u.OrderedSet,-1,"",void 0,n).chunk}):null);if(a){var o=a.chunk,l=new u.OrderedMap({});o.entities&&o.entities.forEach(function(e){e&&(l=l.set(e,v.Entity.__get(e)));});var c=0;return {contentBlocks:o.text.split("\r").map(function(e,t){var n=c+e.length,r=o&&o.inlines.slice(c,n),i=o&&o.entities.slice(c,n),a=new u.List(r.map(function(e,t){var n={style:e,entity:null};return i[t]&&(n.entity=i[t]),v.CharacterMetadata.create(n)}));return c=n,new v.ContentBlock({key:Object(v.genKey)(),type:o&&o.blocks[t]&&o.blocks[t].type||"unstyled",depth:o&&o.blocks[t]&&o.blocks[t].depth,data:o&&o.blocks[t]&&o.blocks[t].data||new u.Map({}),text:e,characterList:a})}),entityMap:l}}return null}}],i.c=o,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n});},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=2);function i(e){if(o[e])return o[e].exports;var t=o[e]={i:e,l:!1,exports:{}};return a[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}var a,o;});
			}(htmlToDraftjs$1));

			var htmlToDraftjs = exports('default', /*@__PURE__*/getDefaultExportFromCjs(htmlToDraftjs$1.exports));

		})
	};
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9pbW11dGFibGUvZGlzdC9pbW11dGFibGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvaHRtbC10by1kcmFmdGpzL2Rpc3QvaHRtbC10by1kcmFmdGpzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgZ2xvYmFsLkltbXV0YWJsZSA9IGZhY3RvcnkoKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7dmFyIFNMSUNFJDAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgZnVuY3Rpb24gY3JlYXRlQ2xhc3MoY3Rvciwgc3VwZXJDbGFzcykge1xuICAgIGlmIChzdXBlckNsYXNzKSB7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpO1xuICAgIH1cbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3I7XG4gIH1cblxuICBmdW5jdGlvbiBJdGVyYWJsZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGlzSXRlcmFibGUodmFsdWUpID8gdmFsdWUgOiBTZXEodmFsdWUpO1xuICAgIH1cblxuXG4gIGNyZWF0ZUNsYXNzKEtleWVkSXRlcmFibGUsIEl0ZXJhYmxlKTtcbiAgICBmdW5jdGlvbiBLZXllZEl0ZXJhYmxlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gaXNLZXllZCh2YWx1ZSkgPyB2YWx1ZSA6IEtleWVkU2VxKHZhbHVlKTtcbiAgICB9XG5cblxuICBjcmVhdGVDbGFzcyhJbmRleGVkSXRlcmFibGUsIEl0ZXJhYmxlKTtcbiAgICBmdW5jdGlvbiBJbmRleGVkSXRlcmFibGUodmFsdWUpIHtcbiAgICAgIHJldHVybiBpc0luZGV4ZWQodmFsdWUpID8gdmFsdWUgOiBJbmRleGVkU2VxKHZhbHVlKTtcbiAgICB9XG5cblxuICBjcmVhdGVDbGFzcyhTZXRJdGVyYWJsZSwgSXRlcmFibGUpO1xuICAgIGZ1bmN0aW9uIFNldEl0ZXJhYmxlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gaXNJdGVyYWJsZSh2YWx1ZSkgJiYgIWlzQXNzb2NpYXRpdmUodmFsdWUpID8gdmFsdWUgOiBTZXRTZXEodmFsdWUpO1xuICAgIH1cblxuXG5cbiAgZnVuY3Rpb24gaXNJdGVyYWJsZShtYXliZUl0ZXJhYmxlKSB7XG4gICAgcmV0dXJuICEhKG1heWJlSXRlcmFibGUgJiYgbWF5YmVJdGVyYWJsZVtJU19JVEVSQUJMRV9TRU5USU5FTF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNLZXllZChtYXliZUtleWVkKSB7XG4gICAgcmV0dXJuICEhKG1heWJlS2V5ZWQgJiYgbWF5YmVLZXllZFtJU19LRVlFRF9TRU5USU5FTF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNJbmRleGVkKG1heWJlSW5kZXhlZCkge1xuICAgIHJldHVybiAhIShtYXliZUluZGV4ZWQgJiYgbWF5YmVJbmRleGVkW0lTX0lOREVYRURfU0VOVElORUxdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQXNzb2NpYXRpdmUobWF5YmVBc3NvY2lhdGl2ZSkge1xuICAgIHJldHVybiBpc0tleWVkKG1heWJlQXNzb2NpYXRpdmUpIHx8IGlzSW5kZXhlZChtYXliZUFzc29jaWF0aXZlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT3JkZXJlZChtYXliZU9yZGVyZWQpIHtcbiAgICByZXR1cm4gISEobWF5YmVPcmRlcmVkICYmIG1heWJlT3JkZXJlZFtJU19PUkRFUkVEX1NFTlRJTkVMXSk7XG4gIH1cblxuICBJdGVyYWJsZS5pc0l0ZXJhYmxlID0gaXNJdGVyYWJsZTtcbiAgSXRlcmFibGUuaXNLZXllZCA9IGlzS2V5ZWQ7XG4gIEl0ZXJhYmxlLmlzSW5kZXhlZCA9IGlzSW5kZXhlZDtcbiAgSXRlcmFibGUuaXNBc3NvY2lhdGl2ZSA9IGlzQXNzb2NpYXRpdmU7XG4gIEl0ZXJhYmxlLmlzT3JkZXJlZCA9IGlzT3JkZXJlZDtcblxuICBJdGVyYWJsZS5LZXllZCA9IEtleWVkSXRlcmFibGU7XG4gIEl0ZXJhYmxlLkluZGV4ZWQgPSBJbmRleGVkSXRlcmFibGU7XG4gIEl0ZXJhYmxlLlNldCA9IFNldEl0ZXJhYmxlO1xuXG5cbiAgdmFyIElTX0lURVJBQkxFX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfSVRFUkFCTEVfX0BAJztcbiAgdmFyIElTX0tFWUVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfS0VZRURfX0BAJztcbiAgdmFyIElTX0lOREVYRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9JTkRFWEVEX19AQCc7XG4gIHZhciBJU19PUkRFUkVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfT1JERVJFRF9fQEAnO1xuXG4gIC8vIFVzZWQgZm9yIHNldHRpbmcgcHJvdG90eXBlIG1ldGhvZHMgdGhhdCBJRTggY2hva2VzIG9uLlxuICB2YXIgREVMRVRFID0gJ2RlbGV0ZSc7XG5cbiAgLy8gQ29uc3RhbnRzIGRlc2NyaWJpbmcgdGhlIHNpemUgb2YgdHJpZSBub2Rlcy5cbiAgdmFyIFNISUZUID0gNTsgLy8gUmVzdWx0ZWQgaW4gYmVzdCBwZXJmb3JtYW5jZSBhZnRlciBfX19fX18/XG4gIHZhciBTSVpFID0gMSA8PCBTSElGVDtcbiAgdmFyIE1BU0sgPSBTSVpFIC0gMTtcblxuICAvLyBBIGNvbnNpc3RlbnQgc2hhcmVkIHZhbHVlIHJlcHJlc2VudGluZyBcIm5vdCBzZXRcIiB3aGljaCBlcXVhbHMgbm90aGluZyBvdGhlclxuICAvLyB0aGFuIGl0c2VsZiwgYW5kIG5vdGhpbmcgdGhhdCBjb3VsZCBiZSBwcm92aWRlZCBleHRlcm5hbGx5LlxuICB2YXIgTk9UX1NFVCA9IHt9O1xuXG4gIC8vIEJvb2xlYW4gcmVmZXJlbmNlcywgUm91Z2ggZXF1aXZhbGVudCBvZiBgYm9vbCAmYC5cbiAgdmFyIENIQU5HRV9MRU5HVEggPSB7IHZhbHVlOiBmYWxzZSB9O1xuICB2YXIgRElEX0FMVEVSID0geyB2YWx1ZTogZmFsc2UgfTtcblxuICBmdW5jdGlvbiBNYWtlUmVmKHJlZikge1xuICAgIHJlZi52YWx1ZSA9IGZhbHNlO1xuICAgIHJldHVybiByZWY7XG4gIH1cblxuICBmdW5jdGlvbiBTZXRSZWYocmVmKSB7XG4gICAgcmVmICYmIChyZWYudmFsdWUgPSB0cnVlKTtcbiAgfVxuXG4gIC8vIEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIHZhbHVlIHJlcHJlc2VudGluZyBhbiBcIm93bmVyXCIgZm9yIHRyYW5zaWVudCB3cml0ZXNcbiAgLy8gdG8gdHJpZXMuIFRoZSByZXR1cm4gdmFsdWUgd2lsbCBvbmx5IGV2ZXIgZXF1YWwgaXRzZWxmLCBhbmQgd2lsbCBub3QgZXF1YWxcbiAgLy8gdGhlIHJldHVybiBvZiBhbnkgc3Vic2VxdWVudCBjYWxsIG9mIHRoaXMgZnVuY3Rpb24uXG4gIGZ1bmN0aW9uIE93bmVySUQoKSB7fVxuXG4gIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2NvcHktYXJyYXktaW5saW5lXG4gIGZ1bmN0aW9uIGFyckNvcHkoYXJyLCBvZmZzZXQpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcbiAgICB2YXIgbGVuID0gTWF0aC5tYXgoMCwgYXJyLmxlbmd0aCAtIG9mZnNldCk7XG4gICAgdmFyIG5ld0FyciA9IG5ldyBBcnJheShsZW4pO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBsZW47IGlpKyspIHtcbiAgICAgIG5ld0FycltpaV0gPSBhcnJbaWkgKyBvZmZzZXRdO1xuICAgIH1cbiAgICByZXR1cm4gbmV3QXJyO1xuICB9XG5cbiAgZnVuY3Rpb24gZW5zdXJlU2l6ZShpdGVyKSB7XG4gICAgaWYgKGl0ZXIuc2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpdGVyLnNpemUgPSBpdGVyLl9faXRlcmF0ZShyZXR1cm5UcnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZXIuc2l6ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXBJbmRleChpdGVyLCBpbmRleCkge1xuICAgIC8vIFRoaXMgaW1wbGVtZW50cyBcImlzIGFycmF5IGluZGV4XCIgd2hpY2ggdGhlIEVDTUFTdHJpbmcgc3BlYyBkZWZpbmVzIGFzOlxuICAgIC8vXG4gICAgLy8gICAgIEEgU3RyaW5nIHByb3BlcnR5IG5hbWUgUCBpcyBhbiBhcnJheSBpbmRleCBpZiBhbmQgb25seSBpZlxuICAgIC8vICAgICBUb1N0cmluZyhUb1VpbnQzMihQKSkgaXMgZXF1YWwgdG8gUCBhbmQgVG9VaW50MzIoUCkgaXMgbm90IGVxdWFsXG4gICAgLy8gICAgIHRvIDJeMzLiiJIxLlxuICAgIC8vXG4gICAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLWFycmF5LWV4b3RpYy1vYmplY3RzXG4gICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgIHZhciB1aW50MzJJbmRleCA9IGluZGV4ID4+PiAwOyAvLyBOID4+PiAwIGlzIHNob3J0aGFuZCBmb3IgVG9VaW50MzJcbiAgICAgIGlmICgnJyArIHVpbnQzMkluZGV4ICE9PSBpbmRleCB8fCB1aW50MzJJbmRleCA9PT0gNDI5NDk2NzI5NSkge1xuICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgfVxuICAgICAgaW5kZXggPSB1aW50MzJJbmRleDtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4IDwgMCA/IGVuc3VyZVNpemUoaXRlcikgKyBpbmRleCA6IGluZGV4O1xuICB9XG5cbiAgZnVuY3Rpb24gcmV0dXJuVHJ1ZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgc2l6ZSkge1xuICAgIHJldHVybiAoYmVnaW4gPT09IDAgfHwgKHNpemUgIT09IHVuZGVmaW5lZCAmJiBiZWdpbiA8PSAtc2l6ZSkpICYmXG4gICAgICAoZW5kID09PSB1bmRlZmluZWQgfHwgKHNpemUgIT09IHVuZGVmaW5lZCAmJiBlbmQgPj0gc2l6ZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUJlZ2luKGJlZ2luLCBzaXplKSB7XG4gICAgcmV0dXJuIHJlc29sdmVJbmRleChiZWdpbiwgc2l6ZSwgMCk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlRW5kKGVuZCwgc2l6ZSkge1xuICAgIHJldHVybiByZXNvbHZlSW5kZXgoZW5kLCBzaXplLCBzaXplKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVJbmRleChpbmRleCwgc2l6ZSwgZGVmYXVsdEluZGV4KSB7XG4gICAgcmV0dXJuIGluZGV4ID09PSB1bmRlZmluZWQgP1xuICAgICAgZGVmYXVsdEluZGV4IDpcbiAgICAgIGluZGV4IDwgMCA/XG4gICAgICAgIE1hdGgubWF4KDAsIHNpemUgKyBpbmRleCkgOlxuICAgICAgICBzaXplID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgIGluZGV4IDpcbiAgICAgICAgICBNYXRoLm1pbihzaXplLCBpbmRleCk7XG4gIH1cblxuICAvKiBnbG9iYWwgU3ltYm9sICovXG5cbiAgdmFyIElURVJBVEVfS0VZUyA9IDA7XG4gIHZhciBJVEVSQVRFX1ZBTFVFUyA9IDE7XG4gIHZhciBJVEVSQVRFX0VOVFJJRVMgPSAyO1xuXG4gIHZhciBSRUFMX0lURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7XG5cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IFJFQUxfSVRFUkFUT1JfU1lNQk9MIHx8IEZBVVhfSVRFUkFUT1JfU1lNQk9MO1xuXG5cbiAgZnVuY3Rpb24gSXRlcmF0b3IobmV4dCkge1xuICAgICAgdGhpcy5uZXh0ID0gbmV4dDtcbiAgICB9XG5cbiAgICBJdGVyYXRvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnW0l0ZXJhdG9yXSc7XG4gICAgfTtcblxuXG4gIEl0ZXJhdG9yLktFWVMgPSBJVEVSQVRFX0tFWVM7XG4gIEl0ZXJhdG9yLlZBTFVFUyA9IElURVJBVEVfVkFMVUVTO1xuICBJdGVyYXRvci5FTlRSSUVTID0gSVRFUkFURV9FTlRSSUVTO1xuXG4gIEl0ZXJhdG9yLnByb3RvdHlwZS5pbnNwZWN0ID1cbiAgSXRlcmF0b3IucHJvdG90eXBlLnRvU291cmNlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy50b1N0cmluZygpOyB9XG4gIEl0ZXJhdG9yLnByb3RvdHlwZVtJVEVSQVRPUl9TWU1CT0xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG5cbiAgZnVuY3Rpb24gaXRlcmF0b3JWYWx1ZSh0eXBlLCBrLCB2LCBpdGVyYXRvclJlc3VsdCkge1xuICAgIHZhciB2YWx1ZSA9IHR5cGUgPT09IDAgPyBrIDogdHlwZSA9PT0gMSA/IHYgOiBbaywgdl07XG4gICAgaXRlcmF0b3JSZXN1bHQgPyAoaXRlcmF0b3JSZXN1bHQudmFsdWUgPSB2YWx1ZSkgOiAoaXRlcmF0b3JSZXN1bHQgPSB7XG4gICAgICB2YWx1ZTogdmFsdWUsIGRvbmU6IGZhbHNlXG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yUmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gaXRlcmF0b3JEb25lKCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc0l0ZXJhdG9yKG1heWJlSXRlcmFibGUpIHtcbiAgICByZXR1cm4gISFnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNJdGVyYXRvcihtYXliZUl0ZXJhdG9yKSB7XG4gICAgcmV0dXJuIG1heWJlSXRlcmF0b3IgJiYgdHlwZW9mIG1heWJlSXRlcmF0b3IubmV4dCA9PT0gJ2Z1bmN0aW9uJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yKGl0ZXJhYmxlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKGl0ZXJhYmxlKTtcbiAgICByZXR1cm4gaXRlcmF0b3JGbiAmJiBpdGVyYXRvckZuLmNhbGwoaXRlcmFibGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihpdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gaXRlcmFibGUgJiYgKFxuICAgICAgKFJFQUxfSVRFUkFUT1JfU1lNQk9MICYmIGl0ZXJhYmxlW1JFQUxfSVRFUkFUT1JfU1lNQk9MXSkgfHxcbiAgICAgIGl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXVxuICAgICk7XG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvckZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJztcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFNlcSwgSXRlcmFibGUpO1xuICAgIGZ1bmN0aW9uIFNlcSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eVNlcXVlbmNlKCkgOlxuICAgICAgICBpc0l0ZXJhYmxlKHZhbHVlKSA/IHZhbHVlLnRvU2VxKCkgOiBzZXFGcm9tVmFsdWUodmFsdWUpO1xuICAgIH1cblxuICAgIFNlcS5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHJldHVybiBTZXEoYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgU2VxLnByb3RvdHlwZS50b1NlcSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFNlcS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1NlcSB7JywgJ30nKTtcbiAgICB9O1xuXG4gICAgU2VxLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCF0aGlzLl9jYWNoZSAmJiB0aGlzLl9faXRlcmF0ZVVuY2FjaGVkKSB7XG4gICAgICAgIHRoaXMuX2NhY2hlID0gdGhpcy5lbnRyeVNlcSgpLnRvQXJyYXkoKTtcbiAgICAgICAgdGhpcy5zaXplID0gdGhpcy5fY2FjaGUubGVuZ3RoO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIGFic3RyYWN0IF9faXRlcmF0ZVVuY2FjaGVkKGZuLCByZXZlcnNlKVxuXG4gICAgU2VxLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHNlcUl0ZXJhdGUodGhpcywgZm4sIHJldmVyc2UsIHRydWUpO1xuICAgIH07XG5cbiAgICAvLyBhYnN0cmFjdCBfX2l0ZXJhdG9yVW5jYWNoZWQodHlwZSwgcmV2ZXJzZSlcblxuICAgIFNlcS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiBzZXFJdGVyYXRvcih0aGlzLCB0eXBlLCByZXZlcnNlLCB0cnVlKTtcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhLZXllZFNlcSwgU2VxKTtcbiAgICBmdW5jdGlvbiBLZXllZFNlcSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgP1xuICAgICAgICBlbXB0eVNlcXVlbmNlKCkudG9LZXllZFNlcSgpIDpcbiAgICAgICAgaXNJdGVyYWJsZSh2YWx1ZSkgP1xuICAgICAgICAgIChpc0tleWVkKHZhbHVlKSA/IHZhbHVlLnRvU2VxKCkgOiB2YWx1ZS5mcm9tRW50cnlTZXEoKSkgOlxuICAgICAgICAgIGtleWVkU2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBLZXllZFNlcS5wcm90b3R5cGUudG9LZXllZFNlcSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG5cbiAgY3JlYXRlQ2xhc3MoSW5kZXhlZFNlcSwgU2VxKTtcbiAgICBmdW5jdGlvbiBJbmRleGVkU2VxKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U2VxdWVuY2UoKSA6XG4gICAgICAgICFpc0l0ZXJhYmxlKHZhbHVlKSA/IGluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpIDpcbiAgICAgICAgaXNLZXllZCh2YWx1ZSkgPyB2YWx1ZS5lbnRyeVNlcSgpIDogdmFsdWUudG9JbmRleGVkU2VxKCk7XG4gICAgfVxuXG4gICAgSW5kZXhlZFNlcS5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHJldHVybiBJbmRleGVkU2VxKGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIEluZGV4ZWRTZXEucHJvdG90eXBlLnRvSW5kZXhlZFNlcSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIEluZGV4ZWRTZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdTZXEgWycsICddJyk7XG4gICAgfTtcblxuICAgIEluZGV4ZWRTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICByZXR1cm4gc2VxSXRlcmF0ZSh0aGlzLCBmbiwgcmV2ZXJzZSwgZmFsc2UpO1xuICAgIH07XG5cbiAgICBJbmRleGVkU2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHNlcUl0ZXJhdG9yKHRoaXMsIHR5cGUsIHJldmVyc2UsIGZhbHNlKTtcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhTZXRTZXEsIFNlcSk7XG4gICAgZnVuY3Rpb24gU2V0U2VxKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlTZXF1ZW5jZSgpIDpcbiAgICAgICAgIWlzSXRlcmFibGUodmFsdWUpID8gaW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkgOlxuICAgICAgICBpc0tleWVkKHZhbHVlKSA/IHZhbHVlLmVudHJ5U2VxKCkgOiB2YWx1ZVxuICAgICAgKS50b1NldFNlcSgpO1xuICAgIH1cblxuICAgIFNldFNlcS5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHJldHVybiBTZXRTZXEoYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgU2V0U2VxLnByb3RvdHlwZS50b1NldFNlcSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG5cbiAgU2VxLmlzU2VxID0gaXNTZXE7XG4gIFNlcS5LZXllZCA9IEtleWVkU2VxO1xuICBTZXEuU2V0ID0gU2V0U2VxO1xuICBTZXEuSW5kZXhlZCA9IEluZGV4ZWRTZXE7XG5cbiAgdmFyIElTX1NFUV9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX1NFUV9fQEAnO1xuXG4gIFNlcS5wcm90b3R5cGVbSVNfU0VRX1NFTlRJTkVMXSA9IHRydWU7XG5cblxuXG4gIGNyZWF0ZUNsYXNzKEFycmF5U2VxLCBJbmRleGVkU2VxKTtcbiAgICBmdW5jdGlvbiBBcnJheVNlcShhcnJheSkge1xuICAgICAgdGhpcy5fYXJyYXkgPSBhcnJheTtcbiAgICAgIHRoaXMuc2l6ZSA9IGFycmF5Lmxlbmd0aDtcbiAgICB9XG5cbiAgICBBcnJheVNlcS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXMoaW5kZXgpID8gdGhpcy5fYXJyYXlbd3JhcEluZGV4KHRoaXMsIGluZGV4KV0gOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgQXJyYXlTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICB2YXIgYXJyYXkgPSB0aGlzLl9hcnJheTtcbiAgICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICAgIGlmIChmbihhcnJheVtyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXSwgaWksIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBpaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpaTtcbiAgICB9O1xuXG4gICAgQXJyYXlTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgYXJyYXkgPSB0aGlzLl9hcnJheTtcbiAgICAgIHZhciBtYXhJbmRleCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpIFxuICAgICAgICB7cmV0dXJuIGlpID4gbWF4SW5kZXggP1xuICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGlpLCBhcnJheVtyZXZlcnNlID8gbWF4SW5kZXggLSBpaSsrIDogaWkrK10pfVxuICAgICAgKTtcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhPYmplY3RTZXEsIEtleWVkU2VxKTtcbiAgICBmdW5jdGlvbiBPYmplY3RTZXEob2JqZWN0KSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG4gICAgICB0aGlzLl9vYmplY3QgPSBvYmplY3Q7XG4gICAgICB0aGlzLl9rZXlzID0ga2V5cztcbiAgICAgIHRoaXMuc2l6ZSA9IGtleXMubGVuZ3RoO1xuICAgIH1cblxuICAgIE9iamVjdFNlcS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5LCBub3RTZXRWYWx1ZSkge1xuICAgICAgaWYgKG5vdFNldFZhbHVlICE9PSB1bmRlZmluZWQgJiYgIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX29iamVjdFtrZXldO1xuICAgIH07XG5cbiAgICBPYmplY3RTZXEucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuX29iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuICAgIH07XG5cbiAgICBPYmplY3RTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gdGhpcy5fb2JqZWN0O1xuICAgICAgdmFyIGtleXMgPSB0aGlzLl9rZXlzO1xuICAgICAgdmFyIG1heEluZGV4ID0ga2V5cy5sZW5ndGggLSAxO1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcbiAgICAgICAgaWYgKGZuKG9iamVjdFtrZXldLCBrZXksIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBpaSArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpaTtcbiAgICB9O1xuXG4gICAgT2JqZWN0U2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIG9iamVjdCA9IHRoaXMuX29iamVjdDtcbiAgICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcbiAgICAgIHZhciBtYXhJbmRleCA9IGtleXMubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBpaSA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV07XG4gICAgICAgIHJldHVybiBpaSsrID4gbWF4SW5kZXggP1xuICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGtleSwgb2JqZWN0W2tleV0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICBPYmplY3RTZXEucHJvdG90eXBlW0lTX09SREVSRURfU0VOVElORUxdID0gdHJ1ZTtcblxuXG4gIGNyZWF0ZUNsYXNzKEl0ZXJhYmxlU2VxLCBJbmRleGVkU2VxKTtcbiAgICBmdW5jdGlvbiBJdGVyYWJsZVNlcShpdGVyYWJsZSkge1xuICAgICAgdGhpcy5faXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgIHRoaXMuc2l6ZSA9IGl0ZXJhYmxlLmxlbmd0aCB8fCBpdGVyYWJsZS5zaXplO1xuICAgIH1cblxuICAgIEl0ZXJhYmxlU2VxLnByb3RvdHlwZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmFibGUgPSB0aGlzLl9pdGVyYWJsZTtcbiAgICAgIHZhciBpdGVyYXRvciA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIGlmIChpc0l0ZXJhdG9yKGl0ZXJhdG9yKSkge1xuICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIGlmIChmbihzdGVwLnZhbHVlLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuXG4gICAgSXRlcmFibGVTZXEucHJvdG90eXBlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYWJsZSA9IHRoaXMuX2l0ZXJhYmxlO1xuICAgICAgdmFyIGl0ZXJhdG9yID0gZ2V0SXRlcmF0b3IoaXRlcmFibGUpO1xuICAgICAgaWYgKCFpc0l0ZXJhdG9yKGl0ZXJhdG9yKSkge1xuICAgICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGl0ZXJhdG9yRG9uZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBzdGVwLmRvbmUgPyBzdGVwIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHN0ZXAudmFsdWUpO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG5cbiAgY3JlYXRlQ2xhc3MoSXRlcmF0b3JTZXEsIEluZGV4ZWRTZXEpO1xuICAgIGZ1bmN0aW9uIEl0ZXJhdG9yU2VxKGl0ZXJhdG9yKSB7XG4gICAgICB0aGlzLl9pdGVyYXRvciA9IGl0ZXJhdG9yO1xuICAgICAgdGhpcy5faXRlcmF0b3JDYWNoZSA9IFtdO1xuICAgIH1cblxuICAgIEl0ZXJhdG9yU2VxLnByb3RvdHlwZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyYXRvcjtcbiAgICAgIHZhciBjYWNoZSA9IHRoaXMuX2l0ZXJhdG9yQ2FjaGU7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB3aGlsZSAoaXRlcmF0aW9ucyA8IGNhY2hlLmxlbmd0aCkge1xuICAgICAgICBpZiAoZm4oY2FjaGVbaXRlcmF0aW9uc10sIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBzdGVwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICB2YXIgdmFsID0gc3RlcC52YWx1ZTtcbiAgICAgICAgY2FjaGVbaXRlcmF0aW9uc10gPSB2YWw7XG4gICAgICAgIGlmIChmbih2YWwsIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG5cbiAgICBJdGVyYXRvclNlcS5wcm90b3R5cGUuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlcmF0b3I7XG4gICAgICB2YXIgY2FjaGUgPSB0aGlzLl9pdGVyYXRvckNhY2hlO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIGlmIChpdGVyYXRpb25zID49IGNhY2hlLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYWNoZVtpdGVyYXRpb25zXSA9IHN0ZXAudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucywgY2FjaGVbaXRlcmF0aW9ucysrXSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuXG4gIC8vICMgcHJhZ21hIEhlbHBlciBmdW5jdGlvbnNcblxuICBmdW5jdGlvbiBpc1NlcShtYXliZVNlcSkge1xuICAgIHJldHVybiAhIShtYXliZVNlcSAmJiBtYXliZVNlcVtJU19TRVFfU0VOVElORUxdKTtcbiAgfVxuXG4gIHZhciBFTVBUWV9TRVE7XG5cbiAgZnVuY3Rpb24gZW1wdHlTZXF1ZW5jZSgpIHtcbiAgICByZXR1cm4gRU1QVFlfU0VRIHx8IChFTVBUWV9TRVEgPSBuZXcgQXJyYXlTZXEoW10pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGtleWVkU2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gICAgdmFyIHNlcSA9XG4gICAgICBBcnJheS5pc0FycmF5KHZhbHVlKSA/IG5ldyBBcnJheVNlcSh2YWx1ZSkuZnJvbUVudHJ5U2VxKCkgOlxuICAgICAgaXNJdGVyYXRvcih2YWx1ZSkgPyBuZXcgSXRlcmF0b3JTZXEodmFsdWUpLmZyb21FbnRyeVNlcSgpIDpcbiAgICAgIGhhc0l0ZXJhdG9yKHZhbHVlKSA/IG5ldyBJdGVyYWJsZVNlcSh2YWx1ZSkuZnJvbUVudHJ5U2VxKCkgOlxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IG5ldyBPYmplY3RTZXEodmFsdWUpIDpcbiAgICAgIHVuZGVmaW5lZDtcbiAgICBpZiAoIXNlcSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0V4cGVjdGVkIEFycmF5IG9yIGl0ZXJhYmxlIG9iamVjdCBvZiBbaywgdl0gZW50cmllcywgJytcbiAgICAgICAgJ29yIGtleWVkIG9iamVjdDogJyArIHZhbHVlXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2VxO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICAgIHZhciBzZXEgPSBtYXliZUluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuICAgIGlmICghc2VxKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnRXhwZWN0ZWQgQXJyYXkgb3IgaXRlcmFibGUgb2JqZWN0IG9mIHZhbHVlczogJyArIHZhbHVlXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2VxO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gICAgdmFyIHNlcSA9IG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkgfHxcbiAgICAgICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIG5ldyBPYmplY3RTZXEodmFsdWUpKTtcbiAgICBpZiAoIXNlcSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0V4cGVjdGVkIEFycmF5IG9yIGl0ZXJhYmxlIG9iamVjdCBvZiB2YWx1ZXMsIG9yIGtleWVkIG9iamVjdDogJyArIHZhbHVlXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2VxO1xuICB9XG5cbiAgZnVuY3Rpb24gbWF5YmVJbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzQXJyYXlMaWtlKHZhbHVlKSA/IG5ldyBBcnJheVNlcSh2YWx1ZSkgOlxuICAgICAgaXNJdGVyYXRvcih2YWx1ZSkgPyBuZXcgSXRlcmF0b3JTZXEodmFsdWUpIDpcbiAgICAgIGhhc0l0ZXJhdG9yKHZhbHVlKSA/IG5ldyBJdGVyYWJsZVNlcSh2YWx1ZSkgOlxuICAgICAgdW5kZWZpbmVkXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcUl0ZXJhdGUoc2VxLCBmbiwgcmV2ZXJzZSwgdXNlS2V5cykge1xuICAgIHZhciBjYWNoZSA9IHNlcS5fY2FjaGU7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICB2YXIgbWF4SW5kZXggPSBjYWNoZS5sZW5ndGggLSAxO1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgICB2YXIgZW50cnkgPSBjYWNoZVtyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcbiAgICAgICAgaWYgKGZuKGVudHJ5WzFdLCB1c2VLZXlzID8gZW50cnlbMF0gOiBpaSwgc2VxKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gaWkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaWk7XG4gICAgfVxuICAgIHJldHVybiBzZXEuX19pdGVyYXRlVW5jYWNoZWQoZm4sIHJldmVyc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VxSXRlcmF0b3Ioc2VxLCB0eXBlLCByZXZlcnNlLCB1c2VLZXlzKSB7XG4gICAgdmFyIGNhY2hlID0gc2VxLl9jYWNoZTtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgIHZhciBtYXhJbmRleCA9IGNhY2hlLmxlbmd0aCAtIDE7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBlbnRyeSA9IGNhY2hlW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldO1xuICAgICAgICByZXR1cm4gaWkrKyA+IG1heEluZGV4ID9cbiAgICAgICAgICBpdGVyYXRvckRvbmUoKSA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCB1c2VLZXlzID8gZW50cnlbMF0gOiBpaSAtIDEsIGVudHJ5WzFdKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gc2VxLl9faXRlcmF0b3JVbmNhY2hlZCh0eXBlLCByZXZlcnNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZyb21KUyhqc29uLCBjb252ZXJ0ZXIpIHtcbiAgICByZXR1cm4gY29udmVydGVyID9cbiAgICAgIGZyb21KU1dpdGgoY29udmVydGVyLCBqc29uLCAnJywgeycnOiBqc29ufSkgOlxuICAgICAgZnJvbUpTRGVmYXVsdChqc29uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZyb21KU1dpdGgoY29udmVydGVyLCBqc29uLCBrZXksIHBhcmVudEpTT04pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShqc29uKSkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRlci5jYWxsKHBhcmVudEpTT04sIGtleSwgSW5kZXhlZFNlcShqc29uKS5tYXAoZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gZnJvbUpTV2l0aChjb252ZXJ0ZXIsIHYsIGssIGpzb24pfSkpO1xuICAgIH1cbiAgICBpZiAoaXNQbGFpbk9iaihqc29uKSkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRlci5jYWxsKHBhcmVudEpTT04sIGtleSwgS2V5ZWRTZXEoanNvbikubWFwKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZyb21KU1dpdGgoY29udmVydGVyLCB2LCBrLCBqc29uKX0pKTtcbiAgICB9XG4gICAgcmV0dXJuIGpzb247XG4gIH1cblxuICBmdW5jdGlvbiBmcm9tSlNEZWZhdWx0KGpzb24pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShqc29uKSkge1xuICAgICAgcmV0dXJuIEluZGV4ZWRTZXEoanNvbikubWFwKGZyb21KU0RlZmF1bHQpLnRvTGlzdCgpO1xuICAgIH1cbiAgICBpZiAoaXNQbGFpbk9iaihqc29uKSkge1xuICAgICAgcmV0dXJuIEtleWVkU2VxKGpzb24pLm1hcChmcm9tSlNEZWZhdWx0KS50b01hcCgpO1xuICAgIH1cbiAgICByZXR1cm4ganNvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUGxhaW5PYmoodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgdmFsdWUuY29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogQW4gZXh0ZW5zaW9uIG9mIHRoZSBcInNhbWUtdmFsdWVcIiBhbGdvcml0aG0gYXMgW2Rlc2NyaWJlZCBmb3IgdXNlIGJ5IEVTNiBNYXBcbiAgICogYW5kIFNldF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWFwI0tleV9lcXVhbGl0eSlcbiAgICpcbiAgICogTmFOIGlzIGNvbnNpZGVyZWQgdGhlIHNhbWUgYXMgTmFOLCBob3dldmVyIC0wIGFuZCAwIGFyZSBjb25zaWRlcmVkIHRoZSBzYW1lXG4gICAqIHZhbHVlLCB3aGljaCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgYWxnb3JpdGhtIGRlc2NyaWJlZCBieVxuICAgKiBbYE9iamVjdC5pc2BdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pcykuXG4gICAqXG4gICAqIFRoaXMgaXMgZXh0ZW5kZWQgZnVydGhlciB0byBhbGxvdyBPYmplY3RzIHRvIGRlc2NyaWJlIHRoZSB2YWx1ZXMgdGhleVxuICAgKiByZXByZXNlbnQsIGJ5IHdheSBvZiBgdmFsdWVPZmAgb3IgYGVxdWFsc2AgKGFuZCBgaGFzaENvZGVgKS5cbiAgICpcbiAgICogTm90ZTogYmVjYXVzZSBvZiB0aGlzIGV4dGVuc2lvbiwgdGhlIGtleSBlcXVhbGl0eSBvZiBJbW11dGFibGUuTWFwIGFuZCB0aGVcbiAgICogdmFsdWUgZXF1YWxpdHkgb2YgSW1tdXRhYmxlLlNldCB3aWxsIGRpZmZlciBmcm9tIEVTNiBNYXAgYW5kIFNldC5cbiAgICpcbiAgICogIyMjIERlZmluaW5nIGN1c3RvbSB2YWx1ZXNcbiAgICpcbiAgICogVGhlIGVhc2llc3Qgd2F5IHRvIGRlc2NyaWJlIHRoZSB2YWx1ZSBhbiBvYmplY3QgcmVwcmVzZW50cyBpcyBieSBpbXBsZW1lbnRpbmdcbiAgICogYHZhbHVlT2ZgLiBGb3IgZXhhbXBsZSwgYERhdGVgIHJlcHJlc2VudHMgYSB2YWx1ZSBieSByZXR1cm5pbmcgYSB1bml4XG4gICAqIHRpbWVzdGFtcCBmb3IgYHZhbHVlT2ZgOlxuICAgKlxuICAgKiAgICAgdmFyIGRhdGUxID0gbmV3IERhdGUoMTIzNDU2Nzg5MDAwMCk7IC8vIEZyaSBGZWIgMTMgMjAwOSAuLi5cbiAgICogICAgIHZhciBkYXRlMiA9IG5ldyBEYXRlKDEyMzQ1Njc4OTAwMDApO1xuICAgKiAgICAgZGF0ZTEudmFsdWVPZigpOyAvLyAxMjM0NTY3ODkwMDAwXG4gICAqICAgICBhc3NlcnQoIGRhdGUxICE9PSBkYXRlMiApO1xuICAgKiAgICAgYXNzZXJ0KCBJbW11dGFibGUuaXMoIGRhdGUxLCBkYXRlMiApICk7XG4gICAqXG4gICAqIE5vdGU6IG92ZXJyaWRpbmcgYHZhbHVlT2ZgIG1heSBoYXZlIG90aGVyIGltcGxpY2F0aW9ucyBpZiB5b3UgdXNlIHRoaXMgb2JqZWN0XG4gICAqIHdoZXJlIEphdmFTY3JpcHQgZXhwZWN0cyBhIHByaW1pdGl2ZSwgc3VjaCBhcyBpbXBsaWNpdCBzdHJpbmcgY29lcmNpb24uXG4gICAqXG4gICAqIEZvciBtb3JlIGNvbXBsZXggdHlwZXMsIGVzcGVjaWFsbHkgY29sbGVjdGlvbnMsIGltcGxlbWVudGluZyBgdmFsdWVPZmAgbWF5XG4gICAqIG5vdCBiZSBwZXJmb3JtYW50LiBBbiBhbHRlcm5hdGl2ZSBpcyB0byBpbXBsZW1lbnQgYGVxdWFsc2AgYW5kIGBoYXNoQ29kZWAuXG4gICAqXG4gICAqIGBlcXVhbHNgIHRha2VzIGFub3RoZXIgb2JqZWN0LCBwcmVzdW1hYmx5IG9mIHNpbWlsYXIgdHlwZSwgYW5kIHJldHVybnMgdHJ1ZVxuICAgKiBpZiB0aGUgaXQgaXMgZXF1YWwuIEVxdWFsaXR5IGlzIHN5bW1ldHJpY2FsLCBzbyB0aGUgc2FtZSByZXN1bHQgc2hvdWxkIGJlXG4gICAqIHJldHVybmVkIGlmIHRoaXMgYW5kIHRoZSBhcmd1bWVudCBhcmUgZmxpcHBlZC5cbiAgICpcbiAgICogICAgIGFzc2VydCggYS5lcXVhbHMoYikgPT09IGIuZXF1YWxzKGEpICk7XG4gICAqXG4gICAqIGBoYXNoQ29kZWAgcmV0dXJucyBhIDMyYml0IGludGVnZXIgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IHdoaWNoIHdpbGxcbiAgICogYmUgdXNlZCB0byBkZXRlcm1pbmUgaG93IHRvIHN0b3JlIHRoZSB2YWx1ZSBvYmplY3QgaW4gYSBNYXAgb3IgU2V0LiBZb3UgbXVzdFxuICAgKiBwcm92aWRlIGJvdGggb3IgbmVpdGhlciBtZXRob2RzLCBvbmUgbXVzdCBub3QgZXhpc3Qgd2l0aG91dCB0aGUgb3RoZXIuXG4gICAqXG4gICAqIEFsc28sIGFuIGltcG9ydGFudCByZWxhdGlvbnNoaXAgYmV0d2VlbiB0aGVzZSBtZXRob2RzIG11c3QgYmUgdXBoZWxkOiBpZiB0d29cbiAgICogdmFsdWVzIGFyZSBlcXVhbCwgdGhleSAqbXVzdCogcmV0dXJuIHRoZSBzYW1lIGhhc2hDb2RlLiBJZiB0aGUgdmFsdWVzIGFyZSBub3RcbiAgICogZXF1YWwsIHRoZXkgbWlnaHQgaGF2ZSB0aGUgc2FtZSBoYXNoQ29kZTsgdGhpcyBpcyBjYWxsZWQgYSBoYXNoIGNvbGxpc2lvbixcbiAgICogYW5kIHdoaWxlIHVuZGVzaXJhYmxlIGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCBpdCBpcyBhY2NlcHRhYmxlLlxuICAgKlxuICAgKiAgICAgaWYgKGEuZXF1YWxzKGIpKSB7XG4gICAqICAgICAgIGFzc2VydCggYS5oYXNoQ29kZSgpID09PSBiLmhhc2hDb2RlKCkgKTtcbiAgICogICAgIH1cbiAgICpcbiAgICogQWxsIEltbXV0YWJsZSBjb2xsZWN0aW9ucyBpbXBsZW1lbnQgYGVxdWFsc2AgYW5kIGBoYXNoQ29kZWAuXG4gICAqXG4gICAqL1xuICBmdW5jdGlvbiBpcyh2YWx1ZUEsIHZhbHVlQikge1xuICAgIGlmICh2YWx1ZUEgPT09IHZhbHVlQiB8fCAodmFsdWVBICE9PSB2YWx1ZUEgJiYgdmFsdWVCICE9PSB2YWx1ZUIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCF2YWx1ZUEgfHwgIXZhbHVlQikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlQS52YWx1ZU9mID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgIHR5cGVvZiB2YWx1ZUIudmFsdWVPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFsdWVBID0gdmFsdWVBLnZhbHVlT2YoKTtcbiAgICAgIHZhbHVlQiA9IHZhbHVlQi52YWx1ZU9mKCk7XG4gICAgICBpZiAodmFsdWVBID09PSB2YWx1ZUIgfHwgKHZhbHVlQSAhPT0gdmFsdWVBICYmIHZhbHVlQiAhPT0gdmFsdWVCKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICghdmFsdWVBIHx8ICF2YWx1ZUIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlQS5lcXVhbHMgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgdHlwZW9mIHZhbHVlQi5lcXVhbHMgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgdmFsdWVBLmVxdWFscyh2YWx1ZUIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVlcEVxdWFsKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgIWlzSXRlcmFibGUoYikgfHxcbiAgICAgIGEuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGIuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGEuc2l6ZSAhPT0gYi5zaXplIHx8XG4gICAgICBhLl9faGFzaCAhPT0gdW5kZWZpbmVkICYmIGIuX19oYXNoICE9PSB1bmRlZmluZWQgJiYgYS5fX2hhc2ggIT09IGIuX19oYXNoIHx8XG4gICAgICBpc0tleWVkKGEpICE9PSBpc0tleWVkKGIpIHx8XG4gICAgICBpc0luZGV4ZWQoYSkgIT09IGlzSW5kZXhlZChiKSB8fFxuICAgICAgaXNPcmRlcmVkKGEpICE9PSBpc09yZGVyZWQoYilcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoYS5zaXplID09PSAwICYmIGIuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIG5vdEFzc29jaWF0aXZlID0gIWlzQXNzb2NpYXRpdmUoYSk7XG5cbiAgICBpZiAoaXNPcmRlcmVkKGEpKSB7XG4gICAgICB2YXIgZW50cmllcyA9IGEuZW50cmllcygpO1xuICAgICAgcmV0dXJuIGIuZXZlcnkoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gZW50cmllcy5uZXh0KCkudmFsdWU7XG4gICAgICAgIHJldHVybiBlbnRyeSAmJiBpcyhlbnRyeVsxXSwgdikgJiYgKG5vdEFzc29jaWF0aXZlIHx8IGlzKGVudHJ5WzBdLCBrKSk7XG4gICAgICB9KSAmJiBlbnRyaWVzLm5leHQoKS5kb25lO1xuICAgIH1cblxuICAgIHZhciBmbGlwcGVkID0gZmFsc2U7XG5cbiAgICBpZiAoYS5zaXplID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChiLnNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodHlwZW9mIGEuY2FjaGVSZXN1bHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBhLmNhY2hlUmVzdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZsaXBwZWQgPSB0cnVlO1xuICAgICAgICB2YXIgXyA9IGE7XG4gICAgICAgIGEgPSBiO1xuICAgICAgICBiID0gXztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYWxsRXF1YWwgPSB0cnVlO1xuICAgIHZhciBiU2l6ZSA9IGIuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7XG4gICAgICBpZiAobm90QXNzb2NpYXRpdmUgPyAhYS5oYXModikgOlxuICAgICAgICAgIGZsaXBwZWQgPyAhaXModiwgYS5nZXQoaywgTk9UX1NFVCkpIDogIWlzKGEuZ2V0KGssIE5PVF9TRVQpLCB2KSkge1xuICAgICAgICBhbGxFcXVhbCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYWxsRXF1YWwgJiYgYS5zaXplID09PSBiU2l6ZTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFJlcGVhdCwgSW5kZXhlZFNlcSk7XG5cbiAgICBmdW5jdGlvbiBSZXBlYXQodmFsdWUsIHRpbWVzKSB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVwZWF0KSkge1xuICAgICAgICByZXR1cm4gbmV3IFJlcGVhdCh2YWx1ZSwgdGltZXMpO1xuICAgICAgfVxuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc2l6ZSA9IHRpbWVzID09PSB1bmRlZmluZWQgPyBJbmZpbml0eSA6IE1hdGgubWF4KDAsIHRpbWVzKTtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgaWYgKEVNUFRZX1JFUEVBVCkge1xuICAgICAgICAgIHJldHVybiBFTVBUWV9SRVBFQVQ7XG4gICAgICAgIH1cbiAgICAgICAgRU1QVFlfUkVQRUFUID0gdGhpcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnUmVwZWF0IFtdJztcbiAgICAgIH1cbiAgICAgIHJldHVybiAnUmVwZWF0IFsgJyArIHRoaXMuX3ZhbHVlICsgJyAnICsgdGhpcy5zaXplICsgJyB0aW1lcyBdJztcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhcyhpbmRleCkgPyB0aGlzLl92YWx1ZSA6IG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHJldHVybiBpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgICByZXR1cm4gd2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSA/IHRoaXMgOlxuICAgICAgICBuZXcgUmVwZWF0KHRoaXMuX3ZhbHVlLCByZXNvbHZlRW5kKGVuZCwgc2l6ZSkgLSByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpKTtcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIGlmIChpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIGlmIChpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpemU7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB0aGlzLnNpemU7IGlpKyspIHtcbiAgICAgICAgaWYgKGZuKHRoaXMuX3ZhbHVlLCBpaSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGlpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlpO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpIFxuICAgICAgICB7cmV0dXJuIGlpIDwgdGhpcyQwLnNpemUgPyBpdGVyYXRvclZhbHVlKHR5cGUsIGlpKyssIHRoaXMkMC5fdmFsdWUpIDogaXRlcmF0b3JEb25lKCl9XG4gICAgICApO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBSZXBlYXQgP1xuICAgICAgICBpcyh0aGlzLl92YWx1ZSwgb3RoZXIuX3ZhbHVlKSA6XG4gICAgICAgIGRlZXBFcXVhbChvdGhlcik7XG4gICAgfTtcblxuXG4gIHZhciBFTVBUWV9SRVBFQVQ7XG5cbiAgZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZXJyb3IpIHtcbiAgICBpZiAoIWNvbmRpdGlvbikgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFJhbmdlLCBJbmRleGVkU2VxKTtcblxuICAgIGZ1bmN0aW9uIFJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSYW5nZSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSYW5nZShzdGFydCwgZW5kLCBzdGVwKTtcbiAgICAgIH1cbiAgICAgIGludmFyaWFudChzdGVwICE9PSAwLCAnQ2Fubm90IHN0ZXAgYSBSYW5nZSBieSAwJyk7XG4gICAgICBzdGFydCA9IHN0YXJ0IHx8IDA7XG4gICAgICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZW5kID0gSW5maW5pdHk7XG4gICAgICB9XG4gICAgICBzdGVwID0gc3RlcCA9PT0gdW5kZWZpbmVkID8gMSA6IE1hdGguYWJzKHN0ZXApO1xuICAgICAgaWYgKGVuZCA8IHN0YXJ0KSB7XG4gICAgICAgIHN0ZXAgPSAtc3RlcDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3N0YXJ0ID0gc3RhcnQ7XG4gICAgICB0aGlzLl9lbmQgPSBlbmQ7XG4gICAgICB0aGlzLl9zdGVwID0gc3RlcDtcbiAgICAgIHRoaXMuc2l6ZSA9IE1hdGgubWF4KDAsIE1hdGguY2VpbCgoZW5kIC0gc3RhcnQpIC8gc3RlcCAtIDEpICsgMSk7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIGlmIChFTVBUWV9SQU5HRSkge1xuICAgICAgICAgIHJldHVybiBFTVBUWV9SQU5HRTtcbiAgICAgICAgfVxuICAgICAgICBFTVBUWV9SQU5HRSA9IHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnUmFuZ2UgW10nO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdSYW5nZSBbICcgK1xuICAgICAgICB0aGlzLl9zdGFydCArICcuLi4nICsgdGhpcy5fZW5kICtcbiAgICAgICAgKHRoaXMuX3N0ZXAgPiAxID8gJyBieSAnICsgdGhpcy5fc3RlcCA6ICcnKSArXG4gICAgICAnIF0nO1xuICAgIH07XG5cbiAgICBSYW5nZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXMoaW5kZXgpID9cbiAgICAgICAgdGhpcy5fc3RhcnQgKyB3cmFwSW5kZXgodGhpcywgaW5kZXgpICogdGhpcy5fc3RlcCA6XG4gICAgICAgIG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBSYW5nZS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgdmFyIHBvc3NpYmxlSW5kZXggPSAoc2VhcmNoVmFsdWUgLSB0aGlzLl9zdGFydCkgLyB0aGlzLl9zdGVwO1xuICAgICAgcmV0dXJuIHBvc3NpYmxlSW5kZXggPj0gMCAmJlxuICAgICAgICBwb3NzaWJsZUluZGV4IDwgdGhpcy5zaXplICYmXG4gICAgICAgIHBvc3NpYmxlSW5kZXggPT09IE1hdGguZmxvb3IocG9zc2libGVJbmRleCk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHRoaXMuc2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBiZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgdGhpcy5zaXplKTtcbiAgICAgIGVuZCA9IHJlc29sdmVFbmQoZW5kLCB0aGlzLnNpemUpO1xuICAgICAgaWYgKGVuZCA8PSBiZWdpbikge1xuICAgICAgICByZXR1cm4gbmV3IFJhbmdlKDAsIDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBSYW5nZSh0aGlzLmdldChiZWdpbiwgdGhpcy5fZW5kKSwgdGhpcy5nZXQoZW5kLCB0aGlzLl9lbmQpLCB0aGlzLl9zdGVwKTtcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgdmFyIG9mZnNldFZhbHVlID0gc2VhcmNoVmFsdWUgLSB0aGlzLl9zdGFydDtcbiAgICAgIGlmIChvZmZzZXRWYWx1ZSAlIHRoaXMuX3N0ZXAgPT09IDApIHtcbiAgICAgICAgdmFyIGluZGV4ID0gb2Zmc2V0VmFsdWUgLyB0aGlzLl9zdGVwO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuc2l6ZSkge1xuICAgICAgICAgIHJldHVybiBpbmRleFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleE9mKHNlYXJjaFZhbHVlKTtcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICB2YXIgbWF4SW5kZXggPSB0aGlzLnNpemUgLSAxO1xuICAgICAgdmFyIHN0ZXAgPSB0aGlzLl9zdGVwO1xuICAgICAgdmFyIHZhbHVlID0gcmV2ZXJzZSA/IHRoaXMuX3N0YXJ0ICsgbWF4SW5kZXggKiBzdGVwIDogdGhpcy5fc3RhcnQ7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICAgIGlmIChmbih2YWx1ZSwgaWksIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBpaSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUgKz0gcmV2ZXJzZSA/IC1zdGVwIDogc3RlcDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpaTtcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgbWF4SW5kZXggPSB0aGlzLnNpemUgLSAxO1xuICAgICAgdmFyIHN0ZXAgPSB0aGlzLl9zdGVwO1xuICAgICAgdmFyIHZhbHVlID0gcmV2ZXJzZSA/IHRoaXMuX3N0YXJ0ICsgbWF4SW5kZXggKiBzdGVwIDogdGhpcy5fc3RhcnQ7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciB2ID0gdmFsdWU7XG4gICAgICAgIHZhbHVlICs9IHJldmVyc2UgPyAtc3RlcCA6IHN0ZXA7XG4gICAgICAgIHJldHVybiBpaSA+IG1heEluZGV4ID8gaXRlcmF0b3JEb25lKCkgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGlpKyssIHYpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihvdGhlcikge1xuICAgICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgUmFuZ2UgP1xuICAgICAgICB0aGlzLl9zdGFydCA9PT0gb3RoZXIuX3N0YXJ0ICYmXG4gICAgICAgIHRoaXMuX2VuZCA9PT0gb3RoZXIuX2VuZCAmJlxuICAgICAgICB0aGlzLl9zdGVwID09PSBvdGhlci5fc3RlcCA6XG4gICAgICAgIGRlZXBFcXVhbCh0aGlzLCBvdGhlcik7XG4gICAgfTtcblxuXG4gIHZhciBFTVBUWV9SQU5HRTtcblxuICBjcmVhdGVDbGFzcyhDb2xsZWN0aW9uLCBJdGVyYWJsZSk7XG4gICAgZnVuY3Rpb24gQ29sbGVjdGlvbigpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignQWJzdHJhY3QnKTtcbiAgICB9XG5cblxuICBjcmVhdGVDbGFzcyhLZXllZENvbGxlY3Rpb24sIENvbGxlY3Rpb24pO2Z1bmN0aW9uIEtleWVkQ29sbGVjdGlvbigpIHt9XG5cbiAgY3JlYXRlQ2xhc3MoSW5kZXhlZENvbGxlY3Rpb24sIENvbGxlY3Rpb24pO2Z1bmN0aW9uIEluZGV4ZWRDb2xsZWN0aW9uKCkge31cblxuICBjcmVhdGVDbGFzcyhTZXRDb2xsZWN0aW9uLCBDb2xsZWN0aW9uKTtmdW5jdGlvbiBTZXRDb2xsZWN0aW9uKCkge31cblxuXG4gIENvbGxlY3Rpb24uS2V5ZWQgPSBLZXllZENvbGxlY3Rpb247XG4gIENvbGxlY3Rpb24uSW5kZXhlZCA9IEluZGV4ZWRDb2xsZWN0aW9uO1xuICBDb2xsZWN0aW9uLlNldCA9IFNldENvbGxlY3Rpb247XG5cbiAgdmFyIGltdWwgPVxuICAgIHR5cGVvZiBNYXRoLmltdWwgPT09ICdmdW5jdGlvbicgJiYgTWF0aC5pbXVsKDB4ZmZmZmZmZmYsIDIpID09PSAtMiA/XG4gICAgTWF0aC5pbXVsIDpcbiAgICBmdW5jdGlvbiBpbXVsKGEsIGIpIHtcbiAgICAgIGEgPSBhIHwgMDsgLy8gaW50XG4gICAgICBiID0gYiB8IDA7IC8vIGludFxuICAgICAgdmFyIGMgPSBhICYgMHhmZmZmO1xuICAgICAgdmFyIGQgPSBiICYgMHhmZmZmO1xuICAgICAgLy8gU2hpZnQgYnkgMCBmaXhlcyB0aGUgc2lnbiBvbiB0aGUgaGlnaCBwYXJ0LlxuICAgICAgcmV0dXJuIChjICogZCkgKyAoKCgoYSA+Pj4gMTYpICogZCArIGMgKiAoYiA+Pj4gMTYpKSA8PCAxNikgPj4+IDApIHwgMDsgLy8gaW50XG4gICAgfTtcblxuICAvLyB2OCBoYXMgYW4gb3B0aW1pemF0aW9uIGZvciBzdG9yaW5nIDMxLWJpdCBzaWduZWQgbnVtYmVycy5cbiAgLy8gVmFsdWVzIHdoaWNoIGhhdmUgZWl0aGVyIDAwIG9yIDExIGFzIHRoZSBoaWdoIG9yZGVyIGJpdHMgcXVhbGlmeS5cbiAgLy8gVGhpcyBmdW5jdGlvbiBkcm9wcyB0aGUgaGlnaGVzdCBvcmRlciBiaXQgaW4gYSBzaWduZWQgbnVtYmVyLCBtYWludGFpbmluZ1xuICAvLyB0aGUgc2lnbiBiaXQuXG4gIGZ1bmN0aW9uIHNtaShpMzIpIHtcbiAgICByZXR1cm4gKChpMzIgPj4+IDEpICYgMHg0MDAwMDAwMCkgfCAoaTMyICYgMHhCRkZGRkZGRik7XG4gIH1cblxuICBmdW5jdGlvbiBoYXNoKG8pIHtcbiAgICBpZiAobyA9PT0gZmFsc2UgfHwgbyA9PT0gbnVsbCB8fCBvID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG8udmFsdWVPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbyA9IG8udmFsdWVPZigpO1xuICAgICAgaWYgKG8gPT09IGZhbHNlIHx8IG8gPT09IG51bGwgfHwgbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobyA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICAgIHZhciB0eXBlID0gdHlwZW9mIG87XG4gICAgaWYgKHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB2YXIgaCA9IG8gfCAwO1xuICAgICAgaWYgKGggIT09IG8pIHtcbiAgICAgICAgaCBePSBvICogMHhGRkZGRkZGRjtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChvID4gMHhGRkZGRkZGRikge1xuICAgICAgICBvIC89IDB4RkZGRkZGRkY7XG4gICAgICAgIGggXj0gbztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzbWkoaCk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG8ubGVuZ3RoID4gU1RSSU5HX0hBU0hfQ0FDSEVfTUlOX1NUUkxFTiA/IGNhY2hlZEhhc2hTdHJpbmcobykgOiBoYXNoU3RyaW5nKG8pO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG8uaGFzaENvZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvLmhhc2hDb2RlKCk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIGhhc2hKU09iaihvKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gaGFzaFN0cmluZyhvLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIHR5cGUgJyArIHR5cGUgKyAnIGNhbm5vdCBiZSBoYXNoZWQuJyk7XG4gIH1cblxuICBmdW5jdGlvbiBjYWNoZWRIYXNoU3RyaW5nKHN0cmluZykge1xuICAgIHZhciBoYXNoID0gc3RyaW5nSGFzaENhY2hlW3N0cmluZ107XG4gICAgaWYgKGhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgaGFzaCA9IGhhc2hTdHJpbmcoc3RyaW5nKTtcbiAgICAgIGlmIChTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID09PSBTVFJJTkdfSEFTSF9DQUNIRV9NQVhfU0laRSkge1xuICAgICAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID0gMDtcbiAgICAgICAgc3RyaW5nSGFzaENhY2hlID0ge307XG4gICAgICB9XG4gICAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFKys7XG4gICAgICBzdHJpbmdIYXNoQ2FjaGVbc3RyaW5nXSA9IGhhc2g7XG4gICAgfVxuICAgIHJldHVybiBoYXNoO1xuICB9XG5cbiAgLy8gaHR0cDovL2pzcGVyZi5jb20vaGFzaGluZy1zdHJpbmdzXG4gIGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyaW5nKSB7XG4gICAgLy8gVGhpcyBpcyB0aGUgaGFzaCBmcm9tIEpWTVxuICAgIC8vIFRoZSBoYXNoIGNvZGUgZm9yIGEgc3RyaW5nIGlzIGNvbXB1dGVkIGFzXG4gICAgLy8gc1swXSAqIDMxIF4gKG4gLSAxKSArIHNbMV0gKiAzMSBeIChuIC0gMikgKyAuLi4gKyBzW24gLSAxXSxcbiAgICAvLyB3aGVyZSBzW2ldIGlzIHRoZSBpdGggY2hhcmFjdGVyIG9mIHRoZSBzdHJpbmcgYW5kIG4gaXMgdGhlIGxlbmd0aCBvZlxuICAgIC8vIHRoZSBzdHJpbmcuIFdlIFwibW9kXCIgdGhlIHJlc3VsdCB0byBtYWtlIGl0IGJldHdlZW4gMCAoaW5jbHVzaXZlKSBhbmQgMl4zMVxuICAgIC8vIChleGNsdXNpdmUpIGJ5IGRyb3BwaW5nIGhpZ2ggYml0cy5cbiAgICB2YXIgaGFzaCA9IDA7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHN0cmluZy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIGhhc2ggPSAzMSAqIGhhc2ggKyBzdHJpbmcuY2hhckNvZGVBdChpaSkgfCAwO1xuICAgIH1cbiAgICByZXR1cm4gc21pKGhhc2gpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzaEpTT2JqKG9iaikge1xuICAgIHZhciBoYXNoO1xuICAgIGlmICh1c2luZ1dlYWtNYXApIHtcbiAgICAgIGhhc2ggPSB3ZWFrTWFwLmdldChvYmopO1xuICAgICAgaWYgKGhhc2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNoID0gb2JqW1VJRF9IQVNIX0tFWV07XG4gICAgaWYgKGhhc2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhc2g7XG4gICAgfVxuXG4gICAgaWYgKCFjYW5EZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgaGFzaCA9IG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSAmJiBvYmoucHJvcGVydHlJc0VudW1lcmFibGVbVUlEX0hBU0hfS0VZXTtcbiAgICAgIGlmIChoYXNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgICB9XG5cbiAgICAgIGhhc2ggPSBnZXRJRU5vZGVIYXNoKG9iaik7XG4gICAgICBpZiAoaGFzaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBoYXNoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhhc2ggPSArK29iakhhc2hVSUQ7XG4gICAgaWYgKG9iakhhc2hVSUQgJiAweDQwMDAwMDAwKSB7XG4gICAgICBvYmpIYXNoVUlEID0gMDtcbiAgICB9XG5cbiAgICBpZiAodXNpbmdXZWFrTWFwKSB7XG4gICAgICB3ZWFrTWFwLnNldChvYmosIGhhc2gpO1xuICAgIH0gZWxzZSBpZiAoaXNFeHRlbnNpYmxlICE9PSB1bmRlZmluZWQgJiYgaXNFeHRlbnNpYmxlKG9iaikgPT09IGZhbHNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vbi1leHRlbnNpYmxlIG9iamVjdHMgYXJlIG5vdCBhbGxvd2VkIGFzIGtleXMuJyk7XG4gICAgfSBlbHNlIGlmIChjYW5EZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgVUlEX0hBU0hfS0VZLCB7XG4gICAgICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgICAgICdjb25maWd1cmFibGUnOiBmYWxzZSxcbiAgICAgICAgJ3dyaXRhYmxlJzogZmFsc2UsXG4gICAgICAgICd2YWx1ZSc6IGhhc2hcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAob2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9PT0gb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSkge1xuICAgICAgLy8gU2luY2Ugd2UgY2FuJ3QgZGVmaW5lIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgb24gdGhlIG9iamVjdFxuICAgICAgLy8gd2UnbGwgaGlqYWNrIG9uZSBvZiB0aGUgbGVzcy11c2VkIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMgdG9cbiAgICAgIC8vIHNhdmUgb3VyIGhhc2ggb24gaXQuIFNpbmNlIHRoaXMgaXMgYSBmdW5jdGlvbiBpdCB3aWxsIG5vdCBzaG93IHVwIGluXG4gICAgICAvLyBgSlNPTi5zdHJpbmdpZnlgIHdoaWNoIGlzIHdoYXQgd2Ugd2FudC5cbiAgICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGVbVUlEX0hBU0hfS0VZXSA9IGhhc2g7XG4gICAgfSBlbHNlIGlmIChvYmoubm9kZVR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBjb3VsZG4ndCBnZXQgdGhlIElFIGB1bmlxdWVJRGAgdG8gdXNlIGFzIGEgaGFzaFxuICAgICAgLy8gYW5kIHdlIGNvdWxkbid0IHVzZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IHRvIGV4cGxvaXQgdGhlXG4gICAgICAvLyBkb250RW51bSBidWcgc28gd2Ugc2ltcGx5IGFkZCB0aGUgYFVJRF9IQVNIX0tFWWAgb24gdGhlIG5vZGVcbiAgICAgIC8vIGl0c2VsZi5cbiAgICAgIG9ialtVSURfSEFTSF9LRVldID0gaGFzaDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gc2V0IGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgb24gb2JqZWN0LicpO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNoO1xuICB9XG5cbiAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gRVM1IG9iamVjdCBtZXRob2RzLlxuICB2YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZTtcblxuICAvLyBUcnVlIGlmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB3b3JrcyBhcyBleHBlY3RlZC4gSUU4IGZhaWxzIHRoaXMgdGVzdC5cbiAgdmFyIGNhbkRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdAJywge30pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSgpKTtcblxuICAvLyBJRSBoYXMgYSBgdW5pcXVlSURgIHByb3BlcnR5IG9uIERPTSBub2Rlcy4gV2UgY2FuIGNvbnN0cnVjdCB0aGUgaGFzaCBmcm9tIGl0XG4gIC8vIGFuZCBhdm9pZCBtZW1vcnkgbGVha3MgZnJvbSB0aGUgSUUgY2xvbmVOb2RlIGJ1Zy5cbiAgZnVuY3Rpb24gZ2V0SUVOb2RlSGFzaChub2RlKSB7XG4gICAgaWYgKG5vZGUgJiYgbm9kZS5ub2RlVHlwZSA+IDApIHtcbiAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgICBjYXNlIDE6IC8vIEVsZW1lbnRcbiAgICAgICAgICByZXR1cm4gbm9kZS51bmlxdWVJRDtcbiAgICAgICAgY2FzZSA5OiAvLyBEb2N1bWVudFxuICAgICAgICAgIHJldHVybiBub2RlLmRvY3VtZW50RWxlbWVudCAmJiBub2RlLmRvY3VtZW50RWxlbWVudC51bmlxdWVJRDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJZiBwb3NzaWJsZSwgdXNlIGEgV2Vha01hcC5cbiAgdmFyIHVzaW5nV2Vha01hcCA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nO1xuICB2YXIgd2Vha01hcDtcbiAgaWYgKHVzaW5nV2Vha01hcCkge1xuICAgIHdlYWtNYXAgPSBuZXcgV2Vha01hcCgpO1xuICB9XG5cbiAgdmFyIG9iakhhc2hVSUQgPSAwO1xuXG4gIHZhciBVSURfSEFTSF9LRVkgPSAnX19pbW11dGFibGVoYXNoX18nO1xuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFVJRF9IQVNIX0tFWSA9IFN5bWJvbChVSURfSEFTSF9LRVkpO1xuICB9XG5cbiAgdmFyIFNUUklOR19IQVNIX0NBQ0hFX01JTl9TVFJMRU4gPSAxNjtcbiAgdmFyIFNUUklOR19IQVNIX0NBQ0hFX01BWF9TSVpFID0gMjU1O1xuICB2YXIgU1RSSU5HX0hBU0hfQ0FDSEVfU0laRSA9IDA7XG4gIHZhciBzdHJpbmdIYXNoQ2FjaGUgPSB7fTtcblxuICBmdW5jdGlvbiBhc3NlcnROb3RJbmZpbml0ZShzaXplKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgc2l6ZSAhPT0gSW5maW5pdHksXG4gICAgICAnQ2Fubm90IHBlcmZvcm0gdGhpcyBhY3Rpb24gd2l0aCBhbiBpbmZpbml0ZSBzaXplLidcbiAgICApO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoTWFwLCBLZXllZENvbGxlY3Rpb24pO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIE1hcCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eU1hcCgpIDpcbiAgICAgICAgaXNNYXAodmFsdWUpICYmICFpc09yZGVyZWQodmFsdWUpID8gdmFsdWUgOlxuICAgICAgICBlbXB0eU1hcCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obWFwICkge1xuICAgICAgICAgIHZhciBpdGVyID0gS2V5ZWRJdGVyYWJsZSh2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gbWFwLnNldChrLCB2KX0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBNYXAucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdNYXAgeycsICd9Jyk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgICBNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGssIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcm9vdCA/XG4gICAgICAgIHRoaXMuX3Jvb3QuZ2V0KDAsIHVuZGVmaW5lZCwgaywgbm90U2V0VmFsdWUpIDpcbiAgICAgICAgbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIHJldHVybiB1cGRhdGVNYXAodGhpcywgaywgdik7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUuc2V0SW4gPSBmdW5jdGlvbihrZXlQYXRoLCB2KSB7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVJbihrZXlQYXRoLCBOT1RfU0VULCBmdW5jdGlvbigpICB7cmV0dXJuIHZ9KTtcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gdXBkYXRlTWFwKHRoaXMsIGssIE5PVF9TRVQpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLmRlbGV0ZUluID0gZnVuY3Rpb24oa2V5UGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlSW4oa2V5UGF0aCwgZnVuY3Rpb24oKSAge3JldHVybiBOT1RfU0VUfSk7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxID9cbiAgICAgICAgayh0aGlzKSA6XG4gICAgICAgIHRoaXMudXBkYXRlSW4oW2tdLCBub3RTZXRWYWx1ZSwgdXBkYXRlcik7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUudXBkYXRlSW4gPSBmdW5jdGlvbihrZXlQYXRoLCBub3RTZXRWYWx1ZSwgdXBkYXRlcikge1xuICAgICAgaWYgKCF1cGRhdGVyKSB7XG4gICAgICAgIHVwZGF0ZXIgPSBub3RTZXRWYWx1ZTtcbiAgICAgICAgbm90U2V0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgICB2YXIgdXBkYXRlZFZhbHVlID0gdXBkYXRlSW5EZWVwTWFwKFxuICAgICAgICB0aGlzLFxuICAgICAgICBmb3JjZUl0ZXJhdG9yKGtleVBhdGgpLFxuICAgICAgICBub3RTZXRWYWx1ZSxcbiAgICAgICAgdXBkYXRlclxuICAgICAgKTtcbiAgICAgIHJldHVybiB1cGRhdGVkVmFsdWUgPT09IE5PVF9TRVQgPyB1bmRlZmluZWQgOiB1cGRhdGVkVmFsdWU7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5TWFwKCk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQ29tcG9zaXRpb25cblxuICAgIE1hcC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbigvKi4uLml0ZXJzKi8pIHtcbiAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5tZXJnZVdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIG1lcmdlciwgaXRlcnMpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLm1lcmdlSW4gPSBmdW5jdGlvbihrZXlQYXRoKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVJbihcbiAgICAgICAga2V5UGF0aCxcbiAgICAgICAgZW1wdHlNYXAoKSxcbiAgICAgICAgZnVuY3Rpb24obSApIHtyZXR1cm4gdHlwZW9mIG0ubWVyZ2UgPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgIG0ubWVyZ2UuYXBwbHkobSwgaXRlcnMpIDpcbiAgICAgICAgICBpdGVyc1tpdGVycy5sZW5ndGggLSAxXX1cbiAgICAgICk7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUubWVyZ2VEZWVwID0gZnVuY3Rpb24oLyouLi5pdGVycyovKSB7XG4gICAgICByZXR1cm4gbWVyZ2VJbnRvTWFwV2l0aCh0aGlzLCBkZWVwTWVyZ2VyLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIGRlZXBNZXJnZXJXaXRoKG1lcmdlciksIGl0ZXJzKTtcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5tZXJnZURlZXBJbiA9IGZ1bmN0aW9uKGtleVBhdGgpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUluKFxuICAgICAgICBrZXlQYXRoLFxuICAgICAgICBlbXB0eU1hcCgpLFxuICAgICAgICBmdW5jdGlvbihtICkge3JldHVybiB0eXBlb2YgbS5tZXJnZURlZXAgPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgIG0ubWVyZ2VEZWVwLmFwcGx5KG0sIGl0ZXJzKSA6XG4gICAgICAgICAgaXRlcnNbaXRlcnMubGVuZ3RoIC0gMV19XG4gICAgICApO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gICAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICAgIHJldHVybiBPcmRlcmVkTWFwKHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IpKTtcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5zb3J0QnkgPSBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAgIC8vIExhdGUgYmluZGluZ1xuICAgICAgcmV0dXJuIE9yZGVyZWRNYXAoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKSk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTXV0YWJpbGl0eVxuXG4gICAgTWFwLnByb3RvdHlwZS53aXRoTXV0YXRpb25zID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIHZhciBtdXRhYmxlID0gdGhpcy5hc011dGFibGUoKTtcbiAgICAgIGZuKG11dGFibGUpO1xuICAgICAgcmV0dXJuIG11dGFibGUud2FzQWx0ZXJlZCgpID8gbXV0YWJsZS5fX2Vuc3VyZU93bmVyKHRoaXMuX19vd25lcklEKSA6IHRoaXM7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUuYXNNdXRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX293bmVySUQgPyB0aGlzIDogdGhpcy5fX2Vuc3VyZU93bmVyKG5ldyBPd25lcklEKCkpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLmFzSW1tdXRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2Vuc3VyZU93bmVyKCk7XG4gICAgfTtcblxuICAgIE1hcC5wcm90b3R5cGUud2FzQWx0ZXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19hbHRlcmVkO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMsIHR5cGUsIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBNYXAucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB0aGlzLl9yb290ICYmIHRoaXMuX3Jvb3QuaXRlcmF0ZShmdW5jdGlvbihlbnRyeSApIHtcbiAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICByZXR1cm4gZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzJDApO1xuICAgICAgfSwgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuXG4gICAgTWFwLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZU1hcCh0aGlzLnNpemUsIHRoaXMuX3Jvb3QsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaXNNYXAobWF5YmVNYXApIHtcbiAgICByZXR1cm4gISEobWF5YmVNYXAgJiYgbWF5YmVNYXBbSVNfTUFQX1NFTlRJTkVMXSk7XG4gIH1cblxuICBNYXAuaXNNYXAgPSBpc01hcDtcblxuICB2YXIgSVNfTUFQX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfTUFQX19AQCc7XG5cbiAgdmFyIE1hcFByb3RvdHlwZSA9IE1hcC5wcm90b3R5cGU7XG4gIE1hcFByb3RvdHlwZVtJU19NQVBfU0VOVElORUxdID0gdHJ1ZTtcbiAgTWFwUHJvdG90eXBlW0RFTEVURV0gPSBNYXBQcm90b3R5cGUucmVtb3ZlO1xuICBNYXBQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUuZGVsZXRlSW47XG5cblxuICAvLyAjcHJhZ21hIFRyaWUgTm9kZXNcblxuXG5cbiAgICBmdW5jdGlvbiBBcnJheU1hcE5vZGUob3duZXJJRCwgZW50cmllcykge1xuICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuZW50cmllcyA9IGVudHJpZXM7XG4gICAgfVxuXG4gICAgQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICAgICAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gICAgICBmb3IgKHZhciBpaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKykge1xuICAgICAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lpXVswXSkpIHtcbiAgICAgICAgICByZXR1cm4gZW50cmllc1tpaV1bMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgQXJyYXlNYXBOb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgICAgIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cbiAgICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICBmb3IgKHZhciBsZW4gPSBlbnRyaWVzLmxlbmd0aDsgaWR4IDwgbGVuOyBpZHgrKykge1xuICAgICAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lkeF1bMF0pKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBleGlzdHMgPSBpZHggPCBsZW47XG5cbiAgICAgIGlmIChleGlzdHMgPyBlbnRyaWVzW2lkeF1bMV0gPT09IHZhbHVlIDogcmVtb3ZlZCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICAgIChyZW1vdmVkIHx8ICFleGlzdHMpICYmIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcblxuICAgICAgaWYgKHJlbW92ZWQgJiYgZW50cmllcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuOyAvLyB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgaWYgKCFleGlzdHMgJiYgIXJlbW92ZWQgJiYgZW50cmllcy5sZW5ndGggPj0gTUFYX0FSUkFZX01BUF9TSVpFKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVOb2Rlcyhvd25lcklELCBlbnRyaWVzLCBrZXksIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgICAgIHZhciBuZXdFbnRyaWVzID0gaXNFZGl0YWJsZSA/IGVudHJpZXMgOiBhcnJDb3B5KGVudHJpZXMpO1xuXG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgaWR4ID09PSBsZW4gLSAxID8gbmV3RW50cmllcy5wb3AoKSA6IChuZXdFbnRyaWVzW2lkeF0gPSBuZXdFbnRyaWVzLnBvcCgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdFbnRyaWVzW2lkeF0gPSBba2V5LCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0VudHJpZXMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNFZGl0YWJsZSkge1xuICAgICAgICB0aGlzLmVudHJpZXMgPSBuZXdFbnRyaWVzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBBcnJheU1hcE5vZGUob3duZXJJRCwgbmV3RW50cmllcyk7XG4gICAgfTtcblxuXG5cblxuICAgIGZ1bmN0aW9uIEJpdG1hcEluZGV4ZWROb2RlKG93bmVySUQsIGJpdG1hcCwgbm9kZXMpIHtcbiAgICAgIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLmJpdG1hcCA9IGJpdG1hcDtcbiAgICAgIHRoaXMubm9kZXMgPSBub2RlcztcbiAgICB9XG5cbiAgICBCaXRtYXBJbmRleGVkTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgICAgIH1cbiAgICAgIHZhciBiaXQgPSAoMSA8PCAoKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0spKTtcbiAgICAgIHZhciBiaXRtYXAgPSB0aGlzLmJpdG1hcDtcbiAgICAgIHJldHVybiAoYml0bWFwICYgYml0KSA9PT0gMCA/IG5vdFNldFZhbHVlIDpcbiAgICAgICAgdGhpcy5ub2Rlc1twb3BDb3VudChiaXRtYXAgJiAoYml0IC0gMSkpXS5nZXQoc2hpZnQgKyBTSElGVCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSk7XG4gICAgfTtcblxuICAgIEJpdG1hcEluZGV4ZWROb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgICAgIH1cbiAgICAgIHZhciBrZXlIYXNoRnJhZyA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuICAgICAgdmFyIGJpdCA9IDEgPDwga2V5SGFzaEZyYWc7XG4gICAgICB2YXIgYml0bWFwID0gdGhpcy5iaXRtYXA7XG4gICAgICB2YXIgZXhpc3RzID0gKGJpdG1hcCAmIGJpdCkgIT09IDA7XG5cbiAgICAgIGlmICghZXhpc3RzICYmIHZhbHVlID09PSBOT1RfU0VUKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgaWR4ID0gcG9wQ291bnQoYml0bWFwICYgKGJpdCAtIDEpKTtcbiAgICAgIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG4gICAgICB2YXIgbm9kZSA9IGV4aXN0cyA/IG5vZGVzW2lkeF0gOiB1bmRlZmluZWQ7XG4gICAgICB2YXIgbmV3Tm9kZSA9IHVwZGF0ZU5vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQgKyBTSElGVCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpO1xuXG4gICAgICBpZiAobmV3Tm9kZSA9PT0gbm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgaWYgKCFleGlzdHMgJiYgbmV3Tm9kZSAmJiBub2Rlcy5sZW5ndGggPj0gTUFYX0JJVE1BUF9JTkRFWEVEX1NJWkUpIHtcbiAgICAgICAgcmV0dXJuIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGtleUhhc2hGcmFnLCBuZXdOb2RlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV4aXN0cyAmJiAhbmV3Tm9kZSAmJiBub2Rlcy5sZW5ndGggPT09IDIgJiYgaXNMZWFmTm9kZShub2Rlc1tpZHggXiAxXSkpIHtcbiAgICAgICAgcmV0dXJuIG5vZGVzW2lkeCBeIDFdO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXhpc3RzICYmIG5ld05vZGUgJiYgbm9kZXMubGVuZ3RoID09PSAxICYmIGlzTGVhZk5vZGUobmV3Tm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIG5ld05vZGU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gICAgICB2YXIgbmV3Qml0bWFwID0gZXhpc3RzID8gbmV3Tm9kZSA/IGJpdG1hcCA6IGJpdG1hcCBeIGJpdCA6IGJpdG1hcCB8IGJpdDtcbiAgICAgIHZhciBuZXdOb2RlcyA9IGV4aXN0cyA/IG5ld05vZGUgP1xuICAgICAgICBzZXRJbihub2RlcywgaWR4LCBuZXdOb2RlLCBpc0VkaXRhYmxlKSA6XG4gICAgICAgIHNwbGljZU91dChub2RlcywgaWR4LCBpc0VkaXRhYmxlKSA6XG4gICAgICAgIHNwbGljZUluKG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpO1xuXG4gICAgICBpZiAoaXNFZGl0YWJsZSkge1xuICAgICAgICB0aGlzLmJpdG1hcCA9IG5ld0JpdG1hcDtcbiAgICAgICAgdGhpcy5ub2RlcyA9IG5ld05vZGVzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCBuZXdCaXRtYXAsIG5ld05vZGVzKTtcbiAgICB9O1xuXG5cblxuXG4gICAgZnVuY3Rpb24gSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBjb3VudCwgbm9kZXMpIHtcbiAgICAgIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLmNvdW50ID0gY291bnQ7XG4gICAgICB0aGlzLm5vZGVzID0gbm9kZXM7XG4gICAgfVxuXG4gICAgSGFzaEFycmF5TWFwTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgICAgIH1cbiAgICAgIHZhciBpZHggPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgICAgIHZhciBub2RlID0gdGhpcy5ub2Rlc1tpZHhdO1xuICAgICAgcmV0dXJuIG5vZGUgPyBub2RlLmdldChzaGlmdCArIFNISUZULCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSA6IG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBIYXNoQXJyYXlNYXBOb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgICAgIH1cbiAgICAgIHZhciBpZHggPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgICAgIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG4gICAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpZHhdO1xuXG4gICAgICBpZiAocmVtb3ZlZCAmJiAhbm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld05vZGUgPSB1cGRhdGVOb2RlKG5vZGUsIG93bmVySUQsIHNoaWZ0ICsgU0hJRlQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKTtcbiAgICAgIGlmIChuZXdOb2RlID09PSBub2RlKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3Q291bnQgPSB0aGlzLmNvdW50O1xuICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgIG5ld0NvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKCFuZXdOb2RlKSB7XG4gICAgICAgIG5ld0NvdW50LS07XG4gICAgICAgIGlmIChuZXdDb3VudCA8IE1JTl9IQVNIX0FSUkFZX01BUF9TSVpFKSB7XG4gICAgICAgICAgcmV0dXJuIHBhY2tOb2Rlcyhvd25lcklELCBub2RlcywgbmV3Q291bnQsIGlkeCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgICAgIHZhciBuZXdOb2RlcyA9IHNldEluKG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpO1xuXG4gICAgICBpZiAoaXNFZGl0YWJsZSkge1xuICAgICAgICB0aGlzLmNvdW50ID0gbmV3Q291bnQ7XG4gICAgICAgIHRoaXMubm9kZXMgPSBuZXdOb2RlcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBuZXdDb3VudCwgbmV3Tm9kZXMpO1xuICAgIH07XG5cblxuXG5cbiAgICBmdW5jdGlvbiBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCBrZXlIYXNoLCBlbnRyaWVzKSB7XG4gICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5rZXlIYXNoID0ga2V5SGFzaDtcbiAgICAgIHRoaXMuZW50cmllcyA9IGVudHJpZXM7XG4gICAgfVxuXG4gICAgSGFzaENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgICAgIGZvciAodmFyIGlpID0gMCwgbGVuID0gZW50cmllcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrKSB7XG4gICAgICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWldWzBdKSkge1xuICAgICAgICAgIHJldHVybiBlbnRyaWVzW2lpXVsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBIYXNoQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gICAgICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cbiAgICAgIGlmIChrZXlIYXNoICE9PSB0aGlzLmtleUhhc2gpIHtcbiAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuICAgICAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG4gICAgICAgIHJldHVybiBtZXJnZUludG9Ob2RlKHRoaXMsIG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgICAgIHZhciBpZHggPSAwO1xuICAgICAgZm9yICh2YXIgbGVuID0gZW50cmllcy5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICAgICAgaWYgKGlzKGtleSwgZW50cmllc1tpZHhdWzBdKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgZXhpc3RzID0gaWR4IDwgbGVuO1xuXG4gICAgICBpZiAoZXhpc3RzID8gZW50cmllc1tpZHhdWzFdID09PSB2YWx1ZSA6IHJlbW92ZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIFNldFJlZihkaWRBbHRlcik7XG4gICAgICAocmVtb3ZlZCB8fCAhZXhpc3RzKSAmJiBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG5cbiAgICAgIGlmIChyZW1vdmVkICYmIGxlbiA9PT0gMikge1xuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIGVudHJpZXNbaWR4IF4gMV0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNFZGl0YWJsZSA9IG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEO1xuICAgICAgdmFyIG5ld0VudHJpZXMgPSBpc0VkaXRhYmxlID8gZW50cmllcyA6IGFyckNvcHkoZW50cmllcyk7XG5cbiAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICBpZHggPT09IGxlbiAtIDEgPyBuZXdFbnRyaWVzLnBvcCgpIDogKG5ld0VudHJpZXNbaWR4XSA9IG5ld0VudHJpZXMucG9wKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0VudHJpZXNbaWR4XSA9IFtrZXksIHZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3RW50cmllcy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgICAgIHRoaXMuZW50cmllcyA9IG5ld0VudHJpZXM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEhhc2hDb2xsaXNpb25Ob2RlKG93bmVySUQsIHRoaXMua2V5SGFzaCwgbmV3RW50cmllcyk7XG4gICAgfTtcblxuXG5cblxuICAgIGZ1bmN0aW9uIFZhbHVlTm9kZShvd25lcklELCBrZXlIYXNoLCBlbnRyeSkge1xuICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMua2V5SGFzaCA9IGtleUhhc2g7XG4gICAgICB0aGlzLmVudHJ5ID0gZW50cnk7XG4gICAgfVxuXG4gICAgVmFsdWVOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIGlzKGtleSwgdGhpcy5lbnRyeVswXSkgPyB0aGlzLmVudHJ5WzFdIDogbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIFZhbHVlTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gICAgICB2YXIgcmVtb3ZlZCA9IHZhbHVlID09PSBOT1RfU0VUO1xuICAgICAgdmFyIGtleU1hdGNoID0gaXMoa2V5LCB0aGlzLmVudHJ5WzBdKTtcbiAgICAgIGlmIChrZXlNYXRjaCA/IHZhbHVlID09PSB0aGlzLmVudHJ5WzFdIDogcmVtb3ZlZCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcblxuICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuICAgICAgICByZXR1cm47IC8vIHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICBpZiAoa2V5TWF0Y2gpIHtcbiAgICAgICAgaWYgKG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEKSB7XG4gICAgICAgICAgdGhpcy5lbnRyeVsxXSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmFsdWVOb2RlKG93bmVySUQsIHRoaXMua2V5SGFzaCwgW2tleSwgdmFsdWVdKTtcbiAgICAgIH1cblxuICAgICAgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuICAgICAgcmV0dXJuIG1lcmdlSW50b05vZGUodGhpcywgb3duZXJJRCwgc2hpZnQsIGhhc2goa2V5KSwgW2tleSwgdmFsdWVdKTtcbiAgICB9O1xuXG5cblxuICAvLyAjcHJhZ21hIEl0ZXJhdG9yc1xuXG4gIEFycmF5TWFwTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9XG4gIEhhc2hDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5pdGVyYXRlID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gICAgZm9yICh2YXIgaWkgPSAwLCBtYXhJbmRleCA9IGVudHJpZXMubGVuZ3RoIC0gMTsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcbiAgICAgIGlmIChmbihlbnRyaWVzW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEJpdG1hcEluZGV4ZWROb2RlLnByb3RvdHlwZS5pdGVyYXRlID1cbiAgSGFzaEFycmF5TWFwTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG4gICAgZm9yICh2YXIgaWkgPSAwLCBtYXhJbmRleCA9IG5vZGVzLmxlbmd0aCAtIDE7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldO1xuICAgICAgaWYgKG5vZGUgJiYgbm9kZS5pdGVyYXRlKGZuLCByZXZlcnNlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIFZhbHVlTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHJldHVybiBmbih0aGlzLmVudHJ5KTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKE1hcEl0ZXJhdG9yLCBJdGVyYXRvcik7XG5cbiAgICBmdW5jdGlvbiBNYXBJdGVyYXRvcihtYXAsIHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgICAgdGhpcy5fcmV2ZXJzZSA9IHJldmVyc2U7XG4gICAgICB0aGlzLl9zdGFjayA9IG1hcC5fcm9vdCAmJiBtYXBJdGVyYXRvckZyYW1lKG1hcC5fcm9vdCk7XG4gICAgfVxuXG4gICAgTWFwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0eXBlID0gdGhpcy5fdHlwZTtcbiAgICAgIHZhciBzdGFjayA9IHRoaXMuX3N0YWNrO1xuICAgICAgd2hpbGUgKHN0YWNrKSB7XG4gICAgICAgIHZhciBub2RlID0gc3RhY2subm9kZTtcbiAgICAgICAgdmFyIGluZGV4ID0gc3RhY2suaW5kZXgrKztcbiAgICAgICAgdmFyIG1heEluZGV4O1xuICAgICAgICBpZiAobm9kZS5lbnRyeSkge1xuICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgbm9kZS5lbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuZW50cmllcykge1xuICAgICAgICAgIG1heEluZGV4ID0gbm9kZS5lbnRyaWVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgaWYgKGluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwSXRlcmF0b3JWYWx1ZSh0eXBlLCBub2RlLmVudHJpZXNbdGhpcy5fcmV2ZXJzZSA/IG1heEluZGV4IC0gaW5kZXggOiBpbmRleF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXhJbmRleCA9IG5vZGUubm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBpZiAoaW5kZXggPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzdWJOb2RlID0gbm9kZS5ub2Rlc1t0aGlzLl9yZXZlcnNlID8gbWF4SW5kZXggLSBpbmRleCA6IGluZGV4XTtcbiAgICAgICAgICAgIGlmIChzdWJOb2RlKSB7XG4gICAgICAgICAgICAgIGlmIChzdWJOb2RlLmVudHJ5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgc3ViTm9kZS5lbnRyeSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RhY2sgPSB0aGlzLl9zdGFjayA9IG1hcEl0ZXJhdG9yRnJhbWUoc3ViTm9kZSwgc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0YWNrID0gdGhpcy5fc3RhY2sgPSB0aGlzLl9zdGFjay5fX3ByZXY7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgZW50cnkpIHtcbiAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFwSXRlcmF0b3JGcmFtZShub2RlLCBwcmV2KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vZGU6IG5vZGUsXG4gICAgICBpbmRleDogMCxcbiAgICAgIF9fcHJldjogcHJldlxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTWFwKHNpemUsIHJvb3QsIG93bmVySUQsIGhhc2gpIHtcbiAgICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShNYXBQcm90b3R5cGUpO1xuICAgIG1hcC5zaXplID0gc2l6ZTtcbiAgICBtYXAuX3Jvb3QgPSByb290O1xuICAgIG1hcC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIG1hcC5fX2hhc2ggPSBoYXNoO1xuICAgIG1hcC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgdmFyIEVNUFRZX01BUDtcbiAgZnVuY3Rpb24gZW1wdHlNYXAoKSB7XG4gICAgcmV0dXJuIEVNUFRZX01BUCB8fCAoRU1QVFlfTUFQID0gbWFrZU1hcCgwKSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVNYXAobWFwLCBrLCB2KSB7XG4gICAgdmFyIG5ld1Jvb3Q7XG4gICAgdmFyIG5ld1NpemU7XG4gICAgaWYgKCFtYXAuX3Jvb3QpIHtcbiAgICAgIGlmICh2ID09PSBOT1RfU0VUKSB7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgICB9XG4gICAgICBuZXdTaXplID0gMTtcbiAgICAgIG5ld1Jvb3QgPSBuZXcgQXJyYXlNYXBOb2RlKG1hcC5fX293bmVySUQsIFtbaywgdl1dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGRpZENoYW5nZVNpemUgPSBNYWtlUmVmKENIQU5HRV9MRU5HVEgpO1xuICAgICAgdmFyIGRpZEFsdGVyID0gTWFrZVJlZihESURfQUxURVIpO1xuICAgICAgbmV3Um9vdCA9IHVwZGF0ZU5vZGUobWFwLl9yb290LCBtYXAuX19vd25lcklELCAwLCB1bmRlZmluZWQsIGssIHYsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKTtcbiAgICAgIGlmICghZGlkQWx0ZXIudmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgIH1cbiAgICAgIG5ld1NpemUgPSBtYXAuc2l6ZSArIChkaWRDaGFuZ2VTaXplLnZhbHVlID8gdiA9PT0gTk9UX1NFVCA/IC0xIDogMSA6IDApO1xuICAgIH1cbiAgICBpZiAobWFwLl9fb3duZXJJRCkge1xuICAgICAgbWFwLnNpemUgPSBuZXdTaXplO1xuICAgICAgbWFwLl9yb290ID0gbmV3Um9vdDtcbiAgICAgIG1hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICBtYXAuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuICAgIHJldHVybiBuZXdSb290ID8gbWFrZU1hcChuZXdTaXplLCBuZXdSb290KSA6IGVtcHR5TWFwKCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVOb2RlKG5vZGUsIG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICAgIGlmICghbm9kZSkge1xuICAgICAgaWYgKHZhbHVlID09PSBOT1RfU0VUKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICAgIHJldHVybiBuZXcgVmFsdWVOb2RlKG93bmVySUQsIGtleUhhc2gsIFtrZXksIHZhbHVlXSk7XG4gICAgfVxuICAgIHJldHVybiBub2RlLnVwZGF0ZShvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNMZWFmTm9kZShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuY29uc3RydWN0b3IgPT09IFZhbHVlTm9kZSB8fCBub2RlLmNvbnN0cnVjdG9yID09PSBIYXNoQ29sbGlzaW9uTm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlSW50b05vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGVudHJ5KSB7XG4gICAgaWYgKG5vZGUua2V5SGFzaCA9PT0ga2V5SGFzaCkge1xuICAgICAgcmV0dXJuIG5ldyBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCBrZXlIYXNoLCBbbm9kZS5lbnRyeSwgZW50cnldKTtcbiAgICB9XG5cbiAgICB2YXIgaWR4MSA9IChzaGlmdCA9PT0gMCA/IG5vZGUua2V5SGFzaCA6IG5vZGUua2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgICB2YXIgaWR4MiA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuXG4gICAgdmFyIG5ld05vZGU7XG4gICAgdmFyIG5vZGVzID0gaWR4MSA9PT0gaWR4MiA/XG4gICAgICBbbWVyZ2VJbnRvTm9kZShub2RlLCBvd25lcklELCBzaGlmdCArIFNISUZULCBrZXlIYXNoLCBlbnRyeSldIDpcbiAgICAgICgobmV3Tm9kZSA9IG5ldyBWYWx1ZU5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cnkpKSwgaWR4MSA8IGlkeDIgPyBbbm9kZSwgbmV3Tm9kZV0gOiBbbmV3Tm9kZSwgbm9kZV0pO1xuXG4gICAgcmV0dXJuIG5ldyBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCAoMSA8PCBpZHgxKSB8ICgxIDw8IGlkeDIpLCBub2Rlcyk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2Rlcyhvd25lcklELCBlbnRyaWVzLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBvd25lcklEID0gbmV3IE93bmVySUQoKTtcbiAgICB9XG4gICAgdmFyIG5vZGUgPSBuZXcgVmFsdWVOb2RlKG93bmVySUQsIGhhc2goa2V5KSwgW2tleSwgdmFsdWVdKTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgZW50cmllcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaWldO1xuICAgICAgbm9kZSA9IG5vZGUudXBkYXRlKG93bmVySUQsIDAsIHVuZGVmaW5lZCwgZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBwYWNrTm9kZXMob3duZXJJRCwgbm9kZXMsIGNvdW50LCBleGNsdWRpbmcpIHtcbiAgICB2YXIgYml0bWFwID0gMDtcbiAgICB2YXIgcGFja2VkSUkgPSAwO1xuICAgIHZhciBwYWNrZWROb2RlcyA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgZm9yICh2YXIgaWkgPSAwLCBiaXQgPSAxLCBsZW4gPSBub2Rlcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrLCBiaXQgPDw9IDEpIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaWldO1xuICAgICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCAmJiBpaSAhPT0gZXhjbHVkaW5nKSB7XG4gICAgICAgIGJpdG1hcCB8PSBiaXQ7XG4gICAgICAgIHBhY2tlZE5vZGVzW3BhY2tlZElJKytdID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCBiaXRtYXAsIHBhY2tlZE5vZGVzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGluY2x1ZGluZywgbm9kZSkge1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgdmFyIGV4cGFuZGVkTm9kZXMgPSBuZXcgQXJyYXkoU0laRSk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBiaXRtYXAgIT09IDA7IGlpKyssIGJpdG1hcCA+Pj49IDEpIHtcbiAgICAgIGV4cGFuZGVkTm9kZXNbaWldID0gYml0bWFwICYgMSA/IG5vZGVzW2NvdW50KytdIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBleHBhbmRlZE5vZGVzW2luY2x1ZGluZ10gPSBub2RlO1xuICAgIHJldHVybiBuZXcgSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBjb3VudCArIDEsIGV4cGFuZGVkTm9kZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VJbnRvTWFwV2l0aChtYXAsIG1lcmdlciwgaXRlcmFibGVzKSB7XG4gICAgdmFyIGl0ZXJzID0gW107XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJhYmxlcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZXJhYmxlc1tpaV07XG4gICAgICB2YXIgaXRlciA9IEtleWVkSXRlcmFibGUodmFsdWUpO1xuICAgICAgaWYgKCFpc0l0ZXJhYmxlKHZhbHVlKSkge1xuICAgICAgICBpdGVyID0gaXRlci5tYXAoZnVuY3Rpb24odiApIHtyZXR1cm4gZnJvbUpTKHYpfSk7XG4gICAgICB9XG4gICAgICBpdGVycy5wdXNoKGl0ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VJbnRvQ29sbGVjdGlvbldpdGgobWFwLCBtZXJnZXIsIGl0ZXJzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZXBNZXJnZXIoZXhpc3RpbmcsIHZhbHVlLCBrZXkpIHtcbiAgICByZXR1cm4gZXhpc3RpbmcgJiYgZXhpc3RpbmcubWVyZ2VEZWVwICYmIGlzSXRlcmFibGUodmFsdWUpID9cbiAgICAgIGV4aXN0aW5nLm1lcmdlRGVlcCh2YWx1ZSkgOlxuICAgICAgaXMoZXhpc3RpbmcsIHZhbHVlKSA/IGV4aXN0aW5nIDogdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBkZWVwTWVyZ2VyV2l0aChtZXJnZXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZXhpc3RpbmcsIHZhbHVlLCBrZXkpICB7XG4gICAgICBpZiAoZXhpc3RpbmcgJiYgZXhpc3RpbmcubWVyZ2VEZWVwV2l0aCAmJiBpc0l0ZXJhYmxlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZXhpc3RpbmcubWVyZ2VEZWVwV2l0aChtZXJnZXIsIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHZhciBuZXh0VmFsdWUgPSBtZXJnZXIoZXhpc3RpbmcsIHZhbHVlLCBrZXkpO1xuICAgICAgcmV0dXJuIGlzKGV4aXN0aW5nLCBuZXh0VmFsdWUpID8gZXhpc3RpbmcgOiBuZXh0VmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlSW50b0NvbGxlY3Rpb25XaXRoKGNvbGxlY3Rpb24sIG1lcmdlciwgaXRlcnMpIHtcbiAgICBpdGVycyA9IGl0ZXJzLmZpbHRlcihmdW5jdGlvbih4ICkge3JldHVybiB4LnNpemUgIT09IDB9KTtcbiAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKGNvbGxlY3Rpb24uc2l6ZSA9PT0gMCAmJiAhY29sbGVjdGlvbi5fX293bmVySUQgJiYgaXRlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5jb25zdHJ1Y3RvcihpdGVyc1swXSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oY29sbGVjdGlvbiApIHtcbiAgICAgIHZhciBtZXJnZUludG9NYXAgPSBtZXJnZXIgP1xuICAgICAgICBmdW5jdGlvbih2YWx1ZSwga2V5KSAge1xuICAgICAgICAgIGNvbGxlY3Rpb24udXBkYXRlKGtleSwgTk9UX1NFVCwgZnVuY3Rpb24oZXhpc3RpbmcgKVxuICAgICAgICAgICAge3JldHVybiBleGlzdGluZyA9PT0gTk9UX1NFVCA/IHZhbHVlIDogbWVyZ2VyKGV4aXN0aW5nLCB2YWx1ZSwga2V5KX1cbiAgICAgICAgICApO1xuICAgICAgICB9IDpcbiAgICAgICAgZnVuY3Rpb24odmFsdWUsIGtleSkgIHtcbiAgICAgICAgICBjb2xsZWN0aW9uLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICBpdGVyc1tpaV0uZm9yRWFjaChtZXJnZUludG9NYXApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlSW5EZWVwTWFwKGV4aXN0aW5nLCBrZXlQYXRoSXRlciwgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgICB2YXIgaXNOb3RTZXQgPSBleGlzdGluZyA9PT0gTk9UX1NFVDtcbiAgICB2YXIgc3RlcCA9IGtleVBhdGhJdGVyLm5leHQoKTtcbiAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICB2YXIgZXhpc3RpbmdWYWx1ZSA9IGlzTm90U2V0ID8gbm90U2V0VmFsdWUgOiBleGlzdGluZztcbiAgICAgIHZhciBuZXdWYWx1ZSA9IHVwZGF0ZXIoZXhpc3RpbmdWYWx1ZSk7XG4gICAgICByZXR1cm4gbmV3VmFsdWUgPT09IGV4aXN0aW5nVmFsdWUgPyBleGlzdGluZyA6IG5ld1ZhbHVlO1xuICAgIH1cbiAgICBpbnZhcmlhbnQoXG4gICAgICBpc05vdFNldCB8fCAoZXhpc3RpbmcgJiYgZXhpc3Rpbmcuc2V0KSxcbiAgICAgICdpbnZhbGlkIGtleVBhdGgnXG4gICAgKTtcbiAgICB2YXIga2V5ID0gc3RlcC52YWx1ZTtcbiAgICB2YXIgbmV4dEV4aXN0aW5nID0gaXNOb3RTZXQgPyBOT1RfU0VUIDogZXhpc3RpbmcuZ2V0KGtleSwgTk9UX1NFVCk7XG4gICAgdmFyIG5leHRVcGRhdGVkID0gdXBkYXRlSW5EZWVwTWFwKFxuICAgICAgbmV4dEV4aXN0aW5nLFxuICAgICAga2V5UGF0aEl0ZXIsXG4gICAgICBub3RTZXRWYWx1ZSxcbiAgICAgIHVwZGF0ZXJcbiAgICApO1xuICAgIHJldHVybiBuZXh0VXBkYXRlZCA9PT0gbmV4dEV4aXN0aW5nID8gZXhpc3RpbmcgOlxuICAgICAgbmV4dFVwZGF0ZWQgPT09IE5PVF9TRVQgPyBleGlzdGluZy5yZW1vdmUoa2V5KSA6XG4gICAgICAoaXNOb3RTZXQgPyBlbXB0eU1hcCgpIDogZXhpc3RpbmcpLnNldChrZXksIG5leHRVcGRhdGVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvcENvdW50KHgpIHtcbiAgICB4ID0geCAtICgoeCA+PiAxKSAmIDB4NTU1NTU1NTUpO1xuICAgIHggPSAoeCAmIDB4MzMzMzMzMzMpICsgKCh4ID4+IDIpICYgMHgzMzMzMzMzMyk7XG4gICAgeCA9ICh4ICsgKHggPj4gNCkpICYgMHgwZjBmMGYwZjtcbiAgICB4ID0geCArICh4ID4+IDgpO1xuICAgIHggPSB4ICsgKHggPj4gMTYpO1xuICAgIHJldHVybiB4ICYgMHg3ZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEluKGFycmF5LCBpZHgsIHZhbCwgY2FuRWRpdCkge1xuICAgIHZhciBuZXdBcnJheSA9IGNhbkVkaXQgPyBhcnJheSA6IGFyckNvcHkoYXJyYXkpO1xuICAgIG5ld0FycmF5W2lkeF0gPSB2YWw7XG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgZnVuY3Rpb24gc3BsaWNlSW4oYXJyYXksIGlkeCwgdmFsLCBjYW5FZGl0KSB7XG4gICAgdmFyIG5ld0xlbiA9IGFycmF5Lmxlbmd0aCArIDE7XG4gICAgaWYgKGNhbkVkaXQgJiYgaWR4ICsgMSA9PT0gbmV3TGVuKSB7XG4gICAgICBhcnJheVtpZHhdID0gdmFsO1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH1cbiAgICB2YXIgbmV3QXJyYXkgPSBuZXcgQXJyYXkobmV3TGVuKTtcbiAgICB2YXIgYWZ0ZXIgPSAwO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBuZXdMZW47IGlpKyspIHtcbiAgICAgIGlmIChpaSA9PT0gaWR4KSB7XG4gICAgICAgIG5ld0FycmF5W2lpXSA9IHZhbDtcbiAgICAgICAgYWZ0ZXIgPSAtMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0FycmF5W2lpXSA9IGFycmF5W2lpICsgYWZ0ZXJdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3QXJyYXk7XG4gIH1cblxuICBmdW5jdGlvbiBzcGxpY2VPdXQoYXJyYXksIGlkeCwgY2FuRWRpdCkge1xuICAgIHZhciBuZXdMZW4gPSBhcnJheS5sZW5ndGggLSAxO1xuICAgIGlmIChjYW5FZGl0ICYmIGlkeCA9PT0gbmV3TGVuKSB7XG4gICAgICBhcnJheS5wb3AoKTtcbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG4gICAgdmFyIG5ld0FycmF5ID0gbmV3IEFycmF5KG5ld0xlbik7XG4gICAgdmFyIGFmdGVyID0gMDtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgbmV3TGVuOyBpaSsrKSB7XG4gICAgICBpZiAoaWkgPT09IGlkeCkge1xuICAgICAgICBhZnRlciA9IDE7XG4gICAgICB9XG4gICAgICBuZXdBcnJheVtpaV0gPSBhcnJheVtpaSArIGFmdGVyXTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgdmFyIE1BWF9BUlJBWV9NQVBfU0laRSA9IFNJWkUgLyA0O1xuICB2YXIgTUFYX0JJVE1BUF9JTkRFWEVEX1NJWkUgPSBTSVpFIC8gMjtcbiAgdmFyIE1JTl9IQVNIX0FSUkFZX01BUF9TSVpFID0gU0laRSAvIDQ7XG5cbiAgY3JlYXRlQ2xhc3MoTGlzdCwgSW5kZXhlZENvbGxlY3Rpb24pO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIExpc3QodmFsdWUpIHtcbiAgICAgIHZhciBlbXB0eSA9IGVtcHR5TGlzdCgpO1xuICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTGlzdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXIgPSBJbmRleGVkSXRlcmFibGUodmFsdWUpO1xuICAgICAgdmFyIHNpemUgPSBpdGVyLnNpemU7XG4gICAgICBpZiAoc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZW1wdHk7XG4gICAgICB9XG4gICAgICBhc3NlcnROb3RJbmZpbml0ZShzaXplKTtcbiAgICAgIGlmIChzaXplID4gMCAmJiBzaXplIDwgU0laRSkge1xuICAgICAgICByZXR1cm4gbWFrZUxpc3QoMCwgc2l6ZSwgU0hJRlQsIG51bGwsIG5ldyBWTm9kZShpdGVyLnRvQXJyYXkoKSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5LndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obGlzdCApIHtcbiAgICAgICAgbGlzdC5zZXRTaXplKHNpemUpO1xuICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiwgaSkgIHtyZXR1cm4gbGlzdC5zZXQoaSwgdil9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIExpc3Qub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnTGlzdCBbJywgJ10nKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICAgIExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLnNpemUpIHtcbiAgICAgICAgaW5kZXggKz0gdGhpcy5fb3JpZ2luO1xuICAgICAgICB2YXIgbm9kZSA9IGxpc3ROb2RlRm9yKHRoaXMsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5hcnJheVtpbmRleCAmIE1BU0tdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgTGlzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdXBkYXRlTGlzdCh0aGlzLCBpbmRleCwgdmFsdWUpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgcmV0dXJuICF0aGlzLmhhcyhpbmRleCkgPyB0aGlzIDpcbiAgICAgICAgaW5kZXggPT09IDAgPyB0aGlzLnNoaWZ0KCkgOlxuICAgICAgICBpbmRleCA9PT0gdGhpcy5zaXplIC0gMSA/IHRoaXMucG9wKCkgOlxuICAgICAgICB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAwLCB2YWx1ZSk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX29yaWdpbiA9IHRoaXMuX2NhcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5fbGV2ZWwgPSBTSElGVDtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHRoaXMuX3RhaWwgPSBudWxsO1xuICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbXB0eUxpc3QoKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgb2xkU2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obGlzdCApIHtcbiAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAwLCBvbGRTaXplICsgdmFsdWVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB2YWx1ZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgbGlzdC5zZXQob2xkU2l6ZSArIGlpLCB2YWx1ZXNbaWldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNldExpc3RCb3VuZHModGhpcywgMCwgLTEpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgdmFyIHZhbHVlcyA9IGFyZ3VtZW50cztcbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obGlzdCApIHtcbiAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAtdmFsdWVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB2YWx1ZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgbGlzdC5zZXQoaWksIHZhbHVlc1tpaV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKHRoaXMsIDEpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIENvbXBvc2l0aW9uXG5cbiAgICBMaXN0LnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uKC8qLi4uaXRlcnMqLykge1xuICAgICAgcmV0dXJuIG1lcmdlSW50b0xpc3RXaXRoKHRoaXMsIHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUubWVyZ2VXaXRoID0gZnVuY3Rpb24obWVyZ2VyKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICByZXR1cm4gbWVyZ2VJbnRvTGlzdFdpdGgodGhpcywgbWVyZ2VyLCBpdGVycyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLm1lcmdlRGVlcCA9IGZ1bmN0aW9uKC8qLi4uaXRlcnMqLykge1xuICAgICAgcmV0dXJuIG1lcmdlSW50b0xpc3RXaXRoKHRoaXMsIGRlZXBNZXJnZXIsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9MaXN0V2l0aCh0aGlzLCBkZWVwTWVyZ2VyV2l0aChtZXJnZXIpLCBpdGVycyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgICByZXR1cm4gc2V0TGlzdEJvdW5kcyh0aGlzLCAwLCBzaXplKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBJdGVyYXRpb25cblxuICAgIExpc3QucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKFxuICAgICAgICB0aGlzLFxuICAgICAgICByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpLFxuICAgICAgICByZXNvbHZlRW5kKGVuZCwgc2l6ZSlcbiAgICAgICk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgdmFyIHZhbHVlcyA9IGl0ZXJhdGVMaXN0KHRoaXMsIHJldmVyc2UpO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlcygpO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IERPTkUgP1xuICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGluZGV4KyssIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciB2YWx1ZXMgPSBpdGVyYXRlTGlzdCh0aGlzLCByZXZlcnNlKTtcbiAgICAgIHZhciB2YWx1ZTtcbiAgICAgIHdoaWxlICgodmFsdWUgPSB2YWx1ZXMoKSkgIT09IERPTkUpIHtcbiAgICAgICAgaWYgKGZuKHZhbHVlLCBpbmRleCsrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZUxpc3QodGhpcy5fb3JpZ2luLCB0aGlzLl9jYXBhY2l0eSwgdGhpcy5fbGV2ZWwsIHRoaXMuX3Jvb3QsIHRoaXMuX3RhaWwsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaXNMaXN0KG1heWJlTGlzdCkge1xuICAgIHJldHVybiAhIShtYXliZUxpc3QgJiYgbWF5YmVMaXN0W0lTX0xJU1RfU0VOVElORUxdKTtcbiAgfVxuXG4gIExpc3QuaXNMaXN0ID0gaXNMaXN0O1xuXG4gIHZhciBJU19MSVNUX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfTElTVF9fQEAnO1xuXG4gIHZhciBMaXN0UHJvdG90eXBlID0gTGlzdC5wcm90b3R5cGU7XG4gIExpc3RQcm90b3R5cGVbSVNfTElTVF9TRU5USU5FTF0gPSB0cnVlO1xuICBMaXN0UHJvdG90eXBlW0RFTEVURV0gPSBMaXN0UHJvdG90eXBlLnJlbW92ZTtcbiAgTGlzdFByb3RvdHlwZS5zZXRJbiA9IE1hcFByb3RvdHlwZS5zZXRJbjtcbiAgTGlzdFByb3RvdHlwZS5kZWxldGVJbiA9XG4gIExpc3RQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUucmVtb3ZlSW47XG4gIExpc3RQcm90b3R5cGUudXBkYXRlID0gTWFwUHJvdG90eXBlLnVwZGF0ZTtcbiAgTGlzdFByb3RvdHlwZS51cGRhdGVJbiA9IE1hcFByb3RvdHlwZS51cGRhdGVJbjtcbiAgTGlzdFByb3RvdHlwZS5tZXJnZUluID0gTWFwUHJvdG90eXBlLm1lcmdlSW47XG4gIExpc3RQcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwSW47XG4gIExpc3RQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IE1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zO1xuICBMaXN0UHJvdG90eXBlLmFzTXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc011dGFibGU7XG4gIExpc3RQcm90b3R5cGUuYXNJbW11dGFibGUgPSBNYXBQcm90b3R5cGUuYXNJbW11dGFibGU7XG4gIExpc3RQcm90b3R5cGUud2FzQWx0ZXJlZCA9IE1hcFByb3RvdHlwZS53YXNBbHRlcmVkO1xuXG5cblxuICAgIGZ1bmN0aW9uIFZOb2RlKGFycmF5LCBvd25lcklEKSB7XG4gICAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG4gICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHNlZW1zIGxpa2UgdGhlc2UgbWV0aG9kcyBhcmUgdmVyeSBzaW1pbGFyXG5cbiAgICBWTm9kZS5wcm90b3R5cGUucmVtb3ZlQmVmb3JlID0gZnVuY3Rpb24ob3duZXJJRCwgbGV2ZWwsIGluZGV4KSB7XG4gICAgICBpZiAoaW5kZXggPT09IGxldmVsID8gMSA8PCBsZXZlbCA6IDAgfHwgdGhpcy5hcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgb3JpZ2luSW5kZXggPSAoaW5kZXggPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICBpZiAob3JpZ2luSW5kZXggPj0gdGhpcy5hcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWTm9kZShbXSwgb3duZXJJRCk7XG4gICAgICB9XG4gICAgICB2YXIgcmVtb3ZpbmdGaXJzdCA9IG9yaWdpbkluZGV4ID09PSAwO1xuICAgICAgdmFyIG5ld0NoaWxkO1xuICAgICAgaWYgKGxldmVsID4gMCkge1xuICAgICAgICB2YXIgb2xkQ2hpbGQgPSB0aGlzLmFycmF5W29yaWdpbkluZGV4XTtcbiAgICAgICAgbmV3Q2hpbGQgPSBvbGRDaGlsZCAmJiBvbGRDaGlsZC5yZW1vdmVCZWZvcmUob3duZXJJRCwgbGV2ZWwgLSBTSElGVCwgaW5kZXgpO1xuICAgICAgICBpZiAobmV3Q2hpbGQgPT09IG9sZENoaWxkICYmIHJlbW92aW5nRmlyc3QpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlbW92aW5nRmlyc3QgJiYgIW5ld0NoaWxkKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIGVkaXRhYmxlID0gZWRpdGFibGVWTm9kZSh0aGlzLCBvd25lcklEKTtcbiAgICAgIGlmICghcmVtb3ZpbmdGaXJzdCkge1xuICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgb3JpZ2luSW5kZXg7IGlpKyspIHtcbiAgICAgICAgICBlZGl0YWJsZS5hcnJheVtpaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuZXdDaGlsZCkge1xuICAgICAgICBlZGl0YWJsZS5hcnJheVtvcmlnaW5JbmRleF0gPSBuZXdDaGlsZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGl0YWJsZTtcbiAgICB9O1xuXG4gICAgVk5vZGUucHJvdG90eXBlLnJlbW92ZUFmdGVyID0gZnVuY3Rpb24ob3duZXJJRCwgbGV2ZWwsIGluZGV4KSB7XG4gICAgICBpZiAoaW5kZXggPT09IChsZXZlbCA/IDEgPDwgbGV2ZWwgOiAwKSB8fCB0aGlzLmFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciBzaXplSW5kZXggPSAoKGluZGV4IC0gMSkgPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICBpZiAoc2l6ZUluZGV4ID49IHRoaXMuYXJyYXkubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV3Q2hpbGQ7XG4gICAgICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgICAgIHZhciBvbGRDaGlsZCA9IHRoaXMuYXJyYXlbc2l6ZUluZGV4XTtcbiAgICAgICAgbmV3Q2hpbGQgPSBvbGRDaGlsZCAmJiBvbGRDaGlsZC5yZW1vdmVBZnRlcihvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCk7XG4gICAgICAgIGlmIChuZXdDaGlsZCA9PT0gb2xkQ2hpbGQgJiYgc2l6ZUluZGV4ID09PSB0aGlzLmFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZWRpdGFibGUgPSBlZGl0YWJsZVZOb2RlKHRoaXMsIG93bmVySUQpO1xuICAgICAgZWRpdGFibGUuYXJyYXkuc3BsaWNlKHNpemVJbmRleCArIDEpO1xuICAgICAgaWYgKG5ld0NoaWxkKSB7XG4gICAgICAgIGVkaXRhYmxlLmFycmF5W3NpemVJbmRleF0gPSBuZXdDaGlsZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGl0YWJsZTtcbiAgICB9O1xuXG5cblxuICB2YXIgRE9ORSA9IHt9O1xuXG4gIGZ1bmN0aW9uIGl0ZXJhdGVMaXN0KGxpc3QsIHJldmVyc2UpIHtcbiAgICB2YXIgbGVmdCA9IGxpc3QuX29yaWdpbjtcbiAgICB2YXIgcmlnaHQgPSBsaXN0Ll9jYXBhY2l0eTtcbiAgICB2YXIgdGFpbFBvcyA9IGdldFRhaWxPZmZzZXQocmlnaHQpO1xuICAgIHZhciB0YWlsID0gbGlzdC5fdGFpbDtcblxuICAgIHJldHVybiBpdGVyYXRlTm9kZU9yTGVhZihsaXN0Ll9yb290LCBsaXN0Ll9sZXZlbCwgMCk7XG5cbiAgICBmdW5jdGlvbiBpdGVyYXRlTm9kZU9yTGVhZihub2RlLCBsZXZlbCwgb2Zmc2V0KSB7XG4gICAgICByZXR1cm4gbGV2ZWwgPT09IDAgP1xuICAgICAgICBpdGVyYXRlTGVhZihub2RlLCBvZmZzZXQpIDpcbiAgICAgICAgaXRlcmF0ZU5vZGUobm9kZSwgbGV2ZWwsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXRlcmF0ZUxlYWYobm9kZSwgb2Zmc2V0KSB7XG4gICAgICB2YXIgYXJyYXkgPSBvZmZzZXQgPT09IHRhaWxQb3MgPyB0YWlsICYmIHRhaWwuYXJyYXkgOiBub2RlICYmIG5vZGUuYXJyYXk7XG4gICAgICB2YXIgZnJvbSA9IG9mZnNldCA+IGxlZnQgPyAwIDogbGVmdCAtIG9mZnNldDtcbiAgICAgIHZhciB0byA9IHJpZ2h0IC0gb2Zmc2V0O1xuICAgICAgaWYgKHRvID4gU0laRSkge1xuICAgICAgICB0byA9IFNJWkU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSAge1xuICAgICAgICBpZiAoZnJvbSA9PT0gdG8pIHtcbiAgICAgICAgICByZXR1cm4gRE9ORTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaWR4ID0gcmV2ZXJzZSA/IC0tdG8gOiBmcm9tKys7XG4gICAgICAgIHJldHVybiBhcnJheSAmJiBhcnJheVtpZHhdO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpdGVyYXRlTm9kZShub2RlLCBsZXZlbCwgb2Zmc2V0KSB7XG4gICAgICB2YXIgdmFsdWVzO1xuICAgICAgdmFyIGFycmF5ID0gbm9kZSAmJiBub2RlLmFycmF5O1xuICAgICAgdmFyIGZyb20gPSBvZmZzZXQgPiBsZWZ0ID8gMCA6IChsZWZ0IC0gb2Zmc2V0KSA+PiBsZXZlbDtcbiAgICAgIHZhciB0byA9ICgocmlnaHQgLSBvZmZzZXQpID4+IGxldmVsKSArIDE7XG4gICAgICBpZiAodG8gPiBTSVpFKSB7XG4gICAgICAgIHRvID0gU0laRTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbigpICB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZXMoKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gRE9ORSkge1xuICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZXMgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZnJvbSA9PT0gdG8pIHtcbiAgICAgICAgICAgIHJldHVybiBET05FO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaWR4ID0gcmV2ZXJzZSA/IC0tdG8gOiBmcm9tKys7XG4gICAgICAgICAgdmFsdWVzID0gaXRlcmF0ZU5vZGVPckxlYWYoXG4gICAgICAgICAgICBhcnJheSAmJiBhcnJheVtpZHhdLCBsZXZlbCAtIFNISUZULCBvZmZzZXQgKyAoaWR4IDw8IGxldmVsKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTGlzdChvcmlnaW4sIGNhcGFjaXR5LCBsZXZlbCwgcm9vdCwgdGFpbCwgb3duZXJJRCwgaGFzaCkge1xuICAgIHZhciBsaXN0ID0gT2JqZWN0LmNyZWF0ZShMaXN0UHJvdG90eXBlKTtcbiAgICBsaXN0LnNpemUgPSBjYXBhY2l0eSAtIG9yaWdpbjtcbiAgICBsaXN0Ll9vcmlnaW4gPSBvcmlnaW47XG4gICAgbGlzdC5fY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgICBsaXN0Ll9sZXZlbCA9IGxldmVsO1xuICAgIGxpc3QuX3Jvb3QgPSByb290O1xuICAgIGxpc3QuX3RhaWwgPSB0YWlsO1xuICAgIGxpc3QuX19vd25lcklEID0gb3duZXJJRDtcbiAgICBsaXN0Ll9faGFzaCA9IGhhc2g7XG4gICAgbGlzdC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIHZhciBFTVBUWV9MSVNUO1xuICBmdW5jdGlvbiBlbXB0eUxpc3QoKSB7XG4gICAgcmV0dXJuIEVNUFRZX0xJU1QgfHwgKEVNUFRZX0xJU1QgPSBtYWtlTGlzdCgwLCAwLCBTSElGVCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlTGlzdChsaXN0LCBpbmRleCwgdmFsdWUpIHtcbiAgICBpbmRleCA9IHdyYXBJbmRleChsaXN0LCBpbmRleCk7XG5cbiAgICBpZiAoaW5kZXggIT09IGluZGV4KSB7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBpZiAoaW5kZXggPj0gbGlzdC5zaXplIHx8IGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuIGxpc3Qud2l0aE11dGF0aW9ucyhmdW5jdGlvbihsaXN0ICkge1xuICAgICAgICBpbmRleCA8IDAgP1xuICAgICAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgaW5kZXgpLnNldCgwLCB2YWx1ZSkgOlxuICAgICAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgMCwgaW5kZXggKyAxKS5zZXQoaW5kZXgsIHZhbHVlKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5kZXggKz0gbGlzdC5fb3JpZ2luO1xuXG4gICAgdmFyIG5ld1RhaWwgPSBsaXN0Ll90YWlsO1xuICAgIHZhciBuZXdSb290ID0gbGlzdC5fcm9vdDtcbiAgICB2YXIgZGlkQWx0ZXIgPSBNYWtlUmVmKERJRF9BTFRFUik7XG4gICAgaWYgKGluZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgICBuZXdUYWlsID0gdXBkYXRlVk5vZGUobmV3VGFpbCwgbGlzdC5fX293bmVySUQsIDAsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdSb290ID0gdXBkYXRlVk5vZGUobmV3Um9vdCwgbGlzdC5fX293bmVySUQsIGxpc3QuX2xldmVsLCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcbiAgICB9XG5cbiAgICBpZiAoIWRpZEFsdGVyLnZhbHVlKSB7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG5cbiAgICBpZiAobGlzdC5fX293bmVySUQpIHtcbiAgICAgIGxpc3QuX3Jvb3QgPSBuZXdSb290O1xuICAgICAgbGlzdC5fdGFpbCA9IG5ld1RhaWw7XG4gICAgICBsaXN0Ll9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIGxpc3QuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cbiAgICByZXR1cm4gbWFrZUxpc3QobGlzdC5fb3JpZ2luLCBsaXN0Ll9jYXBhY2l0eSwgbGlzdC5fbGV2ZWwsIG5ld1Jvb3QsIG5ld1RhaWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlVk5vZGUobm9kZSwgb3duZXJJRCwgbGV2ZWwsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpIHtcbiAgICB2YXIgaWR4ID0gKGluZGV4ID4+PiBsZXZlbCkgJiBNQVNLO1xuICAgIHZhciBub2RlSGFzID0gbm9kZSAmJiBpZHggPCBub2RlLmFycmF5Lmxlbmd0aDtcbiAgICBpZiAoIW5vZGVIYXMgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgdmFyIG5ld05vZGU7XG5cbiAgICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgICB2YXIgbG93ZXJOb2RlID0gbm9kZSAmJiBub2RlLmFycmF5W2lkeF07XG4gICAgICB2YXIgbmV3TG93ZXJOb2RlID0gdXBkYXRlVk5vZGUobG93ZXJOb2RlLCBvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcbiAgICAgIGlmIChuZXdMb3dlck5vZGUgPT09IGxvd2VyTm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH1cbiAgICAgIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuICAgICAgbmV3Tm9kZS5hcnJheVtpZHhdID0gbmV3TG93ZXJOb2RlO1xuICAgICAgcmV0dXJuIG5ld05vZGU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGVIYXMgJiYgbm9kZS5hcnJheVtpZHhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgU2V0UmVmKGRpZEFsdGVyKTtcblxuICAgIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIGlkeCA9PT0gbmV3Tm9kZS5hcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICBuZXdOb2RlLmFycmF5LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdOb2RlLmFycmF5W2lkeF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld05vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpIHtcbiAgICBpZiAob3duZXJJRCAmJiBub2RlICYmIG93bmVySUQgPT09IG5vZGUub3duZXJJRCkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVk5vZGUobm9kZSA/IG5vZGUuYXJyYXkuc2xpY2UoKSA6IFtdLCBvd25lcklEKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxpc3ROb2RlRm9yKGxpc3QsIHJhd0luZGV4KSB7XG4gICAgaWYgKHJhd0luZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgICByZXR1cm4gbGlzdC5fdGFpbDtcbiAgICB9XG4gICAgaWYgKHJhd0luZGV4IDwgMSA8PCAobGlzdC5fbGV2ZWwgKyBTSElGVCkpIHtcbiAgICAgIHZhciBub2RlID0gbGlzdC5fcm9vdDtcbiAgICAgIHZhciBsZXZlbCA9IGxpc3QuX2xldmVsO1xuICAgICAgd2hpbGUgKG5vZGUgJiYgbGV2ZWwgPiAwKSB7XG4gICAgICAgIG5vZGUgPSBub2RlLmFycmF5WyhyYXdJbmRleCA+Pj4gbGV2ZWwpICYgTUFTS107XG4gICAgICAgIGxldmVsIC09IFNISUZUO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0TGlzdEJvdW5kcyhsaXN0LCBiZWdpbiwgZW5kKSB7XG4gICAgLy8gU2FuaXRpemUgYmVnaW4gJiBlbmQgdXNpbmcgdGhpcyBzaG9ydGhhbmQgZm9yIFRvSW50MzIoYXJndW1lbnQpXG4gICAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvaW50MzJcbiAgICBpZiAoYmVnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgYmVnaW4gPSBiZWdpbiB8IDA7XG4gICAgfVxuICAgIGlmIChlbmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZW5kID0gZW5kIHwgMDtcbiAgICB9XG4gICAgdmFyIG93bmVyID0gbGlzdC5fX293bmVySUQgfHwgbmV3IE93bmVySUQoKTtcbiAgICB2YXIgb2xkT3JpZ2luID0gbGlzdC5fb3JpZ2luO1xuICAgIHZhciBvbGRDYXBhY2l0eSA9IGxpc3QuX2NhcGFjaXR5O1xuICAgIHZhciBuZXdPcmlnaW4gPSBvbGRPcmlnaW4gKyBiZWdpbjtcbiAgICB2YXIgbmV3Q2FwYWNpdHkgPSBlbmQgPT09IHVuZGVmaW5lZCA/IG9sZENhcGFjaXR5IDogZW5kIDwgMCA/IG9sZENhcGFjaXR5ICsgZW5kIDogb2xkT3JpZ2luICsgZW5kO1xuICAgIGlmIChuZXdPcmlnaW4gPT09IG9sZE9yaWdpbiAmJiBuZXdDYXBhY2l0eSA9PT0gb2xkQ2FwYWNpdHkpIHtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIC8vIElmIGl0J3MgZ29pbmcgdG8gZW5kIGFmdGVyIGl0IHN0YXJ0cywgaXQncyBlbXB0eS5cbiAgICBpZiAobmV3T3JpZ2luID49IG5ld0NhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gbGlzdC5jbGVhcigpO1xuICAgIH1cblxuICAgIHZhciBuZXdMZXZlbCA9IGxpc3QuX2xldmVsO1xuICAgIHZhciBuZXdSb290ID0gbGlzdC5fcm9vdDtcblxuICAgIC8vIE5ldyBvcmlnaW4gbWlnaHQgbmVlZCBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICAgIHZhciBvZmZzZXRTaGlmdCA9IDA7XG4gICAgd2hpbGUgKG5ld09yaWdpbiArIG9mZnNldFNoaWZ0IDwgMCkge1xuICAgICAgbmV3Um9vdCA9IG5ldyBWTm9kZShuZXdSb290ICYmIG5ld1Jvb3QuYXJyYXkubGVuZ3RoID8gW3VuZGVmaW5lZCwgbmV3Um9vdF0gOiBbXSwgb3duZXIpO1xuICAgICAgbmV3TGV2ZWwgKz0gU0hJRlQ7XG4gICAgICBvZmZzZXRTaGlmdCArPSAxIDw8IG5ld0xldmVsO1xuICAgIH1cbiAgICBpZiAob2Zmc2V0U2hpZnQpIHtcbiAgICAgIG5ld09yaWdpbiArPSBvZmZzZXRTaGlmdDtcbiAgICAgIG9sZE9yaWdpbiArPSBvZmZzZXRTaGlmdDtcbiAgICAgIG5ld0NhcGFjaXR5ICs9IG9mZnNldFNoaWZ0O1xuICAgICAgb2xkQ2FwYWNpdHkgKz0gb2Zmc2V0U2hpZnQ7XG4gICAgfVxuXG4gICAgdmFyIG9sZFRhaWxPZmZzZXQgPSBnZXRUYWlsT2Zmc2V0KG9sZENhcGFjaXR5KTtcbiAgICB2YXIgbmV3VGFpbE9mZnNldCA9IGdldFRhaWxPZmZzZXQobmV3Q2FwYWNpdHkpO1xuXG4gICAgLy8gTmV3IHNpemUgbWlnaHQgbmVlZCBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICAgIHdoaWxlIChuZXdUYWlsT2Zmc2V0ID49IDEgPDwgKG5ld0xldmVsICsgU0hJRlQpKSB7XG4gICAgICBuZXdSb290ID0gbmV3IFZOb2RlKG5ld1Jvb3QgJiYgbmV3Um9vdC5hcnJheS5sZW5ndGggPyBbbmV3Um9vdF0gOiBbXSwgb3duZXIpO1xuICAgICAgbmV3TGV2ZWwgKz0gU0hJRlQ7XG4gICAgfVxuXG4gICAgLy8gTG9jYXRlIG9yIGNyZWF0ZSB0aGUgbmV3IHRhaWwuXG4gICAgdmFyIG9sZFRhaWwgPSBsaXN0Ll90YWlsO1xuICAgIHZhciBuZXdUYWlsID0gbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXQgP1xuICAgICAgbGlzdE5vZGVGb3IobGlzdCwgbmV3Q2FwYWNpdHkgLSAxKSA6XG4gICAgICBuZXdUYWlsT2Zmc2V0ID4gb2xkVGFpbE9mZnNldCA/IG5ldyBWTm9kZShbXSwgb3duZXIpIDogb2xkVGFpbDtcblxuICAgIC8vIE1lcmdlIFRhaWwgaW50byB0cmVlLlxuICAgIGlmIChvbGRUYWlsICYmIG5ld1RhaWxPZmZzZXQgPiBvbGRUYWlsT2Zmc2V0ICYmIG5ld09yaWdpbiA8IG9sZENhcGFjaXR5ICYmIG9sZFRhaWwuYXJyYXkubGVuZ3RoKSB7XG4gICAgICBuZXdSb290ID0gZWRpdGFibGVWTm9kZShuZXdSb290LCBvd25lcik7XG4gICAgICB2YXIgbm9kZSA9IG5ld1Jvb3Q7XG4gICAgICBmb3IgKHZhciBsZXZlbCA9IG5ld0xldmVsOyBsZXZlbCA+IFNISUZUOyBsZXZlbCAtPSBTSElGVCkge1xuICAgICAgICB2YXIgaWR4ID0gKG9sZFRhaWxPZmZzZXQgPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICAgIG5vZGUgPSBub2RlLmFycmF5W2lkeF0gPSBlZGl0YWJsZVZOb2RlKG5vZGUuYXJyYXlbaWR4XSwgb3duZXIpO1xuICAgICAgfVxuICAgICAgbm9kZS5hcnJheVsob2xkVGFpbE9mZnNldCA+Pj4gU0hJRlQpICYgTUFTS10gPSBvbGRUYWlsO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBzaXplIGhhcyBiZWVuIHJlZHVjZWQsIHRoZXJlJ3MgYSBjaGFuY2UgdGhlIHRhaWwgbmVlZHMgdG8gYmUgdHJpbW1lZC5cbiAgICBpZiAobmV3Q2FwYWNpdHkgPCBvbGRDYXBhY2l0eSkge1xuICAgICAgbmV3VGFpbCA9IG5ld1RhaWwgJiYgbmV3VGFpbC5yZW1vdmVBZnRlcihvd25lciwgMCwgbmV3Q2FwYWNpdHkpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBuZXcgb3JpZ2luIGlzIHdpdGhpbiB0aGUgdGFpbCwgdGhlbiB3ZSBkbyBub3QgbmVlZCBhIHJvb3QuXG4gICAgaWYgKG5ld09yaWdpbiA+PSBuZXdUYWlsT2Zmc2V0KSB7XG4gICAgICBuZXdPcmlnaW4gLT0gbmV3VGFpbE9mZnNldDtcbiAgICAgIG5ld0NhcGFjaXR5IC09IG5ld1RhaWxPZmZzZXQ7XG4gICAgICBuZXdMZXZlbCA9IFNISUZUO1xuICAgICAgbmV3Um9vdCA9IG51bGw7XG4gICAgICBuZXdUYWlsID0gbmV3VGFpbCAmJiBuZXdUYWlsLnJlbW92ZUJlZm9yZShvd25lciwgMCwgbmV3T3JpZ2luKTtcblxuICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlIHJvb3QgaGFzIGJlZW4gdHJpbW1lZCwgZ2FyYmFnZSBjb2xsZWN0LlxuICAgIH0gZWxzZSBpZiAobmV3T3JpZ2luID4gb2xkT3JpZ2luIHx8IG5ld1RhaWxPZmZzZXQgPCBvbGRUYWlsT2Zmc2V0KSB7XG4gICAgICBvZmZzZXRTaGlmdCA9IDA7XG5cbiAgICAgIC8vIElkZW50aWZ5IHRoZSBuZXcgdG9wIHJvb3Qgbm9kZSBvZiB0aGUgc3VidHJlZSBvZiB0aGUgb2xkIHJvb3QuXG4gICAgICB3aGlsZSAobmV3Um9vdCkge1xuICAgICAgICB2YXIgYmVnaW5JbmRleCA9IChuZXdPcmlnaW4gPj4+IG5ld0xldmVsKSAmIE1BU0s7XG4gICAgICAgIGlmIChiZWdpbkluZGV4ICE9PSAobmV3VGFpbE9mZnNldCA+Pj4gbmV3TGV2ZWwpICYgTUFTSykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiZWdpbkluZGV4KSB7XG4gICAgICAgICAgb2Zmc2V0U2hpZnQgKz0gKDEgPDwgbmV3TGV2ZWwpICogYmVnaW5JbmRleDtcbiAgICAgICAgfVxuICAgICAgICBuZXdMZXZlbCAtPSBTSElGVDtcbiAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QuYXJyYXlbYmVnaW5JbmRleF07XG4gICAgICB9XG5cbiAgICAgIC8vIFRyaW0gdGhlIG5ldyBzaWRlcyBvZiB0aGUgbmV3IHJvb3QuXG4gICAgICBpZiAobmV3Um9vdCAmJiBuZXdPcmlnaW4gPiBvbGRPcmlnaW4pIHtcbiAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QucmVtb3ZlQmVmb3JlKG93bmVyLCBuZXdMZXZlbCwgbmV3T3JpZ2luIC0gb2Zmc2V0U2hpZnQpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld1Jvb3QgJiYgbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXQpIHtcbiAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QucmVtb3ZlQWZ0ZXIob3duZXIsIG5ld0xldmVsLCBuZXdUYWlsT2Zmc2V0IC0gb2Zmc2V0U2hpZnQpO1xuICAgICAgfVxuICAgICAgaWYgKG9mZnNldFNoaWZ0KSB7XG4gICAgICAgIG5ld09yaWdpbiAtPSBvZmZzZXRTaGlmdDtcbiAgICAgICAgbmV3Q2FwYWNpdHkgLT0gb2Zmc2V0U2hpZnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxpc3QuX19vd25lcklEKSB7XG4gICAgICBsaXN0LnNpemUgPSBuZXdDYXBhY2l0eSAtIG5ld09yaWdpbjtcbiAgICAgIGxpc3QuX29yaWdpbiA9IG5ld09yaWdpbjtcbiAgICAgIGxpc3QuX2NhcGFjaXR5ID0gbmV3Q2FwYWNpdHk7XG4gICAgICBsaXN0Ll9sZXZlbCA9IG5ld0xldmVsO1xuICAgICAgbGlzdC5fcm9vdCA9IG5ld1Jvb3Q7XG4gICAgICBsaXN0Ll90YWlsID0gbmV3VGFpbDtcbiAgICAgIGxpc3QuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgbGlzdC5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuICAgIHJldHVybiBtYWtlTGlzdChuZXdPcmlnaW4sIG5ld0NhcGFjaXR5LCBuZXdMZXZlbCwgbmV3Um9vdCwgbmV3VGFpbCk7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZUludG9MaXN0V2l0aChsaXN0LCBtZXJnZXIsIGl0ZXJhYmxlcykge1xuICAgIHZhciBpdGVycyA9IFtdO1xuICAgIHZhciBtYXhTaXplID0gMDtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaXRlcmFibGVzLmxlbmd0aDsgaWkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVzW2lpXTtcbiAgICAgIHZhciBpdGVyID0gSW5kZXhlZEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgIGlmIChpdGVyLnNpemUgPiBtYXhTaXplKSB7XG4gICAgICAgIG1heFNpemUgPSBpdGVyLnNpemU7XG4gICAgICB9XG4gICAgICBpZiAoIWlzSXRlcmFibGUodmFsdWUpKSB7XG4gICAgICAgIGl0ZXIgPSBpdGVyLm1hcChmdW5jdGlvbih2ICkge3JldHVybiBmcm9tSlModil9KTtcbiAgICAgIH1cbiAgICAgIGl0ZXJzLnB1c2goaXRlcik7XG4gICAgfVxuICAgIGlmIChtYXhTaXplID4gbGlzdC5zaXplKSB7XG4gICAgICBsaXN0ID0gbGlzdC5zZXRTaXplKG1heFNpemUpO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VJbnRvQ29sbGVjdGlvbldpdGgobGlzdCwgbWVyZ2VyLCBpdGVycyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUYWlsT2Zmc2V0KHNpemUpIHtcbiAgICByZXR1cm4gc2l6ZSA8IFNJWkUgPyAwIDogKCgoc2l6ZSAtIDEpID4+PiBTSElGVCkgPDwgU0hJRlQpO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoT3JkZXJlZE1hcCwgTWFwKTtcblxuICAgIC8vIEBwcmFnbWEgQ29uc3RydWN0aW9uXG5cbiAgICBmdW5jdGlvbiBPcmRlcmVkTWFwKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5T3JkZXJlZE1hcCgpIDpcbiAgICAgICAgaXNPcmRlcmVkTWFwKHZhbHVlKSA/IHZhbHVlIDpcbiAgICAgICAgZW1wdHlPcmRlcmVkTWFwKCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihtYXAgKSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBLZXllZEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbih2LCBrKSAge3JldHVybiBtYXAuc2V0KGssIHYpfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIE9yZGVyZWRNYXAub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnT3JkZXJlZE1hcCB7JywgJ30nKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGssIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgaW5kZXggPSB0aGlzLl9tYXAuZ2V0KGspO1xuICAgICAgcmV0dXJuIGluZGV4ICE9PSB1bmRlZmluZWQgPyB0aGlzLl9saXN0LmdldChpbmRleClbMV0gOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuX21hcC5jbGVhcigpO1xuICAgICAgICB0aGlzLl9saXN0LmNsZWFyKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5T3JkZXJlZE1hcCgpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrLCB2KSB7XG4gICAgICByZXR1cm4gdXBkYXRlT3JkZXJlZE1hcCh0aGlzLCBrLCB2KTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIHVwZGF0ZU9yZGVyZWRNYXAodGhpcywgaywgTk9UX1NFVCk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAud2FzQWx0ZXJlZCgpIHx8IHRoaXMuX2xpc3Qud2FzQWx0ZXJlZCgpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMuX2xpc3QuX19pdGVyYXRlKFxuICAgICAgICBmdW5jdGlvbihlbnRyeSApIHtyZXR1cm4gZW50cnkgJiYgZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzJDApfSxcbiAgICAgICAgcmV2ZXJzZVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9saXN0LmZyb21FbnRyeVNlcSgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG4gICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwLl9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgICB2YXIgbmV3TGlzdCA9IHRoaXMuX2xpc3QuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICAgIGlmICghb3duZXJJRCkge1xuICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgICAgdGhpcy5fbGlzdCA9IG5ld0xpc3Q7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VPcmRlcmVkTWFwKG5ld01hcCwgbmV3TGlzdCwgb3duZXJJRCwgdGhpcy5fX2hhc2gpO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBpc09yZGVyZWRNYXAobWF5YmVPcmRlcmVkTWFwKSB7XG4gICAgcmV0dXJuIGlzTWFwKG1heWJlT3JkZXJlZE1hcCkgJiYgaXNPcmRlcmVkKG1heWJlT3JkZXJlZE1hcCk7XG4gIH1cblxuICBPcmRlcmVkTWFwLmlzT3JkZXJlZE1hcCA9IGlzT3JkZXJlZE1hcDtcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZVtJU19PUkRFUkVEX1NFTlRJTkVMXSA9IHRydWU7XG4gIE9yZGVyZWRNYXAucHJvdG90eXBlW0RFTEVURV0gPSBPcmRlcmVkTWFwLnByb3RvdHlwZS5yZW1vdmU7XG5cblxuXG4gIGZ1bmN0aW9uIG1ha2VPcmRlcmVkTWFwKG1hcCwgbGlzdCwgb3duZXJJRCwgaGFzaCkge1xuICAgIHZhciBvbWFwID0gT2JqZWN0LmNyZWF0ZShPcmRlcmVkTWFwLnByb3RvdHlwZSk7XG4gICAgb21hcC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuICAgIG9tYXAuX21hcCA9IG1hcDtcbiAgICBvbWFwLl9saXN0ID0gbGlzdDtcbiAgICBvbWFwLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgb21hcC5fX2hhc2ggPSBoYXNoO1xuICAgIHJldHVybiBvbWFwO1xuICB9XG5cbiAgdmFyIEVNUFRZX09SREVSRURfTUFQO1xuICBmdW5jdGlvbiBlbXB0eU9yZGVyZWRNYXAoKSB7XG4gICAgcmV0dXJuIEVNUFRZX09SREVSRURfTUFQIHx8IChFTVBUWV9PUkRFUkVEX01BUCA9IG1ha2VPcmRlcmVkTWFwKGVtcHR5TWFwKCksIGVtcHR5TGlzdCgpKSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVPcmRlcmVkTWFwKG9tYXAsIGssIHYpIHtcbiAgICB2YXIgbWFwID0gb21hcC5fbWFwO1xuICAgIHZhciBsaXN0ID0gb21hcC5fbGlzdDtcbiAgICB2YXIgaSA9IG1hcC5nZXQoayk7XG4gICAgdmFyIGhhcyA9IGkgIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgbmV3TWFwO1xuICAgIHZhciBuZXdMaXN0O1xuICAgIGlmICh2ID09PSBOT1RfU0VUKSB7IC8vIHJlbW92ZWRcbiAgICAgIGlmICghaGFzKSB7XG4gICAgICAgIHJldHVybiBvbWFwO1xuICAgICAgfVxuICAgICAgaWYgKGxpc3Quc2l6ZSA+PSBTSVpFICYmIGxpc3Quc2l6ZSA+PSBtYXAuc2l6ZSAqIDIpIHtcbiAgICAgICAgbmV3TGlzdCA9IGxpc3QuZmlsdGVyKGZ1bmN0aW9uKGVudHJ5LCBpZHgpICB7cmV0dXJuIGVudHJ5ICE9PSB1bmRlZmluZWQgJiYgaSAhPT0gaWR4fSk7XG4gICAgICAgIG5ld01hcCA9IG5ld0xpc3QudG9LZXllZFNlcSgpLm1hcChmdW5jdGlvbihlbnRyeSApIHtyZXR1cm4gZW50cnlbMF19KS5mbGlwKCkudG9NYXAoKTtcbiAgICAgICAgaWYgKG9tYXAuX19vd25lcklEKSB7XG4gICAgICAgICAgbmV3TWFwLl9fb3duZXJJRCA9IG5ld0xpc3QuX19vd25lcklEID0gb21hcC5fX293bmVySUQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld01hcCA9IG1hcC5yZW1vdmUoayk7XG4gICAgICAgIG5ld0xpc3QgPSBpID09PSBsaXN0LnNpemUgLSAxID8gbGlzdC5wb3AoKSA6IGxpc3Quc2V0KGksIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChoYXMpIHtcbiAgICAgICAgaWYgKHYgPT09IGxpc3QuZ2V0KGkpWzFdKSB7XG4gICAgICAgICAgcmV0dXJuIG9tYXA7XG4gICAgICAgIH1cbiAgICAgICAgbmV3TWFwID0gbWFwO1xuICAgICAgICBuZXdMaXN0ID0gbGlzdC5zZXQoaSwgW2ssIHZdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld01hcCA9IG1hcC5zZXQoaywgbGlzdC5zaXplKTtcbiAgICAgICAgbmV3TGlzdCA9IGxpc3Quc2V0KGxpc3Quc2l6ZSwgW2ssIHZdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9tYXAuX19vd25lcklEKSB7XG4gICAgICBvbWFwLnNpemUgPSBuZXdNYXAuc2l6ZTtcbiAgICAgIG9tYXAuX21hcCA9IG5ld01hcDtcbiAgICAgIG9tYXAuX2xpc3QgPSBuZXdMaXN0O1xuICAgICAgb21hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm4gb21hcDtcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VPcmRlcmVkTWFwKG5ld01hcCwgbmV3TGlzdCk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhUb0tleWVkU2VxdWVuY2UsIEtleWVkU2VxKTtcbiAgICBmdW5jdGlvbiBUb0tleWVkU2VxdWVuY2UoaW5kZXhlZCwgdXNlS2V5cykge1xuICAgICAgdGhpcy5faXRlciA9IGluZGV4ZWQ7XG4gICAgICB0aGlzLl91c2VLZXlzID0gdXNlS2V5cztcbiAgICAgIHRoaXMuc2l6ZSA9IGluZGV4ZWQuc2l6ZTtcbiAgICB9XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmdldChrZXksIG5vdFNldFZhbHVlKTtcbiAgICB9O1xuXG4gICAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmhhcyhrZXkpO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLnZhbHVlU2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci52YWx1ZVNlcSgpO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciByZXZlcnNlZFNlcXVlbmNlID0gcmV2ZXJzZUZhY3RvcnkodGhpcywgdHJ1ZSk7XG4gICAgICBpZiAoIXRoaXMuX3VzZUtleXMpIHtcbiAgICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS52YWx1ZVNlcSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gdGhpcyQwLl9pdGVyLnRvU2VxKCkucmV2ZXJzZSgpfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIG1hcHBlZFNlcXVlbmNlID0gbWFwRmFjdG9yeSh0aGlzLCBtYXBwZXIsIGNvbnRleHQpO1xuICAgICAgaWYgKCF0aGlzLl91c2VLZXlzKSB7XG4gICAgICAgIG1hcHBlZFNlcXVlbmNlLnZhbHVlU2VxID0gZnVuY3Rpb24oKSAge3JldHVybiB0aGlzJDAuX2l0ZXIudG9TZXEoKS5tYXAobWFwcGVyLCBjb250ZXh0KX07XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwcGVkU2VxdWVuY2U7XG4gICAgfTtcblxuICAgIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciBpaTtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0ZShcbiAgICAgICAgdGhpcy5fdXNlS2V5cyA/XG4gICAgICAgICAgZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gZm4odiwgaywgdGhpcyQwKX0gOlxuICAgICAgICAgICgoaWkgPSByZXZlcnNlID8gcmVzb2x2ZVNpemUodGhpcykgOiAwKSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZuKHYsIHJldmVyc2UgPyAtLWlpIDogaWkrKywgdGhpcyQwKX0pLFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAodGhpcy5fdXNlS2V5cykge1xuICAgICAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpaSA9IHJldmVyc2UgPyByZXNvbHZlU2l6ZSh0aGlzKSA6IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBzdGVwLmRvbmUgPyBzdGVwIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIHJldmVyc2UgPyAtLWlpIDogaWkrKywgc3RlcC52YWx1ZSwgc3RlcCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGVbSVNfT1JERVJFRF9TRU5USU5FTF0gPSB0cnVlO1xuXG5cbiAgY3JlYXRlQ2xhc3MoVG9JbmRleGVkU2VxdWVuY2UsIEluZGV4ZWRTZXEpO1xuICAgIGZ1bmN0aW9uIFRvSW5kZXhlZFNlcXVlbmNlKGl0ZXIpIHtcbiAgICAgIHRoaXMuX2l0ZXIgPSBpdGVyO1xuICAgICAgdGhpcy5zaXplID0gaXRlci5zaXplO1xuICAgIH1cblxuICAgIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci5pbmNsdWRlcyh2YWx1ZSk7XG4gICAgfTtcblxuICAgIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZuKHYsIGl0ZXJhdGlvbnMrKywgdGhpcyQwKX0sIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBUb0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXIuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBzdGVwLmRvbmUgPyBzdGVwIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSwgc3RlcClcbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKFRvU2V0U2VxdWVuY2UsIFNldFNlcSk7XG4gICAgZnVuY3Rpb24gVG9TZXRTZXF1ZW5jZShpdGVyKSB7XG4gICAgICB0aGlzLl9pdGVyID0gaXRlcjtcbiAgICAgIHRoaXMuc2l6ZSA9IGl0ZXIuc2l6ZTtcbiAgICB9XG5cbiAgICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmluY2x1ZGVzKGtleSk7XG4gICAgfTtcblxuICAgIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24odiApIHtyZXR1cm4gZm4odiwgdiwgdGhpcyQwKX0sIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOlxuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgc3RlcC52YWx1ZSwgc3RlcC52YWx1ZSwgc3RlcCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuICBjcmVhdGVDbGFzcyhGcm9tRW50cmllc1NlcXVlbmNlLCBLZXllZFNlcSk7XG4gICAgZnVuY3Rpb24gRnJvbUVudHJpZXNTZXF1ZW5jZShlbnRyaWVzKSB7XG4gICAgICB0aGlzLl9pdGVyID0gZW50cmllcztcbiAgICAgIHRoaXMuc2l6ZSA9IGVudHJpZXMuc2l6ZTtcbiAgICB9XG5cbiAgICBGcm9tRW50cmllc1NlcXVlbmNlLnByb3RvdHlwZS5lbnRyeVNlcSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIudG9TZXEoKTtcbiAgICB9O1xuXG4gICAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0ZShmdW5jdGlvbihlbnRyeSApIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZW50cnkgZXhpc3RzIGZpcnN0IHNvIGFycmF5IGFjY2VzcyBkb2Vzbid0IHRocm93IGZvciBob2xlc1xuICAgICAgICAvLyBpbiB0aGUgcGFyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFsaWRhdGVFbnRyeShlbnRyeSk7XG4gICAgICAgICAgdmFyIGluZGV4ZWRJdGVyYWJsZSA9IGlzSXRlcmFibGUoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBmbihcbiAgICAgICAgICAgIGluZGV4ZWRJdGVyYWJsZSA/IGVudHJ5LmdldCgxKSA6IGVudHJ5WzFdLFxuICAgICAgICAgICAgaW5kZXhlZEl0ZXJhYmxlID8gZW50cnkuZ2V0KDApIDogZW50cnlbMF0sXG4gICAgICAgICAgICB0aGlzJDBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXIuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAvLyBDaGVjayBpZiBlbnRyeSBleGlzdHMgZmlyc3Qgc28gYXJyYXkgYWNjZXNzIGRvZXNuJ3QgdGhyb3cgZm9yIGhvbGVzXG4gICAgICAgICAgLy8gaW4gdGhlIHBhcmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICAgIHZhciBpbmRleGVkSXRlcmFibGUgPSBpc0l0ZXJhYmxlKGVudHJ5KTtcbiAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKFxuICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICBpbmRleGVkSXRlcmFibGUgPyBlbnRyeS5nZXQoMCkgOiBlbnRyeVswXSxcbiAgICAgICAgICAgICAgaW5kZXhlZEl0ZXJhYmxlID8gZW50cnkuZ2V0KDEpIDogZW50cnlbMV0sXG4gICAgICAgICAgICAgIHN0ZXBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPVxuICAgIGNhY2hlUmVzdWx0VGhyb3VnaDtcblxuXG4gIGZ1bmN0aW9uIGZsaXBGYWN0b3J5KGl0ZXJhYmxlKSB7XG4gICAgdmFyIGZsaXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgZmxpcFNlcXVlbmNlLl9pdGVyID0gaXRlcmFibGU7XG4gICAgZmxpcFNlcXVlbmNlLnNpemUgPSBpdGVyYWJsZS5zaXplO1xuICAgIGZsaXBTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZX07XG4gICAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmV2ZXJzZWRTZXF1ZW5jZSA9IGl0ZXJhYmxlLnJldmVyc2UuYXBwbHkodGhpcyk7IC8vIHN1cGVyLnJldmVyc2UoKVxuICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZS5yZXZlcnNlKCl9O1xuICAgICAgcmV0dXJuIHJldmVyc2VkU2VxdWVuY2U7XG4gICAgfTtcbiAgICBmbGlwU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24oa2V5ICkge3JldHVybiBpdGVyYWJsZS5pbmNsdWRlcyhrZXkpfTtcbiAgICBmbGlwU2VxdWVuY2UuaW5jbHVkZXMgPSBmdW5jdGlvbihrZXkgKSB7cmV0dXJuIGl0ZXJhYmxlLmhhcyhrZXkpfTtcbiAgICBmbGlwU2VxdWVuY2UuY2FjaGVSZXN1bHQgPSBjYWNoZVJlc3VsdFRocm91Z2g7XG4gICAgZmxpcFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZuKGssIHYsIHRoaXMkMCkgIT09IGZhbHNlfSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIGZsaXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTKSB7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmICghc3RlcC5kb25lKSB7XG4gICAgICAgICAgICB2YXIgayA9IHN0ZXAudmFsdWVbMF07XG4gICAgICAgICAgICBzdGVwLnZhbHVlWzBdID0gc3RlcC52YWx1ZVsxXTtcbiAgICAgICAgICAgIHN0ZXAudmFsdWVbMV0gPSBrO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRvcihcbiAgICAgICAgdHlwZSA9PT0gSVRFUkFURV9WQUxVRVMgPyBJVEVSQVRFX0tFWVMgOiBJVEVSQVRFX1ZBTFVFUyxcbiAgICAgICAgcmV2ZXJzZVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGZsaXBTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gbWFwRmFjdG9yeShpdGVyYWJsZSwgbWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIG1hcHBlZFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICBtYXBwZWRTZXF1ZW5jZS5zaXplID0gaXRlcmFibGUuc2l6ZTtcbiAgICBtYXBwZWRTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbihrZXkgKSB7cmV0dXJuIGl0ZXJhYmxlLmhhcyhrZXkpfTtcbiAgICBtYXBwZWRTZXF1ZW5jZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSAge1xuICAgICAgdmFyIHYgPSBpdGVyYWJsZS5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICAgIHJldHVybiB2ID09PSBOT1RfU0VUID9cbiAgICAgICAgbm90U2V0VmFsdWUgOlxuICAgICAgICBtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrZXksIGl0ZXJhYmxlKTtcbiAgICB9O1xuICAgIG1hcHBlZFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKFxuICAgICAgICBmdW5jdGlvbih2LCBrLCBjKSAge3JldHVybiBmbihtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBjKSwgaywgdGhpcyQwKSAhPT0gZmFsc2V9LFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH1cbiAgICBtYXBwZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgdmFyIGtleSA9IGVudHJ5WzBdO1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIGtleSxcbiAgICAgICAgICBtYXBwZXIuY2FsbChjb250ZXh0LCBlbnRyeVsxXSwga2V5LCBpdGVyYWJsZSksXG4gICAgICAgICAgc3RlcFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gcmV2ZXJzZUZhY3RvcnkoaXRlcmFibGUsIHVzZUtleXMpIHtcbiAgICB2YXIgcmV2ZXJzZWRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5faXRlciA9IGl0ZXJhYmxlO1xuICAgIHJldmVyc2VkU2VxdWVuY2Uuc2l6ZSA9IGl0ZXJhYmxlLnNpemU7XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5yZXZlcnNlID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZX07XG4gICAgaWYgKGl0ZXJhYmxlLmZsaXApIHtcbiAgICAgIHJldmVyc2VkU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZsaXBTZXF1ZW5jZSA9IGZsaXBGYWN0b3J5KGl0ZXJhYmxlKTtcbiAgICAgICAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbigpICB7cmV0dXJuIGl0ZXJhYmxlLmZsaXAoKX07XG4gICAgICAgIHJldHVybiBmbGlwU2VxdWVuY2U7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXZlcnNlZFNlcXVlbmNlLmdldCA9IGZ1bmN0aW9uKGtleSwgbm90U2V0VmFsdWUpIFxuICAgICAge3JldHVybiBpdGVyYWJsZS5nZXQodXNlS2V5cyA/IGtleSA6IC0xIC0ga2V5LCBub3RTZXRWYWx1ZSl9O1xuICAgIHJldmVyc2VkU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24oa2V5IClcbiAgICAgIHtyZXR1cm4gaXRlcmFibGUuaGFzKHVzZUtleXMgPyBrZXkgOiAtMSAtIGtleSl9O1xuICAgIHJldmVyc2VkU2VxdWVuY2UuaW5jbHVkZXMgPSBmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXRlcmFibGUuaW5jbHVkZXModmFsdWUpfTtcbiAgICByZXZlcnNlZFNlcXVlbmNlLmNhY2hlUmVzdWx0ID0gY2FjaGVSZXN1bHRUaHJvdWdoO1xuICAgIHJldmVyc2VkU2VxdWVuY2UuX19pdGVyYXRlID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZuKHYsIGssIHRoaXMkMCl9LCAhcmV2ZXJzZSk7XG4gICAgfTtcbiAgICByZXZlcnNlZFNlcXVlbmNlLl9faXRlcmF0b3IgPVxuICAgICAgZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkgIHtyZXR1cm4gaXRlcmFibGUuX19pdGVyYXRvcih0eXBlLCAhcmV2ZXJzZSl9O1xuICAgIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBmaWx0ZXJGYWN0b3J5KGl0ZXJhYmxlLCBwcmVkaWNhdGUsIGNvbnRleHQsIHVzZUtleXMpIHtcbiAgICB2YXIgZmlsdGVyU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIGlmICh1c2VLZXlzKSB7XG4gICAgICBmaWx0ZXJTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbihrZXkgKSB7XG4gICAgICAgIHZhciB2ID0gaXRlcmFibGUuZ2V0KGtleSwgTk9UX1NFVCk7XG4gICAgICAgIHJldHVybiB2ICE9PSBOT1RfU0VUICYmICEhcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwga2V5LCBpdGVyYWJsZSk7XG4gICAgICB9O1xuICAgICAgZmlsdGVyU2VxdWVuY2UuZ2V0ID0gZnVuY3Rpb24oa2V5LCBub3RTZXRWYWx1ZSkgIHtcbiAgICAgICAgdmFyIHYgPSBpdGVyYWJsZS5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICAgICAgcmV0dXJuIHYgIT09IE5PVF9TRVQgJiYgcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwga2V5LCBpdGVyYWJsZSkgP1xuICAgICAgICAgIHYgOiBub3RTZXRWYWx1ZTtcbiAgICAgIH07XG4gICAgfVxuICAgIGZpbHRlclNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSB7XG4gICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDApO1xuICAgICAgICB9XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG4gICAgZmlsdGVyU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24gKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgIHZhciBrZXkgPSBlbnRyeVswXTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBlbnRyeVsxXTtcbiAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgaXRlcmFibGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCB1c2VLZXlzID8ga2V5IDogaXRlcmF0aW9ucysrLCB2YWx1ZSwgc3RlcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbHRlclNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBjb3VudEJ5RmFjdG9yeShpdGVyYWJsZSwgZ3JvdXBlciwgY29udGV4dCkge1xuICAgIHZhciBncm91cHMgPSBNYXAoKS5hc011dGFibGUoKTtcbiAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgIGdyb3Vwcy51cGRhdGUoXG4gICAgICAgIGdyb3VwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBpdGVyYWJsZSksXG4gICAgICAgIDAsXG4gICAgICAgIGZ1bmN0aW9uKGEgKSB7cmV0dXJuIGEgKyAxfVxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZ3JvdXBzLmFzSW1tdXRhYmxlKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGdyb3VwQnlGYWN0b3J5KGl0ZXJhYmxlLCBncm91cGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIGlzS2V5ZWRJdGVyID0gaXNLZXllZChpdGVyYWJsZSk7XG4gICAgdmFyIGdyb3VwcyA9IChpc09yZGVyZWQoaXRlcmFibGUpID8gT3JkZXJlZE1hcCgpIDogTWFwKCkpLmFzTXV0YWJsZSgpO1xuICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge1xuICAgICAgZ3JvdXBzLnVwZGF0ZShcbiAgICAgICAgZ3JvdXBlci5jYWxsKGNvbnRleHQsIHYsIGssIGl0ZXJhYmxlKSxcbiAgICAgICAgZnVuY3Rpb24oYSApIHtyZXR1cm4gKGEgPSBhIHx8IFtdLCBhLnB1c2goaXNLZXllZEl0ZXIgPyBbaywgdl0gOiB2KSwgYSl9XG4gICAgICApO1xuICAgIH0pO1xuICAgIHZhciBjb2VyY2UgPSBpdGVyYWJsZUNsYXNzKGl0ZXJhYmxlKTtcbiAgICByZXR1cm4gZ3JvdXBzLm1hcChmdW5jdGlvbihhcnIgKSB7cmV0dXJuIHJlaWZ5KGl0ZXJhYmxlLCBjb2VyY2UoYXJyKSl9KTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gc2xpY2VGYWN0b3J5KGl0ZXJhYmxlLCBiZWdpbiwgZW5kLCB1c2VLZXlzKSB7XG4gICAgdmFyIG9yaWdpbmFsU2l6ZSA9IGl0ZXJhYmxlLnNpemU7XG5cbiAgICAvLyBTYW5pdGl6ZSBiZWdpbiAmIGVuZCB1c2luZyB0aGlzIHNob3J0aGFuZCBmb3IgVG9JbnQzMihhcmd1bWVudClcbiAgICAvLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9pbnQzMlxuICAgIGlmIChiZWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBiZWdpbiA9IGJlZ2luIHwgMDtcbiAgICB9XG4gICAgaWYgKGVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBlbmQgPSBlbmQgfCAwO1xuICAgIH1cblxuICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIG9yaWdpbmFsU2l6ZSkpIHtcbiAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICB9XG5cbiAgICB2YXIgcmVzb2x2ZWRCZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgb3JpZ2luYWxTaXplKTtcbiAgICB2YXIgcmVzb2x2ZWRFbmQgPSByZXNvbHZlRW5kKGVuZCwgb3JpZ2luYWxTaXplKTtcblxuICAgIC8vIGJlZ2luIG9yIGVuZCB3aWxsIGJlIE5hTiBpZiB0aGV5IHdlcmUgcHJvdmlkZWQgYXMgbmVnYXRpdmUgbnVtYmVycyBhbmRcbiAgICAvLyB0aGlzIGl0ZXJhYmxlJ3Mgc2l6ZSBpcyB1bmtub3duLiBJbiB0aGF0IGNhc2UsIGNhY2hlIGZpcnN0IHNvIHRoZXJlIGlzXG4gICAgLy8gYSBrbm93biBzaXplIGFuZCB0aGVzZSBkbyBub3QgcmVzb2x2ZSB0byBOYU4uXG4gICAgaWYgKHJlc29sdmVkQmVnaW4gIT09IHJlc29sdmVkQmVnaW4gfHwgcmVzb2x2ZWRFbmQgIT09IHJlc29sdmVkRW5kKSB7XG4gICAgICByZXR1cm4gc2xpY2VGYWN0b3J5KGl0ZXJhYmxlLnRvU2VxKCkuY2FjaGVSZXN1bHQoKSwgYmVnaW4sIGVuZCwgdXNlS2V5cyk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogcmVzb2x2ZWRFbmQgaXMgdW5kZWZpbmVkIHdoZW4gdGhlIG9yaWdpbmFsIHNlcXVlbmNlJ3MgbGVuZ3RoIGlzXG4gICAgLy8gdW5rbm93biBhbmQgdGhpcyBzbGljZSBkaWQgbm90IHN1cHBseSBhbiBlbmQgYW5kIHNob3VsZCBjb250YWluIGFsbFxuICAgIC8vIGVsZW1lbnRzIGFmdGVyIHJlc29sdmVkQmVnaW4uXG4gICAgLy8gSW4gdGhhdCBjYXNlLCByZXNvbHZlZFNpemUgd2lsbCBiZSBOYU4gYW5kIHNsaWNlU2l6ZSB3aWxsIHJlbWFpbiB1bmRlZmluZWQuXG4gICAgdmFyIHJlc29sdmVkU2l6ZSA9IHJlc29sdmVkRW5kIC0gcmVzb2x2ZWRCZWdpbjtcbiAgICB2YXIgc2xpY2VTaXplO1xuICAgIGlmIChyZXNvbHZlZFNpemUgPT09IHJlc29sdmVkU2l6ZSkge1xuICAgICAgc2xpY2VTaXplID0gcmVzb2x2ZWRTaXplIDwgMCA/IDAgOiByZXNvbHZlZFNpemU7XG4gICAgfVxuXG4gICAgdmFyIHNsaWNlU2VxID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcblxuICAgIC8vIElmIGl0ZXJhYmxlLnNpemUgaXMgdW5kZWZpbmVkLCB0aGUgc2l6ZSBvZiB0aGUgcmVhbGl6ZWQgc2xpY2VTZXEgaXNcbiAgICAvLyB1bmtub3duIGF0IHRoaXMgcG9pbnQgdW5sZXNzIHRoZSBudW1iZXIgb2YgaXRlbXMgdG8gc2xpY2UgaXMgMFxuICAgIHNsaWNlU2VxLnNpemUgPSBzbGljZVNpemUgPT09IDAgPyBzbGljZVNpemUgOiBpdGVyYWJsZS5zaXplICYmIHNsaWNlU2l6ZSB8fCB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIXVzZUtleXMgJiYgaXNTZXEoaXRlcmFibGUpICYmIHNsaWNlU2l6ZSA+PSAwKSB7XG4gICAgICBzbGljZVNlcS5nZXQgPSBmdW5jdGlvbiAoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCBzbGljZVNpemUgP1xuICAgICAgICAgIGl0ZXJhYmxlLmdldChpbmRleCArIHJlc29sdmVkQmVnaW4sIG5vdFNldFZhbHVlKSA6XG4gICAgICAgICAgbm90U2V0VmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc2xpY2VTZXEuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgaWYgKHNsaWNlU2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBza2lwcGVkID0gMDtcbiAgICAgIHZhciBpc1NraXBwaW5nID0gdHJ1ZTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge1xuICAgICAgICBpZiAoIShpc1NraXBwaW5nICYmIChpc1NraXBwaW5nID0gc2tpcHBlZCsrIDwgcmVzb2x2ZWRCZWdpbikpKSB7XG4gICAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDApICE9PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgICBpdGVyYXRpb25zICE9PSBzbGljZVNpemU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcblxuICAgIHNsaWNlU2VxLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIGlmIChzbGljZVNpemUgIT09IDAgJiYgcmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICAvLyBEb24ndCBib3RoZXIgaW5zdGFudGlhdGluZyBwYXJlbnQgaXRlcmF0b3IgaWYgdGFraW5nIDAuXG4gICAgICB2YXIgaXRlcmF0b3IgPSBzbGljZVNpemUgIT09IDAgJiYgaXRlcmFibGUuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIHZhciBza2lwcGVkID0gMDtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB3aGlsZSAoc2tpcHBlZCsrIDwgcmVzb2x2ZWRCZWdpbikge1xuICAgICAgICAgIGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKytpdGVyYXRpb25zID4gc2xpY2VTaXplKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAodXNlS2V5cyB8fCB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUykge1xuICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IElURVJBVEVfS0VZUykge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMgLSAxLCB1bmRlZmluZWQsIHN0ZXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMgLSAxLCBzdGVwLnZhbHVlWzFdLCBzdGVwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNsaWNlU2VxO1xuICB9XG5cblxuICBmdW5jdGlvbiB0YWtlV2hpbGVGYWN0b3J5KGl0ZXJhYmxlLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgdGFrZVNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICB0YWtlU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpIFxuICAgICAgICB7cmV0dXJuIHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpICYmICsraXRlcmF0aW9ucyAmJiBmbih2LCBrLCB0aGlzJDApfVxuICAgICAgKTtcbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG4gICAgdGFrZVNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpdGVyYXRpbmcgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIGlmICghaXRlcmF0aW5nKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgdmFyIGsgPSBlbnRyeVswXTtcbiAgICAgICAgdmFyIHYgPSBlbnRyeVsxXTtcbiAgICAgICAgaWYgKCFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCB0aGlzJDApKSB7XG4gICAgICAgICAgaXRlcmF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMgPyBzdGVwIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGssIHYsIHN0ZXApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gdGFrZVNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBza2lwV2hpbGVGYWN0b3J5KGl0ZXJhYmxlLCBwcmVkaWNhdGUsIGNvbnRleHQsIHVzZUtleXMpIHtcbiAgICB2YXIgc2tpcFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICBza2lwU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpc1NraXBwaW5nID0gdHJ1ZTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSAge1xuICAgICAgICBpZiAoIShpc1NraXBwaW5nICYmIChpc1NraXBwaW5nID0gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpKSkge1xuICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICByZXR1cm4gZm4odiwgdXNlS2V5cyA/IGsgOiBpdGVyYXRpb25zIC0gMSwgdGhpcyQwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuICAgIHNraXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgc2tpcHBpbmcgPSB0cnVlO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwLCBrLCB2O1xuICAgICAgICBkbyB7XG4gICAgICAgICAgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgICBpZiAodXNlS2V5cyB8fCB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUykge1xuICAgICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgdW5kZWZpbmVkLCBzdGVwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZVsxXSwgc3RlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgayA9IGVudHJ5WzBdO1xuICAgICAgICAgIHYgPSBlbnRyeVsxXTtcbiAgICAgICAgICBza2lwcGluZyAmJiAoc2tpcHBpbmcgPSBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCB0aGlzJDApKTtcbiAgICAgICAgfSB3aGlsZSAoc2tpcHBpbmcpO1xuICAgICAgICByZXR1cm4gdHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTID8gc3RlcCA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBrLCB2LCBzdGVwKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHNraXBTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gY29uY2F0RmFjdG9yeShpdGVyYWJsZSwgdmFsdWVzKSB7XG4gICAgdmFyIGlzS2V5ZWRJdGVyYWJsZSA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuICAgIHZhciBpdGVycyA9IFtpdGVyYWJsZV0uY29uY2F0KHZhbHVlcykubWFwKGZ1bmN0aW9uKHYgKSB7XG4gICAgICBpZiAoIWlzSXRlcmFibGUodikpIHtcbiAgICAgICAgdiA9IGlzS2V5ZWRJdGVyYWJsZSA/XG4gICAgICAgICAga2V5ZWRTZXFGcm9tVmFsdWUodikgOlxuICAgICAgICAgIGluZGV4ZWRTZXFGcm9tVmFsdWUoQXJyYXkuaXNBcnJheSh2KSA/IHYgOiBbdl0pO1xuICAgICAgfSBlbHNlIGlmIChpc0tleWVkSXRlcmFibGUpIHtcbiAgICAgICAgdiA9IEtleWVkSXRlcmFibGUodik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdjtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24odiApIHtyZXR1cm4gdi5zaXplICE9PSAwfSk7XG5cbiAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgfVxuXG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIHNpbmdsZXRvbiA9IGl0ZXJzWzBdO1xuICAgICAgaWYgKHNpbmdsZXRvbiA9PT0gaXRlcmFibGUgfHxcbiAgICAgICAgICBpc0tleWVkSXRlcmFibGUgJiYgaXNLZXllZChzaW5nbGV0b24pIHx8XG4gICAgICAgICAgaXNJbmRleGVkKGl0ZXJhYmxlKSAmJiBpc0luZGV4ZWQoc2luZ2xldG9uKSkge1xuICAgICAgICByZXR1cm4gc2luZ2xldG9uO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjb25jYXRTZXEgPSBuZXcgQXJyYXlTZXEoaXRlcnMpO1xuICAgIGlmIChpc0tleWVkSXRlcmFibGUpIHtcbiAgICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b0tleWVkU2VxKCk7XG4gICAgfSBlbHNlIGlmICghaXNJbmRleGVkKGl0ZXJhYmxlKSkge1xuICAgICAgY29uY2F0U2VxID0gY29uY2F0U2VxLnRvU2V0U2VxKCk7XG4gICAgfVxuICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS5mbGF0dGVuKHRydWUpO1xuICAgIGNvbmNhdFNlcS5zaXplID0gaXRlcnMucmVkdWNlKFxuICAgICAgZnVuY3Rpb24oc3VtLCBzZXEpICB7XG4gICAgICAgIGlmIChzdW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBzaXplID0gc2VxLnNpemU7XG4gICAgICAgICAgaWYgKHNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1bSArIHNpemU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgMFxuICAgICk7XG4gICAgcmV0dXJuIGNvbmNhdFNlcTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gZmxhdHRlbkZhY3RvcnkoaXRlcmFibGUsIGRlcHRoLCB1c2VLZXlzKSB7XG4gICAgdmFyIGZsYXRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgZmxhdFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBzdG9wcGVkID0gZmFsc2U7XG4gICAgICBmdW5jdGlvbiBmbGF0RGVlcChpdGVyLCBjdXJyZW50RGVwdGgpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgICAgaXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgICAgICBpZiAoKCFkZXB0aCB8fCBjdXJyZW50RGVwdGggPCBkZXB0aCkgJiYgaXNJdGVyYWJsZSh2KSkge1xuICAgICAgICAgICAgZmxhdERlZXAodiwgY3VycmVudERlcHRoICsgMSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMrKywgdGhpcyQwKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gIXN0b3BwZWQ7XG4gICAgICAgIH0sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgZmxhdERlZXAoaXRlcmFibGUsIDApO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfVxuICAgIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgdmFyIHN0YWNrID0gW107XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgd2hpbGUgKGl0ZXJhdG9yKSB7XG4gICAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgaWYgKHN0ZXAuZG9uZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHYgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgIGlmICh0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMpIHtcbiAgICAgICAgICAgIHYgPSB2WzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoKCFkZXB0aCB8fCBzdGFjay5sZW5ndGggPCBkZXB0aCkgJiYgaXNJdGVyYWJsZSh2KSkge1xuICAgICAgICAgICAgc3RhY2sucHVzaChpdGVyYXRvcik7XG4gICAgICAgICAgICBpdGVyYXRvciA9IHYuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVzZUtleXMgPyBzdGVwIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHYsIHN0ZXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZsYXRTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gZmxhdE1hcEZhY3RvcnkoaXRlcmFibGUsIG1hcHBlciwgY29udGV4dCkge1xuICAgIHZhciBjb2VyY2UgPSBpdGVyYWJsZUNsYXNzKGl0ZXJhYmxlKTtcbiAgICByZXR1cm4gaXRlcmFibGUudG9TZXEoKS5tYXAoXG4gICAgICBmdW5jdGlvbih2LCBrKSAge3JldHVybiBjb2VyY2UobWFwcGVyLmNhbGwoY29udGV4dCwgdiwgaywgaXRlcmFibGUpKX1cbiAgICApLmZsYXR0ZW4odHJ1ZSk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGludGVycG9zZUZhY3RvcnkoaXRlcmFibGUsIHNlcGFyYXRvcikge1xuICAgIHZhciBpbnRlcnBvc2VkU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIGludGVycG9zZWRTZXF1ZW5jZS5zaXplID0gaXRlcmFibGUuc2l6ZSAmJiBpdGVyYWJsZS5zaXplICogMiAtMTtcbiAgICBpbnRlcnBvc2VkU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspIFxuICAgICAgICB7cmV0dXJuICghaXRlcmF0aW9ucyB8fCBmbihzZXBhcmF0b3IsIGl0ZXJhdGlvbnMrKywgdGhpcyQwKSAhPT0gZmFsc2UpICYmXG4gICAgICAgIGZuKHYsIGl0ZXJhdGlvbnMrKywgdGhpcyQwKSAhPT0gZmFsc2V9LFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcbiAgICBpbnRlcnBvc2VkU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICBpZiAoIXN0ZXAgfHwgaXRlcmF0aW9ucyAlIDIpIHtcbiAgICAgICAgICBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0aW9ucyAlIDIgP1xuICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCBzZXBhcmF0b3IpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSwgc3RlcCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBpbnRlcnBvc2VkU2VxdWVuY2U7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHNvcnRGYWN0b3J5KGl0ZXJhYmxlLCBjb21wYXJhdG9yLCBtYXBwZXIpIHtcbiAgICBpZiAoIWNvbXBhcmF0b3IpIHtcbiAgICAgIGNvbXBhcmF0b3IgPSBkZWZhdWx0Q29tcGFyYXRvcjtcbiAgICB9XG4gICAgdmFyIGlzS2V5ZWRJdGVyYWJsZSA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGVudHJpZXMgPSBpdGVyYWJsZS50b1NlcSgpLm1hcChcbiAgICAgIGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIFtrLCB2LCBpbmRleCsrLCBtYXBwZXIgPyBtYXBwZXIodiwgaywgaXRlcmFibGUpIDogdl19XG4gICAgKS50b0FycmF5KCk7XG4gICAgZW50cmllcy5zb3J0KGZ1bmN0aW9uKGEsIGIpICB7cmV0dXJuIGNvbXBhcmF0b3IoYVszXSwgYlszXSkgfHwgYVsyXSAtIGJbMl19KS5mb3JFYWNoKFxuICAgICAgaXNLZXllZEl0ZXJhYmxlID9cbiAgICAgIGZ1bmN0aW9uKHYsIGkpICB7IGVudHJpZXNbaV0ubGVuZ3RoID0gMjsgfSA6XG4gICAgICBmdW5jdGlvbih2LCBpKSAgeyBlbnRyaWVzW2ldID0gdlsxXTsgfVxuICAgICk7XG4gICAgcmV0dXJuIGlzS2V5ZWRJdGVyYWJsZSA/IEtleWVkU2VxKGVudHJpZXMpIDpcbiAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgPyBJbmRleGVkU2VxKGVudHJpZXMpIDpcbiAgICAgIFNldFNlcShlbnRyaWVzKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gbWF4RmFjdG9yeShpdGVyYWJsZSwgY29tcGFyYXRvciwgbWFwcGVyKSB7XG4gICAgaWYgKCFjb21wYXJhdG9yKSB7XG4gICAgICBjb21wYXJhdG9yID0gZGVmYXVsdENvbXBhcmF0b3I7XG4gICAgfVxuICAgIGlmIChtYXBwZXIpIHtcbiAgICAgIHZhciBlbnRyeSA9IGl0ZXJhYmxlLnRvU2VxKClcbiAgICAgICAgLm1hcChmdW5jdGlvbih2LCBrKSAge3JldHVybiBbdiwgbWFwcGVyKHYsIGssIGl0ZXJhYmxlKV19KVxuICAgICAgICAucmVkdWNlKGZ1bmN0aW9uKGEsIGIpICB7cmV0dXJuIG1heENvbXBhcmUoY29tcGFyYXRvciwgYVsxXSwgYlsxXSkgPyBiIDogYX0pO1xuICAgICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5WzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXRlcmFibGUucmVkdWNlKGZ1bmN0aW9uKGEsIGIpICB7cmV0dXJuIG1heENvbXBhcmUoY29tcGFyYXRvciwgYSwgYikgPyBiIDogYX0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1heENvbXBhcmUoY29tcGFyYXRvciwgYSwgYikge1xuICAgIHZhciBjb21wID0gY29tcGFyYXRvcihiLCBhKTtcbiAgICAvLyBiIGlzIGNvbnNpZGVyZWQgdGhlIG5ldyBtYXggaWYgdGhlIGNvbXBhcmF0b3IgZGVjbGFyZXMgdGhlbSBlcXVhbCwgYnV0XG4gICAgLy8gdGhleSBhcmUgbm90IGVxdWFsIGFuZCBiIGlzIGluIGZhY3QgYSBudWxsaXNoIHZhbHVlLlxuICAgIHJldHVybiAoY29tcCA9PT0gMCAmJiBiICE9PSBhICYmIChiID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiICE9PSBiKSkgfHwgY29tcCA+IDA7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHppcFdpdGhGYWN0b3J5KGtleUl0ZXIsIHppcHBlciwgaXRlcnMpIHtcbiAgICB2YXIgemlwU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2Uoa2V5SXRlcik7XG4gICAgemlwU2VxdWVuY2Uuc2l6ZSA9IG5ldyBBcnJheVNlcShpdGVycykubWFwKGZ1bmN0aW9uKGkgKSB7cmV0dXJuIGkuc2l6ZX0pLm1pbigpO1xuICAgIC8vIE5vdGU6IHRoaXMgYSBnZW5lcmljIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgX19pdGVyYXRlIGluIHRlcm1zIG9mXG4gICAgLy8gX19pdGVyYXRvciB3aGljaCBtYXkgYmUgbW9yZSBnZW5lcmljYWxseSB1c2VmdWwgaW4gdGhlIGZ1dHVyZS5cbiAgICB6aXBTZXF1ZW5jZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgLyogZ2VuZXJpYzpcbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgaWYgKGZuKHN0ZXAudmFsdWVbMV0sIHN0ZXAudmFsdWVbMF0sIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICAgICovXG4gICAgICAvLyBpbmRleGVkOlxuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBpZiAoZm4oc3RlcC52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcbiAgICB6aXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JzID0gaXRlcnMubWFwKGZ1bmN0aW9uKGkgKVxuICAgICAgICB7cmV0dXJuIChpID0gSXRlcmFibGUoaSksIGdldEl0ZXJhdG9yKHJldmVyc2UgPyBpLnJldmVyc2UoKSA6IGkpKX1cbiAgICAgICk7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICB2YXIgaXNEb25lID0gZmFsc2U7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXBzO1xuICAgICAgICBpZiAoIWlzRG9uZSkge1xuICAgICAgICAgIHN0ZXBzID0gaXRlcmF0b3JzLm1hcChmdW5jdGlvbihpICkge3JldHVybiBpLm5leHQoKX0pO1xuICAgICAgICAgIGlzRG9uZSA9IHN0ZXBzLnNvbWUoZnVuY3Rpb24ocyApIHtyZXR1cm4gcy5kb25lfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRG9uZSkge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIGl0ZXJhdGlvbnMrKyxcbiAgICAgICAgICB6aXBwZXIuYXBwbHkobnVsbCwgc3RlcHMubWFwKGZ1bmN0aW9uKHMgKSB7cmV0dXJuIHMudmFsdWV9KSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHppcFNlcXVlbmNlXG4gIH1cblxuXG4gIC8vICNwcmFnbWEgSGVscGVyIEZ1bmN0aW9uc1xuXG4gIGZ1bmN0aW9uIHJlaWZ5KGl0ZXIsIHNlcSkge1xuICAgIHJldHVybiBpc1NlcShpdGVyKSA/IHNlcSA6IGl0ZXIuY29uc3RydWN0b3Ioc2VxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlRW50cnkoZW50cnkpIHtcbiAgICBpZiAoZW50cnkgIT09IE9iamVjdChlbnRyeSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIFtLLCBWXSB0dXBsZTogJyArIGVudHJ5KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlU2l6ZShpdGVyKSB7XG4gICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICByZXR1cm4gZW5zdXJlU2l6ZShpdGVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGl0ZXJhYmxlQ2xhc3MoaXRlcmFibGUpIHtcbiAgICByZXR1cm4gaXNLZXllZChpdGVyYWJsZSkgPyBLZXllZEl0ZXJhYmxlIDpcbiAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgPyBJbmRleGVkSXRlcmFibGUgOlxuICAgICAgU2V0SXRlcmFibGU7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlU2VxdWVuY2UoaXRlcmFibGUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICAgIChcbiAgICAgICAgaXNLZXllZChpdGVyYWJsZSkgPyBLZXllZFNlcSA6XG4gICAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgPyBJbmRleGVkU2VxIDpcbiAgICAgICAgU2V0U2VxXG4gICAgICApLnByb3RvdHlwZVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBjYWNoZVJlc3VsdFRocm91Z2goKSB7XG4gICAgaWYgKHRoaXMuX2l0ZXIuY2FjaGVSZXN1bHQpIHtcbiAgICAgIHRoaXMuX2l0ZXIuY2FjaGVSZXN1bHQoKTtcbiAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX2l0ZXIuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU2VxLnByb3RvdHlwZS5jYWNoZVJlc3VsdC5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmF1bHRDb21wYXJhdG9yKGEsIGIpIHtcbiAgICByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JjZUl0ZXJhdG9yKGtleVBhdGgpIHtcbiAgICB2YXIgaXRlciA9IGdldEl0ZXJhdG9yKGtleVBhdGgpO1xuICAgIGlmICghaXRlcikge1xuICAgICAgLy8gQXJyYXkgbWlnaHQgbm90IGJlIGl0ZXJhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQsIHNvIHdlIG5lZWQgYSBmYWxsYmFja1xuICAgICAgLy8gdG8gb3VyIHdyYXBwZWQgdHlwZS5cbiAgICAgIGlmICghaXNBcnJheUxpa2Uoa2V5UGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgaXRlcmFibGUgb3IgYXJyYXktbGlrZTogJyArIGtleVBhdGgpO1xuICAgICAgfVxuICAgICAgaXRlciA9IGdldEl0ZXJhdG9yKEl0ZXJhYmxlKGtleVBhdGgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZXI7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhSZWNvcmQsIEtleWVkQ29sbGVjdGlvbik7XG5cbiAgICBmdW5jdGlvbiBSZWNvcmQoZGVmYXVsdFZhbHVlcywgbmFtZSkge1xuICAgICAgdmFyIGhhc0luaXRpYWxpemVkO1xuXG4gICAgICB2YXIgUmVjb3JkVHlwZSA9IGZ1bmN0aW9uIFJlY29yZCh2YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbHVlcyBpbnN0YW5jZW9mIFJlY29yZFR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZWNvcmRUeXBlKSkge1xuICAgICAgICAgIHJldHVybiBuZXcgUmVjb3JkVHlwZSh2YWx1ZXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGFzSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICBoYXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkZWZhdWx0VmFsdWVzKTtcbiAgICAgICAgICBzZXRQcm9wcyhSZWNvcmRUeXBlUHJvdG90eXBlLCBrZXlzKTtcbiAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLnNpemUgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9uYW1lID0gbmFtZTtcbiAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9rZXlzID0ga2V5cztcbiAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9kZWZhdWx0VmFsdWVzID0gZGVmYXVsdFZhbHVlcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXAgPSBNYXAodmFsdWVzKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBSZWNvcmRUeXBlUHJvdG90eXBlID0gUmVjb3JkVHlwZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFJlY29yZFByb3RvdHlwZSk7XG4gICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmVjb3JkVHlwZTtcblxuICAgICAgcmV0dXJuIFJlY29yZFR5cGU7XG4gICAgfVxuXG4gICAgUmVjb3JkLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhyZWNvcmROYW1lKHRoaXMpICsgJyB7JywgJ30nKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICAgIFJlY29yZC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRWYWx1ZXMuaGFzT3duUHJvcGVydHkoayk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5oYXMoaykpIHtcbiAgICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgICAgfVxuICAgICAgdmFyIGRlZmF1bHRWYWwgPSB0aGlzLl9kZWZhdWx0VmFsdWVzW2tdO1xuICAgICAgcmV0dXJuIHRoaXMuX21hcCA/IHRoaXMuX21hcC5nZXQoaywgZGVmYXVsdFZhbCkgOiBkZWZhdWx0VmFsO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgUmVjb3JkLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuX21hcCAmJiB0aGlzLl9tYXAuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgUmVjb3JkVHlwZSA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICByZXR1cm4gUmVjb3JkVHlwZS5fZW1wdHkgfHwgKFJlY29yZFR5cGUuX2VtcHR5ID0gbWFrZVJlY29yZCh0aGlzLCBlbXB0eU1hcCgpKSk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaywgdikge1xuICAgICAgaWYgKCF0aGlzLmhhcyhrKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZXQgdW5rbm93biBrZXkgXCInICsgayArICdcIiBvbiAnICsgcmVjb3JkTmFtZSh0aGlzKSk7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwICYmIHRoaXMuX21hcC5zZXQoaywgdik7XG4gICAgICBpZiAodGhpcy5fX293bmVySUQgfHwgbmV3TWFwID09PSB0aGlzLl9tYXApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdNYXApO1xuICAgIH07XG5cbiAgICBSZWNvcmQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGspIHtcbiAgICAgIGlmICghdGhpcy5oYXMoaykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwICYmIHRoaXMuX21hcC5yZW1vdmUoayk7XG4gICAgICBpZiAodGhpcy5fX293bmVySUQgfHwgbmV3TWFwID09PSB0aGlzLl9tYXApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdNYXApO1xuICAgIH07XG5cbiAgICBSZWNvcmQucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAud2FzQWx0ZXJlZCgpO1xuICAgIH07XG5cbiAgICBSZWNvcmQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gS2V5ZWRJdGVyYWJsZSh0aGlzLl9kZWZhdWx0VmFsdWVzKS5tYXAoZnVuY3Rpb24oXywgaykgIHtyZXR1cm4gdGhpcyQwLmdldChrKX0pLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiBLZXllZEl0ZXJhYmxlKHRoaXMuX2RlZmF1bHRWYWx1ZXMpLm1hcChmdW5jdGlvbihfLCBrKSAge3JldHVybiB0aGlzJDAuZ2V0KGspfSkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgUmVjb3JkLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIG5ld01hcCA9IHRoaXMuX21hcCAmJiB0aGlzLl9tYXAuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICAgIGlmICghb3duZXJJRCkge1xuICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdNYXAsIG93bmVySUQpO1xuICAgIH07XG5cblxuICB2YXIgUmVjb3JkUHJvdG90eXBlID0gUmVjb3JkLnByb3RvdHlwZTtcbiAgUmVjb3JkUHJvdG90eXBlW0RFTEVURV0gPSBSZWNvcmRQcm90b3R5cGUucmVtb3ZlO1xuICBSZWNvcmRQcm90b3R5cGUuZGVsZXRlSW4gPVxuICBSZWNvcmRQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUucmVtb3ZlSW47XG4gIFJlY29yZFByb3RvdHlwZS5tZXJnZSA9IE1hcFByb3RvdHlwZS5tZXJnZTtcbiAgUmVjb3JkUHJvdG90eXBlLm1lcmdlV2l0aCA9IE1hcFByb3RvdHlwZS5tZXJnZVdpdGg7XG4gIFJlY29yZFByb3RvdHlwZS5tZXJnZUluID0gTWFwUHJvdG90eXBlLm1lcmdlSW47XG4gIFJlY29yZFByb3RvdHlwZS5tZXJnZURlZXAgPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwO1xuICBSZWNvcmRQcm90b3R5cGUubWVyZ2VEZWVwV2l0aCA9IE1hcFByb3RvdHlwZS5tZXJnZURlZXBXaXRoO1xuICBSZWNvcmRQcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwSW47XG4gIFJlY29yZFByb3RvdHlwZS5zZXRJbiA9IE1hcFByb3RvdHlwZS5zZXRJbjtcbiAgUmVjb3JkUHJvdG90eXBlLnVwZGF0ZSA9IE1hcFByb3RvdHlwZS51cGRhdGU7XG4gIFJlY29yZFByb3RvdHlwZS51cGRhdGVJbiA9IE1hcFByb3RvdHlwZS51cGRhdGVJbjtcbiAgUmVjb3JkUHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSBNYXBQcm90b3R5cGUud2l0aE11dGF0aW9ucztcbiAgUmVjb3JkUHJvdG90eXBlLmFzTXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc011dGFibGU7XG4gIFJlY29yZFByb3RvdHlwZS5hc0ltbXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc0ltbXV0YWJsZTtcblxuXG4gIGZ1bmN0aW9uIG1ha2VSZWNvcmQobGlrZVJlY29yZCwgbWFwLCBvd25lcklEKSB7XG4gICAgdmFyIHJlY29yZCA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKGxpa2VSZWNvcmQpKTtcbiAgICByZWNvcmQuX21hcCA9IG1hcDtcbiAgICByZWNvcmQuX19vd25lcklEID0gb3duZXJJRDtcbiAgICByZXR1cm4gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVjb3JkTmFtZShyZWNvcmQpIHtcbiAgICByZXR1cm4gcmVjb3JkLl9uYW1lIHx8IHJlY29yZC5jb25zdHJ1Y3Rvci5uYW1lIHx8ICdSZWNvcmQnO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0UHJvcHMocHJvdG90eXBlLCBuYW1lcykge1xuICAgIHRyeSB7XG4gICAgICBuYW1lcy5mb3JFYWNoKHNldFByb3AuYmluZCh1bmRlZmluZWQsIHByb3RvdHlwZSkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkgZmFpbGVkLiBQcm9iYWJseSBJRTguXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0UHJvcChwcm90b3R5cGUsIG5hbWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG90eXBlLCBuYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQobmFtZSk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5fX293bmVySUQsICdDYW5ub3Qgc2V0IG9uIGFuIGltbXV0YWJsZSByZWNvcmQuJyk7XG4gICAgICAgIHRoaXMuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFNldCwgU2V0Q29sbGVjdGlvbik7XG5cbiAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG4gICAgZnVuY3Rpb24gU2V0KHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U2V0KCkgOlxuICAgICAgICBpc1NldCh2YWx1ZSkgJiYgIWlzT3JkZXJlZCh2YWx1ZSkgPyB2YWx1ZSA6XG4gICAgICAgIGVtcHR5U2V0KCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBTZXRJdGVyYWJsZSh2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiApIHtyZXR1cm4gc2V0LmFkZCh2KX0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBTZXQub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBTZXQuZnJvbUtleXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMoS2V5ZWRJdGVyYWJsZSh2YWx1ZSkua2V5U2VxKCkpO1xuICAgIH07XG5cbiAgICBTZXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdTZXQgeycsICd9Jyk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgICBTZXQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWFwLmhhcyh2YWx1ZSk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgICBTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdXBkYXRlU2V0KHRoaXMsIHRoaXMuX21hcC5zZXQodmFsdWUsIHRydWUpKTtcbiAgICB9O1xuXG4gICAgU2V0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHVwZGF0ZVNldCh0aGlzLCB0aGlzLl9tYXAucmVtb3ZlKHZhbHVlKSk7XG4gICAgfTtcblxuICAgIFNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB1cGRhdGVTZXQodGhpcywgdGhpcy5fbWFwLmNsZWFyKCkpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIENvbXBvc2l0aW9uXG5cbiAgICBTZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24oKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICBpdGVycyA9IGl0ZXJzLmZpbHRlcihmdW5jdGlvbih4ICkge3JldHVybiB4LnNpemUgIT09IDB9KTtcbiAgICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwICYmICF0aGlzLl9fb3duZXJJRCAmJiBpdGVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IoaXRlcnNbMF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpdGVycy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgICBTZXRJdGVyYWJsZShpdGVyc1tpaV0pLmZvckVhY2goZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIHNldC5hZGQodmFsdWUpfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBTZXQucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uKCkge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGl0ZXJzID0gaXRlcnMubWFwKGZ1bmN0aW9uKGl0ZXIgKSB7cmV0dXJuIFNldEl0ZXJhYmxlKGl0ZXIpfSk7XG4gICAgICB2YXIgb3JpZ2luYWxTZXQgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG4gICAgICAgIG9yaWdpbmFsU2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUgKSB7XG4gICAgICAgICAgaWYgKCFpdGVycy5ldmVyeShmdW5jdGlvbihpdGVyICkge3JldHVybiBpdGVyLmluY2x1ZGVzKHZhbHVlKX0pKSB7XG4gICAgICAgICAgICBzZXQucmVtb3ZlKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIFNldC5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbigpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpdGVycyA9IGl0ZXJzLm1hcChmdW5jdGlvbihpdGVyICkge3JldHVybiBTZXRJdGVyYWJsZShpdGVyKX0pO1xuICAgICAgdmFyIG9yaWdpbmFsU2V0ID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oc2V0ICkge1xuICAgICAgICBvcmlnaW5hbFNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlICkge1xuICAgICAgICAgIGlmIChpdGVycy5zb21lKGZ1bmN0aW9uKGl0ZXIgKSB7cmV0dXJuIGl0ZXIuaW5jbHVkZXModmFsdWUpfSkpIHtcbiAgICAgICAgICAgIHNldC5yZW1vdmUodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgU2V0LnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudW5pb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgU2V0LnByb3RvdHlwZS5tZXJnZVdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiB0aGlzLnVuaW9uLmFwcGx5KHRoaXMsIGl0ZXJzKTtcbiAgICB9O1xuXG4gICAgU2V0LnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24oY29tcGFyYXRvcikge1xuICAgICAgLy8gTGF0ZSBiaW5kaW5nXG4gICAgICByZXR1cm4gT3JkZXJlZFNldChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gICAgfTtcblxuICAgIFNldC5wcm90b3R5cGUuc29ydEJ5ID0gZnVuY3Rpb24obWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICAgIHJldHVybiBPcmRlcmVkU2V0KHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuICAgIH07XG5cbiAgICBTZXQucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAud2FzQWx0ZXJlZCgpO1xuICAgIH07XG5cbiAgICBTZXQucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5fbWFwLl9faXRlcmF0ZShmdW5jdGlvbihfLCBrKSAge3JldHVybiBmbihrLCBrLCB0aGlzJDApfSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIFNldC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tYXAubWFwKGZ1bmN0aW9uKF8sIGspICB7cmV0dXJuIGt9KS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBTZXQucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG4gICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwLl9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgICBpZiAoIW93bmVySUQpIHtcbiAgICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgICB0aGlzLl9tYXAgPSBuZXdNYXA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX19tYWtlKG5ld01hcCwgb3duZXJJRCk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIGlzU2V0KG1heWJlU2V0KSB7XG4gICAgcmV0dXJuICEhKG1heWJlU2V0ICYmIG1heWJlU2V0W0lTX1NFVF9TRU5USU5FTF0pO1xuICB9XG5cbiAgU2V0LmlzU2V0ID0gaXNTZXQ7XG5cbiAgdmFyIElTX1NFVF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX1NFVF9fQEAnO1xuXG4gIHZhciBTZXRQcm90b3R5cGUgPSBTZXQucHJvdG90eXBlO1xuICBTZXRQcm90b3R5cGVbSVNfU0VUX1NFTlRJTkVMXSA9IHRydWU7XG4gIFNldFByb3RvdHlwZVtERUxFVEVdID0gU2V0UHJvdG90eXBlLnJlbW92ZTtcbiAgU2V0UHJvdG90eXBlLm1lcmdlRGVlcCA9IFNldFByb3RvdHlwZS5tZXJnZTtcbiAgU2V0UHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBTZXRQcm90b3R5cGUubWVyZ2VXaXRoO1xuICBTZXRQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IE1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zO1xuICBTZXRQcm90b3R5cGUuYXNNdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzTXV0YWJsZTtcbiAgU2V0UHJvdG90eXBlLmFzSW1tdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzSW1tdXRhYmxlO1xuXG4gIFNldFByb3RvdHlwZS5fX2VtcHR5ID0gZW1wdHlTZXQ7XG4gIFNldFByb3RvdHlwZS5fX21ha2UgPSBtYWtlU2V0O1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZVNldChzZXQsIG5ld01hcCkge1xuICAgIGlmIChzZXQuX19vd25lcklEKSB7XG4gICAgICBzZXQuc2l6ZSA9IG5ld01hcC5zaXplO1xuICAgICAgc2V0Ll9tYXAgPSBuZXdNYXA7XG4gICAgICByZXR1cm4gc2V0O1xuICAgIH1cbiAgICByZXR1cm4gbmV3TWFwID09PSBzZXQuX21hcCA/IHNldCA6XG4gICAgICBuZXdNYXAuc2l6ZSA9PT0gMCA/IHNldC5fX2VtcHR5KCkgOlxuICAgICAgc2V0Ll9fbWFrZShuZXdNYXApO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVNldChtYXAsIG93bmVySUQpIHtcbiAgICB2YXIgc2V0ID0gT2JqZWN0LmNyZWF0ZShTZXRQcm90b3R5cGUpO1xuICAgIHNldC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuICAgIHNldC5fbWFwID0gbWFwO1xuICAgIHNldC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIHJldHVybiBzZXQ7XG4gIH1cblxuICB2YXIgRU1QVFlfU0VUO1xuICBmdW5jdGlvbiBlbXB0eVNldCgpIHtcbiAgICByZXR1cm4gRU1QVFlfU0VUIHx8IChFTVBUWV9TRVQgPSBtYWtlU2V0KGVtcHR5TWFwKCkpKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKE9yZGVyZWRTZXQsIFNldCk7XG5cbiAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG4gICAgZnVuY3Rpb24gT3JkZXJlZFNldCh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eU9yZGVyZWRTZXQoKSA6XG4gICAgICAgIGlzT3JkZXJlZFNldCh2YWx1ZSkgPyB2YWx1ZSA6XG4gICAgICAgIGVtcHR5T3JkZXJlZFNldCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oc2V0ICkge1xuICAgICAgICAgIHZhciBpdGVyID0gU2V0SXRlcmFibGUodmFsdWUpO1xuICAgICAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICAgICAgaXRlci5mb3JFYWNoKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIHNldC5hZGQodil9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgT3JkZXJlZFNldC5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRTZXQuZnJvbUtleXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMoS2V5ZWRJdGVyYWJsZSh2YWx1ZSkua2V5U2VxKCkpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkU2V0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnT3JkZXJlZFNldCB7JywgJ30nKTtcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaXNPcmRlcmVkU2V0KG1heWJlT3JkZXJlZFNldCkge1xuICAgIHJldHVybiBpc1NldChtYXliZU9yZGVyZWRTZXQpICYmIGlzT3JkZXJlZChtYXliZU9yZGVyZWRTZXQpO1xuICB9XG5cbiAgT3JkZXJlZFNldC5pc09yZGVyZWRTZXQgPSBpc09yZGVyZWRTZXQ7XG5cbiAgdmFyIE9yZGVyZWRTZXRQcm90b3R5cGUgPSBPcmRlcmVkU2V0LnByb3RvdHlwZTtcbiAgT3JkZXJlZFNldFByb3RvdHlwZVtJU19PUkRFUkVEX1NFTlRJTkVMXSA9IHRydWU7XG5cbiAgT3JkZXJlZFNldFByb3RvdHlwZS5fX2VtcHR5ID0gZW1wdHlPcmRlcmVkU2V0O1xuICBPcmRlcmVkU2V0UHJvdG90eXBlLl9fbWFrZSA9IG1ha2VPcmRlcmVkU2V0O1xuXG4gIGZ1bmN0aW9uIG1ha2VPcmRlcmVkU2V0KG1hcCwgb3duZXJJRCkge1xuICAgIHZhciBzZXQgPSBPYmplY3QuY3JlYXRlKE9yZGVyZWRTZXRQcm90b3R5cGUpO1xuICAgIHNldC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuICAgIHNldC5fbWFwID0gbWFwO1xuICAgIHNldC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIHJldHVybiBzZXQ7XG4gIH1cblxuICB2YXIgRU1QVFlfT1JERVJFRF9TRVQ7XG4gIGZ1bmN0aW9uIGVtcHR5T3JkZXJlZFNldCgpIHtcbiAgICByZXR1cm4gRU1QVFlfT1JERVJFRF9TRVQgfHwgKEVNUFRZX09SREVSRURfU0VUID0gbWFrZU9yZGVyZWRTZXQoZW1wdHlPcmRlcmVkTWFwKCkpKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFN0YWNrLCBJbmRleGVkQ29sbGVjdGlvbik7XG5cbiAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG4gICAgZnVuY3Rpb24gU3RhY2sodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlTdGFjaygpIDpcbiAgICAgICAgaXNTdGFjayh2YWx1ZSkgPyB2YWx1ZSA6XG4gICAgICAgIGVtcHR5U3RhY2soKS51bnNoaWZ0QWxsKHZhbHVlKTtcbiAgICB9XG5cbiAgICBTdGFjay5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU3RhY2sgWycsICddJyk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgICBTdGFjay5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgaGVhZCA9IHRoaXMuX2hlYWQ7XG4gICAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgICB3aGlsZSAoaGVhZCAmJiBpbmRleC0tKSB7XG4gICAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGVhZCA/IGhlYWQudmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oZWFkICYmIHRoaXMuX2hlYWQudmFsdWU7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgICBTdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemUgKyBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgZm9yICh2YXIgaWkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaWkgPj0gMDsgaWktLSkge1xuICAgICAgICBoZWFkID0ge1xuICAgICAgICAgIHZhbHVlOiBhcmd1bWVudHNbaWldLFxuICAgICAgICAgIG5leHQ6IGhlYWRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSBuZXdTaXplO1xuICAgICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVN0YWNrKG5ld1NpemUsIGhlYWQpO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUucHVzaEFsbCA9IGZ1bmN0aW9uKGl0ZXIpIHtcbiAgICAgIGl0ZXIgPSBJbmRleGVkSXRlcmFibGUoaXRlcik7XG4gICAgICBpZiAoaXRlci5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplO1xuICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgaXRlci5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSApIHtcbiAgICAgICAgbmV3U2l6ZSsrO1xuICAgICAgICBoZWFkID0ge1xuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBuZXh0OiBoZWFkXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSBuZXdTaXplO1xuICAgICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVN0YWNrKG5ld1NpemUsIGhlYWQpO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zbGljZSgxKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS51bnNoaWZ0QWxsID0gZnVuY3Rpb24oaXRlcikge1xuICAgICAgcmV0dXJuIHRoaXMucHVzaEFsbChpdGVyKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnNoaWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wb3AuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuX2hlYWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5U3RhY2soKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgICAgaWYgKHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgdGhpcy5zaXplKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciByZXNvbHZlZEJlZ2luID0gcmVzb2x2ZUJlZ2luKGJlZ2luLCB0aGlzLnNpemUpO1xuICAgICAgdmFyIHJlc29sdmVkRW5kID0gcmVzb2x2ZUVuZChlbmQsIHRoaXMuc2l6ZSk7XG4gICAgICBpZiAocmVzb2x2ZWRFbmQgIT09IHRoaXMuc2l6ZSkge1xuICAgICAgICAvLyBzdXBlci5zbGljZShiZWdpbiwgZW5kKTtcbiAgICAgICAgcmV0dXJuIEluZGV4ZWRDb2xsZWN0aW9uLnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMsIGJlZ2luLCBlbmQpO1xuICAgICAgfVxuICAgICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemUgLSByZXNvbHZlZEJlZ2luO1xuICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgd2hpbGUgKHJlc29sdmVkQmVnaW4tLSkge1xuICAgICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ld1NpemU7XG4gICAgICAgIHRoaXMuX2hlYWQgPSBoZWFkO1xuICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYWtlU3RhY2sobmV3U2l6ZSwgaGVhZCk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTXV0YWJpbGl0eVxuXG4gICAgU3RhY2sucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG4gICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAoIW93bmVySUQpIHtcbiAgICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYWtlU3RhY2sodGhpcy5zaXplLCB0aGlzLl9oZWFkLCBvd25lcklELCB0aGlzLl9faGFzaCk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgSXRlcmF0aW9uXG5cbiAgICBTdGFjay5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5fX2l0ZXJhdGUoZm4pO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgaWYgKGZuKG5vZGUudmFsdWUsIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5fX2l0ZXJhdG9yKHR5cGUpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gbm9kZS52YWx1ZTtcbiAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBpc1N0YWNrKG1heWJlU3RhY2spIHtcbiAgICByZXR1cm4gISEobWF5YmVTdGFjayAmJiBtYXliZVN0YWNrW0lTX1NUQUNLX1NFTlRJTkVMXSk7XG4gIH1cblxuICBTdGFjay5pc1N0YWNrID0gaXNTdGFjaztcblxuICB2YXIgSVNfU1RBQ0tfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9TVEFDS19fQEAnO1xuXG4gIHZhciBTdGFja1Byb3RvdHlwZSA9IFN0YWNrLnByb3RvdHlwZTtcbiAgU3RhY2tQcm90b3R5cGVbSVNfU1RBQ0tfU0VOVElORUxdID0gdHJ1ZTtcbiAgU3RhY2tQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IE1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zO1xuICBTdGFja1Byb3RvdHlwZS5hc011dGFibGUgPSBNYXBQcm90b3R5cGUuYXNNdXRhYmxlO1xuICBTdGFja1Byb3RvdHlwZS5hc0ltbXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc0ltbXV0YWJsZTtcbiAgU3RhY2tQcm90b3R5cGUud2FzQWx0ZXJlZCA9IE1hcFByb3RvdHlwZS53YXNBbHRlcmVkO1xuXG5cbiAgZnVuY3Rpb24gbWFrZVN0YWNrKHNpemUsIGhlYWQsIG93bmVySUQsIGhhc2gpIHtcbiAgICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShTdGFja1Byb3RvdHlwZSk7XG4gICAgbWFwLnNpemUgPSBzaXplO1xuICAgIG1hcC5faGVhZCA9IGhlYWQ7XG4gICAgbWFwLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgbWFwLl9faGFzaCA9IGhhc2g7XG4gICAgbWFwLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICAgIHJldHVybiBtYXA7XG4gIH1cblxuICB2YXIgRU1QVFlfU1RBQ0s7XG4gIGZ1bmN0aW9uIGVtcHR5U3RhY2soKSB7XG4gICAgcmV0dXJuIEVNUFRZX1NUQUNLIHx8IChFTVBUWV9TVEFDSyA9IG1ha2VTdGFjaygwKSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udHJpYnV0ZXMgYWRkaXRpb25hbCBtZXRob2RzIHRvIGEgY29uc3RydWN0b3JcbiAgICovXG4gIGZ1bmN0aW9uIG1peGluKGN0b3IsIG1ldGhvZHMpIHtcbiAgICB2YXIga2V5Q29waWVyID0gZnVuY3Rpb24oa2V5ICkgeyBjdG9yLnByb3RvdHlwZVtrZXldID0gbWV0aG9kc1trZXldOyB9O1xuICAgIE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goa2V5Q29waWVyKTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzICYmXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG1ldGhvZHMpLmZvckVhY2goa2V5Q29waWVyKTtcbiAgICByZXR1cm4gY3RvcjtcbiAgfVxuXG4gIEl0ZXJhYmxlLkl0ZXJhdG9yID0gSXRlcmF0b3I7XG5cbiAgbWl4aW4oSXRlcmFibGUsIHtcblxuICAgIC8vICMjIyBDb252ZXJzaW9uIHRvIG90aGVyIHR5cGVzXG5cbiAgICB0b0FycmF5OiBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgICB2YXIgYXJyYXkgPSBuZXcgQXJyYXkodGhpcy5zaXplIHx8IDApO1xuICAgICAgdGhpcy52YWx1ZVNlcSgpLl9faXRlcmF0ZShmdW5jdGlvbih2LCBpKSAgeyBhcnJheVtpXSA9IHY7IH0pO1xuICAgICAgcmV0dXJuIGFycmF5O1xuICAgIH0sXG5cbiAgICB0b0luZGV4ZWRTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBUb0luZGV4ZWRTZXF1ZW5jZSh0aGlzKTtcbiAgICB9LFxuXG4gICAgdG9KUzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLm1hcChcbiAgICAgICAgZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b0pTID09PSAnZnVuY3Rpb24nID8gdmFsdWUudG9KUygpIDogdmFsdWV9XG4gICAgICApLl9fdG9KUygpO1xuICAgIH0sXG5cbiAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9TZXEoKS5tYXAoXG4gICAgICAgIGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9KU09OID09PSAnZnVuY3Rpb24nID8gdmFsdWUudG9KU09OKCkgOiB2YWx1ZX1cbiAgICAgICkuX190b0pTKCk7XG4gICAgfSxcblxuICAgIHRvS2V5ZWRTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBUb0tleWVkU2VxdWVuY2UodGhpcywgdHJ1ZSk7XG4gICAgfSxcblxuICAgIHRvTWFwOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgIHJldHVybiBNYXAodGhpcy50b0tleWVkU2VxKCkpO1xuICAgIH0sXG5cbiAgICB0b09iamVjdDogZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgICAgdmFyIG9iamVjdCA9IHt9O1xuICAgICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHsgb2JqZWN0W2tdID0gdjsgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH0sXG5cbiAgICB0b09yZGVyZWRNYXA6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgICAgcmV0dXJuIE9yZGVyZWRNYXAodGhpcy50b0tleWVkU2VxKCkpO1xuICAgIH0sXG5cbiAgICB0b09yZGVyZWRTZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgICAgcmV0dXJuIE9yZGVyZWRTZXQoaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b1NldDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgICByZXR1cm4gU2V0KGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcbiAgICB9LFxuXG4gICAgdG9TZXRTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBUb1NldFNlcXVlbmNlKHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b1NlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gaXNJbmRleGVkKHRoaXMpID8gdGhpcy50b0luZGV4ZWRTZXEoKSA6XG4gICAgICAgIGlzS2V5ZWQodGhpcykgPyB0aGlzLnRvS2V5ZWRTZXEoKSA6XG4gICAgICAgIHRoaXMudG9TZXRTZXEoKTtcbiAgICB9LFxuXG4gICAgdG9TdGFjazogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgICByZXR1cm4gU3RhY2soaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b0xpc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgICAgcmV0dXJuIExpc3QoaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBDb21tb24gSmF2YVNjcmlwdCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG5cbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ1tJdGVyYWJsZV0nO1xuICAgIH0sXG5cbiAgICBfX3RvU3RyaW5nOiBmdW5jdGlvbihoZWFkLCB0YWlsKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBoZWFkICsgdGFpbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoZWFkICsgJyAnICsgdGhpcy50b1NlcSgpLm1hcCh0aGlzLl9fdG9TdHJpbmdNYXBwZXIpLmpvaW4oJywgJykgKyAnICcgKyB0YWlsO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuICAgIGNvbmNhdDogZnVuY3Rpb24oKSB7dmFyIHZhbHVlcyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGNvbmNhdEZhY3RvcnkodGhpcywgdmFsdWVzKSk7XG4gICAgfSxcblxuICAgIGluY2x1ZGVzOiBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuc29tZShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXModmFsdWUsIHNlYXJjaFZhbHVlKX0pO1xuICAgIH0sXG5cbiAgICBlbnRyaWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTKTtcbiAgICB9LFxuXG4gICAgZXZlcnk6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHZhciByZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSAge1xuICAgICAgICBpZiAoIXByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgIH0sXG5cbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGZpbHRlckZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCB0cnVlKSk7XG4gICAgfSxcblxuICAgIGZpbmQ6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4gZW50cnkgPyBlbnRyeVsxXSA6IG5vdFNldFZhbHVlO1xuICAgIH0sXG5cbiAgICBmaW5kRW50cnk6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgdmFyIGZvdW5kO1xuICAgICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSB7XG4gICAgICAgICAgZm91bmQgPSBbaywgdl07XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9LFxuXG4gICAgZmluZExhc3RFbnRyeTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oc2lkZUVmZmVjdCwgY29udGV4dCkge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0ZShjb250ZXh0ID8gc2lkZUVmZmVjdC5iaW5kKGNvbnRleHQpIDogc2lkZUVmZmVjdCk7XG4gICAgfSxcblxuICAgIGpvaW46IGZ1bmN0aW9uKHNlcGFyYXRvcikge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciAhPT0gdW5kZWZpbmVkID8gJycgKyBzZXBhcmF0b3IgOiAnLCc7XG4gICAgICB2YXIgam9pbmVkID0gJyc7XG4gICAgICB2YXIgaXNGaXJzdCA9IHRydWU7XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2ICkge1xuICAgICAgICBpc0ZpcnN0ID8gKGlzRmlyc3QgPSBmYWxzZSkgOiAoam9pbmVkICs9IHNlcGFyYXRvcik7XG4gICAgICAgIGpvaW5lZCArPSB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZCA/IHYudG9TdHJpbmcoKSA6ICcnO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gam9pbmVkO1xuICAgIH0sXG5cbiAgICBrZXlzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9LRVlTKTtcbiAgICB9LFxuXG4gICAgbWFwOiBmdW5jdGlvbihtYXBwZXIsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBtYXBGYWN0b3J5KHRoaXMsIG1hcHBlciwgY29udGV4dCkpO1xuICAgIH0sXG5cbiAgICByZWR1Y2U6IGZ1bmN0aW9uKHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcbiAgICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgICB2YXIgcmVkdWN0aW9uO1xuICAgICAgdmFyIHVzZUZpcnN0O1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICAgIHVzZUZpcnN0ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZHVjdGlvbiA9IGluaXRpYWxSZWR1Y3Rpb247XG4gICAgICB9XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSAge1xuICAgICAgICBpZiAodXNlRmlyc3QpIHtcbiAgICAgICAgICB1c2VGaXJzdCA9IGZhbHNlO1xuICAgICAgICAgIHJlZHVjdGlvbiA9IHY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVkdWN0aW9uID0gcmVkdWNlci5jYWxsKGNvbnRleHQsIHJlZHVjdGlvbiwgdiwgaywgYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlZHVjdGlvbjtcbiAgICB9LFxuXG4gICAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uKHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXZlcnNlZCA9IHRoaXMudG9LZXllZFNlcSgpLnJldmVyc2UoKTtcbiAgICAgIHJldHVybiByZXZlcnNlZC5yZWR1Y2UuYXBwbHkocmV2ZXJzZWQsIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIHJldmVyc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHJldmVyc2VGYWN0b3J5KHRoaXMsIHRydWUpKTtcbiAgICB9LFxuXG4gICAgc2xpY2U6IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzbGljZUZhY3RvcnkodGhpcywgYmVnaW4sIGVuZCwgdHJ1ZSkpO1xuICAgIH0sXG5cbiAgICBzb21lOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiAhdGhpcy5ldmVyeShub3QocHJlZGljYXRlKSwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIHNvcnQ6IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gICAgfSxcblxuICAgIHZhbHVlczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTKTtcbiAgICB9LFxuXG5cbiAgICAvLyAjIyMgTW9yZSBzZXF1ZW50aWFsIG1ldGhvZHNcblxuICAgIGJ1dExhc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgLTEpO1xuICAgIH0sXG5cbiAgICBpc0VtcHR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnNpemUgIT09IHVuZGVmaW5lZCA/IHRoaXMuc2l6ZSA9PT0gMCA6ICF0aGlzLnNvbWUoZnVuY3Rpb24oKSAge3JldHVybiB0cnVlfSk7XG4gICAgfSxcblxuICAgIGNvdW50OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBlbnN1cmVTaXplKFxuICAgICAgICBwcmVkaWNhdGUgPyB0aGlzLnRvU2VxKCkuZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCkgOiB0aGlzXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBjb3VudEJ5OiBmdW5jdGlvbihncm91cGVyLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gY291bnRCeUZhY3RvcnkodGhpcywgZ3JvdXBlciwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIGVxdWFsczogZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgIHJldHVybiBkZWVwRXF1YWwodGhpcywgb3RoZXIpO1xuICAgIH0sXG5cbiAgICBlbnRyeVNlcTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaXRlcmFibGUgPSB0aGlzO1xuICAgICAgaWYgKGl0ZXJhYmxlLl9jYWNoZSkge1xuICAgICAgICAvLyBXZSBjYWNoZSBhcyBhbiBlbnRyaWVzIGFycmF5LCBzbyB3ZSBjYW4ganVzdCByZXR1cm4gdGhlIGNhY2hlIVxuICAgICAgICByZXR1cm4gbmV3IEFycmF5U2VxKGl0ZXJhYmxlLl9jYWNoZSk7XG4gICAgICB9XG4gICAgICB2YXIgZW50cmllc1NlcXVlbmNlID0gaXRlcmFibGUudG9TZXEoKS5tYXAoZW50cnlNYXBwZXIpLnRvSW5kZXhlZFNlcSgpO1xuICAgICAgZW50cmllc1NlcXVlbmNlLmZyb21FbnRyeVNlcSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGUudG9TZXEoKX07XG4gICAgICByZXR1cm4gZW50cmllc1NlcXVlbmNlO1xuICAgIH0sXG5cbiAgICBmaWx0ZXJOb3Q6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgZmluZExhc3Q6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkuZmluZChwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKTtcbiAgICB9LFxuXG4gICAgZmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZChyZXR1cm5UcnVlKTtcbiAgICB9LFxuXG4gICAgZmxhdE1hcDogZnVuY3Rpb24obWFwcGVyLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdE1hcEZhY3RvcnkodGhpcywgbWFwcGVyLCBjb250ZXh0KSk7XG4gICAgfSxcblxuICAgIGZsYXR0ZW46IGZ1bmN0aW9uKGRlcHRoKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdHRlbkZhY3RvcnkodGhpcywgZGVwdGgsIHRydWUpKTtcbiAgICB9LFxuXG4gICAgZnJvbUVudHJ5U2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRnJvbUVudHJpZXNTZXF1ZW5jZSh0aGlzKTtcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbihzZWFyY2hLZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kKGZ1bmN0aW9uKF8sIGtleSkgIHtyZXR1cm4gaXMoa2V5LCBzZWFyY2hLZXkpfSwgdW5kZWZpbmVkLCBub3RTZXRWYWx1ZSk7XG4gICAgfSxcblxuICAgIGdldEluOiBmdW5jdGlvbihzZWFyY2hLZXlQYXRoLCBub3RTZXRWYWx1ZSkge1xuICAgICAgdmFyIG5lc3RlZCA9IHRoaXM7XG4gICAgICAvLyBOb3RlOiBpbiBhbiBFUzYgZW52aXJvbm1lbnQsIHdlIHdvdWxkIHByZWZlcjpcbiAgICAgIC8vIGZvciAodmFyIGtleSBvZiBzZWFyY2hLZXlQYXRoKSB7XG4gICAgICB2YXIgaXRlciA9IGZvcmNlSXRlcmF0b3Ioc2VhcmNoS2V5UGF0aCk7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyLm5leHQoKSkuZG9uZSkge1xuICAgICAgICB2YXIga2V5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgbmVzdGVkID0gbmVzdGVkICYmIG5lc3RlZC5nZXQgPyBuZXN0ZWQuZ2V0KGtleSwgTk9UX1NFVCkgOiBOT1RfU0VUO1xuICAgICAgICBpZiAobmVzdGVkID09PSBOT1RfU0VUKSB7XG4gICAgICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbmVzdGVkO1xuICAgIH0sXG5cbiAgICBncm91cEJ5OiBmdW5jdGlvbihncm91cGVyLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gZ3JvdXBCeUZhY3RvcnkodGhpcywgZ3JvdXBlciwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIGhhczogZnVuY3Rpb24oc2VhcmNoS2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoc2VhcmNoS2V5LCBOT1RfU0VUKSAhPT0gTk9UX1NFVDtcbiAgICB9LFxuXG4gICAgaGFzSW46IGZ1bmN0aW9uKHNlYXJjaEtleVBhdGgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEluKHNlYXJjaEtleVBhdGgsIE5PVF9TRVQpICE9PSBOT1RfU0VUO1xuICAgIH0sXG5cbiAgICBpc1N1YnNldDogZnVuY3Rpb24oaXRlcikge1xuICAgICAgaXRlciA9IHR5cGVvZiBpdGVyLmluY2x1ZGVzID09PSAnZnVuY3Rpb24nID8gaXRlciA6IEl0ZXJhYmxlKGl0ZXIpO1xuICAgICAgcmV0dXJuIHRoaXMuZXZlcnkoZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIGl0ZXIuaW5jbHVkZXModmFsdWUpfSk7XG4gICAgfSxcblxuICAgIGlzU3VwZXJzZXQ6IGZ1bmN0aW9uKGl0ZXIpIHtcbiAgICAgIGl0ZXIgPSB0eXBlb2YgaXRlci5pc1N1YnNldCA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZXIgOiBJdGVyYWJsZShpdGVyKTtcbiAgICAgIHJldHVybiBpdGVyLmlzU3Vic2V0KHRoaXMpO1xuICAgIH0sXG5cbiAgICBrZXlTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9TZXEoKS5tYXAoa2V5TWFwcGVyKS50b0luZGV4ZWRTZXEoKTtcbiAgICB9LFxuXG4gICAgbGFzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5maXJzdCgpO1xuICAgIH0sXG5cbiAgICBtYXg6IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiBtYXhGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IpO1xuICAgIH0sXG5cbiAgICBtYXhCeTogZnVuY3Rpb24obWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yLCBtYXBwZXIpO1xuICAgIH0sXG5cbiAgICBtaW46IGZ1bmN0aW9uKGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiBtYXhGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IgPyBuZWcoY29tcGFyYXRvcikgOiBkZWZhdWx0TmVnQ29tcGFyYXRvcik7XG4gICAgfSxcblxuICAgIG1pbkJ5OiBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiBtYXhGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IgPyBuZWcoY29tcGFyYXRvcikgOiBkZWZhdWx0TmVnQ29tcGFyYXRvciwgbWFwcGVyKTtcbiAgICB9LFxuXG4gICAgcmVzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zbGljZSgxKTtcbiAgICB9LFxuXG4gICAgc2tpcDogZnVuY3Rpb24oYW1vdW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5zbGljZShNYXRoLm1heCgwLCBhbW91bnQpKTtcbiAgICB9LFxuXG4gICAgc2tpcExhc3Q6IGZ1bmN0aW9uKGFtb3VudCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHRoaXMudG9TZXEoKS5yZXZlcnNlKCkuc2tpcChhbW91bnQpLnJldmVyc2UoKSk7XG4gICAgfSxcblxuICAgIHNraXBXaGlsZTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgc2tpcFdoaWxlRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIHRydWUpKTtcbiAgICB9LFxuXG4gICAgc2tpcFVudGlsOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNraXBXaGlsZShub3QocHJlZGljYXRlKSwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIHNvcnRCeTogZnVuY3Rpb24obWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKSk7XG4gICAgfSxcblxuICAgIHRha2U6IGZ1bmN0aW9uKGFtb3VudCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgTWF0aC5tYXgoMCwgYW1vdW50KSk7XG4gICAgfSxcblxuICAgIHRha2VMYXN0OiBmdW5jdGlvbihhbW91bnQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLnRha2UoYW1vdW50KS5yZXZlcnNlKCkpO1xuICAgIH0sXG5cbiAgICB0YWtlV2hpbGU6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHRha2VXaGlsZUZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0KSk7XG4gICAgfSxcblxuICAgIHRha2VVbnRpbDogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy50YWtlV2hpbGUobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuICAgIH0sXG5cbiAgICB2YWx1ZVNlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b0luZGV4ZWRTZXEoKTtcbiAgICB9LFxuXG5cbiAgICAvLyAjIyMgSGFzaGFibGUgT2JqZWN0XG5cbiAgICBoYXNoQ29kZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2hhc2ggfHwgKHRoaXMuX19oYXNoID0gaGFzaEl0ZXJhYmxlKHRoaXMpKTtcbiAgICB9XG5cblxuICAgIC8vICMjIyBJbnRlcm5hbFxuXG4gICAgLy8gYWJzdHJhY3QgX19pdGVyYXRlKGZuLCByZXZlcnNlKVxuXG4gICAgLy8gYWJzdHJhY3QgX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKVxuICB9KTtcblxuICAvLyB2YXIgSVNfSVRFUkFCTEVfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9JVEVSQUJMRV9fQEAnO1xuICAvLyB2YXIgSVNfS0VZRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9LRVlFRF9fQEAnO1xuICAvLyB2YXIgSVNfSU5ERVhFRF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX0lOREVYRURfX0BAJztcbiAgLy8gdmFyIElTX09SREVSRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9PUkRFUkVEX19AQCc7XG5cbiAgdmFyIEl0ZXJhYmxlUHJvdG90eXBlID0gSXRlcmFibGUucHJvdG90eXBlO1xuICBJdGVyYWJsZVByb3RvdHlwZVtJU19JVEVSQUJMRV9TRU5USU5FTF0gPSB0cnVlO1xuICBJdGVyYWJsZVByb3RvdHlwZVtJVEVSQVRPUl9TWU1CT0xdID0gSXRlcmFibGVQcm90b3R5cGUudmFsdWVzO1xuICBJdGVyYWJsZVByb3RvdHlwZS5fX3RvSlMgPSBJdGVyYWJsZVByb3RvdHlwZS50b0FycmF5O1xuICBJdGVyYWJsZVByb3RvdHlwZS5fX3RvU3RyaW5nTWFwcGVyID0gcXVvdGVTdHJpbmc7XG4gIEl0ZXJhYmxlUHJvdG90eXBlLmluc3BlY3QgPVxuICBJdGVyYWJsZVByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50b1N0cmluZygpOyB9O1xuICBJdGVyYWJsZVByb3RvdHlwZS5jaGFpbiA9IEl0ZXJhYmxlUHJvdG90eXBlLmZsYXRNYXA7XG4gIEl0ZXJhYmxlUHJvdG90eXBlLmNvbnRhaW5zID0gSXRlcmFibGVQcm90b3R5cGUuaW5jbHVkZXM7XG5cbiAgLy8gVGVtcG9yYXJ5IHdhcm5pbmcgYWJvdXQgdXNpbmcgbGVuZ3RoXG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShJdGVyYWJsZVByb3RvdHlwZSwgJ2xlbmd0aCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFJdGVyYWJsZS5ub0xlbmd0aFdhcm5pbmcpIHtcbiAgICAgICAgICAgIHZhciBzdGFjaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgc3RhY2sgPSBlcnJvci5zdGFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdGFjay5pbmRleE9mKCdfd3JhcE9iamVjdCcpID09PSAtMSkge1xuICAgICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUud2FybiAmJiBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgJ2l0ZXJhYmxlLmxlbmd0aCBoYXMgYmVlbiBkZXByZWNhdGVkLCAnK1xuICAgICAgICAgICAgICAgICd1c2UgaXRlcmFibGUuc2l6ZSBvciBpdGVyYWJsZS5jb3VudCgpLiAnK1xuICAgICAgICAgICAgICAgICdUaGlzIHdhcm5pbmcgd2lsbCBiZWNvbWUgYSBzaWxlbnQgZXJyb3IgaW4gYSBmdXR1cmUgdmVyc2lvbi4gJyArXG4gICAgICAgICAgICAgICAgc3RhY2tcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0pKCk7XG5cblxuXG4gIG1peGluKEtleWVkSXRlcmFibGUsIHtcblxuICAgIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG4gICAgZmxpcDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmxpcEZhY3RvcnkodGhpcykpO1xuICAgIH0sXG5cbiAgICBmaW5kS2V5OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4gZW50cnkgJiYgZW50cnlbMF07XG4gICAgfSxcblxuICAgIGZpbmRMYXN0S2V5OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLmZpbmRLZXkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAga2V5T2Y6IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kS2V5KGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiBpcyh2YWx1ZSwgc2VhcmNoVmFsdWUpfSk7XG4gICAgfSxcblxuICAgIGxhc3RLZXlPZjogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmRMYXN0S2V5KGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiBpcyh2YWx1ZSwgc2VhcmNoVmFsdWUpfSk7XG4gICAgfSxcblxuICAgIG1hcEVudHJpZXM6IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsXG4gICAgICAgIHRoaXMudG9TZXEoKS5tYXAoXG4gICAgICAgICAgZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gbWFwcGVyLmNhbGwoY29udGV4dCwgW2ssIHZdLCBpdGVyYXRpb25zKyssIHRoaXMkMCl9XG4gICAgICAgICkuZnJvbUVudHJ5U2VxKClcbiAgICAgICk7XG4gICAgfSxcblxuICAgIG1hcEtleXM6IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsXG4gICAgICAgIHRoaXMudG9TZXEoKS5mbGlwKCkubWFwKFxuICAgICAgICAgIGZ1bmN0aW9uKGssIHYpICB7cmV0dXJuIG1hcHBlci5jYWxsKGNvbnRleHQsIGssIHYsIHRoaXMkMCl9XG4gICAgICAgICkuZmxpcCgpXG4gICAgICApO1xuICAgIH1cblxuICB9KTtcblxuICB2YXIgS2V5ZWRJdGVyYWJsZVByb3RvdHlwZSA9IEtleWVkSXRlcmFibGUucHJvdG90eXBlO1xuICBLZXllZEl0ZXJhYmxlUHJvdG90eXBlW0lTX0tFWUVEX1NFTlRJTkVMXSA9IHRydWU7XG4gIEtleWVkSXRlcmFibGVQcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IEl0ZXJhYmxlUHJvdG90eXBlLmVudHJpZXM7XG4gIEtleWVkSXRlcmFibGVQcm90b3R5cGUuX190b0pTID0gSXRlcmFibGVQcm90b3R5cGUudG9PYmplY3Q7XG4gIEtleWVkSXRlcmFibGVQcm90b3R5cGUuX190b1N0cmluZ01hcHBlciA9IGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIEpTT04uc3RyaW5naWZ5KGspICsgJzogJyArIHF1b3RlU3RyaW5nKHYpfTtcblxuXG5cbiAgbWl4aW4oSW5kZXhlZEl0ZXJhYmxlLCB7XG5cbiAgICAvLyAjIyMgQ29udmVyc2lvbiB0byBvdGhlciB0eXBlc1xuXG4gICAgdG9LZXllZFNlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFRvS2V5ZWRTZXF1ZW5jZSh0aGlzLCBmYWxzZSk7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIEVTNiBDb2xsZWN0aW9uIG1ldGhvZHMgKEVTNiBBcnJheSBhbmQgTWFwKVxuXG4gICAgZmlsdGVyOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmaWx0ZXJGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgZmluZEluZGV4OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4gZW50cnkgPyBlbnRyeVswXSA6IC0xO1xuICAgIH0sXG5cbiAgICBpbmRleE9mOiBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgdmFyIGtleSA9IHRoaXMudG9LZXllZFNlcSgpLmtleU9mKHNlYXJjaFZhbHVlKTtcbiAgICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCA/IC0xIDoga2V5O1xuICAgIH0sXG5cbiAgICBsYXN0SW5kZXhPZjogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHZhciBrZXkgPSB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkua2V5T2Yoc2VhcmNoVmFsdWUpO1xuICAgICAgcmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkID8gLTEgOiBrZXk7XG5cbiAgICAgIC8vIHZhciBpbmRleCA9XG4gICAgICAvLyByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5pbmRleE9mKHNlYXJjaFZhbHVlKTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgcmV2ZXJzZUZhY3RvcnkodGhpcywgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgc2xpY2U6IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzbGljZUZhY3RvcnkodGhpcywgYmVnaW4sIGVuZCwgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgc3BsaWNlOiBmdW5jdGlvbihpbmRleCwgcmVtb3ZlTnVtIC8qLCAuLi52YWx1ZXMqLykge1xuICAgICAgdmFyIG51bUFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgcmVtb3ZlTnVtID0gTWF0aC5tYXgocmVtb3ZlTnVtIHwgMCwgMCk7XG4gICAgICBpZiAobnVtQXJncyA9PT0gMCB8fCAobnVtQXJncyA9PT0gMiAmJiAhcmVtb3ZlTnVtKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIC8vIElmIGluZGV4IGlzIG5lZ2F0aXZlLCBpdCBzaG91bGQgcmVzb2x2ZSByZWxhdGl2ZSB0byB0aGUgc2l6ZSBvZiB0aGVcbiAgICAgIC8vIGNvbGxlY3Rpb24uIEhvd2V2ZXIgc2l6ZSBtYXkgYmUgZXhwZW5zaXZlIHRvIGNvbXB1dGUgaWYgbm90IGNhY2hlZCwgc29cbiAgICAgIC8vIG9ubHkgY2FsbCBjb3VudCgpIGlmIHRoZSBudW1iZXIgaXMgaW4gZmFjdCBuZWdhdGl2ZS5cbiAgICAgIGluZGV4ID0gcmVzb2x2ZUJlZ2luKGluZGV4LCBpbmRleCA8IDAgPyB0aGlzLmNvdW50KCkgOiB0aGlzLnNpemUpO1xuICAgICAgdmFyIHNwbGljZWQgPSB0aGlzLnNsaWNlKDAsIGluZGV4KTtcbiAgICAgIHJldHVybiByZWlmeShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgbnVtQXJncyA9PT0gMSA/XG4gICAgICAgICAgc3BsaWNlZCA6XG4gICAgICAgICAgc3BsaWNlZC5jb25jYXQoYXJyQ29weShhcmd1bWVudHMsIDIpLCB0aGlzLnNsaWNlKGluZGV4ICsgcmVtb3ZlTnVtKSlcbiAgICAgICk7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIE1vcmUgY29sbGVjdGlvbiBtZXRob2RzXG5cbiAgICBmaW5kTGFzdEluZGV4OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBrZXkgPSB0aGlzLnRvS2V5ZWRTZXEoKS5maW5kTGFzdEtleShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkID8gLTEgOiBrZXk7XG4gICAgfSxcblxuICAgIGZpcnN0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldCgwKTtcbiAgICB9LFxuXG4gICAgZmxhdHRlbjogZnVuY3Rpb24oZGVwdGgpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0dGVuRmFjdG9yeSh0aGlzLCBkZXB0aCwgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICAgIHJldHVybiAoaW5kZXggPCAwIHx8ICh0aGlzLnNpemUgPT09IEluZmluaXR5IHx8XG4gICAgICAgICAgKHRoaXMuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGluZGV4ID4gdGhpcy5zaXplKSkpID9cbiAgICAgICAgbm90U2V0VmFsdWUgOlxuICAgICAgICB0aGlzLmZpbmQoZnVuY3Rpb24oXywga2V5KSAge3JldHVybiBrZXkgPT09IGluZGV4fSwgdW5kZWZpbmVkLCBub3RTZXRWYWx1ZSk7XG4gICAgfSxcblxuICAgIGhhczogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICAgIHJldHVybiBpbmRleCA+PSAwICYmICh0aGlzLnNpemUgIT09IHVuZGVmaW5lZCA/XG4gICAgICAgIHRoaXMuc2l6ZSA9PT0gSW5maW5pdHkgfHwgaW5kZXggPCB0aGlzLnNpemUgOlxuICAgICAgICB0aGlzLmluZGV4T2YoaW5kZXgpICE9PSAtMVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgaW50ZXJwb3NlOiBmdW5jdGlvbihzZXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBpbnRlcnBvc2VGYWN0b3J5KHRoaXMsIHNlcGFyYXRvcikpO1xuICAgIH0sXG5cbiAgICBpbnRlcmxlYXZlOiBmdW5jdGlvbigvKi4uLml0ZXJhYmxlcyovKSB7XG4gICAgICB2YXIgaXRlcmFibGVzID0gW3RoaXNdLmNvbmNhdChhcnJDb3B5KGFyZ3VtZW50cykpO1xuICAgICAgdmFyIHppcHBlZCA9IHppcFdpdGhGYWN0b3J5KHRoaXMudG9TZXEoKSwgSW5kZXhlZFNlcS5vZiwgaXRlcmFibGVzKTtcbiAgICAgIHZhciBpbnRlcmxlYXZlZCA9IHppcHBlZC5mbGF0dGVuKHRydWUpO1xuICAgICAgaWYgKHppcHBlZC5zaXplKSB7XG4gICAgICAgIGludGVybGVhdmVkLnNpemUgPSB6aXBwZWQuc2l6ZSAqIGl0ZXJhYmxlcy5sZW5ndGg7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgaW50ZXJsZWF2ZWQpO1xuICAgIH0sXG5cbiAgICBsYXN0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldCgtMSk7XG4gICAgfSxcblxuICAgIHNraXBXaGlsZTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgc2tpcFdoaWxlRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIGZhbHNlKSk7XG4gICAgfSxcblxuICAgIHppcDogZnVuY3Rpb24oLyosIC4uLml0ZXJhYmxlcyAqLykge1xuICAgICAgdmFyIGl0ZXJhYmxlcyA9IFt0aGlzXS5jb25jYXQoYXJyQ29weShhcmd1bWVudHMpKTtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCB6aXBXaXRoRmFjdG9yeSh0aGlzLCBkZWZhdWx0WmlwcGVyLCBpdGVyYWJsZXMpKTtcbiAgICB9LFxuXG4gICAgemlwV2l0aDogZnVuY3Rpb24oemlwcGVyLyosIC4uLml0ZXJhYmxlcyAqLykge1xuICAgICAgdmFyIGl0ZXJhYmxlcyA9IGFyckNvcHkoYXJndW1lbnRzKTtcbiAgICAgIGl0ZXJhYmxlc1swXSA9IHRoaXM7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgemlwV2l0aEZhY3RvcnkodGhpcywgemlwcGVyLCBpdGVyYWJsZXMpKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgSW5kZXhlZEl0ZXJhYmxlLnByb3RvdHlwZVtJU19JTkRFWEVEX1NFTlRJTkVMXSA9IHRydWU7XG4gIEluZGV4ZWRJdGVyYWJsZS5wcm90b3R5cGVbSVNfT1JERVJFRF9TRU5USU5FTF0gPSB0cnVlO1xuXG5cblxuICBtaXhpbihTZXRJdGVyYWJsZSwge1xuXG4gICAgLy8gIyMjIEVTNiBDb2xsZWN0aW9uIG1ldGhvZHMgKEVTNiBBcnJheSBhbmQgTWFwKVxuXG4gICAgZ2V0OiBmdW5jdGlvbih2YWx1ZSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhcyh2YWx1ZSkgPyB2YWx1ZSA6IG5vdFNldFZhbHVlO1xuICAgIH0sXG5cbiAgICBpbmNsdWRlczogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhcyh2YWx1ZSk7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIE1vcmUgc2VxdWVudGlhbCBtZXRob2RzXG5cbiAgICBrZXlTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVTZXEoKTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgU2V0SXRlcmFibGUucHJvdG90eXBlLmhhcyA9IEl0ZXJhYmxlUHJvdG90eXBlLmluY2x1ZGVzO1xuXG5cbiAgLy8gTWl4aW4gc3ViY2xhc3Nlc1xuXG4gIG1peGluKEtleWVkU2VxLCBLZXllZEl0ZXJhYmxlLnByb3RvdHlwZSk7XG4gIG1peGluKEluZGV4ZWRTZXEsIEluZGV4ZWRJdGVyYWJsZS5wcm90b3R5cGUpO1xuICBtaXhpbihTZXRTZXEsIFNldEl0ZXJhYmxlLnByb3RvdHlwZSk7XG5cbiAgbWl4aW4oS2V5ZWRDb2xsZWN0aW9uLCBLZXllZEl0ZXJhYmxlLnByb3RvdHlwZSk7XG4gIG1peGluKEluZGV4ZWRDb2xsZWN0aW9uLCBJbmRleGVkSXRlcmFibGUucHJvdG90eXBlKTtcbiAgbWl4aW4oU2V0Q29sbGVjdGlvbiwgU2V0SXRlcmFibGUucHJvdG90eXBlKTtcblxuXG4gIC8vICNwcmFnbWEgSGVscGVyIGZ1bmN0aW9uc1xuXG4gIGZ1bmN0aW9uIGtleU1hcHBlcih2LCBrKSB7XG4gICAgcmV0dXJuIGs7XG4gIH1cblxuICBmdW5jdGlvbiBlbnRyeU1hcHBlcih2LCBrKSB7XG4gICAgcmV0dXJuIFtrLCB2XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdChwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5lZyhwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gLXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHF1b3RlU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkgOiB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmF1bHRaaXBwZXIoKSB7XG4gICAgcmV0dXJuIGFyckNvcHkoYXJndW1lbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmF1bHROZWdDb21wYXJhdG9yKGEsIGIpIHtcbiAgICByZXR1cm4gYSA8IGIgPyAxIDogYSA+IGIgPyAtMSA6IDA7XG4gIH1cblxuICBmdW5jdGlvbiBoYXNoSXRlcmFibGUoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUuc2l6ZSA9PT0gSW5maW5pdHkpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICB2YXIgb3JkZXJlZCA9IGlzT3JkZXJlZChpdGVyYWJsZSk7XG4gICAgdmFyIGtleWVkID0gaXNLZXllZChpdGVyYWJsZSk7XG4gICAgdmFyIGggPSBvcmRlcmVkID8gMSA6IDA7XG4gICAgdmFyIHNpemUgPSBpdGVyYWJsZS5fX2l0ZXJhdGUoXG4gICAgICBrZXllZCA/XG4gICAgICAgIG9yZGVyZWQgP1xuICAgICAgICAgIGZ1bmN0aW9uKHYsIGspICB7IGggPSAzMSAqIGggKyBoYXNoTWVyZ2UoaGFzaCh2KSwgaGFzaChrKSkgfCAwOyB9IDpcbiAgICAgICAgICBmdW5jdGlvbih2LCBrKSAgeyBoID0gaCArIGhhc2hNZXJnZShoYXNoKHYpLCBoYXNoKGspKSB8IDA7IH0gOlxuICAgICAgICBvcmRlcmVkID9cbiAgICAgICAgICBmdW5jdGlvbih2ICkgeyBoID0gMzEgKiBoICsgaGFzaCh2KSB8IDA7IH0gOlxuICAgICAgICAgIGZ1bmN0aW9uKHYgKSB7IGggPSBoICsgaGFzaCh2KSB8IDA7IH1cbiAgICApO1xuICAgIHJldHVybiBtdXJtdXJIYXNoT2ZTaXplKHNpemUsIGgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbXVybXVySGFzaE9mU2l6ZShzaXplLCBoKSB7XG4gICAgaCA9IGltdWwoaCwgMHhDQzlFMkQ1MSk7XG4gICAgaCA9IGltdWwoaCA8PCAxNSB8IGggPj4+IC0xNSwgMHgxQjg3MzU5Myk7XG4gICAgaCA9IGltdWwoaCA8PCAxMyB8IGggPj4+IC0xMywgNSk7XG4gICAgaCA9IChoICsgMHhFNjU0NkI2NCB8IDApIF4gc2l6ZTtcbiAgICBoID0gaW11bChoIF4gaCA+Pj4gMTYsIDB4ODVFQkNBNkIpO1xuICAgIGggPSBpbXVsKGggXiBoID4+PiAxMywgMHhDMkIyQUUzNSk7XG4gICAgaCA9IHNtaShoIF4gaCA+Pj4gMTYpO1xuICAgIHJldHVybiBoO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzaE1lcmdlKGEsIGIpIHtcbiAgICByZXR1cm4gYSBeIGIgKyAweDlFMzc3OUI5ICsgKGEgPDwgNikgKyAoYSA+PiAyKSB8IDA7IC8vIGludFxuICB9XG5cbiAgdmFyIEltbXV0YWJsZSA9IHtcblxuICAgIEl0ZXJhYmxlOiBJdGVyYWJsZSxcblxuICAgIFNlcTogU2VxLFxuICAgIENvbGxlY3Rpb246IENvbGxlY3Rpb24sXG4gICAgTWFwOiBNYXAsXG4gICAgT3JkZXJlZE1hcDogT3JkZXJlZE1hcCxcbiAgICBMaXN0OiBMaXN0LFxuICAgIFN0YWNrOiBTdGFjayxcbiAgICBTZXQ6IFNldCxcbiAgICBPcmRlcmVkU2V0OiBPcmRlcmVkU2V0LFxuXG4gICAgUmVjb3JkOiBSZWNvcmQsXG4gICAgUmFuZ2U6IFJhbmdlLFxuICAgIFJlcGVhdDogUmVwZWF0LFxuXG4gICAgaXM6IGlzLFxuICAgIGZyb21KUzogZnJvbUpTXG5cbiAgfTtcblxuICByZXR1cm4gSW1tdXRhYmxlO1xuXG59KSk7IiwiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwib2JqZWN0XCI9PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9dChyZXF1aXJlKFwiaW1tdXRhYmxlXCIpLHJlcXVpcmUoXCJkcmFmdC1qc1wiKSk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXCJpbW11dGFibGVcIixcImRyYWZ0LWpzXCJdLHQpOlwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzP2V4cG9ydHMuaHRtbFRvRHJhZnRqcz10KHJlcXVpcmUoXCJpbW11dGFibGVcIikscmVxdWlyZShcImRyYWZ0LWpzXCIpKTplLmh0bWxUb0RyYWZ0anM9dChlLmltbXV0YWJsZSxlW1wiZHJhZnQtanNcIl0pfSh3aW5kb3csZnVuY3Rpb24obixyKXtyZXR1cm4gbz17fSxpLm09YT1bZnVuY3Rpb24oZSx0KXtlLmV4cG9ydHM9bn0sZnVuY3Rpb24oZSx0KXtlLmV4cG9ydHM9cn0sZnVuY3Rpb24oZSx0LG4pe2UuZXhwb3J0cz1uKDMpfSxmdW5jdGlvbihlLHQsbil7XCJ1c2Ugc3RyaWN0XCI7bi5yKHQpO3ZhciB2PW4oMSksdT1uKDApLHM9ZnVuY3Rpb24oZSl7dmFyIHQsbj1udWxsO3JldHVybiBkb2N1bWVudC5pbXBsZW1lbnRhdGlvbiYmZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50JiYoKHQ9ZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KFwiZm9vXCIpKS5kb2N1bWVudEVsZW1lbnQuaW5uZXJIVE1MPWUsbj10LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXSksbn0seD1mdW5jdGlvbihlLHQsbil7dmFyIHIsaT1lLnRleHRDb250ZW50O3JldHVyblwiXCI9PT1pLnRyaW0oKT97Y2h1bms6KHI9bix7dGV4dDpcIiBcIixpbmxpbmVzOltuZXcgdS5PcmRlcmVkU2V0XSxlbnRpdGllczpbcl0sYmxvY2tzOltdfSl9OntjaHVuazp7dGV4dDppLGlubGluZXM6QXJyYXkoaS5sZW5ndGgpLmZpbGwodCksZW50aXRpZXM6QXJyYXkoaS5sZW5ndGgpLmZpbGwobiksYmxvY2tzOltdfX19LE09ZnVuY3Rpb24oKXtyZXR1cm57dGV4dDpcIlxcblwiLGlubGluZXM6W25ldyB1Lk9yZGVyZWRTZXRdLGVudGl0aWVzOm5ldyBBcnJheSgxKSxibG9ja3M6W119fSxrPWZ1bmN0aW9uKCl7cmV0dXJue3RleHQ6XCJcIixpbmxpbmVzOltdLGVudGl0aWVzOltdLGJsb2NrczpbXX19LEU9ZnVuY3Rpb24oZSx0KXtyZXR1cm57dGV4dDpcIlwiLGlubGluZXM6W10sZW50aXRpZXM6W10sYmxvY2tzOlt7dHlwZTplLGRlcHRoOjAsZGF0YTp0fHxuZXcgdS5NYXAoe30pfV19fSx3PWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm57dGV4dDpcIlxcclwiLGlubGluZXM6W10sZW50aXRpZXM6W10sYmxvY2tzOlt7dHlwZTplLGRlcHRoOk1hdGgubWF4KDAsTWF0aC5taW4oNCx0KSksZGF0YTpufHxuZXcgdS5NYXAoe30pfV19fSxUPWZ1bmN0aW9uKGUpe3JldHVybnt0ZXh0OlwiXFxyIFwiLGlubGluZXM6W25ldyB1Lk9yZGVyZWRTZXRdLGVudGl0aWVzOltlXSxibG9ja3M6W3t0eXBlOlwiYXRvbWljXCIsZGVwdGg6MCxkYXRhOm5ldyB1Lk1hcCh7fSl9XX19LEw9ZnVuY3Rpb24oZSx0KXtyZXR1cm57dGV4dDplLnRleHQrdC50ZXh0LGlubGluZXM6ZS5pbmxpbmVzLmNvbmNhdCh0LmlubGluZXMpLGVudGl0aWVzOmUuZW50aXRpZXMuY29uY2F0KHQuZW50aXRpZXMpLGJsb2NrczplLmJsb2Nrcy5jb25jYXQodC5ibG9ja3MpfX0sQT1uZXcgdS5NYXAoe1wiaGVhZGVyLW9uZVwiOntlbGVtZW50OlwiaDFcIn0sXCJoZWFkZXItdHdvXCI6e2VsZW1lbnQ6XCJoMlwifSxcImhlYWRlci10aHJlZVwiOntlbGVtZW50OlwiaDNcIn0sXCJoZWFkZXItZm91clwiOntlbGVtZW50OlwiaDRcIn0sXCJoZWFkZXItZml2ZVwiOntlbGVtZW50OlwiaDVcIn0sXCJoZWFkZXItc2l4XCI6e2VsZW1lbnQ6XCJoNlwifSxcInVub3JkZXJlZC1saXN0LWl0ZW1cIjp7ZWxlbWVudDpcImxpXCIsd3JhcHBlcjpcInVsXCJ9LFwib3JkZXJlZC1saXN0LWl0ZW1cIjp7ZWxlbWVudDpcImxpXCIsd3JhcHBlcjpcIm9sXCJ9LGJsb2NrcXVvdGU6e2VsZW1lbnQ6XCJibG9ja3F1b3RlXCJ9LGNvZGU6e2VsZW1lbnQ6XCJwcmVcIn0sYXRvbWljOntlbGVtZW50OlwiZmlndXJlXCJ9LHVuc3R5bGVkOntlbGVtZW50OlwicFwiLGFsaWFzZWRFbGVtZW50czpbXCJkaXZcIl19fSk7dmFyIE89e2NvZGU6XCJDT0RFXCIsZGVsOlwiU1RSSUtFVEhST1VHSFwiLGVtOlwiSVRBTElDXCIsc3Ryb25nOlwiQk9MRFwiLGluczpcIlVOREVSTElORVwiLHN1YjpcIlNVQlNDUklQVFwiLHN1cDpcIlNVUEVSU0NSSVBUXCJ9O2Z1bmN0aW9uIFMoZSl7cmV0dXJuIGUuc3R5bGUudGV4dEFsaWduP25ldyB1Lk1hcCh7XCJ0ZXh0LWFsaWduXCI6ZS5zdHlsZS50ZXh0QWxpZ259KTplLnN0eWxlLm1hcmdpbkxlZnQ/bmV3IHUuTWFwKHtcIm1hcmdpbi1sZWZ0XCI6ZS5zdHlsZS5tYXJnaW5MZWZ0fSk6dm9pZCAwfXZhciBfPWZ1bmN0aW9uKGUpe3ZhciB0PXZvaWQgMDtpZihlIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQpe3ZhciBuPXt9O3Q9ZS5kYXRhc2V0JiZ2b2lkIDAhPT1lLmRhdGFzZXQubWVudGlvbj8obi51cmw9ZS5ocmVmLG4udGV4dD1lLmlubmVySFRNTCxuLnZhbHVlPWUuZGF0YXNldC52YWx1ZSx2LkVudGl0eS5fX2NyZWF0ZShcIk1FTlRJT05cIixcIklNTVVUQUJMRVwiLG4pKToobi51cmw9ZS5nZXRBdHRyaWJ1dGUmJmUuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKXx8ZS5ocmVmLG4udGl0bGU9ZS5pbm5lckhUTUwsbi50YXJnZXRPcHRpb249ZS50YXJnZXQsdi5FbnRpdHkuX19jcmVhdGUoXCJMSU5LXCIsXCJNVVRBQkxFXCIsbikpfXJldHVybiB0fTtuLmQodCxcImRlZmF1bHRcIixmdW5jdGlvbigpe3JldHVybiByfSk7dmFyIGQ9XCIgXCIsZj1uZXcgUmVnRXhwKFwiJm5ic3A7XCIsXCJnXCIpLGo9ITA7ZnVuY3Rpb24gSShlLHQsbixyLGksYSl7dmFyIG89ZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO2lmKGEpe3ZhciBsPWEobyxlKTtpZihsKXt2YXIgYz12LkVudGl0eS5fX2NyZWF0ZShsLnR5cGUsbC5tdXRhYmlsaXR5LGwuZGF0YXx8e30pO3JldHVybntjaHVuazpUKGMpfX19aWYoXCIjdGV4dFwiPT09byYmXCJcXG5cIiE9PWUudGV4dENvbnRlbnQpcmV0dXJuIHgoZSx0LGkpO2lmKFwiYnJcIj09PW8pcmV0dXJue2NodW5rOk0oKX07aWYoXCJpbWdcIj09PW8mJmUgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KXt2YXIgdT17fTt1LnNyYz1lLmdldEF0dHJpYnV0ZSYmZS5nZXRBdHRyaWJ1dGUoXCJzcmNcIil8fGUuc3JjLHUuYWx0PWUuYWx0LHUuaGVpZ2h0PWUuc3R5bGUuaGVpZ2h0LHUud2lkdGg9ZS5zdHlsZS53aWR0aCxlLnN0eWxlLmZsb2F0JiYodS5hbGlnbm1lbnQ9ZS5zdHlsZS5mbG9hdCk7dmFyIHM9di5FbnRpdHkuX19jcmVhdGUoXCJJTUFHRVwiLFwiTVVUQUJMRVwiLHUpO3JldHVybntjaHVuazpUKHMpfX1pZihcInZpZGVvXCI9PT1vJiZlIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCl7dmFyIGQ9e307ZC5zcmM9ZS5nZXRBdHRyaWJ1dGUmJmUuZ2V0QXR0cmlidXRlKFwic3JjXCIpfHxlLnNyYyxkLmFsdD1lLmFsdCxkLmhlaWdodD1lLnN0eWxlLmhlaWdodCxkLndpZHRoPWUuc3R5bGUud2lkdGgsZS5zdHlsZS5mbG9hdCYmKGQuYWxpZ25tZW50PWUuc3R5bGUuZmxvYXQpO3ZhciBmPXYuRW50aXR5Ll9fY3JlYXRlKFwiVklERU9cIixcIk1VVEFCTEVcIixkKTtyZXR1cm57Y2h1bms6VChmKX19aWYoXCJpZnJhbWVcIj09PW8mJmUgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudCl7dmFyIG09e307bS5zcmM9ZS5nZXRBdHRyaWJ1dGUmJmUuZ2V0QXR0cmlidXRlKFwic3JjXCIpfHxlLnNyYyxtLmhlaWdodD1lLmhlaWdodCxtLndpZHRoPWUud2lkdGg7dmFyIHA9di5FbnRpdHkuX19jcmVhdGUoXCJFTUJFRERFRF9MSU5LXCIsXCJNVVRBQkxFXCIsbSk7cmV0dXJue2NodW5rOlQocCl9fXZhciBoLHk9ZnVuY3Rpb24odCxuKXt2YXIgZT1BLmZpbHRlcihmdW5jdGlvbihlKXtyZXR1cm4gZS5lbGVtZW50PT09dCYmKCFlLndyYXBwZXJ8fGUud3JhcHBlcj09PW4pfHxlLndyYXBwZXI9PT10fHxlLmFsaWFzZWRFbGVtZW50cyYmLTE8ZS5hbGlhc2VkRWxlbWVudHMuaW5kZXhPZih0KX0pLmtleVNlcSgpLnRvU2V0KCkudG9BcnJheSgpO2lmKDE9PT1lLmxlbmd0aClyZXR1cm4gZVswXX0obyxyKTt5JiYoXCJ1bFwiPT09b3x8XCJvbFwiPT09bz8ocj1vLG4rPTEpOihcInVub3JkZXJlZC1saXN0LWl0ZW1cIiE9PXkmJlwib3JkZXJlZC1saXN0LWl0ZW1cIiE9PXkmJihyPVwiXCIsbj0tMSksaj8oaD1FKHksUyhlKSksaj0hMSk6aD13KHksbixTKGUpKSkpLGg9aHx8aygpLHQ9ZnVuY3Rpb24oZSx0LG4pe3ZhciByLGk9T1tlXTtpZihpKXI9bi5hZGQoaSkudG9PcmRlcmVkU2V0KCk7ZWxzZSBpZih0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpe3ZhciBjPXQ7cj0ocj1uKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKGUpe3ZhciB0PWMuc3R5bGUuY29sb3Isbj1jLnN0eWxlLmJhY2tncm91bmRDb2xvcixyPWMuc3R5bGUuZm9udFNpemUsaT1jLnN0eWxlLmZvbnRGYW1pbHkucmVwbGFjZSgvXlwifFwiJC9nLFwiXCIpLGE9Yy5zdHlsZS5mb250V2VpZ2h0LG89Yy5zdHlsZS50ZXh0RGVjb3JhdGlvbixsPWMuc3R5bGUuZm9udFN0eWxlO3QmJmUuYWRkKFwiY29sb3ItXCIuY29uY2F0KHQucmVwbGFjZSgvIC9nLFwiXCIpKSksbiYmZS5hZGQoXCJiZ2NvbG9yLVwiLmNvbmNhdChuLnJlcGxhY2UoLyAvZyxcIlwiKSkpLHImJmUuYWRkKFwiZm9udHNpemUtXCIuY29uY2F0KHIucmVwbGFjZSgvcHgkL2csXCJcIikpKSxpJiZlLmFkZChcImZvbnRmYW1pbHktXCIuY29uY2F0KGkpKSxcImJvbGRcIj09PWEmJmUuYWRkKE8uc3Ryb25nKSxcInVuZGVybGluZVwiPT09byYmZS5hZGQoTy5pbnMpLFwiaXRhbGljXCI9PT1sJiZlLmFkZChPLmVtKX0pLnRvT3JkZXJlZFNldCgpfXJldHVybiByfShvLGUsdCk7Zm9yKHZhciBiPWUuZmlyc3RDaGlsZDtiOyl7dmFyIGc9SShiLHQsbixyLF8oYil8fGksYSkuY2h1bms7aD1MKGgsZyksYj1iLm5leHRTaWJsaW5nfXJldHVybntjaHVuazpofX1mdW5jdGlvbiByKGUsdCl7dmFyIG4scixpLGE9KG49dCxyPWUudHJpbSgpLnJlcGxhY2UoZixkKSwoaT1zKHIpKT8oaj0hMCx7Y2h1bms6SShpLG5ldyB1Lk9yZGVyZWRTZXQsLTEsXCJcIix2b2lkIDAsbikuY2h1bmt9KTpudWxsKTtpZihhKXt2YXIgbz1hLmNodW5rLGw9bmV3IHUuT3JkZXJlZE1hcCh7fSk7by5lbnRpdGllcyYmby5lbnRpdGllcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UmJihsPWwuc2V0KGUsdi5FbnRpdHkuX19nZXQoZSkpKX0pO3ZhciBjPTA7cmV0dXJue2NvbnRlbnRCbG9ja3M6by50ZXh0LnNwbGl0KFwiXFxyXCIpLm1hcChmdW5jdGlvbihlLHQpe3ZhciBuPWMrZS5sZW5ndGgscj1vJiZvLmlubGluZXMuc2xpY2UoYyxuKSxpPW8mJm8uZW50aXRpZXMuc2xpY2UoYyxuKSxhPW5ldyB1Lkxpc3Qoci5tYXAoZnVuY3Rpb24oZSx0KXt2YXIgbj17c3R5bGU6ZSxlbnRpdHk6bnVsbH07cmV0dXJuIGlbdF0mJihuLmVudGl0eT1pW3RdKSx2LkNoYXJhY3Rlck1ldGFkYXRhLmNyZWF0ZShuKX0pKTtyZXR1cm4gYz1uLG5ldyB2LkNvbnRlbnRCbG9jayh7a2V5Ok9iamVjdCh2LmdlbktleSkoKSx0eXBlOm8mJm8uYmxvY2tzW3RdJiZvLmJsb2Nrc1t0XS50eXBlfHxcInVuc3R5bGVkXCIsZGVwdGg6byYmby5ibG9ja3NbdF0mJm8uYmxvY2tzW3RdLmRlcHRoLGRhdGE6byYmby5ibG9ja3NbdF0mJm8uYmxvY2tzW3RdLmRhdGF8fG5ldyB1Lk1hcCh7fSksdGV4dDplLGNoYXJhY3Rlckxpc3Q6YX0pfSksZW50aXR5TWFwOmx9fXJldHVybiBudWxsfX1dLGkuYz1vLGkuZD1mdW5jdGlvbihlLHQsbil7aS5vKGUsdCl8fE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLHQse2VudW1lcmFibGU6ITAsZ2V0Om59KX0saS5yPWZ1bmN0aW9uKGUpe1widW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC50b1N0cmluZ1RhZyYmT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsU3ltYm9sLnRvU3RyaW5nVGFnLHt2YWx1ZTpcIk1vZHVsZVwifSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9LGkudD1mdW5jdGlvbih0LGUpe2lmKDEmZSYmKHQ9aSh0KSksOCZlKXJldHVybiB0O2lmKDQmZSYmXCJvYmplY3RcIj09dHlwZW9mIHQmJnQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDt2YXIgbj1PYmplY3QuY3JlYXRlKG51bGwpO2lmKGkucihuKSxPYmplY3QuZGVmaW5lUHJvcGVydHkobixcImRlZmF1bHRcIix7ZW51bWVyYWJsZTohMCx2YWx1ZTp0fSksMiZlJiZcInN0cmluZ1wiIT10eXBlb2YgdClmb3IodmFyIHIgaW4gdClpLmQobixyLGZ1bmN0aW9uKGUpe3JldHVybiB0W2VdfS5iaW5kKG51bGwscikpO3JldHVybiBufSxpLm49ZnVuY3Rpb24oZSl7dmFyIHQ9ZSYmZS5fX2VzTW9kdWxlP2Z1bmN0aW9uKCl7cmV0dXJuIGUuZGVmYXVsdH06ZnVuY3Rpb24oKXtyZXR1cm4gZX07cmV0dXJuIGkuZCh0LFwiYVwiLHQpLHR9LGkubz1mdW5jdGlvbihlLHQpe3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSx0KX0saS5wPVwiXCIsaShpLnM9Mik7ZnVuY3Rpb24gaShlKXtpZihvW2VdKXJldHVybiBvW2VdLmV4cG9ydHM7dmFyIHQ9b1tlXT17aTplLGw6ITEsZXhwb3J0czp7fX07cmV0dXJuIGFbZV0uY2FsbCh0LmV4cG9ydHMsdCx0LmV4cG9ydHMsaSksdC5sPSEwLHQuZXhwb3J0c312YXIgYSxvfSk7Il0sIm5hbWVzIjpbInRoaXMiLCJyZXF1aXJlJCQwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQVNBLENBQUMsVUFBVSxNQUFNLEVBQUUsT0FBTyxFQUFFO0dBQzVCLEVBQWlFLGlCQUFpQixPQUFPLEVBQUUsQ0FFN0QsQ0FBQztHQUMvQixDQUFDLENBQUNBLGNBQUksRUFBRSxZQUFZLENBQWUsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFDdkU7R0FDQSxFQUFFLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7R0FDekMsSUFBSSxJQUFJLFVBQVUsRUFBRTtHQUNwQixNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FB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SUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUMxQyxPQUFPO0dBQ1AsTUFBTSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLEdBQUc7R0FDL0MsUUFBUSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtHQUNsRCxVQUFVLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ25GLFNBQVM7R0FDVCxPQUFPLENBQUMsQ0FBQztHQUNULEtBQUssQ0FBQztBQUNOO0dBQ0EsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDakYsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0dBQzlCLFFBQVEsT0FBTyxJQUFJLENBQUM7R0FDcEIsT0FBTztHQUNQLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDcEUsTUFBTSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7R0FDN0IsTUFBTSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLEdBQUc7R0FDL0MsUUFBUSxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxHQUFHO0dBQzdDLFVBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFD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QUFNLE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7R0FDeEUsS0FBSztBQUNMO0dBQ0EsSUFBSSxTQUFTLEVBQUUsU0FBUyxTQUFTLEVBQUUsT0FBTyxFQUFFO0dBQzVDLE1BQU0sT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDM0UsS0FBSztBQUNMO0dBQ0EsSUFBSSxTQUFTLEVBQUUsU0FBUyxTQUFTLEVBQUUsT0FBTyxFQUFFO0dBQzVDLE1BQU0sT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNyRCxLQUFLO0FBQ0w7R0FDQSxJQUFJLE1BQU0sRUFBRSxTQUFTLE1BQU0sRUFBRSxVQUFVLEVBQUU7R0FDekMsTUFBTSxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztHQUNoRSxLQUFLO0FBQ0w7R0FDQSxJQUFJLElBQUksRUFBRSxTQUFTLE1BQU0sRUFBRTtHQUMzQixNQUFNLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztHQUNoRCxLQUFLO0FBQ0w7R0FDQSxJQUFJLFFBQVEsRUFBRSxTQUFTLE1BQU0sRUFBRTtHQUMvQixNQUFNLE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7R0FDeEUsS0FBSztBQUNMO0dBQ0EsSUFB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QyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxRQUFRLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxZQUFZLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLFlBQVksZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsWUFBWSxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHFCQUFxQixHQUFHLENBQUMsRUFBRSxtQkFBbUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsWUFBWSxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBVyxDQUFDLE9BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7In0=
