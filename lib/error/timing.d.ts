import { KeetaNetErrorBase } from './base';
export declare const TimingErrorCodes: readonly ["INVALID_NAME"];
export declare const FullTimingErrorCodes: "TIMING_INVALID_NAME"[];
export type TimingErrorCode = typeof FullTimingErrorCodes[number];
export default class KeetaNetTimingError extends KeetaNetErrorBase<TimingErrorCode> {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetTimingError;
    constructor(code: TimingErrorCode, message: string);
}
