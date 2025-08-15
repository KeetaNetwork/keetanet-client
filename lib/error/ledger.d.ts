import { KeetaNetError } from '.';
declare const LedgerErrorType: "LEDGER";
declare const LedgerErrorCodes: readonly ["TRANSACTION_ABORTED", "INVALID_CHAIN", "INVALID_NETWORK", "INVALID_SUBNET", "NOT_EMPTY", "NOT_OPENING", "NOT_SUCCESSOR", "INVALID_PERMISSIONS", "INVALID_OWNER_COUNT", "INVALID_BALANCE", "PREVIOUS_ALREADY_USED", "PREVIOUS_NOT_SEEN", "SUCCESSOR_VOTE_EXISTS", "INSUFFICIENT_VOTING_WEIGHT", "INVALID_ACCOUNT_INFO_KEY", "RECEIVE_NOT_MET", "DUPLICATE_VOTE_FOUND", "CANNOT_EXCHANGE_PERM_VOTE", "BLOCKS_DIFFER_FROM_VOTED_ON", "NO_PERM_WITHOUT_SELF_TEMP", "DUPLICATE_VOTE_ISSUER_FOUND", "OTHER", "MISSING_BLOCKS", "FEE_AMOUNT_MISMATCH", "FEE_TOKEN_MISMATCH", "FEE_MISSING", "MISSING_REQUIRED_FEE_BLOCK", "PERM_VOTE_WITH_QUOTE", "QUOTE_MISMATCH", "REQUIRED_FEE_MISMATCH"];
export type LedgerErrorCode = `${typeof LedgerErrorType}_${typeof LedgerErrorCodes[number]}`;
export declare class KeetaNetLedgerError extends KeetaNetError {
    static isInstance: (obj: any, strict?: boolean) => obj is KeetaNetLedgerError;
    readonly type: "LEDGER";
    readonly shouldRetry: boolean;
    readonly retryDelay?: number;
    constructor(code: LedgerErrorCode, message: string, shouldRetry?: boolean, retryDelay?: number);
}
export default KeetaNetLedgerError;
