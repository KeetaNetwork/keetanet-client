import { KeetaNetErrorBase } from './base';
export declare const APIErrorCodes: readonly ["INVALID_LIMIT", "INVALID_SIDE", "INVALID_START", "LIMIT_NOT_NUMBER", "LIMIT_NOT_GREATER_THAN_ZERO", "REP_MISSING", "START_MISSING"];
export declare const FullAPIErrorCodes: ("API_INVALID_LIMIT" | "API_INVALID_SIDE" | "API_INVALID_START" | "API_LIMIT_NOT_NUMBER" | "API_LIMIT_NOT_GREATER_THAN_ZERO" | "API_REP_MISSING" | "API_START_MISSING")[];
export type APIErrorCode = typeof FullAPIErrorCodes[number];
export default class KeetaNetAPIError extends KeetaNetErrorBase<APIErrorCode> {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetAPIError;
    constructor(code: APIErrorCode, message: string);
}
