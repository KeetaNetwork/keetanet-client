import type { LogEntry, LogTargetLevel } from './common';
export type LogOptionsParam = LogEntry['options'];
export declare const assertLogOptionsParam: (input: unknown) => {
    userVisible?: boolean;
    currentRequestInfo?: {
        id: string;
    };
};
export declare const assertLogTargetLevel: (input: unknown) => LogTargetLevel;
