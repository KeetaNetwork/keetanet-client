import type { GenericAccount, IdentifierAddress, NetworkAddress, TokenAddress } from '../account';
import Account from '../account';
import type { AdjustMethod } from '../block';
import { Block } from '../block';
import type * as Operations from '../block/operations';
import type { UserEditableAccountInfo, ACLEntry, ACLUpdate } from '../ledger/types';
import type { Certificate, CertificateBundle } from '../utils/certificate';
import { CertificateHash } from '../utils/certificate';
interface NumericValueEntry {
    value: bigint;
}
interface TokenNumericEntry extends NumericValueEntry {
    otherAccount: GenericAccount;
    isReceive: boolean;
}
interface RequestTokenReceiveEntry extends TokenNumericEntry {
    isReceive: true;
    otherAccount: GenericAccount;
    exact: boolean;
}
interface ModifyTokenBalanceEntry extends TokenNumericEntry {
    isReceive: false;
    set: boolean;
    receivable: boolean;
}
/**
 * Change of certificate indication
 */
export type CertificateUpdate = {
    method: AdjustMethod.ADD;
    certificateHash: CertificateHash;
    certificate: Certificate;
    intermediateCertificates: CertificateBundle | null;
} | {
    method: AdjustMethod.SUBTRACT;
    certificateHash: CertificateHash;
};
type TokenEntry = ModifyTokenBalanceEntry | RequestTokenReceiveEntry;
interface ComputedBlocksEffectTokenChangesField {
    [tokenPubKey: string]: TokenEntry[];
}
/**
 * Which fields may be affected by blocks
 */
interface CreateIdentifierRequest {
    createdIdentifier: IdentifierAddress;
    createArguments?: Operations.IdentifierCreateArguments;
}
type DelegationUpdate = {
    delegateTo: Account;
};
interface ComputedBlocksEffectFields {
    balance?: ComputedBlocksEffectTokenChangesField;
    supply?: NumericValueEntry[];
    info?: Partial<UserEditableAccountInfo>;
    permissions?: ACLUpdate[];
    permissionRequirements?: ACLEntry[];
    createRequests?: CreateIdentifierRequest[];
    delegation?: DelegationUpdate;
    certificate?: CertificateUpdate[];
    minSignerSetLength?: bigint;
}
/**
 * Which accounts and fields are affected by a set of block
 */
interface ComputedBlockEffect {
    account: GenericAccount;
    fields: ComputedBlocksEffectFields;
}
/**
 * A breakdown of computed effects by account public key
 */
export type ComputedEffectOfBlocksByAccount = {
    [accountPubKey: string]: ComputedBlockEffect;
};
export type ComputedEffectOfBlocks = {
    accounts: ComputedEffectOfBlocksByAccount;
    touched: InstanceType<typeof Account.Set>;
    possibleNewAccounts: InstanceType<typeof Account.Set>;
    metadata: {
        operationCount: number;
        blockCount: number;
        feeUnits: bigint;
    };
};
type LedgerOptions = {
    initialTrustedAccount?: Account;
    baseToken: TokenAddress;
    networkAddress: NetworkAddress;
};
type OnlyTouchedEffects = Pick<ComputedEffectOfBlocks, 'touched' | 'possibleNewAccounts'>;
export declare function computeEffectOfBlocks(blocks: Block[], ledger?: undefined): OnlyTouchedEffects;
export declare function computeEffectOfBlocks(blocks: Block[], ledger: LedgerOptions): ComputedEffectOfBlocks;
export {};
