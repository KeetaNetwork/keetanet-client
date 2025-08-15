import type { GenericAccount, MultisigAddress } from '../account';
import Account, { AccountKeyAlgorithm } from '../account';
import { BufferStorage } from '../utils/buffer';
import * as ASN1 from '../utils/asn1';
import type { ToJSONSerializable, ToJSONSerializableOptions } from '../utils/conversion';
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
    static isInstance: (obj: any, strict?: boolean) => obj is BlockHash;
    static Set: import("../utils/helper").InstanceSetConstructor<BlockHash, BlockHashString>;
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
 * Block signature
 */
type BlockSignature = Buffer;
/**
 * Representation of the block
 */
export interface BlockV1JSON {
    version: 1;
    purpose?: BlockPurpose.GENERIC;
    date: string | Date;
    previous: string | BlockHash;
    network: string | NetworkID;
    subnet?: string | SubnetID;
    account: string | GenericAccount;
    signer: string | Account;
    signature: string | BlockSignature;
    operations: Operations.BlockJSONOperations[] | Operations.BlockOperations[];
}
export type BlockV1JSONIncomplete = Partial<BlockV1JSON>;
/**
 * Output of block suitable to JSON serialization
 */
/**
 * Representation of the block V2
 */
export interface BlockV2JSON {
    version: 2;
    purpose: BlockPurpose;
    date: string | Date;
    previous: string | BlockHash;
    network: string | NetworkID;
    subnet?: string | SubnetID;
    account: string | GenericAccount;
    signer: BlockSignerFieldJSON;
    signatures: (string | BlockSignature)[];
    operations: (Operations.BlockJSONOperations | Operations.BlockOperations)[];
}
export type BlockV2JSONIncomplete = Partial<BlockV2JSON>;
export type BlockJSONOutput = ReturnType<Block['toJSON']>;
export type BlockJSONOutputSerialized = ToJSONSerializable<BlockJSONOutput>;
export type BlockJSONOutputIncomplete = Partial<BlockJSONOutputSerialized>;
export type BlockJSON = (Omit<BlockV1JSON, 'version'> | Omit<BlockV2JSON, 'version'>) & {
    version: number;
};
export type BlockJSONIncomplete = Partial<BlockJSON>;
/**
 * Map input to our values
 */
interface BlockV1UnsignedCanonical {
    version: 1;
    date: Date;
    previous: BlockHash;
    account: GenericAccount;
    signer: Account;
    operations: Operations.BlockOperations[];
    network: NetworkID;
    subnet: SubnetID | undefined;
    signature?: never;
}
interface BlockV1Canonical extends Omit<BlockV1UnsignedCanonical, 'signature'> {
    signature: BlockSignature;
}
interface BlockV2UnsignedCanonical {
    version: 2;
    date: Date;
    purpose: BlockPurpose;
    previous: BlockHash;
    account: GenericAccount;
    signer: BlockSignerField;
    operations: Operations.BlockOperations[];
    network: NetworkID;
    subnet: SubnetID | undefined;
    signatures?: never;
}
interface BlockV2Canonical extends Omit<BlockV2UnsignedCanonical, 'signatures'> {
    signatures: BlockSignature[];
}
type OmitLastArrayValue<T> = Required<T> extends [...infer Head, any] ? Head : never;
type BlockV1ASN1WithoutSignature = ASN1.ValidateASN1.SchemaMap<OmitLastArrayValue<typeof BlockV1ASN1Schema>>;
type BlockV2ASN1WithoutSignature = ASN1.ValidateASN1.SchemaMap<OmitLastArrayValue<typeof BlockV2ASN1Schema.contains>>;
type MultisigSignerFieldJSON = [MultisigAddress | string, (MultisigSignerField | Account | string)[]];
type BlockSignerFieldJSON = Account | string | MultisigSignerFieldJSON;
type BlockASN1SchemaWithoutSignature = BlockV1ASN1WithoutSignature | {
    type: 'context';
    kind: 'explicit';
    value: 1;
    contains: BlockV2ASN1WithoutSignature;
};
type MultisigSignerField = [MultisigAddress, (MultisigSignerField | Account)[]];
type BlockSignerField = Account | [MultisigAddress, BlockSignerField[]];
type BlockSignatureField = [BlockSignature, ...BlockSignature[]];
/**
 * Block:  An item which contains a number of operations (transactions) which
 * originated from an account at a particular instant
 */
export declare class Block implements Omit<BlockV2Canonical, 'version'> {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is Block;
    static Hash: typeof BlockHash;
    static OperationType: typeof Operations.OperationType;
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
    static AdjustMethod: typeof AdjustMethod;
    static Purpose: typeof BlockPurpose;
    static Builder: typeof BlockBuilder;
    readonly version: 1 | 2;
    readonly purpose: BlockPurpose;
    readonly date: Date;
    readonly previous: BlockHash;
    readonly account: GenericAccount;
    readonly operations: BlockV2Canonical['operations'];
    readonly network: NetworkID;
    readonly subnet: SubnetID | undefined;
    readonly signer: BlockSignerField;
    readonly signatures: BlockSignatureField;
    get principal(): Account<AccountKeyAlgorithm.ECDSA_SECP256K1 | AccountKeyAlgorithm.ED25519 | AccountKeyAlgorithm.ECDSA_SECP256R1> | MultisigAddress;
    readonly $opening: boolean;
    static fromUnsignedJSON(input: BlockV1UnsignedCanonical | BlockV2UnsignedCanonical): Promise<Block>;
    static isValidJSON<Version extends 1 | 2>(block: unknown, version?: Version): block is ({
        1: BlockV1JSON;
        2: BlockV2JSON;
    }[Version]);
    constructor(input: Buffer | ArrayBuffer | BlockJSON | BlockJSONOutput | BlockJSONOutputSerialized | Block | string);
    static getAccountOpeningHash(account: GenericAccount): BlockHash;
    toBytes(includeSignatures?: boolean): ArrayBuffer;
    protected static getV1ASN1ContainerWithoutSignature(input: BlockV1UnsignedCanonical | BlockV1Canonical): BlockV1ASN1WithoutSignature;
    protected static getV2ASN1ContainerWithoutSignature(input: BlockV2UnsignedCanonical | BlockV2Canonical): BlockV2ASN1WithoutSignature;
    protected static getASN1ContainerWithoutSignature(input: BlockV1UnsignedCanonical | BlockV1Canonical | BlockV2UnsignedCanonical | BlockV2Canonical): BlockASN1SchemaWithoutSignature;
    toJSON(options?: ToJSONSerializableOptions): {
        $binary?: string;
        signature?: string;
        signatures?: string[];
        version: 1 | 2;
        date: Date;
        previous: BlockHash;
        account: GenericAccount;
        purpose: BlockPurpose;
        signer: Account | [MultisigAddress, any[]];
        network: bigint;
        subnet: bigint | undefined;
        operations: Operations.ExportedJSONOperation[];
        $hash: BlockHash;
        $opening: boolean;
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
        $binary?: string;
        signature?: string;
        signatures?: string[];
        version: 1 | 2;
        date: Date;
        previous: BlockHash;
        account: GenericAccount;
        purpose: BlockPurpose;
        signer: Account | [MultisigAddress, any[]];
        network: bigint;
        subnet: bigint | undefined;
        operations: Operations.ExportedJSONOperation[];
        $hash: BlockHash;
        $opening: boolean;
    } | {
        version: number | undefined;
        date: Date | undefined;
        previous: BlockHash | undefined;
        account: GenericAccount | undefined;
        signer: BlockSignerFieldJSON | undefined;
        network: bigint | undefined;
        subnet: bigint | undefined;
        operations: Operations.BlockOperations[] | undefined;
        purpose: BlockPurpose;
        $opening: boolean | undefined;
    };
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
