import type { LogEntry, LogTargetLevel } from './common';
export type LogOptionsParam = LogEntry['options'];
export declare const assertLogOptionsParam: (input: unknown) => {
    userVisible?: boolean;
    currentRequestInfo?: {
        id: string;
    } | null;
    detailedFrom?: {
        file: string;
        class?: string;
        method: string;
        instanceID?: string;
    } | null;
};
export declare const assertLogTargetLevel: (input: unknown) => LogTargetLevel;
