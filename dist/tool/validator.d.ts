export declare function isObject(data: unknown): data is {
    [key: string]: unknown;
};
export declare function isNull(data: unknown): data is null;
export declare function assertObject(data: unknown, name?: string): asserts data is {
    [key: string]: unknown;
};
export declare function isString(data: unknown): data is string;
export declare function assertString(data: unknown, name?: string): asserts data is string;
export declare function ensureString(data: unknown): string;
export declare function isStringOrIUndefined(data: unknown): data is string | undefined;
export declare function assertStringOrIUndefined(data: unknown, name?: string): asserts data is string | undefined;
export declare function isNumber(data: unknown): data is number;
export declare function assertNumber(data: unknown, name?: string): asserts data is number;
export declare function ensureNumber(data: unknown, name?: string): number;
export declare function ensureBoolean(data: unknown, name?: string): boolean;
export declare function ensureUndefined(data: unknown, name?: string): undefined;
export declare function ensureSetter<ValueType>(data: unknown, name?: string): (value: ValueType) => void;
export declare function isBoolean(data: unknown): data is boolean;
export declare function isUndefined(data: unknown): data is undefined;
export declare function assertBoolean(data: unknown, name?: string): asserts data is boolean;
export declare function assertUndefined(data: unknown, name?: string): asserts data is undefined;
export declare function assertFunction(data: unknown, name?: string): asserts data is () => void;
export declare function isArrayBuffer(data: unknown): data is ArrayBuffer;
export declare function isStringArray(data: unknown): data is string[];
export declare function assertStringArray(data: unknown, name?: string): asserts data is string[];
export declare function isNumberArray(data: unknown): data is number[];
export declare function assertNumberArray(data: unknown, name?: string): asserts data is number[];
export declare function isArray(data: unknown): data is unknown[];
export declare function assertArray(data: unknown, name?: string): asserts data is unknown[];
export declare function assertVector2Array(data: unknown, suffix?: string): asserts data is Array<[number, number]>;
export declare function assertVector3Array(data: unknown, suffix?: string): asserts data is Array<[number, number, number]>;
export declare function assertVector4Array(data: unknown, suffix?: string): asserts data is [number, number, number, number];
export declare function assertVector2(data: unknown, suffix?: string): asserts data is [number, number];
export declare function isVector3(data: unknown): data is [number, number, number];
export declare function assertVector3(data: unknown, suffix?: string): asserts data is [number, number, number];
export declare function isVector4(data: unknown): data is [number, number, number, number];
export declare function assertVector4(data: unknown, suffix?: string): asserts data is [number, number, number, number];
//# sourceMappingURL=validator.d.ts.map