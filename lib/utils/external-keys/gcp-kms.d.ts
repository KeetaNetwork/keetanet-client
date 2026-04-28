/**
 * ExternalKeyPair for the Keeta Network which uses Google Cloud KMS
 * for signing operations. This implementation supports ECDSA keys on
 * both SECP256K1 and SECP256R1 curves, with potential for ED25519
 * support in the future.
 */
import type { KeyManagementServiceClient } from '@google-cloud/kms';
import type * as KeetaNet from '../../../client';
import type { AccountKeyAlgorithm } from '../../../lib/account';
import type * as crypto from 'node:crypto';
type KeetaGCPKMSKeyPairPackages = {
    KeyManagementServiceClient: typeof KeyManagementServiceClient;
    KeetaNet: {
        lib: {
            Account: typeof KeetaNet.lib.Account;
            Utils: {
                Helper: typeof KeetaNet.lib.Utils.Helper;
                Buffer: typeof KeetaNet.lib.Utils.Buffer;
                ASN1: typeof KeetaNet.lib.Utils.ASN1;
            };
        };
    };
    crypto: Pick<typeof crypto, 'createPublicKey'>;
};
type KeetaGCPKMSKeyPairOptions = {
    /**
     * The GCP KMS key resource name or config object.
     * Format: projects/<project>/locations/<location>/keyRings/<keyRing>/cryptoKeys/<key>
     */
    key: string | {
        projectId: string;
        locationId: string;
        keyRingId: string;
        keyId: string;
        versionId?: string;
    };
    /**
     * Key type for the KMS key. Optional - will be auto-detected from KMS
     * if not provided, but can be explicitly specified for validation.
     */
    keyType?: AccountKeyAlgorithm;
};
interface KeetaGCPKMSKeyPair extends InstanceType<typeof KeetaNet.lib.Account.ExternalKeyPair> {
    /**
     * The full GCP KMS key resource name used for this key pair.
     */
    readonly keyName: string;
}
interface KeetaGCPKMSKeyPairClass {
    lookup: (options: KeetaGCPKMSKeyPairOptions) => Promise<KeetaGCPKMSKeyPair>;
}
export declare function KeetaGCPKMSKeyPairFactory(packages: KeetaGCPKMSKeyPairPackages): Omit<KeetaGCPKMSKeyPairClass, '_Testing'>;
export {};
