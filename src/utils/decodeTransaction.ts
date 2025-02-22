import { Interface } from 'ethers';
import { KNOWN_ABIS } from '../constants/contractAbis';

// Add standard ABI interfaces
const ERC20_ABI = [
  'function transfer(address to, uint256 value) returns (bool)',
  'function approve(address spender, uint256 value) returns (bool)',
  'function transferFrom(address from, address to, uint256 value) returns (bool)',
];

const ERC721_ABI = [
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function approve(address to, uint256 tokenId)',
  'function setApprovalForAll(address operator, bool approved)',
];

export function decodeInteraction(input: string, contractAddress: string) {
  if (!input || input === '0x') return null;

  try {
    // Try decoding as ERC20 first
    const erc20Interface = new Interface(ERC20_ABI);
    try {
      const decoded = erc20Interface.parseTransaction({ data: input });
      if (decoded) {
        return {
          type: `ERC20 ${decoded.name}`,
          name: decoded.name,
          args: Object.values(decoded.args),
          signature: decoded.signature,
          contract: {
            name: 'ERC20 Token',
            address: contractAddress,
          },
        };
      }
    } catch (e) {
      // Not an ERC20 transaction, continue to ERC721
    }

    // Try decoding as ERC721
    const erc721Interface = new Interface(ERC721_ABI);
    try {
      const decoded = erc721Interface.parseTransaction({ data: input });
      if (decoded) {
        return {
          type: `ERC721 ${decoded.name}`,
          name: decoded.name,
          args: Object.values(decoded.args),
          signature: decoded.signature,
          contract: {
            name: 'ERC721 Token',
            address: contractAddress,
          },
        };
      }
    } catch (e) {
      // Not an ERC721 transaction, continue to known ABIs
    }

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
          address: contractAddress,
        },
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
