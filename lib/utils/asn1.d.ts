import * as asn1js from 'asn1js';
export declare const asn1: typeof asn1js;
declare function jsBigIntToBuffer(value: bigint): Buffer;
declare function jsIntegerToBigInt(value: asn1js.Integer | number): bigint;
export type ASN1AnyJS = ASN1AnyJS[] | bigint | number | Date | Buffer | ASN1OID | ASN1Set | ASN1ContextTag | ASN1BitString | ASN1Date | ASN1String | ASN1Struct | string | boolean | null | undefined;
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
export interface ASN1Struct extends ASN1Object {
    type: 'struct';
    /**
     * Field names are optional if they appear in the schema
     */
    fieldNames?: string[];
    contains: {
        [name: string]: ASN1AnyJS;
    };
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
declare function isASN1Struct(input: unknown): input is ASN1Struct;
export declare const ASN1CheckUtilities: {
    isASN1Object: typeof isASN1Object;
    isASN1OID: typeof isASN1OID;
    isASN1String: typeof isASN1String;
    isASN1Set: typeof isASN1Set;
    isASN1ContextTag: typeof isASN1ContextTag;
    isASN1BitString: typeof isASN1BitString;
    isASN1Date: typeof isASN1Date;
    isASN1Struct: typeof isASN1Struct;
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
        choice: {
            [name: string]: Schema;
        } | {
            readonly [name: string]: Schema;
        };
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
    } | {
        type: 'struct';
        fieldNames: string[] | readonly string[];
        contains: {
            [name: string]: Schema;
        } | {
            readonly [name: string]: Schema;
        };
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
        choice: infer C extends {
            [name: string]: Schema;
        } | {
            readonly [name: string]: Schema;
        };
    } ? {
        [K in keyof C]: C[K] extends Schema ? SchemaMap<C[K]> : never;
    }[keyof C] : T extends {
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
    } : T extends {
        type: 'struct';
        fieldNames: infer F extends readonly string[] | string[];
        contains: infer C extends {
            [name: string]: Schema;
        } | {
            readonly [name: string]: Schema;
        };
    } ? Omit<ASN1Struct, 'fieldNames' | 'contains'> & {
        fieldNames: F extends readonly string[] ? F : string[];
        contains: {
            [K in (F extends readonly (infer U)[] ? U : F extends (infer U)[] ? U : never) & string]: K extends keyof C ? (C[K] extends Schema ? SchemaMap<C[K]> : never) : never;
        };
    } : T extends readonly [Schema, ...Schema[]] ? {
        [K in keyof T]: T[K] extends Schema ? SchemaMap<T[K]> : never;
    } : never;
    type BasicSchemaMapJS = {
        [ValidateASN1.IsAny]: ASN1AnyJS;
        [ValidateASN1.IsUnknown]: unknown;
        [ValidateASN1.IsDate]: Date;
        [ValidateASN1.IsAnyDate]: {
            type: 'date';
            kind: 'utc' | 'general' | 'default';
            value: Date;
        };
        [ValidateASN1.IsString]: string;
        [ValidateASN1.IsAnyString]: {
            type: 'string';
            kind: 'printable' | 'ia5' | 'utf8';
            value: string;
        };
        [ValidateASN1.IsOctetString]: Buffer;
        [ValidateASN1.IsBitString]: {
            type: 'bitstring';
            value: Buffer;
            unusedBits: number;
        };
        [ValidateASN1.IsInteger]: bigint;
        [ValidateASN1.IsBoolean]: boolean;
        [ValidateASN1.IsOID]: string;
        [ValidateASN1.IsSet]: ASN1Set;
        [ValidateASN1.IsNull]: null;
    };
    /**
     * Maps a Schema to its plain JavaScript object representation
     * (without ASN.1 wrapper types). For structs with kind-ed fields,
     * metadata fields like '$<field>.kind' are added.
     * For named choices, returns an object with one property matching the choice name.
     */
    export type SchemaMapJS<T extends Schema> = T extends () => infer U ? U extends Schema ? SchemaMapJS<U> : never : T extends keyof BasicSchemaMapJS ? BasicSchemaMapJS[T] : T extends {
        choice: Schema[];
    } ? SchemaMapJS<T['choice'][number]> : T extends {
        choice: readonly Schema[];
    } ? SchemaMapJS<T['choice'][number]> : T extends {
        choice: infer C extends {
            [name: string]: Schema;
        } | {
            readonly [name: string]: Schema;
        };
    } ? {
        [K in keyof C]: {
            [P in K]: C[K] extends Schema ? SchemaMapJS<C[K]> : unknown;
        };
    }[keyof C] : T extends {
        sequenceOf: Schema;
    } ? SchemaMapJS<T['sequenceOf']>[] : T extends {
        optional: Schema;
    } ? SchemaMapJS<T['optional']> | undefined : T extends bigint ? T : T extends {
        type: 'context';
        kind: infer _U extends ASN1ContextTag['kind'];
        value: number;
        contains: Schema;
    } ? SchemaMapJS<T['contains']> : T extends {
        type: 'oid';
        oid: string;
    } ? T['oid'] : T extends {
        type: 'string';
        kind: 'printable' | 'ia5' | 'utf8';
    } ? string : T extends {
        type: 'date';
        kind: 'general' | 'utc';
    } ? Date : T extends {
        type: 'struct';
        fieldNames: infer F extends readonly string[] | string[];
        contains: infer C extends {
            [name: string]: Schema;
        } | {
            readonly [name: string]: Schema;
        };
    } ? {
        [K in (F extends readonly (infer U)[] ? U : F extends (infer U)[] ? U : never) & string]: K extends keyof C ? (C[K] extends Schema ? SchemaMapJS<C[K]> : unknown) : unknown;
    } : T extends readonly [Schema, ...Schema[]] ? {
        [K in keyof T]: T[K] extends Schema ? SchemaMapJS<T[K]> : never;
    } : unknown;
    export {};
}
/**
 * Helper class to validate ASN.1 values against schemas
 *
 * Some schemas are basic types, others are more complex
 * Basic types are defined as:
 * - {@link ValidateASN1.IsAny}
 * - {@link ValidateASN1.IsUnknown}
 * - {@link ValidateASN1.IsDate}
 * - {@link ValidateASN1.IsAnyDate}
 * - {@link ValidateASN1.IsString}
 * - {@link ValidateASN1.IsAnyString}
 * - {@link ValidateASN1.IsOctetString}
 * - {@link ValidateASN1.IsBitString}
 * - {@link ValidateASN1.IsInteger}
 * - {@link ValidateASN1.IsBoolean}
 * - {@link ValidateASN1.IsOID}
 * - {@link ValidateASN1.IsSet}
 * - {@link ValidateASN1.IsNull}
 *
 * More complex types are defined as:
 * - Choice (named): `{ choice: { name1: schema1, name2: schema2, ... } }` - Converts to `{ name1: value }` or `{ name2: value }`
 * - Choice (legacy array): `{ choice: [ schema1, schema2, ... ] }` - Converts to union type (ambiguous for re-encoding)
 * - Sequence of: `{ sequenceOf: schema }`
 * - Optional: `{ optional: schema }`
 * - Context Tag: `{ type: 'context'; kind: 'implicit' | 'explicit'; contains: schema; value: number }`
 * - OID: `{ type: 'oid'; oid: string }`
 * - String: `{ type: 'string'; kind: 'printable' | 'ia5' | 'utf8' }`
 * - Date: `{ type: 'date'; kind: 'utc' | 'general' }`
 * - Fixed Integer: `bigint` (where the value is the exact integer required)
 * - Sequence: `[ schema1, schema2, ... ]` (a tuple where each item is a schema)
 *
 * - Lazy Schema: `() => schema` (a function that returns a schema, useful for
 *   recursive schemas)
 */
export declare class ValidateASN1<T extends ValidateASN1.Schema> {
    #private;
    /**
     * Validate that the tag is any valid ASN.1 type
     */
    static readonly IsAny: unique symbol;
    /**
     * Validate that the tag is any valid ASN.1 type, but do not
     * attempt to interpret it
     */
    static readonly IsUnknown: unique symbol;
    /**
     * Validate the tag is either a GeneralizedTime or UTCTime
     * depending on the value (i.e. before or after 2050)
     * as per RFC 5280
     */
    static readonly IsDate: unique symbol;
    /**
     * Validate the tag is either a GeneralizedTime or UTCTime
     */
    static readonly IsAnyDate: unique symbol;
    /**
     * Validate that the tag is the least-requisite string type
     * (i.e. PrintableString, IA5String, or UTF8String) for
     * the value
     */
    static readonly IsString: unique symbol;
    /**
     * Validate that the tag is any string type of PrintableString,
     * IA5String, or UTF8String
     */
    static readonly IsAnyString: unique symbol;
    /**
     * Validate that the tag is an OctetString
     */
    static readonly IsOctetString: unique symbol;
    /**
     * Validate that the tag is a BitString
     */
    static readonly IsBitString: unique symbol;
    /**
     * Validate that the tag is an Integer
     */
    static readonly IsInteger: unique symbol;
    /**
     * Validate that the tag is a Boolean
     */
    static readonly IsBoolean: unique symbol;
    /**
     * Validate that the tag is an Object Identifier (OID)
     */
    static readonly IsOID: unique symbol;
    /**
     * Validate that the tag is a Set
     */
    static readonly IsSet: unique symbol;
    /**
     * Validate that the tag is a Null
     */
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
    /**
     * Convert an ASN.1 object to a JavaScript object (including primitives)
     * based on the schema.
     *
     * Converts ASN1 objects to plain JavaScript objects according to the schema:
     * - Structs are converted to plain objects with field names as keys
     * - For ambiguous types (IsAnyString, IsAnyDate), returns ASN.1-like objects: { type: 'string', kind: 'utf8', value: 'text' }
     * - Arrays/sequences are preserved as arrays
     * - Primitive types (bigint, string, boolean, null, Buffer, Date) are preserved
     *
     * Example schema: { type: 'struct', fieldNames: ['name', 'age'], contains: { name: ValidateASN1.IsAnyString, age: ValidateASN1.IsInteger } }
     * Input: { type: 'struct', fieldNames: ['name', 'age'], contains: { name: { type: 'string', kind: 'utf8', value: 'John Doe' }, age: 30n } }
     * Output: { name: { type: 'string', kind: 'utf8', value: 'John Doe' }, age: 30n }
     */
    toJavaScriptObject(input: ASN1AnyJS): ValidateASN1.SchemaMapJS<T>;
    /**
     * Convert a plain JavaScript object back to an ASN.1 object based on the schema.
     *
     * Converts plain JavaScript objects back to ASN1 representation according to the schema:
     * - Plain objects with field names are converted to ASN1Struct
     * - For ambiguous schemas, recognizes ASN.1-like objects: { type: 'string', kind: 'utf8', value: 'text' }
     * - Arrays are preserved as sequences
     * - Primitive types are preserved or wrapped in appropriate ASN1 types
     *
     * Example schema: { type: 'struct', fieldNames: ['name', 'age'], contains: { name: ValidateASN1.IsAnyString, age: ValidateASN1.IsInteger } }
     * Input: { name: { type: 'string', kind: 'utf8', value: 'John Doe' }, age: 30n }
     * Output: { type: 'struct', fieldNames: ['name', 'age'], contains: { name: { type: 'string', kind: 'utf8', value: 'John Doe' }, age: 30n } }
     */
    fromJavaScriptObject(input: unknown): ASN1AnyJS;
    /**
     * Convert an ASN.1 object to a plain JavaScript object based on a schema
     */
    private static toPlainObject;
    /**
     * Convert a plain JavaScript object to an ASN.1 object based on a schema
     */
    private static fromPlainObject;
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
    static readonly isInstance: (obj: any, strict?: boolean) => obj is BufferStorageASN1<string | number | bigint | boolean | Date | Buffer | ASN1AnyJS[] | ASN1OID | ASN1Set | ASN1ExplicitContextTag | ASN1ImplicitContextTag | ASN1BitString | ASN1Date | ASN1String | ASN1Struct | readonly ASN1AnyJS[] | Readonly<Date> | Readonly<Buffer> | Readonly<ASN1OID> | Readonly<ASN1Set> | Readonly<ASN1ExplicitContextTag> | Readonly<ASN1ImplicitContextTag> | Readonly<ASN1BitString> | Readonly<ASN1Date> | Readonly<ASN1String> | Readonly<ASN1Struct> | null | undefined, ValidateASN1.Schema | undefined>;
    constructor(input: T | ArrayBuffer, schema?: S);
    getDER(): ArrayBuffer;
    getDERBuffer(): Buffer;
    getASN1(): S extends undefined ? Mutable<T> : Mutable<ValidateASN1.SchemaMap<Exclude<S, undefined>>>;
}
export { ASN1toJS, JStoASN1, ASN1IntegerToBigInt, ASN1BigIntToBuffer };
