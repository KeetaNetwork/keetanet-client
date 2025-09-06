import KeetaNet from '../lib';
import type { AccountInfo, GetAllBalancesResponse, LedgerStatistics, ACLRow } from '../lib/ledger/types';
import type { P2PSwitchStatistics } from '../lib/p2p';
import { NodeKind } from '../lib/node';
import Block, { BlockHash } from '../lib/block';
import type { APIRequest } from '.';
import type { Endpoints } from '../config';
import type { GenericAccount, TokenAddress } from '../lib/account';
import Account from '../lib/account';
import type { VoteStaple } from '../lib/vote';
interface GetPeersAPIResponse {
    kind: NodeKind;
    key?: string;
    endpoints?: {
        p2p: string;
        api: string;
    };
    preferUpdates?: string;
    signature?: string;
}
interface GetAccountChainAPIResponse {
    account: string;
    blocks: {
        block: Block;
    }[];
    nextKey: BlockHash | null;
}
interface AccountState {
    account: GenericAccount;
    currentHeadBlock: BlockHash | null;
    currentHeadBlockHeight: bigint | null;
    representative: Account | null;
    balances: GetAllBalancesResponse;
    info: AccountInfo;
}
interface AccountStateError {
    account: string;
    error: string;
}
interface GetAllRepresentativesAPIResponse {
    representative: string;
    weight: bigint;
    endpoints: Endpoints;
}
interface GetRepresentativeAPIResponse {
    representative: string;
    weight: bigint;
}
interface GetLedgerChecksumAPIResponse {
    moment: Date;
    momentRange: number;
    checksum: bigint;
}
interface PrincipalACLWithInfoResponse {
    account: GenericAccount;
    access: {
        entity: GenericAccount;
        info: AccountInfo;
        balances: GetAllBalancesResponse;
        principals: ACLRow[];
    }[];
}
interface GetAccountHistoryResponse {
    history: {
        voteStaple: VoteStaple;
        '$id': string;
        '$timestamp': string;
    }[];
    nextKey: InstanceType<typeof KeetaNet.Vote.VoteBlocksHash> | null;
}
declare function getPeers(request: APIRequest): Promise<{
    peers: GetPeersAPIResponse[];
}>;
declare function publishVoteStaple(request: APIRequest, payload: {
    votesAndBlocks: string;
}): Promise<{
    publish: boolean;
}>;
declare function getNodeStats(request: APIRequest): Promise<{
    ledger: LedgerStatistics;
    switch: P2PSwitchStatistics;
}>;
declare function debugClearStats(_ignored_request: APIRequest): Promise<{
    clearStats: boolean;
}>;
declare function getBlockSuccessor(request: APIRequest, blockhash: string): Promise<{
    blockhash: string;
    successorBlock: null | Block;
}>;
declare function getAccountPendingBlock(request: APIRequest, account: string): Promise<{
    account: string;
    block: null | Block;
}>;
declare function getAccountsHead(request: APIRequest, account: string | GenericAccount): Promise<{
    account: GenericAccount;
    block: null | Block;
}>;
declare function getAccountBalance(request: APIRequest, account: string | GenericAccount, token: string | TokenAddress): Promise<{
    account: GenericAccount;
    token: TokenAddress;
    balance: bigint;
}>;
declare function getAllBalances(request: APIRequest, account: string | GenericAccount): Promise<{
    account: GenericAccount;
    balances: GetAllBalancesResponse;
}>;
declare function getAccountCertificates(request: APIRequest, account: string): Promise<{
    account: string;
    certificates: {
        certificate: string;
        intermediates: string[] | null;
    }[];
}>;
declare function getCertificateByHash(request: APIRequest, account: string, certificateHash: string): Promise<{
    certificate: string;
    intermediates: string[] | null;
    account: string;
} | {
    certificate: null;
    intermediates: null;
    account: string;
}>;
declare function getAccountState(request: APIRequest, pubKey: string): Promise<AccountState | AccountStateError>;
declare function getBlockByHash(request: APIRequest, blockhash: string): Promise<{
    blockhash: string;
    block: null | Block;
}>;
declare function getAccountStates(request: APIRequest, accounts: string): Promise<(AccountState | AccountStateError)[]>;
declare function listACLsByEntity(request: APIRequest, entity: string | GenericAccount): Promise<{
    permissions: ACLRow[];
}>;
declare function listACLsByPrincipal(request: APIRequest, principal: string | GenericAccount, entityPubKeys: string): Promise<{
    permissions: ACLRow[];
}>;
declare function listACLsByPrincipalWithInfo(request: APIRequest, principalPubKey: string, entityList?: string): Promise<PrincipalACLWithInfoResponse>;
declare function getAccountChain(request: APIRequest, account: string): Promise<GetAccountChainAPIResponse>;
declare function getAccountHistory(request: APIRequest, account?: string | unknown, startFromURL?: unknown): Promise<GetAccountHistoryResponse>;
declare function getAllRepresentatives(request: APIRequest): Promise<{
    representatives: GetAllRepresentativesAPIResponse[];
}>;
declare function getRepresentative(request: APIRequest, providedRep?: string): Promise<GetRepresentativeAPIResponse>;
declare function getLedgerChecksum(request: APIRequest): Promise<GetLedgerChecksumAPIResponse>;
declare function getVoteStaplesAfter(request: APIRequest): Promise<{
    voteStaples: VoteStaple[];
}>;
declare function getVersion(): Promise<{
    node: string;
}>;
declare const _default: {
    peers: {
        GET: typeof getPeers;
    };
    publish: {
        POST: typeof publishVoteStaple;
    };
    stats: {
        GET: typeof getNodeStats;
    };
    ledger: {
        clearstats: {
            GET: typeof debugClearStats;
        };
        block: {
            ':blockhash': {
                GET: typeof getBlockByHash;
                successor: {
                    GET: typeof getBlockSuccessor;
                };
            };
        };
        representative: {
            GET: typeof getRepresentative;
            ':rep': {
                GET: typeof getRepresentative;
            };
        };
        representatives: {
            GET: typeof getAllRepresentatives;
        };
        history: {
            GET: typeof getAccountHistory;
        };
        account: {
            ':account': {
                GET: typeof getAccountState;
                head: {
                    GET: typeof getAccountsHead;
                };
                chain: {
                    GET: typeof getAccountChain;
                };
                history: {
                    GET: typeof getAccountHistory;
                    start: {
                        ':block': {
                            GET: typeof getAccountHistory;
                        };
                    };
                };
                balance: {
                    GET: typeof getAllBalances;
                    ':token': {
                        GET: typeof getAccountBalance;
                    };
                };
                acl: {
                    granted: {
                        GET: typeof listACLsByEntity;
                    };
                    additional: {
                        GET: typeof listACLsByPrincipalWithInfo;
                        ':entityList': {
                            GET: typeof listACLsByPrincipalWithInfo;
                        };
                    };
                    GET: typeof listACLsByPrincipal;
                    ':entityList': {
                        GET: typeof listACLsByPrincipal;
                    };
                };
                certificates: {
                    GET: typeof getAccountCertificates;
                    ':certificateHash': {
                        GET: typeof getCertificateByHash;
                    };
                };
                pending: {
                    GET: typeof getAccountPendingBlock;
                };
            };
        };
        accounts: {
            ':accounts': {
                GET: typeof getAccountStates;
            };
        };
        checksum: {
            GET: typeof getLedgerChecksum;
        };
    };
    bootstrap: {
        votes: {
            GET: typeof getVoteStaplesAfter;
        };
    };
    version: {
        GET: typeof getVersion;
    };
};
export default _default;
