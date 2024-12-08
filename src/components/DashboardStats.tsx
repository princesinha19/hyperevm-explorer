import { useEffect, useState } from 'react';
import { publicClient } from '@/utils/rpc';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    transactions: '0',
    baseFee: 'n/a',
    latestBlock: '0',
    tps: '0'
  });

  useEffect(() => {
    const updateStats = async () => {
      try {
        const blockNumber = await publicClient.getBlockNumber();
        
        // Get current and previous block
        const [currentBlock, previousBlock] = await Promise.all([
          publicClient.getBlock({
            blockNumber,
            includeTransactions: true
          }),
          publicClient.getBlock({
            blockNumber: blockNumber - 1n,
            includeTransactions: true
          })
        ]);
        
        // Calculate TPS
        const timeSpan = Number(currentBlock.timestamp) - Number(previousBlock.timestamp);
        const totalTxs = currentBlock.transactions.length + previousBlock.transactions.length;
        const tps = (totalTxs / timeSpan).toFixed(2);
        
        setStats({
          transactions: currentBlock.transactions.length.toString(),
          baseFee: currentBlock.baseFeePerGas ? Number(currentBlock.baseFeePerGas).toFixed(2) : 'n/a',
          latestBlock: blockNumber.toString(),
          tps
        });
      } catch (error) {
        console.error('Error updating stats:', error);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#171B20] p-4 rounded-lg border border-[#2B3238]">
        <div className="text-gray-400 text-sm">LATEST BLOCK</div>
        <div className="text-xl font-medium text-[#E1E4E7]">{stats.latestBlock}</div>
      </div>
      <div className="bg-[#171B20] p-4 rounded-lg border border-[#2B3238]">
        <div className="text-gray-400 text-sm">GAS LIMIT</div>
        <div className="text-xl font-medium text-[#E1E4E7]">30,000,000</div>
      </div>
      <div className="bg-[#171B20] p-4 rounded-lg border border-[#2B3238]">
        <div className="text-gray-400 text-sm">GAS FEE</div>
        <div className="text-xl font-medium text-[#E1E4E7]">{stats.baseFee} Wei</div>
      </div>
      <div className="bg-[#171B20] p-4 rounded-lg border border-[#2B3238]">
        <div className="text-gray-400 text-sm">TPS</div>
        <div className="text-xl font-medium text-[#E1E4E7]">{stats.tps}</div>
      </div>
    </div>
  );
} 