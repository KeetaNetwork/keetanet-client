import Account from '../account';
import Block from '../block';
import type { VoteStaple } from '../vote';
export interface BaseTokenInfo {
    name: string;
    currencyCode: string;
    decimalPlaces: number;
}
interface BaseGenerationConfig {
    network: bigint;
    initialTrustedAccount: Account;
    voteSerial?: bigint;
    baseTokenInfo?: BaseTokenInfo;
}
interface InitialConfigSupply extends BaseGenerationConfig {
    addSupply: {
        recipient: Account;
        amount: bigint;
        delegate: boolean;
        delegateTo?: Account;
    };
}
type BlocksAlwaysReturn = {
    networkAddress: Block;
    baseToken: Block;
    initialTrustedAccount: Block;
};
type BlocksWithAddSupply = BlocksAlwaysReturn & {
    recipient: Block;
    recipientSupply?: Block;
};
type InitialGenResponse<B extends BlocksAlwaysReturn> = {
    voteStaple: VoteStaple;
    blocks: B;
};
export declare function generateInitialVoteStaple(options: InitialConfigSupply): Promise<InitialGenResponse<BlocksWithAddSupply>>;
export declare function generateInitialVoteStaple(options: BaseGenerationConfig): Promise<InitialGenResponse<BlocksAlwaysReturn>>;
export {};
