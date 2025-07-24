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
export type ToJSONSerializable<T, Options extends ToJSONSerializableOptions = ToJSONSerializableOptions> = T extends JSONSerializable ? T : T extends undefined ? undefined : T extends bigint ? string : T extends Date ? string : T extends Buffer | ArrayBuffer ? string : T extends {
    toJSON(): infer U;
} ? Options['addBinary'] extends true ? ToJSONSerializable<AddBinaryIfIncluded<U>, Options> : ToJSONSerializable<U, Options> : T extends object ? {
    [K in keyof T]: ToJSONSerializable<T[K], Options>;
} : never;
export declare function toJSONSerializable<Value, Options extends ToJSONSerializableOptions>(data: Value, opts?: Options): ToJSONSerializable<Value, Options>;
export declare function objectToBuffer(data: any, opts?: ToJSONSerializableOptions): Buffer;
export declare function parseHexBigIntString(input: string): bigint;
export {};
