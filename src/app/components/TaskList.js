"use client";

import { useEffect, useState, useCallback } from "react";
import { useTaskStore } from "../app/store/taskStore";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useParams } from "next/navigation";
import TaskModal from "./TaskModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Skeleton,
  Button,
} from "@mui/material";

export default function TaskTable() {
  const { tasks, fetchTasks, deleteTask, updateTask } = useTaskStore();
  const { projectId } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status color mapping
  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  // Fetch tasks with loading state
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      await fetchTasks(projectId);
    } finally {
      setLoading(false);
    }
  }, [fetchTasks, projectId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Handle opening modal for editing
  const handleEdit = (task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  // Handle creating new task
  const handleCreate = () => {
    setSelectedTask(null);
    setOpenModal(true);
  };

  // Handle saving (updating or adding)
  const handleSave = async (updatedData) => {
    if (selectedTask?.id) {
      await updateTask(selectedTask.id, updatedData);
    }
    setOpenModal(false);
    setSelectedTask(null);
    await loadTasks(); // Refresh the task list
  };

  // Handle task deletion
  const handleDelete = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
      await loadTasks(); // Refresh the task list
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-medium">Title</TableCell>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell className="font-medium">Due Date</TableCell>
              <TableCell className="font-medium text-right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loading state
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="70%" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No tasks found. Create your first task!
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status.replace("_", " ")}
                      className={`capitalize ${
                        statusColors[task.status] || "bg-gray-100"
                      }`}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <IconButton
                        onClick={() => handleEdit(task)}
                        aria-label="edit"
                        className="text-blue-600 hover:bg-blue-50"
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(task.id)}
                        aria-label="delete"
                        className="text-red-600 hover:bg-red-50"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TaskModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        task={selectedTask}
        onSave={handleSave}
      />
    </div>
  );
}
