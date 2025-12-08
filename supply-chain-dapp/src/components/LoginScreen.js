// src/components/LoginScreen.js
import React, { useState } from "react";

function LoginScreen({ onLogin, status }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username.trim(), password);
  };

  return (
    <div
      style={{
        background: "#020617",
        borderRadius: "1rem",
        padding: "1.5rem",
        border: "1px solid #1e293b"
      }}
    >
      <h1 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Log in</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>
            Username
            <input
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "1.25rem" }}>
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
        </div>

        <button
          type="submit"
          style={{
            background: "linear-gradient(to right, #22c55e, #38bdf8)",
            color: "#020617",
            border: "none",
            padding: "0.75rem 1.2rem",
            borderRadius: "0.75rem",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.95rem",
            width: "100%"
          }}
        >
          Sign in
        </button>
      </form>

      {status && (
        <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>ℹ️ {status}</p>
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
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.8rem",
  fontWeight: 500
};

const inputStyle = {
  width: "100%",
  marginTop: "0.25rem",
  padding: "0.5rem 0.6rem",
  borderRadius: "0.6rem",
  border: "1px solid #374151",
  background: "#020617",
  color: "#f9fafb",
  fontSize: "0.85rem",
  outline: "none"
};

export default LoginScreen;
