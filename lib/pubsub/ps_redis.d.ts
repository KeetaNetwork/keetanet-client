import type { JSONSerializable } from '../utils/conversion';
import type { PubSubProviderAPI, SubscriptionCallback } from './';
export declare class PubSubProviderRedis implements PubSubProviderAPI {
    #private;
    constructor(host: string, password: string, port?: number);
    subscribe(channel: string, callback: SubscriptionCallback): Promise<void>;
    publish(channel: string, message: JSONSerializable): Promise<void>;
    destroy(): Promise<void>;
}
export default PubSubProviderRedis;
