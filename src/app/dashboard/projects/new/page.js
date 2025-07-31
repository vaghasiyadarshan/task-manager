"use client";

import { useRouter } from "next/navigation";
import { useTaskStore } from "../../../../store/taskStore";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Add as AddIcon } from "@mui/icons-material";

export default function NewProjectPage() {
  const router = useRouter();
  const { fetchProjects } = useTaskStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosInstance.post("/api/projects", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      await fetchProjects();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <AddIcon fontSize="medium" /> Create New Project
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Project Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Write a short description..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <AddIcon fontSize="small" />
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
