// src/components/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { isAddress } from "ethers";

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

  const adminUser = users.find((u) => u.username === "admin");
  const adminEth = adminUser?.ethAddress || "(not set)";

  const [editingAdminEth, setEditingAdminEth] = useState(false);
  const [adminEthInput, setAdminEthInput] = useState(adminEth);
  const [adminEthError, setAdminEthError] = useState("");

  useEffect(() => {
    setAdminEthInput(adminEth);
    setAdminEthError("");
  }, [adminEth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateUser(form); // App generates ETH keypair
    setForm({
      username: "",
      password: "",
      role: ""
    });
  };

  const handleSaveAdminEth = () => {
    const trimmed = adminEthInput.trim();
    if (!isAddress(trimmed)) {
      setAdminEthError("Please enter a valid Ethereum address (0x + 40 hex).");
      return;
    }
    onUpdateAdminEthAddress(trimmed);
    setEditingAdminEth(false);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
        gap: "1.5rem"
      }}
    >
      <section
        style={{
          background: "#020617",
          borderRadius: "1rem",
          padding: "1.25rem 1.5rem",
          border: "1px solid #1e293b"
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
          Admin Dashboard
        </h2>
        <p
          style={{
            marginTop: 0,
            marginBottom: "1rem",
            fontSize: "0.9rem",
            color: "#e5e7eb"
          }}
        >
          Manage users. Each new user automatically receives an Ethereum
          keypair (address + private key) for Sepolia. Private keys are stored
          locally (demo only) and not shown here.
        </p>

        {/* NEW: Admin ETH address editor */}
        <div
          style={{
            marginBottom: "1.25rem",
            padding: "0.75rem 0.9rem",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            background: "#020617"
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              marginBottom: "0.35rem",
              fontWeight: 600
            }}
          >
            Admin ETH address
          </div>

          {!editingAdminEth ? (
            <>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  wordBreak: "break-all",
                  marginBottom: "0.5rem"
                }}
              >
                {adminEth}
              </div>
              <button
                onClick={() => setEditingAdminEth(true)}
                style={{
                  background: "#111827",
                  color: "#e5e7eb",
                  border: "none",
                  padding: "0.35rem 0.9rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                Change address
              </button>
            </>
          ) : (
            <>
              <input
                style={{
                  width: "100%",
                  marginBottom: "0.35rem",
                  padding: "0.45rem 0.6rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #374151",
                  background: "#020617",
                  color: "#f9fafb",
                  fontSize: "0.8rem",
                  outline: "none",
                  fontFamily: "monospace"
                }}
                placeholder="0x..."
                value={adminEthInput}
                onChange={(e) => setAdminEthInput(e.target.value)}
              />
              {adminEthError && (
                <div
                  style={{
                    marginBottom: "0.4rem",
                    fontSize: "0.75rem",
                    color: "#f97373"
                  }}
                >
                  {adminEthError}
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={handleSaveAdminEth}
                  style={{
                    background:
                      "linear-gradient(to right, #22c55e, #38bdf8)",
                    color: "#020617",
                    border: "none",
                    padding: "0.35rem 0.9rem",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAdminEth(false);
                    setAdminEthInput(adminEth);
                    setAdminEthError("");
                  }}
                  style={{
                    background: "#111827",
                    color: "#e5e7eb",
                    border: "none",
                    padding: "0.35rem 0.9rem",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "0.8rem"
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
          Existing Users
        </h3>
        <div
          style={{
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            overflow: "hidden"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem"
            }}
          >
            <thead
              style={{
                background: "#0b1120",
                borderBottom: "1px solid #1f2937"
              }}
            >
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
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.8rem"
                      }}
                    >
                      {u.ethAddress || "—"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {u.username !== "admin" && (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        style={smallDangerButton}
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

      <section
        style={{
          background: "#020617",
          borderRadius: "1rem",
          padding: "1.25rem 1.5rem",
          border: "1px solid #1e293b"
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
          Create New User
        </h3>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>
            New Username
            <input
              style={inputStyle}
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
            />
          </label>
          <label style={labelStyle}>
            New Password
            <input
              style={inputStyle}
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </label>
          <label style={labelStyle}>
            Role
            <select
              style={inputStyle}
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              required
            >
              <option value="">Select role...</option>
              <option value="producer">Producer</option>
              <option value="supplier">Supplier</option>
              <option value="consumer">Consumer</option>
            </select>
          </label>

          <button
            type="submit"
            style={{
              marginTop: "1rem",
              background: "linear-gradient(to right, #22c55e, #8b5cf6)",
              color: "#020617",
              border: "none",
              padding: "0.75rem 1.2rem",
              borderRadius: "0.75rem",
              cursor: "pointer",
              width: "100%",
              fontWeight: 600,
              fontSize: "0.95rem"
            }}
          >
            Create user (with ETH address)
          </button>
        </form>
      </section>
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

const thStyle = {
  padding: "0.5rem 0.75rem",
  textAlign: "left",
  fontWeight: 600,
  borderBottom: "1px solid #1f2937"
};

const tdStyle = {
  padding: "0.5rem 0.75rem",
  borderBottom: "1px solid #111827"
};

const smallDangerButton = {
  background: "#ef4444",
  color: "#f9fafb",
  border: "none",
  padding: "0.35rem 0.9rem",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: 600
};

export default AdminDashboard;
