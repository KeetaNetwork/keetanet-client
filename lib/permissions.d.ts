import type { GenericAccount } from './account';
import BitField from './utils/bitfield';
declare const externalFlagPrefix: "EXTERNAL_";
/**
 * Flags we have for non-external permissions
 */
declare enum BaseFlag {
    ACCESS = 0,/* 0x0001 */
    OWNER = 1,/* 0x0002 */
    ADMIN = 2,/* 0x0004 */
    UPDATE_INFO = 3,/* 0x0008 */
    SEND_ON_BEHALF = 4,/* 0x0010 */
    STORAGE_CAN_HOLD = 9,/* 0x0200 */
    STORAGE_DEPOSIT = 10,/* 0x0400 */
    STORAGE_CREATE = 8,/* 0x0100 */
    TOKEN_ADMIN_CREATE = 5,/* 0x0020 */
    TOKEN_ADMIN_SUPPLY = 6,/* 0x0040 */
    TOKEN_ADMIN_MODIFY_BALANCE = 7,/* 0x0080 */
    PERMISSION_DELEGATE_ADD = 11,/* 0x0800 */
    PERMISSION_DELEGATE_REMOVE = 12,/* 0x1000 */
    MANAGE_CERTIFICATE = 13,/* 0x2000 */
    MULTISIG_SIGNER = 14
}
type ExternalFlagName = `${typeof externalFlagPrefix}${string}`;
export type BaseFlagName = keyof typeof BaseFlag;
export type BaseFlagNames = BaseFlagName[];
type FlagOrExternalName = BaseFlagName | ExternalFlagName;
type FlagOrExternalNames = FlagOrExternalName[];
type ExternalPermissionOffsetSet = {
    [key: ExternalFlagName]: number;
};
type BasePermissionOffsetSet = {
    [K in BaseFlagName]: number;
};
type PermissionOffsetSet = ExternalPermissionOffsetSet | BasePermissionOffsetSet;
/**
 * Handles what flags are in what groups, groups cannot be mixed (except BASE)
 * network/token permissions must be granted on network/token identifiers
 */
declare enum BasePermissionGroup {
    NEVER = 0,
    ANY = 1,
    NONIDENTIFIER = 2,
    NETWORK = 3,
    TOKEN = 4,
    STORAGE = 5,
    NONIDENTIFIER_OR_MULTISIG = 6,
    MULTISIG = 7
}
interface BaseFlagRule {
    canBeDefault: boolean;
    entity: BasePermissionGroup;
    principal: BasePermissionGroup;
    target: BasePermissionGroup;
}
type FlagGroupType = Exclude<keyof BaseFlagRule, 'canBeDefault'>;
/**
 * Abstract class to hold permissions, handles storage and some basic functions
 */
declare abstract class PermissionSetHolder {
    protected storage: BitField;
    constructor(initialValue: bigint | number[]);
    protected computeFlagsFromOffsetSet(offsets: PermissionOffsetSet): FlagOrExternalNames;
    get bigint(): bigint;
}
/**
 * Base Set permission holder
 */
declare class BaseSet extends PermissionSetHolder {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BaseSet;
    static BasePermissionGroup: typeof BasePermissionGroup;
    constructor(presetFlags: bigint | number[]);
    static Create(presetFlags: bigint | number[] | BaseFlagNames): BaseSet;
    hasFlags(flags: BaseFlagName | BaseFlagNames): boolean;
    checkAccountMatchesGroup(type: FlagGroupType, account?: GenericAccount): boolean;
    get flags(): BaseFlagNames;
    get isValidForDefault(): boolean;
}
/**
 * External permission set holder
 */
declare class ExternalSet extends PermissionSetHolder {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is ExternalSet;
    constructor(presetOffsets?: bigint | number[]);
    static Create(presetFlags: bigint | number[]): ExternalSet;
    validate(network: bigint): boolean;
    /**
     * Takes an offset set
     * Returns an array of external flags that are true in relation to current storage
     */
    computeFlagNames(offsets: ExternalPermissionOffsetSet): FlagOrExternalNames;
    hasOffset(offset: number): boolean;
    setOffset(offset: number, value: boolean): void;
    setFromTrueOffsets(trueOffset: number[]): void;
    get trueOffsets(): number[];
}
export type { BaseSet, ExternalSet };
export type AcceptedPermissionTypes = Permissions | [string, number[]] | [string, string] | [BaseFlagNames | number[], number[]] | [bigint, bigint] | false;
/**
 * Class to hold a Base and External permission set
 */
export declare class Permissions {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is Permissions;
    static BaseSet: typeof BaseSet;
    static ExternalSet: typeof ExternalSet;
    static FromAcceptedTypes(perms: AcceptedPermissionTypes): Permissions;
    constructor(baseFlags?: BaseSet | BaseFlagNames | bigint, externalOffsets?: ExternalSet | number[] | bigint);
    validate(network: bigint): boolean;
    has(flags: BaseFlagNames, offsets?: number[]): boolean;
    has(instance: Permissions): boolean;
    static combine(combineFrom: Permissions, toCombine: Permissions): Permissions;
    combine(toCombine: Permissions): Permissions;
    static remove(removeFrom: Permissions, toRemove: Permissions): Permissions;
    remove(toRemove: Permissions): Permissions;
    compare(toCompare?: Permissions): boolean;
    get toUpdateRequires(): Permissions;
    get canUseDelegation(): boolean;
    get base(): BaseSet;
    get external(): ExternalSet;
    toJSON(): [bigint, bigint];
}
