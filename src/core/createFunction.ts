import defaultDelimiters from "../config/defaultDelimiters";
import defaultOptions from "../config/defaultOptions";
import defaultPlugins from "../config/defaultPlugins";
import Options from "../types/options";

const AsyncFunction = async function () {}.constructor;

/**
 * Create a function that you can call to compile a template
 * @param template the template
 * @param data data you need in the template
 * @param opts compiler options
 * @returns
 */
function createFunction<O extends Options = {}>(
  template: string,
  data: Record<string, unknown> = {},
  opts: O
): O["async"] extends true ? () => Promise<string> : () => string {
  opts = Object.assign(defaultOptions, opts);

  opts.delimiters = (opts.delimiters ?? []).concat(defaultDelimiters);
  opts.plugins = (opts.plugins ?? []).concat(defaultPlugins);

  const generatedCode: string[] = ["let $__output=''"];
  const delimiterRegex = new RegExp(
    `(${opts.openDelimiter}[\\s\\S]*?${opts.closeDelimiter})`,
    "gi"
  );

  for (const text of template.split(delimiterRegex)) {
    const isInstruction = delimiterRegex.test(text);
    if (!isInstruction) {
      generatedCode.push(`$__output += ${JSON.stringify(text)}`);
      continue;
    }

    let jsInstruction = text.substring(
      opts.openDelimiter.length,
      text.length - opts.closeDelimiter.length
    );

    //check for custom delimiter and apply the function
    const customDelimiter = opts.delimiters.find((delimiter) =>
      jsInstruction.startsWith(delimiter.delimiter)
    );
    if (customDelimiter) {
      jsInstruction = customDelimiter.fn(
        jsInstruction.replace(customDelimiter.delimiter, ""),
        opts
      );
    }

    generatedCode.push(jsInstruction);
  }

  generatedCode.push("return $__output");
  const finalCode = generatedCode.join(opts.minimified ? ";" : ";\n");

  const fn = opts.async ? AsyncFunction : Function;
  return fn(
    ...Object.keys(data), //variables name
    ...opts.plugins.map((plugin) => plugin.name), //plugins name
    finalCode
  ).bind(
    opts.context ?? null,
    ...Object.values(data), //variables value
    ...opts.plugins.map((plugin) => plugin.fn) //plugins functions
  );
}

export default createFunction;
