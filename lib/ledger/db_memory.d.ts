import type { Ledger, LedgerConfig } from '.';
import DBSqlite from './db_sqlite';
declare class DBMemory extends DBSqlite {
    init(config: LedgerConfig, ledger: Ledger): void;
}
export default DBMemory;
