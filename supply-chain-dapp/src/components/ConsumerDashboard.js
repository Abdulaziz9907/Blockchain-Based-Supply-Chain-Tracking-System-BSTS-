// src/components/ConsumerDashboard.js
import React, { useState } from "react";
import ProductTable from "./ProductTable";

function ConsumerDashboard({
  products,
  currentUser,
  onApprove,
  onViewHistory
}) {
  const available = products.filter((p) => p.ownerRole === "supplier");
  const myProducts = products.filter(
    (p) =>
      p.ownerRole === "consumer" && p.ownerUsername === currentUser.username
  );

  const [historyRecords, setHistoryRecords] = useState(null);
  const [historyProductName, setHistoryProductName] = useState("");

  const openHistory = async (product) => {
    setHistoryProductName(product.name);
    await onViewHistory(product, setHistoryRecords);
  };

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
        Consumer Dashboard
      </h2>
      <p
        style={{
          marginTop: 0,
          marginBottom: "1rem",
          fontSize: "0.9rem",
          color: "#e5e7eb"
        }}
      >
        Welcome, {currentUser.username}. View approved products from suppliers,
        purchase them, and verify on-chain history.
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
      <ProductTable
        products={myProducts}
        actions={(p) => (
          <button
            onClick={() => openHistory(p)}
            style={smallSecondaryButton}
          >
            View history
          </button>
        )}
      />

      {historyRecords && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "1px solid #1f2937",
            background: "#020617"
          }}
        >
          <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
            On-chain history for: {historyProductName}
          </h4>
          {historyRecords.length === 0 ? (
            <p style={{ fontSize: "0.85rem" }}>No history records.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.8rem"
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>From</th>
                  <th style={thStyle}>To</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Time</th>
                </tr>
              </thead>
              <tbody>
                {historyRecords.map((r, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: "monospace" }}>{r.from}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: "monospace" }}>{r.to}</span>
                    </td>
                    <td style={tdStyle}>{r.role}</td>
                    <td style={tdStyle}>
                      {new Date(Number(r.timestamp) * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
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

const smallSecondaryButton = {
  background: "#1f2937",
  color: "#e5e7eb",
  border: "none",
  padding: "0.35rem 0.9rem",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: 500
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

export default ConsumerDashboard;
