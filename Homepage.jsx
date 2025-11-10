import { useState } from "react";
import { ethers } from "ethers";
import NeonBackground from "../components/NeonBackground";
import "./home.css";

export default function HomePage() {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCar, setSelectedCar] = useState("");

  // ✅ Connect MetaMask Wallet
  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install it to play.");
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
    { name: "Lagos GT", speed: 7.0, braking: 6.5, color: "#00ffd5" },
  ];

  const cities = ["Cape Town", "Nairobi", "Accra", "Lagos"];

  return (
    <div className="homepage">
      {/* Neon 3D Background */}
      <NeonBackground />

      {/* Hero Section */}
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

      {/* Cars Section */}
      <section className="cars">
        {cars.map((car) => (
          <div
            key={car.name}
            className={`car-card ${
              selectedCar === car.name ? "active" : ""
            }`}
            style={{ "--car-color": car.color }}
            onClick={() => setSelectedCar(car.name)}
          >
            <div className="car-shape" />
            <h3>{car.name}</h3>
            <p>Speed: {car.speed}</p>
            <p>Braking: {car.braking}</p>
          </div>
        ))}
      </section>

      {/* City Section */}
      <section className="cities">
        <h2>Select Your City Track:</h2>
        <div className="city-buttons">
          {cities.map((city) => (
            <button
              key={city}
              className={`city-btn ${
                selectedCity === city ? "active" : ""
              }`}
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

      {/* Footer */}
      <footer className="footer">
        <p>
          Powered by <strong>Zep Cash (ZAC)</strong> | © 2025 RaceChain
        </p>
      </footer>
    </div>
  );
}