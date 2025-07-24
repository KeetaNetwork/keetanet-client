import type { APIRequest } from '.';
import KeetaNet from '../lib';
type Vote = InstanceType<typeof KeetaNet['Vote']>;
type BlockHash = InstanceType<typeof KeetaNet['Block']['Hash']>;
declare function createNewVote(request: APIRequest, payload: {
    blocks: string[];
    votes?: string[];
}): Promise<{
    vote: Vote;
}>;
declare function getVotes(request: APIRequest, blockhash: string): Promise<{
    blockhash: BlockHash;
    votes: Vote[] | null;
}>;
declare const _default: {
    _root: {
        POST: typeof createNewVote;
    };
    ':blockhash': {
        GET: typeof getVotes;
    };
};
export default _default;
