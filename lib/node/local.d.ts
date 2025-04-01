import type { NodeConfig } from './';
import { Node } from './';
import type { BootstrapConfig } from '../bootstrap';
import { BootstrapClient } from '../bootstrap';
import type { ErrorCode } from '../error';
export type LocalNodeConfig = NodeConfig & {
    bootstrap?: BootstrapConfig;
    invokeSecret?: string;
};
export type ApiErrorResponse = {
    error: boolean;
    message: string;
    type?: string | null;
    code?: ErrorCode | null;
};
type LocalNodeRunOptions = {
    startWebSocketServer?: boolean;
};
export declare class LocalNode extends Node {
    #private;
    static isInstance: (obj: any, strict?: boolean) => obj is LocalNode;
    constructor(config: LocalNodeConfig);
    addRoutes(prefix?: string): void;
    get _app(): import("express-serve-static-core").Express;
    run(options?: LocalNodeRunOptions): Promise<void>;
    static main(config: LocalNodeConfig): void;
    stop(): Promise<void>;
    get bootstrap(): BootstrapClient | undefined;
}
export default LocalNode;
