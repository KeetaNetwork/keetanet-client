import * as KeetaNet from '.';
import type LocalNode from '../lib/node/local';
import type { Networks } from '../config';
import type Account from '../lib/account';
import type { UserClient } from '.';
import { toJSONSerializable } from '../lib/utils/conversion';
import KeetaError from '../lib/error';
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
};
export declare function setup(options?: NodeCreationOptions): Promise<{
    trustedKey: Account<import("../lib/account").AccountKeyAlgorithm.ECDSA_SECP256K1>;
    repKeys: Account<import("../lib/account").AccountKeyAlgorithm.ECDSA_SECP256K1 | import("../lib/account").AccountKeyAlgorithm.ED25519 | import("../lib/account").AccountKeyAlgorithm.ECDSA_SECP256R1>[];
    accounts: Account<import("../lib/account").AccountKeyAlgorithm.ECDSA_SECP256K1>[];
    nodes: LocalNode[];
    trustedClients: KeetaNet.UserClient[];
    userClients: KeetaNet.UserClient[];
    networkAddress: import("../lib/account").NetworkAddress;
    baseToken: import("../lib/account").TokenAddress;
    params: ClientParams;
    cleanupFunctions: (() => Promise<void>)[];
}>;
declare function runBasicTests(nodes: LocalNode[], userClient: UserClient, trustedClient: UserClient, params: ClientParams, expect: any, _ignoreExpectErrorCode: any): Promise<void>;
declare function runBuilderStorageTests(_ignoreNodes: LocalNode[], userClient: UserClient, trustedClient: UserClient, params: ClientParams, expect: any, ExpectErrorCode: any): Promise<void>;
declare function runRecoverAccountTest(nodes: LocalNode[], userClient: UserClient, trustedClient: UserClient, params: ClientParams, expect: any, ExpectErrorCode: any): Promise<void>;
declare function runNonNodeTests(_ignore_nodes: LocalNode[], _ignore_userClient: UserClient, _ignore_trustedClient: UserClient, _ignore_params: ClientParams, expect: any, _ignore_ExpectErrorCode: any): Promise<void>;
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
};
export declare const KeetaNetError: typeof KeetaError;
export { toJSONSerializable };
