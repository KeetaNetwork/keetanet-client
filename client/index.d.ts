/**
 * JavaScript and TypeScript SDK for the KeetaNet network.
 *
 * This SDK provides a low- and high-level interfaces to the KeetaNet network.
 *
 * See the [Getting Started](../../docs/GETTING-STARTED.md) guide for an overview of how to
 * get started with the SDK.
 *
 * @module KeetaNetSDK
 */
import KeetaNet from '../lib';
import type { GenericAccount, IdentifierKeyAlgorithm, NetworkAddress, TokenAddress } from '../lib/account';
import Account, { AccountKeyAlgorithm } from '../lib/account';
import type { AdjustMethod } from '../lib/block';
import Block, { BlockHash } from '../lib/block';
import type { P2PSwitchStatistics } from '../lib/p2p';
import * as Config from '../config';
import type { BaseTokenInfo } from '../lib/utils/initial';
import type { BuilderOptions, ManageCertificateMethod } from './builder';
import { UserClientBuilder } from './builder';
import { KeetaNetError } from '../lib/error';
import type { AccountInfo, GetAllBalancesResponse, ACLRow, LedgerStatistics } from '../lib/ledger/types';
import type { LedgerSelector, LedgerStorage } from '../lib/ledger';
import type { AcceptedPermissionTypes } from '../lib/permissions';
import { type BlockOperations } from '../lib/block/operations';
import { Certificate } from '../lib/utils/certificate';
import { CertificateBundle, type CertificateHash } from '../lib/utils/certificate';
import { VoteStaple, type VoteQuote } from '../lib/vote';
type Vote = InstanceType<typeof KeetaNet['Vote']>;
type VoteBlocksHash = Vote['blocksHash'];
/**
 * Account information
 * @expandType AccountInfo
 * @expandType GetAllBalancesResponse
 */
type GetAccountStateAPIResponseFormatted = {
    /**
     * The account for which this information is for
     */
    account: GenericAccount;
    /**
     * The current head block for the account, if there is one
     * this will be null if the account is not open
     */
    currentHeadBlock: string | null;
    /**
     * The current height of the head block for the account, if there is one
     * this will be null if the account is not open
     */
    currentHeadBlockHeight: string | null;
    /**
     * The current representative for the account, if there is one
     * this will be null if the account is not open or if the
     * account has not yet set a representative
     */
    representative: Account | null;
    /**
     * Metadata for the account which can be set with the
     * {@link UserClient['setInfo']}() method
     */
    info: AccountInfo;
    /**
     * The balances for the account
     * Each token will have a balance, even if it is 0
     * This will be an empty array if the account is not open
     */
    balances: GetAllBalancesResponse;
};
interface PeerInfo {
    /**
     * The kind of peer that is connected, which is an index into the
     * {@link NodeKind} enum
     */
    kind: number;
    /**
     * IF the peer is a representative and the peer has been greeted
     * this will be the representative's public key
     */
    key?: string;
    /**
     * If the peer is a representative and the peer has been greeted
     * this will be the P2P endpoint for the representative
     */
    endpoint?: string;
}
/** @expandType PeerInfo */
interface GetPeersAPIResponse {
    /**
     * The peers for the node
     */
    peers: PeerInfo[];
}
interface RepresentativeInfo {
    /**
     * The representative account address
     */
    representative: string;
    /**
     * The weight of the representative
     */
    weight: bigint;
}
/**
 * The response from the API when requesting the ACLs for a given account
 * @expandType ACLRow
 * @expandType AccountInfo
 * @expandType GetAllBalancesResponse
 */
interface PrincipalACLWithInfoParsed {
    /**
     * The account for which this ACL is set
     */
    entity: GenericAccount;
    principals: ACLRow[];
    /**
     * Metadata for the `entity`
     */
    info: AccountInfo;
    /**
     * The balances for the `entity`
     */
    balances: GetAllBalancesResponse;
}
interface CertificateWithIntermediatesResponse {
    certificate: Certificate;
    intermediates: CertificateBundle | null;
}
interface PublishOptions {
    /**
     * Client provided function to compute the fee block associated with any transactions
     */
    generateFeeBlock?: (staple: VoteStaple) => Promise<Block>;
    /**
     * Quotes if provided will be sent to the representative
     */
    quotes?: VoteQuote[];
}
/**
 */
interface UserClientOptions {
    /**
     * Use the "publish aid" service to publish blocks.
     *
     * This service handles requesting short votes and permanent votes
     * and publishing to the network.  This can reduce latency for clients
     * far away from representatives because they only need to wait for
     * a single response instead of multiple round-trips.
     *
     * The default is false.
     */
    usePublishAid?: boolean;
    /**
     * If using the publish aid (see {@link UserClientOptions['usePublishAid']})
     * the URL to use.
     *
     * The default depends on the network configuration.
     */
    publishAidURL?: string;
    /**
     * The account to use for the user client, if this is not supplied then
     * the `signer` will be used (if available) otherwise this there will
     * be no account and some operations may not be available.
     */
    account?: GenericAccount;
    /**
     * Client provided function to compute the fee block associated with any transactions
     */
    generateFeeBlock?: PublishOptions['generateFeeBlock'];
}
/**
 * The set of options that are applicable to read-only operations
 */
type UserClientOptionsReadOnly = Pick<UserClientOptions, 'account'>;
interface UserClientConfig extends UserClientOptions {
    /**
     * Account to use to sign blocks for this instance of the {@link UserClient}
     * If this is `null` then no account will be used and some operations may not
     * be available.
     */
    signer: Account | null;
    /**
     * The {@link Client} to use for interacting with the KeetaNet network
     */
    client: Client;
    /**
     * The network to use for this instance of the {@link UserClient}
     */
    network: bigint;
    /**
     * The network alias to use for this instance of the {@link UserClient}
     * @expand
     */
    networkAlias: Config.Networks;
}
/**
 * A representative for the client
 */
type ClientRepresentative = Config.Representative & {
    /**
     * The weight of the representative, in terms of voting power
     */
    weight?: bigint;
};
/**
 *   The Client class provides a low-level interface to the KeetaNet network.
 *   It handles sending messages to the KeetaNet representatives and parsing
 *   the responses.
 *
 *   It does not handle any of the higher-level logic of the KeetaNet network,
 *   for that there is the {@link UserClient} class.
 *
 * @summary
 *   Low-level access to the KeetaNet network
 *
 * @example
 *   ```typescript
 *   import { Client } from '@keetanetwork/keetanet-client';
 *   const client = Client.fromNetwork('test');
 *   const blocks = await client.getChain('keeta_...');
 *   ```
 */
export declare class Client {
    #private;
    /**
     * A reference to the {@link UserClientBuilder} class, which is the high-level
     * interface to building blocks.
     */
    static readonly Builder: typeof UserClientBuilder;
    /**
     * A reference to the {@link Config} class, which provides access to
     * the KeetaNet configuration utilities.
     */
    static readonly Config: typeof Config;
    /**
     * The default logger to use for new instances of the {@link Client} class.
     * This is set to the `console` object by default, but can be changed
     * by the application.
     */
    static DefaultLogger: Pick<typeof console, 'log' | 'error' | 'warn'>;
    /**
     * The logger to use for this instance of the {@link Client} class.  This
     * is defined by the `Client.DefaultLogger` property, but can be overridden
     * by the application.
     */
    logger: Pick<Console, "error" | "log" | "warn">;
    /**
     * Indication of whether or not this client has been destroyed.
     */
    destroyed: boolean;
    private static updateRepsInterval;
    /**
     * Stats for this instance of the client
     */
    readonly stats: {
        /**
         * Breakdown of the API calls made
         */
        api: {
            /**
             * The total number of times the API was called
             */
            called: number;
            /**
             * The number of times the API failed
             */
            failures: number;
        };
    };
    /**
     * Construct a new instance of the {@link Client} class from the given
     * network name.  This will use the default representatives for the
     * network based on the configuration.
     *
     * New instances should be cleaned up with the {@link destroy}() method
     * when they are no longer needed.
     *
     * This is the recommended way to create a new instance of the {@link Client} class.
     *
     * @param network The network to use for this instance of the {@link Client} class
     * @return A new instance of the {@link Client} class
     * @expandType Config.Networks
     */
    static fromNetwork(network: Config.Networks): Client;
    /**
     * Check if the given object is an instance of the {@link Client} class.
     * This is preferred to using the `instanceof` operator because it will
     * work across different contexts.
     */
    static isInstance: (obj: any, strict?: boolean) => obj is Client;
    /**
     * Create a new instance of the {@link Client} class from the given set
     * of representatives.  This is used to create a new instance of the
     * {@link Client} class with a custom set of representatives.
     *
     * New instances should be cleaned up with the {@link destroy}() method
     * when they are no longer needed.
     *
     * In general this is not needed and the {@link Client.fromNetwork}()
     * method should be used instead.
     *
     * @param reps The representatives to use for this instance of the {@link Client} class
     * @return A new instance of the {@link Client} class
     * @expandType ClientRepresentative
     */
    constructor(reps: ClientRepresentative[]);
    /**
     * Destroy this instance of the {@link Client} class.  This will clean up
     * any resources used by the instance and stop any background tasks.
     */
    destroy(): Promise<void>;
    /**
     * This enables the use of `using` to automatically clean up the
     * instance of the {@link Client} class when it is no longer needed.
     *
     * It calls the {@link destroy}() method to clean up the instance when
     * it goes out of scope.
     */
    [Symbol.asyncDispose](): Promise<void>;
    /**
     * Create a new instance of the {@link UserClientBuilder} class.  This
     * is a convenience method to create a new instance of the builder
     * class.
     *
     * The builder class is used to create blocks in a high-level way.
     *
     * @param options The options to use for the builder
     * @expandType BuilderOptions
     */
    makeBuilder(options: BuilderOptions): UserClientBuilder;
    /**
     * Compute the blocks for a given builder.  This will take the
     * pending operations and compute the blocks for them.
     *
     * This will additionally mutate the state of the builder to "seal" the
     * blocks meaning new operations will be added to new blocks.
     *
     * @param network The network to use for the builder
     * @param builder The builder to use for the computation
     * @return The blocks that were computed
     */
    computeBuilderBlocks(network: bigint, builder: UserClientBuilder): Promise<import("./builder").ComputeBlocksResponse>;
    /**
     * Transmit a set of blocks to the network.  This will request short
     * votes and permanent votes for the blocks and then publish them to
     * the network.
     *
     * The `blocks` builder will be computed using {@link computeBuilderBlocks} and then transmitted.
     *
     * @param builder The UserClientBuilder to compute and transmit transmit
     * @param network The network to use for the builder (if using a builder)
     * @return The result of the publish operation
     */
    transmitBuilder(builder: UserClientBuilder, network: bigint, options?: PublishOptions): ReturnType<Client['transmit']>;
    /**
     * Transmit a set of blocks to the network.  This will request short
     * votes and permanent votes for the blocks and then publish them to
     * the network.  Optionally it will generate a fee block from a user
     * provided function if fees are required.
     *
     * @param blocks The blocks to transmit
     * @param options User provided options {@link PublishOptions }
     * @return The result of the publish operation
     */
    transmit(blocks: Block[], options?: PublishOptions): Promise<{
        voteStaple: VoteStaple;
        publish: boolean;
        from: "direct";
    }>;
    /**
     * Publish a Vote Staple to the network.  This will publish the votes
     * and blocks to the network.
     *
     * If `reps` is not defined then the highest weight representative
     * will be used.  If `reps` is defined then the votes and blocks
     * will be published to all representatives in the list.
     *
     * @param votesAndBlocks The votes and blocks to publish
     * @param reps The representatives to publish to
     * @returns The result of the publish operation as well as the vote staple
     * @expandType ClientRepresentative
     */
    transmitStaple(votesAndBlocks: VoteStaple, reps?: ClientRepresentative[]): Promise<{
        voteStaple: VoteStaple;
        publish: boolean;
        from: 'direct';
    }>;
    /**
     * Get statistics about the preferred representative
     * @expandType LedgerStatistics
     * @expandType P2PSwitchStatistics
     */
    getNodeStats(): Promise<{
        ledger: LedgerStatistics;
        switch: P2PSwitchStatistics;
    }>;
    /**
     * Get the supply of a token.  This will return the total supply of the
     * specified token.
     *
     * @param token The token to get the supply for
     * @return The total supply of the token
     */
    getTokenSupply(token: TokenAddress | string): Promise<bigint>;
    /**
     * Fetch the account information for a given account.  This will return
     * the account information including the current head block, representative,
     * balances, and metadata.
     *
     * @param account The account to fetch the information for
     * @return The account information
     */
    getAccountInfo(account: GenericAccount | string, rep?: ClientRepresentative | 'ANY'): Promise<GetAccountStateAPIResponseFormatted>;
    /**
     * Fetch the account information for multiple accounts.  This will return
     * the account information including the current head block, representative,
     * balances, and metadata for each account.
     *
     * @param accounts The accounts to fetch the information for
     * @return The account information for each account, as an object
     *         with the account as the key and the account information as the value
     */
    getAccountsInfo(accounts: (GenericAccount | string)[]): Promise<{
        [account: string]: GetAccountStateAPIResponseFormatted;
    }>;
    /**
     * List the ACLs that have been set for a given account that are
     * targeting a particular set of accounts.  This will return the ACLs
     * including the principal, entity, and permissions for each ACL entry.
     *
     * @param account The account to list the ACLs for
     * @param entities The accounts to filter the ACLs by
     * @return The ACLs for the account where the target is one of the
     *         specified accounts
     */
    listACLsByPrincipal(account: GenericAccount | string, entities?: (GenericAccount | string)[]): Promise<ACLRow[]>;
    /**
     * List the ACLs that have been set for a given account that are
     * targeting a particular set of accounts.  This will return the ACLs
     * including the principal, entity, and permissions for each ACL entry.
     *
     * @param account The account to list the ACLs for
     * @param targets The accounts to filter the ACLs by
     * @return The ACLs for the account where the target is one of the
     *         specified accounts with additional information
     */
    listACLsByPrincipalWithInfo(account: GenericAccount | string, targets?: (GenericAccount | string)[]): Promise<PrincipalACLWithInfoParsed[]>;
    /**
     * List the ACLs that have been set on a given account by any other
     * account.  This will return the ACLs including the principal.
     *
     * @param entity The account to list the ACLs for
     * @return The ACLs for the account where the entity is the
     *         specified account
     */
    listACLsByEntity(entity: GenericAccount | string): Promise<ACLRow[]>;
    /**
     * Get the balance of a given account for a given token.
     *
     * @param account The account to get the balance for
     * @param token The token to get the balance of for the given account
     * @return The balance of the account for the given token
     */
    getBalance(account: GenericAccount | string, token: TokenAddress | string): Promise<bigint>;
    /**
     * Get the balance of a given account for all tokens.
     *
     * @param account The account to get the balance for
     * @return An array of objects which specify the token and the balance
     *         for each token the user holds a balance for
     */
    getAllBalances(account: GenericAccount | string): Promise<GetAllBalancesResponse>;
    /**
     * List all certificates for a given account.  This will return
     * all certificates that have been added by and issued to the account, including
     * any intermediate certificates that have been issued.
     * @param account Account to lookup certificates for
     * @returns An array of objects containing the certificate and any intermediates associated with the specified account
     */
    getAllCertificates(account: GenericAccount | string): Promise<CertificateWithIntermediatesResponse[]>;
    /**
     * Get a certificate by its hash for a given account.  This will return
     * the certificate and any intermediate certificates that have been issued.
     *
     * @param account The account to get the certificate for
     * @param certificateHash The hash of the certificate to get
     * @return The certificate and any intermediates or null if the certificate was not found
     */
    getCertificateByHash(account: GenericAccount | string, certificateHash: string | CertificateHash): Promise<CertificateWithIntermediatesResponse | null>;
    /**
     * Get the current head block for a given account.  This will return the
     * entire block, or null if the account has not created any blocks.
     *
     * An account with no blocks may still have a balance because other users
     * may have sent tokens to it.
     *
     * @param account The account to get the head block for
     * @param rep The representative to get the head block from -- this is generally "ANY" in which case the best representative will be used, but it is possible to request a specific representative
     * @return The head block for the account or null if the account has
     *         not created any blocks
     */
    getHeadBlock(account: GenericAccount | string, rep?: Config.Representative | 'ANY'): Promise<Block | null>;
    /**
     * Get a block from the specified representative by its block hash.
     *
     * The default mode of operation will request the block from the main
     * ledger of the "best" representative.
     *
     * The "side" ledger is a special ledger that is used to hold
     * unpublished blocks that the given representative has learned about
     * but which have not been published to the network.  This is used as
     * part of the voting process.
     *
     * @param blockhash The block hash to get the block for
     * @return The block for the given block hash or null if the block does not exist on the given ledger
     */
    getBlock(blockhash: BlockHash | string): Promise<Block | null>;
    /**
     * @param blockhash The block hash to get the block for
     * @param side The side of the ledger to get the block from -- this is generally "main", but it is possible to request "side" ledger blocks
     * @param rep The representative to get the block from -- this is generally "ANY" in which case the best representative will be used, but it is possible to request a specific representative
     * @return The block for the given block hash or null if the block does not exist on the given ledger
     */
    getBlock(blockhash: BlockHash | string, side?: LedgerSelector, rep?: ClientRepresentative | 'ANY'): Promise<Block | null>;
    /**
     * Get the vote staple for a given block hash.  This will return the entire
     * vote staple including the blocks whose hash has not been requested.
     *
     * The default mode of operation will request the block from the main
     * ledger of the "best" representative.
     *
     * The "side" ledger is a special ledger that is used to hold unpublished
     * votes and blocks that the given representative has learned about but
     * which have not been published to the network.  This is used as part
     * of the voting process.
     *
     * @param blockhash The block hash to get the vote staple for
     * @return The vote staple for the given block hash or null if the vote staple does not exist on the given ledger
     */
    getVoteStaple(blockhash: BlockHash | string): Promise<VoteStaple | null>;
    /**
     * @param blockhash The block hash to get the vote staple for
     * @param side The side of the ledger to get the vote staple from -- this is generally "main", but it is possible to request "side" ledger blocks
     * @param rep The representative to get the staple from -- this is generally "ANY" in which case the best representative will be used, but it is possible to request a specific representative
     * @return The vote staple for the given block hash or null if the vote staple does not exist on the given ledger
     */
    getVoteStaple(blockhash: BlockHash | string, side?: LedgerStorage, rep?: Config.Representative): Promise<VoteStaple | null>;
    /**
     * Get the chain for a given account.  This is the set of blocks that
     * the account has created.  This will return the blocks in reverse
     * order, with the most recent block first.
     *
     * This is a paginated request and may return only a partial set of
     * blocks for a given request if there are more blocks to be fetched
     * from the representative.  The `startBlock` parameter can be used to
     * fetch the next set of blocks.  Once all blocks have been fetched
     * an empty array will be returned.
     *
     * The `depth` parameter can be used to limit the number of blocks
     * returned.  The default is to leave it up to the representative to
     * determine the number of blocks to return.  The representative
     * may return fewer than the requested number of blocks even if there
     * are more blocks available, except that it will always return at
     * least 1 block if there are any blocks available.
     *
     * @param account The account to get the chain for
     * @param options The options to use for the request
     * @param options.startBlock The block hash to start from -- this is used to paginate the request
     * @param options.endBlock The block hash to stop on -- this is used to limit the chain to a specific range of blocks
     * @param options.depth The maximum number of blocks to return -- this is used to limit the number of blocks returned
     * @return The chain of blocks for the given account, in reverse order starting with the most recent block
     */
    getChain(account: GenericAccount | string, options?: {
        startBlock?: BlockHash | string;
        endBlock?: BlockHash | string;
        depth?: number;
    }): Promise<Block[]>;
    /**
     * Get the history for a given account.  This is the set of vote
     * staples that have interacted with the account.  This is different
     * from the chain in that it includes vote staples that have affected
     * this account but are not directly created by this account.
     *
     * This is a paginated request and may return only a partial set of
     * vote staples for a given request if there are more vote staples
     * to be fetched from the representative.  The `startBlocksHash`
     * parameter can be used to fetch the next set of vote staples.
     * It can be computed from the last entry in the previous
     * response's `blocksHash` field.  Once all vote staples have been
     * fetched an empty array will be returned.
     *
     * The `depth` parameter can be used to limit the number of vote
     * staples returned.  The default is to leave it up to the
     * representative to determine the number of vote staples to return.
     * The representative may return fewer than the requested number of
     * vote staples even if there are more vote staples available, except
     * that it will always return at least 1 vote staple if there are any
     * vote staples available.
     *
     * @param account The account to get the history for -- if null then the history for all accounts will be returned
     * @param options The options to use for the request
     * @param options.startBlocksHash The block hash to start from -- this is used to paginate the request
     * @param options.depth The maximum number of vote staples to return -- this is used to limit the number of vote staples returned
     * @return The history of vote staples for the given account, in reverse order starting with the most recent vote staple
     */
    getHistory(account: GenericAccount | string | null, options?: {
        startBlocksHash?: VoteBlocksHash | string;
        depth?: number;
    }): Promise<{
        voteStaple: VoteStaple;
    }[]>;
    /**
     * Get the representative information for a given representative account
     *
     * @param rep The representative account to get the information for
     * @return The representative information
     */
    getSingleRepresentativeInfo(rep?: Account | string): Promise<RepresentativeInfo>;
    /**
     * Get a list of peers that the node is connected to.
     *
     * @returns The list of peers that the node is connected to
     */
    getPeers(): Promise<GetPeersAPIResponse>;
    /**
     * Get a list of all representatives that the node is aware of
     * and their weights.  This will fetch the information from all
     * representatives
     *
     * @return The list of all representatives and their weights
     */
    getAllRepresentativeInfo(): Promise<RepresentativeInfo[]>;
    /**
     * Get the list of representatives that the CLIENT is aware of
     *
     * @returns The list of representatives that the client is aware of
     */
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
            db: import("../lib/stats").DbStats;
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
    /**
     * Update this client's view of the network representatives.
     * This will fetch the list of representatives from the
     * network and update the list of representatives that this
     * client will use.
     *
     * @param addNewReps If true, add any new representatives to the list of representatives
     */
    updateReps(addNewReps?: boolean): Promise<void>;
    /**
     * Get a list of vote staples that have been added to the
     * representative's ledger since a given moment in time.
     *
     * This method is used to bootstrap a new node with the
     * vote staples that have been added to the ledger since
     * the last time the node was updated.
     *
     * It is a paginated request and may return only a partial set of
     * vote staples for a given request if there are more vote staples
     * to be fetched from the representative.  The `moment` parameter
     * can be used to fetch the next set of vote staples, and the
     * `bloomFilter` parameter can be used to tell the server not to
     * include any duplicate vote staples that have already been sent
     * as part of the last page in the case of a `moment` overlap.
     * Once all vote staples have been fetched an empty array will be
     * returned.
     *
     * The bloom filter is constructed from the bytes of the vote staples
     * to exclude.
     *
     * @param moment The moment in time to get the vote staples after
     * @param limit The maximum number of vote staples to return
     * @param bloomFilter The bloom filter to use to filter the vote staples which have already been sent
     * @return The list of vote staples that have been added to the representative's ledger since the given moment in time
     */
    getVoteStaplesAfter(moment: Date, limit?: number, bloomFilter?: string): Promise<VoteStaple[]>;
    /**
     * Get the pending block for a given account.  This will return the
     * block on the representative's side ledger that is pending vote
     * completion.  This is used to recover the pending block for an
     * account that has not been published yet.
     *
     * @param account The account to get the pending block for
     * @return The pending block for the account or null if there is no
     *         pending block
     */
    getPendingBlock(account: GenericAccount): Promise<Block | null>;
    /**
     * Get the successor block for a given block.  This will return the
     * block on the representative's ledger that comes after the given block
     *
     * @param blockOrHash The block or hash to get the successor for
     * @param rep The representative account to get the successor block from
     * @return The successor block for the block or null if there is no
     *         successor block
     */
    getSuccessorBlock(blockOrHash: Block | BlockHash | string, rep?: Config.Representative | 'ANY'): Promise<Block | null>;
    /**
     * Recover any unpublished or half-publish account artifacts
     *
     * @param account Account to recover
     * @param publish Publish the recovered staple to the network (default is true)
     */
    recoverAccount(account: GenericAccount, publish?: boolean): Promise<VoteStaple | null>;
    /**
     * Sync any partially-published account artifacts
     *
     * @param account Account to sync
     * @param publish Publish the synced staple to the network (default is true)
     */
    syncAccount(account: GenericAccount, publish?: boolean, reps?: ClientRepresentative[]): Promise<VoteStaple | null>;
    getVoteQuotes(blocks: Block[]): Promise<VoteQuote[]>;
    /** Work in progress */
    getLedgerChecksum(rep?: ClientRepresentative | 'ANY'): Promise<{
        moment: string;
        momentRange: number;
        checksum: string;
    }>;
    /**
     * Get the version of the node for a given representative, if no
     * representative is specified then the version of the "best"
     * representative will be returned.
     */
    getVersion(rep?: ClientRepresentative | 'ANY'): Promise<{
        node: string;
    }>;
}
interface UserClientListenerTypes {
    change: ((data: GetAccountStateAPIResponseFormatted) => void);
}
type UserClientEventName = keyof UserClientListenerTypes;
interface UserClientListenerOptions {
    change: {
        fallbackFrequency?: number;
    };
}
/**
 *   The UserClient class provides a high-level interface, user-oriented
 *   interface to the Keeta network.  It is designed to be easy to use and
 *   handle the most common cases for applications building on top of the
 *   Keeta network.
 *
 * @summary
 *  High-level, user-oriented interface to the KeetaNet network.
 *
 * @example
 *   ```typescript
 *   import { UserClient } from '@keetanetwork/keetanet-client';
 *   import { lib as KeetaNetLib } from '@keetanetwork/keetanet-client`;
 *   const seed = '...'; // 64 character hex seed
 *   const account = KeetaNetLib.Account.fromSeed(seed, 0);
 *   const client = UserClient.fromNetwork('test');
 *   const blocks = await client.chain();
 *   ```
 */
export declare class UserClient {
    #private;
    /**
     * Reference to the {@link Config} class for the client.  This is used to
     * access the Configuration operations which may be needed for the
     * UserClient.
     */
    static readonly Config: typeof Config;
    /**
     * The base token for the network this client is connected to.
     */
    readonly baseToken: TokenAddress;
    /**
     * The network address for the network this client is connected to.
     */
    readonly networkAddress: NetworkAddress;
    /**
     * Indication of whether or not this client has been destroyed.
     */
    destroyed: boolean;
    /**
     * Create an instance of the UserClient class from a specific
     * representative.  This will use the given representative to
     * initialize the connection to the network, however it will
     * find other representatives to use for the network as well.
     *
     * This is useful for testing and development purposes, but in
     * general it is recommended to use the {@link fromNetwork}
     * method to create a new instance of the UserClient class.
     */
    static fromSimpleSingleRep(hostname: string, ssl: boolean, repKey: string | Account, networkID: bigint, networkAlias: Config.Networks, signer: Account | null, options?: UserClientOptions): UserClient;
    /**
     * A helper method to get the configuration from the network alias
     * and options.  This will use the default representatives for the
     * network based on the {@link Config | configuration}.
     *
     * @param network The {@link Config.Networks | network} to use to generate the configuration
     * @param options The {@link UserClientOptions | options} to use to generate the configuration
     * @return The configuration object for the {@link UserClient} class
     */
    static getConfigFromNetwork(network: Config.Networks, options?: UserClientOptions): Omit<UserClientConfig, 'signer'>;
    /**
     * Construct a new instance of the {@link UserClient} class from the given
     * network name.  This will use the default representatives for the
     * network based on the configuration.
     *
     * New instances should be cleaned up with the {@link destroy}() method
     * when they are no longer needed.
     *
     * This is the recommended way to create a new instance of the {@link UserClient} class.
     *
     * @param network The network to use for this instance of the {@link UserClient} class
     * @param signer The account to use for this instance of the {@link UserClient} class, or null if this is a read-only client
     * @param options The options to use for this instance of the {@link UserClient} class
     * @return A new instance of the {@link UserClient} class
     * @expandType Config.Networks
     * @expandType UserClientOptions
     */
    static fromNetwork(network: Config.Networks, signer: Account | null, options?: UserClientOptions): UserClient;
    /**
     * Determine if a given object is an instance of the UserClient class.
     * This is preferred over using `instanceof` because it works across
     * different contexts.
     */
    static isInstance: (obj: any, strict?: boolean) => obj is UserClient;
    /**
     * Helper method to filter a list of vote staples into
     * a list of blocks and operations that are related to
     * a given account.
     *
     * @param voteStaples The list of vote staples to filter
     * @param account The account to search for operations related to
     * @return An array of filtered operations for the given account, ordered by vote staple hash, then by block, and then containing each operation
     */
    static filterStapleOperations(voteStaples: VoteStaple[], account: GenericAccount): {
        [stapleHash: string]: {
            block: Block;
            filteredOperations: BlockOperations[];
        }[];
    };
    /**
     * Construct a new instance of the {@link UserClient} class from the given
     * configuration.  This will use the default representatives for the
     * network based on the configuration.
     *
     * New instances should be cleaned up with the {@link destroy} method
     * when they are no longer needed.
     *
     * The recommended way to create a new instance of the {@link UserClient} class
     * is to use the {@link fromNetwork} method.
     */
    constructor(config: UserClientConfig);
    /**
     * Generate and publish the blocks needed to initialize a new network
     * with the given parameters.
     *
     * This is generally only needed once per network and is used to
     * initialize the network with a base token and a representative
     * in order to start-up the network.
     *
     * @param initOpts The options to use for the initialization
     * @param initOpts.addSupplyAmount The amount of supply to add to the network of the base token
     * @param initOpts.delegateTo The representative account to delegate the supply to
     * @param initOpts.voteSerial The serial number to use for the vote -- must never be reused by the representative
     * @param options The options to use for the request
     * @returns The vote staple that was generated and whether it was able to be published
     */
    initializeNetwork(initOpts: {
        addSupplyAmount: bigint;
        delegateTo?: Account;
        voteSerial?: bigint;
        baseTokenInfo: BaseTokenInfo;
    }, options?: UserClientOptions): Promise<{
        voteStaple: VoteStaple;
        publish: boolean;
        from: "direct";
    }>;
    /**
     * Modify both the token supply (mint/burn) and account balance
     * for a given account of a given token.
     *
     * This will mint if a positive amount is given and burn if a negative
     * amount is given, and the add or subtract the same amount from the
     * account balance.
     *
     * @param amount The amount to add or subtract from the token supply and account balance
     * @param token The token to modify the supply and balance for
     * @param options The options to use for the request
     * @return The vote staple that was generated and whether it was able to be published
     */
    modTokenSupplyAndBalance(amount: bigint, token: TokenAddress, options?: UserClientOptionsReadOnly): Promise<{
        voteStaple: VoteStaple;
        publish: boolean;
        from: "direct";
    } | {
        blocks: Block[];
        publish: boolean;
        from: "publish-aid";
    }>;
    /**
     * Create a new {@link UserClientBuilder} instance for this client.  This
     * is used to create a new builder for adding operations to which are then
     * converted into the appropriate set of blocks.
     *
     * @param options The options to use for the builder
     * @return A new {@link UserClientBuilder} instance
     */
    initBuilder(options?: UserClientOptions): UserClientBuilder;
    /**
     * Compute the blocks needed to publish a given builder.  This will
     * update the state of the builder and any new operations added after
     * this will generate new blocks.
     *
     * @param builder The builder to compute the blocks for
     * @return The blocks that were computed
     * @deprecated Use {@link UserClientBuilder.computeBlocks} instead
     */
    computeBuilderBlocks(builder: UserClientBuilder): Promise<import("./builder").ComputeBlocksResponse>;
    /**
     * Compute the blocks needed to publish a given builder and then
     * publish those blocks to the network.  The builder should generally
     * not be used after this method is called as the blocks will
     * be published and the builder will be in an invalid state.
     *
     * In general, the {@link UserClientBuilder.publish} method should be used
     * instead of this one.
     *
     * @param builder The builder to publish
     * @param options options for publishing {@link PublishOptions }
     * @return The vote staple that was generated and whether it was able to be published
     */
    publishBuilder(builder: UserClientBuilder, options?: PublishOptions): Promise<{
        voteStaple: VoteStaple;
        publish: boolean;
        from: "direct";
    } | {
        blocks: Block[];
        publish: boolean;
        from: "publish-aid";
    }>;
    /**
     * Set the metadata for an account and publish the blocks to the
     * network.
     *
     * @param info The account info to set
     * @param options The options to use for the request
     * @return The vote staple that was generated and whether it was able to be published
     */
    setInfo(info: AccountInfo, options?: UserClientOptions): Promise<{
        voteStaple: VoteStaple;
        publish: boolean;
        from: "direct";
    } | {
        blocks: Block[];
        publish: boolean;
        from: "publish-aid";
    }>;
    /**
     * Add a certificate for a account
     *
     * @param method The method to use for modifying the certificate: `ADD` for this signature
     * @param certificate The certificate to modify, this should be a {@link Certificate} instance.
     * @param intermediates The certificate bundle containing the intermediate certificates, or null if there are no intermediates.
     * @param options The options to use for the request
     * @returns The vote staple that was generated and whether it was able to be published
     */
    modifyCertificate(method: AdjustMethod.ADD, certificate: Certificate, intermediates: CertificateBundle | null, options?: UserClientOptions): Promise<Awaited<ReturnType<typeof this.publishBuilder>>>;
    /**
     * Remove a certificate from a account
     *
     * @param method The method to use for modifying the certificate, either `ADD` or `REMOVE`
     * @param certificate The certificate to remove, this should be a {@link Certificate} or a {@link CertificateHash} instance.
     * @param intermediates Because the `SUBTRACT` method is used to remove a certificate, intermediates are not needed and should not be defined.
     * @param options The options to use for the request
     * @returns The vote staple that was generated and whether it was able to be published
     */
    modifyCertificate(method: AdjustMethod.SUBTRACT, certificate: Certificate | CertificateHash, intermediates?: undefined, options?: UserClientOptions): Promise<Awaited<ReturnType<typeof this.publishBuilder>>>;
    /**
     * Add or remove a certificate for a account
     *
     * @param method The method to use for modifying the certificate, either `ADD` or `REMOVE`
     * @param certificate The certificate to modify, this should be a {@link Certificate} instance.
     * @param intermediates The certificate bundle containing the intermediate certificates, or null if there are no intermediates.
     * @param options The options to use for the request
     * @returns The vote staple that was generated and whether it was able to be published
     */
    modifyCertificate(method: ManageCertificateMethod, certificate: Certificate | CertificateHash, intermediates?: CertificateBundle | null, options?: UserClientOptions): Promise<Awaited<ReturnType<typeof this.publishBuilder>>>;
    /**
     * Get a single certificate for the account, by the certificate hash.
     * @param certificateHash The hash of the certificate to get, or a {@link CertificateHash} instance.
     * @param options The options to use for the request
     * @return The found certificate, or null if no certificate was found.
     */
    getCertificates(certificateHash: string | CertificateHash, options?: UserClientOptions): Promise<CertificateWithIntermediatesResponse | null>;
    /**
     * List certificates for a account.
     * @param options The options to use for the request
     * @return The found certificates for the account
     */
    getCertificates(certificateHash?: undefined, options?: UserClientOptions): Promise<CertificateWithIntermediatesResponse[]>;
    /**
     * Get the certificates for the account.  If a certificate hash is provided,
     * then only that certificate will be returned, otherwise all certificates
     * for the account will be returned.
     * @param certificateHash The hash of the certificate to get, or a {@link CertificateHash} instance.
     * If not provided, all certificates for the account will be returned.
     * @param options The options to use for the request
     * @return The certificate or certificates for the account, depending on whether a hash was provided.
     */
    getCertificates(certificateHash?: string | CertificateHash | undefined, options?: UserClientOptions): Promise<CertificateWithIntermediatesResponse | (CertificateWithIntermediatesResponse[]) | null>;
    /**
     * Send some tokens from this account to another account.
     *
     * If an `external` identifier is provided, it will be included in the
     * Send operation and can be used by the recipient to identify the
     * transaction.
     *
     * @param to The account to send the tokens to
     * @param amount The amount of tokens to send (in base units)
     * @param token The token to send
     * @param external The external identifier to use for the transaction
     * @param options The options to use for the request
     * @param retries The number of times the request has been retried
     * @return The vote staple that was generated and whether it was able to be published
     */
    send(to: GenericAccount | string, amount: bigint | number, token: TokenAddress | string, external?: string, options?: UserClientOptions, retries?: number): Promise<Awaited<ReturnType<typeof this.publishBuilder>>>;
    /**
     * Gets a quote for the cost for a given set of blocks from each representative
     * @param blocks
     * @returns A list of quotes from representatives the client knows about
     */
    getQuotes(blocks: Block[]): Promise<VoteQuote[]>;
    /**
     * Generate a new identifier for the given type and publish the blocks
     *
     * @param type The type of identifier to generate
     * @param options The options to use for the request
     * @return The identifier that was generated
     */
    generateIdentifier(type: IdentifierKeyAlgorithm, options?: UserClientOptions): Promise<import("./builder").PendingAccount<AccountKeyAlgorithm.NETWORK | AccountKeyAlgorithm.TOKEN | AccountKeyAlgorithm.STORAGE | AccountKeyAlgorithm.MULTISIG>>;
    /**
     * Update the permissions for a given account.  This will publish the
     * changes to the network.
     *
     * @param principal The account to update the permissions regarding for this account
     * @param permissions The permissions to set for the account
     * @param target The account to set the permissions for, if applicable for this permission
     * @param method The method to use for the permission, defaults to SET
     * @param options The options to use for the request
     * @return The vote staple that was generated and whether it was able to be published
     */
    updatePermissions(principal: GenericAccount | string, permissions: AcceptedPermissionTypes, target?: GenericAccount | string, method?: AdjustMethod, options?: UserClientOptions): Promise<{
        voteStaple: VoteStaple;
        publish: boolean;
        from: "direct";
    } | {
        blocks: Block[];
        publish: boolean;
        from: "publish-aid";
    }>;
    /**
     * Get all the balances for the given account.  See {@link Client.getAllBalances}
     * for more information.
     *
     * @param options The options to use for the request
     * @return The balances for the account
     */
    allBalances(options?: UserClientOptions): Promise<GetAllBalancesResponse>;
    /**
     * Get the balance for a given token for the given account.  See
     * {@link Client.getBalance} for more information.
     *
     * @param token The token to get the balance for
     * @param options The options to use for the request
     * @return The balance for the account of the given token
     */
    balance(token: TokenAddress | string, options?: UserClientOptions): Promise<bigint>;
    /**
     * Get the current head block for the given account.  This will return
     * the hash of the current head block for the account or null if the
     * account has no blocks.
     *
     * @param options The options to use for the request
     * @return The hash of the current head block for the account or null
     *         if the account has no blocks
     */
    head(options?: UserClientOptions): Promise<BlockHash | null>;
    /**
     * Get a specific block by its hash.  This will return the block
     * if it is known to the network or null if it is not.
     *
     * @param blockhash The hash of the block to get
     * @return The block if it is known to the network or null if it is not
     */
    block(blockhash: BlockHash | string): Promise<Block | null>;
    /**
     * Get the chain for the given account.  This will return the chain
     * as {@link Client.getChain} does.
     *
     * @param query The query to use for the chain
     * @param options The options to use for the request
     * @return The chain for the account, paginated
     */
    chain(query?: Parameters<Client['getChain']>[1], options?: UserClientOptionsReadOnly): Promise<Block[]>;
    /**
     * Get the history for the given account.  This will return the
     * history as {@link Client.getHistory} does.
     *
     * @param query The query to use for the history
     * @param options The options to use for the request
     * @return The history for the account, paginated
     */
    history(query?: Parameters<Client['getHistory']>[1], options?: UserClientOptionsReadOnly): Promise<{
        voteStaple: VoteStaple;
        effects: import("../lib/ledger/effects").ComputedEffectOfBlocks;
    }[]>;
    /**
     * Filter the given vote staples for the user client account.  See {@link UserClient.filterStapleOperations}
     * for more information.
     *
     * @param voteStaples The vote staples to filter
     * @param options The options to use for the request
     * @return The filtered operations for the given account, ordered by vote staple hash, then by block, and then containing each operation
     */
    filterStapleOperations(voteStaples: VoteStaple[], options?: UserClientOptionsReadOnly): {
        [stapleHash: string]: {
            block: Block;
            filteredOperations: BlockOperations[];
        }[];
    };
    /**
     * Get the current live state of the account.  This will return the
     * current state of the account as {@link Client.getAccountInfo} does.
     *
     * @param options The options to use for the request
     * @return The current state of the account
     */
    state(options?: UserClientOptionsReadOnly): ReturnType<Client['getAccountInfo']>;
    /**
     * List ACLs for the given account.  This will return the ACLs
     * that relate to specified entities.  See {@link Client.listACLsByPrincipal}
     * for more information.
     *
     * @param entities The list of entities to get the ACLs for
     * @param options The options to use for the request
     * @return The ACLs for the account
     */
    listACLsByPrincipal(entities?: (GenericAccount | string)[], options?: UserClientOptionsReadOnly): ReturnType<Client['listACLsByPrincipal']>;
    /**
     * List ACLs for the given account.  This will return the ACLs
     * the account has set. See {@link Client.listACLsByEntity}
     * for more information.
     *
     * @param options The options to use for the request
     * @return The ACLs for the account
     */
    listACLsByEntity(options?: UserClientOptionsReadOnly): ReturnType<Client['listACLsByEntity']>;
    /**
     * List ACLs that others have set for the given account.  See {@link Client.listACLsByEntity}
     * for more information.
     *
     * @param options The options to use for the request
     * @return The ACLs applied for the account
     */
    listACLsByPrincipalWithInfo(options?: UserClientOptionsReadOnly): ReturnType<Client['listACLsByPrincipalWithInfo']>;
    /**
     * Get the pending block for the given account.  This will return
     * any side-ledger block for that account, or null if there is no
     * pending block.
     *
     * @param options The options to use for the request
     * @return The pending block for the account or null if there is no
     *         pending block
     */
    pendingBlock(options?: UserClientOptionsReadOnly): Promise<Block | null>;
    /**
     * Recover any unpublished or half-publish account artifacts
     *
     * @param publish Publish the recovered staple to the network
     *        (default: true)
     * @param options User client options (common options)
     */
    recover(publish?: boolean, options?: UserClientOptions): Promise<VoteStaple | null>;
    /**
     * Sync any partially-published account artifacts
     *
     * @param publish Publish the recovered staple to the network
     *        (default: true)
     * @param options User client options (common options)
     */
    sync(publish?: boolean, options?: UserClientOptions): Promise<VoteStaple | null>;
    /**
     * Register a callback for change messages and set up a websocket filtered to our account only.
     * Also set up long timeout polling for changes in case the websocket misses a change update
     * Check that parameters of function complies with respective event function
     */
    on<EventName extends UserClientEventName>(event: EventName, handler: UserClientListenerTypes[EventName], listenerOptions?: UserClientListenerOptions[EventName]): symbol;
    /**
     * Cancel a previously registered callback from {@link on}
     */
    off(id: symbol): void;
    /**
     * Destroy this instance -- this is required to clean up all resources.
     */
    destroy(): Promise<void>;
    /**
     * This enables the use of `using` to automatically clean up the
     * instance of the {@link UserClient} class when it is no longer
     * needed.
     *
     * It calls the {@link destroy}() method to clean up the instance when
     * it goes out of scope.
     */
    [Symbol.asyncDispose](): Promise<void>;
    /**
     * Get the configuration for this UserClient instance.
     */
    get config(): UserClientConfig;
    /**
     * Get the low-level {@link Client | client} for this instance.
     */
    get client(): Client;
    /**
     * Get the signer for this instance, if it was set.  This is the
     * account that will be used to sign blocks and transactions.
     * If this is null, then the client is readonly and will not be
     * able to publish blocks or transactions.
     */
    get signer(): Account | null;
    /**
     * Get the account for this instance.  This is the account that will
     * be affected by the blocks and transactions that are published.
     */
    get account(): GenericAccount;
    /**
     * Get the network ID for this instance.  This is the network that
     * this instance is connected to.
     */
    get network(): bigint;
    /**
     * Whether or not this client is "readonly".  This is true if the
     * signer is null.
     */
    get readonly(): boolean;
}
/** @hidden */
export declare function blockGenerator(seed: string, index: number, transactionCount: number, network?: bigint): Promise<VoteStaple>;
/** @hidden */
export declare function emitBlocks(client: Client, blocks: number, seed: string, index: number, transactionCount: number, network?: bigint): Promise<void>;
/**
 * Utilities needed for working with KeetaNet
 * @summary
 * Utilities needed for working with KeetaNet
 */
export declare const lib: {
    Account: typeof Account;
    Block: typeof Block;
    Error: typeof KeetaNetError;
    Ledger: typeof import("../lib/ledger").Ledger;
    Node: typeof import("../lib/node").Node;
    P2P: typeof import("../lib/p2p").P2PSwitch;
    Permissions: typeof import("../lib/permissions").Permissions;
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
export {};
