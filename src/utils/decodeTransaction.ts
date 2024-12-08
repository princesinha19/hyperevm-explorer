import { Interface } from 'ethers';
import { KNOWN_ABIS } from '../constants/contractAbis';

export function decodeInteraction(input: string, contractAddress: string) {
  if (!input || input === '0x') return null;

  try {
    // Get ABI for this contract
    const abiInfo = KNOWN_ABIS[contractAddress.toLowerCase()];
    if (!abiInfo) {
      return { type: 'Unknown Contract', data: input };
    }

    // Create interface from ABI
    const contractInterface = new Interface(abiInfo.abi);

    try {
      const decoded = contractInterface.parseTransaction({ data: input });
      if (!decoded) return null;

      // Return a generic format that includes all relevant data
      return {
        type: `${abiInfo.name} ${decoded.name}`,
        name: decoded.name,
        args: Object.values(decoded.args),
        signature: decoded.signature,
        contract: {
          name: abiInfo.name,
          address: contractAddress
        }
      };
    } catch (e) {
      console.debug('Failed to decode with known ABI:', e);
    }

    return { type: 'Contract Interaction', data: input };
  } catch (error) {
    console.error('Error decoding transfer:', error);
    return null;
  }
}