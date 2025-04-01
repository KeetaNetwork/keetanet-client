import type { JSONSerializable } from './conversion';
export type DistributiveOmit<T, P extends PropertyKey> = T extends T ? Omit<T, P> : never;
export declare function bufferToArrayBuffer(input: Buffer): ArrayBuffer;
/**
 * Check if a value is an integer or a bigint.
 */
export declare function isIntegerOrBigInt(value: unknown): boolean;
/**
 * Check if a value is a Buffer. This exists due to an inconsistency with the
 * way `Buffer.isBuffer` is defined in `@types/node` and differs from similar
 * functionality such as `Array.isArray`. This leads `Buffer.isBuffer` to
 * result in an unbound method reference error despite being a static call.
 * Eslint Rule: eslint@typescript-eslint/unbound-method
 */
export declare function isBuffer(value: unknown): value is Buffer;
export declare function arrayRepeat<T>(value: T, length: number): T[];
/**
 * Waits a specific number of ticks and then resolves
 */
export declare function waitTicks(ticks: number): Promise<void>;
/**
 * Returns env variable, or default
 * Throws if neither are defined
 */
export declare function env(name: string, defaultValue?: string): string;
/**
 * Generate a random string from length provided (default 32)
 */
export declare function randomString(requestedLength?: number): string;
export declare function randomInt(min: number, max: number): number;
export declare function asleep(time_ms: number): Promise<void>;
export declare function promiseGenerator<T>(): {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (error: any) => void;
};
export declare function internalLogger(nodeAlias: string | undefined, level: string, from: string, ...message: any[]): void;
export declare function objectToBuffer(input: any): Buffer;
export declare function debugPrintableObject(input: any): JSONSerializable;
interface Constructor<T> {
    new (...args: any[]): T;
}
interface IsInstance<T> {
    check(obj: any, strict?: boolean): obj is T;
}
export declare function checkableGenerator<P extends Constructor<T>, T = InstanceType<P>>(parent: P, defaultStrict?: boolean): IsInstance<T>['check'];
export type DeepMutable<T> = {
    -readonly [P in keyof T]: DeepMutable<T[P]>;
};
interface WithIsInstance<Inst> extends Constructor<Inst> {
    isInstance(arg: any): arg is Inst;
}
type EncodeFunc<Inst, Enc> = (a: Inst) => Enc;
type DecodeFunc<Inst, Enc> = (a: Enc) => Inst;
type CanBeArray<T> = T | T[];
export interface InstanceSet<Instance, Encoded = string> extends Set<Encoded> {
    add(data: CanBeArray<Instance | Encoded>): this;
    delete(data: Instance | Encoded): boolean;
    has(data: Instance | Encoded): boolean;
    decodedArray: Instance[];
    encodedArray: Encoded[];
}
export interface InstanceSetConstructor<Instance, Encoded> {
    new (data?: (Instance | Encoded)[]): InstanceSet<Instance, Encoded>;
}
export declare function setGenerator<P extends WithIsInstance<Instance>, E extends EncodeFunc<Instance, Encoded>, D extends DecodeFunc<Instance, Encoded>, Instance = InstanceType<P>, Encoded = ReturnType<E>>(parent: P, rawEncode: E, rawDecode: D): InstanceSetConstructor<Instance, Encoded>;
export {};
