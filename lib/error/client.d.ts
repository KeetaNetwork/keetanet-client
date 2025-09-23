import { KeetaNetErrorBase } from './base';
export declare const ClientErrorCodes: readonly ["BUILDER_AMOUNT_IS_ZERO", "BUILDER_CANNOT_READ_BEFORE_RENDER", "BUILDER_REQUIRES_PRIVATE_KEY", "BUILDER_USER_CLIENT_REQUIRED", "PUBLISH_AID_NOT_AVAILABLE", "SIGNER_REQUIRES_PRIVATE_KEY", "SYNC_PUBLISH_FAILED"];
export declare const FullClientErrorCodes: ("CLIENT_BUILDER_AMOUNT_IS_ZERO" | "CLIENT_BUILDER_CANNOT_READ_BEFORE_RENDER" | "CLIENT_BUILDER_REQUIRES_PRIVATE_KEY" | "CLIENT_BUILDER_USER_CLIENT_REQUIRED" | "CLIENT_PUBLISH_AID_NOT_AVAILABLE" | "CLIENT_SIGNER_REQUIRES_PRIVATE_KEY" | "CLIENT_SYNC_PUBLISH_FAILED")[];
export type ClientErrorCode = typeof FullClientErrorCodes[number];
export default class KeetaNetClientError extends KeetaNetErrorBase<ClientErrorCode> {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetClientError;
    constructor(code: ClientErrorCode, message: string);
}
