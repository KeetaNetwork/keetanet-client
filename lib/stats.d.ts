import type { KVStorageProvider } from './kv';
import { BufferStorage } from './utils/buffer';
import type { BlockHash } from './block';
import type { RequestTiming } from './node/timing';
export interface StatsConfig {
    kv: KVStorageProvider | null;
}
declare const durationRanges: {
    readonly '-1ms': readonly [-1, -1];
    readonly '0ms': readonly [0, 0];
    readonly '10ms': readonly [1, 10];
    readonly '100ms': readonly [11, 100];
    readonly '200ms': readonly [101, 200];
    readonly '300ms': readonly [201, 300];
    readonly '400ms': readonly [301, 400];
    readonly '500ms': readonly [401, 500];
    readonly '600ms': readonly [501, 600];
    readonly '700ms': readonly [601, 700];
    readonly '800ms': readonly [701, 800];
    readonly '900ms': readonly [801, 900];
    readonly '1000ms': readonly [901, 1000];
    readonly '1500ms': readonly [1001, 1500];
    readonly '2000ms': readonly [1501, 2000];
    readonly '5000ms': readonly [2001, 5000];
    readonly '10000ms': readonly [5001, 10000];
    readonly '100000ms': readonly [10001, 100000];
    readonly ExtraLong: readonly [100000, number];
};
export type DurationBreakdowns = keyof typeof durationRanges;
type TimeStat = {
    count: number;
    range: [number, number];
};
export type TimeStats = {
    [duration in DurationBreakdowns]: TimeStat;
};
export type DbStats = {
    retries: number;
};
export declare class StatsPending {
    protected localDBIncr: {
        [key: string]: number;
    };
    protected localDBXOR: {
        [key: string]: bigint;
    };
    protected consume(): {
        incrChanges: {
            [key: string]: number;
        };
        xorChanges: {
            [key: string]: bigint;
        };
    };
    protected compoundKey(arena: string, key: string): string;
    protected incrCompoundKey(compoundKey: string, change: number): void;
    incr(arena: string, key: string, change?: number): void;
    xor(key: string, change: BlockHash | BufferStorage | bigint): void;
    merge(pending: StatsPending): void;
}
export declare class Stats extends StatsPending {
    #private;
    constructor(config: StatsConfig);
    static durationBreakdownList(): DurationBreakdowns[];
    static assertDurationBreakdown(duration: string): asserts duration is DurationBreakdowns;
    static durationBreakdown(duration: number): DurationBreakdowns;
    static placeholderTimingData(): TimeStats;
    getXor(key: string): Promise<BufferStorage>;
    addTimingPoint(arena: string, category: string, duration: number, returnOnly?: boolean): Parameters<Stats['incr']>;
    addRequestTiming(arena: string, timing: RequestTiming, returnOnly?: boolean): Parameters<Stats['incr']>[];
    get(arena: string, key: string): Promise<number>;
    getTimingData(arena: string, category: string): Promise<TimeStats>;
    sync(): Promise<void>;
}
export default Stats;
