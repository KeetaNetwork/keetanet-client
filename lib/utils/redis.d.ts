import { RedisClientType } from 'redis';
export { RedisClientType };
/**
 * Single Redis Pool Client/Connection
 */
export declare class RedisClient {
    #private;
    constructor(host: string, password: string, port?: number);
    destroy(): Promise<void>;
    run<T>(code: (conn: RedisClientType) => Promise<T>): Promise<T>;
}
