import { KeetaNetError } from '.';
declare const CertificateErrorType: "CERTIFICATE";
declare const BlockErrorCodes: readonly ["DUPLICATE_INCLUDED", "ORPHAN_FOUND", "CYCLE_FOUND", "SECONDARY_GRAPH"];
export type CertificateErrorCode = `${typeof CertificateErrorType}_${typeof BlockErrorCodes[number]}`;
export default class KeetaNetCertificateError extends KeetaNetError {
    static isInstance: (obj: any, strict?: boolean) => obj is KeetaNetCertificateError;
    constructor(code: CertificateErrorCode, message: string);
}
export {};
