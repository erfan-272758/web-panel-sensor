import { AuthProvider, fetchUtils } from "react-admin";
import { API_URL, Store } from "./Global";
import { getTokenHeader } from "./utils";
import api from "./api";

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await api.post(`/auth/login`, {
      username,
      password,
    });
    const { user, token } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    Store.user = user;
    Store.token = token;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("token not exists");
    let user = localStorage.getItem("user");
    if (!user) {
      const response = await api.get("/auth/login");
      user = response.data.user;
    } else {
      user = JSON.parse(user);
    }
    Store.user = user;
    Store.token = token;
  },
  getPermissions: () => Promise.resolve(),
  getIdentity: async () => {
    const user = Store.user ?? JSON.parse(localStorage.getItem("user") ?? "");
    return {
      id: user.id,
      fullName: user.name || user.username,
    };
  },
};

export default authProvider;
