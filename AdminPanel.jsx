import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./admin.css";

export default function AdminPanel() {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalRaces: 0,
    totalDrivers: 0,
    totalCars: 0,
    totalZacDistributed: 0,
  });
  const [racers, setRacers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Mock admin address (replace with your wallet later)
  const ADMIN_WALLET = "0x1234567890abcdef1234567890abcdef12345678";

  // Connect MetaMask
  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install it.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setWallet(account);
      setIsAdmin(account.toLowerCase() === ADMIN_WALLET.toLowerCase());
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  // Mock fetch stats
  useEffect(() => {
    // In future, fetch from backend or blockchain
    setStats({
      totalRaces: 32,
      totalDrivers: 18,
      totalCars: 52,
      totalZacDistributed: 12450,
    });

    setRacers([
      { name: "Blaze Kyro", wallet: "0xa8...91b3", races: 5, wins: 3, zacEarned: 340 },
      { name: "Vega Noir", wallet: "0x7d...c1e9", races: 4, wins: 2, zacEarned: 220 },
      { name: "Jin Tao", wallet: "0x22...9fe4", races: 6, wins: 4, zacEarned: 480 },
    ]);
  }, []);

  // Admin action placeholders
  function handleResetStats() {
    alert("✅ Race stats reset (simulation)");
  }

  function handleRewardAll() {
    alert("💰 Distributed ZAC rewards to all racers (simulation)");
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>RaceChain Admin Panel</h1>
        {!wallet ? (
          <button className="connect-btn" onClick={connectWallet}>
            Connect MetaMask (Admin)
          </button>
        ) : (
          <p className="wallet-display">
            Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </p>
        )}
        {error && <p className="error">{error}</p>}
      </header>

      {wallet && (
        <>
          {isAdmin ? (
            <main className="admin-main">
              <section className="stats">
                <h2>Platform Overview</h2>
                <div className="stats-grid">
                  <div className="card">
                    <h3>{stats.totalRaces}</h3>
                    <p>Total Races</p>
                  </div>
                  <div className="card">
                    <h3>{stats.totalDrivers}</h3>
                    <p>Total Drivers</p>
                  </div>
                  <div className="card">
                    <h3>{stats.totalCars}</h3>
                    <p>Total Cars Minted</p>
                  </div>
                  <div className="card">
                    <h3>{stats.totalZacDistributed} ZAC</h3>
                    <p>Total ZAC Distributed</p>
                  </div>
                </div>
              </section>

              <section className="racers">
                <h2>Active Racers</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Driver</th>
                      <th>Wallet</th>
                      <th>Races</th>
                      <th>Wins</th>
                      <th>ZAC Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {racers.map((r, i) => (
                      <tr key={i}>
                        <td>{r.name}</td>
                        <td>{r.wallet}</td>
                        <td>{r.races}</td>
                        <td>{r.wins}</td>
                        <td>{r.zacEarned}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="actions">
                <h2>Admin Controls</h2>
                <div className="btn-group">
                  <button className="admin-btn" onClick={handleRewardAll}>
                    💸 Distribute Rewards
                  </button>
                  <button className="admin-btn danger" onClick={handleResetStats}>
                    ♻ Reset Stats
                  </button>
                </div>
              </section>
            </main>
          ) : (
            <div className="unauthorized">
              <h2>🚫 Access Denied</h2>
              <p>This wallet is not authorized for admin controls.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}