/**
 * ExternalKeyPair for the Keeta Network which uses Google Cloud KMS
 * to wrap private key operations. This allows users to leverage GCP KMS for
 * decrypting an encrypted private key and performing signing and encryption
 * operations without exposing the private key material to the application.
 *
 * Internally, it uses RSA keys on GCP KMS to support decrypting the
 * supplied encrypted keying material.
 */
import type { KeyManagementServiceClient } from '@google-cloud/kms';
import type * as KeetaNet from '../../../client';
import type { AccountKeyAlgorithm } from '../../../lib/account';
import type * as crypto from 'node:crypto';
import type { GCPKMSKeyConfig } from './gcp-kms.common';
type KeetaGCPKMSWrappedKeyPairPackages = {
    /**
     * GCP KMS Key Management Service Client, used to interact with GCP KMS
     * for key lookups and decryption operations
     */
    KeyManagementServiceClient: typeof KeyManagementServiceClient;
    /**
     * Keeta Network client library
     */
    KeetaNet: {
        lib: {
            Account: typeof KeetaNet.lib.Account;
            Utils: {
                Helper: {
                    bufferToArrayBuffer: typeof KeetaNet.lib.Utils.Helper.bufferToArrayBuffer;
                };
                Buffer: typeof KeetaNet.lib.Utils.Buffer;
            };
        };
    };
    /**
     * NodeJS Crypto module, only required for encrypting the seed material
     * not required otherwise
     */
    crypto?: {
        createPublicKey: typeof crypto.createPublicKey;
        publicEncrypt: typeof crypto.publicEncrypt;
        constants: {
            RSA_PKCS1_OAEP_PADDING: typeof crypto.constants.RSA_PKCS1_OAEP_PADDING;
        };
    };
};
type AccountKeyAlgorithmNumberOrString = AccountKeyAlgorithm | keyof typeof AccountKeyAlgorithm;
type KeetaGCPKMSWrappedKeyPairOptions = {
    /**
     * The GCP KMS key resource name or config object.
     * Format: projects/<project>/locations/<location>/keyRings/<keyRing>/cryptoKeys/<key>
     */
    kmsKey: string | GCPKMSKeyConfig;
    /**
     * The encrypted seed to use for account creation
     */
    encryptedSeed: ArrayBuffer;
    /**
     * The index of the key to use for account creation (default is 0)
     */
    index?: number;
    /**
     * Key type for this key
     */
    keyType: AccountKeyAlgorithmNumberOrString;
};
interface KeetaGCPKMSWrappedKeyPairClass {
    encryptSeed: (input: ArrayBuffer, options: Omit<KeetaGCPKMSWrappedKeyPairOptions, 'encryptedSeed'>) => Promise<ArrayBuffer>;
    lookup: (options: KeetaGCPKMSWrappedKeyPairOptions) => Promise<InstanceType<typeof KeetaNet.lib.Account>>;
    lookupFromJSON: ((input: Pick<KeetaGCPKMSWrappedKeyPairOptions, 'kmsKey' | 'keyType' | 'index'> & {
        encryptedSeed: string;
        type: 'gcpkmswrapped';
    }) => Promise<InstanceType<typeof KeetaNet.lib.Account>>) | ((input: unknown) => Promise<InstanceType<typeof KeetaNet.lib.Account>>);
    lookupFromString: (input: string) => Promise<InstanceType<typeof KeetaNet.lib.Account>>;
    getJSONFromOptions: (options: KeetaGCPKMSWrappedKeyPairOptions) => Promise<{
        type: 'gcpkmswrapped';
        kmsKey: string;
        keyType: string;
        encryptedSeed: string;
        index: number;
    }>;
    getStringFromOptions: (options: KeetaGCPKMSWrappedKeyPairOptions) => Promise<string>;
}
export declare function KeetaGCPKMSWrappedKeyPairFactory(packages: KeetaGCPKMSWrappedKeyPairPackages): Omit<KeetaGCPKMSWrappedKeyPairClass, '_Testing'>;
export {};
