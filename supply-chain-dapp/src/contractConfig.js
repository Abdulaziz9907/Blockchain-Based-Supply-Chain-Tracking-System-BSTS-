// src/contractConfig.js

// ⛔ IMPORTANT: Replace this with your actual deployed contract address on Sepolia
export const contractAddress = "YOUR_SEPOLIA_CONTRACT_ADDRESS_HERE";

// Minimal ABI for ProductsChain contract
export const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "metaHash", "type": "string" },
      { "internalType": "uint256", "name": "price", "type": "uint256" },
      { "internalType": "uint256", "name": "qty", "type": "uint256" }
    ],
    "name": "addProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "address", "name": "supplier", "type": "address" },
          { "internalType": "address", "name": "consumer", "type": "address" },
          { "internalType": "string", "name": "ownertx", "type": "string" },
          { "internalType": "string", "name": "suppliertx", "type": "string" },
          { "internalType": "string", "name": "metaHash", "type": "string" },
          { "internalType": "uint256", "name": "price", "type": "uint256" },
          { "internalType": "uint256", "name": "qty", "type": "uint256" },
          { "internalType": "bool", "name": "approved", "type": "bool" },
          { "internalType": "uint64", "name": "createdAt", "type": "uint64" },
          { "internalType": "uint64", "name": "updatedAt", "type": "uint64" }
        ],
        "internalType": "struct ProductsChain.Product",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "metaHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "qty",
        "type": "uint256"
      }
    ],
    "name": "ProductAdded",
    "type": "event"
  }
];
