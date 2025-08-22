import type { GenericAccount, IdentifierKeyAlgorithm } from '../lib/account';
import { Account, AccountKeyAlgorithm } from '../lib/account';
import type { AdjustMethod, BlockHash } from '../lib/block';
import { Block } from '../lib/block';
import { type BlockJSONOperations } from '../lib/block/operations';
import type { AccountInfo } from '../lib/ledger/types';
import type { AcceptedPermissionTypes } from '../lib/permissions';
import type { UserClient, Client } from '.';
import { Permissions } from '../lib/permissions';
import { Certificate, CertificateBundle } from '../lib/utils/certificate';
import type { VoteStaple } from '../lib/vote';
type GetPrevFunction = (acct: GenericAccount | string) => Promise<BlockHash | string | null | undefined>;
type PublishOptions = NonNullable<Parameters<Client['transmit']>[1]>;
/** @expand */
interface AccountSignerOptions {
    account: GenericAccount;
    signer: Account;
}
/** @expandType GetPrevFunction */
interface RenderOptions {
    network: bigint;
    getPrevious: GetPrevFunction;
}
/** @expand */
interface BuilderBlockOptions {
    account?: AccountSignerOptions['account'];
    signer?: AccountSignerOptions['signer'];
}
/**
 * Either a UserClient or an object with a client and network
 *
 * @example
 * ```typescript
 * const userClient = UserClient.fromNetwork('test');
 * const config: UserClientOrClientAndNetwork = userClient;
 * const alternativeConfig: UserClientOrClientAndNetwork = {
 *     client: userClient.client,
 *     network: userClient.network
 * };
 * ```
 */
type UserClientOrClientAndNetwork = Pick<UserClient, 'client' | 'network'> | Pick<UserClient, 'client' | 'network' | 'head' | 'publishBuilder'>;
/** @expand */
export type BuilderOptions = Partial<AccountSignerOptions> & Pick<AccountSignerOptions, 'signer'> & {
    /**
     * User Client or object with a client and network
     */
    userClient?: UserClientOrClientAndNetwork;
};
type PerAccount<T> = {
    [accountPubKey: string]: T;
};
interface IdentifierCreateRequest {
    type: IdentifierKeyAlgorithm;
    toResolve?: PendingAccount;
}
type AccountOrPending<Type extends AccountKeyAlgorithm = AccountKeyAlgorithm> = Account<Type> | PendingAccount<Type>;
type TokenOrPending = AccountOrPending<AccountKeyAlgorithm.TOKEN>;
export type ManageCertificateMethod = Extract<BlockJSONOperations, {
    type: typeof Block['OperationType']['MANAGE_CERTIFICATE'];
}>['method'];
export interface PendingOperations {
    receive?: {
        otherParty: AccountOrPending;
        token: TokenOrPending;
        amount: bigint;
        exactReceive: boolean;
        forward?: AccountOrPending;
    }[];
    send?: {
        otherParty: AccountOrPending;
        token: TokenOrPending;
        amount: bigint;
        external?: string;
    }[];
    createIdentifiers?: IdentifierCreateRequest[];
    tokenSupply?: bigint;
    adminModifyBalance?: {
        isSet: boolean;
        amount: bigint;
        token: TokenOrPending;
    }[];
    modifyCertificates?: {
        method: ManageCertificateMethod;
        certificate: Certificate;
        intermediateCertificates: CertificateBundle | null;
    }[];
    permissionsChanges?: PerAccount<PerAccount<{
        method: AdjustMethod;
        permissions: Permissions;
    }[]>>;
    info?: AccountInfo;
    setRep?: Account;
}
export interface PendingOperationsJSON {
    receive?: {
        otherParty: string;
        token: string;
        amount: string;
        exactReceive: boolean;
        forward?: string;
    }[];
    send?: {
        otherParty: string;
        token: string;
        amount: string;
        external?: string;
    }[];
    createIdentifiers?: {
        type: IdentifierKeyAlgorithm;
    }[];
    tokenSupply?: string;
    adminModifyBalance?: {
        isSet: boolean;
        amount: string;
        token: string;
    }[];
    modifyCertificates?: {
        method: ManageCertificateMethod;
        certificate: string;
        intermediateCertificates: string | null;
    }[];
    permissionsChanges?: PerAccount<PerAccount<{
        method: AdjustMethod;
        permissions: [string, string];
    }[]>>;
    info?: Pick<AccountInfo, 'name' | 'description' | 'metadata'> & {
        defaultPermission?: [string, string];
    };
    setRep?: string;
}
export interface AccountSignerOptionsJSON {
    account: string;
    signer: string;
}
/**
 * @expand
 */
export interface AllPendingJSON {
    /**
     * Blocks which have been rendered
     */
    renderedBlocks: string[];
    /**
     * Blocks which have not been rendered
     */
    nonRendered: [AccountSignerOptionsJSON, PendingOperationsJSON][];
}
/** @expand */
export interface ComputeBlocksResponse {
    /**
     * Blocks which have been computed
     */
    blocks: Block[];
}
export declare class PendingAccount<AccountType extends AccountKeyAlgorithm = AccountKeyAlgorithm> {
    #private;
    static IsInstance: (obj: any, strict?: boolean) => obj is PendingAccount<AccountKeyAlgorithm>;
    static GetValue<T extends AccountKeyAlgorithm>(data: AccountOrPending<T>): Account<T>;
    set account(account: Account<AccountType>);
    get account(): Account<AccountType>;
    toJSON(): Account<AccountType>;
}
type AllPending = [AccountSignerOptions, PendingOperations][];
export declare class UserClientBuilder {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is UserClientBuilder;
    static PendingAccount: typeof PendingAccount;
    static FromPendingJSON(options: BuilderOptions, getPrivateKey: (acct: Account) => Promise<Account>, multiAllPending: AllPendingJSON[]): Promise<UserClientBuilder>;
    pendingToJSON(): AllPendingJSON;
    constructor(options: BuilderOptions, previousRender?: ComputeBlocksResponse, previousPending?: AllPending);
    get defaultOptions(): BuilderOptions;
    updateAccounts(accountOptions: Partial<AccountSignerOptions>): void;
    clone(): Promise<UserClientBuilder>;
    publish(options?: PublishOptions): Promise<Awaited<ReturnType<UserClient['publishBuilder']>>>;
    publish(options?: PublishOptions, client?: UserClientOrClientAndNetwork): Promise<Awaited<ReturnType<UserClient['publishBuilder']>>>;
    computeFeeBlock(staple: VoteStaple, options?: BuilderBlockOptions, renderOptions?: RenderOptions | UserClientOrClientAndNetwork): Promise<Block>;
    computeBlocks(): Promise<ComputeBlocksResponse>;
    computeBlocks(client?: UserClientOrClientAndNetwork): Promise<ComputeBlocksResponse>;
    computeBlocks(renderOptions: RenderOptions): Promise<ComputeBlocksResponse>;
    send(recipient: AccountOrPending, amount: bigint, token: TokenOrPending, external?: string, options?: BuilderBlockOptions): void;
    receive(from: AccountOrPending, amount: bigint, token: TokenOrPending, exact?: boolean, forward?: GenericAccount, options?: BuilderBlockOptions): void;
    updatePermissions(principal: GenericAccount, permissions: AcceptedPermissionTypes, target?: GenericAccount, method?: AdjustMethod, options?: BuilderBlockOptions): void;
    modifyCertificate(method: ManageCertificateMethod, certificate: Certificate, intermediateCertificates?: CertificateBundle | null, options?: BuilderBlockOptions): void;
    modifyTokenSupply(amount: bigint, options?: BuilderBlockOptions): void;
    modifyTokenBalance(token: TokenOrPending, amount: bigint, isSet?: boolean, options?: BuilderBlockOptions): void;
    setInfo(info: AccountInfo, options?: BuilderBlockOptions): void;
    setRep(to: Account, options?: BuilderBlockOptions): void;
    generateIdentifier<Algo extends IdentifierKeyAlgorithm>(type: Algo, options?: BuilderBlockOptions): PendingAccount<Algo>;
    get blocks(): Block[];
    get rendered(): boolean;
}
export {};
