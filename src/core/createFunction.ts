import Options from "../types/options";
import debug from "./debug";

/**
 * Create function that compile a template
 * @param template the template
 * @param data data you need in the template
 * @param opts compiler options
 * @returns
 */
function createFunction<O extends Options>(
  template: string,
  data?: Record<string, unknown>,
  opts?: O
) {
  return debug(template, data, opts).generatedFunction;
}

export default createFunction;
