interface DisposableTimingHandle extends Disposable {
    /**
     * Unique identifier for the timing section
     */
    id: symbol;
    /**
     * End the timing section
     */
    end: () => void;
    /**
     * Dispose of the timing section, ending it
     */
    [Symbol.dispose]: () => void;
}
export declare class RequestTiming {
    #private;
    static defaultLogger: Console;
    log: Console;
    /**
     * Start timing a section of code
     * @param section Name of the section to time -- should be unique within the code base so that it can be identified later
     * @returns A handle which can be used to end the timing section
     */
    startTime(section: string): DisposableTimingHandle;
    endTime(section: symbol | undefined | ReturnType<RequestTiming['startTime']>): void;
    /** @deprecated Use `endTime(section: symbol)` instead */
    endTime(section: string | undefined, deduplicate?: boolean): void;
    /**
     * Run a piece of code and time it, returning the result of the code
     *
     * This takes an optional "timing" parameter which is a timing object
     * if one exists, to update -- if this parameter is undefined no timing
     * will be done.
     *
     * @param section Name of the section to time -- should be unique within the code base so that it can be identified later
     * @param timing Timing object to update, if available
     * @param code The code to run
     * @returns The result of the code
     */
    static runTimer<T>(section: string, timing: RequestTiming | undefined, code: () => Promise<T>): Promise<T>;
    runTimer<T>(section: string, code: () => Promise<T>): Promise<T>;
    private getTiming;
    getAllTiming(): {
        [section: string]: {
            name: string;
            duration: number;
        };
    };
    counter(): number;
}
export default RequestTiming;
