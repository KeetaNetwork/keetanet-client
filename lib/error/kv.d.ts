import KeetaNetError from '.';
declare const KVErrorType: "KV";
declare const KVErrorCodes: readonly ["TTL_NOT_SUPPORTED"];
export type KVErrorCode = `${typeof KVErrorType}_${typeof KVErrorCodes[number]}`;
export default class KeetaNetKVError extends KeetaNetError {
    static isInstance: (obj: any, strict?: boolean) => obj is KeetaNetKVError;
    constructor(code: KVErrorCode, message: string);
}
export {};
