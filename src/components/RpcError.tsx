export default function RpcError() {
  return (
    <div className="min-h-[200px] bg-[#171B20] rounded-lg border border-[#2B3238] p-6 flex flex-col items-center justify-center text-center">
      <div className="text-red-500 mb-2">🔌 RPC Connection Error</div>
      <p className="text-gray-400 mb-4">
        Unable to connect to HyperEVM Testnet RPC. The network might be temporarily down.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-[#3DD8AF] text-[#0B0E11] rounded-lg font-medium hover:bg-[#35C69D] transition-colors"
      >
        Retry Connection
      </button>
    </div>
  );
} 