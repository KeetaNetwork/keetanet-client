import type { BufferStorage } from '../utils/buffer';
import type { JSONSerializable } from '../utils/conversion';
import type { Node } from '../node';
type NodeLike = Pick<Node, 'timing'>;
export interface KVGenericOptionsType {
    node?: NodeLike;
}
export interface KVSetOptionsType extends KVGenericOptionsType {
    exclusiveCreate?: boolean;
    ttl?: number;
}
export interface KVStorageProviderAPI {
    set(arena: string, key: string, value: JSONSerializable | undefined, options?: KVSetOptionsType): Promise<void>;
    get(arena: string | null, key: string, options?: KVGenericOptionsType): Promise<JSONSerializable | undefined>;
    getAll(arena: string, options?: KVGenericOptionsType): Promise<{
        [key: string]: JSONSerializable;
    }>;
    list(arena: string, options?: KVGenericOptionsType): Promise<string[]>;
    incr(arena: string, key: string, change: number, options?: KVGenericOptionsType): Promise<bigint>;
    xor(arena: null, key: string, change: BufferStorage, options?: KVGenericOptionsType): Promise<void>;
    destroy?: (options?: KVGenericOptionsType) => Promise<void>;
}
export type KVStorageProvider = KVStorageProviderAPI;
export declare class KVStorageProviderBase {
    readonly id: `${string}-${string}-${string}-${string}-${string}`;
    xor(_ignored_arena: null, key: string, _ignored_change: BufferStorage, _ignored_options?: KVGenericOptionsType): Promise<void>;
}
export {};
