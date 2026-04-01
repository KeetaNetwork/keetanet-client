import type { Account, AccountKeyAlgorithm, GenericAccount, IdentifierKeyAlgorithm, MultisigAddress, TokenAddress } from '../account';
import type { AdjustMethod } from '../block';
import type { Permissions } from '../permissions';
import type { DbStats, TimeStats } from '../stats';
import type { Certificate, CertificateBundle } from '../utils/certificate';
import type { DistributiveOmit } from '../utils/helper';
export interface MultisigConfig {
    signers: (Account | MultisigAddress)[];
    quorum: bigint;
}
/**
 * Account info entry
 */
interface BaseAccountInfo<KeyType extends AccountKeyAlgorithm> {
    /**
     * The account that this info is for
     */
    account: Account<KeyType>;
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
}
interface BaseIdentifierAccountInfo<KeyType extends IdentifierKeyAlgorithm> extends BaseAccountInfo<KeyType> {
    /**
     * The default permissions for the account
     */
    defaultPermission?: Permissions;
}
interface ECDSA_SECP256K1AccountInfo extends BaseAccountInfo<AccountKeyAlgorithm.ECDSA_SECP256K1> {
}
interface ECDSA_SECP256R1AccountInfo extends BaseAccountInfo<AccountKeyAlgorithm.ECDSA_SECP256R1> {
}
interface ED25519AccountInfo extends BaseAccountInfo<AccountKeyAlgorithm.ED25519> {
}
type KeyPairAccountInfo = ECDSA_SECP256K1AccountInfo | ECDSA_SECP256R1AccountInfo | ED25519AccountInfo;
interface TokenAccountInfo extends BaseIdentifierAccountInfo<AccountKeyAlgorithm.TOKEN> {
    /**
     * The current supply of the token
     */
    supply: bigint;
}
interface MultisigAccountInfo extends BaseIdentifierAccountInfo<AccountKeyAlgorithm.MULTISIG> {
    /**
     * The number of signers required for this multisig
     */
    multisigQuorum: bigint | null;
}
interface NetworkAccountInfo extends BaseIdentifierAccountInfo<AccountKeyAlgorithm.NETWORK> {
}
interface StorageAccountInfo extends BaseIdentifierAccountInfo<AccountKeyAlgorithm.STORAGE> {
}
export type AccountInfo = KeyPairAccountInfo | TokenAccountInfo | MultisigAccountInfo | StorageAccountInfo | NetworkAccountInfo;
export type AccountInfoWithoutAccount = DistributiveOmit<AccountInfo, 'account'>;
export type AccountInfoForType<T extends AccountKeyAlgorithm> = Extract<AccountInfo, {
    account: Account<T>;
}>;
export declare function isIdentifierAccountInfo(info: AccountInfo): info is Extract<AccountInfo, {
    account: Account<IdentifierKeyAlgorithm>;
}>;
export declare function isKeyPairAccountInfo(info: AccountInfo): info is KeyPairAccountInfo;
export declare function isAccountInfoOfType<T extends AccountKeyAlgorithm>(info: AccountInfo, type: T): info is Extract<AccountInfo, {
    account: Account<T>;
}>;
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
export {};
