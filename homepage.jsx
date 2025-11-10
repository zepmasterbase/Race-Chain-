import { useState } from "react";
import { ethers } from "ethers";
import "./home.css";

export default function HomePage() {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install it.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWallet(accounts[0]);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  const cars = [
    { name: "Lancer V1", speed: 7.5, braking: 6.0, color: "#ff5a3c" },
    { name: "Ghost XR", speed: 8.5, braking: 5.5, color: "#00b8ff" },
    { name: "Lagos", speed: 7.0, braking: 6.5, color: "#00ffd5" },
  ];

  const cities = ["Cape Town", "Nairobi", "Accra", "Lagos"];

  return (
    <div className="landing">
      <div className="overlay" />

      <header className="hero">
        <h1 className="title">RACECHAIN</h1>
        <p className="subtitle">Web3 Racing in the Metaverse</p>

        {!wallet ? (
          <button className="connect-btn" onClick={connectWallet}>
            CONNECT METAMASK TO START RACING
          </button>
        ) : (
          <div className="connected">
            Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </header>

      <section className="cars">
        {cars.map((c) => (
          <div key={c.name} className="car-card" style={{ "--car-color": c.color }}>
            <div className="car-shape" />
            <h3>{c.name}</h3>
            <p>Speed: {c.speed}</p>
            <p>Braking: {c.braking}</p>
          </div>
        ))}
      </section>

      <section className="cities">
        <h2>Select Your City Track:</h2>
        <div className="city-buttons">
          {cities.map((city) => (
            <button
              key={city}
              className={`city-btn ${selectedCity === city ? "active" : ""}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
        {selectedCity && (
          <p className="selected-msg">
            ✅ You selected <strong>{selectedCity}</strong>.
          </p>
        )}
      </section>

      <footer className="footer">
        <p>Powered by <strong>Zep Cash (ZAC)</strong> | © 2025 RaceChain</p>
      </footer>
    </div>
  );
}