export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export type LogTargetLevel = 'ALL' | LogLevel | 'NONE';
type LogCurrentRequest = {
    id: string;
};
export type LogEntry = {
    options: {
        userVisible?: boolean;
        currentRequestInfo?: LogCurrentRequest;
    };
    level: LogLevel;
    from: string;
    args: unknown[];
    trace?: string;
};
export type LogEntryFilled = Omit<LogEntry, 'options'> & {
    options: Required<LogEntry['options']>;
};
export interface LogTarget {
    readonly logLevel: LogTargetLevel;
    readonly filter: RegExp | null;
    emitLogs(logs: LogEntry[]): Promise<void>;
}
export interface Logger {
    /**
     * Optional method to ask a logger to perform a sync operation
     */
    sync?: () => Promise<void>;
    log(options: LogEntry['options'], from: string, ...args: unknown[]): void;
    log(from: string, ...args: unknown[]): void;
    debug(options: LogEntry['options'], from: string, ...args: unknown[]): void;
    debug(from: string, ...args: unknown[]): void;
    info(options: LogEntry['options'], from: string, ...args: unknown[]): void;
    info(from: string, ...args: unknown[]): void;
    warn(options: LogEntry['options'], from: string, ...args: unknown[]): void;
    warn(from: string, ...args: unknown[]): void;
    error(options: LogEntry['options'], from: string, ...args: unknown[]): void;
    error(from: string, ...args: unknown[]): void;
}
export declare function canLogForLevel(level: LogLevel, currentLevel: LogLevel): boolean;
export declare function canLogForTargetLevel(level: LogLevel, targetLevel: LogTargetLevel): boolean;
export declare function filterLog(target: LogTarget, message: LogEntry): LogEntryFilled | null;
export {};
