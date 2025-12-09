import React from "react";
import ProductTable from "./ProductTable";

function SupplierDashboard({ products, currentUser, onApprove }) {
  const available = products.filter((p) => p.status === "approved");
  const myProducts = products.filter(
    (p) =>
      p.ownerRole === "supplier" && p.ownerUsername === currentUser.username
  );

  return (
    <div style={cardStyle}>
      <h2 style={headerStyle}>Supplier Dashboard</h2>
      <p style={textInfoStyle}>
        Welcome, {currentUser.username}. View approved products and purchase
        them. On-chain transfers are recorded on Sepolia.
      </p>

      <h3 style={subHeaderStyle}>Available Products</h3>
      <ProductTable
        products={available}
        actions={(p) => (
          <button onClick={() => onApprove(p)} style={smallPrimaryButton}>
            Approve (purchase)
          </button>
        )}
      />

      <h3
        style={{
          ...subHeaderStyle,
          marginTop: "1.5rem"
        }}
      >
        Your Products
      </h3>
      <ProductTable products={myProducts} />
    </div>
  );
}

/* ---- shared with Admin/Producer look ---- */

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

export default SupplierDashboard;
