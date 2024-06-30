import bfs from "../utils/bfs.js";

export default function transformDecorator(body) {
  const filter = function ({ parent, key, value }) {
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
