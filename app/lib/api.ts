import axios from "axios";

export const api = axios.create({
  baseURL: process.env.API_BACKEND,
  headers: { "Content-Type": "application/json" },
});

// (opsional) interceptor kalau mau otomatis nambah Bearer dari token:
export function attachBearer(token?: string) {
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}
