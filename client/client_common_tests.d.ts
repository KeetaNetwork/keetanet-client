import * as KeetaNet from '.';
import type LocalNode from '../lib/node/local';
import type { Networks } from '../config';
import { AccountKeyAlgorithm } from '../lib/account';
import type Account from '../lib/account';
import { UserClient } from '.';
import { type CreateTestNodeOptions } from '../lib/utils/helper_testing';
import { toJSONSerializable } from '../lib/utils/conversion';
import { KeetaNetError as KeetaError } from '../lib/error';
import { type Block } from '../lib/block';
import type { Ledger } from '../lib/ledger';
import type { ComputedEffectOfBlocks } from '../lib/ledger/effects';
export type ClientParams = {
    ip?: string;
    port?: number;
    networkID: number;
    networkAlias: Networks;
    testPrivateAccount: {
        seed: string;
    };
    repKeys: string[];
    accountIndexes: number[];
    trustedKeyIndex: number;
};
export type NodeCreationOptions = {
    p2pTested?: boolean;
    count?: number;
    customNodeOptions?: Omit<CreateTestNodeOptions, 'peerNodes' | 'enableP2P' | 'initialTrustedAccount'>[];
};
export declare function setup(options?: NodeCreationOptions): Promise<{
    trustedKey: Account<AccountKeyAlgorithm.ECDSA_SECP256K1>;
    repKeys: Account<AccountKeyAlgorithm.ECDSA_SECP256K1 | AccountKeyAlgorithm.ED25519 | AccountKeyAlgorithm.ECDSA_SECP256R1>[];
    accounts: Account<AccountKeyAlgorithm.ECDSA_SECP256K1>[];
    nodes: LocalNode[];
    trustedClients: KeetaNet.UserClient[];
    userClients: KeetaNet.UserClient[];
    networkAddress: import("../lib/account").NetworkAddress;
    baseToken: import("../lib/account").TokenAddress;
    params: ClientParams;
    cleanupFunctions: (() => Promise<void>)[];
}>;
declare function runBasicTests(nodes: LocalNode[], userClient: UserClient, trustedClient: UserClient, params: ClientParams, expect: any, _ignoreExpectErrorCode: any): Promise<void>;
declare function runFeeBlockTests(_ignore_nodes: LocalNode[], userClient: UserClient, trustedClient: UserClient, params: ClientParams, expect: any, ExpectErrorCode: any): Promise<void>;
declare function runBuilderStorageTests(_ignoreNodes: LocalNode[], userClient: UserClient, trustedClient: UserClient, params: ClientParams, expect: any, ExpectErrorCode: any): Promise<void>;
declare function runRecoverAccountTest(nodes: LocalNode[], userClient: UserClient, trustedClient: UserClient, params: ClientParams, expect: any, ExpectErrorCode: any): Promise<void>;
declare function runNonNodeTests(_ignore_nodes: LocalNode[], _ignore_userClient: UserClient, _ignore_trustedClient: UserClient, _ignore_params: ClientParams, expect: any, ExpectErrorCode: any): Promise<void>;
declare function runErrorTests(nodes: LocalNode[], userClientAccount1: UserClient, trustedClient: UserClient, params: ClientParams, expect: any, ExpectErrorCode: any): Promise<void>;
export declare const clientTests: {
    'Basic Client Tests': {
        test: typeof runBasicTests;
        options: {
            p2pTested: boolean;
            count: number;
        };
    };
    'Basic Client Tests (No Node)': {
        test: typeof runNonNodeTests;
        options: {
            p2pTested: boolean;
            count: number;
            timeout: number;
        };
    };
    'Fee Block Tests': {
        test: typeof runFeeBlockTests;
        options: {
            p2pTested: boolean;
            count: number;
            customNodeOptions: {
                ledger: {
                    computeFeeFromBlocks: (ledger: Ledger, blocks: Block[], effects: ComputedEffectOfBlocks) => {
                        amount: bigint;
                    };
                };
            }[];
        };
    };
    'Builder/Storage Test': {
        test: typeof runBuilderStorageTests;
        options: {
            p2pTested: boolean;
            count: number;
        };
    };
    'Recover Account Test': {
        test: typeof runRecoverAccountTest;
        options: {
            p2pTested: boolean;
            count: number;
        };
    };
    'Client Error Tests': {
        test: typeof runErrorTests;
        options: {
            p2pTested: boolean;
            count: number;
            customNodeOptions: ({
                readonly ledger: {
                    readonly ledgerWriteMode: "no-voting";
                };
            } | {
                readonly ledger: {
                    readonly ledgerWriteMode: "read-write";
                };
            } | {
                readonly ledger: {
                    readonly ledgerWriteMode: "bootstrap-only";
                };
            } | {
                readonly ledger: {
                    readonly ledgerWriteMode: "read-only";
                };
            })[];
        };
    };
};
export declare const KeetaNetError: typeof KeetaError;
export { toJSONSerializable };
