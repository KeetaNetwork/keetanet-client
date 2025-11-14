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
    /**
     * This function tries to log a test message to GCP Logging, and if it fails,
     * it runs the provided `elseRun` function.
     *
     * This is useful for logging initialization, to ensure that GCP Logging
     * is working, and if not, to fall back to another logging method.
     */
    test(canRun: () => Promise<void>, elseRun: (error: unknown) => Promise<void>): Promise<void>;
    emitLogs(input: LogEntry[]): Promise<void>;
}
export default LogTargetGCP;
