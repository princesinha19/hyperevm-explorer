import { useLatestBlocks } from '@/hooks/useLatestBlocks';
import Link from 'next/link';
import { getRelativeTime } from '../utils/time';

export default function LatestBlocks() {
  const { blocks, isLoading } = useLatestBlocks();

  if (isLoading) {
    return (
      <div className="bg-[#171B20] rounded-lg border border-[#2B3238] p-4">
        <h2 className="text-xl font-medium mb-4">Latest Blocks</h2>
        <div className="text-center text-gray-400 py-8 flex items-center justify-center">
          Loading blocks...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#171B20] rounded-lg border border-[#2B3238] p-4">
      <h2 className="text-xl font-medium mb-4">Latest Blocks</h2>
      <div className="space-y-3">
        {blocks.map(({ block }) => (
          <div key={block.number} className="flex items-center justify-between p-3 hover:bg-[#1A1F23] rounded">
            <div className="flex items-center gap-3">
              <Link href={`/block/${block.number}`} className="text-[#51d2c1] hover:underline">
                #{block.number.toString()}
              </Link>
              <div className="text-sm text-gray-400">
                {block.transactions.length} txns
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {getRelativeTime(block.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 