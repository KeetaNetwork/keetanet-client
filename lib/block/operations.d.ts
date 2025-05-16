import { ValidateASN1 } from '../utils/asn1';
import type { DeepMutable } from '../utils/helper';
import type { GenericAccount, IdentifierAddress, TokenAddress, TokenPublicKeyString } from '../account';
import Account from '../account';
import type { AcceptedPermissionTypes } from '../permissions';
import { Permissions } from '../permissions';
import type { JSONSupported } from '../utils/conversion';
import Block, { AdjustMethod } from '.';
/**
 * All supported operations
 */
export declare enum OperationType {
    SEND = 0,
    SET_REP = 1,
    SET_INFO = 2,
    MODIFY_PERMISSIONS = 3,
    CREATE_IDENTIFIER = 4,
    TOKEN_ADMIN_SUPPLY = 5,
    TOKEN_ADMIN_MODIFY_BALANCE = 6,
    RECEIVE = 7
}
export type BlockOperationTypes = keyof typeof OperationType;
/**
 * Schema for each operation as well as names of each field within the block operations
 */
declare const BlockOperationASN1SchemaBase: {
    readonly SEND: [{
        readonly name: "to";
        readonly schema: typeof ValidateASN1.IsOctetString;
    }, {
        readonly name: "amount";
        readonly schema: typeof ValidateASN1.IsInteger;
    }, {
        readonly name: "token";
        readonly schema: typeof ValidateASN1.IsOctetString;
    }, {
        readonly name: "external";
        readonly schema: {
            readonly optional: {
                readonly type: "string";
                readonly kind: "utf8";
            };
        };
    }];
    readonly RECEIVE: [{
        readonly name: "amount";
        readonly schema: typeof ValidateASN1.IsInteger;
    }, {
        readonly name: "token";
        readonly schema: typeof ValidateASN1.IsOctetString;
    }, {
        readonly name: "from";
        readonly schema: typeof ValidateASN1.IsOctetString;
    }, {
        readonly name: "exact";
        readonly schema: typeof ValidateASN1.IsBoolean;
    }, {
        readonly name: "forward";
        readonly schema: {
            readonly optional: typeof ValidateASN1.IsOctetString;
        };
    }];
    readonly SET_REP: [{
        readonly name: "to";
        readonly schema: typeof ValidateASN1.IsOctetString;
    }];
    readonly SET_INFO: [{
        readonly name: "name";
        readonly schema: {
            readonly type: "string";
            readonly kind: "utf8";
        };
    }, {
        readonly name: "description";
        readonly schema: {
            readonly type: "string";
            readonly kind: "utf8";
        };
    }, {
        readonly name: "metadata";
        readonly schema: {
            readonly type: "string";
            readonly kind: "utf8";
        };
    }, {
        readonly name: "defaultPermission";
        readonly schema: {
            readonly optional: readonly [typeof ValidateASN1.IsInteger, typeof ValidateASN1.IsInteger];
        };
    }];
    readonly MODIFY_PERMISSIONS: [{
        readonly name: "principal";
        readonly schema: typeof ValidateASN1.IsOctetString;
    }, {
        readonly name: "method";
        readonly schema: typeof ValidateASN1.IsInteger;
    }, {
        readonly name: "permissions";
        readonly schema: {
            readonly choice: [typeof ValidateASN1.IsNull, readonly [typeof ValidateASN1.IsInteger, typeof ValidateASN1.IsInteger]];
        };
    }, {
        readonly name: "target";
        readonly schema: {
            readonly optional: typeof ValidateASN1.IsOctetString;
        };
    }];
    readonly CREATE_IDENTIFIER: [{
        readonly name: "identifier";
        readonly schema: typeof ValidateASN1.IsOctetString;
    }];
    readonly TOKEN_ADMIN_SUPPLY: [{
        readonly name: "amount";
        readonly schema: typeof ValidateASN1.IsInteger;
    }, {
        readonly name: "method";
        readonly schema: typeof ValidateASN1.IsInteger;
    }];
    readonly TOKEN_ADMIN_MODIFY_BALANCE: [{
        readonly name: "token";
        readonly schema: typeof ValidateASN1.IsOctetString;
    }, {
        readonly name: "amount";
        readonly schema: typeof ValidateASN1.IsInteger;
    }, {
        readonly name: "method";
        readonly schema: typeof ValidateASN1.IsInteger;
    }];
};
type ExtractSchemaFromBase<T extends {
    name: string;
    schema: ValidateASN1.Schema;
}[]> = {
    [K in keyof T]: T[K]['schema'];
};
/**
 * Schema for each operation
 */
export declare const BlockOperationASN1Schema: { [T in BlockOperationTypes]: {
    type: "context";
    kind: "explicit";
    value: (typeof OperationType)[T];
    contains: DeepMutable<ExtractSchemaFromBase<(typeof BlockOperationASN1SchemaBase)[T]>>;
}; };
/**
 * Keys of the operations which we will serialize/deserialize
 */
export declare const BlockOperationKeys: BlockOperationKeysType;
export type BlockOperationASN1SchemaType<T extends BlockOperationTypes = BlockOperationTypes> = typeof BlockOperationASN1Schema[T];
type BlockOperationKeysType = {
    [Property in BlockOperationTypes as `${Property}`]: string[];
};
interface BlockJSONOperation {
    type: OperationType;
}
interface BlockOperationValidateContext {
    block: Block;
    operationIndex: number;
}
declare class BlockOperation {
    static isInstance: (obj: any, strict?: boolean) => obj is BlockOperation;
    validate(_ignored_context: BlockOperationValidateContext): void;
    protected computeTo(to: string | GenericAccount, isIdentifier: false): Account;
    protected computeTo(to: string | GenericAccount, isIdentifier: true): IdentifierAddress;
    protected computeTo(to: string | GenericAccount, isIdentifier?: undefined): GenericAccount;
    protected computeAmount(amount: string | bigint): bigint;
}
interface BlockJSONOperationSEND extends BlockJSONOperation {
    type: OperationType.SEND;
    to: string | GenericAccount;
    amount: string | bigint;
    token: TokenPublicKeyString | TokenAddress;
    external?: string;
}
declare class BlockOperationSEND extends BlockOperation implements BlockJSONOperationSEND {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BlockOperationSEND;
    type: OperationType.SEND;
    external: string | undefined;
    constructor(input: BlockJSONOperationSEND);
    set to(to: string | GenericAccount);
    get to(): GenericAccount;
    set token(token: TokenPublicKeyString | TokenAddress);
    get token(): TokenAddress;
    set amount(amount: string | bigint);
    get amount(): bigint;
    validate(context: BlockOperationValidateContext): void;
    toJSON(): JSONSupported<BlockJSONOperationSEND>;
}
interface BlockJSONOperationRECEIVE extends BlockJSONOperation {
    type: OperationType.RECEIVE;
    amount: string | bigint;
    token: TokenPublicKeyString | TokenAddress;
    from: string | GenericAccount;
    forward?: string | GenericAccount;
    exact?: boolean;
}
declare class BlockOperationRECEIVE extends BlockOperation implements BlockJSONOperationRECEIVE {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BlockOperationRECEIVE;
    type: OperationType.RECEIVE;
    constructor(input: BlockJSONOperationRECEIVE);
    set from(from: string | GenericAccount);
    get from(): GenericAccount;
    set forward(forward: undefined | string | GenericAccount);
    get forward(): GenericAccount | undefined;
    set exact(exact: boolean | undefined);
    get exact(): boolean;
    set token(token: TokenPublicKeyString | TokenAddress);
    get token(): TokenAddress;
    set amount(amount: string | bigint);
    get amount(): bigint;
    validate(context: BlockOperationValidateContext): void;
    toJSON(): JSONSupported<BlockJSONOperationSEND>;
}
interface BlockJSONOperationTOKEN_ADMIN_MODIFY_BALANCE extends BlockJSONOperation {
    type: OperationType.TOKEN_ADMIN_MODIFY_BALANCE;
    token: TokenPublicKeyString | TokenAddress;
    amount: string | bigint;
    method: AdjustMethod;
}
declare class BlockOperationTOKEN_ADMIN_MODIFY_BALANCE extends BlockOperation implements BlockJSONOperationTOKEN_ADMIN_MODIFY_BALANCE {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BlockOperationTOKEN_ADMIN_MODIFY_BALANCE;
    type: OperationType.TOKEN_ADMIN_MODIFY_BALANCE;
    constructor(input: BlockJSONOperationTOKEN_ADMIN_MODIFY_BALANCE);
    set token(token: TokenPublicKeyString | TokenAddress);
    get token(): TokenAddress;
    set method(newMethod: AdjustMethod);
    get method(): AdjustMethod;
    set amount(amount: string | bigint);
    get amount(): bigint;
    validate(context: BlockOperationValidateContext): void;
    toJSON(): JSONSupported<BlockJSONOperationTOKEN_ADMIN_MODIFY_BALANCE>;
}
/**
 * SetRep operation
 */
interface BlockJSONOperationSET_REP extends BlockJSONOperation {
    type: OperationType.SET_REP;
    to: string | GenericAccount;
}
declare class BlockOperationSET_REP extends BlockOperation implements BlockJSONOperationSET_REP {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BlockOperationSET_REP;
    type: OperationType.SET_REP;
    constructor(input: BlockJSONOperationSET_REP);
    set to(to: string | Account);
    get to(): Account;
    validate(context: BlockOperationValidateContext): void;
    toJSON(): JSONSupported<BlockJSONOperationSET_REP>;
}
/**
 * TokenCreate Operation
 */
interface BlockJSONOperationCREATE_IDENTIFIER extends BlockJSONOperation {
    type: OperationType.CREATE_IDENTIFIER;
    identifier: IdentifierAddress | string;
}
declare class BlockOperationCREATE_IDENTIFIER extends BlockOperation implements BlockJSONOperationCREATE_IDENTIFIER {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BlockOperationCREATE_IDENTIFIER;
    type: OperationType.CREATE_IDENTIFIER;
    constructor(input: BlockJSONOperationCREATE_IDENTIFIER);
    set identifier(identifier: string | IdentifierAddress);
    get identifier(): IdentifierAddress;
    validate(context: BlockOperationValidateContext): void;
    toJSON(): JSONSupported<BlockJSONOperationCREATE_IDENTIFIER>;
}
/**
 * SetInfo operation
 */
interface BlockJSONOperationSET_INFO extends BlockJSONOperation {
    type: OperationType.SET_INFO;
    name: string;
    description: string;
    metadata: string;
    defaultPermission?: AcceptedPermissionTypes;
}
declare class BlockOperationSET_INFO extends BlockOperation implements BlockJSONOperationSET_INFO {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BlockOperationSET_INFO;
    type: OperationType.SET_INFO;
    constructor(input: BlockJSONOperationSET_INFO);
    set name(name: string);
    get name(): string;
    set description(description: string);
    get description(): string;
    set metadata(metadata: string);
    get metadata(): string;
    set defaultPermission(newPerms: Permissions | undefined);
    get defaultPermission(): Permissions | undefined;
    validate(context: BlockOperationValidateContext): void;
    toJSON(): JSONSupported<BlockJSONOperationSET_INFO>;
}
/**
 * Set Permissions Operation
 */
interface BlockJSONOperationMODIFY_PERMISSIONS extends BlockJSONOperation {
    type: OperationType.MODIFY_PERMISSIONS;
    principal: string | GenericAccount;
    method: AdjustMethod;
    permissions: AcceptedPermissionTypes | null;
    target?: string | GenericAccount;
}
declare class BlockOperationMODIFY_PERMISSIONS extends BlockOperation implements BlockJSONOperationMODIFY_PERMISSIONS {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BlockOperationMODIFY_PERMISSIONS;
    type: OperationType.MODIFY_PERMISSIONS;
    constructor(input: BlockJSONOperationMODIFY_PERMISSIONS);
    set principal(principal: string | GenericAccount);
    get principal(): GenericAccount;
    set permissions(newPerms: Permissions | null);
    get permissions(): Permissions | null;
    set target(token: string | GenericAccount | undefined);
    get target(): GenericAccount | undefined;
    set method(method: AdjustMethod);
    get method(): AdjustMethod;
    validate(context: BlockOperationValidateContext): void;
    toJSON(): JSONSupported<BlockOperationMODIFY_PERMISSIONS>;
}
/**
 * Token Supply operation
 */
interface BlockJSONOperationTOKEN_ADMIN_SUPPLY extends BlockJSONOperation {
    type: OperationType.TOKEN_ADMIN_SUPPLY;
    amount: bigint | string;
    method: Omit<AdjustMethod, AdjustMethod.SET>;
}
declare class BlockOperationTOKEN_ADMIN_SUPPLY extends BlockOperation implements BlockJSONOperationTOKEN_ADMIN_SUPPLY {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BlockOperationTOKEN_ADMIN_SUPPLY;
    type: OperationType.TOKEN_ADMIN_SUPPLY;
    constructor(input: BlockJSONOperationTOKEN_ADMIN_SUPPLY);
    set amount(amount: string | bigint);
    get amount(): bigint;
    set method(shouldAdd: AdjustMethod);
    get method(): AdjustMethod;
    validate(context: BlockOperationValidateContext): void;
    toJSON(): JSONSupported<BlockJSONOperationTOKEN_ADMIN_SUPPLY>;
}
/**
 * Aggregate set of operations
 */
export declare const Operation: {
    SEND: typeof BlockOperationSEND;
    SET_REP: typeof BlockOperationSET_REP;
    SET_INFO: typeof BlockOperationSET_INFO;
    MODIFY_PERMISSIONS: typeof BlockOperationMODIFY_PERMISSIONS;
    CREATE_IDENTIFIER: typeof BlockOperationCREATE_IDENTIFIER;
    TOKEN_ADMIN_SUPPLY: typeof BlockOperationTOKEN_ADMIN_SUPPLY;
    TOKEN_ADMIN_MODIFY_BALANCE: typeof BlockOperationTOKEN_ADMIN_MODIFY_BALANCE;
    RECEIVE: typeof BlockOperationRECEIVE;
};
export type { BlockOperationSEND, BlockOperationSET_REP, BlockOperationSET_INFO, BlockOperationMODIFY_PERMISSIONS, BlockOperationCREATE_IDENTIFIER, BlockOperationTOKEN_ADMIN_SUPPLY, BlockOperationTOKEN_ADMIN_MODIFY_BALANCE, BlockOperationRECEIVE };
export type BlockOperations = InstanceType<typeof Operation[keyof typeof OperationType]>;
export type BlockJSONOperations = ConstructorParameters<typeof Operation[keyof typeof OperationType]>[0];
export declare function createBlockOperation(input: BlockJSONOperations): BlockOperationSEND | BlockOperationRECEIVE | BlockOperationTOKEN_ADMIN_MODIFY_BALANCE | BlockOperationSET_REP | BlockOperationSET_INFO | BlockOperationMODIFY_PERMISSIONS | BlockOperationCREATE_IDENTIFIER | BlockOperationTOKEN_ADMIN_SUPPLY;
export declare function isBlockOperation(input: any): input is BlockOperations;
/**
 * Export the "operations" mapping as something compatible with being
 * serialized to JSON
 */
export declare function ExportOperationsJSON(operations: BlockOperations[]): JSONSupported<BlockJSONOperations>[];
export declare function ImportOperationsJSON(operations: BlockOperations[] | BlockJSONOperations[]): BlockOperations[];
export declare function ExportBlockOperations(operations: BlockOperations[]): ((Omit<import("../utils/asn1").ASN1ContextTag, "kind" | "value" | "contains"> & {
    contains: [bigint, bigint];
    value: OperationType.TOKEN_ADMIN_SUPPLY;
    kind: "explicit";
}) | (Omit<import("../utils/asn1").ASN1ContextTag, "kind" | "value" | "contains"> & {
    contains: [Buffer, bigint, bigint];
    value: OperationType.TOKEN_ADMIN_MODIFY_BALANCE;
    kind: "explicit";
}) | (Omit<import("../utils/asn1").ASN1ContextTag, "kind" | "value" | "contains"> & {
    contains: [Buffer, bigint, Buffer, (Omit<import("../utils/asn1").ASN1String, "kind"> & {
        kind: "utf8";
    }) | undefined];
    value: OperationType.SEND;
    kind: "explicit";
}) | (Omit<import("../utils/asn1").ASN1ContextTag, "kind" | "value" | "contains"> & {
    contains: [Buffer];
    value: OperationType.SET_REP;
    kind: "explicit";
}) | (Omit<import("../utils/asn1").ASN1ContextTag, "kind" | "value" | "contains"> & {
    contains: [Omit<import("../utils/asn1").ASN1String, "kind"> & {
        kind: "utf8";
    }, Omit<import("../utils/asn1").ASN1String, "kind"> & {
        kind: "utf8";
    }, Omit<import("../utils/asn1").ASN1String, "kind"> & {
        kind: "utf8";
    }, [bigint, bigint] | undefined];
    value: OperationType.SET_INFO;
    kind: "explicit";
}) | (Omit<import("../utils/asn1").ASN1ContextTag, "kind" | "value" | "contains"> & {
    contains: [Buffer, bigint, [bigint, bigint] | null, Buffer | undefined];
    value: OperationType.MODIFY_PERMISSIONS;
    kind: "explicit";
}) | (Omit<import("../utils/asn1").ASN1ContextTag, "kind" | "value" | "contains"> & {
    contains: [Buffer];
    value: OperationType.CREATE_IDENTIFIER;
    kind: "explicit";
}) | (Omit<import("../utils/asn1").ASN1ContextTag, "kind" | "value" | "contains"> & {
    contains: [bigint, Buffer, Buffer, boolean, Buffer | undefined];
    value: OperationType.RECEIVE;
    kind: "explicit";
}))[];
export declare function ImportOperationsASN1(input: unknown[], network: bigint): BlockOperations[];
