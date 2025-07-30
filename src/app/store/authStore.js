import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null, // ✅ Load on page refresh
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const data = res.data.user;

      // ✅ Store user info & token in localStorage
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
      return data; // Return user data for potential redirects
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      set({ error: errorMessage });
      throw new Error(errorMessage); // Re-throw for form handling
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    // ✅ Clear both state & localStorage
    await axios.post("/api/auth/logout"); // optional server-side logout
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },

  // ✅ Rehydrate state on app load
  loadUserFromStorage: () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      set({ user: JSON.parse(savedUser) });
    }
  },
}));
