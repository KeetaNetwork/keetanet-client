export declare class RequestTiming {
    #private;
    startTime(section: string): void;
    endTime(section: string, deduplicate?: boolean): void;
    runTimer<T>(section: string, code: () => Promise<T>, deduplicate?: boolean): Promise<T>;
    getTiming(section: string): number;
    getAllTiming(): {
        [section: string]: number;
    };
    counter(): number;
}
export default RequestTiming;
