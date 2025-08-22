/**
 * Utility types for static type checking
 */
/**
 * Expects a type to be true, otherwise raises a type error.
 */
export type Expect<T extends true> = T;
/**
 * Checks if two types are equal.
 */
export type Equal<A, B> = A extends B ? (B extends A ? true : false) : false;
