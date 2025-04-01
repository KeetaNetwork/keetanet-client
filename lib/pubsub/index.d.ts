import type { JSONSerializable } from '../utils/conversion';
export type SubscriptionCallback = (message: JSONSerializable) => void;
export interface PubSubProviderAPI {
    subscribe: (channel: string, callback: SubscriptionCallback) => Promise<void>;
    publish: (channel: string, message: JSONSerializable) => Promise<void>;
    destroy: () => Promise<void>;
}
