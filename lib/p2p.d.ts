import type net from 'net';
import { WebSocket } from 'ws';
import Node, { NodeKind } from './node';
import Account from './account';
import type { JSONSerializable, JSONSerializableObject } from './utils/conversion';
import type { DistributiveOmit } from './utils/helper';
import type { KVStorageProvider } from './kv';
import type { Representative } from '../config';
/**
 * Peer to Peer connection configuration
 */
export interface P2PConfig {
    /**
     * How long should a P2P connection allowed to be idle (after
     * greeting, excluding listeners) (ms)
     */
    timeoutIdle?: number;
    /**
     * How long should a P2P connection be allowed to be idle for a
     * greeting to complete (ms)
     */
    timeoutIdleGreeting?: number;
    /**
     * How long should a P2P connection from a listener allowed to be
     * idle (ms)
     */
    timeoutIdleListener?: number;
    /**
     * How frequently should the idle connection checker run and terminate
     * connections (ms)
     */
    timeoutIdleCheck?: number;
    /**
     * How frequently should manual peers be connected to in order to get
     * additional peering information (ms)
     */
    manualPeersCheckInFreq?: number;
    /**
     * How many peers should messages that are being broadcast be
     * forwarded to
     */
    forwardingPeerCount?: number;
    /**
     * Key-Value Storage Instance (null means a new in-memory instance will be created)
     */
    kv?: KVStorageProvider | null;
    /**
     * Forget about seen message ids after this many milliseconds
     */
    seenMessageTTL?: number;
    /**
     * Whether to republish over http or p2p websockets
     */
    useHTTPRepublish?: boolean;
}
/**
 * Shape of statistics
 */
export interface P2PSwitchStatistics {
    incomingMessages: number;
    outgoingMessagesPeerSuccess: number;
    outgoingMessagesPeerFailure: number;
    outgoingMessagesPeerFiltered: number;
    outgoingMessagesPeerFailureUngreeted: number;
}
/**
 * How we should represent peers internally.  Peers are known endpoints we can
 * connect to or placeholders for inbound connections
 */
interface P2PPeerBase {
    kind: NodeKind;
}
export type P2PUpdateOptions = 'http' | 'websocket';
/**
 * Peering information for a Representative (Basic, unsigned information)
 */
interface P2PPeerRepBase extends P2PPeerBase {
    kind: NodeKind.REPRESENTATIVE;
    /**
     * Endpoints to reach the representative
     */
    endpoints: {
        p2p: string;
        api: string;
    };
    /**
     * Public key of the representative (used as the ID)
     */
    key: Account;
    /**
     * Prefer to receive updates over http or websocket
     */
    preferUpdates: P2PUpdateOptions;
}
/**
 * Peering information for a Representative
 */
type P2PPeerRep = P2PPeerRepBase & ({
    /**
     * Certificate from this peer which confirms its endpoints
     */
    certificate: null;
} | {
    /**
     * Direct signature of the peer information
     */
    signature: ArrayBuffer;
});
/**
 * Peering information for an inbound socket which has no callback information
 */
interface P2PPeerListener extends P2PPeerBase {
    kind: NodeKind.PARTICIPANT;
    /**
     * Temporary ID to use for identifying this peer while we are connected to it
     */
    id: string;
}
export type P2PPeer = P2PPeerRep | P2PPeerListener;
type P2PPeerUnsigned = DistributiveOmit<P2PPeer, 'certificate' | 'signature'>;
export declare function generateP2PPeerSigned(peer: P2PPeerUnsigned): Promise<P2PPeer>;
/**
 * Options for the "peers" method
 */
export interface GetPeersOptions {
    /**
     * Whether or not to consider ourselves (if we are attached to a
     * representative node) as a peer.  Default is false.
     */
    includeSelf?: boolean;
    /**
     * Whether or not to include peers which are potentially stale
     * because we have not heard from them in a while.  Default is false.
     */
    includeStale?: boolean;
    /**
     * Whether or not to include peers which have not been validated
     * yet.  Default is false.
     */
    includeUnverified?: boolean;
}
export declare function P2PPeerFromJSO(object: any): P2PPeer | null;
export declare function P2PPeerToJSO(peer: P2PPeer): JSONSerializableObject;
type SerializedConnection = {
    [key: string]: JSONSerializable;
    type: string;
    data: string;
};
/**
 * Represents an active connection on the P2P network
 */
export interface P2PConnection {
    /**
     * Signal to abort the connection
     */
    abort: boolean;
    /**
     * Peer information, if null the peer has not yet greeted us so we do
     * not know who they are
     */
    peer: P2PPeer | null;
    /**
     * Printable form of the peer
     */
    peerString: string | null;
    /**
     * Printable form of the connection
     */
    connString: string;
    /**
     * The peering information is normally untrusted since it just what
     * the peer gave us once it has been validated we can populate this.
     *
     * Validation can be via a callback to the peer or a certificate
     *
     * A callback isn't as reliable since it could be a MITM proxy
     */
    validatedPeer: P2PPeer | null;
    /**
     * Timeout of when to close this connection (Date.valueOf)
     */
    timeout: number;
    /**
     * If this connection can be serialized to our KV store,
     * return the type.
     *
     * See {@link P2PSwitch.RegisterP2PConnectionDeserializer}
     * for registering a handler to convert it back
     */
    serialize?: () => SerializedConnection;
    /**
     * Method to send a message to this peer
     */
    send: (data: Buffer) => Promise<boolean>;
    /**
     * Method to close this connection
     */
    close: () => Promise<void>;
}
/**
 * Transportable form a of a message
 */
type JSONMessage = {
    valid: true;
    id: string;
    type: string;
    data: any;
    ttl: number | undefined;
};
export declare function randomizeReps(reps: Representative[]): Representative[];
export declare function formatRepEndpoints(peers: P2PPeer[]): Representative[];
export declare class P2PHttpConnection implements P2PConnection {
    #private;
    abort: boolean;
    peer: P2PPeer;
    validatedPeer: P2PPeer | null;
    timeout: number;
    static readonly isInstance: (obj: any, strict?: boolean) => obj is P2PHttpConnection;
    /**
     * Initiate an outbound http connection and attach it to the specified switch
     */
    static initiate(peer: P2PPeer, p2pSwitch: P2PSwitch): Promise<P2PHttpConnection | null>;
    constructor(peer: P2PPeer, p2pSwitch: P2PSwitch);
    get connString(): string;
    get peerString(): string | null;
    send(messageBuffer: Buffer): Promise<boolean>;
    close(): Promise<void>;
}
/**
 * A P2PConnection using the "ws" package
 */
export declare class P2PWebSocket implements P2PConnection {
    #private;
    abort: boolean;
    peer: P2PPeer | null;
    validatedPeer: P2PPeer | null;
    timeout: number;
    /**
     * Initiate an outbound websocket connection and attach it to the specified switch
     */
    static initiate(peer: P2PPeer, p2pSwitch: P2PSwitch): Promise<P2PWebSocket | null>;
    /**
     * Attach a new "ws" connection to the switch
     */
    static connectToSwitch(socket: WebSocket, p2pSwitch: P2PSwitch, underlyingSocket?: net.Socket): Promise<P2PWebSocket>;
    static isInstance: (obj: any, strict?: boolean) => obj is P2PWebSocket;
    constructor(socket: WebSocket, p2pSwitch: P2PSwitch, underlyingSocket?: net.Socket);
    get connString(): string;
    get peerString(): string | null;
    send(messageBuffer: Buffer): Promise<boolean>;
    close(): Promise<void>;
}
/**
 * The interfaces from the Node that the P2P switch uses
 */
type NodeLike = Pick<Node, 'recvMessageFromPeer' | 'sendMessage' | 'config' | 'stats' | 'log'>;
/**
 * Deserializer DB
 */
type DeserializerCallback = (node: NodeLike, data: string) => P2PConnection;
/**
 * A P2PSwitch is a method of coordinating messages from peers (either
 * connected or known) with a Node.
 */
export declare class P2PSwitch {
    #private;
    readonly config: Omit<Required<P2PConfig>, 'kv'> & {
        kv: NonNullable<P2PConfig['kv']>;
    };
    static RegisterP2PConnectionDeserializer(type: string, deserializer: DeserializerCallback): void;
    static isInstance: (obj: any, strict?: boolean) => obj is P2PSwitch;
    DeserializeP2PConnection(connString: string): Promise<P2PConnection | undefined>;
    constructor(node: NodeLike);
    /**
     * Get a list of known peers
     */
    peers(options?: GetPeersOptions): Promise<P2PPeer[]>;
    /**
     * Add a manual peer to initiate peering process
     *
     * The switch will periodically reach out to this peer to build its
     * peer database
     */
    addManualPeer(peer: P2PPeer, schedule?: boolean): void;
    /**
     * Stop this switch
     */
    stop(): Promise<void>;
    /**
     * Handle any waiting that needs to be done
     */
    wait(): Promise<void>;
    stats(): Promise<P2PSwitchStatistics>;
    registerConnection(conn: P2PConnection): Promise<void>;
    unregisterConnection(conn: P2PConnection): Promise<void>;
    static parseJSONMessage(messageBuffer: Buffer | ArrayBuffer): {
        valid: false;
        reason: string;
    } | JSONMessage;
    /**
     * Our own peer information
     */
    selfPeer(): Promise<P2PPeer | null>;
    getOutgoingGreetingInfo(): Promise<JSONSerializableObject>;
    /**
     * Receive a message from a connection
     *
     * This message will get sent to our local node, which may then rebroadcast it
     */
    recvMessageFromPeer(from: P2PConnection, messageBuffer: Buffer | ArrayBuffer): Promise<boolean>;
    /**
     * Send a message to one or more peers
     *
     * If they are already connected that connection will be re-used,
     * otherwise a new connection will be established.
     *
     * If "to" is null then it will be sent to a sampling of peers
     *
     * @param to - Where to send the message
     * @param id - Unique message identifier
     * @param type - Message type
     * @param data - Message data, must be serializable to JSON
     * @param ttl - Maximum number of hops to pass through
     * @param exclude - List of connections to exclude (e.g., because we got the message from that connection) if "to" is null
     * @param skipConnectToPeers - Skip creating new connections to send to, only connected clients will be sent the message
     * @returns If the message could be delivered to at least one peer
     */
    sendMessage(to: P2PConnection | Account | P2PPeer | null, id: string, type: string, data: any, ttl?: number, exclude?: (string | P2PConnection)[], skipConnectToPeers?: boolean): Promise<boolean>;
    /**
     * TODO - make this private after refactoring websockets to handle higher load
     * https://github.com/KeetaNetwork/node/issues/785
     */
    haveAnyFilter(data: any): Promise<boolean>;
}
export default P2PSwitch;
