import { Block, BlockHash } from './block';
import type { BlockJSON, BlockJSONOutput, BlockJSONOutputSerialized } from './block';
import Account, { AccountKeyAlgorithm, type StorageAddress, type TokenAddress } from './account';
import type { ASN1Date } from './utils/asn1';
import { type ToJSONSerializableOptions, type ToJSONSerializable } from './utils/conversion';
import { BufferStorage } from './utils/buffer';
/**
 * Representation of the expected fee for this vote
 */
export interface FeeAmountAndToken {
    amount: bigint;
    payTo?: Account | StorageAddress;
    token?: TokenAddress;
}
interface FeeAmountAndTokenJSON {
    amount: string | bigint;
    payTo?: string | Account | StorageAddress;
    token?: string | TokenAddress;
}
/**
 * Representation of the vote
 */
export interface VoteJSON {
    issuer: string | Account;
    serial: string | bigint;
    blocks: string[] | BlockHash[];
    validityFrom: string | Date;
    validityTo: string | Date;
    signature: string | ArrayBuffer;
    fee?: FeeAmountAndTokenJSON;
    quote?: boolean;
}
type VoteJSONOutput = ToJSONSerializable<ReturnType<Vote['toJSON']>>;
export interface VoteStapleJSON {
    blocks: BlockJSON[] | BlockJSONOutput[] | BlockJSONOutputSerialized[];
    votes: VoteJSON[] | VoteJSONOutput[];
}
declare class VoteHash extends BufferStorage {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is VoteHash;
    readonly storageKind = "VoteHash";
    constructor(blockhash: ConstructorParameters<typeof BufferStorage>[0]);
}
type CertificateOID = {
    type: 'oid';
    oid: string;
};
type CertificateVersionInfo = {
    type: 'context';
    value: number;
    kind: 'explicit';
    contains: bigint;
};
type CertificateIssuerOrSubject = {
    type: 'set';
    name: CertificateOID;
    value: {
        type: 'string';
        kind: 'utf8';
        value: string;
    };
};
type CertificateValidity = (ASN1Date | Date);
type CertificatePublicKeyInfo = [CertificateOID[], {
    type: 'bitstring';
    value: Buffer;
}];
export type CertificateExtensionFeeEntry = [
    quote: boolean,
    amount: bigint,
    payTo?: {
        type: 'context';
        value: 0;
        kind: 'implicit';
        contains: Buffer;
    },
    token?: {
        type: 'context';
        value: 1;
        kind: 'implicit';
        contains: Buffer;
    }
];
type CertificateExtensionData = [
    CertificateOID,
    boolean,
    Buffer
];
type CertificateExtensions = {
    type: 'context';
    value: number;
    kind: 'explicit';
    contains: CertificateExtensionData[];
};
type CertificateSchema = [
    version: CertificateVersionInfo,
    serial: bigint,
    signatureAlgo: CertificateOID[],
    issuer: CertificateIssuerOrSubject[],
    validity: [CertificateValidity, CertificateValidity],
    subject: CertificateIssuerOrSubject[],
    publicKey: CertificatePublicKeyInfo,
    extensions: CertificateExtensions
];
/**
 * A map for VoteBlockHashes
 */
export declare class VoteBlockHashMap<ValueType = unknown> implements Map<VoteBlockHash, ValueType> {
    #private;
    constructor();
    [Symbol.iterator](): MapIterator<[VoteBlockHash, ValueType]>;
    [Symbol.dispose](): void;
    [Symbol.toStringTag]: string;
    add(key: VoteBlockHash, value: ValueType): this;
    delete(key: VoteBlockHash): boolean;
    get(key: VoteBlockHash): ValueType | undefined;
    forEach(callbackfn: (value: ValueType, key: VoteBlockHash, map: Map<VoteBlockHash, ValueType>) => void, thisArg?: any): void;
    has(key: VoteBlockHash): boolean;
    set(key: VoteBlockHash, value: ValueType): this;
    get size(): number;
    entries(): MapIterator<[VoteBlockHash, ValueType]>;
    keys(): MapIterator<VoteBlockHash>;
    values(): MapIterator<ValueType>;
    clear(): void;
}
/**
 * A VoteBlockHash is a hash of the blocks in a vote staple or vote staple
 * it is a unique ID for the vote or vote staples contents regardless of which
 * votes are included in the staple -- every vote in a vote staple has the same
 * VoteBlockHash.
 */
export declare class VoteBlockHash extends BufferStorage {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is VoteBlockHash;
    static readonly Map: typeof VoteBlockHashMap;
    readonly storageKind = "VoteBlockHash";
    get hashFunctionName(): string;
    static fromBlockHashes(blockHashes: BlockHash[]): VoteBlockHash;
    static fromVote(vote: PossiblyExpiredVote | Vote): VoteBlockHash;
    static fromVoteStaple(voteStaple: VoteStaple): VoteBlockHash;
    constructor(stapleHash: ConstructorParameters<typeof BufferStorage>[0]);
}
/**
 * Options for Votes
 */
type VoteOptions = {
    /**
     * The instant at which a vote's expiration is validated against (default is moment of instantiation)
     */
    now?: Date;
};
/**
 * Options for Vote Builder
 */
type VoteBuilderOptions = {
    /**
     * Fee amount to add to the vote
     */
    fee?: FeeAmountAndToken;
};
declare class VoteLikeBase {
    #private;
    readonly issuer: Account;
    readonly serial: bigint;
    readonly blocks: BlockHash[];
    readonly validityFrom: Date;
    readonly validityTo: Date;
    readonly signature: ArrayBuffer;
    readonly fee: FeeAmountAndToken | undefined;
    readonly quote: boolean | undefined;
    protected static expectedQuoteValue: boolean;
    readonly $trusted: boolean;
    readonly $permanent: boolean;
    readonly $uid: string;
    readonly $id: string;
    protected static allowedSlop: number;
    protected static permanentVoteThreshold: number;
    static Staple: typeof VoteStaple;
    static Builder: typeof BaseVoteBuilder;
    static readonly VoteBlocksHash: typeof VoteBlockHash;
    static Quote: typeof VoteQuote;
    static readonly isInstance: (obj: any, strict?: boolean) => obj is VoteLikeBase;
    protected getClass<T extends typeof VoteLikeBase>(): T;
    static isValidJSON(voteJSON: VoteJSON | VoteJSONOutput): voteJSON is VoteJSON | VoteJSONOutput;
    static fromJSON<T extends typeof VoteLikeBase = typeof VoteLikeBase>(this: T, voteJSON: VoteJSON | VoteJSONOutput, options?: VoteOptions): InstanceType<T>;
    constructor(vote: Buffer | ArrayBuffer | VoteLikeBase | Uint8Array | string | VoteJSON | VoteJSONOutput, options?: VoteOptions);
    toBytes(): ArrayBuffer;
    get hash(): VoteHash;
    get blocksHash(): VoteBlockHash;
    toString(): string;
    toJSON(options?: ToJSONSerializableOptions): {
        $binary?: string;
        fee?: FeeAmountAndTokenJSON;
        quote?: boolean;
        issuer: Account<AccountKeyAlgorithm.ECDSA_SECP256K1 | AccountKeyAlgorithm.ED25519 | AccountKeyAlgorithm.ECDSA_SECP256R1>;
        serial: bigint;
        blocks: BlockHash[];
        validityFrom: Date;
        validityTo: Date;
        signature: ArrayBuffer;
        $trusted: boolean;
        $permanent: boolean;
        $uid: string;
        $id: string;
    };
    protected expirationCheckMoment(): number;
    get expired(): boolean;
}
export declare class PossiblyExpiredVote extends VoteLikeBase {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is PossiblyExpiredVote;
    constructor(vote: Buffer | ArrayBuffer | VoteLikeBase | string | VoteJSON | VoteJSONOutput, options?: VoteOptions);
}
/**
 * A vote is a certificate issued indicating that the issuer "vouches" for the
 * blocks specified will fit into the ledger of the operator/issuer.
 */
export declare class Vote extends PossiblyExpiredVote {
    static Builder: typeof VoteBuilder;
    readonly possiblyExpired = false;
    static readonly isInstance: (obj: any, strict?: boolean) => obj is Vote;
    constructor(vote: Buffer | ArrayBuffer | VoteLikeBase | string | VoteJSON | VoteJSONOutput, options?: VoteOptions);
}
/**
 * A VoteQuote is a certificate issued indicating what the issuer will charge for fees
 */
export declare class VoteQuote extends VoteLikeBase {
    static Builder: typeof VoteQuoteBuilder;
    protected static expectedQuoteValue: boolean;
    readonly isVoteQuote = true;
    static readonly isInstance: (obj: any, strict?: boolean) => obj is VoteQuote;
    constructor(vote: Buffer | ArrayBuffer | VoteLikeBase | string | VoteJSON | VoteJSONOutput, options?: VoteOptions);
}
/**
 * A vote staple is a distributable block consisting of one or more blocks
 * and one or more votes.
 */
declare class VoteStapleHash extends BufferStorage {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is VoteStapleHash;
    readonly storageKind = "VoteStapleHash";
    get hashFunctionName(): string;
    constructor(stapleHash: ConstructorParameters<typeof BufferStorage>[0]);
}
interface VoteBundleConstructor<T> {
    new (votesStapled: ArrayBuffer | Buffer | VoteStapleJSON | string, voteOptions: VoteOptions): T;
    fromVotesAndBlocks(votes: Vote[], blocks: Block[], voteOptions?: VoteOptions): T;
    fromVotesAndBlocksWithFiltering(votes: PossiblyExpiredVote[], blocks: Block[], opts: Parameters<typeof VoteBlockBundle['fromVotesAndBlocks']>[2]): T | null;
    fromVotesAndBlocksToHashMap(votes: PossiblyExpiredVote[], blocks: Block[], opts: Parameters<typeof VoteBlockBundle['fromVotesAndBlocks']>[2] & {
        voteBlockHashes?: VoteBlockHash[];
    }): VoteBlockHashMap<T | null>;
    fromJSON(staple: VoteStapleJSON, voteOptions: VoteOptions): T;
}
export declare class VoteBlockBundle {
    #private;
    readonly votes: Vote[];
    readonly blocks: Block[];
    static readonly VoteBlockHash: typeof VoteBlockHash;
    static readonly isInstance: (obj: any, strict?: boolean) => obj is VoteBlockBundle;
    /**
     * Construct a new vote bundle from votes and blocks
     */
    static fromVotesAndBlocks<T extends VoteBlockBundle>(this: VoteBundleConstructor<T>, votes: Vote[], blocks: Block[], voteOptions?: VoteOptions): T;
    /**
     * Convert a list of Votes and Blocks into a VoteStaple
     * This is slightly different from VoteStaple.fromVotesAndBlocks in
     * that it will filter the supplied votes to only include those that
     * are permanent if any permanent votes are present, otherwise only
     * temporary votes will be included
     *
     * Additionally, it will filter out any votes that are expired
     */
    static fromVotesAndBlocksWithFiltering<T extends VoteBlockBundle>(this: VoteBundleConstructor<T>, votes: PossiblyExpiredVote[], blocks: Block[], opts: Parameters<typeof VoteBlockBundle['fromVotesAndBlocks']>[2]): T | null;
    static fromVotesAndBlocksToHashMap<T extends VoteBlockBundle>(this: VoteBundleConstructor<T>, votes: PossiblyExpiredVote[], blocks: Block[], opts: Parameters<typeof VoteBlockBundle['fromVotesAndBlocks']>[2] & {
        voteBlockHashes?: VoteBlockHash[];
    }): VoteBlockHashMap<T | null>;
    static isValidJSON(staple: VoteStapleJSON): boolean;
    static fromJSON<T extends VoteBlockBundle>(this: VoteBundleConstructor<T>, staple: VoteStapleJSON, voteOptions?: VoteOptions): T;
    /**
     * Construct a new staple from a message buffer
     */
    constructor(votesStapled: ArrayBuffer | Buffer | VoteStapleJSON | string, voteOptions?: VoteOptions);
    /**
     * Get the serialized version
     */
    toBytes(uncompressed?: boolean): ArrayBuffer;
    toString(): string;
    /**
     * Hash of the Vote Staple -- this is the hash of the data in the
     * canonical form of the staple, which may be different from
     * the hash of the data passed into the this object.
     */
    get hash(): VoteStapleHash;
    /**
     * Get the hash of the blockhashes in the staple -- this is a stable ID
     * for the staple regardless of which votes are included in the staple.
     */
    get blocksHash(): VoteBlockHash;
    /**
     * Get the timestamp of the staple
     *
     * This is the average of the timestamps of the votes, unless a
     * particular account is specified then that timestamp is used
     * if it issued a vote in the staple.
     */
    timestamp(preferRep?: Account): Date;
    toJSON(options?: ToJSONSerializableOptions): {
        $binary?: string;
        votes: {
            $binary?: string;
            fee?: FeeAmountAndTokenJSON;
            quote?: boolean;
            issuer: Account<AccountKeyAlgorithm.ECDSA_SECP256K1 | AccountKeyAlgorithm.ED25519 | AccountKeyAlgorithm.ECDSA_SECP256R1>;
            serial: bigint;
            blocks: BlockHash[];
            validityFrom: Date;
            validityTo: Date;
            signature: ArrayBuffer;
            $trusted: boolean;
            $permanent: boolean;
            $uid: string;
            $id: string;
        }[];
        blocks: {
            $binary?: string;
            signature?: string;
            signatures?: string[];
            version: 1 | 2;
            date: Date;
            previous: BlockHash;
            account: import("./account").GenericAccount;
            purpose: import("./block").BlockPurpose;
            signer: Account | [import("./account").MultisigAddress, any[]];
            network: bigint;
            subnet: bigint | undefined;
            operations: import("./block/operations").ExportedJSONOperation[];
            $hash: BlockHash;
            $opening: boolean;
        }[];
    };
}
export declare class VoteStaple extends VoteBlockBundle {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is VoteStaple;
    constructor(votesStapled: ArrayBuffer | Buffer | VoteStapleJSON | string, voteOptions?: VoteOptions);
}
export declare class BaseVoteBuilder {
    #private;
    protected quote: boolean;
    static readonly isInstance: (obj: any, strict?: boolean) => obj is BaseVoteBuilder;
    constructor(account: Account, blocks?: (Block | BlockHash)[], options?: VoteBuilderOptions);
    addBlocks(blocks: (Block | BlockHash | string)[]): void;
    addBlock(block: Block | BlockHash | string): void;
    addFee(feeInput: FeeAmountAndTokenJSON): void;
    generateVoteData(serial: bigint, validTo: Date, validFrom: Date): {
        voteData: ArrayBuffer;
        tbsCertificate: CertificateSchema;
        signatureInfo: CertificateOID[];
    };
    createVote(voteData: ArrayBuffer, tbsCertificate: CertificateSchema, signatureInfo: CertificateOID[], signature: BufferStorage): ArrayBuffer;
    protected generate(serial: bigint, validTo: Date | null, validFrom?: Date): Promise<ArrayBuffer>;
}
export declare class VoteBuilder extends BaseVoteBuilder {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is VoteBuilder;
    seal(serial: bigint, validTo: Date | null, validFrom?: Date, voteOptions?: VoteOptions): Promise<Vote>;
}
export declare class VoteQuoteBuilder extends BaseVoteBuilder {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is VoteQuoteBuilder;
    protected quote: boolean;
    seal(serial: bigint, validTo: Date | null, validFrom?: Date, voteOptions?: VoteOptions): Promise<VoteQuote>;
}
export default Vote;
