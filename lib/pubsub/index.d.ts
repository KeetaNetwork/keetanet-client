import type { JSONSerializable } from '../utils/conversion';
export type SubscriptionCallback = (message: JSONSerializable) => void;
export interface PubSubProviderAPI {
    publish: (channel: string, message: JSONSerializable) => Promise<void>;
    subscribe: (channel: string, callback: SubscriptionCallback) => Promise<void>;
    destroy: () => Promise<void>;
}
