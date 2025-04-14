import type { LedgerStorage } from '.';
import type { GenericAccount, TokenAddress } from '../account';
import Account, { AccountKeyAlgorithm } from '../account';
import Block, { BlockHash } from '../block';
import Vote, { PossiblyExpiredVote, VoteBlockHash } from '../vote';
import type { BaseSet, ExternalSet } from '../permissions';
import type { SpannerTransaction } from './db_spanner';
declare const ColumnTypes: {
    readonly LEDGER: {
        readonly dbType: "STRING";
        readonly dbSize: 4;
        readonly fromSpanner: (value: string) => LedgerStorage;
        readonly toSpanner: (ledger: LedgerStorage) => LedgerStorage;
        readonly toComparable: (name: string) => string;
    };
    readonly ACCOUNT: {
        readonly fromSpanner: (pubKey: string) => Account<AccountKeyAlgorithm.ECDSA_SECP256K1 | AccountKeyAlgorithm.ED25519 | AccountKeyAlgorithm.ECDSA_SECP256R1>;
        readonly toSpanner: (account: Account) => import("../account").Secp256K1PublicKeyString | import("../account").ED25519PublicKeyString | import("../account").Secp256R1PublicKeyString;
        readonly dbType: string;
        readonly dbSize: number;
        readonly toComparable: (account: string | Account) => string;
    };
    readonly TOKEN_ACCOUNT: {
        readonly fromSpanner: (pubKey: string) => Account<AccountKeyAlgorithm.TOKEN>;
        readonly toSpanner: (account: TokenAddress) => import("../account").TokenPublicKeyString;
        readonly dbType: string;
        readonly dbSize: number;
        readonly toComparable: (account: string | Account) => string;
    };
    readonly INFO_NAME: {
        readonly dbSize: 50;
        readonly dbType: string;
        readonly fromSpanner: (str: string) => string;
        readonly toSpanner: (str: string) => string;
        readonly toComparable: (str: string) => string;
    };
    readonly INFO_DESCRIPTION: {
        readonly dbSize: 250;
        readonly dbType: string;
        readonly fromSpanner: (str: string) => string;
        readonly toSpanner: (str: string) => string;
        readonly toComparable: (str: string) => string;
    };
    readonly INFO_METADATA: {
        readonly dbSize: 750;
        readonly dbType: string;
        readonly fromSpanner: (str: string) => string;
        readonly toSpanner: (str: string) => string;
        readonly toComparable: (str: string) => string;
    };
    readonly BLOCK: {
        readonly fromSpanner: (value: Buffer) => Block;
        readonly toSpanner: (block: Block) => Buffer;
        readonly toComparable: (vote: Block | Buffer | ArrayBuffer) => string;
        readonly dbType: string;
        readonly dbSize: string;
    };
    readonly VOTE: {
        readonly fromSpanner: (value: Buffer, transaction: SpannerTransaction) => PossiblyExpiredVote | Vote | null;
        readonly toSpanner: (vote: Vote | null) => Buffer | null;
        readonly toComparable: (vote: PossiblyExpiredVote | Buffer | ArrayBuffer | null) => string | null;
        readonly dbType: string;
        readonly dbSize: string;
    };
    readonly SUPPLY: {
        readonly fromSpanner: (value: any) => bigint;
        readonly dbType: string;
        readonly dbSize: number;
        readonly toSpanner: (value: string | bigint) => string;
        readonly toComparable: (value: bigint | string) => bigint;
    };
    readonly BASE_PERMISSION: {
        readonly fromSpanner: (value: string) => BaseSet;
        readonly toSpanner: (baseSet: BaseSet) => string;
        readonly toComparable: (value: bigint | BaseSet) => bigint;
        readonly dbType: string;
        readonly dbSize: undefined;
    };
    readonly EXTERNAL_PERMISSION: {
        readonly fromSpanner: (value: string) => ExternalSet;
        readonly toSpanner: (externalSet: ExternalSet) => string;
        readonly toComparable: (value: bigint | ExternalSet) => bigint;
        readonly dbType: string;
        readonly dbSize: undefined;
    };
    readonly BLOCKHASH: {
        readonly fromSpanner: (hash: string) => BlockHash;
        readonly toSpanner: (blockHash: BlockHash) => string;
        readonly toComparable: (blockHash: BlockHash | string) => string;
        readonly dbType: string;
        readonly dbSize: number;
    };
    readonly VOTEBLOCKHASH: {
        readonly fromSpanner: (hash: string) => VoteBlockHash;
        readonly toSpanner: (blockHash: VoteBlockHash) => string;
        readonly toComparable: (blockHash: VoteBlockHash | string) => string;
        readonly dbType: string;
        readonly dbSize: number;
    };
    readonly VOTE_UID: {
        readonly dbSize: 150;
        readonly dbType: string;
        readonly fromSpanner: (str: string) => string;
        readonly toSpanner: (str: string) => string;
        readonly toComparable: (str: string) => string;
    };
    readonly BUFFER: {
        dbType: string;
        dbSize: string;
        toSpanner: (buf: Buffer | Uint8Array | string) => Buffer;
        fromSpanner: (value: Buffer | Uint8Array | string) => Buffer;
        toComparable: (val: Buffer | string) => string;
    };
    readonly HASH: {
        dbType: string;
        dbSize: number;
        fromSpanner: (hash: string) => string;
        toSpanner: (hash: string) => string;
        toComparable: (value: string) => string;
    };
    readonly BIGINT: {
        dbType: string;
        dbSize: undefined;
        fromSpanner: (value: number | string) => bigint;
        toSpanner: (value: string | bigint) => string;
        toComparable: (value: bigint | string) => bigint;
    };
    readonly INT_AS_STRING: {
        dbType: string;
        dbSize: number;
        fromSpanner: (value: string | bigint) => bigint;
        toSpanner: (value: string | bigint) => string;
        toComparable: (value: bigint | string) => bigint;
    };
    readonly STRING: {
        dbType: string;
        dbSize: number;
        fromSpanner: (str: string) => string;
        toSpanner: (str: string) => string;
        toComparable: (str: string) => string;
    };
    readonly TIMESTAMP: {
        dbType: string;
        dbSize: undefined;
        fromSpanner: (date: Date) => Date;
        toSpanner: (date: Date) => Date;
        toComparable: (date: Date) => number;
    };
    readonly BOOLEAN: {
        dbType: string;
        dbSize: undefined;
        fromSpanner: (bool: boolean) => boolean;
        toSpanner: (bool: boolean) => boolean;
        toComparable: (bool: boolean) => boolean;
    };
    readonly GENERIC_ACCOUNT: {
        dbType: string;
        dbSize: number;
        toComparable: (account: string | Account) => string;
        fromSpanner: (pubKey: string) => GenericAccount;
        toSpanner: (account: GenericAccount) => import("../account").Secp256K1PublicKeyString | import("../account").ED25519PublicKeyString | import("../account").NetworkPublicKeyString | import("../account").TokenPublicKeyString | import("../account").StoragePublicKeyString | import("../account").Secp256R1PublicKeyString;
    };
    readonly BUFFER_BIGINT: {
        dbType: string;
        dbSize: string;
        toSpanner: (buf: bigint) => Buffer;
        fromSpanner: (value: Buffer) => bigint;
        toComparable: (val: Buffer | bigint | string) => bigint;
    };
};
type ColumnTypeName = keyof typeof ColumnTypes;
type ColumnOutputTypeArg<T extends ColumnTypeName> = Parameters<typeof ColumnTypes[T]['fromSpanner']>[0];
type ColumnOutputTypeReturn<T extends ColumnTypeName> = ReturnType<typeof ColumnTypes[T]['fromSpanner']>;
type ColumnOutputTypeInfer<X> = X extends ColumnInterface<infer TR> ? ColumnOutputTypeReturn<TR> : never;
type ColumnInputTypeArg<T extends ColumnTypeName> = Parameters<typeof ColumnTypes[T]['toSpanner']>[0];
type ColumnInputTypeReturn<T extends ColumnTypeName> = ReturnType<typeof ColumnTypes[T]['toSpanner']>;
interface ColumnInterface<T extends ColumnTypeName> {
    nullable: (nullable: boolean) => ColumnInterface<T>;
    fromSpanner: (value: ColumnOutputTypeArg<T>, transaction: SpannerTransaction) => ColumnOutputTypeReturn<T>;
    toSpanner: (value: ColumnInputTypeArg<T>, transaction: SpannerTransaction) => ColumnInputTypeReturn<T>;
    toComparable: (value: any, transaction: SpannerTransaction) => any;
}
type KeyOrderBy = 'NONE' | 'ASC' | 'DESC';
declare class Key {
    #private;
    constructor(columnName: string, orderBy?: KeyOrderBy);
    get ddl(): string;
    get name(): string;
}
type SchemaType = 'TABLE' | 'INDEX';
type InterleaveAction = 'CASCADE' | 'NOTHING';
declare class Interleave {
    #private;
    constructor(type: SchemaType, table: string);
    action(action: InterleaveAction): this;
    get ddl(): string;
    static FromTable(table: string, action?: InterleaveAction): Interleave;
    static FromIndex(table: string): Interleave;
}
declare const schema: {
    readonly accountInfo: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT">;
            readonly name: ColumnInterface<"INFO_NAME">;
            readonly description: ColumnInterface<"INFO_DESCRIPTION">;
            readonly metadata: ColumnInterface<"INFO_METADATA">;
            readonly supply: ColumnInterface<"SUPPLY">;
            readonly defaultBasePermission: ColumnInterface<"BASE_PERMISSION">;
            readonly defaultExternalPermission: ColumnInterface<"EXTERNAL_PERMISSION">;
        };
        readonly key: readonly [Key];
    };
    readonly permissions: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT">;
            readonly entity: ColumnInterface<"GENERIC_ACCOUNT">;
            readonly target: ColumnInterface<"GENERIC_ACCOUNT">;
            readonly basePermission: ColumnInterface<"BASE_PERMISSION">;
            readonly externalPermission: ColumnInterface<"EXTERNAL_PERMISSION">;
        };
        readonly key: readonly [Key, Key, Key];
        readonly interleave: Interleave;
    };
    readonly ledger: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT">;
            readonly token: ColumnInterface<"TOKEN_ACCOUNT">;
            readonly onLedger: ColumnInterface<"LEDGER">;
            readonly balance: ColumnInterface<"INT_AS_STRING">;
        };
        readonly key: readonly [Key, Key, Key];
        readonly interleave: Interleave;
    };
    readonly chain: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT">;
            readonly blockHeight: ColumnInterface<"BIGINT">;
            readonly blockHash: ColumnInterface<"BLOCKHASH">;
        };
        readonly key: readonly [Key, Key];
        readonly interleave: Interleave;
    };
    readonly history: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT">;
            readonly voteBlockHash: ColumnInterface<"VOTEBLOCKHASH">;
            readonly orderIndex: ColumnInterface<"BUFFER_BIGINT">;
        };
        readonly key: readonly [Key, Key];
        readonly interleave: Interleave;
    };
    readonly delegation: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"ACCOUNT">;
            readonly delegatedToRep: ColumnInterface<"ACCOUNT">;
        };
        readonly key: readonly [Key];
        readonly interleave: Interleave;
    };
    readonly votes: {
        readonly type: "TABLE";
        readonly columns: {
            readonly voteUID: ColumnInterface<"VOTE_UID">;
            readonly onLedger: ColumnInterface<"LEDGER">;
            readonly vote: ColumnInterface<"VOTE">;
            readonly timestamp: ColumnInterface<"TIMESTAMP">;
            readonly expires: ColumnInterface<"TIMESTAMP">;
            readonly issuer: ColumnInterface<"ACCOUNT">;
            readonly voteBlockHash: ColumnInterface<"VOTEBLOCKHASH">;
        };
        readonly key: readonly [Key, Key];
    };
    readonly blocks: {
        readonly type: "TABLE";
        readonly columns: {
            readonly blockHash: ColumnInterface<"BLOCKHASH">;
            readonly onLedger: ColumnInterface<"LEDGER">;
            readonly block: ColumnInterface<"BLOCK">;
            readonly prevBlockHash: ColumnInterface<"BLOCKHASH">;
        };
        readonly key: readonly [Key];
    };
    readonly voteBlocks: {
        readonly type: "TABLE";
        readonly columns: {
            readonly blockHash: ColumnInterface<"BLOCKHASH">;
            readonly voteUID: ColumnInterface<"VOTE_UID">;
        };
        readonly key: readonly [Key, Key];
        readonly interleave: Interleave;
    };
    readonly weight: {
        readonly type: "TABLE";
        readonly columns: {
            readonly repAccount: ColumnInterface<"ACCOUNT">;
            readonly weight: ColumnInterface<"INT_AS_STRING">;
        };
        readonly key: readonly [Key];
    };
    readonly heapBlocks: {
        readonly type: "TABLE";
        readonly columns: {
            readonly prevBlockHash: ColumnInterface<"BLOCKHASH">;
            readonly storageHash: ColumnInterface<"HASH">;
        };
        readonly key: readonly [Key];
    };
    readonly heapStorage: {
        readonly type: "TABLE";
        readonly columns: {
            readonly storageHash: ColumnInterface<"HASH">;
            readonly data: ColumnInterface<"BUFFER">;
        };
        readonly key: readonly [Key];
    };
    readonly permissionsAccount: {
        readonly type: "INDEX";
        readonly table: "permissions";
        readonly key: readonly [Key];
        readonly storing: readonly [Key, Key];
    };
    readonly permissionsPrincipalEntity: {
        readonly type: "INDEX";
        readonly table: "permissions";
        readonly key: readonly [Key, Key];
        readonly storing: readonly [Key, Key];
    };
    readonly permissionsEntity: {
        readonly type: "INDEX";
        readonly table: "permissions";
        readonly key: readonly [Key];
        readonly storing: readonly [Key, Key];
    };
    readonly permissionsEntityBasePerm: {
        readonly type: "INDEX";
        readonly table: "permissions";
        readonly key: readonly [Key, Key];
    };
    readonly historyAccount: {
        readonly type: "INDEX";
        readonly table: "history";
        readonly key: readonly [Key];
        readonly storing: readonly [Key];
    };
    readonly historyVoteBlockHash: {
        readonly type: "INDEX";
        readonly table: "history";
        readonly key: readonly [Key, Key];
    };
    readonly historyAccountOrderIndex: {
        readonly type: "INDEX";
        readonly table: "history";
        readonly key: readonly [Key, Key];
        readonly storing: readonly [Key];
    };
    readonly chainAccount: {
        readonly type: "INDEX";
        readonly table: "chain";
        readonly key: readonly [Key];
        readonly interleave: Interleave;
        readonly storing: readonly [Key];
    };
    readonly chainAccountHash: {
        readonly type: "INDEX";
        readonly table: "chain";
        readonly unique: true;
        readonly key: readonly [Key, Key];
        readonly interleave: Interleave;
    };
    readonly blocksPrevBlockHash: {
        readonly type: "INDEX";
        readonly table: "blocks";
        readonly key: readonly [Key];
        readonly storing: readonly [Key, Key];
    };
    readonly voteBlocksBlockhash: {
        readonly type: "INDEX";
        readonly table: "voteBlocks";
        readonly key: readonly [Key];
        readonly interleave: Interleave;
    };
    readonly votesTimestamp: {
        readonly type: "INDEX";
        readonly table: "votes";
        readonly key: readonly [Key, Key];
        readonly storing: readonly [Key];
    };
    readonly votesOnLedgerExpired: {
        readonly type: "INDEX";
        readonly table: "votes";
        readonly key: readonly [Key, Key];
        readonly storing: readonly [Key];
    };
    readonly votesUidIssuer: {
        readonly type: "INDEX";
        readonly table: "votes";
        readonly key: readonly [Key, Key];
        readonly storing: readonly [Key];
    };
    readonly votesUid: {
        readonly type: "INDEX";
        readonly table: "votes";
        readonly key: readonly [Key];
        readonly storing: readonly [Key];
    };
    readonly votesBlockHash: {
        readonly type: "INDEX";
        readonly table: "votes";
        readonly key: readonly [Key];
        readonly storing: readonly [Key];
    };
    readonly ledgerBalanceByAccount: {
        readonly type: "INDEX";
        readonly table: "ledger";
        readonly key: readonly [Key];
        readonly storing: readonly [Key];
        readonly interleave: Interleave;
    };
};
type SchemaEntriesFilter<T extends SchemaType> = keyof {
    [K in (keyof typeof schema) as typeof schema[K]['type'] extends T ? K : never]: true;
};
export type TableName = SchemaEntriesFilter<'TABLE'>;
export type IndexName = SchemaEntriesFilter<'INDEX'>;
export type TableIndexName = IndexName | TableName;
type IndexToTableName<I extends IndexName> = typeof schema[I]['table'];
type RootTableNameUndef<TI extends TableIndexName> = (TI extends IndexName ? IndexToTableName<TI> : TI);
export type RootTableName<T extends TableIndexName> = RootTableNameUndef<T> extends TableName ? RootTableNameUndef<T> : never;
export type TableColumn<T extends TableName> = keyof NonNullable<((typeof schema[T])['columns'])>;
type TableColumnType<T extends TableName, K extends TableColumn<T>> = K extends keyof typeof schema[T]['columns'] ? typeof schema[T]['columns'][K] : never;
export type TableRow<T extends TableName> = {
    -readonly [key in TableColumn<T>]?: ColumnOutputTypeInfer<TableColumnType<T, key>>;
};
interface QueryValueMin<T extends TableName, K extends TableColumn<T>> {
    min: ColumnOutputTypeInfer<TableColumnType<T, K>>;
}
interface QueryValueMax<T extends TableName, K extends TableColumn<T>> {
    max: ColumnOutputTypeInfer<TableColumnType<T, K>>;
}
type QueryValueMinMax<T extends TableName, K extends TableColumn<T>> = QueryValueMin<T, K> | QueryValueMax<T, K> | (QueryValueMin<T, K> & QueryValueMax<T, K>);
export type QueryRow<T extends TableName> = {
    [key in TableColumn<T>]?: ColumnOutputTypeInfer<TableColumnType<T, key>> | QueryValueMinMax<T, key>;
};
export type TableRows<T extends TableName> = TableRow<T>[];
export type QueryRows<T extends TableName> = QueryRow<T>[];
export type FilteredResponseRow<T extends TableName, C> = TableRow<T> & {
    [K in keyof C as C[K] extends TableColumn<T> ? C[K] : never]: C[K] extends TableColumn<T> ? ColumnOutputTypeInfer<TableColumnType<T, C[K]>> : never;
};
export declare class Helper {
    #private;
    constructor();
    static getPrimaryKeyNames<X extends TableIndexName>(table: X): string[];
    static getNameFromType(filterType: 'INDEX'): IndexName[];
    static getNameFromType(filterType: 'TABLE'): TableName[];
    static getAllTables(): ("permissions" | "blocks" | "votes" | "ledger" | "history" | "weight" | "chain" | "accountInfo" | "heapBlocks" | "heapStorage" | "delegation" | "voteBlocks")[];
    static IsTable(name: TableIndexName): name is TableName;
    static IsIndex(name: TableIndexName): name is IndexName;
    static getIndexParent(index: IndexName): TableName;
    static getCompoundKeys<T extends TableName, R extends TableRow<T>[]>(table: TableName, rows: R, index?: IndexName): any[][];
    static getCompoundRangeKeys<T extends TableName, R extends QueryRows<T>>(table: TableName, rows: R, index?: IndexName): {
        startClosed: any[];
        endClosed: any[];
    }[];
    static getDDL(addSemis?: boolean): string[];
}
export declare class RowBuilder {
    #private;
    constructor(transaction: SpannerTransaction, table: TableName, rawRows?: any);
    ensureKeys(index?: IndexName): this;
    mapRows(perRow?: (row: any) => any, perKey?: (key: string, value: any) => any): any[];
    unwrapRows(): this;
    toSpanner(): this;
    fromSpanner(): this;
    toComparable(): this;
    merge(toMerge: any[]): this;
    filter(columns: TableColumn<any>[]): this;
    get rows(): any[];
    get compoundKeys(): any[][];
}
export {};
