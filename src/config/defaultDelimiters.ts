import Options from "../../types/options";

const defaultDelimiters: Options["delimiters"] = [
  {
    name: "return",
    delimiter: "=",
    fn: function (content) {
      return "return " + content;
    },
  },
  {
    name: "comment",
    delimiter: "#",
    fn: function (content) {
      return "/*" + content + "*/";
    },
  },
];

export default defaultDelimiters;
