type Options = {
  openDelimiter: string;
  closeDelimiter: string;
  plugins?: {
    name: string;
    delimiter: string;
    fn: (content: string) => string;
  }[];
};

const defaultOptions: Options = {
  openDelimiter: "{{",
  closeDelimiter: "}}",
};

const defaultPlugins: Options["plugins"] = [
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

function tempjs(
  template: string,
  data: Record<string, unknown>,
  opts: Options = defaultOptions
): string {
  //custom plugin to add fatest return
  opts.plugins = (opts.plugins ?? []).concat(defaultPlugins);

  const delimiterRegex = new RegExp(
    opts.openDelimiter + "([\\s\\S]*?)" + opts.closeDelimiter,
    "gi"
  );

  const result: string[] = [];

  const templateText = template.split(
    new RegExp(opts.openDelimiter + "[\\s\\S]*?" + opts.closeDelimiter, "gi")
  );

  let match: RegExpExecArray;
  while ((match = delimiterRegex.exec(template)) !== null) {
    const jsInstruction = match[1];
    const text = JSON.stringify(templateText.shift());

    let finalJsInstruction = jsInstruction;

    const customPlugin = opts.plugins.find((plugin) =>
      jsInstruction.startsWith(plugin.delimiter)
    );

    if (customPlugin) {
      finalJsInstruction = customPlugin.fn(
        jsInstruction.replace(customPlugin.delimiter, "")
      );
    }

    result.push(
      (text ? text + "+" : "") + `((function(){ ${finalJsInstruction} })()??"")`
    );
  }

  const code =
    "return " +
    result.join(" + ") +
    (templateText.length > 0 ? "+" + JSON.stringify(templateText.shift()) : "");
  return new Function(...Object.keys(data), code).apply(
    null,
    Object.values(data)
  );
}

export default tempjs;
