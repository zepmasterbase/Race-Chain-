import { useState } from "react";
import { ethers } from "ethers";
import "./home.css"; // optional, or inline styles

export default function HomePage() {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  // Connect MetaMask
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
    { name: "Cape Town", desc: "Race along the coastline of Neo Cape Town.", color: "#00ffd5" },
    { name: "Nairobi", desc: "The mountain skyline meets cyberpunk lights.", color: "#ff00d0" },
    { name: "Accra", desc: "The electric heart of the West African grid.", color: "#ffaa00" },
    { name: "Lagos", desc: "The never-sleeping megacity of speed.", color: "#00aaff" },
  ];

  const drivers = [
    { name: "Blaze Kyro", stats: "Speed 9 / Control 6 / Endurance 7" },
    { name: "Vega Noir", stats: "Speed 7 / Control 9 / Endurance 6" },
    { name: "Kira Volt", stats: "Speed 8 / Control 7 / Endurance 8" },
    { name: "Jin 'Dragon' Tao", stats: "Speed 8 / Control 8 / Endurance 7" },
  ];

  return (
    <div className="homepage">
      <header className="hero">
        <h1 className="title">RACECHAIN</h1>
        <p className="subtitle">Web3 Racing in the Metaverse</p>

        {!wallet ? (
          <button className="connect-btn" onClick={connectWallet}>
            🔗 Connect MetaMask to Start
          </button>
        ) : (
          <div className="connected">
            Connected: <span>{wallet.slice(0, 6)}...{wallet.slice(-4)}</span>
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
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        {selectedCity && (
          <p className="city-selected">
            ✅ You selected <strong>{selectedCity}</strong>. Get ready to race!
          </p>
        )}
      </section>

      <section className="driver-section">
        <h2>Meet Your Drivers</h2>
        <div className="driver-grid">
          {drivers.map((d) => (
            <div className="driver-card" key={d.name}>
              <div className="driver-avatar"></div>
              <h3>{d.name}</h3>
              <p>{d.stats}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Powered by <strong>Zep Cash (ZAC)</strong> | © 2025 RaceChain</p>
      </footer>
    </div>
  );
}