import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* 🚧 Future routes for Garage, Race, Admin, etc. */}
    </Routes>
  );
}