import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.svg"
        alt="Hyperliquid Logo"
        width={40}
        height={40}
        className="w-12 h-7"
      />
      <span className="text-2xl text-bold text-[#51d2c1]">Explorer</span>
    </div>
  );
} 