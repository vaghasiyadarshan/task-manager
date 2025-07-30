"use client";

import { useState, useEffect } from "react";
import * as yup from "yup";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

// Modal style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

// Validation schema
const taskSchema = yup.object().shape({
  title: yup.string().required("Title is required").max(100, "Title too long"),
  status: yup.string().required("Status is required"),
  dueDate: yup
    .date()
    .nullable()
    .min(new Date(), "Due date must be in the future"),
});

export default function TaskModal({ open, onClose, task, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    status: "todo",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        status: task.status || "todo",
        dueDate: task.dueDate || "",
      });
    } else {
      setFormData({
        title: "",
        status: "todo",
        dueDate: "",
      });
    }
    setErrors({});
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      await taskSchema.validate(formData, { abortEarly: false });

      // Call onSave and wait for it to complete
      await onSave({
        title: formData.title,
        status: formData.status,
        dueDate: formData.dueDate || null,
      });

      // Show success message
      setSnackbar({
        open: true,
        message: task?.id
          ? "Task updated successfully!"
          : "Task created successfully!",
        severity: "success",
      });

      // Close modal after successful save
      onClose();
    } catch (err) {
      if (err.name === "ValidationError") {
        // Handle validation errors
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        // Handle API errors
        setSnackbar({
          open: true,
          message: "An error occurred. Please try again.",
          severity: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Modal open={open} onClose={isLoading ? null : onClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" mb={3}>
            {task?.id ? "Edit Task" : "Create New Task"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              disabled={isLoading}
              inputProps={{ maxLength: 100 }}
            />

            <FormControl fullWidth margin="normal" error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
                disabled={isLoading}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
              {errors.status && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  {errors.status}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Due Date"
              name="dueDate"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dueDate}
              onChange={handleChange}
              error={!!errors.dueDate}
              helperText={errors.dueDate}
              disabled={isLoading}
              inputProps={{
                min: new Date().toISOString().split("T")[0], // Set min date to today
              }}
            />

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button onClick={onClose} disabled={isLoading} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
