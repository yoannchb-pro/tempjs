import defaultOptions from "../config/defaultOptions";
import defaultDelimiters from "../config/defaultDelimiters";
import defaultPlugins from "../config/defaultPlugins";
import Options from "../../types/options";

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
): string {
  opts = Object.assign(defaultOptions, opts);

  opts.delimiters = (opts.delimiters ?? []).concat(defaultDelimiters);
  opts.plugins = (opts.plugins ?? []).concat(defaultPlugins);

  const delimiterRegex = new RegExp(
    opts.openDelimiter + "([\\s\\S]*?)" + opts.closeDelimiter,
    "gi"
  );

  const result: string[] = [];

  const templateText = template.split(
    new RegExp(opts.openDelimiter + "[\\s\\S]*?" + opts.closeDelimiter, "gi")
  );

  let match: RegExpExecArray;
  while ((match = delimiterRegex.exec(template)) !== null) {
    const jsInstruction = match[1];
    const text = JSON.stringify(templateText.shift());

    let finalJsInstruction = jsInstruction;

    const customDelimiter = opts.delimiters.find((delimiter) =>
      jsInstruction.startsWith(delimiter.delimiter)
    );

    if (customDelimiter) {
      finalJsInstruction = customDelimiter.fn(
        jsInstruction.replace(customDelimiter.delimiter, "")
      );
    }

    result.push(
      (text ? text + "+" : "") + `((function(){ ${finalJsInstruction} })()??"")`
    );
  }

  const code =
    "return " +
    result.join(" + ") +
    (templateText.length > 0 ? "+" + JSON.stringify(templateText.shift()) : "");
  return new Function(
    ...Object.keys(data),
    ...opts.plugins.map((plugin) => plugin.name),
    code
  ).apply(opts.context ?? null, [
    ...Object.values(data),
    ...opts.plugins.map((plugin) => plugin.fn),
  ]);
}

export default compile;
