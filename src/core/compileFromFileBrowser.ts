import Options from "../types/options";
import compile from "./compile";
import { readFile, resolveDirname, resolvePath } from "./utils";

const isNode = typeof window === "undefined";

let defaultDirPath: string = "";

/**
 * Compile from a file content
 * @param file file path
 * @param data data used in the file
 * @param opts compile options
 * @returns
 */
async function compileFromFileBrowser<O extends Options>(
  file: string,
  data?: Record<string, unknown>,
  opts?: O
) {
  if (isNode) throw new Error("Please use compileFromFile or include instead");

  if (opts?.root) file = resolvePath(opts.root, file);

  const template = await readFile(resolvePath(defaultDirPath, file));

  if (!defaultDirPath) defaultDirPath = resolveDirname(file);

  const compiled = await compile(template, data, opts);

  defaultDirPath = "";

  return compiled;
}

export default compileFromFileBrowser;
