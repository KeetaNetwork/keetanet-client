import type { LogLevel, LogTargetLevel, Logger, LogTarget } from './common';
import type { LogOptionsParam } from './helper.generated';
import LogTargetConsole from './target_console';
export type { Logger, LogTargetLevel, LogLevel };
/**
 * Options for a Log instance
 */
type LogOptions = {
    /**
     * Whether to generate debug tracing information for each log entry
     */
    logDebugTracing?: boolean;
};
type LogTargetID = symbol & {
    _branded: 'LogTargetID';
};
declare class Log implements Logger {
    #private;
    /**
     * The default log level, used for new instances of the logger
     */
    static readonly defaultLevel: LogTargetLevel;
    /**
     * The Console target, which is a basic logging target that outputs
     * logs to the console
     */
    static readonly ConsoleTarget: typeof LogTargetConsole;
    /**
     * The existing legacy logger instance, if it exists
     */
    private static legacyLoggerInstance;
    /**
     * The Null logger, to disable logging entirely
     */
    static Null(): Logger;
    /**
     * The legacy logger
     *
     * This is a singleton instance of the logger that registers a console
     * target that emits logs immediately to the console.
     *
     * This also sets the log level based on the `<name>_DEBUG`
     * environment variable, if available and adds filtering based on
     * the `<name>_DEBUG_FILTER` environment variable, if available.
     *
     * The default value for `<name>` is `KEETANET`.
     */
    static Legacy(name?: string): Log;
    /**
     * The maximum number of log entries to send to each target at a time
     */
    batchSize: number;
    constructor(options?: LogOptions);
    log(options: LogOptionsParam, from: string, ...args: unknown[]): void;
    log(from: string, ...args: unknown[]): void;
    info(options: LogOptionsParam, from: string, ...args: unknown[]): void;
    info(from: string, ...args: unknown[]): void;
    debug(options: LogOptionsParam, from: string, ...args: unknown[]): void;
    debug(from: string, ...args: unknown[]): void;
    warn(options: LogOptionsParam, from: string, ...args: unknown[]): void;
    warn(from: string, ...args: unknown[]): void;
    error(options: LogOptionsParam, from: string, ...args: unknown[]): void;
    error(from: string, ...args: unknown[]): void;
    /**
     * Register a new logging target (sink) to send logs to
     */
    registerTarget(target: LogTarget): LogTargetID;
    /**
     * Register a new logging target (sink) to send logs to, using the Console target
     *
     */
    registerConsoleTarget(config?: ConstructorParameters<typeof LogTargetConsole>[0]): LogTargetID;
    /**
     * Unregister a logging target (sink) to stop sending logs to
     */
    unregisterTarget(id: LogTargetID): void;
    /**
     * Get the currently registered log targets.
     *
     * If this is a child logger, this will return the parent's targets
     * because child loggers share the same targets as their parent.
     */
    protected get targets(): LogTarget[];
    /**
     * Parent logger, if any -- used for creating hierarchical loggers
     */
    protected parent: Log | null;
    /**
     * Create a child logger instance that shares the same targets as this instance
     * but has its own log queue, this is useful for creating hierarchical loggers
     * which can call sync independently.
     *
     * Since the child shares the same targets, registering or unregistering targets
     * from either the parent or child will affect both.
     */
    createChild(): Log;
    /**
     * Emit a set of logs to all registered targets
     */
    private emitLogs;
    /**
     * Start a timer to periodically sync logs to all targets
     */
    startAutoSync(rate?: number): void;
    /**
     * If a timer was started with `startAutoSync()`, stop it
     */
    stopAutoSync(): void;
    /**
     * Sync all currently enqueued logs to all targets
     */
    sync(): Promise<void>;
    /**
     * Dispose of the logger instance, clearing all logs and targets
     */
    [Symbol.dispose](): void;
    /**
     * Dispose of the logger instance, syncing all logs, and clearing targets
     */
    [Symbol.asyncDispose](): Promise<void>;
    /**
     * Terminate the logger instance, clearing all logs and targets
     */
    destroy(): void;
}
export default Log;
