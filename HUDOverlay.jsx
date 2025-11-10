import React from "react";
import "./hudoverlay.css";

/**
 * HUDOverlay Component
 * Props:
 * - timeLeft: number (seconds)
 * - speed: number (km/h)
 * - lap: number
 * - totalLaps: number
 * - position: number (1 = first place)
 * - playerCar: string (car name)
 * - playerName: string
 */

export default function HUDOverlay({
  timeLeft = 60,
  speed = 0,
  lap = 1,
  totalLaps = 3,
  position = 1,
  playerCar = "Lancer V1",
  playerName = "You",
}) {
  // Format timer as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate dynamic bar width for speed gauge
  const speedPercent = Math.min(speed / 300, 1) * 100; // assuming 300 km/h max

  return (
    <div className="hud-overlay">
      {/* Timer top-left */}
      <div className="hud-timer">
        <p>⏱ Time Left</p>
        <h2>{formatTime(timeLeft)}</h2>
      </div>

      {/* Lap Counter top-center */}
      <div className="hud-lap">
        <p>Lap</p>
        <h2>
          {lap} / {totalLaps}
        </h2>
      </div>

      {/* Position top-right */}
      <div className="hud-position">
        <p>Position</p>
        <h2>
          {position}
          <span className="suffix">
            {position === 1 ? "st" : position === 2 ? "nd" : "th"}
          </span>
        </h2>
      </div>

      {/* Speedometer bottom-left */}
      <div className="hud-speed">
        <div className="speed-bar-bg">
          <div
            className="speed-bar-fill"
            style={{ width: `${speedPercent}%` }}
          ></div>
        </div>
        <h3>{Math.floor(speed)} km/h</h3>
      </div>

      {/* Player Info bottom-right */}
      <div className="hud-player">
        <p className="player-name">{playerName}</p>
        <p className="car-name">{playerCar}</p>
      </div>
    </div>
  );
}