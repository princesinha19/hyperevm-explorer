import { publicClient } from '@/utils/rpc';
import { formatEther } from 'ethers';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { decodeInteraction } from '@/utils/decodeTransaction';

interface DecodedInteraction {
  contract?: { name: string };
  name?: string;
  type?: string;
  args?: any[];
  data?: string;
}

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

    // Add this after getting tx data
    const decodedInteraction: DecodedInteraction | null = tx.to && tx.input ? decodeInteraction(tx.input, tx.to) : null;

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
                <Link href={`/block/${tx.blockNumber}`} className="text-[#51d2c1] hover:underline">
                  {tx.blockNumber?.toString()}
                </Link>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">From:</div>
                <Link href={`/address/${tx.from}`} className="break-all hover:text-[#51d2c1] hover:underline">
                  {tx.from}
                </Link>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">To:</div>
                {tx.to ? (
                  <Link href={`/address/${tx.to}`} className="break-all hover:text-[#51d2c1] hover:underline">
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
                <div className="text-gray-400">Total Cost:</div>
                <div className="break-all">{gasCost} TESTH</div>
              </div>
              {decodedInteraction && (
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-gray-400">
                    {decodedInteraction.contract?.name ? 'Decode Input Data:' : 'Input Data:'}
                  </div>
                  <div>
                    {decodedInteraction.contract?.name ? (
                      <div>
                        <div className="grid grid-cols-[auto_auto_1fr] gap-10">
                          <div>
                            <div className="text-gray-400 text-sm">Contract</div>
                            <div className="text-[#51d2c1] mt-1">
                              <span className="py-1 bg-[#1A1F23] rounded text-sm">
                                {decodedInteraction.contract?.name || 'Unknown Contract'}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <div className="w-[1px] h-full bg-gray-400"></div>
                          </div>

                          <div>
                            <div className="text-gray-400 text-sm">Function Call</div>
                            <div className="text-[#51d2c1] mt-1">
                              {decodedInteraction.name || decodedInteraction.type}
                            </div>
                          </div>
                        </div>

                        {decodedInteraction.args && (
                          <div className="mt-3">
                            <div className="text-gray-400 text-sm mb-1">Arguments:</div>
                            <div className="space-y-1">
                              {decodedInteraction.args.map((arg, index) => (
                                <div key={index} className="text-gray-300 break-all">
                                  {typeof arg === 'string' && arg.startsWith('0x') ? (
                                    <Link href={`/address/${arg}`} className="text-[#51d2c1] hover:underline">
                                      {arg}
                                    </Link>
                                  ) : (
                                    <span>{arg}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {decodedInteraction.data && (
                          <div className="mt-3">
                            <div className="text-gray-400 text-sm mb-1">Input:</div>
                            <div className="text-gray-400 break-all">
                              {decodedInteraction.data}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400 break-all">
                        {tx.input}
                      </div>
                    )}
                  </div>
                </div>
              )}
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