import type { KVStorageProviderAPI, KVSetOptionsType } from './';
import { KVStorageProviderBase } from './';
import type { JSONSerializable } from '../utils/conversion';
import { BufferStorage } from '../utils/buffer';
export declare class KVStorageProviderMemory extends KVStorageProviderBase implements KVStorageProviderAPI {
    #private;
    constructor();
    set(arena: string, key: string, value: JSONSerializable | undefined, options?: KVSetOptionsType): Promise<void>;
    get(arena: string | null, key: string): Promise<JSONSerializable | undefined>;
    getAll(arena: string): Promise<{
        [key: string]: JSONSerializable;
    }>;
    list(arena: string): Promise<string[]>;
    incr(arena: string, key: string, change: number): Promise<bigint>;
    xor(arena: null, key: string, change: BufferStorage): Promise<void>;
}
export default KVStorageProviderMemory;
