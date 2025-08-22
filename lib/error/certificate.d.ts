import { KeetaNetError } from '.';
declare const CertificateErrorType: "CERTIFICATE";
declare const BlockErrorCodes: readonly ["DUPLICATE_INCLUDED", "ORPHAN_FOUND", "CYCLE_FOUND", "SECONDARY_GRAPH", "MISSING_FIELD", "SIGNATURE_ALGORITHM_MISMATCH", "SELF_SIGNED_VALIDATION_FAILED", "CHAIN_VERIFICATION_FAILED", "DUPLICATE_EXTENSION", "EXTENSION_NOT_PROCESSED", "INVALID_SIGNATURE_ALGORITHM", "INVALID_GRAPH_COUNT", "MOMENT_INVALID", "INVALID_VERSION"];
export type CertificateErrorCode = `${typeof CertificateErrorType}_${typeof BlockErrorCodes[number]}`;
export default class KeetaNetCertificateError extends KeetaNetError {
    static isInstance: (obj: any, strict?: boolean) => obj is KeetaNetCertificateError;
    constructor(code: CertificateErrorCode, message: string);
}
export {};
