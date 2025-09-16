import type { Response as ExpressResponse } from 'express';
import type { NodeConfig } from './';
import { Node } from './';
import type { BootstrapConfig } from '../bootstrap';
import { BootstrapClient } from '../bootstrap';
export type LocalNodeConfig = Omit<NodeConfig, 'nodeOptions'> & {
    bootstrap?: BootstrapConfig;
    invokeSecret?: string;
    nodeOptions?: {
        listenIP?: string;
        listenPort?: number;
        timingSampleRate?: number;
        noSyncAfterEachRoute?: boolean;
    };
};
export type ApiErrorResponse = {
    error: boolean;
    message: string;
    type?: string | null;
    code?: string | null;
};
type LocalNodeRunOptions = {
    startWebSocketServer?: boolean;
};
export declare class LocalNode extends Node {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is LocalNode;
    config: LocalNodeConfig;
    constructor(config: LocalNodeConfig);
    setCorsHeaders(response: ExpressResponse): void;
    addRoutes(prefix?: string): void;
    get _app(): import("express-serve-static-core").Express;
    run(options?: LocalNodeRunOptions): Promise<void>;
    static main(config: LocalNodeConfig): void;
    stop(): Promise<void>;
    get bootstrap(): BootstrapClient | undefined;
}
export default LocalNode;
