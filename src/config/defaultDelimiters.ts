import Options from "../types/options";

const defaultDelimiters: Options["delimiters"] = [
  {
    name: "return",
    description: "Allow user to add variable to the output",
    delimiter: "=",
    fn: function (content) {
      return `$__output += escapeHTML(${content})`;
    },
  },
  {
    name: "return HTML",
    description: "Allow user to add variable to the output with html inside",
    delimiter: "@",
    fn: function (content) {
      return `$__output += ${content}`;
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
  {
    name: "cancel",
    description: "Output the instruction as text with delimiters",
    delimiter: "%",
    fn: function (content, options) {
      return `$__output += escapeHTML("${
        options.openDelimiter
      }${content.replace(/"/gi, '\\"')}${options.closeDelimiter}")`;
    },
  },
];

export default defaultDelimiters;
