import { Buffer } from 'buffer';
import zlib from 'zlib';
/**
 * RFC 4648 Base32 Decoder
 */
export declare function DecodeBase32(data: string, length: number): ArrayBuffer;
/**
 * RFC 4648 Base32 Encoder
 */
export declare function EncodeBase32(data: ArrayBuffer): string;
export declare function DecodeBase64(data: string): ArrayBuffer;
export declare function EncodeBase64(data: ArrayBuffer): string;
export declare function ZlibInflate(data: ArrayBuffer, options?: zlib.ZlibOptions): ArrayBuffer;
export declare function ZlibDeflate(data: ArrayBuffer, options?: zlib.ZlibOptions): ArrayBuffer;
export declare function ZlibInflateAsync(data: ArrayBuffer, options?: zlib.ZlibOptions): Promise<ArrayBuffer>;
export declare function ZlibDeflateAsync(data: ArrayBuffer, options?: zlib.ZlibOptions): Promise<ArrayBuffer>;
export declare class BufferStorage {
    #private;
    readonly storageKind: string;
    static isInstance: (obj: any, strict?: boolean) => obj is BufferStorage;
    constructor(key: bigint | ArrayBuffer | string, length: number);
    get(): ArrayBuffer;
    get length(): number;
    getBuffer(): Buffer;
    toString(encoding?: 'hex' | 'base32' | 'base64'): string;
    toBigInt(): bigint;
    compare(compareWith: typeof this | undefined | null): boolean;
    compareHexString(compareWith: BufferStorage | string | undefined | null): boolean;
}
export { Buffer };
