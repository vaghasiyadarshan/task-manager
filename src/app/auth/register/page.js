"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import { TextField, Button, Typography } from "@mui/material";
import * as yup from "yup";
import Link from "next/link";

// Validation Schema
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
      await registerSchema.validate(
        { email, password, confirmPassword },
        { abortEarly: false }
      );
      setErrors({});
      await register(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err.name === "ValidationError") {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="w-100">
      {/* Heading */}
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3 }}>
        Create an Account
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        Enter your email and password to register!
      </Typography>

      {/* Error Message */}
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {/* Registration Form */}
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

        <TextField
          fullWidth
          margin="normal"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            mt: 2,
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#4338ca" },
          }}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>

      <Typography sx={{ mt: 2, fontSize: "0.9rem" }}>
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </Typography>
    </div>
  );
}
