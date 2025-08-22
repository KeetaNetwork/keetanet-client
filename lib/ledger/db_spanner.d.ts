import { Vote, VoteStaple } from '../vote';
import type { Block } from '../block';
import { BlockHash } from '../block';
import type { VoteBlockHash, VoteBlockHashMap } from '../vote';
import type { GenericAccount, IdentifierAddress, TokenAddress } from '../account';
import Account from '../account';
import type { Ledger, LedgerConfig, LedgerStorageAPI, LedgerSelector, PaginatedVotes, GetVotesAfterOptions, LedgerStorageTransactionBaseOptions } from '../ledger';
import { LedgerStorageTransactionBase } from '../ledger';
import type { AccountInfo, ACLRow, GetAllBalancesResponse, LedgerStatistics, CertificateWithIntermediates } from './types';
import type { KVStorageProviderAPI } from '../kv';
import { LedgerStorageBase } from './common';
import type { Database as GoogleSpannerDatabase } from '@google-cloud/spanner';
import type { TableColumn, FilteredResponseRow, IndexName, TableName, QueryRow as HelperQueryRow, QueryRows } from './db_spanner_helper';
import type { ComputedEffectOfBlocks } from './effects';
import type { CertificateHash } from '../utils/certificate';
type QueryRow<T extends TableName> = HelperQueryRow<T> | QueryRows<T>;
type ReadOptions = {
    limit?: number;
    skipLocalRead?: boolean;
    all?: boolean;
    range?: boolean;
};
interface ReadQueryWithOptions<T extends TableName> extends ReadOptions {
    query: QueryRow<T>;
}
type ReadRequest<T extends TableName> = QueryRow<T> | ReadQueryWithOptions<T>;
type SpannerReadResponse<T extends TableName, C extends TableColumn<T>[]> = {
    count: number;
    rows: FilteredResponseRow<T, C>[];
    moment: Date;
};
interface SpannerTransactionOptions {
    strongRead?: boolean;
}
export declare class SpannerTransaction extends LedgerStorageTransactionBase {
    #private;
    readonly options: SpannerTransactionOptions;
    constructor(database: GoogleSpannerDatabase, options: SpannerTransactionOptions, transactionBase: LedgerStorageTransactionBaseOptions);
    evaluateError(error: any): any;
    beginTransaction(identifier: string, strongRead?: boolean): Promise<void>;
    endTransaction(mode: 'COMMIT' | 'ROLLBACK'): Promise<void>;
    insert<T extends TableName, R extends QueryRow<T>>(table: T, query: R): void;
    upsert<T extends TableName, R extends QueryRow<T>>(table: T, query: R): void;
    delete<T extends TableName, R extends QueryRow<T>>(table: T, query: R): void;
    read<T extends TableName, I extends IndexName | undefined, C extends TableColumn<T>[], X extends ReadRequest<T>>(table: T, index: I, columns: C, request: X): Promise<SpannerReadResponse<T, C>>;
}
/**
 * Ledger Configuration for Google Spanner
 */
export type SpannerConfig = {
    projectId: string;
    instanceId: string;
    databaseId: string;
    kv: KVStorageProviderAPI;
    strongRead?: boolean;
};
/**
 * Ledger Storage for Google Spanner
 */
export declare class DBSpanner extends LedgerStorageBase implements LedgerStorageAPI {
    #private;
    constructor();
    init(config: LedgerConfig, ledger: Ledger): void;
    destroy(): Promise<void>;
    beginTransaction(transactionBase: LedgerStorageTransactionBaseOptions): Promise<SpannerTransaction>;
    commitTransaction(transaction: SpannerTransaction): Promise<void>;
    abortTransaction(transaction: SpannerTransaction): Promise<void>;
    evaluateError(error: any): Promise<any>;
    delegatedWeight(transaction: SpannerTransaction, rep?: Account | InstanceType<typeof Account.Set>): Promise<bigint>;
    getBalance(transaction: SpannerTransaction, account: GenericAccount | string, token: TokenAddress | string): Promise<bigint>;
    getAllBalances(transaction: SpannerTransaction, account: GenericAccount): Promise<GetAllBalancesResponse>;
    addPendingVote(transaction: SpannerTransaction, votesAndBlocks: VoteStaple): Promise<void>;
    getAccountRep(transaction: SpannerTransaction, userAccount: Account | string): Promise<Account | null>;
    /**
     * If an adjustment cannot be made right now, defer it for follow-up
     */
    protected adjustDefer(transaction: SpannerTransaction, input: VoteStaple): Promise<void>;
    adjust(transaction: SpannerTransaction, input: VoteStaple, changes: ComputedEffectOfBlocks, mayDefer?: boolean, completedStaples?: Set<string>): Promise<VoteStaple[]>;
    getBlock(transaction: SpannerTransaction, blockHash: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getBlockHeights(transaction: any, toFetch: {
        blockHash: BlockHash;
        account: GenericAccount;
    }[]): Promise<{
        [blockHash: string]: bigint | null;
    }>;
    getBlockHeight(transaction: SpannerTransaction, blockHash: BlockHash, account: GenericAccount): Promise<bigint | null>;
    getVotes(transaction: SpannerTransaction, blockHash: BlockHash, from: LedgerSelector): Promise<Vote[] | null>;
    getVoteStaples(transaction: SpannerTransaction, stapleBlockHashes: VoteBlockHash[], from?: LedgerSelector): Promise<VoteBlockHashMap<VoteStaple | null>>;
    getHistory(transaction: SpannerTransaction, account: GenericAccount | null, start: VoteBlockHash | null, limit?: number): Promise<VoteBlockHash[]>;
    getBlockFromPrevious(transaction: SpannerTransaction, prevBlock: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getVotesFromMultiplePrevious(transaction: SpannerTransaction, prevBlocks: BlockHash[], from: LedgerSelector, issuer?: Account): Promise<{
        [hash: string]: Vote[] | null;
    }>;
    getHeadBlockHashes(transaction: any, accounts: InstanceType<typeof Account.Set>): Promise<{
        [account: string]: BlockHash | null;
    }>;
    getHeadBlocks(transaction: SpannerTransaction, accounts: GenericAccount[], from: LedgerSelector): Promise<{
        [publicKey: string]: Block | null;
    }>;
    getAccountInfo(transaction: SpannerTransaction, account: GenericAccount | string): Promise<AccountInfo>;
    listOwners(transaction: SpannerTransaction, entity: IdentifierAddress): Promise<GenericAccount[]>;
    listACLsByEntity(transaction: SpannerTransaction, entity: GenericAccount): Promise<ACLRow[]>;
    listACLsByPrincipal(transaction: SpannerTransaction, principal: GenericAccount, entityList?: GenericAccount[]): Promise<ACLRow[]>;
    getVoteStaplesFromBlockHash(transaction: SpannerTransaction, blocks: BlockHash[], from: LedgerSelector): Promise<VoteStaple[]>;
    getVotesAfter(transaction: SpannerTransaction, moment: Date, startKey?: string, options?: GetVotesAfterOptions): Promise<PaginatedVotes>;
    protected gcBatch(transaction: SpannerTransaction): Promise<boolean>;
    getNextSerialNumber(): Promise<bigint>;
    getAccountCertificates(transaction: SpannerTransaction, account: GenericAccount): Promise<CertificateWithIntermediates[]>;
    getAccountCertificateByHash(transaction: SpannerTransaction, account: GenericAccount, certificateHash: CertificateHash): Promise<CertificateWithIntermediates | null>;
    stats(): Promise<LedgerStatistics>;
}
export declare const Testing: {
    /**
     * Create a new Spanner Instance (if first call), new Spanner Database, and all the tables needed to use this ledger
     */
    createDatabase: (config: SpannerConfig, createInstance: boolean) => Promise<GoogleSpannerDatabase>;
    /**
     * Clean-up a Spanner Database (and if deleteInstance) delete the Spanner Instance
     */
    deleteDatabase: (config: SpannerConfig, deleteInstance: boolean, database: GoogleSpannerDatabase) => Promise<void>;
};
export default DBSpanner;
