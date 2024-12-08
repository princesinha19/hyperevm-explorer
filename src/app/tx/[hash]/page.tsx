import { publicClient } from '@/utils/rpc';
import { formatEther } from 'ethers';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

export default async function TransactionPage(props: any) {
  // Get the hash parameter first
  const { hash } = await props.params;
  
  try {
    const [tx, receipt] = await Promise.all([
      publicClient.getTransaction({ 
        hash: hash as `0x${string}` 
      }),
      publicClient.getTransactionReceipt({ 
        hash: hash as `0x${string}` 
      })
    ]);

    if (!tx) {
      throw new Error('Transaction not found');
    }

    // Format gas price to Gwei
    const gasPriceGwei = tx.gasPrice ? Number(tx.gasPrice) : 0;
    
    // Calculate total gas cost in native token
    const gasCost = tx.gasPrice && receipt.gasUsed ? 
      formatEther(tx.gasPrice * receipt.gasUsed) : 
      '0';

    return (
      <div className="min-h-screen bg-[#0D1114] p-8">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <h1 className="text-2xl mb-4">Transaction Details</h1>
          <div className="bg-[#171B20] rounded-lg border border-[#2B3238] p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Transaction Hash:</div>
                <div className="text-[#51d2c1] break-all">{tx.hash}</div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Block:</div>
                <div className="text-[#51d2c1]">#{tx.blockNumber?.toString()}</div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">From:</div>
                <Link href={`/address/${tx.from}`} className="break-all hover:text-[#51d2c1]">
                  {tx.from}
                </Link>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">To:</div>
                {tx.to ? (
                  <Link href={`/address/${tx.to}`} className="break-all hover:text-[#51d2c1]">
                    {tx.to}
                  </Link>
                ) : (
                  <div className="break-all">Contract Creation</div>
                )}
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Value:</div>
                <div>{formatEther(tx.value || 0n)} TESTH</div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Gas Price:</div>
                <div>{gasPriceGwei.toFixed(2)} Wei</div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Gas Limit:</div>
                <div>{tx.gas?.toString()}</div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Gas Used:</div>
                <div>{receipt.gasUsed.toString()} ({((Number(receipt.gasUsed) / Number(tx.gas)) * 100).toFixed(2)}%)</div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Gas Cost:</div>
                <div>{gasCost} TESTH</div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
} 