import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";

export const useTaskStore = create((set) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  loading: false,
  error: null,

  // ✅ Fetch projects
  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/api/projects");
      set({ projects: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // ✅ Fetch tasks
  fetchTasks: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/api/tasks?projectId=${projectId}`);
      set({ tasks: res.data, currentProject: projectId, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // ✅ Add task
  addTask: async (projectId, task) => {
    console.log(task, "task,,,,,,,,,,,,,,,,,,,");
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post(
        "/api/tasks",
        { ...task, projectId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set((state) => ({
        tasks: [...state.tasks, res.data],
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // ✅ Update task
  updateTask: async (taskId, updates) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/api/tasks/${taskId}`, {
        ...updates,
        id: taskId,
      });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...res.data } : task
        ),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
  updateProject: async (projectId, data) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/api/projects/${projectId}`, {
        ...data,
        id: projectId,
      });
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId ? { ...project, ...res.data } : project
        ),
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      throw err;
    }
  },
  deleteProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.delete(`/api/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== projectId),
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      throw err;
    }
  },
  // ✅ Delete task
  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
}));
