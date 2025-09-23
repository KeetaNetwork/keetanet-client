import Account from '../lib/account';
/**
 * Known Networks that exist in the configuration database
 */
export declare const networksArray: readonly ["main", "staging", "test", "dev"];
export type Networks = typeof networksArray[number];
export type NetworkOrID = Networks | bigint;
export declare const NetworkIDs: {
    [network in Networks]: bigint;
};
/**
 * Endpoints for reaching a Node
 */
export type Endpoints = {
    /**
     * The API endpoint for the node
     */
    api: string;
    /**
     * The P2P endpoint for the node
     */
    p2p: string;
};
/**
 * Definition of a Representative
 * @expandType Endpoints
 */
export type Representative = {
    /**
     * The public key of the representative
     */
    key: Account;
    /**
     * The endpoints for which the representative can be reached
     */
    endpoints: Endpoints;
};
/**
 * Network Configuration for a Network
 * @expandType Networks
 * @expandType Representative
 * @expandType ValidationConfig
 */
export type NetworkConfig = {
    networkAlias: Networks;
    network: bigint;
    initialTrustedAccount: Account;
    representatives: Representative[];
    validation: ValidationConfig;
    publishAidURL?: string;
};
interface NumericValidationRule {
    maxValue: bigint;
    minValue: bigint;
}
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
        supply: Omit<NumericValidationRule, 'minValue'>;
        blockSignerCount: Omit<NumericValidationRule, 'minValue'>;
        blockSignerDepth: Omit<NumericValidationRule, 'minValue'>;
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
