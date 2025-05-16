import { Block, BlockHash } from './block';
import type { BlockJSON, BlockJSONOutput } from './block';
import Account from './account';
import type { ASN1Date } from './utils/asn1';
import type { JSONSupported, ToJSONSerializableOptions } from './utils/conversion';
import { BufferStorage } from './utils/buffer';
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
}
export interface VoteJSONOutput extends JSONSupported<VoteJSON> {
    $permanent: boolean;
    $trusted: boolean;
    $uid: string;
}
export interface VoteStapleJSON {
    blocks: BlockJSON[] | BlockJSONOutput[];
    votes: VoteJSON[] | VoteJSONOutput[];
}
declare class VoteHash extends BufferStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is VoteHash;
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
type CertificateExtensions = {
    type: 'context';
    value: number;
    kind: 'explicit';
    contains: [
        [
            CertificateOID,
            boolean,
            Buffer
        ]
    ];
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
 * Parse a set of distinguished names
 */
declare function findRDN(input: any[], findOID: string): any;
declare function blockHashesFromVote(input: Buffer): BlockHash[];
/**
 * A map for VoteBlockHashes
 */
export declare class VoteBlockHashMap<ValueType = unknown> implements Map<VoteBlockHash, ValueType> {
    #private;
    constructor();
    [Symbol.iterator](): IterableIterator<[VoteBlockHash, ValueType]>;
    [Symbol.toStringTag]: string;
    add(key: VoteBlockHash, value: ValueType): this;
    delete(key: VoteBlockHash): boolean;
    get(key: VoteBlockHash): ValueType | undefined;
    forEach(callbackfn: (value: ValueType, key: VoteBlockHash, map: Map<VoteBlockHash, ValueType>) => void, thisArg?: any): void;
    has(key: VoteBlockHash): boolean;
    set(key: VoteBlockHash, value: ValueType): this;
    get size(): number;
    entries(): IterableIterator<[VoteBlockHash, ValueType]>;
    keys(): IterableIterator<VoteBlockHash>;
    values(): IterableIterator<ValueType>;
    clear(): void;
}
/**
 * A VoteBlockHash is a hash of the blocks in a vote staple or vote staple
 * it is a unique ID for the vote or vote staples contents regardless of which
 * votes are included in the staple -- every vote in a vote staple has the same
 * VoteBlockHash.
 */
export declare class VoteBlockHash extends BufferStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is VoteBlockHash;
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
export declare class PossiblyExpiredVote {
    #private;
    readonly issuer: Account;
    readonly serial: bigint;
    readonly blocks: BlockHash[];
    readonly validityFrom: Date;
    readonly validityTo: Date;
    readonly signature: ArrayBuffer;
    readonly $trusted: boolean;
    readonly $permanent: boolean;
    readonly $uid: string;
    protected static allowedSlop: number;
    protected static permanentVoteThreshold: number;
    static Staple: typeof VoteStaple;
    static Builder: typeof VoteBuilder;
    static readonly VoteBlocksHash: typeof VoteBlockHash;
    static isInstance: (obj: any, strict?: boolean) => obj is PossiblyExpiredVote;
    static isValidJSON(voteJSON: VoteJSON | VoteJSONOutput): voteJSON is VoteJSON | VoteJSONOutput;
    static fromJSON(voteJSON: VoteJSON | VoteJSONOutput, options?: VoteOptions): PossiblyExpiredVote | Vote;
    constructor(vote: Buffer | ArrayBuffer | PossiblyExpiredVote | Uint8Array | string | VoteJSON | VoteJSONOutput, options?: VoteOptions);
    toBytes(): ArrayBuffer;
    get hash(): VoteHash;
    get blocksHash(): VoteBlockHash;
    toString(): string;
    toJSON(): VoteJSONOutput;
    protected expirationCheckMoment(): number;
    get expired(): boolean;
}
/**
 * A vote is a certificate issued indicating that the issuer "vouches" for the
 * blocks specified will fit into the ledger of the operator/issuer.
 */
export declare class Vote extends PossiblyExpiredVote {
    readonly possiblyExpired = false;
    static isInstance: (obj: any, strict?: boolean) => obj is Vote;
    constructor(vote: Buffer | ArrayBuffer | Vote | PossiblyExpiredVote | string | VoteJSON | VoteJSONOutput, options?: VoteOptions);
    static toJSONSerializablePrefix: string;
    static toJSONSerializable(value: Vote, opts: ToJSONSerializableOptions): {
        [x: string]: any;
        $permanent: boolean;
        $trusted: boolean;
        $uid: string;
    };
}
/**
 * A vote staple is a distributable block consisting of one or more blocks
 * and one or more votes.
 */
declare class VoteStapleHash extends BufferStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is VoteStapleHash;
    readonly storageKind = "VoteStapleHash";
    get hashFunctionName(): string;
    constructor(stapleHash: ConstructorParameters<typeof BufferStorage>[0]);
}
export declare class VoteStaple {
    #private;
    static readonly VoteBlockHash: typeof VoteBlockHash;
    /**
     * Construct a new staple from votes and blocks
     */
    static fromVotesAndBlocks(votes: Vote[], blocks: Block[], voteOptions?: VoteOptions): VoteStaple;
    /**
     * Convert a list of Votes and Blocks into a VoteStaple
     * This is slightly different from VoteStaple.fromVotesAndBlocks in
     * that it will filter the supplied votes to only include those that
     * are permanent if any permanent votes are present, otherwise only
     * temporary votes will be included
     *
     * Additionally, it will filter out any votes that are expired
     */
    static fromVotesAndBlocksWithFiltering(votes: PossiblyExpiredVote[], blocks: Block[], opts: Parameters<typeof VoteStaple['fromVotesAndBlocks']>[2]): VoteStaple | null;
    static fromVotesAndBlocksToHashMap(votes: PossiblyExpiredVote[], blocks: Block[], opts: Parameters<typeof VoteStaple['fromVotesAndBlocks']>[2] & {
        voteBlockHashes?: VoteBlockHash[];
    }): VoteBlockHashMap<VoteStaple | null>;
    static isValidJSON(staple: VoteStapleJSON): boolean;
    static fromJSON(staple: VoteStapleJSON, voteOptions?: VoteOptions): VoteStaple;
    static isInstance: (obj: any, strict?: boolean) => obj is VoteStaple;
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
     * Get the serialized version as JSON
     */
    toJSON(): {
        votes: VoteJSONOutput[];
        blocks: BlockJSONOutput[];
    };
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
     * Get the votes for this staple
     */
    get votes(): Vote[];
    /**
     * Get the blocks for this staple
     */
    get blocks(): Block[];
    /**
     * Get the timestamp of the staple
     *
     * This is the average of the timestamps of the votes, unless a
     * particular account is specified then that timestamp is used
     * if it issued a vote in the staple.
     */
    timestamp(preferRep?: Account): Date;
    static toJSONSerializablePrefix: string;
    static toJSONSerializable(value: VoteStaple, opts: ToJSONSerializableOptions): {
        votes: VoteJSONOutput[];
        blocks: BlockJSONOutput[];
        $binary?: string;
    };
}
export declare class VoteBuilder {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is VoteBuilder;
    constructor(account: Account, blocks?: (Block | BlockHash)[]);
    addBlocks(blocks: (Block | BlockHash | string)[]): void;
    addBlock(block: Block | BlockHash | string): void;
    generateVoteData(serial: bigint, validTo: Date, validFrom: Date): {
        voteData: ArrayBuffer;
        tbsCertificate: CertificateSchema;
        signatureInfo: CertificateOID[];
    };
    createVote(voteData: ArrayBuffer, tbsCertificate: CertificateSchema, signatureInfo: CertificateOID[], signature: BufferStorage, voteOptions?: VoteOptions): Vote;
    seal(serial: bigint, validTo: Date | null, validFrom?: Date, voteOptions?: VoteOptions): Promise<Vote>;
}
export default Vote;
export declare const Testing: {
    findRDN: typeof findRDN;
    blockHashesFromVote: typeof blockHashesFromVote;
};
