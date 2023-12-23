import * as Y from "yjs"
import { JsonValue, JsonArray, JsonObject, JsonPrimitive } from "../jsonTypes"

function isJsonPrimitive(v: JsonValue): v is JsonPrimitive {
  const t = typeof v
  return t === "string" || t === "number" || t === "boolean" || v === null
}

function isJsonArray(v: JsonValue): v is JsonArray {
  return Array.isArray(v)
}

function isJsonObject(v: JsonValue): v is JsonObject {
  return !isJsonArray(v) && typeof v === "object"
}

export function convertJsonToYjsData(v: JsonValue) {
  if (v === undefined || isJsonPrimitive(v)) {
    return v
  }

  if (isJsonArray(v)) {
    const arr = new Y.Array()
    applyJsonArrayYArray(arr, v)
    return arr
  }

  if (isJsonObject(v)) {
    const map = new Y.Map()
    applyJsonObjectToYMap(map, v)
    return map
  }

  throw new Error(`unsupported value type: ${v}`)
}

export function applyJsonArrayYArray(dest: Y.Array<unknown>, source: JsonArray) {
  dest.push(source.map(convertJsonToYjsData))
}

export function applyJsonObjectToYMap(dest: Y.Map<unknown>, source: JsonObject) {
  Object.entries(source).forEach(([k, v]) => {
    dest.set(k, convertJsonToYjsData(v))
  })
}
