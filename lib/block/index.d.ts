import type { GenericAccount } from '../account';
import Account from '../account';
import { BufferStorage } from '../utils/buffer';
import * as ASN1 from '../utils/asn1';
import type { JSONSupported, ToJSONSerializableOptions } from '../utils/conversion';
import * as Operations from './operations';
export declare enum AdjustMethod {
    ADD = 0,
    SUBTRACT = 1,
    SET = 2
}
export declare function assertAdjustMethod(value: any, bigintOkay?: boolean): AdjustMethod;
/**
 * Block hash
 */
export declare class BlockHash extends BufferStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is BlockHash;
    static Set: import("../utils/helper").InstanceSetConstructor<BlockHash, string>;
    static getAccountOpeningHash(account: GenericAccount): BlockHash;
    fromData(data: Buffer): BlockHash;
    get hashFunctionName(): string;
    constructor(blockhash: ConstructorParameters<typeof BufferStorage>[0]);
    static toJSONSerializablePrefix: string;
    static toJSONSerializable(value: BlockHash, _ignore_opts: ToJSONSerializableOptions): string;
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
export interface BlockJSON {
    version: number;
    date: string | Date;
    previous: string | BlockHash;
    network: string | NetworkID;
    subnet?: string | SubnetID;
    account: string | GenericAccount;
    signer: string | Account;
    signature: string | BlockSignature;
    operations: Operations.BlockJSONOperations[] | Operations.BlockOperations[];
}
export type BlockJSONIncomplete = Partial<BlockJSON>;
/**
 * Output of block suitable to JSON serialization
 */
export interface BlockJSONOutput extends JSONSupported<Omit<BlockJSON, 'operations'>> {
    operations: JSONSupported<Operations.BlockJSONOperations>[];
    $hash: string;
    $opening: boolean;
}
export type BlockJSONOutputIncomplete = Partial<BlockJSONOutput>;
/**
 * Map input to our values
 */
interface BlockUnsignedCanonical {
    version: number;
    date: Date;
    previous: BlockHash;
    account: GenericAccount;
    signer: Account;
    operations: Operations.BlockOperations[];
    network: NetworkID;
    subnet: SubnetID | undefined;
    signature: never;
}
interface BlockCanonical extends Omit<BlockUnsignedCanonical, 'signature'> {
    signature: BlockSignature;
}
type BlockASN1WithoutSignature = ASN1.ValidateASN1.SchemaMap<[typeof BlockASN1Schema[0], typeof BlockASN1Schema[1], typeof BlockASN1Schema[2], typeof BlockASN1Schema[3], typeof BlockASN1Schema[4], typeof BlockASN1Schema[5], typeof BlockASN1Schema[6], typeof BlockASN1Schema[7]]>;
/**
 * Block:  An item which contains a number of operations (transactions) which
 * originated from an account at a particular instant
 */
export declare class Block implements BlockCanonical {
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
    };
    static NO_PREVIOUS: string;
    static AdjustMethod: typeof AdjustMethod;
    static Builder: typeof BlockBuilder;
    readonly version: number;
    readonly date: Date;
    readonly previous: BlockHash;
    readonly account: GenericAccount;
    readonly signer: Account;
    readonly operations: BlockCanonical['operations'];
    readonly network: NetworkID;
    readonly subnet: SubnetID | undefined;
    readonly signature: BlockSignature;
    readonly $signatureValid: boolean;
    readonly $opening: boolean;
    static fromUnsignedJSON(input: BlockUnsignedCanonical): Promise<Block>;
    static isValidJSON(block: BlockJSON | BlockJSONOutput | BlockJSONIncomplete): block is BlockJSON;
    constructor(input: Buffer | ArrayBuffer | BlockJSON | BlockJSONOutput | Block | string);
    static getAccountOpeningHash(account: GenericAccount): BlockHash;
    toBytes(includeSignature?: boolean): ArrayBuffer;
    protected static getASN1ContainerWithoutSignature(input: BlockUnsignedCanonical | BlockCanonical): BlockASN1WithoutSignature;
    toJSON(): BlockJSONOutput;
    /**
     * Hash of the block minus the signature
     *
     * XXX:TODO: Should the hash of the block normally include the
     *           signature ?  One reason against is that it would
     *           allow for identical blocks that only differ by
     *           signature (which isn't signed)
     */
    get hash(): BlockHash;
    static toJSONSerializablePrefix: string;
    static toJSONSerializable(value: Block, opts: ToJSONSerializableOptions): {
        [x: string]: any;
        operations: JSONSupported<Operations.BlockJSONOperations>[];
        $hash: string;
        $opening: boolean;
    };
}
export declare class BlockBuilder implements BlockJSONIncomplete {
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
    };
    static NO_PREVIOUS: string;
    constructor(block?: BlockJSONIncomplete | BlockJSON | Block | ArrayBuffer | string);
    protected get currentBlock(): Block | BlockJSONIncomplete;
    protected get currentWIP(): BlockJSONIncomplete;
    protected get currentBlockSealed(): Block;
    toJSON(): BlockJSONOutput | BlockJSONOutputIncomplete;
    seal(): Promise<Block>;
    unseal(): BlockJSONIncomplete;
    get sealed(): boolean;
    get block(): Block | undefined;
    get hash(): BlockHash | undefined;
    set signer(signer: string | Account | undefined);
    get signer(): Account | undefined;
    set account(account: string | GenericAccount | undefined);
    get account(): GenericAccount | undefined;
    set previous(blockhash: string | BlockHash | undefined);
    get previous(): BlockHash | undefined;
    get $opening(): boolean | undefined;
    set date(date: Date | string | undefined);
    get date(): Date | undefined;
    set version(version: number | undefined);
    get version(): number | undefined;
    set network(network: NetworkID | string | undefined);
    get network(): NetworkID | undefined;
    set subnet(subnet: SubnetID | string | undefined);
    get subnet(): SubnetID | undefined;
    addOperation(operation: Operations.BlockJSONOperations): void;
    get operations(): Operations.BlockOperations[] | undefined;
}
export default Block;
