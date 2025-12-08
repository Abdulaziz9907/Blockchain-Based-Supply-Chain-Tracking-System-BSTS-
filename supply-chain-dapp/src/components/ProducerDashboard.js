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
    <div
      style={{
        background: "#020617",
        borderRadius: "1rem",
        padding: "1.25rem 1.5rem",
        border: "1px solid #1e293b"
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
        Producer Dashboard
      </h2>
      <p
        style={{
          marginTop: 0,
          marginBottom: "1rem",
          fontSize: "0.9rem",
          color: "#e5e7eb"
        }}
      >
        Welcome, {currentUser.username}. Add products below. New products start
        as <em>pending</em>. Approve to publish them on chain.
      </p>

      <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
        Add Product
      </h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle}>
          Name
          <input
            style={inputStyle}
            placeholder="e.g., Fresh Apples"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
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
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
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
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
            required
          />
        </label>

        <button
          type="submit"
          style={{
            marginTop: "0.75rem",
            background: "linear-gradient(to right, #38bdf8, #8b5cf6)",
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
          Add
        </button>
      </form>

      <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
        My New Products (Pending)
      </h3>
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
          marginTop: "1.5rem",
          marginBottom: "0.5rem",
          fontSize: "1rem"
        }}
      >
        My Approved Products
      </h3>
      <ProductTable products={myApproved} showOwner={false} />
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

const smallPrimaryButton = {
  background: "linear-gradient(to right, #38bdf8, #8b5cf6)",
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
