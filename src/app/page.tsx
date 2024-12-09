'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLatestBlocks } from '@/hooks/useLatestBlocks'
import Logo from '@/components/Logo'
import DashboardStats from '@/components/DashboardStats'
import LatestBlocks from '@/components/LatestBlocks'
import LatestTransactions from '@/components/LatestTransactions'
import RpcError from '@/components/RpcError'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { error } = useLatestBlocks()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) return

    // Check if it's a block number (only digits)
    if (/^\d+$/.test(searchQuery)) {
      router.push(`/block/${searchQuery}`)
      return
    }

    // Check if it's a transaction hash (0x followed by 64 hex characters)
    if (/^0x[a-fA-F0-9]{64}$/.test(searchQuery)) {
      router.push(`/tx/${searchQuery}`)
      return
    }

    // Check if it's an address (0x followed by 40 hex characters)
    if (/^0x[a-fA-F0-9]{40}$/.test(searchQuery)) {
      router.push(`/address/${searchQuery}`)
      return
    }

    // If no match, show an alert
    alert('Invalid search query. Please enter a valid block number, transaction hash, or address.')
  }

  return (
    <main className="min-h-screen bg-[#0D1114]">
      <div className="border-b border-[#2B3238]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Logo />
            <span className="text-[#3DD8AF] text-sm font-medium border border-[#3DD8AF] px-3 py-1 rounded-lg">
              HyperEVM Testnet
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <RpcError />
        ) : (
          <>
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search by Address / Txn Hash / Block"
                  className="flex-1 p-3 bg-[#171B20] border border-[#2B3238] rounded-lg text-[#E1E4E7]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#3DD8AF] text-[#0B0E11] rounded-lg font-medium hover:bg-[#35C69D] transition-colors flex items-center gap-2"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <LatestBlocks />
              </div>
              <div className="lg:col-span-2">
                <LatestTransactions />
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="border-t border-[#2B3238] mt-1">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <a 
              href="https://hyperfoundation.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#3DD8AF] hover:text-[#35C69D] transition-colors text-sm"
            >
              © Hyperliquid
            </a>
            <div className="flex items-center gap-6">
              <p className="text-[#E1E4E7] text-sm">
                Made with ❤️ by{' '}
                <a 
                  href="https://x.com/im0xPrince" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#3DD8AF] hover:text-[#35C69D] transition-colors"
                >
                  Prince X
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}