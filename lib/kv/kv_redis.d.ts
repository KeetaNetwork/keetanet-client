import type { KVStorageProviderAPI, KVSetOptionsType } from './';
import { KVStorageProviderBase } from './';
import type { JSONSerializable } from '../utils/conversion';
import type { BufferStorage } from '../utils/buffer';
export declare class KVStorageProviderRedis extends KVStorageProviderBase implements KVStorageProviderAPI {
    #private;
    constructor(host: string, password: string, port?: number);
    destroy(): Promise<void>;
    set(arena: string, key: string, value: JSONSerializable | undefined, opt?: KVSetOptionsType): Promise<void>;
    get(arena: string | null, key: string): Promise<JSONSerializable | undefined>;
    getAll(arena: string): Promise<{
        [key: string]: JSONSerializable;
    }>;
    list(arena: string): Promise<string[]>;
    incr(arena: string, key: string, change: number): Promise<bigint>;
    xor(arena: null, key: string, change: BufferStorage): Promise<void>;
}
export default KVStorageProviderRedis;
