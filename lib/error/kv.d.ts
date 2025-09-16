import { KeetaNetErrorBase } from './base';
export declare const KVErrorCodes: readonly ["TTL_NOT_SUPPORTED", "KEY_ALREADY_EXISTS"];
export declare const FullKVErrorCodes: ("KV_TTL_NOT_SUPPORTED" | "KV_KEY_ALREADY_EXISTS")[];
export type KVErrorCode = typeof FullKVErrorCodes[number];
export default class KeetaNetKVError extends KeetaNetErrorBase<KVErrorCode> {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetKVError;
    constructor(code: KVErrorCode, message: string);
}
