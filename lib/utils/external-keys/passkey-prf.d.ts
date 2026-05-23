/**
 * ExternalKeyPair for the Keeta Network which uses the PRF (Pseudo-Random
 * Function) extension of the WebAuthn API to generate a key pair that can be
 * used for signing and verifying messages. The PRF extension allows for the
 * generation of a key pair that is derived from a secret value, which can be
 * used for authentication and encryption purposes. This implementation uses
 * the WebAuthn API to create a new credential with the PRF extension and then
 * extracts the public key from the generated credential.
 */
import type * as KeetaNet from '../../../client';
import type { AccountKeyAlgorithm } from '../../../lib/account';
type KeetaPasskeyPRFKeyPairPackages = {
    KeetaNet: {
        lib: {
            Account: typeof KeetaNet.lib.Account;
            Utils: {
                Helper: typeof KeetaNet.lib.Utils.Helper;
                Buffer: typeof KeetaNet.lib.Utils.Buffer;
            };
        };
    };
    navigator: {
        credentials: Pick<Navigator['credentials'], 'create' | 'get'>;
    };
    bip39: {
        entropyToMnemonic: (entropy: Uint8Array) => string;
    };
};
type KeetaPasskeyPRFKeyPairOptions = {
    /**
     * Key type to generate from the PRF output.  This is optional and
     * defaults to ECDSA_SECP256K1, but can be set to any supported key
     * type
     */
    keyType?: AccountKeyAlgorithm;
    /**
     * The index to use for the generated key pair.  This is optional and
     * defaults to 0, but can be set to any non-negative integer.  The
     * index is used to allow for multiple key pairs to be generated from
     * a single Passkey credential
     */
    index?: number;
    /**
     * The salt to use for the PRF extension.  This is optional and
     * defaults to a fixed value, but can be set to any value.  The salt
     * is used to derive the keying material from the passkey.
     *
     * The default salt is the SHA2-256 hash of the UTF-8 bytes of the
     * string "keeta.com/wallet/seed/v1" and should generally be used.
     */
    salt?: Uint8Array;
    /**
     * Time in milliseconds to cache the backing account for signing and
     * decryption operations.  This is optional and defaults to no
     * caching of the account (the safest option), but can be set to a
     * positive integer to cache the account for a certain amount of time
     * after it is first retrieved.  This removes the need for the user
     * to interact for a series of subsequent signing or decryption
     * operations, but also increases the risk of signing unintended
     * messages.
     *
     * The caching can be disabled after setup by calling
     * {@link KeetaPasskeyPRFKeyPair.removeCachedAccountTimeout}
     * on the key pair instance, which will remove the cached account
     * and disable caching.
     */
    cachedAccountTimeout?: number;
};
/**
 * Options for looking up an existing Passkey PRF key pair.  You can look up
 * a key pair by its key ID, or by its public key string (not supported yet),
 * or you can just look up any key pair (the user will be prompted to select a
 * credential.
 */
type KeetaPasskeyPRFKeyPairLookupOptions = KeetaPasskeyPRFKeyPairOptions & {
    /**
     * Relying party ID to use for looking up the credential.  This is
     * optional and defaults to not being specified, but can be set to
     * a specific relying party ID.  This will be passed to the WebAuthn
     * API and can result in errors if set incorrectly.
     */
    rpID?: string;
} & ({
    /**
     * Look up by a key ID
     */
    keyID: string;
} | {
    /**
     * Look up by a Keeta public key string
     *
     * XXX:TODO
     */
    publicKeyString: string;
} | object);
type KeetaPasskeyPRFKeyPairGenerateOptions = KeetaPasskeyPRFKeyPairOptions & {
    /**
     * "Relying Party" information from WebAuthn, which is used to
     * identify the context in which the credential is being created.
     */
    rp: {
        /**
         * The name of the relying party, which is a human-readable
         * identifier for the entity that is requesting the credential.
         *
         * This field is optional and defaults to 'Keeta Network' if
         * not provided.
         */
        name?: string;
        /**
         * The ID of the relying party, which is a unique identifier
         * for the entity that is requesting the credential.  This
         * should be a domain name (e.g. "example.com") that
         * identifies the relying party.
         */
        id: string;
    };
    /**
     * "User" information from WebAuthn, which is used to identify the
     * user for whom the credential is being created.
     */
    user: {
        /**
         * The display name of the user, which is a human-readable
         * identifier for the Passkey credential.
         */
        displayName: string;
        /**
         * The name of the user, which is a unique identifier for the
         * Passkey credential.  This should be a string that uniquely
         * identifies the user.
         */
        name: string;
        /**
         * The user ID, which is a unique identifier for the Passkey
         * credential on this Relying Party.  This should be a byte
         * array that uniquely identifies the user, and is used by the
         * authenticator to associate the credential with the user.
         *
         * This field is optional and will be generated randomly if
         * not provided.
         *
         * Generating a new Passkey with the same user ID will result
         * in the old credential being overwritten, so if you want to
         * have multiple Passkeys for the same user you should not
         * use a duplicate user ID.
         */
        id?: Uint8Array;
    };
    /**
     * Whether the generated credential should be syncable across devices.
     *
     * This is optional and defaults to false, which means the credential
     * may not be synced across devices.  If set to true, the credential
     * will be created in such a way that it can be synced across devices,
     * but this may result in the credential being stored in a less secure
     * manner by the authenticator.
     */
    syncable?: boolean;
};
interface KeetaPasskeyPRFKeyPair extends InstanceType<typeof KeetaNet.lib.Account.ExternalKeyPair> {
    /**
     * The key ID is a unique identifier for the key pair, which can be
     * used to lookup the key pair without having to search through all
     * existing key or have the user select the credential (and potentially
     * pick the "wrong" credential if they have multiple credentials).
     *
     * The key ID is generated by the authenticator so we cannot control
     * what it is.
     */
    readonly keyID: string;
    /**
     * Export the private key material for the key pair.  This should only
     * be called if you want to export the private key material for backup
     * purposes, and should not be used for regular signing operations.
     *
     * **SECURITY WARNING** This method will expose the private key
     *                      material for the key pair, which can be used to
     *                      compromise the security of the key pair.
     */
    exportPassphrase: () => Promise<string>;
    /**
     * Remove the cached account and disable further caching for this key pair.
     * This method should be called when you want to ensure that subsequent
     * signing or decryption operations will require user interaction, even if
     * a cachedAccountTimeout was configured.
     */
    removeCachedAccountTimeout: () => void;
}
interface KeetaPasskeyPRFKeyPairClass {
    lookup: (options?: KeetaPasskeyPRFKeyPairLookupOptions) => Promise<KeetaPasskeyPRFKeyPair>;
    generate: (options: KeetaPasskeyPRFKeyPairGenerateOptions) => Promise<KeetaPasskeyPRFKeyPair>;
}
export declare function KeetaPasskeyPRFKeyPairFactory(packages: KeetaPasskeyPRFKeyPairPackages): Omit<KeetaPasskeyPRFKeyPairClass, '_Testing'>;
export {};
