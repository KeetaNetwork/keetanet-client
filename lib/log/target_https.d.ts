import type { LogTarget, LogTargetLevel, LogEntry } from './common';
import type { NonIdentifierAccount } from '../account';
import LogTargetConsole from './target_console';
type LogTargetHTTPSConfig = {
    account: NonIdentifierAccount;
    url: string;
    timeoutMs?: number;
    logLevel?: LogTargetLevel;
    filter?: RegExp;
    console?: NonNullable<ConstructorParameters<typeof LogTargetConsole>[0]>['console'];
    environment: string;
    product: string;
    vendor: string;
    context?: {
        [key: string]: string;
    };
};
declare class LogTargetHTTPS implements LogTarget {
    #private;
    readonly logLevel: LogTargetLevel;
    readonly filter: RegExp | null;
    readonly context?: {
        [key: string]: string;
    };
    constructor(config: LogTargetHTTPSConfig);
    emitLogs(input: LogEntry[]): Promise<void>;
}
export default LogTargetHTTPS;
