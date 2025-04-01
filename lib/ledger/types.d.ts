import type { GenericAccount, TokenAddress } from '../account';
import type { AdjustMethod } from '../block';
import type Permissions from '../permissions';
import type { TimeStats } from '../stats';
/**
 * Account info entry
 */
export interface AccountInfo {
    name: string;
    description: string;
    metadata: string;
    supply?: bigint;
    defaultPermission?: Permissions;
}
/**
 * Permissions types
 */
export interface ACLRow {
    principal: GenericAccount;
    entity: GenericAccount;
    target: GenericAccount;
    permissions: Permissions;
}
export interface ACLEntry extends Omit<ACLRow, 'target'> {
    target?: GenericAccount;
    method?: AdjustMethod.SET;
}
export interface ACLUpdate extends Omit<ACLEntry, 'method' | 'permissions'> {
    method: AdjustMethod;
    permissions: Permissions | null;
}
/**
 * All balances for each token on an account
 */
export type GetAllBalancesResponse = {
    balance: bigint;
    token: TokenAddress;
}[];
/**
 * Ledger statistics
 */
export interface LedgerStatistics {
    moment: string;
    momentRange: number;
    blockCount: number;
    transactionCount: number;
    representativeCount: number;
    settlementTimes: TimeStats;
}
