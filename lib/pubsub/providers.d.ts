import PubSubProviderMemory from './ps_memory';
import PubSubProviderRedis from './ps_redis';
export declare const PS: {
    Memory: typeof PubSubProviderMemory;
    Redis: typeof PubSubProviderRedis;
};
export default PS;
