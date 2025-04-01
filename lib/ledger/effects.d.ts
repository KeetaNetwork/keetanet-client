import type { GenericAccount, IdentifierAddress, NetworkAddress, TokenAddress } from '../account';
import Account from '../account';
import type { BlockHash } from '../block';
import { Block } from '../block';
import type { AccountInfo, ACLEntry, ACLUpdate } from '../ledger/types';
import type { InstanceSet } from '../utils/helper';
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
type TokenEntry = ModifyTokenBalanceEntry | RequestTokenReceiveEntry;
interface ComputedBlocksEffectTokenChangesField {
    [tokenPubKey: string]: TokenEntry[];
}
/**
 * Which fields may be affected by blocks
 */
type CreateIdentifierRequest = {
    previousBlockHash: BlockHash;
    requestedIdentifier: IdentifierAddress;
    operationIndex: number;
    account: GenericAccount;
};
type DelegationUpdate = {
    delegateTo: Account;
};
interface ComputedBlocksEffectFields {
    balance?: ComputedBlocksEffectTokenChangesField;
    supply?: NumericValueEntry[];
    info?: AccountInfo;
    permissions?: ACLUpdate[];
    permissionRequirements?: ACLEntry[];
    createRequests?: CreateIdentifierRequest[];
    delegation?: DelegationUpdate;
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
    touched: InstanceSet<GenericAccount>;
    metadata: {
        operationCount: number;
        blockCount: number;
    };
};
type LedgerOptions = {
    initialTrustedAccount?: Account;
    baseToken: TokenAddress;
    networkAddress: NetworkAddress;
};
type OnlyTouchedEffects = Pick<ComputedEffectOfBlocks, 'touched'>;
export declare function computeEffectOfBlocks(blocks: Block[], ledger?: undefined): OnlyTouchedEffects;
export declare function computeEffectOfBlocks(blocks: Block[], ledger: LedgerOptions): ComputedEffectOfBlocks;
export {};
