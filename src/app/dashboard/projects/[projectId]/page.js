"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTaskStore } from "../../../../store/taskStore";
import TaskList from "../../../../components/TaskList";
import TaskModal from "../../../../components/TaskModal";
import { Add } from "@mui/icons-material";

export default function ProjectPage() {
  const { projectId } = useParams();
  const { tasks, error, addTask, updateTask, deleteTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {tasks?.project?.name || "Project"} Tasks
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Add fontSize="small" />
            <span>Add Task</span>
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <TaskList
          tasks={tasks}
          onTaskUpdate={updateTask}
          onTaskDelete={deleteTask}
        />

        <TaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(task) => {
            addTask(projectId, task);
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
