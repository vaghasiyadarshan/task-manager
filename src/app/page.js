"use client";

import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Task Manager
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => router.push("/auth/login")}>
          Login
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push("/auth/register")}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
}
