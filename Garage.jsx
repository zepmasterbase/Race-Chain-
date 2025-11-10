import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./garage.css";

export default function Garage({ wallet }) {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  // mock data for now
  useEffect(() => {
    const mockCars = [
      { id: 1, name: "Lancer V1", speed: 7.5, control: 6.0, endurance: 7.0, color: "#ff5a3c" },
      { id: 2, name: "Ghost XR", speed: 8.5, control: 5.5, endurance: 6.5, color: "#00b8ff" },
      { id: 3, name: "Lagos GT", speed: 7.0, control: 6.5, endurance: 7.5, color: "#00ffd5" },
    ];
    setCars(mockCars);
  }, []);

  // if no wallet, redirect to home
  useEffect(() => {
    if (!wallet) navigate("/");
  }, [wallet, navigate]);

  return (
    <div className="garage">
      <header className="garage-header">
        <h1>🚗 My Garage</h1>
        <p>Wallet: {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Not connected"}</p>
        <button onClick={() => navigate("/")} className="back-btn">← Back Home</button>
      </header>

      <section className="garage-grid">
        {cars.map((car) => (
          <div className="garage-card" key={car.id} style={{ borderColor: car.color }}>
            <div className="car-display" style={{ background: `linear-gradient(135deg, ${car.color}, transparent)` }} />
            <h3>{car.name}</h3>
            <p>Speed: {car.speed}</p>
            <p>Control: {car.control}</p>
            <p>Endurance: {car.endurance}</p>
            <button className="race-btn">Start Race</button>
          </div>
        ))}
      </section>
    </div>
  );
}