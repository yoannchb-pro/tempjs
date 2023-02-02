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

  //regex for js code
  const delimiterRegex = new RegExp(
    opts.openDelimiter + "([\\s\\S]*?)" + opts.closeDelimiter,
    "gi"
  );

  //final generated code to be executed
  const generatedCode: string[] = ["let $__output=''"];

  //split the text by the js instruction
  const templateText = template.split(
    new RegExp(opts.openDelimiter + "[\\s\\S]*?" + opts.closeDelimiter, "gi")
  );

  let match: RegExpExecArray;
  while ((match = delimiterRegex.exec(template)) !== null) {
    const jsInstruction = match[1]; //js instruction
    const originalText = templateText.shift(); //text
    const text = JSON.stringify(originalText); //text as string for the code

    let finalJsInstruction = jsInstruction;

    //check is custom delimiter is present
    const customDelimiter = opts.delimiters.find((delimiter) =>
      jsInstruction.startsWith(delimiter.delimiter)
    );

    //if there is a custom delimiter we modify the js instruction
    if (customDelimiter) {
      finalJsInstruction = customDelimiter.fn(
        jsInstruction.replace(customDelimiter.delimiter, "")
      );
    }

    //check order (we put the text before or after the js instruction ?)
    if (
      text &&
      template.indexOf(originalText) < template.indexOf(jsInstruction)
    ) {
      generatedCode.push(`$__output += ${text}`);
      generatedCode.push(finalJsInstruction);
    } else if (text) {
      generatedCode.push(finalJsInstruction);
      generatedCode.push(`$__output += ${text}`);
    } else {
      generatedCode.push(finalJsInstruction);
    }
  }

  //if we dont finish the template by an instruction some text left
  if (templateText.length > 0)
    generatedCode.push(`$__output += ${JSON.stringify(templateText.shift())}`);
  generatedCode.push("return $__output");

  //generate the function to evaluate with plugins, data and context
  return new Function(
    ...Object.keys(data),
    ...opts.plugins.map((plugin) => plugin.name),
    generatedCode.join(";")
  ).apply(opts.context ?? null, [
    ...Object.values(data),
    ...opts.plugins.map((plugin) => plugin.fn),
  ]);
}

export default compile;
