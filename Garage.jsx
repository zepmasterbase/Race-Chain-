import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "../components/CarCard";
import "./garage.css";

export default function Garage({ wallet }) {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock car data — replace with real NFTs later
  useEffect(() => {
    const mockCars = [
      {
        id: 1,
        name: "Lancer V1",
        speed: 7.5,
        control: 6.0,
        endurance: 7.0,
        color: "#ff5a3c",
      },
      {
        id: 2,
        name: "Ghost XR",
        speed: 8.5,
        control: 5.5,
        endurance: 6.5,
        color: "#00b8ff",
      },
      {
        id: 3,
        name: "Lagos GT",
        speed: 7.0,
        control: 6.5,
        endurance: 7.5,
        color: "#00ffd5",
      },
    ];

    setTimeout(() => {
      setCars(mockCars);
      setLoading(false);
    }, 800);
  }, []);

  // If wallet isn’t connected, redirect to homepage
  useEffect(() => {
    if (!wallet) {
      navigate("/");
    }
  }, [wallet, navigate]);

  const handleRace = () => {
    if (!selectedCar) {
      alert("Please select a car before starting the race!");
      return;
    }
    navigate("/race", { state: { selectedCar } });
  };

  return (
    <div className="garage-page">
      <header className="garage-header">
        <h1>🏎️ My Garage</h1>
        <p className="wallet-display">
          Wallet: {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Not connected"}
        </p>
      </header>

      {loading ? (
        <div className="loading">Loading your cars...</div>
      ) : (
        <>
          <section className="garage-grid">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                {...car}
                selected={selectedCar?.id === car.id}
                onSelect={() => setSelectedCar(car)}
              />
            ))}
          </section>

          <section className="garage-actions">
            <button className="race-btn" onClick={handleRace}>
              🚀 Start Race
            </button>
            <button className="back-btn" onClick={() => navigate("/")}>
              ⬅ Back to Home
            </button>
          </section>
        </>
      )}

      <footer className="garage-footer">
        <p>
          Powered by <strong>Zep Cash (ZAC)</strong> | © 2025 RaceChain
        </p>
      </footer>
    </div>
  );
}