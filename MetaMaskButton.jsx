import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./metamaskbutton.css";

/**
 * MetaMaskButton Component
 * Props:
 * - onConnect: function(walletAddress) -> callback after successful connect
 * - onDisconnect: function() -> callback when wallet disconnects (optional)
 * - theme: "light" | "dark" (optional for color variant)
 */

export default function MetaMaskButton({ onConnect, onDisconnect, theme = "dark" }) {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Auto-detect wallet connection on load
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          if (onConnect) onConnect(accounts[0]);
        }
      });

      // Listen for account change
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          if (onConnect) onConnect(accounts[0]);
        } else {
          setWallet(null);
          if (onDisconnect) onDisconnect();
        }
      });
    }
  }, []);

  // Connect MetaMask wallet
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install it from metamask.io.");
        setIsConnecting(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setWallet(account);
      setError("");
      if (onConnect) onConnect(account);
    } catch (err) {
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet (frontend only)
  const disconnectWallet = () => {
    setWallet(null);
    if (onDisconnect) onDisconnect();
  };

  // Display shortened wallet address
  const shortAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className={`metamask-container ${theme}`}>
      {!wallet ? (
        <button
          className={`metamask-btn ${isConnecting ? "loading" : ""}`}
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "🔗 Connect MetaMask"}
        </button>
      ) : (
        <div className="connected-panel">
          <span className="wallet-address">💼 {shortAddress(wallet)}</span>
          <button className="disconnect-btn" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}