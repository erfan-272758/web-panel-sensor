import { DataProvider } from "react-admin";
import api from "../api";

const deviceProvider: DataProvider = {
  create: async (_, { data }) => {
    const response = await api.post("/device", data);
    return { data: response.data };
  },

  delete: async (_, { id }) => {
    const response = await api.delete(`/device/${id}`);
    return { data: response.data };
  },
  deleteMany: async (_, { ids }) => {
    const d: any[] = [];
    for (const id of ids) {
      const response = await api.delete(`/device/${id}`);
      d.push(response.data);
    }
    return { data: d };
  },
  getList: async (_, params) => {
    const response = await api.get("/device", { params: params.filter });
    return {
      data: response.data,
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      total: response.data.length,
    };
  },
  getMany: () => {
    console.log("call device many");
    return Promise.resolve({ data: [] });
  },
  getManyReference: () => {
    console.log("call device many ref");
    return Promise.resolve({ data: [], total: 0 });
  },

  getOne: async (_, { id }) => {
    const response = await api.get(`/device/${id}`);
    return { data: response.data };
  },

  update: async (_, { data, id }) => {
    const response = await api.put(`/device/${id}`, data);
    return { data: response.data };
  },
  updateMany: () => {
    console.log("call device update many");
    return Promise.resolve({});
  },
};

export default deviceProvider;
