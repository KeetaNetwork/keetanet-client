import type { Logger } from '../log';
type HTTPTokenCharacter = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | '!' | '#' | '$' | '%' | '&' | "'" | '*' | '+' | '-' | '.' | '^' | '_' | '`' | '|' | '~';
/**
 * An RFC 9110 token when the name is a string literal.
 * Wide strings stay string and are checked at runtime.
 * Tail-recursive so long literals do not hit TS2589.
 */
type TimingSectionName<T extends string> = string extends T ? T : T extends string ? TimingSectionNameCheck<T, T> : never;
type TimingSectionNameCheck<Remaining extends string, Original extends string> = Remaining extends `${infer First}${infer Rest}` ? string extends First | Rest ? Original : First extends HTTPTokenCharacter ? Rest extends '' ? Original : TimingSectionNameCheck<Rest, Original> : never : never;
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
    static defaultLogger: Logger | '@legacy';
    log: Logger;
    constructor();
    /**
     * Start timing a section of code
     * @param section Name of the section to time -- should be unique within the code base so that it can be identified later
     * @returns A handle which can be used to end the timing section
     */
    startTime<TName extends string>(section: TimingSectionName<TName>): DisposableTimingHandle;
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
    static runTimer<T, TName extends string>(section: TimingSectionName<TName>, timing: RequestTiming | undefined, code: () => Promise<T>): Promise<T>;
    runTimer<T, TName extends string>(section: TimingSectionName<TName>, code: () => Promise<T>): Promise<T>;
    private getTiming;
    getAllTiming(): {
        [section: string]: {
            name: string;
            duration: number;
        };
    };
    /**
     * Builds a Server-Timing header value from finished sections.
     * Returns an empty string when no finished section remains.
     */
    toServerTimingHeader(): string;
    counter(): number;
}
export default RequestTiming;
