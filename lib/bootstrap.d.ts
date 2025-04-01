import type Node from './node';
import type { KVStorageProvider } from './kv';
import type { VoteStaple } from './vote';
interface BootstrapFullConfig {
    period: number;
    timeout?: number;
    kv: KVStorageProvider | null;
    callback?: (voteStaple: VoteStaple) => Promise<void>;
}
export type BootstrapConfig = Partial<BootstrapFullConfig>;
type NodeLike = Pick<Node, 'log' | 'config' | 'ledger'> & Partial<Pick<Node, 'switch'>>;
export declare class BootstrapClient {
    #private;
    timeout: number;
    static isInstance: (obj: any, strict?: boolean) => obj is BootstrapClient;
    constructor(node: NodeLike, config?: BootstrapConfig);
    resetKV(): Promise<void>;
    stats(): Promise<{
        lastUpdate: Date | undefined;
        completeCount: number;
    }>;
    update(limit?: number): Promise<{
        complete: boolean;
    }>;
    stop(): Promise<void>;
}
export default BootstrapClient;
