import type { VoteStaple } from '../vote';
import type Vote from '../vote';
import type { GenericAccount, TokenAddress } from '../account';
import Account from '../account';
import { Block, BlockHash } from '../block';
import type { LedgerConfig, LedgerSelector, LedgerStorage, LedgerStorageAPI } from '.';
import type { AccountInfo, ACLRow, ACLEntry, ACLUpdate } from './types';
import type Node from '../node';
import type Stats from '../stats';
import type { BaseSet, ExternalSet } from '../permissions';
import type { ComputedEffectOfBlocksByAccount } from './effects';
interface NumericEffect {
    change: bigint;
    starting?: bigint;
    fellNegative?: boolean;
    final?: bigint;
}
interface NumericEffectFinal extends NumericEffect {
    final: bigint;
}
interface BalanceNumericEffect extends NumericEffect {
    fellNegative?: boolean;
    lowestChange: bigint;
    receiveValidated?: boolean;
}
interface BalanceNumericEffectFinal extends BalanceNumericEffect {
    final: bigint;
    fellNegative: boolean;
    starting: bigint;
}
type IfTrue<B, V, E = {
    [key: string]: never;
}> = B extends true ? V : E;
type BalanceEffect<T extends boolean> = IfTrue<T, BalanceNumericEffectFinal, BalanceNumericEffect>;
type CompNumericEffect<T extends boolean> = IfTrue<T, NumericEffectFinal, NumericEffect>;
type PerAccount<T> = {
    [pubKey: string]: T;
};
type NumericEffectPerAccount<T extends boolean> = PerAccount<CompNumericEffect<T>>;
type BalanceChanges<T extends boolean> = PerAccount<PerAccount<BalanceEffect<T>>>;
type computeLedgerEffectStorageProvider = Pick<LedgerStorageAPI, 'getAccountInfo' | 'getBalance' | 'listACLsByPrincipal' | 'delegatedWeight' | 'getAccountRep'>;
type BalanceSupplyChangeRespBase<T extends boolean> = {
    balances: BalanceChanges<T>;
    supplies: NumericEffectPerAccount<T>;
};
type BalanceSupplyChangeResp<T extends boolean, P extends boolean, W extends boolean> = BalanceSupplyChangeRespBase<T> & IfTrue<P, {
    permissions: ACLUpdate[];
}> & IfTrue<W, {
    weights: NumericEffectPerAccount<T>;
}>;
export declare function findPermissionMatch(lookingFor: Pick<ACLEntry, 'entity' | 'principal' | 'target'>, entries: ACLRow[]): ACLRow | undefined;
interface ComputeLedgerEffectOptions<T extends boolean, P extends boolean, W extends boolean> {
    getFinalNumericValues?: T;
    computePermissions?: P;
    computeWeights?: W;
    checkRangeConstraints?: boolean;
    baseToken: TokenAddress;
}
export declare function validateSupply(amount: bigint, network: bigint): void;
export declare function validateBlockSignerCount(amount: bigint, network: bigint): void;
export declare function validateBlockSignerDepth(depth: bigint, network: bigint): void;
/**
 * Compute effects on the ledger from block effects
 */
export declare function computeLedgerEffect<T extends boolean, P extends boolean, W extends boolean>(options: ComputeLedgerEffectOptions<T, P, W>, effects: ComputedEffectOfBlocksByAccount, storageProvider: computeLedgerEffectStorageProvider, network: bigint, transaction?: any): Promise<BalanceSupplyChangeResp<T, P, W>>;
/**
 * A partial LedgerStorageAPI which just has the methods for "addTimeStatistics"
 */
type LedgerStorageAPILike = Pick<LedgerStorageAPI, 'getVotes'>;
/**
 * An individual update to statistics
 */
type StatsIncreaseRequest = Parameters<Stats['incr']>;
/**
 * Common method for adding a timing data point during processing of a
 * Vote Staple to a Node Stats
 *
 * @param node - A running node
 * @param blocks - Blocks being processed
 * @param to - Ledger being processed
 * @param storageProvider - storage provider that includes getVotes function
 * @param transaction - Current transaction (if any)
 * @param skipPush - Instead of adding to stats immediately, just return what would be added
 * @returns What was added (or would be added, if skipPush is set to true)
 */
export declare function addTimeStatistic(node: Node | undefined, blocks: Block[], to: LedgerStorage, storageProvider: LedgerStorageAPILike, transaction?: any, skipPush?: boolean): Promise<StatsIncreaseRequest[]>;
type AccountInfoUnparsedRow = {
    name?: string;
    description?: string;
    metadata?: string;
    supply?: bigint | string;
    multisigQuorum?: bigint | string;
    defaultBasePermission?: string | bigint | BaseSet;
    defaultExternalPermission?: string | bigint | ExternalSet;
};
export declare abstract class LedgerStorageBase {
    #private;
    protected config: LedgerConfig | null;
    constructor();
    protected abstract adjustDefer(transaction: any, input: VoteStaple): Promise<void>;
    abstract getBlockHeight(transaction: any, blockHash: BlockHash, account: GenericAccount): Promise<bigint | null>;
    getBlockHeights(transaction: any, toFetch: {
        blockHash: BlockHash;
        account: GenericAccount;
    }[]): Promise<{
        [blockHash: string]: bigint | null;
    }>;
    getAccountsBlockHeightInfo(transaction: any, toFetch: {
        account: GenericAccount;
        blockHash?: BlockHash;
    }[]): Promise<{
        [account: string]: {
            blockHash: BlockHash;
            height: bigint | null;
        } | null;
    }>;
    abstract getHeadBlocks(transaction: any, accounts: GenericAccount[], from: LedgerSelector): Promise<{
        [account: string]: Block | null;
    }>;
    getHeadBlockHashes(transaction: any, accounts: InstanceType<typeof Account.Set>): Promise<{
        [account: string]: BlockHash | null;
    }>;
    abstract getVotesFromMultiplePrevious(transaction: any, prevBlocks: BlockHash[], from: LedgerSelector, issuer?: Account): Promise<{
        [hash: string]: Vote[] | null;
    }>;
    preAdjust(input: VoteStaple, mayDefer?: boolean, transaction?: any): Promise<{
        [hash: string]: bigint;
    }>;
    _formatAccountInfoFromRow(account: GenericAccount, row?: AccountInfoUnparsedRow | undefined): AccountInfo;
    _validateAccountInfoKeys(account: GenericAccount, info: Partial<AccountInfo>): void;
    /**
     * @param moment - The date to use as the base for the timestamp.
     * @param momentBits - The number of bits to use for the timestamp
     * @param totalLength - The total length of the generated number in bits
     * @param randomData - A hexadecimal string to use as the random data.
     * @param timestampFuzzMS - The number of milliseconds to fuzz the timestamp by, defaults to 1n (precise).
     * @param optimistic - If true, the timestamp will be incremented by 1 quanta, defaults to false.
     * @returns A bigint representing the noisy timestamp.
     */
    _generateNoisyTimestamp(moment: Date, momentBits: bigint, totalLength: bigint, randomData: Buffer, timestampFuzzMS?: number | bigint, optimistic?: boolean): bigint;
    getHeadBlock(transaction: any, account: GenericAccount, from: LedgerSelector): Promise<Block | null>;
    getVotesFromPrevious(transaction: any, prevBlock: BlockHash, from: LedgerSelector, issuer?: Account): Promise<Vote[] | null>;
    protected abstract gcBatch(transaction: any): Promise<boolean>;
    gc(transaction: any, timeLimitMS?: number): Promise<boolean>;
}
export declare function assertLedgerStorage(value: string): LedgerStorage;
export {};
