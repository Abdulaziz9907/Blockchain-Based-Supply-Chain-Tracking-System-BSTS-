// src/ethHelpers.js
import {
  BrowserProvider,
  Contract,
  keccak256,
  toUtf8Bytes,
  isAddress
} from "ethers";
import { loadContractAddress, productsChainAbi } from "./contractConfig";

export const DEFAULT_CHAIN_ID = "0xaa36a7"; // Sepolia

export function getEthereum() {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum;
  }
  return undefined;
}

export async function getProductsChainContract(setStatus) {
  const ethereum = getEthereum();
  if (!ethereum) {
    if (setStatus) {
      setStatus("MetaMask not detected. Please install the extension.");
    }
    throw new Error("no-metamask");
  }

  // Bring up MetaMask account selection on first use
  let accounts = await ethereum.request({ method: "eth_accounts" });
  if (!accounts || accounts.length === 0) {
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
  }

  let chainId = await ethereum.request({ method: "eth_chainId" });

  // If we're not on Sepolia, try to switch
  if (chainId !== DEFAULT_CHAIN_ID) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: DEFAULT_CHAIN_ID }]
      });
      chainId = DEFAULT_CHAIN_ID;
    } catch (switchErr) {
      if (setStatus) {
        setStatus("Please switch the MetaMask network to Sepolia and try again.");
      }
      throw new Error("wrong-network");
    }
  }

  const address = loadContractAddress(chainId);

  if (!address) {
    if (setStatus) {
      setStatus(
        "No ProductsChain contract address set for Sepolia. " +
          "Check with admin to set the contract."
      );
    }
    throw new Error("no-contract");
  }

  if (!isAddress(address)) {
    if (setStatus) {
      setStatus(
        "The saved ProductsChain address is not a valid 0x address. " +
          "Open 'Set contract' and correct it."
      );
    }
    throw new Error("bad-address");
  }

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const signerAddress = await signer.getAddress();
  const contract = new Contract(address, productsChainAbi, signer);

  return { contract, signerAddress, chainId };
}

// Build a keccak256 hash of off-chain metadata
export function buildProductMetaHash(product, ownerUser) {
  const meta = {
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    ownerUsername: ownerUser.username,
    ownerEthAddress: ownerUser.ethAddress || null
  };
  const json = JSON.stringify(meta);
  const bytes = toUtf8Bytes(json);
  return keccak256(bytes);
}
