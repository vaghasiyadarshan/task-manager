// src/app/dashboard/projects/new/page.js
"use client";

import { useRouter } from "next/navigation";
import { useTaskStore } from "../../../store/taskStore";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useState } from "react";
import axiosInstance from "@/app/lib/axiosInstance";

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
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Project
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </Box>
  );
}
