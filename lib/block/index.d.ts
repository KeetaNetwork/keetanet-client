import type { GenericAccount, MultisigAddress } from '../account';
import Account, { AccountKeyAlgorithm } from '../account';
import { BufferStorage } from '../utils/buffer';
import * as ASN1 from '../utils/asn1';
import { type ToJSONSerializable, type ToJSONSerializableOptions } from '../utils/conversion';
import * as Operations from './operations';
export declare enum BlockPurpose {
    GENERIC = 0,
    FEE = 1
}
export declare enum AdjustMethod {
    ADD = 0,
    SUBTRACT = 1,
    SET = 2
}
export declare function toAdjustMethod(value: unknown): AdjustMethod;
type BlockHashString = string & {
    readonly __blockhash: never;
};
/**
 * Block hash
 */
export declare class BlockHash extends BufferStorage {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is BlockHash;
    static readonly Set: import("../utils/helper").InstanceSetConstructor<BlockHash, BlockHashString>;
    static getAccountOpeningHash(account: GenericAccount): BlockHash;
    fromData(data: Buffer): BlockHash;
    get hashFunctionName(): string;
    constructor(blockhash: ConstructorParameters<typeof BufferStorage>[0]);
    toJSON(): BlockHashString;
    toString(): BlockHashString;
}
/**
 * Network ID
 */
type NetworkID = bigint;
/**
 * Subnet ID
 */
type SubnetID = bigint;
/**
 * Idempotent Key
 */
type UserIdempotentKey = Buffer;
/**
 * Block signature
 */
type BlockSignature = Buffer;
/**
 * Representation of the block
 */
export interface BlockV1JSON {
    version: 1;
    network: string | NetworkID;
    subnet?: string | SubnetID;
    idempotent?: string | UserIdempotentKey;
    date: string | Date;
    signer: string | Account;
    account: string | GenericAccount;
    previous: string | BlockHash;
    operations: Operations.BlockJSONOperations[] | Operations.BlockOperations[];
    signature: string | BlockSignature;
    purpose?: BlockPurpose.GENERIC;
}
export type BlockV1JSONIncomplete = Partial<BlockV1JSON>;
type BlockV1JSONOptionalSigned = Omit<BlockV1JSON, 'signature'> & {
    signature?: BlockV1JSON['signature'];
};
/**
 * Output of block suitable to JSON serialization
 */
/**
 * Representation of the block V2
 */
export interface BlockV2JSON {
    version: 2;
    network: string | NetworkID;
    subnet?: string | SubnetID;
    idempotent?: string | UserIdempotentKey;
    date: string | Date;
    purpose: BlockPurpose;
    account: string | GenericAccount;
    signer: BlockSignerFieldJSON;
    previous: string | BlockHash;
    operations: (Operations.BlockJSONOperations | Operations.BlockOperations)[];
    signatures: (string | BlockSignature)[];
}
export type BlockV2JSONIncomplete = Partial<BlockV2JSON>;
type BlockV2JSONOptionalSigned = Omit<BlockV2JSON, 'signatures'> & {
    signatures?: BlockV2JSON['signatures'];
};
export type BlockJSONOutput = ReturnType<Block['toJSON']>;
export type BlockJSONOutputSerialized = ToJSONSerializable<BlockJSONOutput>;
export type BlockJSONOutputIncomplete = Partial<BlockJSONOutputSerialized>;
export type BlockJSON = (Omit<BlockV1JSON, 'version'> | Omit<BlockV2JSON, 'version'>) & {
    version: number;
};
export type BlockJSONOptionalSigned = ((Omit<BlockV1JSON, 'version' | 'signature'> & {
    signature?: BlockV1JSON['signature'];
}) | (Omit<BlockV2JSON, 'version' | 'signatures'> & {
    signatures?: BlockV2JSON['signatures'];
})) & {
    version: number;
};
export type BlockJSONIncomplete = Partial<BlockJSON>;
/**
 * Map input to our values
 */
interface BlockV1UnsignedCanonical {
    version: 1;
    network: NetworkID;
    subnet: SubnetID | undefined;
    idempotent: UserIdempotentKey | undefined;
    date: Date;
    signer: Account;
    account: GenericAccount;
    previous: BlockHash;
    operations: Operations.BlockOperations[];
    signature?: never;
}
interface BlockV1Canonical extends Omit<BlockV1UnsignedCanonical, 'signature'> {
    signature: BlockSignature;
}
interface BlockV2UnsignedCanonical {
    version: 2;
    network: NetworkID;
    subnet: SubnetID | undefined;
    idempotent: UserIdempotentKey | undefined;
    date: Date;
    purpose: BlockPurpose;
    account: GenericAccount;
    signer: BlockSignerField;
    previous: BlockHash;
    operations: Operations.BlockOperations[];
    signatures?: never;
}
interface BlockV2Canonical extends Omit<BlockV2UnsignedCanonical, 'signatures'> {
    signatures: BlockSignature[];
}
type OmitLastArrayValue<T> = Required<T> extends [...infer Head, any] ? Head : never;
type BlockV1ASN1WithoutSignature = ASN1.ValidateASN1.SchemaMap<OmitLastArrayValue<typeof BlockV1ASN1Schema>>;
type BlockV2ASN1WithoutSignature = ASN1.ValidateASN1.SchemaMap<OmitLastArrayValue<typeof BlockV2ASN1Schema.contains>>;
type MultisigSignerFieldJSON = [MultisigAddress | string, (MultisigSignerFieldJSON | Account | string)[]];
type BlockSignerFieldJSON = Account | string | MultisigSignerFieldJSON;
type BlockASN1SchemaWithoutSignature = BlockV1ASN1WithoutSignature | {
    type: 'context';
    kind: 'explicit';
    value: 1;
    contains: BlockV2ASN1WithoutSignature;
};
type BlockSignerField = Account | [MultisigAddress, BlockSignerField[]];
type BlockSignatureField = [BlockSignature, ...BlockSignature[]];
/**
 * Block:  An item which contains a number of operations (transactions) which
 * originated from an account at a particular instant
 */
declare abstract class PossiblyUnsignedBlock<HasSignature extends boolean> implements Omit<BlockV2Canonical, 'version' | 'signatures'> {
    #private;
    static readonly Hash: typeof BlockHash;
    static readonly OperationType: typeof Operations.OperationType;
    static readonly Operation: {
        SEND: typeof Operations.BlockOperationSEND;
        SET_REP: typeof Operations.BlockOperationSET_REP;
        SET_INFO: typeof Operations.BlockOperationSET_INFO;
        MODIFY_PERMISSIONS: typeof Operations.BlockOperationMODIFY_PERMISSIONS;
        CREATE_IDENTIFIER: typeof Operations.BlockOperationCREATE_IDENTIFIER;
        TOKEN_ADMIN_SUPPLY: typeof Operations.BlockOperationTOKEN_ADMIN_SUPPLY;
        TOKEN_ADMIN_MODIFY_BALANCE: typeof Operations.BlockOperationTOKEN_ADMIN_MODIFY_BALANCE;
        RECEIVE: typeof Operations.BlockOperationRECEIVE;
        MANAGE_CERTIFICATE: typeof Operations.BlockOperationMANAGE_CERTIFICATE;
    };
    static readonly NO_PREVIOUS = "9bd05fa2-8e59-42a2-8153-26d8e8c10143:NO_PREVIOUS";
    static readonly AdjustMethod: typeof AdjustMethod;
    static readonly Purpose: typeof BlockPurpose;
    static Builder: typeof BlockBuilder;
    readonly version: 1 | 2;
    readonly purpose: BlockPurpose;
    readonly idempotent: UserIdempotentKey | undefined;
    readonly date: Date;
    readonly previous: BlockHash;
    readonly account: GenericAccount;
    readonly operations: BlockV2Canonical['operations'];
    readonly network: NetworkID;
    readonly subnet: SubnetID | undefined;
    readonly signer: BlockSignerField;
    readonly signatures: HasSignature extends true ? BlockSignatureField : null;
    get principal(): MultisigAddress | Account<import("../account").KeyPairKeyAlgorithm>;
    protected static getSortedRequiredSigners(input: BlockSignerField): Account[];
    readonly $opening: boolean;
    protected static isValidJSONSignedOrUnsigned<AssertSignatureField extends boolean, Version extends 1 | 2>(assertSignatureIncluded: AssertSignatureField, block: unknown, version?: Version): block is AssertSignatureField extends true ? ({
        1: BlockV1JSON;
        2: BlockV2JSON;
    }[Version]) : ({
        1: BlockV1JSONOptionalSigned;
        2: BlockV2JSONOptionalSigned;
    }[Version]);
    constructor(input: Buffer | ArrayBuffer | BlockJSON | BlockJSONOptionalSigned | BlockJSONOutput | BlockJSONOutputSerialized | UnsignedBlock | Block | string, hasSignature: HasSignature);
    static getAccountOpeningHash(account: GenericAccount): BlockHash;
    toBytes(includeSignatures?: HasSignature): ArrayBuffer;
    protected static getV1ASN1ContainerWithoutSignature(input: BlockV1UnsignedCanonical | BlockV1Canonical): BlockV1ASN1WithoutSignature;
    protected static getV2ASN1ContainerWithoutSignature(input: BlockV2UnsignedCanonical | BlockV2Canonical): BlockV2ASN1WithoutSignature;
    protected static getASN1ContainerWithoutSignature(input: Omit<BlockV1UnsignedCanonical, 'signature'> | Omit<BlockV2UnsignedCanonical, 'signatures'>): BlockASN1SchemaWithoutSignature;
    toJSON(options?: ToJSONSerializableOptions): {
        version: 1 | 2;
        date: string;
        previous: BlockHashString;
        account: import("../account").TokenPublicKeyString | import("../account").NetworkPublicKeyString | import("../account").StoragePublicKeyString | import("../account").MultisigPublicKeyString | import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString;
        purpose: BlockPurpose;
        signer: import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString | [import("../account").MultisigPublicKeyString, (import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString | [import("../account").MultisigPublicKeyString, (import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString | [import("../account").MultisigPublicKeyString, (import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString | [import("../account").MultisigPublicKeyString, (import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString | [never, never[]])[]])[]])[]])[]];
        network: string;
        operations: (({
            type: Operations.OperationType.SEND;
            to: string;
            amount: string;
            token: import("../account").TokenPublicKeyString;
        } & {
            external?: string | undefined;
        }) | ({
            type: Operations.OperationType.SET_REP;
            to: string;
        } & {}) | ({
            type: Operations.OperationType.SET_INFO;
            name: string;
            description: string;
            metadata: string;
        } & {
            defaultPermission?: false | [string, number[]] | [string, string] | [number[] | import("../permissions").BaseFlagNames, number[]] | undefined;
        }) | ({
            type: Operations.OperationType.MODIFY_PERMISSIONS;
            principal: string;
            method: AdjustMethod;
            permissions: false | [string, number[]] | [string, string] | [number[] | import("../permissions").BaseFlagNames, number[]] | null;
        } & {
            target?: string | undefined;
        }) | ({
            type: Operations.OperationType.CREATE_IDENTIFIER;
            identifier: string;
        } & {
            createArguments?: ({
                type: AccountKeyAlgorithm.MULTISIG;
                signers: (import("../account").MultisigPublicKeyString | import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString)[];
                quorum: string;
            } & {}) | ({
                type: AccountKeyAlgorithm.MULTISIG;
                signers: (import("../account").MultisigPublicKeyString | import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString)[];
                quorum: string;
            } & {}) | undefined;
        }) | ({
            type: Operations.OperationType.TOKEN_ADMIN_SUPPLY;
            amount: string;
            method: AdjustMethod.ADD | AdjustMethod.SUBTRACT;
        } & {}) | ({
            type: Operations.OperationType.TOKEN_ADMIN_MODIFY_BALANCE;
            token: import("../account").TokenPublicKeyString;
            amount: string;
            method: AdjustMethod;
        } & {}) | ({
            type: Operations.OperationType.RECEIVE;
            amount: string;
            token: import("../account").TokenPublicKeyString;
            from: string;
        } & {
            forward?: string | undefined;
            exact?: boolean | undefined;
        }) | ({
            type: Operations.OperationType.MANAGE_CERTIFICATE;
            certificateOrHash: string | (string & {
                readonly __certificateHash: never;
            }) | ({
                serial: string;
                notBefore: string;
                notAfter: string;
                subject: string;
                issuer: string;
                subjectPublicKey: import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString;
                subjectDN: {
                    name: string;
                    value: string;
                }[];
                issuerDN: {
                    name: string;
                    value: string;
                }[];
                $hash: string & {
                    readonly __certificateHash: never;
                };
            } & {
                $binary?: string | undefined;
                $chain?: undefined;
                baseExtensions?: ({} & {
                    basicConstraints?: [ca: boolean, pathLenConstraint?: string | null | undefined] | undefined;
                    keyUsage?: {
                        digitalSignature?: boolean | undefined;
                        nonRepudiation?: boolean | undefined;
                        keyEncipherment?: boolean | undefined;
                        dataEncipherment?: boolean | undefined;
                        keyAgreement?: boolean | undefined;
                        keyCertSign?: boolean | undefined;
                        cRLSign?: boolean | undefined;
                        encipherOnly?: boolean | undefined;
                        decipherOnly?: boolean | undefined;
                    } | undefined;
                    subjectKeyIdentifier?: string | undefined;
                    authorityKeyIdentifier?: ({
                        type: "context";
                        value: 0;
                        contains: string;
                    } & {}) | undefined;
                }) | undefined;
            }) | ({
                serial: string;
                notBefore: string;
                notAfter: string;
                subject: string;
                issuer: string;
                subjectPublicKey: import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString;
                subjectDN: {
                    name: string;
                    value: string;
                }[];
                issuerDN: {
                    name: string;
                    value: string;
                }[];
                $hash: string & {
                    readonly __certificateHash: never;
                };
            } & {
                $binary?: string | undefined;
                $chain?: undefined;
                baseExtensions?: ({} & {
                    basicConstraints?: [ca: boolean, pathLenConstraint?: string | null | undefined] | undefined;
                    keyUsage?: {
                        digitalSignature?: boolean | undefined;
                        nonRepudiation?: boolean | undefined;
                        keyEncipherment?: boolean | undefined;
                        dataEncipherment?: boolean | undefined;
                        keyAgreement?: boolean | undefined;
                        keyCertSign?: boolean | undefined;
                        cRLSign?: boolean | undefined;
                        encipherOnly?: boolean | undefined;
                        decipherOnly?: boolean | undefined;
                    } | undefined;
                    subjectKeyIdentifier?: string | undefined;
                    authorityKeyIdentifier?: ({
                        type: "context";
                        value: 0;
                        contains: string;
                    } & {}) | undefined;
                }) | undefined;
            });
            method: Exclude<AdjustMethod, AdjustMethod.SET>;
        } & {
            intermediateCertificates?: string | {
                certificates: string[];
            } | null | undefined;
        }))[];
        $hash: BlockHashString;
        $opening: boolean;
    } & {
        $binary?: string | undefined;
        signature?: string | undefined;
        signatures?: string[] | undefined;
        idempotent?: string | undefined;
        subnet?: string | undefined;
    };
    /**
     * Hash of the block minus the signature
     *
     * XXX:TODO: Should the hash of the block normally include the
     *           signature ?  One reason against is that it would
     *           allow for identical blocks that only differ by
     *           signature (which isn't signed)
     */
    get hash(): BlockHash;
}
export declare class UnsignedBlock extends PossiblyUnsignedBlock<false> implements Omit<BlockV2Canonical, 'version' | 'signatures'> {
    static isInstance: (obj: any, strict?: boolean) => obj is UnsignedBlock;
    constructor(input: ConstructorParameters<typeof PossiblyUnsignedBlock>[0]);
    static isValidJSON<Version extends 1 | 2>(block: unknown, version?: Version): block is ({
        1: Omit<BlockV1JSON, 'signature'>;
        2: Omit<BlockV2JSON, 'signatures'>;
    }[Version]);
    static fromUnsignedJSON(input: BlockV1UnsignedCanonical | BlockV2UnsignedCanonical): Promise<UnsignedBlock>;
    seal(): Promise<Block>;
}
export declare class Block extends PossiblyUnsignedBlock<true> implements Omit<BlockV2Canonical, 'version'> {
    static isInstance: (obj: any, strict?: boolean) => obj is Block;
    constructor(input: ConstructorParameters<typeof PossiblyUnsignedBlock>[0]);
    static isValidJSON<Version extends 1 | 2>(block: unknown, version?: Version): block is ({
        1: BlockV1JSON;
        2: BlockV2JSON;
    }[Version]);
    static fromUnsignedJSON(input: Omit<BlockV1UnsignedCanonical, 'signature'> | Omit<BlockV2UnsignedCanonical, 'signatures'>): Promise<Block>;
    getUnsignedBlock(): UnsignedBlock;
}
export declare class BlockBuilder {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BlockBuilder;
    static OperationType: typeof Operations.OperationType;
    static AdjustMethod: typeof AdjustMethod;
    static Operation: {
        SEND: typeof Operations.BlockOperationSEND;
        SET_REP: typeof Operations.BlockOperationSET_REP;
        SET_INFO: typeof Operations.BlockOperationSET_INFO;
        MODIFY_PERMISSIONS: typeof Operations.BlockOperationMODIFY_PERMISSIONS;
        CREATE_IDENTIFIER: typeof Operations.BlockOperationCREATE_IDENTIFIER;
        TOKEN_ADMIN_SUPPLY: typeof Operations.BlockOperationTOKEN_ADMIN_SUPPLY;
        TOKEN_ADMIN_MODIFY_BALANCE: typeof Operations.BlockOperationTOKEN_ADMIN_MODIFY_BALANCE;
        RECEIVE: typeof Operations.BlockOperationRECEIVE;
        MANAGE_CERTIFICATE: typeof Operations.BlockOperationMANAGE_CERTIFICATE;
    };
    static NO_PREVIOUS: string;
    constructor(block?: BlockJSON | BlockJSONIncomplete | BlockJSONOutputSerialized | ReturnType<Block['toJSON']> | Block | ArrayBuffer | string);
    protected get currentBlock(): Block | BlockJSONIncomplete;
    protected get currentWIP(): BlockJSONIncomplete;
    protected get currentBlockSealed(): Block;
    toJSON(opts?: ToJSONSerializableOptions): {
        purpose: BlockPurpose;
    } & {
        version?: number | undefined;
        idempotent?: string | undefined;
        date?: string | undefined;
        previous?: BlockHashString | undefined;
        account?: import("../account").TokenPublicKeyString | import("../account").NetworkPublicKeyString | import("../account").StoragePublicKeyString | import("../account").MultisigPublicKeyString | import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString | undefined;
        signer?: string | [string, (string | [string, (string | [string, (string | [string, (string | [string, never[]])[]])[]])[]])[]] | undefined;
        network?: string | undefined;
        subnet?: string | undefined;
        operations?: (({
            type: Operations.OperationType.SEND;
            to: string;
            amount: string;
            token: import("../account").TokenPublicKeyString;
        } & {
            external?: string | undefined;
        }) | ({
            type: Operations.OperationType.SET_REP;
            to: string;
        } & {}) | ({
            type: Operations.OperationType.SET_INFO;
            name: string;
            description: string;
            metadata: string;
        } & {
            defaultPermission?: false | [string, number[]] | [string, string] | [number[] | import("../permissions").BaseFlagNames, number[]] | undefined;
        }) | ({
            type: Operations.OperationType.MODIFY_PERMISSIONS;
            principal: string;
            method: AdjustMethod;
            permissions: false | [string, number[]] | [string, string] | [number[] | import("../permissions").BaseFlagNames, number[]] | null;
        } & {
            target?: string | undefined;
        }) | ({
            type: Operations.OperationType.CREATE_IDENTIFIER;
            identifier: string;
        } & {
            createArguments?: ({
                type: AccountKeyAlgorithm.MULTISIG;
                signers: (import("../account").MultisigPublicKeyString | import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString)[];
                quorum: string;
            } & {}) | ({
                type: AccountKeyAlgorithm.MULTISIG;
                signers: (import("../account").MultisigPublicKeyString | import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString)[];
                quorum: string;
            } & {}) | undefined;
        }) | ({
            type: Operations.OperationType.TOKEN_ADMIN_SUPPLY;
            amount: string;
            method: AdjustMethod.ADD | AdjustMethod.SUBTRACT;
        } & {}) | ({
            type: Operations.OperationType.TOKEN_ADMIN_MODIFY_BALANCE;
            token: import("../account").TokenPublicKeyString;
            amount: string;
            method: AdjustMethod;
        } & {}) | ({
            type: Operations.OperationType.RECEIVE;
            amount: string;
            token: import("../account").TokenPublicKeyString;
            from: string;
        } & {
            forward?: string | undefined;
            exact?: boolean | undefined;
        }) | ({
            type: Operations.OperationType.MANAGE_CERTIFICATE;
            certificateOrHash: string | (string & {
                readonly __certificateHash: never;
            }) | ({
                serial: string;
                notBefore: string;
                notAfter: string;
                subject: string;
                issuer: string;
                subjectPublicKey: import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString;
                subjectDN: {
                    name: string;
                    value: string;
                }[];
                issuerDN: {
                    name: string;
                    value: string;
                }[];
                $hash: string & {
                    readonly __certificateHash: never;
                };
            } & {
                $binary?: string | undefined;
                $chain?: undefined;
                baseExtensions?: ({} & {
                    basicConstraints?: [ca: boolean, pathLenConstraint?: string | null | undefined] | undefined;
                    keyUsage?: {
                        digitalSignature?: boolean | undefined;
                        nonRepudiation?: boolean | undefined;
                        keyEncipherment?: boolean | undefined;
                        dataEncipherment?: boolean | undefined;
                        keyAgreement?: boolean | undefined;
                        keyCertSign?: boolean | undefined;
                        cRLSign?: boolean | undefined;
                        encipherOnly?: boolean | undefined;
                        decipherOnly?: boolean | undefined;
                    } | undefined;
                    subjectKeyIdentifier?: string | undefined;
                    authorityKeyIdentifier?: ({
                        type: "context";
                        value: 0;
                        contains: string;
                    } & {}) | undefined;
                }) | undefined;
            }) | ({
                serial: string;
                notBefore: string;
                notAfter: string;
                subject: string;
                issuer: string;
                subjectPublicKey: import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString;
                subjectDN: {
                    name: string;
                    value: string;
                }[];
                issuerDN: {
                    name: string;
                    value: string;
                }[];
                $hash: string & {
                    readonly __certificateHash: never;
                };
            } & {
                $binary?: string | undefined;
                $chain?: undefined;
                baseExtensions?: ({} & {
                    basicConstraints?: [ca: boolean, pathLenConstraint?: string | null | undefined] | undefined;
                    keyUsage?: {
                        digitalSignature?: boolean | undefined;
                        nonRepudiation?: boolean | undefined;
                        keyEncipherment?: boolean | undefined;
                        dataEncipherment?: boolean | undefined;
                        keyAgreement?: boolean | undefined;
                        keyCertSign?: boolean | undefined;
                        cRLSign?: boolean | undefined;
                        encipherOnly?: boolean | undefined;
                        decipherOnly?: boolean | undefined;
                    } | undefined;
                    subjectKeyIdentifier?: string | undefined;
                    authorityKeyIdentifier?: ({
                        type: "context";
                        value: 0;
                        contains: string;
                    } & {}) | undefined;
                }) | undefined;
            });
            method: Exclude<AdjustMethod, AdjustMethod.SET>;
        } & {
            intermediateCertificates?: string | {
                certificates: string[];
            } | null | undefined;
        }))[] | undefined;
        $opening?: boolean | undefined;
    };
    getUnsignedBlock(): Promise<UnsignedBlock>;
    seal(): Promise<Block>;
    unseal(): BlockJSONIncomplete;
    get sealed(): boolean;
    get block(): Block | undefined;
    get hash(): BlockHash | undefined;
    set signer(signer: BlockV2JSONIncomplete['signer'] | BlockV2JSON['signer']);
    get signer(): BlockV2JSON['signer'] | undefined;
    set account(account: string | GenericAccount | undefined);
    get account(): GenericAccount | undefined;
    set previous(blockhash: string | BlockHash | undefined);
    get previous(): BlockHash | undefined;
    get $opening(): boolean | undefined;
    set idempotent(idempotent: string | ArrayBuffer | Buffer);
    get idempotent(): string | undefined;
    set date(date: Date | string | undefined);
    get date(): Date | undefined;
    set version(version: number | undefined);
    get version(): number | undefined;
    set purpose(purpose: BlockPurpose | undefined);
    get purpose(): BlockPurpose;
    set network(network: NetworkID | string | undefined);
    get network(): NetworkID | undefined;
    set subnet(subnet: SubnetID | string | undefined);
    get subnet(): SubnetID | undefined;
    addOperation(operation: Operations.BlockJSONOperations): void;
    get operations(): Operations.BlockOperations[] | undefined;
}
export default Block;
