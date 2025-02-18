import { createPublicClient, http } from 'viem'

export const publicClient = createPublicClient({
  transport: http('https://rpc.hyperliquid.xyz/evm', {
    fetchOptions: {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  })
}) 