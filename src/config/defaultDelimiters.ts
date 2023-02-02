import Options from "../../types/options";

const defaultDelimiters: Options["delimiters"] = [
  {
    name: "return",
    description: "Allow user to add variable to the output",
    delimiter: "=",
    fn: function (content) {
      return "$__output += " + content;
    },
  },
  {
    name: "comment",
    description: "Shortcut to turn some code into a comment",
    delimiter: "#",
    fn: function (content) {
      return "/*" + content + "*/";
    },
  },
];

export default defaultDelimiters;
