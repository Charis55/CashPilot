// src/components/auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // ❗ LOGIN — AuthContext handles email verification check
      await login(form.email, form.password);

      navigate("/"); // success → go dashboard
    } catch (err) {
      console.error("Login error:", err);

      // 🔥 This matches the custom error thrown inside AuthContext.login()
      if (err.code === "auth/email-not-verified") {
        setError("Please verify your email before signing in.");
      } 
      else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      }
      else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      }
      else if (err.code === "auth/user-not-found") {
        setError("No account found with that email.");
      }
      else {
        setError("Failed to sign in. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">

        <div className="auth-logo">
          <img src="/assets/cashpilot-logo.png" alt="CashPilot" />
          <span>CashPilot</span>
        </div>

        <h2>Sign In</h2>

        {error && (
          <p
            style={{
              color: "#b91c1c",
              fontSize: "0.9rem",
              marginBottom: "0.8rem",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Create One</Link>
          <br />
          <Link to="/reset-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}
