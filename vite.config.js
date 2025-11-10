/**
 * ---------------------------------------
 * ⚙️ Vite Configuration for RaceChain
 * ---------------------------------------
 * Framework: React (with JSX + ESM)
 * Features:
 *  - React Fast Refresh
 *  - Asset aliasing (@)
 *  - Optimized Three.js builds
 *  - Web3-friendly (Ethers.js, MetaMask)
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  // Project root (src folder)
  root: "./",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@styles": path.resolve(__dirname, "./src/styles")
    },
  },

  css: {
    preprocessorOptions: {
      css: {
        additionalData: `
          @import './src/index.css';
        `,
      },
    },
  },

  server: {
    port: 5173,
    open: true,
    host: true,
    cors: true,
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "ethers", "three"],
        },
      },
    },
  },

  // GitHub Pages or subpath support (edit if needed)
  base: "/",

  define: {
    "process.env": {}, // for Web3 libs that reference process.env
  },
});