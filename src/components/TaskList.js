"use client";

import { useEffect, useState, useCallback } from "react";
import { useTaskStore } from "../store/taskStore";
import { Edit, Delete } from "@mui/icons-material";
import { useParams } from "next/navigation";
import TaskModal from "./TaskModal";

export default function TaskTable() {
  const { tasks, fetchTasks, deleteTask, updateTask } = useTaskStore();
  const { projectId } = useParams();

  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const statusColors = {
    todo: "bg-gray-100 text-gray-700", // Light gray for To Do
    "in-progress": "bg-blue-100 text-blue-800", // Blue for In Progress
    done: "bg-green-100 text-green-800", // Green for Done
    cancelled: "bg-red-100 text-red-800", // Red for Cancelled
  };

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    setLoading(true);
    await fetchTasks(projectId);
    setLoading(false);
  }, [fetchTasks, projectId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Open modal for edit/create
  const handleEdit = (task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  // Save task changes
  const handleSave = async (updatedData) => {
    if (selectedTask?.id) {
      await updateTask(selectedTask.id, updatedData);
    }
    setOpenModal(false);
    setSelectedTask(null);
    await loadTasks();
  };

  // Delete confirmation
  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      await loadTasks();
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {["w-3/4", "w-1/2", "w-2/3", ""].map((width, j) => (
                    <td key={j} className="px-4 py-3">
                      {width && (
                        <div
                          className={`h-4 bg-gray-200 rounded animate-pulse ${width}`}
                        ></div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No tasks found. Create your first task!
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors border-b"
                >
                  <td className="px-4 py-3 font-medium">{task.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                        statusColors[task.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status.replace("-", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(task.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Task Modal */}
      <TaskModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        task={selectedTask}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-100 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Delete Task?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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
