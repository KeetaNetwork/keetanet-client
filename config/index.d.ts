import Account from '../lib/account';
/**
 * Known Networks that exist in the configuration database
 */
export declare const networksArray: readonly ["production", "staging", "beta", "test", "dev"];
export type Networks = typeof networksArray[number];
export type NetworkOrID = Networks | bigint;
export declare const NetworkIDs: {
    [network in Networks]: bigint;
};
/**
 * Endpoints for reaching a Node
 */
export type Endpoints = {
    api: string;
    p2p: string;
};
/**
 * Definition of a Representative
 */
export type Representative = {
    key: Account;
    endpoints: Endpoints;
};
/**
 * Network Configuration for a Network
 */
export type NetworkConfig = {
    networkAlias: Networks;
    network: bigint;
    initialTrustedAccount: Account;
    representatives: Representative[];
    validation: ValidationConfig;
    publishAidURL?: string;
};
interface TextValidationRule {
    regex: RegExp;
    maxLength: number;
    canBeEmpty?: boolean;
}
export interface ValidationConfig {
    accountInfoFieldRules: {
        name: TextValidationRule;
        description: TextValidationRule;
        metadata: TextValidationRule;
    };
    permissions: {
        maxExternalOffset: number;
    };
    blockOperations: {
        external: TextValidationRule;
    };
}
export declare const baseValidationConfig: ValidationConfig;
export declare function getNetworkAlias(networkOrID: bigint | Networks): Networks;
export declare function getValidation(networkOrID: bigint | Networks): ValidationConfig;
/**
 * Get the Default Configuration for a network in the configuration database
 */
export declare function getDefaultConfig(network: Networks): NetworkConfig;
export declare function isNetwork(network: any): network is Networks;
export {};
