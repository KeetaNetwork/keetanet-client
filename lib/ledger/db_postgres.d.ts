import { VoteStaple, Vote } from '../vote';
import { Block, BlockHash } from '../block';
import type { VoteBlockHash, VoteBlockHashMap } from '../vote';
import type { GenericAccount, IdentifierAddress, TokenAddress } from '../account';
import Account, { AccountKeyAlgorithm } from '../account';
import type { Ledger, LedgerConfig, LedgerStorageAPI, LedgerSelector, PaginatedVotes, GetVotesAfterOptions, LedgerStorageTransactionBaseOptions } from '../ledger';
import { LedgerStorageTransactionBase } from '../ledger';
import type { AccountInfo, ACLRow, GetAllBalancesResponse, LedgerStatistics, CertificateWithIntermediates } from './types';
import { LedgerStorageBase } from './common';
import type { PoolClient as PostgresPoolClient } from 'pg';
import { Pool as PostgresPool } from 'pg';
import type { ComputedEffectOfBlocks } from './effects';
import LedgerRequestCache from './cache';
import type { CertificateHash } from '../utils/certificate';
declare class PostgresTransaction extends LedgerStorageTransactionBase {
    client: PostgresPoolClient;
    cache: LedgerRequestCache;
    constructor(transactionBase: LedgerStorageTransactionBaseOptions, db: PostgresPoolClient);
}
interface PostgresSelectOptions {
    forUpdate?: boolean;
}
export type PostgresConfig = NonNullable<ConstructorParameters<typeof PostgresPool>[0]>;
export declare class DBPostgres extends LedgerStorageBase implements LedgerStorageAPI {
    #private;
    constructor();
    init(config: LedgerConfig, ledger: Ledger): void;
    destroy(): Promise<void>;
    beginTransaction(transactionBase: LedgerStorageTransactionBaseOptions): Promise<PostgresTransaction>;
    commitTransaction(transaction: PostgresTransaction): Promise<void>;
    abortTransaction(transaction: PostgresTransaction): Promise<void>;
    cache(transaction: PostgresTransaction): LedgerRequestCache;
    evaluateError(error: any): Promise<any>;
    delegatedWeight(transaction: PostgresTransaction, rep?: Account | InstanceType<typeof Account.Set>, options?: PostgresSelectOptions): Promise<bigint>;
    getBalance(transaction: PostgresTransaction, account: GenericAccount, token: TokenAddress, options?: PostgresSelectOptions): Promise<bigint>;
    getAllBalances(transaction: PostgresTransaction, account: GenericAccount): Promise<GetAllBalancesResponse>;
    addPendingVote(transaction: PostgresTransaction, votesAndBlocks: VoteStaple): Promise<void>;
    getAccountRep(transaction: PostgresTransaction, userAccount: Account | string): Promise<Account | null>;
    /**
     * If an adjustment cannot be made right now, defer it for follow-up
     */
    protected adjustDefer(transaction: PostgresTransaction, input: VoteStaple): Promise<void>;
    listOwners(transaction: PostgresTransaction, entity: IdentifierAddress): Promise<Account<AccountKeyAlgorithm.TOKEN>[]>;
    listACLsByEntity(transaction: PostgresTransaction, entity: GenericAccount): Promise<ACLRow[]>;
    listACLsByPrincipal(transaction: PostgresTransaction, principal: GenericAccount, entityList?: GenericAccount[]): Promise<ACLRow[]>;
    getAccountInfo(transaction: PostgresTransaction, account: GenericAccount | string): Promise<AccountInfo>;
    adjust(transaction: PostgresTransaction, input: VoteStaple, changes: ComputedEffectOfBlocks, mayDefer?: boolean, completedStaples?: Set<string>): Promise<VoteStaple[]>;
    getBlock(transaction: PostgresTransaction, block: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getBlockHeight(transaction: PostgresTransaction, blockHash: BlockHash, account: GenericAccount): Promise<bigint | null>;
    getBlockHeights(transaction: PostgresTransaction, toFetch: {
        blockHash: BlockHash;
        account: GenericAccount;
    }[]): Promise<{
        [blockHash: string]: bigint | null;
    }>;
    getVotes(transaction: PostgresTransaction, block: BlockHash, from: LedgerSelector, issuer?: GenericAccount): Promise<Vote[] | null>;
    getVoteStaples(transaction: PostgresTransaction, stapleBlockHashes: VoteBlockHash[], from?: LedgerSelector): Promise<VoteBlockHashMap<VoteStaple | null>>;
    getHistory(transaction: PostgresTransaction, account: GenericAccount | null, start: VoteBlockHash | null, limit?: number): Promise<VoteBlockHash[]>;
    getBlockFromPrevious(transaction: PostgresTransaction, prevBlock: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getVotesFromMultiplePrevious(transaction: PostgresTransaction, prevBlocks: BlockHash[], from: LedgerSelector, issuer?: Account): Promise<{
        [hash: string]: Vote[] | null;
    }>;
    getHeadBlocks(transaction: PostgresTransaction, accounts: GenericAccount[], from: LedgerSelector): Promise<{
        [publicKey: string]: Block | null;
    }>;
    getVoteStaplesFromBlockHash(transaction: PostgresTransaction, blocks: BlockHash[], onLedger: LedgerSelector): Promise<VoteStaple[]>;
    getVotesAfter(transaction: PostgresTransaction, moment: Date, startKey?: string, options?: GetVotesAfterOptions): Promise<PaginatedVotes>;
    getAccountCertificates(transaction: PostgresTransaction, account: GenericAccount): Promise<CertificateWithIntermediates[]>;
    getAccountCertificateByHash(transaction: PostgresTransaction, account: GenericAccount, hash: CertificateHash): Promise<CertificateWithIntermediates | null>;
    protected gcBatch(transaction: PostgresTransaction): Promise<boolean>;
    getNextSerialNumber(): Promise<bigint>;
    stats(): Promise<LedgerStatistics>;
}
export declare const Testing: {
    createDatabase: (config: PostgresConfig) => Promise<void>;
    deleteDatabase: (config: PostgresConfig) => Promise<void>;
};
export default DBPostgres;
