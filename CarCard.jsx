/**
 * CarCard.jsx
 * ---------------------------------------------
 * Displays a single car in the RaceChain Garage.
 * Supports selection, hover animation, rarity glow,
 * and shows key stats (speed, control, endurance).
 */

import React from "react";
import "../styles/animations.css";
import "../index.css";

export default function CarCard({ car, selected, onSelect }) {
  if (!car) return null;

  const rarityColors = {
    Common: "#6c6c6c",
    Rare: "#00b8ff",
    Epic: "#aa00ff",
    Legendary: "#ffaa00",
  };

  const rarityColor = rarityColors[car.rarity] || "#00ffd5";

  return (
    <div
      className={`car-card fade-in ${selected ? "selected" : ""}`}
      onClick={() => onSelect(car)}
      style={{
        borderColor: rarityColor,
        boxShadow: selected
          ? `0 0 30px ${rarityColor}, 0 0 60px ${rarityColor}`
          : `0 0 15px ${rarityColor}55`,
        cursor: "pointer",
      }}
    >
      {/* Car Image */}
      <div className="car-image-container">
        <img
          src={car.image || "/assets/default-car.png"}
          alt={car.name}
          className="car-image"
        />
        <div
          className="rarity-bar"
          style={{
            background: `linear-gradient(90deg, ${rarityColor}, #fff)`,
          }}
        />
      </div>

      {/* Car Details */}
      <div className="car-details">
        <h3
          className="car-name"
          style={{
            color: rarityColor,
            textShadow: `0 0 10px ${rarityColor}`,
          }}
        >
          {car.name}
        </h3>

        <div className="car-stats">
          <div className="stat">
            <span>⚡ Speed</span>
            <strong>{car.speed?.toFixed(1) || 0}</strong>
          </div>
          <div className="stat">
            <span>🎯 Control</span>
            <strong>{car.control?.toFixed(1) || 0}</strong>
          </div>
          <div className="stat">
            <span>🛡️ Endurance</span>
            <strong>{car.endurance?.toFixed(1) || 0}</strong>
          </div>
        </div>

        <p className="rarity-text" style={{ color: rarityColor }}>
          {car.rarity || "Common"}
        </p>
      </div>
    </div>
  );
}