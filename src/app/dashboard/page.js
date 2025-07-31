"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "../../store/taskStore";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

export default function Dashboard() {
  const router = useRouter();
  const { projects, error, fetchProjects, loading, deleteProject } =
    useTaskStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProject) {
      await deleteProject(selectedProject.id);
      await fetchProjects();
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Your Projects</h1>
        <button
          onClick={() => router.push("/dashboard/projects/new")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <AddIcon fontSize="small" /> New Project
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            No projects found
          </h2>
          <p className="text-gray-500 mb-4">
            Get started by creating your first project
          </p>
          <button
            onClick={() => router.push("/dashboard/projects/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {project.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/projects/${project.id}`)
                      }
                      className="p-1 hover:bg-blue-100 rounded"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {project.description || "No description"}
                </p>
              </div>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                <span>{project.tasks?.length || 0} tasks</span>
              </div>
              <button
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="mt-3 w-full bg-gray-100 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition"
              >
                View Project
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-100 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Project?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{selectedProject?.name}"? This
              action cannot be undone and will also delete all associated tasks.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 rounded-md border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
