import type { LogEntry, LogTargetLevel, LogTarget } from './common';
type LogTargetConsoleConfig = {
    logLevel?: LogTargetLevel;
    filter?: RegExp;
    console?: Pick<typeof console, 'debug' | 'info' | 'warn' | 'error'>;
    context?: {
        [key: string]: string;
    };
};
declare class LogTargetConsole implements LogTarget {
    #private;
    readonly logLevel: LogTargetLevel;
    readonly filter: RegExp | null;
    readonly context?: {
        [key: string]: string;
    };
    constructor(config?: LogTargetConsoleConfig);
    emitLogs(logs: LogEntry[]): Promise<void>;
}
export default LogTargetConsole;
