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
    <div style={cardStyle}>
      <h2 style={headerStyle}>Consumer Dashboard</h2>
      <p style={textInfoStyle}>
        Welcome, {currentUser.username}. View approved products from suppliers,
        purchase them, and verify on-chain history.
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
      <ProductTable
        products={myProducts}
        actions={(p) => (
          <button onClick={() => openHistory(p)} style={smallSecondaryButton}>
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

/* ---- shared card/typography with Admin/Producer/Supplier ---- */

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

/* ---- buttons ---- */

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

/* ---- history table ---- */

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
