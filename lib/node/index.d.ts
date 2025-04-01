import type { LedgerConfig } from '../ledger';
import Ledger from '../ledger';
import type { NetworkAddress, TokenAddress } from '../account';
import Account from '../account';
import type { StatsConfig } from '../stats';
import { Stats } from '../stats';
import type { P2PConnection, P2PPeer, P2PConfig } from '../p2p';
import { P2PSwitch } from '../p2p';
import { VoteStaple } from '../vote';
import RequestTiming from './timing';
import * as Config from '../../config';
export declare enum NodeKind {
    PARTICIPANT = 0,
    REPRESENTATIVE = 1,
    RELAY = 2,
    ARCHIVAL = 3
}
interface HTTPConfig {
    timeoutSeconds: number;
}
export interface NodeConfig {
    /**
     * Kind of node
     */
    kind: NodeKind;
    /**
     * Account that can bypass permissions for opening blocks on baseToken and networkAddress
     * This account also will become the source of authority when there is no weight on the network
     */
    initialTrustedAccount: Account;
    /**
     * Ledger private key (for representatives to issue votes)
     */
    ledgerPrivateKey?: Account;
    /**
     * Network information
     */
    network: bigint;
    subnet?: bigint;
    /**
     * Node alias
     */
    nodeAlias?: string;
    /**
     * Network alias
     */
    networkAlias: Config.Networks;
    /**
     * Endpoints for this node
     */
    endpoints?: {
        p2p?: string;
        api?: string;
    };
    /**
     * Peer to Peer configuration
     */
    p2p?: P2PConfig;
    /**
     * HTTP Configuration
     */
    http?: HTTPConfig;
    /**
     * Manual of peers
     */
    manualPeers?: P2PPeer[];
    /**
     * Information for the ledger
     */
    ledger: Omit<LedgerConfig, 'baseToken' | 'network' | 'kind' | 'networkAddress' | 'initialTrustedAccount'>;
    /**
     * Stats manager
     */
    stats: StatsConfig;
    /**
     * Extra information for the particular kind of node
     */
    nodeOptions?: any;
    /**
     * Changes to default handlers
     */
    callbacks?: {
        /**
         * Method for calling "sendMessage"
         */
        sendMessage?: (node: Node, ...args: Parameters<P2PSwitch['sendMessage']>) => Promise<Awaited<ReturnType<P2PSwitch['sendMessage']>>>;
    };
}
export declare class Node {
    ledger: Ledger;
    config: NodeConfig;
    switch: P2PSwitch;
    stats: Stats;
    timing: RequestTiming;
    readonly networkAddress: NetworkAddress;
    readonly baseToken: TokenAddress;
    static Kind: typeof NodeKind;
    static isInstance: (obj: any, strict?: boolean) => obj is Node;
    log: {
        debug: (from: string, ...message: any[]) => void;
        error: (from: string, ...message: any[]) => void;
    };
    static getDefaultConfig(network: Config.Networks): Omit<NodeConfig, 'ledger' | 'stats'>;
    static main(config: NodeConfig): void;
    constructor(configOrNode: Node | NodeConfig);
    copy(): Node;
    run(): Promise<void>;
    stop(): Promise<void>;
    sync(): Promise<void>;
    addToLedger(votesAndBlocks: VoteStaple, broadcast?: boolean): Promise<boolean>;
    recvMessageFromPeer(from: P2PConnection, id: string, type: string, data: any, ttl?: number): Promise<boolean>;
    sendMessage(id: string, type: string, data: any, ttl?: number, exclude?: (P2PConnection | string)[]): Promise<boolean>;
}
export default Node;
