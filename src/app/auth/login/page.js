"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { TextField, Button, Box, Typography } from "@mui/material";
import * as yup from "yup";
import Link from "next/link";

// Define validation schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({}); // Clear errors if validation passes

      console.log("try to login");
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err.name === "ValidationError") {
        // Handle Yup validation errors
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Login failed:", err);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        Don't have an account? <Link href="/auth/register">Register</Link>
      </Typography>
    </Box>
  );
}
