import { useLatestBlocks } from '@/hooks/useLatestBlocks';
import { formatEther } from 'ethers';
import Link from 'next/link';

export default function LatestTransactions() {
  const { transactions, isLoading } = useLatestBlocks();
  
  return (
    <div className="bg-[#171B20] rounded-lg border border-[#2B3238] p-6">
      <h2 className="text-2xl font-medium mb-6 text-white">Latest Transactions</h2>
      {isLoading ? (
        <div className="text-center text-gray-400 py-4">
          Loading transactions...
        </div>
      ) : (
        <div>
          <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-2 text-gray-400 pb-4 border-b border-[#2B3238] text-sm">
            <div>Txn Hash</div>
            <div>Block</div>
            <div>From</div>
            <div>To</div>
            <div className="text-right">Value</div>
          </div>

          <div className="divide-y divide-[#2B3238] transaction-list">
            <div className="transaction-rows space-y-0">
              {transactions
                .slice(0, window.innerWidth < 768 ? 3 : transactions.length)
                .map((tx) => (
                <div 
                  key={tx.hash} 
                  className="flex flex-col md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-2 py-4 transaction-row"
                >
                  <div className="flex flex-col space-y-2 md:space-y-0">
                    <div className="text-gray-400 md:hidden text-sm">Txn Hash:</div>
                    <Link href={`/tx/${tx.hash}`} className="text-[#51d2c1] hover:underline text-sm">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                    </Link>
                  </div>

                  <div className="flex flex-col space-y-2 md:space-y-0">
                    <div className="text-gray-400 md:hidden text-sm">Block:</div>
                    <Link href={`/block/${tx.blockNumber}`} className="text-gray-300 hover:underline text-sm">
                      #{tx.blockNumber.toString()}
                    </Link>
                  </div>

                  <div className="flex flex-col space-y-2 md:space-y-0">
                    <div className="text-gray-400 md:hidden text-sm">From:</div>
                    <Link href={`/address/${tx.from}`} className="text-gray-300 hover:underline text-sm">
                      {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                    </Link>
                  </div>

                  <div className="flex flex-col space-y-2 md:space-y-0">
                    <div className="text-gray-400 md:hidden text-sm">To:</div>
                    {tx.to ? (
                      <Link href={`/address/${tx.to}`} className="text-gray-300 hover:underline text-sm">
                        {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                      </Link>
                    ) : 'Contract Creation'}
                  </div>

                  <div className="flex flex-col space-y-2 md:space-y-0">
                    <div className="text-gray-400 md:hidden text-sm">Value:</div>
                    <div className="text-gray-300 md:text-right text-sm">
                      {Number(formatEther(tx.value || 0n)).toFixed(3)} TESTH
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 