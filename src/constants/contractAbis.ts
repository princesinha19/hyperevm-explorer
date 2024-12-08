import { Erc20TokenABI } from './abis/Erc20Token';
import { AbiRegistry } from '../types/contracts';

export const KNOWN_ABIS: AbiRegistry = {
  "0x34b1d68b352603d14b31b888d13b9d1fd6ededb1": {
    name: "Test Token",
    abi: Erc20TokenABI
  }
}; 