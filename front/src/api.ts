import axios from "axios";
import { API_URL } from "./Global";
import { getTokenHeader } from "./utils";

const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = getTokenHeader();
  }
  return config;
});
api.interceptors.response.use((response) => {
  response.data = response.data.data;
  return response;
});

export default api;
