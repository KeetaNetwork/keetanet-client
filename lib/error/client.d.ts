import { KeetaNetError } from '.';
declare const ClientErrorType: "CLIENT";
declare const ClientErrorCodes: readonly ["BUILDER_AMOUNT_IS_ZERO", "BUILDER_CANNOT_READ_BEFORE_RENDER", "BUILDER_REQUIRES_PRIVATE_KEY", "BUILDER_USER_CLIENT_REQUIRED", "PUBLISH_AID_NOT_AVAILABLE", "SIGNER_REQUIRES_PRIVATE_KEY"];
export type ClientErrorCode = `${typeof ClientErrorType}_${typeof ClientErrorCodes[number]}`;
export default class KeetaNetClientError extends KeetaNetError {
    static isInstance: (obj: any, strict?: boolean) => obj is KeetaNetClientError;
    constructor(code: ClientErrorCode, message: string);
}
export {};
