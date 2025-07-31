import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const data = res.data.user;

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.uid);

      set({ user: data });
    } catch (err) {
      set({ error: err.response?.data?.message || "Login failed" });
    } finally {
      set({ loading: false });
    }
  },
  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/auth/register", { email, password });
      const data = res.data.user;

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.uid);

      set({ user: data });
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
  
    await axios.post("/api/auth/logout"); 
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, loading: false });
  },


  loadUserFromStorage: () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      set({ user: JSON.parse(savedUser), loading: true });
    }
  },
}));
