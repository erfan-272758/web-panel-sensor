export function transformMsg(msg) {
  return JSON.parse(msg.toString("utf-8"));
}
