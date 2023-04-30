import compileFromFile from "../core/compileFromFile";
import compileFromFileBrowser from "../core/compileFromFileBrowser";
import { escapeHTML } from "../core/utils";
import Options from "../types/options";

const defaultPlugins: Options["plugins"] = [
  {
    name: "include",
    description: "Allow to render other file into the template",
    fn: compileFromFile,
  },
  {
    name: "includeBrowser",
    description: "Allow to render file into the template from the browser",
    fn: compileFromFileBrowser,
  },
  {
    name: "escapeHTML",
    description: "Prevent XSS injection from a string",
    fn: escapeHTML,
  },
];

export default defaultPlugins;
