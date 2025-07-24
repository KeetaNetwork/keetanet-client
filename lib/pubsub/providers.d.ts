import PubSubProviderMemory from './ps_memory';
import PubSubProviderRedis from './ps_redis';
import PubSubProviderGCP from './ps_gcp';
export declare const PS: {
    Memory: typeof PubSubProviderMemory;
    Redis: typeof PubSubProviderRedis;
    GCP: typeof PubSubProviderGCP;
};
export default PS;
