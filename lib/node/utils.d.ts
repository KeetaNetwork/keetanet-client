import type { NodeConfig } from '.';
export declare function getConfigFromEnv(type: 'local' | 'lambda'): Partial<Omit<NodeConfig, 'ledger'> & {
    ledger: Partial<NodeConfig['ledger']>;
}>;
