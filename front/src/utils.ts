import { Store } from "./Global";

export function getTokenHeader(token?: string | null) {
  token = token || Store.token || localStorage.getItem("token") || "";
  return `Bearer ${token}`;
}
