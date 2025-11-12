// hooks/queries/useTransactions.ts
import { useQuery } from '@tanstack/react-query';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { useWalletStore } from '../../stores/useWalletStore';
import { MockTransaction } from '../../types';

const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

const fetchTransactionsFromSui = async (address: string): Promise<MockTransaction[]> => {
    console.log(`Fetching transactions for ${address}...`);

    const txs = await client.queryTransactionBlocks({
        filter: { FromAddress: address },
        limit: 10,
        options: {
            showInput: true,
            showEffects: true,
            showEvents: true,
        },
    });

    return txs.data.map(tx => ({
        id: tx.digest,
        type: tx.transaction?.data?.transaction?.kind || 'send',
        status: tx.effects?.status?.status || 'Unknown',
        description: tx.transaction?.data?.transaction?.kind || 'Sui transaction',
        timestamp: tx.timestampMs
            ? new Date(parseInt(tx.timestampMs)).toISOString()
            : new Date().toISOString(),
        amount: 0, // you can enhance this later to parse Move events
        currency: 'SUI',
        from: address,
        to: tx.transaction?.data?.sender || 'Unknown',
        fee: 0.01,
    }));
};

export const useTransactions = () => {
    const { account, isConnected } = useWalletStore();

    return useQuery({
        queryKey: ['transactions', account],
        queryFn: () => (account ? fetchTransactionsFromSui(account) : Promise.resolve([])),
        enabled: isConnected && !!account,
        staleTime: 60_000,
    });
};
