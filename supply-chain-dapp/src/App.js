// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserProvider,
  Contract,
  keccak256,
  toUtf8Bytes,
  parseEther,
  formatEther
} from "ethers";
import { contractAddress, contractABI } from "./contractConfig";

function App() {
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form state for registering a product
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    batchId: "",
    priceEth: "",
    qty: ""
  });

  // State for viewing a product
  const [viewId, setViewId] = useState("");
  const [productInfo, setProductInfo] = useState(null);

  // ---------- Helpers ----------

  const getEthereum = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      return window.ethereum;
    }
    return undefined;
  };

  const getContract = async () => {
    const ethereum = getEthereum();
    if (!ethereum) throw new Error("MetaMask not found");

    // ethers v6: BrowserProvider instead of Web3Provider
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    return new Contract(contractAddress, contractABI, signer);
  };

  // Build a hash of off-chain metadata (stored as metaHash on-chain)
  const buildMetaHash = () => {
    const meta = {
      name: productForm.name,
      description: productForm.description,
      batchId: productForm.batchId
    };
    const json = JSON.stringify(meta);
    const bytes = toUtf8Bytes(json);
    return keccak256(bytes);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "";
    const num = Number(ts);
    const date = new Date(num * 1000);
    if (Number.isNaN(date.getTime())) return ts;
    return date.toLocaleString();
  };

  const weiFromEth = (ethString) => {
    const cleaned = ethString && ethString.trim() !== "" ? ethString : "0";
    return parseEther(cleaned); // returns bigint internally, that's fine
  };

  // ---------- MetaMask setup ----------

  useEffect(() => {
    const ethereum = getEthereum();
    if (ethereum) {
      setHasMetaMask(true);

      ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        })
        .catch(console.error);

      ethereum
        .request({ method: "eth_chainId" })
        .then((id) => setChainId(id))
        .catch(console.error);

      ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });

      ethereum.on("chainChanged", (id) => {
        setChainId(id);
      });
    } else {
      setHasMetaMask(false);
    }
  }, []);

  const connectWallet = async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setStatus("MetaMask not detected. Please install the extension.");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccount(accounts[0]);
      setStatus("Connected to MetaMask");
    } catch (err) {
      console.error(err);
      setStatus("User rejected connection request.");
    }
  };

  // ---------- Contract interactions ----------

  const handleRegisterProduct = async (e) => {
    e.preventDefault();
    if (!account) {
      setStatus("Connect your wallet first.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Preparing transaction...");

      const metaHash = buildMetaHash();
      const priceWei = weiFromEth(productForm.priceEth);

      // validate quantity using normal numbers
      const qtyStr = productForm.qty || "0";
      const qtyNum = Number(qtyStr);

      if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
        setStatus("Quantity must be > 0");
        setIsLoading(false);
        return;
      }

      // pass qty as string (ethers will convert to uint256)
      const qty = qtyStr;

      const contract = await getContract();

      const tx = await contract.addProduct(metaHash, priceWei, qty);
      setStatus(`Submitted tx: ${tx.hash}. Waiting for confirmation...`);

      const receipt = await tx.wait();
      setStatus(`Transaction confirmed in block ${receipt.blockNumber}.`);

      // Attempt to parse ProductAdded event to get the new product ID
      const event = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((parsed) => parsed && parsed.name === "ProductAdded");

      if (event) {
        const id = event.args.id.toString();
        setStatus(
          `Product registered successfully with on-chain ID: ${id}. Tx: ${tx.hash}`
        );
      }

      // Reset form
      setProductForm({
        name: "",
        description: "",
        batchId: "",
        priceEth: "",
        qty: ""
      });
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message ?? "Transaction failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = async (e) => {
    e.preventDefault();
    if (!viewId) {
      setStatus("Enter a product ID to view.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Loading product from blockchain...");

      const contract = await getContract();
      const product = await contract.getProduct(viewId);

      setProductInfo({
        id: product.id.toString(),
        owner: product.owner,
        supplier: product.supplier,
        consumer: product.consumer,
        ownertx: product.ownertx,
        suppliertx: product.suppliertx,
        metaHash: product.metaHash,
        priceWei: product.price.toString(),
        priceEth: formatEther(product.price),
        qty: product.qty.toString(),
        approved: product.approved,
        createdAt: product.createdAt.toString(),
        updatedAt: product.updatedAt.toString()
      });

      setStatus("Product loaded.");
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message ?? "Failed to load product"}`);
      setProductInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Render ----------

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#0f172a",
        color: "#f9fafb",
        padding: "2rem"
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "grid",
          gap: "1.5rem"
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem" }}>
              Supply Chain Transparency DApp
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#cbd5f5"
              }}
            >
              ICS 440 – Products tracking via Ethereum & MetaMask
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            {!hasMetaMask && (
              <p style={{ color: "#f97373", marginBottom: "0.5rem" }}>
                MetaMask not detected
              </p>
            )}

            {account ? (
              <>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#cbd5f5",
                    marginBottom: "0.25rem"
                  }}
                >
                  Connected:
                </div>
                <div
                  style={{
                    padding: "0.35rem 0.75rem",
                    background: "#1f2937",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    wordBreak: "break-all"
                  }}
                >
                  {account}
                </div>
                {chainId && (
                  <div
                    style={{ marginTop: "0.25rem", fontSize: "0.75rem" }}
                  >
                    Chain ID: {chainId}{" "}
                    <span style={{ opacity: 0.7 }}>
                      (Sepolia = 0xaa36a7)
                    </span>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={connectWallet}
                style={{
                  background: "#4f46e5",
                  color: "#f9fafb",
                  border: "none",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "999px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}
              >
                Connect MetaMask
              </button>
            )}
          </div>
        </header>

        {/* Status bar */}
        {status && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              background: "#111827",
              border: "1px solid #1f2937",
              fontSize: "0.85rem"
            }}
          >
            {isLoading ? "⏳ " : "ℹ️ "}
            {status}
          </div>
        )}

        {/* Layout: left = register, right = view */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: "1.5rem"
          }}
        >
          {/* Card: Register Product */}
          <section
            style={{
              background: "#020617",
              borderRadius: "1rem",
              padding: "1.25rem 1.25rem 1.5rem",
              border: "1px solid #1e293b",
              boxShadow: "0 15px 30px rgba(0,0,0,0.35)"
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "0.75rem",
                fontSize: "1.15rem"
              }}
            >
              Register Product (Producer)
            </h2>
            <p
              style={{
                marginTop: 0,
                marginBottom: "1rem",
                fontSize: "0.85rem",
                color: "#e5e7eb"
              }}
            >
              This hashes the product details and stores only the hash, price
              (wei), and quantity on-chain.
            </p>

            <form onSubmit={handleRegisterProduct}>
              <label style={labelStyle}>
                Product Name
                <input
                  style={inputStyle}
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      name: e.target.value
                    })
                  }
                  required
                />
              </label>

              <label style={labelStyle}>
                Description
                <textarea
                  style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value
                    })
                  }
                  required
                />
              </label>

              <label style={labelStyle}>
                Batch ID / Internal ID
                <input
                  style={inputStyle}
                  value={productForm.batchId}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      batchId: e.target.value
                    })
                  }
                  required
                />
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem"
                }}
              >
                <label style={labelStyle}>
                  Price (ETH)
                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    step="0.000000000000000001"
                    value={productForm.priceEth}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        priceEth: e.target.value
                      })
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
                    value={productForm.qty}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        qty: e.target.value
                      })
                    }
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !account}
                style={{
                  marginTop: "1rem",
                  background: isLoading ? "#4b5563" : "#22c55e",
                  color: "#020617",
                  border: "none",
                  padding: "0.75rem 1.2rem",
                  borderRadius: "0.75rem",
                  cursor: isLoading || !account ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  width: "100%"
                }}
              >
                {isLoading ? "Processing..." : "Register Product On-chain"}
              </button>

              {!account && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.8rem",
                    color: "#f87171"
                  }}
                >
                  Connect MetaMask to register products.
                </p>
              )}
            </form>
          </section>

          {/* Card: View Product */}
          <section
            style={{
              background: "#020617",
              borderRadius: "1rem",
              padding: "1.25rem 1.25rem 1.5rem",
              border: "1px solid #1e293b",
              boxShadow: "0 15px 30px rgba(0,0,0,0.35)"
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "0.75rem",
                fontSize: "1.15rem"
              }}
            >
              View Product by ID
            </h2>
            <p
              style={{
                marginTop: 0,
                marginBottom: "1rem",
                fontSize: "0.85rem",
                color: "#e5e7eb"
              }}
            >
              Consumers and suppliers can verify the on-chain product info here.
            </p>

            <form onSubmit={handleViewProduct} style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>
                Product ID
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  value={viewId}
                  onChange={(e) => setViewId(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: "0.75rem",
                  background: "#38bdf8",
                  color: "#020617",
                  border: "none",
                  padding: "0.65rem 1rem",
                  borderRadius: "0.75rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  width: "100%"
                }}
              >
                {isLoading ? "Loading..." : "Load Product"}
              </button>
            </form>

            {productInfo && (
              <div
                style={{
                  fontSize: "0.85rem",
                  background: "#020617",
                  borderRadius: "0.75rem",
                  border: "1px solid #1f2937",
                  padding: "0.75rem"
                }}
              >
                <p>
                  <strong>ID:</strong> {productInfo.id}
                </p>
                <p>
                  <strong>Owner (Producer):</strong> {productInfo.owner}
                </p>
                <p>
                  <strong>Supplier:</strong> {productInfo.supplier}
                </p>
                <p>
                  <strong>Consumer:</strong> {productInfo.consumer}
                </p>

                <p>
                  <strong>Meta Hash:</strong> {productInfo.metaHash}
                </p>
                <p>
                  <strong>Price:</strong> {productInfo.priceEth} ETH (
                  {productInfo.priceWei} wei)
                </p>
                <p>
                  <strong>Quantity:</strong> {productInfo.qty}
                </p>
                <p>
                  <strong>Approved:</strong> {productInfo.approved ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {formatTimestamp(productInfo.createdAt)}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {formatTimestamp(productInfo.updatedAt)}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "1rem",
            fontSize: "0.75rem",
            color: "#9ca3af",
            textAlign: "center"
          }}
        >
          Later you can add a QR scanner that fills the Product ID field to
          match the optional QR feature in your project.
        </footer>
      </div>
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

export default App;
