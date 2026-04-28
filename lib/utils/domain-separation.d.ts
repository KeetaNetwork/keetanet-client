import { ValidateASN1 } from './asn1';
/**
 * Version for Keeta's domain separation namespace schema, encoded as the
 * `INTEGER` field of `namespacePrefixSchema`.
 */
export declare const KeetaNamespaceVersion = 0;
/**
 * Maximum domain separation namespace length in bytes (for strings,
 * this is the UTF-8 byte length, not the character count).
 */
export declare const MaxNamespaceLength = 255;
/**
 * Schema for the namespace prefix:
 *
 * ```asn1
 * NamespacePrefix ::= SEQUENCE {
 *     version   INTEGER,
 *     namespace OCTET STRING,
 *     data      OCTET STRING
 * }
 * ```
 */
export declare const namespacePrefixSchema: readonly [typeof ValidateASN1.IsInteger, typeof ValidateASN1.IsOctetString, typeof ValidateASN1.IsOctetString];
/**
 * Apply the `NamespacePrefix` domain separator to `data`.
 *
 * String namespaces are UTF-8 encoded; ArrayBuffer namespaces are used
 * verbatim. Namespace length MUST be 1-`MaxNamespaceLength` bytes after
 * encoding.
 */
export declare function applyNamespace(namespace: string | ArrayBuffer, data: ArrayBuffer): ArrayBuffer;
