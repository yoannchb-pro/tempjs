import Options from "../../types/options";
import compileFromFile from "../core/compileFromFile";

const defaultPlugins: Options["plugins"] = [
  {
    name: "include",
    fn: compileFromFile,
  },
];

export default defaultPlugins;
