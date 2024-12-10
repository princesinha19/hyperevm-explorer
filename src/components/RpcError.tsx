import { useState, useEffect } from 'react';

export default function RpcError() {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[200px] bg-[#171B20] rounded-lg border border-[#2B3238] p-6 flex flex-col items-center justify-center text-center">
      <div className="text-red-500 mb-2">🔌 &nbsp; RPC Connection Error</div>
      <p className="text-gray-400 mb-4">
        Unable to connect to HyperEVM Testnet RPC. The network might be temporarily down.
      </p>
      <div className="text-sm text-[#51d2c1] flex flex-col items-center gap-2">
        <span>Will retry in {countdown} seconds...</span>
        <button 
          onClick={() => {
            window.location.reload();
          }} 
          className="text-xs px-2 py-1 bg-[#51d2c1] text-[#0B0E11] rounded hover:bg-[#35C69D] transition-colors"
        >
          Retry Now
        </button>
      </div>
    </div>
  );
} 