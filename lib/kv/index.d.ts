import type BufferStorage from '../utils/buffer';
import type { JSONSerializable } from '../utils/conversion';
import type KVStorageProviders from './providers';
export interface KVSetOptionsType {
    exclusiveCreate?: boolean;
    ttl?: number;
}
export interface KVStorageProviderAPI {
    set(arena: string, key: string, value: JSONSerializable | undefined, options?: KVSetOptionsType): Promise<void>;
    get(arena: string | null, key: string): Promise<JSONSerializable | undefined>;
    getAll(arena: string): Promise<{
        [key: string]: JSONSerializable;
    }>;
    list(arena: string): Promise<string[]>;
    incr(arena: string, key: string, change: number): Promise<bigint>;
    xor(arena: null, key: string, change: BufferStorage): Promise<void>;
    destroy?: () => Promise<void>;
}
export type KVStorageProvider = InstanceType<typeof KVStorageProviders[keyof typeof KVStorageProviders]>;
export declare class KVStorageProviderBase {
    xor(_ignored_arena: null, key: string, _ignored_change: BufferStorage): Promise<void>;
}
