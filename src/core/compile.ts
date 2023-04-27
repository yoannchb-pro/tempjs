import defaultOptions from "../config/defaultOptions";
import defaultDelimiters from "../config/defaultDelimiters";
import defaultPlugins from "../config/defaultPlugins";
import Options from "../types/options";

const AsyncFunction = async function () {}.constructor;

/**
 * Compile a tempjs template
 * @param template the template
 * @param data data you need in the template
 * @param opts compile options
 * @returns
 */
function compile(
  template: string,
  data: Record<string, unknown> = {},
  opts: Options = {}
): string | Promise<string> {
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
    // .replace(/\n/gi, "");

    //check for custom delimiter and apply the function
    const customDelimiter = opts.delimiters.find((delimiter) =>
      jsInstruction.startsWith(delimiter.delimiter)
    );
    if (customDelimiter) {
      jsInstruction = customDelimiter.fn(
        jsInstruction.replace(customDelimiter.delimiter, "")
      );
    }

    generatedCode.push(jsInstruction);
  }

  generatedCode.push("return $__output");
  const finalCode = generatedCode.join(";");

  const fn = opts.async ? AsyncFunction : Function;
  return fn(
    ...Object.keys(data), //variables name
    ...opts.plugins.map((plugin) => plugin.name), //plugins name
    finalCode
  ).apply(opts.context ?? null, [
    ...Object.values(data), //variables value
    ...opts.plugins.map((plugin) => plugin.fn), //plugins functions
    finalCode,
  ]);
}

export default compile;
