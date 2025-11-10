/**
 * useGarage.js
 * --------------------------------------------
 * A custom React hook that manages the player's
 * NFT cars inside RaceChain.
 *
 * Responsibilities:
 * - Load cars from blockchain or mock data
 * - Select an active car
 * - Upgrade or inspect stats
 * - Handle sorting, filters, and garage state
 */

import { useState, useEffect, useCallback } from "react";
import { getUserCars } from "../utils/blockchain";
import { CAR_MODELS } from "../utils/constants";

/**
 * Hook usage example:
 * const {
 *   cars,
 *   selectedCar,
 *   selectCar,
 *   refreshGarage,
 *   loading,
 *   error,
 * } = useGarage(wallet);
 */

export default function useGarage(wallet) {
  // --- State ---
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: "speed", // or "control", "endurance"
    rarity: "all",
  });

  // --- Load user cars ---
  const refreshGarage = useCallback(async () => {
    if (!wallet) return;

    setLoading(true);
    setError(null);

    try {
      const carData = await getUserCars(wallet);
      if (carData && carData.length > 0) {
        setCars(carData);
        setSelectedCar(carData[0]);
      } else {
        console.warn("🚗 No NFT cars found. Loading demo cars...");
        setCars(CAR_MODELS);
        setSelectedCar(CAR_MODELS[0]);
      }
    } catch (err) {
      console.error("❌ Failed to load cars:", err);
      setError("Could not fetch garage data.");
      setCars(CAR_MODELS); // fallback mock cars
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  // --- Select Car ---
  const selectCar = useCallback((car) => {
    if (!car) return;
    setSelectedCar(car);
  }, []);

  // --- Sort Cars ---
  const sortCars = useCallback(
    (criteria) => {
      if (!cars || cars.length === 0) return;

      const sorted = [...cars].sort((a, b) => {
        switch (criteria) {
          case "speed":
            return b.speed - a.speed;
          case "control":
            return b.control - a.control;
          case "endurance":
            return b.endurance - a.endurance;
          case "rarity":
            const rarityOrder = { Common: 1, Rare: 2, Epic: 3, Legendary: 4 };
            return rarityOrder[b.rarity] - rarityOrder[a.rarity];
          default:
            return 0;
        }
      });

      setCars(sorted);
      setFilters((prev) => ({ ...prev, sortBy: criteria }));
    },
    [cars]
  );

  // --- Filter Cars (by rarity) ---
  const filterByRarity = useCallback(
    (rarity) => {
      if (rarity === "all") {
        refreshGarage();
      } else {
        const filtered = cars.filter(
          (c) => c.rarity.toLowerCase() === rarity.toLowerCase()
        );
        setCars(filtered);
      }
      setFilters((prev) => ({ ...prev, rarity }));
    },
    [cars, refreshGarage]
  );

  // --- Simulate Car Upgrade (mock logic) ---
  const upgradeCar = useCallback((carId, stat, value) => {
    setCars((prev) =>
      prev.map((car) =>
        car.id === carId
          ? { ...car, [stat]: Math.min((car[stat] || 0) + value, 10) }
          : car
      )
    );
  }, []);

  // --- Auto load when wallet connects ---
  useEffect(() => {
    if (wallet) refreshGarage();
  }, [wallet, refreshGarage]);

  // --- Return API ---
  return {
    cars,
    selectedCar,
    filters,
    loading,
    error,
    refreshGarage,
    selectCar,
    sortCars,
    filterByRarity,
    upgradeCar,
  };
}