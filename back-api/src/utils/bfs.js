function getEntries(obj) {
  const keys = Object.getOwnPropertyNames(obj);
  return keys.map((k) => [k, obj[k]]);
}

export default function bfs(target, cb) {
  const recorded = new Map();
  const stack = [{ parent: null, key: null, value: target }];
  do {
    const { parent, key, value } = stack.pop();
    if (typeof value === "object") {
      if (recorded.has(value)) continue;
      recorded.set(value, true);
    }

    if (Array.isArray(value)) {
      stack.push(...value.map((c, i) => ({ parent: value, key: i, value: c })));
    } else if (typeof value === "object" && value !== null) {
      stack.push(
        ...getEntries(value).map(([k, v]) => ({
          parent: value,
          key: k,
          value: v,
        }))
      );
    }
    cb({ parent, key, value });
  } while (stack.length);
}
