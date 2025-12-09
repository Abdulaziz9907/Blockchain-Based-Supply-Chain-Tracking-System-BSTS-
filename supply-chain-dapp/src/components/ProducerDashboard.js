// src/components/ProducerDashboard.js
import React, { useState } from "react";
import ProductTable from "./ProductTable";

function ProducerDashboard({
  products,
  currentUser,
  onAddPending,
  onDeletePending,
  onApprovePending
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPending(form);
    setForm({ name: "", price: "", quantity: "" });
  };

  const myPending = products.filter(
    (p) => p.ownerUsername === currentUser.username && p.status === "pending"
  );
  const myApproved = products.filter(
    (p) => p.ownerUsername === currentUser.username && p.status === "approved"
  );

  return (
    <div style={cardStyle}>
      <h2 style={headerStyle}>Producer Dashboard</h2>
      <p style={textInfoStyle}>
        Welcome, {currentUser.username}. Add products below. New products start
        as <em>pending</em>. Approve to publish them on chain.
      </p>

      <h3 style={subHeaderStyle}>Add Product</h3>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}
      >
        <label style={labelStyle}>
          Name
          <input
            style={inputStyle}
            placeholder="e.g., Fresh Apples"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label style={labelStyle}>
          Price (ETH)
          <input
            style={inputStyle}
            type="number"
            min="0"
            step="0.000000000000000001"
            placeholder="e.g., 12.50"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </label>

        <label style={labelStyle}>
          Quantity
          <input
            style={inputStyle}
            type="number"
            min="1"
            placeholder="e.g., 100"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />
        </label>

        <button type="submit" style={primaryButtonStyle}>
          Add
        </button>
      </form>

      <h3 style={subHeaderStyle}>My New Products (Pending)</h3>
      <ProductTable
        products={myPending}
        showOwner={false}
        actions={(p) => (
          <>
            <button
              onClick={() => onApprovePending(p)}
              style={{ ...smallPrimaryButton, marginRight: "0.4rem" }}
            >
              Approve (on chain)
            </button>
            <button
              onClick={() => onDeletePending(p.localId)}
              style={smallDangerButton}
            >
              Delete
            </button>
          </>
        )}
      />

      <h3
        style={{
          ...subHeaderStyle,
          marginTop: "1.5rem"
        }}
      >
        My Approved Products
      </h3>
      <ProductTable products={myApproved} showOwner={false} />
    </div>
  );
}

/* ---- shared with Admin look ---- */

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
  background: "#38bdf8", // same as Admin primary
  color: "#020617",
  border: "none",
  borderRadius: "0.75rem",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.95rem"
};

const smallPrimaryButton = {
  background: "#00ba1cff",
  color: "#020617",
  border: "none",
  padding: "0.35rem 0.9rem",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: 600
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

export default ProducerDashboard;
