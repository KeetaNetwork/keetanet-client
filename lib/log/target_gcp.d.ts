import type { LogTarget, LogTargetLevel, LogEntry } from './common';
import { Logging as GoogleCloudLogging } from '@google-cloud/logging';
import LogTargetConsole from './target_console';
type LogTargetGCPConfig = {
    destination?: GoogleCloudLogging;
    logLevel?: LogTargetLevel;
    filter?: RegExp;
    console?: NonNullable<ConstructorParameters<typeof LogTargetConsole>[0]>['console'];
    environment: string;
    product: string;
    vendor: string;
};
declare class LogTargetGCP implements LogTarget {
    #private;
    readonly logLevel: LogTargetLevel;
    readonly filter: RegExp | null;
    constructor(config: LogTargetGCPConfig);
    emitLogs(input: LogEntry[]): Promise<void>;
}
export default LogTargetGCP;
