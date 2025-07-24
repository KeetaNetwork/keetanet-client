import type { JSONSerializable } from '../utils/conversion';
import type { PubSubProviderAPI, SubscriptionCallback } from '.';
import { PubSub } from '@google-cloud/pubsub';
import type { Topic } from '@google-cloud/pubsub';
export declare class PubSubProviderGCP implements PubSubProviderAPI {
    #private;
    constructor(projectId: string, apiEndpoint?: string);
    get _testing_pubsub(): PubSub;
    publish(channel: string, message: JSONSerializable): Promise<void>;
    subscribe(channel: string, callback: SubscriptionCallback): Promise<void>;
    destroy(): Promise<void>;
    assertTopicExists(topic: Topic, channel: string): Promise<true | undefined>;
}
export default PubSubProviderGCP;
