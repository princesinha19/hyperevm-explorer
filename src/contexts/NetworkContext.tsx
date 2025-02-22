'use client'

import { createContext, useContext, useState } from 'react'

type NetworkContextType = {
  network: 'mainnet' | 'testnet'
  setNetwork: (network: 'mainnet' | 'testnet') => void
}

const NetworkContext = createContext<NetworkContextType>({} as NetworkContextType)

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('mainnet')
  
  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetwork = () => useContext(NetworkContext) 