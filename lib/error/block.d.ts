import { KeetaNetError } from '.';
declare const BlockErrorType: "BLOCK";
declare const BlockErrorCodes: readonly ["INVALID_TYPE", "NO_MULTIPLE_SET_REP", "IDENTIFIER_NEED_DEFAULT_PERMISSIONS", "CANNOT_SEND_NON_TOKEN", "TOKEN_RECEIVE_DIFFERS", "ONLY_TOKEN_OP", "ONLY_IDENTIFIER_OP", "NO_TOKEN_OP", "NO_IDENTIFIER_OP", "IDENTIFIER_INVALID", "GENERAL_FIELD_INVALID", "PERMISSIONS_INVALID_DEFAULT", "PERMISSIONS_INVALID_ENTITY", "PERMISSIONS_INVALID_PRINCIPAL", "PERMISSIONS_INVALID_TARGET", "INVALID_ACCOUNT_TYPE", "NO_ADMIN_ON_TARGET", "PREVIOUS_SELF", "NO_DELEGATE_ADMIN", "NO_MODIFY_PERMISSION_DUPE", "CANNOT_FORWARD_TO_SELF", "EXACT_TRUE_WHEN_FORWARDING", "EXTERNAL_TOO_LONG", "EXTERNAL_INVALID", "EXTERNAL_MISSING"];
export type BlockErrorCode = `${typeof BlockErrorType}_${typeof BlockErrorCodes[number]}`;
export default class KeetaNetBlockError extends KeetaNetError {
    static isInstance: (obj: any, strict?: boolean) => obj is KeetaNetBlockError;
    constructor(code: BlockErrorCode, message: string);
}
export {};
