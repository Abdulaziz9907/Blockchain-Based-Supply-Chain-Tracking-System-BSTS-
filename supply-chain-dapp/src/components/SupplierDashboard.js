// src/components/SupplierDashboard.js
import React from "react";
import ProductTable from "./ProductTable";

function SupplierDashboard({ products, currentUser, onApprove }) {
  const available = products.filter((p) => p.status === "approved");
  const myProducts = products.filter(
    (p) =>
      p.ownerRole === "supplier" && p.ownerUsername === currentUser.username
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
        Supplier Dashboard
      </h2>
      <p
        style={{
          marginTop: 0,
          marginBottom: "1rem",
          fontSize: "0.9rem",
          color: "#e5e7eb"
        }}
      >
        Welcome, {currentUser.username}. View approved products and purchase
        them. On-chain transfers are recorded on Sepolia.
      </p>

      <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
        Available Products
      </h3>
      <ProductTable
        products={available}
        actions={(p) => (
          <button
            onClick={() => onApprove(p)}
            style={smallPrimaryButton}
          >
            Approve (purchase)
          </button>
        )}
      />

      <h3
        style={{
          marginTop: "1.5rem",
          marginBottom: "0.5rem",
          fontSize: "1rem"
        }}
      >
        Your Products
      </h3>
      <ProductTable products={myProducts} />
    </div>
  );
}

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

export default SupplierDashboard;
