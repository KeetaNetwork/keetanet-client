import { VoteStaple, Vote, VoteBlockHash } from '../vote';
import type { VoteBlockHashMap } from '../vote';
import type { BlockHash } from '../block';
import { Block } from '../block';
import type { GenericAccount, IdentifierAddress, TokenAddress } from '../account';
import Account, { AccountKeyAlgorithm } from '../account';
import type { Ledger, LedgerConfig, LedgerStorageAPI, LedgerSelector, PaginatedVotes, GetVotesAfterOptions } from '../ledger';
import type { AccountInfo, ACLRow, GetAllBalancesResponse, LedgerStatistics } from './types';
import { LedgerStorageBase } from './common';
import * as sqlite from 'sqlite';
import type { ComputedEffectOfBlocks } from './effects';
interface DBSqliteTransaction {
    sql: Awaited<ReturnType<typeof sqlite['open']>>;
    moment: Date;
    release: null | ((value: null | number) => void);
    lock: null | Promise<null | number>;
}
export interface DBSqliteConfig {
    filename: string;
    retryCount?: number;
}
export declare class DBSqlite extends LedgerStorageBase implements LedgerStorageAPI {
    #private;
    constructor();
    init(config: LedgerConfig, ledger: Ledger): void;
    destroy(): Promise<void>;
    beginTransaction(): Promise<DBSqliteTransaction>;
    commitTransaction(transaction: DBSqliteTransaction): Promise<void>;
    abortTransaction(transaction: DBSqliteTransaction): Promise<void>;
    evaluateError(error: any): Promise<any>;
    delegatedWeight(transaction: DBSqliteTransaction, rep?: Account): Promise<bigint>;
    getBalance(transaction: DBSqliteTransaction, account: GenericAccount, token: TokenAddress): Promise<bigint>;
    getAllBalances(transaction: DBSqliteTransaction, account: GenericAccount): Promise<GetAllBalancesResponse>;
    addPendingVote(transaction: DBSqliteTransaction, votesAndBlocks: VoteStaple): Promise<void>;
    getAccountRep(transaction: DBSqliteTransaction, userAccount: Account | string): Promise<Account | null>;
    /**
     * If an adjustment cannot be made right now, defer it for follow-up
     */
    protected adjustDefer(transaction: DBSqliteTransaction, input: VoteStaple): Promise<void>;
    listOwners(transaction: DBSqliteTransaction, entity: IdentifierAddress): Promise<Account<AccountKeyAlgorithm.TOKEN>[]>;
    listACLsByEntity(transaction: DBSqliteTransaction, entity: GenericAccount): Promise<ACLRow[]>;
    listACLsByPrincipal(transaction: DBSqliteTransaction, principal: GenericAccount, entityList?: GenericAccount[]): Promise<ACLRow[]>;
    getAccountInfo(transaction: DBSqliteTransaction, account: GenericAccount | string): Promise<AccountInfo>;
    adjust(transaction: DBSqliteTransaction, input: VoteStaple, changes: ComputedEffectOfBlocks, mayDefer?: boolean): Promise<BlockHash[]>;
    getBlock(transaction: DBSqliteTransaction, block: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getBlockHeight(transaction: DBSqliteTransaction, blockHash: BlockHash, account: GenericAccount): Promise<{
        blockHeight: string | null;
    } | null>;
    getVotes(transaction: DBSqliteTransaction, block: BlockHash, from: LedgerSelector): Promise<Vote[] | null>;
    getVoteStaples(transaction: DBSqliteTransaction, voteBlockHashes: VoteBlockHash[], from?: LedgerSelector): Promise<VoteBlockHashMap<VoteStaple | null>>;
    getHistory(transaction: DBSqliteTransaction, account: GenericAccount, start: VoteBlockHash | null, limit?: number): Promise<VoteBlockHash[]>;
    getBlockFromPrevious(transaction: DBSqliteTransaction, prevBlock: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getVotesFromMultiplePrevious(transaction: DBSqliteTransaction, prevBlocks: BlockHash[], from: LedgerSelector, issuer?: GenericAccount): Promise<{
        [hash: string]: Vote[] | null;
    }>;
    getHeadBlocks(transaction: DBSqliteTransaction, accounts: GenericAccount[], from: LedgerSelector): Promise<{
        [publicKey: string]: Block | null;
    }>;
    getVotesAfter(transaction: DBSqliteTransaction, moment: Date, startKey?: string, options?: GetVotesAfterOptions): Promise<PaginatedVotes>;
    protected gcBatch(transaction: DBSqliteTransaction): Promise<boolean>;
    getNextSerialNumber(transaction: DBSqliteTransaction): Promise<bigint>;
    stats(): Promise<LedgerStatistics>;
}
export default DBSqlite;
