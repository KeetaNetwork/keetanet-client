import { VoteStaple, Vote, VoteBlockHashMap } from '../vote';
import { Block, BlockHash } from '../block';
import type { FeeAmountAndToken, VoteBlockHash, VoteQuote } from '../vote';
import type { GenericAccount, IdentifierAddress, NetworkAddress, StorageAddress, TokenAddress } from '../account';
import Account from '../account';
import type Node from '../node';
import type { BloomFilter } from '../utils/bloom';
import type { ComputedEffectOfBlocks } from './effects';
import type { ACLRow, AccountInfo, GetAllBalancesResponse, LedgerStatistics, CertificateWithIntermediates } from './types';
import LedgerRequestCache from './cache';
import type { CertificateHash } from '../utils/certificate';
import { StatsPending } from '../stats';
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
     * Provided function to compute fees for a given set of Blocks and computed effects
     */
    computeFeeFromBlocks: (ledger: Ledger, blocks: Block[], effects: ComputedEffectOfBlocks) => FeeAmountAndToken | null;
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
     * Timeout for storage operations
     */
    transactionRetries?: ({
        timeout?: number;
        maxRetries?: never;
    } | {
        timeout?: never;
        maxRetries?: number;
    });
    /**
     * Logging method
     */
    log?: (...args: any[]) => any;
    /**
     * Operation specific parameters
     */
    operations?: {
        setRep?: (account: GenericAccount, rep: Account | null) => Promise<boolean>;
        enableTokenAdminModifyBalance?: boolean;
    };
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
 * Each transaction can contain the node object making the request to access things like timing information
 */
export interface LedgerStorageTransactionBaseOptions {
    node?: Node;
    moment?: Date;
    identifier: string;
    readOnly?: boolean;
}
export declare class LedgerStorageTransactionBase implements LedgerStorageTransactionBaseOptions {
    node?: Node;
    moment: Date;
    identifier: string;
    readOnly: boolean;
    statsPending: StatsPending;
    constructor(options: LedgerStorageTransactionBaseOptions);
}
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
    beginTransaction: (transactionBase: LedgerStorageTransactionBaseOptions) => Promise<LedgerStorageTransactionBase>;
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
     * if "rep" is not supplied get the total delegated weight, if "rep" is of type Account.Set, return the sum of the weights for the provided account(s)
     */
    delegatedWeight: (transaction: any, rep?: Account | InstanceType<typeof Account.Set>) => Promise<bigint>;
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
    adjust: (transaction: any, input: VoteStaple, changes: ComputedEffectOfBlocks) => Promise<VoteStaple[]>;
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
    getBlockHeight: (transaction: any, blockHash: BlockHash, account: GenericAccount) => Promise<bigint | null>;
    /**
     * Get multiple block heights for a given set of block hashes and chains.
     */
    getBlockHeights: (transaction: any, toFetch: {
        blockHash: BlockHash;
        account: GenericAccount;
    }[]) => Promise<{
        [blockHash: string]: bigint | null;
    }>;
    /**
     * Get multiple block hashes and heights for a given set of chains and optional block hashes.
     * If no block hash is provided it returns the head block of the chain
     */
    getAccountsBlockHeightInfo: (transaction: any, toFetch: {
        account: GenericAccount;
        blockHash?: BlockHash;
    }[]) => Promise<{
        [account: string]: {
            blockHash: BlockHash;
            height: bigint | null;
        } | null;
    }>;
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
     * Get the history for a specific account or all accounts if account is null
     */
    getHistory: (transaction: any, account: GenericAccount | null, start: VoteBlockHash | null, limit?: number) => Promise<VoteBlockHash[]>;
    /**
     * Get multiple head blocks at the same time for a set of accounts
     */
    getHeadBlocks: (transaction: any, accounts: GenericAccount[], from: LedgerSelector) => Promise<{
        [account: string]: Block | null;
    }>;
    /**
     * Get multiple head block hashes at the same time for a set of accounts
     */
    getHeadBlockHashes: (transaction: any, accounts: InstanceType<typeof Account.Set>) => Promise<{
        [account: string]: BlockHash | null;
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
    gc: (transaction: any, timeLimitMS?: number) => Promise<boolean>;
    /**
     * Get the next serial number for a representative
     */
    getNextSerialNumber: (transaction?: any) => Promise<bigint>;
    /**
     * Get the X.509 Certificates associated with an account
     */
    getAccountCertificates: (transaction: any, account: GenericAccount) => Promise<CertificateWithIntermediates[]>;
    /**
     * Get the X.509 Certificate associated with an account using the certificate hash
     */
    getAccountCertificateByHash: (transaction: any, account: GenericAccount, hash: CertificateHash) => Promise<CertificateWithIntermediates | null>;
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
    constructor(transaction: LedgerStorageTransactionBase, storage: LedgerStorageAPI, config: LedgerConfig, ledger: Ledger);
    commit(): Promise<void>;
    abort(): Promise<void>;
    vote(blocks: Block[], otherVotes?: Vote[], quote?: VoteQuote): Promise<Vote>;
    quote(blocks: Block[]): Promise<VoteQuote>;
    add(votesAndBlocks: VoteStaple, from?: 'bootstrap' | string): Promise<VoteStaple[]>;
    getBalance(account: GenericAccount, token: TokenAddress): Promise<bigint>;
    getAllBalances(account: GenericAccount): Promise<GetAllBalancesResponse>;
    getAccountCertificates(account: GenericAccount): Promise<CertificateWithIntermediates[]>;
    getAccountCertificateByHash(account: GenericAccount, hash: CertificateHash): Promise<CertificateWithIntermediates | null>;
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
    getAccountsBlockHeightInfo(toFetch: {
        account: GenericAccount;
        blockHash?: BlockHash;
    }[]): Promise<{
        [account: string]: {
            blockHash: BlockHash;
            height: bigint | null;
        } | null;
    }>;
    getVoteStaple(stapleBlockHash: VoteBlockHash, from?: LedgerSelector): Promise<VoteStaple | null>;
    getVoteStaples(stapleBlockHashes: VoteBlockHash[], from?: LedgerSelector): Promise<VoteBlockHashMap<VoteStaple | null>>;
    getHistory(account: GenericAccount | null, start: VoteBlockHash | null, limit?: number): Promise<VoteStaple[]>;
    getStaplesFromBlockHashes(hashes: BlockHash[]): Promise<VoteStaple[]>;
    getVoteStaplesAfter(moment: Date, limit?: number, options?: GetVotesAfterOptions): Promise<VoteStaple[]>;
    gc(timeLimitMS?: number): Promise<boolean>;
    getFee(blocks: Block[], effectsInput?: ComputedEffectOfBlocks): Promise<FeeAmountAndToken | null>;
    _testingRunStorageFunction<T>(code: (storage: LedgerStorageAPI, transaction: LedgerStorageTransactionBase) => Promise<T>): Promise<T>;
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
    getFeePayToAndToken(accounts?: (Account | StorageAddress)[], token?: TokenAddress): Partial<FeeAmountAndToken>;
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
    quote(...args: Parameters<LedgerAtomicInterface['quote']>): ReturnType<LedgerAtomicInterface['quote']>;
    add(...args: Parameters<LedgerAtomicInterface['add']>): ReturnType<LedgerAtomicInterface['add']>;
    listACLsByPrincipal(...args: Parameters<LedgerAtomicInterface['listACLsByPrincipal']>): ReturnType<LedgerAtomicInterface['listACLsByPrincipal']>;
    listACLsByEntity(...args: Parameters<LedgerAtomicInterface['listACLsByEntity']>): ReturnType<LedgerAtomicInterface['listACLsByEntity']>;
    getBalance(...args: Parameters<LedgerAtomicInterface['getBalance']>): ReturnType<LedgerAtomicInterface['getBalance']>;
    getAllBalances(...args: Parameters<LedgerAtomicInterface['getAllBalances']>): ReturnType<LedgerAtomicInterface['getAllBalances']>;
    getAccountCertificates(...args: Parameters<LedgerAtomicInterface['getAccountCertificates']>): ReturnType<LedgerAtomicInterface['getAccountCertificates']>;
    getAccountCertificateByHash(...args: Parameters<LedgerAtomicInterface['getAccountCertificateByHash']>): ReturnType<LedgerAtomicInterface['getAccountCertificateByHash']>;
    votingPower(...args: Parameters<LedgerAtomicInterface['votingPower']>): ReturnType<LedgerAtomicInterface['votingPower']>;
    getVotes(...args: Parameters<LedgerAtomicInterface['getVotes']>): ReturnType<LedgerAtomicInterface['getVotes']>;
    getVotesFromMultiplePrevious(...args: Parameters<LedgerAtomicInterface['getVotesFromMultiplePrevious']>): ReturnType<LedgerAtomicInterface['getVotesFromMultiplePrevious']>;
    getBlockFromPrevious(...args: Parameters<LedgerAtomicInterface['getBlockFromPrevious']>): ReturnType<LedgerAtomicInterface['getBlockFromPrevious']>;
    getHeadBlocks(...args: Parameters<LedgerAtomicInterface['getHeadBlocks']>): ReturnType<LedgerAtomicInterface['getHeadBlocks']>;
    getHeadBlock(...args: Parameters<LedgerAtomicInterface['getHeadBlock']>): ReturnType<LedgerAtomicInterface['getHeadBlock']>;
    getAccountRep(...args: Parameters<LedgerAtomicInterface['getAccountRep']>): ReturnType<LedgerAtomicInterface['getAccountRep']>;
    getAccountInfo(...args: Parameters<LedgerAtomicInterface['getAccountInfo']>): ReturnType<LedgerAtomicInterface['getAccountInfo']>;
    getBlock(...args: Parameters<LedgerAtomicInterface['getBlock']>): ReturnType<LedgerAtomicInterface['getBlock']>;
    getAccountsBlockHeightInfo(...args: Parameters<LedgerAtomicInterface['getAccountsBlockHeightInfo']>): ReturnType<LedgerAtomicInterface['getAccountsBlockHeightInfo']>;
    getVoteStaple(...args: Parameters<LedgerAtomicInterface['getVoteStaple']>): ReturnType<LedgerAtomicInterface['getVoteStaple']>;
    getVoteStaples(...args: Parameters<LedgerAtomicInterface['getVoteStaples']>): ReturnType<LedgerAtomicInterface['getVoteStaples']>;
    getHistory(...args: Parameters<LedgerAtomicInterface['getHistory']>): ReturnType<LedgerAtomicInterface['getHistory']>;
    getStaplesFromBlockHashes(...args: Parameters<LedgerAtomicInterface['getStaplesFromBlockHashes']>): ReturnType<LedgerAtomicInterface['getStaplesFromBlockHashes']>;
    getVoteStaplesAfter(...args: Parameters<LedgerAtomicInterface['getVoteStaplesAfter']>): ReturnType<LedgerAtomicInterface['getVoteStaplesAfter']>;
    gc(...args: Parameters<LedgerAtomicInterface['gc']>): ReturnType<LedgerAtomicInterface['gc']>;
    getFee(...args: Parameters<LedgerAtomicInterface['getFee']>): ReturnType<LedgerAtomicInterface['getFee']>;
    stats(): Promise<LedgerStatistics>;
    _testingRunStorageFunction<T>(code: (storage: LedgerStorageAPI, transaction: LedgerStorageTransactionBase) => Promise<T>): Promise<T>;
}
export default Ledger;
