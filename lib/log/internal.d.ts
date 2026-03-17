import type { JSONSerializable } from '../utils/conversion';
/**
 * Convert an array of arbitrary values to a string suitable for logging
 *
 * Truncates the resulting string to 300 characters.
 *
 * Limits the depth of object traversal to 10 levels to avoid
 * overly deep recursion.
 */
export declare function convertToLogString(value: unknown[], options?: {
    maxDepth: number;
    maxLength: number;
}): string;
/**
 * Convert a value to a JSON-serializable representation
 *
 * Uses toJSONSerializable for most conversions, with special handling for:
 * - Error objects (extract message and stack)
 * - Functions and symbols (use util.inspect)
 * - Depth limiting to avoid infinite recursion
 */
export declare function convertToJSONSerializable(value: unknown, depthLimit: number): JSONSerializable;
