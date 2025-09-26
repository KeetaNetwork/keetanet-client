import type { LogEntry, LogTargetLevel, LogTarget } from './common';
type LogTargetConsoleConfig = {
    logLevel?: LogTargetLevel;
    filter?: RegExp;
    console?: Pick<typeof console, 'debug' | 'info' | 'warn' | 'error'>;
};
declare class LogTargetConsole implements LogTarget {
    #private;
    readonly logLevel: LogTargetLevel;
    readonly filter: RegExp | null;
    constructor(config?: LogTargetConsoleConfig);
    emitLogs(logs: LogEntry[]): Promise<void>;
}
export default LogTargetConsole;
