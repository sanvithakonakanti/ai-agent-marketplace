import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaWallet, FaCoins, FaArrowLeft, FaCubes, FaLock } from 'react-icons/fa';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount = 0.5, agent } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txId = `ALGO-${Date.now().toString(36).toUpperCase()}`;
      navigate('/success', {
        state: {
          txId,
          amount,
          timestamp: new Date().toISOString(),
          agent
        }
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen app-bg p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-slate-300 hover:text-white mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        <div className="glass-card p-7 sm:p-8">
          <div className="text-center mb-8">
            <div className="bg-cyan-500/20 border border-cyan-300/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaWallet className="text-cyan-200 text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Confirm Transaction</h1>
            <p className="text-slate-300">Web3 settlement via Algorand blockchain</p>
          </div>

          <div className="soft-panel p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Service</span>
              <span className="font-medium text-white">{agent?.name || 'AI Agent Response'}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Amount</span>
              <div className="flex items-center">
                <FaCoins className="text-amber-300 mr-1" />
                <span className="font-bold text-xl text-white">{amount} ALGO</span>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-100">Total</span>
                <div className="flex items-center">
                  <FaCoins className="text-amber-300 mr-1" />
                  <span className="font-bold text-2xl text-white">{amount} ALGO</span>
                </div>
              </div>
            </div>
          </div>

          <div className="soft-panel p-6 mb-6">
            <h3 className="font-medium text-white mb-3">Connected Wallet</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaWallet className="text-cyan-200 mr-2" />
                <span className="text-sm font-mono text-slate-200">PERA...WXYZ</span>
              </div>
              <span className="text-emerald-300 text-sm font-medium">Connected</span>
            </div>
            <div className="mt-4 text-xs text-slate-400 flex items-center gap-2">
              <FaCubes />
              Chain: Algorand TestNet
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="neon-button w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </>
            ) : (
              <>
                Confirm Payment
                <FaCoins className="ml-2" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-slate-400 mt-4 inline-flex items-center gap-2 w-full justify-center">
            <FaLock />
            Blockchain-secured transaction with verifiable settlement
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;