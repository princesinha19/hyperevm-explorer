import { useLatestBlocks } from '@/hooks/useLatestBlocks';
import { formatEther } from 'ethers';
import Link from 'next/link';
import { useState } from 'react';

export default function LatestTransactions() {
  const { transactions, isLoading } = useLatestBlocks();
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  
  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  
  // Get current transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
              {currentTransactions.map((tx) => (
                <div 
                  key={tx.hash} 
                  className="flex flex-col md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-2 py-3.5 transaction-row"
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
                      {tx.blockNumber.toString()}
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
                      {Number(formatEther(tx.value || 0n)).toFixed(3)} HYPE
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="text-gray-400">
              Showing {indexOfFirstTransaction + 1}-{Math.min(indexOfLastTransaction, transactions.length)} of {transactions.length} transactions
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-[#2B3238] disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:bg-[#2B3238] transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === number
                      ? 'bg-[#51d2c1] text-[#171B20] border-[#51d2c1]'
                      : 'border-[#2B3238] text-gray-300 hover:bg-[#2B3238]'
                  } transition-colors`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-[#2B3238] disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:bg-[#2B3238] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 