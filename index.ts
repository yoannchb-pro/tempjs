type Options = {
  openDelimiter: string;
  closeDelimiter: string;
};

function tempjs(
  template: string,
  data: Record<string, unknown>,
  opts: Options = { openDelimiter: "{{", closeDelimiter: "}}" }
): string {
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
    result.push(
      (text ? text + "+" : "") + `((function(){ ${jsInstruction} })()??"")`
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
