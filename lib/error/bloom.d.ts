import { KeetaNetErrorBase } from './base';
export declare const BloomErrorCodes: readonly ["INVALID_TRANSPORT"];
export declare const FullBloomErrorCodes: "BLOOM_INVALID_TRANSPORT"[];
export type BloomErrorCode = typeof FullBloomErrorCodes[number];
export default class KeetaNetBloomError extends KeetaNetErrorBase<BloomErrorCode> {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetBloomError;
    readonly data?: unknown;
    constructor(code: BloomErrorCode, message: string, data?: unknown);
}
