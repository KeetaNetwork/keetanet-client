import type Vote from '../vote';
export declare class LedgerRequestCache {
    #private;
    addVote(vote: null, contents: Buffer | ArrayBuffer): null;
    addVote(vote: Vote): Vote;
    addVote(vote: Vote | null, contents?: Buffer | ArrayBuffer): Vote | null;
    addVotes(votes: Vote[]): Vote[];
    getVote(contents: Buffer | ArrayBuffer): Vote | null;
    getVote(contents: Buffer | ArrayBuffer, lookupVote: () => Vote): Vote;
    getVote(contents: Buffer | ArrayBuffer, lookupVote: () => Vote | null): Vote | null;
    getVoteByUID(uid: string): Vote | null;
    getVoteByContents(contents: Buffer | ArrayBuffer): Vote | null;
}
export default LedgerRequestCache;
