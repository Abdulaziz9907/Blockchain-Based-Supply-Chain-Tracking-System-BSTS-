// src/contractConfig.js

const STORAGE_KEY = "productsChainContractAddresses_v1";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function loadAllContractAddresses() {
  const storage = getStorage();
  if (!storage) return {};
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch {
    return {};
  }
}

export function loadContractAddress(chainId) {
  if (!chainId) return null;
  const all = loadAllContractAddresses();
  return all[chainId] || null;
}

export function saveContractAddress(chainId, address) {
  const storage = getStorage();
  if (!storage) return;
  const all = loadAllContractAddresses();
  all[chainId] = address;
  storage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// ABI for ProductsChain. Must match the Solidity contract.
export const productsChainAbi = [
  {
    inputs: [
      { internalType: "string", name: "metaHash", type: "string" },
      { internalType: "uint256", name: "priceWei", type: "uint256" },
      { internalType: "uint256", name: "quantity", type: "uint256" }
    ],
    name: "registerProduct",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "role", type: "string" }
    ],
    name: "transferProduct",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getProduct",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "metaHash", type: "string" },
          { internalType: "address", name: "producer", type: "address" },
          { internalType: "address", name: "currentOwner", type: "address" },
          { internalType: "uint256", name: "priceWei", type: "uint256" },
          { internalType: "uint256", name: "quantity", type: "uint256" },
          { internalType: "uint8", name: "stage", type: "uint8" },
          { internalType: "uint64", name: "createdAt", type: "uint64" },
          { internalType: "uint64", name: "updatedAt", type: "uint64" }
        ],
        internalType: "struct ProductsChain.Product",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getProductHistory",
    outputs: [
      {
        components: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "string", name: "role", type: "string" },
          { internalType: "uint64", name: "timestamp", type: "uint64" }
        ],
        internalType: "struct ProductsChain.TransferRecord[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "nextProductId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: true,
        internalType: "address",
        name: "producer",
        type: "address"
      },
      { indexed: false, internalType: "string", name: "metaHash", type: "string" },
      { indexed: false, internalType: "uint256", name: "priceWei", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "quantity", type: "uint256" }
    ],
    name: "ProductRegistered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "string", name: "role", type: "string" }
    ],
    name: "ProductTransferred",
    type: "event"
  }
];
