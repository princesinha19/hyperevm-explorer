'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useNetwork } from '@/contexts/NetworkContext';
import { getPublicClient } from '@/utils/rpc';
import { formatEther } from 'ethers';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

export default function AddressPage() {
  const { network } = useNetwork();
  const { address } = useParams();
  const [details, setDetails] = useState<{ balance?: string; nonce?: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = getPublicClient(network);
        const [balance, nonce] = await Promise.all([
          client.getBalance({ address: address as `0x${string}` }),
          client.getTransactionCount({ address: address as `0x${string}` }),
        ]);

        setDetails({
          balance: formatEther(balance),
          nonce,
        });
      } catch (error) {
        console.error('Error fetching address details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchData();
    }
  }, [address, network]);

  return (
    <div className="min-h-screen bg-[#0D1114] p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-2xl mb-4">Address Details</h1>

        <div className="bg-[#171B20] rounded-lg border border-[#2B3238] p-6 mb-6">
          <div className="space-y-4">
            {loading ? (
              <div className="text-gray-400">Loading address details...</div>
            ) : (
              <>
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-gray-400">Address:</div>
                  <div className="break-all">{address}</div>
                </div>
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-gray-400">Balance:</div>
                  <div className="break-all">{details.balance} HYPE</div>
                </div>
                <div className="grid grid-cols-[200px_1fr] gap-4">
                  <div className="text-gray-400">Nonce:</div>
                  <div>{details.nonce}</div>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
