import { KeetaNetError } from '.';
declare const AccountErrorType: "ACCOUNT";
declare const AccountErrorCodes: readonly ["INVALID_PREFIX", "INVALID_KEYTYPE", "INVALID_KEYTYPE_EXTERNAL", "PASSPHRASE_WEAK", "INVALID_CONSTRUCTION", "NO_IDENTIFIER_SIGN", "NO_IDENTIFIER_VERIFY", "INVALID_IDENTIFIER_CONSTRUCTION", "SEED_INDEX_UNDEFINED", "SEED_INDEX_NEGATIVE", "SEED_INDEX_NOT_INT", "SEED_INDEX_TOO_LARGE", "ENCRYPTION_NOT_SUPPORTED"];
export type AccountErrorCode = `${typeof AccountErrorType}_${typeof AccountErrorCodes[number]}`;
export default class KeetaNetAccountError extends KeetaNetError {
    static isInstance: (obj: any, strict?: boolean) => obj is KeetaNetAccountError;
    constructor(code: AccountErrorCode, message: string);
}
export {};
