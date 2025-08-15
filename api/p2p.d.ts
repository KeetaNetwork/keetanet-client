import type { APIRequest } from ".";
declare function handleMessage(request: APIRequest, payload: {
    message: string;
    greeting: object;
}): Promise<{
    success: boolean;
}>;
declare const _default: {
    message: {
        POST: typeof handleMessage;
    };
};
export default _default;
