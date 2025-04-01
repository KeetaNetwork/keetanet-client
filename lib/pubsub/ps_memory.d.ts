import type { JSONSerializable } from '../utils/conversion';
import type { PubSubProviderAPI, SubscriptionCallback } from './';
export declare class PubSubProviderMemory implements PubSubProviderAPI {
    #private;
    publish(channel: string, message: JSONSerializable): Promise<void>;
    subscribe(channel: string, callback: SubscriptionCallback): Promise<void>;
    destroy(): Promise<void>;
}
export default PubSubProviderMemory;
