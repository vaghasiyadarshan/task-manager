import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";

export const useTaskStore = create((set) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  project: null,
  loading: false,
  error: null,

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

  fetchTasks: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/api/tasks?projectId=${projectId}`);
      set({
        tasks: res.data.tasks,
        project: res.data.project,
        currentProject: projectId,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  addTask: async (projectId, task) => {
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
