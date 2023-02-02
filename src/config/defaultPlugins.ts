import Options from "../../types/options";
import compileFromFile from "../core/compileFromFile";

const defaultPlugins: Options["plugins"] = [
  {
    name: "include",
    description: "Allow to render other file into the template",
    fn: compileFromFile,
  },
];

export default defaultPlugins;
