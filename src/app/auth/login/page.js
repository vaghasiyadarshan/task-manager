"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import { TextField, Button, Typography } from "@mui/material";
import * as yup from "yup";
import Link from "next/link";

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
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <div className="w-100">
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 3 }}>
        Sign In
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        Enter your email and password to sign in!
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
          sx={{
            mt: 2,
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#4338ca" },
          }}
        >
          {loading ? "Logging in..." : "Sign in"}
        </Button>
      </form>

      <Typography sx={{ mt: 2, fontSize: "0.9rem" }}>
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </Typography>
    </div>
  );
}
