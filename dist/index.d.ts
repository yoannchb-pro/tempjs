type Options = {
    openDelimiter: string;
    closeDelimiter: string;
    plugins?: {
        name: string;
        delimiter: string;
        fn: (content: string) => string;
    }[];
};
declare function tempjs(template: string, data: Record<string, unknown>, opts?: Options): string;
export { tempjs as default };
