import { createPublicClient, http } from 'viem'

const RPC_URLS = {
  mainnet: 'https://rpc.hyperliquid.xyz/evm',
  testnet: 'https://rpc.hyperliquid-testnet.xyz/evm' // Example testnet URL
};

export const getPublicClient = (network: 'mainnet' | 'testnet') => {
  return createPublicClient({
    transport: http(RPC_URLS[network], {
      fetchOptions: {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    })
  })
} 