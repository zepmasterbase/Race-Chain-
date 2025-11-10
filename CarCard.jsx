import React from "react";
import "./carcard.css";

/**
 * CarCard Component
 * Props:
 * - name: string (car name)
 * - speed: number
 * - control: number
 * - endurance: number
 * - color: string (neon border color)
 * - selected: boolean
 * - onSelect: function
 */

export default function CarCard({
  name,
  speed,
  control,
  endurance,
  color = "#00ffd5",
  selected = false,
  onSelect,
}) {
  return (
    <div
      className={`car-card ${selected ? "selected" : ""}`}
      style={{ borderColor: color }}
      onClick={onSelect}
    >
      {/* Car Visual Placeholder */}
      <div
        className="car-image"
        style={{
          background: `linear-gradient(135deg, ${color}, transparent)`,
        }}
      >
        <div className="car-light left"></div>
        <div className="car-light right"></div>
      </div>

      {/* Info */}
      <h3 className="car-name">{name}</h3>
      <div className="car-stats">
        <p>
          🏎️ Speed: <span>{speed}</span>
        </p>
        <p>
          🎯 Control: <span>{control}</span>
        </p>
        <p>
          ⚙️ Endurance: <span>{endurance}</span>
        </p>
      </div>

      {selected && <div className="car-selected-tag">Selected</div>}
    </div>
  );
}