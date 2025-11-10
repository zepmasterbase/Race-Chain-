/**
 * useWallet.js
 * ---------------------------------------------
 * A custom React hook for managing MetaMask wallet
 * connection, network, and status inside RaceChain.
 *
 * Works on top of utils/wallet.js
 */

import { useState, useEffect, useCallback } from "react";
import {
  connectWallet,
  disconnectWallet,
  getConnectedWallet,
  validateNetwork,
  switchNetwork,
  initWalletListeners,
  removeWalletListeners,
  formatAddress,
  getNetworkName,
  getWalletState,
} from "../utils/wallet";
import { DEFAULT_NETWORK } from "../utils/constants";

/**
 * Hook usage example:
 * const {
 *   wallet,
 *   network,
 *   isConnected,
 *   connect,
 *   disconnect,
 *   switchToDefaultNetwork,
 *   formattedAddress
 * } = useWallet();
 */

export default function useWallet() {
  const [wallet, setWallet] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Connect Wallet ---
  const connect = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { wallet, network } = await connectWallet();
      setWallet(wallet);
      setNetwork(network);
      setIsConnected(true);
    } catch (err) {
      console.error("❌ Wallet connect failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Disconnect Wallet ---
  const disconnect = useCallback(() => {
    disconnectWallet();
    setWallet(null);
    setIsConnected(false);
    setNetwork(null);
  }, []);

  // --- Switch Network (to default) ---
  const switchToDefaultNetwork = useCallback(async () => {
    try {
      await switchNetwork(DEFAULT_NETWORK);
      setNetwork(DEFAULT_NETWORK.chainId);
    } catch (err) {
      console.error("❌ Failed to switch network:", err);
      setError("Network switch failed");
    }
  }, []);

  // --- Load existing wallet (if already connected) ---
  const loadExistingWallet = useCallback(async () => {
    try {
      const existing = await getConnectedWallet();
      if (existing) {
        setWallet(existing.wallet);
        setNetwork(existing.network);
        setIsConnected(true);
      }
    } catch (err) {
      console.error("⚠️ Failed to load wallet:", err);
    }
  }, []);

  // --- Validate network (correct chain) ---
  const checkNetwork = useCallback(async () => {
    const valid = await validateNetwork(false);
    if (!valid) {
      console.warn("⚠️ Wrong network. Expected:", DEFAULT_NETWORK.name);
    }
    return valid;
  }, []);

  // --- Auto init on mount ---
  useEffect(() => {
    loadExistingWallet();
    initWalletListeners(() => {
      const state = getWalletState();
      setWallet(state.wallet);
      setNetwork(state.network);
      setIsConnected(!!state.wallet);
    });
    return () => {
      removeWalletListeners();
    };
  }, [loadExistingWallet]);

  // --- Computed values ---
  const formattedAddress = wallet ? formatAddress(wallet) : null;
  const networkName = network ? getNetworkName() : "Unknown";

  return {
    wallet,
    network,
    networkName,
    isConnected,
    loading,
    error,
    connect,
    disconnect,
    switchToDefaultNetwork,
    checkNetwork,
    formattedAddress,
  };
}