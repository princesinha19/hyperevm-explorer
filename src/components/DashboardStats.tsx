import { useLatestBlocks } from '@/hooks/useLatestBlocks';

interface Block {
  block: {
    timestamp: string;
    transactions: any[];
    baseFeePerGas?: string;
    number: number;
  };
}

export default function DashboardStats() {
  const { blocks, isLoading } = useLatestBlocks();
  
  const LoadingIndicator = () => (
    <div className="animate-pulse">
      <div className="h-4 w-20 bg-gray-700 rounded"></div>
    </div>
  );

  const calculateAverageBlockTime = (blocks: Block[]) => {
    if (blocks.length < 10) return 0;

    let totalDifference = 0;
    for (let i = 0; i < 9; i++) {
      totalDifference += Number(blocks[i].block.timestamp) - Number(blocks[i + 1].block.timestamp);
    }
    return (totalDifference / 9).toFixed(2);
  };

  // Calculate stats from latest blocks
  const stats = blocks[0]?.block ? {
    transactions: blocks[0].block.transactions.length.toString(),
    baseFee: blocks[0].block.baseFeePerGas ? Number(blocks[0].block.baseFeePerGas).toFixed(2) : 'n/a',
    latestBlock: blocks[0].block.number.toString(),
    averageBlockTime: calculateAverageBlockTime(blocks)
  } : {
    transactions: '0',
    baseFee: '0',
    latestBlock: '0',
    averageBlockTime: '0'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#171B20] p-4 rounded-lg border border-[#2B3238]">
        <div className="text-gray-400 text-sm">Average Block Time</div>
        <div className="text-xl font-medium text-[#E1E4E7]">
          {isLoading ? <LoadingIndicator /> : `${stats.averageBlockTime} sec`}
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