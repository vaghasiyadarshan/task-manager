"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { TextField, Button, Box, Typography } from "@mui/material";
import * as yup from "yup";
import Link from "next/link";

// Define validation schema
const registerSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { register, loading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      await registerSchema.validate(
        { email, password, confirmPassword },
        { abortEarly: false }
      );

      // Clear any previous errors
      setErrors({});

      // Proceed with registration
      await register(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Registration failed:", err);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
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
        required
        error={!!errors.password}
        helperText={errors.password}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
      />
      <Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Registering..." : "Register"}
      </Button>
      <Typography sx={{ mt: 2 }}>
        Already have an account? <Link href="/auth/login">Login</Link>
      </Typography>
    </Box>
  );
}
