type Options = {
    openDelimiter?: string;
    closeDelimiter?: string;
    context?: unknown;
    async?: boolean;
    minimified?: boolean;
    delimiters?: {
        name: string;
        description: string;
        delimiter: string;
        fn: (content: string, options: Options) => string;
    }[];
    plugins?: {
        name: string;
        description: string;
        fn: Function;
    }[];
};
/**
 * Compile a tempjs template
 * @param template the template
 * @param data data you need in the template
 * @param opts compiler options
 * @returns
 */
declare function compile<O extends Options>(template: string, data?: Record<string, unknown>, opts?: O): string;
/**
 * Compile from a file content
 * @param file file path
 * @param data data used in the file
 * @param opts compile options
 * @returns
 */
declare function compileFromFile<O extends Options>(file: string, data?: Record<string, unknown>, opts?: O): string;
type DebugResult<T extends Options> = {
    template: string;
    options: T;
    data: Record<string, unknown>;
    generatedFunction: T extends Options ? T["async"] extends true ? () => Promise<string> : () => string : never;
    generatedCode: string;
    dataListName: string[];
    dataListValue: unknown[];
    pluginsName: string[];
    pluginsFunctions: Function[];
};
/**
 * Debug a template
 * @param template the template
 * @param data data you need in the template
 * @param opts compiler options
 * @returns
 */
declare function debug<O extends Options>(template: string, data?: Record<string, unknown>, opts?: O): DebugResult<O>;
/**
 * Create function that compile a template
 * @param template the template
 * @param data data you need in the template
 * @param opts compiler options
 * @returns
 */
declare function createFunction<O extends Options>(template: string, data?: Record<string, unknown>, opts?: O): O extends Options ? O["async"] extends true ? () => Promise<string> : () => string : never;
declare const _default: {
    compile: typeof compile;
    compileFromFile: typeof compileFromFile;
    createFunction: typeof createFunction;
    debug: typeof debug;
};
export { _default as default };
