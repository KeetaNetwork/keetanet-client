import type { APIRequest } from '.';
import KeetaNet from '../lib';
type Vote = InstanceType<typeof KeetaNet['Vote']>;
type VoteQuote = InstanceType<typeof KeetaNet['Vote']['Quote']>;
type BlockHash = InstanceType<typeof KeetaNet['Block']['Hash']>;
declare function createNewVote(request: APIRequest, payload: {
    blocks: string[];
    votes?: string[];
    quote?: string;
}): Promise<{
    vote: Vote;
}>;
declare function getVotes(request: APIRequest, blockhash: string): Promise<{
    blockhash: BlockHash;
    votes: Vote[] | null;
}>;
declare function createNewQuote(request: APIRequest, payload: {
    blocks: string[];
}): Promise<{
    quote: VoteQuote;
}>;
declare const _default: {
    _root: {
        POST: typeof createNewVote;
    };
    ':blockhash': {
        GET: typeof getVotes;
    };
    quote: {
        POST: typeof createNewQuote;
    };
};
export default _default;
