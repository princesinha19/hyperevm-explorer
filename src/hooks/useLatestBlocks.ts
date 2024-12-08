import { useQuery, useQueryClient } from '@tanstack/react-query';
import { publicClient } from '@/utils/rpc';
import { Transaction } from '@/types/transaction';

interface BlockWithTransactions {
  block: any;
  transactions: Transaction[];
}

const formatTransactions = (block: any, blockNumber: bigint): Transaction[] => {
  return block.transactions
    .map((tx: any) => {
      if (typeof tx === 'string') return null;
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber
      };
    })
    .filter((tx: Transaction | null): tx is Transaction => tx !== null);
};

const processNewBlock = async (
  blockNumber: bigint,
  existingBlocks: BlockWithTransactions[],
  existingTransactions: Transaction[]
): Promise<{
  blocks: BlockWithTransactions[];
  transactions: Transaction[];
} | null> => {
  try {
    // Check if block already exists
    if (existingBlocks.some(b => b.block.number === blockNumber)) {
      console.log('Block already processed:', blockNumber.toString());
      return null;
    }

    const fullBlock = await publicClient.getBlock({
      blockNumber,
      includeTransactions: true
    });

    const newTransactions = formatTransactions(fullBlock, blockNumber);

    // Double check for race conditions
    if (existingBlocks.some(b => b.block.number === blockNumber)) {
      return null;
    }

    const blockData = {
      block: fullBlock,
      transactions: newTransactions
    };

    // Sort and slice blocks
    const newBlocks = [blockData, ...existingBlocks]
      .sort((a, b) => Number(b.block.number - a.block.number))
      .slice(0, 10);

    // Combine and deduplicate transactions
    const combined = [...newTransactions, ...existingTransactions];
    const uniqueTransactions = Array.from(
      new Map(combined.map(tx => [tx.hash, tx])).values()
    ).sort((a, b) => Number(b.blockNumber - a.blockNumber))
     .slice(0, 10);

    return {
      blocks: newBlocks,
      transactions: uniqueTransactions
    };
  } catch (error) {
    console.error('Error processing block:', blockNumber.toString(), error);
    return null;
  }
};

const fetchLatestBlocks = async (queryClient: any): Promise<{
  blocks: BlockWithTransactions[];
  transactions: Transaction[];
}> => {
  const currentData = queryClient.getQueryData(['latestBlocks']) as {
    blocks: BlockWithTransactions[];
    transactions: Transaction[];
  } || { blocks: [], transactions: [] };

  const currentBlock = await publicClient.getBlockNumber();
  const lastProcessedBlock = currentData.blocks[0]?.block.number;

  if (!lastProcessedBlock) {
    // Initial load
    const initialBlocks: BlockWithTransactions[] = [];
    const initialTransactions: Transaction[] = [];

    for (let i = 0; i < 10; i++) {
      const blockNumber = currentBlock - BigInt(i);
      const block = await publicClient.getBlock({
        blockNumber,
        includeTransactions: true
      });
      
      const transactions = formatTransactions(block, blockNumber);
      initialBlocks.push({
        block,
        transactions
      });
      initialTransactions.push(...transactions);
    }

    return {
      blocks: initialBlocks.sort((a, b) => Number(b.block.number - a.block.number)),
      transactions: initialTransactions
        .sort((a, b) => Number(b.blockNumber - a.blockNumber))
        .slice(0, 10)
    };
  }

  // Process missed blocks
  let updatedData = currentData;
  for (let i = lastProcessedBlock + 1n; i <= currentBlock; i++) {
    const result = await processNewBlock(
      i,
      updatedData.blocks,
      updatedData.transactions
    );
    if (result) {
      updatedData = result;
    }
  }

  return updatedData;
};

export function useLatestBlocks() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['latestBlocks'],
    queryFn: () => fetchLatestBlocks(queryClient),
    refetchInterval: 1000,
    placeholderData: undefined
  });

  return {
    blocks: data?.blocks ?? [],
    transactions: data?.transactions ?? [],
    isLoading,
    isFetching
  };
} 