import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import Garage from "./pages/Garage.jsx";

export default function App() {
  const [wallet, setWallet] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<HomePage setWallet={setWallet} />} />
      <Route path="/garage" element={<Garage wallet={wallet} />} />
    </Routes>
  );
}