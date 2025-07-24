import type { AccountErrorCode } from './account';
import type { BlockErrorCode } from './block';
import type { ClientErrorCode } from './client';
import type { LedgerErrorCode } from './ledger';
import type { VoteErrorCode } from './vote';
import type { KVErrorCode } from './kv';
import type { PermissionsErrorCode } from './permissions';
import type { CertificateErrorCode } from './certificate';
export type ErrorCode = BlockErrorCode | LedgerErrorCode | AccountErrorCode | ClientErrorCode | VoteErrorCode | PermissionsErrorCode | KVErrorCode | CertificateErrorCode;
export declare function ExpectErrorCode(code: ErrorCode, test: () => any): Promise<void>;
interface ValidationOptions {
    type: string;
    codes: string[] | Readonly<string[]>;
}
export declare class KeetaNetError extends Error {
    static isInstance: (obj: any, strict?: boolean) => obj is KeetaNetError;
    type: string;
    code: ErrorCode;
    constructor(code: ErrorCode, message: string, validation?: ValidationOptions);
}
export {};
