import { createValidator } from "remix-validated-form";
var __spreadArray = globalThis && globalThis.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
function purry(fn, args, lazy) {
  var diff = fn.length - args.length;
  var arrayArgs = Array.from(args);
  if (diff === 0) {
    return fn.apply(void 0, arrayArgs);
  }
  if (diff === 1) {
    var ret = function(data) {
      return fn.apply(void 0, __spreadArray([data], arrayArgs, false));
    };
    if (lazy || fn.lazy) {
      ret.lazy = lazy || fn.lazy;
      ret.lazyArgs = args;
    }
    return ret;
  }
  throw new Error("Wrong number of arguments");
}
var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;
function equals() {
  return purry(_equals, arguments);
}
function _equals(a, b) {
  if (a === b) {
    return true;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    var arrA = isArray(a);
    var arrB = isArray(b);
    var i = void 0;
    var length = void 0;
    var key = void 0;
    if (arrA && arrB) {
      length = a.length;
      if (length !== b.length) {
        return false;
      }
      for (i = length; i-- !== 0; ) {
        if (!equals(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    if (arrA !== arrB) {
      return false;
    }
    var dateA = a instanceof Date;
    var dateB = b instanceof Date;
    if (dateA !== dateB) {
      return false;
    }
    if (dateA && dateB) {
      return a.getTime() === b.getTime();
    }
    var regexpA = a instanceof RegExp;
    var regexpB = b instanceof RegExp;
    if (regexpA !== regexpB) {
      return false;
    }
    if (regexpA && regexpB) {
      return a.toString() === b.toString();
    }
    var keys = keyList(a);
    length = keys.length;
    if (length !== keyList(b).length) {
      return false;
    }
    for (i = length; i-- !== 0; ) {
      if (!hasProp.call(b, keys[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0; ) {
      key = keys[i];
      if (!equals(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}
const stringToPathArray = (path) => {
  if (path.length === 0)
    return [];
  const match = path.match(/^\[(.+?)\](.*)$/) || path.match(/^\.?([^\.\[\]]+)(.*)$/);
  if (match) {
    const [_, key, rest] = match;
    return [/^\d+$/.test(key) ? Number(key) : key, ...stringToPathArray(rest)];
  }
  return [path];
};
const getIssuesForError = (err) => {
  return err.issues.flatMap((issue) => {
    if ("unionErrors" in issue) {
      return issue.unionErrors.flatMap((err2) => getIssuesForError(err2));
    } else {
      return [issue];
    }
  });
};
function pathToString(array) {
  return array.reduce(function(string, item) {
    const prefix = string === "" ? "" : ".";
    return string + (isNaN(Number(item)) ? prefix + item : "[" + item + "]");
  }, "");
}
function withZod(zodSchema, parseParams) {
  return createValidator({
    validate: async (value) => {
      const result = await zodSchema.safeParseAsync(value, parseParams);
      if (result.success)
        return { data: result.data, error: void 0 };
      const fieldErrors = {};
      getIssuesForError(result.error).forEach((issue) => {
        const path = pathToString(issue.path);
        if (!fieldErrors[path])
          fieldErrors[path] = issue.message;
      });
      return { error: fieldErrors, data: void 0 };
    },
    validateField: async (data, field) => {
      var _a;
      const result = await zodSchema.safeParseAsync(data, parseParams);
      if (result.success)
        return { error: void 0 };
      return {
        error: (_a = getIssuesForError(result.error).find(
          (issue) => equals(issue.path, stringToPathArray(field))
        )) == null ? void 0 : _a.message
      };
    }
  });
}
export { withZod };
//# sourceMappingURL=remix-validated-form__with-zod.es.js.map
