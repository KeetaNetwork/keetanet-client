import type Node from '../lib/node';
import type { JSONSerializable } from '../lib/utils/conversion';
declare const rootTree: {
    vote: {
        _root: {
            POST: (request: APIRequest, payload: {
                blocks: string[];
                votes?: string[];
                quote?: string;
            }) => Promise<{
                vote: import("../lib/vote").Vote;
            }>;
        };
        ':blockhash': {
            GET: (request: APIRequest, blockhash: string) => Promise<{
                blockhash: import("../lib/block").BlockHash;
                votes: import("../lib/vote").Vote[] | null;
            }>;
        };
        quote: {
            POST: (request: APIRequest, payload: {
                blocks: string[];
            }) => Promise<{
                quote: import("../lib/vote").VoteQuote;
            }>;
        };
    };
    node: {
        peers: {
            GET: (request: APIRequest) => Promise<{
                peers: import("./node").NodeAPIGetPeersResponse[];
            }>;
        };
        publish: {
            POST: (request: APIRequest, payload: {
                votesAndBlocks: string;
            }) => Promise<{
                publish: boolean;
            }>;
        };
        stats: {
            GET: (request: APIRequest) => Promise<{
                ledger: import("../lib/ledger/types").LedgerStatistics;
                switch: import("../lib/p2p").P2PSwitchStatistics;
            }>;
        };
        ledger: {
            clearstats: {
                GET: (_ignored_request: APIRequest) => Promise<{
                    clearStats: boolean;
                }>;
            };
            block: {
                ':blockhash': {
                    GET: (request: APIRequest, blockhash: string) => Promise<{
                        blockhash: string;
                        block: null | import("../lib/block").Block;
                    }>;
                    successor: {
                        GET: (request: APIRequest, blockhash: string) => Promise<{
                            blockhash: string;
                            successorBlock: null | import("../lib/block").Block;
                        }>;
                    };
                };
            };
            representative: {
                GET: (request: APIRequest, providedRep?: string) => Promise<import("./node").NodeAPIGetRepresentativeResponse>;
                ':rep': {
                    GET: (request: APIRequest, providedRep?: string) => Promise<import("./node").NodeAPIGetRepresentativeResponse>;
                };
            };
            representatives: {
                GET: (request: APIRequest) => Promise<{
                    representatives: import("./node").NodeAPIGetAllRepresentativesResponse[];
                }>;
            };
            history: {
                GET: (request: APIRequest, account?: string | unknown, startFromURL?: unknown) => Promise<import("./node").NodeAPIGetAccountHistoryResponse>;
            };
            account: {
                ':account': {
                    GET: (request: APIRequest, pubKey: string) => Promise<import("./node").NodeAPIAccountState | import("./node").NodeAPIAccountStateError>;
                    head: {
                        GET: (request: APIRequest, account: string | import("../lib/account").GenericAccount) => Promise<{
                            account: import("../lib/account").GenericAccount;
                            block: null | import("../lib/block").Block;
                        }>;
                    };
                    chain: {
                        GET: (request: APIRequest, account: string) => Promise<import("./node").NodeAPIGetAccountChainResponse>;
                    };
                    history: {
                        GET: (request: APIRequest, account?: string | unknown, startFromURL?: unknown) => Promise<import("./node").NodeAPIGetAccountHistoryResponse>;
                        start: {
                            ':block': {
                                GET: (request: APIRequest, account?: string | unknown, startFromURL?: unknown) => Promise<import("./node").NodeAPIGetAccountHistoryResponse>;
                            };
                        };
                    };
                    balance: {
                        GET: (request: APIRequest, account: string | import("../lib/account").GenericAccount) => Promise<{
                            account: import("../lib/account").GenericAccount;
                            balances: import("../lib/ledger/types").GetAllBalancesResponse;
                        }>;
                        ':token': {
                            GET: (request: APIRequest, account: string | import("../lib/account").GenericAccount, token: string | import("../lib/account").TokenAddress) => Promise<{
                                account: import("../lib/account").GenericAccount;
                                token: import("../lib/account").TokenAddress;
                                balance: bigint;
                            }>;
                        };
                    };
                    acl: {
                        granted: {
                            GET: (request: APIRequest, entity: string | import("../lib/account").GenericAccount) => Promise<{
                                permissions: import("../lib/ledger/types").ACLRow[];
                            }>;
                        };
                        additional: {
                            GET: (request: APIRequest, principalPubKey: string, entityList?: string) => Promise<import("./node").NodeAPIPrincipalACLWithInfoResponse>;
                            ':entityList': {
                                GET: (request: APIRequest, principalPubKey: string, entityList?: string) => Promise<import("./node").NodeAPIPrincipalACLWithInfoResponse>;
                            };
                        };
                        GET: (request: APIRequest, principal: string | import("../lib/account").GenericAccount, entityPubKeys: string) => Promise<{
                            permissions: import("../lib/ledger/types").ACLRow[];
                        }>;
                        ':entityList': {
                            GET: (request: APIRequest, principal: string | import("../lib/account").GenericAccount, entityPubKeys: string) => Promise<{
                                permissions: import("../lib/ledger/types").ACLRow[];
                            }>;
                        };
                    };
                    certificates: {
                        GET: (request: APIRequest, account: string) => Promise<{
                            account: string;
                            certificates: {
                                certificate: string;
                                intermediates: string[] | null;
                            }[];
                        }>;
                        ':certificateHash': {
                            GET: (request: APIRequest, account: string, certificateHash: string) => Promise<{
                                certificate: string;
                                intermediates: string[] | null;
                                account: string;
                            } | {
                                certificate: null;
                                intermediates: null;
                                account: string;
                            }>;
                        };
                    };
                    pending: {
                        GET: (request: APIRequest, account: string) => Promise<{
                            account: string;
                            block: null | import("../lib/block").Block;
                        }>;
                    };
                };
            };
            accounts: {
                ':accounts': {
                    GET: (request: APIRequest, accounts: string) => Promise<(import("./node").NodeAPIAccountState | import("./node").NodeAPIAccountStateError)[]>;
                };
            };
            checksum: {
                GET: (request: APIRequest) => Promise<import("./node").NodeAPIGetLedgerChecksumResponse>;
            };
        };
        bootstrap: {
            votes: {
                GET: (request: APIRequest) => Promise<{
                    voteStaples: import("../lib/vote").VoteStaple[];
                }>;
            };
        };
        version: {
            GET: () => Promise<{
                node: string;
            }>;
        };
    };
    p2p: {
        message: {
            POST: (request: APIRequest, payload: {
                message: string;
                greeting: object;
            }) => Promise<{
                success: boolean;
            }>;
        };
    };
};
export interface APIRequest {
    node: Node;
    params: {
        [name: string]: string;
    };
    query: {
        [name: string]: string;
    };
    payload: any;
    header: {
        get: (name: string) => string | undefined;
    };
}
interface HandlerMapping {
    method: 'GET' | 'PUT' | 'POST' | 'DELETE';
    path: string;
    timeout?: boolean;
    handler: (request: APIRequest, ...args: any[]) => Promise<JSONSerializable>;
}
type HandlerMappings = HandlerMapping[];
declare const to_export: HandlerMappings;
export default to_export;
export type APITree = typeof rootTree;
