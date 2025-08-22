import { VoteStaple, Vote } from '../vote';
import { Block, BlockHash } from '../block';
import type { VoteBlockHash, VoteBlockHashMap } from '../vote';
import type { GenericAccount, IdentifierAddress, TokenAddress } from '../account';
import Account from '../account';
import type { Ledger, LedgerConfig, LedgerStorageAPI, LedgerSelector, PaginatedVotes, GetVotesAfterOptions, LedgerStorageTransactionBaseOptions } from '../ledger';
import { LedgerStorageTransactionBase } from '../ledger';
import type { AccountInfo, ACLRow, GetAllBalancesResponse, LedgerStatistics, CertificateWithIntermediates } from './types';
import { LedgerStorageBase } from './common';
import type { ComputedEffectOfBlocks } from './effects';
import type { CertificateHash } from '../utils/certificate';
declare const dynamoDBTableNames: readonly ["votes", "voteUIDs", "permissions", "accountInfo", "accountOwners", "accountCertificates", "blocks", "balances", "weight", "heapBlocks", "heapStorage", "chain", "delegation", "serial", "kv"];
declare const optionalDynamoDbTables: readonly ["kv"];
type TableName = typeof dynamoDBTableNames[number];
type OptionalTableName = typeof optionalDynamoDbTables[number];
type DynamoDbTables = {
    [K in TableName]: string;
};
type DynamoDbTablesWithOptional = Omit<DynamoDbTables, OptionalTableName> & Partial<Pick<DynamoDbTables, OptionalTableName>>;
export interface DynamoDBConfig {
    tables: DynamoDbTablesWithOptional;
    transactionSize?: number;
    batchUpdateSize?: number;
}
declare class DynamoDBTransaction extends LedgerStorageTransactionBase {
    #private;
    constructor(config: DynamoDBConfig, ledger: Ledger, log: LedgerConfig['log'], dbDynamoDB: DBDynamoDB, transactionBase: LedgerStorageTransactionBaseOptions);
    commit(): Promise<void>;
    abort(): Promise<void>;
    delegatedWeight(rep?: Account | InstanceType<typeof Account.Set>): Promise<bigint>;
    getBalance(account: GenericAccount, token: TokenAddress): Promise<bigint>;
    getAllBalances(account: GenericAccount): Promise<GetAllBalancesResponse>;
    adjustDefer(input: VoteStaple): Promise<void>;
    adjust(input: VoteStaple, changes: ComputedEffectOfBlocks, mayDefer?: boolean, completedStaples?: Set<string>): Promise<VoteStaple[]>;
    addPendingVote(blocksAndVotes: VoteStaple): Promise<void>;
    getBlock(block: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getBlockHeight(blockHash: BlockHash, account: GenericAccount): Promise<bigint | null>;
    getVotes(block: BlockHash, from: LedgerSelector, issuer?: Account, transactionAlreadyVerifiedActiveByCaller?: boolean): Promise<Vote[] | null>;
    getVoteStaple(stapleBlockHashes: VoteBlockHash[], from?: LedgerSelector): Promise<VoteBlockHashMap<VoteStaple | null>>;
    getHistory(account: GenericAccount | null, start: VoteBlockHash | null, limit: number): Promise<VoteBlockHash[]>;
    getVotesFromMultiplePrevious(prevBlocks: BlockHash[], from: LedgerSelector, issuer?: Account): Promise<{
        [hash: string]: Vote[] | null;
    }>;
    getBlockHashFromPrevious(prevBlock: BlockHash, from: LedgerSelector): Promise<BlockHash | null>;
    /**
     * Find a block whose "previous" is the value "prevBlock" -- that is,
     * blocks that succeed this block in a chain
     */
    getBlockFromPrevious(prevBlock: BlockHash, from: LedgerSelector, transactionAlreadyVerifiedActiveByCaller?: boolean): Promise<Block | null>;
    getHeadBlocks(accounts: GenericAccount[], from: LedgerSelector): Promise<{
        [publicKey: string]: Block | null;
    }>;
    getAccountRep(userAccount: Account | string): Promise<Account | null>;
    getAccountInfo(account: GenericAccount | string): Promise<AccountInfo>;
    listOwners(identifier: IdentifierAddress): Promise<Account[]>;
    listACLsByEntity(entity: GenericAccount): Promise<ACLRow[]>;
    listACLsByPrincipal(principal: GenericAccount, entityList?: GenericAccount[]): Promise<ACLRow[]>;
    getVotesAfter(moment: Date, startKey?: string, options?: GetVotesAfterOptions): Promise<PaginatedVotes>;
    getAccountCertificates(account: GenericAccount): Promise<CertificateWithIntermediates[]>;
    getAccountCertificateByHash(account: GenericAccount, hash: CertificateHash): Promise<CertificateWithIntermediates | null>;
    gcBatch(): Promise<boolean>;
}
export declare class DBDynamoDB extends LedgerStorageBase implements LedgerStorageAPI {
    #private;
    ledgerConfig: LedgerConfig | null;
    static Testing: {
        deleteTables: (config: DynamoDBConfig) => Promise<void>;
        createTables: (config: DynamoDBConfig) => Promise<void>;
    };
    init(config: LedgerConfig, ledger: Ledger): void;
    beginTransaction(transactionBase: LedgerStorageTransactionBaseOptions): Promise<DynamoDBTransaction>;
    commitTransaction(transaction: DynamoDBTransaction): Promise<void>;
    abortTransaction(transaction: DynamoDBTransaction): Promise<void>;
    evaluateError(error: any): Promise<any>;
    delegatedWeight(transaction: DynamoDBTransaction, rep?: Account | InstanceType<typeof Account.Set>): Promise<bigint>;
    getBalance(transaction: DynamoDBTransaction, account: GenericAccount, token: TokenAddress): Promise<bigint>;
    getAllBalances(transaction: DynamoDBTransaction, account: GenericAccount): Promise<GetAllBalancesResponse>;
    protected adjustDefer(transaction: DynamoDBTransaction, input: VoteStaple): Promise<void>;
    adjust(transaction: DynamoDBTransaction, input: VoteStaple, changes: ComputedEffectOfBlocks, mayDefer?: boolean): Promise<VoteStaple[]>;
    addPendingVote(transaction: DynamoDBTransaction, blocksAndVote: VoteStaple): Promise<void>;
    getBlock(transaction: DynamoDBTransaction, block: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getBlockHeight(transaction: DynamoDBTransaction, blockHash: BlockHash, account: GenericAccount): Promise<bigint | null>;
    getVotes(transaction: DynamoDBTransaction, block: BlockHash, from: LedgerSelector): Promise<Vote[] | null>;
    getVoteStaples(transaction: DynamoDBTransaction, stapleBlockHashes: VoteBlockHash[], from?: LedgerSelector): Promise<VoteBlockHashMap<VoteStaple | null>>;
    getHistory(transaction: DynamoDBTransaction, account: GenericAccount | null, start: VoteBlockHash | null, limit?: number): Promise<VoteBlockHash[]>;
    getVotesFromMultiplePrevious(transaction: DynamoDBTransaction, prevBlocks: BlockHash[], from: LedgerSelector, issuer?: Account): Promise<{
        [hash: string]: Vote[] | null;
    }>;
    getBlockFromPrevious(transaction: DynamoDBTransaction, block: BlockHash, from: LedgerSelector): Promise<Block | null>;
    getHeadBlocks(transaction: DynamoDBTransaction, accounts: GenericAccount[], from: LedgerSelector): Promise<{
        [publicKey: string]: Block | null;
    }>;
    getAccountRep(transaction: DynamoDBTransaction, account: Account | string): Promise<Account | null>;
    getAccountInfo(transaction: DynamoDBTransaction, account: GenericAccount | string): Promise<AccountInfo>;
    listOwners(transaction: DynamoDBTransaction, identifier: IdentifierAddress): Promise<Account[]>;
    listACLsByPrincipal(transaction: DynamoDBTransaction, principal: GenericAccount, entityList?: GenericAccount[]): Promise<ACLRow[]>;
    listACLsByEntity(transaction: DynamoDBTransaction, entity: GenericAccount): Promise<ACLRow[]>;
    getVotesAfter(transaction: DynamoDBTransaction, moment: Date, startKey?: string): Promise<PaginatedVotes>;
    getAccountCertificates(transaction: DynamoDBTransaction, account: GenericAccount): Promise<CertificateWithIntermediates[]>;
    getAccountCertificateByHash(transaction: DynamoDBTransaction, account: GenericAccount, hash: CertificateHash): Promise<CertificateWithIntermediates | null>;
    getNextSerialNumber(): Promise<bigint>;
    gcBatch(transaction: DynamoDBTransaction): Promise<boolean>;
    stats(): Promise<LedgerStatistics>;
}
export default DBDynamoDB;
type DynamoDBAttrTypes = 'S' | 'N' | 'B';
type DynamoDBKey = {
    type: DynamoDBAttrTypes;
    name: string;
};
type DynamoDBKeys = {
    hashKey: DynamoDBKey;
    rangeKey?: DynamoDBKey;
    gsi?: (Omit<DynamoDBKeys, 'gsi' | 'lsi'> & {
        name: string;
    })[];
    lsi?: (Required<Omit<DynamoDBKeys, 'gsi' | 'lsi' | 'hashKey'>> & {
        name: string;
    })[];
};
type DynamoDBSchema = {
    [name: string]: DynamoDBKeys;
};
/**
 * Testing routines
 */
export declare const Testing: {
    deleteTables(config: DynamoDBConfig): Promise<void>;
    getSchema(names: DynamoDBConfig["tables"]): DynamoDBSchema;
    createTables(config: DynamoDBConfig): Promise<void>;
};
