'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BackButton() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  if (!isClient) {
    return null;
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center text-gray-400 hover:text-[#51d2c1] transition-colors mb-4"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </button>
  );
}
