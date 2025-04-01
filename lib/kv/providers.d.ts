import KVStorageProviderMemory from './kv_memory';
import KVStorageProviderDynamoDB from './kv_dynamodb';
import KVStorageProviderRedis from './kv_redis';
export declare const KV: {
    Memory: typeof KVStorageProviderMemory;
    DynamoDB: typeof KVStorageProviderDynamoDB;
    Redis: typeof KVStorageProviderRedis;
};
export default KV;
