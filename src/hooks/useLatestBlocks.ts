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
        blockNumber,
        input: tx.input,
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
    if (existingBlocks.some(b => b.block.number === blockNumber)) {
      return null;
    }

    const fullBlock = await publicClient.getBlock({
      blockNumber,
      includeTransactions: true
    });

    const newTransactions = formatTransactions(fullBlock, blockNumber);

    const blockData = {
      block: fullBlock,
      transactions: newTransactions
    };

    const newBlocks = [blockData, ...existingBlocks]
      .sort((a, b) => Number(b.block.number - a.block.number))
      .slice(0, 10);

    const combined = [...newTransactions, ...existingTransactions];
    const uniqueTransactions = Array.from(
      new Map(combined.map(tx => [tx.hash, tx])).values()
    ).sort((a, b) => Number(b.blockNumber - a.blockNumber))
     .slice(0, 50);

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
    const initialBlocks: BlockWithTransactions[] = [];
    const initialTransactions: Transaction[] = [];

    const blockPromises = Array.from({ length: 10 }, (_, i) => {
      const blockNumber = currentBlock - BigInt(i);
      return publicClient.getBlock({
        blockNumber,
        includeTransactions: true
      });
    });

    const blocks = await Promise.all(blockPromises);

    blocks.forEach((block, i) => {
      const blockNumber = currentBlock - BigInt(i);
      const transactions = formatTransactions(block, blockNumber);
      initialBlocks.push({
        block,
        transactions
      });
      initialTransactions.push(...transactions);
    });

    return {
      blocks: initialBlocks.sort((a, b) => Number(b.block.number - a.block.number)),
      transactions: initialTransactions
        .sort((a, b) => Number(b.blockNumber - a.blockNumber))
        .slice(0, 50)
    };
  }

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

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['latestBlocks'],
    queryFn: () => fetchLatestBlocks(queryClient),
    refetchInterval: (query) => query.state.error ? 30000 : 1000,
    placeholderData: undefined,
    retry: 3,
    retryDelay: 30000
  });

  return {
    blocks: data?.blocks ?? [],
    transactions: data?.transactions ?? [],
    isLoading,
    isFetching,
    error: Boolean(error)
  };
} 