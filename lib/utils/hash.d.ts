/**
 * Hashing function name to use with key derivation and public key checksums
 */
export declare const HashFunctionName = "sha3-256";
/**
 * Length of the hash function
 */
export declare const HashFunctionLength = 32;
/**
 * Hash some data
 */
export declare function Hash(data: Buffer, len?: number): ArrayBuffer;
export declare namespace Hash {
    var functionName: string;
    var functionLength: number;
}
