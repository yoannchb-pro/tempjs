import Options from "../types/options";
import createFunction from "./createFunction";

/**
 * Compile a tempjs template
 * @param template the template
 * @param data data you need in the template
 * @param opts compiler options
 * @returns
 */
function compile<O extends Options = {}>(
  template: string,
  data: Record<string, unknown> = {},
  opts: O
): O["async"] extends true ? Promise<string> : string {
  return createFunction(template, data, opts)() as any;
}

export default compile;
