import { BufferStorage } from './utils/buffer';
import { BufferStorageASN1 } from './utils/asn1';
import { BlockHash } from './block';
/**
 * Account encoding prefixes
 */
declare const AccountPrefixes: readonly ["keeta_", "tyblocks_"];
type AccountPrefix = typeof AccountPrefixes[any];
/**
 * Account key algorithms specify how the key should be used for validation,
 * signing, and encoding.
 */
export declare enum AccountKeyAlgorithm {
    ECDSA_SECP256K1 = 0,
    ED25519 = 1,
    NETWORK = 2,
    TOKEN = 3,
    STORAGE = 4,
    ECDSA_SECP256R1 = 6,// NIST P-256
    MULTISIG = 7
}
/**
 * Type for ASN.1 encoded public keys -- this is equivalent to {@link ValidateASN1.SchemaMap<typeof publicKeyASN1Schema>}
 * but does not reference a complex type which may exceed TypeScripts limits
 */
type publicKeyASN1 = [
    algorithmInfo: {
        type: 'oid';
        oid: string;
    }[],
    publicKey: {
        type: 'bitstring';
        value: Buffer;
    }
];
/**
 * Key pair types which we can process
 */
type KeyPairTypes = ECDSAKeyPair | ECDSASECP256K1KeyPair | ECDSASECP256R1KeyPair | ED25519KeyPair | IdentifierKeyPair | ExternalKeyPair;
/**
 * Generic interface to an account.  An account may be backed by a private key
 * (in which case it can sign data), a seed+index (which is used to generate
 * a private key), or a public key (which can only verify blocks).
 */
type PublicKeyStringPrefixed<X extends string> = `${AccountPrefix}${X}${string}`;
export type Secp256K1PublicKeyString = PublicKeyStringPrefixed<'aa' | 'ab' | 'ac' | 'ad'>;
export type Secp256R1PublicKeyString = PublicKeyStringPrefixed<'ay' | 'az' | 'a2' | 'a3'>;
export type ED25519PublicKeyString = PublicKeyStringPrefixed<'ae' | 'af' | 'ag' | 'ah'>;
export type NetworkPublicKeyString = PublicKeyStringPrefixed<'ai' | 'aj' | 'ak' | 'al'>;
export type TokenPublicKeyString = PublicKeyStringPrefixed<'am' | 'an' | 'ao' | 'ap'>;
export type StoragePublicKeyString = PublicKeyStringPrefixed<'aq' | 'ar' | 'as' | 'at'>;
export type MultisigPublicKeyString = PublicKeyStringPrefixed<'a4' | 'a5' | 'a6' | 'a7'>;
export interface PublicKeyStringMapping {
    [AccountKeyAlgorithm.ECDSA_SECP256K1]: Secp256K1PublicKeyString;
    [AccountKeyAlgorithm.ECDSA_SECP256R1]: Secp256R1PublicKeyString;
    [AccountKeyAlgorithm.ED25519]: ED25519PublicKeyString;
    [AccountKeyAlgorithm.TOKEN]: TokenPublicKeyString;
    [AccountKeyAlgorithm.NETWORK]: NetworkPublicKeyString;
    [AccountKeyAlgorithm.STORAGE]: StoragePublicKeyString;
    [AccountKeyAlgorithm.MULTISIG]: MultisigPublicKeyString;
}
export type IdentifierPublicKeyString = PublicKeyStringMapping[IdentifierKeyAlgorithm];
export type AccountPublicKeyString = Secp256K1PublicKeyString | Secp256R1PublicKeyString | ED25519PublicKeyString;
type AccountKeyAlgorithmHex = {
    [AccountKeyAlgorithm.ECDSA_SECP256K1]: '0x00';
    [AccountKeyAlgorithm.ED25519]: '0x01';
    [AccountKeyAlgorithm.TOKEN]: '0x02';
    [AccountKeyAlgorithm.NETWORK]: '0x03';
    [AccountKeyAlgorithm.STORAGE]: '0x04';
    [AccountKeyAlgorithm.ECDSA_SECP256R1]: '0x06';
    [AccountKeyAlgorithm.MULTISIG]: '0x07';
};
/**
 * A hex-encoded public key and type, where the type is the first byte
 * and the public key is the rest of the string.
 */
export type PublicKeyAndTypeStringHex<Algo extends typeof AccountKeyAlgorithm[keyof typeof AccountKeyAlgorithm] = AccountKeyAlgorithm> = `${AccountKeyAlgorithmHex[Algo]}${string}`;
type AccountKeyAlgorithmHexReverse = {
    [Hex in AccountKeyAlgorithmHex[keyof AccountKeyAlgorithmHex]]: Extract<keyof AccountKeyAlgorithmHex, {
        [K in keyof AccountKeyAlgorithmHex]: AccountKeyAlgorithmHex[K] extends Hex ? K : never;
    }[keyof AccountKeyAlgorithmHex]>;
};
type AccountKeyAlgorithmHexToType<T extends PublicKeyAndTypeStringHex> = T extends `0x${infer AlgorithmHex1}${infer AlgorithmHex2}${string}` ? `0x${AlgorithmHex1}${AlgorithmHex2}` extends keyof AccountKeyAlgorithmHexReverse ? AccountKeyAlgorithmHexReverse[`0x${AlgorithmHex1}${AlgorithmHex2}`] : never : never;
declare const identifierKeyTypes: readonly [AccountKeyAlgorithm.NETWORK, AccountKeyAlgorithm.TOKEN, AccountKeyAlgorithm.STORAGE, AccountKeyAlgorithm.MULTISIG];
export type IdentifierKeyAlgorithm = typeof identifierKeyTypes[any];
/**
 * Things we can use to construct a key from
 */
type InputKeyTypes = ConstructorParameters<typeof BufferStorage>[0];
/**
 * Public Keys should have a mechanism to get the ASN.1 encoded value
 */
interface PublicKeyStorage extends BufferStorage {
    ASN1: BufferStorageASN1<publicKeyASN1>;
}
/**
 * Keys in Ed25519 and EcDSA secp256k1/secp256r1 are 256-bits long
 */
declare class KeyStorage extends BufferStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is KeyStorage;
    constructor(key: InputKeyTypes);
}
declare class ECDSASECP256K1PrivateKey extends KeyStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is ECDSASECP256K1PrivateKey;
}
declare class ECDSASECP256K1PublicKey extends BufferStorage implements PublicKeyStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is ECDSASECP256K1PublicKey;
    constructor(key: InputKeyTypes);
    get ASN1(): BufferStorageASN1<publicKeyASN1, undefined>;
}
declare class ECDSASECP256R1PrivateKey extends KeyStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is ECDSASECP256R1PrivateKey;
}
declare class ECDSASECP256R1PublicKey extends BufferStorage implements PublicKeyStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is ECDSASECP256R1PublicKey;
    constructor(key: InputKeyTypes);
    get ASN1(): BufferStorageASN1<publicKeyASN1, undefined>;
}
declare class ED25519PrivateKey extends KeyStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is ED25519PrivateKey;
}
declare class ED25519PublicKey extends KeyStorage implements PublicKeyStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is ED25519PublicKey;
    get ASN1(): BufferStorageASN1<publicKeyASN1, undefined>;
}
declare class IdentifierKey extends KeyStorage implements PublicKeyStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is IdentifierKey;
    get ASN1(): never;
}
/**
 * Signatures in ED25519 and ECDSA SECP256K1 and R1 are 512-bits long
 */
declare class SignatureStorage extends BufferStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is SignatureStorage;
    constructor(signature: InputKeyTypes);
}
declare class ECDSASECP256K1Signature extends SignatureStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is ECDSASECP256K1Signature;
}
declare class ECDSASECP256R1Signature extends SignatureStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is ECDSASECP256R1Signature;
}
declare class ED25519Signature extends SignatureStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is ED25519Signature;
}
/**
 * A "public key string" is a base32-encoded string with a prefix and checksum
 * that contains the public key plus the algorithm information
 */
declare class PublicKeyString<T extends AccountKeyAlgorithm = AccountKeyAlgorithm> {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is PublicKeyString<AccountKeyAlgorithm>;
    constructor(publicKeyString: string);
    get publicKeyPair(): ECDSASECP256K1KeyPair | ECDSASECP256R1KeyPair | ED25519KeyPair | IdentifierKeyPair;
    get(): PublicKeyStringMapping[T];
    toString(): PublicKeyStringMapping[T];
}
/**
 * Options for signing and verifying
 */
interface signOptionsType {
    /**
     * Perform signing or verification on the raw data ?
     *
     * The default is false (meaning the data will get hashed before signed)
     */
    raw?: boolean;
    /**
     * Is this signing or verification for an X.509 certificate ?
     * The format can be different between our native format and what
     * is accept for X.509
     */
    forCert?: boolean;
}
/**
 * Signing function, accepts arbitrary data and returns a detached signature
 */
type signFunctionType = (data: ArrayBuffer, options?: signOptionsType) => Promise<ECDSASECP256K1Signature | ECDSASECP256R1Signature | ED25519Signature | BufferStorage>;
/**
 * Encryption function, accepts arbitrary data and returns an encrypted buffer
 */
type encryptFunctionType = (data: ArrayBuffer) => Promise<ArrayBuffer>;
/**
 * Decryption function, accepts arbitrary data and returns a decrypted buffer
 */
type decryptFunctionType = (data: ArrayBuffer) => Promise<ArrayBuffer>;
/**
 * Verification function, accepts data and a detached signature and returns a result.
 */
type verifyFunctionType = (data: ArrayBuffer, signature: ECDSASECP256K1Signature | ECDSASECP256R1Signature | ED25519Signature | BufferStorage | ArrayBuffer, options?: signOptionsType) => boolean;
/**
 * Key derivation from seed+index
 */
type seedDerivationFunction = (seed: ArrayBuffer | string, index: number) => ECDSASECP256K1PrivateKey | ECDSASECP256R1PrivateKey | ED25519PublicKey | IdentifierKeyPair;
/**
 * Construct new instance from seed+index
 */
type fromSeedFunctionType = (seed: ArrayBuffer | string, index: number) => IdentifierKeyPair | ED25519KeyPair | ECDSASECP256K1KeyPair | ECDSASECP256R1KeyPair;
/**
 * Abstract interface to all kinds of key-related functions
 */
declare abstract class KeyInterface {
    /**
     * Create a private key generated from a seed value and an index
     */
    static derivePrivateKeyFromSeed?: seedDerivationFunction;
    /**
     * Create a new instance with a private key generated from a seed value and index
     */
    static fromSeed?: fromSeedFunctionType;
    /**
     * Sign some data
     */
    abstract sign(...parameters: Parameters<signFunctionType>): ReturnType<signFunctionType>;
    /**
     * Verify a signature
     */
    abstract verify(...parameters: Parameters<verifyFunctionType>): ReturnType<verifyFunctionType>;
    /**
     * Encrypt some data
     */
    abstract encrypt(...parameters: Parameters<encryptFunctionType>): ReturnType<encryptFunctionType>;
    /**
     * Decrypt some data
     */
    abstract decrypt(...parameters: Parameters<decryptFunctionType>): ReturnType<decryptFunctionType>;
    /**
     * Determine if the key supports encryption/decryption
     */
    readonly abstract supportsEncryption: boolean;
    /**
     * Get the type of key in use (ECDSA or ED25519) for this key pair
     */
    readonly abstract keyType: AccountKeyAlgorithm;
    /**
     * Get the public key for this key pair
     */
    readonly abstract publicKey: ECDSASECP256K1PublicKey | ECDSASECP256R1PublicKey | ED25519PublicKey;
    /**
     * Determine if this key pair has a private key associated
     */
    readonly abstract hasPrivateKey: boolean;
    /**
     * Testing interface to validate that a private key is equal to some
     * value (undefined if undecidable)
     */
    abstract _checkPrivateKey(checkKey: ArrayBuffer): boolean | undefined;
}
/**
 * External key pairs allow arbitrary external keying mechanisms (such as
 * PKCS#11) to be used to back accounts
 */
interface BaseExternalKeyPairFunctions {
    sign: signFunctionType;
    verify?: verifyFunctionType;
    supportsEncryption: boolean;
}
interface ExternalKeyPairFunctionsSupportsEncryption extends BaseExternalKeyPairFunctions {
    supportsEncryption: true;
    encrypt?: encryptFunctionType;
    decrypt: decryptFunctionType;
}
interface ExternalKeyPairFunctionsNoEncryption extends BaseExternalKeyPairFunctions {
    supportsEncryption: false;
}
type ExternalKeyPairFunctions = ExternalKeyPairFunctionsSupportsEncryption | ExternalKeyPairFunctionsNoEncryption;
export declare class ExternalKeyPair extends KeyInterface {
    #private;
    readonly driverHandlesHashing: boolean;
    static isInstance: (obj: any, strict?: boolean) => obj is ExternalKeyPair;
    constructor(functions: ExternalKeyPairFunctions, publicKey: ArrayBuffer | string, keyType: AccountKeyAlgorithm, driverHandlesHashing?: boolean);
    sign(...parameters: Parameters<signFunctionType>): ReturnType<signFunctionType>;
    verify(data: Parameters<verifyFunctionType>[0], signature: Parameters<verifyFunctionType>[1], options: Parameters<verifyFunctionType>[2]): ReturnType<verifyFunctionType>;
    encrypt(...parameters: Parameters<encryptFunctionType>): ReturnType<encryptFunctionType>;
    decrypt(...parameters: Parameters<decryptFunctionType>): ReturnType<decryptFunctionType>;
    get supportsEncryption(): boolean;
    get keyType(): AccountKeyAlgorithm;
    get publicKey(): ECDSASECP256K1PublicKey | ECDSASECP256R1PublicKey | ED25519PublicKey;
    get hasPrivateKey(): boolean;
    _checkPrivateKey(_ignore_checkKey: ArrayBuffer): undefined;
}
/**
 * Generic ECDSA Key interface
 */
declare abstract class ECDSAKeyPair extends KeyInterface {
    readonly supportsEncryption = true;
    /**
    * Construct an SEC-like signature from a DER encoded ECDSA [R,S] structure
    */
    protected static signatureFromDERRaw(values: number[]): Uint8Array;
    /**
     * Construct an ASN.1-encoded [R,S] struct from the SEC-like value
     */
    protected static signatureToDER(signature: ECDSASECP256K1Signature | ECDSASECP256R1Signature): number[];
}
declare class ECDSASECP256K1KeyPair extends ECDSAKeyPair {
    #private;
    static derivePrivateKeyFromSeed(seed: ArrayBuffer | string, index: number): ECDSASECP256K1PrivateKey;
    static fromSeed(seed: ArrayBuffer | string, index: number): ECDSASECP256K1KeyPair;
    static derivePublicKeyFromPrivateKey(key: ECDSASECP256K1PrivateKey): ECDSASECP256K1PublicKey;
    static signatureFromDER(signature: number[]): ECDSASECP256K1Signature;
    static signatureToDER(signature: ECDSASECP256K1Signature): number[];
    static isInstance: (obj: any, strict?: boolean) => obj is ECDSASECP256K1KeyPair;
    constructor(privateKey?: ECDSASECP256K1PrivateKey | ArrayBuffer | string, publicKey?: ECDSASECP256K1PublicKey | ArrayBuffer | string);
    sign(data: ArrayBuffer, options?: signOptionsType): Promise<ECDSASECP256K1Signature | BufferStorage>;
    verify(data: ArrayBuffer, signature: ECDSASECP256K1Signature | BufferStorage | ArrayBuffer, options?: signOptionsType): boolean;
    encrypt(data: ArrayBuffer): Promise<ArrayBuffer>;
    decrypt(data: ArrayBuffer): Promise<ArrayBuffer>;
    get keyType(): AccountKeyAlgorithm;
    get publicKey(): ECDSASECP256K1PublicKey;
    get hasPrivateKey(): boolean;
    _checkPrivateKey(checkKey: ArrayBuffer): boolean | undefined;
}
declare class ECDSASECP256R1KeyPair extends ECDSAKeyPair {
    #private;
    static derivePrivateKeyFromSeed(seed: ArrayBuffer | string, index: number): ECDSASECP256R1PrivateKey;
    static fromSeed(seed: ArrayBuffer | string, index: number): ECDSASECP256R1KeyPair;
    static derivePublicKeyFromPrivateKey(key: ECDSASECP256R1PrivateKey): ECDSASECP256R1PublicKey;
    /**
    * Construct an SEC-like signature from a DER encoded ECDSA [R,S] structure
    */
    static signatureFromDER(signature: number[]): ECDSASECP256R1Signature;
    /**
     * Construct an ASN.1-encoded [R,S] struct from the SEC-like value
     */
    static signatureToDER(signature: ECDSASECP256R1Signature): number[];
    static isInstance: (obj: any, strict?: boolean) => obj is ECDSASECP256R1KeyPair;
    constructor(privateKey?: ECDSASECP256R1PrivateKey | ArrayBuffer | string, publicKey?: ECDSASECP256R1PublicKey | ArrayBuffer | string);
    sign(data: ArrayBuffer, options?: signOptionsType): Promise<ECDSASECP256R1Signature | BufferStorage>;
    verify(data: ArrayBuffer, signature: ECDSASECP256R1Signature | BufferStorage | ArrayBuffer, options?: signOptionsType): boolean;
    encrypt(data: ArrayBuffer): Promise<ArrayBuffer>;
    decrypt(data: ArrayBuffer): Promise<ArrayBuffer>;
    get keyType(): AccountKeyAlgorithm;
    get publicKey(): ECDSASECP256R1PublicKey;
    get hasPrivateKey(): boolean;
    _checkPrivateKey(checkKey: ArrayBuffer): boolean | undefined;
}
/**
 * ED25519 Key Interface
 */
declare class ED25519KeyPair extends KeyInterface {
    #private;
    readonly supportsEncryption = true;
    static derivePrivateKeyFromSeed(seed: ArrayBuffer | string, index: number): ED25519PrivateKey;
    static fromSeed(seed: ArrayBuffer | string, index: number): ED25519KeyPair;
    static derivePublicKeyFromPrivateKey(key: ED25519PrivateKey): ED25519PublicKey;
    static isInstance: (obj: any, strict?: boolean) => obj is ED25519KeyPair;
    constructor(privateKey?: ED25519PrivateKey | ArrayBuffer | string, publicKey?: ED25519PublicKey | ArrayBuffer | string);
    sign(data: ArrayBuffer): Promise<ED25519Signature>;
    verify(data: ArrayBuffer, signature: ED25519Signature | BufferStorage | ArrayBuffer): boolean;
    encrypt(data: ArrayBuffer): Promise<ArrayBuffer>;
    decrypt(data: ArrayBuffer): Promise<ArrayBuffer>;
    get keyType(): AccountKeyAlgorithm;
    get publicKey(): ED25519PublicKey;
    get hasPrivateKey(): boolean;
    _checkPrivateKey(checkKey: ArrayBuffer): boolean | undefined;
}
declare class IdentifierKeyPair extends KeyInterface {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is IdentifierKeyPair;
    readonly supportsEncryption = false;
    static derivePrivateKeyFromSeed(seed: ArrayBuffer | string, index: number): IdentifierKey;
    static derivePublicKeyFromPrivateKey(key: IdentifierKey): IdentifierKey;
    constructor(key: IdentifierKey | ArrayBuffer | string, identifierType: IdentifierKeyAlgorithm);
    sign(_ignored_data: ArrayBuffer): Promise<BufferStorage>;
    verify(_ignored_data: ArrayBuffer, _ignored_signature: ED25519Signature | ArrayBuffer): boolean;
    get publicKey(): IdentifierKey;
    get hasPrivateKey(): boolean;
    get keyType(): AccountKeyAlgorithm;
    static fromSeed(seed: ArrayBuffer | string, index: number, type?: AccountKeyAlgorithm & IdentifierKeyAlgorithm): IdentifierKeyPair;
    _checkPrivateKey(_ignored_checkKey: ArrayBuffer): boolean | undefined;
    encrypt(..._ignored_parameters: Parameters<encryptFunctionType>): ReturnType<encryptFunctionType>;
    decrypt(..._ignored_parameters: Parameters<decryptFunctionType>): ReturnType<decryptFunctionType>;
}
/**
 * Account class, which is used to represent a key pair or an identifier
 * account (which have no private key) such as tokens.
 *
 * @template T - The type of the key algorithm used for this account.
 */
export declare class Account<T extends AccountKeyAlgorithm = Exclude<AccountKeyAlgorithm, IdentifierKeyAlgorithm>> {
    #private;
    static AccountKeyAlgorithm: typeof AccountKeyAlgorithm;
    static ExternalKeyPair: typeof ExternalKeyPair;
    /**
     * Construct an account from a public key string.  The public key
     * string encodes the type and public key data
     */
    static fromPublicKeyString(key: TokenPublicKeyString): Account<AccountKeyAlgorithm.TOKEN>;
    static fromPublicKeyString(key: NetworkPublicKeyString): Account<AccountKeyAlgorithm.NETWORK>;
    static fromPublicKeyString(key: StoragePublicKeyString): Account<AccountKeyAlgorithm.STORAGE>;
    static fromPublicKeyString(key: MultisigPublicKeyString): Account<AccountKeyAlgorithm.MULTISIG>;
    static fromPublicKeyString(key: Secp256K1PublicKeyString): Account<AccountKeyAlgorithm.ECDSA_SECP256K1>;
    static fromPublicKeyString(key: Secp256R1PublicKeyString): Account<AccountKeyAlgorithm.ECDSA_SECP256R1>;
    static fromPublicKeyString(key: ED25519PublicKeyString): Account<AccountKeyAlgorithm.ED25519>;
    static fromPublicKeyString(key: IdentifierPublicKeyString): Account<IdentifierKeyAlgorithm>;
    static fromPublicKeyString(key: AccountPublicKeyString): Account;
    static fromPublicKeyString(key: string): GenericAccount;
    /**
     * Construct an account from an ECDSA private key for SECP256K1.
     */
    static fromECDSASECP256K1PrivateKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.ECDSA_SECP256K1>;
    /**
     * Construct an account from an ECDSA private key for SECP256R1.
     */
    static fromECDSASECP256R1PrivateKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.ECDSA_SECP256R1>;
    /**
     * Construct an account from an ED25519 private key.
     */
    static fromED25519PrivateKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.ED25519>;
    /**
     * Construct an account from an ECDSA public key for SECP256K1.
     */
    static fromECDSASECP256K1PublicKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.ECDSA_SECP256K1>;
    /**
     * Construct an account from an ECDSA public key for SECP256R1.
     */
    static fromECDSASECP256R1PublicKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.ECDSA_SECP256R1>;
    /**
     * Construct an identifier account from the input key and the identifier algo
     */
    protected static fromIdentifierPublicKey<Type extends IdentifierKeyAlgorithm>(key: InputKeyTypes, type: Type): Account<Type>;
    /**
     * Construct an account from a network identifier public key
     */
    static fromNetworkPublicKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.NETWORK>;
    /**
     * Construct an account from a token identifier public key
     */
    static fromTokenPublicKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.TOKEN>;
    /**
     * Construct an account from a storage identifier public key
     */
    static fromStoragePublicKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.STORAGE>;
    /**
     * Construct an account from a multisig identifier public key
     */
    static fromMultisigPublicKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.MULTISIG>;
    /**
     * Construct an account from an ED25519 public key.
     */
    static fromED25519PublicKey(key: InputKeyTypes): Account<AccountKeyAlgorithm.ED25519>;
    /**
     * Construct an Account from an KeyType and Public Key buffer
     */
    static fromPublicKeyAndType(keyData: Buffer): GenericAccount;
    static fromPublicKeyAndType<T extends AccountKeyAlgorithm>(keyData: PublicKeyAndTypeStringHex<T>): Account<T>;
    static fromPublicKeyAndType(keyData: string): GenericAccount;
    /**
     * Construct a new account from a public key encoded in DER-encoded ASN.1
     */
    static fromASN1(asn1: ArrayBuffer | publicKeyASN1): Account;
    /**
     * Construct an account from a Seed and Index.
     */
    static fromSeed<Z extends AccountKeyAlgorithm>(seed: ArrayBuffer | string | bigint, index: number, keyType: Z): Account<Z>;
    static fromSeed(seed: ArrayBuffer | string | bigint, index: number): Account<AccountKeyAlgorithm.ECDSA_SECP256K1>;
    static generateNetworkAddress(networkId: bigint): NetworkAddress;
    static generateBaseAddresses(networkId: bigint): {
        networkAddress: NetworkAddress;
        baseToken: TokenAddress;
    };
    /**
     * Securely generate a new random seed value
     */
    static generateRandomSeed(options: {
        asString: true;
    }): string;
    static generateRandomSeed(options: {
        asString: false;
    }): ArrayBuffer;
    static generateRandomSeed(): ArrayBuffer;
    static generateRandomSeed(options?: {
        asString: boolean;
    }): ArrayBuffer | string;
    /**
     * Convert a passphrase into a seed
     */
    static seedFromPassphrase(passphrase: string, options: {
        asString: true;
    }): Promise<string>;
    static seedFromPassphrase(passphrase: string, options: {
        asString: false;
    }): Promise<ArrayBuffer>;
    static seedFromPassphrase(passphrase: string): Promise<ArrayBuffer>;
    static seedFromPassphrase(passphrase: string, options?: {
        asString: boolean;
    }): Promise<ArrayBuffer | string>;
    static toAccount(): undefined;
    static toAccount(acct: null): null;
    static toAccount(acct: undefined): undefined;
    static toAccount<X extends PublicKeyAndTypeStringHex>(acct: X): Account<AccountKeyAlgorithmHexToType<X>>;
    static toAccount<toAlgo extends AccountKeyAlgorithm>(acct: string | Account<toAlgo>): Account<toAlgo>;
    static toAccount<toAlgo extends AccountKeyAlgorithm>(acct: string | Account<toAlgo> | null): Account<toAlgo> | null;
    static toAccount<toAlgo extends AccountKeyAlgorithm>(acct: string | Account<toAlgo> | undefined): Account<toAlgo> | undefined;
    static toAccount<X extends AccountKeyAlgorithm>(acct: string | Account<X> | undefined | null): Account<X> | undefined | null;
    static toPublicKeyString(): undefined;
    static toPublicKeyString(acct: Account<AccountKeyAlgorithm>): string;
    static toPublicKeyString(acct: null): null;
    static toPublicKeyString(acct: undefined): undefined;
    static toPublicKeyString(acct: undefined | Account<AccountKeyAlgorithm>): string | undefined;
    static toPublicKeyString(acct: string | Account<AccountKeyAlgorithm>): string;
    static toPublicKeyString(acct: string | Account<AccountKeyAlgorithm> | null): string | null;
    static toPublicKeyString(acct: string | Account<AccountKeyAlgorithm> | undefined): string | undefined;
    static toPublicKeyString(acct: string | Account<AccountKeyAlgorithm> | undefined | null): string | undefined | null;
    static comparePublicKeys(acct1: Account<AccountKeyAlgorithm> | string | undefined | null, acct2: Account<AccountKeyAlgorithm> | string | undefined | null): boolean;
    static isInstance: (obj: any, strict?: boolean) => obj is Account<AccountKeyAlgorithm>;
    static Set: import("./utils/helper").InstanceSetConstructor<Account<AccountKeyAlgorithm>, `0x00${string}` | `0x01${string}` | `0x03${string}` | `0x02${string}` | `0x04${string}` | `0x06${string}` | `0x07${string}`>;
    constructor(key: KeyPairTypes | ECDSASECP256K1PrivateKey | ECDSASECP256R1PrivateKey | ED25519PrivateKey | ECDSASECP256K1PublicKey | ECDSASECP256R1PublicKey | ED25519PublicKey | IdentifierKeyPair | IdentifierKey | PublicKeyString | Account<T>, requiredKeyType?: T);
    /**
     * Sign some data and generate a detached signature in SEC format
     */
    sign(data: ArrayBuffer, options?: signOptionsType): ReturnType<signFunctionType>;
    /**
     * Verify a detached signature against some data
     */
    verify(data: ArrayBuffer, signature: ArrayBuffer | BufferStorage | ECDSASECP256K1Signature | ECDSASECP256R1Signature | ED25519Signature, options?: signOptionsType): ReturnType<verifyFunctionType>;
    encrypt(data: ArrayBuffer): ReturnType<encryptFunctionType>;
    decrypt(data: ArrayBuffer): ReturnType<decryptFunctionType>;
    get supportsEncryption(): boolean;
    /**
     * Internal helper method to copy accounts
     */
    _getPrivateKey(): KeyPairTypes | null;
    /**
     * Internal helper method to copy accounts
     */
    _getPublicKey(): KeyPairTypes;
    comparePublicKey(acct: Account<AccountKeyAlgorithm> | string | undefined | null): boolean;
    /**
     * Get token relative to account blockOrder and operationIndex
     */
    generateIdentifier<Type extends IdentifierKeyAlgorithm>(type: Type, blockHash: BlockHash | string | undefined, operationIndex: number): Account<Type>;
    /**
     * Get the encoded public key string
     */
    get publicKeyString(): PublicKeyString<T>;
    /**
     * Get the type of key for this account (SECP256K1 / R1 or ED25519)
     */
    get keyType(): T;
    /**
     * Get the public key for this account
     */
    get publicKey(): ECDSASECP256K1PublicKey | ECDSASECP256R1PublicKey | ED25519PublicKey;
    get publicKeyAndType(): Buffer;
    get publicKeyAndTypeString(): PublicKeyAndTypeStringHex<T>;
    /**
     * Determine if this account has a private key associated with it
     */
    get hasPrivateKey(): boolean;
    /**
     * Determine the size of signatures (in bytes) or null if the key
     * type cannot produce signatures
     */
    get signatureSize(): number | null;
    /**
     * Determine if a key type is an identifier key type
     */
    static isIdentifierKeyType(keyType: any): keyType is IdentifierKeyAlgorithm;
    /**
     * Determine if an account is an identifier
     */
    isIdentifier(): this is IdentifierAddress;
    isAccount(): this is Account;
    isKeyType<CheckType extends AccountKeyAlgorithm>(checkKeyType: CheckType): this is Account<CheckType>;
    isStorage(): this is Account<AccountKeyAlgorithm.STORAGE>;
    isNetwork(): this is Account<AccountKeyAlgorithm.NETWORK>;
    isToken(): this is Account<AccountKeyAlgorithm.TOKEN>;
    isMultisig(): this is Account<AccountKeyAlgorithm.MULTISIG>;
    assertKeyType<KeyType extends AccountKeyAlgorithm>(keyType: KeyType): Account<KeyType>;
    assertAccount(): Account;
    assertIdentifier(): IdentifierAddress;
    toJSON(): PublicKeyStringMapping[T];
}
export type TokenAddress = Account<AccountKeyAlgorithm.TOKEN>;
export type StorageAddress = Account<AccountKeyAlgorithm.STORAGE>;
export type NetworkAddress = Account<AccountKeyAlgorithm.NETWORK>;
export type MultisigAddress = Account<AccountKeyAlgorithm.MULTISIG>;
export type IdentifierAddress = Account<IdentifierKeyAlgorithm>;
export type NonIdentifierAccount = Account<Exclude<AccountKeyAlgorithm, IdentifierKeyAlgorithm>>;
export type GenericAccount = Account<AccountKeyAlgorithm>;
export default Account;
