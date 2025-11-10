/**
 * RaceChain Wallet Utility
 * -------------------------------
 * Centralized MetaMask connection + state management.
 * Handles wallet detection, network validation, and listeners.
 */

import { ethers } from "ethers";
import { DEFAULT_NETWORK } from "./constants.js";

// ====== GLOBAL STATE (in-memory cache) ======
let provider = null;
let signer = null;
let currentWallet = null;
let currentNetwork = null;

// ====== CORE FUNCTIONS ======

/**
 * Detects MetaMask and returns true/false.
 */
export function isMetaMaskInstalled() {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
}

/**
 * Connects to MetaMask and returns wallet address.
 */
export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask not detected. Please install it from https://metamask.io/");
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  currentWallet = accounts[0];

  const network = await provider.getNetwork();
  currentNetwork = network.chainId;

  console.log(`✅ Connected to MetaMask: ${currentWallet} on chain ${network.chainId}`);
  return { wallet: currentWallet, network: network.chainId };
}

/**
 * Returns the currently connected wallet (if any).
 */
export async function getConnectedWallet() {
  if (!isMetaMaskInstalled()) return null;

  const providerCheck = new ethers.BrowserProvider(window.ethereum);
  const accounts = await providerCheck.send("eth_accounts", []);
  if (accounts.length > 0) {
    currentWallet = accounts[0];
    signer = await providerCheck.getSigner();
    const network = await providerCheck.getNetwork();
    currentNetwork = network.chainId;
    return { wallet: currentWallet, network: currentNetwork };
  }
  return null;
}

/**
 * Disconnects wallet (frontend only).
 */
export function disconnectWallet() {
  currentWallet = null;
  signer = null;
  provider = null;
  console.log("🔌 Wallet disconnected (frontend only).");
}

/**
 * Get the ethers provider (for reading blockchain state).
 */
export async function getProvider() {
  if (!provider) {
    if (!isMetaMaskInstalled()) {
      throw new Error("MetaMask not available.");
    }
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  return provider;
}

/**
 * Get signer for transactions (requires user connection).
 */
export async function getSigner() {
  if (!signer) {
    await connectWallet();
  }
  return signer;
}

/**
 * Returns current wallet address.
 */
export function getWalletAddress() {
  return currentWallet;
}

/**
 * Checks if connected to the correct network.
 * If not, optionally attempts to switch.
 */
export async function validateNetwork(shouldSwitch = true) {
  if (!isMetaMaskInstalled()) return false;
  const providerCheck = new ethers.BrowserProvider(window.ethereum);
  const network = await providerCheck.getNetwork();
  currentNetwork = network.chainId;

  if (network.chainId !== DEFAULT_NETWORK.chainId) {
    console.warn(`⚠️ Wrong network: ${network.chainId}. Expected ${DEFAULT_NETWORK.chainId}.`);
    if (shouldSwitch) await switchNetwork(DEFAULT_NETWORK);
    return false;
  }
  return true;
}

/**
 * Requests MetaMask to switch to the correct chain.
 */
export async function switchNetwork(networkConfig) {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ethers.toBeHex(networkConfig.chainId) }],
    });
    console.log(`✅ Switched to ${networkConfig.name}`);
  } catch (error) {
    // If the chain is not added, add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: ethers.toBeHex(networkConfig.chainId),
              chainName: networkConfig.name,
              rpcUrls: [networkConfig.rpcUrl],
              nativeCurrency: {
                name: networkConfig.currency,
                symbol: networkConfig.currency,
                decimals: 18,
              },
              blockExplorerUrls: [networkConfig.explorer],
            },
          ],
        });
        console.log(`✅ Network ${networkConfig.name} added and switched.`);
      } catch (addError) {
        console.error("❌ Failed to add chain:", addError);
      }
    } else {
      console.error("❌ Failed to switch network:", error);
    }
  }
}

/**
 * Sets up listeners for wallet/account/network changes.
 */
export function initWalletListeners(onChange) {
  if (!window.ethereum) return;
  window.ethereum.on("accountsChanged", async (accounts) => {
    console.log("🔄 Accounts changed:", accounts);
    currentWallet = accounts.length > 0 ? accounts[0] : null;
    if (onChange) onChange();
  });

  window.ethereum.on("chainChanged", async (chainId) => {
    console.log("🔄 Chain changed to:", parseInt(chainId, 16));
    currentNetwork = parseInt(chainId, 16);
    if (onChange) onChange();
  });

  console.log("👂 Wallet listeners active");
}

/**
 * Removes all MetaMask listeners.
 */
export function removeWalletListeners() {
  if (!window.ethereum) return;
  window.ethereum.removeAllListeners("accountsChanged");
  window.ethereum.removeAllListeners("chainChanged");
  console.log("🧹 Wallet listeners removed");
}

/**
 * Helper: shorten an address (for UI display).
 */
export function formatAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Helper: get the current chain name.
 */
export function getNetworkName() {
  if (!currentNetwork) return "Unknown";
  switch (currentNetwork) {
    case 137:
      return "Polygon";
    case 80001:
      return "Polygon Mumbai";
    case 8453:
      return "Base";
    case 84531:
      return "Base Goerli";
    default:
      return `Chain ${currentNetwork}`;
  }
}

/**
 * Exports current wallet state.
 */
export function getWalletState() {
  return {
    wallet: currentWallet,
    network: currentNetwork,
    provider,
    signer,
  };
}