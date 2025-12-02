import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://slimmoms-j4sf.onrender.com";

export const userTransactionApi = axios.create({
  baseURL: BASE_URL,
});

export const setToken = (token) => {
  userTransactionApi.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeToken = () => {
  userTransactionApi.defaults.headers.common.Authorization = "";
};
