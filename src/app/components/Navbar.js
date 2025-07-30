"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, loadUserFromStorage } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  useEffect(() => {
    loadUserFromStorage()
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>Welcome, {user.email}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
