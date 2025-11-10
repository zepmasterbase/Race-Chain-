/**
 * RaceChain Blockchain Utility
 * -------------------------------------
 * Handles wallet, token, and NFT smart contract interactions.
 * Replace mock data + addresses with your deployed contract info later.
 */

import { ethers } from "ethers";

// ======== CONFIG ========

// Example (testnet) contract addresses (replace with real ones)
export const ZAC_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";
export const NFT_CAR_ADDRESS = "0x0000000000000000000000000000000000000000";
export const RACE_ENGINE_ADDRESS = "0x0000000000000000000000000000000000000000";

// Example mock ABIs
const ZAC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
];

const NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

const RACE_ENGINE_ABI = [
  "function enterRace(uint256 carId) public",
  "function claimReward() public",
  "function getRaceStatus(address player) view returns (bool isRacing, uint256 timeLeft)",
];

// ======== GLOBAL PROVIDER SETUP ========

export async function getProvider() {
  if (!window.ethereum) throw new Error("MetaMask not detected. Please install it.");
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
}

export async function getSigner() {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  return signer;
}

// ======== WALLET FUNCTIONS ========

/**
 * Connects MetaMask wallet.
 * Returns the connected wallet address.
 */
export async function connectWallet() {
  try {
    if (!window.ethereum) throw new Error("MetaMask not detected. Please install it.");
    const provider = await getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0];
  } catch (err) {
    console.error("❌ Wallet connection failed:", err);
    throw err;
  }
}

/**
 * Get current wallet (if already connected)
 */
export async function getConnectedWallet() {
  if (!window.ethereum) return null;
  const provider = await getProvider();
  const accounts = await provider.send("eth_accounts", []);
  return accounts.length > 0 ? accounts[0] : null;
}

// ======== ZAC TOKEN FUNCTIONS ========

export async function getZacBalance(wallet) {
  if (!wallet) return 0;
  try {
    const provider = await getProvider();
    const token = new ethers.Contract(ZAC_TOKEN_ADDRESS, ZAC_ABI, provider);
    const balance = await token.balanceOf(wallet);
    return ethers.formatUnits(balance, 18);
  } catch (err) {
    console.error("⚠️ Error fetching ZAC balance:", err);
    return 0;
  }
}

export async function transferZac(to, amount) {
  const signer = await getSigner();
  const token = new ethers.Contract(ZAC_TOKEN_ADDRESS, ZAC_ABI, signer);
  const tx = await token.transfer(to, ethers.parseUnits(amount.toString(), 18));
  await tx.wait();
  return tx.hash;
}

// ======== NFT CAR FUNCTIONS ========

/**
 * Fetches NFTs owned by the player.
 * Returns an array of car objects: { id, name, speed, control, endurance, image }
 * If no blockchain NFTs exist, returns mock cars.
 */
export async function getUserCars(wallet) {
  if (!wallet) return [];

  // --- MOCK DATA until smart contract deployed ---
  const mockCars = [
    {
      id: 1,
      name: "Lancer V1",
      speed: 7.5,
      control: 6.0,
      endurance: 7.0,
      color: "#ff5a3c",
      image: "https://cdn.midjourney.com/ea4a-futuristic-car.png",
    },
    {
      id: 2,
      name: "Ghost XR",
      speed: 8.5,
      control: 5.5,
      endurance: 6.5,
      color: "#00b8ff",
      image: "https://cdn.midjourney.com/bb91-ghost-xr-car.png",
    },
    {
      id: 3,
      name: "Lagos GT",
      speed: 7.0,
      control: 6.5,
      endurance: 7.5,
      color: "#00ffd5",
      image: "https://cdn.midjourney.com/lagos-gt-futuristic.png",
    },
  ];
  return mockCars;

  // --- Example real fetch (commented until you deploy) ---
  /*
  try {
    const provider = await getProvider();
    const nft = new ethers.Contract(NFT_CAR_ADDRESS, NFT_ABI, provider);
    const balance = await nft.balanceOf(wallet);
    const cars = [];

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await nft.tokenOfOwnerByIndex(wallet, i);
      const uri = await nft.tokenURI(tokenId);
      const meta = await fetch(uri).then(res => res.json());
      cars.push({ id: Number(tokenId), ...meta });
    }
    return cars;
  } catch (err) {
    console.error("⚠️ Error loading NFTs:", err);
    return [];
  }
  */
}

// ======== RACE ENGINE (Mock) ========

/**
 * Simulates entering a race with a selected car.
 * Later this will call your RaceEngine smart contract.
 */
export async function enterRace(carId) {
  console.log(`🏁 Simulating race entry with car #${carId}`);
  return { success: true, raceId: Math.floor(Math.random() * 9999) };
}

/**
 * Simulates claiming rewards from the contract.
 */
export async function claimRaceReward() {
  console.log("💰 Simulating ZAC reward claim (mock)");
  return { success: true, reward: 20 };
}

/**
 * Mock function to get race status
 */
export async function getRaceStatus(wallet) {
  if (!wallet) return { isRacing: false, timeLeft: 0 };
  // Replace with smart contract read
  return { isRacing: false, timeLeft: 0 };
}

// ======== HELPER FUNCTIONS ========

/**
 * Convert ETH to readable format.
 */
export function formatEth(weiValue) {
  try {
    return Number(ethers.formatEther(weiValue)).toFixed(4);
  } catch {
    return "0.0000";
  }
}

/**
 * Listen to account or network changes (for app auto-refresh).
 */
export function initWalletListeners(onChange) {
  if (!window.ethereum) return;
  window.ethereum.on("accountsChanged", onChange);
  window.ethereum.on("chainChanged", onChange);
  console.log("👂 Wallet listeners active");
}

/**
 * Remove wallet listeners (on component unmount)
 */
export function removeWalletListeners() {
  if (!window.ethereum) return;
  window.ethereum.removeAllListeners("accountsChanged");
  window.ethereum.removeAllListeners("chainChanged");
  console.log("🧹 Wallet listeners removed");
}