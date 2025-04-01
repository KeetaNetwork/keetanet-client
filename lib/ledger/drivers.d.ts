import type { LedgerStorageAPI } from './';
export declare const Drivers: {
    [name: string]: {
        new (): LedgerStorageAPI;
    };
};
export default Drivers;
