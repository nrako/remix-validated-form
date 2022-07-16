import { z, ZodType } from "zod";
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
function setPath(object, path, defaultValue) {
  return _setPathNormalized(object, stringToPathArray(path), defaultValue);
}
function _setPathNormalized(object, path, value) {
  var _a;
  const leadingSegments = path.slice(0, -1);
  const lastSegment = path[path.length - 1];
  let obj = object;
  for (let i = 0; i < leadingSegments.length; i++) {
    const segment = leadingSegments[i];
    if (obj[segment] === void 0) {
      const nextSegment = (_a = leadingSegments[i + 1]) != null ? _a : lastSegment;
      obj[segment] = typeof nextSegment === "number" ? [] : {};
    }
    obj = obj[segment];
  }
  obj[lastSegment] = value;
  return object;
}
const stripEmpty = z.literal("").transform(() => void 0);
const preprocessIfValid = (schema) => (val) => {
  const result = schema.safeParse(val);
  if (result.success)
    return result.data;
  return val;
};
const text = (schema = z.string()) => z.preprocess(preprocessIfValid(stripEmpty), schema);
const numeric = (schema = z.number()) => z.preprocess(
  preprocessIfValid(
    z.union([
      stripEmpty,
      z.string().transform((val) => Number(val)).refine((val) => !Number.isNaN(val))
    ])
  ),
  schema
);
const checkbox = ({ trueValue = "on" } = {}) => z.union([
  z.literal(trueValue).transform(() => true),
  z.literal(void 0).transform(() => false)
]);
const file = (schema = z.instanceof(File)) => z.preprocess((val) => {
  return val instanceof File && val.size === 0 ? void 0 : val;
}, schema);
const repeatable = (schema = z.array(text())) => {
  return z.preprocess((val) => {
    if (Array.isArray(val))
      return val;
    if (val === void 0)
      return [];
    return [val];
  }, schema);
};
const repeatableOfType = (schema) => repeatable(z.array(schema));
const entries = z.array(z.tuple([z.string(), z.any()]));
const safeParseJson = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return jsonString;
  }
};
const json = (schema) => z.preprocess(
  preprocessIfValid(
    z.union([stripEmpty, z.string().transform((val) => safeParseJson(val))])
  ),
  schema
);
const processFormData = preprocessIfValid(
  z.any().refine((val) => Symbol.iterator in val).transform((val) => [...val]).refine(
    (val) => entries.safeParse(val).success
  ).transform((data) => {
    const map = /* @__PURE__ */ new Map();
    for (const [key, value] of data) {
      if (map.has(key)) {
        map.get(key).push(value);
      } else {
        map.set(key, [value]);
      }
    }
    return [...map.entries()].reduce((acc, [key, value]) => {
      return setPath(acc, key, value.length === 1 ? value[0] : value);
    }, {});
  })
);
const preprocessFormData = processFormData;
const formData = (shapeOrSchema) => z.preprocess(
  processFormData,
  shapeOrSchema instanceof ZodType ? shapeOrSchema : z.object(shapeOrSchema)
);
var helpers = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  text,
  numeric,
  checkbox,
  file,
  repeatable,
  repeatableOfType,
  json,
  preprocessFormData,
  formData
}, Symbol.toStringTag, { value: "Module" }));
export { checkbox, file, formData, json, numeric, preprocessFormData, repeatable, repeatableOfType, text, helpers as zfd };
//# sourceMappingURL=zod-form-data.es.js.map
