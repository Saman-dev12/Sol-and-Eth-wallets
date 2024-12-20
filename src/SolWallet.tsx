import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { useEffect, useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";

const SolWallet = ({ mnemonic }: { mnemonic: string }) => {
    const [walletData, setWalletData] = useState<{
        publicKeys: string[];
        privateKeys: string[];
        currentIndex: number;
    }>({
        publicKeys: [],
        privateKeys: [],
        currentIndex: 0,
    });
    const [visiblePrivateKeyIndex, setVisiblePrivateKeyIndex] = useState<number | null>(null);

    if (!mnemonic) {
        return null;
    }

    const generateWallet = async () => {
        const seed = await mnemonicToSeedSync(mnemonic);
        const path = `m/44'/501'/${walletData.currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex"));
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed.key).secretKey;
        const keypair = Keypair.fromSecretKey(secret);

        let publicKey = keypair.publicKey.toString();
        let privateKey = bs58.encode(secret);

        const newWalletData = {
            ...walletData,
            publicKeys: [...walletData.publicKeys, publicKey],
            privateKeys: [...walletData.privateKeys, privateKey],
            currentIndex: walletData.currentIndex + 1,
        };

        // Update state and store everything in one object
        setWalletData(newWalletData);
        localStorage.setItem("solwalletData", JSON.stringify(newWalletData));
    };

    useEffect(() => {
        const storedWalletData = localStorage.getItem("solwalletData");

        if (storedWalletData) {
            setWalletData(JSON.parse(storedWalletData));
        }
    }, []);

    const deleteWallet = (index: number) => {
        const updatedPublicKeys = walletData.publicKeys.filter((_, i) => i !== index);
        const updatedPrivateKeys = walletData.privateKeys.filter((_, i) => i !== index);
        const updatedCurrentIndex = walletData.currentIndex - 1;

        const newWalletData = {
            ...walletData,
            publicKeys: updatedPublicKeys,
            privateKeys: updatedPrivateKeys,
            currentIndex: updatedCurrentIndex,
        };

        setWalletData(newWalletData);
        localStorage.setItem("solwalletData", JSON.stringify(newWalletData));
    };

    const deleteAllWallets = () => {
        setWalletData({
            publicKeys: [],
            privateKeys: [],
            currentIndex: 0,
        });
        localStorage.removeItem("solwalletData");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-4">SolWallet</h1>
            <button
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300"
                onClick={generateWallet}
            >
                Generate Wallet
            </button>
            <ul className="mt-4 w-full max-w-lg space-y-4 overflow-y-auto max-h-80">
                {walletData.publicKeys.map((key, index) => (
                    <li
                        key={index}
                        className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
                    >
                        <p className="font-medium text-gray-700">Public Key:</p>
                        <p className="text-sm text-gray-600 break-words">{key}</p>

                        <div className="mt-2">
                            <p className="font-medium text-gray-700">Private Key:</p>
                            <div className="flex ">
                                <input
                                    type={visiblePrivateKeyIndex === index ? "text" : "password"}
                                    readOnly
                                    className="mt-2 w-full p-3 text-sm text-gray-600 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={walletData.privateKeys[index] || ''}
                                    placeholder="Private key will appear here"
                                />
                                <button
                                    className="w-[5rem] mt-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300"
                                    onClick={() => setVisiblePrivateKeyIndex(visiblePrivateKeyIndex === index ? null : index)}
                                >
                                    {visiblePrivateKeyIndex === index ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300"
                            onClick={() => deleteWallet(index)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            {walletData.publicKeys.length === 0 && (
                <p className="mt-4 text-gray-600">No wallets generated yet.</p>
            )}
            {walletData.publicKeys.length > 0 && (
                <button
                    className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300"
                    onClick={deleteAllWallets}
                >
                    Delete Wallets
                </button>
            )}
        </div>
    );
};

export default SolWallet;
