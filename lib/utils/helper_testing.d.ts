import Account from '../account';
import LocalNode from '../node/local';
import { VoteStaple } from '../vote';
import type { Block } from '../block';
import { CertificateBuilder } from './certificate';
import type { Certificate } from './certificate';
export declare const testingNetworkId = 0n;
type NodeConfig = ConstructorParameters<typeof LocalNode>[0];
export declare function canListenOn(ip: string): Promise<boolean>;
export declare function findListenableIP(checkIPs: string[]): Promise<string | null>;
export declare function findListenableBindingForTest(options?: Pick<CreateTestNodeOptions, 'simulatedPhysicalNetwork'>): Promise<{
    ip: string;
    port: number;
}>;
export type CreateTestNodeOptions = {
    name?: string;
    peerNodes?: LocalNode[];
    enableP2P?: boolean;
    p2p?: Partial<NodeConfig['p2p']>;
    ledger?: Partial<NodeConfig['ledger']>;
    initialTrustedAccount?: Account;
    createInitialVoteStaple?: boolean;
    nodeConfig?: Partial<Omit<NodeConfig, 'p2p' | 'ledger' | 'initialTrustedAccount'>>;
    simulatedPhysicalNetwork?: boolean;
};
export interface LocalNodeWithPrivateKey extends LocalNode {
    config: NodeConfig & Required<Pick<NodeConfig, 'ledgerPrivateKey'>>;
}
export declare function createTestNode(account: Account, options?: CreateTestNodeOptions): Promise<LocalNodeWithPrivateKey>;
export declare function getVotesFromSingleNode(node: LocalNode, fromAccount: Account, toAccount: Account, headBlock: Block | null): Promise<VoteStaple>;
/**
 * Build a Certificate with defaults for tests.
 */
export declare function buildTestCertificate(params: NonNullable<ConstructorParameters<typeof CertificateBuilder>[0]> & {
    serial: bigint | number;
    issuer: Account;
    subjectPublicKey: Account;
}): Promise<Certificate>;
/**
 * Run a command and get its output
 */
export declare function run(command: string, stdin: Buffer): {
    output?: string;
    ok: boolean;
};
/**
 * Extract the `.code` property from an unknown thrown value, if present. Useful
 * in tests that assert on Node system error codes (e.g. `ERR_BUFFER_TOO_LARGE`)
 * where the thrown value is a plain system error rather than a typed error class.
 */
export declare function errorCodeOf(error: unknown): unknown;
/**
 * Run a synchronous function and return the `.code` of whatever it throws, or
 * `undefined` if it does not throw.
 */
export declare function caughtErrorCode(fn: () => unknown): unknown;
declare let testMethod: (..._ignore_args: any[]) => any;
declare function getJestPuppeteerSetupFile(skipDefaultOutput?: boolean): string;
export { testMethod, getJestPuppeteerSetupFile };
