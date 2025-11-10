/**
 * RaceChain Constants File
 * -------------------------------------
 * Global configuration for contracts, networks, and defaults.
 * Used by blockchain.js, wallet.js, and game components.
 */

// =============================
// ⚙️ CORE CONTRACT ADDRESSES
// =============================

// ⚠️ Replace these when you deploy your contracts
export const ZAC_TOKEN_ADDRESS =
  "0x0000000000000000000000000000000000000000";
export const NFT_CAR_ADDRESS =
  "0x0000000000000000000000000000000000000000";
export const RACE_ENGINE_ADDRESS =
  "0x0000000000000000000000000000000000000000";

// =============================
// 🌐 SUPPORTED NETWORKS
// =============================

export const NETWORKS = {
  polygon: {
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
    currency: "MATIC",
  },
  polygonMumbai: {
    chainId: 80001,
    name: "Polygon Mumbai Testnet",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    explorer: "https://mumbai.polygonscan.com",
    currency: "MATIC",
  },
  base: {
    chainId: 8453,
    name: "Base Mainnet",
    rpcUrl: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    currency: "ETH",
  },
  baseGoerli: {
    chainId: 84531,
    name: "Base Goerli Testnet",
    rpcUrl: "https://goerli.base.org",
    explorer: "https://goerli.basescan.org",
    currency: "ETH",
  },
};

// Default network for development
export const DEFAULT_NETWORK = NETWORKS.polygonMumbai;

// =============================
// 🪙 TOKEN DETAILS
// =============================

export const TOKEN_SYMBOL = "ZAC";
export const TOKEN_NAME = "Zep Cash";
export const TOKEN_DECIMALS = 18;

// Mock conversion rate for UI display
export const TOKEN_TO_USD = 0.03; // 1 ZAC = $0.03 (for display only)

// =============================
// 🚗 GAME ECONOMY
// =============================

export const RACE_DURATION = 60; // seconds
export const LAP_COUNT = 3;
export const RACE_REWARD_ZAC = 20; // per win (mock)
export const ENTRY_FEE_ZAC = 5; // mock bet amount for PvP

// =============================
// 🌍 CITY CONFIG
// =============================

export const CITY_TRACKS = [
  {
    id: 1,
    name: "Cape Town",
    color: "#00ffd5",
    difficulty: "Medium",
    rewardMultiplier: 1.0,
    image:
      "https://images.unsplash.com/photo-1560850241-4b1f5c8c9b64?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 2,
    name: "Nairobi",
    color: "#ff00d0",
    difficulty: "Hard",
    rewardMultiplier: 1.2,
    image:
      "https://images.unsplash.com/photo-1615396941773-72c2e41bb6cb?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 3,
    name: "Accra",
    color: "#ffaa00",
    difficulty: "Medium",
    rewardMultiplier: 1.1,
    image:
      "https://images.unsplash.com/photo-1631965584825-7f0f63bdf0da?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 4,
    name: "Lagos",
    color: "#00aaff",
    difficulty: "Easy",
    rewardMultiplier: 0.9,
    image:
      "https://images.unsplash.com/photo-1616709868237-9ffb0adfa84e?auto=format&fit=crop&w=600&q=60",
  },
];

// =============================
// 🏎️ BASE CAR TYPES (for NFT metadata or mock data)
// =============================

export const CAR_MODELS = [
  {
    id: 1,
    name: "Lancer V1",
    baseSpeed: 7.5,
    control: 6.0,
    endurance: 7.0,
    color: "#ff5a3c",
    rarity: "Common",
  },
  {
    id: 2,
    name: "Ghost XR",
    baseSpeed: 8.5,
    control: 5.5,
    endurance: 6.5,
    color: "#00b8ff",
    rarity: "Rare",
  },
  {
    id: 3,
    name: "Lagos GT",
    baseSpeed: 7.0,
    control: 6.5,
    endurance: 7.5,
    color: "#00ffd5",
    rarity: "Epic",
  },
  {
    id: 4,
    name: "Neon Blade",
    baseSpeed: 9.0,
    control: 5.5,
    endurance: 6.0,
    color: "#ff00d0",
    rarity: "Legendary",
  },
];

// =============================
// 🔧 GAS SETTINGS (optional tuning)
// =============================

export const GAS_LIMIT_DEFAULT = 500000; // 500k gas
export const GAS_PRICE_GWEI = 50; // default 50 gwei

// =============================
// 🧠 GAME METADATA
// =============================

export const PROJECT_NAME = "RaceChain";
export const PROJECT_VERSION = "1.0.0";
export const COPYRIGHT_TEXT = "© 2025 RaceChain by Zep Shop";

export const CONTACT_EMAIL = "support@zepshop.io";
export const WEBSITE_URL = "https://racechain.zepshop.io";
export const GITHUB_URL = "https://github.com/yourusername/racechain";

// =============================
// 🧱 EXPORT GROUPS
// =============================

export default {
  ZAC_TOKEN_ADDRESS,
  NFT_CAR_ADDRESS,
  RACE_ENGINE_ADDRESS,
  NETWORKS,
  DEFAULT_NETWORK,
  TOKEN_SYMBOL,
  TOKEN_NAME,
  TOKEN_DECIMALS,
  TOKEN_TO_USD,
  RACE_DURATION,
  LAP_COUNT,
  RACE_REWARD_ZAC,
  ENTRY_FEE_ZAC,
  CITY_TRACKS,
  CAR_MODELS,
  GAS_LIMIT_DEFAULT,
  GAS_PRICE_GWEI,
  PROJECT_NAME,
  PROJECT_VERSION,
  COPYRIGHT_TEXT,
  CONTACT_EMAIL,
  WEBSITE_URL,
  GITHUB_URL,
};