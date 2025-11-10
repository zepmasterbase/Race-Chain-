import { useState } from "react";
import { ethers } from "ethers";
import NeonBackground from "../components/NeonBackground";
import "./home.css";

export default function HomePage() {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setError("MetaMask not found. Please install it to play.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWallet(accounts[0]);
      setError("");
    } catch (err) {
      setError("Connection failed: " + err.message);
    }
  }

  const cities = [
    { name: "Cape Town", color: "#00ffd5" },
    { name: "Nairobi", color: "#ff00d0" },
    { name: "Accra", color: "#ffaa00" },
    { name: "Lagos", color: "#00aaff" },
  ];

  return (
    <div className="homepage">
      <NeonBackground />
      <header className="hero">
        <h1 className="title">RACECHAIN</h1>
        <p className="subtitle">Web3 Racing in the Metaverse</p>

        {!wallet ? (
          <button className="connect-btn" onClick={connectWallet}>
            🔗 Connect MetaMask to Start
          </button>
        ) : (
          <div className="connected">
            Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </header>

      <section className="city-section">
        <h2>Select Your City Track</h2>
        <div className="city-grid">
          {cities.map((c) => (
            <div
              key={c.name}
              className={`city-card ${selectedCity === c.name ? "active" : ""}`}
              style={{ borderColor: c.color }}
              onClick={() => setSelectedCity(c.name)}
            >
              <h3>{c.name}</h3>
            </div>
          ))}
        </div>
        {selectedCity && (
          <p className="city-selected">
            ✅ You selected <strong>{selectedCity}</strong>. Get ready to race!
          </p>
        )}
      </section>

      <footer className="footer">
        <p>Powered by <strong>Zep Cash (ZAC)</strong> | © 2025 RaceChain</p>
      </footer>
    </div>
  );
}