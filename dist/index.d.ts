type Options = {
    openDelimiter: string;
    closeDelimiter: string;
};
declare function tempjs(template: string, data: Record<string, unknown>, opts?: Options): string;
export { tempjs as default };
