import _crypto from 'crypto';
import type { JSONSerializable } from './conversion';
export type DistributiveOmit<T, P extends PropertyKey> = T extends T ? Omit<T, P> : never;
export declare function bufferToArrayBuffer(input: Buffer): ArrayBuffer;
export declare function bufferToBigInt(buffer: Buffer): bigint;
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
export declare function booleanEnv(name: string, defaultValue?: boolean): boolean;
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
export declare function nonNullable<T>(value: T): NonNullable<T>;
export type DeepMutable<T> = {
    -readonly [P in keyof T]: DeepMutable<T[P]>;
};
interface WithIsInstance<Inst> extends Constructor<Inst> {
    isInstance(arg: any): arg is Inst;
}
type EncodeFunc<Inst, Enc> = (a: Inst) => Enc;
type DecodeFunc<Inst, Enc> = (a: Enc) => Inst;
type CanBeArray<T> = T | T[];
interface InstanceSet<Instance, Encoded = string> extends Set<Instance> {
    add(data: CanBeArray<Instance>): this;
    forEach(callbackfn: (value: Instance, value2: Instance, set: InstanceSet<Instance, Encoded>) => void, thisArg?: any): void;
    hasInternal(data: Encoded): boolean;
    addInternal(data: Encoded): this;
    deleteInternal(data: Encoded): boolean;
    valuesInternal(): IterableIterator<Encoded>;
    toArray(): Instance[];
    toArrayInternal(): Encoded[];
    isSubsetOf(data: InstanceSet<Instance, Encoded>): boolean;
    isEqualTo(data: InstanceSet<Instance, Encoded>): boolean;
}
/**
 * AsyncDisposableStack https://github.com/tc39/proposal-explicit-resource-management
 */
export declare const AsyncDisposableStack: AsyncDisposableStackConstructor;
export interface InstanceSetConstructor<Instance, Encoded = string> {
    new (data?: Iterable<(Instance)>): InstanceSet<Instance, Encoded>;
}
export declare function setGenerator<P extends WithIsInstance<Instance>, E extends EncodeFunc<Instance, Encoded>, D extends DecodeFunc<Instance, Encoded>, Instance = InstanceType<P>, Encoded = ReturnType<E>>(parent: P, rawEncode: E, rawDecode: D): InstanceSetConstructor<Instance, Encoded>;
export declare const crypto: {
    randomUUID: typeof _crypto.randomUUID | (() => string);
    randomBytes: typeof _crypto.randomBytes;
    createCipheriv: typeof _crypto.createCipheriv;
    createDecipheriv: typeof _crypto.createDecipheriv;
};
export {};
