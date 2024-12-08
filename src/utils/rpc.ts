import { createPublicClient, http } from 'viem'

export const publicClient = createPublicClient({
  transport: http('https://api.hyperliquid-testnet.xyz/evm')
}) 