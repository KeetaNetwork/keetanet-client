import type { AttributeValue, DynamoDB } from '@aws-sdk/client-dynamodb';
/**
 * Execute some code and if a DynamoDB error occurs that is retryable, retry
 * the execution
 */
export declare function dynamoDBExecuteRetryable<T>(code: () => Promise<T>, id: string): ReturnType<typeof code>;
type AttributeValueStringMap = {
    [key: string]: string;
};
type AttributeValueMap = {
    [key: string]: AttributeValue;
};
export declare function dynamoDBGetItem(dynamodb: DynamoDB, table: string, keys: AttributeValueStringMap, consistent?: boolean): Promise<undefined | AttributeValueMap>;
export declare function dynamoDBPaginatedScan(dynamodb: DynamoDB, scanArgs: Parameters<DynamoDB['scan']>[0], code: (page: AttributeValueMap[]) => Promise<any>, ordered?: boolean): Promise<void>;
export declare function getTableState(dynamodb: DynamoDB, table: string): Promise<string>;
export declare function waitForTableToBe(dynamodb: DynamoDB, table: string, state: string): Promise<void>;
export {};
