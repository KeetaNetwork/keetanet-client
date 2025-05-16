import { KeetaNetError } from '.';
declare const PermissionsErrorType: "PERMISSIONS";
declare const PermissionsErrorCodes: readonly ["CANNOT_MIX_FLAGS_AND_TYPES", "EXTERNAL_OFFSET_TOO_LARGE", "INVALID_EXTERNAL_FLAG", "INVALID_FLAG", "INVALID_FLAG_ASSERTION"];
export type PermissionsErrorCode = `${typeof PermissionsErrorType}_${typeof PermissionsErrorCodes[number]}`;
export default class KeetaNetPermissionsError extends KeetaNetError {
    static isInstance: (obj: any, strict?: boolean) => obj is KeetaNetPermissionsError;
    constructor(code: PermissionsErrorCode, message: string);
}
export {};
