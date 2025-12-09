// src/components/LoginScreen.js
import React, { useState } from "react";

function LoginScreen({ onLogin, status }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username.trim(), password);
  };

  // DEMO RESET FUNCTION
  const handleDemoReset = () => {
    try {
      localStorage.removeItem("sc_users_v1");
      localStorage.removeItem("sc_products_v1");
      localStorage.removeItem("productsChainContractAddresses_v1");
      window.location.reload();
    } catch (err) {
      console.error("Reset error:", err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* LOGIN CARD – matches AdminDashboard cardStyle */}
      <div
        style={{
          background: "#020617",
          borderRadius: "1rem",
          marginTop: "9rem",
          padding: "1.5rem 1.75rem",
          border: "1px solid #1e293b",
          maxWidth: "380px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.35)"
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "1.25rem",
            fontSize: "1.9rem",
            color: "#f1f5f9"
          }}
        >
          Log in
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <label style={labelStyle}>
            Username
            <input
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label style={labelStyle}>
            Password
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            style={primaryButtonStyle}
            onMouseEnter={(e) => (e.target.style.opacity = 0.9)}
            onMouseLeave={(e) => (e.target.style.opacity = 1)}
          >
            Sign in
          </button>
        </form>

        {status && (
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.9rem",
              color: "#f87171"
            }}
          >
            {status}
          </p>
        )}

        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.8rem",
            color: "#9ca3af"
          }}
        >
          Tip: default admin → <strong>admin / admin</strong>
        </p>
      </div>

      {/* RESET BUTTON (same as before) */}
      <button
        onClick={handleDemoReset}
        style={resetButtonStyle}
        onMouseEnter={(e) => (e.target.style.opacity = 1)}
        onMouseLeave={(e) => (e.target.style.opacity = 0.85)}
      >
        Reset
      </button>
    </div>
  );
}

/* Match AdminDashboard label + input styles */

const labelStyle = {
  display: "block",
  marginBottom: "0.35rem",
  fontSize: "0.85rem",
  fontWeight: 500,
  color: "#e2e8f0"
};

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.75rem",
  borderRadius: "0.6rem",
  border: "1px solid #374151",
  background: "#020617",
  color: "#f9fafb",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border 0.2s",
  boxSizing: "border-box"
};

const primaryButtonStyle = {
  background: "#38bdf8", // same style family as original
  color: "#020617",
  border: "none",
  padding: "0.75rem 1.2rem",
  borderRadius: "0.75rem",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.95rem",
  width: "100%",
  transition: "opacity 0.15s"
};

const resetButtonStyle = {
  position: "absolute",
  left: "-0.5rem",
  bottom: "-2.5rem",
  background: "#ef4444",
  color: "#f9fafb",
  padding: "0.3rem 0.6rem",
  borderRadius: "0.4rem",
  border: "1px solid #b91c1c",
  cursor: "pointer",
  fontSize: "0.7rem",
  fontWeight: 600,
  opacity: 0.85
};

export default LoginScreen;
