/**
 * RaceChain Main Entry
 * ----------------------------
 * This file boots the React app and sets up
 * routing, styles, and global configuration.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; // global styling (neon theme + animations)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);