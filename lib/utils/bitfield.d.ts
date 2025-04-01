/**
 * Class to store a BitField
 * Simple array of 0/1 values
 */
export default class BitField {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is BitField;
    constructor(data?: BitField | bigint | number[]);
    set(offset: number | bigint, value: boolean | 0 | 1): void;
    get size(): number;
    get(offset: number | bigint): boolean;
    get bigint(): bigint;
}
