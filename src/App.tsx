import { generateMnemonic } from "bip39";
import { useEffect, useState } from "react";
import ETHWallet from "./ETHWallet";
import SolWallet from "./SolWallet";

function App() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [wallettype, setWalletType] = useState<string>("");

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonic");

    if (storedMnemonic) {
      setMnemonic(storedMnemonic);
    }
  }, []);
  const genMnemonic = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    localStorage.setItem("mnemonic", mnemonic);
  };

  return (
    <div className="flex flex-col items-center justify-center text-gray-800">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Wallet Generator</h1>
        <p className="text-gray-600">Generate and manage secure mnemonics for your wallets.</p>
      </header>

      <main className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <button
            onClick={genMnemonic}
            className="px-6 py-2 mb-6 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Generate Mnemonic
          </button>
          {mnemonic && (
            <div className="p-4 text-center bg-gray-50 rounded-lg shadow-inner">
              <p className="text-lg font-mono break-words">{mnemonic}</p>
            </div>
          )}
        </div>
        {mnemonic && (
          <div className="flex flex-col items-center">
          <select
          value={wallettype}
          onChange={(e) => setWalletType(e.target.value)}
          className="px-6 py-2 mb-6 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <option value="">Select Wallet Type</option>
          <option value="sol">Solana Wallet</option>
          <option value="eth">Ethereum Wallet</option>
        </select>
        {wallettype && (
          <div className="p-4 text-center bg-gray-50 rounded-lg shadow-inner">
            <p className="text-lg font-mono break-words">{wallettype}</p>
          </div>
        )}
        </div>
        )}
        

        {wallettype === "sol" && (
          <div className="flex flex-col justify-around">
            <SolWallet mnemonic={mnemonic} />
          </div>
        )}
        {wallettype === "eth" && (
          <div className="flex flex-col justify-around">
            <ETHWallet mnemonic={mnemonic} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
