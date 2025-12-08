// src/components/ProductTable.js
import React from "react";

function ProductTable({ products, showOwner = true, actions }) {
  const colCount = 5 + (showOwner ? 1 : 0) + (actions ? 1 : 0);

  return (
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
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Product</th>
            {showOwner && <th style={thStyle}>Owner</th>}
            <th style={thStyle}>Price (ETH)</th>
            <th style={thStyle}>Quantity</th>
            <th style={thStyle}>Status</th>
            {actions && <th style={thStyle}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.localId}>
              <td style={tdStyle}>
                {p.onChainId != null
                  ? `#${p.onChainId}`
                  : p.tempId != null
                  ? `#${p.tempId}`
                  : "—"}
              </td>
              <td style={tdStyle}>{p.name}</td>
              {showOwner && (
                <td style={tdStyle}>
                  {p.ownerUsername} ({p.ownerRole})
                </td>
              )}
              <td style={tdStyle}>{p.price}</td>
              <td style={tdStyle}>{p.quantity}</td>
              <td style={tdStyle}>{p.status}</td>
              {actions && <td style={tdStyle}>{actions(p)}</td>}
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td style={tdStyle} colSpan={colCount}>
                No products yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

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

export default ProductTable;
