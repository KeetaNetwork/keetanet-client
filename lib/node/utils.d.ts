import Account, { type StorageAddress, type TokenAddress } from '../account';
import type { NodeConfig } from '.';
export declare function getConfigFromEnv(type: 'local' | 'lambda'): Partial<Omit<NodeConfig, 'ledger'> & {
    ledger: Partial<NodeConfig['ledger']>;
}>;
export declare function getFeeConfigFromEnv(type: 'local' | 'lambda'): {
    feeAccounts: (Account | StorageAddress)[];
    feeToken: TokenAddress | undefined;
    feeFunction: NodeConfig['ledger']['computeFeeFromBlocks'] | undefined;
};
