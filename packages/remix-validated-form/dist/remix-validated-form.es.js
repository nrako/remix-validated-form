import React, { createContext, useDebugValue, useContext, useCallback, useEffect, useMemo, useRef, useLayoutEffect, useState } from "react";
import { useActionData, useMatches, useTransition, Form, useSubmit } from "@remix-run/react";
var __spreadArray = globalThis && globalThis.__spreadArray || function(to, from2, pack) {
  if (pack || arguments.length === 2)
    for (var i2 = 0, l2 = from2.length, ar; i2 < l2; i2++) {
      if (ar || !(i2 in from2)) {
        if (!ar)
          ar = Array.prototype.slice.call(from2, 0, i2);
        ar[i2] = from2[i2];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from2));
};
function purry(fn2, args, lazy) {
  var diff = fn2.length - args.length;
  var arrayArgs = Array.from(args);
  if (diff === 0) {
    return fn2.apply(void 0, arrayArgs);
  }
  if (diff === 1) {
    var ret = function(data) {
      return fn2.apply(void 0, __spreadArray([data], arrayArgs, false));
    };
    if (lazy || fn2.lazy) {
      ret.lazy = lazy || fn2.lazy;
      ret.lazyArgs = args;
    }
    return ret;
  }
  throw new Error("Wrong number of arguments");
}
function _reduceLazy(array, lazy, indexed) {
  return array.reduce(function(acc, item, index) {
    var result = indexed ? lazy(item, index, array) : lazy(item);
    if (result.hasMany === true) {
      acc.push.apply(acc, result.next);
    } else if (result.hasNext === true) {
      acc.push(result.next);
    }
    return acc;
  }, []);
}
var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;
function equals() {
  return purry(_equals, arguments);
}
function _equals(a2, b2) {
  if (a2 === b2) {
    return true;
  }
  if (a2 && b2 && typeof a2 === "object" && typeof b2 === "object") {
    var arrA = isArray(a2);
    var arrB = isArray(b2);
    var i2 = void 0;
    var length = void 0;
    var key = void 0;
    if (arrA && arrB) {
      length = a2.length;
      if (length !== b2.length) {
        return false;
      }
      for (i2 = length; i2-- !== 0; ) {
        if (!equals(a2[i2], b2[i2])) {
          return false;
        }
      }
      return true;
    }
    if (arrA !== arrB) {
      return false;
    }
    var dateA = a2 instanceof Date;
    var dateB = b2 instanceof Date;
    if (dateA !== dateB) {
      return false;
    }
    if (dateA && dateB) {
      return a2.getTime() === b2.getTime();
    }
    var regexpA = a2 instanceof RegExp;
    var regexpB = b2 instanceof RegExp;
    if (regexpA !== regexpB) {
      return false;
    }
    if (regexpA && regexpB) {
      return a2.toString() === b2.toString();
    }
    var keys = keyList(a2);
    length = keys.length;
    if (length !== keyList(b2).length) {
      return false;
    }
    for (i2 = length; i2-- !== 0; ) {
      if (!hasProp.call(b2, keys[i2])) {
        return false;
      }
    }
    for (i2 = length; i2-- !== 0; ) {
      key = keys[i2];
      if (!equals(a2[key], b2[key])) {
        return false;
      }
    }
    return true;
  }
  return a2 !== a2 && b2 !== b2;
}
function omit() {
  return purry(_omit, arguments);
}
function _omit(object, names) {
  var set = new Set(names);
  return Object.entries(object).reduce(function(acc, _a) {
    var name = _a[0], value = _a[1];
    if (!set.has(name)) {
      acc[name] = value;
    }
    return acc;
  }, {});
}
function omitBy() {
  return purry(_omitBy, arguments);
}
function _omitBy(object, fn2) {
  return Object.keys(object).reduce(function(acc, key) {
    if (!fn2(object[key], key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
}
function pathOr() {
  return purry(_pathOr, arguments);
}
function _pathOr(object, path, defaultValue) {
  var current = object;
  for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
    var prop = path_1[_i];
    if (current == null || current[prop] == null) {
      return defaultValue;
    }
    current = current[prop];
  }
  return current;
}
function uniq() {
  return purry(_uniq, arguments, uniq.lazy);
}
function _uniq(array) {
  return _reduceLazy(array, uniq.lazy());
}
(function(uniq2) {
  function lazy() {
    var set = /* @__PURE__ */ new Set();
    return function(value) {
      if (set.has(value)) {
        return {
          done: false,
          hasNext: false
        };
      }
      set.add(value);
      return {
        done: false,
        hasNext: true,
        next: value
      };
    };
  }
  uniq2.lazy = lazy;
})(uniq || (uniq = {}));
const getCheckboxChecked = (checkboxValue = "on", newValue) => {
  if (Array.isArray(newValue))
    return newValue.some((val) => val === true || val === checkboxValue);
  if (typeof newValue === "boolean")
    return newValue;
  if (typeof newValue === "string")
    return newValue === checkboxValue;
  return void 0;
};
const getRadioChecked = (radioValue = "on", newValue) => {
  if (typeof newValue === "string")
    return newValue === radioValue;
  return void 0;
};
const defaultValidationBehavior = {
  initial: "onBlur",
  whenTouched: "onChange",
  whenSubmitted: "onChange"
};
const createGetInputProps = ({
  clearError,
  validate,
  defaultValue,
  touched,
  setTouched,
  hasBeenSubmitted,
  validationBehavior,
  name
}) => {
  const validationBehaviors = {
    ...defaultValidationBehavior,
    ...validationBehavior
  };
  return (props = {}) => {
    const behavior = hasBeenSubmitted ? validationBehaviors.whenSubmitted : touched ? validationBehaviors.whenTouched : validationBehaviors.initial;
    const inputProps = {
      ...props,
      onChange: (...args) => {
        var _a;
        if (behavior === "onChange")
          validate();
        else
          clearError();
        return (_a = props == null ? void 0 : props.onChange) == null ? void 0 : _a.call(props, ...args);
      },
      onBlur: (...args) => {
        var _a;
        if (behavior === "onBlur")
          validate();
        setTouched(true);
        return (_a = props == null ? void 0 : props.onBlur) == null ? void 0 : _a.call(props, ...args);
      },
      name
    };
    if (props.type === "checkbox") {
      inputProps.defaultChecked = getCheckboxChecked(props.value, defaultValue);
    } else if (props.type === "radio") {
      inputProps.defaultChecked = getRadioChecked(props.value, defaultValue);
    } else if (props.value === void 0) {
      inputProps.defaultValue = defaultValue;
    }
    return omitBy(inputProps, (value) => value === void 0);
  };
};
const stringToPathArray = (path) => {
  if (path.length === 0)
    return [];
  const match = path.match(/^\[(.+?)\](.*)$/) || path.match(/^\.?([^\.\[\]]+)(.*)$/);
  if (match) {
    const [_2, key, rest] = match;
    return [/^\d+$/.test(key) ? Number(key) : key, ...stringToPathArray(rest)];
  }
  return [path];
};
function setPath(object, path, defaultValue) {
  return _setPathNormalized(object, stringToPathArray(path), defaultValue);
}
function _setPathNormalized(object, path, value) {
  var _a;
  const leadingSegments = path.slice(0, -1);
  const lastSegment = path[path.length - 1];
  let obj = object;
  for (let i2 = 0; i2 < leadingSegments.length; i2++) {
    const segment = leadingSegments[i2];
    if (obj[segment] === void 0) {
      const nextSegment = (_a = leadingSegments[i2 + 1]) != null ? _a : lastSegment;
      obj[segment] = typeof nextSegment === "number" ? [] : {};
    }
    obj = obj[segment];
  }
  obj[lastSegment] = value;
  return object;
}
const getPath = (object, path) => pathOr(object, stringToPathArray(path), void 0);
var isProduction = true;
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix);
  }
  var provided = typeof message === "function" ? message() : message;
  var value = provided ? prefix + ": " + provided : prefix;
  throw new Error(value);
}
const FORM_ID_FIELD = "__rvfInternalFormId";
const FORM_DEFAULTS_FIELD = "__rvfInternalFormDefaults";
const formDefaultValuesKey = (formId) => `${FORM_DEFAULTS_FIELD}_${formId}`;
const InternalFormContext = createContext(null);
const serverData = (data) => ({
  hydrateTo: () => data,
  map: (fn2) => serverData(fn2(data))
});
const hydratedData = () => ({
  hydrateTo: (hydratedData2) => hydratedData2,
  map: () => hydratedData()
});
const from = (data, hydrated) => hydrated ? hydratedData() : serverData(data);
const hydratable = {
  serverData,
  hydratedData,
  from
};
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace2) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (nextState !== state) {
      const previousState = state;
      state = replace2 ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => listeners.clear();
  const api = { setState, getState, subscribe, destroy };
  state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
var withSelector = { exports: {} };
var withSelector_production_min = {};
var shim = { exports: {} };
var useSyncExternalStoreShim_production_min = {};
/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var e = React;
function h$2(a2, b2) {
  return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
}
var k$1 = "function" === typeof Object.is ? Object.is : h$2, l$1 = e.useState, m = e.useEffect, n$2 = e.useLayoutEffect, p$2 = e.useDebugValue;
function q$2(a2, b2) {
  var d2 = b2(), f2 = l$1({ inst: { value: d2, getSnapshot: b2 } }), c2 = f2[0].inst, g2 = f2[1];
  n$2(function() {
    c2.value = d2;
    c2.getSnapshot = b2;
    r$2(c2) && g2({ inst: c2 });
  }, [a2, d2, b2]);
  m(function() {
    r$2(c2) && g2({ inst: c2 });
    return a2(function() {
      r$2(c2) && g2({ inst: c2 });
    });
  }, [a2]);
  p$2(d2);
  return d2;
}
function r$2(a2) {
  var b2 = a2.getSnapshot;
  a2 = a2.value;
  try {
    var d2 = b2();
    return !k$1(a2, d2);
  } catch (f2) {
    return true;
  }
}
function t$2(a2, b2) {
  return b2();
}
var u$2 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t$2 : q$2;
useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e.useSyncExternalStore ? e.useSyncExternalStore : u$2;
{
  shim.exports = useSyncExternalStoreShim_production_min;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var h$1 = React, n$1 = shim.exports;
function p$1(a2, b2) {
  return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
}
var q$1 = "function" === typeof Object.is ? Object.is : p$1, r$1 = n$1.useSyncExternalStore, t$1 = h$1.useRef, u$1 = h$1.useEffect, v$1 = h$1.useMemo, w$1 = h$1.useDebugValue;
withSelector_production_min.useSyncExternalStoreWithSelector = function(a2, b2, e2, l2, g2) {
  var c2 = t$1(null);
  if (null === c2.current) {
    var f2 = { hasValue: false, value: null };
    c2.current = f2;
  } else
    f2 = c2.current;
  c2 = v$1(function() {
    function a3(a4) {
      if (!c3) {
        c3 = true;
        d3 = a4;
        a4 = l2(a4);
        if (void 0 !== g2 && f2.hasValue) {
          var b3 = f2.value;
          if (g2(b3, a4))
            return k2 = b3;
        }
        return k2 = a4;
      }
      b3 = k2;
      if (q$1(d3, a4))
        return b3;
      var e3 = l2(a4);
      if (void 0 !== g2 && g2(b3, e3))
        return b3;
      d3 = a4;
      return k2 = e3;
    }
    var c3 = false, d3, k2, m2 = void 0 === e2 ? null : e2;
    return [function() {
      return a3(b2());
    }, null === m2 ? void 0 : function() {
      return a3(m2());
    }];
  }, [b2, e2, l2, g2]);
  var d2 = r$1(a2, c2[0], c2[1]);
  u$1(function() {
    f2.hasValue = true;
    f2.value = d2;
  }, [d2]);
  w$1(d2);
  return d2;
};
{
  withSelector.exports = withSelector_production_min;
}
function useStore(api, selector = api.getState, equalityFn) {
  const slice = withSelector.exports.useSyncExternalStoreWithSelector(api.subscribe, api.getState, api.getServerState || api.getState, selector, equalityFn);
  useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = typeof createState === "function" ? createStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
var create$1 = create;
function n(n2) {
  for (var r2 = arguments.length, t2 = Array(r2 > 1 ? r2 - 1 : 0), e2 = 1; e2 < r2; e2++)
    t2[e2 - 1] = arguments[e2];
  throw Error("[Immer] minified error nr: " + n2 + (t2.length ? " " + t2.map(function(n3) {
    return "'" + n3 + "'";
  }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf");
}
function r(n2) {
  return !!n2 && !!n2[Q];
}
function t(n2) {
  return !!n2 && (function(n3) {
    if (!n3 || "object" != typeof n3)
      return false;
    var r2 = Object.getPrototypeOf(n3);
    if (null === r2)
      return true;
    var t2 = Object.hasOwnProperty.call(r2, "constructor") && r2.constructor;
    return t2 === Object || "function" == typeof t2 && Function.toString.call(t2) === Z;
  }(n2) || Array.isArray(n2) || !!n2[L] || !!n2.constructor[L] || s(n2) || v(n2));
}
function i(n2, r2, t2) {
  void 0 === t2 && (t2 = false), 0 === o(n2) ? (t2 ? Object.keys : nn)(n2).forEach(function(e2) {
    t2 && "symbol" == typeof e2 || r2(e2, n2[e2], n2);
  }) : n2.forEach(function(t3, e2) {
    return r2(e2, t3, n2);
  });
}
function o(n2) {
  var r2 = n2[Q];
  return r2 ? r2.i > 3 ? r2.i - 4 : r2.i : Array.isArray(n2) ? 1 : s(n2) ? 2 : v(n2) ? 3 : 0;
}
function u(n2, r2) {
  return 2 === o(n2) ? n2.has(r2) : Object.prototype.hasOwnProperty.call(n2, r2);
}
function a(n2, r2) {
  return 2 === o(n2) ? n2.get(r2) : n2[r2];
}
function f(n2, r2, t2) {
  var e2 = o(n2);
  2 === e2 ? n2.set(r2, t2) : 3 === e2 ? (n2.delete(r2), n2.add(t2)) : n2[r2] = t2;
}
function c(n2, r2) {
  return n2 === r2 ? 0 !== n2 || 1 / n2 == 1 / r2 : n2 != n2 && r2 != r2;
}
function s(n2) {
  return X && n2 instanceof Map;
}
function v(n2) {
  return q && n2 instanceof Set;
}
function p(n2) {
  return n2.o || n2.t;
}
function l(n2) {
  if (Array.isArray(n2))
    return Array.prototype.slice.call(n2);
  var r2 = rn(n2);
  delete r2[Q];
  for (var t2 = nn(r2), e2 = 0; e2 < t2.length; e2++) {
    var i2 = t2[e2], o2 = r2[i2];
    false === o2.writable && (o2.writable = true, o2.configurable = true), (o2.get || o2.set) && (r2[i2] = { configurable: true, writable: true, enumerable: o2.enumerable, value: n2[i2] });
  }
  return Object.create(Object.getPrototypeOf(n2), r2);
}
function d(n2, e2) {
  return void 0 === e2 && (e2 = false), y(n2) || r(n2) || !t(n2) ? n2 : (o(n2) > 1 && (n2.set = n2.add = n2.clear = n2.delete = h), Object.freeze(n2), e2 && i(n2, function(n3, r2) {
    return d(r2, true);
  }, true), n2);
}
function h() {
  n(2);
}
function y(n2) {
  return null == n2 || "object" != typeof n2 || Object.isFrozen(n2);
}
function b(r2) {
  var t2 = tn[r2];
  return t2 || n(18, r2), t2;
}
function _() {
  return U;
}
function j(n2, r2) {
  r2 && (b("Patches"), n2.u = [], n2.s = [], n2.v = r2);
}
function O(n2) {
  g(n2), n2.p.forEach(S), n2.p = null;
}
function g(n2) {
  n2 === U && (U = n2.l);
}
function w(n2) {
  return U = { p: [], l: U, h: n2, m: true, _: 0 };
}
function S(n2) {
  var r2 = n2[Q];
  0 === r2.i || 1 === r2.i ? r2.j() : r2.O = true;
}
function P(r2, e2) {
  e2._ = e2.p.length;
  var i2 = e2.p[0], o2 = void 0 !== r2 && r2 !== i2;
  return e2.h.g || b("ES5").S(e2, r2, o2), o2 ? (i2[Q].P && (O(e2), n(4)), t(r2) && (r2 = M(e2, r2), e2.l || x(e2, r2)), e2.u && b("Patches").M(i2[Q].t, r2, e2.u, e2.s)) : r2 = M(e2, i2, []), O(e2), e2.u && e2.v(e2.u, e2.s), r2 !== H ? r2 : void 0;
}
function M(n2, r2, t2) {
  if (y(r2))
    return r2;
  var e2 = r2[Q];
  if (!e2)
    return i(r2, function(i2, o3) {
      return A(n2, e2, r2, i2, o3, t2);
    }, true), r2;
  if (e2.A !== n2)
    return r2;
  if (!e2.P)
    return x(n2, e2.t, true), e2.t;
  if (!e2.I) {
    e2.I = true, e2.A._--;
    var o2 = 4 === e2.i || 5 === e2.i ? e2.o = l(e2.k) : e2.o;
    i(3 === e2.i ? new Set(o2) : o2, function(r3, i2) {
      return A(n2, e2, o2, r3, i2, t2);
    }), x(n2, o2, false), t2 && n2.u && b("Patches").R(e2, t2, n2.u, n2.s);
  }
  return e2.o;
}
function A(e2, i2, o2, a2, c2, s2) {
  if (r(c2)) {
    var v2 = M(e2, c2, s2 && i2 && 3 !== i2.i && !u(i2.D, a2) ? s2.concat(a2) : void 0);
    if (f(o2, a2, v2), !r(v2))
      return;
    e2.m = false;
  }
  if (t(c2) && !y(c2)) {
    if (!e2.h.F && e2._ < 1)
      return;
    M(e2, c2), i2 && i2.A.l || x(e2, c2);
  }
}
function x(n2, r2, t2) {
  void 0 === t2 && (t2 = false), n2.h.F && n2.m && d(r2, t2);
}
function z(n2, r2) {
  var t2 = n2[Q];
  return (t2 ? p(t2) : n2)[r2];
}
function I(n2, r2) {
  if (r2 in n2)
    for (var t2 = Object.getPrototypeOf(n2); t2; ) {
      var e2 = Object.getOwnPropertyDescriptor(t2, r2);
      if (e2)
        return e2;
      t2 = Object.getPrototypeOf(t2);
    }
}
function k(n2) {
  n2.P || (n2.P = true, n2.l && k(n2.l));
}
function E(n2) {
  n2.o || (n2.o = l(n2.t));
}
function R(n2, r2, t2) {
  var e2 = s(r2) ? b("MapSet").N(r2, t2) : v(r2) ? b("MapSet").T(r2, t2) : n2.g ? function(n3, r3) {
    var t3 = Array.isArray(n3), e3 = { i: t3 ? 1 : 0, A: r3 ? r3.A : _(), P: false, I: false, D: {}, l: r3, t: n3, k: null, o: null, j: null, C: false }, i2 = e3, o2 = en;
    t3 && (i2 = [e3], o2 = on);
    var u2 = Proxy.revocable(i2, o2), a2 = u2.revoke, f2 = u2.proxy;
    return e3.k = f2, e3.j = a2, f2;
  }(r2, t2) : b("ES5").J(r2, t2);
  return (t2 ? t2.A : _()).p.push(e2), e2;
}
function D(e2) {
  return r(e2) || n(22, e2), function n2(r2) {
    if (!t(r2))
      return r2;
    var e3, u2 = r2[Q], c2 = o(r2);
    if (u2) {
      if (!u2.P && (u2.i < 4 || !b("ES5").K(u2)))
        return u2.t;
      u2.I = true, e3 = F(r2, c2), u2.I = false;
    } else
      e3 = F(r2, c2);
    return i(e3, function(r3, t2) {
      u2 && a(u2.t, r3) === t2 || f(e3, r3, n2(t2));
    }), 3 === c2 ? new Set(e3) : e3;
  }(e2);
}
function F(n2, r2) {
  switch (r2) {
    case 2:
      return new Map(n2);
    case 3:
      return Array.from(n2);
  }
  return l(n2);
}
var G, U, W = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x"), X = "undefined" != typeof Map, q = "undefined" != typeof Set, B = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect, H = W ? Symbol.for("immer-nothing") : ((G = {})["immer-nothing"] = true, G), L = W ? Symbol.for("immer-draftable") : "__$immer_draftable", Q = W ? Symbol.for("immer-state") : "__$immer_state", Z = "" + Object.prototype.constructor, nn = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function(n2) {
  return Object.getOwnPropertyNames(n2).concat(Object.getOwnPropertySymbols(n2));
} : Object.getOwnPropertyNames, rn = Object.getOwnPropertyDescriptors || function(n2) {
  var r2 = {};
  return nn(n2).forEach(function(t2) {
    r2[t2] = Object.getOwnPropertyDescriptor(n2, t2);
  }), r2;
}, tn = {}, en = { get: function(n2, r2) {
  if (r2 === Q)
    return n2;
  var e2 = p(n2);
  if (!u(e2, r2))
    return function(n3, r3, t2) {
      var e3, i3 = I(r3, t2);
      return i3 ? "value" in i3 ? i3.value : null === (e3 = i3.get) || void 0 === e3 ? void 0 : e3.call(n3.k) : void 0;
    }(n2, e2, r2);
  var i2 = e2[r2];
  return n2.I || !t(i2) ? i2 : i2 === z(n2.t, r2) ? (E(n2), n2.o[r2] = R(n2.A.h, i2, n2)) : i2;
}, has: function(n2, r2) {
  return r2 in p(n2);
}, ownKeys: function(n2) {
  return Reflect.ownKeys(p(n2));
}, set: function(n2, r2, t2) {
  var e2 = I(p(n2), r2);
  if (null == e2 ? void 0 : e2.set)
    return e2.set.call(n2.k, t2), true;
  if (!n2.P) {
    var i2 = z(p(n2), r2), o2 = null == i2 ? void 0 : i2[Q];
    if (o2 && o2.t === t2)
      return n2.o[r2] = t2, n2.D[r2] = false, true;
    if (c(t2, i2) && (void 0 !== t2 || u(n2.t, r2)))
      return true;
    E(n2), k(n2);
  }
  return n2.o[r2] === t2 && "number" != typeof t2 && (void 0 !== t2 || r2 in n2.o) || (n2.o[r2] = t2, n2.D[r2] = true, true);
}, deleteProperty: function(n2, r2) {
  return void 0 !== z(n2.t, r2) || r2 in n2.t ? (n2.D[r2] = false, E(n2), k(n2)) : delete n2.D[r2], n2.o && delete n2.o[r2], true;
}, getOwnPropertyDescriptor: function(n2, r2) {
  var t2 = p(n2), e2 = Reflect.getOwnPropertyDescriptor(t2, r2);
  return e2 ? { writable: true, configurable: 1 !== n2.i || "length" !== r2, enumerable: e2.enumerable, value: t2[r2] } : e2;
}, defineProperty: function() {
  n(11);
}, getPrototypeOf: function(n2) {
  return Object.getPrototypeOf(n2.t);
}, setPrototypeOf: function() {
  n(12);
} }, on = {};
i(en, function(n2, r2) {
  on[n2] = function() {
    return arguments[0] = arguments[0][0], r2.apply(this, arguments);
  };
}), on.deleteProperty = function(r2, t2) {
  return on.set.call(this, r2, t2, void 0);
}, on.set = function(r2, t2, e2) {
  return en.set.call(this, r2[0], t2, e2, r2[0]);
};
var un = function() {
  function e2(r2) {
    var e3 = this;
    this.g = B, this.F = true, this.produce = function(r3, i3, o2) {
      if ("function" == typeof r3 && "function" != typeof i3) {
        var u2 = i3;
        i3 = r3;
        var a2 = e3;
        return function(n2) {
          var r4 = this;
          void 0 === n2 && (n2 = u2);
          for (var t2 = arguments.length, e4 = Array(t2 > 1 ? t2 - 1 : 0), o3 = 1; o3 < t2; o3++)
            e4[o3 - 1] = arguments[o3];
          return a2.produce(n2, function(n3) {
            var t3;
            return (t3 = i3).call.apply(t3, [r4, n3].concat(e4));
          });
        };
      }
      var f2;
      if ("function" != typeof i3 && n(6), void 0 !== o2 && "function" != typeof o2 && n(7), t(r3)) {
        var c2 = w(e3), s2 = R(e3, r3, void 0), v2 = true;
        try {
          f2 = i3(s2), v2 = false;
        } finally {
          v2 ? O(c2) : g(c2);
        }
        return "undefined" != typeof Promise && f2 instanceof Promise ? f2.then(function(n2) {
          return j(c2, o2), P(n2, c2);
        }, function(n2) {
          throw O(c2), n2;
        }) : (j(c2, o2), P(f2, c2));
      }
      if (!r3 || "object" != typeof r3) {
        if (void 0 === (f2 = i3(r3)) && (f2 = r3), f2 === H && (f2 = void 0), e3.F && d(f2, true), o2) {
          var p2 = [], l2 = [];
          b("Patches").M(r3, f2, p2, l2), o2(p2, l2);
        }
        return f2;
      }
      n(21, r3);
    }, this.produceWithPatches = function(n2, r3) {
      if ("function" == typeof n2)
        return function(r4) {
          for (var t3 = arguments.length, i4 = Array(t3 > 1 ? t3 - 1 : 0), o3 = 1; o3 < t3; o3++)
            i4[o3 - 1] = arguments[o3];
          return e3.produceWithPatches(r4, function(r5) {
            return n2.apply(void 0, [r5].concat(i4));
          });
        };
      var t2, i3, o2 = e3.produce(n2, r3, function(n3, r4) {
        t2 = n3, i3 = r4;
      });
      return "undefined" != typeof Promise && o2 instanceof Promise ? o2.then(function(n3) {
        return [n3, t2, i3];
      }) : [o2, t2, i3];
    }, "boolean" == typeof (null == r2 ? void 0 : r2.useProxies) && this.setUseProxies(r2.useProxies), "boolean" == typeof (null == r2 ? void 0 : r2.autoFreeze) && this.setAutoFreeze(r2.autoFreeze);
  }
  var i2 = e2.prototype;
  return i2.createDraft = function(e3) {
    t(e3) || n(8), r(e3) && (e3 = D(e3));
    var i3 = w(this), o2 = R(this, e3, void 0);
    return o2[Q].C = true, g(i3), o2;
  }, i2.finishDraft = function(r2, t2) {
    var e3 = r2 && r2[Q];
    var i3 = e3.A;
    return j(i3, t2), P(void 0, i3);
  }, i2.setAutoFreeze = function(n2) {
    this.F = n2;
  }, i2.setUseProxies = function(r2) {
    r2 && !B && n(20), this.g = r2;
  }, i2.applyPatches = function(n2, t2) {
    var e3;
    for (e3 = t2.length - 1; e3 >= 0; e3--) {
      var i3 = t2[e3];
      if (0 === i3.path.length && "replace" === i3.op) {
        n2 = i3.value;
        break;
      }
    }
    e3 > -1 && (t2 = t2.slice(e3 + 1));
    var o2 = b("Patches").$;
    return r(n2) ? o2(n2, t2) : this.produce(n2, function(n3) {
      return o2(n3, t2);
    });
  }, e2;
}(), an = new un(), fn = an.produce;
an.produceWithPatches.bind(an);
an.setAutoFreeze.bind(an);
an.setUseProxies.bind(an);
an.applyPatches.bind(an);
an.createDraft.bind(an);
an.finishDraft.bind(an);
const immerImpl = (initializer) => (set, get, store) => {
  store.setState = (updater, replace2, ...a2) => {
    const nextState = typeof updater === "function" ? fn(updater) : updater;
    return set(nextState, replace2, ...a2);
  };
  return initializer(store.setState, get, store);
};
const immer = immerImpl;
const requestSubmit = (element, submitter) => {
  if (typeof Object.getPrototypeOf(element).requestSubmit === "function" && true) {
    element.requestSubmit(submitter);
    return;
  }
  if (submitter) {
    validateSubmitter(element, submitter);
    submitter.click();
    return;
  }
  const dummySubmitter = document.createElement("input");
  dummySubmitter.type = "submit";
  dummySubmitter.hidden = true;
  element.appendChild(dummySubmitter);
  dummySubmitter.click();
  element.removeChild(dummySubmitter);
};
function validateSubmitter(element, submitter) {
  const isHtmlElement = submitter instanceof HTMLElement;
  if (!isHtmlElement) {
    raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
  }
  const hasSubmitType = "type" in submitter && submitter.type === "submit";
  if (!hasSubmitType)
    raise(TypeError, "The specified element is not a submit button");
  const isForCorrectForm = "form" in submitter && submitter.form === element;
  if (!isForCorrectForm)
    raise(
      DOMException,
      "The specified element is not owned by this form element",
      "NotFoundError"
    );
}
function raise(errorConstructor, message, name) {
  throw new errorConstructor(
    "Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".",
    name
  );
}
const getArray = (values, field) => {
  const value = getPath(values, field);
  if (value === void 0 || value === null) {
    const newValue = [];
    setPath(values, field, newValue);
    return newValue;
  }
  invariant(
    Array.isArray(value),
    `FieldArray: defaultValue value for ${field} must be an array, null, or undefined`
  );
  return value;
};
const swap = (array, indexA, indexB) => {
  const itemA = array[indexA];
  const itemB = array[indexB];
  const hasItemA = indexA in array;
  const hasItemB = indexB in array;
  if (hasItemA) {
    array[indexB] = itemA;
  } else {
    delete array[indexB];
  }
  if (hasItemB) {
    array[indexA] = itemB;
  } else {
    delete array[indexA];
  }
};
function sparseSplice(array, start, deleteCount, item) {
  if (array.length < start && item) {
    array.length = start;
  }
  if (arguments.length === 4)
    return array.splice(start, deleteCount, item);
  return array.splice(start, deleteCount);
}
const move = (array, from2, to) => {
  const [item] = sparseSplice(array, from2, 1);
  sparseSplice(array, to, 0, item);
};
const insert = (array, index, value) => {
  sparseSplice(array, index, 0, value);
};
const remove = (array, index) => {
  sparseSplice(array, index, 1);
};
const replace = (array, index, value) => {
  sparseSplice(array, index, 1, value);
};
const mutateAsArray = (field, obj, mutate) => {
  const beforeKeys = /* @__PURE__ */ new Set();
  const arr = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith(field) && key !== field) {
      beforeKeys.add(key);
      setPath(arr, key.substring(field.length), value);
    }
  }
  mutate(arr);
  for (const key of beforeKeys) {
    delete obj[key];
  }
  const newKeys = getDeepArrayPaths(arr);
  for (const key of newKeys) {
    const val = getPath(arr, key);
    if (val !== void 0) {
      obj[`${field}${key}`] = val;
    }
  }
};
const getDeepArrayPaths = (obj, basePath = "") => {
  if (Array.isArray(obj)) {
    return obj.flatMap(
      (item, index) => getDeepArrayPaths(item, `${basePath}[${index}]`)
    );
  }
  if (typeof obj === "object") {
    return Object.keys(obj).flatMap(
      (key) => getDeepArrayPaths(obj[key], `${basePath}.${key}`)
    );
  }
  return [basePath];
};
const noOp = () => {
};
const defaultFormState = {
  isHydrated: false,
  isSubmitting: false,
  hasBeenSubmitted: false,
  touchedFields: {},
  fieldErrors: {},
  formElement: null,
  isValid: () => true,
  startSubmit: noOp,
  endSubmit: noOp,
  setTouched: noOp,
  setFieldError: noOp,
  setFieldErrors: noOp,
  clearFieldError: noOp,
  currentDefaultValues: {},
  reset: () => noOp,
  syncFormProps: noOp,
  setFormElement: noOp,
  validateField: async () => null,
  validate: async () => {
    throw new Error("Validate called before form was initialized.");
  },
  submit: async () => {
    throw new Error("Submit called before form was initialized.");
  },
  resetFormElement: noOp,
  getValues: () => new FormData(),
  controlledFields: {
    values: {},
    refCounts: {},
    valueUpdatePromises: {},
    valueUpdateResolvers: {},
    register: noOp,
    unregister: noOp,
    setValue: noOp,
    getValue: noOp,
    kickoffValueUpdate: noOp,
    awaitValueUpdate: async () => {
      throw new Error("AwaitValueUpdate called before form was initialized.");
    },
    array: {
      push: noOp,
      swap: noOp,
      move: noOp,
      insert: noOp,
      unshift: noOp,
      remove: noOp,
      pop: noOp,
      replace: noOp
    }
  }
};
const createFormState = (set, get) => ({
  isHydrated: false,
  isSubmitting: false,
  hasBeenSubmitted: false,
  touchedFields: {},
  fieldErrors: {},
  formElement: null,
  currentDefaultValues: {},
  isValid: () => Object.keys(get().fieldErrors).length === 0,
  startSubmit: () => set((state) => {
    state.isSubmitting = true;
    state.hasBeenSubmitted = true;
  }),
  endSubmit: () => set((state) => {
    state.isSubmitting = false;
  }),
  setTouched: (fieldName, touched) => set((state) => {
    state.touchedFields[fieldName] = touched;
  }),
  setFieldError: (fieldName, error) => set((state) => {
    state.fieldErrors[fieldName] = error;
  }),
  setFieldErrors: (errors) => set((state) => {
    state.fieldErrors = errors;
  }),
  clearFieldError: (fieldName) => set((state) => {
    delete state.fieldErrors[fieldName];
  }),
  reset: () => set((state) => {
    var _a, _b;
    state.fieldErrors = {};
    state.touchedFields = {};
    state.hasBeenSubmitted = false;
    const nextDefaults = (_b = (_a = state.formProps) == null ? void 0 : _a.defaultValues) != null ? _b : {};
    state.controlledFields.values = nextDefaults;
    state.currentDefaultValues = nextDefaults;
  }),
  syncFormProps: (props) => set((state) => {
    if (!state.isHydrated) {
      state.controlledFields.values = props.defaultValues;
      state.currentDefaultValues = props.defaultValues;
    }
    state.formProps = props;
    state.isHydrated = true;
  }),
  setFormElement: (formElement) => {
    if (get().formElement === formElement)
      return;
    set((state) => {
      state.formElement = formElement;
    });
  },
  validateField: async (field) => {
    var _a, _b, _c;
    const formElement = get().formElement;
    invariant(
      formElement,
      "Cannot find reference to form. This is probably a bug in remix-validated-form."
    );
    const validator = (_a = get().formProps) == null ? void 0 : _a.validator;
    invariant(
      validator,
      "Cannot validator. This is probably a bug in remix-validated-form."
    );
    await ((_c = (_b = get().controlledFields).awaitValueUpdate) == null ? void 0 : _c.call(_b, field));
    const { error } = await validator.validateField(
      new FormData(formElement),
      field
    );
    if (error) {
      get().setFieldError(field, error);
      return error;
    } else {
      get().clearFieldError(field);
      return null;
    }
  },
  validate: async () => {
    var _a;
    const formElement = get().formElement;
    invariant(
      formElement,
      "Cannot find reference to form. This is probably a bug in remix-validated-form."
    );
    const validator = (_a = get().formProps) == null ? void 0 : _a.validator;
    invariant(
      validator,
      "Cannot validator. This is probably a bug in remix-validated-form."
    );
    const result = await validator.validate(new FormData(formElement));
    if (result.error)
      get().setFieldErrors(result.error.fieldErrors);
    return result;
  },
  submit: () => {
    const formElement = get().formElement;
    invariant(
      formElement,
      "Cannot find reference to form. This is probably a bug in remix-validated-form."
    );
    requestSubmit(formElement);
  },
  getValues: () => {
    var _a;
    return new FormData((_a = get().formElement) != null ? _a : void 0);
  },
  resetFormElement: () => {
    var _a;
    return (_a = get().formElement) == null ? void 0 : _a.reset();
  },
  controlledFields: {
    values: {},
    refCounts: {},
    valueUpdatePromises: {},
    valueUpdateResolvers: {},
    register: (fieldName) => {
      set((state) => {
        var _a;
        const current = (_a = state.controlledFields.refCounts[fieldName]) != null ? _a : 0;
        state.controlledFields.refCounts[fieldName] = current + 1;
      });
    },
    unregister: (fieldName) => {
      if (get() === null || get() === void 0)
        return;
      set((state) => {
        var _a, _b, _c;
        const current = (_a = state.controlledFields.refCounts[fieldName]) != null ? _a : 0;
        if (current > 1) {
          state.controlledFields.refCounts[fieldName] = current - 1;
          return;
        }
        const isNested = Object.keys(state.controlledFields.refCounts).some(
          (key) => fieldName.startsWith(key) && key !== fieldName
        );
        if (!isNested) {
          setPath(
            state.controlledFields.values,
            fieldName,
            getPath((_b = state.formProps) == null ? void 0 : _b.defaultValues, fieldName)
          );
          setPath(
            state.currentDefaultValues,
            fieldName,
            getPath((_c = state.formProps) == null ? void 0 : _c.defaultValues, fieldName)
          );
        }
        delete state.controlledFields.refCounts[fieldName];
      });
    },
    getValue: (fieldName) => getPath(get().controlledFields.values, fieldName),
    setValue: (fieldName, value) => {
      set((state) => {
        setPath(state.controlledFields.values, fieldName, value);
      });
      get().controlledFields.kickoffValueUpdate(fieldName);
    },
    kickoffValueUpdate: (fieldName) => {
      const clear = () => set((state) => {
        delete state.controlledFields.valueUpdateResolvers[fieldName];
        delete state.controlledFields.valueUpdatePromises[fieldName];
      });
      set((state) => {
        const promise = new Promise((resolve) => {
          state.controlledFields.valueUpdateResolvers[fieldName] = resolve;
        }).then(clear);
        state.controlledFields.valueUpdatePromises[fieldName] = promise;
      });
    },
    awaitValueUpdate: async (fieldName) => {
      await get().controlledFields.valueUpdatePromises[fieldName];
    },
    array: {
      push: (fieldName, item) => {
        set((state) => {
          getArray(state.controlledFields.values, fieldName).push(item);
          getArray(state.currentDefaultValues, fieldName).push(item);
        });
        get().controlledFields.kickoffValueUpdate(fieldName);
      },
      swap: (fieldName, indexA, indexB) => {
        set((state) => {
          swap(
            getArray(state.controlledFields.values, fieldName),
            indexA,
            indexB
          );
          swap(
            getArray(state.currentDefaultValues, fieldName),
            indexA,
            indexB
          );
          mutateAsArray(
            fieldName,
            state.touchedFields,
            (array) => swap(array, indexA, indexB)
          );
          mutateAsArray(
            fieldName,
            state.fieldErrors,
            (array) => swap(array, indexA, indexB)
          );
        });
        get().controlledFields.kickoffValueUpdate(fieldName);
      },
      move: (fieldName, from2, to) => {
        set((state) => {
          move(
            getArray(state.controlledFields.values, fieldName),
            from2,
            to
          );
          move(
            getArray(state.currentDefaultValues, fieldName),
            from2,
            to
          );
          mutateAsArray(
            fieldName,
            state.touchedFields,
            (array) => move(array, from2, to)
          );
          mutateAsArray(
            fieldName,
            state.fieldErrors,
            (array) => move(array, from2, to)
          );
        });
        get().controlledFields.kickoffValueUpdate(fieldName);
      },
      insert: (fieldName, index, item) => {
        set((state) => {
          insert(
            getArray(state.controlledFields.values, fieldName),
            index,
            item
          );
          insert(
            getArray(state.currentDefaultValues, fieldName),
            index,
            item
          );
          mutateAsArray(
            fieldName,
            state.touchedFields,
            (array) => insert(array, index, false)
          );
          mutateAsArray(
            fieldName,
            state.fieldErrors,
            (array) => insert(array, index, void 0)
          );
        });
        get().controlledFields.kickoffValueUpdate(fieldName);
      },
      remove: (fieldName, index) => {
        set((state) => {
          remove(
            getArray(state.controlledFields.values, fieldName),
            index
          );
          remove(
            getArray(state.currentDefaultValues, fieldName),
            index
          );
          mutateAsArray(
            fieldName,
            state.touchedFields,
            (array) => remove(array, index)
          );
          mutateAsArray(
            fieldName,
            state.fieldErrors,
            (array) => remove(array, index)
          );
        });
        get().controlledFields.kickoffValueUpdate(fieldName);
      },
      pop: (fieldName) => {
        set((state) => {
          getArray(state.controlledFields.values, fieldName).pop();
          getArray(state.currentDefaultValues, fieldName).pop();
          mutateAsArray(
            fieldName,
            state.touchedFields,
            (array) => array.pop()
          );
          mutateAsArray(
            fieldName,
            state.fieldErrors,
            (array) => array.pop()
          );
        });
        get().controlledFields.kickoffValueUpdate(fieldName);
      },
      unshift: (fieldName, value) => {
        set((state) => {
          getArray(state.controlledFields.values, fieldName).unshift(value);
          getArray(state.currentDefaultValues, fieldName).unshift(value);
          mutateAsArray(
            fieldName,
            state.touchedFields,
            (array) => array.unshift(false)
          );
          mutateAsArray(
            fieldName,
            state.fieldErrors,
            (array) => array.unshift(void 0)
          );
        });
      },
      replace: (fieldName, index, item) => {
        set((state) => {
          replace(
            getArray(state.controlledFields.values, fieldName),
            index,
            item
          );
          replace(
            getArray(state.currentDefaultValues, fieldName),
            index,
            item
          );
          mutateAsArray(
            fieldName,
            state.touchedFields,
            (array) => replace(array, index, item)
          );
          mutateAsArray(
            fieldName,
            state.fieldErrors,
            (array) => replace(array, index, item)
          );
        });
        get().controlledFields.kickoffValueUpdate(fieldName);
      }
    }
  }
});
const useRootFormStore = create$1()(
  immer((set, get) => ({
    forms: {},
    form: (formId) => {
      var _a;
      return (_a = get().forms[formId]) != null ? _a : defaultFormState;
    },
    cleanupForm: (formId) => {
      set((state) => {
        delete state.forms[formId];
      });
    },
    registerForm: (formId) => {
      if (get().forms[formId])
        return;
      set((state) => {
        state.forms[formId] = createFormState(
          (setter) => set((state2) => setter(state2.forms[formId])),
          () => get().forms[formId]
        );
      });
    }
  }))
);
const useFormStore = (formId, selector) => {
  return useRootFormStore((state) => selector(state.form(formId)));
};
const useInternalFormContext = (formId, hookName) => {
  const formContext = useContext(InternalFormContext);
  if (formId)
    return { formId };
  if (formContext)
    return formContext;
  throw new Error(
    `Unable to determine form for ${hookName}. Please use it inside a ValidatedForm or pass a 'formId'.`
  );
};
function useErrorResponseForForm({
  fetcher,
  subaction,
  formId
}) {
  var _a;
  const actionData = useActionData();
  if (fetcher) {
    if ((_a = fetcher.data) == null ? void 0 : _a.fieldErrors)
      return fetcher.data;
    return null;
  }
  if (!(actionData == null ? void 0 : actionData.fieldErrors))
    return null;
  if (typeof formId === "string" && actionData.formId)
    return actionData.formId === formId ? actionData : null;
  if (!subaction && !actionData.subaction || actionData.subaction === subaction)
    return actionData;
  return null;
}
const useFieldErrorsForForm = (context) => {
  const response = useErrorResponseForForm(context);
  const hydrated = useFormStore(context.formId, (state) => state.isHydrated);
  return hydratable.from(response == null ? void 0 : response.fieldErrors, hydrated);
};
const useDefaultValuesFromLoader = ({
  formId
}) => {
  const matches = useMatches();
  if (typeof formId === "string") {
    const dataKey = formDefaultValuesKey(formId);
    const match = matches.reverse().find((match2) => match2.data && dataKey in match2.data);
    return match == null ? void 0 : match.data[dataKey];
  }
  return null;
};
const useDefaultValuesForForm = (context) => {
  const { formId, defaultValuesProp } = context;
  const hydrated = useFormStore(formId, (state) => state.isHydrated);
  const errorResponse = useErrorResponseForForm(context);
  const defaultValuesFromLoader = useDefaultValuesFromLoader(context);
  if (hydrated)
    return hydratable.hydratedData();
  if (errorResponse == null ? void 0 : errorResponse.repopulateFields) {
    invariant(
      typeof errorResponse.repopulateFields === "object",
      "repopulateFields returned something other than an object"
    );
    return hydratable.serverData(errorResponse.repopulateFields);
  }
  if (defaultValuesProp)
    return hydratable.serverData(defaultValuesProp);
  return hydratable.serverData(defaultValuesFromLoader);
};
const useHasActiveFormSubmit = ({
  fetcher
}) => {
  const transition = useTransition();
  const hasActiveSubmission = fetcher ? fetcher.state === "submitting" : !!transition.submission;
  return hasActiveSubmission;
};
const useFieldTouched = (field, { formId }) => {
  const touched = useFormStore(formId, (state) => state.touchedFields[field]);
  const setFieldTouched = useFormStore(formId, (state) => state.setTouched);
  const setTouched = useCallback(
    (touched2) => setFieldTouched(field, touched2),
    [field, setFieldTouched]
  );
  return [touched, setTouched];
};
const useFieldError = (name, context) => {
  const fieldErrors = useFieldErrorsForForm(context);
  const state = useFormStore(
    context.formId,
    (state2) => state2.fieldErrors[name]
  );
  return fieldErrors.map((fieldErrors2) => fieldErrors2 == null ? void 0 : fieldErrors2[name]).hydrateTo(state);
};
const useClearError = (context) => {
  const { formId } = context;
  return useFormStore(formId, (state) => state.clearFieldError);
};
const useCurrentDefaultValueForField = (formId, field) => useFormStore(formId, (state) => getPath(state.currentDefaultValues, field));
const useFieldDefaultValue = (name, context) => {
  const defaultValues = useDefaultValuesForForm(context);
  const state = useCurrentDefaultValueForField(context.formId, name);
  return defaultValues.map((val) => getPath(val, name)).hydrateTo(state);
};
const useInternalIsSubmitting = (formId) => useFormStore(formId, (state) => state.isSubmitting);
const useInternalIsValid = (formId) => useFormStore(formId, (state) => state.isValid());
const useInternalHasBeenSubmitted = (formId) => useFormStore(formId, (state) => state.hasBeenSubmitted);
const useValidateField = (formId) => useFormStore(formId, (state) => state.validateField);
const useValidate = (formId) => useFormStore(formId, (state) => state.validate);
const noOpReceiver = () => () => {
};
const useRegisterReceiveFocus = (formId) => useFormStore(
  formId,
  (state) => {
    var _a, _b;
    return (_b = (_a = state.formProps) == null ? void 0 : _a.registerReceiveFocus) != null ? _b : noOpReceiver;
  }
);
const defaultDefaultValues = {};
const useSyncedDefaultValues = (formId) => useFormStore(
  formId,
  (state) => {
    var _a, _b;
    return (_b = (_a = state.formProps) == null ? void 0 : _a.defaultValues) != null ? _b : defaultDefaultValues;
  }
);
const useSetTouched = ({ formId }) => useFormStore(formId, (state) => state.setTouched);
const useTouchedFields = (formId) => useFormStore(formId, (state) => state.touchedFields);
const useFieldErrors = (formId) => useFormStore(formId, (state) => state.fieldErrors);
const useSetFieldErrors = (formId) => useFormStore(formId, (state) => state.setFieldErrors);
const useResetFormElement = (formId) => useFormStore(formId, (state) => state.resetFormElement);
const useSubmitForm = (formId) => useFormStore(formId, (state) => state.submit);
const useFormActionProp = (formId) => useFormStore(formId, (state) => {
  var _a;
  return (_a = state.formProps) == null ? void 0 : _a.action;
});
const useFormSubactionProp = (formId) => useFormStore(formId, (state) => {
  var _a;
  return (_a = state.formProps) == null ? void 0 : _a.subaction;
});
const useFormValues = (formId) => useFormStore(formId, (state) => state.getValues);
const useControlledFieldValue = (context, field) => {
  const value = useFormStore(
    context.formId,
    (state) => state.controlledFields.getValue(field)
  );
  const isFormHydrated = useFormStore(
    context.formId,
    (state) => state.isHydrated
  );
  const defaultValue = useFieldDefaultValue(field, context);
  return isFormHydrated ? value : defaultValue;
};
const useRegisterControlledField = (context, field) => {
  const resolveUpdate = useFormStore(
    context.formId,
    (state) => state.controlledFields.valueUpdateResolvers[field]
  );
  useEffect(() => {
    resolveUpdate == null ? void 0 : resolveUpdate();
  }, [resolveUpdate]);
  const register = useFormStore(
    context.formId,
    (state) => state.controlledFields.register
  );
  const unregister = useFormStore(
    context.formId,
    (state) => state.controlledFields.unregister
  );
  useEffect(() => {
    register(field);
    return () => unregister(field);
  }, [context.formId, field, register, unregister]);
};
const useControllableValue = (context, field) => {
  useRegisterControlledField(context, field);
  const setControlledFieldValue = useFormStore(
    context.formId,
    (state) => state.controlledFields.setValue
  );
  const setValue = useCallback(
    (value2) => setControlledFieldValue(field, value2),
    [field, setControlledFieldValue]
  );
  const value = useControlledFieldValue(context, field);
  return [value, setValue];
};
const useUpdateControllableValue = (formId) => {
  const setValue = useFormStore(
    formId,
    (state) => state.controlledFields.setValue
  );
  return useCallback(
    (field, value) => setValue(field, value),
    [setValue]
  );
};
const useIsSubmitting = (formId) => {
  const formContext = useInternalFormContext(formId, "useIsSubmitting");
  return useInternalIsSubmitting(formContext.formId);
};
const useIsValid = (formId) => {
  const formContext = useInternalFormContext(formId, "useIsValid");
  return useInternalIsValid(formContext.formId);
};
const useField = (name, options) => {
  const { formId: providedFormId, handleReceiveFocus } = options != null ? options : {};
  const formContext = useInternalFormContext(providedFormId, "useField");
  const defaultValue = useFieldDefaultValue(name, formContext);
  const [touched, setTouched] = useFieldTouched(name, formContext);
  const error = useFieldError(name, formContext);
  const clearError = useClearError(formContext);
  const hasBeenSubmitted = useInternalHasBeenSubmitted(formContext.formId);
  const validateField = useValidateField(formContext.formId);
  const registerReceiveFocus = useRegisterReceiveFocus(formContext.formId);
  useEffect(() => {
    if (handleReceiveFocus)
      return registerReceiveFocus(name, handleReceiveFocus);
  }, [handleReceiveFocus, name, registerReceiveFocus]);
  const field = useMemo(() => {
    const helpers = {
      error,
      clearError: () => clearError(name),
      validate: () => {
        validateField(name);
      },
      defaultValue,
      touched,
      setTouched
    };
    const getInputProps = createGetInputProps({
      ...helpers,
      name,
      hasBeenSubmitted,
      validationBehavior: options == null ? void 0 : options.validationBehavior
    });
    return {
      ...helpers,
      getInputProps
    };
  }, [
    error,
    clearError,
    defaultValue,
    touched,
    setTouched,
    name,
    hasBeenSubmitted,
    options == null ? void 0 : options.validationBehavior,
    validateField
  ]);
  return field;
};
const useControlField = (name, formId) => {
  const context = useInternalFormContext(formId, "useControlField");
  const [value, setValue] = useControllableValue(context, name);
  return [value, setValue];
};
const useUpdateControlledField = (formId) => {
  const context = useInternalFormContext(formId, "useControlField");
  return useUpdateControllableValue(context.formId);
};
/**
 * @remix-run/server-runtime v1.6.5
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
const json = (data, init = {}) => {
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  let headers = new Headers(responseInit.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers
  });
};
function validationError(error, repopulateFields, init) {
  return json(
    {
      fieldErrors: error.fieldErrors,
      subaction: error.subaction,
      repopulateFields,
      formId: error.formId
    },
    { status: 422, ...init }
  );
}
const setFormDefaults = (formId, defaultValues) => ({
  [formDefaultValuesKey(formId)]: defaultValues
});
class MultiValueMap {
  constructor() {
    this.dict = /* @__PURE__ */ new Map();
    this.add = (key, value) => {
      if (this.dict.has(key)) {
        this.dict.get(key).push(value);
      } else {
        this.dict.set(key, [value]);
      }
    };
    this.delete = (key) => {
      this.dict.delete(key);
    };
    this.remove = (key, value) => {
      if (!this.dict.has(key))
        return;
      const array = this.dict.get(key);
      const index = array.indexOf(value);
      if (index !== -1)
        array.splice(index, 1);
      if (array.length === 0)
        this.dict.delete(key);
    };
    this.getAll = (key) => {
      var _a;
      return (_a = this.dict.get(key)) != null ? _a : [];
    };
    this.entries = () => this.dict.entries();
    this.values = () => this.dict.values();
    this.has = (key) => this.dict.has(key);
  }
}
const useMultiValueMap = () => {
  const ref = useRef(null);
  return useCallback(() => {
    if (ref.current)
      return ref.current;
    ref.current = new MultiValueMap();
    return ref.current;
  }, []);
};
function useSubmitComplete(isSubmitting, callback) {
  const isPending = useRef(false);
  useEffect(() => {
    if (isSubmitting) {
      isPending.current = true;
    }
    if (!isSubmitting && isPending.current) {
      isPending.current = false;
      callback();
    }
  });
}
const mergeRefs = (refs) => {
  return (value) => {
    refs.filter(Boolean).forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
};
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const useDeepEqualsMemo = (item) => {
  const ref = useRef(item);
  const areEqual = ref.current === item || equals(ref.current, item);
  useEffect(() => {
    if (!areEqual) {
      ref.current = item;
    }
  });
  return areEqual ? ref.current : item;
};
const getDataFromForm = (el) => new FormData(el);
function nonNull(value) {
  return value !== null;
}
const focusFirstInvalidInput = (fieldErrors, customFocusHandlers, formElement) => {
  var _a;
  const namesInOrder = [...formElement.elements].map((el) => {
    const input = el instanceof RadioNodeList ? el[0] : el;
    if (input instanceof HTMLElement && "name" in input)
      return input.name;
    return null;
  }).filter(nonNull).filter((name) => name in fieldErrors);
  const uniqueNamesInOrder = uniq(namesInOrder);
  for (const fieldName of uniqueNamesInOrder) {
    if (customFocusHandlers.has(fieldName)) {
      customFocusHandlers.getAll(fieldName).forEach((handler) => {
        handler();
      });
      break;
    }
    const elem = formElement.elements.namedItem(fieldName);
    if (!elem)
      continue;
    if (elem instanceof RadioNodeList) {
      const selectedRadio = (_a = [...elem].filter(
        (item) => item instanceof HTMLInputElement
      ).find((item) => item.value === elem.value)) != null ? _a : elem[0];
      if (selectedRadio && selectedRadio instanceof HTMLInputElement) {
        selectedRadio.focus();
        break;
      }
    }
    if (elem instanceof HTMLElement) {
      if (elem instanceof HTMLInputElement && elem.type === "hidden") {
        continue;
      }
      elem.focus();
      break;
    }
  }
};
const useFormId = (providedId) => {
  const [symbolId] = useState(() => Symbol("remix-validated-form-id"));
  return providedId != null ? providedId : symbolId;
};
const FormResetter = ({
  resetAfterSubmit,
  formRef
}) => {
  const isSubmitting = useIsSubmitting();
  const isValid = useIsValid();
  useSubmitComplete(isSubmitting, () => {
    var _a;
    if (isValid && resetAfterSubmit) {
      (_a = formRef.current) == null ? void 0 : _a.reset();
    }
  });
  return null;
};
function formEventProxy(event) {
  let defaultPrevented = false;
  return new Proxy(event, {
    get: (target, prop) => {
      if (prop === "preventDefault") {
        return () => {
          defaultPrevented = true;
        };
      }
      if (prop === "defaultPrevented") {
        return defaultPrevented;
      }
      return target[prop];
    }
  });
}
function ValidatedForm({
  validator,
  onSubmit,
  children,
  fetcher,
  action,
  defaultValues: unMemoizedDefaults,
  formRef: formRefProp,
  onReset,
  subaction,
  resetAfterSubmit = false,
  disableFocusOnError,
  method,
  replace: replace2,
  id,
  ...rest
}) {
  var _a;
  const formId = useFormId(id);
  const providedDefaultValues = useDeepEqualsMemo(unMemoizedDefaults);
  const contextValue = useMemo(
    () => ({
      formId,
      action,
      subaction,
      defaultValuesProp: providedDefaultValues,
      fetcher
    }),
    [action, fetcher, formId, providedDefaultValues, subaction]
  );
  const backendError = useErrorResponseForForm(contextValue);
  const backendDefaultValues = useDefaultValuesFromLoader(contextValue);
  const hasActiveSubmission = useHasActiveFormSubmit(contextValue);
  const formRef = useRef(null);
  const Form$1 = (_a = fetcher == null ? void 0 : fetcher.Form) != null ? _a : Form;
  const submit = useSubmit();
  const setFieldErrors = useSetFieldErrors(formId);
  const setFieldError = useFormStore(formId, (state) => state.setFieldError);
  const reset = useFormStore(formId, (state) => state.reset);
  const startSubmit = useFormStore(formId, (state) => state.startSubmit);
  const endSubmit = useFormStore(formId, (state) => state.endSubmit);
  const syncFormProps = useFormStore(formId, (state) => state.syncFormProps);
  const setFormElementInState = useFormStore(
    formId,
    (state) => state.setFormElement
  );
  const cleanupForm = useRootFormStore((state) => state.cleanupForm);
  const registerForm = useRootFormStore((state) => state.registerForm);
  const customFocusHandlers = useMultiValueMap();
  const registerReceiveFocus = useCallback(
    (fieldName, handler) => {
      customFocusHandlers().add(fieldName, handler);
      return () => {
        customFocusHandlers().remove(fieldName, handler);
      };
    },
    [customFocusHandlers]
  );
  useIsomorphicLayoutEffect(() => {
    registerForm(formId);
    return () => cleanupForm(formId);
  }, [cleanupForm, formId, registerForm]);
  useIsomorphicLayoutEffect(() => {
    var _a2;
    syncFormProps({
      action,
      defaultValues: (_a2 = providedDefaultValues != null ? providedDefaultValues : backendDefaultValues) != null ? _a2 : {},
      subaction,
      registerReceiveFocus,
      validator
    });
  }, [
    action,
    providedDefaultValues,
    registerReceiveFocus,
    subaction,
    syncFormProps,
    backendDefaultValues,
    validator
  ]);
  useIsomorphicLayoutEffect(() => {
    setFormElementInState(formRef.current);
  }, [setFormElementInState]);
  useEffect(() => {
    var _a2;
    setFieldErrors((_a2 = backendError == null ? void 0 : backendError.fieldErrors) != null ? _a2 : {});
  }, [backendError == null ? void 0 : backendError.fieldErrors, setFieldErrors, setFieldError]);
  useSubmitComplete(hasActiveSubmission, () => {
    endSubmit();
  });
  const handleSubmit = async (e2, target, nativeEvent) => {
    startSubmit();
    const result = await validator.validate(getDataFromForm(e2.currentTarget));
    const submitter = nativeEvent.submitter;
    if (!(submitter == null ? void 0 : submitter.formNoValidate) && result.error) {
      endSubmit();
      setFieldErrors(result.error.fieldErrors);
      endSubmit();
      if (!disableFocusOnError) {
        focusFirstInvalidInput(
          result.error.fieldErrors,
          customFocusHandlers(),
          formRef.current
        );
      }
    } else {
      setFieldErrors({});
      const eventProxy = formEventProxy(e2);
      await (onSubmit == null ? void 0 : onSubmit(eventProxy));
      if (eventProxy.defaultPrevented) {
        endSubmit();
        return;
      }
      if (fetcher)
        fetcher.submit(submitter || e2.currentTarget);
      else
        submit(submitter || target, {
          replace: replace2,
          method: (submitter == null ? void 0 : submitter.formMethod) || method
        });
    }
  };
  return /* @__PURE__ */ React.createElement(Form$1, {
    ref: mergeRefs([formRef, formRefProp]),
    ...rest,
    id,
    action,
    method,
    replace: replace2,
    onSubmit: (e2) => {
      e2.preventDefault();
      handleSubmit(
        e2,
        e2.currentTarget,
        e2.nativeEvent
      );
    },
    onReset: (event) => {
      onReset == null ? void 0 : onReset(event);
      if (event.defaultPrevented)
        return;
      reset();
    }
  }, /* @__PURE__ */ React.createElement(InternalFormContext.Provider, {
    value: contextValue
  }, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FormResetter, {
    formRef,
    resetAfterSubmit
  }), subaction && /* @__PURE__ */ React.createElement("input", {
    type: "hidden",
    value: subaction,
    name: "subaction"
  }), id && /* @__PURE__ */ React.createElement("input", {
    type: "hidden",
    value: id,
    name: FORM_ID_FIELD
  }), children)));
}
const objectFromPathEntries = (entries) => {
  const map = new MultiValueMap();
  entries.forEach(([key, value]) => map.add(key, value));
  return [...map.entries()].reduce(
    (acc, [key, value]) => setPath(acc, key, value.length === 1 ? value[0] : value),
    {}
  );
};
const preprocessFormData = (data) => {
  if ("entries" in data && typeof data.entries === "function")
    return objectFromPathEntries([...data.entries()]);
  return objectFromPathEntries(Object.entries(data));
};
const omitInternalFields = (data) => omit(data, [FORM_ID_FIELD]);
function createValidator(validator) {
  return {
    validate: async (value) => {
      const data = preprocessFormData(value);
      const result = await validator.validate(omitInternalFields(data));
      if (result.error) {
        return {
          data: void 0,
          error: {
            fieldErrors: result.error,
            subaction: data.subaction,
            formId: data[FORM_ID_FIELD]
          },
          submittedData: data,
          formId: data[FORM_ID_FIELD]
        };
      }
      return {
        data: result.data,
        error: void 0,
        submittedData: data,
        formId: data[FORM_ID_FIELD]
      };
    },
    validateField: (data, field) => validator.validateField(preprocessFormData(data), field)
  };
}
const useFormState = (formId) => {
  const formContext = useInternalFormContext(formId, "useFormState");
  const isSubmitting = useInternalIsSubmitting(formContext.formId);
  const hasBeenSubmitted = useInternalHasBeenSubmitted(formContext.formId);
  const touchedFields = useTouchedFields(formContext.formId);
  const isValid = useInternalIsValid(formContext.formId);
  const action = useFormActionProp(formContext.formId);
  const subaction = useFormSubactionProp(formContext.formId);
  const syncedDefaultValues = useSyncedDefaultValues(formContext.formId);
  const defaultValuesToUse = useDefaultValuesForForm(formContext);
  const hydratedDefaultValues = defaultValuesToUse.hydrateTo(syncedDefaultValues);
  const fieldErrorsFromState = useFieldErrors(formContext.formId);
  const fieldErrorsToUse = useFieldErrorsForForm(formContext);
  const hydratedFieldErrors = fieldErrorsToUse.hydrateTo(fieldErrorsFromState);
  return useMemo(
    () => ({
      action,
      subaction,
      defaultValues: hydratedDefaultValues,
      fieldErrors: hydratedFieldErrors != null ? hydratedFieldErrors : {},
      hasBeenSubmitted,
      isSubmitting,
      touchedFields,
      isValid
    }),
    [
      action,
      hasBeenSubmitted,
      hydratedDefaultValues,
      hydratedFieldErrors,
      isSubmitting,
      isValid,
      subaction,
      touchedFields
    ]
  );
};
const useFormHelpers = (formId) => {
  const formContext = useInternalFormContext(formId, "useFormHelpers");
  const setTouched = useSetTouched(formContext);
  const validateField = useValidateField(formContext.formId);
  const validate = useValidate(formContext.formId);
  const clearError = useClearError(formContext);
  const setFieldErrors = useSetFieldErrors(formContext.formId);
  const reset = useResetFormElement(formContext.formId);
  const submit = useSubmitForm(formContext.formId);
  const getValues = useFormValues(formContext.formId);
  return useMemo(
    () => ({
      setTouched,
      validateField,
      clearError,
      validate,
      clearAllErrors: () => setFieldErrors({}),
      reset,
      submit,
      getValues
    }),
    [
      clearError,
      reset,
      setFieldErrors,
      setTouched,
      submit,
      validate,
      validateField,
      getValues
    ]
  );
};
const useFormContext = (formId) => {
  const context = useInternalFormContext(formId, "useFormContext");
  const state = useFormState(formId);
  const {
    clearError: internalClearError,
    setTouched,
    validateField,
    clearAllErrors,
    validate,
    reset,
    submit,
    getValues
  } = useFormHelpers(formId);
  const registerReceiveFocus = useRegisterReceiveFocus(context.formId);
  const clearError = useCallback(
    (...names) => {
      names.forEach((name) => {
        internalClearError(name);
      });
    },
    [internalClearError]
  );
  return useMemo(
    () => ({
      ...state,
      setFieldTouched: setTouched,
      validateField,
      clearError,
      registerReceiveFocus,
      clearAllErrors,
      validate,
      reset,
      submit,
      getValues
    }),
    [
      clearAllErrors,
      clearError,
      registerReceiveFocus,
      reset,
      setTouched,
      state,
      submit,
      validate,
      validateField,
      getValues
    ]
  );
};
const useInternalFieldArray = (context, field, validationBehavior) => {
  const value = useFieldDefaultValue(field, context);
  useRegisterControlledField(context, field);
  const hasBeenSubmitted = useInternalHasBeenSubmitted(context.formId);
  const validateField = useValidateField(context.formId);
  const error = useFieldError(field, context);
  const resolvedValidationBehavior = {
    initial: "onSubmit",
    whenSubmitted: "onChange",
    ...validationBehavior
  };
  const behavior = hasBeenSubmitted ? resolvedValidationBehavior.whenSubmitted : resolvedValidationBehavior.initial;
  const maybeValidate = useCallback(() => {
    if (behavior === "onChange") {
      validateField(field);
    }
  }, [behavior, field, validateField]);
  invariant(
    value === void 0 || value === null || Array.isArray(value),
    `FieldArray: defaultValue value for ${field} must be an array, null, or undefined`
  );
  const arr = useFormStore(
    context.formId,
    (state) => state.controlledFields.array
  );
  const helpers = useMemo(
    () => ({
      push: (item) => {
        arr.push(field, item);
        maybeValidate();
      },
      swap: (indexA, indexB) => {
        arr.swap(field, indexA, indexB);
        maybeValidate();
      },
      move: (from2, to) => {
        arr.move(field, from2, to);
        maybeValidate();
      },
      insert: (index, value2) => {
        arr.insert(field, index, value2);
        maybeValidate();
      },
      unshift: (value2) => {
        arr.unshift(field, value2);
        maybeValidate();
      },
      remove: (index) => {
        arr.remove(field, index);
        maybeValidate();
      },
      pop: () => {
        arr.pop(field);
        maybeValidate();
      },
      replace: (index, value2) => {
        arr.replace(field, index, value2);
        maybeValidate();
      }
    }),
    [arr, field, maybeValidate]
  );
  const arrayValue = useMemo(() => value != null ? value : [], [value]);
  return [arrayValue, helpers, error];
};
function useFieldArray(name, { formId, validationBehavior } = {}) {
  const context = useInternalFormContext(formId, "FieldArray");
  return useInternalFieldArray(context, name, validationBehavior);
}
const FieldArray = ({
  name,
  children,
  formId,
  validationBehavior
}) => {
  const context = useInternalFormContext(formId, "FieldArray");
  const [value, helpers, error] = useInternalFieldArray(
    context,
    name,
    validationBehavior
  );
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children(value, helpers, error));
};
export { FieldArray, ValidatedForm, createValidator, setFormDefaults, useControlField, useField, useFieldArray, useFormContext, useIsSubmitting, useIsValid, useUpdateControlledField, validationError };
//# sourceMappingURL=remix-validated-form.es.js.map
