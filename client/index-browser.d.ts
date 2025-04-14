import KeetaNet from '../lib';
import type { GenericAccount, IdentifierKeyAlgorithm, NetworkAddress, TokenAddress } from '../lib/account';
import Account, { AccountKeyAlgorithm } from '../lib/account';
import type { AdjustMethod } from '../lib/block';
import Block, { BlockHash } from '../lib/block';
import type { P2PSwitchStatistics } from '../lib/p2p';
import * as Config from '../config';
import type { BuilderOptions } from './builder';
import { UserClientBuilder } from './builder';
import KeetaNetError from '../lib/error';
import type { AccountInfo, GetAllBalancesResponse, ACLRow, LedgerStatistics } from '../lib/ledger/types';
import type { LedgerSelector, LedgerStorage } from '../lib/ledger';
import type { AcceptedPermissionTypes } from '../lib/permissions';
import { type BlockOperations } from '../lib/block/operations';
type Vote = InstanceType<typeof KeetaNet['Vote']>;
type VoteStaple = InstanceType<typeof KeetaNet['Vote']['Staple']>;
type VoteBlocksHash = Vote['blocksHash'];
type GetAccountStateAPIResponseFormatted = {
    account: GenericAccount;
    currentHeadBlock: string | null;
    representative: Account | null;
    info: AccountInfo;
    balances: GetAllBalancesResponse;
};
interface PeerInfo {
    kind: number;
    key?: string;
    endpoint?: string;
}
interface GetPeersAPIResponse {
    peers: PeerInfo[];
}
interface RepresentativeInfo {
    representative: string;
    weight: bigint;
}
interface PrincipalACLWithInfoParsed {
    entity: GenericAccount;
    principals: ACLRow[];
    info: AccountInfo;
    balances: GetAllBalancesResponse;
}
interface UserClientOptions {
    usePublishAid?: boolean;
    publishAidURL?: string;
    account?: GenericAccount;
}
interface UserClientConfig extends UserClientOptions {
    signer: Account | null;
    client: Client;
    network: bigint;
    networkAlias: Config.Networks;
}
type ClientRepresentative = Config.Representative & {
    weight?: bigint;
};
export declare class Client {
    #private;
    static readonly Builder: typeof UserClientBuilder;
    static readonly Config: typeof Config;
    static DefaultLogger: Pick<typeof console, 'log' | 'error' | 'warn'>;
    logger: Pick<Console, "error" | "log" | "warn">;
    readonly stats: {
        api: {
            called: number;
            failures: number;
        };
    };
    static fromNetwork(network: Config.Networks): Client;
    static isInstance: (obj: any, strict?: boolean) => obj is Client;
    constructor(reps: ClientRepresentative[]);
    destroy(): Promise<void>;
    makeBuilder(options: BuilderOptions): UserClientBuilder;
    computeBuilderBlocks(network: bigint, builder: UserClientBuilder): Promise<import("./builder").ComputeBlocksResponse>;
    transmit(blocks: Block[]): ReturnType<Client['transmitStaple']>;
    transmit(blocks: UserClientBuilder, network: bigint): ReturnType<Client['transmitStaple']>;
    transmitStaple(votesAndBlocks: VoteStaple, reps?: ClientRepresentative[]): Promise<any>;
    getNodeStats(): Promise<{
        ledger: LedgerStatistics;
        switch: P2PSwitchStatistics;
    }>;
    getTokenSupply(token: TokenAddress | string): Promise<bigint>;
    getAccountInfo(account: GenericAccount | string): Promise<GetAccountStateAPIResponseFormatted>;
    getAccountsInfo(accounts: (GenericAccount | string)[]): Promise<{
        [account: string]: GetAccountStateAPIResponseFormatted;
    }>;
    listACLsByPrincipal(account: GenericAccount | string, targets?: (GenericAccount | string)[]): Promise<ACLRow[]>;
    listACLsByPrincipalWithInfo(account: GenericAccount | string, targets?: (GenericAccount | string)[]): Promise<PrincipalACLWithInfoParsed[]>;
    listACLsByEntity(entity: GenericAccount | string): Promise<ACLRow[]>;
    getBalance(account: GenericAccount | string, token: TokenAddress | string): Promise<bigint>;
    getAllBalances(account: GenericAccount | string): Promise<GetAllBalancesResponse>;
    getHeadBlock(account: GenericAccount | string): Promise<Block | null>;
    getBlock(blockhash: BlockHash | string): Promise<Block | null>;
    getBlock(blockhash: BlockHash | string, side?: LedgerSelector, rep?: ClientRepresentative | 'ANY'): Promise<Block | null>;
    getVoteStaple(blockhash: BlockHash | string): Promise<VoteStaple | null>;
    getVoteStaple(blockhash: BlockHash | string, side?: LedgerStorage): Promise<VoteStaple | null>;
    getChain(account: GenericAccount | string, options?: {
        startBlock?: BlockHash | string;
        depth?: number;
    }): Promise<Block[]>;
    getHistory(account: GenericAccount | string, options?: {
        startBlocksHash?: VoteBlocksHash | string;
        depth?: number;
    }): Promise<{
        voteStaple: VoteStaple;
    }[]>;
    getSingleRepresentativeInfo(rep?: Account | string): Promise<RepresentativeInfo>;
    getPeers(): Promise<GetPeersAPIResponse>;
    getAllRepresentativeInfo(): Promise<RepresentativeInfo[]>;
    get representatives(): ClientRepresentative[];
    /**
     * Get the network status of all representatives
     *
     * @param timeout Maximum time to wait for a response from a representative in milliseconds
     */
    getNetworkStatus(timeout?: number): Promise<({
        rep: ClientRepresentative;
        online: false;
    } | {
        rep: ClientRepresentative;
        online: true;
        ledger: {
            moment: string;
            momentRange: number;
            blockCount: number;
            transactionCount: number;
            representativeCount: number;
            settlementTimes: import("../lib/stats").TimeStats;
        };
        switch: {
            incomingMessages: number;
            outgoingMessagesPeerSuccess: number;
            outgoingMessagesPeerFailure: number;
            outgoingMessagesPeerFiltered: number;
            outgoingMessagesPeerFailureUngreeted: number;
        };
    })[]>;
    updateReps(addNewReps?: boolean): Promise<void>;
    getVoteStaplesAfter(moment: Date, limit?: number, bloomFilter?: string): Promise<VoteStaple[]>;
    getPendingBlock(account: GenericAccount): Promise<Block | null>;
    /**
     * Recover any unpublished or half-publish account artifacts
     *
     * @param account Account to recover
     * @param publish Publish the recovered staple to the network (default is true)
     */
    recoverAccount(account: GenericAccount, publish?: boolean): Promise<VoteStaple | null>;
    getLedgerChecksum(rep?: ClientRepresentative | 'ANY'): Promise<{
        moment: string;
        momentRange: number;
        checksum: string;
    }>;
    getVersion(rep?: ClientRepresentative | 'ANY'): Promise<{
        node: string;
    }>;
}
interface UserClientListenerTypes {
    change: ((data: GetAccountStateAPIResponseFormatted) => void);
}
type UserClientEventName = keyof UserClientListenerTypes;
export declare class UserClient {
    #private;
    static readonly Config: typeof Config;
    readonly baseToken: TokenAddress;
    readonly networkAddress: NetworkAddress;
    static fromSimpleSingleRep(hostname: string, ssl: boolean, repKey: string | Account, networkID: bigint, networkAlias: Config.Networks, signer: Account | null, options?: UserClientOptions): UserClient;
    static getConfigFromNetwork(network: Config.Networks, options?: UserClientOptions): Omit<UserClientConfig, 'signer'>;
    static fromNetwork(network: Config.Networks, signer: Account | null, options?: UserClientOptions): UserClient;
    static isInstance: (obj: any, strict?: boolean) => obj is UserClient;
    static filterStapleOperations(voteStaples: VoteStaple[], account: GenericAccount): {
        [stapleHash: string]: {
            block: Block;
            filteredOperations: BlockOperations[];
        }[];
    };
    constructor(config: UserClientConfig);
    initializeChain(initOpts: {
        addSupplyAmount: bigint;
        delegateTo?: Account;
        voteSerial?: bigint;
    }, options?: UserClientOptions): Promise<any>;
    modTokenSupplyAndBalance(amount: bigint, token: TokenAddress, options?: UserClientOptions): Promise<any>;
    initBuilder(options?: UserClientOptions): UserClientBuilder;
    computeBuilderBlocks(builder: UserClientBuilder): Promise<import("./builder").ComputeBlocksResponse>;
    publishBuilder(builder: UserClientBuilder): Promise<any>;
    setInfo(info: AccountInfo, options?: UserClientOptions): Promise<any>;
    send(to: GenericAccount | string, amount: bigint | number, token: TokenAddress | string, external?: string, options?: UserClientOptions, retries?: number): Promise<void>;
    generateIdentifier(type: IdentifierKeyAlgorithm, options?: UserClientOptions): Promise<import("./builder").PendingAccount<AccountKeyAlgorithm.NETWORK | AccountKeyAlgorithm.TOKEN | AccountKeyAlgorithm.STORAGE>>;
    updatePermissions(principal: GenericAccount | string, permissions: AcceptedPermissionTypes, target?: GenericAccount | string, method?: AdjustMethod, options?: UserClientOptions): Promise<any>;
    allBalances(options?: UserClientOptions): Promise<GetAllBalancesResponse>;
    balance(token: TokenAddress | string, options?: UserClientOptions): Promise<bigint>;
    head(options?: UserClientOptions): Promise<BlockHash | null>;
    block(blockhash: BlockHash | string): Promise<Block | null>;
    chain(query?: Parameters<Client['getChain']>[1], options?: UserClientOptions): Promise<Block[]>;
    history(query?: Parameters<Client['getHistory']>[1], options?: UserClientOptions): Promise<{
        voteStaple: import("../lib/vote").VoteStaple;
        effects: import("../lib/ledger/effects").ComputedEffectOfBlocks;
    }[]>;
    filterStapleOperations(voteStaples: VoteStaple[], options?: UserClientOptions): {
        [stapleHash: string]: {
            block: Block;
            filteredOperations: BlockOperations[];
        }[];
    };
    state(options?: UserClientOptions): ReturnType<Client['getAccountInfo']>;
    listACLsByPrincipal(entity?: (GenericAccount | string)[], options?: UserClientOptions): ReturnType<Client['listACLsByPrincipal']>;
    listACLsByEntity(options?: UserClientOptions): ReturnType<Client['listACLsByEntity']>;
    listACLsByPrincipalWithInfo(options?: UserClientOptions): ReturnType<Client['listACLsByPrincipalWithInfo']>;
    pendingBlock(options?: UserClientOptions): Promise<Block | null>;
    /**
     * Recover any unpublished or half-publish account artifacts
     *
     * @param publish Publish the recovered staple to the network
     *        (default: true)
     * @param options User client options (common options)
     */
    recover(publish?: boolean, options?: UserClientOptions): Promise<VoteStaple | null>;
    /**
     * Register a callback for change messages and set up a websocket filtered to our account only.
     * Also set up long timeout polling for changes in case the websocket misses a change update
     * Check that parameters of function complies with respective event function
     */
    on<EventName extends UserClientEventName>(event: EventName, handler: UserClientListenerTypes[EventName]): symbol;
    /**
     * Cancel a previously registered callback
     */
    off(id: symbol): void;
    destroy(): Promise<void>;
    get config(): UserClientConfig;
    get client(): Client;
    get signer(): Account | null;
    get account(): GenericAccount;
    get network(): bigint;
    get readonly(): boolean;
}
export declare function blockGenerator(seed: string, index: number, transactionCount: number, network?: bigint): Promise<import("../lib/vote").VoteStaple>;
export declare function emitBlocks(client: Client, blocks: number, seed: string, index: number, transactionCount: number, network?: bigint): Promise<void>;
export declare const lib: {
    Account: typeof Account;
    Block: typeof Block;
    Error: typeof KeetaNetError;
    Ledger: typeof import("../lib/ledger").Ledger;
    Node: typeof import("../lib/node").Node;
    P2P: typeof import("../lib/p2p").P2PSwitch;
    Permissions: typeof import("../lib/permissions").default;
    Stats: typeof import("../lib/stats").Stats;
    Vote: typeof import("../lib/vote").Vote;
    Utils: {
        ASN1: typeof import("../lib/utils/asn1");
        Bloom: typeof import("../lib/utils/bloom");
        Buffer: typeof import("../lib/utils/buffer");
        Hash: typeof import("../lib/utils/hash");
        Helper: typeof import("../lib/utils/helper");
        Initial: typeof import("../lib/utils/initial");
        Conversion: typeof import("../lib/utils/conversion");
        Certificate: typeof import("../lib/utils/certificate");
    };
};
export default Client;
