export function transformMsg(msg) {
  return JSON.parse(msg.content.toString("utf-8"));
}
