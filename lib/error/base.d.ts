interface ValidationOptions {
    type: string;
    codes: string[] | Readonly<string[]>;
}
export declare class KeetaNetErrorBase<CodeType extends string> extends Error {
    static readonly isInstance: (obj: any, strict?: boolean) => obj is KeetaNetErrorBase<string>;
    type: string;
    code: CodeType;
    constructor(code: CodeType, message: string, validation?: ValidationOptions);
    toJSON(): {
        type: string;
        code: CodeType;
        message: string;
    };
}
export {};
