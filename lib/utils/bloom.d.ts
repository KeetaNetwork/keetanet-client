import { BloomFilter } from 'bloom-filters';
export { BloomFilter };
export declare function serializeBloomFilter(filter: BloomFilter): string;
export declare function serializeBloomFilter(filter: undefined): undefined;
export declare function serializeBloomFilter(filter: BloomFilter | undefined): string | undefined;
export declare function deserializeBloomFilter(input: string): BloomFilter;
