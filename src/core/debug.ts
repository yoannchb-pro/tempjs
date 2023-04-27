import defaultDelimiters from "../config/defaultDelimiters";
import defaultOptions from "../config/defaultOptions";
import defaultPlugins from "../config/defaultPlugins";
import Options from "../types/options";

type DebugResult<T extends Options> = {
  template: string;
  options: T;
  data: Record<string, unknown>;
  generatedFunction: T extends Options
    ? T["async"] extends true
      ? () => Promise<string>
      : () => string
    : never;
  generatedCode: string;
  dataListName: string[];
  dataListValue: unknown[];
  pluginsName: string[];
  pluginsFunctions: Function[];
};

const AsyncFunction = async function () {}.constructor;

/**
 * Debug a template
 * @param template the template
 * @param data data you need in the template
 * @param opts compiler options
 * @returns
 */
function debug<O extends Options>(
  template: string,
  data: Record<string, unknown> = {},
  opts: O = {} as O
) {
  opts = Object.assign(defaultOptions, opts);
  opts.delimiters = (opts.delimiters ?? []).concat(defaultDelimiters);
  opts.plugins = (opts.plugins ?? []).concat(defaultPlugins);

  const generatedCode: string[] = ["let $__output=''"];
  const delimiterRegex = new RegExp(
    `(\\n?[\\s\\t]*${opts.openDelimiter}_?[\\s\\S]*?_?${opts.closeDelimiter}[\\s\\t]*\\n?)`,
    "gi"
  );

  for (const text of template.split(delimiterRegex)) {
    const isInstruction = delimiterRegex.test(text);
    if (!isInstruction) {
      generatedCode.push(`$__output += ${JSON.stringify(text)}`);
      continue;
    }

    const startWhiteSpace = text.match(/^\n?[\s\t]*/g)?.[0];
    const endWhiteSpace = text.match(/[\s\t]*\n?$/g)?.[0];
    let jsInstruction = text.substring(
      opts.openDelimiter.length + (startWhiteSpace.length ?? 0),
      text.length - (opts.closeDelimiter.length + (endWhiteSpace.length ?? 0))
    );

    //check if we remove white spaces or not
    const removeStartWhiteSpace = text.startsWith("_");
    const removeEndWhiteSpace = text.endsWith("_");
    if (removeStartWhiteSpace) {
      jsInstruction = jsInstruction.substring(1);
    } else {
      generatedCode.push(`$__output += ${JSON.stringify(startWhiteSpace)}`);
    }
    if (removeEndWhiteSpace) {
      jsInstruction = jsInstruction.substring(0, jsInstruction.length - 1);
    }

    //check for custom delimiter and apply the function
    const customDelimiter = opts.delimiters.find((delimiter) =>
      jsInstruction.startsWith(delimiter.delimiter)
    );
    if (customDelimiter) {
      jsInstruction = customDelimiter.fn(jsInstruction.substring(1), opts);
    }

    generatedCode.push(jsInstruction);

    if (!removeEndWhiteSpace)
      generatedCode.push(`$__output += ${JSON.stringify(endWhiteSpace)}`);
  }

  generatedCode.push("return $__output");
  const finalCode = generatedCode.join(opts.minimified ? ";" : ";\n");

  const fn = opts.async ? AsyncFunction : Function;

  const dataListName = Object.keys(data);
  const dataListValue = Object.values(data);
  const pluginsName = opts.plugins.map((plugin) => plugin.name);
  const pluginsFunctions = opts.plugins.map((plugin) => plugin.fn);
  const generatedFunction = fn(...dataListName, ...pluginsName, finalCode).bind(
    opts.context ?? null,
    ...dataListValue,
    ...pluginsFunctions
  );
  return {
    template,
    data,
    options: opts,
    generatedFunction,
    generatedCode: finalCode,
    dataListName,
    dataListValue,
    pluginsName,
    pluginsFunctions,
  } as DebugResult<O>;
}

export default debug;
