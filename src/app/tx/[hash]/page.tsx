'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useNetwork } from '@/contexts/NetworkContext';
import { getPublicClient } from '@/utils/rpc';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { formatEther } from 'ethers';
import { decodeInteraction } from '@/utils/decodeTransaction';
import { getRelativeTime } from '@/utils/time';

export default function TransactionPage() {
  const { network } = useNetwork();
  const { hash } = useParams();
  const [txData, setTxData] = useState<{
    tx?: any;
    receipt?: any;
    block?: any;
    decodedInteraction?: any;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (!hash || !network) return;

        setLoading(true);
        setError(null);

        const client = getPublicClient(network);
        const [tx, receipt] = await Promise.all([
          client.getTransaction({ hash: hash as `0x${string}` }),
          client.getTransactionReceipt({ hash: hash as `0x${string}` }),
        ]);

        if (!isMounted) return;

        const block = await client.getBlock({ blockNumber: tx.blockNumber });
        const decodedInteraction = tx.to && tx.input ? decodeInteraction(tx.input, tx.to) : null;

        setTxData({ tx, receipt, block, decodedInteraction });
      } catch (error) {
        if (isMounted) {
          setError('Failed to load transaction details');
          console.error('Error fetching transaction:', error);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [hash, network]);

  return (
    <div className="min-h-screen bg-[#0D1114] p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-2xl mb-4">Transaction Details</h1>

        <div className="bg-[#171B20] rounded-lg border border-[#2B3238] p-6">
          {error ? (
            <div className="text-red-400 text-center py-8">
              {error} -{' '}
              <button
                onClick={() => window.location.reload()}
                className="text-[#51d2c1] hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="text-center text-gray-400 py-8 flex items-center justify-center">
              Loading transaction details...
            </div>
          ) : !txData.tx ? (
            <div className="text-center text-gray-400 py-8">Transaction not found</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Transaction Hash:</div>
                <div className="text-[#51d2c1] break-all">{txData.tx?.hash}</div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Block:</div>
                <Link
                  href={`/block/${txData.tx.blockNumber}`}
                  className="text-[#51d2c1] hover:underline"
                >
                  {txData.tx.blockNumber?.toString()}
                </Link>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Timestamp:</div>
                <div>
                  {new Date(Number(txData.block.timestamp) * 1000).toLocaleString()}{' '}
                  <span className="text-gray-400">({getRelativeTime(txData.block.timestamp)})</span>
                </div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">From:</div>
                <Link
                  href={`/address/${txData.tx.from}`}
                  className="break-all hover:text-[#51d2c1] hover:underline"
                >
                  {txData.tx.from}
                </Link>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">To:</div>
                {txData.tx.to ? (
                  <Link
                    href={`/address/${txData.tx.to}`}
                    className="break-all hover:text-[#51d2c1] hover:underline"
                  >
                    {txData.tx.to}
                  </Link>
                ) : (
                  <div className="break-all">Contract Creation</div>
                )}
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Value:</div>
                <div className="break-all">{formatEther(txData.tx.value || 0n)} HYPE</div>
              </div>
              {!loading && txData.tx && txData.receipt && (
                <>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-gray-400">Gas Price:</div>
                    <div>{(Number(txData.tx.gasPrice) / 1e9).toFixed(2)} Gwei</div>
                  </div>
                  <div className="grid grid-cols-[200px_1fr] gap-4">
                    <div className="text-gray-400">Total Cost:</div>
                    <div className="break-all">
                      {formatEther(txData.tx.gasPrice * txData.receipt.gasUsed)} HYPE
                    </div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Gas Limit:</div>
                <div>{txData.tx.gas?.toString()}</div>
              </div>
              <div className="grid grid-cols-[200px_1fr] gap-4">
                <div className="text-gray-400">Gas Used:</div>
                <div>
                  {txData.receipt.gasUsed.toString()} (
                  {((Number(txData.receipt.gasUsed) / Number(txData.tx.gas)) * 100).toFixed(2)}%)
                </div>
              </div>
              {txData.decodedInteraction && (
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-gray-400">
                    {txData.decodedInteraction.contract?.name
                      ? 'Decode Input Data:'
                      : 'Input Data:'}
                  </div>
                  <div>
                    {txData.decodedInteraction.contract?.name ? (
                      <div>
                        <div className="grid grid-cols-[auto_auto_1fr] gap-10">
                          <div>
                            <div className="text-gray-400 text-sm">Contract</div>
                            <div className="text-[#51d2c1] mt-1">
                              <span className="py-1 bg-[#1A1F23] rounded text-sm">
                                {txData.decodedInteraction.contract?.name || 'Unknown Contract'}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <div className="w-[1px] h-full bg-gray-400"></div>
                          </div>

                          <div>
                            <div className="text-gray-400 text-sm">Function Call</div>
                            <div className="text-[#51d2c1] mt-1">
                              {txData.decodedInteraction.name || txData.decodedInteraction.type}
                            </div>
                          </div>
                        </div>

                        {txData.decodedInteraction.args && (
                          <div className="mt-3">
                            <div className="text-gray-400 text-sm mb-1">Arguments:</div>
                            <div className="space-y-1">
                              {txData.decodedInteraction.args.map((arg: any, index: any) => (
                                <div key={index} className="text-gray-300 break-all">
                                  {typeof arg === 'string' && arg.startsWith('0x') ? (
                                    <Link
                                      href={`/address/${arg}`}
                                      className="text-[#51d2c1] hover:underline"
                                    >
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

                        {txData.decodedInteraction.data && (
                          <div className="mt-3">
                            <div className="text-gray-400 text-sm mb-1">Input:</div>
                            <div className="text-gray-400 break-all">
                              {txData.decodedInteraction.data}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-400 break-all">{txData.tx.input}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
