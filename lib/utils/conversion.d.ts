export type JSONSerializable = string | number | boolean | null | JSONSerializable[] | {
    [key: string]: JSONSerializable;
};
export type JSONSerializableObject = {
    [key: string]: JSONSerializable;
};
export interface ToJSONSerializableOptions<AddBinary extends boolean = boolean> {
    debugUnsafe?: boolean;
    addBinary?: AddBinary;
}
type AddBinaryIfIncluded<I> = I extends {
    '$binary'?: infer BinaryType;
} ? Omit<I, '$binary'> & {
    '$binary': NonNullable<BinaryType>;
} : I;
type IsTuple<T> = T extends readonly any[] ? number extends T['length'] ? false : true : false;
type JSONDepthLimit = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export type ToJSONSerializable<T, Options extends ToJSONSerializableOptions = ToJSONSerializableOptions, Depth extends number = 10> = T extends never ? never : Depth extends never ? never : symbol extends keyof T ? {
    [key: symbol]: never;
} : T extends JSONSerializable ? T : T extends undefined ? never : T extends bigint ? string : T extends Date ? string : T extends Buffer | ArrayBuffer ? string : T extends {
    toJSON(): infer U;
} ? Options['addBinary'] extends true ? ToJSONSerializable<AddBinaryIfIncluded<U>, Options, JSONDepthLimit[Depth]> : ToJSONSerializable<U, Options, JSONDepthLimit[Depth]> : IsTuple<T> extends true ? {
    [K in keyof T]: undefined extends T[K] ? ToJSONSerializable<Exclude<T[K], undefined>, Options, JSONDepthLimit[Depth]> | null : ToJSONSerializable<T[K], Options, JSONDepthLimit[Depth]>;
} : T extends readonly (infer U)[] ? Array<undefined extends U ? ToJSONSerializable<Exclude<U, undefined>, Options, JSONDepthLimit[Depth]> | null : ToJSONSerializable<U, Options, JSONDepthLimit[Depth]>> : T extends object ? (string extends keyof T ? {
    [K in keyof T]: ToJSONSerializable<T[K], Options, JSONDepthLimit[Depth]>;
} : number extends keyof T ? {
    [K in keyof T]: ToJSONSerializable<T[K], Options, JSONDepthLimit[Depth]>;
} : // number index signature type
{
    [K in keyof T as ({} extends Pick<T, K> ? never : undefined extends T[K] ? never : K)]: ToJSONSerializable<T[K], Options, JSONDepthLimit[Depth]>;
} & {
    [K in keyof T as ({} extends Pick<T, K> ? K : undefined extends T[K] ? K : never)]?: ToJSONSerializable<Exclude<T[K], undefined>, Options, JSONDepthLimit[Depth]>;
}) : never;
export declare function toJSONSerializable<Value = never, Options extends ToJSONSerializableOptions = ToJSONSerializableOptions>(data: Value, opts?: Options): ToJSONSerializable<Value, Options>;
export declare function objectToBuffer(data: any, opts?: ToJSONSerializableOptions): Buffer;
export declare function parseHexBigIntString(input: string): bigint;
export {};
