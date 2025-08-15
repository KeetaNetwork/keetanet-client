import type { Account, GenericAccount, MultisigAddress, TokenAddress } from '../account';
import type { AdjustMethod } from '../block';
import type { Permissions } from '../permissions';
import type { DbStats, TimeStats } from '../stats';
import type { Certificate, CertificateBundle } from '../utils/certificate';
export interface MultisigConfig {
    signers: (Account | MultisigAddress)[];
    quorum: bigint;
}
/**
 * Account info entry
 */
export interface AccountInfo {
    /**
     * A name for the account
     */
    name: string;
    /**
     * A description for the account
     */
    description: string;
    /**
     * Arbitrary metadata for the account
     */
    metadata: string;
    /**
     * If the account is a token, the supply of the token
     */
    supply?: bigint;
    /**
     * The default permissions for the account
     */
    defaultPermission?: Permissions;
    /**
     * If this is a multisig account, the number of signers required
     */
    multisigQuorum?: bigint;
}
export type UserEditableAccountInfo = Omit<AccountInfo, 'supply'>;
/**
 * Permissions types
 */
export interface ACLRow {
    /**
     * The account that these permissions apply to
     */
    principal: GenericAccount;
    /**
     * The account that this row is for
     */
    entity: GenericAccount;
    /**
     * An optional target account which, depending on the permissions, may be targeted by the permission
     */
    target: GenericAccount;
    /**
     * The permissions for which this row grants
     */
    permissions: Permissions;
}
/**
 * An entry for the ACL
 * @expandType ACLRow
 */
export interface ACLEntry extends Omit<ACLRow, 'target'> {
    target?: GenericAccount;
    method?: AdjustMethod.SET;
}
/**
 * Update an ACL for an account
 * @expandType ACLEntry
 */
export interface ACLUpdate extends Omit<ACLEntry, 'method' | 'permissions'> {
    /**
     * The method to use to update the ACL
     */
    method: AdjustMethod;
    /**
     * The permissions to set for the ACL
     *
     * If this is set to null, the permissions will be unset
     */
    permissions: Permissions | null;
}
/**
 * All balances for each token on an account
 */
export type GetAllBalancesResponse = {
    /**
     * The account balance of the specified token
     *
     * This is in raw units, and not the display units
     * that the token uses
     */
    balance: bigint;
    /**
     * The account of the token
     */
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
    db: DbStats;
    settlementTimes: TimeStats;
}
export interface CertificateWithIntermediates {
    certificate: Certificate;
    intermediates: CertificateBundle | null;
}
