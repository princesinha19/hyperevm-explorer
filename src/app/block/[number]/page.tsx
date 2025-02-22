'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useNetwork } from '@/contexts/NetworkContext';
import { getPublicClient } from '@/utils/rpc';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

export default function BlockPage() {
  const { network } = useNetwork();
  const [blockData, setBlockData] = useState<any>(null);
  const { number } = useParams();

  useEffect(() => {
    if (!number) return;

    const blockNumber = BigInt(number as string);

    const fetchData = async () => {
      const client = getPublicClient(network);
      const block = await client.getBlock({
        blockNumber,
        includeTransactions: true,
      });
      setBlockData(block);
    };

    fetchData();
  }, [number, network]);

  return (
    <div className="min-h-screen bg-[#0D1114] p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-2xl mb-4">Block #{number}</h1>
        <div className="bg-[#171B20] rounded-lg border border-[#2B3238] p-6 mb-6">
          <div className="space-y-4">
            {!blockData ? (
              <div className="text-gray-400">Loading block data...</div>
            ) : (
              <>
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-gray-400">Block Height:</div>
                  <div>{blockData.number.toString()}</div>
                </div>
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-gray-400">Timestamp:</div>
                  <div>{new Date(Number(blockData.timestamp) * 1000).toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-gray-400">Transactions:</div>
                  <div>{blockData?.transactions.length} transactions</div>
                </div>
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-gray-400">Gas Used:</div>
                  <div>{blockData?.gasUsed.toString()}</div>
                </div>
              </>
            )}
          </div>
        </div>

        <h2 className="text-xl mb-4">Transactions</h2>
        <div className="bg-[#171B20] rounded-lg border border-[#2B3238] p-6">
          <div className="space-y-2">
            {blockData?.transactions.map((tx: any) => (
              <Link
                href={`/tx/${tx.hash}`}
                key={tx.hash}
                className="block hover:bg-[#1A1F23] p-2 rounded"
              >
                <div className="text-[#51d2c1] truncate">{tx.hash}</div>
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
