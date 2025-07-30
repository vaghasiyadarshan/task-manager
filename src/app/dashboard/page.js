"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Box,
  Typography,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Grid,
  Stack,
  Card,
  TextField,
} from "@mui/material";
import { useTaskStore } from "../store/taskStore";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

export default function Dashboard() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    projects,
    error,
    fetchProjects,
    loading,
    deleteProject,
    updateProject,
  } = useTaskStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditForm({
      name: project.name,
      description: project.description || "",
    });
    setEditDialogOpen(true);
    setFormErrors({ name: false });
  };

  const handleEditSubmit = async () => {
    if (!editForm.name.trim()) {
      setFormErrors({ ...formErrors, name: true });
      return;
    }

    try {
      await updateProject(selectedProject.id, editForm);
      await fetchProjects();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (name === "name" && value.trim()) {
      setFormErrors((prev) => ({ ...prev, name: false }));
    }
  };

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

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            mt: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Your Projects
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push("/dashboard/projects/new")}
              sx={{
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              New Project
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(3)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={200} />
              </Grid>
            ))}
          </Grid>
        ) : projects.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No projects found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Get started by creating your first project
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push("/dashboard/projects/new")}
            >
              Create Project
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={3} key={project.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    direction="column"
                    justifyContent="space-between"
                    sx={{
                      height: "100%",
                      width: { xs: "400px", md: "600px", lg: "600px" },
                    }}
                  >
                    <Stack sx={{ p: 3, width: "100" }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1}
                      >
                        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                          {project.name}
                        </Typography>
                        {!isMobile && (
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Edit project">
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(project)}
                                aria-label="edit project"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete project">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(project)}
                                aria-label="delete project"
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {project.description || "No description"}
                      </Typography>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mt: "auto" }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {project.tasks?.length || 0} tasks
                        </Typography>
                      </Stack>
                    </Stack>
                    <Box
                      sx={{
                        display: "flex",
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Button
                        fullWidth
                        variant="text"
                        onClick={() =>
                          router.push(`/dashboard/projects/${project.id}`)
                        }
                        sx={{
                          borderRadius: 0,
                          py: 1.5,
                        }}
                      >
                        View Project
                      </Button>
                      {isMobile && (
                        <>
                          <Button
                            variant="text"
                            onClick={() => handleEditClick(project)}
                            sx={{
                              borderRadius: 0,
                              borderLeft: "1px solid",
                              borderColor: "divider",
                              minWidth: "auto",
                              px: 2,
                              py: 1.5,
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button
                            variant="text"
                            onClick={() => handleDeleteClick(project)}
                            sx={{
                              borderRadius: 0,
                              borderLeft: "1px solid",
                              borderColor: "divider",
                              minWidth: "auto",
                              px: 2,
                              py: 1.5,
                              color: "error.main",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </>
                      )}
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">Delete Project?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{selectedProject?.name}"? This
              action cannot be undone and will also delete all associated tasks.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleEditCancel}
          aria-labelledby="edit-dialog-title"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="edit-dialog-title">
            Edit {selectedProject?.name}
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Project Name"
                name="name"
                value={editForm.name}
                onChange={handleFormChange}
                error={formErrors.name}
                helperText={formErrors.name ? "Project name is required" : ""}
              />
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={editForm.description}
                onChange={handleFormChange}
                multiline
                rows={4}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCancel}>Cancel</Button>
            <Button
              onClick={handleEditSubmit}
              color="primary"
              variant="contained"
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
