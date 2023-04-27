import Options from "../types/options";
import debug from "./debug";

/**
 * Compile a tempjs template
 * @param template the template
 * @param data data you need in the template
 * @param opts compiler options
 * @returns
 */
function compile<O extends Options>(
  template: string,
  data: Record<string, unknown> = {},
  opts: O = {} as O
) {
  return debug<typeof opts>(template, data, opts).generatedFunction();
}

export default compile;
