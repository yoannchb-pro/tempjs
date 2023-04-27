import Options from "../types/options";
import compile from "./compile";

const isNode = typeof window === "undefined";
const fs = isNode && require("fs");
const path = isNode && require("path");

let defaultDirPath: string = "";

/**
 * Compile from a file content
 * @param file file path
 * @param data data used in the file
 * @param opts compile options
 * @returns
 */
function compileFromFile<O extends Options>(
  file: string,
  data: Record<string, unknown> = {},
  opts: O = {} as O
) {
  if (!isNode)
    throw new Error("Including file is only available in nodejs environement");

  const template = fs.readFileSync(path.resolve(defaultDirPath, file), "utf-8");

  if (!defaultDirPath) defaultDirPath = path.dirname(file);

  return compile(template, data, opts);
}

export default compileFromFile;
