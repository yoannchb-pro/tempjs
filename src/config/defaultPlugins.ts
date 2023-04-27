import compileFromFile from "../core/compileFromFile";
import Options from "../types/options";

const defaultPlugins: Options["plugins"] = [
  {
    name: "include",
    description: "Allow to render other file into the template",
    fn: compileFromFile,
  },
];

export default defaultPlugins;
