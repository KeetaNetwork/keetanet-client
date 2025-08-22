import type { LedgerStorage } from '.';
import type { GenericAccount, TokenAddress } from '../account';
import Account, { AccountKeyAlgorithm } from '../account';
import Block, { BlockHash } from '../block';
import Vote, { PossiblyExpiredVote, VoteBlockHash } from '../vote';
import type { BaseSet, ExternalSet } from '../permissions';
import type { SpannerTransaction } from './db_spanner';
import { Certificate, CertificateBundle, CertificateHash } from '../utils/certificate';
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
        readonly toSpanner: (account: Account) => import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString;
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
        readonly dbSize: 5464;
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
        fromSpanner: (hash: string) => BlockHash;
        toSpanner: (constructedInput: BlockHash) => string;
        toComparable: (input: string | BlockHash) => string;
        dbType: string;
        dbSize: number;
    };
    readonly CERTIFICATE_HASH: {
        fromSpanner: (hash: string) => CertificateHash;
        toSpanner: (constructedInput: CertificateHash) => string;
        toComparable: (input: string | CertificateHash) => string;
        dbType: string;
        dbSize: number;
    };
    readonly VOTEBLOCKHASH: {
        fromSpanner: (hash: string) => VoteBlockHash;
        toSpanner: (constructedInput: VoteBlockHash) => string;
        toComparable: (input: string | VoteBlockHash) => string;
        dbType: string;
        dbSize: number;
    };
    readonly VOTE_UID: {
        readonly dbSize: 150;
        readonly dbType: string;
        readonly fromSpanner: (str: string) => string;
        readonly toSpanner: (str: string) => string;
        readonly toComparable: (str: string) => string;
    };
    readonly CERTIFICATE: {
        readonly fromSpanner: (certificate: Buffer) => Certificate;
        readonly toSpanner: (certificate: Certificate) => Buffer;
        readonly toComparable: (input: Certificate | Buffer) => string & {
            readonly __certificateHash: never;
        };
        readonly dbType: string;
        readonly dbSize: string;
    };
    readonly CERTIFICATE_BUNDLE: {
        readonly fromSpanner: (bundle: Buffer) => CertificateBundle;
        readonly toSpanner: (bundle: CertificateBundle) => Buffer;
        readonly toComparable: (input: CertificateBundle | Buffer) => string;
        readonly dbType: string;
        readonly dbSize: string;
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
        toSpanner: (account: GenericAccount) => import("../account").TokenPublicKeyString | import("../account").NetworkPublicKeyString | import("../account").StoragePublicKeyString | import("../account").MultisigPublicKeyString | import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString;
    };
    readonly BUFFER_BIGINT_39: {
        dbType: string;
        dbSize: string;
        toSpanner: (buf: bigint) => Buffer;
        fromSpanner: (value: Buffer) => bigint;
        toComparable: (val: Buffer | bigint | string) => bigint;
    };
    readonly BUFFER_BIGINT_16: {
        dbType: string;
        dbSize: string;
        toSpanner: (buf: bigint) => Buffer;
        fromSpanner: (value: Buffer) => bigint;
        toComparable: (val: Buffer | bigint | string) => bigint;
    };
    readonly BUFFER_BIGINT_8: {
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
type IfNullable<T, I> = I extends false ? T : (T | null);
type ColumnOutputTypeInfer<X> = X extends ColumnInterface<infer TR, infer Nullable> ? IfNullable<ColumnOutputTypeReturn<TR>, Nullable> : never;
type ColumnInputTypeArg<T extends ColumnTypeName> = Parameters<typeof ColumnTypes[T]['toSpanner']>[0];
type ColumnInputTypeReturn<T extends ColumnTypeName> = ReturnType<typeof ColumnTypes[T]['toSpanner']>;
interface ColumnInterface<T extends ColumnTypeName, Nullable extends boolean = boolean> {
    nullable: <SetNullable extends boolean>(nullable: SetNullable) => ColumnInterface<T, SetNullable>;
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
            readonly account: ColumnInterface<"GENERIC_ACCOUNT", false>;
            readonly name: ColumnInterface<"INFO_NAME", true>;
            readonly description: ColumnInterface<"INFO_DESCRIPTION", true>;
            readonly metadata: ColumnInterface<"INFO_METADATA", true>;
            readonly supply: ColumnInterface<"SUPPLY", true>;
            readonly multisigQuorum: ColumnInterface<"BIGINT", true>;
            readonly defaultBasePermission: ColumnInterface<"BASE_PERMISSION", true>;
            readonly defaultExternalPermission: ColumnInterface<"EXTERNAL_PERMISSION", true>;
        };
        readonly key: readonly [Key];
    };
    readonly permissions: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT", false>;
            readonly entity: ColumnInterface<"GENERIC_ACCOUNT", false>;
            readonly target: ColumnInterface<"GENERIC_ACCOUNT", false>;
            readonly basePermission: ColumnInterface<"BASE_PERMISSION", false>;
            readonly externalPermission: ColumnInterface<"EXTERNAL_PERMISSION", false>;
        };
        readonly key: readonly [Key, Key, Key];
        readonly interleave: Interleave;
    };
    readonly ledger: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT", false>;
            readonly token: ColumnInterface<"TOKEN_ACCOUNT", false>;
            readonly onLedger: ColumnInterface<"LEDGER", false>;
            readonly balance: ColumnInterface<"INT_AS_STRING", false>;
        };
        readonly key: readonly [Key, Key, Key];
        readonly interleave: Interleave;
    };
    readonly chain: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT", false>;
            readonly blockHeight: ColumnInterface<"BIGINT", false>;
            readonly blockHash: ColumnInterface<"BLOCKHASH", false>;
        };
        readonly key: readonly [Key, Key];
        readonly interleave: Interleave;
    };
    readonly history: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT", false>;
            readonly voteBlockHash: ColumnInterface<"VOTEBLOCKHASH", false>;
            readonly orderIndex: ColumnInterface<"BUFFER_BIGINT_39", false>;
        };
        readonly key: readonly [Key, Key];
        readonly interleave: Interleave;
    };
    readonly delegation: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"ACCOUNT", false>;
            readonly delegatedToRep: ColumnInterface<"ACCOUNT", false>;
        };
        readonly key: readonly [Key];
        readonly interleave: Interleave;
    };
    readonly votes: {
        readonly type: "TABLE";
        readonly columns: {
            readonly voteUID: ColumnInterface<"VOTE_UID", false>;
            readonly onLedger: ColumnInterface<"LEDGER", false>;
            readonly vote: ColumnInterface<"VOTE", false>;
            readonly timestamp: ColumnInterface<"TIMESTAMP", false>;
            readonly issuer: ColumnInterface<"ACCOUNT", false>;
            readonly voteBlockHash: ColumnInterface<"VOTEBLOCKHASH", false>;
            readonly orderIndex: ColumnInterface<"BUFFER_BIGINT_16", false>;
            readonly expiresIndex: ColumnInterface<"BUFFER_BIGINT_8", true>;
        };
        readonly key: readonly [Key, Key];
    };
    readonly blocks: {
        readonly type: "TABLE";
        readonly columns: {
            readonly blockHash: ColumnInterface<"BLOCKHASH", false>;
            readonly onLedger: ColumnInterface<"LEDGER", false>;
            readonly block: ColumnInterface<"BLOCK", false>;
            readonly prevBlockHash: ColumnInterface<"BLOCKHASH", false>;
        };
        readonly key: readonly [Key];
    };
    readonly voteBlocks: {
        readonly type: "TABLE";
        readonly columns: {
            readonly blockHash: ColumnInterface<"BLOCKHASH", false>;
            readonly voteUID: ColumnInterface<"VOTE_UID", false>;
        };
        readonly key: readonly [Key, Key];
        readonly interleave: Interleave;
    };
    readonly weight: {
        readonly type: "TABLE";
        readonly columns: {
            readonly repAccount: ColumnInterface<"ACCOUNT", false>;
            readonly weight: ColumnInterface<"INT_AS_STRING", false>;
        };
        readonly key: readonly [Key];
    };
    readonly heapBlocks: {
        readonly type: "TABLE";
        readonly columns: {
            readonly prevBlockHash: ColumnInterface<"BLOCKHASH", false>;
            readonly storageHash: ColumnInterface<"HASH", false>;
        };
        readonly key: readonly [Key];
    };
    readonly heapStorage: {
        readonly type: "TABLE";
        readonly columns: {
            readonly storageHash: ColumnInterface<"HASH", false>;
            readonly data: ColumnInterface<"BUFFER", false>;
        };
        readonly key: readonly [Key];
    };
    readonly accountCertificates: {
        readonly type: "TABLE";
        readonly columns: {
            readonly account: ColumnInterface<"GENERIC_ACCOUNT", false>;
            readonly certificateHash: ColumnInterface<"CERTIFICATE_HASH", false>;
            readonly certificate: ColumnInterface<"CERTIFICATE", false>;
            readonly intermediates: ColumnInterface<"CERTIFICATE_BUNDLE", true>;
        };
        readonly key: readonly [Key, Key];
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
    readonly historyVoteBlockHashAccount: {
        readonly type: "INDEX";
        readonly table: "history";
        readonly key: readonly [Key, Key];
    };
    readonly historyOrdered: {
        readonly type: "INDEX";
        readonly table: "history";
        readonly key: readonly [Key];
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
        readonly storing: readonly [Key];
    };
    readonly votesOrderIndex: {
        readonly type: "INDEX";
        readonly table: "votes";
        readonly key: readonly [Key, Key];
        readonly storing: readonly [Key];
    };
    readonly votesExpiredIndex: {
        readonly type: "INDEX";
        readonly table: "votes";
        readonly nullFiltered: true;
        readonly key: readonly [Key, Key];
        readonly storing: readonly [Key];
    };
    readonly votesUidIssuer: {
        readonly type: "INDEX";
        readonly table: "votes";
        readonly key: readonly [Key, Key];
        readonly storing: readonly [Key];
    };
    readonly votesBlockHash: {
        readonly type: "INDEX";
        readonly table: "votes";
        readonly key: readonly [Key];
        readonly storing: readonly [Key];
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
    static getAllTables(): ("blocks" | "permissions" | "votes" | "ledger" | "chain" | "history" | "weight" | "accountInfo" | "accountCertificates" | "heapBlocks" | "heapStorage" | "delegation" | "voteBlocks")[];
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
