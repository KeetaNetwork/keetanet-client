import KVStorageProviderMemory from './kv_memory';
import KVStorageProviderRedis from './kv_redis';
export declare const KV: {
    Memory: typeof KVStorageProviderMemory;
    Redis: typeof KVStorageProviderRedis;
};
export default KV;
