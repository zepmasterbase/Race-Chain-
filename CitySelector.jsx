import React from "react";
import "./cityselector.css";

/**
 * CitySelector Component
 * Props:
 * - cities: array of { name, description, color, image }
 * - selectedCity: string
 * - onSelect: function (cityName)
 */

export default function CitySelector({ cities, selectedCity, onSelect }) {
  return (
    <div className="city-selector">
      <h2 className="city-title">🌍 Choose Your City Track</h2>

      <div className="city-grid">
        {cities.map((city) => (
          <div
            key={city.name}
            className={`city-card ${selectedCity === city.name ? "active" : ""}`}
            style={{ borderColor: city.color }}
            onClick={() => onSelect(city.name)}
          >
            <div
              className="city-image"
              style={{
                backgroundImage: `url(${city.image})`,
                boxShadow: `0 0 15px ${city.color}`,
              }}
            ></div>

            <div className="city-info">
              <h3>{city.name}</h3>
              <p>{city.description}</p>
            </div>

            {selectedCity === city.name && (
              <div
                className="city-selected-tag"
                style={{ background: city.color }}
              >
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}