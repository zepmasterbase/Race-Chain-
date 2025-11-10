import { useNavigate } from "react-router-dom";
...
export default function HomePage({ setWallet }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install it to play.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWallet(accounts[0]);
      setError("");
      navigate("/garage"); // go to Garage
    } catch (e) {
      setError(e.message);
    }
  }
  ...