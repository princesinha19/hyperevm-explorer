export interface Transaction {
  hash: `0x${string}`;
  from: `0x${string}`;
  to: `0x${string}` | null;
  value: bigint;
  blockNumber: bigint;
  input: string;
}