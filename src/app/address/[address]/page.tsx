import { publicClient } from '@/utils/rpc';
import { formatEther } from 'ethers';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

interface AddressDetails {
  balance: bigint;
  nonce: number;
}

async function getAddressDetails(address: string): Promise<AddressDetails> {
  const [balance, nonce] = await Promise.all([
    publicClient.getBalance({ address: address as `0x${string}` }),
    publicClient.getTransactionCount({ address: address as `0x${string}` })
  ]);

  return {
    balance,
    nonce
  };
}

export default async function AddressPage(props: any) {
  const { address } = await props.params;
  
  const details = await getAddressDetails(address);

  return (
    <div className="min-h-screen bg-[#0D1114] p-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-2xl mb-4">Address Details</h1>
        
        <div className="bg-[#171B20] rounded-lg border border-[#2B3238] p-6 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-gray-400">Address:</div>
              <div className="break-all">{address}</div>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-gray-400">Balance:</div>
              <div>{formatEther(details.balance)} TESTH</div>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-gray-400">Nonce:</div>
              <div>{details.nonce}</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}