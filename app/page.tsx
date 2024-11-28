// app.tsx (تمام در یک فایل)
// @ts-ignore
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';
import { Shield, HelpCircle, FileText, Info, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import './globals.css';

export default function App() {
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleWalletConnection = useCallback((address: string) => {
    setTonWalletAddress(address);
    console.log('Wallet connected successfully!');
    setIsLoading(false);
  }, []);

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    console.log('Wallet disconnected successfully!');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account?.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const handleWalletAction = async () => {
    if (tonConnectUI.connected) {
      setIsLoading(true);
      await tonConnectUI.disconnect();
    } else {
      await tonConnectUI.openModal();
    }
  };

  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();
    return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1C2127] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#1C2127] border-b border-[#2D3139] backdrop-blur-sm bg-opacity-80 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet className="w-8 h-8 text-[#0098EA]" />
            <span className="text-xl font-bold">TON Connect</span>
          </div>
          <span className="text-sm px-3 py-1 rounded-full bg-[#0098EA]/10 text-[#0098EA] border border-[#0098EA]/20">
            TON
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 mt-16 mb-20">
        <div className="text-center space-y-8 max-w-md">
          <h1 className="text-4xl font-bold mb-4">Free Ton coin</h1>
          <div className="bg-[#1C2127] p-6 rounded-xl border border-[#2D3139]">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-gray-400">
                <span>Transaction Fee</span>
                <span className="font-mono">0.01 TON</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Network</span>
                <span className="text-[#0098EA]">TON</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleWalletAction}
            className="w-full bg-[#0098EA] hover:bg-[#00A9FF] transition-all duration-300 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center space-x-3 shadow-lg shadow-[#0098EA]/20 hover:scale-[1.02] transform"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xl">Connecting...</span>
              </>
            ) : tonWalletAddress ? (
              <>
                <CheckCircle className="w-6 h-6" />
                <span className="text-xl">Disconnect Wallet</span>
              </>
            ) : (
              <>
                <Wallet className="w-6 h-6" />
                <span className="text-xl">Connect Wallet</span>
              </>
            )}
          </button>

          {tonWalletAddress && (
            <p className="mt-4 text-gray-400">
              Connected: {formatAddress(tonWalletAddress)}
            </p>
          )}

          <div className="flex items-start space-x-2 bg-[#1C2127]/50 p-4 rounded-lg">
            <Info className="w-5 h-5 text-[#0098EA] mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-400">
              Connect your TON wallet to receive toncoin. A small network fee of 0.01 TON will be applied to process your transaction securely.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#1C2127] border-t border-[#2D3139] backdrop-blur-sm bg-opacity-80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-400">
            © 2024 TON Connect. All rights reserved.
          </span>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
              <span>Terms</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

