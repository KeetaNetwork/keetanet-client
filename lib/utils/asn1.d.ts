import * as asn1js from 'asn1js';
export declare const asn1: typeof asn1js;
declare function jsBigIntToBuffer(value: bigint): Buffer;
declare function jsIntegerToBigInt(value: asn1js.Integer | number): bigint;
export type ASN1AnyJS = ASN1AnyJS[] | bigint | number | Date | Buffer | ASN1OID | ASN1Set | ASN1ContextTag | ASN1BitString | ASN1Date | ASN1String | string | boolean | null | undefined;
type ASN1AnyASN = InstanceType<typeof asn1js.Sequence> | InstanceType<typeof asn1js.Set> | InstanceType<typeof asn1js.Integer> | InstanceType<typeof asn1js.GeneralizedTime> | InstanceType<typeof asn1js.Null> | InstanceType<typeof asn1js.OctetString> | InstanceType<typeof asn1js.BitString> | InstanceType<typeof asn1js.ObjectIdentifier> | InstanceType<typeof asn1js.Constructed> | InstanceType<typeof asn1js.Boolean> | InstanceType<typeof asn1js.PrintableString> | InstanceType<typeof asn1js.IA5String> | InstanceType<typeof asn1js.Utf8String> | undefined;
interface ASN1Object {
    type: string;
}
export interface ASN1OID extends ASN1Object {
    type: 'oid';
    oid: string;
}
export interface ASN1Set extends ASN1Object {
    type: 'set';
    name: ASN1OID;
    value: string | ASN1String;
}
interface ASN1ExplicitContextTag extends ASN1Object {
    type: 'context';
    kind: 'explicit';
    value: number;
    contains: ASN1AnyJS;
}
interface ASN1ImplicitContextTag extends ASN1Object {
    type: 'context';
    kind: 'implicit';
    value: number;
    contains: ArrayBuffer | ASN1AnyJS;
}
export type ASN1ContextTag = ASN1ExplicitContextTag | ASN1ImplicitContextTag;
export interface ASN1BitString extends ASN1Object {
    type: 'bitstring';
    value: Buffer;
    unusedBits?: number;
}
export interface ASN1Date extends ASN1Object {
    type: 'date';
    kind?: 'utc' | 'general' | 'default';
    date: Date;
}
export interface ASN1String extends ASN1Object {
    type: 'string';
    kind: 'printable' | 'ia5' | 'utf8';
    value: string;
}
export declare function isASN1Object(input: unknown): input is ASN1Object;
declare function isASN1OID(input: unknown): input is ASN1OID;
declare function isASN1String(input: unknown): input is ASN1String;
declare function isASN1Set(input: unknown): input is ASN1Set;
declare function isASN1ContextTag<T extends ASN1ContextTag['kind']>(input: unknown, tagKind?: T): input is Extract<ASN1ContextTag, {
    kind: T;
}>;
declare function isASN1BitString(input: unknown): input is ASN1BitString;
declare function isASN1Date(input: unknown): input is ASN1Date;
export declare const ASN1CheckUtilities: {
    isASN1Object: typeof isASN1Object;
    isASN1OID: typeof isASN1OID;
    isASN1String: typeof isASN1String;
    isASN1Set: typeof isASN1Set;
    isASN1ContextTag: typeof isASN1ContextTag;
    isASN1BitString: typeof isASN1BitString;
    isASN1Date: typeof isASN1Date;
};
/**
 * Validation function for {@link isValidSequenceSchema}
 */
export type ASN1SequenceValidation = ((arg: unknown) => boolean)[];
/**
 * Checks if an ASN.1 sequence is valid based on a provided validation schema.
 */
export declare function isValidSequenceSchema(input: unknown[], schema: ASN1SequenceValidation): boolean;
declare function jsJStoASN1(input: Readonly<ASN1AnyJS>): Exclude<ASN1AnyASN, undefined>;
declare function jsJStoASN1(input: Readonly<ASN1AnyJS>, allowUndefined: true): ASN1AnyASN;
declare function jsASN1toJS(input: ArrayBuffer): ASN1AnyJS;
declare const ASN1toJS: typeof jsASN1toJS, JStoASN1: typeof jsJStoASN1, ASN1IntegerToBigInt: typeof jsIntegerToBigInt, ASN1BigIntToBuffer: typeof jsBigIntToBuffer;
export declare namespace ValidateASN1 {
    export type Schema = keyof BasicSchemaMap | {
        choice: Schema[] | readonly Schema[];
    } | {
        sequenceOf: Schema;
    } | {
        optional: Schema;
    } | bigint | {
        type: 'context';
        kind: 'implicit' | 'explicit';
        contains: Schema;
        value: number;
    } | {
        type: 'oid';
        oid: string;
    } | {
        type: 'string';
        kind: 'printable';
    } | {
        type: 'string';
        kind: 'ia5';
    } | {
        type: 'string';
        kind: 'utf8';
    } | {
        type: 'date';
        kind: 'utc';
    } | {
        type: 'date';
        kind: 'general';
    } | readonly [Schema, ...Schema[]] | (() => Schema);
    type BasicSchemaMap = {
        [ValidateASN1.IsAny]: ASN1AnyJS;
        [ValidateASN1.IsUnknown]: unknown;
        [ValidateASN1.IsDate]: Date;
        [ValidateASN1.IsAnyDate]: ASN1Date;
        [ValidateASN1.IsString]: string;
        [ValidateASN1.IsAnyString]: ASN1String;
        [ValidateASN1.IsOctetString]: Buffer;
        [ValidateASN1.IsBitString]: ASN1BitString;
        [ValidateASN1.IsInteger]: bigint;
        [ValidateASN1.IsBoolean]: boolean;
        [ValidateASN1.IsOID]: ASN1OID;
        [ValidateASN1.IsSet]: ASN1Set;
        [ValidateASN1.IsNull]: null;
    };
    export type SchemaMap<T extends Schema> = T extends () => infer U ? U extends Schema ? SchemaMap<U> : never : T extends keyof BasicSchemaMap ? BasicSchemaMap[T] : T extends {
        choice: Schema[];
    } ? SchemaMap<T['choice'][number]> : T extends {
        choice: readonly Schema[];
    } ? SchemaMap<T['choice'][number]> : T extends {
        sequenceOf: Schema;
    } ? SchemaMap<T['sequenceOf']>[] : T extends {
        optional: Schema;
    } ? SchemaMap<T['optional']> | undefined : T extends bigint ? T : T extends {
        type: 'context';
        kind: infer U extends ASN1ContextTag['kind'];
        value: number;
        contains: Schema;
    } ? Omit<ASN1ContextTag, 'contains' | 'value' | 'kind'> & {
        contains: SchemaMap<T['contains']>;
        value: T['value'];
        kind: U;
    } : T extends {
        type: 'oid';
        oid: string;
    } ? Omit<ASN1OID, 'oid'> & {
        oid: T['oid'];
    } : T extends {
        type: 'string';
        kind: 'printable' | 'ia5' | 'utf8';
    } ? Omit<ASN1String, 'kind'> & {
        kind: T['kind'];
    } : T extends {
        type: 'date';
        kind: 'general' | 'utc';
    } ? Omit<ASN1Date, 'kind'> & {
        kind: T['kind'];
    } : T extends readonly [Schema, ...Schema[]] ? {
        [K in keyof T]: T[K] extends Schema ? SchemaMap<T[K]> : never;
    } : never;
    export {};
}
export declare class ValidateASN1<T extends ValidateASN1.Schema> {
    #private;
    static readonly IsAny: unique symbol;
    static readonly IsUnknown: unique symbol;
    static readonly IsDate: unique symbol;
    static readonly IsAnyDate: unique symbol;
    static readonly IsString: unique symbol;
    static readonly IsAnyString: unique symbol;
    static readonly IsOctetString: unique symbol;
    static readonly IsBitString: unique symbol;
    static readonly IsInteger: unique symbol;
    static readonly IsBoolean: unique symbol;
    static readonly IsOID: unique symbol;
    static readonly IsSet: unique symbol;
    static readonly IsNull: unique symbol;
    /**
     * Interpret an untagged type as a specific universal tag
     */
    private static interpretASN1Tag;
    /**
     * Given a schema, validate the ASN.1 object against it and return the
     * object as the validated type
     */
    static againstSchema<T extends ValidateASN1.Schema>(input: ASN1AnyJS, schemaIn: T): ValidateASN1.SchemaMap<T>;
    constructor(schema: T);
    validate(input: ASN1AnyJS): ValidateASN1.SchemaMap<T>;
}
/**
 * Create a Mutable type from a given Readonly type
 *
 * Does not handle all possible objects, but those used
 * within the ASN1 encoder/decoder
 */
type Mutable<T> = T extends Buffer | ArrayBuffer | Date ? T : T extends object ? {
    -readonly [K in keyof T]: Mutable<T[K]>;
} : T;
/**
 * An ASN.1 object which contains the DER encoded value as well as the
 * unencoded value
 */
export declare class BufferStorageASN1<T extends ASN1AnyJS | Readonly<ASN1AnyJS> = Readonly<ASN1AnyJS>, S extends ValidateASN1.Schema | undefined = undefined> {
    #private;
    static readonly Validate: typeof ValidateASN1;
    static readonly isInstance: (obj: any, strict?: boolean) => obj is BufferStorageASN1<string | number | bigint | boolean | Date | Buffer | ASN1AnyJS[] | ASN1OID | ASN1Set | ASN1ExplicitContextTag | ASN1ImplicitContextTag | ASN1BitString | ASN1Date | ASN1String | readonly ASN1AnyJS[] | Readonly<Date> | Readonly<Buffer> | Readonly<ASN1OID> | Readonly<ASN1Set> | Readonly<ASN1ExplicitContextTag> | Readonly<ASN1ImplicitContextTag> | Readonly<ASN1BitString> | Readonly<ASN1Date> | Readonly<ASN1String> | null | undefined, ValidateASN1.Schema | undefined>;
    constructor(input: T | ArrayBuffer, schema?: S);
    getDER(): ArrayBuffer;
    getDERBuffer(): Buffer;
    getASN1(): S extends undefined ? Mutable<T> : Mutable<ValidateASN1.SchemaMap<Exclude<S, undefined>>>;
}
export { ASN1toJS, JStoASN1, ASN1IntegerToBigInt, ASN1BigIntToBuffer };
