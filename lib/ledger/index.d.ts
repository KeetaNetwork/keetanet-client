import { VoteStaple, Vote, VoteBlockHashMap } from '../vote';
import { Block, BlockHash } from '../block';
import type { VoteBlockHash } from '../vote';
import type { GenericAccount, IdentifierAddress, NetworkAddress, TokenAddress } from '../account';
import Account from '../account';
import type Node from '../node';
import type { BloomFilter } from '../utils/bloom';
import type { ComputedEffectOfBlocks } from './effects';
import type { ACLRow, AccountInfo, GetAllBalancesResponse, LedgerStatistics } from './types';
import LedgerRequestCache from './cache';
/**
 * Kind of ledger
 */
export declare enum LedgerKind {
    REPRESENTATIVE = 0,
    ACCOUNT = 1
}
/**
 * Ledger configuration
 */
export interface LedgerConfig {
    initialTrustedAccount: Account;
    network: bigint;
    subnet?: bigint;
    /**
     * Kind of ledger
     */
    kind: LedgerKind;
    /**
     * Private key for the ledger if it is acting as a representative
     */
    privateKey?: Account;
    /**
     * Storage mechanism
     */
    storageDriver: LedgerStorageAPI;
    /**
     * Options to pass to the storage driver
     */
    storageOptions?: any;
    /**
     * Is this ledger in read-only mode ?
     *
     * bootstrap-only: Bootstrapping can still occur
     * read-only: No bootstrapping, no voting
     * read-write: Normal mode (read-write enabled)
     * no-voting: Normal mode (read-write enabled), but no voting
     */
    ledgerWriteMode?: 'bootstrap-only' | 'read-only' | 'read-write' | 'no-voting';
    /**
     * Logging method
     */
    log?: (...args: any[]) => any;
}
/**
 * Which ledger to store this data in
 */
export type LedgerStorage = 'main' | 'side';
/**
 * Which ledger(s) to pull the data from
 */
export type LedgerSelector = LedgerStorage | 'both';
/**
 * A set of votes and a pointer to the next set/page
 */
export type PaginatedVotes = {
    votes: Vote[];
    nextKey?: string;
};
/**
 * Options for "getVotesAfter"
 */
export type GetVotesAfterOptions = {
    /**
     * Limit the page size when requesting votes
     */
    maxVotesPerPage?: number;
    /**
     * Bloom filter to apply to VoteStaples
     */
    bloomFilter?: BloomFilter;
    /**
     * Timeout for fetching votes
     */
    timeout?: number;
};
/**
 * Each Ledger Storage backend must implement this interface
 */
export interface LedgerStorageAPI {
    /**
     * Initialization
     */
    init: (config: LedgerConfig, ledger: Ledger) => void;
    /**
     * Optional destructor
     */
    destroy?: () => Promise<void>;
    /**
     * Begin a transaction
     */
    beginTransaction: (identifier: string, readOnly?: boolean) => Promise<any>;
    /**
     * Commit an active transaction
     */
    commitTransaction: (transaction: any) => Promise<void>;
    /**
     * Abort an active transaction
     */
    abortTransaction: (transaction: any) => Promise<void>;
    /**
     * Evaluate error and return expected error (eg. KeetaNetLedgerError)
     * @param error
     */
    evaluateError: (error: any) => Promise<any>;
    /**
     * Get the amount of delegated weight for an account,
     * if "rep" is not supplied get the total delegated weight
     */
    delegatedWeight: (transaction: any, rep?: Account) => Promise<bigint>;
    /**
     * Get the balance of an account or token
     */
    getBalance: (transaction: any, account: GenericAccount, token: TokenAddress) => Promise<bigint>;
    /**
     * Get all balances on a user account for a token
     */
    getAllBalances: (transaction: any, account: GenericAccount) => Promise<GetAllBalancesResponse>;
    /**
     * Get account information (name, description)
     * If token account, return supply
     * If non user account, returns default permissions
     */
    getAccountInfo: (transaction: any, account: GenericAccount | string) => Promise<AccountInfo>;
    /**
     * List all owners of an account
     */
    listOwners: (transaction: any, identifier: IdentifierAddress, target?: GenericAccount) => Promise<GenericAccount[]>;
    /**
     * List permissions principal has on all provided entity's
     */
    listACLsByPrincipal: (transaction: any, principal: GenericAccount, entityList?: GenericAccount[]) => Promise<ACLRow[]>;
    /**
     * List permissions any principal has on provided entity
     */
    listACLsByEntity: (transaction: any, entity: GenericAccount) => Promise<ACLRow[]>;
    /**
     * Adjust the ledger by performing a set of changes based on some blocks and votes
     */
    adjust: (transaction: any, input: VoteStaple, changes: ComputedEffectOfBlocks) => Promise<BlockHash[]>;
    /**
     * Add a transitional vote (to the side-ledger)
     */
    addPendingVote: (transaction: any, blocksAndVote: VoteStaple) => Promise<void>;
    /**
     * Request a block
     */
    getBlock: (transaction: any, block: BlockHash, from: LedgerSelector) => Promise<Block | null>;
    /**
     * Get the block height from a given block hash
     */
    getBlockHeight: (transaction: any, blockHash: BlockHash, account: GenericAccount) => Promise<{
        blockHeight: string | null;
    } | null>;
    /**
     * Get the votes for a given block
     */
    getVotes: (transaction: any, block: BlockHash, from: LedgerSelector) => Promise<Vote[] | null>;
    /**
     * Get a vote based on the previous hash of a block
     */
    getVotesFromPrevious: (transaction: any, block: BlockHash, from: LedgerSelector) => Promise<Vote[] | null>;
    /**
     * Get multiple votes based on the successors of provided block hashes (both sides)
     */
    getVotesFromMultiplePrevious: (transaction: any, prevBlocks: BlockHash[], from: LedgerSelector, issuer?: Account) => Promise<{
        [hash: string]: Vote[] | null;
    }>;
    /**
     * Get a vote staple from a Vote Block Hash, which uniquely identifies a set of blocks voted on together
     */
    getVoteStaples: (transaction: any, voteBlockHashes: VoteBlockHash[], from: LedgerSelector) => Promise<VoteBlockHashMap<VoteStaple | null>>;
    /**
     * Get the history for a specific account
     */
    getHistory: (transaction: any, account: GenericAccount, start: VoteBlockHash | null, limit?: number) => Promise<VoteBlockHash[]>;
    /**
     * Get multiple head blocks at the same time for a set of accounts
     */
    getHeadBlocks: (transaction: any, accounts: GenericAccount[], from: LedgerSelector) => Promise<{
        [account: string]: Block | null;
    }>;
    /**
     * Get the HEAD block for an account (implemented by LedgerStorageBase using getHeadBlocks())
     */
    getHeadBlock: (transaction: any, account: GenericAccount, from: LedgerSelector) => Promise<Block | null>;
    /**
     * Get a block based on the previous hash of a block
     */
    getBlockFromPrevious: (transaction: any, block: BlockHash, from: LedgerSelector) => Promise<Block | null>;
    /**
     * Get the Account Representative
     */
    getAccountRep: (transaction: any, account: Account | string) => Promise<Account | null>;
    /**
     * Get Votes after a specific moment
     */
    getVotesAfter: (transaction: any, moment: Date, startKey?: string, options?: GetVotesAfterOptions) => Promise<PaginatedVotes>;
    /**
     * Get Vote Staples from a set of block hashes (optional)
     */
    getVoteStaplesFromBlockHash?: (transaction: any, blocks: BlockHash[], from: LedgerSelector) => Promise<VoteStaple[]>;
    /**
     * Get the cache for a transaction (optional)
     */
    cache?: (transaction: any) => LedgerRequestCache | undefined;
    /**
     * Perform Garbage Collection
     */
    gc: (transaction: any) => Promise<boolean>;
    /**
     * Get the next serial number for a representative
     */
    getNextSerialNumber: (transaction?: any) => Promise<bigint>;
    /**
     * Get ledger statistics
     */
    stats: () => Promise<LedgerStatistics>;
}
/**
 * Atomic transactional interface to a storage backend
 */
declare class LedgerAtomicInterface {
    #private;
    constructor(transaction: any, storage: LedgerStorageAPI, config: LedgerConfig, ledger: Ledger);
    commit(): Promise<void>;
    abort(): Promise<void>;
    vote(blocks: Block[], otherVotes?: Vote[]): Promise<Vote>;
    add(votesAndBlocks: VoteStaple, from?: 'bootstrap' | string): Promise<BlockHash[]>;
    getBalance(account: GenericAccount, token: TokenAddress): Promise<bigint>;
    getAllBalances(account: GenericAccount): Promise<GetAllBalancesResponse>;
    listACLsByPrincipal(principal: GenericAccount, entityList?: GenericAccount[]): Promise<ACLRow[]>;
    listACLsByEntity(entity: GenericAccount): Promise<ACLRow[]>;
    votingPower(rep?: Account): Promise<bigint>;
    getVotes(block: BlockHash, from?: LedgerStorage): Promise<Vote[] | null>;
    getVotesFromMultiplePrevious(prevBlocks: BlockHash[], from?: LedgerSelector, issuer?: Account): Promise<{
        [hash: string]: Vote[] | null;
    }>;
    getBlockFromPrevious(block: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getHeadBlocks(accounts: GenericAccount[], from: LedgerSelector): Promise<{
        [account: string]: Block | null;
    }>;
    getHeadBlock(account: GenericAccount, from: LedgerSelector): Promise<Block | null>;
    getAccountRep(account: Account | string): Promise<Account | null>;
    getAccountInfo(account: GenericAccount | string): Promise<AccountInfo>;
    getBlock(blockhash: BlockHash, from?: LedgerSelector): Promise<Block | null>;
    getVoteStaple(stapleBlockHash: VoteBlockHash, from?: LedgerSelector): Promise<VoteStaple | null>;
    getVoteStaples(stapleBlockHashes: VoteBlockHash[], from?: LedgerSelector): Promise<VoteBlockHashMap<VoteStaple | null>>;
    getHistory(account: GenericAccount, start: VoteBlockHash | null, limit?: number): Promise<VoteStaple[]>;
    getStaplesFromBlockHashes(hashes: BlockHash[]): Promise<VoteStaple[]>;
    getVoteStaplesAfter(moment: Date, limit?: number, options?: GetVotesAfterOptions): Promise<VoteStaple[]>;
    gc(): Promise<boolean>;
    _testingRunStorageFunction<T>(code: (storage: LedgerStorageAPI, transaction: any) => Promise<T>): Promise<T>;
}
/**
 * The core Ledger components
 */
export declare class Ledger implements Omit<LedgerAtomicInterface, 'commit' | 'abort'> {
    #private;
    static Kind: typeof LedgerKind;
    readonly baseToken: TokenAddress;
    readonly networkAddress: NetworkAddress;
    readonly initialTrustedAccount: Account;
    readonly node?: Node;
    static isInstance: (obj: any, strict?: boolean) => obj is Ledger;
    constructor(config: LedgerConfig, node?: Node, existingStorage?: LedgerStorageAPI);
    get ledgerWriteMode(): NonNullable<LedgerConfig['ledgerWriteMode']>;
    copy(newNode: Node): Ledger;
    /**
     * Execute some code with a transaction held, if the code fails the
     * transaction is aborted, otherwise it is committed
     *
     * @param code - Code to run
     * @returns The return value from "code"
     */
    run<T>(identifier: string, code: (transaction: LedgerAtomicInterface) => Promise<T>, readOnly?: boolean): Promise<T>;
    runReadOnly<T>(identifier: string, code: (transaction: LedgerAtomicInterface) => Promise<T>): ReturnType<typeof code>;
    beginTransaction(identifier: string, readOnly?: boolean): Promise<LedgerAtomicInterface>;
    vote(...args: Parameters<LedgerAtomicInterface['vote']>): ReturnType<LedgerAtomicInterface['vote']>;
    add(...args: Parameters<LedgerAtomicInterface['add']>): ReturnType<LedgerAtomicInterface['add']>;
    listACLsByPrincipal(...args: Parameters<LedgerAtomicInterface['listACLsByPrincipal']>): ReturnType<LedgerAtomicInterface['listACLsByPrincipal']>;
    listACLsByEntity(...args: Parameters<LedgerAtomicInterface['listACLsByEntity']>): ReturnType<LedgerAtomicInterface['listACLsByEntity']>;
    getBalance(...args: Parameters<LedgerAtomicInterface['getBalance']>): ReturnType<LedgerAtomicInterface['getBalance']>;
    getAllBalances(...args: Parameters<LedgerAtomicInterface['getAllBalances']>): ReturnType<LedgerAtomicInterface['getAllBalances']>;
    votingPower(...args: Parameters<LedgerAtomicInterface['votingPower']>): ReturnType<LedgerAtomicInterface['votingPower']>;
    getVotes(...args: Parameters<LedgerAtomicInterface['getVotes']>): ReturnType<LedgerAtomicInterface['getVotes']>;
    getVotesFromMultiplePrevious(...args: Parameters<LedgerAtomicInterface['getVotesFromMultiplePrevious']>): ReturnType<LedgerAtomicInterface['getVotesFromMultiplePrevious']>;
    getBlockFromPrevious(...args: Parameters<LedgerAtomicInterface['getBlockFromPrevious']>): ReturnType<LedgerAtomicInterface['getBlockFromPrevious']>;
    getHeadBlocks(...args: Parameters<LedgerAtomicInterface['getHeadBlocks']>): ReturnType<LedgerAtomicInterface['getHeadBlocks']>;
    getHeadBlock(...args: Parameters<LedgerAtomicInterface['getHeadBlock']>): ReturnType<LedgerAtomicInterface['getHeadBlock']>;
    getAccountRep(...args: Parameters<LedgerAtomicInterface['getAccountRep']>): ReturnType<LedgerAtomicInterface['getAccountRep']>;
    getAccountInfo(...args: Parameters<LedgerAtomicInterface['getAccountInfo']>): ReturnType<LedgerAtomicInterface['getAccountInfo']>;
    getBlock(...args: Parameters<LedgerAtomicInterface['getBlock']>): ReturnType<LedgerAtomicInterface['getBlock']>;
    getVoteStaple(...args: Parameters<LedgerAtomicInterface['getVoteStaple']>): ReturnType<LedgerAtomicInterface['getVoteStaple']>;
    getVoteStaples(...args: Parameters<LedgerAtomicInterface['getVoteStaples']>): ReturnType<LedgerAtomicInterface['getVoteStaples']>;
    getHistory(...args: Parameters<LedgerAtomicInterface['getHistory']>): ReturnType<LedgerAtomicInterface['getHistory']>;
    getStaplesFromBlockHashes(...args: Parameters<LedgerAtomicInterface['getStaplesFromBlockHashes']>): ReturnType<LedgerAtomicInterface['getStaplesFromBlockHashes']>;
    getVoteStaplesAfter(...args: Parameters<LedgerAtomicInterface['getVoteStaplesAfter']>): ReturnType<LedgerAtomicInterface['getVoteStaplesAfter']>;
    gc(...args: Parameters<LedgerAtomicInterface['gc']>): ReturnType<LedgerAtomicInterface['gc']>;
    stats(): Promise<LedgerStatistics>;
    _testingRunStorageFunction<T>(code: (storage: LedgerStorageAPI, transaction: any) => Promise<T>): Promise<T>;
}
export default Ledger;
