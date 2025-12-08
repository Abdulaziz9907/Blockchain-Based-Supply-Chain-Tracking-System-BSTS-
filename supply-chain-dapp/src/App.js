// src/App.js
import React, { useEffect, useState } from "react";
import { Wallet, parseEther, isAddress } from "ethers";

import { loadUsers, saveUsers, loadProducts, saveProducts } from "./dataStore";
import {
  getEthereum,
  getProductsChainContract,
  buildProductMetaHash,
  DEFAULT_CHAIN_ID
} from "./ethHelpers";
import {
  loadContractAddress,
  saveContractAddress
} from "./contractConfig";

import LoginScreen from "./components/LoginScreen";
import AdminDashboard from "./components/AdminDashboard";
import ProducerDashboard from "./components/ProducerDashboard";
import SupplierDashboard from "./components/SupplierDashboard";
import ConsumerDashboard from "./components/ConsumerDashboard";

const ROLES = ["admin", "producer", "supplier", "consumer"];

function App() {
  const [users, setUsers] = useState(loadUsers);
  const [products, setProducts] = useState(loadProducts);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState("login");

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [account, setAccount] = useState(null); // MetaMask account
  const [chainId, setChainId] = useState(null);

  const [contractAddress, setContractAddress] = useState(null);
  const [showContractModal, setShowContractModal] = useState(false);

  // Remove white body margin + set global background
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.margin = "0";
      document.body.style.backgroundColor = "#020617";
    }
  }, []);

  // (Removed) auto-ETH keypair creation for admin user

  // Persist state
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  // Load contract address from localStorage when chain changes
  useEffect(() => {
    const effectiveChain = chainId || DEFAULT_CHAIN_ID;
    const addr = loadContractAddress(effectiveChain);
    setContractAddress(addr || null);
  }, [chainId]);

  // MetaMask listeners (no forced connect)
  useEffect(() => {
    const ethereum = getEthereum();
    if (ethereum) {
      setHasMetaMask(true);

      ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) setAccount(accounts[0]);
        })
        .catch(() => {});

      ethereum
        .request({ method: "eth_chainId" })
        .then((id) => setChainId(id))
        .catch(() => {});

      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0] || null);
      };
      const handleChainChanged = (id) => {
        setChainId(id);
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
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
      const id = await ethereum.request({ method: "eth_chainId" });
      setChainId(id);
      setStatus("Connected to MetaMask");
    } catch (err) {
      console.error(err);
      setStatus("User rejected MetaMask connection.");
    }
  };

  const disconnectWallet = async () => {
    const ethereum = getEthereum();
    if (ethereum && account) {
      try {
        await ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }]
        });
      } catch {
        // ignore
      }
    }
    setAccount(null);
    setChainId(null);
    setStatus("Disconnected from MetaMask in this app.");
  };

  const handleSaveContractAddress = (addr) => {
    const effectiveChain = chainId || DEFAULT_CHAIN_ID;
    saveContractAddress(effectiveChain, addr);
    setContractAddress(addr);
    setStatus(
      `Contract address saved for network ${effectiveChain}. Future on-chain actions will use this address.`
    );
  };

  // ------------------------ Auth ------------------------

  const handleLogin = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      setStatus("Invalid username or password.");
      return false;
    }
    if (!ROLES.includes(user.role)) {
      setStatus("User has invalid role.");
      return false;
    }
    setCurrentUser(user);
    setActiveView(user.role);
    setStatus(`Logged in as ${user.username} (${user.role}).`);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView("login");
    setStatus("");
  };

  // ------------------------ Admin user management ------------------------

  const handleCreateUser = (newUser) => {
    if (!currentUser || currentUser.role !== "admin") return;

    const { username, password, role } = newUser;

    if (!username || !password || !role) {
      setStatus("Username, password, and role are required.");
      return;
    }
    if (!ROLES.includes(role) || role === "admin") {
      setStatus("Role must be producer, supplier, or consumer.");
      return;
    }
    if (users.some((u) => u.username === username)) {
      setStatus("Username already exists.");
      return;
    }

    // Always create a new Sepolia keypair for the user (non-admin)
    const wallet = Wallet.createRandom();
    const ethAddress = wallet.address;
    const privateKey = wallet.privateKey;

    const user = {
      id: "u-" + Date.now().toString(),
      username,
      password,
      role,
      ethAddress,
      privateKey
    };

    setUsers((prev) => [...prev, user]);
    setStatus(`User '${username}' created successfully with ETH address.`);
  };

  const handleDeleteUser = (userId) => {
    if (!currentUser || currentUser.role !== "admin") return;
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    if (user.username === "admin") {
      setStatus("Cannot delete the default admin user.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setStatus(`User '${user.username}' deleted.`);
  };

  // ✅ This still exists but is now effectively unused,
  // and admin doesn't get/need an ETH address in the UI.
  const handleUpdateAdminEthAddress = (newAddress) => {
    if (!isAddress(newAddress)) {
      setStatus("Admin ETH address must be a valid Ethereum address.");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.username === "admin"
          ? { ...u, ethAddress: newAddress, privateKey: "" }
          : u
      )
    );

    setCurrentUser((prev) =>
      prev && prev.username === "admin"
        ? { ...prev, ethAddress: newAddress, privateKey: "" }
        : prev
    );

    setStatus(`Admin ETH address updated to ${newAddress}.`);
  };

  // ------------------------ Producer product management ------------------------

  const handleAddPendingProduct = (input) => {
    if (!currentUser || currentUser.role !== "producer") return;

    const qtyNum = Number(input.quantity || "0");
    if (!input.name || !input.price || !Number.isFinite(qtyNum) || qtyNum <= 0) {
      setStatus("Name, price, and positive quantity are required.");
      return;
    }

    const nextTempId =
      products.reduce(
        (max, p) => Math.max(max, p.tempId != null ? p.tempId : 0),
        0
      ) + 1;

    const product = {
      localId: "p-" + Date.now().toString(),
      onChainId: null,
      tempId: nextTempId,
      name: input.name,
      price: input.price,
      quantity: qtyNum,
      ownerUsername: currentUser.username,
      ownerRole: "producer",
      status: "pending",
      metaHash: null,
      lastTxHash: null
    };

    setProducts((prev) => [...prev, product]);
    setStatus(
      `Product '${product.name}' added to pending list with id #${nextTempId}.`
    );
  };

  const handleDeletePendingProduct = (localId) => {
    if (!currentUser) return;
    setProducts((prev) =>
      prev.filter((p) => !(p.localId === localId && p.status === "pending"))
    );
    setStatus("Pending product removed.");
  };

  const handleApprovePendingProduct = async (product) => {
    if (!currentUser || currentUser.role !== "producer") return;
    if (!product || product.status !== "pending") return;

    try {
      setIsLoading(true);
      setStatus("Sending registerProduct transaction via MetaMask...");

      const { contract, signerAddress, chainId: chain } =
        await getProductsChainContract(setStatus);
      setAccount(signerAddress);
      setChainId(chain);

      const metaHash = buildProductMetaHash(product, currentUser);
      const priceWei = parseEther(product.price || "0");
      const qtyStr = String(product.quantity);

      const tx = await contract.registerProduct(metaHash, priceWei, qtyStr);
      setStatus(`Tx sent: ${tx.hash}. Waiting for confirmation...`);
      const receipt = await tx.wait();

      let productId = null;

      try {
        for (const log of receipt.logs) {
          try {
            const parsed = contract.interface.parseLog(log);
            if (parsed && parsed.name === "ProductRegistered") {
              productId = Number(parsed.args.id.toString());
              break;
            }
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      }

      if (!productId) {
        try {
          const nextId = await contract.nextProductId();
          productId = Number(nextId.toString());
        } catch {
          // ignore
        }
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.localId === product.localId
            ? {
                ...p,
                status: "approved",
                onChainId: productId != null ? productId : p.onChainId,
                metaHash,
                lastTxHash: tx.hash
              }
            : p
        )
      );

      setStatus(
        `Product approved on-chain${
          productId ? ` with id #${productId}` : ""
        }. Tx: ${tx.hash}`
      );
    } catch (err) {
      console.error(err);
      if (
        err.message === "wrong-network" ||
        err.message === "no-contract" ||
        err.message === "no-metamask" ||
        err.message === "bad-address"
      ) {
        return; // friendly message already set
      }
      setStatus(
        "Error while approving product: " +
          (err.reason || err.message || "unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------ Supplier actions ------------------------

  const handleSupplierApprove = async (product) => {
    if (!currentUser || currentUser.role !== "supplier") return;
    if (!product.onChainId) {
      setStatus("This product has not been published on chain yet.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Sending transferProduct (to supplier) via MetaMask...");

      const { contract, signerAddress, chainId: chain } =
        await getProductsChainContract(setStatus);
      setAccount(signerAddress);
      setChainId(chain);

      const tx = await contract.transferProduct(
        product.onChainId,
        signerAddress,
        "TO_SUPPLIER"
      );
      setStatus(`Tx sent: ${tx.hash}. Waiting for confirmation...`);
      await tx.wait();

      setProducts((prev) =>
        prev.map((p) =>
          p.localId === product.localId
            ? {
                ...p,
                ownerRole: "supplier",
                ownerUsername: currentUser.username,
                status: "withSupplier",
                lastTxHash: tx.hash
              }
            : p
        )
      );

      setStatus("Product transferred to supplier on-chain. Tx: " + tx.hash);
    } catch (err) {
      console.error(err);
      if (
        err.message === "wrong-network" ||
        err.message === "no-contract" ||
        err.message === "no-metamask" ||
        err.message === "bad-address"
      ) {
        return;
      }
      setStatus(
        "Error while transferring to supplier: " +
          (err.reason || err.message || "unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------ Consumer actions ------------------------

  const handleConsumerApprove = async (product) => {
    if (!currentUser || currentUser.role !== "consumer") return;
    if (!product.onChainId) {
      setStatus("This product has not been published on chain yet.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Sending transferProduct (to consumer) via MetaMask...");

      const { contract, signerAddress, chainId: chain } =
        await getProductsChainContract(setStatus);
      setAccount(signerAddress);
      setChainId(chain);

      const tx = await contract.transferProduct(
        product.onChainId,
        signerAddress,
        "TO_CONSUMER"
      );
      setStatus(`Tx sent: ${tx.hash}. Waiting for confirmation...`);
      await tx.wait();

      setProducts((prev) =>
        prev.map((p) =>
          p.localId === product.localId
            ? {
                ...p,
                ownerRole: "consumer",
                ownerUsername: currentUser.username,
                status: "withConsumer",
                lastTxHash: tx.hash
              }
            : p
        )
      );

      setStatus("Product transferred to consumer on-chain. Tx: " + tx.hash);
    } catch (err) {
      console.error(err);
      if (
        err.message === "wrong-network" ||
        err.message === "no-contract" ||
        err.message === "no-metamask" ||
        err.message === "bad-address"
      ) {
        return;
      }
      setStatus(
        "Error while transferring to consumer: " +
          (err.reason || err.message || "unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistory = async (product, setHistoryRecords) => {
    if (!product.onChainId) {
      setStatus("Product has no on-chain id yet.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Loading on-chain history...");

      const { contract, signerAddress, chainId: chain } =
        await getProductsChainContract(setStatus);
      setAccount(signerAddress);
      setChainId(chain);

      const records = await contract.getProductHistory(product.onChainId);
      setHistoryRecords(records);
      setStatus("History loaded from blockchain.");
    } catch (err) {
      console.error(err);
      if (
        err.message === "wrong-network" ||
        err.message === "no-contract" ||
        err.message === "no-metamask" ||
        err.message === "bad-address"
      ) {
        return;
      }
      setStatus(
        "Error while loading history: " +
          (err.reason || err.message || "unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------ Render ------------------------

  if (!currentUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          background: "#0f172a",
          color: "#f9fafb",
          padding: "2rem"
        }}
      >
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <LoginScreen onLogin={handleLogin} status={status} />
        </div>
      </div>
    );
  }

  const headerRight = (
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
            MetaMask account:
          </div>
          <div
            style={{
              padding: "0.35rem 0.75rem",
              background: "#1f2937",
              borderRadius: "999px",
              fontSize: "0.8rem",
              wordBreak: "break-all",
              marginBottom: "0.4rem"
            }}
          >
            {account}
          </div>
          {chainId && (
            <div style={{ marginBottom: "0.5rem", fontSize: "0.75rem" }}>
              Chain ID: {chainId}{" "}
              <span style={{ opacity: 0.7 }}>(Sepolia = 0xaa36a7)</span>
            </div>
          )}

          <button
            onClick={disconnectWallet}
            style={{
              background: "#1f2937",
              color: "#e5e7eb",
              border: "none",
              padding: "0.45rem 0.9rem",
              borderRadius: "999px",
              cursor: "pointer",
              fontSize: "0.8rem",
              marginBottom: "0.5rem"
            }}
          >
            Disconnect MetaMask
          </button>
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
            fontSize: "0.9rem",
            marginBottom: "0.5rem"
          }}
        >
          Connect MetaMask
        </button>
      )}

      <div style={{ marginTop: "0.5rem" }}>
        <div
          style={{
            fontSize: "0.75rem",
            marginBottom: "0.25rem",
            color: "#cbd5f5"
          }}
        >
          Contract:{" "}
          <span style={{ fontFamily: "monospace" }}>
            {contractAddress || "not set"}
          </span>
        </div>
        <button
          onClick={() => setShowContractModal(true)}
          style={{
            background: "#111827",
            color: "#e5e7eb",
            border: "none",
            padding: "0.4rem 0.9rem",
            borderRadius: "999px",
            cursor: "pointer",
            fontSize: "0.8rem"
          }}
        >
          Set contract
        </button>
      </div>
    </div>
  );

  const userEth = currentUser.ethAddress || "not assigned";

  const userEthMismatch =
    currentUser.role !== "admin" &&
    account &&
    currentUser.ethAddress &&
    account.toLowerCase() !== currentUser.ethAddress.toLowerCase();

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#020617",
        color: "#f9fafb",
        padding: "2rem"
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          display: "grid",
          gap: "1.5rem"
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem"
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "1.7rem" }}>
              Supply Chain Tracking App
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#cbd5f5"
              }}
            >
              Role: <strong>{currentUser.role}</strong>{" "}
              <span style={{ opacity: 0.8 }}>
                — Welcome, {currentUser.username}.
              </span>
            </p>

            {/* Hide ETH address + MetaMask mismatch line for admin */}
            {currentUser.role !== "admin" && (
              <p
                style={{
                  margin: 0,
                  marginTop: "0.25rem",
                  fontSize: "0.8rem",
                  color: "#9ca3af"
                }}
              >
                User ETH address:&nbsp;
                <span style={{ fontFamily: "monospace" }}>{userEth}</span>
                {userEthMismatch && (
                  <span style={{ color: "#f97373", marginLeft: "0.25rem" }}>
                    (⚠ MetaMask account is different)
                  </span>
                )}
              </p>
            )}
          </div>

          {headerRight}
        </header>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.25rem"
          }}
        >
          <div />
          <div>
            <button
              onClick={() => setActiveView(currentUser.role)}
              style={{
                marginRight: "0.75rem",
                background: "#1f2937",
                color: "#e5e7eb",
                border: "none",
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "0.8rem"
              }}
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "#ef4444",
                color: "#f9fafb",
                border: "none",
                padding: "0.45rem 0.9rem",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "0.8rem"
              }}
            >
              Log out
            </button>
          </div>
        </div>

        {status && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              background: "#020617",
              border: "1px solid #1f2937",
              fontSize: "0.85rem"
            }}
          >
            {isLoading ? "⏳ " : "ℹ️ "}
            {status}
          </div>
        )}

        {activeView === "admin" && (
          <AdminDashboard
            users={users}
            onCreateUser={handleCreateUser}
            onDeleteUser={handleDeleteUser}
            onUpdateAdminEthAddress={handleUpdateAdminEthAddress}
          />
        )}

        {activeView === "producer" && (
          <ProducerDashboard
            products={products}
            currentUser={currentUser}
            onAddPending={handleAddPendingProduct}
            onDeletePending={handleDeletePendingProduct}
            onApprovePending={handleApprovePendingProduct}
          />
        )}

        {activeView === "supplier" && (
          <SupplierDashboard
            products={products}
            currentUser={currentUser}
            onApprove={handleSupplierApprove}
          />
        )}

        {activeView === "consumer" && (
          <ConsumerDashboard
            products={products}
            currentUser={currentUser}
            onApprove={handleConsumerApprove}
            onViewHistory={handleViewHistory}
          />
        )}

        <ContractModal
          isOpen={showContractModal}
          onClose={() => setShowContractModal(false)}
          onSave={handleSaveContractAddress}
          chainId={chainId || DEFAULT_CHAIN_ID}
          currentAddress={contractAddress || ""}
        />
      </div>
    </div>
  );
}

// ------------------------ Contract address modal ------------------------

function ContractModal({
  isOpen,
  onClose,
  onSave,
  chainId,
  currentAddress
}) {
  const [address, setAddress] = useState(currentAddress || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAddress(currentAddress || "");
      setError("");
    }
  }, [isOpen, currentAddress]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = address.trim();
    if (!isAddress(trimmed)) {
      setError("Please enter a valid Ethereum address (0x + 40 hex chars).");
      return;
    }
    onSave(trimmed);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#020617",
          borderRadius: "1rem",
          border: "1px solid #1e293b",
          padding: "1.5rem"
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
          Set ProductsChain Address
        </h2>
        <p
          style={{
            marginTop: 0,
            marginBottom: "0.75rem",
            fontSize: "0.85rem",
            color: "#e5e7eb"
          }}
        >
          Paste the deployed <strong>ProductsChain</strong> contract address for
          this network.
        </p>
        <p
          style={{
            marginTop: 0,
            marginBottom: "0.75rem",
            fontSize: "0.8rem",
            color: "#9ca3af"
          }}
        >
          Network chainId: <code>{chainId}</code> (Sepolia is{" "}
          <code>0xaa36a7</code>). This address is stored only in your browser.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.8rem",
              fontWeight: 500
            }}
          >
            Contract address
            <input
              style={{
                width: "100%",
                marginTop: "0.25rem",
                padding: "0.5rem 0.6rem",
                borderRadius: "0.6rem",
                border: "1px solid #374151",
                background: "#020617",
                color: "#f9fafb",
                fontSize: "0.85rem",
                outline: "none"
              }}
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>

          {error && (
            <div
              style={{
                marginBottom: "0.75rem",
                fontSize: "0.8rem",
                color: "#f97373"
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              marginTop: "0.75rem"
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#111827",
                color: "#e5e7eb",
                border: "none",
                padding: "0.5rem 0.9rem",
                borderRadius: "0.75rem",
                cursor: "pointer",
                fontSize: "0.8rem"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "linear-gradient(to right, #22c55e, #38bdf8)",
                color: "#020617",
                border: "none",
                padding: "0.5rem 0.9rem",
                borderRadius: "0.75rem",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 600
              }}
            >
              Save address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
