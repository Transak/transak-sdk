(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.TransakSDK = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = decodeUriComponent;
const token = '%[a-f0-9]{2}';
const singleMatcher = new RegExp('(' + token + ')|([^%]+?)', 'gi');
const multiMatcher = new RegExp('(' + token + ')+', 'gi');
function decodeComponents(components, split) {
  try {
    // Try to decode the entire string first
    return [decodeURIComponent(components.join(''))];
  } catch {
    // Do nothing
  }
  if (components.length === 1) {
    return components;
  }
  split = split || 1;

  // Split the array in 2 parts
  const left = components.slice(0, split);
  const right = components.slice(split);
  return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}
function decode(input) {
  try {
    return decodeURIComponent(input);
  } catch {
    let tokens = input.match(singleMatcher) || [];
    for (let i = 1; i < tokens.length; i++) {
      input = decodeComponents(tokens, i).join('');
      tokens = input.match(singleMatcher) || [];
    }
    return input;
  }
}
function customDecodeURIComponent(input) {
  // Keep track of all the replacements and prefill the map with the `BOM`
  const replaceMap = {
    '%FE%FF': '\uFFFD\uFFFD',
    '%FF%FE': '\uFFFD\uFFFD'
  };
  let match = multiMatcher.exec(input);
  while (match) {
    try {
      // Decode as big chunks as possible
      replaceMap[match[0]] = decodeURIComponent(match[0]);
    } catch {
      const result = decode(match[0]);
      if (result !== match[0]) {
        replaceMap[match[0]] = result;
      }
    }
    match = multiMatcher.exec(input);
  }

  // Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
  replaceMap['%C2'] = '\uFFFD';
  const entries = Object.keys(replaceMap);
  for (const key of entries) {
    // Replace all decoded components
    input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
  }
  return input;
}
function decodeUriComponent(encodedURI) {
  if (typeof encodedURI !== 'string') {
    throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
  }
  try {
    // Try the built in decoder first
    return decodeURIComponent(encodedURI);
  } catch {
    // Fallback to a more advanced decoder
    return customDecodeURIComponent(encodedURI);
  }
}

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.excludeKeys = excludeKeys;
exports.includeKeys = includeKeys;
function includeKeys(object, predicate) {
  const result = {};
  if (Array.isArray(predicate)) {
    for (const key of predicate) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (descriptor?.enumerable) {
        Object.defineProperty(result, key, descriptor);
      }
    }
  } else {
    // `Reflect.ownKeys()` is required to retrieve symbol properties
    for (const key of Reflect.ownKeys(object)) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (descriptor.enumerable) {
        const value = object[key];
        if (predicate(key, value, object)) {
          Object.defineProperty(result, key, descriptor);
        }
      }
    }
  }
  return result;
}
function excludeKeys(object, predicate) {
  if (Array.isArray(predicate)) {
    const set = new Set(predicate);
    return includeKeys(object, key => !set.has(key));
  }
  return includeKeys(object, (key, value, object) => !predicate(key, value, object));
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exclude = exclude;
exports.extract = extract;
exports.parse = parse;
exports.parseUrl = parseUrl;
exports.pick = pick;
exports.stringify = stringify;
exports.stringifyUrl = stringifyUrl;
var _decodeUriComponent = _interopRequireDefault(require("decode-uri-component"));
var _splitOnFirst = _interopRequireDefault(require("split-on-first"));
var _filterObj = require("filter-obj");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const isNullOrUndefined = value => value === null || value === undefined;

// eslint-disable-next-line unicorn/prefer-code-point
const strictUriEncode = string => encodeURIComponent(string).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');
function encoderForArrayFormat(options) {
  switch (options.arrayFormat) {
    case 'index':
      {
        return key => (result, value) => {
          const index = result.length;
          if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
            return result;
          }
          if (value === null) {
            return [...result, [encode(key, options), '[', index, ']'].join('')];
          }
          return [...result, [encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')];
        };
      }
    case 'bracket':
      {
        return key => (result, value) => {
          if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
            return result;
          }
          if (value === null) {
            return [...result, [encode(key, options), '[]'].join('')];
          }
          return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
        };
      }
    case 'colon-list-separator':
      {
        return key => (result, value) => {
          if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
            return result;
          }
          if (value === null) {
            return [...result, [encode(key, options), ':list='].join('')];
          }
          return [...result, [encode(key, options), ':list=', encode(value, options)].join('')];
        };
      }
    case 'comma':
    case 'separator':
    case 'bracket-separator':
      {
        const keyValueSep = options.arrayFormat === 'bracket-separator' ? '[]=' : '=';
        return key => (result, value) => {
          if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
            return result;
          }

          // Translate null to an empty string so that it doesn't serialize as 'null'
          value = value === null ? '' : value;
          if (result.length === 0) {
            return [[encode(key, options), keyValueSep, encode(value, options)].join('')];
          }
          return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
        };
      }
    default:
      {
        return key => (result, value) => {
          if (value === undefined || options.skipNull && value === null || options.skipEmptyString && value === '') {
            return result;
          }
          if (value === null) {
            return [...result, encode(key, options)];
          }
          return [...result, [encode(key, options), '=', encode(value, options)].join('')];
        };
      }
  }
}
function parserForArrayFormat(options) {
  let result;
  switch (options.arrayFormat) {
    case 'index':
      {
        return (key, value, accumulator) => {
          result = /\[(\d*)]$/.exec(key);
          key = key.replace(/\[\d*]$/, '');
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === undefined) {
            accumulator[key] = {};
          }
          accumulator[key][result[1]] = value;
        };
      }
    case 'bracket':
      {
        return (key, value, accumulator) => {
          result = /(\[])$/.exec(key);
          key = key.replace(/\[]$/, '');
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === undefined) {
            accumulator[key] = [value];
            return;
          }
          accumulator[key] = [...accumulator[key], value];
        };
      }
    case 'colon-list-separator':
      {
        return (key, value, accumulator) => {
          result = /(:list)$/.exec(key);
          key = key.replace(/:list$/, '');
          if (!result) {
            accumulator[key] = value;
            return;
          }
          if (accumulator[key] === undefined) {
            accumulator[key] = [value];
            return;
          }
          accumulator[key] = [...accumulator[key], value];
        };
      }
    case 'comma':
    case 'separator':
      {
        return (key, value, accumulator) => {
          const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
          const isEncodedArray = typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
          value = isEncodedArray ? decode(value, options) : value;
          const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
          accumulator[key] = newValue;
        };
      }
    case 'bracket-separator':
      {
        return (key, value, accumulator) => {
          const isArray = /(\[])$/.test(key);
          key = key.replace(/\[]$/, '');
          if (!isArray) {
            accumulator[key] = value ? decode(value, options) : value;
            return;
          }
          const arrayValue = value === null ? [] : value.split(options.arrayFormatSeparator).map(item => decode(item, options));
          if (accumulator[key] === undefined) {
            accumulator[key] = arrayValue;
            return;
          }
          accumulator[key] = [...accumulator[key], ...arrayValue];
        };
      }
    default:
      {
        return (key, value, accumulator) => {
          if (accumulator[key] === undefined) {
            accumulator[key] = value;
            return;
          }
          accumulator[key] = [...[accumulator[key]].flat(), value];
        };
      }
  }
}
function validateArrayFormatSeparator(value) {
  if (typeof value !== 'string' || value.length !== 1) {
    throw new TypeError('arrayFormatSeparator must be single character string');
  }
}
function encode(value, options) {
  if (options.encode) {
    return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
  }
  return value;
}
function decode(value, options) {
  if (options.decode) {
    return (0, _decodeUriComponent.default)(value);
  }
  return value;
}
function keysSorter(input) {
  if (Array.isArray(input)) {
    return input.sort();
  }
  if (typeof input === 'object') {
    return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map(key => input[key]);
  }
  return input;
}
function removeHash(input) {
  const hashStart = input.indexOf('#');
  if (hashStart !== -1) {
    input = input.slice(0, hashStart);
  }
  return input;
}
function getHash(url) {
  let hash = '';
  const hashStart = url.indexOf('#');
  if (hashStart !== -1) {
    hash = url.slice(hashStart);
  }
  return hash;
}
function parseValue(value, options) {
  if (options.parseNumbers && !Number.isNaN(Number(value)) && typeof value === 'string' && value.trim() !== '') {
    value = Number(value);
  } else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
    value = value.toLowerCase() === 'true';
  }
  return value;
}
function extract(input) {
  input = removeHash(input);
  const queryStart = input.indexOf('?');
  if (queryStart === -1) {
    return '';
  }
  return input.slice(queryStart + 1);
}
function parse(query, options) {
  options = {
    decode: true,
    sort: true,
    arrayFormat: 'none',
    arrayFormatSeparator: ',',
    parseNumbers: false,
    parseBooleans: false,
    ...options
  };
  validateArrayFormatSeparator(options.arrayFormatSeparator);
  const formatter = parserForArrayFormat(options);

  // Create an object with no prototype
  const returnValue = Object.create(null);
  if (typeof query !== 'string') {
    return returnValue;
  }
  query = query.trim().replace(/^[?#&]/, '');
  if (!query) {
    return returnValue;
  }
  for (const parameter of query.split('&')) {
    if (parameter === '') {
      continue;
    }
    const parameter_ = options.decode ? parameter.replace(/\+/g, ' ') : parameter;
    let [key, value] = (0, _splitOnFirst.default)(parameter_, '=');
    if (key === undefined) {
      key = parameter_;
    }

    // Missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    value = value === undefined ? null : ['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options);
    formatter(decode(key, options), value, returnValue);
  }
  for (const [key, value] of Object.entries(returnValue)) {
    if (typeof value === 'object' && value !== null) {
      for (const [key2, value2] of Object.entries(value)) {
        value[key2] = parseValue(value2, options);
      }
    } else {
      returnValue[key] = parseValue(value, options);
    }
  }
  if (options.sort === false) {
    return returnValue;
  }

  // TODO: Remove the use of `reduce`.
  // eslint-disable-next-line unicorn/no-array-reduce
  return (options.sort === true ? Object.keys(returnValue).sort() : Object.keys(returnValue).sort(options.sort)).reduce((result, key) => {
    const value = returnValue[key];
    if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
      // Sort object keys, not values
      result[key] = keysSorter(value);
    } else {
      result[key] = value;
    }
    return result;
  }, Object.create(null));
}
function stringify(object, options) {
  if (!object) {
    return '';
  }
  options = {
    encode: true,
    strict: true,
    arrayFormat: 'none',
    arrayFormatSeparator: ',',
    ...options
  };
  validateArrayFormatSeparator(options.arrayFormatSeparator);
  const shouldFilter = key => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === '';
  const formatter = encoderForArrayFormat(options);
  const objectCopy = {};
  for (const [key, value] of Object.entries(object)) {
    if (!shouldFilter(key)) {
      objectCopy[key] = value;
    }
  }
  const keys = Object.keys(objectCopy);
  if (options.sort !== false) {
    keys.sort(options.sort);
  }
  return keys.map(key => {
    const value = object[key];
    if (value === undefined) {
      return '';
    }
    if (value === null) {
      return encode(key, options);
    }
    if (Array.isArray(value)) {
      if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
        return encode(key, options) + '[]';
      }
      return value.reduce(formatter(key), []).join('&');
    }
    return encode(key, options) + '=' + encode(value, options);
  }).filter(x => x.length > 0).join('&');
}
function parseUrl(url, options) {
  options = {
    decode: true,
    ...options
  };
  let [url_, hash] = (0, _splitOnFirst.default)(url, '#');
  if (url_ === undefined) {
    url_ = url;
  }
  return {
    url: url_?.split('?')?.[0] ?? '',
    query: parse(extract(url), options),
    ...(options && options.parseFragmentIdentifier && hash ? {
      fragmentIdentifier: decode(hash, options)
    } : {})
  };
}
function stringifyUrl(object, options) {
  options = {
    encode: true,
    strict: true,
    [encodeFragmentIdentifier]: true,
    ...options
  };
  const url = removeHash(object.url).split('?')[0] || '';
  const queryFromUrl = extract(object.url);
  const query = {
    ...parse(queryFromUrl, {
      sort: false
    }),
    ...object.query
  };
  let queryString = stringify(query, options);
  if (queryString) {
    queryString = `?${queryString}`;
  }
  let hash = getHash(object.url);
  if (object.fragmentIdentifier) {
    const urlObjectForFragmentEncode = new URL(url);
    urlObjectForFragmentEncode.hash = object.fragmentIdentifier;
    hash = options[encodeFragmentIdentifier] ? urlObjectForFragmentEncode.hash : `#${object.fragmentIdentifier}`;
  }
  return `${url}${queryString}${hash}`;
}
function pick(input, filter, options) {
  options = {
    parseFragmentIdentifier: true,
    [encodeFragmentIdentifier]: false,
    ...options
  };
  const {
    url,
    query,
    fragmentIdentifier
  } = parseUrl(input, options);
  return stringifyUrl({
    url,
    query: (0, _filterObj.includeKeys)(query, filter),
    fragmentIdentifier
  }, options);
}
function exclude(input, filter, options) {
  const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);
  return pick(input, exclusionFilter, options);
}

},{"decode-uri-component":1,"filter-obj":3,"split-on-first":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var queryString = _interopRequireWildcard(require("./base.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var _default = queryString;
exports.default = _default;

},{"./base.js":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = splitOnFirst;
function splitOnFirst(string, separator) {
  if (!(typeof string === 'string' && typeof separator === 'string')) {
    throw new TypeError('Expected the arguments to be of type `string`');
  }
  if (string === '' || separator === '') {
    return [];
  }
  const separatorIndex = string.indexOf(separator);
  if (separatorIndex === -1) {
    return [];
  }
  return [string.slice(0, separatorIndex), string.slice(separatorIndex + separator.length)];
}

},{}],7:[function(require,module,exports){
module.exports={
  "private": true,
  "name": "@transak/transak-sdk",
  "version": "1.3.0",
  "description": "Transak SDK that allows you to easily integrate the fiat on/ramp",
  "main": "dist/sdk.js",
  "scripts": {
    "eslint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "eslint:fix": "yarn eslint --fix",
    "build": "browserify ./src/index.js -o ./dist/sdk.js -p esmify -s TransakSDK"
  },
  "repository": {
    "url": "https://github.com/Transak/transak-sdk"
  },
  "engines": {
    "node": ">=10.0.0"
  },
  "author": "Transak",
  "license": "ISC",
  "keywords": [
    "crypto",
    "cryptocurrency",
    "fiat",
    "on",
    "off",
    "ramp"
  ],
  "dependencies": {
    "events": "^3.3.0",
    "query-string": "^8.1.0"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "browserify": "^17.0.0",
    "eslint": "^8.49.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^17.1.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-eslint-comments": "^3.2.0",
    "eslint-plugin-import": "^2.28.1",
    "eslint-plugin-no-relative-import-paths": "^1.5.2",
    "eslint-plugin-prettier": "^5.0.0",
    "eslint-plugin-promise": "^6.1.1",
    "eslint-plugin-testing-library": "^6.0.1",
    "eslint-plugin-vitest": "^0.3.1",
    "esmify": "^2.1.1",
    "typescript": "^5.2.2"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCSS = getCSS;
function getCSS(themeColor, height, width) {
  return `
/* Modal Content/Box */
.transak_close {
    float: right;
      animation: 5s transak_fadeIn;
      animation-fill-mode: forwards;
      visibility: hidden;
    transition: 0.5s;
    position: absolute;
    right: -5px;
    width: 35px;
    margin-top: -15px;
    height: 35px;
    font-weight: bold;
    z-index: 1;
    background: white;
    color: #${themeColor};
    border-radius: 50%;
}

@keyframes transak_fadeIn {
  0% {
    opacity: 0;
  }
  50% {
   visibility: hidden;
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
}

.transak_close:hover,
.transak_close:focus {
  color: white;
  background: #${themeColor};
  text-decoration: none;
  cursor: pointer;
}

.transak_modal {
  display: block;
  width: ${width};
  max-width: 500px;
  height: ${height};
  max-height: 100%;
  position: fixed;
  z-index: 100;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
      border: none;
    border-radius: 2%;
    margin: 0px auto;
    display: block;
}
.transak_closed {
  display: none;
}

#transakOnOffRampWidget{
 min-height: ${height}; 
    position: absolute; 
    border: none; 
    border-radius: 2%; 
    margin: 0px auto; 
    display: block;
}

.transak_modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  
  background: rgba(0, 0, 0, 0.6);
}

.transak_modal-content{
  width: 100%;
  height: 100%;
  overflow: auto;
}

.transak_modal .close-button {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 20px;
  background: black;
  color: white;
  padding: 5px 10px;
  font-size: 1.3rem;
}

.transak_transakContainer{
    height: 100%;
    width:100%;
}

#transakFiatOnOffRamp{
    margin-left: 10px;
    margin-right: 10px;
}


@media all and (max-width: ${width}) {
  .transak_modal {
    height: 100%;
    max-height:${height};
    top: 53%;
  }
}

@media all and (max-height: ${height}) and (max-width: ${width}) {
    #transakOnOffRampWidget{
    padding-bottom: 15px;
    }
}
`;
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeSVGIcon = void 0;
let closeSVGIcon = `<svg version="1.1" fill="currentColor" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
\t viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
<g>
\t<g id="_x31_0_23_">
\t\t<g>
\t\t\t<path d="M306,0C136.992,0,0,136.992,0,306s136.992,306,306,306c168.988,0,306-137.012,306-306S475.008,0,306,0z M414.19,387.147
\t\t\t\tc7.478,7.478,7.478,19.584,0,27.043c-7.479,7.478-19.584,7.478-27.043,0l-81.032-81.033l-81.588,81.588
\t\t\t\tc-7.535,7.516-19.737,7.516-27.253,0c-7.535-7.535-7.535-19.737,0-27.254l81.587-81.587l-81.033-81.033
\t\t\t\tc-7.478-7.478-7.478-19.584,0-27.042c7.478-7.478,19.584-7.478,27.042,0l81.033,81.033l82.181-82.18
\t\t\t\tc7.535-7.535,19.736-7.535,27.253,0c7.535,7.535,7.535,19.737,0,27.253l-82.181,82.181L414.19,387.147z"/>
\t\t</g>
\t</g>
</g>
</svg>`;
exports.closeSVGIcon = closeSVGIcon;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  SOMETHING_WRONG: `[Transak SDK] => Oops something went wrong please try again. Contact us at hello@transak.com`,
  ENTER_API_KEY: `[Transak SDK] => Please enter your API Key`,
  NOT_INITIALIZED_PROPERLY: `[Transak SDK] => Transak SDK is not initialized properly`
};
exports.default = _default;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  TRANSAK_WIDGET_INITIALISED: 'TRANSAK_WIDGET_INITIALISED',
  TRANSAK_WIDGET_OPEN: 'TRANSAK_WIDGET_OPEN',
  TRANSAK_WIDGET_CLOSE_REQUEST: 'TRANSAK_WIDGET_CLOSE_REQUEST',
  TRANSAK_WIDGET_CLOSE: 'TRANSAK_WIDGET_CLOSE',
  TRANSAK_ORDER_CREATED: 'TRANSAK_ORDER_CREATED',
  TRANSAK_ORDER_CANCELLED: 'TRANSAK_ORDER_CANCELLED',
  TRANSAK_ORDER_FAILED: 'TRANSAK_ORDER_FAILED',
  TRANSAK_ORDER_SUCCESSFUL: 'TRANSAK_ORDER_SUCCESSFUL',
  TRANSAK_WALLET_REDIRECTION: 'TRANSAK_WALLET_REDIRECTION'
};
exports.default = _default;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  ENVIRONMENT: {
    STAGING: {
      FRONTEND: 'https://global-stg.transak.com',
      BACKEND: 'https://api-stg.transak.com/api/v2',
      NAME: 'STAGING'
    },
    LOCAL_DEVELOPMENT: {
      FRONTEND: 'http://localhost:5005',
      BACKEND: 'https://api-stg.transak.com/api/v2',
      NAME: 'LOCAL_DEVELOPMENT'
    },
    PRODUCTION: {
      FRONTEND: 'https://global.transak.com',
      BACKEND: 'https://api.transak.com/api/v2',
      NAME: 'PRODUCTION'
    }
  },
  STATUS: {
    INIT: 'init',
    TRANSAK_INITIALISED: 'transak_initialised'
  }
};
exports.default = _default;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "EVENTS", {
  enumerable: true,
  get: function () {
    return _events.default;
  }
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _globalConfig.default;
  }
});
Object.defineProperty(exports, "errorsLang", {
  enumerable: true,
  get: function () {
    return _errors.default;
  }
});
var _globalConfig = _interopRequireDefault(require("./globalConfig"));
var _errors = _interopRequireDefault(require("./errors"));
var _events = _interopRequireDefault(require("./events"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./errors":10,"./events":11,"./globalConfig":12}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _events = _interopRequireDefault(require("events"));
var _queryString = _interopRequireDefault(require("query-string"));
var _constants = require("./constants");
var _svg = require("./assets/svg");
var _css = require("./assets/css");
var _package = require("../package.json");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const eventEmitter = new _events.default.EventEmitter();
function TransakSDK(partnerData) {
  this.sdkVersion = _package.version;
  this.partnerData = partnerData;
  this.isInitialised = false;
  this.EVENTS = _constants.EVENTS;
  this.ALL_EVENTS = '*';
  this.ERROR = 'TRANSAK_ERROR';
}
TransakSDK.prototype.on = function (type, cb) {
  if (type === this.ALL_EVENTS) {
    for (let eventName in _constants.EVENTS) {
      eventEmitter.on(_constants.EVENTS[eventName], cb);
    }
  }
  if (_constants.EVENTS[type]) eventEmitter.on(type, cb);
  if (type === this.ERROR) eventEmitter.on(this.ERROR, cb);
};
TransakSDK.prototype.init = function () {
  this.modal(this);
};
TransakSDK.prototype.close = async function () {
  let modal = document.getElementById('transakFiatOnOffRamp');
  if (modal && modal.style) {
    modal.style.display = 'none';
    modal.innerHTML = '';
    await modal.remove();
  }
};
TransakSDK.prototype.closeRequest = function () {
  let iframeEl = document.getElementById('transakOnOffRampWidget');
  if (iframeEl) iframeEl.contentWindow.postMessage({
    event_id: _constants.EVENTS.TRANSAK_WIDGET_CLOSE_REQUEST,
    data: true
  }, '*');
};
TransakSDK.prototype.modal = async function () {
  try {
    if (this.partnerData) {
      let {
        url,
        width,
        height,
        partnerData
      } = await generateURL({
        ...this.partnerData,
        sdkVersion: this.sdkVersion
      });
      let wrapper = document.createElement('div');
      wrapper.id = 'transakFiatOnOffRamp';
      wrapper.innerHTML = `
        <div class="transak_modal-overlay" id="transak_modal-overlay"></div>
        <div class="transak_modal" id="transak_modal">
          <div class="transak_modal-content">
            <span class="transak_close">${_svg.closeSVGIcon}</span>
            <div class="transakContainer">
              <iframe id="transakOnOffRampWidget" allow="camera;microphone;fullscreen;payment" allowFullScreen src="${url}" style="width: ${width}; height: ${height}"></iframe>
            </div>
          </div>
        </div>
      `;
      let container = document.getElementsByTagName('body');
      if (!container) container = document.getElementsByTagName('html');
      if (!container) container = document.getElementsByTagName('div');
      await container[0].appendChild(wrapper);
      await setStyle(this.partnerData.themeColor, width, height);
      let modal = document.getElementById('transakFiatOnOffRamp');
      let span = document.getElementsByClassName('transak_close')[0];

      //Prevent background scrolling when overlay appears
      document.documentElement.style.overflow = 'hidden';
      document.body.scroll = 'no';
      if (modal && modal.style) modal.style.display = 'block';
      this.isInitialised = true;
      eventEmitter.emit(_constants.EVENTS.TRANSAK_WIDGET_INITIALISED, {
        status: true,
        eventName: _constants.EVENTS.TRANSAK_WIDGET_INITIALISED
      });

      // When the user clicks on <span> (x), close the modal
      span.onclick = () => {
        return this.closeRequest();
      };

      // When the user clicks anywhere outside the modal, close it
      window.onclick = event => {
        if (event.target === document.getElementById('transak_modal-overlay')) this.closeRequest();
      };
      if (window.addEventListener) window.addEventListener('message', handleMessage);else window.attachEvent('onmessage', handleMessage);
    }
  } catch (e) {
    throw e;
  }
};
async function generateURL(configData) {
  let partnerData = {},
    environment = 'development',
    queryString = '',
    width = '100%',
    height = '100%';
  if (configData) {
    if (configData.apiKey) {
      if (configData.environment) {
        if (_constants.config.ENVIRONMENT[configData.environment]) environment = _constants.config.ENVIRONMENT[configData.environment].NAME;
      }
      try {
        environment = environment.toUpperCase();
        Object.keys(configData).map(key => {
          if (configData[key] instanceof Object) {
            partnerData[key] = JSON.stringify(configData[key]);
          } else partnerData[key] = configData[key];
        });
        queryString = _queryString.default.stringify(partnerData, {
          arrayFormat: 'comma'
        });
      } catch (e) {
        throw e;
      }
    } else throw _constants.errorsLang.ENTER_API_KEY;
    if (configData.widgetWidth) width = configData.widgetWidth;
    if (configData.widgetHeight) height = configData.widgetHeight;
  }
  return {
    width,
    height,
    partnerData,
    url: `${_constants.config.ENVIRONMENT[environment].FRONTEND}?${queryString}`
  };
}
async function setStyle(themeColor, width, height) {
  let style = await document.createElement('style');
  style.innerHTML = (0, _css.getCSS)(themeColor, height, width);
  let modal = document.getElementById('transakFiatOnOffRamp');
  if (modal) await modal.appendChild(style);
}
function handleMessage(event) {
  let environment;
  if (event.origin === _constants.config.ENVIRONMENT.LOCAL_DEVELOPMENT.FRONTEND) environment = _constants.config.ENVIRONMENT.LOCAL_DEVELOPMENT.NAME;else if (event.origin === _constants.config.ENVIRONMENT.PRODUCTION.FRONTEND) environment = _constants.config.ENVIRONMENT.PRODUCTION.NAME;else if (event.origin === _constants.config.ENVIRONMENT.STAGING.FRONTEND) environment = _constants.config.ENVIRONMENT.STAGING.NAME;
  if (environment) {
    if (event && event.data && event.data.event_id) {
      switch (event.data.event_id) {
        case _constants.EVENTS.TRANSAK_WIDGET_CLOSE:
          {
            eventEmitter.emit(_constants.EVENTS.TRANSAK_WIDGET_CLOSE, {
              status: true,
              eventName: _constants.EVENTS.TRANSAK_WIDGET_CLOSE
            });

            //enable background scrolling when overlay appears
            document.documentElement.style.overflow = 'scroll';
            document.body.scroll = 'yes';
            let modal = document.getElementById('transakFiatOnOffRamp');
            if (modal && modal.style) {
              modal.style.display = 'none';
              modal.innerHTML = '';
              modal.remove();
            }
            break;
          }
        case _constants.EVENTS.TRANSAK_ORDER_CREATED:
          {
            eventEmitter.emit(_constants.EVENTS.TRANSAK_ORDER_CREATED, {
              status: event.data.data,
              eventName: _constants.EVENTS.TRANSAK_ORDER_CREATED
            });
            break;
          }
        case _constants.EVENTS.TRANSAK_ORDER_CANCELLED:
          {
            eventEmitter.emit(_constants.EVENTS.TRANSAK_ORDER_CANCELLED, {
              status: event.data.data,
              eventName: _constants.EVENTS.TRANSAK_ORDER_CANCELLED
            });
            break;
          }
        case _constants.EVENTS.TRANSAK_ORDER_FAILED:
          {
            eventEmitter.emit(_constants.EVENTS.TRANSAK_ORDER_FAILED, {
              status: event.data.data,
              eventName: _constants.EVENTS.TRANSAK_ORDER_FAILED
            });
            break;
          }
        case _constants.EVENTS.TRANSAK_ORDER_SUCCESSFUL:
          {
            eventEmitter.emit(_constants.EVENTS.TRANSAK_ORDER_SUCCESSFUL, {
              status: event.data.data,
              eventName: _constants.EVENTS.TRANSAK_ORDER_SUCCESSFUL
            });
            break;
          }
        case _constants.EVENTS.TRANSAK_WIDGET_OPEN:
          {
            eventEmitter.emit(_constants.EVENTS.TRANSAK_WIDGET_OPEN, {
              status: true,
              eventName: _constants.EVENTS.TRANSAK_WIDGET_OPEN
            });
            break;
          }
        case 'WALLET_REDIRECTION':
          {
            eventEmitter.emit(_constants.EVENTS.TRANSAK_WALLET_REDIRECTION, {
              status: event.data.data,
              eventName: _constants.EVENTS.TRANSAK_WALLET_REDIRECTION
            });
            break;
          }
        default:
          {}
      }
    }
  }
}
var _default = TransakSDK;
exports.default = _default;

},{"../package.json":7,"./assets/css":8,"./assets/svg":9,"./constants":13,"events":2,"query-string":5}]},{},[14])(14)
});
