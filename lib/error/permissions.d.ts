import { KeetaNetErrorBase } from './base';
export declare const PermissionsErrorCodes: readonly ["CANNOT_MIX_FLAGS_AND_TYPES", "EXTERNAL_OFFSET_TOO_LARGE", "INVALID_EXTERNAL_FLAG", "INVALID_FLAG", "INVALID_FLAG_ASSERTION"];
export declare const FullPermissionsErrorCodes: ("PERMISSIONS_CANNOT_MIX_FLAGS_AND_TYPES" | "PERMISSIONS_EXTERNAL_OFFSET_TOO_LARGE" | "PERMISSIONS_INVALID_EXTERNAL_FLAG" | "PERMISSIONS_INVALID_FLAG" | "PERMISSIONS_INVALID_FLAG_ASSERTION")[];
export type PermissionsErrorCode = typeof FullPermissionsErrorCodes[number];
export default class KeetaNetPermissionsError extends KeetaNetErrorBase<PermissionsErrorCode> {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetPermissionsError;
    constructor(code: PermissionsErrorCode, message: string);
}
