// src/components/AdminDashboard.js
import React, { useState } from "react";

function AdminDashboard({
  users,
  onCreateUser,
  onDeleteUser,
  onUpdateAdminEthAddress
}) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateUser(form);
    setForm({ username: "", password: "", role: "" });
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
        gap: "1.5rem",
      }}
    >
      {/* LEFT CARD */}
      <section style={cardStyle}>
        <h2 style={headerStyle}>Admin Dashboard</h2>

        <p style={textInfoStyle}>
          Each new user automatically receives an Ethereum keypair
          (address + private key). Keys are stored locally (demo only).
        </p>

        <h3 style={subHeaderStyle}>Existing Users</h3>

        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead style={theadStyle}>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>ETH Address</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.username}</td>
                  <td style={tdStyle}>{u.role}</td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                      {u.username === "admin" ? "—" : u.ethAddress || "—"}
                    </span>
                  </td>
                  <td style={deleteButton}>
                    {u.username !== "admin" && (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        style={dangerButtonStyle}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td style={tdStyle} colSpan={4}>
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* RIGHT CARD */}
      <section style={cardStyle}>
        <h3 style={subHeaderStyle}>Create New User</h3>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <label style={labelStyle}>
            New Username
            <input
              style={inputStyle}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </label>

          <label style={labelStyle}>
            New Password
            <input
              style={inputStyle}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          <label style={labelStyle}>
            Role
            <select
              style={inputStyle}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="">Select role...</option>
              <option value="producer">Producer</option>
              <option value="supplier">Supplier</option>
              <option value="consumer">Consumer</option>
            </select>
          </label>

          <button type="submit" style={primaryButtonStyle}>
            Create user (with ETH address)
          </button>
        </form>
      </section>
    </div>
  );
}

/* ------------------ SHARED STYLES (same as Login page) ------------------ */

const cardStyle = {
  background: "#020617",
  borderRadius: "1rem",
  padding: "1.5rem 1.75rem",
  border: "1px solid #1e293b",
  boxShadow: "0 4px 20px rgba(0,0,0,0.35)"
};

const headerStyle = {
  marginTop: 0,
  marginBottom: "0.75rem",
  fontSize: "1.3rem",
  color: "#f9fafb"
};

const subHeaderStyle = {
  marginTop: "1rem",
  marginBottom: "0.5rem",
  fontSize: "1rem",
  color: "#e5e7eb"
};

const textInfoStyle = {
  marginTop: 0,
  marginBottom: "1rem",
  fontSize: "0.85rem",
  color: "#e5e7eb",
  lineHeight: 1.4
};

const labelStyle = {
  display: "block",
  marginBottom: "0.3rem",
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
  width: "100%",
  padding: "0.75rem",
  background: "#00ba1cff",
  color: "#020617",
  border: "none",
  borderRadius: "0.75rem",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.95rem"
};

const dangerButtonStyle = {
  background: "#ef4444",
  color: "#f9fafb",
  border: "none",
  padding: "0.35rem 0.9rem",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: 600
};

/* ----- Table Styles ----- */

const tableWrapperStyle = {
  borderRadius: "0.75rem",
  border: "1px solid #1f2937",
  overflow: "hidden"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.85rem"
};

const theadStyle = {
  background: "#020617",
  borderBottom: "1px solid #1f2937"
};

const thStyle = {
  padding: "0.5rem 0.75rem",
  textAlign: "left",
  fontWeight: 600,
  color: "#e5e7eb"
};

const tdStyle = {
  padding: "0.5rem 0.75rem",
  borderBottom: "1px solid #111827",
  color: "#d1d5db"
};
const deleteButton = {
  padding: "0.5rem 0.1rem",
  borderBottom: "1px solid #111827",
  color: "#d1d5db"
};

export default AdminDashboard;
