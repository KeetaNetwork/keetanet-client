import type { Vote, VoteStaple } from '../vote';
import type Account from '../account';
import type { Block, BlockHash } from '../block';
import type { Permissions } from '../permissions';
export type JSONSerializable = string | number | boolean | null | JSONSerializable[] | {
    [key: string]: JSONSerializable;
};
export type JSONSerializableObject = {
    [key: string]: JSONSerializable;
};
type JSONUnsupportedTypes = Date | BlockHash | Account | bigint | Permissions | Vote | Block | VoteStaple;
type JSONSupportedObject<T> = {
    [Property in keyof T]: Exclude<T[Property], JSONUnsupportedTypes>;
};
type JSONSupportedValue<T> = JSONSupportedObject<T>[any];
export type JSONSupported<T> = JSONSupportedObject<T> | JSONSupportedValue<T>;
export type ToJSONSerializableOptions = {
    debugUnsafe?: boolean;
    addBinary?: boolean;
};
export type ToJSONSerializable<T> = T extends bigint ? string : T extends Date ? string : T extends Buffer ? string : T extends {
    toJSONSerializable(): infer U;
} ? U : T extends {
    toJSON(): infer U;
} ? ToJSONSerializable<U> : T extends Account<infer K extends typeof Account.AccountKeyAlgorithm[keyof typeof Account.AccountKeyAlgorithm]> ? ReturnType<Account<K>['publicKeyString']['get']> : T extends BlockHash ? string : T extends Permissions ? [string, string] : T extends Vote ? ReturnType<Vote['toJSON']> & {
    '$binary': string;
} : T extends VoteStaple ? ReturnType<VoteStaple['toJSON']> & {
    '$binary': string;
} : T extends Block ? ReturnType<Block['toJSON']> & {
    '$binary': string;
} : T extends JSONSerializable ? T : T extends object ? {
    [K in keyof T]: ToJSONSerializable<T[K]>;
} : never;
export declare function toJSONSerializable(data: JSONSupported<any>, opts?: ToJSONSerializableOptions): JSONSupported<any> & JSONSerializable;
/** @deprecated -- move to toJSON methods */
interface WithConversionClass<T, Y> {
    toJSONSerializablePrefix: string;
    toJSONSerializable(value: T, options: ToJSONSerializableOptions): Y;
    isInstance(value: any): value is T;
    new (...args: any[]): T;
}
/** @deprecated -- move to toJSON methods */
export declare function RegisterSerializable(name: string): <X, Y>(target: WithConversionClass<X, Y>) => void;
export declare function objectToBuffer(data: JSONSupported<any>, opts?: ToJSONSerializableOptions): Buffer;
export declare function parseHexBigIntString(input: string): bigint;
export {};
