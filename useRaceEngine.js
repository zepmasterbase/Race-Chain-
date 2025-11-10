/**
 * useRaceEngine.js
 * --------------------------------------------
 * A custom React hook managing race session logic:
 * - Countdown timer
 * - Speed, lap, and position tracking
 * - AI rival simulation
 * - Race rewards (via blockchain.js)
 *
 * Integrates with Race.jsx and HUDOverlay.jsx
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  enterRace,
  claimRaceReward,
  getRaceStatus,
} from "../utils/blockchain";
import { RACE_DURATION, LAP_COUNT, RACE_REWARD_ZAC } from "../utils/constants";

export default function useRaceEngine(selectedCar, wallet) {
  // --- Game State ---
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RACE_DURATION);
  const [lap, setLap] = useState(1);
  const [position, setPosition] = useState(1);
  const [speed, setSpeed] = useState(0);
  const [reward, setReward] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);

  // --- Refs ---
  const timerRef = useRef(null);
  const progressRef = useRef(0); // player progress %
  const aiProgressRef = useRef(0); // AI progress %
  const velocityRef = useRef(0);
  const frameRef = useRef(null);

  // --- Start Race (entry + blockchain simulation) ---
  const startRace = useCallback(async () => {
    if (!wallet || !selectedCar) return alert("Connect wallet and select car first.");

    try {
      const res = await enterRace(selectedCar.id);
      console.log("🏁 Race entered:", res);

      setRaceStarted(true);
      setRaceFinished(false);
      setTimeLeft(RACE_DURATION);
      progressRef.current = 0;
      aiProgressRef.current = 0;
      setLap(1);
      setPosition(1);
      setSpeed(0);

      // Start timers and loops
      startTimer();
      startPhysicsLoop();
    } catch (err) {
      console.error("❌ Race start failed:", err);
    }
  }, [wallet, selectedCar]);

  // --- Timer Countdown ---
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishRace();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // --- Physics Loop (simulates movement) ---
  const startPhysicsLoop = () => {
    cancelAnimationFrame(frameRef.current);

    const loop = () => {
      // simulate car acceleration
      velocityRef.current += 0.8;
      if (velocityRef.current > 120) velocityRef.current = 120;

      // update speed state
      setSpeed(velocityRef.current);

      // update progress
      progressRef.current += velocityRef.current / 6000; // normalized progress
      aiProgressRef.current += 0.02 + Math.random() * 0.015; // AI slightly random speed

      setAiProgress(aiProgressRef.current);

      // determine position
      if (progressRef.current >= aiProgressRef.current) {
        setPosition(1);
      } else {
        setPosition(2);
      }

      // lap management
      const currentLap = Math.min(
        LAP_COUNT,
        Math.floor(progressRef.current * LAP_COUNT) + 1
      );
      setLap(currentLap);

      // race completion condition
      if (progressRef.current >= 1) {
        finishRace();
        return;
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
  };

  // --- Finish Race ---
  const finishRace = useCallback(async () => {
    cancelAnimationFrame(frameRef.current);
    clearInterval(timerRef.current);

    setRaceStarted(false);
    setRaceFinished(true);

    const playerWon = position === 1 || progressRef.current >= aiProgressRef.current;

    if (playerWon) {
      console.log("🏆 You won the race!");
      const res = await claimRaceReward();
      setReward(res.reward || RACE_REWARD_ZAC);
    } else {
      console.log("😔 You finished 2nd. Better luck next time!");
      setReward(0);
    }

    setSpeed(0);
    progressRef.current = 1;
  }, [position]);

  // --- Cancel race manually ---
  const cancelRace = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    clearInterval(timerRef.current);
    setRaceStarted(false);
    setSpeed(0);
    setTimeLeft(RACE_DURATION);
  }, []);

  // --- Restore Race (e.g., if reloaded mid-race) ---
  useEffect(() => {
    async function restore() {
      const status = await getRaceStatus(wallet);
      if (status.isRacing) {
        setRaceStarted(true);
        setTimeLeft(status.timeLeft);
        startPhysicsLoop();
      }
    }
    if (wallet) restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  // --- Cleanup ---
  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  // --- Return hook API ---
  return {
    raceStarted,
    raceFinished,
    timeLeft,
    lap,
    position,
    speed,
    reward,
    aiProgress,
    startRace,
    finishRace,
    cancelRace,
  };
}