import bfs from "../utils/bfs.js";

export default function transformDecorator(body) {
  const filter = function ({ parent, key, value }) {
    if (key == "_time" && !parent.createdAt) {
      parent.createdAt = value;
    }
    if (
      typeof key === "string" &&
      (key.startsWith("_") || ["table", "result"].includes(key))
    )
      delete parent[key];
  };
  if (typeof body !== "object") return body;
  bfs(body, filter);
  return body;
}

export function transformWithKeys(body, keysMap = {}, removeKeys = []) {
  const filter = ({ parent, key, value }) => {
    if (!parent) return;
    const k2 = keysMap[key];
    if (k2) {
      parent[k2] = value;
      delete parent[key];
    }
    if (removeKeys.includes(key)) delete parent[key];
  };
  if (typeof body !== "object") return body;
  bfs(body, filter);
  return transformDecorator(body);
}
