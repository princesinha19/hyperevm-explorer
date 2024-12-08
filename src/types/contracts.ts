interface AbiInput {
  indexed?: boolean;
  internalType?: string;
  name: string;
  type: string;
  components?: any;
}

interface AbiItem {
  anonymous?: boolean;
  inputs?: AbiInput[];
  outputs?: AbiInput[];
  stateMutability?: string;
  type: string;
  name?: string;
}

export interface AbiRegistry {
  [contractAddress: string]: {
    name: string;
    abi: AbiItem[];
  };
} 