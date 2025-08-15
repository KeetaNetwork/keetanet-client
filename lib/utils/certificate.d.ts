import * as ASN1 from './asn1';
import Account, { AccountKeyAlgorithm } from '../account';
import * as HashLib from './hash';
import { BufferStorage } from './buffer';
import type { ToJSONSerializableOptions, ToJSONSerializable } from './conversion';
/**
 * De-normalized mapped Certificate Schema, for use in type annotations since
 * we do not want to expose such a complex type
 */
type CertificateSchema = [
    tbsCertificate: [
        version: {
            type: 'context';
            value: 0;
            kind: 'explicit';
            contains: bigint;
        },
        serialNumber: bigint,
        signatureAlgorithm: ASN1.ASN1OID[],
        issuer: ASN1.ASN1Set[],
        validityPeriod: [
            notBefore: ASN1.ASN1Date,
            notAfter: ASN1.ASN1Date
        ],
        subject: ASN1.ASN1Set[],
        subjectPublicKey: [
            algorithm: ASN1.ASN1OID[],
            publicKey: ASN1.ASN1BitString
        ],
        extensions: {
            type: 'context';
            value: 3;
            kind: 'explicit';
            contains: ([
                id: ASN1.ASN1OID,
                critical: boolean,
                value: Buffer
            ] | [
                id: ASN1.ASN1OID,
                value: Buffer
            ])[];
        } | undefined
    ],
    signatureAlgorithm: ASN1.ASN1OID[],
    signature: ASN1.ASN1BitString
];
type HashNames = 'sha256' | 'sha3-256';
type CertificateBuilderParams = {
    /**
     * Subject for the certificate, to store as the public key within the certificate
     */
    subjectPublicKey: Account;
    /**
     * Subject Distinguished Name (DN) for the certificate
     */
    subjectDN?: {
        name: string;
        value: string;
    }[];
    /**
     * Issuer for the certificate, to sign the certificate with
     */
    issuer: Account;
    /**
     * Issuer Distinguished Name (DN) for the certificate
     */
    issuerDN?: {
        name: string;
        value: string;
    }[];
    /**
     * Validity period of the certificate to begin on
     */
    validFrom: Date;
    /**
     * Validity period of the certificate to end (expire) on
     */
    validTo: Date;
    /**
     * Serial number for the certificate
     */
    serial: bigint | number;
    /**
     * Is a certificate authority ?
     *
     * Default is true if the Subject === Issuer and false otherwise
     */
    isCA?: boolean;
    /**
     * Include common/default certificate extensions ?
     *
     * Default is true
     */
    includeCommonExts?: boolean;
    /**
     * Hashing library to use
     *
     * Because several different things are hashed this is
     * @deprecated Use `hashParams` instead
     */
    hashLib?: {
        hash: (...args: Parameters<typeof HashLib.Hash>) => ReturnType<typeof HashLib.Hash>;
        name: string;
    };
    /**
     * This option lets you control the hashing method used for the
     * certificate signature as well as provide alternative implementations
     */
    hashParams: {
        functions?: {
            [name in HashNames]?: (...args: Parameters<typeof HashLib.Hash>) => ReturnType<typeof HashLib.Hash>;
        };
        defaults?: {
            /**
             * Default hashing function to use for the certificate signature
             */
            signature?: HashNames;
            /**
             * Default hashing function to use for the Subject Key Identifier
             */
            ski?: HashNames;
            /**
             * Default hashing function to use for the Authority Key Identifier
             * (must match the issuer certificate's Subject Key Identifier
             * hashing function)
             */
            aki?: HashNames;
        };
    };
};
export declare class CertificateBuilder {
    #private;
    constructor(params?: Partial<CertificateBuilderParams>);
    private static hashName;
    private static hash;
    /**
     * Construct an extension
     */
    protected static extension(oid: string, value: Parameters<typeof ASN1.JStoASN1>[0], critical?: boolean): [{
        type: "oid";
        oid: string;
    }, value: Buffer] | [{
        type: "oid";
        oid: string;
    }, critical: boolean, value: Buffer];
    /**
     * Convert a KeetaNet Account to a Key ID (for Subject Key Identifier)
     */
    private accountToKeyId;
    /**
     * Produce the extensions to include in this certificate
     */
    protected addExtensions(params: CertificateBuilderParams): Promise<([{
        type: "oid";
        oid: string;
    }, value: Buffer] | [{
        type: "oid";
        oid: string;
    }, critical: boolean, value: Buffer])[]>;
    /**
     * Compute the final params as required
     */
    private getFinalParams;
    /**
     * Create a certificate
     */
    buildDER(params?: Partial<CertificateBuilderParams>): Promise<ArrayBuffer>;
    build(params?: Partial<CertificateBuilderParams>, options?: ConstructorParameters<typeof Certificate>[1]): Promise<Certificate>;
}
type CertificateOptions = {
    /**
     * The moment at which the certificate is being validated, or null if the
     * moment is indeterminate and unknowable -- in which case the certificate
     * validity period is not checked
     */
    moment?: Date | null;
    /**
     * Certificate store to use for verifying the certificate
     */
    store?: {
        /**
         * Root certificates
         */
        root?: Set<Certificate>;
        /**
         * Intermediate certificates
         */
        intermediate?: Set<Certificate>;
    };
    /**
     * Indicate this certificate is a root certificate that we trust --
     * it will get a "chain" parameter even if no "store" is provided
     * or if it is not in the store.  This is because otherwise we would
     * need to load trusted certificates twice, once for the store and
     * once for the chain.
     */
    isTrustedRoot?: boolean;
};
type CertificateHashString = string & {
    readonly __certificateHash: never;
};
/**
 * Certificate hash
 */
export declare class CertificateHash extends BufferStorage {
    static isInstance: (obj: any, strict?: boolean) => obj is CertificateHash;
    static Set: import("./helper").InstanceSetConstructor<CertificateHash, CertificateHashString>;
    get hashFunctionName(): string;
    constructor(certificateHash: ConstructorParameters<typeof BufferStorage>[0]);
    static fromData(data: Buffer): CertificateHash;
    toJSON(): CertificateHashString;
    toString(): CertificateHashString;
}
export declare class CertificateBundle {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is CertificateBundle;
    constructor(input: CertificateBundle | Certificate[] | ArrayBuffer | Buffer | string | (ConstructorParameters<typeof Certificate>[0])[] | Set<Certificate>);
    get bundleSize(): number;
    getDER(): ArrayBuffer;
    getDERBuffer(): Buffer;
    getCertificates(): Certificate[];
    toJSON(): {
        certificates: string[];
    };
}
export type CertificateJSONOutput = ToJSONSerializable<ReturnType<Certificate['toJSON']>>;
export declare class Certificate {
    #private;
    /**
     * The Certificate Builder
     */
    static readonly Builder: typeof CertificateBuilder;
    /**
     * The certificate bundle
     */
    static readonly Bundle: typeof CertificateBundle;
    /**
     * The certificate hash information
     */
    static readonly Hash: typeof CertificateHash;
    /**
     * The serial number of the certificate
     */
    readonly serial: bigint;
    /**
     * The timestamp at which the certificate becomes valid
     */
    readonly notBefore: Date;
    /**
     * The timestamp at which the certificate expires
     */
    readonly notAfter: Date;
    /**
     * The Subject DN of the certificate as a string --- for informational purposes only
     */
    readonly subject: string;
    /**
     * The Subject DN of the certificate --- for informational purposes only
     */
    readonly subjectDN: ({
        name: string;
        value: string;
    })[];
    /**
     * The Issuer DN of the certificate as a string --- for informational purposes only
     */
    readonly issuer: string;
    /**
     * The Issuer DN of the certificate --- for informational purposes only
     */
    readonly issuerDN: ({
        name: string;
        value: string;
    })[];
    /**
     * The Subject of the certificate as a KeetaNet Account, derived from the
     * public key in the certificate
     */
    readonly subjectPublicKey: Account;
    /**
     * The moment at which the certificate was validated
     */
    readonly moment: Date | null;
    /**
     * Chain, if a store is provided
     */
    readonly chain?: Certificate[];
    /**
     * Basic Extensions
     */
    readonly baseExtensions?: {
        /**
         * Basic Constraints
         */
        basicConstraints?: [
            ca: boolean,
            pathLenConstraint?: bigint
        ];
        /**
         * Subject Key Identifier
         */
        subjectKeyIdentifier?: Buffer;
        /**
         * Authority Key Identifier
         */
        authorityKeyIdentifier?: {
            type: 'context';
            value: 0;
            contains: Buffer;
        };
    };
    /**
     * The complete SubjectDN
     */
    protected subjectDNSet: CertificateSchema[0][5];
    /**
     * The complete IssuerDN
     */
    protected issuerDNSet: CertificateSchema[0][3];
    /**
     * Object type ID for {@link Certificate.isCertificate}
     */
    private static certificateObjectTypeID;
    /**
     * Is a certificate object?
     */
    static isCertificate(value: unknown): value is Certificate;
    constructor(input: Certificate | ArrayBuffer | Buffer | string, options?: CertificateOptions);
    /**
     * Finalize construction of the certificate -- if this method is
     * replaced in a subclass, remember to call it at the end of the
     * subclass constructor or the certificate will not be fully
     * constructed
     */
    protected finalizeConstruction(): void;
    /**
     * Process remaining extensions
     */
    protected processExtensions(): void;
    /**
     * Process an extension -- returns true if the extension was processed
     *
     * This is intended to be overridden by subclasses for processing
     * custom extensions
     */
    protected processExtension(id: string, value: ArrayBuffer): boolean;
    /**
     * Verifies that a certificate is self-signed
     */
    isSelfSigned(): boolean;
    /**
     * Verifies that the certificate is was signed by the given account or certificate
     */
    verify(account: Account | Certificate): boolean;
    /**
     * Asserts provided certificates can construct a valid graph with no loops or orphans, and that all provided certificates can reach the root, or current certificate
     * @param certificates Additional intermediate certificates to verify
     */
    assertCanConstructValidGraph(certificates: Set<Certificate>): true | undefined;
    /**
     * Verify against a given certificate store
     */
    verifyChain(store: NonNullable<CertificateOptions['store']>, _ignore_seenCerts?: Set<Certificate>): Certificate[] | null;
    /**
     * Check if the certificate is valid at a given moment
     */
    checkValid(moment?: Date | null): boolean;
    checkValid(moment?: Date | null, reason?: false): boolean;
    checkValid(moment?: Date | null, reason?: true): {
        valid: true;
    } | {
        valid: false;
        reason: string;
    };
    /**
     * Assert that the certificate is valid at a given moment
     */
    assertValid(moment?: Date | null): void;
    /**
     * Check if the certificate is issued by a given issuer
     */
    checkIssued(issuer: Certificate): boolean;
    checkIssued(issuer: Certificate, reason: true): {
        issued: true;
    } | {
        issued: false;
        reason: string;
    };
    /**
     * Get the issuer certificate (if known)
     */
    getIssuerCertificate(): Certificate | null;
    /**
     * Get the root certificate (if known)
     */
    getRootCertificate(): Certificate | null;
    /**
     * Get the issuer account
     */
    getIssuerAccount(): Account | null;
    /**
     * Get the extensions present in the certificate -- this is the raw
     * extensions as they were parsed from the certificate, and may
     * contain extensions that are not processed by this class.
     */
    getExtensions(): NonNullable<CertificateSchema[0][7]>['contains'] | undefined;
    private assertConstructed;
    /**
     * Compare the certificate with another certificate and return true if they
     * are the same
     */
    equals(other: Certificate): boolean;
    /**
     * If this certificate can be trusted to have been validated to a trusted Root CA
     */
    get trusted(): boolean;
    /**
     * Get the certificate as a DER encoded ArrayBuffer
     */
    toDER(): ArrayBuffer;
    /**
     * Get the certificate as a PEM encoded string
     */
    toPEM(): string;
    /**
     * The string representation of the certificate
     * is a PEM encoded certificate -- this misses
     * some of the internal details like chain
     * and verified, but is usually what someone
     * wants to see when they call toString()
     */
    toString(): string;
    /**
     * Compute a hash of the certificate
     */
    hash(): CertificateHash;
    /**
     * Get a JSON representation of the certificate
     */
    toJSON(options?: ToJSONSerializableOptions, includeChain?: boolean): {
        $binary?: string;
        $chain?: unknown;
        serial: bigint;
        notBefore: Date;
        notAfter: Date;
        subject: string;
        issuer: string;
        subjectPublicKey: Account<AccountKeyAlgorithm.ECDSA_SECP256K1 | AccountKeyAlgorithm.ED25519 | AccountKeyAlgorithm.ECDSA_SECP256R1>;
        baseExtensions: {
            /**
             * Basic Constraints
             */
            basicConstraints?: [ca: boolean, pathLenConstraint?: bigint];
            /**
             * Subject Key Identifier
             */
            subjectKeyIdentifier?: Buffer;
            /**
             * Authority Key Identifier
             */
            authorityKeyIdentifier?: {
                type: "context";
                value: 0;
                contains: Buffer;
            };
        } | undefined;
        subjectDN: {
            name: string;
            value: string;
        }[];
        issuerDN: {
            name: string;
            value: string;
        }[];
        $hash: CertificateHash;
    };
}
export {};
