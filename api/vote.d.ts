import type { APIRequest } from '.';
import KeetaNet from '../lib';
type Vote = InstanceType<typeof KeetaNet['Vote']>;
type VoteJSONOutput = ReturnType<Vote['toJSON']> & {
    '$binary': string;
};
declare function createNewVote(request: APIRequest, payload: {
    blocks: string[];
    votes?: string[];
}): Promise<{
    vote: VoteJSONOutput;
}>;
declare function getVotes(request: APIRequest, blockhash: string): Promise<{
    blockhash: string;
    votes: VoteJSONOutput[] | null;
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
