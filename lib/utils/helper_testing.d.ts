import Account from '../account';
import LocalNode from '../node/local';
import { VoteStaple } from '../vote';
import type { Block } from '../block';
export declare const testingNetworkId = 0n;
type NodeConfig = ConstructorParameters<typeof LocalNode>[0];
export declare function canListenOn(ip: string): Promise<boolean>;
export declare function findListenableIP(checkIPs: string[]): Promise<string | null>;
export declare function findListenableBindingForTest(options?: Pick<CreateTestNodeOptions, 'simulatedPhysicalNetwork'>): Promise<{
    ip: string;
    port: number;
}>;
export type CreateTestNodeOptions = {
    name?: string;
    peerNodes?: LocalNode[];
    enableP2P?: boolean;
    p2p?: Partial<NodeConfig['p2p']>;
    ledger?: Partial<NodeConfig['ledger']>;
    initialTrustedAccount?: Account;
    createInitialVoteStaple?: boolean;
    nodeConfig?: Partial<Omit<NodeConfig, 'p2p' | 'ledger' | 'initialTrustedAccount'>>;
    simulatedPhysicalNetwork?: boolean;
};
export interface LocalNodeWithPrivateKey extends LocalNode {
    config: NodeConfig & Required<Pick<NodeConfig, 'ledgerPrivateKey'>>;
}
export declare function createTestNode(account: Account, options?: CreateTestNodeOptions): Promise<LocalNodeWithPrivateKey>;
export declare function getVotesFromSingleNode(node: LocalNode, fromAccount: Account, toAccount: Account, headBlock: Block | null): Promise<VoteStaple>;
/**
 * Run a command and get its output
 */
export declare function run(command: string, stdin: Buffer): {
    output?: string;
    ok: boolean;
};
declare let testMethod: (..._ignore_args: any[]) => any;
export { testMethod };
