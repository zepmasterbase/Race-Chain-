import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import NeonBackground from "../components/NeonBackground";
import "./home.css";

export default function HomePage({ setWallet }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Connect MetaMask
  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install it to continue.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWallet(accounts[0]);
      setError("");
      navigate("/garage"); // Move to garage after connection
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="homepage">
      <NeonBackground />

      <div className="overlay" />

      <header className="hero">
        <h1 className="title">RACECHAIN</h1>
        <p className="subtitle">Web3 Racing in the Metaverse</p>

        <button className="connect-btn" onClick={connectWallet}>
          🔗 Connect MetaMask to Play
        </button>

        {error && <p className="error">{error}</p>}
      </header>

      <footer className="footer">
        <p>
          Powered by <strong>Zep Cash (ZAC)</strong> | © 2025 RaceChain
        </p>
      </footer>
    </div>
  );
}