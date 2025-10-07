import Account, { type StorageAddress, type TokenAddress } from '../account';
import type LogTargetConsole from '../log/target_console';
import type { NodeConfig } from '.';
type LogConfig = Omit<NonNullable<ConstructorParameters<typeof LogTargetConsole>[0]>, 'console'>;
type EnvConfig = Partial<Omit<NodeConfig, 'ledger'> & {
    ledger: Partial<NodeConfig['ledger']>;
} & {
    logConfig: Partial<LogConfig>;
}>;
export declare function getConfigFromEnv(type: 'local' | 'lambda'): EnvConfig;
export declare function getFeeConfigFromEnv(type: 'local' | 'lambda'): {
    feeAccounts: (Account | StorageAddress)[];
    feeToken: TokenAddress | undefined;
    feeFunction: NodeConfig['ledger']['computeFeeFromBlocks'] | undefined;
};
export {};
