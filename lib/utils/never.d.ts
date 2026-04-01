/**
 * Asserts that the provided value is never.
 *
 * This is useful for static type checking to ensure that all possible values
 * are handled.
 */
export declare function assertNever(value: never): never;
/**
 * Asserts that the provided type is never.
 */
export type AssertNever<T extends never> = T;
