import type { KVStorageProviderAPI, KVSetOptionsType, KVGenericOptionsType } from './';
import { KVStorageProviderBase } from './';
import type { JSONSerializable } from '../utils/conversion';
import type { BufferStorage } from '../utils/buffer';
export type KVStorageProviderRedisConfig = {
    host: string;
    password: string;
    port?: number;
    log?: typeof KVStorageProviderRedis['defaultLogger'];
    node?: KVGenericOptionsType['node'];
};
export declare class KVStorageProviderRedis extends KVStorageProviderBase implements KVStorageProviderAPI {
    #private;
    static defaultLogger: Pick<typeof console, 'debug' | 'error'>;
    log: Pick<Console, "debug" | "error">;
    constructor(config: KVStorageProviderRedisConfig);
    private node;
    destroy(options?: KVGenericOptionsType): Promise<void>;
    set(arena: string, key: string, value: JSONSerializable | undefined, opt?: KVSetOptionsType): Promise<void>;
    get(arena: string | null, key: string, options?: KVGenericOptionsType): Promise<JSONSerializable | undefined>;
    getAll(arena: string, options?: KVGenericOptionsType): Promise<{
        [key: string]: JSONSerializable;
    }>;
    list(arena: string, options?: KVGenericOptionsType): Promise<string[]>;
    incr(arena: string, key: string, change: number, options?: KVGenericOptionsType): Promise<bigint>;
    xor(arena: null, key: string, change: BufferStorage, options?: KVGenericOptionsType): Promise<void>;
}
export default KVStorageProviderRedis;
