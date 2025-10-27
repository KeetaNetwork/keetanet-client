import { KeetaNetErrorBase } from './base';
import type { Account, GenericAccount } from '../account';
import type { BlockHash } from '../block';
export declare const LedgerBaseErrorCodes: readonly ["BLOCK_ALREADY_EXISTS", "BLOCK_EXPIRED", "TRANSACTION_ABORTED", "INVALID_CHAIN", "INVALID_NETWORK", "INVALID_SUBNET", "INVALID_PERMISSIONS", "INVALID_OWNER_COUNT", "INVALID_BALANCE", "INVALID_SET_REP", "OPERATION_NOT_SUPPORTED", "NOT_EMPTY", "PREVIOUS_ALREADY_USED", "PREVIOUS_NOT_SEEN", "SUCCESSOR_VOTE_EXISTS", "INSUFFICIENT_VOTING_WEIGHT", "INVALID_ACCOUNT_INFO_KEY", "RECEIVE_NOT_MET", "DUPLICATE_VOTE_FOUND", "CANNOT_EXCHANGE_PERM_VOTE", "TEMP_VOTE_INCLUDES_SELF", "BLOCKS_DIFFER_FROM_VOTED_ON", "NO_PERM_WITHOUT_SELF_TEMP", "DUPLICATE_VOTE_ISSUER_FOUND", "OTHER", "MISSING_BLOCKS", "FEE_AMOUNT_MISMATCH", "FEE_TOKEN_MISMATCH", "FEE_MISSING", "MISSING_REQUIRED_FEE_BLOCK", "MULTIPLE_FEE_BLOCK", "VOTE_WITH_QUOTE", "QUOTE_MISMATCH", "REQUIRED_FEE_MISMATCH"];
export declare const LedgerVoteErrorCodes: readonly ["NOT_SUCCESSOR", "NOT_OPENING"];
export declare const LedgerIdempotentKeyErrorCodes: readonly ["IDEMPOTENT_KEY_EXISTS"];
export declare const FullLedgerErrorCodes: ("LEDGER_BLOCK_ALREADY_EXISTS" | "LEDGER_BLOCK_EXPIRED" | "LEDGER_TRANSACTION_ABORTED" | "LEDGER_INVALID_CHAIN" | "LEDGER_INVALID_NETWORK" | "LEDGER_INVALID_SUBNET" | "LEDGER_INVALID_PERMISSIONS" | "LEDGER_INVALID_OWNER_COUNT" | "LEDGER_INVALID_BALANCE" | "LEDGER_INVALID_SET_REP" | "LEDGER_OPERATION_NOT_SUPPORTED" | "LEDGER_NOT_EMPTY" | "LEDGER_PREVIOUS_ALREADY_USED" | "LEDGER_PREVIOUS_NOT_SEEN" | "LEDGER_SUCCESSOR_VOTE_EXISTS" | "LEDGER_INSUFFICIENT_VOTING_WEIGHT" | "LEDGER_INVALID_ACCOUNT_INFO_KEY" | "LEDGER_RECEIVE_NOT_MET" | "LEDGER_DUPLICATE_VOTE_FOUND" | "LEDGER_CANNOT_EXCHANGE_PERM_VOTE" | "LEDGER_TEMP_VOTE_INCLUDES_SELF" | "LEDGER_BLOCKS_DIFFER_FROM_VOTED_ON" | "LEDGER_NO_PERM_WITHOUT_SELF_TEMP" | "LEDGER_DUPLICATE_VOTE_ISSUER_FOUND" | "LEDGER_OTHER" | "LEDGER_MISSING_BLOCKS" | "LEDGER_FEE_AMOUNT_MISMATCH" | "LEDGER_FEE_TOKEN_MISMATCH" | "LEDGER_FEE_MISSING" | "LEDGER_MISSING_REQUIRED_FEE_BLOCK" | "LEDGER_MULTIPLE_FEE_BLOCK" | "LEDGER_VOTE_WITH_QUOTE" | "LEDGER_QUOTE_MISMATCH" | "LEDGER_REQUIRED_FEE_MISMATCH" | "LEDGER_NOT_SUCCESSOR" | "LEDGER_NOT_OPENING" | "LEDGER_IDEMPOTENT_KEY_EXISTS")[];
export declare const FullLedgerBaseErrorCode: ("LEDGER_BLOCK_ALREADY_EXISTS" | "LEDGER_BLOCK_EXPIRED" | "LEDGER_TRANSACTION_ABORTED" | "LEDGER_INVALID_CHAIN" | "LEDGER_INVALID_NETWORK" | "LEDGER_INVALID_SUBNET" | "LEDGER_INVALID_PERMISSIONS" | "LEDGER_INVALID_OWNER_COUNT" | "LEDGER_INVALID_BALANCE" | "LEDGER_INVALID_SET_REP" | "LEDGER_OPERATION_NOT_SUPPORTED" | "LEDGER_NOT_EMPTY" | "LEDGER_PREVIOUS_ALREADY_USED" | "LEDGER_PREVIOUS_NOT_SEEN" | "LEDGER_SUCCESSOR_VOTE_EXISTS" | "LEDGER_INSUFFICIENT_VOTING_WEIGHT" | "LEDGER_INVALID_ACCOUNT_INFO_KEY" | "LEDGER_RECEIVE_NOT_MET" | "LEDGER_DUPLICATE_VOTE_FOUND" | "LEDGER_CANNOT_EXCHANGE_PERM_VOTE" | "LEDGER_TEMP_VOTE_INCLUDES_SELF" | "LEDGER_BLOCKS_DIFFER_FROM_VOTED_ON" | "LEDGER_NO_PERM_WITHOUT_SELF_TEMP" | "LEDGER_DUPLICATE_VOTE_ISSUER_FOUND" | "LEDGER_OTHER" | "LEDGER_MISSING_BLOCKS" | "LEDGER_FEE_AMOUNT_MISMATCH" | "LEDGER_FEE_TOKEN_MISMATCH" | "LEDGER_FEE_MISSING" | "LEDGER_MISSING_REQUIRED_FEE_BLOCK" | "LEDGER_MULTIPLE_FEE_BLOCK" | "LEDGER_VOTE_WITH_QUOTE" | "LEDGER_QUOTE_MISMATCH" | "LEDGER_REQUIRED_FEE_MISMATCH")[];
export declare const FullLedgerVoteErrorCodes: ("LEDGER_NOT_SUCCESSOR" | "LEDGER_NOT_OPENING")[];
export declare const FullLedgerIdempotentKeyErrorCodes: "LEDGER_IDEMPOTENT_KEY_EXISTS"[];
export type LedgerErrorCode = typeof FullLedgerErrorCodes[number];
export type LedgerBaseErrorCode = typeof FullLedgerBaseErrorCode[number];
export type LedgerVoteErrorCode = typeof FullLedgerVoteErrorCodes[number];
export type LedgerIdempotentKeyErrorCode = typeof FullLedgerIdempotentKeyErrorCodes[number];
export declare class KeetaNetLedgerError extends KeetaNetErrorBase<LedgerBaseErrorCode> {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetLedgerError;
    static assertValidLedgerErrorCode(code: string): code is LedgerBaseErrorCode;
    readonly type: "LEDGER";
    readonly shouldRetry: boolean;
    readonly retryDelay?: number;
    constructor(code: LedgerBaseErrorCode, message: string, shouldRetry?: boolean, retryDelay?: number);
}
export declare class KeetaNetLedgerVoteError extends KeetaNetErrorBase<LedgerVoteErrorCode> {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetLedgerVoteError;
    static assertValidLedgerErrorCode(code: string): code is LedgerVoteErrorCode;
    readonly accounts: InstanceType<typeof Account.Set>;
    readonly type: "LEDGER";
    readonly shouldRetry = false;
    constructor(code: LedgerVoteErrorCode, message: string, accounts: InstanceType<typeof Account.Set>);
    toJSON(): {
        accounts: (import("../account").TokenPublicKeyString | import("../account").NetworkPublicKeyString | import("../account").StoragePublicKeyString | import("../account").MultisigPublicKeyString | import("../account").Secp256K1PublicKeyString | import("../account").Secp256R1PublicKeyString | import("../account").ED25519PublicKeyString)[];
        type: string;
        code: "LEDGER_NOT_SUCCESSOR" | "LEDGER_NOT_OPENING";
        message: string;
    };
}
export declare class KeetaNetLedgerIdempotentKeyError extends KeetaNetErrorBase<LedgerIdempotentKeyErrorCode> {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetLedgerIdempotentKeyError;
    readonly type: "LEDGER";
    readonly shouldRetry = false;
    readonly account?: GenericAccount;
    readonly idempotentKey?: ArrayBuffer;
    readonly blockhash: BlockHash;
    readonly existingBlockhash: BlockHash;
    static assertValidLedgerErrorCode(code: string): code is LedgerIdempotentKeyErrorCode;
    constructor(code: LedgerIdempotentKeyErrorCode, blockhash: BlockHash, existingBlockhash: BlockHash, account?: GenericAccount, idempotentKey?: ArrayBuffer | Buffer);
    toJSON(): {
        blockhash: string & {
            readonly __blockhash: never;
        };
        existingBlockhash: string & {
            readonly __blockhash: never;
        };
        account?: string;
        idempotentKey?: string;
        type: string;
        code: "LEDGER_IDEMPOTENT_KEY_EXISTS";
        message: string;
    };
}
