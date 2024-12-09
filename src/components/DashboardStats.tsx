import { useLatestBlocks } from '@/hooks/useLatestBlocks';

export default function DashboardStats() {
  const { blocks, isLoading } = useLatestBlocks();
  
  const LoadingIndicator = () => (
    <div className="animate-pulse">
      <div className="h-4 w-20 bg-gray-700 rounded"></div>
    </div>
  );

  // Calculate stats from latest blocks
  const stats = blocks[0]?.block ? {
    transactions: blocks[0].block.transactions.length.toString(),
    baseFee: blocks[0].block.baseFeePerGas ? Number(blocks[0].block.baseFeePerGas).toFixed(2) : 'n/a',
    latestBlock: blocks[0].block.number.toString(),
    tps: blocks[1]?.block ? 
      ((blocks[0].block.transactions.length + blocks[1].block.transactions.length) / 
      (Number(blocks[0].block.timestamp) - Number(blocks[1].block.timestamp))).toFixed(2) : '0'
  } : {
    transactions: '0',
    baseFee: '0',
    latestBlock: '0',
    tps: '0'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#171B20] p-4 rounded-lg border border-[#2B3238]">
        <div className="text-gray-400 text-sm">TPS</div>
        <div className="text-xl font-medium text-[#E1E4E7]">
          {isLoading ? <LoadingIndicator /> : stats.tps}
        </div>
      </div>
      <div className="bg-[#171B20] p-4 rounded-lg border border-[#2B3238]">
        <div className="text-gray-400 text-sm">GAS LIMIT</div>
        <div className="text-xl font-medium text-[#E1E4E7]">
          {isLoading ? <LoadingIndicator /> : '30,000,000'}
        </div>
      </div>
      <div className="bg-[#171B20] p-4 rounded-lg border border-[#2B3238]">
        <div className="text-gray-400 text-sm">GAS PRICE</div>
        <div className="text-xl font-medium text-[#E1E4E7]">
          {isLoading ? <LoadingIndicator /> : `${stats.baseFee} Wei`}
        </div>
      </div>
      <div className="bg-[#171B20] p-4 rounded-lg border border-[#2B3238]">
        <div className="text-gray-400 text-sm">LATEST BLOCK</div>
        <div className="text-xl font-medium text-[#E1E4E7]">
          {isLoading ? <LoadingIndicator /> : stats.latestBlock}
        </div>
      </div>
    </div>
  );
} 