import Options from "../types/options";
/**
 * Compile a tempjs template
 * @param template the template
 * @param data data you need in the template
 * @param opts compile options
 * @returns
 */
declare function compile(template: string, data?: Record<string, unknown>, opts?: Options): string;
/**
 * Compile from a file content
 * @param file file path
 * @param data data used in the file
 * @param opts compile options
 * @returns
 */
declare function compileFromFile(file: string, data?: Record<string, unknown>, opts?: Options): string;
declare const _default: {
    compile: typeof compile;
    compileFromFile: typeof compileFromFile;
};
export { _default as default };
